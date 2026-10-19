'use client';

import {
  autoUpdate,
  flip,
  FloatingFocusManager,
  FloatingList,
  FloatingPortal,
  offset,
  shift,
  useClick,
  useDismiss,
  useFloating,
  useInteractions,
  useListItem,
  useListNavigation,
  useRole,
  useTypeahead,
} from '@floating-ui/react';
import type { FloatingContext, Placement } from '@floating-ui/react';
import {
  cloneElement,
  createContext,
  isValidElement,
  useContext,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { composeRefs } from '@/lib/slot';

interface DropdownMenuContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  setReference: (node: Element | null) => void;
  setFloating: (node: HTMLElement | null) => void;
  floatingStyles: CSSProperties;
  context: FloatingContext;
  activeIndex: number | null;
  elementsRef: React.MutableRefObject<Array<HTMLElement | null>>;
  labelsRef: React.MutableRefObject<Array<string | null>>;
  getReferenceProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  getFloatingProps: (props?: Record<string, unknown>) => Record<string, unknown>;
  getItemProps: (props?: Record<string, unknown>) => Record<string, unknown>;
}

const DropdownMenuContext = createContext<DropdownMenuContextValue | null>(null);

function useDropdownMenu(component: string): DropdownMenuContextValue {
  const context = useContext(DropdownMenuContext);
  if (!context) throw new Error(`<${component}> must be used within <DropdownMenu>`);
  return context;
}

export interface DropdownMenuProps {
  children: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  placement?: Placement;
}

/** DropdownMenu — a keyboard-navigable menu with typeahead and roving focus. */
export function DropdownMenu({ children, open: controlledOpen, onOpenChange, placement = 'bottom-start' }: DropdownMenuProps) {
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const open = isControlled ? controlledOpen : uncontrolledOpen;

  const setOpen = (next: boolean) => {
    if (!isControlled) setUncontrolledOpen(next);
    onOpenChange?.(next);
  };

  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const elementsRef = useRef<Array<HTMLElement | null>>([]);
  const labelsRef = useRef<Array<string | null>>([]);

  const { refs, floatingStyles, context } = useFloating({
    open,
    onOpenChange: setOpen,
    placement,
    middleware: [offset(8), flip({ padding: 8 }), shift({ padding: 8 })],
    whileElementsMounted: autoUpdate,
  });

  const click = useClick(context);
  const dismiss = useDismiss(context);
  const role = useRole(context, { role: 'menu' });
  const listNavigation = useListNavigation(context, {
    listRef: elementsRef,
    activeIndex,
    onNavigate: setActiveIndex,
    loop: true,
  });
  const typeahead = useTypeahead(context, {
    listRef: labelsRef,
    activeIndex,
    onMatch: open ? setActiveIndex : undefined,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions([
    click,
    dismiss,
    role,
    listNavigation,
    typeahead,
  ]);

  return (
    <DropdownMenuContext.Provider
      value={{
        open,
        setOpen,
        setReference: refs.setReference,
        setFloating: refs.setFloating,
        floatingStyles,
        context,
        activeIndex,
        elementsRef,
        labelsRef,
        getReferenceProps: getReferenceProps as DropdownMenuContextValue['getReferenceProps'],
        getFloatingProps: getFloatingProps as DropdownMenuContextValue['getFloatingProps'],
        getItemProps: getItemProps as DropdownMenuContextValue['getItemProps'],
      }}
    >
      {children}
    </DropdownMenuContext.Provider>
  );
}

export interface DropdownMenuTriggerProps {
  children: ReactElement;
  asChild?: boolean;
  className?: string;
}

export function DropdownMenuTrigger({ children, className }: DropdownMenuTriggerProps) {
  const { setReference, getReferenceProps } = useDropdownMenu('DropdownMenuTrigger');

  if (isValidElement(children)) {
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
    <button type="button" ref={setReference as never} className={className} {...getReferenceProps()}>
      {children}
    </button>
  );
}

export interface DropdownMenuContentProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export function DropdownMenuContent({ className, children, ...rest }: DropdownMenuContentProps) {
  const { open, setFloating, floatingStyles, context, getFloatingProps, elementsRef, labelsRef } =
    useDropdownMenu('DropdownMenuContent');

  if (!open) return null;

  return (
    <FloatingPortal>
      <FloatingFocusManager context={context} modal={false}>
        <div
          ref={setFloating}
          style={floatingStyles}
          className={cn(
            'z-50 min-w-52 overflow-hidden rounded-lg border border-border bg-surface-raised p-1 text-sm text-fg shadow-lg outline-none',
            'animate-scale-in',
            className,
          )}
          {...getFloatingProps({ ...rest })}
        >
          <FloatingList elementsRef={elementsRef} labelsRef={labelsRef}>
            {children}
          </FloatingList>
        </div>
      </FloatingFocusManager>
    </FloatingPortal>
  );
}

export interface DropdownMenuItemProps extends HTMLAttributes<HTMLButtonElement> {
  /** Fires after the item is chosen; the menu closes automatically. */
  onSelect?: () => void;
  disabled?: boolean;
  /** Text used for typeahead matching. Defaults to the rendered label. */
  label?: string;
  destructive?: boolean;
}

export function DropdownMenuItem({
  onSelect,
  disabled,
  label,
  destructive,
  className,
  children,
  onClick,
  ...rest
}: DropdownMenuItemProps) {
  const { activeIndex, getItemProps, setOpen } = useDropdownMenu('DropdownMenuItem');
  const { ref, index } = useListItem({ label: label ?? (typeof children === 'string' ? children : undefined) });
  const isActive = activeIndex === index;

  return (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      disabled={disabled}
      tabIndex={isActive ? 0 : -1}
      data-active={isActive || undefined}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2 rounded-md px-2.5 py-1.5 text-left text-sm outline-none select-none',
        'text-fg data-[active]:bg-surface-sunken',
        'disabled:pointer-events-none disabled:opacity-50',
        destructive && 'text-danger-fg',
        '[&_svg]:size-4 [&_svg]:shrink-0',
        className,
      )}
      {...getItemProps({
        onClick: (event: React.MouseEvent<HTMLButtonElement>) => {
          onClick?.(event);
          if (!disabled) {
            onSelect?.();
            setOpen(false);
          }
        },
      })}
      {...rest}
    >
      {children}
    </button>
  );
}

export function DropdownMenuLabel({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('px-2.5 py-1.5 text-xs font-semibold text-fg-subtle', className)} {...rest} />
  );
}

export function DropdownMenuSeparator({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div role="separator" className={cn('my-1 h-px bg-border', className)} {...rest} />;
}

export function DropdownMenuShortcut({ className, ...rest }: HTMLAttributes<HTMLSpanElement>) {
  return <span className={cn('ml-auto text-xs tracking-widest text-fg-subtle', className)} {...rest} />;
}
