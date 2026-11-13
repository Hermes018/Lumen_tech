/** @purpose Drizzle schema for Mistake Notebook and Error Taxonomy */
import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const mistakeEntryTable = pgTable('mistake_entry', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  questionId: text('question_id').notNull(),
  sourceAttemptId: text('source_attempt_id'),
  sourceSessionId: text('source_session_id'),
  subject: text('subject').notNull(), // 'quant' | 'verbal'
  topicSlug: text('topic_slug').notNull(),
  questionPrompt: text('question_prompt').notNull(),
  optionsJson: jsonb('options_json'),
  selectedWrongAnswer: text('selected_wrong_answer').notNull(),
  correctAnswersJson: jsonb('correct_answers_json').notNull(),
  explanationMd: text('explanation_md'),
  errorCategory: text('error_category').notNull(), // careless_math, vocab_gap, etc.
  notes: text('notes'),
  status: text('status').notNull().default('open'), // 'open' | 'resolved'
  attemptsCount: integer('attempts_count').notNull().default(1),
  lastAttemptAt: timestamp('last_attempt_at', { withTimezone: true }).notNull().defaultNow(),
  resolvedAt: timestamp('resolved_at', { withTimezone: true }),
  isMistakeRetry: boolean('is_mistake_retry').notNull().default(true),
  excludeFromIrt: boolean('exclude_from_irt').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
