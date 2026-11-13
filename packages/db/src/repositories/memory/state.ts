/**
 * @purpose In-memory data store with state snapshotting, cloning, and rollback for transaction support
 */

import type {
  OrderRecord,
  PaymentRecord,
  EntitlementRecord,
  CreditLedgerEntry,
  GraderQueueItem,
  AuditLogEntry,
  QuestionRecord,
  QuestionVersionRecord,
  QuestionStatRecord,
  MistakeEntry,
  ActivityRecord,
  PriceRecord,
  PriceHistoryRecord,
  VocabCardRecord,
  AttemptRecord,
} from '../types';

export interface MemoryDataState {
  orders: Map<string, OrderRecord>;
  ordersByProviderRef: Map<string, string>;
  payments: Map<string, PaymentRecord>;
  paymentsByProviderRef: Map<string, string>;
  entitlements: Map<string, EntitlementRecord>;
  entitlementsByIdempotencyKey: Map<string, string>;
  ledgerEntries: CreditLedgerEntry[];
  ledgerByIdempotencyKey: Map<string, string>;
  graderQueue: Map<string, GraderQueueItem>;
  auditLogs: AuditLogEntry[];
  products: Map<string, { id: string; slug: string; title: string; tier: string }>;
  questions: Map<string, QuestionRecord>;
  questionVersions: Map<string, QuestionVersionRecord[]>;
  allVersions: Map<string, QuestionVersionRecord>;
  questionStats: Map<string, QuestionStatRecord>;
  activities: Map<string, ActivityRecord[]>;
  userXp: Map<string, number>;
  mistakes: Map<string, Map<string, MistakeEntry>>;
  prices: Map<string, PriceRecord>;
  priceHistory: Map<string, PriceHistoryRecord[]>;
  vocabCards: Map<string, VocabCardRecord>;
  attempts: Map<string, AttemptRecord>;
}

export function createInitialState(): MemoryDataState {
  return {
    orders: new Map(),
    ordersByProviderRef: new Map(),
    payments: new Map(),
    paymentsByProviderRef: new Map(),
    entitlements: new Map(),
    entitlementsByIdempotencyKey: new Map(),
    ledgerEntries: [],
    ledgerByIdempotencyKey: new Map(),
    graderQueue: new Map(),
    auditLogs: [],
    products: new Map(),
    questions: new Map(),
    questionVersions: new Map(),
    allVersions: new Map(),
    questionStats: new Map(),
    activities: new Map(),
    userXp: new Map(),
    mistakes: new Map(),
    prices: new Map(),
    priceHistory: new Map(),
    vocabCards: new Map(),
    attempts: new Map(),
  };
}

export function cloneState(state: MemoryDataState): MemoryDataState {
  const clonedMistakes = new Map<string, Map<string, MistakeEntry>>();
  for (const [k, v] of state.mistakes.entries()) {
    clonedMistakes.set(k, new Map(v));
  }

  const clonedVersions = new Map<string, QuestionVersionRecord[]>();
  for (const [k, v] of state.questionVersions.entries()) {
    clonedVersions.set(k, [...v]);
  }

  const clonedActivities = new Map<string, ActivityRecord[]>();
  for (const [k, v] of state.activities.entries()) {
    clonedActivities.set(k, [...v]);
  }

  const clonedPriceHistory = new Map<string, PriceHistoryRecord[]>();
  for (const [k, v] of state.priceHistory.entries()) {
    clonedPriceHistory.set(k, [...v]);
  }

  return {
    orders: new Map(state.orders),
    ordersByProviderRef: new Map(state.ordersByProviderRef),
    payments: new Map(state.payments),
    paymentsByProviderRef: new Map(state.paymentsByProviderRef),
    entitlements: new Map(state.entitlements),
    entitlementsByIdempotencyKey: new Map(state.entitlementsByIdempotencyKey),
    ledgerEntries: [...state.ledgerEntries],
    ledgerByIdempotencyKey: new Map(state.ledgerByIdempotencyKey),
    graderQueue: new Map(state.graderQueue),
    auditLogs: [...state.auditLogs],
    products: new Map(state.products),
    questions: new Map(state.questions),
    questionVersions: clonedVersions,
    allVersions: new Map(state.allVersions),
    questionStats: new Map(state.questionStats),
    activities: clonedActivities,
    userXp: new Map(state.userXp),
    mistakes: clonedMistakes,
    prices: new Map(state.prices),
    priceHistory: clonedPriceHistory,
    vocabCards: new Map(state.vocabCards),
    attempts: new Map(state.attempts),
  };
}

export function copyState(src: MemoryDataState, dest: MemoryDataState): void {
  dest.orders = new Map(src.orders);
  dest.ordersByProviderRef = new Map(src.ordersByProviderRef);
  dest.payments = new Map(src.payments);
  dest.paymentsByProviderRef = new Map(src.paymentsByProviderRef);
  dest.entitlements = new Map(src.entitlements);
  dest.entitlementsByIdempotencyKey = new Map(src.entitlementsByIdempotencyKey);
  dest.ledgerEntries = [...src.ledgerEntries];
  dest.ledgerByIdempotencyKey = new Map(src.ledgerByIdempotencyKey);
  dest.graderQueue = new Map(src.graderQueue);
  dest.auditLogs = [...src.auditLogs];
  dest.products = new Map(src.products);
  dest.questions = new Map(src.questions);
  dest.questionVersions = new Map();
  for (const [k, v] of src.questionVersions.entries()) {
    dest.questionVersions.set(k, [...v]);
  }
  dest.allVersions = new Map(src.allVersions);
  dest.questionStats = new Map(src.questionStats);
  dest.activities = new Map();
  for (const [k, v] of src.activities.entries()) {
    dest.activities.set(k, [...v]);
  }
  dest.userXp = new Map(src.userXp);
  dest.mistakes = new Map();
  for (const [k, v] of src.mistakes.entries()) {
    dest.mistakes.set(k, new Map(v));
  }
  dest.prices = new Map(src.prices);
  dest.priceHistory = new Map();
  for (const [k, v] of src.priceHistory.entries()) {
    dest.priceHistory.set(k, [...v]);
  }
  dest.vocabCards = new Map(src.vocabCards);
  dest.attempts = new Map(src.attempts);
}
