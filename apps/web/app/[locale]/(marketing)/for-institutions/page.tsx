/** @purpose Institutional partnerships, bulk seat licensing, and campus cohort analytics page using closed primitives */
import type { Metadata } from 'next';
import React from 'react';
import { brand } from '@lumen/config';
import { buildLocalizedMetadata } from '@/src/lib/seo';
import {
  Breadcrumb,
  HeroBand,
  StatRow,
  SideHeadingBlocks,
  Section,
  Heading,
  CtaBand,
} from '@/src/components/ui/primitives';
import { InstitutionalInquiryForm } from './institutional-inquiry-form';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return buildLocalizedMetadata({
    locale,
    pathname: '/for-institutions',
    titleEn: `For Universities & Institutions | ${brand.name}`,
    titleBn: `বিশ্ববিদ্যালয় ও প্রতিষ্ঠানের জন্য | ${brand.nameBn}`,
    descriptionEn: `Partner with ${brand.name} for bulk seat licensing, standardized GRE/IELTS diagnostics, and campus cohort analytics in Bangladesh.`,
    descriptionBn: `বাংলাদেশে বাল্ক সিট লাইসেন্সিং, স্ট্যান্ডার্ডাইজড জিআরই/আইইএলটিএস ডায়াগনস্টিক এবং ক্যাম্পাস কোহর্ট অ্যানালিটিক্সের জন্য ${brand.nameBn}-র সাথে যুক্ত হোন।`,
  });
}

export default async function ForInstitutionsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';
  const brandDisplayName = isBn ? 'লুমেন একাডেমি' : brand.name;

  return (
    <main>
      <Breadcrumb
        locale={locale}
        items={[
          { label: isBn ? 'হোম' : 'Home', href: '/' },
          { label: isBn ? 'বিশ্ববিদ্যালয় ও প্রতিষ্ঠান' : 'For Institutions' },
        ]}
      />

      <HeroBand
        locale={locale}
        tone="brand"
        title={
          isBn
            ? 'আপনার প্রতিষ্ঠানের শিক্ষার্থীদের বৈশ্বিক স্কলারশিপের জন্য প্রস্তুত করুন'
            : 'Equip Your Entire Student Body for Global Scholarships'
        }
        body={
          isBn
            ? `প্রাতিষ্ঠানিক পার্টনারশিপ ও ক্যাম্পাস কোহর্ট: বাংলাদেশের বিশ্ববিদ্যালয় ও কলেজগুলো বাল্ক সিট লাইসেন্সিং এবং কোহর্ট অ্যানালিটিক্সের জন্য ${brandDisplayName}-এর সাথে কাজ করে।`
            : `Universities and colleges across Bangladesh partner with ${brand.name} for bulk seat licensing, campus-wide diagnostics, and cohort analytics.`
        }
        ctaLabel={isBn ? 'প্রস্তাবনার অনুরোধ করুন' : 'Request Institutional Proposal'}
        ctaHref="#inquiry"
        secondaryLinkLabel={isBn ? 'মক টেস্ট সিমুলেটর দেখুন' : 'Preview Exam Simulator'}
        secondaryLinkHref="/exam/diagnostic"
        photoSlot="hero-courses"
      />

      <Section tone="white">
        <StatRow
          stats={[
            {
              value: '15%',
              caption: isBn
                ? 'মূসক-৬.৩ ভ্যাট চালান — সরকারি ও বেসরকারি বিশ্ববিদ্যালয়ের ক্রয়নীতির উপযোগী'
                : 'Mushak-6.3 VAT compliant invoicing for institutional procurement',
              verified: true,
            },
            {
              value: 'CSV',
              caption: isBn
                ? 'তাৎক্ষণিক রোস্টার অনবোর্ডিং — এক ক্লিকে শত শত শিক্ষার্থীর আসন বরাদ্দ'
                : 'Instant roster onboarding — provision entire cohorts in one upload',
              verified: true,
            },
            {
              value: 'IRT',
              caption: isBn
                ? 'ক্যালিব্রেটেড ডায়াগনস্টিক — প্রথম দিনেই স্কলারশিপ-যোগ্য শিক্ষার্থীদের শনাক্ত করুন'
                : 'Calibrated diagnostics to identify scholarship-ready cohorts early',
              verified: true,
            },
          ]}
        />
      </Section>

      <Section tone="warm">
        <SideHeadingBlocks
          locale={locale}
          title={
            isBn
              ? `কেন শিক্ষা প্রতিষ্ঠানগুলো ${brandDisplayName} বেছে নেয়`
              : `Why Academic Institutions Choose ${brand.name}`
          }
          intro={
            isBn
              ? 'আপনার ক্যারিয়ার সেন্টার ও উচ্চশিক্ষা সেলের জন্য নির্ভরযোগ্য প্রাতিষ্ঠানিক অবকাঠামো।'
              : 'Enterprise reliability for your career center, study-abroad cell, or academic department.'
          }
          blocks={[
            {
              icon: 'currency',
              title: isBn ? 'বাল্ক সিট লাইসেন্সিং ও মূসক-৬.৩' : 'Bulk Seat Licensing & Mushak-6.3',
              body: isBn
                ? 'বিভাগীয় ক্রয়ের জন্য ভ্যাট-সম্মত প্রাতিষ্ঠানিক চালানসহ বিশেষ ভলিউম ডিসকাউন্ট।'
                : 'Volume discounted seat packs with tax-compliant Mushak-6.3 VAT invoicing.',
            },
            {
              icon: 'check',
              title: isBn ? 'কোহর্ট অ্যানালিটিক্স ড্যাশবোর্ড' : 'Org Admin Cohort Analytics',
              body: isBn
                ? 'শিক্ষার্থীদের অধ্যয়নের সময়, মক সম্পন্নতার হার এবং সম্ভাব্য স্কোর ট্র্যাক করুন।'
                : 'Track study hours, mock completion rates, and predicted GRE/IELTS bands.',
            },
            {
              icon: 'shield',
              title: isBn ? 'প্রক্টরড ডায়াগনস্টিক মূল্যায়ন' : 'Proctored Baseline Diagnostics',
              body: isBn
                ? 'ক্যালিব্রেটেড কম্পিউটার-ভিত্তিক টেস্ট ইঞ্জিনের মাধ্যমে ক্যাম্পাস-ব্যাপী স্ক্রিনিং।'
                : 'Run campus-wide scholarship aptitude screenings on our calibrated CBT engine.',
            },
          ]}
        />
      </Section>

      <Section tone="white" id="inquiry">
        <Heading level={2}>
          {isBn ? 'প্রাতিষ্ঠানিক লাইসেন্সিংয়ের জন্য যোগাযোগ করুন' : 'Request Institutional Seat Licensing'}
        </Heading>
        <InstitutionalInquiryForm locale={locale} />
      </Section>

      <CtaBand
        locale={locale}
        title={isBn ? 'প্ল্যাটফর্মটি নিজেই পরীক্ষা করে দেখতে চান?' : 'Want to test the exam engine first?'}
        body={
          isBn
            ? 'কোনো সাইন-ইন ছাড়াই ১৫ মিনিটের অ্যাডাপটিভ জিআরই ডায়াগনস্টিক চালিয়ে দেখুন।'
            : 'Launch our 15-minute adaptive GRE diagnostic with zero sign-in required.'
        }
        ctaLabel={isBn ? 'ডায়াগনস্টিক শুরু করুন' : 'Launch Free Diagnostic'}
        ctaHref="/exam/diagnostic"
      />
    </main>
  );
}
