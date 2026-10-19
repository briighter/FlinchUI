'use client';

import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ChevronLeftIcon, ChevronRightIcon, MoreHorizontalIcon } from './icons';

export interface PaginationProps extends HTMLAttributes<HTMLElement> {
  page: number;
  pageCount: number;
  onPageChange?: (page: number) => void;
  /** Page href builder — renders links instead of buttons when provided. */
  hrefForPage?: (page: number) => string;
  siblingCount?: number;
  showEdges?: boolean;
}

function range(start: number, end: number) {
  return Array.from({ length: Math.max(0, end - start + 1) }, (_, index) => start + index);
}

function getPages(page: number, pageCount: number, siblings: number): Array<number | 'ellipsis'> {
  const total = siblings * 2 + 5;
  if (pageCount <= total) return range(1, pageCount);

  const left = Math.max(page - siblings, 2);
  const right = Math.min(page + siblings, pageCount - 1);

  return [
    1,
    ...(left > 2 ? (['ellipsis'] as const) : []),
    ...range(left, right),
    ...(right < pageCount - 1 ? (['ellipsis'] as const) : []),
    pageCount,
  ];
}

const itemBase =
  'inline-flex h-9 min-w-9 items-center justify-center rounded-md px-2.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg';

/** Pagination — page navigation with ellipsis collapsing. */
export function Pagination({
  page,
  pageCount,
  onPageChange,
  hrefForPage,
  siblingCount = 1,
  showEdges = true,
  className,
  ...rest
}: PaginationProps) {
  const pages = getPages(page, pageCount, siblingCount);

  const renderItem = (target: number, label: ReactNode, options?: { active?: boolean; disabled?: boolean; srLabel?: string }) => {
    const classes = cn(
      itemBase,
      options?.active
        ? 'bg-brand-600 text-fg-on-brand'
        : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
      options?.disabled && 'pointer-events-none opacity-40',
    );

    if (hrefForPage && !options?.active && !options?.disabled) {
      return (
        <a key={String(label)} href={hrefForPage(target)} className={classes} aria-label={options?.srLabel}>
          {label}
        </a>
      );
    }

    return (
      <button
        key={String(label)}
        type="button"
        onClick={() => onPageChange?.(target)}
        disabled={options?.disabled}
        aria-current={options?.active ? 'page' : undefined}
        aria-label={options?.srLabel}
        className={classes}
      >
        {label}
      </button>
    );
  };

  return (
    <nav aria-label="Pagination" className={cn('flex items-center gap-1', className)} {...rest}>
      {showEdges
        ? renderItem(page - 1, <ChevronLeftIcon className="size-4" />, {
            disabled: page <= 1,
            srLabel: 'Previous page',
          })
        : null}

      {pages.map((entry, index) =>
        entry === 'ellipsis' ? (
          <span
            key={`e-${index}`}
            aria-hidden="true"
            className="inline-flex size-9 items-center justify-center text-fg-subtle"
          >
            <MoreHorizontalIcon className="size-4" />
          </span>
        ) : (
          renderItem(entry, entry, { active: entry === page, srLabel: `Page ${entry}` })
        ),
      )}

      {showEdges
        ? renderItem(page + 1, <ChevronRightIcon className="size-4" />, {
            disabled: page >= pageCount,
            srLabel: 'Next page',
          })
        : null}
    </nav>
  );
}
