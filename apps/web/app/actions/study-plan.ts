/** @purpose Server actions for GRE Study Plan and Adaptive Rescheduling */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  generateStudyPlan,
  rescheduleStudyPlan,
  type StudyPlan,
  type PlanTier,
  type RescheduleResult,
} from '@lumen/core';

const getStudyPlanSchema = z
  .object({
    userId: z.string().optional(),
  })
  .optional();

const asOfDateSchema = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional();
const taskIdSchema = z.string().min(1).max(120);

// In-memory study plan store for demonstration and prototype session
const userStudyPlans = new Map<string, StudyPlan>();

export async function getStudyPlanAction(rawOpts?: { userId?: string }): Promise<StudyPlan> {
  const opts = getStudyPlanSchema.parse(rawOpts);
  const actor = await requireServerActor();
  const targetUserId = opts?.userId ?? actor.id;

  assertCan(actor, 'user:view_own', { ownerId: targetUserId });
  assertCan(actor, 'practice:session', { ownerId: targetUserId });

  const userId = targetUserId;
  const tier: PlanTier = 'plus'; // Plus tier default to demonstrate adaptive features

  const existing = userStudyPlans.get(userId);
  if (existing) {
    return existing;
  }

  // Generate 6-week plan
  const today = new Date();
  const examDate = new Date();
  examDate.setDate(today.getDate() + 42); // 6 weeks out

  const newPlan = generateStudyPlan({
    userId,
    tier,
    startDate: today.toISOString().split('T')[0],
    targetExamDate: examDate.toISOString().split('T')[0] ?? '',
    targetScores: { quant: 167, verbal: 161 },
    estimatedScores: { quant: 155, verbal: 152 },
    weakTopics: ['algebra-inequalities', 'data-interpretation', 'text-completion-double'],
    dueVocabCount: 30,
  });

  userStudyPlans.set(userId, newPlan);
  return newPlan;
}

export async function rescheduleStudyPlanAction(rawAsOfDate?: string): Promise<RescheduleResult> {
  const asOfDate = asOfDateSchema.parse(rawAsOfDate);
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });
  assertCan(actor, 'practice:session', { ownerId: actor.id });

  const currentPlan = await getStudyPlanAction();

  const result = rescheduleStudyPlan(currentPlan, asOfDate);
  if (result.success) {
    userStudyPlans.set(actor.id, result.plan);
  }

  return result;
}

export async function toggleTaskCompletionAction(rawTaskId: string): Promise<StudyPlan> {
  const taskId = taskIdSchema.parse(rawTaskId);
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });
  assertCan(actor, 'practice:session', { ownerId: actor.id });

  const currentPlan = await getStudyPlanAction();

  let completed = 0;
  const updatedTasks = currentPlan.tasks.map((task) => {
    if (task.id === taskId) {
      const nextStatus = task.status === 'completed' ? 'pending' : 'completed';
      if (nextStatus === 'completed') completed++;
      return { ...task, status: nextStatus as 'completed' | 'pending' };
    }
    if (task.status === 'completed') completed++;
    return task;
  });

  const completionRate = Math.round((completed / updatedTasks.length) * 100);

  const updatedPlan: StudyPlan = {
    ...currentPlan,
    tasks: updatedTasks,
    completionRatePercent: completionRate,
  };

  userStudyPlans.set(actor.id, updatedPlan);
  return updatedPlan;
}
