/**
 * @purpose Drizzle Attempt repository implementation using Neon PostgreSQL (P1-33 / P1-47)
 */

import { eq } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { examAttempt } from '../../schema/attempts';
import type { AttemptRepo, AttemptRecord } from '../types';

export class DrizzleAttemptRepo implements AttemptRepo {
  constructor(private db: DbClient) {}

  async findById(id: string): Promise<AttemptRecord | null> {
    const rows = await this.db.select().from(examAttempt).where(eq(examAttempt.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      userId: row.userId,
      examType: row.examType,
      status: row.status,
      startedAt: row.startedAt.toISOString(),
      completedAt: row.completedAt ? row.completedAt.toISOString() : undefined,
      totalScore: row.totalScore ?? undefined,
      sectionScoresJson: (row.sectionScoresJson as Record<string, unknown>) ?? undefined,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  async save(attempt: AttemptRecord): Promise<AttemptRecord> {
    const startedAt = attempt.startedAt ? new Date(attempt.startedAt) : new Date();
    const completedAt = attempt.completedAt ? new Date(attempt.completedAt) : null;
    const now = new Date();

    await this.db
      .insert(examAttempt)
      .values({
        id: attempt.id,
        userId: attempt.userId,
        examType: attempt.examType,
        status: attempt.status,
        startedAt,
        completedAt,
        totalScore: attempt.totalScore ?? null,
        sectionScoresJson: attempt.sectionScoresJson ?? (attempt.report as Record<string, unknown>) ?? null,
        createdAt: attempt.createdAt ? new Date(attempt.createdAt) : now,
        updatedAt: now,
      })
      .onConflictDoUpdate({
        target: examAttempt.id,
        set: {
          status: attempt.status,
          completedAt,
          totalScore: attempt.totalScore ?? null,
          sectionScoresJson: attempt.sectionScoresJson ?? (attempt.report as Record<string, unknown>) ?? null,
          updatedAt: now,
        },
      });

    return { ...attempt, updatedAt: now.toISOString() };
  }

  async listByUser(userId: string): Promise<AttemptRecord[]> {
    const rows = await this.db.select().from(examAttempt).where(eq(examAttempt.userId, userId));
    return rows.map((r) => ({
      id: r.id,
      userId: r.userId,
      examType: r.examType,
      status: r.status,
      startedAt: r.startedAt.toISOString(),
      completedAt: r.completedAt ? r.completedAt.toISOString() : undefined,
      totalScore: r.totalScore ?? undefined,
      sectionScoresJson: (r.sectionScoresJson as Record<string, unknown>) ?? undefined,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    }));
  }
}
