/** @purpose Curated CD-IELTS & GRE typing corpora and pure Monkeytype-architecture telemetry math */

export type TypingCorpusId =
  | 'ielts-task2-band8'
  | 'ielts-task1-data'
  | 'ielts-listening-spelling'
  | 'gre-awa-issue';

export interface TypingCorpus {
  readonly id: TypingCorpusId;
  readonly titleEn: string;
  readonly titleBn: string;
  readonly subtitleEn: string;
  readonly subtitleBn: string;
  readonly badgeEn: string;
  readonly badgeBn: string;
  readonly passages: readonly string[];
  readonly vocabulary: readonly string[];
}

export const TYPING_CORPORA: Readonly<Record<TypingCorpusId, TypingCorpus>> = {
  'ielts-task2-band8': {
    id: 'ielts-task2-band8',
    titleEn: 'IELTS Task 2 — Band 8.5 Discursive Prose',
    titleBn: 'আইইএলটিএস টাস্ক ২ — ব্যান্ড ৮.৫ একাডেমিক প্রবন্ধ',
    subtitleEn:
      'Cohesive devices, subordinate clauses, and formal academic arguments for 250-word essay fluency.',
    subtitleBn:
      '২৫০ শব্দের প্রবন্ধ লেখার গতির জন্য কোহেসিভ ডিভাইস ও একাডেমিক বাক্য গঠন।',
    badgeEn: 'Task 2 · 250w Target',
    badgeBn: 'টাস্ক ২ · ২৫০ শব্দ',
    passages: [
      'Although rapid urbanization accelerates commercial productivity across developing economies, municipal authorities must balance industrial expansion against long-term ecological resilience. Consequently, investments in elevated rail corridors and permeable drainage infrastructure yield greater civic dividends than short-term highway subsidies.',
      'Whereas proponents of standardized testing argue that uniform benchmarks facilitate transparent university admissions, critics contend that high-stakes examinations narrow classroom inquiry. Nevertheless, when paired with longitudinal coursework assessments, calibrated diagnostics remain indispensable for identifying foundational literacy gaps.',
      'Furthermore, governments that subsidize preventative public healthcare consistently curtail emergency hospital expenditure over subsequent decades. In contrast, reactive clinical spending addresses acute symptoms without remedying the underlying nutritional and environmental determinants of chronic illness.',
    ],
    vocabulary: [
      'consequently',
      'nevertheless',
      'furthermore',
      'notwithstanding',
      'infrastructure',
      'productivity',
      'longitudinal',
      'indispensable',
      'sustainability',
      'unprecedented',
      'ameliorate',
      'disparity',
      'equilibrium',
      'prohibitive',
      'mitigate',
      'paradigm',
      'subsidize',
      'empirical',
      'determinants',
      'resilience',
    ],
  },
  'ielts-task1-data': {
    id: 'ielts-task1-data',
    titleEn: 'IELTS Academic Task 1 — Data & Trend Reports',
    titleBn: 'আইইএলটিএস টাস্ক ১ — ডেটা ও ট্রেন্ড বিশ্লেষণ',
    subtitleEn:
      'Statistical comparisons, percentages, years, fractions, and high-band trend verbs.',
    subtitleBn:
      'শতাংশ, সাল, ভগ্নাংশ এবং চার্ট বিশ্লেষণের উচ্চ-ব্যান্ড ক্রিয়াপদ অনুশীলন।',
    badgeEn: 'Task 1 · 150w Target',
    badgeBn: 'টাস্ক ১ · ১৫০ শব্দ',
    passages: [
      'Between 1995 and 2025, renewable electricity generation in coastal municipalities rose from 14.2% to 47.8%, outpacing coal consumption by a threefold margin. Conversely, industrial gas usage plateaued at roughly one-third of total grid demand after 2018.',
      'Overall, postgraduate enrollment among female engineering candidates climbed steadily from 18,400 in 2010 to 52,900 in 2024, representing an increase of nearly 187.5%. Meanwhile, part-time vocational registrations fluctuated between 11.4% and 15.6% throughout the same 14-year interval.',
      'By 2030, projected metropolitan rail ridership is expected to surpass 2.4 million daily journeys, roughly double the baseline figure recorded in 2015. In sharp contrast, private diesel vehicle registrations declined by 28.5% following the introduction of congestion surcharges.',
    ],
    vocabulary: [
      'plateaued',
      'outpaced',
      'conversely',
      'threefold',
      'fluctuated',
      'plummeted',
      'surpassed',
      'proportion',
      'respectively',
      'approximately',
      '47.8%',
      '1995-2025',
      '187.5%',
      'one-third',
      'twofold',
      'trajectory',
      'interval',
      'baseline',
      'marginally',
      'constituted',
    ],
  },
  'ielts-listening-spelling': {
    id: 'ielts-listening-spelling',
    titleEn: 'CD-IELTS Listening — High-Risk Spelling Traps',
    titleBn: 'সিডি-আইইএলটিএস লিসেনিং — বানান সতর্কতা ড্রিল',
    subtitleEn:
      'Double-consonant, silent-letter, and academic noun traps from Listening Parts 1–4.',
    subtitleBn:
      'লিসেনিং পার্ট ১–৪-এর জটিল বানান ও ডাবল-অক্ষর শব্দের নির্ভুল টাইপিং।',
    badgeEn: 'Listening · 0 Spelling Loss',
    badgeBn: 'লিসেনিং · নির্ভুল বানান',
    passages: [
      'Please submit the accommodation questionnaire to the university registrar before the millennium symposium convenes on Wednesday. Every entrepreneur attending the Mediterranean logistics seminar must verify the laboratory curriculum and committee hierarchy in advance.',
      'During Tuesday evening meteorology lectures, archaeology undergraduates examine how subterranean reservoirs preserved ancient agricultural calendars. A colleague from the pharmacy department distributed supplementary bibliography pamphlets alongside the accreditation schedule.',
      'Applicants requesting temporary dormitory maintenance should specify whether electrical wiring, plumbing, or ventilation requires immediate inspection. Remember to proofread possessive apostrophes, hyphenated compound adjectives, and plural suffixes before audio playback ends.',
    ],
    vocabulary: [
      'accommodation',
      'millennium',
      'questionnaire',
      'entrepreneur',
      'mediterranean',
      'colleague',
      'curriculum',
      'hierarchy',
      'archaeology',
      'meteorology',
      'maintenance',
      'committee',
      'accreditation',
      'parliament',
      'laboratory',
      'bibliography',
      'subterranean',
      'conscientious',
      'pronunciation',
      'bureaucracy',
    ],
  },
  'gre-awa-issue': {
    id: 'gre-awa-issue',
    titleEn: 'GRE® Analytical Writing — Issue Essay Prose',
    titleBn: 'জিআরই অ্যানালিটিক্যাল রাইটিং — ইস্যু প্রবন্ধ',
    subtitleEn:
      'Dense qualifiers, counterarguments, and nuanced thesis concessions for 30-minute AWA sprints.',
    subtitleBn:
      '৩০ মিনিটের জিআরই ইস্যু প্রবন্ধের জন্য পাল্টা যুক্তি ও সুসংহত একাডেমিক গদ্য।',
    badgeEn: 'GRE AWA · 30m Sprint',
    badgeBn: 'জিআরই এডব্লিউএ · ৩০ মিনিট',
    passages: [
      'Admittedly, empirical specialization empowers researchers to isolate intricate causal mechanisms within narrow subfields; however, exclusive reliance on insular expertise often obscures cross-disciplinary ethical consequences. Therefore, doctoral institutions should cultivate methodological rigor without sacrificing philosophical breadth.',
      'While populist rhetoric frequently portrays expert consensus as inherently paternalistic, complex regulatory decisions regarding epidemiology or monetary stability demand technical fluency that lay referenda rarely supply. Even so, democratic legitimacy requires institutions to articulate their evidentiary reasoning publicly.',
      'Paradoxically, technological automation can simultaneously expand aggregate economic output and erode civic cohesion if displaced workers lack retraining pathways. Consequently, productivity metrics alone provide an incomplete measure of societal progress unless paired with educational mobility.',
    ],
    vocabulary: [
      'admittedly',
      'paradoxically',
      'methodological',
      'epidemiology',
      'evidentiary',
      'paternalistic',
      'specialization',
      'cross-disciplinary',
      'consequently',
      'legitimacy',
      'dichotomy',
      'corroborate',
      'equivocal',
      'pragmatic',
      'ambiguous',
      'counterargument',
      'epistemology',
      'displaced',
      'articulate',
      'empirical',
    ],
  },
};

export type CharState = 'untyped' | 'c' | 'i' | 'm';

export interface WordCharVisual {
  char: string;
  state: CharState;
}

export interface WordDiffResult {
  chars: WordCharVisual[];
  extra: string[];
  counts: {
    c: number;
    i: number;
    e: number;
    m: number;
  };
  hasError: boolean;
}

/**
 * Computes Monkeytype c/i/e/m character states for a single word.
 * Completed words treat untyped trailing letters as missed ('m');
 * active words keep untyped trailing letters as 'untyped'.
 */
export function computeWordCharStates(
  targetWord: string,
  typedWord: string,
  isCompleted: boolean,
): WordDiffResult {
  const chars: WordCharVisual[] = [];
  let c = 0;
  let i = 0;
  let m = 0;

  for (let idx = 0; idx < targetWord.length; idx += 1) {
    const targetChar = targetWord[idx] ?? '';
    const typedChar = typedWord[idx];

    if (typedChar === undefined) {
      if (isCompleted) {
        chars.push({ char: targetChar, state: 'm' });
        m += 1;
      } else {
        chars.push({ char: targetChar, state: 'untyped' });
      }
    } else if (typedChar === targetChar) {
      chars.push({ char: targetChar, state: 'c' });
      c += 1;
    } else {
      chars.push({ char: targetChar, state: 'i' });
      i += 1;
    }
  }

  const extra: string[] = [];
  if (typedWord.length > targetWord.length) {
    for (let idx = targetWord.length; idx < typedWord.length; idx += 1) {
      extra.push(typedWord[idx] ?? '');
    }
  }
  const e = extra.length;

  return {
    chars,
    extra,
    counts: { c, i, e, m },
    hasError: i > 0 || e > 0 || m > 0,
  };
}

export interface CorpusCharTotals {
  c: number;
  i: number;
  e: number;
  m: number;
  spacesCorrect: number;
}

/**
 * Aggregates c/i/e/m character totals across all words up to activeWordIndex.
 * Completed words also credit 1 correct spacebar character when cleanly submitted.
 */
export function computeCorpusCharTotals(
  targetWords: readonly string[],
  typedWords: readonly string[],
  activeWordIndex: number,
): CorpusCharTotals {
  let c = 0;
  let i = 0;
  let e = 0;
  let m = 0;
  let spacesCorrect = 0;

  const limit = Math.min(targetWords.length - 1, activeWordIndex);
  for (let wIdx = 0; wIdx <= limit; wIdx += 1) {
    const target = targetWords[wIdx] ?? '';
    const typed = typedWords[wIdx] ?? '';
    const isCompleted = wIdx < activeWordIndex;
    const diff = computeWordCharStates(target, typed, isCompleted);
    c += diff.counts.c;
    i += diff.counts.i;
    e += diff.counts.e;
    m += diff.counts.m;
    if (isCompleted && !diff.hasError) {
      spacesCorrect += 1;
    }
  }

  return { c, i, e, m, spacesCorrect };
}

/** Monkeytype Net WPM: ((correctChars / 5) / (elapsedSeconds / 60)) rounded >= 0. */
export function calculateNetWpm(correctChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || correctChars <= 0) return 0;
  return Math.max(0, Math.round(correctChars / 5 / (elapsedSeconds / 60)));
}

/** Monkeytype Raw WPM: ((allTypedChars / 5) / (elapsedSeconds / 60)) rounded >= 0. */
export function calculateRawWpm(allTypedChars: number, elapsedSeconds: number): number {
  if (elapsedSeconds <= 0 || allTypedChars <= 0) return 0;
  return Math.max(0, Math.round(allTypedChars / 5 / (elapsedSeconds / 60)));
}

/** Keystroke accuracy % rounded to 1 decimal place; defaults to 100 when 0 keystrokes. */
export function calculateAccuracy(correctKeystrokes: number, totalKeystrokes: number): number {
  if (totalKeystrokes <= 0) return 100;
  const clamped = Math.max(0, Math.min(correctKeystrokes, totalKeystrokes));
  return Number(((clamped / totalKeystrokes) * 100).toFixed(1));
}

/** Coefficient-of-variation consistency mapped to 0–100% (100 for steady pacing). */
export function calculateConsistency(perSecondRawWpm: readonly number[]): number {
  if (perSecondRawWpm.length === 0) return 100;
  if (perSecondRawWpm.length === 1) return 100;

  const sum = perSecondRawWpm.reduce((acc, v) => acc + v, 0);
  const mean = sum / perSecondRawWpm.length;
  if (mean <= 0) return 0;

  const variance =
    perSecondRawWpm.reduce((acc, v) => acc + (v - mean) ** 2, 0) / perSecondRawWpm.length;
  const stdDev = Math.sqrt(variance);
  const cov = stdDev / mean;

  return Math.max(0, Math.min(100, Math.round((1 - cov) * 100)));
}

export interface TypingReadinessVerdict {
  netWpm: number;
  accuracy: number;
  minutesFor400Words: number | null;
  tier: 'band-8-ready' | 'band-7-ready' | 'building-fluency' | 'needs-speed-drill';
  labelEn: string;
  labelBn: string;
  guidanceEn: string;
  guidanceBn: string;
}

/**
 * Evaluates CD-IELTS Writing (150w Task 1 + 250w Task 2 = 400 words) readiness
 * based on verified Net WPM and accuracy.
 */
export function evaluateIeltsTypingReadiness(
  netWpm: number,
  accuracy: number,
): TypingReadinessVerdict {
  const minutesFor400Words = netWpm > 0 ? Number((400 / netWpm).toFixed(1)) : null;

  if (netWpm >= 55 && accuracy >= 95) {
    return {
      netWpm,
      accuracy,
      minutesFor400Words,
      tier: 'band-8-ready',
      labelEn: 'Band 8.0+ Exam Pacing Ready',
      labelBn: 'ব্যান্ড ৮.০+ পরীক্ষার গতির জন্য প্রস্তুত',
      guidanceEn:
        'You complete 400 words in under 7.5 minutes, leaving 52+ minutes of your 60-minute Writing paper for outlining and editing.',
      guidanceBn:
        'আপনি ৪০০ শব্দ ৭.৫ মিনিটের কমে টাইপ করতে পারেন—ফলে রাইটিং পেপারে পরিকল্পনা ও সম্পাদনার জন্য ৫২+ মিনিট হাতে থাকবে।',
    };
  }

  if (netWpm >= 40 && accuracy >= 92) {
    return {
      netWpm,
      accuracy,
      minutesFor400Words,
      tier: 'band-7-ready',
      labelEn: 'Band 7.0–7.5 Exam Pacing Ready',
      labelBn: 'ব্যান্ড ৭.০–৭.৫ পরীক্ষার গতির জন্য প্রস্তুত',
      guidanceEn:
        'Comfortable CD-IELTS typing speed. Aim for 95%+ accuracy on double-consonant words to protect Listening marks.',
      guidanceBn:
        'সিডি-আইইএলটিএস-এর জন্য উপযোগী গতি। লিসেনিং নম্বর সুরক্ষায় জটিল বানানে ৯৫%+ নির্ভুলতা ধরে রাখুন।',
    };
  }

  if (netWpm >= 25) {
    return {
      netWpm,
      accuracy,
      minutesFor400Words,
      tier: 'building-fluency',
      labelEn: 'Building Exam Fluency',
      labelBn: 'পরীক্ষার গতি গড়ে উঠছে',
      guidanceEn:
        'Target 40+ Net WPM so 400 words take 10 minutes or less, freeing cognitive bandwidth for Band 7+ cohesion.',
      guidanceBn:
        '৪০+ নেট WPM লক্ষ্য করুন যাতে ৪০০ শব্দ ১০ মিনিটে শেষ হয় এবং প্রবন্ধের মানোন্নয়নে মনোযোগ দেওয়া যায়।',
    };
  }

  return {
    netWpm,
    accuracy,
    minutesFor400Words,
    tier: 'needs-speed-drill',
    labelEn: 'Speed Foundation Recommended',
    labelBn: 'বেসিক গতি অনুশীলন প্রয়োজন',
    guidanceEn:
      'Run daily 60-second Task 2 and Listening spelling sprints to eliminate hunting-and-pecking before full mocks.',
    guidanceBn:
      'পূর্ণ মকের আগে প্রতিদিন ৬০ সেকেন্ডের টাস্ক ২ ও বানান স্প্রিন্ট অনুশীলন করে টাইপিং গতি বাড়ান।',
  };
}

export interface BuildTypingWordsOptions {
  targetCount: number;
  includePunctuation: boolean;
  includeNumbers: boolean;
  customWords?: readonly string[];
  seed?: number;
}

const CONTEXTUAL_STAT_FIGURES = [
  '47.8%',
  '1995-2025',
  '£48.50',
  '14B',
  '3.4M',
  '187.5%',
  '28.5%',
  '36/40',
] as const;

const FUNCTION_WORDS = new Set([
  'the',
  'a',
  'an',
  'from',
  'to',
  'in',
  'of',
  'for',
  'with',
  'how',
  'and',
  'or',
  'by',
  'at',
  'is',
  'are',
  'was',
  'were',
  'be',
  'been',
  'being',
  'that',
  'this',
  'these',
  'those',
  'as',
  'on',
  'into',
  'onto',
  'upon',
  'over',
  'under',
  'between',
  'among',
  'through',
  'during',
  'before',
  'after',
  'against',
  'across',
  'without',
  'within',
  'about',
  'but',
  'nor',
  'yet',
  'so',
  'than',
  'while',
  'although',
  'whereas',
  'when',
  'if',
  'unless',
  'whether',
  'whose',
  'which',
  'who',
  'whom',
  'it',
  'its',
  'their',
  'they',
  'them',
  'we',
  'our',
  'you',
  'your',
]);

function stripPunctuation(word: string): string {
  return word.replace(/^[,.;:!?()"'“”]+|[,.;:!?()"'“”]+$/g, '');
}

/** Builds a deterministic or seeded word list with grammar-aware punctuation & contextual numbers. */
export function buildTypingWords(
  corpusId: TypingCorpusId,
  options: BuildTypingWordsOptions,
): string[] {
  const { targetCount, includePunctuation, includeNumbers, customWords, seed = 0 } = options;

  if (customWords && customWords.length > 0) {
    const cleanPool = customWords.map((w) => w.trim()).filter(Boolean);
    const out: string[] = [];
    const total = Math.max(targetCount, cleanPool.length);
    for (let idx = 0; idx < total; idx += 1) {
      out.push(cleanPool[(idx + seed) % cleanPool.length] ?? cleanPool[0] ?? 'academic');
    }
    return out;
  }

  const corpus = TYPING_CORPORA[corpusId];
  const passageCount = corpus.passages.length;
  const orderedPassages = Array.from({ length: passageCount }, (_, idx) => {
    return corpus.passages[(idx + seed) % passageCount] ?? '';
  });

  const baseWords = orderedPassages
    .join(' ')
    .split(/\s+/)
    .map((w) => w.trim())
    .filter(Boolean);

  const pool = baseWords.length > 0 ? baseWords : [...corpus.vocabulary];
  const result: string[] = [];
  let numCursor = 0;

  for (let idx = 0; idx < targetCount * 2 && result.length < targetCount; idx += 1) {
    const rawToken = pool[idx % pool.length] ?? 'academic';
    const bareLower = stripPunctuation(rawToken).toLowerCase();
    const isFunctionWord = FUNCTION_WORDS.has(bareLower);

    let token = rawToken;
    if (!includePunctuation) {
      token = bareLower || 'academic';
    } else if (isFunctionWord) {
      // Never allow stray colons/semicolons/commas glued onto articles or prepositions
      token = rawToken.replace(/[,;:]+$/g, '');
    }

    // Inject contextual statistical figures only at natural clause/sentence boundaries
    const endsSentence = rawToken.endsWith('.');
    const endsClause = rawToken.endsWith(',');
    if (
      includeNumbers &&
      !isFunctionWord &&
      (endsSentence || (endsClause && idx % 2 === 0)) &&
      result.length + 1 < targetCount
    ) {
      const figure =
        CONTEXTUAL_STAT_FIGURES[(numCursor + seed) % CONTEXTUAL_STAT_FIGURES.length] ?? '47.8%';
      numCursor += 1;
      const cleanBase = stripPunctuation(token) || token;
      result.push(includePunctuation ? cleanBase : cleanBase.toLowerCase());
      if (result.length < targetCount) {
        const trailing = endsSentence ? '.' : ',';
        result.push(includePunctuation ? `(${figure})${trailing}` : figure);
      }
      continue;
    }

    result.push(token);
  }

  return result.slice(0, targetCount);
}

export interface LexicalUpgradePair {
  readonly id: string;
  readonly band6Phrase: string;
  readonly band8Target: string;
  readonly criterion: 'Lexical Resource' | 'Coherence & Cohesion' | 'Task Achievement';
  readonly contextNote: string;
  readonly contextNoteBn: string;
}

export const LEXICAL_UPGRADE_PAIRS: readonly LexicalUpgradePair[] = [
  {
    id: 'lex-surge',
    band6Phrase: 'went up a lot between 2010 and 2025',
    band8Target:
      'experienced a pronounced surge between 2010 and 2025, outpacing regional projections.',
    criterion: 'Lexical Resource',
    contextNote: 'Replaces informal phrasal verbs with precise Task 1 trend collocations.',
    contextNoteBn: 'অনানুষ্ঠানিক ক্রিয়াপদের পরিবর্তে টাস্ক ১-এর নিখুঁত ট্রেন্ড কোলোকেশন।',
  },
  {
    id: 'lex-cohesion',
    band6Phrase: 'but on the other hand, some people think differently',
    band8Target:
      'Nevertheless, critics contend that uniform benchmarks narrow exploratory inquiry.',
    criterion: 'Coherence & Cohesion',
    contextNote: 'Eliminates conversational fillers in favor of formal concession markers.',
    contextNoteBn: 'কথ্য রূপ বাদ দিয়ে আনুষ্ঠানিক কনসেশন মার্কার ব্যবহার।',
  },
  {
    id: 'lex-mitigate',
    band6Phrase: 'help to make the bad effects smaller',
    band8Target:
      'mitigate the adverse ecological consequences of rapid industrial expansion.',
    criterion: 'Lexical Resource',
    contextNote: 'High-value verb-noun collocation ("mitigate adverse consequences").',
    contextNoteBn: 'ব্যান্ড ৮.৫-এর উপযোগী শক্তিশালী ক্রিয়া-বিশেষ্য কোলোকেশন।',
  },
  {
    id: 'lex-plateau',
    band6Phrase: 'stayed at the same level for five years',
    band8Target:
      'plateaued at approximately one-third of total municipal demand after 2018.',
    criterion: 'Task Achievement',
    contextNote: 'Combines exact chart terminology ("plateaued") with proportional framing.',
    contextNoteBn: 'সঠিক চার্ট পরিভাষা ও আনুপাতিক ডেটা উপস্থাপনা।',
  },
  {
    id: 'lex-disparity',
    band6Phrase: 'a very big difference between rich and poor areas',
    band8Target:
      'a widening socio-economic disparity between metropolitan hubs and rural districts.',
    criterion: 'Lexical Resource',
    contextNote: 'Uses hyphenated academic compound modifiers and precise nouns.',
    contextNoteBn: 'হাইফেনযুক্ত একাডেমিক কম্পাউন্ড ও সুনির্দিষ্ট বিশেষ্য।',
  },
  {
    id: 'lex-indispensable',
    band6Phrase: 'is very important for solving the problem',
    band8Target:
      'remains indispensable for remedying foundational literacy gaps across cohorts.',
    criterion: 'Lexical Resource',
    contextNote: 'Upgrades overused "very important" to Band 8+ academic register.',
    contextNoteBn: '"very important"-এর পরিবর্তে উচ্চ-ব্যান্ড একাডেমিক শব্দচয়ন।',
  },
];

export interface ListeningDictationItem {
  readonly id: string;
  readonly part: 'Part 1 Form' | 'Part 2 Map' | 'Part 3 Seminar' | 'Part 4 Lecture';
  readonly audioCueText: string;
  readonly targetWords: string;
  readonly accent: 'en-GB' | 'en-AU' | 'en-US';
  readonly trapNote: string;
  readonly trapNoteBn: string;
}

export const LISTENING_DICTATION_ITEMS: readonly ListeningDictationItem[] = [
  {
    id: 'dict-p1-accommodation',
    part: 'Part 1 Form',
    audioCueText:
      'Please write accommodation and questionnaire on the registration form before Wednesday.',
    targetWords: 'accommodation questionnaire registration Wednesday',
    accent: 'en-GB',
    trapNote: 'Double c & double m in "accommodation"; double n in "questionnaire".',
    trapNoteBn: '"accommodation"-এ ডাবল c ও m এবং "questionnaire"-এ ডাবল n লক্ষ্য রাখুন।',
  },
  {
    id: 'dict-p1-fee',
    part: 'Part 1 Form',
    audioCueText:
      'The refundable deposit is forty-eight pounds fifty, payable at the registrar office.',
    targetWords: 'refundable deposit £48.50 registrar office',
    accent: 'en-GB',
    trapNote: 'British currency formatting (£48.50) and single-r ending in "registrar".',
    trapNoteBn: 'ব্রিটিশ মুদ্রা ফরম্যাট (£48.50) এবং "registrar" বানান সতর্কতা।',
  },
  {
    id: 'dict-p2-map',
    part: 'Part 2 Map',
    audioCueText:
      'Walk past the Mediterranean courtyard toward the subterranean exhibition corridor.',
    targetWords: 'Mediterranean courtyard subterranean exhibition corridor',
    accent: 'en-AU',
    trapNote: 'Australian vowel shift in "corridor"; double r in "Mediterranean" & "subterranean".',
    trapNoteBn: 'অস্ট্রেলীয় উচ্চারণে "corridor" ও ডাবল-অক্ষর বানান অনুশীলন।',
  },
  {
    id: 'dict-p3-seminar',
    part: 'Part 3 Seminar',
    audioCueText:
      'Every entrepreneur must verify the committee hierarchy and accreditation schedule.',
    targetWords: 'entrepreneur committee hierarchy accreditation schedule',
    accent: 'en-GB',
    trapNote: 'Triple-double consonants in "committee"; silent-e pattern in "entrepreneur".',
    trapNoteBn: '"committee"-তে ডাবল m, t, e এবং "entrepreneur" বানান ট্র্যাপ।',
  },
  {
    id: 'dict-p4-lecture',
    part: 'Part 4 Lecture',
    audioCueText:
      'Archaeology and meteorology undergraduates compiled a supplementary bibliography.',
    targetWords: 'archaeology meteorology undergraduates supplementary bibliography',
    accent: 'en-US',
    trapNote: '"aeo" cluster in "archaeology" and double p in "supplementary".',
    trapNoteBn: '"archaeology"-তে aeo যুক্তাক্ষর এবং "supplementary"-তে ডাবল p।',
  },
  {
    id: 'dict-p4-millennium',
    part: 'Part 4 Lecture',
    audioCueText:
      'Parliamentary bureaucracy delayed laboratory maintenance until the millennium.',
    targetWords: 'parliamentary bureaucracy laboratory maintenance millennium',
    accent: 'en-GB',
    trapNote: 'Silent "i" in "parliamentary"; "eau" in "bureaucracy"; double l & n in "millennium".',
    trapNoteBn: '"bureaucracy"-তে eau এবং "millennium"-এ ডাবল l ও n সতর্কতা।',
  },
];

export interface IeltsParagraphSplitStage {
  readonly id: 'plan' | 'intro' | 'body' | 'proofread';
  readonly labelEn: string;
  readonly labelBn: string;
  readonly minutes: number;
  readonly wordRangeEn: string;
  readonly focusEn: string;
}

export interface IeltsParagraphSplitPlan {
  readonly targetTask: 'task1' | 'task2' | 'gre-awa';
  readonly targetWordCount: number;
  readonly totalExamMinutes: number;
  readonly estimatedTypingMinutes: number;
  readonly stages: readonly IeltsParagraphSplitStage[];
}

/** Calculates exact IELTS Task 1 / Task 2 / GRE AWA paragraph & proofreading minute splits. */
export function calculateIeltsParagraphSplits(
  targetTask: 'task1' | 'task2' | 'gre-awa',
  currentNetWpm: number,
): IeltsParagraphSplitPlan {
  const safeWpm = Math.max(20, currentNetWpm || 40);
  const config =
    targetTask === 'task1'
      ? { targetWordCount: 150, totalExamMinutes: 20, planMin: 3, proofMin: 3 }
      : targetTask === 'task2'
        ? { targetWordCount: 250, totalExamMinutes: 40, planMin: 6, proofMin: 5 }
        : { targetWordCount: 400, totalExamMinutes: 30, planMin: 4, proofMin: 4 };

  const estimatedTypingMinutes = Number((config.targetWordCount / safeWpm).toFixed(1));
  const writingBudget = config.totalExamMinutes - config.planMin - config.proofMin;
  const introMin = Math.max(2, Math.round(writingBudget * 0.22));
  const bodyMin = Math.max(4, writingBudget - introMin);

  return {
    targetTask,
    targetWordCount: config.targetWordCount,
    totalExamMinutes: config.totalExamMinutes,
    estimatedTypingMinutes,
    stages: [
      {
        id: 'plan',
        labelEn: '1. Planning & Outline',
        labelBn: '১. পরিকল্পনা ও রূপরেখা',
        minutes: config.planMin,
        wordRangeEn: '0w (Notes)',
        focusEn:
          targetTask === 'task1'
            ? 'Identify key trends, extremes, and groupings.'
            : 'Lock thesis position and 2–3 topic sentences.',
      },
      {
        id: 'intro',
        labelEn: targetTask === 'task1' ? '2. Intro & Overview' : '2. Introduction & Thesis',
        labelBn: targetTask === 'task1' ? '২. ভূমিকা ও ওভারভিউ' : '২. ভূমিকা ও মূল বক্তব্য',
        minutes: introMin,
        wordRangeEn: `1–${Math.round(config.targetWordCount * 0.25)}w`,
        focusEn: 'Paraphrase prompt cleanly without copying phrasing.',
      },
      {
        id: 'body',
        labelEn: `3. Body Paragraphs (${config.targetWordCount}w)`,
        labelBn: `৩. মূল অনুচ্ছেদ (${config.targetWordCount} শব্দ)`,
        minutes: bodyMin,
        wordRangeEn: `${Math.round(config.targetWordCount * 0.25)}–${config.targetWordCount}w`,
        focusEn: 'Develop evidence, comparisons, and Band 8+ cohesive links.',
      },
      {
        id: 'proofread',
        labelEn: '4. Final Proofreading & Spelling Audit',
        labelBn: '৪. চূড়ান্ত প্রুফরিডিং ও বানান যাচাই',
        minutes: config.proofMin,
        wordRangeEn: `${config.targetWordCount}+w`,
        focusEn: 'Verify subject-verb agreement, articles, and double consonants.',
      },
    ],
  };
}
