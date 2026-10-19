import type { MetadataRoute } from 'next';
import { allComponents } from '@/lib/registry';
import { guides } from '@/registry/guides';
import { siteUrl } from '@/lib/site';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return [
    { url: siteUrl, lastModified: now, changeFrequency: 'weekly', priority: 1 },
    ...guides.map((guide) => ({
      url: `${siteUrl}/docs/${guide.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    ...allComponents.map((component) => ({
      url: `${siteUrl}/components/${component.slug}`,
      lastModified: now,
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })),
  ];
}
