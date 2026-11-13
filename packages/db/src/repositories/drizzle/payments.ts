import { eq } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { paymentTable } from '../../schema/commerce';
import type { PaymentRepo, PaymentRecord } from '../types';

export class DrizzlePaymentRepo implements PaymentRepo {
  constructor(private db: DbClient) {}

  async findById(id: string): Promise<PaymentRecord | null> {
    const rows = await this.db.select().from(paymentTable).where(eq(paymentTable.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async findByProviderRef(providerRef: string): Promise<PaymentRecord | null> {
    const rows = await this.db.select().from(paymentTable).where(eq(paymentTable.providerRef, providerRef)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async save(payment: PaymentRecord): Promise<PaymentRecord> {
    await this.db
      .insert(paymentTable)
      .values({
        id: payment.id,
        orderId: payment.orderId,
        provider: payment.provider,
        providerRef: payment.providerRef,
        valId: payment.valId,
        amountMinor: payment.amountMinor,
        currency: payment.currency,
        status: payment.status,
        bankTranId: payment.bankTranId,
        cardType: payment.cardType,
        rawPayloadJson: payment.rawPayload,
        validatedAt: new Date(payment.validatedAt),
        createdAt: new Date(payment.createdAt),
      })
      .onConflictDoUpdate({
        target: paymentTable.id,
        set: {
          status: payment.status,
          valId: payment.valId,
          bankTranId: payment.bankTranId,
          cardType: payment.cardType,
          rawPayloadJson: payment.rawPayload,
          validatedAt: new Date(payment.validatedAt),
        },
      });

    return payment;
  }

  async update(id: string, updates: Partial<PaymentRecord>): Promise<PaymentRecord> {
    const values: Record<string, unknown> = {};
    if (updates.status !== undefined) values.status = updates.status;
    if (updates.valId !== undefined) values.valId = updates.valId;
    if (updates.bankTranId !== undefined) values.bankTranId = updates.bankTranId;
    if (updates.cardType !== undefined) values.cardType = updates.cardType;
    if (updates.rawPayload !== undefined) values.rawPayloadJson = updates.rawPayload;
    if (updates.validatedAt !== undefined) values.validatedAt = new Date(updates.validatedAt);

    const rows = await this.db
      .update(paymentTable)
      .set(values)
      .where(eq(paymentTable.id, id))
      .returning();

    const row = rows[0];
    if (!row) {
      throw new Error(`Payment not found: ${id}`);
    }
    return this.mapRow(row);
  }

  private mapRow(row: typeof paymentTable.$inferSelect): PaymentRecord {
    return {
      id: row.id,
      orderId: row.orderId,
      provider: row.provider as PaymentRecord['provider'],
      providerRef: row.providerRef,
      valId: row.valId ?? undefined,
      amountMinor: row.amountMinor,
      currency: row.currency,
      status: row.status as PaymentRecord['status'],
      bankTranId: row.bankTranId ?? undefined,
      cardType: row.cardType ?? undefined,
      rawPayload: (row.rawPayloadJson as Record<string, unknown>) ?? undefined,
      validatedAt: row.validatedAt.toISOString(),
      createdAt: row.createdAt.toISOString(),
    };
  }
}
