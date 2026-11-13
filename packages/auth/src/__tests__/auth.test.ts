import { describe, it, expect, afterEach } from 'vitest';
import {
  ROLES,
  PERMISSIONS,
  ROLES_REQUIRING_2FA,
  requiresTwoFactor,
  isStaffRole,
  ROLE_PERMISSIONS,
  auth,
  authClient,
  requireServerActor,
  getServerActor,
  __setTestServerActor,
  AuthError,
} from '../index';

describe('@lumen/auth exports and permissions', () => {
  afterEach(() => {
    __setTestServerActor(undefined);
  });

  it('defines all 11 additive roles per 00-DECISIONS.md D4', () => {
    expect(ROLES).toHaveLength(11);
    expect(ROLES).toContain('guest');
    expect(ROLES).toContain('student');
    expect(ROLES).toContain('guardian');
    expect(ROLES).toContain('instructor');
    expect(ROLES).toContain('grader');
    expect(ROLES).toContain('content_editor');
    expect(ROLES).toContain('support');
    expect(ROLES).toContain('finance');
    expect(ROLES).toContain('org_admin');
    expect(ROLES).toContain('admin');
    expect(ROLES).toContain('super_admin');
  });

  it('mandates 2FA for staff, instructor, and org_admin per D4', () => {
    expect(ROLES_REQUIRING_2FA.size).toBe(8);
    expect(requiresTwoFactor('student')).toBe(false);
    expect(requiresTwoFactor('guest')).toBe(false);
    expect(requiresTwoFactor('guardian')).toBe(false);

    expect(requiresTwoFactor('instructor')).toBe(true);
    expect(requiresTwoFactor('grader')).toBe(true);
    expect(requiresTwoFactor('content_editor')).toBe(true);
    expect(requiresTwoFactor('support')).toBe(true);
    expect(requiresTwoFactor('finance')).toBe(true);
    expect(requiresTwoFactor('org_admin')).toBe(true);
    expect(requiresTwoFactor('admin')).toBe(true);
    expect(requiresTwoFactor('super_admin')).toBe(true);
  });

  it('correctly classifies staff roles and exports permissions', () => {
    expect(PERMISSIONS.length).toBeGreaterThan(0);
    expect(isStaffRole('grader')).toBe(true);
    expect(isStaffRole('support')).toBe(true);
    expect(isStaffRole('student')).toBe(false);
    expect(isStaffRole('instructor')).toBe(false);
  });

  it('provides permissions mapping for all roles', () => {
    for (const role of ROLES) {
      expect(ROLE_PERMISSIONS[role]).toBeDefined();
      expect(Array.isArray(ROLE_PERMISSIONS[role])).toBe(true);
    }
  });

  it('exports auth and authClient without throwing on initialization', () => {
    expect(auth).toBeDefined();
    expect(authClient).toBeDefined();
  });

  describe('requireServerActor (P1-32)', () => {
    it('rejects unauthenticated requests when no session is active', async () => {
      __setTestServerActor(null);
      expect(await getServerActor()).toBeNull();
      await expect(requireServerActor()).rejects.toThrow(AuthError);
      await expect(requireServerActor()).rejects.toMatchObject({
        code: 'UNAUTHENTICATED',
      });
    });

    it('resolves authenticated student without requiring 2FA by default', async () => {
      __setTestServerActor({
        id: 'student-123',
        roles: ['student'],
        hasTwoFactorEnabled: false,
      });

      const actor = await requireServerActor();
      expect(actor.id).toBe('student-123');
      expect(actor.roles).toContain('student');
      expect(actor.hasTwoFactorEnabled).toBe(false);
    });

    it('rejects student when options.requireTwoFactor is explicitly true and 2FA is not enabled', async () => {
      __setTestServerActor({
        id: 'student-123',
        roles: ['student'],
        hasTwoFactorEnabled: false,
      });

      await expect(requireServerActor({ requireTwoFactor: true })).rejects.toMatchObject({
        code: '2FA_REQUIRED',
      });
    });

    it.each([
      'instructor',
      'grader',
      'content_editor',
      'support',
      'finance',
      'org_admin',
      'admin',
      'super_admin',
    ] as const)('enforces mandatory 2FA for %s per D4', async (role) => {
      __setTestServerActor({
        id: `staff-${role}`,
        roles: [role],
        hasTwoFactorEnabled: false,
      });

      await expect(requireServerActor()).rejects.toMatchObject({
        code: '2FA_REQUIRED',
      });

      __setTestServerActor({
        id: `staff-${role}`,
        roles: [role],
        hasTwoFactorEnabled: true,
      });

      const verifiedActor = await requireServerActor();
      expect(verifiedActor.id).toBe(`staff-${role}`);
      expect(verifiedActor.twoFactorVerified).toBe(true);
    });
  });
});
