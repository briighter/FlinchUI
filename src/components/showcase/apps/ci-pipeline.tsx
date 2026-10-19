'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { formatBytes, formatDuration } from '@/lib/format';
import { Alert } from '@/components/ui/alert';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CodeBlock } from '@/components/ui/code-block';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import {
  AlertTriangleIcon,
  ArrowRightIcon,
  CheckIcon,
  ClockIcon,
  DownloadIcon,
  GitBranchIcon,
  MinusIcon,
  RefreshIcon,
  SearchIcon,
  SettingsIcon,
  XIcon,
} from '@/components/ui/icons';
import { widthStep } from '../lib/util';

/* ----------------------------------- data ---------------------------------- */

type Status = 'passed' | 'failed' | 'running' | 'skipped' | 'warning' | 'blocked';

const STATUS_TONE: Record<Status, 'success' | 'danger' | 'info' | 'neutral' | 'warning'> = {
  passed: 'success',
  failed: 'danger',
  running: 'info',
  skipped: 'neutral',
  warning: 'warning',
  blocked: 'warning',
};

const STATUS_LABEL: Record<Status, string> = {
  passed: 'Passed',
  failed: 'Failed',
  running: 'Running',
  skipped: 'Skipped',
  warning: 'Warning',
  blocked: 'Awaiting approval',
};

interface Job {
  id: string;
  name: string;
  duration: number;
  status: Status;
  runner: string;
  detail?: string;
}

interface Stage {
  id: string;
  name: string;
  jobs: Job[];
}

const STAGES: Stage[] = [
  {
    id: 'setup',
    name: 'Setup',
    jobs: [
      { id: 'install', name: 'Install dependencies', duration: 134, status: 'passed', runner: 'linux-x64-8c' },
      { id: 'cache', name: 'Restore build cache', duration: 12, status: 'passed', runner: 'linux-x64-8c' },
    ],
  },
  {
    id: 'verify',
    name: 'Verify',
    jobs: [
      { id: 'lint', name: 'Lint', duration: 48, status: 'passed', runner: 'linux-x64-4c' },
      { id: 'typecheck', name: 'Typecheck', duration: 62, status: 'passed', runner: 'linux-x64-4c' },
      { id: 'audit', name: 'Dependency audit', duration: 31, status: 'passed', runner: 'linux-x64-2c' },
    ],
  },
  {
    id: 'test',
    name: 'Test',
    jobs: [
      { id: 'unit', name: 'Unit tests', duration: 221, status: 'passed', runner: 'linux-x64-8c', detail: '2,148 passed · 0 failed' },
      {
        id: 'e2e',
        name: 'End-to-end (chromium)',
        duration: 728,
        status: 'failed',
        runner: 'linux-x64-8c',
        detail: '1 failed · 412 passed · 6 flaky retried',
      },
      { id: 'visual', name: 'Visual regression', duration: 0, status: 'skipped', runner: '—', detail: 'Skipped: upstream job failed' },
    ],
  },
  {
    id: 'build',
    name: 'Build',
    jobs: [
      { id: 'build', name: 'Production build', duration: 262, status: 'passed', runner: 'linux-x64-16c', detail: '1,284 modules · 412 kB gzip' },
      { id: 'budget', name: 'Bundle budget', duration: 9, status: 'warning', runner: 'linux-x64-2c', detail: 'Entry chunk 184.1 kB / 180 kB target' },
    ],
  },
  {
    id: 'deploy',
    name: 'Deploy',
    jobs: [
      { id: 'canary', name: 'Canary (us-east-1)', duration: 0, status: 'blocked', runner: '—', detail: 'Waiting on an approval from @platform-oncall' },
      { id: 'production', name: 'Production', duration: 0, status: 'blocked', runner: '—' },
    ],
  },
];

type Level = 'info' | 'warn' | 'error' | 'success' | 'muted';

interface LogLine {
  t: string;
  level: Level;
  text: string;
}

const LEVEL_CLASS: Record<Level, string> = {
  info: 'text-fg-muted',
  warn: 'text-warning-fg',
  error: 'text-danger-fg',
  success: 'text-success-fg',
  muted: 'text-fg-subtle',
};

const E2E_LOG: LogLine[] = [
  { t: '12:04:18', level: 'muted', text: '$ pnpm exec playwright test --project=chromium --workers=4 --retries=2' },
  { t: '12:04:18', level: 'info', text: 'Running 419 tests using 4 workers' },
  { t: '12:04:19', level: 'info', text: '  419 [chromium] › auth/login.spec.ts:22:1 › signs in with a passkey' },
  { t: '12:05:02', level: 'info', text: '  419 [chromium] › dashboard/overview.spec.ts:14:1 › renders the KPI row' },
  { t: '12:06:44', level: 'info', text: '  419 [chromium] › routing/weights.spec.ts:31:1 › honours a per-route weight' },
  { t: '12:07:09', level: 'warn', text: '  retry #1 [chromium] › routing/weights.spec.ts:48:3 › survives a rolling deploy' },
  { t: '12:07:58', level: 'warn', text: '  retry #2 [chromium] › routing/weights.spec.ts:48:3 › survives a rolling deploy' },
  { t: '12:08:31', level: 'error', text: '' },
  { t: '12:08:31', level: 'error', text: '  1) [chromium] › routing/weights.spec.ts:48:3 › survives a rolling deploy ───────────' },
  { t: '12:08:31', level: 'error', text: '' },
  { t: '12:08:31', level: 'error', text: '    Error: expect(received).toHaveAttribute(expected)' },
  { t: '12:08:31', level: 'error', text: '' },
  { t: '12:08:31', level: 'error', text: '    Expected: "80"' },
  { t: '12:08:31', level: 'error', text: '    Received: "100"' },
  { t: '12:08:31', level: 'error', text: '' },
  { t: '12:08:31', level: 'error', text: '      46 |   await page.goto(\'/admin/routes\');' },
  { t: '12:08:31', level: 'error', text: '      47 |   await page.getByRole(\'slider\', { name: \'Route weight\' }).fill(\'80\');' },
  { t: '12:08:31', level: 'error', text: '    > 48 |   await expect(row).toHaveAttribute(\'data-weight\', \'80\');' },
  { t: '12:08:31', level: 'error', text: '         |                     ^' },
  { t: '12:08:31', level: 'error', text: '      49 | });' },
  { t: '12:08:31', level: 'error', text: '' },
  { t: '12:08:31', level: 'error', text: '      at tests/routing/weights.spec.ts:48:21' },
  { t: '12:08:31', level: 'error', text: '' },
  { t: '12:08:31', level: 'muted', text: '    attachment: test-results/weights-rolling-deploy/trace.zip (2.4 MB)' },
  { t: '12:08:31', level: 'muted', text: '    attachment: test-results/weights-rolling-deploy/actual.png (188 kB)' },
  { t: '12:08:31', level: 'error', text: '' },
  { t: '12:08:34', level: 'error', text: '  1 failed' },
  { t: '12:08:34', level: 'success', text: '  412 passed (12.1m)' },
  { t: '12:08:34', level: 'warn', text: '  6 flaky' },
  { t: '12:08:34', level: 'muted', text: '  [chromium] › tests/routing/weights.spec.ts:48:3' },
  { t: '12:08:34', level: 'info', text: '' },
  { t: '12:08:34', level: 'error', text: 'ELIFECYCLE  Command failed with exit code 1.' },
];

const PASSED_LOG: LogLine[] = [
  { t: '11:58:02', level: 'muted', text: '$ pnpm exec vitest run --coverage' },
  { t: '11:58:03', level: 'info', text: ' RUN  v3.0.5 /home/runner/work/atlas' },
  { t: '11:58:07', level: 'success', text: ' ✓ src/lib/router/resolve.test.ts (64 tests) 412ms' },
  { t: '11:58:11', level: 'success', text: ' ✓ src/lib/router/weights.test.ts (112 tests) 688ms' },
  { t: '11:58:19', level: 'success', text: ' ✓ src/lib/router/health.test.ts (48 tests) 331ms' },
  { t: '11:58:26', level: 'success', text: ' ✓ src/server/pool.test.ts (96 tests) 1.24s' },
  { t: '11:59:41', level: 'success', text: ' ✓ src/server/drain.test.ts (31 tests) 2.08s' },
  { t: '12:01:52', level: 'info', text: '' },
  { t: '12:01:52', level: 'info', text: ' Test Files  86 passed (86)' },
  { t: '12:01:52', level: 'info', text: '      Tests  2148 passed (2148)' },
  { t: '12:01:52', level: 'info', text: '   Duration  3m 41s' },
  { t: '12:01:52', level: 'info', text: '   Coverage  91.4% statements · 87.2% branches · 93.8% functions' },
];

const LOG_BY_JOB: Record<string, LogLine[]> = {
  e2e: E2E_LOG,
  unit: PASSED_LOG,
};

const CHANGED_FILES = [
  { path: 'src/lib/router/weights.ts', added: 142, removed: 38 },
  { path: 'src/lib/router/resolve.ts', added: 88, removed: 41 },
  { path: 'src/server/drain.ts', added: 64, removed: 12 },
  { path: 'src/components/ui/slider.tsx', added: 12, removed: 4 },
  { path: 'tests/routing/weights.spec.ts', added: 96, removed: 8 },
  { path: 'docs/routing/weights.mdx', added: 80, removed: 14 },
];

const ARTIFACTS = [
  { name: 'playwright-report', size: 2_418_000, expires: '14 days' },
  { name: 'coverage-lcov', size: 884_000, expires: '30 days' },
  { name: 'build-output', size: 41_200_000, expires: '7 days' },
];

const COMMITS = [
  { sha: '9f42c1a', subject: 'Share the retry budget across the pool', author: 'Devin Fahey', when: '42 minutes ago' },
  { sha: '3c81be7', subject: 'Drain in-flight requests before shutdown', author: 'Mara Osei', when: '3 hours ago' },
  { sha: 'b204d9f', subject: 'Allow route weights to survive a rolling deploy', author: 'Tobias Lind', when: 'Yesterday' },
];

/* ---------------------------------- app ------------------------------------ */

export function CiPipeline() {
  const [stageId, setStageId] = useState('test');
  const [jobId, setJobId] = useState('e2e');
  const [timestamps, setTimestamps] = useState(true);
  const [follow, setFollow] = useState(true);
  const [query, setQuery] = useState('');

  const stage = STAGES.find((entry) => entry.id === stageId) ?? STAGES[2]!;
  const job = stage.jobs.find((entry) => entry.id === jobId) ?? stage.jobs[0]!;
  const log = LOG_BY_JOB[job.id] ?? PASSED_LOG;
  const filtered = query.trim()
    ? log.filter((line) => line.text.toLowerCase().includes(query.trim().toLowerCase()))
    : log;

  const totalDuration = STAGES.flatMap((entry) => entry.jobs).reduce((sum, entry) => sum + entry.duration, 0);
  const failed = STAGES.flatMap((entry) => entry.jobs).filter((entry) => entry.status === 'failed').length;
  const passed = STAGES.flatMap((entry) => entry.jobs).filter((entry) => entry.status === 'passed').length;

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg text-fg">
      {/* Header */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand">
          R
        </span>
        <span className="text-sm font-semibold tracking-tight">Relay</span>
        <span aria-hidden="true" className="h-5 w-px bg-border" />
        <span className="flex items-center gap-1.5 text-sm text-fg-muted">
          <GitBranchIcon className="size-4 text-fg-subtle" />
          <span className="font-medium text-fg">feat/route-weights</span>
          <span className="text-fg-subtle">→</span>
          main
        </span>
        <span className="hidden items-center gap-2 font-mono text-xs text-fg-subtle md:flex">
          9f42c1a
          <span>·</span>
          <span>Share the retry budget across the pool</span>
        </span>

        <div className="ml-auto flex items-center gap-2">
          <Badge tone="danger" size="sm" dot>
            1 failed
          </Badge>
          <Button size="sm" variant="secondary" startIcon={<RefreshIcon />}>
            Re-run failed
          </Button>
          <Button size="sm" variant="ghost">
            Cancel
          </Button>
          <IconButton label="Pipeline settings" size="sm" variant="ghost">
            <SettingsIcon />
          </IconButton>
        </div>
      </header>

      {/* Pipeline rail */}
      <div className="shrink-0 overflow-x-auto border-b border-border bg-surface">
        <ol className="flex min-w-max items-center px-4 py-3">
          {STAGES.map((entry, index) => {
            const active = entry.id === stageId;
            const status: Status = entry.jobs.some((item) => item.status === 'failed')
              ? 'failed'
              : entry.jobs.every((item) => item.status === 'passed' || item.status === 'warning')
                ? 'passed'
                : 'blocked';
            const duration = entry.jobs.reduce((sum, item) => sum + item.duration, 0);

            return (
              <li key={entry.id} className="flex items-center">
                <button
                  type="button"
                  onClick={() => {
                    setStageId(entry.id);
                    setJobId(entry.jobs[0]!.id);
                  }}
                  aria-current={active ? 'step' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg border px-3 py-2 text-left transition-colors',
                    active
                      ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40'
                      : 'border-transparent hover:bg-surface-sunken',
                  )}
                >
                  <StageMark status={status} />
                  <span>
                    <span className={cn('block text-xs font-semibold', active ? 'text-fg' : 'text-fg-muted')}>
                      {entry.name}
                    </span>
                    <span className="block text-[10px] tabular-nums text-fg-subtle">
                      {entry.jobs.length} jobs · {formatDuration(duration)}
                    </span>
                  </span>
                </button>
                {index < STAGES.length - 1 ? (
                  <span aria-hidden="true" className="mx-1.5 flex items-center">
                    <span className={cn('h-px w-6', status === 'passed' ? 'bg-success' : 'bg-border-strong')} />
                    <ArrowRightIcon className="size-3 text-border-strong" />
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </div>

      <div className="grid min-h-0 flex-1 grid-cols-[236px_minmax(0,1fr)_306px] divide-x divide-border overflow-hidden">
        {/* Jobs */}
        <div className="flex min-h-0 flex-col overflow-y-auto bg-surface">
          <div className="flex items-center gap-2 border-b border-border px-3 py-2">
            <span className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              {stage.name}
            </span>
            <Badge tone="neutral" size="sm" className="ml-auto">
              {stage.jobs.length}
            </Badge>
          </div>
          <ul className="flex flex-col gap-0.5 p-2">
            {stage.jobs.map((entry) => {
              const active = entry.id === jobId;
              return (
                <li key={entry.id}>
                  <button
                    type="button"
                    onClick={() => setJobId(entry.id)}
                    aria-pressed={active}
                    className={cn(
                      'flex w-full flex-col gap-1 rounded-md border px-2.5 py-2 text-left transition-colors',
                      active
                        ? 'border-border-strong bg-surface-sunken'
                        : 'border-transparent hover:bg-surface-sunken/60',
                    )}
                  >
                    <span className="flex items-center gap-2">
                      <StageMark status={entry.status} small />
                      <span className={cn('truncate text-xs', active ? 'font-semibold text-fg' : 'text-fg-muted')}>
                        {entry.name}
                      </span>
                    </span>
                    <span className="flex items-center gap-2 pl-5 text-[10px] text-fg-subtle">
                      <span className="tabular-nums">
                        {entry.duration > 0 ? formatDuration(entry.duration) : STATUS_LABEL[entry.status]}
                      </span>
                      {entry.runner !== '—' ? <span className="truncate">· {entry.runner}</span> : null}
                    </span>
                    {entry.detail ? (
                      <span className="pl-5 text-[10px] leading-4 text-fg-subtle">{entry.detail}</span>
                    ) : null}
                  </button>
                </li>
              );
            })}
          </ul>

          <div className="mt-auto border-t border-border p-3">
            <div className="flex items-center justify-between text-[11px] text-fg-subtle">
              <span>Pipeline</span>
              <span className="tabular-nums">{formatDuration(totalDuration)}</span>
            </div>
            <Progress value={(passed / (passed + failed + 4)) * 100} tone="success" size="sm" className="mt-2" label="Jobs passed" />
            <div className="mt-2 flex items-center gap-3 text-[10px] text-fg-subtle">
              <span className="text-success-fg">{passed} passed</span>
              <span className="text-danger-fg">{failed} failed</span>
              <span>2 blocked</span>
            </div>
          </div>
        </div>

        {/* Log */}
        <div className="flex min-h-0 flex-col">
          <div className="flex shrink-0 flex-wrap items-center gap-2 border-b border-border px-3 py-2">
            <span className="font-mono text-xs font-medium text-fg">{job.name}</span>
            <Badge tone={STATUS_TONE[job.status]} size="sm">
              {STATUS_LABEL[job.status]}
            </Badge>
            <span className="flex items-center gap-1 text-[11px] text-fg-subtle">
              <ClockIcon className="size-3" />
              <span className="tabular-nums">
                {job.duration > 0 ? formatDuration(job.duration) : '—'}
              </span>
            </span>

            <div className="ml-auto flex items-center gap-2">
              <div className="relative flex items-center">
                <SearchIcon className="pointer-events-none absolute left-2 z-10 size-3.5 text-fg-subtle" />
                <Input
                  type="search"
                  aria-label="Search the log"
                  placeholder="Search log"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  className="h-7 w-40 pl-7 text-xs"
                />
              </div>
              <label className="flex items-center gap-1.5 text-[11px] text-fg-muted">
                Times
                <Switch checked={timestamps} onCheckedChange={setTimestamps} size="sm" label="Show timestamps" />
              </label>
              <label className="flex items-center gap-1.5 text-[11px] text-fg-muted">
                Tail
                <Switch checked={follow} onCheckedChange={setFollow} size="sm" label="Follow the log tail" />
              </label>
              <IconButton label="Download log" size="sm" variant="ghost">
                <DownloadIcon />
              </IconButton>
            </div>
          </div>

          <div className="min-h-0 flex-1 overflow-auto bg-surface-sunken/40">
            <ol className="min-w-max font-mono text-[12px] leading-5">
              {filtered.map((line, index) => (
                <li
                  key={index}
                  className={cn(
                    'flex gap-3 px-3 hover:bg-surface-sunken',
                    line.level === 'error' && 'bg-danger-subtle/40',
                  )}
                >
                  <span className="w-8 shrink-0 select-none text-right tabular-nums text-fg-subtle/60">
                    {index + 1}
                  </span>
                  {timestamps ? (
                    <span className="w-16 shrink-0 select-none tabular-nums text-fg-subtle">{line.t}</span>
                  ) : null}
                  <span className={cn('whitespace-pre', LEVEL_CLASS[line.level])}>{line.text || ' '}</span>
                </li>
              ))}
              {filtered.length === 0 ? (
                <li className="px-4 py-6 text-center font-sans text-xs text-fg-subtle">
                  No lines match “{query}”.
                </li>
              ) : null}
            </ol>
          </div>

          <div className="flex shrink-0 items-center gap-3 border-t border-border bg-surface px-3 py-1.5 text-[10px] text-fg-subtle">
            <span className="tabular-nums">{log.length} lines</span>
            <span>{formatBytes(log.reduce((sum, line) => sum + line.text.length, 0) * 2)}</span>
            <span className="flex items-center gap-1.5">
              <span className={cn('size-1.5 rounded-full', follow ? 'bg-success' : 'bg-fg-subtle')} />
              {follow ? 'Following' : 'Paused'}
            </span>
            <span className="ml-auto">exit code 1 · runner linux-x64-8c</span>
          </div>
        </div>

        {/* Right rail */}
        <div className="flex min-h-0 flex-col overflow-y-auto bg-surface">
          <div className="border-b border-border p-4">
            <Alert tone="danger" title="Blocked: the deploy gate needs a green pipeline">
              End-to-end tests failed on <span className="font-mono">routing/weights.spec.ts</span>. Relay
              will not promote past the canary until the suite passes.
            </Alert>
          </div>

          <div className="border-b border-border p-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              Deploy gate
            </h2>
            <div className="mt-3 flex flex-col gap-3">
              <div className="flex items-center gap-2.5">
                <Avatar name="Priya Raman" size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-fg">Priya Raman</p>
                  <p className="truncate text-[11px] text-fg-subtle">@platform-oncall · can approve</p>
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <Avatar name="Marcus Hale" size="sm" />
                <div className="min-w-0">
                  <p className="truncate text-xs font-medium text-fg">Marcus Hale</p>
                  <p className="truncate text-[11px] text-fg-subtle">Release manager · can approve</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button size="sm" disabled>
                  Approve canary
                </Button>
                <Button size="sm" variant="ghost">
                  Request review
                </Button>
              </div>
            </div>
          </div>

          <div className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
                Changes
              </h2>
              <span className="ml-auto font-mono text-[11px] text-fg-subtle">
                <span className="text-success-fg">+482</span> <span className="text-danger-fg">−117</span>
              </span>
            </div>
            <ul className="mt-3 flex flex-col gap-2">
              {CHANGED_FILES.map((file) => {
                const churn = file.added + file.removed;
                return (
                  <li key={file.path} className="flex flex-col gap-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate font-mono text-[11px] text-fg-muted">{file.path}</span>
                      <span className="ml-auto shrink-0 font-mono text-[10px] tabular-nums">
                        <span className="text-success-fg">+{file.added}</span>{' '}
                        <span className="text-danger-fg">−{file.removed}</span>
                      </span>
                    </span>
                    <span className="flex h-1 gap-px overflow-hidden rounded-full">
                      <span
                        className={cn('bg-success', widthStep(file.added / churn))}
                      />
                      <span className={cn('bg-danger', widthStep(file.removed / churn))} />
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="border-b border-border p-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              Artifacts
            </h2>
            <ul className="mt-3 flex flex-col gap-2">
              {ARTIFACTS.map((artifact) => (
                <li key={artifact.name} className="flex items-center gap-2">
                  <span className="truncate font-mono text-[11px] text-fg-muted">{artifact.name}</span>
                  <span className="ml-auto shrink-0 text-[10px] tabular-nums text-fg-subtle">
                    {formatBytes(artifact.size)}
                  </span>
                  <DownloadIcon className="size-3.5 shrink-0 text-fg-subtle" />
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              Commit
            </h2>
            <CodeBlock
              className="mt-3"
              language="yaml"
              title="relay.yml"
              showLineNumbers
              code={`deploy:
  environment: production
  strategy: canary
  gate:
    requires: [e2e, unit, build]
    approvers: platform-oncall
  rollback:
    on_error_rate: 0.02
    window: 5m`}
            />
            <ul className="mt-4 flex flex-col gap-2.5">
              {COMMITS.map((commit) => (
                <li key={commit.sha} className="flex items-start gap-2.5">
                  <span className="mt-0.5 font-mono text-[10px] text-fg-subtle">{commit.sha}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs text-fg">{commit.subject}</span>
                    <span className="block truncate text-[10px] text-fg-subtle">
                      {commit.author} · {commit.when}
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

function StageMark({ status, small = false }: { status: Status; small?: boolean }) {
  const size = small ? 'size-4' : 'size-7';
  const icon = small ? 'size-2.5' : 'size-3.5';

  if (status === 'passed') {
    return (
      <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-success-subtle text-success-fg', size)}>
        <CheckIcon className={icon} />
      </span>
    );
  }
  if (status === 'failed') {
    return (
      <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-danger-subtle text-danger-fg', size)}>
        <XIcon className={icon} />
      </span>
    );
  }
  if (status === 'warning') {
    return (
      <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-warning-subtle text-warning-fg', size)}>
        <AlertTriangleIcon className={icon} />
      </span>
    );
  }
  if (status === 'blocked') {
    return (
      <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-surface-sunken text-fg-subtle', size)}>
        <ClockIcon className={icon} />
      </span>
    );
  }
  if (status === 'skipped') {
    return (
      <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-surface-sunken text-fg-subtle', size)}>
        <MinusIcon className={icon} />
      </span>
    );
  }
  return (
    <span className={cn('flex shrink-0 items-center justify-center rounded-full bg-info-subtle text-info-fg', size)}>
      <span className={cn('rounded-full bg-info-fg', small ? 'size-1.5' : 'size-2')} />
    </span>
  );
}
