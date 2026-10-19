import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';

export interface Step {
  label: ReactNode;
  description?: ReactNode;
  status?: 'complete' | 'current' | 'upcoming';
}

export interface StepperProps extends HTMLAttributes<HTMLOListElement> {
  steps: Step[];
  /** Current step index (0-based) when individual statuses are not supplied. */
  current?: number;
  orientation?: 'horizontal' | 'vertical';
}

const CompleteIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="size-3">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

/** Stepper — progress through a multi-step flow. */
export function Stepper({
  steps,
  current = 0,
  orientation = 'horizontal',
  className,
  ...rest
}: StepperProps) {
  const isHorizontal = orientation === 'horizontal';

  return (
    <ol
      className={cn('flex', isHorizontal ? 'flex-row items-start' : 'flex-col', className)}
      {...rest}
    >
      {steps.map((step, index) => {
        const status = step.status ?? (index < current ? 'complete' : index === current ? 'current' : 'upcoming');
        const isLast = index === steps.length - 1;

        return (
          <li
            key={index}
            className={cn('relative flex', isHorizontal ? 'flex-1 flex-col gap-2' : 'gap-3 pb-6 last:pb-0')}
            aria-current={status === 'current' ? 'step' : undefined}
          >
            {isHorizontal ? (
              !isLast ? (
                <span
                  aria-hidden="true"
                  className={cn(
                    'absolute top-4 left-[calc(50%+1rem)] h-px w-[calc(100%-2rem)]',
                    status === 'complete' ? 'bg-brand-600' : 'bg-border',
                  )}
                />
              ) : null
            ) : !isLast ? (
              <span
                aria-hidden="true"
                className={cn(
                  'absolute top-8 left-4 h-[calc(100%-2rem)] w-px',
                  status === 'complete' ? 'bg-brand-600' : 'bg-border',
                )}
              />
            ) : null}

            <div className={cn('flex items-start gap-3', isHorizontal && 'flex-col items-center text-center')}>
              <span
                className={cn(
                  'z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold',
                  status === 'complete' && 'bg-brand-600 text-fg-on-brand',
                  status === 'current' && 'bg-brand-600 text-fg-on-brand ring-4 ring-brand-100 dark:ring-brand-950',
                  status === 'upcoming' && 'bg-surface-sunken text-fg-subtle ring-1 ring-border',
                )}
              >
                {status === 'complete' ? <CompleteIcon /> : index + 1}
              </span>
              <span className="min-w-0">
                <span className={cn('block text-sm font-medium', status === 'upcoming' ? 'text-fg-muted' : 'text-fg')}>
                  {step.label}
                </span>
                {step.description ? (
                  <span className="mt-0.5 block text-xs text-fg-subtle">{step.description}</span>
                ) : null}
              </span>
            </div>
          </li>
        );
      })}
    </ol>
  );
}
