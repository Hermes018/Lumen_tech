/** @purpose Unit tests for Finance Ops: Target Promise, Progress Promise guarantee claims, and Mushak 6.3 CSV formula-injection safety (docs/10 §6, docs/17 §2.2a) */

import { describe, it, expect } from 'vitest';
import {
  evaluateTargetPromiseClaim,
  evaluateProgressPromiseClaim,
  sanitizeCsvField,
  generateMushak63Csv,
  generateInstructorPayoutSummary,
  type MushakInvoiceRecord,
  type InstructorPayoutRecord,
} from '../commerce/finance-ops';
import { type Actor, AuthorizationError, TwoFactorRequiredError } from '../auth/policy';

describe('Finance Operations & Guarantee Claims', () => {
  describe('Target Promise (Plus Tier)', () => {
    it('approves eligible Plus learner who completed >= 4 mocks, >= 70% study plan, sat test within 60 days, and uploaded TRF', () => {
      const result = evaluateTargetPromiseClaim({
        userId: 'usr_student_1',
        tier: 'plus',
        fullMocksCount: 5,
        studyPlanCompletionPercent: 75,
        daysSinceAccessEnd: 45,
        trfUploaded: true,
        targetMet: false,
      });

      expect(result.eligible).toBe(true);
      expect(result.remedy).toBe('90_day_extension');
      expect(result.extensionDays).toBe(90);
      expect(result.cashRefund).toBe(false);
      expect(result.creditsRefilled).toBe(false);
    });

    it('rejects if learner is not on Plus tier', () => {
      const result = evaluateTargetPromiseClaim({
        userId: 'usr_student_2',
        tier: 'core',
        fullMocksCount: 4,
        studyPlanCompletionPercent: 80,
        daysSinceAccessEnd: 30,
        trfUploaded: true,
        targetMet: false,
      });

      expect(result.eligible).toBe(false);
      expect(result.reasons).toEqual(
        expect.arrayContaining([expect.stringContaining('exclusive to Plus tier')])
      );
    });

    it('rejects if full mocks < 4 or study-plan completion < 70%', () => {
      const result = evaluateTargetPromiseClaim({
        userId: 'usr_student_3',
        tier: 'plus',
        fullMocksCount: 3,
        studyPlanCompletionPercent: 65,
        daysSinceAccessEnd: 30,
        trfUploaded: true,
        targetMet: false,
      });

      expect(result.eligible).toBe(false);
      expect(result.reasons).toEqual(
        expect.arrayContaining([
          expect.stringContaining('Minimum 4 full mocks required'),
          expect.stringContaining('Minimum 70% study-plan completion required'),
        ])
      );
    });

    it('rejects if official test was taken > 60 days after access end or TRF missing', () => {
      const result = evaluateTargetPromiseClaim({
        userId: 'usr_student_4',
        tier: 'plus',
        fullMocksCount: 4,
        studyPlanCompletionPercent: 70,
        daysSinceAccessEnd: 65,
        trfUploaded: false,
        targetMet: false,
      });

      expect(result.eligible).toBe(false);
      expect(result.reasons).toEqual(
        expect.arrayContaining([
          expect.stringContaining('within 60 days of course access end'),
          expect.stringContaining('TRF) must be uploaded'),
        ])
      );
    });
  });

  describe('Progress Promise (Mentor Tier)', () => {
    it('approves eligible Mentor learner who fulfilled all attendance, homework, mock, and ceiling requirements', () => {
      const result = evaluateProgressPromiseClaim({
        userId: 'usr_mentor_student_1',
        tier: 'mentor',
        liveAttendancePercent: 85,
        homeworkSubmissionPercent: 100,
        fullMocksCount: 4,
        diagnosticBand: 6.0,
        targetBand: 7.5, // 6.0 + 1.5 = 7.5 max allowed
        daysSinceCourseEnd: 40,
        daysSinceResult: 20,
        trfUploaded: true,
        targetMet: false,
      });

      expect(result.eligible).toBe(true);
      expect(result.remedy).toBe('free_live_batch_reenrolment');
      expect(result.cashRefund).toBe(false);
      expect(result.creditsRefilled).toBe(false);
    });

    it('rejects if target band exceeded diagnostic + 1.5 bands', () => {
      const result = evaluateProgressPromiseClaim({
        userId: 'usr_mentor_student_2',
        tier: 'mentor',
        liveAttendancePercent: 90,
        homeworkSubmissionPercent: 100,
        fullMocksCount: 4,
        diagnosticBand: 6.0,
        targetBand: 8.0, // Exceeds 6.0 + 1.5 = 7.5
        daysSinceCourseEnd: 20,
        daysSinceResult: 10,
        trfUploaded: true,
        targetMet: false,
      });

      expect(result.eligible).toBe(false);
      expect(result.reasons).toEqual(
        expect.arrayContaining([expect.stringContaining('diagnostic + 1.5 ceiling')])
      );
    });

    it('rejects if attendance < 80% or homework < 100%', () => {
      const result = evaluateProgressPromiseClaim({
        userId: 'usr_mentor_student_3',
        tier: 'mentor',
        liveAttendancePercent: 75,
        homeworkSubmissionPercent: 90,
        fullMocksCount: 4,
        diagnosticBand: 6.0,
        targetBand: 7.0,
        daysSinceCourseEnd: 20,
        daysSinceResult: 10,
        trfUploaded: true,
        targetMet: false,
      });

      expect(result.eligible).toBe(false);
      expect(result.reasons).toEqual(
        expect.arrayContaining([
          expect.stringContaining('Minimum 80% live session attendance required'),
          expect.stringContaining('100% homework submission required'),
        ])
      );
    });

    it('rejects if claim is filed > 30 days after score publication', () => {
      const result = evaluateProgressPromiseClaim({
        userId: 'usr_mentor_student_4',
        tier: 'mentor',
        liveAttendancePercent: 85,
        homeworkSubmissionPercent: 100,
        fullMocksCount: 4,
        diagnosticBand: 6.0,
        targetBand: 7.0,
        daysSinceCourseEnd: 40,
        daysSinceResult: 35,
        trfUploaded: true,
        targetMet: false,
      });

      expect(result.eligible).toBe(false);
      expect(result.reasons).toEqual(
        expect.arrayContaining([expect.stringContaining('within 30 days of score publication')])
      );
    });
  });

  describe('Mushak 6.3 VAT Export and CSV Formula-Injection Defense', () => {
    it('sanitizes formula-injection characters (=, +, -, @, \\t, \\r) by prepending single-quote', () => {
      expect(sanitizeCsvField('=cmd|/C calc')).toBe("'=cmd|/C calc");
      expect(sanitizeCsvField('+12345')).toBe("'+12345");
      expect(sanitizeCsvField('-100')).toBe("'-100");
      expect(sanitizeCsvField('@SUM(A1:A10)')).toBe("'@SUM(A1:A10)");
      expect(sanitizeCsvField('Normal Name')).toBe('Normal Name');
      expect(sanitizeCsvField('Name, With Comma')).toBe('"Name, With Comma"');
    });

    it('generates valid Mushak 6.3 CSV when actor has finance:read and 2FA', () => {
      const actor: Actor = {
        id: 'usr_finance_1',
        roles: ['finance'],
        hasTwoFactorEnabled: true,
      };

      const records: MushakInvoiceRecord[] = [
        {
          challanNo: 'MUS-2026-001',
          issueDate: '2026-11-13',
          customerName: 'Ayman Rahman',
          customerBinNidPhone: '01712345678',
          itemDescription: 'IELTS Academic Plus Tier',
          supplyValueMinor: 500000, // 5000.00 BDT
          vatRatePercent: 5,
          gatewayName: 'SSLCommerz',
          gatewayTxId: 'TXN-99881',
        },
        {
          challanNo: '=MALICIOUS-CHALLAN',
          issueDate: '2026-11-13',
          customerName: '@EvilCustomer',
          customerBinNidPhone: '+8801999999999',
          itemDescription: 'GRE Quant Mastery',
          supplyValueMinor: 300000, // 3000.00 BDT
          vatRatePercent: 5,
          gatewayName: 'Paddle',
          gatewayTxId: 'TXN-99882',
        },
      ];

      const csv = generateMushak63Csv(actor, records);
      expect(csv).toContain('Challan Number,Issue Date,Customer Name');
      expect(csv).toContain('MUS-2026-001,2026-11-13,Ayman Rahman,01712345678');
      expect(csv).toContain('5000.00,5,250.00,5250.00');

      // Formula injection escaped
      expect(csv).toContain("'=MALICIOUS-CHALLAN");
      expect(csv).toContain("'@EvilCustomer");
      expect(csv).toContain("'+8801999999999");
    });

    it('blocks Mushak CSV generation if actor lacks finance:read or 2FA', () => {
      const unauthorizedActor: Actor = {
        id: 'usr_student_1',
        roles: ['student'],
      };

      expect(() => generateMushak63Csv(unauthorizedActor, [])).toThrow(AuthorizationError);

      const actorWithout2fa: Actor = {
        id: 'usr_finance_no2fa',
        roles: ['finance'],
        hasTwoFactorEnabled: false,
      };

      expect(() => generateMushak63Csv(actorWithout2fa, [])).toThrow(TwoFactorRequiredError);
    });
  });

  describe('Instructor Payout Summary', () => {
    it('computes withholding tax and net payouts correctly with 2FA enforcement', () => {
      const actor: Actor = {
        id: 'usr_finance_1',
        roles: ['finance'],
        hasTwoFactorEnabled: true,
      };

      const payouts: InstructorPayoutRecord[] = [
        {
          instructorId: 'inst_1',
          instructorName: 'Dr. Rafiqul Islam',
          grossPayableMinor: 1000000, // 10,000 BDT
          taxWithholdingRatePercent: 10, // 10% AIT
          status: 'pending',
        },
        {
          instructorId: 'inst_2',
          instructorName: 'Nusrat Jahan',
          grossPayableMinor: 2000000, // 20,000 BDT
          taxWithholdingRatePercent: 10, // 10% AIT
          status: 'approved',
        },
      ];

      const summary = generateInstructorPayoutSummary(actor, payouts);
      expect(summary.totalGrossMinor).toBe(3000000);
      expect(summary.totalWithholdingTaxMinor).toBe(300000);
      expect(summary.totalNetPayableMinor).toBe(2700000);
      expect(summary.pendingCount).toBe(1);
      expect(summary.approvedCount).toBe(1);
      expect(summary.payouts[0]!.netPayableMinor).toBe(900000);
      expect(summary.payouts[1]!.netPayableMinor).toBe(1800000);
    });
  });
});
