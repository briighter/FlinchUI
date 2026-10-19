import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';
import { variants } from '@/lib/variants';

export const cardSchema = {
  base: 'flex flex-col rounded-lg border border-border bg-surface text-fg',
  variants: {
    variant: {
      outline: 'border border-border bg-surface',
      elevated: 'border border-border bg-surface shadow-md',
      subtle: 'border-transparent bg-surface-sunken',
      ghost: 'border-transparent bg-transparent',
      interactive:
        'border border-border bg-surface transition-shadow hover:shadow-md focus-within:ring-2 focus-within:ring-ring',
    },
    padding: {
      none: 'p-0',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    },
  },
  defaultVariants: { variant: 'outline', padding: 'none' },
} as const;

export const cardVariants = variants(cardSchema);
export type CardVariant = keyof typeof cardSchema.variants.variant;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  padding?: keyof typeof cardSchema.variants.padding;
  asChild?: boolean;
}

/** Card — a surface container. Compose with the header/content/footer parts. */
export function Card({
  variant = 'outline',
  padding = 'none',
  asChild = false,
  className,
  ...rest
}: CardProps) {
  const Comp = asChild ? Slot : 'div';
  return <Comp className={cn(cardVariants({ variant, padding }), className)} {...rest} />;
}

export function CardHeader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1 p-5 pb-3', className)} {...rest} />;
}

export interface CardTitleProps extends HTMLAttributes<HTMLHeadingElement> {
  as?: 'h2' | 'h3' | 'h4' | 'div';
}

export function CardTitle({ as: Comp = 'h3', className, ...rest }: CardTitleProps) {
  return <Comp className={cn('text-base font-semibold text-fg', className)} {...rest} />;
}

export function CardDescription({ className, ...rest }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-fg-muted', className)} {...rest} />;
}

export function CardContent({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-5 pt-0 text-sm text-fg-muted', className)} {...rest} />;
}

export function CardFooter({
  className,
  children,
  ...rest
}: HTMLAttributes<HTMLDivElement> & { children?: ReactNode }) {
  return (
    <div className={cn('mt-auto flex items-center gap-3 border-t border-border p-5', className)} {...rest}>
      {children}
    </div>
  );
}
