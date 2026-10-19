import { Accordion, AccordionItem } from '@/components/ui/accordion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { HStack, VStack } from '@/components/ui/stack';
import { ChevronDownIcon } from '@/components/ui/icons';
import { Example, ExampleGroup } from '@/components/docs/example';

export function DisclosureDocs({ slug }: { slug: string }) {
  if (slug === 'accordion') {
    return (
      <ExampleGroup>
        <Example
          title="Native accordion"
          description="Built on <details>/<summary>: no JavaScript, no hydration, full keyboard support."
          code={`<Accordion>
  <AccordionItem title="What is FlinchUI?" defaultOpen>
    A copy-paste component library built on Tailwind v4 design tokens.
  </AccordionItem>
  <AccordionItem title="Do I need a provider?">
    No. There is no runtime, no context, and no theme object.
  </AccordionItem>
  <AccordionItem title="Can I change the styles?">
    Yes — the source is yours. Edit it, or override it with className.
  </AccordionItem>
</Accordion>`}
        >
          <Accordion>
            <AccordionItem title="What is FlinchUI?" defaultOpen>
              A copy-paste component library built on Tailwind v4 design tokens.
            </AccordionItem>
            <AccordionItem title="Do I need a provider?">
              No. There is no runtime, no context, and no theme object.
            </AccordionItem>
            <AccordionItem title="Can I change the styles?">
              Yes — the source is yours. Edit it, or override it with className.
            </AccordionItem>
          </Accordion>
        </Example>

        <Example
          title="Metadata and flush layout"
          description="Use `meta` for counts or statuses, and `flush` to drop the outer border."
          code={`<Accordion flush>
  <AccordionItem title="Billing" meta="3 items">
    Invoices, payment methods, and usage.
  </AccordionItem>
  <AccordionItem title="Team" meta="12 members">
    Invitations, roles, and permissions.
  </AccordionItem>
</Accordion>`}
        >
          <Accordion flush>
            <AccordionItem title="Billing" meta="3 items">
              Invoices, payment methods, and usage.
            </AccordionItem>
            <AccordionItem title="Team" meta="12 members">
              Invitations, roles, and permissions.
            </AccordionItem>
          </Accordion>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'tabs') {
    return (
      <ExampleGroup>
        <Example
          title="Line variant"
          description="Arrow keys move between tabs; the panel is wired with aria-labelledby."
          code={`<Tabs defaultValue="account">
  <TabsList>
    <TabsTrigger value="account">Account</TabsTrigger>
    <TabsTrigger value="billing">Billing</TabsTrigger>
    <TabsTrigger value="team">Team</TabsTrigger>
  </TabsList>
  <TabsContent value="account">Manage your profile and preferences.</TabsContent>
  <TabsContent value="billing">Invoices and payment methods.</TabsContent>
  <TabsContent value="team">Invite collaborators and set roles.</TabsContent>
</Tabs>`}
        >
          <Tabs defaultValue="account">
            <TabsList>
              <TabsTrigger value="account">Account</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
              <TabsTrigger value="team">Team</TabsTrigger>
            </TabsList>
            <TabsContent value="account" className="text-sm text-fg-muted">
              Manage your profile, email address, and notification preferences.
            </TabsContent>
            <TabsContent value="billing" className="text-sm text-fg-muted">
              Download invoices and update your payment method.
            </TabsContent>
            <TabsContent value="team" className="text-sm text-fg-muted">
              Invite collaborators and assign roles.
            </TabsContent>
          </Tabs>
        </Example>

        <Example
          title="Pills and enclosed"
          description="Two more visual treatments share the same behavior and accessibility wiring."
          code={`<Tabs defaultValue="preview" variant="pills">
  <TabsList>
    <TabsTrigger value="preview">Preview</TabsTrigger>
    <TabsTrigger value="code">Code</TabsTrigger>
  </TabsList>
  <TabsContent value="preview">Live preview</TabsContent>
  <TabsContent value="code">Source</TabsContent>
</Tabs>

<Tabs defaultValue="day" variant="enclosed">
  <TabsList>
    <TabsTrigger value="day">Day</TabsTrigger>
    <TabsTrigger value="week">Week</TabsTrigger>
  </TabsList>
</Tabs>`}
        >
          <VStack gap="lg">
            <Tabs defaultValue="preview" variant="pills">
              <TabsList>
                <TabsTrigger value="preview">Preview</TabsTrigger>
                <TabsTrigger value="code">Code</TabsTrigger>
              </TabsList>
              <TabsContent value="preview">
                <div className="rounded-md border border-dashed border-border p-6 text-center text-sm text-fg-muted">
                  Live preview
                </div>
              </TabsContent>
              <TabsContent value="code">
                <div className="rounded-md bg-surface-sunken p-6 font-mono text-sm text-fg-muted">
                  {'<Button>Deploy</Button>'}
                </div>
              </TabsContent>
            </Tabs>

            <Tabs defaultValue="day" variant="enclosed">
              <TabsList>
                <TabsTrigger value="day">Day</TabsTrigger>
                <TabsTrigger value="week">Week</TabsTrigger>
                <TabsTrigger value="month">Month</TabsTrigger>
              </TabsList>
              <TabsContent value="day" className="text-sm text-fg-muted">
                Daily view
              </TabsContent>
              <TabsContent value="week" className="text-sm text-fg-muted">
                Weekly view
              </TabsContent>
              <TabsContent value="month" className="text-sm text-fg-muted">
                Monthly view
              </TabsContent>
            </Tabs>
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'collapsible') {
    return (
      <ExampleGroup>
        <Example
          title="Show more"
          description="Uncontrolled by default; pass `open`/`onOpenChange` when you need to control it."
          code={`<Collapsible>
  <CollapsibleTrigger className="w-full justify-between">
    Advanced options
    <ChevronDownIcon />
  </CollapsibleTrigger>
  <CollapsibleContent>
    <VStack gap="sm" className="pt-3">
      <p className="text-sm text-fg-muted">
        These settings rarely need to change.
      </p>
      <HStack gap="sm">
        <Badge tone="neutral">cache: on</Badge>
        <Badge tone="neutral">retries: 3</Badge>
      </HStack>
    </VStack>
  </CollapsibleContent>
</Collapsible>`}
        >
          <Collapsible className="rounded-lg border border-border p-4">
            <CollapsibleTrigger className="w-full justify-between">
              Advanced options
              <ChevronDownIcon className="size-4 text-fg-subtle" />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <VStack gap="sm" className="pt-3">
                <p className="text-sm text-fg-muted">
                  These settings rarely need to change. The trigger keeps `aria-expanded` and
                  `aria-controls` in sync automatically.
                </p>
                <HStack gap="sm">
                  <Badge tone="neutral">cache: on</Badge>
                  <Badge tone="neutral">retries: 3</Badge>
                </HStack>
              </VStack>
            </CollapsibleContent>
          </Collapsible>
        </Example>
      </ExampleGroup>
    );
  }

  return null;
}
