'use client';

import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/cn';
import { IconButton } from './icon-button';

export interface CopyButtonProps {
  /** Text copied to the clipboard. */
  value: string;
  label?: string;
  copiedLabel?: string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'ghost' | 'secondary' | 'outline';
}

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

/** CopyButton — copies `value` to the clipboard and confirms visually. */
export function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied',
  className,
  size = 'md',
  variant = 'ghost',
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => {
    if (timeout.current) clearTimeout(timeout.current);
  }, []);

  async function copy() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      if (timeout.current) clearTimeout(timeout.current);
      timeout.current = setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  }

  return (
    <IconButton
      label={copied ? copiedLabel : label}
      size={size}
      variant={variant}
      onClick={copy}
      className={cn(copied && 'text-success-fg', className)}
    >
      {copied ? <CheckIcon /> : <CopyIcon />}
    </IconButton>
  );
}
