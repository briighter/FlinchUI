'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/cn';
import { Kbd } from '@/components/ui/code';
import { SearchIcon, ArrowRightIcon } from '@/components/ui/icons';

export interface SearchItem {
  type: 'component' | 'guide' | 'example';
  title: string;
  description: string;
  href: string;
  category: string;
}

export interface SearchDialogProps {
  items: SearchItem[];
  className?: string;
}

/**
 * SearchDialog — a ⌘K command palette built on the native `<dialog>` element.
 * Filtering is a simple, dependency-free substring + word-prefix match.
 */
export function SearchDialog({ items, className }: SearchDialogProps) {
  const router = useRouter();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return items.slice(0, 12);

    const words = term.split(/\s+/);
    return items
      .map((item) => {
        const haystack = `${item.title} ${item.category} ${item.description}`.toLowerCase();
        let score = 0;
        for (const word of words) {
          if (!haystack.includes(word)) return { item, score: -1 };
          if (item.title.toLowerCase().startsWith(word)) score += 3;
          else if (item.title.toLowerCase().includes(word)) score += 2;
          else score += 1;
        }
        return { item, score };
      })
      .filter((entry) => entry.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 12)
      .map((entry) => entry.item);
  }, [items, query]);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;
    if (open && !element.open) {
      element.showModal();
      requestAnimationFrame(() => inputRef.current?.focus());
    }
    if (!open && element.open) element.close();
  }, [open]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setOpen(true);
      }
    }
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => setActive(0), [query]);

  function go(href: string) {
    setOpen(false);
    setQuery('');
    router.push(href);
  }

  function onInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((index) => Math.min(index + 1, results.length - 1));
    }
    if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((index) => Math.max(index - 1, 0));
    }
    if (event.key === 'Enter') {
      event.preventDefault();
      const result = results[active];
      if (result) go(result.href);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          'inline-flex h-9 items-center gap-2 rounded-md border border-border bg-surface px-2.5 text-sm text-fg-subtle transition-colors hover:border-border-strong hover:text-fg',
          className,
        )}
        aria-label="Search documentation"
      >
        <SearchIcon className="size-4" />
        <span className="hidden sm:inline">Search</span>
        <span className="ml-1 hidden items-center gap-0.5 sm:flex">
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </span>
      </button>

      <dialog
        ref={dialogRef}
        aria-label="Search documentation"
        onClose={() => setOpen(false)}
        onClick={(event) => {
          if (event.target === dialogRef.current) setOpen(false);
        }}
        className={cn(
          'fixed inset-x-0 top-[10vh] z-100 m-auto w-[min(40rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-surface-raised p-0 text-fg shadow-xl',
          'backdrop:bg-overlay',
          'open:animate-scale-in',
        )}
      >
        <div className="flex items-center gap-3 border-b border-border px-4">
          <SearchIcon className="size-4 shrink-0 text-fg-subtle" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKeyDown}
            placeholder="Search components and guides…"
            aria-label="Search"
            autoComplete="off"
            className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="shrink-0 rounded border border-border px-1.5 py-0.5 text-[11px] text-fg-subtle hover:text-fg"
          >
            Esc
          </button>
        </div>

        <div className="max-h-[min(24rem,60vh)] overflow-y-auto p-2">
          {results.length === 0 ? (
            <p className="px-3 py-8 text-center text-sm text-fg-muted">
              No results for “{query}”.
            </p>
          ) : (
            <ul role="listbox" aria-label="Search results" className="flex flex-col gap-0.5">
              {results.map((result, index) => (
                <li key={result.href} role="option" aria-selected={index === active}>
                  <button
                    type="button"
                    onMouseEnter={() => setActive(index)}
                    onClick={() => go(result.href)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-md px-3 py-2 text-left transition-colors',
                      index === active ? 'bg-surface-sunken' : 'hover:bg-surface-sunken/60',
                    )}
                  >
                    <span className="min-w-0 flex-1">
                      <span className="flex items-center gap-2">
                        <span className="truncate text-sm font-medium text-fg">{result.title}</span>
                        <span className="shrink-0 rounded-sm bg-surface-sunken px-1.5 py-0.5 text-[10px] font-medium tracking-wide text-fg-subtle uppercase">
                          {result.category}
                        </span>
                      </span>
                      <span className="mt-0.5 block truncate text-xs text-fg-muted">{result.description}</span>
                    </span>
                    <ArrowRightIcon className="size-3.5 shrink-0 text-fg-subtle" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </dialog>
    </>
  );
}
