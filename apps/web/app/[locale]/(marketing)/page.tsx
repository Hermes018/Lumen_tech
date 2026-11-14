/** @purpose Institutional Swiss-grid homepage composed exclusively from closed UI primitives and bilingual marketing content */
import { getLocale } from 'next-intl/server';
import {
  CtaBand,
  HeroBand,
  MediaColumns,
  Section,
  SplitFeature,
  StatRow,
  StepRow,
  SubBar,
} from '@/src/components/ui/primitives';
import { MARKETING_CONTENT, type MarketingLocale } from '@/src/content/marketing';

export default async function MarketingPage({
  params,
}: {
  params?: Promise<{ locale?: string }>;
} = {}) {
  const resolvedParams = params ? await params : undefined;
  const rawLocale = resolvedParams?.locale ?? (await getLocale());
  const locale: MarketingLocale = rawLocale === 'bn' ? 'bn' : 'en';
  const c = MARKETING_CONTENT[locale].home;

  return (
    <>
      <HeroBand
        title={c.hero.title}
        body={c.hero.body}
        ctaLabel={c.hero.ctaLabel}
        ctaHref={c.hero.ctaHref}
        photoSlot={c.hero.photoSlot}
        locale={locale}
      />
      <SubBar locale={locale} items={c.subBar} />

      <Section tone="white">
        <StatRow stats={c.stats} />
      </Section>

      <Section tone="white">
        <StepRow
          title={c.howItWorks.title}
          intro={c.howItWorks.intro}
          locale={locale}
          steps={c.howItWorks.steps}
        />
      </Section>

      <Section tone="tint">
        <MediaColumns
          title={c.examTracks.title}
          intro={c.examTracks.intro}
          columns={3}
          locale={locale}
          items={c.examTracks.items}
        />
      </Section>

      <Section tone="white">
        <MediaColumns
          title={c.destinations.title}
          intro={c.destinations.intro}
          columns={4}
          locale={locale}
          items={c.destinations.items}
        />
      </Section>

      <Section tone="white">
        <SplitFeature
          photoSlot={c.diagnosticFeature.photoSlot}
          title={c.diagnosticFeature.title}
          body={c.diagnosticFeature.body}
          ctaLabel={c.diagnosticFeature.ctaLabel}
          ctaHref={c.diagnosticFeature.ctaHref}
          locale={locale}
        />
      </Section>

      <CtaBand
        title={c.ctaBand.title}
        body={c.ctaBand.body}
        ctaLabel={c.ctaBand.ctaLabel}
        ctaHref={c.ctaBand.ctaHref}
        locale={locale}
      />
    </>
  );
}
