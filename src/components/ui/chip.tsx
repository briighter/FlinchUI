import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface ChipProps extends HTMLAttributes<HTMLSpanElement> {
  /** Render a small avatar/leading visual. */
  avatar?: ReactNode;
  /** Called when the remove control is used. */
  onRemove?: () => void;
  tone?: 'neutral' | 'brand';
  selected?: boolean;
}

/** Chip — a compact, optionally removable entity token (filters, tags, people). */
export function Chip({
  avatar,
  onRemove,
  tone = 'neutral',
  selected = false,
  className,
  children,
  ...rest
}: ChipProps) {
  return (
    <span
      className={cn(
        'inline-flex max-w-full items-center gap-1.5 rounded-full border py-0.5 pr-1.5 pl-1.5 text-sm font-medium',
        selected || tone === 'brand'
          ? 'border-brand-300 bg-brand-50 text-brand-700 dark:border-brand-800 dark:text-brand-300'
          : 'border-border bg-surface text-fg',
        className,
      )}
      {...rest}
    >
      {avatar ? (
        <span aria-hidden="true" className="flex size-5 shrink-0 items-center justify-center overflow-hidden rounded-full [&>*]:size-full">
          {avatar}
        </span>
      ) : null}
      <span className="truncate">{children}</span>
      {onRemove ? (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className="inline-flex size-4 shrink-0 items-center justify-center rounded-full text-fg-subtle transition-colors hover:bg-surface-sunken hover:text-fg"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="size-2.5">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </span>
  );
}
