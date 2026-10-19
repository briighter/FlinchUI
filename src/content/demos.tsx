'use client';

import { useState } from 'react';
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
