/** @purpose GRE section-level adaptive routing engine and threshold evaluation */

import { eapTheta, type ScoredItem } from './scoring';

export type Tier = 'low' | 'medium' | 'high';

export interface Threshold {
  lt?: number;
  lte?: number;
  tier: Tier;
}

export interface RouteRule {
  fromPosition: number;
  targetPosition: number;
  measure: 'verbal' | 'quant';
  metric: 'raw_pct';
  thresholds: Threshold[];
  /** Optional upgrade: once enough S1 items are calibrated, route on Rasch theta instead (docs/07 §3.3). */
  theta?: {
    minCalibratedShare: number;
    thresholds: Threshold[];
  };
}

export interface AdaptiveRulesV1 {
  routes: RouteRule[];
}

/** Thresholds: raw 0-4 of 12 -> low, 5-8 -> medium, 9-12 -> high */
export const RAW_GRE_THRESHOLDS: Threshold[] = [
  { lt: 0.4, tier: 'low' },
  { lt: 0.75, tier: 'medium' },
  { lte: 1, tier: 'high' },
];

/** Theta thresholds: < -0.45 -> low, < 0.55 -> medium, else high */
export const THETA_GRE_THRESHOLDS: Threshold[] = [
  { lt: -0.45, tier: 'low' },
  { lt: 0.55, tier: 'medium' },
  { lte: 99, tier: 'high' },
];

/** Canonical GRE section routing rules: Section 2 Verbal -> Section 4; Section 3 Quant -> Section 5 */
export const GRE_ADAPTIVE_RULES_V1: AdaptiveRulesV1 = {
  routes: [
    {
      fromPosition: 2,
      targetPosition: 4,
      measure: 'verbal',
      metric: 'raw_pct',
      thresholds: RAW_GRE_THRESHOLDS,
      theta: { minCalibratedShare: 0.7, thresholds: THETA_GRE_THRESHOLDS },
    },
    {
      fromPosition: 3,
      targetPosition: 5,
      measure: 'quant',
      metric: 'raw_pct',
      thresholds: RAW_GRE_THRESHOLDS,
      theta: { minCalibratedShare: 0.7, thresholds: THETA_GRE_THRESHOLDS },
    },
  ],
};

export interface S1Item extends ScoredItem {
  calibrated: boolean;
  isMistakeRetry?: boolean;
  excludeFromIrt?: boolean;
}

export interface RoutingBasis {
  fromAttemptSectionId: string;
  metric: 'raw_pct' | 'theta';
  value: number;
  ruleIndex: number;
  s1Raw: number;
  s1Count: number;
  calibratedShare: number;
  override?: { by: string; reason: string };
}

export interface RoutingResult {
  tier: Tier;
  targetPosition: number;
  basis: RoutingBasis;
}

const pickTier = (v: number, ts: Threshold[]): Tier => {
  for (const t of ts) {
    if (t.lt !== undefined && v < t.lt) return t.tier;
    if (t.lte !== undefined && v <= t.lte) return t.tier;
  }
  return ts[ts.length - 1]?.tier ?? 'medium';
};

/**
 * Deterministic router: same S1 responses + same rules => same tier.
 * Unanswered items MUST be passed as correct: false.
 * Matches docs/07 §4.3 specification.
 */
export function routeSection(
  rules: AdaptiveRulesV1,
  fromPosition: number,
  fromAttemptSectionId: string,
  s1: S1Item[]
): RoutingResult {
  const ruleIndex = rules.routes.findIndex((r) => r.fromPosition === fromPosition);
  const rule = rules.routes[ruleIndex];
  if (!rule) {
    throw new Error(`No adaptive route found for source section position ${fromPosition}`);
  }

  // Strictly exclude Mistake Notebook retry attempts from IRT ability & routing calculations
  const eligibleS1 = s1.filter((i) => !i.isMistakeRetry && !i.excludeFromIrt);

  const s1Raw = eligibleS1.filter((i) => i.correct).length;
  const calibratedShare =
    eligibleS1.length > 0
      ? eligibleS1.filter((i) => i.calibrated).length / eligibleS1.length
      : 0;
  const useTheta = Boolean(rule.theta && calibratedShare >= rule.theta.minCalibratedShare);

  const value = useTheta ? eapTheta(eligibleS1).theta : s1Raw / Math.max(1, eligibleS1.length);
  const tier = pickTier(value, useTheta && rule.theta ? rule.theta.thresholds : rule.thresholds);

  return {
    tier,
    targetPosition: rule.targetPosition,
    basis: {
      fromAttemptSectionId,
      metric: useTheta ? 'theta' : 'raw_pct',
      value,
      ruleIndex,
      s1Raw,
      s1Count: eligibleS1.length,
      calibratedShare,
    },
  };
}

/**
 * Calibrates Rasch 1PL difficulty parameter `b` from item responses,
 * strictly excluding any response carrying `isMistakeRetry: true` or `excludeFromIrt: true`.
 */
export function calibrateItemDifficultyB(
  responses: Array<{
    isCorrect: boolean;
    theta?: number;
    isMistakeRetry?: boolean;
    excludeFromIrt?: boolean;
  }>,
  fallbackB = 0
): { b: number; calibratedSampleSize: number; calibrated: boolean } {
  const clean = responses.filter((r) => !r.isMistakeRetry && !r.excludeFromIrt);
  const n = clean.length;
  if (n === 0) {
    return { b: fallbackB, calibratedSampleSize: 0, calibrated: false };
  }
  const correctCount = clean.filter((r) => r.isCorrect).length;
  // Laplace-smoothed proportion to avoid +/- Infinity on all-correct or all-wrong
  const p = (correctCount + 0.5) / (n + 1);
  const meanTheta =
    clean.reduce((acc, r) => acc + (r.theta ?? 0), 0) / n;
  // Rasch log-odds difficulty: b = mean(theta) - ln(p / (1 - p))
  const rawB = meanTheta - Math.log(p / (1 - p));
  const clampedB = Number(Math.max(-3.5, Math.min(3.5, rawB)).toFixed(4));
  return {
    b: clampedB,
    calibratedSampleSize: n,
    calibrated: n >= 30,
  };
}

/**
 * Maps internal tier to official learner-facing terminology (docs/07 §4.1).
 * Never exposes 'low/medium/high' directly to the student.
 */
export function tierToLearnerLabel(tier: Tier): string {
  switch (tier) {
    case 'low':
      return 'Easier second section';
    case 'medium':
      return 'Standard second section';
    case 'high':
      return 'Harder second section';
  }
}
