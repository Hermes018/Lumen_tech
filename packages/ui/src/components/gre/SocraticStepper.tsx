/** @purpose Vertical Socratic Stepper for "Walk Me Through It" micro-step solver (07 §2.7) */
'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { CheckCircle2, Sparkles } from 'lucide-react';
import { MathText } from '../math-text';

export interface SocraticStepItem {
  step_index: number;
  prompt_md: string;
  options: string[];
  correct_option_index: number;
  takeaway_md: string;
}

export interface SocraticStepperProps {
  steps: SocraticStepItem[];
  currentStepIndex: number;
  completedStepIndices: number[];
  isCompleted: boolean;
  onSelectStepOption: (stepIndex: number, optionIndex: number) => void;
  className?: string;
}

export function SocraticStepper({
  steps,
  currentStepIndex,
  completedStepIndices,
  isCompleted,
  onSelectStepOption,
  className,
}: SocraticStepperProps) {
  const [wrongAttempts, setWrongAttempts] = React.useState<Record<number, number[]>>({});

  const handleOptionClick = (stepIndex: number, optionIndex: number, correctIndex: number) => {

    if (optionIndex === correctIndex) {
      onSelectStepOption(stepIndex, optionIndex);
    } else {
      setWrongAttempts((prev) => ({
        ...prev,
        [stepIndex]: [...(prev[stepIndex] ?? []), optionIndex],
      }));
    }
  };

  return (
    <div
      className={cn(
        'rounded-xl border border-control bg-surface p-4 text-fg shadow-sm transition-all',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4 pb-2 border-b border-control/30">
        <div className="rounded-lg bg-accent-soft p-1.5 text-accent">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <h3 className="text-sm font-semibold leading-tight">
            Walk Me Through It (Socratic Guided Solver)
          </h3>
          <p className="text-xs text-fg-muted">
            Step-by-step conceptual check questions to build intuition
          </p>
        </div>
      </div>

      {/* Stepper List */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const isDone = completedStepIndices.includes(step.step_index);
          const isActive = currentStepIndex === step.step_index && !isDone;
          const isLocked = step.step_index > currentStepIndex && !isDone;
          const stepWrongChoices = wrongAttempts[step.step_index] ?? [];

          return (
            <div key={step.step_index} className="relative flex gap-3">
              {/* Stepper indicator & line */}
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-all',
                    isDone
                      ? 'bg-success text-white'
                      : isActive
                        ? 'border-2 border-accent bg-accent-soft text-accent ring-2 ring-accent/20'
                        : 'border border-control bg-surface-2 text-fg-muted'
                  )}
                >
                  {isDone ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span>{idx + 1}</span>
                  )}
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      'w-0.5 flex-1 min-h-[30px] my-1',
                      isDone ? 'bg-success/50' : 'bg-control/50'
                    )}
                  />
                )}
              </div>

              {/* Step Content */}
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'text-xs font-semibold uppercase tracking-wider',
                      isActive ? 'text-accent' : isDone ? 'text-success' : 'text-fg-muted'
                    )}
                  >
                    Step {idx + 1} of {steps.length}
                  </span>
                  {isDone && (
                    <span className="text-[10px] rounded bg-success-soft text-success px-1.5 py-0.2 font-medium">
                      Mastered
                    </span>
                  )}
                </div>

                <div
                  className={cn(
                    'mt-1 text-sm leading-relaxed',
                    isLocked ? 'text-fg-muted/60' : 'text-fg'
                  )}
                >
                  <MathText content={step.prompt_md} />
                </div>

                {/* Interactive options for active step */}
                {isActive && (
                  <div className="mt-3 space-y-2">
                    {step.options.map((optText, optIdx) => {
                      const isWrong = stepWrongChoices.includes(optIdx);
                      return (
                        <button
                          key={optIdx}
                          type="button"
                          disabled={isWrong}
                          onClick={() =>
                            handleOptionClick(step.step_index, optIdx, step.correct_option_index)
                          }
                          className={cn(
                            'flex w-full items-start gap-2.5 rounded-lg border p-2.5 text-left text-xs transition-all',
                            isWrong
                              ? 'border-danger/30 bg-danger/10 text-danger opacity-60 cursor-not-allowed'
                              : 'border-control/60 bg-surface-2 hover:border-accent hover:bg-accent-soft/40 cursor-pointer text-fg'
                          )}
                        >
                          <span className="font-semibold text-fg-muted shrink-0">
                            {String.fromCharCode(65 + optIdx)}.
                          </span>
                          <span className="flex-1 leading-normal">
                            <MathText content={optText} />
                          </span>
                          {isWrong && (
                            <span className="text-[10px] text-danger font-medium shrink-0">
                              Try again
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}

                {/* Takeaway for completed step */}
                {isDone && (
                  <div className="mt-2 rounded-lg border border-success/30 bg-success-soft/50 p-2.5 text-xs text-fg">
                    <div className="flex items-center gap-1.5 font-semibold text-success mb-1">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Key Conceptual Takeaway
                    </div>
                    <div className="opacity-90 leading-relaxed">
                      <MathText content={step.takeaway_md} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion Banner */}
      {isCompleted && (
        <div className="mt-4 flex items-center justify-between rounded-xl border border-success bg-success-soft p-3 text-fg">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-success" />
            <span className="text-xs font-semibold text-success">
              Walkthrough Complete! You now possess the setup intuition to finish the solve.
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
