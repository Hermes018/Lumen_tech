/** @purpose Shared bilingual SEO metadata helper emitting canonical URLs, en/bn hreflang alternates, and OpenGraph tags */

import type { Metadata } from 'next';
import { brand } from '@lumen/config';

export const SITE_URL = (process.env.NEXT_PUBLIC_APP_URL || 'https://lumen.academy').replace(
  /\/$/,
  '',
);

export interface LocalizedMetadataInput {
  locale: string;
  pathname: string;
  titleEn: string;
  titleBn: string;
  descriptionEn: string;
  descriptionBn: string;
}

export function buildLocalizedMetadata({
  locale,
  pathname,
  titleEn,
  titleBn,
  descriptionEn,
  descriptionBn,
}: LocalizedMetadataInput): Metadata {
  const normalizedLocale = locale === 'bn' ? 'bn' : 'en';
  const cleanPath =
    pathname === '/' || pathname === ''
      ? ''
      : pathname.startsWith('/')
        ? pathname.replace(/\/$/, '')
        : `/${pathname.replace(/\/$/, '')}`;

  const title = normalizedLocale === 'bn' ? titleBn : titleEn;
  const description = normalizedLocale === 'bn' ? descriptionBn : descriptionEn;
  const canonicalUrl = `${SITE_URL}/${normalizedLocale}${cleanPath}`;
  const enUrl = `${SITE_URL}/en${cleanPath}`;
  const bnUrl = `${SITE_URL}/bn${cleanPath}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
      languages: {
        en: enUrl,
        bn: bnUrl,
        'x-default': enUrl,
      },
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      siteName: brand.name,
      locale: normalizedLocale === 'bn' ? 'bn_BD' : 'en_US',
      type: 'website',
    },
  };
}
