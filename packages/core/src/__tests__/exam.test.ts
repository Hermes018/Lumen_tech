/** @purpose Unit tests for GRE practice session state reducers and FSRS spaced repetition algorithms */

import { describe, it, expect } from 'vitest';
import {
  FSRSRating,
  scheduleNextReview,
  previewAllRatings,
  isLeech,
  calculateIntervalFromStability,
  formatIntervalLabel,
} from '../fsrs/scheduler';
import {
  createPracticeSession,
  useHint,
  submitAnswer,
  advanceSocraticStep,
  toggleSocraticMode,
  updatePredictFirst,
  tagErrorLog,
  calculateMasteryWeight,
  calculateErrorRetryDate,
} from '../exam/practice';

describe('FSRS v4.5 Active-Recall Math', () => {
  it('schedules initial review correctly for all 4 ratings', () => {
    const newCard = {
      stability: 0,
      difficulty: 0,
      reps: 0,
      lapses: 0,
      state: 'new' as const,
    };

    const resAgain = scheduleNextReview(newCard, FSRSRating.Again);
    expect(resAgain.card.state).toBe('learning');
    expect(resAgain.card.stability).toBeCloseTo(0.4072, 3);
    expect(resAgain.card.lapses).toBe(1);
    expect(resAgain.card.scheduledDays).toBe(0);

    const resHard = scheduleNextReview(newCard, FSRSRating.Hard);
    expect(resHard.card.state).toBe('learning');
    expect(resHard.card.scheduledDays).toBe(1);

    const resGood = scheduleNextReview(newCard, FSRSRating.Good);
    expect(resGood.card.state).toBe('review');
    expect(resGood.card.stability).toBeCloseTo(3.1262, 3);
    expect(resGood.card.scheduledDays).toBeGreaterThanOrEqual(2);

    const resEasy = scheduleNextReview(newCard, FSRSRating.Easy);
    expect(resEasy.card.state).toBe('review');
    expect(resEasy.card.stability).toBeCloseTo(15.4722, 3);
    expect(resEasy.card.scheduledDays).toBeGreaterThanOrEqual(10);
  });

  it('grows stability on successful recall and decreases on lapse', () => {
    const cardInReview = {
      stability: 3.5,
      difficulty: 5.0,
      reps: 2,
      lapses: 0,
      state: 'review' as const,
      lastReviewAt: new Date(Date.now() - 3 * 86400000).toISOString(),
    };

    // Review Good
    const reviewGood = scheduleNextReview(cardInReview, FSRSRating.Good);
    expect(reviewGood.card.stability).toBeGreaterThan(cardInReview.stability);
    expect(reviewGood.card.reps).toBe(3);
    expect(reviewGood.card.lapses).toBe(0);

    // Review Again (lapse)
    const reviewLapse = scheduleNextReview(cardInReview, FSRSRating.Again);
    expect(reviewLapse.card.state).toBe('relearning');
    expect(reviewLapse.card.lapses).toBe(1);
    expect(reviewLapse.card.stability).toBeLessThanOrEqual(cardInReview.stability);
    expect(reviewLapse.card.scheduledDays).toBe(0);
  });

  it('previews intervals accurately for all 4 ratings', () => {
    const card = {
      stability: 4.0,
      difficulty: 4.5,
      reps: 3,
      lapses: 0,
      state: 'review' as const,
      lastReviewAt: new Date(Date.now() - 4 * 86400000).toISOString(),
    };

    const preview = previewAllRatings(card);
    expect(preview[FSRSRating.Again].intervalDays).toBe(0);
    expect(preview[FSRSRating.Hard].intervalDays).toBeLessThanOrEqual(preview[FSRSRating.Good].intervalDays);
    expect(preview[FSRSRating.Good].intervalDays).toBeLessThanOrEqual(preview[FSRSRating.Easy].intervalDays);
  });

  it('detects leech cards when lapses reach threshold', () => {
    const normalCard = { stability: 2, difficulty: 6, reps: 5, lapses: 3, state: 'review' as const };
    const leechCard = { stability: 0.5, difficulty: 9, reps: 12, lapses: 8, state: 'review' as const };

    expect(isLeech(normalCard)).toBe(false);
    expect(isLeech(leechCard)).toBe(true);
  });

  it('formats human-readable interval labels properly', () => {
    expect(calculateIntervalFromStability(0)).toBe(0);
    expect(calculateIntervalFromStability(3.0, 0.9)).toBe(3);
    expect(formatIntervalLabel(0)).toBe('< 10m');
    expect(formatIntervalLabel(1)).toBe('1d');
    expect(formatIntervalLabel(6)).toBe('6d');
    expect(formatIntervalLabel(60)).toBe('2mo');
  });
});

describe('Interactive Practice Session State Reducers', () => {
  const sampleQIds = ['gre-q-01', 'gre-q-02'];

  it('initializes a practice session with expected defaults', () => {
    const session = createPracticeSession({
      id: 'sess-123',
      userId: 'user-456',
      mode: 'tutor',
      questionIds: sampleQIds,
      hintBudget: 5,
    });

    expect(session.id).toBe('sess-123');
    expect(session.mode).toBe('tutor');
    expect(session.hintBudgetRemaining).toBe(5);
    expect(session.questions).toHaveLength(2);
    expect(session.questions[0]?.hintsUsedCount).toBe(0);
    expect(session.questions[0]?.status).toBe('unanswered');
  });

  it('uses hints progressively and deducts budget correctly', () => {
    let session = createPracticeSession({
      id: 'sess-123',
      userId: 'user-456',
      mode: 'tutor',
      questionIds: sampleQIds,
      hintBudget: 3,
    });

    // Reveal Hint 1
    session = useHint(session, 'gre-q-01');
    expect(session.hintBudgetRemaining).toBe(2);
    expect(session.questions[0]?.hintsUsedCount).toBe(1);
    expect(session.questions[0]?.revealedHintTiers).toEqual([1]);

    // Reveal Hint 2
    session = useHint(session, 'gre-q-01');
    expect(session.hintBudgetRemaining).toBe(1);
    expect(session.questions[0]?.hintsUsedCount).toBe(2);
    expect(session.questions[0]?.revealedHintTiers).toEqual([1, 2]);

    // Reveal Hint 3
    session = useHint(session, 'gre-q-01');
    expect(session.hintBudgetRemaining).toBe(0);
    expect(session.questions[0]?.hintsUsedCount).toBe(3);

    // Further hint does not deduct beyond 3
    session = useHint(session, 'gre-q-01');
    expect(session.questions[0]?.hintsUsedCount).toBe(3);

    // Trying to use hint when budget is 0 on another question throws
    expect(() => useHint(session, 'gre-q-02')).toThrow('Hint budget exhausted');
  });

  it('calculates mastery weight based on hints used', () => {
    expect(calculateMasteryWeight(0)).toBe(1.0);
    expect(calculateMasteryWeight(1)).toBe(0.85);
    expect(calculateMasteryWeight(2)).toBe(0.65);
    expect(calculateMasteryWeight(3)).toBe(0.40);
  });

  it('evaluates answers and triggers Second Chance in Tutor Mode on first incorrect submit', () => {
    let session = createPracticeSession({
      id: 'sess-123',
      userId: 'user-456',
      mode: 'tutor',
      questionIds: ['gre-q-01'],
      hintBudget: 5,
    });

    // Submit wrong choice 'A' (correct is 'D')
    session = submitAnswer(session, 'gre-q-01', 'A', ['D']);
    const q1 = session.questions[0]!;
    expect(q1.isCorrect).toBe(false);
    expect(q1.secondChanceAvailable).toBe(true);
    expect(q1.secondChanceUsed).toBe(true);
    expect(q1.attemptCount).toBe(1);
    expect(q1.status).toBe('second_chance');

    // Second chance retry with correct choice 'D'
    session = submitAnswer(session, 'gre-q-01', 'D', ['D']);
    const q1Retried = session.questions[0]!;
    expect(q1Retried.isCorrect).toBe(true);
    expect(q1Retried.secondChanceAvailable).toBe(false);
    expect(q1Retried.attemptCount).toBe(2);
    expect(q1Retried.masteryWeight).toBe(1.0); // 0 hints used
    expect(q1Retried.status).toBe('submitted');
  });

  it('handles assisted solve with hints and mastery scaling', () => {
    let session = createPracticeSession({
      id: 'sess-123',
      userId: 'user-456',
      mode: 'tutor',
      questionIds: ['gre-q-01'],
      hintBudget: 5,
    });

    session = useHint(session, 'gre-q-01');
    session = useHint(session, 'gre-q-01'); // 2 hints used
    session = submitAnswer(session, 'gre-q-01', 'D', ['D']);

    const q = session.questions[0]!;
    expect(q.isCorrect).toBe(true);
    expect(q.masteryWeight).toBe(0.65); // 65% mastery
  });

  it('does not offer second chance in timed mode', () => {
    let session = createPracticeSession({
      id: 'sess-timed',
      userId: 'user-456',
      mode: 'timed',
      questionIds: ['gre-q-01'],
      hintBudget: 3,
    });

    session = submitAnswer(session, 'gre-q-01', 'A', ['D']);
    const q = session.questions[0]!;
    expect(q.isCorrect).toBe(false);
    expect(q.secondChanceAvailable).toBe(false);
    expect(q.status).toBe('submitted');
  });

  it('advances Socratic micro-steps when answered correctly', () => {
    let session = createPracticeSession({
      id: 'sess-123',
      userId: 'user-456',
      mode: 'tutor',
      questionIds: ['gre-q-01'],
    });

    session = toggleSocraticMode(session, 'gre-q-01', true);
    expect(session.questions[0]?.socratic.active).toBe(true);

    // Wrong micro-choice -> does not advance
    session = advanceSocraticStep(session, 'gre-q-01', 0, 1, 0, 3);
    expect(session.questions[0]?.socratic.currentStepIndex).toBe(0);

    // Correct micro-choice -> advances to step 1
    session = advanceSocraticStep(session, 'gre-q-01', 0, 0, 0, 3);
    expect(session.questions[0]?.socratic.currentStepIndex).toBe(1);
    expect(session.questions[0]?.socratic.completedStepIndices).toContain(0);

    // Advance step 1 and step 2
    session = advanceSocraticStep(session, 'gre-q-01', 1, 2, 2, 3);
    session = advanceSocraticStep(session, 'gre-q-01', 2, 1, 1, 3);
    expect(session.questions[0]?.socratic.isCompleted).toBe(true);
  });

  it('tags error logs and calculates spaced retry intervals', () => {
    let session = createPracticeSession({
      id: 'sess-123',
      userId: 'user-456',
      mode: 'tutor',
      questionIds: ['gre-q-01'],
    });

    session = tagErrorLog(session, 'gre-q-01', 'careless_math', 'Forgot to check x = -4');
    expect(session.questions[0]?.errorTag).toBe('careless_math');
    expect(session.questions[0]?.errorNotes).toBe('Forgot to check x = -4');

    const base = new Date('2026-11-12T00:00:00Z');
    const stage1 = calculateErrorRetryDate(1, base);
    expect(stage1.getTime() - base.getTime()).toBe(1 * 86400000);

    const stage2 = calculateErrorRetryDate(2, base);
    expect(stage2.getTime() - base.getTime()).toBe(3 * 86400000);

    const stage4 = calculateErrorRetryDate(4, base);
    expect(stage4.getTime() - base.getTime()).toBe(21 * 86400000);
  });

  it('handles Predict First configuration updates', () => {
    let session = createPracticeSession({
      id: 'sess-123',
      userId: 'user-456',
      mode: 'tutor',
      questionIds: ['gre-q-01'],
    });

    session = updatePredictFirst(session, 'gre-q-01', 'cautious / prudent', false);
    const pf = session.questions[0]?.predictFirst;
    expect(pf?.enabled).toBe(true);
    expect(pf?.predictionText).toBe('cautious / prudent');
    expect(pf?.choicesRevealed).toBe(false);
  });
});
