/** @purpose PII masking utilities for support agents (docs/27 §16, D4) */

/**
 * Masks an email address per D4 / doc 27 §16.
 * Example: `aymanrahman30@gmail.com` -> `a*****0@gmail.com` or `a***n@gmail.com`
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) {
    return '***@***';
  }

  const [localPart, domain] = email.split('@');
  if (!localPart || !domain) {
    return '***@***';
  }

  if (localPart.length <= 2) {
    return `${localPart[0] ?? '*'}*@${domain}`;
  }

  const firstChar = localPart[0];
  const lastChar = localPart[localPart.length - 1];
  const stars = '*'.repeat(Math.min(5, Math.max(3, localPart.length - 2)));
  return `${firstChar}${stars}${lastChar}@${domain}`;
}

/**
 * Masks a phone number per D4 / doc 27 §16.
 * Example: `01712345678` -> `01******678` (or `01******789`)
 */
export function maskPhone(phone: string): string {
  if (!phone) return '01******000';
  const clean = phone.replace(/[^0-9+]/g, '');
  if (clean.length < 7) {
    return '01******000';
  }

  // BD phone numbers typically start with 01 or +8801
  if (clean.startsWith('+8801') && clean.length >= 14) {
    const prefix = clean.slice(0, 5); // +8801
    const suffix = clean.slice(-3);
    return `${prefix}******${suffix}`;
  }

  const prefix = clean.slice(0, 2);
  const suffix = clean.slice(-3);
  return `${prefix}******${suffix}`;
}

/**
 * Masks a full name per privacy rules.
 * Example: "Ayman Rahman" -> "A**** R*****"
 */
export function maskName(name: string): string {
  if (!name) return 'Anonymous';
  const parts = name.trim().split(/\s+/);
  return parts
    .map((p) => {
      if (p.length <= 1) return p;
      return `${p[0]}${'*'.repeat(Math.min(5, p.length - 1))}`;
    })
    .join(' ');
}
