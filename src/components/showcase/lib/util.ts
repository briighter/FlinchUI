/**
 * Static, Tailwind-visible sizing helpers for the showcase apps.
 *
 * Dynamic geometry normally means inline styles, which the design system bans so
 * that Tailwind can see every class it must emit. These maps trade arbitrary
 * widths and heights for a fixed set of literal utilities — enough resolution
 * for depth bars, meters, and heat columns without a single inline style.
 */

const WIDTH_STEPS = [
  'w-0',
  'w-[5%]',
  'w-[10%]',
  'w-[15%]',
  'w-[20%]',
  'w-[25%]',
  'w-[30%]',
  'w-[35%]',
  'w-[40%]',
  'w-[45%]',
  'w-[50%]',
  'w-[55%]',
  'w-[60%]',
  'w-[65%]',
  'w-[70%]',
  'w-[75%]',
  'w-[80%]',
  'w-[85%]',
  'w-[90%]',
  'w-[95%]',
  'w-full',
] as const;

const HEIGHT_STEPS = [
  'h-0',
  'h-[5%]',
  'h-[10%]',
  'h-[15%]',
  'h-[20%]',
  'h-[25%]',
  'h-[30%]',
  'h-[35%]',
  'h-[40%]',
  'h-[45%]',
  'h-[50%]',
  'h-[55%]',
  'h-[60%]',
  'h-[65%]',
  'h-[70%]',
  'h-[75%]',
  'h-[80%]',
  'h-[85%]',
  'h-[90%]',
  'h-[95%]',
  'h-full',
] as const;

const clamp01 = (value: number) => Math.max(0, Math.min(1, Number.isFinite(value) ? value : 0));
const lastIndex = WIDTH_STEPS.length - 1;

/** A literal `w-*` class for a 0–1 ratio, quantised to 5% steps. */
export function widthStep(ratio: number): string {
  return WIDTH_STEPS[Math.round(clamp01(ratio) * lastIndex)]!;
}

/** A literal `h-*` class for a 0–1 ratio, quantised to 5% steps. */
export function heightStep(ratio: number): string {
  return HEIGHT_STEPS[Math.round(clamp01(ratio) * lastIndex)]!;
}

/** Format a number as a 32nds price, e.g. `110-21½`. */
export function formatThirtySeconds(value: number): string {
  let whole = Math.floor(value);
  let ticks = Math.round((value - whole) * 64) / 2;
  if (ticks >= 32) {
    whole += 1;
    ticks -= 32;
  }
  const base = String(Math.floor(ticks)).padStart(2, '0');
  return ticks % 1 === 0 ? `${whole}-${base}` : `${whole}-${base}½`;
}

/** Format a tick delta with an explicit sign, e.g. `−2½`. */
export function formatTicks(value: number, digits = 1): string {
  if (value === 0) return '0';
  const sign = value > 0 ? '+' : '−';
  const magnitude = Math.abs(value);
  return magnitude % 1 === 0
    ? `${sign}${magnitude}`
    : `${sign}${magnitude.toFixed(digits).replace(/0$/, '')}`;
}
