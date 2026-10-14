/**
 * Input — Controlled state field container component.
 *
 * Delivered as a client chunk through the ConfigRenderer registry. Fully
 * memoized with `useCallback`-scoped handlers, so typing in one field never
 * re-renders sibling nodes in the schema tree.
 *
 * State model:
 *  - Uncontrolled (default): initialized from the schema's `defaultValue`.
 *  - Controlled: supply `value` plus `onChange` from host state.
 *
 * The field never mutates server state directly. Every change, blur, and
 * Enter-commit is pipelined through the declarative `actionId` into the
 * host-supplied `onAction` bus as a serializable `ActionEvent`.
 *
 * Schema-declared constraints (`required`, `minLength`, `maxLength`,
 * `pattern`, `min`, `max`) are evaluated locally and surfaced as
 * accessible validation messages (`aria-invalid`, `role="alert"`).
 */

'use client';

import { memo, useCallback, useId, useMemo, useState } from 'react';
import type { ChangeEvent, FocusEvent, KeyboardEvent, ReactNode } from 'react';
import type { ActionEvent, ActionHandler, InputKind, InputNode } from '../../../types/configUI';

const BASE_INPUT_CLASSES =
  'box-border block w-full rounded-md border bg-white px-3 py-2 text-base text-slate-900 placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900 disabled:cursor-not-allowed dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:focus-visible:ring-slate-300';

const NEUTRAL_BORDER_CLASSES = 'border-slate-300';
const ERROR_BORDER_CLASSES = 'border-red-500 focus-visible:ring-red-500';
const DISABLED_CLASSES = 'bg-slate-50 opacity-60 dark:bg-slate-700';

const AUTO_COMPLETE_HINTS: Record<InputKind, string | undefined> = {
  text: undefined,
  email: 'email',
  password: 'current-password',
  number: undefined,
  search: undefined,
  tel: 'tel',
  url: 'url',
};

const DEFAULT_CONSTRAINTS: NonNullable<InputNode['constraints']> = {};

function validateValue(
  value: string,
  constraints: NonNullable<InputNode['constraints']>,
  required: boolean,
): string | undefined {
  if (required && value.trim().length === 0) {
    return 'This field is required.';
  }

  const { minLength, maxLength, pattern, min, max } = constraints;

  if (minLength !== undefined && value.length < minLength) {
    return `Please enter at least ${minLength} characters.`;
  }
  if (maxLength !== undefined && value.length > maxLength) {
    return `Please enter no more than ${maxLength} characters.`;
  }
  if (pattern !== undefined && value.length > 0) {
    try {
      if (!new RegExp(pattern).test(value)) {
        return 'The entered value does not match the required format.';
      }
    } catch {
      // Malformed patterns are rejected by the validation engine before render.
    }
  }

  if ((min !== undefined || max !== undefined) && value.trim() !== '') {
    const numericValue = Number(value);
    if (Number.isFinite(numericValue)) {
      if (min !== undefined && numericValue < min) {
        return `The value must be at least ${min}.`;
      }
      if (max !== undefined && numericValue > max) {
        return `The value must be at most ${max}.`;
      }
    }
  }

  return undefined;
}

export interface InputProps extends Omit<InputNode, 'type'> {
  /** Fully controlled mode: supply `value` together with `onChange`. */
  value?: string;
  onChange?: (value: string) => void;
  children?: ReactNode;
  /** Centralized action pipeline — the only path to host business logic. */
  onAction?: ActionHandler;
}

function Input({
  id,
  name,
  label,
  placeholder,
  kind = 'text',
  required = false,
  disabled = false,
  readOnly = false,
  defaultValue = '',
  helperText,
  constraints = DEFAULT_CONSTRAINTS,
  actionId,
  payload,
  className,
  testId,
  value: controlledValue,
  onChange: controlledChange,
  onAction,
}: InputProps) {
  const generatedId = useId();
  const fieldId = `config-ui-input-${generatedId}`;
  const helperId = `config-ui-input-${generatedId}-helper`;

  const [internalValue, setInternalValue] = useState<string>(defaultValue);
  const [isTouched, setIsTouched] = useState<boolean>(false);

  const isControlled = controlledValue !== undefined;
  const value = isControlled ? controlledValue : internalValue;

  // Errors surface once the field is touched or contains content, keeping
  // first paint clean while still catching invalid input immediately.
  const errorMessage = useMemo(
    () => (value.length > 0 || isTouched ? validateValue(value, constraints, required) : undefined),
    [value, constraints, required, isTouched],
  );

  const dispatchAction = useCallback(
    (event: ActionEvent['event'], nextValue: string) => {
      if (!actionId) {
        return;
      }
      onAction?.({
        actionId,
        nodeId: id,
        event,
        value: nextValue,
        payload,
        timestamp: Date.now(),
      });
    },
    [actionId, id, onAction, payload],
  );

  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const nextValue = event.target.value;
      if (!isControlled) {
        setInternalValue(nextValue);
      }
      controlledChange?.(nextValue);
      dispatchAction('change', nextValue);
    },
    [isControlled, controlledChange, dispatchAction],
  );

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      setIsTouched(true);
      dispatchAction('blur', event.target.value);
    },
    [dispatchAction],
  );

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Enter') {
        dispatchAction('submit', event.currentTarget.value);
      }
    },
    [dispatchAction],
  );

  const wrapperClassName = ['box-border', className ?? ''].filter(Boolean).join(' ');
  const inputClassName = [
    BASE_INPUT_CLASSES,
    errorMessage !== undefined ? ERROR_BORDER_CLASSES : NEUTRAL_BORDER_CLASSES,
    disabled ? DISABLED_CLASSES : '',
  ]
    .filter(Boolean)
    .join(' ');

  const describedBy = errorMessage !== undefined || helperText === undefined ? undefined : helperId;

  return (
    <div data-node-id={id} data-testid={testId} className={wrapperClassName}>
      {label !== undefined && (
        <label
          htmlFor={fieldId}
          className="mb-1.5 block text-sm font-medium text-slate-700 dark:text-slate-300"
        >
          {label}
          {required && (
            <span aria-hidden="true" className="ml-1 font-semibold text-red-500">
              *
            </span>
          )}
        </label>
      )}
      <input
        id={fieldId}
        name={name}
        type={kind}
        value={value}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        readOnly={readOnly}
        autoComplete={AUTO_COMPLETE_HINTS[kind]}
        aria-invalid={errorMessage !== undefined ? true : undefined}
        aria-required={required || undefined}
        aria-describedby={describedBy}
        className={inputClassName}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
      />
      {errorMessage !== undefined ? (
        <p role="alert" className="mt-1 text-sm font-medium text-red-600 dark:text-red-400">
          {errorMessage}
        </p>
      ) : (
        helperText !== undefined && (
          <p id={helperId} className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {helperText}
          </p>
        )
      )}
    </div>
  );
}

export default memo(Input);
