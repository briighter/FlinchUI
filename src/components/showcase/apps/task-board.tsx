'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Select } from '@/components/ui/select';
import { Timeline } from '@/components/ui/timeline';
import {
  BellIcon,
  BoltIcon,
  CalendarIcon,
  ChevronDownIcon,
  FilterIcon,
  LayoutIcon,
  LayersIcon,
  PlusIcon,
  SearchIcon,
  SettingsIcon,
  SparklesIcon,
  TableIcon,
  UserIcon,
} from '@/components/ui/icons';

/* ----------------------------------- data ---------------------------------- */

type Label = 'bug' | 'feature' | 'perf' | 'docs' | 'infra';

interface Issue {
  id: string;
  title: string;
  labels: Label[];
  estimate: number | null;
  assignee: string;
  comments: number;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}

interface Column {
  id: string;
  name: string;
  hint: string;
  issues: Issue[];
}

const LABEL_TONE: Record<Label, 'danger' | 'brand' | 'warning' | 'neutral' | 'info'> = {
  bug: 'danger',
  feature: 'brand',
  perf: 'warning',
  docs: 'neutral',
  infra: 'info',
};

const COLUMNS: Column[] = [
  {
    id: 'backlog',
    name: 'Backlog',
    hint: 'Not scheduled',
    issues: [
      { id: 'KES-431', title: 'Snapshotting a shard during a schema change deadlocks', labels: ['bug', 'infra'], estimate: 5, assignee: 'Mara Osei', comments: 3, priority: 'high' },
      { id: 'KES-427', title: 'Add advisory locks to the migration runner', labels: ['feature', 'infra'], estimate: 8, assignee: 'Tobias Lind', comments: 0, priority: 'medium' },
      { id: 'KES-419', title: 'Document connection pool tuning for read replicas', labels: ['docs'], estimate: 2, assignee: 'June Park', comments: 1, priority: 'low' },
      { id: 'KES-414', title: 'Expose replication lag as a Prometheus gauge', labels: ['feature'], estimate: 3, assignee: 'Mara Osei', comments: 6, priority: 'medium' },
    ],
  },
  {
    id: 'todo',
    name: 'Ready',
    hint: 'Scheduled for this cycle',
    issues: [
      { id: 'KES-412', title: 'Retry budget is not shared across the connection pool', labels: ['bug', 'perf'], estimate: 5, assignee: 'Devin Fahey', comments: 4, priority: 'urgent' },
      { id: 'KES-409', title: 'Per-route circuit breaker configuration', labels: ['feature'], estimate: 8, assignee: 'Tobias Lind', comments: 2, priority: 'high' },
      { id: 'KES-405', title: 'Cold start exceeds the 250 ms budget on arm64', labels: ['perf'], estimate: 3, assignee: 'June Park', comments: 9, priority: 'high' },
    ],
  },
  {
    id: 'progress',
    name: 'In progress',
    hint: 'WIP limit 3',
    issues: [
      { id: 'KES-401', title: 'Health check races the listener on restart', labels: ['bug'], estimate: 3, assignee: 'Devin Fahey', comments: 7, priority: 'urgent' },
      { id: 'KES-398', title: 'Route weights should survive a rolling deploy', labels: ['feature', 'infra'], estimate: 8, assignee: 'Mara Osei', comments: 5, priority: 'high' },
    ],
  },
  {
    id: 'review',
    name: 'In review',
    hint: 'Awaiting a second pair of eyes',
    issues: [
      { id: 'KES-393', title: 'Reduce allocation churn in the request codec', labels: ['perf'], estimate: 5, assignee: 'June Park', comments: 12, priority: 'medium' },
      { id: 'KES-390', title: 'Rewrite the routing guide around the new DSL', labels: ['docs'], estimate: 2, assignee: 'Tobias Lind', comments: 3, priority: 'low' },
    ],
  },
  {
    id: 'done',
    name: 'Done',
    hint: 'Shipped in 0.9.4',
    issues: [
      { id: 'KES-382', title: 'Drain in-flight requests before shutdown', labels: ['feature'], estimate: 5, assignee: 'Devin Fahey', comments: 4, priority: 'high' },
      { id: 'KES-377', title: 'Pin the TLS stack to a maintained fork', labels: ['infra'], estimate: 3, assignee: 'Mara Osei', comments: 1, priority: 'medium' },
    ],
  },
];

const ACTIVITY = [
  { title: 'Devin Fahey moved KES-401 to In progress', description: 'Reproduced on the third restart — the listener binds before the probe socket is ready.', timestamp: '12 minutes ago', status: 'current' as const },
  { title: 'Mara Osei opened KES-431', description: 'Attached a schema-diff repro and a thread dump from staging.', timestamp: '1 hour ago', status: 'complete' as const },
  { title: 'Priya Raman approved the routing guide', description: 'Left two comments about the fallback example.', timestamp: '3 hours ago', status: 'complete' as const },
  { title: 'Cycle 24.3 started', description: '11 issues committed, 46 points.', timestamp: 'Yesterday', status: 'complete' as const },
];

const NAV = [
  { label: 'Board', icon: LayoutIcon, active: true },
  { label: 'Backlog', icon: TableIcon, active: false },
  { label: 'Cycles', icon: BoltIcon, active: false },
  { label: 'Roadmap', icon: LayersIcon, active: false },
  { label: 'Insights', icon: SparklesIcon, active: false },
];

/* ---------------------------------- app ------------------------------------ */

export function TaskBoard() {
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState('KES-412');
  const [assignee, setAssignee] = useState('all');

  const columns = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return COLUMNS.map((column) => ({
      ...column,
      issues: column.issues.filter((issue) => {
        const matchesQuery =
          needle.length === 0 ||
          issue.title.toLowerCase().includes(needle) ||
          issue.id.toLowerCase().includes(needle);
        const matchesAssignee = assignee === 'all' || issue.assignee === assignee;
        return matchesQuery && matchesAssignee;
      }),
    }));
  }, [query, assignee]);

  const totalIssues = COLUMNS.reduce((sum, column) => sum + column.issues.length, 0);
  const totalPoints = COLUMNS.reduce(
    (sum, column) => sum + column.issues.reduce((points, issue) => points + (issue.estimate ?? 0), 0),
    0,
  );

  return (
    <div className="flex h-full min-h-0 bg-bg text-fg">
      <nav aria-label="Project sections" className="hidden w-52 shrink-0 flex-col border-r border-border bg-surface lg:flex">
        <div className="flex h-12 items-center gap-2 border-b border-border px-4">
          <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand">
            K
          </span>
          <span className="text-sm font-semibold tracking-tight">Kestrel</span>
        </div>

        <div className="flex flex-1 flex-col gap-0.5 p-2">
          {NAV.map((item) => (
            <button
              key={item.label}
              type="button"
              aria-current={item.active ? 'page' : undefined}
              className={cn(
                'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                item.active
                  ? 'bg-brand-50 font-medium text-brand-700 dark:text-brand-300'
                  : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
              )}
            >
              <item.icon className="size-4" />
              {item.label}
            </button>
          ))}

          <p className="px-3 pt-4 pb-1 text-[10px] font-semibold tracking-wide text-fg-subtle uppercase">
            Projects
          </p>
          {[
            { name: 'Atlas — Edge routing', color: 'bg-brand-500' },
            { name: 'Beacon — Telemetry', color: 'bg-info' },
            { name: 'Cinder — Storage', color: 'bg-warning' },
          ].map((project) => (
            <button
              key={project.name}
              type="button"
              className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
            >
              <span aria-hidden="true" className={cn('size-2 rounded-xs', project.color)} />
              <span className="truncate">{project.name}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <div className="rounded-lg border border-border p-3">
            <p className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              Cycle 24.3
            </p>
            <p className="mt-2 text-2xl font-bold tabular-nums text-fg">58%</p>
            <Progress value={58} size="sm" className="mt-2" label="Cycle progress" />
            <p className="mt-2 text-[11px] text-fg-subtle">6 of 11 issues · 4 days left</p>
          </div>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-12 shrink-0 items-center gap-2 border-b border-border bg-surface px-4">
          <span className="text-sm font-semibold text-fg">Atlas — Edge routing</span>
          <Badge tone="brand" size="sm">
            Cycle 24.3
          </Badge>
          <div className="ml-auto flex items-center gap-2">
            <AvatarGroup size="xs" max={4}>
              <Avatar name="Mara Osei" size="xs" />
              <Avatar name="Tobias Lind" size="xs" />
              <Avatar name="June Park" size="xs" />
              <Avatar name="Devin Fahey" size="xs" />
              <Avatar name="Priya Raman" size="xs" />
            </AvatarGroup>
            <IconButton label="Notifications" size="sm" variant="ghost">
              <BellIcon />
            </IconButton>
            <Button size="sm" startIcon={<PlusIcon />}>
              New issue
            </Button>
          </div>
        </header>

        <div className="flex flex-wrap items-center gap-2 border-b border-border bg-bg px-4 py-2.5">
          <Button size="sm" variant="ghost" startIcon={<LayoutIcon />}>
            Board
          </Button>
          <Button size="sm" variant="ghost" startIcon={<TableIcon />}>
            List
          </Button>
          <span aria-hidden="true" className="h-4 w-px bg-border" />

          <div className="relative flex items-center">
            <SearchIcon className="pointer-events-none absolute left-2.5 z-10 size-4 text-fg-subtle" />
            <Input
              type="search"
              aria-label="Filter issues"
              placeholder="Filter issues"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="h-8 w-52 pl-8 text-sm"
            />
          </div>

          <Select
            size="sm"
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            aria-label="Filter by assignee"
            className="w-44"
            options={[
              { label: 'All assignees', value: 'all' },
              { label: 'Mara Osei', value: 'Mara Osei' },
              { label: 'Tobias Lind', value: 'Tobias Lind' },
              { label: 'June Park', value: 'June Park' },
              { label: 'Devin Fahey', value: 'Devin Fahey' },
            ]}
          />

          <Button size="sm" variant="ghost" startIcon={<FilterIcon />}>
            Add filter
          </Button>

          <span className="ml-auto flex items-center gap-3 text-xs text-fg-subtle">
            <span>
              <span className="font-medium tabular-nums text-fg">{totalIssues}</span> issues
            </span>
            <span>
              <span className="font-medium tabular-nums text-fg">{totalPoints}</span> points
            </span>
            <Button size="sm" variant="ghost" endIcon={<ChevronDownIcon />}>
              Group: Status
            </Button>
          </span>
        </div>

        <div className="flex min-h-0 flex-1">
          {/* Board */}
          <div className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden p-4">
            <div className="flex h-full min-w-max gap-3">
              {columns.map((column) => {
                const points = column.issues.reduce((sum, issue) => sum + (issue.estimate ?? 0), 0);
                return (
                  <section
                    key={column.id}
                    className="flex h-full w-72 shrink-0 flex-col rounded-lg border border-border bg-surface-sunken/50"
                  >
                    <header className="flex items-center gap-2 border-b border-border px-3 py-2.5">
                      <h2 className="text-xs font-semibold tracking-wide text-fg uppercase">
                        {column.name}
                      </h2>
                      <span className="rounded-full bg-surface px-1.5 py-0.5 text-[10px] font-medium tabular-nums text-fg-muted">
                        {column.issues.length}
                      </span>
                      <span className="ml-auto text-[10px] tabular-nums text-fg-subtle">
                        {points} pts
                      </span>
                      <IconButton label={`Add issue to ${column.name}`} size="sm" variant="ghost">
                        <PlusIcon />
                      </IconButton>
                    </header>

                    <p className="px-3 pt-2 text-[10px] text-fg-subtle">{column.hint}</p>

                    <div className="flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto p-2">
                      {column.issues.map((issue) => {
                        const active = issue.id === selected;
                        return (
                          <button
                            key={issue.id}
                            type="button"
                            onClick={() => setSelected(issue.id)}
                            aria-pressed={active}
                            className={cn(
                              'flex flex-col gap-2.5 rounded-lg border bg-surface p-3 text-left transition-all',
                              active
                                ? 'border-brand-500 shadow-md ring-2 ring-brand-500/30'
                                : 'border-border hover:border-border-strong hover:shadow-sm',
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <span className="font-mono text-[11px] text-fg-subtle">{issue.id}</span>
                              {issue.priority === 'urgent' ? (
                                <Badge tone="danger" size="sm">
                                  Urgent
                                </Badge>
                              ) : null}
                              <span className="ml-auto text-[10px] tabular-nums text-fg-subtle">
                                {issue.estimate ?? '–'}
                              </span>
                            </div>

                            <p className="text-sm leading-5 text-fg">{issue.title}</p>

                            <div className="flex flex-wrap items-center gap-1.5">
                              {issue.labels.map((label) => (
                                <Badge key={label} tone={LABEL_TONE[label]} size="sm" className="capitalize">
                                  {label}
                                </Badge>
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <Avatar name={issue.assignee} size="xs" />
                              {issue.comments > 0 ? (
                                <span className="ml-auto flex items-center gap-1 text-[10px] text-fg-subtle">
                                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                    <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6a8 8 0 0 1 8-8h2a8 8 0 0 1 8 8Z" />
                                  </svg>
                                  {issue.comments}
                                </span>
                              ) : null}
                            </div>
                          </button>
                        );
                      })}

                      {column.issues.length === 0 ? (
                        <p className="rounded-md border border-dashed border-border px-3 py-6 text-center text-xs text-fg-subtle">
                          No matching issues
                        </p>
                      ) : null}
                    </div>
                  </section>
                );
              })}
            </div>
          </div>

          {/* Activity rail */}
          <aside className="hidden w-80 shrink-0 flex-col overflow-y-auto border-l border-border bg-surface xl:flex">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <h2 className="text-xs font-semibold tracking-wide text-fg uppercase">Activity</h2>
              <IconButton label="Activity settings" size="sm" variant="ghost">
                <SettingsIcon />
              </IconButton>
            </div>

            <div className="border-b border-border p-4">
              <p className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
                Selected
              </p>
              <p className="mt-2 font-mono text-xs text-fg-muted">{selected}</p>
              <p className="mt-1 text-sm font-medium leading-5 text-fg">
                {COLUMNS.flatMap((column) => column.issues).find((issue) => issue.id === selected)
                  ?.title ?? 'Select an issue'}
              </p>
              <div className="mt-3 flex items-center gap-2">
                <Button size="sm" variant="secondary" startIcon={<UserIcon />}>
                  Assign
                </Button>
                <Button size="sm" variant="ghost" startIcon={<CalendarIcon />}>
                  Set due date
                </Button>
              </div>
            </div>

            <div className="p-4">
              <Timeline items={ACTIVITY} />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
