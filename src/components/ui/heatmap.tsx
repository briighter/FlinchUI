import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import type { ChartTone } from './chart-shared';

export interface HeatmapProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** `data[row][column]` — a rectangular matrix of values. */
  data: number[][];
  rowLabels: ReactNode[];
  columnLabels?: ReactNode[];
  tone?: ChartTone;
  valueFormat?: (value: number) => string;
  /** Cells below this value render as empty. */
  floor?: number;
  showLegend?: boolean;
  label?: string;
}

const STEPS: Record<Extract<ChartTone, 'brand' | 'info' | 'success' | 'danger'>, string[]> = {
  brand: [
    'bg-brand-500/10',
    'bg-brand-500/20',
    'bg-brand-500/30',
    'bg-brand-500/40',
    'bg-brand-500/55',
    'bg-brand-500/70',
    'bg-brand-500/85',
    'bg-brand-500',
  ],
  info: [
    'bg-info/10',
    'bg-info/20',
    'bg-info/30',
    'bg-info/40',
    'bg-info/55',
    'bg-info/70',
    'bg-info/85',
    'bg-info',
  ],
  success: [
    'bg-success/10',
    'bg-success/20',
    'bg-success/30',
    'bg-success/40',
    'bg-success/55',
    'bg-success/70',
    'bg-success/85',
    'bg-success',
  ],
  danger: [
    'bg-danger/10',
    'bg-danger/20',
    'bg-danger/30',
    'bg-danger/40',
    'bg-danger/55',
    'bg-danger/70',
    'bg-danger/85',
    'bg-danger',
  ],
};

/**
 * Heatmap — a rectangular value grid rendered as a tint matrix.
 *
 * Tints are opaque, themeable Tailwind classes rather than inline opacity, so
 * the grid re-themes with the page and stays free of runtime styling.
 */
export function Heatmap({
  data,
  rowLabels,
  columnLabels,
  tone = 'brand',
  valueFormat = (value) => String(value),
  floor = 0,
  showLegend = true,
  label,
  className,
  ...rest
}: HeatmapProps) {
  const steps = STEPS[tone as keyof typeof STEPS] ?? STEPS.brand;
  const flat = data.flat();
  const max = Math.max(...flat, 1);

  const stepFor = (value: number) => {
    if (value <= floor) return -1;
    const ratio = value / max;
    return Math.min(steps.length - 1, Math.max(0, Math.round(ratio * (steps.length - 1))));
  };

  return (
    <div className={cn('flex flex-col gap-2', className)} {...rest}>
      <div
        className="overflow-x-auto"
        role={label ? 'img' : undefined}
        aria-label={label}
      >
        <div className="flex min-w-max flex-col gap-1">
          {columnLabels ? (
            <div className="flex gap-1 pl-24">
              {columnLabels.map((column, index) => (
                <div key={index} className="flex-1 text-center text-[10px] font-medium text-fg-subtle">
                  {column}
                </div>
              ))}
            </div>
          ) : null}

          {data.map((row, rowIndex) => (
            <div key={rowIndex} className="flex items-center gap-1">
              <div className="w-24 shrink-0 truncate pr-2 text-xs text-fg-muted">
                {rowLabels[rowIndex]}
              </div>
              {row.map((value, columnIndex) => {
                const step = stepFor(value);
                return (
                  <div
                    key={columnIndex}
                    className={cn(
                      'flex h-8 flex-1 items-center justify-center rounded-sm text-[11px] font-medium tabular-nums',
                      step < 0 ? 'bg-surface-sunken text-fg-subtle' : steps[step],
                      step >= 5 ? 'text-fg-on-brand' : 'text-fg',
                    )}
                  >
                    {step < 0 ? '' : valueFormat(value)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {showLegend ? (
        <div className="flex items-center gap-2 pl-24 text-[10px] text-fg-subtle">
          <span>{valueFormat(floor)}</span>
          {steps.map((stepClass) => (
            <span key={stepClass} className={cn('h-2.5 w-6 rounded-xs', stepClass)} />
          ))}
          <span>{valueFormat(max)}</span>
        </div>
      ) : null}
    </div>
  );
}
