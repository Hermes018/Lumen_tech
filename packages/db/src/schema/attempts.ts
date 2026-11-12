import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth';
import { examBlueprint, questionVersion, topicTaxonomy } from './gre_curriculum';

export const examAttempt = pgTable('exam_attempt', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  examType: text('exam_type').notNull(), // 'gre' | 'ielts_academic' | 'ielts_gt'
  blueprintId: text('blueprint_id').references(() => examBlueprint.id, { onDelete: 'set null' }),
  status: text('status').notNull().default('in_progress'), // 'in_progress' | 'submitted' | 'graded' | 'abandoned'
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  totalScore: integer('total_score'),
  sectionScoresJson: jsonb('section_scores_json'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const attemptSection = pgTable('attempt_section', {
  id: text('id').primaryKey(),
  attemptId: text('attempt_id').notNull().references(() => examAttempt.id, { onDelete: 'cascade' }),
  sectionIndex: integer('section_index').notNull(),
  sectionType: text('section_type').notNull(), // 'awa' | 'verbal_1' | 'quant_1' | 'verbal_2' | 'quant_2'
  adaptiveTier: text('adaptive_tier').notNull().default('baseline'), // 'baseline' | 'easy' | 'medium' | 'hard'
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  endsAt: timestamp('ends_at', { withTimezone: true }).notNull(), // server-authoritative deadline per D6
  status: text('status').notNull().default('in_progress'), // 'in_progress' | 'completed' | 'expired'
  rawScore: integer('raw_score'),
  scaledScore: integer('scaled_score'),
});

export const attemptItem = pgTable('attempt_item', {
  id: text('id').primaryKey(),
  attemptSectionId: text('attempt_section_id').notNull().references(() => attemptSection.id, { onDelete: 'cascade' }),
  questionVersionId: text('question_version_id').notNull().references(() => questionVersion.id, { onDelete: 'cascade' }),
  responseJson: jsonb('response_json'),
  isFlagged: boolean('is_flagged').notNull().default(false),
  strikethroughChoicesJson: jsonb('strikethrough_choices_json').$type<string[]>().default([]),
  timeSpentMs: integer('time_spent_ms').notNull().default(0),
  isCorrect: boolean('is_correct'),
  scoreAwarded: integer('score_awarded').notNull().default(0),
  autosavedAt: timestamp('autosaved_at', { withTimezone: true }).notNull().defaultNow(),
});

export const practiceSession = pgTable('practice_session', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  examType: text('exam_type').notNull(), // 'gre' | 'ielts'
  mode: text('mode').notNull().default('timed'), // 'timed' | 'untimed_tutor'
  topicId: text('topic_id').references(() => topicTaxonomy.id, { onDelete: 'set null' }),
  difficultyFilter: text('difficulty_filter').notNull().default('all'), // 'all' | 'easy' | 'medium' | 'hard' | 'very_hard'
  hintBudgetTotal: integer('hint_budget_total').notNull().default(10),
  hintBudgetRemaining: integer('hint_budget_remaining').notNull().default(10),
  startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
  completedAt: timestamp('completed_at', { withTimezone: true }),
  totalQuestions: integer('total_questions').notNull(),
  correctQuestions: integer('correct_questions').notNull().default(0),
});

export const practiceAttemptItem = pgTable('practice_attempt_item', {
  id: text('id').primaryKey(),
  practiceSessionId: text('practice_session_id').notNull().references(() => practiceSession.id, { onDelete: 'cascade' }),
  questionVersionId: text('question_version_id').notNull().references(() => questionVersion.id, { onDelete: 'cascade' }),
  responseJson: jsonb('response_json'),
  hintsUsedCount: integer('hints_used_count').notNull().default(0), // 0 to 3 progressive hints
  secondChanceUsed: boolean('second_chance_used').notNull().default(false),
  masteryWeightBps: integer('mastery_weight_bps').notNull().default(10000), // 10000 = 100%
  errorLogTag: text('error_log_tag').notNull().default('none'), // 'concept_gap' | 'vocab_gap' | 'careless_math' | 'misread_prompt' | 'time_pressure' | 'none'
  isCorrect: boolean('is_correct').notNull().default(false),
  timeSpentMs: integer('time_spent_ms').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
