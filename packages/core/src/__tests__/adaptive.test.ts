/** @purpose Unit tests for Rasch EAP ability estimation and GRE adaptive routing */

import { describe, it, expect } from 'vitest';
import {
  eapTheta,
  thetaToScaled,
  priorB,
  calculateExamScore,
  GRE_SCALE,
  type ScoredItem,
} from '../exam/scoring';
import {
  routeSection,
  tierToLearnerLabel,
  GRE_ADAPTIVE_RULES_V1,
  type S1Item,
} from '../exam/adaptive';

describe('Rasch 1PL EAP Scoring (docs/07 §3.3)', () => {
  it('reproduces the worked example from doc 07 §3.3.6 (20/27 at b=0 -> Verbal 158 [154-161])', () => {
    // 27 items at b = 0, 20 correct
    const items: ScoredItem[] = Array.from({ length: 27 }, (_, i) => ({
      b: 0,
      correct: i < 20,
    }));

    const est = eapTheta(items);

    // Worked example expectation: theta ~ 0.91, sem ~ 0.40
    expect(est.theta).toBeGreaterThan(0.89);
    expect(est.theta).toBeLessThan(0.93);
    expect(est.sem).toBeGreaterThan(0.38);
    expect(est.sem).toBeLessThan(0.42);

    const verbalScaled = thetaToScaled(est, GRE_SCALE.verbal);

    // Verbal estimate: 158 (range 154-161)
    expect(verbalScaled.scaled).toBe(158);
    expect(verbalScaled.low).toBe(154);
    expect(verbalScaled.high).toBe(161);
  });

  it('guarantees monotonicity: more correct answers strictly increases theta for fixed items', () => {
    const makeItems = (nCorrect: number): ScoredItem[] =>
      Array.from({ length: 20 }, (_, i) => ({
        b: (i - 10) * 0.1,
        correct: i < nCorrect,
      }));

    let previousTheta = -999;
    for (let c = 0; c <= 20; c += 2) {
      const { theta } = eapTheta(makeItems(c));
      expect(theta).toBeGreaterThan(previousTheta);
      previousTheta = theta;
    }
  });

  it('proves adaptive difficulty sensitivity: higher item difficulty yields higher theta for same raw count', () => {
    const itemsB0: ScoredItem[] = Array.from({ length: 27 }, (_, i) => ({
      b: 0.0,
      correct: i < 20,
    }));
    const itemsBHigh: ScoredItem[] = Array.from({ length: 27 }, (_, i) => ({
      b: 0.8,
      correct: i < 20,
    }));

    const estB0 = eapTheta(itemsB0);
    const estBHigh = eapTheta(itemsBHigh);

    expect(estBHigh.theta).toBeGreaterThan(estB0.theta);
  });

  it('enforces scale clamps: never exceeds 130-170 bounds', () => {
    const allWrong: ScoredItem[] = Array.from({ length: 27 }, () => ({
      b: 2.0,
      correct: false,
    }));
    const allRight: ScoredItem[] = Array.from({ length: 27 }, () => ({
      b: -2.0,
      correct: true,
    }));

    const scaledLow = thetaToScaled(eapTheta(allWrong), GRE_SCALE.quant);
    const scaledHigh = thetaToScaled(eapTheta(allRight), GRE_SCALE.quant);

    expect(scaledLow.scaled).toBeGreaterThanOrEqual(130);
    expect(scaledLow.low).toBeGreaterThanOrEqual(130);
    expect(scaledHigh.scaled).toBeLessThanOrEqual(170);
    expect(scaledHigh.high).toBeLessThanOrEqual(170);
  });

  it('calculates author difficulty prior correctly (docs/07 §3.3.2)', () => {
    expect(priorB(1)).toBeCloseTo(-1.2);
    expect(priorB(3)).toBeCloseTo(0.0);
    expect(priorB(5)).toBeCloseTo(1.2);
  });

  it('calculates full exam scores across verbal and quant measures', () => {
    const verbalItems: ScoredItem[] = Array.from({ length: 27 }, (_, i) => ({
      b: 0,
      correct: i < 22,
    }));
    const quantItems: ScoredItem[] = Array.from({ length: 27 }, (_, i) => ({
      b: 0.2,
      correct: i < 25,
    }));

    const examScore = calculateExamScore([
      { measure: 'verbal', items: verbalItems },
      { measure: 'quant', items: quantItems },
    ]);

    expect(examScore.verbal.scaled.scaled).toBeGreaterThanOrEqual(130);
    expect(examScore.verbal.scaled.scaled).toBeLessThanOrEqual(170);
    expect(examScore.quant.scaled.scaled).toBeGreaterThanOrEqual(130);
    expect(examScore.quant.scaled.scaled).toBeLessThanOrEqual(170);
  });
});

describe('GRE Section-Level Adaptive Routing (docs/07 §4)', () => {
  const makeS1 = (correctCount: number, calibrated = false): S1Item[] =>
    Array.from({ length: 12 }, (_, i) => ({
      b: 0,
      correct: i < correctCount,
      calibrated,
    }));

  it('routes to "low" tier when raw_pct < 0.4 (0-4 correct of 12)', () => {
    // Verbal section 2 -> target section 4
    const result0 = routeSection(GRE_ADAPTIVE_RULES_V1, 2, 'sec-verbal-1', makeS1(0));
    expect(result0.tier).toBe('low');
    expect(result0.targetPosition).toBe(4);
    expect(result0.basis.metric).toBe('raw_pct');
    expect(result0.basis.value).toBe(0);

    const result4 = routeSection(GRE_ADAPTIVE_RULES_V1, 2, 'sec-verbal-1', makeS1(4));
    expect(result4.tier).toBe('low');
    expect(result4.basis.value).toBeCloseTo(4 / 12);
  });

  it('routes to "medium" tier when 0.4 <= raw_pct < 0.75 (5-8 correct of 12)', () => {
    const result5 = routeSection(GRE_ADAPTIVE_RULES_V1, 2, 'sec-verbal-1', makeS1(5));
    expect(result5.tier).toBe('medium');

    const result8 = routeSection(GRE_ADAPTIVE_RULES_V1, 2, 'sec-verbal-1', makeS1(8));
    expect(result8.tier).toBe('medium');
    expect(result8.targetPosition).toBe(4);
  });

  it('routes to "high" tier when raw_pct >= 0.75 (9-12 correct of 12)', () => {
    const result9 = routeSection(GRE_ADAPTIVE_RULES_V1, 2, 'sec-verbal-1', makeS1(9));
    expect(result9.tier).toBe('high');

    const result12 = routeSection(GRE_ADAPTIVE_RULES_V1, 2, 'sec-verbal-1', makeS1(12));
    expect(result12.tier).toBe('high');
  });

  it('routes Quant section 3 to target section 5', () => {
    const quantResult = routeSection(GRE_ADAPTIVE_RULES_V1, 3, 'sec-quant-1', makeS1(11));
    expect(quantResult.tier).toBe('high');
    expect(quantResult.targetPosition).toBe(5);
  });

  it('automatically upgrades to theta routing when calibratedShare >= 0.7', () => {
    // 10 of 12 items calibrated
    const calibratedS1Low: S1Item[] = Array.from({ length: 12 }, (_, i) => ({
      b: 0,
      correct: i < 2, // low score
      calibrated: i < 10,
    }));

    const resultLow = routeSection(GRE_ADAPTIVE_RULES_V1, 2, 'sec-verbal-1', calibratedS1Low);
    expect(resultLow.basis.metric).toBe('theta');
    expect(resultLow.basis.calibratedShare).toBeCloseTo(10 / 12);
    expect(resultLow.tier).toBe('low');

    // High score calibrated
    const calibratedS1High: S1Item[] = Array.from({ length: 12 }, (_, i) => ({
      b: 0,
      correct: i < 11, // high score
      calibrated: i < 10,
    }));

    const resultHigh = routeSection(GRE_ADAPTIVE_RULES_V1, 2, 'sec-verbal-1', calibratedS1High);
    expect(resultHigh.basis.metric).toBe('theta');
    expect(resultHigh.tier).toBe('high');
  });

  it('throws an error for non-existent source section position', () => {
    expect(() => routeSection(GRE_ADAPTIVE_RULES_V1, 99, 'sec-invalid', makeS1(6))).toThrow(
      /no adaptive route/i
    );
  });

  it('formats learner-facing labels without exposing internal low/high labels', () => {
    expect(tierToLearnerLabel('low')).toBe('Easier second section');
    expect(tierToLearnerLabel('medium')).toBe('Standard second section');
    expect(tierToLearnerLabel('high')).toBe('Harder second section');
  });
});
