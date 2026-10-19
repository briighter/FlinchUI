import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './container';

export interface PageHeaderProps extends Omit<HTMLAttributes<HTMLElement>, 'title'> {
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned actions. */
  actions?: ReactNode;
  /** Rendered above the title (e.g. a <Breadcrumb />). */
  breadcrumb?: ReactNode;
  /** Tabs or filters rendered below the header. */
  footer?: ReactNode;
  bordered?: boolean;
}

/** PageHeader — the standard page title block with breadcrumb, actions, and footer. */
export function PageHeader({
  title,
  description,
  actions,
  breadcrumb,
  footer,
  bordered = true,
  className,
  ...rest
}: PageHeaderProps) {
  return (
    <header className={cn(bordered && 'border-b border-border', className)} {...rest}>
      <Container maxWidth="2xl" className="py-6">
        {breadcrumb ? <div className="mb-3">{breadcrumb}</div> : null}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold tracking-tight text-fg">{title}</h1>
            {description ? (
              <p className="mt-1 max-w-2xl text-sm text-fg-muted">{description}</p>
            ) : null}
          </div>
          {actions ? <div className="flex shrink-0 items-center gap-2">{actions}</div> : null}
        </div>
        {footer ? <div className="mt-4">{footer}</div> : null}
      </Container>
    </header>
  );
}
