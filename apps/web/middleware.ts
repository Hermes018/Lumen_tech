/**
 * @purpose Vercel Edge Runtime middleware for next-intl routing, Better Auth session guards, and PDPO 2025 consent checks (00-DECISIONS.md D2, D4, P1-43)
 */
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

// Protected route prefixes requiring active authentication session
const PROTECTED_PREFIXES = [
  '/app',
  '/exam',
  '/studio',
  '/grader',
  '/support/staff',
  '/finance',
  '/admin',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, internal Next.js requests, API webhooks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Strip locale prefix (e.g. /bn/app -> /app) to evaluate route protection
  const pathWithoutLocale = pathname.startsWith('/bn')
    ? pathname.replace(/^\/bn/, '') || '/'
    : pathname;

  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathWithoutLocale === prefix || pathWithoutLocale.startsWith(`${prefix}/`)
  );

  // 3. Better Auth session check (Edge Runtime safe: read cookies without Node.js fs/crypto)
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  // Allow preview routes without requiring auth (e.g. /exam/ielts-preview)
  const isPreview = pathWithoutLocale.includes('-preview');

  if (isProtected && !sessionToken && !isPreview) {
    const redirectPrefix = pathname.startsWith('/bn') ? '/bn' : '';
    const loginUrl = new URL(`${redirectPrefix}/sign-in`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Bangladesh PDPO 2025 guardian consent cookie gate for under-18 learners
  const isMinor = request.cookies.get('lumen_is_minor')?.value === 'true';
  const guardianConsentVerified = request.cookies.get('lumen_guardian_consent')?.value === 'true';

  if (isProtected && isMinor && !guardianConsentVerified && !pathWithoutLocale.startsWith('/onboarding')) {
    const redirectPrefix = pathname.startsWith('/bn') ? '/bn' : '';
    const consentUrl = new URL(`${redirectPrefix}/onboarding/guardian-consent`, request.url);
    return NextResponse.redirect(consentUrl);
  }

  // 5. Delegate to next-intl routing middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
