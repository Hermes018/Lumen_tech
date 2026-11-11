/** @purpose Brand identity tokens and configuration constants (single source of truth) */

export interface BrandConfig {
  readonly name: string;
  readonly nameBn: string;
  readonly shortName: string;
  readonly slug: string;
  readonly code: string;
  readonly tutorName: string;
  readonly tagline: string;
  readonly taglineBn: string;
  readonly supportEmail: string;
  readonly legalName: string;
  readonly cookiePrefix: string;
  readonly storagePrefix: string;
}

export const brand: BrandConfig = {
  name: 'Lumen Academy',
  nameBn: 'লুমেন একাডেমি',
  shortName: 'Lumen',
  slug: 'lumen',
  code: 'LA',
  tutorName: 'Ask Lumen',
  tagline: 'Master IELTS & GRE with Confidence',
  taglineBn: 'আত্মবিশ্বাসের সাথে আইইএলটিএস ও জিআরই প্রস্তুতি',
  supportEmail: 'support@lumen.academy',
  legalName: 'Lumen Academy Ltd.',
  cookiePrefix: '__Host-lumen',
  storagePrefix: 'lumen',
} as const;
