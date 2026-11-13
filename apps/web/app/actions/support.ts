/** @purpose Server actions for Staff Support Desk, Masked PII lookup, and Macro responses (docs/27 §16) */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  listStaffSupportTickets,
  getStaffSupportTicket,
  applySupportMacro,
  startSupportImpersonation,
  assertSupportRefundTierCap,
  SUPPORT_MACROS,
  type Actor,
  type MaskedSupportTicket,
  type SupportMacro,
  type SupportTicketStatus,
  type SupportPriority,
  type SupportImpersonationSession,
} from '@lumen/core';

const filterSchema = z
  .object({
    search: z.string().max(100).optional(),
    status: z
      .enum(['open', 'pending_customer', 'pending_staff', 'resolved', 'closed'])
      .optional(),
    priority: z.enum(['p0', 'p1', 'p2', 'p3']).optional(),
  })
  .optional();

const ticketIdSchema = z.string().min(1).max(64);

const applyMacroSchema = z.object({
  ticketId: z.string().min(1).max(64),
  macroCode: z.string().min(1).max(64),
  replacements: z.record(z.string(), z.string()).optional(),
});

async function resolveSupportActor(): Promise<Actor> {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.LUMEN_STRICT_AUTH !== '1'
  ) {
    return {
      id: 'staff-support-01',
      roles: ['support'],
      hasTwoFactorEnabled: true,
    };
  }
  const actor = await requireServerActor({ requireTwoFactor: true });
  return actor;
}

export async function listStaffSupportTicketsAction(
  filter?: {
    search?: string;
    status?: SupportTicketStatus;
    priority?: SupportPriority;
  }
): Promise<MaskedSupportTicket[]> {
  const parsed = filterSchema.parse(filter);
  const actor = await resolveSupportActor();
  assertCan(actor, 'support:read');
  return listStaffSupportTickets(actor, parsed);
}

export async function getStaffSupportTicketAction(
  ticketId: string
): Promise<MaskedSupportTicket> {
  const parsedId = ticketIdSchema.parse(ticketId);
  const actor = await resolveSupportActor();
  assertCan(actor, 'support:read');
  return getStaffSupportTicket(actor, parsedId);
}

export async function applySupportMacroAction(input: {
  ticketId: string;
  macroCode: string;
  replacements?: Record<string, string>;
}): Promise<MaskedSupportTicket> {
  const parsed = applyMacroSchema.parse(input);
  const actor = await resolveSupportActor();
  assertCan(actor, 'support:manage');
  return applySupportMacro(
    actor,
    parsed.ticketId,
    parsed.macroCode,
    parsed.replacements
  );
}

export async function listAvailableMacrosAction(): Promise<SupportMacro[]> {
  const actor = await resolveSupportActor();
  assertCan(actor, 'support:read');
  return SUPPORT_MACROS;
}

const impersonateSchema = z.object({
  targetUserId: z.string().min(1).max(64),
  reason: z.string().trim().min(10).max(500),
});

export async function startSupportImpersonationAction(rawInput: {
  targetUserId: string;
  reason: string;
}): Promise<SupportImpersonationSession> {
  const parsed = impersonateSchema.parse(rawInput);
  const actor = await resolveSupportActor();
  return startSupportImpersonation(actor, parsed.targetUserId, parsed.reason);
}

const supportRefundSchema = z.object({
  ticketId: z.string().min(1).max(64),
  amountMinor: z.number().int().positive(),
  currency: z.enum(['BDT', 'USD']).default('BDT'),
});

export async function approveSupportTierRefundAction(rawInput: {
  ticketId: string;
  amountMinor: number;
  currency?: 'BDT' | 'USD';
}): Promise<{ ok: true; ticketId: string; amountMinor: number; currency: 'BDT' | 'USD' }> {
  const parsed = supportRefundSchema.parse(rawInput);
  const actor = await resolveSupportActor();
  assertSupportRefundTierCap(actor, parsed.amountMinor, parsed.currency);
  return {
    ok: true,
    ticketId: parsed.ticketId,
    amountMinor: parsed.amountMinor,
    currency: parsed.currency,
  };
}
