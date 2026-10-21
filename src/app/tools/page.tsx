import type { Metadata } from 'next';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Link } from '@/components/ui/link';
import { ArrowRightIcon, CodeIcon, PaletteIcon, TerminalIcon } from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'Tools',
  description:
    'FlinchUI services: a theme studio that emits copy-paste CSS, a machine-readable component registry, and a CLI.',
};

const TOOLS = [
  {
    href: '/tools/theme',
    title: 'Theme Studio',
    description:
      'Generate a complete OKLCH theme from a seed, audit its contrast, and copy the CSS, JSON, or an agent-ready prompt.',
    icon: PaletteIcon,
    badge: 'New',
  },
  {
    href: '/api/registry',
    title: 'Registry API',
    description:
      'Every component as JSON: slug, category, props, files, dependencies, and accessibility notes. No scraping required.',
    icon: CodeIcon,
    badge: 'JSON',
  },
  {
    href: '/docs/cli',
    title: 'CLI',
    description:
      'Copy a component and its import graph into your project with one command, offline, from the same registry.',
    icon: TerminalIcon,
    badge: 'npx',
  },
] as const;

export default function ToolsPage() {
  return (
    <div className="flex flex-col gap-10">
      <header className="max-w-3xl">
        <Badge tone="brand" size="sm">
          Services
        </Badge>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-fg sm:text-5xl">Tools</h1>
        <p className="mt-4 text-lg leading-8 text-fg-muted">
          FlinchUI is a library you copy, so the useful tooling is the part that produces artefacts:
          theme CSS, registry JSON, and source files. Everything here is deterministic and readable
          by both people and agents.
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-3">
        {TOOLS.map((tool) => (
          <Link
            key={tool.href}
            href={tool.href}
            className="group flex flex-col gap-3 rounded-xl border border-border bg-surface p-5 no-underline transition-colors hover:border-border-strong"
          >
            <div className="flex items-center justify-between">
              <span className="flex size-9 items-center justify-center rounded-lg bg-brand-500/10 text-brand-600">
                <tool.icon className="size-5" />
              </span>
              <Badge tone="neutral" size="sm">
                {tool.badge}
              </Badge>
            </div>
            <div>
              <h2 className="flex items-center gap-1.5 text-base font-semibold text-fg">
                {tool.title}
                <ArrowRightIcon className="size-4 text-fg-subtle transition-transform group-hover:translate-x-0.5" />
              </h2>
              <p className="mt-1.5 text-sm leading-6 text-fg-muted">{tool.description}</p>
            </div>
          </Link>
        ))}
      </div>

      <Card padding="lg" className="max-w-3xl">
        <h2 className="text-sm font-semibold text-fg">Building an agent?</h2>
        <p className="mt-2 text-sm leading-6 text-fg-muted">
          Start with{' '}
          <Link href="/llms.txt" tone="subtle">
            /llms.txt
          </Link>{' '}
          for the index, then fetch{' '}
          <Link href="/llms-full.txt" tone="subtle">
            /llms-full.txt
          </Link>{' '}
          when you need every prop. The theme service is documented at{' '}
          <Link href="/api/themes" tone="subtle">
            /api/themes
          </Link>
          .
        </p>
      </Card>
    </div>
  );
}
