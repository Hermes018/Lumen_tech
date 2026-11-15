/** @purpose Central security policy registry, 5-role RBAC enforcement, and sliding-window rate limiter */

import { canRolePerformAction, type WorkspaceRole } from '../role-guard';

export const SECURITY_POLICY = {
  allowedRedirectPrefixes: [
    '/en',
    '/bn',
    '/app',
    '/evaluator',
    '/instructor',
    '/auditor',
    '/admin',
    '/checkout',
    '/exam',
    '/courses',
    '/gre',
    '/ielts',
    '/pricing',
    '/help',
  ],
  rateLimits: {
    checkoutPerMinute: 10,
    authOtpPerMinute: 5,
    translatePerMinute: 60,
  },
  webhookReplayWindowSeconds: 300,
  maxPayloadBytes: 16384,
  roles: ['guest', 'learner', 'scholar', 'evaluator', 'instructor', 'auditor', 'admin'] as const,
} as const;

export type SecurityRole = (typeof SECURITY_POLICY.roles)[number];

export interface RoleActionPermissionResult {
  allowed: boolean;
  role: WorkspaceRole;
  action: string;
  error?: 'RBAC_FORBIDDEN_ROLE_ACTION';
}

export function enforceRoleActionPermission(
  role: WorkspaceRole,
  action: string,
): RoleActionPermissionResult {
  if (canRolePerformAction(role, action)) {
    return { allowed: true, role, action };
  }
  return {
    allowed: false,
    role,
    action,
    error: 'RBAC_FORBIDDEN_ROLE_ACTION',
  };
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAtMs: number;
}

const RATE_WINDOW_MS = 60_000;
const MAX_RATE_BUCKETS = 5000;
const rateLimitStore = new Map<string, number[]>();

function pruneRateLimitStore(nowMs: number): void {
  const cutoff = nowMs - RATE_WINDOW_MS;
  for (const [key, timestamps] of rateLimitStore.entries()) {
    const active = timestamps.filter((ts) => ts > cutoff);
    if (active.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, active);
    }
  }
}

export function checkRateLimit(
  key: string,
  maxPerMinute: number,
  nowMs: number = Date.now(),
): RateLimitResult {
  const safeLimit = Math.max(1, Math.floor(maxPerMinute));
  if (rateLimitStore.size >= MAX_RATE_BUCKETS) {
    pruneRateLimitStore(nowMs);
  }

  const cutoff = nowMs - RATE_WINDOW_MS;
  const existing = rateLimitStore.get(key) ?? [];
  const active = existing.filter((ts) => ts > cutoff);

  if (active.length >= safeLimit) {
    const oldest = active[0] ?? nowMs;
    rateLimitStore.set(key, active);
    return {
      allowed: false,
      remaining: 0,
      resetAtMs: oldest + RATE_WINDOW_MS,
    };
  }

  active.push(nowMs);
  rateLimitStore.set(key, active);
  const oldest = active[0] ?? nowMs;

  return {
    allowed: true,
    remaining: Math.max(0, safeLimit - active.length),
    resetAtMs: oldest + RATE_WINDOW_MS,
  };
}

export function resetRateLimitStore(): void {
  rateLimitStore.clear();
}
