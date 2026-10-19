'use client';

import { useEffect, useRef, useState } from 'react';

export interface Size {
  width: number;
  height: number;
}

/**
 * Track an element's box with a ResizeObserver.
 *
 * Charts need real pixel dimensions to draw crisp geometry, so they measure
 * their container rather than stretching a fixed viewBox.
 */
export function useMeasure<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [size, setSize] = useState<Size>({ width: 0, height: 0 });

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const update = () => {
      setSize((previous) => {
        const width = element.clientWidth;
        const height = element.clientHeight;
        if (previous.width === width && previous.height === height) return previous;
        return { width, height };
      });
    };

    update();

    if (typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return [ref, size] as const;
}
