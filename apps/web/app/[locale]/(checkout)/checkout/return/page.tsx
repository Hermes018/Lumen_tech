/** @purpose Return callback page handling SSLCommerz success/fail/cancel outcomes and order fulfillment */

import React from 'react';
import { CheckoutReturnClient } from './CheckoutReturnClient';

export default function CheckoutReturnPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <React.Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded border border-[#ddd] bg-white">
            <span className="font-mono text-sm text-[#777]">Verifying transaction with SSLCommerz...</span>
          </div>
        }
      >
        <CheckoutReturnClient />
      </React.Suspense>
    </div>
  );
}
