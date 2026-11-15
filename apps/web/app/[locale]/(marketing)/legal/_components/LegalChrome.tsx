/** @purpose Client navigation tab bar and printable document header for the Claude Editorial Legal & Policy Hub */
'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { WorkspaceHeader } from '@/src/components/ui/WorkspacePrimitives';

interface LegalTab {
  href: string;
  labelEn: string;
  labelBn: string;
}

const LEGAL_TABS: LegalTab[] = [
  { href: '/legal/terms', labelEn: 'Terms of Service', labelBn: 'ব্যবহারের শর্তাবলি' },
  { href: '/legal/privacy', labelEn: 'Privacy Policy (PDPO 2025)', labelBn: 'গোপনীয়তা নীতি (PDPO ২০২৫)' },
  {
    href: '/legal/refund-policy',
    labelEn: 'Refund & Cancellation Policy',
    labelBn: 'রিফান্ড ও বাতিলকরণ নীতি',
  },
  {
    href: '/legal/grievance',
    labelEn: 'Grievance Redressal Officer',
    labelBn: 'অভিযোগ নিষ্পত্তি কর্মকর্তা',
  },
];

export function LegalTabBar({ locale }: { locale: string }) {
  const pathname = usePathname() || '';
  const isBn = locale === 'bn';

  return (
    <nav
      aria-label={isBn ? 'আইনি নথিপত্র নেভিগেশন' : 'Legal documents navigation'}
      className="flex flex-wrap gap-6 border-t border-[var(--hairline)] mt-8 pt-4"
    >
      {LEGAL_TABS.map((tab) => {
        const isActive = pathname === tab.href || pathname === `/bn${tab.href}`;
        return (
          <LocaleLink
            key={tab.href}
            locale={locale}
            href={tab.href}
            aria-current={isActive ? 'page' : undefined}
            className={
              isActive
                ? 'rounded-none border-b-2 border-[var(--brand)] text-[var(--brand-deep)] font-semibold pb-2 text-sm transition-colors'
                : 'rounded-none border-b-2 border-transparent text-[var(--text-secondary)] hover:text-[var(--brand-deep)] pb-2 text-sm transition-colors'
            }
          >
            {isBn ? tab.labelBn : tab.labelEn}
          </LocaleLink>
        );
      })}
    </nav>
  );
}

export function LegalDocumentHeader({
  title,
  subtitle,
  metaText = 'Effective Date: November 13, 2026',
  locale = 'en',
}: {
  title: string;
  subtitle?: string;
  metaText?: string;
  locale?: string;
}) {
  const isBn = locale === 'bn';
  return (
    <WorkspaceHeader
      title={title}
      subtitle={subtitle}
      metaText={metaText}
      primaryAction={{
        label: isBn ? 'অফিশিয়াল নীতি প্রিন্ট / সংরক্ষণ করুন (PDF)' : 'Print / Save Official Policy (PDF)',
        onClick: () => {
          if (typeof window !== 'undefined') {
            window.print();
          }
        },
      }}
    />
  );
}
