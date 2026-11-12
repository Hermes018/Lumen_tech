import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  user,
  session,
  account,
  verification,
  roleAssignment,
  organization,
  auditLog,
  product,
  price,
  entitlement,
  question,
  questionVersion,
  questionStat,
  examAttempt,
  attemptSection,
  attemptItem,
  practiceSession,
  practiceAttemptItem,
  vocabWord,
  vocabDeck,
  userVocabCard,
  vocabReviewLog,
  errorLogQueue,
  db,
  getDb,
  type PedagogyHint,
  type ChoiceExplanation,
  type SocraticStep,
  type VerbalDeconstructor,
  type FSRSState,
  type ErrorTag,
} from '../index';

describe('Drizzle Schema & D13 Pedagogy Definition', () => {
  it('exports all core authentication and RBAC tables', () => {
    expect(user).toBeDefined();
    expect(session).toBeDefined();
    expect(account).toBeDefined();
    expect(verification).toBeDefined();
    expect(roleAssignment).toBeDefined();
    expect(organization).toBeDefined();
    expect(auditLog).toBeDefined();
  });

  it('exports all catalog, pricing, and entitlement tables', () => {
    expect(product).toBeDefined();
    expect(price).toBeDefined();
    expect(entitlement).toBeDefined();
  });

  it('exports all GRE curriculum, questions, and attempts tables', () => {
    expect(question).toBeDefined();
    expect(questionVersion).toBeDefined();
    expect(questionStat).toBeDefined();
    expect(examAttempt).toBeDefined();
    expect(attemptSection).toBeDefined();
    expect(attemptItem).toBeDefined();
    expect(practiceSession).toBeDefined();
    expect(practiceAttemptItem).toBeDefined();
  });

  it('exports all FSRS vocab and error queue tables', () => {
    expect(vocabWord).toBeDefined();
    expect(vocabDeck).toBeDefined();
    expect(userVocabCard).toBeDefined();
    expect(vocabReviewLog).toBeDefined();
    expect(errorLogQueue).toBeDefined();
  });

  it('validates D13 Pedagogy hint structure via Zod schema', () => {
    const hintSchema = z.object({
      tier: z.union([z.literal(1), z.literal(2), z.literal(3)]),
      label: z.enum(['Concept Nudge', 'Setup / Elimination', 'Final Bridge']),
      content_md: z.string().min(1),
    });

    const sampleHint: PedagogyHint = {
      tier: 1,
      label: 'Concept Nudge',
      content_md: 'Consider testing whether x can be negative or zero.',
    };

    const parsed = hintSchema.parse(sampleHint);
    expect(parsed.tier).toBe(1);
    expect(parsed.label).toBe('Concept Nudge');
  });

  it('validates D13 Choice Trap Diagnostics structure via Zod schema', () => {
    const choiceExplanationSchema = z.record(
      z.string(),
      z.object({
        is_correct: z.boolean(),
        explanation_md: z.string(),
        trap_tag: z.string().optional(),
        trap_label: z.string().optional(),
      })
    );

    const sampleChoiceMap: Record<string, ChoiceExplanation> = {
      choice_a: {
        is_correct: false,
        explanation_md: 'Assumed x is positive integer.',
        trap_tag: 'forgot_zero_or_negative',
        trap_label: 'Overlooked Negative Numbers',
      },
      choice_b: {
        is_correct: true,
        explanation_md: 'Correct mathematical proof.',
      },
    };

    const parsed = choiceExplanationSchema.parse(sampleChoiceMap);
    expect(parsed.choice_a?.is_correct).toBe(false);
    expect(parsed.choice_a?.trap_tag).toBe('forgot_zero_or_negative');
    expect(parsed.choice_b?.is_correct).toBe(true);
  });

  it('validates D13 Socratic step-by-step solver structure via Zod schema', () => {
    const socraticStepSchema = z.object({
      step_index: z.number().int().min(1),
      prompt_md: z.string().min(1),
      options: z.array(z.string()).min(2),
      correct_option_index: z.number().int().min(0),
      takeaway_md: z.string().min(1),
    });

    const sampleStep: SocraticStep = {
      step_index: 1,
      prompt_md: 'What is the relationship between Quantity A and 0?',
      options: ['Always positive', 'Can be positive or negative', 'Always zero'],
      correct_option_index: 1,
      takeaway_md: 'Since x^2 can be 0 or positive, test x = 0 first.',
    };

    const parsed = socraticStepSchema.parse(sampleStep);
    expect(parsed.correct_option_index).toBe(1);
    expect(parsed.options.length).toBe(3);
  });

  it('validates D13 GregMat-style verbal deconstructor structure', () => {
    const verbalDeconstructorSchema = z.object({
      trigger_words: z
        .array(
          z.object({
            word: z.string(),
            category: z.enum(['contrast', 'support', 'cause_effect', 'condition']),
            note: z.string(),
          })
        )
        .optional(),
      blank_charges: z
        .array(
          z.object({
            blank_index: z.number(),
            charge: z.enum(['+', '-', 'neutral']),
            rationale: z.string(),
          })
        )
        .optional(),
      prediction_guide_md: z.string().optional(),
    });

    const sampleDeconstructor: VerbalDeconstructor = {
      trigger_words: [
        { word: 'Although', category: 'contrast', note: 'Shifts tone from positive to negative.' },
      ],
      blank_charges: [{ blank_index: 1, charge: '-', rationale: 'Requires negative connotation.' }],
      prediction_guide_md: 'Predict: hostile or antagonistic.',
    };

    const parsed = verbalDeconstructorSchema.parse(sampleDeconstructor);
    expect(parsed.trigger_words?.[0]?.word).toBe('Although');
    expect(parsed.blank_charges?.[0]?.charge).toBe('-');
  });

  it('validates FSRS card state and error tags', () => {
    const validStates: FSRSState[] = ['new', 'learning', 'review', 'relearning'];
    const validErrorTags: ErrorTag[] = [
      'concept_gap',
      'vocab_gap',
      'careless_math',
      'misread_prompt',
      'time_pressure',
    ];

    expect(validStates.length).toBe(4);
    expect(validErrorTags.length).toBe(5);
  });

  it('provides a lazy client without throwing offline', () => {
    expect(db).toBeDefined();
    const testClient = getDb();
    expect(testClient).toBeDefined();
  });
});
