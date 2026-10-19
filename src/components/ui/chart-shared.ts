/**
 * Shared chart geometry and colour helpers.
 *
 * Charts paint with `var(--color-*)` references rather than fixed colours, so a
 * chart re-themes with the rest of the page and inside any `[data-theme]`
 * subtree — no JavaScript, no re-render.
 */

export const CHART_TONE = {
  brand: 'var(--color-brand-500)',
  success: 'var(--color-success)',
  warning: 'var(--color-warning)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
  neutral: 'var(--color-neutral-400)',
} as const;

export type ChartTone = keyof typeof CHART_TONE;

/** Soft companion colour for areas and backgrounds. */
export const CHART_TONE_SOFT: Record<ChartTone, string> = {
  brand: 'var(--color-brand-100)',
  success: 'var(--color-success-subtle)',
  warning: 'var(--color-warning-subtle)',
  danger: 'var(--color-danger-subtle)',
  info: 'var(--color-info-subtle)',
  neutral: 'var(--color-neutral-100)',
};

/** Categorical order for series that do not declare a tone. */
export const CHART_SERIES_TONES: ChartTone[] = ['brand', 'info', 'success', 'warning', 'danger', 'neutral'];

export const CHART_AXIS = 'var(--color-border-strong)';
export const CHART_GRID = 'var(--color-border)';
export const CHART_LABEL = 'var(--color-fg-subtle)';

const TONE_ORDER = CHART_SERIES_TONES;

export function toneFor(index: number, explicit?: ChartTone): string {
  return CHART_TONE[explicit ?? TONE_ORDER[index % TONE_ORDER.length]!];
}

/** Map a value from one range to another. */
export function scaleLinear(domain: [number, number], range: [number, number]) {
  const [d0, d1] = domain;
  const [r0, r1] = range;
  const span = d1 - d0 || 1;
  return (value: number) => r0 + ((value - d0) / span) * (r1 - r0);
}

export function extent(values: number[]): [number, number] {
  let min = Number.POSITIVE_INFINITY;
  let max = Number.NEGATIVE_INFINITY;
  for (const value of values) {
    if (value < min) min = value;
    if (value > max) max = value;
  }
  if (!Number.isFinite(min) || !Number.isFinite(max)) return [0, 1];
  return [min, max];
}

/** Extent padded so the line never touches the frame, with a non-zero span. */
export function paddedExtent(values: number[], pad = 0.1): [number, number] {
  const [min, max] = extent(values);
  if (min === max) return [min - 1, max + 1];
  const padding = (max - min) * pad;
  return [min - padding, max + padding];
}

/** Human-friendly axis ticks covering [min, max]. */
export function niceTicks(min: number, max: number, count = 4): number[] {
  if (min === max) return [min];
  const span = max - min;
  const rough = span / count;
  const magnitude = Math.pow(10, Math.floor(Math.log10(rough)));
  const error = rough / magnitude;
  const step = (error >= 7.5 ? 10 : error >= 3.5 ? 5 : error >= 1.5 ? 2 : 1) * magnitude;
  const start = Math.ceil(min / step) * step;
  const ticks: number[] = [];
  for (let value = start; value <= max + step * 1e-6; value += step) {
    ticks.push(Number(value.toFixed(10)));
  }
  return ticks;
}

export type Point = [number, number];

/** A smooth (flat-tangent) or straight polyline as an SVG path. */
export function linePath(points: Point[], smooth = true): string {
  if (points.length === 0) return '';
  const [first, ...rest] = points;
  if (rest.length === 0) return `M ${first![0]} ${first![1]}`;
  if (!smooth) {
    return points.map((point, index) => `${index === 0 ? 'M' : 'L'} ${point[0]} ${point[1]}`).join(' ');
  }
  let path = `M ${first![0]} ${first![1]}`;
  for (let index = 0; index < points.length - 1; index += 1) {
    const [x0, y0] = points[index]!;
    const [x1, y1] = points[index + 1]!;
    const mid = (x0 + x1) / 2;
    path += ` C ${mid} ${y0} ${mid} ${y1} ${x1} ${y1}`;
  }
  return path;
}

/** Close a line path down to a baseline to make an area. */
export function areaPath(points: Point[], baseline: number, smooth = true): string {
  if (points.length === 0) return '';
  const top = linePath(points, smooth);
  const last = points[points.length - 1]!;
  const first = points[0]!;
  return `${top} L ${last[0]} ${baseline} L ${first[0]} ${baseline} Z`;
}

/** SVG path for a donut segment. Angles in radians, clockwise from 12 o'clock. */
export function donutArc(
  cx: number,
  cy: number,
  radius: number,
  thickness: number,
  startAngle: number,
  endAngle: number,
): string {
  const outer = radius;
  const inner = Math.max(0, radius - thickness);
  const largeArc = endAngle - startAngle > Math.PI ? 1 : 0;

  const point = (r: number, angle: number): Point => [
    cx + r * Math.sin(angle),
    cy - r * Math.cos(angle),
  ];

  const [ox0, oy0] = point(outer, startAngle);
  const [ox1, oy1] = point(outer, endAngle);
  const [ix1, iy1] = point(inner, endAngle);
  const [ix0, iy0] = point(inner, startAngle);

  return [
    `M ${ox0} ${oy0}`,
    `A ${outer} ${outer} 0 ${largeArc} 1 ${ox1} ${oy1}`,
    `L ${ix1} ${iy1}`,
    `A ${inner} ${inner} 0 ${largeArc} 0 ${ix0} ${iy0}`,
    'Z',
  ].join(' ');
}
