/** @purpose Claude-style Warm Parchment Scholar Workspace shell with dedicated GRE/IELTS left-rail tabs and strict role isolation */
import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import { brand } from '@lumen/config';
import {
  LayoutDashboard,
  Calendar,
  BookOpenCheck,
  LineChart,
  GraduationCap,
  Keyboard,
  Languages,
  Layers,
  Receipt,
  ShieldCheck,
} from 'lucide-react';
import { LumenSparkMotif } from '@/src/components/ui/primitives';
import {
  WorkspaceMobileSheet,
  WorkspaceNavLink,
} from '@/src/components/ui/WorkspacePrimitives';
import { LocaleLink } from '../_components/LocaleLink';
import { LocaleSwitcher } from '../_components/LocaleSwitcher';

export const dynamic = 'force-dynamic';

export default async function LearnerLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const isBn = locale === 'bn';

  const navGroups = [
    {
      title: isBn ? 'স্টাডি ডেস্ক' : 'Study Desk',
      items: [
        {
          href: '/app',
          exact: true,
          label: isBn ? 'ওভারভিউ' : 'Overview',
          icon: LayoutDashboard,
        },
        {
          href: '/app/plan',
          label: isBn ? 'স্টাডি শিডিউল' : 'Study Schedule',
          icon: Calendar,
        },
        {
          href: '/app/mistakes',
          label: isBn ? 'ভুলের খাতা' : 'Mistake Ledger',
          icon: BookOpenCheck,
        },
        {
          href: '/app/progress',
          label: isBn ? 'স্কোর বিশ্লেষণ' : 'Score Analytics',
          icon: LineChart,
        },
      ],
    },
    {
      title: isBn ? 'পরীক্ষার প্রস্তুতি ট্র্যাক' : 'Exam Preparation Tracks',
      items: [
        {
          href: '/app/gre',
          label: isBn ? 'জিআরই জেনারেল ট্র্যাক' : 'GRE® General Track',
          icon: GraduationCap,
        },
        {
          href: '/app/ielts',
          label: isBn ? 'আইইএলটিএস একাডেমিক ও জিটি' : 'IELTS™ Academic & GT',
          icon: Languages,
        },
        {
          href: '/app/typing',
          label: isBn ? 'সিডি-আইইএলটিএস টাইপিং স্টুডিও' : 'CD-IELTS Typing Studio',
          icon: Keyboard,
        },
        {
          href: '/app/vocab',
          label: isBn ? 'ভোকাবুলারি ও সূত্র' : 'Vocabulary & Formulas',
          icon: Layers,
        },
      ],
    },
    {
      title: isBn ? 'বিলিং ও প্রাইভেসি' : 'Billing & Privacy',
      items: [
        {
          href: '/app/billing',
          label: isBn ? 'প্ল্যান, বিলিং ও রসিদ' : 'Plans, Billing & Receipts',
          icon: Receipt,
        },
        {
          href: '/app/settings',
          label: isBn ? 'অ্যাকাউন্ট ও প্রাইভেসি' : 'Account & Privacy',
          icon: ShieldCheck,
        },
      ],
    },
  ];

  const brandHeader = (
    <LocaleLink href="/app" className="flex items-start gap-2.5 text-[var(--brand-deep)]">
      <span className="pt-1" aria-hidden="true">
        <LumenSparkMotif />
      </span>
      <span className="flex flex-col">
        <span className="text-base font-bold text-[var(--brand-deep)] leading-snug">
          {brand.name}
        </span>
        <span className="text-xs text-[var(--text-muted)] leading-relaxed">
          {isBn ? 'ইলার্নার ওয়ার্কস্পেস' : 'Scholar Workspace'}
        </span>
      </span>
    </LocaleLink>
  );

  const navigationContent = (
    <nav aria-label={isBn ? 'স্কলার নেভিগেশন' : 'Scholar navigation'} className="space-y-6">
      {navGroups.map((group) => (
        <div key={group.title} className="space-y-1">
          <div className="px-3 pb-1 text-xs font-semibold text-[var(--text-muted)] leading-relaxed">
            {group.title}
          </div>
          <div className="space-y-0.5">
            {group.items.map((item) => {
              const Icon = item.icon;
              return (
                <WorkspaceNavLink key={item.href} href={item.href} exact={item.exact}>
                  <Icon className="h-4 w-4 shrink-0 text-[var(--brand)]" aria-hidden="true" />
                  <span>{item.label}</span>
                </WorkspaceNavLink>
              );
            })}
          </div>
        </div>
      ))}
    </nav>
  );

  const footerContent = (
    <div className="space-y-2.5">
      <div className="lumen-locale-light inline-flex items-center">
        <LocaleSwitcher />
      </div>
      <div className="text-xs font-medium text-[var(--text-secondary)] truncate">
        {isBn ? 'আয়মান রহমান · স্কলার' : 'Ayman Rahman · Scholar'}
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
        openLabel={isBn ? 'মেনু খুলুন' : 'Open navigation menu'}
        closeLabel={isBn ? 'মেনু বন্ধ করুন' : 'Close navigation menu'}
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
