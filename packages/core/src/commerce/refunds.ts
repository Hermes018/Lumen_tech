/** @purpose Finance Refund, Consumed-Credit Deduction, Certificate Revocation & Integer VAT/Mushak Engine (P1-147, D5, D12 C13b/C28) */

import { assertCan, type Actor } from '../auth/policy';
import { revokeCertificate, type CertificateRecord } from '../certificates/verify';
import { recordAuditEvent, type AuditLogEntry } from '../grader/queue';
import { getOrderByRef, updateOrderRecord, type OrderRecord } from './checkout';
import {
  revokeEntitlementOnRefund,
  type EntitlementRecord,
} from './entitlements';
import type { Currency } from './money';

export type RefundWindowPolicy =
  | 'standard_7d'
  | 'pass_1m_72h'
  | 'before_class_3'
  | 'before_class_2'
  | 'standalone_credits';

export interface RefundEvaluationInput {
  orderId?: string;
  productSlug: string;
  productKind?: 'course' | 'bundle' | 'test_pack' | 'ai_credits' | 'pass' | 'live' | 'crash';
  policy?: RefundWindowPolicy;
  amountPaidMinor: number;
  currency?: Currency;
  paidAt: Date | string;
  now?: Date | string;
  lessonsCompleted?: number;
  totalLessons?: number;
  aiCreditsUsed?: number;
  aiCreditsIncluded?: number;
  fullMocksTaken?: number;
  fullMocksIncluded?: number;
  liveClassesAttended?: number;
  unitAiCreditValueMinor?: number;
}

export interface RefundEligibilityResult {
  eligible: boolean;
  policyApplied: RefundWindowPolicy;
  withinWindow: boolean;
  consumedPct: number;
  fullMocksTaken: number;
  consumedAiCredits: number;
  deductedCreditValueMinor: number;
  refundableMinor: number;
  vatBreakdown: VatBreakdown;
  reasons: string[];
}

export interface VatBreakdown {
  gross_minor: number;
  net_minor: number;
  vat_minor: number;
  vatRateBps: number;
}

/**
 * Computes 15% BD VAT / Mushak integer minor-unit breakdown (`net_minor`, `vat_minor`, `gross_minor`).
 * Invariant: `net_minor + vat_minor === gross_minor` using integer minor units only.
 * Default vatRateBps = 1500 (15.00% standard Bangladesh VAT / Mushak 6.3).
 */
export function computeVatBreakdown(
  grossMinor: number,
  vatRateBps = 1500
): VatBreakdown {
  const gross = Math.round(grossMinor);
  if (gross === 0 || vatRateBps <= 0) {
    return {
      gross_minor: gross,
      net_minor: gross,
      vat_minor: 0,
      vatRateBps: Math.max(0, vatRateBps),
    };
  }

  const sign = gross < 0 ? -1 : 1;
  const absGross = Math.abs(gross);
  // net = floor((absGross * 10000) / (10000 + vatRateBps))
  const absNet = Math.floor((absGross * 10000) / (10000 + vatRateBps));
  const absVat = absGross - absNet;

  return {
    gross_minor: sign * absGross,
    net_minor: sign * absNet,
    vat_minor: sign * absVat,
    vatRateBps,
  };
}

function inferRefundPolicy(
  productSlug: string,
  productKind?: RefundEvaluationInput['productKind'],
  explicitPolicy?: RefundWindowPolicy
): RefundWindowPolicy {
  if (explicitPolicy) return explicitPolicy;
  const slug = productSlug.toLowerCase();
  if (productKind === 'ai_credits' || slug.includes('credit')) {
    return 'standalone_credits';
  }
  if (productKind === 'crash' || slug.includes('crash')) {
    return 'before_class_2';
  }
  if (productKind === 'live' || slug.includes('live')) {
    return 'before_class_3';
  }
  if (slug.includes('1m') || slug.includes('1-month') || slug.includes('monthly')) {
    return 'pass_1m_72h';
  }
  return 'standard_7d';
}

/**
 * Evaluates refund eligibility and calculates exact refundable integer minor units (P1-147 / D5 / C13b / C28):
 * - Standard digital courses/passes: 7-day window (`<= 7 * 24h`), `< 20%` content consumed, AND `<= 1` full mock taken.
 * - 1-month pass: `72h` window (`<= 72h`), `< 20%` content consumed, AND `<= 1` full mock taken.
 * - Live cohort: `before_class_3` (`liveClassesAttended < 3`) and `< 20%` content consumed.
 * - Crash course: `before_class_2` (`liveClassesAttended < 2`) and `< 20%` content consumed.
 * - Never refunds consumed AI credits (deducts consumed credit value in minor units if partially used).
 */
export function evaluateRefundEligibility(
  input: RefundEvaluationInput
): RefundEligibilityResult {
  const paidAtMs = new Date(input.paidAt).getTime();
  const nowMs = input.now ? new Date(input.now).getTime() : Date.now();
  const elapsedMs = Math.max(0, nowMs - paidAtMs);

  const HOUR_MS = 60 * 60 * 1000;
  const DAY_MS = 24 * HOUR_MS;

  const policy = inferRefundPolicy(input.productSlug, input.productKind, input.policy);
  const reasons: string[] = [];

  // 1. Window check
  let withinWindow = true;
  const classesAttended = input.liveClassesAttended ?? 0;

  if (policy === 'pass_1m_72h') {
    withinWindow = elapsedMs <= 72 * HOUR_MS;
    if (!withinWindow) {
      reasons.push('exceeded_72h_window_for_1m_pass');
    }
  } else if (policy === 'before_class_3') {
    withinWindow = classesAttended < 3 && elapsedMs <= 30 * DAY_MS;
    if (classesAttended >= 3) {
      reasons.push('attended_class_3_or_more_for_live');
    } else if (!withinWindow) {
      reasons.push('exceeded_live_refund_window');
    }
  } else if (policy === 'before_class_2') {
    withinWindow = classesAttended < 2 && elapsedMs <= 14 * DAY_MS;
    if (classesAttended >= 2) {
      reasons.push('attended_class_2_or_more_for_crash');
    } else if (!withinWindow) {
      reasons.push('exceeded_crash_refund_window');
    }
  } else {
    // standard_7d or standalone_credits
    withinWindow = elapsedMs <= 7 * DAY_MS;
    if (!withinWindow) {
      reasons.push('exceeded_7d_refund_window');
    }
  }

  // 2. Consumption percentage check (< 20% = 0.20)
  const lessonsPct =
    input.totalLessons && input.totalLessons > 0
      ? (input.lessonsCompleted ?? 0) / input.totalLessons
      : 0;
  const creditsPct =
    input.aiCreditsIncluded && input.aiCreditsIncluded > 0
      ? (input.aiCreditsUsed ?? 0) / input.aiCreditsIncluded
      : 0;
  const mocksPct =
    input.fullMocksIncluded && input.fullMocksIncluded > 0
      ? (input.fullMocksTaken ?? 0) / input.fullMocksIncluded
      : 0;

  const consumedPct =
    policy === 'standalone_credits'
      ? Number(creditsPct.toFixed(4))
      : Number(Math.max(lessonsPct, creditsPct, mocksPct).toFixed(4));

  if (policy !== 'standalone_credits' && consumedPct >= 0.20) {
    reasons.push('consumption_reached_or_exceeded_20_percent');
  }

  // 3. Full mock ceiling check (<= 1 full mock taken)
  const fullMocksTaken = input.fullMocksTaken ?? 0;
  if (fullMocksTaken > 1) {
    reasons.push('more_than_1_full_mock_taken');
  }

  // 4. Consumed AI credit deduction (D5: consumed AI credits are NEVER refunded)
  const consumedAiCredits = Math.max(0, Math.round(input.aiCreditsUsed ?? 0));
  const includedCredits = Math.max(0, Math.round(input.aiCreditsIncluded ?? 0));

  if (policy === 'standalone_credits' && includedCredits > 0 && consumedAiCredits >= includedCredits) {
    reasons.push('all_ai_credits_consumed');
  }

  let deductedCreditValueMinor = 0;
  if (consumedAiCredits > 0) {
    if (input.unitAiCreditValueMinor !== undefined) {
      deductedCreditValueMinor = consumedAiCredits * Math.round(input.unitAiCreditValueMinor);
    } else if (policy === 'standalone_credits' && includedCredits > 0) {
      // Pro-rata deduction for standalone credit packs
      const unusedCredits = Math.max(0, includedCredits - consumedAiCredits);
      const refundableStandalone = Math.floor((input.amountPaidMinor * unusedCredits) / includedCredits);
      deductedCreditValueMinor = input.amountPaidMinor - refundableStandalone;
    } else {
      // Default canonical per-credit valuation in minor units:
      // BDT: 100.00 BDT (10,000 minor) per AI credit; USD: $2.00 (200 minor) per AI credit
      const defaultUnitMinor = (input.currency ?? 'BDT') === 'BDT' ? 10000 : 200;
      deductedCreditValueMinor = consumedAiCredits * defaultUnitMinor;
    }
  }

  deductedCreditValueMinor = Math.min(input.amountPaidMinor, Math.max(0, deductedCreditValueMinor));

  const eligible = reasons.length === 0;
  const refundableMinor = eligible
    ? Math.max(0, input.amountPaidMinor - deductedCreditValueMinor)
    : 0;

  const vatBreakdown = computeVatBreakdown(refundableMinor, 1500);

  return {
    eligible,
    policyApplied: policy,
    withinWindow,
    consumedPct,
    fullMocksTaken,
    consumedAiCredits,
    deductedCreditValueMinor,
    refundableMinor,
    vatBreakdown,
    reasons,
  };
}

export interface ExecuteRefundParams {
  orderId: string;
  reason: string;
  policy?: RefundWindowPolicy;
  lessonsCompleted?: number;
  totalLessons?: number;
  aiCreditsUsed?: number;
  aiCreditsIncluded?: number;
  fullMocksTaken?: number;
  fullMocksIncluded?: number;
  liveClassesAttended?: number;
  unitAiCreditValueMinor?: number;
  certificates?: Map<string, CertificateRecord> | CertificateRecord[];
  vatRateBps?: number;
  now?: Date;
}

export interface ExecuteRefundResult {
  order: OrderRecord;
  eligibility: RefundEligibilityResult;
  refundedMinor: number;
  vatReversal: VatBreakdown; // negative entries for VAT credit note
  revokedEntitlements: EntitlementRecord[];
  revokedCertificates: CertificateRecord[];
  auditEntry: AuditLogEntry;
  idempotentReplay: boolean;
}

// Track executed refunds for idempotency
const executedRefundsByOrderId = new Map<string, ExecuteRefundResult>();

export function resetRefundState(): void {
  executedRefundsByOrderId.clear();
}

/**
 * Executes an authoritative order refund (P1-147):
 * 1. Enforces `assertCan(actor, 'order:refund')` (finance/admin with mandatory 2FA).
 * 2. Evaluates refund window and consumption limits (`< 20%` and `<= 1` mock).
 * 3. Deducts consumed AI credit value in integer minor units.
 * 4. Marks order as `refunded`, revokes entitlements, zeroes remaining ledger credits,
 *    and automatically calls `revokeCertificate` on all associated certificates.
 * 5. Computes 15% BD VAT / Mushak reversal breakdown (`net_minor`, `vat_minor`, `gross_minor`).
 */
export function executeRefund(
  actor: Actor,
  params: ExecuteRefundParams
): ExecuteRefundResult {
  // 1. Authorization & 2FA check
  assertCan(actor, 'order:refund');

  // 2. Idempotency check
  const existing = executedRefundsByOrderId.get(params.orderId);
  if (existing) {
    return {
      ...existing,
      idempotentReplay: true,
    };
  }

  const order = getOrderByRef(params.orderId);
  if (!order) {
    throw new Error(`Order '${params.orderId}' not found`);
  }

  const now = params.now ?? new Date();

  // Inspect entitlement ledger usage if not explicitly provided
  const revokePreview = revokeEntitlementOnRefund({
    userId: order.userId,
    orderId: order.id,
    entitlementId: order.entitlementId,
    productSlug: order.productSlug,
    reason: params.reason,
    now,
  });

  const aiCreditsUsed = params.aiCreditsUsed ?? revokePreview.consumedAiCredits;
  const aiCreditsIncluded =
    params.aiCreditsIncluded ??
    (revokePreview.includedAiCredits > 0 ? revokePreview.includedAiCredits : 10);
  const fullMocksTaken = params.fullMocksTaken ?? revokePreview.consumedMockAttempts;
  const fullMocksIncluded =
    params.fullMocksIncluded ??
    (revokePreview.includedMockAttempts > 0 ? revokePreview.includedMockAttempts : 4);

  const eligibility = evaluateRefundEligibility({
    orderId: order.id,
    productSlug: order.productSlug,
    policy: params.policy,
    amountPaidMinor: order.amountMinor,
    currency: order.currency,
    paidAt: order.paidAt ?? order.createdAt,
    now,
    lessonsCompleted: params.lessonsCompleted,
    totalLessons: params.totalLessons,
    aiCreditsUsed,
    aiCreditsIncluded,
    fullMocksTaken,
    fullMocksIncluded,
    liveClassesAttended: params.liveClassesAttended,
    unitAiCreditValueMinor: params.unitAiCreditValueMinor,
  });

  if (!eligibility.eligible) {
    throw new Error(
      `Order '${order.id}' is not eligible for refund: ${eligibility.reasons.join(', ')}`
    );
  }

  // 3. Automatically revoke any certificates issued for this user & course
  const revokedCertificates: CertificateRecord[] = [];
  if (params.certificates) {
    if (params.certificates instanceof Map) {
      for (const [key, cert] of params.certificates.entries()) {
        if (
          cert.userId === order.userId &&
          (cert.courseSlug === order.productSlug || cert.status === 'valid')
        ) {
          const revoked = revokeCertificate(cert, params.reason);
          params.certificates.set(key, revoked);
          revokedCertificates.push(revoked);
        }
      }
    } else if (Array.isArray(params.certificates)) {
      for (let i = 0; i < params.certificates.length; i++) {
        const cert = params.certificates[i]!;
        if (cert.userId === order.userId) {
          const revoked = revokeCertificate(cert, params.reason);
          params.certificates[i] = revoked;
          revokedCertificates.push(revoked);
        }
      }
    }
  }

  // 4. Update order status to 'refunded'
  const updatedOrder: OrderRecord = {
    ...order,
    status: 'refunded',
    refundedAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };
  updateOrderRecord(updatedOrder);

  // 5. Compute 15% BD VAT / Mushak integer minor-unit breakdown and negative credit-note reversal
  const vatRateBps = params.vatRateBps ?? 1500;
  const positiveVat = computeVatBreakdown(eligibility.refundableMinor, vatRateBps);
  const vatReversal: VatBreakdown = {
    gross_minor: -positiveVat.gross_minor,
    net_minor: -positiveVat.net_minor,
    vat_minor: -positiveVat.vat_minor,
    vatRateBps,
  };

  // 6. Append-only audit log entry
  const auditEntry = recordAuditEvent({
    actorId: actor.id,
    action: 'staff_action',
    targetType: 'order_refund',
    targetId: order.id,
    reason: params.reason,
    metadataJson: {
      orderId: order.id,
      providerRef: order.providerRef,
      refundableMinor: eligibility.refundableMinor,
      deductedCreditValueMinor: eligibility.deductedCreditValueMinor,
      consumedAiCredits: eligibility.consumedAiCredits,
      vatReversal,
      revokedCertificateIds: revokedCertificates.map((c) => c.certId),
    },
  });

  const result: ExecuteRefundResult = {
    order: updatedOrder,
    eligibility: {
      ...eligibility,
      vatBreakdown: positiveVat,
    },
    refundedMinor: eligibility.refundableMinor,
    vatReversal,
    revokedEntitlements: revokePreview.revokedEntitlements,
    revokedCertificates,
    auditEntry,
    idempotentReplay: false,
  };

  executedRefundsByOrderId.set(params.orderId, result);
  executedRefundsByOrderId.set(order.id, result);
  executedRefundsByOrderId.set(order.providerRef, result);

  return result;
}
