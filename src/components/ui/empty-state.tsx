import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface EmptyStateProps extends HTMLAttributes<HTMLDivElement> {
  icon?: ReactNode;
  title: string;
  description?: ReactNode;
  action?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
}

const SIZE = {
  sm: 'gap-2 p-6',
  md: 'gap-3 p-10',
  lg: 'gap-4 p-16',
} as const;

/** EmptyState — the "nothing here yet" placeholder with an optional action. */
export function EmptyState({
  icon,
  title,
  description,
  action,
  size = 'md',
  className,
  children,
  ...rest
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center rounded-lg border border-dashed border-border text-center',
        SIZE[size],
        className,
      )}
      {...rest}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex size-11 items-center justify-center rounded-full bg-surface-sunken text-fg-subtle [&_svg]:size-5"
        >
          {icon}
        </span>
      ) : null}
      <p className="text-base font-semibold text-fg">{title}</p>
      {description ? <p className="max-w-sm text-sm text-fg-muted">{description}</p> : null}
      {children}
      {action ? <div className="mt-2">{action}</div> : null}
    </div>
  );
}
