/** @purpose Institutional pricing page (/pricing) composed exclusively from closed UI primitives and bilingual marketing content */
import type { Metadata } from 'next';
import { brand } from '@lumen/config';
import { buildLocalizedMetadata } from '@/src/lib/seo';
import {
  Breadcrumb,
  CalloutNotice,
  CtaBand,
  FaqDisclosureList,
  HeroBand,
  PricingSwitcherSection,
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
    pathname: '/pricing',
    titleEn: `Pricing & Plans | ${brand.name}`,
    titleBn: `মূল্য ও প্ল্যান | ${brand.nameBn}`,
    descriptionEn:
      'Transparent VAT-inclusive BDT and USD pricing for GRE and IELTS self-paced courses, live cohorts, and mock test passes.',
    descriptionBn:
      'জিআরই ও আইইএলটিএস সেলফ-পেসড কোর্স, লাইভ কোহর্ট ও মক টেস্ট পাসের স্বচ্ছ ভ্যাট-সহ বিডিটি ও ইউএসডি মূল্য তালিকা।',
  });
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: MarketingLocale = rawLocale === 'bn' ? 'bn' : 'en';
  const content = MARKETING_CONTENT[locale].pricing;

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
        <CalloutNotice title={content.notice.title} body={content.notice.body} locale={locale} />
        <PricingSwitcherSection
          locale={locale}
          fullCoursesLabel={content.tabs.fullCoursesLabel}
          passesLabel={content.tabs.passesLabel}
          fullCourses={content.tabs.fullCourses}
          passes={content.tabs.passes}
        />
      </Section>
      <Section tone="tint">
        <SideHeadingBlocks
          title={content.billing.title}
          intro={content.billing.intro}
          locale={locale}
          blocks={content.billing.blocks}
        />
      </Section>
      <Section tone="white">
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
