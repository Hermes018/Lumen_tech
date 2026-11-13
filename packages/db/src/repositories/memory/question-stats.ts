import type { QuestionStatRepo, QuestionStatRecord } from '../types';
import type { MemoryDataState } from './state';

export class MemoryQuestionStatRepo implements QuestionStatRepo {
  constructor(private state: MemoryDataState) {}

  async findByQuestionId(questionId: string): Promise<QuestionStatRecord | null> {
    const stat = this.state.questionStats.get(questionId);
    return stat ? { ...stat } : null;
  }

  async save(stat: QuestionStatRecord): Promise<QuestionStatRecord> {
    const copy = { ...stat };
    this.state.questionStats.set(stat.questionId, copy);
    return { ...copy };
  }

  async update(questionId: string, updates: Partial<QuestionStatRecord>): Promise<QuestionStatRecord> {
    const existing = this.state.questionStats.get(questionId);
    const updated: QuestionStatRecord = {
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
    this.state.questionStats.set(questionId, updated);
    return { ...updated };
  }
}
