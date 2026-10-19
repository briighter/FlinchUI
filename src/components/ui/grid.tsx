import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';
import { ALIGN, GAP, GRID_COLS } from '@/lib/tokens';
import type { AlignToken, GapToken, GridColsToken } from '@/lib/tokens';

export interface GridProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  asChild?: boolean;
  /** Number of columns at the `sm` breakpoint. */
  columns?: GridColsToken;
  /** Number of columns at the `md` breakpoint and up. */
  mdColumns?: GridColsToken;
  /** Number of columns at the `lg` breakpoint and up. */
  lgColumns?: GridColsToken;
  gap?: GapToken;
  align?: AlignToken;
  dense?: boolean;
}

const MD_COLS = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
  5: 'md:grid-cols-5',
  6: 'md:grid-cols-6',
  7: 'md:grid-cols-7',
  8: 'md:grid-cols-8',
  9: 'md:grid-cols-9',
  10: 'md:grid-cols-10',
  11: 'md:grid-cols-11',
  12: 'md:grid-cols-12',
} as const;

const LG_COLS = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
  7: 'lg:grid-cols-7',
  8: 'lg:grid-cols-8',
  9: 'lg:grid-cols-9',
  10: 'lg:grid-cols-10',
  11: 'lg:grid-cols-11',
  12: 'lg:grid-cols-12',
} as const;

/** Grid — CSS grid container with responsive column presets. */
export function Grid({
  as: Component = 'div',
  asChild = false,
  columns = 1,
  mdColumns,
  lgColumns,
  gap = 'md',
  align,
  dense = false,
  className,
  ...rest
}: GridProps) {
  const Comp = (asChild ? Slot : Component) as ElementType;

  return (
    <Comp
      className={cn(
        'grid min-w-0',
        GRID_COLS[columns],
        mdColumns && MD_COLS[mdColumns],
        lgColumns && LG_COLS[lgColumns],
        GAP[gap],
        align && ALIGN[align],
        dense && 'grid-flow-dense',
        className,
      )}
      {...rest}
    />
  );
}

export interface SimpleGridProps extends Omit<GridProps, 'columns' | 'mdColumns' | 'lgColumns'> {
  /** Minimum column width before wrapping; pairs with `auto-fit`. */
  minChildWidth?: string;
}

/**
 * SimpleGrid — responsive auto-fit grid. `minChildWidth` is passed through as an
 * inline CSS variable, keeping the class list static.
 */
export function SimpleGrid({
  as: Component = 'div',
  asChild = false,
  minChildWidth = '16rem',
  gap = 'md',
  className,
  style,
  ...rest
}: SimpleGridProps) {
  const Comp = (asChild ? Slot : Component) as ElementType;

  return (
    <Comp
      className={cn('grid min-w-0', GAP[gap], className)}
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(min(${minChildWidth}, 100%), 1fr))`,
        ...style,
      }}
      {...rest}
    />
  );
}
