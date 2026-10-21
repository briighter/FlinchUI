import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { allComponents, getComponent } from '@/lib/registry';
import { categories } from '@/registry/components';
import { nativeSnippets } from '@/registry/native';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { CodeBlock } from '@/components/ui/code-block';
import { Link } from '@/components/ui/link';
import { PropTable } from '@/components/docs/prop-table';
import { Callout } from '@/components/docs/callout';
import { Snippet } from '@/components/docs/snippet';
import { MarkdownActions } from '@/components/docs/markdown-actions';
import { Toc, type TocItem } from '@/components/docs/toc';
import { ExampleContent } from '@/content/examples';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return allComponents.map((component) => ({ slug: component.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const component = getComponent(slug);
  if (!component) return {};

  return {
    title: component.name,
    description: component.description,
    alternates: {
      canonical: `/components/${component.slug}`,
      types: { 'text/markdown': `/components/${component.slug}.md` },
    },
  };
}

export default async function ComponentPage({ params }: PageProps) {
  const { slug } = await params;
  const component = getComponent(slug);

  if (!component) notFound();

  const category = categories.find((entry) => entry.id === component.category);
  const native = nativeSnippets[component.slug];

  const toc: TocItem[] = [
    { id: 'examples', title: 'Examples' },
    ...(component.props?.length ? [{ id: 'api', title: 'API reference' as const }] : []),
    ...(component.a11y?.length ? [{ id: 'accessibility', title: 'Accessibility' as const }] : []),
    ...(native ? [{ id: 'native', title: 'React Native' as const }] : []),
    ...(component.related?.length ? [{ id: 'related', title: 'Related' as const }] : []),
  ];

  return (
    <div className="flex gap-12">
      <article className="min-w-0 max-w-3xl flex-1">
        <Breadcrumb
          items={[
            { label: 'Components', href: '/components/button' },
            { label: category?.label ?? 'Components' },
            { label: component.name },
          ]}
        />

        <header className="mt-4 border-b border-border pb-6">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold tracking-tight text-fg">{component.name}</h1>
            {component.status === 'beta' ? <Badge tone="warning">Beta</Badge> : null}
            {component.deps?.length ? <Badge tone="info">Opt-in dependency</Badge> : null}
          </div>
          <p className="mt-2 text-lg text-fg-muted">{component.description}</p>
          {component.intro ? (
            <p className="mt-3 text-sm leading-6 text-fg-muted">{component.intro}</p>
          ) : null}

          <div className="mt-4 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-sm">
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
              <span className="text-fg-subtle">
                Category:{' '}
                <Link href={`/components/${allComponents.find((item) => item.category === component.category)?.slug ?? ''}`} tone="subtle">
                  {category?.label}
                </Link>
              </span>
              {component.files?.length ? (
                <span className="font-mono text-xs text-fg-subtle">{component.files[0]}</span>
              ) : null}
            </div>
            <MarkdownActions href={`/components/${component.slug}.md`} />
          </div>
        </header>

        <div className="mt-6 flex flex-col gap-6">
          <CodeBlock
            code={`npx flinchui add ${component.slug}`}
            language="bash"
            title="Install from the registry"
          />

          {component.deps?.length ? (
            <Callout tone="warning" title="Opt-in dependency">
              This component positions floating content with Floating UI. Install it alongside the
              component:{' '}
              <code className="font-mono text-xs">{component.deps.map((dep) => `npm i ${dep}`).join(' && ')}</code>.
              Every other component in the library has zero runtime dependencies.
            </Callout>
          ) : null}
        </div>

        <section id="examples" className="mt-12 scroll-mt-24">
          <h2 className="text-2xl font-bold tracking-tight text-fg">Examples</h2>
          <div className="mt-6">
            <ExampleContent category={component.category} slug={component.slug} />
          </div>
        </section>

        {component.props?.length ? (
          <section id="api" className="mt-14 scroll-mt-24">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-fg">API reference</h2>
            <PropTable props={component.props} />
          </section>
        ) : null}

        {component.a11y?.length ? (
          <section id="accessibility" className="mt-14 scroll-mt-24">
            <h2 className="mb-3 text-2xl font-bold tracking-tight text-fg">Accessibility</h2>
            <ul className="list-disc space-y-2 pl-5 text-sm text-fg-muted marker:text-fg-subtle">
              {component.a11y.map((note) => (
                <li key={note}>{note}</li>
              ))}
            </ul>
          </section>
        ) : null}

        {native ? (
          <section id="native" className="mt-14 scroll-mt-24">
            <h2 className="text-2xl font-bold tracking-tight text-fg">React Native</h2>
            <p className="mt-3 text-sm leading-7 text-fg-muted">
              The native twin keeps the same prop names and design tokens, and swaps DOM elements for
              native primitives. It is documentation-only — pair it with a generated{' '}
              <code className="font-mono text-xs">theme</code> object as described in the{' '}
              <Link href="/docs/react-native" tone="subtle">
                React Native guide
              </Link>
              .
            </p>
            <div className="mt-4">
              <Snippet
                language="tsx"
                title={`${component.slug}.native.tsx`}
                code={native}
              />
            </div>
          </section>
        ) : null}

        {component.related?.length ? (
          <section id="related" className="mt-14 scroll-mt-24">
            <h2 className="mb-4 text-2xl font-bold tracking-tight text-fg">Related</h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {component.related.map((relatedSlug) => {
                const related = getComponent(relatedSlug);
                if (!related) return null;
                return (
                  <a
                    key={relatedSlug}
                    href={`/components/${relatedSlug}`}
                    className="rounded-lg border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface-sunken"
                  >
                    <p className="text-sm font-semibold text-fg">{related.name}</p>
                    <p className="mt-1 text-sm text-fg-muted">{related.description}</p>
                  </a>
                );
              })}
            </div>
          </section>
        ) : null}

        <footer className="mt-16 border-t border-border pt-6 text-sm text-fg-muted">
          <p>
            Found something off? The registry and this page are generated from{' '}
            <code className="font-mono text-xs">src/registry/components.ts</code> — edit it there and
            the docs update.
          </p>
        </footer>
      </article>

      <aside className="sticky top-14 hidden w-48 shrink-0 self-start py-8 xl:block">
        <Toc items={toc} />
      </aside>
    </div>
  );
}
