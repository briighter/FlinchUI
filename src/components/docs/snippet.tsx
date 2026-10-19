import type { ReactNode } from 'react';
import { highlight } from '@/lib/shiki';
import { CodeBlock } from '@/components/ui/code-block';

export interface SnippetProps {
  code: string;
  language?: string;
  title?: ReactNode;
  className?: string;
}

/**
 * Snippet — a syntax-highlighted code block for prose pages.
 *
 * The highlighting runs here, in a Server Component, at build time. The browser
 * receives HTML only, matching the `Example` block used on component pages.
 */
export async function Snippet({ code, language = 'tsx', title, className }: SnippetProps) {
  const html = await highlight(code, language);

  return (
    <CodeBlock
      code={code}
      language={language}
      title={title}
      highlightedHtml={html}
      className={className}
    />
  );
}
