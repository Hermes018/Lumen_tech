/** @purpose Unit tests for course player, signed Bunny video embed, watermark, and certificate unlock */

import { describe, it, expect } from 'vitest';
import {
  createSignedVideoEmbed,
  generateBunnyEmbedToken,
  resolveSyllabusTree,
  findLessonInSyllabus,
  trackLectureProgress,
  calculateCourseMastery,
  claimCourseCertificate,
  SAMPLE_GRE_QUANT_SYLLABUS,
  type LessonProgress,
} from '../courses/player';
import { maskEmail, maskPhone } from '../support/masking';

describe('Course Player & Anti-Piracy Watermark', () => {
  describe('maskEmail and maskPhone', () => {
    it('masks emails correctly while preserving privacy and domain', () => {
      expect(maskEmail('aymanrahman30@gmail.com')).toBe('a*****0@gmail.com');
      expect(maskEmail('john.doe@example.org')).toBe('j*****e@example.org');
      expect(maskEmail('ab@test.com')).toBe('a*@test.com');
      expect(maskEmail('')).toBe('***@***');
    });

    it('masks phone numbers preserving country code prefix and last digits', () => {
      expect(maskPhone('+8801712345678')).toBe('+8801******678');
      expect(maskPhone('+8801999999999')).toBe('+8801******999');
      expect(maskPhone('12345')).toBe('01******000');
      expect(maskPhone('')).toBe('01******000');
    });
  });

  describe('createSignedVideoEmbed', () => {
    it('generates a valid time-limited Bunny token and URL with clamped TTL', () => {
      const fixedNow = 1700000000;
      const embed = createSignedVideoEmbed(
        'usr_123',
        'student@test.com',
        '+8801712345678',
        'bny_vid_999',
        {
          ttlSeconds: 3600, // 1 hour
          tokenKey: 'test_sec_token',
          libraryId: 'lib_777',
          nowUnix: fixedNow,
        }
      );

      const expectedExpires = fixedNow + 3600;
      expect(embed.expiresUnix).toBe(expectedExpires);
      expect(embed.expiresAt.getTime()).toBe(expectedExpires * 1000);

      const expectedToken = generateBunnyEmbedToken('test_sec_token', 'bny_vid_999', expectedExpires);
      expect(embed.token).toBe(expectedToken);
      expect(embed.embedUrl).toContain('https://iframe.mediadelivery.net/embed/lib_777/bny_vid_999');
      expect(embed.embedUrl).toContain(`token=${expectedToken}`);
      expect(embed.embedUrl).toContain(`expires=${expectedExpires}`);

      // Watermark payload checks
      expect(embed.watermark.maskedEmail).toBe('s*****t@test.com');
      expect(embed.watermark.maskedPhone).toBe('+8801******678');
      expect(embed.watermark.sessionFingerprint).toHaveLength(8);
      expect(embed.watermark.positionSeed).toBeGreaterThanOrEqual(0);
      expect(embed.watermark.positionSeed).toBeLessThan(100);
      expect(embed.watermark.displayText).toContain('s*****t@test.com · ');
    });

    it('clamps TTL to between 10 minutes (600s) and 6 hours (21600s)', () => {
      const fixedNow = 1700000000;

      // Below 600s clamped to 600s
      const lowEmbed = createSignedVideoEmbed(
        'usr_1',
        'a@b.com',
        '+8801700000000',
        'vid_1',
        { ttlSeconds: 100, nowUnix: fixedNow }
      );
      expect(lowEmbed.expiresUnix).toBe(fixedNow + 600);

      // Above 21600s clamped to 21600s
      const highEmbed = createSignedVideoEmbed(
        'usr_1',
        'a@b.com',
        '+8801700000000',
        'vid_1',
        { ttlSeconds: 999999, nowUnix: fixedNow }
      );
      expect(highEmbed.expiresUnix).toBe(fixedNow + 21600);
    });
  });

  describe('Syllabus Tree Resolution and Navigation', () => {
    it('resolves standard syllabus tree for canonical courses', () => {
      const syllabus = resolveSyllabusTree('gre-quant-mastery');
      expect(syllabus.exam).toBe('gre');
      expect(syllabus.modules.length).toBeGreaterThanOrEqual(2);
      expect(syllabus.modules[0]!.lessons[0]!.title).toContain('Prime Factorization');
    });

    it('finds lesson and adjacent links in syllabus', () => {
      const syllabus = SAMPLE_GRE_QUANT_SYLLABUS;
      const found = findLessonInSyllabus(syllabus, 'primes-divisibility');
      expect(found).not.toBeNull();
      expect(found?.lesson.title).toBe('Prime Factorization & Divisibility Traps');
      expect(found?.nextLesson?.lessonSlug).toBe('remainders-modular-arithmetic');
      expect(found?.prevLesson).toBeUndefined();

      // Middle lesson
      const mid = findLessonInSyllabus(syllabus, 'remainders-modular-arithmetic');
      expect(mid?.prevLesson?.lessonSlug).toBe('primes-divisibility');
      expect(mid?.nextLesson?.lessonSlug).toBe('quadratics-and-roots');
    });
  });

  describe('Lecture Progress Tracking & Engagement Signals', () => {
    it('tracks watched seconds and sets completion when >= 90%', () => {
      const initial = trackLectureProgress(undefined, {
        lessonId: 'les_1',
        watchedSeconds: 300,
        totalSeconds: 1000,
      });
      expect(initial.watchedSeconds).toBe(300);
      expect(initial.completed).toBe(false);

      // Reach 900s (90%)
      const updated = trackLectureProgress(initial, {
        lessonId: 'les_1',
        watchedSeconds: 900,
        totalSeconds: 1000,
      });
      expect(updated.completed).toBe(true);
      expect(updated.droppedAtSecond).toBeUndefined();
    });

    it('records droppedAtSecond when learner drops out before completion', () => {
      const progress = trackLectureProgress(undefined, {
        lessonId: 'les_1',
        watchedSeconds: 450,
        totalSeconds: 1000,
        isDroppingOut: true,
      });
      expect(progress.completed).toBe(false);
      expect(progress.droppedAtSecond).toBe(450);
    });
  });

  describe('Course Mastery & 80% Certificate Unlock', () => {
    const syllabus = SAMPLE_GRE_QUANT_SYLLABUS; // total 5 lessons
    // 5 lessons:
    // les_primes_divisibility, les_remainders, les_quadratics, les_coordinate_geo, les_functions

    it('rejects certificate claim if completion is below 80%', () => {
      // 3 of 5 completed = 60%
      const progressMap: Record<string, LessonProgress> = {
        les_primes_divisibility: { lessonId: 'les_primes_divisibility', watchedSeconds: 1200, totalSeconds: 1200, completed: true, bookmarked: false },
        les_remainders: { lessonId: 'les_remainders', watchedSeconds: 980, totalSeconds: 980, completed: true, bookmarked: false },
        les_quadratics: { lessonId: 'les_quadratics', watchedSeconds: 1400, totalSeconds: 1400, completed: true, bookmarked: false },
      };

      const mastery = calculateCourseMastery(syllabus, progressMap);
      expect(mastery.totalLessons).toBe(5);
      expect(mastery.completedLessons).toBe(3);
      expect(mastery.masteryPercentage).toBe(60);
      expect(mastery.isEligibleForCertificate).toBe(false);

      const claim = claimCourseCertificate({
        userId: 'usr_student_1',
        recipientName: 'Tanvir Hossain',
        syllabus,
        progressMap,
      });

      expect(claim.success).toBe(false);
      expect(claim.certificate).toBeUndefined();
      expect(claim.reason).toContain('below the 80% threshold');
    });

    it('issues valid certificate when completion is >= 80%', () => {
      // 4 of 5 completed = 80%
      const progressMap: Record<string, LessonProgress> = {
        les_primes_divisibility: { lessonId: 'les_primes_divisibility', watchedSeconds: 1200, totalSeconds: 1200, completed: true, bookmarked: false },
        les_remainders: { lessonId: 'les_remainders', watchedSeconds: 980, totalSeconds: 980, completed: true, bookmarked: false },
        les_quadratics: { lessonId: 'les_quadratics', watchedSeconds: 1400, totalSeconds: 1400, completed: true, bookmarked: false },
        les_coordinate_geo: { lessonId: 'les_coordinate_geo', watchedSeconds: 1100, totalSeconds: 1100, completed: true, bookmarked: false },
      };

      const mastery = calculateCourseMastery(syllabus, progressMap);
      expect(mastery.masteryPercentage).toBe(80);
      expect(mastery.isEligibleForCertificate).toBe(true);

      const claim = claimCourseCertificate({
        userId: 'usr_student_1',
        recipientName: 'Tanvir Hossain',
        syllabus,
        progressMap,
      });

      expect(claim.success).toBe(true);
      expect(claim.certificate).toBeDefined();
      expect(claim.certificate?.certId).toMatch(/^LUMEN-CERT-[0-9A-F]{8}$/);
      expect(claim.certificate?.status).toBe('valid');
      expect(claim.certificate?.courseSlug).toBe('gre-quant-mastery');
    });
  });
});
