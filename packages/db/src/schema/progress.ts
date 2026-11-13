/** @purpose Drizzle schema for Learner Progress, Activity, and XP tracking */
import { pgTable, text, timestamp, integer, uniqueIndex } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const learnerActivityTable = pgTable(
  'learner_activity',
  {
    id: text('id').primaryKey(),
    userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
    date: text('date').notNull(), // 'YYYY-MM-DD'
    count: integer('count').notNull().default(0),
    minutesSpent: integer('minutes_spent').notNull().default(0),
    activityType: text('activity_type').notNull().default('practice'),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => [
    uniqueIndex('learner_activity_user_date_type_idx').on(table.userId, table.date, table.activityType),
  ]
);

export const learnerXpTable = pgTable('learner_xp', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().unique().references(() => user.id, { onDelete: 'cascade' }),
  totalXp: integer('total_xp').notNull().default(0),
  level: integer('level').notNull().default(1),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});
