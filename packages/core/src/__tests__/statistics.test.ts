/** @purpose Unit tests for classical test theory (CTT) item statistics, point-biserial discrimination, and retirement rules */
import { describe, it, expect } from 'vitest';
import {
  calculatePValue,
  calculatePointBiserial,
  calculateDistractorStats,
  evaluateItemFlags,
  computeItemStatistics,
  type StudentItemResponse,
} from '../exam/statistics';

describe('Item Statistics & Psychometric Engine (07 §8.6)', () => {
  describe('calculatePValue', () => {
    it('computes proportion correct among scored responses accurately', () => {
      const responses = [
        { isCorrect: true },
        { isCorrect: true },
        { isCorrect: false },
        { isCorrect: true },
      ];
      expect(calculatePValue(responses)).toBe(0.75);
    });

    it('returns 0 when responses array is empty or all incorrect', () => {
      expect(calculatePValue([])).toBe(0);
      expect(calculatePValue([{ isCorrect: false }, { isCorrect: false }])).toBe(0);
    });

    it('returns 1.0 when all responses are correct', () => {
      expect(calculatePValue([{ isCorrect: true }, { isCorrect: true }])).toBe(1.0);
    });
  });

  describe('calculatePointBiserial', () => {
    it('computes positive item-rest discrimination when high scorers get the item right', () => {
      // 5 students:
      // S1: rest score = 15, item = 1
      // S2: rest score = 14, item = 1
      // S3: rest score = 12, item = 1
      // S4: rest score = 6,  item = 0
      // S5: rest score = 5,  item = 0
      const responses = [
        { isCorrect: true, sectionTotalScore: 16 }, // rest = 15
        { isCorrect: true, sectionTotalScore: 15 }, // rest = 14
        { isCorrect: true, sectionTotalScore: 13 }, // rest = 12
        { isCorrect: false, sectionTotalScore: 6 }, // rest = 6
        { isCorrect: false, sectionTotalScore: 5 }, // rest = 5
      ];

      const rpbis = calculatePointBiserial(responses);
      expect(rpbis).toBeGreaterThan(0.7);
      expect(rpbis).toBeLessThanOrEqual(1.0);
    });

    it('detects negative point-biserial (key-suspected) when low scorers get the item right', () => {
      // Flawed item where weaker students answer correctly (or key is wrong!)
      const responses = [
        { isCorrect: false, sectionTotalScore: 18 }, // high scorer gets it wrong
        { isCorrect: false, sectionTotalScore: 17 },
        { isCorrect: false, sectionTotalScore: 16 },
        { isCorrect: true, sectionTotalScore: 4 },  // low scorer gets it right
        { isCorrect: true, sectionTotalScore: 3 },
      ];

      const rpbis = calculatePointBiserial(responses);
      expect(rpbis).toBeLessThan(0);
    });

    it('returns 0 when variance is 0 (all correct or all incorrect)', () => {
      const allCorrect = [
        { isCorrect: true, sectionTotalScore: 10 },
        { isCorrect: true, sectionTotalScore: 10 },
      ];
      expect(calculatePointBiserial(allCorrect)).toBe(0);

      const allWrong = [
        { isCorrect: false, sectionTotalScore: 5 },
        { isCorrect: false, sectionTotalScore: 5 },
      ];
      expect(calculatePointBiserial(allWrong)).toBe(0);
    });
  });

  describe('calculateDistractorStats', () => {
    it('calculates distractor selection frequencies and point-biserial correlations', () => {
      const responses: StudentItemResponse[] = [
        { studentId: 's1', selectedOption: 'choice_b', isCorrect: true, sectionTotalScore: 15 },
        { studentId: 's2', selectedOption: 'choice_b', isCorrect: true, sectionTotalScore: 14 },
        { studentId: 's3', selectedOption: 'choice_a', isCorrect: false, sectionTotalScore: 8 },
        { studentId: 's4', selectedOption: 'choice_c', isCorrect: false, sectionTotalScore: 6 },
        { studentId: 's5', selectedOption: 'choice_a', isCorrect: false, sectionTotalScore: 5 },
      ];

      const distStats = calculateDistractorStats(responses, 'choice_b');
      expect(distStats).toHaveLength(3);

      const keyStat = distStats.find((d) => d.optionId === 'choice_b');
      expect(keyStat?.isKey).toBe(true);
      expect(keyStat?.selectionRate).toBe(0.4); // 2 / 5
      expect(keyStat?.pointBiserial).toBeGreaterThan(0);

      const distA = distStats.find((d) => d.optionId === 'choice_a');
      expect(distA?.isKey).toBe(false);
      expect(distA?.selectionRate).toBe(0.4);
      expect(distA?.pointBiserial).toBeLessThan(0); // attractive to lower scorers
    });

    it('flags distractor when it has higher point-biserial than key', () => {
      // Key is choice_a, but choice_b was chosen by all high scorers
      const responses: StudentItemResponse[] = [
        { studentId: 's1', selectedOption: 'choice_b', isCorrect: false, sectionTotalScore: 20 },
        { studentId: 's2', selectedOption: 'choice_b', isCorrect: false, sectionTotalScore: 19 },
        { studentId: 's3', selectedOption: 'choice_a', isCorrect: true, sectionTotalScore: 6 },
        { studentId: 's4', selectedOption: 'choice_a', isCorrect: true, sectionTotalScore: 5 },
      ];

      const distStats = calculateDistractorStats(responses, 'choice_a');
      const distB = distStats.find((d) => d.optionId === 'choice_b');
      const keyA = distStats.find((d) => d.optionId === 'choice_a');

      expect(distB?.pointBiserial).toBeGreaterThan(keyA?.pointBiserial ?? 0);
    });
  });

  describe('evaluateItemFlags and Retirement Rules (07 §8.6)', () => {
    it('flags items as too hard when p-value < 0.15', () => {
      const evaluation = evaluateItemFlags({
        attempts: 120,
        pValue: 0.10,
        pointBiserial: 0.35,
        exposureRate: 0.05,
      });

      expect(evaluation.flags).toContain('too_hard');
      expect(evaluation.recommendedAction).toBe('warn');
    });

    it('flags items as too easy when p-value > 0.95', () => {
      const evaluation = evaluateItemFlags({
        attempts: 150,
        pValue: 0.98,
        pointBiserial: 0.20,
        exposureRate: 0.05,
      });

      expect(evaluation.flags).toContain('too_easy');
      expect(evaluation.recommendedAction).toBe('warn');
    });

    it('flags negative point-biserial as key-suspected and blocks inclusion', () => {
      const evaluation = evaluateItemFlags({
        attempts: 110,
        pValue: 0.45,
        pointBiserial: -0.08,
        exposureRate: 0.08,
      });

      expect(evaluation.flags).toContain('key_suspected');
      expect(evaluation.recommendedAction).toBe('key_suspected');
      expect(evaluation.shouldKeySuspend).toBe(true);
    });

    it('auto-retires severely defective items with severe negative discrimination', () => {
      const evaluation = evaluateItemFlags({
        attempts: 200,
        pValue: 0.30,
        pointBiserial: -0.22,
        exposureRate: 0.10,
      });

      expect(evaluation.flags).toContain('key_suspected');
      expect(evaluation.shouldRetire).toBe(true);
      expect(evaluation.recommendedAction).toBe('retire');
    });

    it('flags over-exposed items exceeding rMax rate', () => {
      const evaluation = evaluateItemFlags({
        attempts: 500,
        pValue: 0.55,
        pointBiserial: 0.40,
        exposureRate: 0.28, // rMax = 0.20
        rMax: 0.20,
      });

      expect(evaluation.flags).toContain('over_exposed');
    });
  });

  describe('computeItemStatistics', () => {
    it('aggregates full item statistics, distractor tables, and recommendation', () => {
      const responses: StudentItemResponse[] = [];
      for (let i = 0; i < 60; i++) {
        responses.push({
          studentId: `s${i}`,
          selectedOption: 'choice_c',
          isCorrect: true,
          sectionTotalScore: 16,
          timeSpentMs: 45000,
        });
      }
      for (let i = 60; i < 100; i++) {
        responses.push({
          studentId: `s${i}`,
          selectedOption: 'choice_a',
          isCorrect: false,
          sectionTotalScore: 8,
          timeSpentMs: 50000,
        });
      }

      const itemStats = computeItemStatistics({
        questionId: 'q-math-geom-01',
        responses,
        correctOptionId: 'choice_c',
        totalAttempts: 100,
        totalPoolAttempts: 500,
      });

      expect(itemStats.questionId).toBe('q-math-geom-01');
      expect(itemStats.attempts).toBe(100);
      expect(itemStats.correct).toBe(60);
      expect(itemStats.pValue).toBe(0.60);
      expect(itemStats.pointBiserial).toBeGreaterThan(0.6);
      expect(itemStats.exposureRate).toBe(0.20);
      expect(itemStats.recommendedAction).toBe('none');
      expect(itemStats.flags).toHaveLength(0);
    });
  });
});
