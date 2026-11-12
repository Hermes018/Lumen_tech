/**
 * @purpose GRE Study Plan Generator and Adaptive Rescheduling Engine
 * Conforms to docs/17-PRICING-MASTER.md §2.2 (Core: read-only; Plus/Live: adaptive reschedule) and docs/34-AI-LEARNING-FEATURES.md §7.
 */

import { z } from '@lumen/config';

export type PlanTier = 'free' | 'core' | 'pass' | 'plus' | 'live' | 'mentor';

export type TaskType =
  | 'quant_practice'
  | 'verbal_practice'
  | 'vocab_review'
  | 'mistake_retry'
  | 'sectional_mock'
  | 'full_cbt_mock';

export type TaskStatus = 'pending' | 'completed' | 'missed';

export const StudyPlanTaskSchema = z.object({
  id: z.string(),
  dayIndex: z.number().int().min(0),
  dateStr: z.string(), // ISO date YYYY-MM-DD
  weekNumber: z.number().int().min(1),
  type: z.enum([
    'quant_practice',
    'verbal_practice',
    'vocab_review',
    'mistake_retry',
    'sectional_mock',
    'full_cbt_mock',
  ]),
  title: z.string(),
  description: z.string(),
  estimatedMinutes: z.number().int().min(5).max(240),
  status: z.enum(['pending', 'completed', 'missed']).default('pending'),
  topicSlug: z.string().optional(),
  targetQuestionCount: z.number().int().optional(),
  isReallocated: z.boolean().default(false),
});

export type StudyPlanTask = z.infer<typeof StudyPlanTaskSchema>;

export const StudyPlanSchema = z.object({
  id: z.string(),
  userId: z.string(),
  examType: z.literal('gre').default('gre'),
  tier: z.enum(['free', 'core', 'pass', 'plus', 'live', 'mentor']),
  targetExamDate: z.string(), // YYYY-MM-DD
  startDate: z.string(), // YYYY-MM-DD
  totalWeeks: z.number().int().min(1),
  targetScores: z.object({
    quant: z.number().int().min(130).max(170),
    verbal: z.number().int().min(130).max(170),
  }),
  currentEstimatedScores: z.object({
    quant: z.number().int().min(130).max(170),
    verbal: z.number().int().min(130).max(170),
  }),
  weakTopics: z.array(z.string()),
  dueVocabCount: z.number().int().min(0),
  tasks: z.array(StudyPlanTaskSchema),
  adaptiveReschedulesUsed: z.number().int().default(0),
  lastRescheduledAt: z.string().optional(),
  completionRatePercent: z.number().min(0).max(100).default(0),
});

export type StudyPlan = z.infer<typeof StudyPlanSchema>;

export interface GeneratePlanParams {
  userId: string;
  tier: PlanTier;
  startDate?: string; // defaults to today (YYYY-MM-DD)
  targetExamDate: string; // YYYY-MM-DD
  targetScores?: { quant: number; verbal: number };
  estimatedScores?: { quant: number; verbal: number };
  weakTopics?: string[]; // e.g. ['algebra-inequalities', 'vocab-text-completion']
  dueVocabCount?: number;
}

/**
 * Generates a structured week-by-week GRE CBT study plan
 */
export function generateStudyPlan(params: GeneratePlanParams): StudyPlan {
  const start = params.startDate ? new Date(params.startDate) : new Date();
  const exam = new Date(params.targetExamDate);

  const diffTime = Math.max(0, exam.getTime() - start.getTime());
  const diffDays = Math.max(7, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  const totalWeeks = Math.max(1, Math.ceil(diffDays / 7));

  const targetScores = params.targetScores ?? { quant: 165, verbal: 160 };
  const currentEstimatedScores = params.estimatedScores ?? { quant: 154, verbal: 150 };
  const weakTopics = params.weakTopics && params.weakTopics.length > 0
    ? params.weakTopics
    : ['algebra-inequalities', 'data-interpretation', 'text-completion-double'];

  const dueVocab = params.dueVocabCount ?? 25;
  const tasks: StudyPlanTask[] = [];

  for (let day = 0; day < diffDays; day++) {
    const taskDate = new Date(start);
    taskDate.setDate(start.getDate() + day);
    const dateStr = taskDate.toISOString().split('T')[0] ?? '';
    const dayOfWeek = taskDate.getDay(); // 0 is Sunday, 6 is Saturday
    const weekNumber = Math.floor(day / 7) + 1;

    // Pattern based on day of week:
    // Weekday: alternate Quant / Verbal + Vocab
    // Weekend: Mocks or Deep Mistake Notebook Retries
    if (dayOfWeek === 0) {
      // Sunday: Full CBT or Sectional Mock
      tasks.push({
        id: `task-${day}-mock`,
        dayIndex: day,
        dateStr,
        weekNumber,
        type: weekNumber % 2 === 0 ? 'full_cbt_mock' : 'sectional_mock',
        title: weekNumber % 2 === 0 ? 'Full-Length GRE CBT Mock' : 'Section-Adaptive Quant/Verbal Mock',
        description: 'Complete timed sectional or full exam shell and log reflections in Mistake Notebook.',
        estimatedMinutes: weekNumber % 2 === 0 ? 120 : 60,
        status: 'pending',
        isReallocated: false,
      });
    } else if (dayOfWeek === 6) {
      // Saturday: Mistake Notebook Resolution & Deep Vocab
      tasks.push({
        id: `task-${day}-mistake-review`,
        dayIndex: day,
        dateStr,
        weekNumber,
        type: 'mistake_retry',
        title: 'Mistake Notebook Retries & Trap Diagnostics',
        description: 'Hint-free retry of unresolved questions to prove conceptual mastery.',
        estimatedMinutes: 45,
        status: 'pending',
        isReallocated: false,
      });
    } else if (dayOfWeek % 2 === 1) {
      // Mon, Wed, Fri: Quant Focused Practice
      const topic = weakTopics[day % weakTopics.length] ?? 'algebra-inequalities';
      tasks.push({
        id: `task-${day}-quant`,
        dayIndex: day,
        dateStr,
        weekNumber,
        type: 'quant_practice',
        title: `Quant Practice: ${topic.replace(/-/g, ' ')}`,
        description: 'Work through 10-15 targeted Quant items with Socratic hint ladder if needed.',
        estimatedMinutes: 45,
        status: 'pending',
        topicSlug: topic,
        targetQuestionCount: 12,
        isReallocated: false,
      });
    } else {
      // Tue, Thu: Verbal + FSRS Vocab Review
      tasks.push({
        id: `task-${day}-verbal`,
        dayIndex: day,
        dateStr,
        weekNumber,
        type: 'verbal_practice',
        title: 'Verbal TC/SE + FSRS Vocab Deck',
        description: `Review ${dueVocab} due flashcards and complete Text Completion items.`,
        estimatedMinutes: 40,
        status: 'pending',
        targetQuestionCount: 10,
        isReallocated: false,
      });
    }
  }

  return {
    id: `plan-${params.userId}-${Date.now()}`,
    userId: params.userId,
    examType: 'gre',
    tier: params.tier,
    targetExamDate: params.targetExamDate,
    startDate: params.startDate ?? (start.toISOString().split('T')[0] ?? ''),
    totalWeeks,
    targetScores,
    currentEstimatedScores,
    weakTopics,
    dueVocabCount: dueVocab,
    tasks,
    adaptiveReschedulesUsed: 0,
    completionRatePercent: 0,
  };
}

export interface RescheduleResult {
  success: boolean;
  plan: StudyPlan;
  reallocatedTasksCount: number;
  newDailyAverageMinutes: number;
  message: string;
}

/**
 * Adaptive Rescheduling: Redistributes missed or pending past tasks across future days.
 * Allowed ONLY for Plus, Live, and Mentor tiers per docs/17 §2.2.
 */
export function rescheduleStudyPlan(
  plan: StudyPlan,
  asOfDateStr?: string
): RescheduleResult {
  // 1. Check Tier Permission
  const isAdaptiveAllowed =
    plan.tier === 'plus' || plan.tier === 'live' || plan.tier === 'mentor';

  if (!isAdaptiveAllowed) {
    throw new Error(
      `Adaptive Reschedule is exclusive to Plus, Live, and Mentor tiers. Current tier '${plan.tier}' has read-only plan.`
    );
  }

  const asOf = asOfDateStr ? new Date(asOfDateStr) : new Date();
  const asOfIso = asOf.toISOString().split('T')[0] ?? '';

  // 2. Identify past missed tasks
  const missedTasks: StudyPlanTask[] = [];
  const futureTasks: StudyPlanTask[] = [];
  let completedCount = 0;

  for (const task of plan.tasks) {
    if (task.status === 'completed') {
      completedCount++;
      futureTasks.push(task);
    } else if (task.dateStr < asOfIso) {
      // Task was due before asOfDate and is not completed
      task.status = 'missed';
      missedTasks.push(task);
    } else {
      futureTasks.push(task);
    }
  }

  if (missedTasks.length === 0) {
    return {
      success: true,
      plan,
      reallocatedTasksCount: 0,
      newDailyAverageMinutes: Math.round(
        plan.tasks.reduce((acc, t) => acc + t.estimatedMinutes, 0) /
          Math.max(1, plan.tasks.length)
      ),
      message: 'All tasks up to date! No missed tasks to reallocate.',
    };
  }

  // 3. Find available future dates
  const futurePendingTasks = futureTasks.filter((t) => t.dateStr >= asOfIso && t.status === 'pending');
  if (futurePendingTasks.length === 0) {
    return {
      success: false,
      plan,
      reallocatedTasksCount: 0,
      newDailyAverageMinutes: 0,
      message: 'Exam date is reached or no remaining future study days available.',
    };
  }

  // 4. Re-balance missed tasks across future pending days
  let reallocatedCount = 0;
  for (let i = 0; i < missedTasks.length; i++) {
    const missed = missedTasks[i];
    if (!missed) continue;

    // Distribute into future days round-robin
    const targetFutureTask = futurePendingTasks[i % futurePendingTasks.length];
    if (targetFutureTask) {
      // Append task or increase time up to max 120 mins
      targetFutureTask.estimatedMinutes = Math.min(120, targetFutureTask.estimatedMinutes + 15);
      targetFutureTask.isReallocated = true;
      targetFutureTask.description += ` [Includes rollover from ${missed.dateStr}]`;
      reallocatedCount++;
    }
  }

  const updatedTasks = plan.tasks.map((t) => {
    if (t.status === 'missed') {
      return { ...t, isReallocated: true };
    }
    const futureMatch = futurePendingTasks.find((fp) => fp.id === t.id);
    return futureMatch ?? t;
  });

  const completionRate = Math.round((completedCount / updatedTasks.length) * 100);
  const remainingFutureTasks = updatedTasks.filter((t) => t.dateStr >= asOfIso);
  const newAverage = Math.round(
    remainingFutureTasks.reduce((acc, t) => acc + t.estimatedMinutes, 0) /
      Math.max(1, remainingFutureTasks.length)
  );

  const updatedPlan: StudyPlan = {
    ...plan,
    tasks: updatedTasks,
    adaptiveReschedulesUsed: plan.adaptiveReschedulesUsed + 1,
    lastRescheduledAt: new Date().toISOString(),
    completionRatePercent: completionRate,
  };

  return {
    success: true,
    plan: updatedPlan,
    reallocatedTasksCount: reallocatedCount,
    newDailyAverageMinutes: newAverage,
    message: `Successfully re-balanced ${reallocatedCount} missed tasks across your remaining study schedule.`,
  };
}
