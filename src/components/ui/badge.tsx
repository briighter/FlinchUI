import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { variants } from '@/lib/variants';

export const badgeSchema = {
  base: 'inline-flex items-center gap-1.5 rounded-full border font-medium whitespace-nowrap',
  variants: {
    tone: {
      neutral: 'border-border bg-surface-sunken text-fg-muted',
      brand: 'border-transparent bg-brand-50 text-brand-700 dark:text-brand-300',
      success: 'border-transparent bg-success-subtle text-success-fg',
      warning: 'border-transparent bg-warning-subtle text-warning-fg',
      danger: 'border-transparent bg-danger-subtle text-danger-fg',
      info: 'border-transparent bg-info-subtle text-info-fg',
      outline: 'border-border-strong bg-transparent text-fg',
    },
    size: {
      sm: 'px-2 py-0.5 text-[11px]',
      md: 'px-2.5 py-0.5 text-xs',
      lg: 'px-3 py-1 text-sm',
    },
    shape: {
      pill: 'rounded-full',
      square: 'rounded-sm',
    },
  },
  defaultVariants: { tone: 'neutral', size: 'md', shape: 'pill' },
} as const;

export const badgeVariants = variants(badgeSchema);
export type BadgeTone = keyof typeof badgeSchema.variants.tone;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  size?: keyof typeof badgeSchema.variants.size;
  shape?: keyof typeof badgeSchema.variants.shape;
  /** Show a leading status dot. */
  dot?: boolean;
  /** Render a trailing remove affordance. */
  onRemove?: () => void;
  startIcon?: ReactNode;
}

const DOT_TONE: Record<BadgeTone, string> = {
  neutral: 'bg-fg-subtle',
  brand: 'bg-brand-500',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
  outline: 'bg-fg-subtle',
};

/** Badge — a compact status/label pill. */
export function Badge({
  tone = 'neutral',
  size = 'md',
  shape = 'pill',
  dot = false,
  onRemove,
  startIcon,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ tone, size, shape }), className)} {...rest}>
      {dot ? <span aria-hidden="true" className={cn('size-1.5 rounded-full', DOT_TONE[tone])} /> : startIcon}
      {children}
      {onRemove ? (
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className="-mr-0.5 ml-0.5 inline-flex size-3.5 items-center justify-center rounded-full opacity-60 transition-opacity hover:opacity-100"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </span>
  );
}
