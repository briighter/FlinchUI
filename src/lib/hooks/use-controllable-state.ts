'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseControllableStateOptions<T> {
  /** Controlled value. When `undefined`, the hook manages its own state. */
  value?: T;
  defaultValue: T;
  onChange?: (value: T) => void;
}

/**
 * Pattern for components that work both controlled and uncontrolled.
 * Returns the current value and a setter that always fires `onChange`.
 */
export function useControllableState<T>({
  value,
  defaultValue,
  onChange,
}: UseControllableStateOptions<T>): [T, (next: T) => void] {
  const isControlled = value !== undefined;
  const [uncontrolled, setUncontrolled] = useState<T>(defaultValue);

  const onChangeRef = useRef(onChange);
  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  const setValue = useCallback(
    (next: T) => {
      if (!isControlled) {
        setUncontrolled(next);
      }
      onChangeRef.current?.(next);
    },
    [isControlled],
  );

  return [isControlled ? (value as T) : uncontrolled, setValue];
}
