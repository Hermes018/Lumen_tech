/** @purpose Localized (en/bn) sitemap generator for all public marketing, course, landing, and legal routes (docs/00 D2, docs/08) */

import type { MetadataRoute } from 'next';

interface RouteDefinition {
  path: string;
  changeFrequency: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
  priority: number;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = (process.env.NEXT_PUBLIC_APP_URL || 'https://lumen.academy').replace(/\/$/, '');

  const publicRoutes: RouteDefinition[] = [
    // Marketing Core
    { path: '', changeFrequency: 'daily', priority: 1.0 },
    { path: '/gre', changeFrequency: 'daily', priority: 0.9 },
    { path: '/ielts', changeFrequency: 'daily', priority: 0.9 },
    { path: '/pricing', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/courses', changeFrequency: 'daily', priority: 0.9 },
    { path: '/support', changeFrequency: 'weekly', priority: 0.7 },
    { path: '/help', changeFrequency: 'weekly', priority: 0.7 },

    // Courses & Offerings
    { path: '/courses/gre-complete', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/courses/ielts-academic', changeFrequency: 'weekly', priority: 0.8 },
    { path: '/courses/ielts-general', changeFrequency: 'weekly', priority: 0.8 },

    // Public CBT Diagnostics & Previews
    { path: '/exam/diagnostic', changeFrequency: 'monthly', priority: 0.8 },
    { path: '/exam/ielts-preview', changeFrequency: 'monthly', priority: 0.8 },

    // Auth Public Shells
    { path: '/sign-in', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/sign-up', changeFrequency: 'monthly', priority: 0.6 },

    // Legal & Trust
    { path: '/legal/terms', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/legal/privacy', changeFrequency: 'monthly', priority: 0.5 },
    { path: '/legal/refund-policy', changeFrequency: 'monthly', priority: 0.5 },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const route of publicRoutes) {
    const enUrl = `${baseUrl}${route.path}`;
    const bnUrl = `${baseUrl}/bn${route.path}`;

    // English entry (root)
    entries.push({
      url: enUrl,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates: {
        languages: {
          en: enUrl,
          bn: bnUrl,
        },
      },
    });

    // Bangla entry (/bn prefix)
    entries.push({
      url: bnUrl,
      lastModified: new Date(),
      changeFrequency: route.changeFrequency,
      priority: Math.max(0.1, route.priority - 0.05),
      alternates: {
        languages: {
          en: enUrl,
          bn: bnUrl,
        },
      },
    });
  }

  return entries;
}
