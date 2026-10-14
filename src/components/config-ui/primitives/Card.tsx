/**
 * Card — Presentational surface block element.
 *
 * Delivered as a client chunk through the ConfigRenderer registry. Fully
 * memoized; surface styling is a static token lookup — no runtime style
 * computation, no dynamic stylesheet injection.
 */

'use client';

import { memo } from 'react';
import type { ReactNode } from 'react';
import type { ActionHandler, CardNode } from '../../../types/configUI';

const VARIANT_CLASSES = {
  elevated: 'bg-white shadow-lg dark:bg-slate-900',
  outlined: 'border border-slate-300 bg-white dark:border-slate-700 dark:bg-slate-900',
  filled: 'bg-slate-100 dark:bg-slate-800',
  ghost: 'bg-transparent',
} as const;

const PADDING_CLASSES = {
  none: 'p-0',
  xs: 'p-1.5',
  sm: 'p-3',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-10',
} as const;

const RADIUS_CLASSES = {
  none: 'rounded-none',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  full: 'rounded-full',
} as const;

const BASE_CLASSES = 'box-border overflow-hidden';

export interface CardProps extends Omit<CardNode, 'type' | 'children'> {
  children?: ReactNode;
  /** Present for registry uniformity; presentational nodes never emit actions. */
  onAction?: ActionHandler;
}

function Card({
  variant = 'elevated',
  padding = 'md',
  radius = 'lg',
  className,
  testId,
  ariaLabel,
  id,
  children,
}: CardProps) {
  const computedClassName = [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    PADDING_CLASSES[padding],
    RADIUS_CLASSES[radius],
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <section
      data-node-id={id}
      data-testid={testId}
      aria-label={ariaLabel}
      className={computedClassName}
    >
      {children}
    </section>
  );
}

export default memo(Card);
