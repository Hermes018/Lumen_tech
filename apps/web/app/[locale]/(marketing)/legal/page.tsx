/** @purpose Legal directory index page in the Claude Editorial Design Language */
import React from 'react';
import { brand } from '@lumen/config';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { WorkspaceFocusSheet } from '@/src/components/ui/WorkspacePrimitives';
import { LegalDocumentHeader } from './_components/LegalChrome';

export default async function LegalIndexPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = rawLocale === 'bn' ? 'bn' : 'en';
  const isBn = locale === 'bn';

  const documents = [
    {
      num: '01',
      title: isBn ? 'ব্যবহারের শর্তাবলি' : 'Terms of Service',
      meta: isBn ? 'কার্যকর: ১৩ নভেম্বর ২০২৬' : 'Effective: November 13, 2026',
      description: isBn
        ? 'প্ল্যাটফর্মের নিয়মাবলি, অ্যাকাউন্ট নিরাপত্তা, মেধাস্বত্ব, পরীক্ষার অনুশীলন ডিসক্লেইমার এবং বিরোধ নিষ্পত্তি।'
        : 'Platform rules, account responsibilities, intellectual property, test practice disclaimers, and dispute resolution.',
      href: '/legal/terms',
    },
    {
      num: '02',
      title: isBn ? 'গোপনীয়তা নীতি (বাংলাদেশ PDPO ২০২৫)' : 'Privacy Policy & Bangladesh PDPO 2025',
      meta: isBn ? 'PDPO ২০২৫ সম্মত' : 'PDPO 2025 Compliant',
      description: isBn
        ? 'অপ্রাপ্তবয়স্ক সুরক্ষা, ১৮ বছরের নিচে অভিভাবকের সম্মতি, বিজ্ঞাপন প্রোফাইলিং নিষিদ্ধ এবং স্বচ্ছ তথ্য প্রক্রিয়াকরণ।'
        : 'Strict minor safeguarding, parental guardian consent under 18, zero ad profiling of youth, and transparent data processing.',
      href: '/legal/privacy',
    },
    {
      num: '03',
      title: isBn ? 'রিফান্ড ও বাতিলকরণ নীতি' : 'Refund & Cancellation Policy',
      meta: isBn ? 'D12 C13b ও D5 প্রামাণ্য নীতি' : 'D12 C13b & D5 Authoritative',
      description: isBn
        ? '৭ দিনের রিফান্ড নিশ্চয়তা, ২০%-এর কম ব্যবহারের সীমা, ১টি মক সীমা, ব্যবহৃত এআই ক্রেডিট কর্তন এবং সার্টিফিকেট বাতিল।'
        : '7-day guarantee, < 20% consumption ceiling, 1-mock limit, non-refundable AI credit deductions, and certificate revocations.',
      href: '/legal/refund-policy',
    },
    {
      num: '04',
      title: isBn ? 'অভিযোগ নিষ্পত্তি কর্মকর্তা ও বিরোধ সমাধান' : 'Grievance Redressal Officer',
      meta: isBn ? '৩-স্তরের SLA কাঠামো' : '3-Tier SLA Framework',
      description: isBn
        ? 'বাংলাদেশ ডিজিটাল কমার্স নির্দেশিকা অনুযায়ী মনোনীত কর্মকর্তা, অভিযোগ দায়েরের প্রক্রিয়া এবং নির্ধারিত সমাধান সময়সীমা।'
        : 'Designated statutory officer, formal escalation channels, and binding response SLAs under Bangladesh Digital Commerce Guidelines.',
      href: '/legal/grievance',
    },
  ];

  return (
    <article>
      <LegalDocumentHeader
        title={isBn ? `${brand.nameBn} আইনি ও নীতিমালা নির্দেশিকা` : `${brand.name} Legal Directory`}
        subtitle={
          isBn
            ? 'আমাদের শিক্ষা প্ল্যাটফর্মের বাধ্যতামূলক আইনি কাঠামো, শিক্ষার্থীর অধিকার এবং গোপনীয়তা অনুশীলন পর্যালোচনা করুন।'
            : 'Review our binding legal frameworks, student rights, and privacy practices governing our education platform.'
        }
        metaText="Effective Date: November 13, 2026"
        locale={locale}
      />

      <WorkspaceFocusSheet
        title={isBn ? 'বিধিবদ্ধ স্বচ্ছতা ও মূসক ৬.৩ সম্মতি' : 'Statutory Transparency & Mushak 6.3 Compliance'}
        body={
          isBn
            ? 'সকল দেশীয় লেনদেনে বাংলাদেশ মূল্য সংযোজন কর আইন অনুযায়ী ১৫% ভ্যাট ও মূসক ৬.৩ চালান অন্তর্ভুক্ত থাকে। কোনো ধরনের অস্পষ্ট শর্তাবলি বা লুকানো ফি নেই।'
            : 'All domestic transactions include statutory 15% Bangladesh VAT and an official Mushak 6.3 invoice. Every policy below is written in plain language and enforced by automated server-side rules.'
        }
        primaryAction={{
          label: isBn ? 'ব্যবহারের শর্তাবলি পড়ুন' : 'Read Terms of Service',
          href: '/legal/terms',
        }}
        secondaryAction={{
          label: isBn ? 'সহায়তা কেন্দ্রে যান' : 'Visit Help Center',
          href: '/help',
        }}
      />

      <div className="divide-y divide-[var(--hairline)] border-t border-b border-[var(--hairline)]">
        {documents.map((doc) => (
          <div
            key={doc.href}
            className="py-6 flex flex-col sm:flex-row sm:items-baseline justify-between gap-4"
          >
            <div className="space-y-1.5 max-w-[72ch]">
              <div className="flex items-baseline gap-3">
                <span className="text-xs font-mono text-[var(--text-muted)]">{doc.num}</span>
                <h2 className="text-lg font-bold text-[var(--brand-deep)]">{doc.title}</h2>
                <span className="text-xs text-[var(--text-muted)]">· {doc.meta}</span>
              </div>
              <p className="text-sm text-[var(--text-primary)] leading-relaxed">{doc.description}</p>
            </div>
            <LocaleLink
              locale={locale}
              href={doc.href}
              className="shrink-0 text-sm font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)]"
            >
              {isBn ? 'নথি পড়ুন' : 'Read document'}
            </LocaleLink>
          </div>
        ))}
      </div>
    </article>
  );
}
