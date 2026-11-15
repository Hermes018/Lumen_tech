/** @purpose Standard robots.txt configuration with sitemap pointer and private route guards (SEO policy, docs/08) */

import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/src/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/bn',
          '/gre',
          '/bn/gre',
          '/ielts',
          '/bn/ielts',
          '/courses',
          '/bn/courses',
          '/pricing',
          '/bn/pricing',
          '/support',
          '/bn/support',
          '/help',
          '/bn/help',
          '/legal/*',
          '/bn/legal/*',
        ],
        disallow: [
          '/app',
          '/bn/app',
          '/exam',
          '/bn/exam',
          '/studio',
          '/bn/studio',
          '/grader',
          '/bn/grader',
          '/finance',
          '/bn/finance',
          '/admin',
          '/bn/admin',
          '/org',
          '/bn/org',
          '/editor',
          '/bn/editor',
          '/staff',
          '/bn/staff',
          '/counsellor',
          '/bn/counsellor',
          '/checkout',
          '/bn/checkout',
          '/api/',
          '/dev/',
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
