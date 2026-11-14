/** @purpose Locale-preserving link helper and <LocaleLink> component that keeps /bn prefix intact across all internal routes */
'use client';

import React from 'react';
import NextLink, { type LinkProps } from 'next/link';
import { useLocale } from 'next-intl';

const EXTERNAL_OR_SPECIAL_RE = /^(?:https?:\/\/|mailto:|tel:|#|\/api\/)/i;

/**
 * Prefixes internal paths with `/bn` when `locale === 'bn'`, or strips `/bn` when `locale === 'en'`.
 * Leaves external URLs, hash-only links, and `/api/*` routes untouched.
 */
export function withLocale(locale: string, path: string): string {
  if (!path) return locale === 'bn' ? '/bn' : '/';
  if (EXTERNAL_OR_SPECIAL_RE.test(path)) return path;

  const normalized = path.startsWith('/') ? path : `/${path}`;

  if (locale === 'bn') {
    if (normalized === '/' || normalized === '/bn') return '/bn';
    if (normalized.startsWith('/#')) return `/bn${normalized.slice(1)}`;
    if (normalized.startsWith('/bn/') || normalized.startsWith('/bn?') || normalized.startsWith('/bn#')) {
      return normalized;
    }
    return `/bn${normalized}`;
  }

  // Default locale ('en' with 'as-needed' prefix)
  if (normalized === '/bn') return '/';
  if (normalized.startsWith('/bn#')) return `/${normalized.slice(3)}`;
  if (normalized.startsWith('/bn?')) return `/${normalized.slice(3)}`;
  if (normalized.startsWith('/bn/')) return normalized.slice(3) || '/';
  return normalized;
}

export interface LocaleLinkProps extends Omit<LinkProps, 'href'> {
  href: string;
  locale?: string;
  className?: string;
  children?: React.ReactNode;
  title?: string;
  'aria-label'?: string;
  'aria-current'?: React.AriaAttributes['aria-current'];
  target?: string;
  rel?: string;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

export function LocaleLink({ href, locale: explicitLocale, children, ...rest }: LocaleLinkProps) {
  const activeLocale = useLocale();
  const targetLocale = explicitLocale ?? activeLocale;
  const resolvedHref = withLocale(targetLocale, href);

  return (
    <NextLink href={resolvedHref} {...rest}>
      {children}
    </NextLink>
  );
}
