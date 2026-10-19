import type { HTMLAttributes, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const SIZE: Record<AvatarSize, string> = {
  xs: 'size-6 text-[10px]',
  sm: 'size-8 text-xs',
  md: 'size-10 text-sm',
  lg: 'size-12 text-base',
  xl: 'size-16 text-lg',
};

export type AvatarStatus = 'online' | 'offline' | 'busy' | 'away';

const STATUS: Record<AvatarStatus, string> = {
  online: 'bg-success',
  offline: 'bg-fg-subtle',
  busy: 'bg-danger',
  away: 'bg-warning',
};

export interface AvatarProps extends HTMLAttributes<HTMLSpanElement> {
  src?: string;
  alt?: string;
  name?: string;
  size?: AvatarSize;
  status?: AvatarStatus;
  imgProps?: ImgHTMLAttributes<HTMLImageElement>;
}

/** Derive up to two uppercase initials from a display name. */
export function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0]!.slice(0, 2).toUpperCase();
  return (parts[0]![0]! + parts[parts.length - 1]![0]!).toUpperCase();
}

/** Avatar — image with an initials fallback and an optional presence dot. */
export function Avatar({ src, alt, name, size = 'md', status, className, imgProps, ...rest }: AvatarProps) {
  const initials = name ? getInitials(name) : null;

  return (
    <span className={cn('relative inline-flex shrink-0', className)} {...rest}>
      <span
        className={cn(
          'inline-flex items-center justify-center overflow-hidden rounded-full bg-surface-sunken font-semibold text-fg-muted select-none',
          SIZE[size],
        )}
      >
        {src ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={src}
            alt={alt ?? name ?? ''}
            className="size-full object-cover"
            {...imgProps}
          />
        ) : initials ? (
          initials
        ) : (
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-2/3 opacity-40">
            <path d="M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0 2c-4.42 0-8 2.24-8 5v1h16v-1c0-2.76-3.58-5-8-5Z" />
          </svg>
        )}
      </span>
      {status ? (
        <span
          aria-label={status}
          className={cn(
            'absolute -right-0 -bottom-0 size-1/4 min-h-2 min-w-2 rounded-full ring-2 ring-surface',
            STATUS[status],
          )}
        />
      ) : null}
    </span>
  );
}

export interface AvatarGroupProps extends HTMLAttributes<HTMLDivElement> {
  size?: AvatarSize;
  max?: number;
  spacing?: 'tight' | 'normal';
}

/** AvatarGroup — overlapping avatars with an overflow counter. */
export function AvatarGroup({
  size = 'md',
  max = 4,
  spacing = 'normal',
  className,
  children,
  ...rest
}: AvatarGroupProps) {
  const items = Array.isArray(children) ? children.filter(Boolean) : [children];
  const visible = items.slice(0, max);
  const overflow = items.length - visible.length;

  return (
    <div
      className={cn(
        'flex items-center',
        spacing === 'tight' ? '-space-x-2' : '-space-x-3',
        className,
      )}
      {...rest}
    >
      {visible.map((child, index) => (
        <span key={index} className="ring-2 ring-surface rounded-full">
          {child}
        </span>
      ))}
      {overflow > 0 ? (
        <span
          className={cn(
            'inline-flex items-center justify-center rounded-full bg-surface-sunken font-semibold text-fg-muted ring-2 ring-surface',
            SIZE[size],
          )}
        >
          +{overflow}
        </span>
      ) : null}
    </div>
  );
}
