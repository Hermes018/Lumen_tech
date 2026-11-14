/** @purpose Standard robots.txt configuration with sitemap pointer and private route guards (SEO policy, docs/08) */

import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://lumen.academy';

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
          '/api',
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
