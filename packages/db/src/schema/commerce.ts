/** @purpose Drizzle schema for Commerce domain: Orders, Payments, and Entitlement Credit Ledger */
import { pgTable, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';
import { user } from './auth';

export const orderTable = pgTable('orders', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  providerRef: text('provider_ref').notNull().unique(), // SSLCommerz tran_id <= 30 chars
  productSlug: text('product_slug').notNull(),
  productName: text('product_name').notNull(),
  amountMinor: integer('amount_minor').notNull(),
  currency: text('currency').notNull(), // 'BDT' | 'USD'
  status: text('status').notNull().default('pending'), // 'pending' | 'paid' | 'failed' | 'cancelled' | 'held_review' | 'refunded'
  customerJson: jsonb('customer_json').notNull(),
  providerSessionId: text('provider_session_id'),
  valId: text('val_id'),
  entitlementId: text('entitlement_id'),
  paidAt: timestamp('paid_at', { withTimezone: true }),
  refundedAt: timestamp('refunded_at', { withTimezone: true }),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
});

export const paymentTable = pgTable('payments', {
  id: text('id').primaryKey(),
  orderId: text('order_id').notNull().references(() => orderTable.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull().default('sslcommerz'), // 'sslcommerz' | 'stripe' | 'paddle' | 'manual'
  providerRef: text('provider_ref').notNull().unique(), // tran_id
  valId: text('val_id'),
  amountMinor: integer('amount_minor').notNull(),
  currency: text('currency').notNull(),
  status: text('status').notNull(), // 'VALID' | 'VALIDATED' | 'FAILED' | 'CANCELLED'
  bankTranId: text('bank_tran_id'),
  cardType: text('card_type'),
  rawPayloadJson: jsonb('raw_payload_json'),
  validatedAt: timestamp('validated_at', { withTimezone: true }).notNull().defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});

export const entitlementLedgerTable = pgTable('entitlement_ledger', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => user.id, { onDelete: 'cascade' }),
  kind: text('kind').notNull(), // 'ai_credit' | 'mock_attempt'
  delta: integer('delta').notNull(),
  balanceAfter: integer('balance_after').notNull(),
  reason: text('reason').notNull(),
  sourceRef: text('source_ref'),
  idempotencyKey: text('idempotency_key').unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
});
