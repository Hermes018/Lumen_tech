/** @purpose Next 16 proxy: next-intl routing + optimistic session guard + PDPO gate (D2, D4, P1-43, P1-44). Real auth is enforced server-side in pages/actions. */
import { NextResponse, type NextRequest } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './src/i18n/routing';

const intl = createMiddleware(routing);

const PROTECTED_PREFIXES = [
  '/app',
  '/exam',
  '/studio',
  '/grader',
  '/support',
  '/editor',
  '/finance',
  '/org',
  '/counsellor',
  '/admin',
] as const;

// Only these exact public preview pages skip auth (no substring match)
const PUBLIC_EXAM = new Set(['/exam/ielts-preview', '/exam/diagnostic']);

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Skip static assets, internal Next.js requests, API webhooks
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  // 2. Strip locale prefix with exact segment boundary matching
  const isBn = pathname === '/bn' || pathname.startsWith('/bn/');
  const path = isBn ? pathname.slice(3) || '/' : pathname;
  const redirectPrefix = isBn ? '/bn' : '';

  const isProtected =
    PROTECTED_PREFIXES.some((p) => path === p || path.startsWith(`${p}/`)) &&
    !PUBLIC_EXAM.has(path);

  // 3. Optimistic Better Auth session cookie check (Edge Runtime safe)
  const hasSession =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  if (isProtected && !hasSession) {
    const loginUrl = new URL(`${redirectPrefix}/sign-in`, request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 4. Bangladesh PDPO 2025 guardian consent gate for under-18 learners
  const isMinor = request.cookies.get('lumen_is_minor')?.value === 'true';
  const guardianConsentVerified = request.cookies.get('lumen_guardian_consent')?.value === 'true';

  if (
    isProtected &&
    isMinor &&
    !guardianConsentVerified &&
    path !== '/onboarding' &&
    !path.startsWith('/onboarding/')
  ) {
    const consentUrl = new URL(`${redirectPrefix}/onboarding/guardian-consent`, request.url);
    return NextResponse.redirect(consentUrl);
  }

  // 5. Delegate to next-intl routing middleware
  return intl(request);
}

export const config = {
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
