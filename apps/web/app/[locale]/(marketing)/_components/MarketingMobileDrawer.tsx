'use client';

/** @purpose Responsive mobile hamburger menu slide-over drawer for the marketing shell (BUG-10) */
import * as React from 'react';
import { brand } from '@lumen/config';
import { Button } from '@lumen/ui';
import {
  Menu,
  X,
  GraduationCap,
  BookOpen,
  Sparkles,
  CreditCard,
  Compass,
  HelpCircle,
  ArrowRight,
} from 'lucide-react';
import { LocaleLink as Link } from '../../_components/LocaleLink';
import { LocaleSwitcher } from '../../_components/LocaleSwitcher';

export interface MarketingMobileDrawerProps {
  labels: {
    courses: string;
    grePrep: string;
    ieltsPrep: string;
    pricing: string;
    diagnostic: string;
    helpCenter: string;
    signIn: string;
    getStarted: string;
  };
}

export function MarketingMobileDrawer({ labels }: MarketingMobileDrawerProps) {
  const [open, setOpen] = React.useState(false);

  // Prevent background scrolling when drawer is open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const navItems = [
    { href: '/courses', label: labels.courses, icon: BookOpen },
    { href: '/gre', label: labels.grePrep, icon: Compass },
    { href: '/ielts', label: labels.ieltsPrep, icon: GraduationCap },
    { href: '/pricing', label: labels.pricing, icon: CreditCard },
    { href: '/exam/diagnostic', label: labels.diagnostic, icon: Sparkles },
    { href: '/help', label: labels.helpCenter, icon: HelpCircle },
  ];

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <LocaleSwitcher />

      <button
        type="button"
        onClick={() => setOpen(true)}
        className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 shadow-2xs transition-colors hover:bg-slate-50 hover:text-slate-950 focus:outline-none focus:ring-2 focus:ring-blue-600"
        aria-label="Open navigation menu"
        aria-expanded={open}
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-xs transition-opacity lg:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Mobile navigation menu"
        >
          {/* Backdrop click area */}
          <div className="flex-1" onClick={() => setOpen(false)} aria-hidden="true" />

          {/* Full-height Slide-Over Drawer Panel */}
          <div className="flex h-[100dvh] w-full max-w-xs flex-col justify-between border-l border-slate-200 bg-white p-6 shadow-2xl">
            <div className="space-y-6 overflow-y-auto">
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                <Link
                  href="/"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-2.5 text-base font-bold tracking-tight text-slate-950"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-950 text-white">
                    <GraduationCap className="h-4 w-4" />
                  </span>
                  <span>{brand.name}</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900"
                  aria-label="Close navigation menu"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Navigation Links */}
              <nav className="space-y-1" aria-label="Mobile Navigation">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-100 hover:text-slate-950"
                    >
                      <Icon className="h-4 w-4 text-blue-600 shrink-0" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Language Switcher inside Drawer */}
              <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5">
                <span className="text-xs font-semibold text-slate-600">Language / ভাষা</span>
                <LocaleSwitcher />
              </div>
            </div>

            {/* Bottom Full-Width CTAs */}
            <div className="space-y-2.5 border-t border-slate-200 pt-4">
              <Link href="/sign-in" onClick={() => setOpen(false)} className="block w-full">
                <Button variant="outline" className="w-full justify-center font-semibold">
                  {labels.signIn}
                </Button>
              </Link>
              <Link href="/sign-up" onClick={() => setOpen(false)} className="block w-full">
                <Button variant="primary" className="w-full justify-center gap-1.5 font-semibold">
                  {labels.getStarted} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
