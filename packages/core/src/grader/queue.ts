/**
 * @purpose Human Grader Queue, AI Score Override, Agreement KPI, and Append-Only Audit Log
 * Conforms to docs/00-DECISIONS.md D4, D7, and docs/31-AI-EVALUATION-OPERATIONS.md §13.
 */

import { z } from '@lumen/config';
import { assertCan, type Actor } from '../auth/policy';
import { getRepositories, type GraderQueueItem as DbGraderQueueItem } from '@lumen/db';

/** 0.5 grid validator for GRE AWA 0–6 scoring */
export const AwaHalfGridSchema = z
  .number()
  .min(0)
  .max(6)
  .refine((x) => Number.isInteger(Math.round(x * 10) / 5), {
    message: 'Score must be on the 0.5 grid (e.g., 3.0, 3.5, 4.0)',
  });

export const RubricDimensionsSchema = z.object({
  position_insight: AwaHalfGridSchema,
  support_reasoning: AwaHalfGridSchema,
  organization_focus: AwaHalfGridSchema,
  language_use: AwaHalfGridSchema,
});

export type RubricDimensions = z.infer<typeof RubricDimensionsSchema>;

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action:
    | 'grade_override'
    | 'grade_submitted'
    | 'queue_assigned'
    | 'role_change'
    | 'staff_action'
    | 'support:impersonation_started'
    | 'user:role_update'
    | 'security:role_escalation_blocked';
  targetType: string;
  targetId: string;
  reason: string;
  metadataJson: Record<string, unknown>;
  createdAt: string;
}

export interface GraderQueueItem {
  id: string;
  submissionId: string;
  examAttemptId: string;
  learnerId: string;
  promptMd: string;
  essayText: string;
  wordCount: number;
  submittedAt: string;
  status: 'queued' | 'in_review' | 'graded';
  assignedGraderId?: string;
  aiEvaluation: {
    score: number;
    dimensions: RubricDimensions;
    feedback: string;
  };
  humanEvaluation?: {
    score: number;
    dimensions: RubricDimensions;
    rationale: string;
    graderId: string;
    gradedAt: string;
    withinHalfPoint: boolean;
    delta: number;
  };
}

export interface SubmitGradeInput {
  queueItemId: string;
  dimensions: RubricDimensions;
  rationale: string;
}

// Append-only audit log store
const auditLogProtocol: AuditLogEntry[] = [];

export function recordAuditEvent(entry: Omit<AuditLogEntry, 'id' | 'createdAt'>): AuditLogEntry {
  const fullEntry: AuditLogEntry = {
    ...entry,
    id: `audit-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    createdAt: new Date().toISOString(),
  };
  auditLogProtocol.push(Object.freeze(fullEntry));
  try {
    void getRepositories().grading.saveAuditEvent(fullEntry);
  } catch {
    // repository persistence
  }
  return fullEntry;
}

export function getAuditLogs(targetId?: string): readonly AuditLogEntry[] {
  if (targetId) {
    return auditLogProtocol.filter((e) => e.targetId === targetId);
  }
  return [...auditLogProtocol];
}

/** Calculate mean score of 4 dimensions rounded to 0.5 step */
export function calculateAwaMeanScore(dimensions: RubricDimensions): number {
  const mean =
    (dimensions.position_insight +
      dimensions.support_reasoning +
      dimensions.organization_focus +
      dimensions.language_use) /
    4;
  return Math.round(mean * 2) / 2;
}

/** In-memory mock queue items for demo and test evaluation */
const queueStore = new Map<string, GraderQueueItem>([
  [
    'queue-item-01',
    {
      id: 'queue-item-01',
      submissionId: 'sub-awa-01',
      examAttemptId: 'attempt-gre-01',
      learnerId: 'learner-101',
      promptMd:
        'The primary goal of technological advancement should be to increase human well-being, rather than economic efficiency.\n\nWrite a response in which you discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take.',
      essayText:
        'Technological development has fundamentally reshaped human existence throughout modern history. While critics argue that economic efficiency is paramount for productivity and resource allocation, I contend that human well-being must serve as the primary criterion for innovation. First, technological progress without regard for well-being frequently exacerbates socioeconomic inequalities and mental distress. For example, algorithmic optimization in industrial workplaces often maximizes quarterly output while causing severe worker burnout. Second, breakthrough developments in medicine and clean energy illustrate that prioritizing human health yields enduring economic benefits in the long run. In conclusion, technology that ignores human flourishing is ultimately self-defeating.',
      wordCount: 104,
      submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      status: 'queued',
      aiEvaluation: {
        score: 4.0,
        dimensions: {
          position_insight: 4.0,
          support_reasoning: 3.5,
          organization_focus: 4.5,
          language_use: 4.0,
        },
        feedback:
          'Clear position with relevant supporting examples. The argument would benefit from deeper analysis of counterarguments regarding market incentives.',
      },
    },
  ],
  [
    'queue-item-02',
    {
      id: 'queue-item-02',
      submissionId: 'sub-awa-02',
      examAttemptId: 'attempt-gre-02',
      learnerId: 'learner-102',
      promptMd:
        'Governments should place few, if any, restrictions on scientific research and development.',
      essayText:
        'Scientific research is the foundation of societal progress and knowledge discovery. However, unrestricted scientific development carries profound ethical hazards. Gene editing and autonomous weaponry demonstrate that without ethical boundaries, technological capability can surpass human moral preparedness. Therefore, governments must impose thoughtful regulatory frameworks that safeguard safety while preserving academic freedom.',
      wordCount: 57,
      submittedAt: new Date(Date.now() - 3600000 * 8).toISOString(),
      status: 'queued',
      aiEvaluation: {
        score: 3.5,
        dimensions: {
          position_insight: 3.5,
          support_reasoning: 3.5,
          organization_focus: 4.0,
          language_use: 3.5,
        },
        feedback: 'Solid foundational claim, but brevity limits development of complex counter-claims.',
      },
    },
  ],
]);

/**
 * List grader queue items
 */
export function listGraderQueue(actor: Actor): GraderQueueItem[] {
  assertCan(actor, 'submission:grade');
  return Array.from(queueStore.values());
}

/**
 * Get single queue item by ID
 */
export function getGraderQueueItem(actor: Actor, queueItemId: string): GraderQueueItem | null {
  assertCan(actor, 'submission:grade');
  return queueStore.get(queueItemId) ?? null;
}

export interface SubmitGradeResult {
  queueItem: GraderQueueItem;
  withinHalfPoint: boolean;
  delta: number;
  auditEntry: AuditLogEntry;
}

/**
 * Human grader score submission with mandatory rationale and append-only audit logging
 */
export function submitHumanGradeOverride(
  actor: Actor,
  input: SubmitGradeInput
): SubmitGradeResult {
  // 1. RBAC & 2FA Enforcement
  assertCan(actor, 'submission:grade');

  // 2. Validate Rationale length (min 20 chars per prompt / D4)
  const cleanRationale = input.rationale.trim();
  if (cleanRationale.length < 20) {
    throw new Error(
      `Mandatory rationale required: minimum 20 characters explaining the grading decision (provided: ${cleanRationale.length} chars).`
    );
  }

  // 3. Validate Dimensions on 0.5 grid
  const validDimensions = RubricDimensionsSchema.parse(input.dimensions);
  const humanScore = calculateAwaMeanScore(validDimensions);

  // 4. Retrieve queue item
  const item = queueStore.get(input.queueItemId);
  if (!item) {
    throw new Error(`Queue item '${input.queueItemId}' not found`);
  }

  // 5. Calculate agreement delta
  const delta = Math.abs(humanScore - item.aiEvaluation.score);
  const withinHalfPoint = delta <= 0.5;

  // 6. Update Queue Item
  const humanEvaluation = {
    score: humanScore,
    dimensions: validDimensions,
    rationale: cleanRationale,
    graderId: actor.id,
    gradedAt: new Date().toISOString(),
    withinHalfPoint,
    delta,
  };

  item.status = 'graded';
  item.assignedGraderId = actor.id;
  item.humanEvaluation = humanEvaluation;
  queueStore.set(item.id, item);

  try {
    void getRepositories().grading.saveQueueItem(item as unknown as DbGraderQueueItem);
  } catch {
    // repository persistence
  }

  // 7. Emit Append-Only Audit Log Event (D7)
  const auditEntry = recordAuditEvent({
    actorId: actor.id,
    action: delta > 0 ? 'grade_override' : 'grade_submitted',
    targetType: 'awa_submission',
    targetId: item.submissionId,
    reason: cleanRationale,
    metadataJson: {
      queueItemId: item.id,
      examAttemptId: item.examAttemptId,
      learnerId: item.learnerId,
      aiScore: item.aiEvaluation.score,
      humanScore,
      delta,
      withinHalfPoint,
      dimensions: validDimensions,
    },
  });

  return {
    queueItem: item,
    withinHalfPoint,
    delta,
    auditEntry,
  };
}

/**
 * Calculates human-vs-AI agreement KPIs across graded queue items
 * Target >= 80% agreement within 0.5 points per docs/02 §14
 */
export function calculateAgreementKpis(): {
  totalGraded: number;
  withinHalfPointCount: number;
  agreementRatePercent: number;
  averageDelta: number;
  meetsTarget: boolean; // target >= 80%
} {
  const items = Array.from(queueStore.values()).filter((i) => i.humanEvaluation);
  const total = items.length;

  if (total === 0) {
    return {
      totalGraded: 0,
      withinHalfPointCount: 0,
      agreementRatePercent: 100, // baseline
      averageDelta: 0,
      meetsTarget: true,
    };
  }

  const withinCount = items.filter((i) => i.humanEvaluation?.withinHalfPoint).length;
  const totalDelta = items.reduce((sum, i) => sum + (i.humanEvaluation?.delta ?? 0), 0);

  const rate = Math.round((withinCount / total) * 1000) / 10;
  const avgDelta = Math.round((totalDelta / total) * 100) / 100;

  return {
    totalGraded: total,
    withinHalfPointCount: withinCount,
    agreementRatePercent: rate,
    averageDelta: avgDelta,
    meetsTarget: rate >= 80.0,
  };
}
