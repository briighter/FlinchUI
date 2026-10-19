import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';
import { buttonSchema, buttonVariants } from './button';
import type { ButtonVariant } from './button';

export type IconButtonSize = 'sm' | 'md' | 'lg';

const SIZES = {
  sm: 'icon-sm',
  md: 'icon',
  lg: 'icon-lg',
} as const;

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: ButtonVariant;
  size?: IconButtonSize;
  asChild?: boolean;
  /** Required: icon-only buttons need an accessible name. */
  label: string;
}

/**
 * IconButton — a square, icon-only button. `label` is required so the control
 * always exposes an accessible name.
 */
export function IconButton({
  variant = 'ghost',
  size = 'md',
  asChild = false,
  label,
  className,
  children,
  type,
  ...rest
}: IconButtonProps) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      aria-label={label}
      title={label}
      className={cn(buttonVariants({ variant, size: SIZES[size] }), className)}
      type={asChild ? undefined : (type ?? 'button')}
      {...rest}
    >
      {children}
    </Comp>
  );
}

export { buttonSchema };
