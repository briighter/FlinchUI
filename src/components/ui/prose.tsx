import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface ProseProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'base' | 'lg';
}

const SIZE = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
} as const;

/**
 * Prose — applies readable typography to arbitrary rich content (markdown, CMS
 * HTML) without a typography plugin. Child-element styles are expressed as
 * static arbitrary variants so Tailwind still emits them.
 */
export function Prose({ size = 'base', className, ...rest }: ProseProps) {
  return (
    <div
      className={cn(
        SIZE[size],
        'max-w-prose text-fg',
        '[&_p]:my-4 [&_p]:leading-7',
        '[&_a]:font-medium [&_a]:text-brand-600 [&_a]:underline [&_a]:underline-offset-4',
        '[&_h2]:mt-10 [&_h2]:mb-3 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:tracking-tight',
        '[&_h3]:mt-8 [&_h3]:mb-2 [&_h3]:text-xl [&_h3]:font-semibold',
        '[&_ul]:my-4 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:my-4 [&_ol]:list-decimal [&_ol]:pl-6',
        '[&_li]:my-1 [&_strong]:font-semibold',
        '[&_code]:rounded-sm [&_code]:border [&_code]:border-border [&_code]:bg-surface-sunken [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-[0.85em]',
        '[&_pre]:my-4 [&_pre]:overflow-auto [&_pre]:rounded-lg [&_pre]:border [&_pre]:border-border [&_pre]:bg-surface-sunken [&_pre]:p-4',
        '[&_pre_code]:border-0 [&_pre_code]:bg-transparent [&_pre_code]:p-0',
        '[&_blockquote]:my-4 [&_blockquote]:border-l-2 [&_blockquote]:border-brand-500 [&_blockquote]:pl-4 [&_blockquote]:italic',
        '[&_hr]:my-8 [&_hr]:border-border',
        '[&_img]:my-6 [&_img]:rounded-lg',
        className,
      )}
      {...rest}
    />
  );
}
