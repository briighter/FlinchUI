/**
 * The showcase registry.
 *
 * Each entry is a fully-built product surface rendered from FlinchUI components
 * alone. The registry drives the `/examples` gallery, the docs sidebar section,
 * the command palette, and the per-app page metadata — the same "single source
 * of truth" contract the component registry follows.
 */

export type ShowcaseCategory =
  | 'Fintech'
  | 'Analytics'
  | 'Productivity'
  | 'Commerce'
  | 'Health'
  | 'Audio'
  | 'DevOps'
  | '3D'
  | 'Game'
  | 'Tools';

export type ShowcaseDevice = 'desktop' | 'mobile';

export interface ShowcaseApp {
  /** URL segment: `/examples/<slug>`. */
  slug: string;
  /** The product name shown inside the app chrome. */
  name: string;
  /** Short, human label for navigation and page titles. */
  title: string;
  category: ShowcaseCategory;
  device: ShowcaseDevice;
  tagline: string;
  description: string;
  /** What the app is meant to prove, one sentence per bullet. */
  highlights: string[];
  /** FlinchUI components the app is assembled from. */
  uses: string[];
  /** Runtime dependencies beyond React and FlinchUI. */
  deps?: string[];
  /** Accent token name used by the gallery card. */
  accent: 'brand' | 'success' | 'warning' | 'danger' | 'info';
}

export const showcaseApps: ShowcaseApp[] = [
  {
    slug: 'trading-terminal',
    name: 'Helios',
    title: 'Trading terminal',
    category: 'Fintech',
    device: 'desktop',
    accent: 'success',
    tagline: 'A dense, keyboard-first order book and blotter for a rates desk.',
    description:
      'Helios is the screen a fixed-income trader keeps open all day: a live watchlist on the left, an order book and depth chart in the middle, and a working-orders blotter pinned to the bottom. Every number updates in place, and rows stay selectable with the arrow keys.',
    highlights: [
      'Five-column master/detail layout with a sticky blotter rail',
      'In-place number formatting and tabular figures so digits never jitter',
      'Sparklines and a depth chart built from dependency-free SVG',
      'Row selection driven by keyboard focus, not a mouse-only affordance',
    ],
    uses: ['Table', 'Tabs', 'Sparkline', 'ButtonGroup', 'NumberInput', 'Badge'],
  },
  {
    slug: 'analytics-dashboard',
    name: 'Northwind',
    title: 'Analytics dashboard',
    category: 'Analytics',
    device: 'desktop',
    accent: 'brand',
    tagline: 'A product-analytics workspace with cohorts, funnels, and retention.',
    description:
      'Northwind answers one question well: where does the funnel leak? A date range drives every tile and chart on the page, the same way a real analytics tool re-queries its warehouse.',
    highlights: [
      'A single filter bar that scopes the whole surface',
      'Line, bar, donut, and heatmap visuals sharing one scale helper',
      'KPI tiles with trend deltas and comparable prior-period values',
      'A cohort retention grid that reads as a heatmap, not a table',
    ],
    uses: ['Card', 'Table', 'LineChart', 'BarChart', 'DonutChart', 'Heatmap'],
  },
  {
    slug: 'task-board',
    name: 'Kestrel',
    title: 'Project board',
    category: 'Productivity',
    device: 'desktop',
    accent: 'info',
    tagline: 'An issue tracker with a board view, backlog, and activity stream.',
    description:
      'Kestrel is the shape of a real tracker — a blank-slate project with sprints, cycles, and a two-pane issue detail. The board groups work by status and keeps a running activity feed beside it.',
    highlights: [
      'Board columns with per-column capacity and swimlane subtotals',
      'Issue cards with labels, assignees, and estimate chips',
      'A two-pane master/detail that preserves context',
      'Grouping, filters, and view switching as plain semantic controls',
    ],
    uses: ['Timeline', 'AvatarGroup', 'Avatar', 'Progress', 'Select', 'Badge'],
  },
  {
    slug: 'storefront',
    name: 'Marrow',
    title: 'Storefront',
    category: 'Commerce',
    device: 'mobile',
    accent: 'warning',
    tagline: 'A mobile storefront for a small-batch ceramics studio.',
    description:
      'Marrow is a phone-sized shop: a catalogue, a product sheet, a bag, and a two-step checkout. It is deliberately narrow so the components have to earn their space on a 390px canvas.',
    highlights: [
      'A 390px canvas with safe-area padding and a sticky purchase bar',
      'Product imagery built from CSS gradients — no image requests',
      'A slide-up bag sheet instead of a full-screen interruption',
      'Checkout as a stepper, not a wizard with a progress bar',
    ],
    uses: ['AspectRatio', 'Card', 'FormField', 'Stepper', 'RadioGroup', 'Textarea'],
  },
  {
    slug: 'patient-app',
    name: 'Cedar',
    title: 'Patient app',
    category: 'Health',
    device: 'mobile',
    accent: 'info',
    tagline: 'A patient portal for appointments, medications, and vitals.',
    description:
      'Cedar is the calm, legible end of health software: appointments up front, a medication schedule, and vitals that trend over time. Sizes and contrast are dialled up because the audience is not necessarily comfortable with apps.',
    highlights: [
      'Large tap targets and a type scale that survives a cracked screen',
      'Vitals trends rendered as labelled sparklines with a reference band',
      'A medication schedule with an adherence ring',
      'Announcement-grade alerts using live regions, not coloured boxes alone',
    ],
    uses: ['Card', 'CircularProgress', 'Timeline', 'Alert', 'Avatar', 'Badge'],
  },
  {
    slug: 'music-studio',
    name: 'Foundry',
    title: 'Music studio',
    category: 'Audio',
    device: 'desktop',
    accent: 'danger',
    tagline: 'A step sequencer and mixer for a 16-step drum machine.',
    description:
      'Foundry is a working drum machine: a 16-step grid across eight voices, a transport, and a mixer strip per channel. Cells are real toggles, so the pattern is genuinely editable and the playhead follows the selected bars.',
    highlights: [
      'A step grid that is a keyboard-navigable toggle matrix, not a canvas',
      'Waveform rendering from raw sample arrays with pure SVG',
      'Per-channel faders with live meters',
      'Tempo and swing controls that read like hardware, not a settings form',
    ],
    uses: ['Card', 'Slider', 'Toggle', 'Switch', 'NumberInput', 'ButtonGroup'],
  },
  {
    slug: 'ci-pipeline',
    name: 'Relay',
    title: 'CI pipeline',
    category: 'DevOps',
    device: 'desktop',
    accent: 'brand',
    tagline: 'A build pipeline view with logs, timings, and a deploy gate.',
    description:
      'Relay is the page you open when a deploy is red: the pipeline graph at the top, the failing job expanded in the middle, and the log tail on the right. Status is carried by shape and text, never colour alone.',
    highlights: [
      'A pipeline rail with per-stage durations, roll-up status, and job drill-down',
      'A log viewer with line numbers, severity colouring, and a live text filter',
      'A diff summary with added/removed counts per file',
      'A deploy gate that spells out who can approve and why',
    ],
    uses: ['Badge', 'CodeBlock', 'Progress', 'Alert', 'Avatar', 'Switch'],
  },
  {
    slug: 'product-configurator',
    name: 'Orbit',
    title: '3D configurator',
    category: '3D',
    device: 'desktop',
    accent: 'brand',
    tagline: 'A real-time 3D watch configurator with live pricing.',
    description:
      'Orbit builds a chronograph from primitives in a lazy-loaded three.js scene: orbit the case, swap the metal, pick a dial, and watch the price and reference number update. It is the one app in the gallery that opts into a dependency, and it says so.',
    highlights: [
      'Procedural geometry — no glTF asset, no texture files, nothing to fetch',
      'Materials, bezel, and strap as ordinary pressed-button option groups',
      'Image-based lighting from a generated room, so the metals reflect something real',
      'Price, reference number, and lead time derived from the current build',
    ],
    uses: ['Button', 'Badge', 'Alert', 'CopyButton', 'Spinner'],
    deps: ['three'],
  },
  {
    slug: 'arcade-game',
    name: 'Vector Break',
    title: 'Canvas game',
    category: 'Game',
    device: 'desktop',
    accent: 'danger',
    tagline: 'A neon block-breaker with a HUD, pause state, and high scores.',
    description:
      'Vector Break is a complete little game on a single canvas: paddle, ball, bricks, particles, combos, lives, and levels. Input, the render loop, and teardown all live in one effect — no game framework.',
    highlights: [
      'A requestAnimationFrame loop with proper teardown and delta timing',
      'Paddle control from keyboard, pointer, and touch with equal feel',
      'Particle bursts, screen shake, and a combo multiplier that pays',
      'Sound effects synthesised with oscillators — no audio files',
    ],
    uses: ['Badge', 'Button', 'Progress', 'Switch', 'Kbd'],
  },
];

export function getShowcaseApp(slug: string): ShowcaseApp | undefined {
  return showcaseApps.find((app) => app.slug === slug);
}

export const showcaseCategories = Array.from(
  new Set(showcaseApps.map((app) => app.category)),
) as ShowcaseCategory[];
