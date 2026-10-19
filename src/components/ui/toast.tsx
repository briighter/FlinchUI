'use client';

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { CloseButton } from './close-button';

export type ToastTone = 'neutral' | 'success' | 'warning' | 'danger' | 'info';

const TONE: Record<ToastTone, string> = {
  neutral: 'border-border bg-surface-raised',
  success: 'border-success/30 bg-surface-raised',
  warning: 'border-warning/40 bg-surface-raised',
  danger: 'border-danger/30 bg-surface-raised',
  info: 'border-info/30 bg-surface-raised',
};

const ACCENT: Record<ToastTone, string> = {
  neutral: 'bg-fg-subtle',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
  info: 'bg-info',
};

export interface Toast {
  id: string;
  title: ReactNode;
  description?: ReactNode;
  tone?: ToastTone;
  duration?: number;
  action?: ReactNode;
}

export interface ToastOptions extends Omit<Toast, 'id'> {}

interface ToastContextValue {
  toast: (options: ToastOptions) => string;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

/** Access the toast API from any client component below the provider. */
export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within <ToastProvider>');
  return context;
}

export interface ToastProviderProps {
  children: ReactNode;
  /** Maximum simultaneous toasts. */
  limit?: number;
}

/** ToastProvider — provides `useToast()` and renders the toast viewport. */
export function ToastProvider({ children, limit = 4 }: ToastProviderProps) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((current) => current.filter((item) => item.id !== id));
  }, []);

  const toast = useCallback(
    (options: ToastOptions) => {
      const id = `toast_${Math.random().toString(36).slice(2, 10)}`;
      setToasts((current) => [...current.slice(-(limit - 1)), { id, ...options }]);
      const duration = options.duration ?? 4500;
      if (duration > 0) setTimeout(() => dismiss(id), duration);
      return id;
    },
    [dismiss, limit],
  );

  const value = useMemo(() => ({ toast, dismiss }), [toast, dismiss]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="pointer-events-none fixed inset-x-0 bottom-0 z-100 flex flex-col items-center gap-2 p-4 sm:inset-x-auto sm:right-0 sm:items-end"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className={cn(
              'pointer-events-auto flex w-full max-w-sm animate-slide-up items-start gap-3 overflow-hidden rounded-lg border p-4 shadow-lg',
              TONE[item.tone ?? 'neutral'],
            )}
          >
            <span
              aria-hidden="true"
              className={cn('mt-1.5 size-2 shrink-0 rounded-full', ACCENT[item.tone ?? 'neutral'])}
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-fg">{item.title}</p>
              {item.description ? <p className="mt-0.5 text-sm text-fg-muted">{item.description}</p> : null}
            </div>
            {item.action}
            <CloseButton label="Dismiss notification" onClick={() => dismiss(item.id)} />
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
