import { components } from '@/registry/components';
import { componentMarkdown } from '@/lib/page-markdown';
import { markdownNotFound, markdownResponse } from '@/lib/markdown-response';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return components.map((component) => ({ slug: component.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = componentMarkdown(slug);
  if (!body) return markdownNotFound('component');
  return markdownResponse(body);
}
