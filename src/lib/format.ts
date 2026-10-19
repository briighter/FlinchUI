/**
 * Small, dependency-free formatters.
 *
 * The showcase apps use these so numbers read like a real product — thousands
 * separators, tabular currency, compact axis ticks — without pulling in a
 * formatting library.
 */

const numberFormat = new Intl.NumberFormat('en-US');
const compactFormat = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 });
const currencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 2,
});
const wholeCurrencyFormat = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  maximumFractionDigits: 0,
});

export function formatNumber(value: number): string {
  return numberFormat.format(value);
}

export function formatCompact(value: number): string {
  return compactFormat.format(value);
}

export function formatCurrency(value: number, whole = false): string {
  return whole ? wholeCurrencyFormat.format(value) : currencyFormat.format(value);
}

/** Signed percentage, e.g. `+2.4%`. */
export function formatPercent(value: number, digits = 1): string {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(digits)}%`;
}

export function formatDelta(value: number, digits = 2): string {
  const sign = value > 0 ? '+' : value < 0 ? '−' : '';
  return `${sign}${Math.abs(value).toFixed(digits)}`;
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[unit]}`;
}

/** `185` → `3m 05s` */
export function formatDuration(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const rest = Math.round(seconds % 60);
  if (minutes === 0) return `${rest}s`;
  return `${minutes}m ${String(rest).padStart(2, '0')}s`;
}

/** Two-letter weekday + short month + day, e.g. `Tue, Apr 8`. */
export function formatDay(date: Date): string {
  return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatShortDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
