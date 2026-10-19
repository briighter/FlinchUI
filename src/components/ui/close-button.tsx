import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from './icon-button';

export interface CloseButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  label?: string;
}

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M18 6 6 18M6 6l12 12" />
  </svg>
);

/** CloseButton — a dismiss affordance for dialogs, banners, and toasts. */
export function CloseButton({ label = 'Close', className, ...rest }: CloseButtonProps) {
  return (
    <IconButton
      label={label}
      size="sm"
      variant="ghost"
      className={cn('text-fg-subtle hover:text-fg', className)}
      {...rest}
    >
      <XIcon />
    </IconButton>
  );
}
