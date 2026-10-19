import type { Metadata } from 'next';
import { categories, components } from '@/registry/components';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Container } from '@/components/ui/container';
import { Code } from '@/components/ui/code';
import { Grid } from '@/components/ui/grid';
import { HStack, Stack, VStack } from '@/components/ui/stack';
import { Footer } from '@/components/ui/footer';
import { Example } from '@/components/docs/example';
import { Callout } from '@/components/docs/callout';
import {
  ArrowRightIcon,
  BoxIcon,
  SparklesIcon,
  PaletteIcon,
  AccessibilityIcon,
  BoltIcon,
  CodeIcon,
  LayersIcon,
  TerminalIcon,
  CheckIcon,
} from '@/components/ui/icons';

export const metadata: Metadata = {
  title: 'FlinchUI — copy-paste React components you own',
  description:
    'A lightweight, infinitely extensible React component library built on Tailwind v4 design tokens. Zero runtime styling, opt-in dependencies, and runtime theming.',
};

const THEMES = [
  { id: 'light', label: 'Light', color: 'bg-white' },
  { id: 'dark', label: 'Dark', color: 'bg-neutral-900' },
  { id: 'violet', label: 'Violet', color: 'bg-[oklch(0.55_0.22_305)]' },
  { id: 'emerald', label: 'Emerald', color: 'bg-[oklch(0.59_0.13_165)]' },
  { id: 'amber', label: 'Amber', color: 'bg-[oklch(0.75_0.16_76)]' },
  { id: 'rose', label: 'Rose', color: 'bg-[oklch(0.58_0.22_12)]' },
];

const FEATURES = [
  {
    icon: BoltIcon,
    title: 'Zero runtime styling',
    body: 'Every style is a static Tailwind utility resolved at build time. No CSS-in-JS, no style recalculation, no hydration cost.',
  },
  {
    icon: BoxIcon,
    title: 'You own the source',
    body: 'Components are copied into your repo, not imported from a black box. Change anything, delete anything, keep the rest.',
  },
  {
    icon: PaletteIcon,
    title: 'Themable at runtime',
    body: 'Semantic tokens are CSS variables. Swap one block of variables to re-theme every component — including nested subtrees.',
  },
  {
    icon: AccessibilityIcon,
    title: 'Accessible by default',
    body: 'Native elements wherever possible, correct ARIA where not, keyboard support everywhere, and visible focus rings.',
  },
  {
    icon: LayersIcon,
    title: 'Infinitely extensible',
    body: 'Every component exports its variant map and accepts asChild. Compose it, wrap it, or extend it without forking.',
  },
  {
    icon: SparklesIcon,
    title: 'AI-ready by design',
    body: 'A machine-readable registry, llms.txt endpoints, and a bundled agent prompt let any model add components correctly.',
  },
];

export default function HomePage() {
  const count = components.length;

  return (
    <>
      {/* --------------------------------- hero --------------------------------- */}
      <section className="relative overflow-hidden border-b border-border">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_-10%,var(--color-brand-100),transparent)] dark:bg-[radial-gradient(60%_50%_at_50%_-10%,var(--color-brand-900),transparent)]"
        />
        <Container maxWidth="xl" className="relative py-20 sm:py-28">
          <VStack gap="lg" align="center" className="text-center">
            <Badge tone="brand" dot>
              {count} components · {categories.length} categories · 7 themes
            </Badge>

            <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight text-fg sm:text-6xl">
              React components you copy in.
              <span className="block text-brand-600">Not a runtime you install.</span>
            </h1>

            <p className="max-w-2xl text-lg leading-8 text-fg-muted">
              FlinchUI is a Bootstrap-style component library for React and Tailwind v4. Every
              component is copy-paste source built on semantic design tokens — lightweight,
              accessible, and endlessly extensible.
            </p>

            <HStack gap="sm" justify="center" wrap="wrap">
              <Button size="lg" asChild endIcon={<ArrowRightIcon />}>
                <a href="/docs/introduction">Get started</a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="/components/button">Browse components</a>
              </Button>
            </HStack>

            <div className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2 font-mono text-sm text-fg-muted shadow-xs">
              <TerminalIcon className="size-4 text-fg-subtle" />
              <span>npx flinchui add button</span>
            </div>
          </VStack>
        </Container>
      </section>

      {/* ------------------------------- live demo ------------------------------ */}
      <Container maxWidth="xl" className="py-16 sm:py-20">
        <Grid columns={1} lgColumns={2} gap="xl" className="items-center">
          <Stack gap="md">
            <h2 className="text-3xl font-bold tracking-tight text-fg">
              Beautiful defaults. Zero lock-in.
            </h2>
            <p className="text-fg-muted">
              Components ship with a considered design system — five surface treatments, seven
              semantic tones, consistent radii, and a shared focus ring. Override any of it with the{' '}
              <Code>className</Code> prop, because your utilities always come last.
            </p>
            <VStack gap="sm">
              {[
                'No provider, no theme object, no config file',
                'Server Components and client components both supported',
                'Variant maps exported for composition',
              ].map((line) => (
                <HStack key={line} gap="sm" align="start">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-success-subtle text-success-fg">
                    <CheckIcon className="size-3" />
                  </span>
                  <span className="text-sm text-fg-muted">{line}</span>
                </HStack>
              ))}
            </VStack>
            <HStack gap="sm">
              <Button asChild variant="secondary" size="sm">
                <a href="/docs/installation">Installation guide</a>
              </Button>
              <Button asChild variant="ghost" size="sm" endIcon={<ArrowRightIcon />}>
                <a href="/docs/authoring">Authoring conventions</a>
              </Button>
            </HStack>
          </Stack>

          <Example
            code={`import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button } from '@/components/ui';

export function Welcome() {
  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Deploy to production</CardTitle>
        <CardDescription>Your changes are ready to ship.</CardDescription>
      </CardHeader>
      <CardContent className="flex gap-2">
        <Button size="sm">Deploy</Button>
        <Button size="sm" variant="ghost">Preview</Button>
      </CardContent>
    </Card>
  );
}`}
          >
            <Card variant="elevated" className="mx-auto max-w-sm">
              <CardHeader>
                <CardTitle>Deploy to production</CardTitle>
                <CardDescription>Your changes are ready to ship.</CardDescription>
              </CardHeader>
              <CardContent>
                <HStack gap="sm">
                  <Button size="sm">Deploy</Button>
                  <Button size="sm" variant="ghost">
                    Preview
                  </Button>
                </HStack>
              </CardContent>
            </Card>
          </Example>
        </Grid>
      </Container>

      {/* -------------------------------- features ------------------------------- */}
      <section className="border-y border-border bg-surface">
        <Container maxWidth="xl" className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-fg">
              Designed for the way you actually build
            </h2>
            <p className="mt-3 text-fg-muted">
              Six constraints shape every decision in the library — and every one of them makes the
              result smaller.
            </p>
          </div>

          <Grid columns={1} mdColumns={2} lgColumns={3} gap="lg" className="mt-12">
            {FEATURES.map((feature) => (
              <div key={feature.title} className="rounded-xl border border-border bg-bg p-6">
                <span className="flex size-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:text-brand-300">
                  <feature.icon className="size-5" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-fg">{feature.title}</h3>
                <p className="mt-2 text-sm leading-6 text-fg-muted">{feature.body}</p>
              </div>
            ))}
          </Grid>
        </Container>
      </section>

      {/* ------------------------------- components ----------------------------- */}
      <Container maxWidth="xl" className="py-16 sm:py-20">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-fg">Browse the library</h2>
            <p className="mt-2 text-fg-muted">
              {count} components across {categories.length} categories. Every page has live previews,
              copyable source, and a full API table.
            </p>
          </div>
          <Button asChild variant="outline" endIcon={<ArrowRightIcon />}>
            <a href="/components/button">View all components</a>
          </Button>
        </div>

        <Grid columns={1} mdColumns={2} lgColumns={3} gap="md" className="mt-8">
          {categories.map((category) => {
            const items = components.filter((component) => component.category === category.id);
            return (
              <a
                key={category.id}
                href={`/components/${items[0]?.slug ?? 'button'}`}
                className="group rounded-xl border border-border p-5 transition-colors hover:border-brand-300 hover:bg-surface"
              >
                <div className="flex items-center justify-between gap-3">
                  <h3 className="font-semibold text-fg">{category.label}</h3>
                  <Badge tone="neutral" size="sm">
                    {items.length}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-fg-muted">{category.description}</p>
                <p className="mt-3 truncate text-xs text-fg-subtle">
                  {items
                    .slice(0, 4)
                    .map((item) => item.name)
                    .join(' · ')}
                  {items.length > 4 ? ` · +${items.length - 4}` : ''}
                </p>
              </a>
            );
          })}
        </Grid>
      </Container>

      {/* --------------------------------- themes -------------------------------- */}
      <section className="border-y border-border bg-surface">
        <Container maxWidth="xl" className="py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <Badge tone="brand" size="sm">
              <PaletteIcon className="size-3" /> Seven built-in themes
            </Badge>
            <h2 className="mt-4 text-3xl font-bold tracking-tight text-fg">
              Theme anything. Even a subtree.
            </h2>
            <p className="mt-3 text-fg-muted">
              Themes are just CSS variable overrides. Set <Code>data-theme</Code> on any element and
              every component inside it re-themes instantly — no provider, no re-render.
            </p>
          </div>

          <Grid columns={2} mdColumns={3} lgColumns={6} gap="md" className="mt-10">
            {THEMES.map((theme) => (
              <div key={theme.id} data-theme={theme.id} className="overflow-hidden rounded-xl border border-border bg-bg">
                <div className="flex h-24 flex-col justify-between p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-fg">{theme.label}</span>
                    <span className={`size-3 rounded-full ${theme.color} ring-1 ring-black/10`} />
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="inline-flex h-6 items-center rounded-md bg-brand-600 px-2 text-[10px] font-medium text-fg-on-brand">
                      Button
                    </span>
                    <span className="h-6 w-10 rounded-md bg-surface-sunken ring-1 ring-border" />
                  </div>
                </div>
              </div>
            ))}
          </Grid>

          <div className="mt-8 text-center">
            <Button asChild variant="outline" endIcon={<ArrowRightIcon />}>
              <a href="/docs/theming">Read the theming guide</a>
            </Button>
          </div>
        </Container>
      </section>

      {/* ---------------------------------- AI ----------------------------------- */}
      <Container maxWidth="xl" className="py-16 sm:py-20">
        <Grid columns={1} lgColumns={2} gap="xl" className="items-center">
          <Example
            language="bash"
            code={`# A machine-readable catalog of every component,
# its props, dependencies, and source files.
curl https://flinchui.dev/api/registry

# Point an agent at the full library in one file.
curl https://flinchui.dev/llms-full.txt

# Add a component and its dependencies.
npx flinchui add dialog`}
          >
            <VStack gap="sm" className="font-mono text-sm">
              <HStack gap="sm">
                <TerminalIcon className="size-4 text-brand-600" />
                <span className="text-fg">npx flinchui add dialog</span>
              </HStack>
              <span className="text-fg-muted">✓ copied ui/dialog.tsx</span>
              <span className="text-fg-muted">✓ copied ui/close-button.tsx</span>
              <span className="text-fg-muted">✓ components.json updated</span>
            </VStack>
          </Example>

          <Stack gap="md">
            <Badge tone="brand" size="sm">
              <SparklesIcon className="size-3" /> Built for agents
            </Badge>
            <h2 className="text-3xl font-bold tracking-tight text-fg">
              Your AI already knows this library
            </h2>
            <p className="text-fg-muted">
              The registry is the source of truth for the docs, the CLI, and the AI layer. Point an
              agent at <Code>/llms.txt</Code> and it can add the right component, with the right
              props, in the house style.
            </p>
            <Callout tone="tip" title="Ship the prompt with your repo">
              <Code>PROMPT.md</Code> contains a ready-to-paste agent prompt. It explains the
              conventions, the token system, and how to extend a component without breaking it.
            </Callout>
            <HStack gap="sm">
              <Button asChild size="sm">
                <a href="/docs/ai">AI integration</a>
              </Button>
              <Button asChild size="sm" variant="ghost">
                <a href="/llms.txt">Open llms.txt</a>
              </Button>
            </HStack>
          </Stack>
        </Grid>
      </Container>

      {/* ---------------------------------- CTA ---------------------------------- */}
      <section className="border-t border-border bg-surface">
        <Container maxWidth="xl" className="py-16 sm:py-20">
          <div className="mx-auto flex max-w-3xl flex-col items-center gap-6 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-fg sm:text-4xl">
              Start with one component.
            </h2>
            <p className="max-w-xl text-fg-muted">
              No package to adopt, no architecture to buy into. Copy the installation into your
              project, add <Code>button</Code>, and take the rest when you need it.
            </p>
            <HStack gap="sm">
              <Button size="lg" asChild endIcon={<ArrowRightIcon />}>
                <a href="/docs/installation">Install FlinchUI</a>
              </Button>
              <Button size="lg" variant="outline" asChild startIcon={<CodeIcon />}>
                <a href="/components/button">See a component</a>
              </Button>
            </HStack>
            <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-fg-subtle">
              <span>Zero runtime dependencies</span>
              <span aria-hidden="true">·</span>
              <span>Zero CSS-in-JS</span>
              <span aria-hidden="true">·</span>
              <span>MIT licensed</span>
            </div>
          </div>
        </Container>
      </section>

      <Footer
        brand={
          <div className="flex flex-col gap-3">
            <span className="flex items-center gap-2 text-sm font-semibold text-fg">
              <span className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-xs font-extrabold text-fg-on-brand">
                F
              </span>
              FlinchUI
            </span>
            <p className="text-sm text-fg-muted">
              A lightweight, infinitely extensible React component library. Copy-paste source, built
              on Tailwind v4 tokens.
            </p>
          </div>
        }
        columns={[
          {
            title: 'Getting started',
            links: [
              { label: 'Introduction', href: '/docs/introduction' },
              { label: 'Installation', href: '/docs/installation' },
              { label: 'Theming', href: '/docs/theming' },
              { label: 'CLI', href: '/docs/cli' },
            ],
          },
          {
            title: 'Library',
            links: [
              { label: 'Components', href: '/components/button' },
              { label: 'Authoring', href: '/docs/authoring' },
              { label: 'Extending', href: '/docs/extending' },
              { label: 'Roadmap', href: '/docs/roadmap' },
            ],
          },
          {
            title: 'Resources',
            links: [
              { label: 'AI integration', href: '/docs/ai' },
              { label: 'llms.txt', href: '/llms.txt' },
              { label: 'Registry API', href: '/api/registry' },
              { label: 'React Native', href: '/docs/react-native' },
            ],
          },
        ]}
        bottom={
          <>
            <span>© {new Date().getFullYear()} FlinchUI. MIT licensed.</span>
            <span className="text-xs text-fg-subtle">Built with Next.js and Tailwind CSS v4.</span>
          </>
        }
      />
    </>
  );
}
