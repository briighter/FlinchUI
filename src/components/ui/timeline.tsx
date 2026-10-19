import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type TimelineStatus = 'complete' | 'current' | 'upcoming' | 'error';

const DOT: Record<TimelineStatus, string> = {
  complete: 'bg-brand-600 text-white',
  current: 'bg-brand-600 ring-4 ring-brand-100 dark:ring-brand-950',
  upcoming: 'bg-surface-sunken text-fg-subtle ring-1 ring-border',
  error: 'bg-danger text-white',
};

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

export interface TimelineItem {
  title: ReactNode;
  description?: ReactNode;
  timestamp?: ReactNode;
  status?: TimelineStatus;
  icon?: ReactNode;
}

export interface TimelineProps extends HTMLAttributes<HTMLOListElement> {
  items: TimelineItem[];
}

/** Timeline — a vertical sequence of events with status markers. */
export function Timeline({ items, className, ...rest }: TimelineProps) {
  return (
    <ol className={cn('relative flex flex-col', className)} {...rest}>
      {items.map((item, index) => {
        const status = item.status ?? 'upcoming';
        const isLast = index === items.length - 1;
        return (
          <li key={index} className="relative flex gap-4 pb-6 last:pb-0">
            {!isLast ? (
              <span aria-hidden="true" className="absolute top-6 left-[11px] h-full w-px bg-border" />
            ) : null}
            <span
              className={cn(
                'z-10 mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold',
                DOT[status],
              )}
            >
              {item.icon ?? (status === 'complete' ? <CheckIcon /> : index + 1)}
            </span>
            <div className="min-w-0 flex-1 pt-0.5">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5">
                <p className="text-sm font-semibold text-fg">{item.title}</p>
                {item.timestamp ? (
                  <time className="text-xs text-fg-subtle">{item.timestamp}</time>
                ) : null}
              </div>
              {item.description ? (
                <p className="mt-1 text-sm text-fg-muted">{item.description}</p>
              ) : null}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
