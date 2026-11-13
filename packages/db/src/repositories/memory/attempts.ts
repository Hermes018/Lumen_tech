/**
 * @purpose In-memory Attempt repository implementation
 */

import type { AttemptRepo, AttemptRecord } from '../types';
import type { MemoryDataState } from './state';

export class MemoryAttemptRepo implements AttemptRepo {
  constructor(private state: MemoryDataState) {}

  async findById(id: string): Promise<AttemptRecord | null> {
    const attempt = this.state.attempts.get(id);
    return attempt ? { ...attempt } : null;
  }

  async save(attempt: AttemptRecord): Promise<AttemptRecord> {
    const record: AttemptRecord = {
      ...attempt,
      createdAt: attempt.createdAt ?? new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.state.attempts.set(record.id, record);
    return { ...record };
  }

  async listByUser(userId: string): Promise<AttemptRecord[]> {
    return Array.from(this.state.attempts.values())
      .filter((a) => a.userId === userId)
      .map((a) => ({ ...a }));
  }
}
