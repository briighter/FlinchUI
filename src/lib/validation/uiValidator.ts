/**
 * Zod Validation & Sanitization Engine
 *
 * This module is designed to execute exclusively on the server (inside React
 * Server Components or route handlers). It is the trust boundary between
 * untrusted JSON payloads — frequently authored by AI agents or CMS editors —
 * and the rendering tree. Malformed payloads are rejected wholesale; valid
 * payloads are sanitized, id-stabilized, and returned as a fully typed
 * `PageLayoutSchema`.
 *
 * Because every consumer of this module is a server component and every client
 * component imports the schema types with `import type`, Zod never enters the
 * client bundle (Vector A: zero-bundle bleed).
 */

import { z } from 'zod';
import type { JsonValue, PageLayoutSchema, UINode } from '../../types/configUI';

/* ------------------------------- constants ------------------------------- */

const ID_PATTERN = /^[A-Za-z0-9_\-:.]+$/;
const ID_MAX_LENGTH = 128;
const VERSION_PATTERN = /^\d+\.\d+\.\d+(-[A-Za-z0-9.]+)?$/;

/**
 * className tokens may only contain characters that appear in legitimate
 * atomic utility classes (letters, digits, Tailwind separators, arbitrary
 * value brackets/parens). Anything outside this set is stripped.
 */
const CLASS_TOKEN_PATTERN = /^[A-Za-z0-9_:[\]/.,()%#&+-]+$/;
const CLASS_NAME_MAX_LENGTH = 512;
const CLASS_TOKEN_MAX_COUNT = 64;

/** Substrings that indicate script/style injection attempts inside class tokens. */
const FORBIDDEN_CLASS_SUBSTRINGS: readonly string[] = [
  'javascript:',
  'vbscript:',
  'expression(',
  'url(',
  'behavior:',
  '-moz-binding',
  '<',
  '>',
  '"',
  "'",
  '=',
  ';',
  '{',
  '}',
  '\\',
  '`',
];

const TEXT_MAX_LENGTH = 2048;
/** Matches full <script>…</script> blocks (including content) and orphan script tags. */
const SCRIPT_BLOCK_PATTERN =
  /<\s*script[^>]*>[\s\S]*?<\s*\/\s*script\s*>|<\s*\/?\s*script[^>]*>/gi;
const CONTROL_CHARACTER_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;

/** Structural budgets that keep hostile payloads from exhausting the server. */
const MAX_TREE_DEPTH = 32;
const MAX_NODE_COUNT = 5000;
const MAX_CHILDREN_PER_NODE = 250;

/* ------------------------------- sanitizers ------------------------------ */

/**
 * Token-wise className sanitizer: splits on whitespace, keeps only tokens that
 * pass the character allowlist and the injection blocklist, and rejoins.
 * Returns `undefined` when nothing safe remains.
 */
export function sanitizeClassName(value: unknown): string | undefined {
  if (typeof value !== 'string') {
    return undefined;
  }
  const trimmed = value.trim();
  if (trimmed.length === 0 || trimmed.length > CLASS_NAME_MAX_LENGTH) {
    return undefined;
  }
  const tokens = trimmed.split(/\s+/);
  if (tokens.length > CLASS_TOKEN_MAX_COUNT) {
    return undefined;
  }
  const safeTokens = tokens.filter((token) => {
    if (!CLASS_TOKEN_PATTERN.test(token)) {
      return false;
    }
    const lowercased = token.toLowerCase();
    if (FORBIDDEN_CLASS_SUBSTRINGS.some((forbidden) => lowercased.includes(forbidden))) {
      return false;
    }
    // Blocks pseudo event-handler classes such as `onclick`.
    if (/^on[a-z]+$/.test(lowercased)) {
      return false;
    }
    return true;
  });
  const cleaned = safeTokens.join(' ');
  return cleaned.length > 0 ? cleaned : undefined;
}

/** Strips script tags and control characters, then enforces a length cap. */
export function sanitizeText(value: string, maxLength: number = TEXT_MAX_LENGTH): string {
  return value
    .replace(SCRIPT_BLOCK_PATTERN, '')
    .replace(CONTROL_CHARACTER_PATTERN, '')
    .slice(0, maxLength);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/* ---------------------------- id stabilization --------------------------- */

/**
 * Agents frequently omit node ids. Rather than rejecting the whole payload,
 * every missing or malformed id is replaced with a deterministic id derived
 * from the node's path (`n-root-0-2`), so refs remain stable across parses.
 */
interface StabilizationState {
  nodeCount: number;
  warnings: string[];
}

function stabilizeNode(node: unknown, path: string, depth: number, state: StabilizationState): unknown {
  state.nodeCount += 1;

  if (state.nodeCount > MAX_NODE_COUNT) {
    state.warnings.push(`Node budget of ${MAX_NODE_COUNT} exceeded at ${path}.`);
    return null;
  }
  if (depth > MAX_TREE_DEPTH) {
    state.warnings.push(`Tree depth limit of ${MAX_TREE_DEPTH} exceeded at ${path}.`);
    return null;
  }
  if (!isRecord(node)) {
    state.warnings.push(`Expected an object node at ${path}.`);
    return node;
  }

  const originalId = typeof node.id === 'string' ? node.id : undefined;
  const hasValidId =
    originalId !== undefined && ID_PATTERN.test(originalId) && originalId.length <= ID_MAX_LENGTH;
  const stableId = hasValidId ? (originalId as string) : path;

  if (!hasValidId) {
    state.warnings.push(`Node at ${path} received the deterministic id "${stableId}".`);
  }

  const stabilized: Record<string, unknown> = { ...node, id: stableId };

  if (Array.isArray(node.children)) {
    if (node.children.length > MAX_CHILDREN_PER_NODE) {
      state.warnings.push(
        `Node ${stableId} exceeded the maximum of ${MAX_CHILDREN_PER_NODE} children and was truncated.`,
      );
      stabilized.children = node.children.slice(0, MAX_CHILDREN_PER_NODE);
    } else {
      stabilized.children = node.children.map((child, index) =>
        stabilizeNode(child, `${path}-${index}`, depth + 1, state),
      );
    }
  }

  return stabilized;
}

function stabilizeTree(input: unknown): { value: unknown; warnings: string[] } {
  const state: StabilizationState = { nodeCount: 0, warnings: [] };

  if (!isRecord(input)) {
    return { value: input, warnings: ['Expected an object at the page root.'] };
  }

  // Only the `root` subtree is a node tree — the page envelope itself must
  // not be mutated, or its strict schema would reject the injected id.
  const { root, ...envelope } = input;
  const stabilizedRoot = stabilizeNode(root, 'n-root', 1, state);

  return { value: { ...envelope, root: stabilizedRoot }, warnings: state.warnings };
}

/* ------------------------------ zod schemas ------------------------------ */

const spacingTokenSchema = z.enum(['none', 'xs', 'sm', 'md', 'lg', 'xl', '2xl']);

const classNameSchema = z.preprocess(sanitizeClassName, z.string().min(1).max(CLASS_NAME_MAX_LENGTH).optional());

const baseNodeFields = {
  id: z.string().min(1).max(ID_MAX_LENGTH).regex(ID_PATTERN),
  className: classNameSchema,
  testId: z.string().min(1).max(ID_MAX_LENGTH).regex(ID_PATTERN).optional(),
  ariaLabel: z.string().max(256).transform((value) => sanitizeText(value)).optional(),
};

/** Recursive JSON value schema — the only shape permitted inside `payload`. */
const jsonValueSchema: z.ZodType<JsonValue> = z.lazy(() =>
  z.union([
    z.string().max(TEXT_MAX_LENGTH),
    z.number().finite(),
    z.boolean(),
    z.null(),
    z.array(jsonValueSchema).max(64),
    z.record(z.string().max(128), jsonValueSchema),
  ]),
);

const constraintsSchema = z
  .object({
    minLength: z.number().int().min(0).max(10_000).optional(),
    maxLength: z.number().int().min(1).max(10_000).optional(),
    pattern: z.string().min(1).max(512).optional(),
    min: z.number().finite().optional(),
    max: z.number().finite().optional(),
  })
  .strict()
  .superRefine((constraints, ctx) => {
    if (constraints.pattern === undefined) {
      return;
    }
    try {
      // eslint-disable-next-line no-new
      new RegExp(constraints.pattern);
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['pattern'],
        message: 'Pattern is not a compilable regular expression.',
      });
    }
  });

const containerNodeSchema = z
  .object({
    ...baseNodeFields,
    type: z.literal('Container'),
    display: z.enum(['flex', 'grid', 'block']).optional(),
    direction: z.enum(['row', 'row-reverse', 'column', 'column-reverse']).optional(),
    wrap: z.enum(['wrap', 'nowrap', 'wrap-reverse']).optional(),
    gap: spacingTokenSchema.optional(),
    align: z.enum(['start', 'center', 'end', 'stretch']).optional(),
    justify: z.enum(['start', 'center', 'end', 'between', 'around', 'evenly']).optional(),
    columns: z
      .union([
        z.literal(1),
        z.literal(2),
        z.literal(3),
        z.literal(4),
        z.literal(5),
        z.literal(6),
        z.literal(7),
        z.literal(8),
        z.literal(9),
        z.literal(10),
        z.literal(11),
        z.literal(12),
      ])
      .optional(),
    children: z.array(z.lazy(() => uiNodeSchema)).max(MAX_CHILDREN_PER_NODE),
  })
  .strict();

const cardNodeSchema = z
  .object({
    ...baseNodeFields,
    type: z.literal('Card'),
    variant: z.enum(['elevated', 'outlined', 'filled', 'ghost']).optional(),
    padding: spacingTokenSchema.optional(),
    radius: z.enum(['none', 'sm', 'md', 'lg', 'xl', 'full']).optional(),
    children: z.array(z.lazy(() => uiNodeSchema)).max(MAX_CHILDREN_PER_NODE),
  })
  .strict();

const headingNodeSchema = z
  .object({
    ...baseNodeFields,
    type: z.literal('Heading'),
    level: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(5), z.literal(6)]),
    text: z.string().min(1).max(TEXT_MAX_LENGTH).transform((value) => sanitizeText(value)),
    align: z.enum(['left', 'center', 'right']).optional(),
    truncate: z.boolean().optional(),
  })
  .strict();

const buttonNodeSchema = z
  .object({
    ...baseNodeFields,
    type: z.literal('Button'),
    actionId: z.string().min(1).max(ID_MAX_LENGTH).regex(ID_PATTERN),
    label: z.string().min(1).max(256).transform((value) => sanitizeText(value)),
    variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'danger']).optional(),
    size: z.enum(['sm', 'md', 'lg']).optional(),
    disabled: z.boolean().optional(),
    fullWidth: z.boolean().optional(),
    payload: jsonValueSchema.optional(),
  })
  .strict();

const inputNodeSchema = z
  .object({
    ...baseNodeFields,
    type: z.literal('Input'),
    name: z.string().min(1).max(ID_MAX_LENGTH).regex(ID_PATTERN),
    label: z.string().max(256).transform((value) => sanitizeText(value)).optional(),
    placeholder: z.string().max(256).transform((value) => sanitizeText(value)).optional(),
    kind: z.enum(['text', 'email', 'password', 'number', 'search', 'tel', 'url']).optional(),
    required: z.boolean().optional(),
    disabled: z.boolean().optional(),
    readOnly: z.boolean().optional(),
    defaultValue: z.string().max(TEXT_MAX_LENGTH).transform((value) => sanitizeText(value)).optional(),
    helperText: z.string().max(256).transform((value) => sanitizeText(value)).optional(),
    actionId: z.string().min(1).max(ID_MAX_LENGTH).regex(ID_PATTERN).optional(),
    payload: jsonValueSchema.optional(),
    constraints: constraintsSchema.optional(),
  })
  .strict();

const uiNodeSchema: z.ZodType<UINode, z.ZodTypeDef, unknown> = z.discriminatedUnion('type', [
  containerNodeSchema,
  cardNodeSchema,
  headingNodeSchema,
  buttonNodeSchema,
  inputNodeSchema,
]);

/**
 * The canonical page-layout schema. `.strict()` on every object rejects
 * unknown keys, so typos and injected properties never reach the render tree.
 */
export const pageLayoutCoreSchema = z
  .object({
    version: z.string().min(1).max(32).regex(VERSION_PATTERN).default('1.0.0'),
    meta: z
      .object({
        title: z.string().max(256).transform((value) => sanitizeText(value)).optional(),
        locale: z.string().max(32).regex(/^[A-Za-z0-9_-]+$/).optional(),
      })
      .strict()
      .optional(),
    root: uiNodeSchema,
  })
  .strict();

/* ------------------------------- public API ------------------------------ */

export interface SerializedValidationIssue {
  code: string;
  path: string[];
  message: string;
}

export interface UIValidationSuccess {
  success: true;
  data: PageLayoutSchema;
  /** Non-fatal notes (e.g. deterministic ids assigned to anonymous nodes). */
  warnings: string[];
}

export interface UIValidationFailure {
  success: false;
  data: null;
  warnings: string[];
  /** Serializable issue list — safe to log or return over an API. */
  errors: SerializedValidationIssue[];
}

export type UIValidationResult = UIValidationSuccess | UIValidationFailure;

/**
 * Full-fidelity validation: stabilizes ids, sanitizes every string field,
 * and parses with the strict Zod schema. Never throws.
 */
export function validateUI(input: unknown): UIValidationResult {
  const { value: stabilized, warnings } = stabilizeTree(input);
  const parsed = pageLayoutCoreSchema.safeParse(stabilized);

  if (parsed.success) {
    return { success: true, data: parsed.data, warnings };
  }

  return {
    success: false,
    data: null,
    warnings,
    errors: parsed.error.issues.map((issue) => ({
      code: issue.code,
      path: issue.path.map(String),
      message: issue.message,
    })),
  };
}

/**
 * The primary entrypoint for React Server Components. Returns a fully typed,
 * sanitized `PageLayoutSchema`, or `null` when the payload is rejected —
 * callers decide how to render the failure state.
 */
export function validateAndSanitizeUI(input: unknown): PageLayoutSchema | null {
  const result = validateUI(input);
  return result.success ? result.data : null;
}

/** Formats validation issues for server-side logs and developer tooling. */
export function formatValidationIssues(result: UIValidationFailure): string {
  const issueLines = result.errors.map(
    (issue) => `  • ${issue.path.length > 0 ? issue.path.join(' → ') : '(root)'}: ${issue.message}`,
  );
  const warningLines = result.warnings.map((warning) => `  ⚠ ${warning}`);
  return ['Validation failed:', ...issueLines, ...warningLines].join('\n');
}
