import { describe, it, expect } from 'vitest';
import {
  can,
  assertCan,
  AuthorizationError,
  TwoFactorRequiredError,
  type Actor,
} from '../index.js';

describe('RBAC Policy Engine & assertCan (00-DECISIONS.md D4, 06-API-AND-SERVICES.md §1)', () => {
  describe('Role-based Allow/Deny Matrix', () => {
    it('allows guest to view courses only', () => {
      const guest: Actor = { id: 'guest_1', roles: ['guest'] };
      expect(can(guest, 'course:view')).toBe(true);
      expect(can(guest, 'exam:take')).toBe(false);
      expect(can(guest, 'order:create')).toBe(false);

      expect(() => assertCan(guest, 'course:view')).not.toThrow();
      expect(() => assertCan(guest, 'exam:take')).toThrow(AuthorizationError);
    });

    it('allows student to take exams, practice, and place orders', () => {
      const student: Actor = { id: 'student_1', roles: ['student'] };
      expect(can(student, 'exam:take')).toBe(true);
      expect(can(student, 'practice:session')).toBe(true);
      expect(can(student, 'vocab:study')).toBe(true);
      expect(can(student, 'order:create')).toBe(true);

      // Denied actions
      expect(can(student, 'exam:grade')).toBe(false);
      expect(can(student, 'course:create')).toBe(false);
      expect(can(student, 'order:refund')).toBe(false);
      expect(can(student, 'org:manage')).toBe(false);
    });

    it('allows guardian to view consenting student exam results', () => {
      const guardian: Actor = { id: 'guardian_1', roles: ['guardian'] };

      // Consenting student
      const consentingResource = {
        ownerId: 'student_1',
        consentingStudentIds: ['student_1'],
      };
      expect(can(guardian, 'exam:view_own', consentingResource)).toBe(true);

      // Non-consenting student
      const nonConsentingResource = {
        ownerId: 'student_2',
        consentingStudentIds: ['student_1'],
      };
      expect(can(guardian, 'exam:view_own', nonConsentingResource)).toBe(false);
    });

    it('enforces instructor ownership on course editing', () => {
      const instructor: Actor = {
        id: 'inst_1',
        roles: ['instructor'],
        hasTwoFactorEnabled: true,
      };

      // Own course
      expect(can(instructor, 'course:edit', { ownerId: 'inst_1' })).toBe(true);

      // Another instructor's course
      expect(can(instructor, 'course:edit', { ownerId: 'inst_2' })).toBe(false);
    });

    it('allows grader with 2FA to grade and review exams', () => {
      const grader: Actor = {
        id: 'grader_1',
        roles: ['grader'],
        hasTwoFactorEnabled: true,
      };

      expect(can(grader, 'exam:grade')).toBe(true);
      expect(can(grader, 'exam:review')).toBe(true);
      expect(can(grader, 'order:refund')).toBe(false);
    });

    it('allows content_editor with 2FA to publish courses and exams', () => {
      const editor: Actor = {
        id: 'editor_1',
        roles: ['content_editor'],
        hasTwoFactorEnabled: true,
      };

      expect(can(editor, 'course:publish')).toBe(true);
      expect(can(editor, 'exam:publish')).toBe(true);
      expect(can(editor, 'order:refund')).toBe(false);
    });

    it('allows finance with 2FA to refund and export financial data', () => {
      const finance: Actor = {
        id: 'fin_1',
        roles: ['finance'],
        hasTwoFactorEnabled: true,
      };

      expect(can(finance, 'order:refund')).toBe(true);
      expect(can(finance, 'finance:export')).toBe(true);
      expect(can(finance, 'exam:grade')).toBe(false);
    });

    it('allows super_admin full bypass', () => {
      const superAdmin: Actor = {
        id: 'super_1',
        roles: ['super_admin'],
        hasTwoFactorEnabled: true,
      };

      expect(can(superAdmin, 'exam:grade')).toBe(true);
      expect(can(superAdmin, 'course:publish')).toBe(true);
      expect(can(superAdmin, 'order:refund')).toBe(true);
      expect(can(superAdmin, 'user:impersonate')).toBe(true);
    });
  });

  describe('Mandatory 2FA Enforcement (00-DECISIONS.md D4)', () => {
    const rolesRequiring2FA: readonly (readonly [Actor['roles'][number]])[] = [
      ['instructor'],
      ['grader'],
      ['content_editor'],
      ['support'],
      ['finance'],
      ['org_admin'],
      ['admin'],
      ['super_admin'],
    ];

    rolesRequiring2FA.forEach(([role]) => {
      it(`denies ${role} when 2FA is disabled and throws TwoFactorRequiredError`, () => {
        const actor: Actor = {
          id: `user_${role}`,
          roles: [role],
          hasTwoFactorEnabled: false,
        };

        expect(can(actor, 'course:view')).toBe(false);
        expect(() => assertCan(actor, 'course:view')).toThrow(TwoFactorRequiredError);
      });

      it(`allows ${role} when 2FA is enabled`, () => {
        const actor: Actor = {
          id: `user_${role}`,
          roles: [role],
          hasTwoFactorEnabled: true,
        };

        expect(can(actor, 'course:view')).toBe(true);
        expect(() => assertCan(actor, 'course:view')).not.toThrow();
      });
    });

    it('does not require 2FA for student, guest, or guardian', () => {
      const student: Actor = {
        id: 'student_1',
        roles: ['student'],
        hasTwoFactorEnabled: false,
      };

      expect(can(student, 'exam:take')).toBe(true);
      expect(() => assertCan(student, 'exam:take')).not.toThrow();
    });
  });

  describe('Multi-tenant and Student Isolation', () => {
    it('isolates org_admin to their assigned organization', () => {
      const orgAdmin: Actor = {
        id: 'org_admin_1',
        roles: ['org_admin'],
        orgId: 'org_north_south',
        hasTwoFactorEnabled: true,
      };

      // Same organization
      expect(can(orgAdmin, 'org:manage', { orgId: 'org_north_south' })).toBe(true);

      // Cross-organization attempt blocked
      expect(can(orgAdmin, 'org:manage', { orgId: 'org_brac' })).toBe(false);
      expect(() =>
        assertCan(orgAdmin, 'org:manage', { orgId: 'org_brac' })
      ).toThrow(AuthorizationError);
    });

    it('isolates students from other students attempt results', () => {
      const studentA: Actor = { id: 'student_a', roles: ['student'] };

      expect(can(studentA, 'exam:view_own', { ownerId: 'student_a' })).toBe(true);
      expect(can(studentA, 'exam:view_own', { ownerId: 'student_b' })).toBe(false);
      expect(() =>
        assertCan(studentA, 'exam:view_own', { ownerId: 'student_b' })
      ).toThrow(AuthorizationError);
    });
  });
});
