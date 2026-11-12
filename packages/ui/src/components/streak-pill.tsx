/**
 * @purpose Reusable Streak Pill component displaying consecutive study days and freeze status.
 * Calm engagement design following 08-UI-UX-DESIGN-SYSTEM.md §3.33 and §8.1.
 */

import React from 'react';
import { Flame, Shield } from 'lucide-react';
import { cn } from '../lib/utils';

export interface StreakPillProps extends React.HTMLAttributes<HTMLDivElement> {
  streak: number;
  isActiveToday?: boolean;
  freezesRemaining?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'calm' | 'highlight';
}

export function StreakPill({
  streak,
  isActiveToday = true,
  freezesRemaining = 0,
  size = 'md',
  variant = 'calm',
  className,
  ...props
}: StreakPillProps) {
  const sizeClasses = {
    sm: 'text-xs px-2.5 py-0.5 gap-1',
    md: 'text-xs px-3 py-1 gap-1.5',
    lg: 'text-sm px-4 py-1.5 gap-2',
  }[size];

  const iconSizes = {
    sm: 'h-3.5 w-3.5',
    md: 'h-4 w-4',
    lg: 'h-4.5 w-4.5',
  }[size];

  const variantClasses = variant === 'highlight'
    ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30'
    : 'bg-surface-2 text-fg border-border';

  return (
    <div
      role="status"
      aria-label={`${streak}-day study streak, ${isActiveToday ? 'active today' : 'inactive today'}`}
      className={cn(
        'inline-flex items-center rounded-full border font-semibold transition-colors',
        sizeClasses,
        variantClasses,
        className
      )}
      {...props}
    >
      <Flame
        className={cn(
          iconSizes,
          isActiveToday ? 'fill-amber-500 text-amber-500' : 'text-fg-muted'
        )}
        aria-hidden="true"
      />
      <span>
        {streak} {streak === 1 ? 'day' : 'days'}
      </span>
      {freezesRemaining > 0 && (
        <span
          className="text-fg-muted flex items-center gap-0.5 pl-1 text-[11px] font-normal"
          title={`${freezesRemaining} streak freeze${freezesRemaining > 1 ? 's' : ''} available`}
        >
          <Shield className="h-3 w-3 text-sky-600 dark:text-sky-400" aria-hidden="true" />
          <span>{freezesRemaining}</span>
        </span>
      )}
    </div>
  );
}
