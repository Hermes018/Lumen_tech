import { eq, and, desc } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { mistakeEntryTable } from '../../schema/mistakes';
import type { MistakeRepo, MistakeEntry } from '../types';

export class DrizzleMistakeRepo implements MistakeRepo {
  constructor(private db: DbClient) {}

  async getEntries(userId: string): Promise<MistakeEntry[]> {
    const rows = await this.db
      .select()
      .from(mistakeEntryTable)
      .where(eq(mistakeEntryTable.userId, userId))
      .orderBy(desc(mistakeEntryTable.lastAttemptAt));

    return rows.map((r) => this.mapRow(r));
  }

  async findEntry(userId: string, questionId: string): Promise<MistakeEntry | null> {
    const rows = await this.db
      .select()
      .from(mistakeEntryTable)
      .where(
        and(
          eq(mistakeEntryTable.userId, userId),
          eq(mistakeEntryTable.questionId, questionId)
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async saveEntry(userId: string, entry: MistakeEntry): Promise<MistakeEntry> {
    await this.db
      .insert(mistakeEntryTable)
      .values({
        id: entry.id,
        userId,
        questionId: entry.questionId,
        sourceAttemptId: entry.sourceAttemptId,
        sourceSessionId: entry.sourceSessionId,
        subject: entry.subject,
        topicSlug: entry.topicSlug,
        questionPrompt: entry.questionPrompt,
        optionsJson: entry.options,
        selectedWrongAnswer: entry.selectedWrongAnswer,
        correctAnswersJson: entry.correctAnswers,
        explanationMd: entry.explanationMd,
        errorCategory: entry.errorCategory,
        notes: entry.notes,
        status: entry.status,
        attemptsCount: entry.attemptsCount,
        lastAttemptAt: new Date(entry.lastAttemptAt),
        resolvedAt: entry.resolvedAt ? new Date(entry.resolvedAt) : null,
        isMistakeRetry: true,
        excludeFromIrt: true,
        createdAt: new Date(entry.createdAt),
        updatedAt: new Date(entry.updatedAt),
      })
      .onConflictDoUpdate({
        target: mistakeEntryTable.id,
        set: {
          selectedWrongAnswer: entry.selectedWrongAnswer,
          errorCategory: entry.errorCategory,
          notes: entry.notes,
          status: entry.status,
          attemptsCount: entry.attemptsCount,
          lastAttemptAt: new Date(entry.lastAttemptAt),
          resolvedAt: entry.resolvedAt ? new Date(entry.resolvedAt) : null,
          updatedAt: new Date(entry.updatedAt),
        },
      });

    return entry;
  }

  private mapRow(row: typeof mistakeEntryTable.$inferSelect): MistakeEntry {
    return {
      id: row.id,
      userId: row.userId,
      questionId: row.questionId,
      sourceAttemptId: row.sourceAttemptId ?? undefined,
      sourceSessionId: row.sourceSessionId ?? undefined,
      subject: row.subject as MistakeEntry['subject'],
      topicSlug: row.topicSlug,
      questionPrompt: row.questionPrompt,
      options: (row.optionsJson as MistakeEntry['options']) ?? undefined,
      selectedWrongAnswer: row.selectedWrongAnswer,
      correctAnswers: (row.correctAnswersJson as string[]) || [],
      explanationMd: row.explanationMd ?? undefined,
      errorCategory: row.errorCategory,
      notes: row.notes ?? undefined,
      status: row.status as MistakeEntry['status'],
      attemptsCount: row.attemptsCount,
      lastAttemptAt: row.lastAttemptAt.toISOString(),
      resolvedAt: row.resolvedAt ? row.resolvedAt.toISOString() : undefined,
      isMistakeRetry: true,
      excludeFromIrt: true,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }
}
