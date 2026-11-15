/** @purpose 4-Mode FSRS Vocab & Formula Flashcard Player (/app/vocab/play) in Claude Editorial Ledger aesthetic */
'use client';

import * as React from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  FSRSRating,
  previewAllRatings,
  scheduleNextReview,
  type CardState,
  type SchedulingResult,
} from '@lumen/core';
import { GRE_VOCAB_SEED_WORDS, type SeedVocabWord } from '@lumen/db';
import { RotateCw, Volume2 } from 'lucide-react';
import { formatMathText } from '@/src/lib/format-math';
import {
  WorkspaceContainer,
  WorkspaceHeader,
  WorkspaceProgressBar,
  WorkspaceTabs,
} from '@/src/components/ui/WorkspacePrimitives';

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
    backMd: 'Sum = (n - 2) \\times 180 degrees\n\nFor a hexagon (n = 6): (6 - 2) \\times 180 = 720 degrees.',
    trapWarning:
      'Do not confuse with the exterior angles sum, which is always 360 degrees for any convex polygon.',
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

  const rawMode = searchParams?.get('mode');
  const initialMode: ReviewMode =
    rawMode === 'cloze' || rawMode === 'se_pair_drill' || rawMode === 'quant_formula'
      ? rawMode
      : 'flip';

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
    [activeFSRSState, activeWord.headword, currentIdx, words.length],
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
    } else {
      setTimerActive(false);
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

  const activeFormulaCard = QUANT_FORMULA_CARDS[currentIdx % QUANT_FORMULA_CARDS.length]!;

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'এফএসআরএস সক্রিয় স্মরণ প্লেয়ার' : 'FSRS Active Recall Player'}
        subtitle={
          isBn
            ? `কার্ড ${currentIdx + 1} / ${words.length} · স্পেস বাটনে উল্টান, ১–৪ চেপে রেটিং দিন`
            : `Card ${currentIdx + 1} of ${words.length} · Press Space to flip, keys 1–4 to rate recall`
        }
        secondaryAction={{
          label: isBn ? '← ভোকাব হাবে ফিরুন' : '← Back to Vocab Hub',
          href: '/app/vocab',
        }}
      />

      <WorkspaceTabs
        activeTab={mode}
        onSelect={(id) => {
          setMode(id as ReviewMode);
          setIsFlipped(false);
        }}
        tabs={[
          { id: 'flip', label: isBn ? 'ক্লাসিক ফ্লিপ' : 'Classic Flip' },
          { id: 'cloze', label: isBn ? 'ক্লোজ কনটেক্সট' : 'Cloze Context' },
          { id: 'se_pair_drill', label: isBn ? '১৫ সেকেন্ড সমার্থক' : '15s Synonym' },
          { id: 'quant_formula', label: isBn ? 'কোয়ান্ট সূত্র ও ফাঁদ' : 'Quant Formulas & Traps' },
        ]}
      />

      {mode === 'se_pair_drill' ? (
        <div className="mb-6 space-y-2">
          <div className="flex items-center justify-between text-xs text-[var(--text)]">
            <span>{isBn ? '১৫-সেকেন্ড স্পিড ড্রিল' : '15-Second Speed Drill'}</span>
            <span className={timeLeft <= 3 ? 'font-bold text-[var(--brand)]' : 'font-mono'}>
              {isBn ? `${timeLeft} সেকেন্ড বাকি` : `${timeLeft}s remaining`}
            </span>
          </div>
          <WorkspaceProgressBar
            value={timeLeft}
            max={15}
            tone={timeLeft <= 3 ? 'crimson' : 'espresso'}
            label="Speed drill countdown"
          />
        </div>
      ) : null}

      {/* Primary Stationery Study Sheet */}
      {mode === 'flip' ? (
        <div
          onClick={() => setIsFlipped((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setIsFlipped((prev) => !prev);
          }}
          className="mb-8 flex min-h-[320px] cursor-pointer flex-col justify-between border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] p-8 select-none transition-colors hover:border-[var(--brand)]"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-mono font-semibold text-[var(--brand-deep)]">
              {activeWord.frequencyTier} · {activeWord.partOfSpeech}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <RotateCw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{isBn ? 'উল্টাতে ক্লিক বা Space চাপুন' : 'Click or press Space to flip'}</span>
            </span>
          </div>

          {!isFlipped ? (
            <div className="my-auto space-y-3 text-center py-8">
              <h2 className="font-serif text-4xl font-bold text-[var(--brand-deep)]">
                {activeWord.headword}
              </h2>
              <div className="flex items-center justify-center gap-2 font-mono text-sm text-[var(--text-muted)]">
                <span>/{activeWord.headword.toLowerCase()}/</span>
                <button
                  type="button"
                  onClick={speakWord}
                  className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-1.5 text-[var(--brand)] hover:border-[var(--brand)]"
                  aria-label={isBn ? 'উচ্চারণ শুনুন' : 'Play pronunciation'}
                >
                  <Volume2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </div>
          ) : (
            <div className="my-auto space-y-4 py-4">
              <div className="border-b border-[var(--hairline)] pb-3">
                <h2 className="text-2xl font-bold text-[var(--brand-deep)]">
                  {activeWord.headword}
                </h2>
                <p className="mt-1 text-sm font-semibold text-[var(--brand)]">
                  বাংলা: {activeWord.bnMeaning}
                </p>
              </div>

              <div className="space-y-3 text-sm leading-relaxed">
                <div>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">
                    {isBn ? 'সংজ্ঞা' : 'Definition'}
                  </p>
                  <p className="text-[var(--brand-deep)]">{activeWord.definition}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold text-[var(--text-muted)]">
                    {isBn ? 'জিআরই বাক্য' : 'GRE Context'}
                  </p>
                  <p className="font-serif italic text-[var(--brand-deep)]">
                    &ldquo;{activeWord.exampleSentenceGre}&rdquo;
                  </p>
                </div>

                {activeWord.mnemonicMd ? (
                  <p className="border-l-2 border-[var(--brand)] pl-3 text-xs text-[var(--text)]">
                    <span className="font-semibold text-[var(--brand-deep)]">
                      {isBn ? 'মনে রাখার কৌশল: ' : 'Mnemonic Hook: '}
                    </span>
                    {activeWord.mnemonicMd}
                  </p>
                ) : null}

                {activeWord.synonyms.length > 0 ? (
                  <p className="text-xs text-[var(--text-muted)]">
                    <span className="font-semibold text-[var(--brand-deep)]">
                      {isBn ? 'সমার্থক শব্দ: ' : 'Synonyms: '}
                    </span>
                    <span className="font-mono">{activeWord.synonyms.join(' · ')}</span>
                  </p>
                ) : null}
              </div>
            </div>
          )}

          <p className="text-center text-xs text-[var(--text-muted)]">
            {!isFlipped
              ? isBn
                ? 'অর্থ ও বাংলা ব্যাখ্যা দেখতে কার্ডে ক্লিক করুন'
                : 'Click card to reveal definition & Bangla gloss'
              : isBn
                ? 'পরবর্তী রিভিউ নির্ধারণ করতে নিচে রেটিং দিন'
                : 'Rate your recall below to schedule next review'}
          </p>
        </div>
      ) : null}

      {mode === 'cloze' ? (
        <div className="mb-8 flex min-h-[320px] flex-col justify-between border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand-deep)] bg-[var(--surface-paper)] p-8 space-y-5">
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span>{isBn ? 'ক্লোজ কনটেক্সট মোড' : 'Cloze Context Mode'}</span>
            <span className="font-mono">{activeWord.partOfSpeech}</span>
          </div>

          <div className="space-y-4">
            <p className="font-serif text-lg leading-relaxed text-[var(--brand-deep)]">
              &ldquo;
              {activeWord.exampleSentenceGre.replace(
                new RegExp(activeWord.headword, 'gi'),
                '________',
              )}
              &rdquo;
            </p>

            <div className="flex max-w-md flex-wrap items-center gap-3">
              <input
                type="text"
                value={clozeUserAnswer}
                onChange={(e) => setClozeUserAnswer(e.target.value)}
                placeholder={isBn ? 'লক্ষ্য শব্দটি লিখুন...' : 'Type the target word...'}
                className="flex-1 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)] focus:border-[var(--brand)] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => {
                  setClozeChecked(true);
                  setIsFlipped(true);
                }}
                className="bg-[var(--brand)] text-white px-4 py-2 text-xs font-semibold rounded-[4px] hover:bg-[var(--link)] transition-colors"
              >
                {isBn ? 'যাচাই করুন' : 'Check'}
              </button>
            </div>

            {clozeChecked ? (
              <div className="border-t border-[var(--hairline)] pt-3 space-y-1">
                <p className="text-sm font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'সঠিক শব্দ:' : 'Target:'} {activeWord.headword} ({activeWord.bnMeaning})
                </p>
                <p className="text-xs text-[var(--text)]">{activeWord.definition}</p>
              </div>
            ) : null}
          </div>

          <p className="text-xs text-[var(--text-muted)]">
            {isBn
              ? 'প্রাসঙ্গিক বাক্য পূরণ জিআরই রিডিংয়ে সক্রিয় স্মরণ বাড়ায়।'
              : 'Sentence completion strengthens active recall in contextual GRE reading.'}
          </p>
        </div>
      ) : null}

      {mode === 'se_pair_drill' ? (
        <div className="mb-8 flex min-h-[320px] flex-col justify-between border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] p-8 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-medium text-[var(--text-muted)]">
              {isBn ? 'সেন্টেন্স ইকুইভ্যালেন্স জোড়া ম্যাচিং' : 'Sentence Equivalence Pair Matching'}
            </span>
            <span className="font-mono text-xs text-[var(--text-muted)]">
              {isBn ? 'ঠিক ২টি সমার্থক শব্দ বাছাই করুন' : 'Select exactly 2 synonyms'}
            </span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-[var(--brand-deep)]">
            {isBn ? 'শব্দ:' : 'Target:'} {activeWord.headword}
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
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
                  className={
                    isSelected
                      ? 'rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-4 py-2.5 text-left text-xs font-semibold text-[var(--brand)] leading-relaxed'
                      : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-4 py-2.5 text-left text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)] leading-relaxed'
                  }
                >
                  {synOption}
                </button>
              );
            })}
          </div>

          {isFlipped ? (
            <p className="border-t border-[var(--hairline)] pt-3 text-xs text-[var(--text)]">
              <span className="font-semibold text-[var(--brand-deep)]">
                {isBn ? 'সমার্থক জোড়া: ' : 'Synonym Pair: '}
              </span>
              {activeWord.synonyms.join(' & ')} · বাংলা: {activeWord.bnMeaning}
            </p>
          ) : null}
        </div>
      ) : null}

      {mode === 'quant_formula' ? (
        <div
          onClick={() => setIsFlipped((prev) => !prev)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter') setIsFlipped((prev) => !prev);
          }}
          className="mb-8 flex min-h-[320px] cursor-pointer flex-col justify-between border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] p-8 select-none space-y-5"
        >
          <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
            <span className="font-semibold text-[var(--brand-deep)]">
              {activeFormulaCard.category}
            </span>
            <span>{isBn ? 'উল্টাতে ক্লিক করুন' : 'Click to flip'}</span>
          </div>

          {!isFlipped ? (
            <div className="my-auto space-y-3 text-center py-6">
              <h2 className="text-xl font-bold text-[var(--brand-deep)]">
                {formatMathText(activeFormulaCard.title)}
              </h2>
              <p className="text-sm text-[var(--text)] leading-relaxed">
                {formatMathText(activeFormulaCard.frontMd)}
              </p>
            </div>
          ) : (
            <div className="my-auto space-y-4 py-2">
              <h2 className="border-b border-[var(--hairline)] pb-2 text-lg font-bold text-[var(--brand-deep)]">
                {formatMathText(activeFormulaCard.title)}
              </h2>
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-[var(--brand-deep)]">
                {formatMathText(activeFormulaCard.backMd)}
              </p>
              <p className="border-l-2 border-[var(--brand)] pl-3 text-xs text-[var(--text)] leading-relaxed">
                <span className="font-semibold text-[var(--brand)]">
                  {isBn ? 'ফাঁদ সতর্কতা: ' : 'Trap Diagnostic: '}
                </span>
                {formatMathText(activeFormulaCard.trapWarning)}
              </p>
            </div>
          )}

          <p className="text-center text-xs text-[var(--text-muted)]">
            {isBn
              ? 'কোয়ান্ট ফাঁদ মাস্টারি ডেক · উচ্চ-গুরুত্বপূর্ণ জিআরই নীতি'
              : 'Quant Trap Mastery Deck · High-Yield GRE Principles'}
          </p>
        </div>
      ) : null}

      {/* Hairline 4-Button FSRS Rating Bar */}
      <div className="space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-4 border-y border-[var(--hairline)] divide-y sm:divide-y-0 sm:divide-x divide-[var(--hairline)] bg-[var(--surface-paper)]">
          {(
            [
              {
                rating: FSRSRating.Again,
                keyNum: '1',
                labelEn: 'Again',
                labelBn: 'আবার',
                fallback: '< 10m',
              },
              {
                rating: FSRSRating.Hard,
                keyNum: '2',
                labelEn: 'Hard',
                labelBn: 'কঠিন',
                fallback: '1d',
              },
              {
                rating: FSRSRating.Good,
                keyNum: '3',
                labelEn: 'Good',
                labelBn: 'ভালো',
                fallback: '3d',
              },
              {
                rating: FSRSRating.Easy,
                keyNum: '4',
                labelEn: 'Easy',
                labelBn: 'সহজ',
                fallback: '14d',
              },
            ] as const
          ).map((btn) => (
            <button
              key={btn.keyNum}
              type="button"
              onClick={() => handleRate(btn.rating)}
              className="flex flex-col items-center justify-center py-3.5 px-4 text-center transition-colors hover:bg-[var(--bg-warm)]"
            >
              <span className="flex items-center gap-1.5 text-xs font-semibold text-[var(--brand-deep)]">
                <span className="rounded-[2px] border border-[var(--hairline)] px-1.5 font-mono text-xs">
                  {btn.keyNum}
                </span>
                <span>{isBn ? btn.labelBn : btn.labelEn}</span>
              </span>
              <span className="mt-1 font-mono text-xs text-[var(--text-muted)]">
                {ratingPreviews[btn.rating]?.intervalLabel ?? btn.fallback}
              </span>
            </button>
          ))}
        </div>
      </div>
    </WorkspaceContainer>
  );
}

export default function VocabFlashcardPlayerPage() {
  return (
    <React.Suspense
      fallback={
        <WorkspaceContainer>
          <p className="text-sm text-[var(--text-muted)]">Loading FSRS Vocab Player...</p>
        </WorkspaceContainer>
      }
    >
      <VocabPlayerContent />
    </React.Suspense>
  );
}
