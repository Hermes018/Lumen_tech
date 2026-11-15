/**
 * @purpose Next.js sitemap generator covering all public marketing routes in en and bn.
 */
import type { MetadataRoute } from 'next';
import { PUBLIC_MARKETING_ROUTES, buildLocalizedUrl } from '@/src/lib/seo';

const SITEMAP_ROUTES = [
  ...PUBLIC_MARKETING_ROUTES,
  '/tools/gre-score-calculator',
  '/tools/ielts-band-calculator',
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];

  for (const route of SITEMAP_ROUTES) {
    const enUrl = buildLocalizedUrl('en', route);
    const bnUrl = buildLocalizedUrl('bn', route);

    entries.push({
      url: enUrl,
      lastModified: now,
      changeFrequency: route === '/' ? 'weekly' : 'monthly',
      priority: route === '/' ? 1.0 : 0.8,
      alternates: {
        languages: {
          en: enUrl,
          bn: bnUrl,
        },
      },
    });

    entries.push({
      url: bnUrl,
      lastModified: now,
      changeFrequency: route === '/' ? 'weekly' : 'monthly',
      priority: route === '/' ? 0.9 : 0.7,
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
