import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface ColorSwatchProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Any CSS colour. For token-driven swatches pass `var(--color-brand-500)`. */
  color: string;
  label?: string;
  /** Optional secondary line, e.g. a hex value or token name. */
  value?: string;
  size?: 'sm' | 'md' | 'lg';
  shape?: 'square' | 'circle';
}

const SIZES = {
  sm: 'size-6',
  md: 'size-9',
  lg: 'size-12',
} as const;

/**
 * ColorSwatch — a single colour chip with an optional caption.
 *
 * The fill is applied through `backgroundColor`, which is the one place the
 * library accepts a raw colour string: a swatch exists precisely to display an
 * arbitrary value.
 */
export function ColorSwatch({
  color,
  label,
  value,
  size = 'md',
  shape = 'square',
  className,
  ...rest
}: ColorSwatchProps) {
  return (
    <div className={cn('flex flex-col gap-1.5', className)} {...rest}>
      <span
        aria-hidden="true"
        className={cn(
          'border border-border shadow-xs',
          SIZES[size],
          shape === 'circle' ? 'rounded-full' : 'rounded-md',
        )}
        style={{ backgroundColor: color }}
      />
      {label ? <span className="text-xs font-medium text-fg">{label}</span> : null}
      {value ? <span className="font-mono text-[10px] text-fg-subtle">{value}</span> : null}
    </div>
  );
}
