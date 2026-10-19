'use client';

import { useEffect, useRef, type HTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CloseButton } from './close-button';

export type DrawerSide = 'left' | 'right' | 'top' | 'bottom';

const SIDE: Record<DrawerSide, string> = {
  left: 'inset-y-0 left-0 m-0 h-full max-h-none w-[min(24rem,100vw-3rem)] rounded-r-xl',
  right: 'inset-y-0 right-0 m-0 ml-auto h-full max-h-none w-[min(24rem,100vw-3rem)] rounded-l-xl',
  top: 'inset-x-0 top-0 m-0 mx-auto w-[min(32rem,100vw-2rem)] max-h-[80dvh] rounded-b-xl',
  bottom: 'inset-x-0 bottom-0 m-0 mb-0 mt-auto w-[min(32rem,100vw-2rem)] max-h-[80dvh] rounded-t-xl',
};

export interface DrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  side?: DrawerSide;
  children: ReactNode;
  ariaLabel?: string;
  className?: string;
}

/**
 * Drawer — a side sheet. Also built on native `<dialog>`, so Escape, focus trap,
 * and background inertness come from the platform.
 */
export function Drawer({ open, onOpenChange, side = 'right', children, ariaLabel, className }: DrawerProps) {
  const ref = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    if (open && !element.open) element.showModal();
    if (!open && element.open) element.close();
  }, [open]);

  return (
    <dialog
      ref={ref}
      aria-label={ariaLabel}
      aria-modal="true"
      onClose={() => onOpenChange(false)}
      onClick={(event) => {
        if (event.target === ref.current) onOpenChange(false);
      }}
      className={cn(
        'z-50 overflow-hidden border border-border bg-surface-raised p-0 text-fg shadow-xl',
        'backdrop:bg-overlay',
        'open:animate-fade-in',
        SIDE[side],
        className,
      )}
    >
      <div className="flex h-full max-h-full flex-col">
        <div className="flex items-center justify-between gap-4 border-b border-border p-4">
          <span className="text-sm font-semibold text-fg">{ariaLabel}</span>
          <CloseButton label="Close" onClick={() => onOpenChange(false)} />
        </div>
        <div className="flex-1 overflow-y-auto p-5 text-sm text-fg">{children}</div>
      </div>
    </dialog>
  );
}

export interface DrawerSectionProps extends HTMLAttributes<HTMLDivElement> {}

export function DrawerSection({ className, ...rest }: DrawerSectionProps) {
  return <div className={cn('flex flex-col gap-3', className)} {...rest} />;
}
