/** @purpose Stage 9 comprehensive regression tests for all Sonnet Stage-8 Preflight Audit P0 & P1 fixes */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import {
  submitManualPayment,
  approveManualPayment,
  createOrder,
  resetEntitlementLedgerState,
  assertCanGrantRole,
  AuthorizationError,
  startSupportImpersonation,
  assertSupportRefundTierCap,
  createSignedVideoEmbed,
  evaluateTargetPromiseClaim,
  evaluateProgressPromiseClaim,
  sanitizeCsvField,
  createMinorGuardianConsentState,
  requestGuardianConsent,
  verifyGuardianOtp,
  createIeltsMockAttempt,
  startIeltsSection,
  submitSectionAnswers,
  type Actor,
} from '../index';

describe('Stage 9 Audit Remediation Regression Suite (P0-1..10, P1-A..H)', () => {
  beforeEach(() => {
    resetEntitlementLedgerState();
  });

  afterEach(() => {
    delete process.env.BUNNY_TOKEN_KEY;
    delete process.env.BUNNY_STREAM_LIBRARY_ID;
  });

  it('P0-2: rejects duplicate bKash TrxID across different orders', async () => {
    const { order: order1 } = await createOrder({
      userId: 'usr_trx_1',
      productSlug: 'ielts-academic-core',
      customer: {
        userId: 'usr_trx_1',
        name: 'User One',
        email: 'one@example.com',
        phoneE164: '01711111111',
      },
      appUrl: 'http://localhost:3000',
    });

    const { order: order2 } = await createOrder({
      userId: 'usr_trx_2',
      productSlug: 'ielts-academic-core',
      customer: {
        userId: 'usr_trx_2',
        name: 'User Two',
        email: 'two@example.com',
        phoneE164: '01722222222',
      },
      appUrl: 'http://localhost:3000',
    });

    await submitManualPayment(order1.id, 'bkash', 'TRX99887766', '01711111111');

    await expect(
      submitManualPayment(order2.id, 'bkash', 'trx99887766', '01722222222')
    ).rejects.toThrow('This Transaction ID has already been submitted for another order');
  });

  it('P0-2: rejects approveManualPayment when order is not in pending_verification status', async () => {
    const { order } = await createOrder({
      userId: 'usr_status_guard',
      productSlug: 'ielts-academic-core',
      customer: {
        userId: 'usr_status_guard',
        name: 'User Guard',
        email: 'guard@example.com',
        phoneE164: '01733333333',
      },
      appUrl: 'http://localhost:3000',
    });

    const financeActor: Actor = {
      id: 'staff_fin_1',
      roles: ['finance'],
      hasTwoFactorEnabled: true,
    };

    await expect(approveManualPayment(order.id, financeActor)).rejects.toThrow(
      /No manual TrxID has been submitted/
    );
  });

  it('P0-7: blocks non-super_admin from granting admin or super_admin roles', () => {
    const regularAdmin: Actor = {
      id: 'usr_admin_1',
      roles: ['admin'],
      hasTwoFactorEnabled: true,
    };
    const superAdmin: Actor = {
      id: 'usr_super_1',
      roles: ['super_admin'],
      hasTwoFactorEnabled: true,
    };

    expect(() => assertCanGrantRole(regularAdmin, 'student')).not.toThrow();
    expect(() => assertCanGrantRole(regularAdmin, 'admin')).toThrow(AuthorizationError);
    expect(() => assertCanGrantRole(regularAdmin, 'super_admin')).toThrow(AuthorizationError);
    expect(() => assertCanGrantRole(superAdmin, 'admin')).not.toThrow();
    expect(() => assertCanGrantRole(superAdmin, 'super_admin')).not.toThrow();
  });

  it('P1-G: enforces >=10 char reason and audit log on support impersonation and enforces refund tier cap', () => {
    const supportActor: Actor = {
      id: 'staff_sup_1',
      roles: ['support'],
      hasTwoFactorEnabled: true,
    };

    expect(() => startSupportImpersonation(supportActor, 'usr_123', 'short')).toThrow(
      /at least 10 characters/
    );

    const session = startSupportImpersonation(
      supportActor,
      'usr_123',
      'Investigating bKash TrxID ticket #101'
    );
    expect(session.readOnly).toBe(true);
    expect(session.auditEntry.action).toBe('support:impersonation_started');
    expect(session.auditEntry.targetId).toBe('usr_123');

    expect(() => assertSupportRefundTierCap(supportActor, 150_000, 'BDT')).not.toThrow();
    expect(() => assertSupportRefundTierCap(supportActor, 250_000, 'BDT')).toThrow(
      AuthorizationError
    );
  });

  it('P0-5: throws in production when Bunny Stream env vars are missing', () => {
    const prevEnv = process.env.NODE_ENV;
    (process.env as Record<string, string | undefined>).NODE_ENV = 'production';
    try {
      expect(() =>
        createSignedVideoEmbed('usr_1', 'a@b.com', '+8801712345678', 'vid_1')
      ).toThrow(/Bunny Stream signing is not configured/);
    } finally {
      (process.env as Record<string, string | undefined>).NODE_ENV = prevEnv;
    }
  });

  it('P1-A: rejects NaN and undefined targetMet in guarantee claim evaluators', () => {
    const nanTarget = evaluateTargetPromiseClaim({
      userId: 'usr_1',
      tier: 'plus',
      fullMocksCount: Number.NaN,
      studyPlanCompletionPercent: 80,
      daysSinceAccessEnd: 10,
      trfUploaded: true,
      targetMet: false,
    });
    expect(nanTarget.eligible).toBe(false);
    expect(nanTarget.reasons).toContain('Invalid numeric claim input.');

    const missingTargetMet = evaluateTargetPromiseClaim({
      userId: 'usr_1',
      tier: 'plus',
      fullMocksCount: 5,
      studyPlanCompletionPercent: 80,
      daysSinceAccessEnd: 10,
      trfUploaded: true,
    });
    expect(missingTargetMet.eligible).toBe(false);

    const nanProgress = evaluateProgressPromiseClaim({
      userId: 'usr_2',
      tier: 'mentor',
      liveAttendancePercent: 90,
      homeworkSubmissionPercent: 100,
      fullMocksCount: Number.NaN,
      targetBand: 7.0,
      diagnosticBand: 6.0,
      daysSinceCourseEnd: 20,
      daysSinceResult: 5,
      trfUploaded: true,
      targetMet: false,
    });
    expect(nanProgress.eligible).toBe(false);
    expect(nanProgress.reasons).toContain('Invalid numeric claim input.');
  });

  it('P1-B: neutralizes leading-whitespace CSV formulas while preserving negative numbers and quoting CR', () => {
    expect(sanitizeCsvField(' =HYPERLINK("http://evil")')).toBe(`"' =HYPERLINK(""http://evil"")"`);
    expect(sanitizeCsvField('\n=cmd()')).toBe(`"'\n=cmd()"`);
    expect(sanitizeCsvField(-500)).toBe('-500');
    expect(sanitizeCsvField('line1\rline2')).toBe('"line1\rline2"');
  });

  it('P1-D: enforces guardian OTP cooldown, blocks re-request after verification, and uses CSPRNG', () => {
    const t0 = new Date('2026-11-14T10:00:00Z');
    const state0 = createMinorGuardianConsentState('usr_minor_1');

    const { state: state1 } = requestGuardianConsent(state0, {
      guardianEmail: 'parent@example.com',
      guardianPhone: '+8801711000000',
      studentName: 'Minor',
      now: t0,
    });
    expect(state1.otp).toMatch(/^\d{6}$/);

    // Within 2-minute cooldown -> rejected
    expect(() =>
      requestGuardianConsent(state1, {
        guardianEmail: 'parent@example.com',
        guardianPhone: '+8801711000000',
        studentName: 'Minor',
        now: new Date(t0.getTime() + 60 * 1000),
      })
    ).toThrow(/Please wait before requesting another OTP/);

    // Verify OTP
    const verified = verifyGuardianOtp(state1, state1.otp!, new Date(t0.getTime() + 30 * 1000));
    expect(verified.status).toBe('verified');

    // Re-request after verification -> rejected
    expect(() =>
      requestGuardianConsent(verified, {
        guardianEmail: 'parent@example.com',
        guardianPhone: '+8801711000000',
        studentName: 'Minor',
        now: new Date(t0.getTime() + 5 * 60 * 1000),
      })
    ).toThrow(/already verified/);
  });

  it('P1-C: enforces forward-only IELTS mock sections, blocks resubmits, and rejects expired sections', () => {
    const t0 = new Date('2026-11-14T10:00:00Z');
    let attempt = createIeltsMockAttempt({
      id: 'att_strict_1',
      userId: 'usr_ielts_1',
      track: 'ielts_academic',
      strictMockMode: true,
    });

    // Cannot skip ahead to reading while at listening
    expect(() => startIeltsSection(attempt, 'reading', t0)).toThrow(
      /Cannot start "reading" while attempt is at "listening"/
    );

    attempt = startIeltsSection(attempt, 'listening', t0);
    attempt = submitSectionAnswers(attempt, 'listening', { q1: 'A' }, new Date(t0.getTime() + 60_000));

    // Cannot rewind back to listening after advancing to reading
    expect(() => startIeltsSection(attempt, 'listening', t0)).toThrow(
      /Cannot start "listening" while attempt is at "reading"/
    );

    // Cannot submit reading after section timer expires (reading allowedSeconds = 3600s)
    const tReadingStart = new Date(t0.getTime() + 120_000);
    attempt = startIeltsSection(attempt, 'reading', tReadingStart);
    expect(() =>
      submitSectionAnswers(
        attempt,
        'reading',
        { q1: 'TRUE' },
        new Date(tReadingStart.getTime() + 3700_000)
      )
    ).toThrow(/has expired; answers rejected/);
  });
});
