'use client';

import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { useMeasure } from '@/lib/hooks/use-measure';
import {
  CHART_AXIS,
  CHART_GRID,
  CHART_LABEL,
  extent,
  niceTicks,
  scaleLinear,
  toneFor,
  type ChartTone,
} from './chart-shared';

export interface BarChartSeries {
  name: string;
  data: number[];
  tone?: ChartTone;
}

export interface BarChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  labels: string[];
  series: BarChartSeries[];
  height?: number;
  /** Stack the series in one bar per label instead of grouping them. */
  stacked?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  yTicks?: number;
  valueFormat?: (value: number) => string;
  label?: string;
}

/** BarChart — grouped or stacked bars on a shared value axis. */
export function BarChart({
  labels,
  series,
  height = 220,
  stacked = false,
  showGrid = true,
  showLegend = true,
  yTicks = 4,
  valueFormat = (value) => String(value),
  label,
  className,
  ...rest
}: BarChartProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>();

  const w = width || 1;
  const margin = { top: 12, right: 12, bottom: 26, left: 48 };
  const innerWidth = Math.max(1, w - margin.left - margin.right);
  const innerHeight = Math.max(1, height - margin.top - margin.bottom);

  const totals = labels.map((_, index) =>
    stacked ? series.reduce((sum, entry) => sum + (entry.data[index] ?? 0), 0) : 0,
  );
  const flat = series.flatMap((entry) => entry.data);
  const max = Math.max(extent(flat)[1], extent(totals)[1], 1);
  const ticks = niceTicks(0, max, yTicks);
  const top = ticks[ticks.length - 1] ?? max;
  const yScale = scaleLinear([0, top], [innerHeight, 0]);

  const band = innerWidth / Math.max(labels.length, 1);
  const groupWidth = band * 0.62;
  const barWidth = stacked ? groupWidth : groupWidth / Math.max(series.length, 1);

  return (
    <div ref={ref} className={cn('w-full', className)} {...rest}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${w} ${height}`}
        role={label ? 'img' : 'presentation'}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        <g transform={`translate(${margin.left} ${margin.top})`}>
          {showGrid
            ? ticks.map((tick) => (
                <line
                  key={`grid-${tick}`}
                  x1={0}
                  x2={innerWidth}
                  y1={yScale(tick)}
                  y2={yScale(tick)}
                  stroke={CHART_GRID}
                  strokeWidth={1}
                  vectorEffect="non-scaling-stroke"
                />
              ))
            : null}

          {ticks.map((tick) => (
            <text
              key={`label-${tick}`}
              x={-10}
              y={yScale(tick)}
              textAnchor="end"
              dominantBaseline="middle"
              fontSize={11}
              fill={CHART_LABEL}
            >
              {valueFormat(tick)}
            </text>
          ))}

          {labels.map((text, labelIndex) => {
            const bandStart = labelIndex * band + (band - groupWidth) / 2;
            let stackTop = innerHeight;

            return (
              <g key={`${text}-${labelIndex}`}>
                {series.map((entry, seriesIndex) => {
                  const value = entry.data[labelIndex] ?? 0;
                  const barHeight = Math.max(0, innerHeight - yScale(value));
                  const color = toneFor(seriesIndex, entry.tone);
                  const x = stacked
                    ? bandStart
                    : bandStart + seriesIndex * barWidth;
                  const y = stacked ? stackTop - barHeight : yScale(value);
                  if (stacked) stackTop -= barHeight;

                  if (barHeight <= 0) return null;

                  return (
                    <rect
                      key={entry.name}
                      x={x + (stacked ? 0 : 1)}
                      y={y}
                      width={Math.max(1, barWidth - (stacked ? 0 : 2))}
                      height={barHeight}
                      rx={2}
                      fill={color}
                    />
                  );
                })}
                <text
                  x={bandStart + groupWidth / 2}
                  y={innerHeight + 18}
                  textAnchor="middle"
                  fontSize={11}
                  fill={CHART_LABEL}
                >
                  {text}
                </text>
              </g>
            );
          })}

          <line
            x1={0}
            x2={innerWidth}
            y1={innerHeight}
            y2={innerHeight}
            stroke={CHART_AXIS}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>

      {showLegend && series.length > 1 ? (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {series.map((entry, index) => (
            <li key={entry.name} className="flex items-center gap-2 text-xs text-fg-muted">
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10">
                <rect width="10" height="10" rx="2" fill={toneFor(index, entry.tone)} />
              </svg>
              {entry.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
