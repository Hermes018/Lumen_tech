/** @purpose Institutional IELTS preparation page (/ielts) composed exclusively from closed UI primitives and bilingual marketing content */
import type { Metadata } from 'next';
import { brand } from '@lumen/config';
import { buildLocalizedMetadata } from '@/src/lib/seo';
import {
  Breadcrumb,
  CtaBand,
  EditorialQuote,
  FaqDisclosureList,
  HeroBand,
  MediaColumns,
  Section,
  SideHeadingBlocks,
  SplitFeature,
  StatRow,
  Tabs,
  TabSectionPanel,
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
    pathname: '/ielts',
    titleEn: `IELTS Preparation | ${brand.name}`,
    titleBn: `আইইএলটিএস প্রস্তুতি | ${brand.nameBn}`,
    descriptionEn:
      'Computer-delivered IELTS Academic and General Training preparation with Listening, Reading, Writing, and Speaking simulators.',
    descriptionBn:
      'লিসেনিং, রিডিং, রাইটিং ও স্পিকিং সিমুলেটরসহ কম্পিউটার-ভিত্তিক আইইএলটিএস একাডেমিক ও জেনারেল ট্রেনিং প্রস্তুতি।',
  });
}

export default async function IeltsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: MarketingLocale = rawLocale === 'bn' ? 'bn' : 'en';
  const content = MARKETING_CONTENT[locale].ielts;

  const tabs = content.tabs.map((tab) => ({
    id: tab.id,
    label: tab.label,
    content: (
      <TabSectionPanel
        locale={locale}
        title={tab.title}
        body={tab.body}
        bullets={tab.bullets}
        disclosures={tab.disclosures}
        ctaLabel={tab.ctaLabel}
        ctaHref={tab.ctaHref}
      />
    ),
  }));

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
        tone="crimson"
        frame="petal"
        title={content.hero.title}
        body={content.hero.body}
        ctaLabel={content.hero.ctaLabel}
        ctaHref={content.hero.ctaHref}
        photoSlot={content.hero.photoSlot}
        locale={locale}
      />
      <Section tone="white">
        <StatRow stats={content.stats} />
      </Section>
      <Section tone="white">
        <SideHeadingBlocks
          title={content.overview.title}
          intro={content.overview.intro}
          ctaLabel={content.overview.ctaLabel}
          ctaHref={content.overview.ctaHref}
          locale={locale}
          blocks={content.overview.blocks}
        />
      </Section>
      <Section tone="tint">
        <Tabs title={content.tabsTitle} tabs={tabs} />
      </Section>
      <Section tone="white">
        <MediaColumns
          title={content.skills.title}
          intro={content.skills.intro}
          columns={4}
          locale={locale}
          items={content.skills.items}
        />
      </Section>
      <Section tone="white">
        <EditorialQuote
          quote={content.editorialQuote.quote}
          attribution={content.editorialQuote.attribution}
          tone={content.editorialQuote.tone}
        />
      </Section>
      {content.splitFeatures.map((feature, idx) => (
        <Section key={feature.title} tone={idx % 2 === 0 ? 'tint' : 'white'}>
          <SplitFeature
            photoSlot={feature.photoSlot}
            photoSide={feature.photoSide}
            backdrop={feature.backdrop}
            title={feature.title}
            body={feature.body}
            ctaLabel={feature.ctaLabel}
            ctaHref={feature.ctaHref}
            locale={locale}
          />
        </Section>
      ))}
      <Section tone="tint">
        <FaqDisclosureList title={content.roadmapTitle} items={content.roadmap} />
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
