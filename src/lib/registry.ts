import { components, categories, type CategoryId } from '@/registry/components';
import { guides } from '@/registry/guides';
import { showcaseApps } from './showcase';

export type { CategoryId };

/** Single version string surfaced by the registry API and AI endpoints. */
export const registryVersion = '0.2.0';

/** A single row in a component's API table. */
export interface PropDoc {
  name: string;
  type: string;
  default?: string;
  required?: boolean;
  description: string;
}

export interface ComponentDoc {
  /** URL segment, e.g. `button` → `/components/button`. */
  slug: string;
  /** Display name, e.g. `Button`. */
  name: string;
  category: CategoryId;
  /** One-line summary used in nav, search, and metadata. */
  description: string;
  /** Longer intro shown at the top of the page. */
  intro?: string;
  status?: 'stable' | 'beta' | 'planned';
  /** Runtime dependencies beyond react/react-dom. */
  deps?: string[];
  /** Source files a consumer copies in. */
  files?: string[];
  /** Whether a live preview is available. */
  preview?: boolean;
  props?: PropDoc[];
  /** Related component slugs. */
  related?: string[];
  /** Accessibility notes rendered as a bullet list. */
  a11y?: string[];
}

export interface GuideDoc {
  slug: string;
  title: string;
  description: string;
  group: string;
}

export function getComponent(slug: string): ComponentDoc | undefined {
  return components.find((component) => component.slug === slug);
}

export function getGuide(slug: string): GuideDoc | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getComponentsByCategory(category: CategoryId): ComponentDoc[] {
  return components.filter((component) => component.category === category);
}

/** Components that ship and render live previews (used by search and nav). */
export const allComponents = components;

/** Registry entries grouped by category, in category order. */
export function groupedComponents() {
  return categories.map((category) => ({
    ...category,
    items: getComponentsByCategory(category.id),
  }));
}

/** Every searchable destination on the docs site. */
export function searchIndex() {
  return [
    ...components.map((component) => ({
      type: 'component' as const,
      title: component.name,
      description: component.description,
      href: `/components/${component.slug}`,
      category: categories.find((entry) => entry.id === component.category)?.label ?? '',
    })),
    ...showcaseApps.map((app) => ({
      type: 'example' as const,
      title: `${app.name} — ${app.title}`,
      description: app.tagline,
      href: `/examples/${app.slug}`,
      category: app.category,
    })),
    ...guides.map((guide) => ({
      type: 'guide' as const,
      title: guide.title,
      description: guide.description,
      href: `/docs/${guide.slug}`,
      category: guide.group,
    })),
  ];
}
