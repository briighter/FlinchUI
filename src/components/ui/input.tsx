import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { fieldBorder, fieldHeight, fieldPadX, fieldSurface, fieldText } from './form-field';
import type { FieldSize } from './form-field';

export interface InputProps extends Omit<ComponentPropsWithRef<'input'>, 'size'> {
  size?: FieldSize;
  invalid?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** Control used for the trailing icon (e.g. a password reveal button). */
  endSlot?: ReactNode;
}

/**
 * Input — text control with size presets, validation styling, and optional
 * leading/trailing adornments.
 */
export function Input({
  size = 'md',
  invalid = false,
  startIcon,
  endIcon,
  endSlot,
  className,
  ...rest
}: InputProps) {
  const control = (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        fieldSurface,
        fieldBorder(invalid),
        fieldHeight[size],
        fieldText[size],
        fieldPadX[size],
        startIcon ? 'pl-9' : undefined,
        endIcon || endSlot ? 'pr-9' : undefined,
        className,
      )}
      {...rest}
    />
  );

  if (!startIcon && !endIcon && !endSlot) return control;

  return (
    <div className="relative flex items-center">
      {startIcon ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute left-2.5 flex size-4 items-center justify-center text-fg-subtle [&_svg]:size-4"
        >
          {startIcon}
        </span>
      ) : null}
      {control}
      {endSlot ? (
        <span className="absolute right-1.5 flex items-center">{endSlot}</span>
      ) : endIcon ? (
        <span
          aria-hidden="true"
          className="pointer-events-none absolute right-2.5 flex size-4 items-center justify-center text-fg-subtle [&_svg]:size-4"
        >
          {endIcon}
        </span>
      ) : null}
    </div>
  );
}
