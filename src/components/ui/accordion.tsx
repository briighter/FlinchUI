import type { DetailsHTMLAttributes, HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface AccordionProps extends HTMLAttributes<HTMLDivElement> {
  /** Remove the outer border and let items stand alone. */
  flush?: boolean;
}

/**
 * Accordion — a disclosure list built on the native `<details>` element, so it
 * is keyboard accessible and fully functional with **zero JavaScript**.
 */
export function Accordion({ flush = false, className, ...rest }: AccordionProps) {
  return (
    <div
      className={cn('divide-y divide-border', !flush && 'rounded-lg border border-border', className)}
      {...rest}
    />
  );
}

export interface AccordionItemProps extends Omit<DetailsHTMLAttributes<HTMLDetailsElement>, 'title'> {
  title: ReactNode;
  /** Rendered to the right of the title. */
  meta?: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

/** AccordionItem — one collapsible section. */
export function AccordionItem({
  title,
  meta,
  defaultOpen = false,
  disabled = false,
  className,
  children,
  ...rest
}: AccordionItemProps) {
  return (
    <details
      open={defaultOpen}
      className={cn('group px-4', disabled && 'pointer-events-none opacity-60', className)}
      {...rest}
    >
      <summary
        className={cn(
          'flex cursor-pointer list-none items-center justify-between gap-3 py-4 text-sm font-medium text-fg outline-none',
          'focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          '[&::-webkit-details-marker]:hidden',
        )}
      >
        <span className="min-w-0">{title}</span>
        <span className="flex items-center gap-3">
          {meta ? <span className="text-xs text-fg-muted">{meta}</span> : null}
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4 shrink-0 text-fg-subtle transition-transform duration-200 group-open:rotate-180"
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </summary>
      <div className="pb-4 text-sm text-fg-muted">{children}</div>
    </details>
  );
}
