import type { PaymentRepo, PaymentRecord } from '../types';
import type { MemoryDataState } from './state';

export class MemoryPaymentRepo implements PaymentRepo {
  constructor(private state: MemoryDataState) {}

  async findById(id: string): Promise<PaymentRecord | null> {
    const payment = this.state.payments.get(id);
    return payment ? { ...payment } : null;
  }

  async findByProviderRef(providerRef: string): Promise<PaymentRecord | null> {
    const paymentId = this.state.paymentsByProviderRef.get(providerRef);
    if (!paymentId) return null;
    const payment = this.state.payments.get(paymentId);
    return payment ? { ...payment } : null;
  }

  async save(payment: PaymentRecord): Promise<PaymentRecord> {
    const existingId = this.state.paymentsByProviderRef.get(payment.providerRef);
    if (existingId && existingId !== payment.id) {
      throw new Error(`Unique constraint violation: providerRef '${payment.providerRef}' already exists`);
    }

    const copy = { ...payment };
    this.state.payments.set(payment.id, copy);
    this.state.paymentsByProviderRef.set(payment.providerRef, payment.id);
    return { ...copy };
  }

  async update(id: string, updates: Partial<PaymentRecord>): Promise<PaymentRecord> {
    const existing = this.state.payments.get(id);
    if (!existing) {
      throw new Error(`Payment not found: ${id}`);
    }

    if (updates.providerRef && updates.providerRef !== existing.providerRef) {
      const conflictId = this.state.paymentsByProviderRef.get(updates.providerRef);
      if (conflictId && conflictId !== id) {
        throw new Error(`Unique constraint violation: providerRef '${updates.providerRef}' already exists`);
      }
      this.state.paymentsByProviderRef.delete(existing.providerRef);
      this.state.paymentsByProviderRef.set(updates.providerRef, id);
    }

    const updated: PaymentRecord = {
      ...existing,
      ...updates,
    };
    this.state.payments.set(id, updated);
    return { ...updated };
  }
}
