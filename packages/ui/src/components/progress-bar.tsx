/** @purpose Accessible progress bar with percentage indicator */
import * as React from 'react';
import { cn } from '../lib/utils.js';

export interface ProgressBarProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 to 100
  max?: number;
  label?: string;
}

export function ProgressBar({ value, max = 100, label, className, ...props }: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div className={cn('w-full', className)} {...props}>
      {label && (
        <div className="text-fg-2 mb-1 flex justify-between text-xs font-medium">
          <span>{label}</span>
          <span>{Math.round(percentage)}%</span>
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        className="bg-surface-2 h-2 w-full overflow-hidden rounded-full"
      >
        <div
          className="bg-accent h-full transition-all duration-300 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
