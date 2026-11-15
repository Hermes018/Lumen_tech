/** @purpose Automated unit test suite for OWASP ASVS & PCI-DSS SAQ-A security modules, canonical BDT price lock, HMAC-SHA256 webhooks, and open-redirect/CSRF guards */

import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  buildCsvString,
  buildExcelSpreadsheetXml,
  buildPrintableHtmlDocument,
  type InstitutionalReportPayload,
} from '../../../../apps/web/src/lib/export-reports';
import {
  SECURITY_POLICY,
  checkRateLimit,
  resetRateLimitStore,
} from '../../../../apps/web/src/lib/security/policy';
import {
  CANONICAL_BDT_PLANS,
  CANONICAL_PROMO_CODES,
  SPLIT_PROCESSING_FEE_RATES,
  PaymentSecurityError,
  addRuntimePlan,
  applyRuntimeCmsUpdate,
  applyRuntimeOrderAction,
  applyRuntimeScholarAction,
  clearIdempotencyReplayCache,
  computeCanonicalOrder,
  computeFinancialSummary,
  getRuntimeCatalog,
  recordRuntimeLedgerEntry,
  resetRuntimeCatalogToDefaults,
  signWebhookPayload,
  toggleRuntimeFeatureFlag,
  toggleRuntimePromoCode,
  updateRuntimeFeeRates,
  updateRuntimePlan,
  upsertRuntimePromoCode,
  verifyClientAmountNotTampered,
  verifyIdempotencyAndTimestamp,
  verifyWebhookHmacSignature,
} from '../../../../apps/web/src/lib/security/payment-guard';
import {
  sanitizeInternalRedirect,
  verifySameOriginCsrf,
} from '../../../../apps/web/src/lib/security/redirect-guard';

describe('Batch P20 Modular Cybersecurity & Payment Integrity Suite', () => {
  beforeEach(() => {
    clearIdempotencyReplayCache();
    resetRateLimitStore();
    resetRuntimeCatalogToDefaults();
  });

  describe('1. Canonical BDT & USD Ledger, Split-Pay Clearing Fees, Promo Codes & Tamper Rejection', () => {
    it('computes exact VAT-inclusive canonical BDT totals and installment schedules', () => {
      const ielts = computeCanonicalOrder('ielts-complete', 1);
      expect(ielts.totalBdt).toBe(4990);
      expect(ielts.vat15Bdt).toBe(Math.round((4990 * 15) / 115));
      expect(ielts.baseTuitionBdt + ielts.vat15Bdt).toBe(4990);
      expect(ielts.dueTodayBdt).toBe(4990);
      expect(ielts.processingFeeRate).toBe(0);
      expect(ielts.processingFee).toBe(0);

      const greSplit3 = computeCanonicalOrder('gre-complete', 'split-3', 'BDT');
      expect(greSplit3.processingFeeRate).toBe(SPLIT_PROCESSING_FEE_RATES['split-3']);
      expect(greSplit3.processingFee).toBe(Math.round(8500 * 0.0475));
      const expectedSubtotal = 8500 + Math.round(8500 * 0.0475);
      const expectedVat = Math.round(expectedSubtotal * 0.15);
      expect(greSplit3.totalAmount).toBe(expectedSubtotal + expectedVat);
      expect(greSplit3.installmentSchedule).toHaveLength(3);
      const sum3 = greSplit3.installmentSchedule.reduce((acc, row) => acc + row.amountBdt, 0);
      expect(sum3).toBe(greSplit3.totalAmount);

      expect(CANONICAL_BDT_PLANS['free-diagnostic']?.totalBdt).toBe(0);
      expect(CANONICAL_BDT_PLANS['live-cohort']?.totalBdt).toBe(12990);
      expect(CANONICAL_BDT_PLANS['gre-core']?.totalBdt).toBe(5990);
      expect(CANONICAL_BDT_PLANS['gre-plus']?.totalBdt).toBe(8490);
      expect(CANONICAL_BDT_PLANS['gre-live']?.totalBdt).toBe(12990);
      expect(CANONICAL_BDT_PLANS['all-access']?.totalBdt).toBe(9990);
      expect(CANONICAL_BDT_PLANS['gre-complete']?.baseBdt).toBe(8500);
      expect(CANONICAL_BDT_PLANS['gre-complete']?.baseUsd).toBe(79);
      expect(CANONICAL_BDT_PLANS['ielts-academic']?.baseUsd).toBe(69);
      expect(CANONICAL_BDT_PLANS['ielts-gt']?.baseUsd).toBe(59);
      expect(CANONICAL_BDT_PLANS['dual-prep-bundle']?.baseUsd).toBe(119);
      expect(CANONICAL_BDT_PLANS['mock-ai-pass']?.baseUsd).toBe(25);
    });

    it('computes USD international pricing (0% BD VAT), +2.85% 2-part split fee, and LUMEN10/DU20 promo codes', () => {
      expect(SPLIT_PROCESSING_FEE_RATES.full).toBe(0);
      expect(SPLIT_PROCESSING_FEE_RATES['split-2']).toBe(0.0285);
      expect(SPLIT_PROCESSING_FEE_RATES['split-3']).toBe(0.0475);
      expect(CANONICAL_PROMO_CODES.LUMEN10?.value).toBe(10);
      expect(CANONICAL_PROMO_CODES.DU20?.value).toBe(20);

      const usdFullPromo = computeCanonicalOrder('gre-complete', 'full', 'USD', 'lumen10');
      expect(usdFullPromo.currency).toBe('USD');
      expect(usdFullPromo.promoCodeApplied).toBe('LUMEN10');
      expect(usdFullPromo.discountAmount).toBe(7.9);
      expect(usdFullPromo.discountedBase).toBe(71.1);
      expect(usdFullPromo.processingFee).toBe(0);
      expect(usdFullPromo.vatAmount).toBe(0);
      expect(usdFullPromo.totalAmount).toBe(71.1);

      const usdSplit2 = computeCanonicalOrder('dual-prep-bundle', 'split-2', 'USD', 'DU20');
      expect(usdSplit2.promoCodeApplied).toBe('DU20');
      expect(usdSplit2.discountAmount).toBe(23.8);
      expect(usdSplit2.discountedBase).toBe(95.2);
      expect(usdSplit2.processingFee).toBe(Number((95.2 * 0.0285).toFixed(2)));
      expect(usdSplit2.vatAmount).toBe(0);
      expect(usdSplit2.totalAmount).toBe(Number((95.2 + usdSplit2.processingFee).toFixed(2)));
      expect(usdSplit2.installmentNowAmount + usdSplit2.installmentLaterAmount).toBeCloseTo(
        usdSplit2.totalAmount,
        2,
      );
    });

    it('rejects client price tampering (4990 -> 100 or 4989) with SECURITY_PRICE_TAMPER_DETECTED', () => {
      expect(() => verifyClientAmountNotTampered('ielts-complete', 4990)).not.toThrow();
      const usdOrder = computeCanonicalOrder('gre-complete', 'split-2', 'USD', 'LUMEN10');
      expect(() =>
        verifyClientAmountNotTampered('gre-complete', usdOrder.totalAmount, 'split-2', 'USD', 'LUMEN10'),
      ).not.toThrow();

      expect(() => verifyClientAmountNotTampered('ielts-complete', 100)).toThrow(
        'SECURITY_PRICE_TAMPER_DETECTED',
      );
      expect(() => verifyClientAmountNotTampered('ielts-complete', 4989)).toThrow(
        PaymentSecurityError,
      );
      expect(() => verifyClientAmountNotTampered('ielts-complete', Number.NaN)).toThrow(
        'SECURITY_PRICE_TAMPER_DETECTED',
      );
    });

    it('rejects unknown plans, prototype keys, and split-pay on plans under 4990 BDT', () => {
      expect(() => computeCanonicalOrder('non-existent-plan', 1)).toThrow('SECURITY_UNKNOWN_PLAN');
      expect(() => computeCanonicalOrder('toString', 1)).toThrow('SECURITY_UNKNOWN_PLAN');
      expect(() => computeCanonicalOrder('free-diagnostic', 2)).toThrow(
        'SECURITY_SPLIT_PAY_NOT_ELIGIBLE',
      );
      expect(() => computeCanonicalOrder('ielts-academic-core', 3)).toThrow(
        'SECURITY_SPLIT_PAY_NOT_ELIGIBLE',
      );
    });
  });

  describe('2. Idempotency & Replay Window Guard', () => {
    it('accepts fresh valid idempotency keys and rejects replays', () => {
      const nowMs = 1_760_000_000_000;
      const key = 'chk_order_abc123_xyz789';

      const first = verifyIdempotencyAndTimestamp({
        idempotencyKey: key,
        timestampMs: nowMs - 10_000,
        nowMs,
      });
      expect(first.ok).toBe(true);

      expect(() =>
        verifyIdempotencyAndTimestamp({
          idempotencyKey: key,
          timestampMs: nowMs - 5_000,
          nowMs,
        }),
      ).toThrow('SECURITY_IDEMPOTENCY_REPLAY_DETECTED');
    });

    it('rejects expired timestamps (> 300s old), future skew, and malformed keys', () => {
      const nowMs = 1_760_000_000_000;
      const expiredMs = nowMs - (SECURITY_POLICY.webhookReplayWindowSeconds + 1) * 1000;
      const futureMs = nowMs + (SECURITY_POLICY.webhookReplayWindowSeconds + 1) * 1000;

      expect(() =>
        verifyIdempotencyAndTimestamp({
          idempotencyKey: 'valid_idempotency_key_001',
          timestampMs: expiredMs,
          nowMs,
        }),
      ).toThrow('SECURITY_TIMESTAMP_OUT_OF_WINDOW');

      expect(() =>
        verifyIdempotencyAndTimestamp({
          idempotencyKey: 'valid_idempotency_key_002',
          timestampMs: futureMs,
          nowMs,
        }),
      ).toThrow('SECURITY_TIMESTAMP_OUT_OF_WINDOW');

      expect(() =>
        verifyIdempotencyAndTimestamp({
          idempotencyKey: 'short',
          timestampMs: nowMs,
          nowMs,
        }),
      ).toThrow('SECURITY_INVALID_IDEMPOTENCY_KEY');
    });
  });

  describe('3. HMAC-SHA256 Constant-Time Webhook Verification', () => {
    it('verifies valid signatures and rejects forged or mutated payloads', () => {
      const secret = 'test-webhook-hmac-secret-32-chars-min';
      const payload = JSON.stringify({ tran_id: 'TXN_9981', amount: 5990, currency: 'BDT' });
      const validSig = signWebhookPayload(payload, secret);

      expect(verifyWebhookHmacSignature(payload, validSig, secret)).toBe(true);
      expect(verifyWebhookHmacSignature(payload, `sha256=${validSig}`, secret)).toBe(true);

      const forgedSig = validSig.replace(/^./, (c) => (c === 'a' ? 'b' : 'a'));
      expect(verifyWebhookHmacSignature(payload, forgedSig, secret)).toBe(false);

      const tamperedPayload = JSON.stringify({ tran_id: 'TXN_9981', amount: 100, currency: 'BDT' });
      expect(verifyWebhookHmacSignature(tamperedPayload, validSig, secret)).toBe(false);

      expect(verifyWebhookHmacSignature(payload, 'not-valid-hex', secret)).toBe(false);
      expect(verifyWebhookHmacSignature(payload, '', secret)).toBe(false);
    });
  });

  describe('4. Open-Redirect Neutralization & Same-Origin CSRF Guard', () => {
    it('neutralizes external, protocol-relative, backslash, and script redirect payloads to /app', () => {
      expect(sanitizeInternalRedirect('https://evil.com')).toBe('/app');
      expect(sanitizeInternalRedirect('http://evil.com/phish')).toBe('/app');
      expect(sanitizeInternalRedirect('//evil.com')).toBe('/app');
      expect(sanitizeInternalRedirect('/\\evil.com')).toBe('/app');
      expect(sanitizeInternalRedirect('/%2f/evil.com')).toBe('/app');
      expect(sanitizeInternalRedirect('javascript:alert(1)')).toBe('/app');
      expect(sanitizeInternalRedirect('data:text/html,<script>alert(1)</script>')).toBe('/app');
      expect(sanitizeInternalRedirect('/unlisted-bounce')).toBe('/app');
      expect(sanitizeInternalRedirect(null)).toBe('/app');

      expect(sanitizeInternalRedirect('/app/vocab')).toBe('/app/vocab');
      expect(sanitizeInternalRedirect('/checkout?plan=gre-complete')).toBe('/checkout?plan=gre-complete');
      expect(sanitizeInternalRedirect('/bn/courses')).toBe('/bn/courses');
    });

    it('enforces same-origin host checks for POST requests', () => {
      expect(
        verifySameOriginCsrf({ origin: 'https://lumen.academy', host: 'lumen.academy' }),
      ).toBe(true);
      expect(
        verifySameOriginCsrf({ origin: 'http://localhost:3000', host: 'localhost:3000' }),
      ).toBe(true);
      expect(
        verifySameOriginCsrf({ origin: 'https://evil.com', host: 'lumen.academy' }),
      ).toBe(false);
      expect(
        verifySameOriginCsrf({ origin: 'null', host: 'lumen.academy' }),
      ).toBe(false);
      expect(verifySameOriginCsrf({ origin: null, host: 'lumen.academy' })).toBe(false);
    });
  });

  describe('5. Rate Limiter & Security Headers Verification', () => {
    it('enforces per-minute checkout rate limits from SECURITY_POLICY', () => {
      const now = 1_760_000_000_000;
      const limit = SECURITY_POLICY.rateLimits.checkoutPerMinute;
      for (let i = 0; i < limit; i += 1) {
        expect(checkRateLimit('checkout:127.0.0.1', limit, now + i).allowed).toBe(true);
      }
      const blocked = checkRateLimit('checkout:127.0.0.1', limit, now + limit);
      expect(blocked.allowed).toBe(false);
      expect(blocked.remaining).toBe(0);
    });

    it('verifies required OWASP response headers exist in apps/web/next.config.ts', () => {
      const nextConfigPath = path.resolve(__dirname, '../../../../apps/web/next.config.ts');
      const content = fs.readFileSync(nextConfigPath, 'utf8');

      expect(content).toContain("key: 'X-Content-Type-Options'");
      expect(content).toContain("value: 'nosniff'");
      expect(content).toContain("key: 'X-Frame-Options'");
      expect(content).toContain("value: 'DENY'");
      expect(content).toContain("key: 'Referrer-Policy'");
      expect(content).toContain("value: 'strict-origin-when-cross-origin'");
      expect(content).toContain("key: 'Permissions-Policy'");
      expect(content).toContain('camera=(), microphone=(self), geolocation=()');
    });
  });

  describe('6. Batch P24 Runtime Admin Catalog, Fee, Promo & ERP Sync', () => {
    it('reflects live Admin plan price updates and rejects stale pre-edit client totals', () => {
      const before = computeCanonicalOrder('gre-complete', 'full', 'BDT');
      expect(before.totalAmount).toBe(9775); // 8500 + 15% VAT (1275)

      updateRuntimePlan('gre-complete', { baseBdt: 10000, baseUsd: 95 });

      const afterBdt = computeCanonicalOrder('gre-complete', 'full', 'BDT');
      expect(afterBdt.rawBase).toBe(10000);
      expect(afterBdt.vatAmount).toBe(1500);
      expect(afterBdt.totalAmount).toBe(11500);

      const afterUsd = computeCanonicalOrder('gre-complete', 'full', 'USD');
      expect(afterUsd.totalAmount).toBe(95);

      // Tamper check rejects old price 9775 and accepts new canonical 11500
      expect(() => verifyClientAmountNotTampered('gre-complete', 9775, 'full', 'BDT')).toThrow(
        'SECURITY_PRICE_TAMPER_DETECTED',
      );
      expect(() => verifyClientAmountNotTampered('gre-complete', 11500, 'full', 'BDT')).not.toThrow();

      resetRuntimeCatalogToDefaults();
      expect(computeCanonicalOrder('gre-complete', 'full', 'BDT').totalAmount).toBe(9775);
    });

    it('supports creating custom packages, updating split-pay/VAT fee rates, and percent/fixed promos', () => {
      addRuntimePlan({
        planId: 'buet-quant-sprint',
        nameEn: 'BUET Quant Sprint',
        baseBdt: 6000,
        baseUsd: 55,
        allowSplit: true,
      });

      updateRuntimeFeeRates({ split2Rate: 0.03, split3Rate: 0.05, vatRateBdt: 0.1 });

      upsertRuntimePromoCode({
        code: 'BUET25',
        discountType: 'percent',
        value: 25,
        active: true,
      });
      upsertRuntimePromoCode({
        code: 'CORP50',
        discountType: 'fixed',
        value: 500,
        active: true,
      });

      const orderPercent = computeCanonicalOrder('buet-quant-sprint', 'split-2', 'BDT', 'BUET25');
      // 6000 - 25% (1500) = 4500; +3% (135) = 4635; +10% VAT (464) = 5099
      expect(orderPercent.promoCodeApplied).toBe('BUET25');
      expect(orderPercent.discountAmount).toBe(1500);
      expect(orderPercent.processingFeeRate).toBe(0.03);
      expect(orderPercent.processingFee).toBe(135);
      expect(orderPercent.vatAmount).toBe(464);
      expect(orderPercent.totalAmount).toBe(5099);

      const orderFixed = computeCanonicalOrder('buet-quant-sprint', 'full', 'BDT', 'CORP50');
      // 6000 - 500 = 5500; +10% VAT (550) = 6050
      expect(orderFixed.discountAmount).toBe(500);
      expect(orderFixed.totalAmount).toBe(6050);

      // Paused promo code is ignored
      toggleRuntimePromoCode('CORP50', false);
      const afterPause = computeCanonicalOrder('buet-quant-sprint', 'full', 'BDT', 'CORP50');
      expect(afterPause.promoCodeApplied).toBeNull();
      expect(afterPause.discountAmount).toBe(0);

      // Disabling splitPayEnabled kill-switch rejects split-pay
      toggleRuntimeFeatureFlag('splitPayEnabled', false);
      expect(() => computeCanonicalOrder('buet-quant-sprint', 'split-2', 'BDT')).toThrow(
        'SECURITY_SPLIT_PAY_NOT_ELIGIBLE',
      );
    });

    it('records ERP order, CMS moderation, and scholar CRM mutations in the audit log', () => {
      applyRuntimeOrderAction('LMN-2026-8841', 'issue_mushak', '009988776-0101');
      applyRuntimeCmsUpdate({
        kind: 'moderate',
        submissionId: 'SUB-4091',
        decision: 'approve',
        feedbackNote: 'Strong Band 7.5 cohesion.',
      });
      applyRuntimeScholarAction('SCH-01', 'grant_ai_credits', { credits: 10 });

      const snap = getRuntimeCatalog();
      const order = snap.orders.find((o) => o.id === 'LMN-2026-8841');
      expect(order?.mushakVerified).toBe(true);
      expect(order?.corporateBin).toBe('009988776-0101');

      const sub = snap.moderationQueue.find((m) => m.id === 'SUB-4091');
      expect(sub?.status).toBe('Approved');

      const scholar = snap.scholars.find((s) => s.id === 'SCH-01');
      expect(scholar?.aiCreditsRemaining).toBe(34);

      expect(snap.auditLogs[0]?.action).toBe('SCHOLAR_GRANT_AI_CREDITS');
    });
  });

  describe('Enterprise Banking, Double-Entry Ledger & Universal Export Engine (BATCH P37)', () => {
    it('computes live P&L financial summary and updates treasury cash on RECORD_LEDGER_ENTRY', () => {
      resetRuntimeCatalogToDefaults('Test Runner');
      const initialSnap = getRuntimeCatalog();
      expect(initialSnap.bankAccounts.length).toBe(4);
      expect(initialSnap.ledgerEntries.length).toBeGreaterThanOrEqual(11);

      const initialSummary = computeFinancialSummary(initialSnap);
      expect(initialSummary.grossRevenueBdt).toBeGreaterThan(0);
      expect(initialSummary.grossRevenueUsd).toBeGreaterThan(0);
      expect(initialSummary.vatPayableMushakBdt).toBeGreaterThan(0);
      expect(initialSummary.totalExpensesBdt).toBeGreaterThan(0);
      expect(initialSummary.accountsReceivableSplitBdt).toBe(5027);
      expect(initialSummary.totalTreasuryCashBdt).toBe(642500 + 184220 + 92450);
      expect(initialSummary.totalTreasuryCashUsd).toBe(4860);

      const bracBefore = initialSnap.bankAccounts.find((a) => a.id === 'BANK-BDT-BRAC')?.balance ?? 0;
      const updatedSnap = recordRuntimeLedgerEntry(
        {
          type: 'PAYOUT',
          category: 'EXPENSE_EVALUATOR_PAYOUT',
          description: 'November Blind Evaluator Settlement',
          amount: 15000,
          currency: 'BDT',
          accountId: 'BANK-BDT-BRAC',
          referenceId: 'PAY-EVAL-TEST-01',
        },
        'Admin Tester',
      );

      const bracAfter = updatedSnap.bankAccounts.find((a) => a.id === 'BANK-BDT-BRAC')?.balance ?? 0;
      expect(bracAfter).toBe(bracBefore - 15000);
      expect(updatedSnap.ledgerEntries[0]?.referenceId).toBe('PAY-EVAL-TEST-01');
      expect(updatedSnap.auditLogs[0]?.action).toBe('RECORD_LEDGER_ENTRY');

      const updatedSummary = computeFinancialSummary(updatedSnap);
      expect(updatedSummary.totalExpensesBdt).toBe(initialSummary.totalExpensesBdt + 15000);

      expect(() =>
        recordRuntimeLedgerEntry({
          type: 'EXPENSE',
          category: 'EXPENSE_MARKETING',
          description: 'Invalid negative',
          amount: -500,
          currency: 'BDT',
          accountId: 'BANK-BDT-BRAC',
          referenceId: 'BAD-1',
        }),
      ).toThrow('SECURITY_PRICE_TAMPER_DETECTED');
    });

    it('generates RFC-4180 UTF-8 BOM CSV, SpreadsheetML Excel XML, and A4 Printable HTML', () => {
      const payload: InstitutionalReportPayload = {
        reportId: 'LMN-FIN-20261115',
        documentTitle: 'Institutional Treasury & Mushak 6.3 Filing',
        subtitle: 'Consolidated P&L & Double-Entry Ledger',
        organizationName: 'Institutional Academy',
        generatedByRole: 'Institutional Admin',
        generatedAtIso: '2026-11-15T12:00:00.000Z',
        currencyNote: 'BDT ৳ & USD $',
        verificationHash: 'HMAC-SHA256:TESTHASH1234',
        sheets: [
          {
            sheetName: 'Summary P&L / Test: [2026]',
            title: 'Consolidated P&L',
            summaryMetrics: [{ label: 'Gross Revenue', value: '৳322,737' }],
            columns: [
              { key: 'item', header: 'Line Item', align: 'left' },
              { key: 'amount', header: 'Amount (BDT)', align: 'right' },
            ],
            rows: [
              { item: 'আইইএলটিএস টিউশন (BDT ৳)', amount: 6490 },
              { item: 'Evaluator Payout, "Batch 1"', amount: -28000 },
            ],
          },
          {
            sheetName: 'Treasury Accounts',
            title: 'Bank Accounts',
            columns: [{ key: 'acct', header: 'Account', align: 'left' }],
            rows: [{ acct: 'BRAC Bank PLC' }],
          },
        ],
      };

      const csv = buildCsvString(payload.sheets[0]!);
      expect(csv.startsWith('\uFEFF')).toBe(true);
      expect(csv).toContain('Line Item,Amount (BDT)');
      expect(csv).toContain('আইইএলটিএস টিউশন (BDT ৳),6490');
      expect(csv).toContain('"Evaluator Payout, ""Batch 1""",-28000');

      const xml = buildExcelSpreadsheetXml(payload);
      expect(xml).toContain('<?mso-application progid="Excel.Sheet"?>');
      expect(xml).toContain('<Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet"');
      expect(xml).toContain('<Worksheet ss:Name="Summary P&amp;L   Test   2026">');
      expect(xml).toContain('<Worksheet ss:Name="Treasury Accounts">');
      expect(xml).toContain('<Data ss:Type="Number">6490</Data>');
      expect(xml).toContain('ss:Color="#F6F1EA"');

      const html = buildPrintableHtmlDocument(payload);
      expect(html).toContain('<!DOCTYPE html>');
      expect(html).toContain('@media print');
      expect(html).toContain('HMAC-SHA256:TESTHASH1234');
      expect(html).toContain('Prepared By');
      expect(html).toContain('Verified By Compliance Auditor');
    });
  });
});
