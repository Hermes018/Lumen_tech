/** @purpose Accessible icon-only button requiring aria-label */
import * as React from 'react';
import { cn } from '../lib/utils.js';
import { Button, type ButtonProps } from './button.js';

export interface IconButtonProps extends ButtonProps {
  'aria-label': string;
  icon: React.ReactNode;
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon, size = 'sm', 'aria-label': ariaLabel, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        size={size}
        aria-label={ariaLabel}
        className={cn('aspect-square p-2', className)}
        {...props}
      >
        {icon}
      </Button>
    );
  }
);
IconButton.displayName = 'IconButton';
