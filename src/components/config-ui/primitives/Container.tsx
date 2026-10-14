/**
 * Container — Structural flex/grid block layout primitive.
 *
 * Delivered as a client chunk through the ConfigRenderer registry. Fully
 * memoized; layout is expressed exclusively through deterministic atomic
 * utility tokens resolved from a static, build-time class map (Tailwind v4
 * scans these literals, so only referenced classes are emitted).
 */

'use client';

import { memo } from 'react';
import type { ReactNode } from 'react';
import type { ActionHandler, ContainerNode } from '../../../types/configUI';

const DISPLAY_CLASSES = {
  flex: 'flex',
  grid: 'grid',
  block: 'block',
} as const;

const DIRECTION_CLASSES = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
} as const;

const WRAP_CLASSES = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
} as const;

const GAP_CLASSES = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-10',
} as const;

const ALIGN_CLASSES = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  stretch: 'items-stretch',
} as const;

const JUSTIFY_CLASSES = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

/** Explicit literal map — guarantees Tailwind's scanner emits every column count. */
const GRID_COLUMNS_CLASSES = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
} as const;

const BASE_CLASSES = 'box-border';

export interface ContainerProps extends Omit<ContainerNode, 'type' | 'children'> {
  children?: ReactNode;
  /** Present for registry uniformity; structural nodes never emit actions. */
  onAction?: ActionHandler;
}

function Container({
  display = 'flex',
  direction,
  wrap,
  gap,
  align,
  justify,
  columns,
  className,
  testId,
  ariaLabel,
  id,
  children,
}: ContainerProps) {
  const usesFlowLayout = display === 'flex' || display === 'grid';

  const computedClassName = [
    BASE_CLASSES,
    DISPLAY_CLASSES[display],
    usesFlowLayout ? 'min-w-0' : '',
    direction ? DIRECTION_CLASSES[direction] : '',
    wrap ? WRAP_CLASSES[wrap] : '',
    gap ? GAP_CLASSES[gap] : '',
    align ? ALIGN_CLASSES[align] : '',
    justify ? JUSTIFY_CLASSES[justify] : '',
    display === 'grid' && columns ? GRID_COLUMNS_CLASSES[columns] : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      data-node-id={id}
      data-testid={testId}
      aria-label={ariaLabel}
      className={computedClassName}
    >
      {children}
    </div>
  );
}

export default memo(Container);
