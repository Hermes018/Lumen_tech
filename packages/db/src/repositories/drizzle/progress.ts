import { eq } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { learnerActivityTable, learnerXpTable } from '../../schema/progress';
import type { ProgressRepo, ActivityRecord } from '../types';

export class DrizzleProgressRepo implements ProgressRepo {
  constructor(private db: DbClient) {}

  async getActivity(userId: string): Promise<ActivityRecord[]> {
    const rows = await this.db.select().from(learnerActivityTable).where(eq(learnerActivityTable.userId, userId));
    return rows.map((r) => ({
      date: r.date,
      count: r.count,
      minutesSpent: r.minutesSpent,
      type: r.activityType as ActivityRecord['type'],
    }));
  }

  async saveActivity(userId: string, activity: ActivityRecord): Promise<void> {
    const id = `act-${userId}-${activity.date}-${activity.type || 'practice'}`;
    await this.db
      .insert(learnerActivityTable)
      .values({
        id,
        userId,
        date: activity.date,
        count: activity.count,
        minutesSpent: activity.minutesSpent ?? 0,
        activityType: activity.type || 'practice',
      })
      .onConflictDoUpdate({
        target: [learnerActivityTable.userId, learnerActivityTable.date, learnerActivityTable.activityType],
        set: {
          count: activity.count,
          minutesSpent: activity.minutesSpent ?? 0,
          updatedAt: new Date(),
        },
      });
  }

  async getUserXp(userId: string): Promise<number> {
    const rows = await this.db.select().from(learnerXpTable).where(eq(learnerXpTable.userId, userId)).limit(1);
    return rows[0]?.totalXp ?? 0;
  }

  async saveUserXp(userId: string, xp: number): Promise<void> {
    const id = `xp-${userId}`;
    await this.db
      .insert(learnerXpTable)
      .values({
        id,
        userId,
        totalXp: xp,
        level: Math.floor(xp / 1000) + 1,
      })
      .onConflictDoUpdate({
        target: learnerXpTable.userId,
        set: {
          totalXp: xp,
          level: Math.floor(xp / 1000) + 1,
          updatedAt: new Date(),
        },
      });
  }
}
