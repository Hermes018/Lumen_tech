/** @purpose Unit tests for Notification Dispatcher, Asia/Dhaka Quiet Hours, and Bangladesh PDPO 2025 Guardian Consent State Machine */

import { describe, it, expect } from 'vitest';
import {
  dispatchNotification,
  isDhakaQuietHours,
  createMinorGuardianConsentState,
  requestGuardianConsent,
  verifyGuardianOtp,
  revokeGuardianConsent,
  canMinorAccessFeature,
  exportUserDataBundle,
  requestDataDeletion,
} from '../notifications/dispatcher';

describe('Notification Dispatcher & Quiet Hours', () => {
  it('correctly identifies Bangladesh quiet hours (22:00–08:00 Asia/Dhaka / UTC+6)', () => {
    // 23:30 Dhaka time = 17:30 UTC
    const nightTimeUtc = new Date('2026-11-13T17:30:00Z');
    expect(isDhakaQuietHours(nightTimeUtc)).toBe(true);

    // 03:00 Dhaka time = 21:00 UTC
    const earlyMorningUtc = new Date('2026-11-13T21:00:00Z');
    expect(isDhakaQuietHours(earlyMorningUtc)).toBe(true);

    // 14:00 Dhaka time = 08:00 UTC
    const afternoonUtc = new Date('2026-11-13T08:00:00Z');
    expect(isDhakaQuietHours(afternoonUtc)).toBe(false);
  });

  it('dispatches transactional order receipt with Mushak 6.3 summary and bypasses quiet hours', () => {
    // 02:00 Dhaka time (quiet hours)
    const nightTimeUtc = new Date('2026-11-13T20:00:00Z');

    const result = dispatchNotification({
      recipientId: 'usr_order_1',
      recipientEmail: 'student@example.com',
      type: 'order_receipt',
      channel: 'email',
      payload: {
        orderId: 'ord_987',
        invoiceNumber: 'MUSHAK-2026-0098',
        productName: 'IELTS Academic Mock Bundle (5 Mocks)',
        amountMinor: 350000, // 3,500.00 BDT
        vatMinor: 45652,     // 15% inclusive VAT
        currency: 'BDT',
        mushak63Summary: '15% VAT breakdown on computer-based testing services',
      },
      currentTime: nightTimeUtc,
    });

    expect(result.status).toBe('sent');
    expect(result.isMandatory).toBe(true);
    expect(result.renderedSubject).toContain('Invoice MUSHAK-2026-0098');
    expect(result.renderedBody).toContain('Total Paid: BDT 3500.00');
    expect(result.renderedBody).toContain('15% BD VAT: BDT 456.52');
  });

  it('suppresses non-mandatory streak reminders during quiet hours (22:00–08:00 Asia/Dhaka)', () => {
    // 23:00 Dhaka time = 17:00 UTC
    const quietTime = new Date('2026-11-13T17:00:00Z');

    const result = dispatchNotification({
      recipientId: 'usr_streak_1',
      type: 'streak_risk',
      channel: 'in_app',
      payload: {
        currentStreakDays: 14,
        hoursRemaining: 2,
      },
      currentTime: quietTime,
    });

    expect(result.status).toBe('suppressed_quiet_hours');
    expect(result.isMandatory).toBe(false);
    expect(result.suppressionReason).toContain('Bangladesh quiet hours');
  });

  it('respects user opt-out preferences for non-mandatory notifications during waking hours', () => {
    // 12:00 Dhaka time = 06:00 UTC (daytime)
    const daytime = new Date('2026-11-13T06:00:00Z');

    // User opted out of streak reminders
    const result = dispatchNotification({
      recipientId: 'usr_optout_1',
      type: 'streak_risk',
      channel: 'in_app',
      payload: {
        currentStreakDays: 7,
        hoursRemaining: 4,
      },
      preferences: {
        streakReminders: false,
      },
      currentTime: daytime,
    });

    expect(result.status).toBe('suppressed_opt_out');
    expect(result.suppressionReason).toContain('opted out');
  });

  it('ensures mandatory refund confirmations cannot be suppressed by opt-out preferences', () => {
    const daytime = new Date('2026-11-13T06:00:00Z');

    const result = dispatchNotification({
      recipientId: 'usr_refund_1',
      type: 'refund_confirmation',
      channel: 'email',
      payload: {
        orderId: 'ord_ref_123',
        refundId: 'ref_999',
        amountMinor: 250000,
        currency: 'BDT',
        reason: 'Self-serve 7-day guarantee refund',
        remainingCredits: 2,
      },
      preferences: {
        streakReminders: false,
      },
      currentTime: daytime,
    });

    expect(result.status).toBe('sent');
    expect(result.isMandatory).toBe(true);
    expect(result.renderedSubject).toContain('Refund Processed: BDT 2500.00');
  });
});

describe('Bangladesh PDPO 2025 Under-18 Guardian Consent State Machine', () => {
  it('initializes minor guardian consent in unverified status', () => {
    const state = createMinorGuardianConsentState('student_minor_1');
    expect(state.studentId).toBe('student_minor_1');
    expect(state.status).toBe('unverified');
    expect(state.otpAttempts).toBe(0);
  });

  it('transitions to consent_requested and dispatches OTP notification upon request', () => {
    const initial = createMinorGuardianConsentState('student_minor_2');
    const now = new Date('2026-11-13T10:00:00Z');

    const { state, otpNotification } = requestGuardianConsent(initial, {
      guardianEmail: 'parent@example.com',
      guardianPhone: '+8801711000000',
      studentName: 'Zayed Khan',
      mockOtp: '482910',
      now,
    });

    expect(state.status).toBe('consent_requested');
    expect(state.guardianEmail).toBe('parent@example.com');
    expect(state.otp).toBe('482910');
    expect(state.otpExpiresAt).toBeDefined();

    expect(otpNotification.status).toBe('sent');
    expect(otpNotification.type).toBe('guardian_consent_otp');
    expect(otpNotification.renderedBody).toContain('Verification OTP: 482910');
  });

  it('increments attempts on invalid OTP and verifies successfully on correct OTP', () => {
    const initial = createMinorGuardianConsentState('student_minor_3');
    const now = new Date('2026-11-13T10:00:00Z');

    const { state: requested } = requestGuardianConsent(initial, {
      guardianEmail: 'parent@example.com',
      guardianPhone: '+8801711000000',
      studentName: 'Farhana',
      mockOtp: '654321',
      now,
    });

    // 1. Wrong OTP attempt
    const failedAttempt = verifyGuardianOtp(requested, '111111', now);
    expect(failedAttempt.status).toBe('consent_requested');
    expect(failedAttempt.otpAttempts).toBe(1);

    // 2. Correct OTP attempt
    const verified = verifyGuardianOtp(failedAttempt, '654321', now);
    expect(verified.status).toBe('verified');
    expect(verified.verifiedAt).toBeDefined();
    expect(verified.otp).toBeUndefined(); // OTP wiped after verification
    expect(verified.consentRecordHash).toBeDefined();
  });

  it('rejects verification if OTP is expired or attempts exceed maximum of 5', () => {
    const initial = createMinorGuardianConsentState('student_minor_4');
    const now = new Date('2026-11-13T10:00:00Z');

    const { state: requested } = requestGuardianConsent(initial, {
      guardianEmail: 'parent@example.com',
      guardianPhone: '+8801711000000',
      studentName: 'Tanvir',
      mockOtp: '123456',
      now,
      otpExpiryMinutes: 15,
    });

    // 16 minutes later (expired)
    const expiredTime = new Date(now.getTime() + 16 * 60 * 1000);
    expect(() => verifyGuardianOtp(requested, '123456', expiredTime)).toThrowError(
      /expired/
    );

    // Max attempts exceeded
    let state = requested;
    state = { ...state, otpAttempts: 5 };
    expect(() => verifyGuardianOtp(state, '123456', now)).toThrowError(
      /Maximum OTP verification attempts exceeded/
    );
  });

  it('allows revoking guardian consent', () => {
    const initial = createMinorGuardianConsentState('student_minor_5');
    const { state: requested } = requestGuardianConsent(initial, {
      guardianEmail: 'parent@example.com',
      guardianPhone: '+8801711000000',
      studentName: 'Nusrat',
      mockOtp: '999888',
    });

    const verified = verifyGuardianOtp(requested, '999888');
    expect(verified.status).toBe('verified');

    const revoked = revokeGuardianConsent(verified, 'Guardian requested account pause');
    expect(revoked.status).toBe('revoked');
    expect(revoked.revokedAt).toBeDefined();
    expect(revoked.revocationReason).toBe('Guardian requested account pause');
  });

  describe('Feature Access Controls under PDPO 2025', () => {
    it('blocks public profiles, community posts, and AI speaking uploads for unverified minor', () => {
      const unverifiedState = createMinorGuardianConsentState('minor_unverified');

      expect(canMinorAccessFeature(unverifiedState, 'core_study').allowed).toBe(true);
      expect(canMinorAccessFeature(unverifiedState, 'public_profile').allowed).toBe(false);
      expect(canMinorAccessFeature(unverifiedState, 'community_post').allowed).toBe(false);
      expect(canMinorAccessFeature(unverifiedState, 'ai_speaking_upload').allowed).toBe(false);
      expect(canMinorAccessFeature(unverifiedState, 'third_party_analytics').allowed).toBe(false);
    });

    it('allows public profile, community, and AI speaking uploads once verified', () => {
      const verifiedState = {
        ...createMinorGuardianConsentState('minor_verified'),
        status: 'verified' as const,
        verifiedAt: new Date().toISOString(),
      };

      expect(canMinorAccessFeature(verifiedState, 'core_study').allowed).toBe(true);
      expect(canMinorAccessFeature(verifiedState, 'public_profile').allowed).toBe(true);
      expect(canMinorAccessFeature(verifiedState, 'community_post').allowed).toBe(true);
      expect(canMinorAccessFeature(verifiedState, 'ai_speaking_upload').allowed).toBe(true);
      // Third-party analytics is strictly disallowed for all minors under PDPO 2025
      expect(canMinorAccessFeature(verifiedState, 'third_party_analytics').allowed).toBe(false);
    });
  });

  describe('Data Portability Export & Right to Erasure', () => {
    it('generates a compliant machine-readable JSON data portability bundle', () => {
      const bundle = exportUserDataBundle({
        userId: 'usr_export_1',
        email: 'learner@example.com',
        name: 'Sadia Jahan',
        isMinor: true,
        guardianConsent: {
          studentId: 'usr_export_1',
          status: 'verified',
          guardianEmail: 'parent@example.com',
          otpAttempts: 1,
          verifiedAt: '2026-11-10T12:00:00Z',
        },
      });

      expect(bundle.format).toBe('LUMEN_PDPO_2025_JSON');
      expect(bundle.complianceStandard).toContain('Bangladesh Personal Data Protection Ordinance 2025');
      expect(bundle.user.email).toBe('learner@example.com');
      expect(bundle.user.guardianConsent?.status).toBe('verified');
      expect(bundle.transactions.length).toBeGreaterThan(0);
    });

    it('schedules Right to Erasure with a 30-day statutory grace period', () => {
      const now = new Date('2026-11-13T12:00:00Z');
      const deletion = requestDataDeletion('usr_del_1', 'Learner requested account erasure', now);

      expect(deletion.status).toBe('deletion_scheduled');
      expect(deletion.requestedAt).toBe(now.toISOString());
      // Exactly 30 days later
      const purgeDate = new Date(deletion.scheduledPurgeDate);
      const diffDays = Math.round((purgeDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      expect(diffDays).toBe(30);
    });
  });
});
