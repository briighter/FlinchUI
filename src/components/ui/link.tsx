import type { AnchorHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';

export type LinkTone = 'default' | 'subtle' | 'muted' | 'inherit';

const TONE = {
  default: 'text-brand-600 hover:text-brand-700',
  subtle: 'text-fg hover:text-brand-600',
  muted: 'text-fg-muted hover:text-fg',
  inherit: 'text-inherit',
} as const;

export interface LinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
  tone?: LinkTone;
  underline?: 'always' | 'hover' | 'none';
  external?: boolean;
  asChild?: boolean;
}

/** Link — themed anchor; auto-detects external URLs for `rel`/`target`. */
export function Link({
  tone = 'default',
  underline = 'hover',
  external,
  asChild = false,
  className,
  href,
  target,
  rel,
  ...rest
}: LinkProps) {
  const Comp = asChild ? Slot : 'a';
  const isExternal = external ?? (typeof href === 'string' && /^https?:\/\//.test(href));

  return (
    <Comp
      href={href}
      target={isExternal ? (target ?? '_blank') : target}
      rel={isExternal ? (rel ?? 'noreferrer noopener') : rel}
      className={cn(
        'font-medium outline-offset-4 transition-colors',
        'focus-visible:rounded-xs focus-visible:outline-2 focus-visible:outline-ring',
        TONE[tone],
        underline === 'always' && 'underline underline-offset-4',
        underline === 'hover' && 'hover:underline hover:underline-offset-4',
        className,
      )}
      {...rest}
    />
  );
}
