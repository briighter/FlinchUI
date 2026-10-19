import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Container } from './container';

export interface FooterColumn {
  title?: ReactNode;
  links: Array<{ label: ReactNode; href: string; external?: boolean }>;
}

export interface FooterProps extends HTMLAttributes<HTMLElement> {
  columns?: FooterColumn[];
  brand?: ReactNode;
  /** Bottom row: copyright and legal links. */
  bottom?: ReactNode;
  bordered?: boolean;
}

/** Footer — a sitemap footer with link columns and a legal row. */
export function Footer({
  columns,
  brand,
  bottom,
  bordered = true,
  className,
  ...rest
}: FooterProps) {
  return (
    <footer
      className={cn(bordered && 'border-t border-border bg-surface', className)}
      {...rest}
    >
      <Container maxWidth="2xl" className="py-12">
        {(brand || columns) && (
          <div className="grid gap-10 md:grid-cols-[1.5fr_repeat(3,1fr)]">
            {brand ? <div className="max-w-xs">{brand}</div> : null}
            {columns?.map((column, index) => (
              <div key={index} className="flex flex-col gap-3">
                {column.title ? (
                  <p className="text-sm font-semibold text-fg">{column.title}</p>
                ) : null}
                <ul className="flex flex-col gap-2">
                  {column.links.map((link) => (
                    <li key={link.href}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noreferrer' : undefined}
                        className="text-sm text-fg-muted transition-colors hover:text-fg"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {bottom ? (
          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6 text-sm text-fg-muted">
            {bottom}
          </div>
        ) : null}
      </Container>
    </footer>
  );
}
