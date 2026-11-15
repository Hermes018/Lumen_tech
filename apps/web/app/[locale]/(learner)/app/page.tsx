/** @purpose Today's Study Desk (/app) in Claude Editorial Workspace style with borderless telemetry and interactive study ledger */
'use client';

import React, { useState } from 'react';
import { useLocale } from 'next-intl';
import { Check } from 'lucide-react';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import {
  WorkspaceContainer,
  WorkspaceFocusSheet,
  WorkspaceHeader,
  WorkspaceLedger,
  WorkspaceLedgerRow,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
} from '@/src/components/ui/WorkspacePrimitives';

interface StudyLedgerTask {
  id: string;
  titleEn: string;
  titleBn: string;
  trackEn: string;
  trackBn: string;
  durationEn: string;
  durationBn: string;
  href: string;
  defaultDone: boolean;
}

const TODAY_TASKS: StudyLedgerTask[] = [
  {
    id: 'task-quant-adaptive',
    titleEn: 'Section-Adaptive Quant Practice',
    titleBn: 'সেকশন-অ্যাডাপ্টিভ কোয়ান্ট অনুশীলন',
    trackEn: 'GRE® Quantitative · Algebra & Geometry',
    trackBn: 'জিআরই কোয়ান্টিটেটিভ · বীজগণিত ও জ্যামিতি',
    durationEn: '25 min',
    durationBn: '২৫ মিনিট',
    href: '/app/gre?tab=drills',
    defaultDone: false,
  },
  {
    id: 'task-vocab-core-1000',
    titleEn: 'GRE High-Frequency Core 1000 Review',
    titleBn: 'জিআরই হাই-ফ্রিকোয়েন্সি কোর ১০০০ রিভিউ',
    trackEn: 'FSRS Vocabulary · 45 cards due',
    trackBn: 'এফএসআরএস ভোকাবুলারি · ৪৫টি কার্ড বাকি',
    durationEn: '15 min',
    durationBn: '১৫ মিনিট',
    href: '/app/vocab/play?mode=flip',
    defaultDone: true,
  },
  {
    id: 'task-ielts-writing-t2',
    titleEn: 'IELTS Academic Writing Task 2 Rubric Lab',
    titleBn: 'আইইএলটিএস একাডেমিক রাইটিং টাস্ক ২ রুব্রিক ল্যাব',
    trackEn: 'IELTS™ Writing · Coherence & Lexical Resource',
    trackBn: 'আইইএলটিএস রাইটিং · সুসঙ্গতি ও শব্দভাণ্ডার',
    durationEn: '35 min',
    durationBn: '৩৫ মিনিট',
    href: '/app/ielts?tab=writing',
    defaultDone: false,
  },
  {
    id: 'task-mistake-retry',
    titleEn: 'Mistake Ledger Hint-Free Retry',
    titleBn: 'ভুলের খাতা হিন্ট-মুক্ত পুনরায় চেষ্টা',
    trackEn: 'Error Remediation · 2 open items',
    trackBn: 'ভুল সংশোধন · ২টি খোলা আইটেম',
    durationEn: '15 min',
    durationBn: '১৫ মিনিট',
    href: '/app/mistakes',
    defaultDone: false,
  },
];

export default function LearnerAppPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [completedIds, setCompletedIds] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const task of TODAY_TASKS) {
      initial[task.id] = task.defaultDone;
    }
    return initial;
  });

  const toggleTask = (id: string) => {
    setCompletedIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const completedCount = Object.values(completedIds).filter(Boolean).length;

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'শুভ অপরাহ্ন, আয়মান' : 'Good afternoon, Ayman'}
        subtitle={
          isBn
            ? 'সক্রিয় প্রস্তুতি ডেস্ক · লক্ষ্য পরীক্ষার তারিখ (১৫ ডিসেম্বর, ২০২৬) পর্যন্ত ৩০ দিন বাকি'
            : 'Active Preparation Desk · 30 days to target exam date (Dec 15, 2026)'
        }
        primaryAction={{
          label: isBn ? 'অ্যাডাপ্টিভ ডায়াগনস্টিক চালু করুন →' : 'Resume Adaptive Diagnostic →',
          href: '/exam/diagnostic',
        }}
        secondaryAction={{
          label: isBn ? 'স্টাডি শিডিউল দেখুন →' : 'View Study Schedule →',
          href: '/app/plan',
        }}
      />

      <WorkspaceFocusSheet
        title={
          isBn
            ? 'পরবর্তী প্রস্তাবিত সেশন: টেক্সট কমপ্লিশন ৩-শূন্যস্থান কনট্রাস্ট ড্রিল'
            : 'Next Recommended Session: Text Completion 3-Blank Contrast Drills'
        }
        body={
          isBn
            ? '১০টি ক্যালিব্রেটেড প্রশ্ন · ৩-স্তরের হিন্টসহ আনটাইমড সোক্রেটিক টিউটর মোড · আপনার ভুলের খাতার ৩টি আইটেমের ওপর ভিত্তি করে নির্ধারিত'
            : '10 calibrated items · Untimed Socratic tutor mode with 3-tier hints · Based on 3 open items in your Mistake Ledger'
        }
        meta={
          isBn
            ? 'লক্ষ্য স্কোর: জিআরই ৩২৫+ · আইইএলটিএস ব্যান্ড ৮.০'
            : 'Target Benchmark: GRE 325+ · IELTS Band 8.0'
        }
        primaryAction={{
          label: isBn ? '১২-মিনিটের ড্রিল শুরু করুন →' : 'Start 12-Minute Drill →',
          href: '/app/gre?tab=drills',
        }}
        secondaryAction={{
          label: isBn ? 'আইইএলটিএস ৪-স্কিল মক-এ যান →' : 'Switch to IELTS 4-Skill Mock →',
          href: '/app/ielts',
        }}
      />

      <WorkspaceStatRow
        stats={[
          {
            value: '315 / 340',
            label: isBn ? 'জিআরই অনুমিত স্কোর · Q161 / V154' : 'GRE Projected Score · Q161 / V154',
            href: '/app/gre',
            hrefLabel: isBn ? 'জিআরই ট্র্যাক খুলুন →' : 'Open GRE Track →',
          },
          {
            value: 'Band 7.5',
            label: isBn
              ? 'আইইএলটিএস অনুমিত · L8.0 R7.5 W7.0 S7.5'
              : 'IELTS Projected Overall · L8.0 R7.5 W7.0 S7.5',
            href: '/app/ielts',
            hrefLabel: isBn ? 'আইইএলটিএস ট্র্যাক খুলুন →' : 'Open IELTS Track →',
          },
          {
            value: isBn ? '৪৫ বাকি' : '45 Due',
            label: isBn ? 'আজকের এফএসআরএস ভোকাব কার্ড' : 'FSRS Active-Recall Cards Today',
            href: '/app/vocab',
            hrefLabel: isBn ? 'ভোকাব ডেক খুলুন →' : 'Review Cards →',
          },
          {
            value: isBn ? '২ খোলা' : '2 Open',
            label: isBn ? 'অমীমাংসিত ভুলের খাতা আইটেম' : 'Unresolved Mistake Ledger Items',
            href: '/app/mistakes',
            hrefLabel: isBn ? 'ভুল সমাধান করুন →' : 'Resolve Mistakes →',
          },
        ]}
      />

      <section>
        <WorkspaceSectionTitle
          title={isBn ? 'আজকের স্টাডি লেজার' : "Today's Study Ledger"}
          subtitle={
            isBn
              ? `${completedCount} / ${TODAY_TASKS.length} সেশন সম্পন্ন হয়েছে`
              : `${completedCount} of ${TODAY_TASKS.length} sessions completed today`
          }
          rightAction={
            <LocaleLink
              href="/app/progress"
              className="text-sm font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
            >
              {isBn ? 'স্কোর বিশ্লেষণ →' : 'Score Analytics →'}
            </LocaleLink>
          }
        />

        <WorkspaceLedger>
          {TODAY_TASKS.map((task) => {
            const isDone = Boolean(completedIds[task.id]);
            return (
              <WorkspaceLedgerRow
                key={task.id}
                left={
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isDone}
                      aria-label={isBn ? task.titleBn : task.titleEn}
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[2px] border transition-colors ${
                        isDone
                          ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                          : 'border-[var(--hairline)] bg-[var(--surface-paper)] text-transparent hover:border-[var(--brand)]'
                      }`}
                    >
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />
                    </button>
                    <div className="min-w-0">
                      <p
                        className={`text-sm font-semibold leading-relaxed ${
                          isDone
                            ? 'line-through text-[var(--text-muted)]'
                            : 'text-[var(--brand-deep)]'
                        }`}
                      >
                        {isBn ? task.titleBn : task.titleEn}
                      </p>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                        {isBn ? task.trackBn : task.trackEn}
                      </p>
                    </div>
                  </div>
                }
                right={
                  <>
                    <span className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {isBn ? task.durationBn : task.durationEn}
                    </span>
                    <LocaleLink
                      href={task.href}
                      className="text-sm font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
                    >
                      {isBn ? 'সেশন খুলুন →' : 'Open Session →'}
                    </LocaleLink>
                  </>
                }
              />
            );
          })}
        </WorkspaceLedger>
      </section>
    </WorkspaceContainer>
  );
}
