/** @purpose Mistake Notebook page with Pearl/Bone stationery framing, Open/Resolved state, retry loop, and taxonomy filters */
import React from 'react';
import { getLocale } from 'next-intl/server';
import { ArrowLeft } from 'lucide-react';
import { fetchMistakesAction } from '@/app/actions/mistakes';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { MistakesClient } from './MistakesClient';

export default async function MistakesPage() {
  const [initialMistakes, locale] = await Promise.all([fetchMistakesAction(), getLocale()]);
  const isBn = locale === 'bn';

  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
        <LocaleLink
          href="/app"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text)] transition-colors hover:text-[var(--brand)]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          <span>{isBn ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}</span>
        </LocaleLink>
        <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-2.5 py-0.5 text-xs font-semibold text-[var(--brand-ink)]">
          {isBn ? 'ত্রুটি বিশ্লেষণ' : 'Error Taxonomy Log'}
        </span>
      </div>

      <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:p-6">
        <React.Suspense
          fallback={
            <div className="flex h-64 items-center justify-center rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] p-8">
              <span className="font-mono text-sm text-[var(--text)]">
                {isBn ? 'ভুলের নোটবুক লোড হচ্ছে...' : 'Loading mistake notebook...'}
              </span>
            </div>
          }
        >
          <MistakesClient initialMistakes={initialMistakes} />
        </React.Suspense>
      </div>
    </div>
  );
}
