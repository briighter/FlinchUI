import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface DescriptionItem {
  term: ReactNode;
  description: ReactNode;
}

export interface DescriptionListProps extends HTMLAttributes<HTMLDListElement> {
  items: DescriptionItem[];
  /** `stacked` puts each term above its value; `inline` uses a two-column grid. */
  layout?: 'stacked' | 'inline';
}

/** DescriptionList — term/value pairs for detail views. */
export function DescriptionList({
  items,
  layout = 'stacked',
  className,
  ...rest
}: DescriptionListProps) {
  return (
    <dl
      className={cn(
        layout === 'inline' ? 'grid grid-cols-[minmax(0,10rem)_1fr] gap-x-6 gap-y-4' : 'grid gap-4',
        className,
      )}
      {...rest}
    >
      {items.map((item, index) => (
        <div key={index} className={cn(layout === 'inline' ? 'contents' : 'grid gap-0.5')}>
          <dt className="text-sm font-medium text-fg-muted">{item.term}</dt>
          <dd className="text-sm text-fg">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}
