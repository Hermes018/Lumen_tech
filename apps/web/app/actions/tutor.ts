/** @purpose Server actions for Grounded Socratic AI Tutor drawer */
'use server';

import { headers } from 'next/headers';
import { getAuth } from '@lumen/auth';
import {
  generateTutorResponse,
  type TutorQuery,
  type TutorResponse,
  type UserSubscriptionTier,
} from '@lumen/ai';

// In-memory daily message counter per user for dev / prototype
const userDailyMessageCounts = new Map<string, { date: string; count: number }>();

function getUserDailyCount(userId: string): number {
  const todayStr = new Date().toISOString().split('T')[0] ?? '';
  const record = userDailyMessageCounts.get(userId);
  if (!record || record.date !== todayStr) {
    return 0;
  }
  return record.count;
}

function incrementUserDailyCount(userId: string): number {
  const todayStr = new Date().toISOString().split('T')[0] ?? '';
  const record = userDailyMessageCounts.get(userId);
  if (!record || record.date !== todayStr) {
    userDailyMessageCounts.set(userId, { date: todayStr, count: 1 });
    return 1;
  }
  record.count += 1;
  return record.count;
}

export async function askTutorAction(
  input: Omit<TutorQuery, 'tier' | 'currentDailyCount'> & {
    preferredTier?: UserSubscriptionTier;
  }
): Promise<TutorResponse> {
  let userId = 'learner-current';
  const tier: UserSubscriptionTier = input.preferredTier ?? 'plus'; // Plus default for interactive practice demo

  try {
    const reqHeaders = await headers();
    const session = await getAuth().api.getSession({ headers: reqHeaders });
    if (session?.user) {
      userId = session.user.id;
    }
  } catch {
    // Session fallback in dev
  }

  const currentDailyCount = getUserDailyCount(userId);

  const response = generateTutorResponse({
    ...input,
    tier,
    currentDailyCount,
  });

  if (response.success) {
    incrementUserDailyCount(userId);
  }

  return response;
}
