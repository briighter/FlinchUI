/**
 * Shared response shape for the Markdown mirrors.
 *
 * `text/markdown` is deliberate: crawlers and editors treat it as prose, while
 * browsers that navigate to the URL show the raw file (useful for a quick copy).
 */
export function markdownResponse(body: string, status = 200): Response {
  return new Response(body, {
    status,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
      'Cache-Control': 'public, max-age=0, s-maxage=3600',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}

export function markdownNotFound(what: string): Response {
  return new Response(`# Not found\n\nNo ${what} matches that slug.\n`, {
    status: 404,
    headers: {
      'Content-Type': 'text/markdown; charset=utf-8',
    },
  });
}
