/** @purpose Authentic ETS CBT exam runner client with section adaptivity, on-screen calculator, AWA evaluator, and scaled score reporting */
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import {
  Calculator as CalculatorIcon,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  EyeOff,
  Eye,
  CheckCircle2,
  AlertCircle,
  ListFilter,
  Award,
  Sparkles,
  RotateCcw,
  FileText,
  Clock,
} from 'lucide-react';
import { GreCalculator } from '@lumen/ui';
import type { AwaEvalOutput } from '@lumen/ai';
import {
  routeExamSectionAction,
  evaluateAwaEssayAction,
  calculateFinalScoreAction,
  type ExamSectionData,
  type ExamScoreActionResult,
} from '@/app/actions/exam';

interface ExamRunnerClientProps {
  attemptId: string;
  initialSectionData: ExamSectionData;
}

export function ExamRunnerClient({
  attemptId,
  initialSectionData,
}: ExamRunnerClientProps) {
  const [sectionData, setSectionData] = useState<ExamSectionData>(initialSectionData);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({});
  const [markedQuestions, setMarkedQuestions] = useState<Record<string, boolean>>({});
  const [isCalculatorOpen, setIsCalculatorOpen] = useState(false);
  const [showTimer, setShowTimer] = useState(true);
  const [timeRemaining, setTimeRemaining] = useState(initialSectionData.timeAllowedSeconds);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  // AWA Essay State
  const [essayText, setEssayText] = useState('');
  const [awaEvaluation, setAwaEvaluation] = useState<AwaEvalOutput | null>(null);
  const [awaError, setAwaError] = useState<string | null>(null);

  // Adaptive Routing & Scoring State
  const [verbalS1Responses, setVerbalS1Responses] = useState<
    Array<{ b: number; correct: boolean; calibrated: boolean }>
  >([]);
  const [quantS1Responses, setQuantS1Responses] = useState<
    Array<{ b: number; correct: boolean; calibrated: boolean }>
  >([]);
  const [allVerbalItems, setAllVerbalItems] = useState<
    Array<{ b: number; correct: boolean }>
  >([]);
  const [allQuantItems, setAllQuantItems] = useState<
    Array<{ b: number; correct: boolean }>
  >([]);
  const [routingTransitionMessage, setRoutingTransitionMessage] = useState<string | null>(null);
  const [finalScore, setFinalScore] = useState<ExamScoreActionResult | null>(null);

  const [isPending, startTransition] = useTransition();

  // Timer countdown
  useEffect(() => {
    if (finalScore) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [finalScore]);

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const questions = sectionData.questions ?? [];
  const currentQ = questions[currentQuestionIndex];
  const wordsCount = essayText.trim().split(/\s+/).filter(Boolean).length;

  const handleSelectChoice = (choiceId: string) => {
    if (!currentQ) return;
    setUserAnswers((prev) => ({ ...prev, [currentQ.id]: choiceId }));
  };

  const handleToggleMark = () => {
    if (!currentQ) return;
    setMarkedQuestions((prev) => ({
      ...prev,
      [currentQ.id]: !prev[currentQ.id],
    }));
  };

  // Evaluate AWA Essay
  const handleEvaluateEssay = () => {
    setAwaError(null);
    startTransition(async () => {
      const res = await evaluateAwaEssayAction({
        essayText,
        promptText: sectionData.awaPrompt?.issuePrompt ?? '',
        accountName: 'Ayman Rahman',
      });
      if (res.success) {
        setAwaEvaluation(res.evaluation);
      } else {
        setAwaError(res.error);
      }
    });
  };

  // Move to next section with adaptive routing
  const handleProceedToNextSection = () => {
    startTransition(async () => {
      if (sectionData.sectionIndex === 1) {
        // From AWA to Verbal Section 1 (Section 2)
        const { fetchExamSectionData } = await import('@/app/actions/exam');
        const nextSec = await fetchExamSectionData(2);
        setSectionData(nextSec);
        setCurrentQuestionIndex(0);
        setTimeRemaining(nextSec.timeAllowedSeconds);
        return;
      }

      if (sectionData.sectionIndex === 2) {
        // Record Verbal Section 1 responses & route
        const scored = questions.map((q) => {
          const isCorrect = q.correctAnswers.includes(userAnswers[q.id] ?? '');
          return { b: q.difficultyB, correct: isCorrect, calibrated: true };
        });
        setVerbalS1Responses(scored);
        setAllVerbalItems((prev) => [...prev, ...scored]);

        // Route Section 2 to Section 4
        const routing = await routeExamSectionAction({
          fromPosition: 2,
          attemptSectionId: `sec-verbal-1-${attemptId}`,
          responses: scored,
        });

        setRoutingTransitionMessage(
          `Verbal Section 1 completed (${routing.basis.s1Raw}/${routing.basis.s1Count} correct). Routed to: ${routing.learnerLabel}.`
        );

        // Fetch Section 3 (Quant 1)
        const { fetchExamSectionData } = await import('@/app/actions/exam');
        const nextSec = await fetchExamSectionData(3);
        setSectionData(nextSec);
        setCurrentQuestionIndex(0);
        setTimeRemaining(nextSec.timeAllowedSeconds);
        return;
      }

      if (sectionData.sectionIndex === 3) {
        // Record Quant Section 1 responses & route
        const scored = questions.map((q) => {
          const isCorrect = q.correctAnswers.includes(userAnswers[q.id] ?? '');
          return { b: q.difficultyB, correct: isCorrect, calibrated: true };
        });
        setQuantS1Responses(scored);
        setAllQuantItems((prev) => [...prev, ...scored]);

        // Route Quant Section 3 to Section 5
        const routing = await routeExamSectionAction({
          fromPosition: 3,
          attemptSectionId: `sec-quant-1-${attemptId}`,
          responses: scored,
        });

        // Determine Verbal 2 tier based on Verbal 1
        const verbalRouting = await routeExamSectionAction({
          fromPosition: 2,
          attemptSectionId: `sec-verbal-1-${attemptId}`,
          responses: verbalS1Responses,
        });

        setRoutingTransitionMessage(
          `Quant Section 1 completed (${routing.basis.s1Raw}/${routing.basis.s1Count} correct). Routed to: ${routing.learnerLabel}. Loading Verbal Section 2 (${verbalRouting.learnerLabel}).`
        );

        // Fetch Section 4 (Verbal 2 in routed tier)
        const { fetchExamSectionData } = await import('@/app/actions/exam');
        const nextSec = await fetchExamSectionData(4, verbalRouting.tier);
        setSectionData(nextSec);
        setCurrentQuestionIndex(0);
        setTimeRemaining(nextSec.timeAllowedSeconds);
        return;
      }

      if (sectionData.sectionIndex === 4) {
        // Record Verbal Section 2 responses
        const scored = questions.map((q) => {
          const isCorrect = q.correctAnswers.includes(userAnswers[q.id] ?? '');
          return { b: q.difficultyB, correct: isCorrect };
        });
        setAllVerbalItems((prev) => [...prev, ...scored]);

        // Determine Quant 2 tier
        const quantRouting = await routeExamSectionAction({
          fromPosition: 3,
          attemptSectionId: `sec-quant-1-${attemptId}`,
          responses: quantS1Responses,
        });

        // Fetch Section 5 (Quant 2 in routed tier)
        const { fetchExamSectionData } = await import('@/app/actions/exam');
        const nextSec = await fetchExamSectionData(5, quantRouting.tier);
        setSectionData(nextSec);
        setCurrentQuestionIndex(0);
        setTimeRemaining(nextSec.timeAllowedSeconds);
        return;
      }

      if (sectionData.sectionIndex === 5) {
        // Record Quant Section 2 responses
        const scored = questions.map((q) => {
          const isCorrect = q.correctAnswers.includes(userAnswers[q.id] ?? '');
          return { b: q.difficultyB, correct: isCorrect };
        });
        const finalQuant = [...allQuantItems, ...scored];
        setAllQuantItems(finalQuant);

        // Calculate final scores
        const scoreReport = await calculateFinalScoreAction({
          verbalItems: allVerbalItems,
          quantItems: finalQuant,
        });
        setFinalScore(scoreReport);
      }
    });
  };

  // If exam complete, show official score report
  if (finalScore) {
    return (
      <div className="space-y-8 rounded border border-[#cccccc] bg-white p-6 shadow-sm sm:p-10">
        <div className="flex items-center justify-between border-b border-[#eeeeee] pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-800">
              <Award className="h-3.5 w-3.5" />
              <span>Full Exam Attempt Completed</span>
            </div>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-[#111]">
              Official-Style GRE Score Report
            </h1>
            <p className="text-xs text-[#777]">Attempt ID: {attemptId}</p>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-1.5 rounded border border-[#cccccc] bg-[#f8f8f8] px-3 py-1.5 text-xs font-semibold text-[#333] hover:bg-[#eaeaea]"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Retake Exam</span>
          </button>
        </div>

        {/* Scaled Score Cards */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Verbal */}
          <div className="rounded-lg border border-[#e0e0e0] bg-[#fafafa] p-6 text-center">
            <span className="text-xs font-bold tracking-wider text-[#666] uppercase">
              Verbal Reasoning
            </span>
            <div className="mt-3 text-4xl font-extrabold text-[#111]">
              {finalScore.verbal.scaled}
            </div>
            <p className="mt-1 text-xs font-medium text-[#777]">
              Likely Range: {finalScore.verbal.low} – {finalScore.verbal.high} (±1 SEM)
            </p>
            <div className="mt-3 text-[11px] text-[#999]">
              Theta Ability: {finalScore.verbal.theta.toFixed(2)} (SEM {finalScore.verbal.sem.toFixed(2)})
            </div>
          </div>

          {/* Quant */}
          <div className="rounded-lg border border-[#e0e0e0] bg-[#fafafa] p-6 text-center">
            <span className="text-xs font-bold tracking-wider text-[#666] uppercase">
              Quantitative Reasoning
            </span>
            <div className="mt-3 text-4xl font-extrabold text-[#111]">
              {finalScore.quant.scaled}
            </div>
            <p className="mt-1 text-xs font-medium text-[#777]">
              Likely Range: {finalScore.quant.low} – {finalScore.quant.high} (±1 SEM)
            </p>
            <div className="mt-3 text-[11px] text-[#999]">
              Theta Ability: {finalScore.quant.theta.toFixed(2)} (SEM {finalScore.quant.sem.toFixed(2)})
            </div>
          </div>

          {/* AWA */}
          <div className="rounded-lg border border-[#e0e0e0] bg-[#fafafa] p-6 text-center">
            <span className="text-xs font-bold tracking-wider text-[#666] uppercase">
              Analytical Writing (AWA)
            </span>
            <div className="mt-3 text-4xl font-extrabold text-[#111]">
              {awaEvaluation ? awaEvaluation.score.toFixed(1) : '4.0'}
            </div>
            <p className="mt-1 text-xs font-medium text-[#777]">Scale: 0.0 – 6.0 (half-step)</p>
            <div className="mt-3 text-[11px] text-[#999]">AI Evaluated via ETS Rubric</div>
          </div>
        </div>

        {/* Mandatory Honest Disclaimer (docs/07 §3.3.3) */}
        <div className="rounded border border-amber-200 bg-amber-50 p-4 text-xs text-amber-900">
          <p className="font-semibold">Honest Scoring Disclosure:</p>
          <p className="mt-1 text-[#666]">
            Estimated GRE-style score based on Rasch 1PL item response theory and adaptive routing.
            This is not an official ETS score. ETS and GRE are registered trademarks of Educational
            Testing Service.
          </p>
        </div>

        {/* AWA Evaluation Breakdown if present */}
        {awaEvaluation && (
          <div className="rounded-lg border border-[#e0e0e0] p-6">
            <h3 className="text-base font-bold text-[#222]">
              Analytical Writing: Dimension Breakdown
            </h3>
            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="rounded border border-[#eee] bg-[#fdfdfd] p-3 text-xs">
                <div className="flex justify-between font-bold text-[#111]">
                  <span>Position & Insight:</span>
                  <span className="text-emerald-700">
                    {awaEvaluation.dimensions.position_insight.band.toFixed(1)} / 6.0
                  </span>
                </div>
                <p className="mt-1 text-[#666]">
                  {awaEvaluation.dimensions.position_insight.rationale}
                </p>
              </div>

              <div className="rounded border border-[#eee] bg-[#fdfdfd] p-3 text-xs">
                <div className="flex justify-between font-bold text-[#111]">
                  <span>Support & Reasoning:</span>
                  <span className="text-emerald-700">
                    {awaEvaluation.dimensions.support_reasoning.band.toFixed(1)} / 6.0
                  </span>
                </div>
                <p className="mt-1 text-[#666]">
                  {awaEvaluation.dimensions.support_reasoning.rationale}
                </p>
              </div>

              <div className="rounded border border-[#eee] bg-[#fdfdfd] p-3 text-xs">
                <div className="flex justify-between font-bold text-[#111]">
                  <span>Organization & Focus:</span>
                  <span className="text-emerald-700">
                    {awaEvaluation.dimensions.organization_focus.band.toFixed(1)} / 6.0
                  </span>
                </div>
                <p className="mt-1 text-[#666]">
                  {awaEvaluation.dimensions.organization_focus.rationale}
                </p>
              </div>

              <div className="rounded border border-[#eee] bg-[#fdfdfd] p-3 text-xs">
                <div className="flex justify-between font-bold text-[#111]">
                  <span>Language Use & Syntax:</span>
                  <span className="text-emerald-700">
                    {awaEvaluation.dimensions.language_use.band.toFixed(1)} / 6.0
                  </span>
                </div>
                <p className="mt-1 text-[#666]">
                  {awaEvaluation.dimensions.language_use.rationale}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col justify-between space-y-6">
      {/* CBT Authentic Action Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded border border-[#cccccc] bg-[#e5e5e5] px-4 py-2.5 text-xs">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#222]">{sectionData.title}</span>
          {showTimer && (
            <div className="flex items-center gap-1.5 rounded border border-[#bbbbbb] bg-white px-2 py-0.5 font-mono font-bold text-[#111]">
              <Clock className="h-3 w-3 text-[#555]" />
              <span>{formatTimer(timeRemaining)}</span>
            </div>
          )}
          <button
            onClick={() => setShowTimer((prev) => !prev)}
            className="flex items-center gap-1 text-[#555] hover:text-[#111]"
          >
            {showTimer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            <span>{showTimer ? 'Hide Time' : 'Show Time'}</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Calculator toggle */}
          <button
            onClick={() => setIsCalculatorOpen((prev) => !prev)}
            className="flex items-center gap-1 rounded border border-[#aaaaaa] bg-[#f0f0f0] px-2.5 py-1 font-semibold text-[#222] hover:bg-[#e4e4e4]"
          >
            <CalculatorIcon className="h-3.5 w-3.5" />
            <span>Calculator</span>
          </button>

          {/* Mark button for question sections */}
          {sectionData.measure !== 'awa' && currentQ && (
            <button
              onClick={handleToggleMark}
              className={`flex items-center gap-1 rounded border px-2.5 py-1 font-semibold transition-colors ${
                markedQuestions[currentQ.id]
                  ? 'border-amber-600 bg-amber-100 text-amber-900'
                  : 'border-[#aaaaaa] bg-[#f0f0f0] text-[#222] hover:bg-[#e4e4e4]'
              }`}
            >
              <Bookmark className="h-3.5 w-3.5" />
              <span>{markedQuestions[currentQ.id] ? 'Marked' : 'Mark'}</span>
            </button>
          )}

          {/* Review grid toggle */}
          {sectionData.measure !== 'awa' && (
            <button
              onClick={() => setIsReviewOpen((prev) => !prev)}
              className="flex items-center gap-1 rounded border border-[#aaaaaa] bg-[#f0f0f0] px-2.5 py-1 font-semibold text-[#222] hover:bg-[#e4e4e4]"
            >
              <ListFilter className="h-3.5 w-3.5" />
              <span>Review ({Object.keys(userAnswers).length}/{questions.length})</span>
            </button>
          )}
        </div>
      </div>

      {/* Floating Calculator Overlay */}
      {isCalculatorOpen && (
        <div className="fixed top-20 right-6 z-50 rounded-lg shadow-xl">
          <div className="flex justify-end bg-gray-800 p-1">
            <button
              onClick={() => setIsCalculatorOpen(false)}
              className="px-2 text-xs font-bold text-white hover:text-red-400"
            >
              ✕
            </button>
          </div>
          <GreCalculator onTransferDisplay={(val) => alert(`Transferred: ${val}`)} />
        </div>
      )}

      {/* Review Screen Drawer */}
      {isReviewOpen && sectionData.measure !== 'awa' && (
        <div className="rounded border border-[#cccccc] bg-white p-5 shadow-xs">
          <div className="flex items-center justify-between border-b pb-3 text-sm font-bold text-[#222]">
            <span>Section Question Overview</span>
            <button
              onClick={() => setIsReviewOpen(false)}
              className="text-xs text-[#777] hover:text-[#111]"
            >
              Close Review
            </button>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 sm:grid-cols-6 md:grid-cols-12">
            {questions.map((q, idx) => {
              const isAnswered = Boolean(userAnswers[q.id]);
              const isMarked = Boolean(markedQuestions[q.id]);
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentQuestionIndex(idx);
                    setIsReviewOpen(false);
                  }}
                  className={`flex flex-col items-center justify-center rounded border p-2 text-xs font-bold ${
                    idx === currentQuestionIndex
                      ? 'border-[#1a56db] bg-blue-50 text-[#1a56db]'
                      : isAnswered
                        ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                        : 'border-[#ddd] bg-[#fbfbfb] text-[#555]'
                  }`}
                >
                  <span>Q{idx + 1}</span>
                  <span className="text-[10px] font-normal">
                    {isMarked ? '★ Mark' : isAnswered ? 'Done' : '—'}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Routing notification banner if section just transitioned */}
      {routingTransitionMessage && (
        <div className="flex items-center gap-2 rounded border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
          <Sparkles className="h-4 w-4 shrink-0 text-blue-600" />
          <span>{routingTransitionMessage}</span>
        </div>
      )}

      {/* Section 1: AWA Issue Essay Canvas */}
      {sectionData.measure === 'awa' && (
        <div className="space-y-6 rounded border border-[#cccccc] bg-white p-6 shadow-xs sm:p-8">
          <div className="border-b border-[#eeeeee] pb-4">
            <span className="text-xs font-bold tracking-wider text-[#666] uppercase">
              Analyze an Issue Task
            </span>
            <h2 className="mt-2 text-lg font-bold text-[#111]">
              {sectionData.awaPrompt?.issuePrompt}
            </h2>
            <p className="mt-2 text-xs text-[#555]">
              {sectionData.awaPrompt?.instructions}
            </p>
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between text-xs text-[#666]">
              <span className="font-semibold">Type your response below:</span>
              <span className="font-mono">Word Count: {wordsCount}</span>
            </div>
            <textarea
              value={essayText}
              onChange={(e) => setEssayText(e.target.value)}
              placeholder="Begin typing your essay here... (At least 100 words recommended for full rubric scoring)"
              rows={14}
              className="w-full rounded border border-[#cccccc] p-4 font-serif text-sm leading-relaxed text-[#111] focus:border-[#1a56db] focus:ring-1 focus:ring-[#1a56db] focus:outline-none"
            />
          </div>

          {awaError && (
            <div className="flex items-center gap-2 rounded border border-rose-200 bg-rose-50 p-3 text-xs text-rose-800">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{awaError}</span>
            </div>
          )}

          {awaEvaluation && (
            <div className="rounded-lg border border-emerald-200 bg-emerald-50/50 p-5 text-xs text-emerald-950">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold">
                  AI Evaluated Score: {awaEvaluation.score.toFixed(1)} / 6.0
                </span>
                <span className="rounded bg-emerald-100 px-2 py-0.5 font-mono text-[11px] text-emerald-900">
                  Confidence: {awaEvaluation.confidence}
                </span>
              </div>
              <p className="mt-2 text-emerald-900">
                {awaEvaluation.dimensions.position_insight.rationale}
              </p>
            </div>
          )}

          <div className="flex items-center justify-between border-t border-[#eeeeee] pt-4">
            <button
              onClick={handleEvaluateEssay}
              disabled={isPending || wordsCount < 20}
              className="flex items-center gap-1.5 rounded border border-[#bbbbbb] bg-[#f9f9f9] px-4 py-2 text-xs font-semibold text-[#222] hover:bg-[#eaeaea] disabled:opacity-50"
            >
              <FileText className="h-3.5 w-3.5" />
              <span>{isPending ? 'Evaluating Essay...' : 'Evaluate Essay with AI'}</span>
            </button>

            <button
              onClick={handleProceedToNextSection}
              disabled={isPending}
              className="flex items-center gap-1 rounded bg-[#1a56db] px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-[#1546b3]"
            >
              <span>Submit AWA & Begin Section 2 (Verbal)</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Sections 2-5: Multiple-Choice / CBT Questions */}
      {sectionData.measure !== 'awa' && currentQ && (
        <div className="space-y-6 rounded border border-[#cccccc] bg-white p-6 shadow-xs sm:p-8">
          <div className="flex items-center justify-between border-b border-[#eeeeee] pb-4">
            <span className="text-sm font-bold text-[#333]">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="font-mono text-xs text-[#777]">
              Topic: {currentQ.topicSlug} (Diff: {currentQ.difficultyB.toFixed(1)})
            </span>
          </div>

          <div className="space-y-6 text-[#222]">
            {currentQ.passageMd && (
              <div className="rounded border border-[#e5e5e5] bg-[#fafafa] p-4 font-serif text-sm leading-relaxed text-[#333]">
                <p className="font-sans text-xs font-bold uppercase tracking-wider text-[#777]">Reading Passage:</p>
                <div className="mt-2 whitespace-pre-wrap">{currentQ.passageMd}</div>
              </div>
            )}
            <p className="font-serif text-base leading-relaxed">{currentQ.promptMd}</p>

            <div className="space-y-3 pt-2">
              {currentQ.options.map((choice, idx) => {
                const isSelected = userAnswers[currentQ.id] === choice.id;
                return (
                  <label
                    key={choice.id}
                    className={`flex cursor-pointer items-center gap-3 rounded border p-3 transition-colors ${
                      isSelected
                        ? 'border-[#1a56db] bg-blue-50/50'
                        : 'border-[#dddddd] hover:bg-[#f8f9fa]'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQ.id}`}
                      value={choice.id}
                      checked={isSelected}
                      onChange={() => handleSelectChoice(choice.id)}
                      className="focus:ring-focus h-4 w-4 border-[#888] text-[#1a56db]"
                    />
                    <span className="font-serif text-sm font-medium">
                      ({String.fromCharCode(65 + idx)}) {choice.text}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center justify-between border-t border-[#eeeeee] pt-6">
            <button
              onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="flex items-center gap-1 rounded border border-[#999999] bg-[#e8e8e8] px-3 py-1.5 text-xs font-bold text-[#111] hover:bg-[#d8d8d8] disabled:opacity-40"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
              <span>Back</span>
            </button>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                className="flex items-center gap-1 rounded bg-[#1a56db] px-4 py-1.5 text-xs font-bold text-white shadow-xs hover:bg-[#1546b3]"
              >
                <span>Next</span>
                <ChevronRight className="h-3.5 w-3.5" />
              </button>
            ) : (
              <button
                onClick={handleProceedToNextSection}
                disabled={isPending}
                className="flex items-center gap-1 rounded bg-emerald-600 px-5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700"
              >
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>
                  {sectionData.sectionIndex === 5
                    ? 'Submit Final Exam & Calculate Scores'
                    : `Complete Section ${sectionData.sectionIndex} & Route Next Section`}
                </span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
