import { eq, desc } from 'drizzle-orm';
import type { DbClient } from '../../client';
import {
  question,
  questionVersion,
  type PedagogyHint,
  type ChoiceExplanation,
  type SocraticStep,
  type VerbalDeconstructor,
} from '../../schema/gre_curriculum';
import type {
  QuestionRepo,
  QuestionRecord,
  QuestionVersionRecord,
  QuestionDetailRecord,
  QuestionListItem,
} from '../types';

export class DrizzleQuestionRepo implements QuestionRepo {
  constructor(private db: DbClient) {}

  async findQuestionById(id: string): Promise<QuestionRecord | null> {
    const rows = await this.db.select().from(question).where(eq(question.id, id)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return this.mapQuestion(row);
  }

  async findQuestionDetail(id: string): Promise<QuestionDetailRecord | null> {
    const q = await this.findQuestionById(id);
    if (!q) return null;

    const versions = await this.listVersions(id);
    const liveVersion = versions.find((v) => v.id === q.liveVersionId) || versions[0];
    if (!liveVersion) {
      throw new Error(`No versions found for question ${id}`);
    }

    return {
      ...q,
      liveVersion,
      versions,
    };
  }

  async listQuestions(filters?: { examType?: string; status?: string; topicSlug?: string }): Promise<QuestionListItem[]> {
    const rows = await this.db.select().from(question).orderBy(desc(question.updatedAt));
    const items: QuestionListItem[] = [];

    for (const row of rows) {
      if (filters?.examType && row.examType !== filters.examType) continue;
      if (filters?.status && row.status !== filters.status) continue;

      let promptSnippet = '';
      let questionType = 'unknown';
      let versionNumber = 1;

      if (row.liveVersionId) {
        const v = await this.findVersionById(row.liveVersionId);
        if (v) {
          promptSnippet = v.promptMd ? v.promptMd.slice(0, 80) : '';
          questionType = v.questionType;
          versionNumber = v.versionNumber;
        }
      }

      items.push({
        id: row.id,
        examType: row.examType,
        section: 'verbal', // fallback
        topicSlug: row.defaultTopicId || '',
        questionType,
        promptSnippet,
        status: row.status as QuestionListItem['status'],
        versionNumber,
        authorId: row.authorId || '',
        updatedAt: row.updatedAt.toISOString(),
      });
    }

    return items;
  }

  async saveQuestion(q: QuestionRecord, version?: QuestionVersionRecord): Promise<QuestionRecord> {
    await this.db
      .insert(question)
      .values({
        id: q.id,
        examType: q.examType,
        defaultTopicId: q.defaultTopicId,
        authorId: q.authorId,
        status: q.status,
        liveVersionId: q.liveVersionId,
        createdAt: new Date(q.createdAt),
        updatedAt: new Date(q.updatedAt),
      })
      .onConflictDoUpdate({
        target: question.id,
        set: {
          status: q.status,
          liveVersionId: q.liveVersionId,
          updatedAt: new Date(q.updatedAt),
        },
      });

    if (version) {
      await this.db
        .insert(questionVersion)
        .values({
          id: version.id,
          questionId: version.questionId,
          versionNumber: version.versionNumber,
          questionType: version.questionType,
          promptMd: version.promptMd,
          passageMd: version.passageMd,
          optionsJson: version.optionsJson,
          correctAnswersJson: version.correctAnswersJson,
          hintsJson: (version.hintsJson as unknown as PedagogyHint[]) || [],
          choiceExplanationsJson: (version.choiceExplanationsJson as unknown as Record<string, ChoiceExplanation>) || {},
          stepsJson: (version.stepsJson as unknown as SocraticStep[]) || [],
          verbalDeconstructorJson: version.verbalDeconstructorJson as unknown as VerbalDeconstructor,
          videoExplanationUrl: version.videoExplanationUrl,
          writtenExplanationMd: version.writtenExplanationMd,
          createdAt: new Date(version.createdAt),
        })
        .onConflictDoUpdate({
          target: questionVersion.id,
          set: {
            promptMd: version.promptMd,
            passageMd: version.passageMd,
            optionsJson: version.optionsJson,
            correctAnswersJson: version.correctAnswersJson,
            writtenExplanationMd: version.writtenExplanationMd,
          },
        });
    }

    return q;
  }

  async findVersionById(versionId: string): Promise<QuestionVersionRecord | null> {
    const rows = await this.db.select().from(questionVersion).where(eq(questionVersion.id, versionId)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return this.mapVersion(row);
  }

  async listVersions(questionId: string): Promise<QuestionVersionRecord[]> {
    const rows = await this.db
      .select()
      .from(questionVersion)
      .where(eq(questionVersion.questionId, questionId))
      .orderBy(questionVersion.versionNumber);

    return rows.map((r) => this.mapVersion(r));
  }

  private mapQuestion(row: typeof question.$inferSelect): QuestionRecord {
    return {
      id: row.id,
      examType: row.examType,
      defaultTopicId: row.defaultTopicId ?? undefined,
      topicSlug: row.defaultTopicId ?? '',
      section: 'verbal',
      authorId: row.authorId ?? '',
      status: row.status as QuestionRecord['status'],
      liveVersionId: row.liveVersionId ?? '',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapVersion(row: typeof questionVersion.$inferSelect): QuestionVersionRecord {
    return {
      id: row.id,
      questionId: row.questionId,
      versionNumber: row.versionNumber,
      questionType: row.questionType,
      promptMd: row.promptMd,
      passageMd: row.passageMd ?? undefined,
      optionsJson: row.optionsJson,
      correctAnswersJson: row.correctAnswersJson,
      hintsJson: (row.hintsJson as unknown[]) ?? [],
      choiceExplanationsJson: (row.choiceExplanationsJson as Record<string, unknown>) ?? {},
      stepsJson: (row.stepsJson as unknown[]) ?? [],
      verbalDeconstructorJson: row.verbalDeconstructorJson ?? undefined,
      videoExplanationUrl: row.videoExplanationUrl ?? undefined,
      writtenExplanationMd: row.writtenExplanationMd,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
