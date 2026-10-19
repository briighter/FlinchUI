import { Children, cloneElement, isValidElement } from 'react';
import type { ButtonHTMLAttributes, ReactElement, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { Slot } from '@/lib/slot';
import { variants } from '@/lib/variants';
import { Spinner } from './spinner';

export const buttonSchema = {
  base: [
    'relative inline-flex select-none items-center justify-center gap-2',
    'whitespace-nowrap rounded-md font-medium',
    'transition-[color,background-color,border-color,box-shadow] duration-150',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-bg',
    'disabled:pointer-events-none disabled:opacity-50',
    '[&_svg]:pointer-events-none [&_svg]:shrink-0',
  ].join(' '),
  variants: {
    variant: {
      primary: 'bg-brand-600 text-fg-on-brand shadow-xs hover:bg-brand-700 active:bg-brand-800',
      secondary:
        'border border-border bg-surface text-fg shadow-xs hover:bg-surface-sunken active:bg-surface-sunken',
      soft: 'bg-brand-50 text-brand-700 hover:bg-brand-100 dark:text-brand-300',
      outline: 'border border-border-strong bg-transparent text-fg hover:bg-surface-sunken',
      ghost: 'bg-transparent text-fg hover:bg-surface-sunken active:bg-surface-sunken',
      danger: 'bg-danger text-white shadow-xs hover:opacity-90 active:opacity-80',
      link: 'h-auto bg-transparent p-0 text-brand-600 underline-offset-4 hover:underline',
    },
    size: {
      sm: 'h-8 gap-1.5 px-3 text-sm [&_svg]:size-4',
      md: 'h-10 px-4 text-sm [&_svg]:size-4',
      lg: 'h-12 px-6 text-base [&_svg]:size-5',
      icon: 'size-10 [&_svg]:size-4',
      'icon-sm': 'size-8 [&_svg]:size-4',
      'icon-lg': 'size-12 [&_svg]:size-5',
    },
    fullWidth: {
      true: 'w-full',
      false: '',
    },
  },
  defaultVariants: { variant: 'primary', size: 'md', fullWidth: 'false' },
} as const;

export const buttonVariants = variants(buttonSchema);

export type ButtonVariant = keyof typeof buttonSchema.variants.variant;
export type ButtonSize = keyof typeof buttonSchema.variants.size;

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Render as the single child element instead (e.g. a router `<Link>`). */
  asChild?: boolean;
  /** Swap in a spinner and disable interaction. */
  loading?: boolean;
  loadingText?: string;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
}

/** Button — the primary interactive control, with variants, sizes, and loading state. */
export function Button({
  variant = 'primary',
  size = 'md',
  asChild = false,
  loading = false,
  loadingText,
  fullWidth = false,
  startIcon,
  endIcon,
  className,
  children,
  disabled,
  type,
  ...rest
}: ButtonProps) {
  const leading = loading ? <Spinner size={size === 'lg' ? 'md' : 'sm'} /> : startIcon;
  const trailing = loading ? null : endIcon;

  // With `asChild` the provider element (a router link, an anchor, ...) keeps
  // its own children, so the adornments are injected around them instead of
  // replacing them.
  if (asChild) {
    if (Children.count(children) !== 1 || !isValidElement(children)) {
      throw new Error(
        '<Button asChild> expects exactly one child element (for example <a> or <Link>).',
      );
    }

    const child = children as ReactElement<{ children?: ReactNode }>;

    return (
      <Slot
        className={cn(
          buttonVariants({ variant, size, fullWidth: fullWidth ? 'true' : 'false' }),
          className,
        )}
        aria-busy={loading || undefined}
        {...rest}
      >
        {cloneElement(
          child,
          undefined,
          <>
            {leading}
            {loading && loadingText ? loadingText : child.props.children}
            {trailing}
          </>,
        )}
      </Slot>
    );
  }

  return (
    <button
      className={cn(buttonVariants({ variant, size, fullWidth: fullWidth ? 'true' : 'false' }), className)}
      aria-busy={loading || undefined}
      disabled={disabled || loading}
      type={type ?? 'button'}
      {...rest}
    >
      {leading}
      {loading && loadingText ? loadingText : children}
      {trailing}
    </button>
  );
}
