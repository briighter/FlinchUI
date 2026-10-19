import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CopyButton } from './copy-button';

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  code: string;
  language?: string;
  /** Optional filename / title shown in the header bar. */
  title?: ReactNode;
  /** Show the copy-to-clipboard control. */
  copyable?: boolean;
  /** Highlighted markup (already-rendered HTML from a build-time highlighter). */
  highlightedHtml?: string;
  showLineNumbers?: boolean;
}

/**
 * CodeBlock — a themed `<pre>` surface. Pass `highlightedHtml` (produced at build
 * time by e.g. Shiki) to render syntax-highlighted code with **no client-side
 * highlighting runtime**.
 */
export function CodeBlock({
  code,
  language = 'tsx',
  title,
  copyable = true,
  highlightedHtml,
  showLineNumbers = false,
  className,
  ...rest
}: CodeBlockProps) {
  return (
    <div
      className={cn('overflow-hidden rounded-lg border border-border bg-surface-sunken', className)}
      {...rest}
    >
      {(title || copyable) && (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-surface/60 px-3 py-1.5">
          <span className="font-mono text-xs text-fg-muted">{title ?? language}</span>
          {copyable ? <CopyButton value={code} label="Copy code" size="sm" /> : null}
        </div>
      )}
      <div className="overflow-x-auto">
        {highlightedHtml ? (
          <div
            className="p-4 font-mono text-[13px] leading-6 [&_pre]:bg-transparent [&_pre]:m-0"
            dangerouslySetInnerHTML={{ __html: highlightedHtml }}
          />
        ) : (
          <pre className="p-4 font-mono text-[13px] leading-6 text-fg">
            <code className={cn(showLineNumbers && 'block')}>{code}</code>
          </pre>
        )}
      </div>
    </div>
  );
}
