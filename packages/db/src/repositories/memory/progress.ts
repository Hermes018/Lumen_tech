import type { ProgressRepo, ActivityRecord } from '../types';
import type { MemoryDataState } from './state';

export class MemoryProgressRepo implements ProgressRepo {
  constructor(private state: MemoryDataState) {}

  async getActivity(userId: string): Promise<ActivityRecord[]> {
    const list = this.state.activities.get(userId) || [];
    return list.map((a) => ({ ...a }));
  }

  async saveActivity(userId: string, activity: ActivityRecord): Promise<void> {
    const list = this.state.activities.get(userId) || [];
    const idx = list.findIndex((a) => a.date === activity.date && a.type === activity.type);
    if (idx >= 0) {
      list[idx] = { ...activity };
    } else {
      list.push({ ...activity });
    }
    this.state.activities.set(userId, list);
  }

  async getUserXp(userId: string): Promise<number> {
    return this.state.userXp.get(userId) || 0;
  }

  async saveUserXp(userId: string, xp: number): Promise<void> {
    this.state.userXp.set(userId, xp);
  }
}
