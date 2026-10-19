'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { formatCompact, formatNumber, formatPercent, formatCurrency } from '@/lib/format';
import { series } from '@/lib/random';
import { widthStep } from '../lib/util';
import { BarChart } from '@/components/ui/bar-chart';
import { DonutChart } from '@/components/ui/donut-chart';
import { Heatmap } from '@/components/ui/heatmap';
import { LineChart } from '@/components/ui/line-chart';
import { Sparkline } from '@/components/ui/sparkline';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import {
  ArrowUpRightIcon,
  BellIcon,
  CalendarIcon,
  DownloadIcon,
  FilterIcon,
  GaugeIcon,
  GlobeIcon,
  LayoutIcon,
  SearchIcon,
  SettingsIcon,
  TableIcon,
  UserIcon,
} from '@/components/ui/icons';

/* ----------------------------------- data ---------------------------------- */

const LABELS = [
  'Mar 3', 'Mar 4', 'Mar 5', 'Mar 6', 'Mar 7', 'Mar 8', 'Mar 9',
  'Mar 10', 'Mar 11', 'Mar 12', 'Mar 13', 'Mar 14', 'Mar 15', 'Mar 16',
];

const THIS_PERIOD = series(21, { count: 14, start: 9_400, drift: 0.09, bias: 0.012, min: 2_000, precision: 0 });
const PRIOR_PERIOD = series(22, { count: 14, start: 8_100, drift: 0.07, bias: 0.008, min: 2_000, precision: 0 });

const CHANNELS = ['Direct', 'Organic', 'Paid', 'Email', 'Social', 'Referral', 'Partner'];
const DESKTOP = series(31, { count: 7, start: 18_200, drift: 0.16, min: 4_000, precision: 0 });
const MOBILE = series(32, { count: 7, start: 24_600, drift: 0.14, min: 6_000, precision: 0 });

const PLAN_MIX = [
  { label: 'Enterprise', value: 412, tone: 'brand' as const },
  { label: 'Business', value: 738, tone: 'info' as const },
  { label: 'Starter', value: 1_290, tone: 'success' as const },
  { label: 'Trial', value: 604, tone: 'warning' as const },
];

const COHORTS = [
  'Jan 6', 'Jan 13', 'Jan 20', 'Jan 27', 'Feb 3', 'Feb 10', 'Feb 17', 'Feb 24',
];
const RETENTION: number[][] = COHORTS.map((_, row) =>
  Array.from({ length: 8 - row }, (_, column) => {
    if (column === 0) return 100;
    const decay = Math.pow(0.82, column) * 100;
    const wobble = ((row * 7 + column * 13) % 9) - 4;
    return Math.max(6, Math.round(decay + wobble));
  }),
);

const TOP_PAGES = [
  { path: '/pricing', views: 184_920, bounce: 32.4, time: '2m 48s', trend: 'up' as const, seed: 41 },
  { path: '/docs/quickstart', views: 142_118, bounce: 18.1, time: '6m 12s', trend: 'up' as const, seed: 42 },
  { path: '/blog/scaling-postgres', views: 98_440, bounce: 54.6, time: '1m 04s', trend: 'down' as const, seed: 43 },
  { path: '/changelog', views: 76_305, bounce: 27.9, time: '3m 31s', trend: 'up' as const, seed: 44 },
  { path: '/integrations/slack', views: 64_902, bounce: 41.2, time: '2m 19s', trend: 'flat' as const, seed: 45 },
  { path: '/security', views: 51_770, bounce: 22.8, time: '4m 55s', trend: 'up' as const, seed: 46 },
];

const SIDEBAR = [
  { label: 'Overview', icon: GaugeIcon, active: true },
  { label: 'Acquisition', icon: GlobeIcon, active: false },
  { label: 'Engagement', icon: LayoutIcon, active: false },
  { label: 'Retention', icon: TableIcon, active: false },
  { label: 'Accounts', icon: UserIcon, active: false },
];

/* ---------------------------------- app ------------------------------------ */

export function AnalyticsDashboard() {
  const [comparing, setComparing] = useState(true);
  const [range, setRange] = useState('14d');
  const [segment, setSegment] = useState('all');

  const totals = [
    {
      label: 'Active users',
      value: formatNumber(128_430),
      delta: formatPercent(12.4),
      trend: 'up' as const,
      hint: 'vs. 114,210 last period',
      seed: 51,
    },
    {
      label: 'Sessions',
      value: formatNumber(412_880),
      delta: formatPercent(8.1),
      trend: 'up' as const,
      hint: '3.21 sessions / user',
      seed: 52,
    },
    {
      label: 'Conversion',
      value: '3.42%',
      delta: formatPercent(-0.4),
      trend: 'down' as const,
      hint: 'Checkout → paid',
      seed: 53,
    },
    {
      label: 'Net revenue',
      value: formatCurrency(18_240_000, true),
      delta: formatPercent(22.6),
      trend: 'up' as const,
      hint: 'Annualised, net of refunds',
      seed: 54,
    },
  ];

  return (
    <div className="flex h-full min-h-0 bg-bg text-fg">
      {/* Rail */}
      <nav aria-label="Analytics sections" className="hidden w-52 shrink-0 flex-col border-r border-border bg-surface md:flex">
        <div className="flex h-12 items-center gap-2 border-b border-border px-4">
          <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand">
            N
          </span>
          <span className="text-sm font-semibold tracking-tight">Northwind</span>
        </div>

        <div className="flex flex-1 flex-col gap-0.5 p-2">
          {SIDEBAR.map((item) => (
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
            Saved views
          </p>
          {['Weekly exec digest', 'Signup funnel', 'Paying accounts'].map((view) => (
            <button
              key={view}
              type="button"
              className="flex items-center gap-2.5 rounded-md px-3 py-1.5 text-sm text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
            >
              <span aria-hidden="true" className="size-1.5 rounded-full bg-border-strong" />
              <span className="truncate">{view}</span>
            </button>
          ))}
        </div>

        <div className="border-t border-border p-3">
          <div className="flex items-center gap-2.5">
            <Avatar name="Priya Raman" size="sm" status="online" />
            <div className="min-w-0">
              <p className="truncate text-xs font-medium text-fg">Priya Raman</p>
              <p className="truncate text-[11px] text-fg-subtle">Data lead</p>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top bar */}
        <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold text-fg">Product analytics</span>
            <Badge tone="info" size="sm">
              Warehouse: synced 4m ago
            </Badge>
          </div>
          <div className="ml-auto flex items-center gap-1.5">
            <div className="relative hidden items-center sm:flex">
              <SearchIcon className="pointer-events-none absolute left-2.5 z-10 size-4 text-fg-subtle" />
              <Input
                type="search"
                aria-label="Search metrics"
                placeholder="Search metrics"
                className="h-8 w-44 pl-8 text-sm"
              />
            </div>
            <IconButton label="Notifications" size="sm" variant="ghost">
              <BellIcon />
            </IconButton>
            <IconButton label="Settings" size="sm" variant="ghost">
              <SettingsIcon />
            </IconButton>
          </div>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {/* Filter bar */}
          <div className="sticky top-0 z-10 flex flex-wrap items-center gap-2 border-b border-border bg-bg/90 px-4 py-2.5 backdrop-blur-sm">
            <Button size="sm" variant="secondary" startIcon={<CalendarIcon />}>
              {range === '14d' ? 'Mar 3 – Mar 16' : range === '7d' ? 'Mar 10 – Mar 16' : 'Jan 1 – Mar 16'}
            </Button>
            <Select
              size="sm"
              value={range}
              onChange={(event) => setRange(event.target.value)}
              aria-label="Date range"
              className="w-32"
              options={[
                { label: 'Last 7 days', value: '7d' },
                { label: 'Last 14 days', value: '14d' },
                { label: 'Quarter to date', value: 'qtd' },
              ]}
            />
            <Select
              size="sm"
              value={segment}
              onChange={(event) => setSegment(event.target.value)}
              aria-label="Segment"
              className="w-40"
              options={[
                { label: 'All segments', value: 'all' },
                { label: 'Paying accounts', value: 'paying' },
                { label: 'Trials', value: 'trial' },
                { label: 'Enterprise', value: 'enterprise' },
              ]}
            />
            <Button size="sm" variant="ghost" startIcon={<FilterIcon />}>
              Add filter
            </Button>

            <span className="ml-auto flex items-center gap-3">
              <label className="flex items-center gap-2 text-xs text-fg-muted">
                Compare
                <Switch checked={comparing} onCheckedChange={setComparing} size="sm" label="Compare with previous period" />
              </label>
              <Button size="sm" variant="secondary" startIcon={<DownloadIcon />}>
                Export
              </Button>
            </span>
          </div>

          <div className="flex flex-col gap-4 p-4">
            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {totals.map((total) => (
                <Card key={total.label} padding="md">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-fg-muted">{total.label}</p>
                      <p className="mt-2 text-2xl font-bold tabular-nums tracking-tight text-fg">
                        {total.value}
                      </p>
                    </div>
                    <span className="h-8 w-20 shrink-0">
                      <Sparkline
                        data={series(total.seed, { count: 24, start: 100, drift: 0.05, bias: total.trend === 'down' ? -0.004 : 0.006, precision: 2 })}
                        tone={total.trend === 'down' ? 'danger' : 'success'}
                        area
                        height={32}
                      />
                    </span>
                  </div>
                  <div className="mt-3 flex items-center gap-2">
                    <Badge tone={total.trend === 'down' ? 'danger' : 'success'} size="sm">
                      {total.delta}
                    </Badge>
                    <span className="truncate text-xs text-fg-subtle">{total.hint}</span>
                  </div>
                </Card>
              ))}
            </div>

            {/* Traffic + plan mix */}
            <div className="grid gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader className="flex-row items-start justify-between gap-4">
                  <div>
                    <CardTitle>Active users</CardTitle>
                    <CardDescription>
                      Unique users per day, {comparing ? 'compared with the previous period' : 'current period only'}.
                    </CardDescription>
                  </div>
                  <Badge tone="brand" size="sm">
                    {formatCompact(THIS_PERIOD.reduce((sum, value) => sum + value, 0))} total
                  </Badge>
                </CardHeader>
                <CardContent>
                  <LineChart
                    labels={LABELS}
                    height={232}
                    area
                    valueFormat={(value) => formatCompact(value)}
                    label="Active users per day"
                    series={
                      comparing
                        ? [
                            { name: 'This period', data: THIS_PERIOD, tone: 'brand' },
                            { name: 'Previous period', data: PRIOR_PERIOD, tone: 'neutral', dashed: true },
                          ]
                        : [{ name: 'This period', data: THIS_PERIOD, tone: 'brand' }]
                    }
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Plan mix</CardTitle>
                  <CardDescription>Active accounts by subscription tier.</CardDescription>
                </CardHeader>
                <CardContent>
                  <DonutChart
                    data={PLAN_MIX}
                    size={148}
                    thickness={20}
                    centerValue={formatCompact(PLAN_MIX.reduce((sum, slice) => sum + slice.value, 0))}
                    centerLabel="accounts"
                    valueFormat={(value) => formatNumber(value)}
                    label="Plan mix"
                  />
                  <p className="mt-4 border-t border-border pt-4 text-xs leading-5 text-fg-subtle">
                    Trials convert at <span className="font-medium text-fg">18.6%</span>, up 2.1 points
                    from last period.
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Channels + funnel */}
            <div className="grid gap-4 xl:grid-cols-3">
              <Card className="xl:col-span-2">
                <CardHeader>
                  <CardTitle>Sessions by channel and device</CardTitle>
                  <CardDescription>Where the traffic came from, split by form factor.</CardDescription>
                </CardHeader>
                <CardContent>
                  <BarChart
                    labels={CHANNELS}
                    height={224}
                    valueFormat={(value) => formatCompact(value)}
                    label="Sessions by channel"
                    series={[
                      { name: 'Desktop', data: DESKTOP, tone: 'brand' },
                      { name: 'Mobile', data: MOBILE, tone: 'info' },
                    ]}
                  />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Signup funnel</CardTitle>
                  <CardDescription>Step conversion for the selected range.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ol className="flex flex-col gap-3">
                    {[
                      { step: 'Visited pricing', value: 128_430, ratio: 1 },
                      { step: 'Started trial', value: 24_118, ratio: 0.188 },
                      { step: 'Invited a teammate', value: 9_640, ratio: 0.075 },
                      { step: 'Connected a source', value: 5_207, ratio: 0.041 },
                      { step: 'Upgraded', value: 1_842, ratio: 0.0143 },
                    ].map((row, index, all) => {
                      const previous = index === 0 ? row.value : all[index - 1]!.value;
                      return (
                        <li key={row.step} className="flex flex-col gap-1.5">
                          <div className="flex items-baseline justify-between gap-3 text-sm">
                            <span className="text-fg-muted">{row.step}</span>
                            <span className="font-medium tabular-nums text-fg">
                              {formatNumber(row.value)}
                            </span>
                          </div>
                          <span className="relative h-2 overflow-hidden rounded-full bg-surface-sunken">
                            <span
                              className={cn(
                                'absolute inset-y-0 left-0 rounded-full bg-brand-600',
                                widthStep(Math.max(row.ratio, 0.05)),
                              )}
                            />
                          </span>
                          <span className="text-[11px] text-fg-subtle">
                            {index === 0
                              ? 'Entry point'
                              : `${((row.value / previous) * 100).toFixed(1)}% from previous step`}
                          </span>
                        </li>
                      );
                    })}
                  </ol>
                </CardContent>
              </Card>
            </div>

            {/* Retention */}
            <Card>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Weekly retention</CardTitle>
                  <CardDescription>
                    Share of each signup cohort still active in later weeks.
                  </CardDescription>
                </div>
                <Badge tone="success" size="sm">
                  Week 4 median: 42%
                </Badge>
              </CardHeader>
              <CardContent>
                <Heatmap
                  data={RETENTION}
                  rowLabels={COHORTS}
                  columnLabels={['W0', 'W1', 'W2', 'W3', 'W4', 'W5', 'W6', 'W7']}
                  valueFormat={(value) => `${value}%`}
                  label="Weekly retention by cohort"
                />
              </CardContent>
            </Card>

            {/* Top pages */}
            <Card>
              <CardHeader className="flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle>Top pages</CardTitle>
                  <CardDescription>Most-visited routes with engagement quality.</CardDescription>
                </div>
                <Button size="sm" variant="ghost" endIcon={<ArrowUpRightIcon />}>
                  Open in explorer
                </Button>
              </CardHeader>
              <CardContent className="px-0 pb-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Route</TableHead>
                      <TableHead className="text-right">Views</TableHead>
                      <TableHead className="text-right">Bounce rate</TableHead>
                      <TableHead className="text-right">Avg. time</TableHead>
                      <TableHead className="w-24">Trend</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {TOP_PAGES.map((page) => (
                      <TableRow key={page.path}>
                        <TableCell className="font-mono text-xs font-medium text-fg">{page.path}</TableCell>
                        <TableCell className="text-right tabular-nums">{formatNumber(page.views)}</TableCell>
                        <TableCell className="text-right tabular-nums">{page.bounce.toFixed(1)}%</TableCell>
                        <TableCell className="text-right tabular-nums text-fg-muted">{page.time}</TableCell>
                        <TableCell>
                          <Sparkline
                            data={series(page.seed, { count: 20, start: 100, drift: 0.06, bias: page.trend === 'down' ? -0.006 : page.trend === 'up' ? 0.007 : 0, precision: 2 })}
                            tone={page.trend === 'down' ? 'danger' : page.trend === 'up' ? 'success' : 'neutral'}
                            height={26}
                            strokeWidth={1.25}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
