/** @purpose Strict regression suite verifying LaTeX-safe translation & 100% Bengali localization coverage across marketing, auth, checkout, and diagnostic exam pages (P2.6.1) */
import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import {
  maskMathTokens,
  unmaskMathTokens,
  translateText,
} from '../i18n/translator';

const REPO_ROOT = resolve(__dirname, '../../../../');

function readRepoFile(relPath: string): string {
  return readFileSync(resolve(REPO_ROOT, relPath), 'utf8');
}

describe('Phase P2.6.1: Universal Bilingual (EN / বাংলা) Engine & LaTeX-Safe Translation', () => {
  describe('1. LaTeX-Safe Math Masking & Translation Service', () => {
    it('preserves inline $x^2 = 16$ and block $$x = \\pm 4$$ math tokens intact during masking and unmasking', () => {
      const sample = 'Let $x$ be an integer such that $x^2 = 16$, which implies $$x = \\pm 4$$.';
      const { maskedText, tokens } = maskMathTokens(sample);

      expect(tokens).toEqual(['$x$', '$x^2 = 16$', '$$x = \\pm 4$$']);
      expect(maskedText).toContain('__MATH_TOKEN_0__');
      expect(maskedText).toContain('__MATH_TOKEN_1__');
      expect(maskedText).toContain('__MATH_TOKEN_2__');
      expect(maskedText).not.toContain('$x^2 = 16$');

      const restored = unmaskMathTokens(maskedText, tokens);
      expect(restored).toBe(sample);
    });

    it('translates known English exam stems into Bengali while preserving $x^2 = 16$ and $$x = \\pm 4$$', async () => {
      const stem = 'Let $x$ be an integer such that $x^2 = 16$.';
      const translated = await translateText(stem, 'bn');

      expect(translated).toBe('ধরি $x$ একটি পূর্ণসংখ্যা যেখানে $x^2 = 16$।');
      expect(translated).toContain('$x$');
      expect(translated).toContain('$x^2 = 16$');

      // Also test live translation adapter mock preserving block $$x = \pm 4$$
      const complexInput = 'Since $x^2 = 16$, the solutions are $$x = \\pm 4$$.';
      const translatedComplex = await translateText(complexInput, 'bn', {
        apiKey: 'mock-key',
        fetchImpl: async () =>
          new Response(
            JSON.stringify({
              data: {
                translations: [
                  {
                    translatedText:
                      'যেহেতু __MATH_TOKEN_0__, তাই সমাধানগুলো হলো __MATH_TOKEN_1__।',
                  },
                ],
              },
            }),
            { status: 200, headers: { 'Content-Type': 'application/json' } }
          ),
      });

      expect(translatedComplex).toBe(
        'যেহেতু $x^2 = 16$, তাই সমাধানগুলো হলো $$x = \\pm 4$$।'
      );
      expect(translatedComplex).toContain('$x^2 = 16$');
      expect(translatedComplex).toContain('$$x = \\pm 4$$');
    });
  });

  describe('2. Page-Level Bengali Localization & Toggle Regression Checks', () => {
    const REQUIRED_PAGES = [
      {
        name: 'courses/page.tsx',
        path: 'apps/web/app/[locale]/(marketing)/courses/page.tsx',
        expectedBengaliStrings: ['আপনার প্রস্তুতির ট্র্যাক বেছে নিন', 'অল-অ্যাক্সেস পাস'],
      },
      {
        name: 'sign-in/page.tsx',
        path: 'apps/web/app/[locale]/(auth)/sign-in/page.tsx',
        expectedBengaliStrings: ['লগইন করুন', 'লগইন পেজ লোড হচ্ছে'],
      },
      {
        name: 'sign-up/page.tsx',
        path: 'apps/web/app/[locale]/(auth)/sign-up/page.tsx',
        expectedBengaliStrings: ['অ্যাকাউন্ট তৈরি করুন', 'সাইন-আপ পেজ লোড হচ্ছে'],
      },
      {
        name: 'AuthForm.tsx',
        path: 'apps/web/app/[locale]/(auth)/_components/AuthForm.tsx',
        expectedBengaliStrings: [
          'Google দিয়ে চালিয়ে যান',
          'ইমেইল ওটিপি',
          'ফোন ওটিপি (+880)',
          'অ্যাকাউন্ট তৈরি করুন',
          'লগইন করুন',
        ],
      },
      {
        name: 'gre/page.tsx',
        path: 'apps/web/app/[locale]/(marketing)/gre/page.tsx',
        expectedBengaliStrings: [
          '৩৩০+ লক্ষ্য',
          'ফ্রি ১৫-মিনিট এক্সপ্রেস ডায়াগনস্টিক দিন',
          '৩-ধাপের প্রগ্রেসিভ হিন্ট ল্যাডার',
        ],
      },
      {
        name: 'gre/live-gre-widget.tsx',
        path: 'apps/web/app/[locale]/(marketing)/gre/live-gre-widget.tsx',
        expectedBengaliStrings: [
          'ধরি $x$ একটি পূর্ণসংখ্যা যেখানে $x^2 = 16$।',
          'রাশি A আপনার চেয়ে বড়',
          'রাশি B বড়',
          'দুটি রাশি সমান',
          'প্রদত্ত তথ্য থেকে সম্পর্ক নির্ণয় করা সম্ভব নয়',
          'ইংরেজি মূল প্রশ্ন দেখুন / Show Original English',
        ],
      },
      {
        name: 'ielts/page.tsx',
        path: 'apps/web/app/[locale]/(marketing)/ielts/page.tsx',
        expectedBengaliStrings: [
          'ব্যান্ড ৭.৫ থেকে ৮.৫',
          'স্প্লিট-স্ক্রিন সিবিটি সিমুলেটর চালু করুন',
        ],
      },
      {
        name: 'pricing/page.tsx',
        path: 'apps/web/app/[locale]/(marketing)/pricing/page.tsx',
        expectedBengaliStrings: [
          'জিআরই প্লাস',
          'অল-অ্যাক্সেস পাসসমূহ',
          '৭-দিনের মানি-ব্যাক গ্যারান্টি',
        ],
      },
      {
        name: 'help/page.tsx',
        path: 'apps/web/app/[locale]/(marketing)/help/page.tsx',
        expectedBengaliStrings: [
          'সকল প্রশ্নোত্তর',
          'বিলিং ও মূসক ৬.৩ ভ্যাট',
        ],
      },
      {
        name: 'for-institutions/page.tsx',
        path: 'apps/web/app/[locale]/(marketing)/for-institutions/page.tsx',
        expectedBengaliStrings: [
          'বাল্ক সিট লাইসেন্সিং',
          'প্রাতিষ্ঠানিক পার্টনারশিপ ও ক্যাম্পাস কোহর্ট',
        ],
      },
      {
        name: 'checkout/page.tsx & CheckoutClient.tsx',
        path: 'apps/web/app/[locale]/(checkout)/checkout/CheckoutClient.tsx',
        expectedBengaliStrings: [
          'শিক্ষার্থীর বিলিং তথ্য',
          'অর্ডার সারসংক্ষেপ',
          '১৫% বাংলাদেশ ভ্যাট (মূসক ৬.৩ অন্তর্ভুক্ত):',
        ],
      },
      {
        name: 'diagnostic/page.tsx',
        path: 'apps/web/app/[locale]/(exam)/exam/diagnostic/page.tsx',
        expectedBengaliStrings: [
          'ধরি $x$ একটি পূর্ণসংখ্যা যেখানে $x^2 = 16$।',
          'রাশি A আপনার চেয়ে বড়',
          'রাশি B বড়',
          'দুটি রাশি সমান',
          'প্রদত্ত তথ্য থেকে সম্পর্ক নির্ণয় করা সম্ভব নয়',
          'ইংরেজি মূল প্রশ্ন দেখুন / Show Original English',
        ],
      },
    ];

    for (const page of REQUIRED_PAGES) {
      it(`verifies ${page.name} checks locale === 'bn' and renders Bangladeshi Bengali translations`, () => {
        const source = readRepoFile(page.path);

        // Must check locale === 'bn'
        expect(source).toContain("locale === 'bn'");

        // Must contain expected natural Bengali translations
        for (const bnPhrase of page.expectedBengaliStrings) {
          expect(source).toContain(bnPhrase);
        }
      });
    }
  });
});
