import type { GradingRepo, GraderQueueItem, AuditLogEntry } from '../types';
import type { MemoryDataState } from './state';

export class MemoryGradingRepo implements GradingRepo {
  constructor(private state: MemoryDataState) {}

  async findQueueItemById(id: string): Promise<GraderQueueItem | null> {
    const item = this.state.graderQueue.get(id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  }

  async listQueue(status?: 'queued' | 'in_review' | 'graded'): Promise<GraderQueueItem[]> {
    const list: GraderQueueItem[] = [];
    for (const item of this.state.graderQueue.values()) {
      if (!status || item.status === status) {
        list.push(JSON.parse(JSON.stringify(item)));
      }
    }
    return list.sort((a, b) => new Date(a.submittedAt).getTime() - new Date(b.submittedAt).getTime());
  }

  async saveQueueItem(item: GraderQueueItem): Promise<GraderQueueItem> {
    const copy = JSON.parse(JSON.stringify(item));
    this.state.graderQueue.set(item.id, copy);
    return JSON.parse(JSON.stringify(copy));
  }

  async saveAuditEvent(event: AuditLogEntry): Promise<AuditLogEntry> {
    const copy = JSON.parse(JSON.stringify(event));
    this.state.auditLogs.push(copy);
    return JSON.parse(JSON.stringify(copy));
  }

  async listAuditLogs(targetId?: string): Promise<AuditLogEntry[]> {
    return this.state.auditLogs
      .filter((e) => !targetId || e.targetId === targetId)
      .map((e) => JSON.parse(JSON.stringify(e)));
  }
}
