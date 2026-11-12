/**
 * @purpose Grounded Socratic AI Tutor service for GRE practice with tier quotas, PII redaction, and spoiler guards.
 * Conforms to docs/00-DECISIONS.md D4, docs/17-PRICING-MASTER.md §2.2, and docs/34-AI-LEARNING-FEATURES.md §2.
 */

import { z } from '@lumen/config';

export type UserSubscriptionTier = 'free' | 'core' | 'pass' | 'plus' | 'live' | 'mentor';

/** Daily message limits per docs/17 §2.2 */
export const TIER_DAILY_LIMITS: Record<UserSubscriptionTier, number> = {
  free: 10,
  core: 30,
  pass: 30,
  plus: 150,
  live: 150,
  mentor: 150,
};

export const TutorCitationSchema = z.object({
  id: z.string(),
  label: z.string(),
  excerpt: z.string(),
  deepLink: z.string().optional(),
});

export type TutorCitation = z.infer<typeof TutorCitationSchema>;

export const TutorQuerySchema = z.object({
  userMessage: z.string().min(1).max(1500),
  mode: z.enum(['socratic_hint', 'explain', 'check_reasoning', 'vocab', 'general']).default('socratic_hint'),
  isItemActive: z.boolean().default(true), // true while unanswered/in-progress; false once submitted
  tier: z.enum(['free', 'core', 'pass', 'plus', 'live', 'mentor']).default('free'),
  currentDailyCount: z.number().int().min(0).default(0),
  locale: z.enum(['en', 'bn']).default('en'),
  questionContext: z.object({
    id: z.string(),
    promptMd: z.string(),
    questionType: z.string(),
    topicSlug: z.string(),
    options: z.array(z.object({ id: z.string(), text: z.string() })).optional(),
    correctAnswers: z.array(z.string()).optional(),
    userSelectedAnswer: z.string().optional(),
    revealedHintTiers: z.array(z.number()).optional(),
    hints: z.array(z.object({ tier: z.number(), label: z.string(), content: z.string() })).optional(),
    writtenExplanationMd: z.string().optional(),
    steps: z.array(z.object({ stepNumber: z.number(), prompt: z.string(), takeaway: z.string() })).optional(),
    trapDiagnostics: z.record(z.string(), z.object({ trapTag: z.string(), explanation: z.string() })).optional(),
  }),
});

export type TutorQuery = z.infer<typeof TutorQuerySchema>;

export interface TutorResponse {
  success: boolean;
  text: string;
  mode: 'socratic_hint' | 'explain' | 'check_reasoning' | 'vocab' | 'general';
  citations: TutorCitation[];
  suggestedFollowUps: string[];
  remainingQuota: number;
  dailyLimit: number;
  isSpoiled: boolean;
  redactedPiiCount: number;
  error?: string;
}

/** PII redaction patterns for privacy safety */
const EMAIL_REGEX = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/gi;
const CREDIT_CARD_REGEX = /\b(?:\d[ -]*?){13,16}\b/g;
const BANGLADESH_PHONE_REGEX = /(?:\+880|880|01)[13-9]\d{8}/g;
const INTL_PHONE_REGEX = /(?:\+\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}\b/g;

export function redactTutorPii(text: string): { cleanText: string; count: number } {
  let count = 0;

  let clean = text.replace(EMAIL_REGEX, () => {
    count++;
    return '[REDACTED_EMAIL]';
  });

  clean = clean.replace(CREDIT_CARD_REGEX, () => {
    count++;
    return '[REDACTED_CARD]';
  });

  clean = clean.replace(BANGLADESH_PHONE_REGEX, () => {
    count++;
    return '[REDACTED_PHONE]';
  });

  clean = clean.replace(INTL_PHONE_REGEX, () => {
    count++;
    return '[REDACTED_PHONE]';
  });

  return { cleanText: clean, count };
}

/**
 * Validates whether the given output contains any direct answer spoiler for active questions.
 */
export function containsDirectSpoiler(
  text: string,
  correctAnswers?: string[]
): boolean {
  if (!correctAnswers || correctAnswers.length === 0) return false;

  const lowerText = text.toLowerCase();

  for (const ans of correctAnswers) {
    const trimmed = ans.trim().toLowerCase();
    if (!trimmed) continue;

    // Check direct patterns like "correct answer is B", "choose (B)", "answer is 16"
    const spoilerPatterns = [
      new RegExp(`correct\\s+(?:answer|choice|option|is)\\s+[:is]*\\s*[([]?${trimmed}[)\\]]?\\b`, 'i'),
      new RegExp(`choose\\s+[([]?${trimmed}[)\\]]?\\b`, 'i'),
      new RegExp(`answer\\s+is\\s+[([]?${trimmed}[)\\]]?\\b`, 'i'),
      new RegExp(`pick\\s+[([]?${trimmed}[)\\]]?\\b`, 'i'),
    ];

    if (spoilerPatterns.some((pattern) => pattern.test(lowerText))) {
      return true;
    }
  }

  return false;
}

/**
 * Grounded Socratic Tutor Adapter
 */
export function generateTutorResponse(rawInput: TutorQuery): TutorResponse {
  // 1. Zod parse & validate
  const query = TutorQuerySchema.parse(rawInput);

  // 2. Daily Quota Check
  const dailyLimit = TIER_DAILY_LIMITS[query.tier] ?? 10;
  const remainingQuota = Math.max(0, dailyLimit - query.currentDailyCount);

  if (remainingQuota <= 0) {
    return {
      success: false,
      text:
        query.locale === 'bn'
          ? `আজকের জন্য আপনার AI টিউটর বার্তা কোটা শেষ (${dailyLimit}/${dailyLimit} ব্যবহৃত)। পরবর্তী কোটা পেতে কাল আবার চেষ্টা করুন অথবা প্লাস সাবস্ক্রিপশনে আপগ্রেড করুন।`
          : `You have reached your daily AI Tutor message limit (${dailyLimit}/${dailyLimit} used). Upgrade to Plus or return tomorrow for a refreshed quota.`,
      mode: query.mode,
      citations: [],
      suggestedFollowUps: [],
      remainingQuota: 0,
      dailyLimit,
      isSpoiled: false,
      redactedPiiCount: 0,
      error: 'daily_quota_exceeded',
    };
  }

  // 3. PII Redaction
  const { cleanText: sanitizedUserMessage, count: piiCount } = redactTutorPii(query.userMessage);

  // 4. Grounding & Citations builder
  const citations: TutorCitation[] = [];
  const qContext = query.questionContext;

  if (qContext.hints && qContext.hints.length > 0) {
    const nextUnrevealedHint = qContext.hints.find(
      (h) => !qContext.revealedHintTiers?.includes(h.tier)
    );
    if (nextUnrevealedHint) {
      citations.push({
        id: `hint-t${nextUnrevealedHint.tier}`,
        label: `Hint Tier ${nextUnrevealedHint.tier}: ${nextUnrevealedHint.label}`,
        excerpt: nextUnrevealedHint.content.slice(0, 80) + '...',
      });
    }
  }

  if (qContext.steps && qContext.steps.length > 0) {
    const firstStep = qContext.steps[0];
    if (firstStep) {
      citations.push({
        id: `socratic-s${firstStep.stepNumber}`,
        label: `Step ${firstStep.stepNumber}: Conceptual Setup`,
        excerpt: firstStep.takeaway.slice(0, 80) + '...',
      });
    }
  }

  // 5. Generate Grounded Socratic Response
  let responseText = '';
  let responseMode = query.mode;
  let followUps: string[] = [];

  if (query.isItemActive) {
    // ACTIVE QUESTION: Strict Socratic Mode. Do NOT reveal answer choice or final numeric key.
    const hintLevel = (qContext.revealedHintTiers?.length ?? 0) + 1;
    const currentHint = qContext.hints?.find((h) => h.tier === hintLevel);

    if (query.mode === 'socratic_hint' || query.userMessage.toLowerCase().includes('hint') || query.userMessage.toLowerCase().includes('help')) {
      responseMode = 'socratic_hint';
      if (currentHint) {
        responseText =
          query.locale === 'bn'
            ? `চলুন ধাপে ধাপে চিন্তা করি। [ইঙ্গিত স্তর ${currentHint.tier}: ${currentHint.label}] ${currentHint.content}\n\nএই তথ্যের ওপর ভিত্তি করে সমীকরণ বা প্যাটার্নটি কীভাবে সাজাবেন?`
            : `Let's break this down Socratically. [Hint Tier ${currentHint.tier}: ${currentHint.label}] ${currentHint.content}\n\nWhat relationship or constraint do you observe based on this clue?`;
      } else {
        responseText =
          query.locale === 'bn'
            ? `প্রশ্নের মূল শর্তগুলো লক্ষ্য করুন: "${qContext.promptMd.slice(0, 60)}..."। অপশনগুলোর মধ্যে কোনটি অযৌক্তিক বা সীমা লঙ্ঘন করে বাদ দেওয়া যায়?`
            : `Notice the foundational constraints in the prompt: "${qContext.promptMd.slice(0, 60)}...". What initial elimination can you make before calculating?`;
      }

      followUps = [
        query.locale === 'bn' ? 'পরবর্তী ইঙ্গিত দিন' : 'Give me the next hint',
        query.locale === 'bn' ? 'আমার যুক্তি পরীক্ষা করুন' : 'Check my reasoning',
      ];
    } else {
      // Learner is asking a custom question or testing their reasoning while active
      responseMode = 'check_reasoning';
      responseText =
        query.locale === 'bn'
          ? `আপনার চিন্তা লক্ষ্য করেছি: "${sanitizedUserMessage.slice(0, 70)}..."।\n\nসঠিক উত্তরের দিকে এগিয়ে যাওয়ার জন্য লক্ষ্য করুন যে ${qContext.topicSlug} সংক্রান্ত প্রশ্নে প্রায়শই চরম মান (extreme values) বা বিপরীত চিহ্ন বিবেচনা করতে হয়। আপনি কি সব সম্ভাব্য মান যাচাই করেছেন?`
          : `I see your line of reasoning: "${sanitizedUserMessage.slice(0, 70)}..."\n\nTo bridge toward the solution without spoiling the test, remember that questions in ${qContext.topicSlug} require checking algebraic edge cases (e.g. negative roots or bounds). Have you evaluated all cases?`;

      followUps = [
        query.locale === 'bn' ? 'ক্যালকুলেশন পদ্ধতি আরেকবার ব্যাখ্যা করুন' : 'Explain the algebraic setup',
        query.locale === 'bn' ? 'ইঙ্গিত দেখান' : 'Show me a hint',
      ];
    }

    // Double check spoiler safety invariant
    if (containsDirectSpoiler(responseText, qContext.correctAnswers)) {
      // Fallback safe Socratic prompt
      responseText =
        query.locale === 'bn'
          ? 'এই প্রশ্নটির সমাধান বের করতে প্রশ্নের প্রদত্ত শর্তাবলি ও পরিবর্তনশীল মানগুলো পুনর্নিরীক্ষণ করুন।'
          : 'To work through this question independently, identify the primary condition given in the prompt and test each constraint.';
    }
  } else {
    // SUBMITTED QUESTION: Full Diagnostic & Walkthrough Explanations Allowed
    const userSelected = qContext.userSelectedAnswer;
    const isCorrect = userSelected && qContext.correctAnswers?.includes(userSelected);

    if (userSelected && qContext.trapDiagnostics && qContext.trapDiagnostics[userSelected]) {
      const trap = qContext.trapDiagnostics[userSelected];
      responseText =
        query.locale === 'bn'
          ? `আপনি "${userSelected}" নির্বাচন করেছিলেন। এটি একটি পরিচিত ট্র্যাপ: [${trap.trapTag}]।\n\n${trap.explanation}\n\nপূর্ণ ব্যাখ্যা: ${qContext.writtenExplanationMd ?? 'সম্পূর্ণ সমাধান ড্যাশবোর্ডে সংরক্ষিত।'}`
          : `You selected "${userSelected}". This corresponds to the [${trap.trapTag}] trap archetype.\n\n${trap.explanation}\n\nFull Solution: ${qContext.writtenExplanationMd ?? 'See detailed derivation in the review tab.'}`;
    } else if (isCorrect) {
      responseText =
        query.locale === 'bn'
          ? `চমৎকার! আপনার উত্তরটি সঠিক।\n\nমূল কৌশল: ${qContext.writtenExplanationMd ?? 'সঠিক যুক্তি প্রয়োগ করা হয়েছে।'}`
          : `Excellent work! Your answer is correct.\n\nKey Takeaway: ${qContext.writtenExplanationMd ?? 'Well reasoned according to the canonical strategy.'}`;
    } else {
      responseText =
        query.locale === 'bn'
          ? `এই প্রশ্নটির সঠিক উত্তর ছিল: ${qContext.correctAnswers?.join(', ') ?? 'দেওয়া হয়নি'}।\n\nব্যাখ্যা: ${qContext.writtenExplanationMd ?? 'বিশদ পর্যালোচনা দেখুন।'}`
          : `The correct answer is ${qContext.correctAnswers?.join(', ') ?? 'N/A'}.\n\nWritten derivation: ${qContext.writtenExplanationMd ?? 'Refer to the comprehensive solution steps.'}`;
    }

    if (qContext.writtenExplanationMd) {
      citations.push({
        id: 'written-explanation',
        label: 'Official Written Solution',
        excerpt: qContext.writtenExplanationMd.slice(0, 90) + '...',
      });
    }

    followUps = [
      query.locale === 'bn' ? 'এই ধরনের আরও প্রশ্ন অনুশীলন করুন' : 'Practice similar items',
      query.locale === 'bn' ? 'ভুল নোটবুকে সংরক্ষণ করুন' : 'Add to Mistake Notebook',
    ];
  }

  const isSpoiled = containsDirectSpoiler(responseText, qContext.correctAnswers);

  return {
    success: true,
    text: responseText,
    mode: responseMode,
    citations,
    suggestedFollowUps: followUps,
    remainingQuota: remainingQuota - 1,
    dailyLimit,
    isSpoiled,
    redactedPiiCount: piiCount,
  };
}
