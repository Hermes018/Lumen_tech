/** @purpose Accessible tooltip component built with Radix UI */
import * as React from 'react';
import { Tooltip as RadixTooltip } from 'radix-ui';
import { cn } from '../lib/utils';

export const TooltipProvider = RadixTooltip.Provider;
export const Tooltip = RadixTooltip.Root;
export const TooltipTrigger = RadixTooltip.Trigger;

export function TooltipContent({
  className,
  sideOffset = 4,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixTooltip.Content>) {
  return (
    <RadixTooltip.Portal>
      <RadixTooltip.Content
        sideOffset={sideOffset}
        className={cn(
          'bg-fg text-canvas animate-in fade-in-0 zoom-in-95 z-50 overflow-hidden rounded-md px-3 py-1.5 text-xs shadow-md',
          className
        )}
        {...props}
      />
    </RadixTooltip.Portal>
  );
}
