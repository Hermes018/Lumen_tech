/** @purpose Strict 5-role isolation helpers, RBAC permission matrix, route redirect resolver, and privacy-by-design PII masking */

export type WorkspaceRole = 'scholar' | 'evaluator' | 'instructor' | 'auditor' | 'admin';

export const ROLE_COOKIE_NAME = 'lumen_role';

export const ROLE_HOME_PATHS: Record<WorkspaceRole, string> = {
  scholar: '/app',
  evaluator: '/evaluator',
  instructor: '/instructor',
  auditor: '/auditor',
  admin: '/admin',
};

export const ROLE_PERMISSION_MATRIX: Record<WorkspaceRole, readonly string[]> = {
  scholar: ['SCHOLAR_REQUEST_REFUND'],
  evaluator: ['EVALUATOR_SUBMIT_GRADE', 'CMS_UPDATE'],
  instructor: ['INSTRUCTOR_SUBMIT_ITEM', 'INSTRUCTOR_RESOLVE_DOUBT', 'INSTRUCTOR_UPDATE_COHORT'],
  auditor: ['AUDITOR_ADJUDICATE_IRR', 'AUDITOR_CERTIFY_ITEM', 'AUDITOR_VERIFY_CHAIN'],
  admin: [
    'UPDATE_PLAN',
    'ADD_PLAN',
    'UPDATE_FEES',
    'UPSERT_PROMO',
    'TOGGLE_PROMO',
    'ORDER_ACTION',
    'CMS_UPDATE',
    'SCHOLAR_ACTION',
    'TOGGLE_FLAG',
    'PSYCHOMETRIC_UPDATE',
    'PII_REVEAL',
    'RESET_DEFAULTS',
    'EVALUATOR_SUBMIT_GRADE',
    'INSTRUCTOR_SUBMIT_ITEM',
    'AUDITOR_ADJUDICATE_IRR',
    'AUDITOR_CERTIFY_ITEM',
    'RECORD_LEDGER_ENTRY',
  ],
};

export function parseWorkspaceRole(value: string | undefined | null): WorkspaceRole | null {
  if (
    value === 'scholar' ||
    value === 'evaluator' ||
    value === 'instructor' ||
    value === 'auditor' ||
    value === 'admin'
  ) {
    return value;
  }
  return null;
}

export function canRolePerformAction(role: WorkspaceRole, action: string): boolean {
  const allowed = ROLE_PERMISSION_MATRIX[role];
  return allowed.includes(action);
}

export function resolveRoleRedirect(role: WorkspaceRole | null, pathname: string): string | null {
  const isBn = pathname === '/bn' || pathname.startsWith('/bn/');
  const prefix = isBn ? '/bn' : '';
  const stripped = pathname.replace(/^\/(?:en|bn)(?=\/|$)/, '') || '/';

  if (stripped === '/app/admin' || stripped.startsWith('/app/admin/')) {
    return role ? `${prefix}${ROLE_HOME_PATHS[role]}` : `${prefix}/admin`;
  }

  const entries = Object.entries(ROLE_HOME_PATHS) as [WorkspaceRole, string][];
  const matched = entries.find(
    ([, homePath]) => stripped === homePath || stripped.startsWith(`${homePath}/`),
  );

  if (!matched) {
    return null;
  }

  if (!role) {
    return null;
  }

  const [targetRole] = matched;
  if (targetRole !== role) {
    return `${prefix}${ROLE_HOME_PATHS[role]}`;
  }

  return null;
}

export function maskEmailForAdmin(email: string): string {
  const trimmed = email.trim();
  const atIndex = trimmed.lastIndexOf('@');
  if (!trimmed || atIndex === -1) {
    return '***';
  }

  const local = trimmed.slice(0, atIndex);
  const domain = trimmed.slice(atIndex + 1);
  if (!domain) {
    return '***';
  }

  const firstChar = local.charAt(0);
  const lastChar = local.charAt(local.length - 1);

  if (local.length === 0) {
    return `***@${domain}`;
  }
  if (local.length === 1) {
    return `${firstChar}***@${domain}`;
  }
  return `${firstChar}***${lastChar}@${domain}`;
}

export function maskPhoneForAdmin(phone: string): string {
  const cleaned = phone.trim();
  if (!cleaned) {
    return '••••';
  }

  if (cleaned.startsWith('+') && cleaned.length >= 11) {
    return `${cleaned.slice(0, 6)}••••${cleaned.slice(-4)}`;
  }

  if (cleaned.length >= 8) {
    return `${cleaned.slice(0, 3)}••••${cleaned.slice(-4)}`;
  }

  return `••••${cleaned.slice(-2)}`;
}

export function setWorkspaceRoleCookie(role: WorkspaceRole): void {
  if (typeof document === 'undefined') {
    return;
  }
  document.cookie = `${ROLE_COOKIE_NAME}=${role}; path=/; max-age=2592000; SameSite=Lax`;
}
