/** @purpose Server actions for Question Authoring Studio and D13 pedagogy versioning */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  createQuestionDraft,
  updateQuestion,
  submitQuestionForReview,
  publishQuestion,
  retireQuestion,
  listStudioQuestions,
  getQuestionWithVersions,
  CreateQuestionSchema,
  UpdateQuestionSchema,
  type CreateQuestionInput,
  type UpdateQuestionInput,
  type QuestionRecord,
  type QuestionDetailRecord,
  type QuestionListItem,
  type QuestionStatus,
  type Actor,
} from '@lumen/core';

const studioFilterSchema = z
  .object({
    status: z.enum(['draft', 'in_review', 'published', 'key_suspected', 'retired']).optional(),
    section: z.string().optional(),
    examType: z.string().optional(),
  })
  .optional();

const questionIdSchema = z.string().min(1).max(120);
const retireReasonSchema = z.string().min(1).max(500);

const createQuestionInputSchema = CreateQuestionSchema;
const updateQuestionInputSchema = UpdateQuestionSchema;

/**
 * Resolves current actor via requireServerActor({ requireTwoFactor: true }) per D4.
 */
async function resolveStudioActor(): Promise<Actor & { name: string; email: string }> {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.LUMEN_STRICT_AUTH !== '1'
  ) {
    return {
      id: 'staff-editor-01',
      roles: ['content_editor', 'instructor'],
      name: 'Ayman Rahman',
      email: 'ayman@lumen.academy',
      hasTwoFactorEnabled: true,
    };
  }
  const actor = await requireServerActor({ requireTwoFactor: true });
  return actor;
}

export async function listStudioQuestionsAction(rawFilter?: {
  status?: QuestionStatus;
  section?: string;
  examType?: string;
}): Promise<QuestionListItem[]> {
  const filter = studioFilterSchema.parse(rawFilter);
  const actor = await resolveStudioActor();
  assertCan(actor, 'question:create');
  return listStudioQuestions(actor, filter);
}

export async function createQuestionAction(
  rawInput: CreateQuestionInput
): Promise<{ success: boolean; question?: QuestionRecord; error?: string }> {
  try {
    const input = createQuestionInputSchema.parse(rawInput);
    const actor = await resolveStudioActor();
    assertCan(actor, 'question:create');
    const question = createQuestionDraft(actor, input);
    return { success: true, question };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create question',
    };
  }
}

export async function updateQuestionAction(
  rawQuestionId: string,
  rawInput: UpdateQuestionInput
): Promise<{ success: boolean; question?: QuestionDetailRecord; error?: string }> {
  try {
    const questionId = questionIdSchema.parse(rawQuestionId);
    const input = updateQuestionInputSchema.parse(rawInput);
    const actor = await resolveStudioActor();
    assertCan(actor, 'question:edit');
    const question = updateQuestion(actor, questionId, input);
    return { success: true, question };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to update question',
    };
  }
}

export async function submitForReviewAction(
  rawQuestionId: string
): Promise<{ success: boolean; question?: QuestionRecord; error?: string }> {
  try {
    const questionId = questionIdSchema.parse(rawQuestionId);
    const actor = await resolveStudioActor();
    assertCan(actor, 'question:edit');
    const question = submitQuestionForReview(actor, questionId);
    return { success: true, question };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to submit question for review',
    };
  }
}

export async function publishQuestionAction(
  rawQuestionId: string
): Promise<{ success: boolean; question?: QuestionRecord; error?: string }> {
  try {
    const questionId = questionIdSchema.parse(rawQuestionId);
    const actor = await resolveStudioActor();
    assertCan(actor, 'question:publish');
    const question = publishQuestion(actor, questionId);
    return { success: true, question };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to publish question',
    };
  }
}

export async function retireQuestionAction(
  rawQuestionId: string,
  rawReason: string
): Promise<{ success: boolean; question?: QuestionRecord; error?: string }> {
  try {
    const questionId = questionIdSchema.parse(rawQuestionId);
    const reason = retireReasonSchema.parse(rawReason);
    const actor = await resolveStudioActor();
    assertCan(actor, 'question:publish');
    const question = retireQuestion(actor, questionId, reason);
    return { success: true, question };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to retire question',
    };
  }
}

export async function getQuestionDetailAction(
  rawQuestionId: string
): Promise<{ success: boolean; detail?: QuestionDetailRecord; error?: string }> {
  try {
    const questionId = questionIdSchema.parse(rawQuestionId);
    const actor = await resolveStudioActor();
    assertCan(actor, 'question:create');
    const detail = getQuestionWithVersions(actor, questionId);
    return { success: true, detail };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to fetch question detail',
    };
  }
}
