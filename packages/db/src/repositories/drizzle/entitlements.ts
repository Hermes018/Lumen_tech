import { eq, desc } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { entitlement } from '../../schema/catalog';
import type { EntitlementRepo, EntitlementRecord } from '../types';

export class DrizzleEntitlementRepo implements EntitlementRepo {
  constructor(private db: DbClient) {}

  async findById(id: string): Promise<EntitlementRecord | null> {
    const rows = await this.db.select().from(entitlement).where(eq(entitlement.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async findByIdempotencyKey(_key: string): Promise<EntitlementRecord | null> {
    // In catalog schema, idempotencyKey can be mapped from allowancesJson
    const rows = await this.db.select().from(entitlement);
    for (const r of rows) {
      const allowances = (r.allowancesJson as Record<string, unknown>) || {};
      if (allowances._idempotencyKey === _key) {
        return this.mapRow(r);
      }
    }
    return null;
  }

  async findByUserId(userId: string): Promise<EntitlementRecord[]> {
    const rows = await this.db
      .select()
      .from(entitlement)
      .where(eq(entitlement.userId, userId))
      .orderBy(desc(entitlement.createdAt));

    return rows.map((r) => this.mapRow(r));
  }

  async save(record: EntitlementRecord): Promise<EntitlementRecord> {
    const allowances = {
      ...(record.allowancesJson || {}),
      _productSlug: record.productSlug,
      _productName: record.productName,
      _tier: record.tier,
      _orderId: record.orderId,
      _idempotencyKey: record.idempotencyKey,
      _amountPaidMinor: record.amountPaidMinor,
      _currency: record.currency,
      _revokedAt: record.revokedAt,
      _revokeReason: record.revokeReason,
    };

    await this.db
      .insert(entitlement)
      .values({
        id: record.id,
        userId: record.userId,
        productId: record.productId,
        source: record.source,
        startsAt: new Date(record.startsAt),
        endsAt: record.endsAt ? new Date(record.endsAt) : null,
        allowancesJson: allowances,
        isActive: record.isActive,
        createdAt: new Date(record.createdAt),
        updatedAt: new Date(record.updatedAt),
      })
      .onConflictDoUpdate({
        target: entitlement.id,
        set: {
          endsAt: record.endsAt ? new Date(record.endsAt) : null,
          allowancesJson: allowances,
          isActive: record.isActive,
          updatedAt: new Date(record.updatedAt),
        },
      });

    return record;
  }

  async update(id: string, updates: Partial<EntitlementRecord>): Promise<EntitlementRecord> {
    const existing = await this.findById(id);
    if (!existing) {
      throw new Error(`Entitlement not found: ${id}`);
    }

    const merged: EntitlementRecord = {
      ...existing,
      ...updates,
      updatedAt: updates.updatedAt || new Date().toISOString(),
    };

    await this.save(merged);
    return merged;
  }

  private mapRow(row: typeof entitlement.$inferSelect): EntitlementRecord {
    const allowances = (row.allowancesJson as Record<string, unknown>) || {};
    return {
      id: row.id,
      userId: row.userId,
      productId: row.productId || '',
      productSlug: (allowances._productSlug as string) || '',
      productName: (allowances._productName as string) || 'Lumen Course',
      tier: (allowances._tier as EntitlementRecord['tier']) || 'core',
      source: row.source as EntitlementRecord['source'],
      orderId: (allowances._orderId as string) || undefined,
      idempotencyKey: (allowances._idempotencyKey as string) || undefined,
      amountPaidMinor: (allowances._amountPaidMinor as number) || undefined,
      currency: (allowances._currency as string) || undefined,
      startsAt: row.startsAt.toISOString(),
      endsAt: row.endsAt ? row.endsAt.toISOString() : null,
      allowancesJson: allowances,
      isActive: row.isActive,
      revokedAt: (allowances._revokedAt as string) || undefined,
      revokeReason: (allowances._revokeReason as string) || undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
