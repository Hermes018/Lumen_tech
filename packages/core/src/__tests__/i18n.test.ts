/** @purpose Unit tests for Bangla digits conversion and BDT currency formatting */
import { describe, it, expect } from 'vitest';
import { toBanglaDigits, formatBdt } from '../i18n/bangla.js';

describe('Bangla i18n utilities', () => {
  describe('toBanglaDigits', () => {
    it('converts all 10 digits 0 through 9', () => {
      expect(toBanglaDigits('0123456789')).toBe('০১২৩৪৫৬৭৮৯');
      expect(toBanglaDigits(9876543210)).toBe('৯৮৭৬৫৪৩২১০');
    });

    it('preserves non-digit characters and punctuation', () => {
      expect(toBanglaDigits('Score: 162/170 (85.5%)')).toBe('Score: ১৬২/১৭০ (৮৫.৫%)');
      expect(toBanglaDigits('+880 1711-000000')).toBe('+৮৮০ ১৭১১-০০০০০০');
    });

    it('handles empty string and zero', () => {
      expect(toBanglaDigits('')).toBe('');
      expect(toBanglaDigits(0)).toBe('০');
    });
  });

  describe('formatBdt', () => {
    it('formats BDT currency in English locale without decimals when exact', () => {
      // 9,990 BDT = 999,000 paisa
      expect(formatBdt(999000, { locale: 'en' })).toBe('৳ 9,990');
    });

    it('formats BDT currency in Bangla locale with Bengali digits', () => {
      expect(formatBdt(999000, { locale: 'bn' })).toBe('৳ ৯,৯৯০');
    });

    it('formats BDT currency with fractional paisa when present', () => {
      expect(formatBdt(999050, { locale: 'en' })).toBe('৳ 9,990.50');
      expect(formatBdt(999050, { locale: 'bn' })).toBe('৳ ৯,৯৯০.৫০');
    });

    it('respects showSymbol: false flag', () => {
      expect(formatBdt(1500000, { locale: 'en', showSymbol: false })).toBe('15,000');
      expect(formatBdt(1500000, { locale: 'bn', showSymbol: false })).toBe('১৫,০০০');
    });

    it('handles 0 paisa correctly', () => {
      expect(formatBdt(0, { locale: 'en' })).toBe('৳ 0');
      expect(formatBdt(0, { locale: 'bn' })).toBe('৳ ০');
    });
  });

  describe('Bilingual Dictionary 100% Key Parity (en.json <-> bn.json)', () => {
    it('asserts 100% key parity between English and Bangla message catalogs', async () => {
      const fs = await import('node:fs');
      const path = await import('node:path');

      const messagesDir = path.resolve(__dirname, '../../../../apps/web/messages');
      const enRaw = fs.readFileSync(path.join(messagesDir, 'en.json'), 'utf-8');
      const bnRaw = fs.readFileSync(path.join(messagesDir, 'bn.json'), 'utf-8');

      const enJson = JSON.parse(enRaw);
      const bnJson = JSON.parse(bnRaw);

      function getLeafKeys(obj: Record<string, unknown>, prefix = ''): string[] {
        let keys: string[] = [];
        for (const [key, value] of Object.entries(obj)) {
          const fullKey = prefix ? `${prefix}.${key}` : key;
          if (value && typeof value === 'object' && !Array.isArray(value)) {
            keys = keys.concat(getLeafKeys(value as Record<string, unknown>, fullKey));
          } else {
            keys.push(fullKey);
          }
        }
        return keys.sort();
      }

      const enKeys = getLeafKeys(enJson);
      const bnKeys = getLeafKeys(bnJson);

      const missingInBn = enKeys.filter((k) => !bnKeys.includes(k));
      const missingInEn = bnKeys.filter((k) => !enKeys.includes(k));

      expect(missingInBn, `Keys present in en.json but missing in bn.json: ${missingInBn.join(', ')}`).toEqual([]);
      expect(missingInEn, `Keys present in bn.json but missing in en.json: ${missingInEn.join(', ')}`).toEqual([]);
      expect(enKeys.length).toBe(bnKeys.length);
      expect(enKeys.length).toBeGreaterThan(40);
    });
  });
});
