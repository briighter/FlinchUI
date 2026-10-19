'use client';

import { useEffect, useState } from 'react';
import { cn } from '@/lib/cn';
import { formatCompact } from '@/lib/format';
import { mulberry32, series } from '@/lib/random';
import { areaPath, linePath, type Point } from '@/components/ui/chart-shared';
import { useMeasure } from '@/lib/hooks/use-measure';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { IconButton } from '@/components/ui/icon-button';
import { Input } from '@/components/ui/input';
import { NumberInput } from '@/components/ui/number-input';
import { Select } from '@/components/ui/select';
import { Sparkline } from '@/components/ui/sparkline';
import { Switch } from '@/components/ui/switch';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BellIcon,
  BoltIcon,
  ChevronDownIcon,
  FilterIcon,
  SearchIcon,
  SettingsIcon,
} from '@/components/ui/icons';
import { formatThirtySeconds, formatTicks, widthStep } from '../lib/util';

/* ----------------------------------- data ---------------------------------- */

interface Instrument {
  ticker: string;
  name: string;
  sector: 'Notes' | 'Bonds' | 'Sovereign' | 'STIR';
  price: number;
  /** Change expressed in 32nds (or decimals for STIR contracts). */
  change: number;
  volume: number;
  openInterest: number;
  seed: number;
}

const INSTRUMENTS: Instrument[] = [
  { ticker: 'TU1', name: 'US 2Y Note', sector: 'Notes', price: 103 + 14.5 / 32, change: -1.5, volume: 268_412, openInterest: 3_910_224, seed: 101 },
  { ticker: 'FV1', name: 'US 5Y Note', sector: 'Notes', price: 107 + 2.25 / 32, change: 2.5, volume: 512_884, openInterest: 6_204_118, seed: 102 },
  { ticker: 'TY1', name: 'US 10Y Note', sector: 'Notes', price: 110 + 21 / 32, change: 4.5, volume: 1_284_930, openInterest: 4_772_906, seed: 103 },
  { ticker: 'US1', name: 'US 30Y Bond', sector: 'Bonds', price: 118 + 4.5 / 32, change: 7, volume: 486_120, openInterest: 2_148_330, seed: 104 },
  { ticker: 'TN1', name: 'US Ultra Bond', sector: 'Bonds', price: 121 + 27 / 32, change: 9.5, volume: 214_770, openInterest: 1_804_552, seed: 105 },
  { ticker: 'RX1', name: 'Euro-Bund', sector: 'Sovereign', price: 132 + 14 / 32, change: -3, volume: 604_310, openInterest: 1_592_770, seed: 106 },
  { ticker: 'OE1', name: 'Euro-OAT', sector: 'Sovereign', price: 125 + 6 / 32, change: -1.5, volume: 182_440, openInterest: 812_004, seed: 107 },
  { ticker: 'G1', name: 'Long Gilt', sector: 'Sovereign', price: 98 + 20 / 32, change: 2, volume: 121_005, openInterest: 604_881, seed: 108 },
  { ticker: 'JB1', name: '10Y JGB', sector: 'Sovereign', price: 144 + 9 / 32, change: 1.5, volume: 64_220, openInterest: 388_120, seed: 109 },
  { ticker: 'SR3U6', name: 'SOFR Sep 26', sector: 'STIR', price: 96.245, change: 0.5, volume: 388_910, openInterest: 1_210_640, seed: 110 },
  { ticker: 'EDZ6', name: 'Eurodollar Dec 26', sector: 'STIR', price: 95.87, change: -0.5, volume: 145_330, openInterest: 742_005, seed: 111 },
];

const SECTORS: Instrument['sector'][] = ['Notes', 'Bonds', 'Sovereign', 'STIR'];

const TREND = INSTRUMENTS.map((instrument) => ({
  ticker: instrument.ticker,
  data: series(instrument.seed, {
    count: 56,
    start: 100,
    drift: 0.004,
    bias: instrument.change >= 0 ? 0.0006 : -0.0006,
    min: 80,
    max: 122,
    precision: 2,
  }),
}));

const TREND_BY_TICKER = new Map(TREND.map((entry) => [entry.ticker, entry.data]));

interface BookLevel {
  price: number;
  size: number;
}

function buildBook(base: number, seed: number, levels = 9): { bids: BookLevel[]; asks: BookLevel[] } {
  const next = mulberry32(seed);
  const bids: BookLevel[] = [];
  const asks: BookLevel[] = [];
  for (let index = 0; index < levels; index += 1) {
    bids.push({ price: base - (index + 1) / 32, size: 40 + Math.floor(next() * 680) });
    asks.push({ price: base + (index + 1) / 32, size: 40 + Math.floor(next() * 680) });
  }
  return { bids, asks };
}

interface WorkingOrder {
  id: string;
  ticker: string;
  side: 'Buy' | 'Sell';
  quantity: number;
  filled: number;
  price: number;
  venue: string;
  status: 'Working' | 'Partial' | 'Pending';
}

const WORKING_ORDERS: WorkingOrder[] = [
  { id: 'HL-40218', ticker: 'TY1', side: 'Buy', quantity: 2_500, filled: 1_200, price: 110 + 20 / 32, venue: 'CME Globex', status: 'Partial' },
  { id: 'HL-40216', ticker: 'RX1', side: 'Sell', quantity: 800, filled: 0, price: 132 + 15 / 32, venue: 'Eurex', status: 'Working' },
  { id: 'HL-40211', ticker: 'US1', side: 'Buy', quantity: 400, filled: 400, price: 118 + 3 / 32, venue: 'CME Globex', status: 'Working' },
  { id: 'HL-40204', ticker: 'FV1', side: 'Sell', quantity: 3_000, filled: 2_650, price: 107 + 3 / 32, venue: 'CME Globex', status: 'Partial' },
  { id: 'HL-40198', ticker: 'G1', side: 'Buy', quantity: 600, filled: 0, price: 98 + 19 / 32, venue: 'ICE Futures', status: 'Pending' },
  { id: 'HL-40190', ticker: 'SR3U6', side: 'Sell', quantity: 5_000, filled: 5_000, price: 96.25, venue: 'CME Globex', status: 'Working' },
];

/* -------------------------------- sub-views -------------------------------- */

function DepthChart({ bids, asks, height = 116 }: { bids: BookLevel[]; asks: BookLevel[]; height?: number }) {
  const [ref, { width }] = useMeasure<HTMLDivElement>();
  const w = width || 1;
  const half = w / 2;

  let cumulative = 0;
  const bidCurve = bids.map((level, index) => {
    cumulative += level.size;
    return { x: half - (index / Math.max(1, bids.length - 1)) * half, y: cumulative };
  });
  cumulative = 0;
  const askCurve = asks.map((level, index) => {
    cumulative += level.size;
    return { x: half + (index / Math.max(1, asks.length - 1)) * half, y: cumulative };
  });

  const max = Math.max(bidCurve[bidCurve.length - 1]?.y ?? 1, askCurve[askCurve.length - 1]?.y ?? 1, 1);
  const toPoints = (curve: { x: number; y: number }[]): Point[] =>
    curve.map((point) => [point.x, height - (point.y / max) * (height - 8)]);

  return (
    <div ref={ref} className="w-full">
      <svg width="100%" height={height} viewBox={`0 0 ${w} ${height}`} aria-hidden="true">
        <path d={areaPath(toPoints(bidCurve), height)} fill="var(--color-success)" fillOpacity={0.16} stroke="none" />
        <path
          d={linePath(toPoints(bidCurve))}
          fill="none"
          stroke="var(--color-success)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        <path d={areaPath(toPoints(askCurve), height)} fill="var(--color-danger)" fillOpacity={0.16} stroke="none" />
        <path
          d={linePath(toPoints(askCurve))}
          fill="none"
          stroke="var(--color-danger)"
          strokeWidth={1.5}
          vectorEffect="non-scaling-stroke"
        />
        <line x1={half} x2={half} y1={0} y2={height} stroke="var(--color-border-strong)" strokeWidth={1} strokeDasharray="3 3" />
      </svg>
    </div>
  );
}

function BookLadder({ bids, asks }: { bids: BookLevel[]; asks: BookLevel[] }) {
  const maxSize = Math.max(...bids.map((level) => level.size), ...asks.map((level) => level.size), 1);
  const bestBid = bids[0]!.price;
  const bestAsk = asks[0]!.price;
  const spread = Math.round((bestAsk - bestBid) * 32 * 2) / 2;

  return (
    <div className="flex flex-col font-mono text-xs">
      {[...asks].reverse().map((level) => (
        <div key={`ask-${level.price}`} className="relative flex items-center justify-between px-3 py-[3px]">
          <span aria-hidden="true" className={cn('absolute inset-y-0 right-0 bg-danger/12', widthStep(level.size / maxSize))} />
          <span className="relative tabular-nums text-danger-fg">{formatThirtySeconds(level.price)}</span>
          <span className="relative tabular-nums text-fg-muted">{level.size}</span>
        </div>
      ))}

      <div className="my-1 flex items-center justify-between border-y border-border bg-surface-sunken px-3 py-1 text-[11px]">
        <span className="text-fg-subtle">Spread</span>
        <span className="font-sans font-semibold text-fg">{spread} ticks</span>
      </div>

      {bids.map((level) => (
        <div key={`bid-${level.price}`} className="relative flex items-center justify-between px-3 py-[3px]">
          <span aria-hidden="true" className={cn('absolute inset-y-0 right-0 bg-success/12', widthStep(level.size / maxSize))} />
          <span className="relative tabular-nums text-success-fg">{formatThirtySeconds(level.price)}</span>
          <span className="relative tabular-nums text-fg-muted">{level.size}</span>
        </div>
      ))}
    </div>
  );
}

/* ---------------------------------- app ------------------------------------ */

export function TradingTerminal() {
  const [selected, setSelected] = useState('TY1');
  const [side, setSide] = useState<'Buy' | 'Sell'>('Buy');
  const [quantity, setQuantity] = useState(2500);
  const [orderType, setOrderType] = useState('limit');
  const [algo, setAlgo] = useState(false);
  const [clock, setClock] = useState<string | null>(null);

  useEffect(() => {
    const tick = () =>
      setClock(new Date().toLocaleTimeString('en-US', { hour12: false, timeZone: 'America/Chicago' }));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  const instrument = INSTRUMENTS.find((entry) => entry.ticker === selected) ?? INSTRUMENTS[2]!;
  const book = buildBook(instrument.price, instrument.seed + 7);
  const positive = instrument.change >= 0;

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg text-fg">
      {/* Title bar */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand"
        >
          H
        </span>
        <span className="text-sm font-semibold tracking-tight">Helios</span>
        <span className="text-xs text-fg-subtle">Rates Desk</span>
        <Badge tone="success" size="sm" dot>
          RTH
        </Badge>

        <span className="ml-2 hidden items-center gap-2 text-xs text-fg-subtle sm:flex">
          <span className="tabular-nums">{clock ?? '--:--:--'}</span>
          <span>CT</span>
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <IconButton label="Search instruments" size="sm" variant="ghost">
            <SearchIcon />
          </IconButton>
          <IconButton label="Notifications" size="sm" variant="ghost">
            <BellIcon />
          </IconButton>
          <IconButton label="Settings" size="sm" variant="ghost">
            <SettingsIcon />
          </IconButton>
          <Button size="sm" variant="secondary" startIcon={<BoltIcon />}>
            Flatten book
          </Button>
          <Avatar name="Dana Whitlock" size="sm" status="online" />
        </div>
      </header>

      {/* Filter bar */}
      <div className="flex h-10 shrink-0 items-center gap-2 border-b border-border bg-surface px-4">
        <ButtonGroup>
          <Button size="sm" variant="ghost">
            Blotter
          </Button>
          <Button size="sm" variant="ghost">
            Risk
          </Button>
          <Button size="sm" variant="ghost">
            Curves
          </Button>
        </ButtonGroup>
        <span aria-hidden="true" className="h-4 w-px bg-border" />
        <span className="flex items-center gap-1.5 text-xs text-fg-subtle">
          <FilterIcon className="size-3.5" />
          Book: <span className="font-medium text-fg">RATES-PRIMARY</span>
        </span>
        <span className="ml-auto flex items-center gap-2 text-xs text-fg-subtle">
          <span className="hidden sm:inline">Show implieds</span>
          <Switch checked={algo} onCheckedChange={setAlgo} size="sm" label="Toggle algo orders" />
        </span>
      </div>

      <div className="flex min-h-0 flex-1 flex-col">
        <div className="grid min-h-0 flex-1 grid-cols-[248px_minmax(0,1fr)_300px] divide-x divide-border overflow-hidden">
          {/* Watchlist */}
          <div className="flex min-h-0 flex-col overflow-hidden bg-surface">
            <div className="flex items-center justify-between border-b border-border px-3 py-2">
              <span className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
                Watchlist
              </span>
              <span className="text-[11px] text-fg-subtle">{INSTRUMENTS.length}</span>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto">
              {SECTORS.map((sector) => (
                <div key={sector}>
                  <p className="bg-surface-sunken/60 px-3 py-1 text-[10px] font-semibold tracking-wide text-fg-subtle uppercase">
                    {sector}
                  </p>
                  {INSTRUMENTS.filter((entry) => entry.sector === sector).map((entry) => {
                    const up = entry.change >= 0;
                    const active = entry.ticker === selected;
                    return (
                      <button
                        key={entry.ticker}
                        type="button"
                        onClick={() => setSelected(entry.ticker)}
                        aria-pressed={active}
                        className={cn(
                          'relative flex w-full items-center gap-2 border-l-2 px-3 py-1.5 text-left transition-colors',
                          active
                            ? 'border-brand-600 bg-brand-50/60 dark:bg-brand-950/40'
                            : 'border-transparent hover:bg-surface-sunken',
                        )}
                      >
                        <span className="flex w-14 shrink-0 flex-col">
                          <span className="font-mono text-xs font-semibold text-fg">{entry.ticker}</span>
                          <span className="truncate text-[10px] text-fg-subtle">{entry.name}</span>
                        </span>
                        <span className="h-6 w-12 shrink-0">
                          <Sparkline
                            data={TREND_BY_TICKER.get(entry.ticker) ?? []}
                            tone={up ? 'success' : 'danger'}
                            height={24}
                            strokeWidth={1.25}
                          />
                        </span>
                        <span className="ml-auto flex shrink-0 flex-col items-end font-mono">
                          <span className="text-xs tabular-nums text-fg">
                            {formatThirtySeconds(entry.price)}
                          </span>
                          <span
                            className={cn(
                              'text-[10px] tabular-nums',
                              up ? 'text-success-fg' : 'text-danger-fg',
                            )}
                          >
                            {formatTicks(entry.change)}
                          </span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Centre: instrument + book + depth */}
          <div className="flex min-h-0 flex-col overflow-y-auto">
            <div className="flex flex-wrap items-end gap-x-8 gap-y-4 border-b border-border bg-surface px-5 py-4">
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-mono text-lg font-bold tracking-tight text-fg">
                    {instrument.ticker}
                  </h1>
                  <Badge tone="neutral" size="sm">
                    {instrument.sector}
                  </Badge>
                </div>
                <p className="mt-0.5 text-xs text-fg-subtle">{instrument.name} · CME Globex</p>
              </div>

              <div className="flex items-baseline gap-3">
                <span
                  className={cn(
                    'font-mono text-4xl font-bold tabular-nums tracking-tight',
                    positive ? 'text-success-fg' : 'text-danger-fg',
                  )}
                >
                  {formatThirtySeconds(instrument.price)}
                </span>
                <span
                  className={cn(
                    'font-mono text-sm font-semibold tabular-nums',
                    positive ? 'text-success-fg' : 'text-danger-fg',
                  )}
                >
                  {formatTicks(instrument.change)}
                </span>
              </div>

              <dl className="flex flex-wrap gap-x-8 gap-y-2 text-xs">
                {[
                  { label: 'Day range', value: `${formatThirtySeconds(instrument.price - 9 / 32)} – ${formatThirtySeconds(instrument.price + 7 / 32)}` },
                  { label: 'Volume', value: formatCompact(instrument.volume) },
                  { label: 'Open interest', value: formatCompact(instrument.openInterest) },
                  { label: 'Last', value: formatCompact(Math.round(instrument.volume / 42)) },
                ].map((item) => (
                  <div key={item.label}>
                    <dt className="text-fg-subtle">{item.label}</dt>
                    <dd className="mt-0.5 font-mono font-medium tabular-nums text-fg">{item.value}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="grid flex-1 grid-cols-2 divide-x divide-border">
              <div className="flex min-h-0 flex-col">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
                    Order book
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-fg-subtle">
                    <span className="font-mono">32nds</span>
                    <ChevronDownIcon className="size-3" />
                  </span>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto py-1">
                  <BookLadder bids={book.bids} asks={book.asks} />
                </div>
              </div>

              <div className="flex min-h-0 flex-col">
                <div className="flex items-center justify-between border-b border-border px-4 py-2">
                  <span className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
                    Market depth
                  </span>
                  <Badge tone="outline" size="sm">
                    {formatCompact(instrument.volume)} traded
                  </Badge>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto p-4">
                  <DepthChart bids={book.bids} asks={book.asks} />
                  <div className="mt-2 flex justify-between text-[11px] text-fg-subtle">
                    <span className="text-success-fg">Bids</span>
                    <span className="font-mono">{formatThirtySeconds(instrument.price)}</span>
                    <span className="text-danger-fg">Asks</span>
                  </div>

                  <Tabs defaultValue="tape" className="mt-5">
                    <TabsList>
                      <TabsTrigger value="tape">Tape</TabsTrigger>
                      <TabsTrigger value="stats">Statistics</TabsTrigger>
                    </TabsList>
                    <TabsContent value="tape">
                      <ul className="divide-y divide-border font-mono text-xs">
                        {Array.from({ length: 6 }).map((_, index) => {
                          const next = mulberry32(instrument.seed * 13 + index);
                          const buy = next() > 0.45;
                          return (
                            <li key={index} className="flex items-center justify-between py-1.5">
                              <span className="tabular-nums text-fg-subtle">
                                {String(14).padStart(2, '0')}:{String(31 + index).padStart(2, '0')}:{String(Math.floor(next() * 60)).padStart(2, '0')}
                              </span>
                              <span className={cn('tabular-nums', buy ? 'text-success-fg' : 'text-danger-fg')}>
                                {buy ? 'B' : 'S'} {50 + Math.floor(next() * 900)}
                              </span>
                              <span className="tabular-nums text-fg">
                                {formatThirtySeconds(instrument.price + (buy ? 1 : -1) / 32)}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </TabsContent>
                    <TabsContent value="stats">
                      <dl className="grid grid-cols-2 gap-3 text-xs">
                        {[
                          ['Settlement', formatThirtySeconds(instrument.price - 3 / 32)],
                          ['Prior settle', formatThirtySeconds(instrument.price - instrument.change / 32)],
                          ['Tick value', '$31.25'],
                          ['Contract size', '$100,000'],
                          ['Last roll', 'Sep 4'],
                          ['Clearing house', 'CME'],
                        ].map(([label, value]) => (
                          <div key={label} className="rounded-md border border-border p-2.5">
                            <dt className="text-fg-subtle">{label}</dt>
                            <dd className="mt-0.5 font-mono font-medium tabular-nums text-fg">{value}</dd>
                          </div>
                        ))}
                      </dl>
                    </TabsContent>
                  </Tabs>
                </div>
              </div>
            </div>
          </div>

          {/* Order ticket */}
          <div className="flex min-h-0 flex-col overflow-y-auto bg-surface">
            <div className="flex items-center justify-between border-b border-border px-4 py-2">
              <span className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
                Order ticket
              </span>
              <IconButton label="Ticket settings" size="sm" variant="ghost">
                <SettingsIcon />
              </IconButton>
            </div>

            <div className="flex flex-1 flex-col gap-4 p-4">
              <div className="grid grid-cols-2 gap-2">
                {(['Buy', 'Sell'] as const).map((option) => (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={side === option}
                    onClick={() => setSide(option)}
                    className={cn(
                      'rounded-md border px-3 py-2 text-sm font-semibold transition-colors',
                      side === option
                        ? option === 'Buy'
                          ? 'border-transparent bg-success text-white'
                          : 'border-transparent bg-danger text-white'
                        : 'border-border bg-surface text-fg-muted hover:border-border-strong hover:text-fg',
                    )}
                  >
                    {option}
                  </button>
                ))}
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-fg-muted">Quantity</span>
                <NumberInput value={quantity} onValueChange={(value) => setQuantity(value)} min={1} step={50} />
              </label>

              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-fg-muted">Type</span>
                  <Select
                    value={orderType}
                    onChange={(event) => setOrderType(event.target.value)}
                    options={[
                      { label: 'Limit', value: 'limit' },
                      { label: 'Market', value: 'market' },
                      { label: 'Stop limit', value: 'stop' },
                    ]}
                  />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-fg-muted">TIF</span>
                  <Select
                    defaultValue="day"
                    options={[
                      { label: 'Day', value: 'day' },
                      { label: 'GTC', value: 'gtc' },
                      { label: 'IOC', value: 'ioc' },
                      { label: 'FOK', value: 'fok' },
                    ]}
                  />
                </label>
              </div>

              <label className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-fg-muted">Limit price</span>
                <Input
                  className="font-mono"
                  defaultValue={formatThirtySeconds(
                    side === 'Buy' ? instrument.price + 0.5 / 32 : instrument.price - 0.5 / 32,
                  )}
                  aria-label="Limit price"
                />
              </label>

              <div className="rounded-md border border-border bg-surface-sunken p-3">
                <dl className="flex flex-col gap-1.5 text-xs">
                  {[
                    ['Notional', `$${formatCompact(quantity * 1000)}`],
                    ['Est. margin', `$${formatCompact(quantity * 412)}`],
                    ['Tick value', '$12.50'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex items-center justify-between">
                      <dt className="text-fg-subtle">{label}</dt>
                      <dd className="font-mono font-medium tabular-nums text-fg">{value}</dd>
                    </div>
                  ))}
                </dl>
              </div>

              <Button
                variant={side === 'Buy' ? 'primary' : 'danger'}
                fullWidth
                className="mt-auto"
              >
                {side === 'Buy' ? 'Buy' : 'Sell'} {quantity.toLocaleString()} {instrument.ticker}
              </Button>
            </div>
          </div>
        </div>

        {/* Blotter */}
        <section className="flex h-52 shrink-0 flex-col border-t border-border bg-surface">
          <div className="flex items-center gap-3 border-b border-border px-4 py-2">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              Working orders
            </h2>
            <Badge tone="neutral" size="sm">
              {WORKING_ORDERS.length}
            </Badge>
            <span className="ml-auto flex items-center gap-3 text-[11px] text-fg-subtle">
              <span>
                Filled today <span className="font-mono font-medium text-fg">1,842</span>
              </span>
              <span>
                Rejects <span className="font-mono font-medium text-fg">0</span>
              </span>
            </span>
          </div>
          <div className="min-h-0 flex-1 overflow-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Contract</TableHead>
                  <TableHead>Side</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-right">Qty</TableHead>
                  <TableHead className="text-right">Filled</TableHead>
                  <TableHead>Venue</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-24">Progress</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {WORKING_ORDERS.map((order) => {
                  const ratio = order.filled / order.quantity;
                  return (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-xs text-fg-muted">{order.id}</TableCell>
                      <TableCell className="font-mono text-xs font-medium">{order.ticker}</TableCell>
                      <TableCell>
                        <Badge tone={order.side === 'Buy' ? 'success' : 'danger'} size="sm">
                          {order.side}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {formatThirtySeconds(order.price)}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {order.quantity.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-mono text-xs tabular-nums">
                        {order.filled.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-xs text-fg-muted">{order.venue}</TableCell>
                      <TableCell>
                        <Badge
                          tone={order.status === 'Pending' ? 'warning' : order.status === 'Partial' ? 'info' : 'neutral'}
                          size="sm"
                        >
                          {order.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="flex items-center gap-2">
                          <span className="relative h-1.5 w-16 overflow-hidden rounded-full bg-surface-sunken">
                            <span
                              className={cn(
                                'absolute inset-y-0 left-0 rounded-full',
                                order.side === 'Buy' ? 'bg-success' : 'bg-danger',
                                widthStep(ratio),
                              )}
                            />
                          </span>
                          <span className="font-mono text-[10px] tabular-nums text-fg-subtle">
                            {Math.round(ratio * 100)}%
                          </span>
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </section>
      </div>
    </div>
  );
}
