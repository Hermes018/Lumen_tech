/** @purpose Interactive GRE Practice Session runner with hints, second-chance retries & trap diagnostics */
'use client';

import * as React from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Button,
  Badge,
  GreCalculator,
  HintLadder,
  TrapDiagnostic,
  SocraticStepper,
  VerbalDeconstructor,
} from '@lumen/ui';
import {
  createPracticeSession,
  useHint,
  submitAnswer,
  advanceSocraticStep,
  tagErrorLog,
  type PracticeSessionState,
  type ErrorTag,
} from '@lumen/core';
import { GRE_MAGOOSH_SEED_QUESTIONS, type SeedGreQuestion } from '@lumen/db';
import {
  Calculator,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Tag,
  ArrowLeft,
  Bot,
  Send,
  X,
} from 'lucide-react';
import { askTutorAction } from '@/app/actions/tutor';

export default function PracticeSessionRunnerPage() {
  const params = useParams();
  const sessionId = (params?.sessionId as string) || 'practice-session';

  // Questions for this session
  const [questions] = React.useState<SeedGreQuestion[]>(() => {
    // If session ID specifies an item, put that item first
    const specificId = sessionId.replace('sess-item-', '');
    const found = GRE_MAGOOSH_SEED_QUESTIONS.find((q: SeedGreQuestion) => q.id === specificId);
    if (found) {
      return [found, ...GRE_MAGOOSH_SEED_QUESTIONS.filter((q: SeedGreQuestion) => q.id !== specificId)];
    }
    return GRE_MAGOOSH_SEED_QUESTIONS.slice(0, 5);
  });

  // Practice core state
  const [session, setSession] = React.useState<PracticeSessionState>(() =>
    createPracticeSession({
      id: sessionId,
      userId: 'learner-current',
      mode: sessionId.includes('timed') ? 'timed' : 'tutor',
      questionIds: questions.map((q) => q.id),
      hintBudget: 5,
    })
  );

  const [currentIdx, setCurrentIdx] = React.useState(0);
  const [selectedChoices, setSelectedChoices] = React.useState<string[]>([]);
  const [numericEntryValue, setNumericEntryValue] = React.useState('');
  const [showCalculator, setShowCalculator] = React.useState(false);
  const [showSocratic, setShowSocratic] = React.useState(false);
  const [showErrorModal, setShowErrorModal] = React.useState(false);
  const [selectedErrorTag, setSelectedErrorTag] = React.useState<ErrorTag>('careless_math');
  const [errorNotes, setErrorNotes] = React.useState('');

  // Verbal Predict-First state
  const [predictFirstEnabled, setPredictFirstEnabled] = React.useState(true);
  const [predictionText, setPredictionText] = React.useState('');
  const [choicesRevealed, setChoicesRevealed] = React.useState(false);
  const [vocabToast, setVocabToast] = React.useState<string | null>(null);

  // AI Tutor Drawer state
  const [showTutorDrawer, setShowTutorDrawer] = React.useState(false);
  const [tutorMessages, setTutorMessages] = React.useState<
    Array<{
      role: 'user' | 'tutor';
      text: string;
      citations?: Array<{ id: string; label: string; excerpt: string }>;
      mode?: string;
    }>
  >([
    {
      role: 'tutor',
      text: 'Hello! I am Ask Lumen, your GRE Socratic tutor. Ask for a hint, test your algebraic setup, or have me check your reasoning without spoiling the answer.',
    },
  ]);
  const [tutorInput, setTutorInput] = React.useState('');
  const [tutorMode, setTutorMode] = React.useState<'socratic_hint' | 'check_reasoning' | 'explain'>('socratic_hint');
  const [tutorRemainingQuota, setTutorRemainingQuota] = React.useState(150);
  const [isTutorLoading, setIsTutorLoading] = React.useState(false);

  const activeQuestion = questions[currentIdx];
  const activeQState = session.questions[currentIdx];

  if (!activeQuestion || !activeQState) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-lg font-bold">Session not found</h2>
        <Link href="/app/practice" className="mt-4 inline-block text-accent hover:underline">
          Return to Practice Dashboard
        </Link>
      </div>
    );
  }

  const isNumeric = activeQuestion.questionType.startsWith('gre_numeric');
  const isVerbal =
    activeQuestion.questionType.startsWith('gre_tc') ||
    activeQuestion.questionType.startsWith('gre_se') ||
    activeQuestion.questionType.startsWith('gre_rc');
  const isSubmitted = activeQState.status === 'submitted';
  const isSecondChance = activeQState.status === 'second_chance';

  // Find any trap explanation for the selected choice
  const selectedChoiceId = selectedChoices[0] || (isNumeric ? numericEntryValue : '');
  const choiceExp = activeQuestion.choiceExplanations[selectedChoiceId];
  const hasTrap = choiceExp?.trap_tag && !activeQState.isCorrect;

  // Handle choice selection
  const handleToggleChoice = (choiceId: string) => {
    if (isSubmitted) return;
    const isMulti =
      activeQuestion.questionType === 'gre_mc_multi' ||
      activeQuestion.questionType === 'gre_se' ||
      activeQuestion.questionType === 'gre_rc_multi';

    if (isMulti) {
      if (selectedChoices.includes(choiceId)) {
        setSelectedChoices(selectedChoices.filter((c) => c !== choiceId));
      } else {
        setSelectedChoices([...selectedChoices, choiceId]);
      }
    } else {
      setSelectedChoices([choiceId]);
    }
  };

  // Submit answer
  const handleSubmit = () => {
    const submission = isNumeric ? numericEntryValue.trim() : selectedChoices;
    const nextSession = submitAnswer(
      session,
      activeQuestion.id,
      submission,
      activeQuestion.correctAnswers
    );
    setSession(nextSession);
  };

  // Use progressive hint
  const handleUseHint = () => {
    try {
      const nextSession = useHint(session, activeQuestion.id);
      setSession(nextSession);
    } catch {
      // Budget exhausted
    }
  };

  // Socratic Step advancement
  const handleSelectSocraticOption = (stepIdx: number, optionIdx: number) => {
    const step = activeQuestion.steps[stepIdx];
    if (!step) return;

    const nextSession = advanceSocraticStep(
      session,
      activeQuestion.id,
      stepIdx,
      optionIdx,
      step.correct_option_index,
      activeQuestion.steps.length
    );
    setSession(nextSession);
  };

  // Error Log Tagging
  const handleSaveErrorTag = () => {
    const nextSession = tagErrorLog(
      session,
      activeQuestion.id,
      selectedErrorTag,
      errorNotes
    );
    setSession(nextSession);
    setShowErrorModal(false);
  };

  // Handle word clicked for FSRS vocab addition
  const handleAddToDeck = (word: string) => {
    setVocabToast(`Added "${word}" to your FSRS Vocab Deck!`);
    setTimeout(() => setVocabToast(null), 3000);
  };

  const handleSendTutorMessage = async (customText?: string) => {
    const textToSend = customText ?? tutorInput;
    if (!textToSend.trim() || isTutorLoading) return;

    setTutorMessages((prev) => [...prev, { role: 'user', text: textToSend }]);
    if (!customText) setTutorInput('');
    setIsTutorLoading(true);

    try {
      const response = await askTutorAction({
        userMessage: textToSend,
        mode: tutorMode,
        isItemActive: !isSubmitted,
        locale: 'en',
        questionContext: {
          id: activeQuestion.id,
          promptMd: activeQuestion.promptMd,
          questionType: activeQuestion.questionType,
          topicSlug: activeQuestion.topicSlug,
          options: activeQuestion.options,
          correctAnswers: activeQuestion.correctAnswers,
          userSelectedAnswer: selectedChoices[0] || numericEntryValue,
          revealedHintTiers: activeQState.revealedHintTiers,
          hints: activeQuestion.hints.map((h: { tier: 1 | 2 | 3; label: string; content_md: string }) => ({
            tier: h.tier,
            label: h.label,
            content: h.content_md,
          })),
          writtenExplanationMd: activeQuestion.writtenExplanationMd,
          steps: activeQuestion.steps.map((s: { step_index: number; prompt_md: string; takeaway_md: string }) => ({
            stepNumber: s.step_index,
            prompt: s.prompt_md,
            takeaway: s.takeaway_md,
          })),
        },
      });

      setTutorRemainingQuota(response.remainingQuota);
      setTutorMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          text: response.text,
          citations: response.citations,
          mode: response.mode,
        },
      ]);
    } catch {
      setTutorMessages((prev) => [
        ...prev,
        {
          role: 'tutor',
          text: 'Sorry, I encountered an issue reaching the AI Tutor service. Please try again.',
        },
      ]);
    } finally {
      setIsTutorLoading(false);
    }
  };

  // Navigation
  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setSelectedChoices([]);
      setNumericEntryValue('');
      setShowSocratic(false);
      setChoicesRevealed(false);
    }
  };

  const handlePrev = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      setSelectedChoices([]);
      setNumericEntryValue('');
      setShowSocratic(false);
      setChoicesRevealed(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12">
      {/* Top Session Navigation & Utility Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-control/30 pb-4">
        <div className="flex items-center gap-3">
          <Link
            href="/app/practice"
            className="flex items-center gap-1 text-xs text-fg-muted hover:text-fg transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Practice Hub</span>
          </Link>
          <span className="text-fg-muted/40">|</span>
          <span className="text-xs font-semibold text-fg">
            Item {currentIdx + 1} of {questions.length}
          </span>
          <Badge
            variant={session.mode === 'tutor' ? 'default' : 'secondary'}
            className="text-[10px] uppercase font-bold"
          >
            {session.mode === 'tutor' ? 'Tutor Mode' : 'Timed Mode'}
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          {/* Calculator toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowCalculator(!showCalculator)}
            className="h-8 gap-1.5 text-xs"
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>Calculator</span>
          </Button>

          {/* Socratic Walkthrough toggle */}
          {activeQuestion.steps.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSocratic(!showSocratic)}
              className="h-8 gap-1.5 text-xs text-info border-info/40 hover:bg-info-soft"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Walk Me Through It</span>
            </Button>
          )}

          {/* Ask AI Tutor drawer toggle with quota pill */}
          <Button
            variant={showTutorDrawer ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setShowTutorDrawer(!showTutorDrawer)}
            className="h-8 gap-1.5 text-xs text-accent border-accent/40 hover:bg-accent-soft"
          >
            <Bot className="w-3.5 h-3.5" />
            <span>Ask AI Tutor</span>
            <span className="ml-1 rounded-full bg-accent/20 px-1.5 py-0.5 text-[10px] font-bold text-accent">
              {tutorRemainingQuota} left
            </span>
          </Button>
        </div>
      </div>

      {/* Main Grid: Question Content & Hint Ladder */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left 2 Cols: Question Stem & Choices */}
        <div className="lg:col-span-2 space-y-4">
          {/* Second Chance Banner if triggered */}
          {isSecondChance && (
            <div className="rounded-xl border border-warning bg-warning-soft p-3.5 flex items-start gap-3">
              <RotateCcw className="w-5 h-5 text-warning shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-warning uppercase tracking-wide">
                  Try One More Time (Second Chance)
                </h4>
                <p className="text-xs text-fg mt-0.5 leading-relaxed">
                  Your first answer was not correct. In Tutor Mode, you get a second chance to
                  re-evaluate your reasoning before the full solution is revealed!
                </p>
              </div>
            </div>
          )}

          {/* Stem & Passage */}
          {isVerbal ? (
            <VerbalDeconstructor
              passageOrSentence={activeQuestion.passageMd ? `${activeQuestion.passageMd}\n\n${activeQuestion.promptMd}` : activeQuestion.promptMd}
              triggerWords={activeQuestion.verbalDeconstructor?.trigger_words}
              blankCharges={activeQuestion.verbalDeconstructor?.blank_charges}
              predictFirstEnabled={predictFirstEnabled}
              predictionText={predictionText}
              choicesRevealed={choicesRevealed}
              onPredictionChange={setPredictionText}
              onToggleReveal={() => setChoicesRevealed(!choicesRevealed)}
              onTogglePredictFirst={setPredictFirstEnabled}
              onAddToDeck={handleAddToDeck}
            >
              {/* Choices wrapped inside deconstructor */}
              <div className="space-y-2 pt-2">
                {activeQuestion.options.map((opt: { id: string; text: string }) => {
                  const isSelected = selectedChoices.includes(opt.id);
                  const isCorrectAnswer = activeQuestion.correctAnswers.includes(opt.id);

                  let choiceStyle = 'border-control/60 bg-surface hover:border-accent/60';
                  if (isSelected) {
                    choiceStyle = 'border-accent bg-accent-soft/50 ring-1 ring-accent';
                  }
                  if (isSubmitted) {
                    if (isCorrectAnswer) {
                      choiceStyle = 'border-success bg-success-soft ring-1 ring-success';
                    } else if (isSelected && !isCorrectAnswer) {
                      choiceStyle = 'border-danger bg-danger-soft ring-1 ring-danger';
                    }
                  }

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleToggleChoice(opt.id)}
                      className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-xs sm:text-sm transition-all cursor-pointer ${choiceStyle}`}
                    >
                      <span className="font-bold text-fg-muted shrink-0 w-5">
                        {opt.id}.
                      </span>
                      <span className="flex-1 leading-normal text-fg font-medium">
                        {opt.text}
                      </span>
                      {isSubmitted && isCorrectAnswer && (
                        <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                      )}
                      {isSubmitted && isSelected && !isCorrectAnswer && (
                        <XCircle className="w-4 h-4 text-danger shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </VerbalDeconstructor>
          ) : (
            <div className="rounded-xl border border-control bg-surface p-5 space-y-4 shadow-2xs">
              <div className="text-sm sm:text-base leading-relaxed text-fg whitespace-pre-wrap font-medium">
                {activeQuestion.promptMd}
              </div>

              {/* Quant Choices or Numeric Entry */}
              {isNumeric ? (
                <div className="space-y-2 pt-2">
                  <label htmlFor="numeric-entry-input" className="text-xs font-semibold text-fg">
                    Numeric Answer:
                  </label>
                  <div className="flex items-center gap-2 max-w-xs">
                    <input
                      id="numeric-entry-input"
                      type="text"
                      disabled={isSubmitted}
                      value={numericEntryValue}
                      onChange={(e) => setNumericEntryValue(e.target.value)}
                      placeholder="Type or transfer from calculator"
                      className="w-full rounded-lg border border-control bg-surface-2 px-3 py-2 text-sm font-mono text-fg focus:outline-none focus:ring-2 focus:ring-accent"
                    />
                  </div>
                </div>
              ) : (
                <div className="space-y-2 pt-2">
                  {activeQuestion.options.map((opt: { id: string; text: string }) => {
                    const isSelected = selectedChoices.includes(opt.id);
                    const isCorrectAnswer = activeQuestion.correctAnswers.includes(opt.id);

                    let choiceStyle = 'border-control/60 bg-surface hover:border-accent/60';
                    if (isSelected) {
                      choiceStyle = 'border-accent bg-accent-soft/50 ring-1 ring-accent';
                    }
                    if (isSubmitted) {
                      if (isCorrectAnswer) {
                        choiceStyle = 'border-success bg-success-soft ring-1 ring-success';
                      } else if (isSelected && !isCorrectAnswer) {
                        choiceStyle = 'border-danger bg-danger-soft ring-1 ring-danger';
                      }
                    }

                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => handleToggleChoice(opt.id)}
                        className={`flex w-full items-start gap-3 rounded-xl border p-3.5 text-left text-xs sm:text-sm transition-all cursor-pointer ${choiceStyle}`}
                      >
                        <span className="font-bold text-fg-muted shrink-0 w-5">
                          {opt.id}.
                        </span>
                        <span className="flex-1 leading-normal text-fg font-medium">
                          {opt.text}
                        </span>
                        {isSubmitted && isCorrectAnswer && (
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0" />
                        )}
                        {isSubmitted && isSelected && !isCorrectAnswer && (
                          <XCircle className="w-4 h-4 text-danger shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* Action Button: Submit or Retry */}
          <div className="flex items-center justify-between pt-2">
            {!isSubmitted ? (
              <Button
                onClick={handleSubmit}
                disabled={!isNumeric && selectedChoices.length === 0}
                className="gap-2 px-6"
              >
                <span>{isSecondChance ? 'Submit Second Attempt' : 'Submit Answer'}</span>
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    activeQState.isCorrect
                      ? 'bg-success-soft text-success'
                      : 'bg-danger-soft text-danger'
                  }`}
                >
                  {activeQState.isCorrect ? (
                    <>
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Correct ({Math.round(activeQState.masteryWeight * 100)}% Mastery)
                    </>
                  ) : (
                    <>
                      <XCircle className="w-3.5 h-3.5" />
                      Incorrect (0% Mastery)
                    </>
                  )}
                </span>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowErrorModal(true)}
                  className="gap-1.5 text-xs text-fg-muted hover:text-fg"
                >
                  <Tag className="w-3.5 h-3.5" />
                  <span>{activeQState.errorTag ? 'Edit Error Tag' : 'Tag in Error Log'}</span>
                </Button>
              </div>
            )}

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handlePrev}
                disabled={currentIdx === 0}
                className="gap-1 text-xs"
              >
                <ChevronLeft className="w-3.5 h-3.5" /> Previous
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleNext}
                disabled={currentIdx === questions.length - 1}
                className="gap-1 text-xs"
              >
                Next <ChevronRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>

          {/* Distractor Trap Diagnostic Callout */}
          {isSubmitted && hasTrap && (
            <TrapDiagnostic
              choiceId={selectedChoiceId}
              trapTag={choiceExp?.trap_tag}
              trapLabel={choiceExp?.trap_label}
              explanationMd={choiceExp?.explanation_md || 'Distractor trap identified by GRE question designers.'}
            />
          )}

          {/* Full Written Solution if Submitted */}
          {isSubmitted && (
            <div className="rounded-xl border border-control bg-surface p-4 space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-fg uppercase tracking-wider">
                <HelpCircle className="w-4 h-4 text-accent" />
                Comprehensive Explanation
              </div>
              <div className="text-xs sm:text-sm text-fg leading-relaxed whitespace-pre-wrap opacity-95">
                {activeQuestion.writtenExplanationMd}
              </div>
            </div>
          )}

          {/* Socratic Walkthrough Stepper */}
          {showSocratic && activeQuestion.steps.length > 0 && (
            <SocraticStepper
              steps={activeQuestion.steps}
              currentStepIndex={activeQState.socratic.currentStepIndex}
              completedStepIndices={activeQState.socratic.completedStepIndices}
              isCompleted={activeQState.socratic.isCompleted}
              onSelectStepOption={handleSelectSocraticOption}
            />
          )}
        </div>

        {/* Right Col: Hint Ladder & Helper Tools */}
        <div className="space-y-4">
          <HintLadder
            hints={activeQuestion.hints}
            revealedTiers={activeQState.revealedHintTiers}
            hintBudgetRemaining={session.hintBudgetRemaining}
            totalHintBudget={session.totalHintsBudget}
            onRevealNextHint={handleUseHint}
            disabled={isSubmitted}
          />

          {/* Calculator Floating Container */}
          {showCalculator && (
            <div className="pt-2">
              <GreCalculator
                isOpen={showCalculator}
                onClose={() => setShowCalculator(false)}
                onTransferDisplay={(val) => {
                  setNumericEntryValue(val);
                }}
              />
            </div>
          )}
        </div>
      </div>

      {/* Vocab Toast */}
      {vocabToast && (
        <div className="fixed bottom-6 right-6 z-50 rounded-xl border border-accent bg-accent text-accent-fg px-4 py-2 text-xs font-semibold shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
          {vocabToast}
        </div>
      )}

      {/* Error Log Tagging Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-control bg-surface p-6 shadow-2xl space-y-4 text-fg animate-in zoom-in-95 duration-150">
            <div>
              <h3 className="text-base font-bold">Tag in Mistake Notebook</h3>
              <p className="text-xs text-fg-muted mt-0.5">
                Categorize this item to schedule it into your spaced review queue (1d &bull; 3d &bull; 7d &bull; 21d).
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-semibold">Error Category:</label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {(
                  [
                    ['careless_math', 'Careless Math / Calc'],
                    ['vocab_gap', 'Vocab Gap / Definition'],
                    ['concept_gap', 'Core Concept Gap'],
                    ['misread_prompt', 'Misread Question / Trap'],
                    ['time_pressure', 'Time Pressure Rush'],
                  ] as const
                ).map(([tagKey, tagLabel]) => (
                  <button
                    key={tagKey}
                    type="button"
                    onClick={() => setSelectedErrorTag(tagKey)}
                    className={`rounded-lg border p-2 text-left transition-all ${
                      selectedErrorTag === tagKey
                        ? 'border-accent bg-accent-soft text-accent font-semibold'
                        : 'border-control bg-surface-2 text-fg hover:border-control/80'
                    }`}
                  >
                    {tagLabel}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="personal-reflection-notes" className="text-xs font-semibold">Personal Reflection Note:</label>
              <textarea
                id="personal-reflection-notes"
                value={errorNotes}
                onChange={(e) => setErrorNotes(e.target.value)}
                placeholder="What will you do differently next time? e.g. Always check both + and - roots..."
                rows={3}
                className="w-full rounded-lg border border-control bg-surface-2 p-2.5 text-xs text-fg focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <Button variant="ghost" size="sm" onClick={() => setShowErrorModal(false)}>
                Cancel
              </Button>
              <Button size="sm" onClick={handleSaveErrorTag}>
                Save to Error Queue
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Slide-over Ask AI Tutor Drawer */}
      {showTutorDrawer && (
        <div className="fixed inset-y-0 right-0 z-50 flex w-full max-w-md flex-col border-l border-control bg-surface shadow-2xl animate-in slide-in-from-right duration-200">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-control p-4 bg-surface-2">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-accent/15 p-1.5 text-accent">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-fg">Ask Lumen (AI Tutor)</h3>
                  <span className="rounded-full bg-accent/20 px-2 py-0.5 text-[10px] font-bold text-accent">
                    {tutorRemainingQuota} left today
                  </span>
                </div>
                <p className="text-[11px] text-fg-muted">
                  {!isSubmitted ? 'Socratic Hint & Walkthrough Mode' : 'Post-Submission Explanatory Mode'}
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setShowTutorDrawer(false)}
              className="rounded-lg p-1.5 text-fg-muted hover:bg-surface hover:text-fg transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Mode Switcher Chips */}
          <div className="flex items-center gap-1.5 border-b border-control/60 bg-surface px-4 py-2 text-xs">
            <span className="text-[10px] uppercase font-bold text-fg-muted mr-1">Mode:</span>
            {[
              ['socratic_hint', 'Hint Ladder'],
              ['check_reasoning', 'Check Reasoning'],
              ['explain', 'Explain Concept'],
            ].map(([mKey, mLabel]) => (
              <button
                key={mKey}
                type="button"
                onClick={() => setTutorMode(mKey as 'socratic_hint' | 'check_reasoning' | 'explain')}
                className={`rounded-md px-2.5 py-1 text-[11px] font-semibold transition-all ${
                  tutorMode === mKey
                    ? 'bg-accent text-accent-fg'
                    : 'bg-surface-2 text-fg-muted hover:text-fg'
                }`}
              >
                {mLabel}
              </button>
            ))}
          </div>

          {/* Active Status Banner */}
          <div className="bg-accent-soft/40 px-4 py-1.5 border-b border-control/40 text-[11px] text-accent flex items-center justify-between">
            <span>
              {!isSubmitted
                ? '🔒 Spoiler-Guard: Answers protected until submission.'
                : '🔓 Full Diagnostics & Trap Tags Unlocked.'}
            </span>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 text-xs leading-relaxed">
            {tutorMessages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${
                  msg.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`max-w-[88%] rounded-2xl p-3 ${
                    msg.role === 'user'
                      ? 'bg-accent text-accent-fg font-medium rounded-tr-sm'
                      : 'border border-control bg-surface-2 text-fg rounded-tl-sm'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>

                  {/* Grounding Citations */}
                  {msg.citations && msg.citations.length > 0 && (
                    <div className="mt-2.5 pt-2 border-t border-control/60 space-y-1">
                      <span className="text-[10px] uppercase tracking-wide font-bold text-fg-muted block">
                        Grounded Sources & Walkthrough Steps:
                      </span>
                      {msg.citations.map((cite) => (
                        <div
                          key={cite.id}
                          className="rounded-md border border-accent/30 bg-surface px-2 py-1 text-[11px] text-accent flex items-center justify-between gap-2"
                        >
                          <span className="font-semibold truncate">{cite.label}</span>
                          <span className="text-[10px] text-fg-muted truncate">{cite.excerpt}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            {isTutorLoading && (
              <div className="flex items-center gap-2 text-fg-muted italic text-xs pt-2">
                <Bot className="h-4 w-4 animate-spin text-accent" />
                <span>Thinking Socratically...</span>
              </div>
            )}
          </div>

          {/* Quick Prompts */}
          <div className="border-t border-control/40 bg-surface-2/60 px-4 py-2 flex items-center gap-1.5 overflow-x-auto text-[11px]">
            <button
              type="button"
              onClick={() => handleSendTutorMessage('Can you give me a progressive hint?')}
              className="whitespace-nowrap rounded-full border border-control bg-surface px-2.5 py-1 text-fg hover:border-accent hover:text-accent transition-colors"
            >
              💡 Give me a hint
            </button>
            <button
              type="button"
              onClick={() => handleSendTutorMessage('Why is my current reasoning wrong?')}
              className="whitespace-nowrap rounded-full border border-control bg-surface px-2.5 py-1 text-fg hover:border-accent hover:text-accent transition-colors"
            >
              🔍 Check my setup
            </button>
            <button
              type="button"
              onClick={() => handleSendTutorMessage('Explain the core concept behind this item')}
              className="whitespace-nowrap rounded-full border border-control bg-surface px-2.5 py-1 text-fg hover:border-accent hover:text-accent transition-colors"
            >
              📖 Explain concept
            </button>
          </div>

          {/* Composer Footer */}
          <div className="border-t border-control p-3 bg-surface">
            <div className="flex items-end gap-2">
              <textarea
                value={tutorInput}
                onChange={(e) => setTutorInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendTutorMessage();
                  }
                }}
                placeholder="Ask about this question or request a clue..."
                rows={2}
                maxLength={1500}
                className="flex-1 rounded-xl border border-control bg-surface-2 p-2.5 text-xs text-fg focus:outline-none focus:ring-2 focus:ring-accent resize-none"
              />
              <Button
                size="sm"
                onClick={() => handleSendTutorMessage()}
                disabled={!tutorInput.trim() || isTutorLoading}
                className="h-12 px-3.5 rounded-xl shrink-0 gap-1.5"
              >
                <Send className="h-3.5 w-3.5" />
              </Button>
            </div>
            <div className="flex items-center justify-between text-[10px] text-fg-muted mt-1 px-1">
              <span>Enter to send &bull; Shift+Enter for new line</span>
              <span>{tutorInput.length}/1500</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
