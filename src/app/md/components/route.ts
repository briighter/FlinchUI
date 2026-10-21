import { componentsIndexMarkdown } from '@/lib/page-markdown';
import { markdownResponse } from '@/lib/markdown-response';

export const dynamic = 'force-static';

/** `/md/components` — the grouped component index. */
export function GET() {
  return markdownResponse(componentsIndexMarkdown());
}
