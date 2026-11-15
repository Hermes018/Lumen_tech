/** @purpose Strict Scholar vs. Admin role cookie helpers and privacy-by-design PII masking for Admin ERP */

export type WorkspaceRole = 'scholar' | 'admin';

export const ROLE_COOKIE_NAME = 'lumen_role';

export function parseWorkspaceRole(value: string | undefined | null): WorkspaceRole | null {
  if (value === 'scholar' || value === 'admin') {
    return value;
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
