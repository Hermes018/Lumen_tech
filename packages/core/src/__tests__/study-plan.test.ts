/**
 * @purpose Unit tests for GRE Study Plan Generator and Adaptive Reschedule Engine
 */

import { describe, it, expect } from 'vitest';
import {
  generateStudyPlan,
  rescheduleStudyPlan,
  type StudyPlan,
} from '../analytics/study-plan';

describe('GRE Study Plan Engine', () => {
  const startDate = '2026-11-01';
  const targetExamDate = '2026-11-29'; // 4 weeks

  it('generates a 4-week structured GRE study plan', () => {
    const plan = generateStudyPlan({
      userId: 'test-learner-1',
      tier: 'plus',
      startDate,
      targetExamDate,
      targetScores: { quant: 168, verbal: 162 },
      estimatedScores: { quant: 156, verbal: 152 },
      weakTopics: ['algebra-inequalities', 'data-interpretation'],
      dueVocabCount: 30,
    });

    expect(plan.userId).toBe('test-learner-1');
    expect(plan.tier).toBe('plus');
    expect(plan.totalWeeks).toBe(4);
    expect(plan.tasks.length).toBe(28);

    // Verify task types are generated across days
    const mockTasks = plan.tasks.filter((t) => t.type === 'sectional_mock' || t.type === 'full_cbt_mock');
    expect(mockTasks.length).toBeGreaterThanOrEqual(4);

    const quantTasks = plan.tasks.filter((t) => t.type === 'quant_practice');
    expect(quantTasks.length).toBeGreaterThan(0);
    expect(quantTasks.some((t) => t.topicSlug === 'algebra-inequalities')).toBe(true);

    const mistakeTasks = plan.tasks.filter((t) => t.type === 'mistake_retry');
    expect(mistakeTasks.length).toBeGreaterThan(0);
  });

  describe('Adaptive Reschedule Permissions (docs/17 §2.2)', () => {
    it('throws error when Core or Free tier attempts adaptive reschedule', () => {
      const corePlan = generateStudyPlan({
        userId: 'core-learner',
        tier: 'core',
        startDate,
        targetExamDate,
      });

      expect(() => rescheduleStudyPlan(corePlan, '2026-11-08')).toThrow(
        /Adaptive Reschedule is exclusive to Plus, Live, and Mentor tiers/
      );
    });

    it('allows adaptive reschedule for Plus tier', () => {
      const plusPlan = generateStudyPlan({
        userId: 'plus-learner',
        tier: 'plus',
        startDate,
        targetExamDate,
      });

      // Simulate day 7: learner missed 3 tasks in the first week
      const result = rescheduleStudyPlan(plusPlan, '2026-11-08');
      expect(result.success).toBe(true);
      expect(result.plan.adaptiveReschedulesUsed).toBe(1);
      expect(result.plan.tasks.some((t) => t.status === 'missed')).toBe(true);
      expect(result.reallocatedTasksCount).toBeGreaterThan(0);
    });
  });

  describe('Adaptive Rescheduling Redistribution Logic', () => {
    it('correctly re-balances missed tasks and increases future task allocation', () => {
      const plan: StudyPlan = generateStudyPlan({
        userId: 'learner-reschedule',
        tier: 'plus',
        startDate: '2026-11-01',
        targetExamDate: '2026-11-15', // 2 weeks
      });

      // Mark first 3 tasks as incomplete before Nov 5
      const asOfDate = '2026-11-05';
      const result = rescheduleStudyPlan(plan, asOfDate);

      expect(result.success).toBe(true);
      expect(result.reallocatedTasksCount).toBe(4); // 4 past pending tasks before Nov 5

      // Check future task received rollover
      const futureTask = result.plan.tasks.find((t) => t.dateStr >= asOfDate && t.isReallocated);
      expect(futureTask).toBeDefined();
      expect(futureTask?.description).toContain('Includes rollover');
      expect(futureTask?.estimatedMinutes).toBeGreaterThan(40);
    });

    it('returns clean message if all tasks are already completed', () => {
      const plan: StudyPlan = generateStudyPlan({
        userId: 'learner-on-track',
        tier: 'mentor',
        startDate: '2026-11-01',
        targetExamDate: '2026-11-15',
      });

      // Mark all past tasks completed
      for (const t of plan.tasks) {
        if (t.dateStr < '2026-11-05') {
          t.status = 'completed';
        }
      }

      const result = rescheduleStudyPlan(plan, '2026-11-05');
      expect(result.success).toBe(true);
      expect(result.reallocatedTasksCount).toBe(0);
      expect(result.message).toContain('All tasks up to date');
    });
  });
});
