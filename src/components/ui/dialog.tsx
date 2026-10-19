'use client';

import {
  createContext,
  useContext,
  useEffect,
  useRef,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/cn';
import { CloseButton } from './close-button';

/**
 * Dialog is built on the **native `<dialog>` element**, so focus trapping, the
 * Escape key, inert background content, and the top-layer backdrop are handled
 * by the browser — no focus-trap library required.
 */

interface DialogContextValue {
  onClose: () => void;
}

const DialogContext = createContext<DialogContextValue | null>(null);

function useDialog(): DialogContextValue {
  const context = useContext(DialogContext);
  if (!context) throw new Error('Dialog parts must be used within <Dialog>');
  return context;
}

export interface DialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  /** Accessible name when no visible DialogTitle is rendered. */
  ariaLabel?: string;
  /** Disable closing via Escape / backdrop click. */
  dismissible?: boolean;
  className?: string;
}

export function Dialog({
  open,
  onOpenChange,
  children,
  ariaLabel,
  dismissible = true,
  className,
}: DialogProps) {
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
      onCancel={(event) => {
        if (!dismissible) event.preventDefault();
      }}
      onClick={(event) => {
        // Clicks that land on the <dialog> itself are backdrop clicks.
        if (dismissible && event.target === ref.current) onOpenChange(false);
      }}
      className={cn(
        'fixed inset-0 z-50 m-auto max-h-[calc(100dvh-2rem)] w-[min(32rem,calc(100vw-2rem))] overflow-hidden rounded-xl border border-border bg-surface-raised p-0 text-fg shadow-xl',
        'backdrop:bg-overlay backdrop:backdrop-blur-[1px]',
        'open:animate-scale-in',
        className,
      )}
    >
      <DialogContext.Provider value={{ onClose: () => onOpenChange(false) }}>
        {children}
      </DialogContext.Provider>
    </dialog>
  );
}

export function DialogContent({ className, children, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('flex max-h-[calc(100dvh-2rem)] flex-col', className)} {...rest}>
      {children}
    </div>
  );
}

export interface DialogHeaderProps extends HTMLAttributes<HTMLDivElement> {
  /** Show the built-in close button. */
  closable?: boolean;
}

export function DialogHeader({ closable = true, className, children, ...rest }: DialogHeaderProps) {
  const { onClose } = useDialog();
  return (
    <div className={cn('flex items-start justify-between gap-4 border-b border-border p-5', className)} {...rest}>
      <div className="flex min-w-0 flex-col gap-1">{children}</div>
      {closable ? <CloseButton label="Close dialog" onClick={onClose} /> : null}
    </div>
  );
}

export function DialogTitle({ className, ...rest }: HTMLAttributes<HTMLHeadingElement>) {
  return <h2 className={cn('text-lg font-semibold text-fg', className)} {...rest} />;
}

export function DialogDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-fg-muted', className)} {...rest} />;
}

export function DialogBody({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex-1 overflow-y-auto p-5 text-sm text-fg', className)} {...rest} />;
}

export function DialogFooter({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex items-center justify-end gap-3 border-t border-border p-5', className)}
      {...rest}
    />
  );
}

export interface DialogCloseProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
}

export function DialogClose({ children, className, ...rest }: DialogCloseProps) {
  const { onClose } = useDialog();
  return (
    <button type="button" onClick={onClose} className={className} {...rest}>
      {children}
    </button>
  );
}
