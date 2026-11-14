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
  {
    slug: 'gre-core',
    kind: 'course',
    name: 'GRE Core',
    tier: 'core',
    exam: 'gre',
    phase: 'P1',
    duration_days: 183,
    prices: {
      BD: 599000,
      A: 14900,
      B: 8900,
      C: 5900,
    },
    allowances: {
      ai_credits: 6,
      full_mocks: 4,
      ai_daily_cap: 3,
      ai_tutor_msgs_per_day: 30,
    },
  },
  {
    slug: 'gre-plus',
    kind: 'course',
    name: 'GRE Plus',
    tier: 'plus',
    exam: 'gre',
    phase: 'P1',
    duration_days: 183,
    prices: {
      BD: 849000,
      A: 19900,
      B: 11900,
      C: 7900,
    },
    allowances: {
      ai_credits: 20,
      full_mocks: 10,
      ai_daily_cap: 6,
      ai_tutor_msgs_per_day: 150,
    },
  },
  {
    slug: 'ielts-academic-plus',
    kind: 'course',
    name: 'IELTS Academic Plus',
    tier: 'plus',
    exam: 'ielts_academic',
    phase: 'P1',
    duration_days: 183,
    prices: {
      BD: 649000,
      A: 14900,
      B: 8900,
      C: 5900,
    },
    allowances: {
      ai_credits: 40,
      full_mocks: 10,
      ai_daily_cap: 6,
      ai_tutor_msgs_per_day: 150,
    },
  },
  {
    slug: 'ai-credits-10',
    kind: 'ai_credits',
    name: '10 AI Evaluation Credits',
    tier: 'core',
    exam: 'gre',
    phase: 'P1',
    duration_days: 365,
    prices: {
      BD: 49000,
      A: 1199,
      B: 799,
      C: 499,
    },
    allowances: {
      ai_credits: 10,
      full_mocks: 0,
      ai_daily_cap: 10,
    },
  },
  {
    slug: 'mock-pack-4',
    kind: 'test_pack',
    name: 'Full Mock Pack (4 Mocks)',
    tier: 'core',
    exam: 'gre',
    phase: 'P1',
    duration_days: 90,
    prices: {
      BD: 99000,
      A: 2499,
      B: 1299,
      C: 899,
    },
    allowances: {
      ai_credits: 0,
      full_mocks: 4,
      ai_daily_cap: 4,
    },
  },
  {
    slug: 'human-review-pack',
    kind: 'bundle',
    name: '1-on-1 Review & Feedback Bundle',
    tier: 'plus',
    exam: 'gre',
    phase: 'P1',
    duration_days: 183,
    prices: {
      BD: 149000,
      A: 3400,
      B: 1999,
      C: 1299,
    },
    allowances: {
      ai_credits: 10,
      full_mocks: 0,
      ai_daily_cap: 5,
    },
  },
];
