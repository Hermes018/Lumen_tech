import type { CourseRepo } from '../types';
import type { MemoryDataState } from './state';

export class MemoryCourseRepo implements CourseRepo {
  constructor(private state: MemoryDataState) {}

  async findProductBySlug(slug: string): Promise<{ id: string; slug: string; title: string; tier: string } | null> {
    for (const prod of this.state.products.values()) {
      if (prod.slug === slug) {
        return { ...prod };
      }
    }
    return null;
  }

  async listProducts(): Promise<Array<{ id: string; slug: string; title: string; tier: string }>> {
    return Array.from(this.state.products.values()).map((p) => ({ ...p }));
  }
}
