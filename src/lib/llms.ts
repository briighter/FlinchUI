import { categories, components } from '@/registry/components';
import { guides } from '@/registry/guides';
import { registryVersion, type ComponentDoc } from '@/lib/registry';
import { siteUrl } from '@/lib/site';
import { showcaseApps } from '@/lib/showcase';
import { SEED_PRESETS } from '@/lib/theme';

/**
 * Machine-readable documentation surfaces.
 *
 * Both files are generated from the same registry that powers the UI, so they
 * cannot drift from the component pages. They contain no JSX and no secrets —
 * plain Markdown an agent can consume without scraping HTML.
 */

function componentUrl(component: ComponentDoc) {
  return `${siteUrl}/components/${component.slug}`;
}

function propRows(component: ComponentDoc) {
  if (!component.props?.length) return '';
  const lines = [
    '| Prop | Type | Default | Description |',
    '| --- | --- | --- | --- |',
    ...component.props.map(
      (prop) =>
        `| \`${prop.name}\` | \`${prop.type.replace(/\|/g, '\\|')}\` | ${
          prop.default ? `\`${prop.default}\`` : '—'
        } | ${prop.description.replace(/\|/g, '\\|')} |`,
    ),
  ];
  return `\n${lines.join('\n')}\n`;
}

export function buildLlmsTxt(): string {
  const lines: string[] = [
    '# FlinchUI',
    '',
    '> A lightweight, infinitely extensible React component library distributed by copy-paste. Components are',
    '> source files you own — there is no runtime package, no provider, and no CSS-in-JS. Styling is static',
    '> Tailwind CSS v4 utilities over semantic design tokens that can be re-themed at runtime.',
    '',
    `Version: ${registryVersion}`,
    `Docs: ${siteUrl}`,
    `Registry: ${siteUrl}/api/registry`,
    `Full documentation text: ${siteUrl}/llms-full.txt`,
    '',
    '## How to add a component',
    '',
    '1. Find the exact slug below (never guess a component name).',
    '2. Run `npx flinchui add <slug>` — it copies the component, its helpers, and its opt-in dependencies.',
    '3. Import from `@/components/ui/<slug>` and pass only documented props.',
    '',
    'Components with no listed dependency need nothing beyond React and Tailwind. Popover, Tooltip,',
    'DropdownMenu, and HoverCard additionally require `@floating-ui/react`.',
    '',
    `## Components (${components.length})`,
  ];

  for (const category of categories) {
    const entries = components.filter((component) => component.category === category.id);
    if (entries.length === 0) continue;

    lines.push('', `### ${category.label}`, '');
    for (const component of entries) {
      const beta = component.status === 'beta' ? ' **[beta]**' : '';
      lines.push(
        `- [${component.name}](${componentUrl(component)}): ${component.description}${beta}`,
      );
    }
  }

  lines.push('', `## Guides (${guides.length})`, '');
  for (const guide of guides) {
    lines.push(`- [${guide.title}](${siteUrl}/docs/${guide.slug}): ${guide.description}`);
  }

  lines.push(
    '',
    '## Tools',
    '',
    `- [Theme Studio](${siteUrl}/tools/theme): Generate a complete theme from a seed hue; export copy-paste CSS, JSON, or an agent prompt.`,
    `- [Theme API](${siteUrl}/api/themes): Shipped themes, seed presets, parameter ranges, and endpoint URLs.`,
    `- [Registry API](${siteUrl}/api/registry): Every component as JSON — props, files, dependencies, and a11y notes.`,
    '',
    '## Generating a theme',
    '',
    'Themes are CSS custom-property blocks selected by `data-theme`. Generate one over HTTP;',
    'every parameter is optional and clamped, so an invalid guess still returns a valid theme:',
    '',
    '```bash',
    `curl "${siteUrl}/api/theme?preset=violet&mode=dark"            # JSON: controls, tokens, css, audit`,
    `curl "${siteUrl}/api/theme?hue=195&format=css" -o theme.css      # raw CSS block`,
    '```',
    '',
    `Parameters: hue 0–360, chroma 0–1.6, neutralHue 0–360, neutralChroma 0–0.03, mode \`light\`|\`dark\`, radius 0–2.`,
    `Presets: ${SEED_PRESETS.map((preset) => preset.name.toLowerCase()).join(', ')}.`,
    '',
    'Apply the result by writing the CSS into a stylesheet that loads after the token layer and',
    'setting `data-theme="prism"` on `<html>` or any ancestor. Do not edit component source.',
    '',
    `## Examples (${showcaseApps.length})`,
    '',
  );
  for (const app of showcaseApps) {
    lines.push(
      `- [${app.name} — ${app.title}](${siteUrl}/examples/${app.slug}): ${app.tagline} Components: ${app.uses.join(', ')}.`,
    );
  }

  lines.push(
    '',
    '## Authoring rules (summary)',
    '',
    '- Every component is a single TSX file that exports its props interface, variant map, and component.',
    '- Styling is literal Tailwind utility classes. No inline styles, CSS-in-JS, or `<style>` strings.',
    '- Style with semantic tokens (`bg-surface`, `text-fg-muted`, `border-border`), never raw palette classes.',
    '- Props that select a style are closed unions. Unknown values are type errors, not hints.',
    '- `className` is merged last so consumers can override; `cn()` does not resolve Tailwind conflicts.',
    '- Export the variant map (`buttonVariants`) so consumers can compose without forking.',
    '- Prefer native elements: `<dialog>`, `<details>`, `<button>`, `<input>`. Add ARIA only for real gaps.',
    '- Interactive components that render their own handlers declare `\'use client\'`.',
    '- Never pass event handlers from a Server Component to a Client Component.',
    '',
    'Full rules: ' + `${siteUrl}/docs/authoring`,
    '',
  );

  return lines.join('\n');
}

export function buildLlmsFullTxt(): string {
  const lines: string[] = [
    '# FlinchUI — full documentation',
    '',
    '> Complete, machine-readable reference generated from the component registry.',
    '',
    `Version: ${registryVersion}`,
    `Site: ${siteUrl}`,
    `Registry JSON: ${siteUrl}/api/registry`,
    '',
    '## Installation',
    '',
    '```bash',
    'npx flinchui init           # copy tokens, themes, and shared helpers',
    'npx flinchui add button     # copy a component and its import graph',
    '```',
    '',
    'Then import the token layer once:',
    '',
    '```css',
    '@import "@/styles/tokens.css";',
    '```',
    '',
    'Tailwind CSS v4 is required. Components use the `@/` path alias for `src/`.',
    '',
    '## Theming',
    '',
    'Themes are CSS variable blocks selected by `data-theme` on any ancestor:',
    '',
    '```html',
    '<html data-theme="dark">',
    '```',
    '',
    'Available themes: light, dark, violet, emerald, amber, rose, high-contrast.',
    '',
    'Semantic tokens: bg, surface, surface-raised, surface-sunken, fg, fg-muted, fg-subtle,',
    'fg-on-brand, border, border-strong, ring, overlay, brand-50…950, success, warning, danger, info.',
    '',
    'Override tokens by the same `--color-*` name inside a `[data-theme="…"]` block.',
    '',
    'Generate a theme instead of writing one by hand:',
    '',
    '```bash',
    `curl "${siteUrl}/api/theme?hue=265&chroma=1&mode=light"`,
    `curl "${siteUrl}/api/theme?preset=teal&format=css" -o prism.css`,
    '```',
    '',
    'The JSON response carries `controls`, `tokens`, the ready-to-paste `css`, and a measured',
    'WCAG `audit`. Query parameters: hue (0–360), chroma (0–1.6), neutralHue (0–360),',
    'neutralChroma (0–0.03), mode (light|dark), radius (0–2), preset.',
    `Catalogue: ${siteUrl}/api/themes`,
    `Studio: ${siteUrl}/tools/theme`,
    '',
    '## Authoring rules',
    '',
    '- Static Tailwind classes only; no inline styles or CSS-in-JS.',
    '- Semantic tokens only; no raw palette classes in reusable components.',
    '- Closed unions for style props; unknown values are rejected by TypeScript.',
    '- Export the variant map; merge `className` last.',
    '- Native elements first; ARIA only where the platform has no equivalent.',
    '- Components that own state, effects, refs, or handlers declare `\'use client\'`.',
    '- Function props cannot cross from a Server Component to a Client Component.',
    '',
    `## Components (${components.length})`,
  ];

  for (const category of categories) {
    const entries = components.filter((component) => component.category === category.id);
    if (entries.length === 0) continue;

    lines.push('', `### ${category.label}`, '');
    for (const component of entries) {
      lines.push(`#### ${component.name} (${component.slug})`, '');
      lines.push(component.description, '');
      if (component.intro) lines.push(component.intro, '');
      lines.push(`- Docs: ${componentUrl(component)}`);
      lines.push(`- Install: \`npx flinchui add ${component.slug}\``);
      lines.push(`- Status: ${component.status ?? 'stable'}`);
      if (component.files?.length) lines.push(`- Files: ${component.files.join(', ')}`);
      if (component.deps?.length) lines.push(`- Dependencies: ${component.deps.join(', ')}`);
      if (component.related?.length) lines.push(`- Related: ${component.related.join(', ')}`);
      if (component.props?.length) {
        lines.push('', propRows(component).trim(), '');
      }
      if (component.a11y?.length) {
        lines.push('Accessibility:', '');
        for (const note of component.a11y) lines.push(`- ${note}`);
        lines.push('');
      }
    }
  }

  lines.push('', `## Guides (${guides.length})`, '');
  for (const guide of guides) {
    lines.push(`### ${guide.title}`, '');
    lines.push(guide.description, '');
    lines.push(`- ${siteUrl}/docs/${guide.slug}`, '');
  }

  lines.push('', '## Tools', '');
  lines.push(`### Theme Studio`, '');
  lines.push(
    'Generates a full theme from a seed: OKLCH tokens, contrast audit, CSS, JSON, and an agent prompt.',
    '',
    `- ${siteUrl}/tools/theme`,
    '',
    '### Theme API',
    '',
    '```bash',
    `curl "${siteUrl}/api/theme?preset=violet&mode=dark"`,
    `curl "${siteUrl}/api/theme?hue=195&format=css" -o prism.css`,
    `curl "${siteUrl}/api/themes"   # shipped themes, presets, parameter ranges`,
    '```',
    '',
    `### Registry API`,
    '',
    `- ${siteUrl}/api/registry`,
    `- ${siteUrl}/api/registry/<slug>`,
    '',
  );

  lines.push('', `## Examples (${showcaseApps.length})`, '');
  for (const app of showcaseApps) {
    lines.push(`### ${app.name} — ${app.title}`, '');
    lines.push(app.description, '');
    lines.push(`- ${siteUrl}/examples/${app.slug}`);
    lines.push(`- Category: ${app.category}; device: ${app.device}`);
    lines.push(`- Components: ${app.uses.join(', ')}`);
    if (app.deps?.length) lines.push(`- Runtime dependencies: ${app.deps.join(', ')}`);
    lines.push('');
  }

  return lines.join('\n');
}
