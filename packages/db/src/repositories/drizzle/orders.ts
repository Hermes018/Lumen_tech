import { eq, desc } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { orderTable } from '../../schema/commerce';
import type { OrderRepo, OrderRecord } from '../types';

export class DrizzleOrderRepo implements OrderRepo {
  constructor(private db: DbClient) {}

  async findById(id: string): Promise<OrderRecord | null> {
    const rows = await this.db.select().from(orderTable).where(eq(orderTable.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async findByProviderRef(providerRef: string): Promise<OrderRecord | null> {
    const rows = await this.db.select().from(orderTable).where(eq(orderTable.providerRef, providerRef)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async save(order: OrderRecord): Promise<OrderRecord> {
    await this.db
      .insert(orderTable)
      .values({
        id: order.id,
        userId: order.userId,
        providerRef: order.providerRef,
        productSlug: order.productSlug,
        productName: order.productName,
        amountMinor: order.amountMinor,
        currency: order.currency,
        status: order.status,
        customerJson: order.customer,
        providerSessionId: order.providerSessionId,
        valId: order.valId,
        entitlementId: order.entitlementId,
        paidAt: order.paidAt ? new Date(order.paidAt) : undefined,
        refundedAt: order.refundedAt ? new Date(order.refundedAt) : undefined,
        createdAt: new Date(order.createdAt),
        updatedAt: new Date(order.updatedAt),
      })
      .onConflictDoUpdate({
        target: orderTable.id,
        set: {
          status: order.status,
          providerSessionId: order.providerSessionId,
          valId: order.valId,
          entitlementId: order.entitlementId,
          paidAt: order.paidAt ? new Date(order.paidAt) : undefined,
          refundedAt: order.refundedAt ? new Date(order.refundedAt) : undefined,
          updatedAt: new Date(order.updatedAt),
        },
      });

    return order;
  }

  async update(id: string, updates: Partial<OrderRecord>): Promise<OrderRecord> {
    const values: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (updates.status !== undefined) values.status = updates.status;
    if (updates.providerSessionId !== undefined) values.providerSessionId = updates.providerSessionId;
    if (updates.valId !== undefined) values.valId = updates.valId;
    if (updates.entitlementId !== undefined) values.entitlementId = updates.entitlementId;
    if (updates.paidAt !== undefined) values.paidAt = updates.paidAt ? new Date(updates.paidAt) : null;
    if (updates.refundedAt !== undefined) values.refundedAt = updates.refundedAt ? new Date(updates.refundedAt) : null;

    const rows = await this.db
      .update(orderTable)
      .set(values)
      .where(eq(orderTable.id, id))
      .returning();

    const row = rows[0];
    if (!row) {
      throw new Error(`Order not found: ${id}`);
    }
    return this.mapRow(row);
  }

  async listByUser(userId: string): Promise<OrderRecord[]> {
    const rows = await this.db
      .select()
      .from(orderTable)
      .where(eq(orderTable.userId, userId))
      .orderBy(desc(orderTable.createdAt));

    return rows.map((r) => this.mapRow(r));
  }

  private mapRow(row: typeof orderTable.$inferSelect): OrderRecord {
    return {
      id: row.id,
      userId: row.userId,
      providerRef: row.providerRef,
      productSlug: row.productSlug,
      productName: row.productName,
      amountMinor: row.amountMinor,
      currency: row.currency,
      status: row.status as OrderRecord['status'],
      customer: row.customerJson as OrderRecord['customer'],
      providerSessionId: row.providerSessionId ?? undefined,
      valId: row.valId ?? undefined,
      entitlementId: row.entitlementId ?? undefined,
      paidAt: row.paidAt ? row.paidAt.toISOString() : undefined,
      refundedAt: row.refundedAt ? row.refundedAt.toISOString() : undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
