import type { MistakeRepo, MistakeEntry } from '../types';
import type { MemoryDataState } from './state';

export class MemoryMistakeRepo implements MistakeRepo {
  constructor(private state: MemoryDataState) {}

  async getEntries(userId: string): Promise<MistakeEntry[]> {
    const userMap = this.state.mistakes.get(userId);
    if (!userMap) return [];
    const list = Array.from(userMap.values()).map((e) => JSON.parse(JSON.stringify(e)));
    return list.sort((a, b) => new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime());
  }

  async findEntry(userId: string, questionId: string): Promise<MistakeEntry | null> {
    const userMap = this.state.mistakes.get(userId);
    if (!userMap) return null;
    const entry = userMap.get(questionId);
    return entry ? JSON.parse(JSON.stringify(entry)) : null;
  }

  async saveEntry(userId: string, entry: MistakeEntry): Promise<MistakeEntry> {
    let userMap = this.state.mistakes.get(userId);
    if (!userMap) {
      userMap = new Map();
      this.state.mistakes.set(userId, userMap);
    }
    const copy = JSON.parse(JSON.stringify(entry));
    userMap.set(entry.questionId, copy);
    return JSON.parse(JSON.stringify(copy));
  }
}
