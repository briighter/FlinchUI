import type { ReactNode } from 'react';
import { getDocsNav } from '@/lib/nav';
import { searchIndex } from '@/lib/registry';
import { DocsHeader } from '@/components/docs/docs-header';
import { DocsSidebar } from '@/components/docs/docs-sidebar';

export default function DocsLayout({ children }: { children: ReactNode }) {
  const nav = getDocsNav();
  const searchItems = searchIndex();

  return (
    <div className="min-h-dvh bg-bg">
      <DocsHeader nav={nav} searchItems={searchItems} />

      <div className="mx-auto flex w-full max-w-screen-2xl gap-8 px-4 sm:px-6 lg:px-8">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto py-8 pr-2 lg:block">
          <DocsSidebar nav={nav} />
        </aside>

        <main
          id="main"
          tabIndex={-1}
          className="min-w-0 flex-1 py-8 focus-visible:outline-none"
        >
          {children}
        </main>
      </div>
    </div>
  );
}
