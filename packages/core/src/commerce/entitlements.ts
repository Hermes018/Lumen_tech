/** @purpose Server-authoritative append-only entitlement & credit ledger, access guards, and daily evaluation ceilings (P1-34, D5, D12 C1) */

import { assertCan, type Actor } from '../auth/policy';
import { CANONICAL_PRODUCTS, type ProductDefinition } from './products';
import {
  getRepositories,
  resetRepositories,
  type EntitlementRecord as DbEntitlementRecord,
  type CreditLedgerEntry,
} from '@lumen/db';

export type EntitlementTier = 'free' | 'core' | 'pass' | 'plus' | 'live' | 'mentor';

export type AiEvaluationType =
  | 'writing_task'
  | 'speaking_part'
  | 'speaking_full'
  | 'gre_awa';

/**
 * D12 C1 Canonical AI Credit Costs (integers only):
 * - writing_task = 1
 * - speaking_part = 1
 * - speaking_full = 2
 * - gre_awa = 1
 */
export const AI_EVALUATION_CREDIT_COSTS: Readonly<Record<AiEvaluationType, number>> = {
  writing_task: 1,
  speaking_part: 1,
  speaking_full: 2,
  gre_awa: 1,
} as const;

/**
 * D12 Daily AI Evaluation Ceilings by Tier:
 * - Free = 1/day
 * - Core = 3/day
 * - Pass = 4/day
 * - Plus / Live / Mentor = 6/day
 */
export const DAILY_AI_EVAL_CEILINGS: Readonly<Record<EntitlementTier, number>> = {
  free: 1,
  core: 3,
  pass: 4,
  plus: 6,
  live: 6,
  mentor: 6,
} as const;

export type EntitlementErrorCode =
  | 'ENTITLEMENT_REQUIRED'
  | 'ENTITLEMENT_EXPIRED'
  | 'INSUFFICIENT_CREDITS'
  | 'INSUFFICIENT_MOCKS'
  | 'DAILY_CAP_REACHED'
  | 'INVALID_LEDGER_ENTRY';

export class EntitlementError extends Error {
  readonly code: EntitlementErrorCode;

  constructor(code: EntitlementErrorCode, message: string) {
    super(message);
    this.name = 'EntitlementError';
    this.code = code;
  }
}

export interface EntitlementRecord {
  id: string;
  userId: string;
  productId: string;
  productSlug: string;
  productName: string;
  tier: EntitlementTier;
  source: 'purchase' | 'manual_grant' | 'trial' | 'refund';
  orderId?: string;
  idempotencyKey?: string;
  amountPaidMinor?: number;
  currency?: string;
  startsAt: string;
  endsAt: string | null;
  allowancesJson: Record<string, unknown>;
  isActive: boolean;
  revokedAt?: string;
  revokeReason?: string;
  createdAt: string;
}

export type LedgerEntryKind = 'ai_credit' | 'mock_attempt';

/**
 * Immutable append-only entitlement ledger entry.
 */
export interface EntitlementLedgerEntry {
  readonly id: string;
  readonly userId: string;
  readonly entitlementId?: string;
  readonly kind: LedgerEntryKind;
  readonly delta: number; // positive for grants/refunds, negative for debits/revocations
  readonly evaluationType?: AiEvaluationType;
  readonly reason: string;
  readonly sourceRef: string;
  readonly idempotencyKey: string;
  readonly createdAt: string;
}

// In-memory registry for user entitlements and append-only ledger
const userEntitlementsMap = new Map<string, EntitlementRecord[]>();
const entitlementByIdempotencyKey = new Map<string, EntitlementRecord>();
const appendOnlyLedger: EntitlementLedgerEntry[] = [];
const ledgerByIdempotencyKey = new Map<string, EntitlementLedgerEntry>();
const activeUserLocks = new Set<string>();
const pendingRepoSaves: Promise<unknown>[] = [];

/**
 * Clears in-memory entitlement and ledger state (for deterministic unit tests).
 */
export function resetEntitlementLedgerState(): void {
  userEntitlementsMap.clear();
  entitlementByIdempotencyKey.clear();
  appendOnlyLedger.length = 0;
  ledgerByIdempotencyKey.clear();
  activeUserLocks.clear();
  pendingRepoSaves.length = 0;
  try {
    resetRepositories();
  } catch {
    // testing
  }
}

function appendLedgerEntry(
  entry: Omit<EntitlementLedgerEntry, 'id'>
): { entry: EntitlementLedgerEntry; idempotentReplay: boolean } {
  const scopedKey = `${entry.userId}:${entry.idempotencyKey}`;
  const existing = ledgerByIdempotencyKey.get(scopedKey);
  if (existing) {
    return { entry: existing, idempotentReplay: true };
  }

  if (!Number.isInteger(entry.delta)) {
    throw new EntitlementError(
      'INVALID_LEDGER_ENTRY',
      `Ledger delta must be an integer (received: ${entry.delta})`
    );
  }

  const frozen: EntitlementLedgerEntry = Object.freeze({
    ...entry,
    id: `led-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
  });

  appendOnlyLedger.push(frozen);
  ledgerByIdempotencyKey.set(scopedKey, frozen);
  try {
    const savePromise = getRepositories().ledger.save({
      id: frozen.id,
      userId: frozen.userId,
      kind: frozen.kind,
      delta: frozen.delta,
      balanceAfter: frozen.delta,
      reason: frozen.reason,
      sourceRef: frozen.sourceRef,
      idempotencyKey: scopedKey,
      createdAt: frozen.createdAt,
    });
    pendingRepoSaves.push(savePromise);
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
  }
  return { entry: frozen, idempotentReplay: false };
}

function inferTier(productSlug: string, productDef?: ProductDefinition): EntitlementTier {
  if (productSlug.includes('pass') || productDef?.kind === 'pass') {
    return 'pass';
  }
  if (productDef?.tier) {
    return productDef.tier;
  }
  if (productSlug.includes('mentor')) return 'mentor';
  if (productSlug.includes('live')) return 'live';
  if (productSlug.includes('plus')) return 'plus';
  if (productSlug.includes('core')) return 'core';
  return 'core';
}

/**
 * Grants an entitlement to a user upon verified purchase, trial, or manual grant,
 * and appends positive initial credit and mock allowance entries into the append-only ledger.
 */
export function grantEntitlement(
  userId: string,
  productSlug: string,
  source: 'purchase' | 'manual_grant' | 'trial' = 'purchase',
  now = new Date(),
  meta?: {
    orderId?: string;
    idempotencyKey?: string;
    amountPaidMinor?: number;
    currency?: string;
    tierOverride?: EntitlementTier;
    aiCreditsOverride?: number;
    fullMocksOverride?: number;
    durationDaysOverride?: number;
  }
): EntitlementRecord {
  const scopedEntKey = meta?.idempotencyKey ? `${userId}:${meta.idempotencyKey}` : undefined;
  if (scopedEntKey) {
    const existingByKey = entitlementByIdempotencyKey.get(scopedEntKey);
    if (existingByKey) {
      return existingByKey;
    }
  }

  const productDef: ProductDefinition | undefined = CANONICAL_PRODUCTS.find(
    (p) => p.slug === productSlug
  );

  const tier = meta?.tierOverride ?? inferTier(productSlug, productDef);
  const durationDays = meta?.durationDaysOverride ?? productDef?.duration_days ?? 183;
  const startsAt = now.toISOString();
  const endsAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const defaultCredits =
    meta?.aiCreditsOverride ??
    (source === 'trial' ? 5 : (productDef?.allowances.ai_credits ?? 10));
  const defaultMocks =
    meta?.fullMocksOverride ?? (productDef?.allowances.full_mocks ?? 4);
  const dailyCap = DAILY_AI_EVAL_CEILINGS[tier];

  const allowances = {
    ...(productDef?.allowances ?? {}),
    ai_credits: defaultCredits,
    full_mocks: defaultMocks,
    ai_daily_cap: dailyCap,
  };

  const recordId = `ent-${userId}-${productSlug}-${now.getTime()}-${Math.random()
    .toString(36)
    .slice(2, 6)}`;

  const record: EntitlementRecord = {
    id: recordId,
    userId,
    productId: productDef?.slug ?? productSlug,
    productSlug,
    productName: productDef?.name ?? productSlug,
    tier,
    source,
    orderId: meta?.orderId,
    idempotencyKey: meta?.idempotencyKey,
    amountPaidMinor: meta?.amountPaidMinor,
    currency: meta?.currency,
    startsAt,
    endsAt,
    allowancesJson: allowances,
    isActive: true,
    createdAt: startsAt,
  };

  const existing = userEntitlementsMap.get(userId) ?? [];
  userEntitlementsMap.set(userId, [...existing, record]);

  if (scopedEntKey) {
    entitlementByIdempotencyKey.set(scopedEntKey, record);
  }

  try {
    const savePromise = getRepositories().entitlements.save({
      ...record,
      idempotencyKey: scopedEntKey,
    } as unknown as DbEntitlementRecord);
    pendingRepoSaves.push(savePromise);
  } catch (err) {
    if (process.env.NODE_ENV === 'production') {
      throw err;
    }
  }

  // Append initial positive grants into the append-only ledger
  const baseKey = meta?.idempotencyKey ?? `grant:${recordId}`;
  if (defaultCredits > 0) {
    appendLedgerEntry({
      userId,
      entitlementId: recordId,
      kind: 'ai_credit',
      delta: defaultCredits,
      reason: `entitlement_grant:${source}:${productSlug}`,
      sourceRef: meta?.orderId ?? recordId,
      idempotencyKey: `${baseKey}:ai_credit`,
      createdAt: startsAt,
    });
  }

  if (defaultMocks > 0) {
    appendLedgerEntry({
      userId,
      entitlementId: recordId,
      kind: 'mock_attempt',
      delta: defaultMocks,
      reason: `entitlement_grant:${source}:${productSlug}`,
      sourceRef: meta?.orderId ?? recordId,
      idempotencyKey: `${baseKey}:mock_attempt`,
      createdAt: startsAt,
    });
  }

  return record;
}

/**
 * Checks if a user has an active entitlement for a specific product at server time `now`.
 */
export function hasActiveEntitlement(
  userId: string,
  productSlug: string,
  now = new Date()
): boolean {
  const list = userEntitlementsMap.get(userId) ?? [];
  const nowMs = now.getTime();

  return list.some((e) => {
    if (!e.isActive) return false;
    if (e.productSlug !== productSlug) return false;
    if (new Date(e.startsAt).getTime() > nowMs) return false;
    if (e.endsAt && new Date(e.endsAt).getTime() <= nowMs) return false;
    return true;
  });
}

/**
 * Retrieves all active entitlements for a given user at server time `now`.
 */
export function getUserEntitlements(userId: string, now = new Date()): EntitlementRecord[] {
  const list = userEntitlementsMap.get(userId) ?? [];
  const nowMs = now.getTime();

  return list.filter((e) => {
    if (!e.isActive) return false;
    if (new Date(e.startsAt).getTime() > nowMs) return false;
    if (e.endsAt && new Date(e.endsAt).getTime() <= nowMs) return false;
    return true;
  });
}

/**
 * Retrieves all entitlements (including expired or refunded) for a user.
 */
export function getAllUserEntitlements(userId: string): EntitlementRecord[] {
  return [...(userEntitlementsMap.get(userId) ?? [])];
}

/**
 * Resolves the highest active entitlement tier for a user (defaults to 'free').
 */
export function getHighestActiveTier(userId: string, now = new Date()): EntitlementTier {
  const active = getUserEntitlements(userId, now);
  if (active.length === 0) return 'free';

  const rank: Record<EntitlementTier, number> = {
    free: 0,
    core: 1,
    pass: 2,
    plus: 3,
    live: 4,
    mentor: 5,
  };

  let best: EntitlementTier = 'free';
  for (const ent of active) {
    if (rank[ent.tier] > rank[best]) {
      best = ent.tier;
    }
  }
  return best;
}

/**
 * Resolves the daily AI evaluation ceiling for a user based on their active entitlements.
 */
export function getDailyAiEvaluationCeiling(userId: string, now = new Date()): number {
  const tier = getHighestActiveTier(userId, now);
  return DAILY_AI_EVAL_CEILINGS[tier];
}

/**
 * Returns the append-only ledger entries for a user (optionally filtered by kind).
 */
export function getUserLedgerEntries(
  userId: string,
  kind?: LedgerEntryKind
): readonly EntitlementLedgerEntry[] {
  return appendOnlyLedger.filter(
    (entry) => entry.userId === userId && (!kind || entry.kind === kind)
  );
}

/**
 * Computes the server-authoritative balance from the append-only ledger (`SUM(delta)`),
 * counting grants from active entitlements and all debits against those entitlements.
 */
export function getLedgerBalance(
  userId: string,
  kind: LedgerEntryKind,
  now = new Date()
): number {
  const allEntitlements = userEntitlementsMap.get(userId) ?? [];
  const activeEntitlementIds = new Set(
    getUserEntitlements(userId, now).map((e) => e.id)
  );
  const expiredOrInactiveIds = new Set(
    allEntitlements
      .filter((e) => !activeEntitlementIds.has(e.id))
      .map((e) => e.id)
  );

  // Sum deltas per entitlement so expired entitlements cannot contribute positive leftover balance
  let total = 0;
  const entries = getUserLedgerEntries(userId, kind);

  // Group by entitlementId where present
  const byEnt = new Map<string, number>();
  let unlinkedDelta = 0;

  for (const entry of entries) {
    if (entry.entitlementId) {
      byEnt.set(entry.entitlementId, (byEnt.get(entry.entitlementId) ?? 0) + entry.delta);
    } else {
      unlinkedDelta += entry.delta;
    }
  }

  for (const [entId, entSum] of byEnt.entries()) {
    if (activeEntitlementIds.has(entId)) {
      total += entSum;
    } else if (!expiredOrInactiveIds.has(entId)) {
      total += entSum;
    }
  }

  return Math.max(0, total + unlinkedDelta);
}

/**
 * Counts how many AI evaluations (debits) the user has executed on the UTC day of `now`.
 */
export function getDailyAiEvaluationsUsed(userId: string, now = new Date()): number {
  const dayPrefix = now.toISOString().slice(0, 10); // YYYY-MM-DD
  return appendOnlyLedger.filter(
    (e) =>
      e.userId === userId &&
      e.kind === 'ai_credit' &&
      e.delta < 0 &&
      !e.reason.startsWith('refund_revoke') &&
      e.createdAt.startsWith(dayPrefix)
  ).length;
}

/**
 * Server-authoritative access guard (P1-34 / D5):
 * Verifies actor authorization and asserts that the user has an active entitlement
 * matching the requested productSlug or tier.
 */
export function assertHasEntitlement(
  actor: Actor,
  requirement: {
    userId?: string;
    productSlug?: string;
    minimumTier?: EntitlementTier;
    now?: Date;
  }
): EntitlementRecord {
  const targetUserId = requirement.userId ?? actor.id;
  assertCan(actor, 'user:view_own', { ownerId: targetUserId });

  const now = requirement.now ?? new Date();
  const allForUser = userEntitlementsMap.get(targetUserId) ?? [];
  const active = getUserEntitlements(targetUserId, now);

  if (requirement.productSlug) {
    const matchingActive = active.find((e) => e.productSlug === requirement.productSlug);
    if (matchingActive) {
      return matchingActive;
    }

    const matchingExpired = allForUser.find((e) => e.productSlug === requirement.productSlug);
    if (matchingExpired) {
      throw new EntitlementError(
        'ENTITLEMENT_EXPIRED',
        `Entitlement for '${requirement.productSlug}' has expired or been revoked`
      );
    }

    throw new EntitlementError(
      'ENTITLEMENT_REQUIRED',
      `User '${targetUserId}' does not hold an active entitlement for '${requirement.productSlug}'`
    );
  }

  if (active.length === 0) {
    if (allForUser.length > 0) {
      throw new EntitlementError(
        'ENTITLEMENT_EXPIRED',
        `All entitlements for user '${targetUserId}' have expired or been revoked`
      );
    }
    throw new EntitlementError(
      'ENTITLEMENT_REQUIRED',
      `User '${targetUserId}' has no active entitlements`
    );
  }

  if (requirement.minimumTier) {
    const rank: Record<EntitlementTier, number> = {
      free: 0,
      core: 1,
      pass: 2,
      plus: 3,
      live: 4,
      mentor: 5,
    };
    const match = active.find((e) => rank[e.tier] >= rank[requirement.minimumTier!]);
    if (!match) {
      throw new EntitlementError(
        'ENTITLEMENT_REQUIRED',
        `User '${targetUserId}' requires at least tier '${requirement.minimumTier}'`
      );
    }
    return match;
  }

  return active[0]!;
}

export interface ConsumeAiCreditInput {
  userId?: string;
  evaluationType: AiEvaluationType;
  ref: string;
  idempotencyKey: string;
  now?: Date;
}

export interface ConsumeAiCreditResult {
  ledgerEntry: EntitlementLedgerEntry;
  cost: number;
  remainingCredits: number;
  dailyUsedCount: number;
  dailyCeiling: number;
  idempotentReplay: boolean;
}

/**
 * Atomically consumes AI evaluation credits from the append-only ledger (P1-34 / D12 C1).
 * Prevents double-spend race conditions via idempotencyKey and per-user serialization lock,
 * enforces D12 C1 credit costs (1/1/2/1), and enforces daily evaluation ceilings (1/3/4/6).
 */
export function consumeAiCredit(
  actor: Actor,
  input: ConsumeAiCreditInput
): ConsumeAiCreditResult {
  const targetUserId = input.userId ?? actor.id;
  assertCan(actor, 'user:view_own', { ownerId: targetUserId });

  const now = input.now ?? new Date();
  const cost = AI_EVALUATION_CREDIT_COSTS[input.evaluationType];
  if (!cost || !Number.isInteger(cost) || cost <= 0) {
    throw new EntitlementError(
      'INVALID_LEDGER_ENTRY',
      `Unsupported AI evaluation type: ${String(input.evaluationType)}`
    );
  }

  // 1. Idempotency check first: if already debited with this key, return idempotent result without re-debiting
  const scopedKey = `${targetUserId}:${input.idempotencyKey}`;
  const existingEntry = ledgerByIdempotencyKey.get(scopedKey);
  if (existingEntry) {
    const remaining = getLedgerBalance(targetUserId, 'ai_credit', now);
    const dailyUsed = getDailyAiEvaluationsUsed(targetUserId, now);
    const ceiling = getDailyAiEvaluationCeiling(targetUserId, now);
    return {
      ledgerEntry: existingEntry,
      cost: Math.abs(existingEntry.delta),
      remainingCredits: remaining,
      dailyUsedCount: dailyUsed,
      dailyCeiling: ceiling,
      idempotentReplay: true,
    };
  }

  // 2. Serialization lock to prevent concurrent double-spend race conditions
  if (activeUserLocks.has(targetUserId)) {
    throw new EntitlementError(
      'INSUFFICIENT_CREDITS',
      'Concurrent credit consumption in progress for user'
    );
  }

  activeUserLocks.add(targetUserId);
  try {
    // 3. Verify active entitlement if user had entitlements that all expired
    const allEnts = userEntitlementsMap.get(targetUserId) ?? [];
    const activeEnts = getUserEntitlements(targetUserId, now);
    if (allEnts.length > 0 && activeEnts.length === 0) {
      throw new EntitlementError(
        'ENTITLEMENT_EXPIRED',
        `Entitlements for user '${targetUserId}' have expired`
      );
    }

    // 4. Check daily evaluation ceiling per D12 (Free=1, Core=3, Pass=4, Plus/Live/Mentor=6)
    const dailyCeiling = getDailyAiEvaluationCeiling(targetUserId, now);
    const dailyUsedBefore = getDailyAiEvaluationsUsed(targetUserId, now);
    if (dailyUsedBefore >= dailyCeiling) {
      throw new EntitlementError(
        'DAILY_CAP_REACHED',
        `Daily AI evaluation ceiling reached (${dailyUsedBefore}/${dailyCeiling} evaluations today)`
      );
    }

    // 5. Check available integer credit balance
    const currentBalance = getLedgerBalance(targetUserId, 'ai_credit', now);
    if (currentBalance < cost) {
      throw new EntitlementError(
        'INSUFFICIENT_CREDITS',
        `Insufficient AI credits: required ${cost}, available ${currentBalance}`
      );
    }

    const primaryEntitlement = activeEnts[0];
    const { entry } = appendLedgerEntry({
      userId: targetUserId,
      entitlementId: primaryEntitlement?.id,
      kind: 'ai_credit',
      delta: -cost,
      evaluationType: input.evaluationType,
      reason: `consume:${input.evaluationType}`,
      sourceRef: input.ref,
      idempotencyKey: input.idempotencyKey,
      createdAt: now.toISOString(),
    });

    const remainingCredits = getLedgerBalance(targetUserId, 'ai_credit', now);

    return {
      ledgerEntry: entry,
      cost,
      remainingCredits,
      dailyUsedCount: dailyUsedBefore + 1,
      dailyCeiling,
      idempotentReplay: false,
    };
  } finally {
    activeUserLocks.delete(targetUserId);
  }
}

export interface ConsumeMockAttemptInput {
  userId?: string;
  examFamily: 'gre' | 'ielts_academic' | 'ielts_gt';
  attemptId: string;
  idempotencyKey: string;
  now?: Date;
}

export interface ConsumeMockAttemptResult {
  ledgerEntry: EntitlementLedgerEntry;
  remainingMocks: number;
  idempotentReplay: boolean;
}

/**
 * Atomically consumes 1 full mock attempt from the append-only ledger (P1-34).
 */
export function consumeMockAttempt(
  actor: Actor,
  input: ConsumeMockAttemptInput
): ConsumeMockAttemptResult {
  const targetUserId = input.userId ?? actor.id;
  assertCan(actor, 'user:view_own', { ownerId: targetUserId });

  const now = input.now ?? new Date();

  const scopedKey = `${targetUserId}:${input.idempotencyKey}`;
  const existingEntry = ledgerByIdempotencyKey.get(scopedKey);
  if (existingEntry) {
    return {
      ledgerEntry: existingEntry,
      remainingMocks: getLedgerBalance(targetUserId, 'mock_attempt', now),
      idempotentReplay: true,
    };
  }

  const allEnts = userEntitlementsMap.get(targetUserId) ?? [];
  const activeEnts = getUserEntitlements(targetUserId, now);
  if (allEnts.length > 0 && activeEnts.length === 0) {
    throw new EntitlementError(
      'ENTITLEMENT_EXPIRED',
      `Entitlements for user '${targetUserId}' have expired`
    );
  }

  const currentMocks = getLedgerBalance(targetUserId, 'mock_attempt', now);
  if (currentMocks < 1) {
    throw new EntitlementError(
      'INSUFFICIENT_MOCKS',
      `No full mock attempts remaining for user '${targetUserId}'`
    );
  }

  const primaryEntitlement = activeEnts[0];
  const { entry } = appendLedgerEntry({
    userId: targetUserId,
    entitlementId: primaryEntitlement?.id,
    kind: 'mock_attempt',
    delta: -1,
    reason: `consume_mock:${input.examFamily}`,
    sourceRef: input.attemptId,
    idempotencyKey: input.idempotencyKey,
    createdAt: now.toISOString(),
  });

  return {
    ledgerEntry: entry,
    remainingMocks: getLedgerBalance(targetUserId, 'mock_attempt', now),
    idempotentReplay: false,
  };
}

/**
 * Grants standalone or bonus AI credits directly into the append-only ledger (e.g. signup +2 or system failure refund).
 */
export function grantLedgerCredits(params: {
  userId: string;
  credits: number;
  reason: string;
  sourceRef: string;
  idempotencyKey: string;
  entitlementId?: string;
  now?: Date;
}): EntitlementLedgerEntry {
  if (!Number.isInteger(params.credits) || params.credits <= 0) {
    throw new EntitlementError(
      'INVALID_LEDGER_ENTRY',
      'Granted credits must be a positive integer'
    );
  }
  const nowIso = (params.now ?? new Date()).toISOString();
  const { entry } = appendLedgerEntry({
    userId: params.userId,
    entitlementId: params.entitlementId,
    kind: 'ai_credit',
    delta: params.credits,
    reason: params.reason,
    sourceRef: params.sourceRef,
    idempotencyKey: params.idempotencyKey,
    createdAt: nowIso,
  });
  return entry;
}

/**
 * Revokes an entitlement upon order refund and zeroes out any remaining unconsumed ledger balances.
 */
export function revokeEntitlementOnRefund(params: {
  userId: string;
  orderId?: string;
  entitlementId?: string;
  productSlug?: string;
  reason?: string;
  now?: Date;
  dryRun?: boolean;
}): {
  revokedEntitlements: EntitlementRecord[];
  consumedAiCredits: number;
  consumedMockAttempts: number;
  includedAiCredits: number;
  includedMockAttempts: number;
} {
  const now = params.now ?? new Date();
  const nowIso = now.toISOString();
  const list = userEntitlementsMap.get(params.userId) ?? [];

  const matched: EntitlementRecord[] = [];
  const updatedList = list.map((ent) => {
    const isTarget =
      (params.entitlementId && ent.id === params.entitlementId) ||
      (params.orderId && ent.orderId === params.orderId) ||
      (!params.entitlementId && !params.orderId && params.productSlug && ent.productSlug === params.productSlug);

    if (isTarget && ent.isActive) {
      const revoked: EntitlementRecord = {
        ...ent,
        isActive: false,
        source: 'refund',
        endsAt: nowIso,
        revokedAt: nowIso,
        revokeReason: params.reason ?? 'Order refunded',
      };
      matched.push(revoked);
      return revoked;
    }
    return ent;
  });

  if (!params.dryRun) {
    userEntitlementsMap.set(params.userId, updatedList);
  }

  let consumedAiCredits = 0;
  let consumedMockAttempts = 0;
  let includedAiCredits = 0;
  let includedMockAttempts = 0;

  for (const rev of matched) {
    const incCredits = Number(rev.allowancesJson.ai_credits ?? 0);
    const incMocks = Number(rev.allowancesJson.full_mocks ?? 0);
    includedAiCredits += incCredits;
    includedMockAttempts += incMocks;

    const entEntries = appendOnlyLedger.filter((e) => e.entitlementId === rev.id);
    const usedCredits = entEntries
      .filter((e) => e.kind === 'ai_credit' && e.delta < 0 && !e.reason.startsWith('refund_revoke'))
      .reduce((sum, e) => sum + Math.abs(e.delta), 0);
    const usedMocks = entEntries
      .filter((e) => e.kind === 'mock_attempt' && e.delta < 0 && !e.reason.startsWith('refund_revoke'))
      .reduce((sum, e) => sum + Math.abs(e.delta), 0);

    consumedAiCredits += usedCredits;
    consumedMockAttempts += usedMocks;

    const remainingEntCredits = Math.max(0, incCredits - usedCredits);
    if (!params.dryRun && remainingEntCredits > 0) {
      appendLedgerEntry({
        userId: params.userId,
        entitlementId: rev.id,
        kind: 'ai_credit',
        delta: -remainingEntCredits,
        reason: `refund_revoke:${rev.id}`,
        sourceRef: params.orderId ?? rev.id,
        idempotencyKey: `refund_revoke:${rev.id}:ai_credit`,
        createdAt: nowIso,
      });
    }

    const remainingEntMocks = Math.max(0, incMocks - usedMocks);
    if (!params.dryRun && remainingEntMocks > 0) {
      appendLedgerEntry({
        userId: params.userId,
        entitlementId: rev.id,
        kind: 'mock_attempt',
        delta: -remainingEntMocks,
        reason: `refund_revoke:${rev.id}`,
        sourceRef: params.orderId ?? rev.id,
        idempotencyKey: `refund_revoke:${rev.id}:mock_attempt`,
        createdAt: nowIso,
      });
    }
  }

  return {
    revokedEntitlements: matched,
    consumedAiCredits,
    consumedMockAttempts,
    includedAiCredits,
    includedMockAttempts,
  };
}

/**
 * Persists an entitlement record directly to the database repository.
 */
export async function persistEntitlement(record: EntitlementRecord): Promise<DbEntitlementRecord> {
  return await getRepositories().entitlements.save(record as unknown as DbEntitlementRecord);
}

/**
 * Persists a ledger entry directly to the database repository with user-scoped idempotency key.
 */
export async function persistLedgerEntry(entry: EntitlementLedgerEntry): Promise<CreditLedgerEntry> {
  const scopedKey = `${entry.userId}:${entry.idempotencyKey}`;
  return await getRepositories().ledger.save({
    id: entry.id,
    userId: entry.userId,
    kind: entry.kind,
    delta: entry.delta,
    balanceAfter: entry.delta,
    reason: entry.reason,
    sourceRef: entry.sourceRef,
    idempotencyKey: scopedKey,
    createdAt: entry.createdAt,
  });
}

/**
 * Awaits all pending repository persistence writes.
 */
export async function flushLedgerPersistence(): Promise<void> {
  const pending = [...pendingRepoSaves];
  pendingRepoSaves.length = 0;
  await Promise.all(pending);
}
