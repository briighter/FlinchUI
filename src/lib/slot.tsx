/**
 * `Slot` — the `asChild` escape hatch.
 *
 * `<Button asChild><a href="/x">Go</a></Button>` renders the anchor element with
 * the button's props and classes merged in, so the library never needs to know
 * about your router's `Link` component.
 *
 * Works in both React Server Components and client components.
 */

import { Children, Fragment, cloneElement, isValidElement } from 'react';
import type { CSSProperties, HTMLAttributes, ReactElement, ReactNode, Ref } from 'react';
import { cn } from './cn';

export interface SlotProps extends HTMLAttributes<HTMLElement> {
  children?: ReactNode;
}

type SlotChildProps = {
  className?: string;
  style?: CSSProperties;
  ref?: Ref<HTMLElement>;
} & Record<string, unknown>;

export function Slot({ children, className, style, ...slotProps }: SlotProps): ReactElement | null {
  const child = Children.only(children);

  if (!isValidElement(child)) {
    return null;
  }

  if (child.type === Fragment) {
    throw new Error(
      'Slot (asChild) received a Fragment. Pass a single DOM element instead, for example <a> or <Link>.',
    );
  }

  const childProps = child.props as SlotChildProps;

  return cloneElement(child as ReactElement<SlotChildProps>, {
    ...slotProps,
    ...childProps,
    className: cn(className, childProps.className),
    style: { ...style, ...childProps.style },
    // Preserve the child's own ref when both are present.
    ref: childProps.ref,
  });
}

/**
 * Merges a list of refs into a single callback ref.
 * Handy when a component both holds an internal ref and forwards one.
 */
export function composeRefs<T>(...refs: Array<Ref<T> | undefined>): (node: T | null) => void {
  return (node) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === 'function') {
        ref(node);
      } else {
        (ref as { current: T | null }).current = node;
      }
    }
  };
}
