/** @purpose 4-Mode FSRS Vocab & Formula Flashcard Player (/app/vocab/play) in Pearl/Bone institutional stationery style */
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { Button } from '@lumen/ui';
import {
  FSRSRating,
  scheduleNextReview,
  previewAllRatings,
  type CardState,
  type SchedulingResult,
} from '@lumen/core';
import { GRE_VOCAB_SEED_WORDS, type SeedVocabWord } from '@lumen/db';
import { ArrowLeft, RotateCw, Volume2, Clock } from 'lucide-react';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';

type ReviewMode = 'flip' | 'cloze' | 'se_pair_drill' | 'quant_formula';

interface QuantFormulaCard {
  title: string;
  category: string;
  frontMd: string;
  backMd: string;
  trapWarning: string;
}

const QUANT_FORMULA_CARDS: QuantFormulaCard[] = [
  {
    title: 'F.R.O.Z.E.N. QC Trap Checklist',
    category: 'Quantitative Comparison',
    frontMd: 'What is the "F.R.O.Z.E.N." checklist for Quant Comparison testing?',
    backMd:
      'F: Fractions (e.g. 1/2)\nR: Repeated numbers (same value for x & y)\nO: One (1)\nZ: Zero (0)\nE: Extremes (1,000,000)\nN: Negatives (-1, -10)',
    trapWarning: 'Testing only positive integers is the #1 reason learners miss QC questions.',
  },
  {
    title: 'Sum of Interior Angles of an n-sided Polygon',
    category: 'Geometry',
    frontMd: 'What is the formula for the sum of the interior angles of an n-sided polygon?',
    backMd:
      'Sum = (n - 2) * 180 degrees\n\nFor a hexagon (n=6): (6-2)*180 = 720 degrees.',
    trapWarning:
      'Do not confuse with the exterior angles sum, which is always 360 degrees for ANY convex polygon.',
  },
  {
    title: 'Even & Odd Exponent Roots ($x^2 = k$ vs $x^3 = k$)',
    category: 'Algebra',
    frontMd: 'If $x^2 = 25$, what are the values of $x$? If $y^3 = -64$, what is $y$?',
    backMd:
      'x = +5 or -5 (two roots for even powers)\ny = -4 (single root for odd powers, preserving sign)',
    trapWarning: 'Even exponents yield two roots (+ and -); odd exponents yield exactly one root.',
  },
];

function VocabPlayerContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isBn = locale === 'bn';
  const initialMode = (searchParams?.get('mode') as ReviewMode) || 'flip';

  const [mode, setMode] = React.useState<ReviewMode>(initialMode);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  const [words] = React.useState<SeedVocabWord[]>(GRE_VOCAB_SEED_WORDS);

  const [cardStates, setCardStates] = React.useState<Record<string, CardState>>(() => {
    const initial: Record<string, CardState> = {};
    words.forEach((w) => {
      initial[w.headword] = {
        stability: 0,
        difficulty: 0,
        reps: 0,
        lapses: 0,
        state: 'new',
      };
    });
    return initial;
  });

  const [clozeUserAnswer, setClozeUserAnswer] = React.useState('');
  const [clozeChecked, setClozeChecked] = React.useState(false);

  const [timeLeft, setTimeLeft] = React.useState(15);
  const [timerActive, setTimerActive] = React.useState(false);
  const [selectedSynonyms, setSelectedSynonyms] = React.useState<string[]>([]);

  const activeWord = words[currentIdx] ?? words[0]!;
  const activeFSRSState = cardStates[activeWord.headword] ?? {
    stability: 0,
    difficulty: 0,
    reps: 0,
    lapses: 0,
    state: 'new' as const,
  };

  const ratingPreviews: Record<number, SchedulingResult> = React.useMemo(() => {
    return previewAllRatings(activeFSRSState);
  }, [activeFSRSState]);

  const handleRate = React.useCallback(
    (rating: FSRSRating) => {
      const result = scheduleNextReview(activeFSRSState, rating);
      setCardStates((prev) => ({
        ...prev,
        [activeWord.headword]: result.card,
      }));

      setIsFlipped(false);
      setClozeChecked(false);
      setClozeUserAnswer('');
      setSelectedSynonyms([]);
      setTimeLeft(15);

      if (currentIdx < words.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        setCurrentIdx(0);
      }
    },
    [activeFSRSState, activeWord.headword, currentIdx, words.length]
  );

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        return;
      }
      if (e.key === ' ' || e.code === 'Space') {
        e.preventDefault();
        setIsFlipped((prev) => !prev);
      } else if (isFlipped) {
        if (e.key === '1') handleRate(FSRSRating.Again);
        if (e.key === '2') handleRate(FSRSRating.Hard);
        if (e.key === '3') handleRate(FSRSRating.Good);
        if (e.key === '4') handleRate(FSRSRating.Easy);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFlipped, handleRate]);

  React.useEffect(() => {
    if (mode !== 'se_pair_drill' || !timerActive) return;

    if (timeLeft <= 0) {
      setIsFlipped(true);
      setTimerActive(false);
      return;
    }

    const interval = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [mode, timerActive, timeLeft]);

  React.useEffect(() => {
    if (mode === 'se_pair_drill') {
      setTimeLeft(15);
      setTimerActive(true);
      setIsFlipped(false);
    }
  }, [mode, currentIdx]);

  const speakWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(activeWord.headword);
      utterance.lang = 'en-US';
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 pb-12">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col justify-between gap-3 border-b border-[var(--hairline)] pb-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <LocaleLink
            href="/app/vocab"
            className="flex items-center gap-1 text-xs font-semibold text-[var(--text)] transition-colors hover:text-[var(--brand)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isBn ? 'ভোকাব হাব' : 'Vocab Hub'}</span>
          </LocaleLink>
          <span className="text-[var(--hairline)]">|</span>
          <span className="text-xs font-bold text-[var(--brand-ink)]">
            {isBn
              ? `কার্ড ${currentIdx + 1} / ${words.length}`
              : `Card ${currentIdx + 1} of ${words.length}`}
          </span>
        </div>

        {/* 4 Mode Tabs */}
        <div className="flex flex-wrap items-center gap-1 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] p-1 text-xs">
          <button
            type="button"
            onClick={() => setMode('flip')}
            className={`cursor-pointer rounded-[4px] px-2.5 py-1 font-semibold transition-colors ${
              mode === 'flip'
                ? 'bg-[var(--brand-deep)] text-white'
                : 'text-[var(--text)] hover:text-[var(--brand-ink)]'
            }`}
          >
            {isBn ? 'ক্লাসিক ফ্লিপ' : 'Classic Flip'}
          </button>
          <button
            type="button"
            onClick={() => setMode('cloze')}
            className={`cursor-pointer rounded-[4px] px-2.5 py-1 font-semibold transition-colors ${
              mode === 'cloze'
                ? 'bg-[var(--brand-deep)] text-white'
                : 'text-[var(--text)] hover:text-[var(--brand-ink)]'
            }`}
          >
            {isBn ? 'ক্লোজ' : 'Cloze'}
          </button>
          <button
            type="button"
            onClick={() => setMode('se_pair_drill')}
            className={`cursor-pointer rounded-[4px] px-2.5 py-1 font-semibold transition-colors ${
              mode === 'se_pair_drill'
                ? 'bg-[var(--brand)] text-white'
                : 'text-[var(--text)] hover:text-[var(--brand-ink)]'
            }`}
          >
            {isBn ? '১৫ সেকেন্ড সমার্থক' : '15s Synonym'}
          </button>
          <button
            type="button"
            onClick={() => setMode('quant_formula')}
            className={`cursor-pointer rounded-[4px] px-2.5 py-1 font-semibold transition-colors ${
              mode === 'quant_formula'
                ? 'bg-[var(--brand-deep)] text-white'
                : 'text-[var(--text)] hover:text-[var(--brand-ink)]'
            }`}
          >
            {isBn ? 'কোয়ান্ট ফাঁদ' : 'Quant Traps'}
          </button>
        </div>
      </div>

      {/* 15s Countdown bar for Synonym Speed Drill */}
      {mode === 'se_pair_drill' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1 text-[var(--terracotta)]">
              <Clock className="h-3.5 w-3.5" />
              {isBn ? '১৫-সেকেন্ড স্পিড ড্রিল' : '15-Second Speed Drill'}
            </span>
            <span className={timeLeft <= 3 ? 'font-bold text-[var(--brand)]' : 'text-[var(--text)]'}>
              {isBn ? `${timeLeft} সেকেন্ড বাকি` : `${timeLeft}s remaining`}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-none border border-[var(--hairline)] bg-[var(--bg-warm)]">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeLeft <= 3
                  ? 'bg-[var(--crimson)]'
                  : timeLeft <= 7
                    ? 'bg-[var(--accent)]'
                    : 'bg-[var(--brand)]'
              }`}
              style={{ width: `${(timeLeft / 15) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* MODE 1: CLASSIC FLIP */}
      {mode === 'flip' && (
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setIsFlipped((prev) => !prev);
          }}
          className="flex min-h-[340px] cursor-pointer flex-col justify-between rounded-[4px] border border-[var(--hairline)] border-t-4 border-t-[var(--brand)] bg-[var(--surface-paper)] p-8 transition-colors select-none hover:border-[var(--brand)]"
        >
          {/* Card Front / Back Header */}
          <div className="flex items-center justify-between">
            <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-2.5 py-0.5 font-mono text-xs font-semibold text-[var(--brand-ink)] uppercase">
              {activeWord.frequencyTier} &bull; {activeWord.partOfSpeech}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-[var(--text)]">
              <RotateCw className="h-3.5 w-3.5" />
              <span>{isBn ? 'উল্টাতে ক্লিক বা Space চাপুন' : 'Tap or Space to Flip'}</span>
            </div>
          </div>

          {/* Main Card Content */}
          {!isFlipped ? (
            <div className="my-auto space-y-3 text-center">
              <h2 className="font-serif text-4xl font-extrabold tracking-tight text-[var(--brand-ink)]">
                {activeWord.headword}
              </h2>
              <div className="flex items-center justify-center gap-2 font-mono text-sm text-[var(--text)]">
                <span>/əˈnɒm.ə.li/</span>
                <button
                  type="button"
                  onClick={speakWord}
                  className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] p-1.5 text-[var(--brand)] transition-colors hover:bg-[var(--bg-tint)]"
                  aria-label={isBn ? 'উচ্চারণ শুনুন' : 'Play audio'}
                >
                  <Volume2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="my-auto space-y-4">
              <div className="border-b border-[var(--hairline)] pb-3 text-center">
                <h3 className="text-2xl font-bold text-[var(--brand-ink)]">{activeWord.headword}</h3>
                <p className="mt-1 text-base font-semibold text-[var(--brand)]">
                  বাংলা: {activeWord.bnMeaning}
                </p>
              </div>

              <div className="space-y-2.5 text-sm">
                <div>
                  <span className="text-xs font-semibold text-[var(--text)] uppercase">
                    {isBn ? 'সংজ্ঞা:' : 'Definition:'}
                  </span>
                  <p className="font-medium text-[var(--brand-ink)]">{activeWord.definition}</p>
                </div>

                <div>
                  <span className="text-xs font-semibold text-[var(--text)] uppercase">
                    {isBn ? 'জিআরই বাক্য:' : 'GRE Context:'}
                  </span>
                  <p className="font-serif italic text-[var(--brand-ink)]">
                    &ldquo;{activeWord.exampleSentenceGre}&rdquo;
                  </p>
                </div>

                {activeWord.mnemonicMd && (
                  <div className="rounded-[4px] border border-[var(--brand)]/25 bg-[var(--bg-tint)] p-3 text-xs text-[var(--brand-ink)]">
                    <span className="font-bold text-[var(--brand)]">
                      {isBn ? 'মনে রাখার কৌশল: ' : 'Mnemonic Hook: '}
                    </span>
                    {activeWord.mnemonicMd}
                  </div>
                )}

                {activeWord.synonyms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs font-semibold text-[var(--text)]">
                      {isBn ? 'সমার্থক শব্দ:' : 'Synonyms:'}
                    </span>
                    {activeWord.synonyms.map((syn: string) => (
                      <span
                        key={syn}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-2 py-0.5 font-mono text-xs text-[var(--brand-ink)]"
                      >
                        {syn}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer cue */}
          <div className="text-center text-xs text-[var(--text)]">
            {!isFlipped
              ? isBn
                ? 'অর্থ ও বাংলা ব্যাখ্যা দেখতে কার্ডে ক্লিক করুন'
                : 'Click card to reveal definition & Bangla gloss'
              : isBn
                ? 'পরবর্তী রিভিউ নির্ধারণ করতে নিচে রেটিং দিন'
                : 'Rate your recall below to schedule next review'}
          </div>
        </div>
      )}

      {/* MODE 2: CLOZE CONTEXT */}
      {mode === 'cloze' && (
        <div className="flex min-h-[340px] flex-col justify-between space-y-4 rounded-[4px] border border-[var(--hairline)] border-t-4 border-t-[var(--brand-deep)] bg-[var(--surface-paper)] p-8">
          <div className="flex items-center justify-between">
            <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-ink)]">
              {isBn ? 'ক্লোজ কনটেক্সট মোড' : 'Cloze Context Mode'}
            </span>
            <span className="font-mono text-xs text-[var(--text)]">{activeWord.partOfSpeech}</span>
          </div>

          <div className="my-auto space-y-4">
            <p className="font-serif text-lg leading-relaxed text-[var(--brand-ink)]">
              &ldquo;
              {activeWord.exampleSentenceGre.replace(
                new RegExp(activeWord.headword, 'gi'),
                '________'
              )}
              &rdquo;
            </p>

            <div className="flex max-w-sm items-center gap-2">
              <input
                type="text"
                value={clozeUserAnswer}
                onChange={(e) => setClozeUserAnswer(e.target.value)}
                placeholder={isBn ? 'লক্ষ্য শব্দটি লিখুন...' : 'Type the target word...'}
                className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
              />
              <Button
                size="sm"
                className="rounded-[4px] bg-[var(--brand)] text-white hover:bg-[var(--brand-deep)]"
                onClick={() => {
                  setClozeChecked(true);
                  setIsFlipped(true);
                }}
              >
                {isBn ? 'যাচাই করুন' : 'Check'}
              </Button>
            </div>

            {clozeChecked && (
              <div className="space-y-2 rounded-[4px] border border-[var(--brand)]/30 bg-[var(--bg-tint)] p-4">
                <div className="flex flex-wrap items-center gap-2 font-bold text-[var(--brand-ink)]">
                  <span>
                    {isBn ? 'সঠিক শব্দ:' : 'Target:'} {activeWord.headword}
                  </span>
                  <span className="text-sm text-[var(--brand)]">({activeWord.bnMeaning})</span>
                </div>
                <p className="text-xs text-[var(--text)]">{activeWord.definition}</p>
              </div>
            )}
          </div>

          <div className="text-center text-xs text-[var(--text)]">
            {isBn
              ? 'প্রাসঙ্গিক বাক্য পূরণ জিআরই রিডিংয়ে সক্রিয় স্মরণ বাড়ায়।'
              : 'Sentence completion strengthens active recall in contextual GRE reading.'}
          </div>
        </div>
      )}

      {/* MODE 3: 15s SYNONYM SPEED DRILL */}
      {mode === 'se_pair_drill' && (
        <div className="flex min-h-[340px] flex-col justify-between space-y-4 rounded-[4px] border border-[var(--hairline)] border-t-4 border-t-[var(--accent)] bg-[var(--surface-paper)] p-8">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-[4px] border border-[var(--accent)]/40 bg-[var(--bg-warm)] px-2.5 py-0.5 text-xs font-semibold text-[var(--terracotta)]">
                {isBn ? 'সেন্টেন্স ইকুইভ্যালেন্স জোড়া ম্যাচিং' : 'Sentence Equivalence Pair Matching'}
              </span>
              <span className="font-mono text-xs text-[var(--text)]">
                {isBn ? 'ঠিক ২টি সমার্থক শব্দ বাছাই করুন' : 'Select exactly 2 synonyms'}
              </span>
            </div>
            <h3 className="mt-2 font-serif text-2xl font-extrabold text-[var(--brand-ink)]">
              {isBn ? 'শব্দ:' : 'Target:'} {activeWord.headword}
            </h3>
          </div>

          {/* 6 Choices */}
          <div className="my-auto grid grid-cols-2 gap-2.5">
            {[
              activeWord.synonyms[0] || 'divergence',
              activeWord.synonyms[1] || 'departure',
              'regularity',
              'conformity',
              'consistency',
              'standard',
            ].map((synOption) => {
              const isSelected = selectedSynonyms.includes(synOption);
              return (
                <button
                  key={synOption}
                  type="button"
                  onClick={() => {
                    if (selectedSynonyms.includes(synOption)) {
                      setSelectedSynonyms(selectedSynonyms.filter((s) => s !== synOption));
                    } else if (selectedSynonyms.length < 2) {
                      const next = [...selectedSynonyms, synOption];
                      setSelectedSynonyms(next);
                      if (next.length === 2) {
                        setIsFlipped(true);
                      }
                    }
                  }}
                  className={`cursor-pointer rounded-[4px] border p-3 text-left text-xs font-semibold transition-colors ${
                    isSelected
                      ? 'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand)]'
                      : 'border-[var(--hairline)] bg-[var(--bg)] text-[var(--brand-ink)] hover:border-[var(--brand)]/60'
                  }`}
                >
                  {synOption}
                </button>
              );
            })}
          </div>

          {isFlipped && (
            <div className="rounded-[4px] border border-[var(--accent)]/40 bg-[var(--bg-warm)] p-3 text-xs text-[var(--brand-ink)]">
              <span className="font-bold text-[var(--terracotta)]">
                {isBn ? 'সমার্থক জোড়া: ' : 'Synonym Pair: '}
              </span>
              {activeWord.synonyms.join(' & ')} &bull; বাংলা: {activeWord.bnMeaning}
            </div>
          )}
        </div>
      )}

      {/* MODE 4: QUANT FORMULAS & TRAPS */}
      {mode === 'quant_formula' && (
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setIsFlipped((prev) => !prev);
          }}
          className="flex min-h-[340px] cursor-pointer flex-col justify-between rounded-[4px] border border-[var(--hairline)] border-t-4 border-t-[var(--terracotta)] bg-[var(--surface-paper)] p-8 transition-colors select-none hover:border-[var(--brand)]"
        >
          {(() => {
            const card = QUANT_FORMULA_CARDS[currentIdx % QUANT_FORMULA_CARDS.length]!;
            return (
              <>
                <div className="flex items-center justify-between">
                  <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-ink)]">
                    {card.category}
                  </span>
                  <span className="text-xs text-[var(--text)]">
                    {isBn ? 'উল্টাতে ক্লিক করুন' : 'Tap to Flip'}
                  </span>
                </div>

                {!isFlipped ? (
                  <div className="my-auto space-y-3 text-center">
                    <h3 className="text-xl font-bold text-[var(--brand-ink)]">{card.title}</h3>
                    <p className="text-sm font-medium text-[var(--text)]">{card.frontMd}</p>
                  </div>
                ) : (
                  <div className="my-auto space-y-4">
                    <div className="border-b border-[var(--hairline)] pb-2">
                      <h4 className="text-lg font-bold text-[var(--brand-ink)]">{card.title}</h4>
                    </div>
                    <div className="whitespace-pre-wrap text-sm leading-relaxed font-medium text-[var(--brand-ink)]">
                      {card.backMd}
                    </div>
                    <div className="rounded-[4px] border border-[var(--brand)]/30 bg-[var(--bg-tint)] p-3 text-xs text-[var(--brand-ink)]">
                      <span className="font-bold text-[var(--brand)]">
                        {isBn ? 'ফাঁদ সতর্কতা: ' : 'Trap Diagnostic: '}
                      </span>
                      {card.trapWarning}
                    </div>
                  </div>
                )}

                <div className="text-center text-xs text-[var(--text)]">
                  {isBn
                    ? 'কোয়ান্ট ফাঁদ মাস্টারি ডেক • উচ্চ-গুরুত্বপূর্ণ জিআরই নীতি'
                    : 'Quant Trap Mastery Deck • High-Yield GRE Principles'}
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* 4-Button FSRS Rating Bar (Keyboard 1, 2, 3, 4) */}
      <div className="space-y-2.5">
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          <button
            type="button"
            onClick={() => handleRate(FSRSRating.Again)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-[4px] border border-[var(--crimson)] bg-[var(--bg-tint)] p-3 text-center text-[var(--crimson)] transition-colors hover:bg-[var(--crimson)] hover:text-white"
          >
            <span className="flex items-center gap-1.5 text-xs font-bold">
              <span className="rounded-[2px] border border-current px-1 text-[10px]">1</span>
              <span>{isBn ? 'আবার (Again)' : 'Again'}</span>
            </span>
            <span className="mt-1 font-mono text-[11px]">
              {ratingPreviews[FSRSRating.Again]?.intervalLabel ?? '< 10m'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleRate(FSRSRating.Hard)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-[4px] border border-[var(--terracotta)] bg-[var(--bg-warm)] p-3 text-center text-[var(--terracotta)] transition-colors hover:bg-[var(--terracotta)] hover:text-white"
          >
            <span className="flex items-center gap-1.5 text-xs font-bold">
              <span className="rounded-[2px] border border-current px-1 text-[10px]">2</span>
              <span>{isBn ? 'কঠিন (Hard)' : 'Hard'}</span>
            </span>
            <span className="mt-1 font-mono text-[11px]">
              {ratingPreviews[FSRSRating.Hard]?.intervalLabel ?? '1d'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleRate(FSRSRating.Good)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-[4px] border border-[var(--brand)] bg-[var(--surface-paper)] p-3 text-center text-[var(--brand)] transition-colors hover:bg-[var(--brand)] hover:text-white"
          >
            <span className="flex items-center gap-1.5 text-xs font-bold">
              <span className="rounded-[2px] border border-current px-1 text-[10px]">3</span>
              <span>{isBn ? 'ভালো (Good)' : 'Good'}</span>
            </span>
            <span className="mt-1 font-mono text-[11px]">
              {ratingPreviews[FSRSRating.Good]?.intervalLabel ?? '3d'}
            </span>
          </button>

          <button
            type="button"
            onClick={() => handleRate(FSRSRating.Easy)}
            className="flex cursor-pointer flex-col items-center justify-center rounded-[4px] border border-[var(--brand-deep)] bg-[var(--surface-paper)] p-3 text-center text-[var(--brand-deep)] transition-colors hover:bg-[var(--brand-deep)] hover:text-white"
          >
            <span className="flex items-center gap-1.5 text-xs font-bold">
              <span className="rounded-[2px] border border-current px-1 text-[10px]">4</span>
              <span>{isBn ? 'সহজ (Easy)' : 'Easy'}</span>
            </span>
            <span className="mt-1 font-mono text-[11px]">
              {ratingPreviews[FSRSRating.Easy]?.intervalLabel ?? '14d'}
            </span>
          </button>
        </div>

        <p className="text-center text-xs text-[var(--text)]">
          {isBn ? 'কীবোর্ড শর্টকাট:' : 'Keyboard shortcuts:'}{' '}
          <kbd className="rounded-[2px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-1.5 py-0.5 font-mono text-[11px]">
            1
          </kbd>{' '}
          Again &bull;{' '}
          <kbd className="rounded-[2px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-1.5 py-0.5 font-mono text-[11px]">
            2
          </kbd>{' '}
          Hard &bull;{' '}
          <kbd className="rounded-[2px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-1.5 py-0.5 font-mono text-[11px]">
            3
          </kbd>{' '}
          Good &bull;{' '}
          <kbd className="rounded-[2px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-1.5 py-0.5 font-mono text-[11px]">
            4
          </kbd>{' '}
          Easy &bull;{' '}
          <kbd className="rounded-[2px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-1.5 py-0.5 font-mono text-[11px]">
            Space
          </kbd>{' '}
          {isBn ? 'ফ্লিপ' : 'Flip'}
        </p>
      </div>
    </div>
  );
}

export default function VocabFlashcardPlayerPage() {
  return (
    <React.Suspense
      fallback={
        <div className="mx-auto max-w-3xl p-12 text-center text-xs text-[var(--text)]">
          Loading FSRS Vocab Player...
        </div>
      }
    >
      <VocabPlayerContent />
    </React.Suspense>
  );
}
