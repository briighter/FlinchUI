'use client';

import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import type { NavSection } from '@/lib/nav';
import { Badge } from '@/components/ui/badge';

export interface DocsSidebarProps {
  nav: NavSection[];
  className?: string;
  onNavigate?: () => void;
}

/** DocsSidebar — grouped navigation rail that highlights the current route. */
export function DocsSidebar({ nav, className, onNavigate }: DocsSidebarProps) {
  const pathname = usePathname();

  return (
    <nav aria-label="Documentation" className={cn('flex flex-col gap-6', className)}>
      {nav.map((section) => (
        <div key={section.title} className="flex flex-col gap-1">
          <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-fg-subtle uppercase">
            {section.title}
          </p>
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => {
              const active = pathname === item.href;
              return (
                <li key={item.href}>
                  <a
                    href={item.href}
                    onClick={onNavigate}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex items-center justify-between gap-2 rounded-md px-3 py-1.5 text-sm transition-colors',
                      active
                        ? 'bg-brand-50 font-medium text-brand-700 dark:text-brand-300'
                        : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
                    )}
                  >
                    <span className="truncate">{item.label}</span>
                    {item.badge ? (
                      <Badge tone="brand" size="sm" className="shrink-0">
                        {item.badge}
                      </Badge>
                    ) : null}
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
