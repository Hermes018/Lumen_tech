/**
 * @purpose Khan Academy style XP Level and Progress Bar component.
 * Displays level badges, title ranks, and progress toward next level.
 */

import React from 'react';
import { Award, Zap } from 'lucide-react';
import { cn } from '../lib/utils';

export interface LevelProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  level: number;
  title: string;
  totalXp: number;
  currentLevelXp: number;
  xpForNextLevel: number;
  progressPct: number;
  nextLevelTitle?: string;
  compact?: boolean;
}

export function LevelProgressBar({
  level,
  title,
  totalXp,
  currentLevelXp,
  xpForNextLevel,
  progressPct,
  nextLevelTitle,
  compact = false,
  className,
  ...props
}: LevelProgressBarProps) {
  const clampedProgress = Math.max(0, Math.min(100, progressPct));
  const remainingXp = Math.max(0, xpForNextLevel - currentLevelXp);

  return (
    <div
      className={cn('bg-surface border-border rounded-xl border p-4 shadow-xs', className)}
      {...props}
    >
      <div className="flex items-center justify-between gap-3">
        {/* Level Badge and Title */}
        <div className="flex items-center gap-3">
          <div
            className="bg-accent/10 border-accent/20 text-accent flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border font-bold"
            aria-hidden="true"
          >
            <Award className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-fg text-sm font-bold">Level {level}</span>
              <span className="text-fg-muted text-xs">• {title}</span>
            </div>
            {!compact && (
              <p className="text-fg-muted text-xs">
                {totalXp.toLocaleString()} total XP earned
              </p>
            )}
          </div>
        </div>

        {/* XP Status / Next Level Target */}
        <div className="text-right">
          <div className="text-fg flex items-center justify-end gap-1 text-xs font-semibold">
            <Zap className="text-accent h-3.5 w-3.5 fill-accent" aria-hidden="true" />
            <span>
              {currentLevelXp} / {xpForNextLevel} XP
            </span>
          </div>
          <p className="text-fg-muted text-xs">
            {remainingXp} XP to Level {level + 1}
          </p>
        </div>
      </div>

      {/* Progress Bar Track */}
      <div className="mt-3">
        <div
          role="progressbar"
          aria-valuenow={clampedProgress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Level ${level} progress: ${clampedProgress}%`}
          className="bg-surface-2 h-2.5 w-full overflow-hidden rounded-full"
        >
          <div
            className="bg-accent h-full rounded-full transition-all duration-300"
            style={{ width: `${clampedProgress}%` }}
          />
        </div>
      </div>

      {!compact && nextLevelTitle && (
        <div className="text-fg-muted mt-2 flex justify-between text-[11px]">
          <span>Current: {title}</span>
          <span>Next Rank: {nextLevelTitle}</span>
        </div>
      )}
    </div>
  );
}
