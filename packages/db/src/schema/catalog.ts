import { pgTable, text, timestamp, boolean, integer, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const product = pgTable('product', {
  id: text('id').primaryKey(),
  slug: text('slug').notNull().unique(),
  title: text('title').notNull(),
  description: text('description'),
  examType: text('exam_type').notNull(), // 'gre' | 'ielts_academic' | 'ielts_gt'
  tier: text('tier').notNull(), // 'free' | 'core' | 'plus' | 'live' | 'mentor'
  isActive: boolean('is_active').notNull().default(true),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const price = pgTable('price', {
  id: text('id').primaryKey(),
  productId: text('product_id').notNull().references(() => product.id, { onDelete: 'cascade' }),
  region: text('region').notNull(), // 'BD' | 'A' | 'B' | 'C'
  currency: text('currency').notNull(), // 'BDT' | 'USD'
  amountMinor: integer('amount_minor').notNull(), // integer money minor unit (e.g., poisha/cents)
  billingInterval: text('billing_interval').notNull().default('one_time'), // 'one_time' | 'monthly' | 'yearly'
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const entitlement = pgTable('entitlement', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  productId: text('product_id').references(() => product.id, { onDelete: 'set null' }),
  source: text('source').notNull(), // 'purchase' | 'manual_grant' | 'promo' | 'subscription'
  startsAt: timestamp('starts_at', { withTimezone: true }).notNull().defaultNow(),
  endsAt: timestamp('ends_at', { withTimezone: true }),
  allowancesJson: jsonb('allowances_json'), // allowances e.g. { full_mocks: 10, ai_evals_monthly: 50 }
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
