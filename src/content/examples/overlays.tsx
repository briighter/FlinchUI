import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip } from '@/components/ui/tooltip';
import { HStack, Stack, VStack } from '@/components/ui/stack';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { FormField } from '@/components/ui/form-field';
import { Input } from '@/components/ui/input';
import { InfoIcon, SettingsIcon, ChevronDownIcon, HeartIcon } from '@/components/ui/icons';
import { Example, ExampleGroup } from '@/components/docs/example';
import { DialogDemo, DrawerDemo, DropdownMenuDemo } from '@/content/demos';

export function OverlaysDocs({ slug }: { slug: string }) {
  if (slug === 'dialog') {
    return (
      <ExampleGroup>
        <Example
          title="Modal dialog"
          description="Built on the native <dialog> element: focus trap, Escape, and the backdrop are handled by the browser."
          code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open dialog</Button>

<Dialog open={open} onOpenChange={setOpen} ariaLabel="Delete project">
  <DialogHeader>
    <DialogTitle>Delete project?</DialogTitle>
    <DialogDescription>This cannot be undone.</DialogDescription>
  </DialogHeader>
  <DialogBody>…</DialogBody>
  <DialogFooter>
    <Button variant="ghost" onClick={() => setOpen(false)}>Cancel</Button>
    <Button variant="danger" onClick={() => setOpen(false)}>Delete</Button>
  </DialogFooter>
</Dialog>`}
        >
          <DialogDemo />
        </Example>

        <Example
          title="Anatomy"
          description="Header, body, and footer are optional parts; DialogClose closes from anywhere inside."
          code={`<Dialog open={open} onOpenChange={setOpen}>
  <DialogHeader closable>
    <DialogTitle>Title</DialogTitle>
    <DialogDescription>Supporting text.</DialogDescription>
  </DialogHeader>
  <DialogBody>Content</DialogBody>
  <DialogFooter>
    <DialogClose asChild><Button variant="ghost">Close</Button></DialogClose>
  </DialogFooter>
</Dialog>`}
        >
          <VStack gap="sm" className="text-sm text-fg-muted">
            <p>Native dialog gives you, for free:</p>
            <ul className="list-disc space-y-1 pl-5 marker:text-fg-subtle">
              <li>Focus trapping and focus return</li>
              <li>Escape to close (<code className="font-mono text-xs">dismissible</code> to opt out)</li>
              <li>An inert background and a top-layer backdrop</li>
              <li>No focus-trap dependency in your bundle</li>
            </ul>
            <p className="text-xs text-fg-subtle">
              Open the example above to see it in action.
            </p>
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'drawer') {
    return (
      <ExampleGroup>
        <Example
          title="Side sheet"
          description="A native dialog anchored to any edge. Ideal for filters, details, and mobile navigation."
          code={`const [open, setOpen] = useState(false);

<Button onClick={() => setOpen(true)}>Open drawer</Button>

<Drawer open={open} onOpenChange={setOpen} side="right" ariaLabel="Filters">
  <Stack gap="md">
    <p>Narrow the results without leaving the page.</p>
    <Button onClick={() => setOpen(false)}>Apply filters</Button>
  </Stack>
</Drawer>`}
        >
          <DrawerDemo />
        </Example>

        <Example
          title="Edges"
          description="Choose left, right, top, or bottom; the shell and accessibility wiring stay the same."
          code={`<Drawer side="left" … />\n<Drawer side="right" … />\n<Drawer side="top" … />\n<Drawer side="bottom" … />`}
        >
          <HStack gap="sm" wrap="wrap">
            {(['left', 'right', 'top', 'bottom'] as const).map((side) => (
              <Badge key={side} tone="outline">
                side=&quot;{side}&quot;
              </Badge>
            ))}
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'popover') {
    return (
      <ExampleGroup>
        <Example
          title="Anchored content"
          description="Floating UI flips and shifts the panel so it never leaves the viewport."
          code={`<Popover placement="bottom-start">
  <PopoverTrigger>
    <Button variant="outline">Open popover</Button>
  </PopoverTrigger>
  <PopoverContent>
    <div className="flex flex-col gap-2">
      <p className="font-medium text-fg">Keyboard shortcuts</p>
      <p className="text-sm text-fg-muted">Search with ⌘K…</p>
    </div>
  </PopoverContent>
</Popover>`}
        >
          <Popover placement="bottom-start">
            <PopoverTrigger>
              <Button variant="outline" endIcon={<ChevronDownIcon />}>
                Open popover
              </Button>
            </PopoverTrigger>
            <PopoverContent>
              <Stack gap="sm">
                <p className="font-medium text-fg">Keyboard shortcuts</p>
                <p className="text-sm text-fg-muted">
                  Search with ⌘K. Press Escape to dismiss this panel.
                </p>
                <Separator />
                <p className="text-xs text-fg-subtle">Focus returns to the trigger on close.</p>
              </Stack>
            </PopoverContent>
          </Popover>
        </Example>

        <Example
          title="Form content"
          description="Popovers are non-modal by default, so the page stays interactive."
          code={`<Popover>
  <PopoverTrigger><Button variant="secondary">Rename</Button></PopoverTrigger>
  <PopoverContent className="w-72">
    <FormField label="Project name" htmlFor="name">
      <Input id="name" defaultValue="acme-website" />
    </FormField>
  </PopoverContent>
</Popover>`}
        >
          <Popover>
            <PopoverTrigger>
              <Button variant="secondary">Rename</Button>
            </PopoverTrigger>
            <PopoverContent className="w-72">
              <Stack gap="md">
                <FormField label="Project name" htmlFor="popover-project-name">
                  <Input id="popover-project-name" defaultValue="acme-website" />
                </FormField>
                <Button size="sm" className="self-end">
                  Save name
                </Button>
              </Stack>
            </PopoverContent>
          </Popover>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'tooltip') {
    return (
      <ExampleGroup>
        <Example
          title="Hover and focus"
          description="Tooltips open on hover and keyboard focus, and close on Escape."
          code={`<Tooltip content="Save changes">\n  <Button>Save</Button>\n</Tooltip>\n\n<Tooltip content="Add to favorites">\n  <IconButton label="Favorite"><HeartIcon /></IconButton>\n</Tooltip>`}
        >
          <HStack gap="md">
            <Tooltip content="Save changes">
              <Button>Save</Button>
            </Tooltip>
            <Tooltip content="Add to favorites">
              <IconButton label="Favorite">
                <HeartIcon />
              </IconButton>
            </Tooltip>
            <Tooltip content="Settings" placement="bottom">
              <IconButton label="Settings" variant="outline">
                <SettingsIcon />
              </IconButton>
            </Tooltip>
          </HStack>
        </Example>

        <Example
          title="Placements"
          description="Pass any Floating UI placement; collision handling adjusts it when needed."
          code={`<Tooltip content="Top" placement="top">…</Tooltip>\n<Tooltip content="Right" placement="right">…</Tooltip>\n<Tooltip content="Bottom" placement="bottom">…</Tooltip>\n<Tooltip content="Left" placement="left">…</Tooltip>`}
        >
          <HStack gap="md">
            {(['top', 'right', 'bottom', 'left'] as const).map((placement) => (
              <Tooltip key={placement} content={`Placed ${placement}`} placement={placement}>
                <Button variant="outline" size="sm">
                  {placement}
                </Button>
              </Tooltip>
            ))}
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'dropdown-menu') {
    return (
      <ExampleGroup>
        <Example
          title="Menu"
          description="Arrow keys, Home/End, type-to-select, and focus return are all handled."
          code={`<DropdownMenu>
  <DropdownMenuTrigger>
    <Button variant="outline" endIcon={<ChevronDownIcon />}>Actions</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuLabel>Project</DropdownMenuLabel>
    <DropdownMenuItem onSelect={edit}>Edit</DropdownMenuItem>
    <DropdownMenuItem onSelect={copyLink}>Copy link</DropdownMenuItem>
    <DropdownMenuSeparator />
    <DropdownMenuItem destructive onSelect={remove}>Delete</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
        >
          <DropdownMenuDemo />
        </Example>

        <Example
          title="In a toolbar"
          description="Icon-only triggers work because the trigger is your own element."
          code={`<DropdownMenu placement="bottom-end">
  <DropdownMenuTrigger>
    <IconButton label="More actions" variant="outline"><ChevronDownIcon /></IconButton>
  </DropdownMenuTrigger>
  <DropdownMenuContent>…</DropdownMenuContent>
</DropdownMenu>`}
        >
          <HStack gap="sm">
            <Button variant="outline" size="sm" startIcon={<InfoIcon />}>
              Details
            </Button>
            <DropdownMenuDemo />
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  return null;
}
