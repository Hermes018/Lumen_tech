/** @purpose Flat institutional Bangladeshi & international payment trust bar (bKash, Nagad, Rocket, Visa/Mastercard, SSLCommerz, Mushak 6.3) */
'use client';

import { Lock } from 'lucide-react';
import { useLocale } from 'next-intl';

export interface BangladeshPaymentTrustBarProps {
  variant?: 'footer' | 'light' | 'dark';
  locale?: 'en' | 'bn';
}

const PAYMENT_METHODS = {
  en: [
    'bKash (0% Split-Pay)',
    'Nagad',
    'Rocket',
    'Visa / Mastercard',
    'SSLCommerz Verified',
    'Mushak 6.3 VAT Invoice',
  ],
  bn: [
    'বিকাশ (০% কিস্তি)',
    'নগদ',
    'রকেট',
    'ভিসা / মাস্টারকার্ড',
    'SSLCommerz যাচাইকৃত',
    'মূসক ৬.৩ ভ্যাট চালান',
  ],
} as const;

export function BangladeshPaymentTrustBar({
  variant = 'footer',
  locale: propLocale,
}: BangladeshPaymentTrustBarProps) {
  const hookLocale = useLocale();
  const locale = propLocale ?? (hookLocale === 'bn' ? 'bn' : 'en');
  const isBn = locale === 'bn';
  const isLight = variant === 'light';

  const containerClass = isLight
    ? 'w-full border-t border-b border-[var(--hairline)] bg-[var(--bg-warm)] px-5 py-3.5 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-[var(--text)]'
    : 'w-full border-t border-b border-white/15 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3 text-xs text-white/85';

  const items = isBn ? PAYMENT_METHODS.bn : PAYMENT_METHODS.en;

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-2 font-bold">
        <Lock className="h-4 w-4 shrink-0 text-[var(--accent)]" aria-hidden="true" />
        <span>
          {isBn
            ? 'গ্রহণযোগ্য বাংলাদেশ ও আন্তর্জাতিক পেমেন্ট মাধ্যম'
            : 'Accepted Bangladesh & International Payment Methods'}
        </span>
      </div>

      <ul className="flex flex-wrap items-center gap-y-1.5 divide-x divide-current/20">
        {items.map((label) => (
          <li
            key={label}
            className="px-2.5 first:pl-0 last:pr-0 font-semibold whitespace-nowrap"
          >
            {label}
          </li>
        ))}
      </ul>
    </div>
  );
}
