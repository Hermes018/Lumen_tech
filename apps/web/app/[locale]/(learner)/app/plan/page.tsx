/** @purpose Adaptive Study Schedule (/app/plan) in Claude Editorial Ledger aesthetic with deterministic SSR and 6-week task ledger */
'use client';

import React, { useEffect, useState } from 'react';
import { useLocale } from 'next-intl';
import { Check } from 'lucide-react';
import {
  generateStudyPlan,
  rescheduleStudyPlan,
  type StudyPlan,
  type StudyPlanTask,
} from '@lumen/core';
import {
  getStudyPlanAction,
  rescheduleStudyPlanAction,
  toggleTaskCompletionAction,
} from '@/app/actions/study-plan';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import {
  WorkspaceContainer,
  WorkspaceHeader,
  WorkspaceLedger,
  WorkspaceLedgerRow,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
  WorkspaceTabs,
} from '@/src/components/ui/WorkspacePrimitives';

function buildDeterministicInitialPlan(): StudyPlan {
  return generateStudyPlan({
    userId: 'sandbox-scholar',
    tier: 'plus',
    startDate: '2026-11-15',
    targetExamDate: '2026-12-27',
    targetScores: { quant: 167, verbal: 161 },
    estimatedScores: { quant: 161, verbal: 154 },
    weakTopics: ['algebra-inequalities', 'data-interpretation', 'text-completion-double'],
    dueVocabCount: 30,
  });
}

function getTaskHref(type: StudyPlanTask['type']): string {
  switch (type) {
    case 'quant_practice':
    case 'verbal_practice':
      return '/app/gre?tab=drills';
    case 'vocab_review':
      return '/app/vocab/play?mode=flip';
    case 'mistake_retry':
      return '/app/mistakes';
    case 'sectional_mock':
    case 'full_cbt_mock':
      return '/exam/diagnostic';
    default:
      return '/app/practice';
  }
}

export default function StudyPlanPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [plan, setPlan] = useState<StudyPlan>(() => buildDeterministicInitialPlan());
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [isRescheduling, setIsRescheduling] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    getStudyPlanAction()
      .then((serverPlan) => {
        if (active) setPlan(serverPlan);
      })
      .catch(() => {
        // Keep deterministic sandbox schedule when unauthenticated
      });
    return () => {
      active = false;
    };
  }, []);

  const handleToggleTask = async (taskId: string) => {
    setPlan((prev) => {
      const updatedTasks = prev.tasks.map((task) =>
        task.id === taskId
          ? {
              ...task,
              status: (task.status === 'completed' ? 'pending' : 'completed') as
                | 'completed'
                | 'pending',
            }
          : task,
      );
      const completed = updatedTasks.filter((t) => t.status === 'completed').length;
      const completionRatePercent = Math.round((completed / Math.max(1, updatedTasks.length)) * 100);
      return { ...prev, tasks: updatedTasks, completionRatePercent };
    });

    try {
      const updated = await toggleTaskCompletionAction(taskId);
      setPlan(updated);
    } catch {
      // Optimistic toggle already applied for sandbox mode
    }
  };

  const handleAdaptiveReschedule = async () => {
    setIsRescheduling(true);
    setFeedback(null);
    try {
      const result = await rescheduleStudyPlanAction();
      setPlan(result.plan);
      setFeedback(result.message);
    } catch {
      const result = rescheduleStudyPlan(plan);
      setPlan(result.plan);
      setFeedback(result.message);
    } finally {
      setIsRescheduling(false);
    }
  };

  const completedCount = plan.tasks.filter((t) => t.status === 'completed').length;
  const missedCount = plan.tasks.filter((t) => t.status === 'missed').length;
  const weekTasks = plan.tasks.filter((t) => t.weekNumber === selectedWeek);

  const weekTabs = Array.from({ length: plan.totalWeeks }, (_, idx) => {
    const weekNum = idx + 1;
    const count = plan.tasks.filter(
      (t) => t.weekNumber === weekNum && t.status === 'completed',
    ).length;
    return {
      id: `week-${weekNum}`,
      label: isBn ? `সপ্তাহ ${weekNum}` : `Week ${weekNum}`,
      count,
    };
  });

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'অ্যাডাপ্টিভ স্টাডি শিডিউল' : 'Adaptive Study Schedule'}
        subtitle={
          isBn
            ? `লক্ষ্য পরীক্ষার তারিখ ${plan.targetExamDate}-এর জন্য জিআরই ও আইইএলটিএস-এর ৬-সপ্তাহের ভারসাম্যপূর্ণ রোডম্যাপ।`
            : `6-week balanced roadmap calibrated for your target exam date (${plan.targetExamDate}).`
        }
        metaText={feedback ?? undefined}
        primaryAction={{
          label: isRescheduling
            ? isBn
              ? 'পুনর্বিন্যাস হচ্ছে...'
              : 'Re-balancing...'
            : isBn
              ? 'অ্যাডাপ্টিভ রিসিডিউল'
              : 'Adaptive Reschedule',
          onClick: () => {
            void handleAdaptiveReschedule();
          },
        }}
        secondaryAction={{
          label: isBn ? 'জিআরই ট্র্যাক খুলুন →' : 'Open GRE Track →',
          href: '/app/gre',
        }}
      />

      <WorkspaceStatRow
        stats={[
          {
            value: '325+ / Band 8.0',
            label: isBn
              ? `লক্ষ্য: Q${plan.targetScores.quant} / V${plan.targetScores.verbal}`
              : `Target: Q${plan.targetScores.quant} / V${plan.targetScores.verbal}`,
          },
          {
            value: '315 / Band 7.5',
            label: isBn
              ? `বর্তমান অনুমান: Q${plan.currentEstimatedScores.quant} / V${plan.currentEstimatedScores.verbal}`
              : `Current: Q${plan.currentEstimatedScores.quant} / V${plan.currentEstimatedScores.verbal}`,
          },
          {
            value: `${completedCount} / ${plan.tasks.length}`,
            label: isBn
              ? `সম্পন্ন কাজ (${plan.completionRatePercent}%)`
              : `Tasks Completed (${plan.completionRatePercent}%)`,
          },
          {
            value: isBn ? `${missedCount} মিসড` : `${missedCount} Missed`,
            label: isBn
              ? `${plan.adaptiveReschedulesUsed}টি অ্যাডাপ্টিভ রিসিডিউল`
              : `${plan.adaptiveReschedulesUsed} adaptive re-balances`,
          },
        ]}
      />

      <WorkspaceTabs
        tabs={weekTabs}
        activeTab={`week-${selectedWeek}`}
        onSelect={(id) => setSelectedWeek(Number(id.replace('week-', '')) || 1)}
      />

      <section className="mb-12">
        <WorkspaceSectionTitle
          title={
            isBn
              ? `সপ্তাহ ${selectedWeek}-এর দৈনিক মাইলফলক`
              : `Week ${selectedWeek} Daily Milestones`
          }
          subtitle={
            isBn
              ? 'সম্পন্ন হিসেবে চিহ্নিত করতে বাম পাশের চেকবক্সে ক্লিক করুন।'
              : 'Toggle completion checkboxes or open the linked practice workbench.'
          }
        />

        <WorkspaceLedger>
          {weekTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isMissed = task.status === 'missed';

            return (
              <WorkspaceLedgerRow
                key={task.id}
                left={
                  <div className="flex items-start gap-3.5">
                    <button
                      type="button"
                      role="checkbox"
                      aria-checked={isDone}
                      aria-label={task.title}
                      onClick={() => {
                        void handleToggleTask(task.id);
                      }}
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
                        {task.title}
                      </p>
                      <p className="text-xs text-[var(--text)] leading-relaxed">
                        {task.description}
                      </p>
                    </div>
                  </div>
                }
                right={
                  <>
                    {isMissed ? (
                      <span className="text-xs font-semibold text-[var(--brand)]">
                        {isBn ? 'মিসড' : 'Missed'}
                      </span>
                    ) : null}
                    <span className="font-mono text-xs text-[var(--text-muted)]">
                      {task.dateStr} · {task.estimatedMinutes}m
                    </span>
                    <LocaleLink
                      href={getTaskHref(task.type)}
                      className="text-sm font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
                    >
                      {isBn ? 'কাজ খুলুন →' : 'Open Task →'}
                    </LocaleLink>
                  </>
                }
              />
            );
          })}
        </WorkspaceLedger>
      </section>

      <section>
        <WorkspaceSectionTitle
          title={
            isBn
              ? 'পরিকল্পনায় অগ্রাধিকারপ্রাপ্ত দুর্বল বিষয়'
              : 'Targeted Weak Areas Driving This Schedule'
          }
        />
        <WorkspaceLedger>
          {plan.weakTopics.map((topic) => (
            <WorkspaceLedgerRow
              key={topic}
              left={
                <div>
                  <p className="text-sm font-semibold capitalize text-[var(--brand-deep)] leading-relaxed">
                    {topic.replace(/-/g, ' ')}
                  </p>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {isBn
                      ? 'সোক্রেটিক সমাধান ও হিন্ট-মুক্ত পুনরায় চেষ্টার জন্য নির্ধারিত।'
                      : 'Scheduled for Socratic walkthroughs and hint-free Mistake Ledger retries.'}
                  </p>
                </div>
              }
              right={
                <LocaleLink
                  href="/app/gre?tab=drills"
                  className="text-sm font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
                >
                  {isBn ? 'বিষয় অনুশীলন করুন →' : 'Practice Topic →'}
                </LocaleLink>
              }
            />
          ))}
        </WorkspaceLedger>
      </section>
    </WorkspaceContainer>
  );
}
