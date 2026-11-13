import { eq } from 'drizzle-orm';
import type { DbClient } from '../../client';
import { product } from '../../schema/catalog';
import type { CourseRepo } from '../types';

export class DrizzleCourseRepo implements CourseRepo {
  constructor(private db: DbClient) {}

  async findProductBySlug(slug: string): Promise<{ id: string; slug: string; title: string; tier: string } | null> {
    const rows = await this.db.select().from(product).where(eq(product.slug, slug)).limit(1);
    const row = rows[0];
    if (!row) return null;
    return {
      id: row.id,
      slug: row.slug,
      title: row.title,
      tier: row.tier,
    };
  }

  async listProducts(): Promise<Array<{ id: string; slug: string; title: string; tier: string }>> {
    const rows = await this.db.select().from(product);
    return rows.map((r) => ({
      id: r.id,
      slug: r.slug,
      title: r.title,
      tier: r.tier,
    }));
  }
}
