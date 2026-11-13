import { eq } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { questionStat } from '../../schema/gre_curriculum';
import type { QuestionStatRepo, QuestionStatRecord } from '../types';

export class DrizzleQuestionStatRepo implements QuestionStatRepo {
  constructor(private db: DbClient) {}

  async findByQuestionId(questionId: string): Promise<QuestionStatRecord | null> {
    const rows = await this.db.select().from(questionStat).where(eq(questionStat.questionId, questionId)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async save(stat: QuestionStatRecord): Promise<QuestionStatRecord> {
    await this.db
      .insert(questionStat)
      .values({
        id: stat.id,
        questionId: stat.questionId,
        difficultyB: stat.difficultyB,
        discriminationA: stat.discriminationA,
        guessingC: stat.guessingC ?? 0,
        exposureCount: stat.exposureCount,
        correctCount: stat.correctCount,
        averageTimeMs: stat.averageTimeMs,
        updatedAt: new Date(stat.updatedAt),
      })
      .onConflictDoUpdate({
        target: questionStat.questionId,
        set: {
          difficultyB: stat.difficultyB,
          discriminationA: stat.discriminationA,
          guessingC: stat.guessingC ?? 0,
          exposureCount: stat.exposureCount,
          correctCount: stat.correctCount,
          averageTimeMs: stat.averageTimeMs,
          updatedAt: new Date(stat.updatedAt),
        },
      });

    return stat;
  }

  async update(questionId: string, updates: Partial<QuestionStatRecord>): Promise<QuestionStatRecord> {
    const existing = await this.findByQuestionId(questionId);
    const stat: QuestionStatRecord = {
      id: existing?.id || `qstat-${questionId}`,
      questionId,
      difficultyB: updates.difficultyB ?? existing?.difficultyB ?? 0,
      discriminationA: updates.discriminationA ?? existing?.discriminationA ?? 1,
      guessingC: updates.guessingC ?? existing?.guessingC ?? 0,
      exposureCount: updates.exposureCount ?? existing?.exposureCount ?? 0,
      correctCount: updates.correctCount ?? existing?.correctCount ?? 0,
      averageTimeMs: updates.averageTimeMs ?? existing?.averageTimeMs ?? 0,
      updatedAt: updates.updatedAt || new Date().toISOString(),
    };

    return this.save(stat);
  }

  private mapRow(row: typeof questionStat.$inferSelect): QuestionStatRecord {
    return {
      id: row.id,
      questionId: row.questionId,
      difficultyB: row.difficultyB,
      discriminationA: row.discriminationA,
      guessingC: row.guessingC,
      exposureCount: row.exposureCount,
      correctCount: row.correctCount,
      averageTimeMs: row.averageTimeMs,
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
