/** @purpose Institutional courses directory (/courses) composed exclusively from closed UI primitives and bilingual marketing content */
import type { Metadata } from 'next';
import { brand } from '@lumen/config';
import { buildLocalizedMetadata } from '@/src/lib/seo';
import {
  Breadcrumb,
  CtaBand,
  Disclosure,
  Heading,
  HeroBand,
  MediaColumns,
  Section,
  Tabs,
  type MediaColumnsItem,
} from '@/src/components/ui/primitives';
import {
  MARKETING_CONTENT,
  type CourseItem,
  type MarketingLocale,
} from '@/src/content/marketing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    pathname: '/courses',
    titleEn: `Courses & Curriculum | ${brand.name}`,
    titleBn: `কোর্স ও পাঠ্যক্রম | ${brand.nameBn}`,
    descriptionEn:
      'Explore structured GRE and IELTS preparation programs with section-adaptive mock tests, FSRS-4.5 vocabulary systems, and transparent VAT-inclusive pricing.',
    descriptionBn:
      'সেকশন-অ্যাডাপ্টিভ মক টেস্ট, এফএসআরএস-৪.৫ ভোকাবুলারি এবং স্বচ্ছ ভ্যাট-সহ মূল্যে কাঠামোবদ্ধ জিআরই ও আইইএলটিএস প্রস্তুতি কোর্সসমূহ দেখুন।',
  });
}

function toMediaColumnItem(course: CourseItem): MediaColumnsItem {
  return {
    photoSlot: course.photoSlot,
    accentColor: course.accentColor,
    title: course.title,
    href: course.href,
    meta: course.price,
    body: course.forWhom,
    disclosureTitle: course.syllabusTitle,
    disclosureItems: course.syllabusModules,
  };
}

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale: MarketingLocale = rawLocale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';
  const c = MARKETING_CONTENT[locale].courses;

  const tabs = c.filterTabs.map((tab) => {
    const filtered =
      tab.id === 'all'
        ? c.items
        : c.items.filter(
            (item) => item.category === tab.id || item.mode === tab.id
          );

    return {
      id: tab.id,
      label: tab.label,
      content: (
        <MediaColumns
          title={c.catalogTitle}
          intro={c.catalogIntro}
          columns={3}
          locale={locale}
          items={filtered.map((course) => toMediaColumnItem(course))}
        />
      ),
    };
  });

  const guideSummary = isBn
    ? 'আপনার প্রস্তুতির ট্র্যাক বেছে নিন — GRE বনাম IELTS: আপনার কোন পরীক্ষাটি প্রয়োজন?'
    : 'GRE vs. IELTS: Which exam do you need?';

  const guideItems = isBn
    ? [
        'GRE® General Test: যুক্তরাষ্ট্র, কানাডা ও ইউরোপের MS, PhD এবং STEM গ্র্যাজুয়েট প্রোগ্রামে ভর্তির জন্য।',
        'IELTS Academic: যুক্তরাজ্য, অস্ট্রেলিয়া, কানাডা ও ইউরোপের বিশ্ববিদ্যালয়ে ইংরেজি দক্ষতার প্রমাণের জন্য।',
        'IELTS General Training: কানাডা, অস্ট্রেলিয়া ও যুক্তরাজ্যে অভিবাসন ও পেশাগত ভিসার জন্য।',
        'অনেক শিক্ষার্থী উভয় পরীক্ষাই দেন—ভর্তির জন্য GRE এবং ভিসা/বিশ্ববিদ্যালয়ের শর্ত পূরণের জন্য IELTS। অল-অ্যাক্সেস পাস দিয়ে উভয় ট্র্যাকই একসাথে অ্যাক্সেস করা যায়।',
      ]
    : [
        'GRE® General Test: Required for MS, PhD, and STEM graduate admissions in the US, Canada, and Europe.',
        'IELTS Academic: Required to prove English proficiency for university admissions in the UK, Australia, Canada, and Europe.',
        'IELTS General Training: Required for skilled migration and work visas in Canada, Australia, and the UK.',
        'Many applicants take both—GRE for graduate department admission and IELTS to satisfy university or visa language requirements.',
      ];

  return (
    <>
      <Breadcrumb
        locale={locale}
        items={[
          { label: isBn ? 'হোম' : 'Home', href: '/' },
          { label: c.breadcrumbLabel },
        ]}
      />

      <HeroBand
        title={c.hero.title}
        body={c.hero.body}
        ctaLabel={c.hero.ctaLabel}
        ctaHref={c.hero.ctaHref}
        photoSlot={c.hero.photoSlot}
        locale={locale}
      />

      <Section tone="white" id="catalog">
        <Tabs tabs={tabs} />
      </Section>

      <Section tone="tint">
        <Heading level={2}>{guideSummary}</Heading>
        <Disclosure summary={guideSummary}>
          <ul>
            {guideItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </Disclosure>
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
