/** @purpose Server action to load GRE practice questions and vocab seed data */
'use server';

import { GRE_MAGOOSH_SEED_QUESTIONS, GRE_VOCAB_SEED_WORDS } from '@lumen/db';
import type { SeedGreQuestion, SeedVocabWord } from '@lumen/db';

export interface PracticeFilterParams {
  topic?: string;
  difficulty?: 'easy' | 'medium' | 'hard' | 'all';
  limit?: number;
}

/**
 * Server action to fetch practice questions with optional topic & difficulty filtering.
 */
export async function fetchPracticeQuestions(
  filters: PracticeFilterParams = {}
): Promise<SeedGreQuestion[]> {
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
export async function fetchVocabCards(limit = 20): Promise<SeedVocabWord[]> {
  return GRE_VOCAB_SEED_WORDS.slice(0, limit);
}
