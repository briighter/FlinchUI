import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { LockIcon } from '@/components/ui/icons';

export interface BrowserFrameProps extends HTMLAttributes<HTMLDivElement> {
  /** Fake address shown in the chrome. */
  url?: string;
  children: ReactNode;
}

/** BrowserFrame — a neutral desktop window used to present full-width apps. */
export function BrowserFrame({ url, children, className, ...rest }: BrowserFrameProps) {
  return (
    <div
      className={cn(
        'flex min-h-0 flex-col overflow-hidden rounded-xl border border-border bg-surface shadow-lg',
        className,
      )}
      {...rest}
    >
      <div className="flex h-9 shrink-0 items-center gap-3 border-b border-border bg-surface-sunken px-3">
        <span aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
          <span className="size-2.5 rounded-full bg-border-strong" />
        </span>
        {url ? (
          <span className="mx-auto flex h-6 max-w-[60%] items-center gap-1.5 truncate rounded-md bg-surface px-2.5 text-[11px] text-fg-subtle">
            <LockIcon className="size-3 shrink-0" />
            <span className="truncate">{url}</span>
          </span>
        ) : null}
        <span aria-hidden="true" className="w-10 shrink-0" />
      </div>
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}

export interface PhoneFrameProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
  /** Darken the bezel differently in dark mode. */
  statusBar?: ReactNode;
}

/** PhoneFrame — a 390×844 handset bezel with a notch and a status bar slot. */
export function PhoneFrame({ children, statusBar, className, ...rest }: PhoneFrameProps) {
  return (
    <div
      className={cn(
        'relative flex flex-col overflow-hidden rounded-[2.5rem] border-[10px] border-neutral-900 bg-bg shadow-2xl dark:border-neutral-800 dark:ring-1 dark:ring-border',
        className,
      )}
      {...rest}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-2 z-30 h-6 w-28 -translate-x-1/2 rounded-full bg-neutral-900 dark:bg-neutral-800"
      />
      {statusBar ? (
        <div className="flex h-11 shrink-0 items-end justify-between px-6 pb-1 text-[11px] font-semibold text-fg">
          {statusBar}
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col">{children}</div>
    </div>
  );
}
