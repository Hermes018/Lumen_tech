/** @purpose Rasch 1PL EAP ability estimation and GRE 130-170 scaled score calculation */

export interface ScaledConfig {
  mean: number;
  sd: number;
  min: 130;
  max: 170;
  version: string;
}

/**
 * Placeholder population parameters (verify against ETS score-use data).
 * Linked to real scores later via self-reported official scores (docs/07 §3.3.5).
 */
export const GRE_SCALE: Record<'verbal' | 'quant', ScaledConfig> = {
  verbal: { mean: 150, sd: 8.5, min: 130, max: 170, version: 'placeholder-1' },
  quant: { mean: 154, sd: 9.5, min: 130, max: 170, version: 'placeholder-1' },
};

export interface ScoredItem {
  b: number; // Rasch difficulty parameter (logits)
  correct: boolean;
}

export interface ThetaEstimate {
  theta: number;
  sem: number;
  n: number;
}

export interface ScaledScoreResult {
  scaled: number;
  low: number;
  high: number;
  seScaled: number;
}

const GRID: number[] = Array.from({ length: 81 }, (_, i) => -4 + i * 0.1);
const p1 = (theta: number, b: number): number => 1 / (1 + Math.exp(-(theta - b)));

/**
 * Expected A Posteriori (EAP) ability estimate under the Rasch model with a N(mu, sd) prior.
 * Pure, deterministic, monotone in the number correct for fixed items.
 * Formulated in docs/07 §3.3.6.
 */
export function eapTheta(items: ScoredItem[], prior = { mu: 0, sd: 1 }): ThetaEstimate {
  let wSum = 0;
  let tSum = 0;

  const w: number[] = GRID.map((t) => {
    let ll = -0.5 * ((t - prior.mu) / prior.sd) ** 2;
    for (const it of items) {
      const prob = p1(t, it.b);
      ll += Math.log(it.correct ? prob : 1 - prob);
    }
    return Math.exp(ll);
  });

  w.forEach((wi, i) => {
    wSum += wi;
    tSum += wi * (GRID[i] ?? 0);
  });

  const theta = wSum === 0 ? prior.mu : tSum / wSum;
  let v = 0;
  w.forEach((wi, i) => {
    v += wi * ((GRID[i] ?? 0) - theta) ** 2;
  });

  return {
    theta,
    sem: wSum === 0 ? prior.sd : Math.sqrt(v / wSum),
    n: items.length,
  };
}

/**
 * Maps ability theta to 130-170 scaled score with standard error bounds.
 */
export function thetaToScaled(est: ThetaEstimate, cfg: ScaledConfig): ScaledScoreResult {
  const clamp = (x: number): number => Math.min(cfg.max, Math.max(cfg.min, Math.round(x)));
  const centre = cfg.mean + cfg.sd * est.theta;
  const se = cfg.sd * est.sem;

  return {
    scaled: clamp(centre),
    low: clamp(centre - se),
    high: clamp(centre + se),
    seScaled: se,
  };
}

/**
 * Prior difficulty from author's 1-5 rating until the item is empirically calibrated.
 * Range: -1.2 to +1.2 logits.
 */
export const priorB = (authorDifficulty1to5: number): number => (authorDifficulty1to5 - 3) * 0.6;

/**
 * Calculates complete GRE exam scores for all completed measures.
 */
export function calculateExamScore(
  measures: Array<{ measure: 'verbal' | 'quant'; items: ScoredItem[] }>
): Record<'verbal' | 'quant', { estimate: ThetaEstimate; scaled: ScaledScoreResult }> {
  const results = {} as Record<'verbal' | 'quant', { estimate: ThetaEstimate; scaled: ScaledScoreResult }>;

  for (const { measure, items } of measures) {
    const estimate = eapTheta(items);
    const scaled = thetaToScaled(estimate, GRE_SCALE[measure]);
    results[measure] = { estimate, scaled };
  }

  return results;
}
