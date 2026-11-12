/** @purpose Mistake Notebook page with Open/Resolved state, retry loop, and taxonomy filters */

import React from 'react';
import { fetchMistakesAction } from '@/app/actions/mistakes';
import { MistakesClient } from './MistakesClient';

export default async function MistakesPage() {
  const initialMistakes = await fetchMistakesAction();

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <React.Suspense
        fallback={
          <div className="flex h-64 items-center justify-center rounded border border-[#ddd] bg-white p-8">
            <span className="font-mono text-sm text-[#777]">Loading mistake notebook...</span>
          </div>
        }
      >
        <MistakesClient initialMistakes={initialMistakes} />
      </React.Suspense>
    </div>
  );
}
