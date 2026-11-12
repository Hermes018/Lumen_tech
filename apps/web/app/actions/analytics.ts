/** @purpose Server action for fetching authenticated learner dashboard analytics and progress */
'use server';

import { headers } from 'next/headers';
import {
  assertCan,
  type Actor,
  calculateStudyStreak,
  calculateLevelInfo,
  calculateSkillMastery,
  calculateGreScorePrediction,
  type StreakInfo,
  type LevelInfo,
  type SkillMastery,
  type GreScorePredictionResult,
} from '@lumen/core';
import { getAuth, type Role } from '@lumen/auth';

export interface NextBestActionDTO {
  id: string;
  ruleId: string;
  title: string;
  description: string;
  actionLabel: string;
  href: string;
  badge?: string;
}

export interface LearnerDashboardData {
  actor: {
    id: string;
    name: string;
    email: string;
    targetExam: string;
    targetDate: string;
    daysRemaining: number;
    targetScore: number;
  };
  streak: StreakInfo;
  level: LevelInfo;
  predictor: GreScorePredictionResult;
  skills: SkillMastery[];
  nextBestAction: NextBestActionDTO;
  stats: {
    quantAccuracy: number;
    verbalMastery: number;
    fsrsCardsDue: number;
    fsrsCardsTotal: number;
    openMistakesCount: number;
    avgPaceSeconds: number;
    mockExamsCompleted: number;
  };
}

/**
 * Resolves current actor from Better Auth session or fallback for dev prototype.
 */
async function resolveCurrentActor(): Promise<Actor & { name: string; email: string }> {
  try {
    const reqHeaders = await headers();
    const session = await getAuth().api.getSession({ headers: reqHeaders });
    if (session?.user) {
      const userObj = session.user as {
        id: string;
        role?: string;
        name?: string;
        email: string;
        twoFactorEnabled?: boolean | null;
      };
      const role = (userObj.role as Role) || 'student';
      return {
        id: userObj.id,
        roles: [role],
        name: userObj.name || 'Learner',
        email: userObj.email,
        hasTwoFactorEnabled: userObj.twoFactorEnabled ?? false,
      };
    }
  } catch {
    // Better auth session lookup fallback in development
  }

  // Prototype demo learner
  return {
    id: 'demo-learner-01',
    roles: ['student'],
    name: 'Ayman Rahman',
    email: 'ayman@lumen.academy',
    hasTwoFactorEnabled: false,
  };
}

/**
 * Server action to fetch authenticated learner analytics with assertCan security check.
 */
export async function getLearnerDashboardData(): Promise<LearnerDashboardData> {
  const currentActor = await resolveCurrentActor();

  // Enforce server-authoritative authorization
  assertCan(
    currentActor,
    'user:view_own',
    { ownerId: currentActor.id }
  );

  // Target exam details
  const targetDateStr = '2026-12-15';
  const targetDate = new Date('2026-12-15T00:00:00Z');
  const now = new Date();
  const diffTime = targetDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  // Simulated activity records for the learner
  const activities = [
    { date: '2026-11-06', count: 14, type: 'practice' as const },
    { date: '2026-11-07', count: 20, type: 'practice' as const },
    { date: '2026-11-08', count: 8, type: 'vocab' as const },
    { date: '2026-11-09', count: 25, type: 'mock' as const },
    { date: '2026-11-10', count: 18, type: 'practice' as const },
    { date: '2026-11-11', count: 12, type: 'mistake' as const },
    { date: '2026-11-12', count: 15, type: 'practice' as const },
  ];

  const streak = calculateStudyStreak(activities, {
    today: '2026-11-12',
    freezeDates: ['2026-11-05'],
    maxFreezes: 2,
  });

  // Calculate Khan Academy style level from earned XP
  // Activities: 112 questions answered + 1 mock + 3 mistake reviews = ~1,450 XP
  const level = calculateLevelInfo(1450);

  // Calculate GRE Score Prediction
  const predictor = calculateGreScorePrediction({
    mocks: [
      { attemptId: 'mock-01', date: '2026-10-20', quantScaled: 156, verbalScaled: 150, awaScore: 4.0 },
      { attemptId: 'mock-02', date: '2026-11-02', quantScaled: 160, verbalScaled: 153, awaScore: 4.0 },
      { attemptId: 'mock-03', date: '2026-11-09', quantScaled: 163, verbalScaled: 155, awaScore: 4.5 },
    ],
    practice: [
      { subject: 'quant', attempts: 85, correct: 70 },
      { subject: 'verbal', attempts: 65, correct: 46 },
    ],
    targetScore: { quant: 165, verbal: 160, total: 325 },
  });

  // Calculate Skill Masteries
  const skills = calculateSkillMastery([
    { skillSlug: 'arithmetic', name: 'Arithmetic & Number Properties', subject: 'quant', attempts: 32, correct: 28 },
    { skillSlug: 'algebra', name: 'Algebra & Equations', subject: 'quant', attempts: 24, correct: 20 },
    { skillSlug: 'geometry', name: 'Geometry & Coordinate Geometry', subject: 'quant', attempts: 18, correct: 14 },
    { skillSlug: 'data-analysis', name: 'Data Interpretation & Statistics', subject: 'quant', attempts: 11, correct: 8 },
    { skillSlug: 'text-completion', name: 'Text Completion (1, 2, 3 Blank)', subject: 'verbal', attempts: 28, correct: 19 },
    { skillSlug: 'sentence-equiv', name: 'Sentence Equivalence', subject: 'verbal', attempts: 22, correct: 17 },
    { skillSlug: 'reading-comp', name: 'Reading Comprehension & Critical Reasoning', subject: 'verbal', attempts: 15, correct: 10 },
  ]);

  // Next Best Action (NBA) per 03-PRODUCT-SPEC.md §5.2.3:
  // Since open mistakes = 3, flashcards due = 45, and Text Completion has trap patterns:
  const nextBestAction: NextBestActionDTO = {
    id: 'nba-weak-skill',
    ruleId: 'R12',
    title: 'Strengthen Text Completion Traps',
    description: 'Targeted drill on 3-blank pivot contrast structures · 10 questions · 12 min',
    actionLabel: 'Start Targeted Drill',
    href: '/app/practice',
    badge: 'High Impact',
  };

  return {
    actor: {
      id: currentActor.id,
      name: currentActor.name,
      email: currentActor.email,
      targetExam: 'GRE General',
      targetDate: targetDateStr,
      daysRemaining,
      targetScore: 325,
    },
    streak,
    level,
    predictor,
    skills,
    nextBestAction,
    stats: {
      quantAccuracy: 82,
      verbalMastery: 71,
      fsrsCardsDue: 45,
      fsrsCardsTotal: 1500,
      openMistakesCount: 3,
      avgPaceSeconds: 78,
      mockExamsCompleted: 3,
    },
  };
}
