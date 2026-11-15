/** @purpose Open-redirect sanitizer and same-origin CSRF header verifier */

import { SECURITY_POLICY } from './policy';

const CONTROL_CHAR_REGEX = /[\u0000-\u001f\u007f]/;
const SCHEME_PREFIX_REGEX = /^[a-zA-Z][a-zA-Z0-9+.-]*:/;

export function sanitizeInternalRedirect(
  rawUrl: string | null | undefined,
  fallback = '/app',
): string {
  const safeFallback = SECURITY_POLICY.allowedRedirectPrefixes.some(
    (prefix) => fallback === prefix || fallback.startsWith(`${prefix}/`),
  )
    ? fallback
    : '/app';

  if (typeof rawUrl !== 'string') return safeFallback;
  const trimmed = rawUrl.trim();
  if (!trimmed) return safeFallback;

  if (CONTROL_CHAR_REGEX.test(trimmed) || trimmed.includes('\\')) {
    return safeFallback;
  }

  let decoded = trimmed;
  try {
    decoded = decodeURIComponent(trimmed);
  } catch {
    return safeFallback;
  }

  if (
    CONTROL_CHAR_REGEX.test(decoded) ||
    decoded.includes('\\') ||
    SCHEME_PREFIX_REGEX.test(trimmed) ||
    SCHEME_PREFIX_REGEX.test(decoded)
  ) {
    return safeFallback;
  }

  if (!trimmed.startsWith('/') || trimmed.startsWith('//') || decoded.startsWith('//')) {
    return safeFallback;
  }

  try {
    const parsed = new URL(trimmed, 'https://lumen.internal');
    if (parsed.origin !== 'https://lumen.internal') {
      return safeFallback;
    }
    if (!parsed.pathname.startsWith('/') || parsed.pathname.startsWith('//')) {
      return safeFallback;
    }

    const isAllowedPrefix = SECURITY_POLICY.allowedRedirectPrefixes.some(
      (prefix) => parsed.pathname === prefix || parsed.pathname.startsWith(`${prefix}/`),
    );
    if (!isAllowedPrefix) {
      return safeFallback;
    }

    return `${parsed.pathname}${parsed.search}${parsed.hash}`;
  } catch {
    return safeFallback;
  }
}

export interface CsrfRequestHeaders {
  origin?: string | null;
  host?: string | null;
  referer?: string | null;
}

export function verifySameOriginCsrf(requestHeaders: CsrfRequestHeaders): boolean {
  const rawHost = requestHeaders.host?.trim().toLowerCase();
  if (!rawHost) return false;

  const rawOrigin = requestHeaders.origin?.trim();
  if (rawOrigin) {
    if (rawOrigin === 'null') return false;
    try {
      const originUrl = new URL(rawOrigin);
      return originUrl.host.toLowerCase() === rawHost;
    } catch {
      return false;
    }
  }

  const rawReferer = requestHeaders.referer?.trim();
  if (rawReferer) {
    try {
      const refererUrl = new URL(rawReferer);
      return refererUrl.host.toLowerCase() === rawHost;
    } catch {
      return false;
    }
  }

  return false;
}
