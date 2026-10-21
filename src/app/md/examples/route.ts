import { examplesIndexMarkdown } from '@/lib/page-markdown';
import { markdownResponse } from '@/lib/markdown-response';

export const dynamic = 'force-static';

/** `/md/examples` — the showcase gallery as Markdown. */
export function GET() {
  return markdownResponse(examplesIndexMarkdown());
}
