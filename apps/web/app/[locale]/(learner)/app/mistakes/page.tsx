/** @purpose Mistake Ledger (/app/mistakes) in Claude Editorial Ledger aesthetic with Unicode math formatting and inline hint-free retry solver */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useLocale } from 'next-intl';
import {
  createMistakeNotebook,
  filterMistakes,
  recordMistake,
  retryMistake,
  type ErrorTaxonomy,
  type MistakeEntry,
} from '@lumen/core';
import { GRE_MAGOOSH_SEED_QUESTIONS } from '@lumen/db';
import { fetchMistakesAction, retryMistakeAction } from '@/app/actions/mistakes';
import { formatMathText } from '@/src/lib/format-math';
import {
  WorkspaceContainer,
  WorkspaceHeader,
  WorkspaceLedger,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
  WorkspaceTabs,
} from '@/src/components/ui/WorkspacePrimitives';

const CAUSE_LABELS: Record<ErrorTaxonomy, { en: string; bn: string }> = {
  careless_math: { en: 'Careless Math', bn: 'অসতর্ক গণিত' },
  vocab_gap: { en: 'Vocab Gap', bn: 'ভোকাব ঘাটতি' },
  concept_gap: { en: 'Concept Gap', bn: 'ধারণার ঘাটতি' },
  trap_answer: { en: 'Trap Answer', bn: 'ফাঁদ উত্তর' },
  misread_prompt: { en: 'Misread Prompt', bn: 'প্রশ্ন ভুল পড়া' },
  time_pressure: { en: 'Time Pressure', bn: 'সময়ের চাপ' },
};

function buildSandboxMistakes(): MistakeEntry[] {
  const userId = 'sandbox-scholar';
  let nb = createMistakeNotebook(userId);
  const q0 = GRE_MAGOOSH_SEED_QUESTIONS[0];
  const q1 = GRE_MAGOOSH_SEED_QUESTIONS[1];
  const q2 = GRE_MAGOOSH_SEED_QUESTIONS[2];

  if (q0) {
    nb = recordMistake(nb, {
      userId,
      questionId: q0.id,
      subject: 'quant',
      topicSlug: q0.topicSlug,
      questionPrompt: q0.promptMd,
      options: q0.options,
      selectedWrongAnswer: 'A',
      correctAnswers: q0.correctAnswers,
      explanationMd: q0.writtenExplanationMd,
      errorCategory: 'careless_math',
      notes: 'Assumed x = 4 only and overlooked negative root x = -4.',
    });
  }
  if (q1) {
    nb = recordMistake(nb, {
      userId,
      questionId: q1.id,
      subject: 'verbal',
      topicSlug: q1.topicSlug,
      questionPrompt: q1.promptMd,
      options: q1.options,
      selectedWrongAnswer: 'A',
      correctAnswers: q1.correctAnswers,
      explanationMd: q1.writtenExplanationMd,
      errorCategory: 'vocab_gap',
      notes: 'Missed combined work-rate reciprocal setup.',
    });
  }
  if (q2) {
    nb = recordMistake(nb, {
      userId,
      questionId: q2.id,
      subject: 'quant',
      topicSlug: q2.topicSlug,
      questionPrompt: q2.promptMd,
      options: q2.options,
      selectedWrongAnswer: 'B',
      correctAnswers: q2.correctAnswers,
      explanationMd: q2.writtenExplanationMd,
      errorCategory: 'trap_answer',
      notes: 'Fell for distractor prime factor count trap.',
    });
    nb = retryMistake({
      notebook: nb,
      questionId: q2.id,
      userAnswer: q2.correctAnswers[0] ?? 'D',
      hintsUsed: 0,
    }).notebook;
  }

  return filterMistakes(nb, {});
}

export default function MistakesPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [mistakes, setMistakes] = useState<MistakeEntry[]>(() => buildSandboxMistakes());
  const [statusTab, setStatusTab] = useState<'all' | 'open' | 'resolved'>('all');
  const [causeFilter, setCauseFilter] = useState<ErrorTaxonomy | 'all'>('all');

  const [activeRetryId, setActiveRetryId] = useState<string | null>(null);
  const [selectedChoice, setSelectedChoice] = useState<string>('');
  const [retryFeedback, setRetryFeedback] = useState<Record<string, { ok: boolean; msg: string }>>(
    {},
  );

  useEffect(() => {
    let active = true;
    fetchMistakesAction()
      .then((serverItems) => {
        if (active && serverItems.length > 0) {
          setMistakes(serverItems);
        }
      })
      .catch(() => {
        // Keep deterministic sandbox entries when unauthenticated
      });
    return () => {
      active = false;
    };
  }, []);

  const openCount = mistakes.filter((m) => m.status === 'open').length;
  const resolvedCount = mistakes.filter((m) => m.status === 'resolved').length;

  const primaryCause = useMemo(() => {
    const counts = new Map<ErrorTaxonomy, number>();
    for (const m of mistakes) {
      counts.set(m.errorCategory, (counts.get(m.errorCategory) ?? 0) + 1);
    }
    let top: ErrorTaxonomy = 'careless_math';
    let topCount = 0;
    for (const [k, v] of counts.entries()) {
      if (v > topCount) {
        top = k;
        topCount = v;
      }
    }
    return isBn ? CAUSE_LABELS[top].bn : CAUSE_LABELS[top].en;
  }, [mistakes, isBn]);

  const visibleMistakes = useMemo(() => {
    return mistakes.filter((m) => {
      if (statusTab !== 'all' && m.status !== statusTab) return false;
      if (causeFilter !== 'all' && m.errorCategory !== causeFilter) return false;
      return true;
    });
  }, [mistakes, statusTab, causeFilter]);

  const handleSubmitRetry = async (entry: MistakeEntry) => {
    if (!selectedChoice) return;

    try {
      const serverRes = await retryMistakeAction({
        questionId: entry.questionId,
        userAnswer: selectedChoice,
        hintsUsed: 0,
      });
      if (serverRes.entry) {
        setMistakes((prev) =>
          prev.map((m) => (m.questionId === entry.questionId ? serverRes.entry! : m)),
        );
      }
      setRetryFeedback((prev) => ({
        ...prev,
        [entry.questionId]: { ok: serverRes.isCorrect, msg: serverRes.message },
      }));
      return;
    } catch {
      // Fall back to deterministic client transition in sandbox mode
    }

    const isCorrect = entry.correctAnswers.includes(selectedChoice);
    setMistakes((prev) =>
      prev.map((m) =>
        m.questionId === entry.questionId
          ? {
              ...m,
              attemptsCount: m.attemptsCount + 1,
              status: isCorrect ? 'resolved' : m.status,
            }
          : m,
      ),
    );
    setRetryFeedback((prev) => ({
      ...prev,
      [entry.questionId]: {
        ok: isCorrect,
        msg: isCorrect
          ? isBn
            ? 'সঠিক সমাধান! আইটেমটি সমাধানকৃত হিসেবে চিহ্নিত হয়েছে।'
            : 'Solved without hints. Item transitioned from Open to Resolved.'
          : isBn
            ? 'সঠিক নয়—ব্যাখ্যাটি দেখে আবার চেষ্টা করুন।'
            : 'Incorrect choice—review your error note and try again.',
      },
    }));
  };

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'ভুলের খাতা ও সংশোধন লেজার' : 'Mistake Ledger'}
        subtitle={
          isBn
            ? 'অনুশীলন ও মক টেস্টের ভুল প্রশ্নগুলো হিন্ট ছাড়া সমাধান করে অমীমাংসিত থেকে সমাধানকৃত অবস্থায় নিন।'
            : 'Review missed items from drills and mocks. Solve independently without hints to transition items from Open to Resolved.'
        }
        primaryAction={{
          label: isBn ? 'জিআরই ড্রিলে অনুশীলন করুন →' : 'Practice GRE Drills →',
          href: '/app/gre?tab=drills',
        }}
        secondaryAction={{
          label: isBn ? 'ওভারভিউতে ফিরুন →' : 'Overview →',
          href: '/app',
        }}
      />

      <WorkspaceStatRow
        stats={[
          {
            value: isBn ? `${openCount} খোলা` : `${openCount} Open`,
            label: isBn ? 'অমীমাংসিত ভুল আইটেম' : 'Open Mistakes Requiring Retry',
          },
          {
            value: isBn ? `${resolvedCount} সমাধানকৃত` : `${resolvedCount} Resolved`,
            label: isBn ? 'হিন্ট ছাড়া সমাধান সম্পন্ন' : 'Resolved Without Hints',
          },
          {
            value: primaryCause,
            label: isBn ? 'প্রধান ত্রুটির ধরন' : 'Primary Error Cause',
          },
          {
            value: String(mistakes.length),
            label: isBn ? 'মোট নথিভুক্ত ভুল' : 'Total Logged Items',
          },
        ]}
      />

      <WorkspaceTabs
        activeTab={statusTab}
        onSelect={(id) => setStatusTab(id as 'all' | 'open' | 'resolved')}
        tabs={[
          { id: 'all', label: isBn ? 'সবগুলো' : 'All', count: mistakes.length },
          { id: 'open', label: isBn ? 'খোলা' : 'Open', count: openCount },
          { id: 'resolved', label: isBn ? 'সমাধানকৃত' : 'Resolved', count: resolvedCount },
        ]}
      />

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <WorkspaceSectionTitle
          title={isBn ? 'নথিভুক্ত ভুলের তালিকা' : 'Logged Error Entries'}
          subtitle={
            isBn
              ? `${visibleMistakes.length}টি আইটেম প্রদর্শিত হচ্ছে`
              : `Showing ${visibleMistakes.length} item(s)`
          }
        />

        <label className="flex items-center gap-2 text-xs text-[var(--text-muted)]">
          <span>{isBn ? 'ত্রুটির ধরন:' : 'Cause Filter:'}</span>
          <select
            value={causeFilter}
            onChange={(e) => setCauseFilter(e.target.value as ErrorTaxonomy | 'all')}
            className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-xs font-medium text-[var(--brand-deep)] focus:border-[var(--brand)] focus:outline-none"
          >
            <option value="all">{isBn ? 'সব ধরনের ত্রুটি' : 'All Error Causes'}</option>
            {(Object.keys(CAUSE_LABELS) as ErrorTaxonomy[]).map((key) => (
              <option key={key} value={key}>
                {isBn ? CAUSE_LABELS[key].bn : CAUSE_LABELS[key].en}
              </option>
            ))}
          </select>
        </label>
      </div>

      {visibleMistakes.length === 0 ? (
        <div className="border-y border-[var(--hairline)] py-10 text-center text-sm text-[var(--text-muted)]">
          {isBn
            ? 'এই ফিল্টারে কোনো ভুল আইটেম পাওয়া যায়নি।'
            : 'No mistake entries match the active filters.'}
        </div>
      ) : (
        <WorkspaceLedger>
          {visibleMistakes.map((entry) => {
            const isOpen = entry.status === 'open';
            const isRetrying = activeRetryId === entry.questionId;
            const fb = retryFeedback[entry.questionId];

            return (
              <div key={entry.id} className="py-5 px-2">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="min-w-0 flex-1 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span className="font-semibold text-[var(--brand-deep)] capitalize">
                        {entry.subject}
                      </span>
                      <span>·</span>
                      <span>
                        {isBn
                          ? CAUSE_LABELS[entry.errorCategory].bn
                          : CAUSE_LABELS[entry.errorCategory].en}
                      </span>
                      <span>·</span>
                      <span className="capitalize">{entry.topicSlug.replace(/-/g, ' ')}</span>
                      <span>·</span>
                      <span className={isOpen ? 'font-semibold text-[var(--brand)]' : 'text-[var(--brand-deep)]'}>
                        {isOpen ? (isBn ? 'খোলা' : 'Open') : isBn ? 'সমাধানকৃত' : 'Resolved'}
                      </span>
                    </div>

                    <p className="text-sm font-medium text-[var(--brand-deep)] leading-relaxed">
                      {formatMathText(entry.questionPrompt)}
                    </p>

                    {entry.notes ? (
                      <p className="text-xs text-[var(--text)] leading-relaxed">
                        <span className="font-semibold text-[var(--brand-deep)]">
                          {isBn ? 'নোট: ' : 'Diagnosis: '}
                        </span>
                        {formatMathText(entry.notes)}
                      </p>
                    ) : null}
                  </div>

                  <div className="shrink-0 pt-1">
                    <button
                      type="button"
                      onClick={() => {
                        if (isRetrying) {
                          setActiveRetryId(null);
                        } else {
                          setActiveRetryId(entry.questionId);
                          setSelectedChoice('');
                        }
                      }}
                      className="text-sm font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)] leading-relaxed"
                    >
                      {isRetrying
                        ? isBn
                          ? 'বন্ধ করুন'
                          : 'Close Retry'
                        : isBn
                          ? 'হিন্ট ছাড়া পুনরায় চেষ্টা →'
                          : 'Retry Without Hints →'}
                    </button>
                  </div>
                </div>

                {isRetrying ? (
                  <div className="mt-4 border-t border-[var(--hairline)] pt-4 bg-[var(--surface-paper)] p-5 space-y-4">
                    <p className="text-xs font-semibold text-[var(--brand-deep)]">
                      {isBn
                        ? 'সমাধানকৃত হিসেবে চিহ্নিত করতে হিন্ট ছাড়া সঠিক উত্তর বাছাই করুন:'
                        : 'Select the correct answer without hints to resolve this item:'}
                    </p>

                    <div className="space-y-2">
                      {(entry.options ?? []).map((opt) => {
                        const selected = selectedChoice === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() => setSelectedChoice(opt.id)}
                            className={
                              selected
                                ? 'w-full text-left flex items-start gap-3 rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-deep)] leading-relaxed'
                                : 'w-full text-left flex items-start gap-3 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--brand-deep)] hover:border-[var(--brand)] leading-relaxed'
                            }
                          >
                            <span className="font-mono font-semibold shrink-0">{opt.id}.</span>
                            <span>{formatMathText(opt.text)}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          void handleSubmitRetry(entry);
                        }}
                        className="bg-[var(--brand)] text-white px-4 py-2 text-xs font-semibold rounded-[4px] hover:bg-[var(--link)] transition-colors"
                      >
                        {isBn ? 'হিন্ট-মুক্ত উত্তর জমা দিন' : 'Submit Hint-Free Retry'}
                      </button>
                    </div>

                    {fb ? (
                      <div className="border-t border-[var(--hairline)] pt-3 space-y-1.5">
                        <p className="text-sm font-semibold text-[var(--brand-deep)]">{fb.msg}</p>
                        {fb.ok && entry.explanationMd ? (
                          <p className="text-xs text-[var(--text)] whitespace-pre-line leading-relaxed">
                            {formatMathText(entry.explanationMd)}
                          </p>
                        ) : null}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>
            );
          })}
        </WorkspaceLedger>
      )}
    </WorkspaceContainer>
  );
}
