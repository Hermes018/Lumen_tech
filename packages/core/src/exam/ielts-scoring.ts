/** @purpose IELTS 4-Skill Band Tables, raw-to-band conversion, and overall score rounding (docs/02 §6, docs/07 §3.2) */

export interface BandRow {
  minRaw: number;
  band: number;
}

export interface ConversionTable {
  id: string;
  version: string;
  module: 'listening' | 'academic_reading' | 'gt_reading';
  maxRaw: 40;
  provenance: string;
  approximate: true;
  rows: BandRow[];
}

/**
 * Approximate conversion tables. Real conversions vary slightly per test form.
 * Editable via score_conversion schema / authoring.
 */
export const LISTENING_TABLE: ConversionTable = {
  id: 'ielts_listening',
  version: '2026-11-07.1',
  module: 'listening',
  maxRaw: 40,
  approximate: true,
  provenance: 'raw 16-40: Yocket (secondary, per research). raw 0-15: common-knowledge extrapolation.',
  rows: [
    [39, 9],
    [37, 8.5],
    [35, 8],
    [32, 7.5],
    [30, 7],
    [26, 6.5],
    [23, 6],
    [18, 5.5],
    [16, 5],
    [13, 4.5],
    [10, 4],
    [8, 3.5],
    [6, 3],
    [4, 2.5],
    [2, 2],
    [1, 1],
    [0, 0],
  ].map(([minRaw, band]) => ({ minRaw: minRaw!, band: band! })),
};

export const ACADEMIC_READING_TABLE: ConversionTable = {
  id: 'ielts_academic_reading',
  version: '2026-11-07.1',
  module: 'academic_reading',
  maxRaw: 40,
  approximate: true,
  provenance: 'raw 4-40: IDP Academic Reading table (30-32 = 7.0, 33-34 = 7.5). raw 0-3: extrapolation.',
  rows: [
    [39, 9],
    [37, 8.5],
    [35, 8],
    [33, 7.5],
    [30, 7],
    [27, 6.5],
    [23, 6],
    [19, 5.5],
    [15, 5],
    [13, 4.5],
    [10, 4],
    [8, 3.5],
    [6, 3],
    [4, 2.5],
    [2, 2],
    [1, 1],
    [0, 0],
  ].map(([minRaw, band]) => ({ minRaw: minRaw!, band: band! })),
};

export const GT_READING_TABLE: ConversionTable = {
  id: 'ielts_gt_reading',
  version: '2026-11-07.1',
  module: 'gt_reading',
  maxRaw: 40,
  approximate: true,
  provenance: 'raw 9-40: IDP General Training Reading table (research). raw 0-8: extrapolation.',
  rows: [
    [40, 9],
    [39, 8.5],
    [37, 8],
    [36, 7.5],
    [34, 7],
    [32, 6.5],
    [30, 6],
    [27, 5.5],
    [23, 5],
    [19, 4.5],
    [15, 4],
    [12, 3.5],
    [9, 3],
    [6, 2.5],
    [3, 2],
    [1, 1],
    [0, 0],
  ].map(([minRaw, band]) => ({ minRaw: minRaw!, band: band! })),
};

/**
 * Converts a raw score (0-40) to IELTS Band (0.0-9.0 in 0.5 increments).
 */
export function rawToBand(raw: number, table: ConversionTable): number {
  if (!Number.isInteger(raw) || raw < 0 || raw > table.maxRaw) {
    throw new RangeError(`raw score ${raw} outside 0..${table.maxRaw}`);
  }
  const matchedRow = table.rows.find((r) => raw >= r.minRaw);
  if (!matchedRow) {
    throw new RangeError(`No band mapping found for raw ${raw}`);
  }
  return matchedRow.band;
}

/**
 * Rounds an unrounded IELTS band value to the nearest 0.5 on the official IELTS grid:
 * .25 rounds UP to .5, .75 rounds UP to next whole band (docs/07 §3.2.1).
 */
export function roundIeltsBand(x: number): number {
  return Math.floor(x * 2 + 0.5 + 1e-9) / 2;
}

function assertBand(b: number): void {
  if (!(b >= 0 && b <= 9) || !Number.isInteger(b * 2)) {
    throw new RangeError(`Invalid IELTS band score ${b}. Must be on the 0.0-9.0 (0.5 step) grid.`);
  }
}

/**
 * Calculates official overall IELTS Band score from the four skill bands:
 * Mean of [Listening, Reading, Writing, Speaking], rounded half-up on the 0.5 grid.
 * Uses integer half-band arithmetic to avoid JavaScript floating-point errors.
 */
export function overallBand(l: number, r: number, w: number, s: number): number {
  [l, r, w, s].forEach(assertBand);
  const sumHalf =
    Math.round(l * 2) + Math.round(r * 2) + Math.round(w * 2) + Math.round(s * 2);
  return Math.floor((sumHalf + 2) / 4) / 2;
}

/**
 * Computes an unrounded task band as the arithmetic mean of its 4 rubric criteria.
 */
export function taskBand(criteria: [number, number, number, number]): number {
  return criteria.reduce((a, b) => a + b, 0) / 4;
}

/**
 * Computes the overall IELTS Writing band:
 * Task 2 is weighted 2x Task 1: (Task 1 + 2 * Task 2) / 3, then rounded to the nearest 0.5 band.
 */
export function writingBand(t1: number, t2: number): number {
  return roundIeltsBand((t1 + 2 * t2) / 3);
}

/**
 * Computes the overall IELTS Speaking band from the 4 public criteria:
 * Mean of [Fluency & Coherence, Lexical Resource, Grammatical Range & Accuracy, Pronunciation].
 */
export function speakingBand(criteria: [number, number, number, number]): number {
  return roundIeltsBand(taskBand(criteria));
}
