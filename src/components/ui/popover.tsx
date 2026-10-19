'use client';

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useRole,
} from '@floating-ui/react';
import type { FloatingContext, Placement } from '@floating-ui/react';
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useState,
  type CSSProperties,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { composeRefs } from '@/lib/slot';

interface PopoverContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  setReference: (node: Element | null) => void;
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  context: FloatingContext;
  getReferenceProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  getFloatingProps: (props?: Record<string, unknown>) => Record<string, unknown>;
}

const PopoverContext = createContext<PopoverContextValue | null>(null);

function usePopover(component: string): PopoverContextValue {
  const context = useContext(PopoverContext);
  if (!context) throw new Error(`<${component}> must be used within <Popover>`);
  return context;
}

export interface PopoverProps {
  children: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
  /** Gap between trigger and content, in px. */
  offsetPx?: number;
}

/** Popover — anchored, non-modal floating content with flip/shift collision handling. */
export function Popover({
  children,
  open: controlledOpen,
  defaultOpen = false,
  onOpenChange,
  placement = 'bottom-start',
  offsetPx = 8,
}: PopoverProps) {
  const [uncontrolled, setUncontrolled] = useState(defaultOpen);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolled;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolled(next);
    onOpenChange?.(next);
  };

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(offsetPx), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context);
  const { getReferenceProps, getFloatingProps } = useInteractions([click, dismiss, role]);

  return (
    <PopoverContext.Provider
      value={{
        open,
        setOpen,
        setReference: refs.setReference,
        setFloating: refs.setFloating,
        floatingStyles,
        context,
        getReferenceProps: getReferenceProps as PopoverContextValue['getReferenceProps'],
        getFloatingProps: getFloatingProps as PopoverContextValue['getFloatingProps'],
      }}
    >
      {children}
    </PopoverContext.Provider>
  );
}

export interface PopoverTriggerProps {
  children: ReactElement;
  asChild?: boolean;
  className?: string;
}

export function PopoverTrigger({ children, asChild = true, className }: PopoverTriggerProps) {
  const { setReference, getReferenceProps } = usePopover('PopoverTrigger');

  if (asChild && isValidElement(children)) {
    const child = children as ReactElement<Record<string, unknown> & { ref?: unknown }>;
    const childProps = child.props;
    return cloneElement(child, {
      ...getReferenceProps({
        ...childProps,
        className: cn(className, childProps.className as string | undefined),
      }),
      ref: composeRefs(setReference, childProps.ref as never),
    } as Record<string, unknown>);
  }

  return (
    <button type="button" ref={setReference as never} className={cn(className)} {...getReferenceProps()}>
      {children}
    </button>
  );
}

export interface PopoverContentProps {
  children: ReactNode;
  className?: string;
  /** Keep focus inside the popover while it is open. */
  modal?: boolean;
  sideOffset?: number;
}

export function PopoverContent({ children, className, modal = false }: PopoverContentProps) {
  const { open, setFloating, floatingStyles, context, getFloatingProps } = usePopover('PopoverContent');

  if (!open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={modal} initialFocus={modal ? 0 : -1}>
        <div
          ref={setFloating}
          style={floatingStyles}
          className={cn(
            'z-50 min-w-56 rounded-lg border border-border bg-surface-raised p-4 text-sm text-fg shadow-lg outline-none',
            'animate-scale-in',
            className,
          )}
          {...getFloatingProps()}
        >
          {children}
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}
