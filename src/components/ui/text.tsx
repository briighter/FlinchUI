import type { ElementType, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';
import { TEXT_ALIGN, TEXT_SIZE, TEXT_TONE, TEXT_WEIGHT } from '@/lib/tokens';
import type { TextAlignToken, TextSizeToken, TextToneToken, TextWeightToken } from '@/lib/tokens';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  asChild?: boolean;
  size?: TextSizeToken;
  tone?: TextToneToken;
  weight?: TextWeightToken;
  align?: TextAlignToken;
  truncate?: boolean;
  clamp?: 1 | 2 | 3 | 4;
  mono?: boolean;
}

const CLAMP = {
  1: 'line-clamp-1',
  2: 'line-clamp-2',
  3: 'line-clamp-3',
  4: 'line-clamp-4',
} as const;

/** Text — the general-purpose typography primitive. */
export function Text({
  as: Component = 'p',
  asChild = false,
  size = 'base',
  tone = 'default',
  weight,
  align,
  truncate = false,
  clamp,
  mono = false,
  className,
  ...rest
}: TextProps) {
  const Comp = (asChild ? Slot : Component) as ElementType;

  return (
    <Comp
      className={cn(
        TEXT_SIZE[size],
        TEXT_TONE[tone],
        weight && TEXT_WEIGHT[weight],
        align && TEXT_ALIGN[align],
        mono && 'font-mono',
        truncate && 'truncate',
        clamp && CLAMP[clamp],
        className,
      )}
      {...rest}
    />
  );
}
