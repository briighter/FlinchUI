/**
 * Config-Driven UI — Type Contracts
 *
 * This module is intentionally 100% type-only (with the exception of the
 * `NODE_TYPES` const, which is tree-shakeable). Every visual definition is a
 * deterministic, JSON-serializable tree. There are no functions, no handlers,
 * and no side-effects anywhere in this topology — business logic is expressed
 * exclusively through `actionId` declarations that the host application wires
 * into its own event bus.
 */

/** Recursive JSON value type — the only shape allowed inside `payload` fields. */
export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

/** The closed set of node types the registry knows how to render. */
export const NODE_TYPES = ['Container', 'Card', 'Heading', 'Button', 'Input'] as const;
export type NodeType = (typeof NODE_TYPES)[number];

/* ------------------------------ design tokens ------------------------------ */

export type SpacingToken = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
export type FlexDirectionToken = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type FlexWrapToken = 'wrap' | 'nowrap' | 'wrap-reverse';
export type AlignItemsToken = 'start' | 'center' | 'end' | 'stretch';
export type JustifyContentToken = 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
export type GridColumnsToken = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
export type CardVariantToken = 'elevated' | 'outlined' | 'filled' | 'ghost';
export type BorderRadiusToken = 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type TextAlignToken = 'left' | 'center' | 'right';
export type ButtonVariantToken = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSizeToken = 'sm' | 'md' | 'lg';
export type InputKind = 'text' | 'email' | 'password' | 'number' | 'search' | 'tel' | 'url';

/* --------------------------------- nodes --------------------------------- */

export interface BaseNode {
  /** Stable, deterministic identifier. Must match /^[A-Za-z0-9_\-:.]+$/. */
  id: string;
  /**
   * Deterministic atomic utility tokens (Tailwind CSS). Styling is a cheap
   * string alteration — inline styles and runtime CSS-in-JS are forbidden.
   */
  className?: string;
  /** Stable hook for e2e test selectors (rendered as `data-testid`). */
  testId?: string;
  /** Accessible label for nodes without visible text. */
  ariaLabel?: string;
}

export interface ContainerNode extends BaseNode {
  type: 'Container';
  display?: 'flex' | 'grid' | 'block';
  direction?: FlexDirectionToken;
  wrap?: FlexWrapToken;
  gap?: SpacingToken;
  align?: AlignItemsToken;
  justify?: JustifyContentToken;
  columns?: GridColumnsToken;
  children: UINode[];
}

export interface CardNode extends BaseNode {
  type: 'Card';
  variant?: CardVariantToken;
  padding?: SpacingToken;
  radius?: BorderRadiusToken;
  children: UINode[];
}

export interface HeadingNode extends BaseNode {
  type: 'Heading';
  level: HeadingLevel;
  text: string;
  align?: TextAlignToken;
  truncate?: boolean;
}

export interface ButtonNode extends BaseNode {
  type: 'Button';
  /** Declarative action declaration — pipelines into the host event bus. */
  actionId: string;
  label: string;
  variant?: ButtonVariantToken;
  size?: ButtonSizeToken;
  disabled?: boolean;
  fullWidth?: boolean;
  /** Serializable context attached to the dispatched action event. */
  payload?: JsonValue;
}

export interface InputConstraints {
  minLength?: number;
  maxLength?: number;
  /** Regular expression source string — must compile, checked by the validator. */
  pattern?: string;
  min?: number;
  max?: number;
}

export interface InputNode extends BaseNode {
  type: 'Input';
  name: string;
  label?: string;
  placeholder?: string;
  kind?: InputKind;
  required?: boolean;
  disabled?: boolean;
  readOnly?: boolean;
  defaultValue?: string;
  helperText?: string;
  /** Declarative change/blur/submit action declaration. */
  actionId?: string;
  payload?: JsonValue;
  constraints?: InputConstraints;
}

export type UINode = ContainerNode | CardNode | HeadingNode | ButtonNode | InputNode;

/* --------------------------------- pages --------------------------------- */

export interface PageLayoutMeta {
  title?: string;
  locale?: string;
}

export interface PageLayoutSchema {
  /** Semantic version of the layout contract, e.g. "1.0.0". Defaults to "1.0.0". */
  version: string;
  meta?: PageLayoutMeta;
  root: UINode;
}

/* ------------------------------ action pipeline ------------------------------ */

export type ActionEventType = 'click' | 'change' | 'submit' | 'focus' | 'blur';

/**
 * The single contract through which primitives communicate with host
 * application logic. Components never execute side-effects themselves.
 */
export interface ActionEvent {
  actionId: string;
  nodeId: string;
  event: ActionEventType;
  /** Current field value (Input nodes only). */
  value?: string;
  /** Static payload declared in the schema. */
  payload?: JsonValue;
  /** Dispatch timestamp (epoch ms), attached by the primitive at emit time. */
  timestamp: number;
}

export type ActionHandler = (event: ActionEvent) => void | Promise<void>;
