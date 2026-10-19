import type { Metadata } from 'next';
import { showcaseApps } from '@/lib/showcase';
import { AppGallery } from '@/components/showcase/app-gallery';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/components/ui/link';

export const metadata: Metadata = {
  title: 'Examples',
  description:
    'Complete, working applications built entirely from FlinchUI components — a trading terminal, an analytics dashboard, a storefront, a 3D configurator, a game, and more.',
};

export default function ExamplesPage() {
  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="max-w-3xl">
        <Badge tone="brand" size="sm">
          {showcaseApps.length} applications
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-fg sm:text-5xl">
          Built with FlinchUI
        </h1>
        <p className="mt-4 text-lg leading-8 text-fg-muted">
          Not screenshots and not mockups. Every surface below is a real React tree assembled from
          the same components you copy out of this site — no runtime styling engine, no component
          framework, and no charting library. Charts, waveforms, a 3D scene, and a game loop are all
          built from scratch on top of the primitives.
        </p>
        <p className="mt-3 text-sm leading-7 text-fg-muted">
          Each example is a single page you can read end to end. Copy the components you need with{' '}
          <code className="rounded-sm bg-surface-sunken px-1.5 py-0.5 font-mono text-xs">
            npx flinchui add button
          </code>
          , then copy the composition from the app itself. Start with the{' '}
          <Link href="/components/button" tone="subtle">
            component registry
          </Link>{' '}
          or read the{' '}
          <Link href="/docs/authoring" tone="subtle">
            authoring guide
          </Link>
          .
        </p>
      </header>

      <div className="mt-12">
        <AppGallery />
      </div>
    </div>
  );
}
