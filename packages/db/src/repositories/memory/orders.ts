import type { OrderRepo, OrderRecord } from '../types';
import type { MemoryDataState } from './state';

export class MemoryOrderRepo implements OrderRepo {
  constructor(private state: MemoryDataState) {}

  async findById(id: string): Promise<OrderRecord | null> {
    const order = this.state.orders.get(id);
    return order ? { ...order } : null;
  }

  async findByProviderRef(providerRef: string): Promise<OrderRecord | null> {
    const orderId = this.state.ordersByProviderRef.get(providerRef);
    if (!orderId) return null;
    const order = this.state.orders.get(orderId);
    return order ? { ...order } : null;
  }

  async save(order: OrderRecord): Promise<OrderRecord> {
    const existingId = this.state.ordersByProviderRef.get(order.providerRef);
    if (existingId && existingId !== order.id) {
      throw new Error(`Unique constraint violation: providerRef '${order.providerRef}' already exists`);
    }

    const copy = { ...order, customer: { ...order.customer } };
    this.state.orders.set(order.id, copy);
    this.state.ordersByProviderRef.set(order.providerRef, order.id);
    return { ...copy };
  }

  async update(id: string, updates: Partial<OrderRecord>): Promise<OrderRecord> {
    const existing = this.state.orders.get(id);
    if (!existing) {
      throw new Error(`Order not found: ${id}`);
    }

    if (updates.providerRef && updates.providerRef !== existing.providerRef) {
      const conflictId = this.state.ordersByProviderRef.get(updates.providerRef);
      if (conflictId && conflictId !== id) {
        throw new Error(`Unique constraint violation: providerRef '${updates.providerRef}' already exists`);
      }
      this.state.ordersByProviderRef.delete(existing.providerRef);
      this.state.ordersByProviderRef.set(updates.providerRef, id);
    }

    const updated: OrderRecord = {
      ...existing,
      ...updates,
      updatedAt: updates.updatedAt || new Date().toISOString(),
    };
    this.state.orders.set(id, updated);
    return { ...updated };
  }

  async listByUser(userId: string): Promise<OrderRecord[]> {
    const list: OrderRecord[] = [];
    for (const order of this.state.orders.values()) {
      if (order.userId === userId) {
        list.push({ ...order });
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }
}
