import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

export type ProgressTone = 'brand' | 'success' | 'warning' | 'danger' | 'info';

const TRACK_HEIGHT = {
  sm: 'h-1',
  md: 'h-2',
  lg: 'h-3',
} as const;

const FILL: Record<ProgressTone, string> = {
  brand: 'bg-brand-600',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

export interface ProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: keyof typeof TRACK_HEIGHT;
  tone?: ProgressTone;
  /** Show a percentage label to the right of the bar. */
  showValue?: boolean;
  label?: string;
  indeterminate?: boolean;
}

/** Progress — a determinate or indeterminate progress bar. */
export function Progress({
  value = 0,
  max = 100,
  size = 'md',
  tone = 'brand',
  showValue = false,
  label,
  indeterminate = false,
  className,
  ...rest
}: ProgressProps) {
  const percent = Math.round(Math.min(100, Math.max(0, (value / max) * 100)));

  return (
    <div className={cn('flex w-full items-center gap-3', className)} {...rest}>
      <div
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={max}
        aria-valuenow={indeterminate ? undefined : value}
        aria-label={label}
        className={cn('relative w-full overflow-hidden rounded-full bg-surface-sunken', TRACK_HEIGHT[size])}
      >
        <div
          className={cn(
            'h-full rounded-full transition-[width] duration-300',
            FILL[tone],
            indeterminate && 'w-1/3 animate-[progress-indeterminate_1.4s_ease-in-out_infinite]',
          )}
          style={indeterminate ? undefined : { width: `${percent}%` }}
        />
      </div>
      {showValue && !indeterminate ? (
        <span className="w-10 shrink-0 text-right text-xs font-medium tabular-nums text-fg-muted">
          {percent}%
        </span>
      ) : null}
    </div>
  );
}

export interface CircularProgressProps extends HTMLAttributes<HTMLDivElement> {
  value?: number;
  max?: number;
  size?: number;
  thickness?: number;
  tone?: ProgressTone;
  showValue?: boolean;
  label?: string;
}

const STROKE: Record<ProgressTone, string> = {
  brand: 'stroke-brand-600',
  success: 'stroke-success',
  warning: 'stroke-warning',
  danger: 'stroke-danger',
  info: 'stroke-info',
};

/** CircularProgress — an SVG ring indicator. */
export function CircularProgress({
  value = 0,
  max = 100,
  size = 48,
  thickness = 4,
  tone = 'brand',
  showValue = false,
  label,
  className,
  ...rest
}: CircularProgressProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  return (
    <div
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuenow={value}
      aria-label={label}
      className={cn('relative inline-flex items-center justify-center', className)}
      style={{ width: size, height: size }}
      {...rest}
    >
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          className="stroke-surface-sunken"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          strokeWidth={thickness}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('transition-[stroke-dashoffset] duration-300', STROKE[tone])}
        />
      </svg>
      {showValue ? (
        <span className="absolute text-xs font-semibold tabular-nums text-fg">{Math.round(percent)}%</span>
      ) : null}
    </div>
  );
}
