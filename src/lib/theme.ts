/**
 * Prism — theme generation.
 *
 * A FlinchUI theme is nothing but a block of CSS custom properties, so a theme
 * *generator* is a function from a handful of perceptual controls to that block.
 * Every value below is produced in OKLCH, which means lightness is perceptually
 * even across hues: amber at L 0.76 and blue at L 0.76 genuinely read the same.
 *
 * At the default controls (hue 265, chroma 1 in light mode) the generated block
 * reproduces the shipped light theme exactly.
 */

import { contrastRatio, oklch, verdict, type Oklch } from './color';

export type ThemeMode = 'light' | 'dark';

export interface ThemeControls {
  /** Brand hue angle, 0–360. */
  hue: number;
  /** Multiplier on the brand chroma profile; 1 is the shipped ramp. */
  chroma: number;
  /** Hue used for surfaces, borders, and text. */
  neutralHue: number;
  /** Peak chroma of the neutral ramp — 0 is pure grey, ~0.03 is noticeably warm. */
  neutralChroma: number;
  mode: ThemeMode;
  /** Multiplier on every radius token. */
  radius: number;
}

export const DEFAULT_CONTROLS: ThemeControls = {
  hue: 265,
  chroma: 1,
  neutralHue: 265,
  neutralChroma: 0.016,
  mode: 'light',
  radius: 1,
};

/** Reference neutral chroma, so `neutralChroma: 0.016` means "as shipped". */
const NEUTRAL_C_REF = 0.016;

/** `[step, lightness, chroma]` for the brand ramp, lifted from the shipped tokens. */
const BRAND_LIGHT: [number, number, number][] = [
  [50, 0.972, 0.014],
  [100, 0.936, 0.03],
  [200, 0.874, 0.06],
  [300, 0.796, 0.101],
  [400, 0.706, 0.151],
  [500, 0.62, 0.19],
  [600, 0.551, 0.201],
  [700, 0.483, 0.181],
  [800, 0.405, 0.152],
  [900, 0.332, 0.121],
  [950, 0.243, 0.09],
];

/**
 * The dark ramp. 50/100/500/600/700 are the shipped dark overrides; the rest are
 * interpolated so the ramp stays monotonic when a user pushes the hue or chroma.
 */
const BRAND_DARK: [number, number, number][] = [
  [50, 0.243, 0.09],
  [100, 0.332, 0.121],
  [200, 0.39, 0.14],
  [300, 0.47, 0.16],
  [400, 0.56, 0.165],
  [500, 0.68, 0.17],
  [600, 0.62, 0.19],
  [700, 0.706, 0.151],
  [800, 0.79, 0.13],
  [900, 0.87, 0.1],
  [950, 0.93, 0.06],
];

const NEUTRAL: [number, number, number][] = [
  [0, 1, 0],
  [50, 0.985, 0.003],
  [100, 0.965, 0.005],
  [200, 0.925, 0.007],
  [300, 0.872, 0.009],
  [400, 0.706, 0.014],
  [500, 0.554, 0.016],
  [600, 0.446, 0.016],
  [700, 0.372, 0.015],
  [800, 0.278, 0.013],
  [900, 0.208, 0.011],
  [950, 0.145, 0.009],
];

/** `name`: `[lightness, chroma, alpha]` per mode. */
const SEMANTIC: { name: string; light: [number, number, number?]; dark: [number, number, number?] }[] = [
  { name: 'bg', light: [0.988, 0.003], dark: [0.145, 0.009] },
  { name: 'surface', light: [1, 0], dark: [0.185, 0.011] },
  { name: 'surface-raised', light: [1, 0], dark: [0.23, 0.013] },
  { name: 'surface-sunken', light: [0.968, 0.005], dark: [0.12, 0.008] },
  { name: 'fg', light: [0.208, 0.011], dark: [0.965, 0.004] },
  { name: 'fg-muted', light: [0.446, 0.016], dark: [0.78, 0.01] },
  { name: 'fg-subtle', light: [0.554, 0.016], dark: [0.62, 0.014] },
  { name: 'fg-on-brand', light: [0.99, 0.005], dark: [0.145, 0.009] },
  { name: 'border', light: [0.925, 0.007], dark: [0.3, 0.014] },
  { name: 'border-strong', light: [0.872, 0.009], dark: [0.4, 0.016] },
  { name: 'overlay', light: [0.145, 0.009, 0.55], dark: [0.05, 0.005, 0.7] },
];

/**
 * Status hues are deliberately *not* derived from the seed. A red that drifts
 * with the brand is a red that stops meaning "danger".
 */
const STATUS: { name: string; base: [number, number, number]; subtle: [number, number, number]; fg: [number, number, number] }[] = [
  { name: 'success', base: [0.627, 0.164, 150], subtle: [0.955, 0.032, 150], fg: [0.448, 0.122, 150] },
  { name: 'warning', base: [0.76, 0.158, 76], subtle: [0.968, 0.045, 88], fg: [0.498, 0.115, 66] },
  { name: 'danger', base: [0.584, 0.222, 25], subtle: [0.951, 0.033, 22], fg: [0.472, 0.176, 25] },
  { name: 'info', base: [0.64, 0.15, 240], subtle: [0.957, 0.028, 240], fg: [0.47, 0.122, 245] },
];

const STATUS_DARK: Record<string, { subtle: [number, number, number]; fg: [number, number, number] }> = {
  success: { subtle: [0.29, 0.06, 150], fg: [0.84, 0.12, 150] },
  warning: { subtle: [0.32, 0.06, 80], fg: [0.88, 0.11, 88] },
  danger: { subtle: [0.3, 0.08, 25], fg: [0.84, 0.11, 25] },
  info: { subtle: [0.29, 0.06, 240], fg: [0.83, 0.1, 240] },
};

const RADIUS: [string, number][] = [
  ['xs', 0.25],
  ['sm', 0.375],
  ['md', 0.5],
  ['lg', 0.75],
  ['xl', 1],
  ['2xl', 1.5],
];

export const SEED_PRESETS: { name: string; hue: number; chroma: number }[] = [
  { name: 'Indigo', hue: 265, chroma: 1 },
  { name: 'Violet', hue: 300, chroma: 1.1 },
  { name: 'Teal', hue: 195, chroma: 0.95 },
  { name: 'Forest', hue: 150, chroma: 1.05 },
  { name: 'Amber', hue: 80, chroma: 1.15 },
  { name: 'Clay', hue: 45, chroma: 1.1 },
  { name: 'Rose', hue: 18, chroma: 1.05 },
  { name: 'Graphite', hue: 250, chroma: 0.35 },
];

export interface Swatch {
  step: number;
  color: Oklch;
  css: string;
}

export interface GeneratedTheme {
  controls: ThemeControls;
  /** Every token, parsed — used by the preview and the audit. */
  values: Record<string, Oklch>;
  /** The same tokens serialised as CSS values. */
  vars: Record<string, string>;
  brand: Swatch[];
  neutral: Swatch[];
  status: Record<string, Oklch>;
}

const clampChroma = (value: number) => Math.min(0.37, Math.max(0, value));

export function generateTheme(controls: ThemeControls): GeneratedTheme {
  const brandRamp = controls.mode === 'light' ? BRAND_LIGHT : BRAND_DARK;
  const neutralFactor = controls.neutralChroma / NEUTRAL_C_REF;

  const values: Record<string, Oklch> = {};

  const brand: Swatch[] = brandRamp.map(([step, lightness, chroma]) => {
    const color: Oklch = { l: lightness, c: clampChroma(chroma * controls.chroma), h: controls.hue };
    values[`brand-${step}`] = color;
    return { step, color, css: oklch(color) };
  });

  const neutral: Swatch[] = NEUTRAL.map(([step, lightness, chroma]) => {
    const color: Oklch = { l: lightness, c: clampChroma(chroma * neutralFactor), h: controls.neutralHue };
    values[`neutral-${step}`] = color;
    return { step, color, css: oklch(color) };
  });

  for (const token of SEMANTIC) {
    const [lightness, chroma, alpha] = controls.mode === 'light' ? token.light : token.dark;
    values[token.name] = {
      l: lightness,
      c: clampChroma(chroma * neutralFactor),
      h: controls.neutralHue,
      ...(alpha === undefined ? {} : { a: alpha }),
    };
  }

  const status: Record<string, Oklch> = {};
  for (const entry of STATUS) {
    const base: Oklch = { l: entry.base[0], c: entry.base[1], h: entry.base[2] };
    const dark = STATUS_DARK[entry.name]!;
    const subtleSpec = controls.mode === 'light' ? entry.subtle : dark.subtle;
    const fgSpec = controls.mode === 'light' ? entry.fg : dark.fg;

    const subtle: Oklch = { l: subtleSpec[0], c: subtleSpec[1], h: subtleSpec[2] };
    const fg: Oklch = { l: fgSpec[0], c: fgSpec[1], h: fgSpec[2] };

    values[entry.name] = base;
    values[`${entry.name}-subtle`] = subtle;
    values[`${entry.name}-fg`] = fg;
    status[entry.name] = base;
  }

  // The focus ring tracks the brand accent — the light theme uses brand 600, the
  // dark theme steps up one stop so it stays visible against dark surfaces.
  values.ring = { ...values[`brand-${controls.mode === 'light' ? 600 : 700}`]! };

  const vars: Record<string, string> = {};
  for (const [name, color] of Object.entries(values)) {
    vars[`--color-${name}`] = oklch(color);
  }

  for (const [name, scale] of RADIUS) {
    vars[`--radius-${name}`] = `${Number((scale * controls.radius).toFixed(3))}rem`;
  }

  const shadow = (alpha: number) => oklch({ ...values.fg!, a: alpha });
  vars['--shadow-xs'] = `0 1px 2px 0 ${shadow(0.05)}`;
  vars['--shadow-sm'] = `0 1px 3px 0 ${shadow(0.08)}, 0 1px 2px -1px ${shadow(0.08)}`;
  vars['--shadow-md'] = `0 4px 6px -1px ${shadow(0.08)}, 0 2px 4px -2px ${shadow(0.08)}`;
  vars['--shadow-lg'] = `0 10px 15px -3px ${shadow(0.08)}, 0 4px 6px -4px ${shadow(0.08)}`;
  vars['--shadow-xl'] = `0 20px 25px -5px ${shadow(0.1)}, 0 8px 10px -6px ${shadow(0.1)}`;

  return { controls, values, vars, brand, neutral, status };
}

/** Serialise a generated theme as a drop-in CSS block. */
export function themeToCss(theme: GeneratedTheme, selector = '[data-theme="prism"]'): string {
  const { controls, vars } = theme;

  const pick = (...names: string[]) =>
    names
      .filter((name) => vars[name] !== undefined)
      .map((name) => `  ${name}: ${vars[name]};`)
      .join('\n');

  const brandTokens = Object.keys(vars).filter((name) => name.startsWith('--color-brand-'));
  const neutralTokens = Object.keys(vars).filter((name) => name.startsWith('--color-neutral-'));
  const statusTokens = Object.keys(vars).filter((name) =>
    /^--color-(success|warning|danger|info)(-|$)/.test(name),
  );
  const radiusTokens = Object.keys(vars).filter((name) => name.startsWith('--radius-'));
  const shadowTokens = Object.keys(vars).filter((name) => name.startsWith('--shadow-'));

  return [
    `/* Prism · seed hue ${controls.hue}° · chroma ×${controls.chroma} · ${controls.mode} */`,
    `${selector} {`,
    '  /* brand ramp */',
    pick(...brandTokens),
    '',
    '  /* neutral ramp */',
    pick(...neutralTokens),
    '',
    '  /* surfaces and text */',
    pick(
      '--color-bg',
      '--color-surface',
      '--color-surface-raised',
      '--color-surface-sunken',
      '--color-fg',
      '--color-fg-muted',
      '--color-fg-subtle',
      '--color-fg-on-brand',
      '--color-border',
      '--color-border-strong',
      '--color-ring',
      '--color-overlay',
    ),
    '',
    '  /* status */',
    pick(...statusTokens),
    '',
    '  /* radius */',
    pick(...radiusTokens),
    '',
    '  /* shadows */',
    pick(...shadowTokens),
    '}',
    '',
  ].join('\n');
}

export interface AuditRow {
  label: string;
  note: string;
  fg: string;
  bg: string;
  ratio: number;
  aa: boolean;
  aaLarge: boolean;
  aaa: boolean;
}

export function auditTheme(theme: GeneratedTheme): AuditRow[] {
  const v = theme.values;

  const rows: { label: string; note: string; fg: string; bg: string }[] = [
    { label: 'Body text on page', note: 'AA needs 4.5:1', fg: 'fg', bg: 'bg' },
    { label: 'Body text on surface', note: 'AA needs 4.5:1', fg: 'fg', bg: 'surface' },
    { label: 'Muted text on surface', note: 'AA needs 4.5:1', fg: 'fg-muted', bg: 'surface' },
    { label: 'Subtle text on surface', note: '3:1 for large text only', fg: 'fg-subtle', bg: 'surface' },
    { label: 'Button label on brand', note: 'AA needs 4.5:1', fg: 'fg-on-brand', bg: 'brand-600' },
    { label: 'Link on page', note: 'AA needs 4.5:1', fg: 'brand-600', bg: 'bg' },
    { label: 'Success text on subtle', note: 'AA needs 4.5:1', fg: 'success-fg', bg: 'success-subtle' },
    { label: 'Warning text on subtle', note: 'AA needs 4.5:1', fg: 'warning-fg', bg: 'warning-subtle' },
    { label: 'Danger text on subtle', note: 'AA needs 4.5:1', fg: 'danger-fg', bg: 'danger-subtle' },
    { label: 'Info text on subtle', note: 'AA needs 4.5:1', fg: 'info-fg', bg: 'info-subtle' },
    { label: 'Input border on surface', note: '3:1 for UI boundaries', fg: 'border-strong', bg: 'surface' },
  ];

  return rows
    .filter((row) => v[row.fg] && v[row.bg])
    .map((row) => {
      const ratio = contrastRatio(v[row.fg]!, v[row.bg]!);
      const result = verdict(ratio);
      return {
        label: row.label,
        note: row.note,
        fg: row.fg,
        bg: row.bg,
        ratio: Number(ratio.toFixed(2)),
        aa: result.aa,
        aaLarge: result.aaLarge,
        aaa: result.aaa,
      };
    });
}
