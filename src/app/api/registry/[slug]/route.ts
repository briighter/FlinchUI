import { notFound } from 'next/navigation';
import { allComponents, getComponent, registryVersion } from '@/lib/registry';
import { siteUrl } from '@/lib/site';

interface RouteContext {
  params: Promise<{ slug: string }>;
}

export const dynamic = 'force-static';

export function generateStaticParams() {
  return allComponents.map((component) => ({ slug: component.slug }));
}

/** A single registry entry, including its install command and docs URL. */
export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const component = getComponent(slug);

  if (!component) notFound();

  return Response.json(
    {
      version: registryVersion,
      ...component,
      docs: `${siteUrl}/components/${component.slug}`,
      install: `npx flinchui add ${component.slug}`,
      dependencies: component.deps ?? [],
    },
    {
      headers: {
        'cache-control': 'public, max-age=3600',
      },
    },
  );
}
