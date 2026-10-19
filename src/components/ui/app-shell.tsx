import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface AppShellProps extends HTMLAttributes<HTMLDivElement> {
  /** Fixed sidebar (left). */
  sidebar?: ReactNode;
  /** Fixed header across the top. */
  header?: ReactNode;
  /** Optional right rail (TOC). */
  aside?: ReactNode;
  children: ReactNode;
  /** Constrain the main column (app-style) or let it flow (docs-style). */
  contained?: boolean;
}

/**
 * AppShell — the page skeleton for dashboard- and docs-style layouts:
 * header on top, optional left sidebar and right rail, scrollable main region.
 */
export function AppShell({
  sidebar,
  header,
  aside,
  contained = false,
  className,
  children,
  ...rest
}: AppShellProps) {
  return (
    <div className={cn('flex min-h-dvh flex-col bg-bg', className)} {...rest}>
      {header}

      <div className="mx-auto flex w-full max-w-screen-2xl flex-1 items-start gap-8 px-4 sm:px-6 lg:px-8">
        {sidebar ? (
          <aside className="sticky top-14 hidden w-60 shrink-0 self-start py-8 lg:block">{sidebar}</aside>
        ) : null}

        <main
          id="main"
          tabIndex={-1}
          className={cn('min-w-0 flex-1 py-8 focus-visible:outline-none', contained && 'mx-auto max-w-3xl')}
        >
          {children}
        </main>

        {aside ? (
          <aside className="sticky top-14 hidden w-56 shrink-0 self-start py-8 xl:block">{aside}</aside>
        ) : null}
      </div>
    </div>
  );
}
