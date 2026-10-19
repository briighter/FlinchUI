import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

/** Code — inline code token. */
export function Code({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <code
      className={cn(
        'rounded-sm border border-border bg-surface-sunken px-1.5 py-0.5 font-mono text-[0.85em] text-fg',
        className,
      )}
      {...rest}
    />
  );
}

/** Kbd — keyboard key. */
export function Kbd({ className, ...rest }: HTMLAttributes<HTMLElement>) {
  return (
    <kbd
      className={cn(
        'inline-flex h-5 min-w-5 items-center justify-center rounded-xs border border-border-strong bg-surface-sunken px-1.5 font-mono text-[11px] font-medium text-fg-muted shadow-xs',
        className,
      )}
      {...rest}
    />
  );
}

/** Blockquote — quotation with an accent rule. */
export function Blockquote({
  className,
  cite,
  children,
  ...rest
}: HTMLAttributes<HTMLElement> & { cite?: string }) {
  return (
    <figure className={cn('border-l-2 border-brand-500 pl-4', className)} {...rest}>
      <blockquote className="text-lg text-fg italic">{children}</blockquote>
      {cite ? <figcaption className="mt-2 text-sm text-fg-muted">— {cite}</figcaption> : null}
    </figure>
  );
}
