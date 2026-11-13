/**
 * @purpose Canonical Aggregate Repository and UnitOfWork contracts (P1-33)
 */

export interface OrderRecord {
  id: string;
  userId: string;
  providerRef: string; // Unique transaction id (tran_id) <= 30 chars
  productSlug: string;
  productName: string;
  amountMinor: number;
  currency: string; // 'BDT' | 'USD'
  status: 'pending' | 'paid' | 'failed' | 'cancelled' | 'held_review' | 'refunded' | 'pending_verification';
  customer: {
    name: string;
    email: string;
    phone: string;
    city?: string;
    country?: string;
  };
  providerSessionId?: string;
  valId?: string;
  entitlementId?: string;
  paidAt?: string;
  refundedAt?: string;
  manualPayment?: {
    method: 'bkash' | 'nagad';
    trxId: string;
    senderNumber: string;
    submittedAt: string;
    approvedByStaffId?: string;
    approvedAt?: string;
    rejectedByStaffId?: string;
    rejectedAt?: string;
    rejectionReason?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface PaymentRecord {
  id: string;
  orderId: string;
  provider: 'sslcommerz' | 'stripe' | 'paddle' | 'manual';
  providerRef: string; // tran_id
  valId?: string;
  amountMinor: number;
  currency: string;
  status: 'VALID' | 'VALIDATED' | 'FAILED' | 'CANCELLED';
  bankTranId?: string;
  cardType?: string;
  rawPayload?: Record<string, unknown>;
  validatedAt: string;
  createdAt: string;
}

export interface EntitlementRecord {
  id: string;
  userId: string;
  productId: string;
  productSlug: string;
  productName: string;
  tier: 'free' | 'core' | 'pass' | 'plus' | 'live' | 'mentor';
  source: 'purchase' | 'manual_grant' | 'trial' | 'refund';
  orderId?: string;
  idempotencyKey?: string;
  amountPaidMinor?: number;
  currency?: string;
  startsAt: string;
  endsAt: string | null;
  allowancesJson: Record<string, unknown>;
  isActive: boolean;
  revokedAt?: string;
  revokeReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreditLedgerEntry {
  id: string;
  userId: string;
  kind: 'ai_credit' | 'mock_attempt';
  delta: number;
  balanceAfter: number;
  reason: string;
  sourceRef?: string;
  idempotencyKey?: string;
  createdAt: string;
}

export interface GraderDimensions {
  position_insight: number;
  support_reasoning: number;
  organization_focus: number;
  language_use: number;
}

export interface GraderQueueItem {
  id: string;
  submissionId: string;
  examAttemptId: string;
  learnerId: string;
  promptMd: string;
  essayText: string;
  wordCount: number;
  submittedAt: string;
  status: 'queued' | 'in_review' | 'graded';
  assignedGraderId?: string;
  aiEvaluation: {
    score: number;
    dimensions: GraderDimensions;
    feedback: string;
  };
  humanEvaluation?: {
    score: number;
    dimensions: GraderDimensions;
    rationale: string;
    graderId: string;
    gradedAt: string;
    withinHalfPoint: boolean;
    delta: number;
  };
}

export interface AuditLogEntry {
  id: string;
  actorId: string;
  action: string;
  targetType: string;
  targetId: string;
  reason: string;
  metadataJson: Record<string, unknown>;
  createdAt: string;
}

export interface QuestionRecord {
  id: string;
  examType: string;
  defaultTopicId?: string;
  topicSlug: string;
  section: string;
  authorId: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  liveVersionId: string;
  createdAt: string;
  updatedAt: string;
  publishedAt?: string;
  retiredAt?: string;
  retireReason?: string;
}

export interface QuestionVersionRecord {
  id: string;
  questionId: string;
  versionNumber: number;
  questionType: string;
  promptMd: string;
  passageMd?: string;
  optionsJson?: unknown;
  correctAnswersJson: unknown;
  hintsJson?: unknown[];
  choiceExplanationsJson?: Record<string, unknown>;
  stepsJson?: unknown[];
  verbalDeconstructorJson?: unknown;
  videoExplanationUrl?: string;
  writtenExplanationMd: string;
  createdAt: string;
}

export interface QuestionDetailRecord extends QuestionRecord {
  liveVersion: QuestionVersionRecord;
  versions: QuestionVersionRecord[];
}

export interface QuestionListItem {
  id: string;
  examType: string;
  section: string;
  topicSlug: string;
  questionType: string;
  promptSnippet: string;
  status: 'draft' | 'review' | 'published' | 'archived';
  versionNumber: number;
  authorId: string;
  updatedAt: string;
  stats?: {
    pValue: number;
    pointBiserial: number;
    attempts: number;
    flags: string[];
  };
}

export interface QuestionStatRecord {
  id: string;
  questionId: string;
  difficultyB: number;
  discriminationA: number;
  guessingC?: number;
  exposureCount: number;
  correctCount: number;
  averageTimeMs: number;
  updatedAt: string;
}

export interface MistakeEntry {
  id: string;
  userId: string;
  questionId: string;
  sourceAttemptId?: string;
  sourceSessionId?: string;
  subject: 'quant' | 'verbal';
  topicSlug: string;
  questionPrompt: string;
  options?: Array<{ id: string; text: string }>;
  selectedWrongAnswer: string;
  correctAnswers: string[];
  explanationMd?: string;
  errorCategory: string;
  notes?: string;
  status: 'open' | 'resolved';
  attemptsCount: number;
  lastAttemptAt: string;
  resolvedAt?: string;
  isMistakeRetry: true;
  excludeFromIrt: true;
  createdAt: string;
  updatedAt: string;
}

export interface ActivityRecord {
  date: string; // YYYY-MM-DD
  count: number;
  minutesSpent?: number;
  type?: 'practice' | 'mock' | 'vocab' | 'mistake' | 'lesson';
}

export interface PriceRecord {
  id: string;
  productId: string;
  region: string;
  currency: string;
  amountMinor: number;
  billingInterval: string;
}

export interface PriceHistoryRecord {
  id: string;
  priceId: string;
  amountMinor: number;
  currency: string;
  effectiveFrom: string;
  effectiveTo?: string;
}

export interface VocabCardRecord {
  id: string;
  userId: string;
  wordId: string;
  state: 'new' | 'learning' | 'review' | 'relearning';
  stability: number;
  difficulty: number;
  elapsedDays: number;
  scheduledDays: number;
  reps: number;
  lapses: number;
  due: string;
  lastReview?: string;
}

// Repositories Interfaces

export interface OrderRepo {
  findById(id: string): Promise<OrderRecord | null>;
  findByProviderRef(providerRef: string): Promise<OrderRecord | null>;
  save(order: OrderRecord): Promise<OrderRecord>;
  update(id: string, updates: Partial<OrderRecord>): Promise<OrderRecord>;
  listByUser(userId: string): Promise<OrderRecord[]>;
}

export interface PaymentRepo {
  findById(id: string): Promise<PaymentRecord | null>;
  findByProviderRef(providerRef: string): Promise<PaymentRecord | null>;
  save(payment: PaymentRecord): Promise<PaymentRecord>;
  update(id: string, updates: Partial<PaymentRecord>): Promise<PaymentRecord>;
}

export interface EntitlementRepo {
  findById(id: string): Promise<EntitlementRecord | null>;
  findByIdempotencyKey(key: string): Promise<EntitlementRecord | null>;
  findByUserId(userId: string): Promise<EntitlementRecord[]>;
  save(entitlement: EntitlementRecord): Promise<EntitlementRecord>;
  update(id: string, updates: Partial<EntitlementRecord>): Promise<EntitlementRecord>;
}

export interface LedgerRepo {
  save(entry: CreditLedgerEntry): Promise<CreditLedgerEntry>;
  findByIdempotencyKey(key: string): Promise<CreditLedgerEntry | null>;
  listByUser(userId: string, kind?: 'ai_credit' | 'mock_attempt'): Promise<CreditLedgerEntry[]>;
  getBalance(userId: string, kind: 'ai_credit' | 'mock_attempt'): Promise<number>;
}

export interface GradingRepo {
  findQueueItemById(id: string): Promise<GraderQueueItem | null>;
  listQueue(status?: 'queued' | 'in_review' | 'graded'): Promise<GraderQueueItem[]>;
  saveQueueItem(item: GraderQueueItem): Promise<GraderQueueItem>;
  saveAuditEvent(event: AuditLogEntry): Promise<AuditLogEntry>;
  listAuditLogs(targetId?: string): Promise<AuditLogEntry[]>;
}

export interface CourseRepo {
  findProductBySlug(slug: string): Promise<{ id: string; slug: string; title: string; tier: string } | null>;
  listProducts(): Promise<Array<{ id: string; slug: string; title: string; tier: string }>>;
}

export interface QuestionRepo {
  findQuestionById(id: string): Promise<QuestionRecord | null>;
  findQuestionDetail(id: string): Promise<QuestionDetailRecord | null>;
  listQuestions(filters?: { examType?: string; status?: string; topicSlug?: string }): Promise<QuestionListItem[]>;
  saveQuestion(question: QuestionRecord, version?: QuestionVersionRecord): Promise<QuestionRecord>;
  findVersionById(versionId: string): Promise<QuestionVersionRecord | null>;
  listVersions(questionId: string): Promise<QuestionVersionRecord[]>;
}

export interface ProgressRepo {
  getActivity(userId: string): Promise<ActivityRecord[]>;
  saveActivity(userId: string, activity: ActivityRecord): Promise<void>;
  getUserXp(userId: string): Promise<number>;
  saveUserXp(userId: string, xp: number): Promise<void>;
}

export interface QuestionStatRepo {
  findByQuestionId(questionId: string): Promise<QuestionStatRecord | null>;
  save(stat: QuestionStatRecord): Promise<QuestionStatRecord>;
  update(questionId: string, updates: Partial<QuestionStatRecord>): Promise<QuestionStatRecord>;
}

export interface MistakeRepo {
  getEntries(userId: string): Promise<MistakeEntry[]>;
  findEntry(userId: string, questionId: string): Promise<MistakeEntry | null>;
  saveEntry(userId: string, entry: MistakeEntry): Promise<MistakeEntry>;
}

export interface PriceRepo {
  findPrice(productId: string, region: string): Promise<PriceRecord | null>;
  listPrices(productId: string): Promise<PriceRecord[]>;
  getPriceHistory(priceId: string, days?: number): Promise<PriceHistoryRecord[]>;
}

export interface VocabCardRepo {
  findByUserAndWord(userId: string, wordId: string): Promise<VocabCardRecord | null>;
  listDueCards(userId: string, asOfDate: Date): Promise<VocabCardRecord[]>;
  saveCard(card: VocabCardRecord): Promise<VocabCardRecord>;
}

export interface AttemptRecord {
  id: string;
  userId: string;
  examType: string;
  status: string;
  startedAt: string;
  completedAt?: string;
  totalScore?: number;
  sectionScoresJson?: Record<string, unknown>;
  data?: Record<string, unknown>;
  report?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttemptRepo {
  findById(id: string): Promise<AttemptRecord | null>;
  save(attempt: AttemptRecord): Promise<AttemptRecord>;
  listByUser(userId: string): Promise<AttemptRecord[]>;
}

export interface Repositories {
  orders: OrderRepo;
  payments: PaymentRepo;
  entitlements: EntitlementRepo;
  ledger: LedgerRepo;
  grading: GradingRepo;
  courses: CourseRepo;
  questions: QuestionRepo;
  progress: ProgressRepo;
  questionStats: QuestionStatRepo;
  mistakes: MistakeRepo;
  prices: PriceRepo;
  vocabCards: VocabCardRepo;
  attempts: AttemptRepo;
  unitOfWork: UnitOfWork;
}

export interface UnitOfWork {
  transaction<T>(fn: (repos: Repositories) => Promise<T>): Promise<T>;
}
