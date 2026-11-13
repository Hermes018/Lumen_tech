/** @purpose Next.js 16 configuration with 8GB RAM worker caps, next-intl, and production security headers (docs/09 §5, P1-43) */
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const isDev = process.env.NODE_ENV !== 'production';

const cspHeader = `
  default-src 'self';
  script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ''} https://challenges.cloudflare.com https://cdn.paddle.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' blob: data: https:;
  font-src 'self' data:;
  frame-src 'self' https://iframe.mediadelivery.net https://challenges.cloudflare.com;
  frame-ancestors 'none';
  connect-src 'self' https: wss:;
  media-src 'self' blob: https:;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://sandbox.sslcommerz.com https://securepay.sslcommerz.com;
  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, ' ')
  .trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: cspHeader,
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(self), geolocation=(), browsing-topics=()',
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@lumen/ui', '@lumen/config', '@lumen/core'],
  productionBrowserSourceMaps: false,
  typescript: {
    ignoreBuildErrors: false,
  },
  experimental: {
    cpus: 2,
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
