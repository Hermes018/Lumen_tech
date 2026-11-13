/** @purpose Server actions for Bangladesh PDPO 2025 Guardian Consent and Data Portability / Erasure controls */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  createMinorGuardianConsentState,
  requestGuardianConsent,
  verifyGuardianOtp,
  revokeGuardianConsent,
  canMinorAccessFeature,
  exportUserDataBundle,
  requestDataDeletion,
  recordAuditEvent,
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

// In-memory session store simulation for dev / runtime state
const consentStates = new Map<string, GuardianConsentState>();

export async function getGuardianConsentStatusAction(): Promise<GuardianConsentState> {
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  let state = consentStates.get(actor.id);
  if (!state) {
    state = createMinorGuardianConsentState(actor.id);
    consentStates.set(actor.id, state);
  }
  return state;
}

export async function requestGuardianConsentAction(rawInput: {
  guardianEmail: string;
  guardianPhone: string;
}) {
  const input = requestConsentSchema.parse(rawInput);
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  const state = consentStates.get(actor.id) ?? createMinorGuardianConsentState(actor.id);

  const { state: nextState, otpNotification: _otpNotification } = requestGuardianConsent(state, {
    guardianEmail: input.guardianEmail,
    guardianPhone: input.guardianPhone,
    studentName: actor.id.slice(0, 8),
    ...(process.env.NODE_ENV === 'test' ? { mockOtp: '482910' } : {}),
  });

  consentStates.set(actor.id, nextState);
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

  const state = consentStates.get(actor.id) ?? createMinorGuardianConsentState(actor.id);

  try {
    const nextState = verifyGuardianOtp(state, input.otp);
    consentStates.set(actor.id, nextState);
    if (nextState.status === 'verified') {
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

  const state = consentStates.get(actor.id) ?? createMinorGuardianConsentState(actor.id);
  const nextState = revokeGuardianConsent(state, input.reason);
  consentStates.set(actor.id, nextState);
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
  const state = consentStates.get(actor.id) ?? createMinorGuardianConsentState(actor.id);
  return canMinorAccessFeature(state, feature);
}

export async function exportUserDataBundleAction(): Promise<UserDataBundleExport> {
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  const consent = consentStates.get(actor.id);
  return exportUserDataBundle({
    userId: actor.id,
    email: `${actor.id}@example.com`,
    name: 'Authenticated Learner',
    isMinor: true,
    guardianConsent: consent,
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
