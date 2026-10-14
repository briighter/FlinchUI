# FlinchUI — Config-Driven UI Engine

A production-ready, schema-driven React component library built for applications
serving millions of concurrent users. Visual definitions are pure, deterministic,
JSON-serializable trees — friendly to human developers and autonomous AI agents alike.

## Architectural pillars

| Vector | Mechanism |
| --- | --- |
| **Zero-bundle bleed** | Zod parsing + sanitization executes inside React Server Components. Only validated JSON crosses to the client; Zod never ships in the browser bundle. |
| **Dynamic chunking** | `next/dynamic` registry loads a component's code only when the active schema references it. Absent components are never downloaded. |
| **Zero-runtime styling** | Tailwind CSS v4 atomic tokens only. No Emotion, no styled-components, no inline styles — style changes are cheap string alterations with no layout thrashing. |
| **60 FPS runtime** | Every primitive and every tree node is `React.memo`-scoped with `useCallback`/`useMemo`-stabilized handlers. Typing in one `Input` re-renders only that leaf. |
| **Agent-safe contracts** | Strict TypeScript + Zod schemas. Components contain zero business logic; all behavior is declared via `actionId` and pipelined into a host-supplied `onAction` event bus. |

## Quickstart

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. The demo page validates its schema on the server
(RSC), streams the clean JSON to a client host, and renders the tree with
on-demand code-split primitives. Open the console to watch `ActionEvent`
objects flow through the pipeline as you interact.

```bash
npm run typecheck   # strict tsc --noEmit
npm run build       # production build
```

## Project structure

```text
src/
├── types/
│   └── configUI.ts                # Declarative layout schemas & component prop contracts
├── lib/
│   └── validation/
│       └── uiValidator.ts         # Zod validation, sanitization, id stabilization
├── components/
│   ├── config-ui/
│   │   ├── ConfigRenderer.tsx     # Async registry router & recursive iterator (client)
│   │   ├── SafeComponentBoundary.tsx # Per-node error isolation (client)
│   │   └── primitives/
│   │       ├── Container.tsx      # Structural flex/grid block
│   │       ├── Card.tsx           # Presentational surface
│   │       ├── Heading.tsx        # Typography element
│   │       ├── Button.tsx         # Transactional action primitive
│   │       └── Input.tsx          # Controlled state field container
│   └── DemoHost.tsx               # Example client host wiring the action bus
└── app/
    ├── layout.tsx                 # RSC shell
    ├── page.tsx                   # RSC page: validate → render
    └── globals.css                # Tailwind v4 entry
```

## Usage

### 1. Author the schema (JSON)

```json
{
  "version": "1.0.0",
  "root": {
    "id": "page-root",
    "type": "Container",
    "display": "flex",
    "direction": "column",
    "gap": "lg",
    "children": [
      { "id": "title", "type": "Heading", "level": 1, "text": "Welcome" },
      {
        "id": "cta",
        "type": "Button",
        "actionId": "checkout.start",
        "label": "Checkout",
        "variant": "primary",
        "payload": { currency: "USD" }
      }
    ]
  }
}
```

### 2. Validate on the server (RSC)

```tsx
import { validateAndSanitizeUI } from '@/lib/validation/uiValidator';

export default function Page() {
  // Never throws. Returns PageLayoutSchema | null.
  const schema = validateAndSanitizeUI(rawUntrustedPayload);
  if (schema === null) return <InvalidConfigNotice />;
  return <ClientHost schema={schema} />;
}
```

### 3. Render on the client

```tsx
'use client';
import { ConfigRenderer } from '@/components/config-ui/ConfigRenderer';

<ConfigRenderer
  schema={schema}
  onAction={(event) => eventBus.dispatch(event.actionId, event)}
/>
```

## Node catalog

| Node | Required props | Optional props |
| --- | --- | --- |
| `Container` | `id`, `children` | `display`, `direction`, `wrap`, `gap`, `align`, `justify`, `columns`, `className`, `testId`, `ariaLabel` |
| `Card` | `id`, `children` | `variant`, `padding`, `radius`, `className`, `testId`, `ariaLabel` |
| `Heading` | `id`, `level`, `text` | `align`, `truncate`, `className`, `testId`, `ariaLabel` |
| `Button` | `id`, `actionId`, `label` | `variant`, `size`, `disabled`, `fullWidth`, `payload`, `className`, `testId`, `ariaLabel` |
| `Input` | `id`, `name` | `label`, `placeholder`, `kind`, `required`, `disabled`, `readOnly`, `defaultValue`, `helperText`, `actionId`, `payload`, `constraints`, `className`, `testId` |

All design tokens are closed enums (e.g. `gap: 'xs' | 'sm' | 'md' | 'lg' | 'xl'`),
so styles stay deterministic and auditable.

## Action pipeline

Primitives never call business logic. `Button` emits `click`; `Input` emits
`change`, `blur`, and `submit` (Enter). Each `ActionEvent` carries
`{ actionId, nodeId, event, value?, payload?, timestamp }` and flows into the
single host-supplied `onAction` handler, which dispatches to the application's
event bus.

## Security model

- Strict Zod parsing with `.strict()` objects — unknown keys, wrong types, and
  invalid enums reject the entire payload.
- `className` tokens pass a character allowlist and a script-injection blocklist
  (`javascript:`, `expression(`, `url(`, quotes, angle brackets, …).
- Text fields are stripped of `<script>` tags and control characters, then
  length-capped.
- `constraints.pattern` must be a compilable regular expression.
- Structural budgets: tree depth ≤ 32, total nodes ≤ 5,000, children per node ≤ 250.
- Missing or malformed node ids are replaced with deterministic path-based ids
  (`n-root-0-2`), so agent-authored payloads stay renderable.
- Each node renders inside a `SafeComponentBoundary`; a broken branch is
  replaced by a clean fallback widget while the rest of the tree stays live.

## Extending the registry

1. Add the node type to `NODE_TYPES` and define its interface in `src/types/configUI.ts`.
2. Mirror it with a strict Zod schema in `src/lib/validation/uiValidator.ts`.
3. Implement the primitive in `src/components/config-ui/primitives/` — full
   `React.memo`, static token maps, `actionId`-only events.
4. Register a chunk factory in `CHUNK_FACTORIES` inside `ConfigRenderer.tsx`.

Host-side component overrides (white-labeling, A/B tests) can be injected via the
`components` prop of `ConfigRenderer` without touching the registry.

## Performance notes

- Chunk wrappers are cached in a module-level `Map`, so `dynamic()` is constructed
  once per node type and component identity is stable across renders.
- Chunk resolution happens per-node inside `useMemo` — unreferenced node types
  never trigger an import.
- All Tailwind classes exist as literal strings in static maps, so the v4
  scanner emits exactly the utilities the schema can produce — nothing more.
