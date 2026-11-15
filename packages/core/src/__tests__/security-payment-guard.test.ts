/** @purpose Automated unit test suite for OWASP ASVS & PCI-DSS SAQ-A security modules, canonical BDT price lock, HMAC-SHA256 webhooks, and open-redirect/CSRF guards */

import fs from 'node:fs';
import path from 'node:path';
import { beforeEach, describe, expect, it } from 'vitest';
import {
  SECURITY_POLICY,
  checkRateLimit,
  resetRateLimitStore,
} from '../../../../apps/web/src/lib/security/policy';
import {
  CANONICAL_BDT_PLANS,
  PaymentSecurityError,
  clearIdempotencyReplayCache,
  computeCanonicalOrder,
  signWebhookPayload,
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
  });

  describe('1. Canonical BDT Ledger & Price Tamper Rejection', () => {
    it('computes exact VAT-inclusive canonical totals and installment schedules', () => {
      const ielts = computeCanonicalOrder('ielts-complete', 1);
      expect(ielts.totalBdt).toBe(4990);
      expect(ielts.vat15Bdt).toBe(Math.round((4990 * 15) / 115));
      expect(ielts.baseTuitionBdt + ielts.vat15Bdt).toBe(4990);
      expect(ielts.dueTodayBdt).toBe(4990);

      const greSplit3 = computeCanonicalOrder('gre-complete', 3);
      expect(greSplit3.totalBdt).toBe(5990);
      expect(greSplit3.installmentSchedule).toHaveLength(3);
      const sum3 = greSplit3.installmentSchedule.reduce((acc, row) => acc + row.amountBdt, 0);
      expect(sum3).toBe(5990);

      expect(CANONICAL_BDT_PLANS['free-diagnostic']?.totalBdt).toBe(0);
      expect(CANONICAL_BDT_PLANS['live-cohort']?.totalBdt).toBe(12990);
      expect(CANONICAL_BDT_PLANS['gre-core']?.totalBdt).toBe(5990);
      expect(CANONICAL_BDT_PLANS['gre-plus']?.totalBdt).toBe(8490);
      expect(CANONICAL_BDT_PLANS['gre-live']?.totalBdt).toBe(12990);
      expect(CANONICAL_BDT_PLANS['all-access']?.totalBdt).toBe(9990);
    });

    it('rejects client price tampering (4990 -> 100 or 4989) with SECURITY_PRICE_TAMPER_DETECTED', () => {
      expect(() => verifyClientAmountNotTampered('ielts-complete', 4990)).not.toThrow();

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
});
