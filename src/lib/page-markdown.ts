import type { ReactNode } from 'react';
import { readFile } from 'node:fs/promises';
import { categories, components } from '@/registry/components';
import { guides } from '@/registry/guides';
import { nativeSnippets } from '@/registry/native';
import { registryVersion, type ComponentDoc } from '@/lib/registry';
import { showcaseApps, type ShowcaseApp } from '@/lib/showcase';
import { DEFAULT_CONTROLS, SEED_PRESETS } from '@/lib/theme';
import { siteUrl } from '@/lib/site';
import { exampleContent } from '@/content/examples';
import { guideContent } from '@/content/guides';
import { collectExamples, inlineMarkdown, jsxToMarkdown } from '@/lib/markdown';

/**
 * Markdown mirrors of every page.
 *
 * Each builder reads the same registry and React trees the pages render, so a
 * `.md` URL is a lossless-enough view of the page for an LLM: headings, prose,
 * example source, prop tables, and links. No HTML scraping, no second copy of
 * the docs.
 */

type FrontMatter = Record<string, string | string[] | undefined>;

function frontMatter(fields: FrontMatter): string {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}: [${value.map((entry) => JSON.stringify(entry)).join(', ')}]`);
    } else {
      lines.push(`${key}: ${JSON.stringify(value)}`);
    }
  }
  lines.push('---', '');
  return lines.join('\n');
}

function tidy(value: string): string {
  return `${value
    .replace(/\r\n/g, '\n')
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
}

function fence(code: string, language = 'tsx'): string {
  const runs = code.match(/`+/g);
  const longest = runs ? Math.max(...runs.map((run) => run.length)) : 0;
  const marker = '`'.repeat(Math.max(3, longest + 1));
  return `${marker}${language}\n${code.replace(/\s+$/, '')}\n${marker}`;
}

function cell(value: string): string {
  return value.replace(/\|/g, '\\|').replace(/\n/g, ' ');
}

function capitalise(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function categoryLabel(id: string): string {
  return categories.find((category) => category.id === id)?.label ?? capitalise(id);
}

function componentLink(slug: string): string {
  const component = components.find((entry) => entry.slug === slug);
  return component
    ? `[${component.name}](/components/${component.slug}.md) — ${component.description}`
    : `[${slug}](/components/${slug}.md)`;
}

function componentFrontMatter(component: ComponentDoc, url: string): string {
  return frontMatter({
    title: component.name,
    description: component.description,
    type: 'component',
    category: component.category,
    status: component.status ?? 'stable',
    version: registryVersion,
    url,
    markdown: `${url}.md`,
    source: component.files,
    dependencies: component.deps,
  });
}

/* -------------------------------------------------------------------------- */
/*  Component page                                                            */
/* -------------------------------------------------------------------------- */

export function componentMarkdown(slug: string): string | null {
  const component = components.find((entry) => entry.slug === slug);
  if (!component) return null;

  const url = `${siteUrl}/components/${component.slug}`;
  const Content = exampleContent[component.category] as
    | ((props: { slug: string }) => ReactNode)
    | undefined;
  const examples = Content ? collectExamples(Content({ slug: component.slug })) : [];
  const native = nativeSnippets[component.slug];

  const parts: string[] = [componentFrontMatter(component, url), `# ${component.name}\n`];
  parts.push(`${component.description}\n`);

  if (component.intro) parts.push(`${component.intro}\n`);

  const facts = [`- **Category:** ${categoryLabel(component.category)}`];
  if (component.status && component.status !== 'stable') {
    facts.push(`- **Status:** ${capitalise(component.status)}`);
  }
  facts.push(
    component.deps?.length
      ? `- **Dependencies:** ${component.deps.map((dep) => `\`${dep}\``).join(', ')}`
      : '- **Dependencies:** none beyond React and Tailwind CSS',
  );
  if (component.files?.length) {
    facts.push(`- **Source files:** ${component.files.map((file) => `\`${file}\``).join(', ')}`);
  }
  parts.push(`${facts.join('\n')}\n`);

  parts.push('## Install\n');
  parts.push(fence(`npx flinchui add ${component.slug}`, 'bash') + '\n');
  if (component.deps?.length) {
    parts.push(
      `This component needs ${component.deps
        .map((dep) => `\`${dep}\``)
        .join(', ')}. Every other component is dependency-free.\n`,
    );
  }

  if (examples.length) {
    parts.push('## Examples\n');
    for (const example of examples) {
      const title = example.title ? inlineMarkdown(example.title).trim() : '';
      if (title) parts.push(`### ${title}\n`);
      if (example.description) parts.push(`${inlineMarkdown(example.description).trim()}\n`);
      parts.push(`${fence(example.code, example.language)}\n`);
    }
  }

  if (component.props?.length) {
    parts.push('## API reference\n');
    const rows = [
      '| Prop | Type | Default | Required | Description |',
      '| --- | --- | --- | --- | --- |',
      ...component.props.map(
        (prop) =>
          `| \`${cell(prop.name)}\` | \`${cell(prop.type)}\` | ${
            prop.default ? `\`${cell(prop.default)}\`` : '—'
          } | ${prop.required ? 'yes' : '—'} | ${cell(prop.description)} |`,
      ),
    ];
    parts.push(`${rows.join('\n')}\n`);
  }

  if (component.a11y?.length) {
    parts.push('## Accessibility\n');
    parts.push(`${component.a11y.map((note) => `- ${note}`).join('\n')}\n`);
  }

  if (native) {
    parts.push('## React Native\n');
    parts.push(
      'Documentation-only parity: the same prop names and design tokens, mapped onto native primitives.\n',
    );
    parts.push(`${fence(native, 'tsx')}\n`);
  }

  if (component.related?.length) {
    parts.push('## Related\n');
    parts.push(`${component.related.map((related) => `- ${componentLink(related)}`).join('\n')}\n`);
  }

  return tidy(parts.join('\n'));
}

/* -------------------------------------------------------------------------- */
/*  Guide page                                                                */
/* -------------------------------------------------------------------------- */

export function guideMarkdown(slug: string): string | null {
  const guide = guides.find((entry) => entry.slug === slug);
  const content = guideContent[slug];
  if (!guide || !content) return null;

  const url = `${siteUrl}/docs/${guide.slug}`;
  const body = jsxToMarkdown((content.Component as () => ReactNode)());

  return tidy(
    [
      frontMatter({
        title: guide.title,
        description: guide.description,
        type: 'guide',
        group: guide.group,
        version: registryVersion,
        url,
        markdown: `${url}.md`,
      }),
      body,
    ].join('\n'),
  );
}

/* -------------------------------------------------------------------------- */
/*  Showcase example page                                                     */
/* -------------------------------------------------------------------------- */

function showCaseFrontMatter(app: ShowcaseApp): string {
  const url = `${siteUrl}/examples/${app.slug}`;
  return frontMatter({
    title: `${app.name} — ${app.title}`,
    description: app.tagline,
    type: 'example',
    category: app.category,
    device: app.device,
    url,
    markdown: `${url}.md`,
    source: `src/components/showcase/apps/${app.slug}.tsx`,
    dependencies: app.deps,
  });
}

export async function exampleMarkdown(slug: string): Promise<string | null> {
  const app = showcaseApps.find((entry) => entry.slug === slug);
  if (!app) return null;

  const sourcePath = `src/components/showcase/apps/${app.slug}.tsx`;
  const source = await readFile(`${process.cwd()}/${sourcePath}`, 'utf8').catch(() => null);

  const parts = [
    showCaseFrontMatter(app),
    `# ${app.name} — ${app.title}\n`,
    `${app.tagline}\n`,
    `${app.description}\n`,
    [
      `- **Category:** ${app.category}`,
      `- **Surface:** ${app.device === 'mobile' ? 'Mobile (390 × 844)' : 'Desktop'}`,
      app.deps?.length
        ? `- **Runtime dependencies:** ${app.deps.map((dep) => `\`${dep}\``).join(', ')}`
        : '- **Runtime dependencies:** none',
      `- **Components used:** ${app.uses.length}`,
    ].join('\n') + '\n',
    '## What it demonstrates\n',
    `${app.highlights.map((highlight) => `- ${highlight}`).join('\n')}\n`,
    '## Components used\n',
    `${app.uses.map((name) => {
      const component = components.find((entry) => entry.name === name);
      return component
        ? `- [${component.name}](/components/${component.slug}.md) — ${component.description}`
        : `- ${name}`;
    }).join('\n')}\n`,
    '## Source\n',
    `The complete composition is a single file: \`${sourcePath}\`. Open the live page at ${siteUrl}/examples/${app.slug} to interact with it.\n`,
    source ? `${fence(source, 'tsx')}\n` : '',
    '## Build it yourself\n',
    `Copy the components it uses, then compose them the same way:\n\n${fence(
      `npx flinchui add ${app.uses
        .map((name) => components.find((entry) => entry.name === name)?.slug)
        .filter(Boolean)
        .join(' ')}`,
      'bash',
    )}\n`,
  ];

  return tidy(parts.join('\n'));
}

/* -------------------------------------------------------------------------- */
/*  Indices and site pages                                                    */
/* -------------------------------------------------------------------------- */

export function homeMarkdown(): string {
  const parts = [
    frontMatter({
      title: 'FlinchUI',
      description:
        'A lightweight, infinitely extensible React component library built on Tailwind v4 design tokens.',
      type: 'page',
      version: registryVersion,
      url: siteUrl,
      markdown: `${siteUrl}/index.md`,
    }),
    '# FlinchUI\n',
    '> React components you copy in. Not a runtime you install.\n',
    `FlinchUI is a Bootstrap-style component library for React and Tailwind v4. Every component is copy-paste source built on semantic design tokens — lightweight, accessible, and endlessly extensible.\n`,
    `${components.length} components · ${categories.length} categories · 7 themes · zero runtime styling.\n`,
    '## Start here\n',
    [
      `- [Installation](/docs/installation.md) — scaffold Tailwind v4, add tokens, copy your first component.`,
      `- [Introduction](/docs/introduction.md) — the design constraints behind copy-paste distribution.`,
      `- [Build with an AI agent](/docs/agents.md) — the canonical protocol for an agent adding FlinchUI.`,
      `- [Component index](/components.md) — every component, grouped by category.`,
      `- [Examples](/examples.md) — complete applications built from the primitives.`,
      `- [Theme Studio](/tools/theme.md) — generate a theme and export CSS, JSON, or a prompt.`,
    ].join('\n') + '\n',
    '## Quick start\n',
    fence(
      `# once per project\nnpx flinchui init\n\n# then, per component\nnpx flinchui add button dialog data-table`,
      'bash',
    ) + '\n',
    '## Machine-readable surfaces\n',
    [
      `- [llms.txt](${siteUrl}/llms.txt) — compact index of every page and component.`,
      `- [llms-full.txt](${siteUrl}/llms-full.txt) — the full registry as one Markdown file.`,
      `- [Registry API](${siteUrl}/api/registry) — every component as JSON.`,
      `- [Theme API](${siteUrl}/api/theme) — generate a theme from a seed; \`format=css\` for a stylesheet.`,
      `- Every page has a Markdown twin: append \`.md\` to its URL (for example ${siteUrl}/components/button.md).`,
    ].join('\n') + '\n',
    '## Components\n',
    ...categories.map((category) => {
      const items = components.filter((component) => component.category === category.id);
      if (!items.length) return '';
      return `### ${category.label}\n\n${items
        .map((component) => `- [${component.name}](/components/${component.slug}.md) — ${component.description}`)
        .join('\n')}\n`;
    }),
    '## Guides\n',
    `${guides.map((guide) => `- [${guide.title}](/docs/${guide.slug}.md) — ${guide.description}`).join('\n')}\n`,
  ];

  return tidy(parts.join('\n'));
}

export function componentsIndexMarkdown(): string {
  const parts = [
    frontMatter({
      title: 'Components',
      description: `All ${components.length} FlinchUI components, grouped by category.`,
      type: 'index',
      version: registryVersion,
      url: `${siteUrl}/components`,
      markdown: `${siteUrl}/components.md`,
    }),
    '# Components\n',
    `Every component is a source file you copy into your repository. Run \`npx flinchui add <slug>\` or open a component's page for its props, examples, and accessibility notes.\n`,
  ];

  for (const category of categories) {
    const items = components.filter((component) => component.category === category.id);
    if (!items.length) continue;
    parts.push(`## ${category.label}\n`);
    parts.push(`${category.description}\n`);
    parts.push(
      `${items
        .map((component) => {
          const beta = component.status === 'beta' ? ' *(beta)*' : '';
          const deps = component.deps?.length ? ` *(${component.deps.join(', ')})*` : '';
          return `- [${component.name}](/components/${component.slug}.md) — ${component.description}${beta}${deps}`;
        })
        .join('\n')}\n`,
    );
  }

  return tidy(parts.join('\n'));
}

export function docsIndexMarkdown(): string {
  const groups = Array.from(new Set(guides.map((guide) => guide.group)));
  const parts = [
    frontMatter({
      title: 'Documentation',
      description: 'Guides for installing, theming, extending, and automating FlinchUI.',
      type: 'index',
      version: registryVersion,
      url: `${siteUrl}/docs`,
      markdown: `${siteUrl}/docs.md`,
    }),
    '# Documentation\n',
    'Start with installation, then read the authoring contract before changing a component. Agents should begin with [Build with an AI agent](/docs/agents.md).\n',
  ];

  for (const group of groups) {
    parts.push(`## ${group}\n`);
    parts.push(
      `${guides
        .filter((guide) => guide.group === group)
        .map((guide) => `- [${guide.title}](/docs/${guide.slug}.md) — ${guide.description}`)
        .join('\n')}\n`,
    );
  }

  return tidy(parts.join('\n'));
}

export function examplesIndexMarkdown(): string {
  const parts = [
    frontMatter({
      title: 'Examples',
      description: `Complete applications built entirely from FlinchUI components.`,
      type: 'index',
      version: registryVersion,
      url: `${siteUrl}/examples`,
      markdown: `${siteUrl}/examples.md`,
    }),
    '# Built with FlinchUI\n',
    'Not screenshots and not mockups. Every surface is a real React tree assembled from the same components you copy out of the registry — no runtime styling engine, no component framework, and no charting library.\n',
  ];

  for (const app of showcaseApps) {
    parts.push(`## ${app.name} — ${app.title}\n`);
    parts.push(`${app.tagline}\n`);
    parts.push(`${app.description}\n`);
    parts.push(
      [
        `- **Category:** ${app.category}`,
        `- **Surface:** ${app.device === 'mobile' ? 'Mobile' : 'Desktop'}`,
        `- **Components:** ${app.uses.join(', ')}`,
        `- **Page:** ${siteUrl}/examples/${app.slug}`,
        `- **Markdown:** ${siteUrl}/examples/${app.slug}.md`,
      ].join('\n') + '\n',
    );
  }

  return tidy(parts.join('\n'));
}

export function toolsIndexMarkdown(): string {
  return tidy(
    [
      frontMatter({
        title: 'Tools',
        description: 'FlinchUI services: theme generation, the registry API, and the CLI.',
        type: 'index',
        version: registryVersion,
        url: `${siteUrl}/tools`,
        markdown: `${siteUrl}/tools.md`,
      }),
      '# Tools\n',
      'FlinchUI is a library you copy, so the useful tooling produces artefacts: theme CSS, registry JSON, and source files.\n',
      '## Theme Studio\n',
      `Generate a complete OKLCH theme from a seed hue, audit its contrast, and export CSS, JSON, or an agent-ready prompt. [Open the studio](${siteUrl}/tools/theme) · [Markdown](${siteUrl}/tools/theme.md)\n`,
      '## Theme API\n',
      `${fence(`curl -s "${siteUrl}/api/theme?preset=violet&format=css"`, 'bash')}\n\nSee the [Theme Studio documentation](${siteUrl}/tools/theme.md) for parameters and response shape.\n`,
      '## Registry API\n',
      `${fence(`curl -s "${siteUrl}/api/registry/button"`, 'bash')}\n\nEvery component as JSON: slug, category, props, files, dependencies, and accessibility notes.\n`,
      '## CLI\n',
      `${fence(`npx flinchui add button dialog data-table`, 'bash')}\n\nCopies a component and its import graph into your project. See [CLI](/docs/cli.md).\n`,
    ].join('\n'),
  );
}

export function themeToolMarkdown(): string {
  const shipped = [
    'light',
    'dark',
    'violet',
    'emerald',
    'amber',
    'rose',
    'high-contrast',
  ];
  const controls = DEFAULT_CONTROLS;

  return tidy(
    [
      frontMatter({
        title: 'Theme Studio',
        description:
          'Generate a complete FlinchUI theme from a seed colour: OKLCH tokens, a measured WCAG contrast audit, copy-paste CSS, JSON, and an agent-ready prompt.',
        type: 'tool',
        version: registryVersion,
        url: `${siteUrl}/tools/theme`,
        markdown: `${siteUrl}/tools/theme.md`,
      }),
      '# Theme Studio\n',
      'A FlinchUI theme is nothing but a block of CSS custom properties, so a theme generator is a function from a seed to that block. The studio exposes that function in the browser; the same output is available over HTTP.\n',
      'Components never change: they read semantic tokens, so setting `data-theme="prism"` re-themes any subtree with no JavaScript.\n',
      '## Generate a theme\n',
      `${fence(`curl -s "${siteUrl}/api/theme?hue=265&chroma=1&mode=light"`, 'bash')}\n`,
      'Return the stylesheet directly with `format=css`:\n',
      `${fence(`curl -s "${siteUrl}/api/theme?preset=violet&mode=dark&format=css"`, 'bash')}\n`,
      '## Parameters\n',
      [
        '| Parameter | Type | Range | Default |',
        '| --- | --- | --- | --- |',
        `| \`hue\` | number | 0–360 | ${controls.hue} |`,
        `| \`chroma\` | number | 0–1.6 | ${controls.chroma} |`,
        `| \`neutralHue\` | number | 0–360 | ${controls.neutralHue} |`,
        `| \`neutralChroma\` | number | 0–0.03 | ${controls.neutralChroma} |`,
        `| \`mode\` | string | \`light\`, \`dark\` | ${controls.mode} |`,
        `| \`radius\` | number | 0–2 | ${controls.radius} |`,
        '| `preset` | string | see below | — |',
        '| `format` | string | `json`, `css` | `json` |',
      ].join('\n') + '\n',
      'Every parameter is optional and clamped, so an invalid guess still returns a valid theme rather than an error. Individual parameters override `preset`.\n',
      '## Seed presets\n',
      [
        '| Preset | Hue | Chroma |',
        '| --- | --- | --- |',
        ...SEED_PRESETS.map(
          (preset) => `| \`${preset.name.toLowerCase()}\` | ${preset.hue} | ${preset.chroma} |`,
        ),
      ].join('\n') + '\n',
      '## Shipped themes\n',
      shipped.map((theme) => `- \`${theme}\``).join('\n') + '\n',
      '## JSON response\n',
      'The default response includes `controls`, `tokens`, `css`, `audit` (measured WCAG contrast pairs), and `sources` URLs. Use `tokens` to build a React Native theme object, or `css` to write a stylesheet.\n',
      '## Apply the CSS\n',
      `${fence(
        `/* app.css — after the FlinchUI token layer */\n[data-theme="prism"] {\n  /* paste the generated block here */\n}\n\n/* then, anywhere in the tree */\n<ThemeProvider theme="prism">…</ThemeProvider>`,
        'css',
      )}\n`,
      'Or set the attribute directly: `document.documentElement.dataset.theme = "prism"`. The default `light` theme needs no attribute.\n',
      '## Catalogue endpoint\n',
      `${fence(`curl -s "${siteUrl}/api/themes"`, 'bash')}\n\nReturns shipped themes, presets, parameter ranges, and endpoint URLs — enough for an agent to choose a theme without reading this page.\n`,
      '## Agent prompt\n',
      'The studio exports a ready-to-paste prompt containing the chosen seed, the resulting tokens, and the rules for applying them. Fetch the same data from the API and hand the agent `tokens` plus the CSS. Do not ask an agent to invent token names: they are the contract.\n',
      '## Related\n',
      `- [Theming guide](${siteUrl}/docs/theming.md)\n- [Build with an AI agent](${siteUrl}/docs/agents.md)\n- [Registry API](${siteUrl}/api/registry)\n`,
    ].join('\n'),
  );
}


