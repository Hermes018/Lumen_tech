/** @purpose Full-screen IELTS CBT 4-Skill Mock Attempt Runner Page */

import React from 'react';
import { fetchIeltsMockExamData } from '@/app/actions/ielts';
import { IeltsMockRunnerClient } from './IeltsMockRunnerClient';

export default async function IeltsExamAttemptPage({
  params,
  searchParams,
}: {
  params: Promise<{ attemptId: string; locale: string }>;
  searchParams?: Promise<{ track?: string }>;
}) {
  const { attemptId } = await params;
  const sParams = searchParams ? await searchParams : {};
  const track = sParams.track === 'ielts_gt' ? 'ielts_gt' : 'ielts_academic';

  const initialData = await fetchIeltsMockExamData(attemptId, track);

  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded border border-border bg-card p-8">
          <span className="font-mono text-sm text-muted-foreground">
            Loading IELTS CBT Attempt #{attemptId}...
          </span>
        </div>
      }
    >
      <IeltsMockRunnerClient initialData={initialData} />
    </React.Suspense>
  );
}
