/** @purpose Finance Operations, Target/Progress Promise Guarantee Claims, Mushak 6.3 VAT export, and Payout Summaries (docs/10 §6, docs/17 §2.2a) */

import { assertCan, type Actor } from '../auth/policy';

export interface TargetPromiseClaimInput {
  userId: string;
  tier: 'core' | 'plus' | 'mentor';
  fullMocksCount: number;
  studyPlanCompletionPercent: number;
  daysSinceAccessEnd: number;
  trfUploaded: boolean;
  targetMet?: boolean;
}

export interface TargetPromiseClaimResult {
  eligible: boolean;
  remedy?: '90_day_extension';
  extensionDays?: number;
  creditsRefilled: false;
  cashRefund: false;
  reasons: string[];
}

/**
 * Evaluates Target Promise eligibility for Plus tier learners (docs/17 §2.2a).
 * Conditions:
 * - Tier is 'plus'
 * - Target was not met (targetMet === false)
 * - >= 4 full mocks taken
 * - Study-plan completion >= 70%
 * - Official test sat within 60 days of access end
 * - Official TRF uploaded
 * Remedy: One free 90-day library extension (no cash, credits not refilled).
 */
export function evaluateTargetPromiseClaim(
  input: TargetPromiseClaimInput
): TargetPromiseClaimResult {
  const reasons: string[] = [];

  const nums = [input.fullMocksCount, input.studyPlanCompletionPercent, input.daysSinceAccessEnd];
  if (!nums.every((n) => Number.isFinite(n) && n >= 0)) {
    reasons.push('Invalid numeric claim input.');
  }

  if (input.tier !== 'plus') {
    reasons.push(`Target Promise is exclusive to Plus tier. Current tier: ${input.tier}.`);
  }

  if (input.targetMet !== false) {
    reasons.push('Target score must be explicitly recorded as not met (targetMet === false).');
  }

  if (input.fullMocksCount < 4) {
    reasons.push(`Minimum 4 full mocks required. Completed: ${input.fullMocksCount}.`);
  }

  if (input.studyPlanCompletionPercent < 70) {
    reasons.push(
      `Minimum 70% study-plan completion required. Achieved: ${input.studyPlanCompletionPercent}%.`
    );
  }

  if (input.daysSinceAccessEnd > 60) {
    reasons.push(
      `Official exam must be taken within 60 days of course access end. Days elapsed: ${input.daysSinceAccessEnd}.`
    );
  }

  if (!input.trfUploaded) {
    reasons.push('Official Test Report Form (TRF) must be uploaded to verify score.');
  }

  if (reasons.length > 0) {
    return {
      eligible: false,
      cashRefund: false,
      creditsRefilled: false,
      reasons,
    };
  }

  return {
    eligible: true,
    remedy: '90_day_extension',
    extensionDays: 90,
    creditsRefilled: false,
    cashRefund: false,
    reasons: ['Eligible for 90-day library extension under Target Promise guarantee.'],
  };
}

export interface ProgressPromiseClaimInput {
  userId: string;
  tier: 'core' | 'plus' | 'mentor';
  liveAttendancePercent: number;
  homeworkSubmissionPercent: number;
  fullMocksCount: number;
  targetBand: number;
  diagnosticBand: number;
  daysSinceCourseEnd: number;
  daysSinceResult: number;
  trfUploaded: boolean;
  targetMet?: boolean;
}

export interface ProgressPromiseClaimResult {
  eligible: boolean;
  remedy?: 'free_live_batch_reenrolment';
  creditsRefilled: false;
  cashRefund: false;
  reasons: string[];
}

/**
 * Evaluates Progress Promise eligibility for Mentor tier learners (docs/17 §2.2a).
 * Conditions:
 * - Tier is 'mentor'
 * - Target was not met (targetMet === false)
 * - Live session attendance >= 80%
 * - 100% homework submitted
 * - >= 4 full mocks taken
 * - Target band <= diagnostic + 1.5 bands
 * - Official test within 60 days of course end
 * - Official TRF uploaded within 30 days of test result
 * Remedy: One free re-enrolment into the next Live batch (no cash).
 */
export function evaluateProgressPromiseClaim(
  input: ProgressPromiseClaimInput
): ProgressPromiseClaimResult {
  const reasons: string[] = [];

  const nums = [
    input.liveAttendancePercent,
    input.homeworkSubmissionPercent,
    input.fullMocksCount,
    input.targetBand,
    input.diagnosticBand,
    input.daysSinceCourseEnd,
    input.daysSinceResult,
  ];
  if (!nums.every((n) => Number.isFinite(n) && n >= 0)) {
    reasons.push('Invalid numeric claim input.');
  }

  if (input.tier !== 'mentor') {
    reasons.push(`Progress Promise is exclusive to Mentor tier. Current tier: ${input.tier}.`);
  }

  if (input.targetMet !== false) {
    reasons.push('Target score must be explicitly recorded as not met (targetMet === false).');
  }

  if (input.liveAttendancePercent < 80) {
    reasons.push(
      `Minimum 80% live session attendance required. Achieved: ${input.liveAttendancePercent}%.`
    );
  }

  if (input.homeworkSubmissionPercent < 100) {
    reasons.push(
      `100% homework submission required. Achieved: ${input.homeworkSubmissionPercent}%.`
    );
  }

  if (input.fullMocksCount < 4) {
    reasons.push(`Minimum 4 full mocks required. Completed: ${input.fullMocksCount}.`);
  }

  const maxAllowedTarget = input.diagnosticBand + 1.5;
  if (input.targetBand > maxAllowedTarget) {
    reasons.push(
      `Target band (${input.targetBand}) exceeded diagnostic + 1.5 ceiling (baseline ${input.diagnosticBand} -> max allowed ${maxAllowedTarget}).`
    );
  }

  if (input.daysSinceCourseEnd > 60) {
    reasons.push(
      `Official exam must be sat within 60 days of course conclusion. Days elapsed: ${input.daysSinceCourseEnd}.`
    );
  }

  if (input.daysSinceResult > 30) {
    reasons.push(
      `Claim must be filed within 30 days of score publication. Days elapsed: ${input.daysSinceResult}.`
    );
  }

  if (!input.trfUploaded) {
    reasons.push('Official Test Report Form (TRF) must be uploaded.');
  }

  if (reasons.length > 0) {
    return {
      eligible: false,
      creditsRefilled: false,
      cashRefund: false,
      reasons,
    };
  }

  return {
    eligible: true,
    remedy: 'free_live_batch_reenrolment',
    creditsRefilled: false,
    cashRefund: false,
    reasons: ['Eligible for free Live batch re-enrolment under Progress Promise guarantee.'],
  };
}

export interface MushakInvoiceRecord {
  challanNo: string;
  issueDate: string; // YYYY-MM-DD
  customerName: string;
  customerBinNidPhone: string;
  itemDescription: string;
  supplyValueMinor: number; // in integer poisha (BDT minor units)
  vatRatePercent: number;   // e.g. 5
  gatewayName: string;
  gatewayTxId: string;
}

/**
 * Escapes CSV field against Spreadsheet Formula Injection (CSV Injection).
 * Any cell value starting with '=', '+', '-', '@', '\t', '\r' is prefixed with an apostrophe (').
 */
export function sanitizeCsvField(raw: string | number): string {
  const str = String(raw);
  let sanitized = str;

  if (typeof raw === 'string' && (/^[\s\u0000-\u001f]*[=+\-@]/.test(str) || /^[\t\r]/.test(str))) {
    sanitized = `'${str}`;
  }

  if (/[",\r\n]/.test(sanitized)) {
    return `"${sanitized.replace(/"/g, '""')}"`;
  }
  return sanitized;
}

/**
 * Generates NBR Mushak 6.3 compliant monthly VAT ledger CSV export (docs/10 §6.1, §6.7).
 * Requires actor permission `finance:read` + mandatory 2FA.
 */
export function generateMushak63Csv(
  actor: Actor,
  records: MushakInvoiceRecord[]
): string {
  assertCan(actor, 'finance:read');

  const headers = [
    'Challan Number',
    'Issue Date',
    'Customer Name',
    'Customer BIN/NID/Phone',
    'Item Description',
    'Supply Value (BDT)',
    'VAT Rate (%)',
    'VAT Amount (BDT)',
    'Total Payable (BDT)',
    'Payment Gateway',
    'Gateway TxID',
  ];

  const rows = records.map((rec) => {
    const supplyValue = rec.supplyValueMinor / 100;
    const vatAmount = Number(((supplyValue * rec.vatRatePercent) / 100).toFixed(2));
    const totalPayable = Number((supplyValue + vatAmount).toFixed(2));

    return [
      sanitizeCsvField(rec.challanNo),
      sanitizeCsvField(rec.issueDate),
      sanitizeCsvField(rec.customerName),
      sanitizeCsvField(rec.customerBinNidPhone),
      sanitizeCsvField(rec.itemDescription),
      supplyValue.toFixed(2),
      rec.vatRatePercent.toString(),
      vatAmount.toFixed(2),
      totalPayable.toFixed(2),
      sanitizeCsvField(rec.gatewayName),
      sanitizeCsvField(rec.gatewayTxId),
    ].join(',');
  });

  return [headers.join(','), ...rows].join('\n');
}

export interface InstructorPayoutRecord {
  instructorId: string;
  instructorName: string;
  grossPayableMinor: number;
  taxWithholdingRatePercent: number; // e.g. 10% AIT in Bangladesh
  status: 'pending' | 'approved' | 'paid';
}

export interface InstructorPayoutSummary {
  totalGrossMinor: number;
  totalWithholdingTaxMinor: number;
  totalNetPayableMinor: number;
  pendingCount: number;
  approvedCount: number;
  paidCount: number;
  payouts: Array<InstructorPayoutRecord & { netPayableMinor: number }>;
}

/**
 * Generates an aggregated instructor & affiliate payout summary.
 * Requires actor permission `finance:read` + mandatory 2FA.
 */
export function generateInstructorPayoutSummary(
  actor: Actor,
  payouts: InstructorPayoutRecord[]
): InstructorPayoutSummary {
  assertCan(actor, 'finance:read');

  let totalGrossMinor = 0;
  let totalWithholdingTaxMinor = 0;
  let totalNetPayableMinor = 0;
  let pendingCount = 0;
  let approvedCount = 0;
  let paidCount = 0;

  const enriched = payouts.map((p) => {
    const taxMinor = Math.round((p.grossPayableMinor * p.taxWithholdingRatePercent) / 100);
    const netMinor = p.grossPayableMinor - taxMinor;

    totalGrossMinor += p.grossPayableMinor;
    totalWithholdingTaxMinor += taxMinor;
    totalNetPayableMinor += netMinor;

    if (p.status === 'pending') pendingCount++;
    if (p.status === 'approved') approvedCount++;
    if (p.status === 'paid') paidCount++;

    return {
      ...p,
      netPayableMinor: netMinor,
    };
  });

  return {
    totalGrossMinor,
    totalWithholdingTaxMinor,
    totalNetPayableMinor,
    pendingCount,
    approvedCount,
    paidCount,
    payouts: enriched,
  };
}
