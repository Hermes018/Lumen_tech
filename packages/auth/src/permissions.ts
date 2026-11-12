/**
 * @purpose Canonical Role-Based Access Control (RBAC) permission matrix and role definitions.
 * Follows 00-DECISIONS.md D4, 06-API-AND-SERVICES.md §1, and 09-SECURITY-AUTH-COMPLIANCE.md §4.
 */

export const ROLES = [
  'guest',
  'student',
  'guardian',
  'instructor',
  'grader',
  'content_editor',
  'support',
  'finance',
  'org_admin',
  'admin',
  'super_admin',
] as const;

export type Role = (typeof ROLES)[number];

export const PERMISSIONS = [
  // Exam CBT
  'exam:take',
  'exam:view_own',
  'exam:review',
  'exam:grade',
  'exam:publish',
  'exam:delete',

  // Practice & Pedagogy
  'practice:session',
  'practice:review',
  'vocab:study',
  'vocab:manage',

  // Course & Curriculum
  'course:view',
  'course:create',
  'course:edit',
  'course:publish',
  'question:create',
  'question:edit',
  'question:review',
  'question:publish',

  // Submissions & Grading
  'submission:grade',

  // Orders & Entitlements
  'order:create',
  'order:view_own',
  'order:view_all',
  'order:refund',
  'entitlement:grant',

  // Organizations & Tenants
  'org:manage',
  'org:invite',
  'org:view',

  // Users & Staff
  'user:view_own',
  'user:view_all',
  'user:manage',
  'user:impersonate',

  // Audit & Finance
  'audit:view',
  'finance:view',
  'finance:export',
] as const;

export type Permission = (typeof PERMISSIONS)[number];

/**
 * Roles that mandate Two-Factor Authentication (2FA: Passkey or TOTP) per 00-DECISIONS.md D4.
 * Enforced server-side in assertCan policy check.
 */
export const ROLES_REQUIRING_2FA: ReadonlySet<Role> = new Set([
  'instructor',
  'grader',
  'content_editor',
  'support',
  'finance',
  'org_admin',
  'admin',
  'super_admin',
]);

export function requiresTwoFactor(role: Role): boolean {
  return ROLES_REQUIRING_2FA.has(role);
}

export function isStaffRole(role: Role): boolean {
  return [
    'grader',
    'content_editor',
    'support',
    'finance',
    'admin',
    'super_admin',
  ].includes(role);
}

/**
 * Canonical mapping from role to permitted actions.
 * Roles are strictly additive.
 */
export const ROLE_PERMISSIONS: Record<Role, readonly Permission[]> = {
  guest: ['course:view'],

  student: [
    'course:view',
    'exam:take',
    'exam:view_own',
    'practice:session',
    'practice:review',
    'vocab:study',
    'order:create',
    'order:view_own',
    'user:view_own',
  ],

  guardian: [
    'course:view',
    'exam:view_own', // can view linked student's performance with consent
    'order:create',
    'order:view_own',
    'user:view_own',
  ],

  instructor: [
    'course:view',
    'course:create',
    'course:edit',
    'question:create',
    'question:edit',
    'practice:session',
    'exam:review',
    'user:view_own',
  ],

  grader: [
    'course:view',
    'exam:review',
    'exam:grade',
    'submission:grade',
    'user:view_own',
  ],

  content_editor: [
    'course:view',
    'course:create',
    'course:edit',
    'course:publish',
    'question:create',
    'question:edit',
    'question:review',
    'question:publish',
    'submission:grade',
    'question:create',
    'question:edit',
    'question:review',
    'question:publish',
    'exam:review',
    'exam:publish',
    'vocab:study',
    'vocab:manage',
    'user:view_own',
  ],

  support: [
    'course:view',
    'exam:review',
    'order:view_all',
    'user:view_all',
    'user:view_own',
  ],

  finance: [
    'course:view',
    'order:view_all',
    'order:refund',
    'finance:view',
    'finance:export',
    'user:view_own',
  ],

  org_admin: [
    'course:view',
    'org:manage',
    'org:invite',
    'org:view',
    'order:create',
    'user:view_own',
  ],

  admin: [
    'course:view',
    'course:create',
    'course:edit',
    'course:publish',
    'question:create',
    'question:edit',
    'question:review',
    'question:publish',
    'submission:grade',
    'exam:take',
    'exam:view_own',
    'exam:review',
    'exam:grade',
    'exam:publish',
    'exam:delete',
    'practice:session',
    'practice:review',
    'vocab:study',
    'vocab:manage',
    'order:create',
    'order:view_own',
    'order:view_all',
    'order:refund',
    'entitlement:grant',
    'org:manage',
    'org:invite',
    'org:view',
    'user:view_own',
    'user:view_all',
    'user:manage',
    'audit:view',
    'finance:view',
    'finance:export',
  ],

  super_admin: PERMISSIONS,
};
