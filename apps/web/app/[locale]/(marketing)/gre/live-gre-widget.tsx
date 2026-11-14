/** @purpose Interactive "Try a Live GRE Question Now" assessment sheet in Pearl/Crimson institutional design */
'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { LocaleLink as Link } from '../../_components/LocaleLink';
import { MathText } from '@lumen/ui';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Languages, Lightbulb } from 'lucide-react';

interface HintTierItem {
  tier: number;
  label: string;
  content_md: string;
}

const SEEDED_QC_HINTS_EN: HintTierItem[] = [
  {
    tier: 1,
    label: 'Concept: Quadratic Roots',
    content_md:
      'Recall that any quadratic equation of the form $x^2 = k$ (where $k > 0$) has **two distinct real roots**: $+\\sqrt{k}$ and $-\\sqrt{k}$.',
  },
  {
    tier: 2,
    label: 'Setup: Find All Possible Values for x',
    content_md:
      'Solve $x^2 = 16$. This gives two solutions: $x = +4$ or $x = -4$. Both satisfy the condition.',
  },
  {
    tier: 3,
    label: 'Bridge: Compare Across Both Cases',
    content_md:
      'Case 1: If $x = 4$, then Quantity A ($4$) > Quantity B ($0$). Case 2: If $x = -4$, then Quantity B ($0$) > Quantity A ($-4$). Because the comparison yields opposite results depending on the root, the answer must be **(D)**.',
  },
];

const SEEDED_QC_HINTS_BN: HintTierItem[] = [
  {
    tier: 1,
    label: 'ধারণা: দ্বিঘাত সমীকরণের মূল',
    content_md:
      'মনে রাখুন, $x^2 = k$ (যেখানে $k > 0$) আকারের যেকোনো দ্বিঘাত সমীকরণের **দুটি ভিন্ন বাস্তব মূল** থাকে: $+\\sqrt{k}$ এবং $-\\sqrt{k}$।',
  },
  {
    tier: 2,
    label: 'সমীকরণ গঠন: x-এর সকল সম্ভাব্য মান নির্ণয় করুন',
    content_md:
      '$x^2 = 16$ সমাধান করলে দুটি মান পাওয়া যায়: $x = +4$ অথবা $x = -4$। উভয় মানই প্রদত্ত শর্তটি পূরণ করে।',
  },
  {
    tier: 3,
    label: 'সমাধানের সেতু: উভয় ক্ষেত্রের তুলনা করুন',
    content_md:
      'ক্ষেত্র ১: যদি $x = 4$ হয়, তবে রাশি A ($4$) > রাশি B ($0$)। ক্ষেত্র ২: যদি $x = -4$ হয়, তবে রাশি B ($0$) > রাশি A ($-4$)। যেহেতু মূলের মানের ওপর ভিত্তি করে তুলনাটি বিপরীত ফলাফল দেয়, তাই সঠিক উত্তর অবশ্যই **(D)**।',
  },
];

const TRAP_EXPLANATIONS_EN: Record<string, { tag: string; label: string; text: string }> = {
  A: {
    tag: 'positive_root_bias',
    label: 'Positive Root Bias Trap',
    text: 'You assumed $x = +4$ and concluded Quantity A is greater. In GRE Quantitative Comparison, forgetting negative roots ($x = -4$) is the single most engineered distractor trap.',
  },
  B: {
    tag: 'isolated_negative_trap',
    label: 'Isolated Negative Root Trap',
    text: 'You evaluated only $x = -4$. Remember that $x = +4$ is equally valid, which would make Quantity A strictly greater.',
  },
  C: {
    tag: 'zero_equality_trap',
    label: 'Magnitude Equality Trap',
    text: 'Quantity A ($x = \\pm 4$) is never equal to Quantity B ($0$).',
  },
};

const TRAP_EXPLANATIONS_BN: Record<string, { tag: string; label: string; text: string }> = {
  A: {
    tag: 'positive_root_bias',
    label: 'ধনাত্মক মূল পক্ষপাত ফাঁদ',
    text: 'আপনি শুধু $x = +4$ ধরে নিয়ে সিদ্ধান্ত নিয়েছেন যে রাশি A বড়। জিআরই কোয়ান্টিটেটিভ কম্প্যারিজনে ঋণাত্মক মূল ($x = -4$) ভুলে যাওয়া সবচেয়ে পরিচিত ডিস্ট্রাক্টর ফাঁদ।',
  },
  B: {
    tag: 'isolated_negative_trap',
    label: 'একক ঋণাত্মক মূল ফাঁদ',
    text: 'আপনি কেবল $x = -4$ হিসাব করেছেন। মনে রাখবেন যে $x = +4$-ও সমানভাবে প্রযোজ্য, যার ফলে রাশি A বড় হতে পারে।',
  },
  C: {
    tag: 'zero_equality_trap',
    label: 'সমতা বিভ্রান্তি ফাঁদ',
    text: 'রাশি A ($x = \\pm 4$) কখনোই রাশি B ($0$)-এর সমান হতে পারে না।',
  },
};

export interface LiveGreWidgetProps {
  locale?: 'en' | 'bn';
}

export function LiveGreWidget({ locale: propLocale }: LiveGreWidgetProps) {
  const hookLocale = useLocale();
  const locale = propLocale ?? (hookLocale === 'bn' ? 'bn' : 'en');
  const isBnLocale = locale === 'bn';

  const [showOriginalEnglish, setShowOriginalEnglish] = React.useState(false);
  const displayBn = isBnLocale && !showOriginalEnglish;

  const [selectedChoice, setSelectedChoice] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [revealedTiers, setRevealedTiers] = React.useState<number[]>([]);
  const [hintBudget, setHintBudget] = React.useState(3);

  const handleSelect = (choice: string) => {
    if (!isSubmitted) {
      setSelectedChoice(choice);
    }
  };

  const handleSubmit = () => {
    if (selectedChoice) {
      setIsSubmitted(true);
    }
  };

  const handleReset = () => {
    setSelectedChoice(null);
    setIsSubmitted(false);
    setRevealedTiers([]);
    setHintBudget(3);
  };

  const handleRevealNextHint = () => {
    const nextTier = ([1, 2, 3] as const).find((t) => !revealedTiers.includes(t));
    if (nextTier && hintBudget > 0) {
      setRevealedTiers((prev) => [...prev, nextTier]);
      setHintBudget((prev) => prev - 1);
    }
  };

  const isCorrect = selectedChoice === 'D';
  const activeHints = displayBn ? SEEDED_QC_HINTS_BN : SEEDED_QC_HINTS_EN;
  const activeTraps = displayBn ? TRAP_EXPLANATIONS_BN : TRAP_EXPLANATIONS_EN;

  const options = displayBn
    ? [
        { id: 'A', text: 'রাশি A আপনার চেয়ে বড় (Quantity A বড়)।' },
        { id: 'B', text: 'রাশি B বড়।' },
        { id: 'C', text: 'দুটি রাশি সমান।' },
        { id: 'D', text: 'প্রদত্ত তথ্য থেকে সম্পর্ক নির্ণয় করা সম্ভব নয়।' },
      ]
    : [
        { id: 'A', text: 'Quantity A is greater.' },
        { id: 'B', text: 'Quantity B is greater.' },
        { id: 'C', text: 'The two quantities are equal.' },
        { id: 'D', text: 'The relationship cannot be determined from the information given.' },
      ];

  return (
    <div className="w-full max-w-4xl bg-[var(--surface-paper)] border border-[var(--hairline)] rounded-none overflow-hidden">
      {/* Top Status Strip */}
      <div className="bg-[var(--bg-tint)] border-b border-[var(--hairline)] px-6 py-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-3">
          <span className="rounded-[4px] bg-[var(--brand)] px-2.5 py-0.5 font-mono font-bold text-white">
            {displayBn ? 'কোয়ান্টিটেটিভ কম্প্যারিজন' : 'Quantitative Comparison'}
          </span>
          <span className="text-[var(--text)] font-medium">
            {displayBn ? 'লাইভ ডেমো • লগইন প্রয়োজন নেই' : 'Live Sample • No sign-in required'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[var(--text)]">{displayBn ? 'হিন্ট বাজেট:' : 'Hint Budget:'}</span>
          <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-0.5 font-mono font-bold text-[var(--brand-ink)]">
            {displayBn ? `${hintBudget} / ৩ বাকি` : `${hintBudget} / 3 left`}
          </span>
        </div>
      </div>

      {/* Assessment Sheet Header */}
      <div className="border-b border-[var(--hairline)] px-6 py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <h3 className="lumen-h3">
          {displayBn ? 'এখনই একটি আসল জিআরই প্রশ্ন সমাধান করে দেখুন' : 'Try a Real GRE Question Right Now'}
        </h3>

        {isBnLocale && (
          <button
            type="button"
            onClick={() => setShowOriginalEnglish((prev) => !prev)}
            className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] transition-colors cursor-pointer"
          >
            <Languages className="h-3.5 w-3.5 text-[var(--brand)]" />
            <span>
              {showOriginalEnglish
                ? 'বাংলা অনুবাদ দেখুন / Show Bengali'
                : 'ইংরেজি মূল প্রশ্ন দেখুন / Show Original English'}
            </span>
          </button>
        )}
      </div>

      {/* Sheet Body */}
      <div className="px-6 py-6 space-y-6">
        {/* Question Stem */}
        <div className="text-base font-semibold text-[var(--brand-ink)] leading-relaxed">
          <MathText
            content={
              displayBn
                ? 'ধরি $x$ একটি পূর্ণসংখ্যা যেখানে $x^2 = 16$।'
                : 'Let $x$ be an integer such that $x^2 = 16$.'
            }
          />
        </div>

        {/* Classic 2-Column Quantitative Comparison Table */}
        <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-[var(--hairline)] border border-[var(--hairline)] bg-[var(--bg)] my-6">
          <div className="p-5 text-center">
            <div className="font-mono text-xs font-bold tracking-wider text-[var(--text)]">
              {displayBn ? 'রাশি A (Quantity A)' : 'Quantity A'}
            </div>
            <div className="mt-2 font-mono text-xl font-extrabold text-[var(--brand-ink)]">
              <MathText content="$x$" />
            </div>
          </div>
          <div className="p-5 text-center">
            <div className="font-mono text-xs font-bold tracking-wider text-[var(--text)]">
              {displayBn ? 'রাশি B (Quantity B)' : 'Quantity B'}
            </div>
            <div className="mt-2 font-mono text-xl font-extrabold text-[var(--brand-ink)]">
              <MathText content="$0$" />
            </div>
          </div>
        </div>

        {/* Multiple Choice Options [A]-[D] */}
        <div className="space-y-2.5" role="radiogroup" aria-label="Answer choices">
          {options.map((option) => {
            const isSelected = selectedChoice === option.id;
            const isOptionCorrect = option.id === 'D';

            let itemClass =
              'border-[var(--hairline)] bg-[var(--surface-paper)] hover:bg-[var(--bg-warm)] text-[var(--text)]';
            if (isSubmitted) {
              if (isOptionCorrect) {
                itemClass = 'border-emerald-700 bg-emerald-50/70 text-[var(--brand-ink)] font-semibold';
              } else if (isSelected) {
                itemClass = 'border-[var(--crimson)] bg-[var(--bg-tint)] text-[var(--brand-ink)]';
              } else {
                itemClass = 'border-[var(--hairline)] bg-[var(--bg)] opacity-60 text-[var(--text)]';
              }
            } else if (isSelected) {
              itemClass = 'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand-ink)] font-semibold';
            }

            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => handleSelect(option.id)}
                disabled={isSubmitted}
                className={`flex w-full items-center justify-between rounded-[4px] border p-3.5 text-left text-sm transition-colors cursor-pointer disabled:cursor-default ${itemClass}`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-[4px] border font-mono text-xs font-bold ${
                      isSelected
                        ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                        : 'border-[var(--hairline)] bg-[var(--bg)] text-[var(--brand-ink)]'
                    }`}
                  >
                    {option.id}
                  </span>
                  <span>
                    <MathText content={option.text} />
                  </span>
                </div>
                {isSubmitted && isOptionCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-700 shrink-0" />
                )}
                {isSubmitted && isSelected && !isOptionCorrect && (
                  <XCircle className="h-5 w-5 text-[var(--crimson)] shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {!isSubmitted ? (
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!selectedChoice}
              className="inline-flex items-center gap-2 rounded-[4px] bg-[var(--brand)] px-5 py-2.5 text-sm font-bold text-white hover:bg-[var(--link)] transition-colors disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed"
            >
              {displayBn ? 'উত্তর সাবমিট করুন' : 'Submit Answer'}
            </button>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-4 py-2 text-xs font-bold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] transition-colors cursor-pointer"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                {displayBn ? 'আবার চেষ্টা করুন' : 'Try Again'}
              </button>
              <Link
                href="/exam/diagnostic"
                className="inline-flex items-center gap-2 rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--link)] transition-colors"
              >
                {displayBn ? 'পূর্ণাঙ্গ ১৫-মিনিটের ডায়াগনস্টিক দিন' : 'Take Full 15-Min Diagnostic'}
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {!isSubmitted && (
            <span className="text-xs text-[var(--text)]">
              {displayBn
                ? 'আটকে গেছেন? নিচের হিন্ট তালিকা ব্যবহার করুন।'
                : 'Stuck? Reveal a progressive hint below.'}
            </span>
          )}
        </div>

        {/* Distractor Trap Forensic Feedback */}
        {isSubmitted && !isCorrect && selectedChoice && activeTraps[selectedChoice] && (
          <div className="rounded-[4px] border border-[var(--crimson)] bg-[var(--bg-tint)] p-4 text-sm">
            <div className="flex items-center gap-2 font-bold text-[var(--brand-ink)]">
              <XCircle className="h-4 w-4 text-[var(--crimson)] shrink-0" />
              <span>
                {displayBn ? 'ডিস্ট্রাক্টর ফাঁদ বিশ্লেষণ:' : 'Distractor Trap Forensic:'}{' '}
                {activeTraps[selectedChoice].label}
              </span>
            </div>
            <div className="mt-2 text-xs leading-relaxed text-[var(--text)]">
              <MathText content={activeTraps[selectedChoice].text} />
            </div>
          </div>
        )}

        {/* Success Feedback */}
        {isSubmitted && isCorrect && (
          <div className="rounded-[4px] border border-emerald-700 bg-emerald-50/70 p-4 text-sm">
            <div className="flex items-center gap-2 font-bold text-emerald-900">
              <CheckCircle2 className="h-4 w-4 text-emerald-700 shrink-0" />
              <span>
                {displayBn
                  ? 'সঠিক উত্তর! আপনি ক্লাসিক পজিটিভ রুট ফাঁদটি এড়াতে পেরেছেন।'
                  : 'Spot On! You bypassed the classic Positive Root Trap.'}
              </span>
            </div>
            <div className="mt-2 text-xs leading-relaxed text-[var(--text)]">
              <MathText
                content={
                  displayBn
                    ? 'যেহেতু $x^2 = 16$ থেকে $+4$ এবং $-4$ উভয় মানই পাওয়া যায়, তাই রাশি A কখনো রাশি B-এর চেয়ে বড় আবার কখনো ছোট হতে পারে। সুতরাং প্রদত্ত তথ্য থেকে সম্পর্ক নির্ণয় করা সম্ভব নয়।'
                    : 'Because $x^2 = 16$ yields both $+4$ and $-4$, Quantity A can be strictly greater or strictly less than Quantity B. Therefore, the relationship cannot be determined.'
                }
              />
            </div>
          </div>
        )}

        {/* Flat Hairline-Divided 3-Tier Progressive Hint List */}
        <div className="border-t border-[var(--hairline)] pt-5 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold text-[var(--brand-ink)]">
              <Lightbulb className="h-4 w-4 text-[var(--accent)]" />
              <span>
                {displayBn ? '৩-স্তরের প্রগ্রেসিভ হিন্ট' : '3-Tier Progressive Hint Ladder'}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRevealNextHint}
              disabled={hintBudget <= 0}
              className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] disabled:opacity-45 cursor-pointer disabled:cursor-not-allowed transition-colors"
            >
              {hintBudget > 0
                ? displayBn
                  ? `পরবর্তী হিন্ট দেখুন (${revealedTiers.length + 1}/৩)`
                  : `Reveal Next Hint (${revealedTiers.length + 1}/3)`
                : displayBn
                  ? 'সকল হিন্ট উন্মুক্ত'
                  : 'All Hints Revealed'}
            </button>
          </div>

          {revealedTiers.length > 0 && (
            <div className="divide-y divide-[var(--hairline)] border border-[var(--hairline)] bg-[var(--bg)]">
              {activeHints
                .filter((hint) => revealedTiers.includes(hint.tier))
                .map((hint) => (
                  <div key={hint.tier} className="p-4 text-xs space-y-1">
                    <div className="font-mono font-bold text-[var(--brand)]">
                      {displayBn ? `স্তর ${hint.tier}` : `Tier ${hint.tier}`} — {hint.label}
                    </div>
                    <div className="text-[var(--text)] leading-relaxed">
                      <MathText content={hint.content_md} />
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
