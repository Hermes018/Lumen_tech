/** @purpose Server actions for Human Grader Workstation, AI score overrides, and audit log */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  listGraderQueue,
  getGraderQueueItem,
  submitHumanGradeOverride,
  calculateAgreementKpis,
  getAuditLogs,
  RubricDimensionsSchema,
  type GraderQueueItem,
  type SubmitGradeInput,
  type SubmitGradeResult,
  type Actor,
  type AuditLogEntry,
} from '@lumen/core';

const queueItemIdSchema = z.string().min(1).max(120);

const submitGradeOverrideSchema = z.object({
  queueItemId: z.string().min(1),
  dimensions: RubricDimensionsSchema,
  rationale: z.string().min(1),
});

const auditTargetIdSchema = z.string().optional();

async function resolveGraderActor(): Promise<Actor> {
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.LUMEN_STRICT_AUTH !== '1'
  ) {
    return {
      id: 'staff-grader-01',
      roles: ['grader'],
      hasTwoFactorEnabled: true,
    };
  }
  const actor = await requireServerActor({ requireTwoFactor: true });
  return actor;
}

export async function listGraderQueueAction(): Promise<GraderQueueItem[]> {
  const actor = await resolveGraderActor();
  assertCan(actor, 'submission:grade');
  return listGraderQueue(actor);
}

export async function getGraderQueueItemAction(rawQueueItemId: string): Promise<GraderQueueItem | null> {
  const queueItemId = queueItemIdSchema.parse(rawQueueItemId);
  const actor = await resolveGraderActor();
  assertCan(actor, 'submission:grade');
  return getGraderQueueItem(actor, queueItemId);
}

export async function submitGradeOverrideAction(rawInput: SubmitGradeInput): Promise<SubmitGradeResult> {
  const input = submitGradeOverrideSchema.parse(rawInput);
  const actor = await resolveGraderActor();
  assertCan(actor, 'submission:grade');
  return submitHumanGradeOverride(actor, input);
}

export async function getGraderKpisAction() {
  const actor = await resolveGraderActor();
  assertCan(actor, 'submission:grade');
  return calculateAgreementKpis();
}

export async function getAuditLogsAction(rawTargetId?: string): Promise<readonly AuditLogEntry[]> {
  const targetId = auditTargetIdSchema.parse(rawTargetId);
  const actor = await resolveGraderActor();
  assertCan(actor, 'submission:grade');
  return getAuditLogs(targetId);
}
