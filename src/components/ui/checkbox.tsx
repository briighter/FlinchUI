import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface CheckboxProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  label?: ReactNode;
  hint?: ReactNode;
  invalid?: boolean;
}

/**
 * Checkbox — a native checkbox styled with `accent-color`, wrapped in a label so
 * the click target and accessible name come for free.
 */
export function Checkbox({ label, hint, invalid, className, id, ...rest }: CheckboxProps) {
  const control = (
    <input
      id={id}
      type="checkbox"
      aria-invalid={invalid || undefined}
      className={cn(
        'size-4 shrink-0 cursor-pointer rounded-xs border-border-strong text-brand-600 accent-brand-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg disabled:cursor-not-allowed disabled:opacity-60',
        invalid && 'accent-danger',
        !label && className,
      )}
      {...rest}
    />
  );

  if (!label && !hint) return control;

  return (
    <label htmlFor={id} className={cn('flex cursor-pointer items-start gap-2.5', className)}>
      <span className="mt-0.5 flex items-center">{control}</span>
      <span className="min-w-0 select-none">
        {label ? <span className="block text-sm font-medium text-fg">{label}</span> : null}
        {hint ? <span className="mt-0.5 block text-sm text-fg-muted">{hint}</span> : null}
      </span>
    </label>
  );
}
