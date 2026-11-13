/** @purpose Guest GRE Express Diagnostic service with Rasch ability estimation, trap diagnostics, and sign-up results gate (D4, 02 §6) */

import { eapTheta, thetaToScaled, GRE_SCALE, type ScoredItem } from './scoring';

export interface DiagnosticQuestion {
  id: string;
  measure: 'quant' | 'verbal';
  type: 'qc' | 'mcq' | 'numeric' | 'tc' | 'se';
  prompt: string;
  quantityA?: string;
  quantityB?: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string | string[];
  raschB: number; // Rasch difficulty parameter
  trapArchetype: {
    tag: string;
    label: string;
    description: string;
  };
}

export const SEEDED_DIAGNOSTIC_ITEMS: DiagnosticQuestion[] = [
  // 4 Quant Items
  {
    id: 'diag-q-01',
    measure: 'quant',
    type: 'qc',
    prompt: 'Let $x$ be an integer such that $x^2 = 16$.',
    quantityA: '$x$',
    quantityB: '$0$',
    options: [
      { id: 'A', text: 'Quantity A is greater.' },
      { id: 'B', text: 'Quantity B is greater.' },
      { id: 'C', text: 'The two quantities are equal.' },
      { id: 'D', text: 'The relationship cannot be determined from the information given.' },
    ],
    correctAnswer: 'D',
    raschB: 0.1,
    trapArchetype: {
      tag: 'positive_root_bias',
      label: 'Positive Root Bias Trap',
      description: 'Overlooking negative roots when solving quadratics ($x = \\pm 4$).',
    },
  },
  {
    id: 'diag-q-02',
    measure: 'quant',
    type: 'mcq',
    prompt: 'In the xy-plane, what is the distance between the points $(2, 3)$ and $(5, 7)$?',
    options: [
      { id: 'A', text: '4' },
      { id: 'B', text: '5' },
      { id: 'C', text: '7' },
      { id: 'D', text: '25' },
    ],
    correctAnswer: 'B',
    raschB: -0.4,
    trapArchetype: {
      tag: 'pythagorean_triple_oversight',
      label: 'Direct Coordinate Addition Trap',
      description: 'Adding coordinate differences directly without taking square root of sum of squares.',
    },
  },
  {
    id: 'diag-q-03',
    measure: 'quant',
    type: 'qc',
    prompt: 'A set $S$ consists of 5 consecutive odd integers.',
    quantityA: 'The average (arithmetic mean) of set $S$',
    quantityB: 'The median of set $S$',
    options: [
      { id: 'A', text: 'Quantity A is greater.' },
      { id: 'B', text: 'Quantity B is greater.' },
      { id: 'C', text: 'The two quantities are equal.' },
      { id: 'D', text: 'The relationship cannot be determined.' },
    ],
    correctAnswer: 'C',
    raschB: 0.3,
    trapArchetype: {
      tag: 'symmetric_distribution_trap',
      label: 'Symmetric Sequence Trap',
      description: 'Failing to recognise that in evenly spaced sets, mean and median are always identical.',
    },
  },
  {
    id: 'diag-q-04',
    measure: 'quant',
    type: 'mcq',
    prompt: 'Working alone at their constant rates, Machine A fills a tank in 3 hours, and Machine B fills it in 6 hours. How many hours will it take both machines working together?',
    options: [
      { id: 'A', text: '1.5 hours' },
      { id: 'B', text: '2 hours' },
      { id: 'C', text: '4.5 hours' },
      { id: 'D', text: '9 hours' },
    ],
    correctAnswer: 'B',
    raschB: 0.5,
    trapArchetype: {
      tag: 'additive_time_trap',
      label: 'Additive Time Trap',
      description: 'Adding or averaging machine times instead of reciprocating rate work ($1/3 + 1/6 = 1/2$).',
    },
  },

  // 4 Verbal Items
  {
    id: 'diag-v-01',
    measure: 'verbal',
    type: 'tc',
    prompt: 'Although the author’s early hypotheses were initially dismissed as fanciful, subsequent empirical discoveries demonstrated that her theories were remarkably ________.',
    options: [
      { id: 'A', text: 'prescient' },
      { id: 'B', text: 'derivative' },
      { id: 'C', text: 'anachronistic' },
      { id: 'D', text: 'esoteric' },
    ],
    correctAnswer: 'A',
    raschB: 0.2,
    trapArchetype: {
      tag: 'concession_shift_trap',
      label: 'Concession Shift Contrast Trap',
      description: 'Missing the "Although" pivot from negative ("fanciful") to positive ("prescient").',
    },
  },
  {
    id: 'diag-v-02',
    measure: 'verbal',
    type: 'se',
    prompt: 'The diplomat was known for her ________ public statements, refusing to speculate on geopolitical alliances before formal treaty signatures.',
    options: [
      { id: 'A', text: 'circumspect' },
      { id: 'B', text: 'prudent' },
      { id: 'C', text: 'audacious' },
      { id: 'D', text: 'loquacious' },
      { id: 'E', text: 'pugnacious' },
    ],
    correctAnswer: ['A', 'B'],
    raschB: 0.4,
    trapArchetype: {
      tag: 'false_synonym_trap',
      label: 'Extreme / Unrelated Vocabulary Trap',
      description: 'Picking words that sound impressive (like "audacious" or "loquacious") that contradict cautious context.',
    },
  },
  {
    id: 'diag-v-03',
    measure: 'verbal',
    type: 'tc',
    prompt: 'Far from being ________, the council’s new zoning guidelines were surprisingly flexible, accommodating varied architectural aesthetics.',
    options: [
      { id: 'A', text: 'dogmatic' },
      { id: 'B', text: 'benign' },
      { id: 'C', text: 'provisional' },
      { id: 'D', text: 'pellucid' },
    ],
    correctAnswer: 'A',
    raschB: 0.1,
    trapArchetype: {
      tag: 'double_negative_inversion',
      label: 'Far From Inversion Trap',
      description: '"Far from being [X]" means the guidelines are opposite of flexible, thus requiring a word meaning rigid/dogmatic.',
    },
  },
  {
    id: 'diag-v-04',
    measure: 'verbal',
    type: 'mcq',
    prompt: 'Short Passage: While early 20th-century economists presumed resource extraction yields permanent national wealth, the "resource curse" literature argues that volatile commodity export booms systematically crowd out manufacturing innovation. The primary purpose of the passage is to:',
    options: [
      { id: 'A', text: 'Contrast an older economic presumption with a counter-finding.' },
      { id: 'B', text: 'Defend 20th-century extraction policy against modern detractors.' },
      { id: 'C', text: 'Propose a tax regime on mineral commodities.' },
      { id: 'D', text: 'Prove manufacturing is inherently superior to mining.' },
    ],
    correctAnswer: 'A',
    raschB: -0.2,
    trapArchetype: {
      tag: 'scope_expansion_trap',
      label: 'Primary Purpose Scope Expansion',
      description: 'Selecting an option that makes extreme claims ("prove manufacturing is superior") not made in text.',
    },
  },
];

export interface GuestDiagnosticSession {
  guestToken: string;
  startedAt: Date;
  durationSeconds: number; // 900 seconds (15 minutes)
  questions: Array<Omit<DiagnosticQuestion, 'correctAnswer'>>;
}

export interface ItemEvaluation {
  questionId: string;
  measure: 'quant' | 'verbal';
  isCorrect: boolean;
  userAnswer: string | string[];
  correctAnswer: string | string[];
  trapTriggered?: {
    tag: string;
    label: string;
    description: string;
  };
}

export interface DiagnosticAttemptRecord {
  guestToken: string;
  userId?: string;
  claimed: boolean;
  claimedAt?: Date;
  submittedAt: Date;
  scoreSummary: {
    quantRaw: number;
    verbalRaw: number;
    quantScaledRange: [number, number]; // e.g. [155, 163]
    verbalScaledRange: [number, number]; // e.g. [152, 160]
    overallEstimatedRange: [number, number]; // e.g. [307, 323]
    topTrapArchetype: {
      tag: string;
      label: string;
      description: string;
    };
    recommendedTrack: string;
  };
  gated: boolean; // true for guest until claimed with sign-up
  itemByItemBreakdown?: ItemEvaluation[];
  personalizedStudyPlan?: {
    recommendedWeeks: number;
    targetScore: number;
    focusAreas: string[];
  };
}

/**
 * Creates an unauthenticated guest diagnostic session.
 */
export function createGuestDiagnosticSession(guestToken?: string): GuestDiagnosticSession {
  const token = guestToken || `guest_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

  // Strip answers from questions exposed to student runner
  const sanitizedQuestions = SEEDED_DIAGNOSTIC_ITEMS.map((q) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { correctAnswer, ...rest } = q;
    return rest;
  });

  return {
    guestToken: token,
    startedAt: new Date(),
    durationSeconds: 900, // 15 mins
    questions: sanitizedQuestions,
  };
}

/**
 * Submits guest diagnostic responses, computes Rasch estimated bands,
 * identifies top trap archetype, and gates detailed breakdown behind account creation.
 */
export function submitGuestDiagnostic(
  guestToken: string,
  answers: Record<string, string | string[]>
): DiagnosticAttemptRecord {
  let quantRaw = 0;
  let verbalRaw = 0;
  const quantItems: ScoredItem[] = [];
  const verbalItems: ScoredItem[] = [];
  const evaluations: ItemEvaluation[] = [];
  const triggeredTraps: Array<{ tag: string; label: string; description: string }> = [];

  for (const item of SEEDED_DIAGNOSTIC_ITEMS) {
    const userAns = answers[item.id];
    let isCorrect = false;

    if (Array.isArray(item.correctAnswer)) {
      if (Array.isArray(userAns)) {
        isCorrect =
          item.correctAnswer.length === userAns.length &&
          item.correctAnswer.every((ans) => userAns.includes(ans));
      }
    } else {
      isCorrect = userAns === item.correctAnswer;
    }

    if (isCorrect) {
      if (item.measure === 'quant') quantRaw++;
      else verbalRaw++;
    } else {
      triggeredTraps.push(item.trapArchetype);
    }

    const scoredItem: ScoredItem = {
      b: item.raschB,
      correct: isCorrect,
    };

    if (item.measure === 'quant') {
      quantItems.push(scoredItem);
    } else {
      verbalItems.push(scoredItem);
    }

    evaluations.push({
      questionId: item.id,
      measure: item.measure,
      isCorrect,
      userAnswer: userAns ?? '',
      correctAnswer: item.correctAnswer,
      trapTriggered: !isCorrect ? item.trapArchetype : undefined,
    });
  }

  // Rasch 1PL EAP ability estimation
  const quantEst = eapTheta(quantItems);
  const quantScaled = thetaToScaled(quantEst, GRE_SCALE.quant);

  const verbalEst = eapTheta(verbalItems);
  const verbalScaled = thetaToScaled(verbalEst, GRE_SCALE.verbal);

  const quantLow = Math.max(130, quantScaled.low);
  const quantHigh = Math.min(170, quantScaled.high);

  const verbalLow = Math.max(130, verbalScaled.low);
  const verbalHigh = Math.min(170, verbalScaled.high);

  const topTrap = triggeredTraps[0] || {
    tag: 'flawless_execution',
    label: 'High Precision / Low Distractor Sensitivity',
    description: 'You bypassed all engineered cognitive traps in this set.',
  };

  const totalScoreMid = Math.round((quantLow + quantHigh + verbalLow + verbalHigh) / 2);
  let recommendedTrack = 'GRE Core Self-Paced Track';
  if (totalScoreMid < 315) {
    recommendedTrack = 'GRE Plus Track (Recommended: Grounded AI Tutor & Math Foundation)';
  } else if (totalScoreMid >= 325) {
    recommendedTrack = 'GRE Elite 330+ Track (Advanced Adaptive Mocks & Hard Section Drill)';
  }

  return {
    guestToken,
    claimed: false,
    submittedAt: new Date(),
    scoreSummary: {
      quantRaw,
      verbalRaw,
      quantScaledRange: [quantLow, quantHigh],
      verbalScaledRange: [verbalLow, verbalHigh],
      overallEstimatedRange: [quantLow + verbalLow, quantHigh + verbalHigh],
      topTrapArchetype: topTrap,
      recommendedTrack,
    },
    gated: true, // Results gated until sign-up
    itemByItemBreakdown: evaluations,
    personalizedStudyPlan: {
      recommendedWeeks: 8,
      targetScore: Math.min(340, quantHigh + verbalHigh + 5),
      focusAreas: triggeredTraps.map((t) => t.label),
    },
  };
}

/**
 * Claims a guest diagnostic attempt when the user completes sign-up.
 * Removes the results gate, binds to user ID, and enables study plan generation.
 */
export function claimDiagnosticAttempt(
  guestToken: string,
  userId: string,
  database: Map<string, DiagnosticAttemptRecord>
): DiagnosticAttemptRecord {
  const attempt = database.get(guestToken);
  if (!attempt) {
    throw new Error(`Diagnostic attempt not found for guest token: ${guestToken}`);
  }

  const updated: DiagnosticAttemptRecord = {
    ...attempt,
    userId,
    claimed: true,
    claimedAt: new Date(),
    gated: false, // Gate unlocked!
  };

  database.set(guestToken, updated);
  return updated;
}
