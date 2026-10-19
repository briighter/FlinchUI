import type { ElementType, CSSProperties, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';

export interface AspectRatioProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  asChild?: boolean;
  /** Width / height ratio, e.g. `16 / 9`. Defaults to `1`. */
  ratio?: number;
}

/** AspectRatio — reserves space at a fixed aspect ratio using `aspect-ratio`. */
export function AspectRatio({
  as: Component = 'div',
  asChild = false,
  ratio = 1,
  className,
  style,
  ...rest
}: AspectRatioProps) {
  const Comp = (asChild ? Slot : Component) as ElementType;
  const css: CSSProperties = { aspectRatio: String(ratio), ...style };

  return <Comp className={cn('overflow-hidden', className)} style={css} {...rest} />;
}
