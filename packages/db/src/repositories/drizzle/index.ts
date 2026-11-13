/**
 * @purpose Neon Serverless Drizzle repository bundle for production and online integration
 */

import type { DbClient } from '../../client';
import type { Repositories, UnitOfWork } from '../types';
import { DrizzleOrderRepo } from './orders';
import { DrizzlePaymentRepo } from './payments';
import { DrizzleEntitlementRepo } from './entitlements';
import { DrizzleLedgerRepo } from './ledger';
import { DrizzleGradingRepo } from './grading';
import { DrizzleCourseRepo } from './courses';
import { DrizzleQuestionRepo } from './questions';
import { DrizzleProgressRepo } from './progress';
import { DrizzleQuestionStatRepo } from './question-stats';
import { DrizzleMistakeRepo } from './mistakes';
import { DrizzlePriceRepo } from './prices';
import { DrizzleVocabCardRepo } from './vocab-cards';
import { DrizzleAttemptRepo } from './attempts';

interface TransactionalDbClient {
  transaction<R>(fn: (tx: DbClient) => Promise<R>): Promise<R>;
}

function hasTransaction(client: unknown): client is TransactionalDbClient {
  return (
    typeof client === 'object' &&
    client !== null &&
    'transaction' in client &&
    typeof (client as { transaction: unknown }).transaction === 'function'
  );
}

export function createDrizzleRepositories(dbClient: DbClient): Repositories {
  const orders = new DrizzleOrderRepo(dbClient);
  const payments = new DrizzlePaymentRepo(dbClient);
  const entitlements = new DrizzleEntitlementRepo(dbClient);
  const ledger = new DrizzleLedgerRepo(dbClient);
  const grading = new DrizzleGradingRepo(dbClient);
  const courses = new DrizzleCourseRepo(dbClient);
  const questions = new DrizzleQuestionRepo(dbClient);
  const progress = new DrizzleProgressRepo(dbClient);
  const questionStats = new DrizzleQuestionStatRepo(dbClient);
  const mistakes = new DrizzleMistakeRepo(dbClient);
  const prices = new DrizzlePriceRepo(dbClient);
  const vocabCards = new DrizzleVocabCardRepo(dbClient);
  const attempts = new DrizzleAttemptRepo(dbClient);

  const unitOfWork: UnitOfWork = {
    async transaction<T>(fn: (repos: Repositories) => Promise<T>): Promise<T> {
      if (hasTransaction(dbClient)) {
        return dbClient.transaction(async (tx: DbClient) => {
          const txRepos = createDrizzleRepositories(tx);
          return fn(txRepos);
        });
      }
      // Fallback if driver doesn't support nested transactions
      return fn(createDrizzleRepositories(dbClient));
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
    attempts,
    unitOfWork,
  };
}
