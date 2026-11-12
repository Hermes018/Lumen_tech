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

  const s1Raw = s1.filter((i) => i.correct).length;
  const calibratedShare = s1.length > 0 ? s1.filter((i) => i.calibrated).length / s1.length : 0;
  const useTheta = Boolean(rule.theta && calibratedShare >= rule.theta.minCalibratedShare);

  const value = useTheta ? eapTheta(s1).theta : s1Raw / Math.max(1, s1.length);
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
      s1Count: s1.length,
      calibratedShare,
    },
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
