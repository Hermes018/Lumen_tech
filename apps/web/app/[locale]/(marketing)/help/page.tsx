/** @purpose Institutional help & FAQ page (/help) composed exclusively from closed UI primitives and bilingual marketing content */
import { brand } from '@lumen/config';
import {
  Breadcrumb,
  CtaBand,
  FaqDisclosureList,
  HeroBand,
  Section,
  SideHeadingBlocks,
} from '@/src/components/ui/primitives';
import { MARKETING_CONTENT, type MarketingLocale } from '@/src/content/marketing';

export const metadata = {
  title: `Help & Support | সহায়তা কেন্দ্র | ${brand.name}`,
  description:
    'Answers on bKash and Nagad payments, Mushak 6.3 VAT receipts, mock test timing, and technical support.',
};

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
