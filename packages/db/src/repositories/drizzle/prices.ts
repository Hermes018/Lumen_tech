import { eq, and } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { price } from '../../schema/catalog';
import type { PriceRepo, PriceRecord, PriceHistoryRecord } from '../types';

export class DrizzlePriceRepo implements PriceRepo {
  constructor(private db: DbClient) {}

  async findPrice(productId: string, region: string): Promise<PriceRecord | null> {
    const rows = await this.db
      .select()
      .from(price)
      .where(and(eq(price.productId, productId), eq(price.region, region)))
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async listPrices(productId: string): Promise<PriceRecord[]> {
    const rows = await this.db.select().from(price).where(eq(price.productId, productId));
    return rows.map((r) => this.mapRow(r));
  }

  async getPriceHistory(_priceId: string, _days?: number): Promise<PriceHistoryRecord[]> {
    return [];
  }

  private mapRow(row: typeof price.$inferSelect): PriceRecord {
    return {
      id: row.id,
      productId: row.productId,
      region: row.region,
      currency: row.currency,
      amountMinor: row.amountMinor,
      billingInterval: row.billingInterval,
    };
  }
}
