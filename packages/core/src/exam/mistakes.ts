/** @purpose Mistake Notebook domain service with Open/Resolved states, retry loops, and error taxonomy */

export type MistakeStatus = 'open' | 'resolved';

export type ErrorTaxonomy =
  | 'careless_math'
  | 'vocab_gap'
  | 'concept_gap'
  | 'trap_answer'
  | 'misread_prompt'
  | 'time_pressure';

export interface MistakeEntry {
  id: string;
  userId: string;
  questionId: string;
  sourceAttemptId?: string;
  sourceSessionId?: string;
  subject: 'quant' | 'verbal';
  topicSlug: string;
  questionPrompt: string;
  options?: Array<{ id: string; text: string }>;
  selectedWrongAnswer: string;
  correctAnswers: string[];
  explanationMd?: string;
  errorCategory: ErrorTaxonomy;
  notes?: string;
  status: MistakeStatus;
  attemptsCount: number;
  lastAttemptAt: string;
  resolvedAt?: string;
  /**
   * Invariant: Mistake retries are STRICTLY excluded from the adaptive IRT calibration pool
   * so that practicing errors does not artificially depress the difficulty b parameter.
   */
  excludeFromIrt: true;
  createdAt: string;
  updatedAt: string;
}

export interface MistakeNotebook {
  userId: string;
  entries: Record<string, MistakeEntry>; // keyed by questionId
}

export interface RecordMistakeParams {
  userId: string;
  questionId: string;
  sourceAttemptId?: string;
  sourceSessionId?: string;
  subject: 'quant' | 'verbal';
  topicSlug: string;
  questionPrompt: string;
  options?: Array<{ id: string; text: string }>;
  selectedWrongAnswer: string;
  correctAnswers: string[];
  explanationMd?: string;
  errorCategory: ErrorTaxonomy;
  notes?: string;
  now?: Date;
}

export interface RetryMistakeParams {
  notebook: MistakeNotebook;
  questionId: string;
  userAnswer: string;
  hintsUsed?: number;
  now?: Date;
}

export interface RetryMistakeResult {
  notebook: MistakeNotebook;
  isCorrect: boolean;
  resolved: boolean;
  message: string;
  excludeFromIrt: true;
}

export interface MistakeFilterParams {
  status?: 'all' | 'open' | 'resolved';
  errorCategory?: 'all' | ErrorTaxonomy;
  subject?: 'all' | 'quant' | 'verbal';
  topicSlug?: string;
}

/**
 * Creates an empty mistake notebook for a user.
 */
export function createMistakeNotebook(userId: string): MistakeNotebook {
  return {
    userId,
    entries: {},
  };
}

/**
 * Records or updates a mistake in the learner's Mistake Notebook.
 * Duplicate incorrect answers to the same question update the existing entry (Open state, increment attempt count).
 */
export function recordMistake(
  notebook: MistakeNotebook,
  params: RecordMistakeParams
): MistakeNotebook {
  const nowIso = (params.now ?? new Date()).toISOString();
  const existing = notebook.entries[params.questionId];

  const updatedEntry: MistakeEntry = existing
    ? {
        ...existing,
        selectedWrongAnswer: params.selectedWrongAnswer,
        errorCategory: params.errorCategory,
        notes: params.notes ?? existing.notes,
        status: 'open', // reopened if wrong again
        resolvedAt: undefined,
        attemptsCount: existing.attemptsCount + 1,
        lastAttemptAt: nowIso,
        updatedAt: nowIso,
        excludeFromIrt: true,
      }
    : {
        id: `mistake-${params.questionId}-${Date.now()}`,
        userId: params.userId,
        questionId: params.questionId,
        sourceAttemptId: params.sourceAttemptId,
        sourceSessionId: params.sourceSessionId,
        subject: params.subject,
        topicSlug: params.topicSlug,
        questionPrompt: params.questionPrompt,
        options: params.options,
        selectedWrongAnswer: params.selectedWrongAnswer,
        correctAnswers: params.correctAnswers,
        explanationMd: params.explanationMd,
        errorCategory: params.errorCategory,
        notes: params.notes,
        status: 'open',
        attemptsCount: 1,
        lastAttemptAt: nowIso,
        excludeFromIrt: true,
        createdAt: nowIso,
        updatedAt: nowIso,
      };

  return {
    ...notebook,
    entries: {
      ...notebook.entries,
      [params.questionId]: updatedEntry,
    },
  };
}

/**
 * Retries an existing mistake.
 * If the user answers correctly WITHOUT using hints (hintsUsed === 0), the mistake transitions to 'resolved'.
 * If answered correctly with hints, the question is marked correct for the session but remains 'open'
 * until mastery is demonstrated independently.
 */
export function retryMistake(params: RetryMistakeParams): RetryMistakeResult {
  const { notebook, questionId, userAnswer, hintsUsed = 0, now = new Date() } = params;
  const entry = notebook.entries[questionId];

  if (!entry) {
    throw new Error(`Mistake entry for question ${questionId} not found`);
  }

  const nowIso = now.toISOString();
  const isCorrect = entry.correctAnswers.includes(userAnswer.trim());
  const hintsCount = hintsUsed ?? 0;
  // Resolved only if answered correctly without hints
  const resolved = isCorrect && hintsCount === 0;

  const updatedEntry: MistakeEntry = {
    ...entry,
    status: resolved ? 'resolved' : entry.status,
    resolvedAt: resolved ? nowIso : entry.resolvedAt,
    attemptsCount: entry.attemptsCount + 1,
    lastAttemptAt: nowIso,
    updatedAt: nowIso,
    excludeFromIrt: true,
  };

  const updatedNotebook: MistakeNotebook = {
    ...notebook,
    entries: {
      ...notebook.entries,
      [questionId]: updatedEntry,
    },
  };

  let message = 'Incorrect answer. The item remains open in your Mistake Notebook.';
  if (resolved) {
    message = 'Correct! Mistake resolved without hints and marked complete.';
  } else if (isCorrect && hintsCount > 0) {
    message = 'Correct with hints! The item remains open until solved independently without hints.';
  }

  return {
    notebook: updatedNotebook,
    isCorrect,
    resolved,
    message,
    excludeFromIrt: true,
  };
}

/**
 * Filters mistake entries by status, taxonomy category, subject, and topic.
 */
export function filterMistakes(
  notebook: MistakeNotebook,
  filters: MistakeFilterParams = {}
): MistakeEntry[] {
  let list = Object.values(notebook.entries);

  if (filters.status && filters.status !== 'all') {
    list = list.filter((m) => m.status === filters.status);
  }

  if (filters.errorCategory && filters.errorCategory !== 'all') {
    list = list.filter((m) => m.errorCategory === filters.errorCategory);
  }

  if (filters.subject && filters.subject !== 'all') {
    list = list.filter((m) => m.subject === filters.subject);
  }

  if (filters.topicSlug && filters.topicSlug !== 'all') {
    list = list.filter((m) => m.topicSlug === filters.topicSlug);
  }

  // Sort by lastAttemptAt descending (newest mistakes first)
  return list.sort((a, b) => new Date(b.lastAttemptAt).getTime() - new Date(a.lastAttemptAt).getTime());
}

/**
 * Returns human-readable D13 error taxonomy labels.
 */
export function taxonomyLabel(category: ErrorTaxonomy): string {
  switch (category) {
    case 'careless_math':
      return 'Careless Math';
    case 'vocab_gap':
      return 'Vocab Gap';
    case 'concept_gap':
      return 'Concept Gap';
    case 'trap_answer':
      return 'Trap Answer';
    case 'misread_prompt':
      return 'Misread Prompt';
    case 'time_pressure':
      return 'Time Pressure';
  }
}
