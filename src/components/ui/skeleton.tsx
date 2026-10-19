import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export interface SkeletonProps extends HTMLAttributes<HTMLDivElement> {
  width?: string;
  height?: string;
  radius?: 'sm' | 'md' | 'lg' | 'full';
  /** Animate as a shimmer or a subtle pulse. */
  animation?: 'pulse' | 'shimmer' | 'none';
}

const RADIUS = {
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  full: 'rounded-full',
} as const;

/** Skeleton — a placeholder for content that is still loading. */
export function Skeleton({
  width,
  height,
  radius = 'md',
  animation = 'pulse',
  className,
  style,
  ...rest
}: SkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'block bg-surface-sunken',
        RADIUS[radius],
        animation === 'pulse' && 'animate-pulse',
        animation === 'shimmer' &&
          'bg-[linear-gradient(90deg,var(--color-surface-sunken),var(--color-border),var(--color-surface-sunken))] bg-[length:200%_100%] animate-shimmer',
        className,
      )}
      style={{ width, height, ...style }}
      {...rest}
    />
  );
}
