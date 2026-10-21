import { homeMarkdown } from '@/lib/page-markdown';
import { markdownResponse } from '@/lib/markdown-response';

export const dynamic = 'force-static';

/** `/md` — the site index as Markdown. Also served at `/index.md`. */
export function GET() {
  return markdownResponse(homeMarkdown());
}
