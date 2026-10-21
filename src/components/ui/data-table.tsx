'use client';

import { useEffect, useMemo, useRef, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/lib/hooks/use-controllable-state';
import { Checkbox } from './checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './table';

export interface DataTableColumn<T> {
  key: string;
  header: ReactNode;
  cell: (row: T) => ReactNode;
  /** Supply to make the column sortable. */
  sortValue?: (row: T) => string | number;
  align?: 'left' | 'center' | 'right';
  /** Pin the leading column while the table scrolls horizontally. */
  pinned?: boolean;
  className?: string;
  headerClassName?: string;
}

export interface DataTableSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  rows: T[];
  rowId: (row: T) => string;
  /** Accessible name for the table. */
  label?: string;
  caption?: ReactNode;
  emptyMessage?: ReactNode;
  selectable?: boolean;
  selectedIds?: string[];
  onSelectionChange?: (ids: string[]) => void;
  sort?: DataTableSort | null;
  defaultSort?: DataTableSort | null;
  onSortChange?: (sort: DataTableSort | null) => void;
  onRowClick?: (row: T) => void;
  stickyHeader?: boolean;
  density?: 'compact' | 'normal';
  /** Classes for the horizontal scroll container around the table. */
  containerClassName?: string;
  className?: string;
}

const ALIGN: Record<'left' | 'center' | 'right', string> = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
};

const DENSITY = {
  compact: '[&_td]:py-1.5 [&_th]:h-8',
  normal: '',
} as const;

/**
 * DataTable — sorting, selection, and a pinned leading column on top of a
 * semantic `<table>`.
 *
 * Sorting and selection are controlled-or-uncontrolled via the same hook the
 * rest of the library uses, and every column renders through a plain render
 * function, so the consumer keeps full control of cell markup.
 */
export function DataTable<T>({
  columns,
  rows,
  rowId,
  label,
  caption,
  emptyMessage = 'No rows to show.',
  selectable = false,
  selectedIds,
  onSelectionChange,
  sort,
  defaultSort = null,
  onSortChange,
  onRowClick,
  stickyHeader = false,
  density = 'normal',
  containerClassName,
  className,
}: DataTableProps<T>) {
  const [selected, setSelected] = useControllableState<string[]>({
    value: selectedIds,
    defaultValue: [],
    onChange: onSelectionChange,
  });
  const [currentSort, setCurrentSort] = useControllableState<DataTableSort | null>({
    value: sort,
    defaultValue: defaultSort,
    onChange: onSortChange,
  });

  const allChecked = rows.length > 0 && rows.every((row) => selected.includes(rowId(row)));
  const someChecked = rows.some((row) => selected.includes(rowId(row))) && !allChecked;
  const headerBox = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (headerBox.current) headerBox.current.indeterminate = someChecked;
  }, [someChecked]);

  const sorted = useMemo(() => {
    if (!currentSort) return rows;
    const column = columns.find((entry) => entry.key === currentSort.key);
    if (!column?.sortValue) return rows;
    const factor = currentSort.direction === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const left = column.sortValue!(a);
      const right = column.sortValue!(b);
      if (typeof left === 'number' && typeof right === 'number') return (left - right) * factor;
      return String(left).localeCompare(String(right), undefined, { numeric: true }) * factor;
    });
  }, [rows, columns, currentSort]);

  function toggleSort(key: string) {
    const column = columns.find((entry) => entry.key === key);
    if (!column?.sortValue) return;
    if (currentSort?.key !== key) {
      setCurrentSort({ key, direction: 'asc' });
    } else if (currentSort.direction === 'asc') {
      setCurrentSort({ key, direction: 'desc' });
    } else {
      setCurrentSort(null);
    }
  }

  function toggleAll() {
    if (allChecked) {
      setSelected(selected.filter((id) => !rows.some((row) => rowId(row) === id)));
    } else {
      const next = new Set(selected);
      for (const row of rows) next.add(rowId(row));
      setSelected(Array.from(next));
    }
  }

  function toggleRow(id: string) {
    setSelected(selected.includes(id) ? selected.filter((entry) => entry !== id) : [...selected, id]);
  }

  const span = columns.length + (selectable ? 1 : 0);

  return (
    <Table
      aria-label={label}
      containerClassName={containerClassName}
      className={cn(
        DENSITY[density],
        stickyHeader && '[&_thead]:sticky [&_thead]:top-0 [&_thead]:z-10',
      )}
    >
      {caption ? <caption className="py-3 text-sm text-fg-muted">{caption}</caption> : null}
      <TableHeader>
        <TableRow>
          {selectable ? (
            <TableHead className="w-10 pr-0">
              <Checkbox
                ref={headerBox}
                checked={allChecked}
                onChange={toggleAll}
                aria-label={allChecked ? 'Deselect all rows' : 'Select all rows'}
              />
            </TableHead>
          ) : null}
          {columns.map((column) => {
            const active = currentSort?.key === column.key;
            const sortable = Boolean(column.sortValue);
            return (
              <TableHead
                key={column.key}
                aria-sort={
                  active ? (currentSort!.direction === 'asc' ? 'ascending' : 'descending') : undefined
                }
                className={cn(
                  ALIGN[column.align ?? 'left'],
                  column.pinned && 'sticky left-0 z-10 bg-surface-sunken',
                  column.headerClassName,
                )}
              >
                {sortable ? (
                  <button
                    type="button"
                    onClick={() => toggleSort(column.key)}
                    className={cn(
                      'inline-flex items-center gap-1 rounded-sm text-xs font-semibold uppercase tracking-wide transition-colors hover:text-fg',
                      active ? 'text-fg' : 'text-fg-muted',
                    )}
                  >
                    {column.header}
                    <span aria-hidden="true" className="font-mono text-[10px]">
                      {active ? (currentSort!.direction === 'asc' ? '▲' : '▼') : '↕'}
                    </span>
                  </button>
                ) : (
                  column.header
                )}
              </TableHead>
            );
          })}
        </TableRow>
      </TableHeader>

      <TableBody>
        {sorted.length === 0 ? (
          <TableRow>
            <TableCell colSpan={span} className="py-10 text-center text-sm text-fg-subtle">
              {emptyMessage}
            </TableCell>
          </TableRow>
        ) : (
          sorted.map((row) => {
            const id = rowId(row);
            const isSelected = selected.includes(id);
            return (
              <TableRow
                key={id}
                data-state={isSelected ? 'selected' : undefined}
                className={cn(isSelected && 'bg-brand-500/5', onRowClick && 'cursor-pointer')}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
              >
                {selectable ? (
                  <TableCell className="w-10 pr-0" onClick={(event) => event.stopPropagation()}>
                    <Checkbox
                      checked={isSelected}
                      onChange={() => toggleRow(id)}
                      aria-label={`Select row ${id}`}
                    />
                  </TableCell>
                ) : null}
                {columns.map((column) => (
                  <TableCell
                    key={column.key}
                    className={cn(
                      ALIGN[column.align ?? 'left'],
                      column.pinned && 'sticky left-0 z-10 bg-surface',
                      column.className,
                    )}
                  >
                    {column.cell(row)}
                  </TableCell>
                ))}
              </TableRow>
            );
          })
        )}
      </TableBody>
    </Table>
  );
}
