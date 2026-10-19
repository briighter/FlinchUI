import type { HTMLAttributes, ReactNode } from 'react';
import { ChevronRightIcon } from './icons';

export interface BreadcrumbItem {
  label: ReactNode;
  href?: string;
}

export interface BreadcrumbProps extends HTMLAttributes<HTMLElement> {
  items: BreadcrumbItem[];
  separator?: ReactNode;
  /** Collapse middle items behind an ellipsis on small screens. */
  maxItems?: number;
}

/** Breadcrumb — hierarchical navigation trail. */
export function Breadcrumb({
  items,
  separator,
  maxItems = 0,
  className,
  ...rest
}: BreadcrumbProps) {
  let visible = items;
  if (maxItems > 0 && items.length > maxItems) {
    visible = [items[0]!, ...items.slice(items.length - (maxItems - 1))];
  }
  const collapsed = visible.length !== items.length;

  return (
    <nav aria-label="Breadcrumb" className={className} {...rest}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm">
        {visible.map((item, index) => {
          const isLast = index === visible.length - 1;
          return (
            <li key={index} className="flex items-center gap-1.5">
              {index > 0 ? (
                collapsed && index === 1 ? (
                  <span className="text-fg-subtle">…</span>
                ) : (
                  <span aria-hidden="true" className="text-fg-subtle [&_svg]:size-3.5">
                    {separator ?? <ChevronRightIcon />}
                  </span>
                )
              ) : null}
              {item.href && !isLast ? (
                <a
                  href={item.href}
                  className="font-medium text-fg-muted transition-colors hover:text-fg"
                >
                  {item.label}
                </a>
              ) : (
                <span aria-current={isLast ? 'page' : undefined} className="font-medium text-fg">
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
