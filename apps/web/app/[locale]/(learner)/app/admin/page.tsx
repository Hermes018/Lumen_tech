/** @purpose Institutional Admin & Governance Console (/app/admin) with 4 interactive tabs: Cohort Ledger, AI Grading Queue, Psychometrics, and Security Audit Log */
'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { brand } from '@lumen/config';
import {
  ShieldCheck,
  Receipt,
  FileCheck2,
  BarChart3,
  Lock,
  CheckCircle2,
  SlidersHorizontal,
} from 'lucide-react';

type AdminTab = 'ledger' | 'grading' | 'psychometrics' | 'security';

interface EnrollmentRow {
  id: string;
  scholar: string;
  cohort: string;
  plan: string;
  amountBdt: string;
  splitStatus: 'Installment 1/2 Paid' | 'Completed';
  mushakVerified: boolean;
}

interface GradingQueueItem {
  id: string;
  scholar: string;
  task: string;
  submittedAt: string;
  taskResponse: number;
  coherence: number;
  lexical: number;
  grammar: number;
  overallBand: number;
  status: 'Pending Review' | 'Approved' | 'Overridden';
}

interface PsychometricItem {
  id: string;
  domain: 'GRE Quant Comparison' | 'GRE Text Completion' | 'CD-IELTS Reading';
  itemCode: string;
  bParam: string;
  aParam: string;
  trapRate: string;
}

interface AuditLogEntry {
  id: string;
  timestamp: string;
  subsystem: string;
  check: string;
  status: 'Verified' | 'Enforced' | 'Active';
}

const INITIAL_ENROLLMENTS: EnrollmentRow[] = [
  {
    id: 'LMN-2026-8841',
    scholar: 'Ayman Rahman',
    cohort: 'GRE & IELTS Fall Cohort',
    plan: 'GRE Complete',
    amountBdt: '৳6,900',
    splitStatus: 'Installment 1/2 Paid',
    mushakVerified: false,
  },
  {
    id: 'LMN-2026-8839',
    scholar: 'Nusrat Jahan',
    cohort: 'IELTS Academic Band 8.0',
    plan: 'IELTS Academic Plus',
    amountBdt: '৳5,400',
    splitStatus: 'Completed',
    mushakVerified: true,
  },
  {
    id: 'LMN-2026-8834',
    scholar: 'Tahmid Hasan',
    cohort: 'GRE Quant Intensive',
    plan: 'GRE Plus Live',
    amountBdt: '৳8,500',
    splitStatus: 'Installment 1/2 Paid',
    mushakVerified: false,
  },
  {
    id: 'LMN-2026-8827',
    scholar: 'Farhana Karim',
    cohort: 'IELTS Academic Core',
    plan: 'IELTS Academic Core',
    amountBdt: '৳3,900',
    splitStatus: 'Completed',
    mushakVerified: true,
  },
];

const INITIAL_GRADING_QUEUE: GradingQueueItem[] = [
  {
    id: 'SUB-4091',
    scholar: 'Nusrat Jahan',
    task: 'IELTS Writing Task 2 — Urban Transit Policy',
    submittedAt: '12 mins ago',
    taskResponse: 7.5,
    coherence: 7.5,
    lexical: 8.0,
    grammar: 7.0,
    overallBand: 7.5,
    status: 'Pending Review',
  },
  {
    id: 'SUB-4088',
    scholar: 'Ayman Rahman',
    task: 'GRE AWA Issue — Automation & Academic Research',
    submittedAt: '28 mins ago',
    taskResponse: 5.0,
    coherence: 5.5,
    lexical: 5.0,
    grammar: 5.0,
    overallBand: 5.0,
    status: 'Pending Review',
  },
  {
    id: 'SUB-4082',
    scholar: 'Farhana Karim',
    task: 'IELTS Speaking Part 2/3 — Environmental Design',
    submittedAt: '1 hr ago',
    taskResponse: 7.0,
    coherence: 7.0,
    lexical: 7.5,
    grammar: 7.0,
    overallBand: 7.0,
    status: 'Approved',
  },
];

const PSYCHOMETRIC_ITEMS: PsychometricItem[] = [
  {
    id: 'PSY-01',
    domain: 'GRE Quant Comparison',
    itemCode: 'QC-ALG-114',
    bParam: '+1.42',
    aParam: '1.68',
    trapRate: '34.2%',
  },
  {
    id: 'PSY-02',
    domain: 'GRE Text Completion',
    itemCode: 'TC-3B-209',
    bParam: '+1.85',
    aParam: '1.54',
    trapRate: '41.8%',
  },
  {
    id: 'PSY-03',
    domain: 'CD-IELTS Reading',
    itemCode: 'RD-TFNG-087',
    bParam: '+0.94',
    aParam: '1.41',
    trapRate: '29.5%',
  },
  {
    id: 'PSY-04',
    domain: 'GRE Quant Comparison',
    itemCode: 'QC-GEO-062',
    bParam: '+1.18',
    aParam: '1.73',
    trapRate: '31.0%',
  },
];

const AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'AUD-901',
    timestamp: '2026-11-15 11:42:08 BST',
    subsystem: 'SSLCommerz / bKash IPN',
    check: 'HMAC-SHA256 webhook signature & val_id cross-check',
    status: 'Verified',
  },
  {
    id: 'AUD-900',
    timestamp: '2026-11-15 11:38:51 BST',
    subsystem: 'OTP & Auth Throttle',
    check: 'Upstash sliding-window rate limit (5 req / 15m per IP)',
    status: 'Active',
  },
  {
    id: 'AUD-899',
    timestamp: '2026-11-15 11:31:14 BST',
    subsystem: 'RBAC & 2FA Gate',
    check: 'assertCan(actor, "grader:override") + TOTP/Passkey factor',
    status: 'Enforced',
  },
  {
    id: 'AUD-898',
    timestamp: '2026-11-15 11:24:03 BST',
    subsystem: 'Mushak 6.3 VAT Ledger',
    check: 'Server-authoritative 15% BD VAT minor-unit calculation',
    status: 'Verified',
  },
];

export default function AdminGovernanceConsolePage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [activeTab, setActiveTab] = useState<AdminTab>('ledger');
  const [enrollments, setEnrollments] = useState<EnrollmentRow[]>(INITIAL_ENROLLMENTS);
  const [gradingQueue, setGradingQueue] = useState<GradingQueueItem[]>(INITIAL_GRADING_QUEUE);
  const [overrideBands, setOverrideBands] = useState<Record<string, string>>({});

  const handleVerifyMushak = (id: string) => {
    setEnrollments((prev) =>
      prev.map((row) => (row.id === id ? { ...row, mushakVerified: true } : row))
    );
  };

  const handleApproveRubric = (id: string) => {
    setGradingQueue((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Approved' } : item))
    );
  };

  const handleOverrideBand = (id: string) => {
    const raw = overrideBands[id];
    const parsed = raw ? Number(raw) : NaN;
    if (!Number.isFinite(parsed) || parsed < 0 || parsed > 9) return;
    setGradingQueue((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, overallBand: parsed, status: 'Overridden' } : item
      )
    );
  };

  const tabs: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'ledger',
      label: isBn ? 'কোহর্ট ও এনটাইটেলমেন্ট লেজার' : 'Cohort & Entitlement Ledger',
      icon: <Receipt className="h-4 w-4" />,
    },
    {
      id: 'grading',
      label: isBn ? 'এআই রাইটিং ও স্পিকিং কিউ' : 'AI Writing & Speaking Queue',
      icon: <FileCheck2 className="h-4 w-4" />,
    },
    {
      id: 'psychometrics',
      label: isBn ? 'আইটেম ব্যাংক ও সাইকোমেট্রিক্স' : 'Item Bank & Psychometrics',
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      id: 'security',
      label: isBn ? 'সিকিউরিটি ও অডিট লগ' : 'Security & Audit Log',
      icon: <Lock className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <section className="rounded-[4px] border border-[var(--hairline)] border-l-4 border-l-[var(--brand)] bg-[var(--surface-paper)] p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-[var(--brand)]">
              <ShieldCheck className="h-4 w-4" />
              <span>
                {isBn
                  ? `${brand.name} • অ্যাডমিন ও গভর্ন্যান্স কনসোল`
                  : `${brand.name} • ADMIN & GOVERNANCE CONSOLE`}
              </span>
            </div>
            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--brand-ink)]">
              {isBn
                ? 'প্রাতিষ্ঠানিক অপারেশন, মূসক ৬.৩ ও সাইকোমেট্রিক নিয়ন্ত্রণ'
                : 'Institutional Operations, Mushak 6.3 & Psychometric Governance'}
            </h1>
            <p className="mt-1 text-sm text-[var(--text)]">
              {isBn
                ? 'বিডিটি ও ইউএসডি এনরোলমেন্ট, বিকাশ স্প্লিট-পে, এআই ব্যান্ড ক্যালিব্রেশন এবং ওয়েবহুক নিরাপত্তা যাচাই করুন।'
                : 'Inspect live BDT & USD enrollments, bKash split-pay installments, AI rubric calibration, and webhook integrity.'}
            </p>
          </div>
          <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3.5 py-2 text-xs font-mono text-[var(--brand-ink)]">
            {isBn
              ? 'স্যান্ডবক্স: Ayman Rahman (admin) • ayman@lumen.academy'
              : 'Sandbox: Ayman Rahman (admin) • ayman@lumen.academy'}
          </div>
        </div>
      </section>

      {/* 4 Flat Segmented Tabs */}
      <div
        role="tablist"
        aria-label={isBn ? 'অ্যাডমিন গভর্ন্যান্স ট্যাব' : 'Admin governance tabs'}
        className="flex flex-wrap gap-2 border-b border-[var(--hairline)] pb-3"
      >
        {tabs.map((tab) => {
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 rounded-[4px] border px-3.5 py-2 text-xs font-bold transition-colors cursor-pointer ${
                active
                  ? 'border-[var(--brand)] bg-[var(--brand-deep)] text-white'
                  : 'border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-ink)] hover:border-[var(--brand)] hover:bg-[var(--bg-warm)]'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Cohort & Entitlement Ledger */}
      {activeTab === 'ledger' && (
        <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline)] pb-3">
            <h2 className="text-base font-bold text-[var(--brand-ink)]">
              {isBn ? 'সক্রিয় বিডিটি এনরোলমেন্ট ও মূসক ৬.৩ লেজার' : 'Active BDT Enrollments & Mushak 6.3 Ledger'}
            </h2>
            <span className="font-mono text-xs text-[var(--text)]">
              {enrollments.length} {isBn ? 'টি রেকর্ড' : 'records'}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--hairline)] text-[var(--text)]">
                  <th className="py-2.5 pr-4 font-semibold">{isBn ? 'অর্ডার আইডি' : 'Order ID'}</th>
                  <th className="py-2.5 pr-4 font-semibold">{isBn ? 'শিক্ষার্থী ও কোহর্ট' : 'Scholar & Cohort'}</th>
                  <th className="py-2.5 pr-4 font-semibold">{isBn ? 'প্ল্যান' : 'Plan'}</th>
                  <th className="py-2.5 pr-4 font-semibold">{isBn ? 'মূল্য' : 'Amount'}</th>
                  <th className="py-2.5 pr-4 font-semibold">{isBn ? 'কিস্তি অবস্থা' : 'Split-Pay Status'}</th>
                  <th className="py-2.5 font-semibold">{isBn ? 'মূসক ৬.৩ যাচাই' : 'Mushak 6.3'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hairline)]">
                {enrollments.map((row) => (
                  <tr key={row.id}>
                    <td className="py-3 pr-4 font-mono font-bold text-[var(--brand-ink)]">{row.id}</td>
                    <td className="py-3 pr-4">
                      <div className="font-bold text-[var(--brand-ink)]">{row.scholar}</div>
                      <div className="text-[11px] text-[var(--text)]">{row.cohort}</div>
                    </td>
                    <td className="py-3 pr-4 text-[var(--brand-ink)]">{row.plan}</td>
                    <td className="py-3 pr-4 font-mono font-bold text-[var(--brand-ink)]">{row.amountBdt}</td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-block rounded-[4px] border px-2 py-0.5 font-mono text-[11px] font-semibold ${
                          row.splitStatus === 'Completed'
                            ? 'border-emerald-700 bg-emerald-50 text-emerald-900'
                            : 'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand)]'
                        }`}
                      >
                        {row.splitStatus}
                      </span>
                    </td>
                    <td className="py-3">
                      {row.mushakVerified ? (
                        <span className="inline-flex items-center gap-1 font-semibold text-emerald-800">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          {isBn ? 'যাচাইকৃত' : 'Verified'}
                        </span>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleVerifyMushak(row.id)}
                          className="rounded-[4px] border border-[var(--brand-ink)] bg-[var(--bg)] px-2.5 py-1 text-[11px] font-bold text-[var(--brand-ink)] hover:border-[var(--brand)] hover:text-[var(--brand)] cursor-pointer"
                        >
                          {isBn ? 'মূসক ৬.৩ যাচাই করুন' : 'Verify Mushak 6.3'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 2: AI Writing & Speaking Grading Queue */}
      {activeTab === 'grading' && (
        <section className="space-y-4">
          {gradingQueue.map((item) => (
            <article
              key={item.id}
              className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 space-y-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3 border-b border-[var(--hairline)] pb-3">
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-[var(--brand)] font-bold">
                    <span>{item.id}</span>
                    <span>•</span>
                    <span>{item.submittedAt}</span>
                  </div>
                  <h3 className="mt-1 text-sm font-bold text-[var(--brand-ink)]">
                    {item.scholar} — {item.task}
                  </h3>
                </div>
                <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-1 font-mono text-xs font-bold text-[var(--brand-ink)]">
                  {isBn ? 'ব্যান্ড:' : 'Band:'} {item.overallBand.toFixed(1)} ({item.status})
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3">
                  <div className="text-[var(--text)]">{isBn ? 'টাস্ক রেসপন্স' : 'Task Response'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-[var(--brand-ink)]">
                    {item.taskResponse.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3">
                  <div className="text-[var(--text)]">{isBn ? 'কোহেরেন্স' : 'Coherence'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-[var(--brand-ink)]">
                    {item.coherence.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3">
                  <div className="text-[var(--text)]">{isBn ? 'লেক্সিক্যাল রিসোর্স' : 'Lexical Resource'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-[var(--brand-ink)]">
                    {item.lexical.toFixed(1)}
                  </div>
                </div>
                <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3">
                  <div className="text-[var(--text)]">{isBn ? 'গ্রামার' : 'Grammar'}</div>
                  <div className="mt-1 font-mono text-sm font-bold text-[var(--brand-ink)]">
                    {item.grammar.toFixed(1)}
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => handleApproveRubric(item.id)}
                  className="rounded-[4px] bg-[var(--brand)] px-3.5 py-2 text-xs font-bold text-white hover:bg-[var(--link)] cursor-pointer"
                >
                  {isBn ? 'রুব্রিক স্কোর অনুমোদন করুন' : 'Approve Rubric Score'}
                </button>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="9"
                    placeholder={isBn ? 'নতুন ব্যান্ড' : 'Override (0-9)'}
                    value={overrideBands[item.id] ?? ''}
                    onChange={(e) =>
                      setOverrideBands((prev) => ({ ...prev, [item.id]: e.target.value }))
                    }
                    className="w-28 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-1.5 text-xs font-mono text-[var(--brand-ink)]"
                  />
                  <button
                    type="button"
                    onClick={() => handleOverrideBand(item.id)}
                    className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--brand-ink)] bg-[var(--bg)] px-3 py-1.5 text-xs font-bold text-[var(--brand-ink)] hover:border-[var(--brand)] hover:text-[var(--brand)] cursor-pointer"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>{isBn ? 'ব্যান্ড ওভাররাইড' : 'Override Band'}</span>
                  </button>
                </div>
              </div>
            </article>
          ))}
        </section>
      )}

      {/* Tab 3: Item Bank & Psychometrics */}
      {activeTab === 'psychometrics' && (
        <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
          <div className="border-b border-[var(--hairline)] pb-3">
            <h2 className="text-base font-bold text-[var(--brand-ink)]">
              {isBn
                ? '২পিএল আইআরটি ক্যালিব্রেশন ও ডিস্ট্র্যাক্টর-ট্র্যাপ হার'
                : '2PL IRT Calibration & Distractor-Trap Telemetry'}
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[var(--hairline)] text-[var(--text)]">
                  <th className="py-2.5 pr-4 font-semibold">{isBn ? 'আইটেম কোড' : 'Item Code'}</th>
                  <th className="py-2.5 pr-4 font-semibold">{isBn ? 'ডোমেইন' : 'Domain'}</th>
                  <th className="py-2.5 pr-4 font-semibold">{isBn ? 'কঠিনতা (b)' : 'Difficulty (b)'}</th>
                  <th className="py-2.5 pr-4 font-semibold">{isBn ? 'বৈষম্য সূচক (a)' : 'Discrimination (a)'}</th>
                  <th className="py-2.5 font-semibold">{isBn ? 'ট্র্যাপ ট্রিগার হার' : 'Distractor-Trap Rate'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--hairline)]">
                {PSYCHOMETRIC_ITEMS.map((item) => (
                  <tr key={item.id}>
                    <td className="py-3 pr-4 font-mono font-bold text-[var(--brand-ink)]">{item.itemCode}</td>
                    <td className="py-3 pr-4 text-[var(--brand-ink)]">{item.domain}</td>
                    <td className="py-3 pr-4 font-mono text-[var(--brand)] font-bold">{item.bParam}</td>
                    <td className="py-3 pr-4 font-mono text-[var(--brand-ink)]">{item.aParam}</td>
                    <td className="py-3 font-mono text-[var(--brand-ink)]">{item.trapRate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Tab 4: Security & Audit Log */}
      {activeTab === 'security' && (
        <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6 space-y-4">
          <div className="border-b border-[var(--hairline)] pb-3">
            <h2 className="text-base font-bold text-[var(--brand-ink)]">
              {isBn
                ? 'ওয়েবহুক স্বাক্ষর, রেট-লিমিট ও আরবিএসি অডিট লগ'
                : 'Webhook Signature, Rate-Limit & RBAC Audit Log'}
            </h2>
          </div>

          <div className="divide-y divide-[var(--hairline)]">
            {AUDIT_LOGS.map((entry) => (
              <div key={entry.id} className="py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <div className="font-mono text-[11px] text-[var(--text)]">
                    {entry.id} • {entry.timestamp}
                  </div>
                  <div className="mt-0.5 font-bold text-[var(--brand-ink)]">{entry.subsystem}</div>
                  <div className="text-[var(--text)]">{entry.check}</div>
                </div>
                <span className="rounded-[4px] border border-emerald-700 bg-emerald-50 px-2.5 py-1 font-mono text-[11px] font-bold text-emerald-900">
                  {entry.status}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
