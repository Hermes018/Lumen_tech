/** @purpose State reducers and domain logic for interactive GRE practice sessions */

export type PracticeMode = 'tutor' | 'timed';

export type ErrorTag =
  | 'concept_gap'
  | 'vocab_gap'
  | 'careless_math'
  | 'misread_prompt'
  | 'time_pressure';

export interface SocraticSessionState {
  active: boolean;
  currentStepIndex: number;
  completedStepIndices: number[];
  isCompleted: boolean;
}

export interface QuestionSessionState {
  questionId: string;
  hintsUsedCount: number; // 0, 1, 2, or 3
  revealedHintTiers: number[]; // e.g. [1], [1, 2], [1, 2, 3]
  userAnswers: string[];
  isCorrect: boolean | null;
  attemptCount: number;
  secondChanceAvailable: boolean;
  secondChanceUsed: boolean;
  masteryWeight: number; // 1.0 (100%), 0.85 (85%), 0.65 (65%), 0.40 (40%), 0.0 (incorrect)
  socratic: SocraticSessionState;
  errorTag: ErrorTag | null;
  errorNotes?: string;
  predictFirst: {
    enabled: boolean;
    predictionText: string;
    choicesRevealed: boolean;
  };
  status: 'unanswered' | 'second_chance' | 'submitted' | 'reviewed';
}

export interface PracticeSessionState {
  id: string;
  userId: string;
  mode: PracticeMode;
  hintBudgetRemaining: number;
  totalHintsBudget: number;
  currentQuestionIndex: number;
  questions: QuestionSessionState[];
  isFinished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePracticeSessionParams {
  id: string;
  userId: string;
  mode?: PracticeMode;
  questionIds: string[];
  hintBudget?: number;
  now?: Date;
}

/**
 * Initializes a new practice session with the given questions.
 */
export function createPracticeSession(params: CreatePracticeSessionParams): PracticeSessionState {
  const mode = params.mode ?? 'tutor';
  const defaultBudget = mode === 'tutor' ? Math.max(5, params.questionIds.length * 2) : 3;
  const hintBudget = params.hintBudget ?? defaultBudget;
  const nowIso = (params.now ?? new Date()).toISOString();

  const questions: QuestionSessionState[] = params.questionIds.map((qid) => ({
    questionId: qid,
    hintsUsedCount: 0,
    revealedHintTiers: [],
    userAnswers: [],
    isCorrect: null,
    attemptCount: 0,
    secondChanceAvailable: false,
    secondChanceUsed: false,
    masteryWeight: 0,
    socratic: {
      active: false,
      currentStepIndex: 0,
      completedStepIndices: [],
      isCompleted: false,
    },
    errorTag: null,
    predictFirst: {
      enabled: false,
      predictionText: '',
      choicesRevealed: true,
    },
    status: 'unanswered',
  }));

  return {
    id: params.id,
    userId: params.userId,
    mode,
    hintBudgetRemaining: hintBudget,
    totalHintsBudget: hintBudget,
    currentQuestionIndex: 0,
    questions,
    isFinished: false,
    createdAt: nowIso,
    updatedAt: nowIso,
  };
}

/**
 * Calculates mastery weight based on the number of hints used.
 * 0 hints = 100% (1.0), 1 hint = 85% (0.85), 2 hints = 65% (0.65), 3 hints = 40% (0.40)
 */
export function calculateMasteryWeight(hintsUsedCount: number): number {
  switch (hintsUsedCount) {
    case 0:
      return 1.0;
    case 1:
      return 0.85;
    case 2:
      return 0.65;
    case 3:
    default:
      return 0.40;
  }
}

/**
 * Uses the next progressive hint for a question.
 * Deducts 1 point from session hint_budget_remaining and increments question hints_used_count.
 */
export function useHint(
  session: PracticeSessionState,
  questionId: string,
  now = new Date()
): PracticeSessionState {
  const qIndex = session.questions.findIndex((q) => q.questionId === questionId);
  if (qIndex === -1) {
    throw new Error(`Question ${questionId} not found in session`);
  }

  const currentQ = session.questions[qIndex]!;
  if (currentQ.hintsUsedCount >= 3) {
    return session; // Max 3 tiers of hints, already revealed
  }

  if (session.hintBudgetRemaining <= 0) {
    throw new Error('Hint budget exhausted');
  }

  const nextTier = currentQ.hintsUsedCount + 1;
  const updatedQuestions = [...session.questions];
  updatedQuestions[qIndex] = {
    ...currentQ,
    hintsUsedCount: nextTier,
    revealedHintTiers: [...currentQ.revealedHintTiers, nextTier],
  };

  return {
    ...session,
    hintBudgetRemaining: session.hintBudgetRemaining - 1,
    questions: updatedQuestions,
    updatedAt: now.toISOString(),
  };
}

/**
 * Checks whether user submission matches correct answers.
 */
export function checkAnswerCorrectness(
  choice: string | string[],
  correctAnswers: string[]
): boolean {
  const submitted = Array.isArray(choice) ? choice.map((c) => c.trim()) : [choice.trim()];
  const canonical = correctAnswers.map((c) => c.trim());

  if (submitted.length !== canonical.length) {
    return false;
  }

  const sortedSubmitted = [...submitted].sort();
  const sortedCanonical = [...canonical].sort();

  return sortedSubmitted.every((val, idx) => val.toLowerCase() === sortedCanonical[idx]?.toLowerCase());
}

/**
 * Submits an answer for a question in the practice session.
 * - Evaluates correctness.
 * - If correct: assigns mastery_weight based on hints used (100%, 85%, 65%, 40%).
 * - If incorrect in Tutor Mode on first attempt: enables second_chance_available.
 */
export function submitAnswer(
  session: PracticeSessionState,
  questionId: string,
  choice: string | string[],
  correctAnswers: string[],
  now = new Date()
): PracticeSessionState {
  const qIndex = session.questions.findIndex((q) => q.questionId === questionId);
  if (qIndex === -1) {
    throw new Error(`Question ${questionId} not found in session`);
  }

  const currentQ = session.questions[qIndex]!;
  const submittedChoices = Array.isArray(choice) ? choice : [choice];
  const isCorrect = checkAnswerCorrectness(choice, correctAnswers);
  const isFirstAttempt = currentQ.attemptCount === 0;

  const updatedQuestions = [...session.questions];

  if (isCorrect) {
    const weight = calculateMasteryWeight(currentQ.hintsUsedCount);
    updatedQuestions[qIndex] = {
      ...currentQ,
      userAnswers: submittedChoices,
      isCorrect: true,
      attemptCount: currentQ.attemptCount + 1,
      secondChanceAvailable: false,
      masteryWeight: weight,
      status: 'submitted',
    };
  } else {
    // Incorrect answer
    const canOfferSecondChance =
      session.mode === 'tutor' && isFirstAttempt && !currentQ.secondChanceUsed;

    if (canOfferSecondChance) {
      updatedQuestions[qIndex] = {
        ...currentQ,
        userAnswers: submittedChoices,
        isCorrect: false,
        attemptCount: currentQ.attemptCount + 1,
        secondChanceAvailable: true,
        secondChanceUsed: true,
        masteryWeight: 0,
        status: 'second_chance',
      };
    } else {
      updatedQuestions[qIndex] = {
        ...currentQ,
        userAnswers: submittedChoices,
        isCorrect: false,
        attemptCount: currentQ.attemptCount + 1,
        secondChanceAvailable: false,
        masteryWeight: 0,
        status: 'submitted',
      };
    }
  }

  return {
    ...session,
    questions: updatedQuestions,
    updatedAt: now.toISOString(),
  };
}

/**
 * Advances a step in the Socratic "Walk Me Through It" micro-step interactive solver.
 */
export function advanceSocraticStep(
  session: PracticeSessionState,
  questionId: string,
  stepIndex: number,
  selectedOptionIndex?: number,
  correctOptionIndex?: number,
  totalSteps = 3,
  now = new Date()
): PracticeSessionState {
  const qIndex = session.questions.findIndex((q) => q.questionId === questionId);
  if (qIndex === -1) {
    throw new Error(`Question ${questionId} not found in session`);
  }

  const currentQ = session.questions[qIndex]!;
  const socratic = currentQ.socratic;

  // If validation is required against a correct mini-option
  if (
    selectedOptionIndex !== undefined &&
    correctOptionIndex !== undefined &&
    selectedOptionIndex !== correctOptionIndex
  ) {
    // Wrong option selected for this micro-step, do not advance
    return session;
  }

  const completedSteps = socratic.completedStepIndices.includes(stepIndex)
    ? socratic.completedStepIndices
    : [...socratic.completedStepIndices, stepIndex];

  const nextIndex = Math.min(stepIndex + 1, totalSteps);
  const isFinished = completedSteps.length >= totalSteps || nextIndex >= totalSteps;

  const updatedQuestions = [...session.questions];
  updatedQuestions[qIndex] = {
    ...currentQ,
    socratic: {
      active: true,
      currentStepIndex: nextIndex,
      completedStepIndices: completedSteps,
      isCompleted: isFinished,
    },
  };

  return {
    ...session,
    questions: updatedQuestions,
    updatedAt: now.toISOString(),
  };
}

/**
 * Activates or deactivates Socratic walkthrough mode for a question.
 */
export function toggleSocraticMode(
  session: PracticeSessionState,
  questionId: string,
  active: boolean,
  now = new Date()
): PracticeSessionState {
  const qIndex = session.questions.findIndex((q) => q.questionId === questionId);
  if (qIndex === -1) {
    throw new Error(`Question ${questionId} not found in session`);
  }

  const currentQ = session.questions[qIndex]!;
  const updatedQuestions = [...session.questions];
  updatedQuestions[qIndex] = {
    ...currentQ,
    socratic: {
      ...currentQ.socratic,
      active,
    },
  };

  return {
    ...session,
    questions: updatedQuestions,
    updatedAt: now.toISOString(),
  };
}

/**
 * Configures the GregMat-style Predict First mode for Text Completion/Sentence Equivalence.
 */
export function updatePredictFirst(
  session: PracticeSessionState,
  questionId: string,
  predictionText: string,
  choicesRevealed: boolean,
  now = new Date()
): PracticeSessionState {
  const qIndex = session.questions.findIndex((q) => q.questionId === questionId);
  if (qIndex === -1) {
    throw new Error(`Question ${questionId} not found in session`);
  }

  const currentQ = session.questions[qIndex]!;
  const updatedQuestions = [...session.questions];
  updatedQuestions[qIndex] = {
    ...currentQ,
    predictFirst: {
      enabled: true,
      predictionText,
      choicesRevealed,
    },
  };

  return {
    ...session,
    questions: updatedQuestions,
    updatedAt: now.toISOString(),
  };
}

/**
 * Tags an error category and optional note on a missed question for the Error Log Spaced Retry queue.
 */
export function tagErrorLog(
  session: PracticeSessionState,
  questionId: string,
  errorTag: ErrorTag,
  errorNotes?: string,
  now = new Date()
): PracticeSessionState {
  const qIndex = session.questions.findIndex((q) => q.questionId === questionId);
  if (qIndex === -1) {
    throw new Error(`Question ${questionId} not found in session`);
  }

  const currentQ = session.questions[qIndex]!;
  const updatedQuestions = [...session.questions];
  updatedQuestions[qIndex] = {
    ...currentQ,
    errorTag,
    errorNotes,
  };

  return {
    ...session,
    questions: updatedQuestions,
    updatedAt: now.toISOString(),
  };
}

/**
 * Calculates the next retry date based on the spaced interval stage:
 * Stage 1: 1 day, Stage 2: 3 days, Stage 3: 7 days, Stage 4: 21 days
 */
export function calculateErrorRetryDate(stage: number, baseDate = new Date()): Date {
  const daysByStage: Record<number, number> = {
    1: 1,
    2: 3,
    3: 7,
    4: 21,
  };
  const days = daysByStage[stage] ?? 1;
  return new Date(baseDate.getTime() + days * 86400000);
}
