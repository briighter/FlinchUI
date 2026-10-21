import type { ReactNode } from 'react';

/**
 * Prose primitives for guide pages.
 *
 * These live outside `guides.tsx` so the Markdown mirror can recognise them by
 * component identity and emit real headings, lists, and paragraphs instead of
 * scraping rendered HTML.
 */

export function Lead({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-lg leading-8 text-fg-muted">{children}</p>;
}

export function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-24 text-2xl font-bold tracking-tight text-fg">
      {children}
    </h2>
  );
}

export function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className="mt-8 scroll-mt-24 text-lg font-semibold text-fg">
      {children}
    </h3>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-sm leading-7 text-fg-muted">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-fg-muted marker:text-fg-subtle">
      {children}
    </ul>
  );
}

/** Section wrapper with a consistent vertical rhythm. */
export function Doc({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl">{children}</div>;
}
