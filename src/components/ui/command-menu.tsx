'use client';

import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';

export interface CommandItem {
  /** Stable value handed back to `onSelect`. */
  value: string;
  label: string;
  description?: string;
  /** Extra text that should match the query but is not displayed. */
  keywords?: string;
  icon?: ReactNode;
  /** Display-only hint, e.g. `⌘K`. */
  shortcut?: string;
}

export interface CommandGroup {
  label: string;
  items: CommandItem[];
}

export interface CommandMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  groups: CommandGroup[];
  onSelect: (value: string, item: CommandItem) => void;
  placeholder?: string;
  emptyMessage?: string;
  /** Accessible name for the dialog. */
  label?: string;
  /** Single key that opens the menu with Meta/Ctrl, e.g. `k`. */
  shortcut?: string;
  className?: string;
}

interface FlatItem {
  item: CommandItem;
  group: string;
  index: number;
}

/**
 * CommandMenu — a ⌘K palette.
 *
 * Built on the native `<dialog>` element, so focus trapping, the top layer, and
 * Escape come from the platform. Filtering and the active row are local state;
 * the consumer only receives the chosen value.
 */
export function CommandMenu({
  open,
  onOpenChange,
  groups,
  onSelect,
  placeholder = 'Search commands…',
  emptyMessage = 'No matching commands.',
  label = 'Command menu',
  shortcut,
  className,
}: CommandMenuProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const baseId = useId();
  const [query, setQuery] = useState('');
  const [active, setActive] = useState(0);

  useEffect(() => {
    const element = dialogRef.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
    if (open) {
      setQuery('');
      setActive(0);
    }
  }, [open]);

  useEffect(() => {
    if (!shortcut) return;
    function onKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === shortcut!.toLowerCase()) {
        event.preventDefault();
        onOpenChange(!open);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [shortcut, open, onOpenChange]);

  const flat = useMemo<FlatItem[]>(() => {
    const needle = query.trim().toLowerCase();
    const matches = (item: CommandItem) =>
      needle.length === 0 ||
      item.label.toLowerCase().includes(needle) ||
      item.keywords?.toLowerCase().includes(needle) ||
      item.description?.toLowerCase().includes(needle);

    return groups.flatMap((group) => group.items.filter(matches).map((item) => ({ item, group: group.label, index: 0 })))
      .map((entry, index) => ({ ...entry, index }));
  }, [groups, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  // Keep the active row in view without scrolling the page.
  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    node?.scrollIntoView({ block: 'nearest' });
  }, [active]);

  function choose(entry: FlatItem | undefined) {
    if (!entry) return;
    onSelect(entry.item.value, entry.item);
    onOpenChange(false);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActive((current) => (flat.length ? (current + 1) % flat.length : 0));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActive((current) => (flat.length ? (current - 1 + flat.length) % flat.length : 0));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setActive(0);
    } else if (event.key === 'End') {
      event.preventDefault();
      setActive(Math.max(0, flat.length - 1));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      choose(flat[active]);
    }
  }

  const activeEntry = flat[active];
  let lastGroup = '';

  return (
    <dialog
      ref={dialogRef}
      aria-label={label}
      onClose={() => onOpenChange(false)}
      className={cn(
        'fixed left-1/2 top-[10vh] m-0 w-[min(40rem,calc(100vw-2rem))] -translate-x-1/2 overflow-hidden rounded-xl border border-border bg-surface-raised p-0 text-fg shadow-2xl',
        'backdrop:bg-overlay backdrop:backdrop-blur-[1px]',
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border px-4">
        <span className="text-fg-subtle" aria-hidden="true">
          <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.5-3.5" />
          </svg>
        </span>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder={placeholder}
          role="combobox"
          aria-expanded="true"
          aria-controls={`${baseId}-list`}
          aria-activedescendant={activeEntry ? `${baseId}-item-${activeEntry.index}` : undefined}
          aria-label={placeholder}
          className="h-12 w-full bg-transparent text-sm text-fg outline-none placeholder:text-fg-subtle"
        />
        <kbd className="hidden shrink-0 rounded border border-border bg-surface-sunken px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle sm:block">
          esc
        </kbd>
      </div>

      <div
        ref={listRef}
        id={`${baseId}-list`}
        role="listbox"
        aria-label={label}
        className="max-h-[min(24rem,60vh)] overflow-y-auto p-2"
      >
        {flat.length === 0 ? (
          <p className="px-3 py-8 text-center text-sm text-fg-subtle">{emptyMessage}</p>
        ) : (
          flat.map((entry) => {
            const heading = entry.group !== lastGroup ? entry.group : null;
            lastGroup = entry.group;
            const selected = entry.index === active;

            return (
              <div key={`${entry.group}-${entry.item.value}`}>
                {heading ? (
                  <p className="px-3 pb-1 pt-3 text-[10px] font-semibold uppercase tracking-wide text-fg-subtle">
                    {heading}
                  </p>
                ) : null}
                <div
                  id={`${baseId}-item-${entry.index}`}
                  data-index={entry.index}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(entry.index)}
                  onClick={() => choose(entry)}
                  className={cn(
                    'flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm',
                    selected ? 'bg-brand-500/10 text-fg' : 'text-fg-muted',
                  )}
                >
                  {entry.item.icon ? (
                    <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center">
                      {entry.item.icon}
                    </span>
                  ) : null}
                  <span className="min-w-0 flex-1">
                    <span className="block truncate font-medium text-fg">{entry.item.label}</span>
                    {entry.item.description ? (
                      <span className="block truncate text-xs text-fg-subtle">
                        {entry.item.description}
                      </span>
                    ) : null}
                  </span>
                  {entry.item.shortcut ? (
                    <kbd className="shrink-0 rounded border border-border bg-surface-sunken px-1.5 py-0.5 font-mono text-[10px] text-fg-subtle">
                      {entry.item.shortcut}
                    </kbd>
                  ) : null}
                </div>
              </div>
            );
          })
        )}
      </div>

      <div className="flex items-center gap-3 border-t border-border bg-surface-sunken/60 px-4 py-2 text-[11px] text-fg-subtle">
        <span>↑↓ navigate</span>
        <span>↵ select</span>
        {shortcut ? <span className="ml-auto font-mono">⌘{shortcut.toUpperCase()}</span> : null}
      </div>
    </dialog>
  );
}
