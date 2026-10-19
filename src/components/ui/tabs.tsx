'use client';

import {
  createContext,
  useContext,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/lib/hooks/use-controllable-state';

interface TabsContextValue {
  value: string;
  setValue: (value: string) => void;
  baseId: string;
  variant: TabsVariant;
}

const TabsContext = createContext<TabsContextValue | null>(null);

function useTabs(component: string): TabsContextValue {
  const context = useContext(TabsContext);
  if (!context) throw new Error(`<${component}> must be used within <Tabs>`);
  return context;
}

export type TabsVariant = 'line' | 'pills' | 'enclosed';

export interface TabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  variant?: TabsVariant;
  children: ReactNode;
}

/** Tabs — accessible, controlled-or-uncontrolled tab set. */
export function Tabs({
  value,
  defaultValue = '',
  onValueChange,
  variant = 'line',
  className,
  children,
  ...rest
}: TabsProps) {
  const [current, setCurrent] = useControllableState<string>({
    value,
    defaultValue,
    onChange: onValueChange,
  });
  const baseId = useId();

  return (
    <TabsContext.Provider value={{ value: current, setValue: setCurrent, baseId, variant }}>
      <div className={cn('flex flex-col gap-4', className)} {...rest}>
        {children}
      </div>
    </TabsContext.Provider>
  );
}

const LIST_VARIANT: Record<TabsVariant, string> = {
  line: 'gap-1 border-b border-border',
  pills: 'gap-1 rounded-lg bg-surface-sunken p-1',
  enclosed: 'gap-0',
};

export interface TabsListProps extends HTMLAttributes<HTMLDivElement> {}

export function TabsList({ className, children, ...rest }: TabsListProps) {
  const { variant } = useTabs('TabsList');
  const ref = useRef<HTMLDivElement>(null);

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const keys = ['ArrowLeft', 'ArrowRight', 'Home', 'End'];
    if (!keys.includes(event.key)) return;
    const tabs = Array.from(ref.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not([disabled])') ?? []);
    if (tabs.length === 0) return;
    const index = tabs.indexOf(document.activeElement as HTMLButtonElement);
    let next = index;
    if (event.key === 'ArrowLeft') next = index <= 0 ? tabs.length - 1 : index - 1;
    if (event.key === 'ArrowRight') next = index >= tabs.length - 1 ? 0 : index + 1;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = tabs.length - 1;
    event.preventDefault();
    tabs[next]?.focus();
    tabs[next]?.click();
  }

  return (
    <div
      ref={ref}
      role="tablist"
      onKeyDown={onKeyDown}
      className={cn('flex items-center overflow-x-auto', LIST_VARIANT[variant], className)}
      {...rest}
    >
      {children}
    </div>
  );
}

export interface TabsTriggerProps extends HTMLAttributes<HTMLButtonElement> {
  value: string;
  disabled?: boolean;
}

const TRIGGER_VARIANT: Record<TabsVariant, { base: string; active: string; idle: string }> = {
  line: {
    base: '-mb-px border-b-2 border-transparent px-3 py-2',
    active: 'border-brand-600 text-fg',
    idle: 'text-fg-muted hover:border-border-strong hover:text-fg',
  },
  pills: {
    base: 'rounded-md px-3 py-1.5',
    active: 'bg-surface text-fg shadow-xs',
    idle: 'text-fg-muted hover:text-fg',
  },
  enclosed: {
    base: 'border border-border px-4 py-2 first:rounded-l-md last:rounded-r-md [&:not(:first-child)]:-ml-px',
    active: 'z-10 bg-surface font-semibold text-fg',
    idle: 'bg-surface-sunken text-fg-muted hover:text-fg',
  },
};

export function TabsTrigger({ value, disabled, className, children, ...rest }: TabsTriggerProps) {
  const { value: current, setValue, baseId, variant } = useTabs('TabsTrigger');
  const selected = current === value;
  const styles = TRIGGER_VARIANT[variant];

  return (
    <button
      type="button"
      role="tab"
      id={`${baseId}-tab-${value}`}
      aria-selected={selected}
      aria-controls={`${baseId}-panel-${value}`}
      tabIndex={selected ? 0 : -1}
      disabled={disabled}
      onClick={() => setValue(value)}
      className={cn(
        'inline-flex shrink-0 items-center gap-2 text-sm font-medium whitespace-nowrap transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
        'disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4',
        styles.base,
        selected ? styles.active : styles.idle,
        className,
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export interface TabsContentProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
}

export function TabsContent({ value, className, children, ...rest }: TabsContentProps) {
  const { value: current, baseId } = useTabs('TabsContent');
  if (current !== value) return null;

  return (
    <div
      role="tabpanel"
      id={`${baseId}-panel-${value}`}
      aria-labelledby={`${baseId}-tab-${value}`}
      tabIndex={0}
      className={cn('focus-visible:outline-none', className)}
      {...rest}
    >
      {children}
    </div>
  );
}
