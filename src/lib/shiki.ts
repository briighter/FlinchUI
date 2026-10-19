import { createHighlighter, type Highlighter } from 'shiki';

/**
 * Build-time syntax highlighting.
 *
 * Shiki runs **only on the server** (inside React Server Components), so the
 * docs site ships zero highlighting JavaScript to the browser — just the
 * resulting HTML. The highlighter is a module-level singleton so it is created
 * at most once per server process.
 */

const LANGS = ['tsx', 'ts', 'jsx', 'js', 'bash', 'json', 'css', 'html', 'md', 'diff'] as const;
const THEMES = ['github-light', 'github-dark'] as const;

let highlighterPromise: Promise<Highlighter> | null = null;

function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: [...THEMES],
      langs: [...LANGS],
    });
  }
  return highlighterPromise;
}

export async function highlight(code: string, lang: string = 'tsx'): Promise<string> {
  const highlighter = await getHighlighter();
  const language = (LANGS as readonly string[]).includes(lang) ? lang : 'tsx';

  return highlighter.codeToHtml(code.trimEnd(), {
    lang: language,
    themes: { light: 'github-light', dark: 'github-dark' },
  });
}
