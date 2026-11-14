/** @purpose Progressive 3-tier collapsible Hint Ladder with hint budget tracking (D13, 07 §2.7) */
'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { Lightbulb, Sparkles, HelpCircle, ChevronDown, ChevronUp, Lock, AlertTriangle } from 'lucide-react';
import { Callout } from '../callout';
import { MathText } from '../math-text';

export interface HintItem {
  tier: 1 | 2 | 3;
  label: string;
  content_md: string;
}

export interface HintLadderProps {
  hints: HintItem[];
  revealedTiers: number[];
  hintBudgetRemaining: number;
  totalHintBudget?: number;
  onRevealNextHint: () => void;
  disabled?: boolean;
  className?: string;
}

export function HintLadder({
  hints,
  revealedTiers,
  hintBudgetRemaining,
  totalHintBudget,
  onRevealNextHint,
  disabled = false,
  className,
}: HintLadderProps) {
  const [isExpanded, setIsExpanded] = React.useState(true);
  const nextTierToReveal = [1, 2, 3].find((t) => !revealedTiers.includes(t)) as (1 | 2 | 3) | undefined;
  const isBudgetLow = hintBudgetRemaining <= 1;
  const isBudgetExhausted = hintBudgetRemaining <= 0;

  const tierTypeMap = {
    1: 'concept' as const,
    2: 'setup' as const,
    3: 'bridge' as const,
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-control bg-surface p-4 text-fg shadow-sm transition-all',
        className
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="rounded-lg bg-accent-soft p-1.5 text-accent">
            <Lightbulb className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-semibold leading-tight">Pedagogical Hint Ladder</h3>
            <p className="text-xs text-fg-muted">
              {revealedTiers.length} of {Math.min(hints.length, 3)} hints unlocked
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={cn(
              'px-2 py-0.5 text-xs font-medium rounded-full border',
              isBudgetExhausted
                ? 'border-danger/30 bg-danger/10 text-danger'
                : isBudgetLow
                  ? 'border-warning/30 bg-warning/10 text-warning'
                  : 'border-control bg-surface-2 text-fg-muted'
            )}
          >
            Budget: {hintBudgetRemaining}
            {totalHintBudget !== undefined ? ` / ${totalHintBudget}` : ''}
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="rounded p-1 text-fg-muted hover:bg-surface-2 transition-colors"
            aria-label={isExpanded ? 'Collapse hints' : 'Expand hints'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="mt-3 space-y-3">
          {/* Low budget warning */}
          {isBudgetLow && !isBudgetExhausted && (
            <div className="flex items-center gap-2 rounded-lg border border-warning/40 bg-warning-soft px-3 py-2 text-xs text-warning">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>
                Caution: Hint budget is almost depleted ({hintBudgetRemaining} left). Using hints scales
                mastery: 0 hints = 100%, 1 hint = 85%, 2 hints = 65%, 3 hints = 40%.
              </span>
            </div>
          )}

          {isBudgetExhausted && nextTierToReveal && (
            <div className="flex items-center gap-2 rounded-lg border border-danger/40 bg-danger-soft px-3 py-2 text-xs text-danger">
              <Lock className="w-4 h-4 shrink-0" />
              <span>Hint budget exhausted. Try to work through the prompt with your current knowledge!</span>
            </div>
          )}

          {/* Render revealed hints */}
          {revealedTiers.map((tierNum) => {
            const hint = hints.find((h) => h.tier === tierNum);
            if (!hint) return null;

            const calloutType = tierTypeMap[hint.tier as 1 | 2 | 3];

            return (
              <Callout
                key={hint.tier}
                type={calloutType}
                title={`Hint Tier ${hint.tier}: ${hint.label}`}
                className="my-1.5"
              >
                <div className="whitespace-pre-wrap">
                  <MathText content={hint.content_md} />
                </div>
              </Callout>
            );
          })}

          {/* Unlock next hint button */}
          {nextTierToReveal && (
            <div className="pt-1">
              <button
                type="button"
                onClick={onRevealNextHint}
                disabled={disabled || isBudgetExhausted}
                className={cn(
                  'flex w-full items-center justify-center gap-2 rounded-lg border border-dashed py-2.5 text-xs font-semibold transition-all',
                  isBudgetExhausted
                    ? 'border-control opacity-50 cursor-not-allowed bg-surface-2 text-fg-muted'
                    : 'border-accent/40 bg-accent-soft/40 text-accent hover:border-accent hover:bg-accent-soft active:scale-[0.99] cursor-pointer'
                )}
              >
                {nextTierToReveal === 1 && <Lightbulb className="w-3.5 h-3.5" />}
                {nextTierToReveal === 2 && <Sparkles className="w-3.5 h-3.5" />}
                {nextTierToReveal === 3 && <HelpCircle className="w-3.5 h-3.5" />}
                <span>
                  Unlock Hint {nextTierToReveal}:{' '}
                  {hints.find((h) => h.tier === nextTierToReveal)?.label ?? `Tier ${nextTierToReveal}`}{' '}
                  (-1 Hint Point)
                </span>
              </button>
            </div>
          )}

          {!nextTierToReveal && revealedTiers.length > 0 && (
            <p className="text-center text-xs text-fg-muted italic">
              All 3 progressive hints revealed for this question.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
