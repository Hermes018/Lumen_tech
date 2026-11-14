/** @purpose Institutional GRE preparation page (/gre) composed exclusively from closed UI primitives and bilingual marketing content */
import { brand } from '@lumen/config';
import {
  Breadcrumb,
  CtaBand,
  HeroBand,
  MediaColumns,
  Section,
  SideHeadingBlocks,
  Tabs,
} from '@/src/components/ui/primitives';
import { MARKETING_CONTENT, type MarketingLocale } from '@/src/content/marketing';
import { LiveGreWidget } from './live-gre-widget';

export const metadata = {
  title: `GRE Preparation | জিআরই প্রস্তুতি | ${brand.name}`,
  description:
    'Computer-adaptive GRE preparation with timed Quantitative and Verbal sections, analytical writing feedback, and FSRS-4.5 vocabulary mastery.',
};

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
        <p>{tab.body}</p>
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
          title={content.overview.title}
          intro={content.overview.intro}
          ctaLabel={content.overview.ctaLabel}
          ctaHref={content.overview.ctaHref}
          locale={locale}
          blocks={content.overview.blocks}
        />
      </Section>
      <Section tone="tint">
        <Tabs tabs={tabs} />
      </Section>
      <Section tone="white">
        <MediaColumns
          title={content.sections.title}
          intro={content.sections.intro}
          columns={4}
          locale={locale}
          items={content.sections.items}
        />
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
