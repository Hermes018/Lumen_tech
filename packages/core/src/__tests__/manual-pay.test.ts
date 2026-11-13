/**
 * @purpose Unit tests for Manual bKash/Nagad fallback gateway, TrxID submission, and Staff 2FA approval (P1-41)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  submitManualPayment,
  approveManualPayment,
  rejectManualPayment,
  isValidBdPhoneNumber,
  isValidTrxId,
  createOrder,
  getOrderByRef,
  resetEntitlementLedgerState,
  getUserEntitlements,
  AuthorizationError,
  TwoFactorRequiredError,
  type Actor,
} from '../index';

describe('Manual Payment Gateway & Ledger (P1-41)', () => {
  beforeEach(() => {
    resetEntitlementLedgerState();
  });

  describe('Validation Helpers', () => {
    it('validates Bangladesh mobile numbers correctly', () => {
      expect(isValidBdPhoneNumber('01712345678')).toBe(true);
      expect(isValidBdPhoneNumber('01899999999')).toBe(true);
      expect(isValidBdPhoneNumber('01911223344')).toBe(true);
      expect(isValidBdPhoneNumber('+8801712345678')).toBe(true);

      // Invalid
      expect(isValidBdPhoneNumber('01212345678')).toBe(false); // invalid operator 012
      expect(isValidBdPhoneNumber('0171234567')).toBe(false);  // 10 digits
      expect(isValidBdPhoneNumber('017123456789')).toBe(false); // 12 digits
      expect(isValidBdPhoneNumber('abcdefghijk')).toBe(false);
    });

    it('validates bKash / Nagad Transaction IDs correctly', () => {
      expect(isValidTrxId('BL54A92K1M')).toBe(true);
      expect(isValidTrxId('9K1M8247')).toBe(true);
      expect(isValidTrxId('NAGAD12345')).toBe(true);

      // Invalid
      expect(isValidTrxId('short')).toBe(false); // < 6 chars
      expect(isValidTrxId('BL54-A92K1M')).toBe(false); // contains hyphen
      expect(isValidTrxId('')).toBe(false);
    });
  });

  describe('Submission & Approval Pipeline', () => {
    it('successfully submits manual bKash payment and transitions order to pending_verification', async () => {
      const { order } = await createOrder({
        userId: 'usr_manual_test_1',
        productSlug: 'ielts-academic-plus',
        customer: {
          userId: 'usr_manual_test_1',
          name: 'Manual Test User',
          email: 'test@example.com',
          phoneE164: '01712345678',
        },
        appUrl: 'http://localhost:3000',
      });

      expect(order.status).toBe('pending');

      const updated = submitManualPayment(
        order.id,
        'bkash',
        'BL54A92K1M',
        '01712345678'
      );

      expect(updated.status).toBe('pending_verification');
      expect(updated.manualPayment).toBeDefined();
      expect(updated.manualPayment?.method).toBe('bkash');
      expect(updated.manualPayment?.trxId).toBe('BL54A92K1M');
      expect(updated.manualPayment?.senderNumber).toBe('01712345678');
      expect(updated.manualPayment?.submittedAt).toBeDefined();
    });

    it('rejects submission with invalid phone number or invalid TrxID', async () => {
      const { order } = await createOrder({
        userId: 'usr_manual_test_2',
        productSlug: 'ielts-academic-plus',
        customer: {
          userId: 'usr_manual_test_2',
          name: 'Manual User 2',
          email: 'test2@example.com',
          phoneE164: '01712345678',
        },
        appUrl: 'http://localhost:3000',
      });

      expect(() =>
        submitManualPayment(order.id, 'bkash', 'bad', '01712345678')
      ).toThrow('Invalid Transaction ID');

      expect(() =>
        submitManualPayment(order.id, 'nagad', 'NG98765432', '12345')
      ).toThrow('Invalid Bangladesh phone number');
    });

    it('approves manual payment when executed by staff with finance:write and 2FA, fulfilling entitlements', async () => {
      const userId = 'usr_manual_student_3';
      const { order } = await createOrder({
        userId,
        productSlug: 'ielts-academic-plus',
        customer: {
          userId,
          name: 'Student Three',
          email: 'student3@example.com',
          phoneE164: '01899112233',
        },
        appUrl: 'http://localhost:3000',
      });

      submitManualPayment(order.id, 'nagad', 'NGD98234KL', '01899112233');

      const financeStaffActor: Actor = {
        id: 'staff_finance_ayman',
        roles: ['finance'],
        hasTwoFactorEnabled: true,
      };

      const result = await approveManualPayment(
        order.id,
        financeStaffActor.id,
        financeStaffActor
      );

      expect(result.success).toBe(true);
      expect(result.order.status).toBe('paid');
      expect(result.order.valId).toBe('MANUAL_NGD98234KL');
      expect(result.order.entitlementId).toBeDefined();
      expect(result.order.manualPayment?.approvedByStaffId).toBe('staff_finance_ayman');

      // Verify entitlement was authoritatively granted to the student
      const entitlements = getUserEntitlements(userId);
      expect(entitlements.length).toBeGreaterThan(0);
      expect(entitlements[0]?.productSlug).toBe('ielts-academic-plus');

      // Idempotency: re-approving returns idempotent replay without error
      const replay = await approveManualPayment(
        order.id,
        financeStaffActor.id,
        financeStaffActor
      );
      expect(replay.success).toBe(true);
      expect(replay.idempotentReplay).toBe(true);
    });

    it('blocks approval if actor lacks 2FA (TwoFactorRequiredError)', async () => {
      const { order } = await createOrder({
        userId: 'usr_manual_student_4',
        productSlug: 'gre-quant-mastery',
        customer: {
          userId: 'usr_manual_student_4',
          name: 'Student Four',
          email: 'student4@example.com',
          phoneE164: '01899112233',
        },
        appUrl: 'http://localhost:3000',
      });

      submitManualPayment(order.id, 'bkash', 'BKASH99281', '01899112233');

      const financeWithout2FA: Actor = {
        id: 'staff_no_2fa',
        roles: ['finance'],
        hasTwoFactorEnabled: false, // 2FA missing
      };

      await expect(
        approveManualPayment(order.id, financeWithout2FA.id, financeWithout2FA)
      ).rejects.toThrow(TwoFactorRequiredError);
    });

    it('blocks approval if actor lacks finance:write (AuthorizationError)', async () => {
      const { order } = await createOrder({
        userId: 'usr_manual_student_5',
        productSlug: 'gre-quant-mastery',
        customer: {
          userId: 'usr_manual_student_5',
          name: 'Student Five',
          email: 'student5@example.com',
          phoneE164: '01899112233',
        },
        appUrl: 'http://localhost:3000',
      });

      submitManualPayment(order.id, 'bkash', 'BKASH77112', '01899112233');

      const studentActor: Actor = {
        id: 'student_attacker',
        roles: ['student'],
        hasTwoFactorEnabled: true,
      };

      await expect(
        approveManualPayment(order.id, studentActor.id, studentActor)
      ).rejects.toThrow(AuthorizationError);
    });

    it('allows staff to reject a fraudulent or unverified manual payment submission', async () => {
      const { order } = await createOrder({
        userId: 'usr_fraud_6',
        productSlug: 'gre-quant-mastery',
        customer: {
          userId: 'usr_fraud_6',
          name: 'Fraud Attempt',
          email: 'fraud@example.com',
          phoneE164: '01711002233',
        },
        appUrl: 'http://localhost:3000',
      });

      submitManualPayment(order.id, 'bkash', 'FAKE999999', '01711002233');

      const financeActor: Actor = {
        id: 'staff_finance_ayman',
        roles: ['finance'],
        hasTwoFactorEnabled: true,
      };

      const result = await rejectManualPayment(
        order.id,
        financeActor.id,
        'TrxID not found on bKash merchant statement',
        financeActor
      );

      expect(result.success).toBe(true);
      expect(result.order.status).toBe('failed');
      expect(result.order.manualPayment?.rejectionReason).toContain('not found');
      expect(result.order.manualPayment?.rejectedByStaffId).toBe('staff_finance_ayman');
    });
  });
});
