import { docsIndexMarkdown } from '@/lib/page-markdown';
import { markdownResponse } from '@/lib/markdown-response';

export const dynamic = 'force-static';

/** `/md/docs` — the guide index. */
export function GET() {
  return markdownResponse(docsIndexMarkdown());
}
