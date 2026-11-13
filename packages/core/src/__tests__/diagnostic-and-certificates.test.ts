/** @purpose Unit tests for Guest GRE Express Diagnostic and Certificate Issuance/Revocation */

import { describe, it, expect } from 'vitest';
import {
  createGuestDiagnosticSession,
  submitGuestDiagnostic,
  claimDiagnosticAttempt,
  type DiagnosticAttemptRecord,
} from '../exam/diagnostic';
import {
  issueCertificate,
  revokeCertificate,
  verifyCertificate,
  type CertificateRecord,
} from '../certificates/verify';

describe('Guest GRE Express Diagnostic Engine (D4, 02 §6)', () => {
  it('creates an unauthenticated guest session with sanitized questions', () => {
    const session = createGuestDiagnosticSession();
    expect(session.guestToken).toContain('guest_');
    expect(session.durationSeconds).toBe(900); // 15 mins
    expect(session.questions).toHaveLength(8);

    // Assert answers are sanitized from student view
    for (const q of session.questions) {
      expect((q as { correctAnswer?: unknown }).correctAnswer).toBeUndefined();
    }

    const quantCount = session.questions.filter((q) => q.measure === 'quant').length;
    const verbalCount = session.questions.filter((q) => q.measure === 'verbal').length;
    expect(quantCount).toBe(4);
    expect(verbalCount).toBe(4);
  });

  it('grades guest attempt, estimates Rasch scores, and gates results', () => {
    const guestToken = 'guest_test_abc123';
    // Answer some correctly and some with deliberate trap triggers
    const answers: Record<string, string | string[]> = {
      'diag-q-01': 'A', // Trap: positive root bias
      'diag-q-02': 'B', // Correct
      'diag-q-03': 'C', // Correct
      'diag-q-04': 'D', // Incorrect
      'diag-v-01': 'A', // Correct
      'diag-v-02': ['A', 'B'], // Correct SE
      'diag-v-03': 'B', // Incorrect
      'diag-v-04': 'A', // Correct
    };

    const result = submitGuestDiagnostic(guestToken, answers);

    expect(result.guestToken).toBe(guestToken);
    expect(result.claimed).toBe(false);
    expect(result.gated).toBe(true); // Gated behind sign-up
    expect(result.scoreSummary.quantRaw).toBe(2);
    expect(result.scoreSummary.verbalRaw).toBe(3);

    // Quant and Verbal scaled ranges
    expect(result.scoreSummary.quantScaledRange[0]).toBeGreaterThanOrEqual(130);
    expect(result.scoreSummary.quantScaledRange[1]).toBeLessThanOrEqual(170);
    expect(result.scoreSummary.overallEstimatedRange[0]).toBeGreaterThan(260);

    // Top trap triggered should be captured
    expect(result.scoreSummary.topTrapArchetype.tag).toBe('positive_root_bias');
    expect(result.scoreSummary.recommendedTrack).toBeTruthy();
    expect(result.itemByItemBreakdown).toHaveLength(8);
  });

  it('claims guest diagnostic upon student sign-up, unlocking the gate', () => {
    const database = new Map<string, DiagnosticAttemptRecord>();
    const guestToken = 'guest_session_999';

    const initial = submitGuestDiagnostic(guestToken, {
      'diag-q-01': 'D',
      'diag-q-02': 'B',
    });
    database.set(guestToken, initial);
    expect(database.get(guestToken)?.gated).toBe(true);

    // User completes sign-up and claims results
    const claimed = claimDiagnosticAttempt(guestToken, 'usr_student_456', database);

    expect(claimed.claimed).toBe(true);
    expect(claimed.userId).toBe('usr_student_456');
    expect(claimed.gated).toBe(false); // Gate unlocked!
    expect(claimed.claimedAt).toBeInstanceOf(Date);
    expect(database.get(guestToken)?.gated).toBe(false);
  });

  it('throws error when claiming an invalid or non-existent guest token', () => {
    const database = new Map<string, DiagnosticAttemptRecord>();
    expect(() => claimDiagnosticAttempt('non_existent_token', 'user-1', database)).toThrow(
      /not found/i
    );
  });
});

describe('Certificate Issuance & Verification Engine (docs/02 §7.1, docs/17 §11)', () => {
  it('issues a deterministic certificate and verifies its validity', () => {
    const db = new Map<string, CertificateRecord>();

    const cert = issueCertificate({
      userId: 'usr_grad_101',
      recipientName: 'Tanjim Ahmed',
      courseSlug: 'gre-core',
      courseName: 'GRE Core Mastery',
      exam: 'gre',
    });

    expect(cert.certId).toMatch(/^LUMEN-CERT-[0-9A-F]{8}$/);
    expect(cert.status).toBe('valid');
    expect(cert.recipientName).toBe('Tanjim Ahmed');

    db.set(cert.certId, cert);

    const verification = verifyCertificate(cert.certId, db);
    expect(verification.exists).toBe(true);
    expect(verification.isValid).toBe(true);
    expect(verification.certificate?.recipientName).toBe('Tanjim Ahmed');
    expect(verification.message).toContain('verified and valid');
  });

  it('revokes certificate on course refund and reflects revoked status on verification', () => {
    const db = new Map<string, CertificateRecord>();

    const cert = issueCertificate({
      userId: 'usr_refund_202',
      recipientName: 'Sadia Islam',
      courseSlug: 'ielts-academic-core',
      courseName: 'IELTS Academic Core',
      exam: 'ielts_academic',
    });
    db.set(cert.certId, cert);

    // Course refunded within 7 days -> revoke certificate
    const revoked = revokeCertificate(cert, 'Course refunded under 7-day money-back guarantee');
    db.set(revoked.certId, revoked);

    expect(revoked.status).toBe('revoked');
    expect(revoked.revokedAt).toBeInstanceOf(Date);

    const verification = verifyCertificate(cert.certId, db);
    expect(verification.exists).toBe(true);
    expect(verification.isValid).toBe(false);
    expect(verification.message).toContain('revoked');
    expect(verification.certificate?.revocationReason).toContain('7-day money-back guarantee');
  });

  it('returns exists: false for unknown certificate IDs', () => {
    const db = new Map<string, CertificateRecord>();
    const verification = verifyCertificate('LUMEN-CERT-NONEXIST', db);
    expect(verification.exists).toBe(false);
    expect(verification.isValid).toBe(false);
  });
});
