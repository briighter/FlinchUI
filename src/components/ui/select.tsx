import type { ComponentPropsWithRef, ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { fieldBorder, fieldHeight, fieldPadX, fieldSurface, fieldText } from './form-field';
import type { FieldSize } from './form-field';

export interface SelectOption {
  label: string;
  value: string;
  disabled?: boolean;
}

export interface SelectProps extends Omit<ComponentPropsWithRef<'select'>, 'size' | 'children'> {
  size?: FieldSize;
  invalid?: boolean;
  placeholder?: string;
  options?: SelectOption[];
  children?: ReactNode;
}

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

/** Select — a themed native `<select>`, styled with `appearance-none`. */
export function Select({
  size = 'md',
  invalid = false,
  placeholder,
  options,
  className,
  children,
  ...rest
}: SelectProps) {
  return (
    <div className="relative flex items-center">
      <select
        aria-invalid={invalid || undefined}
        className={cn(
          fieldSurface,
          fieldBorder(invalid),
          fieldHeight[size],
          fieldText[size],
          fieldPadX[size],
          'cursor-pointer appearance-none pr-9',
          className,
        )}
        {...rest}
      >
        {placeholder ? (
          <option value="" disabled>
            {placeholder}
          </option>
        ) : null}
        {options?.map((option) => (
          <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
          </option>
        ))}
        {children}
      </select>
      <span
        aria-hidden="true"
        className="pointer-events-none absolute right-2.5 flex size-4 items-center justify-center text-fg-subtle [&_svg]:size-4"
      >
        <ChevronIcon />
      </span>
    </div>
  );
}
