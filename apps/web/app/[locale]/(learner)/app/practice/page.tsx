/** @purpose GRE Practice Bank and custom quiz builder (/app/practice) in Pearl/Bone institutional stationery style */
import { getLocale } from 'next-intl/server';
import { Target, Sparkles, Clock, Filter, ArrowRight, Lightbulb, ShieldAlert } from 'lucide-react';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { fetchPracticeQuestions } from '@/app/actions/practice';
import type { SeedGreQuestion } from '@lumen/db';

export default async function PracticeDashboardPage() {
  const [seedQuestions, locale] = await Promise.all([
    fetchPracticeQuestions({ limit: 12 }),
    getLocale(),
  ]);
  const isBn = locale === 'bn';

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-[var(--hairline)] pb-5 md:flex-row md:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-[var(--brand)] uppercase">
            <Target className="h-4 w-4" />
            <span>{isBn ? 'অ্যাডাপ্টিভ প্র্যাকটিস ইঞ্জিন' : 'Adaptive Practice Engine'}</span>
          </div>
          <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-[var(--brand-ink)]">
            {isBn ? 'জিআরই কাস্টম অনুশীলন ও টিউটর সেশন' : 'GRE Custom Practice & Tutor Sessions'}
          </h1>
          <p className="mt-1 text-sm text-[var(--text)]">
            {isBn
              ? '৩-স্তরের হিন্ট, ডিস্ট্রাক্টর ফাঁদ বিশ্লেষণ এবং ধাপে ধাপে সমাধান সহ লক্ষ্যভিত্তিক ড্রিল।'
              : 'Targeted drills with 3-tier hints, distractor trap diagnostics, and Socratic walkthroughs.'}
          </p>
        </div>

        <LocaleLink
          href="/app/practice/session-quick-start"
          className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[4px] bg-[var(--brand)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-deep)]"
        >
          <Sparkles className="h-4 w-4" />
          <span>{isBn ? 'দ্রুত ৫-প্রশ্নের ড্রিল' : 'Quick 5-Question Drill'}</span>
        </LocaleLink>
      </div>

      {/* Practice Configuration Cards */}
      <div className="grid gap-5 md:grid-cols-3">
        {/* Tutor Mode Card */}
        <div className="flex flex-col justify-between rounded-[4px] border border-[var(--hairline)] border-t-4 border-t-[var(--brand)] bg-[var(--surface-paper)] p-5">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-[4px] border border-[var(--brand)]/25 bg-[var(--bg-tint)] px-2 py-0.5 text-xs font-semibold text-[var(--brand)]">
                {isBn ? 'প্রস্তাবিত' : 'Recommended'}
              </span>
              <Lightbulb className="h-4 w-4 text-[var(--brand)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--brand-ink)]">
              {isBn ? 'আনটাইমড টিউটর মোড' : 'Untimed Tutor Mode'}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text)]">
              {isBn
                ? '৩টি ক্রমানুসারী হিন্ট, ডিস্ট্রাক্টর ফাঁদ ব্যাখ্যা এবং দ্বিতীয়-সুযোগ পুনরায় চেষ্টাসহ নিজের গতিতে সমাধান করুন।'
                : 'Solve at your own pace with 3 progressive hints, distractor trap explanations, and Second-Chance retries.'}
            </p>
            <ul className="mt-4 space-y-2 text-xs text-[var(--brand-ink)]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-none bg-[var(--brand)]" />
                <span>{isBn ? '৩-স্তরের হিন্ট ল্যাডার ও বাজেট ট্র্যাকিং' : '3-tier hint ladder with budget tracking'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-none bg-[var(--brand)]" />
                <span>{isBn ? 'ভুল উত্তরে দ্বিতীয়-সুযোগ রিট্রাই' : 'Second-Chance retry on wrong choices'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-none bg-[var(--brand)]" />
                <span>{isBn ? 'ধাপে ধাপে সোক্রেটিক সমাধান' : '“Walk Me Through It” Socratic solver'}</span>
              </li>
            </ul>
          </div>
          <LocaleLink
            href="/app/practice/sess-tutor-all"
            className="mt-5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[4px] bg-[var(--brand)] text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-deep)]"
          >
            <span>{isBn ? 'টিউটর ড্রিল শুরু করুন' : 'Start Tutor Drill'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </LocaleLink>
        </div>

        {/* Timed Challenge Mode Card */}
        <div className="flex flex-col justify-between rounded-[4px] border border-[var(--hairline)] border-t-4 border-t-[var(--brand-deep)] bg-[var(--surface-paper)] p-5">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-ink)]">
                {isBn ? 'পরীক্ষা সিমুলেশন' : 'Exam Simulation'}
              </span>
              <Clock className="h-4 w-4 text-[var(--brand-deep)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--brand-ink)]">
              {isBn ? 'টাইমড চ্যালেঞ্জ মোড' : 'Timed Challenge Mode'}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text)]">
              {isBn
                ? 'কঠোর জিআরই সিবিটি সেকশন পেসিং (কোয়ান্ট ১মি ৩০সে, ভার্বাল ১মি ১৫সে)। হিন্ট সীমিত।'
                : 'Strict GRE CBT section pacing (1m 30s per Quant, 1m 15s per Verbal). Hints capped; no second chances.'}
            </p>
            <ul className="mt-4 space-y-2 text-xs text-[var(--brand-ink)]">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-none bg-[var(--brand-deep)]" />
                <span>{isBn ? 'সতর্কতাসহ পরীক্ষা টাইমার কাউন্টডাউন' : 'Exam timer countdown with alert'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-none bg-[var(--brand-deep)]" />
                <span>{isBn ? 'অন-স্ক্রিন ৪-ফাংশন জিআরই ক্যালকুলেটর' : 'On-screen 4-function GRE calculator'}</span>
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 shrink-0 rounded-none bg-[var(--brand-deep)]" />
                <span>{isBn ? 'ড্রিল-পরবর্তী সম্পূর্ণ ফাঁদ বিশ্লেষণ' : 'Comprehensive post-drill trap analysis'}</span>
              </li>
            </ul>
          </div>
          <LocaleLink
            href="/app/practice/sess-timed-quant"
            className="mt-5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] text-xs font-semibold text-[var(--brand-ink)] transition-colors hover:border-[var(--brand-deep)] hover:bg-[var(--brand-deep)] hover:text-white"
          >
            <span>{isBn ? 'টাইমড ড্রিল শুরু করুন' : 'Start Timed Drill'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </LocaleLink>
        </div>

        {/* Mistake Spaced Retry Queue Card */}
        <div className="flex flex-col justify-between rounded-[4px] border border-[var(--hairline)] border-t-4 border-t-[var(--accent)] bg-[var(--surface-paper)] p-5">
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="rounded-[4px] border border-[var(--accent)]/40 bg-[var(--bg-warm)] px-2 py-0.5 text-xs font-semibold text-[var(--terracotta)]">
                {isBn ? 'স্পেসড ত্রুটি কিউ' : 'Spaced Error Queue'}
              </span>
              <ShieldAlert className="h-4 w-4 text-[var(--accent)]" />
            </div>
            <h2 className="text-lg font-bold text-[var(--brand-ink)]">
              {isBn ? 'ফাঁদ বিশ্লেষণ পুনরায় চেষ্টা' : 'Trap Diagnostic Retries'}
            </h2>
            <p className="mt-1.5 text-xs leading-relaxed text-[var(--text)]">
              {isBn
                ? 'অসতর্ক গণিত, ভোকাবের ঘাটতি বা ফাঁদ উত্তরের কারণে ভুল হওয়া প্রশ্নগুলো পুনরায় সমাধান করুন।'
                : 'Re-attempt questions you missed due to Careless Math, Vocab Gaps, or Extreme Distractors on a spaced curve.'}
            </p>
            <div className="mt-4 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] p-3 text-xs">
              <div className="font-bold text-[var(--brand-ink)]">
                {isBn ? 'রিভিউয়ের জন্য ৪টি আইটেম বাকি' : '4 Items Due for Review'}
              </div>
              <div className="mt-0.5 text-[11px] text-[var(--text)]">
                {isBn
                  ? 'পরবর্তী বিরতি: ১ দিন • ৩ দিন • ৭ দিন • ২১ দিন'
                  : 'Next retry intervals: 1d • 3d • 7d • 21d'}
              </div>
            </div>
          </div>
          <LocaleLink
            href="/app/practice/sess-error-retry"
            className="mt-5 inline-flex h-9 w-full items-center justify-center gap-1.5 rounded-[4px] border border-[var(--terracotta)]/50 bg-[var(--surface-paper)] text-xs font-semibold text-[var(--terracotta)] transition-colors hover:bg-[var(--bg-warm)]"
          >
            <span>{isBn ? 'ত্রুটি লগ কিউ দেখুন' : 'Review Error Log Queue'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </LocaleLink>
        </div>
      </div>

      {/* Seed Questions Library Preview */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[var(--brand)]" />
            <h2 className="text-base font-bold text-[var(--brand-ink)]">
              {isBn ? 'কিউরেটেড জিআরই অনুশীলন প্রশ্ন' : 'Curated GRE Practice Items'}
            </h2>
          </div>
          <span className="text-xs font-semibold text-[var(--text)]">
            {isBn ? `${seedQuestions.length}টি প্রশ্ন উপলব্ধ` : `${seedQuestions.length} Items Available`}
          </span>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {seedQuestions.map((q: SeedGreQuestion, idx: number) => {
            const isQuant =
              q.questionType.startsWith('gre_q') || q.questionType.startsWith('gre_numeric');
            const diffLabel =
              q.difficultyB < -0.3 ? 'Easy' : q.difficultyB > 0.5 ? 'Hard' : 'Medium';
            const diffVariant =
              q.difficultyB < -0.3 ? 'success' : q.difficultyB > 0.5 ? 'destructive' : 'warning';

            return (
              <div
                key={q.id}
                className="flex flex-col justify-between rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-4 transition-colors hover:border-[var(--brand)]"
              >
                <div>
                  <div className="mb-2 flex items-center justify-between gap-1">
                    <span className="font-mono text-[11px] font-semibold text-[var(--text)]">
                      Item #{idx + 1}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand-ink)]">
                        {isQuant ? 'Quant' : 'Verbal'}
                      </span>
                      <span
                        className={`rounded-[4px] border px-1.5 py-0.5 text-[10px] font-semibold ${
                          diffVariant === 'success'
                            ? 'border-emerald-700/30 bg-emerald-50 text-emerald-800'
                            : diffVariant === 'destructive'
                              ? 'border-[var(--brand)]/30 bg-[var(--bg-tint)] text-[var(--brand)]'
                              : 'border-[var(--accent)]/40 bg-[var(--bg-warm)] text-[var(--terracotta)]'
                        }`}
                      >
                        {diffLabel}
                      </span>
                    </div>
                  </div>

                  <p className="line-clamp-2 text-xs leading-relaxed font-medium text-[var(--brand-ink)]">
                    {q.promptMd.replace(/\$|\n/g, ' ')}
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-1">
                    {q.hints.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--brand)]/25 bg-[var(--bg-tint)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                        <Lightbulb className="h-2.5 w-2.5" /> 3 Hints
                      </span>
                    )}
                    {Object.keys(q.choiceExplanations).length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--accent)]/30 bg-[var(--bg-warm)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--terracotta)]">
                        <ShieldAlert className="h-2.5 w-2.5" /> Trap Tags
                      </span>
                    )}
                    {q.steps.length > 0 && (
                      <span className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand-ink)]">
                        <Sparkles className="h-2.5 w-2.5" /> Socratic
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center justify-between border-t border-[var(--hairline)] pt-3">
                  <span className="text-[11px] capitalize text-[var(--text)]">
                    {q.topicSlug.replace(/-/g, ' ')}
                  </span>
                  <LocaleLink
                    href={`/app/practice/sess-item-${q.id}`}
                    className="inline-flex h-7 items-center gap-1 rounded-[4px] px-2 text-xs font-semibold text-[var(--brand)] transition-colors hover:bg-[var(--bg-tint)]"
                  >
                    <span>{isBn ? 'অনুশীলন' : 'Practice'}</span>
                    <ArrowRight className="h-3 w-3" />
                  </LocaleLink>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
