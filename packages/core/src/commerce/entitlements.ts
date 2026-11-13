/** @purpose Entitlements engine mapping purchased products to grants, allowances, and access controls */

import { CANONICAL_PRODUCTS, type ProductDefinition } from './products';

export interface EntitlementRecord {
  id: string;
  userId: string;
  productId: string;
  productSlug: string;
  productName: string;
  source: 'purchase' | 'manual_grant' | 'trial' | 'refund';
  orderId?: string;
  idempotencyKey?: string;
  amountPaidMinor?: number;
  currency?: string;
  startsAt: string;
  endsAt: string | null;
  allowancesJson: Record<string, unknown>;
  isActive: boolean;
  createdAt: string;
}

// In-memory registry for user entitlements and idempotency keys
const userEntitlementsMap = new Map<string, EntitlementRecord[]>();
const entitlementByIdempotencyKey = new Map<string, EntitlementRecord>();

/**
 * Grants an entitlement to a user upon verified purchase or manual grant.
 * Follows D5 & docs/10 specification. Enforces idempotency when idempotencyKey is provided.
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
  }
): EntitlementRecord {
  if (meta?.idempotencyKey) {
    const existingByKey = entitlementByIdempotencyKey.get(meta.idempotencyKey);
    if (existingByKey) {
      return existingByKey;
    }
  }

  const productDef: ProductDefinition | undefined = CANONICAL_PRODUCTS.find(
    (p) => p.slug === productSlug
  );

  const durationDays = productDef?.duration_days ?? 183;
  const startsAt = now.toISOString();
  const endsAt = new Date(now.getTime() + durationDays * 24 * 60 * 60 * 1000).toISOString();

  const allowances = productDef?.allowances ?? {
    ai_credits: 10,
    full_mocks: 4,
    ai_daily_cap: 3,
  };

  const record: EntitlementRecord = {
    id: `ent-${userId}-${productSlug}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    userId,
    productId: productDef?.slug ?? productSlug,
    productSlug,
    productName: productDef?.name ?? productSlug,
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

  if (meta?.idempotencyKey) {
    entitlementByIdempotencyKey.set(meta.idempotencyKey, record);
  }

  return record;
}

/**
 * Checks if a user has an active entitlement for a specific product.
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
    if (e.endsAt && new Date(e.endsAt).getTime() < nowMs) return false;
    return true;
  });
}

/**
 * Retrieves all active entitlements for a given user.
 */
export function getUserEntitlements(userId: string, now = new Date()): EntitlementRecord[] {
  const list = userEntitlementsMap.get(userId) ?? [];
  const nowMs = now.getTime();

  return list.filter((e) => {
    if (!e.isActive) return false;
    if (e.endsAt && new Date(e.endsAt).getTime() < nowMs) return false;
    return true;
  });
}
