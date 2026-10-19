import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { highlight } from '@/lib/shiki';
import { CopyButton } from '@/components/ui/copy-button';
import { ChevronDownIcon } from '@/components/ui/icons';

export interface ExampleProps {
  title?: ReactNode;
  description?: ReactNode;
  /** Source shown (and copied) under the preview. */
  code: string;
  language?: string;
  children: ReactNode;
  /** Extra classes for the preview surface. */
  previewClassName?: string;
  /** Hide the preview and show only code (e.g. non-visual helpers). */
  codeOnly?: boolean;
}

/**
 * Example — the Bootstrap-style "live preview + copyable source" block.
 *
 * Highlighting happens at build time inside this server component, and the
 * disclosure uses a native `<details>` element, so the whole block ships **zero
 * JavaScript** apart from the copy button.
 */
export async function Example({
  title,
  description,
  code,
  language = 'tsx',
  children,
  previewClassName,
  codeOnly = false,
}: ExampleProps) {
  const html = await highlight(code, language);

  return (
    <section className="scroll-mt-24">
      {title ? <h3 className="text-base font-semibold text-fg">{title}</h3> : null}
      {description ? <p className="mt-1 text-sm text-fg-muted">{description}</p> : null}

      <div className={cn('mt-3 overflow-hidden rounded-xl border border-border', title || description ? '' : 'mt-0')}>
        {!codeOnly ? (
          <div className={cn('bg-surface p-6', previewClassName)}>{children}</div>
        ) : null}

        <details className="group border-t border-border first:border-t-0">
          <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-2.5 text-xs font-medium text-fg-muted transition-colors select-none hover:bg-surface-sunken hover:text-fg [&::-webkit-details-marker]:hidden">
            <span className="inline-flex items-center gap-1.5">
              <ChevronDownIcon className="size-3.5 transition-transform group-open:rotate-180" />
              {codeOnly ? 'View source' : 'View code'}
            </span>
            <span className="font-mono text-[11px] text-fg-subtle">{language}</span>
          </summary>

          <div className="relative border-t border-border bg-surface-sunken">
            <div className="absolute top-2 right-2 z-10">
              <CopyButton value={code} label="Copy code" size="sm" />
            </div>
            <div
              className="overflow-x-auto p-4 pr-12 font-mono text-[13px] leading-6 [&_pre]:m-0 [&_pre]:bg-transparent"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          </div>
        </details>
      </div>
    </section>
  );
}

/** Groups consecutive examples with consistent vertical rhythm. */
export function ExampleGroup({ className, ...rest }: { className?: string; children: ReactNode }) {
  return <div className={cn('flex flex-col gap-10', className)} {...rest} />;
}
