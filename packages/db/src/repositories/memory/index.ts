/**
 * @purpose In-memory repository bundle with transactional snapshot & rollback support
 */

import type { Repositories, UnitOfWork } from '../types';
import { createInitialState, cloneState, copyState, type MemoryDataState } from './state';
import { MemoryOrderRepo } from './orders';
import { MemoryPaymentRepo } from './payments';
import { MemoryEntitlementRepo } from './entitlements';
import { MemoryLedgerRepo } from './ledger';
import { MemoryGradingRepo } from './grading';
import { MemoryCourseRepo } from './courses';
import { MemoryQuestionRepo } from './questions';
import { MemoryProgressRepo } from './progress';
import { MemoryQuestionStatRepo } from './question-stats';
import { MemoryMistakeRepo } from './mistakes';
import { MemoryPriceRepo } from './prices';
import { MemoryVocabCardRepo } from './vocab-cards';

export { createInitialState, type MemoryDataState } from './state';

export function createMemoryRepositories(state: MemoryDataState = createInitialState()): Repositories {
  const orders = new MemoryOrderRepo(state);
  const payments = new MemoryPaymentRepo(state);
  const entitlements = new MemoryEntitlementRepo(state);
  const ledger = new MemoryLedgerRepo(state);
  const grading = new MemoryGradingRepo(state);
  const courses = new MemoryCourseRepo(state);
  const questions = new MemoryQuestionRepo(state);
  const progress = new MemoryProgressRepo(state);
  const questionStats = new MemoryQuestionStatRepo(state);
  const mistakes = new MemoryMistakeRepo(state);
  const prices = new MemoryPriceRepo(state);
  const vocabCards = new MemoryVocabCardRepo(state);

  const unitOfWork: UnitOfWork = {
    async transaction<T>(fn: (repos: Repositories) => Promise<T>): Promise<T> {
      // Snapshot state before beginning transaction
      const snapshot = cloneState(state);
      try {
        const result = await fn(createMemoryRepositories(state));
        return result;
      } catch (error) {
        // Rollback state to snapshot upon any failure
        copyState(snapshot, state);
        throw error;
      }
    },
  };

  return {
    orders,
    payments,
    entitlements,
    ledger,
    grading,
    courses,
    questions,
    progress,
    questionStats,
    mistakes,
    prices,
    vocabCards,
    unitOfWork,
  };
}
