'use client';

import { useMemo, useState } from 'react';
import { cn } from '@/lib/cn';
import { toHex, type Oklch } from '@/lib/color';
import {
  DEFAULT_CONTROLS,
  SEED_PRESETS,
  auditTheme,
  generateTheme,
  themeToCss,
  type ThemeControls,
  type ThemeMode,
} from '@/lib/theme';
import { series } from '@/lib/random';
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
  DownloadIcon,
  ExternalLinkIcon,
  RefreshIcon,
  SparklesIcon,
  XIcon,
} from '@/components/ui/icons';

const HUE_STEPS = Array.from({ length: 24 }, (_, index) => index * 15);

const PREVIEW_TREND = series(611, { count: 24, start: 100, drift: 0.06, bias: 0.004, precision: 2 });

const SEMANTIC_NAMES = [
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
];

const RADIUS_STEPS = ['xs', 'sm', 'md', 'lg', 'xl', '2xl'] as const;

function queryString(controls: ThemeControls) {
  const params = new URLSearchParams({
    hue: String(controls.hue),
    chroma: String(controls.chroma),
    neutralHue: String(controls.neutralHue),
    neutralChroma: String(controls.neutralChroma),
    mode: controls.mode,
    radius: String(controls.radius),
  });
  return params.toString();
}

/**
 * Theme Studio — the hosted face of the Prism theme engine.
 *
 * Unlike the rest of the library this tool *emits* CSS, so it is the documented
 * exception to the "no inline styles" rule: the generated rule is the product,
 * and the colour chips display arbitrary generated values by definition.
 */
export function ThemeStudio({ apiBase }: { apiBase: string }) {
  const [controls, setControls] = useState<ThemeControls>(DEFAULT_CONTROLS);

  const theme = useMemo(() => generateTheme(controls), [controls]);
  const css = useMemo(() => themeToCss(theme), [theme]);
  const audit = useMemo(() => auditTheme(theme), [theme]);
  const passing = audit.filter((row) => row.aaLarge).length;

  const scopeSelector = '[data-prism]';
  const apiUrl = `${apiBase}/api/theme?${queryString(controls)}`;
  const cssUrl = `${apiUrl}&format=css`;
  const variableCount = Object.keys(theme.vars).length;

  const json = useMemo(
    () =>
      JSON.stringify(
        {
          name: 'prism',
          selector: '[data-theme="prism"]',
          controls,
          tokens: theme.vars,
          audit,
          sources: { css: cssUrl, json: apiUrl },
        },
        null,
        2,
      ),
    [controls, theme.vars, audit, cssUrl, apiUrl],
  );

  const prompt = useMemo(
    () =>
      [
        'Add this FlinchUI theme to the project.',
        '',
        '1. Paste the CSS block below into a global stylesheet that loads after the FlinchUI',
        '   token layer (`src/styles/themes.css` is the conventional home).',
        '2. Set data-theme="prism" on the <html> element, or on any ancestor element to scope',
        '   the theme to a subtree.',
        '3. Do not edit component source. Every component reads semantic tokens, so the theme',
        '   applies without any code change.',
        '',
        '```css',
        css.trimEnd(),
        '```',
        '',
        'The same theme is available as JSON (including the measured contrast audit):',
        apiUrl,
        '',
        'Raw CSS for `curl -o prism.css`:',
        cssUrl,
      ].join('\n'),
    [css, apiUrl, cssUrl],
  );

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

  function download() {
    const blob = new Blob([css], { type: 'text/css;charset=utf-8' });
    const href = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = href;
    link.download = `prism-${controls.mode}.css`;
    link.click();
    URL.revokeObjectURL(href);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Generated theme, scoped to the preview subtree and printed after the site CSS. */}
      <style>{`${scopeSelector} {\n${Object.entries(theme.vars)
        .map(([name, value]) => `  ${name}: ${value};`)
        .join('\n')}\n}`}</style>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap gap-1.5" role="group" aria-label="Seed presets">
          {SEED_PRESETS.map((preset) => {
            const active = controls.hue === preset.hue && controls.chroma === preset.chroma;
            const color: Oklch = { l: 0.55, c: 0.2 * preset.chroma, h: preset.hue };
            return (
              <button
                key={preset.name}
                type="button"
                aria-pressed={active}
                onClick={() =>
                  setControls((previous) => ({ ...previous, hue: preset.hue, chroma: preset.chroma }))
                }
                className={cn(
                  'flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs transition-colors',
                  active
                    ? 'border-fg bg-surface-sunken font-medium text-fg'
                    : 'border-border text-fg-muted hover:border-border-strong hover:text-fg',
                )}
              >
                <span
                  aria-hidden="true"
                  className="size-2.5 rounded-full"
                  style={{ backgroundColor: toHex(color) }}
                />
                {preset.name}
              </button>
            );
          })}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Badge tone={passing === audit.length ? 'success' : 'warning'} size="sm">
            {passing}/{audit.length} contrast pairs
          </Badge>
          <Button size="sm" variant="secondary" startIcon={<SparklesIcon />} onClick={randomise}>
            Randomise
          </Button>
          <Button size="sm" variant="ghost" startIcon={<RefreshIcon />} onClick={() => setControls(DEFAULT_CONTROLS)}>
            Reset
          </Button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[320px_minmax(0,1fr)] xl:items-start">
        {/* Controls */}
        <aside className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-5 xl:sticky xl:top-20">
          <section className="flex flex-col gap-3">
            <div className="flex items-baseline justify-between">
              <h2 className="text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">Seed</h2>
              <span className="font-mono text-[10px] text-fg-subtle">{variableCount} tokens</span>
            </div>

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
              <span className="text-[10px] text-fg-subtle">0 is greyscale; 1 is the shipped ramp.</span>
            </label>
          </section>

          <section className="flex flex-col gap-3 border-t border-border pt-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">
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
                0 gives pure grey; 0.016 matches the shipped theme.
              </span>
            </label>
          </section>

          <section className="flex flex-col gap-3 border-t border-border pt-5">
            <h2 className="text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">Form</h2>

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
        </aside>

        {/* Preview, palette, audit, export */}
        <div className="flex min-w-0 flex-col gap-6">
          <section
            data-prism=""
            data-theme={controls.mode}
            className="rounded-xl border border-border bg-bg p-5 text-fg"
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
                <div className="flex flex-wrap gap-2">
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
          </section>

          <section className="flex flex-col gap-6 rounded-xl border border-border bg-surface p-5">
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

            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold text-fg">Semantic tokens</h3>
                <p className="text-xs text-fg-subtle">
                  Components reference these names, never the ramps directly.
                </p>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-4">
                {SEMANTIC_NAMES.map((name) => (
                  <ColorSwatch
                    key={name}
                    color={theme.vars[`--color-${name}`]!}
                    label={name}
                    value={toHex(theme.values[name]!)}
                    size="md"
                  />
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <h3 className="text-sm font-semibold text-fg">Radius scale</h3>
                <p className="text-xs text-fg-subtle">Multiplied by ×{controls.radius.toFixed(2)}.</p>
              </div>
              <div className="flex flex-wrap items-end gap-3">
                {RADIUS_STEPS.map((step) => (
                  <div key={step} className="flex flex-col items-center gap-1.5">
                    <span
                      className="size-12 border border-border bg-surface-sunken"
                      style={{ borderRadius: theme.vars[`--radius-${step}`] }}
                    />
                    <span className="text-[10px] text-fg-subtle">{step}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
            {/* Audit */}
            <section className="rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">
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
                          row.aaa
                            ? 'text-success-fg'
                            : row.aa
                              ? 'text-fg'
                              : row.aaLarge
                                ? 'text-warning-fg'
                                : 'text-danger-fg',
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

            {/* Export */}
            <section className="flex flex-col gap-3 rounded-xl border border-border bg-surface p-5">
              <div className="flex items-center gap-2">
                <h2 className="text-[11px] font-semibold uppercase tracking-wide text-fg-subtle">
                  Export
                </h2>
                <Badge tone="neutral" size="sm" className="ml-auto">
                  {css.split('\n').length} lines
                </Badge>
                <Button size="sm" variant="ghost" startIcon={<DownloadIcon />} onClick={download}>
                  Download
                </Button>
              </div>

              <Tabs defaultValue="css">
                <TabsList>
                  <TabsTrigger value="css">CSS</TabsTrigger>
                  <TabsTrigger value="json">JSON</TabsTrigger>
                  <TabsTrigger value="prompt">Agent prompt</TabsTrigger>
                </TabsList>

                <TabsContent value="css">
                  <CodeBlock language="css" title={`prism-${controls.mode}.css`} code={css} />
                  <p className="mt-3 text-[11px] leading-5 text-fg-subtle">
                    Drop this into your stylesheet and set{' '}
                    <code className="rounded-sm bg-surface-sunken px-1 font-mono">
                      data-theme=&quot;prism&quot;
                    </code>{' '}
                    on any element. Everything below it re-themes, with no JavaScript.
                  </p>
                </TabsContent>

                <TabsContent value="json">
                  <CodeBlock language="json" title="prism.json" code={json} />
                  <p className="mt-3 text-[11px] leading-5 text-fg-subtle">
                    The same payload is served at{' '}
                    <code className="break-all rounded-sm bg-surface-sunken px-1 font-mono">
                      /api/theme
                    </code>{' '}
                    for agents and build scripts.
                  </p>
                </TabsContent>

                <TabsContent value="prompt">
                  <CodeBlock language="markdown" title="theme-prompt.md" code={prompt} />
                  <p className="mt-3 text-[11px] leading-5 text-fg-subtle">
                    Paste this into your agent. It carries the CSS, the activation instruction, and
                    the machine-readable URL in one block.
                  </p>
                </TabsContent>
              </Tabs>

              <div className="flex flex-col gap-2 rounded-lg border border-border bg-surface-sunken p-3">
                <span className="text-[11px] font-semibold text-fg">Theme API</span>
                <code className="break-all font-mono text-[10px] leading-5 text-fg-muted">
                  GET /api/theme?{queryString(controls)}
                </code>
                <a
                  href={`/api/theme?${queryString(controls)}&format=css`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex w-fit items-center gap-1 text-[11px] font-medium text-brand-600 hover:underline"
                >
                  Open raw CSS
                  <ExternalLinkIcon className="size-3" />
                </a>
              </div>
            </section>
          </div>
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
