import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Label } from './label';

export type FieldSize = 'sm' | 'md' | 'lg';

/** Shared height/padding scale for text-like controls. */
export const fieldHeight: Record<FieldSize, string> = {
  sm: 'h-8',
  md: 'h-10',
  lg: 'h-12',
};

export const fieldText: Record<FieldSize, string> = {
  sm: 'text-sm',
  md: 'text-sm',
  lg: 'text-base',
};

export const fieldPadX: Record<FieldSize, string> = {
  sm: 'px-2.5',
  md: 'px-3',
  lg: 'px-4',
};

/** Border + focus-ring treatment, shared by every text control. */
export const fieldSurface =
  'w-full rounded-md border bg-surface text-fg shadow-xs transition-colors placeholder:text-fg-subtle focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-60';

export function fieldBorder(invalid?: boolean, readOnly?: boolean): string {
  if (invalid) return 'border-danger focus-visible:ring-danger';
  if (readOnly) return 'border-border';
  return 'border-border-strong hover:border-border-strong';
}

export interface FormFieldProps extends HTMLAttributes<HTMLDivElement> {
  /** Associates the label with a control id. */
  htmlFor?: string;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  required?: boolean;
  optional?: boolean;
  disabled?: boolean;
  /** The control. */
  children: ReactNode;
}

/**
 * FormField — label + control + hint/error wrapper with correct `aria-describedby`
 * wiring delegated to the control you pass.
 */
export function FormField({
  htmlFor,
  label,
  hint,
  error,
  required = false,
  optional = false,
  disabled = false,
  className,
  children,
  ...rest
}: FormFieldProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...rest}>
      {label ? (
        <Label htmlFor={htmlFor} required={required} optional={optional} disabled={disabled}>
          {label}
        </Label>
      ) : null}
      {children}
      {error ? (
        <p className="text-sm text-danger-fg" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p className="text-sm text-fg-muted">{hint}</p>
      ) : null}
    </div>
  );
}

export interface FieldsetProps extends HTMLAttributes<HTMLFieldSetElement> {
  legend?: ReactNode;
  description?: ReactNode;
  disabled?: boolean;
}

/** Fieldset — groups related controls under a legend. */
export function Fieldset({
  legend,
  description,
  disabled,
  className,
  children,
  ...rest
}: FieldsetProps) {
  return (
    <fieldset className={cn('flex flex-col gap-3', className)} disabled={disabled} {...rest}>
      {legend ? (
        <legend className="text-sm font-semibold text-fg">{legend}</legend>
      ) : null}
      {description ? <p className="text-sm text-fg-muted">{description}</p> : null}
      {children}
    </fieldset>
  );
}
