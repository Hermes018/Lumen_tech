/** @purpose Checkout payment page with VAT breakdown and SSLCommerz gateway integration */

import React from 'react';
import { CANONICAL_PRODUCTS } from '@lumen/core';
import { CheckoutClient } from './CheckoutClient';

export default function CheckoutPage() {
  const initialProduct = CANONICAL_PRODUCTS[0]!;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-[#111]">
          Complete Your Enrollment
        </h1>
        <p className="mt-1 text-xs text-[#666]">
          Secure online payment processed in Bangladeshi Taka (BDT) via SSLCommerz.
        </p>
      </div>

      <React.Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded border border-[#ddd] bg-white">
            <span className="font-mono text-sm text-[#777]">Loading checkout session...</span>
          </div>
        }
      >
        <CheckoutClient initialProduct={initialProduct} />
      </React.Suspense>
    </div>
  );
}
