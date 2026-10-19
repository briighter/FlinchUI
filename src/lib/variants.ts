/**
 * `variants` — a ~40-line, dependency-free class-variance-authority analogue.
 *
 * Every component exports its variant maps so consumers can compose or extend
 * them without forking the component (the "infinitely extensible" guarantee).
 *
 *   const buttonVariants = variants({
 *     base: "...",
 *     variants: { variant: { primary: "...", ghost: "..." }, size: { sm: "...", lg: "..." } },
 *     defaultVariants: { variant: "primary", size: "md" },
 *   });
 *
 *   buttonVariants({ variant: "ghost", size: "sm", className: "w-full" })
 */

import { cn } from './cn';

export interface VariantSchema {
  base?: string;
  variants?: Record<string, Record<string, string>>;
  defaultVariants?: Record<string, string>;
}

export type VariantProps<S extends VariantSchema> = {
  [K in keyof S['variants']]?: keyof S['variants'][K] & string;
};

export type VariantResolver<S extends VariantSchema> = (
  props?: VariantProps<S> & { className?: string },
) => string;

export function variants<S extends VariantSchema>(schema: S): VariantResolver<S> {
  return (props = {}) => {
    const { className, ...selections } = props as Record<string, unknown> & { className?: string };
    const classes: string[] = [];

    if (schema.base) classes.push(schema.base);

    const maps = schema.variants ?? {};
    for (const key of Object.keys(maps)) {
      const selected = selections[key] ?? schema.defaultVariants?.[key];
      if (typeof selected === 'string') {
        const resolved = maps[key]?.[selected];
        if (resolved) classes.push(resolved);
      }
    }

    if (className) classes.push(className);
    return cn(...classes);
  };
}
