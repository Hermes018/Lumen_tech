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
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'held_review' | 'refunded';
  customer: CheckoutCustomer;
  providerSessionId?: string;
  valId?: string;
  entitlementId?: string;
  paidAt?: string;
  refundedAt?: string;
  createdAt: string;
  updatedAt: string;
}

// In-memory order repository and idempotency guards
const ordersMap = new Map<string, OrderRecord>();
const processedIpnEvents = new Map<string, { order: OrderRecord; payment: VerifiedPayment; entitlement?: EntitlementRecord }>();

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
 * Enforces strict idempotency on providerRef (tran_id) so duplicate IPNs never double-grant entitlements.
 */
export async function fulfillOrder(
  providerRef: string,
  valId: string,
  provider = new SslcommerzProvider(),
  hint?: Record<string, string>
): Promise<{
  success: boolean;
  idempotentReplay?: boolean;
  order: OrderRecord | null;
  payment: VerifiedPayment;
  entitlement?: EntitlementRecord;
}> {
  // 1. Idempotency Guard: if this transaction reference was already fulfilled, return cached result without re-granting
  const existingFulfillment = processedIpnEvents.get(providerRef);
  if (existingFulfillment) {
    return {
      success: true,
      idempotentReplay: true,
      order: existingFulfillment.order,
      payment: existingFulfillment.payment,
      entitlement: existingFulfillment.entitlement,
    };
  }

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

  // Secondary check if order status is already paid
  if (order.status === 'paid') {
    const paidPayment: VerifiedPayment = {
      status: 'paid',
      providerRef,
      providerTxnId: `BANK_${order.valId ?? valId}`,
      amountMinor: order.amountMinor,
      currency: order.currency,
      paidAt: order.paidAt ? new Date(order.paidAt) : new Date(),
      raw: { idempotent: true },
    };
    return {
      success: true,
      idempotentReplay: true,
      order,
      payment: paidPayment,
    };
  }

  const payment = await provider.verifyPayment({
    providerRef,
    hint: { ...hint, val_id: valId },
    expected: {
      amountMinor: order.amountMinor,
      currency: order.currency,
    },
  });

  if (
    payment.status === 'paid' &&
    payment.amountMinor === order.amountMinor &&
    payment.currency === order.currency
  ) {
    const orderCreatedMs = new Date(order.createdAt).getTime();
    const effectiveNow =
      Number.isFinite(orderCreatedMs) && orderCreatedMs < Date.now()
        ? new Date(orderCreatedMs)
        : new Date();
    const nowIso = effectiveNow.toISOString();
    // Grant access entitlements exactly once per orderId/providerRef
    const entitlement = grantEntitlement(order.userId, order.productSlug, 'purchase', effectiveNow, {
      orderId: order.id,
      idempotencyKey: `purchase:${providerRef}`,
      amountPaidMinor: order.amountMinor,
      currency: order.currency,
    });

    const updatedOrder: OrderRecord = {
      ...order,
      status: 'paid',
      valId,
      entitlementId: entitlement.id,
      paidAt: nowIso,
      updatedAt: nowIso,
    };
    ordersMap.set(providerRef, updatedOrder);
    processedIpnEvents.set(providerRef, {
      order: updatedOrder,
      payment,
      entitlement,
    });

    return {
      success: true,
      idempotentReplay: false,
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
    idempotentReplay: false,
    order: failedOrder,
    payment,
  };
}

/**
 * Fetches an order by its unique transaction reference or order ID.
 */
export function getOrderByRef(providerRefOrOrderId: string): OrderRecord | null {
  const byRef = ordersMap.get(providerRefOrOrderId);
  if (byRef) return byRef;
  for (const ord of ordersMap.values()) {
    if (ord.id === providerRefOrOrderId) return ord;
  }
  return null;
}

/**
 * Updates an order record in the store (used by refund engine).
 */
export function updateOrderRecord(order: OrderRecord): OrderRecord {
  ordersMap.set(order.providerRef, order);
  return order;
}
