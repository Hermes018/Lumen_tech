import type { EntitlementRepo, EntitlementRecord } from '../types';
import type { MemoryDataState } from './state';

export class MemoryEntitlementRepo implements EntitlementRepo {
  constructor(private state: MemoryDataState) {}

  async findById(id: string): Promise<EntitlementRecord | null> {
    const record = this.state.entitlements.get(id);
    return record ? { ...record } : null;
  }

  async findByIdempotencyKey(key: string): Promise<EntitlementRecord | null> {
    const id = this.state.entitlementsByIdempotencyKey.get(key);
    if (!id) return null;
    const record = this.state.entitlements.get(id);
    return record ? { ...record } : null;
  }

  async findByUserId(userId: string): Promise<EntitlementRecord[]> {
    const list: EntitlementRecord[] = [];
    for (const ent of this.state.entitlements.values()) {
      if (ent.userId === userId) {
        list.push({ ...ent });
      }
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async save(entitlement: EntitlementRecord): Promise<EntitlementRecord> {
    if (entitlement.idempotencyKey) {
      const existingId = this.state.entitlementsByIdempotencyKey.get(entitlement.idempotencyKey);
      if (existingId && existingId !== entitlement.id) {
        throw new Error(`Unique constraint violation: idempotencyKey '${entitlement.idempotencyKey}' already exists`);
      }
      this.state.entitlementsByIdempotencyKey.set(entitlement.idempotencyKey, entitlement.id);
    }

    const copy = { ...entitlement, allowancesJson: { ...entitlement.allowancesJson } };
    this.state.entitlements.set(entitlement.id, copy);
    return { ...copy };
  }

  async update(id: string, updates: Partial<EntitlementRecord>): Promise<EntitlementRecord> {
    const existing = this.state.entitlements.get(id);
    if (!existing) {
      throw new Error(`Entitlement not found: ${id}`);
    }

    if (updates.idempotencyKey && updates.idempotencyKey !== existing.idempotencyKey) {
      const conflictId = this.state.entitlementsByIdempotencyKey.get(updates.idempotencyKey);
      if (conflictId && conflictId !== id) {
        throw new Error(`Unique constraint violation: idempotencyKey '${updates.idempotencyKey}' already exists`);
      }
      if (existing.idempotencyKey) {
        this.state.entitlementsByIdempotencyKey.delete(existing.idempotencyKey);
      }
      this.state.entitlementsByIdempotencyKey.set(updates.idempotencyKey, id);
    }

    const updated: EntitlementRecord = {
      ...existing,
      ...updates,
      updatedAt: updates.updatedAt || new Date().toISOString(),
    };
    this.state.entitlements.set(id, updated);
    return { ...updated };
  }
}
