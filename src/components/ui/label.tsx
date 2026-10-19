import type { LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
  optional?: boolean;
  /** Dim + disable pointer events (use while the control is disabled). */
  disabled?: boolean;
}

/** Label — accessible form label with required/optional affordances. */
export function Label({
  required = false,
  optional = false,
  disabled = false,
  className,
  children,
  ...rest
}: LabelProps) {
  return (
    <label
      className={cn(
        'block text-sm font-medium text-fg',
        disabled && 'cursor-not-allowed opacity-60',
        className,
      )}
      {...rest}
    >
      {children}
      {required ? (
        <span aria-hidden="true" className="ml-1 text-danger">
          *
        </span>
      ) : null}
      {optional ? <span className="ml-1 font-normal text-fg-subtle">(optional)</span> : null}
    </label>
  );
}
