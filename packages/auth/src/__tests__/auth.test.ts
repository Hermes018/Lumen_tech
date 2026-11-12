import { describe, it, expect } from 'vitest';
import {
  ROLES,
  PERMISSIONS,
  ROLES_REQUIRING_2FA,
  requiresTwoFactor,
  isStaffRole,
  ROLE_PERMISSIONS,
  auth,
  authClient,
} from '../index';

describe('@lumen/auth exports and permissions', () => {
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
});
