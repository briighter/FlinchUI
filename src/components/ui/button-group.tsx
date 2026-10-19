import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface ButtonGroupProps extends HTMLAttributes<HTMLDivElement> {
  orientation?: 'horizontal' | 'vertical';
  /** Join borders so the group reads as a single control. */
  attached?: boolean;
}

/** ButtonGroup — lays out related buttons and visually attaches their borders. */
export function ButtonGroup({
  orientation = 'horizontal',
  attached = true,
  className,
  ...rest
}: ButtonGroupProps) {
  return (
    <div
      role="group"
      className={cn(
        'inline-flex',
        orientation === 'vertical' ? 'flex-col' : 'flex-row',
        attached &&
          (orientation === 'vertical'
            ? '[&>*:not(:first-child)]:-mt-px [&>*:not(:first-child)]:rounded-t-none [&>*:not(:last-child)]:rounded-b-none'
            : '[&>*:not(:first-child)]:-ml-px [&>*:not(:first-child)]:rounded-l-none [&>*:not(:last-child)]:rounded-r-none'),
        className,
      )}
      {...rest}
    />
  );
}
