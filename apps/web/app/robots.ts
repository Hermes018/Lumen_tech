/**
 * @purpose Next.js robots.txt generator allowing public marketing routes and disallowing private app/exam/api routes.
 */
import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/src/lib/seo';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/app/', '/exam/', '/api/', '/dev/', '/sign-in', '/sign-up'],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
