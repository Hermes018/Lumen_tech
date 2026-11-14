/** @purpose Institutional IELTS preparation page (/ielts) composed exclusively from closed UI primitives and bilingual marketing content */
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

export const metadata = {
  title: `IELTS Preparation | আইইএলটিএস প্রস্তুতি | ${brand.name}`,
  description:
    'Computer-delivered IELTS Academic and General Training preparation with Listening, Reading, Writing, and Speaking simulators.',
};

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
    content: <p>{tab.body}</p>,
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
          title={content.skills.title}
          intro={content.skills.intro}
          columns={4}
          locale={locale}
          items={content.skills.items}
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
