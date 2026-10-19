import type { ComponentType } from 'react';
import type { CategoryId } from '@/lib/registry';
import { ActionsDocs } from './actions';
import { LayoutDocs } from './layout';
import { TypographyDocs } from './typography';
import { FormsDocs } from './forms';
import { DataDisplayDocs } from './data-display';
import { ChartsDocs } from './charts';
import { DisclosureDocs } from './disclosure';
import { FeedbackDocs } from './feedback';
import { OverlaysDocs } from './overlays';
import { NavigationDocs } from './navigation';

/**
 * Maps a component category to its documentation content.
 *
 * Adding a component is a three-step loop:
 *   1. add the component to `src/registry/components.ts`
 *   2. add its source file under `src/components/ui/`
 *   3. add examples to the matching category module below
 */
export const exampleContent: Partial<Record<CategoryId, ComponentType<{ slug: string }>>> = {
  layout: LayoutDocs,
  typography: TypographyDocs,
  actions: ActionsDocs,
  forms: FormsDocs,
  'data-display': DataDisplayDocs,
  charts: ChartsDocs,
  disclosure: DisclosureDocs,
  feedback: FeedbackDocs,
  overlays: OverlaysDocs,
  navigation: NavigationDocs,
};

export function ExampleContent({ category, slug }: { category: CategoryId; slug: string }) {
  const Content = exampleContent[category];
  if (!Content) return null;
  return <Content slug={slug} />;
}
