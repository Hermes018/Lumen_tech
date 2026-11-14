/** @purpose Prominent Bangladeshi Payment & Trust Bar displaying bKash, Nagad, Rocket, Visa / Mastercard, and SSLCommerz Verified badges (BUG-12, P2.6.1 Bilingual) */
'use client';

import { useLocale } from 'next-intl';
import { ShieldCheck, CreditCard, Lock, Smartphone, CheckCircle2 } from 'lucide-react';

export interface BangladeshPaymentTrustBarProps {
  variant?: 'dark' | 'light';
  locale?: 'en' | 'bn';
}

export function BangladeshPaymentTrustBar({
  variant = 'dark',
  locale: propLocale,
}: BangladeshPaymentTrustBarProps) {
  const hookLocale = useLocale();
  const locale = propLocale ?? (hookLocale === 'bn' ? 'bn' : 'en');
  const isBn = locale === 'bn';
  const isDark = variant === 'dark';

  return (
    <div
      className={`w-full rounded-2xl border px-4 py-3.5 sm:px-6 ${
        isDark
          ? 'border-slate-800 bg-slate-900/90 text-slate-200'
          : 'border-slate-200 bg-slate-50 text-slate-800 shadow-2xs'
      }`}
    >
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-3 sm:flex-row">
        <div className="flex items-center gap-2 text-xs font-semibold tracking-wide">
          <Lock className={`h-4 w-4 shrink-0 ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`} />
          <span>
            {isBn
              ? 'বিশ্বস্ত বাংলাদেশ ও গ্লোবাল চেকআউট • তাৎক্ষণিক কোর্স অ্যাক্সেস অ্যাক্টিভেশন'
              : 'Trusted Bangladesh & Global Checkout • Instant Entitlement Activation'}
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* bKash */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
              isDark
                ? 'border-pink-500/30 bg-pink-950/60 text-pink-200'
                : 'border-pink-200 bg-pink-50 text-pink-800'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-pink-500" />
            {isBn ? 'বিকাশ (০% কিস্তি)' : 'bKash (0% Split-Pay)'}
          </span>

          {/* Nagad */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
              isDark
                ? 'border-amber-500/30 bg-amber-950/60 text-amber-200'
                : 'border-amber-200 bg-amber-50 text-amber-900'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-amber-500" />
            {isBn ? 'নগদ' : 'Nagad'}
          </span>

          {/* Rocket */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
              isDark
                ? 'border-purple-500/30 bg-purple-950/60 text-purple-200'
                : 'border-purple-200 bg-purple-50 text-purple-900'
            }`}
          >
            <Smartphone className="h-3.5 w-3.5 text-purple-400" />
            {isBn ? 'রকেট' : 'Rocket'}
          </span>

          {/* Visa / Mastercard */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
              isDark
                ? 'border-blue-500/30 bg-blue-950/60 text-blue-200'
                : 'border-blue-200 bg-blue-50 text-blue-900'
            }`}
          >
            <CreditCard className="h-3.5 w-3.5 text-blue-400" />
            {isBn ? 'ভিসা / মাস্টারকার্ড' : 'Visa / Mastercard'}
          </span>

          {/* SSLCommerz Verified */}
          <span
            className={`inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs font-bold ${
              isDark
                ? 'border-emerald-500/30 bg-emerald-950/60 text-emerald-200'
                : 'border-emerald-200 bg-emerald-50 text-emerald-900'
            }`}
          >
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            {isBn ? 'SSLCommerz যাচাইকৃত' : 'SSLCommerz Verified'}
          </span>

          {/* Mushak 6.3 */}
          <span
            className={`inline-flex items-center gap-1 rounded-lg border px-2.5 py-1 text-[11px] font-semibold ${
              isDark
                ? 'border-slate-700 bg-slate-800 text-slate-300'
                : 'border-slate-300 bg-white text-slate-700'
            }`}
          >
            <CheckCircle2 className="h-3 w-3 text-blue-400" />
            {isBn ? 'মূসক ৬.৩ ভ্যাট রসিদ' : 'Mushak 6.3 VAT Receipt'}
          </span>
        </div>
      </div>
    </div>
  );
}
