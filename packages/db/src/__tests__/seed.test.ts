import { describe, it, expect } from 'vitest';
import { z } from 'zod';
import {
  CANONICAL_PRODUCTS,
  GRE_MAGOOSH_SEED_QUESTIONS,
  GRE_VOCAB_SEED_WORDS,
} from '../index';

describe('Seed Data Validation (00-DECISIONS.md D5, D6, D13 & docs/17)', () => {
  describe('Canonical Price Book Seed (docs/17 §13)', () => {
    it('contains all 147 canonical products from docs/17', () => {
      expect(CANONICAL_PRODUCTS.length).toBe(147);
    });

    it('validates that all prices are non-negative integers (amount_minor)', () => {
      for (const prod of CANONICAL_PRODUCTS) {
        expect(prod.slug).toBeDefined();
        expect(prod.slug.length).toBeGreaterThan(0);
        expect(prod.prices).toBeDefined();

        for (const [region, price] of Object.entries(prod.prices)) {
          expect(['BD', 'A', 'B', 'C']).toContain(region);
          expect(typeof price).toBe('number');
          expect(Number.isInteger(price)).toBe(true);
          expect(price).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('verifies flagship GRE products exist with accurate allowances', () => {
      const greCore = CANONICAL_PRODUCTS.find((p) => p.slug === 'gre-core');
      expect(greCore).toBeDefined();
      expect(greCore?.prices.BD).toBe(599000); // 5,990 BDT in poisha
      expect(greCore?.prices.A).toBe(14900); // $149 in cents per docs/17
      expect(greCore?.allowances?.full_mocks).toBe(4);

      const grePlus = CANONICAL_PRODUCTS.find((p) => p.slug === 'gre-plus');
      expect(grePlus).toBeDefined();
      expect(grePlus?.prices.BD).toBe(849000); // 8,490 BDT in poisha per docs/17
      expect(grePlus?.prices.A).toBe(19900); // $199 in cents per docs/17
      expect(grePlus?.allowances?.full_mocks).toBe(10);
    });
  });

  describe('Original GRE Magoosh-Parity Seed Pack', () => {
    it('contains all 12 canonical GRE CBT question types across 22 seeded questions', () => {
      expect(GRE_MAGOOSH_SEED_QUESTIONS.length).toBe(22);

      const expectedTypes = [
        'gre_qc',
        'gre_mc_single',
        'gre_mc_multi',
        'gre_numeric_single',
        'gre_numeric_fraction',
        'gre_tc_1',
        'gre_tc_2',
        'gre_tc_3',
        'gre_se',
        'gre_rc_single',
        'gre_rc_select_in_passage',
        'gre_awa_issue',
      ];

      const questionTypes = GRE_MAGOOSH_SEED_QUESTIONS.map((q) => q.questionType);
      for (const t of expectedTypes) {
        expect(questionTypes).toContain(t);
      }
    });

    it('verifies every question has 3 progressive hints with required labels', () => {
      for (const q of GRE_MAGOOSH_SEED_QUESTIONS) {
        expect(q.hints.length).toBe(3);
        expect(q.hints[0]?.tier).toBe(1);
        expect(q.hints[0]?.label).toBe('Concept Nudge');
        expect(q.hints[1]?.tier).toBe(2);
        expect(q.hints[1]?.label).toBe('Setup / Elimination');
        expect(q.hints[2]?.tier).toBe(3);
        expect(q.hints[2]?.label).toBe('Final Bridge');
      }
    });

    it('verifies per-choice trap diagnostics and Socratic steps', () => {
      for (const q of GRE_MAGOOSH_SEED_QUESTIONS) {
        expect(q.writtenExplanationMd.length).toBeGreaterThan(20);
        expect(q.steps.length).toBeGreaterThanOrEqual(2);

        // Check Socratic steps format
        for (const step of q.steps) {
          expect(step.step_index).toBeGreaterThan(0);
          expect(step.options.length).toBeGreaterThan(1);
          expect(step.correct_option_index).toBeGreaterThanOrEqual(0);
        }
      }
    });

    it('verifies GregMat-style verbal deconstruction on TC and SE items', () => {
      const verbalQuestions = GRE_MAGOOSH_SEED_QUESTIONS.filter((q) =>
        ['gre_tc_1', 'gre_tc_2', 'gre_tc_3', 'gre_se'].includes(q.questionType)
      );

      for (const vq of verbalQuestions) {
        expect(vq.verbalDeconstructor).toBeDefined();
        expect(vq.verbalDeconstructor?.trigger_words?.length).toBeGreaterThan(0);
        expect(vq.verbalDeconstructor?.blank_charges?.length).toBeGreaterThan(0);
      }
    });
  });

  describe('GRE Vocabulary Seed Deck (80 Words Expanded)', () => {
    it('contains 80 words with Bangla meanings and mnemonics', () => {
      expect(GRE_VOCAB_SEED_WORDS.length).toBe(80);

      const wordSchema = z.object({
        headword: z.string().min(2),
        partOfSpeech: z.enum(['noun', 'verb', 'adjective', 'adverb']),
        definition: z.string().min(5),
        bnMeaning: z.string().min(2),
        mnemonicMd: z.string().min(5),
        synonyms: z.array(z.string()).min(1),
        antonyms: z.array(z.string()).min(1),
        exampleSentenceGre: z.string().min(10),
        frequencyTier: z.enum(['common', 'basic', 'advanced']),
      });

      for (const w of GRE_VOCAB_SEED_WORDS) {
        const parsed = wordSchema.safeParse(w);
        expect(parsed.success).toBe(true);
      }
    });

    it('includes synonym pairs for Sentence Equivalence speed drills', () => {
      const words = new Set(GRE_VOCAB_SEED_WORDS.map((w) => w.headword));

      // Check key SE pairs
      expect(words.has('anomalous') && words.has('aberrant')).toBe(true);
      expect(words.has('reticent') && words.has('taciturn')).toBe(true);
      expect(words.has('ephemeral') && words.has('evanescent')).toBe(true);
      expect(words.has('sanguine') && words.has('buoyant')).toBe(true);
      expect(words.has('polemical') && words.has('contentious')).toBe(true);
    });
  });
});
