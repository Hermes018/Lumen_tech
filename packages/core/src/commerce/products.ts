/** @purpose Canonical product catalog definitions and default allowances for commerce domain */

export interface ProductPriceBook {
  BD: number; // Minor units in BDT (e.g. 399000 = 3,990 BDT)
  A: number; // Minor units in USD (e.g. 8900 = $89.00 USD)
  B: number; // Upper-middle income region
  C: number; // Lower-middle income region
}

export interface ProductDefinition {
  slug: string;
  kind: 'course' | 'bundle' | 'test_pack' | 'ai_credits' | 'pass';
  name: string;
  tier: 'free' | 'core' | 'plus' | 'live' | 'mentor';
  exam: 'gre' | 'ielts_academic' | 'ielts_gt';
  phase: string;
  duration_days: number;
  prices: ProductPriceBook;
  allowances: {
    ai_credits: number;
    full_mocks: number;
    ai_daily_cap: number;
    ai_tutor_msgs_per_day?: number;
    [key: string]: unknown;
  };
}

export const CANONICAL_PRODUCTS: ProductDefinition[] = [
  {
    slug: 'ielts-academic-core',
    kind: 'course',
    name: 'IELTS Academic Core',
    tier: 'core',
    exam: 'ielts_academic',
    phase: 'P1',
    duration_days: 183,
    prices: {
      BD: 399000,
      A: 8900,
      B: 4900,
      C: 3400,
    },
    allowances: {
      ai_credits: 10,
      full_mocks: 4,
      ai_daily_cap: 3,
      ai_tutor_msgs_per_day: 30,
    },
  },
  {
    slug: 'gre-complete-core',
    kind: 'course',
    name: 'GRE Complete Core',
    tier: 'core',
    exam: 'gre',
    phase: 'P1',
    duration_days: 183,
    prices: {
      BD: 499000,
      A: 9900,
      B: 5900,
      C: 3900,
    },
    allowances: {
      ai_credits: 15,
      full_mocks: 5,
      ai_daily_cap: 5,
      ai_tutor_msgs_per_day: 50,
    },
  },
  {
    slug: 'gre-mock-pack-5',
    kind: 'test_pack',
    name: 'GRE 5 Full Adaptive Mock Tests',
    tier: 'core',
    exam: 'gre',
    phase: 'P1',
    duration_days: 90,
    prices: {
      BD: 199000,
      A: 3900,
      B: 2500,
      C: 1900,
    },
    allowances: {
      ai_credits: 5,
      full_mocks: 5,
      ai_daily_cap: 2,
    },
  },
  {
    slug: 'lumen-annual-pass',
    kind: 'pass',
    name: 'Lumen All-Access Annual Pass',
    tier: 'plus',
    exam: 'gre',
    phase: 'P1',
    duration_days: 365,
    prices: {
      BD: 999000,
      A: 19900,
      B: 12900,
      C: 8900,
    },
    allowances: {
      ai_credits: 50,
      full_mocks: 20,
      ai_daily_cap: 10,
      ai_tutor_msgs_per_day: 100,
    },
  },
];
