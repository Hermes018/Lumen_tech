/**
 * @purpose Regression test suite for Sonnet Two-Key Security Review remediations (Critical 1, Critical 2, and Medium findings)
 */

import { createHash } from 'node:crypto';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SslcommerzProvider, localVerifySign } from '../commerce/sslcommerz';
import {
  executeRefund,
  evaluateRefundEligibility,
} from '../commerce/refunds';
import {
  grantEntitlement,
  getUserEntitlements,
  getLedgerBalance,
  resetEntitlementLedgerState,
} from '../commerce/entitlements';
import { createOrder, fulfillOrder } from '../commerce/checkout';
import type { Actor } from '../auth/policy';

describe('Sonnet Two-Key Review Fixes Regression Suite', () => {
  const origNodeEnv = process.env.NODE_ENV;
  const origSandbox = process.env.SSLCOMMERZ_SANDBOX;

  const financeActor: Actor = {
    id: 'usr-finance-01',
    roles: ['finance'],
    orgIds: [],
    hasTwoFactorEnabled: true,
    twoFactorVerified: true,
  };

  beforeEach(() => {
    resetEntitlementLedgerState();
  });

  afterEach(() => {
    process.env.NODE_ENV = origNodeEnv;
    process.env.SSLCOMMERZ_SANDBOX = origSandbox;
    vi.restoreAllMocks();
  });

  describe('Fix Critical 1: SSLCommerz Sandbox Bypass & Fallback Gating', () => {
    it('in production, verifyPayment rejects SANDBOX_VAL_* without calling remote API', async () => {
      process.env.NODE_ENV = 'production';
      process.env.SSLCOMMERZ_SANDBOX = 'false';

      const fetchSpy = vi.spyOn(globalThis, 'fetch');
      const provider = new SslcommerzProvider({
        storeId: 'test_store',
        storePassword: 'test_password',
        isLive: false,
      });

      const result = await provider.verifyPayment({
        providerRef: 'LA_PROD_TEST_01',
        hint: { val_id: 'SANDBOX_VAL_12345', amount: '3990.00', currency: 'BDT' },
        expected: { amountMinor: 399000, currency: 'BDT' },
      });

      expect(result.status).toBe('failed');
      expect(result.failureReason).toBe('sandbox_val_id_forbidden_in_production');
      expect(fetchSpy).not.toHaveBeenCalled();
    });

    it('in test environment with SSLCOMMERZ_SANDBOX, SANDBOX_VAL_* is handled in sandbox mode', async () => {
      process.env.NODE_ENV = 'test';
      const provider = new SslcommerzProvider({
        storeId: 'test_store',
        storePassword: 'test_password',
        isLive: false,
      });

      const result = await provider.verifyPayment({
        providerRef: 'LA_SANDBOX_01',
        hint: { val_id: 'SANDBOX_VAL_99999', amount: '3990.00', currency: 'BDT' },
        expected: { amountMinor: 399000, currency: 'BDT' },
      });

      expect(result.status).toBe('paid');
      expect(result.amountMinor).toBe(399000);
    });

    it('in production, createCheckout throws ProviderTransientError when gateway is unavailable', async () => {
      process.env.NODE_ENV = 'production';
      const fetchSpy = vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network offline'));

      const provider = new SslcommerzProvider({
        storeId: 'live_store',
        storePassword: 'live_password',
        isLive: true,
      });

      await expect(
        provider.createCheckout({
          orderId: 'ord-prod-fail',
          paymentId: 'pay-prod-fail',
          providerRef: 'LA_PROD_FAIL',
          amountMinor: 399000,
          currency: 'BDT',
          customer: {
            userId: 'usr-1',
            name: 'Prod User',
            email: 'prod@example.com',
            country: 'BD',
          },
          lines: [{ orderItemId: '1', title: 'Course', category: 'Education', unitAmountMinor: 399000, quantity: 1 }],
          returnUrls: { success: 'https://lumen.academy/success', fail: 'https://lumen.academy/fail', cancel: 'https://lumen.academy/cancel' },
          webhookUrl: 'https://lumen.academy/api/webhooks/sslcommerz',
        })
      ).rejects.toThrow(/SSLCommerz gateway unavailable/i);

      fetchSpy.mockRestore();
    });
  });

  describe('Fix Critical 2: Refund Order of Operations & Untouched Ineligible State', () => {
    it('calling executeRefund on an ineligible order does NOT revoke entitlement or zero credits, and retry still fails', async () => {
      const studentId = 'usr-student-ineligible';
      const now = new Date('2026-06-01T12:00:00Z');

      // 1. Create order and fulfill it
      const { order } = await createOrder({
        userId: studentId,
        productSlug: 'gre-core-pass-3m',
        customer: { userId: studentId, name: 'Student', email: 'student@example.com', country: 'BD' },
        appUrl: 'https://app.lumen.academy',
        now,
      });

      const fulfillment = await fulfillOrder(order.providerRef, 'SANDBOX_VAL_REG_01');
      expect(fulfillment.success).toBe(true);

      const entsBefore = getUserEntitlements(studentId, now);
      expect(entsBefore.length).toBe(1);
      expect(entsBefore[0]?.isActive).toBe(true);
      const creditsBefore = getLedgerBalance(studentId, 'ai_credit', now);
      expect(creditsBefore).toBeGreaterThan(0);

      // 2. Attempt refund 10 days later (exceeds 7-day window -> ineligible)
      const tenDaysLater = new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000);

      expect(() =>
        executeRefund(financeActor, {
          orderId: order.id,
          reason: 'Changed mind after 10 days',
          now: tenDaysLater,
        })
      ).toThrow(/not eligible for refund: exceeded_7d_refund_window/);

      // Assert entitlement remains active and credits are NOT zeroed
      const entsAfterFail = getUserEntitlements(studentId, now);
      expect(entsAfterFail.length).toBe(1);
      expect(entsAfterFail[0]?.isActive).toBe(true);
      expect(getLedgerBalance(studentId, 'ai_credit', now)).toBe(creditsBefore);

      // 3. Retry must also fail cleanly because order was never refunded and state was not corrupted
      expect(() =>
        executeRefund(financeActor, {
          orderId: order.id,
          reason: 'Second attempt after 10 days',
          now: tenDaysLater,
        })
      ).toThrow(/not eligible for refund: exceeded_7d_refund_window/);

      // State remains completely untouched
      expect(getUserEntitlements(studentId, now)[0]?.isActive).toBe(true);
      expect(getLedgerBalance(studentId, 'ai_credit', now)).toBe(creditsBefore);
    });

    it('rejects refund if net refundable amount is <= 0 after deducting consumed AI credits', () => {
      // 3,990 BDT course where user consumed 40 AI credits (at 100 BDT each = 4,000 BDT deduction)
      const result = evaluateRefundEligibility({
        productSlug: 'gre-core-pass-3m',
        amountPaidMinor: 399000,
        paidAt: new Date(),
        aiCreditsUsed: 40,
        aiCreditsIncluded: 300, // 40/300 = 13.3% (< 20%)
        unitAiCreditValueMinor: 10000, // 100.00 BDT
      });

      expect(result.eligible).toBe(false);
      expect(result.refundableMinor).toBe(0);
      expect(result.reasons).toContain('net_refundable_amount_zero_or_negative_after_credit_deduction');
    });

    it('rejects refund if order status is already refunded or not paid', async () => {
      const studentId = 'usr-student-status-check';
      const now = new Date('2026-06-01T12:00:00Z');

      const { order } = await createOrder({
        userId: studentId,
        productSlug: 'gre-core-pass-3m',
        customer: { userId: studentId, name: 'Student', email: 'status@example.com', country: 'BD' },
        appUrl: 'https://app.lumen.academy',
        now,
      });

      // Status is 'pending', not 'paid'
      expect(() =>
        executeRefund(financeActor, {
          orderId: order.id,
          reason: 'Refund pending order',
          now,
        })
      ).toThrow(/cannot be refunded because its status is 'pending'/);
    });
  });

  describe('Fix Medium Findings: Constant-Time Comparison & Scoped Idempotency', () => {
    it('constant-time signature check rejects mismatched lengths and invalid hashes', () => {
      const storePasswd = 'my_secret_store_password';
      const payload: Record<string, string> = {
        tran_id: 'TRAN123',
        val_id: 'VAL456',
        amount: '100.00',
        card_type: 'VISA',
        store_passwd: storePasswd,
        verify_key: 'amount,card_type,tran_id,val_id',
      };

      // 1. Mismatched length signature string
      const shortSign = { ...payload, verify_sign: 'abcdef' };
      expect(localVerifySign(shortSign, storePasswd)).toBe(false);

      // 2. Same length (32 chars md5 hex) but incorrect hash
      const wrongSign = { ...payload, verify_sign: '0123456789abcdef0123456789abcdef' };
      expect(localVerifySign(wrongSign, storePasswd)).toBe(false);

      // 3. Compute correct signature and verify it passes
      // MD5(amount=100.00&card_type=VISA&store_passwd=...&tran_id=TRAN123&val_id=VAL456)
      const md5Passwd = createHash('md5').update(storePasswd).digest('hex');
      const parts = [
        'amount=100.00',
        'card_type=VISA',
        `store_passwd=${md5Passwd}`,
        'tran_id=TRAN123',
        'val_id=VAL456',
      ].sort();
      const validHash = createHash('md5').update(parts.join('&')).digest('hex');

      const validPayload = { ...payload, verify_sign: validHash };
      expect(localVerifySign(validPayload, storePasswd)).toBe(true);
    });

    it('scopes idempotency keys per user so callers with identical keys do not collide', () => {
      const userA = 'usr-idemp-a';
      const userB = 'usr-idemp-b';
      const sharedKey = 'common-action-idemp-key';

      const entA = grantEntitlement(userA, 'ielts-academic-core', 'purchase', new Date(), {
        idempotencyKey: sharedKey,
      });

      const entB = grantEntitlement(userB, 'ielts-academic-core', 'purchase', new Date(), {
        idempotencyKey: sharedKey,
      });

      // Both users should have distinct entitlement records despite identical idempotency keys
      expect(entA.userId).toBe(userA);
      expect(entB.userId).toBe(userB);
      expect(entA.id).not.toBe(entB.id);

      // Replay for user A returns entA
      const entAReplay = grantEntitlement(userA, 'ielts-academic-core', 'purchase', new Date(), {
        idempotencyKey: sharedKey,
      });
      expect(entAReplay.id).toBe(entA.id);
    });
  });
});
