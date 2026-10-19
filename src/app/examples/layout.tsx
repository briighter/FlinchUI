import type { ReactNode } from 'react';
import { ShowcaseBar } from '@/components/showcase/showcase-bar';

export default function ExamplesLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-dvh bg-bg">
      <ShowcaseBar />
      <main id="main" tabIndex={-1} className="focus-visible:outline-none">
        {children}
      </main>
    </div>
  );
}
