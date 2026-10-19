'use client';

import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/lib/hooks/use-controllable-state';
import { fieldBorder, fieldHeight, fieldSurface, fieldText } from './form-field';
import type { FieldSize } from './form-field';

export interface NumberInputProps
  extends Omit<ComponentPropsWithRef<'input'>, 'onChange' | 'value' | 'defaultValue' | 'type' | 'size'> {
  value?: number;
  defaultValue?: number;
  onValueChange?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  size?: FieldSize;
  invalid?: boolean;
}

const clamp = (value: number, min?: number, max?: number) => {
  let next = value;
  if (min !== undefined) next = Math.max(min, next);
  if (max !== undefined) next = Math.min(max, next);
  return next;
};

const MinusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M5 12h14" />
  </svg>
);

const PlusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

/** NumberInput — a numeric field with stepper buttons and min/max clamping. */
export function NumberInput({
  value,
  defaultValue = 0,
  onValueChange,
  min,
  max,
  step = 1,
  size = 'md',
  invalid = false,
  className,
  disabled,
  ...rest
}: NumberInputProps) {
  const [current, setCurrent] = useControllableState<number>({
    value,
    defaultValue,
    onChange: onValueChange,
  });

  const commit = (next: number) => setCurrent(clamp(next, min, max));

  const stepButton =
    'flex w-8 shrink-0 items-center justify-center text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:size-3.5';

  return (
    <div
      className={cn(
        fieldSurface,
        fieldBorder(invalid),
        fieldHeight[size],
        'flex items-stretch overflow-hidden p-0',
        className,
      )}
    >
      <button
        type="button"
        aria-label="Decrease"
        disabled={disabled || (min !== undefined && current <= min)}
        onClick={() => commit(current - step)}
        className={stepButton}
      >
        <MinusIcon />
      </button>
      <input
        type="number"
        inputMode="decimal"
        value={current}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        aria-invalid={invalid || undefined}
        onChange={(event) => {
          const parsed = Number(event.target.value);
          if (!Number.isNaN(parsed)) commit(parsed);
        }}
        className={cn(
          'min-w-0 flex-1 border-x border-border bg-transparent text-center text-fg tabular-nums',
          fieldText[size],
          '[appearance:textfield] focus:outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none',
        )}
        {...rest}
      />
      <button
        type="button"
        aria-label="Increase"
        disabled={disabled || (max !== undefined && current >= max)}
        onClick={() => commit(current + step)}
        className={stepButton}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
