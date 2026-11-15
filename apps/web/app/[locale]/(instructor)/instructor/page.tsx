/** @purpose Faculty & Cohort Instructor Studio (/instructor) with cohort syllabus editor, trap telemetry, math-formatted 3-tier item authoring, and Socratic doubt composer */
'use client';

import React, { Suspense, useEffect, useState } from 'react';
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
import { formatMathText } from '@/src/lib/format-math';
import type {
  RuntimeCatalogSnapshot,
  RuntimeInstructorCohort,
  RuntimeInstructorDoubt,
  RuntimeInstructorItem,
} from '@/src/lib/security/payment-guard';
import {
  downloadExcelReport,
  openPrintablePdfReport,
  type InstitutionalReportPayload,
} from '@/src/lib/export-reports';

type InstructorTabId = 'cohorts' | 'telemetry' | 'authoring' | 'doubts';

interface CohortWeaknessRow {
  id: string;
  cohortId: string;
  cohortName: string;
  trapTopic: string;
  accuracyPct: string;
  medianTime: string;
  drillCode: string;
}

const COHORT_WEAKNESS_ROWS: CohortWeaknessRow[] = [
  {
    id: 'WEAK-01',
    cohortId: 'COH-GRE-V09',
    cohortName: 'GRE Verbal & AWA Weekend Seminar',
    trapTopic: '3-Blank Text Completion Contrast Traps · 54%',
    accuracyPct: '54%',
    medianTime: '112s / item',
    drillCode: 'DRILL-TC-3B-CONTRAST',
  },
  {
    id: 'WEAK-02',
    cohortId: 'COH-GRE-14',
    cohortName: 'GRE Quant Evening Batch 14',
    trapTopic: 'Quant Comparison Negative Exponents · 61%',
    accuracyPct: '61%',
    medianTime: '98s / item',
    drillCode: 'DRILL-QC-NEG-EXP',
  },
  {
    id: 'WEAK-03',
    cohortId: 'COH-IELTS-75',
    cohortName: 'CD-IELTS Band 7.5+ Intensive',
    trapTopic: 'IELTS Reading True/False/Not Given · 64%',
    accuracyPct: '64%',
    medianTime: '84s / item',
    drillCode: 'DRILL-IELTS-TFNG-BOUNDARY',
  },
];

const DEFAULT_STEM_TEMPLATE =
  'Given $x^2 - y^2 = 24$ and $x - y = 4$, compare Quantity A ($x + y$) and Quantity B ($6$).';

function resolveInstructorTab(rawTab: string | null): InstructorTabId {
  if (rawTab === 'telemetry' || rawTab === 'authoring' || rawTab === 'doubts') {
    return rawTab;
  }
  return 'cohorts';
}

function InstructorStudioContent() {
  const locale = useLocale();
  const isBn = locale === 'bn';
  const router = useRouter();
  const searchParams = useSearchParams();

  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<InstructorTabId>(() =>
    resolveInstructorTab(searchParams?.get('tab') ?? null),
  );
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: 'ok' | 'err'; text: string } | null>(null);

  const [cohorts, setCohorts] = useState<RuntimeInstructorCohort[]>([]);
  const [items, setItems] = useState<RuntimeInstructorItem[]>([]);
  const [doubts, setDoubts] = useState<RuntimeInstructorDoubt[]>([]);

  const [editingCohortId, setEditingCohortId] = useState<string | null>(null);
  const [cohortSyllabusDraft, setCohortSyllabusDraft] = useState('');
  const [cohortHomeworkDraft, setCohortHomeworkDraft] = useState('');

  const [editingDoubtId, setEditingDoubtId] = useState<string | null>(null);
  const [doubtReplyDraft, setDoubtReplyDraft] = useState('');

  const [draftItemId, setDraftItemId] = useState('ITEM-GRE-428');
  const [draftDomain, setDraftDomain] = useState('GRE Quant Comparison');
  const [draftStem, setDraftStem] = useState(DEFAULT_STEM_TEMPLATE);
  const [draftHint1, setDraftHint1] = useState(
    'Factor the difference of squares on the left-hand side.',
  );
  const [draftHint2, setDraftHint2] = useState(
    'Rewrite $(x - y)(x + y) = 24$ and substitute $x - y = 4$.',
  );
  const [draftHint3, setDraftHint3] = useState(
    'Dividing 24 by 4 gives $x + y = 6$, so Quantity A equals Quantity B.',
  );

  useEffect(() => {
    setMounted(true);
    setActiveTab(resolveInstructorTab(searchParams?.get('tab') ?? null));
  }, [searchParams]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/admin/catalog', { cache: 'no-store' });
        if (!res.ok) throw new Error('Unable to load instructor studio snapshot');
        const data = (await res.json()) as RuntimeCatalogSnapshot;
        if (!active) return;
        setCohorts(data.instructorCohorts ?? []);
        setItems(data.instructorItems ?? []);
        setDoubts(data.instructorDoubts ?? []);
      } catch (err) {
        if (!active) return;
        setNotice({
          tone: 'err',
          text: err instanceof Error ? err.message : 'Unable to load instructor studio',
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
    const next = resolveInstructorTab(tabId);
    setActiveTab(next);
    const prefix = isBn ? '/bn' : '';
    router.replace(`${prefix}/instructor?tab=${next}`, { scroll: false });
  };

  const postInstructorAction = async (
    payload: Record<string, unknown>,
    successMsg: string,
  ): Promise<boolean> => {
    setSaving(true);
    setNotice(null);
    try {
      const res = await fetch('/api/admin/catalog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-lumen-role': 'instructor',
        },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        catalog?: RuntimeCatalogSnapshot;
        error?: string;
        message?: string;
      };
      if (!res.ok || !json.ok || !json.catalog) {
        throw new Error(json.message || json.error || 'Instructor action failed');
      }
      setCohorts(json.catalog.instructorCohorts ?? []);
      setItems(json.catalog.instructorItems ?? []);
      setDoubts(json.catalog.instructorDoubts ?? []);
      setNotice({ tone: 'ok', text: successMsg });
      return true;
    } catch (err) {
      setNotice({
        tone: 'err',
        text: err instanceof Error ? err.message : 'Instructor action failed',
      });
      return false;
    } finally {
      setSaving(false);
    }
  };

  const handleOpenCohortEditor = (cohort: RuntimeInstructorCohort) => {
    if (editingCohortId === cohort.id) {
      setEditingCohortId(null);
      return;
    }
    setEditingCohortId(cohort.id);
    setCohortSyllabusDraft(cohort.syllabusNote);
    setCohortHomeworkDraft(cohort.homeworkNote);
  };

  const handleSaveCohortNotes = async (cohortId: string) => {
    const ok = await postInstructorAction(
      {
        action: 'INSTRUCTOR_UPDATE_COHORT',
        cohortId,
        syllabusNote: cohortSyllabusDraft,
        homeworkNote: cohortHomeworkDraft,
      },
      isBn
        ? `${cohortId} এর সিলেবাস ও হোমওয়ার্ক নোট সংরক্ষিত হয়েছে।`
        : `Saved syllabus & homework updates for ${cohortId}.`,
    );
    if (ok) {
      setEditingCohortId(null);
    }
  };

  const handleAssignCohortDrill = async (row: CohortWeaknessRow) => {
    await postInstructorAction(
      {
        action: 'INSTRUCTOR_UPDATE_COHORT',
        cohortId: row.cohortId,
        assignedDrill: row.drillCode,
      },
      isBn
        ? `${row.cohortName} এর জন্য ${row.drillCode} ড্রিল বরাদ্দ করা হয়েছে।`
        : `Assigned ${row.drillCode} to ${row.cohortName}.`,
    );
  };

  const handleSubmitAuthoredItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const ok = await postInstructorAction(
      {
        action: 'INSTRUCTOR_SUBMIT_ITEM',
        itemId: draftItemId,
        domain: draftDomain,
        stem: draftStem,
        hintTier1: draftHint1,
        hintTier2: draftHint2,
        hintTier3: draftHint3,
      },
      isBn
        ? `${draftItemId} অডিটর QA কিউ-তে জমা দেওয়া হয়েছে।`
        : `Submitted ${draftItemId} to Auditor Psychometric QA Queue.`,
    );
    if (ok) {
      setDraftItemId(`ITEM-GRE-${Math.floor(430 + Math.random() * 50)}`);
    }
  };

  const handleOpenDoubtComposer = (doubt: RuntimeInstructorDoubt) => {
    if (editingDoubtId === doubt.id) {
      setEditingDoubtId(null);
      return;
    }
    setEditingDoubtId(doubt.id);
    setDoubtReplyDraft(doubt.facultyReply);
  };

  const handleResolveDoubt = async (doubtId: string) => {
    if (!doubtReplyDraft.trim()) return;
    const ok = await postInstructorAction(
      {
        action: 'INSTRUCTOR_RESOLVE_DOUBT',
        doubtId,
        facultyReply: doubtReplyDraft,
      },
      isBn
        ? `সক্রেটিক ফ্যাকাল্টি উত্তর ${doubtId} এর জন্য প্রকাশিত হয়েছে।`
        : `Published Socratic faculty response for ${doubtId}.`,
    );
    if (ok) {
      setEditingDoubtId(null);
    }
  };

  const cohortRows: WorkspaceTableRow[] = cohorts.map((cohort) => ({
    id: cohort.id,
    rowHeader: cohort.name,
    rowSubheader: `${cohort.id} · ${cohort.schedule}`,
    cells: {
      enrolled: `${cohort.enrolledCount} scholars`,
      attendance: `${cohort.attendancePct}%`,
      syllabus: cohort.assignedDrill
        ? `${cohort.syllabusNote} [Drill: ${cohort.assignedDrill}]`
        : cohort.syllabusNote,
      action: (
        <button
          type="button"
          onClick={() => handleOpenCohortEditor(cohort)}
          className="border border-[var(--brand-deep)] bg-[var(--surface-paper)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)] hover:bg-[var(--brand)] hover:border-[var(--brand)] hover:text-white transition-colors rounded-[4px]"
        >
          {editingCohortId === cohort.id
            ? isBn
              ? 'বন্ধ করুন'
              : 'Close'
            : isBn
              ? 'সিলেবাস/হোমওয়ার্ক'
              : 'Edit Syllabus'}
        </button>
      ),
    },
    expandedContent:
      editingCohortId === cohort.id ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-[var(--brand-deep)]">
                {isBn ? 'সেশন সিলেবাস নোট' : 'Session Syllabus Note'}
              </span>
              <textarea
                rows={3}
                value={cohortSyllabusDraft}
                onChange={(e) => setCohortSyllabusDraft(e.target.value)}
                className="w-full border border-[var(--hairline)] bg-[var(--surface-paper)] p-3 text-sm text-[var(--brand-deep)] rounded-[4px]"
              />
            </label>
            <label className="block space-y-1.5">
              <span className="text-xs font-semibold text-[var(--brand-deep)]">
                {isBn ? 'হোমওয়ার্ক নির্দেশনা' : 'Cohort Homework Assignment'}
              </span>
              <textarea
                rows={3}
                value={cohortHomeworkDraft}
                onChange={(e) => setCohortHomeworkDraft(e.target.value)}
                className="w-full border border-[var(--hairline)] bg-[var(--surface-paper)] p-3 text-sm text-[var(--brand-deep)] rounded-[4px]"
              />
            </label>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleSaveCohortNotes(cohort.id)}
              className="bg-[var(--brand)] text-white px-4 py-2 text-xs font-semibold hover:bg-[var(--link)] transition-colors rounded-[4px]"
            >
              {isBn ? 'সিলেবাস সংরক্ষণ করুন' : 'Save Cohort Syllabus'}
            </button>
          </div>
        </div>
      ) : undefined,
  }));

  const weaknessRows: WorkspaceTableRow[] = COHORT_WEAKNESS_ROWS.map((row) => {
    const matchedCohort = cohorts.find((c) => c.id === row.cohortId);
    const assigned = matchedCohort?.assignedDrill === row.drillCode;
    return {
      id: row.id,
      rowHeader: row.trapTopic,
      rowSubheader: row.cohortName,
      cells: {
        accuracy: row.accuracyPct,
        medianTime: row.medianTime,
        drill: row.drillCode,
        action: (
          <button
            type="button"
            disabled={saving}
            onClick={() => handleAssignCohortDrill(row)}
            className={
              assigned
                ? 'border border-[var(--brand-deep)] bg-[var(--bg-warm)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)] rounded-[4px]'
                : 'bg-[var(--brand)] hover:bg-[var(--link)] px-3 py-1.5 text-xs font-semibold text-white transition-colors rounded-[4px]'
            }
          >
            {assigned
              ? isBn
                ? 'ড্রিল বরাদ্দকৃত'
                : 'Drill Assigned'
              : isBn
                ? 'Assign Cohort Drill'
                : 'Assign Cohort Drill'}
          </button>
        ),
      },
    };
  });

  const authoredItemRows: WorkspaceTableRow[] = items.map((item) => ({
    id: item.id,
    rowHeader: item.id,
    rowSubheader: item.domain,
    cells: {
      stem: formatMathText(item.stem),
      psychometrics: `p=${item.difficultyPValue.toFixed(2)} · r_pb=${item.discriminationRpb.toFixed(2)}`,
      status: item.qaStatus,
    },
  }));

  const doubtRows: WorkspaceTableRow[] = doubts.map((doubt) => ({
    id: doubt.id,
    rowHeader: doubt.itemCode,
    rowSubheader: `${doubt.cohortName} · ${doubt.status}`,
    cells: {
      question: formatMathText(doubt.questionExcerpt),
      scholarNote: formatMathText(doubt.scholarNote),
      action: (
        <button
          type="button"
          onClick={() => handleOpenDoubtComposer(doubt)}
          className="border border-[var(--brand-deep)] bg-[var(--surface-paper)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)] hover:bg-[var(--brand)] hover:border-[var(--brand)] hover:text-white transition-colors rounded-[4px]"
        >
          {editingDoubtId === doubt.id
            ? isBn
              ? 'বন্ধ করুন'
              : 'Close'
            : doubt.status === 'Resolved'
              ? isBn
                ? 'উত্তর সম্পাদনা'
                : 'Edit Reply'
              : isBn
                ? 'সক্রেটিক উত্তর লিখুন'
                : 'Compose Socratic Reply'}
        </button>
      ),
    },
    expandedContent:
      editingDoubtId === doubt.id ? (
        <div className="space-y-3">
          <div className="text-xs font-semibold text-[var(--brand-deep)]">
            {isBn
              ? 'সক্রেটিক ফ্যাকাল্টি নির্দেশনা (সরাসরি উত্তর না দিয়ে চিন্তাশীল সূত্র দিন):'
              : 'Socratic Faculty Response Composer (guide the scholar step-by-step):'}
          </div>
          <textarea
            rows={3}
            value={doubtReplyDraft}
            onChange={(e) => setDoubtReplyDraft(e.target.value)}
            placeholder={
              isBn
                ? 'প্রথম ধাপে কোন বীজগাণিতিক শর্ত যাচাই করতে হবে তা লিখুন...'
                : 'Ask what happens when x = -4 is tested against x^2 > 9...'
            }
            className="w-full border border-[var(--hairline)] bg-[var(--surface-paper)] p-3 text-sm text-[var(--brand-deep)] rounded-[4px]"
          />
          <div className="flex justify-end">
            <button
              type="button"
              disabled={saving}
              onClick={() => handleResolveDoubt(doubt.id)}
              className="bg-[var(--brand)] text-white px-4 py-2 text-xs font-semibold hover:bg-[var(--link)] transition-colors rounded-[4px]"
            >
              {isBn ? 'ফ্যাকাল্টি উত্তর প্রকাশ করুন' : 'Publish Socratic Reply'}
            </button>
          </div>
        </div>
      ) : undefined,
  }));

  const tabs = [
    {
      id: 'cohorts',
      label: isBn ? 'লাইভ কোহর্ট ও উপস্থিতি' : 'Live Cohort Schedule & Attendance',
      count: cohorts.length,
    },
    {
      id: 'telemetry',
      label: isBn ? 'কোহর্ট দুর্বলতা টেলিমেট্রি' : 'Aggregate Cohort Weakness',
      count: COHORT_WEAKNESS_ROWS.length,
    },
    {
      id: 'authoring',
      label: isBn ? 'প্রশ্ন ও ৩-স্তরের হিন্ট অথরিং' : 'Question Bank & 3-Tier Hints',
      count: items.length,
    },
    {
      id: 'doubts',
      label: isBn ? 'একাডেমিক ডাউট থ্রেড' : 'Scholar Doubt Escalations',
      count: doubts.length,
    },
  ];

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'ফ্যাকাল্টি ও কোহর্ট ইন্সট্রাক্টর স্টুডিও' : 'Faculty & Cohort Instructor Studio'}
        subtitle={
          isBn
            ? 'লাইভ কোহর্ট সিলেবাস, সমষ্টিগত ট্র্যাপ টেলিমেট্রি, ইউনিকোড গণিত প্রশ্ন অথরিং এবং সক্রেটিক ডাউট সমাধান।'
            : 'Cohort syllabus control, aggregate diagnostic trap telemetry, Unicode math item authoring, and Socratic doubt escalations.'
        }
        primaryAction={{
          label: isBn ? 'নতুন প্রশ্ন অথরিং' : 'Author New Item',
          onClick: () => handleSelectTab('authoring'),
        }}
      />

      <WorkspaceStatRow
        stats={[
          {
            value: String(cohorts.length || 3),
            label: isBn ? 'সক্রিয় কোহর্ট' : 'Active Live Cohorts',
            detail: isBn ? '৭১ জন নিবন্ধিত স্কলার' : '71 enrolled scholars',
          },
          {
            value: '91%',
            label: isBn ? 'গড় উপস্থিতি' : 'Mean Attendance Rate',
            detail: isBn ? 'গত ৪ সপ্তাহের সেশন' : 'Trailing 4-week sessions',
          },
          {
            value: String(items.length || 3),
            label: isBn ? 'অথর্ড আইটেম ব্যাংক' : 'Authored Bank Items',
            detail: isBn ? 'অডিটর QA-তে সংযুক্ত' : 'Synced with Auditor QA Gate',
          },
          {
            value: String(doubts.filter((d) => d.status === 'Open Escalation').length),
            label: isBn ? 'অপেক্ষমান ডাউট' : 'Open Doubt Escalations',
            detail: isBn ? 'বেনামী কোহর্ট থ্রেড' : 'Anonymized scholar threads',
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
          {isBn ? 'ফ্যাকাল্টি স্টুডিও লোড হচ্ছে...' : 'Loading Faculty Instructor Studio...'}
        </div>
      ) : null}

      {mounted && !loading && activeTab === 'cohorts' ? (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-3 border-y border-[var(--hairline)] bg-[var(--surface-paper)] px-4 py-3">
            <span className="text-xs font-medium text-[var(--brand-deep)]">
              {isBn
                ? 'কোহর্ট উপস্থিতি ও গ্রেডবুক রিপোর্ট রপ্তানি'
                : 'Cohort Diagnostic, Attendance & Gradebook Export'}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  const payload: InstitutionalReportPayload = {
                    reportId: `LMN-COHORT-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
                    documentTitle: 'Cohort Diagnostic, Syllabus & Attendance Report',
                    subtitle: 'Faculty Cohort Schedule, Attendance Rates & Active Drill Assignments',
                    organizationName: brand.name,
                    generatedByRole: 'Faculty Instructor Studio',
                    generatedAtIso: new Date().toISOString(),
                    verificationHash: 'HMAC-SHA256:FACULTY-COHORT-REPORT',
                    sheets: [
                      {
                        sheetName: 'Cohort Attendance',
                        title: 'Live Cohort Schedule & Attendance',
                        columns: [
                          { key: 'id', header: 'Cohort ID', align: 'left' },
                          { key: 'name', header: 'Cohort Name', align: 'left' },
                          { key: 'schedule', header: 'Schedule', align: 'left' },
                          { key: 'enrolled', header: 'Enrolled', align: 'right' },
                          { key: 'attendance', header: 'Attendance', align: 'right' },
                          { key: 'drill', header: 'Assigned Drill', align: 'left' },
                        ],
                        rows: cohorts.map((c) => ({
                          id: c.id,
                          name: c.name,
                          schedule: c.schedule,
                          enrolled: c.enrolledCount,
                          attendance: `${c.attendancePct}%`,
                          drill: c.assignedDrill ?? 'None',
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
                    ? 'কোহর্ট ডায়াগনস্টিক ও উপস্থিতি রিপোর্ট (PDF)'
                    : 'Print Cohort Diagnostic & Attendance Report (PDF)'}
                </span>
              </button>
              <button
                type="button"
                onClick={() => {
                  const payload: InstitutionalReportPayload = {
                    reportId: `LMN-GRADEBOOK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`,
                    documentTitle: 'Faculty Cohort Gradebook & Item Telemetry Workbook',
                    subtitle: 'Cohort Attendance, Assigned Drills & 3-Tier Item Authoring Bank',
                    organizationName: brand.name,
                    generatedByRole: 'Faculty Instructor Studio',
                    generatedAtIso: new Date().toISOString(),
                    verificationHash: 'HMAC-SHA256:FACULTY-GRADEBOOK-XLS',
                    sheets: [
                      {
                        sheetName: 'Cohort Gradebook',
                        title: 'Live Cohort Schedule & Attendance',
                        columns: [
                          { key: 'id', header: 'Cohort ID', align: 'left' },
                          { key: 'name', header: 'Cohort Name', align: 'left' },
                          { key: 'enrolled', header: 'Enrolled', align: 'right' },
                          { key: 'attendance', header: 'Attendance (%)', align: 'right' },
                          { key: 'syllabus', header: 'Syllabus Note', align: 'left' },
                          { key: 'drill', header: 'Assigned Drill', align: 'left' },
                        ],
                        rows: cohorts.map((c) => ({
                          id: c.id,
                          name: c.name,
                          enrolled: c.enrolledCount,
                          attendance: c.attendancePct,
                          syllabus: c.syllabusNote,
                          drill: c.assignedDrill ?? 'None',
                        })),
                      },
                      {
                        sheetName: 'Item Bank',
                        title: 'Authored Curriculum Items',
                        columns: [
                          { key: 'id', header: 'Item ID', align: 'left' },
                          { key: 'domain', header: 'Domain', align: 'left' },
                          { key: 'pValue', header: 'Difficulty p', align: 'right' },
                          { key: 'rpb', header: 'Discrimination rpb', align: 'right' },
                          { key: 'qaStatus', header: 'QA Status', align: 'left' },
                        ],
                        rows: items.map((item) => ({
                          id: item.id,
                          domain: item.domain,
                          pValue: item.difficultyPValue,
                          rpb: item.discriminationRpb,
                          qaStatus: item.qaStatus,
                        })),
                      },
                    ],
                  };
                  downloadExcelReport(
                    payload,
                    `lumen-cohort-gradebook-${new Date().toISOString().slice(0, 10)}`,
                  );
                }}
                className="inline-flex items-center gap-1.5 rounded-sm border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)]"
              >
                <span>
                  {isBn ? 'কোহর্ট গ্রেডবুক রপ্তানি (.xlsx)' : 'Export Cohort Gradebook (.xlsx)'}
                </span>
              </button>
            </div>
          </div>

          <WorkspaceSectionTitle
            title={isBn ? 'লাইভ কোহর্ট শিডিউল ও উপস্থিতি' : 'Live Cohort Schedule & Attendance Table'}
            subtitle={
              isBn
                ? 'সাপ্তাহিক সিলেবাস এবং হোমওয়ার্ক নির্দেশনা সম্পাদনা করতে সারি খুলুন।'
                : 'Expand any cohort row to edit weekly syllabus notes and homework assignments.'
            }
          />
          <WorkspaceDataTable
            caption="Live Cohort Schedule and Attendance"
            columns={[
              { key: 'cohort', header: isBn ? 'কোহর্ট ও সময়সূচি' : 'Cohort & Schedule' },
              { key: 'enrolled', header: isBn ? 'নিবন্ধিত' : 'Enrolled', align: 'right' },
              { key: 'attendance', header: isBn ? 'উপস্থিতি' : 'Attendance', align: 'right' },
              { key: 'syllabus', header: isBn ? 'বর্তমান সিলেবাস ও ড্রিল' : 'Active Syllabus & Drill' },
              { key: 'action', header: isBn ? 'সম্পাদনা' : 'Action', align: 'right' },
            ]}
            rows={cohortRows}
          />
        </section>
      ) : null}

      {mounted && !loading && activeTab === 'telemetry' ? (
        <section>
          <WorkspaceSectionTitle
            title={isBn ? 'সমষ্টিগত কোহর্ট ডায়াগনস্টিক দুর্বলতা' : 'Aggregate Cohort Diagnostic Weakness Table'}
            subtitle={
              isBn
                ? 'সর্বনিম্ন নির্ভুলতার ট্র্যাপ প্যাটার্নগুলোতে ১-ক্লিকে লক্ষ্যযুক্ত ড্রিল বরাদ্দ করুন।'
                : 'Assign targeted remediation drills directly to cohorts showing high diagnostic trap rates.'
            }
          />
          <WorkspaceDataTable
            caption="Aggregate Cohort Diagnostic Weakness"
            columns={[
              { key: 'trap', header: isBn ? 'ট্র্যাপ প্যাটার্ন ও নির্ভুলতা' : 'Trap Pattern & Cohort Accuracy' },
              { key: 'accuracy', header: isBn ? 'সঠিক হার' : 'Accuracy', align: 'right' },
              { key: 'medianTime', header: isBn ? 'গড় সময়' : 'Median Time', align: 'right' },
              { key: 'drill', header: isBn ? 'ড্রিল কোড' : 'Remediation Drill' },
              { key: 'action', header: isBn ? 'অ্যাকশন' : 'Action', align: 'right' },
            ]}
            rows={weaknessRows}
          />
        </section>
      ) : null}

      {mounted && !loading && activeTab === 'authoring' ? (
        <section className="space-y-8">
          <WorkspaceSectionTitle
            title={isBn ? 'প্রশ্ন ব্যাংক, ৩-স্তরের হিন্ট ও টাইপিং কর্পাস অথরিং' : 'Question Bank, 3-Tier Hints & Typing Corpus Authoring'}
            subtitle={
              isBn
                ? 'অডিটর QA গেটে পাঠানোর আগে লাইভ formatMathText() প্রিভিউ দিয়ে গাণিতিক চিহ্ন যাচাই করুন।'
                : 'Verify Unicode math formatting with live formatMathText() preview before submitting to the Auditor QA Queue.'
            }
          />

          <form
            onSubmit={handleSubmitAuthoredItem}
            className="border border-[var(--hairline)] bg-[var(--surface-paper)] p-6 space-y-5 rounded-[4px]"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'আইটেম আইডি' : 'Item ID'}
                </span>
                <input
                  type="text"
                  required
                  value={draftItemId}
                  onChange={(e) => setDraftItemId(e.target.value)}
                  className="w-full border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm font-mono text-[var(--brand-deep)] rounded-[4px]"
                />
              </label>

              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'ডোমেইন / কর্পাস' : 'Domain / Corpus'}
                </span>
                <select
                  value={draftDomain}
                  onChange={(e) => setDraftDomain(e.target.value)}
                  className="w-full border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)] rounded-[4px]"
                >
                  <option value="GRE Quant Comparison">GRE Quant Comparison</option>
                  <option value="GRE Text Completion">GRE Text Completion</option>
                  <option value="CD-IELTS Reading">CD-IELTS Reading</option>
                  <option value="IELTS Writing Task 2">IELTS Writing Task 2</option>
                  <option value="CD-IELTS Typing Corpus">CD-IELTS Typing Corpus</option>
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'প্রশ্ন বা কর্পাস স্টেম (Raw Input)' : 'Question or Typing Stem (Raw Input)'}
                </span>
                <textarea
                  rows={4}
                  required
                  value={draftStem}
                  onChange={(e) => setDraftStem(e.target.value)}
                  className="w-full border border-[var(--hairline)] bg-[var(--bg)] p-3 text-sm font-mono text-[var(--brand-deep)] rounded-[4px]"
                />
              </label>

              <div className="space-y-1.5">
                <div className="text-xs font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'লাইভ formatMathText() প্রিভিউ' : 'Live formatMathText() Preview'}
                </div>
                <div className="border border-[var(--hairline)] bg-[var(--bg-warm)] p-4 text-[15px] leading-relaxed text-[var(--brand-deep)] min-h-[108px] rounded-[4px]">
                  {formatMathText(draftStem)}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'হিন্ট স্তর ১ (কনসেপ্ট সূত্র)' : 'Tier 1 Hint (Concept Cue)'}
                </span>
                <textarea
                  rows={2}
                  required
                  value={draftHint1}
                  onChange={(e) => setDraftHint1(e.target.value)}
                  className="w-full border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'হিন্ট স্তর ২ (স্ট্রাকচারাল ধাপ)' : 'Tier 2 Hint (Structural Step)'}
                </span>
                <textarea
                  rows={2}
                  required
                  value={draftHint2}
                  onChange={(e) => setDraftHint2(e.target.value)}
                  className="w-full border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
              </label>
              <label className="block space-y-1.5">
                <span className="text-xs font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'হিন্ট স্তর ৩ (সম্পূর্ণ ব্যাখ্যা)' : 'Tier 3 Hint (Full Walkthrough)'}
                </span>
                <textarea
                  rows={2}
                  required
                  value={draftHint3}
                  onChange={(e) => setDraftHint3(e.target.value)}
                  className="w-full border border-[var(--hairline)] bg-[var(--bg)] p-2.5 text-sm text-[var(--brand-deep)] rounded-[4px]"
                />
              </label>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving}
                className="bg-[var(--brand)] hover:bg-[var(--link)] text-white px-5 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 rounded-[4px]"
              >
                {saving
                  ? isBn
                    ? 'জমা হচ্ছে...'
                    : 'Submitting to QA Queue...'
                  : isBn
                    ? 'অডিটর QA কিউ-তে জমা দিন'
                    : 'Submit Item to Auditor QA Queue'}
              </button>
            </div>
          </form>

          <WorkspaceDataTable
            caption="Authored Items Submitted to Auditor QA Queue"
            columns={[
              { key: 'item', header: isBn ? 'আইটেম আইডি' : 'Item ID' },
              { key: 'stem', header: isBn ? 'ফরম্যাটকৃত স্টেম' : 'Formatted Stem Preview' },
              { key: 'psychometrics', header: isBn ? 'সাইকোমেট্রিক সূচক' : 'Psychometric Est.', align: 'right' },
              { key: 'status', header: isBn ? 'QA অবস্থা' : 'QA Status' },
            ]}
            rows={authoredItemRows}
          />
        </section>
      ) : null}

      {mounted && !loading && activeTab === 'doubts' ? (
        <section>
          <WorkspaceSectionTitle
            title={isBn ? 'বেনামী স্কলার একাডেমিক ডাউট থ্রেড' : 'Scholar Academic Doubt Escalations'}
            subtitle={
              isBn
                ? 'সারি খুলে সরাসরি সমাধানের বদলে সক্রেটিক গাইডেন্স প্রদান করুন।'
                : 'Expand any anonymized item doubt thread to compose a Socratic faculty walkthrough.'
            }
          />
          <WorkspaceDataTable
            caption="Scholar Academic Doubt Escalations"
            columns={[
              { key: 'itemCode', header: isBn ? 'প্রশ্ন কোড' : 'Item Code' },
              { key: 'question', header: isBn ? 'প্রশ্নের অংশ' : 'Question Excerpt' },
              { key: 'scholarNote', header: isBn ? 'স্কলারের বিভ্রান্তি' : 'Scholar Note' },
              { key: 'action', header: isBn ? 'অ্যাকশন' : 'Action', align: 'right' },
            ]}
            rows={doubtRows}
          />
        </section>
      ) : null}
    </WorkspaceContainer>
  );
}

export default function InstructorPage() {
  return (
    <Suspense
      fallback={
        <WorkspaceContainer>
          <div className="border border-[var(--hairline)] bg-[var(--surface-paper)] p-6 text-sm text-[var(--text-muted)] rounded-[4px]">
            Loading Faculty Instructor Studio...
          </div>
        </WorkspaceContainer>
      }
    >
      <InstructorStudioContent />
    </Suspense>
  );
}
