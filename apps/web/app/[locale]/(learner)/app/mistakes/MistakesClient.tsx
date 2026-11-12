/** @purpose Interactive Mistake Notebook client with taxonomy filtering, retry loop, and status tracking */
'use client';

import React, { useState, useTransition } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertCircle,
  Tag,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Filter,
} from 'lucide-react';
import type { MistakeEntry, ErrorTaxonomy } from '@lumen/core';
import {
  fetchMistakesAction,
  retryMistakeAction,
  updateMistakeTaxonomyAction,
} from '@/app/actions/mistakes';

interface MistakesClientProps {
  initialMistakes: MistakeEntry[];
}

const TAXONOMY_OPTIONS: Array<{ key: ErrorTaxonomy | 'all'; label: string }> = [
  { key: 'all', label: 'All Error Types' },
  { key: 'careless_math', label: 'Careless Math' },
  { key: 'vocab_gap', label: 'Vocab Gap' },
  { key: 'concept_gap', label: 'Concept Gap' },
  { key: 'trap_answer', label: 'Trap Answer' },
  { key: 'misread_prompt', label: 'Misread Prompt' },
  { key: 'time_pressure', label: 'Time Pressure' },
];

export function MistakesClient({ initialMistakes }: MistakesClientProps) {
  const [mistakes, setMistakes] = useState<MistakeEntry[]>(initialMistakes);
  const [statusFilter, setStatusFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<ErrorTaxonomy | 'all'>('all');
  const [subjectFilter, setSubjectFilter] = useState<'all' | 'quant' | 'verbal'>('all');

  // Retry Card State
  const [activeRetryQId, setActiveRetryQId] = useState<string | null>(null);
  const [selectedRetryAnswer, setSelectedRetryAnswer] = useState<string>('');
  const [retryResult, setRetryResult] = useState<{
    isCorrect: boolean;
    resolved: boolean;
    message: string;
  } | null>(null);

  const [isPending, startTransition] = useTransition();

  const handleFilterChange = (
    newStatus: 'all' | 'open' | 'resolved',
    newCategory: ErrorTaxonomy | 'all',
    newSubject: 'all' | 'quant' | 'verbal'
  ) => {
    setStatusFilter(newStatus);
    setCategoryFilter(newCategory);
    setSubjectFilter(newSubject);

    startTransition(async () => {
      const items = await fetchMistakesAction({
        status: newStatus,
        errorCategory: newCategory,
        subject: newSubject,
      });
      setMistakes(items);
    });
  };

  const handleStartRetry = (m: MistakeEntry) => {
    setActiveRetryQId(m.questionId);
    setSelectedRetryAnswer('');
    setRetryResult(null);
  };

  const handleSubmitRetry = (m: MistakeEntry) => {
    if (!selectedRetryAnswer) return;

    startTransition(async () => {
      const res = await retryMistakeAction({
        questionId: m.questionId,
        userAnswer: selectedRetryAnswer,
        hintsUsed: 0, // solving without hints to earn resolution
      });

      setRetryResult({
        isCorrect: res.isCorrect,
        resolved: res.resolved,
        message: res.message,
      });

      if (res.entry) {
        setMistakes((prev) =>
          prev.map((item) => (item.questionId === m.questionId ? res.entry! : item))
        );
      }
    });
  };

  const handleCategoryChange = (questionId: string, cat: ErrorTaxonomy) => {
    startTransition(async () => {
      const updated = await updateMistakeTaxonomyAction({
        questionId,
        errorCategory: cat,
      });
      if (updated) {
        setMistakes((prev) =>
          prev.map((m) => (m.questionId === questionId ? updated : m))
        );
      }
    });
  };

  const openCount = mistakes.filter((m) => m.status === 'open').length;
  const resolvedCount = mistakes.filter((m) => m.status === 'resolved').length;

  return (
    <div className="space-y-8">
      {/* Header and Summary Counters */}
      <div className="flex flex-col justify-between gap-4 border-b border-[#eee] pb-6 sm:flex-row sm:items-center">
        <div>
          <div className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-800">
            <BookOpen className="h-3.5 w-3.5" />
            <span>Targeted Weakness Remediation</span>
          </div>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#111]">
            Mistake Notebook
          </h1>
          <p className="mt-1 text-xs text-[#666]">
            Review incorrect problems from practice sessions and mock tests. Solve independently
            without hints to transition items from Open to Resolved.
          </p>
        </div>

        {/* Counter Badges */}
        <div className="flex items-center gap-3">
          <div className="rounded border border-amber-200 bg-amber-50 px-3.5 py-2 text-center">
            <span className="block text-lg font-bold text-amber-900">{openCount}</span>
            <span className="text-[11px] font-medium text-amber-700">Open Items</span>
          </div>
          <div className="rounded border border-emerald-200 bg-emerald-50 px-3.5 py-2 text-center">
            <span className="block text-lg font-bold text-emerald-900">{resolvedCount}</span>
            <span className="text-[11px] font-medium text-emerald-700">Resolved</span>
          </div>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="space-y-4 rounded-lg border border-[#e5e5e5] bg-[#fafafa] p-4">
        {/* Status Tabs */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#eee] pb-3">
          <div className="flex items-center gap-1">
            {(['all', 'open', 'resolved'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => handleFilterChange(tab, categoryFilter, subjectFilter)}
                className={`rounded px-3 py-1.5 text-xs font-bold capitalize transition-colors ${
                  statusFilter === tab
                    ? 'bg-[#1a56db] text-white shadow-xs'
                    : 'text-[#555] hover:bg-[#eaeaea]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Subject Filter */}
          <div className="flex items-center gap-1 text-xs">
            <span className="font-semibold text-[#666]">Subject:</span>
            {(['all', 'quant', 'verbal'] as const).map((sub) => (
              <button
                key={sub}
                onClick={() => handleFilterChange(statusFilter, categoryFilter, sub)}
                className={`rounded px-2.5 py-1 text-xs font-semibold capitalize ${
                  subjectFilter === sub
                    ? 'bg-gray-800 text-white'
                    : 'border border-[#ddd] bg-white text-[#555] hover:bg-gray-100'
                }`}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {/* Taxonomy Categories */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <div className="flex items-center gap-1 text-xs font-semibold text-[#666] mr-2">
            <Filter className="h-3.5 w-3.5 text-[#888]" />
            <span>Error Taxonomy:</span>
          </div>
          {TAXONOMY_OPTIONS.map((opt) => (
            <button
              key={opt.key}
              onClick={() => handleFilterChange(statusFilter, opt.key, subjectFilter)}
              className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                categoryFilter === opt.key
                  ? 'bg-amber-600 text-white'
                  : 'border border-[#ddd] bg-white text-[#555] hover:bg-[#f0f0f0]'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mistake Items List */}
      {mistakes.length === 0 ? (
        <div className="rounded-lg border border-dashed border-[#ccc] p-12 text-center text-xs text-[#777]">
          <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-500" />
          <p className="mt-3 text-sm font-semibold text-[#333]">No mistakes matching filters</p>
          <p className="mt-1">
            Great job! You have no unresolved errors in this category.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {mistakes.map((m) => {
            const isOpen = m.status === 'open';
            const isRetrying = activeRetryQId === m.questionId;

            return (
              <div
                key={m.id}
                className={`rounded-lg border transition-all ${
                  isOpen
                    ? 'border-amber-200 bg-white shadow-xs'
                    : 'border-emerald-200 bg-[#fbfdfb]'
                } p-6`}
              >
                {/* Item Card Header */}
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#eee] pb-3 text-xs">
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded px-2 py-0.5 font-bold uppercase tracking-wider text-[11px] ${
                        m.subject === 'quant'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-purple-100 text-purple-900'
                      }`}
                    >
                      {m.subject}
                    </span>
                    <span className="font-mono text-[#777]">{m.topicSlug}</span>

                    {/* Taxonomy Badge */}
                    <div className="flex items-center gap-1 rounded bg-amber-100 px-2.5 py-0.5 font-semibold text-amber-900">
                      <Tag className="h-3 w-3" />
                      <span>{m.errorCategory.replace('_', ' ')}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 font-bold ${
                        isOpen
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-emerald-100 text-emerald-900'
                      }`}
                    >
                      {isOpen ? (
                        <>
                          <AlertCircle className="h-3 w-3" />
                          <span>Open</span>
                        </>
                      ) : (
                        <>
                          <CheckCircle2 className="h-3 w-3" />
                          <span>Resolved</span>
                        </>
                      )}
                    </span>
                    <span className="text-[#999]">Attempts: {m.attemptsCount}</span>
                  </div>
                </div>

                {/* Question Prompt */}
                <div className="mt-4 font-serif text-sm leading-relaxed text-[#222]">
                  {m.questionPrompt}
                </div>

                {/* Personal Notes */}
                {m.notes && (
                  <div className="mt-3 rounded border border-[#f0f0f0] bg-[#fafafa] p-3 text-xs text-[#555]">
                    <span className="font-semibold text-[#333]">Why choice was wrong: </span>
                    <span>{m.notes}</span>
                  </div>
                )}

                {/* Inline Retry Interface */}
                {isRetrying ? (
                  <div className="mt-5 rounded-lg border border-blue-200 bg-blue-50/40 p-5">
                    <div className="flex items-center justify-between text-xs font-bold text-blue-950">
                      <div className="flex items-center gap-1.5">
                        <RotateCcw className="h-3.5 w-3.5 text-blue-700" />
                        <span>Retry Problem (Solve without hints to resolve):</span>
                      </div>
                      <button
                        onClick={() => setActiveRetryQId(null)}
                        className="text-[#666] hover:text-[#111]"
                      >
                        Cancel
                      </button>
                    </div>

                    {/* Choices Radio List */}
                    {m.options && (
                      <div className="mt-3 space-y-2">
                        {m.options.map((opt, idx) => (
                          <label
                            key={opt.id}
                            className={`flex cursor-pointer items-center gap-3 rounded border p-2.5 text-xs font-serif transition-colors ${
                              selectedRetryAnswer === opt.id
                                ? 'border-[#1a56db] bg-white font-medium shadow-xs'
                                : 'border-[#ddd] bg-white/70 hover:bg-white'
                            }`}
                          >
                            <input
                              type="radio"
                              name={`retry-${m.id}`}
                              value={opt.id}
                              checked={selectedRetryAnswer === opt.id}
                              onChange={() => setSelectedRetryAnswer(opt.id)}
                              className="focus:ring-focus h-3.5 w-3.5 text-[#1a56db]"
                            />
                            <span>
                              ({String.fromCharCode(65 + idx)}) {opt.text}
                            </span>
                          </label>
                        ))}
                      </div>
                    )}

                    {/* Result message */}
                    {retryResult && (
                      <div
                        className={`mt-3 rounded border p-3 text-xs font-semibold ${
                          retryResult.resolved
                            ? 'border-emerald-300 bg-emerald-50 text-emerald-950'
                            : 'border-amber-300 bg-amber-50 text-amber-950'
                        }`}
                      >
                        {retryResult.message}
                      </div>
                    )}

                    <div className="mt-4 flex items-center justify-between border-t border-blue-100 pt-3">
                      <span className="text-[11px] text-[#777]">
                        Excluded from adaptive IRT calibration pool
                      </span>
                      <button
                        onClick={() => handleSubmitRetry(m)}
                        disabled={isPending || !selectedRetryAnswer}
                        className="rounded bg-[#1a56db] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1546b3] disabled:opacity-50"
                      >
                        {isPending ? 'Verifying Answer...' : 'Submit Retry Answer'}
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#f0f0f0] pt-4 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-[#888]">Reclassify Error:</span>
                      <select
                        value={m.errorCategory}
                        onChange={(e) =>
                          handleCategoryChange(m.questionId, e.target.value as ErrorTaxonomy)
                        }
                        className="rounded border border-[#ddd] bg-white px-2 py-1 text-xs text-[#444]"
                      >
                        <option value="careless_math">Careless Math</option>
                        <option value="vocab_gap">Vocab Gap</option>
                        <option value="concept_gap">Concept Gap</option>
                        <option value="trap_answer">Trap Answer</option>
                        <option value="misread_prompt">Misread Prompt</option>
                        <option value="time_pressure">Time Pressure</option>
                      </select>
                    </div>

                    <button
                      onClick={() => handleStartRetry(m)}
                      className={`flex items-center gap-1.5 rounded px-3.5 py-1.5 font-bold transition-colors ${
                        isOpen
                          ? 'border border-[#1a56db] bg-[#1a56db] text-white hover:bg-[#1546b3]'
                          : 'border border-[#ccc] bg-[#f9f9f9] text-[#333] hover:bg-[#eee]'
                      }`}
                    >
                      <RotateCcw className="h-3 w-3" />
                      <span>{isOpen ? 'Retry Question' : 'Practice Again'}</span>
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* IRT Calibration Invariant Notice */}
      <div className="rounded border border-[#e0e0e0] bg-[#fafafa] p-4 text-xs text-[#777]">
        <div className="flex items-center gap-1.5 font-semibold text-[#444]">
          <Sparkles className="h-3.5 w-3.5 text-blue-600" />
          <span>Pedagogical Integrity Invariant (docs/12 §P1-67):</span>
        </div>
        <p className="mt-1">
          Mistake Notebook retries carry <code>exclude_from_irt: true</code>. Solving a mistake does
          not artificially lower the item difficulty <code>b</code> parameter in the adaptive pool.
        </p>
      </div>
    </div>
  );
}
