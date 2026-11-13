/**
 * @purpose Classical test theory (CTT) item statistics, corrected point-biserial discrimination, distractor analysis, and retirement rules.
 * Implements 07-TEST-ENGINE.md §8.6 (Item statistics and retirement) and 00-DECISIONS.md.
 */

export interface StudentItemResponse {
  studentId: string;
  selectedOption?: string;
  isCorrect: boolean;
  sectionTotalScore: number; // Raw total score for the section including this item
  timeSpentMs?: number;
  isMistakeRetry?: boolean;
  excludeFromIrt?: boolean;
}

export type ItemFlag =
  | 'too_hard'
  | 'too_easy'
  | 'weak_discrimination'
  | 'review_needed'
  | 'key_suspected'
  | 'distractor_beats_key'
  | 'misfit'
  | 'time_outlier'
  | 'over_exposed';

export interface DistractorStat {
  optionId: string;
  count: number;
  selectionRate: number; // 0.0 - 1.0
  pointBiserial: number; // Correlation between selecting this option and total rest score
  isKey: boolean;
}

export interface ItemEvaluationResult {
  flags: ItemFlag[];
  recommendedAction: 'none' | 'warn' | 'review_needed' | 'key_suspected' | 'retire';
  shouldRetire: boolean;
  shouldKeySuspend: boolean;
}

export interface ItemStatistics {
  questionId: string;
  attempts: number;
  correct: number;
  pValue: number; // Proportion correct (0.00 - 1.00)
  pointBiserial: number; // Corrected item-rest correlation (-1.00 to 1.00)
  avgTimeMs: number;
  medianTimeMs: number;
  exposureCount: number;
  exposureRate: number; // Exposure rate relative to pool attempts
  distractorStats: DistractorStat[];
  flags: ItemFlag[];
  recommendedAction: 'none' | 'warn' | 'review_needed' | 'key_suspected' | 'retire';
  newStatus?: 'published' | 'review' | 'key_suspected' | 'retired';
}

export interface ComputeItemStatisticsInput {
  questionId: string;
  responses: StudentItemResponse[];
  correctOptionId: string;
  totalAttempts?: number;
  totalPoolAttempts?: number;
  estTimeSeconds?: number;
  rMax?: number; // Maximum allowable exposure rate (default 0.20 per pool mode)
  infitMs?: number;
  outfitMs?: number;
}

/**
 * Calculates classical p-value (item difficulty / success rate).
 * Higher p-value indicates an easier question; lower indicates a harder question.
 */
export function calculatePValue(
  responses: { isCorrect: boolean; isMistakeRetry?: boolean; excludeFromIrt?: boolean }[]
): number {
  const clean = responses.filter((r) => !r.isMistakeRetry && !r.excludeFromIrt);
  if (clean.length === 0) return 0;
  const correctCount = clean.filter((r) => r.isCorrect).length;
  return Number((correctCount / clean.length).toFixed(4));
}

/**
 * Calculates the corrected item-rest point-biserial discrimination ($r_{pbis}$).
 * Correlates item performance with total section score excluding the item itself.
 * Strictly filters out Mistake Notebook retry attempts (`isMistakeRetry: true`).
 * 
 * Formula:
 *   Y_j = sectionTotalScore_j - (isCorrect ? 1 : 0)
 *   r_{pbis} = ((mean(Y_correct) - mean(Y_incorrect)) / SD(Y)) * sqrt(p * (1 - p))
 */
export function calculatePointBiserial(
  responses: {
    isCorrect: boolean;
    sectionTotalScore: number;
    isMistakeRetry?: boolean;
    excludeFromIrt?: boolean;
  }[]
): number {
  const clean = responses.filter((r) => !r.isMistakeRetry && !r.excludeFromIrt);
  const n = clean.length;
  if (n < 2) return 0;

  let correctCount = 0;
  const restScores: number[] = new Array(n);
  const correctRestScores: number[] = [];
  const incorrectRestScores: number[] = [];

  let sumRest = 0;

  for (let i = 0; i < n; i++) {
    const r = clean[i]!;
    const itemScore = r.isCorrect ? 1 : 0;
    const rest = r.sectionTotalScore - itemScore;
    restScores[i] = rest;
    sumRest += rest;

    if (r.isCorrect) {
      correctCount++;
      correctRestScores.push(rest);
    } else {
      incorrectRestScores.push(rest);
    }
  }

  const p = correctCount / n;
  // If everyone got it right or everyone got it wrong, variance of item is 0 -> correlation is 0
  if (p <= 0 || p >= 1) return 0;

  const meanRest = sumRest / n;

  // Calculate population standard deviation of rest scores
  let sumSqDiff = 0;
  for (let i = 0; i < n; i++) {
    const diff = restScores[i]! - meanRest;
    sumSqDiff += diff * diff;
  }

  const varianceRest = sumSqDiff / n;
  if (varianceRest <= 0) return 0;
  const sdRest = Math.sqrt(varianceRest);

  const meanCorrectRest =
    correctRestScores.reduce((acc, v) => acc + v, 0) / correctRestScores.length;
  const meanIncorrectRest =
    incorrectRestScores.reduce((acc, v) => acc + v, 0) / incorrectRestScores.length;

  const rpbis =
    ((meanCorrectRest - meanIncorrectRest) / sdRest) * Math.sqrt(p * (1 - p));

  // Clamp to valid correlation range [-1.0, 1.0]
  const clamped = Math.max(-1.0, Math.min(1.0, rpbis));
  return Number(clamped.toFixed(4));
}

/**
 * Calculates distractor analysis: selection rates and option-level point-biserial correlations.
 */
export function calculateDistractorStats(
  responses: StudentItemResponse[],
  correctOptionId: string
): DistractorStat[] {
  const clean = responses.filter((r) => !r.isMistakeRetry && !r.excludeFromIrt);
  const n = clean.length;
  if (n === 0) return [];

  // Group responses by option
  const optionMap = new Map<string, StudentItemResponse[]>();
  for (const r of clean) {
    const opt = r.selectedOption || 'omitted';
    const group = optionMap.get(opt) || [];
    group.push(r);
    optionMap.set(opt, group);
  }

  const results: DistractorStat[] = [];

  for (const [optionId, optionResponses] of optionMap.entries()) {
    const count = optionResponses.length;
    const selectionRate = Number((count / n).toFixed(4));
    const isKey = optionId === correctOptionId;

    // Treat choosing this option as 1 and all others as 0
    const optionBiserialResponses = clean.map((r) => ({
      isCorrect: r.selectedOption === optionId,
      sectionTotalScore: r.sectionTotalScore,
    }));

    const pointBiserial = calculatePointBiserial(optionBiserialResponses);

    results.push({
      optionId,
      count,
      selectionRate,
      pointBiserial,
      isKey,
    });
  }

  // Sort: key first, then by frequency descending
  return results.sort((a, b) => {
    if (a.isKey) return -1;
    if (b.isKey) return 1;
    return b.count - a.count;
  });
}

/**
 * Evaluates flagging and retirement rules per 07-TEST-ENGINE.md §8.6.
 * Applied when attempts >= 100 (IRT flags when >= 300).
 */
export function evaluateItemFlags(input: {
  attempts: number;
  pValue: number;
  pointBiserial: number;
  exposureRate: number;
  rMax?: number;
  avgTimeMs?: number;
  estTimeMs?: number;
  distractorStats?: DistractorStat[];
  infitMs?: number;
  outfitMs?: number;
}): ItemEvaluationResult {
  const flags: ItemFlag[] = [];
  const rMax = input.rMax ?? 0.20;

  // Exposure flag can apply at any attempt volume
  if (input.exposureRate > rMax) {
    flags.push('over_exposed');
  }

  // Time outlier check
  if (input.estTimeMs && input.avgTimeMs && input.avgTimeMs > 2 * input.estTimeMs) {
    flags.push('time_outlier');
  }

  // Check if a distractor beats key
  if (input.distractorStats && input.distractorStats.length > 0) {
    const keyStat = input.distractorStats.find((d) => d.isKey);
    const keyRpbis = keyStat?.pointBiserial ?? input.pointBiserial;

    const defectiveDistractor = input.distractorStats.find(
      (d) => !d.isKey && d.pointBiserial > keyRpbis
    );

    if (defectiveDistractor) {
      flags.push('distractor_beats_key');
      flags.push('key_suspected');
    }
  }

  // Rules applied when attempts >= 100
  if (input.attempts >= 100) {
    if (input.pValue < 0.15) {
      flags.push('too_hard');
    } else if (input.pValue > 0.95) {
      flags.push('too_easy');
    }

    if (input.pointBiserial < 0) {
      if (!flags.includes('key_suspected')) {
        flags.push('key_suspected');
      }
    } else if (input.pointBiserial < 0.05) {
      flags.push('review_needed');
    } else if (input.pointBiserial < 0.15) {
      flags.push('weak_discrimination');
    }

    // Rasch infit/outfit mean-square checks (when attempts >= 300)
    if (input.attempts >= 300) {
      if (
        (input.infitMs !== undefined && (input.infitMs < 0.7 || input.infitMs > 1.3)) ||
        (input.outfitMs !== undefined && (input.outfitMs < 0.7 || input.outfitMs > 1.3))
      ) {
        flags.push('misfit');
      }
    }
  }

  // Determine recommended action and status transitions
  let recommendedAction: 'none' | 'warn' | 'review_needed' | 'key_suspected' | 'retire' = 'none';
  let shouldRetire = false;
  let shouldKeySuspend = false;

  // Retirement condition: severe negative discrimination (pointBiserial < -0.10) with sufficient samples
  if (input.attempts >= 100 && input.pointBiserial < -0.10) {
    recommendedAction = 'retire';
    shouldRetire = true;
    shouldKeySuspend = true;
  } else if (flags.includes('key_suspected')) {
    recommendedAction = 'key_suspected';
    shouldKeySuspend = true;
  } else if (flags.includes('review_needed') || flags.includes('misfit')) {
    recommendedAction = 'review_needed';
  } else if (flags.length > 0) {
    recommendedAction = 'warn';
  }

  return {
    flags,
    recommendedAction,
    shouldRetire,
    shouldKeySuspend,
  };
}

/**
 * Computes comprehensive item statistics, distractor distributions, and flags.
 */
export function computeItemStatistics(
  input: ComputeItemStatisticsInput
): ItemStatistics {
  // Strictly exclude Mistake Notebook retry attempts from IRT/CTT item statistics
  const responses = input.responses.filter((r) => !r.isMistakeRetry && !r.excludeFromIrt);
  const attempts =
    input.totalAttempts !== undefined && input.responses.length === responses.length
      ? input.totalAttempts
      : responses.length;
  const correct = responses.filter((r) => r.isCorrect).length;

  const pValue = calculatePValue(responses);
  const pointBiserial = calculatePointBiserial(responses);
  const distractorStats = calculateDistractorStats(responses, input.correctOptionId);

  // Time calculations
  let sumTime = 0;
  let timeCount = 0;
  const times: number[] = [];

  for (const r of responses) {
    if (r.timeSpentMs !== undefined && r.timeSpentMs > 0) {
      sumTime += r.timeSpentMs;
      timeCount++;
      times.push(r.timeSpentMs);
    }
  }

  const avgTimeMs = timeCount > 0 ? Math.round(sumTime / timeCount) : 0;
  times.sort((a, b) => a - b);
  const medianTimeMs =
    times.length > 0 ? (times[Math.floor(times.length / 2)] ?? avgTimeMs) : avgTimeMs;

  const poolAttempts = input.totalPoolAttempts ?? Math.max(1, attempts);
  const exposureRate = Number((attempts / poolAttempts).toFixed(4));

  const evaluation = evaluateItemFlags({
    attempts,
    pValue,
    pointBiserial,
    exposureRate,
    rMax: input.rMax,
    avgTimeMs,
    estTimeMs: input.estTimeSeconds ? input.estTimeSeconds * 1000 : undefined,
    distractorStats,
    infitMs: input.infitMs,
    outfitMs: input.outfitMs,
  });

  let newStatus: 'published' | 'review' | 'key_suspected' | 'retired' | undefined = undefined;
  if (evaluation.shouldRetire) {
    newStatus = 'retired';
  } else if (evaluation.shouldKeySuspend) {
    newStatus = 'key_suspected';
  } else if (evaluation.recommendedAction === 'review_needed') {
    newStatus = 'review';
  }

  return {
    questionId: input.questionId,
    attempts,
    correct,
    pValue,
    pointBiserial,
    avgTimeMs,
    medianTimeMs,
    exposureCount: attempts,
    exposureRate,
    distractorStats,
    flags: evaluation.flags,
    recommendedAction: evaluation.recommendedAction,
    newStatus,
  };
}

export interface BatchItemUpdateSummary {
  questionId: string;
  previousStatus: string;
  newStatus: string;
  action: string;
  reasons: string[];
}

/**
 * Processes a batch of item statistics and executes retirement / flagging transitions.
 */
export function processItemBatchRetirement(
  items: Array<{ questionId: string; currentStatus: string; stats: ItemStatistics }>
): BatchItemUpdateSummary[] {
  const updates: BatchItemUpdateSummary[] = [];

  for (const item of items) {
    const { stats, currentStatus } = item;

    if (stats.newStatus && stats.newStatus !== currentStatus) {
      updates.push({
        questionId: item.questionId,
        previousStatus: currentStatus,
        newStatus: stats.newStatus,
        action: stats.recommendedAction,
        reasons: stats.flags,
      });
    }
  }

  return updates;
}
