import { Button } from '@/components/ui/button';
import { IconButton } from '@/components/ui/icon-button';
import { ButtonGroup } from '@/components/ui/button-group';
import { CopyButton } from '@/components/ui/copy-button';
import { CloseButton } from '@/components/ui/close-button';
import { Spinner } from '@/components/ui/spinner';
import {
  PlusIcon,
  ArrowRightIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
  DownloadIcon,
} from '@/components/ui/icons';
import { HStack } from '@/components/ui/stack';
import { Example, ExampleGroup } from '@/components/docs/example';
import { ToggleDemo } from '@/content/demos';

export function ActionsDocs({ slug }: { slug: string }) {
  if (slug === 'button') {
    return (
      <ExampleGroup>
        <Example
          title="Variants"
          description="Seven variants cover every level of emphasis, from a single primary action to a bare link."
          code={`import { Button } from '@/components/ui/button';

export function Variants() {
  return (
    <div className="flex flex-wrap gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="soft">Soft</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>
      <Button variant="link">Link</Button>
    </div>
  );
}`}
        >
          <HStack gap="sm" wrap="wrap">
            <Button>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="soft">Soft</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="danger">Danger</Button>
            <Button variant="link">Link</Button>
          </HStack>
        </Example>

        <Example
          title="Sizes"
          description="Three heights plus icon-only sizes. Text and icon sizes scale together."
          code={`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}
        >
          <HStack gap="sm" wrap="wrap" align="center">
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </HStack>
        </Example>

        <Example
          title="With icons"
          description="Icons are optional slots; they inherit the button’s text color and size."
          code={`<Button startIcon={<PlusIcon />}>New project</Button>
<Button variant="outline" endIcon={<ArrowRightIcon />}>Continue</Button>
<Button variant="danger" startIcon={<TrashIcon />}>Delete</Button>`}
        >
          <HStack gap="sm" wrap="wrap">
            <Button startIcon={<PlusIcon />}>New project</Button>
            <Button variant="outline" endIcon={<ArrowRightIcon />}>
              Continue
            </Button>
            <Button variant="danger" startIcon={<TrashIcon />}>
              Delete
            </Button>
          </HStack>
        </Example>

        <Example
          title="Loading"
          description="The loading state swaps the leading icon for a spinner, disables the button, and sets aria-busy."
          code={`<Button loading>Saving…</Button>
<Button variant="secondary" loading loadingText="Uploading">
  Upload
</Button>
<Button loading size="lg">Publishing</Button>`}
        >
          <HStack gap="sm" wrap="wrap">
            <Button loading>Saving…</Button>
            <Button variant="secondary" loading loadingText="Uploading">
              Upload
            </Button>
            <Button loading size="lg">
              Publishing
            </Button>
          </HStack>
        </Example>

        <Example
          title="As a link"
          description="asChild merges the button's classes and props into your child element — ideal for router links."
          code={`import Link from 'next/link';

<Button asChild>
  <Link href="/docs/installation">Get started</Link>
</Button>

<Button asChild variant="outline">
  <a href="https://example.com" target="_blank" rel="noreferrer">
    External docs
  </a>
</Button>`}
        >
          <HStack gap="sm" wrap="wrap">
            <Button asChild>
              <a href="/docs/installation">Get started</a>
            </Button>
            <Button asChild variant="outline">
              <a href="https://example.com" target="_blank" rel="noreferrer">
                External docs
              </a>
            </Button>
          </HStack>
        </Example>

        <Example
          title="Full width"
          description="fullWidth stretches the button to its container — useful in mobile sheets and auth forms."
          code={`<div className="w-64">
  <Button fullWidth>Continue</Button>
</div>`}
        >
          <div className="w-64">
            <Button fullWidth>Continue</Button>
          </div>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'icon-button') {
    return (
      <ExampleGroup>
        <Example
          title="Basic usage"
          description="A label is required, so icon-only controls can never ship without an accessible name."
          code={`<IconButton label="Add item"><PlusIcon /></IconButton>
<IconButton label="Settings"><SettingsIcon /></IconButton>
<IconButton label="Next"><ChevronRightIcon /></IconButton>`}
        >
          <HStack gap="sm">
            <IconButton label="Add item">
              <PlusIcon />
            </IconButton>
            <IconButton label="Settings">
              <SettingsIcon />
            </IconButton>
            <IconButton label="Next">
              <ChevronRightIcon />
            </IconButton>
          </HStack>
        </Example>

        <Example
          title="Variants & sizes"
          description="IconButton accepts the same variants as Button, plus three square sizes."
          code={`<IconButton label="Download" variant="outline"><DownloadIcon /></IconButton>
<IconButton label="Download" variant="soft"><DownloadIcon /></IconButton>
<IconButton label="Download" size="sm"><DownloadIcon /></IconButton>
<IconButton label="Download" size="lg" variant="secondary"><DownloadIcon /></IconButton>`}
        >
          <HStack gap="sm" align="center">
            <IconButton label="Download" variant="outline">
              <DownloadIcon />
            </IconButton>
            <IconButton label="Download" variant="soft">
              <DownloadIcon />
            </IconButton>
            <IconButton label="Download" size="sm">
              <DownloadIcon />
            </IconButton>
            <IconButton label="Download" size="lg" variant="secondary">
              <DownloadIcon />
            </IconButton>
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'button-group') {
    return (
      <ExampleGroup>
        <Example
          title="Attached group"
          description="Borders and radii collapse so the group reads as one segmented control."
          code={`<ButtonGroup>
  <Button variant="outline">Day</Button>
  <Button variant="outline">Week</Button>
  <Button variant="outline">Month</Button>
</ButtonGroup>`}
        >
          <ButtonGroup>
            <Button variant="outline">Day</Button>
            <Button variant="outline">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
        </Example>

        <Example
          title="Vertical"
          description="Switch orientation for a stacked toolbar."
          code={`<ButtonGroup orientation="vertical">
  <Button variant="outline" size="sm"><ChevronLeftIcon /> Previous</Button>
  <Button variant="outline" size="sm">Next <ChevronRightIcon /></Button>
</ButtonGroup>`}
        >
          <ButtonGroup orientation="vertical">
            <Button variant="outline" size="sm" startIcon={<ChevronLeftIcon />}>
              Previous
            </Button>
            <Button variant="outline" size="sm" endIcon={<ChevronRightIcon />}>
              Next
            </Button>
          </ButtonGroup>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'toggle') {
    return (
      <ExampleGroup>
        <Example
          title="Pressed state"
          description="Toggle exposes aria-pressed and is fully controlled — bring your own state."
          code={`const [pressed, setPressed] = useState(false);

<Toggle pressed={pressed} onPressedChange={setPressed}>
  {pressed ? 'Following' : 'Follow'}
</Toggle>`}
        >
          <ToggleDemo />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'copy-button') {
    return (
      <ExampleGroup>
        <Example
          title="Copy to clipboard"
          description="The icon swaps to a check for 1.6 seconds after a successful copy."
          code={`<CopyButton value="npm install flinchui" />
<CopyButton value="const answer = 42" variant="secondary" />`}
        >
          <HStack gap="sm">
            <CopyButton value="npm install flinchui" variant="secondary" />
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'close-button') {
    return (
      <ExampleGroup>
        <Example
          title="Dismiss control"
          description="A themed icon button with a sensible default label."
          code={`<CloseButton />
<CloseButton label="Dismiss banner" />`}
        >
          <HStack gap="sm">
            <CloseButton />
            <CloseButton label="Dismiss banner" />
          </HStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'spinner') {
    return (
      <ExampleGroup>
        <Example
          title="Sizes"
          description="Spinners inherit currentColor, so they always match the surrounding text."
          code={`<Spinner size="xs" />
<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />
<Spinner size="xl" />`}
        >
          <HStack gap="lg" align="center">
            <Spinner size="xs" />
            <Spinner size="sm" />
            <Spinner size="md" />
            <Spinner size="lg" />
            <Spinner size="xl" />
          </HStack>
        </Example>

        <Example
          title="Inside a button"
          description="Button’s loading state composes Spinner for you."
          code={`<Button loading>Saving…</Button>`}
        >
          <Button loading>Saving…</Button>
        </Example>
      </ExampleGroup>
    );
  }

  return null;
}
