import { guides } from '@/registry/guides';
import { guideMarkdown } from '@/lib/page-markdown';
import { markdownNotFound, markdownResponse } from '@/lib/markdown-response';

export const dynamic = 'force-static';

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const body = guideMarkdown(slug);
  if (!body) return markdownNotFound('guide');
  return markdownResponse(body);
}
