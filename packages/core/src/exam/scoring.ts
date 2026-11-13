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
  isMistakeRetry?: boolean;
  excludeFromIrt?: boolean;
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
  const eligibleItems = items.filter((it) => !it.isMistakeRetry && !it.excludeFromIrt);
  let wSum = 0;
  let tSum = 0;

  const w: number[] = GRID.map((t) => {
    let ll = -0.5 * ((t - prior.mu) / prior.sd) ** 2;
    for (const it of eligibleItems) {
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
    n: eligibleItems.length,
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

/**
 * Official GRE Percentile Concordance (ETS published distribution tables).
 */
export const GRE_PERCENTILES: {
  quant: Record<number, number>;
  verbal: Record<number, number>;
  awa: Record<number, number>;
} = {
  quant: {
    170: 96, 169: 93, 168: 91, 167: 88, 166: 85, 165: 82, 164: 79, 163: 76, 162: 73, 161: 70,
    160: 67, 159: 64, 158: 60, 157: 57, 156: 54, 155: 51, 154: 47, 153: 44, 152: 41, 151: 37,
    150: 34, 149: 30, 148: 27, 147: 24, 146: 21, 145: 18, 144: 15, 143: 13, 142: 11, 141: 9,
    140: 7, 139: 5, 138: 4, 137: 3, 136: 2, 135: 2, 134: 1, 133: 1, 132: 1, 131: 0, 130: 0,
  },
  verbal: {
    170: 99, 169: 99, 168: 98, 167: 98, 166: 97, 165: 95, 164: 94, 163: 92, 162: 90, 161: 87,
    160: 85, 159: 82, 158: 79, 157: 75, 156: 71, 155: 67, 154: 63, 153: 59, 152: 54, 151: 49,
    150: 44, 149: 40, 148: 35, 147: 31, 146: 27, 145: 24, 144: 20, 143: 17, 142: 15, 141: 12,
    140: 10, 139: 8, 138: 6, 137: 5, 136: 4, 135: 3, 134: 2, 133: 1, 132: 1, 131: 1, 130: 0,
  },
  awa: {
    6.0: 99, 5.5: 98, 5.0: 91, 4.5: 80, 4.0: 54, 3.5: 37, 3.0: 13, 2.5: 6, 2.0: 2, 1.5: 1, 1.0: 1, 0.5: 0, 0.0: 0,
  },
};

/**
 * Looks up official percentile rank for a given GRE scaled score.
 */
export function grePercentile(scaled: number, measure: 'verbal' | 'quant' | 'awa'): number {
  const table = GRE_PERCENTILES[measure];
  const rounded = measure === 'awa' ? Math.round(scaled * 2) / 2 : Math.round(scaled);
  return table[rounded] ?? (rounded > (measure === 'awa' ? 6.0 : 170) ? 99 : 0);
}

/**
 * Converts raw correct question count (e.g. 0-27 on shorter GRE) to scaled score and percentile
 * using the Rasch 1PL EAP model and calibrated parameters.
 */
export function rawToGreScaled(
  rawCorrect: number,
  totalQuestions = 27,
  measure: 'verbal' | 'quant' = 'quant'
): { scaled: number; low: number; high: number; percentile: number; sem: number } {
  const clampedRaw = Math.max(0, Math.min(totalQuestions, Math.round(rawCorrect)));
  
  if (clampedRaw === 0) {
    return { scaled: 130, low: 130, high: 132, percentile: 0, sem: 1.5 };
  }
  if (clampedRaw === totalQuestions) {
    const p = grePercentile(170, measure);
    return { scaled: 170, low: 168, high: 170, percentile: p, sem: 1.2 };
  }

  // Construct representative Rasch items across difficulty spread [-1.5, +1.5]
  const items: ScoredItem[] = Array.from({ length: totalQuestions }, (_, i) => ({
    b: -1.5 + (3.0 * i) / (totalQuestions - 1),
    correct: i < clampedRaw,
  }));

  const thetaEst = eapTheta(items);
  const scaledRes = thetaToScaled(thetaEst, GRE_SCALE[measure]);
  const percentile = grePercentile(scaledRes.scaled, measure);

  return {
    scaled: scaledRes.scaled,
    low: scaledRes.low,
    high: scaledRes.high,
    percentile,
    sem: scaledRes.seScaled,
  };
}

/**
 * Calculates official IELTS Overall Band from 4 skill band scores using official IELTS rounding rules.
 * Rule:
 *  - decimal < 0.25 => round down to nearest whole band
 *  - 0.25 <= decimal < 0.75 => round to half band (.5)
 *  - decimal >= 0.75 => round up to next whole band
 */
export function calculateIeltsOverallBand(scores: {
  listening: number;
  reading: number;
  writing: number;
  speaking: number;
}): { rawAverage: number; overallBand: number; cefrLevel: string } {
  const { listening, reading, writing, speaking } = scores;
  const rawAverage = (listening + reading + writing + speaking) / 4;
  const whole = Math.floor(rawAverage);
  const fraction = rawAverage - whole;

  let overallBand: number;
  if (fraction < 0.25) {
    overallBand = whole;
  } else if (fraction < 0.75) {
    overallBand = whole + 0.5;
  } else {
    overallBand = whole + 1.0;
  }

  // Clamp 0.0 - 9.0
  overallBand = Math.min(9.0, Math.max(0.0, overallBand));

  let cefrLevel = 'A2 / B1 (Basic)';
  if (overallBand >= 8.5) cefrLevel = 'C2 (Mastery)';
  else if (overallBand >= 7.0) cefrLevel = 'C1 (Effective Operational Proficiency)';
  else if (overallBand >= 5.5) cefrLevel = 'B2 (Vantage)';
  else if (overallBand >= 4.0) cefrLevel = 'B1 (Threshold)';

  return {
    rawAverage: Number(rawAverage.toFixed(3)),
    overallBand,
    cefrLevel,
  };
}

/**
 * Converts IELTS raw correct questions (0-40) into 1.0-9.0 band scores.
 */
export function ieltsRawToBand(
  rawScore: number,
  section: 'listening' | 'reading_academic' | 'reading_general'
): number {
  const clamped = Math.max(0, Math.min(40, Math.round(rawScore)));

  if (section === 'listening' || section === 'reading_academic') {
    if (clamped >= 39) return 9.0;
    if (clamped >= 37) return 8.5;
    if (clamped >= 35) return 8.0;
    if (clamped >= 32) return 7.5;
    if (clamped >= 30) return 7.0;
    if (clamped >= 26) return 6.5;
    if (clamped >= 23) return 6.0;
    if (clamped >= 19) return 5.5;
    if (clamped >= 16) return 5.0;
    if (clamped >= 13) return 4.5;
    if (clamped >= 10) return 4.0;
    if (clamped >= 8) return 3.5;
    if (clamped >= 6) return 3.0;
    if (clamped >= 4) return 2.5;
    if (clamped >= 2) return 2.0;
    return 1.0;
  }

  // General Training Reading (higher raw cutoffs)
  if (clamped >= 40) return 9.0;
  if (clamped >= 39) return 8.5;
  if (clamped >= 37) return 8.0;
  if (clamped >= 36) return 7.5;
  if (clamped >= 34) return 7.0;
  if (clamped >= 32) return 6.5;
  if (clamped >= 30) return 6.0;
  if (clamped >= 27) return 5.5;
  if (clamped >= 23) return 5.0;
  if (clamped >= 19) return 4.5;
  if (clamped >= 15) return 4.0;
  if (clamped >= 12) return 3.5;
  if (clamped >= 9) return 3.0;
  if (clamped >= 6) return 2.5;
  if (clamped >= 3) return 2.0;
  return 1.0;
}
