/** @purpose Trap Diagnostic callout highlighting GRE distractor patterns (07 §2.7, 08 §3.40) */
'use client';

import * as React from 'react';
import { cn } from '../../lib/utils';
import { ShieldAlert, AlertTriangle } from 'lucide-react';

export interface TrapDiagnosticProps {
  choiceId: string;
  choiceText?: string;
  trapTag?: string;
  trapLabel?: string;
  explanationMd: string;
  className?: string;
}

export function TrapDiagnostic({
  choiceId,
  choiceText,
  trapTag,
  trapLabel,
  explanationMd,
  className,
}: TrapDiagnosticProps) {
  const displayLabel = trapLabel || (trapTag ? trapTag.replace(/_/g, ' ') : 'Distractor Trap');

  return (
    <div
      role="alert"
      className={cn(
        'rounded-xl border border-warning/50 bg-warning-soft/70 p-4 text-fg shadow-sm transition-all animate-in fade-in slide-in-from-top-1 duration-200',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="rounded-lg bg-warning/20 p-1.5 text-warning shrink-0 mt-0.5">
          <ShieldAlert className="w-5 h-5" />
        </div>

        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1 rounded bg-warning/20 px-2 py-0.5 text-xs font-bold text-warning uppercase tracking-wide">
              <AlertTriangle className="w-3 h-3" />
              Choice {choiceId} Trap
            </span>
            <span className="text-sm font-semibold text-fg capitalize">
              {displayLabel}
            </span>
          </div>

          {choiceText && (
            <div className="rounded bg-surface/60 px-2.5 py-1 text-xs text-fg-muted font-mono italic border border-control/30">
              Selected Choice [{choiceId}]: &ldquo;{choiceText}&rdquo;
            </div>
          )}

          <div className="text-xs leading-relaxed text-fg opacity-95 whitespace-pre-wrap pt-0.5">
            {explanationMd}
          </div>
        </div>
      </div>
    </div>
  );
}
