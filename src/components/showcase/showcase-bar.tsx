'use client';

import { usePathname } from 'next/navigation';
import { showcaseApps } from '@/lib/showcase';
import { cn } from '@/lib/cn';
import { ThemeSwitcher } from '@/components/docs/theme-switcher';
import { ArrowLeftIcon, LayersIcon } from '@/components/ui/icons';

/**
 * ShowcaseBar — the only chrome the showcase apps get.
 *
 * It stays deliberately thin so each app reads as a real product surface rather
 * than a docs page, while still offering a way back and the theme switcher.
 */
export function ShowcaseBar() {
  const pathname = usePathname();
  const slug = pathname.startsWith('/examples/') ? pathname.slice('/examples/'.length) : '';
  const app = showcaseApps.find((entry) => entry.slug === slug);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-bg/85 backdrop-blur-md">
      <div className="flex h-12 w-full items-center gap-3 px-4 sm:px-6">
        <a
          href="/examples"
          className="inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
        >
          <ArrowLeftIcon className="size-4" />
          <span className="hidden sm:inline">All examples</span>
        </a>

        <span aria-hidden="true" className="h-5 w-px bg-border" />

        <div className="flex min-w-0 items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-6 shrink-0 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand"
          >
            {app ? app.name.slice(0, 1) : 'F'}
          </span>
          <span className="truncate text-sm font-semibold text-fg">
            {app ? app.name : 'FlinchUI'}
          </span>
          {app ? (
            <span className="hidden truncate text-sm text-fg-subtle sm:inline">· {app.title}</span>
          ) : null}
        </div>

        <div className="ml-auto flex items-center gap-1.5">
          <a
            href="/components/button"
            className={cn(
              'inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm font-medium',
              'text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg',
            )}
          >
            <LayersIcon className="size-4" />
            <span className="hidden sm:inline">Components</span>
          </a>
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
