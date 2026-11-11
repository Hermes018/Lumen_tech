/** @purpose Bangla numeral conversion and BDT currency formatting utilities */

const BANGLA_DIGITS: readonly string[] = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯'];

/**
 * Converts all ASCII 0-9 digits in a number or string to Bengali numerals (০-৯).
 */
export function toBanglaDigits(n: number | string): string {
  return String(n).replace(/\d/g, (digit) => BANGLA_DIGITS[Number(digit)] ?? digit);
}

export interface FormatBdtOptions {
  locale?: 'en' | 'bn';
  showSymbol?: boolean;
}

/**
 * Formats an integer amount in BDT minor units (paisa) to a formatted currency string.
 * @param amountMinor - Integer amount in paisa (1 BDT = 100 paisa)
 * @param options - Optional formatting configuration (locale: 'en' | 'bn', showSymbol: boolean)
 */
export function formatBdt(amountMinor: number, options: FormatBdtOptions = {}): string {
  const { locale = 'en', showSymbol = true } = options;
  const major = amountMinor / 100;
  const hasFraction = amountMinor % 100 !== 0;

  const formattedNumber = new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-US', {
    minimumFractionDigits: hasFraction ? 2 : 0,
    maximumFractionDigits: 2,
  }).format(major);

  if (!showSymbol) {
    return formattedNumber;
  }

  return `৳ ${formattedNumber}`;
}
