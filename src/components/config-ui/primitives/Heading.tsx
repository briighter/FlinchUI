/**
 * Heading — Typography element.
 *
 * Delivered as a client chunk through the ConfigRenderer registry. Fully
 * memoized; the rendered tag and its type scale are static token maps keyed
 * by the schema's semantic `level`, so style changes are string swaps.
 */

'use client';

import { memo } from 'react';
import type { ActionHandler, HeadingLevel, HeadingNode } from '../../../types/configUI';

const TAG_BY_LEVEL: Record<HeadingLevel, 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

const LEVEL_CLASSES: Record<HeadingLevel, string> = {
  1: 'text-4xl font-extrabold tracking-tight',
  2: 'text-3xl font-bold tracking-tight',
  3: 'text-2xl font-bold',
  4: 'text-xl font-semibold',
  5: 'text-lg font-semibold',
  6: 'text-base font-semibold',
};

const ALIGN_CLASSES = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
} as const;

const BASE_CLASSES = 'box-border text-slate-900 dark:text-slate-50';

export interface HeadingProps extends Omit<HeadingNode, 'type'> {
  /** Present for registry uniformity; typography nodes never emit actions. */
  onAction?: ActionHandler;
}

function Heading({
  level = 2,
  text,
  align,
  truncate = false,
  className,
  testId,
  ariaLabel,
  id,
}: HeadingProps) {
  const Tag = TAG_BY_LEVEL[level];

  const computedClassName = [
    BASE_CLASSES,
    LEVEL_CLASSES[level],
    align ? ALIGN_CLASSES[align] : '',
    truncate ? 'truncate' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Tag
      data-node-id={id}
      data-testid={testId}
      aria-label={ariaLabel}
      className={computedClassName}
    >
      {text}
    </Tag>
  );
}

export default memo(Heading);
