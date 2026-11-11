/** @purpose Accessible tabs navigation component built with Radix UI */
import * as React from 'react';
import { Tabs as RadixTabs } from 'radix-ui';
import { cn } from '../lib/utils.js';

export const Tabs = RadixTabs.Root;

export function TabsList({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixTabs.List>) {
  return (
    <RadixTabs.List
      className={cn(
        'bg-surface-2 text-fg-3 inline-flex h-10 items-center justify-center rounded-md p-1',
        className
      )}
      {...props}
    />
  );
}

export function TabsTrigger({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixTabs.Trigger>) {
  return (
    <RadixTabs.Trigger
      className={cn(
        'focus-visible:ring-focus data-[state=active]:bg-surface data-[state=active]:text-fg inline-flex cursor-pointer items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-all focus-visible:ring-2 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:shadow-sm',
        className
      )}
      {...props}
    />
  );
}

export function TabsContent({
  className,
  ...props
}: React.ComponentPropsWithoutRef<typeof RadixTabs.Content>) {
  return (
    <RadixTabs.Content
      className={cn(
        'focus-visible:ring-focus mt-2 focus-visible:ring-2 focus-visible:outline-none',
        className
      )}
      {...props}
    />
  );
}
