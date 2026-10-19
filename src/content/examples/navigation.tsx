import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Stepper } from '@/components/ui/stepper';
import { Navbar } from '@/components/ui/navbar';
import { Sidebar } from '@/components/ui/sidebar';
import { Footer } from '@/components/ui/footer';
import { PageHeader } from '@/components/ui/page-header';
import { SkipLink } from '@/components/ui/skip-link';
import { Button } from '@/components/ui/button';
import { VStack } from '@/components/ui/stack';
import { Alert } from '@/components/ui/alert';
import {
  HomeIcon,
  BoxIcon,
  SettingsIcon,
  UserIcon,
  PlusIcon,
} from '@/components/ui/icons';
import { Example, ExampleGroup } from '@/components/docs/example';
import { PaginationDemo } from '@/content/demos';

export function NavigationDocs({ slug }: { slug: string }) {
  if (slug === 'breadcrumb') {
    return (
      <ExampleGroup>
        <Example
          title="Trail"
          description="The final item is marked aria-current=&quot;page&quot; and is not a link."
          code={`<Breadcrumb
  items={[
    { label: 'Home', href: '/' },
    { label: 'Components', href: '/components/button' },
    { label: 'Navigation' },
    { label: 'Breadcrumb' },
  ]}
/>`}
        >
          <Breadcrumb
            items={[
              { label: 'Home', href: '/' },
              { label: 'Components', href: '/components/button' },
              { label: 'Navigation' },
              { label: 'Breadcrumb' },
            ]}
          />
        </Example>

        <Example
          title="Collapsed on small screens"
          description="Set maxItems to keep the first and last items and collapse the middle."
          code={`<Breadcrumb
  maxItems={3}
  items={[
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs/introduction' },
    { label: 'Guides', href: '/docs/authoring' },
    { label: 'Components' },
  ]}
/>`}
        >
          <Breadcrumb
            maxItems={3}
            items={[
              { label: 'Home', href: '/' },
              { label: 'Docs', href: '/docs/introduction' },
              { label: 'Guides', href: '/docs/authoring' },
              { label: 'Components' },
            ]}
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'pagination') {
    return (
      <ExampleGroup>
        <Example
          title="Button mode"
          description="Controlled with onPageChange, with ellipsis collapsing for long page counts."
          code={`const [page, setPage] = useState(4);\n\n<Pagination page={page} pageCount={12} onPageChange={setPage} />`}
        >
          <PaginationDemo />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'stepper') {
    return (
      <ExampleGroup>
        <Example
          title="Horizontal"
          description="The current step is marked aria-current=&quot;step&quot;; completed steps get a check."
          code={`<Stepper
  current={1}
  steps={[
    { label: 'Account', description: 'Email and password' },
    { label: 'Workspace', description: 'Name and region' },
    { label: 'Invite', description: 'Add teammates' },
  ]}
/>`}
        >
          <Stepper
            current={1}
            steps={[
              { label: 'Account', description: 'Email and password' },
              { label: 'Workspace', description: 'Name and region' },
              { label: 'Invite', description: 'Add teammates' },
            ]}
          />
        </Example>

        <Example
          title="Vertical"
          description="Better for narrow containers and long step descriptions."
          code={`<Stepper
  orientation="vertical"
  current={2}
  steps={[
    { label: 'Install', description: 'npm run dev' },
    { label: 'Configure', description: 'Add the tokens' },
    { label: 'Copy', description: 'Add your first component' },
  ]}
/>`}
        >
          <Stepper
            orientation="vertical"
            current={2}
            steps={[
              { label: 'Install', description: 'npm run dev' },
              { label: 'Configure', description: 'Add the tokens' },
              { label: 'Copy', description: 'Add your first component' },
            ]}
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'navbar') {
    return (
      <ExampleGroup>
        <Example
          title="Application header"
          description="Brand, links, and actions, with a translucent background when sticky."
          code={`<Navbar
  brand={
    <>
      <span className="flex size-6 items-center justify-center rounded bg-brand-600 text-xs text-fg-on-brand">F</span>
      Acme
    </>
  }
  items={[
    { label: 'Dashboard', href: '#', active: true },
    { label: 'Projects', href: '#' },
    { label: 'Settings', href: '#' },
  ]}
  actions={<Button size="sm">New project</Button>}
/>`}
          previewClassName="p-0"
        >
          <Navbar
            sticky={false}
            brand={
              <>
                <span className="flex size-6 items-center justify-center rounded bg-brand-600 text-xs font-bold text-fg-on-brand">
                  A
                </span>
                Acme
              </>
            }
            items={[
              { label: 'Dashboard', href: '#', active: true },
              { label: 'Projects', href: '#' },
              { label: 'Settings', href: '#' },
            ]}
            actions={
              <Button size="sm" startIcon={<PlusIcon />}>
                New
              </Button>
            }
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'sidebar') {
    return (
      <ExampleGroup>
        <Example
          title="Grouped rail"
          description="Sections, icons, badges, and active-route styling — the same component used by this site."
          code={`<Sidebar
  sections={[
    {
      title: 'Workspace',
      items: [
        { label: 'Overview', href: '#', icon: <HomeIcon />, active: true },
        { label: 'Projects', href: '#', icon: <BoxIcon />, badge: '3' },
        { label: 'Team', href: '#', icon: <UserIcon /> },
      ],
    },
    {
      title: 'Settings',
      items: [{ label: 'Preferences', href: '#', icon: <SettingsIcon /> }],
    },
  ]}
/>`}
        >
          <div className="max-w-xs rounded-lg border border-border p-4">
            <Sidebar
              sticky={false}
              sections={[
                {
                  title: 'Workspace',
                  items: [
                    { label: 'Overview', href: '#', icon: <HomeIcon />, active: true },
                    { label: 'Projects', href: '#', icon: <BoxIcon />, badge: '3' },
                    { label: 'Team', href: '#', icon: <UserIcon /> },
                  ],
                },
                {
                  title: 'Settings',
                  items: [{ label: 'Preferences', href: '#', icon: <SettingsIcon /> }],
                },
              ]}
            />
          </div>
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'footer') {
    return (
      <ExampleGroup>
        <Example
          title="Sitemap footer"
          description="Up to three link columns beside your brand, with a legal row underneath."
          code={`<Footer
  brand={<p className="text-sm text-fg-muted">Build faster with copy-paste components.</p>}
  columns={[
    { title: 'Product', links: [{ label: 'Features', href: '#' }] },
    { title: 'Resources', links: [{ label: 'Docs', href: '#' }] },
    { title: 'Company', links: [{ label: 'About', href: '#' }] },
  ]}
  bottom={<span>© 2026 Acme</span>}
/>`}
          previewClassName="p-0"
        >
          <Footer
            brand={
              <div className="flex flex-col gap-2">
                <span className="text-sm font-semibold text-fg">Acme</span>
                <p className="text-sm text-fg-muted">Build faster with copy-paste components.</p>
              </div>
            }
            columns={[
              { title: 'Product', links: [{ label: 'Features', href: '#' }, { label: 'Pricing', href: '#' }] },
              { title: 'Resources', links: [{ label: 'Docs', href: '#' }, { label: 'Guides', href: '#' }] },
              { title: 'Company', links: [{ label: 'About', href: '#' }, { label: 'Careers', href: '#' }] },
            ]}
            bottom={<span className="text-xs">© 2026 Acme, Inc.</span>}
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'page-header') {
    return (
      <ExampleGroup>
        <Example
          title="Page title block"
          description="Breadcrumb, title, description, actions, and a footer slot for tabs or filters."
          code={`<PageHeader
  breadcrumb={<Breadcrumb items={[{ label: 'Projects', href: '#' }, { label: 'Acme' }]} />}
  title="Acme website"
  description="Track deployments, environment variables, and domains."
  actions={<Button size="sm">Deploy</Button>}
/>`}
          previewClassName="p-0"
        >
          <PageHeader
            breadcrumb={
              <Breadcrumb items={[{ label: 'Projects', href: '#' }, { label: 'Acme website' }]} />
            }
            title="Acme website"
            description="Track deployments, environment variables, and domains."
            actions={<Button size="sm">Deploy</Button>}
          />
        </Example>
      </ExampleGroup>
    );
  }

  if (slug === 'skip-link') {
    return (
      <ExampleGroup>
        <Example
          title="Keyboard-only affordance"
          description="Focus the preview with Tab, then press Tab again — the link slides into view."
          code={`<SkipLink targetId="main" />\n\n<main id="main" tabIndex={-1}>…</main>`}
        >
          <VStack gap="md">
            <Alert tone="info" title="Try it with the keyboard">
              Tab into the preview, then press Tab once more to reveal the skip link.
            </Alert>
            <div className="relative h-16 overflow-hidden rounded-md border border-dashed border-border bg-surface">
              <SkipLink targetId="main" className="absolute top-3 left-3 translate-y-0" />
              <p className="p-4 pt-10 text-xs text-fg-subtle">Preview area</p>
            </div>
          </VStack>
        </Example>
      </ExampleGroup>
    );
  }

  return null;
}
