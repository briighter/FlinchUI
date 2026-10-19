import type { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { AlertTriangleIcon, InfoIcon, CheckCircleIcon, XCircleIcon, TerminalIcon } from '@/components/ui/icons';

export type CalloutTone = 'note' | 'tip' | 'warning' | 'danger' | 'terminal';

const TONE = {
  note: {
    wrapper: 'border-info/30 bg-info-subtle text-info-fg',
    icon: 'text-info',
    Icon: InfoIcon,
  },
  tip: {
    wrapper: 'border-success/30 bg-success-subtle text-success-fg',
    icon: 'text-success',
    Icon: CheckCircleIcon,
  },
  warning: {
    wrapper: 'border-warning/40 bg-warning-subtle text-warning-fg',
    icon: 'text-warning',
    Icon: AlertTriangleIcon,
  },
  danger: {
    wrapper: 'border-danger/30 bg-danger-subtle text-danger-fg',
    icon: 'text-danger',
    Icon: XCircleIcon,
  },
  terminal: {
    wrapper: 'border-border bg-surface-sunken text-fg',
    icon: 'text-fg-subtle',
    Icon: TerminalIcon,
  },
} as const;

export interface CalloutProps {
  tone?: CalloutTone;
  title?: ReactNode;
  children: ReactNode;
  className?: string;
}

/** Callout — an aside for notes, tips, warnings, and commands. */
export function Callout({ tone = 'note', title, className, children }: CalloutProps) {
  const { wrapper, icon, Icon } = TONE[tone];

  return (
    <div className={cn('flex gap-3 rounded-lg border p-4 text-sm', wrapper, className)}>
      <Icon aria-hidden="true" className={cn('mt-0.5 size-5 shrink-0', icon)} />
      <div className="min-w-0 flex-1">
        {title ? <p className="font-semibold">{title}</p> : null}
        <div className={cn('text-current/90 [&>p]:leading-6', title ? 'mt-1' : '')}>{children}</div>
      </div>
    </div>
  );
}
