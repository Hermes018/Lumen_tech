/** @purpose Drizzle schema for Grader Queue and Human Evaluation domain */
import { pgTable, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const graderQueueTable = pgTable('grader_queue', {
  id: text('id').primaryKey(),
  submissionId: text('submission_id').notNull().unique(),
  examAttemptId: text('exam_attempt_id').notNull(),
  learnerId: text('learner_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  promptMd: text('prompt_md').notNull(),
  essayText: text('essay_text').notNull(),
  wordCount: integer('word_count').notNull(),
  submittedAt: timestamp('submitted_at', { withTimezone: true }).notNull().defaultNow(),
  status: text('status').notNull().default('queued'), // 'queued' | 'in_review' | 'graded'
  assignedGraderId: text('assigned_grader_id').references(() => user.id, { onDelete: 'set null' }),
  aiEvaluationJson: jsonb('ai_evaluation_json').notNull(),
  humanEvaluationJson: jsonb('human_evaluation_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
