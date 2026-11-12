/** @purpose Full-screen CBT exam attempt runner with section adaptivity and scoring */

import React from 'react';
import { fetchExamSectionData } from '@/app/actions/exam';
import { ExamRunnerClient } from './ExamRunnerClient';

export default async function ExamAttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string; locale: string }>;
}) {
  const { attemptId } = await params;
  const initialSectionData = await fetchExamSectionData(1);

  return (
    <React.Suspense
      fallback={
        <div className="flex h-64 items-center justify-center rounded border border-[#cccccc] bg-white p-8">
          <span className="font-mono text-sm text-[#777]">Loading exam attempt #{attemptId}...</span>
        </div>
      }
    >
      <ExamRunnerClient attemptId={attemptId} initialSectionData={initialSectionData} />
    </React.Suspense>
  );
}
