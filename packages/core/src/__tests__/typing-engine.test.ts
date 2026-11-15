/** @purpose Unit tests for Monkeytype-architecture CD-IELTS & GRE typing corpora, WPM/accuracy/consistency/c-i-e-m math, readiness verdicts, and surface wiring (BATCH P32) */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  LEXICAL_UPGRADE_PAIRS,
  LISTENING_DICTATION_ITEMS,
  TYPING_CORPORA,
  buildTypingWords,
  calculateAccuracy,
  calculateConsistency,
  calculateIeltsParagraphSplits,
  calculateNetWpm,
  calculateRawWpm,
  computeCorpusCharTotals,
  computeWordCharStates,
  evaluateIeltsTypingReadiness,
} from '../../../../apps/web/src/content/typing-corpora';

const REPO_ROOT = path.resolve(__dirname, '../../../..');

describe('Typing Engine Telemetry Math (Monkeytype Architecture — P32)', () => {
  it('computes Net WPM and Raw WPM accurately using standard 5-char word normalization', () => {
    expect(calculateNetWpm(250, 60)).toBe(50);
    expect(calculateNetWpm(150, 30)).toBe(60);
    expect(calculateNetWpm(0, 30)).toBe(0);
    expect(calculateNetWpm(100, 0)).toBe(0);

    expect(calculateRawWpm(300, 60)).toBe(60);
    expect(calculateRawWpm(180, 30)).toBe(72);
    expect(calculateRawWpm(0, 30)).toBe(0);
  });

  it('computes keystroke accuracy percentage and handles empty keystrokes cleanly', () => {
    expect(calculateAccuracy(0, 0)).toBe(100);
    expect(calculateAccuracy(95, 100)).toBe(95);
    expect(calculateAccuracy(193, 200)).toBe(96.5);
    expect(calculateAccuracy(120, 100)).toBe(100);
  });

  it('computes coefficient-of-variation consistency score across 0–100%', () => {
    expect(calculateConsistency([])).toBe(100);
    expect(calculateConsistency([60])).toBe(100);
    expect(calculateConsistency([60, 60, 60, 60])).toBe(100);
    expect(calculateConsistency([0, 0, 0])).toBe(0);

    const steady = calculateConsistency([58, 60, 62, 59, 61]);
    const erratic = calculateConsistency([20, 95, 15, 100]);
    expect(steady).toBeGreaterThan(90);
    expect(erratic).toBeLessThan(50);
  });

  it('computes c/i/e/m character states for active and completed words', () => {
    // Active word partially typed: trailing chars remain 'untyped', not 'm'
    const activePartial = computeWordCharStates('millennium', 'mille', false);
    expect(activePartial.counts).toEqual({ c: 5, i: 0, e: 0, m: 0 });
    expect(activePartial.chars.slice(5).every((ch) => ch.state === 'untyped')).toBe(true);
    expect(activePartial.hasError).toBe(false);

    // Completed word submitted early: trailing chars become 'm' (missed)
    const completedEarly = computeWordCharStates('millennium', 'mille', true);
    expect(completedEarly.counts).toEqual({ c: 5, i: 0, e: 0, m: 5 });
    expect(completedEarly.hasError).toBe(true);

    // Word with substitution ('i') and extra characters ('e')
    const typoExtra = computeWordCharStates('plateau', 'plaxeauss', true);
    expect(typoExtra.counts).toEqual({ c: 6, i: 1, e: 2, m: 0 });
    expect(typoExtra.extra).toEqual(['s', 's']);
    expect(typoExtra.hasError).toBe(true);
  });

  it('aggregates c/i/e/m totals and spacebar credits across a word sequence', () => {
    const target = ['rapid', 'urbanization', 'grows'];
    const typed = ['rapid', 'urbanzation', 'gr'];
    const totals = computeCorpusCharTotals(target, typed, 2);

    // Word 0 ('rapid'): 5c + 1 clean spacebar
    // Word 1 ('urbanization' vs 'urbanzation'): 5c ('urban'), 6i ('zation' vs 'izatio'), 1m ('n')
    // Word 2 active ('grows' vs 'gr'): 2c
    expect(totals.c).toBe(12);
    expect(totals.i).toBe(6);
    expect(totals.e).toBe(0);
    expect(totals.m).toBe(1);
    expect(totals.spacesCorrect).toBe(1);
  });

  it('evaluates CD-IELTS 400-word readiness time and tier verdicts accurately', () => {
    const band8 = evaluateIeltsTypingReadiness(60, 97.5);
    expect(band8.minutesFor400Words).toBe(6.7);
    expect(band8.tier).toBe('band-8-ready');

    const band7 = evaluateIeltsTypingReadiness(40, 93.0);
    expect(band7.minutesFor400Words).toBe(10);
    expect(band7.tier).toBe('band-7-ready');

    const building = evaluateIeltsTypingReadiness(32, 91.0);
    expect(building.minutesFor400Words).toBe(12.5);
    expect(building.tier).toBe('building-fluency');

    const drill = evaluateIeltsTypingReadiness(0, 100);
    expect(drill.minutesFor400Words).toBeNull();
    expect(drill.tier).toBe('needs-speed-drill');
  });
});

describe('Curated CD-IELTS & GRE Typing Corpora (P32)', () => {
  it('provides all 4 exam-authentic categories with authentic tokens', () => {
    expect(Object.keys(TYPING_CORPORA)).toEqual([
      'ielts-task2-band8',
      'ielts-task1-data',
      'ielts-listening-spelling',
      'gre-awa-issue',
    ]);

    const task1Text = TYPING_CORPORA['ielts-task1-data'].passages.join(' ');
    expect(task1Text).toContain('47.8%');
    expect(task1Text).toContain('threefold');
    expect(task1Text).toContain('plateaued');

    const listeningVocab = TYPING_CORPORA['ielts-listening-spelling'].vocabulary;
    for (const word of ['accommodation', 'millennium', 'questionnaire', 'entrepreneur', 'mediterranean']) {
      expect(listeningVocab).toContain(word);
    }
  });

  it('builds word queues with punctuation/numbers modifiers and custom missed-word drills', () => {
    const plain = buildTypingWords('ielts-task2-band8', {
      targetCount: 30,
      includePunctuation: false,
      includeNumbers: false,
    });
    expect(plain).toHaveLength(30);
    expect(plain.every((w) => !/[.,;:!?]$/.test(w))).toBe(true);

    const withNumbers = buildTypingWords('ielts-task1-data', {
      targetCount: 35,
      includePunctuation: true,
      includeNumbers: true,
    });
    expect(withNumbers).toHaveLength(35);
    expect(withNumbers.some((w) => /\d/.test(w))).toBe(true);

    const custom = buildTypingWords('ielts-listening-spelling', {
      targetCount: 15,
      includePunctuation: false,
      includeNumbers: false,
      customWords: ['accommodation', 'millennium', 'questionnaire'],
    });
    expect(custom).toHaveLength(15);
    expect(custom.every((w) => ['accommodation', 'millennium', 'questionnaire'].includes(w))).toBe(
      true,
    );
  });
});

describe('Typing Studio UI, Route & Catalog Integration Guards (P32)', () => {
  it('verifies TypingPracticeEngine uses Monkeytype DOM architecture without a <textarea> shortcut', () => {
    const enginePath = path.join(
      REPO_ROOT,
      'apps/web/src/components/typing/TypingPracticeEngine.tsx',
    );
    const content = fs.readFileSync(enginePath, 'utf8');

    expect(content).toContain('id="testConfig"');
    expect(content).toContain('id="liveStatsMini"');
    expect(content).toContain('id="wordsWrapper"');
    expect(content).toContain('id="wordsInput"');
    expect(content).toContain('id="caret"');
    expect(content).toContain('data-word-index');
    expect(content).toContain('data-letter-index');
    expect(content).toContain('data-extra="true"');
    expect(content).toContain('WorkspaceDataTable');
    expect(content).toContain('Practice Missed Words Only →');
    expect(content).toContain('Preview Sample Telemetry');
    expect(content).toContain('Out of focus — Click or press any key to resume');
    expect(content).not.toMatch(/<textarea\b/);
  });

  it('verifies /app/typing, /tools/ielts-typing-test, nav.ts, sitemap.ts, and payment-guard.ts wiring', () => {
    const learnerLayout = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(learner)/layout.tsx'),
      'utf8',
    );
    expect(learnerLayout).toContain("href: '/app/typing'");
    expect(learnerLayout).toContain('CD-IELTS Typing Studio');

    const ieltsPage = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(learner)/app/ielts/page.tsx'),
      'utf8',
    );
    expect(ieltsPage).toContain('/app/typing');

    const navSrc = fs.readFileSync(path.join(REPO_ROOT, 'apps/web/src/content/nav.ts'), 'utf8');
    expect(navSrc).toContain('/tools/ielts-typing-test');

    const sitemapSrc = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/sitemap.ts'),
      'utf8',
    );
    expect(sitemapSrc).toContain('/tools/ielts-typing-test');

    const guardSrc = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/src/lib/security/payment-guard.ts'),
      'utf8',
    );
    expect(guardSrc).toContain('CD-IELTS Typing Studio');
  });
});

describe('Curriculum-Aligned Typing Upgrades & Grammar-Aware Punctuation (P35)', () => {
  it('never glues random colons, semicolons, or commas onto function words or subterranean', () => {
    const functionWords = [
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
    ];
    const corpora = [
      'ielts-task2-band8',
      'ielts-task1-data',
      'ielts-listening-spelling',
      'gre-awa-issue',
    ] as const;

    for (const corpusId of corpora) {
      for (let seed = 0; seed < 4; seed += 1) {
        const words = buildTypingWords(corpusId, {
          targetCount: 140,
          includePunctuation: true,
          includeNumbers: true,
          seed,
        });
        expect(words).toHaveLength(140);
        for (const fw of functionWords) {
          expect(words).not.toContain(`${fw}:`);
          expect(words).not.toContain(`${fw};`);
          expect(words).not.toContain(`${fw},`);
        }
        expect(words).not.toContain('subterranean;');
        expect(words).not.toContain('the:');
        expect(words).not.toContain('from:');
      }
    }
  });

  it('exports valid LEXICAL_UPGRADE_PAIRS, LISTENING_DICTATION_ITEMS, and calculateIeltsParagraphSplits', () => {
    expect(LEXICAL_UPGRADE_PAIRS.length).toBeGreaterThanOrEqual(5);
    for (const pair of LEXICAL_UPGRADE_PAIRS) {
      expect(pair.id.length).toBeGreaterThan(0);
      expect(pair.band6Phrase.length).toBeGreaterThan(5);
      expect(pair.band8Target.length).toBeGreaterThan(10);
      expect(['Lexical Resource', 'Coherence & Cohesion', 'Task Achievement']).toContain(
        pair.criterion,
      );
    }

    expect(LISTENING_DICTATION_ITEMS.length).toBeGreaterThanOrEqual(5);
    for (const item of LISTENING_DICTATION_ITEMS) {
      expect(['Part 1 Form', 'Part 2 Map', 'Part 3 Seminar', 'Part 4 Lecture']).toContain(
        item.part,
      );
      expect(['en-GB', 'en-AU', 'en-US']).toContain(item.accent);
      expect(item.audioCueText.length).toBeGreaterThan(10);
      expect(item.targetWords.split(/\s+/).length).toBeGreaterThanOrEqual(3);
    }

    const task1Plan = calculateIeltsParagraphSplits('task1', 50);
    expect(task1Plan.targetWordCount).toBe(150);
    expect(task1Plan.totalExamMinutes).toBe(20);
    expect(task1Plan.stages).toHaveLength(4);
    expect(task1Plan.stages.reduce((acc, s) => acc + s.minutes, 0)).toBe(20);

    const task2Plan = calculateIeltsParagraphSplits('task2', 50);
    expect(task2Plan.targetWordCount).toBe(250);
    expect(task2Plan.totalExamMinutes).toBe(40);
    expect(task2Plan.stages).toHaveLength(4);
    expect(task2Plan.stages.reduce((acc, s) => acc + s.minutes, 0)).toBe(40);
  });

  it('verifies TypingPracticeEngine exposes all 4 P35 curriculum drill modes and blind audio controls', () => {
    const enginePath = path.join(
      REPO_ROOT,
      'apps/web/src/components/typing/TypingPracticeEngine.tsx',
    );
    const content = fs.readFileSync(enginePath, 'utf8');

    expect(content).toContain('Copy-Flow Speed (Monkeytype)');
    expect(content).toContain('Listening Audio Dictation (Blind Spelling)');
    expect(content).toContain('Band 6.0 -> 8.5 Lexical Upgrade');
    expect(content).toContain('Exam Pacing Coach (Task 1 150w / Task 2 250w)');
    expect(content).toContain('Speak Passage / Word (en-GB / en-AU)');
    expect(content).toContain('Mask Unreached Words (Dictation Blind Mode)');
  });
});
