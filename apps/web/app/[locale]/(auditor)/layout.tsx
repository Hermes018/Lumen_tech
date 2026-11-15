/** @purpose Role-isolated Psychometric, Rubric & Compliance Auditor Console shell (/auditor) in Claude Warm Parchment style */
'use client';

import React, { Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { brand } from '@lumen/config';
import { CheckSquare, FileSearch, ShieldAlert } from 'lucide-react';
import { LumenSparkMotif } from '@/src/components/ui/primitives';
import { WorkspaceMobileSheet } from '@/src/components/ui/WorkspacePrimitives';
import { LocaleLink } from '../_components/LocaleLink';
import { LocaleSwitcher } from '../_components/LocaleSwitcher';

type AuditorNavTabId = 'irr' | 'item-qa' | 'compliance';

interface AuditorNavItem {
  id: AuditorNavTabId;
  href: string;
  labelEn: string;
  labelBn: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

const AUDITOR_NAV_ITEMS: AuditorNavItem[] = [
  {
    id: 'irr',
    href: '/auditor?tab=irr',
    labelEn: 'IRR & Drift Adjudication',
    labelBn: 'আইআরআর ও ড্রিফট নিষ্পত্তি',
    icon: ShieldAlert,
  },
  {
    id: 'item-qa',
    href: '/auditor?tab=item-qa',
    labelEn: 'Item-Bank Psychometric QA',
    labelBn: 'আইটেম-ব্যাংক সাইকোমেট্রিক কিউএ',
    icon: CheckSquare,
  },
  {
    id: 'compliance',
    href: '/auditor?tab=compliance',
    labelEn: 'Immutable Compliance Audit',
    labelBn: 'অপরিবর্তনীয় কমপ্লায়েন্স অডিট',
    icon: FileSearch,
  },
];

function resolveActiveAuditorTab(rawTab: string | null): AuditorNavTabId {
  if (rawTab === 'item-qa' || rawTab === 'compliance') {
    return rawTab;
  }
  return 'irr';
}

function AuditorSidebarNavInner({ isBn }: { isBn: boolean }) {
  const searchParams = useSearchParams();
  const activeTab = resolveActiveAuditorTab(searchParams?.get('tab') ?? null);

  return (
    <nav aria-label={isBn ? 'অডিটর মডিউল' : 'Auditor modules'} className="space-y-1">
      <div className="px-3 pb-1 text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
        {isBn ? 'সাইকোমেট্রিক ও কিউএ অডিট' : 'Psychometric & QA Audit'}
      </div>
      <div className="space-y-0.5">
        {AUDITOR_NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <LocaleLink
              key={item.id}
              href={item.href}
              aria-current={isActive ? 'page' : undefined}
              className={
                isActive
                  ? 'flex items-center gap-2.5 bg-[var(--surface-paper)] text-[var(--brand-deep)] font-semibold border-l-[3px] border-[var(--brand)] px-3 py-2.5 text-sm leading-relaxed rounded-none'
                  : 'flex items-center gap-2.5 text-[var(--text)] hover:text-[var(--brand-deep)] hover:bg-[var(--surface-paper)]/50 px-3 py-2.5 text-sm leading-relaxed transition-colors rounded-none'
              }
            >
              <Icon className="h-4 w-4 shrink-0 text-[var(--brand)]" aria-hidden={true} />
              <span>{isBn ? item.labelBn : item.labelEn}</span>
            </LocaleLink>
          );
        })}
      </div>
    </nav>
  );
}

function AuditorSidebarNavFallback({ isBn }: { isBn: boolean }) {
  return (
    <nav aria-label={isBn ? 'অডিটর মডিউল' : 'Auditor modules'} className="space-y-1">
      <div className="px-3 pb-1 text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
        {isBn ? 'সাইকোমেট্রিক ও কিউএ অডিট' : 'Psychometric & QA Audit'}
      </div>
      <div className="space-y-0.5">
        {AUDITOR_NAV_ITEMS.map((item, idx) => {
          const Icon = item.icon;
          const isActive = idx === 0;
          return (
            <LocaleLink
              key={item.id}
              href={item.href}
              className={
                isActive
                  ? 'flex items-center gap-2.5 bg-[var(--surface-paper)] text-[var(--brand-deep)] font-semibold border-l-[3px] border-[var(--brand)] px-3 py-2.5 text-sm leading-relaxed rounded-none'
                  : 'flex items-center gap-2.5 text-[var(--text)] hover:text-[var(--brand-deep)] hover:bg-[var(--surface-paper)]/50 px-3 py-2.5 text-sm leading-relaxed transition-colors rounded-none'
              }
            >
              <Icon className="h-4 w-4 shrink-0 text-[var(--brand)]" aria-hidden={true} />
              <span>{isBn ? item.labelBn : item.labelEn}</span>
            </LocaleLink>
          );
        })}
      </div>
    </nav>
  );
}

export default function AuditorLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const brandHeader = (
    <LocaleLink href="/auditor" className="flex items-start gap-2.5 text-[var(--brand-deep)]">
      <span className="pt-1" aria-hidden="true">
        <LumenSparkMotif />
      </span>
      <span className="flex flex-col">
        <span className="text-base font-bold text-[var(--brand-deep)] leading-snug">
          {isBn ? brand.nameBn : brand.name}
        </span>
        <span className="text-xs text-[var(--text-muted)] leading-relaxed">
          {isBn ? 'সাইকোমেট্রিক ও কমপ্লায়েন্স অডিট' : 'Psychometric & Compliance Audit'}
        </span>
      </span>
    </LocaleLink>
  );

  const navigationContent = (
    <Suspense fallback={<AuditorSidebarNavFallback isBn={isBn} />}>
      <AuditorSidebarNavInner isBn={isBn} />
    </Suspense>
  );

  const footerContent = (
    <div className="space-y-3">
      <div className="lumen-locale-light inline-flex items-center">
        <LocaleSwitcher />
      </div>
      <div className="text-xs font-medium text-[var(--brand-deep)] leading-relaxed">
        {isBn ? 'ভূমিকা: ইন্ডিপেনডেন্ট কিউএ অডিটর' : 'Role: Independent QA Auditor'}
      </div>
      <div>
        <LocaleLink
          href="/sign-in"
          className="text-xs font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
        >
          {isBn ? 'ভূমিকা পরিবর্তন / সাইন আউট' : 'Switch Role / Sign out'}
        </LocaleLink>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[var(--bg)] text-[var(--text)]">
      <WorkspaceMobileSheet
        brandHeader={brandHeader}
        navigation={navigationContent}
        footer={footerContent}
        openLabel={isBn ? 'অডিটর মেনু খুলুন' : 'Open auditor navigation'}
        closeLabel={isBn ? 'অডিটর মেনু বন্ধ করুন' : 'Close auditor navigation'}
      />

      <aside className="hidden lg:flex w-full lg:w-[256px] shrink-0 bg-[var(--bg-warm)] border-b lg:border-b-0 lg:border-r border-[var(--hairline)] flex-col justify-between">
        <div className="px-4 py-6 space-y-7">
          <div className="px-2 pb-4 border-b border-[var(--hairline)]">{brandHeader}</div>
          {navigationContent}
        </div>
        <div className="border-t border-[var(--hairline)] px-5 py-5">{footerContent}</div>
      </aside>

      <main className="min-w-0 flex-1 bg-[var(--bg)]">{children}</main>
    </div>
  );
}
