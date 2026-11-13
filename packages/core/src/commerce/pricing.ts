/** @purpose Honest Pricing Engine with 28-of-90-day compare_at rule, regional PPP resolution, coupon caps, and bKash installment schedules (docs/17 §1, §5, §7, §11) */

export type Region = 'BD' | 'A' | 'B' | 'C';

export interface PriceHistoryEntry {
  amountMinor: number;
  startsAt: Date;
  endsAt: Date;
}

export interface CouponDefinition {
  code: string;
  discountPercent: number; // 0.0 - 1.0 (e.g. 0.20 for 20%)
  allowedTiers: string[];
  maxUses?: number;
  expiresAt?: Date;
  description: string;
}

/**
 * Pre-configured coupons permitted under docs/17 §11 promotions policy.
 */
export const PERMITTED_COUPONS: Record<string, CouponDefinition> = {
  FOUNDING20: {
    code: 'FOUNDING20',
    discountPercent: 0.20,
    allowedTiers: ['core', 'plus', 'pass'],
    description: 'Founding learners launch promo (20% off)',
  },
  EID15: {
    code: 'EID15',
    discountPercent: 0.15,
    allowedTiers: ['core', 'pass'],
    description: 'Eid holiday promo (15% off)',
  },
  POHELA14: {
    code: 'POHELA14',
    discountPercent: 0.14,
    allowedTiers: ['core', 'book'],
    description: 'Pohela Boishakh signature promo (14% off)',
  },
  STUDENT10: {
    code: 'STUDENT10',
    discountPercent: 0.10,
    allowedTiers: ['core', 'plus', 'pass', 'live_batch', 'live', 'crash'],
    description: 'Verified student discount (10% off)',
  },
  EARLYBIRD10: {
    code: 'EARLYBIRD10',
    discountPercent: 0.10,
    allowedTiers: ['live_batch', 'live', 'crash'],
    description: 'Early bird registration discount (10% off)',
  },
};

/**
 * Hard ceiling on total cumulative discounts by tier/category (docs/17 §11).
 * Absolutely no coupon, campaign, or stacking may breach these floors.
 */
export const MAX_DISCOUNT_PERCENT: Record<string, number> = {
  core: 0.40, // Max 40% off
  plus: 0.30, // Max 30% off
  pass: 0.30, // Max 30% off
  live_batch: 0.20, // Max 20% off
  live: 0.15, // Max 15% off (Live tier bundle)
  crash: 0.10, // Max 10% off
  mentor: 0.10, // Max 10% off
  book: 0.25, // Max 25% off
  b2b: 0.00, // 0% off - coupons strictly banned
  admissions: 0.00, // 0% off - coupons strictly banned
};

/**
 * Resolves user region for PPP pricing.
 * BD always resolves to 'BD' in BDT.
 */
export function resolveRegion(countryCode?: string): Region {
  if (!countryCode || countryCode.toUpperCase() === 'BD') {
    return 'BD';
  }

  const code = countryCode.toUpperCase();

  // Region A: High income (US, UK, CA, AU, NZ, Western Europe, SG, etc.)
  const regionACountries = [
    'US', 'GB', 'CA', 'AU', 'NZ', 'DE', 'FR', 'NL', 'SE', 'NO', 'DK', 'CH', 'IE', 'SG', 'JP', 'KR'
  ];
  if (regionACountries.includes(code)) {
    return 'A';
  }

  // Region B: Upper-middle income (Middle East, Eastern Europe, LATAM, etc.)
  const regionBCountries = [
    'AE', 'SA', 'QA', 'KW', 'OM', 'BH', 'PL', 'CZ', 'HU', 'RO', 'BR', 'MX', 'CL', 'MY', 'TH', 'TR'
  ];
  if (regionBCountries.includes(code)) {
    return 'B';
  }

  // Region C: South Asia & lower-income (India, Pakistan, Nepal, Sri Lanka, Nigeria, etc.)
  return 'C';
}

/**
 * D12 C14 Honest compare_at Rule:
 * Returns a struck-through compare_at price ONLY if that exact higher price
 * was actively charged for >= 28 consecutive days within the last 90 days.
 * Otherwise returns null (banning fake strikethrough discounts).
 */
export function resolveCompareAtPrice(
  priceHistory: PriceHistoryEntry[],
  currentMinor: number,
  now: Date = new Date()
): number | null {
  const MS_PER_DAY = 24 * 60 * 60 * 1000;
  const MIN_CONSECUTIVE_MS = 28 * MS_PER_DAY;
  const WINDOW_MS = 90 * MS_PER_DAY;

  const nowTime = now.getTime();
  const windowStartTime = nowTime - WINDOW_MS;

  let highestQualifyingPrice: number | null = null;

  for (const entry of priceHistory) {
    if (entry.amountMinor <= currentMinor) {
      continue;
    }

    const entryStart = Math.max(entry.startsAt.getTime(), windowStartTime);
    const entryEnd = Math.min(entry.endsAt.getTime(), nowTime);

    const activeDuration = entryEnd - entryStart;

    if (activeDuration >= MIN_CONSECUTIVE_MS) {
      if (highestQualifyingPrice === null || entry.amountMinor > highestQualifyingPrice) {
        highestQualifyingPrice = entry.amountMinor;
      }
    }
  }

  return highestQualifyingPrice;
}

export interface DiscountApplicationParams {
  productTier: string;
  basePriceMinor: number;
  couponCode?: string;
  automaticDiscountPercent?: number; // e.g. 0.10 for 10% early-bird or group
  referralCreditMinor?: number;
}

export interface DiscountApplicationResult {
  originalPriceMinor: number;
  discountMinor: number;
  finalPriceMinor: number;
  appliedDiscountPercent: number;
  referralCreditAppliedMinor: number;
  floorPriceMinor: number;
  maxDiscountPercent: number;
}

/**
 * Validates coupons, stacks with at most one automatic discount,
 * enforces hard floor caps per tier, and applies referral credit.
 */
export function applyDiscounts(params: DiscountApplicationParams): DiscountApplicationResult {
  const {
    productTier,
    basePriceMinor,
    couponCode,
    automaticDiscountPercent = 0,
    referralCreditMinor = 0,
  } = params;

  const tierKey = productTier.toLowerCase();
  const maxCap = MAX_DISCOUNT_PERCENT[tierKey] ?? 0.20;
  const floorPriceMinor = Math.round(basePriceMinor * (1 - maxCap));

  let couponPercent = 0;
  if (couponCode) {
    const coupon = PERMITTED_COUPONS[couponCode.trim().toUpperCase()];
    if (coupon) {
      // Check tier permission
      const isAllowed = coupon.allowedTiers.includes(tierKey) || coupon.allowedTiers.includes('*');
      if (isAllowed) {
        couponPercent = coupon.discountPercent;
      }
    }
  }

  // Combined price-reduction percent
  const rawCombinedPercent = couponPercent + automaticDiscountPercent;
  const appliedDiscountPercent = Math.min(rawCombinedPercent, maxCap);

  const discountMinor = Math.round(basePriceMinor * appliedDiscountPercent);
  const priceAfterPercentageDiscount = Math.max(floorPriceMinor, basePriceMinor - discountMinor);

  // Apply referral credit post-discount
  const maxReferralUsable = Math.max(0, priceAfterPercentageDiscount);
  const referralCreditAppliedMinor = Math.min(referralCreditMinor, maxReferralUsable);
  const finalPriceMinor = priceAfterPercentageDiscount - referralCreditAppliedMinor;

  return {
    originalPriceMinor: basePriceMinor,
    discountMinor,
    finalPriceMinor,
    appliedDiscountPercent,
    referralCreditAppliedMinor,
    floorPriceMinor,
    maxDiscountPercent: maxCap,
  };
}

/**
 * Invariant (docs/17 §1): The 3-month pass must cost >= 74.9% of Core
 * to protect against course cannibalization.
 */
export function assertPassAntiCannibalization(
  pass3mMinor: number,
  coreMinor: number
): { valid: boolean; ratio: number } {
  if (coreMinor <= 0) return { valid: false, ratio: 0 };
  const ratio = pass3mMinor / coreMinor;
  return {
    valid: ratio >= 0.749,
    ratio: Number(ratio.toFixed(4)),
  };
}

export interface InstallmentPart {
  partNumber: number;
  dueDay: number; // e.g. 0, 30, 60
  amountMinor: number;
  amountFormatted: string;
  label: string;
}

export interface InstallmentSchedule {
  productSlug: string;
  totalParts: 2 | 3;
  totalMinor: number;
  parts: InstallmentPart[];
}

/**
 * Computes bKash 2/3-part installment schedules without financing fees (docs/17 §7).
 */
export function getInstallmentSchedule(
  tier: string,
  totalMinor: number
): { twoPart?: InstallmentSchedule; threePart?: InstallmentSchedule } | null {
  const tierKey = tier.toLowerCase();

  if (tierKey === 'live' || totalMinor === 1399000) {
    // Live tier 13,990 BDT
    return {
      threePart: {
        productSlug: 'ielts-academic-live',
        totalParts: 3,
        totalMinor: 1399000,
        parts: [
          { partNumber: 1, dueDay: 0, amountMinor: 560000, amountFormatted: '৳ 5,600', label: 'Day 0 (Enrollment)' },
          { partNumber: 2, dueDay: 30, amountMinor: 420000, amountFormatted: '৳ 4,200', label: 'Day 30' },
          { partNumber: 3, dueDay: 60, amountMinor: 419000, amountFormatted: '৳ 4,190', label: 'Day 60' },
        ],
      },
      twoPart: {
        productSlug: 'ielts-academic-live',
        totalParts: 2,
        totalMinor: 1399000,
        parts: [
          { partNumber: 1, dueDay: 0, amountMinor: 840000, amountFormatted: '৳ 8,400', label: 'Day 0 (Enrollment)' },
          { partNumber: 2, dueDay: 30, amountMinor: 559000, amountFormatted: '৳ 5,590', label: 'Day 30' },
        ],
      },
    };
  }

  if (tierKey === 'mentor' || totalMinor === 1999000) {
    // Mentor tier 19,990 BDT
    return {
      threePart: {
        productSlug: 'ielts-academic-mentor',
        totalParts: 3,
        totalMinor: 1999000,
        parts: [
          { partNumber: 1, dueDay: 0, amountMinor: 800000, amountFormatted: '৳ 8,000', label: 'Day 0 (Enrollment)' },
          { partNumber: 2, dueDay: 30, amountMinor: 600000, amountFormatted: '৳ 6,000', label: 'Day 30' },
          { partNumber: 3, dueDay: 60, amountMinor: 599000, amountFormatted: '৳ 5,990', label: 'Day 60' },
        ],
      },
    };
  }

  if (tierKey === 'live_batch' || tierKey === 'crash' || totalMinor === 999000) {
    // Standalone live batch 9,990 BDT
    return {
      twoPart: {
        productSlug: 'ielts-live-batch-12w',
        totalParts: 2,
        totalMinor: 999000,
        parts: [
          { partNumber: 1, dueDay: 0, amountMinor: 600000, amountFormatted: '৳ 6,000', label: 'Day 0 (Enrollment)' },
          { partNumber: 2, dueDay: 30, amountMinor: 399000, amountFormatted: '৳ 3,990', label: 'Day 30' },
        ],
      },
    };
  }

  return null;
}
