'use client';

import {
  createContext,
  useContext,
  useId,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/lib/hooks/use-controllable-state';

interface CollapsibleContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  contentId: string;
}

const CollapsibleContext = createContext<CollapsibleContextValue | null>(null);

function useCollapsible(component: string): CollapsibleContextValue {
  const context = useContext(CollapsibleContext);
  if (!context) throw new Error(`<${component}> must be used within <Collapsible>`);
  return context;
}

export interface CollapsibleProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  children: ReactNode;
}

/** Collapsible — a single show/hide region with a trigger and an animated panel. */
export function Collapsible({
  open,
  defaultOpen = false,
  onOpenChange,
  className,
  children,
  ...rest
}: CollapsibleProps) {
  const [current, setCurrent] = useControllableState<boolean>({
    value: open,
    defaultValue: defaultOpen,
    onChange: onOpenChange,
  });
  const contentId = useId();

  return (
    <CollapsibleContext.Provider value={{ open: current, setOpen: setCurrent, contentId }}>
      <div className={className} {...rest}>
        {children}
      </div>
    </CollapsibleContext.Provider>
  );
}

export interface CollapsibleTriggerProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function CollapsibleTrigger({ className, children, ...rest }: CollapsibleTriggerProps) {
  const { open, setOpen, contentId } = useCollapsible('CollapsibleTrigger');

  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={contentId}
      onClick={() => setOpen(!open)}
      className={cn(
        'inline-flex items-center gap-2 text-sm font-medium text-fg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface CollapsibleContentProps extends HTMLAttributes<HTMLDivElement> {}

export function CollapsibleContent({ className, children, ...rest }: CollapsibleContentProps) {
  const { open, contentId } = useCollapsible('CollapsibleContent');

  return (
    <div
      id={contentId}
      hidden={!open}
      className={cn('grid transition-all', open && 'animate-slide-up', className)}
      {...rest}
    >
      <div className="min-h-0">{children}</div>
    </div>
  );
}
