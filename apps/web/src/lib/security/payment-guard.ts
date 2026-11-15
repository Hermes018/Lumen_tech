/** @purpose Server-side canonical BDT & USD price ledger, mutable runtime Admin catalog/fee/promo/CMS store, fractional split-pay fee calculator, anti-tampering check, idempotency/replay guard, and HMAC-SHA256 webhook verifier */

import crypto from 'node:crypto';
import { SECURITY_POLICY } from './policy';

export type PaymentSecurityErrorCode =
  | 'SECURITY_PRICE_TAMPER_DETECTED'
  | 'SECURITY_UNKNOWN_PLAN'
  | 'SECURITY_INVALID_SPLIT_PARTS'
  | 'SECURITY_SPLIT_PAY_NOT_ELIGIBLE'
  | 'SECURITY_INVALID_IDEMPOTENCY_KEY'
  | 'SECURITY_TIMESTAMP_OUT_OF_WINDOW'
  | 'SECURITY_IDEMPOTENCY_REPLAY_DETECTED';

export class PaymentSecurityError extends Error {
  readonly code: PaymentSecurityErrorCode;

  constructor(code: PaymentSecurityErrorCode, message?: string) {
    super(message ? `${code}: ${message}` : code);
    this.name = 'PaymentSecurityError';
    this.code = code;
  }
}

export type SupportedCurrency = 'BDT' | 'USD';
export type SplitMode = 'full' | 'split-2' | 'split-3';

export const SPLIT_PROCESSING_FEE_RATES = {
  full: 0,
  'split-2': 0.0285,
  'split-3': 0.0475,
} as const;

export interface CanonicalPromoCode {
  readonly code: string;
  readonly discountType: 'percent' | 'fixed';
  readonly value: number;
  readonly active: boolean;
  readonly labelEn: string;
  readonly labelBn: string;
  readonly maxRedemptions?: number | null;
  readonly redemptionsCount?: number;
  readonly expiresAt?: string | null;
}

export const CANONICAL_PROMO_CODES: Readonly<Record<string, CanonicalPromoCode>> = Object.freeze({
  LUMEN10: {
    code: 'LUMEN10',
    discountType: 'percent',
    value: 10,
    active: true,
    labelEn: '10% Scholar Launch Grant',
    labelBn: '১০% স্কলার লঞ্চ ছাড়',
    maxRedemptions: 500,
    redemptionsCount: 42,
    expiresAt: null,
  },
  DU20: {
    code: 'DU20',
    discountType: 'percent',
    value: 20,
    active: true,
    labelEn: '20% University Cohort Grant',
    labelBn: '২০% বিশ্ববিদ্যালয় কোহর্ট ছাড়',
    maxRedemptions: 250,
    redemptionsCount: 19,
    expiresAt: null,
  },
});

export interface CanonicalBdtPlan {
  readonly planId: string;
  readonly label: string;
  readonly baseBdt: number;
  readonly baseUsd: number;
  readonly totalBdt: number;
  readonly splitPayEligible: boolean;
}

const SPLIT_PAY_MIN_BDT = 4990;
const DEFAULT_VAT_RATE_BDT = 0.15;

function definePlan(
  planId: string,
  label: string,
  baseBdt: number,
  baseUsd: number,
  explicitTotalBdt?: number,
): CanonicalBdtPlan {
  const totalBdt = explicitTotalBdt ?? baseBdt + Math.round(baseBdt * DEFAULT_VAT_RATE_BDT);
  return Object.freeze({
    planId,
    label,
    baseBdt,
    baseUsd,
    totalBdt,
    splitPayEligible: totalBdt >= SPLIT_PAY_MIN_BDT,
  });
}

export const CANONICAL_BDT_PLANS: Readonly<Record<string, CanonicalBdtPlan>> = Object.freeze({
  'free-diagnostic': definePlan('free-diagnostic', 'Free Diagnostic', 0, 0, 0),
  'ielts-complete': definePlan('ielts-complete', 'IELTS Complete', 4339, 49, 4990),
  'gre-complete': definePlan('gre-complete', 'GRE Complete', 8500, 79),
  'ielts-academic': definePlan('ielts-academic', 'IELTS Academic', 7500, 69),
  'ielts-gt': definePlan('ielts-gt', 'IELTS General Training', 6500, 59),
  'dual-prep-bundle': definePlan('dual-prep-bundle', 'GRE + IELTS Dual Prep Bundle', 13500, 119),
  'mock-ai-pass': definePlan('mock-ai-pass', 'Mock & AI Evaluation Pass', 2500, 25),
  'live-cohort': definePlan('live-cohort', 'Live Cohort + Mocks', 11296, 129, 12990),
  'gre-core': definePlan('gre-core', 'GRE Core', 5209, 59, 5990),
  'gre-plus': definePlan('gre-plus', 'GRE Plus', 7383, 79, 8490),
  'gre-live': definePlan('gre-live', 'GRE Live Cohort', 11296, 129, 12990),
  'all-access': definePlan('all-access', 'All-Access Annual Pass', 8687, 99, 9990),
  // Aligned catalog slugs from @lumen/core CANONICAL_PRODUCTS
  'ielts-academic-core': definePlan('ielts-academic-core', 'IELTS Academic Core', 3470, 45, 3990),
  'gre-complete-core': definePlan('gre-complete-core', 'GRE Complete Core', 4339, 49, 4990),
  'gre-mock-pack-5': definePlan('gre-mock-pack-5', 'GRE 5 Full Adaptive Mock Tests', 1730, 25, 1990),
  'lumen-annual-pass': definePlan('lumen-annual-pass', 'Lumen All-Access Annual Pass', 8687, 99, 9990),
  'ielts-academic-plus': definePlan('ielts-academic-plus', 'IELTS Academic Plus', 5643, 69, 6490),
  'ai-credits-10': definePlan('ai-credits-10', '10 AI Evaluation Credits', 426, 9, 490),
  'mock-pack-4': definePlan('mock-pack-4', 'Full Mock Pack (4 Mocks)', 861, 15, 990),
  'human-review-pack': definePlan('human-review-pack', '1-on-1 Review & Feedback Bundle', 1296, 19, 1490),
});

export interface RuntimeFeeRates {
  split2Rate: number;
  split3Rate: number;
  vatRateBdt: number;
}

export interface RuntimeCatalogPlan {
  planId: string;
  label: string;
  nameEn: string;
  nameBn: string;
  baseBdt: number;
  baseUsd: number;
  totalBdt: number;
  splitPayEligible: boolean;
  allowSplit: boolean;
  active: boolean;
  featuresEn: string[];
  featuresBn: string[];
  fullMocks: number;
  aiCredits: number;
  isCustom?: boolean;
}

export interface RuntimePromoCode {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  active: boolean;
  labelEn: string;
  labelBn: string;
  maxRedemptions: number | null;
  redemptionsCount: number;
  expiresAt: string | null;
}

export interface RuntimeAdminOrder {
  id: string;
  scholar: string;
  email: string;
  cohort: string;
  planId: string;
  planLabel: string;
  currency: SupportedCurrency;
  amount: number;
  splitMode: SplitMode;
  splitStatus:
    | 'Paid in Full'
    | 'Installment 1/2 Paid'
    | 'Installment 1/3 Paid'
    | 'Offline Pending'
    | 'Refunded';
  paymentMethod: string;
  mushakVerified: boolean;
  mushakChalanId: string | null;
  corporateBin: string | null;
  createdAt: string;
}

export interface RuntimeModerationSubmission {
  id: string;
  scholar: string;
  type: 'Writing' | 'Speaking' | 'Forum';
  task: string;
  excerpt: string;
  submittedAt: string;
  aiBandOrScore: string;
  status: 'Pending Review' | 'Approved' | 'Revision Requested' | 'Removed';
  feedbackNote: string;
}

export interface RuntimeCmsVocabFaqItem {
  id: string;
  kind: 'vocab' | 'faq';
  titleEn: string;
  titleBn: string;
  bodyEn: string;
  bodyBn: string;
  active: boolean;
}

export interface RuntimeTopRibbonCms {
  enabled: boolean;
  textEn: string;
  textBn: string;
  ctaLabelEn: string;
  ctaLabelBn: string;
  ctaHref: string;
}

export interface RuntimeScholarRecord {
  id: string;
  name: string;
  email: string;
  cohort: string;
  planId: string;
  aiCreditsRemaining: number;
  expiresAt: string;
  diagnosticStatus: 'Completed' | 'In Progress' | 'Reset Pending';
  bandEstimate: string;
}

export interface RuntimePsychometricItem {
  id: string;
  domain: 'GRE Quant Comparison' | 'GRE Text Completion' | 'CD-IELTS Reading' | 'IELTS Writing Task 2';
  itemCode: string;
  pValue: number;
  bParam: string;
  discriminationIndex: number;
  trapRate: string;
  aiStrictness: 'Standard' | 'Strict' | 'Calibrated';
}

export interface RuntimeFeatureFlags {
  translateBudgetGuard: boolean;
  guestCheckoutEnabled: boolean;
  splitPayEnabled: boolean;
  maintenanceBanner: boolean;
  aiStrictnessLevel: 'standard' | 'strict' | 'lenient';
}

export interface RuntimeAuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  subsystem: string;
  detail: string;
  status: 'Verified' | 'Enforced' | 'Updated';
}

export interface RuntimeCatalogSnapshot {
  plans: Record<string, RuntimeCatalogPlan>;
  feeRates: RuntimeFeeRates;
  promoCodes: Record<string, RuntimePromoCode>;
  orders: RuntimeAdminOrder[];
  topRibbon: RuntimeTopRibbonCms;
  moderationQueue: RuntimeModerationSubmission[];
  cmsItems: RuntimeCmsVocabFaqItem[];
  scholars: RuntimeScholarRecord[];
  psychometrics: RuntimePsychometricItem[];
  featureFlags: RuntimeFeatureFlags;
  auditLogs: RuntimeAuditEntry[];
  updatedAtIso: string;
}

const PLAN_DEFAULT_META: Readonly<
  Record<string, { nameBn: string; fullMocks: number; aiCredits: number; featuresEn: string[]; featuresBn: string[] }>
> = {
  'ielts-academic-core': {
    nameBn: 'আইইএলটিএস একাডেমিক কোর',
    fullMocks: 4,
    aiCredits: 10,
    featuresEn: ['4 Full CD-IELTS Mocks', '10 AI Writing & Speaking Evals', 'Band 7.5+ Rubric Drills'],
    featuresBn: ['৪টি পূর্ণাঙ্গ সিডি-আইইএলটিএস মক', '১০টি এআই রাইটিং ও স্পিকিং মূল্যায়ন', 'ব্যান্ড ৭.৫+ রুব্রিক ড্রিল'],
  },
  'gre-complete-core': {
    nameBn: 'জিআরই কমপ্লিট কোর',
    fullMocks: 5,
    aiCredits: 15,
    featuresEn: ['5 Section-Adaptive GRE Mocks', '15 AWA AI Evaluations', 'FSRS 1,200-Word Vocab Deck'],
    featuresBn: ['৫টি সেকশন-অ্যাডাপটিভ জিআরই মক', '১৫টি এডব্লিউএ এআই মূল্যায়ন', 'এফএসআরএস ১,২০০ শব্দের ভোকাব ডেক'],
  },
  'gre-mock-pack-5': {
    nameBn: 'জিআরই ৫ পূর্ণাঙ্গ মক প্যাক',
    fullMocks: 5,
    aiCredits: 5,
    featuresEn: ['5 Adaptive GRE Mock Tests', '5 AWA Issue Evaluations', 'Trap Analytics Breakdown'],
    featuresBn: ['৫টি অ্যাডাপটিভ জিআরই মক টেস্ট', '৫টি এডব্লিউএ মূল্যায়ন', 'ট্র্যাপ অ্যানালিটিক্স'],
  },
  'lumen-annual-pass': {
    nameBn: 'লুমেন অল-অ্যাক্সেস বার্ষিক পাস',
    fullMocks: 20,
    aiCredits: 50,
    featuresEn: ['20 Full GRE & IELTS Mocks', '50 AI Rubric Evaluations', '365-Day Full Curriculum Access'],
    featuresBn: ['২০টি জিআরই ও আইইএলটিএস মক', '৫০টি এআই রুব্রিক মূল্যায়ন', '৩৬৫ দিনের পূর্ণ অ্যাক্সেস'],
  },
  'gre-core': {
    nameBn: 'জিআরই কোর',
    fullMocks: 6,
    aiCredits: 20,
    featuresEn: ['6 Adaptive GRE Mocks', '20 AWA AI Evaluations', 'Quant & Verbal Pacing Engine'],
    featuresBn: ['৬টি অ্যাডাপটিভ জিআরই মক', '২০টি এডব্লিউএ এআই মূল্যায়ন', 'কোয়ান্ট ও ভার্বাল পেসিং ইঞ্জিন'],
  },
  'gre-plus': {
    nameBn: 'জিআরই প্লাস',
    fullMocks: 10,
    aiCredits: 35,
    featuresEn: ['10 Adaptive GRE Mocks', '35 AWA AI Evaluations', 'Live Mentor Doubt Clinics'],
    featuresBn: ['১০টি অ্যাডাপটিভ জিআরই মক', '৩৫টি এডব্লিউএ এআই মূল্যায়ন', 'লাইভ মেন্টর ডাউট ক্লিনিক'],
  },
  'ielts-academic-plus': {
    nameBn: 'আইইএলটিএস একাডেমিক প্লাস',
    fullMocks: 8,
    aiCredits: 25,
    featuresEn: ['8 Full CD-IELTS Mocks', '25 AI Writing & Speaking Evals', 'Line-by-Line Mentor Calibration'],
    featuresBn: ['৮টি পূর্ণাঙ্গ সিডি-আইইএলটিএস মক', '২৫টি এআই রাইটিং ও স্পিকিং মূল্যায়ন', 'মেন্টর ক্যালিব্রেশন'],
  },
  'ai-credits-10': {
    nameBn: '১০ এআই মূল্যায়ন ক্রেডিট',
    fullMocks: 0,
    aiCredits: 10,
    featuresEn: ['10 Calibrated AI Evaluations', 'Valid Across GRE AWA & IELTS', 'Instant Criterion Feedback'],
    featuresBn: ['১০টি ক্যালিব্রেটেড এআই মূল্যায়ন', 'জিআরই ও আইইএলটিএস উভয় ক্ষেত্রে প্রযোজ্য', 'তাৎক্ষণিক রুব্রিক ফিডব্যাক'],
  },
  'mock-pack-4': {
    nameBn: 'ফুল মক প্যাক (৪টি মক)',
    fullMocks: 4,
    aiCredits: 4,
    featuresEn: ['4 Full Computer-Based Mocks', '4 AI Rubric Evaluations', '90-Day Score Ledger'],
    featuresBn: ['৪টি কম্পিউটার-ভিত্তিক মক', '৪টি এআই রুব্রিক মূল্যায়ন', '৯০ দিনের স্কোর লেজার'],
  },
  'human-review-pack': {
    nameBn: '১-অন-১ রিভিউ ও ফিডব্যাক বান্ডিল',
    fullMocks: 2,
    aiCredits: 10,
    featuresEn: ['2 Full Diagnostic Mocks', '10 AI + Mentor Rubric Reviews', '1-on-1 Study Plan Calibration'],
    featuresBn: ['২টি পূর্ণ ডায়াগনস্টিক মক', '১০টি এআই ও মেন্টর রিভিউ', '১-অন-১ স্টাডি প্ল্যান'],
  },
};

function createInitialRuntimeState(): RuntimeCatalogSnapshot {
  const plans: Record<string, RuntimeCatalogPlan> = {};
  for (const [planId, def] of Object.entries(CANONICAL_BDT_PLANS)) {
    const meta = PLAN_DEFAULT_META[planId];
    plans[planId] = {
      planId: def.planId,
      label: def.label,
      nameEn: def.label,
      nameBn: meta?.nameBn ?? def.label,
      baseBdt: def.baseBdt,
      baseUsd: def.baseUsd,
      totalBdt: def.totalBdt,
      splitPayEligible: def.splitPayEligible,
      allowSplit: def.splitPayEligible,
      active: true,
      featuresEn: meta ? [...meta.featuresEn] : [`${def.label} Full Access`, 'Server-Timed Exam Simulator'],
      featuresBn: meta ? [...meta.featuresBn] : [`${def.label} পূর্ণ অ্যাক্সেস`, 'সার্ভার-টাইমড সিমুলেটর'],
      fullMocks: meta?.fullMocks ?? 5,
      aiCredits: meta?.aiCredits ?? 15,
      isCustom: false,
    };
  }

  const promoCodes: Record<string, RuntimePromoCode> = {};
  for (const [code, promo] of Object.entries(CANONICAL_PROMO_CODES)) {
    promoCodes[code] = {
      code: promo.code,
      discountType: promo.discountType,
      value: promo.value,
      active: promo.active,
      labelEn: promo.labelEn,
      labelBn: promo.labelBn,
      maxRedemptions: promo.maxRedemptions ?? null,
      redemptionsCount: promo.redemptionsCount ?? 0,
      expiresAt: promo.expiresAt ?? null,
    };
  }

  return {
    plans,
    feeRates: {
      split2Rate: SPLIT_PROCESSING_FEE_RATES['split-2'],
      split3Rate: SPLIT_PROCESSING_FEE_RATES['split-3'],
      vatRateBdt: DEFAULT_VAT_RATE_BDT,
    },
    promoCodes,
    orders: [
      {
        id: 'LMN-2026-8841',
        scholar: 'Ayman Rahman',
        email: 'ayman@lumen.academy',
        cohort: 'GRE & IELTS Fall Cohort',
        planId: 'gre-complete',
        planLabel: 'GRE Complete',
        currency: 'BDT',
        amount: 10054,
        splitMode: 'split-2',
        splitStatus: 'Installment 1/2 Paid',
        paymentMethod: 'bKash (Split-Pay)',
        mushakVerified: false,
        mushakChalanId: null,
        corporateBin: null,
        createdAt: '2026-11-15 09:15 BST',
      },
      {
        id: 'LMN-2026-8839',
        scholar: 'Nusrat Jahan',
        email: 'nusrat.du@example.com',
        cohort: 'IELTS Academic Band 8.0',
        planId: 'ielts-academic-plus',
        planLabel: 'IELTS Academic Plus',
        currency: 'BDT',
        amount: 6490,
        splitMode: 'full',
        splitStatus: 'Paid in Full',
        paymentMethod: 'Nagad',
        mushakVerified: true,
        mushakChalanId: 'M63-2026-00419',
        corporateBin: '001234567-0101',
        createdAt: '2026-11-15 08:40 BST',
      },
      {
        id: 'LMN-2026-8834',
        scholar: 'Tahmid Hasan',
        email: 'tahmid.buet@example.com',
        cohort: 'GRE Quant Intensive',
        planId: 'gre-plus',
        planLabel: 'GRE Plus',
        currency: 'USD',
        amount: 82.75,
        splitMode: 'split-3',
        splitStatus: 'Installment 1/3 Paid',
        paymentMethod: 'International Visa (USD)',
        mushakVerified: false,
        mushakChalanId: null,
        corporateBin: null,
        createdAt: '2026-11-14 21:10 BST',
      },
      {
        id: 'LMN-2026-8827',
        scholar: 'Farhana Karim',
        email: 'farhana.nsu@example.com',
        cohort: 'IELTS Academic Core',
        planId: 'ielts-academic-core',
        planLabel: 'IELTS Academic Core',
        currency: 'BDT',
        amount: 3990,
        splitMode: 'full',
        splitStatus: 'Offline Pending',
        paymentMethod: 'Bank Transfer (Manual)',
        mushakVerified: false,
        mushakChalanId: null,
        corporateBin: '004891220-0102',
        createdAt: '2026-11-14 17:50 BST',
      },
    ],
    topRibbon: {
      enabled: true,
      textEn: 'Fall 2026 Cohort Open · Server-Timed GRE & CD-IELTS Simulator + Dual BDT/USD Settlement',
      textBn: 'ফল ২০২৬ কোহর্ট চালু · সার্ভার-টাইমড জিআরই ও সিডি-আইইএলটিএস সিমুলেটর + BDT/USD পেমেন্ট',
      ctaLabelEn: 'Explore Plans',
      ctaLabelBn: 'প্ল্যান দেখুন',
      ctaHref: '/pricing',
    },
    moderationQueue: [
      {
        id: 'SUB-4091',
        scholar: 'Nusrat Jahan',
        type: 'Writing',
        task: 'IELTS Writing Task 2 — Urban Transit Policy',
        excerpt: 'While congestion pricing curtails private vehicle volume in Dhaka corridors, equitable feeder transit remains decisive...',
        submittedAt: '12 mins ago',
        aiBandOrScore: 'Band 7.5',
        status: 'Pending Review',
        feedbackNote: '',
      },
      {
        id: 'SUB-4088',
        scholar: 'Ayman Rahman',
        type: 'Writing',
        task: 'GRE AWA Issue — Automation & Academic Research',
        excerpt: 'Automated literature synthesis accelerates hypothesis generation, yet epistemological rigor demands human peer scrutiny...',
        submittedAt: '28 mins ago',
        aiBandOrScore: '5.0 / 6.0',
        status: 'Pending Review',
        feedbackNote: '',
      },
      {
        id: 'SUB-4082',
        scholar: 'Farhana Karim',
        type: 'Speaking',
        task: 'IELTS Speaking Part 2/3 — Environmental Design',
        excerpt: 'Passive cross-ventilation in monsoon architecture lowers cooling loads without sacrificing daylight quality...',
        submittedAt: '1 hr ago',
        aiBandOrScore: 'Band 7.0',
        status: 'Approved',
        feedbackNote: 'Natural lexical range and sustained coherence.',
      },
    ],
    cmsItems: [
      {
        id: 'CMS-VOC-01',
        kind: 'vocab',
        titleEn: 'Equivocal (adj.)',
        titleBn: 'দ্ব্যর্থক (Equivocal)',
        bodyEn: 'Open to more than one interpretation; ambiguous. GRE TC contrast trigger.',
        bodyBn: 'একাধিক অর্থবোধক বা অস্পষ্ট। জিআরই টেক্সট কমপ্লিশনে ব্যবহৃত।',
        active: true,
      },
      {
        id: 'CMS-FAQ-01',
        kind: 'faq',
        titleEn: 'How does Split-Pay clearing work?',
        titleBn: 'স্প্লিট-পে ক্লিয়ারিং ফি কীভাবে কাজ করে?',
        bodyEn: 'Full payment carries 0% processing fee; 2-Part Split adds +2.85% and 3-Part Split adds +4.75% gateway clearing fee.',
        bodyBn: 'সম্পূর্ণ পেমেন্টে ০% ফি; ২-কিস্তিতে +২.৮৫% এবং ৩-কিস্তিতে +৪.৭৫% গেটওয়ে ও ক্লিয়ারিং ফি প্রযোজ্য।',
        active: true,
      },
    ],
    scholars: [
      {
        id: 'SCH-01',
        name: 'Ayman Rahman',
        email: 'ayman@lumen.academy',
        cohort: 'GRE & IELTS Fall Cohort',
        planId: 'gre-complete',
        aiCreditsRemaining: 24,
        expiresAt: '2027-05-15',
        diagnosticStatus: 'Completed',
        bandEstimate: '324 GRE / 8.0 IELTS',
      },
      {
        id: 'SCH-02',
        name: 'Nusrat Jahan',
        email: 'nusrat.du@example.com',
        cohort: 'IELTS Academic Band 8.0',
        planId: 'ielts-academic-plus',
        aiCreditsRemaining: 18,
        expiresAt: '2027-04-20',
        diagnosticStatus: 'Completed',
        bandEstimate: 'Band 7.5',
      },
      {
        id: 'SCH-03',
        name: 'Tahmid Hasan',
        email: 'tahmid.buet@example.com',
        cohort: 'GRE Quant Intensive',
        planId: 'gre-plus',
        aiCreditsRemaining: 31,
        expiresAt: '2027-06-01',
        diagnosticStatus: 'In Progress',
        bandEstimate: '318 GRE',
      },
      {
        id: 'SCH-04',
        name: 'Farhana Karim',
        email: 'farhana.nsu@example.com',
        cohort: 'IELTS Academic Core',
        planId: 'ielts-academic-core',
        aiCreditsRemaining: 9,
        expiresAt: '2027-03-10',
        diagnosticStatus: 'Completed',
        bandEstimate: 'Band 7.0',
      },
    ],
    psychometrics: [
      {
        id: 'PSY-01',
        domain: 'GRE Quant Comparison',
        itemCode: 'QC-ALG-114',
        pValue: 0.44,
        bParam: '+1.42',
        discriminationIndex: 1.68,
        trapRate: '34.2%',
        aiStrictness: 'Calibrated',
      },
      {
        id: 'PSY-02',
        domain: 'GRE Text Completion',
        itemCode: 'TC-3B-209',
        pValue: 0.36,
        bParam: '+1.85',
        discriminationIndex: 1.54,
        trapRate: '41.8%',
        aiStrictness: 'Strict',
      },
      {
        id: 'PSY-03',
        domain: 'CD-IELTS Reading',
        itemCode: 'RD-TFNG-087',
        pValue: 0.58,
        bParam: '+0.94',
        discriminationIndex: 1.41,
        trapRate: '29.5%',
        aiStrictness: 'Standard',
      },
      {
        id: 'PSY-04',
        domain: 'IELTS Writing Task 2',
        itemCode: 'WT2-URB-041',
        pValue: 0.51,
        bParam: '+1.18',
        discriminationIndex: 1.73,
        trapRate: '31.0%',
        aiStrictness: 'Calibrated',
      },
    ],
    featureFlags: {
      translateBudgetGuard: true,
      guestCheckoutEnabled: true,
      splitPayEnabled: true,
      maintenanceBanner: false,
      aiStrictnessLevel: 'calibrated' as 'standard' | 'strict' | 'lenient',
    },
    auditLogs: [
      {
        id: 'AUD-901',
        timestamp: '2026-11-15 11:42:08 BST',
        actor: 'System Guard',
        action: 'WEBHOOK_HMAC_VERIFIED',
        subsystem: 'SSLCommerz / bKash IPN',
        detail: 'HMAC-SHA256 webhook signature & val_id cross-check enforced',
        status: 'Verified',
      },
      {
        id: 'AUD-900',
        timestamp: '2026-11-15 11:38:51 BST',
        actor: 'System Guard',
        action: 'RATE_LIMIT_ACTIVE',
        subsystem: 'OTP & Admin Throttle',
        detail: 'Sliding-window rate limit active on /api/checkout/verify & /api/admin/catalog',
        status: 'Enforced',
      },
      {
        id: 'AUD-899',
        timestamp: '2026-11-15 11:31:14 BST',
        actor: 'Ayman Rahman',
        action: 'SPLIT_PAY_FEE_SYNC',
        subsystem: 'Canonical Pricing Engine',
        detail: 'Split-Pay clearing rates locked at 2.85% (2-part) / 4.75% (3-part)',
        status: 'Verified',
      },
      {
        id: 'AUD-898',
        timestamp: '2026-11-15 11:24:03 BST',
        actor: 'System Guard',
        action: 'MUSHAK_63_VAT_ACTIVE',
        subsystem: 'Mushak 6.3 VAT Ledger',
        detail: 'Server-authoritative 15% BD VAT calculation enabled for BDT settlement',
        status: 'Verified',
      },
    ],
    updatedAtIso: new Date().toISOString(),
  };
}

const GLOBAL_STORE_KEY = '__lumenRuntimeCatalogStore_v1';

interface GlobalStoreContainer {
  [GLOBAL_STORE_KEY]?: RuntimeCatalogSnapshot;
}

function getStore(): RuntimeCatalogSnapshot {
  const g = globalThis as unknown as GlobalStoreContainer;
  if (!g[GLOBAL_STORE_KEY]) {
    g[GLOBAL_STORE_KEY] = createInitialRuntimeState();
    g[GLOBAL_STORE_KEY].featureFlags.aiStrictnessLevel = 'standard';
  }
  return g[GLOBAL_STORE_KEY];
}

function cloneSnapshot(src: RuntimeCatalogSnapshot): RuntimeCatalogSnapshot {
  return JSON.parse(JSON.stringify(src)) as RuntimeCatalogSnapshot;
}

function appendAudit(
  store: RuntimeCatalogSnapshot,
  actor: string,
  action: string,
  subsystem: string,
  detail: string,
  status: RuntimeAuditEntry['status'] = 'Updated',
): void {
  const entry: RuntimeAuditEntry = {
    id: `AUD-${Math.floor(1000 + Math.random() * 9000)}`,
    timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC',
    actor,
    action,
    subsystem,
    detail,
    status,
  };
  store.auditLogs = [entry, ...store.auditLogs].slice(0, 100);
  store.updatedAtIso = new Date().toISOString();
}

export function getRuntimeCatalog(): RuntimeCatalogSnapshot {
  return cloneSnapshot(getStore());
}

export function resetRuntimeCatalogToDefaults(actor = 'Admin Console'): RuntimeCatalogSnapshot {
  const g = globalThis as unknown as GlobalStoreContainer;
  const fresh = createInitialRuntimeState();
  fresh.featureFlags.aiStrictnessLevel = 'standard';
  appendAudit(fresh, actor, 'RESET_DEFAULTS', 'Admin Catalog Store', 'Restored canonical factory settings', 'Verified');
  g[GLOBAL_STORE_KEY] = fresh;
  return cloneSnapshot(fresh);
}

export interface UpdateRuntimePlanInput {
  baseBdt?: number;
  baseUsd?: number;
  nameEn?: string;
  nameBn?: string;
  featuresEn?: string[];
  featuresBn?: string[];
  allowSplit?: boolean;
  active?: boolean;
  fullMocks?: number;
  aiCredits?: number;
}

export function updateRuntimePlan(
  planId: string,
  patch: UpdateRuntimePlanInput,
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();
  if (!Object.prototype.hasOwnProperty.call(store.plans, planId)) {
    throw new PaymentSecurityError('SECURITY_UNKNOWN_PLAN', `Unknown planId "${planId}"`);
  }
  const existing = store.plans[planId];
  if (!existing) {
    throw new PaymentSecurityError('SECURITY_UNKNOWN_PLAN', `Unknown planId "${planId}"`);
  }

  const nextBaseBdt = patch.baseBdt !== undefined ? Math.max(0, Math.round(patch.baseBdt)) : existing.baseBdt;
  const nextBaseUsd = patch.baseUsd !== undefined ? Math.max(0, Number(patch.baseUsd.toFixed(2))) : existing.baseUsd;
  const nextTotalBdt = nextBaseBdt + Math.round(nextBaseBdt * store.feeRates.vatRateBdt);
  const nextAllowSplit = patch.allowSplit !== undefined ? patch.allowSplit : existing.allowSplit;
  const nextSplitEligible =
    patch.allowSplit !== undefined
      ? patch.allowSplit
      : existing.isCustom
        ? nextAllowSplit
        : nextAllowSplit && nextTotalBdt >= SPLIT_PAY_MIN_BDT;

  const nextNameEn = patch.nameEn?.trim() ? patch.nameEn.trim() : existing.nameEn;

  store.plans[planId] = {
    ...existing,
    label: nextNameEn,
    nameEn: nextNameEn,
    nameBn: patch.nameBn?.trim() ? patch.nameBn.trim() : existing.nameBn,
    baseBdt: nextBaseBdt,
    baseUsd: nextBaseUsd,
    totalBdt: nextTotalBdt,
    allowSplit: nextAllowSplit,
    splitPayEligible: nextSplitEligible,
    active: patch.active !== undefined ? patch.active : existing.active,
    featuresEn: patch.featuresEn ? [...patch.featuresEn] : existing.featuresEn,
    featuresBn: patch.featuresBn ? [...patch.featuresBn] : existing.featuresBn,
    fullMocks: patch.fullMocks !== undefined ? Math.max(0, Math.round(patch.fullMocks)) : existing.fullMocks,
    aiCredits: patch.aiCredits !== undefined ? Math.max(0, Math.round(patch.aiCredits)) : existing.aiCredits,
  };

  appendAudit(
    store,
    actor,
    'UPDATE_PLAN',
    'Catalog & Pricing',
    `Updated ${planId}: ৳${nextBaseBdt} / $${nextBaseUsd} (split=${String(nextSplitEligible)}, active=${String(store.plans[planId].active)})`,
  );

  return cloneSnapshot(store);
}

export interface AddRuntimePlanInput {
  planId: string;
  nameEn: string;
  nameBn?: string;
  baseBdt: number;
  baseUsd: number;
  featuresEn?: string[];
  featuresBn?: string[];
  allowSplit?: boolean;
  fullMocks?: number;
  aiCredits?: number;
}

const RESERVED_KEYS = new Set(['__proto__', 'constructor', 'prototype', 'toString', 'valueOf']);

export function addRuntimePlan(
  input: AddRuntimePlanInput,
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();
  const cleanId = input.planId
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '');

  if (!cleanId || RESERVED_KEYS.has(cleanId)) {
    throw new PaymentSecurityError('SECURITY_UNKNOWN_PLAN', `Invalid planId "${input.planId}"`);
  }

  const baseBdt = Math.max(0, Math.round(input.baseBdt));
  const baseUsd = Math.max(0, Number(input.baseUsd.toFixed(2)));
  const totalBdt = baseBdt + Math.round(baseBdt * store.feeRates.vatRateBdt);
  const allowSplit = input.allowSplit ?? totalBdt >= SPLIT_PAY_MIN_BDT;
  const nameEn = input.nameEn.trim();
  const nameBn = input.nameBn?.trim() || nameEn;

  store.plans[cleanId] = {
    planId: cleanId,
    label: nameEn,
    nameEn,
    nameBn,
    baseBdt,
    baseUsd,
    totalBdt,
    allowSplit,
    splitPayEligible: allowSplit,
    active: true,
    featuresEn:
      input.featuresEn && input.featuresEn.length > 0
        ? [...input.featuresEn]
        : ['Full Computer-Based Mock Engine', 'Server-Timed Diagnostic Analytics'],
    featuresBn:
      input.featuresBn && input.featuresBn.length > 0
        ? [...input.featuresBn]
        : ['পূর্ণাঙ্গ কম্পিউটার-ভিত্তিক মক ইঞ্জিন', 'সার্ভার-টাইমড ডায়াগনস্টিক বিশ্লেষণ'],
    fullMocks: input.fullMocks ?? 5,
    aiCredits: input.aiCredits ?? 15,
    isCustom: true,
  };

  appendAudit(
    store,
    actor,
    'ADD_PLAN',
    'Catalog & Pricing',
    `Created package "${cleanId}" (${nameEn}) at ৳${baseBdt} / $${baseUsd}`,
  );

  return cloneSnapshot(store);
}

export function updateRuntimeFeeRates(
  patch: Partial<RuntimeFeeRates>,
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();
  const nextSplit2 =
    patch.split2Rate !== undefined ? Math.max(0, Math.min(0.25, Number(patch.split2Rate))) : store.feeRates.split2Rate;
  const nextSplit3 =
    patch.split3Rate !== undefined ? Math.max(0, Math.min(0.25, Number(patch.split3Rate))) : store.feeRates.split3Rate;
  const nextVat =
    patch.vatRateBdt !== undefined ? Math.max(0, Math.min(0.35, Number(patch.vatRateBdt))) : store.feeRates.vatRateBdt;

  store.feeRates = {
    split2Rate: nextSplit2,
    split3Rate: nextSplit3,
    vatRateBdt: nextVat,
  };

  for (const key of Object.keys(store.plans)) {
    const plan = store.plans[key];
    if (!plan) continue;
    plan.totalBdt = plan.baseBdt + Math.round(plan.baseBdt * nextVat);
  }

  appendAudit(
    store,
    actor,
    'UPDATE_FEES',
    'Split-Pay & VAT Ledger',
    `Updated fees: 2-part=${(nextSplit2 * 100).toFixed(2)}%, 3-part=${(nextSplit3 * 100).toFixed(2)}%, BD VAT=${(nextVat * 100).toFixed(1)}%`,
  );

  return cloneSnapshot(store);
}

export interface UpsertRuntimePromoInput {
  code: string;
  discountType: 'percent' | 'fixed';
  value: number;
  active?: boolean;
  labelEn?: string;
  labelBn?: string;
  maxRedemptions?: number | null;
  expiresAt?: string | null;
}

export function upsertRuntimePromoCode(
  input: UpsertRuntimePromoInput,
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();
  const cleanCode = input.code.trim().toUpperCase().replace(/[^A-Z0-9_-]/g, '');
  if (!cleanCode || RESERVED_KEYS.has(cleanCode)) {
    throw new Error('Promo code must contain alphanumeric characters');
  }

  const existing = store.promoCodes[cleanCode];
  const safeValue =
    input.discountType === 'percent'
      ? Math.max(1, Math.min(100, Number(input.value)))
      : Math.max(1, Number(input.value));

  store.promoCodes[cleanCode] = {
    code: cleanCode,
    discountType: input.discountType,
    value: safeValue,
    active: input.active ?? existing?.active ?? true,
    labelEn:
      input.labelEn?.trim() ||
      existing?.labelEn ||
      (input.discountType === 'percent' ? `${safeValue}% Scholarship Grant` : `${safeValue} Flat Grant`),
    labelBn:
      input.labelBn?.trim() ||
      existing?.labelBn ||
      (input.discountType === 'percent' ? `${safeValue}% স্কলারশিপ ছাড়` : `${safeValue} ফ্ল্যাট ছাড়`),
    maxRedemptions: input.maxRedemptions !== undefined ? input.maxRedemptions : (existing?.maxRedemptions ?? null),
    redemptionsCount: existing?.redemptionsCount ?? 0,
    expiresAt: input.expiresAt !== undefined ? input.expiresAt : (existing?.expiresAt ?? null),
  };

  appendAudit(
    store,
    actor,
    'UPSERT_PROMO',
    'Promos & Scholarships',
    `Saved promo ${cleanCode} (${input.discountType}: ${safeValue}, active=${String(store.promoCodes[cleanCode].active)})`,
  );

  return cloneSnapshot(store);
}

export function toggleRuntimePromoCode(
  code: string,
  active?: boolean,
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();
  const cleanCode = code.trim().toUpperCase();
  if (!Object.prototype.hasOwnProperty.call(store.promoCodes, cleanCode) || !store.promoCodes[cleanCode]) {
    throw new Error(`Unknown promo code "${cleanCode}"`);
  }
  const nextActive = active !== undefined ? active : !store.promoCodes[cleanCode].active;
  store.promoCodes[cleanCode].active = nextActive;

  appendAudit(
    store,
    actor,
    'TOGGLE_PROMO',
    'Promos & Scholarships',
    `${nextActive ? 'Activated' : 'Paused'} promo code ${cleanCode}`,
  );

  return cloneSnapshot(store);
}

export function applyRuntimeOrderAction(
  orderId: string,
  action: 'refund' | 'mark_paid' | 'issue_mushak',
  corporateBin?: string,
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();
  const order = store.orders.find((o) => o.id === orderId);
  if (!order) {
    throw new Error(`Unknown orderId "${orderId}"`);
  }

  if (action === 'refund') {
    order.splitStatus = 'Refunded';
  } else if (action === 'mark_paid') {
    order.splitStatus = 'Paid in Full';
  } else if (action === 'issue_mushak') {
    order.mushakVerified = true;
    order.mushakChalanId = order.mushakChalanId ?? `M63-2026-${Math.floor(10000 + Math.random() * 89999)}`;
    if (corporateBin?.trim()) {
      order.corporateBin = corporateBin.trim();
    }
  }

  appendAudit(
    store,
    actor,
    `ORDER_${action.toUpperCase()}`,
    'Orders & Mushak 6.3',
    `Order ${orderId}: ${action}${order.mushakChalanId ? ` (${order.mushakChalanId})` : ''}`,
    'Verified',
  );

  return cloneSnapshot(store);
}

export type RuntimeCmsUpdatePayload =
  | {
      kind: 'top_ribbon';
      enabled: boolean;
      textEn: string;
      textBn: string;
      ctaLabelEn?: string;
      ctaLabelBn?: string;
      ctaHref?: string;
    }
  | {
      kind: 'moderate';
      submissionId: string;
      decision: 'approve' | 'revision' | 'remove';
      feedbackNote?: string;
    }
  | {
      kind: 'upsert_item';
      item: RuntimeCmsVocabFaqItem;
    };

export function applyRuntimeCmsUpdate(
  payload: RuntimeCmsUpdatePayload,
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();

  if (payload.kind === 'top_ribbon') {
    store.topRibbon = {
      enabled: payload.enabled,
      textEn: payload.textEn.trim(),
      textBn: payload.textBn.trim(),
      ctaLabelEn: payload.ctaLabelEn?.trim() || store.topRibbon.ctaLabelEn,
      ctaLabelBn: payload.ctaLabelBn?.trim() || store.topRibbon.ctaLabelBn,
      ctaHref: payload.ctaHref?.trim() || store.topRibbon.ctaHref,
    };
    appendAudit(store, actor, 'CMS_TOP_RIBBON', 'CMS & Moderation', `Updated announcement banner (enabled=${String(payload.enabled)})`);
  } else if (payload.kind === 'moderate') {
    const sub = store.moderationQueue.find((item) => item.id === payload.submissionId);
    if (!sub) {
      throw new Error(`Unknown submissionId "${payload.submissionId}"`);
    }
    sub.status =
      payload.decision === 'approve'
        ? 'Approved'
        : payload.decision === 'revision'
          ? 'Revision Requested'
          : 'Removed';
    if (payload.feedbackNote !== undefined) {
      sub.feedbackNote = payload.feedbackNote.trim();
    }
    appendAudit(
      store,
      actor,
      'CMS_MODERATE',
      'CMS & Moderation',
      `Submission ${sub.id} marked "${sub.status}"`,
    );
  } else {
    const idx = store.cmsItems.findIndex((entry) => entry.id === payload.item.id);
    if (idx >= 0) {
      store.cmsItems[idx] = { ...payload.item };
    } else {
      store.cmsItems = [payload.item, ...store.cmsItems];
    }
    appendAudit(
      store,
      actor,
      'CMS_UPSERT_ITEM',
      'CMS & Moderation',
      `Saved ${payload.item.kind.toUpperCase()} entry "${payload.item.titleEn}"`,
    );
  }

  return cloneSnapshot(store);
}

export function applyRuntimeScholarAction(
  scholarId: string,
  action: 'extend_30d' | 'grant_ai_credits' | 'reset_diagnostic' | 'switch_cohort',
  payload?: { credits?: number; cohort?: string },
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();
  const scholar = store.scholars.find((s) => s.id === scholarId);
  if (!scholar) {
    throw new Error(`Unknown scholarId "${scholarId}"`);
  }

  if (action === 'extend_30d') {
    const baseTime = Date.parse(scholar.expiresAt) || Date.now();
    const nextDate = new Date(baseTime + 30 * 86_400_000);
    scholar.expiresAt = nextDate.toISOString().slice(0, 10);
  } else if (action === 'grant_ai_credits') {
    const delta = payload?.credits && payload.credits > 0 ? Math.round(payload.credits) : 5;
    scholar.aiCreditsRemaining += delta;
  } else if (action === 'reset_diagnostic') {
    scholar.diagnosticStatus = 'Reset Pending';
  } else if (action === 'switch_cohort' && payload?.cohort?.trim()) {
    scholar.cohort = payload.cohort.trim();
  }

  appendAudit(
    store,
    actor,
    `SCHOLAR_${action.toUpperCase()}`,
    'Scholar CRM',
    `Scholar ${scholar.name} (${scholar.id}): ${action}`,
  );

  return cloneSnapshot(store);
}

export function toggleRuntimeFeatureFlag(
  flag: keyof RuntimeFeatureFlags,
  value?: boolean | 'standard' | 'strict' | 'lenient',
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();
  if (flag === 'aiStrictnessLevel') {
    if (value === 'standard' || value === 'strict' || value === 'lenient') {
      store.featureFlags.aiStrictnessLevel = value;
    }
  } else {
    const current = store.featureFlags[flag];
    store.featureFlags[flag] = typeof value === 'boolean' ? value : !current;
  }

  appendAudit(
    store,
    actor,
    'TOGGLE_FLAG',
    'Kill-Switches & Guards',
    `Flag "${flag}" set to ${String(store.featureFlags[flag])}`,
    'Enforced',
  );

  return cloneSnapshot(store);
}

export function updateRuntimePsychometricStrictness(
  itemId: string,
  aiStrictness: RuntimePsychometricItem['aiStrictness'],
  actor = 'Admin Console',
): RuntimeCatalogSnapshot {
  const store = getStore();
  const item = store.psychometrics.find((p) => p.id === itemId);
  if (!item) {
    throw new Error(`Unknown psychometric item "${itemId}"`);
  }
  item.aiStrictness = aiStrictness;

  appendAudit(
    store,
    actor,
    'CALIBRATE_ITEM',
    'AI Calibration & Psychometrics',
    `Item ${item.itemCode} strictness set to ${aiStrictness}`,
  );

  return cloneSnapshot(store);
}

export interface InstallmentEntry {
  readonly installmentNumber: 1 | 2 | 3;
  readonly percentage: number;
  readonly dueInDays: 0 | 30 | 60;
  readonly amount: number;
  readonly amountBdt: number;
}

export interface CanonicalOrderSummary {
  readonly planId: string;
  readonly label: string;
  readonly splitParts: 1 | 2 | 3;
  readonly splitMode: SplitMode;
  readonly currency: SupportedCurrency;
  readonly rawBase: number;
  readonly discountAmount: number;
  readonly promoCodeApplied: string | null;
  readonly discountedBase: number;
  readonly processingFeeRate: number;
  readonly processingFee: number;
  readonly subtotal: number;
  readonly vatAmount: number;
  readonly totalAmount: number;
  readonly installmentNowAmount: number;
  readonly installmentLaterAmount: number;
  // Backward-compatible BDT fields
  readonly baseBdt: number;
  readonly vatBdt: number;
  readonly totalBdt: number;
  readonly baseTuitionBdt: number;
  readonly vat15Bdt: number;
  readonly dueTodayBdt: number;
  readonly installmentNowBdt: number;
  readonly installmentLaterBdt: number;
  readonly installmentSchedule: readonly InstallmentEntry[];
}

function resolveCanonicalPlan(planId: string): RuntimeCatalogPlan {
  const store = getStore();
  if (typeof planId !== 'string' || !Object.prototype.hasOwnProperty.call(store.plans, planId)) {
    throw new PaymentSecurityError('SECURITY_UNKNOWN_PLAN', `Unknown planId "${String(planId)}"`);
  }
  const plan = store.plans[planId];
  if (!plan || !plan.active) {
    throw new PaymentSecurityError('SECURITY_UNKNOWN_PLAN', `Unknown or inactive planId "${planId}"`);
  }
  return plan;
}

export function resolvePromoCode(promoCode?: string): RuntimePromoCode | null {
  if (typeof promoCode !== 'string') return null;
  const normalized = promoCode.trim().toUpperCase();
  const store = getStore();
  if (!normalized || !Object.prototype.hasOwnProperty.call(store.promoCodes, normalized)) {
    return null;
  }
  const promo = store.promoCodes[normalized];
  if (!promo || !promo.active) return null;
  if (promo.expiresAt) {
    const expMs = Date.parse(promo.expiresAt);
    if (Number.isFinite(expMs) && expMs < Date.now()) {
      return null;
    }
  }
  if (promo.maxRedemptions !== null && promo.redemptionsCount >= promo.maxRedemptions) {
    return null;
  }
  return promo;
}

function normalizeSplitMode(splitInput: 1 | 2 | 3 | SplitMode): { splitMode: SplitMode; splitParts: 1 | 2 | 3 } {
  if (splitInput === 1 || splitInput === 'full') return { splitMode: 'full', splitParts: 1 };
  if (splitInput === 2 || splitInput === 'split-2') return { splitMode: 'split-2', splitParts: 2 };
  if (splitInput === 3 || splitInput === 'split-3') return { splitMode: 'split-3', splitParts: 3 };
  throw new PaymentSecurityError(
    'SECURITY_INVALID_SPLIT_PARTS',
    `Unsupported splitMode "${String(splitInput)}"`,
  );
}

function roundCurrency(amount: number, currency: SupportedCurrency): number {
  return currency === 'USD' ? Number(amount.toFixed(2)) : Math.round(amount);
}

export function computeCanonicalOrder(
  planId: string,
  splitInput: 1 | 2 | 3 | SplitMode = 'full',
  currency: SupportedCurrency = 'BDT',
  promoCode?: string,
): CanonicalOrderSummary {
  const store = getStore();
  const plan = resolveCanonicalPlan(planId);
  const { splitMode, splitParts } = normalizeSplitMode(splitInput);

  if (splitParts > 1 && (!store.featureFlags.splitPayEnabled || !plan.splitPayEligible)) {
    throw new PaymentSecurityError(
      'SECURITY_SPLIT_PAY_NOT_ELIGIBLE',
      `Plan "${plan.planId}" (${plan.totalBdt} BDT) is not eligible for ${splitParts}-part split-pay`,
    );
  }

  const rawBase = currency === 'USD' ? plan.baseUsd : plan.baseBdt;
  const promo = resolvePromoCode(promoCode);
  const discountAmount = promo
    ? promo.discountType === 'percent'
      ? roundCurrency((rawBase * promo.value) / 100, currency)
      : roundCurrency(Math.min(rawBase, promo.value), currency)
    : 0;
  const discountedBase = Math.max(0, Number((rawBase - discountAmount).toFixed(2)));

  const processingFeeRate =
    splitMode === 'full'
      ? 0
      : splitMode === 'split-2'
        ? store.feeRates.split2Rate
        : store.feeRates.split3Rate;
  const processingFee = roundCurrency(discountedBase * processingFeeRate, currency);
  const subtotal = Number((discountedBase + processingFee).toFixed(2));
  const vatAmount = currency === 'BDT' ? Math.round(subtotal * store.feeRates.vatRateBdt) : 0;
  const totalAmount = Number((subtotal + vatAmount).toFixed(2));

  let installmentSchedule: InstallmentEntry[];
  if (splitParts === 1) {
    installmentSchedule = [
      { installmentNumber: 1, percentage: 100, dueInDays: 0, amount: totalAmount, amountBdt: totalAmount },
    ];
  } else if (splitParts === 2) {
    const first = roundCurrency(totalAmount * 0.5, currency);
    const second = Number((totalAmount - first).toFixed(2));
    installmentSchedule = [
      { installmentNumber: 1, percentage: 50, dueInDays: 0, amount: first, amountBdt: first },
      { installmentNumber: 2, percentage: 50, dueInDays: 30, amount: second, amountBdt: second },
    ];
  } else {
    const first = roundCurrency(totalAmount * 0.4, currency);
    const second = roundCurrency(totalAmount * 0.3, currency);
    const third = Number((totalAmount - first - second).toFixed(2));
    installmentSchedule = [
      { installmentNumber: 1, percentage: 40, dueInDays: 0, amount: first, amountBdt: first },
      { installmentNumber: 2, percentage: 30, dueInDays: 30, amount: second, amountBdt: second },
      { installmentNumber: 3, percentage: 30, dueInDays: 60, amount: third, amountBdt: third },
    ];
  }

  const installmentNowAmount = installmentSchedule[0]?.amount ?? totalAmount;
  const installmentLaterAmount = Number((totalAmount - installmentNowAmount).toFixed(2));

  return {
    planId: plan.planId,
    label: plan.label,
    splitParts,
    splitMode,
    currency,
    rawBase,
    discountAmount,
    promoCodeApplied: promo ? promo.code : null,
    discountedBase,
    processingFeeRate,
    processingFee,
    subtotal,
    vatAmount,
    totalAmount,
    installmentNowAmount,
    installmentLaterAmount,
    baseBdt: currency === 'BDT' ? subtotal : plan.baseBdt,
    vatBdt: vatAmount,
    totalBdt: currency === 'BDT' ? totalAmount : plan.totalBdt,
    baseTuitionBdt: currency === 'BDT' ? subtotal : plan.baseBdt,
    vat15Bdt: vatAmount,
    dueTodayBdt: installmentNowAmount,
    installmentNowBdt: installmentNowAmount,
    installmentLaterBdt: installmentLaterAmount,
    installmentSchedule,
  };
}

export function verifyClientAmountNotTampered(
  planId: string,
  clientSubmittedTotal: number,
  splitInput: 1 | 2 | 3 | SplitMode = 'full',
  currency: SupportedCurrency = 'BDT',
  promoCode?: string,
): CanonicalBdtPlan {
  const plan = resolveCanonicalPlan(planId);
  const expected = computeCanonicalOrder(planId, splitInput, currency, promoCode);

  if (
    typeof clientSubmittedTotal !== 'number' ||
    !Number.isFinite(clientSubmittedTotal) ||
    Math.abs(clientSubmittedTotal - expected.totalAmount) > 0.01
  ) {
    throw new PaymentSecurityError(
      'SECURITY_PRICE_TAMPER_DETECTED',
      `Client total ${String(clientSubmittedTotal)} ${currency} does not match canonical ${expected.totalAmount} ${currency} for "${plan.planId}"`,
    );
  }

  return plan;
}

const IDEMPOTENCY_KEY_REGEX = /^[a-zA-Z0-9_-]{16,64}$/;
const MAX_REPLAY_ENTRIES = 10_000;
const replayStore = new Map<string, number>();

function pruneReplayStore(nowMs: number): void {
  for (const [key, expiresAtMs] of replayStore.entries()) {
    if (expiresAtMs <= nowMs) {
      replayStore.delete(key);
    }
  }
}

export interface IdempotencyCheckInput {
  idempotencyKey: string;
  timestampMs: number;
  nowMs?: number;
  seenKeys?: Set<string>;
}

export interface IdempotencyCheckResult {
  ok: true;
  idempotencyKey: string;
  verifiedAtMs: number;
}

export function verifyIdempotencyAndTimestamp({
  idempotencyKey,
  timestampMs,
  nowMs = Date.now(),
  seenKeys,
}: IdempotencyCheckInput): IdempotencyCheckResult {
  if (typeof idempotencyKey !== 'string' || !IDEMPOTENCY_KEY_REGEX.test(idempotencyKey)) {
    throw new PaymentSecurityError(
      'SECURITY_INVALID_IDEMPOTENCY_KEY',
      'idempotencyKey must match ^[a-zA-Z0-9_-]{16,64}$',
    );
  }

  if (typeof timestampMs !== 'number' || !Number.isFinite(timestampMs)) {
    throw new PaymentSecurityError('SECURITY_TIMESTAMP_OUT_OF_WINDOW', 'timestampMs must be a finite epoch millisecond value');
  }

  const maxSkewMs = SECURITY_POLICY.webhookReplayWindowSeconds * 1000;
  if (Math.abs(nowMs - timestampMs) > maxSkewMs) {
    throw new PaymentSecurityError(
      'SECURITY_TIMESTAMP_OUT_OF_WINDOW',
      `Timestamp skew ${Math.abs(nowMs - timestampMs)}ms exceeds ${maxSkewMs}ms replay window`,
    );
  }

  if (seenKeys) {
    if (seenKeys.has(idempotencyKey)) {
      throw new PaymentSecurityError(
        'SECURITY_IDEMPOTENCY_REPLAY_DETECTED',
        `Duplicate idempotencyKey "${idempotencyKey}" rejected`,
      );
    }
    seenKeys.add(idempotencyKey);
    return { ok: true, idempotencyKey, verifiedAtMs: nowMs };
  }

  if (replayStore.size >= MAX_REPLAY_ENTRIES) {
    pruneReplayStore(nowMs);
  }

  const existingExpiry = replayStore.get(idempotencyKey);
  if (existingExpiry !== undefined && existingExpiry > nowMs) {
    throw new PaymentSecurityError(
      'SECURITY_IDEMPOTENCY_REPLAY_DETECTED',
      `Duplicate idempotencyKey "${idempotencyKey}" rejected`,
    );
  }

  replayStore.set(idempotencyKey, nowMs + maxSkewMs);
  return { ok: true, idempotencyKey, verifiedAtMs: nowMs };
}

export function clearIdempotencyReplayCache(): void {
  replayStore.clear();
}

export function signWebhookPayload(payload: string | Buffer, secret: string): string {
  if (!secret) {
    throw new Error('HMAC secret must not be empty');
  }
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

export function verifyWebhookHmacSignature(
  payload: string | Buffer,
  providedSignatureHex: string,
  secret: string,
): boolean {
  if (!secret || typeof providedSignatureHex !== 'string' || !providedSignatureHex) {
    return false;
  }

  const normalized = providedSignatureHex.startsWith('sha256=')
    ? providedSignatureHex.slice(7).trim()
    : providedSignatureHex.trim();

  if (!/^[0-9a-fA-F]{64}$/.test(normalized)) {
    return false;
  }

  const expectedHex = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  const expectedBuf = Buffer.from(expectedHex, 'hex');
  const providedBuf = Buffer.from(normalized.toLowerCase(), 'hex');

  if (expectedBuf.length !== providedBuf.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuf, providedBuf);
}
