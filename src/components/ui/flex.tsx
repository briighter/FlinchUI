import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';
import { ALIGN, DIRECTION, GAP, JUSTIFY, WRAP } from '@/lib/tokens';
import type { AlignToken, DirectionToken, GapToken, JustifyToken, WrapToken } from '@/lib/tokens';

export interface FlexProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  asChild?: boolean;
  direction?: DirectionToken;
  align?: AlignToken;
  justify?: JustifyToken;
  gap?: GapToken;
  wrap?: WrapToken;
  inline?: boolean;
}

/** Flex — low-level flexbox container. */
export function Flex({
  as: Component = 'div',
  asChild = false,
  direction = 'row',
  align,
  justify,
  gap,
  wrap,
  inline = false,
  className,
  ...rest
}: FlexProps) {
  const Comp = (asChild ? Slot : Component) as ElementType;

  return (
    <Comp
      className={cn(
        inline ? 'inline-flex' : 'flex',
        'min-w-0',
        DIRECTION[direction],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        gap && GAP[gap],
        wrap && WRAP[wrap],
        className,
      )}
      {...rest}
    />
  );
}
