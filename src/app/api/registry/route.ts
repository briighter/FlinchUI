import { categories, components } from '@/registry/components';
import { registryVersion } from '@/lib/registry';
import { siteUrl } from '@/lib/site';

export const dynamic = 'force-static';

/**
 * The full registry as JSON. This is the contract shared by the CLI, the docs
 * site, and any external tooling. Fields are additive; consumers should ignore
 * unknown keys.
 */
export function GET() {
  return Response.json(
    {
      name: 'FlinchUI',
      version: registryVersion,
      homepage: siteUrl,
      install: 'npx flinchui add <slug>',
      categories,
      components: components.map((component) => ({
        ...component,
        docs: `${siteUrl}/components/${component.slug}`,
      })),
    },
    {
      headers: {
        'cache-control': 'public, max-age=3600',
      },
    },
  );
}
