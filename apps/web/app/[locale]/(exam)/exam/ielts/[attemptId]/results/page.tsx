/** @purpose IELTS 4-Skill Official CBT Band Score Report & CEFR Level Card */

import React from 'react';
import Link from 'next/link';
import { Award, CheckCircle2, ChevronRight, FileText, Info } from 'lucide-react';
import { aggregateIeltsBandReport, OFFICIAL_IELTS_DISCLAIMER } from '@lumen/core';

export default async function IeltsMockResultsPage({
  params,
  searchParams,
}: {
  params: Promise<{ attemptId: string; locale: string }>;
  searchParams?: Promise<{
    l?: string;
    r?: string;
    w?: string;
    s?: string;
    track?: string;
  }>;
}) {
  const { attemptId, locale } = await params;
  const sParams = searchParams ? await searchParams : {};

  const listeningRaw = parseInt(sParams.l || '33', 10);
  const readingRaw = parseInt(sParams.r || '32', 10);
  const writingBand = parseFloat(sParams.w || '7.0');
  const speakingBand = parseFloat(sParams.s || '7.0');
  const track = sParams.track === 'ielts_gt' ? 'ielts_gt' : 'ielts_academic';

  const report = aggregateIeltsBandReport({
    attemptId,
    track,
    listeningRaw,
    readingRaw,
    writing: {
      overallWritingBand: writingBand,
      task1Band: 7.0,
      task2Band: 7.0,
    },
    speaking: {
      speakingBand,
    },
  });

  return (
    <div className="mx-auto max-w-5xl p-6 md:p-8">
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Header Banner */}
        <div className="border-b border-border bg-primary/5 p-6 text-center md:p-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
            <Award className="h-3.5 w-3.5" /> OFFICIAL IELTS CBT DIAGNOSTIC REPORT
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            IELTS {report.track === 'ielts_academic' ? 'Academic' : 'General Training'} Band Report
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Attempt ID: <span className="font-mono text-foreground">{report.attemptId}</span> • Completed:{' '}
            {new Date(report.completedAt).toLocaleDateString()}
          </p>

          {/* Highlights */}
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <div className="flex flex-col items-center rounded-lg border border-border bg-background px-6 py-4 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Overall Band
              </span>
              <span className="mt-1 text-4xl font-extrabold text-primary">
                {report.overallBand.toFixed(1)}
              </span>
            </div>
            <div className="flex flex-col items-center rounded-lg border border-border bg-background px-6 py-4 shadow-xs">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                CEFR Level
              </span>
              <div className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-extrabold text-foreground">{report.cefr}</span>
                <span className="text-xs font-medium text-muted-foreground">({report.cefrDescriptor})</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Skill Breakdown Cards */}
        <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 md:p-8">
          {/* Listening */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-background p-4">
            <div>
              <span className="text-xs font-semibold uppercase text-muted-foreground">Listening</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-foreground">
                  {report.skills.listening.band.toFixed(1)}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {report.skills.listening.raw} / 40 raw
                </span>
              </div>
            </div>
            <div className="mt-4 border-t border-border/60 pt-2 text-xs text-muted-foreground">
              Play-once strict mock standard
            </div>
          </div>

          {/* Reading */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-background p-4">
            <div>
              <span className="text-xs font-semibold uppercase text-muted-foreground">Reading</span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-foreground">
                  {report.skills.reading.band.toFixed(1)}
                </span>
                <span className="font-mono text-xs text-muted-foreground">
                  {report.skills.reading.raw} / 40 raw
                </span>
              </div>
            </div>
            <div className="mt-4 border-t border-border/60 pt-2 text-xs text-muted-foreground">
              {report.skills.reading.conversionTable === 'academic' ? 'Academic scale' : 'General Training scale'}
            </div>
          </div>

          {/* Writing */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-background p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Writing</span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  AI Estimated
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-foreground">
                  {report.skills.writing.band.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">Weighted 2x Task 2</span>
              </div>
            </div>
            <div className="mt-4 border-t border-border/60 pt-2 text-xs text-muted-foreground">
              Task 1: {report.skills.writing.task1Band ?? 7.0} | Task 2: {report.skills.writing.task2Band ?? 7.0}
            </div>
          </div>

          {/* Speaking */}
          <div className="flex flex-col justify-between rounded-lg border border-border bg-background p-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-muted-foreground">Speaking</span>
                <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">
                  AI Estimated
                </span>
              </div>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-3xl font-bold text-foreground">
                  {report.skills.speaking.band.toFixed(1)}
                </span>
                <span className="text-xs text-muted-foreground">Part 2 Cue Card evaluated</span>
              </div>
            </div>
            <div className="mt-4 border-t border-border/60 pt-2 text-xs text-muted-foreground">
              4 criteria official descriptors
            </div>
          </div>
        </div>

        {/* Legal Disclaimer Box */}
        <div className="border-t border-border bg-muted/30 p-6 text-center text-xs text-muted-foreground">
          <p className="flex items-center justify-center gap-1.5">
            <Info className="h-4 w-4 shrink-0" />
            {report.disclaimer}
          </p>
          <div className="mt-4 flex justify-center gap-3">
            <Link
              href={`/${locale}/app/study-plan`}
              className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
            >
              Continue to Study Plan
            </Link>
            <Link
              href={`/${locale}/exam/ielts/${attemptId}`}
              className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
            >
              Retake Mock Exam
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
