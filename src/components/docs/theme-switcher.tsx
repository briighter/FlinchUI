'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { PaletteIcon, CheckIcon } from '@/components/ui/icons';

const THEMES = [
  { id: 'light', label: 'Light' },
  { id: 'dark', label: 'Dark' },
  { id: 'violet', label: 'Violet' },
  { id: 'emerald', label: 'Emerald' },
  { id: 'amber', label: 'Amber' },
  { id: 'rose', label: 'Rose' },
  { id: 'high-contrast', label: 'High contrast' },
] as const;

const STORAGE_KEY = 'flinch-theme';

/** ThemeSwitcher — writes `data-theme` on <html> and remembers the choice. */
export function ThemeSwitcher({ className }: { className?: string }) {
  const [theme, setTheme] = useState<string>('light');
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && THEMES.some((entry) => entry.id === stored)) setTheme(stored);
  }, []);

  function apply(next: string) {
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* storage may be unavailable; theming still works for the session */
    }
    setOpen(false);
  }

  return (
    <div className={cn('relative', className)}>
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Change theme"
        className="inline-flex size-9 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      >
        <PaletteIcon className="size-4" />
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-hidden="true"
            tabIndex={-1}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-40 cursor-default"
          />
          <div
            role="menu"
            className="absolute right-0 z-50 mt-1 w-44 animate-scale-in rounded-lg border border-border bg-surface-raised p-1 shadow-lg"
          >
            {THEMES.map((entry) => (
              <button
                key={entry.id}
                type="button"
                role="menuitemradio"
                aria-checked={theme === entry.id}
                onClick={() => apply(entry.id)}
                className="flex w-full items-center justify-between gap-2 rounded-md px-2.5 py-1.5 text-left text-sm text-fg hover:bg-surface-sunken"
              >
                <span className="flex items-center gap-2">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'size-3 rounded-full border border-black/10',
                      entry.id === 'light' && 'bg-white',
                      entry.id === 'dark' && 'bg-neutral-900',
                      entry.id === 'violet' && 'bg-[oklch(0.55_0.22_305)]',
                      entry.id === 'emerald' && 'bg-[oklch(0.59_0.13_165)]',
                      entry.id === 'amber' && 'bg-[oklch(0.75_0.16_76)]',
                      entry.id === 'rose' && 'bg-[oklch(0.58_0.22_12)]',
                      entry.id === 'high-contrast' && 'bg-black ring-2 ring-white',
                    )}
                  />
                  {entry.label}
                </span>
                {theme === entry.id ? <CheckIcon className="size-3.5 text-brand-600" /> : null}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}
