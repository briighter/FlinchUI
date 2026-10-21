import {
  DEFAULT_CONTROLS,
  SEED_PRESETS,
  auditTheme,
  generateTheme,
  themeToCss,
  type ThemeControls,
  type ThemeMode,
} from '@/lib/theme';

/**
 * GET /api/theme
 *
 * Deterministic theme generation for agents and build scripts. Every parameter
 * is optional and clamped, so an LLM can guess a seed and still get a valid
 * theme back instead of an error.
 *
 *   /api/theme?hue=265&chroma=1&neutralHue=265&neutralChroma=0.016&mode=light&radius=1
 *   /api/theme?preset=violet
 *   /api/theme?preset=teal&mode=dark&format=css
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

const CACHE = { 'Cache-Control': 'public, max-age=3600, s-maxage=86400' };

function number(value: string | null, fallback: number, min: number, max: number) {
  if (value === null || value.trim() === '') return fallback;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return fallback;
  return Math.min(max, Math.max(min, parsed));
}

function controlsFrom(params: URLSearchParams): ThemeControls {
  const presetName = params.get('preset')?.trim().toLowerCase();
  const preset = SEED_PRESETS.find((entry) => entry.name.toLowerCase() === presetName);

  const modeParam = params.get('mode')?.trim().toLowerCase();
  const mode: ThemeMode = modeParam === 'dark' ? 'dark' : 'light';

  return {
    hue: number(params.get('hue'), preset?.hue ?? DEFAULT_CONTROLS.hue, 0, 360),
    chroma: number(params.get('chroma'), preset?.chroma ?? DEFAULT_CONTROLS.chroma, 0, 1.6),
    neutralHue: number(params.get('neutralHue'), DEFAULT_CONTROLS.neutralHue, 0, 360),
    neutralChroma: number(
      params.get('neutralChroma'),
      DEFAULT_CONTROLS.neutralChroma,
      0,
      0.03,
    ),
    mode,
    radius: number(params.get('radius'), DEFAULT_CONTROLS.radius, 0, 2),
  };
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export function GET(request: Request) {
  const url = new URL(request.url);
  const params = url.searchParams;
  const controls = controlsFrom(params);
  const theme = generateTheme(controls);

  if (params.get('format') === 'css') {
    return new Response(themeToCss(theme), {
      headers: {
        ...CORS,
        ...CACHE,
        'Content-Type': 'text/css; charset=utf-8',
        'Content-Disposition': `inline; filename="prism-${controls.mode}.css"`,
      },
    });
  }

  const body = {
    name: 'prism',
    version: '1.0',
    selector: '[data-theme="prism"]',
    description:
      'A FlinchUI theme as CSS custom properties. Apply by setting data-theme="prism" on any ancestor.',
    controls,
    tokens: theme.vars,
    css: themeToCss(theme),
    audit: auditTheme(theme),
    sources: {
      html: `${url.origin}/tools/theme`,
      css: `${url.origin}/api/theme?${params.toString()}&format=css`,
      presets: `${url.origin}/api/themes`,
    },
  };

  return Response.json(body, { headers: { ...CORS, ...CACHE } });
}
