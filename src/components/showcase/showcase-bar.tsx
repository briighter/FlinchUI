'use client';

import { usePathname } from 'next/navigation';
import { showcaseApps } from '@/lib/showcase';
import { cn } from '@/lib/cn';
import { ThemeSwitcher } from '@/components/docs/theme-switcher';
import {
  ArrowLeftIcon,
  BookOpenIcon,
  LayersIcon,
  PaletteIcon,
} from '@/components/ui/icons';

const LINK =
  'inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg';

/**
 * ShowcaseBar — the thin chrome the showcase apps get.
 *
 * It stays deliberately sparse so each app reads as a product surface, but it
 * always carries a route back to the docs, the component index, and the theme
 * studio. Icon-only labels keep it usable on a phone.
 */
export function ShowcaseBar() {
  const pathname = usePathname();
  const isGallery = pathname === '/examples';
  const slug = pathname.startsWith('/examples/') ? pathname.slice('/examples/'.length) : '';
  const app = showcaseApps.find((entry) => entry.slug === slug);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="flex h-12 w-full items-center gap-1.5 px-3 sm:gap-3 sm:px-6">
        <a
          href="/"
          aria-label="FlinchUI home"
          className="inline-flex shrink-0 items-center gap-2 rounded-md py-1 text-sm font-semibold text-fg"
        >
          <span
            aria-hidden="true"
            className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand"
          >
            F
          </span>
          <span className="hidden sm:inline">FlinchUI</span>
        </a>

        <span aria-hidden="true" className="h-5 w-px shrink-0 bg-border" />

        {isGallery ? (
          <span className="truncate px-2 text-sm text-fg-muted">All examples</span>
        ) : (
          <a href="/examples" className={cn(LINK, 'shrink-0')}>
            <ArrowLeftIcon className="size-4" />
            <span className="hidden sm:inline">Examples</span>
            <span className="sr-only sm:hidden">All examples</span>
          </a>
        )}

        {app ? (
          <>
            <span aria-hidden="true" className="hidden h-5 w-px shrink-0 bg-border sm:block" />
            <span className="hidden min-w-0 items-center gap-1.5 sm:flex">
              <span className="truncate text-sm font-semibold text-fg">{app.name}</span>
              <span className="hidden truncate text-sm text-fg-subtle md:inline">
                · {app.title}
              </span>
            </span>
          </>
        ) : null}

        <div className="ml-auto flex shrink-0 items-center gap-0.5 sm:gap-1">
          <a href="/docs/introduction" className={LINK} aria-label="Documentation">
            <BookOpenIcon className="size-4" />
            <span className="hidden md:inline">Docs</span>
          </a>
          <a href="/components/button" className={LINK} aria-label="Components">
            <LayersIcon className="size-4" />
            <span className="hidden md:inline">Components</span>
          </a>
          <a
            href="/tools/theme"
            className={cn(LINK, 'hidden md:inline-flex')}
            aria-label="Theme Studio"
          >
            <PaletteIcon className="size-4" />
            <span>Theme Studio</span>
          </a>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
