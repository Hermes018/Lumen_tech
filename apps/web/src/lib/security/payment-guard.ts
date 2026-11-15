/** @purpose Server-side canonical BDT & USD price ledger, fractional split-pay fee calculator, promo code engine, anti-tampering check, idempotency/replay guard, and HMAC-SHA256 webhook verifier */

import crypto from 'node:crypto';
import { SECURITY_POLICY } from './policy';

export type PaymentSecurityErrorCode =
  | 'SECURITY_PRICE_TAMPER_DETECTED'
  | 'SECURITY_UNKNOWN_PLAN'
  | 'SECURITY_INVALID_SPLIT_PARTS'
  | 'SECURITY_SPLIT_PAY_NOT_ELIGIBLE'
  | 'SECURITY_INVALID_IDEMPOTENCY_KEY'
  | 'SECURITY_TIMESTAMP_OUT_OF_WINDOW'
  | 'SECURITY_IDEMPOTENCY_REPLAY_DETECTED';

export class PaymentSecurityError extends Error {
  readonly code: PaymentSecurityErrorCode;

  constructor(code: PaymentSecurityErrorCode, message?: string) {
    super(message ? `${code}: ${message}` : code);
    this.name = 'PaymentSecurityError';
    this.code = code;
  }
}

export type SupportedCurrency = 'BDT' | 'USD';
export type SplitMode = 'full' | 'split-2' | 'split-3';

export const SPLIT_PROCESSING_FEE_RATES = {
  full: 0,
  'split-2': 0.0285,
  'split-3': 0.0475,
} as const;

export interface CanonicalPromoCode {
  readonly code: string;
  readonly discountType: 'percent';
  readonly value: number;
  readonly active: boolean;
  readonly labelEn: string;
  readonly labelBn: string;
}

export const CANONICAL_PROMO_CODES: Readonly<Record<string, CanonicalPromoCode>> = Object.freeze({
  LUMEN10: {
    code: 'LUMEN10',
    discountType: 'percent',
    value: 10,
    active: true,
    labelEn: '10% Scholar Launch Grant',
    labelBn: '১০% স্কলার লঞ্চ ছাড়',
  },
  DU20: {
    code: 'DU20',
    discountType: 'percent',
    value: 20,
    active: true,
    labelEn: '20% University Cohort Grant',
    labelBn: '২০% বিশ্ববিদ্যালয় কোহর্ট ছাড়',
  },
});

export interface CanonicalBdtPlan {
  readonly planId: string;
  readonly label: string;
  readonly baseBdt: number;
  readonly baseUsd: number;
  readonly totalBdt: number;
  readonly splitPayEligible: boolean;
}

const SPLIT_PAY_MIN_BDT = 4990;

function definePlan(
  planId: string,
  label: string,
  baseBdt: number,
  baseUsd: number,
  explicitTotalBdt?: number,
): CanonicalBdtPlan {
  const totalBdt = explicitTotalBdt ?? baseBdt + Math.round(baseBdt * 0.15);
  return Object.freeze({
    planId,
    label,
    baseBdt,
    baseUsd,
    totalBdt,
    splitPayEligible: totalBdt >= SPLIT_PAY_MIN_BDT,
  });
}

export const CANONICAL_BDT_PLANS: Readonly<Record<string, CanonicalBdtPlan>> = Object.freeze({
  'free-diagnostic': definePlan('free-diagnostic', 'Free Diagnostic', 0, 0, 0),
  'ielts-complete': definePlan('ielts-complete', 'IELTS Complete', 4339, 49, 4990),
  'gre-complete': definePlan('gre-complete', 'GRE Complete', 8500, 79),
  'ielts-academic': definePlan('ielts-academic', 'IELTS Academic', 7500, 69),
  'ielts-gt': definePlan('ielts-gt', 'IELTS General Training', 6500, 59),
  'dual-prep-bundle': definePlan('dual-prep-bundle', 'GRE + IELTS Dual Prep Bundle', 13500, 119),
  'mock-ai-pass': definePlan('mock-ai-pass', 'Mock & AI Evaluation Pass', 2500, 25),
  'live-cohort': definePlan('live-cohort', 'Live Cohort + Mocks', 11296, 129, 12990),
  'gre-core': definePlan('gre-core', 'GRE Core', 5209, 59, 5990),
  'gre-plus': definePlan('gre-plus', 'GRE Plus', 7383, 79, 8490),
  'gre-live': definePlan('gre-live', 'GRE Live Cohort', 11296, 129, 12990),
  'all-access': definePlan('all-access', 'All-Access Annual Pass', 8687, 99, 9990),
  // Aligned catalog slugs from @lumen/core CANONICAL_PRODUCTS
  'ielts-academic-core': definePlan('ielts-academic-core', 'IELTS Academic Core', 3470, 45, 3990),
  'gre-complete-core': definePlan('gre-complete-core', 'GRE Complete Core', 4339, 49, 4990),
  'gre-mock-pack-5': definePlan('gre-mock-pack-5', 'GRE 5 Full Adaptive Mock Tests', 1730, 25, 1990),
  'lumen-annual-pass': definePlan('lumen-annual-pass', 'Lumen All-Access Annual Pass', 8687, 99, 9990),
  'ielts-academic-plus': definePlan('ielts-academic-plus', 'IELTS Academic Plus', 5643, 69, 6490),
  'ai-credits-10': definePlan('ai-credits-10', '10 AI Evaluation Credits', 426, 9, 490),
  'mock-pack-4': definePlan('mock-pack-4', 'Full Mock Pack (4 Mocks)', 861, 15, 990),
  'human-review-pack': definePlan('human-review-pack', '1-on-1 Review & Feedback Bundle', 1296, 19, 1490),
});

export interface InstallmentEntry {
  readonly installmentNumber: 1 | 2 | 3;
  readonly percentage: number;
  readonly dueInDays: 0 | 30 | 60;
  readonly amount: number;
  readonly amountBdt: number;
}

export interface CanonicalOrderSummary {
  readonly planId: string;
  readonly label: string;
  readonly splitParts: 1 | 2 | 3;
  readonly splitMode: SplitMode;
  readonly currency: SupportedCurrency;
  readonly rawBase: number;
  readonly discountAmount: number;
  readonly promoCodeApplied: string | null;
  readonly discountedBase: number;
  readonly processingFeeRate: number;
  readonly processingFee: number;
  readonly subtotal: number;
  readonly vatAmount: number;
  readonly totalAmount: number;
  readonly installmentNowAmount: number;
  readonly installmentLaterAmount: number;
  // Backward-compatible BDT fields
  readonly baseBdt: number;
  readonly vatBdt: number;
  readonly totalBdt: number;
  readonly baseTuitionBdt: number;
  readonly vat15Bdt: number;
  readonly dueTodayBdt: number;
  readonly installmentNowBdt: number;
  readonly installmentLaterBdt: number;
  readonly installmentSchedule: readonly InstallmentEntry[];
}

function resolveCanonicalPlan(planId: string): CanonicalBdtPlan {
  if (typeof planId !== 'string' || !Object.prototype.hasOwnProperty.call(CANONICAL_BDT_PLANS, planId)) {
    throw new PaymentSecurityError('SECURITY_UNKNOWN_PLAN', `Unknown planId "${String(planId)}"`);
  }
  const plan = CANONICAL_BDT_PLANS[planId];
  if (!plan) {
    throw new PaymentSecurityError('SECURITY_UNKNOWN_PLAN', `Unknown planId "${planId}"`);
  }
  return plan;
}

export function resolvePromoCode(promoCode?: string): CanonicalPromoCode | null {
  if (typeof promoCode !== 'string') return null;
  const normalized = promoCode.trim().toUpperCase();
  if (!normalized || !Object.prototype.hasOwnProperty.call(CANONICAL_PROMO_CODES, normalized)) {
    return null;
  }
  const promo = CANONICAL_PROMO_CODES[normalized];
  return promo && promo.active ? promo : null;
}

function normalizeSplitMode(splitInput: 1 | 2 | 3 | SplitMode): { splitMode: SplitMode; splitParts: 1 | 2 | 3 } {
  if (splitInput === 1 || splitInput === 'full') return { splitMode: 'full', splitParts: 1 };
  if (splitInput === 2 || splitInput === 'split-2') return { splitMode: 'split-2', splitParts: 2 };
  if (splitInput === 3 || splitInput === 'split-3') return { splitMode: 'split-3', splitParts: 3 };
  throw new PaymentSecurityError(
    'SECURITY_INVALID_SPLIT_PARTS',
    `Unsupported splitMode "${String(splitInput)}"`,
  );
}

function roundCurrency(amount: number, currency: SupportedCurrency): number {
  return currency === 'USD' ? Number(amount.toFixed(2)) : Math.round(amount);
}

export function computeCanonicalOrder(
  planId: string,
  splitInput: 1 | 2 | 3 | SplitMode = 'full',
  currency: SupportedCurrency = 'BDT',
  promoCode?: string,
): CanonicalOrderSummary {
  const plan = resolveCanonicalPlan(planId);
  const { splitMode, splitParts } = normalizeSplitMode(splitInput);

  if (splitParts > 1 && !plan.splitPayEligible) {
    throw new PaymentSecurityError(
      'SECURITY_SPLIT_PAY_NOT_ELIGIBLE',
      `Plan "${plan.planId}" (${plan.totalBdt} BDT) requires >= ${SPLIT_PAY_MIN_BDT} BDT for ${splitParts}-part split-pay`,
    );
  }

  const rawBase = currency === 'USD' ? plan.baseUsd : plan.baseBdt;
  const promo = resolvePromoCode(promoCode);
  const discountAmount = promo ? roundCurrency((rawBase * promo.value) / 100, currency) : 0;
  const discountedBase = Math.max(0, Number((rawBase - discountAmount).toFixed(2)));

  const processingFeeRate = SPLIT_PROCESSING_FEE_RATES[splitMode];
  const processingFee = roundCurrency(discountedBase * processingFeeRate, currency);
  const subtotal = Number((discountedBase + processingFee).toFixed(2));
  const vatAmount = currency === 'BDT' ? Math.round(subtotal * 0.15) : 0;
  const totalAmount = Number((subtotal + vatAmount).toFixed(2));

  let installmentSchedule: InstallmentEntry[];
  if (splitParts === 1) {
    installmentSchedule = [
      { installmentNumber: 1, percentage: 100, dueInDays: 0, amount: totalAmount, amountBdt: totalAmount },
    ];
  } else if (splitParts === 2) {
    const first = roundCurrency(totalAmount * 0.5, currency);
    const second = Number((totalAmount - first).toFixed(2));
    installmentSchedule = [
      { installmentNumber: 1, percentage: 50, dueInDays: 0, amount: first, amountBdt: first },
      { installmentNumber: 2, percentage: 50, dueInDays: 30, amount: second, amountBdt: second },
    ];
  } else {
    const first = roundCurrency(totalAmount * 0.4, currency);
    const second = roundCurrency(totalAmount * 0.3, currency);
    const third = Number((totalAmount - first - second).toFixed(2));
    installmentSchedule = [
      { installmentNumber: 1, percentage: 40, dueInDays: 0, amount: first, amountBdt: first },
      { installmentNumber: 2, percentage: 30, dueInDays: 30, amount: second, amountBdt: second },
      { installmentNumber: 3, percentage: 30, dueInDays: 60, amount: third, amountBdt: third },
    ];
  }

  const installmentNowAmount = installmentSchedule[0]?.amount ?? totalAmount;
  const installmentLaterAmount = Number((totalAmount - installmentNowAmount).toFixed(2));

  return {
    planId: plan.planId,
    label: plan.label,
    splitParts,
    splitMode,
    currency,
    rawBase,
    discountAmount,
    promoCodeApplied: promo ? promo.code : null,
    discountedBase,
    processingFeeRate,
    processingFee,
    subtotal,
    vatAmount,
    totalAmount,
    installmentNowAmount,
    installmentLaterAmount,
    baseBdt: currency === 'BDT' ? subtotal : plan.baseBdt,
    vatBdt: vatAmount,
    totalBdt: currency === 'BDT' ? totalAmount : plan.totalBdt,
    baseTuitionBdt: currency === 'BDT' ? subtotal : plan.baseBdt,
    vat15Bdt: vatAmount,
    dueTodayBdt: installmentNowAmount,
    installmentNowBdt: installmentNowAmount,
    installmentLaterBdt: installmentLaterAmount,
    installmentSchedule,
  };
}

export function verifyClientAmountNotTampered(
  planId: string,
  clientSubmittedTotal: number,
  splitInput: 1 | 2 | 3 | SplitMode = 'full',
  currency: SupportedCurrency = 'BDT',
  promoCode?: string,
): CanonicalBdtPlan {
  const plan = resolveCanonicalPlan(planId);
  const expected = computeCanonicalOrder(planId, splitInput, currency, promoCode);

  if (
    typeof clientSubmittedTotal !== 'number' ||
    !Number.isFinite(clientSubmittedTotal) ||
    Math.abs(clientSubmittedTotal - expected.totalAmount) > 0.01
  ) {
    throw new PaymentSecurityError(
      'SECURITY_PRICE_TAMPER_DETECTED',
      `Client total ${String(clientSubmittedTotal)} ${currency} does not match canonical ${expected.totalAmount} ${currency} for "${plan.planId}"`,
    );
  }

  return plan;
}

const IDEMPOTENCY_KEY_REGEX = /^[a-zA-Z0-9_-]{16,64}$/;
const MAX_REPLAY_ENTRIES = 10_000;
const replayStore = new Map<string, number>();

function pruneReplayStore(nowMs: number): void {
  for (const [key, expiresAtMs] of replayStore.entries()) {
    if (expiresAtMs <= nowMs) {
      replayStore.delete(key);
    }
  }
}

export interface IdempotencyCheckInput {
  idempotencyKey: string;
  timestampMs: number;
  nowMs?: number;
  seenKeys?: Set<string>;
}

export interface IdempotencyCheckResult {
  ok: true;
  idempotencyKey: string;
  verifiedAtMs: number;
}

export function verifyIdempotencyAndTimestamp({
  idempotencyKey,
  timestampMs,
  nowMs = Date.now(),
  seenKeys,
}: IdempotencyCheckInput): IdempotencyCheckResult {
  if (typeof idempotencyKey !== 'string' || !IDEMPOTENCY_KEY_REGEX.test(idempotencyKey)) {
    throw new PaymentSecurityError(
      'SECURITY_INVALID_IDEMPOTENCY_KEY',
      'idempotencyKey must match ^[a-zA-Z0-9_-]{16,64}$',
    );
  }

  if (typeof timestampMs !== 'number' || !Number.isFinite(timestampMs)) {
    throw new PaymentSecurityError('SECURITY_TIMESTAMP_OUT_OF_WINDOW', 'timestampMs must be a finite epoch millisecond value');
  }

  const maxSkewMs = SECURITY_POLICY.webhookReplayWindowSeconds * 1000;
  if (Math.abs(nowMs - timestampMs) > maxSkewMs) {
    throw new PaymentSecurityError(
      'SECURITY_TIMESTAMP_OUT_OF_WINDOW',
      `Timestamp skew ${Math.abs(nowMs - timestampMs)}ms exceeds ${maxSkewMs}ms replay window`,
    );
  }

  if (seenKeys) {
    if (seenKeys.has(idempotencyKey)) {
      throw new PaymentSecurityError(
        'SECURITY_IDEMPOTENCY_REPLAY_DETECTED',
        `Duplicate idempotencyKey "${idempotencyKey}" rejected`,
      );
    }
    seenKeys.add(idempotencyKey);
    return { ok: true, idempotencyKey, verifiedAtMs: nowMs };
  }

  if (replayStore.size >= MAX_REPLAY_ENTRIES) {
    pruneReplayStore(nowMs);
  }

  const existingExpiry = replayStore.get(idempotencyKey);
  if (existingExpiry !== undefined && existingExpiry > nowMs) {
    throw new PaymentSecurityError(
      'SECURITY_IDEMPOTENCY_REPLAY_DETECTED',
      `Duplicate idempotencyKey "${idempotencyKey}" rejected`,
    );
  }

  replayStore.set(idempotencyKey, nowMs + maxSkewMs);
  return { ok: true, idempotencyKey, verifiedAtMs: nowMs };
}

export function clearIdempotencyReplayCache(): void {
  replayStore.clear();
}

export function signWebhookPayload(payload: string | Buffer, secret: string): string {
  if (!secret) {
    throw new Error('HMAC secret must not be empty');
  }
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyWebhookHmacSignature(
  payload: string | Buffer,
  providedSignatureHex: string,
  secret: string,
): boolean {
  if (!secret || typeof providedSignatureHex !== 'string' || !providedSignatureHex) {
    return false;
  }

  const normalized = providedSignatureHex.startsWith('sha256=')
    ? providedSignatureHex.slice(7).trim()
    : providedSignatureHex.trim();

  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) {
    return false;
  }

  const expectedHex = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  const providedBuf = Buffer.from(normalized.toLowerCase(), 'hex');

  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}
