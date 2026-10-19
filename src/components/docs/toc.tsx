'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';

export interface TocItem {
  id: string;
  title: string;
  level?: 2 | 3;
}

export interface TocProps {
  items: TocItem[];
  title?: string;
  className?: string;
}

/**
 * Toc — the "On this page" rail with scroll-spy.
 *
 * Uses a single IntersectionObserver rather than scroll math, so it stays cheap
 * even with long documentation pages.
 */
export function Toc({ items, title = 'On this page', className }: TocProps) {
  const [active, setActive] = useState<string>(items[0]?.id ?? '');

  useEffect(() => {
    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter((element): element is HTMLElement => Boolean(element));

    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: '-80px 0px -70% 0px', threshold: [0, 1] },
    );

    headings.forEach((heading) => observer.observe(heading));
    return () => observer.disconnect();
  }, [items]);

  if (items.length === 0) return null;

  return (
    <nav aria-label={title} className={cn('flex flex-col gap-2', className)}>
      <p className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">{title}</p>
      <ul className="flex flex-col gap-0.5 border-l border-border">
        {items.map((item) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              aria-current={active === item.id ? 'location' : undefined}
              className={cn(
                '-ml-px block border-l py-1 text-sm transition-colors',
                item.level === 3 ? 'pl-6' : 'pl-3',
                active === item.id
                  ? 'border-brand-600 font-medium text-fg'
                  : 'border-transparent text-fg-muted hover:border-border-strong hover:text-fg',
              )}
            >
              {item.title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
