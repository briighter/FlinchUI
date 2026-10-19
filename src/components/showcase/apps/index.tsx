'use client';

import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import { Spinner } from '@/components/ui/spinner';

function AppLoading() {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center gap-3">
      <Spinner size="lg" />
      <p className="text-sm text-fg-subtle">Loading application…</p>
    </div>
  );
}

/**
 * Each app is code-split so a visit to `/examples/trading-terminal` never
 * downloads the three.js scene or the game loop. Lazy loading is also what keeps
 * the optional `three` dependency out of every other route.
 */
const RENDERERS: Record<string, ComponentType> = {
  'trading-terminal': dynamic(() => import('./trading-terminal').then((m) => m.TradingTerminal), {
    loading: AppLoading,
  }),
  'analytics-dashboard': dynamic(() => import('./analytics-dashboard').then((m) => m.AnalyticsDashboard), {
    loading: AppLoading,
  }),
  'task-board': dynamic(() => import('./task-board').then((m) => m.TaskBoard), {
    loading: AppLoading,
  }),
  storefront: dynamic(() => import('./storefront').then((m) => m.Storefront), {
    loading: AppLoading,
  }),
  'patient-app': dynamic(() => import('./patient-app').then((m) => m.PatientApp), {
    loading: AppLoading,
  }),
  'music-studio': dynamic(() => import('./music-studio').then((m) => m.MusicStudio), {
    loading: AppLoading,
  }),
  'ci-pipeline': dynamic(() => import('./ci-pipeline').then((m) => m.CiPipeline), {
    loading: AppLoading,
  }),
  'product-configurator': dynamic(
    () => import('./product-configurator').then((m) => m.ProductConfigurator),
    { ssr: false, loading: AppLoading },
  ),
  'arcade-game': dynamic(() => import('./arcade-game').then((m) => m.ArcadeGame), {
    ssr: false,
    loading: AppLoading,
  }),
  'theme-generator': dynamic(() => import('./theme-generator').then((m) => m.ThemeGenerator), {
    loading: AppLoading,
  }),
};

export function ShowcaseAppView({ slug }: { slug: string }) {
  const Renderer = RENDERERS[slug];
  if (!Renderer) return null;
  return (
    <div className="flex h-full min-h-0 flex-col">
      <Renderer />
    </div>
  );
}
