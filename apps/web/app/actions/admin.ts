/** @purpose Server actions for Admin Console role management with D4 super_admin guard and immutable audit logging */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCanGrantRole,
  recordAuditEvent,
  ROLES,
  type Role,
  type AuditLogEntry,
} from '@lumen/core';

const changeUserRoleSchema = z.object({
  userId: z.string().min(1).max(64),
  targetRole: z.enum(ROLES),
});

export interface ChangeUserRoleResult {
  ok: boolean;
  userId: string;
  targetRole: Role;
  auditEntry: AuditLogEntry;
  error?: string;
}

export async function changeUserRoleAction(rawInput: {
  userId: string;
  targetRole: Role;
}): Promise<ChangeUserRoleResult> {
  const parsed = changeUserRoleSchema.parse(rawInput);
  const actor = await requireServerActor({ requireTwoFactor: true, roles: ['admin'] });

  try {
    assertCanGrantRole(actor, parsed.targetRole);
  } catch (err) {
    const reason = err instanceof Error ? err.message : 'Forbidden';
    const auditEntry = recordAuditEvent({
      actorId: actor.id,
      action: 'security:role_escalation_blocked',
      targetType: 'user',
      targetId: parsed.userId,
      reason,
      metadataJson: {
        actorRole: actor.roles[0] ?? 'admin',
        targetRole: parsed.targetRole,
      },
    });
    return {
      ok: false,
      userId: parsed.userId,
      targetRole: parsed.targetRole,
      auditEntry,
      error: reason,
    };
  }

  const auditEntry = recordAuditEvent({
    actorId: actor.id,
    action: 'user:role_update',
    targetType: 'user',
    targetId: parsed.userId,
    reason: `Updated role to ${parsed.targetRole}`,
    metadataJson: {
      actorRole: actor.roles[0] ?? 'admin',
      targetRole: parsed.targetRole,
    },
  });

  return {
    ok: true,
    userId: parsed.userId,
    targetRole: parsed.targetRole,
    auditEntry,
  };
}
