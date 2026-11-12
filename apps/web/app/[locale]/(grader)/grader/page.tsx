/** @purpose Human Grader Workstation, AI Score Override, and Append-Only Audit Log (/grader) */
'use client';

import React, { useState, useEffect } from 'react';
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
  CheckCircle2,
  AlertTriangle,
  FileText,
  RotateCw,
  Send,
  History,
  TrendingUp,
  Award,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  listGraderQueueAction,
  submitGradeOverrideAction,
  getGraderKpisAction,
  getAuditLogsAction,
} from '@/app/actions/grader';
import type { GraderQueueItem, RubricDimensions, AuditLogEntry } from '@lumen/core';

export default function GraderWorkstationPage() {
  const [queue, setQueue] = useState<GraderQueueItem[]>([]);
  const [activeItem, setActiveItem] = useState<GraderQueueItem | null>(null);
  const [kpis, setKpis] = useState<{
    totalGraded: number;
    withinHalfPointCount: number;
    agreementRatePercent: number;
    averageDelta: number;
    meetsTarget: boolean;
  } | null>(null);
  const [auditLogs, setAuditLogs] = useState<readonly AuditLogEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Rubric Dimensions (0–6 on 0.5 grid)
  const [dimensions, setDimensions] = useState<RubricDimensions>({
    position_insight: 4.0,
    support_reasoning: 4.0,
    organization_focus: 4.0,
    language_use: 4.0,
  });

  const [rationale, setRationale] = useState('');
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const [items, stats, logs] = await Promise.all([
          listGraderQueueAction(),
          getGraderKpisAction(),
          getAuditLogsAction(),
        ]);
        setQueue(items);
        if (items.length > 0) {
          const first = items[0]!;
          setActiveItem(first);
          if (first.humanEvaluation) {
            setDimensions(first.humanEvaluation.dimensions);
            setRationale(first.humanEvaluation.rationale);
          } else {
            setDimensions({ ...first.aiEvaluation.dimensions });
            setRationale('');
          }
        }
        setKpis(stats);
        setAuditLogs(logs);
      } catch {
        // Fallback
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectItem = (item: GraderQueueItem) => {
    setActiveItem(item);
    setNotification(null);
    if (item.humanEvaluation) {
      setDimensions(item.humanEvaluation.dimensions);
      setRationale(item.humanEvaluation.rationale);
    } else {
      setDimensions({ ...item.aiEvaluation.dimensions });
      setRationale('');
    }
  };

  const handleDimensionChange = (key: keyof RubricDimensions, val: number) => {
    setDimensions((prev) => ({
      ...prev,
      [key]: val,
    }));
  };

  // Human mean score rounded to 0.5 step
  const humanMeanScore =
    Math.round(
      ((dimensions.position_insight +
        dimensions.support_reasoning +
        dimensions.organization_focus +
        dimensions.language_use) /
        4) *
        2
    ) / 2;

  const aiScore = activeItem?.aiEvaluation.score ?? 4.0;
  const scoreDelta = Math.round(Math.abs(humanMeanScore - aiScore) * 10) / 10;
  const isWithinHalfPoint = scoreDelta <= 0.5;

  const handleSubmitEvaluation = async () => {
    if (!activeItem || isSubmitting) return;

    if (rationale.trim().length < 20) {
      setNotification({
        type: 'error',
        text: `Mandatory rationale required: minimum 20 characters explaining the grading decision (${rationale.trim().length}/20 provided).`,
      });
      return;
    }

    setIsSubmitting(true);
    setNotification(null);

    try {
      const result = await submitGradeOverrideAction({
        queueItemId: activeItem.id,
        dimensions,
        rationale,
      });

      // Update local state
      setActiveItem(result.queueItem);
      setQueue((prev) => prev.map((q) => (q.id === result.queueItem.id ? result.queueItem : q)));

      const [newKpis, newLogs] = await Promise.all([
        getGraderKpisAction(),
        getAuditLogsAction(),
      ]);
      setKpis(newKpis);
      setAuditLogs(newLogs);

      setNotification({
        type: 'success',
        text: `Human evaluation recorded and append-only audit event [${result.auditEntry.action}] logged successfully.`,
      });
    } catch (err: unknown) {
      setNotification({
        type: 'error',
        text: err instanceof Error ? err.message : 'Error submitting grade override.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading || !activeItem) {
    return (
      <div className="flex h-96 items-center justify-center">
        <div className="flex items-center gap-2 text-sm text-fg-muted">
          <RotateCw className="h-4 w-4 animate-spin text-accent" />
          <span>Loading Grader Workstation...</span>
        </div>
      </div>
    );
  }

  const stepsList = [0, 0.5, 1.0, 1.5, 2.0, 2.5, 3.0, 3.5, 4.0, 4.5, 5.0, 5.5, 6.0];

  return (
    <div className="space-y-6 pb-12">
      {/* Top Validation KPI Header */}
      <div className="rounded-2xl border border-control bg-surface p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-accent/15 p-1 text-accent">
                <TrendingUp className="h-4 w-4" />
              </span>
              <h2 className="text-sm font-bold text-fg">AI-Human Agreement KPI (Target &ge; 80%)</h2>
              {kpis?.meetsTarget ? (
                <Badge variant="outline" className="border-success text-success text-[10px]">
                  Target Met
                </Badge>
              ) : (
                <Badge variant="outline" className="border-warning text-warning text-[10px]">
                  Below SLA
                </Badge>
              )}
            </div>
            <p className="mt-0.5 text-xs text-fg-muted">
              Continuous validation metric tracking AI vs Human grader consensus within &plusmn;0.5 band.
            </p>
          </div>

          <div className="flex items-center gap-6 text-xs">
            <div>
              <span className="text-[11px] text-fg-muted block">Agreement Rate</span>
              <span className="text-base font-bold text-accent">
                {kpis?.agreementRatePercent ?? 100}%
              </span>
            </div>
            <div className="h-6 w-px bg-control" />
            <div>
              <span className="text-[11px] text-fg-muted block">Avg Score Delta</span>
              <span className="text-base font-bold text-fg">
                &plusmn;{kpis?.averageDelta ?? 0.0}
              </span>
            </div>
            <div className="h-6 w-px bg-control" />
            <div>
              <span className="text-[11px] text-fg-muted block">Total Graded</span>
              <span className="text-base font-bold text-fg">{kpis?.totalGraded ?? 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Queue Item Switcher */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-xs font-bold text-fg-muted shrink-0 mr-1">Queue:</span>
        {queue.map((item, idx) => {
          const isSelected = activeItem.id === item.id;
          const isGraded = item.status === 'graded';

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectItem(item)}
              className={`rounded-xl border px-3 py-1.5 text-xs text-left transition-all shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'border-accent bg-accent-soft text-accent font-bold shadow-sm'
                  : 'border-control bg-surface text-fg hover:border-control/80'
              }`}
            >
              <span>Submission #{idx + 1}</span>
              {isGraded ? (
                <Badge variant="outline" className="text-[9px] border-success text-success py-0">
                  Graded
                </Badge>
              ) : (
                <Badge variant="outline" className="text-[9px] border-warning text-warning py-0">
                  Queued
                </Badge>
              )}
            </button>
          );
        })}
      </div>

      {/* Notification Toast */}
      {notification && (
        <Callout
          type={notification.type === 'success' ? 'solution' : 'trap'}
          title={notification.type === 'success' ? 'Evaluation Submitted' : 'Action Blocked'}
        >
          {notification.text}
        </Callout>
      )}

      {/* Main Split-Pane Layout */}
      <div className="grid gap-6 lg:grid-cols-12">
        {/* Left Pane: Student Essay & AI Diagnostic (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Prompt Card */}
          <div className="rounded-2xl border border-control bg-surface p-5 space-y-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <FileText className="h-3.5 w-3.5" />
              <span>GRE Analyze an Issue Task Prompt</span>
            </span>
            <p className="text-xs font-medium text-fg leading-relaxed whitespace-pre-wrap">
              {activeItem.promptMd}
            </p>
          </div>

          {/* Student Essay Body */}
          <div className="rounded-2xl border border-control bg-surface p-5 space-y-3">
            <div className="flex items-center justify-between border-b border-control pb-2">
              <span className="text-xs font-bold text-fg">Student Essay Submission</span>
              <span className="text-[11px] text-fg-muted font-mono">{activeItem.wordCount} words</span>
            </div>
            <div className="max-h-[380px] overflow-y-auto rounded-xl bg-surface-2 p-4 text-xs leading-relaxed text-fg whitespace-pre-wrap font-serif">
              {activeItem.essayText}
            </div>
          </div>

          {/* AI Score Evaluation Breakdown */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-xs font-bold flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-accent">
                  <Sparkles className="h-4 w-4" />
                  <span>AI Baseline Evaluation</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-fg-muted">AI Composite:</span>
                  <span className="rounded-lg bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                    {activeItem.aiEvaluation.score.toFixed(1)} / 6.0
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-xs">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <div className="rounded-lg border border-control/70 bg-surface-2 p-2">
                  <span className="text-[10px] text-fg-muted block">Position & Insight</span>
                  <span className="font-bold text-fg">{activeItem.aiEvaluation.dimensions.position_insight.toFixed(1)}</span>
                </div>
                <div className="rounded-lg border border-control/70 bg-surface-2 p-2">
                  <span className="text-[10px] text-fg-muted block">Support & Reasoning</span>
                  <span className="font-bold text-fg">{activeItem.aiEvaluation.dimensions.support_reasoning.toFixed(1)}</span>
                </div>
                <div className="rounded-lg border border-control/70 bg-surface-2 p-2">
                  <span className="text-[10px] text-fg-muted block">Organization & Focus</span>
                  <span className="font-bold text-fg">{activeItem.aiEvaluation.dimensions.organization_focus.toFixed(1)}</span>
                </div>
                <div className="rounded-lg border border-control/70 bg-surface-2 p-2">
                  <span className="text-[10px] text-fg-muted block">Language Use</span>
                  <span className="font-bold text-fg">{activeItem.aiEvaluation.dimensions.language_use.toFixed(1)}</span>
                </div>
              </div>

              <div className="rounded-xl border border-control/50 bg-surface-2 p-3 text-fg-muted leading-relaxed">
                <span className="font-bold text-fg block mb-1">AI Diagnostic Feedback:</span>
                {activeItem.aiEvaluation.feedback}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Pane: Human Grader Workstation (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-accent/40 shadow-sm">
            <CardHeader className="pb-3 border-b border-control/60">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold flex items-center gap-1.5 text-fg">
                  <Award className="h-4 w-4 text-accent" />
                  <span>Human Rubric Scoring</span>
                </CardTitle>
                <Badge variant="outline" className="text-[10px] border-accent text-accent">
                  0–6 (0.5 Grid)
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-4 space-y-5 text-xs">
              {/* 4 Rubric Dimensions Sliders/Pills */}
              {(
                [
                  ['position_insight', 'Position & Insight', 'Depth of analysis and engagement with complexities'],
                  ['support_reasoning', 'Support & Reasoning', 'Persuasiveness and relevance of supporting examples'],
                  ['organization_focus', 'Organization & Focus', 'Logical progression and transitional clarity'],
                  ['language_use', 'Language & Sentence Variety', 'Lexical precision, syntax control, and mechanical accuracy'],
                ] as const
              ).map(([key, label, desc]) => (
                <div key={key} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-bold text-fg">{label}</span>
                      <p className="text-[10px] text-fg-muted">{desc}</p>
                    </div>
                    <span className="rounded-md bg-accent/15 px-2 py-0.5 text-xs font-bold text-accent">
                      {dimensions[key].toFixed(1)}
                    </span>
                  </div>

                  {/* 0.5 step selector buttons */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {stepsList.map((step) => (
                      <button
                        key={step}
                        type="button"
                        onClick={() => handleDimensionChange(key, step)}
                        className={`rounded px-1.5 py-0.5 text-[10px] font-semibold transition-all ${
                          dimensions[key] === step
                            ? 'bg-accent text-accent-fg font-bold shadow-xs'
                            : 'bg-surface-2 text-fg-muted hover:bg-surface hover:text-fg'
                        }`}
                      >
                        {step.toFixed(1)}
                      </button>
                    ))}
                  </div>
                </div>
              ))}

              {/* Composite Score & Agreement Delta Pill */}
              <div className="rounded-xl border border-control bg-surface-2 p-3.5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-fg-muted">Calculated Human Score:</span>
                  <span className="text-base font-bold text-fg">{humanMeanScore.toFixed(1)} / 6.0</span>
                </div>

                <div className="flex items-center justify-between border-t border-control/60 pt-2 text-xs">
                  <span className="text-fg-muted">AI Baseline:</span>
                  <span className="font-semibold text-fg">{aiScore.toFixed(1)}</span>
                </div>

                <div className="flex items-center justify-between border-t border-control/60 pt-2 text-xs">
                  <span className="text-fg-muted">Agreement Status:</span>
                  {isWithinHalfPoint ? (
                    <span className="rounded-md bg-success-soft px-2 py-0.5 text-[11px] font-bold text-success flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Consensus (&Delta; {scoreDelta.toFixed(1)} &le; 0.5)</span>
                    </span>
                  ) : (
                    <span className="rounded-md bg-warning-soft px-2 py-0.5 text-[11px] font-bold text-warning flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      <span>Divergence (&Delta; {scoreDelta.toFixed(1)} &gt; 0.5)</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Mandatory Rationale Box */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="override-rationale" className="text-xs font-bold text-fg flex items-center gap-1">
                    <span>Mandatory Evaluation Rationale</span>
                    <span className="text-danger">*</span>
                  </label>
                  <span
                    className={`text-[10px] ${
                      rationale.trim().length >= 20 ? 'text-success font-semibold' : 'text-danger'
                    }`}
                  >
                    {rationale.trim().length} / 20 chars min
                  </span>
                </div>
                <textarea
                  id="override-rationale"
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  placeholder="Explain rubric decisions and justify any divergence from the AI baseline (min 20 chars required)..."
                  rows={3}
                  className="w-full rounded-xl border border-control bg-surface-2 p-2.5 text-xs text-fg focus:outline-none focus:ring-2 focus:ring-accent"
                />
                <p className="text-[10px] text-fg-muted flex items-center gap-1">
                  <Info className="h-3 w-3 shrink-0" />
                  <span>Recorded permanently into the append-only audit log per D7.</span>
                </p>
              </div>

              {/* Submit Button */}
              <Button
                variant="primary"
                onClick={handleSubmitEvaluation}
                disabled={isSubmitting || rationale.trim().length < 20}
                className="w-full gap-2 font-bold"
              >
                <Send className="h-4 w-4" />
                <span>Submit Evaluation & Log Audit Event</span>
              </Button>
            </CardContent>
          </Card>

          {/* Append-Only Audit Trail Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-bold flex items-center gap-1.5 text-fg">
                <History className="h-3.5 w-3.5 text-accent" />
                <span>Recent Append-Only Audit Events (D7)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {auditLogs.length === 0 ? (
                <p className="text-[11px] text-fg-muted italic">No audit events recorded yet.</p>
              ) : (
                auditLogs.slice(-3).reverse().map((log) => (
                  <div key={log.id} className="rounded-lg border border-control bg-surface-2 p-2 space-y-1">
                    <div className="flex items-center justify-between text-[10px]">
                      <span className="font-bold uppercase tracking-wider text-accent">{log.action}</span>
                      <span className="text-fg-muted font-mono">{log.createdAt.slice(11, 19)}</span>
                    </div>
                    <p className="text-[11px] text-fg line-clamp-1">{log.reason}</p>
                    <div className="flex items-center gap-2 text-[10px] text-fg-muted">
                      <span>Actor: {log.actorId}</span>
                      <span>&bull;</span>
                      <span>Target: {log.targetId}</span>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
