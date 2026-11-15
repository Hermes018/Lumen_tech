/** @purpose Role-isolated Certified Human Evaluator & Blind Checker Desk shell (/evaluator) in Claude Warm Parchment style */
'use client';

import React, { Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { brand } from '@lumen/config';
import { ClipboardCheck, FileSpreadsheet, Wallet } from 'lucide-react';
import { LumenSparkMotif } from '@/src/components/ui/primitives';
import { WorkspaceMobileSheet } from '@/src/components/ui/WorkspacePrimitives';
import { LocaleLink } from '../_components/LocaleLink';
import { LocaleSwitcher } from '../_components/LocaleSwitcher';

type EvaluatorNavTabId = 'queue' | 'workbench' | 'payouts';

interface EvaluatorNavItem {
  id: EvaluatorNavTabId;
  href: string;
  labelEn: string;
  labelBn: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

const EVALUATOR_NAV_ITEMS: EvaluatorNavItem[] = [
  {
    id: 'queue',
    href: '/evaluator?tab=queue',
    labelEn: 'Blind SLA Grading Queue',
    labelBn: 'ব্লাইন্ড এসএলএ গ্রেডিং কিউ',
    icon: FileSpreadsheet,
  },
  {
    id: 'workbench',
    href: '/evaluator?tab=workbench',
    labelEn: 'Blind Rubric Workbench',
    labelBn: 'ব্লাইন্ড রুব্রিক ওয়ার্কবেঞ্চ',
    icon: ClipboardCheck,
  },
  {
    id: 'payouts',
    href: '/evaluator?tab=payouts',
    labelEn: 'SLA & Piece-Rate Ledger',
    labelBn: 'এসএলএ ও পেআউট লেজার',
    icon: Wallet,
  },
];

function resolveActiveEvaluatorTab(rawTab: string | null): EvaluatorNavTabId {
  if (rawTab === 'workbench' || rawTab === 'payouts') {
    return rawTab;
  }
  return 'queue';
}

function EvaluatorSidebarNavInner({ isBn }: { isBn: boolean }) {
  const searchParams = useSearchParams();
  const activeTab = resolveActiveEvaluatorTab(searchParams?.get('tab') ?? null);

  return (
    <nav aria-label={isBn ? 'ইভ্যালুয়েটর মডিউল' : 'Evaluator modules'} className="space-y-1">
      <div className="px-3 pb-1 text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
        {isBn ? 'ব্লাইন্ড মূল্যায়ন ডেস্ক' : 'Blind Evaluation Desk'}
      </div>
      <div className="space-y-0.5">
        {EVALUATOR_NAV_ITEMS.map((item) => {
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

function EvaluatorSidebarNavFallback({ isBn }: { isBn: boolean }) {
  return (
    <nav aria-label={isBn ? 'ইভ্যালুয়েটর মডিউল' : 'Evaluator modules'} className="space-y-1">
      <div className="px-3 pb-1 text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
        {isBn ? 'ব্লাইন্ড মূল্যায়ন ডেস্ক' : 'Blind Evaluation Desk'}
      </div>
      <div className="space-y-0.5">
        {EVALUATOR_NAV_ITEMS.map((item, idx) => {
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

export default function EvaluatorLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const brandHeader = (
    <LocaleLink href="/evaluator" className="flex items-start gap-2.5 text-[var(--brand-deep)]">
      <span className="pt-1" aria-hidden="true">
        <LumenSparkMotif />
      </span>
      <span className="flex flex-col">
        <span className="text-base font-bold text-[var(--brand-deep)] leading-snug">
          {isBn ? brand.nameBn : brand.name}
        </span>
        <span className="text-xs text-[var(--text-muted)] leading-relaxed">
          {isBn ? 'সার্টিফাইড ইভ্যালুয়েটর ডেস্ক' : 'Certified Evaluator Desk'}
        </span>
      </span>
    </LocaleLink>
  );

  const navigationContent = (
    <Suspense fallback={<EvaluatorSidebarNavFallback isBn={isBn} />}>
      <EvaluatorSidebarNavInner isBn={isBn} />
    </Suspense>
  );

  const footerContent = (
    <div className="space-y-2.5">
      <div className="lumen-locale-light inline-flex items-center">
        <LocaleSwitcher />
      </div>
      <div className="text-xs font-medium text-[var(--text-secondary)] truncate">
        {isBn
          ? 'ভূমিকা: ব্লাইন্ড রুব্রিক ইভ্যালুয়েটর · জিরো-PII মোড'
          : 'Role: Blind Rubric Evaluator · Zero-PII Mode'}
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
        openLabel={isBn ? 'ইভ্যালুয়েটর মেনু খুলুন' : 'Open evaluator navigation'}
        closeLabel={isBn ? 'ইভ্যালুয়েটর মেনু বন্ধ করুন' : 'Close evaluator navigation'}
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
