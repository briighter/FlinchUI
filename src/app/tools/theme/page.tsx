import type { Metadata } from 'next';
import { siteUrl } from '@/lib/site';
import { ThemeStudio } from '@/components/tools/theme-studio';
import { MarkdownActions } from '@/components/docs/markdown-actions';
import { Badge } from '@/components/ui/badge';
import { Link } from '@/components/ui/link';

export const metadata: Metadata = {
  title: 'Theme Studio',
  description:
    'Generate a complete FlinchUI theme from a seed colour: OKLCH tokens, a measured WCAG contrast audit, copy-paste CSS, JSON, and an agent-ready prompt.',
  alternates: { canonical: '/tools/theme', types: { 'text/markdown': '/tools/theme.md' } },
};

export default function ThemeStudioPage() {
  return (
    <div className="flex flex-col gap-8">
      <header className="max-w-3xl">
        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="brand" size="sm">
            Tool
          </Badge>
          <Badge tone="success" size="sm">
            Zero runtime styling
          </Badge>
          <Badge tone="neutral" size="sm">
            OKLCH
          </Badge>
        </div>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-fg sm:text-5xl">
          Theme Studio
        </h1>
        <p className="mt-4 text-lg leading-8 text-fg-muted">
          A FlinchUI theme is nothing but a block of CSS custom properties, so a theme generator is
          a function from a seed to that block. Pick a hue and surface temperature, audit the
          result, then take the CSS — or hand the prompt to an agent.
        </p>
        <p className="mt-3 text-sm leading-7 text-fg-muted">
          The generated tokens reproduce the shipped light theme at the defaults. Components never
          change: they read semantic tokens, so setting{' '}
          <code className="rounded-sm bg-surface-sunken px-1.5 py-0.5 font-mono text-xs">
            data-theme=&quot;prism&quot;
          </code>{' '}
          re-themes any subtree with no JavaScript. The same output is available from the{' '}
          <Link href="/api/themes" tone="subtle">
            theme API
          </Link>
          .
        </p>
        <MarkdownActions href="/tools/theme.md" className="mt-5" />
      </header>

      <ThemeStudio apiBase={siteUrl} />
    </div>
  );
}
