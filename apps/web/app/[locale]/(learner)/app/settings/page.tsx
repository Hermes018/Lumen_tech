/** @purpose Learner account settings, 2FA status, entitlements, AI credit & mock allowances, PDPO 2025 guardian consent, and self-serve refund page */
import { getLocale } from 'next-intl/server';
import { brand } from '@lumen/config';
import { ArrowLeft, Settings } from 'lucide-react';
import { LocaleLink } from '../../../_components/LocaleLink';
import { OrdersAndRefundsPanel } from '../../../_components/OrdersAndRefundsPanel';
import { GuardianConsentAndPdpoPanel } from '../../../_components/GuardianConsentAndPdpoPanel';

export const metadata = {
  title: `Account Settings & Billing | ${brand.name}`,
  description: `Manage your ${brand.name} security settings, active entitlements, AI credit balances, and refund requests.`,
};

export default async function LearnerSettingsPage() {
  const locale = await getLocale();
  const isBn = locale === 'bn';

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
        <LocaleLink
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text)] transition-colors hover:text-[var(--brand)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isBn ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}</span>
        </LocaleLink>
        <span className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-ink)]">
          <Settings className="h-3.5 w-3.5 text-[var(--brand)]" />
          <span>{isBn ? 'অ্যাকাউন্ট ও বিলিং' : 'Account & Billing'}</span>
        </span>
      </div>

      <section className="rounded-[4px] border border-[var(--hairline)] border-l-4 border-l-[var(--brand)] bg-[var(--surface-paper)] p-6">
        <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-ink)]">
          {isBn ? 'সেটিংস ও বরাদ্দসমূহ' : 'Settings & Allowances'}
        </h1>
        <p className="mt-1.5 text-sm text-[var(--text)]">
          {isBn
            ? 'আপনার সক্রিয় সাবস্ক্রিপশন, অবশিষ্ট এআই মূল্যায়ন ও মক ব্যালেন্স, মুসক ভ্যাট রসিদ, অভিভাবকের সম্মতি (PDPO 2025) এবং রিফান্ড অনুরোধ পরিচালনা করুন।'
            : 'View your active entitlements, remaining AI evaluation & mock balances, Mushak VAT receipts, guardian consent (PDPO 2025), and self-serve refund options.'}
        </p>
      </section>

      <OrdersAndRefundsPanel showAccountSecurity />
      <GuardianConsentAndPdpoPanel />
    </div>
  );
}
