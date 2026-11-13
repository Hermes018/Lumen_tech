/** @purpose Learner orders, Mushak/VAT receipts, entitlements, and 1-click self-serve refund page */
import { brand } from '@lumen/config';
import { OrdersAndRefundsPanel } from '../../_components/OrdersAndRefundsPanel';

export const metadata = {
  title: `Orders & Receipts | ${brand.name}`,
  description: `View your orders, Mushak 6.3 VAT receipts, active entitlements, and self-serve refund eligibility on ${brand.name}.`,
};

export default function OrdersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Orders &amp; VAT Receipts</h2>
        <p className="text-fg-muted text-sm">
          Inspect your purchase history, Mushak 6.3 tax breakdown, and 1-click self-serve refunds.
        </p>
      </div>
      <OrdersAndRefundsPanel />
    </div>
  );
}
