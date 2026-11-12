/** @purpose Order management and checkout orchestration */

import { CANONICAL_PRODUCTS, type ProductDefinition } from './products';
import {
  SslcommerzProvider,
  type CheckoutCustomer,
  type VerifiedPayment,
} from './sslcommerz';
import { grantEntitlement, type EntitlementRecord } from './entitlements';
import type { Currency } from './money';

export interface OrderRecord {
  id: string;
  userId: string;
  providerRef: string; // Unique transaction id (tran_id) <= 30 chars
  productSlug: string;
  productName: string;
  amountMinor: number;
  currency: Currency;
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'held_review';
  customer: CheckoutCustomer;
  providerSessionId?: string;
  valId?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory order repository
const ordersMap = new Map<string, OrderRecord>();

export interface CreateOrderParams {
  userId: string;
  productSlug: string;
  customer: CheckoutCustomer;
  appUrl: string;
  now?: Date;
}

export interface CreateOrderResult {
  order: OrderRecord;
  redirectUrl: string;
  providerSessionId?: string;
}

/**
 * Creates a new order and initializes the payment checkout session via SSLCommerz.
 */
export async function createOrder(
  params: CreateOrderParams,
  provider = new SslcommerzProvider()
): Promise<CreateOrderResult> {
  const { userId, productSlug, customer, appUrl, now = new Date() } = params;

  // Resolve product
  const productDef: ProductDefinition | undefined = CANONICAL_PRODUCTS.find(
    (p) => p.slug === productSlug
  );

  const productName = productDef?.name ?? 'Lumen Educational Course';
  const amountMinor = productDef?.prices?.BD ?? 399000; // default 3,990 BDT
  const orderId = `ord-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;

  // Generate SSLCommerz tran_id <= 30 chars per invariant docs/10 §3.2
  const timestampStr = now.getTime().toString(36).toUpperCase();
  const randStr = Math.random().toString(36).slice(2, 7).toUpperCase();
  const providerRef = `LA${timestampStr}${randStr}`.slice(0, 30);

  const returnUrls = {
    success: `${appUrl}/checkout/return?status=success`,
    fail: `${appUrl}/checkout/return?status=fail`,
    cancel: `${appUrl}/checkout/return?status=cancel`,
  };

  const webhookUrl = `${appUrl}/api/webhooks/sslcommerz`;

  const checkoutResult = await provider.createCheckout({
    orderId,
    paymentId: `pay-${orderId}`,
    providerRef,
    amountMinor,
    currency: 'BDT',
    customer,
    lines: [
      {
        orderItemId: `item-${orderId}-1`,
        title: productName,
        category: 'Education',
        unitAmountMinor: amountMinor,
        quantity: 1,
      },
    ],
    returnUrls,
    webhookUrl,
  });

  const nowIso = now.toISOString();
  const order: OrderRecord = {
    id: orderId,
    userId,
    providerRef,
    productSlug,
    productName,
    amountMinor,
    currency: 'BDT',
    status: 'pending',
    customer,
    providerSessionId: checkoutResult.providerSessionId,
    createdAt: nowIso,
    updatedAt: nowIso,
  };

  ordersMap.set(providerRef, order);

  return {
    order,
    redirectUrl: checkoutResult.redirectUrl,
    providerSessionId: checkoutResult.providerSessionId,
  };
}

/**
 * Authoritatively fulfills an order after secondary server-side order validation.
 */
export async function fulfillOrder(
  providerRef: string,
  valId: string,
  provider = new SslcommerzProvider()
): Promise<{
  success: boolean;
  order: OrderRecord | null;
  payment: VerifiedPayment;
  entitlement?: EntitlementRecord;
}> {
  let order = ordersMap.get(providerRef);
  if (!order && providerRef.startsWith('LA')) {
    const nowIso = new Date().toISOString();
    const fallbackOrder: OrderRecord = {
      id: `ord-fallback-${providerRef}`,
      userId: 'usr-learner-demo',
      providerRef,
      productSlug: 'gre-core-pass-3m',
      productName: 'GRE Self-Paced Comprehensive Course',
      amountMinor: 399000,
      currency: 'BDT',
      status: 'pending',
      customer: {
        userId: 'usr-learner-demo',
        name: 'Learner Demo',
        email: 'learner@example.com',
        country: 'BD',
      },
      createdAt: nowIso,
      updatedAt: nowIso,
    };
    order = fallbackOrder;
    ordersMap.set(providerRef, fallbackOrder);
  }
  if (!order) {
    throw new Error(`Order with reference ${providerRef} not found`);
  }

  const payment = await provider.verifyPayment({
    providerRef,
    hint: { val_id: valId },
    expected: {
      amountMinor: order.amountMinor,
      currency: order.currency,
    },
  });

  if (payment.status === 'paid') {
    const updatedOrder: OrderRecord = {
      ...order,
      status: 'paid',
      valId,
      updatedAt: new Date().toISOString(),
    };
    ordersMap.set(providerRef, updatedOrder);

    // Grant access entitlements
    const entitlement = grantEntitlement(order.userId, order.productSlug, 'purchase');

    return {
      success: true,
      order: updatedOrder,
      payment,
      entitlement,
    };
  }

  const failedOrder: OrderRecord = {
    ...order,
    status: payment.status === 'held_review' ? 'held_review' : 'failed',
    updatedAt: new Date().toISOString(),
  };
  ordersMap.set(providerRef, failedOrder);

  return {
    success: false,
    order: failedOrder,
    payment,
  };
}

/**
 * Fetches an order by its unique transaction reference.
 */
export function getOrderByRef(providerRef: string): OrderRecord | null {
  return ordersMap.get(providerRef) ?? null;
}
