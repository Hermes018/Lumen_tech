/** @purpose Responsive learner portal shell with Deep Espresso sidebar/header, crimson rule, bilingual navigation, and Pearl/Bone canvas */
import type { ReactNode } from 'react';
import { getLocale } from 'next-intl/server';
import { brand } from '@lumen/config';
import {
  LayoutDashboard,
  Target,
  Award,
  Brain,
  AlertTriangle,
  Calendar,
  Settings,
  FileText,
  Flame,
  Zap,
  User,
} from 'lucide-react';
import { LumenSparkMotif } from '@/src/components/ui/primitives';
import { LocaleLink } from '../_components/LocaleLink';
import { LocaleSwitcher } from '../_components/LocaleSwitcher';

export const dynamic = 'force-dynamic';

export default async function LearnerLayout({ children }: { children: ReactNode }) {
  const locale = await getLocale();
  const isBn = locale === 'bn';

  const navItems = [
    {
      href: '/app',
      label: isBn ? 'ড্যাশবোর্ড' : 'Dashboard',
      icon: LayoutDashboard,
    },
    {
      href: '/app/progress',
      label: isBn ? 'দক্ষতা ও বিশ্লেষণ' : 'Mastery & Analytics',
      icon: Award,
    },
    {
      href: '/app/practice',
      label: isBn ? 'অনুশীলন ও ড্রিল' : 'Practice & Drills',
      icon: Target,
    },
    {
      href: '/app/vocab',
      label: isBn ? 'এফএসআরএস ভোকাব' : 'FSRS Vocab',
      icon: Brain,
    },
    {
      href: '/app/mistakes',
      label: isBn ? 'ভুলের নোটবুক' : 'Mistake Notebook',
      icon: AlertTriangle,
    },
    {
      href: '/app/plan',
      label: isBn ? 'স্টাডি প্ল্যান' : 'Study Plan',
      icon: Calendar,
    },
    {
      href: '/app/settings',
      label: isBn ? 'সেটিংস ও বিলিং' : 'Settings & Billing',
      icon: Settings,
    },
    {
      href: '/exam/ielts-preview',
      label: isBn ? 'আইইএলটিএস সিমুলেটর' : 'CD-IELTS Simulator',
      icon: FileText,
    },
  ];

  return (
    <div className="learner-shell flex min-h-screen bg-[var(--bg)] text-[var(--text)]">
      {/* Desktop Deep Espresso Sidebar */}
      <aside className="learner-sidebar hidden w-64 shrink-0 flex-col border-r border-white/15 bg-[var(--brand-deep)] text-white lg:flex">
        {/* Brand Header */}
        <div className="flex h-16 items-center border-b border-white/15 px-6">
          <LocaleLink
            href="/app"
            className="flex items-center gap-3 text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
          >
            <span className="pt-2" aria-hidden="true">
              <LumenSparkMotif inverse />
            </span>
            <span className="flex flex-col">
              <span className="text-base leading-tight font-extrabold tracking-tight">{brand.name}</span>
              <span className="text-xs font-medium text-white/70">
                {isBn ? 'শিক্ষার্থী ওয়ার্কস্পেস' : 'Learner Workspace'}
              </span>
            </span>
          </LocaleLink>
        </div>

        {/* Navigation Items */}
        <nav aria-label={isBn ? 'শিক্ষার্থী নেভিগেশন' : 'Learner navigation'} className="flex-1 space-y-1 px-3 py-5 text-sm font-medium">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <LocaleLink
                key={item.href}
                href={item.href}
                className="flex items-center gap-3 rounded-[4px] border border-transparent px-3 py-2 text-white/85 transition-colors hover:border-white/15 hover:bg-white/10 hover:text-white"
              >
                <Icon className="h-4 w-4 shrink-0 text-[var(--accent)]" />
                <span>{item.label}</span>
              </LocaleLink>
            );
          })}
        </nav>

        {/* Sidebar Footer with Diagnostic Target */}
        <div className="border-t border-white/15 p-4 text-xs text-white/80">
          <div className="font-semibold text-white">
            {isBn ? 'জিআরই ডায়াগনস্টিক লক্ষ্য' : 'GRE Diagnostic Target'}
          </div>
          <p className="mt-1 text-white/70">
            {isBn ? 'বর্তমান: ৩১৮ → লক্ষ্য: ৩৩০+' : 'Current: 318 → Goal: 330+'}
          </p>
          <LocaleLink
            href="/app/plan"
            className="mt-2 inline-block font-semibold text-[var(--soft-btn)] underline underline-offset-4 hover:text-white"
          >
            {isBn ? 'রোডম্যাপ দেখুন' : 'View Study Roadmap'}
          </LocaleLink>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b-4 border-[var(--brand)] bg-[var(--brand-deep)] px-4 text-white sm:px-6">
          {/* Mobile Brand + Track Switcher Links */}
          <div className="flex items-center gap-3">
            <LocaleLink
              href="/app"
              className="flex items-center gap-2 font-extrabold text-white lg:hidden"
            >
              <span className="pt-2" aria-hidden="true">
                <LumenSparkMotif inverse />
              </span>
              <span className="text-sm tracking-tight">{brand.name}</span>
            </LocaleLink>

            <div className="hidden items-center rounded-[4px] border border-white/20 bg-white/10 p-0.5 text-xs font-semibold sm:flex">
              <LocaleLink
                href="/app/practice"
                className="rounded-[4px] bg-[var(--brand)] px-3 py-1 text-white"
              >
                {isBn ? 'জিআরই প্রস্তুতি' : 'GRE Prep'}
              </LocaleLink>
              <LocaleLink
                href="/exam/ielts-preview"
                className="rounded-[4px] px-3 py-1 text-white/80 transition-colors hover:text-white"
              >
                {isBn ? 'আইইএলটিএস' : 'IELTS'}
              </LocaleLink>
            </div>
          </div>

          {/* User Status Indicators & Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="lumen-locale-dark inline-flex items-center">
              <LocaleSwitcher />
            </div>

            <div className="hidden items-center gap-1.5 rounded-[4px] border border-[var(--accent)]/50 bg-[var(--brand-ink)] px-3 py-1 text-xs font-semibold text-white md:flex">
              <Flame className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>{isBn ? '৭ দিনের ধারা' : '7 Day Streak'}</span>
            </div>

            <div className="hidden items-center gap-1 rounded-[4px] border border-white/20 bg-white/10 px-2.5 py-1 text-xs font-semibold text-white sm:inline-flex">
              <Zap className="h-3.5 w-3.5 text-[var(--accent)]" />
              <span>{isBn ? '১২০ ক্রেডিট' : '120 Credits'}</span>
            </div>

            <LocaleLink
              href="/app/settings"
              className="flex h-8 w-8 items-center justify-center rounded-[4px] border border-white/25 bg-white/10 text-white transition-colors hover:bg-white/20"
              aria-label={isBn ? 'অ্যাকাউন্ট সেটিংস' : 'Account Settings'}
            >
              <User className="h-4 w-4" />
            </LocaleLink>
          </div>
        </header>

        {/* Mobile Quick Navigation Strip */}
        <nav
          aria-label={isBn ? 'মোবাইল নেভিগেশন' : 'Mobile navigation'}
          className="flex items-center gap-1.5 overflow-x-auto border-b border-[var(--hairline)] bg-[var(--surface-paper)] px-4 py-2 text-xs font-semibold lg:hidden"
        >
          {navItems.map((item) => (
            <LocaleLink
              key={item.href}
              href={item.href}
              className="shrink-0 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-1.5 text-[var(--brand-ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              {item.label}
            </LocaleLink>
          ))}
        </nav>

        {/* Page Content Body */}
        <main className="mx-auto w-full max-w-7xl flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
