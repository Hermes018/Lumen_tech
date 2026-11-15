/** @purpose Dedicated GRE General Test Track workspace (/app/gre) with 12-item inline Socratic solver, CBT mocks, AWA Issue Lab, and Quant formula ledger */
'use client';

import React, { useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import { GRE_MAGOOSH_SEED_QUESTIONS, type SeedGreQuestion } from '@lumen/db';
import { countWords, evaluateAwaIssueEssay, type EvaluateAwaResult } from '@lumen/ai';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { formatMathText } from '@/src/lib/format-math';
import {
  WorkspaceContainer,
  WorkspaceHeader,
  WorkspaceLedger,
  WorkspaceLedgerRow,
  WorkspaceProgressBar,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
  WorkspaceTabs,
} from '@/src/components/ui/WorkspacePrimitives';

type GreTab = 'drills' | 'mocks' | 'awa' | 'formulas';
type SubjectFilter = 'all' | 'quant' | 'verbal';
type DrillMode = 'tutor' | 'timed';

const AWA_ISSUE_PROMPTS = [
  {
    id: 'awa-science-funding',
    titleEn: 'Applied vs. Theoretical Scientific Research',
    titleBn: 'প্রয়োগিক বনাম তাত্ত্বিক বৈজ্ঞানিক গবেষণা',
    prompt:
      'Governments should prioritize funding for scientific research that has immediate, tangible economic applications over research whose consequences are primarily theoretical.',
  },
  {
    id: 'awa-university-curriculum',
    titleEn: 'Specialized Vocational vs. Broad Liberal Arts Curriculum',
    titleBn: 'বিশেষায়িত বৃত্তিমূলক বনাম উদার কলা পাঠ্যক্রম',
    prompt:
      'Universities should require every student to take a variety of courses outside the student’s field of study rather than focusing exclusively on career-specific skills.',
  },
  {
    id: 'awa-civic-technology',
    titleEn: 'Public Infrastructure vs. Digital Connectivity',
    titleBn: 'জনসাধারণের অবকাঠামো বনাম ডিজিটাল সংযোগ',
    prompt:
      'As society relies more heavily on digital networks, public leaders should treat broadband access as a primary civic utility on par with roads and electricity.',
  },
];

const GRE_MOCK_LEDGER = [
  {
    id: 'mock-baseline',
    titleEn: 'Diagnostic Baseline — 308',
    titleBn: 'ডায়াগনস্টিক বেসলাইন — ৩০৮',
    breakdown: 'Q156 · V152 · AWA 4.0 · 1h 58m Section-Adaptive',
    statusEn: 'Completed',
    statusBn: 'সম্পন্ন',
  },
  {
    id: 'mock-test-1',
    titleEn: 'Mock Test 1 — 313',
    titleBn: 'মক টেস্ট ১ — ৩১৩',
    breakdown: 'Q159 · V154 · AWA 4.0 · 1h 58m Section-Adaptive',
    statusEn: 'Completed',
    statusBn: 'সম্পন্ন',
  },
  {
    id: 'mock-test-2',
    titleEn: 'Mock Test 2 — 315',
    titleBn: 'মক টেস্ট ২ — ৩১৫',
    breakdown: 'Q161 · V154 · AWA 4.5 · 1h 58m Section-Adaptive',
    statusEn: 'Completed',
    statusBn: 'সম্পন্ন',
  },
  {
    id: 'mock-test-3',
    titleEn: 'Mock Test 3 — Ready to Launch',
    titleBn: 'মক টেস্ট ৩ — শুরুর জন্য প্রস্তুত',
    breakdown: 'Full 1h 58m Section-Adaptive CBT · Quant & Verbal',
    statusEn: 'Ready',
    statusBn: 'প্রস্তুত',
  },
];

const QUANT_FORMULA_SHEETS = [
  {
    id: 'exponents',
    topicEn: 'Exponent Laws & Even/Odd Roots',
    topicBn: 'সূচক নিয়ম এবং জোড়/বিজোড় মূল',
    formula: 'x^a \\times x^b = x^(a+b) · (x^a)^b = x^(ab) · If x^2 = 16, x = \\pm 4; if y^3 = -27, y = -3',
    trapEn: 'Always test both positive and negative roots for even exponents in Quantitative Comparison.',
    trapBn: 'কোয়ান্টিটেটিভ কম্প্যারিজনে জোড় ঘাতের জন্য সবসময় ধনাত্মক ও ঋণাত্মক উভয় মূল পরীক্ষা করুন।',
  },
  {
    id: 'primes',
    topicEn: 'Prime Factorization & Divisibility',
    topicBn: 'মৌলিক উৎপাদক ও বিভাজ্যতা',
    formula: 'Every integer > 1 factors uniquely into primes. Number of divisors of p^a \\times q^b is (a+1)(b+1).',
    trapEn: '2 is the only even prime number; 1 is neither prime nor composite.',
    trapBn: '২ হলো একমাত্র জোড় মৌলিক সংখ্যা; ১ মৌলিক বা যৌগিক কোনোটিই নয়।',
  },
  {
    id: 'geometry',
    topicEn: 'Circle & Special Right Triangle Ratios',
    topicBn: 'বৃত্ত ও বিশেষ সমকোণী ত্রিভুজ অনুপাত',
    formula: 'Circle Area = \\pi r^2 · Circumference = 2\\pi r · 30-60-90 sides: x : x\\sqrt{3} : 2x · 45-45-90: x : x : x\\sqrt{2}',
    trapEn: 'Do not assume diagrams are drawn to scale unless explicitly stated.',
    trapBn: 'স্পষ্টভাবে উল্লেখ না থাকলে জ্যামিতিক চিত্র স্কেল অনুযায়ী আঁকা ধরে নেবেন না।',
  },
  {
    id: 'combinatorics',
    topicEn: 'Combinatorics & Dependent Probability',
    topicBn: 'বিন্যাস-সমাবেশ ও নির্ভরশীল সম্ভাবনা',
    formula: 'nCr = \\frac{n!}{r!(n-r)!} · Without replacement: P(A and B) = P(A) \\times P(B | A)',
    trapEn: 'Check whether selection is with or without replacement before multiplying fractions.',
    trapBn: 'ভগ্নাংশ গুণ করার আগে নির্বাচনটি প্রতিস্থাপনসহ নাকি প্রতিস্থাপন ছাড়া তা যাচাই করুন।',
  },
];

function isQuantQuestion(q: SeedGreQuestion): boolean {
  return (
    q.questionType.startsWith('gre_q') ||
    q.questionType.startsWith('gre_numeric')
  );
}

function getDifficultyLabel(difficultyB: number, isBn: boolean): string {
  if (difficultyB < -0.3) return isBn ? 'সহজ' : 'Foundational';
  if (difficultyB > 0.5) return isBn ? 'কঠিন' : 'Hard (700+)';
  return isBn ? 'মাঝারি' : 'Medium';
}

function GreWorkspaceContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isBn = locale === 'bn';

  const rawTab = searchParams?.get('tab');
  const initialTab: GreTab =
    rawTab === 'mocks' || rawTab === 'awa' || rawTab === 'formulas' ? rawTab : 'drills';

  const [activeTab, setActiveTab] = useState<GreTab>(initialTab);
  const [subjectFilter, setSubjectFilter] = useState<SubjectFilter>('all');
  const [drillMode, setDrillMode] = useState<DrillMode>('tutor');

  // Inline drill solver state
  const [openItemId, setOpenItemId] = useState<string | null>(null);
  const [selectedChoices, setSelectedChoices] = useState<Record<string, string[]>>({});
  const [numericInputs, setNumericInputs] = useState<Record<string, string>>({});
  const [revealedHints, setRevealedHints] = useState<Record<string, number>>({});
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});
  const [savedToMistakes, setSavedToMistakes] = useState<Record<string, boolean>>({});

  // AWA Issue Lab state
  const [selectedPromptId, setSelectedPromptId] = useState<string>(AWA_ISSUE_PROMPTS[0]!.id);
  const [awaEssay, setAwaEssay] = useState<string>(
    'While governments face pressing incentives to prioritize scientific research with immediate commercial value, starving theoretical inquiry undermines the very discoveries that later produce transformative industries.\n\nConsider how foundational theoretical work in physics and molecular biology lacked obvious short-term profits at its inception. Quantum mechanics and general relativity were pursued as pure inquiries into natural law, yet they now anchor semiconductor manufacturing and global satellite navigation. Without public investment in high-risk, long-horizon science, private markets—which naturally favor quarterly returns—will underinvest in basic knowledge.\n\nAdmittedly, during acute public emergencies such as pandemics or grid failures, allocating marginal funds toward rapid applied solutions is both pragmatic and ethical. However, treating applied and theoretical research as mutually exclusive creates a false dichotomy.\n\nConsequently, national science budgets should maintain a balanced portfolio: steady institutional support for theoretical research alongside targeted grants for urgent civic applications.',
  );
  const [awaResult, setAwaResult] = useState<EvaluateAwaResult | null>(null);

  const curatedQuestions = useMemo(() => GRE_MAGOOSH_SEED_QUESTIONS.slice(0, 12), []);

  const filteredQuestions = useMemo(() => {
    if (subjectFilter === 'all') return curatedQuestions;
    if (subjectFilter === 'quant') return curatedQuestions.filter(isQuantQuestion);
    return curatedQuestions.filter((q) => !isQuantQuestion(q));
  }, [curatedQuestions, subjectFilter]);

  const activePrompt =
    AWA_ISSUE_PROMPTS.find((p) => p.id === selectedPromptId) ?? AWA_ISSUE_PROMPTS[0]!;
  const awaWordCount = countWords(awaEssay);

  const handleToggleChoice = (q: SeedGreQuestion, choiceId: string) => {
    const isMulti = q.questionType === 'gre_mc_multi' || q.correctAnswers.length > 1;
    setSelectedChoices((prev) => {
      const current = prev[q.id] ?? [];
      if (!isMulti) {
        return { ...prev, [q.id]: [choiceId] };
      }
      const next = current.includes(choiceId)
        ? current.filter((c) => c !== choiceId)
        : [...current, choiceId];
      return { ...prev, [q.id]: next };
    });
    setCheckedItems((prev) => ({ ...prev, [q.id]: false }));
  };

  const handleCheckAnswer = (q: SeedGreQuestion) => {
    setCheckedItems((prev) => ({ ...prev, [q.id]: true }));
  };

  const handleRevealNextHint = (q: SeedGreQuestion) => {
    setRevealedHints((prev) => {
      const current = prev[q.id] ?? 0;
      const maxHints = drillMode === 'timed' ? 1 : q.hints.length;
      return { ...prev, [q.id]: Math.min(maxHints, current + 1) };
    });
  };

  const isAnswerCorrect = (q: SeedGreQuestion): boolean => {
    if (q.options.length === 0) {
      const val = (numericInputs[q.id] ?? '').trim();
      return q.correctAnswers.some((ans) => ans.trim().toLowerCase() === val.toLowerCase());
    }
    const picked = [...(selectedChoices[q.id] ?? [])].sort();
    const target = [...q.correctAnswers].sort();
    return picked.length === target.length && picked.every((v, idx) => v === target[idx]);
  };

  const handleEvaluateAwa = () => {
    const res = evaluateAwaIssueEssay({
      essayText: awaEssay,
      promptText: activePrompt.prompt,
      accountName: 'Ayman Rahman',
    });
    setAwaResult(res);
  };

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'জিআরই জেনারেল টেস্ট ট্র্যাক' : 'GRE® General Test Track'}
        subtitle={
          isBn
            ? 'কম্পিউটার-ভিত্তিক সেকশন-অ্যাডাপ্টিভ কোয়ান্টিটেটিভ রিজনিং, ভার্বাল রিজনিং এবং অ্যানালিটিক্যাল রাইটিং।'
            : 'Computer-delivered section-adaptive Quantitative Reasoning, Verbal Reasoning, and Analytical Writing.'
        }
        primaryAction={{
          label: isBn ? 'সেকশন-অ্যাডাপ্টিভ মক চালু করুন →' : 'Launch Section-Adaptive Mock →',
          href: '/exam/diagnostic',
        }}
        secondaryAction={{
          label: isBn ? 'জিআরই স্কোর ক্যালকুলেটর →' : 'GRE Score Calculator →',
          href: '/tools/gre-score-calculator',
        }}
      />

      <WorkspaceStatRow
        stats={[
          {
            value: '315 / 340',
            label: isBn ? 'অনুমিত মোট স্কোর · লক্ষ্য ৩২৫+' : 'Estimated Total · Target 325+',
          },
          {
            value: 'Q161 / 170',
            label: isBn ? 'কোয়ান্টিটেটিভ · ৭৮তম পার্সেন্টাইল' : 'Quantitative · 78th Percentile',
          },
          {
            value: 'V154 / 170',
            label: isBn ? 'ভার্বাল · ৬৫তম পার্সেন্টাইল' : 'Verbal · 65th Percentile',
          },
          {
            value: '4.5 / 6.0',
            label: isBn ? 'অ্যানালিটিক্যাল রাইটিং' : 'Analytical Writing',
          },
        ]}
      />

      <WorkspaceTabs
        activeTab={activeTab}
        onSelect={(id) => setActiveTab(id as GreTab)}
        tabs={[
          {
            id: 'drills',
            label: isBn ? 'অ্যাডাপ্টিভ কোয়ান্ট ও ভার্বাল ড্রিল' : 'Adaptive Quant & Verbal Drills',
            count: curatedQuestions.length,
          },
          {
            id: 'mocks',
            label: isBn ? 'পূর্ণ সেকশন-অ্যাডাপ্টিভ সিবিটি মক' : 'Full Section-Adaptive CBT Mocks',
            count: GRE_MOCK_LEDGER.length,
          },
          {
            id: 'awa',
            label: isBn ? 'অ্যানালিটিক্যাল রাইটিং (ইস্যু) ল্যাব' : 'Analytical Writing (Issue Essay) Lab',
          },
          {
            id: 'formulas',
            label: isBn ? 'কোয়ান্ট সূত্র ও ভার্বাল ভোকাব' : 'Quant Formulas & Verbal Vocab',
          },
        ]}
      />

      {activeTab === 'drills' ? (
        <section className="space-y-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              {(
                [
                  { id: 'all', labelEn: 'All (12)', labelBn: 'সবগুলো (১২)' },
                  { id: 'quant', labelEn: 'Quantitative', labelBn: 'কোয়ান্টিটেটিভ' },
                  { id: 'verbal', labelEn: 'Verbal', labelBn: 'ভার্বাল' },
                ] as const
              ).map((f) => {
                const active = subjectFilter === f.id;
                return (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSubjectFilter(f.id)}
                    className={
                      active
                        ? 'rounded-[4px] border border-[var(--brand-deep)] bg-[var(--brand-deep)] px-3.5 py-2 text-xs font-semibold text-white leading-relaxed'
                        : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3.5 py-2 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)] leading-relaxed'
                    }
                  >
                    {isBn ? f.labelBn : f.labelEn}
                  </button>
                );
              })}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs text-[var(--text-muted)]">
                {isBn ? 'মোড:' : 'Mode:'}
              </span>
              {(
                [
                  { id: 'tutor', labelEn: 'Untimed Socratic Tutor', labelBn: 'আনটাইমড সোক্রেটিক টিউটর' },
                  { id: 'timed', labelEn: 'Timed Pacing (1m 30s)', labelBn: 'টাইমড পেসিং (১মি ৩০সে)' },
                ] as const
              ).map((m) => {
                const active = drillMode === m.id;
                return (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setDrillMode(m.id)}
                    className={
                      active
                        ? 'rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-3 py-2 text-xs font-semibold text-[var(--brand)] leading-relaxed'
                        : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-xs font-medium text-[var(--text)] hover:border-[var(--brand)] leading-relaxed'
                    }
                  >
                    {isBn ? m.labelBn : m.labelEn}
                  </button>
                );
              })}
            </div>
          </div>

          <WorkspaceLedger>
            {filteredQuestions.map((q, idx) => {
              const quant = isQuantQuestion(q);
              const isOpen = openItemId === q.id;
              const isAwaItem = q.questionType === 'gre_awa_issue';
              const picked = selectedChoices[q.id] ?? [];
              const hintTier = revealedHints[q.id] ?? 0;
              const isChecked = Boolean(checkedItems[q.id]);
              const correct = isChecked && isAnswerCorrect(q);
              const isSaved = Boolean(savedToMistakes[q.id]);

              return (
                <div key={q.id} className="py-4 px-2">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="min-w-0 flex-1 space-y-1">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                        <span className="font-mono font-semibold text-[var(--brand-deep)]">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span>·</span>
                        <span>{quant ? 'Quantitative' : 'Verbal / AWA'}</span>
                        <span>·</span>
                        <span>{getDifficultyLabel(q.difficultyB, isBn)}</span>
                        <span>·</span>
                        <span className="capitalize">{q.topicSlug.replace(/-/g, ' ')}</span>
                      </div>
                      <p className="text-sm font-medium text-[var(--brand-deep)] leading-relaxed">
                        {formatMathText(q.promptMd)}
                      </p>
                    </div>

                    <div className="flex items-center gap-4 shrink-0 pt-1">
                      <button
                        type="button"
                        onClick={() => setOpenItemId(isOpen ? null : q.id)}
                        className="text-sm font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)] leading-relaxed"
                      >
                        {isOpen
                          ? isBn
                            ? 'বন্ধ করুন'
                            : 'Close Solver'
                          : isBn
                            ? 'সমাধান করুন →'
                            : 'Solve Item →'}
                      </button>
                    </div>
                  </div>

                  {isOpen ? (
                    <div className="mt-5 border-t border-[var(--hairline)] pt-5 space-y-5 bg-[var(--surface-paper)] p-5">
                      {q.passageMd ? (
                        <div className="border-l-2 border-[var(--hairline)] pl-4 text-sm text-[var(--text)] leading-relaxed whitespace-pre-line">
                          {formatMathText(q.passageMd)}
                        </div>
                      ) : null}

                      {isAwaItem ? (
                        <div className="space-y-3">
                          <p className="text-sm text-[var(--text)] leading-relaxed">
                            {isBn
                              ? 'এই ইস্যু প্রম্পটটি রাইটিং ল্যাবে মূল্যায়ন করুন অথবা নিচে ৩-স্তরের কৌশলগত হিন্ট দেখুন।'
                              : 'Draft and score this Issue essay in the AWA Lab tab, or inspect the 3-tier strategy hints below.'}
                          </p>
                          <button
                            type="button"
                            onClick={() => setActiveTab('awa')}
                            className="inline-flex items-center bg-[var(--brand)] text-white px-4 py-2 text-xs font-semibold rounded-[4px] hover:bg-[var(--link)]"
                          >
                            {isBn ? 'এডব্লিউএ ল্যাবে খুলুন →' : 'Open in AWA Lab →'}
                          </button>
                        </div>
                      ) : q.options.length > 0 ? (
                        <div className="space-y-2">
                          {q.options.map((opt) => {
                            const selected = picked.includes(opt.id);
                            const isTargetCorrect = q.correctAnswers.includes(opt.id);
                            let choiceStyle =
                              'border-[var(--hairline)] bg-[var(--bg)] text-[var(--brand-deep)] hover:border-[var(--brand)]';
                            if (isChecked && isTargetCorrect) {
                              choiceStyle =
                                'border-[var(--brand-deep)] bg-[var(--bg-warm)] text-[var(--brand-deep)] font-semibold';
                            } else if (isChecked && selected && !isTargetCorrect) {
                              choiceStyle =
                                'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand)]';
                            } else if (selected) {
                              choiceStyle =
                                'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand-deep)] font-semibold';
                            }
                            return (
                              <button
                                key={opt.id}
                                type="button"
                                onClick={() => handleToggleChoice(q, opt.id)}
                                className={`w-full text-left flex items-start gap-3 rounded-[4px] border px-4 py-2.5 text-sm leading-relaxed transition-colors ${choiceStyle}`}
                              >
                                <span className="font-mono font-semibold shrink-0">{opt.id}.</span>
                                <span>{formatMathText(opt.text)}</span>
                              </button>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-3">
                          <label className="text-xs font-medium text-[var(--text-muted)]">
                            {isBn ? 'সংখ্যাসূচক উত্তর (যেমন 36 বা 5/33):' : 'Numeric Entry (e.g., 36 or 5/33):'}
                          </label>
                          <input
                            type="text"
                            value={numericInputs[q.id] ?? ''}
                            onChange={(e) => {
                              setNumericInputs((prev) => ({ ...prev, [q.id]: e.target.value }));
                              setCheckedItems((prev) => ({ ...prev, [q.id]: false }));
                            }}
                            placeholder="Enter value..."
                            className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-sm text-[var(--brand-deep)] focus:border-[var(--brand)] focus:outline-none"
                          />
                        </div>
                      )}

                      <div className="flex flex-wrap items-center gap-4">
                        {!isAwaItem ? (
                          <button
                            type="button"
                            onClick={() => handleCheckAnswer(q)}
                            className="bg-[var(--brand)] text-white px-4 py-2 text-xs font-semibold rounded-[4px] hover:bg-[var(--link)] transition-colors"
                          >
                            {isBn ? 'উত্তর যাচাই করুন' : 'Check Answer'}
                          </button>
                        ) : null}

                        {q.hints.length > 0 && hintTier < (drillMode === 'timed' ? 1 : q.hints.length) ? (
                          <button
                            type="button"
                            onClick={() => handleRevealNextHint(q)}
                            className="text-xs font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)]"
                          >
                            {isBn
                              ? `হিন্ট ${hintTier + 1} দেখুন (${q.hints[hintTier]?.label ?? ''})`
                              : `Reveal Hint ${hintTier + 1} (${q.hints[hintTier]?.label ?? ''})`}
                          </button>
                        ) : null}

                        <button
                          type="button"
                          onClick={() => setSavedToMistakes((prev) => ({ ...prev, [q.id]: true }))}
                          className="text-xs font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)]"
                        >
                          {isSaved
                            ? isBn
                              ? 'ভুলের খাতায় সংরক্ষিত ✓'
                              : 'Saved to Mistake Ledger ✓'
                            : isBn
                              ? 'ভুলের খাতায় সংরক্ষণ করুন'
                              : 'Save to Mistake Ledger'}
                        </button>

                        {isSaved ? (
                          <LocaleLink
                            href="/app/mistakes"
                            className="text-xs font-medium text-[var(--brand)] underline underline-offset-4"
                          >
                            {isBn ? 'খাতা খুলুন →' : 'Open Mistake Ledger →'}
                          </LocaleLink>
                        ) : null}
                      </div>

                      {hintTier > 0 ? (
                        <div className="border-t border-[var(--hairline)] pt-4 space-y-2.5">
                          {q.hints.slice(0, hintTier).map((h) => (
                            <div key={h.tier} className="border-l-2 border-[var(--brand)] pl-3 text-xs leading-relaxed text-[var(--text)]">
                              <span className="font-semibold text-[var(--brand-deep)]">
                                Hint {h.tier} ({h.label}):{' '}
                              </span>
                              {formatMathText(h.content_md)}
                            </div>
                          ))}
                        </div>
                      ) : null}

                      {isChecked ? (
                        <div className="border-t border-[var(--hairline)] pt-4 space-y-2">
                          <p className="text-sm font-semibold text-[var(--brand-deep)]">
                            {correct
                              ? isBn
                                ? 'সঠিক উত্তর!'
                                : 'Correct Answer'
                              : isBn
                                ? `সঠিক উত্তর: ${q.correctAnswers.join(', ')}`
                                : `Correct Answer: ${q.correctAnswers.join(', ')}`}
                          </p>
                          <p className="text-xs text-[var(--text)] whitespace-pre-line leading-relaxed">
                            {formatMathText(q.writtenExplanationMd)}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </WorkspaceLedger>
        </section>
      ) : null}

      {activeTab === 'mocks' ? (
        <section>
          <WorkspaceSectionTitle
            title={isBn ? 'পূর্ণ সেকশন-অ্যাডাপ্টিভ জিআরই সিবিটি মক' : 'Full Section-Adaptive GRE CBT Mocks'}
            subtitle={
              isBn
                ? '২টি কোয়ান্টিটেটিভ, ২টি ভার্বাল এবং ১টি ইস্যু রচনাসহ ১ ঘণ্টা ৫৮ মিনিটের সিমুলেশন।'
                : '1h 58m computer-delivered simulation with 2 Quantitative, 2 Verbal, and 1 Analytical Writing section.'
            }
          />
          <WorkspaceLedger>
            {GRE_MOCK_LEDGER.map((mock) => (
              <WorkspaceLedgerRow
                key={mock.id}
                left={
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                      {isBn ? mock.titleBn : mock.titleEn}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {mock.breakdown}
                    </p>
                  </div>
                }
                right={
                  <>
                    <span className="text-xs text-[var(--text-muted)]">
                      {isBn ? mock.statusBn : mock.statusEn}
                    </span>
                    <LocaleLink
                      href="/exam/diagnostic"
                      className="text-sm font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
                    >
                      {isBn ? 'সিবিটি সিমুলেটর চালু করুন →' : 'Launch CBT Simulator →'}
                    </LocaleLink>
                  </>
                }
              />
            ))}
          </WorkspaceLedger>
        </section>
      ) : null}

      {activeTab === 'awa' ? (
        <section className="space-y-6">
          <WorkspaceSectionTitle
            title={isBn ? 'অ্যানালিটিক্যাল রাইটিং (ইস্যু প্রবন্ধ) ল্যাব' : 'Analytical Writing (Issue Essay) Lab'}
            subtitle={
              isBn
                ? 'অফিশিয়াল প্রম্পটে ৩০-মিনিটের অনুশীলন এবং ০.০–৬.০ রুব্রিক বিশ্লেষণ।'
                : 'Official Issue prompt selector with live word count and instant 0.0–6.0 rubric evaluation.'
            }
          />

          <div className="flex flex-wrap gap-2">
            {AWA_ISSUE_PROMPTS.map((p) => {
              const active = p.id === selectedPromptId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedPromptId(p.id);
                    setAwaResult(null);
                  }}
                  className={
                    active
                      ? 'rounded-[4px] border border-[var(--brand-deep)] bg-[var(--brand-deep)] px-3.5 py-2 text-xs font-semibold text-white leading-relaxed'
                      : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3.5 py-2 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)] leading-relaxed'
                  }
                >
                  {isBn ? p.titleBn : p.titleEn}
                </button>
              );
            })}
          </div>

          <div className="border-l-[3px] border-[var(--brand)] bg-[var(--surface-paper)] border border-[var(--hairline)] p-5 space-y-2">
            <p className="text-sm font-medium text-[var(--brand-deep)] leading-relaxed">
              {activePrompt.prompt}
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isBn
                ? 'নির্দেশনা: আপনার অবস্থানের পক্ষে যুক্তি দিন এবং প্রাসঙ্গিক পাল্টা যুক্তি বিশ্লেষণ করুন।'
                : 'Task: Discuss the extent to which you agree or disagree and examine specific circumstances shaping your position.'}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>{isBn ? 'আপনার প্রবন্ধ খসড়া' : 'Essay Draft'}</span>
              <span className="font-mono font-semibold text-[var(--brand-deep)]">
                {awaWordCount} {isBn ? 'শব্দ' : 'words'}
              </span>
            </div>
            <textarea
              value={awaEssay}
              onChange={(e) => setAwaEssay(e.target.value)}
              rows={9}
              className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-4 text-sm text-[var(--brand-deep)] leading-relaxed focus:border-[var(--brand)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleEvaluateAwa}
              className="bg-[var(--brand)] text-white px-5 py-2.5 text-sm font-semibold rounded-[4px] hover:bg-[var(--link)] transition-colors"
            >
              {isBn ? 'ইস্যু প্রবন্ধ মূল্যায়ন করুন →' : 'Evaluate Issue Essay →'}
            </button>
          </div>

          {awaResult ? (
            awaResult.success ? (
              <div className="border-t border-[var(--hairline)] pt-6 space-y-5">
                <WorkspaceSectionTitle
                  title={
                    isBn
                      ? `অনুমিত এডব্লিউএ স্কোর: ${awaResult.evaluation.score.toFixed(1)} / 6.0`
                      : `Estimated AWA Score: ${awaResult.evaluation.score.toFixed(1)} / 6.0`
                  }
                  subtitle={`${awaResult.wordCount} words · Confidence: ${awaResult.evaluation.confidence}`}
                />
                <WorkspaceLedger>
                  {[
                    {
                      label: isBn ? 'থিসিস ও দৃষ্টিভঙ্গির স্পষ্টতা' : 'Thesis Clarity & Insight',
                      dim: awaResult.evaluation.dimensions.position_insight,
                    },
                    {
                      label: isBn ? 'যুক্তি ও পাল্টা যুক্তির গভীরতা' : 'Counterargument & Evidence Depth',
                      dim: awaResult.evaluation.dimensions.support_reasoning,
                    },
                    {
                      label: isBn ? 'সংগঠন ও অনুচ্ছেদ বিন্যাস' : 'Organization & Focus',
                      dim: awaResult.evaluation.dimensions.organization_focus,
                    },
                    {
                      label: isBn ? 'বাক্যবৈচিত্র্য ও ভাষার প্রয়োগ' : 'Syntactic Variety & Language Use',
                      dim: awaResult.evaluation.dimensions.language_use,
                    },
                  ].map((item) => (
                    <WorkspaceLedgerRow
                      key={item.label}
                      left={
                        <div className="space-y-2 max-w-[60ch]">
                          <p className="text-sm font-semibold text-[var(--brand-deep)]">
                            {item.label}
                          </p>
                          <p className="text-xs text-[var(--text)] leading-relaxed">
                            {item.dim.rationale}
                          </p>
                        </div>
                      }
                      right={
                        <div className="w-40 space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-semibold text-[var(--brand-deep)]">
                            <span>{item.dim.band.toFixed(1)} / 6.0</span>
                          </div>
                          <WorkspaceProgressBar value={item.dim.band} max={6} tone="crimson" />
                        </div>
                      }
                    />
                  ))}
                </WorkspaceLedger>
              </div>
            ) : (
              <p className="text-sm text-[var(--brand)]">{awaResult.error}</p>
            )
          ) : null}
        </section>
      ) : null}

      {activeTab === 'formulas' ? (
        <section className="space-y-6">
          <WorkspaceSectionTitle
            title={isBn ? 'কোয়ান্টিটেটিভ সূত্র ও ভার্বাল ডেক' : 'Quant Formula Sheets & Verbal Vocabulary'}
            subtitle={
              isBn
                ? 'উচ্চ-গুরুত্বপূর্ণ সূত্র ও ফাঁদ সতর্কতা, এবং এফএসআরএস ভোকাবুলারি ডেক।'
                : 'High-yield Quant laws with trap alerts, paired with FSRS spaced-repetition vocabulary decks.'
            }
            rightAction={
              <LocaleLink
                href="/app/vocab"
                className="text-sm font-medium text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)]"
              >
                {isBn ? 'এফএসআরএস ভোকাব হাব খুলুন →' : 'Open FSRS Vocab Hub →'}
              </LocaleLink>
            }
          />
          <WorkspaceLedger>
            {QUANT_FORMULA_SHEETS.map((sheet) => (
              <WorkspaceLedgerRow
                key={sheet.id}
                left={
                  <div className="space-y-1">
                    <p className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                      {isBn ? sheet.topicBn : sheet.topicEn}
                    </p>
                    <p className="font-mono text-xs text-[var(--brand)] leading-relaxed">
                      {formatMathText(sheet.formula)}
                    </p>
                    <p className="text-xs text-[var(--text)] leading-relaxed">
                      {isBn ? sheet.trapBn : sheet.trapEn}
                    </p>
                  </div>
                }
                right={
                  <LocaleLink
                    href="/app/vocab/play?mode=quant_formula"
                    className="text-sm font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
                  >
                    {isBn ? 'কার্ডে অনুশীলন করুন →' : 'Drill Formula Cards →'}
                  </LocaleLink>
                }
              />
            ))}
          </WorkspaceLedger>
        </section>
      ) : null}
    </WorkspaceContainer>
  );
}

export default function GreTrackPage() {
  return (
    <React.Suspense
      fallback={
        <WorkspaceContainer>
          <p className="text-sm text-[var(--text-muted)]">Loading GRE® General Track...</p>
        </WorkspaceContainer>
      }
    >
      <GreWorkspaceContent />
    </React.Suspense>
  );
}
