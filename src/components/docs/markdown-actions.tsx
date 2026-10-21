'use client';

import { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { CheckIcon, DownloadIcon, FileIcon } from '@/components/ui/icons';
import { cn } from '@/lib/cn';

export interface MarkdownActionsProps {
  /** Path to the Markdown twin, e.g. `/components/button.md`. */
  href: string;
  className?: string;
}

type State = 'idle' | 'copied' | 'error';

/**
 * Copy the current page's Markdown twin to the clipboard.
 *
 * The file is fetched on demand rather than embedded in the page, so the
 * rendered HTML stays small and the copy is byte-identical to what a crawler
 * receives at the `.md` URL.
 */
export function MarkdownActions({ href, className }: MarkdownActionsProps) {
  const [state, setState] = useState<State>('idle');
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (timer.current) clearTimeout(timer.current);
    },
    [],
  );

  async function copy() {
    try {
      const response = await fetch(href, { headers: { Accept: 'text/markdown' } });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      await navigator.clipboard.writeText(await response.text());
      setState('copied');
      if (timer.current) clearTimeout(timer.current);
      timer.current = setTimeout(() => setState('idle'), 2200);
    } catch {
      setState('error');
    }
  }

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <Button
        size="sm"
        variant="secondary"
        onClick={copy}
        startIcon={state === 'copied' ? <CheckIcon /> : <FileIcon />}
        aria-live="polite"
      >
        {state === 'copied'
          ? 'Copied Markdown'
          : state === 'error'
            ? 'Copy failed — use .md'
            : 'Copy as Markdown'}
      </Button>
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-1 text-xs font-medium text-fg-subtle underline-offset-4 hover:text-fg hover:underline"
      >
        <DownloadIcon className="size-3.5" aria-hidden="true" />
        View .md
      </a>
    </div>
  );
}
