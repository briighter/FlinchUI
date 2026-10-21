import { Box } from '@/components/ui/box';
import { Flex } from '@/components/ui/flex';
import { HStack, Stack, VStack } from '@/components/ui/stack';
import { Container } from '@/components/ui/container';
import { Grid, SimpleGrid } from '@/components/ui/grid';
import { Separator } from '@/components/ui/separator';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { VisuallyHidden } from '@/components/ui/visually-hidden';
import { AppShell } from '@/components/ui/app-shell';
import { Resizable } from '@/components/ui/resizable';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Example, ExampleGroup } from '@/components/docs/example';
import { ResizableDemo } from '@/content/demos';

const Box3 = ({ label }: { label: string }) => (
  <div className="flex h-14 min-w-24 flex-1 items-center justify-center rounded-lg border border-brand-200/70 bg-brand-50 px-4 text-sm font-medium text-brand-700 dark:border-brand-800 dark:bg-brand-900/40 dark:text-brand-200">
    {label}
  </div>
);

export function LayoutDocs({ slug }: { slug: string }) {
  if (slug === 'box') {
    return (
      <ExampleGroup>
        <Example
          title="Polymorphic element"
          description="Use `as` to change the rendered element without losing the component contract."
          code={`<Box as="section" className="rounded-lg border border-border p-4">
  A section rendered by Box
</Box>

<Box as="ul" className="list-disc pl-5">
  <li>One</li>
  <li>Two</li>
</Box>`}
        >
          <VStack gap="md">
            <Box as="section" className="rounded-lg border border-border p-4 text-sm text-fg">
              A section rendered by Box
            </Box>
            <Box as="ul" className="list-disc pl-5 text-sm text-fg-muted">
              <li>One</li>
              <li>Two</li>
            </Box>
          </VStack>
        </Example>

        <Example
          title="asChild"
          description="asChild merges Box's props into its single child instead of adding a wrapper."
          code={`<Box asChild className="text-brand-600">
  <a href="/components/button">I am still an anchor</a>
</Box>`}
        >
          <Box asChild className="text-sm text-brand-600 hover:underline">
            <a href="/components/button">I am still an anchor</a>
          </Box>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'flex') {
    return (
      <ExampleGroup>
        <Example
          title="Direction and gap"
          description="The direction and gap tokens map straight to flex-direction and gap utilities."
          code={`<Flex direction="row" gap="md">
  <Box3 label="One" />
  <Box3 label="Two" />
  <Box3 label="Three" />
</Flex>

<Flex direction="column" gap="md">
  <Box3 label="Stacked A" />
  <Box3 label="Stacked B" />
</Flex>`}
        >
          <VStack gap="lg">
            <Flex direction="row" gap="md">
              <Box3 label="One" />
              <Box3 label="Two" />
              <Box3 label="Three" />
            </Flex>
            <Flex direction="column" gap="md">
              <Box3 label="Stacked A" />
              <Box3 label="Stacked B" />
            </Flex>
          </VStack>
        </Example>

        <Example
          title="Alignment and justification"
          description="Combine align (cross axis) and justify (main axis) for any distribution."
          code={`<Flex justify="between" align="center" className="rounded-lg border border-border p-4">
  <span className="text-sm font-medium text-fg">Team members</span>
  <Badge tone="brand">12</Badge>
</Flex>`}
        >
          <Flex justify="between" align="center" className="rounded-lg border border-border p-4">
            <span className="text-sm font-medium text-fg">Team members</span>
            <Badge tone="brand">12</Badge>
          </Flex>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'stack') {
    return (
      <ExampleGroup>
        <Example
          title="Vertical by default"
          description="Stack is the default layout tool: vertical flow with a consistent gap."
          code={`<Stack gap="md">
  <Box3 label="First" />
  <Box3 label="Second" />
  <Box3 label="Third" />
</Stack>`}
        >
          <Stack gap="md">
            <Box3 label="First" />
            <Box3 label="Second" />
            <Box3 label="Third" />
          </Stack>
        </Example>

        <Example
          title="Horizontal with HStack"
          description="HStack is Stack with `direction=&quot;row&quot;` and centered alignment."
          code={`<HStack gap="sm">
  <Badge>Design</Badge>
  <Badge tone="brand">Engineering</Badge>
  <Badge tone="success">Shipped</Badge>
</HStack>`}
        >
          <HStack gap="sm" wrap="wrap">
            <Badge>Design</Badge>
            <Badge tone="brand">Engineering</Badge>
            <Badge tone="success">Shipped</Badge>
          </HStack>
        </Example>

        <Example
          title="Dividers"
          description="Pass any node as `divider` to interleave separators between children."
          code={`<Stack divider={<span />} gap="none" className="rounded-lg border border-border px-4">
  <div className="py-3 text-sm">Inbox</div>
  <div className="py-3 text-sm">Drafts</div>
  <div className="py-3 text-sm">Sent</div>
</Stack>`}
        >
          <Stack divider={<span />} gap="none" className="rounded-lg border border-border px-4">
            <div className="py-3 text-sm text-fg">Inbox</div>
            <div className="py-3 text-sm text-fg">Drafts</div>
            <div className="py-3 text-sm text-fg">Sent</div>
          </Stack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'grid') {
    return (
      <ExampleGroup>
        <Example
          title="Responsive columns"
          description="Pick a base column count and override it at the md and lg breakpoints."
          code={`<Grid columns={1} mdColumns={2} lgColumns={3} gap="md">
  {items.map((item) => <Box3 key={item} label={item} />)}
</Grid>`}
        >
          <Grid columns={1} mdColumns={2} lgColumns={3} gap="md">
            {['One', 'Two', 'Three', 'Four', 'Five', 'Six'].map((item) => (
              <Box3 key={item} label={item} />
            ))}
          </Grid>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'simple-grid') {
    return (
      <ExampleGroup>
        <Example
          title="Auto-fit columns"
          description="SimpleGrid wraps columns automatically once they drop below minChildWidth."
          code={`<SimpleGrid minChildWidth="12rem" gap="md">
  {items.map((item) => <Box3 key={item} label={item} />)}
</SimpleGrid>`}
        >
          <SimpleGrid minChildWidth="12rem" gap="md">
            {['One', 'Two', 'Three', 'Four', 'Five'].map((item) => (
              <Box3 key={item} label={item} />
            ))}
          </SimpleGrid>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'container') {
    return (
      <ExampleGroup>
        <Example
          title="Centered content"
          description="Container caps the width and adds responsive gutters. The dashed outline shows the bounds."
          code={`<Container maxWidth="md" className="border border-dashed border-border py-6">
  <p className="text-center text-sm text-fg-muted">Centered, max-width content</p>
</Container>`}
        >
          <Container maxWidth="md" className="rounded-lg border border-dashed border-border py-6">
            <p className="text-center text-sm text-fg-muted">Centered, max-width content</p>
          </Container>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'separator') {
    return (
      <ExampleGroup>
        <Example
          title="Horizontal, vertical, and labeled"
          description="Separators are single elements that fit into any flex layout."
          code={`<Separator />
<Separator label="or" />
<HStack gap="md" className="h-10">
  <span>Left</span>
  <Separator orientation="vertical" />
  <span>Right</span>
</HStack>`}
        >
          <VStack gap="md">
            <Separator />
            <Separator label="or" />
            <HStack gap="md" className="h-10 text-sm text-fg">
              <span>Left</span>
              <Separator orientation="vertical" />
              <span>Right</span>
            </HStack>
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'aspect-ratio') {
    return (
      <ExampleGroup>
        <Example
          title="Reserve media space"
          description="Prevents layout shift while images load."
          code={`<AspectRatio ratio={16 / 9} className="rounded-lg bg-brand-100">
  <div className="flex size-full items-center justify-center text-sm text-brand-700">
    16 : 9
  </div>
</AspectRatio>`}
        >
          <Grid columns={2} gap="md">
            <AspectRatio ratio={16 / 9} className="rounded-lg bg-brand-100 dark:bg-brand-900">
              <div className="flex size-full items-center justify-center text-sm text-brand-700 dark:text-brand-200">
                16 : 9
              </div>
            </AspectRatio>
            <AspectRatio ratio={1} className="rounded-lg bg-surface-sunken">
              <div className="flex size-full items-center justify-center text-sm text-fg-muted">1 : 1</div>
            </AspectRatio>
          </Grid>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'visually-hidden') {
    return (
      <ExampleGroup>
        <Example
          title="Screen-reader-only text"
          description="A common pattern: an icon-only control with hidden context."
          code={`<Button>
  <PlusIcon />
  <VisuallyHidden>Add a new project</VisuallyHidden>
</Button>`}
        >
          <Button startIcon={<span aria-hidden="true">+</span>}>
            <VisuallyHidden>Add a new project</VisuallyHidden>
            Add
          </Button>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'app-shell') {
    return (
      <ExampleGroup>
        <Example
          title="Docs-style layout"
          description="Header, left rail, and main column. This very site uses the same structure."
          code={`<AppShell header={<div className="h-12 border-b" />} sidebar={<nav>…</nav>}>
  <p>Main content</p>
</AppShell>`}
          previewClassName="p-0"
        >
          <div className="h-64 overflow-hidden rounded-lg border border-border">
            <AppShell
              header={<div className="flex h-10 items-center border-b border-border bg-surface px-3 text-xs font-medium text-fg">Header</div>}
              sidebar={<div className="rounded-md bg-surface p-2 text-xs text-fg-muted">Sidebar</div>}
            >
              <div className="rounded-md border border-dashed border-border p-4 text-xs text-fg-muted">
                Main content
              </div>
            </AppShell>
          </div>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'resizable') {
    return (
      <ExampleGroup>
        <Example
          title="Editor split"
          description="Drag the divider, double-click to reset, or focus it and use the arrow keys — a live CSS custom property drives the split."
          code={`<Resizable defaultSize={38} label="Editor split" className="h-56 rounded-lg border border-border">
  <FileList />
  <Editor />
</Resizable>`}
        >
          <div className="w-full max-w-lg">
            <ResizableDemo />
          </div>
        </Example>
      </ExampleGroup>
    );
  }

  return null;
}
