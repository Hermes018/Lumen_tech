/** @purpose Locale-scoped layout wrapper with next-intl message provider */
import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages, setRequestLocale } from 'next-intl/server';
import { brand } from '@lumen/config';
import { buildLocalizedMetadata } from '@/src/lib/seo';
import { routing, type Locale } from '../../src/i18n/routing';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    pathname: '/',
    titleEn: `${brand.name} — ${brand.tagline}`,
    titleBn: `${brand.nameBn} — ${brand.taglineBn}`,
    descriptionEn:
      'Bangladesh-first GRE and IELTS preparation platform with computer-adaptive mock tests, FSRS-4.5 vocabulary mastery, and transparent BDT/USD pricing.',
    descriptionBn:
      'কম্পিউটার-ভিত্তিক জিআরই ও আইইএলটিএস মক টেস্ট, এফএসআরএস-৪.৫ ভোকাবুলারি এবং স্বচ্ছ বিডিটি/ইউএসডি মূল্যে বাংলাদেশ-প্রথম প্রস্তুতি প্ল্যাটফর্ম।',
  });
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!routing.locales.includes(locale as Locale)) {
    notFound();
  }

  // Enable static rendering
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <div data-locale={locale} className={`min-h-screen ${locale === 'bn' ? 'font-bengali' : ''}`}>
        {children}
      </div>
    </NextIntlClientProvider>
  );
}
