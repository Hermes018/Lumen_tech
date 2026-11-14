/** @purpose Interactive Honest Pricing Page with tier matrices, regional switcher, bKash installments modal, and pass packs (docs/17) */
'use client';

import * as React from 'react';
import { useTranslations } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import {
  type Region,
  getInstallmentSchedule,
} from '@lumen/core';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@lumen/ui';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Clock,
  CheckCircle2,
  Award,
  Receipt,
  Smartphone,
} from 'lucide-react';
import { BangladeshPaymentTrustBar } from '../_components/BangladeshPaymentTrustBar';

type ExamType = 'gre' | 'ielts_academic' | 'ielts_gt';

interface TierData {
  slug: string;
  name: string;
  tier: 'free' | 'core' | 'plus' | 'live' | 'crash' | 'mentor';
  badge?: string;
  popular?: boolean;
  priceBD: string;
  priceA: string;
  priceB: string;
  priceC: string;
  duration: string;
  description: string;
  perks: string[];
  hasInstallments?: boolean;
}

const PRICING_DATA: Record<ExamType, TierData[]> = {
  gre: [
    {
      slug: 'gre-free',
      name: 'Free Diagnostic',
      tier: 'free',
      priceBD: '৳ 0',
      priceA: '$0',
      priceB: '$0',
      priceC: '$0',
      duration: 'Lifetime',
      description: 'Find your baseline with our authentic CBT diagnostic.',
      perks: [
        '1 Express Diagnostic Mock (15 min)',
        'Rasch 1PL Ability Score Estimate',
        'Top Distractor Trap Diagnostics',
        '2 AI Evaluation Credits at sign-up',
        '1 AI Evaluation Credit / month',
        'Community Access (Discord & FB)',
      ],
    },
    {
      slug: 'gre-core',
      name: 'GRE Core',
      tier: 'core',
      priceBD: '৳ 5,990',
      priceA: '$149',
      priceB: '$89',
      priceC: '$59',
      duration: '6 Months (183 days)',
      description: 'The complete self-paced section-adaptive curriculum.',
      perks: [
        '4 Full Section-Adaptive CBT Mocks',
        '3-Tier Progressive Hint Ladders',
        'Complete Distractor Trap Forensics',
        'Predict-First Verbal Deconstructor',
        '1,500+ Word FSRS Vocab Engine',
        '6 AI Evaluation Credits (AWA)',
        '30 AI Tutor Messages / day',
        'Official Certificate of Completion',
        '7-Day Money-Back Guarantee',
      ],
    },
    {
      slug: 'gre-plus',
      name: 'GRE Plus',
      tier: 'plus',
      popular: true,
      badge: 'Most Popular',
      priceBD: '৳ 8,490',
      priceA: '$199',
      priceB: '$119',
      priceC: '$79',
      duration: '6 Months (183 days)',
      description: 'Mastery with AI Tutor, Human Reviews, and Target Promise.',
      perks: [
        'Everything in GRE Core',
        '10 Full Section-Adaptive CBT Mocks',
        '2 Human AWA Reviews by Senior Graders',
        'Weekly Live Strategy Q&A with Lead Instructor',
        '150 AI Tutor Messages / day (Grounded)',
        '20 AI Evaluation Credits',
        'Adaptive Rescheduling Study Plan',
        'Target Promise (+5 Point Improvement)',
        '7-Day Money-Back Guarantee',
      ],
    },
    {
      slug: 'gre-crash',
      name: 'GRE Live Crash',
      tier: 'crash',
      priceBD: '৳ 9,990',
      priceA: '$229',
      priceB: '$129',
      priceC: '$89',
      duration: '12 Months Access',
      description: '4-week high-velocity live intensive for immediate test dates.',
      hasInstallments: true,
      perks: [
        '12 Intensive Live Zoom Classes (4 weeks)',
        'Everything in GRE Core self-paced path',
        '10 Full Section-Adaptive Mocks',
        '2 Human AWA Essay Reviews',
        'bKash 2-Part Installment Available',
        'Refundable before Class 2',
      ],
    },
    {
      slug: 'gre-live',
      name: 'GRE Live Cohort',
      tier: 'live',
      priceBD: '৳ 12,990',
      priceA: '$299',
      priceB: '$179',
      priceC: '$119',
      duration: '12 Months Access',
      description: '8-week live cohort with expert instructors and peer problem clinics.',
      hasInstallments: true,
      perks: [
        '24 Interactive Live Masterclasses (8 weeks)',
        'Full Plus Library & Adaptive Engine Access',
        '4 Human AWA Essay Reviews with Rubric',
        '10 Section-Adaptive Full Mocks',
        'Small Group Problem Clinics (cap 40)',
        'bKash 2 or 3-Part Installment Available',
        'Full Refund before Class 3',
      ],
    },
    {
      slug: 'gre-mentor',
      name: 'GRE 1:1 Mentor',
      tier: 'mentor',
      priceBD: '৳ 19,990',
      priceA: '$399',
      priceB: '$249',
      priceC: '$169',
      duration: '12 Months Access',
      description: 'Private 1:1 mentorship and custom graduate school guidance.',
      hasInstallments: true,
      perks: [
        'Everything in GRE Live Cohort',
        '3 Private 45-Min 1:1 Mentoring Sessions',
        '6 Human AWA Reviews by 335+ Scorers',
        'Custom SOP / Grad School Alignment Review',
        'bKash 3-Part Installment Schedule',
        'Progress Promise Guarantee',
      ],
    },
  ],
  ielts_academic: [
    {
      slug: 'ielts-academic-free',
      name: 'Free Diagnostic',
      tier: 'free',
      priceBD: '৳ 0',
      priceA: '$0',
      priceB: '$0',
      priceC: '$0',
      duration: 'Lifetime',
      description: 'Test your initial IELTS band level across skills.',
      perks: [
        '1 CD-IELTS Sectional Diagnostic Mock',
        'Instant Band Score Estimation (1.0-9.0)',
        '2 AI Writing & Speaking Credits at sign-up',
        '1 AI Evaluation Credit / month',
        'Community Discord & Facebook Group',
      ],
    },
    {
      slug: 'ielts-academic-core',
      name: 'IELTS Academic Core',
      tier: 'core',
      priceBD: '৳ 3,990',
      priceA: '$89',
      priceB: '$49',
      priceC: '$34',
      duration: '6 Months (183 days)',
      description: 'Complete CD-IELTS preparation engine for self-study.',
      perks: [
        '4 Full Computer-Delivered Mocks',
        'Authentic Single-Play Listening Stream',
        'Split-Pane Reading with Highlighter',
        '10 AI Writing & Speaking Evaluation Credits',
        '30 AI Tutor Messages / day',
        'Static 12-Week Study Plan',
        'Official Course Certificate',
        '7-Day Money-Back Guarantee',
      ],
    },
    {
      slug: 'ielts-academic-plus',
      name: 'IELTS Academic Plus',
      tier: 'plus',
      popular: true,
      badge: 'Best Value',
      priceBD: '৳ 6,490',
      priceA: '$149',
      priceB: '$89',
      priceC: '$59',
      duration: '6 Months (183 days)',
      description: 'Mastery with 2 Human Essay Reviews and Weekly Live Q&A.',
      perks: [
        'Everything in IELTS Core',
        '10 Full CD-IELTS Mocks (Listening/Reading/Writing/Speaking)',
        '2 Human Essay Reviews with Cambridge Rubric Breakdown',
        'Weekly Live Strategy Q&A with Lead IELTS 8.5 Instructor',
        '40 AI Writing & Speaking Credits',
        '150 AI Tutor Messages / day',
        'Adaptive Rescheduling Study Plan',
        'Target Promise (Band 7.0+ Guarantee)',
        '7-Day Money-Back Guarantee',
      ],
    },
    {
      slug: 'ielts-academic-crash',
      name: 'IELTS Live Crash',
      tier: 'crash',
      priceBD: '৳ 9,990',
      priceA: '$229',
      priceB: '$129',
      priceC: '$89',
      duration: '12 Months Access',
      description: '4-week intensive live batch for upcoming test bookings.',
      hasInstallments: true,
      perks: [
        '16 Live Interactive Classes (4 weeks)',
        '3 Speaking Club Sessions',
        '10 Full CD-IELTS Mocks',
        '2 Human Essay Reviews + 1 Speaking Mock',
        'bKash 2-Part Installment Available',
        'Full Refund before Class 2',
      ],
    },
    {
      slug: 'ielts-academic-live',
      name: 'IELTS Live Cohort',
      tier: 'live',
      priceBD: '৳ 13,990',
      priceA: '$299',
      priceB: '$179',
      priceC: '$119',
      duration: '12 Months Access',
      description: '12-week comprehensive live training with human speaking mocks.',
      hasInstallments: true,
      perks: [
        '36 Live Sessions (Regular, Weekend, or Evening)',
        'Full Plus Library & Adaptive Mocks Access',
        '4 Human Essay Reviews + 2 Human Speaking Mocks',
        '6 Speaking Club Sessions',
        'bKash 2 or 3-Part Installment (৳ 5,600 / ৳ 4,200 / ৳ 4,190)',
        'Full Refund before Class 3',
      ],
    },
    {
      slug: 'ielts-academic-mentor',
      name: 'IELTS 1:1 Mentor',
      tier: 'mentor',
      priceBD: '৳ 19,990',
      priceA: '$399',
      priceB: '$249',
      priceC: '$169',
      duration: '12 Months Access',
      description: 'Private 1:1 coaching with IELTS 8.5+ mentors.',
      hasInstallments: true,
      perks: [
        'Everything in IELTS Live Cohort',
        '3 Private 45-Min 1:1 Sessions with Lead Instructor',
        '6 Human Essay Reviews + 3 Human Speaking Mocks',
        'Custom University Admissions Guidance',
        'bKash 3-Part Installment (৳ 8,000 / ৳ 6,000 / ৳ 5,990)',
        'Progress Promise Guarantee',
      ],
    },
  ],
  ielts_gt: [
    {
      slug: 'ielts-gt-free',
      name: 'Free Diagnostic',
      tier: 'free',
      priceBD: '৳ 0',
      priceA: '$0',
      priceB: '$0',
      priceC: '$0',
      duration: 'Lifetime',
      description: 'General Training diagnostic for immigration candidates.',
      perks: [
        '1 GT Sectional Diagnostic Mock',
        'Instant Band Score Estimation',
        '2 AI Writing & Speaking Credits',
        'Community Access',
      ],
    },
    {
      slug: 'ielts-gt-core',
      name: 'IELTS GT Core',
      tier: 'core',
      priceBD: '৳ 3,490',
      priceA: '$79',
      priceB: '$49',
      priceC: '$29.99',
      duration: '6 Months (183 days)',
      description: 'Tailored for Express Entry & Canada/Australia PR seekers.',
      perks: [
        '4 Full Computer-Delivered GT Mocks',
        'GT Letter Writing & Workplace Reading modules',
        '10 AI Evaluation Credits',
        '30 AI Tutor Messages / day',
        'Official Course Certificate',
        '7-Day Money-Back Guarantee',
      ],
    },
    {
      slug: 'ielts-gt-plus',
      name: 'IELTS GT Plus',
      tier: 'plus',
      popular: true,
      badge: 'PR Target CLB 9',
      priceBD: '৳ 6,490',
      priceA: '$149',
      priceB: '$89',
      priceC: '$59',
      duration: '6 Months (183 days)',
      description: 'Mastery designed to hit the crucial CLB 9/10 PR points.',
      perks: [
        'Everything in IELTS GT Core',
        '10 Full CD-IELTS GT Mocks',
        '2 Human Letter/Essay Reviews with Rubric',
        'Weekly Live Immigration Strategy Q&A',
        '40 AI Credits',
        '150 AI Tutor Messages / day',
        'Target Promise (CLB 9 Guarantee)',
      ],
    },
    {
      slug: 'ielts-gt-live',
      name: 'IELTS GT Live Cohort',
      tier: 'live',
      priceBD: '৳ 12,990',
      priceA: '$299',
      priceB: '$179',
      priceC: '$119',
      duration: '12 Months Access',
      description: '12-week evening batch for working professionals.',
      hasInstallments: true,
      perks: [
        '36 Live Evening Classes (after 8:30 PM)',
        'Full GT Plus Library & Mocks',
        '4 Human Writing Reviews + 2 Human Speaking Mocks',
        'bKash 2 or 3-Part Installment Available',
        'Full Refund before Class 3',
      ],
    },
  ],
};

const ALL_ACCESS_PASSES = [
  {
    slug: 'pass-1m',
    name: '1-Month Pass',
    priceBD: '৳ 1,190',
    priceA: '$24.99',
    priceB: '$14.99',
    priceC: '$9.99',
    duration: '30 Days',
    description: 'Quick sprint across GRE and IELTS mock test series.',
    features: ['10 AI Credits / month', '2 Full Mocks / month', 'Daily AI cap: 4', 'All test banks'],
  },
  {
    slug: 'pass-3m',
    name: '3-Month Pass',
    badge: 'Popular',
    priceBD: '৳ 2,990',
    priceA: '$59',
    priceB: '$39',
    priceC: '$24.99',
    duration: '90 Days',
    description: 'Breadth across all GRE & IELTS sections without lock-in.',
    features: ['30 AI Credits total', '6 Full Mocks total', 'Daily AI cap: 4', '2 Concurrent devices'],
  },
  {
    slug: 'pass-6m',
    name: '6-Month Pass',
    priceBD: '৳ 4,490',
    priceA: '$99',
    priceB: '$59',
    priceC: '$39',
    duration: '183 Days',
    description: 'Complete cross-exam preparation window.',
    features: ['60 AI Credits total', '12 Full Mocks total', 'Daily AI cap: 4', '2 Concurrent devices'],
  },
  {
    slug: 'pass-12m',
    name: '12-Month Annual Pass',
    badge: 'Best Long-Term',
    priceBD: '৳ 6,990',
    priceA: '$149',
    priceB: '$89',
    priceC: '$59',
    duration: '365 Days',
    description: 'Full unconstrained platform breadth for serious study abroad prep.',
    features: ['120 AI Credits total', '24 Full Mocks total', 'Daily AI cap: 4', '2 Concurrent devices'],
  },
];

const ADD_ON_PACKS = [
  {
    slug: 'ai-credits-10',
    name: '10 AI Evaluation Credits',
    priceBD: '৳ 490',
    priceUSD: '$4.99',
    description: 'Refill 10 instant Writing or Speaking evaluations. Never expires.',
  },
  {
    slug: 'mock-pack-4',
    name: '4 Adaptive CBT Mocks Pack',
    priceBD: '৳ 990',
    priceUSD: '$9.99',
    description: '4 full section-adaptive GRE or CD-IELTS computer-delivered mocks.',
  },
  {
    slug: 'human-review-pack',
    name: 'Human Feedback Bundle',
    priceBD: '৳ 1,490',
    priceUSD: '$14.99',
    description: '2 detailed Essay Reviews with rubrics + 1 live 15-min Speaking Mock.',
  },
];

export default function PricingPage() {
  const tPricing = useTranslations('pricingPage');
  const [exam, setExam] = React.useState<ExamType>('gre');
  const [region, setRegion] = React.useState<Region>('BD');
  const [installmentModalTier, setInstallmentModalTier] = React.useState<string | null>(null);

  const currentTiers = PRICING_DATA[exam];

  const getDisplayPrice = (tier: TierData): string => {
    switch (region) {
      case 'A':
        return tier.priceA;
      case 'B':
        return tier.priceB;
      case 'C':
        return tier.priceC;
      case 'BD':
      default:
        return tier.priceBD;
    }
  };

  const getPassPrice = (pass: (typeof ALL_ACCESS_PASSES)[0]): string => {
    switch (region) {
      case 'A':
        return pass.priceA;
      case 'B':
        return pass.priceB;
      case 'C':
        return pass.priceC;
      case 'BD':
      default:
        return pass.priceBD;
    }
  };

  const activeInstallmentSchedule = installmentModalTier
    ? getInstallmentSchedule(
        installmentModalTier,
        installmentModalTier === 'mentor' ? 1999000 : installmentModalTier === 'live' ? 1399000 : 999000
      )
    : null;

  return (
    <div className="flex flex-col items-center pb-20">
      {/* High-Contrast Oxford Navy Hero Banner (BUG-12) */}
      <section className="relative w-full overflow-hidden border-b border-slate-800 bg-slate-950 px-4 py-14 text-white sm:py-20">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-35"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl space-y-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-950/80 px-3.5 py-1 text-xs font-semibold text-blue-200">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>{tPricing('badge')}</span>
          </div>

          <h1 className="mx-auto max-w-3xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {tPricing('title')}
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
            {tPricing('subtitle')}
          </p>

          {/* Crisp Metric Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-1">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-950/90 px-3 py-1 text-xs font-semibold text-indigo-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
              130–170 Rasch IRT Adaptive
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/90 px-3 py-1 text-xs font-semibold text-emerald-200">
              <Award className="h-3.5 w-3.5 text-emerald-400" />
              Band 0–9 Official Rubric AI
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3 py-1 text-xs font-semibold text-slate-200">
              <Receipt className="h-3.5 w-3.5 text-blue-400" />
              Mushak 6.3 VAT Included
            </span>
          </div>

          {/* Region Switcher */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-slate-300 font-medium">{tPricing('currencyRegion')}</span>
            {[
              { id: 'BD', label: 'BD (৳ BDT - 15% VAT incl.)' },
              { id: 'A', label: 'Region A ($ USD - High Income)' },
              { id: 'B', label: 'Region B ($ USD - Upper-Middle)' },
              { id: 'C', label: 'Region C ($ USD - South Asia / Emerging)' },
            ].map((reg) => (
              <button
                key={reg.id}
                type="button"
                onClick={() => setRegion(reg.id as Region)}
                className={`rounded-lg px-3 py-1.5 font-semibold transition-all ${
                  region === reg.id
                    ? 'bg-blue-600 text-white shadow-sm ring-1 ring-blue-400'
                    : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-800'
                }`}
              >
                {reg.label}
              </button>
            ))}
          </div>

          {/* Exam Selector Tabs */}
          <div className="pt-3 flex flex-wrap justify-center gap-2.5">
            {[
              { id: 'gre', label: tPricing('grePrep') },
              { id: 'ielts_academic', label: tPricing('ieltsAcademic') },
              { id: 'ielts_gt', label: tPricing('ieltsGt') },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setExam(tab.id as ExamType)}
                className={`rounded-full px-5 py-2 text-sm font-bold transition-all ${
                  exam === tab.id
                    ? 'bg-white text-slate-950 shadow-md'
                    : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Prominent Bangladeshi Payment & Trust Bar */}
          <div className="pt-4">
            <BangladeshPaymentTrustBar variant="dark" />
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl w-full space-y-12 px-4 pt-12 sm:px-6 lg:px-8">
        {/* Tier Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentTiers.map((tier) => {
            const displayPrice = getDisplayPrice(tier);
            const isFree = tier.tier === 'free';

            return (
              <Card
                key={tier.slug}
                className={`overflow-hidden bg-white transition-all flex flex-col justify-between relative ${
                  tier.popular
                    ? 'border-2 border-indigo-900 shadow-xl ring-2 ring-indigo-950/10'
                    : 'border-slate-200/90 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Elevated Dark-Navy / Indigo Top Header Ribbon for Most Popular (BUG-12) */}
                {tier.popular ? (
                  <div className="bg-indigo-950 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      {tier.badge ?? 'Most Popular'}
                    </span>
                    <span className="rounded-full bg-blue-600/40 px-2.5 py-0.5 text-[10px] font-semibold text-blue-100">
                      Target Promise Included
                    </span>
                  </div>
                ) : (
                  tier.badge && (
                    <div className="absolute top-3 right-4">
                      <Badge variant="default" className="text-[11px] font-bold">
                        {tier.badge}
                      </Badge>
                    </div>
                  )
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-950">{tier.name}</CardTitle>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {tier.duration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 min-h-[32px]">{tier.description}</p>
                  <div className="mt-4 pt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-slate-950">{displayPrice}</span>
                      {!isFree && region === 'BD' && (
                        <span className="text-[11px] font-medium text-slate-500">
                          (15% VAT &amp; Mushak 6.3 incl.)
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-0 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-800">
                    {tier.perks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            tier.popular
                              ? 'bg-indigo-950 text-white'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span className="font-medium leading-relaxed">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    {isFree ? (
                      <Link href="/exam/diagnostic" className="block w-full">
                        <Button variant="outline" className="w-full font-semibold">
                          Start Free Diagnostic
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/checkout?plan=${tier.slug}`} className="block w-full">
                        <Button
                          variant={tier.popular ? 'primary' : 'outline'}
                          className={`w-full gap-2 font-semibold ${
                            tier.popular ? 'bg-indigo-950 text-white hover:bg-indigo-900 shadow-md' : ''
                          }`}
                        >
                          Enroll Now <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}

                    {/* Highlighted bKash 2/3-Part 0% Split-Pay Banner underneath Most Popular & Installment tiers */}
                    {(tier.popular || tier.hasInstallments) && region === 'BD' && (
                      <button
                        type="button"
                        onClick={() => setInstallmentModalTier(tier.hasInstallments ? tier.tier : 'live')}
                        className="flex w-full items-center justify-between rounded-xl border border-pink-200 bg-pink-50/80 px-3 py-2 text-left text-[11px] font-semibold text-pink-950 transition-colors hover:bg-pink-100"
                      >
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-pink-600 shrink-0" />
                          <span>bKash 2/3-Part 0% Split-Pay Available</span>
                        </span>
                        <span className="text-pink-700 underline">Schedule &rarr;</span>
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* All-Access Passes Section */}
        <div className="border-t border-border pt-16 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="outline" className="border-accent text-accent text-xs">
              Breadth Option
            </Badge>
            <h2 className="text-3xl font-extrabold text-fg">All-Access Passes</h2>
            <p className="text-fg-muted text-sm leading-relaxed">
              Preparing for multiple tests or just need open practice across our GRE and IELTS mock
              libraries? Passes provide unconstrained practice without structured course lock-in.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ALL_ACCESS_PASSES.map((pass) => (
              <Card key={pass.slug} className="border-border bg-surface flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-fg">{pass.name}</CardTitle>
                    {pass.badge && (
                      <Badge variant="default" className="text-[10px]">
                        {pass.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-black text-accent mt-2">{getPassPrice(pass)}</div>
                  <div className="text-xs text-fg-subtle">{pass.duration}</div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-xs text-fg-muted">{pass.description}</p>
                  <ul className="space-y-1.5 text-xs text-fg border-t border-border/60 pt-3">
                    {pass.features.map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Link href={`/checkout?plan=${pass.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        Get Pass
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="border-t border-border pt-16 space-y-8">
          <div className="text-center space-y-2 max-w-2xl mx-auto">
            <Badge variant="outline" className="text-xs">
              Credit Refills
            </Badge>
            <h3 className="text-2xl font-bold text-fg">Add-on Packs</h3>
            <p className="text-fg-muted text-sm">
              Need extra AI evaluation credits or additional human essay reviews? Add packs to any tier.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ADD_ON_PACKS.map((pack) => (
              <Card key={pack.slug} className="border-border bg-surface flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-fg">{pack.name}</CardTitle>
                  <div className="text-xl font-extrabold text-accent mt-1">
                    {region === 'BD' ? pack.priceBD : pack.priceUSD}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-fg-muted leading-relaxed">{pack.description}</p>
                  <Link href={`/checkout?plan=${pack.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      Add to Account
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Honest Pricing Pillars Guarantee Box */}
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-fg flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" /> Our Honest Pricing Guarantee
            </h3>
            <p className="text-fg-muted text-xs max-w-xl mx-auto">
              We abide by the Bangladesh Digital Commerce Operation Guidelines 2021 and ethical
              pricing standards.
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 text-xs text-fg">
            <div className="space-y-1 rounded-lg border border-border/70 bg-canvas p-4">
              <div className="font-semibold text-fg flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" /> 7-Day Money-Back Guarantee
              </div>
              <p className="text-fg-muted leading-relaxed">
                If you have completed &lt; 20% of course content and took &le; 1 full mock, receive a
                100% full refund within 7 days. No questions asked.
              </p>
            </div>

            <div className="space-y-1 rounded-lg border border-border/70 bg-canvas p-4">
              <div className="font-semibold text-fg flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-accent" /> Zero bKash Financing Fees
              </div>
              <p className="text-fg-muted leading-relaxed">
                Pay in 2 or 3 parts on Live and Mentor tiers. The sum of the parts exactly equals the
                cash list price. No hidden interest or admin surcharge.
              </p>
            </div>

            <div className="space-y-1 rounded-lg border border-border/70 bg-canvas p-4">
              <div className="font-semibold text-fg flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-accent" /> Banned Fake Strikethroughs
              </div>
              <p className="text-fg-muted leading-relaxed">
                Discount strikethroughs are displayed only when the prior price was active for at least 28 consecutive days in the past 90 days.
              </p>
            </div>
          </div>
        </div>

        {/* bKash Installment Breakdown Modal */}
        {installmentModalTier && activeInstallmentSchedule && (
          <Dialog
            open={!!installmentModalTier}
            onOpenChange={(open) => !open && setInstallmentModalTier(null)}
          >
            <DialogContent className="max-w-lg bg-surface border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-fg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" /> bKash Installment Breakdown
                </DialogTitle>
                <DialogDescription className="text-xs text-fg-muted">
                  No financing or interest charge. The total equals the cash list price.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {activeInstallmentSchedule.threePart && (
                  <div className="rounded-xl border border-border bg-canvas p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-fg">
                      <span>3-Part Installment Schedule</span>
                      <span className="text-accent">৳ {(activeInstallmentSchedule.threePart.totalMinor / 100).toLocaleString()} Total</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {activeInstallmentSchedule.threePart.parts.map((part) => (
                        <div
                          key={part.partNumber}
                          className="flex justify-between items-center border-b border-border/50 py-1.5"
                        >
                          <span className="text-fg-muted">{part.label}</span>
                          <span className="font-mono font-semibold text-fg">{part.amountFormatted}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeInstallmentSchedule.twoPart && (
                  <div className="rounded-xl border border-border bg-canvas p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-fg">
                      <span>2-Part Installment Schedule</span>
                      <span className="text-accent">৳ {(activeInstallmentSchedule.twoPart.totalMinor / 100).toLocaleString()} Total</span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {activeInstallmentSchedule.twoPart.parts.map((part) => (
                        <div
                          key={part.partNumber}
                          className="flex justify-between items-center border-b border-border/50 py-1.5"
                        >
                          <span className="text-fg-muted">{part.label}</span>
                          <span className="font-mono font-semibold text-fg">{part.amountFormatted}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-fg-subtle leading-relaxed">
                  Note: A 3-day grace window applies after each installment due date before live class
                  access is paused. Content library access remains active.
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInstallmentModalTier(null)}
                  >
                    Close
                  </Button>
                  <Link href={`/checkout?plan=${activeInstallmentSchedule.threePart?.productSlug || 'live'}`}>
                    <Button size="sm">Proceed with bKash</Button>
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
