/**
 * @purpose Unit tests for Human Grader Queue, AI Score Override, and Append-Only Audit Log
 */

import { describe, it, expect } from 'vitest';
import {
  listGraderQueue,
  submitHumanGradeOverride,
  calculateAgreementKpis,
  getAuditLogs,
  calculateAwaMeanScore,
  AwaHalfGridSchema,
} from '../grader/queue';
import type { Actor } from '../auth/policy';
import { TwoFactorRequiredError, AuthorizationError } from '../auth/policy';

describe('Human Grader Queue & Audit Engine', () => {
  const graderWith2FA: Actor = {
    id: 'grader-alice',
    roles: ['grader'],
    hasTwoFactorEnabled: true,
  };

  const graderWithout2FA: Actor = {
    id: 'grader-bob',
    roles: ['grader'],
    hasTwoFactorEnabled: false,
  };

  const studentActor: Actor = {
    id: 'student-charlie',
    roles: ['student'],
    hasTwoFactorEnabled: false,
  };

  describe('RBAC & 2FA Enforcement (D4)', () => {
    it('allows grader with 2FA to list and grade submissions', () => {
      const items = listGraderQueue(graderWith2FA);
      expect(items.length).toBeGreaterThan(0);
    });

    it('rejects grader without 2FA with TwoFactorRequiredError', () => {
      expect(() => listGraderQueue(graderWithout2FA)).toThrow(TwoFactorRequiredError);
    });

    it('rejects unauthorized roles (student) with AuthorizationError', () => {
      expect(() => listGraderQueue(studentActor)).toThrow(AuthorizationError);
    });
  });

  describe('0.5 Step Grid Math', () => {
    it('validates 0.5 step numbers', () => {
      expect(AwaHalfGridSchema.parse(3.5)).toBe(3.5);
      expect(AwaHalfGridSchema.parse(4.0)).toBe(4.0);
      expect(AwaHalfGridSchema.parse(0.0)).toBe(0.0);
      expect(AwaHalfGridSchema.parse(6.0)).toBe(6.0);
      expect(() => AwaHalfGridSchema.parse(3.3)).toThrow();
    });

    it('calculates mean score rounded to 0.5', () => {
      const score = calculateAwaMeanScore({
        position_insight: 4.0,
        support_reasoning: 3.5,
        organization_focus: 4.5,
        language_use: 4.0,
      });
      expect(score).toBe(4.0);
    });
  });

  describe('Mandatory Override Rationale (D4/D7)', () => {
    it('rejects grade submission if rationale is shorter than 20 chars', () => {
      expect(() =>
        submitHumanGradeOverride(graderWith2FA, {
          queueItemId: 'queue-item-01',
          dimensions: {
            position_insight: 4.5,
            support_reasoning: 4.0,
            organization_focus: 4.5,
            language_use: 4.5,
          },
          rationale: 'Looks better.', // only 13 chars
        })
      ).toThrow(/Mandatory rationale required: minimum 20 characters/);
    });

    it('accepts grade submission when detailed rationale is provided', () => {
      const result = submitHumanGradeOverride(graderWith2FA, {
        queueItemId: 'queue-item-01',
        dimensions: {
          position_insight: 4.5,
          support_reasoning: 4.0,
          organization_focus: 4.5,
          language_use: 4.5,
        },
        rationale: 'Student demonstrated exceptional insight into industrial ergonomics and ethical technology trade-offs.',
      });

      expect(result.withinHalfPoint).toBe(true); // AI was 4.0, human is 4.5 (delta 0.5)
      expect(result.delta).toBe(0.5);
      expect(result.queueItem.status).toBe('graded');
      expect(result.queueItem.humanEvaluation?.graderId).toBe('grader-alice');
    });
  });

  describe('Agreement KPI & Append-Only Audit Logging', () => {
    it('computes agreement KPIs matching docs/02 §14 target (>=80%)', () => {
      const kpis = calculateAgreementKpis();
      expect(kpis.totalGraded).toBeGreaterThan(0);
      expect(kpis.agreementRatePercent).toBeGreaterThanOrEqual(80);
      expect(kpis.meetsTarget).toBe(true);
    });

    it('emits append-only audit log entry with metadata per D7', () => {
      const logs = getAuditLogs('sub-awa-01');
      expect(logs.length).toBeGreaterThan(0);

      const latestLog = logs[logs.length - 1];
      expect(latestLog).toBeDefined();
      expect(latestLog?.actorId).toBe('grader-alice');
      expect(latestLog?.action).toBe('grade_override');
      expect(latestLog?.reason).toContain('ergonomics');
      expect(latestLog?.metadataJson.aiScore).toBe(4.0);
    });
  });
});
