import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface SidebarItem {
  label: ReactNode;
  href: string;
  icon?: ReactNode;
  badge?: ReactNode;
  /** Marks the currently active route. */
  active?: boolean;
}

export interface SidebarSection {
  title?: ReactNode;
  items: SidebarItem[];
}

export interface SidebarProps extends HTMLAttributes<HTMLElement> {
  sections: SidebarSection[];
  /** Rendered at the top of the rail. */
  header?: ReactNode;
  /** Rendered at the bottom of the rail. */
  footer?: ReactNode;
  sticky?: boolean;
}

/** Sidebar — a vertical navigation rail with labeled sections. */
export function Sidebar({
  sections,
  header,
  footer,
  sticky = true,
  className,
  ...rest
}: SidebarProps) {
  return (
    <nav
      aria-label="Sidebar"
      className={cn('flex flex-col gap-6', sticky && 'sticky top-14 max-h-[calc(100dvh-3.5rem)] overflow-y-auto', className)}
      {...rest}
    >
      {header ? <div className="shrink-0">{header}</div> : null}

      {sections.map((section, index) => (
        <div key={index} className="flex flex-col gap-1">
          {section.title ? (
            <p className="px-3 pb-1 text-xs font-semibold tracking-wide text-fg-subtle uppercase">
              {section.title}
            </p>
          ) : null}
          <ul className="flex flex-col gap-0.5">
            {section.items.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  aria-current={item.active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm transition-colors',
                    item.active
                      ? 'bg-brand-50 font-medium text-brand-700 dark:text-brand-300'
                      : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
                    '[&_svg]:size-4 [&_svg]:shrink-0',
                  )}
                >
                  {item.icon}
                  <span className="min-w-0 flex-1 truncate">{item.label}</span>
                  {item.badge ? <span className="shrink-0">{item.badge}</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}

      {footer ? <div className="mt-auto shrink-0">{footer}</div> : null}
    </nav>
  );
}
