/** @purpose Money arithmetic, currency formatting, and VAT calculations in minor units */

export type Currency = 'BDT' | 'USD';

/**
 * Formats integer minor units to decimal major unit string.
 * e.g., 399000 -> "3990.00"
 */
export function formatMinorToMajor(amountMinor: number): string {
  const isNegative = amountMinor < 0;
  const abs = Math.abs(Math.round(amountMinor));
  const major = Math.floor(abs / 100);
  const minor = abs % 100;
  const str = `${major}.${minor.toString().padStart(2, '0')}`;
  return isNegative ? `-${str}` : str;
}

/**
 * Parses major decimal string or number to integer minor units.
 * e.g., "3990.00" -> 399000
 */
export function parseMajorToMinor(amountMajor: string | number): number {
  if (typeof amountMajor === 'number') {
    return Math.round(amountMajor * 100);
  }
  const clean = amountMajor.trim().replace(/,/g, '');
  const parsed = parseFloat(clean);
  if (Number.isNaN(parsed)) {
    throw new Error(`Invalid monetary amount: ${amountMajor}`);
  }
  return Math.round(parsed * 100);
}

/**
 * Formats integer minor amount into human-readable currency with locale formatting.
 */
export function formatCurrency(
  amountMinor: number,
  currency: Currency = 'BDT',
  locale = 'en'
): string {
  const major = amountMinor / 100;

  if (currency === 'BDT') {
    if (locale === 'bn') {
      const bnDigits = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];
      const formatted = major.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      const bnFormatted = formatted.replace(/\d/g, (d) => bnDigits[Number(d)] ?? d);
      return `৳ ${bnFormatted}`;
    }
    return `BDT ${major.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  }

  return `$${major.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Calculates VAT breakdown for VAT-inclusive pricing.
 * In Bangladesh, educational products carry tax-inclusive retail pricing.
 */
export function calculateTaxInclusive(
  totalMinor: number,
  vatRate = 0.05
): {
  baseMinor: number;
  vatMinor: number;
  totalMinor: number;
  vatRate: number;
} {
  const baseMinor = Math.round(totalMinor / (1 + vatRate));
  const vatMinor = totalMinor - baseMinor;
  return {
    baseMinor,
    vatMinor,
    totalMinor,
    vatRate,
  };
}
