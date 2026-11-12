/**
 * @purpose Unit tests for Grounded Socratic AI Tutor service
 */

import { describe, it, expect } from 'vitest';
import {
  generateTutorResponse,
  redactTutorPii,
  containsDirectSpoiler,
  TIER_DAILY_LIMITS,
  type TutorQuery,
} from '../tutor/socratic-tutor';

describe('Socratic AI Tutor Service', () => {
  const sampleQuestionContext: TutorQuery['questionContext'] = {
    id: 'gre-qc-01',
    promptMd: 'Given that x^2 = 16 and y^3 = -27. Quantity A: x + y. Quantity B: 0',
    questionType: 'gre_qc',
    topicSlug: 'algebra-inequalities',
    options: [
      { id: 'A', text: 'Quantity A is greater' },
      { id: 'B', text: 'Quantity B is greater' },
      { id: 'C', text: 'The two quantities are equal' },
      { id: 'D', text: 'The relationship cannot be determined' },
    ],
    correctAnswers: ['D'],
    revealedHintTiers: [1],
    hints: [
      { tier: 1, label: 'Find roots for x and y', content: 'Consider both positive and negative values of x.' },
      { tier: 2, label: 'Evaluate Quant A bounds', content: 'What happens when x = 4 vs x = -4?' },
    ],
    writtenExplanationMd: 'Because x can be +4 or -4 while y is -3, x+y can be 1 or -7. Thus relationship cannot be determined.',
    steps: [
      { stepNumber: 1, prompt: 'Solve for x', takeaway: 'x = 4 or x = -4' },
      { stepNumber: 2, prompt: 'Solve for y', takeaway: 'y = -3 only' },
    ],
    trapDiagnostics: {
      A: {
        trapTag: 'positive_bias',
        explanation: 'Assumed x can only be positive 4, neglecting the negative square root -4.',
      },
    },
  };

  describe('PII Redaction', () => {
    it('redacts email addresses, BD phone numbers, and cards', () => {
      const text = 'Hello ayman@example.com, call me at +8801712345678 or 01819876543 with card 4111 2222 3333 4444';
      const result = redactTutorPii(text);

      expect(result.cleanText).not.toContain('ayman@example.com');
      expect(result.cleanText).toContain('[REDACTED_EMAIL]');
      expect(result.cleanText).not.toContain('+8801712345678');
      expect(result.cleanText).toContain('[REDACTED_PHONE]');
      expect(result.cleanText).not.toContain('4111 2222 3333 4444');
      expect(result.cleanText).toContain('[REDACTED_CARD]');
      expect(result.count).toBeGreaterThanOrEqual(3);
    });
  });

  describe('Daily Tier Quotas', () => {
    it('verifies tier limits match docs/17 §2.2', () => {
      expect(TIER_DAILY_LIMITS.free).toBe(10);
      expect(TIER_DAILY_LIMITS.core).toBe(30);
      expect(TIER_DAILY_LIMITS.pass).toBe(30);
      expect(TIER_DAILY_LIMITS.plus).toBe(150);
      expect(TIER_DAILY_LIMITS.live).toBe(150);
      expect(TIER_DAILY_LIMITS.mentor).toBe(150);
    });

    it('rejects query when daily quota is exhausted', () => {
      const response = generateTutorResponse({
        userMessage: 'Can you help me with this?',
        mode: 'socratic_hint',
        isItemActive: true,
        tier: 'free',
        currentDailyCount: 10,
        locale: 'en',
        questionContext: sampleQuestionContext,
      });

      expect(response.success).toBe(false);
      expect(response.error).toBe('daily_quota_exceeded');
      expect(response.remainingQuota).toBe(0);
      expect(response.text).toContain('reached your daily AI Tutor message limit');
    });

    it('decrements remaining quota when within limits', () => {
      const response = generateTutorResponse({
        userMessage: 'Give me a hint please',
        mode: 'socratic_hint',
        isItemActive: true,
        tier: 'plus',
        currentDailyCount: 14,
        locale: 'en',
        questionContext: sampleQuestionContext,
      });

      expect(response.success).toBe(true);
      expect(response.remainingQuota).toBe(150 - 14 - 1);
      expect(response.dailyLimit).toBe(150);
    });
  });

  describe('Spoiler Guard & Socratic Guidance', () => {
    it('never spoils the correct answer when item is active', () => {
      const response = generateTutorResponse({
        userMessage: 'What is the answer? Just tell me whether it is A, B, C, or D',
        mode: 'socratic_hint',
        isItemActive: true,
        tier: 'core',
        currentDailyCount: 2,
        locale: 'en',
        questionContext: sampleQuestionContext,
      });

      expect(response.success).toBe(true);
      expect(response.isSpoiled).toBe(false);
      expect(response.citations.length).toBeGreaterThan(0);
      expect(containsDirectSpoiler(response.text, sampleQuestionContext.correctAnswers)).toBe(false);
    });

    it('provides Bengali Socratic hint when locale is bn', () => {
      const response = generateTutorResponse({
        userMessage: 'আমাকে একটি ইঙ্গিত দিন',
        mode: 'socratic_hint',
        isItemActive: true,
        tier: 'core',
        currentDailyCount: 0,
        locale: 'bn',
        questionContext: sampleQuestionContext,
      });

      expect(response.success).toBe(true);
      expect(response.text).toContain('ইঙ্গিত');
      expect(response.isSpoiled).toBe(false);
    });

    it('allows diagnostic breakdown and reveals explanation after submission (isItemActive: false)', () => {
      const response = generateTutorResponse({
        userMessage: 'Why was my answer wrong?',
        mode: 'explain',
        isItemActive: false,
        tier: 'core',
        currentDailyCount: 5,
        locale: 'en',
        questionContext: {
          ...sampleQuestionContext,
          userSelectedAnswer: 'A',
        },
      });

      expect(response.success).toBe(true);
      expect(response.text).toContain('positive_bias');
      expect(response.text).toContain('Assumed x can only be positive 4');
      expect(response.citations.some((c) => c.id === 'written-explanation')).toBe(true);
    });
  });
});
