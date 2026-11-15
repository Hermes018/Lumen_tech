/** @purpose Server-side canonical BDT price ledger, anti-tampering check, idempotency/replay guard, and HMAC-SHA256 webhook verifier */

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

export interface CanonicalBdtPlan {
  readonly planId: string;
  readonly label: string;
  readonly totalBdt: number;
  readonly splitPayEligible: boolean;
}

const SPLIT_PAY_MIN_BDT = 4990;

function definePlan(planId: string, label: string, totalBdt: number): CanonicalBdtPlan {
  return Object.freeze({
    planId,
    label,
    totalBdt,
    splitPayEligible: totalBdt >= SPLIT_PAY_MIN_BDT,
  });
}

export const CANONICAL_BDT_PLANS: Readonly<Record<string, CanonicalBdtPlan>> = Object.freeze({
  'free-diagnostic': definePlan('free-diagnostic', 'Free Diagnostic', 0),
  'ielts-complete': definePlan('ielts-complete', 'IELTS Complete', 4990),
  'gre-complete': definePlan('gre-complete', 'GRE Complete', 5990),
  'live-cohort': definePlan('live-cohort', 'Live Cohort + Mocks', 12990),
  'gre-core': definePlan('gre-core', 'GRE Core', 5990),
  'gre-plus': definePlan('gre-plus', 'GRE Plus', 8490),
  'gre-live': definePlan('gre-live', 'GRE Live Cohort', 12990),
  'all-access': definePlan('all-access', 'All-Access Annual Pass', 9990),
  // Aligned catalog slugs from @lumen/core CANONICAL_PRODUCTS
  'ielts-academic-core': definePlan('ielts-academic-core', 'IELTS Academic Core', 3990),
  'gre-complete-core': definePlan('gre-complete-core', 'GRE Complete Core', 4990),
  'gre-mock-pack-5': definePlan('gre-mock-pack-5', 'GRE 5 Full Adaptive Mock Tests', 1990),
  'lumen-annual-pass': definePlan('lumen-annual-pass', 'Lumen All-Access Annual Pass', 9990),
  'ielts-academic-plus': definePlan('ielts-academic-plus', 'IELTS Academic Plus', 6490),
  'ai-credits-10': definePlan('ai-credits-10', '10 AI Evaluation Credits', 490),
  'mock-pack-4': definePlan('mock-pack-4', 'Full Mock Pack (4 Mocks)', 990),
  'human-review-pack': definePlan('human-review-pack', '1-on-1 Review & Feedback Bundle', 1490),
});

export interface InstallmentEntry {
  readonly installmentNumber: 1 | 2 | 3;
  readonly percentage: number;
  readonly dueInDays: 0 | 30 | 60;
  readonly amountBdt: number;
}

export interface CanonicalOrderSummary {
  readonly planId: string;
  readonly label: string;
  readonly splitParts: 1 | 2 | 3;
  readonly currency: 'BDT';
  readonly totalBdt: number;
  readonly baseTuitionBdt: number;
  readonly vat15Bdt: number;
  readonly dueTodayBdt: number;
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

export function computeCanonicalOrder(planId: string, splitParts: 1 | 2 | 3 = 1): CanonicalOrderSummary {
  const plan = resolveCanonicalPlan(planId);

  if (splitParts !== 1 && splitParts !== 2 && splitParts !== 3) {
    throw new PaymentSecurityError('SECURITY_INVALID_SPLIT_PARTS', `Unsupported splitParts "${String(splitParts)}"`);
  }

  if (splitParts > 1 && plan.totalBdt < SPLIT_PAY_MIN_BDT) {
    throw new PaymentSecurityError(
      'SECURITY_SPLIT_PAY_NOT_ELIGIBLE',
      `Plan "${plan.planId}" (${plan.totalBdt} BDT) requires >= ${SPLIT_PAY_MIN_BDT} BDT for ${splitParts}-part split-pay`,
    );
  }

  const totalBdt = plan.totalBdt;
  const vat15Bdt = Math.round((totalBdt * 15) / 115);
  const baseTuitionBdt = totalBdt - vat15Bdt;

  let installmentSchedule: InstallmentEntry[];
  if (splitParts === 1) {
    installmentSchedule = [
      { installmentNumber: 1, percentage: 100, dueInDays: 0, amountBdt: totalBdt },
    ];
  } else if (splitParts === 2) {
    const first = Math.round(totalBdt * 0.5);
    const second = totalBdt - first;
    installmentSchedule = [
      { installmentNumber: 1, percentage: 50, dueInDays: 0, amountBdt: first },
      { installmentNumber: 2, percentage: 50, dueInDays: 30, amountBdt: second },
    ];
  } else {
    const first = Math.round(totalBdt * 0.4);
    const second = Math.round(totalBdt * 0.3);
    const third = totalBdt - first - second;
    installmentSchedule = [
      { installmentNumber: 1, percentage: 40, dueInDays: 0, amountBdt: first },
      { installmentNumber: 2, percentage: 30, dueInDays: 30, amountBdt: second },
      { installmentNumber: 3, percentage: 30, dueInDays: 60, amountBdt: third },
    ];
  }

  return {
    planId: plan.planId,
    label: plan.label,
    splitParts,
    currency: 'BDT',
    totalBdt,
    baseTuitionBdt,
    vat15Bdt,
    dueTodayBdt: installmentSchedule[0]?.amountBdt ?? totalBdt,
    installmentSchedule,
  };
}

export function verifyClientAmountNotTampered(planId: string, clientSubmittedTotalBdt: number): CanonicalBdtPlan {
  const plan = resolveCanonicalPlan(planId);

  if (
    typeof clientSubmittedTotalBdt !== 'number' ||
    !Number.isFinite(clientSubmittedTotalBdt) ||
    clientSubmittedTotalBdt !== plan.totalBdt
  ) {
    throw new PaymentSecurityError(
      'SECURITY_PRICE_TAMPER_DETECTED',
      `Client total ${String(clientSubmittedTotalBdt)} BDT does not match canonical ${plan.totalBdt} BDT for "${plan.planId}"`,
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
