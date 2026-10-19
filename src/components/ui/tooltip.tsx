'use client';

import {
  autoUpdate,
  flip,
  FloatingPortal,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import type { Placement } from '@floating-ui/react';
import { cloneElement, isValidElement, useState, type ReactElement, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { composeRefs } from '@/lib/slot';

export interface TooltipProps {
  /** Tooltip body — keep it short and non-interactive. */
  content: ReactNode;
  /** Exactly one focusable child that becomes the trigger. */
  children: ReactElement;
  placement?: Placement;
  /** Delay before opening on hover, in ms. */
  delay?: number;
  className?: string;
  disabled?: boolean;
}

/**
 * Tooltip — a hover/focus hint anchored to its trigger. Uses `aria-describedby`
 * (via the tooltip role) and dismisses on Escape.
 */
export function Tooltip({
  content,
  children,
  placement = 'top',
  delay = 200,
  className,
  disabled = false,
}: TooltipProps) {
  const [open, setOpen] = useState(false);

  const { refs, floatingStyles, context } = useFloating({
    open: open && !disabled,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const hover = useHover(context, { move: false, delay: { open: delay, close: 80 }, enabled: !disabled });
  const focus = useFocus(context, { enabled: !disabled });
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'tooltip' });
  const { getReferenceProps, getFloatingProps } = useInteractions([hover, focus, dismiss, role]);

  const child = children as ReactElement<Record<string, unknown> & { ref?: unknown }>;
  const childProps = child.props;
  const { ref: childRef, ...restChildProps } = childProps;

  return (
    <>
      {isValidElement(children)
        ? cloneElement(child, {
            ...getReferenceProps({
              ...restChildProps,
              className: cn(childProps.className as string | undefined),
            } as React.HTMLProps<Element>),
            ref: composeRefs(refs.setReference, childRef as never),
          } as Record<string, unknown>)
        : children}

      {open && !disabled ? (
        <FloatingPortal>
          <div
            ref={refs.setFloating}
            style={floatingStyles}
            className={cn(
              'z-60 max-w-xs rounded-md bg-fg px-2.5 py-1.5 text-xs font-medium text-bg shadow-md',
              'animate-fade-in',
              className,
            )}
            {...getFloatingProps()}
          >
            {content}
          </div>
        </FloatingPortal>
      ) : null}
    </>
  );
}
