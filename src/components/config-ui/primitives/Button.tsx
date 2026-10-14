/**
 * Button — Transactional action primitive.
 *
 * Delivered as a client chunk through the ConfigRenderer registry. Fully
 * memoized with an action-scoped click handler. The button never executes
 * business logic: it declares an `actionId` in the schema and pipelines a
 * serializable `ActionEvent` into the host-supplied `onAction` bus.
 *
 * The element is always `type="button"` unless the host overrides it via the
 * action pipeline, so embedding buttons inside forms can never trigger an
 * accidental submit.
 */

'use client';

import { memo, useCallback } from 'react';
import type { MouseEvent, ReactNode } from 'react';
import type { ActionHandler, ButtonNode } from '../../../types/configUI';

const BASE_CLASSES =
  'box-border inline-flex select-none items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed disabled:opacity-60 dark:focus-visible:ring-slate-300';

const VARIANT_CLASSES = {
  primary:
    'bg-slate-900 text-white hover:bg-slate-700 dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-300',
  secondary:
    'bg-slate-200 text-slate-900 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600',
  outline:
    'border border-slate-300 bg-transparent text-slate-700 hover:bg-slate-50 dark:border-slate-600 dark:text-slate-200 dark:hover:bg-slate-800',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800',
  danger: 'bg-red-600 text-white hover:bg-red-700 dark:bg-red-500 dark:hover:bg-red-600',
} as const;

const SIZE_CLASSES = {
  sm: 'gap-1.5 px-3 py-1.5 text-sm',
  md: 'gap-2 px-4 py-2 text-base',
  lg: 'gap-2 px-5 py-3 text-lg',
} as const;

export interface ButtonProps extends Omit<ButtonNode, 'type'> {
  children?: ReactNode;
  /** Centralized action pipeline — the only path to host business logic. */
  onAction?: ActionHandler;
}

function Button({
  id,
  actionId,
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  fullWidth = false,
  payload,
  className,
  testId,
  ariaLabel,
  children,
  onAction,
}: ButtonProps) {
  const handleClick = useCallback(
    (event: MouseEvent<HTMLButtonElement>) => {
      if (disabled) {
        event.preventDefault();
        return;
      }
      onAction?.({
        actionId,
        nodeId: id,
        event: 'click',
        payload,
        timestamp: Date.now(),
      });
    },
    [actionId, id, disabled, onAction, payload],
  );

  const computedClassName = [
    BASE_CLASSES,
    VARIANT_CLASSES[variant],
    SIZE_CLASSES[size],
    fullWidth ? 'w-full' : '',
    className ?? '',
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type="button"
      data-node-id={id}
      data-action-id={actionId}
      data-testid={testId}
      aria-label={ariaLabel ?? label}
      disabled={disabled}
      className={computedClassName}
      onClick={handleClick}
    >
      {children ?? label}
    </button>
  );
}

export default memo(Button);
