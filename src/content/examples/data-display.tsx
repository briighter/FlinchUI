import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Skeleton } from '@/components/ui/skeleton';
import { Progress, CircularProgress } from '@/components/ui/progress';
import { EmptyState } from '@/components/ui/empty-state';
import { Stat } from '@/components/ui/stat';
import { DescriptionList } from '@/components/ui/description-list';
import { Timeline } from '@/components/ui/timeline';
import { Chip } from '@/components/ui/chip';
import { CodeBlock } from '@/components/ui/code-block';
import { Button } from '@/components/ui/button';
import { Grid } from '@/components/ui/grid';
import { HStack, VStack } from '@/components/ui/stack';
import { FolderIcon, BoltIcon } from '@/components/ui/icons';
import { Example, ExampleGroup } from '@/components/docs/example';
import { BadgeRemoveDemo, ChipRemoveDemo } from '@/content/demos';

export function DataDisplayDocs({ slug }: { slug: string }) {
  if (slug === 'card') {
    return (
      <ExampleGroup>
        <Example
          title="Composition"
          description="Header, content, and footer parts compose into any card layout."
          code={`<Card>
  <CardHeader>
    <CardTitle>Pro plan</CardTitle>
    <CardDescription>Everything you need to ship.</CardDescription>
  </CardHeader>
  <CardContent>Unlimited projects, 10 seats, priority support.</CardContent>
  <CardFooter>
    <Button size="sm">Upgrade</Button>
    <Button size="sm" variant="ghost">Compare</Button>
  </CardFooter>
</Card>`}
        >
          <Card className="max-w-sm">
            <CardHeader>
              <CardTitle>Pro plan</CardTitle>
              <CardDescription>Everything you need to ship.</CardDescription>
            </CardHeader>
            <CardContent>Unlimited projects, 10 seats, priority support.</CardContent>
            <CardFooter>
              <Button size="sm">Upgrade</Button>
              <Button size="sm" variant="ghost">
                Compare
              </Button>
            </CardFooter>
          </Card>
        </Example>

        <Example
          title="Variants"
          description="Outline, elevated, subtle, and ghost surfaces."
          code={`<Card variant="outline" padding="md">Outline</Card>
<Card variant="elevated" padding="md">Elevated</Card>
<Card variant="subtle" padding="md">Subtle</Card>
<Card variant="ghost" padding="md">Ghost</Card>`}
        >
          <Grid columns={2} gap="md">
            <Card variant="outline" padding="md" className="text-sm text-fg">Outline</Card>
            <Card variant="elevated" padding="md" className="text-sm text-fg">Elevated</Card>
            <Card variant="subtle" padding="md" className="text-sm text-fg">Subtle</Card>
            <Card variant="ghost" padding="md" className="text-sm text-fg">Ghost</Card>
          </Grid>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'badge') {
    return (
      <ExampleGroup>
        <Example
          title="Tones"
          description="Semantic tones map to the status color tokens."
          code={`<Badge>Neutral</Badge>
<Badge tone="brand">Brand</Badge>
<Badge tone="success">Success</Badge>
<Badge tone="warning">Warning</Badge>
<Badge tone="danger">Danger</Badge>
<Badge tone="info">Info</Badge>
<Badge tone="outline">Outline</Badge>`}
        >
          <HStack gap="sm" wrap="wrap">
            <Badge>Neutral</Badge>
            <Badge tone="brand">Brand</Badge>
            <Badge tone="success">Success</Badge>
            <Badge tone="warning">Warning</Badge>
            <Badge tone="danger">Danger</Badge>
            <Badge tone="info">Info</Badge>
            <Badge tone="outline">Outline</Badge>
          </HStack>
        </Example>

        <Example
          title="Status dot and removal"
          description="A leading dot reads as a live status; `onRemove` turns the badge into a removable tag."
          code={`const [tags, setTags] = useState(['react', 'tailwind']);

<HStack gap="sm" wrap="wrap">
  {tags.map((tag) => (
    <Badge
      key={tag}
      tone="brand"
      onRemove={() => setTags(tags.filter((entry) => entry !== tag))}
    >
      {tag}
    </Badge>
  ))}
</HStack>`}
        >
          <HStack gap="sm" wrap="wrap">
            <Badge tone="success" dot>
              Operational
            </Badge>
            <Badge tone="warning" dot>
              Degraded
            </Badge>
            <Badge tone="danger" dot>
              Outage
            </Badge>
          </HStack>
          <div className="mt-4">
            <BadgeRemoveDemo />
          </div>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'avatar') {
    return (
      <ExampleGroup>
        <Example
          title="Image, initials, and fallback"
          description="Avatar degrades gracefully when there is no image."
          code={`<Avatar name="Ada Lovelace" size="lg" />
<Avatar name="Grace Hopper" status="online" />
<Avatar src="/avatars/alan.jpg" name="Alan Turing" />
<Avatar name="Unknown" />`}
        >
          <HStack gap="md" align="center">
            <Avatar name="Ada Lovelace" size="lg" />
            <Avatar name="Grace Hopper" status="online" />
            <Avatar name="Alan Turing" size="xl" status="away" />
          </HStack>
        </Example>

        <Example
          title="Status indicators"
          description="Presence dots sit on the avatar edge."
          code={`<Avatar name="Ada Lovelace" status="online" />
<Avatar name="Grace Hopper" status="busy" />
<Avatar name="Alan Turing" status="away" />
<Avatar name="Katherine Johnson" status="offline" />`}
        >
          <HStack gap="md">
            <Avatar name="Ada Lovelace" status="online" />
            <Avatar name="Grace Hopper" status="busy" />
            <Avatar name="Alan Turing" status="away" />
            <Avatar name="Katherine Johnson" status="offline" />
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'avatar-group') {
    return (
      <ExampleGroup>
        <Example
          title="Overflow counter"
          description="Extra avatars collapse into a +N bubble."
          code={`<AvatarGroup max={4}>
  <Avatar name="Ada Lovelace" />
  <Avatar name="Grace Hopper" />
  <Avatar name="Alan Turing" />
  <Avatar name="Katherine Johnson" />
  <Avatar name="Margaret Hamilton" />
  <Avatar name="Barbara Liskov" />
</AvatarGroup>`}
        >
          <AvatarGroup max={4}>
            <Avatar name="Ada Lovelace" />
            <Avatar name="Grace Hopper" />
            <Avatar name="Alan Turing" />
            <Avatar name="Katherine Johnson" />
            <Avatar name="Margaret Hamilton" />
            <Avatar name="Barbara Liskov" />
          </AvatarGroup>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'table') {
    const rows = [
      { name: 'Ada Lovelace', email: 'ada@example.com', role: 'Owner', status: 'Active' },
      { name: 'Grace Hopper', email: 'grace@example.com', role: 'Admin', status: 'Active' },
      { name: 'Alan Turing', email: 'alan@example.com', role: 'Member', status: 'Invited' },
    ];
    return (
      <ExampleGroup>
        <Example
          title="Data table"
          description="Composed from semantic table parts, with horizontal scrolling built in."
          code={`<Table>
  <TableCaption>Team members</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>Name</TableHead>
      <TableHead>Role</TableHead>
      <TableHead>Status</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>Ada Lovelace</TableCell>
      <TableCell>Owner</TableCell>
      <TableCell><Badge tone="success">Active</Badge></TableCell>
    </TableRow>
  </TableBody>
</Table>`}
        >
          <Table>
            <TableCaption>Team members</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.email}>
                  <TableCell className="font-medium">{row.name}</TableCell>
                  <TableCell className="text-fg-muted">{row.email}</TableCell>
                  <TableCell>{row.role}</TableCell>
                  <TableCell>
                    <Badge tone={row.status === 'Active' ? 'success' : 'warning'} dot>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'skeleton') {
    return (
      <ExampleGroup>
        <Example
          title="Loading placeholder"
          description="Compose skeleton shapes to mirror the eventual content."
          code={`<div className="flex gap-3">
  <Skeleton width="2.5rem" height="2.5rem" radius="full" />
  <div className="flex-1 space-y-2">
    <Skeleton width="40%" height="0.75rem" />
    <Skeleton width="70%" height="0.75rem" />
  </div>
</div>`}
        >
          <div className="flex max-w-sm gap-3">
            <Skeleton width="2.5rem" height="2.5rem" radius="full" />
            <div className="flex-1 space-y-2">
              <Skeleton width="40%" height="0.75rem" />
              <Skeleton width="70%" height="0.75rem" />
            </div>
          </div>
        </Example>

        <Example
          title="Shimmer"
          description="A moving highlight instead of a pulse."
          code={`<Skeleton animation="shimmer" height="1rem" width="100%" />
<Skeleton animation="shimmer" height="1rem" width="80%" />`}
        >
          <VStack gap="sm" className="max-w-sm">
            <Skeleton animation="shimmer" height="1rem" width="100%" />
            <Skeleton animation="shimmer" height="1rem" width="80%" />
            <Skeleton animation="shimmer" height="1rem" width="60%" />
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'progress') {
    return (
      <ExampleGroup>
        <Example
          title="Determinate"
          description="Set value/max and optionally show the percentage."
          code={`<Progress value={32} />
<Progress value={68} showValue tone="success" />
<Progress value={92} tone="danger" showValue />`}
        >
          <VStack gap="md" className="max-w-md">
            <Progress value={32} />
            <Progress value={68} showValue tone="success" />
            <Progress value={92} tone="danger" showValue />
          </VStack>
        </Example>

        <Example
          title="Indeterminate"
          description="For work with an unknown duration."
          code={`<Progress indeterminate />`}
        >
          <div className="max-w-md">
            <Progress indeterminate aria-label="Loading results" />
          </div>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'circular-progress') {
    return (
      <ExampleGroup>
        <Example
          title="Ring indicator"
          description="An SVG ring with a smooth stroke transition."
          code={`<CircularProgress value={25} />
<CircularProgress value={60} showValue size={64} thickness={5} />
<CircularProgress value={85} showValue size={80} thickness={6} tone="success" />`}
        >
          <HStack gap="lg" align="center">
            <CircularProgress value={25} />
            <CircularProgress value={60} showValue size={64} thickness={5} />
            <CircularProgress value={85} showValue size={80} thickness={6} tone="success" />
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'empty-state') {
    return (
      <ExampleGroup>
        <Example
          title="Actionable empty state"
          description="Icon, headline, explanation, and a single primary action."
          code={`<EmptyState
  icon={<FolderIcon />}
  title="No projects yet"
  description="Create your first project to start shipping with FlinchUI."
  action={<Button size="sm">New project</Button>}
/>`}
        >
          <EmptyState
            icon={<FolderIcon />}
            title="No projects yet"
            description="Create your first project to start shipping with FlinchUI."
            action={<Button size="sm">New project</Button>}
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'stat') {
    return (
      <ExampleGroup>
        <Example
          title="KPI block"
          description="Label, value, unit, and a trend-colored delta."
          code={`<Stat label="Monthly revenue" value="$48,120" delta="+12.5%" trend="up" />
<Stat label="Active users" value="2,847" delta="-3.1%" trend="down" />`}
        >
          <Grid columns={1} mdColumns={2} gap="md">
            <Card padding="md">
              <Stat label="Monthly revenue" value="$48,120" delta="+12.5%" trend="up" />
            </Card>
            <Card padding="md">
              <Stat label="Active users" value="2,847" delta="-3.1%" trend="down" />
            </Card>
          </Grid>
        </Example>

        <Example
          title="With icon and hint"
          description="Add context without changing the layout."
          code={`<Stat
  icon={<BoltIcon />}
  label="Requests"
  value="1.2M"
  unit="today"
  hint="Peak at 14:05 UTC"
/>`}
        >
          <Card padding="md" className="max-w-xs">
            <Stat icon={<BoltIcon />} label="Requests" value="1.2M" unit="today" hint="Peak at 14:05 UTC" />
          </Card>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'description-list') {
    return (
      <ExampleGroup>
        <Example
          title="Stacked and inline"
          description="Semantic `<dl>` with two layout options."
          code={`<DescriptionList
  layout="inline"
  items={[
    { term: 'Plan', description: 'Pro' },
    { term: 'Seats', description: '10 of 20 used' },
    { term: 'Billing', description: 'Monthly' },
  ]}
/>`}
        >
          <DescriptionList
            layout="inline"
            items={[
              { term: 'Plan', description: 'Pro' },
              { term: 'Seats', description: '10 of 20 used' },
              { term: 'Billing', description: 'Monthly' },
            ]}
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'timeline') {
    return (
      <ExampleGroup>
        <Example
          title="Activity feed"
          description="Per-item status controls the marker and connecting line."
          code={`<Timeline items={[
  { title: 'Deployment succeeded', timestamp: '2 min ago', status: 'complete' },
  { title: 'Build finished', timestamp: '4 min ago', status: 'complete' },
  { title: 'Running tests', timestamp: '5 min ago', status: 'current' },
]} />`}
        >
          <Timeline
            items={[
              { title: 'Deployment succeeded', timestamp: '2 min ago', status: 'complete', description: 'Production is serving the new build.' },
              { title: 'Build finished', timestamp: '4 min ago', status: 'complete' },
              { title: 'Running tests', timestamp: '5 min ago', status: 'current', description: '482 of 510 checks passed.' },
              { title: 'Queued', timestamp: '6 min ago', status: 'upcoming' },
            ]}
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'chip') {
    return (
      <ExampleGroup>
        <Example
          title="Removable tags"
          description="Chips carry an optional avatar and remove control."
          code={`<Chip onRemove={() => {}}>design</Chip>
<Chip onRemove={() => {}} selected>engineering</Chip>
<Chip avatar={<Avatar name="Ada Lovelace" size="xs" />} onRemove={() => {}}>
  Ada Lovelace
</Chip>`}
        >
          <VStack gap="md">
            <HStack gap="sm" wrap="wrap">
              <Chip selected>engineering</Chip>
              <Chip avatar={<Avatar name="Ada Lovelace" size="xs" />}>Ada Lovelace</Chip>
              <Chip>design</Chip>
            </HStack>
            <ChipRemoveDemo />
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'code-block') {
    return (
      <ExampleGroup>
        <Example
          title="Copyable source"
          description="Pass pre-highlighted HTML for syntax color, or plain code for zero-dependency rendering."
          code={`<CodeBlock
  title="button.tsx"
  language="tsx"
  code={'export function Button() { ... }'}
/>`}
        >
          <CodeBlock
            title="greet.ts"
            language="ts"
            code={`export function greet(name: string) {
  return \`Hello, \${name}!\`;
}`}
          />
        </Example>
      </ExampleGroup>
    );
  }

  return null;
}
