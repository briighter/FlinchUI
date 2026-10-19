'use client';

import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export interface SwitchProps extends Omit<ComponentPropsWithRef<'button'>, 'onChange' | 'type' | 'value'> {
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
  size?: 'sm' | 'md';
  label?: string;
}

const TRACK = {
  sm: 'h-5 w-9',
  md: 'h-6 w-11',
} as const;

const THUMB = {
  sm: 'size-4 data-[state=checked]:translate-x-4',
  md: 'size-5 data-[state=checked]:translate-x-5',
} as const;

/**
 * Switch — an accessible toggle built on `<button role="switch">`, so it works
 * with the keyboard and screen readers without any hidden inputs.
 */
export function Switch({
  checked,
  onCheckedChange,
  size = 'md',
  label,
  className,
  disabled,
  ...rest
}: SwitchProps) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={disabled}
      onClick={() => onCheckedChange(!checked)}
      data-state={checked ? 'checked' : 'unchecked'}
      className={cn(
        'relative inline-flex shrink-0 cursor-pointer items-center rounded-full p-0.5 transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed disabled:opacity-50',
        TRACK[size],
        checked ? 'bg-brand-600' : 'bg-border-strong',
        className,
      )}
      {...rest}
    >
      <span
        aria-hidden="true"
        className={cn(
          'pointer-events-none block rounded-full bg-white shadow-sm transition-transform',
          THUMB[size],
        )}
      />
    </button>
  );
}
