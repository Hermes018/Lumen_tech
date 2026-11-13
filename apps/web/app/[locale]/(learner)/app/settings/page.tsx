/** @purpose Learner account settings, 2FA status, entitlements, AI credit & mock allowances, and self-serve refund page */
import { brand } from '@lumen/config';
import { OrdersAndRefundsPanel } from '../../../_components/OrdersAndRefundsPanel';

export const metadata = {
  title: `Account Settings & Billing | ${brand.name}`,
  description: `Manage your ${brand.name} security settings, active entitlements, AI credit balances, and refund requests.`,
};

export default function LearnerSettingsPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Settings &amp; Allowances</h1>
        <p className="text-fg-muted text-sm">
          View your active entitlements, remaining AI evaluation &amp; mock balances, Mushak VAT
          receipts, and self-serve refund options.
        </p>
      </div>
      <OrdersAndRefundsPanel showAccountSecurity />
    </div>
  );
}
