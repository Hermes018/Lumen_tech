/** @purpose Exhaustive unit tests for P1-34 Entitlement/Credit Ledger, P1-147 Finance Refund & 15% BD VAT Engine, and Opus math/state verification checks (Rasch EAP, FSRS, 28-of-90-day compare_at) */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  AI_EVALUATION_CREDIT_COSTS,
  DAILY_AI_EVAL_CEILINGS,
  EntitlementError,
  grantEntitlement,
  grantLedgerCredits,
  assertHasEntitlement,
  consumeAiCredit,
  consumeMockAttempt,
  getLedgerBalance,
  getUserLedgerEntries,
  resetEntitlementLedgerState,
  evaluateRefundEligibility,
  executeRefund,
  computeVatBreakdown,
  resetRefundState,
  createOrder,
  fulfillOrder,
  issueCertificate,
  verifyCertificate,
  type CertificateRecord,
  AuthorizationError,
  TwoFactorRequiredError,
  type Actor,
  eapTheta,
  thetaToScaled,
  GRE_SCALE,
  scheduleNextReview,
  FSRSRating,
  resolveCompareAtPrice,
} from '../index';

describe('P1-34: Server-Authoritative Append-Only Entitlement & Credit Ledger', () => {
  const studentActor: Actor = {
    id: 'student-ledger-01',
    roles: ['student'],
    hasTwoFactorEnabled: false,
  };

  const otherStudentActor: Actor = {
    id: 'student-ledger-02',
    roles: ['student'],
    hasTwoFactorEnabled: false,
  };

  beforeEach(() => {
    resetEntitlementLedgerState();
    resetRefundState();
  });

  it('enforces D12 C1 canonical credit costs (writing_task=1, speaking_part=1, speaking_full=2, gre_awa=1)', () => {
    expect(AI_EVALUATION_CREDIT_COSTS).toEqual({
      writing_task: 1,
      speaking_part: 1,
      speaking_full: 2,
      gre_awa: 1,
    });

    grantEntitlement(studentActor.id, 'lumen-annual-pass', 'purchase', new Date(), {
      tierOverride: 'plus',
      aiCreditsOverride: 20,
    });

    expect(getLedgerBalance(studentActor.id, 'ai_credit')).toBe(20);

    // 1. writing_task = 1
    const r1 = consumeAiCredit(studentActor, {
      evaluationType: 'writing_task',
      ref: 'eval-wt-1',
      idempotencyKey: 'idem-wt-1',
    });
    expect(r1.cost).toBe(1);
    expect(r1.remainingCredits).toBe(19);

    // 2. speaking_part = 1
    const r2 = consumeAiCredit(studentActor, {
      evaluationType: 'speaking_part',
      ref: 'eval-sp-1',
      idempotencyKey: 'idem-sp-1',
    });
    expect(r2.cost).toBe(1);
    expect(r2.remainingCredits).toBe(18);

    // 3. speaking_full = 2
    const r3 = consumeAiCredit(studentActor, {
      evaluationType: 'speaking_full',
      ref: 'eval-sf-1',
      idempotencyKey: 'idem-sf-1',
    });
    expect(r3.cost).toBe(2);
    expect(r3.remainingCredits).toBe(16);

    // 4. gre_awa = 1
    const r4 = consumeAiCredit(studentActor, {
      evaluationType: 'gre_awa',
      ref: 'eval-awa-1',
      idempotencyKey: 'idem-awa-1',
    });
    expect(r4.cost).toBe(1);
    expect(r4.remainingCredits).toBe(15);
  });

  it('prevents double-spend race conditions via idempotent append-only ledger keys', () => {
    grantEntitlement(studentActor.id, 'ielts-academic-core', 'purchase');
    expect(getLedgerBalance(studentActor.id, 'ai_credit')).toBe(10);

    const first = consumeAiCredit(studentActor, {
      evaluationType: 'speaking_full',
      ref: 'sub-900',
      idempotencyKey: 'double-spend-key-900',
    });
    expect(first.idempotentReplay).toBe(false);
    expect(first.remainingCredits).toBe(8);

    // Replay with the exact same idempotencyKey
    const second = consumeAiCredit(studentActor, {
      evaluationType: 'speaking_full',
      ref: 'sub-900',
      idempotencyKey: 'double-spend-key-900',
    });
    expect(second.idempotentReplay).toBe(true);
    expect(second.remainingCredits).toBe(8);
    expect(second.ledgerEntry.id).toBe(first.ledgerEntry.id);

    // Ledger entries should contain only 1 initial grant (+10) and 1 debit (-2)
    const entries = getUserLedgerEntries(studentActor.id, 'ai_credit');
    expect(entries).toHaveLength(2);
    expect(Object.isFrozen(entries[0])).toBe(true);
    expect(Object.isFrozen(entries[1])).toBe(true);
  });

  it('enforces daily evaluation ceilings per tier (Free=1, Core=3, Pass=4, Plus/Live/Mentor=6)', () => {
    expect(DAILY_AI_EVAL_CEILINGS).toEqual({
      free: 1,
      core: 3,
      pass: 4,
      plus: 6,
      live: 6,
      mentor: 6,
    });

    const day1 = new Date('2026-11-13T10:00:00Z');

    // Free user with 5 signup/bonus credits: ceiling is 1/day
    const freeActor: Actor = { id: 'usr-free-tier', roles: ['student'] };
    grantLedgerCredits({
      userId: freeActor.id,
      credits: 5,
      reason: 'signup_bonus',
      sourceRef: 'onboarding',
      idempotencyKey: 'free-signup-5',
      now: day1,
    });

    consumeAiCredit(freeActor, {
      evaluationType: 'gre_awa',
      ref: 'free-eval-1',
      idempotencyKey: 'free-k-1',
      now: day1,
    });

    expect(() =>
      consumeAiCredit(freeActor, {
        evaluationType: 'gre_awa',
        ref: 'free-eval-2',
        idempotencyKey: 'free-k-2',
        now: day1,
      })
    ).toThrow(EntitlementError);

    expect(() =>
      consumeAiCredit(freeActor, {
        evaluationType: 'gre_awa',
        ref: 'free-eval-2',
        idempotencyKey: 'free-k-2',
        now: day1,
      })
    ).toThrow(/Daily AI evaluation ceiling reached \(1\/1/i);

    // Core user: ceiling is 3/day
    const coreActor: Actor = { id: 'usr-core-tier', roles: ['student'] };
    grantEntitlement(coreActor.id, 'ielts-academic-core', 'purchase', day1, {
      tierOverride: 'core',
      aiCreditsOverride: 10,
    });

    for (let i = 1; i <= 3; i++) {
      consumeAiCredit(coreActor, {
        evaluationType: 'writing_task',
        ref: `core-eval-${i}`,
        idempotencyKey: `core-k-${i}`,
        now: day1,
      });
    }
    expect(() =>
      consumeAiCredit(coreActor, {
        evaluationType: 'writing_task',
        ref: 'core-eval-4',
        idempotencyKey: 'core-k-4',
        now: day1,
      })
    ).toThrow(/Daily AI evaluation ceiling reached \(3\/3/i);

    // Pass user: ceiling is 4/day
    const passActor: Actor = { id: 'usr-pass-tier', roles: ['student'] };
    grantEntitlement(passActor.id, 'gre-core-pass-3m', 'purchase', day1, {
      tierOverride: 'pass',
      aiCreditsOverride: 15,
    });

    for (let i = 1; i <= 4; i++) {
      consumeAiCredit(passActor, {
        evaluationType: 'gre_awa',
        ref: `pass-eval-${i}`,
        idempotencyKey: `pass-k-${i}`,
        now: day1,
      });
    }
    expect(() =>
      consumeAiCredit(passActor, {
        evaluationType: 'gre_awa',
        ref: 'pass-eval-5',
        idempotencyKey: 'pass-k-5',
        now: day1,
      })
    ).toThrow(/Daily AI evaluation ceiling reached \(4\/4/i);

    // Plus user: ceiling is 6/day
    const plusActor: Actor = { id: 'usr-plus-tier', roles: ['student'] };
    grantEntitlement(plusActor.id, 'lumen-annual-pass', 'purchase', day1, {
      tierOverride: 'plus',
      aiCreditsOverride: 30,
    });

    for (let i = 1; i <= 6; i++) {
      consumeAiCredit(plusActor, {
        evaluationType: 'gre_awa',
        ref: `plus-eval-${i}`,
        idempotencyKey: `plus-k-${i}`,
        now: day1,
      });
    }
    expect(() =>
      consumeAiCredit(plusActor, {
        evaluationType: 'gre_awa',
        ref: 'plus-eval-7',
        idempotencyKey: 'plus-k-7',
        now: day1,
      })
    ).toThrow(/Daily AI evaluation ceiling reached \(6\/6/i);
  });

  it('rejects insufficient credits, expired entitlements, and cross-user actor spoofing', () => {
    const start = new Date('2026-01-01T00:00:00Z');
    grantEntitlement(studentActor.id, 'ielts-academic-core', 'purchase', start, {
      aiCreditsOverride: 1,
      durationDaysOverride: 30,
    });

    // Cross-user actor spoofing rejected
    expect(() =>
      consumeAiCredit(otherStudentActor, {
        userId: studentActor.id,
        evaluationType: 'writing_task',
        ref: 'spoof-1',
        idempotencyKey: 'spoof-k-1',
        now: new Date('2026-01-10T00:00:00Z'),
      })
    ).toThrow(AuthorizationError);

    // Insufficient credits (cost 2 for speaking_full, only 1 available)
    expect(() =>
      consumeAiCredit(studentActor, {
        evaluationType: 'speaking_full',
        ref: 'insuff-1',
        idempotencyKey: 'insuff-k-1',
        now: new Date('2026-01-10T00:00:00Z'),
      })
    ).toThrow(/Insufficient AI credits/i);

    // Expired entitlement after 31 days
    const afterExpiry = new Date('2026-02-05T00:00:00Z');
    expect(() =>
      assertHasEntitlement(studentActor, {
        productSlug: 'ielts-academic-core',
        now: afterExpiry,
      })
    ).toThrow(/expired/i);

    expect(() =>
      consumeAiCredit(studentActor, {
        evaluationType: 'writing_task',
        ref: 'exp-1',
        idempotencyKey: 'exp-k-1',
        now: afterExpiry,
      })
    ).toThrow(/expired/i);
  });

  it('consumes mock attempts with idempotency and rejects when mock balance reaches 0', () => {
    grantEntitlement(studentActor.id, 'gre-mock-pack-5', 'purchase', new Date(), {
      fullMocksOverride: 2,
    });

    expect(getLedgerBalance(studentActor.id, 'mock_attempt')).toBe(2);

    const m1 = consumeMockAttempt(studentActor, {
      examFamily: 'gre',
      attemptId: 'att-1',
      idempotencyKey: 'mock-key-1',
    });
    expect(m1.remainingMocks).toBe(1);

    // Idempotent replay of att-1
    const m1Replay = consumeMockAttempt(studentActor, {
      examFamily: 'gre',
      attemptId: 'att-1',
      idempotencyKey: 'mock-key-1',
    });
    expect(m1Replay.idempotentReplay).toBe(true);
    expect(m1Replay.remainingMocks).toBe(1);

    const m2 = consumeMockAttempt(studentActor, {
      examFamily: 'gre',
      attemptId: 'att-2',
      idempotencyKey: 'mock-key-2',
    });
    expect(m2.remainingMocks).toBe(0);

    // Third mock attempt fails
    expect(() =>
      consumeMockAttempt(studentActor, {
        examFamily: 'gre',
        attemptId: 'att-3',
        idempotencyKey: 'mock-key-3',
      })
    ).toThrow(/No full mock attempts remaining/i);
  });
});

describe('P1-147: Finance Refund, Consumed-Credit Deduction, Certificate Revocation & 15% BD VAT Engine', () => {
  const financeActor: Actor = {
    id: 'staff-finance-01',
    roles: ['finance'],
    hasTwoFactorEnabled: true,
  };

  const financeNo2FA: Actor = {
    id: 'staff-finance-no2fa',
    roles: ['finance'],
    hasTwoFactorEnabled: false,
  };

  const studentActor: Actor = {
    id: 'student-refund-01',
    roles: ['student'],
    hasTwoFactorEnabled: false,
  };

  beforeEach(() => {
    resetEntitlementLedgerState();
    resetRefundState();
  });

  it('enforces 7-day window, 72h 1-month pass window, before_class_3 for Live, and before_class_2 for Crash', () => {
    const paidAt = new Date('2026-11-01T12:00:00Z');

    // 1. Standard 7-day boundary: Day 7 exact = eligible; Day 8 = ineligible
    const day7 = new Date('2026-11-08T12:00:00Z');
    const day8 = new Date('2026-11-09T12:00:01Z');

    const eligDay7 = evaluateRefundEligibility({
      productSlug: 'ielts-academic-core',
      amountPaidMinor: 399000,
      paidAt,
      now: day7,
      lessonsCompleted: 2,
      totalLessons: 20, // 10% < 20%
      fullMocksTaken: 1,
    });
    expect(eligDay7.eligible).toBe(true);
    expect(eligDay7.refundableMinor).toBe(399000);

    const eligDay8 = evaluateRefundEligibility({
      productSlug: 'ielts-academic-core',
      amountPaidMinor: 399000,
      paidAt,
      now: day8,
      lessonsCompleted: 2,
      totalLessons: 20,
      fullMocksTaken: 1,
    });
    expect(eligDay8.eligible).toBe(false);
    expect(eligDay8.reasons).toContain('exceeded_7d_refund_window');

    // 2. 1-month pass 72h window: 71h = eligible; 73h = ineligible
    const hour71 = new Date(paidAt.getTime() + 71 * 3600 * 1000);
    const hour73 = new Date(paidAt.getTime() + 73 * 3600 * 1000);

    expect(
      evaluateRefundEligibility({
        productSlug: 'gre-pass-1m',
        amountPaidMinor: 149000,
        paidAt,
        now: hour71,
      }).eligible
    ).toBe(true);

    const pass73 = evaluateRefundEligibility({
      productSlug: 'gre-pass-1m',
      amountPaidMinor: 149000,
      paidAt,
      now: hour73,
    });
    expect(pass73.eligible).toBe(false);
    expect(pass73.reasons).toContain('exceeded_72h_window_for_1m_pass');

    // 3. Live cohort before_class_3: 2 classes attended = eligible; 3 classes = ineligible
    expect(
      evaluateRefundEligibility({
        productSlug: 'ielts-academic-live',
        productKind: 'live',
        amountPaidMinor: 1399000,
        paidAt,
        now: day7,
        liveClassesAttended: 2,
      }).eligible
    ).toBe(true);

    const live3 = evaluateRefundEligibility({
      productSlug: 'ielts-academic-live',
      productKind: 'live',
      amountPaidMinor: 1399000,
      paidAt,
      now: day7,
      liveClassesAttended: 3,
    });
    expect(live3.eligible).toBe(false);
    expect(live3.reasons).toContain('attended_class_3_or_more_for_live');

    // 4. Crash course before_class_2: 1 class attended = eligible; 2 classes = ineligible
    expect(
      evaluateRefundEligibility({
        productSlug: 'ielts-crash-batch',
        productKind: 'crash',
        amountPaidMinor: 499000,
        paidAt,
        now: day7,
        liveClassesAttended: 1,
      }).eligible
    ).toBe(true);

    const crash2 = evaluateRefundEligibility({
      productSlug: 'ielts-crash-batch',
      productKind: 'crash',
      amountPaidMinor: 499000,
      paidAt,
      now: day7,
      liveClassesAttended: 2,
    });
    expect(crash2.eligible).toBe(false);
    expect(crash2.reasons).toContain('attended_class_2_or_more_for_crash');
  });

  it('enforces < 20% content consumption boundary (19.9% eligible vs 20.0% ineligible) and <= 1 full mock', () => {
    const paidAt = new Date('2026-11-01T00:00:00Z');
    const now = new Date('2026-11-03T00:00:00Z');

    // 19.9% (199 / 1000 lessons) -> eligible
    const at199 = evaluateRefundEligibility({
      productSlug: 'gre-complete-core',
      amountPaidMinor: 499000,
      paidAt,
      now,
      lessonsCompleted: 199,
      totalLessons: 1000,
      fullMocksTaken: 1,
    });
    expect(at199.eligible).toBe(true);

    // 20.0% (20 / 100 lessons) -> ineligible
    const at200 = evaluateRefundEligibility({
      productSlug: 'gre-complete-core',
      amountPaidMinor: 499000,
      paidAt,
      now,
      lessonsCompleted: 20,
      totalLessons: 100,
      fullMocksTaken: 1,
    });
    expect(at200.eligible).toBe(false);
    expect(at200.reasons).toContain('consumption_reached_or_exceeded_20_percent');

    // 2 full mocks taken -> ineligible even if lessons < 20%
    const twoMocks = evaluateRefundEligibility({
      productSlug: 'gre-complete-core',
      amountPaidMinor: 499000,
      paidAt,
      now,
      lessonsCompleted: 5,
      totalLessons: 100,
      fullMocksTaken: 2,
      fullMocksIncluded: 20,
    });
    expect(twoMocks.eligible).toBe(false);
    expect(twoMocks.reasons).toContain('more_than_1_full_mock_taken');
  });

  it('never refunds consumed AI credits (deducts consumed credit value in minor units) and revokes certificates on executeRefund', async () => {
    const now = new Date('2026-11-10T10:00:00Z');
    const orderRes = await createOrder({
      userId: studentActor.id,
      productSlug: 'ielts-academic-core', // 399,000 minor BDT, 10 AI credits included
      customer: {
        userId: studentActor.id,
        name: 'Refund Learner',
        email: 'refund@lumen.academy',
        country: 'BD',
      },
      appUrl: 'http://localhost:3000',
      now,
    });

    await fulfillOrder(orderRes.order.providerRef, 'SANDBOX_VAL_REFUND_01');

    // Learner consumes 1 AI credit (10% of 10 credits -> < 20% limit)
    consumeAiCredit(studentActor, {
      evaluationType: 'writing_task', // 1 credit = 10,000 minor BDT (100 BDT)
      ref: 'essay-before-refund',
      idempotencyKey: 'ref-credit-1',
      now,
    });

    // Issue certificate to learner
    const cert = issueCertificate({
      userId: studentActor.id,
      recipientName: 'Refund Learner',
      courseSlug: 'ielts-academic-core',
      courseName: 'IELTS Academic Core',
      exam: 'ielts_academic',
      issueDate: now,
    });
    const certDb = new Map<string, CertificateRecord>([[cert.certId, cert]]);
    expect(verifyCertificate(cert.certId, certDb).isValid).toBe(true);

    // Non-finance actor (student) is denied refund execution
    expect(() =>
      executeRefund(studentActor, {
        orderId: orderRes.order.id,
        reason: 'Attempted self-refund without finance permission',
      })
    ).toThrow(AuthorizationError);

    // Finance actor without 2FA is denied
    expect(() =>
      executeRefund(financeNo2FA, {
        orderId: orderRes.order.id,
        reason: 'Missing 2FA',
      })
    ).toThrow(TwoFactorRequiredError);

    // Authorized Finance actor with 2FA executes refund
    const refundRes = executeRefund(financeActor, {
      orderId: orderRes.order.id,
      reason: 'Customer requested refund within 7-day policy',
      certificates: certDb,
      unitAiCreditValueMinor: 10000, // 100 BDT per consumed credit
      now: new Date(now.getTime() + 2 * 24 * 3600 * 1000),
    });

    // 399,000 - 10,000 (1 consumed credit) = 389,000 minor BDT refunded
    expect(refundRes.eligibility.consumedAiCredits).toBe(1);
    expect(refundRes.eligibility.deductedCreditValueMinor).toBe(10000);
    expect(refundRes.refundedMinor).toBe(389000);
    expect(refundRes.order.status).toBe('refunded');

    // Certificate is automatically revoked
    expect(refundRes.revokedCertificates).toHaveLength(1);
    const verifyAfter = verifyCertificate(cert.certId, certDb);
    expect(verifyAfter.isValid).toBe(false);
    expect(verifyAfter.certificate?.status).toBe('revoked');

    // Remaining AI credits for the user are zeroed out in the ledger
    expect(getLedgerBalance(studentActor.id, 'ai_credit')).toBe(0);

    // Double refund execution is idempotent
    const secondRefund = executeRefund(financeActor, {
      orderId: orderRes.order.id,
      reason: 'Duplicate click',
    });
    expect(secondRefund.idempotentReplay).toBe(true);
    expect(secondRefund.refundedMinor).toBe(389000);
  });

  it('computes 15% BD VAT / Mushak integer minor-unit breakdown (net_minor + vat_minor === gross_minor)', () => {
    // 115,000 minor BDT (1,150.00 BDT) at 15% VAT -> net = 100,000, vat = 15,000
    const exact = computeVatBreakdown(115000, 1500);
    expect(exact.gross_minor).toBe(115000);
    expect(exact.net_minor).toBe(100000);
    expect(exact.vat_minor).toBe(15000);
    expect(exact.net_minor + exact.vat_minor).toBe(exact.gross_minor);

    // 399,000 minor BDT (3,990.00 BDT) at 15% VAT -> integer math without float drift
    const courseVat = computeVatBreakdown(399000, 1500);
    expect(Number.isInteger(courseVat.net_minor)).toBe(true);
    expect(Number.isInteger(courseVat.vat_minor)).toBe(true);
    expect(courseVat.net_minor + courseVat.vat_minor).toBe(399000);
    expect(courseVat.net_minor).toBe(346956);
    expect(courseVat.vat_minor).toBe(52044);
  });
});

describe('Opus §1.1 Math / State Verification Invariants (Rasch EAP, FSRS, 28-of-90-day compare_at)', () => {
  it('verifies Rasch EAP finite bounds on all-correct/all-wrong, monotonicity, and 130-170 integer clamping', () => {
    const allWrong = Array.from({ length: 15 }, () => ({ b: 0, correct: false }));
    const halfRight = Array.from({ length: 15 }, (_, i) => ({ b: 0, correct: i < 7 }));
    const allRight = Array.from({ length: 15 }, () => ({ b: 0, correct: true }));

    const estWrong = eapTheta(allWrong);
    const estHalf = eapTheta(halfRight);
    const estRight = eapTheta(allRight);

    expect(Number.isFinite(estWrong.theta)).toBe(true);
    expect(Number.isFinite(estRight.theta)).toBe(true);
    expect(estWrong.sem).toBeGreaterThan(0);
    expect(estRight.sem).toBeGreaterThan(0);
    expect(estWrong.theta).toBeLessThan(estHalf.theta);
    expect(estHalf.theta).toBeLessThan(estRight.theta);

    const scaledLow = thetaToScaled(estWrong, GRE_SCALE.quant);
    const scaledHigh = thetaToScaled(estRight, GRE_SCALE.quant);
    expect(scaledLow.scaled).toBeGreaterThanOrEqual(130);
    expect(scaledHigh.scaled).toBeLessThanOrEqual(170);
    expect(Number.isInteger(scaledLow.scaled)).toBe(true);
    expect(Number.isInteger(scaledHigh.scaled)).toBe(true);
  });

  it('verifies FSRS stability > 0, difficulty clamped [1, 10], interval >= 1 day on recall, and Again lapse reset', () => {
    const now = new Date('2026-11-13T00:00:00Z');
    const initialCard = {
      stability: 0,
      difficulty: 0,
      reps: 0,
      lapses: 0,
      state: 'new' as const,
    };

    const firstGood = scheduleNextReview(initialCard, FSRSRating.Good, { now });
    expect(firstGood.card.stability).toBeGreaterThan(0);
    expect(firstGood.card.difficulty).toBeGreaterThanOrEqual(1);
    expect(firstGood.card.difficulty).toBeLessThanOrEqual(10);
    expect(firstGood.intervalDays).toBeGreaterThanOrEqual(1);
    expect(firstGood.card.state).toBe('review');

    // Subsequent Again rating resets to relearning with incremented lapses
    const reviewTime = new Date(now.getTime() + 4 * 86400000);
    const lapsed = scheduleNextReview(firstGood.card, FSRSRating.Again, { now: reviewTime });
    expect(lapsed.card.state).toBe('relearning');
    expect(lapsed.card.lapses).toBe(1);
    expect(lapsed.card.stability).toBeGreaterThan(0);
    expect(lapsed.card.difficulty).toBeGreaterThanOrEqual(1);
    expect(lapsed.card.difficulty).toBeLessThanOrEqual(10);
  });

  it('verifies D12 C14 honest compare_at boundary: 27 consecutive days returns null, 28 consecutive days returns compare_at', () => {
    const now = new Date('2026-11-13T00:00:00Z');
    const DAY_MS = 24 * 60 * 60 * 1000;

    // 27 days at higher price -> must return null
    const history27Days = [
      {
        amountMinor: 499000,
        startsAt: new Date(now.getTime() - 35 * DAY_MS),
        endsAt: new Date(now.getTime() - 8 * DAY_MS), // 27 days duration
      },
    ];
    expect(resolveCompareAtPrice(history27Days, 399000, now)).toBeNull();

    // 28 days at higher price within last 90 days -> returns 499000
    const history28Days = [
      {
        amountMinor: 499000,
        startsAt: new Date(now.getTime() - 36 * DAY_MS),
        endsAt: new Date(now.getTime() - 8 * DAY_MS), // 28 days duration
      },
    ];
    expect(resolveCompareAtPrice(history28Days, 399000, now)).toBe(499000);
  });
});
