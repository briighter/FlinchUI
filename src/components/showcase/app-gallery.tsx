'use client';

import { useState } from 'react';
import { showcaseApps, showcaseCategories } from '@/lib/showcase';
import { cn } from '@/lib/cn';
import { AppCard } from './app-card';

const FILTERS = ['All', ...showcaseCategories] as const;

/** AppGallery — the filterable grid of showcase applications. */
export function AppGallery() {
  const [active, setActive] = useState<string>('All');

  const apps =
    active === 'All' ? showcaseApps : showcaseApps.filter((app) => app.category === active);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap gap-2" role="group" aria-label="Filter examples by category">
        {FILTERS.map((filter) => {
          const selected = filter === active;
          const count =
            filter === 'All'
              ? showcaseApps.length
              : showcaseApps.filter((app) => app.category === filter).length;
          return (
            <button
              key={filter}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(filter)}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors',
                selected
                  ? 'border-transparent bg-brand-600 text-fg-on-brand'
                  : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg',
              )}
            >
              {filter}
              <span className={cn('text-xs tabular-nums', selected ? 'opacity-70' : 'text-fg-subtle')}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </div>
    </div>
  );
}
