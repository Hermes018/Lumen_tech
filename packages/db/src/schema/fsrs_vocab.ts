import { pgTable, text, timestamp, boolean, integer, real, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { question, questionVersion } from './gre_curriculum';

export const vocabWord = pgTable('vocab_word', {
  id: text('id').primaryKey(),
  headword: text('headword').notNull().unique(),
  partOfSpeech: text('part_of_speech').notNull(), // 'noun' | 'verb' | 'adjective' | 'adverb'
  definition: text('definition').notNull(),
  bnMeaning: text('bn_meaning').notNull(), // Bangla gloss
  mnemonicMd: text('mnemonic_md'),
  etymologyRoot: text('etymology_root'),
  synonymsJson: jsonb('synonyms_json').$type<string[]>().default([]),
  antonymsJson: jsonb('antonyms_json').$type<string[]>().default([]),
  exampleSentenceGre: text('example_sentence_gre').notNull(),
  frequencyTier: text('frequency_tier').notNull().default('common'), // 'common' | 'basic' | 'advanced'
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const vocabDeck = pgTable('vocab_deck', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  wordCount: integer('word_count').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const deckWord = pgTable('deck_word', {
  id: text('id').primaryKey(),
  deckId: text('deck_id').notNull().references(() => vocabDeck.id, { onDelete: 'cascade' }),
  wordId: text('word_id').notNull().references(() => vocabWord.id, { onDelete: 'cascade' }),
  sortOrder: integer('sort_order').notNull().default(0),
});

export type FSRSState = 'new' | 'learning' | 'review' | 'relearning';

export const userVocabCard = pgTable('user_vocab_card', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  wordId: text('word_id').notNull().references(() => vocabWord.id, { onDelete: 'cascade' }),
  stability: real('stability').notNull().default(0),
  difficulty: real('difficulty').notNull().default(0),
  elapsedDays: integer('elapsed_days').notNull().default(0),
  scheduledDays: integer('scheduled_days').notNull().default(0),
  reps: integer('reps').notNull().default(0),
  lapses: integer('lapses').notNull().default(0),
  state: text('state').$type<FSRSState>().notNull().default('new'),
  dueAt: timestamp('due_at', { withTimezone: true }).notNull().defaultNow(),
  lastReviewAt: timestamp('last_review_at', { withTimezone: true }),
  sourceQuestionId: text('source_question_id').references(() => question.id, { onDelete: 'set null' }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ReviewMode = 'flip' | 'cloze' | 'se_pair_drill' | 'quant_formula';

export const vocabReviewLog = pgTable('vocab_review_log', {
  id: text('id').primaryKey(),
  cardId: text('card_id').notNull().references(() => userVocabCard.id, { onDelete: 'cascade' }),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  rating: integer('rating').notNull(), // 1: Again, 2: Hard, 3: Good, 4: Easy
  mode: text('mode').$type<ReviewMode>().notNull().default('flip'),
  reviewDurationMs: integer('review_duration_ms').notNull().default(0),
  reviewAt: timestamp('review_at', { withTimezone: true }).notNull().defaultNow(),
});

export type ErrorTag = 'concept_gap' | 'vocab_gap' | 'careless_math' | 'misread_prompt' | 'time_pressure';

export const errorLogQueue = pgTable('error_log_queue', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  questionVersionId: text('question_version_id').notNull().references(() => questionVersion.id, { onDelete: 'cascade' }),
  errorTag: text('error_tag').$type<ErrorTag>().notNull(),
  retryIntervalStage: integer('retry_interval_stage').notNull().default(1), // 1: 1d, 2: 3d, 3: 7d, 4: 21d
  nextRetryDueAt: timestamp('next_retry_due_at', { withTimezone: true }).notNull(),
  isResolved: boolean('is_resolved').notNull().default(false),
  notesMd: text('notes_md'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
