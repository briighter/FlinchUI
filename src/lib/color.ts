/**
 * OKLCH colour maths for the Prism theme generator.
 *
 * The generator writes real `oklch(...)` values, so it can also compute real
 * contrast ratios: OKLCH → OKLab → linear sRGB → relative luminance. That makes
 * the accessibility audit in the app an actual measurement rather than a
 * decorative badge.
 */

export interface Oklch {
  /** Perceptual lightness, 0–1. */
  l: number;
  /** Chroma, 0–~0.4. */
  c: number;
  /** Hue angle in degrees. */
  h: number;
  /** Optional alpha, 0–1. */
  a?: number;
}

const round = (value: number, digits: number) => Number(value.toFixed(digits));

/** Serialise an OKLCH colour the way the design tokens are written. */
export function oklch(color: Oklch): string {
  const base = `oklch(${round(color.l, 3)} ${round(color.c, 4)} ${round(color.h, 1)}`;
  return color.a === undefined ? `${base})` : `${base} / ${round(color.a, 2)})`;
}

/** OKLCH → non-linear sRGB channels in 0–1. Values may fall outside the gamut. */
export function oklchToSrgb(color: Oklch): [number, number, number] {
  const radians = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(radians);
  const b = color.c * Math.sin(radians);

  const lp = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const mp = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const sp = color.l - 0.0894841775 * a - 1.291485548 * b;

  const l = lp * lp * lp;
  const m = mp * mp * mp;
  const s = sp * sp * sp;

  const linear: [number, number, number] = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];

  const encode = (value: number) =>
    value <= 0.0031308 ? 12.92 * value : 1.055 * Math.pow(Math.max(0, value), 1 / 2.4) - 0.055;

  return [encode(linear[0]), encode(linear[1]), encode(linear[2])];
}

/** Relative luminance (WCAG 2.1) from an OKLCH colour. */
export function relativeLuminance(color: Oklch): number {
  const radians = (color.h * Math.PI) / 180;
  const a = color.c * Math.cos(radians);
  const b = color.c * Math.sin(radians);

  const lp = color.l + 0.3963377774 * a + 0.2158037573 * b;
  const mp = color.l - 0.1055613458 * a - 0.0638541728 * b;
  const sp = color.l - 0.0894841775 * a - 1.291485548 * b;

  const l = lp * lp * lp;
  const m = mp * mp * mp;
  const s = sp * sp * sp;

  const clamp = (value: number) => Math.min(1, Math.max(0, value));

  const r = clamp(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s);
  const g = clamp(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s);
  const bl = clamp(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s);

  return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
}

/** WCAG contrast ratio between two colours, 1–21. */
export function contrastRatio(a: Oklch, b: Oklch): number {
  const la = relativeLuminance(a);
  const lb = relativeLuminance(b);
  const [hi, lo] = la > lb ? [la, lb] : [lb, la];
  return (hi + 0.05) / (lo + 0.05);
}

const hexChannel = (value: number) =>
  Math.round(Math.min(1, Math.max(0, value)) * 255)
    .toString(16)
    .padStart(2, '0');

/** sRGB hex for display, clipped into gamut. */
export function toHex(color: Oklch): string {
  const [r, g, b] = oklchToSrgb(color);
  return `#${hexChannel(r)}${hexChannel(g)}${hexChannel(b)}`.toUpperCase();
}

/** Whether light or dark text reads better on a given colour. */
export function readableOn(color: Oklch): 'light' | 'dark' {
  const light: Oklch = { l: 1, c: 0, h: color.h };
  const dark: Oklch = { l: 0, c: 0, h: color.h };
  return contrastRatio(color, light) >= contrastRatio(color, dark) ? 'light' : 'dark';
}

export interface ContrastVerdict {
  ratio: number;
  /** Normal body text. */
  aa: boolean;
  /** Large text and UI boundaries. */
  aaLarge: boolean;
  aaa: boolean;
}

export function verdict(ratio: number): ContrastVerdict {
  return {
    ratio,
    aa: ratio >= 4.5,
    aaLarge: ratio >= 3,
    aaa: ratio >= 7,
  };
}
