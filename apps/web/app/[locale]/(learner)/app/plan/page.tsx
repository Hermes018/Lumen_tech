/** @purpose Grounded GRE Personalized Study Plan (/app/plan) with adaptive rescheduling */
'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Button,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
  Callout,
} from '@lumen/ui';
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
import type { StudyPlan, StudyPlanTask } from '@lumen/core';

export default function StudyPlanPage() {
  const [plan, setPlan] = useState<StudyPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadPlan() {
      try {
        const data = await getStudyPlanAction();
        setPlan(data);
      } catch {
        // Fallback
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
      // Toggle error
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
    } catch (err: unknown) {
      setFeedbackMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Could not reschedule tasks.',
      });
    } finally {
      setIsRescheduling(false);
    }
  };

  if (isLoading || !plan) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <RotateCw className="h-4 w-4 animate-spin text-accent" />
          <span>Generating your personalized GRE study roadmap...</span>
        </div>
      </div>
    );
  }

  const isAdaptiveAllowed = plan.tier === 'plus' || plan.tier === 'live' || plan.tier === 'mentor';
  const filteredTasks = plan.tasks.filter((t) => t.weekNumber === selectedWeek);
  const completedCount = plan.tasks.filter((t) => t.status === 'completed').length;
  const missedCount = plan.tasks.filter((t) => t.status === 'missed').length;

  const getTaskIcon = (type: StudyPlanTask['type']) => {
    switch (type) {
      case 'quant_practice':
        return <Brain className="h-4 w-4 text-accent" />;
      case 'verbal_practice':
        return <BookOpen className="h-4 w-4 text-info" />;
      case 'vocab_review':
        return <Sparkles className="h-4 w-4 text-warning" />;
      case 'mistake_retry':
        return <RotateCw className="h-4 w-4 text-danger" />;
      case 'sectional_mock':
      case 'full_cbt_mock':
        return <Target className="h-4 w-4 text-accent" />;
      default:
        return <BookOpen className="h-4 w-4 text-fg-muted" />;
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12">
      {/* Top Header Card */}
      <div className="rounded-2xl border border-control bg-surface p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-accent/15 p-1.5 text-accent">
                <Calendar className="h-5 w-5" />
              </span>
              <h1 className="text-xl font-bold tracking-tight text-fg">Adaptive GRE Study Plan</h1>
              <Badge variant="outline" className="border-accent text-accent font-semibold uppercase text-[10px]">
                {plan.tier} Tier
              </Badge>
            </div>
            <p className="mt-1 text-xs text-fg-muted">
              Dynamically balanced for your target exam date on{' '}
              <strong className="text-fg">{plan.targetExamDate}</strong> based on current diagnostic scores and mistake patterns.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant={isAdaptiveAllowed ? 'primary' : 'outline'}
              size="sm"
              onClick={handleAdaptiveReschedule}
              disabled={isRescheduling || !isAdaptiveAllowed}
              className="gap-2"
            >
              <RotateCw className={`h-4 w-4 ${isRescheduling ? 'animate-spin' : ''}`} />
              <span>Adaptive Reschedule</span>
            </Button>
          </div>
        </div>

        {/* Feedback Alert */}
        {feedbackMessage && (
          <div className="mt-4">
            <Callout
              type={feedbackMessage.type === 'success' ? 'solution' : 'trap'}
              title={feedbackMessage.type === 'success' ? 'Schedule Re-balanced' : 'Reschedule Unavailable'}
            >
              {feedbackMessage.text}
            </Callout>
          </div>
        )}

        {/* Tier Limitation Callout if on Core */}
        {!isAdaptiveAllowed && (
          <div className="mt-4 rounded-xl border border-warning/40 bg-warning-soft/30 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-warning">
              <ShieldAlert className="h-4 w-4 shrink-0" />
              <span>
                <strong>Core Tier:</strong> Study plan is in static read-only mode. Upgrade to <strong>Plus</strong> to unlock one-click Adaptive Rescheduling.
              </span>
            </div>
            <Link href="/checkout" className="text-accent font-semibold hover:underline">
              Upgrade to Plus &rarr;
            </Link>
          </div>
        )}

        {/* Metric Ribbons */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-control pt-5 sm:grid-cols-4">
          <div className="rounded-xl border border-control/70 bg-surface-2 p-3">
            <span className="text-[11px] font-semibold text-fg-muted">Target Scores</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-fg">Q{plan.targetScores.quant} / V{plan.targetScores.verbal}</span>
              <span className="text-[11px] font-semibold text-accent">328+ Total</span>
            </div>
          </div>

          <div className="rounded-xl border border-control/70 bg-surface-2 p-3">
            <span className="text-[11px] font-semibold text-fg-muted">Current Estimated</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-fg">Q{plan.currentEstimatedScores.quant} / V{plan.currentEstimatedScores.verbal}</span>
              <span className="text-[11px] font-semibold text-warning">307 Predict</span>
            </div>
          </div>

          <div className="rounded-xl border border-control/70 bg-surface-2 p-3">
            <span className="text-[11px] font-semibold text-fg-muted">Tasks Completed</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-fg">{completedCount} / {plan.tasks.length}</span>
              <span className="text-[11px] font-semibold text-fg-muted">({plan.completionRatePercent}%)</span>
            </div>
          </div>

          <div className="rounded-xl border border-control/70 bg-surface-2 p-3">
            <span className="text-[11px] font-semibold text-fg-muted">Missed / Rolled Over</span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-lg font-bold text-danger">{missedCount} tasks</span>
              {plan.adaptiveReschedulesUsed > 0 && (
                <span className="text-[10px] rounded-full bg-accent/20 px-1.5 py-0.2 text-accent font-semibold">
                  {plan.adaptiveReschedulesUsed} re-balanced
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

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
              className={`rounded-xl border px-4 py-2.5 text-xs text-left transition-all shrink-0 ${
                isSelected
                  ? 'border-accent bg-accent-soft text-accent font-bold shadow-sm'
                  : 'border-control bg-surface text-fg hover:border-control/80'
              }`}
            >
              <div className="font-semibold">Week {weekNum}</div>
              <div className="text-[10px] text-fg-muted mt-0.5">
                {weekCompleted} / {weekTasks.length} Done
              </div>
            </button>
          );
        })}
      </div>

      {/* Tasks List */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-fg">Week {selectedWeek} Daily Milestones</h2>
          <span className="text-xs text-fg-muted">Click task to toggle completion</span>
        </div>

        <div className="grid gap-3">
          {filteredTasks.map((task) => {
            const isDone = task.status === 'completed';
            const isMissed = task.status === 'missed';

            return (
              <div
                key={task.id}
                onClick={() => handleToggleTask(task.id)}
                className={`group cursor-pointer rounded-xl border p-4 transition-all flex items-start gap-4 ${
                  isDone
                    ? 'border-control/50 bg-surface/50 opacity-75'
                    : isMissed
                    ? 'border-danger/30 bg-danger-soft/20'
                    : 'border-control bg-surface hover:border-accent hover:shadow-sm'
                }`}
              >
                <div className="pt-0.5">
                  {isDone ? (
                    <CheckCircle2 className="h-5 w-5 text-accent" />
                  ) : (
                    <Circle className="h-5 w-5 text-fg-muted group-hover:text-accent transition-colors" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-surface-2 p-1 text-fg">
                      {getTaskIcon(task.type)}
                    </span>
                    <h3 className={`text-sm font-semibold ${isDone ? 'line-through text-fg-muted' : 'text-fg'}`}>
                      {task.title}
                    </h3>
                    {task.isReallocated && (
                      <Badge variant="outline" className="text-[10px] border-accent text-accent">
                        Rescheduled
                      </Badge>
                    )}
                    {isMissed && (
                      <Badge variant="outline" className="text-[10px] border-danger text-danger">
                        Missed
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-fg-muted leading-relaxed">
                    {task.description}
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-xs">
                  <div className="flex items-center gap-1 text-fg-muted">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{task.estimatedMinutes}m</span>
                  </div>
                  <span className="text-[11px] text-fg-muted font-mono">{task.dateStr}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Weak Topics Diagnostic Anchor */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-bold flex items-center gap-2">
            <Target className="h-4 w-4 text-accent" />
            <span>Targeted Weak Areas Driving This Plan</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {plan.weakTopics.map((topic) => (
              <div key={topic} className="rounded-xl border border-control bg-surface-2 p-3 text-xs">
                <span className="font-semibold text-fg capitalize">{topic.replace(/-/g, ' ')}</span>
                <p className="mt-1 text-[11px] text-fg-muted">
                  Scheduled for Socratic walkthroughs and Mistake Notebook hint-free retries.
                </p>
                <Link
                  href={`/app/practice?topic=${topic}`}
                  className="mt-2 inline-flex items-center gap-1 text-[11px] text-accent font-semibold hover:underline"
                >
                  <span>Practice Topic</span>
                  <ChevronRight className="h-3 w-3" />
                </Link>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
