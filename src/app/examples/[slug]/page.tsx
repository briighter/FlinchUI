import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getShowcaseApp, showcaseApps } from '@/lib/showcase';
import { components } from '@/registry/components';
import { ShowcaseAppView } from '@/components/showcase/apps';
import { BrowserFrame, PhoneFrame } from '@/components/showcase/app-frame';
import { Badge } from '@/components/ui/badge';
import { CheckIcon } from '@/components/ui/icons';
import { Link } from '@/components/ui/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return showcaseApps.map((app) => ({ slug: app.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const app = getShowcaseApp(slug);
  if (!app) return {};
  return { title: `${app.name} — ${app.title}`, description: app.description };
}

const SLUG_BY_NAME = new Map(components.map((component) => [component.name, component.slug]));

export default async function ShowcaseAppPage({ params }: PageProps) {
  const { slug } = await params;
  const app = getShowcaseApp(slug);
  if (!app) notFound();

  const mobile = app.device === 'mobile';

  return (
    <div className="mx-auto w-full max-w-screen-2xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">
      <header className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
        <div className="max-w-3xl">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-fg-subtle">
            <a href="/examples" className="transition-colors hover:text-fg">
              Examples
            </a>
            <span aria-hidden="true">/</span>
            <span>{app.category}</span>
          </nav>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-fg sm:text-3xl">
            {app.name}
            <span className="font-normal text-fg-subtle"> — {app.title}</span>
          </h1>
          <p className="mt-2 text-base text-fg-muted">{app.tagline}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Badge tone="neutral" size="sm">
            {mobile ? '390 × 844' : 'Desktop'}
          </Badge>
          {app.deps?.length ? (
            <Badge tone="info" size="sm">
              Opt-in dependency: {app.deps.join(', ')}
            </Badge>
          ) : (
            <Badge tone="success" size="sm">
              Zero dependencies
            </Badge>
          )}
          <Badge tone="outline" size="sm">
            {app.uses.length} components
          </Badge>
        </div>
      </header>

      <div className="mt-6">
        {mobile ? (
          <div className="flex justify-center">
            <PhoneFrame
              className="aspect-[390/844] h-[calc(100dvh-15rem)] max-h-[840px] min-h-[560px]"
              statusBar={
                <>
                  <span>9:41</span>
                  <span aria-hidden="true" className="flex items-center gap-1">
                    <span className="h-2.5 w-4 rounded-xs border border-fg" />
                    <span className="h-2.5 w-6 rounded-xs border border-fg" />
                  </span>
                </>
              }
            >
              <ShowcaseAppView slug={app.slug} />
            </PhoneFrame>
          </div>
        ) : (
          <BrowserFrame
            url={`${app.slug}.flinchui.dev`}
            className="h-[calc(100dvh-14rem)] min-h-[540px]"
          >
            <ShowcaseAppView slug={app.slug} />
          </BrowserFrame>
        )}
      </div>

      <section className="mt-14 grid gap-10 border-t border-border pt-10 lg:grid-cols-[1.5fr_1fr]">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-fg">About this build</h2>
          <p className="mt-3 text-sm leading-7 text-fg-muted">{app.description}</p>

          <ul className="mt-6 flex flex-col gap-3">
            {app.highlights.map((highlight) => (
              <li key={highlight} className="flex gap-3 text-sm leading-6 text-fg-muted">
                <CheckIcon className="mt-0.5 size-4 shrink-0 text-success-fg" />
                <span>{highlight}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-8">
          <div>
            <h3 className="text-sm font-semibold text-fg">Components used</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {app.uses.map((use) => {
                const target = SLUG_BY_NAME.get(use);
                const className =
                  'rounded-full border border-border px-2.5 py-1 text-xs text-fg-muted transition-colors';
                return target ? (
                  <Link
                    key={use}
                    href={`/components/${target}`}
                    className={`${className} hover:border-border-strong hover:text-fg`}
                  >
                    {use}
                  </Link>
                ) : (
                  <span key={use} className={className}>
                    {use}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="rounded-lg border border-border bg-surface-sunken p-5">
            <h3 className="text-sm font-semibold text-fg">Take it apart</h3>
            <p className="mt-2 text-sm leading-6 text-fg-muted">
              Add the components this app uses, then copy the composition from source.
            </p>
            <code className="mt-3 block overflow-x-auto rounded-md border border-border bg-surface px-3 py-2 font-mono text-xs text-fg-muted">
              npx flinchui add {app.uses
                .map((use) => SLUG_BY_NAME.get(use))
                .filter(Boolean)
                .slice(0, 4)
                .join(' ')}
            </code>
          </div>
        </div>
      </section>
    </div>
  );
}
