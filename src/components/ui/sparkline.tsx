'use client';

import { useId } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { useMeasure } from '@/lib/hooks/use-measure';
import { CHART_TONE, areaPath, extent, linePath, type ChartTone, type Point } from './chart-shared';

export interface SparklineProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  data: number[];
  tone?: ChartTone;
  /** Fill the area under the line. */
  area?: boolean;
  /** Height in pixels. */
  height?: number;
  strokeWidth?: number;
  /** Draw a dot on the final value. */
  marker?: boolean;
  /** Accessible description; the chart is decorative when omitted. */
  label?: string;
}

/**
 * Sparkline — a compact trend line for table cells, KPI tiles, and rails.
 * Dependency-free SVG sized to its container.
 */
export function Sparkline({
  data,
  tone = 'brand',
  area = false,
  height = 32,
  strokeWidth = 1.5,
  marker = false,
  label,
  className,
  ...rest
}: SparklineProps) {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const gradientId = useId();
  const color = CHART_TONE[tone];

  const w = width || 1;
  const pad = strokeWidth;
  const innerHeight = Math.max(1, height - pad * 2);
  const [min, max] = extent(data);
  const span = max - min || 1;

  const points: Point[] = data.map((value, index) => [
    data.length === 1 ? w / 2 : (index / (data.length - 1)) * w,
    pad + innerHeight - ((value - min) / span) * innerHeight,
  ]);

  const last = points[points.length - 1];
  const path = linePath(points);
  const fill = areaPath(points, height);

  return (
    <div ref={ref} className={cn('relative w-full', className)} {...rest}>
      <svg
        width="100%"
        height={height}
        viewBox={`0 0 ${w} ${height}`}
        preserveAspectRatio="none"
        role={label ? 'img' : 'presentation'}
        aria-label={label}
        aria-hidden={label ? undefined : true}
      >
        {area ? (
          <>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={color} stopOpacity="0.28" />
                <stop offset="100%" stopColor={color} stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={fill} fill={`url(#${gradientId})`} stroke="none" />
          </>
        ) : null}
        <path
          d={path}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          vectorEffect="non-scaling-stroke"
        />
        {marker && last ? <circle cx={last[0]} cy={last[1]} r={strokeWidth * 1.6} fill={color} /> : null}
      </svg>
    </div>
  );
}
