'use client';

import { useMemo, useRef, useState, type DragEvent, type KeyboardEvent, type ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { useControllableState } from '@/lib/hooks/use-controllable-state';
import { ChevronRightIcon } from './icons';

export interface TreeNodeData {
  id: string;
  label: ReactNode;
  children?: TreeNodeData[];
  icon?: ReactNode;
  disabled?: boolean;
}

export type DropPosition = 'before' | 'inside' | 'after';

export interface TreeViewProps {
  nodes: TreeNodeData[];
  /** Accessible name for the tree. */
  label?: string;
  expandedIds?: string[];
  defaultExpandedIds?: string[];
  onExpandedChange?: (ids: string[]) => void;
  selectedId?: string | null;
  defaultSelectedId?: string | null;
  onSelect?: (id: string | null) => void;
  /**
   * HTML5 drag and drop. Omit it to leave the tree non-draggable; when given,
   * rows become draggable and the callback fires with the drop intent.
   */
  onMove?: (draggedId: string, targetId: string, position: DropPosition) => void;
  className?: string;
}

interface FlatNode {
  node: TreeNodeData;
  depth: number;
  parentId: string | null;
  hasChildren: boolean;
  index: number;
}

/** Static indent ladder — depth beyond 5 keeps the last step. */
const INDENT = ['pl-2', 'pl-7', 'pl-12', 'pl-17', 'pl-22', 'pl-27'] as const;

/**
 * TreeView — an ARIA tree with a roving tab stop.
 *
 * One row is tabbable; the arrow keys walk the visible outline (Right expands
 * or enters, Left collapses or exits), matching the WAI-ARIA tree pattern.
 * Rows render flat with `aria-level`, so indentation never breaks screen-reader
 * ownership. Drag and drop is opt-in via `onMove` and uses native HTML5
 * drag events — no dnd library.
 */
export function TreeView({
  nodes,
  label = 'Tree',
  expandedIds,
  defaultExpandedIds = [],
  onExpandedChange,
  selectedId,
  defaultSelectedId = null,
  onSelect,
  onMove,
  className,
}: TreeViewProps) {
  const [expanded, setExpanded] = useControllableState<string[]>({
    value: expandedIds,
    defaultValue: defaultExpandedIds,
    onChange: onExpandedChange,
  });
  const [selected, setSelected] = useControllableState<string | null>({
    value: selectedId,
    defaultValue: defaultSelectedId,
    onChange: onSelect,
  });
  const [focusId, setFocusId] = useState<string | null>(null);
  const [drop, setDrop] = useState<{ id: string; position: DropPosition } | null>(null);
  const dragId = useRef<string | null>(null);
  const rowRefs = useRef(new Map<string, HTMLDivElement>());

  const flat = useMemo<FlatNode[]>(() => {
    const visible: FlatNode[] = [];
    const walk = (list: TreeNodeData[], depth: number, parentId: string | null) => {
      list.forEach((node, position) => {
        const hasChildren = Boolean(node.children?.length);
        visible.push({ node, depth, parentId, hasChildren, index: visible.length });
        if (hasChildren && expanded.includes(node.id)) {
          walk(node.children!, depth + 1, node.id);
        }
      });
    };
    walk(nodes, 0, null);
    return visible;
  }, [nodes, expanded]);

  function focusIndex(index: number) {
    const entry = flat[index];
    if (!entry) return;
    setFocusId(entry.node.id);
    rowRefs.current.get(entry.node.id)?.focus();
  }

  function toggle(id: string) {
    setExpanded(expanded.includes(id) ? expanded.filter((entry) => entry !== id) : [...expanded, id]);
  }

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const target = event.target as HTMLElement;
    const id = target.getAttribute('data-id');
    if (!id) return;
    const index = flat.findIndex((entry) => entry.node.id === id);
    const entry = flat[index];
    if (!entry) return;

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        focusIndex(Math.min(index + 1, flat.length - 1));
        break;
      case 'ArrowUp':
        event.preventDefault();
        focusIndex(Math.max(index - 1, 0));
        break;
      case 'ArrowRight':
        event.preventDefault();
        if (entry.hasChildren && !expanded.includes(entry.node.id)) toggle(entry.node.id);
        else focusIndex(Math.min(index + 1, flat.length - 1));
        break;
      case 'ArrowLeft':
        event.preventDefault();
        if (entry.hasChildren && expanded.includes(entry.node.id)) toggle(entry.node.id);
        else if (entry.parentId) focusIndex(flat.findIndex((item) => item.node.id === entry.parentId));
        break;
      case 'Home':
        event.preventDefault();
        focusIndex(0);
        break;
      case 'End':
        event.preventDefault();
        focusIndex(flat.length - 1);
        break;
      case 'Enter':
      case ' ':
        event.preventDefault();
        if (!entry.node.disabled) {
          setSelected(entry.node.id);
          if (entry.hasChildren) toggle(entry.node.id);
        }
        break;
      default:
        break;
    }
  }

  function onDragOver(event: DragEvent<HTMLDivElement>, entry: FlatNode) {
    if (!onMove || !dragId.current || dragId.current === entry.node.id) return;
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
    const bounds = event.currentTarget.getBoundingClientRect();
    const ratio = (event.clientY - bounds.top) / bounds.height;
    const position: DropPosition =
      ratio < 0.3 ? 'before' : ratio > 0.7 ? 'after' : entry.hasChildren ? 'inside' : 'before';
    setDrop({ id: entry.node.id, position });
  }

  function onDrop(event: DragEvent<HTMLDivElement>, entry: FlatNode) {
    if (!onMove || !dragId.current || dragId.current === entry.node.id) return;
    event.preventDefault();
    const position = drop?.id === entry.node.id ? drop.position : 'before';
    onMove(dragId.current, entry.node.id, position);
    dragId.current = null;
    setDrop(null);
  }

  return (
    <div
      role="tree"
      aria-label={label}
      onKeyDown={onKeyDown}
      onDragEnd={() => {
        dragId.current = null;
        setDrop(null);
      }}
      className={cn('flex w-fit max-w-full min-w-56 flex-col rounded-lg border border-border bg-surface py-1.5 text-sm', className)}
    >
      {flat.map((entry) => {
        const node = entry.node;
        const isOpen = entry.hasChildren && expanded.includes(node.id);
        const isSelected = selected === node.id;
        const isFocused = focusId === node.id;
        const isDropTarget = drop?.id === node.id;

        return (
          <div
            key={node.id}
            ref={(element) => {
              if (element) rowRefs.current.set(node.id, element);
              else rowRefs.current.delete(node.id);
            }}
            role="treeitem"
            data-id={node.id}
            aria-level={entry.depth + 1}
            aria-expanded={entry.hasChildren ? isOpen : undefined}
            aria-selected={isSelected}
            aria-disabled={node.disabled || undefined}
            tabIndex={isFocused || (focusId === null && entry.index === 0) ? 0 : -1}
            onFocus={() => setFocusId(node.id)}
            draggable={Boolean(onMove) && !node.disabled}
            onDragStart={(event) => {
              dragId.current = node.id;
              event.dataTransfer.setData('text/plain', node.id);
              event.dataTransfer.effectAllowed = 'move';
            }}
            onDragOver={(event) => onDragOver(event, entry)}
            onDragLeave={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget as Node)) setDrop(null);
            }}
            onDrop={(event) => onDrop(event, entry)}
            onClick={() => {
              if (!node.disabled) {
                setSelected(node.id);
                if (entry.hasChildren) toggle(node.id);
              }
            }}
            className={cn(
              'relative flex cursor-pointer items-center gap-1.5 pr-3 leading-none transition-colors',
              INDENT[Math.min(entry.depth, INDENT.length - 1)],
              isSelected ? 'bg-brand-500/10 font-medium text-fg' : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
              node.disabled && 'cursor-not-allowed text-fg-subtle',
              isFocused && 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset',
              isDropTarget && drop?.position === 'before' && 'before:absolute before:inset-x-2 before:top-0 before:h-0.5 before:bg-brand-600',
              isDropTarget && drop?.position === 'after' && 'after:absolute after:inset-x-2 after:bottom-0 after:h-0.5 after:bg-brand-600',
              isDropTarget && drop?.position === 'inside' && 'bg-brand-500/15 ring-1 ring-inset ring-brand-600',
            )}
          >
            {entry.hasChildren ? (
              <span
                role="presentation"
                onClick={(event) => {
                  event.stopPropagation();
                  toggle(node.id);
                }}
                className="flex size-4 shrink-0 items-center justify-center rounded-xs text-fg-subtle hover:text-fg"
              >
                <ChevronRightIcon className={cn('size-3 transition-transform', isOpen && 'rotate-90')} />
              </span>
            ) : (
              <span aria-hidden="true" className="size-4 shrink-0" />
            )}
            {node.icon ? (
              <span aria-hidden="true" className="flex size-4 shrink-0 items-center justify-center">
                {node.icon}
              </span>
            ) : null}
            <span className="min-w-0 flex-1 truncate py-2">{node.label}</span>
          </div>
        );
      })}
    </div>
  );
}
