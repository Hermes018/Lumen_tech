/** @purpose Unit tests for IELTS 4-Skill raw-to-band conversion tables, rounding rules, and task weighting (docs/07 §3.2) */

import { describe, it, expect } from 'vitest';
import {
  LISTENING_TABLE,
  ACADEMIC_READING_TABLE,
  GT_READING_TABLE,
  rawToBand,
  roundIeltsBand,
  overallBand,
  taskBand,
  writingBand,
  speakingBand,
} from '../exam/ielts-scoring';

describe('IELTS 4-Skill Band Tables and Scoring', () => {
  describe('Raw to Band Conversions', () => {
    it('converts Listening raw scores correctly', () => {
      expect(rawToBand(40, LISTENING_TABLE)).toBe(9.0);
      expect(rawToBand(39, LISTENING_TABLE)).toBe(9.0);
      expect(rawToBand(35, LISTENING_TABLE)).toBe(8.0);
      expect(rawToBand(30, LISTENING_TABLE)).toBe(7.0);
      expect(rawToBand(23, LISTENING_TABLE)).toBe(6.0);
      expect(rawToBand(16, LISTENING_TABLE)).toBe(5.0);
      expect(rawToBand(0, LISTENING_TABLE)).toBe(0.0);
    });

    it('converts Academic Reading raw scores according to IDP standards (30-32 = 7.0, 33-34 = 7.5)', () => {
      expect(rawToBand(39, ACADEMIC_READING_TABLE)).toBe(9.0);
      expect(rawToBand(33, ACADEMIC_READING_TABLE)).toBe(7.5);
      expect(rawToBand(34, ACADEMIC_READING_TABLE)).toBe(7.5);
      expect(rawToBand(30, ACADEMIC_READING_TABLE)).toBe(7.0);
      expect(rawToBand(32, ACADEMIC_READING_TABLE)).toBe(7.0);
      expect(rawToBand(23, ACADEMIC_READING_TABLE)).toBe(6.0);
      expect(rawToBand(0, ACADEMIC_READING_TABLE)).toBe(0.0);
    });

    it('converts General Training Reading raw scores correctly', () => {
      expect(rawToBand(40, GT_READING_TABLE)).toBe(9.0);
      expect(rawToBand(39, GT_READING_TABLE)).toBe(8.5);
      expect(rawToBand(34, GT_READING_TABLE)).toBe(7.0);
      expect(rawToBand(30, GT_READING_TABLE)).toBe(6.0);
    });

    it('throws RangeError for invalid raw scores outside 0..40', () => {
      expect(() => rawToBand(-1, LISTENING_TABLE)).toThrow(RangeError);
      expect(() => rawToBand(41, LISTENING_TABLE)).toThrow(RangeError);
      expect(() => rawToBand(25.5, LISTENING_TABLE)).toThrow(RangeError);
    });
  });

  describe('Official IELTS Rounding Rules (0.5 Grid & .25 / .75 Edge Cases)', () => {
    it('implements roundIeltsBand round-half-up on the 0.5 grid', () => {
      // Direct half-band rounding
      expect(roundIeltsBand(6.125)).toBe(6.0);
      expect(roundIeltsBand(6.25)).toBe(6.5); // .25 rounds up to .5
      expect(roundIeltsBand(6.375)).toBe(6.5);
      expect(roundIeltsBand(6.5)).toBe(6.5);
      expect(roundIeltsBand(6.625)).toBe(6.5);
      expect(roundIeltsBand(6.75)).toBe(7.0); // .75 rounds up to next whole band
      expect(roundIeltsBand(6.875)).toBe(7.0);
      expect(roundIeltsBand(7.0)).toBe(7.0);
      expect(roundIeltsBand(8.75)).toBe(9.0);
      expect(roundIeltsBand(0.0)).toBe(0.0);
    });

    it('calculates overallBand correctly matching official IDP test cases', () => {
      // Reference cases from docs/07 §3.2.1
      // L, R, W, S -> Mean -> Expected Overall
      expect(overallBand(6.5, 6.5, 6.0, 6.0)).toBe(6.5); // mean 6.25 -> 6.5
      expect(overallBand(6.5, 6.5, 6.5, 6.0)).toBe(6.5); // mean 6.375 -> 6.5
      expect(overallBand(7.0, 7.0, 7.0, 6.5)).toBe(7.0); // mean 6.875 -> 7.0
      expect(overallBand(6.0, 6.0, 6.0, 6.5)).toBe(6.0); // mean 6.125 -> 6.0
      expect(overallBand(6.5, 7.0, 6.5, 6.5)).toBe(6.5); // mean 6.625 -> 6.5
      expect(overallBand(8.0, 8.0, 8.5, 8.5)).toBe(8.5); // mean 8.25 -> 8.5
      expect(overallBand(9.0, 9.0, 9.0, 8.5)).toBe(9.0); // mean 8.875 -> 9.0
      expect(overallBand(4.0, 4.0, 4.0, 5.0)).toBe(4.5); // mean 4.25 -> 4.5
      expect(overallBand(5.5, 6.0, 6.0, 6.0)).toBe(6.0); // mean 5.875 -> 6.0
      expect(overallBand(5.0, 5.5, 6.0, 6.0)).toBe(5.5); // mean 5.625 -> 5.5
      expect(overallBand(9.0, 9.0, 9.0, 9.0)).toBe(9.0);
      expect(overallBand(0.0, 0.0, 0.0, 0.0)).toBe(0.0);
    });
  });

  describe('Writing Task Weighting (1:2 Ratio) and Speaking Band', () => {
    it('computes taskBand as the arithmetic mean of 4 criteria', () => {
      expect(taskBand([6.0, 7.0, 8.0, 7.0])).toBe(7.0);
      expect(taskBand([6.5, 6.5, 6.0, 6.0])).toBe(6.25);
    });

    it('weights Task 2 double Task 1: (T1 + 2*T2)/3 rounded', () => {
      // T1 = 6.0, T2 = 7.0 -> (6 + 14)/3 = 6.666 -> rounds to 6.5
      expect(writingBand(6.0, 7.0)).toBe(6.5);

      // T1 = 7.0, T2 = 6.5 -> (7 + 13)/3 = 6.666 -> rounds to 6.5
      expect(writingBand(7.0, 6.5)).toBe(6.5);

      // T1 = 6.0, T2 = 6.5 -> (6 + 13)/3 = 6.333 -> rounds to 6.5 (.25 threshold exceeded)
      expect(writingBand(6.0, 6.5)).toBe(6.5);

      // T1 = 8.0, T2 = 7.0 -> (8 + 14)/3 = 7.333 -> rounds to 7.5
      expect(writingBand(8.0, 7.0)).toBe(7.5);
    });

    it('calculates speakingBand as mean of the 4 criteria rounded half-up', () => {
      // [FC, LR, GRA, PR]
      expect(speakingBand([7.0, 7.0, 6.5, 6.5])).toBe(7.0); // mean 6.75 -> 7.0
      expect(speakingBand([6.0, 6.0, 6.5, 6.5])).toBe(6.5); // mean 6.25 -> 6.5
      expect(speakingBand([6.0, 6.0, 6.0, 6.5])).toBe(6.0); // mean 6.125 -> 6.0
    });
  });
});
