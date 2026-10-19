import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';

export interface BoxProps extends HTMLAttributes<HTMLElement> {
  /** Render as a different element (`section`, `article`, `li`, ...). */
  as?: ElementType;
  /** Merge props/classes into the single child element instead of rendering a wrapper. */
  asChild?: boolean;
}

/**
 * Box — the polymorphic atom every other layout component builds on.
 * Forwards every native prop and merges `className` last.
 */
export function Box({ as: Component = 'div', asChild = false, className, ...rest }: BoxProps) {
  const Comp = (asChild ? Slot : Component) as ElementType;
  return <Comp className={cn('box-border', className)} {...rest} />;
}
