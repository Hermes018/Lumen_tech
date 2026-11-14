/** @purpose Checkout payment page with plan preselection, 15% BD VAT breakdown, and SSLCommerz gateway integration (P2.6.1 Bilingual) */

import React from 'react';
import { CANONICAL_PRODUCTS, type ProductDefinition } from '@lumen/core';
import { CheckoutClient } from './CheckoutClient';

function resolveProduct(planParam?: string): ProductDefinition {
  if (!planParam) return CANONICAL_PRODUCTS[0]!;
  const cleaned = planParam.trim().toLowerCase();
  const direct = CANONICAL_PRODUCTS.find((p) => p.slug.toLowerCase() === cleaned);
  if (direct) return direct;

  // Semantic mappings and aliases
  if (cleaned.includes('gre') && cleaned.includes('plus')) {
    return CANONICAL_PRODUCTS.find((p) => p.slug === 'gre-plus') || CANONICAL_PRODUCTS[0]!;
  }
  if (cleaned.includes('gre')) {
    return (
      CANONICAL_PRODUCTS.find((p) => p.slug === 'gre-core' || p.slug === 'gre-complete-core') ||
      CANONICAL_PRODUCTS[0]!
    );
  }
  if (cleaned.includes('ielts') && cleaned.includes('plus')) {
    return (
      CANONICAL_PRODUCTS.find((p) => p.slug === 'ielts-academic-plus') || CANONICAL_PRODUCTS[0]!
    );
  }
  if (cleaned.includes('ielts')) {
    return (
      CANONICAL_PRODUCTS.find((p) => p.slug === 'ielts-academic-core') || CANONICAL_PRODUCTS[0]!
    );
  }
  if (cleaned.includes('mock')) {
    return (
      CANONICAL_PRODUCTS.find((p) => p.slug === 'mock-pack-4' || p.slug === 'gre-mock-pack-5') ||
      CANONICAL_PRODUCTS[0]!
    );
  }
  if (cleaned.includes('credit') || cleaned.includes('ai')) {
    return CANONICAL_PRODUCTS.find((p) => p.slug === 'ai-credits-10') || CANONICAL_PRODUCTS[0]!;
  }
  if (cleaned.includes('review') || cleaned.includes('human')) {
    return (
      CANONICAL_PRODUCTS.find((p) => p.slug === 'human-review-pack') || CANONICAL_PRODUCTS[0]!
    );
  }
  if (cleaned.includes('pass')) {
    return CANONICAL_PRODUCTS.find((p) => p.slug === 'lumen-annual-pass') || CANONICAL_PRODUCTS[0]!;
  }

  return CANONICAL_PRODUCTS[0]!;
}

export default async function CheckoutPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ plan?: string; product?: string }>;
}) {
  const { locale } = await params;
  const resolvedSearchParams = await searchParams;
  const isBn = locale === 'bn';
  const initialProduct = resolveProduct(resolvedSearchParams.plan || resolvedSearchParams.product);

  return (
    <div className="w-full" data-locale={locale}>
      <React.Suspense
        fallback={
          <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-10">
            <div className="flex h-64 items-center justify-center rounded-xl border border-border bg-surface">
              <span className="font-mono text-sm text-fg-muted">
                {isBn ? 'চেকআউট সেশন লোড হচ্ছে...' : 'Loading checkout session...'}
              </span>
            </div>
          </div>
        }
      >
        <CheckoutClient initialProduct={initialProduct} locale={isBn ? 'bn' : 'en'} />
      </React.Suspense>
    </div>
  );
}
