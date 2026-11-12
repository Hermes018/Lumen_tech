/** @purpose Server actions for the Mistake Notebook and Error Taxonomy retry loop */
'use server';

import {
  createMistakeNotebook,
  recordMistake,
  retryMistake,
  filterMistakes,
  type MistakeNotebook,
  type MistakeEntry,
  type MistakeFilterParams,
  type ErrorTaxonomy,
} from '@lumen/core';
import { GRE_MAGOOSH_SEED_QUESTIONS } from '@lumen/db';

// In-memory prototype store for mistake notebooks
let globalNotebook: MistakeNotebook = (() => {
  let nb = createMistakeNotebook('demo-learner-01');

  // Seed with 3 authentic mistakes from Magoosh questions for initial exploration
  const q0 = GRE_MAGOOSH_SEED_QUESTIONS[0];
  const q1 = GRE_MAGOOSH_SEED_QUESTIONS[1];
  const q2 = GRE_MAGOOSH_SEED_QUESTIONS[2];

  if (q0) {
    nb = recordMistake(nb, {
      userId: 'demo-learner-01',
      questionId: q0.id,
      subject: 'quant',
      topicSlug: q0.topicSlug,
      questionPrompt: q0.promptMd,
      options: q0.options,
      selectedWrongAnswer: 'choice-a',
      correctAnswers: q0.correctAnswers,
      explanationMd: q0.writtenExplanationMd,
      errorCategory: 'careless_math',
      notes: 'Forgot to check negative integer cases for Quantity A.',
    });
  }

  if (q1) {
    nb = recordMistake(nb, {
      userId: 'demo-learner-01',
      questionId: q1.id,
      subject: 'verbal',
      topicSlug: q1.topicSlug,
      questionPrompt: q1.promptMd,
      options: q1.options,
      selectedWrongAnswer: 'choice-c',
      correctAnswers: q1.correctAnswers,
      explanationMd: q1.writtenExplanationMd,
      errorCategory: 'vocab_gap',
      notes: 'Unfamiliar with secondary definition of the headword.',
    });
  }

  if (q2) {
    nb = recordMistake(nb, {
      userId: 'demo-learner-01',
      questionId: q2.id,
      subject: 'quant',
      topicSlug: q2.topicSlug,
      questionPrompt: q2.promptMd,
      options: q2.options,
      selectedWrongAnswer: 'choice-b',
      correctAnswers: q2.correctAnswers,
      explanationMd: q2.writtenExplanationMd,
      errorCategory: 'trap_answer',
      notes: 'Fell for distractor trap: assumed x and y were integers.',
    });
    // Mark q2 as resolved to demonstrate both states
    nb = retryMistake({
      notebook: nb,
      questionId: q2.id,
      userAnswer: q2.correctAnswers[0] ?? 'choice-d',
      hintsUsed: 0,
    }).notebook;
  }

  return nb;
})();

/**
 * Loads the user's mistake entries with optional taxonomy and status filters.
 */
export async function fetchMistakesAction(
  filters: MistakeFilterParams = {}
): Promise<MistakeEntry[]> {
  return filterMistakes(globalNotebook, filters);
}

/**
 * Retries a mistake.
 * If solved without hints, item transitions to 'resolved'.
 * Invariant: retry is strictly excluded from IRT pools.
 */
export async function retryMistakeAction(input: {
  questionId: string;
  userAnswer: string;
  hintsUsed?: number;
}): Promise<{
  isCorrect: boolean;
  resolved: boolean;
  message: string;
  entry: MistakeEntry | null;
}> {
  const result = retryMistake({
    notebook: globalNotebook,
    questionId: input.questionId,
    userAnswer: input.userAnswer,
    hintsUsed: input.hintsUsed ?? 0,
  });

  globalNotebook = result.notebook;
  const updatedEntry = globalNotebook.entries[input.questionId] ?? null;

  return {
    isCorrect: result.isCorrect,
    resolved: result.resolved,
    message: result.message,
    entry: updatedEntry,
  };
}

/**
 * Updates the D13 error taxonomy categorization and personal notes on a mistake.
 */
export async function updateMistakeTaxonomyAction(input: {
  questionId: string;
  errorCategory: ErrorTaxonomy;
  notes?: string;
}): Promise<MistakeEntry | null> {
  const entry = globalNotebook.entries[input.questionId];
  if (!entry) return null;

  const updated: MistakeEntry = {
    ...entry,
    errorCategory: input.errorCategory,
    notes: input.notes !== undefined ? input.notes : entry.notes,
    updatedAt: new Date().toISOString(),
  };

  globalNotebook = {
    ...globalNotebook,
    entries: {
      ...globalNotebook.entries,
      [input.questionId]: updated,
    },
  };

  return updated;
}
