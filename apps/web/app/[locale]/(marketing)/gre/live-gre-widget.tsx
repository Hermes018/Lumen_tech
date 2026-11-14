/** @purpose Interactive "Try a Live GRE Question Now" mini-widget with sharp rounded-md Swiss grid borders and EN/BN bilingual toggle (M2.8-B) */
'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { LocaleLink as Link } from '../../_components/LocaleLink';
import { Button, Card, CardHeader, CardTitle, CardContent, MathText } from '@lumen/ui';
import { HintLadder, type HintItem } from '@lumen/ui';
import { TrapDiagnostic } from '@lumen/ui';
import { CheckCircle2, XCircle, RotateCcw, ArrowRight, Languages } from 'lucide-react';

const SEEDED_QC_HINTS_EN: HintItem[] = [
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
      'Case 1: If $x = 4$, then Quantity A ($4$) > Quantity B ($0$).\n\nCase 2: If $x = -4$, then Quantity B ($0$) > Quantity A ($-4$).\n\nBecause the comparison yields opposite results depending on the root, the answer must be **(D)**.',
  },
];

const SEEDED_QC_HINTS_BN: HintItem[] = [
  {
    tier: 1,
    label: 'ধারণা (Concept): দ্বিঘাত সমীকরণের মূল',
    content_md:
      'মনে রাখুন, $x^2 = k$ (যেখানে $k > 0$) আকারের যেকোনো দ্বিঘাত সমীকরণের **দুটি ভিন্ন বাস্তব মূল** থাকে: $+\\sqrt{k}$ এবং $-\\sqrt{k}$।',
  },
  {
    tier: 2,
    label: 'সমীকরণ গঠন (Setup): x-এর সকল সম্ভাব্য মান নির্ণয় করুন',
    content_md:
      '$x^2 = 16$ সমাধান করলে দুটি মান পাওয়া যায়: $x = +4$ অথবা $x = -4$। উভয় মানই প্রদত্ত শর্তটি পূরণ করে।',
  },
  {
    tier: 3,
    label: 'সমাধানের সেতু (Bridge): উভয় ক্ষেত্রের তুলনা করুন',
    content_md:
      'ক্ষেত্র ১: যদি $x = 4$ হয়, তবে রাশি A ($4$) > রাশি B ($0$)।\n\nক্ষেত্র ২: যদি $x = -4$ হয়, তবে রাশি B ($0$) > রাশি A ($-4$)।\n\nযেহেতু মূলের মানের ওপর ভিত্তি করে তুলনাটি বিপরীত ফলাফল দেয়, তাই সঠিক উত্তর অবশ্যই **(D)**।',
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
    label: 'ধনাত্মক মূল পক্ষপাত ফাঁদ (Positive Root Bias Trap)',
    text: 'আপনি শুধু $x = +4$ ধরে নিয়ে সিদ্ধান্ত নিয়েছেন যে রাশি A বড়। জিআরই কোয়ান্টিটেটিভ কম্প্যারিজনে ঋণাত্মক মূল ($x = -4$) ভুলে যাওয়া সবচেয়ে পরিচিত ডিস্ট্রাক্টর ফাঁদ।',
  },
  B: {
    tag: 'isolated_negative_trap',
    label: 'একক ঋণাত্মক মূল ফাঁদ (Isolated Negative Root Trap)',
    text: 'আপনি কেবল $x = -4$ হিসাব করেছেন। মনে রাখবেন যে $x = +4$-ও সমানভাবে প্রযোজ্য, যার ফলে রাশি A বড় হতে পারে।',
  },
  C: {
    tag: 'zero_equality_trap',
    label: 'সমতা বিভ্রান্তি ফাঁদ (Magnitude Equality Trap)',
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
    <Card className="w-full max-w-4xl rounded-md overflow-hidden border border-slate-300 bg-white shadow-sm">
      <div className="bg-[#003057] px-6 py-3 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="rounded-md bg-[#007791] px-2.5 py-0.5 font-mono text-[11px] font-bold text-white">
            {displayBn ? 'কোয়ান্টিটেটিভ কম্প্যারিজন' : 'Quantitative Comparison'}
          </span>
          <span className="text-slate-200 font-medium">
            {displayBn
              ? 'লাইভ ডেমো • লগইন প্রয়োজন নেই'
              : 'Live Sample • No sign-in required'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-200">{displayBn ? 'হিন্ট বাজেট:' : 'Hint Budget:'}</span>
          <span className="rounded-md bg-slate-900 px-2.5 py-0.5 font-mono font-bold text-cyan-300">
            {displayBn ? `${hintBudget} / ৩ বাকি` : `${hintBudget} / 3 left`}
          </span>
        </div>
      </div>

      <CardHeader className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <CardTitle className="text-lg font-extrabold text-slate-950">
          {displayBn
            ? 'এখনই একটি আসল জিআরই প্রশ্ন সমাধান করে দেখুন'
            : 'Try a Real GRE Question Right Now'}
        </CardTitle>

        {isBnLocale && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setShowOriginalEnglish((prev) => !prev)}
            className="rounded-md gap-1.5 text-xs font-semibold border-slate-300 text-slate-900 hover:bg-slate-100"
          >
            <Languages className="h-3.5 w-3.5 text-[#007791]" />
            <span>
              {showOriginalEnglish
                ? 'বাংলা অনুবাদ দেখুন / Show Bengali'
                : 'ইংরেজি মূল প্রশ্ন দেখুন / Show Original English'}
            </span>
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Question Prompt */}
        <div className="rounded-md border border-slate-200 bg-slate-50 p-5 text-sm leading-relaxed text-slate-900">
          <div className="font-semibold text-base text-slate-950">
            <MathText
              content={
                displayBn
                  ? 'ধরি $x$ একটি পূর্ণসংখ্যা যেখানে $x^2 = 16$।'
                  : 'Let $x$ be an integer such that $x^2 = 16$.'
              }
            />
          </div>

          <div className="mt-4 rounded-md border border-slate-200 bg-white divide-y sm:divide-y-0 sm:divide-x divide-slate-200 grid grid-cols-1 sm:grid-cols-2">
            <div className="p-4 text-center">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                {displayBn ? 'রাশি A (Quantity A)' : 'Quantity A'}
              </div>
              <div className="mt-1.5 font-mono text-xl font-extrabold text-slate-950">
                <MathText content="$x$" />
              </div>
            </div>
            <div className="p-4 text-center">
              <div className="font-mono text-xs font-bold uppercase tracking-wider text-slate-500">
                {displayBn ? 'রাশি B (Quantity B)' : 'Quantity B'}
              </div>
              <div className="mt-1.5 font-mono text-xl font-extrabold text-slate-950">
                <MathText content="$0$" />
              </div>
            </div>
          </div>
        </div>

        {/* Multiple Choice Options with Rectangular Keycaps */}
        <div className="space-y-2">
          {options.map((option) => {
            const isSelected = selectedChoice === option.id;
            const isOptionCorrect = option.id === 'D';

            let itemClass = 'border-slate-200 hover:bg-slate-50 text-slate-900';
            if (isSubmitted) {
              if (isOptionCorrect) {
                itemClass = 'border-emerald-600 bg-emerald-50/70 text-slate-950 font-semibold';
              } else if (isSelected) {
                itemClass = 'border-red-600 bg-red-50/70 text-slate-950';
              } else {
                itemClass = 'border-slate-200 opacity-60 text-slate-500';
              }
            } else if (isSelected) {
              itemClass = 'border-[#003057] bg-slate-100 text-slate-950 font-semibold';
            }

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                disabled={isSubmitted}
                className={`flex w-full items-center justify-between rounded-md border p-3.5 text-left text-sm transition-colors ${itemClass}`}
              >
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-md border border-slate-300 bg-white font-mono text-xs font-bold text-slate-900">
                    {option.id}
                  </span>
                  <span>
                    <MathText content={option.text} />
                  </span>
                </div>
                {isSubmitted && isOptionCorrect && (
                  <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0" />
                )}
                {isSubmitted && isSelected && !isOptionCorrect && (
                  <XCircle className="h-5 w-5 text-red-600 shrink-0" />
                )}
              </button>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          {!isSubmitted ? (
            <Button
              onClick={handleSubmit}
              disabled={!selectedChoice}
              className="rounded-md gap-2 bg-[#003057] text-white hover:bg-[#001E42] font-bold"
              size="md"
            >
              {displayBn ? 'উত্তর সাবমিট করুন' : 'Submit Answer'}
            </Button>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                onClick={handleReset}
                variant="outline"
                size="sm"
                className="rounded-md gap-2 border-slate-300"
              >
                <RotateCcw className="h-4 w-4" />{' '}
                {displayBn ? 'আবার চেষ্টা করুন' : 'Try Again'}
              </Button>
              <Link href="/exam/diagnostic">
                <Button
                  size="sm"
                  className="rounded-md gap-2 bg-[#E4002B] text-white hover:bg-[#c80025] font-bold"
                >
                  {displayBn
                    ? 'পূর্ণাঙ্গ ১৫-মিনিটের ডায়াগনস্টিক দিন'
                    : 'Take Full 15-Min Diagnostic'}{' '}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
          )}

          {!isSubmitted && (
            <div className="text-xs text-slate-500">
              {displayBn
                ? 'আটকে গেছেন? নিচের হিন্ট ল্যাডার ব্যবহার করুন।'
                : 'Stuck? Use the Hint Ladder below without losing your attempt.'}
            </div>
          )}
        </div>

        {/* Distractor Trap Callout */}
        {isSubmitted && !isCorrect && selectedChoice && activeTraps[selectedChoice] && (
          <TrapDiagnostic
            choiceId={selectedChoice}
            trapTag={activeTraps[selectedChoice].tag}
            trapLabel={activeTraps[selectedChoice].label}
            explanationMd={activeTraps[selectedChoice].text}
          />
        )}

        {/* Success Callout */}
        {isSubmitted && isCorrect && (
          <div className="rounded-md border border-emerald-500/50 bg-emerald-50/70 p-4 text-sm text-slate-900">
            <div className="flex items-center gap-2 font-bold text-emerald-800">
              <CheckCircle2 className="h-5 w-5" />
              <span>
                {displayBn
                  ? 'সঠিক উত্তর! আপনি ক্লাসিক পজিটিভ রুট ফাঁদটি এড়াতে পেরেছেন।'
                  : 'Spot On! You bypassed the classic Positive Root Trap.'}
              </span>
            </div>
            <div className="mt-2 text-slate-700 text-xs leading-relaxed">
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

        {/* 3-Tier Progressive Hint Ladder */}
        <div className="border-t border-slate-200 pt-4">
          <HintLadder
            hints={activeHints}
            revealedTiers={revealedTiers}
            hintBudgetRemaining={hintBudget}
            totalHintBudget={3}
            onRevealNextHint={handleRevealNextHint}
            disabled={hintBudget <= 0}
          />
        </div>
      </CardContent>
    </Card>
  );
}
