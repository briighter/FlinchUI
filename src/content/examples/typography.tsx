import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Link } from '@/components/ui/link';
import { Code, Kbd, Blockquote } from '@/components/ui/code';
import { List, ListItem } from '@/components/ui/list';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Prose } from '@/components/ui/prose';
import { HStack, Stack, VStack } from '@/components/ui/stack';
import { CheckIcon } from '@/components/ui/icons';
import { Example, ExampleGroup } from '@/components/docs/example';

export function TypographyDocs({ slug }: { slug: string }) {
  if (slug === 'heading') {
    return (
      <ExampleGroup>
        <Example
          title="Semantic levels"
          description="The level chooses both the element and the default visual size."
          code={`<Heading level={1}>Heading level 1</Heading>
<Heading level={2}>Heading level 2</Heading>
<Heading level={3}>Heading level 3</Heading>
<Heading level={4}>Heading level 4</Heading>`}
        >
          <Stack gap="sm">
            <Heading level={1}>Heading level 1</Heading>
            <Heading level={2}>Heading level 2</Heading>
            <Heading level={3}>Heading level 3</Heading>
            <Heading level={4}>Heading level 4</Heading>
          </Stack>
        </Example>

        <Example
          title="Decouple size from semantics"
          description="Keep correct document structure while matching a visual design."
          code={`<Heading level={2} size="4xl">Visually huge, semantically an h2</Heading>
<Heading level={4} size="sm">Visually small, semantically an h4</Heading>`}
        >
          <Stack gap="sm">
            <Heading level={2} size="4xl">
              Visually huge, semantically an h2
            </Heading>
            <Heading level={4} size="sm">
              Visually small, semantically an h4
            </Heading>
          </Stack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'text') {
    return (
      <ExampleGroup>
        <Example
          title="Size and tone"
          description="Tone maps to the semantic foreground tokens, so it adapts to the theme automatically."
          code={`<Text size="lg">Large, default text.</Text>
<Text tone="muted">Muted supporting copy.</Text>
<Text tone="subtle" size="sm">Subtle caption text.</Text>
<Text tone="danger">Something went wrong.</Text>`}
        >
          <VStack gap="sm">
            <Text size="lg">Large, default text.</Text>
            <Text tone="muted">Muted supporting copy.</Text>
            <Text tone="subtle" size="sm">
              Subtle caption text.
            </Text>
            <Text tone="danger">Something went wrong.</Text>
          </VStack>
        </Example>

        <Example
          title="Truncation"
          description="Single-line `truncate` or multi-line `clamp`."
          code={`<Text truncate>This line is too long for its container and will be truncated with an ellipsis.</Text>
<Text clamp={2}>This paragraph is clamped to two lines…</Text>`}
        >
          <VStack gap="sm">
            <Text truncate className="max-w-xs rounded border border-border p-2">
              This line is too long for its container and will be truncated with an ellipsis.
            </Text>
            <Text clamp={2} className="max-w-xs rounded border border-border p-2">
              This paragraph is clamped to two lines. It keeps going beyond the visible area so you
              can see the ellipsis appear at the end of the second line, exactly as designed.
            </Text>
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'link') {
    return (
      <ExampleGroup>
        <Example
          title="Tones"
          description="External links are detected automatically and get safe rel attributes."
          code={`<Link href="/components/button">Default link</Link>
<Link href="/docs" tone="muted">Muted link</Link>
<Link href="https://example.com">External link</Link>`}
        >
          <HStack gap="lg" wrap="wrap">
            <Link href="/components/button">Default link</Link>
            <Link href="/docs/introduction" tone="muted">
              Muted link
            </Link>
            <Link href="https://example.com">External link</Link>
          </HStack>
        </Example>

        <Example
          title="As a router link"
          description="asChild lets your framework's Link keep its own navigation behavior."
          code={`import NextLink from 'next/link';

<Link asChild>
  <NextLink href="/docs/theming">Theming guide</NextLink>
</Link>`}
        >
          <Link asChild>
            <a href="/docs/theming">Theming guide</a>
          </Link>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'code') {
    return (
      <ExampleGroup>
        <Example
          title="Inline code, keys, and quotes"
          description="Three small typographic primitives that share one module."
          code={`<Text>Run <Code>npm run dev</Code> to start.</Text>
<Text>Press <Kbd>⌘</Kbd> <Kbd>K</Kbd> to search.</Text>
<Blockquote cite="Ada Lovelace">
  That brain of mine is something more than merely mortal.
</Blockquote>`}
        >
          <VStack gap="md">
            <Text>
              Run <Code>npm run dev</Code> to start.
            </Text>
            <HStack gap="xs" align="center">
              <Text size="sm">Press</Text>
              <Kbd>⌘</Kbd>
              <Kbd>K</Kbd>
              <Text size="sm">to search.</Text>
            </HStack>
            <Blockquote cite="Ada Lovelace">
              That brain of mine is something more than merely mortal.
            </Blockquote>
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'list') {
    return (
      <ExampleGroup>
        <Example
          title="Variants"
          description="Unordered, ordered, and divided lists."
          code={`<List>
  <ListItem>Design tokens</ListItem>
  <ListItem>Copy-paste components</ListItem>
</List>

<List variant="ordered">
  <ListItem>Install</ListItem>
  <ListItem>Copy</ListItem>
</List>

<List variant="divided" className="rounded-lg border border-border px-4">
  <ListItem divided>Inbox</ListItem>
  <ListItem divided>Drafts</ListItem>
</List>`}
        >
          <VStack gap="lg">
            <List>
              <ListItem>Design tokens</ListItem>
              <ListItem>Copy-paste components</ListItem>
            </List>
            <List variant="ordered">
              <ListItem>Install</ListItem>
              <ListItem>Copy a component</ListItem>
            </List>
            <List variant="divided" className="rounded-lg border border-border px-4">
              <ListItem divided>Inbox</ListItem>
              <ListItem divided>Drafts</ListItem>
            </List>
          </VStack>
        </Example>

        <Example
          title="Icons"
          description="ListItem accepts a leading icon without extra markup."
          code={`<List variant="none">
  <ListItem icon={<CheckIcon />}>Zero dependencies</ListItem>
  <ListItem icon={<CheckIcon />}>Accessible by default</ListItem>
</List>`}
        >
          <List variant="none">
            <ListItem icon={<CheckIcon />}>Zero dependencies</ListItem>
            <ListItem icon={<CheckIcon />}>Accessible by default</ListItem>
          </List>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'label') {
    return (
      <ExampleGroup>
        <Example
          title="Required and optional"
          description="The required indicator is visual; pair it with `required` on the control for screen readers."
          code={`<Label htmlFor="email" required>Email</Label>
<Input id="email" type="email" />

<Label htmlFor="nickname" optional>Nickname</Label>
<Input id="nickname" />`}
        >
          <VStack gap="md">
            <Stack gap="xs">
              <Label htmlFor="label-email" required>
                Email
              </Label>
              <Input id="label-email" type="email" placeholder="you@company.com" />
            </Stack>
            <Stack gap="xs">
              <Label htmlFor="label-nickname" optional>
                Nickname
              </Label>
              <Input id="label-nickname" placeholder="ada" />
            </Stack>
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'prose') {
    return (
      <ExampleGroup>
        <Example
          title="Rich content"
          description="Prose styles arbitrary markdown or CMS HTML with no plugin."
          code={`<Prose>
  <h2>Design tokens</h2>
  <p>Tokens are <strong>semantic</strong>, not literal. Use <code>bg-surface</code>…</p>
  <ul><li>Light and dark</li><li>Subtree theming</li></ul>
  <blockquote>Change the tokens, not the components.</blockquote>
</Prose>`}
        >
          <Prose className="rounded-lg border border-border p-6">
            <h2>Design tokens</h2>
            <p>
              Tokens are <strong>semantic</strong>, not literal. Use <code>bg-surface</code> instead
              of a specific gray so the component adapts to every theme.
            </p>
            <ul>
              <li>Light and dark are just token overrides.</li>
              <li>Subtrees can be themed independently.</li>
            </ul>
            <blockquote>Change the tokens, not the components.</blockquote>
          </Prose>
        </Example>
      </ExampleGroup>
    );
  }

  return null;
}
