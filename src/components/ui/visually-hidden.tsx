import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';

export interface VisuallyHiddenProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  asChild?: boolean;
  /** Reveal the content when it receives keyboard focus (skip-link pattern). */
  focusable?: boolean;
}

/** VisuallyHidden — content available to assistive tech but not visually rendered. */
export function VisuallyHidden({
  as: Component = 'span',
  asChild = false,
  focusable = false,
  className,
  ...rest
}: VisuallyHiddenProps) {
  const Comp = (asChild ? Slot : Component) as ElementType;

  return (
    <Comp
      className={cn(
        'absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0 [clip:rect(0,0,0,0)]',
        focusable &&
          'focus:static focus:h-auto focus:w-auto focus:overflow-visible focus:[clip:auto] focus:rounded-md focus:bg-surface focus:px-3 focus:py-2',
        className,
      )}
      {...rest}
    />
  );
}
