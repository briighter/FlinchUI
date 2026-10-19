export interface GuideDoc {
  slug: string;
  title: string;
  description: string;
  group: string;
}

export const guides: GuideDoc[] = [
  {
    slug: 'introduction',
    title: 'Introduction',
    description: 'What FlinchUI is, the design constraints behind it, and why copy-paste beats a runtime.',
    group: 'Getting started',
  },
  {
    slug: 'installation',
    title: 'Installation',
    description: 'Scaffold Tailwind v4, drop in the tokens, and copy your first component.',
    group: 'Getting started',
  },
  {
    slug: 'theming',
    title: 'Theming',
    description: 'Swap design tokens to re-theme every component — including at runtime and in subtrees.',
    group: 'Getting started',
  },
  {
    slug: 'cli',
    title: 'CLI',
    description: 'Add components straight from the registry with a single command.',
    group: 'Getting started',
  },
  {
    slug: 'authoring',
    title: 'Authoring components',
    description: 'The conventions every FlinchUI component follows: variants, asChild, tokens, a11y.',
    group: 'Guides',
  },
  {
    slug: 'extending',
    title: 'Extending & composing',
    description: 'How to build your own components on top of the primitives without forking them.',
    group: 'Guides',
  },
  {
    slug: 'ai',
    title: 'Using AI agents',
    description: 'Teach an agent the library with llms.txt, the registry API, and the bundled prompt.',
    group: 'Guides',
  },
  {
    slug: 'react-native',
    title: 'React Native',
    description: 'Platform-parity code for every component, without a separate package.',
    group: 'Guides',
  },
  {
    slug: 'config-renderer',
    title: 'Config renderer',
    description: 'The original JSON-driven renderer, now an advanced, opt-in layer.',
    group: 'Advanced',
  },
  {
    slug: 'roadmap',
    title: 'Roadmap',
    description: 'The full component catalog, including what is planned next.',
    group: 'Advanced',
  },
];
