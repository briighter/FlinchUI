import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SeparatorProps extends HTMLAttributes<HTMLElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Optional centered label; only rendered for horizontal separators. */
  label?: string;
  decorative?: boolean;
}

/** Separator — a hairline rule with optional label and orientation. */
export function Separator({
  orientation = 'horizontal',
  label,
  decorative = true,
  className,
  ...rest
}: SeparatorProps) {
  const a11y = decorative
    ? { role: 'presentation' }
    : { role: 'separator', 'aria-orientation': orientation };

  if (orientation === 'vertical') {
    return (
      <div
        className={cn('inline-block w-px self-stretch bg-border', className)}
        {...a11y}
        {...rest}
      />
    );
  }

  if (!label) {
    return <div className={cn('h-px w-full bg-border', className)} {...a11y} {...rest} />;
  }

  return (
    <div className={cn('flex w-full items-center gap-3', className)} {...a11y} {...rest}>
      <span className="h-px flex-1 bg-border" />
      <span className="text-xs font-medium tracking-wide text-fg-subtle uppercase">{label}</span>
      <span className="h-px flex-1 bg-border" />
    </div>
  );
}
