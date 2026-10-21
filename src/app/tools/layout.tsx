import type { ReactNode } from 'react';
import { getDocsNav } from '@/lib/nav';
import { searchIndex } from '@/lib/registry';
import { DocsHeader } from '@/components/docs/docs-header';

/**
 * Tools are services rather than documentation, so they get the site header but
 * not the component sidebar — the page can use the full width.
 */
export default function ToolsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg">
      <DocsHeader nav={getDocsNav()} searchItems={searchIndex()} />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto w-full max-w-screen-2xl px-4 py-10 focus-visible:outline-none sm:px-6 lg:px-8"
      >
        {children}
      </main>
    </div>
  );
}
