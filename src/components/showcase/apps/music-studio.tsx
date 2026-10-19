'use client';

import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { mulberry32 } from '@/lib/random';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Card } from '@/components/ui/card';
import { IconButton } from '@/components/ui/icon-button';
import { NumberInput } from '@/components/ui/number-input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toggle } from '@/components/ui/toggle';
import {
  DownloadIcon,
  LayersIcon,
  PencilIcon,
  SettingsIcon,
  SparklesIcon,
  TrashIcon,
  UploadIcon,
} from '@/components/ui/icons';
import { heightStep } from '../lib/util';

/* ----------------------------------- data ---------------------------------- */

interface Voice {
  id: string;
  name: string;
  group: 'Drums' | 'Percussion';
  tone: 'brand' | 'info' | 'success' | 'warning' | 'danger';
  pattern: string;
  level: number;
  pan: number;
}

const VOICES: Voice[] = [
  { id: 'kick', name: 'Kick', group: 'Drums', tone: 'brand', pattern: 'x...x...x...x...', level: 88, pan: 0 },
  { id: 'snare', name: 'Snare', group: 'Drums', tone: 'info', pattern: '....x.......x...', level: 76, pan: 0 },
  { id: 'clap', name: 'Clap', group: 'Drums', tone: 'info', pattern: '....x.......x..x', level: 62, pan: -18 },
  { id: 'ch', name: 'Hat closed', group: 'Drums', tone: 'success', pattern: 'x.x.x.x.x.x.x.x.', level: 54, pan: 22 },
  { id: 'oh', name: 'Hat open', group: 'Drums', tone: 'success', pattern: '..x...x...x...x.', level: 48, pan: 26 },
  { id: 'tom', name: 'Tom low', group: 'Percussion', tone: 'warning', pattern: '..............x.', level: 58, pan: -34 },
  { id: 'rim', name: 'Rim', group: 'Percussion', tone: 'danger', pattern: '..x...x.....x...', level: 44, pan: 40 },
  { id: 'ride', name: 'Ride', group: 'Percussion', tone: 'brand', pattern: 'x.x.x.x.x.x.x.x.', level: 40, pan: -12 },
];

const TONE_BG: Record<Voice['tone'], string> = {
  brand: 'bg-brand-500',
  info: 'bg-info',
  success: 'bg-success',
  warning: 'bg-warning',
  danger: 'bg-danger',
};

const TONE_BG_SOFT: Record<Voice['tone'], string> = {
  brand: 'bg-brand-500/25',
  info: 'bg-info/25',
  success: 'bg-success/25',
  warning: 'bg-warning/25',
  danger: 'bg-danger/25',
};

const TONE_TEXT: Record<Voice['tone'], string> = {
  brand: 'text-brand-700 dark:text-brand-300',
  info: 'text-info-fg',
  success: 'text-success-fg',
  warning: 'text-warning-fg',
  danger: 'text-danger-fg',
};

/** A deterministic pseudo-waveform: a noise burst shaped by a per-voice envelope. */
function waveform(seed: number, shape: 'decay' | 'punch' | 'sustain' | 'noise', count = 96): number[] {
  const next = mulberry32(seed);
  return Array.from({ length: count }, (_, index) => {
    const t = index / (count - 1);
    const envelope =
      shape === 'decay'
        ? Math.pow(1 - t, 2.4)
        : shape === 'punch'
          ? Math.pow(1 - t, 0.9)
          : shape === 'sustain'
            ? 0.55 + 0.45 * Math.sin(t * Math.PI)
            : Math.pow(1 - t, 4) * (0.6 + 0.4 * Math.abs(Math.sin(t * 40)));
    const noise = 0.35 + next() * 0.65;
    return Math.min(1, envelope * noise + 0.04);
  });
}

const SHAPE_BY_VOICE: Record<string, 'decay' | 'punch' | 'sustain' | 'noise'> = {
  kick: 'decay',
  snare: 'punch',
  clap: 'punch',
  ch: 'noise',
  oh: 'noise',
  tom: 'decay',
  rim: 'noise',
  ride: 'sustain',
};

const KITS = [
  { name: 'Analog Drums 01', author: 'Foundry', size: '14.2 MB', active: true },
  { name: 'Tape Room', author: 'Nadia Brekke', size: '22.8 MB', active: false },
  { name: 'Modular Blips', author: 'Ossian Vale', size: '8.4 MB', active: false },
  { name: 'Dust & Room', author: 'Foundry', size: '31.6 MB', active: false },
];

const STEPS = 16;

function parsePattern(pattern: string): boolean[] {
  return Array.from({ length: STEPS }, (_, index) => pattern[index % pattern.length] === 'x');
}

/* ---------------------------------- app ------------------------------------ */

export function MusicStudio() {
  const [grid, setGrid] = useState<Record<string, boolean[]>>(() =>
    Object.fromEntries(VOICES.map((voice) => [voice.id, parsePattern(voice.pattern)])),
  );
  const [playing, setPlaying] = useState(false);
  const [metronome, setMetronome] = useState(false);
  const [tempo, setTempo] = useState(124);
  const [swing, setSwing] = useState(18);
  const [master, setMaster] = useState(82);
  const [head, setHead] = useState(0);
  const [selected, setSelected] = useState('kick');

  useEffect(() => {
    if (!playing) {
      setHead(0);
      return;
    }
    const interval = window.setInterval(
      () => setHead((previous) => (previous + 1) % STEPS),
      (60_000 / tempo) / 4,
    );
    return () => window.clearInterval(interval);
  }, [playing, tempo]);

  const voice = VOICES.find((entry) => entry.id === selected) ?? VOICES[0]!;
  const samples = useMemo(() => waveform(900 + VOICES.indexOf(voice), SHAPE_BY_VOICE[voice.id] ?? 'punch'), [voice]);
  const activeSteps = Object.values(grid).reduce(
    (sum, steps) => sum + steps.filter(Boolean).length,
    0,
  );

  function toggleStep(voiceId: string, index: number) {
    setGrid((previous) => ({
      ...previous,
      [voiceId]: previous[voiceId]!.map((value, step) => (step === index ? !value : value)),
    }));
  }

  function clearPattern() {
    setGrid(Object.fromEntries(VOICES.map((entry) => [entry.id, Array.from({ length: STEPS }, () => false)])));
  }

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg text-fg">
      {/* Transport */}
      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <span aria-hidden="true" className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand">
          F
        </span>
        <span className="text-sm font-semibold tracking-tight">Foundry</span>
        <Badge tone="neutral" size="sm">
          Analog Drums 01
        </Badge>

        <span aria-hidden="true" className="mx-1 h-5 w-px bg-border" />

        <ButtonGroup>
          <Toggle pressed={playing} onPressedChange={setPlaying} variant="primary" size="sm" label="Play pattern">
            {playing ? 'Pause' : 'Play'}
          </Toggle>
          <Button
            size="sm"
            variant="secondary"
            onClick={() => {
              setPlaying(false);
              setHead(0);
            }}
          >
            Stop
          </Button>
        </ButtonGroup>

        <label className="flex items-center gap-2 text-xs text-fg-muted">
          Tempo
          <NumberInput
            value={tempo}
            onValueChange={(value) => setTempo(Math.min(200, Math.max(40, value || 40)))}
            min={40}
            max={200}
            step={1}
            className="w-20"
            aria-label="Tempo in beats per minute"
          />
          <span className="text-fg-subtle">BPM</span>
        </label>

        <label className="flex items-center gap-2 text-xs text-fg-muted">
          Metronome
          <Switch checked={metronome} onCheckedChange={setMetronome} size="sm" label="Toggle metronome" />
        </label>

        <div className="ml-auto flex items-center gap-3">
          <label className="hidden items-center gap-2 text-xs text-fg-muted lg:flex">
            Master
            <Slider
              value={master}
              onChange={(event) => setMaster(Number(event.target.value))}
              className="w-28"
              aria-label="Master level"
            />
            <span className="w-8 text-right tabular-nums text-fg">{master}</span>
          </label>
          <IconButton label="Save pattern" size="sm" variant="ghost">
            <DownloadIcon />
          </IconButton>
          <IconButton label="Pattern settings" size="sm" variant="ghost">
            <SettingsIcon />
          </IconButton>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_320px] divide-x divide-border overflow-hidden">
        {/* Sequencer */}
        <div className="flex min-h-0 flex-col overflow-y-auto">
          <div className="flex flex-wrap items-center gap-2 border-b border-border px-4 py-2.5">
            <h1 className="text-sm font-semibold text-fg">Pattern A1</h1>
            <Badge tone="brand" size="sm">
              {activeSteps} steps
            </Badge>
            <span className="text-xs text-fg-subtle">16 steps · 1 bar · 4/4</span>
            <div className="ml-auto flex items-center gap-2">
              <Button size="sm" variant="ghost" startIcon={<SparklesIcon />}>
                Randomise
              </Button>
              <Button size="sm" variant="ghost" startIcon={<TrashIcon />} onClick={clearPattern}>
                Clear
              </Button>
            </div>
          </div>

          <div className="p-4">
            <div className="overflow-x-auto">
              <div className="min-w-[560px]">
                {/* Step ruler */}
                <div className="mb-1 flex items-center gap-1 pl-32">
                  {Array.from({ length: STEPS }, (_, index) => (
                    <span
                      key={index}
                      className={cn(
                        'flex-1 text-center text-[10px] tabular-nums',
                        index % 4 === 0 ? 'font-semibold text-fg-muted' : 'text-fg-subtle',
                        playing && head === index ? 'text-brand-600' : undefined,
                      )}
                    >
                      {index % 4 === 0 ? index / 4 + 1 : '·'}
                    </span>
                  ))}
                </div>

                {VOICES.map((entry) => {
                  const steps = grid[entry.id]!;
                  const isSelected = entry.id === selected;
                  return (
                    <div
                      key={entry.id}
                      className={cn(
                        'flex items-center gap-1 rounded-md py-1',
                        isSelected && 'bg-surface-sunken',
                      )}
                    >
                      <button
                        type="button"
                        onClick={() => setSelected(entry.id)}
                        aria-pressed={isSelected}
                        className="flex w-32 shrink-0 items-center gap-2 pr-2 text-left"
                      >
                        <span aria-hidden="true" className={cn('size-1.5 shrink-0 rounded-full', TONE_BG[entry.tone])} />
                        <span className={cn('truncate text-xs', isSelected ? 'font-semibold text-fg' : 'text-fg-muted')}>
                          {entry.name}
                        </span>
                      </button>

                      {steps.map((on, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-pressed={on}
                          aria-label={`${entry.name} step ${index + 1}`}
                          onClick={() => toggleStep(entry.id, index)}
                          className={cn(
                            'h-7 flex-1 rounded-sm border transition-colors',
                            index % 4 === 0 ? 'border-border-strong' : 'border-border',
                            on
                              ? cn('border-transparent', TONE_BG[entry.tone])
                              : cn('bg-surface', index % 4 === 0 ? TONE_BG_SOFT[entry.tone] : 'bg-surface-sunken/40'),
                            playing && head === index ? 'ring-2 ring-brand-500/60' : undefined,
                            !on && playing && head === index ? 'bg-brand-100' : undefined,
                          )}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Sample editor */}
          <div className="border-t border-border px-4 py-4">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-xs font-semibold tracking-wide text-fg-subtle uppercase">
                Sample editor
              </h2>
              <Badge tone="neutral" size="sm">
                {voice.name}.wav
              </Badge>
              <span className="text-xs text-fg-subtle">44.1 kHz · 24-bit · 0.84 s</span>
              <span className="ml-auto flex items-center gap-1.5">
                <IconButton label="Upload sample" size="sm" variant="ghost">
                  <UploadIcon />
                </IconButton>
                <IconButton label="Trim sample" size="sm" variant="ghost">
                  <PencilIcon />
                </IconButton>
                <IconButton label="Layer sample" size="sm" variant="ghost">
                  <LayersIcon />
                </IconButton>
              </span>
            </div>

            <div className="mt-3 overflow-hidden rounded-lg border border-border bg-surface-sunken px-3">
              <div className="flex h-24 items-center gap-[3px]">
                {samples.map((sample, index) => (
                  <span
                    key={index}
                    aria-hidden="true"
                    className={cn(
                      'w-[3px] shrink-0 rounded-full opacity-80',
                      TONE_BG[voice.tone],
                      heightStep(Math.max(0.04, sample)),
                    )}
                  />
                ))}
              </div>
            </div>

            <div className="mt-3 grid gap-4 sm:grid-cols-3">
              {[
                { label: 'Attack', value: 12 },
                { label: 'Decay', value: 46 },
                { label: 'Tune', value: 50 },
              ].map((control) => (
                <label key={control.label} className="flex flex-col gap-1.5">
                  <span className="flex items-center justify-between text-xs text-fg-muted">
                    {control.label}
                    <span className="tabular-nums text-fg">{control.value}</span>
                  </span>
                  <Slider defaultValue={control.value} aria-label={control.label} />
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Kit + mixer */}
        <aside className="flex min-h-0 flex-col overflow-y-auto bg-surface">
          <Tabs defaultValue="mixer" className="flex min-h-0 flex-1 flex-col gap-0">
            <TabsList className="px-3">
              <TabsTrigger value="mixer">Mixer</TabsTrigger>
              <TabsTrigger value="kits">Kits</TabsTrigger>
              <TabsTrigger value="swing">Groove</TabsTrigger>
            </TabsList>

            <TabsContent value="mixer" className="p-3">
              <div className="flex flex-col gap-3">
                {VOICES.map((entry) => (
                  <Card key={entry.id} padding="sm" className="flex flex-col gap-2.5">
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true" className={cn('size-2 rounded-full', TONE_BG[entry.tone])} />
                      <span className="text-xs font-medium text-fg">{entry.name}</span>
                      <span className="ml-auto text-[10px] tabular-nums text-fg-subtle">{entry.group}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-8 text-[10px] text-fg-subtle">Lvl</span>
                      <Slider defaultValue={entry.level} aria-label={`${entry.name} level`} className="flex-1" />
                      <span className="w-6 text-right text-[10px] tabular-nums text-fg-muted">
                        {entry.level}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="w-8 text-[10px] text-fg-subtle">Pan</span>
                      <Slider
                        defaultValue={entry.pan + 50}
                        min={0}
                        max={100}
                        aria-label={`${entry.name} pan`}
                        className="flex-1"
                      />
                      <span className="w-6 text-right text-[10px] tabular-nums text-fg-muted">
                        {entry.pan === 0 ? 'C' : entry.pan < 0 ? `L${Math.abs(entry.pan)}` : `R${entry.pan}`}
                      </span>
                    </div>

                    <div className="flex items-end gap-1">
                      <span className="flex h-8 flex-1 items-end gap-[2px] overflow-hidden rounded-sm bg-surface-sunken p-[2px]">
                        {waveform(4200 + VOICES.indexOf(entry), 'noise', 14).map((meter, index) => (
                          <span
                            key={index}
                            className={cn(
                              'w-full rounded-xs opacity-70',
                              TONE_BG[entry.tone],
                              heightStep(Math.max(0.06, meter)),
                            )}
                          />
                        ))}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="kits" className="p-3">
              <ul className="flex flex-col gap-2">
                {KITS.map((kit) => (
                  <li key={kit.name}>
                    <button
                      type="button"
                      aria-pressed={kit.active}
                      className={cn(
                        'flex w-full items-center gap-3 rounded-lg border p-3 text-left transition-colors',
                        kit.active
                          ? 'border-brand-500 bg-brand-50/60 dark:bg-brand-950/40'
                          : 'border-border hover:border-border-strong',
                      )}
                    >
                      <span className={cn('flex size-8 items-center justify-center rounded-md text-xs font-bold', kit.active ? 'bg-brand-600 text-fg-on-brand' : 'bg-surface-sunken text-fg-muted')}>
                        {kit.name.slice(0, 1)}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium text-fg">{kit.name}</span>
                        <span className="block truncate text-xs text-fg-subtle">
                          {kit.author} · {kit.size}
                        </span>
                      </span>
                      {kit.active ? <Badge tone="brand" size="sm">Loaded</Badge> : <DownloadIcon className="size-4 text-fg-subtle" />}
                    </button>
                  </li>
                ))}
              </ul>
            </TabsContent>

            <TabsContent value="swing" className="p-4">
              <div className="flex flex-col gap-5">
                <label className="flex flex-col gap-2">
                  <span className="flex items-center justify-between text-xs text-fg-muted">
                    Swing
                    <span className="tabular-nums text-fg">{swing}%</span>
                  </span>
                  <Slider value={swing} onChange={(event) => setSwing(Number(event.target.value))} aria-label="Swing amount" />
                </label>

                <div>
                  <p className="text-xs font-semibold text-fg">Groove template</p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    {['Straight', 'MPC 54%', 'MPC 58%', 'Dilla', 'Shuffle'].map((template, index) => (
                      <button
                        key={template}
                        type="button"
                        aria-pressed={index === 1}
                        className={cn(
                          'rounded-md border px-3 py-2 text-left text-xs transition-colors',
                          index === 1
                            ? 'border-brand-500 bg-brand-50/60 text-fg dark:bg-brand-950/40'
                            : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
                        )}
                      >
                        {template}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-border bg-surface-sunken p-3">
                  <p className="text-xs font-medium text-fg">Humanise</p>
                  <p className="mt-1 text-xs leading-5 text-fg-muted">
                    Adds ±{swing / 4} ms of timing jitter and ±{Math.round(swing / 6)} velocity variation
                    to each step.
                  </p>
                  <div className="mt-2 flex gap-1">
                    {Array.from({ length: 12 }, (_, index) => (
                      <span
                        key={index}
                        aria-hidden="true"
                        className={cn('h-6 flex-1 rounded-sm', index % 3 === 0 ? 'bg-brand-500/70' : 'bg-border')}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="shrink-0 border-t border-border p-3">
            <div className="flex items-center gap-2 text-[10px] text-fg-subtle">
              <span className={cn('size-1.5 rounded-full', playing ? 'bg-success' : 'bg-fg-subtle')} />
              Engine: {playing ? 'running' : 'stopped'} · 128 voices · 3.1% DSP
              <span className={cn('ml-auto', TONE_TEXT[voice.tone])}>{Math.round((master / 100) * 100)}%</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
