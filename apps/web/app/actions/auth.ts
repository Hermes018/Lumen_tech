/** @purpose Server actions for Phone OTP stub, learner onboarding, 2FA status, and guest diagnostic token claim */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  requiresTwoFactor,
  grantLedgerCredits,
  recordAuditEvent,
} from '@lumen/core';

const phoneSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{8,15}$/, 'Enter a valid E.164 phone number'),
});

const verifyPhoneOtpSchema = z.object({
  phone: z.string().regex(/^\+?[0-9]{8,15}$/),
  code: z.string().regex(/^\d{6}$/, 'OTP must be 6 digits'),
});

const onboardingSchema = z.object({
  targetExam: z.enum(['gre', 'ielts_academic', 'ielts_general']),
  targetExamDate: z.string().min(4).max(32),
  targetScore: z.string().min(1).max(20),
  currentLevel: z.enum(['beginner', 'intermediate', 'advanced']),
  ageBand: z.enum(['under_18', '18_24', '25_plus']),
  guardianEmail: z.string().email().optional().or(z.literal('')),
  diagnosticToken: z.string().max(128).optional(),
});

export type OnboardingInput = z.infer<typeof onboardingSchema>;

export async function sendPhoneOtpStubAction(rawInput: { phone: string }) {
  const { phone } = phoneSchema.parse(rawInput);
  // BD SMS gateway stub (Decision #2 in PROGRESS.md: console/DB stub for dev)
  const maskedPhone = `${phone.slice(0, 4)}****${phone.slice(-2)}`;
  console.info(`[Phone OTP Stub] Dispatched 6-digit verification code to ${maskedPhone}`);
  return {
    ok: true as const,
    maskedPhone,
    devHint: process.env.NODE_ENV !== 'production' ? 'Use dev code 123456' : undefined,
  };
}

export async function verifyPhoneOtpStubAction(rawInput: { phone: string; code: string }) {
  const { phone, code } = verifyPhoneOtpSchema.parse(rawInput);
  if (process.env.NODE_ENV !== 'production' && code === '123456') {
    return { ok: true as const, phoneVerified: true, phone };
  }
  return { ok: false as const, error: 'Invalid or expired verification code' };
}

export async function completeOnboardingAction(rawInput: OnboardingInput) {
  const input = onboardingSchema.parse(rawInput);
  const actor = await requireServerActor();
  assertCan(actor, 'user:view_own', { ownerId: actor.id });

  // Grant 2 free AI credits on onboarding (C1), idempotent per user
  grantLedgerCredits({
    userId: actor.id,
    credits: 2,
    reason: 'onboarding_free_credits',
    sourceRef: 'onboarding',
    idempotencyKey: `onboarding_free_credits:${actor.id}`,
  });

  // Claim guest diagnostic token if present
  let diagnosticClaimed = false;
  if (input.diagnosticToken && input.diagnosticToken.trim().length > 0) {
    recordAuditEvent({
      actorId: actor.id,
      action: 'staff_action',
      targetType: 'diagnostic_claim',
      targetId: input.diagnosticToken.trim(),
      reason: 'Claimed guest diagnostic attempt during onboarding',
      metadataJson: {
        targetExam: input.targetExam,
        ageBand: input.ageBand,
      },
    });
    diagnosticClaimed = true;
  }

  const roleRequires2fa = actor.roles.some((r) => requiresTwoFactor(r));

  return {
    ok: true as const,
    grantedCredits: 2,
    diagnosticClaimed,
    requires2faSetup: roleRequires2fa && !actor.twoFactorVerified,
  };
}
