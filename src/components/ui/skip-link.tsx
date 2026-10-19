import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SkipLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  /** Target element id (without `#`). */
  targetId?: string;
  children?: ReactNode;
}

/**
 * SkipLink — the WCAG "skip to content" affordance. Positioned off-screen until
 * it receives keyboard focus.
 */
export function SkipLink({
  targetId = 'main',
  className,
  children = 'Skip to content',
  ...rest
}: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className={cn(
        'fixed top-3 left-3 z-100 -translate-y-20 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-fg-on-brand shadow-lg transition-transform',
        'focus:translate-y-0 focus:outline-none',
        className,
      )}
      {...rest}
    >
      {children}
    </a>
  );
}
