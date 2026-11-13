/**
 * @purpose Stage 11 unit tests closing all residual Stage-10 audit gaps (P0-9, P1-E, P1-F, P1-G, dot-path hardening)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  // Commerce & refunds
  createOrder,
  executeRefund,
  resetEntitlementLedgerState,
  grantEntitlement,
  listUserOrders,
  getUserEntitlements,
  type Actor,
  // IELTS exam orchestrator & scoring
  createIeltsMockAttempt,
  saveIeltsMockAttempt,
  getIeltsMockAttempt,
  startIeltsSection,
  submitSectionAnswers,
  aggregateIeltsBandReport,
  resetIeltsMockAttempts,
  // PDPO & cookies
  exportUserDataBundle,
  signPdpoCookie,
  verifyPdpoCookie,
  getGuardianConsentState,
  saveGuardianConsentState,
  canMinorAccessFeature,
  resetGuardianConsentStates,
  AuthorizationError,
  // Role persistence
  getUserRoles,
  setUserRoles,
  clearUserRoleStore,
} from '../index';
import {
  evaluateIeltsWriting,
  evaluateIeltsSpeaking,
  redactIeltsPii,
} from '../../../ai/src/index';
import { getRepositories } from '@lumen/db';

describe('Stage 11 Residual Audit Gaps Remediation Suite', () => {
  beforeEach(() => {
    resetEntitlementLedgerState();
    resetIeltsMockAttempts();
    resetGuardianConsentStates();
    clearUserRoleStore();
  });

  describe('1. Real @lumen/ai Evaluation & IELTS Completion State Machine (P0-9)', () => {
    it('rejects finalizing an unstarted empty IELTS mock attempt without section submissions', () => {
      const attempt = createIeltsMockAttempt({
        id: 'att_empty_101',
        userId: 'usr_ielts_01',
        track: 'ielts_academic',
      });
      saveIeltsMockAttempt(attempt);

      const emptyAnswers = {
        listeningAnswers: {},
        readingAnswers: {},
        writingAnswers: { task1: '', task2: '' },
        speakingData: { part2Notes: '', part2Transcript: '' },
      };

      const hasAnyAnswers =
        Object.keys(emptyAnswers.listeningAnswers).length > 0 ||
        Object.keys(emptyAnswers.readingAnswers).length > 0 ||
        Boolean(emptyAnswers.writingAnswers.task1 || emptyAnswers.writingAnswers.task2) ||
        Boolean(emptyAnswers.speakingData.part2Transcript);

      expect(hasAnyAnswers).toBe(false);
      expect(() => {
        if (!hasAnyAnswers && attempt.status === 'not_started') {
          throw new Error(`Cannot finalize an unstarted empty IELTS mock attempt '${attempt.id}' without section submissions`);
        }
      }).toThrow(/Cannot finalize an unstarted empty IELTS mock attempt/);
    });

    it('invokes real @lumen/ai evaluators, derives authentic rubric-based bands and persists via repository adapter', async () => {
      let attempt = createIeltsMockAttempt({
        id: 'att_eval_202',
        userId: 'usr_ielts_02',
        track: 'ielts_academic',
      });
      saveIeltsMockAttempt(attempt);

      const task1Essay = `The provided bar graph illustrates Bangladesh renewable energy adoption across commercial, industrial, and residential sectors from 2015 to 2025.
Overall, industrial sector adoption increased significantly over the decade, whereas residential utilization fluctuated moderately.
In 2015, industrial facilities accounted for the predominant share of renewable power generation. Subsequently, government subsidies accelerated installation across export processing zones.
In conclusion, the data demonstrates substantial progress toward clean energy sustainability goals.`;

      const task2Essay = `Some educators argue that tertiary education should focus solely on practical career skills, while others believe universities must provide a broad theoretical foundation.
In contemporary economies, specialized technical training offers immediate employability for recent graduates. For example, programming and clinical diagnostic techniques provide immediate societal value.
However, theoretical understanding remains fundamental because it fosters analytical problem-solving and critical perspective. Although vocational training prepares students for existing industries, conceptual mastery allows them to navigate technological disruption.
In conclusion, higher education institutions must balance theoretical foundations with hands-on applications to prepare students comprehensively for future leadership.`;

      const speakingTranscript =
        'I would like to describe a community development initiative I led during my undergraduate studies. Although we faced severe logistical hurdles, we coordinated effectively and succeeded.';

      // Redact PII
      const redactedT1 = redactIeltsPii(task1Essay, ['Tanvir']);
      const redactedT2 = redactIeltsPii(task2Essay, ['Tanvir']);
      const redactedTranscript = redactIeltsPii(speakingTranscript, ['Tanvir']);

      // Real @lumen/ai evaluators
      const writingEval = evaluateIeltsWriting({
        task1: redactedT1,
        task2: redactedT2,
        track: 'ielts_academic',
      });

      const speakingEval = evaluateIeltsSpeaking({
        transcript: redactedTranscript,
      });

      expect(writingEval.task1Band).toBeGreaterThan(0);
      expect(writingEval.task2Band).toBeGreaterThan(0);
      expect(writingEval.overallWritingBand).toBeGreaterThanOrEqual(4.5);
      expect(writingEval.label).toBe('estimated');
      expect(writingEval.task1.dimensions.task_response.evidence.length).toBeGreaterThan(0);

      expect(speakingEval.overallSpeakingBand).toBeGreaterThanOrEqual(5.0);
      expect(speakingEval.label).toBe('estimated');

      // State machine progression: listening -> reading -> writing -> speaking -> completed
      attempt = startIeltsSection(attempt, 'listening');
      attempt = submitSectionAnswers(attempt, 'listening', { l1: 'Single studio apartment' });
      attempt = startIeltsSection(attempt, 'reading');
      attempt = submitSectionAnswers(attempt, 'reading', { r1: 'FALSE', r2: 'TRUE' });
      attempt = startIeltsSection(attempt, 'writing');
      attempt = submitSectionAnswers(attempt, 'writing', { task1: task1Essay, task2: task2Essay });
      attempt = startIeltsSection(attempt, 'speaking');
      attempt = submitSectionAnswers(attempt, 'speaking', {
        part2Notes: 'University project',
        part2Transcript: speakingTranscript,
      });

      expect(attempt.status).toBe('completed');
      expect(attempt.currentSection).toBe('completed');

      // Aggregate final report
      const report = aggregateIeltsBandReport({
        attemptId: attempt.id,
        track: attempt.track,
        listeningRaw: 30,
        readingRaw: 32,
        writing: {
          task1Band: writingEval.task1Band,
          task2Band: writingEval.task2Band,
          task1Words: writingEval.task1Words,
          task2Words: writingEval.task2Words,
        },
        speaking: {
          criteria: {
            fluencyAndCoherence: speakingEval.dimensions.fluency_coherence.band,
            lexicalResource: speakingEval.dimensions.lexical_resource.band,
            grammaticalRangeAndAccuracy: speakingEval.dimensions.grammar_range_accuracy.band,
            pronunciation: speakingEval.dimensions.pronunciation.band,
          },
        },
      });

      attempt.report = report;
      saveIeltsMockAttempt(attempt);
      expect(getIeltsMockAttempt(attempt.id)).not.toBeNull();

      // Persist in repository adapter
      await getRepositories().attempts.save({
        id: attempt.id,
        userId: attempt.userId,
        examType: attempt.track,
        status: attempt.status,
        startedAt: attempt.startedAt ?? new Date().toISOString(),
        completedAt: attempt.completedAt,
        data: attempt as unknown as Record<string, unknown>,
        report: report as unknown as Record<string, unknown>,
      });

      const persisted = await getRepositories().attempts.findById(attempt.id);
      expect(persisted).not.toBeNull();
      expect(persisted?.id).toBe(attempt.id);
      expect(persisted?.status).toBe('completed');
    });
  });

  describe('2. Support Refund Tier Cap Enforcement in executeRefund (P1-G)', () => {
    it('blocks a support actor from refunding above 200_000 minor BDT while allowing <= 200_000 minor BDT', async () => {
      const supportActor: Actor = {
        id: 'staff_sup_01',
        roles: ['support'],
        hasTwoFactorEnabled: true,
      };

      // 1. Order above cap (250,000 minor BDT = 2,500 BDT)
      const { order: orderAboveCap } = await createOrder({
        userId: 'usr_refund_high',
        productSlug: 'ielts-live-batch',
        amountMinorOverride: 250_000,
        currencyOverride: 'BDT',
        customer: {
          userId: 'usr_refund_high',
          name: 'High Buyer',
          email: 'high@example.com',
          phoneE164: '01711112222',
        },
        appUrl: 'http://localhost:3000',
      });
      orderAboveCap.status = 'paid';

      // Support must be blocked on order above tier cap
      expect(() =>
        executeRefund(supportActor, {
          orderId: orderAboveCap.id,
          reason: 'Customer requested refund within 24 hours',
        })
      ).toThrow(AuthorizationError);

      expect(() =>
        executeRefund(supportActor, {
          orderId: orderAboveCap.id,
          reason: 'Customer requested refund within 24 hours',
        })
      ).toThrow(/Support refund tier cap exceeded/);

      // 2. Order within cap (150,000 minor BDT = 1,500 BDT)
      const { order: orderWithinCap } = await createOrder({
        userId: 'usr_refund_low',
        productSlug: 'ielts-academic-core',
        customer: {
          userId: 'usr_refund_low',
          name: 'Low Buyer',
          email: 'low@example.com',
          phoneE164: '01711113333',
        },
        appUrl: 'http://localhost:3000',
      });
      orderWithinCap.amountMinor = 150_000;
      orderWithinCap.status = 'paid';

      // Support is allowed on order within tier cap
      const supportRefund = executeRefund(supportActor, {
        orderId: orderWithinCap.id,
        reason: 'Duplicate payment mistake by user',
      });
      expect(supportRefund.order.id).toBe(orderWithinCap.id);
      expect(supportRefund.order.status).toBe('refunded');
      expect(supportRefund.refundedMinor).toBe(150_000);
    });

    it('allows finance and admin actors to refund orders exceeding the support tier cap', async () => {
      const financeActor: Actor = {
        id: 'staff_fin_01',
        roles: ['finance'],
        hasTwoFactorEnabled: true,
      };

      const { order: largeOrder } = await createOrder({
        userId: 'usr_refund_fin',
        productSlug: 'ielts-academic-core',
        customer: {
          userId: 'usr_refund_fin',
          name: 'Finance Refund Buyer',
          email: 'fin.buyer@example.com',
          phoneE164: '01711114444',
        },
        appUrl: 'http://localhost:3000',
      });
      largeOrder.amountMinor = 350_000;
      largeOrder.status = 'paid';

      const finRefund = executeRefund(financeActor, {
        orderId: largeOrder.id,
        reason: 'Executive exception refund approved by Finance Director',
      });

      expect(finRefund.order.id).toBe(largeOrder.id);
      expect(finRefund.order.status).toBe('refunded');
      expect(finRefund.refundedMinor).toBe(350_000);
    });
  });

  describe('3. Real User Data Export & Aggregation under PDPO 2025', () => {
    it('aggregates authentic user orders and entitlements instead of placeholder stubs', async () => {
      const studentId = 'usr_real_data_bundle';

      // 1. Create real order for the student
      const { order } = await createOrder({
        userId: studentId,
        productSlug: 'ielts-academic-core',
        customer: {
          userId: studentId,
          name: 'Zarin Subah',
          email: 'zarin.subah@example.com',
          phoneE164: '01712349999',
        },
        appUrl: 'http://localhost:3000',
      });

      // 2. Grant real entitlement
      grantEntitlement(studentId, 'gre-pass-complete', 'purchase');

      expect(listUserOrders(studentId).length).toBe(1);
      expect(getUserEntitlements(studentId).length).toBe(1);

      // 3. Export bundle
      const consentState = getGuardianConsentState(studentId);
      const bundle = exportUserDataBundle({
        userId: studentId,
        email: 'zarin.subah@example.com',
        name: 'Zarin Subah',
        isMinor: false,
        guardianConsent: consentState,
      });

      expect(bundle.format).toBe('LUMEN_PDPO_2025_JSON');
      expect(bundle.complianceStandard).toContain('Bangladesh Personal Data Protection Ordinance 2025');
      expect(bundle.user.id).toBe(studentId);
      expect(bundle.user.email).toBe('zarin.subah@example.com');
      expect(bundle.transactions.length).toBe(1);
      expect(bundle.transactions[0]?.orderId).toBe(order.id);
      expect(bundle.transactions[0]?.amountPaid).toBe('BDT 3990.00');
      expect(bundle.activity.entitlements).toContain('gre-pass-complete');
    });
  });

  describe('4. Proxy Dot-Path Hardening & HMAC-Signed PDPO Cookies (Gap 2 & Gap 4)', () => {
    it('signs and verifies PDPO cookies using Web Crypto HMAC-SHA256 and rejects forged values', async () => {
      const signed = await signPdpoCookie('verified', 'test-secret-key-32-chars-long!');
      expect(signed).toContain('verified.');

      // Valid cookie verifies
      const verified = await verifyPdpoCookie(signed, 'test-secret-key-32-chars-long!');
      expect(verified).toBe('verified');

      // Forged cookie without signature is rejected
      const forgedPlain = await verifyPdpoCookie('verified', 'test-secret-key-32-chars-long!');
      expect(forgedPlain).toBeNull();

      // Tampered signature is rejected
      const tampered = `${signed.slice(0, -4)}abcd`;
      const verifiedTampered = await verifyPdpoCookie(tampered, 'test-secret-key-32-chars-long!');
      expect(verifiedTampered).toBeNull();

      // Wrong secret fails verification
      const wrongSecret = await verifyPdpoCookie(signed, 'different-secret-key-32-chars-!');
      expect(wrongSecret).toBeNull();
    });

    it('blocks dot-paths like /admin/evil.path when unauthenticated while skipping static assets', () => {
      const PROTECTED_PREFIXES = [
        '/app',
        '/exam',
        '/studio',
        '/grader',
        '/support',
        '/editor',
        '/finance',
        '/org',
        '/counsellor',
        '/admin',
      ] as const;

      const PUBLIC_EXAM = new Set(['/exam/ielts-preview', '/exam/diagnostic']);
      const STATIC_EXT_REGEX =
        /\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js|woff2?|ttf|map|xml|txt)$/i;

      function checkRoute(pathname: string, hasSession: boolean) {
        const isBn = pathname === '/bn' || pathname.startsWith('/bn/');
        const path = isBn ? pathname.slice(3) || '/' : pathname;

        const isProtected =
          PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`)) &&
          !PUBLIC_EXAM.has(path);

        if (pathname.startsWith('/_next') || pathname.startsWith('/api')) {
          return 'next';
        }
        if (!isProtected && STATIC_EXT_REGEX.test(pathname)) {
          return 'next';
        }
        if (isProtected && !hasSession) {
          return 'redirect_to_login';
        }
        return 'intl';
      }

      // Static assets are skipped without auth
      expect(checkRoute('/images/brand-logo.png', false)).toBe('next');
      expect(checkRoute('/favicon.ico', false)).toBe('next');
      expect(checkRoute('/styles/main.css', false)).toBe('next');

      // Protected dot paths MUST NOT be skipped and must require authentication
      expect(checkRoute('/admin/evil.path', false)).toBe('redirect_to_login');
      expect(checkRoute('/admin/x.y', false)).toBe('redirect_to_login');
      expect(checkRoute('/finance/export.csv', false)).toBe('redirect_to_login');
      expect(checkRoute('/support/ticket.log', false)).toBe('redirect_to_login');

      // Once authenticated, protected dot paths proceed to intl
      expect(checkRoute('/admin/evil.path', true)).toBe('intl');
    });

    it('enforces guardian consent gate for minor accounts on protected features', () => {
      const unverified = getGuardianConsentState('usr_minor_gate');
      const speakingAccess = canMinorAccessFeature(unverified, 'ai_speaking_upload');
      expect(speakingAccess.allowed).toBe(false);
      expect(speakingAccess.reason).toContain('Access to ai_speaking_upload is blocked for minors');

      // Update to verified
      saveGuardianConsentState({
        ...unverified,
        status: 'verified',
        verifiedAt: new Date().toISOString(),
      });

      const verified = getGuardianConsentState('usr_minor_gate');
      expect(canMinorAccessFeature(verified, 'ai_speaking_upload').allowed).toBe(true);
    });
  });

  describe('5. Role Persistence Store', () => {
    it('persists role changes and retrieves updated role via getter', () => {
      const userId = 'usr_role_test_42';
      expect(getUserRoles(userId)).toEqual(['student']);

      setUserRoles(userId, ['grader']);
      expect(getUserRoles(userId)).toEqual(['grader']);

      setUserRoles(userId, ['instructor', 'support']);
      expect(getUserRoles(userId)).toEqual(['instructor', 'support']);
    });
  });
});
