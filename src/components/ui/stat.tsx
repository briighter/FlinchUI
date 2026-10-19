import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export type Trend = 'up' | 'down' | 'flat';

const TREND_TONE: Record<Trend, string> = {
  up: 'text-success-fg',
  down: 'text-danger-fg',
  flat: 'text-fg-muted',
};

export interface StatProps extends HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  value: ReactNode;
  unit?: ReactNode;
  /** e.g. `"+12.5%"`. */
  delta?: ReactNode;
  trend?: Trend;
  icon?: ReactNode;
  hint?: ReactNode;
}

/** Stat — a single headline metric with an optional delta indicator. */
export function Stat({
  label,
  value,
  unit,
  delta,
  trend = 'flat',
  icon,
  hint,
  className,
  ...rest
}: StatProps) {
  return (
    <div className={cn('flex flex-col gap-1', className)} {...rest}>
      <div className="flex items-center gap-2 text-sm font-medium text-fg-muted">
        {icon ? (
          <span aria-hidden="true" className="[&_svg]:size-4">
            {icon}
          </span>
        ) : null}
        {label}
      </div>
      <div className="flex items-baseline gap-2">
        <span className="text-3xl font-bold tracking-tight text-fg tabular-nums">{value}</span>
        {unit ? <span className="text-sm font-medium text-fg-subtle">{unit}</span> : null}
        {delta ? (
          <span className={cn('text-sm font-semibold tabular-nums', TREND_TONE[trend])}>{delta}</span>
        ) : null}
      </div>
      {hint ? <p className="text-xs text-fg-subtle">{hint}</p> : null}
    </div>
  );
}
