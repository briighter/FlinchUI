'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { toHex, type Oklch } from '../lib/color';
import {
  DEFAULT_CONTROLS,
  SEED_PRESETS,
  auditTheme,
  generateTheme,
  themeToCss,
  type ThemeControls,
  type ThemeMode,
} from '../lib/theme';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CodeBlock } from '@/components/ui/code-block';
import { ColorSwatch } from '@/components/ui/color-swatch';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { RadioGroup } from '@/components/ui/radio-group';
import { Select } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Sparkline } from '@/components/ui/sparkline';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  CheckIcon,
  RefreshIcon,
  SparklesIcon,
  XIcon,
} from '@/components/ui/icons';
import { series } from '@/lib/random';

const HUE_STEPS = Array.from({ length: 24 }, (_, index) => index * 15);

const PREVIEW_TREND = series(611, { count: 24, start: 100, drift: 0.06, bias: 0.004, precision: 2 });

export function ThemeGenerator() {
  const [controls, setControls] = useState<ThemeControls>(DEFAULT_CONTROLS);

  const theme = useMemo(() => generateTheme(controls), [controls]);
  const css = useMemo(() => themeToCss(theme), [theme]);
  const audit = useMemo(() => auditTheme(theme), [theme]);
  const passing = audit.filter((row) => row.aaLarge).length;

  /*
   * Prism is the one place in the showcase that emits CSS at runtime — it is a
   * theme *generator*, so its output is the CSS block below. Both the injected
   * rule and the colour chips render raw colour values, exactly as the library's
   * own `ColorSwatch` does, because a generator's job is to display and emit
   * colours rather than to be styled by them.
   *
   * `data-theme` is mirrored onto the preview so `dark:` utilities inside it
   * agree with the generated surface colours.
   */
  const scopeSelector = '[data-prism]';

  function update<K extends keyof ThemeControls>(key: K, value: ThemeControls[K]) {
    setControls((previous) => ({ ...previous, [key]: value }));
  }

  function randomise() {
    const hue = Math.round(Math.random() * 360);
    setControls((previous) => ({
      ...previous,
      hue,
      chroma: Number((0.7 + Math.random() * 0.7).toFixed(2)),
      neutralHue: (hue + Math.round(Math.random() * 60 - 30) + 360) % 360,
      neutralChroma: Number((0.004 + Math.random() * 0.024).toFixed(3)),
      radius: Number((0.4 + Math.random() * 1.4).toFixed(2)),
    }));
  }

  const variableCount = Object.keys(theme.vars).length;

  return (
    <div className="flex h-full min-h-0 flex-col bg-bg text-fg">
      {/*
       * The generated theme, scoped to the preview subtree. Rendered inline so it
       * lands after the site stylesheet and therefore wins at equal specificity.
       */}
      <style>{`${scopeSelector} {\n${Object.entries(theme.vars)
        .map(([name, value]) => `  ${name}: ${value};`)
        .join('\n')}\n}`}</style>

      <header className="flex h-12 shrink-0 items-center gap-3 border-b border-border bg-surface px-4">
        <span
          aria-hidden="true"
          className="flex size-6 items-center justify-center rounded-md bg-brand-600 text-[11px] font-extrabold text-fg-on-brand"
        >
          P
        </span>
        <span className="text-sm font-semibold tracking-tight">Prism</span>
        <span className="hidden text-xs text-fg-subtle sm:inline">
          Theme generator · {variableCount} tokens
        </span>

        <div className="ml-auto flex items-center gap-2">
          <Badge tone={passing === audit.length ? 'success' : 'warning'} size="sm">
            {passing}/{audit.length} contrast pairs
          </Badge>
          <Button size="sm" variant="secondary" startIcon={<SparklesIcon />} onClick={randomise}>
            Randomise seed
          </Button>
          <Button size="sm" variant="ghost" startIcon={<RefreshIcon />} onClick={() => setControls(DEFAULT_CONTROLS)}>
            Reset
          </Button>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[300px_minmax(0,1fr)_360px] divide-x divide-border overflow-hidden">
        {/* Controls */}
        <div className="flex min-h-0 flex-col gap-6 overflow-y-auto bg-surface p-4">
          <section className="flex flex-col gap-3">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              Seed hue
            </h2>

            <div className="flex flex-wrap gap-1.5">
              {HUE_STEPS.map((step) => {
                const active = Math.abs(controls.hue - step) < 8;
                const color: Oklch = { l: 0.62, c: 0.19, h: step };
                return (
                  <button
                    key={step}
                    type="button"
                    aria-label={`Seed hue ${step} degrees`}
                    aria-pressed={active}
                    onClick={() => update('hue', step)}
                    className={cn(
                      'size-6 rounded-md border transition-transform',
                      active ? 'scale-110 border-fg' : 'border-transparent hover:scale-105',
                    )}
                    style={{ backgroundColor: toHex(color) }}
                  />
                );
              })}
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between text-xs text-fg-muted">
                Hue
                <span className="tabular-nums text-fg">{controls.hue}°</span>
              </span>
              <Slider
                min={0}
                max={360}
                step={1}
                value={controls.hue}
                onChange={(event) => update('hue', Number(event.target.value))}
                aria-label="Seed hue"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between text-xs text-fg-muted">
                Chroma
                <span className="tabular-nums text-fg">×{controls.chroma.toFixed(2)}</span>
              </span>
              <Slider
                min={0}
                max={1.6}
                step={0.05}
                value={controls.chroma}
                onChange={(event) => update('chroma', Number(event.target.value))}
                aria-label="Brand chroma"
              />
              <span className="text-[10px] text-fg-subtle">0 is fully greyscale; 1 is the shipped ramp.</span>
            </label>
          </section>

          <section className="flex flex-col gap-3 border-t border-border pt-5">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              Surfaces
            </h2>

            <label className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between text-xs text-fg-muted">
                Temperature
                <span className="tabular-nums text-fg">{controls.neutralHue}°</span>
              </span>
              <Slider
                min={0}
                max={360}
                step={1}
                value={controls.neutralHue}
                onChange={(event) => update('neutralHue', Number(event.target.value))}
                aria-label="Neutral hue"
              />
              <span className="flex justify-between text-[10px] text-fg-subtle">
                <span>30° clay</span>
                <span>250° cool</span>
              </span>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between text-xs text-fg-muted">
                Tint strength
                <span className="tabular-nums text-fg">{controls.neutralChroma.toFixed(3)}</span>
              </span>
              <Slider
                min={0}
                max={0.03}
                step={0.001}
                value={controls.neutralChroma}
                onChange={(event) => update('neutralChroma', Number(event.target.value))}
                aria-label="Neutral chroma"
              />
              <span className="text-[10px] text-fg-subtle">
                0 gives pure grey surfaces; 0.016 matches the shipped theme.
              </span>
            </label>
          </section>

          <section className="flex flex-col gap-3 border-t border-border pt-5">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              Form
            </h2>

            <RadioGroup
              name="mode"
              value={controls.mode}
              onValueChange={(value) => update('mode', value as ThemeMode)}
              orientation="horizontal"
              options={[
                { label: 'Light', value: 'light' },
                { label: 'Dark', value: 'dark' },
              ]}
            />

            <label className="flex flex-col gap-1.5">
              <span className="flex items-center justify-between text-xs text-fg-muted">
                Corner radius
                <span className="tabular-nums text-fg">×{controls.radius.toFixed(2)}</span>
              </span>
              <Slider
                min={0}
                max={2}
                step={0.05}
                value={controls.radius}
                onChange={(event) => update('radius', Number(event.target.value))}
                aria-label="Radius scale"
              />
            </label>
          </section>

          <section className="flex flex-col gap-2 border-t border-border pt-5">
            <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
              Presets
            </h2>
            <div className="flex flex-wrap gap-1.5">
              {SEED_PRESETS.map((preset) => {
                const active = controls.hue === preset.hue && controls.chroma === preset.chroma;
                const color: Oklch = { l: 0.55, c: 0.2 * preset.chroma, h: preset.hue };
                return (
                  <button
                    key={preset.name}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setControls((previous) => ({ ...previous, hue: preset.hue, chroma: preset.chroma }))}
                    className={cn(
                      'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors',
                      active
                        ? 'border-fg bg-surface-sunken font-medium text-fg'
                        : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
                    )}
                  >
                    <span aria-hidden="true" className="size-2.5 rounded-full" style={{ backgroundColor: toHex(color) }} />
                    {preset.name}
                  </button>
                );
              })}
            </div>
          </section>
        </div>

        {/* Preview + palette */}
        <div className="flex min-h-0 flex-col overflow-y-auto">
          <div
            data-prism=""
            data-theme={controls.mode}
            className="shrink-0 border-b border-border bg-bg p-5 text-fg"
          >
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-sm font-semibold text-fg">Live preview</h2>
                <p className="text-xs text-fg-subtle">
                  Real FlinchUI components reading the generated tokens.
                </p>
              </div>
              <Badge tone="brand" size="sm">
                brand-600 on fg-on-brand
              </Badge>
            </div>

            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <Card padding="md" className="flex flex-col gap-3">
                <div>
                  <p className="text-sm font-semibold text-fg">Invite a teammate</p>
                  <p className="mt-0.5 text-xs text-fg-muted">
                    They will get read access to the Atlas project.
                  </p>
                </div>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-fg-muted">Email</span>
                  <Input defaultValue="rowan@kestrel.dev" />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-fg-muted">Role</span>
                  <Select
                    defaultValue="editor"
                    options={[
                      { label: 'Viewer', value: 'viewer' },
                      { label: 'Editor', value: 'editor' },
                      { label: 'Admin', value: 'admin' },
                    ]}
                  />
                </label>
                <div className="flex gap-2">
                  <Button size="sm">Send invite</Button>
                  <Button size="sm" variant="secondary">
                    Copy link
                  </Button>
                  <Button size="sm" variant="ghost">
                    Cancel
                  </Button>
                </div>
              </Card>

              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-1.5">
                  <Badge tone="neutral" size="sm">Neutral</Badge>
                  <Badge tone="brand" size="sm">Brand</Badge>
                  <Badge tone="success" size="sm">Success</Badge>
                  <Badge tone="warning" size="sm">Warning</Badge>
                  <Badge tone="danger" size="sm">Danger</Badge>
                  <Badge tone="info" size="sm">Info</Badge>
                </div>

                <Alert tone="success" title="Deploy finished">
                  Canary held at 100% for five minutes.
                </Alert>

                <Card padding="sm" className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-medium text-fg-muted">Weekly active</span>
                    <span className="text-sm font-semibold tabular-nums text-fg">128,430</span>
                  </div>
                  <Sparkline data={PREVIEW_TREND} area tone="brand" height={36} marker />
                  <Progress value={72} tone="brand" size="sm" showValue label="Quota used" />
                </Card>

                <Tabs defaultValue="grid">
                  <TabsList>
                    <TabsTrigger value="grid">Grid</TabsTrigger>
                    <TabsTrigger value="list">List</TabsTrigger>
                  </TabsList>
                  <TabsContent value="grid">
                    <p className="text-xs text-fg-muted">
                      Tabs, focus rings, and hover states all resolve from the same tokens.
                    </p>
                  </TabsContent>
                  <TabsContent value="list">
                    <p className="text-xs text-fg-muted">Switch tabs to compare surfaces.</p>
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 p-5">
            <Ramp
              title="Brand ramp"
              description="The accent scale. 600 is the button fill; 700 is the on-dark text colour."
              swatches={theme.brand}
            />
            <Ramp
              title="Neutral ramp"
              description="Surfaces, borders, and text. Tinted by the temperature control."
              swatches={theme.neutral}
            />

            <section className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold text-fg">Semantic tokens</h3>
                <p className="text-xs text-fg-subtle">
                  Components reference these names, never the ramps directly.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-4">
                {[
                  'bg',
                  'surface',
                  'surface-raised',
                  'surface-sunken',
                  'fg',
                  'fg-muted',
                  'fg-subtle',
                  'fg-on-brand',
                  'border',
                  'border-strong',
                  'ring',
                  'overlay',
                ].map((name) => (
                  <ColorSwatch
                    key={name}
                    color={theme.vars[`--color-${name}`]!}
                    label={name}
                    value={toHex(theme.values[name]!)}
                    size="md"
                  />
                ))}
              </div>
            </section>

            <section className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold text-fg">Radius scale</h3>
                <p className="text-xs text-fg-subtle">
                  Multiplied by ×{controls.radius.toFixed(2)}.
                </p>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                {['xs', 'sm', 'md', 'lg', 'xl', '2xl'].map((step) => (
                  <div key={step} className="flex flex-col items-center gap-1.5">
                    <span
                      className="size-12 border border-border bg-surface-sunken"
                      style={{ borderRadius: theme.vars[`--radius-${step}`] }}
                    />
                    <span className="text-[10px] text-fg-subtle">{step}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>

        {/* Audit + CSS */}
        <div className="flex min-h-0 flex-col overflow-y-auto bg-surface">
          <section className="border-b border-border p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
                Contrast audit
              </h2>
              <span className="ml-auto text-[11px] tabular-nums text-fg-subtle">
                {passing} of {audit.length} pass 3:1
              </span>
            </div>

            <ul className="mt-3 flex flex-col gap-1">
              {audit.map((row) => (
                <li
                  key={row.label}
                  className="flex items-center gap-2 rounded-md px-2 py-1.5 hover:bg-surface-sunken"
                >
                  <span
                    className={cn(
                      'flex size-4 shrink-0 items-center justify-center rounded-full',
                      row.aaLarge ? 'bg-success-subtle text-success-fg' : 'bg-danger-subtle text-danger-fg',
                    )}
                  >
                    {row.aaLarge ? <CheckIcon className="size-2.5" /> : <XIcon className="size-2.5" />}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-xs text-fg">{row.label}</span>
                    <span className="block truncate font-mono text-[10px] text-fg-subtle">
                      {row.fg} / {row.bg}
                    </span>
                  </span>
                  <span className="shrink-0 text-right">
                    <span
                      className={cn(
                        'block text-xs font-semibold tabular-nums',
                        row.aaa ? 'text-success-fg' : row.aa ? 'text-fg' : row.aaLarge ? 'text-warning-fg' : 'text-danger-fg',
                      )}
                    >
                      {row.ratio.toFixed(2)}
                    </span>
                    <span className="block text-[10px] text-fg-subtle">
                      {row.aaa ? 'AAA' : row.aa ? 'AA' : row.aaLarge ? 'AA18' : 'Fail'}
                    </span>
                  </span>
                </li>
              ))}
            </ul>

            <p className="mt-3 text-[11px] leading-5 text-fg-subtle">
              Ratios are measured from the generated OKLCH values through OKLab → linear sRGB →
              relative luminance, not estimated.
            </p>
          </section>

          <section className="flex min-h-0 flex-1 flex-col gap-3 p-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[11px] font-semibold tracking-wide text-fg-subtle uppercase">
                Generated CSS
              </h2>
              <Badge tone="neutral" size="sm" className="ml-auto">
                {css.split('\n').length} lines
              </Badge>
            </div>

            <CodeBlock
              className="min-h-0"
              language="css"
              title={`${controls.mode}-theme.css`}
              code={css}
            />

            <p className="text-[11px] leading-5 text-fg-subtle">
              Drop this into your stylesheet and set{' '}
              <code className="rounded-sm bg-surface-sunken px-1 font-mono">
                data-theme=&quot;prism&quot;
              </code>{' '}
              on any element. Everything below it re-themes, with no JavaScript.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Ramp({
  title,
  description,
  swatches,
}: {
  title: string;
  description: string;
  swatches: { step: number; color: Oklch; css: string }[];
}) {
  return (
    <section className="flex flex-col gap-3">
      <div>
        <h3 className="text-sm font-semibold text-fg">{title}</h3>
        <p className="text-xs text-fg-subtle">{description}</p>
      </div>

      <div className="flex overflow-hidden rounded-lg border border-border">
        {swatches.map((swatch) => (
          <span
            key={swatch.step}
            className="h-16 flex-1"
            style={{ backgroundColor: swatch.css }}
            title={`${swatch.step} · ${swatch.css} · ${toHex(swatch.color)}`}
          />
        ))}
      </div>

      <div className="flex">
        {swatches.map((swatch) => (
          <span key={swatch.step} className="flex-1 text-center font-mono text-[10px] text-fg-subtle">
            {swatch.step}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1">
        {swatches
          .filter((swatch) => [300, 500, 600, 700].includes(swatch.step))
          .map((swatch) => (
            <span key={swatch.step} className="font-mono text-[10px] text-fg-subtle">
              {swatch.step}: {toHex(swatch.color)}
            </span>
          ))}
      </div>
    </section>
  );
}
