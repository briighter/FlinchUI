import { toolsIndexMarkdown } from '@/lib/page-markdown';
import { markdownResponse } from '@/lib/markdown-response';

export const dynamic = 'force-static';

/** `/md/tools` — the services index. */
export function GET() {
  return markdownResponse(toolsIndexMarkdown());
}
