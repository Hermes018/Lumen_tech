/** @purpose Verbal Deconstructor with Predict-First choice blurring and inline word click-to-deck (07 §2.7) */
'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Eye, EyeOff, BookPlus, Sparkles } from 'lucide-react';

export interface TriggerWord {
  word: string;
  category: string; // 'contrast' | 'support' | 'cause_effect' | 'condition'
  note: string;
}

export interface BlankCharge {
  blank_index: number;
  charge: '+' | '-' | 'neutral';
  rationale: string;
}

export interface VerbalDeconstructorProps {
  passageOrSentence: string;
  triggerWords?: TriggerWord[];
  blankCharges?: BlankCharge[];
  predictFirstEnabled: boolean;
  predictionText: string;
  choicesRevealed: boolean;
  onPredictionChange: (text: string) => void;
  onToggleReveal: () => void;
  onTogglePredictFirst: (enabled: boolean) => void;
  onAddToDeck?: (word: string) => void;
  children: React.ReactNode;
  className?: string;
}

export function VerbalDeconstructor({
  passageOrSentence,
  triggerWords = [],
  blankCharges = [],
  predictFirstEnabled,
  predictionText,
  choicesRevealed,
  onPredictionChange,
  onToggleReveal,
  onTogglePredictFirst,
  onAddToDeck,
  children,
  className,
}: VerbalDeconstructorProps) {
  // Tokenize words so they can be clicked for FSRS vocab deck addition
  const words = React.useMemo(() => {
    return passageOrSentence.split(/(\s+)/);
  }, [passageOrSentence]);

  const handleWordClick = (rawWord: string) => {
    const cleaned = rawWord.replace(/[^a-zA-Z-]/g, '').trim();
    if (cleaned.length >= 3 && onAddToDeck) {
      onAddToDeck(cleaned);
    }
  };

  const getTriggerWordInfo = (rawWord: string) => {
    const cleaned = rawWord.replace(/[^a-zA-Z-]/g, '').toLowerCase().trim();
    return triggerWords.find((tw) => tw.word.toLowerCase() === cleaned);
  };

  return (
    <div className={cn('space-y-4 text-fg', className)}>
      {/* Control bar: Predict-First toggle and Vocab prompt */}
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-control bg-surface-2/60 px-3.5 py-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-fg">Verbal Strategy:</span>
          <button
            type="button"
            onClick={() => onTogglePredictFirst(!predictFirstEnabled)}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-2.5 py-1 font-medium transition-all cursor-pointer border',
              predictFirstEnabled
                ? 'border-accent bg-accent text-accent-fg shadow-xs'
                : 'border-control bg-surface text-fg-muted hover:text-fg'
            )}
            aria-pressed={predictFirstEnabled}
          >
            {predictFirstEnabled ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span>Predict First: {predictFirstEnabled ? 'ON' : 'OFF'}</span>
          </button>
        </div>

        {onAddToDeck && (
          <div className="flex items-center gap-1 text-fg-muted text-[11px]">
            <BookPlus className="w-3.5 h-3.5 text-accent" />
            <span>Click any word to add to your FSRS Vocab Deck</span>
          </div>
        )}
      </div>

      {/* Sentence / Passage Display with clickable words & trigger badges */}
      <div className="rounded-xl border border-control bg-surface p-4 leading-relaxed text-sm md:text-base">
        {words.map((chunk, i) => {
          if (/^\s+$/.test(chunk)) {
            return <span key={i}>{chunk}</span>;
          }

          const triggerInfo = getTriggerWordInfo(chunk);

          return (
            <span
              key={i}
              onClick={() => handleWordClick(chunk)}
              title={triggerInfo ? `Pivot: ${triggerInfo.note}` : 'Click to add to Vocab Deck'}
              className={cn(
                'inline-block transition-colors cursor-pointer rounded px-0.5',
                triggerInfo
                  ? 'bg-warning/20 text-warning font-semibold underline decoration-warning/50 decoration-wavy'
                  : 'hover:bg-accent-soft/60 hover:text-accent'
              )}
            >
              {chunk}
            </span>
          );
        })}
      </div>

      {/* Charge and Trigger Breakdown chips */}
      {(triggerWords.length > 0 || blankCharges.length > 0) && (
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {triggerWords.map((tw) => (
            <span
              key={tw.word}
              className="inline-flex items-center gap-1 rounded-md border border-warning/40 bg-warning-soft px-2 py-0.5 text-warning font-medium"
            >
              <Sparkles className="w-3 h-3" />
              Pivot: &ldquo;{tw.word}&rdquo; ({tw.category})
            </span>
          ))}

          {blankCharges.map((bc) => (
            <span
              key={bc.blank_index}
              className="inline-flex items-center gap-1 rounded-md border border-accent/40 bg-accent-soft px-2 py-0.5 text-accent font-medium"
            >
              Blank {bc.blank_index + 1}: [{bc.charge}] {bc.rationale}
            </span>
          ))}
        </div>
      )}

      {/* Predict First input drawer if active */}
      {predictFirstEnabled && (
        <div className="rounded-xl border border-accent/40 bg-accent-soft/30 p-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <label htmlFor="prediction-input" className="text-xs font-semibold text-accent flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              Your Prediction (Type a rough word or sign before looking at choices):
            </label>
            <button
              type="button"
              onClick={onToggleReveal}
              className="text-xs font-medium text-accent hover:underline cursor-pointer"
            >
              {choicesRevealed ? 'Hide Choices' : 'Reveal Choices'}
            </button>
          </div>
          <input
            id="prediction-input"
            type="text"
            value={predictionText}
            onChange={(e) => onPredictionChange(e.target.value)}
            placeholder="e.g. hostile, negative (+), or calm..."
            className="w-full rounded-lg border border-control bg-surface px-3 py-1.5 text-sm text-fg placeholder:text-fg-muted/60 focus:outline-none focus:ring-2 focus:ring-accent"
          />
        </div>
      )}

      {/* Choices Container with optional Predict-First Blur */}
      <div className="relative">
        <div
          className={cn(
            'transition-all duration-300',
            predictFirstEnabled && !choicesRevealed
              ? 'filter blur-md select-none pointer-events-none opacity-40'
              : 'filter-none opacity-100'
          )}
        >
          {children}
        </div>

        {/* Blur overlay button */}
        {predictFirstEnabled && !choicesRevealed && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <button
              type="button"
              onClick={onToggleReveal}
              className="flex items-center gap-2 rounded-xl border border-accent bg-accent px-5 py-2.5 text-sm font-semibold text-accent-fg shadow-lg hover:bg-accent-hover active:scale-95 transition-all cursor-pointer"
            >
              <Eye className="w-4 h-4" />
              <span>I Have My Prediction — Reveal Choices</span>
            </button>
            <p className="mt-2 text-xs text-fg-muted bg-surface/90 px-2 py-0.5 rounded shadow-xs">
              Forming a prediction first prevents being tricked by distractor trap choices.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
