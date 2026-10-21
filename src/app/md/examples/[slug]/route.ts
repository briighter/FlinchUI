import { showcaseApps } from '@/lib/showcase';
import { exampleMarkdown } from '@/lib/page-markdown';
import { markdownNotFound, markdownResponse } from '@/lib/markdown-response';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return showcaseApps.map((app) => ({ slug: app.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = await exampleMarkdown(slug);
  if (!body) return markdownNotFound('example');
  return markdownResponse(body);
}
