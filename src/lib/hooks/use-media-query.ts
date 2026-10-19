'use client';

import { useEffect, useState } from 'react';

/** SSR-safe media query hook. Returns `false` until mounted. */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

export const useIsMobile = (breakpoint = 768) => useMediaQuery(`(max-width: ${breakpoint - 1}px)`);
