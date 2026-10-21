import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getGuide } from '@/lib/registry';
import { guides } from '@/registry/guides';
import { guideContent } from '@/content/guides';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { MarkdownActions } from '@/components/docs/markdown-actions';
import { Toc } from '@/components/docs/toc';
import { ChevronLeftIcon, ChevronRightIcon } from '@/components/ui/icons';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuide(slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: {
      canonical: `/docs/${guide.slug}`,
      types: { 'text/markdown': `/docs/${guide.slug}.md` },
    },
  };
}

export default async function GuidePage({ params }: PageProps) {
  const { slug } = await params;
  const guide = getGuide(slug);
  const content = guideContent[slug];

  if (!guide || !content) notFound();

  const index = guides.findIndex((entry) => entry.slug === slug);
  const previous = index > 0 ? guides[index - 1] : undefined;
  const next = index >= 0 && index < guides.length - 1 ? guides[index + 1] : undefined;
  const { Component, toc } = content;

  return (
    <div className="flex gap-12">
      <article className="min-w-0 max-w-3xl flex-1">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Breadcrumb
            items={[
              { label: 'Docs', href: '/docs/introduction' },
              { label: guide.group },
              { label: guide.title },
            ]}
          />
          <MarkdownActions href={`/docs/${guide.slug}.md`} />
        </div>

        <div className="mt-4">
          <Component />
        </div>

        <nav
          aria-label="Guide pagination"
          className="mt-16 flex flex-col gap-3 border-t border-border pt-6 sm:flex-row sm:justify-between"
        >
          {previous ? (
            <Link
              href={`/docs/${previous.slug}`}
              className="group flex min-w-0 flex-col rounded-lg border border-border p-4 transition-colors hover:border-border-strong hover:bg-surface-sunken"
            >
              <span className="inline-flex items-center gap-1 text-xs text-fg-subtle">
                <ChevronLeftIcon className="size-3.5" />
                Previous
              </span>
              <span className="mt-1 truncate text-sm font-medium text-fg">{previous.title}</span>
            </Link>
          ) : (
            <span />
          )}

          {next ? (
            <Link
              href={`/docs/${next.slug}`}
              className="flex min-w-0 flex-col rounded-lg border border-border p-4 text-right transition-colors hover:border-border-strong hover:bg-surface-sunken sm:items-end"
            >
              <span className="inline-flex items-center gap-1 text-xs text-fg-subtle">
                Next
                <ChevronRightIcon className="size-3.5" />
              </span>
              <span className="mt-1 truncate text-sm font-medium text-fg">{next.title}</span>
            </Link>
          ) : null}
        </nav>
      </article>

      <aside className="sticky top-14 hidden w-48 shrink-0 self-start py-8 xl:block">
        <Toc items={toc} />
      </aside>
    </div>
  );
}
