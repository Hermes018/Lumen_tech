/** @purpose Locale routing middleware using next-intl */
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

export default createMiddleware(routing);

export const config = {
  // Match only internationalized pathnames, excluding static assets and api
  matcher: ['/', '/(bn|en)/:path*', '/((?!_next|_vercel|api|.*\\..*).*)'],
};
