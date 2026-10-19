# AGENTS.md — working in FlinchUI

FlinchUI is a copy-paste React component library **and** its documentation site. This
file is the contract for agents and humans changing either one.

- Components live in `src/components/ui/` and are distributed as source.
- Documentation lives in `src/app/(docs)/` and reads from `src/registry/`.
- The registry (`src/registry/components.ts`) is the single source of truth for the
  sidebar, search, props tables, CLI, JSON API, and `llms.txt`.
- `src/lib/validation/uiValidator.ts` enforces the JSON config schema described at the
  bottom of this file.

## Commands

```bash
npm run dev         # docs site
npm run typecheck   # tsc --noEmit — run before finishing
npm run build       # production build — also catches RSC boundary errors
npm run registry    # regenerate packages/cli/registry.json after registry edits
```

Do not claim a change works without running `typecheck` and, for UI changes, `build`.

## Adding a component

1. Create `src/components/ui/<kebab-name>.tsx`.
2. Export it from `src/components/ui/index.ts`.
3. Add a registry entry in `src/registry/components.ts`.
4. Add a real example in `src/content/examples/<category>.tsx`.
5. If it needs interactive callbacks in an example, add the demo to
   `src/content/demos.tsx` (a client file) and render that from the example.
6. Run `npm run registry`, `npm run typecheck`, `npm run build`.

If the component is not yet implemented, still add the registry entry with
`status: 'planned'`; its docs page renders without examples.

## Component conventions

- **One file, one component.** Export the props interface, the `…Schema` object, and
  the resolved `…Variants` function. Names are kebab-case on disk, PascalCase in code.
- **Extend the right props interface.** Use `ComponentPropsWithRef<'button'>` or
  `HTMLAttributes<HTMLDivElement>`. If you redeclare `title`, `Omit` it from the base
  interface. `ref` is a normal prop in React 19 — do not add `forwardRef` unless the
  existing file already uses it.
- **Static Tailwind classes only.** No inline `style`, no CSS-in-JS, no `<style>`
  strings, no string concatenation Tailwind cannot see. Closed unions for style props;
  put shared class maps in `src/lib/tokens.ts`.
- **Semantic tokens only.** `bg-surface`, `text-fg-muted`, `border-border`,
  `ring-ring`, `bg-brand-600`, `text-fg-on-brand`, status tokens. Never `bg-white`,
  `text-slate-600`, or hex values inside a component. Themes override `--color-*` by
  the same name, so indirection breaks subtree theming.
- **`cn()` merges last.** Consumers must be able to override via `className`. `cn()`
  does not resolve Tailwind conflicts — never document it as if it does.
- **`asChild`** delegates to `Slot` for any component wrapping a replaceable element.
- **Native first.** `<dialog>` for modals, `<details>` for disclosure, `<button>` for
  switches/toggles, `<input>`/`<select>` for fields. Add ARIA only to fill real gaps.
- **Client boundary.** Add `'use client'` only when the file owns state, effects, refs,
  or event handlers. A Server Component must never pass a function prop to a Client
  Component — that is why interactive examples live in `demos.tsx`.
- **Example content must run.** Example JSX is imported into the docs page and
  prerendered. Callbacks belong in client demos, never inline in server content.

## Documentation conventions

- Every example is `<Example title description code={…}>` with a live preview and the
  exact source shown. Highlighting is build-time Shiki via a server singleton.
- Prefer several small examples over one large one: states, sizes, variants, edge
  cases. Use `previewClassName="p-0"` for full-bleed components.
- Registry `props` rows are hand-authored. Keep `type`, `default`, and `required`
  accurate; they render verbatim in the props table and the AI surfaces.
- Update `src/registry/guides.ts` only when adding a top-level guide; guide prose lives
  in `src/content/guides.tsx` with a matching TOC entry.
- `npx flinchui add <slug>` appears in component pages and guides. Keep the CLI
  implementation (`packages/cli`) in sync with any command-shape change.

## Machine-readable surfaces

`src/lib/llms.ts` generates `/llms.txt` and `/llms-full.txt`; `src/app/api/registry/`
serves JSON. Both read the registry and add no independent data. If you add a field to
`ComponentDoc`, update the API/llms output only when it is useful to consumers.

## Config renderer JSON rules

These apply when authoring or accepting JSON for `ConfigRenderer`. The validator
rejects the **entire payload** (`validateAndSanitizeUI` returns `null`) on violation.

1. **Every node needs an `id`** matching `^[A-Za-z0-9_\-:.]+$` (max 128 chars).
   Missing or malformed ids are stabilized deterministically (`n-root-0-2`), but
   explicit semantic ids are required for stable action routing.
2. **Styling is `className` only** — atomic Tailwind utilities. No `style` objects, no
   CSS-in-JS, no `<style>` strings.
3. **Never embed logic.** No handlers, functions, or expressions. Behavior is
   `actionId` + optional JSON-serializable `payload`, handled by the host event bus.
4. **`payload` is JSON-serializable**: strings, finite numbers, booleans, `null`, and
   nested arrays/objects (arrays capped at 64 entries).
5. **Enumerated props are closed sets.** `gap` is
   `'none'|'xs'|'sm'|'md'|'lg'|'xl'|'2xl'`, `columns` is 1–12, etc. Unknown enum
   values are rejected.
6. **Unknown keys are rejected** everywhere (`.strict()`).
7. **Text fields** (`text`, `label`, `placeholder`, `helperText`, `ariaLabel`) are
   length-capped and stripped of `<script>` tags and control characters.
8. **Input constraints** (`minLength`, `maxLength`, `pattern`, `min`, `max`) must be
   sane; `pattern` must compile.
9. **Structural budgets**: depth ≤ 32, total nodes ≤ 5,000, children ≤ 250 per node.
10. **Validate before you trust**: pass agent/CMS output through
    `validateAndSanitizeUI(input)` inside a React Server Component before rendering.
    Never pass raw JSON to `ConfigRenderer`.

Minimal valid schema:

```json
{
  "version": "1.0.0",
  "root": {
    "id": "root",
    "type": "Container",
    "display": "flex",
    "direction": "column",
    "gap": "md",
    "children": [
      { "id": "h", "type": "Heading", "level": 2, "text": "Hello" },
      { "id": "b", "type": "Button", "actionId": "ping", "label": "Ping" }
    ]
  }
}
```
