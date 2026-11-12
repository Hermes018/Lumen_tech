/** @purpose Free Spaced Repetition Scheduler (FSRS v4.5) DSR active-recall algorithm */

export type FSRSState = 'new' | 'learning' | 'review' | 'relearning';

export type FSRSRating = 1 | 2 | 3 | 4;

export const FSRSRating = {
  Again: 1 as const,
  Hard: 2 as const,
  Good: 3 as const,
  Easy: 4 as const,
};

export interface CardState {
  stability: number;
  difficulty: number;
  reps: number;
  lapses: number;
  state: FSRSState;
  elapsedDays?: number;
  scheduledDays?: number;
  dueAt?: Date | string;
  lastReviewAt?: Date | string | null;
}

export interface FSRSOptions {
  desiredRetention?: number; // default: 0.90
  maximumInterval?: number; // default: 180 days
  now?: Date;
  weights?: number[];
}

export interface SchedulingResult {
  card: {
    stability: number;
    difficulty: number;
    reps: number;
    lapses: number;
    state: FSRSState;
    elapsedDays: number;
    scheduledDays: number;
    dueAt: Date;
    lastReviewAt: Date;
  };
  intervalDays: number;
  intervalLabel: string;
  rating: FSRSRating;
}

/** Standard FSRS v4.5 17-parameter default weights */
export const DEFAULT_FSRS_WEIGHTS: readonly number[] = [
  0.4072, 1.1829, 3.1262, 15.4722, // w[0..3]: initial stability for Again, Hard, Good, Easy
  7.2102, 0.5316, // w[4..5]: initial difficulty parameters
  1.0651, 0.0234, // w[6..7]: difficulty update step & mean reversion
  1.616, 0.1544, 1.0824, // w[8..10]: recall stability growth
  1.9813, 0.0953, 0.2975, 2.2042, // w[11..14]: lapse stability decline
  0.2407, 2.9466, // w[15..16]: hard penalty & easy bonus
];

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

function calculateInitialDifficulty(rating: FSRSRating, w: readonly number[]): number {
  const w4 = w[4] ?? 7.2102;
  const w5 = w[5] ?? 0.5316;
  const d0 = w4 - Math.exp(w5 * (rating - 1)) + 1;
  return clamp(d0, 1, 10);
}

function calculateInitialStability(rating: FSRSRating, w: readonly number[]): number {
  const s0 = w[rating - 1] ?? 1.0;
  return Math.max(0.1, s0);
}

export function calculateIntervalFromStability(
  stability: number,
  desiredRetention = 0.9,
  maximumInterval = 180
): number {
  if (stability <= 0) return 0;
  // FSRS formula: interval = (S / factor) * (r^(-1/decay) - 1)
  // Simplified at factor=9, decay=1: interval = 9 * S * (1/r - 1)
  const factor = 9 * ((1 / desiredRetention) - 1);
  const interval = Math.round(stability * factor);
  return clamp(interval, 1, maximumInterval);
}

export function formatIntervalLabel(days: number): string {
  if (days <= 0) return '< 10m';
  if (days === 1) return '1d';
  if (days < 30) return `${days}d`;
  if (days < 365) return `${Math.round(days / 30)}mo`;
  return `${Math.round(days / 365)}y`;
}

/**
 * Calculates the next schedule, stability, and difficulty for a card after a rating.
 */
export function scheduleNextReview(
  card: CardState,
  rating: FSRSRating,
  options: FSRSOptions = {}
): SchedulingResult {
  const desiredRetention = options.desiredRetention ?? 0.9;
  const maximumInterval = options.maximumInterval ?? 180;
  const now = options.now ?? new Date();
  const w = options.weights ?? DEFAULT_FSRS_WEIGHTS;

  const isInitial = card.reps === 0 || card.state === 'new';

  if (isInitial) {
    const stability = calculateInitialStability(rating, w);
    const difficulty = calculateInitialDifficulty(rating, w);

    let scheduledDays = 0;
    let nextState: FSRSState = 'learning';

    if (rating === FSRSRating.Again) {
      scheduledDays = 0;
      nextState = 'learning';
    } else if (rating === FSRSRating.Hard) {
      scheduledDays = 1;
      nextState = 'learning';
    } else {
      scheduledDays = calculateIntervalFromStability(stability, desiredRetention, maximumInterval);
      nextState = 'review';
    }

    const dueAt = new Date(now.getTime() + scheduledDays * 86400000);

    return {
      card: {
        stability: Number(stability.toFixed(4)),
        difficulty: Number(difficulty.toFixed(4)),
        reps: 1,
        lapses: rating === FSRSRating.Again ? 1 : 0,
        state: nextState,
        elapsedDays: 0,
        scheduledDays,
        dueAt,
        lastReviewAt: now,
      },
      intervalDays: scheduledDays,
      intervalLabel: formatIntervalLabel(scheduledDays),
      rating,
    };
  }

  // Subsequent review
  const lastReviewTime = card.lastReviewAt ? new Date(card.lastReviewAt).getTime() : now.getTime();
  const elapsedDays = Math.max(0, Math.floor((now.getTime() - lastReviewTime) / 86400000));

  // Retrievability R(t, S) = (1 + t / (9 * S))^-1
  const prevStability = Math.max(0.1, card.stability);
  const retrievability = clamp(Math.pow(1 + elapsedDays / (9 * prevStability), -1), 0.01, 1.0);

  // Difficulty update: D' = w[7]*D0(3) + (1-w[7])*(D + deltaD)
  const d0Good = calculateInitialDifficulty(FSRSRating.Good, w);
  const deltaD = -(w[6] ?? 1.0651) * (rating - 3);
  const meanReversion = w[7] ?? 0.0234;
  const nextDifficulty = clamp(
    meanReversion * d0Good + (1 - meanReversion) * (card.difficulty + deltaD),
    1,
    10
  );

  let nextStability = prevStability;
  let nextState: FSRSState = card.state;
  let lapses = card.lapses;
  let scheduledDays = 1;

  if (rating === FSRSRating.Again) {
    // Lapse (forgetting)
    const w11 = w[11] ?? 1.9813;
    const w12 = w[12] ?? 0.0953;
    const w13 = w[13] ?? 0.2975;
    const w14 = w[14] ?? 2.2042;

    const lapseStability =
      w11 *
      Math.pow(card.difficulty, -w12) *
      (Math.pow(prevStability + 1, w13) - 1) *
      Math.exp(w14 * (1 - retrievability));

    nextStability = clamp(lapseStability, 0.1, prevStability);
    nextState = 'relearning';
    lapses += 1;
    scheduledDays = 0; // immediate review queue
  } else {
    // Recall: Hard, Good, Easy
    const w8 = w[8] ?? 1.616;
    const w9 = w[9] ?? 0.1544;
    const w10 = w[10] ?? 1.0824;
    const hardPenalty = rating === FSRSRating.Hard ? (w[15] ?? 0.2407) : 1.0;
    const easyBonus = rating === FSRSRating.Easy ? (w[16] ?? 2.9466) : 1.0;

    const stabilityGrowth =
      1 +
      Math.exp(w8) *
        (11 - card.difficulty) *
        Math.pow(prevStability, -w9) *
        (Math.exp(w10 * (1 - retrievability)) - 1) *
        hardPenalty *
        easyBonus;

    nextStability = Math.max(0.1, prevStability * stabilityGrowth);
    nextState = 'review';

    let interval = calculateIntervalFromStability(nextStability, desiredRetention, maximumInterval);
    if (rating === FSRSRating.Hard) {
      interval = Math.min(interval, Math.max(1, Math.round(elapsedDays * 1.2)));
    } else if (rating === FSRSRating.Easy) {
      interval = clamp(Math.round(interval * 1.3), 1, maximumInterval);
    }
    scheduledDays = clamp(interval, 1, maximumInterval);
  }

  const dueAt = new Date(now.getTime() + scheduledDays * 86400000);

  return {
    card: {
      stability: Number(nextStability.toFixed(4)),
      difficulty: Number(nextDifficulty.toFixed(4)),
      reps: card.reps + 1,
      lapses,
      state: nextState,
      elapsedDays,
      scheduledDays,
      dueAt,
      lastReviewAt: now,
    },
    intervalDays: scheduledDays,
    intervalLabel: formatIntervalLabel(scheduledDays),
    rating,
  };
}

/**
 * Previews the next interval and card updates for all 4 rating choices.
 */
export function previewAllRatings(
  card: CardState,
  options: FSRSOptions = {}
): Record<FSRSRating, SchedulingResult> {
  return {
    [FSRSRating.Again]: scheduleNextReview(card, FSRSRating.Again, options),
    [FSRSRating.Hard]: scheduleNextReview(card, FSRSRating.Hard, options),
    [FSRSRating.Good]: scheduleNextReview(card, FSRSRating.Good, options),
    [FSRSRating.Easy]: scheduleNextReview(card, FSRSRating.Easy, options),
  };
}

/**
 * Leech detector: flags cards with excessive lapses (default >= 8 lapses).
 */
export function isLeech(card: CardState, threshold = 8): boolean {
  return card.lapses >= threshold;
}
