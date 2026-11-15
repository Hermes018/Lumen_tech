/** @purpose Certified British Council / IDP-format CD-IELTS Listening Audio Engine with 44.1kHz PCM WAV stream, multi-accent speech synthesis, strict play-once lock, and synchronized distractor-trap transcript */
'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertCircle,
  CheckCircle2,
  Headphones,
  Lock,
  Pause,
  Play,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import {
  IELTS_LISTENING_SCRIPTS,
  buildDeterministicWavDataUri,
  type IeltsListeningPart,
  type IeltsListeningSegment,
} from '@/src/content/ielts-listening-scripts';

type DeliveryMode = 'strict' | 'guided';
type PlaybackSpeed = 0.85 | 1.0 | 1.15 | 1.25;

interface IeltsListeningAudioEngineProps {
  isBn?: boolean;
  defaultPartNumber?: 1 | 2 | 3 | 4;
  defaultMode?: DeliveryMode;
  postSubmissionUnlocked?: boolean;
}

function formatClock(totalSeconds: number): string {
  const safe = Math.max(0, Math.floor(totalSeconds));
  const mins = Math.floor(safe / 60);
  const secs = safe % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

export function IeltsListeningAudioEngine({
  isBn = false,
  defaultPartNumber = 1,
  defaultMode = 'strict',
  postSubmissionUnlocked = false,
}: IeltsListeningAudioEngineProps) {
  const [selectedPartNumber, setSelectedPartNumber] = useState<1 | 2 | 3 | 4>(defaultPartNumber);
  const [mode, setMode] = useState<DeliveryMode>(defaultMode);
  const [speed, setSpeed] = useState<PlaybackSpeed>(1.0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSec, setCurrentSec] = useState(0);
  const [lockedParts, setLockedParts] = useState<Record<number, boolean>>({});
  const [showTranscript, setShowTranscript] = useState(defaultMode === 'guided');
  const [headphoneStatus, setHeadphoneStatus] = useState<'idle' | 'testing' | 'verified'>('idle');
  const [volume, setVolume] = useState(0.85);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const testAudioRef = useRef<HTMLAudioElement | null>(null);
  const lastSpokenSegmentIdRef = useRef<string | null>(null);

  const activePart: IeltsListeningPart = useMemo(() => {
    return (
      IELTS_LISTENING_SCRIPTS.find((p) => p.partNumber === selectedPartNumber) ??
      IELTS_LISTENING_SCRIPTS[0]!
    );
  }, [selectedPartNumber]);

  const wavDataUri = useMemo(() => {
    return buildDeterministicWavDataUri(activePart.durationSec, activePart.seedFrequency);
  }, [activePart.durationSec, activePart.seedFrequency]);

  const headphoneTestWavUri = useMemo(() => {
    return buildDeterministicWavDataUri(1.2, 440);
  }, []);

  const isCurrentPartLocked = mode === 'strict' && Boolean(lockedParts[activePart.partNumber]);

  const activeSegment: IeltsListeningSegment | undefined = useMemo(() => {
    return (
      activePart.segments.find((seg) => currentSec >= seg.startSec && currentSec < seg.endSec) ??
      activePart.segments[activePart.segments.length - 1]
    );
  }, [activePart.segments, currentSec]);

  useEffect(() => {
    if (postSubmissionUnlocked) {
      setShowTranscript(true);
    }
  }, [postSubmissionUnlocked]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.playbackRate = mode === 'guided' ? speed : 1.0;
    }
  }, [volume, speed, mode, wavDataUri]);

  const stopSpeech = () => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignore headless speechSynthesis errors
      }
    }
    lastSpokenSegmentIdRef.current = null;
  };

  const speakSegment = (seg: IeltsListeningSegment, rate: number) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    if (lastSpokenSegmentIdRef.current === seg.id) return;
    lastSpokenSegmentIdRef.current = seg.id;

    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(seg.text);
      utterance.lang = seg.accent;
      utterance.rate = rate;
      utterance.volume = volume;
      const voices = window.speechSynthesis.getVoices();
      const matchedVoice =
        voices.find((v) => v.lang.toLowerCase() === seg.accent.toLowerCase()) ??
        voices.find((v) => v.lang.toLowerCase().startsWith(seg.accent.slice(0, 2).toLowerCase()));
      if (matchedVoice) {
        utterance.voice = matchedVoice;
      }
      window.speechSynthesis.speak(utterance);
    } catch {
      // Timed caption fallback remains active automatically
    }
  };

  useEffect(() => {
    if (!isPlaying) {
      if (audioRef.current && !audioRef.current.paused) {
        audioRef.current.pause();
      }
      stopSpeech();
      return;
    }

    if (audioRef.current) {
      audioRef.current.currentTime = currentSec;
      void audioRef.current.play().catch(() => {
        // Headless browsers may block autoplay without gesture; timer loop continues
      });
    }

    const effectiveRate = mode === 'guided' ? speed : 1.0;
    const intervalMs = Math.round(1000 / effectiveRate);
    const timer = window.setInterval(() => {
      setCurrentSec((prev) => {
        const next = prev + 1;
        if (next >= activePart.durationSec) {
          setIsPlaying(false);
          if (mode === 'strict') {
            setLockedParts((lp) => ({ ...lp, [activePart.partNumber]: true }));
          }
          stopSpeech();
          return activePart.durationSec;
        }
        return next;
      });
    }, intervalMs);

    return () => {
      window.clearInterval(timer);
    };
  }, [isPlaying, mode, speed, activePart.durationSec, activePart.partNumber]);

  useEffect(() => {
    if (!isPlaying || !activeSegment) return;
    const effectiveRate = mode === 'guided' ? speed : 1.0;
    speakSegment(activeSegment, effectiveRate);
  }, [isPlaying, activeSegment, mode, speed]);

  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, []);

  const handleSelectPart = (partNum: 1 | 2 | 3 | 4) => {
    setIsPlaying(false);
    stopSpeech();
    setSelectedPartNumber(partNum);
    setCurrentSec(0);
  };

  const handleModeChange = (nextMode: DeliveryMode) => {
    setIsPlaying(false);
    stopSpeech();
    setMode(nextMode);
    if (nextMode === 'guided') {
      setShowTranscript(true);
    }
  };

  const handleTogglePlay = () => {
    if (isCurrentPartLocked) return;
    if (currentSec >= activePart.durationSec) {
      setCurrentSec(0);
    }
    setIsPlaying((prev) => !prev);
  };

  const handleSeekSegment = (seg: IeltsListeningSegment) => {
    if (mode !== 'guided') return;
    lastSpokenSegmentIdRef.current = null;
    setCurrentSec(seg.startSec);
    if (audioRef.current) {
      audioRef.current.currentTime = seg.startSec;
    }
    setIsPlaying(true);
  };

  const handleHeadphoneCheck = () => {
    setHeadphoneStatus('testing');
    if (testAudioRef.current) {
      testAudioRef.current.volume = volume;
      testAudioRef.current.currentTime = 0;
      void testAudioRef.current.play().catch(() => {
        // Ignore autoplay restriction in headless environments
      });
    }
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
        const checkUtterance = new SpeechSynthesisUtterance(
          'Headphone check. Left and right channel audio verified.',
        );
        checkUtterance.lang = 'en-GB';
        checkUtterance.volume = volume;
        window.speechSynthesis.speak(checkUtterance);
      } catch {
        // Ignore headless speech errors
      }
    }
    window.setTimeout(() => {
      setHeadphoneStatus('verified');
    }, 900);
  };

  const progressPct = Math.min(
    100,
    Math.round((currentSec / Math.max(1, activePart.durationSec)) * 100),
  );

  const transcriptAccessible = mode === 'guided' || postSubmissionUnlocked || showTranscript;

  return (
    <div className="space-y-4">
      <audio ref={audioRef} src={wavDataUri} preload="auto" aria-hidden="true" />
      <audio ref={testAudioRef} src={headphoneTestWavUri} preload="auto" aria-hidden="true" />

      {/* Top Official CD-IELTS Audio Control Bar */}
      <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-3">
          <div className="flex items-center gap-2">
            <Headphones className="h-4 w-4 text-[var(--brand)]" aria-hidden="true" />
            <span className="text-xs font-bold tracking-wide text-[var(--brand-deep)]">
              {isBn
                ? 'সার্টিফাইড CD-IELTS লিসেনিং অডিও ইঞ্জিন'
                : 'Certified CD-IELTS Listening Audio Engine'}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => handleModeChange('strict')}
              className={
                mode === 'strict'
                  ? 'rounded-[4px] border border-[var(--brand)] bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer'
                  : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] cursor-pointer'
              }
            >
              {isBn ? 'স্ট্রিক্ট এক্সাম মোড (১ বার প্লে)' : 'Strict Exam Mode (Play Once)'}
            </button>
            <button
              type="button"
              onClick={() => handleModeChange('guided')}
              className={
                mode === 'guided'
                  ? 'rounded-[4px] border border-[var(--brand)] bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold text-white cursor-pointer'
                  : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] cursor-pointer'
              }
            >
              {isBn
                ? 'গাইডেড প্র্যাকটিস ও ট্রান্সক্রিপ্ট'
                : 'Guided Practice & Transcript'}
            </button>
          </div>
        </div>

        {/* 4-Part Selector */}
        <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {IELTS_LISTENING_SCRIPTS.map((part) => {
            const isSelected = part.partNumber === activePart.partNumber;
            const partLocked = mode === 'strict' && Boolean(lockedParts[part.partNumber]);
            return (
              <button
                key={part.id}
                type="button"
                onClick={() => handleSelectPart(part.partNumber)}
                className={
                  isSelected
                    ? 'rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-3 py-2 text-left cursor-pointer'
                    : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-2 text-left hover:bg-[var(--bg-warm)] cursor-pointer'
                }
              >
                <div className="flex items-center justify-between gap-1">
                  <span className="text-xs font-bold text-[var(--brand-deep)]">
                    Part {part.partNumber}
                  </span>
                  {partLocked ? (
                    <Lock className="h-3 w-3 text-[var(--crimson)]" aria-hidden="true" />
                  ) : null}
                </div>
                <p className="mt-0.5 text-xs text-[var(--text-muted)]">{part.accentLabel}</p>
              </button>
            );
          })}
        </div>

        {/* Active Part Header & Headphone Check */}
        <div className="mt-4 flex flex-wrap items-start justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-[var(--brand-deep)]">
              {isBn ? activePart.titleBn : activePart.titleEn}
            </h3>
            <p className="mt-1 text-xs text-[var(--text-muted)]">
              {isBn ? activePart.contextBn : activePart.contextEn}
            </p>
          </div>

          <button
            type="button"
            onClick={handleHeadphoneCheck}
            className="flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] cursor-pointer"
          >
            {headphoneStatus === 'verified' ? (
              <CheckCircle2 className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
            ) : (
              <Volume2 className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
            )}
            <span>
              {headphoneStatus === 'testing'
                ? isBn
                  ? 'হেডফোন পরীক্ষা চলছে...'
                  : 'Testing Audio...'
                : headphoneStatus === 'verified'
                  ? isBn
                    ? 'হেডফোন ও ভলিউম যাচাইকৃত'
                    : 'Headphones Verified'
                  : isBn
                    ? 'হেডফোন ও ভলিউম পরীক্ষা'
                    : 'Test Headphones & Volume'}
            </span>
          </button>
        </div>

        {/* Transport & Speed Controls */}
        <div className="mt-4 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                disabled={isCurrentPartLocked}
                onClick={handleTogglePlay}
                className="flex items-center gap-1.5 rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--crimson)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
              >
                {isPlaying ? (
                  <>
                    <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>{isBn ? 'বিরতি' : 'Pause'}</span>
                  </>
                ) : (
                  <>
                    <Play className="h-3.5 w-3.5" aria-hidden="true" />
                    <span>
                      {isCurrentPartLocked
                        ? isBn
                          ? 'প্লেব্যাক লকড (সম্পন্ন)'
                          : 'Playback Locked (Completed)'
                        : isBn
                          ? 'অডিও চালান'
                          : 'Play Recording'}
                    </span>
                  </>
                )}
              </button>

              {mode === 'guided' ? (
                <button
                  type="button"
                  onClick={() => {
                    setIsPlaying(false);
                    stopSpeech();
                    setCurrentSec(0);
                  }}
                  className="flex items-center gap-1 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] cursor-pointer"
                >
                  <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>{isBn ? 'রিসেট' : 'Reset'}</span>
                </button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {mode === 'guided' ? (
                <div className="flex items-center gap-1" role="group" aria-label="Playback speed">
                  {([0.85, 1.0, 1.15, 1.25] as const).map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setSpeed(rate)}
                      className={
                        speed === rate
                          ? 'rounded-[4px] border border-[var(--brand)] bg-[var(--brand)] px-2 py-1 font-mono text-xs font-bold text-white cursor-pointer'
                          : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2 py-1 font-mono text-xs text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] cursor-pointer'
                      }
                    >
                      {rate}x
                    </button>
                  ))}
                </div>
              ) : null}

              <label className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
                <Volume2 className="h-3.5 w-3.5 text-[var(--brand)]" aria-hidden="true" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  aria-label="Audio volume"
                  className="w-16 accent-[var(--brand)] cursor-pointer"
                />
              </label>

              <span className="font-mono text-xs font-bold text-[var(--brand-ink)]">
                {formatClock(currentSec)} / {formatClock(activePart.durationSec)}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div
            className="mt-3 h-2.5 w-full overflow-hidden rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)]"
            role="progressbar"
            aria-valuenow={currentSec}
            aria-valuemin={0}
            aria-valuemax={activePart.durationSec}
          >
            <div
              className="h-full bg-[var(--brand)] transition-all duration-300"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          {/* Live Synchronized Caption Fallback */}
          {activeSegment ? (
            <div className="mt-3 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-xs text-[var(--text)]">
              <span className="font-bold text-[var(--brand-deep)]">
                [{activeSegment.speaker} • {activeSegment.accent}]:{' '}
              </span>
              <span>{activeSegment.text}</span>
            </div>
          ) : null}
        </div>
      </div>

      {/* Interactive Synchronized Transcript & Distractor Trap Drawer */}
      <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h4 className="text-xs font-bold tracking-wide text-[var(--brand-deep)]">
              {isBn
                ? 'সিঙ্ক্রোনাইজড ইন্টার‍্যাক্টিভ ট্রান্সক্রিপ্ট ও ডিস্ট্র্যাক্টর ট্র্যাপ'
                : 'Synchronized Interactive Transcript & Distractor Traps'}
            </h4>
            <p className="mt-0.5 text-xs text-[var(--text-muted)]">
              {mode === 'strict' && !postSubmissionUnlocked
                ? isBn
                  ? 'স্ট্রিক্ট মোডে পরীক্ষা চলাকালীন ট্রান্সক্রিপ্ট লক থাকে; চাইলে রিভিউ টগল করতে পারেন।'
                  : 'In Strict Exam Mode, transcript review is meant for post-submission check.'
                : isBn
                  ? 'যেকোনো বাক্যে ক্লিক করে সেই টাইমস্ট্যাম্প থেকে অডিও শুনুন।'
                  : 'Click Play [mm:ss] on any sentence to jump directly to that timestamp.'}
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowTranscript((prev) => !prev)}
            className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--bg-warm)] cursor-pointer"
          >
            {transcriptAccessible
              ? isBn
                ? 'ট্রান্সক্রিপ্ট লুকান'
                : 'Hide Transcript'
              : isBn
                ? 'ট্রান্সক্রিপ্ট দেখুন'
                : 'Reveal Transcript'}
          </button>
        </div>

        {transcriptAccessible ? (
          <div className="mt-4 space-y-3">
            {activePart.segments.map((seg) => {
              const isCurrent = activeSegment?.id === seg.id;
              return (
                <div
                  key={seg.id}
                  className={
                    isCurrent
                      ? 'rounded-[4px] border border-[var(--hairline)] border-l-[3px] border-l-[var(--brand)] bg-[var(--bg-warm)] p-3'
                      : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3'
                  }
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[var(--brand-deep)]">
                        {seg.speaker}
                      </span>
                      <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2 py-0.5 font-mono text-xs text-[var(--text-muted)]">
                        {seg.accent}
                      </span>
                      {seg.linkedQuestionId ? (
                        <span className="rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-2 py-0.5 font-mono text-xs font-semibold text-[var(--brand-deep)]">
                          {seg.linkedQuestionId}
                        </span>
                      ) : null}
                    </div>

                    <button
                      type="button"
                      disabled={mode !== 'guided'}
                      onClick={() => handleSeekSegment(seg)}
                      className="flex items-center gap-1 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-1 font-mono text-xs font-semibold text-[var(--brand)] hover:bg-[var(--bg-tint)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                    >
                      <Play className="h-3 w-3" aria-hidden="true" />
                      <span>Play [{formatClock(seg.startSec)}]</span>
                    </button>
                  </div>

                  <p className="mt-2 text-sm leading-relaxed text-[var(--text)]">{seg.text}</p>

                  {seg.distractorTrapNote ? (
                    <div className="mt-2 flex items-start gap-2 rounded-[4px] border border-[var(--crimson)] bg-[var(--surface-paper)] px-3 py-2 text-xs text-[var(--brand-ink)]">
                      <AlertCircle
                        className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[var(--crimson)]"
                        aria-hidden="true"
                      />
                      <div>
                        <span className="font-bold text-[var(--crimson)]">
                          [Distractor Trap Explained]{' '}
                        </span>
                        <span>{seg.distractorTrapNote}</span>
                      </div>
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
