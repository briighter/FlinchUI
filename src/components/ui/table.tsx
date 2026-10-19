import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface TableProps extends HTMLAttributes<HTMLTableElement> {
  /** Wrap the table so it scrolls horizontally on small screens. */
  containerClassName?: string;
  striped?: boolean;
  bordered?: boolean;
}

/** Table — a themed data table with striped/bordered options. */
export function Table({
  className,
  containerClassName,
  striped = false,
  bordered = false,
  ...rest
}: TableProps) {
  return (
    <div className={cn('relative w-full overflow-x-auto', containerClassName)}>
      <table
        className={cn(
          'w-full caption-bottom border-collapse text-sm',
          striped && '[&_tbody_tr:nth-child(odd)]:bg-surface-sunken/50',
          bordered && '[&_td]:border [&_th]:border',
          className,
        )}
        {...rest}
      />
    </div>
  );
}

export function TableHeader({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('bg-surface-sunken/60', className)} {...rest} />;
}

export function TableBody({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('divide-y divide-border', className)} {...rest} />;
}

export function TableFooter({ className, ...rest }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tfoot className={cn('border-t border-border bg-surface-sunken/60 font-medium', className)} {...rest} />;
}

export function TableRow({ className, ...rest }: HTMLAttributes<HTMLTableRowElement>) {
  return <tr className={cn('transition-colors hover:bg-surface-sunken/40', className)} {...rest} />;
}

export function TableHead({ className, ...rest }: ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        'h-10 px-4 text-left align-middle text-xs font-semibold tracking-wide text-fg-muted uppercase',
        className,
      )}
      {...rest}
    />
  );
}

export function TableCell({ className, ...rest }: TdHTMLAttributes<HTMLTableCellElement>) {
  return <td className={cn('px-4 py-3 align-middle text-fg', className)} {...rest} />;
}

export function TableCaption({ className, ...rest }: HTMLAttributes<HTMLTableCaptionElement>) {
  return <caption className={cn('py-3 text-sm text-fg-muted', className)} {...rest} />;
}
