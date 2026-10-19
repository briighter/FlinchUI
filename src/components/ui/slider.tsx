import type { ComponentPropsWithRef } from 'react';
import { cn } from '@/lib/cn';

export interface SliderProps extends Omit<ComponentPropsWithRef<'input'>, 'type'> {
  invalid?: boolean;
}

/**
 * Slider — a native range input. Native semantics keep it fully accessible;
 * `accent-color` themes the track and thumb.
 */
export function Slider({ invalid = false, className, ...rest }: SliderProps) {
  return (
    <input
      type="range"
      aria-invalid={invalid || undefined}
      className={cn(
        'h-2 w-full cursor-pointer appearance-none rounded-full bg-surface-sunken accent-brand-600',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        'disabled:cursor-not-allowed disabled:opacity-50',
        invalid && 'accent-danger',
        className,
      )}
      {...rest}
    />
  );
}
