import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CloseButton } from './close-button';

export type AlertTone = 'info' | 'success' | 'warning' | 'danger' | 'neutral';

const TONE: Record<AlertTone, string> = {
  info: 'border-info/30 bg-info-subtle text-info-fg',
  success: 'border-success/30 bg-success-subtle text-success-fg',
  warning: 'border-warning/30 bg-warning-subtle text-warning-fg',
  danger: 'border-danger/30 bg-danger-subtle text-danger-fg',
  neutral: 'border-border bg-surface-sunken text-fg',
};

const ICON_TONE: Record<AlertTone, string> = {
  info: 'text-info',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
  neutral: 'text-fg-subtle',
};

const DEFAULT_ICON: Record<AlertTone, ReactNode> = {
  info: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  ),
  success: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12.5 2.5 2.5 4.5-5" />
    </svg>
  ),
  warning: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10.3 3.6 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.6a2 2 0 0 0-3.4 0Z" />
      <path d="M12 9v4M12 17h.01" />
    </svg>
  ),
  danger: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M15 9l-6 6M9 9l6 6" />
    </svg>
  ),
  neutral: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </svg>
  ),
};

export interface AlertProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  tone?: AlertTone;
  title?: ReactNode;
  icon?: ReactNode;
  /** Hide the built-in tone icon. */
  hideIcon?: boolean;
  /** Called when the dismiss control is used. Providing it renders the control. */
  onDismiss?: () => void;
  /** Rendered opposite the dismiss control. */
  action?: ReactNode;
}

/** Alert — an inline message for status, validation, and notices. */
export function Alert({
  tone = 'info',
  title,
  icon,
  hideIcon = false,
  onDismiss,
  action,
  className,
  children,
  ...rest
}: AlertProps) {
  return (
    <div role="alert" className={cn('flex gap-3 rounded-lg border p-4', TONE[tone], className)} {...rest}>
      {!hideIcon ? (
        <span aria-hidden="true" className={cn('mt-0.5 shrink-0 [&_svg]:size-5', ICON_TONE[tone])}>
          {icon ?? DEFAULT_ICON[tone]}
        </span>
      ) : null}
      <div className="min-w-0 flex-1">
        {title ? <div className="font-semibold">{title}</div> : null}
        {children ? <div className={cn('text-sm', title ? 'mt-1 opacity-90' : undefined)}>{children}</div> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
      {onDismiss ? <CloseButton label="Dismiss" onClick={onDismiss} className="-m-1 shrink-0" /> : null}
    </div>
  );
}
