/** @purpose Server actions for the checkout flow, order generation, and callback fulfillment */
'use server';

import {
  createOrder,
  fulfillOrder,
  getOrderByRef,
  formatCurrency,
  calculateTaxInclusive,
  CANONICAL_PRODUCTS,
  type OrderRecord,
  type EntitlementRecord,
} from '@lumen/core';

export interface InitiateCheckoutInput {
  userId?: string;
  productSlug: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
}

export interface InitiateCheckoutResult {
  order: OrderRecord;
  redirectUrl: string;
}

/**
 * Initiates an order and generates an SSLCommerz gateway checkout URL.
 */
export async function initiateCheckoutAction(
  input: InitiateCheckoutInput
): Promise<InitiateCheckoutResult> {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const userId = input.userId || 'usr-learner-demo';

  const res = await createOrder({
    userId,
    productSlug: input.productSlug,
    customer: {
      userId,
      name: input.name,
      email: input.email,
      phoneE164: input.phone,
      address1: input.address,
      city: input.city || 'Dhaka',
      country: 'BD',
    },
    appUrl,
  });

  return {
    order: res.order,
    redirectUrl: res.redirectUrl,
  };
}

/**
 * Confirms payment from SSLCommerz return callback and fulfills order entitlements.
 */
export async function confirmReturnCallbackAction(
  providerRef: string,
  valId: string
): Promise<{
  success: boolean;
  order: OrderRecord | null;
  entitlement?: EntitlementRecord;
  errorMessage?: string;
}> {
  try {
    const res = await fulfillOrder(providerRef, valId);
    return {
      success: res.success,
      order: res.order,
      entitlement: res.entitlement,
      errorMessage: res.payment.failureReason,
    };
  } catch (err) {
    return {
      success: false,
      order: getOrderByRef(providerRef),
      errorMessage: err instanceof Error ? err.message : 'Fulfillment failed',
    };
  }
}

/**
 * Retrieves product details along with VAT-inclusive pricing breakdown.
 */
export async function getProductCheckoutDetails(productSlug: string) {
  const product = CANONICAL_PRODUCTS.find((p) => p.slug === productSlug) ?? CANONICAL_PRODUCTS[0]!;
  const amountMinor = product.prices.BD;
  const tax = calculateTaxInclusive(amountMinor, 0.05);

  return {
    product,
    amountMinor,
    formattedPrice: formatCurrency(amountMinor, 'BDT'),
    taxBreakdown: {
      baseAmount: formatCurrency(tax.baseMinor, 'BDT'),
      vatAmount: formatCurrency(tax.vatMinor, 'BDT'),
      totalAmount: formatCurrency(tax.totalMinor, 'BDT'),
      vatRateText: '5% Educational VAT included',
    },
  };
}
