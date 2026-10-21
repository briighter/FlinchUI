import { Children, isValidElement, type ReactElement, type ReactNode } from 'react';
import NextLink from 'next/link';
import { Callout } from '@/components/docs/callout';
import { Snippet } from '@/components/docs/snippet';
import { Doc, H2, H3, Lead, P, UL } from '@/components/docs/prose';
import { Example, ExampleGroup } from '@/components/docs/example';
import { Code } from '@/components/ui/code';
import { Badge } from '@/components/ui/badge';
import { HStack } from '@/components/ui/stack';
import { Card, CardDescription, CardTitle } from '@/components/ui/card';
import { DemoHost } from '@/components/DemoHost';

/**
 * JSX → Markdown.
 *
 * Docs pages are authored as React trees. Rather than scraping the rendered
 * HTML (which would lose code fences and pull in preview chrome), this walks
 * the element tree and recognises the small prose vocabulary by component
 * identity. One source, two outputs: the page and its `.md` mirror.
 *
 * It is intentionally server-only and dependency-free.
 */

type Props = Record<string, unknown>;

interface ExampleSpec {
  title?: ReactNode;
  description?: ReactNode;
  code: string;
  language: string;
}

const propsOf = (element: ReactElement): Props => element.props as Props;
const childrenOf = (element: ReactElement): ReactNode => propsOf(element).children as ReactNode;
const asNode = (value: unknown): ReactNode => value as ReactNode;
const asText = (value: unknown): string => (value == null ? '' : String(value));
const is = (element: ReactElement, type: unknown): boolean => (element.type as unknown) === type;

/* -------------------------------------------------------------------------- */
/*  Low-level helpers                                                         */
/* -------------------------------------------------------------------------- */

/** Pick a fence longer than any backtick run inside the payload. */
function fenceFor(value: string, minimum = 3): string {
  const runs = value.match(/`+/g);
  const longest = runs ? Math.max(...runs.map((run) => run.length)) : 0;
  return '`'.repeat(Math.max(minimum, longest + 1));
}

function fencedCode(value: string, language = 'tsx'): string {
  const fence = fenceFor(value);
  return `${fence}${language}\n${value.replace(/\s+$/, '')}\n${fence}`;
}

function inlineCode(value: string): string {
  const text = value.replace(/\s+/g, ' ').trim();
  const fence = fenceFor(text, 1);
  const pad = text.startsWith('`') || text.endsWith('`') ? ' ' : '';
  return `${fence}${pad}${text}${pad}${fence}`;
}

function textOf(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement(node)) return textOf(childrenOf(node as ReactElement));
  return '';
}

/* -------------------------------------------------------------------------- */
/*  Inline rendering                                                          */
/* -------------------------------------------------------------------------- */

/** Render a node as a single line of Markdown (for headings, paragraphs, list items). */
export function inlineMarkdown(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string') return node.replace(/\s+/g, ' ');
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(inlineMarkdown).join('');
  if (!isValidElement(node)) return '';

  const element = node as ReactElement;
  const props = propsOf(element);
  const children = childrenOf(element);

  if (is(element, Code) || element.type === 'code') return inlineCode(textOf(children));
  if (is(element, NextLink)) return `[${inlineMarkdown(children)}](${asText(props.href)})`;
  if (element.type === 'a') return `[${inlineMarkdown(children)}](${asText(props.href)})`;
  if (element.type === 'br') return '\n';
  if (element.type === 'strong' || element.type === 'b') return `**${inlineMarkdown(children)}**`;
  if (element.type === 'em' || element.type === 'i') return `*${inlineMarkdown(children)}*`;
  if (is(element, CardTitle)) return `**${inlineMarkdown(children)}**`;

  return inlineMarkdown(children);
}

/* -------------------------------------------------------------------------- */
/*  Block rendering                                                           */
/* -------------------------------------------------------------------------- */

function listMarkdown(children: ReactNode, ordered: boolean): string {
  const items = Children.toArray(children).filter(
    (child) => isValidElement(child) || (typeof child === 'string' && child.trim() !== ''),
  );

  return items
    .map((child, index) => {
      const marker = ordered ? `${index + 1}.` : '-';
      if (!isValidElement(child)) return `${marker} ${String(child).trim()}`;

      const element = child as ReactElement;
      const isItem = element.type === 'li' || element.type === 'dt' || element.type === 'dd';
      const content = inlineMarkdown(isItem ? childrenOf(element) : element).trim();
      return `${marker} ${content.replace(/\n+/g, ' ')}`;
    })
    .join('\n');
}

function tableMarkdown(children: ReactNode): string {
  const rows: string[][] = [];

  const collect = (node: ReactNode) => {
    if (!isValidElement(node)) return;
    const element = node as ReactElement;

    if (element.type === 'tr') {
      const cells = Children.toArray(childrenOf(element))
        .filter((cell) => isValidElement(cell))
        .map((cell) =>
          inlineMarkdown(childrenOf(cell as ReactElement))
            .trim()
            .replace(/\|/g, '\\|'),
        );
      if (cells.length) rows.push(cells);
      return;
    }

    Children.forEach(childrenOf(element), collect);
  };

  Children.forEach(children, collect);
  if (!rows.length) return '';

  const width = Math.max(...rows.map((row) => row.length));
  const pad = (row: string[]) => [...row, ...Array<string>(width - row.length).fill('')];
  const [head, ...body] = rows;

  return [
    `| ${pad(head).join(' | ')} |`,
    `| ${Array<string>(width).fill('---').join(' | ')} |`,
    ...body.map((row) => `| ${pad(row).join(' | ')} |`),
  ].join('\n');
}

function calloutMarkdown(props: Props): string {
  const tone = asText(props.tone || 'note');
  const kind =
    ({ note: 'NOTE', tip: 'TIP', warning: 'WARNING', danger: 'CAUTION', terminal: 'NOTE' } as Record<
      string,
      string
    >)[tone] ?? 'NOTE';

  const head = props.title ? [`**${inlineMarkdown(asNode(props.title))}**`, ''] : [];
  const body = inlineMarkdown(asNode(props.children)).trim();

  return [
    `> [!${kind}]`,
    ...head.map((line) => (line ? `> ${line}` : '>')),
    ...(body ? [`> ${body}`] : []),
  ].join('\n');
}

function snippetMarkdown(props: Props): string {
  const title = props.title ? `**${inlineMarkdown(asNode(props.title))}**\n\n` : '';
  return `${title}${fencedCode(asText(props.code), asText(props.language || 'tsx'))}`;
}

function exampleMarkdown(props: Props): string {
  const title = props.title ? `### ${inlineMarkdown(asNode(props.title))}\n\n` : '';
  const description = props.description
    ? `${inlineMarkdown(asNode(props.description))}\n\n`
    : '';
  return `${title}${description}${fencedCode(asText(props.code), asText(props.language || 'tsx'))}`;
}

export function blockMarkdown(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string') {
    const text = node.trim();
    return text ? `${text}\n\n` : '';
  }
  if (typeof node === 'number') return `${node}\n\n`;
  if (Array.isArray(node)) return node.map(blockMarkdown).join('');
  if (!isValidElement(node)) return '';

  const element = node as ReactElement;
  const props = propsOf(element);
  const children = childrenOf(element);

  /* Prose primitives ------------------------------------------------ */
  if (is(element, Doc) || is(element, ExampleGroup)) return blockMarkdown(children);
  if (is(element, H2)) return `## ${inlineMarkdown(children)}\n\n`;
  if (is(element, H3)) return `### ${inlineMarkdown(children)}\n\n`;
  if (is(element, P) || is(element, Lead)) return `${inlineMarkdown(children).trim()}\n\n`;
  if (is(element, UL)) return `${listMarkdown(children, false)}\n\n`;
  if (is(element, Callout)) return `${calloutMarkdown(props)}\n\n`;
  if (is(element, Snippet)) return `${snippetMarkdown(props)}\n\n`;
  if (is(element, Example)) return `${exampleMarkdown(props)}\n\n`;
  if (is(element, DemoHost)) {
    return `_Interactive demo — open the page to use it._\n\n`;
  }

  /* Cards and chrome ------------------------------------------------ */
  if (is(element, Badge)) return `${inlineMarkdown(children).trim()}\n\n`;
  if (is(element, HStack)) {
    const items = Children.toArray(children).filter((child) => isValidElement(child));
    if (items.length && items.every((child) => is(child as ReactElement, Badge))) {
      return `${items
        .map((child) => inlineMarkdown(childrenOf(child as ReactElement)).trim())
        .join(' · ')}\n\n`;
    }
    return blockMarkdown(children);
  }
  if (is(element, Card)) return `${blockMarkdown(children).trim()}\n\n`;
  if (is(element, CardTitle)) return `**${inlineMarkdown(children)}**\n\n`;
  if (is(element, CardDescription)) return `${inlineMarkdown(children).trim()}\n\n`;
  if (is(element, NextLink)) {
    return `[${inlineMarkdown(children)}](${asText(props.href)})\n\n`;
  }

  /* Host elements ---------------------------------------------------- */
  if (typeof element.type === 'string') {
    switch (element.type) {
      case 'h1':
        return `# ${inlineMarkdown(children)}\n\n`;
      case 'h2':
        return `## ${inlineMarkdown(children)}\n\n`;
      case 'h3':
        return `### ${inlineMarkdown(children)}\n\n`;
      case 'h4':
        return `#### ${inlineMarkdown(children)}\n\n`;
      case 'p':
        return `${inlineMarkdown(children).trim()}\n\n`;
      case 'ul':
        return `${listMarkdown(children, false)}\n\n`;
      case 'ol':
        return `${listMarkdown(children, true)}\n\n`;
      case 'li':
        return `${inlineMarkdown(children).trim()}\n\n`;
      case 'pre':
        return `${fencedCode(textOf(children), '')}\n\n`;
      case 'table':
        return `${tableMarkdown(children)}\n\n`;
      case 'blockquote': {
        const body = blockMarkdown(children).trim();
        return `${body
          .split('\n')
          .map((line) => (line ? `> ${line}` : '>'))
          .join('\n')}\n\n`;
      }
      case 'hr':
        return '---\n\n';
      case 'br':
        return '\n';
      case 'figcaption':
        return `_${inlineMarkdown(children).trim()}_\n\n`;
      case 'summary':
        return `**${inlineMarkdown(children)}**\n\n`;
      case 'strong':
      case 'b':
        return `**${inlineMarkdown(children)}**\n\n`;
      case 'em':
      case 'i':
        return `*${inlineMarkdown(children)}*\n\n`;
      case 'code':
        return `${inlineCode(textOf(children))}\n\n`;
      default:
        return blockMarkdown(children);
    }
  }

  /* Unknown components: keep their content --------------------------- */
  return blockMarkdown(children);
}

/** Normalise a rendered tree into a tidy Markdown document. */
export function jsxToMarkdown(node: ReactNode): string {
  return `${blockMarkdown(node)
    .replace(/[ \t]+\n/g, '\n')
    .replace(/\n{3,}/g, '\n\n')
    .trim()}\n`;
}

/* -------------------------------------------------------------------------- */
/*  Example extraction                                                        */
/* -------------------------------------------------------------------------- */

/**
 * Pull every `<Example>` out of a category module without rendering it. This is
 * how component pages get their exact source and titles in Markdown.
 */
export function collectExamples(node: ReactNode, found: ExampleSpec[] = []): ExampleSpec[] {
  if (!isValidElement(node)) return found;

  const element = node as ReactElement;
  if (is(element, Example)) {
    const props = propsOf(element);
    found.push({
      title: asNode(props.title),
      description: asNode(props.description),
      code: asText(props.code),
      language: asText(props.language || 'tsx'),
    });
    return found;
  }

  Children.forEach(childrenOf(element), (child) => collectExamples(child, found));
  return found;
}

export type { ExampleSpec };
