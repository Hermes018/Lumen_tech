/** @purpose Institutional GRE preparation page (/gre) composed exclusively from closed UI primitives and bilingual marketing content */
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
import { LiveGreWidget } from './live-gre-widget';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    pathname: '/gre',
    titleEn: `GRE Preparation | ${brand.name}`,
    titleBn: `জিআরই প্রস্তুতি | ${brand.nameBn}`,
    descriptionEn:
      'Computer-adaptive GRE preparation with timed Quantitative and Verbal sections, analytical writing feedback, and FSRS-4.5 vocabulary mastery.',
    descriptionBn:
      'সময়-নির্ধারিত কোয়ান্টিটেটিভ ও ভার্বাল সেকশন, অ্যানালিটিক্যাল রাইটিং ফিডব্যাক এবং এফএসআরএস-৪.৫ ভোকাবুলারিসহ কম্পিউটার-অ্যাডাপ্টিভ জিআরই প্রস্তুতি।',
  });
}

export default async function GrePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: MarketingLocale = rawLocale === 'bn' ? 'bn' : 'en';
  const content = MARKETING_CONTENT[locale].gre;

  const tabs = content.tabs.map((tab, idx) => ({
    id: tab.id,
    label: tab.label,
    content:
      idx === content.tabs.length - 1 ? (
        <LiveGreWidget locale={locale} />
      ) : (
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
        tone="warm"
        frame="blocks"
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
      <Section tone="white" id="overview">
        <SideHeadingBlocks
          title={content.overview.title}
          intro={content.overview.intro}
          ctaLabel={content.overview.ctaLabel}
          ctaHref={content.overview.ctaHref}
          locale={locale}
          blocks={content.overview.blocks}
        />
      </Section>
      <Section tone="tint" id="structure-scoring">
        <Tabs id="sample" title={content.tabsTitle} tabs={tabs} />
      </Section>
      <Section tone="white" id="question-families">
        <MediaColumns
          title={content.sections.title}
          intro={content.sections.intro}
          columns={4}
          locale={locale}
          items={content.sections.items}
        />
      </Section>
      <Section tone="white" id="awa-rubric">
        <EditorialQuote
          quote={content.editorialQuote.quote}
          attribution={content.editorialQuote.attribution}
          tone={content.editorialQuote.tone}
        />
      </Section>
      {content.splitFeatures.map((feature, idx) => (
        <Section key={feature.title} id={idx === 0 ? 'vocab' : undefined} tone={idx % 2 === 0 ? 'tint' : 'white'}>
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
