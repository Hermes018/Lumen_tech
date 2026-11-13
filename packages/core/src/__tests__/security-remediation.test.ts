/** @purpose Security remediation unit tests for P1-32: session guard, cross-user IDOR rejection, 2FA enforcement, IPN idempotency, and IRT retry exclusion */

import { describe, it, expect, afterEach } from 'vitest';
import {
  requireServerActor,
  __setTestServerActor,
  AuthError,
  assertCan,
  AuthorizationError,
  TwoFactorRequiredError,
  createOrder,
  fulfillOrder,
  getUserEntitlements,
  SslcommerzProvider,
  ProviderPermanentError,
  createMistakeNotebook,
  recordMistake,
  retryMistake,
  routeSection,
  calibrateItemDifficultyB,
  GRE_ADAPTIVE_RULES_V1,
  computeItemStatistics,
  calculatePointBiserial,
  eapTheta,
} from '../index';

describe('P1-32 Security Remediation & Session Guard Suite', () => {
  afterEach(() => {
    __setTestServerActor(undefined);
  });

  describe('1. Unauthenticated & Cross-User ID Spoofing (IDOR) Rejection', () => {
    it('rejects unauthenticated requests when no server session exists', async () => {
      __setTestServerActor(null);
      await expect(requireServerActor()).rejects.toThrow(AuthError);
      await expect(requireServerActor()).rejects.toMatchObject({
        code: 'UNAUTHENTICATED',
      });
    });

    it('rejects cross-user ID spoofing when student A attempts to read or modify student B resources', async () => {
      __setTestServerActor({
        id: 'student-alice',
        roles: ['student'],
        hasTwoFactorEnabled: false,
      });

      const actor = await requireServerActor();
      expect(actor.id).toBe('student-alice');

      // Alice can access her own notebook/exam/order
      expect(() =>
        assertCan(actor, 'exam:view_own', { ownerId: 'student-alice' })
      ).not.toThrow();

      // Alice attempting to spoof student-bob's userId is strictly rejected
      expect(() =>
        assertCan(actor, 'exam:view_own', { ownerId: 'student-bob' })
      ).toThrow(AuthorizationError);

      expect(() =>
        assertCan(actor, 'order:view_own', { ownerId: 'student-bob' })
      ).toThrow(AuthorizationError);

      expect(() =>
        assertCan(actor, 'user:view_own', { ownerId: 'student-bob' })
      ).toThrow(AuthorizationError);
    });
  });

  describe('2. Mandatory 2FA Enforcement (D4)', () => {
    it('rejects grader, instructor, content_editor, support, finance, org_admin, admin, and super_admin without 2FA', async () => {
      const rolesRequiring2FA = [
        'instructor',
        'grader',
        'content_editor',
        'support',
        'finance',
        'org_admin',
        'admin',
        'super_admin',
      ] as const;

      for (const role of rolesRequiring2FA) {
        __setTestServerActor({
          id: `actor-${role}`,
          roles: [role],
          hasTwoFactorEnabled: false,
        });

        await expect(requireServerActor()).rejects.toMatchObject({
          code: '2FA_REQUIRED',
        });

        // Defence-in-depth in assertCan as well
        expect(() =>
          assertCan(
            { id: `actor-${role}`, roles: [role], hasTwoFactorEnabled: false },
            'course:view'
          )
        ).toThrow(TwoFactorRequiredError);
      }
    });

    it('enforces explicit requireTwoFactor option on grader and studio actions', async () => {
      __setTestServerActor({
        id: 'student-no-2fa',
        roles: ['student'],
        hasTwoFactorEnabled: false,
      });

      await expect(requireServerActor({ requireTwoFactor: true })).rejects.toMatchObject({
        code: '2FA_REQUIRED',
      });
    });
  });

  describe('3. SSLCommerz Webhook Signature, Amount Match & Duplicate IPN Idempotency', () => {
    it('rejects forged IPN webhook signature when requireSignature is enabled or verify_sign is tampered', async () => {
      const provider = new SslcommerzProvider({
        storeId: 'test_store',
        storePassword: 'secret_store_password',
        isLive: false,
      });

      await expect(
        provider.parseWebhook({
          rawBody:
            'tran_id=LATX900&val_id=VAL900&amount=3990.00&verify_key=amount,tran_id,val_id&verify_sign=forged_hex_hash',
          requireSignature: true,
        })
      ).rejects.toThrow(ProviderPermanentError);
    });

    it('rejects payment fulfillment when secondary validation reports amount_minor or currency mismatch', async () => {
      const orderRes = await createOrder({
        userId: 'usr-mismatch-test',
        productSlug: 'ielts-academic-core',
        customer: {
          userId: 'usr-mismatch-test',
          name: 'Test Buyer',
          email: 'buyer@lumen.academy',
          country: 'BD',
        },
        appUrl: 'http://localhost:3000',
      });

      const provider = new SslcommerzProvider();
      // Expected is 399000 (3990.00 BDT); pass tampered 100.00 BDT in hint
      const badAmountResult = await fulfillOrder(
        orderRes.order.providerRef,
        'SANDBOX_VAL_TAMPERED',
        provider,
        { amount: '100.00', currency: 'BDT' }
      );

      expect(badAmountResult.success).toBe(false);
      expect(badAmountResult.payment.failureReason).toBe('amount_mismatch');
      expect(badAmountResult.order?.status).toBe('failed');
    });

    it('enforces strict idempotency so duplicate IPNs cannot double-grant entitlements', async () => {
      const buyerId = `usr-idemp-${Date.now()}`;
      const orderRes = await createOrder({
        userId: buyerId,
        productSlug: 'gre-complete-core',
        customer: {
          userId: buyerId,
          name: 'Idempotent Buyer',
          email: 'idemp@lumen.academy',
          country: 'BD',
        },
        appUrl: 'http://localhost:3000',
      });

      const first = await fulfillOrder(
        orderRes.order.providerRef,
        'SANDBOX_VAL_IDEMP_1'
      );
      expect(first.success).toBe(true);
      expect(first.idempotentReplay).toBe(false);

      // Replay exact same IPN transaction a second and third time
      const second = await fulfillOrder(
        orderRes.order.providerRef,
        'SANDBOX_VAL_IDEMP_1'
      );
      const third = await fulfillOrder(
        orderRes.order.providerRef,
        'SANDBOX_VAL_IDEMP_2'
      );

      expect(second.success).toBe(true);
      expect(second.idempotentReplay).toBe(true);
      expect(second.entitlement?.id).toBe(first.entitlement?.id);

      expect(third.success).toBe(true);
      expect(third.idempotentReplay).toBe(true);

      // Verify exactly ONE entitlement record was granted to the buyer
      const entitlements = getUserEntitlements(buyerId);
      expect(entitlements).toHaveLength(1);
    });
  });

  describe('4. IRT Calibration & Item-Rest Exclusion for Mistake Notebook Retries', () => {
    it('tags Mistake Notebook entries and retries with isMistakeRetry: true and excludeFromIrt: true', () => {
      let nb = createMistakeNotebook('learner-irt-test');
      nb = recordMistake(nb, {
        userId: 'learner-irt-test',
        questionId: 'q-irt-101',
        subject: 'quant',
        topicSlug: 'algebra',
        questionPrompt: 'Solve for x',
        selectedWrongAnswer: 'choice-a',
        correctAnswers: ['choice-c'],
        errorCategory: 'concept_gap',
      });

      expect(nb.entries['q-irt-101']?.isMistakeRetry).toBe(true);
      expect(nb.entries['q-irt-101']?.excludeFromIrt).toBe(true);

      const retryRes = retryMistake({
        notebook: nb,
        questionId: 'q-irt-101',
        userAnswer: 'choice-c',
        hintsUsed: 0,
      });

      expect(retryRes.isMistakeRetry).toBe(true);
      expect(retryRes.excludeFromIrt).toBe(true);
      expect(retryRes.notebook.entries['q-irt-101']?.isMistakeRetry).toBe(true);
    });

    it('strictly filters out isMistakeRetry responses from Rasch b calibration, eapTheta, adaptive routing, and item-rest statistics', () => {
      // 1. Rasch b calibration
      const baseResponses = [
        { isCorrect: true, theta: 0.5 },
        { isCorrect: false, theta: -0.2 },
        { isCorrect: false, theta: -0.4 },
        { isCorrect: false, theta: 0.1 },
      ];
      const calClean = calibrateItemDifficultyB(baseResponses);

      const pollutedResponses = [
        ...baseResponses,
        // 20 correct mistake retries that would artificially make the question look super easy if included
        ...Array.from({ length: 20 }, () => ({
          isCorrect: true,
          theta: 0.0,
          isMistakeRetry: true as const,
        })),
      ];
      const calWithRetries = calibrateItemDifficultyB(pollutedResponses);

      expect(calWithRetries.b).toBe(calClean.b);
      expect(calWithRetries.calibratedSampleSize).toBe(baseResponses.length);

      // 2. EAP Theta & Adaptive Routing exclusion
      const s1ExamItems = Array.from({ length: 12 }, (_, idx) => ({
        b: 0.0,
        correct: idx < 3, // Only 3/12 correct -> 'low' tier
        calibrated: false,
      }));
      const s1WithMistakeRetries = [
        ...s1ExamItems,
        ...Array.from({ length: 15 }, () => ({
          b: 1.5,
          correct: true,
          calibrated: true,
          isMistakeRetry: true as const,
        })),
      ];

      const routeClean = routeSection(GRE_ADAPTIVE_RULES_V1, 2, 'sec-1', s1ExamItems);
      const routeWithRetries = routeSection(
        GRE_ADAPTIVE_RULES_V1,
        2,
        'sec-1',
        s1WithMistakeRetries
      );

      expect(routeClean.tier).toBe('low');
      expect(routeWithRetries.tier).toBe('low');
      expect(routeWithRetries.basis.s1Count).toBe(12);
      expect(eapTheta(s1WithMistakeRetries).n).toBe(12);

      // 3. Item-rest pointBiserial & computeItemStatistics exclusion
      const examStatResponses = [
        { studentId: 's1', selectedOption: 'A', isCorrect: true, sectionTotalScore: 18 },
        { studentId: 's2', selectedOption: 'A', isCorrect: true, sectionTotalScore: 16 },
        { studentId: 's3', selectedOption: 'B', isCorrect: false, sectionTotalScore: 7 },
        { studentId: 's4', selectedOption: 'C', isCorrect: false, sectionTotalScore: 6 },
      ];
      const statWithRetries = [
        ...examStatResponses,
        // Low-scoring retry responses that would invert discrimination if not excluded
        {
          studentId: 's3-retry',
          selectedOption: 'A',
          isCorrect: true,
          sectionTotalScore: 2,
          isMistakeRetry: true,
        },
        {
          studentId: 's4-retry',
          selectedOption: 'A',
          isCorrect: true,
          sectionTotalScore: 1,
          isMistakeRetry: true,
        },
      ];

      expect(calculatePointBiserial(statWithRetries)).toBe(
        calculatePointBiserial(examStatResponses)
      );

      const fullStatsClean = computeItemStatistics({
        questionId: 'q-stat-1',
        responses: examStatResponses,
        correctOptionId: 'A',
      });
      const fullStatsWithRetries = computeItemStatistics({
        questionId: 'q-stat-1',
        responses: statWithRetries,
        correctOptionId: 'A',
      });

      expect(fullStatsWithRetries.pValue).toBe(fullStatsClean.pValue);
      expect(fullStatsWithRetries.pointBiserial).toBe(fullStatsClean.pointBiserial);
      expect(fullStatsWithRetries.attempts).toBe(fullStatsClean.attempts);
    });
  });
});
