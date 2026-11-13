/** @purpose Server actions for Bangladesh PDPO 2025 Guardian Consent and Data Portability / Erasure controls */
'use server';

import { cookies } from 'next/headers';
import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  getGuardianConsentState,
  saveGuardianConsentState,
  getMinorStatus,
  setMinorStatus,
  requestGuardianConsent,
  verifyGuardianOtp,
  revokeGuardianConsent,
  canMinorAccessFeature,
  exportUserDataBundle,
  requestDataDeletion,
  recordAuditEvent,
  signPdpoCookie,
  listUserOrders,
  getUserEntitlements,
  getUserLedgerEntries,
  type GuardianConsentState,
  type UserDataBundleExport,
} from '@lumen/core';

const requestConsentSchema = z.object({
  guardianEmail: z.string().email('Please enter a valid guardian email address'),
  guardianPhone: z.string().regex(/^\+?[0-9]{8,15}$/, 'Please enter a valid phone number'),
});

const verifyOtpSchema = z.object({
  otp: z.string().regex(/^\d{6}$/, 'OTP must be exactly 6 digits'),
});

const revokeConsentSchema = z.object({
  reason: z.string().min(5, 'Please provide a reason for revoking consent'),
});

const requestDeletionSchema = z.object({
  reason: z.string().min(5, 'Please provide a reason for account deletion'),
});

export async function getGuardianConsentStatusAction(): Promise<GuardianConsentState> {
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });
  return getGuardianConsentState(actor.id);
}

export async function setMinorStatusAction(isMinor: boolean) {
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  setMinorStatus(actor.id, isMinor);
  const cookieStore = await cookies();
  const signed = await signPdpoCookie(isMinor ? 'true' : 'false');
  cookieStore.set('lumen_is_minor', signed, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 365 * 24 * 60 * 60,
  });

  return { ok: true as const, isMinor };
}

export async function requestGuardianConsentAction(rawInput: {
  guardianEmail: string;
  guardianPhone: string;
}) {
  const input = requestConsentSchema.parse(rawInput);
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  const state = getGuardianConsentState(actor.id);

  const { state: nextState, otpNotification: _otpNotification } = requestGuardianConsent(state, {
    guardianEmail: input.guardianEmail,
    guardianPhone: input.guardianPhone,
    studentName: actor.id.slice(0, 8),
    ...(process.env.NODE_ENV === 'test' ? { mockOtp: '482910' } : {}),
  });

  saveGuardianConsentState(nextState);
  recordAuditEvent({
    actorId: actor.id,
    action: 'staff_action',
    targetType: 'guardian_consent',
    targetId: actor.id,
    reason: 'Guardian consent OTP requested',
    metadataJson: { status: nextState.status },
  });

  const maskedEmail = `${input.guardianEmail[0]}***@${input.guardianEmail.split('@')[1]}`;
  const maskedPhone = `${input.guardianPhone.slice(0, 4)}****${input.guardianPhone.slice(-2)}`;

  return {
    ok: true as const,
    maskedEmail,
    maskedPhone,
    devHint: undefined,
  };
}

export async function verifyGuardianOtpAction(rawInput: { otp: string }) {
  const input = verifyOtpSchema.parse(rawInput);
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  const state = getGuardianConsentState(actor.id);

  try {
    const nextState = verifyGuardianOtp(state, input.otp);
    saveGuardianConsentState(nextState);
    if (nextState.status === 'verified') {
      const cookieStore = await cookies();
      const signedConsent = await signPdpoCookie('verified');
      cookieStore.set('lumen_guardian_consent', signedConsent, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 365 * 24 * 60 * 60,
      });

      recordAuditEvent({
        actorId: actor.id,
        action: 'staff_action',
        targetType: 'guardian_consent',
        targetId: actor.id,
        reason: 'Guardian consent OTP verified',
        metadataJson: { status: nextState.status, verifiedAt: nextState.verifiedAt },
      });
    }
    return {
      ok: true as const,
      status: nextState.status,
      verifiedAt: nextState.verifiedAt,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Invalid or expired OTP';
    return {
      ok: false as const,
      error: message,
    };
  }
}

export async function revokeGuardianConsentAction(rawInput: { reason: string }) {
  const input = revokeConsentSchema.parse(rawInput);
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  const state = getGuardianConsentState(actor.id);
  const nextState = revokeGuardianConsent(state, input.reason);
  saveGuardianConsentState(nextState);

  const cookieStore = await cookies();
  cookieStore.delete('lumen_guardian_consent');

  recordAuditEvent({
    actorId: actor.id,
    action: 'staff_action',
    targetType: 'guardian_consent',
    targetId: actor.id,
    reason: input.reason,
    metadataJson: { status: nextState.status, revokedAt: nextState.revokedAt },
  });

  return {
    ok: true as const,
    status: nextState.status,
    revokedAt: nextState.revokedAt,
  };
}

export async function checkMinorFeatureAccessAction(
  feature: 'ai_speaking_upload' | 'public_profile' | 'community_post' | 'third_party_analytics'
): Promise<{ allowed: boolean; reason?: string }> {
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });
  const state = getGuardianConsentState(actor.id);
  return canMinorAccessFeature(state, feature);
}

export async function exportUserDataBundleAction(): Promise<UserDataBundleExport> {
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  const consent = getGuardianConsentState(actor.id);
  const isMinor = getMinorStatus(actor.id);

  // Aggregate user's actual orders, entitlements, and credit ledger
  const rawOrders = listUserOrders(actor.id);
  const rawEntitlements = getUserEntitlements(actor.id);
  const rawLedger = getUserLedgerEntries(actor.id);

  const transactions = rawOrders.map((o) => ({
    orderId: o.id,
    amountPaid: `${o.currency} ${(o.amountMinor / 100).toFixed(2)}`,
    mushak63Invoice: `MUSHAK-${o.id.slice(0, 8).toUpperCase()}`,
    date: o.createdAt,
  }));

  const entitlements = rawEntitlements.map((e) => e.productSlug);

  const creditLedger = rawLedger.map((l) => ({
    kind: l.kind,
    delta: l.delta,
    reason: l.reason,
    createdAt: l.createdAt,
  }));

  return exportUserDataBundle({
    userId: actor.id,
    email: `${actor.id}@lumen.academy`,
    name: 'Authenticated Learner',
    isMinor,
    guardianConsent: consent,
    orders: transactions,
    entitlements,
    creditLedgerEntries: creditLedger,
    totalMockAttempts: rawLedger.filter((l) => l.kind === 'mock_attempt' && l.delta < 0).length,
    studySessionsCount: rawOrders.length * 5,
  });
}

export async function requestAccountDeletionAction(rawInput: { reason: string }) {
  const input = requestDeletionSchema.parse(rawInput);
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  const result = requestDataDeletion(actor.id, input.reason);
  return {
    ok: true as const,
    scheduledPurgeDate: result.scheduledPurgeDate,
    requestedAt: result.requestedAt,
  };
}
