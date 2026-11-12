/**
 * @purpose Studio Question Authoring domain service with RBAC enforcement, D6 immutable versioning, and D13 pedagogy validation.
 * Implements 00-DECISIONS.md D4, D6, D13, 06-API-AND-SERVICES.md §1, and 07-TEST-ENGINE.md §8.
 */

import { z } from '@lumen/config';
import { assertCan, type Actor } from '../auth/policy';

export const TRAP_ARCHETYPES = [
  'forgot_zero_or_negative',
  'orphan_synonym_no_pair',
  'scope_shift',
  'extreme_language',
  'opposite_direction',
  'reciprocal_confusion',
  'formula_misapplication',
  'partial_answer',
] as const;

export type TrapArchetype = (typeof TRAP_ARCHETYPES)[number];

export const PedagogyHintSchema = z.object({
  tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
  label: z.enum(['Concept Nudge', 'Setup / Elimination', 'Final Bridge']),
  content_md: z.string().min(5),
});

export type PedagogyHintDTO = z.infer<typeof PedagogyHintSchema>;

export const ChoiceExplanationSchema = z.object({
  is_correct: z.boolean(),
  explanation_md: z.string().min(5),
  trap_tag: z.enum(TRAP_ARCHETYPES).optional(),
  trap_label: z.string().optional(),
});

export type ChoiceExplanationDTO = z.infer<typeof ChoiceExplanationSchema>;

export const SocraticStepSchema = z.object({
  step_index: z.number().int().min(1),
  prompt_md: z.string().min(5),
  options: z.array(z.string()).min(2),
  correct_option_index: z.number().int().min(0),
  takeaway_md: z.string().min(3),
});

export type SocraticStepDTO = z.infer<typeof SocraticStepSchema>;

export const VerbalDeconstructorSchema = z.object({
  trigger_words: z
    .array(
      z.object({
        word: z.string(),
        category: z.enum(['contrast', 'support', 'cause_effect', 'condition']),
        note: z.string(),
      })
    )
    .optional(),
  blank_charges: z
    .array(
      z.object({
        blank_index: z.number().int(),
        charge: z.enum(['+', '-', 'neutral']),
        rationale: z.string(),
      })
    )
    .optional(),
  prediction_guide_md: z.string().optional(),
});

export type VerbalDeconstructorDTO = z.infer<typeof VerbalDeconstructorSchema>;

export const CreateQuestionSchema = z.object({
  examType: z.enum(['gre', 'ielts_academic', 'ielts_gt']),
  section: z.enum(['quant', 'verbal', 'analytical_writing']),
  questionType: z.string(),
  topicSlug: z.string(),
  promptMd: z.string().min(5),
  passageMd: z.string().optional(),
  options: z.array(z.object({ id: z.string(), label: z.string() })).min(2),
  correctAnswers: z.array(z.string()).min(1),
  writtenExplanationMd: z.string().min(10),
  hints: z.array(PedagogyHintSchema).max(3).optional(),
  choiceExplanations: z.record(z.string(), ChoiceExplanationSchema).optional(),
  steps: z.array(SocraticStepSchema).min(2).max(4).optional(),
  verbalDeconstructor: VerbalDeconstructorSchema.optional(),
});

export type CreateQuestionInput = z.infer<typeof CreateQuestionSchema>;

export const UpdateQuestionSchema = z.object({
  promptMd: z.string().min(5).optional(),
  passageMd: z.string().optional(),
  options: z.array(z.object({ id: z.string(), label: z.string() })).min(2).optional(),
  correctAnswers: z.array(z.string()).min(1).optional(),
  writtenExplanationMd: z.string().min(10).optional(),
  hints: z.array(PedagogyHintSchema).max(3).optional(),
  choiceExplanations: z.record(z.string(), ChoiceExplanationSchema).optional(),
  steps: z.array(SocraticStepSchema).min(2).max(4).optional(),
  verbalDeconstructor: VerbalDeconstructorSchema.optional(),
});

export type UpdateQuestionInput = z.infer<typeof UpdateQuestionSchema>;

export type QuestionStatus = 'draft' | 'in_review' | 'published' | 'retired' | 'key_suspected';

export interface QuestionVersionRecord {
  id: string;
  questionId: string;
  versionNumber: number;
  questionType: string;
  promptMd: string;
  passageMd?: string;
  options: Array<{ id: string; label: string }>;
  correctAnswers: string[];
  writtenExplanationMd: string;
  hints: PedagogyHintDTO[];
  choiceExplanations: Record<string, ChoiceExplanationDTO>;
  steps: SocraticStepDTO[];
  verbalDeconstructor?: VerbalDeconstructorDTO;
  createdAt: string;
}

export interface QuestionRecord {
  id: string;
  examType: string;
  section: string;
  topicSlug: string;
  authorId: string;
  status: QuestionStatus;
  liveVersionId: string;
  liveVersion: QuestionVersionRecord;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  retiredAt?: string;
  retireReason?: string;
}

export interface QuestionDetailRecord extends QuestionRecord {
  versions: QuestionVersionRecord[];
}

export interface QuestionListItem {
  id: string;
  examType: string;
  section: string;
  topicSlug: string;
  questionType: string;
  promptSnippet: string;
  status: QuestionStatus;
  versionNumber: number;
  authorId: string;
  updatedAt: string;
  stats?: {
    pValue: number;
    pointBiserial: number;
    attempts: number;
    flags: string[];
  };
}

// In-memory backing store for Studio questions & versions
let questionsStore = new Map<string, QuestionRecord>();
let versionsStore = new Map<string, QuestionVersionRecord[]>();

/**
 * Resets/initializes the in-memory store for test isolation.
 */
export function initStudioStore(): void {
  questionsStore = new Map<string, QuestionRecord>();
  versionsStore = new Map<string, QuestionVersionRecord[]>();
}

/**
 * Creates a new Question Draft.
 * Enforces `assertCan(actor, 'question:create')` and 2FA per D4.
 */
export function createQuestionDraft(
  actor: Actor,
  rawInput: CreateQuestionInput
): QuestionRecord {
  // Validate input schema with strict zod checks
  const input = CreateQuestionSchema.parse(rawInput);

  // Enforce RBAC
  assertCan(actor, 'question:create');

  const questionId = `q-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const versionId = `qv-${questionId}-v1`;
  const now = new Date().toISOString();

  const versionRecord: QuestionVersionRecord = {
    id: versionId,
    questionId,
    versionNumber: 1,
    questionType: input.questionType,
    promptMd: input.promptMd,
    passageMd: input.passageMd,
    options: input.options,
    correctAnswers: input.correctAnswers,
    writtenExplanationMd: input.writtenExplanationMd,
    hints: input.hints || [],
    choiceExplanations: input.choiceExplanations || {},
    steps: input.steps || [],
    verbalDeconstructor: input.verbalDeconstructor,
    createdAt: now,
  };

  const questionRecord: QuestionRecord = {
    id: questionId,
    examType: input.examType,
    section: input.section,
    topicSlug: input.topicSlug,
    authorId: actor.id,
    status: 'draft',
    liveVersionId: versionId,
    liveVersion: versionRecord,
    createdAt: now,
    updatedAt: now,
  };

  questionsStore.set(questionId, questionRecord);
  versionsStore.set(questionId, [versionRecord]);

  return questionRecord;
}

/**
 * Updates a question.
 * D6 Invariant:
 * - If status is 'draft', updates the current version in place.
 * - If status is 'published', automatically mints a new immutable `question_version`
 *   with an incremented `version_number` so past attempts remain pinned to their original version.
 */
export function updateQuestion(
  actor: Actor,
  questionId: string,
  rawInput: UpdateQuestionInput
): QuestionDetailRecord {
  const existing = questionsStore.get(questionId);
  if (!existing) {
    throw new Error(`Question '${questionId}' not found`);
  }

  // Enforce RBAC & ownership isolation
  assertCan(actor, 'question:edit', { ownerId: existing.authorId });

  const input = UpdateQuestionSchema.parse(rawInput);
  const now = new Date().toISOString();
  const versions = versionsStore.get(questionId) || [];
  const currentVersion = existing.liveVersion;

  if (existing.status === 'draft') {
    // In-place update for unreviewed drafts
    const updatedVersion: QuestionVersionRecord = {
      ...currentVersion,
      promptMd: input.promptMd ?? currentVersion.promptMd,
      passageMd: input.passageMd ?? currentVersion.passageMd,
      options: input.options ?? currentVersion.options,
      correctAnswers: input.correctAnswers ?? currentVersion.correctAnswers,
      writtenExplanationMd: input.writtenExplanationMd ?? currentVersion.writtenExplanationMd,
      hints: input.hints ?? currentVersion.hints,
      choiceExplanations: input.choiceExplanations ?? currentVersion.choiceExplanations,
      steps: input.steps ?? currentVersion.steps,
      verbalDeconstructor: input.verbalDeconstructor ?? currentVersion.verbalDeconstructor,
    };

    const updatedQuestion: QuestionRecord = {
      ...existing,
      liveVersion: updatedVersion,
      updatedAt: now,
    };

    questionsStore.set(questionId, updatedQuestion);
    versionsStore.set(questionId, [updatedVersion]);

    return {
      ...updatedQuestion,
      versions: [updatedVersion],
    };
  }

  // D6 Rule: When an already published question is edited, mint a new immutable question_version
  const nextVersionNumber = currentVersion.versionNumber + 1;
  const newVersionId = `qv-${questionId}-v${nextVersionNumber}`;

  const newVersion: QuestionVersionRecord = {
    id: newVersionId,
    questionId,
    versionNumber: nextVersionNumber,
    questionType: currentVersion.questionType,
    promptMd: input.promptMd ?? currentVersion.promptMd,
    passageMd: input.passageMd ?? currentVersion.passageMd,
    options: input.options ?? currentVersion.options,
    correctAnswers: input.correctAnswers ?? currentVersion.correctAnswers,
    writtenExplanationMd: input.writtenExplanationMd ?? currentVersion.writtenExplanationMd,
    hints: input.hints ?? currentVersion.hints,
    choiceExplanations: input.choiceExplanations ?? currentVersion.choiceExplanations,
    steps: input.steps ?? currentVersion.steps,
    verbalDeconstructor: input.verbalDeconstructor ?? currentVersion.verbalDeconstructor,
    createdAt: now,
  };

  const updatedVersions = [...versions, newVersion];
  versionsStore.set(questionId, updatedVersions);

  const updatedQuestion: QuestionRecord = {
    ...existing,
    liveVersionId: newVersionId,
    liveVersion: newVersion,
    updatedAt: now,
  };

  questionsStore.set(questionId, updatedQuestion);

  return {
    ...updatedQuestion,
    versions: updatedVersions,
  };
}

/**
 * Submits a draft question for editorial review.
 */
export function submitQuestionForReview(
  actor: Actor,
  questionId: string
): QuestionRecord {
  const existing = questionsStore.get(questionId);
  if (!existing) {
    throw new Error(`Question '${questionId}' not found`);
  }

  assertCan(actor, 'question:edit', { ownerId: existing.authorId });

  const updated: QuestionRecord = {
    ...existing,
    status: 'in_review',
    updatedAt: new Date().toISOString(),
  };

  questionsStore.set(questionId, updated);
  return updated;
}

/**
 * Publishes a question.
 * Only `content_editor` or `admin` can publish per D4.
 */
export function publishQuestion(
  actor: Actor,
  questionId: string
): QuestionRecord {
  const existing = questionsStore.get(questionId);
  if (!existing) {
    throw new Error(`Question '${questionId}' not found`);
  }

  assertCan(actor, 'question:publish');

  const now = new Date().toISOString();
  const updated: QuestionRecord = {
    ...existing,
    status: 'published',
    publishedAt: now,
    updatedAt: now,
  };

  questionsStore.set(questionId, updated);
  return updated;
}

/**
 * Retires a question per 07 §8.6.
 */
export function retireQuestion(
  actor: Actor,
  questionId: string,
  reason: string
): QuestionRecord {
  const existing = questionsStore.get(questionId);
  if (!existing) {
    throw new Error(`Question '${questionId}' not found`);
  }

  assertCan(actor, 'question:publish');

  const now = new Date().toISOString();
  const updated: QuestionRecord = {
    ...existing,
    status: 'retired',
    retiredAt: now,
    retireReason: reason,
    updatedAt: now,
  };

  questionsStore.set(questionId, updated);
  return updated;
}

/**
 * Retrieves a question and all its pinned historical versions.
 */
export function getQuestionWithVersions(
  actor: Actor,
  questionId: string
): QuestionDetailRecord {
  const existing = questionsStore.get(questionId);
  if (!existing) {
    throw new Error(`Question '${questionId}' not found`);
  }

  assertCan(actor, 'question:edit', { ownerId: existing.authorId });
  const versions = versionsStore.get(questionId) || [existing.liveVersion];

  return {
    ...existing,
    versions,
  };
}

/**
 * Lists question bank items with optional status and section filtering.
 */
export function listStudioQuestions(
  actor: Actor,
  filter?: { status?: QuestionStatus; section?: string; examType?: string }
): QuestionListItem[] {
  assertCan(actor, 'course:view');

  const items: QuestionListItem[] = [];
  for (const q of questionsStore.values()) {
    if (filter?.status && q.status !== filter.status) continue;
    if (filter?.section && q.section !== filter.section) continue;
    if (filter?.examType && q.examType !== filter.examType) continue;

    items.push({
      id: q.id,
      examType: q.examType,
      section: q.section,
      topicSlug: q.topicSlug,
      questionType: q.liveVersion.questionType,
      promptSnippet: q.liveVersion.promptMd.slice(0, 80) + '...',
      status: q.status,
      versionNumber: q.liveVersion.versionNumber,
      authorId: q.authorId,
      updatedAt: q.updatedAt,
    });
  }

  return items;
}
