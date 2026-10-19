/**
 * ConfigRenderer — Async Component Registry Router & Recursive Iterator
 *
 * Client-side delivery layer of the config-driven UI engine. It receives an
 * already-validated `PageLayoutSchema` (parsed and sanitized on the server by
 * `uiValidator` — Zod never enters this bundle) and walks the tree recursively,
 * resolving each node type to a lazily-imported component chunk.
 *
 * Performance design:
 *  - A module-level chunk cache guarantees each `next/dynamic` wrapper is
 *    created exactly once per node type, keeping component identity stable
 *    across renders (no remounts).
 *  - Chunks are resolved per-node inside `useMemo`, so a component's code is
 *    only downloaded when the active schema actually references it.
 *  - Every subtree is wrapped in a `SafeComponentBoundary`, isolating broken
 *    branches without taking down the surrounding interface.
 */

'use client';

import dynamic from 'next/dynamic';
import { memo, useMemo } from 'react';
import type { ComponentType } from 'react';
import type { ActionHandler, NodeType, PageLayoutSchema, UINode } from '../../types/configUI';
import { SafeComponentBoundary } from './SafeComponentBoundary';

/**
 * The registry delivers components across the client boundary, so props are
 * validated at the schema layer (`uiValidator`) rather than at the component
 * boundary. Primitives still declare their own strict props internally.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PrimitiveComponent = ComponentType<any>;

/** Chunk factories — one async import per primitive. Extensible by design. */
const CHUNK_FACTORIES: Record<NodeType, () => Promise<{ default: PrimitiveComponent }>> = {
  Container: () => import('./primitives/Container'),
  Card: () => import('./primitives/Card'),
  Heading: () => import('./primitives/Heading'),
  Button: () => import('./primitives/Button'),
  Input: () => import('./primitives/Input'),
};

const ChunkSkeleton = memo(function ChunkSkeleton() {
  return (
    <div
      aria-hidden="true"
      data-testid="config-ui-chunk-skeleton"
      className="min-h-4 w-full animate-pulse rounded-md bg-slate-200 dark:bg-slate-700"
    />
  );
});

/**
 * Module-level cache: the dynamic() wrapper for each node type is constructed
 * once per browser session, preserving component identity between renders.
 */
const chunkCache = new Map<NodeType, PrimitiveComponent>();

function resolveChunk(type: NodeType): PrimitiveComponent {
  const cached = chunkCache.get(type);
  if (cached) {
    return cached;
  }
  const component = dynamic(CHUNK_FACTORIES[type], {
    loading: () => <ChunkSkeleton />,
    ssr: true,
  }) as PrimitiveComponent;
  chunkCache.set(type, component);
  return component;
}

/**
 * Asset routing: host-supplied overrides win over the built-in registry, and
 * chunks are only fetched when a node of that type is actually encountered.
 */
function resolveComponent(
  type: NodeType,
  overrides?: Partial<Record<NodeType, PrimitiveComponent>>,
): PrimitiveComponent {
  const override = overrides?.[type];
  if (override) {
    return override;
  }
  return resolveChunk(type);
}

export const DEFAULT_MAX_RENDER_DEPTH = 64;

export interface ConfigRendererProps {
  /** A schema previously validated by `validateAndSanitizeUI`. */
  schema: PageLayoutSchema;
  /** Centralized action pipeline — the only path to host business logic. */
  onAction?: ActionHandler;
  /** Per-node-type component overrides for white-labeling or A/B testing. */
  components?: Partial<Record<NodeType, PrimitiveComponent>>;
  /** Guard against pathological nesting (validated schemas cap at depth 32). */
  maxDepth?: number;
  /** Observes any node-level render failure caught by the boundaries. */
  onNodeError?: (error: Error, context: { nodeId: string; nodeType: NodeType }) => void;
}

interface RenderNodeProps {
  node: UINode;
  overrides?: Partial<Record<NodeType, PrimitiveComponent>>;
  onAction?: ActionHandler;
  onNodeError?: ConfigRendererProps['onNodeError'];
  depth: number;
  maxDepth: number;
}

const DepthExceededNotice = memo(function DepthExceededNotice({ maxDepth }: { maxDepth: number }) {
  return (
    <div
      role="alert"
      data-testid="config-ui-depth-exceeded"
      className="rounded-md border border-dashed border-red-300 bg-red-50 p-3 text-sm font-medium text-red-700 dark:border-red-700 dark:bg-red-950/40 dark:text-red-300"
    >
      Schema nesting exceeded the maximum render depth of {maxDepth}.
    </div>
  );
});

const UnknownNodeNotice = memo(function UnknownNodeNotice({
  nodeId,
  nodeType,
}: {
  nodeId: string;
  nodeType: string;
}) {
  return (
    <div
      role="alert"
      data-testid="config-ui-unknown-node"
      data-node-id={nodeId}
      className="rounded-md border border-dashed border-amber-300 bg-amber-50 p-3 text-sm font-medium text-amber-800 dark:border-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
    >
      Unknown schema node type &quot;{nodeType}&quot; (id: {nodeId}). This node was skipped.
    </div>
  );
});

const RenderNode = memo(function RenderNode({
  node,
  overrides,
  onAction,
  onNodeError,
  depth,
  maxDepth,
}: RenderNodeProps) {
  // Asset routing is memoized per node type — a chunk is imported at most once
  // per node type per session, and never at all for absent node types.
  const Component = useMemo(
    () => resolveComponent(node.type, overrides),
    [overrides, node.type],
  );

  if (depth > maxDepth) {
    return <DepthExceededNotice maxDepth={maxDepth} />;
  }

  if (!Component) {
    const { id, type } = node as unknown as { id: string; type: string };
    return <UnknownNodeNotice nodeId={id} nodeType={type} />;
  }

  const { children, ...rest } = node as UINode & { children?: UINode[] };
  const childNodes = children ?? [];

  return (
    <SafeComponentBoundary
      nodeId={node.id}
      nodeType={node.type}
      onError={onNodeError ? (error, context) => onNodeError(error, { nodeId: node.id, nodeType: node.type }) : undefined}
    >
      <Component {...rest} onAction={onAction}>
        {childNodes.map((child) => (
          <RenderNode
            key={child.id}
            node={child}
            overrides={overrides}
            onAction={onAction}
            onNodeError={onNodeError}
            depth={depth + 1}
            maxDepth={maxDepth}
          />
        ))}
      </Component>
    </SafeComponentBoundary>
  );
});

export const ConfigRenderer = memo(function ConfigRenderer({
  schema,
  onAction,
  components,
  maxDepth = DEFAULT_MAX_RENDER_DEPTH,
  onNodeError,
}: ConfigRendererProps) {
  const overrides = useMemo(() => components, [components]);
  const { root } = schema;

  return (
    <RenderNode
      node={root}
      overrides={overrides}
      onAction={onAction}
      onNodeError={onNodeError}
      depth={0}
      maxDepth={maxDepth}
    />
  );
});

export default ConfigRenderer;
