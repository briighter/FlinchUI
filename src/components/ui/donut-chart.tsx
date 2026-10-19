import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CHART_SERIES_TONES, CHART_TONE, type ChartTone } from './chart-shared';

export interface DonutSlice {
  label: string;
  value: number;
  tone?: ChartTone;
}

export interface DonutChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  data: DonutSlice[];
  /** Diameter in pixels. */
  size?: number;
  thickness?: number;
  /** Large figure in the middle of the ring. */
  centerValue?: ReactNode;
  centerLabel?: ReactNode;
  valueFormat?: (value: number) => string;
  showLegend?: boolean;
  label?: string;
}

/** DonutChart — a part-to-whole ring with an optional centre readout. */
export function DonutChart({
  data,
  size = 168,
  thickness = 22,
  centerValue,
  centerLabel,
  valueFormat = (value) => String(value),
  showLegend = true,
  label,
  className,
  ...rest
}: DonutChartProps) {
  const total = data.reduce((sum, slice) => sum + slice.value, 0) || 1;
  const radius = (size - thickness) / 2;
  const center = size / 2;
  const circumference = 2 * Math.PI * radius;
  const gap = data.length > 1 ? 2.5 : 0;

  let offset = 0;

  return (
    <div className={cn('flex items-center gap-6', className)} {...rest}>
      <div className="relative shrink-0">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role={label ? 'img' : 'presentation'} aria-label={label} aria-hidden={label ? undefined : true}>
          <g transform={`rotate(-90 ${center} ${center})`}>
            <circle cx={center} cy={center} r={radius} fill="none" stroke="var(--color-border)" strokeWidth={thickness} />
            {data.map((slice, index) => {
              const fraction = slice.value / total;
              const length = Math.max(0, fraction * circumference - gap);
              const dashOffset = -offset;
              offset += fraction * circumference;
              return (
                <circle
                  key={slice.label}
                  cx={center}
                  cy={center}
                  r={radius}
                  fill="none"
                  stroke={CHART_TONE[slice.tone ?? CHART_SERIES_TONES[index % CHART_SERIES_TONES.length]!]}
                  strokeWidth={thickness}
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={dashOffset}
                />
              );
            })}
          </g>
        </svg>

        {centerValue !== undefined || centerLabel !== undefined ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-2xl font-bold tabular-nums text-fg">{centerValue}</span>
            {centerLabel ? <span className="mt-0.5 text-xs text-fg-subtle">{centerLabel}</span> : null}
          </div>
        ) : null}
      </div>

      {showLegend ? (
        <ul className="flex min-w-0 flex-1 flex-col gap-2.5">
          {data.map((slice, index) => (
            <li key={slice.label} className="flex items-center gap-2.5 text-sm">
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10" className="shrink-0">
                <circle cx="5" cy="5" r="4" fill={CHART_TONE[slice.tone ?? CHART_SERIES_TONES[index % CHART_SERIES_TONES.length]!]} />
              </svg>
              <span className="min-w-0 flex-1 truncate text-fg-muted">{slice.label}</span>
              <span className="font-medium tabular-nums text-fg">{valueFormat(slice.value)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
