import type { LedgerRepo, CreditLedgerEntry } from '../types';
import type { MemoryDataState } from './state';

export class MemoryLedgerRepo implements LedgerRepo {
  constructor(private state: MemoryDataState) {}

  async save(entry: CreditLedgerEntry): Promise<CreditLedgerEntry> {
    if (entry.idempotencyKey) {
      const existingId = this.state.ledgerByIdempotencyKey.get(entry.idempotencyKey);
      if (existingId && existingId !== entry.id) {
        throw new Error(`Unique constraint violation: idempotencyKey '${entry.idempotencyKey}' already exists`);
      }
      this.state.ledgerByIdempotencyKey.set(entry.idempotencyKey, entry.id);
    }

    const copy = { ...entry };
    this.state.ledgerEntries.push(copy);
    return { ...copy };
  }

  async findByIdempotencyKey(key: string): Promise<CreditLedgerEntry | null> {
    const id = this.state.ledgerByIdempotencyKey.get(key);
    if (!id) return null;
    const entry = this.state.ledgerEntries.find((e) => e.id === id);
    return entry ? { ...entry } : null;
  }

  async listByUser(userId: string, kind?: 'ai_credit' | 'mock_attempt'): Promise<CreditLedgerEntry[]> {
    return this.state.ledgerEntries
      .filter((e) => e.userId === userId && (!kind || e.kind === kind))
      .map((e) => ({ ...e }));
  }

  async getBalance(userId: string, kind: 'ai_credit' | 'mock_attempt'): Promise<number> {
    const entries = this.state.ledgerEntries.filter((e) => e.userId === userId && e.kind === kind);
    return entries.reduce((sum, e) => sum + e.delta, 0);
  }
}
