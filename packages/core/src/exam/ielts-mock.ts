/** @purpose IELTS 4-Skill Mock Attempt Lifecycle, strict play-once listening enforcement, auto-submit, and unified band report aggregation (docs/07 §3.2, docs/14 §1.2) */

import { brand } from '@lumen/config';
import {
  LISTENING_TABLE,
  ACADEMIC_READING_TABLE,
  GT_READING_TABLE,
  rawToBand,
  overallBand,
  writingBand,
  speakingBand,
} from './ielts-scoring';

export type IeltsTrack = 'ielts_academic' | 'ielts_gt';
export type IeltsSectionType = 'listening' | 'reading' | 'writing' | 'speaking';
export type IeltsAttemptStatus =
  | 'not_started'
  | 'listening'
  | 'reading'
  | 'writing'
  | 'speaking'
  | 'completed';

export type CefrLevel = 'C2' | 'C1' | 'B2' | 'B1' | 'A2' | 'A1';

export interface CefrMapping {
  cefr: CefrLevel;
  descriptor: string;
}

export const IELTS_SECTION_DURATIONS_SECONDS: Record<IeltsSectionType, number> = {
  listening: 30 * 60, // 30 minutes
  reading: 60 * 60,   // 60 minutes
  writing: 60 * 60,   // 60 minutes
  speaking: 14 * 60,  // 11-14 minutes standard
};

export const IELTS_SPEAKING_PART2_PREP_SECONDS = 60; // 1-min prep timer
export const IELTS_SPEAKING_PART2_RECORD_SECONDS = 120; // 2-min recording timer

export interface SectionTimerState {
  allowedSeconds: number;
  startedAt?: string;
  submittedAt?: string;
  isExpired: boolean;
}

export interface ListeningAudioState {
  audioPlayed: boolean;
  audioPlaybackStartedAt?: string;
  allowRewind: boolean;
}

export interface IeltsMockAttemptAnswers {
  listening?: Record<string, string>;
  reading?: Record<string, string>;
  writing?: {
    task1?: string;
    task2?: string;
  };
  speaking?: {
    part1AudioUrl?: string;
    part2AudioUrl?: string;
    part3AudioUrl?: string;
    part2Notes?: string;
    part2Transcript?: string;
  };
}

export interface IeltsSkillBandResult {
  raw?: number;
  maxRaw?: number;
  band: number;
  estimated?: boolean;
  conversionTable?: string;
}

export interface IeltsBandReport {
  attemptId: string;
  track: IeltsTrack;
  completedAt: string;
  overallBand: number;
  cefr: CefrLevel;
  cefrDescriptor: string;
  estimated: true;
  disclaimer: string;
  skills: {
    listening: IeltsSkillBandResult & { raw: number; maxRaw: 40 };
    reading: IeltsSkillBandResult & { raw: number; maxRaw: 40; conversionTable: 'academic' | 'gt' };
    writing: IeltsSkillBandResult & {
      task1Band?: number;
      task2Band?: number;
      task1Words?: number;
      task2Words?: number;
    };
    speaking: IeltsSkillBandResult & {
      criteria?: {
        fluencyAndCoherence: number;
        lexicalResource: number;
        grammaticalRangeAndAccuracy: number;
        pronunciation: number;
      };
    };
  };
}

export interface IeltsMockAttempt {
  id: string;
  userId: string;
  track: IeltsTrack;
  status: IeltsAttemptStatus;
  currentSection: IeltsSectionType | 'completed';
  strictMockMode: boolean;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  listeningAudio: ListeningAudioState;
  sectionTimers: Record<IeltsSectionType, SectionTimerState>;
  answers: IeltsMockAttemptAnswers;
  report?: IeltsBandReport;
}

export const OFFICIAL_IELTS_DISCLAIMER =
  `Scores provided by ${brand.name} are diagnostic estimates intended for prep purposes. Official IELTS scores are issued exclusively by IDP Education, British Council, and Cambridge English Assessment.`;

/**
 * Maps an official overall IELTS Band score to the CEFR scale per Cambridge / IELTS guidelines (docs/14 §1.2).
 */
export function mapIeltsBandToCefr(band: number): CefrMapping {
  if (band >= 8.5) {
    return { cefr: 'C2', descriptor: 'Expert User' };
  }
  if (band >= 7.0) {
    return { cefr: 'C1', descriptor: 'Good User' };
  }
  if (band >= 5.5) {
    return { cefr: 'B2', descriptor: 'Competent User' };
  }
  if (band >= 4.0) {
    return { cefr: 'B1', descriptor: 'Modest User' };
  }
  if (band >= 3.0) {
    return { cefr: 'A2', descriptor: 'Extremely Limited User' };
  }
  return { cefr: 'A1', descriptor: 'Intermittent / Non-User' };
}

/**
 * Creates a fresh stateful IELTS Mock Attempt initialized at section 1 (listening).
 */
export function createIeltsMockAttempt(params: {
  id: string;
  userId: string;
  track: IeltsTrack;
  strictMockMode?: boolean;
  customDurations?: Partial<Record<IeltsSectionType, number>>;
}): IeltsMockAttempt {
  const strict = params.strictMockMode ?? true;
  const now = new Date().toISOString();

  return {
    id: params.id,
    userId: params.userId,
    track: params.track,
    status: 'not_started',
    currentSection: 'listening',
    strictMockMode: strict,
    createdAt: now,
    listeningAudio: {
      audioPlayed: false,
      allowRewind: !strict,
    },
    sectionTimers: {
      listening: {
        allowedSeconds:
          params.customDurations?.listening ?? IELTS_SECTION_DURATIONS_SECONDS.listening,
        isExpired: false,
      },
      reading: {
        allowedSeconds:
          params.customDurations?.reading ?? IELTS_SECTION_DURATIONS_SECONDS.reading,
        isExpired: false,
      },
      writing: {
        allowedSeconds:
          params.customDurations?.writing ?? IELTS_SECTION_DURATIONS_SECONDS.writing,
        isExpired: false,
      },
      speaking: {
        allowedSeconds:
          params.customDurations?.speaking ?? IELTS_SECTION_DURATIONS_SECONDS.speaking,
        isExpired: false,
      },
    },
    answers: {},
  };
}

/**
 * Starts an attempt or transitions into a section.
 */
export function startIeltsSection(
  attempt: IeltsMockAttempt,
  section: IeltsSectionType,
  now: Date = new Date()
): IeltsMockAttempt {
  if (attempt.status === 'completed') {
    throw new Error('Attempt is already completed.');
  }
  if (attempt.currentSection !== section) {
    throw new Error(`Cannot start "${section}" while attempt is at "${attempt.currentSection}".`);
  }
  if (attempt.sectionTimers[section].submittedAt) {
    throw new Error(`Section "${section}" was already submitted.`);
  }

  const updated: IeltsMockAttempt = {
    ...attempt,
    status: section,
    currentSection: section,
    startedAt: attempt.startedAt ?? now.toISOString(),
    sectionTimers: {
      ...attempt.sectionTimers,
      [section]: {
        ...attempt.sectionTimers[section],
        startedAt: attempt.sectionTimers[section].startedAt ?? now.toISOString(),
      },
    },
  };

  return updated;
}

/**
 * Enforces the strict play-once audio rule for the Listening section (docs/07 §3.2).
 * In strict mock mode, audio can only be triggered once and cannot be restarted or rewound.
 */
export function playListeningAudio(
  attempt: IeltsMockAttempt,
  now: Date = new Date()
): IeltsMockAttempt {
  if (attempt.currentSection !== 'listening') {
    throw new Error(`Cannot play listening audio while in section "${attempt.currentSection}".`);
  }

  if (attempt.strictMockMode && attempt.listeningAudio.audioPlayed) {
    throw new Error(
      'Listening audio has already been played. In strict IELTS mock mode, audio cannot be replayed or rewound.'
    );
  }

  return {
    ...attempt,
    listeningAudio: {
      ...attempt.listeningAudio,
      audioPlayed: true,
      audioPlaybackStartedAt: now.toISOString(),
    },
  };
}

/**
 * Validates audio seek operations. Rewinding or seeking backward is blocked in strict mock mode.
 */
export function validateAudioSeek(
  attempt: IeltsMockAttempt,
  currentTimeSeconds: number,
  targetTimeSeconds: number
): boolean {
  if (!attempt.strictMockMode) {
    return true;
  }
  if (targetTimeSeconds < currentTimeSeconds) {
    throw new Error(
      `Audio rewind is disabled in strict IELTS mock mode (${targetTimeSeconds}s < ${currentTimeSeconds}s).`
    );
  }
  return true;
}

export function getNextIeltsSection(
  current: IeltsSectionType
): IeltsSectionType | 'completed' {
  switch (current) {
    case 'listening':
      return 'reading';
    case 'reading':
      return 'writing';
    case 'writing':
      return 'speaking';
    case 'speaking':
      return 'completed';
  }
}

/**
 * Checks section timer expiry and enforces auto-submit when time has elapsed.
 */
export function checkAndEnforceSectionExpiry(
  attempt: IeltsMockAttempt,
  section: IeltsSectionType,
  currentTime: Date = new Date()
): {
  attempt: IeltsMockAttempt;
  isExpired: boolean;
  elapsedSeconds: number;
  remainingSeconds: number;
} {
  const timer = attempt.sectionTimers[section];
  if (!timer.startedAt) {
    return {
      attempt,
      isExpired: false,
      elapsedSeconds: 0,
      remainingSeconds: timer.allowedSeconds,
    };
  }

  const startTimeMs = new Date(timer.startedAt).getTime();
  const nowMs = currentTime.getTime();
  const elapsedSeconds = Math.max(0, Math.floor((nowMs - startTimeMs) / 1000));
  const remainingSeconds = Math.max(0, timer.allowedSeconds - elapsedSeconds);
  const isExpired = elapsedSeconds >= timer.allowedSeconds;

  if (isExpired && !timer.submittedAt) {
    const next = getNextIeltsSection(section);
    const updatedAttempt: IeltsMockAttempt = {
      ...attempt,
      status: next === 'completed' ? 'completed' : next,
      currentSection: next,
      completedAt: next === 'completed' ? currentTime.toISOString() : undefined,
      sectionTimers: {
        ...attempt.sectionTimers,
        [section]: {
          ...timer,
          isExpired: true,
          submittedAt: currentTime.toISOString(),
        },
      },
    };
    return {
      attempt: updatedAttempt,
      isExpired: true,
      elapsedSeconds,
      remainingSeconds: 0,
    };
  }

  return {
    attempt,
    isExpired,
    elapsedSeconds,
    remainingSeconds,
  };
}

/**
 * Submits answers for a section and auto-advances to the next section.
 */
export function submitSectionAnswers(
  attempt: IeltsMockAttempt,
  section: IeltsSectionType,
  answers: IeltsMockAttemptAnswers[IeltsSectionType],
  now: Date = new Date()
): IeltsMockAttempt {
  if (attempt.currentSection !== section) {
    throw new Error(
      `Cannot submit answers for "${section}" while attempt is at "${attempt.currentSection}".`
    );
  }
  if (attempt.sectionTimers[section].submittedAt) {
    throw new Error(`Section "${section}" was already submitted.`);
  }

  const sync = checkAndEnforceSectionExpiry(attempt, section, now);
  if (sync.isExpired) {
    throw new Error(`Section "${section}" has expired; answers rejected.`);
  }

  const nextSection = getNextIeltsSection(section);
  const nowIso = now.toISOString();

  return {
    ...attempt,
    status: nextSection === 'completed' ? 'completed' : nextSection,
    currentSection: nextSection,
    completedAt: nextSection === 'completed' ? nowIso : undefined,
    sectionTimers: {
      ...attempt.sectionTimers,
      [section]: {
        ...attempt.sectionTimers[section],
        submittedAt: nowIso,
      },
    },
    answers: {
      ...attempt.answers,
      [section]: answers,
    },
  };
}

/**
 * Calculates phase for IELTS Speaking Part 2 (1-min prep + 2-min recording).
 */
export function getSpeakingPart2Phase(elapsedSeconds: number): {
  phase: 'prep' | 'recording' | 'finished';
  remainingSeconds: number;
  totalPhaseSeconds: number;
} {
  if (elapsedSeconds < IELTS_SPEAKING_PART2_PREP_SECONDS) {
    return {
      phase: 'prep',
      remainingSeconds: Math.max(0, IELTS_SPEAKING_PART2_PREP_SECONDS - elapsedSeconds),
      totalPhaseSeconds: IELTS_SPEAKING_PART2_PREP_SECONDS,
    };
  }

  const recordElapsed = elapsedSeconds - IELTS_SPEAKING_PART2_PREP_SECONDS;
  if (recordElapsed < IELTS_SPEAKING_PART2_RECORD_SECONDS) {
    return {
      phase: 'recording',
      remainingSeconds: Math.max(0, IELTS_SPEAKING_PART2_RECORD_SECONDS - recordElapsed),
      totalPhaseSeconds: IELTS_SPEAKING_PART2_RECORD_SECONDS,
    };
  }

  return {
    phase: 'finished',
    remainingSeconds: 0,
    totalPhaseSeconds: IELTS_SPEAKING_PART2_RECORD_SECONDS,
  };
}

export interface WritingScoreInput {
  task1Band?: number;
  task2Band?: number;
  overallWritingBand?: number;
  task1Words?: number;
  task2Words?: number;
}

export interface SpeakingScoreInput {
  speakingBand?: number;
  criteria?: {
    fluencyAndCoherence: number;
    lexicalResource: number;
    grammaticalRangeAndAccuracy: number;
    pronunciation: number;
  };
}

/**
 * Aggregates all 4 skill results into a single official-style IELTS Band Report.
 */
export function aggregateIeltsBandReport(params: {
  attemptId: string;
  track: IeltsTrack;
  listeningRaw: number;
  readingRaw: number;
  writing: WritingScoreInput;
  speaking: SpeakingScoreInput;
  completedAt?: string;
}): IeltsBandReport {
  const listeningBand = rawToBand(params.listeningRaw, LISTENING_TABLE);

  const readingTable =
    params.track === 'ielts_academic' ? ACADEMIC_READING_TABLE : GT_READING_TABLE;
  const readingBand = rawToBand(params.readingRaw, readingTable);

  let finalWritingBand: number;
  if (params.writing.overallWritingBand !== undefined) {
    finalWritingBand = params.writing.overallWritingBand;
  } else if (
    params.writing.task1Band !== undefined &&
    params.writing.task2Band !== undefined
  ) {
    finalWritingBand = writingBand(params.writing.task1Band, params.writing.task2Band);
  } else {
    throw new Error('Writing score requires either overallWritingBand or both task1Band and task2Band.');
  }

  let finalSpeakingBand: number;
  if (params.speaking.speakingBand !== undefined) {
    finalSpeakingBand = params.speaking.speakingBand;
  } else if (params.speaking.criteria) {
    const c = params.speaking.criteria;
    finalSpeakingBand = speakingBand([
      c.fluencyAndCoherence,
      c.lexicalResource,
      c.grammaticalRangeAndAccuracy,
      c.pronunciation,
    ]);
  } else {
    throw new Error('Speaking score requires either speakingBand or 4 criteria.');
  }

  const overall = overallBand(
    listeningBand,
    readingBand,
    finalWritingBand,
    finalSpeakingBand
  );

  const cefrInfo = mapIeltsBandToCefr(overall);
  const completedAt = params.completedAt ?? new Date().toISOString();

  return {
    attemptId: params.attemptId,
    track: params.track,
    completedAt,
    overallBand: overall,
    cefr: cefrInfo.cefr,
    cefrDescriptor: cefrInfo.descriptor,
    estimated: true,
    disclaimer: OFFICIAL_IELTS_DISCLAIMER,
    skills: {
      listening: {
        raw: params.listeningRaw,
        maxRaw: 40,
        band: listeningBand,
      },
      reading: {
        raw: params.readingRaw,
        maxRaw: 40,
        band: readingBand,
        conversionTable: params.track === 'ielts_academic' ? 'academic' : 'gt',
      },
      writing: {
        band: finalWritingBand,
        task1Band: params.writing.task1Band,
        task2Band: params.writing.task2Band,
        task1Words: params.writing.task1Words,
        task2Words: params.writing.task2Words,
        estimated: true,
      },
      speaking: {
        band: finalSpeakingBand,
        estimated: true,
        criteria: params.speaking.criteria,
      },
    },
  };
}

// In-memory store for active IELTS mock attempts (server-authoritative ownership & completion state)
const ieltsMockAttemptsMap = new Map<string, IeltsMockAttempt>();

export function saveIeltsMockAttempt(attempt: IeltsMockAttempt): IeltsMockAttempt {
  ieltsMockAttemptsMap.set(attempt.id, attempt);
  return attempt;
}

export function getIeltsMockAttempt(attemptId: string): IeltsMockAttempt | null {
  return ieltsMockAttemptsMap.get(attemptId) ?? null;
}

export function resetIeltsMockAttempts(): void {
  ieltsMockAttemptsMap.clear();
}
