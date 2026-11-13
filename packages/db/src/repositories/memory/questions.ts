import type {
  QuestionRepo,
  QuestionRecord,
  QuestionVersionRecord,
  QuestionDetailRecord,
  QuestionListItem,
} from '../types';
import type { MemoryDataState } from './state';

export class MemoryQuestionRepo implements QuestionRepo {
  constructor(private state: MemoryDataState) {}

  async findQuestionById(id: string): Promise<QuestionRecord | null> {
    const q = this.state.questions.get(id);
    return q ? { ...q } : null;
  }

  async findQuestionDetail(id: string): Promise<QuestionDetailRecord | null> {
    const q = this.state.questions.get(id);
    if (!q) return null;

    const versions = this.state.questionVersions.get(id) || [];
    const liveVersion = this.state.allVersions.get(q.liveVersionId);
    if (!liveVersion) {
      throw new Error(`Live version ${q.liveVersionId} not found for question ${id}`);
    }

    return {
      ...q,
      liveVersion: JSON.parse(JSON.stringify(liveVersion)),
      versions: JSON.parse(JSON.stringify(versions)),
    };
  }

  async listQuestions(filters?: { examType?: string; status?: string; topicSlug?: string }): Promise<QuestionListItem[]> {
    const list: QuestionListItem[] = [];

    for (const q of this.state.questions.values()) {
      if (filters?.examType && q.examType !== filters.examType) continue;
      if (filters?.status && q.status !== filters.status) continue;
      if (filters?.topicSlug && q.topicSlug !== filters.topicSlug) continue;

      const liveVersion = this.state.allVersions.get(q.liveVersionId);
      const promptSnippet = liveVersion?.promptMd ? liveVersion.promptMd.slice(0, 80) : '';

      list.push({
        id: q.id,
        examType: q.examType,
        section: q.section,
        topicSlug: q.topicSlug,
        questionType: liveVersion?.questionType || 'unknown',
        promptSnippet,
        status: q.status,
        versionNumber: liveVersion?.versionNumber || 1,
        authorId: q.authorId,
        updatedAt: q.updatedAt,
      });
    }

    return list.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  }

  async saveQuestion(question: QuestionRecord, version?: QuestionVersionRecord): Promise<QuestionRecord> {
    const qCopy = { ...question };
    this.state.questions.set(question.id, qCopy);

    if (version) {
      const vCopy = JSON.parse(JSON.stringify(version));
      this.state.allVersions.set(version.id, vCopy);

      const existingVersions = this.state.questionVersions.get(question.id) || [];
      const filtered = existingVersions.filter((v) => v.id !== version.id);
      filtered.push(vCopy);
      filtered.sort((a, b) => a.versionNumber - b.versionNumber);
      this.state.questionVersions.set(question.id, filtered);
    }

    return { ...qCopy };
  }

  async findVersionById(versionId: string): Promise<QuestionVersionRecord | null> {
    const v = this.state.allVersions.get(versionId);
    return v ? JSON.parse(JSON.stringify(v)) : null;
  }

  async listVersions(questionId: string): Promise<QuestionVersionRecord[]> {
    const versions = this.state.questionVersions.get(questionId) || [];
    return JSON.parse(JSON.stringify(versions));
  }
}
