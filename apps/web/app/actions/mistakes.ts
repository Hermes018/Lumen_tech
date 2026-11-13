/** @purpose Server actions for the Mistake Notebook and Error Taxonomy retry loop */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
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

const errorTaxonomySchema = z.enum([
  'careless_math',
  'vocab_gap',
  'concept_gap',
  'trap_answer',
  'misread_prompt',
  'time_pressure',
]);

const mistakeFilterSchema = z.object({
  status: z.enum(['all', 'open', 'resolved']).optional(),
  errorCategory: z.union([z.literal('all'), errorTaxonomySchema]).optional(),
  subject: z.enum(['all', 'quant', 'verbal']).optional(),
  topicSlug: z.string().optional(),
  userId: z.string().optional(),
});

const retryMistakeSchema = z.object({
  questionId: z.string().min(1),
  userAnswer: z.string().min(1),
  hintsUsed: z.number().int().min(0).optional(),
  userId: z.string().optional(),
});

const updateMistakeTaxonomySchema = z.object({
  questionId: z.string().min(1),
  errorCategory: errorTaxonomySchema,
  notes: z.string().max(2000).optional(),
  userId: z.string().optional(),
});

// Per-user in-memory store for mistake notebooks
const userNotebooks = new Map<string, MistakeNotebook>();

function getOrSeedNotebookForUser(userId: string): MistakeNotebook {
  const existing = userNotebooks.get(userId);
  if (existing) {
    return existing;
  }

  let nb = createMistakeNotebook(userId);

  // Seed with 3 authentic mistakes from Magoosh questions for initial exploration
  const q0 = GRE_MAGOOSH_SEED_QUESTIONS[0];
  const q1 = GRE_MAGOOSH_SEED_QUESTIONS[1];
  const q2 = GRE_MAGOOSH_SEED_QUESTIONS[2];

  if (q0) {
    nb = recordMistake(nb, {
      userId,
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
      userId,
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
      userId,
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

  userNotebooks.set(userId, nb);
  return nb;
}

/**
 * Loads the user's mistake entries with optional taxonomy and status filters.
 * Rejects cross-user IDOR attempts via assertCan.
 */
export async function fetchMistakesAction(
  rawFilters: MistakeFilterParams & { userId?: string } = {}
): Promise<MistakeEntry[]> {
  const filters = mistakeFilterSchema.parse(rawFilters);
  const actor = await requireServerActor();
  const targetUserId = filters.userId ?? actor.id;

  assertCan(actor, 'exam:view_own', { ownerId: targetUserId });
  assertCan(actor, 'practice:review', { ownerId: targetUserId });

  const notebook = getOrSeedNotebookForUser(targetUserId);
  return filterMistakes(notebook, filters);
}

/**
 * Retries a mistake.
 * If solved without hints, item transitions to 'resolved'.
 * Invariant: retry carries isMistakeRetry: true and is strictly excluded from IRT pools.
 */
export async function retryMistakeAction(rawInput: {
  questionId: string;
  userAnswer: string;
  hintsUsed?: number;
  userId?: string;
}): Promise<{
  isCorrect: boolean;
  resolved: boolean;
  message: string;
  entry: MistakeEntry | null;
}> {
  const input = retryMistakeSchema.parse(rawInput);
  const actor = await requireServerActor();
  const targetUserId = input.userId ?? actor.id;

  assertCan(actor, 'exam:view_own', { ownerId: targetUserId });
  assertCan(actor, 'practice:review', { ownerId: targetUserId });

  const currentNotebook = getOrSeedNotebookForUser(targetUserId);

  const result = retryMistake({
    notebook: currentNotebook,
    questionId: input.questionId,
    userAnswer: input.userAnswer,
    hintsUsed: input.hintsUsed ?? 0,
  });

  userNotebooks.set(targetUserId, result.notebook);
  const updatedEntry = result.notebook.entries[input.questionId] ?? null;

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
export async function updateMistakeTaxonomyAction(rawInput: {
  questionId: string;
  errorCategory: ErrorTaxonomy;
  notes?: string;
  userId?: string;
}): Promise<MistakeEntry | null> {
  const input = updateMistakeTaxonomySchema.parse(rawInput);
  const actor = await requireServerActor();
  const targetUserId = input.userId ?? actor.id;

  assertCan(actor, 'exam:view_own', { ownerId: targetUserId });
  assertCan(actor, 'practice:review', { ownerId: targetUserId });

  const currentNotebook = getOrSeedNotebookForUser(targetUserId);
  const entry = currentNotebook.entries[input.questionId];
  if (!entry) return null;

  const updated: MistakeEntry = {
    ...entry,
    errorCategory: input.errorCategory,
    notes: input.notes !== undefined ? input.notes : entry.notes,
    updatedAt: new Date().toISOString(),
  };

  const nextNotebook: MistakeNotebook = {
    ...currentNotebook,
    entries: {
      ...currentNotebook.entries,
      [input.questionId]: updated,
    },
  };

  userNotebooks.set(targetUserId, nextNotebook);
  return updated;
}
