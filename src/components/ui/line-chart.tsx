'use client';

import { useId } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { useMeasure } from '@/lib/hooks/use-measure';
import {
  CHART_AXIS,
  CHART_GRID,
  CHART_LABEL,
  CHART_TONE,
  areaPath,
  linePath,
  niceTicks,
  paddedExtent,
  scaleLinear,
  toneFor,
  type ChartTone,
  type Point,
} from './chart-shared';

export interface LineChartSeries {
  name: string;
  data: number[];
  tone?: ChartTone;
  dashed?: boolean;
}

export interface LineChartProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  series: LineChartSeries[];
  labels: string[];
  /** Plot height in pixels. */
  height?: number;
  /** Fill under the first series. */
  area?: boolean;
  showGrid?: boolean;
  showLegend?: boolean;
  yTicks?: number;
  valueFormat?: (value: number) => string;
  label?: string;
}

/** LineChart — one or more time series on a shared, padded value axis. */
export function LineChart({
  series,
  labels,
  height = 220,
  area = false,
  showGrid = true,
  showLegend = true,
  yTicks = 4,
  valueFormat = (value) => String(value),
  label,
  className,
  ...rest
}: LineChartProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const gradientId = useId();

  const w = width || 1;
  const margin = { top: 12, right: 12, bottom: 26, left: 48 };
  const innerWidth = Math.max(1, w - margin.left - margin.right);
  const innerHeight = Math.max(1, height - margin.top - margin.bottom);

  const all = series.flatMap((entry) => entry.data);
  const domain = paddedExtent(all, 0.12);
  const yScale = scaleLinear(domain, [innerHeight, 0]);
  const ticks = niceTicks(domain[0], domain[1], yTicks);

  const count = Math.max(...series.map((entry) => entry.data.length), 1);
  const xAt = (index: number) => (count === 1 ? innerWidth / 2 : (index / (count - 1)) * innerWidth);

  const maxLabels = Math.max(2, Math.floor(innerWidth / 72));
  const labelStep = Math.ceil(labels.length / maxLabels);

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
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={CHART_TONE[series[0]?.tone ?? 'brand']} stopOpacity="0.22" />
            <stop offset="100%" stopColor={CHART_TONE[series[0]?.tone ?? 'brand']} stopOpacity="0" />
          </linearGradient>
        </defs>

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

          <line
            x1={0}
            x2={innerWidth}
            y1={innerHeight}
            y2={innerHeight}
            stroke={CHART_AXIS}
            strokeWidth={1}
            vectorEffect="non-scaling-stroke"
          />

          {series.map((entry, seriesIndex) => {
            const color = toneFor(seriesIndex, entry.tone);
            const points: Point[] = entry.data.map((value, index) => [xAt(index), yScale(value)]);
            return (
              <g key={entry.name}>
                {area && seriesIndex === 0 ? (
                  <path d={areaPath(points, innerHeight)} fill={`url(#${gradientId})`} stroke="none" />
                ) : null}
                <path
                  d={linePath(points)}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeDasharray={entry.dashed ? '5 4' : undefined}
                  vectorEffect="non-scaling-stroke"
                />
                {seriesIndex === 0 && points.length > 0
                  ? (() => {
                      const last = points[points.length - 1]!;
                      return <circle cx={last[0]} cy={last[1]} r={3} fill={color} />;
                    })()
                  : null}
              </g>
            );
          })}

          {labels.map((text, index) =>
            index % labelStep === 0 ? (
              <text
                key={`x-${text}-${index}`}
                x={xAt(index)}
                y={innerHeight + 18}
                textAnchor={index === 0 ? 'start' : index >= labels.length - 1 ? 'end' : 'middle'}
                fontSize={11}
                fill={CHART_LABEL}
              >
                {text}
              </text>
            ) : null,
          )}
        </g>
      </svg>

      {showLegend && series.length > 1 ? (
        <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
          {series.map((entry, index) => (
            <li key={entry.name} className="flex items-center gap-2 text-xs text-fg-muted">
              <svg aria-hidden="true" width="10" height="10" viewBox="0 0 10 10">
                <circle cx="5" cy="5" r="4" fill={toneFor(index, entry.tone)} />
              </svg>
              {entry.name}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
