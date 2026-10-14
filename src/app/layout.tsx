import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';

export const metadata: Metadata = {
  title: 'FlinchUI — Config-Driven UI Engine',
  description:
    'Schema-validated, code-split, zero-runtime-styling React UI engine rendered from JSON.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased bg-slate-50 dark:bg-slate-950">{children}</body>
    </html>
  );
}
