/** @purpose Role-isolated Faculty & Cohort Instructor Teaching Studio shell (/instructor) in Claude Warm Parchment style */
'use client';

import React, { Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { brand } from '@lumen/config';
import { BarChart3, BookOpenCheck, CalendarDays, MessageSquareText } from 'lucide-react';
import { LumenSparkMotif } from '@/src/components/ui/primitives';
import { WorkspaceMobileSheet } from '@/src/components/ui/WorkspacePrimitives';
import { LocaleLink } from '../_components/LocaleLink';
import { LocaleSwitcher } from '../_components/LocaleSwitcher';

type InstructorNavTabId = 'cohorts' | 'telemetry' | 'authoring' | 'doubts';

interface InstructorNavItem {
  id: InstructorNavTabId;
  href: string;
  labelEn: string;
  labelBn: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

const INSTRUCTOR_NAV_ITEMS: InstructorNavItem[] = [
  {
    id: 'cohorts',
    href: '/instructor?tab=cohorts',
    labelEn: 'Live Cohort Schedule',
    labelBn: 'লাইভ কোহর্ট শিডিউল',
    icon: CalendarDays,
  },
  {
    id: 'telemetry',
    href: '/instructor?tab=telemetry',
    labelEn: 'Cohort Weakness Telemetry',
    labelBn: 'কোহর্ট দুর্বলতা টেলিমেট্রি',
    icon: BarChart3,
  },
  {
    id: 'authoring',
    href: '/instructor?tab=authoring',
    labelEn: 'Item & Hint Authoring',
    labelBn: 'আইটেম ও হিন্ট অথরিং',
    icon: BookOpenCheck,
  },
  {
    id: 'doubts',
    href: '/instructor?tab=doubts',
    labelEn: 'Academic Doubt Escalations',
    labelBn: 'একাডেমিক ডাউট সমাধান',
    icon: MessageSquareText,
  },
];

function resolveActiveInstructorTab(rawTab: string | null): InstructorNavTabId {
  if (rawTab === 'telemetry' || rawTab === 'authoring' || rawTab === 'doubts') {
    return rawTab;
  }
  return 'cohorts';
}

function InstructorSidebarNavInner({ isBn }: { isBn: boolean }) {
  const searchParams = useSearchParams();
  const activeTab = resolveActiveInstructorTab(searchParams?.get('tab') ?? null);

  return (
    <nav aria-label={isBn ? 'ইন্সট্রাক্টর মডিউল' : 'Instructor modules'} className="space-y-1">
      <div className="px-3 pb-1 text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
        {isBn ? 'ফ্যাকাল্টি স্টুডিও' : 'Faculty Studio'}
      </div>
      <div className="space-y-0.5">
        {INSTRUCTOR_NAV_ITEMS.map((item) => {
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

function InstructorSidebarNavFallback({ isBn }: { isBn: boolean }) {
  return (
    <nav aria-label={isBn ? 'ইন্সট্রাক্টর মডিউল' : 'Instructor modules'} className="space-y-1">
      <div className="px-3 pb-1 text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
        {isBn ? 'ফ্যাকাল্টি স্টুডিও' : 'Faculty Studio'}
      </div>
      <div className="space-y-0.5">
        {INSTRUCTOR_NAV_ITEMS.map((item, idx) => {
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

export default function InstructorLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const brandHeader = (
    <LocaleLink href="/instructor" className="flex items-start gap-2.5 text-[var(--brand-deep)]">
      <span className="pt-1" aria-hidden="true">
        <LumenSparkMotif />
      </span>
      <span className="flex flex-col">
        <span className="text-base font-bold text-[var(--brand-deep)] leading-snug">
          {isBn ? brand.nameBn : brand.name}
        </span>
        <span className="text-xs text-[var(--text-muted)] leading-relaxed">
          {isBn ? 'ফ্যাকাল্টি টিচিং স্টুডিও' : 'Faculty Teaching Studio'}
        </span>
      </span>
    </LocaleLink>
  );

  const navigationContent = (
    <Suspense fallback={<InstructorSidebarNavFallback isBn={isBn} />}>
      <InstructorSidebarNavInner isBn={isBn} />
    </Suspense>
  );

  const footerContent = (
    <div className="space-y-2.5">
      <div className="lumen-locale-light inline-flex items-center">
        <LocaleSwitcher />
      </div>
      <div className="text-xs font-medium text-[var(--text-secondary)] truncate">
        {isBn ? 'ভূমিকা: লিড কোহর্ট ইন্সট্রাক্টর' : 'Role: Lead Cohort Instructor'}
      </div>
      <div>
        <LocaleLink
          href="/sign-in"
          className="inline-block text-xs font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)]"
        >
          {isBn ? 'ভূমিকা পরিবর্তন / সাইন আউট →' : 'Switch Role / Sign out →'}
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
        openLabel={isBn ? 'ইন্সট্রাক্টর মেনু খুলুন' : 'Open instructor navigation'}
        closeLabel={isBn ? 'ইন্সট্রাক্টর মেনু বন্ধ করুন' : 'Close instructor navigation'}
      />

      <aside className="hidden lg:flex lg:w-[252px] lg:shrink-0 lg:flex-col lg:h-screen lg:sticky lg:top-0 lg:overflow-hidden border-r border-[var(--hairline)] bg-[var(--bg-warm)]">
        <div className="shrink-0 px-5 pt-6 pb-4 border-b border-[var(--hairline)]">{brandHeader}</div>
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">{navigationContent}</div>
        <div className="shrink-0 border-t border-[var(--hairline)] bg-[var(--bg-warm)] px-5 py-4 space-y-2.5">
          {footerContent}
        </div>
      </aside>

      <main className="min-w-0 flex-1 bg-[var(--bg)]">{children}</main>
    </div>
  );
}
