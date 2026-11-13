import { eq, desc } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { graderQueueTable } from '../../schema/grading';
import { auditLog } from '../../schema/auth';
import type { GradingRepo, GraderQueueItem, AuditLogEntry } from '../types';

export class DrizzleGradingRepo implements GradingRepo {
  constructor(private db: DbClient) {}

  async findQueueItemById(id: string): Promise<GraderQueueItem | null> {
    const rows = await this.db.select().from(graderQueueTable).where(eq(graderQueueTable.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return this.mapQueueRow(row);
  }

  async listQueue(status?: 'queued' | 'in_review' | 'graded'): Promise<GraderQueueItem[]> {
    const query = this.db.select().from(graderQueueTable);
    const rows = status
      ? await query.where(eq(graderQueueTable.status, status)).orderBy(graderQueueTable.submittedAt)
      : await query.orderBy(graderQueueTable.submittedAt);

    return rows.map((r) => this.mapQueueRow(r));
  }

  async saveQueueItem(item: GraderQueueItem): Promise<GraderQueueItem> {
    await this.db
      .insert(graderQueueTable)
      .values({
        id: item.id,
        submissionId: item.submissionId,
        examAttemptId: item.examAttemptId,
        learnerId: item.learnerId,
        promptMd: item.promptMd,
        essayText: item.essayText,
        wordCount: item.wordCount,
        submittedAt: new Date(item.submittedAt),
        status: item.status,
        assignedGraderId: item.assignedGraderId,
        aiEvaluationJson: item.aiEvaluation,
        humanEvaluationJson: item.humanEvaluation,
      })
      .onConflictDoUpdate({
        target: graderQueueTable.id,
        set: {
          status: item.status,
          assignedGraderId: item.assignedGraderId,
          humanEvaluationJson: item.humanEvaluation,
          updatedAt: new Date(),
        },
      });

    return item;
  }

  async saveAuditEvent(event: AuditLogEntry): Promise<AuditLogEntry> {
    await this.db.insert(auditLog).values({
      id: event.id,
      actorId: event.actorId,
      action: event.action,
      resourceType: event.targetType,
      resourceId: event.targetId,
      metadata: event.metadataJson,
      createdAt: new Date(event.createdAt),
    });

    return event;
  }

  async listAuditLogs(targetId?: string): Promise<AuditLogEntry[]> {
    const query = this.db.select().from(auditLog);
    const rows = targetId
      ? await query.where(eq(auditLog.resourceId, targetId)).orderBy(desc(auditLog.createdAt))
      : await query.orderBy(desc(auditLog.createdAt));

    return rows.map((r) => ({
      id: r.id,
      actorId: r.actorId || 'system',
      action: r.action,
      targetType: r.resourceType,
      targetId: r.resourceId || '',
      reason: (r.metadata as Record<string, string>)?.reason || '',
      metadataJson: (r.metadata as Record<string, unknown>) || {},
      createdAt: r.createdAt.toISOString(),
    }));
  }

  private mapQueueRow(row: typeof graderQueueTable.$inferSelect): GraderQueueItem {
    return {
      id: row.id,
      submissionId: row.submissionId,
      examAttemptId: row.examAttemptId,
      learnerId: row.learnerId,
      promptMd: row.promptMd,
      essayText: row.essayText,
      wordCount: row.wordCount,
      submittedAt: row.submittedAt.toISOString(),
      status: row.status as GraderQueueItem['status'],
      assignedGraderId: row.assignedGraderId ?? undefined,
      aiEvaluation: row.aiEvaluationJson as GraderQueueItem['aiEvaluation'],
      humanEvaluation: (row.humanEvaluationJson as GraderQueueItem['humanEvaluation']) ?? undefined,
    };
  }
}
