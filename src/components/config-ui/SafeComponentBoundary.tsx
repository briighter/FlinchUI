/**
 * SafeComponentBoundary — Visual Fail-Safe for Corrupted Component Branches
 *
 * A local error boundary that wraps every node rendered by `ConfigRenderer`.
 * If a node bypasses validation or throws during render, the exception is
 * contained to that single branch and replaced with a clean fallback widget —
 * the rest of the application keeps running at full fidelity.
 *
 * Failure details (stack traces) are only exposed in development builds.
 */

'use client';

import { Component, memo } from 'react';
import type { ErrorInfo, ReactNode } from 'react';

export interface SafeComponentBoundaryProps {
  children: ReactNode;
  /** Schema node identity, attached to the fallback for diagnostics. */
  nodeId?: string;
  /** Schema node type, attached to the fallback for diagnostics. */
  nodeType?: string;
  /** Host-supplied replacement UI; defaults to `DefaultNodeErrorFallback`. */
  fallback?: ReactNode;
  /** Observes every caught render failure (pair with error telemetry). */
  onError?: (error: Error, context: { nodeId?: string; nodeType?: string; errorInfo: ErrorInfo }) => void;
}

interface SafeComponentBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class SafeComponentBoundary extends Component<SafeComponentBoundaryProps, SafeComponentBoundaryState> {
  public state: SafeComponentBoundaryState = { hasError: false, error: null };

  public static getDerivedStateFromError(error: Error): SafeComponentBoundaryState {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    this.props.onError?.(error, {
      nodeId: this.props.nodeId,
      nodeType: this.props.nodeType,
      errorInfo,
    });
  }

  public render(): ReactNode {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <DefaultNodeErrorFallback
          nodeId={this.props.nodeId}
          nodeType={this.props.nodeType}
          error={this.state.error}
        />
      );
    }
    return this.props.children;
  }
}

export interface DefaultNodeErrorFallbackProps {
  nodeId?: string;
  nodeType?: string;
  error: Error | null;
}

export const DefaultNodeErrorFallback = memo(function DefaultNodeErrorFallback({
  nodeId,
  nodeType,
  error,
}: DefaultNodeErrorFallbackProps) {
  const isDevelopment = process.env.NODE_ENV === 'development';

  return (
    <div
      role="alert"
      data-testid="config-ui-node-error"
      data-node-id={nodeId}
      data-node-type={nodeType}
      className="my-2 flex items-start gap-3 rounded-md border border-dashed border-amber-400 bg-amber-50 p-4 dark:border-amber-600 dark:bg-amber-950/40"
    >
      <svg
        aria-hidden="true"
        className="mt-0.5 h-5 w-5 shrink-0 text-amber-500"
        viewBox="0 0 20 20"
        fill="currentColor"
      >
        <path
          fillRule="evenodd"
          d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 8a1 1 0 100-2 1 1 0 000 2z"
          clipRule="evenodd"
        />
      </svg>
      <div className="min-w-0 flex-1">
        <p className="text-sm font-semibold text-amber-800 dark:text-amber-300">
          This component could not be rendered.
        </p>
        <p className="mt-0.5 text-xs text-amber-700 dark:text-amber-400">
          Node &quot;{nodeId ?? 'unknown'}&quot; ({nodeType ?? 'unknown'}) was isolated — the rest of the interface is
          unaffected.
        </p>
        {isDevelopment && error ? (
          <details className="mt-2 rounded bg-amber-100/60 p-2 text-xs text-amber-900 dark:bg-amber-900/40 dark:text-amber-200">
            <summary className="cursor-pointer font-semibold">Error details (development only)</summary>
            <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap break-all">
              {error.stack ?? error.message}
            </pre>
          </details>
        ) : null}
      </div>
    </div>
  );
});

export default SafeComponentBoundary;
