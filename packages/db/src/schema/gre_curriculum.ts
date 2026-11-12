import { pgTable, text, timestamp, integer, real, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const examBlueprint = pgTable('exam_blueprint', {
  id: text('id').primaryKey(),
  examType: text('exam_type').notNull(), // 'gre' | 'ielts_academic' | 'ielts_gt'
  name: text('name').notNull(),
  version: integer('version').notNull().default(1),
  sectionsJson: jsonb('sections_json').notNull(), // sequence of sections, timings, question counts
  totalTimeMinutes: integer('total_time_minutes').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const topicTaxonomy = pgTable('topic_taxonomy', {
  id: text('id').primaryKey(),
  examType: text('exam_type').notNull(), // 'gre' | 'ielts'
  section: text('section').notNull(), // 'quant' | 'verbal' | 'analytical_writing'
  domain: text('domain').notNull(), // 'arithmetic' | 'algebra' | 'geometry' | 'data_analysis' | 'reading_comprehension' | 'text_completion' | 'sentence_equivalence'
  topic: text('topic').notNull(),
  subtopic: text('subtopic'),
  slug: text('slug').notNull().unique(),
  sortOrder: integer('sort_order').notNull().default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const question = pgTable('question', {
  id: text('id').primaryKey(),
  examType: text('exam_type').notNull(), // 'gre' | 'ielts_academic' | etc.
  defaultTopicId: text('default_topic_id').references(() => topicTaxonomy.id, { onDelete: 'set null' }),
  authorId: text('author_id').references(() => user.id, { onDelete: 'set null' }),
  status: text('status').notNull().default('draft'), // 'draft' | 'review' | 'published' | 'archived'
  liveVersionId: text('live_version_id'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export interface PedagogyHint {
  tier: 1 | 2 | 3;
  label: 'Concept Nudge' | 'Setup / Elimination' | 'Final Bridge';
  content_md: string;
}

export interface ChoiceExplanation {
  is_correct: boolean;
  explanation_md: string;
  trap_tag?: string; // e.g. 'forgot_zero_or_negative' | 'orphan_synonym_no_pair' | 'scope_shift'
  trap_label?: string; // e.g. 'Overlooked Negative Numbers' | 'No Equivalent Pair'
}

export interface SocraticStep {
  step_index: number;
  prompt_md: string;
  options: string[];
  correct_option_index: number;
  takeaway_md: string;
}

export interface VerbalDeconstructor {
  trigger_words?: Array<{
    word: string;
    category: 'contrast' | 'support' | 'cause_effect' | 'condition';
    note: string;
  }>;
  blank_charges?: Array<{
    blank_index: number;
    charge: '+' | '-' | 'neutral';
    rationale: string;
  }>;
  prediction_guide_md?: string;
}

export const questionVersion = pgTable('question_version', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull().references(() => question.id, { onDelete: 'cascade' }),
  versionNumber: integer('version_number').notNull().default(1),
  questionType: text('question_type').notNull(),
  // GRE types: 'gre_tc_1' | 'gre_tc_2' | 'gre_tc_3' | 'gre_se' | 'gre_rc_single' | 'gre_rc_multi' |
  // 'gre_rc_select_in_passage' | 'gre_qc' | 'gre_mc_single' | 'gre_mc_multi' | 'gre_numeric_single' |
  // 'gre_numeric_fraction' | 'gre_awa_issue'
  promptMd: text('prompt_md').notNull(),
  passageMd: text('passage_md'),
  optionsJson: jsonb('options_json'), // options array or structure
  correctAnswersJson: jsonb('correct_answers_json').notNull(), // array or record of correct answers

  // D13 Interactive Pedagogy columns
  hintsJson: jsonb('hints_json').$type<PedagogyHint[]>().default([]),
  choiceExplanationsJson: jsonb('choice_explanations_json').$type<Record<string, ChoiceExplanation>>().default({}),
  stepsJson: jsonb('steps_json').$type<SocraticStep[]>().default([]),
  verbalDeconstructorJson: jsonb('verbal_deconstructor_json').$type<VerbalDeconstructor>(),
  videoExplanationUrl: text('video_explanation_url'),
  writtenExplanationMd: text('written_explanation_md').notNull(),

  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const questionStat = pgTable('question_stat', {
  id: text('id').primaryKey(),
  questionId: text('question_id').notNull().unique().references(() => question.id, { onDelete: 'cascade' }),
  difficultyB: real('difficulty_b').notNull().default(0), // IRT difficulty param
  discriminationA: real('discrimination_a').notNull().default(1), // IRT discrimination param
  guessingC: real('guessing_c').notNull().default(0), // IRT pseudo-guessing param
  exposureCount: integer('exposure_count').notNull().default(0),
  correctCount: integer('correct_count').notNull().default(0),
  averageTimeMs: integer('average_time_ms').notNull().default(0),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
