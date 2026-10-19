import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './container';

export interface NavItem {
  label: ReactNode;
  href: string;
  active?: boolean;
  icon?: ReactNode;
  external?: boolean;
}

export interface NavbarProps extends HTMLAttributes<HTMLElement> {
  brand?: ReactNode;
  items?: NavItem[];
  /** Right-aligned actions (buttons, theme switcher, menu). */
  actions?: ReactNode;
  sticky?: boolean;
  bordered?: boolean;
  maxWidth?: 'lg' | 'xl' | '2xl' | 'full';
}

/** Navbar — a top-level, optionally sticky application header. */
export function Navbar({
  brand,
  items,
  actions,
  sticky = true,
  bordered = true,
  maxWidth = 'full',
  className,
  children,
  ...rest
}: NavbarProps) {
  return (
    <header
      className={cn(
        'z-40 w-full bg-surface/85 backdrop-blur-md',
        sticky && 'sticky top-0',
        bordered && 'border-b border-border',
        className,
      )}
      {...rest}
    >
      <Container maxWidth={maxWidth === 'full' ? 'full' : maxWidth} className="flex h-14 items-center gap-4">
        {brand ? <div className="flex shrink-0 items-center gap-2 font-semibold text-fg">{brand}</div> : null}

        {items && items.length > 0 ? (
          <nav aria-label="Main" className="hidden items-center gap-1 md:flex">
            {items.map((item) => (
              <a
                key={item.href}
                href={item.href}
                aria-current={item.active ? 'page' : undefined}
                target={item.external ? '_blank' : undefined}
                rel={item.external ? 'noreferrer' : undefined}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  item.active ? 'bg-surface-sunken text-fg' : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
                  '[&_svg]:size-4',
                )}
              >
                {item.icon}
                {item.label}
              </a>
            ))}
          </nav>
        ) : null}

      {children}

        <div className="ml-auto flex shrink-0 items-center gap-2">{actions}</div>
      </Container>
    </header>
  );
}
