# AGENTS.md — Authoring FlinchUI schemas

Rules for humans and AI agents that read or write FlinchUI JSON configurations.
The runtime enforces every rule below via `src/lib/validation/uiValidator.ts`;
violations reject the entire payload (`validateAndSanitizeUI` returns `null`).

1. **Every node needs an `id`** matching `^[A-Za-z0-9_\-:.]+$` (max 128 chars).
   Omitted or malformed ids are auto-stabilized to deterministic path-based ids
   (`n-root-0-2`), but explicit semantic ids are strongly preferred.
2. **Styling is `className` only** — atomic utility tokens (Tailwind). Never use
   inline `style` objects, CSS-in-JS, or `<style>` strings.
3. **Never embed logic.** No inline handlers, no function values, no expressions.
   Behavior is declared with `actionId` (plus an optional JSON-serializable
   `payload`) and handled by the host application's event bus.
4. **`payload` must be JSON-serializable**: strings, finite numbers, booleans,
   `null`, and nested arrays/objects of those (max depth implied by JSON, max
   64 array entries).
5. **Enumerated props are closed sets.** `gap` is `'none'|'xs'|'sm'|'md'|'lg'|'xl'|'2xl'`,
   `variant` is one of the documented tokens, `columns` is an integer 1–12, etc.
   Unknown enum values are rejected.
6. **Unknown keys are rejected** everywhere (`.strict()`). Typos fail loudly
   instead of silently rendering wrong UI.
7. **Text fields** (`text`, `label`, `placeholder`, `helperText`, `ariaLabel`)
   are capped (≤ 2048 / 256 chars) and stripped of `<script>` tags and control
   characters.
8. **Input constraints** (`minLength`, `maxLength`, `pattern`, `min`, `max`) must
   be sane, and `pattern` must be a compilable regular expression.
9. **Structural budgets**: nesting depth ≤ 32, total nodes ≤ 5,000,
   children per node ≤ 250.
10. **Validate before you trust**: always pass agent output through
    `validateAndSanitizeUI(input)` inside a React Server Component before handing
    it to `ConfigRenderer`.

## Minimal valid schema

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
