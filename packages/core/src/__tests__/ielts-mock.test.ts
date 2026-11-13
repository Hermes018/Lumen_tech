/** @purpose Unit tests for IELTS Mock Attempt Orchestrator, strict audio enforcement, auto-submit, Speaking Part 2 timer, and Band Report aggregation */

import { describe, it, expect } from 'vitest';
import {
  createIeltsMockAttempt,
  startIeltsSection,
  playListeningAudio,
  validateAudioSeek,
  checkAndEnforceSectionExpiry,
  submitSectionAnswers,
  getSpeakingPart2Phase,
  aggregateIeltsBandReport,
  mapIeltsBandToCefr,
  OFFICIAL_IELTS_DISCLAIMER,
} from '../exam/ielts-mock';

describe('IELTS Mock Orchestrator & Lifecycle', () => {
  it('initializes a fresh attempt in not_started state at section 1 (listening)', () => {
    const attempt = createIeltsMockAttempt({
      id: 'att_123',
      userId: 'usr_456',
      track: 'ielts_academic',
      strictMockMode: true,
    });

    expect(attempt.id).toBe('att_123');
    expect(attempt.status).toBe('not_started');
    expect(attempt.currentSection).toBe('listening');
    expect(attempt.strictMockMode).toBe(true);
    expect(attempt.listeningAudio.audioPlayed).toBe(false);
    expect(attempt.listeningAudio.allowRewind).toBe(false);
    expect(attempt.sectionTimers.listening.allowedSeconds).toBe(1800);
    expect(attempt.sectionTimers.reading.allowedSeconds).toBe(3600);
    expect(attempt.sectionTimers.writing.allowedSeconds).toBe(3600);
    expect(attempt.sectionTimers.speaking.allowedSeconds).toBe(840);
  });

  it('progresses through the 4-section lifecycle listening -> reading -> writing -> speaking -> completed', () => {
    let attempt = createIeltsMockAttempt({
      id: 'att_life',
      userId: 'usr_life',
      track: 'ielts_academic',
    });

    // 1. Listening
    attempt = startIeltsSection(attempt, 'listening');
    expect(attempt.status).toBe('listening');
    expect(attempt.currentSection).toBe('listening');
    expect(attempt.sectionTimers.listening.startedAt).toBeDefined();

    attempt = submitSectionAnswers(attempt, 'listening', { 'q1': 'Library' });
    expect(attempt.currentSection).toBe('reading');
    expect(attempt.status).toBe('reading');
    expect(attempt.answers.listening).toEqual({ 'q1': 'Library' });

    // 2. Reading
    attempt = submitSectionAnswers(attempt, 'reading', { 'q1': 'True', 'q2': 'False' });
    expect(attempt.currentSection).toBe('writing');
    expect(attempt.status).toBe('writing');

    // 3. Writing
    attempt = submitSectionAnswers(attempt, 'writing', {
      task1: 'The chart illustrates...',
      task2: 'In recent decades...',
    });
    expect(attempt.currentSection).toBe('speaking');
    expect(attempt.status).toBe('speaking');

    // 4. Speaking
    attempt = submitSectionAnswers(attempt, 'speaking', {
      part2Notes: 'Memorable trip to Coxs Bazar',
      part2Transcript: 'I would like to describe...',
    });
    expect(attempt.currentSection).toBe('completed');
    expect(attempt.status).toBe('completed');
    expect(attempt.completedAt).toBeDefined();
  });

  describe('Listening Strict Play-Once Audio & Rewind Prevention', () => {
    it('allows playing audio once and rejects second playback in strict mock mode', () => {
      let attempt = createIeltsMockAttempt({
        id: 'att_audio',
        userId: 'usr_audio',
        track: 'ielts_academic',
        strictMockMode: true,
      });
      attempt = startIeltsSection(attempt, 'listening');

      // First play succeeds
      attempt = playListeningAudio(attempt);
      expect(attempt.listeningAudio.audioPlayed).toBe(true);
      expect(attempt.listeningAudio.audioPlaybackStartedAt).toBeDefined();

      // Second play in strict mode throws error
      expect(() => playListeningAudio(attempt)).toThrowError(
        /In strict IELTS mock mode, audio cannot be replayed or rewound/
      );
    });

    it('rejects backward seek (rewind) in strict mock mode but allows forward seek or normal playback', () => {
      const strictAttempt = createIeltsMockAttempt({
        id: 'att_seek',
        userId: 'usr_seek',
        track: 'ielts_academic',
        strictMockMode: true,
      });

      // Seeking forward or playing ahead is valid
      expect(validateAudioSeek(strictAttempt, 30, 45)).toBe(true);

      // Seeking backward (rewind) throws Range/Validation error
      expect(() => validateAudioSeek(strictAttempt, 45, 20)).toThrowError(
        /Audio rewind is disabled in strict IELTS mock mode/
      );
    });

    it('allows rewind if strict mock mode is disabled (practice mode)', () => {
      const practiceAttempt = createIeltsMockAttempt({
        id: 'att_prac',
        userId: 'usr_prac',
        track: 'ielts_academic',
        strictMockMode: false,
      });

      expect(validateAudioSeek(practiceAttempt, 50, 10)).toBe(true);
    });
  });

  describe('Section Auto-Submit on Timer Expiry', () => {
    it('detects unexpired section timer when remaining time is positive', () => {
      const now = new Date();
      let attempt = createIeltsMockAttempt({
        id: 'att_timer',
        userId: 'usr_timer',
        track: 'ielts_academic',
      });
      attempt = startIeltsSection(attempt, 'reading', now);

      const checkTime = new Date(now.getTime() + 10 * 60 * 1000); // 10 minutes later (allowed 60 mins)
      const res = checkAndEnforceSectionExpiry(attempt, 'reading', checkTime);

      expect(res.isExpired).toBe(false);
      expect(res.remainingSeconds).toBe(50 * 60);
      expect(res.attempt.currentSection).toBe('reading');
    });

    it('auto-submits and transitions to next section when timer expires', () => {
      const now = new Date();
      let attempt = createIeltsMockAttempt({
        id: 'att_expiry',
        userId: 'usr_expiry',
        track: 'ielts_academic',
      });
      attempt = startIeltsSection(attempt, 'listening', now);

      // 31 minutes later (listening allowed 30 min = 1800s)
      const expiredTime = new Date(now.getTime() + 31 * 60 * 1000);
      const res = checkAndEnforceSectionExpiry(attempt, 'listening', expiredTime);

      expect(res.isExpired).toBe(true);
      expect(res.remainingSeconds).toBe(0);
      expect(res.attempt.currentSection).toBe('reading');
      expect(res.attempt.sectionTimers.listening.isExpired).toBe(true);
      expect(res.attempt.sectionTimers.listening.submittedAt).toBeDefined();
    });
  });

  describe('Speaking Part 2 Timers (1-min prep + 2-min recording)', () => {
    it('reports prep phase during first 60 seconds', () => {
      const t1 = getSpeakingPart2Phase(0);
      expect(t1.phase).toBe('prep');
      expect(t1.remainingSeconds).toBe(60);

      const t2 = getSpeakingPart2Phase(45);
      expect(t2.phase).toBe('prep');
      expect(t2.remainingSeconds).toBe(15);
    });

    it('reports recording phase from 60s to 180s (2 minutes)', () => {
      const t3 = getSpeakingPart2Phase(60);
      expect(t3.phase).toBe('recording');
      expect(t3.remainingSeconds).toBe(120);

      const t4 = getSpeakingPart2Phase(130);
      expect(t4.phase).toBe('recording');
      expect(t4.remainingSeconds).toBe(50);
    });

    it('reports finished phase after 180s', () => {
      const t5 = getSpeakingPart2Phase(180);
      expect(t5.phase).toBe('finished');
      expect(t5.remainingSeconds).toBe(0);

      const t6 = getSpeakingPart2Phase(200);
      expect(t6.phase).toBe('finished');
      expect(t6.remainingSeconds).toBe(0);
    });
  });

  describe('Unified Band Report Aggregation & CEFR Mapping', () => {
    it('aggregates Academic IELTS mock scores and computes overall band and CEFR C1', () => {
      // Listening: 35/40 raw -> band 8.0
      // Academic Reading: 31/40 raw -> band 7.0 (IDP standard 30-32 = 7.0)
      // Writing: Task 1 band 6.5, Task 2 band 7.5 -> (6.5 + 2*7.5)/3 = 21.5/3 = 7.167 -> 7.0
      // Speaking: FC: 7.0, LR: 7.5, GRA: 7.0, PR: 7.0 -> mean 7.125 -> 7.0
      // Overall: [8.0, 7.0, 7.0, 7.0] -> 29/4 = 7.25 -> rounds UP to 7.5
      // CEFR for 7.5: C1 (Good User)

      const report = aggregateIeltsBandReport({
        attemptId: 'att_rep_acad',
        track: 'ielts_academic',
        listeningRaw: 35,
        readingRaw: 31,
        writing: {
          task1Band: 6.5,
          task2Band: 7.5,
          task1Words: 168,
          task2Words: 275,
        },
        speaking: {
          criteria: {
            fluencyAndCoherence: 7.0,
            lexicalResource: 7.5,
            grammaticalRangeAndAccuracy: 7.0,
            pronunciation: 7.0,
          },
        },
      });

      expect(report.skills.listening.band).toBe(8.0);
      expect(report.skills.reading.band).toBe(7.0);
      expect(report.skills.reading.conversionTable).toBe('academic');
      expect(report.skills.writing.band).toBe(7.0);
      expect(report.skills.speaking.band).toBe(7.0);

      expect(report.overallBand).toBe(7.5);
      expect(report.cefr).toBe('C1');
      expect(report.cefrDescriptor).toBe('Good User');
      expect(report.estimated).toBe(true);
      expect(report.disclaimer).toBe(OFFICIAL_IELTS_DISCLAIMER);
    });

    it('aggregates General Training IELTS mock scores using GT reading table', () => {
      // In GT Reading: 34 raw -> band 7.0 (vs Academic 34 raw = 7.5)
      // Listening: 30 raw -> 7.0
      // Writing overall: 6.5
      // Speaking overall: 6.5
      // Overall: [7.0, 7.0, 6.5, 6.5] -> 27/4 = 6.75 -> rounds UP to 7.0 (C1)

      const report = aggregateIeltsBandReport({
        attemptId: 'att_rep_gt',
        track: 'ielts_gt',
        listeningRaw: 30,
        readingRaw: 34,
        writing: {
          overallWritingBand: 6.5,
        },
        speaking: {
          speakingBand: 6.5,
        },
      });

      expect(report.skills.listening.band).toBe(7.0);
      expect(report.skills.reading.band).toBe(7.0);
      expect(report.skills.reading.conversionTable).toBe('gt');
      expect(report.skills.writing.band).toBe(6.5);
      expect(report.skills.speaking.band).toBe(6.5);

      expect(report.overallBand).toBe(7.0);
      expect(report.cefr).toBe('C1');
    });

    it('maps all CEFR levels accurately across IELTS band spectrum', () => {
      expect(mapIeltsBandToCefr(9.0).cefr).toBe('C2');
      expect(mapIeltsBandToCefr(8.5).cefr).toBe('C2');
      expect(mapIeltsBandToCefr(8.0).cefr).toBe('C1');
      expect(mapIeltsBandToCefr(7.0).cefr).toBe('C1');
      expect(mapIeltsBandToCefr(6.5).cefr).toBe('B2');
      expect(mapIeltsBandToCefr(5.5).cefr).toBe('B2');
      expect(mapIeltsBandToCefr(5.0).cefr).toBe('B1');
      expect(mapIeltsBandToCefr(4.0).cefr).toBe('B1');
      expect(mapIeltsBandToCefr(3.5).cefr).toBe('A2');
      expect(mapIeltsBandToCefr(3.0).cefr).toBe('A2');
      expect(mapIeltsBandToCefr(2.5).cefr).toBe('A1');
      expect(mapIeltsBandToCefr(1.0).cefr).toBe('A1');
    });
  });
});
