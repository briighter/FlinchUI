'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Drawer } from '@/components/ui/drawer';
import { MenuIcon, BookOpenIcon, SparklesIcon, LayersIcon, BoxIcon } from '@/components/ui/icons';
import type { NavSection } from '@/lib/nav';
import type { SearchItem } from './search';
import { SearchDialog } from './search';
import { ThemeSwitcher } from './theme-switcher';
import { DocsSidebar } from './docs-sidebar';

export interface DocsHeaderProps {
  nav: NavSection[];
  searchItems: SearchItem[];
}

const LINKS = [
  { href: '/docs/introduction', label: 'Docs', icon: BookOpenIcon },
  { href: '/components/button', label: 'Components', icon: LayersIcon },
  { href: '/examples', label: 'Examples', icon: BoxIcon },
  { href: '/docs/ai', label: 'AI', icon: SparklesIcon },
];

/** DocsHeader — sticky navbar with search, theme switcher, and mobile navigation. */
export function DocsHeader({ nav, searchItems }: DocsHeaderProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
        <div className="mx-auto flex h-14 w-full max-w-screen-2xl items-center gap-3 px-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open navigation"
            className="-ml-1 inline-flex size-9 items-center justify-center rounded-md text-fg-muted hover:bg-surface-sunken hover:text-fg lg:hidden"
          >
            <MenuIcon className="size-5" />
          </button>

          <a href="/" className="flex shrink-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-md bg-brand-600 text-sm font-extrabold text-fg-on-brand"
            >
              F
            </span>
            <span className="text-sm font-semibold tracking-tight text-fg">
              Flinch<span className="text-brand-600">UI</span>
            </span>
            <span className="ml-1 hidden rounded-full border border-border px-1.5 py-0.5 text-[10px] font-medium text-fg-subtle sm:inline">
              v0.2
            </span>
          </a>

          <nav aria-label="Primary" className="ml-4 hidden items-center gap-1 md:flex">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`) || (link.href === '/components/button' && pathname.startsWith('/components'));
              return (
                <a
                  key={link.href}
                  href={link.href}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                    active ? 'text-fg' : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
                  )}
                >
                  <link.icon className="size-4" />
                  {link.label}
                </a>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-1.5">
            <SearchDialog items={searchItems} />
            <ThemeSwitcher />
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hidden sm:block"
              aria-label="GitHub repository"
            >
              <Button variant="ghost" size="icon-sm" asChild>
                <span>
                  <svg viewBox="0 0 24 24" fill="currentColor" className="size-4" aria-hidden="true">
                    <path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05a9.36 9.36 0 0 1 2.5-.34c.85 0 1.71.12 2.5.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.81-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.6.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z" />
                  </svg>
                </span>
              </Button>
            </a>
          </div>
        </div>
      </header>

      <Drawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        side="left"
        ariaLabel="Documentation menu"
      >
        <DocsSidebar nav={nav} onNavigate={() => setMobileOpen(false)} />
      </Drawer>
    </>
  );
}
