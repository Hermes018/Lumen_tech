/** @purpose Certified Human Evaluator & Blind Checker Desk (/evaluator) with Zero-PII queue, split-screen 4-criterion rubric workbench, and piece-rate SLA payout ledger */
'use client';

import React, { Suspense, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { brand } from '@lumen/config';
import { ShieldCheck } from 'lucide-react';
import {
  WorkspaceContainer,
  WorkspaceDataTable,
  WorkspaceHeader,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
  WorkspaceTabs,
  type WorkspaceTableRow,
} from '@/src/components/ui/WorkspacePrimitives';
import type {
  RuntimeCatalogSnapshot,
  RuntimeEvaluatorSubmission,
} from '@/src/lib/security/payment-guard';
import {
  downloadExcelReport,
  openPrintablePdfReport,
  type InstitutionalReportPayload,
} from '@/src/lib/export-reports';

type EvaluatorTabId = 'queue' | 'workbench' | 'payouts';

const INLINE_RUBRIC_TAGS = [
  '[Cohesion Gap]',
  '[Lexical Upgrade]',
  '[Task Achievement]',
  '[Grammar Agreement]',
] as const;

interface PayoutBatchRow {
  batchId: string;
  windowLabel: string;
  scriptsGraded: number;
  slaCompliance: string;
  irrAgreement: string;
  payoutBdt: string;
  payoutUsd: string;
  settlementStatus: string;
}

const PAYOUT_LEDGER_ROWS: PayoutBatchRow[] = [
  {
    batchId: 'BATCH-2026-W46',
    windowLabel: 'Nov 09 – Nov 15, 2026 (Current Cycle)',
    scriptsGraded: 38,
    slaCompliance: '97.4%',
    irrAgreement: '94.2%',
    payoutBdt: '৳15,200',
    payoutUsd: '$128.00',
    settlementStatus: 'Accruing · Verified',
  },
  {
    batchId: 'BATCH-2026-W45',
    windowLabel: 'Nov 02 – Nov 08, 2026',
    scriptsGraded: 44,
    slaCompliance: '98.1%',
    irrAgreement: '95.5%',
    payoutBdt: '৳17,600',
    payoutUsd: '$148.00',
    settlementStatus: 'Settled · bKash Merchant',
  },
  {
    batchId: 'BATCH-2026-W44',
    windowLabel: 'Oct 26 – Nov 01, 2026',
    scriptsGraded: 41,
    slaCompliance: '96.8%',
    irrAgreement: '93.8%',
    payoutBdt: '৳16,400',
    payoutUsd: '$138.00',
    settlementStatus: 'Settled · Bank EFT',
  },
];

function resolveEvaluatorTab(rawTab: string | null): EvaluatorTabId {
  if (rawTab === 'workbench' || rawTab === 'payouts') {
    return rawTab;
  }
  return 'queue';
}

function roundToHalfBand(raw: number): number {
  return Math.round(Math.max(4.0, Math.min(9.0, raw)) * 2) / 2;
}

function EvaluatorDeskContent() {
  const locale = useLocale();
  const isBn = locale === 'bn';
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<EvaluatorTabId>(() =>
    resolveEvaluatorTab(searchParams?.get('tab') ?? null),
  );
  const [submissions, setSubmissions] = useState<RuntimeEvaluatorSubmission[]>([]);
  const [selectedId, setSelectedId] = useState<string>('SUB-8492');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  const [taskResponse, setTaskResponse] = useState(7.0);
  const [coherenceCohesion, setCoherenceCohesion] = useState(7.0);
  const [lexicalResource, setLexicalResource] = useState(7.5);
  const [grammaticalRange, setGrammaticalRange] = useState(6.5);
  const [selectedTags, setSelectedTags] = useState<string[]>(['[Task Achievement]', '[Lexical Upgrade]']);
  const [feedback, setFeedback] = useState('');

  useEffect(() => {
    setMounted(true);
    const paramTab = resolveEvaluatorTab(searchParams?.get('tab') ?? null);
    setActiveTab(paramTab);
  }, [searchParams]);

  const hydrateSubmissionIntoWorkbench = (sub: RuntimeEvaluatorSubmission) => {
    setSelectedId(sub.id);
    setTaskResponse(sub.criteria.taskResponse);
    setCoherenceCohesion(sub.criteria.coherenceCohesion);
    setLexicalResource(sub.criteria.lexicalResource);
    setGrammaticalRange(sub.criteria.grammaticalRange);
    setSelectedTags(sub.rubricTags);
    setFeedback(sub.examinerFeedback);
  };

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/catalog', { cache: 'no-store' });
        if (!res.ok) throw new Error('Unable to load blind grading queue');
        const data = (await res.json()) as RuntimeCatalogSnapshot;
        if (!active) return;
        const list = data.evaluatorSubmissions ?? [];
        setSubmissions(list);
        const first = list.find((item) => item.id === 'SUB-8492') ?? list[0];
        if (first) {
          hydrateSubmissionIntoWorkbench(first);
        }
      } catch (err) {
        if (!active) return;
        setNotice({
          tone: 'err',
          text: err instanceof Error ? err.message : 'Unable to load queue',
        });
      } finally {
        if (active) setLoading(false);
      }
    };
    void load();
    return () => {
      active = false;
    };
  }, []);

  const handleSelectTab = (tabId: string) => {
    const next = resolveEvaluatorTab(tabId);
    setActiveTab(next);
    const prefix = isBn ? '/bn' : '';
    router.replace(`${prefix}/evaluator?tab=${next}`, { scroll: false });
  };

  const activeSubmission = useMemo(
    () => submissions.find((s) => s.id === selectedId) ?? submissions[0] ?? null,
    [submissions, selectedId],
  );

  const computedOverallBand = useMemo(
    () =>
      roundToHalfBand(
        (taskResponse + coherenceCohesion + lexicalResource + grammaticalRange) / 4,
      ),
    [taskResponse, coherenceCohesion, lexicalResource, grammaticalRange],
  );

  const handleOpenBlindSubmission = (sub: RuntimeEvaluatorSubmission) => {
    hydrateSubmissionIntoWorkbench(sub);
    handleSelectTab('workbench');
  };

  const handleToggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((item) => item !== tag) : [...prev, tag],
    );
    setFeedback((prev) => {
      if (prev.includes(tag)) return prev;
      return prev.trim() ? `${prev.trim()} ${tag}` : `${tag} `;
    });
  };

  const handleSubmitBlindGrade = async () => {
    if (!activeSubmission || saving) return;
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-lumen-role': 'evaluator',
        },
        body: JSON.stringify({
          action: 'EVALUATOR_SUBMIT_GRADE',
          submissionId: activeSubmission.id,
          overallBand: computedOverallBand,
          criteria: {
            taskResponse,
            coherenceCohesion,
            lexicalResource,
            grammaticalRange,
          },
          tags: selectedTags,
          feedback:
            feedback.trim() ||
            `Blind rubric evaluation completed at Band ${computedOverallBand.toFixed(1)}.`,
        }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        catalog?: RuntimeCatalogSnapshot;
        error?: string;
        message?: string;
      };
      if (!res.ok || !json.ok || !json.catalog) {
        throw new Error(json.message || json.error || 'Blind evaluation submission failed');
      }
      setSubmissions(json.catalog.evaluatorSubmissions ?? []);
      setNotice({
        tone: 'ok',
        text: isBn
          ? `${activeSubmission.id} এর ব্লাইন্ড মূল্যায়ন (${computedOverallBand.toFixed(1)}) সফলভাবে সংরক্ষিত ও অডিট-লগ করা হয়েছে।`
          : `Blind evaluation for ${activeSubmission.id} (Band ${computedOverallBand.toFixed(1)}) recorded and audit-logged.`,
      });
    } catch (err) {
      setNotice({
        tone: 'err',
        text: err instanceof Error ? err.message : 'Blind evaluation submission failed',
      });
    } finally {
      setSaving(false);
    }
  };

  const pendingCount = submissions.filter((s) => s.status === 'Pending Blind Grade').length;

  const queueRows: WorkspaceTableRow[] = submissions.map((sub) => ({
    id: sub.id,
    rowHeader: sub.id,
    rowSubheader: sub.status,
    cells: {
      examTask: sub.examTask,
      telemetry:
        sub.typingWpm > 0
          ? `${sub.wordCount} words · ${sub.typingWpm} WPM (${sub.typingAccuracyPct}%)`
          : `${sub.wordCount} words · Audio Transcript`,
      aiPreScore: sub.aiPreScoreLabel,
      slaCountdown: sub.slaCountdown,
      action: (
        <button
          type="button"
          onClick={() => handleOpenBlindSubmission(sub)}
          className="border border-[var(--brand-deep)] bg-[var(--surface-paper)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)] hover:bg-[var(--brand)] hover:border-[var(--brand)] hover:text-white transition-colors rounded-[4px]"
        >
          {isBn ? 'ব্লাইন্ড গ্রেড →' : 'Grade Blind →'}
        </button>
      ),
    },
  }));

  const payoutRows: WorkspaceTableRow[] = PAYOUT_LEDGER_ROWS.map((row) => ({
    id: row.batchId,
    rowHeader: row.batchId,
    rowSubheader: row.windowLabel,
    cells: {
      scripts: `${row.scriptsGraded} scripts`,
      sla: row.slaCompliance,
      irr: row.irrAgreement,
      payout: `${row.payoutBdt} / ${row.payoutUsd}`,
      status: row.settlementStatus,
    },
  }));

  const tabs = [
    {
      id: 'queue',
      label: isBn ? 'ব্লাইন্ড এসএলএ কিউ' : 'Blind SLA Grading Queue',
      count: submissions.length,
    },
    {
      id: 'workbench',
      label: isBn ? 'ব্লাইন্ড রুব্রিক ওয়ার্কবেঞ্চ' : 'Split-Screen Blind Rubric Workbench',
    },
    {
      id: 'payouts',
      label: isBn ? 'এসএলএ ও পেআউট লেজার' : 'SLA & Piece-Rate Payout Ledger',
    },
  ];

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'সার্টিফাইড ইভ্যালুয়েটর ও ব্লাইন্ড চেকার ডেস্ক' : 'Certified Human Evaluator & Blind Checker Desk'}
        subtitle={
          isBn
            ? 'জিরো-PII ব্লাইন্ড গ্রেডিং, ৪-ক্রাইটেরিয়া আইইএলটিএস/জিআরই রুব্রিক ক্যালিব্রেশন এবং এসএলএ পেআউট লেজার।'
            : 'Zero-PII blind script grading, 4-criterion rubric calibration, and verified piece-rate SLA payout ledger.'
        }
        metaText={
          isBn
            ? 'গোপনীয়তা গার্ড: শিক্ষার্থীর নাম, ইমেইল ও ফোন নম্বর সম্পূর্ণ অদৃশ্য রাখা হয়েছে'
            : 'Privacy Guard: Scholar names, emails, and phone numbers are stripped at API boundary'
        }
        primaryAction={{
          label: isBn ? 'ওয়ার্কবেঞ্চ খুলুন' : 'Open Blind Workbench',
          onClick: () => handleSelectTab('workbench'),
        }}
      />

      <WorkspaceStatRow
        stats={[
          {
            value: String(pendingCount || submissions.length),
            label: isBn ? 'অপেক্ষমান ব্লাইন্ড স্ক্রিপ্ট' : 'Active Blind Scripts',
            detail: isBn ? '৪-ঘণ্টা এসএলএ টার্গেট' : '4-hour SLA window',
          },
          {
            value: '97.4%',
            label: isBn ? 'এসএলএ কমপ্লায়েন্স' : 'SLA Compliance',
            detail: isBn ? 'চলতি সপ্তাহের ব্যাচ' : 'Current cycle batch',
          },
          {
            value: '94.2%',
            label: isBn ? 'ইন্টার-রেটার রিলায়েবিলিটি' : 'Inter-Rater Agreement',
            detail: isBn ? '±০.৫ ব্যান্ড সীমার মধ্যে' : 'Within ±0.5 Band tolerance',
          },
          {
            value: '৳15,200',
            label: isBn ? 'চলতি ব্যাচ পেআউট' : 'Accrued Batch Payout',
            detail: '$128.00 USD equivalent',
          },
        ]}
      />

      {notice ? (
        <div
          role="status"
          className={`mb-6 border px-4 py-3 text-sm rounded-[4px] flex items-center gap-2.5 ${
            notice.tone === 'ok'
              ? 'border-[var(--brand-deep)] bg-[var(--surface-paper)] text-[var(--brand-deep)]'
              : 'border-[var(--brand)] bg-[var(--bg-warm)] text-[var(--brand)]'
          }`}
        >
          <ShieldCheck className="h-4 w-4 shrink-0" aria-hidden={true} />
          <span>{notice.text}</span>
        </div>
      ) : null}

      <WorkspaceTabs tabs={tabs} activeTab={activeTab} onSelect={handleSelectTab} />

      {!mounted || loading ? (
        <div className="border border-[var(--hairline)] bg-[var(--surface-paper)] p-6 text-sm text-[var(--text-muted)] rounded-[4px]">
          {isBn ? 'ব্লাইন্ড গ্রেডিং কিউ লোড হচ্ছে...' : 'Loading Zero-PII blind grading queue...'}
        </div>
      ) : null}

      {mounted && !loading && activeTab === 'queue' ? (
        <section>
          <WorkspaceSectionTitle
            title={isBn ? 'বেনামী এসএলএ গ্রেডিং কিউ' : 'Anonymized Blind SLA Grading Queue'}
            subtitle={
              isBn
                ? 'প্রতিটি সাবমিশন শুধুমাত্র হ্যাশ আইডি, শব্দ সংখ্যা, টাইপিং টেলিমেট্রি এবং এআই প্রি-স্কোর দেখায়।'
                : 'Each submission exposes only its anonymous hash, word count, CD-IELTS typing telemetry, and AI pre-score.'
            }
          />
          <WorkspaceDataTable
            caption="Blind SLA Grading Queue"
            columns={[
              { key: 'hash', header: isBn ? 'বেনামী হ্যাশ' : 'Anonymous Hash' },
              { key: 'examTask', header: isBn ? 'পরীক্ষা ও টাস্ক' : 'Exam & Task' },
              { key: 'telemetry', header: isBn ? 'শব্দ ও টাইপিং WPM' : 'Word Count & Typing WPM' },
              { key: 'aiPreScore', header: isBn ? 'এআই প্রি-স্কোর' : 'AI Pre-Score', align: 'right' },
              { key: 'slaCountdown', header: isBn ? 'এসএলএ বাকি' : 'SLA Countdown', align: 'right' },
              { key: 'action', header: isBn ? 'অ্যাকশন' : 'Action', align: 'right' },
            ]}
            rows={queueRows}
          />
        </section>
      ) : null}

      {mounted && !loading && activeTab === 'workbench' && activeSubmission ? (
        <section className="space-y-6">
          <WorkspaceSectionTitle
            title={isBn ? 'স্প্লিট-স্ক্রিন ব্লাইন্ড রুব্রিক ওয়ার্কবেঞ্চ' : 'Split-Screen Blind Rubric Workbench'}
            subtitle={
              isBn
                ? 'ইনলাইন রুব্রিক ট্যাগ নির্বাচন করুন এবং ৪টি মানদণ্ডে ০.৫ ধাপে ব্যান্ড স্কোর নির্ধারণ করুন।'
                : 'Tag analytical observations inline and calibrate all four rubric criteria in 0.5 band increments.'
            }
          />

          <div className="flex flex-wrap gap-2">
            {submissions.map((sub) => {
              const isSelected = sub.id === activeSubmission.id;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => hydrateSubmissionIntoWorkbench(sub)}
                  className={
                    isSelected
                      ? 'border border-[var(--brand)] bg-[var(--brand)] text-white px-3 py-1.5 text-xs font-semibold rounded-[4px]'
                      : 'border border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-deep)] px-3 py-1.5 text-xs font-semibold hover:border-[var(--brand)] rounded-[4px]'
                  }
                >
                  {sub.id} · {sub.aiPreScoreLabel}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <div className="lg:col-span-7 border border-[var(--hairline)] bg-[var(--surface-paper)] p-6 space-y-5 rounded-[4px]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-4">
                <div>
                  <div className="font-mono text-sm font-bold text-[var(--brand-deep)]">
                    {activeSubmission.id}
                  </div>
                  <div className="text-sm font-semibold text-[var(--brand-deep)] mt-0.5">
                    {activeSubmission.examTask}
                  </div>
                </div>
                <div className="text-xs font-mono text-[var(--text-muted)] tabular-nums">
                  {activeSubmission.wordCount} words ·{' '}
                  {activeSubmission.typingWpm > 0
                    ? `${activeSubmission.typingWpm} WPM · ${activeSubmission.typingAccuracyPct}% accuracy`
                    : 'Audio Transcript · 100% verified'}
                </div>
              </div>

              <div className="whitespace-pre-line text-[15px] leading-relaxed text-[var(--text)]">
                {activeSubmission.textBody}
              </div>

              <div className="border-t border-[var(--hairline)] pt-4 space-y-2.5">
                <div className="text-xs font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'ইনলাইন রুব্রিক ট্যাগ যোগ করুন:' : 'Click to toggle inline rubric tags:'}
                </div>
                <div className="flex flex-wrap gap-2">
                  {INLINE_RUBRIC_TAGS.map((tag) => {
                    const active = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => handleToggleTag(tag)}
                        className={
                          active
                            ? 'border border-[var(--brand)] bg-[var(--bg-warm)] text-[var(--brand)] px-2.5 py-1 text-xs font-mono font-semibold rounded-[4px]'
                            : 'border border-[var(--hairline)] bg-[var(--bg)] text-[var(--text)] px-2.5 py-1 text-xs font-mono hover:border-[var(--brand-deep)] rounded-[4px]'
                        }
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 border border-[var(--hairline)] bg-[var(--surface-paper)] p-6 space-y-5 rounded-[4px]">
              <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-4">
                <div>
                  <div className="text-xs text-[var(--text-muted)]">
                    {isBn ? 'লাইভ কম্পিউটেড ওভারঅল ব্যান্ড' : 'Live Computed Overall Band'}
                  </div>
                  <div className="text-3xl font-extrabold text-[var(--brand-deep)] tabular-nums">
                    Band {computedOverallBand.toFixed(1)}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-[var(--text-muted)]">
                    {isBn ? 'এআই প্রি-স্কোর রেফারেন্স' : 'AI Pre-Score'}
                  </div>
                  <div className="font-mono text-sm font-bold text-[var(--brand)]">
                    {activeSubmission.aiPreScoreLabel}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    id: 'taskResponse',
                    label: isBn ? 'টাস্ক রেসপন্স (Task Response)' : 'Task Response',
                    value: taskResponse,
                    setValue: setTaskResponse,
                  },
                  {
                    id: 'coherenceCohesion',
                    label: isBn ? 'কোহেরেন্স ও কোহেশন' : 'Coherence & Cohesion',
                    value: coherenceCohesion,
                    setValue: setCoherenceCohesion,
                  },
                  {
                    id: 'lexicalResource',
                    label: isBn ? 'লেক্সিক্যাল রিসোর্স' : 'Lexical Resource',
                    value: lexicalResource,
                    setValue: setLexicalResource,
                  },
                  {
                    id: 'grammaticalRange',
                    label: isBn ? 'গ্রামাটিক্যাল রেঞ্জ ও নির্ভুলতা' : 'Grammatical Range & Accuracy',
                    value: grammaticalRange,
                    setValue: setGrammaticalRange,
                  },
                ].map((criterion) => (
                  <label key={criterion.id} className="block space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold text-[var(--brand-deep)]">
                      <span>{criterion.label}</span>
                      <span className="font-mono tabular-nums">{criterion.value.toFixed(1)}</span>
                    </div>
                    <input
                      type="range"
                      min={4.0}
                      max={9.0}
                      step={0.5}
                      value={criterion.value}
                      onChange={(e) => criterion.setValue(Number(e.target.value))}
                      className="w-full accent-[var(--brand)]"
                    />
                  </label>
                ))}
              </div>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'পরীক্ষকের লিখিত রুব্রিক মতামত' : 'Examiner Written Rubric Feedback'}
                </span>
                <textarea
                  rows={4}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder={
                    isBn
                      ? 'প্রমাণ-ভিত্তিক উন্নতির নির্দেশনা লিখুন...'
                      : 'Provide evidence-anchored band justification and next revision step...'
                  }
                  className="w-full border border-[var(--hairline)] bg-[var(--bg)] p-3 text-sm text-[var(--brand-deep)] focus:border-[var(--brand)] focus:outline-none rounded-[4px]"
                />
              </label>

              <button
                type="button"
                disabled={saving}
                onClick={handleSubmitBlindGrade}
                className="w-full bg-[var(--brand)] hover:bg-[var(--link)] text-white px-4 py-3 text-sm font-semibold transition-colors disabled:opacity-60 rounded-[4px]"
              >
                {saving
                  ? isBn
                    ? 'সংরক্ষণ করা হচ্ছে...'
                    : 'Submitting Blind Evaluation...'
                  : isBn
                    ? 'চূড়ান্ত ব্লাইন্ড মূল্যায়ন জমা দিন'
                    : 'Submit Final Blind Evaluation'}
              </button>
            </div>
          </div>
        </section>
      ) : null}

      {mounted && !loading && activeTab === 'payouts' ? (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[var(--hairline)] bg-[var(--surface-paper)] px-4 py-3">
            <span className="text-xs font-medium text-[var(--brand-deep)]">
              {isBn
                ? 'ইভ্যালুয়েটর পেআউট রেমিট্যান্স ও গ্রেডিং এক্সেল রপ্তানি'
                : 'Evaluator Contractor Remittance & Graded Submissions Export'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const payload: InstitutionalReportPayload = {
                    reportId: `LMN-EVAL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
                    documentTitle: 'Monthly Evaluator Payout Remittance & SLA Statement',
                    subtitle: 'Zero-PII Blind Grading Piece-Rate Settlements & Inter-Rater Reliability',
                    organizationName: brand.name,
                    generatedByRole: 'Certified Human Evaluator',
                    generatedAtIso: new Date().toISOString(),
                    verificationHash: 'HMAC-SHA256:EVALUATOR-PAYOUT-LEDGER',
                    sheets: [
                      {
                        sheetName: 'Payout Remittance',
                        title: 'Monthly Piece-Rate Payout Batches',
                        columns: [
                          { key: 'batch', header: 'Batch ID', align: 'left' },
                          { key: 'period', header: 'Period', align: 'left' },
                          { key: 'scripts', header: 'Scripts Graded', align: 'right' },
                          { key: 'sla', header: 'SLA Compliance', align: 'right' },
                          { key: 'irr', header: 'IRR Agreement', align: 'right' },
                          { key: 'payoutBdt', header: 'Payout (BDT)', align: 'right' },
                          { key: 'payoutUsd', header: 'Payout (USD)', align: 'right' },
                          { key: 'status', header: 'Status', align: 'left' },
                        ],
                        rows: PAYOUT_LEDGER_ROWS.map((r) => ({
                          batch: r.batchId,
                          period: r.windowLabel,
                          scripts: r.scriptsGraded,
                          sla: r.slaCompliance,
                          irr: r.irrAgreement,
                          payoutBdt: r.payoutBdt,
                          payoutUsd: r.payoutUsd,
                          status: r.settlementStatus,
                        })),
                      },
                      {
                        sheetName: 'Graded Submissions',
                        title: 'Blind-Graded Submission Log',
                        columns: [
                          { key: 'id', header: 'Submission Hash', align: 'left' },
                          { key: 'task', header: 'Task', align: 'left' },
                          { key: 'aiBand', header: 'AI Band', align: 'right' },
                          { key: 'humanBand', header: 'Evaluator Band', align: 'right' },
                          { key: 'status', header: 'Status', align: 'left' },
                        ],
                        rows: submissions.map((s) => ({
                          id: s.id,
                          task: s.examTask,
                          aiBand: s.aiPreScore,
                          humanBand: s.humanBand ?? 'Pending',
                          status: s.status,
                        })),
                      },
                    ],
                  };
                  openPrintablePdfReport(payload);
                }}
                className="inline-flex items-center gap-1.5 rounded-sm bg-[var(--brand)] px-3 py-1.5 text-xs font-medium text-[var(--on-brand)] hover:bg-[var(--brand-deep)]"
              >
                <span>
                  {isBn
                    ? 'মাসিক ইভ্যালুয়েটর পেআউট রেমিট্যান্স প্রিন্ট (PDF)'
                    : 'Print Monthly Evaluator Payout Remittance (PDF)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const payload: InstitutionalReportPayload = {
                    reportId: `LMN-EVAL-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
                    documentTitle: 'Evaluator Graded Submissions & Earnings Workbook',
                    subtitle: 'Piece-Rate SLA Batches & Blind Submission Scores',
                    organizationName: brand.name,
                    generatedByRole: 'Certified Human Evaluator',
                    generatedAtIso: new Date().toISOString(),
                    verificationHash: 'HMAC-SHA256:EVALUATOR-EARNINGS-XLS',
                    sheets: [
                      {
                        sheetName: 'Payout Remittance',
                        title: 'Monthly Piece-Rate Payout Batches',
                        columns: [
                          { key: 'batch', header: 'Batch ID', align: 'left' },
                          { key: 'period', header: 'Period', align: 'left' },
                          { key: 'scripts', header: 'Scripts Graded', align: 'right' },
                          { key: 'sla', header: 'SLA Compliance', align: 'right' },
                          { key: 'irr', header: 'IRR Agreement', align: 'right' },
                          { key: 'payoutBdt', header: 'Payout (BDT)', align: 'right' },
                          { key: 'payoutUsd', header: 'Payout (USD)', align: 'right' },
                          { key: 'status', header: 'Status', align: 'left' },
                        ],
                        rows: PAYOUT_LEDGER_ROWS.map((r) => ({
                          batch: r.batchId,
                          period: r.windowLabel,
                          scripts: r.scriptsGraded,
                          sla: r.slaCompliance,
                          irr: r.irrAgreement,
                          payoutBdt: r.payoutBdt,
                          payoutUsd: r.payoutUsd,
                          status: r.settlementStatus,
                        })),
                      },
                      {
                        sheetName: 'Graded Submissions',
                        title: 'Blind-Graded Submission Log',
                        columns: [
                          { key: 'id', header: 'Submission Hash', align: 'left' },
                          { key: 'task', header: 'Task', align: 'left' },
                          { key: 'aiBand', header: 'AI Band', align: 'right' },
                          { key: 'humanBand', header: 'Evaluator Band', align: 'right' },
                          { key: 'status', header: 'Status', align: 'left' },
                        ],
                        rows: submissions.map((s) => ({
                          id: s.id,
                          task: s.examTask,
                          aiBand: s.aiPreScore,
                          humanBand: s.humanBand ?? 'Pending',
                          status: s.status,
                        })),
                      },
                    ],
                  };
                  downloadExcelReport(
                    payload,
                    `lumen-evaluator-earnings-${new Date().toISOString().slice(0, 10)}`,
                  );
                }}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)]"
              >
                <span>
                  {isBn
                    ? 'গ্রেডেড সাবমিশন ও আয় রপ্তানি (.xlsx)'
                    : 'Export Graded Submissions & Earnings (.xlsx)'}
                </span>
              </button>
            </div>
          </div>

          <WorkspaceSectionTitle
            title={isBn ? 'ইভ্যালুয়েটর এসএলএ ও পিস-রেট পেআউট লেজার' : 'Evaluator SLA & Piece-Rate Payout Ledger'}
            subtitle={
              isBn
                ? 'যাচাইকৃত ব্যাচ গ্রেডিং, ৪-ঘণ্টা এসএলএ কমপ্লায়েন্স এবং বিডিটি/ইউএসডি ঠিকাদারি পেআউট।'
                : 'Verified script batches, 4-hour SLA compliance metrics, and BDT/USD contractor settlements.'
            }
          />
          <WorkspaceDataTable
            caption="Evaluator SLA and Piece-Rate Payout Ledger"
            columns={[
              { key: 'batch', header: isBn ? 'ব্যাচ আইডি' : 'Batch ID' },
              { key: 'scripts', header: isBn ? 'মূল্যায়িত স্ক্রিপ্ট' : 'Scripts Graded', align: 'right' },
              { key: 'sla', header: isBn ? 'এসএলএ হার' : 'SLA Compliance', align: 'right' },
              { key: 'irr', header: isBn ? 'আইআরআর মিল' : 'IRR Agreement', align: 'right' },
              { key: 'payout', header: isBn ? 'পেআউট (BDT / USD)' : 'Payout (BDT / USD)', align: 'right' },
              { key: 'status', header: isBn ? 'অবস্থা' : 'Settlement Status' },
            ]}
            rows={payoutRows}
          />
        </section>
      ) : null}
    </WorkspaceContainer>
  );
}

export default function EvaluatorPage() {
  return (
    <Suspense
      fallback={
        <WorkspaceContainer>
          <div className="border border-[var(--hairline)] bg-[var(--surface-paper)] p-6 text-sm text-[var(--text-muted)] rounded-[4px]">
            Loading Certified Evaluator Desk...
          </div>
        </WorkspaceContainer>
      }
    >
      <EvaluatorDeskContent />
    </Suspense>
  );
}
