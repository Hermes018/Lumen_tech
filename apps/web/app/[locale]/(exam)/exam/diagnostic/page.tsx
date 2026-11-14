/** @purpose Guest GRE Express Diagnostic CBT Runner & Gated Results Claim Gate (D4, 02 §6) */
'use client';

import * as React from 'react';
import Link from 'next/link';
import {
  createGuestDiagnosticSession,
  submitGuestDiagnostic,
  claimDiagnosticAttempt,
  type DiagnosticAttemptRecord,
  type GuestDiagnosticSession,
} from '@lumen/core';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, MathText } from '@lumen/ui';
import { GreCalculator } from '@lumen/ui';
import {
  Calculator as CalcIcon,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  RotateCcw,
} from 'lucide-react';

export default function DiagnosticExamPage() {
  const [session, setSession] = React.useState<GuestDiagnosticSession | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [userAnswers, setUserAnswers] = React.useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = React.useState<number>(900); // 15:00
  const [isCalculatorOpen, setIsCalculatorOpen] = React.useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = React.useState<DiagnosticAttemptRecord | null>(null);
  const [simulatedDatabase, setSimulatedDatabase] = React.useState<Map<string, DiagnosticAttemptRecord>>(
    new Map()
  );

  // Initialize guest session on mount
  React.useEffect(() => {
    const s = createGuestDiagnosticSession();
    setSession(s);
  }, []);

  // Timer countdown
  React.useEffect(() => {
    if (submittedResult || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [submittedResult, timeRemaining]);

  if (!session) {
    return <div className="p-8 text-center text-sm text-[#444]">Loading GRE Express Diagnostic...</div>;
  }

  const currentQuestion = session.questions[currentIndex];
  if (!currentQuestion && !submittedResult) {
    return <div className="p-8 text-center text-sm text-[#444]">Question not found.</div>;
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (choiceId: string) => {
    if (!currentQuestion) return;
    if (currentQuestion.type === 'se') {
      // Sentence equivalence allows up to 2 choices
      const currentChoices = (userAnswers[currentQuestion.id] as string[]) || [];
      if (currentChoices.includes(choiceId)) {
        setUserAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: currentChoices.filter((c) => c !== choiceId),
        }));
      } else {
        if (currentChoices.length < 2) {
          setUserAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: [...currentChoices, choiceId],
          }));
        }
      }
    } else {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: choiceId,
      }));
    }
  };

  const handleSubmit = () => {
    const record = submitGuestDiagnostic(session.guestToken, userAnswers);
    const db = new Map(simulatedDatabase);
    db.set(session.guestToken, record);
    setSimulatedDatabase(db);
    setSubmittedResult(record);
  };

  const handleClaim = () => {
    if (!submittedResult) return;
    const updated = claimDiagnosticAttempt(session.guestToken, 'usr_new_student_789', simulatedDatabase);
    setSubmittedResult({ ...updated });
  };

  const handleRestart = () => {
    const s = createGuestDiagnosticSession();
    setSession(s);
    setCurrentIndex(0);
    setUserAnswers({});
    setTimeRemaining(900);
    setSubmittedResult(null);
  };

  // RENDER RESULTS SCREEN IF SUBMITTED
  if (submittedResult) {
    const { scoreSummary, gated, itemByItemBreakdown, personalizedStudyPlan } = submittedResult;

    return (
      <div className="mx-auto max-w-4xl p-6 space-y-8 bg-[#fdfdfd] min-h-screen">
        {/* Results Header */}
        <div className="text-center space-y-3 border-b pb-6">
          <Badge variant="outline" className="border-accent text-accent text-xs">
            GRE Diagnostic Assessment Report
          </Badge>
          <h1 className="text-3xl font-extrabold text-[#111] sm:text-4xl">
            Your Diagnostic Ability Profile
          </h1>
          <p className="text-sm text-[#555] max-w-xl mx-auto">
            Calculated via Rasch 1PL Expected A Posteriori (EAP) ability estimation matching ETS
            section-adaptive norms.
          </p>
        </div>

        {/* Estimated Scores Grid */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-[#ddd] bg-white p-5 text-center shadow-xs">
            <div className="text-xs uppercase font-semibold text-[#666]">Estimated Quant</div>
            <div className="text-3xl font-black text-accent mt-1">
              {scoreSummary.quantScaledRange[0]} - {scoreSummary.quantScaledRange[1]}
            </div>
            <div className="text-xs text-[#888] mt-1">
              Raw: {scoreSummary.quantRaw} / 4 Correct
            </div>
          </div>

          <div className="rounded-xl border border-[#ddd] bg-white p-5 text-center shadow-xs">
            <div className="text-xs uppercase font-semibold text-[#666]">Estimated Verbal</div>
            <div className="text-3xl font-black text-accent mt-1">
              {scoreSummary.verbalScaledRange[0]} - {scoreSummary.verbalScaledRange[1]}
            </div>
            <div className="text-xs text-[#888] mt-1">
              Raw: {scoreSummary.verbalRaw} / 4 Correct
            </div>
          </div>

          <div className="rounded-xl border border-accent/40 bg-accent/5 p-5 text-center shadow-xs">
            <div className="text-xs uppercase font-semibold text-accent">Total Estimated GRE</div>
            <div className="text-3xl font-black text-[#111] mt-1">
              {scoreSummary.overallEstimatedRange[0]} - {scoreSummary.overallEstimatedRange[1]}
            </div>
            <div className="text-xs text-accent mt-1">Out of 340 Scale</div>
          </div>
        </div>

        {/* Top Trap Archetype Callout */}
        <div className="rounded-xl border border-warning/40 bg-warning-soft/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-warning font-bold text-sm">
            <ShieldAlert className="h-5 w-5" />
            <span>Primary Cognitive Trap Identified: {scoreSummary.topTrapArchetype.label}</span>
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            {scoreSummary.topTrapArchetype.description}
          </p>
        </div>

        {/* Recommended Track */}
        <div className="rounded-xl border border-[#ddd] bg-white p-5 space-y-2">
          <div className="text-xs uppercase font-semibold text-[#666]">Recommended Track</div>
          <div className="text-base font-bold text-[#111]">{scoreSummary.recommendedTrack}</div>
          <p className="text-xs text-[#666]">
            Based on your speed, accuracy, and vulnerability to distractor patterns in this
            diagnostic set.
          </p>
        </div>

        {/* GATED SECTION: Study Plan & Item Breakdown */}
        <div className="space-y-6 relative">
          {gated ? (
            /* GATE OVERLAY */
            <div className="rounded-2xl border-2 border-dashed border-accent/40 bg-white p-8 text-center space-y-6 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-[#111]">
                  Full Item Breakdown & Study Plan Gated
                </h3>
                <p className="text-xs text-[#555] leading-relaxed">
                  As an unauthenticated guest, your high-level ability score is shown above. To
                  unlock item-by-item solutions, trap forensics, and your personalized 8-week Study
                  Plan, create your free account now.
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href="/sign-in">
                  <Button size="lg" className="gap-2 font-semibold">
                    Sign Up Free to Claim Results <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleClaim}
                  className="gap-2 border-accent text-accent hover:bg-accent/10"
                >
                  <Unlock className="h-4 w-4" /> Claim Results Now (Simulate Sign-In)
                </Button>
              </div>
            </div>
          ) : (
            /* UNLOCKED SECTION */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-xl border border-success/40 bg-success-soft/70 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-success font-semibold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>Attempt Claimed! Full Breakdown & Study Plan Unlocked.</span>
                </div>
                <Badge variant="outline" className="border-success text-success text-xs">
                  Account Linked
                </Badge>
              </div>

              {/* Study Plan Preview */}
              {personalizedStudyPlan && (
                <Card className="border-[#ddd] bg-white">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-[#111]">
                      Your Personalized {personalizedStudyPlan.recommendedWeeks}-Week Study Plan
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-[#333]">
                    <div>
                      Target Scaled Score: <span className="font-bold">{personalizedStudyPlan.targetScore}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-[#555]">Focus Priority Areas:</div>
                      <ul className="list-disc list-inside space-y-0.5 text-[#444]">
                        {personalizedStudyPlan.focusAreas.map((area, i) => (
                          <li key={i}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Item Solutions */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#111]">Item-by-Item Review & Solutions</h3>
                <div className="space-y-3">
                  {itemByItemBreakdown?.map((item, idx) => (
                    <div
                      key={item.questionId}
                      className={`rounded-lg border p-4 text-xs space-y-2 ${
                        item.isCorrect
                          ? 'border-success/30 bg-success-soft/30'
                          : 'border-danger/30 bg-danger-soft/30'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <span>Question {idx + 1} ({item.measure.toUpperCase()})</span>
                        <span className={item.isCorrect ? 'text-success' : 'text-danger'}>
                          {item.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                      <div className="text-[#555]">
                        Your Answer: <span className="font-mono">{Array.isArray(item.userAnswer) ? item.userAnswer.join(', ') : item.userAnswer || '(unanswered)'}</span> |{' '}
                        Correct Answer: <span className="font-mono font-bold">{Array.isArray(item.correctAnswer) ? item.correctAnswer.join(', ') : item.correctAnswer}</span>
                      </div>
                      {item.trapTriggered && (
                        <div className="rounded bg-warning/15 p-2 text-warning font-medium">
                          Cognitive Trap: {item.trapTriggered.label} — <MathText content={item.trapTriggered.description} />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center border-t pt-4 text-xs">
          <Button variant="outline" size="sm" onClick={handleRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" /> Retake Diagnostic
          </Button>
          <Link href="/pricing">
            <Button size="sm" className="gap-2">
              View Recommended Plans <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // RENDER CBT RUNNER INTERFACE
  if (!currentQuestion) {
    return <div className="p-8 text-center text-sm text-[#444]">Question not found.</div>;
  }

  const selectedAnswer = userAnswers[currentQuestion.id];

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-[#222]">
      {/* ETS CBT Top Control Bar */}
      <div className="flex items-center justify-between border-b border-[#ccc] bg-[#e8e8e8] px-4 py-2 text-xs font-medium">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#111]">
            GRE Express Diagnostic (Question {currentIndex + 1} of {session.questions.length})
          </span>
          <Badge variant="outline" className="border-[#999] text-[#444] text-[10px]">
            {currentQuestion.measure === 'quant' ? 'Quantitative' : 'Verbal'}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {/* Timer Display */}
          <div className="flex items-center gap-1.5 rounded border border-[#bbb] bg-white px-2.5 py-1 font-mono font-bold text-[#111]">
            <Clock className="h-3.5 w-3.5 text-[#555]" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>

          {/* Calculator Toggle (Quant only) */}
          {currentQuestion.measure === 'quant' && (
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
              className="flex items-center gap-1 rounded border border-[#bbb] bg-[#f9f9f9] px-2 py-1 text-[#333] hover:bg-[#e0e0e0]"
            >
              <CalcIcon className="h-3.5 w-3.5" />
              <span>Calculator</span>
            </button>
          )}
        </div>
      </div>

      {/* Main CBT Workspace */}
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* On-Screen Calculator Floating Modal */}
        {isCalculatorOpen && (
          <div className="fixed top-16 right-8 z-50 shadow-2xl">
            <GreCalculator
              isOpen={isCalculatorOpen}
              onTransferDisplay={() => {
                setIsCalculatorOpen(false);
              }}
              onClose={() => setIsCalculatorOpen(false)}
            />
          </div>
        )}

        {/* Question Card */}
        <div className="rounded-xl border border-[#ccc] bg-white p-6 shadow-xs space-y-6">
          <div className="text-sm font-medium leading-relaxed text-[#111]">
            <MathText content={currentQuestion.prompt} />
          </div>

          {/* QC Column Layout if type is QC */}
          {currentQuestion.type === 'qc' && currentQuestion.quantityA && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-lg border border-[#eee] bg-[#fafafa] p-4 text-center">
              <div className="border-r border-[#eee] pr-4">
                <div className="text-xs uppercase font-semibold text-[#777]">Quantity A</div>
                <div className="text-base font-bold text-[#111] mt-1">
                  <MathText content={currentQuestion.quantityA} />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase font-semibold text-[#777]">Quantity B</div>
                <div className="text-base font-bold text-[#111] mt-1">
                  <MathText content={currentQuestion.quantityB} />
                </div>
              </div>
            </div>
          )}

          {/* Choices */}
          <div className="space-y-2">
            {currentQuestion.options.map((opt) => {
              const isSelected =
                currentQuestion.type === 'se'
                  ? Array.isArray(selectedAnswer) && selectedAnswer.includes(opt.id)
                  : selectedAnswer === opt.id;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors ${
                    isSelected
                      ? 'border-accent bg-accent/10 font-medium text-[#111]'
                      : 'border-[#ddd] hover:bg-[#fafafa] text-[#333]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#bbb] font-mono text-xs font-semibold">
                      {opt.id}
                    </span>
                    <span>
                      <MathText content={opt.text} />
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-accent" />}
                </button>
              );
            })}
          </div>

          {currentQuestion.type === 'se' && (
            <p className="text-[11px] text-[#777]">
              Select exactly TWO answer choices that complete the sentence with equivalent meaning.
            </p>
          )}
        </div>

        {/* Question Palette Strip */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {session.questions.map((q, idx) => {
            const answered =
              q.type === 'se'
                ? Array.isArray(userAnswers[q.id]) && (userAnswers[q.id] as string[]).length === 2
                : !!userAnswers[q.id];
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-7 w-7 rounded font-mono text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'ring-2 ring-accent bg-accent text-accent-fg'
                    : answered
                    ? 'bg-[#333] text-white'
                    : 'bg-[#ddd] text-[#555] hover:bg-[#ccc]'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation Toolbar */}
        <div className="flex items-center justify-between border-t border-[#ccc] pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> Previous
          </Button>

          {currentIndex < session.questions.length - 1 ? (
            <Button
              size="sm"
              onClick={() => setCurrentIndex((prev) => Math.min(session.questions.length - 1, prev + 1))}
              className="gap-1.5"
            >
              Next <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              className="gap-1.5 bg-accent text-accent-fg font-bold"
            >
              Submit Diagnostic Test
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
