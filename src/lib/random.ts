/**
 * Deterministic pseudo-random helpers for the showcase apps.
 *
 * Server-rendered and client-rendered output must match, so every series is
 * derived from a fixed seed rather than `Math.random()`. Nothing here touches a
 * browser API — it is safe to evaluate at module scope.
 */

/** mulberry32 — a tiny, fast, seedable PRNG. Returns a value in [0, 1). */
export function mulberry32(seed: number): () => number {
  let state = seed >>> 0;
  return function next() {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface SeriesOptions {
  /** Number of points. */
  count?: number;
  /** Starting value. */
  start?: number;
  /** Average step size, as a fraction of the current value. */
  drift?: number;
  /** Upward or downward bias. */
  bias?: number;
  /** Lower clamp. */
  min?: number;
  /** Upper clamp. */
  max?: number;
  /** Decimal places to round to. */
  precision?: number;
}

/** A random walk with a fixed seed — the workhorse for charts and sparklines. */
export function series(seed: number, options: SeriesOptions = {}): number[] {
  const {
    count = 40,
    start = 100,
    drift = 0.02,
    bias = 0,
    min = 0,
    max = Number.POSITIVE_INFINITY,
    precision = 2,
  } = options;

  const next = mulberry32(seed);
  const round = (value: number) => Number(value.toFixed(precision));
  const out: number[] = [];
  let value = start;

  for (let index = 0; index < count; index += 1) {
    const shock = (next() - 0.5) * 2 * drift * value;
    value = value + shock + bias * value;
    value = Math.min(max, Math.max(min, value));
    out.push(round(value));
  }

  return out;
}

/** Pick a value from a list using a seeded generator. */
export function pick<T>(seed: number, list: readonly T[]): T {
  return list[Math.floor(mulberry32(seed)() * list.length) % list.length]!;
}

/** A seeded integer in [min, max]. */
export function randInt(seed: number, min: number, max: number): number {
  return min + Math.floor(mulberry32(seed)() * (max - min + 1));
}
