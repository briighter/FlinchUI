import { Children, Fragment, type ElementType, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';
import { ALIGN, DIRECTION, GAP, JUSTIFY, WRAP } from '@/lib/tokens';
import type { AlignToken, DirectionToken, GapToken, JustifyToken, WrapToken } from '@/lib/tokens';

export interface StackProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  asChild?: boolean;
  direction?: DirectionToken;
  gap?: GapToken;
  align?: AlignToken;
  justify?: JustifyToken;
  wrap?: WrapToken;
  /** Render a separator between children (a string, element, or `"1px"`). */
  divider?: ReactNode;
}

/** Stack — one-dimensional flow layout with gap, alignment, and optional dividers. */
export function Stack({
  as: Component = 'div',
  asChild = false,
  direction = 'column',
  gap = 'md',
  align,
  justify,
  wrap,
  divider,
  className,
  children,
  ...rest
}: StackProps) {
  const Comp = (asChild ? Slot : Component) as ElementType;
  const items = Children.toArray(children);

  const rendered = divider
    ? items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 ? (
            <span
              aria-hidden="true"
              className={cn(
                'shrink-0 bg-border',
                direction === 'row' ? 'h-full w-px self-stretch' : 'h-px w-full',
              )}
            >
              {divider}
            </span>
          ) : null}
          {child}
        </Fragment>
      ))
    : children;

  return (
    <Comp
      className={cn(
        'flex min-w-0',
        DIRECTION[direction],
        GAP[gap],
        align && ALIGN[align],
        justify && JUSTIFY[justify],
        wrap && WRAP[wrap],
        className,
      )}
      {...rest}
    >
      {rendered}
    </Comp>
  );
}

export type HStackProps = Omit<StackProps, 'direction'>;
export function HStack({ gap = 'sm', align = 'center', ...rest }: HStackProps) {
  return <Stack direction="row" gap={gap} align={align} {...rest} />;
}

export type VStackProps = Omit<StackProps, 'direction'>;
export function VStack({ gap = 'sm', ...rest }: VStackProps) {
  return <Stack direction="column" gap={gap} {...rest} />;
}
