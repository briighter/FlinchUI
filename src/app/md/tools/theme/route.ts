import { themeToolMarkdown } from '@/lib/page-markdown';
import { markdownResponse } from '@/lib/markdown-response';

export const dynamic = 'force-static';

/** `/md/tools/theme` — the Theme Studio's API documentation. */
export function GET() {
  return markdownResponse(themeToolMarkdown());
}
