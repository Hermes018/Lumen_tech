/** @purpose Server action to load GRE practice questions and vocab seed data */
'use server';

import { z } from '@lumen/config';
import { requireServerActor, assertCan } from '@lumen/core';
import { GRE_MAGOOSH_SEED_QUESTIONS, GRE_VOCAB_SEED_WORDS } from '@lumen/db';
import type { SeedGreQuestion, SeedVocabWord } from '@lumen/db';

const practiceFilterSchema = z.object({
  topic: z.string().optional(),
  difficulty: z.enum(['easy', 'medium', 'hard', 'all']).optional(),
  limit: z.number().int().min(1).max(100).optional(),
  userId: z.string().optional(),
});

const vocabLimitSchema = z.number().int().min(1).max(200).default(20);

export interface PracticeFilterParams {
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  limit?: number;
  userId?: string;
}

/**
 * Server action to fetch practice questions with optional topic & difficulty filtering.
 * Enforces server-resolved actor and assertCan('practice:session').
 */
export async function fetchPracticeQuestions(
  rawFilters: PracticeFilterParams = {}
): Promise<SeedGreQuestion[]> {
  const filters = practiceFilterSchema.parse(rawFilters);
  const actor = await requireServerActor();

  if (filters.userId && filters.userId !== actor.id) {
    assertCan(actor, 'user:view_own', { ownerId: filters.userId });
  }
  assertCan(actor, 'practice:session', { ownerId: actor.id });

  let questions = [...GRE_MAGOOSH_SEED_QUESTIONS];

  if (filters.topic && filters.topic !== 'all') {
    questions = questions.filter((q) => q.topicSlug === filters.topic);
  }

  if (filters.difficulty && filters.difficulty !== 'all') {
    if (filters.difficulty === 'easy') {
      questions = questions.filter((q) => q.difficultyB < -0.5);
    } else if (filters.difficulty === 'medium') {
      questions = questions.filter((q) => q.difficultyB >= -0.5 && q.difficultyB <= 0.5);
    } else if (filters.difficulty === 'hard') {
      questions = questions.filter((q) => q.difficultyB > 0.5);
    }
  }

  const limit = filters.limit ?? 10;
  return questions.slice(0, limit);
}

/**
 * Server action to fetch vocabulary words for the FSRS flashcard player.
 */
export async function fetchVocabCards(rawLimit = 20): Promise<SeedVocabWord[]> {
  const limit = vocabLimitSchema.parse(rawLimit);
  const actor = await requireServerActor();
  assertCan(actor, 'vocab:study', { ownerId: actor.id });

  return GRE_VOCAB_SEED_WORDS.slice(0, limit);
}
