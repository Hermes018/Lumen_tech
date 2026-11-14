/** @purpose LaTeX-safe translation service with deterministic dictionary cache and Google Translate API adapter */

export interface MaskedMathResult {
  maskedText: string;
  tokens: string[];
}

/**
 * Masks block (`$$...$$`) and inline (`$...$`) KaTeX math expressions with placeholders
 * (`__MATH_TOKEN_0__`, `__MATH_TOKEN_1__`, ...) so translation APIs never corrupt math formulas.
 */
export function maskMathTokens(text: string): MaskedMathResult {
  const tokens: string[] = [];
  // Match block math $$...$$ first, then inline math $...$
  const maskedText = text.replace(/\$\$[\s\S]+?\$\$|\$[^$\n]+?\$/g, (match) => {
    const idx = tokens.length;
    tokens.push(match);
    return `__MATH_TOKEN_${idx}__`;
  });

  return { maskedText, tokens };
}

/**
 * Restores masked `__MATH_TOKEN_N__` placeholders back to their original `$...$` or `$$...$$` math strings.
 */
export function unmaskMathTokens(maskedText: string, tokens: string[]): string {
  return maskedText.replace(/__\s*MATH_TOKEN_(\d+)\s*__/gi, (fullMatch, indexStr: string) => {
    const idx = Number(indexStr);
    return tokens[idx] !== undefined ? tokens[idx] : fullMatch;
  });
}

/**
 * Pre-compiled deterministic English -> Bangladeshi Bengali dictionary cache for UI and exam strings.
 */
export const BENGALI_TRANSLATION_DICTIONARY: Record<string, string> = {
  // Common Quantitative Comparison & Exam Question Stems (with masked tokens or exact strings)
  'Let $x$ be an integer such that $x^2 = 16$.': 'ধরি $x$ একটি পূর্ণসংখ্যা যেখানে $x^2 = 16$।',
  'Let __MATH_TOKEN_0__ be an integer such that __MATH_TOKEN_1__.':
    'ধরি __MATH_TOKEN_0__ একটি পূর্ণসংখ্যা যেখানে __MATH_TOKEN_1__।',
  'Quantity A': 'রাশি A',
  'Quantity B': 'রাশি B',
  'Quantity A is greater.': 'রাশি A বড় (Quantity A আপনার চেয়ে বড়)।',
  'Quantity B is greater.': 'রাশি B বড়।',
  'The two quantities are equal.': 'দুটি রাশি সমান।',
  'The relationship cannot be determined from the information given.':
    'প্রদত্ত তথ্য থেকে সম্পর্ক নির্ণয় করা সম্ভব নয়।',
  'The relationship cannot be determined.': 'প্রদত্ত তথ্য থেকে সম্পর্ক নির্ণয় করা সম্ভব নয়।',
  'In the xy-plane, what is the distance between the points $(2, 3)$ and $(5, 7)$?':
    '$xy$-সমতলে $(2, 3)$ এবং $(5, 7)$ বিন্দু দুটির মধ্যকার দূরত্ব কত?',
  'In the xy-plane, what is the distance between the points __MATH_TOKEN_0__ and __MATH_TOKEN_1__?':
    'xy-সমতলে __MATH_TOKEN_0__ এবং __MATH_TOKEN_1__ বিন্দু দুটির মধ্যকার দূরত্ব কত?',
  'A set $S$ consists of 5 consecutive odd integers.':
    'একটি সেট $S$ ৫টি ক্রমিক বিজোড় পূর্ণসংখ্যা নিয়ে গঠিত।',
  'A set __MATH_TOKEN_0__ consists of 5 consecutive odd integers.':
    'একটি সেট __MATH_TOKEN_0__ ৫টি ক্রমিক বিজোড় পূর্ণসংখ্যা নিয়ে গঠিত।',
  'The average (arithmetic mean) of set $S$': 'সেট $S$-এর গড় (গাণিতিক গড়)',
  'The average (arithmetic mean) of set __MATH_TOKEN_0__': 'সেট __MATH_TOKEN_0__-এর গড় (গাণিতিক গড়)',
  'The median of set $S$': 'সেট $S$-এর মধ্যক (Median)',
  'The median of set __MATH_TOKEN_0__': 'সেট __MATH_TOKEN_0__-এর মধ্যক (Median)',
  'Working alone at their constant rates, Machine A fills a tank in 3 hours, and Machine B fills it in 6 hours. How many hours will it take both machines working together?':
    'নির্দিষ্ট হারে একা কাজ করলে মেশিন A একটি ট্যাংক ৩ ঘণ্টায় এবং মেশিন B তা ৬ ঘণ্টায় পূর্ণ করে। দুটি মেশিন একসাথে কাজ করলে ট্যাংকটি পূর্ণ হতে কত ঘণ্টা সময় লাগবে?',
  // Auth & Navigation phrases
  'Continue with Google': 'Google দিয়ে চালিয়ে যান',
  'Email OTP': 'ইমেইল ওটিপি',
  'Phone OTP (+880)': 'ফোন ওটিপি (+880)',
  'Create an account': 'অ্যাকাউন্ট তৈরি করুন',
  'Sign in': 'লগইন করুন',
  'Show Original English': 'ইংরেজি মূল প্রশ্ন দেখুন',
};

export interface TranslateTextOptions {
  apiKey?: string;
  enableLiveTranslation?: boolean;
  fetchImpl?: typeof fetch;
}

/**
 * Translates text into the target locale (`en` or `bn`) while strictly preserving `$...$` and `$$...$$` math tokens.
 * 1. Returns original text immediately if targetLocale is 'en' or empty.
 * 2. Checks deterministic pre-compiled dictionary cache (both raw and math-masked keys).
 * 3. If not cached and `apiKey` or `enableLiveTranslation` is provided, calls Google Translate API on the math-masked text and restores math tokens cleanly.
 */
export async function translateText(
  text: string,
  targetLocale: 'en' | 'bn' | string,
  options?: TranslateTextOptions
): Promise<string> {
  if (!text || targetLocale === 'en') {
    return text;
  }

  // 1. Direct exact match in deterministic dictionary cache
  if (targetLocale === 'bn' && BENGALI_TRANSLATION_DICTIONARY[text]) {
    return BENGALI_TRANSLATION_DICTIONARY[text]!;
  }

  // 2. Mask math tokens ($...$ and $$...$$) before lookup or external translation
  const { maskedText, tokens } = maskMathTokens(text);

  if (targetLocale === 'bn' && BENGALI_TRANSLATION_DICTIONARY[maskedText]) {
    return unmaskMathTokens(BENGALI_TRANSLATION_DICTIONARY[maskedText]!, tokens);
  }

  const apiKey = options?.apiKey || process.env['GOOGLE_TRANSLATE_API_KEY'];
  const fetcher = options?.fetchImpl ?? (typeof fetch !== 'undefined' ? fetch : undefined);

  // 3. Call official Google Cloud Translation v2 API if apiKey is configured
  if (apiKey && fetcher) {
    try {
      const response = await fetcher(
        `https://translation.googleapis.com/language/translate/v2?key=${encodeURIComponent(apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            q: maskedText,
            target: targetLocale,
            format: 'text',
          }),
        }
      );

      if (response.ok) {
        const data = (await response.json()) as {
          data?: { translations?: Array<{ translatedText?: string }> };
        };
        const translatedMasked = data.data?.translations?.[0]?.translatedText;
        if (translatedMasked) {
          return unmaskMathTokens(translatedMasked, tokens);
        }
      }
    } catch {
      // Fall through to gtx endpoint or safe fallback
    }
  }

  // 4. Optional lightweight Google Translate GTX fallback if live translation is explicitly enabled
  if (options?.enableLiveTranslation && fetcher) {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${encodeURIComponent(
        targetLocale
      )}&dt=t&q=${encodeURIComponent(maskedText)}`;
      const response = await fetcher(url);
      if (response.ok) {
        const data = (await response.json()) as unknown[];
        if (Array.isArray(data) && Array.isArray(data[0])) {
          const segments = data[0] as Array<[string]>;
          const combined = segments.map((seg) => (Array.isArray(seg) ? seg[0] : '')).join('');
          if (combined) {
            return unmaskMathTokens(combined, tokens);
          }
        }
      }
    } catch {
      // Safe fallback to unmasked original text
    }
  }

  // 5. Always restore math tokens cleanly
  return unmaskMathTokens(maskedText, tokens);
}
