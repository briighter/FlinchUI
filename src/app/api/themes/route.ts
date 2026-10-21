import { DEFAULT_CONTROLS, SEED_PRESETS } from '@/lib/theme';

/**
 * GET /api/themes
 *
 * The theme catalogue an agent needs before it can generate or choose one:
 * shipped themes, seed presets, the parameter ranges, and the endpoints.
 */

const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
};

export function OPTIONS() {
  return new Response(null, { status: 204, headers: CORS });
}

export function GET(request: Request) {
  const origin = new URL(request.url).origin;

  return Response.json(
    {
      version: '1.0',
      description:
        'FlinchUI themes are CSS custom-property blocks selected by data-theme. Generate one from a seed, or use a shipped theme.',
      shipped: [
        { name: 'light', selector: null, note: 'The default token layer.' },
        { name: 'dark', selector: '[data-theme="dark"]' },
        { name: 'violet', selector: '[data-theme="violet"]' },
        { name: 'emerald', selector: '[data-theme="emerald"]' },
        { name: 'amber', selector: '[data-theme="amber"]' },
        { name: 'rose', selector: '[data-theme="rose"]' },
        { name: 'high-contrast', selector: '[data-theme="high-contrast"]' },
      ],
      presetQuery: {
        type: 'string',
        values: SEED_PRESETS.map((preset) => preset.name.toLowerCase()),
        description: 'Shorthand for hue + chroma. Individual parameters override it.',
      },
      parameters: {
        hue: { type: 'number', min: 0, max: 360, default: DEFAULT_CONTROLS.hue },
        chroma: { type: 'number', min: 0, max: 1.6, default: DEFAULT_CONTROLS.chroma },
        neutralHue: { type: 'number', min: 0, max: 360, default: DEFAULT_CONTROLS.neutralHue },
        neutralChroma: {
          type: 'number',
          min: 0,
          max: 0.03,
          default: DEFAULT_CONTROLS.neutralChroma,
        },
        mode: { type: 'string', values: ['light', 'dark'], default: DEFAULT_CONTROLS.mode },
        radius: { type: 'number', min: 0, max: 2, default: DEFAULT_CONTROLS.radius },
        format: { type: 'string', values: ['json', 'css'], default: 'json' },
      },
      presets: SEED_PRESETS.map((preset) => ({
        name: preset.name,
        hue: preset.hue,
        chroma: preset.chroma,
        json: `${origin}/api/theme?preset=${preset.name.toLowerCase()}`,
        css: `${origin}/api/theme?preset=${preset.name.toLowerCase()}&format=css`,
      })),
      endpoints: {
        generate: `${origin}/api/theme`,
        studio: `${origin}/tools/theme`,
        tokens: `${origin}/api/theme?format=css`,
        docs: `${origin}/docs/theming`,
        llms: `${origin}/llms.txt`,
      },
    },
    {
      headers: { ...CORS, 'Cache-Control': 'public, max-age=3600, s-maxage=86400' },
    },
  );
}
