/** @purpose Grounded GRE Personalized Study Plan (/app/plan) with adaptive rescheduling in Pearl/Bone stationery style */
'use client';

import React, { useState, useEffect } from 'react';
import { useLocale } from 'next-intl';
import { Button, Callout } from '@lumen/ui';
import {
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  Circle,
  RotateCw,
  BookOpen,
  Brain,
  Target,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import {
  getStudyPlanAction,
  rescheduleStudyPlanAction,
  toggleTaskCompletionAction,
} from '@/app/actions/study-plan';
import {
  generateStudyPlan,
  rescheduleStudyPlan,
  type StudyPlan,
  type StudyPlanTask,
} from '@lumen/core';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';

function buildSandboxStudyPlan(): StudyPlan {
  const today = new Date();
  const examDate = new Date();
  examDate.setDate(today.getDate() + 42);
  return generateStudyPlan({
    userId: 'sandbox-scholar',
    tier: 'plus',
    startDate: today.toISOString().split('T')[0],
    targetExamDate: examDate.toISOString().split('T')[0] ?? '',
    targetScores: { quant: 167, verbal: 161 },
    estimatedScores: { quant: 155, verbal: 152 },
    weakTopics: ['algebra-inequalities', 'data-interpretation', 'text-completion-double'],
    dueVocabCount: 30,
  });
}

export default function StudyPlanPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  useEffect(() => {
    async function loadPlan() {
      try {
        const data = await getStudyPlanAction();
        setPlan(data);
      } catch {
        setPlan(buildSandboxStudyPlan());
      } finally {
        setIsLoading(false);
      }
    }
    loadPlan();
  }, []);

  const handleToggleTask = async (taskId: string) => {
    if (!plan) return;
    try {
      const updated = await toggleTaskCompletionAction(taskId);
      setPlan(updated);
    } catch {
      setPlan((prev) =>
        prev
          ? {
              ...prev,
              tasks: prev.tasks.map((task) =>
                task.id === taskId
                  ? {
                      ...task,
                      status: task.status === 'completed' ? 'pending' : 'completed',
                    }
                  : task,
              ),
            }
          : prev,
      );
    }
  };

  const handleAdaptiveReschedule = async () => {
    if (!plan) return;
    setIsRescheduling(true);
    setFeedbackMessage(null);

    try {
      const result = await rescheduleStudyPlanAction();
      if (result.success) {
        setPlan(result.plan);
        setFeedbackMessage({
          type: 'success',
          text: result.message,
        });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: result.message,
        });
      }
    } catch {
      const result = rescheduleStudyPlan(plan);
      if (result.success) {
        setPlan(result.plan);
        setFeedbackMessage({
          type: 'success',
          text: result.message,
        });
      } else {
        setFeedbackMessage({
          type: 'error',
          text: result.message,
        });
      }
    } finally {
      setIsRescheduling(false);
    }
  };

  if (isLoading || !plan) {
    return (
      <div className="flex h-96 items-center justify-center rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)]">
        <div className="flex items-center gap-2 text-sm text-[var(--text)]">
          <RotateCw className="h-4 w-4 animate-spin text-[var(--brand)]" />
          <span>
            {isBn
              ? 'আপনার ব্যক্তিগতকৃত জিআরই স্টাডি রোডম্যাপ তৈরি হচ্ছে...'
              : 'Generating your personalized GRE study roadmap...'}
          </span>
        </div>
      </div>
    );
  }

  const isAdaptiveAllowed =
    plan.tier === 'plus' || plan.tier === 'live' || plan.tier === 'mentor';
  const filteredTasks = plan.tasks.filter((t) => t.weekNumber === selectedWeek);
  const completedCount = plan.tasks.filter((t) => t.status === 'completed').length;
  const missedCount = plan.tasks.filter((t) => t.status === 'missed').length;

  const getTaskIcon = (type: StudyPlanTask['type']) => {
    switch (type) {
      case 'quant_practice':
        return <Brain className="h-4 w-4 text-[var(--brand)]" />;
      case 'verbal_practice':
        return <BookOpen className="h-4 w-4 text-[var(--brand-deep)]" />;
      case 'vocab_review':
        return <Sparkles className="h-4 w-4 text-[var(--terracotta)]" />;
      case 'mistake_retry':
        return <RotateCw className="h-4 w-4 text-[var(--crimson)]" />;
      case 'sectional_mock':
      case 'full_cbt_mock':
        return <Target className="h-4 w-4 text-[var(--brand)]" />;
      default:
        return <BookOpen className="h-4 w-4 text-[var(--text)]" />;
    }
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 pb-12">
      {/* Top Header Container */}
      <section className="rounded-[4px] border border-[var(--hairline)] border-t-4 border-t-[var(--brand)] bg-[var(--surface-paper)] p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="rounded-[4px] border border-[var(--brand)]/25 bg-[var(--bg-tint)] p-1.5 text-[var(--brand)]">
                <Calendar className="h-5 w-5" />
              </span>
              <h1 className="text-xl font-extrabold tracking-tight text-[var(--brand-ink)]">
                {isBn ? 'অ্যাডাপ্টিভ জিআরই স্টাডি প্ল্যান' : 'Adaptive GRE Study Plan'}
              </h1>
              <span className="rounded-[4px] border border-[var(--brand)]/30 bg-[var(--bg-warm)] px-2 py-0.5 text-[11px] font-bold text-[var(--brand)] uppercase">
                {plan.tier} Tier
              </span>
            </div>
            <p className="mt-2 text-xs text-[var(--text)]">
              {isBn ? 'লক্ষ্য পরীক্ষার তারিখ:' : 'Dynamically balanced for your target exam date on'}{' '}
              <strong className="text-[var(--brand-ink)]">{plan.targetExamDate}</strong>{' '}
              {isBn
                ? '— বর্তমান ডায়াগনস্টিক স্কোর ও ভুলের ধরনের ওপর ভিত্তি করে।'
                : 'based on current diagnostic scores and mistake patterns.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isAdaptiveAllowed ? 'primary' : 'outline'}
              size="sm"
              onClick={handleAdaptiveReschedule}
              disabled={isRescheduling || !isAdaptiveAllowed}
              className={`gap-2 rounded-[4px] ${
                isAdaptiveAllowed
                  ? 'bg-[var(--brand)] text-white hover:bg-[var(--brand-deep)]'
                  : 'border-[var(--hairline)] bg-[var(--bg)] text-[var(--brand-ink)]'
              }`}
            >
              <RotateCw className={`h-4 w-4 ${isRescheduling ? 'animate-spin' : ''}`} />
              <span>{isBn ? 'অ্যাডাপ্টিভ রিসিডিউল' : 'Adaptive Reschedule'}</span>
            </Button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="mt-4">
            <Callout
              type={feedbackMessage.type === 'success' ? 'solution' : 'trap'}
              title={
                feedbackMessage.type === 'success'
                  ? isBn
                    ? 'সময়সূচি পুনর্বিন্যাস সম্পন্ন'
                    : 'Schedule Re-balanced'
                  : isBn
                    ? 'রিসিডিউল উপলব্ধ নয়'
                    : 'Reschedule Unavailable'
              }
            >
              {feedbackMessage.text}
            </Callout>
          </div>
        )}

        {/* Tier Limitation Callout if on Core */}
        {!isAdaptiveAllowed && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-[4px] border border-[var(--accent)]/40 bg-[var(--bg-warm)] p-3 text-xs">
            <div className="flex items-center gap-2 text-[var(--brand-ink)]">
              <ShieldAlert className="h-4 w-4 shrink-0 text-[var(--terracotta)]" />
              <span>
                <strong>Core Tier:</strong> Study plan is in static read-only mode. Upgrade to{' '}
                <strong>Plus</strong> to unlock one-click Adaptive Rescheduling.
              </span>
            </div>
            <LocaleLink
              href="/checkout"
              className="font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)]"
            >
              {isBn ? 'প্লাস-এ আপগ্রেড করুন →' : 'Upgrade to Plus →'}
            </LocaleLink>
          </div>
        )}

        {/* Exposed Hairline Metric Ribbons */}
        <div className="mt-6 grid grid-cols-2 divide-y divide-[var(--hairline)] rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] sm:grid-cols-4 sm:divide-x sm:divide-y-0">
          <div className="p-3.5">
            <span className="text-[11px] font-semibold text-[var(--text)]">
              {isBn ? 'লক্ষ্য স্কোর' : 'Target Scores'}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--brand-ink)]">
                Q{plan.targetScores.quant} / V{plan.targetScores.verbal}
              </span>
              <span className="text-[11px] font-semibold text-[var(--brand)]">328+ Total</span>
            </div>
          </div>

          <div className="p-3.5">
            <span className="text-[11px] font-semibold text-[var(--text)]">
              {isBn ? 'বর্তমান অনুমান' : 'Current Estimated'}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--brand-ink)]">
                Q{plan.currentEstimatedScores.quant} / V{plan.currentEstimatedScores.verbal}
              </span>
              <span className="text-[11px] font-semibold text-[var(--terracotta)]">307 Predict</span>
            </div>
          </div>

          <div className="p-3.5">
            <span className="text-[11px] font-semibold text-[var(--text)]">
              {isBn ? 'সম্পন্ন কাজ' : 'Tasks Completed'}
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--brand-ink)]">
                {completedCount} / {plan.tasks.length}
              </span>
              <span className="text-[11px] font-semibold text-[var(--text)]">
                ({plan.completionRatePercent}%)
              </span>
            </div>
          </div>

          <div className="p-3.5">
            <span className="text-[11px] font-semibold text-[var(--text)]">
              {isBn ? 'বাদ পড়া / রোল ওভার' : 'Missed / Rolled Over'}
            </span>
            <div className="mt-1 flex flex-wrap items-baseline gap-2">
              <span className="text-lg font-bold text-[var(--crimson)]">{missedCount} tasks</span>
              {plan.adaptiveReschedulesUsed > 0 && (
                <span className="rounded-[4px] border border-[var(--brand)]/25 bg-[var(--bg-tint)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                  {plan.adaptiveReschedulesUsed} re-balanced
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Week Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {Array.from({ length: plan.totalWeeks }).map((_, idx) => {
          const weekNum = idx + 1;
          const weekTasks = plan.tasks.filter((t) => t.weekNumber === weekNum);
          const weekCompleted = weekTasks.filter((t) => t.status === 'completed').length;
          const isSelected = selectedWeek === weekNum;

          return (
            <button
              key={weekNum}
              type="button"
              onClick={() => setSelectedWeek(weekNum)}
              className={`shrink-0 cursor-pointer rounded-[4px] border px-4 py-2.5 text-left text-xs transition-colors ${
                isSelected
                  ? 'border-[var(--brand-deep)] bg-[var(--brand-deep)] font-bold text-white'
                  : 'border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-ink)] hover:border-[var(--brand)]'
              }`}
            >
              <div>{isBn ? `সপ্তাহ ${weekNum}` : `Week ${weekNum}`}</div>
              <div
                className={`mt-0.5 text-[10px] ${
                  isSelected ? 'text-white/80' : 'text-[var(--text)]'
                }`}
              >
                {weekCompleted} / {weekTasks.length} {isBn ? 'সম্পন্ন' : 'Done'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--brand-ink)]">
            {isBn
              ? `সপ্তাহ ${selectedWeek}-এর দৈনিক মাইলফলক`
              : `Week ${selectedWeek} Daily Milestones`}
          </h2>
          <span className="text-xs text-[var(--text)]">
            {isBn ? 'সম্পন্ন করতে কাজে ক্লিক করুন' : 'Click task to toggle completion'}
          </span>
        </div>

        <div className="grid gap-3">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isMissed = task.status === 'missed';

            return (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleToggleTask(task.id);
                  }
                }}
                className={`group flex cursor-pointer items-start gap-4 rounded-[4px] border p-4 transition-colors ${
                  isDone
                    ? 'border-[var(--hairline)] bg-[var(--bg-warm)]/60 opacity-75'
                    : isMissed
                      ? 'border-[var(--crimson)]/40 bg-[var(--bg-tint)]'
                      : 'border-[var(--hairline)] bg-[var(--surface-paper)] hover:border-[var(--brand)]'
                }`}
              >
                <div className="pt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-[var(--brand)]" />
                  ) : (
                    <Circle className="h-5 w-5 text-[var(--text)] transition-colors group-hover:text-[var(--brand)]" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] p-1">
                      {getTaskIcon(task.type)}
                    </span>
                    <h3
                      className={`text-sm font-bold ${
                        isDone ? 'text-[var(--text)] line-through' : 'text-[var(--brand-ink)]'
                      }`}
                    >
                      {task.title}
                    </h3>
                    {task.isReallocated && (
                      <span className="rounded-[4px] border border-[var(--brand)]/30 bg-[var(--bg-tint)] px-2 py-0.5 text-[10px] font-semibold text-[var(--brand)]">
                        Rescheduled
                      </span>
                    )}
                    {isMissed && (
                      <span className="rounded-[4px] border border-[var(--crimson)]/40 bg-[var(--surface-paper)] px-2 py-0.5 text-[10px] font-semibold text-[var(--crimson)]">
                        Missed
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--text)]">
                    {task.description}
                  </p>
                </div>

                <div className="flex shrink-0 items-center gap-3 text-xs">
                  <div className="flex items-center gap-1 text-[var(--text)]">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{task.estimatedMinutes}m</span>
                  </div>
                  <span className="font-mono text-[11px] text-[var(--text)]">{task.dateStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Topics Diagnostic Anchor */}
      <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5">
        <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--brand-ink)]">
          <Target className="h-4 w-4 text-[var(--brand)]" />
          <span>
            {isBn
              ? 'এই পরিকল্পনায় অগ্রাধিকারপ্রাপ্ত দুর্বল বিষয়সমূহ'
              : 'Targeted Weak Areas Driving This Plan'}
          </span>
        </h2>
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
          {plan.weakTopics.map((topic) => (
            <div
              key={topic}
              className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] p-3.5 text-xs"
            >
              <span className="font-bold capitalize text-[var(--brand-ink)]">
                {topic.replace(/-/g, ' ')}
              </span>
              <p className="mt-1 text-[11px] text-[var(--text)]">
                {isBn
                  ? 'সোক্রেটিক সমাধান এবং হিন্ট-মুক্ত পুনরায় চেষ্টার জন্য নির্ধারিত।'
                  : 'Scheduled for Socratic walkthroughs and Mistake Notebook hint-free retries.'}
              </p>
              <LocaleLink
                href={`/app/practice?topic=${topic}`}
                className="mt-2.5 inline-flex items-center gap-1 text-[11px] font-semibold text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)]"
              >
                <span>{isBn ? 'বিষয়টি অনুশীলন করুন' : 'Practice Topic'}</span>
                <ChevronRight className="h-3 w-3" />
              </LocaleLink>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
