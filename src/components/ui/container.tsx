import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';
import { MAX_WIDTH } from '@/lib/tokens';
import type { MaxWidthToken } from '@/lib/tokens';

export interface ContainerProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  asChild?: boolean;
  maxWidth?: MaxWidthToken;
  /** Horizontal padding preset. */
  gutter?: boolean;
}

/** Container — centers content at a max width with responsive gutters. */
export function Container({
  as: Component = 'div',
  asChild = false,
  maxWidth = 'xl',
  gutter = true,
  className,
  ...rest
}: ContainerProps) {
  const Comp = (asChild ? Slot : Component) as ElementType;

  return (
    <Comp
      className={cn('mx-auto w-full', MAX_WIDTH[maxWidth], gutter && 'px-4 sm:px-6 lg:px-8', className)}
      {...rest}
    />
  );
}
