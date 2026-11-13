/** @purpose 4-Mode FSRS Vocab & Formula Flashcard Player (/app/vocab/play) */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { Button, Badge } from '@lumen/ui';
import {
  FSRSRating,
  scheduleNextReview,
  previewAllRatings,
  type CardState,
  type SchedulingResult,
} from '@lumen/core';
import { GRE_VOCAB_SEED_WORDS, type SeedVocabWord } from '@lumen/db';
import { ArrowLeft, RotateCw, Volume2, Clock } from 'lucide-react';

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
    backMd: 'F: Fractions (e.g. 1/2)\nR: Repeated numbers (same value for x & y)\nO: One (1)\nZ: Zero (0)\nE: Extremes (1,000,000)\nN: Negatives (-1, -10)',
    trapWarning: 'Testing only positive integers is the #1 reason learners miss QC questions.',
  },
  {
    title: 'Sum of Interior Angles of an n-sided Polygon',
    category: 'Geometry',
    frontMd: 'What is the formula for the sum of the interior angles of an n-sided polygon?',
    backMd: 'Sum = (n - 2) * 180 degrees\n\nFor a hexagon (n=6): (6-2)*180 = 720 degrees.',
    trapWarning: 'Do not confuse with the exterior angles sum, which is always 360 degrees for ANY convex polygon.',
  },
  {
    title: 'Even & Odd Exponent Roots ($x^2 = k$ vs $x^3 = k$)',
    category: 'Algebra',
    frontMd: 'If $x^2 = 25$, what are the values of $x$? If $y^3 = -64$, what is $y$?',
    backMd: 'x = +5 or -5 (two roots for even powers)\ny = -4 (single root for odd powers, preserving sign)',
    trapWarning: 'Even exponents yield two roots (+ and -); odd exponents yield exactly one root.',
  },
];

function VocabPlayerContent() {
  const searchParams = useSearchParams();
  const initialMode = (searchParams?.get('mode') as ReviewMode) || 'flip';

  const [mode, setMode] = React.useState<ReviewMode>(initialMode);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [isFlipped, setIsFlipped] = React.useState(false);

  // Vocab card bank
  const [words] = React.useState<SeedVocabWord[]>(GRE_VOCAB_SEED_WORDS);

  // Card FSRS state
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

  // Cloze mode state
  const [clozeUserAnswer, setClozeUserAnswer] = React.useState('');
  const [clozeChecked, setClozeChecked] = React.useState(false);

  // Synonym speed drill state
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

  // Previews for FSRS ratings
  const ratingPreviews: Record<number, SchedulingResult> = React.useMemo(() => {
    return previewAllRatings(activeFSRSState);
  }, [activeFSRSState]);

  // Handle rating button
  const handleRate = React.useCallback(
    (rating: FSRSRating) => {
      const result = scheduleNextReview(activeFSRSState, rating);
      setCardStates((prev) => ({
        ...prev,
        [activeWord.headword]: result.card,
      }));

      // Next card
      setIsFlipped(false);
      setClozeChecked(false);
      setClozeUserAnswer('');
      setSelectedSynonyms([]);
      setTimeLeft(15);

      if (currentIdx < words.length - 1) {
        setCurrentIdx((prev) => prev + 1);
      } else {
        setCurrentIdx(0); // loop or finish
      }
    },
    [activeFSRSState, activeWord.headword, currentIdx, words.length]
  );

  // Keyboard shortcut listener (1-4 for ratings, Space to flip)
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

  // 15-second speed drill countdown
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

  // Start timer on card entry for speed drill
  React.useEffect(() => {
    if (mode === 'se_pair_drill') {
      setTimeLeft(15);
      setTimerActive(true);
      setIsFlipped(false);
    }
  }, [mode, currentIdx]);

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-control/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/app/vocab"
            className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Vocab Hub</span>
          </Link>
          <span className="text-fg-muted/40">|</span>
          <span className="text-xs font-semibold text-fg">
            Card {currentIdx + 1} of {words.length}
          </span>
        </div>

        {/* 4 Mode Pills */}
        <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-control/40 text-xs">
          <button
            type="button"
            onClick={() => setMode('flip')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'flip' ? 'bg-surface text-fg font-bold shadow-xs' : 'text-fg-muted hover:text-fg'
            }`}
          >
            Classic Flip
          </button>
          <button
            type="button"
            onClick={() => setMode('cloze')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'cloze' ? 'bg-surface text-fg font-bold shadow-xs' : 'text-fg-muted hover:text-fg'
            }`}
          >
            Cloze
          </button>
          <button
            type="button"
            onClick={() => setMode('se_pair_drill')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'se_pair_drill'
                ? 'bg-warning-soft text-warning font-bold shadow-xs'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            15s Synonym
          </button>
          <button
            type="button"
            onClick={() => setMode('quant_formula')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all cursor-pointer ${
              mode === 'quant_formula'
                ? 'bg-info-soft text-info font-bold shadow-xs'
                : 'text-fg-muted hover:text-fg'
            }`}
          >
            Quant Traps
          </button>
        </div>
      </div>

      {/* 15s Countdown bar for Synonym Speed Drill */}
      {mode === 'se_pair_drill' && (
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold">
            <span className="flex items-center gap-1 text-warning">
              <Clock className="w-3.5 h-3.5" />
              15-Second Speed Drill
            </span>
            <span className={timeLeft <= 3 ? 'text-danger font-bold animate-pulse' : 'text-fg-muted'}>
              {timeLeft}s remaining
            </span>
          </div>
          <div className="h-2 w-full rounded-full bg-surface-2 overflow-hidden border border-control/40">
            <div
              className={`h-full transition-all duration-1000 ease-linear ${
                timeLeft <= 3 ? 'bg-danger' : timeLeft <= 7 ? 'bg-warning' : 'bg-accent'
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
          className="min-h-[340px] rounded-2xl border border-control bg-surface p-8 shadow-sm cursor-pointer hover:border-accent/40 transition-all flex flex-col justify-between select-none"
        >
          {/* Card Front / Back Header */}
          <div className="flex items-center justify-between">
            <Badge variant="outline" className="text-xs font-mono uppercase">
              {activeWord.frequencyTier} &bull; {activeWord.partOfSpeech}
            </Badge>
            <div className="flex items-center gap-1.5 text-xs text-fg-muted">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Tap or Space to Flip</span>
            </div>
          </div>

          {/* Main Card Content */}
          {!isFlipped ? (
            <div className="my-auto text-center space-y-3">
              <h2 className="text-4xl font-extrabold tracking-tight text-fg font-serif">
                {activeWord.headword}
              </h2>
              <div className="flex items-center justify-center gap-2 text-sm text-fg-muted font-mono">
                <span>/əˈnɒm.ə.li/</span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                  className="rounded-full p-1 hover:bg-surface-2 text-accent transition-colors"
                  aria-label="Play audio"
                >
                  <Volume2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="my-auto space-y-4 animate-in fade-in duration-200">
              <div className="border-b border-control/30 pb-3 text-center">
                <h3 className="text-2xl font-bold text-fg">{activeWord.headword}</h3>
                <p className="text-base text-accent font-semibold mt-1">
                  বাংলা: {activeWord.bnMeaning}
                </p>
              </div>

              <div className="space-y-2 text-sm">
                <div>
                  <span className="font-semibold text-fg-muted uppercase text-xs">Definition:</span>
                  <p className="text-fg font-medium">{activeWord.definition}</p>
                </div>

                <div>
                  <span className="font-semibold text-fg-muted uppercase text-xs">GRE Context:</span>
                  <p className="text-fg italic font-serif opacity-90">
                    &ldquo;{activeWord.exampleSentenceGre}&rdquo;
                  </p>
                </div>

                {activeWord.mnemonicMd && (
                  <div className="rounded-lg bg-accent-soft/40 border border-accent/20 p-2 text-xs text-fg">
                    <span className="font-bold text-accent">Mnemonic Hook: </span>
                    {activeWord.mnemonicMd}
                  </div>
                )}

                {activeWord.synonyms.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    <span className="text-xs font-semibold text-fg-muted">Synonyms:</span>
                    {activeWord.synonyms.map((syn: string) => (
                      <span
                        key={syn}
                        className="rounded px-2 py-0.5 text-xs bg-surface-2 border border-control/40 font-mono text-fg"
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
          <div className="text-center text-[11px] text-fg-muted">
            {!isFlipped ? 'Click card to reveal definition & Bangla gloss' : 'Rate your recall below to schedule next review'}
          </div>
        </div>
      )}

      {/* MODE 2: CLOZE CONTEXT */}
      {mode === 'cloze' && (
        <div className="min-h-[340px] rounded-2xl border border-control bg-surface p-8 shadow-sm flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <Badge variant="secondary" className="text-xs">
              Cloze Context Mode
            </Badge>
            <span className="text-xs text-fg-muted font-mono">{activeWord.partOfSpeech}</span>
          </div>

          <div className="space-y-4 my-auto">
            <p className="text-lg text-fg font-serif leading-relaxed">
              &ldquo;
              {activeWord.exampleSentenceGre.replace(
                new RegExp(activeWord.headword, 'gi'),
                '________'
              )}
              &rdquo;
            </p>

            <div className="flex items-center gap-2 max-w-sm">
              <input
                type="text"
                value={clozeUserAnswer}
                onChange={(e) => setClozeUserAnswer(e.target.value)}
                placeholder="Type the target word..."
                className="w-full rounded-lg border border-control bg-surface-2 px-3 py-2 text-sm text-fg focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <Button
                size="sm"
                onClick={() => {
                  setClozeChecked(true);
                  setIsFlipped(true);
                }}
              >
                Check
              </Button>
            </div>

            {clozeChecked && (
              <div className="rounded-xl border border-accent/40 bg-accent-soft/30 p-4 space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center gap-2 font-bold text-fg">
                  <span>Target: {activeWord.headword}</span>
                  <span className="text-accent text-sm">({activeWord.bnMeaning})</span>
                </div>
                <p className="text-xs text-fg opacity-90">{activeWord.definition}</p>
              </div>
            )}
          </div>

          <div className="text-center text-[11px] text-fg-muted">
            Sentence completion strengthens active recall in contextual GRE reading.
          </div>
        </div>
      )}

      {/* MODE 3: 15s SYNONYM SPEED DRILL */}
      {mode === 'se_pair_drill' && (
        <div className="min-h-[340px] rounded-2xl border border-warning/40 bg-surface p-8 shadow-sm flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between">
              <Badge variant="warning" className="text-xs">
                Sentence Equivalence Pair Matching
              </Badge>
              <span className="text-xs text-fg-muted font-mono">Select exactly 2 synonyms</span>
            </div>
            <h3 className="text-2xl font-extrabold text-fg font-serif mt-2">
              Target: {activeWord.headword}
            </h3>
          </div>

          {/* 6 Choices (2 correct synonyms + 4 distractors) */}
          <div className="grid grid-cols-2 gap-2.5 my-auto">
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
                  className={`rounded-xl border p-3 text-left text-xs font-semibold transition-all ${
                    isSelected
                      ? 'border-warning bg-warning-soft text-warning ring-1 ring-warning'
                      : 'border-control/60 bg-surface-2 text-fg hover:border-warning/60'
                  }`}
                >
                  {synOption}
                </button>
              );
            })}
          </div>

          {isFlipped && (
            <div className="rounded-lg border border-warning/30 bg-warning-soft/40 p-3 text-xs text-fg">
              <span className="font-bold text-warning">Synonym Pair: </span>
              {activeWord.synonyms.join(' & ')} &bull; বাংলা: {activeWord.bnMeaning}
            </div>
          )}
        </div>
      )}

      {/* MODE 4: QUANT FORMULAS & TRAPS */}
      {mode === 'quant_formula' && (
        <div
          onClick={() => setIsFlipped(!isFlipped)}
          className="min-h-[340px] rounded-2xl border border-info/40 bg-surface p-8 shadow-sm cursor-pointer hover:border-info transition-all flex flex-col justify-between select-none"
        >
          {(() => {
            const card = QUANT_FORMULA_CARDS[currentIdx % QUANT_FORMULA_CARDS.length]!;
            return (
              <>
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className="text-info border-info/40 text-xs">
                    {card.category}
                  </Badge>
                  <span className="text-xs text-fg-muted">Tap to Flip</span>
                </div>

                {!isFlipped ? (
                  <div className="my-auto text-center space-y-3">
                    <h3 className="text-xl font-bold text-fg">{card.title}</h3>
                    <p className="text-sm text-fg-muted font-medium">{card.frontMd}</p>
                  </div>
                ) : (
                  <div className="my-auto space-y-4 animate-in fade-in duration-200">
                    <div className="border-b border-control/30 pb-2">
                      <h4 className="text-lg font-bold text-fg">{card.title}</h4>
                    </div>
                    <div className="text-sm leading-relaxed whitespace-pre-wrap font-medium text-fg">
                      {card.backMd}
                    </div>
                    <div className="rounded-lg border border-warning/40 bg-warning-soft p-2.5 text-xs text-warning">
                      <span className="font-bold">Trap Diagnostic: </span>
                      {card.trapWarning}
                    </div>
                  </div>
                )}

                <div className="text-center text-[11px] text-fg-muted">
                  Quant Trap Mastery Deck &bull; High-Yield GRE Principles
                </div>
              </>
            );
          })()}
        </div>
      )}

      {/* 4-Button FSRS Rating Bar (Keyboard 1, 2, 3, 4) */}
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-2">
          {/* Rating 1: Again */}
          <button
            type="button"
            onClick={() => handleRate(FSRSRating.Again)}
            className="flex flex-col items-center justify-center rounded-xl border border-danger/30 bg-danger/10 p-2.5 text-center text-danger hover:bg-danger/20 active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-xs font-bold flex items-center gap-1">
              <span className="px-1 py-0.2 rounded bg-danger/20 text-[10px]">1</span> Again
            </span>
            <span className="text-[11px] font-mono mt-0.5 opacity-90">
              {ratingPreviews[FSRSRating.Again]?.intervalLabel ?? '< 10m'}
            </span>
          </button>

          {/* Rating 2: Hard */}
          <button
            type="button"
            onClick={() => handleRate(FSRSRating.Hard)}
            className="flex flex-col items-center justify-center rounded-xl border border-warning/30 bg-warning/10 p-2.5 text-center text-warning hover:bg-warning/20 active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-xs font-bold flex items-center gap-1">
              <span className="px-1 py-0.2 rounded bg-warning/20 text-[10px]">2</span> Hard
            </span>
            <span className="text-[11px] font-mono mt-0.5 opacity-90">
              {ratingPreviews[FSRSRating.Hard]?.intervalLabel ?? '1d'}
            </span>
          </button>

          {/* Rating 3: Good */}
          <button
            type="button"
            onClick={() => handleRate(FSRSRating.Good)}
            className="flex flex-col items-center justify-center rounded-xl border border-accent/30 bg-accent-soft p-2.5 text-center text-accent hover:bg-accent hover:text-accent-fg active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-xs font-bold flex items-center gap-1">
              <span className="px-1 py-0.2 rounded bg-accent/20 text-[10px]">3</span> Good
            </span>
            <span className="text-[11px] font-mono mt-0.5 opacity-90">
              {ratingPreviews[FSRSRating.Good]?.intervalLabel ?? '3d'}
            </span>
          </button>

          {/* Rating 4: Easy */}
          <button
            type="button"
            onClick={() => handleRate(FSRSRating.Easy)}
            className="flex flex-col items-center justify-center rounded-xl border border-success/30 bg-success/10 p-2.5 text-center text-success hover:bg-success/20 active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-xs font-bold flex items-center gap-1">
              <span className="px-1 py-0.2 rounded bg-success/20 text-[10px]">4</span> Easy
            </span>
            <span className="text-[11px] font-mono mt-0.5 opacity-90">
              {ratingPreviews[FSRSRating.Easy]?.intervalLabel ?? '14d'}
            </span>
          </button>
        </div>

        <p className="text-center text-[11px] text-fg-muted">
          Keyboard shortcuts: Press <kbd className="px-1 rounded bg-surface-2 border border-control">1</kbd> Again &bull;{' '}
          <kbd className="px-1 rounded bg-surface-2 border border-control">2</kbd> Hard &bull;{' '}
          <kbd className="px-1 rounded bg-surface-2 border border-control">3</kbd> Good &bull;{' '}
          <kbd className="px-1 rounded bg-surface-2 border border-control">4</kbd> Easy &bull;{' '}
          <kbd className="px-1 rounded bg-surface-2 border border-control">Space</kbd> Flip
        </p>
      </div>
    </div>
  );
}

export default function VocabFlashcardPlayerPage() {
  return (
    <React.Suspense
      fallback={
        <div className="max-w-3xl mx-auto p-12 text-center text-xs text-fg-muted">
          Loading FSRS Vocab Player...
        </div>
      }
    >
      <VocabPlayerContent />
    </React.Suspense>
  );
}
