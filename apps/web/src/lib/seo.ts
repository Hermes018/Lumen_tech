/**
 * @purpose Bilingual SEO metadata builder with canonical and hreflang alternates for en/bn routes.
 */
import type { Metadata } from 'next';
import { brand } from '@lumen/config';

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/+$/, '') || 'https://lumenacademy.bd';

export const PUBLIC_MARKETING_ROUTES = [
  '/',
  '/courses',
  '/gre',
  '/ielts',
  '/pricing',
  '/help',
  '/for-institutions',
] as const;

export interface LocalizedMetadataInput {
  locale: string;
  pathname: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.startsWith('/') ? pathname.replace(/\/+$/, '') : `/${pathname.replace(/\/+$/, '')}`;
}

export function buildLocalizedUrl(locale: 'en' | 'bn', pathname: string): string {
  const cleanPath = normalizePathname(pathname);
  if (locale === 'bn') {
    return cleanPath === '/' ? `${SITE_URL}/bn` : `${SITE_URL}/bn${cleanPath}`;
  }
  return cleanPath === '/' ? `${SITE_URL}/` : `${SITE_URL}${cleanPath}`;
}

export function buildLocalizedMetadata({
  locale,
  pathname,
  titleEn,
  titleBn,
  descriptionEn,
  descriptionBn,
}: LocalizedMetadataInput): Metadata {
  const isBn = locale === 'bn';
  const title = isBn ? `${titleBn} | ${brand.name}` : `${titleEn} | ${brand.name}`;
  const description = isBn ? descriptionBn : descriptionEn;

  const enUrl = buildLocalizedUrl('en', pathname);
  const bnUrl = buildLocalizedUrl('bn', pathname);
  const canonical = isBn ? bnUrl : enUrl;

  return {
    title,
    description,
    alternates: {
      canonical,
      languages: {
        en: enUrl,
        bn: bnUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: brand.name,
      locale: isBn ? 'bn_BD' : 'en_US',
      type: 'website',
    },
  };
}
