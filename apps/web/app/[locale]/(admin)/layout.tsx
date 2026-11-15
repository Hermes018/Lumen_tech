/** @purpose Dedicated role-isolated Institutional Admin Console shell (/admin) in Claude Warm Parchment style */
'use client';

import React, { Suspense, type ReactNode } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { brand } from '@lumen/config';
import {
  FileCheck2,
  Landmark,
  Lock,
  Receipt,
  ShieldCheck,
  SlidersHorizontal,
  Tag,
  Users,
} from 'lucide-react';
import { LumenSparkMotif } from '@/src/components/ui/primitives';
import { WorkspaceMobileSheet } from '@/src/components/ui/WorkspacePrimitives';
import { LocaleLink } from '../_components/LocaleLink';
import { LocaleSwitcher } from '../_components/LocaleSwitcher';

type AdminNavTabId = 'catalog' | 'promos' | 'orders' | 'cms' | 'scholars' | 'flags' | 'audit' | 'treasury';

interface AdminNavItem {
  id: AdminNavTabId;
  href: string;
  labelEn: string;
  labelBn: string;
  icon: React.ComponentType<{ className?: string; 'aria-hidden'?: boolean }>;
}

const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  {
    id: 'catalog',
    href: '/admin?tab=catalog',
    labelEn: 'Catalog, Pricing & Fees',
    labelBn: 'ক্যাটালগ, মূল্য ও ফি',
    icon: Receipt,
  },
  {
    id: 'promos',
    href: '/admin?tab=promos',
    labelEn: 'Promos & Scholarships',
    labelBn: 'প্রোমো ও স্কলারশিপ',
    icon: Tag,
  },
  {
    id: 'orders',
    href: '/admin?tab=orders',
    labelEn: 'Orders, VAT & Refunds',
    labelBn: 'অর্ডার, ভ্যাট ও রিফান্ড',
    icon: ShieldCheck,
  },
  {
    id: 'cms',
    href: '/admin?tab=cms',
    labelEn: 'CMS & Blind Moderation',
    labelBn: 'সিএমএস ও ব্লাইন্ড মডারেশন',
    icon: FileCheck2,
  },
  {
    id: 'scholars',
    href: '/admin?tab=scholars',
    labelEn: 'Scholar Directory (PII Masked)',
    labelBn: 'স্কলার ডিরেক্টরি (PII মাস্কড)',
    icon: Users,
  },
  {
    id: 'flags',
    href: '/admin?tab=flags',
    labelEn: 'Psychometrics & System Flags',
    labelBn: 'সাইকোমেট্রিক্স ও সিস্টেম ফ্ল্যাগ',
    icon: SlidersHorizontal,
  },
  {
    id: 'audit',
    href: '/admin?tab=audit',
    labelEn: 'Security Audit & JSON Backup',
    labelBn: 'নিরাপত্তা অডিট ও JSON ব্যাকআপ',
    icon: Lock,
  },
  {
    id: 'treasury',
    href: '/admin?tab=treasury',
    labelEn: 'Banking, Treasury & P&L',
    labelBn: 'ব্যাংকিং, ট্রেজারি ও লাভ-ক্ষতি',
    icon: Landmark,
  },
];

function resolveActiveAdminTab(rawTab: string | null): AdminNavTabId {
  if (
    rawTab === 'promos' ||
    rawTab === 'orders' ||
    rawTab === 'cms' ||
    rawTab === 'scholars' ||
    rawTab === 'flags' ||
    rawTab === 'audit' ||
    rawTab === 'treasury'
  ) {
    return rawTab;
  }
  if (rawTab === 'calibration') {
    return 'flags';
  }
  return 'catalog';
}

function AdminSidebarNavInner({ isBn }: { isBn: boolean }) {
  const searchParams = useSearchParams();
  const activeTab = resolveActiveAdminTab(searchParams?.get('tab') ?? null);

  return (
    <nav aria-label={isBn ? 'অ্যাডমিন মডিউল' : 'Institutional Admin modules'} className="space-y-1">
      <div className="px-3 pb-1 text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
        {isBn ? 'ইআরপি মডিউলসমূহ' : 'ERP Modules'}
      </div>
      <div className="space-y-0.5">
        {ADMIN_NAV_ITEMS.map((item) => {
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

function AdminSidebarNavFallback({ isBn }: { isBn: boolean }) {
  return (
    <nav aria-label={isBn ? 'অ্যাডমিন মডিউল' : 'Institutional Admin modules'} className="space-y-1">
      <div className="px-3 pb-1 text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
        {isBn ? 'ইআরপি মডিউলসমূহ' : 'ERP Modules'}
      </div>
      <div className="space-y-0.5">
        {ADMIN_NAV_ITEMS.map((item, idx) => {
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

export default function AdminLayout({ children }: { children: ReactNode }) {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const brandHeader = (
    <LocaleLink href="/admin" className="flex items-start gap-2.5 text-[var(--brand-deep)]">
      <span className="pt-1" aria-hidden="true">
        <LumenSparkMotif />
      </span>
      <span className="flex flex-col">
        <span className="text-base font-bold text-[var(--brand-deep)] leading-snug">
          {isBn ? brand.nameBn : brand.name}
        </span>
        <span className="text-xs text-[var(--text-muted)] leading-relaxed">
          {isBn ? 'প্রাতিষ্ঠানিক গভর্নেন্স ও ইআরপি' : 'Institutional Governance & ERP'}
        </span>
      </span>
    </LocaleLink>
  );

  const navigationContent = (
    <Suspense fallback={<AdminSidebarNavFallback isBn={isBn} />}>
      <AdminSidebarNavInner isBn={isBn} />
    </Suspense>
  );

  const footerContent = (
    <div className="space-y-2.5">
      <div className="lumen-locale-light inline-flex items-center">
        <LocaleSwitcher />
      </div>
      <div className="text-xs font-medium text-[var(--text-secondary)] truncate">
        {isBn
          ? 'ভূমিকা: প্রাতিষ্ঠানিক অ্যাডমিন (কঠোর বিচ্ছিন্নতা)'
          : 'Role: Institutional Admin (Strict Isolation)'}
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
      {/* Mobile Collapsible Parchment Navigation Sheet (<1024px) */}
      <WorkspaceMobileSheet
        brandHeader={brandHeader}
        navigation={navigationContent}
        footer={footerContent}
        openLabel={isBn ? 'অ্যাডমিন মেনু খুলুন' : 'Open admin navigation'}
        closeLabel={isBn ? 'অ্যাডমিন মেনু বন্ধ করুন' : 'Close admin navigation'}
      />

      {/* Desktop Warm Parchment Left Sidebar */}
      <aside className="hidden lg:flex lg:w-[252px] lg:shrink-0 lg:flex-col lg:h-screen lg:sticky lg:top-0 lg:overflow-hidden border-r border-[var(--hairline)] bg-[var(--bg-warm)]">
        <div className="shrink-0 px-5 pt-6 pb-4 border-b border-[var(--hairline)]">{brandHeader}</div>
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-5">{navigationContent}</div>
        <div className="shrink-0 border-t border-[var(--hairline)] bg-[var(--bg-warm)] px-5 py-4 space-y-2.5">
          {footerContent}
        </div>
      </aside>

      {/* Pearl / Bone Editorial Main Canvas */}
      <main className="min-w-0 flex-1 bg-[var(--bg)]">{children}</main>
    </div>
  );
}
