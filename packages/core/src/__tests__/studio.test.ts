/** @purpose Unit tests for Question Authoring Studio, RBAC, D6 immutable versioning, and D13 pedagogy validation */
import { describe, it, expect, beforeEach } from 'vitest';
import {
  createQuestionDraft,
  updateQuestion,
  submitQuestionForReview,
  publishQuestion,
  retireQuestion,
  getQuestionWithVersions,
  initStudioStore,
  type CreateQuestionInput,
} from '../studio/authoring';
import type { Actor } from '../auth/policy';
import { AuthorizationError, TwoFactorRequiredError } from '../auth/policy';

describe('Studio Authoring & Immutable Versioning (P1-26)', () => {
  const instructorActor: Actor = {
    id: 'inst-1',
    roles: ['instructor'],
    hasTwoFactorEnabled: true,
  };

  const otherInstructorActor: Actor = {
    id: 'inst-2',
    roles: ['instructor'],
    hasTwoFactorEnabled: true,
  };

  const instructorWithout2fa: Actor = {
    id: 'inst-3',
    roles: ['instructor'],
    hasTwoFactorEnabled: false,
  };

  const editorActor: Actor = {
    id: 'editor-1',
    roles: ['content_editor'],
    hasTwoFactorEnabled: true,
  };

  const studentActor: Actor = {
    id: 'stud-1',
    roles: ['student'],
    hasTwoFactorEnabled: false,
  };

  const sampleQuestionInput: CreateQuestionInput = {
    examType: 'gre',
    section: 'quant',
    questionType: 'gre_qc',
    topicSlug: 'algebra',
    promptMd: 'Compare Quantity A and Quantity B:\nx > 0\nQuantity A: x^2 + 1\nQuantity B: (x + 1)^2',
    options: [
      { id: 'choice_a', label: 'Quantity A is greater' },
      { id: 'choice_b', label: 'Quantity B is greater' },
      { id: 'choice_c', label: 'The two quantities are equal' },
      { id: 'choice_d', label: 'The relationship cannot be determined' },
    ],
    correctAnswers: ['choice_b'],
    writtenExplanationMd: 'Expanding Quantity B yields x^2 + 2x + 1. Since x > 0, 2x > 0, so Quantity B is always strictly greater.',
    hints: [
      { tier: 1, label: 'Concept Nudge', content_md: 'Expand (x + 1)^2 using algebraic identities.' },
      { tier: 2, label: 'Setup / Elimination', content_md: 'Subtract x^2 + 1 from both quantities.' },
      { tier: 3, label: 'Final Bridge', content_md: 'Compare 0 with 2x given x > 0.' },
    ],
    choiceExplanations: {
      choice_a: { is_correct: false, explanation_md: 'Quantity A is smaller because 2x is positive.', trap_tag: 'opposite_direction' },
      choice_b: { is_correct: true, explanation_md: 'Correct. (x+1)^2 = x^2 + 2x + 1 > x^2 + 1 when x > 0.' },
      choice_c: { is_correct: false, explanation_md: 'They would only be equal if 2x = 0 (x = 0), but x > 0.', trap_tag: 'forgot_zero_or_negative' },
      choice_d: { is_correct: false, explanation_md: 'Since x is positive, the inequality holds deterministically.', trap_tag: 'extreme_language' },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What is the expansion of (x + 1)^2?',
        options: ['x^2 + 1', 'x^2 + 2x + 1', '2x + 2'],
        correct_option_index: 1,
        takeaway_md: '(x+1)^2 = x^2 + 2x + 1.',
      },
      {
        step_index: 2,
        prompt_md: 'Compare x^2 + 1 to x^2 + 2x + 1 when x > 0.',
        options: ['Quantity A is larger', 'Quantity B is larger by 2x'],
        correct_option_index: 1,
        takeaway_md: 'Quantity B exceeds Quantity A by 2x > 0.',
      },
    ],
  };

  beforeEach(() => {
    initStudioStore();
  });

  describe('RBAC & 2FA Enforcement', () => {
    it('blocks student or unauthenticated users from creating questions', () => {
      expect(() => createQuestionDraft(studentActor, sampleQuestionInput)).toThrow(
        AuthorizationError
      );
    });

    it('requires 2FA for instructors (D4)', () => {
      expect(() => createQuestionDraft(instructorWithout2fa, sampleQuestionInput)).toThrow(
        TwoFactorRequiredError
      );
    });

    it('allows 2FA-verified instructor to create draft questions', () => {
      const q = createQuestionDraft(instructorActor, sampleQuestionInput);
      expect(q.id).toBeDefined();
      expect(q.authorId).toBe(instructorActor.id);
      expect(q.status).toBe('draft');
      expect(q.liveVersion.versionNumber).toBe(1);
    });

    it('prevents instructor from editing another instructor draft (ownership isolation)', () => {
      const q = createQuestionDraft(instructorActor, sampleQuestionInput);
      expect(() =>
        updateQuestion(otherInstructorActor, q.id, { promptMd: 'Tampered prompt' })
      ).toThrow(AuthorizationError);
    });

    it('allows content_editor or admin to review, edit, and publish any question', () => {
      const q = createQuestionDraft(instructorActor, sampleQuestionInput);
      const updated = updateQuestion(editorActor, q.id, { promptMd: 'Editor refined prompt' });
      expect(updated.liveVersion.promptMd).toBe('Editor refined prompt');
    });

    it('prevents instructor from directly publishing (only content_editor/admin can publish)', () => {
      const q = createQuestionDraft(instructorActor, sampleQuestionInput);
      expect(() => publishQuestion(instructorActor, q.id)).toThrow(AuthorizationError);
    });
  });

  describe('D6 Immutable Versioning Rule', () => {
    it('updates draft in place when status is draft', () => {
      const q = createQuestionDraft(instructorActor, sampleQuestionInput);
      const updated = updateQuestion(instructorActor, q.id, {
        promptMd: 'Updated prompt before review',
      });

      expect(updated.status).toBe('draft');
      expect(updated.liveVersion.versionNumber).toBe(1);
      expect(updated.liveVersion.promptMd).toBe('Updated prompt before review');
      expect(updated.versions).toHaveLength(1);
    });

    it('transitions from draft -> in_review -> published', () => {
      const q = createQuestionDraft(instructorActor, sampleQuestionInput);
      const inReview = submitQuestionForReview(instructorActor, q.id);
      expect(inReview.status).toBe('in_review');

      const published = publishQuestion(editorActor, q.id);
      expect(published.status).toBe('published');
      expect(published.liveVersion.versionNumber).toBe(1);
    });

    it('forks a new immutable version (v2) when an already published question is edited', () => {
      const q = createQuestionDraft(instructorActor, sampleQuestionInput);
      submitQuestionForReview(instructorActor, q.id);
      const pub = publishQuestion(editorActor, q.id);
      const v1VersionId = pub.liveVersion.id;

      // Edit the published question
      const edited = updateQuestion(editorActor, q.id, {
        promptMd: 'Corrected typo in published prompt',
        writtenExplanationMd: 'Refined explanation.',
      });

      // The new active version is minted with version_number = 2
      expect(edited.liveVersion.versionNumber).toBe(2);
      expect(edited.liveVersion.id).not.toBe(v1VersionId);
      expect(edited.liveVersion.promptMd).toBe('Corrected typo in published prompt');

      // Past attempts remain pinned to original version v1
      const fullDetail = getQuestionWithVersions(editorActor, q.id);
      expect(fullDetail.versions).toHaveLength(2);
      const v1 = fullDetail.versions.find((v) => v.versionNumber === 1);
      const v2 = fullDetail.versions.find((v) => v.versionNumber === 2);
      expect(v1?.id).toBe(v1VersionId);
      expect(v1?.promptMd).toBe(sampleQuestionInput.promptMd);
      expect(v2?.promptMd).toBe('Corrected typo in published prompt');
    });

    it('retires a published question per 07 §8.6', () => {
      const q = createQuestionDraft(instructorActor, sampleQuestionInput);
      submitQuestionForReview(instructorActor, q.id);
      publishQuestion(editorActor, q.id);

      const retired = retireQuestion(editorActor, q.id, 'Negative discrimination detected in P1-68 stats');
      expect(retired.status).toBe('retired');
      expect(retired.retiredAt).toBeDefined();
    });
  });

  describe('D13 Interactive Pedagogy Schema Validation', () => {
    it('validates 3-tier hints and rejects invalid tiers', () => {
      const invalidInput: CreateQuestionInput = {
        ...sampleQuestionInput,
        // @ts-expect-error test runtime validation of tier
        hints: [{ tier: 4, label: 'Invalid Tier', content_md: 'Too deep' }],
      };

      expect(() => createQuestionDraft(instructorActor, invalidInput)).toThrow();
    });

    it('validates choice explanations and trap tag archetypes', () => {
      const invalidTrap: CreateQuestionInput = {
        ...sampleQuestionInput,
        choiceExplanations: {
          choice_a: {
            is_correct: false,
            explanation_md: 'Bad choice',
            // @ts-expect-error test runtime validation of trap tag
            trap_tag: 'invented_fake_trap',
          },
        },
      };

      expect(() => createQuestionDraft(instructorActor, invalidTrap)).toThrow();
    });

    it('validates Socratic step sequences (2-4 steps)', () => {
      const tooFewSteps: CreateQuestionInput = {
        ...sampleQuestionInput,
        steps: [
          {
            step_index: 1,
            prompt_md: 'Only 1 step provided',
            options: ['A', 'B'],
            correct_option_index: 0,
            takeaway_md: 'Takeaway',
          },
        ],
      };

      expect(() => createQuestionDraft(instructorActor, tooFewSteps)).toThrow();
    });
  });
});
