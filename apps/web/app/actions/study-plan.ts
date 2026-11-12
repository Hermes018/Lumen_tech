/** @purpose Server actions for GRE Study Plan and Adaptive Rescheduling */
'use server';

import { headers } from 'next/headers';
import { getAuth } from '@lumen/auth';
import {
  generateStudyPlan,
  rescheduleStudyPlan,
  type StudyPlan,
  type PlanTier,
  type RescheduleResult,
} from '@lumen/core';

// In-memory study plan store for demonstration and prototype session
const userStudyPlans = new Map<string, StudyPlan>();

export async function getStudyPlanAction(): Promise<StudyPlan> {
  let userId = 'learner-current';
  const tier: PlanTier = 'plus'; // Plus tier default to demonstrate adaptive features

  try {
    const reqHeaders = await headers();
    const session = await getAuth().api.getSession({ headers: reqHeaders });
    if (session?.user) {
      userId = session.user.id;
    }
  } catch {
    // Dev fallback
  }

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

export async function rescheduleStudyPlanAction(asOfDate?: string): Promise<RescheduleResult> {
  let userId = 'learner-current';

  try {
    const reqHeaders = await headers();
    const session = await getAuth().api.getSession({ headers: reqHeaders });
    if (session?.user) {
      userId = session.user.id;
    }
  } catch {
    // Dev fallback
  }

  const currentPlan = await getStudyPlanAction();

  const result = rescheduleStudyPlan(currentPlan, asOfDate);
  if (result.success) {
    userStudyPlans.set(userId, result.plan);
  }

  return result;
}

export async function toggleTaskCompletionAction(taskId: string): Promise<StudyPlan> {
  let userId = 'learner-current';

  try {
    const reqHeaders = await headers();
    const session = await getAuth().api.getSession({ headers: reqHeaders });
    if (session?.user) {
      userId = session.user.id;
    }
  } catch {
    // Dev fallback
  }

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

  userStudyPlans.set(userId, updatedPlan);
  return updatedPlan;
}
