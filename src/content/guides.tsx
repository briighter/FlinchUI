import type { ComponentType, ReactNode } from 'react';
import Link from 'next/link';
import { Callout } from '@/components/docs/callout';
import { Snippet } from '@/components/docs/snippet';
import { Code } from '@/components/ui/code';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { HStack, VStack } from '@/components/ui/stack';
import { Grid } from '@/components/ui/grid';
import { DemoHost } from '@/components/DemoHost';
import { validateAndSanitizeUI } from '@/lib/validation/uiValidator';
import { components, categories } from '@/registry/components';
import type { TocItem } from '@/components/docs/toc';

/* -------------------------------------------------------------------------- */
/*  Prose primitives                                                          */
/* -------------------------------------------------------------------------- */

function Lead({ children }: { children: ReactNode }) {
  return <p className="mt-3 text-lg leading-8 text-fg-muted">{children}</p>;
}

function H2({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-14 scroll-mt-24 text-2xl font-bold tracking-tight text-fg">
      {children}
    </h2>
  );
}

function H3({ id, children }: { id?: string; children: ReactNode }) {
  return (
    <h3 id={id} className="mt-8 scroll-mt-24 text-lg font-semibold text-fg">
      {children}
    </h3>
  );
}

function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-sm leading-7 text-fg-muted">{children}</p>;
}

function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-7 text-fg-muted marker:text-fg-subtle">
      {children}
    </ul>
  );
}

/** Section wrapper with a consistent vertical rhythm. */
function Doc({ children }: { children: ReactNode }) {
  return <div className="max-w-3xl">{children}</div>;
}

/* -------------------------------------------------------------------------- */
/*  Shared data                                                               */
/* -------------------------------------------------------------------------- */

const componentCount = components.length;
const categoryCount = categories.length;

const TOKENS = [
  ['bg', 'Page background'],
  ['surface', 'Cards, inputs, and panels'],
  ['surface-raised', 'Popovers and dialogs'],
  ['surface-sunken', 'Code blocks and wells'],
  ['fg', 'Primary text'],
  ['fg-muted', 'Secondary text'],
  ['fg-subtle', 'Tertiary text and icons'],
  ['fg-on-brand', 'Text on a brand-colored fill'],
  ['border', 'Default hairlines'],
  ['border-strong', 'Inputs and focusable outlines'],
  ['ring', 'Focus rings'],
  ['overlay', 'Modal backdrop'],
  ['brand-50…950', 'Accent scale'],
  ['success / warning / danger / info', 'Status hues plus `-subtle` and `-fg` pairs'],
] as const;

/* -------------------------------------------------------------------------- */
/*  Introduction                                                              */
/* -------------------------------------------------------------------------- */

function Introduction() {
  return (
    <Doc>
      <Badge tone="brand">v0.2 · preview</Badge>
      <h1 className="mt-4 text-4xl font-bold tracking-tight text-fg">Introduction</h1>
      <Lead>
        FlinchUI is a component library that ships as source, not as a runtime. You copy the
        components you need into your project, and from that moment they are ordinary files in your
        repository — yours to edit, delete, or extend.
      </Lead>

      <H2 id="why">Why another component library?</H2>
      <P>
        Most libraries optimize for the moment you install them. FlinchUI optimizes for the two
        years after. There is no provider, no theme object, no version lock, and no stylesheet you
        cannot read. Every class is a static Tailwind utility resolved at build time.
      </P>

      <Grid columns={2} gap="md" className="mt-6">
        {[
          {
            title: 'Zero runtime styling',
            body: 'No CSS-in-JS, no style recalculation, no hydration cost. Static utilities only.',
          },
          {
            title: 'Copy-paste distribution',
            body: 'The CLI writes files into your repo. Nothing is imported from node_modules.',
          },
          {
            title: 'Runtime theming',
            body: 'Semantic tokens are CSS variables. Swap them by attribute, subtree, or media query.',
          },
          {
            title: 'Infinitely extensible',
            body: 'Variant maps are exported. `asChild` re-targets any component onto your own element.',
          },
        ].map((item) => (
          <Card key={item.title} variant="outline" padding="md">
            <CardTitle className="text-sm">{item.title}</CardTitle>
            <CardDescription className="mt-1.5">{item.body}</CardDescription>
          </Card>
        ))}
      </Grid>

      <H2 id="principles">Design principles</H2>
      <VStack gap="md" className="mt-4">
        <P>
          <strong className="text-fg">Native first.</strong> Dialogs use{' '}
          <Code>&lt;dialog&gt;</Code>, accordions use <Code>&lt;details&gt;</Code>, and switches use{' '}
          <Code>role=&quot;switch&quot;</Code> on a real button. The platform already implements
          focus traps, Escape handling, and disclosure semantics — reimplementing them in JavaScript
          is how bundles grow.
        </P>
        <P>
          <strong className="text-fg">The token layer is the API.</strong> Components reference{' '}
          <Code>bg-surface</Code> and <Code>text-fg-muted</Code>, never{' '}
          <Code>bg-white</Code> or <Code>text-slate-600</Code>. That is what makes a single
          attribute swap re-theme an entire application.
        </P>
        <P>
          <strong className="text-fg">Opt-in complexity.</strong> Base components depend only on
          React and Tailwind. Four positioning components — Popover, Tooltip, Dropdown Menu, and
          Hover Card — ask for Floating UI explicitly, and say so on their documentation page.
        </P>
      </VStack>

      <H2 id="distribution">How distribution works</H2>
      <P>
        A registry describes every component: its files, variants, props, accessibility notes, and
        dependencies. The CLI reads that registry, copies files, installs the dependencies the
        component declares, and records what it added in <Code>components.json</Code> so future
        updates can be diffed.
      </P>
      <Snippet
        language="bash"
        title="Add two components"
        code={`npx flinchui add button badge
# ✓ copied src/components/ui/button.tsx
# ✓ copied src/components/ui/badge.tsx
# ✓ copied src/lib/cn.ts
# ✓ updated components.json`}
      />
      <P>
        The same registry powers the sidebar, the search palette, this documentation, the{' '}
        <Code>/api/registry</Code> endpoint, and <Code>llms.txt</Code>. There is exactly one place to
        edit when a component changes.
      </P>

      <H2 id="included">What is in the box</H2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          [`${componentCount} components`, `Across ${categoryCount} categories, from layout primitives to overlays.`],
          ['Seven themes', 'Light, dark, violet, emerald, amber, rose, and high contrast.'],
          ['A design-token layer', 'One CSS file you can replace wholesale.'],
          ['Documentation you can copy', 'Every example is real, runnable source.'],
          ['A repo-local CLI', 'Deterministic, offline-friendly, and dependency-free.'],
          ['AI surfaces', 'Registry JSON, llms.txt, and a prompt that keeps agents on-rails.'],
        ].map(([title, body]) => (
          <div key={title} className="rounded-lg border border-border p-4">
            <p className="text-sm font-semibold text-fg">{title}</p>
            <p className="mt-1 text-sm text-fg-muted">{body}</p>
          </div>
        ))}
      </div>

      <Callout tone="tip" title="Start with the layout primitives" className="mt-8">
        Box, Flex, Stack, Grid, and Container are the foundation every other component assumes. Read
        those five pages first and the rest of the library will feel obvious.
      </Callout>

      <div className="mt-8 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/docs/installation">Install FlinchUI</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/components/button">Browse components</Link>
        </Button>
      </div>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  Installation                                                              */
/* -------------------------------------------------------------------------- */

function Installation() {
  return (
    <Doc>
      <h1 className="text-4xl font-bold tracking-tight text-fg">Installation</h1>
      <Lead>
        FlinchUI is not a package you install — it is a set of files you copy. The CLI does the
        copying, but everything it does can be done by hand.
      </Lead>

      <H2 id="requirements">Requirements</H2>
      <UL>
        <li>React 18 or 19, with a React Server Components-capable framework if you want the zero-JS story.</li>
        <li>Tailwind CSS v4 (the token layer uses <Code>@theme</Code> and CSS variables).</li>
        <li>TypeScript 5+ recommended, but the source is plain TSX.</li>
        <li>Node 18+ only if you use the CLI.</li>
      </UL>

      <H2 id="scaffold">1. Create the project</H2>
      <Snippet
        language="bash"
        title="Terminal"
        code={`npx create-next-app@latest my-app --typescript --tailwind --app
cd my-app`}
      />

      <H2 id="tokens">2. Add the token layer</H2>
      <P>
        Copy <Code>src/styles/tokens.css</Code> and <Code>src/styles/themes.css</Code> into your
        project, then import them from your global stylesheet. The CLI does this for you when you add
        your first component.
      </P>
      <Snippet
        language="css"
        title="src/app/globals.css"
        code={`@import "@/styles/tokens.css";

/* Your own project styles can live below. */`}
      />
      <Callout tone="warning" title="Tailwind v4 only">
        The token file uses <Code>@theme</Code>, <Code>@custom-variant</Code>, and native CSS
        variables. On Tailwind v3, you would need to translate the tokens into{' '}
        <Code>theme.extend</Code> and a <Code>darkMode</Code> strategy of your choosing.
      </Callout>

      <H2 id="alias">3. Configure the path alias</H2>
      <P>
        The copied components import helpers with <Code>@/lib/...</Code>. Make sure your{' '}
        <Code>tsconfig.json</Code> exposes that alias — the Next.js default already does.
      </P>
      <Snippet
        language="json"
        title="tsconfig.json"
        code={`{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}`}
      />

      <H2 id="first-component">4. Add a component</H2>
      <Snippet
        language="bash"
        title="Terminal"
        code={`npx flinchui add button

# copied  src/lib/cn.ts
# copied  src/components/ui/button.tsx
# copied  src/components/ui/spinner.tsx
# updated components.json`}
      />
      <P>
        The command resolves the dependency graph from the registry. Button needs{' '}
        <Code>cn()</Code> and Spinner, so they arrive too. Existing files are never overwritten
        unless you pass <Code>--overwrite</Code>.
      </P>

      <H2 id="use">5. Use it</H2>
      <Snippet
        title="app/page.tsx"
        code={`import { Button } from '@/components/ui/button';

export default function Page() {
  return (
    <main className="p-8">
      <Button variant="primary">Deploy</Button>
    </main>
  );
}`}
      />

      <H2 id="manual">Installing without the CLI</H2>
      <P>
        Every component page ends with the file list it needs. Copy those files, plus{' '}
        <Code>src/lib/cn.ts</Code>, <Code>src/lib/variants.ts</Code>, and{' '}
        <Code>src/lib/slot.tsx</Code>. If the page lists an opt-in dependency, install it:
      </P>
      <Snippet
        language="bash"
        title="Terminal"
        code={`npm install @floating-ui/react@^0.27.0   # popover, tooltip, dropdown-menu, hover-card`}
      />

      <H2 id="components-json">components.json</H2>
      <P>
        The CLI records provenance in <Code>components.json</Code> at the project root so it can
        detect local edits and suggest diffs on later runs. Commit it.
      </P>
      <Snippet
        language="json"
        title="components.json"
        code={`{
  "registry": "https://flinchui.dev/api/registry",
  "aliases": {
    "components": "@/components/ui",
    "lib": "@/lib"
  },
  "installed": {
    "button": { "version": "0.2.0", "files": ["button.tsx", "spinner.tsx"] }
  }
}`}
      />

      <H2 id="verify">Verify the install</H2>
      <UL>
        <li>Run <Code>npm run dev</Code> and confirm the component renders with your theme.</li>
        <li>Toggle dark mode and check that no hard-coded colors bleed through.</li>
        <li>Tab through the component — every interactive control should show a visible focus ring.</li>
        <li>Run <Code>npm run typecheck</Code>; the copied files should compile as-is.</li>
      </UL>

      <Callout tone="tip" title="Updating later" className="mt-6">
        FlinchUI will not overwrite your edits. To pull a newer version of a component, run{' '}
        <Code>npx flinchui add button --overwrite</Code> and review the diff like any other change.
      </Callout>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  Theming                                                                   */
/* -------------------------------------------------------------------------- */

function Theming() {
  return (
    <Doc>
      <h1 className="text-4xl font-bold tracking-tight text-fg">Theming</h1>
      <Lead>
        A theme is a block of CSS variables. Components never know which theme is active — they only
        know semantic names like <Code>surface</Code> and <Code>fg-muted</Code>.
      </Lead>

      <H2 id="tokens">The token vocabulary</H2>
      <P>
        Tokens live in <Code>src/styles/tokens.css</Code> behind Tailwind&apos;s{' '}
        <Code>@theme</Code> directive, which turns each one into both a CSS variable and a set of
        utilities.
      </P>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-sunken text-xs uppercase tracking-wide text-fg-subtle">
            <tr>
              <th className="px-3 py-2 font-medium">Token</th>
              <th className="px-3 py-2 font-medium">Used for</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {TOKENS.map(([token, usage]) => (
              <tr key={token}>
                <td className="px-3 py-2 font-mono text-xs text-fg">{token}</td>
                <td className="px-3 py-2 text-fg-muted">{usage}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="switching">Switching themes</H2>
      <P>
        The site applies a theme by setting <Code>data-theme</Code> on <Code>&lt;html&gt;</Code>. No
        React state is involved, and no component re-renders.
      </P>
      <Snippet
        language="html"
        title="index.html"
        code={`<html data-theme="violet">`}
      />
      <P>
        Because the attribute can be set anywhere in the tree, a subtree can have its own theme. This
        is useful for previews, embedded widgets, and marketing sections:
      </P>
      <Snippet
        code={`export function PreviewPane({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="dark" className="rounded-xl bg-bg p-6 text-fg">
      {children}
    </div>
  );
}`}
      />

      <H2 id="dark">Dark mode</H2>
      <P>
        The <Code>dark:</Code> variant is wired to the attribute, not the operating system, so an
        explicit user choice always wins:
      </P>
      <Snippet
        language="css"
        title="tokens.css"
        code={`@custom-variant dark (&:where([data-theme="dark"], [data-theme="dark"] *));`}
      />
      <P>
        A theme switcher only needs to persist a string and set the attribute. FlinchUI&apos;s site
        does it in an inline script before paint to avoid a flash of the wrong theme.
      </P>

      <H2 id="custom">Create a custom theme</H2>
      <P>
        Copy the light block from <Code>themes.css</Code> into a new selector and change the values
        you care about. You do not need to redefine every token — anything you omit falls back to the
        defaults in <Code>tokens.css</Code>.
      </P>
      <Snippet
        language="css"
        title="themes.css"
        code={`[data-theme="ocean"] {
  --color-bg: oklch(0.98 0.01 220);
  --color-surface: oklch(1 0 0);
  --color-fg: oklch(0.22 0.03 230);
  --color-fg-muted: oklch(0.48 0.03 230);
  --color-border: oklch(0.88 0.02 230);
  --color-brand-500: oklch(0.62 0.13 220);
  --color-brand-600: oklch(0.54 0.13 220);
  --color-brand-700: oklch(0.46 0.12 220);
  --color-ring: oklch(0.54 0.13 220);
}`}
      />
      <Callout tone="warning" title="Override by the same variable name">
        Theme blocks must set <Code>--color-*</Code> variables directly. Introducing an indirection
        such as <Code>--flinch-brand: …</Code> would break subtree theming, because descendants would
        still resolve the outer value.
      </Callout>

      <P>
        Hand-tuning a ramp is tedious, so the <Link href="/tools/theme">Theme Studio</Link> does it
        from a seed: pick a hue, chroma, and surface temperature, audit the contrast, then copy the
        generated block. The same generator is available over HTTP at <Code>/api/theme</Code>, which
        returns the tokens, the CSS, and the audit as JSON.
      </P>

      <H2 id="radius">Radii and density</H2>
      <P>
        Shape tokens are ordinary Tailwind theme values. To make the whole library squarer, override
        the radius scale in your own <Code>@theme</Code> block:
      </P>
      <Snippet
        language="css"
        code={`@theme {
  --radius-sm: 0.125rem;
  --radius-md: 0.25rem;
  --radius-lg: 0.375rem;
  --radius-xl: 0.5rem;
}`}
      />

      <H2 id="rules">Rules of thumb</H2>
      <UL>
        <li>Never use a raw palette class (<Code>bg-slate-100</Code>) inside a component you intend to theme.</li>
        <li>Use <Code>fg-on-brand</Code> for text on a brand fill; light accent colors need dark text.</li>
        <li>Keep status colors semantic — <Code>success</Code>, <Code>warning</Code>, <Code>danger</Code>, <Code>info</Code>.</li>
        <li>Test every theme with the same page; contrast failures usually show up in borders first.</li>
        <li>High-contrast mode intentionally removes subtlety — do not fight it with opacity.</li>
      </UL>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  CLI                                                                       */
/* -------------------------------------------------------------------------- */

function Cli() {
  return (
    <Doc>
      <h1 className="text-4xl font-bold tracking-tight text-fg">CLI</h1>
      <Lead>
        One command copies a component, its helpers, and its opt-in dependencies into your project.
        The CLI is deliberately small: no network, no code generation, no config magic.
      </Lead>

      <H2 id="add">Add components</H2>
      <Snippet
        language="bash"
        title="Terminal"
        code={`npx flinchui add button
npx flinchui add dialog drawer toast
npx flinchui add accordion --overwrite`}
      />
      <P>
        Multiple slugs are resolved together, so shared helpers are written once. Files that already
        exist are skipped unless <Code>--overwrite</Code> is passed. The command prints every file it
        writes.
      </P>

      <H2 id="flags">Flags</H2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-sunken text-xs uppercase tracking-wide text-fg-subtle">
            <tr>
              <th className="px-3 py-2 font-medium">Flag</th>
              <th className="px-3 py-2 font-medium">Effect</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              ['--overwrite', 'Replace files that already exist.'],
              ['--dry-run', 'Print the plan without writing anything.'],
              ['--no-install', 'Copy files but skip npm install for opt-in deps.'],
              ['--cwd <dir>', 'Run against a different project root.'],
              ['--yes', 'Accept prompts (useful in CI).'],
            ].map(([flag, effect]) => (
              <tr key={flag}>
                <td className="px-3 py-2 font-mono text-xs text-fg">{flag}</td>
                <td className="px-3 py-2 text-fg-muted">{effect}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="list">Browse the registry</H2>
      <Snippet
        language="bash"
        title="Terminal"
        code={`npx flinchui list
npx flinchui list --category overlays
npx flinchui info tooltip`}
      />
      <P>
        <Code>info</Code> prints the description, files, dependencies, and variant names for one
        component — handy when you are working in a terminal without the docs open.
      </P>

      <H2 id="init">Initialise a project</H2>
      <Snippet
        language="bash"
        title="Terminal"
        code={`npx flinchui init
# ✓ created components.json
# ✓ copied src/lib/cn.ts
# ✓ copied src/lib/variants.ts
# ✓ copied src/lib/slot.tsx
# ✓ copied src/styles/tokens.css`}
      />
      <P>
        <Code>init</Code> is idempotent. Run it when you want the shared foundation without a
        component, or when you are wiring the CLI into an existing project.
      </P>

      <H2 id="how">How it resolves files</H2>
      <P>
        Each registry entry declares the component&apos;s own files. The CLI reads those files and
        walks their imports, so helpers such as <Code>cn.ts</Code> and{' '}
        <Code>spinner.tsx</Code> arrive automatically and are written once even when several
        components need them. Bare package imports become install candidates.
      </P>
      <Snippet
        language="json"
        title="GET /api/registry/button"
        code={`{
  "name": "Button",
  "slug": "button",
  "files": ["src/components/ui/button.tsx"],
  "dependencies": []
}`}
      />

      <H2 id="offline">Offline and repo-local</H2>
      <P>
        The published CLI ships with the registry embedded. This repository also contains the CLI
        source under <Code>packages/cli</Code>, so you can run it locally while developing the
        library:
      </P>
      <Snippet
        language="bash"
        title="Terminal"
        code={`node packages/cli/bin/flinchui.mjs add badge --cwd .`}
      />

      <Callout tone="note" title="No lock-in">
        Everything the CLI does is file I/O. If you ever remove it, your components keep working —
        they were never imports.
      </Callout>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  Authoring                                                                 */
/* -------------------------------------------------------------------------- */

function Authoring() {
  return (
    <Doc>
      <h1 className="text-4xl font-bold tracking-tight text-fg">Authoring components</h1>
      <Lead>
        A FlinchUI component is a single TSX file that exports a props interface, a variant map, and
        the component itself. Nothing else is required.
      </Lead>

      <H2 id="anatomy">Anatomy of a component</H2>
      <Snippet
        title="src/components/ui/button.tsx"
        code={`import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { variants } from '@/lib/variants';

export const buttonSchema = {
  base: 'inline-flex items-center justify-center rounded-md font-medium',
  variants: {
    variant: {
      primary: 'bg-brand-600 text-fg-on-brand hover:bg-brand-700',
      outline: 'border border-border-strong text-fg hover:bg-surface-sunken',
    },
    size: {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-sm',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md' },
} as const;

export const buttonVariants = variants(buttonSchema);

export type ButtonVariant = keyof typeof buttonSchema.variants.variant;

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: keyof typeof buttonSchema.variants.size;
}

export function Button({ variant, size, className, ...rest }: ButtonProps) {
  return (
    <button
      className={cn(buttonVariants({ variant, size }), className)}
      {...rest}
    />
  );
}`}
      />

      <H2 id="conventions">Conventions</H2>
      <H3 id="class-names">1. Class names are static</H3>
      <P>
        Tailwind scans source text. Never build a class from fragments — map a closed set of props to
        literal strings, as <Code>src/lib/tokens.ts</Code> does. This is also why every prop that
        selects a style is a closed union rather than a free string.
      </P>

      <H3 id="cn">2. Always merge through cn()</H3>
      <P>
        <Code>cn()</Code> joins class strings and drops falsy values. It intentionally does not
        resolve Tailwind conflicts; the last class in source order wins in CSS when the specificity
        is equal. That keeps the helper at ~15 lines and dependency-free.
      </P>

      <H3 id="variants">3. Export the variant map</H3>
      <P>
        Consumers need to build their own controls from the same styling. Exporting{' '}
        <Code>buttonVariants</Code> means they can style an anchor exactly like a button without
        copying your class list.
      </P>

      <H3 id="aschild">4. Support asChild when the element is replaceable</H3>
      <P>
        Interactive components accept <Code>asChild</Code> and delegate rendering to{' '}
        <Code>Slot</Code>. This is how FlinchUI stays router-agnostic:
      </P>
      <Snippet
        code={`<Button asChild>
  <Link href="/settings">Settings</Link>
</Button>`}
      />

      <H3 id="server-client">5. Decide the runtime boundary deliberately</H3>
      <P>
        Leave a file as a Server Component unless it needs state, effects, refs, or event handlers.
        The moment a component renders its own closures — a switch&apos;s <Code>onClick</Code>, a
        tab list&apos;s key handling — it needs <Code>&apos;use client&apos;</Code>. Components that
        simply forward props can stay neutral.
      </P>
      <Callout tone="note" title="Props that are functions cannot cross the boundary">
        A Server Component cannot pass <Code>onClick</Code> to a Client Component. That is why
        interactive examples live in client demo files, and why the docs keep callbacks out of server
        content.
      </Callout>

      <H3 id="a11y">6. Accessibility is part of the API</H3>
      <UL>
        <li>Use the native element when one exists. Add ARIA only to fill a real gap.</li>
        <li>Icon-only controls require an accessible name — <Code>IconButton</Code> takes a mandatory <Code>label</Code>.</li>
        <li>Never remove focus styles; use <Code>focus-visible</Code> so pointer users are not punished.</li>
        <li>Respect <Code>prefers-reduced-motion</Code> for anything that moves.</li>
        <li>Document the keyboard contract in the registry entry so the docs page can render it.</li>
      </UL>

      <H3 id="tokens">7. Style with semantic tokens</H3>
      <P>
        A component that uses <Code>bg-surface</Code> automatically supports all seven themes, plus
        any theme a consumer writes later. A component that uses <Code>bg-white</Code> supports one.
      </P>

      <H2 id="registry">Register the component</H2>
      <P>
        Add an entry to <Code>src/registry/components.ts</Code>. The sidebar, search palette,
        install command, API table, and AI endpoints all read from it.
      </P>
      <Snippet
        title="src/registry/components.ts"
        code={`{
  slug: 'button',
  name: 'Button',
  category: 'actions',
  description: 'The primary interactive control.',
  files: ['src/components/ui/button.tsx'],
  preview: true,
  props: [
    { name: 'variant', type: "'primary' | 'secondary' | …", default: "'primary'", description: 'Visual emphasis.' },
    { name: 'size', type: "'sm' | 'md' | 'lg' | …", default: "'md'", description: 'Control height.' },
  ],
  related: ['icon-button', 'button-group'],
  a11y: ['Renders a native <button> unless asChild is used.'],
}`}
      />

      <H2 id="checklist">Checklist</H2>
      <div className="mt-4 rounded-lg border border-border p-5">
        <ul className="space-y-2 text-sm text-fg-muted">
          {[
            'Props extend the matching HTML attributes interface.',
            'Every style is a literal Tailwind utility.',
            'Variants are a closed union, and the map is exported.',
            'className is merged last, so consumers can override.',
            'The component works in light, dark, and high-contrast themes.',
            'Keyboard and screen-reader behavior is documented.',
            'The registry entry includes files, props, and a11y notes.',
            'An example with copyable source was added to the docs.',
          ].map((item) => (
            <li key={item} className="flex gap-2.5">
              <span aria-hidden="true" className="text-success">✓</span>
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  Extending                                                                 */
/* -------------------------------------------------------------------------- */

function Extending() {
  return (
    <Doc>
      <h1 className="text-4xl font-bold tracking-tight text-fg">Extending &amp; composing</h1>
      <Lead>
        There is no plugin API because there does not need to be one. A copied component is ordinary
        source: import it, wrap it, or change it.
      </Lead>

      <H2 id="compose">Compose with asChild</H2>
      <P>
        Most components accept <Code>asChild</Code>, which merges their classes and props onto your
        element. Use it to integrate a router, an analytics wrapper, or your own design-system link.
      </P>
      <Snippet
        code={`import NextLink from 'next/link';
import { Button } from '@/components/ui/button';

export function UpgradeCta() {
  return (
    <Button asChild size="lg">
      <NextLink href="/pricing">Upgrade</NextLink>
    </Button>
  );
}`}
      />

      <H2 id="wrap">Wrap, don't fork</H2>
      <P>
        When you need new behavior, build a small component around the primitive and pass your props
        through. The underlying file stays updatable.
      </P>
      <Snippet
        code={`import { Button, type ButtonProps } from '@/components/ui/button';
import { ArrowUpRightIcon } from '@/components/ui/icons';

export function ExternalLinkButton({ children, ...props }: ButtonProps) {
  return (
    <Button variant="outline" endIcon={<ArrowUpRightIcon />} {...props}>
      {children}
    </Button>
  );
}`}
      />

      <H2 id="variants">Extend the variant map</H2>
      <P>
        Variant maps are plain objects. Spread one into your own schema to add a size or tone while
        keeping the base styles in sync.
      </P>
      <Snippet
        code={`import { variants } from '@/lib/variants';
import { buttonSchema } from '@/components/ui/button';

export const marketingButton = variants({
  base: buttonSchema.base,
  variants: {
    ...buttonSchema.variants,
    size: {
      ...buttonSchema.variants.size,
      hero: 'h-14 px-8 text-lg gap-3',
    },
  },
  defaultVariants: { variant: 'primary', size: 'hero' },
});

// marketingButton({ size: 'hero' }) → h-14 px-8 text-lg gap-3`}
      />

      <H2 id="classes">Override styling from the outside</H2>
      <P>
        <Code>className</Code> is always merged last. For a one-off layout change, no wrapper is
        needed:
      </P>
      <Snippet
        code={`<Button className="w-full justify-between">Continue</Button>`}
      />
      <Callout tone="note" title="No class-conflict resolution">
        <Code>cn()</Code> concatenates classes; it does not deduplicate Tailwind conflicts. If you
        pass <Code>px-8</Code> to a button that already has <Code>px-4</Code>, the winner is decided
        by CSS order, not by the helper. Use the variant props when the conflict matters, or compose
        your own class string.
      </Callout>

      <H2 id="slots">Build on the layout primitives</H2>
      <P>
        Box, Flex, Stack, Grid, and Container expose the spacing scale as props, so a custom block
        rarely needs raw layout classes:
      </P>
      <Snippet
        code={`import { VStack } from '@/components/ui/stack';
import { Card } from '@/components/ui/card';

export function SettingsSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <VStack gap="md">
      <h2 className="text-lg font-semibold text-fg">{title}</h2>
      <Card variant="outline" padding="md">{children}</Card>
    </VStack>
  );
}`}
      />

      <H2 id="own-components">Add components to your own registry</H2>
      <P>
        Fork <Code>components.json</Code> into a local registry file and point the CLI at it. Your
        team can then share components with the same workflow FlinchUI uses:
      </P>
      <Snippet
        language="json"
        title="components.json"
        code={`{
  "registry": "./registry.json",
  "aliases": { "components": "@/components/ui", "lib": "@/lib" }
}`}
      />
      <P>
        The registry format is documented at <Code>/api/registry</Code>. Any array of entries with
        the same shape works.
      </P>

      <H2 id="limits">When to change the source</H2>
      <UL>
        <li>Change the source for a durable product decision — a new variant used everywhere, a different disabled treatment.</li>
        <li>Compose for a one-off — a marketing CTA, a page-specific layout.</li>
        <li>Never patch the token layer per component; add a token instead so the change is visible to every theme.</li>
        <li>If you change source, note it in <Code>components.json</Code> so a future update is a deliberate diff.</li>
      </UL>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  AI agents                                                                 */
/* -------------------------------------------------------------------------- */

function Ai() {
  return (
    <Doc>
      <h1 className="text-4xl font-bold tracking-tight text-fg">Using AI agents</h1>
      <Lead>
        FlinchUI is designed to be read by machines as well as people. The registry is the source of
        truth, and four surfaces expose it without scraping HTML.
      </Lead>

      <H2 id="surfaces">Machine-readable surfaces</H2>
      <div className="mt-4 grid gap-4">
        {[
          {
            title: '/llms.txt',
            body: 'A compact index: every component, its category, one-line description, and the URL of its entry. Also lists guides, tools, and example apps.',
          },
          {
            title: '/llms-full.txt',
            body: 'The complete source text of the registry and authoring rules, in one file for context-window stuffing.',
          },
          {
            title: '/api/registry',
            body: 'JSON for programmatic use. Add /api/registry/<slug> for a single component with files and dependencies.',
          },
          {
            title: '/api/theme',
            body: 'Generate a theme from a seed and receive tokens, CSS, and a measured contrast audit. /api/themes lists shipped themes, presets, and parameter ranges.',
          },
        ].map((item) => (
          <div key={item.title} className="rounded-lg border border-border p-4">
            <p className="font-mono text-sm font-medium text-fg">{item.title}</p>
            <p className="mt-1 text-sm text-fg-muted">{item.body}</p>
          </div>
        ))}
      </div>

      <H2 id="prompt">Use the bundled prompt</H2>
      <P>
        The repository ships <Code>PROMPT.md</Code>, a short instruction set that tells an agent how
        to add a component correctly. Paste it into the system prompt, or reference it from your
        editor&apos;s rules file.
      </P>
      <Snippet
        language="bash"
        title="Terminal"
        code={`curl -s https://flinchui.dev/llms.txt
curl -s https://flinchui.dev/api/registry/button`}
      />

      <H2 id="workflow">Recommended agent workflow</H2>
      <UL>
        <li>Fetch <Code>/llms.txt</Code> to discover the exact slug — never guess a component name.</li>
        <li>Fetch the single registry entry to learn the files and dependencies.</li>
        <li>Prefer <Code>npx flinchui add &lt;slug&gt;</Code> over generating source by hand.</li>
        <li>If you must generate, follow the authoring conventions: static classes, exported variants, native elements first.</li>
        <li>Run <Code>npm run typecheck</Code> and the build before claiming success.</li>
      </UL>

      <H2 id="rules">Guardrails</H2>
      <Callout tone="warning" title="Do not invent props">
        Props are a closed set. <Code>variant=&quot;fancy&quot;</Code> is not a styling hint; it is a
        type error. The registry lists every accepted value, and the docs page renders the same list.
      </Callout>
      <UL>
        <li>Do not introduce a runtime dependency without checking the component&apos;s <Code>deps</Code>.</li>
        <li>Do not replace semantic tokens with raw palette classes.</li>
        <li>Do not add inline styles, CSS-in-JS, or a parallel stylesheet.</li>
        <li>Do not edit a copied component to add page-specific behavior; compose instead.</li>
      </UL>

      <H2 id="config">Agents and the config renderer</H2>
      <P>
        If your product lets a model emit UI, do not let it emit JSX. Emit the JSON schema described
        in the config renderer guide, validate it on the server, and render only approved primitives.
        The validator is part of the repository and runs in the same RSC boundary as your data.
      </P>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link href="/docs/config-renderer">Config renderer guide</Link>
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/api/registry">Open the registry API</Link>
        </Button>
      </div>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  React Native                                                              */
/* -------------------------------------------------------------------------- */

function ReactNative() {
  return (
    <Doc>
      <h1 className="text-4xl font-bold tracking-tight text-fg">React Native</h1>
      <Lead>
        FlinchUI is web-first. Native is handled as a mapping problem, not a second design system:
        the same tokens, the same semantics, and the same component names, translated to native
        primitives.
      </Lead>

      <H2 id="status">Status in v0.2</H2>
      <Callout tone="note" title="Code parity, not a native package">
        The current release documents native translations for the core primitives — Button, Stack,
        Heading, Text, Card, Badge, Input, Switch, and Alert — in a{' '}
        <strong className="font-semibold">React Native</strong> section on each of those component
        pages. It does not ship a <Code>@flinch/native</Code> package, and native previews are not
        rendered in this browser documentation.
      </Callout>
      <P>
        The reason is scope, not architecture. Every component is already a thin mapping over
        semantic tokens; producing a native twin is mechanical, but it doubles the surface area that
        must be tested on real devices.
      </P>

      <H2 id="mapping">Primitive mapping</H2>
      <div className="mt-4 overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-sunken text-xs uppercase tracking-wide text-fg-subtle">
            <tr>
              <th className="px-3 py-2 font-medium">Web</th>
              <th className="px-3 py-2 font-medium">React Native</th>
              <th className="px-3 py-2 font-medium">Notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {[
              ['div / section', 'View', 'Layout props replace flex utilities.'],
              ['p / span / h1–h6', 'Text', 'All text must be inside a Text ancestor.'],
              ['button', 'Pressable', 'No focus-visible; use pressed and accessibilityState.'],
              ['input / textarea', 'TextInput', 'multiline for textarea.'],
              ['a', 'Linking.openURL + Pressable', 'No href, so a wrapper component is required.'],
              ['dialog', 'Modal', 'Native Modal supplies the top layer.'],
              ['details / summary', 'State + Pressable', 'No native disclosure; use useControllableState.'],
              ['CSS hover', 'Pressable callbacks', 'Hover only exists on pointer devices; do not depend on it.'],
              ['CSS variables', 'Theme context or StyleSheet', 'Tokens become a typed object.'],
            ].map(([web, native, note]) => (
              <tr key={web}>
                <td className="px-3 py-2 font-mono text-xs text-fg">{web}</td>
                <td className="px-3 py-2 font-mono text-xs text-fg">{native}</td>
                <td className="px-3 py-2 text-fg-muted">{note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <H2 id="example">A Button in both worlds</H2>
      <Snippet
        language="tsx"
        title="web — button.tsx"
        code={`export function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  return (
    <button className={buttonVariants({ variant })} {...rest}>
      {children}
    </button>
  );
}`}
      />
      <Snippet
        language="tsx"
        title="native — Button.native.tsx"
        code={`import { Pressable, Text } from 'react-native';
import { useTheme } from '../theme';

export function Button({ variant = 'primary', children, ...rest }: ButtonProps) {
  const theme = useTheme();
  const style = variant === 'primary' ? theme.buttonPrimary : theme.buttonOutline;

  return (
    <Pressable
      accessibilityRole="button"
      style={({ pressed }) => [theme.buttonBase, style, pressed && theme.pressed]}
      {...rest}
    >
      <Text style={theme.buttonLabel}>{children}</Text>
    </Pressable>
  );
}`}
      />

      <H2 id="tokens">Sharing tokens</H2>
      <P>
        Export the token values as a plain object rather than parsing CSS at runtime. The web build
        keeps using CSS variables; native imports the object. One file generates both, so a theme
        change cannot drift between platforms.
      </P>
      <Snippet
        language="ts"
        title="src/lib/theme.ts"
        code={`export const lightTheme = {
  bg: '#ffffff',
  surface: '#f8fafc',
  fg: '#0f172a',
  fgMuted: '#64748b',
  border: '#e2e8f0',
  brand: '#4f46e5',
} as const;

export type Theme = typeof lightTheme;`}
      />

      <H2 id="rules">Parity rules</H2>
      <UL>
        <li>Component names, prop names, and variant values must match the web version exactly.</li>
        <li>Native code may change the mechanism (Pressable vs button) but never the semantics.</li>
        <li>Accessibility props map to <Code>accessibilityRole</Code>, <Code>accessibilityLabel</Code>, and <Code>accessibilityState</Code>.</li>
        <li>Motion must respect <Code>AccessibilityInfo.isReduceMotionEnabled()</Code>.</li>
        <li>Touch targets are at least 44×44 points, even when the visual height is smaller.</li>
      </UL>

      <H2 id="next">What comes next</H2>
      <P>
        Tier A — source parity for the core set — is the current milestone. Tier B renders native
        components on the web through React Native Web so the docs can show live previews. Tier C
        publishes the tokens and primitives as an installable package. The roadmap page tracks all
        three.
      </P>
      <Button variant="outline" asChild>
        <Link href="/docs/roadmap">See the roadmap</Link>
      </Button>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  Config renderer                                                           */
/* -------------------------------------------------------------------------- */

const rawSchemaPayload: unknown = {
  version: '1.0.0',
  meta: { title: 'FlinchUI showcase', locale: 'en-US' },
  root: {
    id: 'page-root',
    type: 'Container',
    display: 'flex',
    direction: 'column',
    gap: 'lg',
    className: 'w-full',
    children: [
      {
        id: 'hero-card',
        type: 'Card',
        variant: 'elevated',
        padding: 'lg',
        radius: 'xl',
        children: [
          {
            id: 'hero-heading',
            type: 'Heading',
            level: 1,
            text: 'Config-driven UI, rendered at the edge.',
          },
          {
            id: 'hero-subheading',
            type: 'Heading',
            level: 3,
            text: 'Everything below was described by JSON, validated by Zod on the server, and code-split on demand.',
            className: 'text-slate-600 dark:text-slate-300',
          },
        ],
      },
      {
        id: 'cta-row',
        type: 'Container',
        display: 'flex',
        direction: 'row',
        gap: 'md',
        align: 'center',
        children: [
          {
            id: 'cta-primary',
            type: 'Button',
            actionId: 'subscribe.start',
            label: 'Start free trial',
            variant: 'primary',
            size: 'lg',
            payload: { plan: 'pro', source: 'hero' },
          },
          {
            id: 'cta-secondary',
            type: 'Button',
            actionId: 'tour.start',
            label: 'Watch the tour',
            variant: 'outline',
          },
          {
            id: 'cta-muted',
            type: 'Button',
            actionId: 'docs.open',
            label: 'Read the docs',
            variant: 'ghost',
            disabled: true,
          },
        ],
      },
      {
        id: 'signup-card',
        type: 'Card',
        variant: 'outlined',
        padding: 'md',
        children: [
          { id: 'signup-heading', type: 'Heading', level: 2, text: 'Create your workspace' },
          {
            id: 'signup-form',
            type: 'Container',
            display: 'grid',
            columns: 2,
            gap: 'md',
            className: 'max-md:grid-cols-1',
            children: [
              {
                id: 'email-field',
                type: 'Input',
                name: 'email',
                label: 'Work email',
                kind: 'email',
                placeholder: 'you@company.com',
                required: true,
                actionId: 'signup.email.change',
                constraints: { maxLength: 320 },
              },
              {
                id: 'company-field',
                type: 'Input',
                name: 'company',
                label: 'Company',
                placeholder: 'Acme Inc.',
                actionId: 'signup.company.change',
              },
              {
                id: 'password-field',
                type: 'Input',
                name: 'password',
                label: 'Password',
                kind: 'password',
                required: true,
                helperText: 'Minimum 8 characters.',
                actionId: 'signup.password.change',
                constraints: { minLength: 8 },
              },
              {
                id: 'seats-field',
                type: 'Input',
                name: 'seats',
                label: 'Team seats',
                kind: 'number',
                defaultValue: '5',
                constraints: { min: 1, max: 999 },
                actionId: 'signup.seats.change',
              },
            ],
          },
        ],
      },
    ],
  },
};

function ConfigRenderer() {
  const schema = validateAndSanitizeUI(rawSchemaPayload);

  return (
    <Doc>
      <h1 className="text-4xl font-bold tracking-tight text-fg">Config renderer</h1>
      <Lead>
        Before FlinchUI was a copy-paste library, it was a JSON renderer. That engine still ships,
        demoted to an opt-in layer for products whose UI is generated at runtime.
      </Lead>

      <H2 id="when">When to use it</H2>
      <P>
        Use the config renderer when the layout itself is data: a CMS page builder, a dashboard
        composed by a feature-flag service, or an agent that assembles screens from a closed set of
        primitives. Do not use it for hand-written product UI — you would be trading TypeScript for a
        schema validator.
      </P>

      <H2 id="pipeline">The pipeline</H2>
      <Snippet
        language="text"
        title="Server → client"
        code={`untrusted JSON
   │
   ├─ validateAndSanitizeUI()   Zod: shape, enums, budgets, patterns
   ├─ sanitize text + classNames
   ├─ stabilize ids
   │
   ▼
PageLayoutSchema (plain data)
   │
   ├─ ConfigRenderer (client, lazy-loaded primitives)
   └─ onAction → your event bus`}
      />

      <H2 id="server">Validate on the server</H2>
      <P>
        The validator returns <Code>null</Code> when a payload is rejected. Treat that as a hard
        failure: log it, and render a fallback instead of passing untrusted data deeper.
      </P>
      <Snippet
        title="app/promo/page.tsx"
        code={`import { validateAndSanitizeUI } from '@/lib/validation/uiValidator';
import { DemoHost } from '@/components/DemoHost';

export default async function PromoPage() {
  const payload = await loadFromCms();
  const schema = validateAndSanitizeUI(payload);

  if (!schema) return <p role="alert">This layout could not be rendered.</p>;

  return <DemoHost schema={schema} />;
}`}
      />
      <Callout tone="warning" title="Never render raw JSON">
        Passing an unvalidated object into the renderer bypasses enum checks, text sanitization,
        nesting budgets, and id stability. The renderer assumes clean input by design.
      </Callout>

      <H2 id="actions">Actions are data, not code</H2>
      <P>
        Nodes declare an <Code>actionId</Code> and an optional JSON payload. The host application
        receives an <Code>ActionEvent</Code> and decides what it means. No schema can execute
        arbitrary code.
      </P>
      <Snippet
        title="DemoHost.tsx"
        code={`const handleAction = useCallback((event: ActionEvent) => {
  // { actionId, event, nodeId, value, payload, timestamp }
  analytics.track(event.actionId, event.payload);
  if (event.actionId === 'subscribe.start') openCheckout();
}, []);

<ConfigRenderer schema={schema} onAction={handleAction} />`}
      />

      <H2 id="demo">Live demo</H2>
      <P>
        The schema below is validated in a Server Component, then handed to the client renderer as
        plain JSON. Interact with the fields and buttons to see actions on the event log.
      </P>
      <div className="mt-4 rounded-xl border border-border p-6">
        {schema ? <DemoHost schema={schema} /> : <p role="alert">Demo schema rejected.</p>}
      </div>

      <H2 id="safety">Safety limits</H2>
      <UL>
        <li>Nesting depth is capped at 32; total nodes at 5,000; children per node at 250.</li>
        <li>Text fields are length-capped and stripped of script tags and control characters.</li>
        <li>Class names are sanitized, so JSON cannot inject arbitrary CSS.</li>
        <li>IDs are validated and deterministically stabilized when missing.</li>
        <li>Every node type and prop is part of a closed set.</li>
      </UL>

      <H2 id="relation">How it relates to the component library</H2>
      <P>
        The renderer&apos;s primitives are thin wrappers over <Code>src/components/ui</Code>. There is
        one visual source of truth: if Button changes, the config renderer changes with it. The
        renderer is therefore a consumer of the design system, never a parallel implementation.
      </P>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  Roadmap                                                                   */
/* -------------------------------------------------------------------------- */

function Roadmap() {
  const shipped = components.filter((component) => component.status !== 'planned');
  const beta = components.filter((component) => component.status === 'beta');

  return (
    <Doc>
      <h1 className="text-4xl font-bold tracking-tight text-fg">Roadmap</h1>
      <Lead>
        FlinchUI grows in waves. Each wave adds components, but the token layer, the registry format,
        and the CLI contract stay stable.
      </Lead>

      <H2 id="now">Where we are</H2>
      <HStack gap="md" wrap="wrap">
        <Badge tone="success">{shipped.length} components documented</Badge>
        <Badge tone="warning">{beta.length} in beta</Badge>
        <Badge tone="info">{categories.length} categories</Badge>
        <Badge tone="neutral">v0.2.0</Badge>
      </HStack>

      <H2 id="waves">Delivery waves</H2>
      <VStack gap="md" className="mt-4">
        {[
          {
            title: 'Wave 1 — foundations',
            status: 'Shipped',
            body: 'Layout, typography, actions, forms, and data display. The token layer, variants helper, Slot, and the docs shell.',
          },
          {
            title: 'Wave 2 — interaction',
            status: 'Shipped',
            body: 'Disclosure, feedback, overlays, and navigation. Native dialog and details replace focus-trap and accordion dependencies.',
          },
          {
            title: 'Wave 3 — depth',
            status: 'In progress',
            body: 'Date picker, command menu, data table, tree view, carousel, resizable panels, and richer data visualization primitives.',
          },
          {
            title: 'Wave 4 — platform',
            status: 'Planned',
            body: 'Native source parity, an installable theme package, and a hosted registry for private component sets.',
          },
        ].map((wave) => (
          <div key={wave.title} className="rounded-lg border border-border p-5">
            <div className="flex flex-wrap items-center gap-2">
              <p className="text-sm font-semibold text-fg">{wave.title}</p>
              <Badge tone={wave.status === 'Shipped' ? 'success' : wave.status === 'In progress' ? 'warning' : 'neutral'}>
                {wave.status}
              </Badge>
            </div>
            <p className="mt-2 text-sm text-fg-muted">{wave.body}</p>
          </div>
        ))}
      </VStack>

      <H2 id="next">Next components</H2>
      <P>
        These are specified but not yet written. Their pages will render once the source lands and
        the component is registered.
      </P>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {[
          ['Command menu', 'A ⌘K palette with filtering groups and recent items.'],
          ['Data table', 'Sorting, selection, and column pinning on top of Table.'],
          ['Date picker', 'A native-input-first calendar with range selection.'],
          ['Tree view', 'Roving tabindex, expand/collapse, and drag affordances.'],
          ['Carousel', 'Scroll-snap first, with keyboard and screen-reader controls.'],
          ['Resizable', 'Keyboard-adjustable split panes built on CSS.'],
        ].map(([title, body]) => (
          <div key={title} className="rounded-lg border border-dashed border-border p-4">
            <p className="text-sm font-semibold text-fg">{title}</p>
            <p className="mt-1 text-sm text-fg-muted">{body}</p>
          </div>
        ))}
      </div>

      <H2 id="principles">What will not change</H2>
      <UL>
        <li>The copy-paste model. Components will never require importing a runtime package.</li>
        <li>Static Tailwind classes. No CSS-in-JS will be introduced for convenience.</li>
        <li>The registry schema. New fields are additive and optional.</li>
        <li>Zero dependencies by default. Positioning libraries stay opt-in and per-component.</li>
      </UL>

      <H2 id="contribute">Contributing</H2>
      <P>
        Read the authoring guide, add the source file, register it, and write one real example. If a
        component needs a dependency, justify it on the registry entry — the default answer is no.
      </P>
      <div className="mt-4 flex flex-wrap gap-3">
        <Button asChild>
          <Link href="/docs/authoring">Authoring guide</Link>
        </Button>
        <Button variant="outline" asChild>
          <Link href="/components/button">Component index</Link>
        </Button>
      </div>
    </Doc>
  );
}

/* -------------------------------------------------------------------------- */
/*  Export                                                                    */
/* -------------------------------------------------------------------------- */

export interface GuideContent {
  Component: ComponentType;
  toc: TocItem[];
}

export const guideContent: Record<string, GuideContent> = {
  introduction: {
    Component: Introduction,
    toc: [
      { id: 'why', title: 'Why another library?' },
      { id: 'principles', title: 'Design principles' },
      { id: 'distribution', title: 'How distribution works' },
      { id: 'included', title: 'What is in the box' },
    ],
  },
  installation: {
    Component: Installation,
    toc: [
      { id: 'requirements', title: 'Requirements' },
      { id: 'scaffold', title: 'Create the project' },
      { id: 'tokens', title: 'Add the token layer' },
      { id: 'alias', title: 'Configure the alias' },
      { id: 'first-component', title: 'Add a component' },
      { id: 'manual', title: 'Without the CLI' },
      { id: 'components-json', title: 'components.json' },
      { id: 'verify', title: 'Verify the install' },
    ],
  },
  theming: {
    Component: Theming,
    toc: [
      { id: 'tokens', title: 'Token vocabulary' },
      { id: 'switching', title: 'Switching themes' },
      { id: 'dark', title: 'Dark mode' },
      { id: 'custom', title: 'Create a theme' },
      { id: 'radius', title: 'Radii & density' },
      { id: 'rules', title: 'Rules of thumb' },
    ],
  },
  cli: {
    Component: Cli,
    toc: [
      { id: 'add', title: 'Add components' },
      { id: 'flags', title: 'Flags' },
      { id: 'list', title: 'Browse the registry' },
      { id: 'init', title: 'Initialise a project' },
      { id: 'how', title: 'File resolution' },
      { id: 'offline', title: 'Offline use' },
    ],
  },
  authoring: {
    Component: Authoring,
    toc: [
      { id: 'anatomy', title: 'Anatomy' },
      { id: 'conventions', title: 'Conventions' },
      { id: 'registry', title: 'Register the component' },
      { id: 'checklist', title: 'Checklist' },
    ],
  },
  extending: {
    Component: Extending,
    toc: [
      { id: 'compose', title: 'Compose with asChild' },
      { id: 'wrap', title: "Wrap, don't fork" },
      { id: 'variants', title: 'Extend variants' },
      { id: 'classes', title: 'Override styling' },
      { id: 'slots', title: 'Layout primitives' },
      { id: 'own-components', title: 'Your own registry' },
    ],
  },
  ai: {
    Component: Ai,
    toc: [
      { id: 'surfaces', title: 'Machine surfaces' },
      { id: 'prompt', title: 'Bundled prompt' },
      { id: 'workflow', title: 'Agent workflow' },
      { id: 'rules', title: 'Guardrails' },
      { id: 'config', title: 'Agents & config' },
    ],
  },
  'react-native': {
    Component: ReactNative,
    toc: [
      { id: 'status', title: 'Status in v0.2' },
      { id: 'mapping', title: 'Primitive mapping' },
      { id: 'example', title: 'Button in both worlds' },
      { id: 'tokens', title: 'Sharing tokens' },
      { id: 'rules', title: 'Parity rules' },
      { id: 'next', title: 'What comes next' },
    ],
  },
  'config-renderer': {
    Component: ConfigRenderer,
    toc: [
      { id: 'when', title: 'When to use it' },
      { id: 'pipeline', title: 'The pipeline' },
      { id: 'server', title: 'Validate on the server' },
      { id: 'actions', title: 'Actions are data' },
      { id: 'demo', title: 'Live demo' },
      { id: 'safety', title: 'Safety limits' },
      { id: 'relation', title: 'Relation to UI kit' },
    ],
  },
  roadmap: {
    Component: Roadmap,
    toc: [
      { id: 'now', title: 'Where we are' },
      { id: 'waves', title: 'Delivery waves' },
      { id: 'next', title: 'Next components' },
      { id: 'principles', title: 'What will not change' },
      { id: 'contribute', title: 'Contributing' },
    ],
  },
};
