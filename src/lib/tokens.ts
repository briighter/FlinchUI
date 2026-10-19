/**
 * Shared Tailwind class maps.
 *
 * All class strings live here as **literals** so Tailwind v4's scanner emits
 * exactly the utilities the component API can produce — nothing more. Components
 * import from here instead of duplicating maps.
 */

export const DIRECTION = {
  row: 'flex-row',
  'row-reverse': 'flex-row-reverse',
  column: 'flex-col',
  'column-reverse': 'flex-col-reverse',
} as const;

export const WRAP = {
  wrap: 'flex-wrap',
  nowrap: 'flex-nowrap',
  'wrap-reverse': 'flex-wrap-reverse',
} as const;

export const GAP = {
  none: 'gap-0',
  xs: 'gap-1',
  sm: 'gap-2',
  md: 'gap-4',
  lg: 'gap-6',
  xl: 'gap-8',
  '2xl': 'gap-10',
  '3xl': 'gap-16',
} as const;

export const GAP_X = {
  none: 'gap-x-0',
  xs: 'gap-x-1',
  sm: 'gap-x-2',
  md: 'gap-x-4',
  lg: 'gap-x-6',
  xl: 'gap-x-8',
  '2xl': 'gap-x-10',
  '3xl': 'gap-x-16',
} as const;

export const GAP_Y = {
  none: 'gap-y-0',
  xs: 'gap-y-1',
  sm: 'gap-y-2',
  md: 'gap-y-4',
  lg: 'gap-y-6',
  xl: 'gap-y-8',
  '2xl': 'gap-y-10',
  '3xl': 'gap-y-16',
} as const;

export const ALIGN = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
  baseline: 'items-baseline',
  stretch: 'items-stretch',
} as const;

export const JUSTIFY = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
  around: 'justify-around',
  evenly: 'justify-evenly',
} as const;

export const PADDING = {
  none: 'p-0',
  xs: 'p-1.5',
  sm: 'p-2.5',
  md: 'p-4',
  lg: 'p-6',
  xl: 'p-8',
  '2xl': 'p-10',
} as const;

export const RADIUS = {
  none: 'rounded-none',
  xs: 'rounded-xs',
  sm: 'rounded-sm',
  md: 'rounded-md',
  lg: 'rounded-lg',
  xl: 'rounded-xl',
  '2xl': 'rounded-2xl',
  full: 'rounded-full',
} as const;

export const SHADOW = {
  none: 'shadow-none',
  xs: 'shadow-xs',
  sm: 'shadow-sm',
  md: 'shadow-md',
  lg: 'shadow-lg',
  xl: 'shadow-xl',
} as const;

export const TEXT_SIZE = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
} as const;

export const TEXT_TONE = {
  default: 'text-fg',
  muted: 'text-fg-muted',
  subtle: 'text-fg-subtle',
  brand: 'text-brand-600',
  success: 'text-success-fg',
  warning: 'text-warning-fg',
  danger: 'text-danger-fg',
  info: 'text-info-fg',
  inherit: '',
} as const;

export const TEXT_WEIGHT = {
  normal: 'font-normal',
  medium: 'font-medium',
  semibold: 'font-semibold',
  bold: 'font-bold',
  extrabold: 'font-extrabold',
} as const;

export const TEXT_ALIGN = {
  left: 'text-left',
  center: 'text-center',
  right: 'text-right',
  justify: 'text-justify',
} as const;

export const MAX_WIDTH = {
  sm: 'max-w-screen-sm',
  md: 'max-w-screen-md',
  lg: 'max-w-screen-lg',
  xl: 'max-w-screen-xl',
  '2xl': 'max-w-screen-2xl',
  prose: 'max-w-prose',
  full: 'max-w-full',
} as const;

/** Explicit literal map — guarantees Tailwind emits every column count. */
export const GRID_COLS = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
  6: 'grid-cols-6',
  7: 'grid-cols-7',
  8: 'grid-cols-8',
  9: 'grid-cols-9',
  10: 'grid-cols-10',
  11: 'grid-cols-11',
  12: 'grid-cols-12',
} as const;

export type GapToken = keyof typeof GAP;
export type AlignToken = keyof typeof ALIGN;
export type JustifyToken = keyof typeof JUSTIFY;
export type PaddingToken = keyof typeof PADDING;
export type RadiusToken = keyof typeof RADIUS;
export type ShadowToken = keyof typeof SHADOW;
export type TextSizeToken = keyof typeof TEXT_SIZE;
export type TextToneToken = keyof typeof TEXT_TONE;
export type TextWeightToken = keyof typeof TEXT_WEIGHT;
export type TextAlignToken = keyof typeof TEXT_ALIGN;
export type DirectionToken = keyof typeof DIRECTION;
export type WrapToken = keyof typeof WRAP;
export type MaxWidthToken = keyof typeof MAX_WIDTH;
export type GridColsToken = keyof typeof GRID_COLS;
