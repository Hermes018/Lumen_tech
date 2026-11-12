/**
 * @purpose Domain analytics service for study streaks, Khan Academy style XP levels, and GRE score prediction.
 * Follows 00-DECISIONS.md, 03-PRODUCT-SPEC.md §3.10-§3.11, §5.2, and 08-UI-UX-DESIGN-SYSTEM.md §5.1.9.
 */

export interface ActivityRecord {
  date: string; // YYYY-MM-DD
  count: number;
  minutesSpent?: number;
  type?: 'practice' | 'mock' | 'vocab' | 'mistake' | 'lesson';
}

export interface DayStatus {
  date: string;
  status: 'active' | 'missed' | 'frozen' | 'future';
  count: number;
}

export interface StreakInfo {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string | null;
  isActiveToday: boolean;
  freezeCount: number;
  frozenDates: string[];
  calendar30Days: DayStatus[];
}

export interface StreakOptions {
  today?: string; // YYYY-MM-DD (defaults to ISO date today)
  freezeDates?: string[];
  maxFreezes?: number;
}

export interface LevelThreshold {
  level: number;
  title: string;
  requiredXp: number; // Cumulative XP needed to reach this level
}

export const LEVEL_THRESHOLDS: LevelThreshold[] = [
  { level: 1, title: 'Apprentice Scholar', requiredXp: 0 },
  { level: 2, title: 'Dedicated Explorer', requiredXp: 250 },
  { level: 3, title: 'Adept Thinker', requiredXp: 600 },
  { level: 4, title: 'Analytical Strategist', requiredXp: 1100 },
  { level: 5, title: 'Mastery Candidate', requiredXp: 1800 },
  { level: 6, title: 'Distinguished Scholar', requiredXp: 2750 },
  { level: 7, title: 'Senior Scholar', requiredXp: 4000 },
  { level: 8, title: 'Honors Strategist', requiredXp: 5600 },
  { level: 9, title: 'Grand Scholar', requiredXp: 7600 },
  { level: 10, title: 'Lumen Grandmaster', requiredXp: 10000 },
];

export interface LevelInfo {
  totalXp: number;
  level: number;
  title: string;
  currentLevelXp: number; // XP earned within current level
  xpForNextLevel: number; // XP delta needed from start of level to reach next
  progressPct: number; // 0-100 percentage within current level
  nextLevelTitle?: string;
}

export type MasteryStage = 'not_started' | 'familiar' | 'proficient' | 'mastered';

export interface SkillInput {
  skillSlug: string;
  name: string;
  subject: 'quant' | 'verbal';
  attempts: number;
  correct: number;
}

export interface SkillMastery {
  skillSlug: string;
  name: string;
  subject: 'quant' | 'verbal';
  stage: MasteryStage;
  accuracy: number; // 0 - 100
  attemptsCount: number;
  correctCount: number;
  pointsEarned: number;
  pointsMax: number;
}

export interface MockScoreRecord {
  attemptId: string;
  date: string;
  quantRaw?: number;
  quantScaled?: number;
  verbalRaw?: number;
  verbalScaled?: number;
  awaScore?: number;
}

export interface PracticeAccuracyRecord {
  subject: 'quant' | 'verbal';
  attempts: number;
  correct: number;
  avgDifficultyB?: number;
}

export interface ScoreTrendPoint {
  date: string;
  quant: number;
  verbal: number;
  total: number;
  confidence: 'low' | 'medium' | 'high';
}

export interface GreScorePredictionInput {
  mocks?: MockScoreRecord[];
  practice?: PracticeAccuracyRecord[];
  baseline?: {
    quant?: number;
    verbal?: number;
    awa?: number;
  };
  targetScore?: {
    quant?: number;
    verbal?: number;
    total?: number;
  };
}

export interface GreScorePredictionResult {
  estimatedQuant: number; // 130 - 170
  estimatedVerbal: number; // 130 - 170
  estimatedTotal: number; // 260 - 340
  estimatedAwa: number; // 0.0 - 6.0
  confidence: 'low' | 'medium' | 'high';
  trendHistory: ScoreTrendPoint[];
  gap: {
    quantGap: number;
    verbalGap: number;
    totalGap: number;
  };
}

/** Helper: formats a Date to YYYY-MM-DD */
function formatDateKey(d: Date): string {
  const year = d.getUTCFullYear();
  const month = String(d.getUTCMonth() + 1).padStart(2, '0');
  const day = String(d.getUTCDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** Helper: parses YYYY-MM-DD to UTC midnight Date */
function parseDateKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y || 2026, (m || 1) - 1, d || 1));
}

/**
 * Calculates study streak statistics from raw activity records.
 * Supports streak freezes and generates a 30-day timeline for calm engagement visualization.
 */
export function calculateStudyStreak(
  activities: ActivityRecord[],
  options: StreakOptions = {}
): StreakInfo {
  const todayKey = options.today || formatDateKey(new Date());
  const maxFreezes = options.maxFreezes ?? 2;
  const freezeSet = new Set(options.freezeDates || []);

  // Map activities by date string
  const activeDateMap = new Map<string, number>();
  for (const act of activities) {
    if (act.count > 0) {
      activeDateMap.set(act.date, (activeDateMap.get(act.date) || 0) + act.count);
    }
  }

  const todayDate = parseDateKey(todayKey);
  const isActiveToday = (activeDateMap.get(todayKey) ?? 0) > 0;

  // Find all distinct active/frozen dates sorted chronologically
  const activeDates = Array.from(activeDateMap.keys()).sort();
  const lastActiveDate = activeDates.length > 0 ? activeDates[activeDates.length - 1] ?? null : null;

  // Calculate current streak walking backward from today or yesterday
  let currentStreak = 0;
  let usedFreezes = 0;
  const usedFreezeDates: string[] = [];

  // Determine starting anchor: if active today, start at today; else check yesterday
  const cursor = new Date(todayDate.getTime());
  if (!isActiveToday) {
    // If not active today, check if yesterday was active or frozen to maintain streak
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  while (true) {
    const key = formatDateKey(cursor);
    const hasActivity = (activeDateMap.get(key) ?? 0) > 0;
    const isFrozen = freezeSet.has(key);

    if (hasActivity) {
      currentStreak++;
    } else if (isFrozen && usedFreezes < maxFreezes) {
      currentStreak++;
      usedFreezes++;
      usedFreezeDates.push(key);
    } else {
      // Streak breaks
      break;
    }

    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  // Calculate longest streak across history
  let longestStreak = 0;
  if (activeDates.length > 0) {
    let tempStreak = 0;
    let prevDate: Date | null = null;

    // Combine active dates and frozen dates
    const allValidDates = Array.from(new Set([...activeDates, ...options.freezeDates || []])).sort();

    for (const dateKey of allValidDates) {
      const currentDate = parseDateKey(dateKey);
      if (!prevDate) {
        tempStreak = 1;
      } else {
        const diffDays = Math.round((currentDate.getTime() - prevDate.getTime()) / (1000 * 60 * 60 * 24));
        if (diffDays === 1) {
          tempStreak++;
        } else if (diffDays > 1) {
          tempStreak = 1;
        }
      }
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
      prevDate = currentDate;
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  // Generate 30-day calendar (29 days ago up to today)
  const calendar30Days: DayStatus[] = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date(todayDate.getTime());
    d.setUTCDate(d.getUTCDate() - i);
    const key = formatDateKey(d);
    const count = activeDateMap.get(key) || 0;

    let status: 'active' | 'missed' | 'frozen' | 'future' = 'missed';
    if (count > 0) {
      status = 'active';
    } else if (freezeSet.has(key)) {
      status = 'frozen';
    }

    calendar30Days.push({
      date: key,
      status,
      count,
    });
  }

  return {
    currentStreak,
    longestStreak,
    lastActiveDate,
    isActiveToday,
    freezeCount: Math.max(0, maxFreezes - usedFreezes),
    frozenDates: usedFreezeDates,
    calendar30Days,
  };
}

/**
 * Calculates Khan Academy style XP levels and title progression.
 */
export function calculateLevelInfo(totalXp: number): LevelInfo {
  const xp = Math.max(0, totalXp);

  // Check thresholds
  let currentTier = LEVEL_THRESHOLDS[0]!;
  let nextTier = LEVEL_THRESHOLDS[1];

  for (let i = 0; i < LEVEL_THRESHOLDS.length; i++) {
    const tier = LEVEL_THRESHOLDS[i]!;
    const next = LEVEL_THRESHOLDS[i + 1];
    if (xp >= tier.requiredXp) {
      currentTier = tier;
      nextTier = next;
    } else {
      break;
    }
  }

  let currentLevelXp: number;
  let xpForNextLevel: number;
  let progressPct: number;

  if (nextTier) {
    const tierSpan = nextTier.requiredXp - currentTier.requiredXp;
    currentLevelXp = xp - currentTier.requiredXp;
    xpForNextLevel = tierSpan;
    progressPct = Math.min(100, Math.floor((currentLevelXp / tierSpan) * 100));
  } else {
    // Beyond defined tiers: +3000 XP per level
    const extraXp = xp - currentTier.requiredXp;
    const additionalLevels = Math.floor(extraXp / 3000);
    const levelNumber = currentTier.level + additionalLevels;
    const levelBase = currentTier.requiredXp + additionalLevels * 3000;
    currentLevelXp = xp - levelBase;
    xpForNextLevel = 3000;
    progressPct = Math.min(100, Math.floor((currentLevelXp / 3000) * 100));
    return {
      totalXp: xp,
      level: levelNumber,
      title: currentTier.title,
      currentLevelXp,
      xpForNextLevel,
      progressPct,
    };
  }

  return {
    totalXp: xp,
    level: currentTier.level,
    title: currentTier.title,
    currentLevelXp,
    xpForNextLevel,
    progressPct,
    nextLevelTitle: nextTier?.title,
  };
}

/**
 * Categorizes learner skills into Khan Academy style mastery stages:
 * - not_started: < 3 attempts or 0% accuracy
 * - familiar: 30% - 69% accuracy
 * - proficient: 70% - 89% accuracy
 * - mastered: >= 90% accuracy with >= 10 attempts
 */
export function calculateSkillMastery(skills: SkillInput[]): SkillMastery[] {
  return skills.map((s) => {
    const accuracy = s.attempts > 0 ? Math.round((s.correct / s.attempts) * 100) : 0;
    let stage: MasteryStage = 'not_started';

    if (s.attempts >= 10 && accuracy >= 90) {
      stage = 'mastered';
    } else if (s.attempts >= 5 && accuracy >= 70) {
      stage = 'proficient';
    } else if (s.attempts >= 3 && accuracy >= 30) {
      stage = 'familiar';
    } else if (s.attempts > 0 && accuracy > 0) {
      stage = 'familiar';
    } else {
      stage = 'not_started';
    }

    // Points earned out of 100 max per skill
    const pointsMax = 100;
    let pointsEarned = 0;
    if (stage === 'mastered') pointsEarned = 100;
    else if (stage === 'proficient') pointsEarned = 75;
    else if (stage === 'familiar') pointsEarned = 40;
    else pointsEarned = Math.round(accuracy * 0.2);

    return {
      skillSlug: s.skillSlug,
      name: s.name,
      subject: s.subject,
      stage,
      accuracy,
      attemptsCount: s.attempts,
      correctCount: s.correct,
      pointsEarned,
      pointsMax,
    };
  });
}

/**
 * Calculates Estimated GRE Score Predictor with strict 130-170 bounds.
 * Integrates mock exam history, practice accuracy, and diagnostic baseline.
 */
export function calculateGreScorePrediction(
  input: GreScorePredictionInput
): GreScorePredictionResult {
  const mocks = input.mocks || [];
  const practice = input.practice || [];
  const baseline = input.baseline || { quant: 150, verbal: 150, awa: 3.5 };
  const target = input.targetScore || { quant: 165, verbal: 160, total: 325 };

  let rawQuant = baseline.quant ?? 150;
  let rawVerbal = baseline.verbal ?? 150;
  let rawAwa = baseline.awa ?? 3.5;

  let totalPracticeAttempts = 0;
  for (const p of practice) {
    totalPracticeAttempts += p.attempts;
  }

  // Determine confidence
  let confidence: 'low' | 'medium' | 'high' = 'low';
  if (mocks.length >= 2 && totalPracticeAttempts >= 100) {
    confidence = 'high';
  } else if (mocks.length >= 1 || totalPracticeAttempts >= 20) {
    confidence = 'medium';
  }

  // 1. Process mock exam trend
  const trendHistory: ScoreTrendPoint[] = [];
  const sortedMocks = [...mocks].sort((a, b) => a.date.localeCompare(b.date));

  for (const m of sortedMocks) {
    const q = Math.max(130, Math.min(170, Math.round(m.quantScaled ?? 150)));
    const v = Math.max(130, Math.min(170, Math.round(m.verbalScaled ?? 150)));
    trendHistory.push({
      date: m.date,
      quant: q,
      verbal: v,
      total: q + v,
      confidence: trendHistory.length > 1 ? 'high' : 'medium',
    });
  }

  if (sortedMocks.length > 0) {
    // Weighted average of mocks: recent mocks have higher weight
    let weightSum = 0;
    let weightedQ = 0;
    let weightedV = 0;
    let weightedAwa = 0;

    for (let i = 0; i < sortedMocks.length; i++) {
      const m = sortedMocks[i]!;
      const weight = i + 1; // 1, 2, 3...
      weightedQ += (m.quantScaled ?? 150) * weight;
      weightedV += (m.verbalScaled ?? 150) * weight;
      weightedAwa += (m.awaScore ?? 3.5) * weight;
      weightSum += weight;
    }

    rawQuant = weightedQ / weightSum;
    rawVerbal = weightedV / weightSum;
    rawAwa = weightedAwa / weightSum;
  }

  // 2. Adjust using practice question performance (fine-tuning delta)
  const quantPractice = practice.find((p) => p.subject === 'quant');
  if (quantPractice && quantPractice.attempts >= 10) {
    const accuracy = quantPractice.correct / quantPractice.attempts;
    // Accuracy 50% = 0 delta; 90% = +4 points; 20% = -4 points
    const practiceDelta = (accuracy - 0.5) * 8;
    if (sortedMocks.length > 0) {
      rawQuant = rawQuant * 0.75 + (rawQuant + practiceDelta) * 0.25;
    } else {
      rawQuant += practiceDelta;
    }
  }

  const verbalPractice = practice.find((p) => p.subject === 'verbal');
  if (verbalPractice && verbalPractice.attempts >= 10) {
    const accuracy = verbalPractice.correct / verbalPractice.attempts;
    const practiceDelta = (accuracy - 0.5) * 8;
    if (sortedMocks.length > 0) {
      rawVerbal = rawVerbal * 0.75 + (rawVerbal + practiceDelta) * 0.25;
    } else {
      rawVerbal += practiceDelta;
    }
  }

  // 3. Strict bounding and rounding
  const estimatedQuant = Math.max(130, Math.min(170, Math.round(rawQuant)));
  const estimatedVerbal = Math.max(130, Math.min(170, Math.round(rawVerbal)));
  const estimatedTotal = estimatedQuant + estimatedVerbal;
  const estimatedAwa = Math.max(0.0, Math.min(6.0, Math.round(rawAwa * 2) / 2));

  const targetQuant = target.quant ?? 165;
  const targetVerbal = target.verbal ?? 160;
  const targetTotal = target.total ?? targetQuant + targetVerbal;

  return {
    estimatedQuant,
    estimatedVerbal,
    estimatedTotal,
    estimatedAwa,
    confidence,
    trendHistory,
    gap: {
      quantGap: targetQuant - estimatedQuant,
      verbalGap: targetVerbal - estimatedVerbal,
      totalGap: targetTotal - estimatedTotal,
    },
  };
}
