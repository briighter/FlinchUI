import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export const spinnerSizeClasses = {
  xs: 'size-3',
  sm: 'size-4',
  md: 'size-5',
  lg: 'size-6',
  xl: 'size-8',
} as const;

export type SpinnerSize = keyof typeof spinnerSizeClasses;

export interface SpinnerProps extends HTMLAttributes<HTMLSpanElement> {
  size?: SpinnerSize;
  /** Accessible name announced to screen readers. */
  label?: string;
}

/** Spinner — an indeterminate loading indicator that inherits `currentColor`. */
export function Spinner({ size = 'md', label = 'Loading', className, ...rest }: SpinnerProps) {
  return (
    <span
      role="status"
      aria-label={label}
      className={cn('inline-flex shrink-0 items-center justify-center', className)}
      {...rest}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        aria-hidden="true"
        className={cn('animate-spin', spinnerSizeClasses[size])}
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" className="opacity-25" />
        <path
          d="M12 2a10 10 0 0 1 10 10"
          stroke="currentColor"
          strokeWidth="4"
          strokeLinecap="round"
        />
      </svg>
    </span>
  );
}
