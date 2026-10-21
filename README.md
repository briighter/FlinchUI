# FlinchUI

Copy-paste React components you own. Built on Tailwind CSS v4 design tokens, styled
with static utilities, themable at runtime, and documented like Bootstrap — with live
previews and copyable source for every example.

```bash
npx flinchui add button
```

No runtime package. No provider. No CSS-in-JS. The CLI copies the component and its
imports into your repository, where they become ordinary files you can edit.

## Principles

- **Zero runtime styling.** Every class is a static Tailwind utility resolved at build
  time. There is no style recalculation and no hydration cost for styling.
- **The source is yours.** Components live in `src/components/ui/`, not in
  `node_modules`. Change anything, delete anything, keep the rest.
- **Semantic tokens.** Components reference `bg-surface` and `text-fg-muted`, never
  `bg-white` or `text-slate-600`. Swap a block of CSS variables to re-theme the whole
  application — including a subtree.
- **Native first.** Dialogs use `<dialog>`, accordions use `<details>`, switches use a
  real `<button>` with `role="switch"`. The platform already implements the hard parts.
- **Dependencies are opt-in.** Base components need only React and Tailwind. Popover,
  Tooltip, Dropdown Menu, and Hover Card require `@floating-ui/react` explicitly.
- **Infinitely extensible.** Variant maps are exported, `asChild` re-targets any
  component onto your own element, and `className` always merges last.

## Quickstart

Requires Node 18+ and Tailwind CSS v4.

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The repository is both the component library and its
documentation site.

```bash
npm run typecheck   # strict tsc --noEmit
npm run build       # production build (static docs)
npm run registry    # regenerate packages/cli/registry.json
```

## Add components to your project

The CLI is repo-local while the library is in preview:

```bash
# from this repository
node packages/cli/bin/flinchui.mjs add button badge

# once published
npx flinchui add dialog drawer toast
npx flinchui init
```

It copies the component, walks its imports for shared helpers, installs any opt-in
dependencies, and records what it wrote in `components.json`. Existing files are
skipped unless you pass `--overwrite`.

```bash
flinchui add <slug...>   # copy components
flinchui list            # browse the registry
flinchui info <slug>     # files, dependencies, props
flinchui init            # tokens + shared helpers
```

## Project structure

```text
src/
├── app/
│   ├── (docs)/                 # docs shell, component pages, guides
│   ├── api/registry/           # machine-readable registry (JSON)
│   ├── llms.txt/               # LLM index
│   ├── llms-full.txt/          # full machine-readable reference
│   └── page.tsx                # landing page
├── components/
│   ├── ui/                     # ← the library (66 components)
│   ├── docs/                   # docs-only building blocks
│   ├── config-ui/              # advanced JSON renderer
│   └── DemoHost.tsx            # config-renderer client host
├── content/
│   ├── examples/               # per-category documentation examples
│   ├── guides.tsx              # prose guides
│   └── demos.tsx               # client-side interactive demos
├── lib/
│   ├── cn.ts                   # class joiner (no dependencies)
│   ├── variants.ts             # variant-map resolver
│   ├── slot.tsx                # asChild implementation
│   ├── nav.ts / registry.ts    # nav + registry helpers
│   ├── llms.ts                 # llms.txt generators
│   └── validation/             # config-renderer Zod validator
├── registry/
│   ├── components.ts           # single source of truth
│   └── guides.ts               # guide metadata
└── styles/
    ├── tokens.css              # design tokens + base layer
    └── themes.css              # light, dark, violet, emerald, amber, rose, high contrast

packages/cli/                   # repo-local `flinchui` CLI
```

## Theming

Themes are CSS variable blocks selected by an attribute on any ancestor:

```html
<html data-theme="dark">
```

```css
/* your own theme */
[data-theme="ocean"] {
  --color-bg: oklch(0.98 0.01 220);
  --color-brand-600: oklch(0.54 0.13 220);
  --color-ring: oklch(0.54 0.13 220);
}
```

Because utilities resolve the variables at use-site, changing the attribute re-themes
every component with zero JavaScript and no re-render.

## Adding a component

1. Write `src/components/ui/my-component.tsx` following the conventions in
   [`AGENTS.md`](./AGENTS.md).
2. Register it in `src/registry/components.ts` — sidebar, search, API, CLI, and AI
   surfaces all read from there.
3. Add an example in `src/content/examples/<category>.tsx`.

The docs page, install command, props table, and machine-readable entries are
generated automatically.

## AI integration

- `GET /api/registry` — the full registry as JSON.
- `GET /api/registry/<slug>` — one component with files and dependencies.
- `GET /llms.txt` — a compact index for context windows.
- `GET /llms-full.txt` — the complete reference: tokens, rules, components, props.
- `/docs/agents` — the canonical protocol for an agent adding components, with a
  paste-ready system prompt. Its Markdown twin is `/agents.md`.
- **Every page has a `.md` twin** — append `.md` to any URL
  (`/components/button.md`, `/docs/theming.md`, `/examples/trading-terminal.md`).
  The indexes are `/index.md`, `/components.md`, `/docs.md`, `/examples.md`, and
  `/tools.md`.
- [`PROMPT.md`](./PROMPT.md) — the short version of the agent instructions.

## Config renderer (advanced)

The original JSON-driven engine still ships for runtime-generated UI (CMS pages,
feature-flag layouts, agents that assemble screens). Payloads are validated and
sanitized on the server by `validateAndSanitizeUI`, then rendered by `ConfigRenderer`
from a closed set of primitives. See `/docs/config-renderer` for the pipeline and a
live demo.

## License

MIT — see [LICENSE](./LICENSE).
