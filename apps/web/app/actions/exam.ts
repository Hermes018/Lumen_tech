/** @purpose Server actions for GRE CBT exam execution, section-level adaptive routing, AWA evaluation, and scaled score calculation */
'use server';

import {
  routeSection,
  tierToLearnerLabel,
  GRE_ADAPTIVE_RULES_V1,
  calculateExamScore,
  type Tier,
  type S1Item,
  type ScoredItem,
} from '@lumen/core';
import { evaluateAwaIssueEssay, type EvaluateAwaResult } from '@lumen/ai';
import { GRE_MAGOOSH_SEED_QUESTIONS, type SeedGreQuestion } from '@lumen/db';

export interface RouteSectionActionInput {
  fromPosition: number;
  attemptSectionId: string;
  responses: S1Item[];
}

export interface RouteSectionActionResult {
  tier: Tier;
  targetPosition: number;
  learnerLabel: string;
  basis: {
    metric: 'raw_pct' | 'theta';
    value: number;
    s1Raw: number;
    s1Count: number;
  };
}

/**
 * Executes server-authoritative GRE adaptive section routing (docs/07 §4.3).
 */
export async function routeExamSectionAction(
  input: RouteSectionActionInput
): Promise<RouteSectionActionResult> {
  const { fromPosition, attemptSectionId, responses } = input;

  const result = routeSection(
    GRE_ADAPTIVE_RULES_V1,
    fromPosition,
    attemptSectionId,
    responses
  );

  return {
    tier: result.tier,
    targetPosition: result.targetPosition,
    learnerLabel: tierToLearnerLabel(result.tier),
    basis: {
      metric: result.basis.metric,
      value: result.basis.value,
      s1Raw: result.basis.s1Raw,
      s1Count: result.basis.s1Count,
    },
  };
}

/**
 * Submits GRE Analytical Writing Analyze an Issue essay to the AI evaluation pipeline (docs/07 §7.4).
 */
export async function evaluateAwaEssayAction(input: {
  essayText: string;
  promptText: string;
  accountName?: string;
}): Promise<EvaluateAwaResult> {
  return evaluateAwaIssueEssay(input);
}

export interface ExamScoreActionInput {
  verbalItems: ScoredItem[];
  quantItems: ScoredItem[];
}

export interface ExamScoreActionResult {
  verbal: {
    scaled: number;
    low: number;
    high: number;
    theta: number;
    sem: number;
  };
  quant: {
    scaled: number;
    low: number;
    high: number;
    theta: number;
    sem: number;
  };
}

/**
 * Calculates official-style 130-170 scaled scores via Rasch EAP ability estimation (docs/07 §3.3).
 */
export async function calculateFinalScoreAction(
  input: ExamScoreActionInput
): Promise<ExamScoreActionResult> {
  const result = calculateExamScore([
    { measure: 'verbal', items: input.verbalItems },
    { measure: 'quant', items: input.quantItems },
  ]);

  return {
    verbal: {
      scaled: result.verbal.scaled.scaled,
      low: result.verbal.scaled.low,
      high: result.verbal.scaled.high,
      theta: result.verbal.estimate.theta,
      sem: result.verbal.estimate.sem,
    },
    quant: {
      scaled: result.quant.scaled.scaled,
      low: result.quant.scaled.low,
      high: result.quant.scaled.high,
      theta: result.quant.estimate.theta,
      sem: result.quant.estimate.sem,
    },
  };
}

export interface ExamSectionData {
  sectionIndex: number; // 1 to 5
  title: string;
  measure: 'awa' | 'verbal' | 'quant';
  timeAllowedSeconds: number;
  tier?: Tier;
  awaPrompt?: {
    topic: string;
    issuePrompt: string;
    instructions: string;
  };
  questions?: SeedGreQuestion[];
}

/**
 * Loads the authentic test form section items from seed pools based on position and adaptive tier.
 */
export async function fetchExamSectionData(
  sectionIndex: number,
  tier: Tier = 'medium'
): Promise<ExamSectionData> {
  if (sectionIndex === 1) {
    return {
      sectionIndex: 1,
      title: 'Section 1 of 5 — Analytical Writing: Analyze an Issue',
      measure: 'awa',
      timeAllowedSeconds: 30 * 60, // 30 minutes
      awaPrompt: {
        topic: 'Governmental Policy and Ecological Stewardship',
        issuePrompt:
          'Governments should prioritize environmental preservation over immediate economic expansion.',
        instructions:
          'Discuss the extent to which you agree or disagree with the statement and explain your reasoning for the position you take. In developing and supporting your position, you should consider ways in which the statement might or might not hold true and explain how these considerations shape your position.',
      },
    };
  }

  if (sectionIndex === 2) {
    // Section 2: Verbal Reasoning 1 (12 questions, standard medium difficulty)
    const questions = GRE_MAGOOSH_SEED_QUESTIONS.slice(0, 12);
    return {
      sectionIndex: 2,
      title: 'Section 2 of 5 — Verbal Reasoning 1',
      measure: 'verbal',
      timeAllowedSeconds: 18 * 60, // 18 minutes for 12 questions
      questions,
    };
  }

  if (sectionIndex === 3) {
    // Section 3: Quantitative Reasoning 1 (12 questions, standard medium difficulty)
    const questions = GRE_MAGOOSH_SEED_QUESTIONS.slice(4, 16);
    return {
      sectionIndex: 3,
      title: 'Section 3 of 5 — Quantitative Reasoning 1',
      measure: 'quant',
      timeAllowedSeconds: 21 * 60, // 21 minutes for 12 questions
      questions,
    };
  }

  if (sectionIndex === 4) {
    // Section 4: Verbal Reasoning 2 (15 questions routed by adaptive engine)
    let filtered = [...GRE_MAGOOSH_SEED_QUESTIONS];
    if (tier === 'low') {
      filtered = filtered.filter((q) => q.difficultyB <= 0);
    } else if (tier === 'high') {
      filtered = filtered.filter((q) => q.difficultyB >= 0);
    }
    // Pad to 15 questions if pool subset is smaller
    const questions = (filtered.concat(GRE_MAGOOSH_SEED_QUESTIONS)).slice(0, 15);

    return {
      sectionIndex: 4,
      title: `Section 4 of 5 — Verbal Reasoning 2 (${tierToLearnerLabel(tier)})`,
      measure: 'verbal',
      timeAllowedSeconds: 23 * 60, // 23 minutes for 15 questions
      tier,
      questions,
    };
  }

  // Section 5: Quantitative Reasoning 2 (15 questions routed by adaptive engine)
  let filtered = [...GRE_MAGOOSH_SEED_QUESTIONS];
  if (tier === 'low') {
    filtered = filtered.filter((q) => q.difficultyB <= 0);
  } else if (tier === 'high') {
    filtered = filtered.filter((q) => q.difficultyB >= 0);
  }
  const questions = (filtered.concat(GRE_MAGOOSH_SEED_QUESTIONS)).slice(2, 17);

  return {
    sectionIndex: 5,
    title: `Section 5 of 5 — Quantitative Reasoning 2 (${tierToLearnerLabel(tier)})`,
    measure: 'quant',
    timeAllowedSeconds: 26 * 60, // 26 minutes for 15 questions
    tier,
    questions,
  };
}
