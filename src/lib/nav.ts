import { categories, components } from '@/registry/components';
import { guides } from '@/registry/guides';
import { showcaseApps } from '@/lib/showcase';

export interface NavLink {
  label: string;
  href: string;
  /** Short badge text, e.g. `beta`. */
  badge?: string;
}

export interface NavSection {
  title: string;
  items: NavLink[];
}

/** Serialisable navigation model shared by the sidebar, header, and mobile drawer. */
export function getDocsNav(): NavSection[] {
  const guideSection = (group: string): NavSection => ({
    title: group,
    items: guides
      .filter((guide) => guide.group === group)
      .map((guide) => ({ label: guide.title, href: `/docs/${guide.slug}` })),
  });

  return [
    guideSection('Getting started'),
    guideSection('Guides'),
    ...categories.map((category) => ({
      title: category.label,
      items: components
        .filter((component) => component.category === category.id)
        .map((component) => ({
          label: component.name,
          href: `/components/${component.slug}`,
          badge: component.status === 'beta' ? 'beta' : undefined,
        })),
    })),
    {
      // The showcase apps render outside the docs shell, so this section is a
      // set of jump-off links rather than part of the component tree.
      title: 'Examples',
      items: [
        { label: 'All examples', href: '/examples' },
        ...showcaseApps.map((app) => ({ label: app.name, href: `/examples/${app.slug}` })),
      ],
    },
    guideSection('Advanced'),
  ];
}

/** Flat list of every docs destination, used by the command palette. */
export function getFlatNav(): NavLink[] {
  return getDocsNav().flatMap((section) => section.items);
}
