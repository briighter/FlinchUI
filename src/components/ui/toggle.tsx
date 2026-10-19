'use client';

import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { buttonVariants } from './button';
import type { ButtonSize, ButtonVariant } from './button';

export interface ToggleProps {
  pressed: boolean;
  onPressedChange: (pressed: boolean) => void;
  variant?: Exclude<ButtonVariant, 'link'>;
  size?: ButtonSize;
  disabled?: boolean;
  className?: string;
  children: ReactNode;
  /** Accessible name when the visible content is icon-only. */
  label?: string;
}

/**
 * Toggle — a two-state button that exposes `aria-pressed`. The controlled
 * surface is intentionally simple so it composes with any state container.
 */
export function Toggle({
  pressed,
  onPressedChange,
  variant = 'secondary',
  size = 'md',
  disabled,
  className,
  children,
  label,
}: ToggleProps) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      aria-label={label}
      disabled={disabled}
      onClick={() => onPressedChange(!pressed)}
      className={cn(
        buttonVariants({ variant, size }),
        pressed && 'border-brand-500 bg-brand-50 text-brand-700 dark:text-brand-300',
        className,
      )}
    >
      {children}
    </button>
  );
}
