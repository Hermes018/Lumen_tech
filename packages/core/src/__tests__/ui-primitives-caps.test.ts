/** @purpose Word-cap validation helper and unit tests enforcing the 12 Lumen UI Laws copy limits */
import { describe, expect, it } from 'vitest';
import { MARKETING_CONTENT, type MarketingLocaleData } from '../../../../apps/web/src/content/marketing';

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

const BANNED_JARGON = [
  'protocol',
  'matrix',
  'architecture',
  'Rasch',
  'SM-2',
  'Magoosh',
  'GregMat',
  'Seeded Live Demo',
] as const;

function collectStrings(node: unknown, path = ''): Array<{ path: string; value: string }> {
  if (typeof node === 'string') {
    return [{ path, value: node }];
  }
  if (Array.isArray(node)) {
    return node.flatMap((item, idx) => collectStrings(item, `${path}[${idx}]`));
  }
  if (node !== null && typeof node === 'object') {
    return Object.entries(node).flatMap(([key, val]) =>
      collectStrings(val, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

function collectShape(node: unknown, path = ''): string[] {
  if (Array.isArray(node)) {
    return [
      `${path}:array(${node.length})`,
      ...node.flatMap((item, idx) => collectShape(item, `${path}[${idx}]`)),
    ];
  }
  if (node !== null && typeof node === 'object') {
    const keys = Object.keys(node).sort();
    return [
      `${path}:keys(${keys.join(',')})`,
      ...keys.flatMap((key) =>
        collectShape((node as Record<string, unknown>)[key], path ? `${path}.${key}` : key),
      ),
    ];
  }
  return [`${path}:${typeof node}`];
}

function getAllPricingPlans(data: MarketingLocaleData) {
  return [...data.pricing.tabs.fullCourses, ...data.pricing.tabs.passes];
}

describe('MARKETING_CONTENT Bilingual Store (Batch P2)', () => {
  it('maintains full structural key parity between en and bn', () => {
    expect(collectShape(MARKETING_CONTENT.en)).toEqual(collectShape(MARKETING_CONTENT.bn));
  });

  it('enforces strict word caps across all titles, hero bodies, intros, columns, and pricing bullets', () => {
    for (const locale of ['en', 'bn'] as const) {
      const data = MARKETING_CONTENT[locale];
      const allStrings = collectStrings(data, locale);

      for (const { path, value } of allStrings) {
        if (path.endsWith('.title') || path.endsWith('.faqTitle') || path.endsWith('.catalogTitle')) {
          expect(
            countWords(value),
            `${path} exceeded ${WORD_CAPS.title} words: "${value}"`,
          ).toBeLessThanOrEqual(WORD_CAPS.title);
        }

        if (path.endsWith('.hero.body')) {
          expect(
            countWords(value),
            `${path} exceeded ${WORD_CAPS.heroBody} words: "${value}"`,
          ).toBeLessThanOrEqual(WORD_CAPS.heroBody);
        }

        if (path.endsWith('.intro') || path.endsWith('.catalogIntro')) {
          expect(
            countWords(value),
            `${path} exceeded ${WORD_CAPS.sectionIntro} words: "${value}"`,
          ).toBeLessThanOrEqual(WORD_CAPS.sectionIntro);
        }

        if (
          (path.endsWith('.body') && !path.endsWith('.hero.body')) ||
          path.endsWith('.forWhom') ||
          path.endsWith('.answer')
        ) {
          expect(
            countWords(value),
            `${path} exceeded ${WORD_CAPS.columnBody} words: "${value}"`,
          ).toBeLessThanOrEqual(WORD_CAPS.columnBody);
        }
      }

      for (const plan of getAllPricingPlans(data)) {
        expect(
          plan.bullets.length,
          `${locale} pricing plan "${plan.id}" has more than 4 bullets`,
        ).toBeLessThanOrEqual(4);
        for (const bullet of plan.bullets) {
          expect(
            countWords(bullet),
            `${locale} pricing bullet "${bullet}" exceeded ${WORD_CAPS.pricingBullet} words`,
          ).toBeLessThanOrEqual(WORD_CAPS.pricingBullet);
        }
      }
    }
  });

  it('contains zero banned jargon words anywhere in MARKETING_CONTENT', () => {
    const allStrings = collectStrings(MARKETING_CONTENT, 'MARKETING_CONTENT');
    const violations: string[] = [];

    for (const { path, value } of allStrings) {
      for (const banned of BANNED_JARGON) {
        const regex = new RegExp(`\\b${banned.replace('-', '\\-')}\\b`, 'i');
        if (regex.test(value)) {
          violations.push(`${path} contains banned term "${banned}": "${value}"`);
        }
      }
    }

    expect(violations).toEqual([]);
  });

  it('uses Latin digits for en prices and Bengali digits for bn prices', () => {
    const enPrices = [
      ...MARKETING_CONTENT.en.courses.items.map((c) => c.price),
      ...getAllPricingPlans(MARKETING_CONTENT.en).map((p) => p.price),
    ];
    const bnPrices = [
      ...MARKETING_CONTENT.bn.courses.items.map((c) => c.price),
      ...getAllPricingPlans(MARKETING_CONTENT.bn).map((p) => p.price),
    ];

    for (const price of enPrices) {
      expect(price).toMatch(/^৳ [0-9,]+$/);
      expect(price).not.toMatch(/[০-৯]/);
    }

    for (const price of bnPrices) {
      expect(price).toMatch(/^৳ [০-৯,]+$/);
      expect(price).not.toMatch(/[0-9]/);
    }
  });
});
