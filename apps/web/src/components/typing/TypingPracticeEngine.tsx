/** @purpose Monkeytype-architecture CD-IELTS & GRE Typing Speed & Accuracy Studio engine in Lumen editorial design */
'use client';

import React, { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
import { RotateCcw, Eye, EyeOff, Target, AlertCircle, Volume2 } from 'lucide-react';
import {
  LEXICAL_UPGRADE_PAIRS,
  LISTENING_DICTATION_ITEMS,
  TYPING_CORPORA,
  buildTypingWords,
  calculateAccuracy,
  calculateConsistency,
  calculateIeltsParagraphSplits,
  calculateNetWpm,
  calculateRawWpm,
  computeCorpusCharTotals,
  computeWordCharStates,
  evaluateIeltsTypingReadiness,
  type TypingCorpusId,
} from '@/src/content/typing-corpora';
import {
  WorkspaceDataTable,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
} from '@/src/components/ui/WorkspacePrimitives';

export type CurriculumDrillMode =
  | 'copy-flow'
  | 'listening-dictation'
  | 'lexical-upgrade'
  | 'exam-pacing';
export type TypingMode = 'time' | 'words' | 'exam-corpus';
export type TimeOption = 15 | 30 | 60 | 120;
export type WordCountOption = 25 | 50 | 150 | 250;
export type CaretStyle = 'line' | 'block' | 'underline';
export type TestStatus = 'idle' | 'running' | 'finished';

export interface TelemetryPoint {
  second: number;
  netWpm: number;
  rawWpm: number;
  errors: number;
}

export interface MistypedWordRecord {
  wordIndex: number;
  target: string;
  typed: string;
  c: number;
  i: number;
  e: number;
  m: number;
}

export interface CompletedTypingResult {
  netWpm: number;
  rawWpm: number;
  accuracy: number;
  consistency: number;
  elapsedSeconds: number;
  counts: { c: number; i: number; e: number; m: number };
  telemetry: TelemetryPoint[];
  mistypedWords: MistypedWordRecord[];
  corpusTitle: string;
  isSamplePreview?: boolean;
}

export interface TypingPracticeEngineProps {
  variant?: 'learner' | 'public';
  initialCorpus?: TypingCorpusId;
}

const SAMPLE_PREVIEW_RESULT: CompletedTypingResult = {
  netWpm: 58,
  rawWpm: 63,
  accuracy: 96.4,
  consistency: 89,
  elapsedSeconds: 30,
  counts: { c: 145, i: 3, e: 1, m: 2 },
  corpusTitle: 'IELTS Task 2 — Band 8.5 Discursive Prose',
  isSamplePreview: true,
  telemetry: [
    { second: 1, netWpm: 48, rawWpm: 52, errors: 0 },
    { second: 3, netWpm: 55, rawWpm: 58, errors: 0 },
    { second: 6, netWpm: 60, rawWpm: 65, errors: 1 },
    { second: 9, netWpm: 54, rawWpm: 61, errors: 1 },
    { second: 12, netWpm: 59, rawWpm: 63, errors: 0 },
    { second: 15, netWpm: 61, rawWpm: 64, errors: 0 },
    { second: 18, netWpm: 56, rawWpm: 62, errors: 1 },
    { second: 21, netWpm: 58, rawWpm: 63, errors: 0 },
    { second: 24, netWpm: 60, rawWpm: 64, errors: 0 },
    { second: 27, netWpm: 57, rawWpm: 62, errors: 0 },
    { second: 30, netWpm: 58, rawWpm: 63, errors: 0 },
  ],
  mistypedWords: [
    { wordIndex: 4, target: 'consequently', typed: 'consequntly', c: 11, i: 0, e: 0, m: 1 },
    { wordIndex: 11, target: 'accommodation', typed: 'acommodation', c: 12, i: 0, e: 0, m: 1 },
    { wordIndex: 18, target: 'questionnaire', typed: 'questionairee', c: 11, i: 1, e: 1, m: 0 },
  ],
};

function DualAxisTelemetryChart({
  telemetry,
  isBn,
}: {
  telemetry: readonly TelemetryPoint[];
  isBn: boolean;
}) {
  const width = 760;
  const height = 220;
  const padLeft = 44;
  const padRight = 40;
  const padTop = 20;
  const padBottom = 34;
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;

  const safePoints: readonly TelemetryPoint[] =
    telemetry.length >= 2
      ? telemetry
      : [
          { second: 0, netWpm: telemetry[0]?.netWpm ?? 0, rawWpm: telemetry[0]?.rawWpm ?? 0, errors: 0 },
          {
            second: telemetry[0]?.second ?? 1,
            netWpm: telemetry[0]?.netWpm ?? 0,
            rawWpm: telemetry[0]?.rawWpm ?? 0,
            errors: telemetry[0]?.errors ?? 0,
          },
        ];

  const minSec = safePoints[0]?.second ?? 0;
  const maxSec = Math.max(minSec + 1, safePoints[safePoints.length - 1]?.second ?? 1);
  const maxWpm = Math.max(
    40,
    ...safePoints.map((p) => Math.max(p.netWpm, p.rawWpm) + 10),
  );
  const maxErr = Math.max(3, ...safePoints.map((p) => p.errors));

  const xFor = (sec: number) =>
    padLeft + ((sec - minSec) / (maxSec - minSec)) * plotW;
  const yForWpm = (wpm: number) =>
    padTop + plotH - (Math.max(0, wpm) / maxWpm) * plotH;
  const yForErr = (err: number) =>
    padTop + plotH - (Math.max(0, err) / maxErr) * plotH;

  const netPath = safePoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${xFor(p.second).toFixed(1)} ${yForWpm(p.netWpm).toFixed(1)}`)
    .join(' ');
  const rawPath = safePoints
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${xFor(p.second).toFixed(1)} ${yForWpm(p.rawWpm).toFixed(1)}`)
    .join(' ');

  const yTicks = [0, Math.round(maxWpm / 2), Math.round(maxWpm)];
  const xTickIndices =
    safePoints.length <= 4
      ? safePoints.map((_, i) => i)
      : [0, Math.floor(safePoints.length / 2), safePoints.length - 1];

  return (
    <div className="border border-[var(--hairline)] bg-[var(--surface-paper)] rounded-[4px] p-5 mb-8">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <h3 className="text-sm font-bold text-[var(--brand-deep)]">
          {isBn
            ? 'প্রতি-সেকেন্ড গতি (WPM) ও ত্রুটির টেলিমেট্রি'
            : 'Per-Second Speed (WPM) & Error Telemetry'}
        </h3>
        <div className="flex flex-wrap items-center gap-5 text-xs text-[var(--text)]">
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-4 h-[2.5px] bg-[var(--brand-deep)]" />
            <span>{isBn ? 'নেট WPM' : 'Net WPM'}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-4 h-[2px] border-t-2 border-dashed border-[var(--text-muted)]" />
            <span>{isBn ? 'র WPM' : 'Raw WPM'}</span>
          </span>
          <span className="inline-flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 bg-[var(--brand)] rounded-[2px]" />
            <span>{isBn ? 'ত্রুটি (ডান অক্ষ)' : 'Errors (Right Axis)'}</span>
          </span>
        </div>
      </div>

      <div className="w-full overflow-x-auto">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto min-w-[460px]"
          role="img"
          aria-label={
            isBn
              ? 'প্রতি সেকেন্ড নেট WPM, র WPM এবং ত্রুটি চার্ট'
              : 'Second-by-second Net WPM, Raw WPM, and Errors chart'
          }
        >
          {/* Horizontal grid lines */}
          {yTicks.map((tick) => {
            const y = yForWpm(tick);
            return (
              <g key={tick}>
                <line
                  x1={padLeft}
                  y1={y}
                  x2={width - padRight}
                  y2={y}
                  stroke="var(--hairline)"
                  strokeWidth="1"
                />
                <text
                  x={padLeft - 8}
                  y={y + 4}
                  textAnchor="end"
                  fill="var(--text-muted)"
                  fontSize="11"
                  fontFamily="monospace"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {/* Right Y-axis error scale labels */}
          {[0, maxErr].map((errTick) => {
            const y = yForErr(errTick);
            return (
              <text
                key={`err-${errTick}`}
                x={width - padRight + 8}
                y={y + 4}
                textAnchor="start"
                fill="var(--brand)"
                fontSize="11"
                fontFamily="monospace"
              >
                {errTick}e
              </text>
            );
          })}

          {/* X-axis second labels */}
          {xTickIndices.map((idx) => {
            const pt = safePoints[idx];
            if (!pt) return null;
            return (
              <text
                key={`x-${pt.second}-${idx}`}
                x={xFor(pt.second)}
                y={height - 10}
                textAnchor="middle"
                fill="var(--text-muted)"
                fontSize="11"
                fontFamily="monospace"
              >
                {pt.second}s
              </text>
            );
          })}

          {/* Raw WPM dashed path */}
          <path
            d={rawPath}
            fill="none"
            stroke="var(--text-muted)"
            strokeWidth="1.75"
            strokeDasharray="5 4"
          />

          {/* Net WPM solid path */}
          <path
            d={netPath}
            fill="none"
            stroke="var(--brand-deep)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Error dots */}
          {safePoints.map((pt, idx) =>
            pt.errors > 0 ? (
              <circle
                key={`dot-${pt.second}-${idx}`}
                cx={xFor(pt.second)}
                cy={yForErr(pt.errors)}
                r="4"
                fill="var(--brand)"
              />
            ) : null,
          )}
        </svg>
      </div>
    </div>
  );
}

export function TypingPracticeEngine({
  variant = 'learner',
  initialCorpus = 'ielts-task2-band8',
}: TypingPracticeEngineProps) {
  const locale = useLocale();
  const isBn = locale === 'bn';

  // Monkeytype #testConfig state
  const [drillMode, setDrillMode] = useState<CurriculumDrillMode>('copy-flow');
  const [dictationIdx, setDictationIdx] = useState<number>(0);
  const [blindDictationMode, setBlindDictationMode] = useState<boolean>(true);
  const [lexicalIdx, setLexicalIdx] = useState<number>(0);
  const [pacingTask, setPacingTask] = useState<'task1' | 'task2' | 'gre-awa'>('task2');
  const [isSpeakingAudio, setIsSpeakingAudio] = useState<boolean>(false);

  const [mode, setMode] = useState<TypingMode>('time');
  const [timeLimit, setTimeLimit] = useState<TimeOption>(30);
  const [wordLimit, setWordLimit] = useState<WordCountOption>(50);
  const [corpusId, setCorpusId] = useState<TypingCorpusId>(initialCorpus);
  const [includePunctuation, setIncludePunctuation] = useState<boolean>(true);
  const [includeNumbers, setIncludeNumbers] = useState<boolean>(false);
  const [strictExamMode, setStrictExamMode] = useState<boolean>(false);
  const [caretStyle, setCaretStyle] = useState<CaretStyle>('line');

  // Seed / custom missed-words drill state
  const [seed, setSeed] = useState<number>(0);
  const [missedDrillWords, setMissedDrillWords] = useState<string[] | null>(null);

  // Live typing engine state
  const [status, setStatus] = useState<TestStatus>('idle');
  const [activeWordIdx, setActiveWordIdx] = useState<number>(0);
  const [typedWords, setTypedWords] = useState<string[]>([]);
  const [currentInput, setCurrentInput] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [liveNetWpm, setLiveNetWpm] = useState<number>(0);
  const [liveAccuracy, setLiveAccuracy] = useState<number>(100);
  const [isInputFocused, setIsInputFocused] = useState<boolean>(false);
  const [showOutOfFocusOverlay, setShowOutOfFocusOverlay] = useState<boolean>(false);

  // Result & Sample Telemetry Preview state
  const [lastResult, setLastResult] = useState<CompletedTypingResult | null>(null);
  const [previewSample, setPreviewSample] = useState<boolean>(false);

  // Caret pixel coordinates
  const [caretCoords, setCaretCoords] = useState<{
    x: number;
    y: number;
    width: number;
    height: number;
  }>({ x: 0, y: 0, width: 2.5, height: 26 });
  const [scrollOffset, setScrollOffset] = useState<number>(0);

  // Mutable performance refs
  const inputRef = useRef<HTMLInputElement | null>(null);
  const wordsInnerRef = useRef<HTMLDivElement | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const totalKeystrokesRef = useRef<number>(0);
  const correctKeystrokesRef = useRef<number>(0);
  const secondErrorCountRef = useRef<number>(0);
  const lastSecondLoggedRef = useRef<number>(0);
  const telemetrySamplesRef = useRef<TelemetryPoint[]>([]);
  const tabPendingRef = useRef<boolean>(false);
  const tabTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const blurTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const activeDictation =
    LISTENING_DICTATION_ITEMS[dictationIdx % LISTENING_DICTATION_ITEMS.length] ??
    LISTENING_DICTATION_ITEMS[0];
  const activeLexical =
    LEXICAL_UPGRADE_PAIRS[lexicalIdx % LEXICAL_UPGRADE_PAIRS.length] ??
    LEXICAL_UPGRADE_PAIRS[0];
  const pacingPlan = useMemo(
    () => calculateIeltsParagraphSplits(pacingTask, liveNetWpm || 45),
    [liveNetWpm, pacingTask],
  );

  const speakDictationCue = useCallback(
    (text: string, accent: 'en-GB' | 'en-AU' | 'en-US') => {
      try {
        if (typeof window !== 'undefined' && 'speechSynthesis' in window && window.speechSynthesis) {
          window.speechSynthesis.cancel();
          const utterance = new SpeechSynthesisUtterance(text);
          utterance.lang = accent;
          utterance.rate = 0.94;
          const voices = window.speechSynthesis.getVoices();
          const matched =
            voices.find((v) => v.lang.toLowerCase() === accent.toLowerCase()) ??
            voices.find((v) => v.lang.toLowerCase().startsWith(accent.slice(0, 2).toLowerCase()));
          if (matched) utterance.voice = matched;
          setIsSpeakingAudio(true);
          utterance.onend = () => setIsSpeakingAudio(false);
          utterance.onerror = () => setIsSpeakingAudio(false);
          window.speechSynthesis.speak(utterance);
          return;
        }
      } catch {
        // Fallback to synthesized acoustic chime below
      }

      try {
        if (typeof window !== 'undefined') {
          const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
          if (AudioCtx) {
            const ctx = new AudioCtx();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(523.25, ctx.currentTime);
            osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.14);
            gain.gain.setValueAtTime(0.04, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.36);
            setIsSpeakingAudio(true);
            setTimeout(() => setIsSpeakingAudio(false), 380);
          }
        }
      } catch {
        setIsSpeakingAudio(false);
      }
    },
    [],
  );

  const words = useMemo(() => {
    if (missedDrillWords && missedDrillWords.length > 0) {
      return buildTypingWords(corpusId, {
        targetCount: Math.max(25, missedDrillWords.length * 3),
        includePunctuation: false,
        includeNumbers: false,
        customWords: missedDrillWords,
        seed,
      });
    }

    if (drillMode === 'listening-dictation' && activeDictation) {
      return activeDictation.targetWords.split(/\s+/).filter(Boolean);
    }

    if (drillMode === 'lexical-upgrade' && activeLexical) {
      const tokens = activeLexical.band8Target.split(/\s+/).filter(Boolean);
      return includePunctuation
        ? tokens
        : tokens.map((t) => t.replace(/^[,.;:!?()"'“”]+|[,.;:!?()"'“”]+$/g, '').toLowerCase()).filter(Boolean);
    }

    if (drillMode === 'exam-pacing') {
      const pacingCorpus: TypingCorpusId =
        pacingTask === 'task1'
          ? 'ielts-task1-data'
          : pacingTask === 'gre-awa'
            ? 'gre-awa-issue'
            : 'ielts-task2-band8';
      return buildTypingWords(pacingCorpus, {
        targetCount: pacingPlan.targetWordCount,
        includePunctuation,
        includeNumbers,
        seed,
      });
    }

    const targetCount =
      mode === 'time' ? 140 : mode === 'words' ? wordLimit : 65;
    return buildTypingWords(corpusId, {
      targetCount,
      includePunctuation,
      includeNumbers,
      seed,
    });
  }, [
    activeDictation,
    activeLexical,
    corpusId,
    drillMode,
    includeNumbers,
    includePunctuation,
    missedDrillWords,
    mode,
    pacingPlan.targetWordCount,
    pacingTask,
    seed,
    wordLimit,
  ]);

  const activeCorpus = TYPING_CORPORA[corpusId];

  const resetSessionState = useCallback(
    (nextSeedBump: boolean, nextCustomWords?: string[] | null) => {
      if (nextCustomWords !== undefined) {
        setMissedDrillWords(nextCustomWords);
      }
      if (nextSeedBump) {
        setSeed((prev) => prev + 1);
      }
      setStatus('idle');
      setActiveWordIdx(0);
      setTypedWords([]);
      setCurrentInput('');
      setTimeLeft(timeLimit);
      setLiveNetWpm(0);
      setLiveAccuracy(100);
      setScrollOffset(0);
      setShowOutOfFocusOverlay(false);
      startTimeRef.current = null;
      totalKeystrokesRef.current = 0;
      correctKeystrokesRef.current = 0;
      secondErrorCountRef.current = 0;
      lastSecondLoggedRef.current = 0;
      telemetrySamplesRef.current = [];
    },
    [timeLimit],
  );

  const restartTest = useCallback(() => {
    setLastResult(null);
    setPreviewSample(false);
    resetSessionState(true);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  }, [resetSessionState]);

  const finalizeTest = useCallback(
    (finalTypedWords: readonly string[], finalWordIdx: number) => {
      const now = performance.now();
      const rawElapsed = startTimeRef.current
        ? (now - startTimeRef.current) / 1000
        : mode === 'time'
          ? timeLimit
          : 1;
      const elapsedSeconds = Math.max(1, Number(rawElapsed.toFixed(1)));

      const totals = computeCorpusCharTotals(words, finalTypedWords, finalWordIdx);
      const correctChars = totals.c + totals.spacesCorrect;
      const allTypedChars = totals.c + totals.i + totals.e + totals.spacesCorrect;
      const netWpm = calculateNetWpm(correctChars, elapsedSeconds);
      const rawWpm = calculateRawWpm(allTypedChars, elapsedSeconds);
      const accuracy = calculateAccuracy(
        correctKeystrokesRef.current,
        totalKeystrokesRef.current,
      );

      const finalSecond = Math.max(1, Math.round(elapsedSeconds));
      const samples = [...telemetrySamplesRef.current];
      const lastPoint = samples[samples.length - 1];
      if (!lastPoint || lastPoint.second < finalSecond) {
        samples.push({
          second: finalSecond,
          netWpm,
          rawWpm,
          errors: secondErrorCountRef.current,
        });
      }

      const consistency = calculateConsistency(samples.map((s) => s.rawWpm));

      const mistypedWords: MistypedWordRecord[] = [];
      const inspectedLimit = Math.min(words.length - 1, finalWordIdx);
      for (let wIdx = 0; wIdx <= inspectedLimit; wIdx += 1) {
        const target = words[wIdx] ?? '';
        const typed = finalTypedWords[wIdx] ?? '';
        const isDone = wIdx < finalWordIdx || typed.length > 0;
        if (!isDone) continue;
        const diff = computeWordCharStates(target, typed, true);
        if (diff.hasError) {
          mistypedWords.push({
            wordIndex: wIdx,
            target,
            typed,
            c: diff.counts.c,
            i: diff.counts.i,
            e: diff.counts.e,
            m: diff.counts.m,
          });
        }
      }

      setStatus('finished');
      setLiveNetWpm(netWpm);
      setLiveAccuracy(accuracy);
      setPreviewSample(false);
      setShowOutOfFocusOverlay(false);
      setLastResult({
        netWpm,
        rawWpm,
        accuracy,
        consistency,
        elapsedSeconds,
        counts: { c: totals.c, i: totals.i, e: totals.e, m: totals.m },
        telemetry: samples,
        mistypedWords,
        corpusTitle: missedDrillWords
          ? isBn
            ? 'ভুল শব্দের বিশেষ ড্রিল'
            : 'Missed Words Remediation Drill'
          : isBn
            ? activeCorpus.titleBn
            : activeCorpus.titleEn,
      });
    },
    [activeCorpus.titleBn, activeCorpus.titleEn, isBn, missedDrillWords, mode, timeLimit, words],
  );

  // Sync timeLeft when timeLimit changes in idle state
  useEffect(() => {
    if (status === 'idle') {
      setTimeLeft(timeLimit);
    }
  }, [status, timeLimit]);

  // 100ms live telemetry ticker while running
  useEffect(() => {
    if (status !== 'running') return;
    const interval = setInterval(() => {
      if (!startTimeRef.current) return;
      const elapsedSec = (performance.now() - startTimeRef.current) / 1000;
      const mergedTyped = [...typedWords];
      mergedTyped[activeWordIdx] = currentInput;

      const totals = computeCorpusCharTotals(words, mergedTyped, activeWordIdx);
      const correctChars = totals.c + totals.spacesCorrect;
      const allTypedChars = totals.c + totals.i + totals.e + totals.spacesCorrect;

      const safeElapsed = Math.max(0.5, elapsedSec);
      const currNetWpm = calculateNetWpm(correctChars, safeElapsed);
      const currRawWpm = calculateRawWpm(allTypedChars, safeElapsed);
      const currAcc = calculateAccuracy(
        correctKeystrokesRef.current,
        totalKeystrokesRef.current,
      );

      setLiveNetWpm(currNetWpm);
      setLiveAccuracy(currAcc);

      const wholeSecond = Math.floor(elapsedSec);
      while (lastSecondLoggedRef.current < wholeSecond) {
        const sec = lastSecondLoggedRef.current + 1;
        telemetrySamplesRef.current.push({
          second: sec,
          netWpm: calculateNetWpm(correctChars, sec),
          rawWpm: calculateRawWpm(allTypedChars, sec),
          errors: secondErrorCountRef.current,
        });
        secondErrorCountRef.current = 0;
        lastSecondLoggedRef.current = sec;
      }

      if (mode === 'time') {
        const remaining = Math.max(0, Math.ceil(timeLimit - elapsedSec));
        setTimeLeft(remaining);
        if (elapsedSec >= timeLimit) {
          clearInterval(interval);
          finalizeTest(mergedTyped, activeWordIdx);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, [activeWordIdx, currentInput, finalizeTest, mode, status, timeLimit, typedWords, words]);

  // Out-of-focus > 1500ms overlay detector
  useEffect(() => {
    if (blurTimerRef.current) {
      clearTimeout(blurTimerRef.current);
      blurTimerRef.current = null;
    }

    if (status === 'running' && !isInputFocused) {
      blurTimerRef.current = setTimeout(() => {
        setShowOutOfFocusOverlay(true);
      }, 1500);
    } else {
      setShowOutOfFocusOverlay(false);
    }

    return () => {
      if (blurTimerRef.current) {
        clearTimeout(blurTimerRef.current);
        blurTimerRef.current = null;
      }
    };
  }, [isInputFocused, status]);

  // Gliding #caret coordinate sync
  const syncCaretPosition = useCallback(() => {
    const inner = wordsInnerRef.current;
    if (!inner) return;
    const wordEl = inner.querySelector<HTMLElement>(`[data-word-index="${activeWordIdx}"]`);
    if (!wordEl) return;

    const letters = wordEl.querySelectorAll<HTMLElement>('[data-letter-index]');
    const charIdx = currentInput.length;

    let x = wordEl.offsetLeft;
    let y = wordEl.offsetTop;
    let w = 11;
    let h = wordEl.offsetHeight || 28;

    if (charIdx < letters.length) {
      const targetLetter = letters[charIdx];
      if (targetLetter) {
        x = targetLetter.offsetLeft;
        y = targetLetter.offsetTop;
        w = Math.max(8, targetLetter.offsetWidth);
        h = Math.max(20, targetLetter.offsetHeight);
      }
    } else if (letters.length > 0) {
      const lastLetter = letters[letters.length - 1];
      if (lastLetter) {
        x = lastLetter.offsetLeft + lastLetter.offsetWidth;
        y = lastLetter.offsetTop;
        w = 11;
        h = Math.max(20, lastLetter.offsetHeight);
      }
    }

    setCaretCoords({ x, y, width: w, height: h });

    // Scroll inner lines gently if caret advances past the second line
    const lineH = Math.max(32, h + 10);
    if (y - scrollOffset > lineH * 1.8) {
      setScrollOffset(Math.max(0, y - lineH));
    } else if (y < scrollOffset) {
      setScrollOffset(Math.max(0, y - lineH));
    }
  }, [activeWordIdx, currentInput.length, scrollOffset]);

  useLayoutEffect(() => {
    syncCaretPosition();
  }, [syncCaretPosition, words]);

  useEffect(() => {
    const handleResize = () => syncCaretPosition();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [syncCaretPosition]);

  // Global keyboard shortcut listener (Tab+Enter, Escape, or resume focus)
  useEffect(() => {
    const handleWindowKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      const isOtherField =
        target !== inputRef.current &&
        (tag === 'input' || tag === 'textarea' || tag === 'select');
      if (isOtherField) return;

      if (e.key === 'Tab') {
        e.preventDefault();
        tabPendingRef.current = true;
        if (tabTimerRef.current) clearTimeout(tabTimerRef.current);
        tabTimerRef.current = setTimeout(() => {
          tabPendingRef.current = false;
        }, 1500);
        return;
      }

      if (e.key === 'Enter' && tabPendingRef.current) {
        e.preventDefault();
        tabPendingRef.current = false;
        restartTest();
        return;
      }

      if (e.key === 'Escape') {
        e.preventDefault();
        restartTest();
        return;
      }

      if (
        status !== 'finished' &&
        !previewSample &&
        document.activeElement !== inputRef.current &&
        e.key.length === 1 &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.altKey
      ) {
        inputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => {
      window.removeEventListener('keydown', handleWindowKeyDown);
      if (tabTimerRef.current) clearTimeout(tabTimerRef.current);
    };
  }, [previewSample, restartTest, status]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (status === 'finished') return;
    const rawVal = e.target.value;

    if (status === 'idle' && rawVal.length > 0 && rawVal !== ' ') {
      setStatus('running');
      startTimeRef.current = performance.now();
    }

    // Space commits the current word and advances to the next word
    if (rawVal.endsWith(' ')) {
      const committed = rawVal.slice(0, -1);
      if (committed.length === 0) {
        setCurrentInput('');
        return;
      }

      const targetWord = words[activeWordIdx] ?? '';
      totalKeystrokesRef.current += 1;
      if (committed === targetWord) {
        correctKeystrokesRef.current += 1;
      } else {
        secondErrorCountRef.current += 1;
      }

      const nextTypedWords = [...typedWords];
      nextTypedWords[activeWordIdx] = committed;
      setTypedWords(nextTypedWords);
      setCurrentInput('');

      const nextIdx = activeWordIdx + 1;
      if (nextIdx >= words.length) {
        finalizeTest(nextTypedWords, activeWordIdx);
        return;
      }
      setActiveWordIdx(nextIdx);
      return;
    }

    const prevLen = currentInput.length;
    if (rawVal.length > prevLen) {
      const targetWord = words[activeWordIdx] ?? '';
      for (let pos = prevLen; pos < rawVal.length; pos += 1) {
        totalKeystrokesRef.current += 1;
        if (rawVal[pos] === targetWord[pos]) {
          correctKeystrokesRef.current += 1;
        } else {
          secondErrorCountRef.current += 1;
        }
      }
    }

    const nextTypedWords = [...typedWords];
    nextTypedWords[activeWordIdx] = rawVal;
    setTypedWords(nextTypedWords);
    setCurrentInput(rawVal);

    // Auto-complete on exact final word in words / exam-corpus modes
    if (
      mode !== 'time' &&
      activeWordIdx === words.length - 1 &&
      rawVal === words[activeWordIdx]
    ) {
      finalizeTest(nextTypedWords, activeWordIdx);
    }
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (status === 'finished') return;

    // Previous-word error backspace recovery (disabled in strictExamMode)
    if (
      e.key === 'Backspace' &&
      currentInput.length === 0 &&
      activeWordIdx > 0 &&
      !strictExamMode
    ) {
      const prevIdx = activeWordIdx - 1;
      const prevTarget = words[prevIdx] ?? '';
      const prevTyped = typedWords[prevIdx] ?? '';
      const prevDiff = computeWordCharStates(prevTarget, prevTyped, true);
      if (prevDiff.hasError) {
        e.preventDefault();
        setActiveWordIdx(prevIdx);
        setCurrentInput(prevTyped);
      }
    }
  };

  const handleStartMissedWordsDrill = (mistyped: readonly MistypedWordRecord[]) => {
    const uniqueMissed = Array.from(new Set(mistyped.map((m) => m.target)));
    if (uniqueMissed.length === 0) return;
    setMode('words');
    setLastResult(null);
    setPreviewSample(false);
    resetSessionState(true, uniqueMissed);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  const activeResult = previewSample ? SAMPLE_PREVIEW_RESULT : lastResult;
  const readiness = activeResult
    ? evaluateIeltsTypingReadiness(activeResult.netWpm, activeResult.accuracy)
    : null;

  const isTypingActive = status === 'running';

  return (
    <div className="space-y-6">
      {/* Corpus & Sample Telemetry Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {(Object.keys(TYPING_CORPORA) as TypingCorpusId[]).map((id) => {
            const item = TYPING_CORPORA[id];
            const active = corpusId === id && !missedDrillWords;
            return (
              <button
                key={id}
                type="button"
                onClick={() => {
                  setCorpusId(id);
                  setLastResult(null);
                  setPreviewSample(false);
                  resetSessionState(false, null);
                  inputRef.current?.focus();
                }}
                className={
                  active
                    ? 'rounded-[4px] border border-[var(--brand-deep)] bg-[var(--brand-deep)] px-3 py-1.5 text-xs font-semibold text-white'
                    : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-1.5 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)]'
                }
              >
                {isBn ? item.badgeBn : item.badgeEn}
              </button>
            );
          })}
          {missedDrillWords ? (
            <button
              type="button"
              onClick={() => {
                resetSessionState(true, null);
                inputRef.current?.focus();
              }}
              className="rounded-[4px] border border-[var(--brand)] bg-[var(--surface-paper)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)]"
            >
              {isBn ? 'ভুল শব্দের ড্রিল বাদ দিন ×' : 'Exit Missed Words Drill ×'}
            </button>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => setPreviewSample((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)] hover:border-[var(--brand)]"
        >
          <Eye className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
          <span>
            {previewSample
              ? isBn
                ? 'টেলিমেট্রি প্রিভিউ বন্ধ করুন'
                : 'Hide Sample Telemetry'
              : isBn
                ? 'নমুনা টেলিমেট্রি দেখুন'
                : 'Preview Sample Telemetry'}
          </span>
        </button>
      </div>

      {/* Monkeytype #testConfig Bar (dims smoothly during active typing) */}
      <div
        id="testConfig"
        className={`bg-[var(--bg-warm)] border border-[var(--hairline)] rounded-[4px] px-4 py-2.5 mb-6 space-y-2.5 transition-opacity duration-200 ${
          isTypingActive ? 'opacity-40 hover:opacity-100' : 'opacity-100'
        }`}
      >
        {/* Curriculum Drill Selector (P35) */}
        <div className="flex flex-wrap items-center gap-2 border-b border-[var(--hairline)] pb-2.5">
          <span className="text-xs font-semibold text-[var(--text-muted)] mr-1">
            {isBn ? 'ড্রিল মোড:' : 'Drill Mode:'}
          </span>
          {(
            [
              {
                id: 'copy-flow',
                labelEn: 'Copy-Flow Speed (Monkeytype)',
                labelBn: 'কপি-ফ্লো গতি (মাঙ্কিটাইপ)',
              },
              {
                id: 'listening-dictation',
                labelEn: 'Listening Audio Dictation (Blind Spelling)',
                labelBn: 'লিসেনিং অডিও ডিক্টেশন (অন্ধ বানান)',
              },
              {
                id: 'lexical-upgrade',
                labelEn: 'Band 6.0 -> 8.5 Lexical Upgrade',
                labelBn: 'ব্যান্ড ৬.০ -> ৮.৫ লেক্সিক্যাল আপগ্রেড',
              },
              {
                id: 'exam-pacing',
                labelEn: 'Exam Pacing Coach (Task 1 150w / Task 2 250w)',
                labelBn: 'পরীক্ষার পেসিং কোচ (টাস্ক ১ / টাস্ক ২)',
              },
            ] as const
          ).map((drill) => (
            <button
              key={drill.id}
              type="button"
              onClick={() => {
                setDrillMode(drill.id);
                if (drill.id === 'copy-flow') {
                  setMode('time');
                } else {
                  setMode('words');
                }
                setLastResult(null);
                setPreviewSample(false);
                resetSessionState(false, null);
              }}
              className={
                drillMode === drill.id
                  ? 'px-2.5 py-1 text-xs font-semibold rounded-[4px] bg-[var(--brand-deep)] text-white'
                  : 'px-2.5 py-1 text-xs font-medium rounded-[4px] bg-[var(--surface-paper)] border border-[var(--hairline)] text-[var(--brand-deep)] hover:border-[var(--brand)]'
              }
            >
              {isBn ? drill.labelBn : drill.labelEn}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Group 1: Modifiers */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => {
              setIncludePunctuation((p) => !p);
              resetSessionState(false);
            }}
            className={
              includePunctuation
                ? 'px-2.5 py-1 text-xs font-semibold rounded-[4px] bg-[var(--surface-paper)] border border-[var(--brand)] text-[var(--brand-deep)]'
                : 'px-2.5 py-1 text-xs font-medium rounded-[4px] text-[var(--text-muted)] hover:text-[var(--brand-deep)]'
            }
          >
            @ {isBn ? 'বিরামচিহ্ন' : 'punctuation'}
          </button>

          <button
            type="button"
            onClick={() => {
              setIncludeNumbers((p) => !p);
              resetSessionState(false);
            }}
            className={
              includeNumbers
                ? 'px-2.5 py-1 text-xs font-semibold rounded-[4px] bg-[var(--surface-paper)] border border-[var(--brand)] text-[var(--brand-deep)]'
                : 'px-2.5 py-1 text-xs font-medium rounded-[4px] text-[var(--text-muted)] hover:text-[var(--brand-deep)]'
            }
          >
            # {isBn ? 'সংখ্যা' : 'numbers'}
          </button>

          <button
            type="button"
            onClick={() => {
              setStrictExamMode((p) => !p);
              resetSessionState(false);
            }}
            className={
              strictExamMode
                ? 'px-2.5 py-1 text-xs font-semibold rounded-[4px] bg-[var(--surface-paper)] border border-[var(--brand)] text-[var(--brand-deep)]'
                : 'px-2.5 py-1 text-xs font-medium rounded-[4px] text-[var(--text-muted)] hover:text-[var(--brand-deep)]'
            }
          >
            {isBn ? 'কঠোর পরীক্ষা মোড' : 'strict exam mode'}
          </button>

          <div className="inline-flex items-center border-l border-[var(--hairline)] pl-3 gap-1">
            <span className="text-xs text-[var(--text-muted)] mr-1">
              {isBn ? 'ক্যারেট:' : 'caret:'}
            </span>
            {(['line', 'block', 'underline'] as CaretStyle[]).map((styleOption) => (
              <button
                key={styleOption}
                type="button"
                onClick={() => setCaretStyle(styleOption)}
                className={
                  caretStyle === styleOption
                    ? 'px-2 py-0.5 text-xs font-semibold rounded-[4px] bg-[var(--brand-deep)] text-white'
                    : 'px-2 py-0.5 text-xs font-medium rounded-[4px] text-[var(--text)] hover:text-[var(--brand-deep)]'
                }
              >
                {styleOption}
              </button>
            ))}
          </div>
        </div>

        {/* Group 2: Mode */}
        <div className="flex flex-wrap items-center gap-1.5 border-l border-[var(--hairline)] pl-3">
          {(
            [
              { id: 'time', labelEn: 'time', labelBn: 'সময়' },
              { id: 'words', labelEn: 'words', labelBn: 'শব্দ' },
              { id: 'exam-corpus', labelEn: 'exam-corpus', labelBn: 'পরীক্ষার প্যাসেজ' },
            ] as const
          ).map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                setLastResult(null);
                resetSessionState(false);
              }}
              className={
                mode === m.id
                  ? 'px-2.5 py-1 text-xs font-semibold rounded-[4px] bg-[var(--brand)] text-white'
                  : 'px-2.5 py-1 text-xs font-medium rounded-[4px] text-[var(--text)] hover:text-[var(--brand-deep)]'
              }
            >
              {isBn ? m.labelBn : m.labelEn}
            </button>
          ))}
        </div>

        {/* Group 3: Sub-Options */}
        <div className="flex flex-wrap items-center gap-1.5 border-l border-[var(--hairline)] pl-3 tabular-nums">
          {mode === 'time'
            ? ([15, 30, 60, 120] as TimeOption[]).map((sec) => (
                <button
                  key={sec}
                  type="button"
                  onClick={() => {
                    setTimeLimit(sec);
                    setTimeLeft(sec);
                    setLastResult(null);
                    resetSessionState(false);
                  }}
                  className={
                    timeLimit === sec
                      ? 'px-2.5 py-1 text-xs font-bold rounded-[4px] text-[var(--brand)] bg-[var(--surface-paper)] border border-[var(--brand)]'
                      : 'px-2.5 py-1 text-xs font-medium rounded-[4px] text-[var(--text)] hover:text-[var(--brand-deep)]'
                  }
                >
                  {sec}s
                </button>
              ))
            : null}

          {mode === 'words'
            ? (
                [
                  { count: 25, label: '25' },
                  { count: 50, label: '50' },
                  { count: 150, label: '150 (Task 1)' },
                  { count: 250, label: '250 (Task 2)' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.count}
                  type="button"
                  onClick={() => {
                    setWordLimit(opt.count);
                    setLastResult(null);
                    resetSessionState(false);
                  }}
                  className={
                    wordLimit === opt.count
                      ? 'px-2.5 py-1 text-xs font-bold rounded-[4px] text-[var(--brand)] bg-[var(--surface-paper)] border border-[var(--brand)]'
                      : 'px-2.5 py-1 text-xs font-medium rounded-[4px] text-[var(--text)] hover:text-[var(--brand-deep)]'
                  }
                >
                  {opt.label}
                </button>
              ))
            : null}

          {mode === 'exam-corpus'
            ? (Object.keys(TYPING_CORPORA) as TypingCorpusId[]).map((id, idx) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => {
                    setCorpusId(id);
                    setLastResult(null);
                    resetSessionState(false, null);
                  }}
                  className={
                    corpusId === id
                      ? 'px-2.5 py-1 text-xs font-bold rounded-[4px] text-[var(--brand)] bg-[var(--surface-paper)] border border-[var(--brand)]'
                      : 'px-2.5 py-1 text-xs font-medium rounded-[4px] text-[var(--text)] hover:text-[var(--brand-deep)]'
                  }
                >
                  {idx === 0
                    ? 'Task 2'
                    : idx === 1
                      ? 'Task 1'
                      : idx === 2
                        ? 'Listening'
                        : 'GRE AWA'}
                </button>
              ))
            : null}
        </div>
        </div>
      </div>

      {/* Active Typing Surface (shown when not viewing result, or always above result when testing) */}
      {!activeResult ? (
        <section className="space-y-4">
          {/* Active Corpus Subtitle & #liveStatsMini */}
          <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[var(--hairline)] pb-4">
            <div className="space-y-1">
              <div className="text-sm font-bold text-[var(--brand-deep)]">
                {missedDrillWords
                  ? isBn
                    ? `ভুল শব্দের বিশেষ ড্রিল (${missedDrillWords.length} শব্দ)`
                    : `Missed Words Remediation Drill (${missedDrillWords.length} words)`
                  : isBn
                    ? activeCorpus.titleBn
                    : activeCorpus.titleEn}
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {isBn ? activeCorpus.subtitleBn : activeCorpus.subtitleEn}
              </p>
            </div>

            <div id="liveStatsMini" className="flex items-center gap-6 tabular-nums">
              <div>
                <div className="text-xs text-[var(--text-muted)]">
                  {mode === 'time'
                    ? isBn
                      ? 'অবশিষ্ট সময়'
                      : 'Time Left'
                    : isBn
                      ? 'শব্দ অগ্রগতি'
                      : 'Words'}
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-[var(--brand-deep)] tabular-nums">
                  {mode === 'time'
                    ? `${timeLeft}s`
                    : `${activeWordIdx}/${words.length}`}
                </div>
              </div>

              <div>
                <div className="text-xs text-[var(--text-muted)]">
                  {isBn ? 'নেট WPM' : 'Net WPM'}
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-[var(--brand-deep)] tabular-nums">
                  {liveNetWpm}
                </div>
              </div>

              <div>
                <div className="text-xs text-[var(--text-muted)]">
                  {isBn ? 'নির্ভুলতা' : 'Accuracy'}
                </div>
                <div className="text-2xl md:text-3xl font-extrabold text-[var(--brand-deep)] tabular-nums">
                  {liveAccuracy.toFixed(1)}%
                </div>
              </div>
            </div>
          </div>

          {/* Curriculum Drill Callout Strips (P35) */}
          {drillMode === 'listening-dictation' && activeDictation ? (
            <div className="border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] rounded-[4px] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-[4px] bg-[var(--bg-warm)] border border-[var(--hairline)] text-[var(--brand-deep)]">
                    {activeDictation.part}
                  </span>
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-[4px] bg-[var(--bg-warm)] border border-[var(--hairline)] text-[var(--brand)]">
                    {activeDictation.accent}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {dictationIdx + 1} / {LISTENING_DICTATION_ITEMS.length}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      speakDictationCue(activeDictation.audioCueText, activeDictation.accent)
                    }
                    className="inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--link)]"
                  >
                    <Volume2 className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {isSpeakingAudio
                        ? isBn
                          ? 'অডিও চলছে...'
                          : 'Speaking Cue...'
                        : isBn
                          ? 'অডিও প্যাসেজ / শব্দ শুনুন (en-GB / en-AU)'
                          : 'Speak Passage / Word (en-GB / en-AU)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setBlindDictationMode((b) => !b)}
                    className={
                      blindDictationMode
                        ? 'inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--brand)] bg-[var(--bg-warm)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-deep)]'
                        : 'inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-1.5 text-xs font-medium text-[var(--text)]'
                    }
                  >
                    <EyeOff className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
                    <span>
                      {isBn
                        ? 'অপঠিত শব্দ লুকান (ব্লাইন্ড ডিক্টেশন)'
                        : 'Mask Unreached Words (Dictation Blind Mode)'}
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setDictationIdx((idx) => (idx + 1) % LISTENING_DICTATION_ITEMS.length);
                      resetSessionState(false, null);
                    }}
                    className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-1.5 text-xs font-semibold text-[var(--brand-deep)] hover:border-[var(--brand)]"
                  >
                    {isBn ? 'পরবর্তী আইটেম →' : 'Next Cue →'}
                  </button>
                </div>
              </div>

              <p className="text-xs text-[var(--text)]">
                <span className="font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'বানান সতর্কতা: ' : 'Spelling Trap Note: '}
                </span>
                {isBn ? activeDictation.trapNoteBn : activeDictation.trapNote}
              </p>
            </div>
          ) : null}

          {drillMode === 'lexical-upgrade' && activeLexical ? (
            <div className="border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] rounded-[4px] p-4 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2 py-0.5 text-xs font-semibold rounded-[4px] bg-[var(--bg-warm)] border border-[var(--hairline)] text-[var(--brand)]">
                    {activeLexical.criterion}
                  </span>
                  <span className="text-xs text-[var(--text-muted)]">
                    {lexicalIdx + 1} / {LEXICAL_UPGRADE_PAIRS.length}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setLexicalIdx((idx) => (idx + 1) % LEXICAL_UPGRADE_PAIRS.length);
                    resetSessionState(false, null);
                  }}
                  className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-1 text-xs font-semibold text-[var(--brand-deep)] hover:border-[var(--brand)]"
                >
                  {isBn ? 'পরবর্তী আপগ্রেড →' : 'Next Lexical Upgrade →'}
                </button>
              </div>
              <div className="text-sm text-[var(--text)]">
                <span className="font-semibold text-[var(--text-muted)]">
                  {isBn ? 'ব্যান্ড ৬.০ ভিত্তি: ' : 'Band 6.0 Baseline Phrase: '}
                </span>
                <span className="line-through text-[var(--text-muted)]">
                  &ldquo;{activeLexical.band6Phrase}&rdquo;
                </span>
                <span className="mx-2 font-bold text-[var(--brand)]">→</span>
                <span className="font-semibold text-[var(--brand-deep)]">
                  {isBn ? 'ব্যান্ড ৮.৫ লক্ষ্য (নিচে টাইপ করুন)' : 'Band 8.5 Target Collocation (type below)'}
                </span>
              </div>
              <p className="text-xs text-[var(--text-muted)]">
                {isBn ? activeLexical.contextNoteBn : activeLexical.contextNote}
              </p>
            </div>
          ) : null}

          {drillMode === 'exam-pacing' ? (
            <div className="border border-[var(--hairline)] bg-[var(--surface-paper)] rounded-[4px] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2">
                  {(
                    [
                      { id: 'task1', labelEn: 'Task 1 (20m / 150w)', labelBn: 'টাস্ক ১ (২০ মি. / ১৫০ শব্দ)' },
                      { id: 'task2', labelEn: 'Task 2 (40m / 250w)', labelBn: 'টাস্ক ২ (৪০ মি. / ২৫০ শব্দ)' },
                      { id: 'gre-awa', labelEn: 'GRE AWA (30m Sprint)', labelBn: 'জিআরই এডব্লিউএ (৩০ মি.)' },
                    ] as const
                  ).map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => {
                        setPacingTask(t.id);
                        resetSessionState(false, null);
                      }}
                      className={
                        pacingTask === t.id
                          ? 'px-2.5 py-1 text-xs font-semibold rounded-[4px] bg-[var(--brand-deep)] text-white'
                          : 'px-2.5 py-1 text-xs font-medium rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] text-[var(--brand-deep)]'
                      }
                    >
                      {isBn ? t.labelBn : t.labelEn}
                    </button>
                  ))}
                </div>
                <span className="text-xs font-mono text-[var(--text-muted)]">
                  {isBn
                    ? `আনুমানিক টাইপিং সময়: ${pacingPlan.estimatedTypingMinutes} মি. / ${pacingPlan.totalExamMinutes} মি.`
                    : `Est. typing time: ${pacingPlan.estimatedTypingMinutes}m / ${pacingPlan.totalExamMinutes}m`}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                {pacingPlan.stages.map((stage, idx) => {
                  const pct = words.length > 0 ? ((activeWordIdx + 1) / words.length) * 100 : 0;
                  const thresholds = [0, 25, 60, 85];
                  const threshold = thresholds[idx] ?? 0;
                  const nextThreshold = thresholds[idx + 1] ?? 101;
                  const isCurrent = pct >= threshold && pct < nextThreshold;
                  const isDone = pct >= nextThreshold;
                  return (
                    <div
                      key={stage.id}
                      className={
                        isCurrent
                          ? 'border border-[var(--brand)] bg-[var(--bg-warm)] rounded-[4px] p-2.5'
                          : isDone
                            ? 'border border-[var(--brand-deep)] bg-[var(--surface-paper)] rounded-[4px] p-2.5 opacity-80'
                            : 'border border-[var(--hairline)] bg-[var(--surface-paper)] rounded-[4px] p-2.5 opacity-60'
                      }
                    >
                      <div className="flex items-center justify-between gap-2 text-xs font-bold text-[var(--brand-deep)]">
                        <span>{isBn ? stage.labelBn : stage.labelEn}</span>
                        <span className="font-mono text-[var(--brand)]">{stage.minutes}m</span>
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-1">
                        {stage.wordRangeEn} · {stage.focusEn}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {/* Monkeytype #wordsWrapper */}
          <div
            id="wordsWrapper"
            onClick={() => inputRef.current?.focus()}
            className="relative bg-[var(--surface-paper)] border border-[var(--hairline)] rounded-[4px] p-6 sm:p-8 cursor-text select-none"
          >
            {/* Hidden #wordsInput */}
            <input
              ref={inputRef}
              id="wordsInput"
              type="text"
              value={currentInput}
              onChange={handleInputChange}
              onKeyDown={handleInputKeyDown}
              onFocus={() => setIsInputFocused(true)}
              onBlur={() => setIsInputFocused(false)}
              autoComplete="off"
              autoCapitalize="off"
              autoCorrect="off"
              spellCheck={false}
              aria-label={isBn ? 'টাইপিং অনুশীলন ইনপুট' : 'Typing practice input'}
              className="sr-only"
            />

            {/* Out-of-focus >1500ms overlay */}
            {showOutOfFocusOverlay ? (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-[var(--surface-paper)]/85">
                <div className="bg-[var(--surface-paper)]/90 border border-[var(--hairline)] px-4 py-2 text-sm font-semibold text-[var(--brand-deep)] rounded-[4px]">
                  {isBn
                    ? 'ফোকাস বাইরে — পুনরায় শুরু করতে ক্লিক করুন বা যেকোনো কী চাপুন'
                    : 'Out of focus — Click or press any key to resume'}
                </div>
              </div>
            ) : null}

            {/* 3-line scrollable viewport */}
            <div className="h-[156px] overflow-hidden relative font-mono text-xl sm:text-2xl leading-[2.2]">
              <div
                ref={wordsInnerRef}
                className="relative transition-transform duration-150 ease-out"
                style={{ transform: `translateY(-${scrollOffset}px)` }}
              >
                {/* Smooth gliding #caret */}
                <span
                  id="caret"
                  aria-hidden="true"
                  style={{
                    transform:
                      caretStyle === 'underline'
                        ? `translate3d(${caretCoords.x}px, ${caretCoords.y + caretCoords.height - 3}px, 0)`
                        : `translate3d(${caretCoords.x}px, ${caretCoords.y + 3}px, 0)`,
                    width:
                      caretStyle === 'line' ? '2.5px' : `${caretCoords.width}px`,
                    height:
                      caretStyle === 'underline'
                        ? '2.5px'
                        : `${Math.max(20, caretCoords.height - 6)}px`,
                    transition: 'transform 85ms cubic-bezier(0.22, 1, 0.36, 1)',
                  }}
                  className={
                    caretStyle === 'block'
                      ? 'pointer-events-none absolute top-0 left-0 bg-[var(--brand)]/25 rounded-[2px]'
                      : caretStyle === 'underline'
                        ? 'pointer-events-none absolute top-0 left-0 bg-[var(--brand)]'
                        : 'pointer-events-none absolute top-0 left-0 w-[2.5px] bg-[var(--brand)]'
                  }
                />

                {words.map((targetWord, wIdx) => {
                  const typed =
                    wIdx === activeWordIdx
                      ? currentInput
                      : wIdx < activeWordIdx
                        ? typedWords[wIdx] ?? ''
                        : '';
                  const isCompleted = wIdx < activeWordIdx;
                  const diff = computeWordCharStates(targetWord, typed, isCompleted);
                  const shouldMaskUnreached =
                    drillMode === 'listening-dictation' &&
                    blindDictationMode &&
                    wIdx >= activeWordIdx;

                  return (
                    <span
                      key={`${wIdx}-${targetWord}`}
                      data-word-index={wIdx}
                      className="word inline-block mr-3.5 mb-2"
                    >
                      {diff.chars.map((cObj, cIdx) => {
                        let cls = 'text-[var(--text-muted)] opacity-50';
                        if (cObj.state === 'c') {
                          cls = 'text-[var(--brand-deep)]';
                        } else if (cObj.state === 'i') {
                          cls =
                            'text-[var(--brand)] underline decoration-[var(--brand)] decoration-2';
                        } else if (cObj.state === 'm') {
                          cls =
                            'text-[var(--text-muted)] underline decoration-dotted decoration-[var(--brand)]';
                        }
                        const displayChar =
                          shouldMaskUnreached && cObj.state === 'untyped' ? '•' : cObj.char;
                        return (
                          <span
                            key={cIdx}
                            data-letter-index={cIdx}
                            data-letter={cObj.char}
                            className={cls}
                          >
                            {displayChar}
                          </span>
                        );
                      })}

                      {diff.extra.map((extraChar, eIdx) => (
                        <span
                          key={`extra-${eIdx}`}
                          data-extra="true"
                          data-letter-index={targetWord.length + eIdx}
                          data-letter={extraChar}
                          className="text-[var(--brand)] opacity-80 line-through"
                        >
                          {extraChar}
                        </span>
                      ))}
                    </span>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Bottom Controls */}
          <div className="flex flex-wrap items-center justify-between gap-4 text-xs text-[var(--text-muted)]">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={restartTest}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-1.5 font-semibold text-[var(--brand-deep)] hover:border-[var(--brand)]"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
                <span>
                  {isBn
                    ? 'রিস্টার্ট করুন (Tab + Enter)'
                    : 'Restart Test (Tab + Enter)'}
                </span>
              </button>

              {status === 'running' ? (
                <button
                  type="button"
                  onClick={() => {
                    const merged = [...typedWords];
                    merged[activeWordIdx] = currentInput;
                    finalizeTest(merged, activeWordIdx);
                  }}
                  className="underline underline-offset-4 font-medium text-[var(--brand-deep)] hover:text-[var(--brand)]"
                >
                  {isBn ? 'এখনই ফলাফল দেখুন →' : 'Finish & View Telemetry →'}
                </button>
              ) : null}
            </div>

            <span>
              {isInputFocused
                ? strictExamMode
                  ? isBn
                    ? 'কঠোর মোড সক্রিয়: পূর্ববর্তী শব্দে ফেরা যাবে না'
                    : 'Strict exam mode active: previous-word backspace locked'
                  : isBn
                    ? 'ভুল পূর্ববর্তী শব্দে ফিরতে Backspace চাপুন'
                    : 'Press Backspace on char 0 to fix previous-word errors'
                : isBn
                  ? 'টাইপ শুরু করতে ওপরের শব্দগুলোর ওপর ক্লিক করুন'
                  : 'Click the passage box above or press any key to begin'}
            </span>
          </div>
        </section>
      ) : (
        /* Monkeytype #result Telemetry View */
        <section id="result" className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--hairline)] pb-4">
            <div>
              <h2 className="text-lg md:text-xl font-bold text-[var(--brand-deep)]">
                {activeResult.isSamplePreview
                  ? isBn
                    ? 'নমুনা টেলিমেট্রি রিপোর্ট (৩৫-সেকেন্ড সিমুলেশন)'
                    : 'Sample Telemetry Report (Preview)'
                  : isBn
                    ? 'টাইপিং সেশন ফলাফল ও সিডি-আইইএলটিএস প্রস্তুতি'
                    : 'Session Telemetry & CD-IELTS Readiness'}
              </h2>
              <p className="text-xs text-[var(--text-muted)] mt-1">
                {activeResult.corpusTitle} · {activeResult.elapsedSeconds}s
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {activeResult.mistypedWords.length > 0 ? (
                <button
                  type="button"
                  onClick={() => handleStartMissedWordsDrill(activeResult.mistypedWords)}
                  className="inline-flex items-center gap-1.5 rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-semibold text-white hover:bg-[var(--link)]"
                >
                  <Target className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>
                    {isBn
                      ? 'শুধুমাত্র ভুল শব্দ অনুশীলন করুন →'
                      : 'Practice Missed Words Only →'}
                  </span>
                </button>
              ) : null}

              <button
                type="button"
                onClick={restartTest}
                className="inline-flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3.5 py-2 text-xs font-semibold text-[var(--brand-deep)] hover:border-[var(--brand)]"
              >
                <RotateCcw className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
                <span>{isBn ? 'নতুন টেস্ট শুরু করুন' : 'Start Next Test'}</span>
              </button>
            </div>
          </div>

          <WorkspaceStatRow
            stats={[
              {
                value: `${activeResult.netWpm} WPM`,
                label: isBn ? 'নেট টাইপিং গতি' : 'Net WPM',
                detail: isBn
                  ? `র গতি: ${activeResult.rawWpm} WPM`
                  : `Raw: ${activeResult.rawWpm} WPM`,
              },
              {
                value: `${activeResult.accuracy.toFixed(1)}%`,
                label: isBn ? 'কী-স্ট্রোক নির্ভুলতা' : 'Accuracy %',
                detail: readiness
                  ? isBn
                    ? readiness.labelBn
                    : readiness.labelEn
                  : undefined,
              },
              {
                value: `${activeResult.counts.c}/${activeResult.counts.i}/${activeResult.counts.e}/${activeResult.counts.m}`,
                label: isBn
                  ? 'অক্ষর (সঠিক/ভুল/অতিরিক্ত/বাদ)'
                  : 'Characters (c/i/e/m)',
                detail: isBn
                  ? `ধারাবাহিকতা: ${activeResult.consistency}%`
                  : `Consistency: ${activeResult.consistency}%`,
              },
              {
                value:
                  readiness && readiness.minutesFor400Words !== null
                    ? `${readiness.minutesFor400Words} min`
                    : '—',
                label: isBn
                  ? 'সিডি-আইইএলটিএস ৪০০ শব্দের সময়'
                  : 'CD-IELTS 400-Word Time',
                detail: isBn
                  ? 'টাস্ক ১ (১৫০) + টাস্ক ২ (২৫০)'
                  : 'Task 1 (150w) + Task 2 (250w)',
              },
            ]}
          />

          {readiness ? (
            <div className="border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--surface-paper)] p-4 rounded-none flex items-start gap-3">
              <AlertCircle className="h-4 w-4 text-[var(--brand)] shrink-0 mt-0.5" aria-hidden="true" />
              <div className="space-y-1">
                <div className="text-sm font-bold text-[var(--brand-deep)]">
                  {isBn ? readiness.labelBn : readiness.labelEn}
                </div>
                <p className="text-xs text-[var(--text)] leading-relaxed">
                  {isBn ? readiness.guidanceBn : readiness.guidanceEn}
                </p>
              </div>
            </div>
          ) : null}

          <DualAxisTelemetryChart telemetry={activeResult.telemetry} isBn={isBn} />

          <WorkspaceSectionTitle
            title={
              isBn
                ? 'ভুল টাইপ করা শব্দ ও সংশোধন তালিকা'
                : 'Mistyped Words & Remediation Ledger'
            }
            subtitle={
              isBn
                ? 'সিডি-আইইএলটিএস লিসেনিং ও রাইটিংয়ে নম্বর বাঁচাতে প্রতিটি বানান-বিচ্যুতি পর্যালোচনা করুন।'
                : 'Inspect every character-level deviation to eliminate Listening and Writing spelling penalties.'
            }
          />

          <WorkspaceDataTable
            caption={
              isBn
                ? 'ভুল টাইপ করা শব্দ তালিকা'
                : 'Mistyped Words & Remediation Actions'
            }
            emptyMessage={
              isBn
                ? 'কোনো ভুল শব্দ নেই — ১০০% নির্ভুল সেশন!'
                : 'Zero mistyped words recorded in this run.'
            }
            columns={[
              { key: 'word', header: isBn ? 'লক্ষ্য শব্দ' : 'Word', widthClass: 'w-44' },
              { key: 'typed', header: isBn ? 'আপনার ইনপুট' : 'Your Input' },
              { key: 'delta', header: isBn ? 'অক্ষর পার্থক্য' : 'Character Delta' },
              {
                key: 'action',
                header: isBn ? 'সংশোধন পদক্ষেপ' : 'Remediation Action',
                align: 'right',
              },
            ]}
            rows={activeResult.mistypedWords.map((item) => ({
              id: `${item.wordIndex}-${item.target}`,
              rowHeader: <span className="font-mono">{item.target}</span>,
              rowSubheader: isBn
                ? `শব্দ #${item.wordIndex + 1}`
                : `Token #${item.wordIndex + 1}`,
              cells: {
                typed: (
                  <span className="font-mono text-[var(--brand)]">
                    {item.typed || (isBn ? '(খালি)' : '(skipped)')}
                  </span>
                ),
                delta: (
                  <span className="font-mono text-xs text-[var(--text)]">
                    {item.c}c / {item.i}i / {item.e}e / {item.m}m
                  </span>
                ),
                action: (
                  <button
                    type="button"
                    onClick={() => handleStartMissedWordsDrill([item])}
                    className="underline underline-offset-4 text-xs font-semibold text-[var(--brand-deep)] hover:text-[var(--brand)]"
                  >
                    {isBn ? 'এই শব্দটি ড্রিল করুন →' : 'Drill Word →'}
                  </button>
                ),
              },
            }))}
          />
        </section>
      )}

      {variant === 'public' ? (
        <div className="border-t border-[var(--hairline)] pt-4 text-xs text-[var(--text-muted)]">
          {isBn
            ? 'টিপস: অনুশীলনের সময় দ্রুত রিস্টার্ট করতে Tab + Enter (অথবা Escape) চাপুন।'
            : 'Shortcut: Press Tab + Enter (or Escape) at any time for an instant sub-16ms reset.'}
        </div>
      ) : null}
    </div>
  );
}
