/** @purpose Interactive D13 Question Editor (/studio/questions/new) with tabs for pedagogy & live preview */
'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Button,
  Card,
  Badge,
  Callout,
} from '@lumen/ui';
import {
  ArrowLeft,
  CheckCircle2,
  Eye,
  FileText,
  HelpCircle,
  AlertTriangle,
  GitBranch,
  Save,
  Sparkles,
} from 'lucide-react';
import { createQuestionAction, publishQuestionAction } from '@/app/actions/studio';
import { TRAP_ARCHETYPES, type TrapArchetype } from '@lumen/core';

export default function NewQuestionEditorPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'prompt' | 'hints' | 'traps' | 'socratic' | 'preview'>('prompt');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Form State
  const [examType] = useState<'gre' | 'ielts_academic'>('gre');
  const [section, setSection] = useState<'quant' | 'verbal'>('quant');
  const [questionType, setQuestionType] = useState('gre_qc');
  const [topicSlug, setTopicSlug] = useState('algebra-quadratics');
  const [promptMd, setPromptMd] = useState(
    'Compare Quantity A and Quantity B:\n\nx is an integer greater than 1.\n\nQuantity A: (x^2 - 1) / (x - 1)\nQuantity B: x + 2'
  );
  const [writtenExplanationMd, setWrittenExplanationMd] = useState(
    'Factor Quantity A: (x^2 - 1) / (x - 1) = ((x - 1)(x + 1)) / (x - 1) = x + 1. Since Quantity B is x + 2, Quantity B exceeds Quantity A by exactly 1 for all valid integers x. Therefore, Quantity B is strictly greater.'
  );

  // Choices
  const [options, setOptions] = useState([
    { id: 'choice_a', label: 'Quantity A is greater' },
    { id: 'choice_b', label: 'Quantity B is greater' },
    { id: 'choice_c', label: 'The two quantities are equal' },
    { id: 'choice_d', label: 'The relationship cannot be determined' },
  ]);
  const [correctAnswer, setCorrectAnswer] = useState('choice_b');

  // D13 3-Tier Hints
  const [hint1, setHint1] = useState('Notice that x^2 - 1 is a difference of squares.');
  const [hint2, setHint2] = useState('Factor (x - 1)(x + 1) and cancel the common (x - 1) denominator term.');
  const [hint3, setHint3] = useState('Compare the simplified Quantity A (x + 1) directly against Quantity B (x + 2).');

  // D13 Choice Trap Tags
  const [traps, setTraps] = useState<Record<string, { tag: TrapArchetype; explanation: string }>>({
    choice_a: {
      tag: 'opposite_direction',
      explanation: 'Reversed the comparison inequality after simplification.',
    },
    choice_c: {
      tag: 'formula_misapplication',
      explanation: 'Mistook (x + 1) and (x + 2) for equivalent algebraic expressions.',
    },
    choice_d: {
      tag: 'forgot_zero_or_negative',
      explanation: 'Assumed x could take negative fractional values, overlooking the condition x > 1.',
    },
  });

  // D13 Socratic Walkthrough Steps
  const [socraticSteps, setSocraticSteps] = useState([
    {
      step_index: 1,
      prompt_md: 'How can the numerator (x^2 - 1) in Quantity A be factored?',
      options: ['(x - 1)^2', '(x - 1)(x + 1)', 'x(x - 1)'],
      correct_option_index: 1,
      takeaway_md: 'x^2 - 1 factors as the difference of squares: (x - 1)(x + 1).',
    },
    {
      step_index: 2,
      prompt_md: 'After cancelling (x - 1), compare Quantity A = x + 1 and Quantity B = x + 2.',
      options: ['Quantity A is larger', 'Quantity B is strictly larger by 1', 'They depend on x'],
      correct_option_index: 1,
      takeaway_md: 'For any integer x, x + 2 > x + 1.',
    },
  ]);

  const handleSaveDraft = async () => {
    setIsSubmitting(true);
    setFeedbackMsg(null);

    const res = await createQuestionAction({
      examType,
      section,
      questionType,
      topicSlug,
      promptMd,
      options,
      correctAnswers: [correctAnswer],
      writtenExplanationMd,
      hints: [
        { tier: 1, label: 'Concept Nudge', content_md: hint1 },
        { tier: 2, label: 'Setup / Elimination', content_md: hint2 },
        { tier: 3, label: 'Final Bridge', content_md: hint3 },
      ],
      choiceExplanations: {
        [correctAnswer]: {
          is_correct: true,
          explanation_md: writtenExplanationMd,
        },
        ...Object.fromEntries(
          Object.entries(traps).map(([optId, t]) => [
            optId,
            {
              is_correct: false,
              explanation_md: t.explanation,
              trap_tag: t.tag,
            },
          ])
        ),
      },
      steps: socraticSteps,
    });

    setIsSubmitting(false);
    if (res.success && res.question) {
      setFeedbackMsg({ type: 'success', text: `Draft saved successfully (ID: ${res.question.id}, Version: v1)` });
    } else {
      setFeedbackMsg({ type: 'error', text: res.error || 'Failed to save question' });
    }
  };

  const handlePublishDirect = async () => {
    setIsSubmitting(true);
    setFeedbackMsg(null);

    const res = await createQuestionAction({
      examType,
      section,
      questionType,
      topicSlug,
      promptMd,
      options,
      correctAnswers: [correctAnswer],
      writtenExplanationMd,
      hints: [
        { tier: 1, label: 'Concept Nudge', content_md: hint1 },
        { tier: 2, label: 'Setup / Elimination', content_md: hint2 },
        { tier: 3, label: 'Final Bridge', content_md: hint3 },
      ],
      choiceExplanations: {
        [correctAnswer]: {
          is_correct: true,
          explanation_md: writtenExplanationMd,
        },
        ...Object.fromEntries(
          Object.entries(traps).map(([optId, t]) => [
            optId,
            {
              is_correct: false,
              explanation_md: t.explanation,
              trap_tag: t.tag,
            },
          ])
        ),
      },
      steps: socraticSteps,
    });

    if (res.success && res.question) {
      const pubRes = await publishQuestionAction(res.question.id);
      setIsSubmitting(false);
      if (pubRes.success) {
        setFeedbackMsg({ type: 'success', text: `Question published to live pool! (Version: v1)` });
        setTimeout(() => router.push('/studio'), 1200);
      } else {
        setFeedbackMsg({ type: 'error', text: pubRes.error || 'Created draft but failed to publish' });
      }
    } else {
      setIsSubmitting(false);
      setFeedbackMsg({ type: 'error', text: res.error || 'Failed to save question' });
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            href="/studio"
            className="text-fg-muted hover:text-fg inline-flex items-center gap-1.5 text-sm transition-colors mb-1"
          >
            <ArrowLeft className="h-4 w-4" /> Back to Question Bank
          </Link>
          <h1 className="text-fg text-2xl font-bold tracking-tight">Interactive Question Authoring</h1>
          <p className="text-fg-muted text-sm">
            Configure D13 progressive hints, distractor trap archetypes, and Socratic walkthrough steps.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
            disabled={isSubmitting}
            className="gap-1.5"
          >
            <Save className="h-3.5 w-3.5" /> Save Draft
          </Button>
          <Button
            size="sm"
            onClick={handlePublishDirect}
            disabled={isSubmitting}
            className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
          >
            <CheckCircle2 className="h-3.5 w-3.5" /> Publish Item (v1)
          </Button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-3 rounded-lg text-sm border ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300'
              : 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300'
          }`}
        >
          {feedbackMsg.text}
        </div>
      )}

      {/* D6 Immutability Rule Callout */}
      <div className="bg-surface-2 border-border flex items-start gap-3 rounded-xl border p-4 text-xs text-fg-muted">
        <GitBranch className="h-4 w-4 text-accent shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-fg">D6 Immutability Guarantee: </span>
          Once published, any subsequent edits automatically fork a new immutable <code className="bg-canvas px-1 rounded">question_version (v2)</code>.
          Past exam sessions and learner mistake logs remain permanently pinned to their original version.
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-border border-b flex space-x-2">
        {[
          { id: 'prompt', label: '1. Prompt & Choices', icon: FileText },
          { id: 'hints', label: '2. 3-Tier Hint Ladder', icon: HelpCircle },
          { id: 'traps', label: '3. Distractor Trap Tags', icon: AlertTriangle },
          { id: 'socratic', label: '4. Socratic Solver', icon: Sparkles },
          { id: 'preview', label: '5. Learner Preview', icon: Eye },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition-all ${
                isActive
                  ? 'border-accent text-accent'
                  : 'border-transparent text-fg-muted hover:text-fg'
              }`}
            >
              <Icon className="h-4 w-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: Prompt & Choices */}
      {activeTab === 'prompt' && (
        <div className="space-y-4">
          <Card className="p-5 space-y-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-fg text-xs font-semibold">Section</label>
                <select
                  value={section}
                  onChange={(e) => setSection(e.target.value as 'quant' | 'verbal')}
                  className="bg-surface border-border mt-1 block w-full rounded-md border p-2 text-xs"
                >
                  <option value="quant">Quantitative Reasoning</option>
                  <option value="verbal">Verbal Reasoning</option>
                </select>
              </div>

              <div>
                <label className="text-fg text-xs font-semibold">Question Type</label>
                <select
                  value={questionType}
                  onChange={(e) => setQuestionType(e.target.value)}
                  className="bg-surface border-border mt-1 block w-full rounded-md border p-2 text-xs"
                >
                  <option value="gre_qc">Quantitative Comparison (QC)</option>
                  <option value="gre_mc_single">Single-Answer MCQ</option>
                  <option value="gre_mc_multi">Multi-Select MCQ</option>
                  <option value="gre_numeric_single">Numeric Entry</option>
                  <option value="gre_tc_1">Text Completion (1 Blank)</option>
                  <option value="gre_se">Sentence Equivalence</option>
                </select>
              </div>

              <div>
                <label className="text-fg text-xs font-semibold">Topic Slug</label>
                <input
                  type="text"
                  value={topicSlug}
                  onChange={(e) => setTopicSlug(e.target.value)}
                  className="bg-surface border-border mt-1 block w-full rounded-md border p-2 text-xs font-mono"
                />
              </div>
            </div>

            <div>
              <label className="text-fg text-xs font-semibold">Question Prompt (Markdown)</label>
              <textarea
                rows={5}
                value={promptMd}
                onChange={(e) => setPromptMd(e.target.value)}
                className="bg-surface border-border mt-1 block w-full rounded-md border p-3 text-xs font-mono"
              />
            </div>

            <div>
              <label className="text-fg text-xs font-semibold">Choices (Select Correct Key)</label>
              <div className="mt-2 space-y-2">
                {options.map((opt, idx) => (
                  <div key={opt.id} className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="correct_choice"
                      checked={correctAnswer === opt.id}
                      onChange={() => setCorrectAnswer(opt.id)}
                      className="accent-accent h-4 w-4"
                    />
                    <span className="text-fg-muted font-bold text-xs uppercase w-6">
                      {String.fromCharCode(65 + idx)}:
                    </span>
                    <input
                      type="text"
                      value={opt.label}
                      onChange={(e) => {
                        const newOpts = [...options];
                        newOpts[idx] = { ...opt, label: e.target.value };
                        setOptions(newOpts);
                      }}
                      className="bg-surface border-border flex-1 rounded-md border p-2 text-xs"
                    />
                    {correctAnswer === opt.id && (
                      <Badge variant="default" className="text-[10px] bg-emerald-600 text-white">
                        Correct Key
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-fg text-xs font-semibold">Comprehensive Written Explanation</label>
              <textarea
                rows={4}
                value={writtenExplanationMd}
                onChange={(e) => setWrittenExplanationMd(e.target.value)}
                className="bg-surface border-border mt-1 block w-full rounded-md border p-3 text-xs"
              />
            </div>
          </Card>
        </div>
      )}

      {/* TAB 2: 3-Tier Hint Ladder */}
      {activeTab === 'hints' && (
        <Card className="p-5 space-y-4">
          <div className="border-b border-border pb-2">
            <h3 className="text-fg text-sm font-bold">D13 Progressive Hint Ladder</h3>
            <p className="text-fg-muted text-xs">
              Learners unlock hints sequentially without score penalty in practice mode.
            </p>
          </div>

          <div>
            <label className="text-fg text-xs font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-accent" />
              Tier 1: Concept Nudge (High-level formula or pivot rule)
            </label>
            <input
              type="text"
              value={hint1}
              onChange={(e) => setHint1(e.target.value)}
              className="bg-surface border-border mt-1 block w-full rounded-md border p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="text-fg text-xs font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-amber-500" />
              Tier 2: Setup / Elimination (Algebraic rearrangement or distractor elimination)
            </label>
            <input
              type="text"
              value={hint2}
              onChange={(e) => setHint2(e.target.value)}
              className="bg-surface border-border mt-1 block w-full rounded-md border p-2.5 text-xs"
            />
          </div>

          <div>
            <label className="text-fg text-xs font-semibold flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              Tier 3: Final Bridge (Last step before solution without directly giving answer)
            </label>
            <input
              type="text"
              value={hint3}
              onChange={(e) => setHint3(e.target.value)}
              className="bg-surface border-border mt-1 block w-full rounded-md border p-2.5 text-xs"
            />
          </div>
        </Card>
      )}

      {/* TAB 3: Distractor Trap Archetypes */}
      {activeTab === 'traps' && (
        <Card className="p-5 space-y-4">
          <div className="border-b border-border pb-2">
            <h3 className="text-fg text-sm font-bold">Distractor Trap Archetypes</h3>
            <p className="text-fg-muted text-xs">
              When a student chooses a wrong option, the system delivers an immediate Second-Chance diagnostic explaining WHY that choice is an ETS trap.
            </p>
          </div>

          <div className="space-y-4">
            {options
              .filter((opt) => opt.id !== correctAnswer)
              .map((opt) => {
                const currentTrap = traps[opt.id] || {
                  tag: 'formula_misapplication',
                  explanation: '',
                };

                return (
                  <div key={opt.id} className="bg-surface-2 border-border rounded-lg border p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-fg text-xs font-bold">{opt.label}</span>
                      <select
                        value={currentTrap.tag}
                        onChange={(e) => {
                          setTraps({
                            ...traps,
                            [opt.id]: {
                              ...currentTrap,
                              tag: e.target.value as TrapArchetype,
                            },
                          });
                        }}
                        className="bg-surface border-border rounded border p-1 text-xs"
                      >
                        {TRAP_ARCHETYPES.map((tag) => (
                          <option key={tag} value={tag}>
                            {tag.replace(/_/g, ' ')}
                          </option>
                        ))}
                      </select>
                    </div>

                    <input
                      type="text"
                      placeholder="Why is this choice an ETS distractor trap?"
                      value={currentTrap.explanation}
                      onChange={(e) => {
                        setTraps({
                          ...traps,
                          [opt.id]: {
                            ...currentTrap,
                            explanation: e.target.value,
                          },
                        });
                      }}
                      className="bg-surface border-border w-full rounded border p-2 text-xs"
                    />
                  </div>
                );
              })}
          </div>
        </Card>
      )}

      {/* TAB 4: Socratic Solver */}
      {activeTab === 'socratic' && (
        <Card className="p-5 space-y-4">
          <div className="border-b border-border pb-2">
            <h3 className="text-fg text-sm font-bold">Socratic Step-by-Step Solver</h3>
            <p className="text-fg-muted text-xs">
              Interactive 2 to 4 micro-steps allowing learners to reconstruct the problem logic.
            </p>
          </div>

          <div className="space-y-4">
            {socraticSteps.map((step, idx) => (
              <div key={step.step_index} className="bg-surface-2 border-border rounded-lg border p-3 space-y-2">
                <div className="text-fg text-xs font-bold">Step {step.step_index}</div>
                <input
                  type="text"
                  value={step.prompt_md}
                  onChange={(e) => {
                    const newSteps = [...socraticSteps];
                    newSteps[idx] = { ...step, prompt_md: e.target.value };
                    setSocraticSteps(newSteps);
                  }}
                  className="bg-surface border-border w-full rounded border p-2 text-xs"
                  placeholder="Micro-question prompt"
                />

                <div className="grid grid-cols-2 gap-2 text-xs">
                  {step.options.map((optStr, optIdx) => (
                    <div key={optIdx} className="flex items-center gap-1.5">
                      <input
                        type="radio"
                        name={`socratic_key_${idx}`}
                        checked={step.correct_option_index === optIdx}
                        onChange={() => {
                          const newSteps = [...socraticSteps];
                          newSteps[idx] = { ...step, correct_option_index: optIdx };
                          setSocraticSteps(newSteps);
                        }}
                      />
                      <input
                        type="text"
                        value={optStr}
                        onChange={(e) => {
                          const newOpts = [...step.options];
                          newOpts[optIdx] = e.target.value;
                          const newSteps = [...socraticSteps];
                          newSteps[idx] = { ...step, options: newOpts };
                          setSocraticSteps(newSteps);
                        }}
                        className="bg-surface border-border flex-1 rounded border p-1 text-xs"
                      />
                    </div>
                  ))}
                </div>

                <input
                  type="text"
                  value={step.takeaway_md}
                  onChange={(e) => {
                    const newSteps = [...socraticSteps];
                    newSteps[idx] = { ...step, takeaway_md: e.target.value };
                    setSocraticSteps(newSteps);
                  }}
                  className="bg-surface border-border w-full rounded border p-1.5 text-xs text-fg-muted"
                  placeholder="Takeaway key concept"
                />
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 5: Live Learner Preview */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          <Card className="p-6 space-y-4 border-accent/40 shadow-sm">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <Badge variant="outline" className="text-xs">
                Live Learner Simulation
              </Badge>
              <span className="text-xs text-fg-muted font-mono">{topicSlug}</span>
            </div>

            <div className="text-fg whitespace-pre-wrap font-medium text-sm">
              {promptMd}
            </div>

            <div className="space-y-2 pt-2">
              {options.map((opt, idx) => (
                <div
                  key={opt.id}
                  className={`p-3 rounded-lg border text-xs flex items-center justify-between ${
                    opt.id === correctAnswer
                      ? 'border-emerald-500/40 bg-emerald-500/5 text-fg'
                      : 'border-border bg-surface text-fg-muted'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{String.fromCharCode(65 + idx)}:</span>
                    <span>{opt.label}</span>
                  </div>
                  {opt.id === correctAnswer && (
                    <Badge variant="default" className="text-[10px] bg-emerald-600 text-white">
                      Target Answer
                    </Badge>
                  )}
                </div>
              ))}
            </div>

            {/* Hint Ladder Simulation */}
            <div className="pt-4 border-t border-border space-y-2">
              <div className="text-xs font-bold text-fg">Tier 1 Hint Preview:</div>
              <Callout type="concept" title="Tier 1: Concept Nudge">
                {hint1}
              </Callout>
            </div>

            {/* Trap Diagnostic Simulation */}
            <div className="space-y-2">
              <div className="text-xs font-bold text-fg">Distractor Trap Diagnostic Preview:</div>
              <Callout type="trap" title="Why Choice C is a Trap">
                {traps['choice_c']?.explanation || 'Common trap'}
              </Callout>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
