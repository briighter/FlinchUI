'use client';

import { useState } from 'react';
import { cn } from '@/lib/cn';
import { Button } from '@/components/ui/button';
import { Dialog, DialogBody, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Drawer } from '@/components/ui/drawer';
import { Pagination } from '@/components/ui/pagination';
import { Switch } from '@/components/ui/switch';
import { Toggle } from '@/components/ui/toggle';
import { useToast } from '@/components/ui/toast';
import { HStack, Stack } from '@/components/ui/stack';
import {
  HeartIcon,
  BellIcon,
  SettingsIcon,
  TrashIcon,
  ChevronDownIcon,
  PencilIcon,
  CopyIcon,
} from '@/components/ui/icons';
import { Input } from '@/components/ui/input';
import { FormField } from '@/components/ui/form-field';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Chip } from '@/components/ui/chip';
import { Avatar } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { CommandMenu } from '@/components/ui/command-menu';
import { DataTable, type DataTableColumn } from '@/components/ui/data-table';
import { DatePicker, type DateRange } from '@/components/ui/date-picker';
import { TreeView, type TreeNodeData, type DropPosition } from '@/components/ui/tree-view';
import { Carousel } from '@/components/ui/carousel';
import { Resizable } from '@/components/ui/resizable';
import { SearchIcon, TerminalIcon } from '@/components/ui/icons';

/**
 * Interactive previews used by the documentation.
 *
 * These live in a single `'use client'` module so the docs pages themselves can
 * remain server components (and therefore highlight code at build time).
 */

export function ToggleDemo() {
  return (
    <HStack gap="sm">
      <ToggleDemoItem label="Bold" />
      <ToggleDemoItem label="Italic" />
      <ToggleDemoItem label="Underline" />
    </HStack>
  );
}

function ToggleDemoItem({ label }: { label: string }) {
  const [pressed, setPressed] = useState(false);
  return (
    <Toggle pressed={pressed} onPressedChange={setPressed} size="sm">
      {label}
    </Toggle>
  );
}

export function SwitchDemo() {
  const [checked, setChecked] = useState(true);
  return (
    <div className="flex items-center gap-3">
      <Switch checked={checked} onCheckedChange={setChecked} label="Enable notifications" />
      <span className="text-sm text-fg-muted">{checked ? 'Notifications on' : 'Notifications off'}</span>
    </div>
  );
}

export function SwitchSizesDemo() {
  const [small, setSmall] = useState(true);
  const [medium, setMedium] = useState(true);
  return (
    <HStack gap="lg">
      <Switch size="sm" checked={small} onCheckedChange={setSmall} label="Small switch" />
      <Switch size="md" checked={medium} onCheckedChange={setMedium} label="Medium switch" />
    </HStack>
  );
}

export function DialogDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open dialog</Button>
      <Dialog open={open} onOpenChange={setOpen} ariaLabel="Delete project">
        <DialogHeader>
          <DialogTitle>Delete project?</DialogTitle>
          <DialogDescription>
            This permanently removes the project and every deployment associated with it.
          </DialogDescription>
        </DialogHeader>
        <DialogBody>
          <FormField label="Type the project name to confirm" htmlFor="confirm-name">
            <Input id="confirm-name" placeholder="acme-website" />
          </FormField>
        </DialogBody>
        <DialogFooter>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => setOpen(false)}>
            <TrashIcon /> Delete project
          </Button>
        </DialogFooter>
      </Dialog>
    </>
  );
}

export function DrawerDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <SettingsIcon /> Open drawer
      </Button>
      <Drawer open={open} onOpenChange={setOpen} side="right" ariaLabel="Filters">
        <Stack gap="md">
          <p className="text-sm text-fg-muted">Narrow the results without leaving the page.</p>
          <FormField label="Search" htmlFor="drawer-search">
            <Input id="drawer-search" placeholder="Search…" />
          </FormField>
          <Button onClick={() => setOpen(false)}>Apply filters</Button>
        </Stack>
      </Drawer>
    </>
  );
}

export function ToastDemo() {
  const { toast } = useToast();

  return (
    <HStack gap="sm" wrap="wrap">
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({ title: 'Saved', description: 'Your changes are live.', tone: 'success' })
        }
      >
        Success toast
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({ title: 'Heads up', description: 'You are approaching your plan limit.', tone: 'warning' })
        }
      >
        Warning toast
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() =>
          toast({ title: 'Upload failed', description: 'The file exceeded 10 MB.', tone: 'danger' })
        }
      >
        Error toast
      </Button>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => toast({ title: 'Copied to clipboard', tone: 'neutral' })}
      >
        Neutral toast
      </Button>
    </HStack>
  );
}

export function PaginationDemo() {
  const [page, setPage] = useState(4);
  return (
    <div className="flex flex-col items-center gap-3">
      <Pagination page={page} pageCount={12} onPageChange={setPage} />
      <p className="text-xs text-fg-subtle">
        Page {page} of 12
      </p>
    </div>
  );
}

export function TagInputDemo() {
  const [tags, setTags] = useState(['design', 'engineering', 'product']);
  return (
    <Stack gap="sm">
      <HStack gap="xs" wrap="wrap">
        {tags.map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-2.5 py-0.5 text-sm text-fg"
          >
            {tag}
            <button
              type="button"
              aria-label={`Remove ${tag}`}
              onClick={() => setTags((current) => current.filter((entry) => entry !== tag))}
              className="text-fg-subtle hover:text-fg"
            >
              ×
            </button>
          </span>
        ))}
      </HStack>
      <Button
        size="sm"
        variant="outline"
        onClick={() => setTags((current) => [...current, `tag-${current.length + 1}`])}
      >
        Add tag
      </Button>
    </Stack>
  );
}

export function NotificationButtonDemo() {
  const { toast } = useToast();
  return (
    <Button
      variant="outline"
      onClick={() => toast({ title: 'New comment', description: 'Ada replied to your thread.', tone: 'info' })}
    >
      <BellIcon /> Notify me
    </Button>
  );
}

export function FavoriteToggleDemo() {
  const [saved, setSaved] = useState(false);
  return (
    <Button variant={saved ? 'soft' : 'outline'} onClick={() => setSaved((value) => !value)}>
      <HeartIcon className={saved ? 'fill-current' : undefined} />
      {saved ? 'Saved' : 'Save'}
    </Button>
  );
}

export function LabelAssociationDemo() {
  return (
    <FormField label="Work email" htmlFor="work-email" hint="We'll never share it." required>
      <Input id="work-email" type="email" placeholder="you@company.com" />
    </FormField>
  );
}

export function ControlledTabsNote() {
  const [value, setValue] = useState('account');
  return (
    <div className="flex items-center gap-3 text-sm text-fg-muted">
      <span>Active tab:</span>
      <code className="rounded-sm border border-border bg-surface-sunken px-1.5 py-0.5 font-mono text-xs text-fg">
        {value}
      </code>
      <Button size="sm" variant="outline" onClick={() => setValue(value === 'account' ? 'billing' : 'account')}>
        Switch
      </Button>
    </div>
  );
}

export function ToastDurationDemo() {
  const { toast } = useToast();

  return (
    <HStack gap="sm" wrap="wrap">
      <Button
        variant="outline"
        size="sm"
        onClick={() => toast({ title: 'Upload started', tone: 'info' })}
      >
        Default duration
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast({ title: 'Still processing…', description: 'This one stays for 8 seconds.', duration: 8000 })
        }
      >
        8 seconds
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() =>
          toast({
            title: 'Needs attention',
            description: 'Persistent until dismissed.',
            tone: 'warning',
            duration: 0,
          })
        }
      >
        Persistent
      </Button>
    </HStack>
  );
}

export { LabelAssociationDemo as FormFieldDemo };

export function AlertDismissDemo() {
  const [visible, setVisible] = useState(true);
  return (
    <div className="w-full">
      {visible ? (
        <Alert
          tone="info"
          title="New version available"
          onDismiss={() => setVisible(false)}
          action={
            <Button size="sm" variant="outline">
              Update
            </Button>
          }
        >
          Reload to get the latest fixes.
        </Alert>
      ) : (
        <Button size="sm" variant="outline" onClick={() => setVisible(true)}>
          Show the alert again
        </Button>
      )}
    </div>
  );
}

export function BadgeRemoveDemo() {
  const [tags, setTags] = useState(['react', 'tailwind', 'typescript']);
  return (
    <HStack gap="sm" wrap="wrap">
      {tags.map((tag) => (
        <Badge key={tag} tone="brand" onRemove={() => setTags((current) => current.filter((entry) => entry !== tag))}>
          {tag}
        </Badge>
      ))}
      {tags.length === 0 ? <span className="text-sm text-fg-subtle">All tags removed.</span> : null}
    </HStack>
  );
}

export function ChipRemoveDemo() {
  const [people, setPeople] = useState(['Ada Lovelace', 'Grace Hopper', 'Alan Turing']);
  return (
    <HStack gap="sm" wrap="wrap">
      {people.map((person) => (
        <Chip
          key={person}
          avatar={<Avatar name={person} size="xs" />}
          onRemove={() => setPeople((current) => current.filter((entry) => entry !== person))}
        >
          {person}
        </Chip>
      ))}
      {people.length === 0 ? <span className="text-sm text-fg-subtle">Nobody left.</span> : null}
    </HStack>
  );
}

export function DropdownMenuDemo() {
  const { toast } = useToast();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Button variant="outline" endIcon={<ChevronDownIcon />}>
          Actions
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Project</DropdownMenuLabel>
        <DropdownMenuItem onSelect={() => toast({ title: 'Opening editor', tone: 'neutral' })}>
          <PencilIcon /> Edit
        </DropdownMenuItem>
        <DropdownMenuItem onSelect={() => toast({ title: 'Link copied', tone: 'success' })}>
          <CopyIcon /> Copy link
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          destructive
          onSelect={() => toast({ title: 'Project deleted', tone: 'danger' })}
        >
          <TrashIcon /> Delete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/* ------------------------ wave 3: rich interaction ------------------------- */

export function CommandMenuDemo() {
  const [open, setOpen] = useState(false);
  const [last, setLast] = useState<string | null>(null);

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        <SearchIcon /> Open command menu
      </Button>
      {last ? <p className="text-xs text-fg-muted">Selected: {last}</p> : null}
      <CommandMenu
        open={open}
        onOpenChange={setOpen}
        shortcut="k"
        label="Site commands"
        onSelect={(_value, item) => setLast(item.label)}
        groups={[
          {
            label: 'Actions',
            items: [
              { value: 'new', label: 'New deployment', description: 'Ship the current branch', shortcut: 'N' },
              { value: 'rollback', label: 'Roll back', description: 'Restore the previous release', shortcut: 'R' },
              { value: 'copy', label: 'Copy branch URL', keywords: 'clipboard link', icon: <CopyIcon /> },
            ],
          },
          {
            label: 'Navigate',
            items: [
              { value: 'logs', label: 'Runtime logs', description: 'Last 15 minutes', icon: <TerminalIcon /> },
              { value: 'domains', label: 'Domains', description: 'DNS, redirects, TLS' },
              { value: 'usage', label: 'Usage and limits' },
            ],
          },
        ]}
      />
    </>
  );
}

const DEMO_INVOICES = [
  { id: 'INV-1041', customer: 'Halden & Marsh', amount: 1840, status: 'Paid', issued: '2026-09-02' },
  { id: 'INV-1042', customer: 'Osier Robotics', amount: 6420, status: 'Pending', issued: '2026-09-14' },
  { id: 'INV-1043', customer: 'Bluewick Coffee Co.', amount: 312.5, status: 'Paid', issued: '2026-09-14' },
  { id: 'INV-1044', customer: 'Vantar Logistics', amount: 9750, status: 'Overdue', issued: '2026-08-30' },
  { id: 'INV-1045', customer: 'Meridian Labs', amount: 2320, status: 'Pending', issued: '2026-10-01' },
  { id: 'INV-1046', customer: 'Osier Robotics', amount: 1475, status: 'Pending', issued: '2026-10-08' },
];

const DEMO_COLUMNS: DataTableColumn<(typeof DEMO_INVOICES)[number]>[] = [
  {
    key: 'invoice',
    header: 'Invoice',
    pinned: true,
    cell: (row) => <span className="font-mono text-xs text-fg-muted">{row.id}</span>,
  },
  { key: 'customer', header: 'Customer', cell: (row) => row.customer },
  {
    key: 'amount',
    header: 'Amount',
    align: 'right',
    sortValue: (row) => row.amount,
    cell: (row) => <span className="tabular-nums">${row.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}</span>,
  },
  {
    key: 'status',
    header: 'Status',
    sortValue: (row) => row.status,
    cell: (row) => (
      <Badge
        size="sm"
        tone={row.status === 'Paid' ? 'success' : row.status === 'Overdue' ? 'danger' : 'warning'}
      >
        {row.status}
      </Badge>
    ),
  },
  {
    key: 'issued',
    header: 'Issued',
    align: 'right',
    sortValue: (row) => row.issued,
    cell: (row) => <span className="tabular-nums text-fg-muted">{row.issued}</span>,
  },
];

export function DataTableDemo() {
  const [selected, setSelected] = useState<string[]>(['INV-1042']);

  return (
    <div className="flex w-full max-w-full flex-col gap-3">
      <DataTable
        label="Invoices"
        columns={DEMO_COLUMNS}
        rows={DEMO_INVOICES}
        rowId={(row) => row.id}
        selectable
        selectedIds={selected}
        onSelectionChange={setSelected}
        defaultSort={{ key: 'issued', direction: 'desc' }}
        stickyHeader
        density="compact"
        containerClassName="max-h-64 rounded-lg border border-border"
        emptyMessage="No invoices match this filter."
      />
      <p className="text-xs text-fg-muted">
        {selected.length === 0
          ? 'No rows selected — sort a column, then select some.'
          : `${selected.length} selected: ${selected.join(', ')}`}
      </p>
    </div>
  );
}

export function DatePickerDemo() {
  const [date, setDate] = useState<Date | null>(new Date(2026, 9, 14));

  return (
    <div className="flex flex-col gap-2">
      <DatePicker
        value={date}
        onChange={setDate}
        min={new Date(2026, 0, 1)}
        max={new Date(2026, 11, 31)}
        label="Appointment date"
      />
      <p className="text-sm text-fg-muted">
        {date ? `Requested: ${date.toLocaleDateString('en-US', { dateStyle: 'medium' })}` : 'No date selected.'}
      </p>
    </div>
  );
}

export function DatePickerRangeDemo() {
  const [range, setRange] = useState<DateRange>({
    start: new Date(2026, 9, 5),
    end: new Date(2026, 9, 19),
  });
  const fmt = (date: Date | null) =>
    date ? date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '…';

  return (
    <div className="flex flex-col gap-2">
      <DatePicker mode="range" rangeValue={range} onRangeChange={setRange} label="Reporting window" />
      <p className="text-sm text-fg-muted">
        Window: {fmt(range.start)} – {fmt(range.end)} (
        {range.start && range.end
          ? String(Math.round((range.end.getTime() - range.start.getTime()) / 86_400_000) + 1)
          : '?'}{' '}
        days)
      </p>
    </div>
  );
}

const DEMO_TREE: TreeNodeData[] = [
  {
    id: 'src',
    label: 'src',
    children: [
      {
        id: 'components',
        label: 'components',
        children: [
          { id: 'button', label: 'button.tsx' },
          { id: 'dialog', label: 'dialog.tsx' },
          {
            id: 'charts',
            label: 'charts',
            children: [
              { id: 'line', label: 'line-chart.tsx' },
              { id: 'bar', label: 'bar-chart.tsx' },
            ],
          },
        ],
      },
      { id: 'lib', label: 'lib', children: [{ id: 'cn', label: 'cn.ts' }] },
      { id: 'app', label: 'app/page.tsx' },
    ],
  },
  { id: 'public', label: 'public', children: [{ id: 'favicon', label: 'favicon.svg' }] },
];

function demoFind(nodes: TreeNodeData[], id: string): TreeNodeData | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    const hit = node.children ? demoFind(node.children, id) : null;
    if (hit) return hit;
  }
  return null;
}

function demoRemove(nodes: TreeNodeData[], id: string): TreeNodeData[] {
  return nodes
    .filter((node) => node.id !== id)
    .map((node) =>
      node.children ? { ...node, children: demoRemove(node.children, id) } : node,
    );
}

function demoContains(node: TreeNodeData, id: string): boolean {
  if (node.id === id) return true;
  return (node.children ?? []).some((child) => demoContains(child, id));
}

function demoInsert(
  nodes: TreeNodeData[],
  targetId: string,
  position: DropPosition,
  node: TreeNodeData,
): TreeNodeData[] {
  const output: TreeNodeData[] = [];
  for (const child of nodes) {
    if (child.id === targetId) {
      if (position === 'before') {
        output.push(node, child);
      } else if (position === 'after') {
        output.push(child, node);
      } else {
        output.push({ ...child, children: [...(child.children ?? []), node] });
      }
    } else {
      output.push(
        child.children
          ? { ...child, children: demoInsert(child.children, targetId, position, node) }
          : child,
      );
    }
  }
  return output;
}

export function TreeViewDemo() {
  const [selected, setSelected] = useState<string | null>('components');

  return (
    <div className="flex flex-col gap-2">
      <TreeView
        label="Project files"
        nodes={DEMO_TREE}
        defaultExpandedIds={['src', 'components']}
        selectedId={selected}
        onSelect={setSelected}
      />
      <p className="text-xs text-fg-muted">
        {selected ? `Selected: ${selected}` : 'Nothing selected.'} Arrow keys walk the outline.
      </p>
    </div>
  );
}

export function TreeViewDragDemo() {
  const [tree, setTree] = useState(DEMO_TREE);
  const [expanded, setExpanded] = useState<string[]>(['src', 'components']);
  const [note, setNote] = useState('Drag a row onto another to move it.');

  return (
    <div className="flex flex-col gap-2">
      <TreeView
        label="Rearrangeable outline"
        nodes={tree}
        expandedIds={expanded}
        onExpandedChange={setExpanded}
        defaultSelectedId="cn"
        onMove={(draggedId, targetId, position) => {
          const dragged = demoFind(tree, draggedId);
          if (!dragged || draggedId === targetId) return;
          if (demoContains(dragged, targetId)) {
            setNote('A branch cannot move inside itself.');
            return;
          }
          const withoutDragged = demoRemove(tree, draggedId);
          if (!demoFind(withoutDragged, targetId)) return;
          const next = demoInsert(withoutDragged, targetId, position, dragged);
          setTree(next);
          if (position === 'inside' && !expanded.includes(targetId)) {
            setExpanded([...expanded, targetId]);
          }
          setNote(`Moved ${draggedId} ${position} ${targetId}.`);
        }}
      />
      <p className="text-xs text-fg-muted">{note}</p>
    </div>
  );
}

const DEMO_SLIDES = [
  {
    title: 'Weekly review',
    body: 'Deploys doubled after the cache fix went out on Tuesday.',
    accent: 'bg-brand-500/10 text-brand-700 dark:text-brand-300',
  },
  {
    title: 'Cost guardrail',
    body: 'Preview environments now pause after 48 idle hours.',
    accent: 'bg-success/10 text-success-fg',
  },
  {
    title: 'Incident 9-part series',
    body: 'Rollback took 42 seconds; the write-up ships Friday.',
    accent: 'bg-danger/10 text-danger-fg',
  },
  {
    title: 'Next up',
    body: 'Audit log export, then an SSO beta with two pilot teams.',
    accent: 'bg-info/10 text-info-fg',
  },
];

export function CarouselDemo() {
  return (
    <Carousel
      label="Release notes"
      slidesPerView={2}
      slides={DEMO_SLIDES.map((slide) => (
        <div
          key={slide.title}
          className={cn(
            'mr-1.5 flex h-40 flex-col justify-between rounded-lg border border-border p-4',
            slide.accent,
          )}
        >
          <h3 className="text-sm font-semibold">{slide.title}</h3>
          <p className="text-sm leading-6">{slide.body}</p>
        </div>
      ))}
    />
  );
}

export function ResizableDemo() {
  return (
    <Resizable
      defaultSize={38}
      label="Editor split"
      className="h-56 max-w-xl overflow-hidden rounded-lg border border-border"
    >
      <div className="flex h-full flex-col gap-1 overflow-y-auto bg-surface-sunken p-3 text-xs text-fg-muted">
        {['app/page.tsx', 'components/button.tsx', 'lib/cn.ts', 'styles/themes.css'].map((file) => (
          <span key={file} className="truncate rounded-xs px-1.5 py-1 hover:bg-surface">
            {file}
          </span>
        ))}
      </div>
      <div className="h-full overflow-y-auto p-3 font-mono text-xs leading-6 text-fg-muted">
        {'// Try the divider: drag it, double-click it, or'}
        {'// focus it and press the arrow keys.'}
        <br />
        {'const merge = (a, b) => ({ ...a, ...b });'}
      </div>
    </Resizable>
  );
}
