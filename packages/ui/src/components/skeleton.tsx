/** @purpose Accessible skeleton loader placeholder */
import * as React from 'react';
import { cn } from '../lib/utils.js';

export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('bg-surface-2 animate-pulse rounded-md', className)} {...props} />;
}
