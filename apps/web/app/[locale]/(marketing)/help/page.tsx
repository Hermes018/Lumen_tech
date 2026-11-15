/** @purpose Institutional help & FAQ page (/help) composed exclusively from closed UI primitives and bilingual marketing content */
import type { Metadata } from 'next';
import { brand } from '@lumen/config';
import { buildLocalizedMetadata } from '@/src/lib/seo';
import {
  Breadcrumb,
  CtaBand,
  FaqDisclosureList,
  HeroBand,
  Section,
  SideHeadingBlocks,
} from '@/src/components/ui/primitives';
import { MARKETING_CONTENT, type MarketingLocale } from '@/src/content/marketing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    pathname: '/help',
    titleEn: `Help & Support | ${brand.name}`,
    titleBn: `সহায়তা কেন্দ্র | ${brand.nameBn}`,
    descriptionEn:
      'Answers on bKash and Nagad payments, Mushak 6.3 VAT receipts, mock test timing, and technical support.',
    descriptionBn:
      'বিকাশ ও নগদ পেমেন্ট, মূসক ৬.৩ ভ্যাট রশিদ, মক টেস্টের সময়সূচি এবং কারিগরি সহায়তা সম্পর্কিত উত্তর।',
  });
}

export default async function HelpPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: MarketingLocale = rawLocale === 'bn' ? 'bn' : 'en';
  const content = MARKETING_CONTENT[locale].help;

  return (
    <>
      <Breadcrumb
        locale={locale}
        items={[
          { label: locale === 'bn' ? 'হোম' : 'Home', href: '/' },
          { label: content.breadcrumbLabel },
        ]}
      />
      <HeroBand
        tone="brand"
        title={content.hero.title}
        body={content.hero.body}
        ctaLabel={content.hero.ctaLabel}
        ctaHref={content.hero.ctaHref}
        photoSlot={content.hero.photoSlot}
        locale={locale}
      />
      <Section tone="white">
        <SideHeadingBlocks
          title={content.topics.title}
          intro={content.topics.intro}
          locale={locale}
          blocks={content.topics.blocks}
        />
      </Section>
      <Section tone="tint">
        <FaqDisclosureList title={content.faqTitle} items={content.faqs} />
      </Section>
      <CtaBand
        title={content.ctaBand.title}
        body={content.ctaBand.body}
        ctaLabel={content.ctaBand.ctaLabel}
        ctaHref={content.ctaBand.ctaHref}
        locale={locale}
      />
    </>
  );
}
