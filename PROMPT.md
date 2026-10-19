# PROMPT.md — FlinchUI agent instructions

You are adding components from **FlinchUI**, a copy-paste React component library.
Components are source files in the consumer's repository, built on Tailwind CSS v4
design tokens. There is no runtime package to import and no provider to install.

## Workflow

1. **Discover the slug.** Fetch `https://flinchui.dev/llms.txt` (or
   `http://localhost:3000/llms.txt` in this repo). Never guess a component name.
2. **Read the entry.** Fetch `https://flinchui.dev/api/registry/<slug>` for files,
   dependencies, and props.
3. **Add it.** Prefer the CLI: `npx flinchui add <slug>`. It copies the component, its
   shared helpers, and any opt-in dependencies, then updates `components.json`.
4. **Verify.** Run `npm run typecheck` (or `tsc --noEmit`) and the project's build.
   Do not claim success without running them.

If the CLI is unavailable (for example, working inside this repository), use:

```bash
node packages/cli/bin/flinchui.mjs add <slug>
```

## Rules when writing or changing component code

- One component per file under `src/components/ui/`. Filenames are kebab-case.
- Export the props interface, the variant schema, and the resolved variant function
  (for example `buttonSchema` and `buttonVariants`).
- **Static Tailwind classes only.** No inline `style`, no CSS-in-JS, no `<style>`
  strings, no class-name concatenation that Tailwind cannot see as a literal.
- **Semantic tokens only.** Use `bg-surface`, `text-fg-muted`, `border-border`,
  `bg-brand-600`, `text-fg-on-brand`, `ring-ring`. Never use `bg-white`,
  `text-slate-600`, or a raw palette class in a reusable component.
- Style-selecting props are **closed unions**. Do not accept arbitrary strings.
- Merge `className` last through `cn()` so consumers can override styling. `cn()` does
  not resolve Tailwind conflicts — do not pretend it does.
- Prefer native elements: `<button>`, `<dialog>`, `<details>`, `<input>`, `<table>`.
  Add ARIA only where the platform has no equivalent, and never remove focus styles.
- Add `'use client'` only when the file owns state, effects, refs, or event handlers.
- A Server Component cannot pass a function prop to a Client Component. Keep callbacks
  inside client components.
- Icon-only controls need an accessible name. Touch targets should be at least 44px.
- Respect `prefers-reduced-motion`.

## Registry entries

Add every new component to `src/registry/components.ts`:

```ts
{
  slug: 'my-component',
  name: 'MyComponent',
  category: 'layout', // layout | typography | actions | forms | data-display
                      // | disclosure | feedback | overlays | navigation
  description: 'One sentence for navigation and search.',
  status: 'stable',
  preview: true,
  files: ['src/components/ui/my-component.tsx'],
  deps: [], // only if the component genuinely needs a runtime package
  props: [{ name: 'gap', type: "'sm' | 'md'", default: "'md'", description: '…' }],
  related: ['stack'],
  a11y: ['Renders a native element and preserves the platform focus ring.'],
}
```

Never invent props. The registry and the props table are the contract.

## Theming contract

Themes are `[data-theme="…"]` blocks that override `--color-*` variables by the same
name. Do not introduce indirection (`--flinch-*`), do not scope tokens to a component,
and do not hard-code hex values in components. Use `fg-on-brand` for text on a brand
fill and the status tokens (`success`, `warning`, `danger`, `info`) for state.

## Config renderer

If the task involves runtime-generated UI, do not emit JSX. Emit the JSON schema
described in `/docs/config-renderer` and pass it through
`validateAndSanitizeUI()` inside a React Server Component. Never render unvalidated
JSON. Behavior is expressed as `actionId` + JSON `payload`, never as code.

## Stop conditions

Ask before proceeding if:

- the requested component does not exist in the registry and would need a new runtime
  dependency;
- the change would require editing a copied component for page-specific behavior
  (compose instead);
- the requested prop value is not in the documented union.
