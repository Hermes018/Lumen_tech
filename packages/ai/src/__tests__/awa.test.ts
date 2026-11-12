/** @purpose Unit tests for GRE AWA essay evaluation, PII redaction, grounding verification, and rubric schema */

import { describe, it, expect } from 'vitest';
import {
  AwaEvalOutput,
  validateAwaSubmission,
  redactPii,
  checkGrounding,
  applyDeterministicAwaRules,
  evaluateAwaIssueEssay,
} from '../evaluation/awa';

describe('GRE AWA Schema Validation (docs/07 §7.4.1)', () => {
  it('validates a compliant AwaEvalOutput schema on the 0.5 grid', () => {
    const validData = {
      score: 4.5,
      dimensions: {
        position_insight: {
          band: 4.5,
          rationale: 'Insightful perspective',
          evidence: [{ quote: 'Technology is beneficial', comment: 'Clear thesis' }],
        },
        support_reasoning: {
          band: 4.5,
          rationale: 'Solid support',
          evidence: [{ quote: 'For example in medicine', comment: 'Relevant example' }],
        },
        organization_focus: {
          band: 4.5,
          rationale: 'Cohesive structure',
          evidence: [{ quote: 'Furthermore', comment: 'Transition' }],
        },
        language_use: {
          band: 4.5,
          rationale: 'Accurate vocabulary',
          evidence: [{ quote: 'Ubiquitous influence', comment: 'Lexical resource' }],
        },
      },
      errors: [],
      strengths: ['Effective organization', 'Clear stance'],
      improvements: [
        {
          dimension: 'support_reasoning',
          priority: 1,
          tip: 'Address counter-arguments more directly.',
        },
      ],
      rewrite: null,
      flags: {
        off_topic: false,
        memorised_template_suspected: false,
        too_short: false,
        not_english: false,
        instruction_in_text: false,
      },
      confidence: 'high' as const,
    };

    const parsed = AwaEvalOutput.safeParse(validData);
    expect(parsed.success).toBe(true);
  });

  it('rejects scores not on the 0.5 grid (e.g., 3.3)', () => {
    const invalidData = {
      score: 3.3, // Invalid: must be on 0.5 grid
      dimensions: {
        position_insight: { band: 3.5, rationale: 'ok', evidence: [] },
        support_reasoning: { band: 3.5, rationale: 'ok', evidence: [] },
        organization_focus: { band: 3.5, rationale: 'ok', evidence: [] },
        language_use: { band: 3.5, rationale: 'ok', evidence: [] },
      },
      errors: [],
      strengths: [],
      improvements: [],
      rewrite: null,
      flags: {
        off_topic: false,
        memorised_template_suspected: false,
        too_short: false,
        not_english: false,
        instruction_in_text: false,
      },
      confidence: 'medium' as const,
    };

    const parsed = AwaEvalOutput.safeParse(invalidData);
    expect(parsed.success).toBe(false);
  });

  it('rejects unknown properties due to strict schema enforcement', () => {
    const dataWithExtra = {
      score: 4.0,
      extraProp: 'forbidden',
      dimensions: {
        position_insight: { band: 4.0, rationale: 'ok', evidence: [] },
        support_reasoning: { band: 4.0, rationale: 'ok', evidence: [] },
        organization_focus: { band: 4.0, rationale: 'ok', evidence: [] },
        language_use: { band: 4.0, rationale: 'ok', evidence: [] },
      },
      errors: [],
      strengths: [],
      improvements: [],
      rewrite: null,
      flags: {
        off_topic: false,
        memorised_template_suspected: false,
        too_short: false,
        not_english: false,
        instruction_in_text: false,
      },
      confidence: 'high' as const,
    };

    const parsed = AwaEvalOutput.safeParse(dataWithExtra);
    expect(parsed.success).toBe(false);
  });
});

describe('AWA Pre-Validation & PII Redaction (docs/07 §7.4.2)', () => {
  it('rejects submissions under 20 words as too_short', () => {
    const result = validateAwaSubmission('This essay is far too short to grade.');
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('too_short');
  });

  it('rejects non-English non-Latin text', () => {
    const banglaText =
      'এই রচনাটি বাংলায় লেখা হয়েছে এবং এতে ইংরেজি কোনো সাধারণ শব্দ নেই। তাই এটি গ্রহণযোগ্য নয়।';
    const result = validateAwaSubmission(banglaText);
    expect(result.valid).toBe(false);
    expect(result.reason).toBe('not_english');
  });

  it('accepts authentic English essays exceeding 20 words', () => {
    const validEssay =
      'Governments have an essential obligation to protect environmental resources for future generations. While economic development brings undeniable benefits to modern societies, sustainable practices must remain the foundation of national policies.';
    const result = validateAwaSubmission(validEssay);
    expect(result.valid).toBe(true);
    expect(result.wordCount).toBeGreaterThan(25);
  });

  it('redacts emails, URLs, phone numbers, national IDs, and names', () => {
    const rawText =
      'Hello, my name is Ayman Rahman. You can reach me at student@lumen.edu or https://lumen.edu/exam. My phone number is 01712345678 and ID is 1234567890123.';
    const redacted = redactPii(rawText, { accountName: 'Ayman Rahman' });

    expect(redacted).not.toContain('student@lumen.edu');
    expect(redacted).toContain('[EMAIL]');
    expect(redacted).not.toContain('https://lumen.edu/exam');
    expect(redacted).toContain('[URL]');
    expect(redacted).not.toContain('01712345678');
    expect(redacted).toContain('[PHONE]');
    expect(redacted).not.toContain('1234567890123');
    expect(redacted).toContain('[ID]');
    expect(redacted).not.toContain('Ayman');
    expect(redacted).not.toContain('Rahman');
    expect(redacted).toContain('[NAME]');
  });
});

describe('Grounding Checks & Deterministic Caps (docs/07 §7.4.1 & §7.4.4)', () => {
  const sampleEssay =
    'Technological advances continue to reshape modern education in transformative ways. Students can access vast libraries of research and collaborate globally.';

  it('verifies genuine quotes and drops ungrounded quotes', () => {
    const mockOutput: AwaEvalOutput = {
      score: 4.0,
      dimensions: {
        position_insight: {
          band: 4.0,
          rationale: 'Good',
          evidence: [
            { quote: 'Technological advances continue', comment: 'Valid quote' },
            { quote: 'Fictional invention not in text', comment: 'Hallucinated quote' },
          ],
        },
        support_reasoning: { band: 4.0, rationale: 'Good', evidence: [] },
        organization_focus: { band: 4.0, rationale: 'Good', evidence: [] },
        language_use: { band: 4.0, rationale: 'Good', evidence: [] },
      },
      errors: [],
      strengths: [],
      improvements: [],
      rewrite: null,
      flags: {
        off_topic: false,
        memorised_template_suspected: false,
        too_short: false,
        not_english: false,
        instruction_in_text: false,
      },
      confidence: 'high',
    };

    const grounding = checkGrounding(sampleEssay, mockOutput);
    expect(grounding.cleanedOutput.dimensions.position_insight.evidence).toHaveLength(1);
    expect(grounding.cleanedOutput.dimensions.position_insight.evidence[0]?.quote).toBe(
      'Technological advances continue'
    );
    expect(grounding.droppedCount).toBe(1);
  });

  it('applies deterministic cap of 2.0 when essay is under 100 words', () => {
    const initialOutput: AwaEvalOutput = {
      score: 5.0,
      dimensions: {
        position_insight: { band: 5.0, rationale: 'ok', evidence: [] },
        support_reasoning: { band: 5.0, rationale: 'ok', evidence: [] },
        organization_focus: { band: 5.0, rationale: 'ok', evidence: [] },
        language_use: { band: 5.0, rationale: 'ok', evidence: [] },
      },
      errors: [],
      strengths: [],
      improvements: [],
      rewrite: null,
      flags: {
        off_topic: false,
        memorised_template_suspected: false,
        too_short: false,
        not_english: false,
        instruction_in_text: false,
      },
      confidence: 'high',
    };

    const capped = applyDeterministicAwaRules(initialOutput, 65);
    expect(capped.score).toBe(2.0);
    expect(capped.flags.too_short).toBe(true);
  });

  it('applies deterministic cap of 2.5 when essay is flagged off_topic', () => {
    const initialOutput: AwaEvalOutput = {
      score: 4.5,
      dimensions: {
        position_insight: { band: 4.5, rationale: 'ok', evidence: [] },
        support_reasoning: { band: 4.5, rationale: 'ok', evidence: [] },
        organization_focus: { band: 4.5, rationale: 'ok', evidence: [] },
        language_use: { band: 4.5, rationale: 'ok', evidence: [] },
      },
      errors: [],
      strengths: [],
      improvements: [],
      rewrite: null,
      flags: {
        off_topic: true,
        memorised_template_suspected: false,
        too_short: false,
        not_english: false,
        instruction_in_text: false,
      },
      confidence: 'high',
    };

    const capped = applyDeterministicAwaRules(initialOutput, 350);
    expect(capped.score).toBe(2.5);
  });

  it('runs complete evaluateAwaIssueEssay pipeline successfully', () => {
    const longEssay = `
      Governments across the globe bear a fundamental obligation to enact policies that preserve the natural environment for future generations. While rapid industrialization undeniably drives economic prosperity, unchecked ecological degradation poses an existential risk to human wellbeing.
      
      First, sustainable environmental practices ensure the longevity of natural capital. When forestry, fisheries, and agricultural resources are managed conscientiously, future economies avoid the catastrophic costs of resource depletion.
      
      Second, government regulation provides a level playing field for clean enterprise. Individual corporations, incentivized by short-term quarterly profits, rarely internalize the negative externalities of air and water pollution without regulatory mandates.
      
      In conclusion, long-term national prosperity cannot be disentangled from environmental stewardship. By prioritizing sustainability today, governments safeguard both ecological integrity and economic resilience.
    `;

    const result = evaluateAwaIssueEssay({
      essayText: longEssay,
      promptText:
        'Governments should prioritize environmental preservation over immediate economic expansion.',
      accountName: 'Ayman Rahman',
    });

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.evaluation.score).toBeGreaterThanOrEqual(3.5);
      expect(result.evaluation.dimensions.position_insight.band).toBeGreaterThanOrEqual(3.5);
      expect(result.evaluation.flags.instruction_in_text).toBe(false);
      expect(result.wordCount).toBeGreaterThan(100);
    }
  });
});
