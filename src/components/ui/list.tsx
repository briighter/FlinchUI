import type { HTMLAttributes, LiHTMLAttributes, OlHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface ListProps extends HTMLAttributes<HTMLUListElement> {
  variant?: 'unordered' | 'ordered' | 'none' | 'divided';
  size?: 'sm' | 'md';
}

/** List — ordered/unordered list with spacing presets. */
export function List({
  variant = 'unordered',
  size = 'md',
  className,
  children,
  ...rest
}: ListProps) {
  const Comp = variant === 'ordered' ? 'ol' : 'ul';

  const marker =
    variant === 'unordered'
      ? 'list-disc pl-5 marker:text-fg-subtle'
      : variant === 'ordered'
        ? 'list-decimal pl-5 marker:text-fg-subtle'
        : 'list-none';

  return (
    <Comp
      className={cn(
        'text-fg',
        marker,
        size === 'sm' ? 'space-y-1 text-sm' : 'space-y-2 text-base',
        variant === 'divided' && 'divide-y divide-border',
        variant === 'divided' && 'list-none',
        className,
      )}
      {...(rest as OlHTMLAttributes<HTMLOListElement>)}
    >
      {children}
    </Comp>
  );
}

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement> {
  icon?: ReactNode;
  divided?: boolean;
}

/** ListItem — a list entry, optionally with a leading icon. */
export function ListItem({ icon, divided = false, className, children, ...rest }: ListItemProps) {
  if (icon) {
    return (
      <li className={cn('flex items-start gap-2', className)} {...rest}>
        <span aria-hidden="true" className="mt-1 shrink-0 text-brand-600">
          {icon}
        </span>
        <span className="min-w-0">{children}</span>
      </li>
    );
  }

  return (
    <li className={cn(divided && 'py-2', className)} {...rest}>
      {children}
    </li>
  );
}
