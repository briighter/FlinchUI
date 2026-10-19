import type { ShowcaseApp } from '@/lib/showcase';
import { cn } from '@/lib/cn';
import { Badge } from '@/components/ui/badge';
import { ArrowUpRightIcon, MonitorIcon, SmartphoneIcon } from '@/components/ui/icons';

const ACCENT = {
  brand: { panel: 'bg-brand-500/20', surface: 'bg-brand-500/10', dot: 'bg-brand-500' },
  success: { panel: 'bg-success/20', surface: 'bg-success/10', dot: 'bg-success' },
  warning: { panel: 'bg-warning/20', surface: 'bg-warning/10', dot: 'bg-warning' },
  danger: { panel: 'bg-danger/20', surface: 'bg-danger/10', dot: 'bg-danger' },
  info: { panel: 'bg-info/20', surface: 'bg-info/10', dot: 'bg-info' },
} as const;

function Motif({ app }: { app: ShowcaseApp }) {
  const accent = ACCENT[app.accent];

  if (app.device === 'mobile') {
    return (
      <div className="absolute inset-0 flex items-end justify-center p-6">
        <div className="flex h-full w-28 flex-col gap-2 rounded-t-2xl border border-b-0 border-border bg-surface p-2.5 shadow-sm">
          <span className={cn('h-2 w-10 rounded-full', accent.dot)} />
          <span className={cn('h-14 rounded-lg', accent.panel)} />
          <span className={cn('h-8 rounded-lg', accent.surface)} />
          <span className={cn('h-8 rounded-lg', accent.surface)} />
          <span className={cn('mt-auto h-7 rounded-lg', accent.panel)} />
        </div>
      </div>
    );
  }

  return (
    <div className="absolute inset-0 p-4">
      <div className="flex h-full gap-3">
        <div className={cn('w-20 rounded-lg', accent.surface)} />
        <div className="flex min-w-0 flex-1 flex-col gap-2">
          <div className="flex items-center gap-2">
            <span className={cn('h-4 w-24 rounded', accent.dot)} />
            <span className={cn('h-4 w-10 rounded', accent.surface)} />
          </div>
          <div className={cn('h-16 rounded-lg', accent.panel)} />
          <div className="flex min-h-0 flex-1 gap-2">
            <div className={cn('flex-1 rounded-lg', accent.surface)} />
            <div className={cn('flex-1 rounded-lg', accent.surface)} />
            <div className={cn('flex-1 rounded-lg', accent.surface)} />
          </div>
        </div>
      </div>
    </div>
  );
}

/** AppCard — the gallery tile for one showcase application. */
export function AppCard({ app }: { app: ShowcaseApp }) {
  const DeviceIcon = app.device === 'mobile' ? SmartphoneIcon : MonitorIcon;

  return (
    <a
      href={`/examples/${app.slug}`}
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-xl border border-border bg-surface',
        'transition-all duration-200 hover:-translate-y-0.5 hover:border-border-strong hover:shadow-lg',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
      )}
    >
      <div className="relative h-40 shrink-0 overflow-hidden border-b border-border bg-surface-sunken">
        <Motif app={app} />
        <span className="absolute left-3 top-3">
          <Badge tone="neutral" size="sm">
            {app.category}
          </Badge>
        </span>
        <span className="absolute right-3 top-3">
          <Badge tone="outline" size="sm">
            <DeviceIcon className="size-3" />
            {app.device}
          </Badge>
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-center gap-2">
          <span
            aria-hidden="true"
            className="flex size-7 shrink-0 items-center justify-center rounded-md bg-brand-600 text-xs font-extrabold text-fg-on-brand"
          >
            {app.name.slice(0, 1)}
          </span>
          <span className="text-sm font-semibold text-fg">{app.name}</span>
          <span className="text-sm text-fg-subtle">· {app.title}</span>
          <ArrowUpRightIcon className="ml-auto size-4 shrink-0 text-fg-subtle transition-colors group-hover:text-fg" />
        </div>

        <p className="text-sm leading-6 text-fg-muted">{app.tagline}</p>

        <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
          {app.uses.slice(0, 3).map((item) => (
            <span
              key={item}
              className="rounded-full border border-border px-2 py-0.5 text-[11px] text-fg-subtle"
            >
              {item}
            </span>
          ))}
          {app.uses.length > 3 ? (
            <span className="rounded-full border border-border px-2 py-0.5 text-[11px] text-fg-subtle">
              +{app.uses.length - 3}
            </span>
          ) : null}
        </div>
      </div>
    </a>
  );
}
