/** @purpose Unit tests for study streaks, XP/level calculation, and GRE score predictor */
import { describe, it, expect } from 'vitest';
import {
  calculateStudyStreak,
  calculateLevelInfo,
  calculateSkillMastery,
  calculateGreScorePrediction,
  type ActivityRecord,
} from '../analytics/progress';

describe('Analytics & Progress Logic', () => {
  describe('calculateStudyStreak', () => {
    it('calculates current and longest streak across consecutive days', () => {
      const activities: ActivityRecord[] = [
        { date: '2026-11-10', count: 5 },
        { date: '2026-11-11', count: 12 },
        { date: '2026-11-12', count: 8 },
      ];

      const streak = calculateStudyStreak(activities, { today: '2026-11-12' });
      expect(streak.currentStreak).toBe(3);
      expect(streak.longestStreak).toBe(3);
      expect(streak.isActiveToday).toBe(true);
      expect(streak.lastActiveDate).toBe('2026-11-12');
    });

    it('handles streak freeze without breaking streak', () => {
      const activities: ActivityRecord[] = [
        { date: '2026-11-09', count: 4 },
        { date: '2026-11-10', count: 6 },
        // 2026-11-11 missed, but frozen!
        { date: '2026-11-12', count: 10 },
      ];

      const streak = calculateStudyStreak(activities, {
        today: '2026-11-12',
        freezeDates: ['2026-11-11'],
        maxFreezes: 2,
      });

      expect(streak.currentStreak).toBe(4); // 9, 10, (11 frozen), 12
      expect(streak.freezeCount).toBe(1); // 1 freeze remaining
      expect(streak.frozenDates).toContain('2026-11-11');
    });

    it('returns 0 streak when inactive and no freeze protection', () => {
      const activities: ActivityRecord[] = [
        { date: '2026-11-01', count: 5 },
        { date: '2026-11-02', count: 3 },
      ];

      const streak = calculateStudyStreak(activities, { today: '2026-11-12' });
      expect(streak.currentStreak).toBe(0);
      expect(streak.longestStreak).toBe(2);
      expect(streak.isActiveToday).toBe(false);
    });

    it('generates a 30-day calendar status list', () => {
      const activities: ActivityRecord[] = [
        { date: '2026-11-12', count: 5 },
      ];

      const streak = calculateStudyStreak(activities, { today: '2026-11-12' });
      expect(streak.calendar30Days).toHaveLength(30);
      const todayEntry = streak.calendar30Days.find((d) => d.date === '2026-11-12');
      expect(todayEntry).toBeDefined();
      expect(todayEntry?.status).toBe('active');
    });
  });

  describe('calculateLevelInfo', () => {
    it('calculates level 1 for new learners', () => {
      const level = calculateLevelInfo(0);
      expect(level.level).toBe(1);
      expect(level.currentLevelXp).toBe(0);
      expect(level.xpForNextLevel).toBe(250);
      expect(level.progressPct).toBe(0);
    });

    it('advances levels based on XP thresholds (Khan Academy style)', () => {
      // 250 XP completes Level 1 -> enters Level 2
      const level = calculateLevelInfo(350);
      expect(level.level).toBe(2);
      expect(level.currentLevelXp).toBe(100);
      expect(level.progressPct).toBeGreaterThan(0);
      expect(level.title).toBeDefined();
    });

    it('scales gracefully at high XP without capping or crashing', () => {
      const highLevel = calculateLevelInfo(50000);
      expect(highLevel.level).toBeGreaterThan(10);
      expect(highLevel.progressPct).toBeGreaterThanOrEqual(0);
      expect(highLevel.progressPct).toBeLessThanOrEqual(100);
    });
  });

  describe('calculateSkillMastery', () => {
    it('categorizes skills into Khan Academy mastery stages', () => {
      const skills = [
        { skillSlug: 'arithmetic', name: 'Arithmetic & Integers', subject: 'quant' as const, attempts: 20, correct: 19 }, // 95% -> Mastered
        { skillSlug: 'geometry', name: 'Geometry & Coordinate', subject: 'quant' as const, attempts: 15, correct: 12 },   // 80% -> Proficient
        { skillSlug: 'vocab', name: 'Text Completion', subject: 'verbal' as const, attempts: 10, correct: 5 },            // 50% -> Familiar
        { skillSlug: 'rc', name: 'Reading Comprehension', subject: 'verbal' as const, attempts: 1, correct: 0 },         // 0% -> Not Started
      ];

      const mastery = calculateSkillMastery(skills);
      expect(mastery[0]?.stage).toBe('mastered');
      expect(mastery[1]?.stage).toBe('proficient');
      expect(mastery[2]?.stage).toBe('familiar');
      expect(mastery[3]?.stage).toBe('not_started');
    });
  });

  describe('calculateGreScorePrediction', () => {
    it('strictly clamps estimated GRE scores between 130 and 170', () => {
      // Test extreme lower bound
      const lowPred = calculateGreScorePrediction({
        mocks: [{ attemptId: 'm1', date: '2026-11-01', quantScaled: 120, verbalScaled: 110 }],
        practice: [{ subject: 'quant', attempts: 50, correct: 0 }],
      });
      expect(lowPred.estimatedQuant).toBe(130);
      expect(lowPred.estimatedVerbal).toBe(130);
      expect(lowPred.estimatedTotal).toBe(260);

      // Test extreme upper bound
      const highPred = calculateGreScorePrediction({
        mocks: [{ attemptId: 'm2', date: '2026-11-05', quantScaled: 180, verbalScaled: 175 }],
        practice: [{ subject: 'quant', attempts: 50, correct: 50 }],
      });
      expect(highPred.estimatedQuant).toBe(170);
      expect(highPred.estimatedVerbal).toBe(170);
      expect(highPred.estimatedTotal).toBe(340);
    });

    it('weights mock results and practice accuracy appropriately', () => {
      const pred = calculateGreScorePrediction({
        mocks: [
          { attemptId: 'm1', date: '2026-11-01', quantScaled: 158, verbalScaled: 152 },
          { attemptId: 'm2', date: '2026-11-10', quantScaled: 164, verbalScaled: 156 },
        ],
        practice: [
          { subject: 'quant', attempts: 80, correct: 68 }, // 85% accuracy
          { subject: 'verbal', attempts: 60, correct: 45 }, // 75% accuracy
        ],
        targetScore: { quant: 165, verbal: 160, total: 325 },
      });

      expect(pred.estimatedQuant).toBeGreaterThanOrEqual(160);
      expect(pred.estimatedQuant).toBeLessThanOrEqual(166);
      expect(pred.estimatedVerbal).toBeGreaterThanOrEqual(154);
      expect(pred.estimatedVerbal).toBeLessThanOrEqual(158);
      expect(pred.estimatedTotal).toBe(pred.estimatedQuant + pred.estimatedVerbal);
      expect(pred.confidence).toBe('high');
      expect(pred.gap.totalGap).toBe(325 - pred.estimatedTotal);
    });

    it('falls back to baseline with low confidence when no mocks exist', () => {
      const pred = calculateGreScorePrediction({
        baseline: { quant: 150, verbal: 148 },
      });
      expect(pred.estimatedQuant).toBe(150);
      expect(pred.estimatedVerbal).toBe(148);
      expect(pred.estimatedTotal).toBe(298);
      expect(pred.confidence).toBe('low');
    });

    it('generates a chronological score trend history', () => {
      const pred = calculateGreScorePrediction({
        mocks: [
          { attemptId: 'm1', date: '2026-10-15', quantScaled: 155, verbalScaled: 150 },
          { attemptId: 'm2', date: '2026-11-01', quantScaled: 160, verbalScaled: 153 },
          { attemptId: 'm3', date: '2026-11-10', quantScaled: 163, verbalScaled: 155 },
        ],
      });

      expect(pred.trendHistory).toHaveLength(3);
      expect(pred.trendHistory[0]?.quant).toBe(155);
      expect(pred.trendHistory[2]?.quant).toBe(163);
    });
  });
});
