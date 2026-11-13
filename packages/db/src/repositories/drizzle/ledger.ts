import { eq, and, sql } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { entitlementLedgerTable } from '../../schema/commerce';
import type { LedgerRepo, CreditLedgerEntry } from '../types';

export class DrizzleLedgerRepo implements LedgerRepo {
  constructor(private db: DbClient) {}

  async save(entry: CreditLedgerEntry): Promise<CreditLedgerEntry> {
    await this.db.insert(entitlementLedgerTable).values({
      id: entry.id,
      userId: entry.userId,
      kind: entry.kind,
      delta: entry.delta,
      balanceAfter: entry.balanceAfter,
      reason: entry.reason,
      sourceRef: entry.sourceRef,
      idempotencyKey: entry.idempotencyKey,
      createdAt: new Date(entry.createdAt),
    });

    return entry;
  }

  async findByIdempotencyKey(key: string): Promise<CreditLedgerEntry | null> {
    const rows = await this.db
      .select()
      .from(entitlementLedgerTable)
      .where(eq(entitlementLedgerTable.idempotencyKey, key))
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async listByUser(userId: string, kind?: 'ai_credit' | 'mock_attempt'): Promise<CreditLedgerEntry[]> {
    const conditions = [eq(entitlementLedgerTable.userId, userId)];
    if (kind) {
      conditions.push(eq(entitlementLedgerTable.kind, kind));
    }

    const rows = await this.db
      .select()
      .from(entitlementLedgerTable)
      .where(and(...conditions));

    return rows.map((r) => this.mapRow(r));
  }

  async getBalance(userId: string, kind: 'ai_credit' | 'mock_attempt'): Promise<number> {
    const rows = await this.db
      .select({ total: sql<number>`COALESCE(SUM(${entitlementLedgerTable.delta}), 0)` })
      .from(entitlementLedgerTable)
      .where(
        and(
          eq(entitlementLedgerTable.userId, userId),
          eq(entitlementLedgerTable.kind, kind)
        )
      );

    const total = rows[0]?.total;
    return Number(total ?? 0);
  }

  private mapRow(row: typeof entitlementLedgerTable.$inferSelect): CreditLedgerEntry {
    return {
      id: row.id,
      userId: row.userId,
      kind: row.kind as CreditLedgerEntry['kind'],
      delta: row.delta,
      balanceAfter: row.balanceAfter,
      reason: row.reason,
      sourceRef: row.sourceRef ?? undefined,
      idempotencyKey: row.idempotencyKey ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
