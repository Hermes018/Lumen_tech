/** @purpose GRE Custom Practice & Tutor Sessions (/app/practice) in Claude Editorial Ledger aesthetic */
import { getLocale } from 'next-intl/server';
import { GRE_MAGOOSH_SEED_QUESTIONS, type SeedGreQuestion } from '@lumen/db';
import { fetchPracticeQuestions } from '@/app/actions/practice';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { formatMathText } from '@/src/lib/format-math';
import {
  WorkspaceContainer,
  WorkspaceHeader,
  WorkspaceLedger,
  WorkspaceLedgerRow,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
} from '@/src/components/ui/WorkspacePrimitives';

export default async function PracticeDashboardPage() {
  const [seedQuestions, locale] = await Promise.all([
    fetchPracticeQuestions({ limit: 12 }).catch(() => GRE_MAGOOSH_SEED_QUESTIONS.slice(0, 12)),
    getLocale(),
  ]);
  const isBn = locale === 'bn';

  const practiceModes = [
    {
      href: '/app/practice/sess-tutor-all',
      titleEn: 'Untimed Socratic Tutor Mode',
      titleBn: 'আনটাইমড সোক্রেটিক টিউটর মোড',
      detailEn:
        '3-tier progressive hints, distractor trap diagnostics, and Second-Chance retries.',
      detailBn:
        '৩-স্তরের হিন্ট ল্যাডার, ডিস্ট্রাক্টর ফাঁদ বিশ্লেষণ এবং দ্বিতীয়-সুযোগ পুনরায় চেষ্টা।',
      ctaEn: 'Start Tutor Drill →',
      ctaBn: 'টিউটর ড্রিল শুরু →',
    },
    {
      href: '/app/practice/sess-timed-quant',
      titleEn: 'Timed Challenge Mode',
      titleBn: 'টাইমড চ্যালেঞ্জ মোড',
      detailEn:
        'Strict GRE CBT section pacing (1m 30s Quant, 1m 15s Verbal) with on-screen 4-function calculator.',
      detailBn:
        'কঠোর জিআরই সিবিটি পেসিং (কোয়ান্ট ১মি ৩০সে, ভার্বাল ১মি ১৫সে) এবং অন-স্ক্রিন ক্যালকুলেটর।',
      ctaEn: 'Start Timed Drill →',
      ctaBn: 'টাইমড ড্রিল শুরু →',
    },
    {
      href: '/app/practice/sess-error-retry',
      titleEn: 'Trap Diagnostic Retries',
      titleBn: 'ফাঁদ বিশ্লেষণ পুনরায় চেষ্টা',
      detailEn:
        'Spaced retry queue (1d · 3d · 7d · 21d) targeting careless math and vocab gaps.',
      detailBn:
        'অসতর্ক গণিত ও ভোকাবের ঘাটতি দূর করতে স্পেসড রিট্রাই কিউ (১দি · ৩দি · ৭দি · ২১দি)।',
      ctaEn: 'Review Error Queue →',
      ctaBn: 'ত্রুটি কিউ দেখুন →',
    },
  ];

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'জিআরই কাস্টম অনুশীলন ও টিউটর সেশন' : 'GRE Custom Practice & Tutor Sessions'}
        subtitle={
          isBn
            ? '৩-স্তরের হিন্ট, ডিস্ট্রাক্টর ফাঁদ বিশ্লেষণ এবং ধাপে ধাপে সোক্রেটিক সমাধানসহ লক্ষ্যভিত্তিক ড্রিল।'
            : 'Targeted drills with 3-tier hints, distractor trap diagnostics, and Socratic walkthroughs.'
        }
        primaryAction={{
          label: isBn ? 'দ্রুত ৫-প্রশ্নের ড্রিল →' : 'Quick 5-Question Drill →',
          href: '/app/practice/session-quick-start',
        }}
        secondaryAction={{
          label: isBn ? 'জিআরই ট্র্যাক খুলুন →' : 'Open GRE Track →',
          href: '/app/gre?tab=drills',
        }}
      />

      <WorkspaceStatRow
        stats={[
          {
            value: String(seedQuestions.length),
            label: isBn ? 'কিউরেটেড অনুশীলন প্রশ্ন' : 'Curated Practice Items',
          },
          {
            value: isBn ? '৩ স্তর' : '3 Tiers',
            label: isBn ? 'সোক্রেটিক হিন্ট ল্যাডার' : 'Progressive Hint Ladder',
          },
          {
            value: '1m 30s',
            label: isBn ? 'কোয়ান্ট পেসিং বেঞ্চমার্ক' : 'Quant Pacing Benchmark',
          },
          {
            value: isBn ? '৪টি বাকি' : '4 Due',
            label: isBn ? 'স্পেসড ত্রুটি কিউ আইটেম' : 'Spaced Error Retry Queue',
            href: '/app/mistakes',
            hrefLabel: isBn ? 'ভুলের খাতা →' : 'Mistake Ledger →',
          },
        ]}
      />

      <section className="mb-12">
        <WorkspaceSectionTitle
          title={isBn ? 'অনুশীলন মোড নির্বাচন' : 'Practice Session Modes'}
          subtitle={
            isBn
              ? 'আনটাইমড টিউটর গাইডেন্স বা কঠোর পরীক্ষা পেসিং থেকে বেছে নিন।'
              : 'Choose between untimed Socratic guidance or strict exam pacing.'
          }
        />

        <WorkspaceLedger>
          {practiceModes.map((mode) => (
            <WorkspaceLedgerRow
              key={mode.href}
              left={
                <div>
                  <p className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                    {isBn ? mode.titleBn : mode.titleEn}
                  </p>
                  <p className="text-xs text-[var(--text)] leading-relaxed">
                    {isBn ? mode.detailBn : mode.detailEn}
                  </p>
                </div>
              }
              right={
                <LocaleLink
                  href={mode.href}
                  className="text-sm font-medium text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)] leading-relaxed"
                >
                  {isBn ? mode.ctaBn : mode.ctaEn}
                </LocaleLink>
              }
            />
          ))}
        </WorkspaceLedger>
      </section>

      <section>
        <WorkspaceSectionTitle
          title={isBn ? 'কিউরেটেড জিআরই অনুশীলন প্রশ্ন' : 'Curated GRE Practice Items'}
          subtitle={
            isBn
              ? `${seedQuestions.length}টি প্রশ্ন অনুশীলনের জন্য প্রস্তুত`
              : `${seedQuestions.length} items ready for interactive practice`
          }
        />

        <WorkspaceLedger>
          {seedQuestions.map((q: SeedGreQuestion, idx: number) => {
            const isQuant =
              q.questionType.startsWith('gre_q') || q.questionType.startsWith('gre_numeric');
            const diffLabel =
              q.difficultyB < -0.3
                ? isBn
                  ? 'সহজ'
                  : 'Foundational'
                : q.difficultyB > 0.5
                  ? isBn
                    ? 'কঠিন'
                    : 'Hard'
                  : isBn
                    ? 'মাঝারি'
                    : 'Medium';

            return (
              <WorkspaceLedgerRow
                key={q.id}
                left={
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--text-muted)]">
                      <span className="font-mono font-semibold text-[var(--brand-deep)]">
                        #{String(idx + 1).padStart(2, '0')}
                      </span>
                      <span>·</span>
                      <span>{isQuant ? 'Quant' : 'Verbal'}</span>
                      <span>·</span>
                      <span>{diffLabel}</span>
                      <span>·</span>
                      <span className="capitalize">{q.topicSlug.replace(/-/g, ' ')}</span>
                    </div>
                    <p className="text-sm font-medium text-[var(--brand-deep)] leading-relaxed">
                      {formatMathText(q.promptMd)}
                    </p>
                  </div>
                }
                right={
                  <LocaleLink
                    href={`/app/practice/sess-item-${q.id}`}
                    className="text-sm font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
                  >
                    {isBn ? 'অনুশীলন করুন →' : 'Practice Item →'}
                  </LocaleLink>
                }
              />
            );
          })}
        </WorkspaceLedger>
      </section>
    </WorkspaceContainer>
  );
}
