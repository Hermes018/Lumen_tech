/** @purpose Unit tests for Mistake Notebook domain service and retry loop */

import { describe, it, expect } from 'vitest';
import {
  createMistakeNotebook,
  recordMistake,
  retryMistake,
  filterMistakes,
  taxonomyLabel,
} from '../exam/mistakes';

describe('Mistake Notebook Domain Service (P1-67)', () => {
  const userId = 'usr-learner-01';

  it('initializes an empty notebook', () => {
    const nb = createMistakeNotebook(userId);
    expect(nb.userId).toBe(userId);
    expect(Object.keys(nb.entries)).toHaveLength(0);
  });

  it('records a new incorrect item with open status and excludeFromIrt invariant', () => {
    const nb = createMistakeNotebook(userId);
    const updated = recordMistake(nb, {
      userId,
      questionId: 'gre-q-01',
      subject: 'quant',
      topicSlug: 'algebra-signs',
      questionPrompt: 'If x > y > 0...',
      selectedWrongAnswer: 'choice-a',
      correctAnswers: ['choice-b'],
      errorCategory: 'careless_math',
      notes: 'Forgot that y is strictly positive',
    });

    const entry = updated.entries['gre-q-01'];
    expect(entry).toBeDefined();
    expect(entry?.status).toBe('open');
    expect(entry?.errorCategory).toBe('careless_math');
    expect(entry?.attemptsCount).toBe(1);
    expect(entry?.excludeFromIrt).toBe(true);
  });

  it('updates attempt count and re-opens previously resolved question on new incorrect attempt', () => {
    let nb = createMistakeNotebook(userId);
    nb = recordMistake(nb, {
      userId,
      questionId: 'gre-q-02',
      subject: 'verbal',
      topicSlug: 'text-completion',
      questionPrompt: 'The politician was...',
      selectedWrongAnswer: 'choice-c',
      correctAnswers: ['choice-e'],
      errorCategory: 'vocab_gap',
    });

    // Solve it once
    const retryRes = retryMistake({
      notebook: nb,
      questionId: 'gre-q-02',
      userAnswer: 'choice-e',
      hintsUsed: 0,
    });
    expect(retryRes.resolved).toBe(true);
    expect(retryRes.notebook.entries['gre-q-02']?.status).toBe('resolved');

    // Make mistake again on same question later
    const reopened = recordMistake(retryRes.notebook, {
      userId,
      questionId: 'gre-q-02',
      subject: 'verbal',
      topicSlug: 'text-completion',
      questionPrompt: 'The politician was...',
      selectedWrongAnswer: 'choice-a',
      correctAnswers: ['choice-e'],
      errorCategory: 'vocab_gap',
    });

    const entry = reopened.entries['gre-q-02'];
    expect(entry?.status).toBe('open');
    expect(entry?.attemptsCount).toBe(3); // 1 initial + 1 retry + 1 new wrong
  });

  it('keeps status open on incorrect retry', () => {
    let nb = createMistakeNotebook(userId);
    nb = recordMistake(nb, {
      userId,
      questionId: 'gre-q-03',
      subject: 'quant',
      topicSlug: 'geometry-triangles',
      questionPrompt: 'Find the hypotenuse...',
      selectedWrongAnswer: '5',
      correctAnswers: ['13'],
      errorCategory: 'concept_gap',
    });

    const retryRes = retryMistake({
      notebook: nb,
      questionId: 'gre-q-03',
      userAnswer: '7', // still wrong
      hintsUsed: 0,
    });

    expect(retryRes.isCorrect).toBe(false);
    expect(retryRes.resolved).toBe(false);
    expect(retryRes.notebook.entries['gre-q-03']?.status).toBe('open');
    expect(retryRes.excludeFromIrt).toBe(true);
  });

  it('requires hint-free answer for resolution (hintsUsed > 0 remains open)', () => {
    let nb = createMistakeNotebook(userId);
    nb = recordMistake(nb, {
      userId,
      questionId: 'gre-q-04',
      subject: 'verbal',
      topicSlug: 'sentence-equiv',
      questionPrompt: 'Although the author was...',
      selectedWrongAnswer: 'choice-a',
      correctAnswers: ['choice-b'],
      errorCategory: 'trap_answer',
    });

    const retryResWithHints = retryMistake({
      notebook: nb,
      questionId: 'gre-q-04',
      userAnswer: 'choice-b', // correct
      hintsUsed: 1, // but used hints
    });

    expect(retryResWithHints.isCorrect).toBe(true);
    expect(retryResWithHints.resolved).toBe(false); // remains open
    expect(retryResWithHints.notebook.entries['gre-q-04']?.status).toBe('open');

    // Independent attempt without hints resolves it
    const retryIndependent = retryMistake({
      notebook: retryResWithHints.notebook,
      questionId: 'gre-q-04',
      userAnswer: 'choice-b',
      hintsUsed: 0,
    });

    expect(retryIndependent.resolved).toBe(true);
    expect(retryIndependent.notebook.entries['gre-q-04']?.status).toBe('resolved');
    expect(retryIndependent.notebook.entries['gre-q-04']?.resolvedAt).toBeDefined();
  });

  it('filters mistakes by status, taxonomy category, and subject', () => {
    let nb = createMistakeNotebook(userId);
    nb = recordMistake(nb, {
      userId,
      questionId: 'q-1',
      subject: 'quant',
      topicSlug: 'algebra',
      questionPrompt: 'Q1',
      selectedWrongAnswer: 'a',
      correctAnswers: ['b'],
      errorCategory: 'careless_math',
    });
    nb = recordMistake(nb, {
      userId,
      questionId: 'q-2',
      subject: 'verbal',
      topicSlug: 'vocab',
      questionPrompt: 'Q2',
      selectedWrongAnswer: 'a',
      correctAnswers: ['b'],
      errorCategory: 'vocab_gap',
    });
    nb = recordMistake(nb, {
      userId,
      questionId: 'q-3',
      subject: 'quant',
      topicSlug: 'stats',
      questionPrompt: 'Q3',
      selectedWrongAnswer: 'a',
      correctAnswers: ['b'],
      errorCategory: 'time_pressure',
    });

    // Resolve q-1
    nb = retryMistake({
      notebook: nb,
      questionId: 'q-1',
      userAnswer: 'b',
      hintsUsed: 0,
    }).notebook;

    const openOnly = filterMistakes(nb, { status: 'open' });
    expect(openOnly).toHaveLength(2);

    const resolvedOnly = filterMistakes(nb, { status: 'resolved' });
    expect(resolvedOnly).toHaveLength(1);
    expect(resolvedOnly[0]?.questionId).toBe('q-1');

    const quantOnly = filterMistakes(nb, { subject: 'quant' });
    expect(quantOnly).toHaveLength(2);

    const vocabCategoryOnly = filterMistakes(nb, { errorCategory: 'vocab_gap' });
    expect(vocabCategoryOnly).toHaveLength(1);
    expect(vocabCategoryOnly[0]?.questionId).toBe('q-2');
  });

  it('returns human-readable labels for error taxonomy', () => {
    expect(taxonomyLabel('careless_math')).toBe('Careless Math');
    expect(taxonomyLabel('vocab_gap')).toBe('Vocab Gap');
    expect(taxonomyLabel('concept_gap')).toBe('Concept Gap');
    expect(taxonomyLabel('trap_answer')).toBe('Trap Answer');
    expect(taxonomyLabel('misread_prompt')).toBe('Misread Prompt');
    expect(taxonomyLabel('time_pressure')).toBe('Time Pressure');
  });
});
