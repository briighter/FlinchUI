'use client';

import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface RadioOption {
  label: ReactNode;
  value: string;
  hint?: ReactNode;
  disabled?: boolean;
}

export interface RadioGroupProps extends Omit<ComponentPropsWithRef<'div'>, 'onChange'> {
  name: string;
  options: RadioOption[];
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  orientation?: 'horizontal' | 'vertical';
}

/**
 * RadioGroup — a set of native radios sharing a `name`, so keyboard arrow
 * navigation and form semantics are handled by the browser.
 */
export function RadioGroup({
  name,
  options,
  value,
  defaultValue,
  onValueChange,
  orientation = 'vertical',
  className,
  ...rest
}: RadioGroupProps) {
  return (
    <div
      role="radiogroup"
      className={cn(
        'flex gap-3',
        orientation === 'vertical' ? 'flex-col' : 'flex-row flex-wrap',
        className,
      )}
      {...rest}
    >
      {options.map((option) => (
        <label
          key={option.value}
          className={cn(
            'flex items-start gap-2.5',
            option.disabled ? 'cursor-not-allowed opacity-60' : 'cursor-pointer',
          )}
        >
          <input
            type="radio"
            name={name}
            value={option.value}
            disabled={option.disabled}
            checked={value !== undefined ? value === option.value : undefined}
            defaultChecked={value === undefined ? defaultValue === option.value : undefined}
            onChange={(event) => onValueChange?.(event.target.value)}
            className="mt-0.5 size-4 shrink-0 cursor-pointer accent-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg"
          />
          <span className="min-w-0 select-none">
            <span className="block text-sm font-medium text-fg">{option.label}</span>
            {option.hint ? <span className="mt-0.5 block text-sm text-fg-muted">{option.hint}</span> : null}
          </span>
        </label>
      ))}
    </div>
  );
}
