import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { ToastProvider } from '@/components/ui/toast';
import { siteUrl } from '@/lib/site';
import './globals.css';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'FlinchUI — a lightweight, infinitely extensible React component library',
    template: '%s · FlinchUI',
  },
  description:
    'Copy-paste React components built on Tailwind v4 design tokens. Zero runtime styling, opt-in dependencies, and themable at runtime.',
};

/**
 * Runs before the body paints, so the saved theme is applied with no flash of
 * the wrong colors. Kept to a single, dependency-free inline script.
 */
const THEME_SCRIPT = `(function(){try{var k='flinch-theme';var t=localStorage.getItem(k)||'light';document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" data-theme="light" suppressHydrationWarning>
      <body className="min-h-dvh bg-bg text-fg antialiased">
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <a
          href="#main"
          className="fixed top-3 left-3 z-100 -translate-y-20 rounded-md bg-brand-600 px-4 py-2 text-sm font-medium text-fg-on-brand shadow-lg transition-transform focus:translate-y-0"
        >
          Skip to content
        </a>
        <ToastProvider>{children}</ToastProvider>
      </body>
    </html>
  );
}
