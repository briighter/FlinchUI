import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';
import { fieldBorder, fieldPadX, fieldSurface, fieldText } from './form-field';
import type { FieldSize } from './form-field';

export interface TextareaProps extends ComponentPropsWithRef<'textarea'> {
  size?: FieldSize;
  invalid?: boolean;
  /** Grow with content instead of scrolling. */
  autoResize?: boolean;
}

/** Textarea — multi-line text control. */
export function Textarea({
  size = 'md',
  invalid = false,
  autoResize = false,
  rows = 4,
  className,
  ...rest
}: TextareaProps) {
  return (
    <textarea
      rows={rows}
      aria-invalid={invalid || undefined}
      className={cn(
        fieldSurface,
        fieldBorder(invalid),
        fieldText[size],
        size === 'sm' ? 'px-2.5 py-1.5' : size === 'lg' ? 'px-4 py-3' : fieldPadX[size] + ' py-2',
        'min-h-20 resize-y leading-6',
        autoResize && 'field-sizing-content resize-none',
        className,
      )}
      {...rest}
    />
  );
}
