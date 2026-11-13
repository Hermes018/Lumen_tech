/** @purpose Unit tests for honest pricing engine, compare_at rule, discount caps, bKash installments, and C25 regional invariants */

import { describe, it, expect } from 'vitest';
import {
  resolveRegion,
  resolveCompareAtPrice,
  applyDiscounts,
  assertPassAntiCannibalization,
  getInstallmentSchedule,
  type PriceHistoryEntry,
} from '../commerce/pricing';
import { CANONICAL_PRODUCTS } from '../commerce/products';

describe('Pricing Engine: Regional PPP Resolution', () => {
  it('resolves BD to BD and foreign countries to appropriate regions', () => {
    expect(resolveRegion('BD')).toBe('BD');
    expect(resolveRegion('bd')).toBe('BD');
    expect(resolveRegion()).toBe('BD');

    // Region A (high-income)
    expect(resolveRegion('US')).toBe('A');
    expect(resolveRegion('GB')).toBe('A');
    expect(resolveRegion('CA')).toBe('A');
    expect(resolveRegion('AU')).toBe('A');

    // Region B (upper-middle income)
    expect(resolveRegion('AE')).toBe('B');
    expect(resolveRegion('SA')).toBe('B');
    expect(resolveRegion('MY')).toBe('B');
    expect(resolveRegion('TR')).toBe('B');

    // Region C (lower-middle income & South Asia)
    expect(resolveRegion('IN')).toBe('C');
    expect(resolveRegion('PK')).toBe('C');
    expect(resolveRegion('NP')).toBe('C');
    expect(resolveRegion('NG')).toBe('C');
  });
});

describe('Pricing Engine: D12 C14 Honest compare_at Rule', () => {
  const MS_DAY = 24 * 60 * 60 * 1000;
  const now = new Date('2026-11-13T00:00:00Z');

  it('returns compare_at price only if charged for >= 28 consecutive days in last 90 days', () => {
    const historyValid: PriceHistoryEntry[] = [
      {
        amountMinor: 499000,
        startsAt: new Date(now.getTime() - 60 * MS_DAY),
        endsAt: new Date(now.getTime() - 25 * MS_DAY), // 35 consecutive days
      },
    ];

    // Current price is 3,990 (399000). Previous was 4,990 (499000).
    const compareAt = resolveCompareAtPrice(historyValid, 399000, now);
    expect(compareAt).toBe(499000);
  });

  it('returns null if price was charged for fewer than 28 consecutive days (bans fake flash discounts)', () => {
    const historyShort: PriceHistoryEntry[] = [
      {
        amountMinor: 599000,
        startsAt: new Date(now.getTime() - 40 * MS_DAY),
        endsAt: new Date(now.getTime() - 20 * MS_DAY), // 20 consecutive days < 28
      },
    ];

    const compareAt = resolveCompareAtPrice(historyShort, 399000, now);
    expect(compareAt).toBeNull();
  });

  it('returns null if the higher price occurred outside the 90-day lookback window', () => {
    const historyOld: PriceHistoryEntry[] = [
      {
        amountMinor: 499000,
        startsAt: new Date(now.getTime() - 150 * MS_DAY),
        endsAt: new Date(now.getTime() - 100 * MS_DAY), // 50 consecutive days, but > 90 days ago
      },
    ];

    const compareAt = resolveCompareAtPrice(historyOld, 399000, now);
    expect(compareAt).toBeNull();
  });

  it('returns null if the historical price was lower than or equal to current price', () => {
    const historyLower: PriceHistoryEntry[] = [
      {
        amountMinor: 299000,
        startsAt: new Date(now.getTime() - 60 * MS_DAY),
        endsAt: new Date(now.getTime() - 10 * MS_DAY),
      },
    ];

    const compareAt = resolveCompareAtPrice(historyLower, 399000, now);
    expect(compareAt).toBeNull();
  });
});

describe('Pricing Engine: Coupon & Stacking Floors (docs/17 §11)', () => {
  it('applies permitted coupons within allowed tiers', () => {
    const result = applyDiscounts({
      productTier: 'core',
      basePriceMinor: 399000,
      couponCode: 'FOUNDING20',
    });

    expect(result.appliedDiscountPercent).toBe(0.20);
    expect(result.discountMinor).toBe(79800);
    expect(result.finalPriceMinor).toBe(319200);
  });

  it('enforces hard discount floor caps even with aggressive stacking', () => {
    // Core tier cap is 40% (0.40)
    const resultCore = applyDiscounts({
      productTier: 'core',
      basePriceMinor: 399000,
      couponCode: 'FOUNDING20', // 20%
      automaticDiscountPercent: 0.30, // 30% -> Total raw 50%
    });

    expect(resultCore.appliedDiscountPercent).toBe(0.40); // Clamped to 40%
    expect(resultCore.discountMinor).toBe(159600);
    expect(resultCore.finalPriceMinor).toBe(239400); // Matches floor price in docs/17 §11

    // Mentor tier cap is strictly 10% (0.10)
    const resultMentor = applyDiscounts({
      productTier: 'mentor',
      basePriceMinor: 1999000,
      couponCode: 'STUDENT10', // 10%
      automaticDiscountPercent: 0.10, // 10% -> Total raw 20%
    });

    expect(resultMentor.appliedDiscountPercent).toBe(0.10); // Clamped to 10%
    expect(resultMentor.finalPriceMinor).toBe(1799100); // Matches floor price in docs/17 §11
  });

  it('strictly bans coupons on B2B and Admissions services', () => {
    const resultB2b = applyDiscounts({
      productTier: 'b2b',
      basePriceMinor: 5000000,
      couponCode: 'FOUNDING20',
    });
    expect(resultB2b.appliedDiscountPercent).toBe(0);
    expect(resultB2b.finalPriceMinor).toBe(5000000);

    const resultAdm = applyDiscounts({
      productTier: 'admissions',
      basePriceMinor: 4000000,
      couponCode: 'FOUNDING20',
    });
    expect(resultAdm.appliedDiscountPercent).toBe(0);
    expect(resultAdm.finalPriceMinor).toBe(4000000);
  });

  it('applies referral credits post-discount up to floor', () => {
    const result = applyDiscounts({
      productTier: 'core',
      basePriceMinor: 399000,
      couponCode: 'FOUNDING20', // 20% off -> 319,200
      referralCreditMinor: 20000, // 200 BDT
    });

    expect(result.referralCreditAppliedMinor).toBe(20000);
    expect(result.finalPriceMinor).toBe(299200);
  });
});

describe('Pricing Engine: Anti-Cannibalization Invariant', () => {
  it('asserts that the 3-month pass costs >= 74.9% of Core', () => {
    // 2,990 BDT vs 3,990 BDT
    const checkIelts = assertPassAntiCannibalization(299000, 399000);
    expect(checkIelts.valid).toBe(true);
    expect(checkIelts.ratio).toBeGreaterThanOrEqual(0.749);
    expect(checkIelts.ratio).toBeCloseTo(0.7494, 3);
  });
});

describe('Pricing Engine: bKash Installment Schedules (docs/17 §7)', () => {
  it('computes exact 3-part and 2-part schedules for Live tier without finance fees', () => {
    const sched = getInstallmentSchedule('live', 1399000);
    expect(sched).not.toBeNull();

    // 3-part: 5,600 + 4,200 + 4,190 = 13,990
    expect(sched?.threePart?.totalParts).toBe(3);
    const sum3 = sched!.threePart!.parts.reduce((acc, p) => acc + p.amountMinor, 0);
    expect(sum3).toBe(1399000);
    expect(sched?.threePart?.parts[0]?.amountMinor).toBe(560000);
    expect(sched?.threePart?.parts[1]?.amountMinor).toBe(420000);
    expect(sched?.threePart?.parts[2]?.amountMinor).toBe(419000);

    // 2-part: 8,400 + 5,590 = 13,990
    expect(sched?.twoPart?.totalParts).toBe(2);
    const sum2 = sched!.twoPart!.parts.reduce((acc, p) => acc + p.amountMinor, 0);
    expect(sum2).toBe(1399000);
    expect(sched?.twoPart?.parts[0]?.amountMinor).toBe(840000);
    expect(sched?.twoPart?.parts[1]?.amountMinor).toBe(559000);
  });

  it('computes exact 3-part schedule for Mentor tier', () => {
    const sched = getInstallmentSchedule('mentor', 1999000);
    expect(sched?.threePart?.parts[0]?.amountMinor).toBe(800000);
    expect(sched?.threePart?.parts[1]?.amountMinor).toBe(600000);
    expect(sched?.threePart?.parts[2]?.amountMinor).toBe(599000);
    const sum = sched!.threePart!.parts.reduce((acc, p) => acc + p.amountMinor, 0);
    expect(sum).toBe(1999000);
  });
});

describe('Pricing Engine: Regional C25 Floor Invariant', () => {
  it('verifies that Region C price in USD >= BD price in USD (at 120 BDT/USD)', () => {
    for (const prod of CANONICAL_PRODUCTS) {
      if (prod.prices.BD > 0 && prod.prices.C > 0) {
        expect(prod.prices.A).toBeGreaterThanOrEqual(prod.prices.B);
        expect(prod.prices.B).toBeGreaterThanOrEqual(prod.prices.C);
      }
    }
  });
});
