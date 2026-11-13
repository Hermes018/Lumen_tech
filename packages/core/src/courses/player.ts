/** @purpose Course & Lesson Player service, syllabus tree resolution, lecture progress engagement tracking, anti-piracy watermarking, and certificate unlocking (docs/00 D3, docs/02 §14, docs/10 §8) */

import { createHash } from 'node:crypto';
import { issueCertificate, type CertificateRecord } from '../certificates/verify';
import { maskEmail, maskPhone } from '../support/masking';

export type LessonNodeType = 'video' | 'quiz' | 'flashcard';

export interface LessonNode {
  id: string;
  type: LessonNodeType;
  title: string;
  order: number;
  durationSeconds?: number;
  refId?: string;
}

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  order: number;
  durationSeconds: number;
  nodes: LessonNode[];
  videoId?: string;
  notes?: string;
  practiceDrillId?: string;
  formulaList?: string[];
  isFreePreview?: boolean;
}

export interface CourseModule {
  id: string;
  slug: string;
  title: string;
  order: number;
  lessons: Lesson[];
}

export interface CourseSyllabus {
  courseId: string;
  slug: string;
  title: string;
  exam: 'gre' | 'ielts_academic' | 'ielts_gt';
  modules: CourseModule[];
}

export interface LessonProgress {
  lessonId: string;
  watchedSeconds: number;
  totalSeconds: number;
  completed: boolean;
  bookmarked: boolean;
  droppedAtSecond?: number;
  lastWatchedAt?: Date;
}

export interface SignedVideoEmbed {
  embedUrl: string;
  token: string;
  expiresAt: Date;
  expiresUnix: number;
  watermark: {
    maskedEmail: string;
    maskedPhone: string;
    sessionFingerprint: string;
    positionSeed: number;
    displayText: string;
  };
}

export interface CourseMasteryResult {
  totalLessons: number;
  completedLessons: number;
  masteryPercentage: number;
  isEligibleForCertificate: boolean;
}



/**
 * Generates Bunny Stream embed SHA256 token (docs/10 §8.4).
 */
export function generateBunnyEmbedToken(
  tokenKey: string,
  videoId: string,
  expiresUnix: number
): string {
  return createHash('sha256')
    .update(`${tokenKey}${videoId}${expiresUnix}`)
    .digest('hex');
}

/**
 * Generates a signed video embed descriptor with dynamic anti-piracy watermark payload (docs/00 D3).
 */
export function createSignedVideoEmbed(
  userId: string,
  email: string,
  phone: string,
  videoId: string,
  options?: {
    ttlSeconds?: number;
    tokenKey?: string;
    libraryId?: string;
    nowUnix?: number;
  }
): SignedVideoEmbed {
  const tokenKey =
    options?.tokenKey ??
    process.env.BUNNY_TOKEN_KEY ??
    (process.env.NODE_ENV === 'production' ? undefined : 'lumen_dev_only_token_key');
  const libraryId =
    options?.libraryId ??
    process.env.BUNNY_STREAM_LIBRARY_ID ??
    (process.env.NODE_ENV === 'production' ? undefined : '329182');

  if (!tokenKey || !libraryId) {
    throw new Error('Bunny Stream signing is not configured (BUNNY_TOKEN_KEY / BUNNY_STREAM_LIBRARY_ID)');
  }

  // Clamp TTL between 10 minutes (600s) and 6 hours (21600s), default 4 hours (14400s) per docs/10 §8.4
  const ttl = Math.min(Math.max(options?.ttlSeconds ?? 14400, 600), 21600);
  const currentUnix = options?.nowUnix ?? Math.floor(Date.now() / 1000);
  const expiresUnix = currentUnix + ttl;

  const token = generateBunnyEmbedToken(tokenKey, videoId, expiresUnix);
  const embedUrl = `https://iframe.mediadelivery.net/embed/${libraryId}/${videoId}?token=${token}&expires=${expiresUnix}&autoplay=false&preload=false`;

  const maskedEmail = maskEmail(email);
  const maskedPhone = maskPhone(phone);

  const sessionRaw = `${userId}:${videoId}:${expiresUnix}`;
  const sessionFingerprint = createHash('sha256').update(sessionRaw).digest('hex').slice(0, 8);

  // Deterministic seed for watermark coordinate initialization
  let seed = 0;
  for (let i = 0; i < sessionRaw.length; i++) {
    seed = (seed * 31 + sessionRaw.charCodeAt(i)) & 0xffffffff;
  }
  const positionSeed = Math.abs(seed) % 100;

  return {
    embedUrl,
    token,
    expiresAt: new Date(expiresUnix * 1000),
    expiresUnix,
    watermark: {
      maskedEmail,
      maskedPhone,
      sessionFingerprint,
      positionSeed,
      displayText: `${maskedEmail} · ${sessionFingerprint.slice(0, 4).toUpperCase()}`,
    },
  };
}

/**
 * Canonical syllabus sample for GRE Quantitative Reasoning.
 */
export const SAMPLE_GRE_QUANT_SYLLABUS: CourseSyllabus = {
  courseId: 'course_gre_quant_mastery',
  slug: 'gre-quant-mastery',
  title: 'GRE Quantitative Reasoning Mastery',
  exam: 'gre',
  modules: [
    {
      id: 'mod_arithmetic',
      slug: 'arithmetic-number-properties',
      title: 'Module 1: Arithmetic & Number Properties',
      order: 1,
      lessons: [
        {
          id: 'les_primes_divisibility',
          slug: 'primes-divisibility',
          title: 'Prime Factorization & Divisibility Traps',
          order: 1,
          durationSeconds: 1200,
          videoId: 'bny_vid_gre_01',
          nodes: [
            { id: 'node_v1', type: 'video', title: 'Concept Lecture', order: 1, durationSeconds: 900 },
            { id: 'node_q1', type: 'quiz', title: 'Checkpoint Quiz', order: 2, refId: 'drill_primes_5' },
            { id: 'node_f1', type: 'flashcard', title: 'Prime Rules Flashcards', order: 3 },
          ],
          notes: 'Key rule: Any integer > 1 has a unique prime factorization. Watch for negatives.',
          formulaList: ['N = p1^a * p2^b', 'Total factors = (a+1)(b+1)'],
          practiceDrillId: 'drill_primes_5',
        },
        {
          id: 'les_remainders',
          slug: 'remainders-modular-arithmetic',
          title: 'Remainders & Modular Patterns',
          order: 2,
          durationSeconds: 980,
          videoId: 'bny_vid_gre_02',
          nodes: [
            { id: 'node_v2', type: 'video', title: 'Remainder Cycling', order: 1, durationSeconds: 780 },
            { id: 'node_q2', type: 'quiz', title: 'Pattern Drill', order: 2, refId: 'drill_rem_10' },
          ],
          notes: 'Dividend = Divisor × Quotient + Remainder (0 <= Remainder < Divisor).',
          formulaList: ['r < d always', 'Units digit pattern repeats every 4 powers'],
          practiceDrillId: 'drill_rem_10',
        },
      ],
    },
    {
      id: 'mod_algebra',
      slug: 'algebra-and-quadratics',
      title: 'Module 2: Algebra, Quadratics & Coordinate Geometry',
      order: 2,
      lessons: [
        {
          id: 'les_quadratics',
          slug: 'quadratics-and-roots',
          title: 'Quadratic Equations & Sign Analysis',
          order: 1,
          durationSeconds: 1400,
          videoId: 'bny_vid_gre_03',
          nodes: [
            { id: 'node_v3', type: 'video', title: 'Factoring & Roots', order: 1, durationSeconds: 1100 },
            { id: 'node_q3', type: 'quiz', title: 'Root Trap Practice', order: 2 },
          ],
          notes: 'Do not divide both sides by variable without checking for zero.',
          formulaList: ['x = (-b ± √(b² - 4ac)) / (2a)', 'x² - y² = (x - y)(x + y)'],
          practiceDrillId: 'drill_quad_8',
        },
        {
          id: 'les_coordinate_geo',
          slug: 'coordinate-geometry',
          title: 'Slopes, Lines & Distances',
          order: 2,
          durationSeconds: 1100,
          videoId: 'bny_vid_gre_04',
          nodes: [
            { id: 'node_v4', type: 'video', title: 'Line Equations', order: 1, durationSeconds: 900 },
            { id: 'node_f2', type: 'flashcard', title: 'Slope Formulas', order: 2 },
          ],
          notes: 'Perpendicular lines have negative reciprocal slopes (m1 * m2 = -1).',
          formulaList: ['m = (y2 - y1) / (x2 - x1)', 'd = √((x2-x1)² + (y2-y1)²)'],
          practiceDrillId: 'drill_coord_6',
        },
        {
          id: 'les_functions',
          slug: 'functions-and-sequences',
          title: 'Symbolic Functions & Sequences',
          order: 3,
          durationSeconds: 1050,
          videoId: 'bny_vid_gre_05',
          nodes: [
            { id: 'node_v5', type: 'video', title: 'Sequence Iterations', order: 1, durationSeconds: 850 },
            { id: 'node_q4', type: 'quiz', title: 'Function Drills', order: 2 },
          ],
          notes: 'Arithmetic sequences: an = a1 + (n - 1)d. Geometric: an = a1 * r^(n-1).',
          formulaList: ['Sum = n/2 * (a1 + an)', 'r = common ratio'],
          practiceDrillId: 'drill_func_7',
        },
      ],
    },
  ],
};

/**
 * Resolves a course syllabus tree structure.
 */
export function resolveSyllabusTree(
  courseSlug: string,
  customSyllabus?: CourseSyllabus
): CourseSyllabus {
  if (customSyllabus && customSyllabus.slug === courseSlug) {
    return customSyllabus;
  }
  if (courseSlug === 'gre-quant-mastery') {
    return SAMPLE_GRE_QUANT_SYLLABUS;
  }
  // Generic fallback syllabus with 5 structured lessons across 2 modules
  return {
    courseId: `course_${courseSlug.replace(/-/g, '_')}`,
    slug: courseSlug,
    title: courseSlug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
    exam: courseSlug.includes('ielts') ? 'ielts_academic' : 'gre',
    modules: [
      {
        id: `mod_${courseSlug}_1`,
        slug: 'fundamentals',
        title: 'Core Fundamentals',
        order: 1,
        lessons: [
          {
            id: `les_${courseSlug}_1`,
            slug: 'introduction-and-diagnostics',
            title: 'Introduction & Foundations',
            order: 1,
            durationSeconds: 900,
            videoId: `vid_${courseSlug}_01`,
            nodes: [{ id: 'n1', type: 'video', title: 'Lecture', order: 1, durationSeconds: 900 }],
            notes: 'Course roadmap and baseline scoring strategy.',
            formulaList: ['Standard strategy notes'],
          },
          {
            id: `les_${courseSlug}_2`,
            slug: 'core-techniques',
            title: 'Core Techniques & Methodologies',
            order: 2,
            durationSeconds: 1200,
            videoId: `vid_${courseSlug}_02`,
            nodes: [{ id: 'n2', type: 'video', title: 'Technique Deep Dive', order: 1, durationSeconds: 1200 }],
            notes: 'High-leverage shortcuts and time management.',
          },
        ],
      },
      {
        id: `mod_${courseSlug}_2`,
        slug: 'advanced-tactics',
        title: 'Advanced Tactics & Traps',
        order: 2,
        lessons: [
          {
            id: `les_${courseSlug}_3`,
            slug: 'advanced-drill-1',
            title: 'Hard Question Breakdown',
            order: 1,
            durationSeconds: 1100,
            videoId: `vid_${courseSlug}_03`,
            nodes: [{ id: 'n3', type: 'video', title: 'Problem Solving', order: 1, durationSeconds: 1100 }],
          },
          {
            id: `les_${courseSlug}_4`,
            slug: 'advanced-drill-2',
            title: 'Common Traps & Timing Tactics',
            order: 2,
            durationSeconds: 950,
            videoId: `vid_${courseSlug}_04`,
            nodes: [{ id: 'n4', type: 'video', title: 'Trap Analysis', order: 1, durationSeconds: 950 }],
          },
          {
            id: `les_${courseSlug}_5`,
            slug: 'capstone-review',
            title: 'Capstone Review & Exam Preparation',
            order: 3,
            durationSeconds: 1300,
            videoId: `vid_${courseSlug}_05`,
            nodes: [{ id: 'n5', type: 'video', title: 'Review', order: 1, durationSeconds: 1300 }],
          },
        ],
      },
    ],
  };
}

/**
 * Finds a lesson in a syllabus along with adjacent navigation links.
 */
export function findLessonInSyllabus(
  syllabus: CourseSyllabus,
  lessonSlug: string
): {
  module: CourseModule;
  lesson: Lesson;
  nextLesson?: { moduleSlug: string; lessonSlug: string; title: string };
  prevLesson?: { moduleSlug: string; lessonSlug: string; title: string };
} | null {
  const flattened: Array<{ module: CourseModule; lesson: Lesson }> = [];
  for (const mod of syllabus.modules) {
    for (const les of mod.lessons) {
      flattened.push({ module: mod, lesson: les });
    }
  }

  const idx = flattened.findIndex((item) => item.lesson.slug === lessonSlug);
  if (idx === -1) return null;

  const current = flattened[idx];
  if (!current) return null;

  const prev = idx > 0 ? flattened[idx - 1] : undefined;
  const next = idx < flattened.length - 1 ? flattened[idx + 1] : undefined;

  return {
    module: current.module,
    lesson: current.lesson,
    prevLesson: prev
      ? {
          moduleSlug: prev.module.slug,
          lessonSlug: prev.lesson.slug,
          title: prev.lesson.title,
        }
      : undefined,
    nextLesson: next
      ? {
          moduleSlug: next.module.slug,
          lessonSlug: next.lesson.slug,
          title: next.lesson.title,
        }
      : undefined,
  };
}

/**
 * Tracks lecture progress and engagement signals per docs/02 §14.
 */
export function trackLectureProgress(
  currentProgress: LessonProgress | undefined,
  update: {
    lessonId: string;
    watchedSeconds: number;
    totalSeconds: number;
    bookmarked?: boolean;
    isDroppingOut?: boolean;
  }
): LessonProgress {
  const totalSeconds = Math.max(update.totalSeconds, 1);
  const clampedWatched = Math.min(Math.max(update.watchedSeconds, 0), totalSeconds);

  // Lesson is considered completed if >= 90% watched (docs/10 §8.6) or already completed
  const isNowCompleted =
    (currentProgress?.completed ?? false) || clampedWatched >= totalSeconds * 0.9;

  const bookmarked =
    update.bookmarked !== undefined
      ? update.bookmarked
      : currentProgress?.bookmarked ?? false;

  let droppedAtSecond = currentProgress?.droppedAtSecond;
  if (update.isDroppingOut && !isNowCompleted) {
    droppedAtSecond = clampedWatched;
  } else if (isNowCompleted) {
    droppedAtSecond = undefined;
  }

  return {
    lessonId: update.lessonId,
    watchedSeconds: Math.max(clampedWatched, currentProgress?.watchedSeconds ?? 0),
    totalSeconds,
    completed: isNowCompleted,
    bookmarked,
    droppedAtSecond,
    lastWatchedAt: new Date(),
  };
}

/**
 * Calculates course mastery percentage across all modules and lessons.
 */
export function calculateCourseMastery(
  syllabus: CourseSyllabus,
  progressMap: Record<string, LessonProgress>
): CourseMasteryResult {
  let totalLessons = 0;
  let completedLessons = 0;

  for (const mod of syllabus.modules) {
    for (const lesson of mod.lessons) {
      totalLessons += 1;
      const prog = progressMap[lesson.id];
      if (prog && prog.completed) {
        completedLessons += 1;
      }
    }
  }

  const masteryPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const isEligibleForCertificate = masteryPercentage >= 80;

  return {
    totalLessons,
    completedLessons,
    masteryPercentage,
    isEligibleForCertificate,
  };
}

/**
 * Claims course completion certificate if mastery percentage is >= 80% (docs/02 §14, docs/17 §11).
 */
export function claimCourseCertificate(params: {
  userId: string;
  recipientName: string;
  syllabus: CourseSyllabus;
  progressMap: Record<string, LessonProgress>;
  issueDate?: Date;
}): {
  success: boolean;
  certificate?: CertificateRecord;
  reason?: string;
  mastery: CourseMasteryResult;
} {
  const { userId, recipientName, syllabus, progressMap, issueDate = new Date() } = params;
  const mastery = calculateCourseMastery(syllabus, progressMap);

  if (!mastery.isEligibleForCertificate) {
    return {
      success: false,
      reason: `Course completion is at ${mastery.masteryPercentage}%, which is below the 80% threshold required for certification.`,
      mastery,
    };
  }

  const certificate = issueCertificate({
    userId,
    recipientName,
    courseSlug: syllabus.slug,
    courseName: syllabus.title,
    exam: syllabus.exam,
    issueDate,
  });

  return {
    success: true,
    certificate,
    mastery,
  };
}
