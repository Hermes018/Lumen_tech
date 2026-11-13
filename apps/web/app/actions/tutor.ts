/** @purpose Server actions for Grounded Socratic AI Tutor drawer */
'use server';

import { z } from '@lumen/config';
import { requireServerActor, assertCan } from '@lumen/core';
import {
  generateTutorResponse,
  TutorQuerySchema,
  type TutorQuery,
  type TutorResponse,
  type UserSubscriptionTier,
} from '@lumen/ai';

const askTutorSchema = TutorQuerySchema.omit({ tier: true, currentDailyCount: true }).extend({
  preferredTier: z.enum(['free', 'core', 'pass', 'plus', 'live', 'mentor']).optional(),
  userId: z.string().optional(),
});

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
  rawInput: Omit<TutorQuery, 'tier' | 'currentDailyCount'> & {
    preferredTier?: UserSubscriptionTier;
    userId?: string;
  }
): Promise<TutorResponse> {
  const input = askTutorSchema.parse(rawInput);
  const actor = await requireServerActor();

  if (input.userId && input.userId !== actor.id) {
    assertCan(actor, 'user:view_own', { ownerId: input.userId });
  }
  assertCan(actor, 'practice:session', { ownerId: actor.id });

  const userId = actor.id;
  const tier: UserSubscriptionTier = input.preferredTier ?? 'plus';
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
