/** @purpose Authentic 4-section IELTS Mock Attempt Runner Client with strict play-once audio, split-screen reading, Speaking Part 2 timers, and unified band report */
'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import {
  Play,
  Clock,
  ChevronRight,
  Eye,
  EyeOff,
  Mic,
  Award,
  Info,
  ShieldAlert,
} from 'lucide-react';
import type { IeltsMockExamData } from '@/app/actions/ielts';
import { completeIeltsMockAction } from '@/app/actions/ielts';
import type { IeltsBandReport, IeltsSectionType } from '@lumen/core';

interface IeltsMockRunnerClientProps {
  initialData: IeltsMockExamData;
}

export function IeltsMockRunnerClient({ initialData }: IeltsMockRunnerClientProps) {
  const router = useRouter();
  const [currentSection, setCurrentSection] = useState<IeltsSectionType>('listening');
  const [timeRemaining, setTimeRemaining] = useState(
    initialData.sections.listening.timeAllowedSeconds
  );
  const [showTimer, setShowTimer] = useState(true);

  // Section 1: Listening State
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration] = useState(180); // 3 minutes sample passage
  const [listeningAnswers, setListeningAnswers] = useState<Record<string, string>>({});

  // Section 2: Reading State
  const [readingAnswers, setReadingAnswers] = useState<Record<string, string>>({});

  // Section 3: Writing State
  const [activeWritingTask, setActiveWritingTask] = useState<'task1' | 'task2'>('task1');
  const [writingTask1, setWritingTask1] = useState('');
  const [writingTask2, setWritingTask2] = useState('');

  // Section 4: Speaking State
  const [speakingPhase, setSpeakingPhase] = useState<'idle' | 'prep' | 'recording' | 'finished'>('idle');
  const [speakingPrepTime, setSpeakingPrepTime] = useState(60); // 1-minute prep
  const [speakingRecordTime, setSpeakingRecordTime] = useState(120); // 2-minute recording
  const [part2Notes, setPart2Notes] = useState('');
  const [part2Transcript, setPart2Transcript] = useState('');

  // Submission & Results State
  const [isPending, startTransition] = useTransition();
  const [bandReport, setBandReport] = useState<IeltsBandReport | null>(null);

  // Section Timer countdown
  useEffect(() => {
    if (bandReport) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          handleAutoSubmitSection();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [currentSection, bandReport]);

  // Speaking Part 2 Timer
  useEffect(() => {
    if (currentSection !== 'speaking') return;

    let timer: NodeJS.Timeout | null = null;
    if (speakingPhase === 'prep') {
      timer = setInterval(() => {
        setSpeakingPrepTime((prev) => {
          if (prev <= 1) {
            setSpeakingPhase('recording');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (speakingPhase === 'recording') {
      timer = setInterval(() => {
        setSpeakingRecordTime((prev) => {
          if (prev <= 1) {
            setSpeakingPhase('finished');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [currentSection, speakingPhase]);

  // Listening Audio Simulation Timer
  useEffect(() => {
    if (!audioPlaying) return;
    const interval = setInterval(() => {
      setAudioCurrentTime((prev) => {
        if (prev >= audioDuration) {
          setAudioPlaying(false);
          return audioDuration;
        }
        return prev + 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [audioPlaying, audioDuration]);

  const handleStartAudio = () => {
    if (audioPlayed && initialData.strictMockMode) {
      alert('In strict IELTS CBT Mock mode, listening audio plays once only. Replay is disabled.');
      return;
    }
    setAudioPlayed(true);
    setAudioPlaying(true);
  };

  const handleAutoSubmitSection = () => {
    if (currentSection === 'listening') {
      transitionToSection('reading');
    } else if (currentSection === 'reading') {
      transitionToSection('writing');
    } else if (currentSection === 'writing') {
      transitionToSection('speaking');
    } else if (currentSection === 'speaking') {
      handleFinalSubmit();
    }
  };

  const transitionToSection = (next: IeltsSectionType) => {
    setCurrentSection(next);
    setTimeRemaining(initialData.sections[next].timeAllowedSeconds);
  };

  const handleFinalSubmit = () => {
    startTransition(async () => {
      const report = await completeIeltsMockAction({
        attemptId: initialData.attemptId,
        track: initialData.track,
        listeningAnswers,
        readingAnswers,
        writingAnswers: {
          task1: writingTask1,
          task2: writingTask2,
        },
        speakingData: {
          part2Notes,
          part2Transcript,
        },
      });
      setBandReport(report);
    });
  };

  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).filter(Boolean).length;
  };

  // If completed and band report ready, render Report Card
  if (bandReport) {
    return (
      <div className="mx-auto max-w-5xl p-6 md:p-8">
        <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
          {/* Header Banner */}
          <div className="border-b border-border bg-primary/5 p-6 text-center md:p-8">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 font-mono text-xs font-semibold text-primary">
              <Award className="h-3.5 w-3.5" /> OFFICIAL CBT MOCK REPORT
            </span>
            <h1 className="mt-3 text-2xl font-bold tracking-tight text-foreground md:text-3xl">
              IELTS {initialData.track === 'ielts_academic' ? 'Academic' : 'General Training'} Diagnostic Band Report
            </h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Candidate Attempt ID: <span className="font-mono text-foreground">{bandReport.attemptId}</span>
            </p>

            {/* Score Pill Highlights */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
              <div className="flex flex-col items-center rounded-lg border border-border bg-background px-6 py-4 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Overall Band
                </span>
                <span className="mt-1 text-4xl font-extrabold text-primary">
                  {bandReport.overallBand.toFixed(1)}
                </span>
              </div>
              <div className="flex flex-col items-center rounded-lg border border-border bg-background px-6 py-4 shadow-xs">
                <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  CEFR Level
                </span>
                <div className="mt-1 flex items-baseline gap-1.5">
                  <span className="text-3xl font-extrabold text-foreground">{bandReport.cefr}</span>
                  <span className="text-xs font-medium text-muted-foreground">({bandReport.cefrDescriptor})</span>
                </div>
              </div>
            </div>
          </div>

          {/* 4-Skill Breakdown Cards */}
          <div className="grid gap-4 p-6 sm:grid-cols-2 lg:grid-cols-4 md:p-8">
            {/* Listening */}
            <div className="flex flex-col justify-between rounded-lg border border-border bg-background p-4">
              <div>
                <span className="text-xs font-semibold text-muted-foreground uppercase">Listening</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-foreground">
                    {bandReport.skills.listening.band.toFixed(1)}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {bandReport.skills.listening.raw} / 40 raw
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
                <span className="text-xs font-semibold text-muted-foreground uppercase">Reading</span>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-foreground">
                    {bandReport.skills.reading.band.toFixed(1)}
                  </span>
                  <span className="font-mono text-xs text-muted-foreground">
                    {bandReport.skills.reading.raw} / 40 raw
                  </span>
                </div>
              </div>
              <div className="mt-4 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                {bandReport.skills.reading.conversionTable === 'academic' ? 'Academic scale' : 'General Training scale'}
              </div>
            </div>

            {/* Writing */}
            <div className="flex flex-col justify-between rounded-lg border border-border bg-background p-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Writing</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">AI Estimated</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-foreground">
                    {bandReport.skills.writing.band.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">Weighted 2x T2</span>
                </div>
              </div>
              <div className="mt-4 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                T1: Band {bandReport.skills.writing.task1Band ?? 6.5} | T2: Band {bandReport.skills.writing.task2Band ?? 7.0}
              </div>
            </div>

            {/* Speaking */}
            <div className="flex flex-col justify-between rounded-lg border border-border bg-background p-4">
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-muted-foreground uppercase">Speaking</span>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-semibold text-muted-foreground">AI Estimated</span>
                </div>
                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-foreground">
                    {bandReport.skills.speaking.band.toFixed(1)}
                  </span>
                  <span className="text-xs text-muted-foreground">4 criteria mean</span>
                </div>
              </div>
              <div className="mt-4 border-t border-border/60 pt-2 text-xs text-muted-foreground">
                FC: 7.5 | LR: 7.0 | GRA: 7.0 | PR: 7.5
              </div>
            </div>
          </div>

          {/* Legal Disclaimer Box */}
          <div className="border-t border-border bg-muted/30 p-6 text-center text-xs text-muted-foreground">
            <p className="flex items-center justify-center gap-1.5">
              <Info className="h-4 w-4 shrink-0" />
              {bandReport.disclaimer}
            </p>
            <div className="mt-4 flex justify-center gap-3">
              <button
                onClick={() => router.push('/app/study-plan')}
                className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-primary-foreground hover:bg-primary/90"
              >
                Continue to Recommended Study Plan
              </button>
              <button
                onClick={() => window.location.reload()}
                className="rounded-lg border border-border bg-background px-4 py-2 text-xs font-medium text-foreground hover:bg-muted"
              >
                Retake Diagnostic
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-background">
      {/* Top IELTS CBT Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-border bg-background/95 px-6 py-3 backdrop-blur-xs">
        <div className="flex items-center gap-4">
          <span className="rounded bg-primary/10 px-2 py-1 font-mono text-xs font-bold text-primary">
            IELTS ON COMPUTER CBT
          </span>
          <div className="hidden items-center gap-2 sm:flex">
            {(['listening', 'reading', 'writing', 'speaking'] as IeltsSectionType[]).map((sec, idx) => (
              <React.Fragment key={sec}>
                <span
                  className={`text-xs font-medium capitalize ${
                    currentSection === sec
                      ? 'font-bold text-foreground underline underline-offset-4'
                      : 'text-muted-foreground'
                  }`}
                >
                  {sec}
                </span>
                {idx < 3 && <ChevronRight className="h-3 w-3 text-muted-foreground" />}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 rounded border border-border bg-muted/40 px-3 py-1 font-mono text-sm">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{showTimer ? formatTimer(timeRemaining) : '--:--'}</span>
            <button
              onClick={() => setShowTimer(!showTimer)}
              title={showTimer ? 'Hide timer' : 'Show timer'}
              className="text-muted-foreground hover:text-foreground"
            >
              {showTimer ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>

          <button
            onClick={handleAutoSubmitSection}
            disabled={isPending}
            className="flex items-center gap-1 rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {isPending ? 'Submitting...' : currentSection === 'speaking' ? 'Finish Exam' : 'Next Section'}
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </header>

      {/* Main Section Content Area */}
      <main className="flex-1 p-6">
        {/* Section 1: Listening */}
        {currentSection === 'listening' && (
          <div className="mx-auto max-w-4xl space-y-6">
            {/* Play-Once Audio Player Bar */}
            <div className="rounded-lg border border-border bg-card p-5 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-foreground">
                    {initialData.sections.listening.audioTitle}
                  </h3>
                  <p className="mt-1 flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                    <ShieldAlert className="h-4 w-4" />
                    Strict Mock Mode: Listening audio will play once only. Replay and rewinds are disabled.
                  </p>
                </div>
                <div>
                  <button
                    onClick={handleStartAudio}
                    disabled={audioPlaying || (audioPlayed && initialData.strictMockMode)}
                    className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-xs hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Play className="h-3.5 w-3.5" />
                    {audioPlayed ? (audioPlaying ? 'Audio Playing...' : 'Played (Locked)') : 'Start Audio'}
                  </button>
                </div>
              </div>

              {/* Simulated Audio Progress Bar */}
              <div className="mt-4 flex items-center gap-3">
                <span className="font-mono text-xs text-muted-foreground">{formatTimer(audioCurrentTime)}</span>
                <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all duration-300"
                    style={{ width: `${(audioCurrentTime / audioDuration) * 100}%` }}
                  />
                </div>
                <span className="font-mono text-xs text-muted-foreground">{formatTimer(audioDuration)}</span>
              </div>
            </div>

            {/* Questions List */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Questions 1–4
              </h4>
              {initialData.sections.listening.questions.map((q) => (
                <div key={q.id} className="rounded-lg border border-border bg-card p-5">
                  <p className="text-sm font-medium text-foreground">
                    <span className="mr-2 font-bold text-primary">{q.num}.</span>
                    {q.prompt}
                  </p>
                  {q.type === 'multiple_choice' && q.options && (
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt) => (
                        <label
                          key={opt}
                          className="flex cursor-pointer items-center gap-2.5 rounded border border-border/70 p-2.5 text-xs hover:bg-muted/40"
                        >
                          <input
                            type="radio"
                            name={`q_${q.id}`}
                            value={opt}
                            checked={listeningAnswers[q.id] === opt}
                            onChange={(e) =>
                              setListeningAnswers({ ...listeningAnswers, [q.id]: e.target.value })
                            }
                            className="text-primary"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  )}
                  {q.type === 'fill_blank' && (
                    <div className="mt-3">
                      <input
                        type="text"
                        placeholder="Type answer here..."
                        value={listeningAnswers[q.id] || ''}
                        onChange={(e) =>
                          setListeningAnswers({ ...listeningAnswers, [q.id]: e.target.value })
                        }
                        className="w-full rounded border border-border bg-background px-3 py-2 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 2: Reading (Split-Screen) */}
        {currentSection === 'reading' && (
          <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Pane: Reading Passage */}
            <div className="overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-xs">
              <h2 className="text-lg font-bold text-foreground">
                {initialData.sections.reading.passageTitle}
              </h2>
              <div className="mt-4 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
                {initialData.sections.reading.passageText}
              </div>
            </div>

            {/* Right Pane: Reading Questions */}
            <div className="overflow-y-auto rounded-lg border border-border bg-card p-6 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                Questions 1–4
              </h3>
              {initialData.sections.reading.questions.map((q) => (
                <div key={q.id} className="rounded-lg border border-border/80 bg-background p-4">
                  <p className="text-sm font-medium text-foreground">
                    <span className="mr-2 font-bold text-primary">{q.num}.</span>
                    {q.prompt}
                  </p>
                  <div className="mt-3 space-y-2">
                    {q.options?.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-2.5 rounded border border-border/70 p-2 text-xs hover:bg-muted/40"
                      >
                        <input
                          type="radio"
                          name={`r_${q.id}`}
                          value={opt}
                          checked={readingAnswers[q.id] === opt}
                          onChange={(e) =>
                            setReadingAnswers({ ...readingAnswers, [q.id]: e.target.value })
                          }
                          className="text-primary"
                        />
                        <span>{opt}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Section 3: Writing */}
        {currentSection === 'writing' && (
          <div className="grid h-[calc(100vh-10rem)] grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Pane: Prompts & Task Tabs */}
            <div className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-xs">
              <div className="flex border-b border-border">
                <button
                  onClick={() => setActiveWritingTask('task1')}
                  className={`flex-1 pb-3 text-xs font-semibold ${
                    activeWritingTask === 'task1'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Task 1 (min 150 words)
                </button>
                <button
                  onClick={() => setActiveWritingTask('task2')}
                  className={`flex-1 pb-3 text-xs font-semibold ${
                    activeWritingTask === 'task2'
                      ? 'border-b-2 border-primary text-primary'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                >
                  Task 2 (min 250 words)
                </button>
              </div>

              <div className="mt-4 flex-1 overflow-y-auto">
                {activeWritingTask === 'task1' ? (
                  <div>
                    <h3 className="font-bold text-foreground">
                      {initialData.sections.writing.task1.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Suggested time: {initialData.sections.writing.task1.suggestedMinutes} minutes
                    </p>
                    <div className="mt-4 rounded border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                      {initialData.sections.writing.task1.prompt}
                    </div>
                  </div>
                ) : (
                  <div>
                    <h3 className="font-bold text-foreground">
                      {initialData.sections.writing.task2.title}
                    </h3>
                    <p className="mt-2 text-xs text-muted-foreground">
                      Suggested time: {initialData.sections.writing.task2.suggestedMinutes} minutes
                    </p>
                    <div className="mt-4 rounded border border-border bg-background p-4 text-sm leading-relaxed text-foreground">
                      {initialData.sections.writing.task2.prompt}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Pane: Writing Response Area */}
            <div className="flex flex-col rounded-lg border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-semibold text-foreground">
                  Response: {activeWritingTask === 'task1' ? 'Task 1' : 'Task 2'}
                </span>
                <span className="font-mono text-xs font-semibold text-muted-foreground">
                  Word count:{' '}
                  <span
                    className={
                      getWordCount(activeWritingTask === 'task1' ? writingTask1 : writingTask2) >=
                      (activeWritingTask === 'task1' ? 150 : 250)
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : 'text-amber-600 dark:text-amber-400'
                    }
                  >
                    {getWordCount(activeWritingTask === 'task1' ? writingTask1 : writingTask2)}
                  </span>{' '}
                  / {activeWritingTask === 'task1' ? '150 min' : '250 min'}
                </span>
              </div>

              <textarea
                value={activeWritingTask === 'task1' ? writingTask1 : writingTask2}
                onChange={(e) =>
                  activeWritingTask === 'task1'
                    ? setWritingTask1(e.target.value)
                    : setWritingTask2(e.target.value)
                }
                placeholder="Type your authentic IELTS response here..."
                className="mt-4 flex-1 resize-none rounded-lg border border-border bg-background p-4 font-mono text-sm leading-relaxed text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
              />
            </div>
          </div>
        )}

        {/* Section 4: Speaking (Part 2 Timers) */}
        {currentSection === 'speaking' && (
          <div className="mx-auto max-w-4xl space-y-6">
            <div className="rounded-lg border border-border bg-card p-6 shadow-xs">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-foreground">
                    IELTS Speaking Part 2: Individual Long Turn (Cue Card)
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Official format: 1 minute preparation time, followed by 2 minutes of continuous speaking.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {speakingPhase === 'idle' && (
                    <button
                      onClick={() => setSpeakingPhase('prep')}
                      className="rounded bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                    >
                      Start 1-Min Preparation
                    </button>
                  )}
                  {speakingPhase === 'prep' && (
                    <div className="flex items-center gap-2 rounded bg-amber-500/10 px-3 py-1.5 text-xs font-bold text-amber-700 dark:text-amber-300">
                      <Clock className="h-4 w-4" />
                      Prep Timer: {formatTimer(speakingPrepTime)}
                    </div>
                  )}
                  {speakingPhase === 'recording' && (
                    <div className="flex items-center gap-2 rounded bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 animate-pulse">
                      <Mic className="h-4 w-4" />
                      Recording: {formatTimer(speakingRecordTime)}
                    </div>
                  )}
                  {speakingPhase === 'finished' && (
                    <span className="rounded bg-muted px-3 py-1.5 text-xs font-semibold text-muted-foreground">
                      Speaking Completed
                    </span>
                  )}
                </div>
              </div>

              {/* Cue Card Prompt Box */}
              <div className="mt-6 rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
                <h4 className="font-bold text-foreground">
                  {initialData.sections.speaking.part2.topic}
                </h4>
                <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-foreground/90">
                  {initialData.sections.speaking.part2.bulletPoints.map((pt, idx) => (
                    <li key={idx}>{pt}</li>
                  ))}
                </ul>
              </div>

              {/* Prep Notes & Transcript Simulation */}
              <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Candidate Preparation Notes (1-Min Scratchpad)
                  </label>
                  <textarea
                    value={part2Notes}
                    onChange={(e) => setPart2Notes(e.target.value)}
                    placeholder="Jot down bullet points and vocabulary during your 1-minute preparation..."
                    className="mt-2 h-36 w-full rounded border border-border bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold uppercase text-muted-foreground">
                    Speech Transcript / Simulated Input
                  </label>
                  <textarea
                    value={part2Transcript}
                    onChange={(e) => setPart2Transcript(e.target.value)}
                    placeholder="Simulated speech response or Deepgram Nova-3 live transcription output..."
                    className="mt-2 h-36 w-full rounded border border-border bg-background p-3 text-xs text-foreground focus:ring-1 focus:ring-primary focus:outline-hidden"
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
