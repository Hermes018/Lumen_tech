/**
 * @purpose Server-authoritative RBAC policy engine and assertCan security enforcement.
 * Follows 00-DECISIONS.md D4, 06-API-AND-SERVICES.md §1, and 09-SECURITY-AUTH-COMPLIANCE.md §4.
 */

import {
  type Role,
  type Permission,
  ROLE_PERMISSIONS,
  requiresTwoFactor,
} from '@lumen/auth';

export class AuthorizationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AuthorizationError';
  }
}

export class TwoFactorRequiredError extends AuthorizationError {
  constructor(message = 'Two-Factor Authentication (2FA) is required for this action') {
    super(message);
    this.name = 'TwoFactorRequiredError';
  }
}

export interface Actor {
  id: string;
  roles: readonly Role[];
  orgId?: string;
  hasTwoFactorEnabled?: boolean;
}

export interface ResourceContext {
  type?: string;
  id?: string;
  ownerId?: string;
  orgId?: string;
  consentingStudentIds?: readonly string[];
  [key: string]: unknown;
}

/**
 * Evaluates whether an actor has permission to execute an action on an optional resource.
 * Pure predicate; returns boolean without throwing.
 */
export function can(actor: Actor, permission: Permission, resource?: ResourceContext): boolean {
  if (!actor || !actor.roles || actor.roles.length === 0) {
    return false;
  }

  // 1. Mandatory 2FA check (00-DECISIONS.md D4):
  // If any assigned role requires 2FA, the actor MUST have 2FA enabled.
  const hasRoleRequiring2FA = actor.roles.some((r) => requiresTwoFactor(r));
  if (hasRoleRequiring2FA && !actor.hasTwoFactorEnabled) {
    return false;
  }

  // 2. Super admin bypasses all subsequent granular checks
  if (actor.roles.includes('super_admin')) {
    return true;
  }

  // 3. Collect all permissions granted across all active roles (additive)
  const grantedPermissions = new Set<Permission>();
  for (const role of actor.roles) {
    const rolePerms = ROLE_PERMISSIONS[role] || [];
    for (const p of rolePerms) {
      grantedPermissions.add(p);
    }
  }

  if (!grantedPermissions.has(permission)) {
    return false;
  }

  // 4. Resource-level contextual checks (if resource is provided)
  if (resource) {
    // Tenant / Organization isolation check
    if (resource.orgId) {
      const isGlobalAdmin = actor.roles.includes('admin');
      if (!isGlobalAdmin && actor.orgId !== resource.orgId) {
        return false;
      }
    }

    // Ownership / Subject checks
    if (permission === 'exam:view_own' || permission === 'order:view_own' || permission === 'user:view_own') {
      if (resource.ownerId) {
        // Direct owner access
        if (actor.id === resource.ownerId) {
          return true;
        }

        // Guardian viewing consenting student
        if (actor.roles.includes('guardian') && resource.consentingStudentIds?.includes(resource.ownerId)) {
          return true;
        }

        // Staff roles permitted to view user/exam resources
        if (
          actor.roles.includes('admin') ||
          actor.roles.includes('support') ||
          actor.roles.includes('grader')
        ) {
          return true;
        }

        return false;
      }
    }

    // Instructor course edit ownership isolation
    if (permission === 'course:edit' && actor.roles.includes('instructor')) {
      const isEditorOrAdmin = actor.roles.includes('content_editor') || actor.roles.includes('admin');
      if (!isEditorOrAdmin && resource.ownerId && resource.ownerId !== actor.id) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Asserts that an actor has permission, throwing AuthorizationError or TwoFactorRequiredError if denied.
 */
export function assertCan(actor: Actor, permission: Permission, resource?: ResourceContext): void {
  if (!actor || !actor.roles || actor.roles.length === 0) {
    throw new AuthorizationError('Anonymous or unauthenticated actor');
  }

  // Check 2FA requirement explicitly to provide clear security diagnostic
  const rolesRequiring2FA = actor.roles.filter((r) => requiresTwoFactor(r));
  if (rolesRequiring2FA.length > 0 && !actor.hasTwoFactorEnabled) {
    throw new TwoFactorRequiredError(
      `Mandatory 2FA required for role(s): ${rolesRequiring2FA.join(', ')}`
    );
  }

  if (!can(actor, permission, resource)) {
    throw new AuthorizationError(
      `Actor '${actor.id}' lacks permission '${permission}'${
        resource?.id ? ` on resource '${resource.id}'` : ''
      }`
    );
  }
}
