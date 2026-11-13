import type { PriceRepo, PriceRecord, PriceHistoryRecord } from '../types';
import type { MemoryDataState } from './state';

export class MemoryPriceRepo implements PriceRepo {
  constructor(private state: MemoryDataState) {}

  async findPrice(productId: string, region: string): Promise<PriceRecord | null> {
    for (const price of this.state.prices.values()) {
      if (price.productId === productId && price.region === region) {
        return { ...price };
      }
    }
    return null;
  }

  async listPrices(productId: string): Promise<PriceRecord[]> {
    const list: PriceRecord[] = [];
    for (const price of this.state.prices.values()) {
      if (price.productId === productId) {
        list.push({ ...price });
      }
    }
    return list;
  }

  async getPriceHistory(priceId: string, _days?: number): Promise<PriceHistoryRecord[]> {
    const history = this.state.priceHistory.get(priceId) || [];
    return history.map((h) => ({ ...h }));
  }
}
