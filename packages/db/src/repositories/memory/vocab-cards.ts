import type { VocabCardRepo, VocabCardRecord } from '../types';
import type { MemoryDataState } from './state';

export class MemoryVocabCardRepo implements VocabCardRepo {
  constructor(private state: MemoryDataState) {}

  async findByUserAndWord(userId: string, wordId: string): Promise<VocabCardRecord | null> {
    const key = `${userId}:${wordId}`;
    const card = this.state.vocabCards.get(key);
    return card ? { ...card } : null;
  }

  async listDueCards(userId: string, asOfDate: Date): Promise<VocabCardRecord[]> {
    const list: VocabCardRecord[] = [];
    const asOfIso = asOfDate.toISOString();
    for (const card of this.state.vocabCards.values()) {
      if (card.userId === userId && card.due <= asOfIso) {
        list.push({ ...card });
      }
    }
    return list.sort((a, b) => a.due.localeCompare(b.due));
  }

  async saveCard(card: VocabCardRecord): Promise<VocabCardRecord> {
    const key = `${card.userId}:${card.wordId}`;
    const copy = { ...card };
    this.state.vocabCards.set(key, copy);
    return { ...copy };
  }
}
