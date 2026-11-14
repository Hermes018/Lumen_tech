/** @purpose Word-cap validation helper and unit tests enforcing the 12 Lumen UI Laws copy limits */
import { describe, expect, it } from 'vitest';

export const WORD_CAPS = {
  title: 10,
  heroBody: 35,
  sectionIntro: 60,
  columnBody: 40,
  pricingBullet: 10,
} as const;

export type WordCapSlot = keyof typeof WORD_CAPS;

/** Counts whitespace-delimited words in English or Bengali copy. */
export function countWords(text: string): number {
  const trimmed = text.trim();
  if (!trimmed) return 0;
  return trimmed.split(/\s+/).length;
}

export function assertWordCap(text: string, slot: WordCapSlot): boolean {
  return countWords(text) <= WORD_CAPS[slot];
}

describe('UI Primitives Word-Cap Rules (Law 6)', () => {
  it('counts words accurately across whitespace, punctuation, and Bengali Unicode', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   ')).toBe(0);
    expect(countWords('GRE & IELTS Mock Workbench')).toBe(5);
    expect(countWords('  Multiple   spaces\tand\nnewlines  ')).toBe(4);
    expect(countWords('কম্পিউটার-ভিত্তিক জিআরই ও আইইএলটিএস প্রস্তুতি')).toBe(5);
  });

  it('enforces title <= 10 words', () => {
    const validTitle = 'Institutional GRE and IELTS Preparation for Bangladesh Scholars';
    const invalidTitle =
      'This title deliberately contains eleven words to exceed the strict ten word cap';

    expect(countWords(validTitle)).toBeLessThanOrEqual(WORD_CAPS.title);
    expect(assertWordCap(validTitle, 'title')).toBe(true);
    expect(countWords(invalidTitle)).toBeGreaterThan(WORD_CAPS.title);
    expect(assertWordCap(invalidTitle, 'title')).toBe(false);
  });

  it('enforces heroBody <= 35 words', () => {
    const validHero =
      'Prepare for computer-delivered GRE and 4-skill IELTS with adaptive mock exams, bilingual vocabulary cards, and transparent rubric feedback.';
    const invalidHero = Array.from({ length: 36 }, (_, i) => `word${i + 1}`).join(' ');

    expect(assertWordCap(validHero, 'heroBody')).toBe(true);
    expect(assertWordCap(invalidHero, 'heroBody')).toBe(false);
  });

  it('enforces sectionIntro <= 60 words', () => {
    const validIntro = Array.from({ length: 60 }, (_, i) => `term${i + 1}`).join(' ');
    const invalidIntro = Array.from({ length: 61 }, (_, i) => `term${i + 1}`).join(' ');

    expect(assertWordCap(validIntro, 'sectionIntro')).toBe(true);
    expect(assertWordCap(invalidIntro, 'sectionIntro')).toBe(false);
  });

  it('enforces columnBody <= 40 words', () => {
    const validCol =
      'Section-adaptive GRE Quantitative and Verbal mocks with 1,500+ FSRS vocabulary cards and analytical writing rubric feedback.';
    const invalidCol = Array.from({ length: 41 }, (_, i) => `col${i + 1}`).join(' ');

    expect(assertWordCap(validCol, 'columnBody')).toBe(true);
    expect(assertWordCap(invalidCol, 'columnBody')).toBe(false);
  });
});
