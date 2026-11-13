import { eq, and, lte } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { userVocabCard, type FSRSState } from '../../schema/fsrs_vocab';
import type { VocabCardRepo, VocabCardRecord } from '../types';

export class DrizzleVocabCardRepo implements VocabCardRepo {
  constructor(private db: DbClient) {}

  async findByUserAndWord(userId: string, wordId: string): Promise<VocabCardRecord | null> {
    const rows = await this.db
      .select()
      .from(userVocabCard)
      .where(
        and(
          eq(userVocabCard.userId, userId),
          eq(userVocabCard.wordId, wordId)
        )
      )
      .limit(1);

    const row = rows[0];
    if (!row) return null;
    return this.mapRow(row);
  }

  async listDueCards(userId: string, asOfDate: Date): Promise<VocabCardRecord[]> {
    const rows = await this.db
      .select()
      .from(userVocabCard)
      .where(
        and(
          eq(userVocabCard.userId, userId),
          lte(userVocabCard.dueAt, asOfDate)
        )
      )
      .orderBy(userVocabCard.dueAt);

    return rows.map((r) => this.mapRow(r));
  }

  async saveCard(card: VocabCardRecord): Promise<VocabCardRecord> {
    const id = `${card.userId}-${card.wordId}`;
    const dueAtDate = new Date(card.due);
    const lastReviewAtDate = card.lastReview ? new Date(card.lastReview) : null;

    await this.db
      .insert(userVocabCard)
      .values({
        id,
        userId: card.userId,
        wordId: card.wordId,
        state: card.state as FSRSState,
        stability: card.stability,
        difficulty: card.difficulty,
        elapsedDays: card.elapsedDays,
        scheduledDays: card.scheduledDays,
        reps: card.reps,
        lapses: card.lapses,
        dueAt: dueAtDate,
        lastReviewAt: lastReviewAtDate,
      })
      .onConflictDoUpdate({
        target: userVocabCard.id,
        set: {
          state: card.state as FSRSState,
          stability: card.stability,
          difficulty: card.difficulty,
          elapsedDays: card.elapsedDays,
          scheduledDays: card.scheduledDays,
          reps: card.reps,
          lapses: card.lapses,
          dueAt: dueAtDate,
          lastReviewAt: lastReviewAtDate,
          updatedAt: new Date(),
        },
      });

    return card;
  }

  private mapRow(row: typeof userVocabCard.$inferSelect): VocabCardRecord {
    return {
      id: row.id,
      userId: row.userId,
      wordId: row.wordId,
      state: row.state as VocabCardRecord['state'],
      stability: row.stability,
      difficulty: row.difficulty,
      elapsedDays: row.elapsedDays,
      scheduledDays: row.scheduledDays,
      reps: row.reps,
      lapses: row.lapses,
      due: row.dueAt.toISOString(),
      lastReview: row.lastReviewAt ? row.lastReviewAt.toISOString() : undefined,
    };
  }
}
