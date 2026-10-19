import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';
import { TEXT_ALIGN, TEXT_WEIGHT } from '@/lib/tokens';
import type { TextAlignToken, TextWeightToken } from '@/lib/tokens';

export type HeadingLevel = 1 | 2 | 3 | 4 | 5 | 6;
export type HeadingSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl';

const LEVEL_TAG: Record<HeadingLevel, ElementType> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
};

const LEVEL_SIZE: Record<HeadingLevel, HeadingSize> = {
  1: '4xl',
  2: '3xl',
  3: '2xl',
  4: 'xl',
  5: 'lg',
  6: 'md',
};

export const headingSizeClasses: Record<HeadingSize, string> = {
  sm: 'text-base font-semibold',
  md: 'text-lg font-semibold',
  lg: 'text-xl font-semibold',
  xl: 'text-2xl font-semibold tracking-tight',
  '2xl': 'text-3xl font-bold tracking-tight',
  '3xl': 'text-4xl font-bold tracking-tight',
  '4xl': 'text-5xl font-extrabold tracking-tight',
  '5xl': 'text-6xl font-extrabold tracking-tight',
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  /** Semantic heading level → element + default visual size. */
  level?: HeadingLevel;
  /** Override the visual size independently of the semantic level. */
  size?: HeadingSize;
  as?: ElementType;
  asChild?: boolean;
  align?: TextAlignToken;
  weight?: TextWeightToken;
  truncate?: boolean;
  /** Truncate to N lines (`line-clamp-N`) instead of a single line. */
  clamp?: 1 | 2 | 3 | 4;
}

const CLAMP = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
} as const;

/** Heading — semantic, themeable typography. */
export function Heading({
  level = 2,
  size,
  as,
  asChild = false,
  align,
  weight,
  truncate = false,
  clamp,
  className,
  ...rest
}: HeadingProps) {
  const Comp = (asChild ? Slot : (as ?? LEVEL_TAG[level])) as ElementType;
  const resolvedSize = size ?? LEVEL_SIZE[level];

  return (
    <Comp
      className={cn(
        'text-fg',
        headingSizeClasses[resolvedSize],
        align && TEXT_ALIGN[align],
        weight && TEXT_WEIGHT[weight],
        truncate && 'truncate',
        clamp && CLAMP[clamp],
        className,
      )}
      {...rest}
    />
  );
}
