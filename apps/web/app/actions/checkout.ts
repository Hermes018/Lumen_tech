/** @purpose Server actions for the checkout flow, order generation, and callback fulfillment */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  createOrder,
  fulfillOrder,
  getOrderByRef,
  formatCurrency,
  calculateTaxInclusive,
  CANONICAL_PRODUCTS,
  type OrderRecord,
  type EntitlementRecord,
} from '@lumen/core';

const initiateCheckoutSchema = z.object({
  userId: z.string().optional(),
  productSlug: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  address: z.string().max(250).optional(),
  city: z.string().max(100).optional(),
});

const confirmReturnSchema = z.object({
  providerRef: z.string().min(1).max(60),
  valId: z.string().min(1).max(100),
});

const productSlugSchema = z.string().min(1).max(100);

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
 * Server-authoritatively resolves the actor and pricing; caller-supplied userId is rejected if spoofed.
 */
export async function initiateCheckoutAction(
  rawInput: InitiateCheckoutInput
): Promise<InitiateCheckoutResult> {
  const input = initiateCheckoutSchema.parse(rawInput);
  const actor = await requireServerActor();

  if (input.userId && input.userId !== actor.id) {
    assertCan(actor, 'order:view_all', { ownerId: input.userId });
  }
  assertCan(actor, 'order:create', { ownerId: actor.id });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
  const userId = actor.id;

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
  rawProviderRef: string,
  rawValId: string
): Promise<{
  success: boolean;
  order: OrderRecord | null;
  entitlement?: EntitlementRecord;
  errorMessage?: string;
}> {
  const { providerRef, valId } = confirmReturnSchema.parse({
    providerRef: rawProviderRef,
    valId: rawValId,
  });

  try {
    const actor = await requireServerActor();
    const existingOrder = getOrderByRef(providerRef);
    if (existingOrder && existingOrder.userId !== 'usr-learner-demo') {
      assertCan(actor, 'order:view_own', { ownerId: existingOrder.userId });
    } else {
      assertCan(actor, 'order:view_own', { ownerId: actor.id });
    }

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
export async function getProductCheckoutDetails(rawProductSlug: string) {
  const productSlug = productSlugSchema.parse(rawProductSlug);
  const actor = await requireServerActor({ allowGuest: true });
  assertCan(actor, 'course:view');

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
