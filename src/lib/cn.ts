/**
 * `cn` — dependency-free class name composer.
 *
 * Accepts strings, numbers, arrays, and conditional objects (clsx-style) and
 * joins the truthy results. Kept intentionally tiny and dependency-free so the
 * copy-paste footprint of the library stays near zero.
 *
 * If you want full Tailwind conflict resolution (e.g. last `p-4` winning over an
 * earlier `p-2`), swap the body for `twMerge(clsx(...))` — the call sites are
 * intentionally drop-in compatible.
 */

export type ClassValue =
  | string
  | number
  | null
  | false
  | undefined
  | ClassValue[]
  | Record<string, boolean | null | undefined>;

export function cn(...inputs: ClassValue[]): string {
  const parts: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === 'string' || typeof input === 'number') {
      parts.push(String(input));
      continue;
    }

    if (Array.isArray(input)) {
      const nested = cn(...input);
      if (nested) parts.push(nested);
      continue;
    }

    if (typeof input === 'object') {
      for (const [key, value] of Object.entries(input)) {
        if (value) parts.push(key);
      }
    }
  }

  return parts.join(' ');
}
