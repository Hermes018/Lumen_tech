/** @purpose Pedagogical callout component for 3-tier hints and trap diagnostics (D13) */
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../lib/utils';
import { AlertCircle, HelpCircle, Lightbulb, ShieldAlert, Sparkles } from 'lucide-react';

export const calloutVariants = cva('rounded-lg border p-4 my-2 flex gap-3 text-sm transition-all', {
  variants: {
    type: {
      concept: 'bg-accent-soft border-accent-soft text-fg',
      setup: 'bg-info-soft border-info text-fg',
      bridge: 'bg-warning-soft border-warning text-fg',
      trap: 'bg-danger-soft border-danger text-fg',
      solution: 'bg-success-soft border-success text-fg',
    },
  },
  defaultVariants: {
    type: 'concept',
  },
});

const calloutIcons = {
  concept: <Lightbulb className="text-accent mt-0.5 h-5 w-5 shrink-0" />,
  setup: <Sparkles className="text-info mt-0.5 h-5 w-5 shrink-0" />,
  bridge: <HelpCircle className="text-warning mt-0.5 h-5 w-5 shrink-0" />,
  trap: <ShieldAlert className="text-danger mt-0.5 h-5 w-5 shrink-0" />,
  solution: <AlertCircle className="text-success mt-0.5 h-5 w-5 shrink-0" />,
};

export interface CalloutProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof calloutVariants> {
  title?: string;
}

export function Callout({ type = 'concept', title, children, className, ...props }: CalloutProps) {
  const icon = calloutIcons[type ?? 'concept'];

  return (
    <div className={cn(calloutVariants({ type }), className)} {...props}>
      {icon}
      <div className="flex-1 space-y-1">
        {title && <h4 className="text-sm leading-tight font-semibold">{title}</h4>}
        <div className="text-sm opacity-90">{children}</div>
      </div>
    </div>
  );
}
