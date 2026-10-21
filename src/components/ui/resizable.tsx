'use client';

import { useEffect, useId, useRef, type KeyboardEvent, type PointerEvent as ReactPointerEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/lib/hooks/use-controllable-state';

export interface ResizableProps {
  /** Exactly two panes. The first one is the variable-width pane. */
  children: [ReactNode, ReactNode];
  /** `horizontal` splits left/right; `vertical` splits top/bottom. */
  orientation?: 'horizontal' | 'vertical';
  /** First pane size as a percentage (0–100). */
  defaultSize?: number;
  size?: number;
  onSizeChange?: (size: number) => void;
  min?: number;
  max?: number;
  /** Keyboard step as percentage points. */
  step?: number;
  label?: string;
  className?: string;
}

/**
 * Resizable — a two-pane split with a draggable, keyboard-operable divider.
 *
 * The one deliberate exception to the "no inline styles" rule in this library:
 * the layout is driven by a single `--split` custom property written to the
 * container (`element.style.setProperty`). Resizing is inherently continuous,
 * Tailwind cannot express a live percentage, and everything else in the
 * component stays static — the utility classes read the variable, so theming
 * and overrides behave normally. Prism (theme output) is the other exception.
 */
export function Resizable({
  children,
  orientation = 'horizontal',
  defaultSize = 50,
  size,
  onSizeChange,
  min = 15,
  max = 85,
  step = 2,
  label = 'Resize panes',
  className,
}: ResizableProps) {
  const [current, setCurrent] = useControllableState<number>({
    value: size,
    defaultValue: defaultSize,
    onChange: onSizeChange,
  });
  const containerRef = useRef<HTMLDivElement>(null);
  const separatorId = useId();
  const horizontal = orientation === 'horizontal';

  useEffect(() => {
    const element = containerRef.current;
    if (element) element.style.setProperty('--split', `${Math.min(max, Math.max(min, current))}%`);
  }, [current, min, max]);

  function clamp(value: number) {
    return Math.min(max, Math.max(min, value));
  }

  function resizeFromPointer(event: ReactPointerEvent<HTMLDivElement>) {
    const bounds = containerRef.current?.getBoundingClientRect();
    if (!bounds) return;
    const ratio = horizontal
      ? ((event.clientX - bounds.left) / bounds.width) * 100
      : ((event.clientY - bounds.top) / bounds.height) * 100;
    setCurrent(Math.round(clamp(ratio)));
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    event.currentTarget.setPointerCapture(event.pointerId);
    resizeFromPointer(event);
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.buttons === 1) resizeFromPointer(event);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const delta = horizontal
      ? { left: -step, right: step, up: 0, down: 0 }
      : { left: 0, right: 0, up: -step, down: step };
    const keyDelta = delta[event.key.toLowerCase() as keyof typeof delta] ?? 0;
    if (keyDelta) {
      event.preventDefault();
      setCurrent(clamp(current + keyDelta));
    } else if (event.key === 'Home') {
      event.preventDefault();
      setCurrent(min);
    } else if (event.key === 'End') {
      event.preventDefault();
      setCurrent(max);
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setCurrent(50);
    }
  }

  return (
    <div
      ref={containerRef}
      data-orientation={orientation}
      className={cn(
        'min-h-0 min-w-0',
        horizontal
          ? 'grid grid-cols-[minmax(0,var(--split,50%))_8px_minmax(0,1fr)]'
          : 'grid grid-rows-[minmax(0,var(--split,50%))_8px_minmax(0,1fr)]',
        className,
      )}
    >
      <div className={cn('min-w-0 min-h-0 overflow-hidden', horizontal ? '' : 'min-w-0')}>{children[0]}</div>

      <div
        id={separatorId}
        role="separator"
        aria-orientation={horizontal ? 'vertical' : 'horizontal'}
        aria-label={label}
        aria-valuenow={Math.round(current)}
        aria-valuemin={min}
        aria-valuemax={max}
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onKeyDown={onKeyDown}
        onDoubleClick={() => setCurrent(defaultSize)}
        className={cn(
          'group relative touch-none rounded-xs bg-border transition-colors hover:bg-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
          horizontal
            ? 'mx-0.5 my-1 cursor-col-resize flex items-center justify-center'
            : 'my-0.5 mx-1 cursor-row-resize flex items-center justify-center',
        )}
      >
        <span
          aria-hidden="true"
          className={cn(
            'rounded-full bg-fg-subtle opacity-0 transition-opacity group-hover:opacity-60 group-focus-visible:opacity-60',
            horizontal ? 'h-6 w-1' : 'h-1 w-6',
          )}
        />
      </div>

      <div className="min-w-0 min-h-0 overflow-hidden">{children[1]}</div>
    </div>
  );
}
