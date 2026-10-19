'use client';

import { useEffect, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CloseButton } from '@/components/ui/close-button';

const SIZE = {
  auto: 'max-h-[72%]',
  tall: 'h-[86%]',
  full: 'h-full',
} as const;

export interface PhoneSheetProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  size?: keyof typeof SIZE;
}

/**
 * PhoneSheet — a bottom sheet scoped to a phone frame.
 *
 * The library `Drawer` is built on native `<dialog>` and therefore lives in the
 * browser's top layer, which would escape the 390px bezel the showcase renders
 * inside. This is the in-frame equivalent: an absolutely positioned overlay that
 * is clipped by the handset, with Escape-to-close and a labelled dialog role.
 */
export function PhoneSheet({ open, onClose, title, children, size = 'auto' }: PhoneSheetProps) {
  useEffect(() => {
    if (!open) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        type="button"
        aria-label="Close"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in cursor-default bg-overlay"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={typeof title === 'string' ? title : undefined}
        className={cn(
          'relative flex flex-col overflow-hidden rounded-t-2xl border-t border-border bg-surface-raised shadow-xl',
          'animate-slide-up',
          SIZE[size],
        )}
      >
        <span aria-hidden="true" className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-border-strong" />
        <header className="flex shrink-0 items-center gap-3 px-4 py-3">
          {title ? <h2 className="text-sm font-semibold text-fg">{title}</h2> : null}
          <CloseButton label="Close" onClick={onClose} className="ml-auto" />
        </header>
        <div className="min-h-0 flex-1 overflow-y-auto px-4 pb-5">{children}</div>
      </div>
    </div>
  );
}

/** A neutral, borderless product "photograph" built from gradients. */
export function ProductPlate({
  gradient,
  className,
  children,
}: {
  gradient: string;
  className?: string;
  children?: ReactNode;
}) {
  return (
    <div className={cn('relative overflow-hidden bg-gradient-to-br', gradient, className)}>
      <span aria-hidden="true" className="absolute -right-6 -top-8 size-24 rounded-full bg-neutral-0/35 blur-xl" />
      <span aria-hidden="true" className="absolute -bottom-10 -left-6 size-20 rounded-full bg-neutral-950/15 blur-xl" />
      {children}
    </div>
  );
}
