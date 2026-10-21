'use client';

import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/lib/hooks/use-controllable-state';
import { ChevronLeftIcon, ChevronRightIcon } from './icons';

export interface DateRange {
  start: Date | null;
  end: Date | null;
}

export interface DatePickerProps {
  /** `single` picks one date; `range` picks an inclusive start/end pair. */
  mode?: 'single' | 'range';
  value?: Date | null;
  defaultValue?: Date | null;
  onChange?: (date: Date | null) => void;
  rangeValue?: DateRange;
  defaultRangeValue?: DateRange;
  onRangeChange?: (range: DateRange) => void;
  /** Earliest selectable date (inclusive). */
  min?: Date;
  /** Latest selectable date (inclusive). */
  max?: Date;
  weekStartsOn?: 0 | 1;
  /** Bias the grid here on open instead of the selected/today's month. */
  defaultViewMonth?: Date;
  label?: string;
  disabled?: boolean;
  className?: string;
}

const WEEKDAYS_SUN = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const WEEKDAYS_MON = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date | null | undefined, b: Date | null | undefined) {
  return Boolean(
    a && b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate(),
  );
}

function isoDate(date: Date) {
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

function parseIso(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function addDays(date: Date, amount: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + amount);
  return next;
}

function buildMonth(year: number, month: number, weekStartsOn: 0 | 1): Date[][] {
  const first = new Date(year, month, 1);
  const offset = (first.getDay() - weekStartsOn + 7) % 7;
  const gridStart = addDays(first, -offset);
  const weeks: Date[][] = [];
  let cursor = gridStart;
  for (let week = 0; week < 6; week += 1) {
    const row: Date[] = [];
    for (let day = 0; day < 7; day += 1) {
      row.push(cursor);
      cursor = addDays(cursor, 1);
    }
    weeks.push(row);
  }
  return weeks;
}

/**
 * DatePicker — a month grid for mouse and keyboard, backed by a native
 * `<input type="date">` for typed entry and mobile pickers.
 *
 * The grid is a `role="grid"` with one tab stop (roving tabindex); every other
 * cell is reachable with the arrow keys, PageUp/PageDown, Home, and End. All
 * math is local-time at midnight, so no date lands on the wrong day near UTC
 * midnight.
 */
export function DatePicker({
  mode = 'single',
  value,
  defaultValue = null,
  onChange,
  rangeValue,
  defaultRangeValue = { start: null, end: null },
  onRangeChange,
  min,
  max,
  weekStartsOn = 0,
  defaultViewMonth,
  label = 'Choose a date',
  disabled = false,
  className,
}: DatePickerProps) {
  const [single, setSingle] = useControllableState<Date | null>({
    value,
    defaultValue,
    onChange,
  });
  const [range, setRange] = useControllableState<DateRange>({
    value: rangeValue,
    defaultValue: defaultRangeValue,
    onChange: onRangeChange,
  });

  const today = useMemo(() => startOfDay(new Date()), []);
  const initialView = useMemo(() => {
    if (defaultViewMonth) return new Date(defaultViewMonth.getFullYear(), defaultViewMonth.getMonth(), 1);
    const anchor = mode === 'range' ? range.start ?? range.end ?? today : single ?? today;
    return new Date(anchor.getFullYear(), anchor.getMonth(), 1);
    // The view only needs to initialise once; controlled updates move it via the header.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [view, setView] = useState(initialView);
  const [focusedKey, setFocusedKey] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const disabledDay = (date: Date) =>
    disabled || (min && date < startOfDay(min)) || (max && date > startOfDay(max)) || false;

  const weeks = useMemo(
    () => buildMonth(view.getFullYear(), view.getMonth(), weekStartsOn),
    [view, weekStartsOn],
  );
  const weekdays = weekStartsOn === 1 ? WEEKDAYS_MON : WEEKDAYS_SUN;

  // Roving tabindex: exactly one cell is tabbable, and keyboard moves move focus.
  useEffect(() => {
    if (!focusedKey) return;
    const node = gridRef.current?.querySelector<HTMLButtonElement>(`[data-key="${focusedKey}"]`);
    node?.focus();
  }, [focusedKey, view]);

  function moveFocus(date: Date) {
    if (date.getMonth() !== view.getMonth() || date.getFullYear() !== view.getFullYear()) {
      setView(new Date(date.getFullYear(), date.getMonth(), 1));
    }
    setFocusedKey(isoDate(date));
  }

  function choose(date: Date) {
    if (mode === 'range') {
      if (range.start && range.end) {
        setRange({ start: date, end: null });
      } else if (range.start) {
        if (date >= range.start) setRange({ start: range.start, end: date });
        else setRange({ start: date, end: null });
      } else {
        setRange({ start: date, end: null });
      }
    } else {
      setSingle(sameDay(single, date) ? null : date);
    }
    setFocusedKey(isoDate(date));
  }

  function onGridKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const key = target.getAttribute('data-key');
    if (!key) return;
    const current = parseIso(key);
    if (!current) return;

    const steps: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -7,
      ArrowDown: 7,
      PageUp: -1000,
      PageDown: 1000,
    };

    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      const offset = event.key === 'Home' ? -((current.getDay() - weekStartsOn + 7) % 7) : 6 - ((current.getDay() - weekStartsOn + 7) % 7);
      moveFocus(addDays(current, offset));
    } else if (steps[event.key] !== undefined) {
      event.preventDefault();
      moveFocus(steps[event.key] === -1000 || steps[event.key] === 1000
        ? new Date(current.getFullYear(), current.getMonth() + (steps[event.key] > 0 ? 1 : -1), 1)
        : addDays(current, steps[event.key]));
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      choose(current);
    }
  }

  const rangeStart = mode === 'range' ? range.start : null;
  const rangeEnd = mode === 'range' ? range.end : null;
  const summary = mode === 'range'
    ? `${rangeStart ? isoDate(rangeStart) : '…'} to ${rangeEnd ? isoDate(rangeEnd) : '…'}`
    : single
      ? isoDate(single)
      : 'None';

  return (
    <div
      className={cn('flex w-fit max-w-full flex-col gap-3 rounded-lg border border-border bg-surface p-3', disabled && 'opacity-60', className)}
    >
      <span className="sr-only">{label}</span>

      <div className="flex items-center justify-between gap-2">
        <button
          type="button"
          onClick={() => setView(addMonths(view, -1))}
          disabled={disabled}
          aria-label="Previous month"
          className="inline-flex size-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        >
          <ChevronLeftIcon className="size-4" />
        </button>
        <span aria-live="polite" className="text-sm font-semibold text-fg">
          {MONTHS[view.getMonth()]} {view.getFullYear()}
        </span>
        <button
          type="button"
          onClick={() => setView(addMonths(view, 1))}
          disabled={disabled}
          aria-label="Next month"
          className="inline-flex size-8 items-center justify-center rounded-md text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-40"
        >
          <ChevronRightIcon className="size-4" />
        </button>
      </div>

      <div
        ref={gridRef}
        role="grid"
        aria-label={label}
        onKeyDown={onGridKeyDown}
        className="flex flex-col gap-1 text-xs"
      >
        <div role="row" className="grid grid-cols-7">
          {weekdays.map((weekday) => (
            <span
              key={weekday}
              role="columnheader"
              aria-label={weekday}
              className="flex h-8 items-center justify-center font-medium text-fg-subtle"
            >
              {weekday}
            </span>
          ))}
        </div>

        {weeks.map((week, weekIndex) => (
          <div key={weekIndex} role="row" className="grid grid-cols-7">
            {week.map((date) => {
              const key = isoDate(date);
              const outside = date.getMonth() !== view.getMonth();
              const selected =
                mode === 'range'
                  ? sameDay(rangeStart, date) || sameDay(rangeEnd, date)
                  : sameDay(single, date);
              const inRange =
                mode === 'range' &&
                rangeStart &&
                rangeEnd &&
                date > rangeStart &&
                date < rangeEnd;
              const isToday = sameDay(today, date);
              const isBlocked = disabledDay(date);

              return (
                <div key={key} role="gridcell" aria-selected={selected || undefined} className="p-0.5">
                  <button
                    type="button"
                    data-key={key}
                    tabIndex={focusedKey === null ? (key === isoDate(single ?? rangeStart ?? today) ? 0 : -1) : focusedKey === key ? 0 : -1}
                    disabled={isBlocked}
                    aria-disabled={isBlocked || undefined}
                    aria-current={isToday ? 'date' : undefined}
                    aria-label={`${date.getDate()} ${MONTHS[date.getMonth()]} ${date.getFullYear()}`}
                    onClick={() => choose(date)}
                    className={cn(
                      'flex size-8 items-center justify-center rounded-md font-medium tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                      outside ? 'text-fg-subtle/60' : 'text-fg',
                      inRange && 'rounded-none bg-brand-500/10 text-fg',
                      selected
                        ? 'bg-brand-600 text-fg-on-brand hover:bg-brand-700'
                        : !isBlocked && 'hover:bg-surface-sunken',
                      isBlocked && 'cursor-not-allowed text-fg-subtle/50 line-through',
                      isToday && !selected && 'border border-brand-500/40',
                    )}
                  >
                    {date.getDate()}
                  </button>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 border-t border-border pt-2.5">
        <span aria-live="polite" className="font-mono text-[11px] text-fg-muted">{summary}</span>
        {mode === 'single' ? (
          <input
            type="date"
            value={single ? isoDate(single) : ''}
            min={min ? isoDate(startOfDay(min)) : undefined}
            max={max ? isoDate(startOfDay(max)) : undefined}
            disabled={disabled}
            onChange={(event) => setSingle(event.target.value ? parseIso(event.target.value) : null)}
            aria-label="Type a date"
            className="rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px] text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
          />
        ) : (
          <span className="flex gap-1.5">
            <input
              type="date"
              aria-label="Start date"
              value={rangeStart ? isoDate(rangeStart) : ''}
              disabled={disabled}
              onChange={(event) => setRange({ ...range, start: event.target.value ? parseIso(event.target.value) : null })}
              className="w-[8.75rem] rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px] text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
            <input
              type="date"
              aria-label="End date"
              value={rangeEnd ? isoDate(rangeEnd) : ''}
              disabled={disabled}
              onChange={(event) => setRange({ ...range, end: event.target.value ? parseIso(event.target.value) : null })}
              className="w-[8.75rem] rounded-md border border-border bg-surface px-2 py-1 font-mono text-[11px] text-fg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-60"
            />
          </span>
        )}
      </div>
    </div>
  );
}
