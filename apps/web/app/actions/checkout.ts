/** @purpose Server actions for the checkout flow, order generation, and callback fulfillment */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  createOrder,
  fulfillOrder,
  getOrderByRef,
  listUserOrders,
  getUserEntitlements,
  getHighestActiveTier,
  getLedgerBalance,
  computeVatBreakdown,
  evaluateRefundEligibility,
  recordAuditEvent,
  formatCurrency,
  calculateTaxInclusive,
  CANONICAL_PRODUCTS,
  submitManualPayment,
  approveManualPayment,
  rejectManualPayment,
  type OrderRecord,
  type EntitlementRecord,
  type VatBreakdown,
  type RefundEligibilityResult,
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

const selfServeRefundSchema = z.object({
  orderId: z.string().min(1).max(100),
  reason: z.string().min(3).max(500).default('Learner self-serve refund request'),
});

export interface OrderWithVatAndRefund {
  order: OrderRecord;
  vatBreakdown: VatBreakdown;
  eligibility: RefundEligibilityResult;
}

export async function getOrdersAndEntitlementsAction() {
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  const orders = listUserOrders(actor.id);
  const entitlements = getUserEntitlements(actor.id);
  const activeTier = getHighestActiveTier(actor.id);
  const aiCreditsRemaining = getLedgerBalance(actor.id, 'ai_credit');
  const mockAttemptsRemaining = getLedgerBalance(actor.id, 'mock_attempt');

  const ordersWithDetails: OrderWithVatAndRefund[] = orders.map((order) => {
    const vatBreakdown = computeVatBreakdown(order.amountMinor, 1500);
    const eligibility = evaluateRefundEligibility({
      orderId: order.id,
      productSlug: order.productSlug,
      amountPaidMinor: order.amountMinor,
      currency: order.currency,
      paidAt: order.paidAt ?? order.createdAt,
    });
    return { order, vatBreakdown, eligibility };
  });

  return {
    actorId: actor.id,
    roles: actor.roles,
    twoFactorVerified: actor.twoFactorVerified,
    activeTier,
    aiCreditsRemaining,
    mockAttemptsRemaining,
    entitlements,
    orders: ordersWithDetails,
  };
}

export async function requestSelfServeRefundAction(rawInput: {
  orderId: string;
  reason?: string;
}) {
  const { orderId, reason } = selfServeRefundSchema.parse(rawInput);
  const actor = await requireServerActor();

  const order = getOrderByRef(orderId);
  if (!order) {
    return { ok: false as const, error: 'Order not found' };
  }

  assertCan(actor, 'order:view_own', { ownerId: order.userId });

  const eligibility = evaluateRefundEligibility({
    orderId: order.id,
    productSlug: order.productSlug,
    amountPaidMinor: order.amountMinor,
    currency: order.currency,
    paidAt: order.paidAt ?? order.createdAt,
  });

  if (!eligibility.eligible) {
    return {
      ok: false as const,
      error: `Not eligible for self-serve refund: ${eligibility.reasons.join(', ')}`,
      eligibility,
    };
  }

  const auditEntry = recordAuditEvent({
    actorId: actor.id,
    action: 'staff_action',
    targetType: 'self_serve_refund_request',
    targetId: order.id,
    reason,
    metadataJson: {
      orderId: order.id,
      providerRef: order.providerRef,
      refundableMinor: eligibility.refundableMinor,
      vatBreakdown: eligibility.vatBreakdown,
    },
  });

  return {
    ok: true as const,
    orderId: order.id,
    refundableMinor: eligibility.refundableMinor,
    vatBreakdown: eligibility.vatBreakdown,
    auditId: auditEntry.id,
  };
}

const submitManualCheckoutSchema = z.object({
  productSlug: z.string().min(1).max(100),
  name: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().min(6).max(30),
  address: z.string().max(250).optional(),
  city: z.string().max(100).optional(),
  method: z.enum(['bkash', 'nagad']),
  trxId: z.string().min(6).max(30),
  senderNumber: z.string().min(10).max(20),
});

export async function submitManualCheckoutAction(rawInput: z.infer<typeof submitManualCheckoutSchema>) {
  const input = submitManualCheckoutSchema.parse(rawInput);
  const actor = await requireServerActor();
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

  const updatedOrder = await submitManualPayment(
    res.order.id,
    input.method,
    input.trxId,
    input.senderNumber
  );

  return {
    ok: true as const,
    orderId: updatedOrder.id,
    status: updatedOrder.status,
    method: input.method,
    trxId: updatedOrder.manualPayment?.trxId ?? input.trxId,
  };
}

export async function approveManualPaymentAction(orderId: string) {
  const actor = await requireServerActor();
  assertCan(actor, 'finance:write');

  const result = await approveManualPayment(orderId, actor);
  return {
    ok: true as const,
    orderId: result.order.id,
    status: result.order.status,
    entitlementId: result.entitlement?.id,
  };
}

export async function rejectManualPaymentAction(orderId: string, reason?: string) {
  const actor = await requireServerActor();
  assertCan(actor, 'finance:write');

  const result = await rejectManualPayment(orderId, actor, reason);
  return {
    ok: true as const,
    orderId: result.order.id,
    status: result.order.status,
  };
}

