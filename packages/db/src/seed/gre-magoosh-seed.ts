/**
 * @purpose 100% Original GRE Magoosh-Parity Demo Seed Pack.
 * Conforms to 00-DECISIONS.md D6, D13 Interactive Pedagogy, and docs/07-TEST-ENGINE.md.
 * Covers all 12 canonical GRE CBT item types with 3 progressive hints, per-choice trap diagnostics,
 * 3-step Socratic walkthroughs, and GregMat-style verbal trigger/charge deconstruction.
 */

import type {
  PedagogyHint,
  ChoiceExplanation,
  SocraticStep,
  VerbalDeconstructor,
} from '../schema/gre_curriculum';

export interface SeedGreQuestion {
  id: string;
  questionType: string;
  topicSlug: string;
  difficultyB: number; // IRT difficulty param: -1.5 (easy) to +1.8 (hard)
  promptMd: string;
  passageMd?: string;
  options: Array<{ id: string; text: string }>;
  correctAnswers: string[]; // array of correct choice IDs, or numeric values
  hints: PedagogyHint[];
  choiceExplanations: Record<string, ChoiceExplanation>;
  steps: SocraticStep[];
  verbalDeconstructor?: VerbalDeconstructor;
  writtenExplanationMd: string;
}

export const GRE_MAGOOSH_SEED_QUESTIONS: SeedGreQuestion[] = [
  // 1. Quantitative Comparison (QC) - Algebra / Signs
  {
    id: 'gre-q-01-qc-signs',
    questionType: 'gre_qc',
    topicSlug: 'algebra-inequalities',
    difficultyB: 0.35,
    promptMd: 'Given that $x^2 = 16$ and $y^3 = -27$.\n\nQuantity A: $x + y$\n\nQuantity B: $0$',
    options: [
      { id: 'A', text: 'Quantity A is greater.' },
      { id: 'B', text: 'Quantity B is greater.' },
      { id: 'C', text: 'The two quantities are equal.' },
      { id: 'D', text: 'The relationship cannot be determined from the information given.' },
    ],
    correctAnswers: ['D'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'Remember that an even exponent equation like $x^2 = k$ produces two possible roots: one positive and one negative.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'Solve for both variables: $x = \\pm 4$, while $y = -3$ (odd power keeps the negative sign). Now evaluate $x + y$ for both cases.',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: 'If $x = 4$, $4 + (-3) = 1 > 0$ (Quantity A > B). If $x = -4$, $-4 + (-3) = -7 < 0$ (Quantity B > A). Since the outcome changes, choose D.',
      },
    ],
    choiceExplanations: {
      A: {
        is_correct: false,
        explanation_md: 'Assumed $x = 4$ only, forgetting the negative root $x = -4$.',
        trap_tag: 'forgot_negative_root',
        trap_label: 'Overlooked Negative Root',
      },
      B: {
        is_correct: false,
        explanation_md: 'Assumed $x = -4$ only, overlooking the positive root $x = 4$.',
        trap_tag: 'single_case_bias',
        trap_label: 'Single Case Assumption',
      },
      C: {
        is_correct: false,
        explanation_md: 'Neither root yields $x + y = 0$. For $x + y = 0$, $x$ would need to be $3$.',
        trap_tag: 'algebraic_miscalculation',
        trap_label: 'Arithmetic Confusion',
      },
      D: {
        is_correct: true,
        explanation_md: 'Because $x$ can be $4$ or $-4$, $x + y$ can be $1$ (greater than $0$) or $-7$ (less than $0$). Therefore, the relationship cannot be determined.',
      },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What are the possible values for $x$ and $y$?',
        options: ['$x=4, y=3$', '$x=\\pm 4, y=-3$', '$x=4, y=-3$'],
        correct_option_index: 1,
        takeaway_md: 'Even powers produce $\\pm$ roots ($x = \\pm 4$), while odd powers retain their sign ($y = -3$).',
      },
      {
        step_index: 2,
        prompt_md: 'What happens to Quantity A when $x = 4$ versus $x = -4$?',
        options: ['Always negative', '1 in Case 1, -7 in Case 2', 'Always positive'],
        correct_option_index: 1,
        takeaway_md: 'The sum evaluates to $1$ when $x=4$, but $-7$ when $x=-4$.',
      },
      {
        step_index: 3,
        prompt_md: 'Since Quantity A can be both greater than and less than Quantity B, what is the answer?',
        options: ['Quantity A is greater', 'Relationship cannot be determined (D)', 'Quantity B is greater'],
        correct_option_index: 1,
        takeaway_md: 'In GRE QC, if the relationship shifts depending on valid test values, D is always correct.',
      },
    ],
    writtenExplanationMd: 'Step 1: Solve for $x$ and $y$.\n$x^2 = 16 \\implies x = 4 \\text{ or } x = -4$.\n$y^3 = -27 \\implies y = -3$.\n\nStep 2: Test both cases.\nCase 1 ($x = 4$): Quantity A $= 4 + (-3) = 1$. Here, Quantity A > Quantity B ($1 > 0$).\nCase 2 ($x = -4$): Quantity A $= -4 + (-3) = -7$. Here, Quantity B > Quantity A ($0 > -7$).\n\nBecause Quantity A can be greater than or less than Quantity B, the relationship cannot be determined from the information given. Correct Answer: D.',
  },

  // 2. Multiple Choice Single Answer (MC Single) - Work Rate
  {
    id: 'gre-q-02-mc-work-rate',
    questionType: 'gre_mc_single',
    topicSlug: 'arithmetic-work-rate',
    difficultyB: 0.1,
    promptMd: 'Machine A can complete a certain manufacturing task in $6$ hours, and Machine B can complete the identical task in $12$ hours. Working together at their respective constant rates, how many hours will it take both machines to complete the task?',
    options: [
      { id: 'A', text: '2.5' },
      { id: 'B', text: '3.0' },
      { id: 'C', text: '4.0' },
      { id: 'D', text: '4.5' },
      { id: 'E', text: '9.0' },
    ],
    correctAnswers: ['C'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'Calculate the rate of work done per hour by each machine. Rates of working entities add up when working simultaneously.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'Rate of Machine A is $\\frac{1}{6}$ job/hr. Rate of Machine B is $\\frac{1}{12}$ job/hr. Combined rate $= \\frac{1}{6} + \\frac{1}{12}$.',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: '$\\frac{1}{6} + \\frac{1}{12} = \\frac{2}{12} + \\frac{1}{12} = \\frac{3}{12} = \\frac{1}{4}$ job/hr. Time required is the reciprocal: $4$ hours.',
      },
    ],
    choiceExplanations: {
      A: {
        is_correct: false,
        explanation_md: 'Formula error: inverted fractional rate calculation.',
        trap_tag: 'reciprocal_math_error',
        trap_label: 'Inverted Ratio',
      },
      B: {
        is_correct: false,
        explanation_md: 'Divided the faster time by 2 without considering Machine B.',
        trap_tag: 'heuristic_guess',
        trap_label: 'Half-time Heuristic',
      },
      C: {
        is_correct: true,
        explanation_md: 'Combined rate is 1/6 + 1/12 = 3/12 = 1/4 of the task per hour. Reciprocal gives 4 hours.',
      },
      D: {
        is_correct: false,
        explanation_md: 'Took half of the average time ((6 + 12)/2)/2.',
        trap_tag: 'average_rate_trap',
        trap_label: 'Average Instead of Harmonic Sum',
      },
      E: {
        is_correct: false,
        explanation_md: 'Averaged the two times (6 + 12) / 2 = 9. Working together must take LESS time than the fastest machine alone (less than 6 hours)!',
        trap_tag: 'average_instead_of_combined',
        trap_label: 'Arithmetic Average Trap',
      },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What is the hourly work rate of Machine A and Machine B?',
        options: ['1/6 and 1/12 jobs/hr', '6 and 12 jobs/hr', '1/18 jobs/hr'],
        correct_option_index: 0,
        takeaway_md: 'Work rate is always 1 divided by the total time taken.',
      },
      {
        step_index: 2,
        prompt_md: 'What is their combined work rate when operating simultaneously?',
        options: ['1/18 jobs/hr', '3/12 = 1/4 jobs/hr', '2/9 jobs/hr'],
        correct_option_index: 1,
        takeaway_md: 'Add individual rates together with a common denominator.',
      },
      {
        step_index: 3,
        prompt_md: 'How long does it take to finish 1 complete job at a rate of 1/4 job/hr?',
        options: ['4 hours', '3 hours', '9 hours'],
        correct_option_index: 0,
        takeaway_md: 'Time = 1 / Combined Rate = 1 / (1/4) = 4 hours.',
      },
    ],
    writtenExplanationMd: 'Combined work rate formula: $R_{\\text{total}} = \\frac{1}{T_A} + \\frac{1}{T_B} = \\frac{1}{6} + \\frac{1}{12} = \\frac{2}{12} + \\frac{1}{12} = \\frac{3}{12} = \\frac{1}{4}$ job per hour.\n\nTotal time $T = \\frac{1}{R_{\\text{total}}} = 4$ hours.\nNotice that working together must always take less time than the fastest machine alone ($4 < 6$). Correct Answer: C.',
  },

  // 3. Multiple Choice Multi-Answer (MC Multi) - Number Properties
  {
    id: 'gre-q-03-mc-multi-primes',
    questionType: 'gre_mc_multi',
    topicSlug: 'number-properties-primes',
    difficultyB: 0.6,
    promptMd: 'If $n$ is an integer such that $20 < n < 40$, which of the following could be the value of $n$ if $n$ is the product of two distinct prime numbers? (Indicate all such values.)',
    options: [
      { id: 'A', text: '21' },
      { id: 'B', text: '25' },
      { id: 'C', text: '26' },
      { id: 'D', text: '33' },
      { id: 'E', text: '36' },
      { id: 'F', text: '39' },
    ],
    correctAnswers: ['A', 'C', 'D', 'F'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'Factor each number into its prime factors. Look specifically for numbers with EXACTLY two prime factors that are DISTINCT ($p_1 \\times p_2$ where $p_1 \\neq p_2$).',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'Check A: $21 = 3 \\times 7$ (valid). Check B: $25 = 5 \\times 5$ (primes are identical, not distinct!). Check E: $36 = 2^2 \\times 3^2$ (four prime factors).',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: 'Check remaining options: $26 = 2 \\times 13$ (valid); $33 = 3 \\times 11$ (valid); $39 = 3 \\times 13$ (valid).',
      },
    ],
    choiceExplanations: {
      A: {
        is_correct: true,
        explanation_md: '21 = 3 * 7. Both 3 and 7 are distinct primes.',
      },
      B: {
        is_correct: false,
        explanation_md: '25 = 5 * 5. The prime factors are identical, not distinct.',
        trap_tag: 'overlooked_distinct_constraint',
        trap_label: 'Ignored "Distinct" Requirement',
      },
      C: {
        is_correct: true,
        explanation_md: '26 = 2 * 13. Both 2 and 13 are distinct primes.',
      },
      D: {
        is_correct: true,
        explanation_md: '33 = 3 * 11. Both 3 and 11 are distinct primes.',
      },
      E: {
        is_correct: false,
        explanation_md: '36 = 2 * 2 * 3 * 3. Has 4 prime factors, not 2.',
        trap_tag: 'composite_factor_confusion',
        trap_label: 'Too Many Prime Factors',
      },
      F: {
        is_correct: true,
        explanation_md: '39 = 3 * 13. Both 3 and 13 are distinct primes.',
      },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What does "product of two distinct primes" mean?',
        options: ['p^2 where p is prime', 'p1 * p2 where p1 and p2 are different primes', 'Any composite number'],
        correct_option_index: 1,
        takeaway_md: 'Must be semiprime with square-free factors ($p_1 \\neq p_2$).',
      },
      {
        step_index: 2,
        prompt_md: 'Why is 25 not a solution?',
        options: ['5 is not prime', 'The factors 5 and 5 are not distinct', '25 is outside range'],
        correct_option_index: 1,
        takeaway_md: '25 = 5 * 5, which violates the "distinct" requirement.',
      },
      {
        step_index: 3,
        prompt_md: 'Which numbers factor into exactly two distinct primes?',
        options: ['A, C, D, F', 'A, B, C, D', 'All options'],
        correct_option_index: 0,
        takeaway_md: '21 (3*7), 26 (2*13), 33 (3*11), and 39 (3*13) all satisfy the criteria.',
      },
    ],
    writtenExplanationMd: 'Factor each option:\n- A: $21 = 3 \\times 7$ (Two distinct primes - VALID)\n- B: $25 = 5 \\times 5$ (Factors are identical - INVALID)\n- C: $26 = 2 \\times 13$ (Two distinct primes - VALID)\n- D: $33 = 3 \\times 11$ (Two distinct primes - VALID)\n- E: $36 = 2^2 \\times 3^2$ (Total of 4 prime factors - INVALID)\n- F: $39 = 3 \\times 13$ (Two distinct primes - VALID)\n\nCorrect Answers: A, C, D, F.',
  },

  // 4. Numeric Entry Single (Integer / Decimal) - Geometry / Circles
  {
    id: 'gre-q-04-numeric-single-geometry',
    questionType: 'gre_numeric_single',
    topicSlug: 'geometry-circles',
    difficultyB: 0.45,
    promptMd: 'A circular garden has an area of $64\\pi$ square meters. A circular walking path around the garden increases the total radius by $2$ meters. What is the area of the walking path alone, in terms of $\\pi$? (Enter the coefficient of $\\pi$.)',
    options: [],
    correctAnswers: ['36'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'First find the inner radius from the inner garden area $A = \\pi r^2 = 64\\pi$.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'Inner radius $r = 8$ meters. With the path, the outer radius is $R = 8 + 2 = 10$ meters.',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: 'The area of the path alone is the outer circular area minus inner area: $\\pi(10^2) - \\pi(8^2) = 100\\pi - 64\\pi = 36\\pi$. Enter 36.',
      },
    ],
    choiceExplanations: {
      '36': {
        is_correct: true,
        explanation_md: 'Outer area 100pi minus inner area 64pi equals 36pi. Coefficient is 36.',
      },
      '4': {
        is_correct: false,
        explanation_md: 'Calculated pi * (2^2) instead of difference between outer and inner circles.',
        trap_tag: 'path_width_squared_trap',
        trap_label: 'Squared Path Width Directly',
      },
      '100': {
        is_correct: false,
        explanation_md: 'Calculated the entire outer circle area, forgetting to subtract the garden.',
        trap_tag: 'forgot_to_subtract_inner',
        trap_label: 'Overlooked Subtraction of Inner Garden',
      },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'If $\\pi r^2 = 64\\pi$, what is the radius $r$ of the garden?',
        options: ['8 meters', '16 meters', '4 meters'],
        correct_option_index: 0,
        takeaway_md: '$r^2 = 64 \\implies r = 8$.',
      },
      {
        step_index: 2,
        prompt_md: 'What is the outer radius $R$ including the 2-meter path?',
        options: ['10 meters', '8.5 meters', '12 meters'],
        correct_option_index: 0,
        takeaway_md: '$R = r + 2 = 8 + 2 = 10$ meters.',
      },
      {
        step_index: 3,
        prompt_md: 'What is the area of the ring (path alone)?',
        options: ['36 pi', '4 pi', '100 pi'],
        correct_option_index: 0,
        takeaway_md: 'Path Area = $\\pi R^2 - \\pi r^2 = 100\\pi - 64\\pi = 36\\pi$.',
      },
    ],
    writtenExplanationMd: 'Step 1: Inner garden radius $r = \\sqrt{64} = 8$ meters.\nStep 2: Outer circle radius $R = 8 + 2 = 10$ meters.\nStep 3: Total outer area $= \\pi(10^2) = 100\\pi$.\nStep 4: Path area alone $= 100\\pi - 64\\pi = 36\\pi$.\nSince the prompt asks for the coefficient of $\\pi$, the entry is 36.',
  },

  // 5. Numeric Entry Fraction - Probability
  {
    id: 'gre-q-05-numeric-fraction-probability',
    questionType: 'gre_numeric_fraction',
    topicSlug: 'data-analysis-probability',
    difficultyB: 0.8,
    promptMd: 'A drawer contains $5$ blue socks and $7$ black socks. If two socks are selected at random one after another without replacement, what is the probability that both socks are blue? (Enter the fraction in simplest form in the numerator and denominator boxes.)',
    options: [],
    correctAnswers: ['5/33'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'This is selection WITHOUT replacement. The total count decreases by 1 after the first sock is drawn.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'Total socks = $5 + 7 = 12$. Probability of first blue sock = $\\frac{5}{12}$. After drawing a blue sock, $4$ blue socks remain out of $11$ total socks.',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: 'Multiply the dependent probabilities: $\\frac{5}{12} \\times \\frac{4}{11} = \\frac{20}{132} = \\frac{5}{33}$.',
      },
    ],
    choiceExplanations: {
      '5/33': {
        is_correct: true,
        explanation_md: '(5/12) * (4/11) = 20/132 = 5/33.',
      },
      '25/144': {
        is_correct: false,
        explanation_md: 'Calculated with replacement (5/12 * 5/12). The prompt states "without replacement".',
        trap_tag: 'replacement_confusion',
        trap_label: 'Assumed With-Replacement',
      },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What is the probability of selecting the first blue sock?',
        options: ['5/12', '5/7', '1/12'],
        correct_option_index: 0,
        takeaway_md: '5 blue socks out of 12 total socks.',
      },
      {
        step_index: 2,
        prompt_md: 'What is the probability of selecting the second blue sock without replacement?',
        options: ['4/11', '5/11', '4/12'],
        correct_option_index: 0,
        takeaway_md: '1 blue sock and 1 total sock have been removed, leaving 4/11.',
      },
      {
        step_index: 3,
        prompt_md: 'What is the combined simplified probability?',
        options: ['5/33', '20/132', '25/144'],
        correct_option_index: 0,
        takeaway_md: '$(5/12) \\times (4/11) = (5 \\times 1) / (3 \\times 11) = 5/33$.',
      },
    ],
    writtenExplanationMd: 'Total socks $= 5 + 7 = 12$.\n$P(\\text{1st Blue}) = \\frac{5}{12}$.\n$P(\\text{2nd Blue | 1st Blue}) = \\frac{4}{11}$.\n$P(\\text{both Blue}) = \\frac{5}{12} \\times \\frac{4}{11} = \\frac{5}{3} \\times \\frac{1}{11} = \\frac{5}{33}$.\nNumerator: 5, Denominator: 33.',
  },

  // 6. Text Completion 1-Blank (TC1) - Contrast Pivot
  {
    id: 'gre-q-06-tc1-contrast',
    questionType: 'gre_tc_1',
    topicSlug: 'verbal-text-completion',
    difficultyB: 0.25,
    promptMd: 'Although the senator was celebrated in public ceremonies as an exceptionally ______ statesman, archival documents revealed that behind closed doors his temper was mercurial and vindictive.',
    options: [
      { id: 'A', text: 'equable' },
      { id: 'B', text: 'petulant' },
      { id: 'C', text: 'zealous' },
      { id: 'D', text: 'didactic' },
      { id: 'E', text: 'truculent' },
    ],
    correctAnswers: ['A'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'Identify the pivot word: "Although". The public persona is contrasted with his private behavior ("mercurial and vindictive").',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: '"Mercurial" means unpredictable and emotionally volatile. The blank needs the OPPOSITE: someone calm, composed, and even-tempered.',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: '"Equable" means calm, unruffled, and even-tempered. "Petulant" and "truculent" are negative traps.',
      },
    ],
    choiceExplanations: {
      A: {
        is_correct: true,
        explanation_md: 'Equable means even-tempered and calm, perfectly contrasting with "mercurial and vindictive".',
      },
      B: {
        is_correct: false,
        explanation_md: 'Petulant means bad-tempered, which agrees with the private reality instead of contrasting it.',
        trap_tag: 'opposite_of_pivot',
        trap_label: 'Ignored Contrast Pivot',
      },
      C: {
        is_correct: false,
        explanation_md: 'Zealous means passionate/enthusiastic, which does not contrast with mercurial.',
        trap_tag: 'irrelevant_charge',
        trap_label: 'Wrong Semantic Dimension',
      },
      D: {
        is_correct: false,
        explanation_md: 'Didactic means intending to teach; neutral in temperament.',
        trap_tag: 'unsupported_meaning',
        trap_label: 'No Contextual Support',
      },
      E: {
        is_correct: false,
        explanation_md: 'Truculent means aggressively defiant; aligns with vindictive rather than contrasting it.',
        trap_tag: 'same_charge_trap',
        trap_label: 'Matched Secret Persona',
      },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What is the role of the trigger word "Although"?',
        options: ['Shows cause and effect', 'Sets up a direct contrast between public and private', 'Provides an example'],
        correct_option_index: 1,
        takeaway_md: '"Although" indicates the blank must be the opposite of "mercurial and vindictive".',
      },
      {
        step_index: 2,
        prompt_md: 'What charge and meaning should we predict for the blank?',
        options: ['Positive: calm, steady, even-tempered', 'Negative: aggressive, harsh', 'Neutral: instructive'],
        correct_option_index: 0,
        takeaway_md: 'Since the second clause is volatile/spiteful, the blank must mean calm/balanced.',
      },
      {
        step_index: 3,
        prompt_md: 'Which word means even-tempered and calm?',
        options: ['equable', 'petulant', 'truculent'],
        correct_option_index: 0,
        takeaway_md: 'Equable is derived from "equal/level" — serene and even-tempered.',
      },
    ],
    verbalDeconstructor: {
      trigger_words: [
        { word: 'Although', category: 'contrast', note: 'Shifts tone between public praise and private reality' },
        { word: 'revealed that behind closed doors', category: 'contrast', note: 'Emphasizes disparity between public veneer and actual nature' },
      ],
      blank_charges: [
        { blank_index: 1, charge: '+', rationale: 'Contrasts with mercurial/vindictive; requires serene, even-keeled nature' },
      ],
      prediction_guide_md: 'Predict: even-tempered, calm, unruffled.',
    },
    writtenExplanationMd: 'Sentence Structure Analysis:\n1. Pivot: "Although" sets up contrast.\n2. Clue in second half: "mercurial (volatile) and vindictive (spiteful)".\n3. Required word for blank: The opposite of volatile and irritable, meaning calm and even-tempered.\n4. Vocabulary Evaluation: "Equable" means not easily disturbed; serene. Correct Answer: A.',
  },

  // 7. Text Completion 2-Blank (TC2) - Scientific Paradox
  {
    id: 'gre-q-07-tc2-science',
    questionType: 'gre_tc_2',
    topicSlug: 'verbal-text-completion',
    difficultyB: 0.9,
    promptMd: 'Because early astronomical records were notoriously (i)______, modern researchers initially treated reports of an eleventh-century supernova with deep skepticism; however, corroborating geological ice-core samples have recently (ii)______ the validity of those ancient observations.',
    options: [
      { id: 'A', text: 'Blank (i): imprecise' },
      { id: 'B', text: 'Blank (i): comprehensive' },
      { id: 'C', text: 'Blank (i): prophetic' },
      { id: 'D', text: 'Blank (ii): repudiated' },
      { id: 'E', text: 'Blank (ii): substantiated' },
      { id: 'F', text: 'Blank (ii): obscured' },
    ],
    correctAnswers: ['A', 'E'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'Look at the cause-and-effect in clause 1 ("Because..., treated with deep skepticism") and the pivot "however" in clause 2.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'For Blank (i): What kind of records would cause "deep skepticism"? Flawed, inaccurate, or imprecise records. For Blank (ii): "however" reverses the skepticism, so the ice-core samples supported or verified the ancient observations.',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: 'Blank (i) = "imprecise". Blank (ii) = "substantiated" (validated/proven).',
      },
    ],
    choiceExplanations: {
      A: { is_correct: true, explanation_md: 'Imprecise explains why researchers were initially skeptical.' },
      B: { is_correct: false, explanation_md: 'Comprehensive would inspire confidence, not skepticism.', trap_tag: 'wrong_cause' },
      C: { is_correct: false, explanation_md: 'Prophetic is unscientific and unsupported by context.', trap_tag: 'irrelevant' },
      D: { is_correct: false, explanation_md: 'Repudiated means rejected, which contradicts the pivot "however".', trap_tag: 'ignored_pivot' },
      E: { is_correct: true, explanation_md: 'Substantiated means verified/proved, countering the initial skepticism.' },
      F: { is_correct: false, explanation_md: 'Obscured means hid, which fails to corroborate the observations.', trap_tag: 'negative_connotation' },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'Why did researchers initially view the ancient records with skepticism?',
        options: ['Because records were imprecise', 'Because records were comprehensive', 'Because records were prophetic'],
        correct_option_index: 0,
        takeaway_md: 'Only "imprecise" justifies "deep skepticism".',
      },
      {
        step_index: 2,
        prompt_md: 'What does "however, corroborating geological ice-core samples" indicate for Blank (ii)?',
        options: ['The records were confirmed/substantiated', 'The records were refuted', 'The records were ignored'],
        correct_option_index: 0,
        takeaway_md: '"Corroborating" means supporting; "however" reverses the initial skepticism.',
      },
      {
        step_index: 3,
        prompt_md: 'Select the matching pair:',
        options: ['imprecise & substantiated', 'comprehensive & repudiated', 'prophetic & obscured'],
        correct_option_index: 0,
        takeaway_md: 'A and E correctly complete the logical progression.',
      },
    ],
    verbalDeconstructor: {
      trigger_words: [
        { word: 'Because', category: 'cause_effect', note: 'Links flaw in records with initial skepticism' },
        { word: 'however', category: 'contrast', note: 'Reverses skepticism into empirical validation' },
      ],
      blank_charges: [
        { blank_index: 1, charge: '-', rationale: 'Must explain skepticism' },
        { blank_index: 2, charge: '+', rationale: 'Corroborating data validates the records' },
      ],
      prediction_guide_md: 'Blank 1: inaccurate/flawed. Blank 2: verified/confirmed.',
    },
    writtenExplanationMd: 'Clause 1: "Because early records were [Blank 1], researchers treated them with skepticism." -> Blank 1 must mean inaccurate or imprecise. Choice A.\nClause 2: "however, corroborating ice-core samples have [Blank 2] the validity." -> Blank 2 must mean verified or substantiated. Choice E.\nCorrect Answers: A and E.',
  },

  // 8. Text Completion 3-Blank (TC3) - Literary Criticism
  {
    id: 'gre-q-08-tc3-literature',
    questionType: 'gre_tc_3',
    topicSlug: 'verbal-text-completion',
    difficultyB: 1.2,
    promptMd: 'Far from presenting a (i)______ depiction of late-colonial society, the novelist offered a work of startling (ii)______: every apparent hero harbored self-serving motives, while the ostensible villains frequently demonstrated unexpected moments of (iii)______.',
    options: [
      { id: 'A', text: 'Blank (i): Manichaean' },
      { id: 'B', text: 'Blank (i): subtle' },
      { id: 'C', text: 'Blank (i): chronological' },
      { id: 'D', text: 'Blank (ii): simplicity' },
      { id: 'E', text: 'Blank (ii): nuance' },
      { id: 'F', text: 'Blank (ii): nostalgia' },
      { id: 'G', text: 'Blank (iii): magnanimity' },
      { id: 'H', text: 'Blank (iii): perfidy' },
      { id: 'I', text: 'Blank (iii): hubris' },
    ],
    correctAnswers: ['A', 'E', 'G'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'Notice the colon (:). The entire second half of the sentence defines what kind of work it is: heroes have selfish flaws, while villains have positive traits.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'This mixing of good and bad traits in both heroes and villains represents "nuance" or complexity (Blank ii). Therefore, the work was "Far from" being black-and-white / dualistic (Blank i).',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: 'Blank (i) = "Manichaean" (seeing the world strictly as black-and-white / good vs evil). Blank (ii) = "nuance". Blank (iii) = a positive trait contrasting with villainy: "magnanimity" (generosity/nobility).',
      },
    ],
    choiceExplanations: {
      A: { is_correct: true, explanation_md: 'Manichaean refers to a simplistic dualistic view (pure good vs pure evil).' },
      B: { is_correct: false, explanation_md: 'Subtle is contradicted by "Far from".', trap_tag: 'opposite_context' },
      C: { is_correct: false, explanation_md: 'Chronological is completely off-topic.', trap_tag: 'irrelevant' },
      D: { is_correct: false, explanation_md: 'Simplicity contradicts the complex character portrayals.', trap_tag: 'simplistic' },
      E: { is_correct: true, explanation_md: 'Nuance captures subtle distinctions where heroes have flaws and villains have virtues.' },
      F: { is_correct: false, explanation_md: 'Nostalgia relates to longing for the past, not character depth.', trap_tag: 'sentiment' },
      G: { is_correct: true, explanation_md: 'Magnanimity is noble generosity, contrasting with villainy.' },
      H: { is_correct: false, explanation_md: 'Perfidy means treachery, which is expected of villains, not "unexpected".', trap_tag: 'redundant' },
      I: { is_correct: false, explanation_md: 'Hubris means excessive pride, not an unexpected positive contrast.', trap_tag: 'negative' },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What does the explanation after the colon reveal about the characters?',
        options: ['They are purely good or bad', 'They are morally complex (heroes have flaws, villains have virtues)', 'They are uninteresting'],
        correct_option_index: 1,
        takeaway_md: 'Characters are not simplistic; both heroes and villains possess mixed traits.',
      },
      {
        step_index: 2,
        prompt_md: 'Which word in Blank (ii) describes moral complexity and subtle distinction?',
        options: ['nuance', 'simplicity', 'nostalgia'],
        correct_option_index: 0,
        takeaway_md: 'Nuance = fine gradations of meaning and character.',
      },
      {
        step_index: 3,
        prompt_md: 'Which words correctly fill Blank (i) (simplistic black-and-white) and Blank (iii) (unexpected noble trait in villains)?',
        options: ['Manichaean and magnanimity', 'subtle and perfidy', 'chronological and hubris'],
        correct_option_index: 0,
        takeaway_md: 'Manichaean (black-and-white dualism) and magnanimity (generosity of spirit).',
      },
    ],
    verbalDeconstructor: {
      trigger_words: [
        { word: 'Far from', category: 'contrast', note: 'Negates the simplistic nature in Blank (i)' },
        { word: 'colon (:)', category: 'support', note: 'Explains the nuanced character duality in Blank (ii)' },
      ],
      blank_charges: [
        { blank_index: 1, charge: '-', rationale: 'Black-and-white dualism contradicted by the nuanced reality' },
        { blank_index: 2, charge: '+', rationale: 'Nuance/depth defined by mixed character virtues' },
        { blank_index: 3, charge: '+', rationale: 'Unexpected positive trait (nobility/generosity) in villains' },
      ],
      prediction_guide_md: 'Blank 1: black-and-white/dualistic. Blank 2: subtlety/nuance. Blank 3: generosity/nobility.',
    },
    writtenExplanationMd: 'Start with Blank (ii) and (iii):\n- Villains show "unexpected moments of [Blank iii]": since villains are bad, the unexpected trait must be good (magnanimity = nobility/generosity of spirit). Choice G.\n- Heroes having selfish flaws while villains show generosity means the work exhibits "nuance" (subtle moral complexity). Choice E.\n- "Far from presenting a [Blank i] depiction": Blank (i) must be the opposite of nuanced complexity — i.e., black-and-white dualism. "Manichaean" means viewing politics/life as a rigid struggle between absolute good and evil. Choice A.\nCorrect Answers: A, E, G.',
  },

  // 9. Sentence Equivalence (SE) - GregMat Pair Drill
  {
    id: 'gre-q-09-se-pair-drill',
    questionType: 'gre_se',
    topicSlug: 'verbal-sentence-equivalence',
    difficultyB: 0.75,
    promptMd: 'Despite the CEO\'s public assertions that company profits would rebound swiftly, internal projections were so ______ that several senior executives began liquidating their equity holdings.',
    options: [
      { id: 'A', text: 'sanguine' },
      { id: 'B', text: 'dismal' },
      { id: 'C', text: 'lucrative' },
      { id: 'D', text: 'bleak' },
      { id: 'E', text: 'equivocal' },
      { id: 'F', text: 'precocious' },
    ],
    correctAnswers: ['B', 'D'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'Identify the pivot "Despite". The CEO said profits would "rebound swiftly" (positive), so internal projections must be negative.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'The clue "executives began liquidating equity" confirms the projections were dire, grim, or hopeless. Find TWO words that mean gloomy/grim.',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: '"Dismal" and "bleak" form a perfect synonym pair meaning gloomy/depressing. "Sanguine" is an antonym trap (means optimistic).',
      },
    ],
    choiceExplanations: {
      A: { is_correct: false, explanation_md: 'Sanguine means optimistic, which matches the CEO\'s words, ignoring the "Despite" pivot.', trap_tag: 'antonym_trap', trap_label: 'Opposite of Required Charge' },
      B: { is_correct: true, explanation_md: 'Dismal means gloomy and depressing, forming a pair with bleak.' },
      C: { is_correct: false, explanation_md: 'Lucrative means profitable, which contradicts executives selling off stock.', trap_tag: 'contradictory' },
      D: { is_correct: true, explanation_md: 'Bleak means desolate, grim, or dreary, forming an exact equivalent sentence with dismal.' },
      E: { is_correct: false, explanation_md: 'Equivocal means ambiguous/uncertain. While possible alone, it has no synonym pair in the list.', trap_tag: 'orphan_synonym_no_pair', trap_label: 'Orphan Word (No Matching Pair)' },
      F: { is_correct: false, explanation_md: 'Precocious means unusually advanced at an early age; semantically nonsensical.', trap_tag: 'irrelevant' },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What is the required charge for the blank based on "Despite" and "executives liquidating equity"?',
        options: ['Strongly negative (grim, hopeless)', 'Optimistic (cheerful)', 'Ambiguous'],
        correct_option_index: 0,
        takeaway_md: 'The sentence demands a negative word meaning gloomy or grim.',
      },
      {
        step_index: 2,
        prompt_md: 'Identify the valid synonym pair among the choices:',
        options: ['dismal and bleak', 'sanguine and lucrative', 'equivocal and precocious'],
        correct_option_index: 0,
        takeaway_md: '"Dismal" and "bleak" both mean gloomy and depressing.',
      },
      {
        step_index: 3,
        prompt_md: 'Do both words produce coherent sentences with identical meaning?',
        options: ['Yes', 'No'],
        correct_option_index: 0,
        takeaway_md: 'Both options yield identical meanings in context.',
      },
    ],
    verbalDeconstructor: {
      trigger_words: [
        { word: 'Despite', category: 'contrast', note: 'Contrasts optimistic public assertions with dire internal reality' },
      ],
      blank_charges: [
        { blank_index: 1, charge: '-', rationale: 'Projections caused executives to dump stock; must be gloomy/dire' },
      ],
      prediction_guide_md: 'Predict: grim, gloomy, depressing. Pair: dismal, bleak.',
    },
    writtenExplanationMd: 'Trigger: "Despite" indicates contrast with "rebound swiftly" (optimistic).\nClue: Executives liquidated equity, meaning internal forecasts were terrible.\nPrediction: gloomy, depressing, grim.\nEvaluating options:\n- Sanguine: optimistic (opposite)\n- Dismal: gloomy (matches prediction)\n- Lucrative: profitable (contradicts)\n- Bleak: grim/hopeless (matches prediction and pairs with dismal)\n- Equivocal: ambiguous (no pair)\n- Precocious: early development (irrelevant)\nCorrect Answers: B and D.',
  },

  // 10. Reading Comprehension Single Answer (RC Single)
  {
    id: 'gre-q-10-rc-single-passage',
    questionType: 'gre_rc_single',
    topicSlug: 'verbal-reading-comprehension',
    difficultyB: 0.85,
    passageMd: 'For decades, historians attributed the abrupt decline of the Bronze Age Aegean civilizations solely to systemic invasions by maritime marauders known collectively as the Sea Peoples. However, recent sediment core analyses from Lake Voulkaria indicate a protracted multi-century megadrought beginning around 1200 BCE, coinciding precisely with widespread crop failures, urban abandonment, and synchronous palatial destructions. Rather than functioning as an autonomous primary catalyst of societal collapse, the maritime raids were more likely opportunistic incursions by populations already displaced by agricultural exhaustion and climate-induced regional destabilization.',
    promptMd: 'The author mentions the sediment core analyses from Lake Voulkaria primarily in order to:',
    options: [
      { id: 'A', text: 'Refute the historical existence of maritime marauders known as the Sea Peoples.' },
      { id: 'B', text: 'Provide empirical evidence suggesting climatic factors played an essential role in Bronze Age Aegean societal collapse.' },
      { id: 'C', text: 'Argue that agricultural failure was the exclusive reason for the destruction of Aegean palaces.' },
      { id: 'D', text: 'Demonstrate that urban abandonment preceded the arrival of any drought in the Mediterranean basin.' },
      { id: 'E', text: 'Prove that sediment core analyses are superior to archaeological excavation in historical research.' },
    ],
    correctAnswers: ['B'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'Look at the transition word "However" right before mentioning Lake Voulkaria. The passage is shifting from the traditional explanation (invasions) to environmental context.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'The author does NOT say Sea Peoples never existed (rules out A), nor that drought was the "exclusive" reason (rules out extreme word "exclusive" in C).',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: 'The author introduces Lake Voulkaria sediment cores to demonstrate that a megadrought occurred, showing climatic stress catalyzed the collapse. Choice B.',
      },
    ],
    choiceExplanations: {
      A: { is_correct: false, explanation_md: 'The author acknowledges raids occurred ("opportunistic incursions"), so existence is not refuted.', trap_tag: 'extreme_negation' },
      B: { is_correct: true, explanation_md: 'The lake data provides empirical climatic evidence that reframes the collapse.' },
      C: { is_correct: false, explanation_md: 'The word "exclusive" is too extreme; invasions still contributed.', trap_tag: 'extreme_language', trap_label: 'Extreme Modifier ("Exclusive")' },
      D: { is_correct: false, explanation_md: 'The passage says abandonment coincided with the drought, not preceded it.', trap_tag: 'chronology_reversal' },
      E: { is_correct: false, explanation_md: 'The passage makes no broad claim ranking research methodologies.', trap_tag: 'out_of_scope' },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What traditional theory does the passage challenge?',
        options: ['That invasions alone caused the collapse', 'That climate change caused the collapse', 'That Greek city-states were peaceful'],
        correct_option_index: 0,
        takeaway_md: 'The traditional theory attributed collapse solely to maritime invaders.',
      },
      {
        step_index: 2,
        prompt_md: 'What did the sediment core analyses from Lake Voulkaria reveal?',
        options: ['A prolonged megadrought around 1200 BCE', 'Ancient shipwrecks', 'Alien artifacts'],
        correct_option_index: 0,
        takeaway_md: 'The core samples proved severe climate stress and drought.',
      },
      {
        step_index: 3,
        prompt_md: 'Why does the author cite this evidence?',
        options: ['To prove climate played a critical role in destabilizing the civilization (B)', 'To prove invaders did not exist (A)', 'To ban archaeology (E)'],
        correct_option_index: 0,
        takeaway_md: 'It serves as empirical evidence shifting the causal framework to include climate.',
      },
    ],
    writtenExplanationMd: 'The passage opens by stating the traditional view: collapse was blamed solely on invaders. The word "However" introduces the sediment core data from Lake Voulkaria, which showed a multi-century megadrought. The author uses this data to argue that environmental collapse destabilized the region, making raids secondary/opportunistic. Thus, the evidence is cited to show climatic factors were essential to the collapse. Correct Answer: B.',
  },

  // 11. Reading Comprehension Select-in-Passage (RC Select in Passage)
  {
    id: 'gre-q-11-rc-select-in-passage',
    questionType: 'gre_rc_select_in_passage',
    topicSlug: 'verbal-reading-comprehension',
    difficultyB: 1.1,
    passageMd: '[Sentence 1] For decades, historians attributed the abrupt decline of the Bronze Age Aegean civilizations solely to systemic invasions by maritime marauders known collectively as the Sea Peoples. [Sentence 2] However, recent sediment core analyses from Lake Voulkaria indicate a protracted multi-century megadrought beginning around 1200 BCE, coinciding precisely with widespread crop failures, urban abandonment, and synchronous palatial destructions. [Sentence 3] Rather than functioning as an autonomous primary catalyst of societal collapse, the maritime raids were more likely opportunistic incursions by populations already displaced by agricultural exhaustion and climate-induced regional destabilization.',
    promptMd: 'Select the sentence in the passage in which the author reinterprets the historical nature and motivation of the Sea Peoples\' attacks.',
    options: [
      { id: 'S1', text: '[Sentence 1]' },
      { id: 'S2', text: '[Sentence 2]' },
      { id: 'S3', text: '[Sentence 3]' },
    ],
    correctAnswers: ['S3'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'Find the sentence that directly addresses the motivation and role of the maritime raids / Sea Peoples.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'Sentence 1 presents the old belief. Sentence 2 describes lake sediments and drought. Sentence 3 provides the new interpretation of why and how they attacked.',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: 'Sentence 3 reinterprets the attacks as "opportunistic incursions by populations already displaced by agricultural exhaustion". Click Sentence 3.',
      },
    ],
    choiceExplanations: {
      S1: { is_correct: false, explanation_md: 'Sentence 1 only mentions the traditional attribution, not the author\'s reinterpretation.' },
      S2: { is_correct: false, explanation_md: 'Sentence 2 provides the geological and climatological data.' },
      S3: { is_correct: true, explanation_md: 'Sentence 3 reinterprets the raids as opportunistic incursions driven by displacement.' },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What is Sentence 1 doing?',
        options: ['Presenting the old consensus', 'Reinterpreting the motivation', 'Describing sediment cores'],
        correct_option_index: 0,
        takeaway_md: 'Sentence 1 describes what historians previously assumed.',
      },
      {
        step_index: 2,
        prompt_md: 'Where does the author specifically characterize the attacks as "opportunistic incursions by displaced populations"?',
        options: ['Sentence 3', 'Sentence 2', 'Sentence 1'],
        correct_option_index: 0,
        takeaway_md: 'Sentence 3 explicitly reframes the raids as opportunistic reactions to environmental hardship.',
      },
    ],
    writtenExplanationMd: 'Sentence 3 directly reframes the raids: "Rather than functioning as an autonomous primary catalyst... the maritime raids were more likely opportunistic incursions by populations already displaced..." This is the author\'s specific reinterpretation of the nature and motivation of the attacks. Correct Answer: Sentence 3.',
  },

  // 12. Analytical Writing: Issue Task (AWA Issue)
  {
    id: 'gre-q-12-awa-issue-ai-eval',
    questionType: 'gre_awa_issue',
    topicSlug: 'awa-analyze-an-issue',
    difficultyB: 0.0,
    promptMd: 'Governments should prioritize funding for scientific research that has immediate, tangible economic applications over research whose consequences are primarily theoretical.\n\nWrite a response in which you discuss the extent to which you agree or disagree with the recommendation and explain your reasoning for the position you take. In developing and supporting your position, describe specific circumstances in which adopting the recommendation would or would not be advantageous and explain how these considerations shape your position.',
    options: [],
    correctAnswers: ['awa_rubric_holistic_score_0_to_6'],
    hints: [
      {
        tier: 1,
        label: 'Concept Nudge',
        content_md: 'A high-scoring GRE Issue essay (5.0–6.0) avoids rigid binary thinking. Acknowledge the pragmatic appeal of applied research while championing the foundational necessity of theoretical inquiry.',
      },
      {
        tier: 2,
        label: 'Setup / Elimination',
        content_md: 'Cite landmark historical examples where pure theoretical science unexpectedly gave rise to multi-billion-dollar industries (e.g., Einstein\'s relativity enabling GPS, quantum mechanics enabling modern semiconductors, or Watson & Crick enabling mRNA vaccines).',
      },
      {
        tier: 3,
        label: 'Final Bridge',
        content_md: 'Address counterarguments: In developing nations or fiscal crises, immediate return on investment is crucial. Conclude with a balanced policy: a symbiotic funding portfolio.',
      },
    ],
    choiceExplanations: {
      awa_rubric: {
        is_correct: true,
        explanation_md: 'Graded holistically on a 0.0 to 6.0 scale evaluating: 1. Depth of analysis; 2. Persuasive examples; 3. Logical organization; 4. Varied sentence structure and elevated diction.',
      },
    },
    steps: [
      {
        step_index: 1,
        prompt_md: 'What thesis strategy achieves the highest score on GRE Issue prompts?',
        options: ['Qualified / Nuanced position with compelling counterpoint consideration', 'Extreme unconditional agreement', 'Neutral avoidance of any stance'],
        correct_option_index: 0,
        takeaway_md: 'ETS rewards nuanced positions that evaluate trade-offs and boundary conditions.',
      },
      {
        step_index: 2,
        prompt_md: 'Which historical example best illustrates the hazard of defunding pure theoretical science?',
        options: ['Quantum electrodynamics laying the groundwork for microprocessors and lasers', 'Building a municipal bridge', 'Local tax audits'],
        correct_option_index: 0,
        takeaway_md: 'Theoretical physics had zero immediate commercial use in 1920, yet powers the modern global computing economy.',
      },
    ],
    writtenExplanationMd: 'Master Essay Outline for Score 6.0:\n- Paragraph 1: Introduction with nuanced thesis. While applied research addresses acute societal crises, starving basic theoretical research cuts off the intellectual pipeline required for future revolutionary technologies.\n- Paragraph 2: Historical evidence. Quantum mechanics (Planck, Bohr) and General Relativity (Einstein) had no immediate economic applications when funded, yet they form the indispensable foundation of microprocessors and satellite navigation (GPS).\n- Paragraph 3: The flaw of short-sighted commercial metrics. Market forces naturally fund applied research with short-term ROI, meaning government funding is uniquely vital for basic theoretical science where private capital fears to tread.\n- Paragraph 4: Counterargument & Qualification. In times of acute emergency (e.g., pandemics, immediate energy collapse), prioritizing targeted applied research is warranted.\n- Paragraph 5: Conclusion. Propose a dual-tiered national research portfolio balancing immediate application with enduring theoretical exploration.',
  },
  {
  "id": "gre-q-13-qc-circle-tangent",
  "questionType": "gre_qc",
  "topicSlug": "geometry-coordinate-plane",
  "difficultyB": 0.6,
  "promptMd": "In the $xy$-coordinate plane, a circle centered at the origin $(0, 0)$ passes through the point $(3, 4)$. Line $L$ is tangent to the circle at the point $(3, 4)$.\n\nQuantity A: The slope of Line $L$\n\nQuantity B: $-\\frac{3}{4}$",
  "options": [
    {
      "id": "A",
      "text": "Quantity A is greater."
    },
    {
      "id": "B",
      "text": "Quantity B is greater."
    },
    {
      "id": "C",
      "text": "The two quantities are equal."
    },
    {
      "id": "D",
      "text": "The relationship cannot be determined from the information given."
    }
  ],
  "correctAnswers": [
    "C"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "A tangent line to a circle is always perpendicular to the radius drawn to the point of tangency."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "Calculate the slope of the radius connecting the origin $(0, 0)$ to $(3, 4)$: $m_{radius} = \\frac{4 - 0}{3 - 0} = \\frac{4}{3}$."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "Perpendicular lines have negative reciprocal slopes: $m_L = -\\frac{1}{m_{radius}} = -\\frac{3}{4}$. Quantity A equals Quantity B."
    }
  ],
  "choiceExplanations": {
    "A": {
      "is_correct": false,
      "explanation_md": "Confused the tangent slope with the radius slope itself ($\\frac{4}{3}$) or forgot the negative sign.",
      "trap_tag": "perpendicular_slope_sign_error",
      "trap_label": "Sign or Reciprocal Confusion"
    },
    "B": {
      "is_correct": false,
      "explanation_md": "Inverted the coordinates when calculating the radius slope as $\\frac{3}{4}$ instead of $\\frac{4}{3}$.",
      "trap_tag": "inverted_slope_coordinates",
      "trap_label": "Coordinate Inversion Trap"
    },
    "C": {
      "is_correct": true,
      "explanation_md": "The radius has slope $\\frac{4}{3}$. The tangent line is perpendicular, giving slope $-\\frac{3}{4}$. Both quantities are equal."
    },
    "D": {
      "is_correct": false,
      "explanation_md": "The center and tangency points are fixed, so the slope is uniquely determined.",
      "trap_tag": "false_indeterminacy",
      "trap_label": "Overestimating Indeterminacy"
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "What is the slope of the radial segment connecting $(0, 0)$ to the point of tangency $(3, 4)$?",
      "options": [
        "$\\frac{4}{3}$",
        "$\\frac{3}{4}$",
        "$-\\frac{4}{3}$"
      ],
      "correct_option_index": 0,
      "takeaway_md": "Slope = $\\frac{\\Delta y}{\\Delta x} = \\frac{4-0}{3-0} = \\frac{4}{3}$."
    },
    {
      "step_index": 2,
      "prompt_md": "What geometric relationship holds between a circle's tangent line and its radius at the point of tangency?",
      "options": [
        "They are parallel",
        "They are perpendicular ($90^\\circ$ angle)",
        "They intersect at $45^\\circ$"
      ],
      "correct_option_index": 1,
      "takeaway_md": "A tangent line is perpendicular to the radius at the point of tangency."
    },
    {
      "step_index": 3,
      "prompt_md": "What is the negative reciprocal of $\\frac{4}{3}$?",
      "options": [
        "$-\\frac{3}{4}$",
        "$\\frac{3}{4}$",
        "$-\\frac{4}{3}$"
      ],
      "correct_option_index": 0,
      "takeaway_md": "The perpendicular slope is $-\\frac{3}{4}$, which is identical to Quantity B."
    }
  ],
  "writtenExplanationMd": "Step 1: Find the slope of the radius connecting the origin $(0,0)$ and the point of contact $(3,4)$:\n$m_{\\text{radius}} = \\frac{4 - 0}{3 - 0} = \\frac{4}{3}$.\n\nStep 2: By circle geometry theorems, a tangent line is perpendicular to the radius at the point of tangency. Two perpendicular lines in a plane have slopes that multiply to $-1$ ($m_1 \\cdot m_2 = -1$).\n$m_L = -\\frac{1}{m_{\\text{radius}}} = -\\frac{1}{4/3} = -\\frac{3}{4}$.\n\nQuantity A is $-\\frac{3}{4}$, which is equal to Quantity B. Correct Answer: C."
},
  {
  "id": "gre-q-14-qc-prime-divisors",
  "questionType": "gre_qc",
  "topicSlug": "arithmetic-number-theory",
  "difficultyB": 0.8,
  "promptMd": "Let $n$ be an integer such that $n > 1$.\n\nQuantity A: The number of distinct prime factors of $n$\n\nQuantity B: The number of distinct prime factors of $n^3$",
  "options": [
    {
      "id": "A",
      "text": "Quantity A is greater."
    },
    {
      "id": "B",
      "text": "Quantity B is greater."
    },
    {
      "id": "C",
      "text": "The two quantities are equal."
    },
    {
      "id": "D",
      "text": "The relationship cannot be determined from the information given."
    }
  ],
  "correctAnswers": [
    "C"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "Consider the unique prime factorization theorem (Fundamental Theorem of Arithmetic) for an integer $n = p_1^{a_1} p_2^{a_2} \\cdots p_k^{a_k}$."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "When you cube $n$, $n^3 = p_1^{3a_1} p_2^{3a_2} \\cdots p_k^{3a_k}$. Examine whether the set of prime bases ${p_1, \\dots, p_k}$ changes."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "Cubing only triples the exponents; it does not add any new prime factors or eliminate any existing prime factors. Thus the count of distinct prime factors is identical."
    }
  ],
  "choiceExplanations": {
    "A": {
      "is_correct": false,
      "explanation_md": "Quantity A cannot exceed Quantity B because all prime factors of $n$ divide $n^3$.",
      "trap_tag": "impossible_reduction",
      "trap_label": "Logical Contradiction"
    },
    "B": {
      "is_correct": false,
      "explanation_md": "Confused the total number of divisors or total prime factors with *distinct* prime factors.",
      "trap_tag": "distinct_vs_total_divisors",
      "trap_label": "Distinct vs Total Factor Confusion"
    },
    "C": {
      "is_correct": true,
      "explanation_md": "Raising $n$ to any positive integer power $k$ preserves the exact same set of distinct prime bases. Both quantities equal $k$."
    },
    "D": {
      "is_correct": false,
      "explanation_md": "The equality holds for all integers $n > 1$, regardless of whether $n$ is prime, composite, even, or odd.",
      "trap_tag": "false_indeterminacy",
      "trap_label": "Overestimating Indeterminacy"
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "If $n = 12 = 2^2 \\times 3^1$, what are the distinct prime factors of $n$?",
      "options": [
        "{2, 3}",
        "{2, 4, 6, 12}",
        "{1, 2, 3}"
      ],
      "correct_option_index": 0,
      "takeaway_md": "The distinct prime factors are 2 and 3 (count = 2)."
    },
    {
      "step_index": 2,
      "prompt_md": "What is the prime factorization of $12^3$?",
      "options": [
        "$2^6 \\times 3^3$",
        "$2^2 \\times 3^3$",
        "$6^3$"
      ],
      "correct_option_index": 0,
      "takeaway_md": "$12^3 = (2^2 \\times 3^1)^3 = 2^6 \\times 3^3$. The distinct prime factors are still {2, 3}."
    },
    {
      "step_index": 3,
      "prompt_md": "Does raising any positive integer to the third power ever introduce new prime numbers?",
      "options": [
        "No, exponents change but the prime bases remain unchanged",
        "Yes, whenever $n$ is composite"
      ],
      "correct_option_index": 0,
      "takeaway_md": "Because prime bases never change upon exponentiation, Quantity A always equals Quantity B."
    }
  ],
  "writtenExplanationMd": "By the Fundamental Theorem of Arithmetic, any integer $n > 1$ can be expressed as a unique product of prime numbers:\n$n = p_1^{e_1} p_2^{e_2} \\dots p_k^{e_k}$, where each $p_i$ is a distinct prime factor. The number of distinct prime factors of $n$ is $k$.\n\nWhen we cube $n$, we obtain:\n$n^3 = (p_1^{e_1} p_2^{e_2} \\dots p_k^{e_k})^3 = p_1^{3e_1} p_2^{3e_2} \\dots p_k^{3e_k}$.\n\nThe exponents of each prime factor triple, but the set of distinct prime bases remains strictly ${p_1, p_2, \\dots, p_k}$. No new prime factors are created, and none are removed. Therefore, the number of distinct prime factors of $n^3$ is also $k$.\n\nQuantity A = Quantity B. Correct Answer: C."
},
  {
  "id": "gre-q-15-numeric-combinations",
  "questionType": "gre_numeric_single",
  "topicSlug": "data-combinatorics",
  "difficultyB": 0.5,
  "promptMd": "A university debate society has $7$ senior members and $5$ junior members. A delegations committee of $4$ members must be formed such that it contains at least $2$ senior members and at least $1$ junior member. How many distinct such committees can be formed?",
  "options": [],
  "correctAnswers": [
    "385"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "Break the problem down into mutually exclusive cases that satisfy both constraints: at least 2 seniors and at least 1 junior in a 4-person committee."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "The only two committee configurations are: Case 1: 2 seniors and 2 juniors; Case 2: 3 seniors and 1 junior. (4 seniors would violate the \"at least 1 junior\" rule)."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "Use combinations $\\binom{n}{r}$: Case 1 = $\\binom{7}{2} \\times \\binom{5}{2} = 21 \\times 10 = 210$. Case 2 = $\\binom{7}{3} \\times \\binom{5}{1} = 35 \\times 5 = 175$. Sum the cases: $210 + 175 = 385$."
    }
  ],
  "choiceExplanations": {
    "numeric": {
      "is_correct": true,
      "explanation_md": "Case 1 (2 Seniors, 2 Juniors) = 210; Case 2 (3 Seniors, 1 Junior) = 175. Total = 385."
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "What are the valid combinations of (Seniors, Juniors) that total 4 members?",
      "options": [
        "(2 Seniors, 2 Juniors) and (3 Seniors, 1 Junior)",
        "(2 Seniors, 2 Juniors) only",
        "(1 Senior, 3 Juniors) and (2 Seniors, 2 Juniors)"
      ],
      "correct_option_index": 0,
      "takeaway_md": "Only (2, 2) and (3, 1) satisfy both \"at least 2 seniors\" and \"at least 1 junior\"."
    },
    {
      "step_index": 2,
      "prompt_md": "What is $\\binom{7}{2} \\times \\binom{5}{2}$ for Case 1?",
      "options": [
        "210",
        "140",
        "105"
      ],
      "correct_option_index": 0,
      "takeaway_md": "$\\binom{7}{2} = 21$ and $\\binom{5}{2} = 10$, so $21 \\times 10 = 210$."
    },
    {
      "step_index": 3,
      "prompt_md": "What is $\\binom{7}{3} \\times \\binom{5}{1}$ for Case 2, and the final sum?",
      "options": [
        "175, total = 385",
        "140, total = 350",
        "210, total = 420"
      ],
      "correct_option_index": 0,
      "takeaway_md": "$\\binom{7}{3} = 35$ and $\\binom{5}{1} = 5$; $35 \\times 5 = 175$. Sum = $210 + 175 = 385$."
    }
  ],
  "writtenExplanationMd": "Step 1: Identify all valid compositions for a 4-person committee requiring at least 2 seniors and at least 1 junior:\n- Composition A: 2 Seniors and 2 Juniors\n- Composition B: 3 Seniors and 1 Junior\n(Note: 4 Seniors violates the junior requirement; 1 Senior violates the senior requirement).\n\nStep 2: Calculate combinations for Composition A:\nWays to choose 2 seniors from 7: $\\binom{7}{2} = \\frac{7 \\times 6}{2 \\times 1} = 21$.\nWays to choose 2 juniors from 5: $\\binom{5}{2} = \\frac{5 \\times 4}{2 \\times 1} = 10$.\nSubtotal A = $21 \\times 10 = 210$.\n\nStep 3: Calculate combinations for Composition B:\nWays to choose 3 seniors from 7: $\\binom{7}{3} = \\frac{7 \\times 6 \\times 5}{3 \\times 2 \\times 1} = 35$.\nWays to choose 1 junior from 5: $\\binom{5}{1} = 5$.\nSubtotal B = $35 \\times 5 = 175$.\n\nStep 4: Sum the disjoint cases:\nTotal possible committees = $210 + 175 = 385$."
},
  {
  "id": "gre-q-16-numeric-mixture-fraction",
  "questionType": "gre_numeric_fraction",
  "topicSlug": "arithmetic-ratios-mixtures",
  "difficultyB": 0.7,
  "promptMd": "Container X contains a solution that is $\\frac{1}{4}$ acid by volume, and Container Y contains a solution that is $\\frac{2}{5}$ acid by volume. If equal volumes of the solutions from Container X and Container Y are mixed together, what fraction of the resulting mixture is acid? (Enter your answer as a fraction in simplest form, e.g. numerator / denominator).",
  "options": [],
  "correctAnswers": [
    "13/40"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "Since equal volumes are mixed, pick a convenient smart number for the volume taken from each container, such as 20 or 1 unit."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "If we take $V = 1$ liter from each container, the total volume is $1 + 1 = 2$ liters. The total acid is $\\frac{1}{4} + \\frac{2}{5}$ liters."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "Find a common denominator: $\\frac{1}{4} + \\frac{2}{5} = \\frac{5}{20} + \\frac{8}{20} = \\frac{13}{20}$. Divide by total volume $2$: $\\frac{13/20}{2} = \\frac{13}{40}$."
    }
  ],
  "choiceExplanations": {
    "numeric": {
      "is_correct": true,
      "explanation_md": "Total acid = 1/4 + 2/5 = 13/20. Total volume = 2. Fraction of acid in mixture = (13/20) / 2 = 13/40."
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "If 20 liters of solution are taken from Container X and 20 liters from Container Y, how much acid is in each?",
      "options": [
        "5 liters from X, 8 liters from Y",
        "4 liters from X, 5 liters from Y",
        "10 liters from each"
      ],
      "correct_option_index": 0,
      "takeaway_md": "Container X has $\\frac{1}{4}(20) = 5$ L; Container Y has $\\frac{2}{5}(20) = 8$ L."
    },
    {
      "step_index": 2,
      "prompt_md": "What is the total acid and the total volume of the combined mixture?",
      "options": [
        "13 liters of acid in 40 liters total",
        "13 liters of acid in 20 liters total",
        "10 liters of acid in 40 liters total"
      ],
      "correct_option_index": 0,
      "takeaway_md": "Total acid = $5 + 8 = 13$ liters; total mixture = $20 + 20 = 40$ liters."
    },
    {
      "step_index": 3,
      "prompt_md": "What is the fraction of acid in the final solution?",
      "options": [
        "$\\frac{13}{40}$",
        "$\\frac{3}{9}$",
        "$\\frac{13}{20}$"
      ],
      "correct_option_index": 0,
      "takeaway_md": "Fraction of acid = $\\frac{13}{40}$."
    }
  ],
  "writtenExplanationMd": "Method 1 (Smart Numbers):\nLet the volume taken from each container be 20 liters (the LCM of the denominators 4 and 5).\n- Acid from Container X: $\\frac{1}{4} \\times 20 = 5$ liters.\n- Acid from Container Y: $\\frac{2}{5} \\times 20 = 8$ liters.\n- Total acid = $5 + 8 = 13$ liters.\n- Total volume of the mixture = $20 + 20 = 40$ liters.\n- Fraction of acid in the mixture = $\\frac{13}{40}$.\n\nMethod 2 (Algebraic Fraction Average):\nWhen equal volumes $V$ are combined, the resulting concentration is the arithmetic mean of the two concentrations:\n$\\text{Concentration} = \\frac{\\frac{1}{4} + \\frac{2}{5}}{2} = \\frac{\\frac{5 + 8}{20}}{2} = \\frac{13}{40}$. Correct Answer: 13/40."
},
  {
  "id": "gre-q-17-tc1-scientific-orthodoxy",
  "questionType": "gre_tc_1",
  "topicSlug": "verbal-tc-single",
  "difficultyB": 0.4,
  "promptMd": "Rather than adhering to established dogma, the experimentalist pursued an approach so radically independent that contemporaries initially regarded her theoretical framework as entirely (i)________.",
  "options": [
    {
      "id": "A",
      "text": "derivative"
    },
    {
      "id": "B",
      "text": "heterodox"
    },
    {
      "id": "C",
      "text": "pedestrian"
    },
    {
      "id": "D",
      "text": "conventional"
    },
    {
      "id": "E",
      "text": "pellucid"
    }
  ],
  "correctAnswers": [
    "B"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "Identify the structural contrast trigger: \"Rather than adhering to established dogma\". The blank must contrast with accepted dogma."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "\"Derivative\", \"pedestrian\", and \"conventional\" all align with ordinary or established orthodoxies, which contradicts the prompt's emphasis on \"radically independent\"."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "\"Heterodox\" means holding beliefs that deviate from accepted standards or orthodoxy, perfectly fitting the clue."
    }
  ],
  "choiceExplanations": {
    "A": {
      "is_correct": false,
      "explanation_md": "\"Derivative\" means unoriginal or copied, directly conflicting with \"radically independent\".",
      "trap_tag": "direct_opposite",
      "trap_label": "Direct Antonym Trap"
    },
    "B": {
      "is_correct": true,
      "explanation_md": "\"Heterodox\" (deviating from established dogma or orthodox beliefs) perfectly matches the contrast trigger \"Rather than adhering to established dogma\"."
    },
    "C": {
      "is_correct": false,
      "explanation_md": "\"Pedestrian\" means dull, ordinary, or uninspired, contradicting her bold departure from dogma.",
      "trap_tag": "negative_valence_misalignment",
      "trap_label": "Wrong Connotation Trap"
    },
    "D": {
      "is_correct": false,
      "explanation_md": "\"Conventional\" is the exact opposite of what the sentence describes (\"radically independent\").",
      "trap_tag": "direct_opposite",
      "trap_label": "Opposite of Clue Trap"
    },
    "E": {
      "is_correct": false,
      "explanation_md": "\"Pellucid\" means transparently clear, which does not address adherence to or deviation from dogma.",
      "trap_tag": "irrelevant_positive",
      "trap_label": "Off-Topic Vocabulary Trap"
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "What is the primary pivot phrase indicating the relationship between the blank and established dogma?",
      "options": [
        "\"Rather than adhering to established dogma\"",
        "\"contemporaries initially\"",
        "\"the experimentalist\""
      ],
      "correct_option_index": 0,
      "takeaway_md": "\"Rather than\" establishes an explicit contrast between established dogma and her framework."
    },
    {
      "step_index": 2,
      "prompt_md": "What charge and meaning must the missing word carry?",
      "options": [
        "Unorthodox, non-traditional, dissenting from standard doctrine",
        "Boring, derivative, commonplace",
        "Clear and easy to understand"
      ],
      "correct_option_index": 0,
      "takeaway_md": "The word must mean contrary to established orthodoxy (hetero- = other, doxa = opinion)."
    },
    {
      "step_index": 3,
      "prompt_md": "Which choice means unorthodox or deviating from accepted doctrine?",
      "options": [
        "heterodox",
        "derivative",
        "conventional"
      ],
      "correct_option_index": 0,
      "takeaway_md": "\"Heterodox\" directly denotes deviation from established dogma."
    }
  ],
  "verbalDeconstructor": {
    "trigger_words": [
      {
        "word": "Rather than adhering to",
        "category": "contrast",
        "note": "Signals departure from standard scientific dogma"
      },
      {
        "word": "radically independent",
        "category": "support",
        "note": "Reinforces non-conformist orientation"
      }
    ],
    "blank_charges": [
      {
        "blank_index": 1,
        "charge": "-",
        "rationale": "Must mean unorthodox or contrary to dogma"
      }
    ],
    "prediction_guide_md": "Predict: unorthodox, dissenting, nonconformist."
  },
  "writtenExplanationMd": "Step 1: Identify sentence mechanics and pivot.\nThe sentence opens with the contrastive phrase \"Rather than adhering to established dogma\", signaling that the scientist rejected traditional orthodoxy in favor of a \"radically independent\" approach.\n\nStep 2: Predict the blank.\nHer peers would view a framework that completely diverges from accepted dogma as unconventional, dissenting, or unorthodox.\n\nStep 3: Evaluate choices.\n- (A) derivative: unoriginal; opposite of independent.\n- (B) heterodox: not conforming with accepted or orthodox standards or dogma. Perfect fit.\n- (C) pedestrian: dull or uninspired; incorrect.\n- (D) conventional: conforming to dogma; exact opposite.\n- (E) pellucid: lucid or clear; unrelated.\n\nCorrect Answer: B (heterodox)."
},
  {
  "id": "gre-q-18-tc2-political-rhetoric",
  "questionType": "gre_tc_2",
  "topicSlug": "verbal-tc-double",
  "difficultyB": 0.9,
  "promptMd": "Although the campaign spokesperson insisted that the candidate was fundamentally (i)________ and beholden to no special interests, the leaked briefing memoranda demonstrated an acute willingness to compromise core principles for financial patronage, revealing an operative who was thoroughly (ii)________.",
  "options": [
    {
      "id": "A",
      "text": "uncompromising"
    },
    {
      "id": "B",
      "text": "venal"
    },
    {
      "id": "C",
      "text": "inexperienced"
    },
    {
      "id": "D",
      "text": "mercenary"
    },
    {
      "id": "E",
      "text": "diffident"
    },
    {
      "id": "F",
      "text": "altruistic"
    }
  ],
  "correctAnswers": [
    "A",
    "D"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "Notice the contrast trigger \"Although\" at the start. Blank (i) reflects the spokesperson's idealistic claim, while Blank (ii) reflects the reality revealed by the leaked memos."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "Blank (i) is paired with \"beholden to no special interests\", meaning principled and incorruptible. Blank (ii) describes someone willing to \"compromise core principles for financial patronage\"."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "For Blank (i), \"uncompromising\" fits being beholden to no one. For Blank (ii), \"mercenary\" directly means motivated solely by financial gain."
    }
  ],
  "choiceExplanations": {
    "A": {
      "is_correct": true,
      "explanation_md": "\"Uncompromising\" pairs with \"beholden to no special interests\", reflecting the spokesperson's claim of unyielding integrity."
    },
    "B": {
      "is_correct": false,
      "explanation_md": "\"Venal\" means corruptible for money; this is the reality revealed in the second half, not the claim.",
      "trap_tag": "premature_reality_insertion",
      "trap_label": "Wrong Half of Contrast"
    },
    "C": {
      "is_correct": false,
      "explanation_md": "\"Inexperienced\" has no contextual support regarding integrity or financial independence.",
      "trap_tag": "unsupported_attribute",
      "trap_label": "Off-Topic Attribute Trap"
    },
    "D": {
      "is_correct": true,
      "explanation_md": "\"Mercenary\" denotes an individual solely interested in money and material gain at the expense of ethics, matching \"financial patronage\"."
    },
    "E": {
      "is_correct": false,
      "explanation_md": "\"Diffident\" means shy or lacking confidence, which does not describe financial opportunism.",
      "trap_tag": "personality_misalignment",
      "trap_label": "Irrelevant Trait Trap"
    },
    "F": {
      "is_correct": false,
      "explanation_md": "\"Altruistic\" means selfless, the direct opposite of compromising principles for financial patronage.",
      "trap_tag": "direct_opposite",
      "trap_label": "Direct Antonym Trap"
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "What does the contrast marker \"Although\" set up between the two clauses?",
      "options": [
        "A contrast between the spokesperson's stated claim and the corrupt reality",
        "A parallel relationship where both blanks have identical meaning",
        "A cause-and-effect timeline"
      ],
      "correct_option_index": 0,
      "takeaway_md": "\"Although\" creates a sharp divergence between public image and secret compromise."
    },
    {
      "step_index": 2,
      "prompt_md": "What clue in Clause 1 defines Blank (i)?",
      "options": [
        "\"beholden to no special interests\"",
        "\"leaked briefing memoranda\"",
        "\"campaign spokesperson\""
      ],
      "correct_option_index": 0,
      "takeaway_md": "Blank (i) must reflect independence from external leverage: \"uncompromising\"."
    },
    {
      "step_index": 3,
      "prompt_md": "What clue in Clause 2 defines Blank (ii)?",
      "options": [
        "\"willingness to compromise core principles for financial patronage\"",
        "\"campaign spokesperson insisted\"",
        "\"acute willingness\""
      ],
      "correct_option_index": 0,
      "takeaway_md": "Trading principles for financial patronage defines a \"mercenary\" operative."
    }
  ],
  "verbalDeconstructor": {
    "trigger_words": [
      {
        "word": "Although",
        "category": "contrast",
        "note": "Sets up sharp divergence between public image and secret compromise"
      },
      {
        "word": "beholden to no special interests",
        "category": "support",
        "note": "Clue indicating principled independence for Blank (i)"
      },
      {
        "word": "compromise core principles for financial patronage",
        "category": "support",
        "note": "Clue establishing mercenary opportunism for Blank (ii)"
      }
    ],
    "blank_charges": [
      {
        "blank_index": 1,
        "charge": "+",
        "rationale": "Must mean principled, unyielding, or incorruptible"
      },
      {
        "blank_index": 2,
        "charge": "-",
        "rationale": "Must denote an operative motivated strictly by money or venality"
      }
    ],
    "prediction_guide_md": "Blank 1: uncompromising/independent. Blank 2: mercenary/venal."
  },
  "writtenExplanationMd": "Step 1: Structural Analysis.\nThe concessive conjunction \"Although\" creates a contrast between the public claim made by the spokesperson and the clandestine reality revealed by the leaked documents.\n\nStep 2: Blank (i) Analysis.\nThe clue \"beholden to no special interests\" describes an incorruptible, principled candidate. Among the options:\n- (A) uncompromising (inflexible, principled) fits.\n- (B) venal (open to bribery) is what the leak shows, not what the spokesperson claimed.\n- (C) inexperienced is irrelevant.\n\nStep 3: Blank (ii) Analysis.\nThe clue describes someone with \"an acute willingness to compromise core principles for financial patronage\". This denotes a person motivated strictly by financial gain.\n- (D) mercenary (primarily concerned with making money at the expense of ethics) fits.\n- (E) diffident (shy) is unrelated.\n- (F) altruistic (unselfish) is the antonym.\n\nCorrect Answers: A (uncompromising) and D (mercenary)."
},
  {
  "id": "gre-q-19-tc3-historical-narrative",
  "questionType": "gre_tc_3",
  "topicSlug": "verbal-tc-triple",
  "difficultyB": 1.2,
  "promptMd": "Far from being a period of (i)________ intellectual quiescence, the so-called Dark Ages witnessed a (ii)________ of regional artisanal traditions and monastic scholarship that laid the indispensable groundwork for the (iii)________ flowering of the High Renaissance.",
  "options": [
    {
      "id": "A",
      "text": "uniform"
    },
    {
      "id": "B",
      "text": "productive"
    },
    {
      "id": "C",
      "text": "turbulent"
    },
    {
      "id": "D",
      "text": "cessation"
    },
    {
      "id": "E",
      "text": "proliferation"
    },
    {
      "id": "F",
      "text": "subjugation"
    },
    {
      "id": "G",
      "text": "ephemeral"
    },
    {
      "id": "H",
      "text": "subsequent"
    },
    {
      "id": "I",
      "text": "archaic"
    }
  ],
  "correctAnswers": [
    "A",
    "E",
    "H"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "\"Far from being...\" sets up a refutation of the traditional myth that the Dark Ages were completely stagnant or dormant everywhere."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "Blank (i) qualifies \"intellectual quiescence\" (myth of unvarying inactivity). Blank (ii) must show that traditions were actively flourishing. Blank (iii) captures the temporal relationship to the Renaissance that came later."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "Select \"uniform\" for Blank (i) (it was not unvaryingly quiet); \"proliferation\" for Blank (ii) (rapid spread/growth); and \"subsequent\" for Blank (iii) (later chronological blossoming)."
    }
  ],
  "choiceExplanations": {
    "A": {
      "is_correct": true,
      "explanation_md": "\"Uniform\" modifies \"intellectual quiescence\", describing the myth that the era was uniformly/unvaryingly stagnant."
    },
    "B": {
      "is_correct": false,
      "explanation_md": "\"Productive\" contradicts \"quiescence\" (inactivity).",
      "trap_tag": "internal_contradiction",
      "trap_label": "Oxymoronic Pairing Trap"
    },
    "C": {
      "is_correct": false,
      "explanation_md": "\"Turbulent\" describes violent unrest, which clashes with \"quiescence\" (stillness).",
      "trap_tag": "semantic_clash",
      "trap_label": "Clashing Descriptors Trap"
    },
    "D": {
      "is_correct": false,
      "explanation_md": "\"Cessation\" means stopping, which contradicts the clause stating it laid groundwork for future flowering.",
      "trap_tag": "direct_opposite",
      "trap_label": "Contradicts Clause Outcome"
    },
    "E": {
      "is_correct": true,
      "explanation_md": "\"Proliferation\" means rapid expansion or multiplication of traditions, providing the foundation for future developments."
    },
    "F": {
      "is_correct": false,
      "explanation_md": "\"Subjugation\" means defeat or enslavement, which does not foster scholarship.",
      "trap_tag": "negative_valence_mismatch",
      "trap_label": "Incompatible Valence Trap"
    },
    "G": {
      "is_correct": false,
      "explanation_md": "\"Ephemeral\" means short-lived, which does not describe the monumental High Renaissance.",
      "trap_tag": "factually_absurd",
      "trap_label": "Historical Mischaracterization"
    },
    "H": {
      "is_correct": true,
      "explanation_md": "\"Subsequent\" denotes occurring chronologically later, accurately placing the High Renaissance after the medieval period."
    },
    "I": {
      "is_correct": false,
      "explanation_md": "\"Archaic\" means ancient and obsolete, which misrepresents the Renaissance relative to its medieval precursors.",
      "trap_tag": "anachronistic_choice",
      "trap_label": "Temporal Confusion Trap"
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "What traditional stereotype of the \"Dark Ages\" does the opening phrase \"Far from being...\" reject?",
      "options": [
        "That it was an unbroken, uniform period of intellectual stillness",
        "That it was an era of excessive artistic creation",
        "That it had too many universities"
      ],
      "correct_option_index": 0,
      "takeaway_md": "\"Far from being a period of [uniform] quiescence\" refutes total stagnation."
    },
    {
      "step_index": 2,
      "prompt_md": "What did the era actually witness regarding artisanal traditions and scholarship?",
      "options": [
        "A proliferation (flourishing/growth)",
        "A cessation (halting)",
        "A subjugation (conquest)"
      ],
      "correct_option_index": 0,
      "takeaway_md": "The phrase \"laid the indispensable groundwork\" requires an active, flourishing surge: \"proliferation\"."
    },
    {
      "step_index": 3,
      "prompt_md": "What word correctly establishes the chronological relationship of the High Renaissance following this period?",
      "options": [
        "subsequent",
        "ephemeral",
        "archaic"
      ],
      "correct_option_index": 0,
      "takeaway_md": "The High Renaissance occurred afterwards, making it the \"subsequent\" flowering."
    }
  ],
  "verbalDeconstructor": {
    "trigger_words": [
      {
        "word": "Far from being",
        "category": "contrast",
        "note": "Refutes the traditional myth that the Dark Ages were completely dormant"
      },
      {
        "word": "laid the indispensable groundwork for",
        "category": "support",
        "note": "Indicates active cultural flourishing that prepared later achievements"
      }
    ],
    "blank_charges": [
      {
        "blank_index": 1,
        "charge": "-",
        "rationale": "Modifies quiescence to reflect the refuted myth of total/uniform stagnation"
      },
      {
        "blank_index": 2,
        "charge": "+",
        "rationale": "Requires an active surge or multiplication of traditions (proliferation)"
      },
      {
        "blank_index": 3,
        "charge": "neutral",
        "rationale": "Chronological term indicating the Renaissance that came afterwards (subsequent)"
      }
    ],
    "prediction_guide_md": "Blank 1: uniform/unbroken. Blank 2: proliferation/flourishing. Blank 3: subsequent/following."
  },
  "writtenExplanationMd": "Step 1: Blank (i) Analysis.\n\"Far from being a period of (i)______ intellectual quiescence\" challenges the traditional historiographical view of the Dark Ages as total, monolithic dormancy. \"Uniform\" (unvarying, homogenous) correctly qualifies quiescence.\n\nStep 2: Blank (ii) Analysis.\nThe sentence asserts that the era actually generated rich artisanal traditions and monastic scholarship that \"laid the indispensable groundwork\" for later cultural triumphs. This requires a positive term denoting flourishing or multiplication: \"proliferation\" (rapid increase in numbers or growth).\n\nStep 3: Blank (iii) Analysis.\nChronologically, the medieval developments preceded the High Renaissance. The Renaissance was the \"subsequent\" (following in time or order) flowering.\n\nCorrect Answers: A (uniform), E (proliferation), and H (subsequent)."
},
  {
  "id": "gre-q-20-se-economic-volatility",
  "questionType": "gre_se",
  "topicSlug": "verbal-se",
  "difficultyB": 0.65,
  "promptMd": "In the wake of acute supply disruptions, the export-oriented economy demonstrated remarkable ________, regaining its pre-crisis industrial output within a single quarter.",
  "options": [
    {
      "id": "A",
      "text": "resilience"
    },
    {
      "id": "B",
      "text": "buoyancy"
    },
    {
      "id": "C",
      "text": "fragility"
    },
    {
      "id": "D",
      "text": "lethargy"
    },
    {
      "id": "E",
      "text": "intransigence"
    },
    {
      "id": "F",
      "text": "stagnation"
    }
  ],
  "correctAnswers": [
    "A",
    "B"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "Look at the sentence outcome: \"regaining its pre-crisis industrial output within a single quarter\". This demonstrates quick recovery after a blow."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "We need two words that mean the capacity to bounce back, withstand shocks, or recover rapidly."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "\"Resilience\" (ability to bounce back from distress) and \"buoyancy\" (ability to float or recover quickly) produce two coherent sentences with equivalent meaning."
    }
  ],
  "choiceExplanations": {
    "A": {
      "is_correct": true,
      "explanation_md": "\"Resilience\" directly denotes the ability of an entity to withstand adversity and recover its original shape or capacity quickly."
    },
    "B": {
      "is_correct": true,
      "explanation_md": "\"Buoyancy\" in an economic context describes the ability of a market or economy to recover resilience and stay afloat after shocks."
    },
    "C": {
      "is_correct": false,
      "explanation_md": "\"Fragility\" means vulnerability to breaking, opposite to regaining output in a single quarter.",
      "trap_tag": "direct_opposite",
      "trap_label": "Direct Antonym Trap"
    },
    "D": {
      "is_correct": false,
      "explanation_md": "\"Lethargy\" means sluggishness or lack of energy, which contradicts rapid industrial recovery.",
      "trap_tag": "semantic_opposite",
      "trap_label": "Sluggishness Trap"
    },
    "E": {
      "is_correct": false,
      "explanation_md": "\"Intransigence\" means stubborn refusal to compromise, which does not apply to economic recovery mechanisms.",
      "trap_tag": "category_error",
      "trap_label": "Mismatched Category Trap"
    },
    "F": {
      "is_correct": false,
      "explanation_md": "\"Stagnation\" means lack of activity or growth, directly contradicted by the sentence.",
      "trap_tag": "direct_opposite",
      "trap_label": "Opposite State Trap"
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "What factual clue describes what the economy achieved after the disruption?",
      "options": [
        "\"regaining its pre-crisis industrial output within a single quarter\"",
        "\"acute supply disruptions\"",
        "\"export-oriented economy\""
      ],
      "correct_option_index": 0,
      "takeaway_md": "Quickly bouncing back from a shock demonstrates elasticity and recovery."
    },
    {
      "step_index": 2,
      "prompt_md": "Which two words in the list share the meaning of bouncing back or recovering vigor after distress?",
      "options": [
        "resilience and buoyancy",
        "fragility and stagnation",
        "lethargy and intransigence"
      ],
      "correct_option_index": 0,
      "takeaway_md": "\"Resilience\" and \"buoyancy\" form an exact synonym pair in this economic context."
    }
  ],
  "verbalDeconstructor": {
    "trigger_words": [
      {
        "word": "In the wake of acute supply disruptions",
        "category": "condition",
        "note": "Establishes a severe external shock"
      },
      {
        "word": "regaining its pre-crisis industrial output within a single quarter",
        "category": "support",
        "note": "Demonstrates rapid bounce-back and economic elasticity"
      }
    ],
    "blank_charges": [
      {
        "blank_index": 1,
        "charge": "+",
        "rationale": "Requires words denoting elasticity, bounce-back, or resilience"
      }
    ],
    "prediction_guide_md": "Predict: resilience, elasticity, buoyancy."
  },
  "writtenExplanationMd": "Sentence Equivalence Strategy:\n1. Identify the clue: The economy regained \"its pre-crisis industrial output within a single quarter\" despite \"acute supply disruptions\".\n2. Predict the target concept: Elasticity, quick recovery, ability to bounce back from adversity.\n3. Evaluate the choices for a matching synonym pair:\n- (A) resilience: capacity to recover quickly from difficulties. (Match)\n- (B) buoyancy: ability to bounce back, remain cheerful or resilient. (Match)\n- (C) fragility: easily broken. (Antonym)\n- (D) lethargy: sluggishness. (Antonym)\n- (E) intransigence: stubbornness. (Unrelated)\n- (F) stagnation: motionless inactivity. (Antonym)\n\nBoth \"resilience\" and \"buoyancy\" complete the sentence with equivalent meaning. Correct Answers: A and B."
},
  {
  "id": "gre-q-21-se-diplomatic-candor",
  "questionType": "gre_se",
  "topicSlug": "verbal-se",
  "difficultyB": 0.75,
  "promptMd": "Weary of the perpetual prevarication and evasive communiqués of prior envoys, the delegation welcomed the new ambassador's ________, which allowed contentious territorial negotiations to proceed without deceit.",
  "options": [
    {
      "id": "A",
      "text": "veracity"
    },
    {
      "id": "B",
      "text": "candor"
    },
    {
      "id": "C",
      "text": "mendacity"
    },
    {
      "id": "D",
      "text": "subterfuge"
    },
    {
      "id": "E",
      "text": "artifice"
    },
    {
      "id": "F",
      "text": "forthrightness"
    }
  ],
  "correctAnswers": [
    "B",
    "F"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "Contrast the ambassador's trait with \"perpetual prevarication and evasive communiqués\", and note the outcome: negotiations proceeded \"without deceit\"."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "The blank requires words meaning frankness, unreserved openness, and direct truthfulness."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "\"Candor\" and \"forthrightness\" both mean the quality of being open, honest, and direct in speech, creating an exact pair."
    }
  ],
  "choiceExplanations": {
    "A": {
      "is_correct": false,
      "explanation_md": "\"Veracity\" means habitual truthfulness or accuracy, but lacks the specific paired nuance of outspoken directness/frankness that \"candor\" and \"forthrightness\" share.",
      "trap_tag": "partial_synonym_unpaired",
      "trap_label": "Unpaired Synonym Trap"
    },
    "B": {
      "is_correct": true,
      "explanation_md": "\"Candor\" means the quality of being open, sincere, and honest in expression, directly contrasting with \"evasive communiqués\"."
    },
    "C": {
      "is_correct": false,
      "explanation_md": "\"Mendacity\" means untruthfulness, which describes the previous envoys, not the welcomed new ambassador.",
      "trap_tag": "direct_opposite",
      "trap_label": "Direct Antonym Trap"
    },
    "D": {
      "is_correct": false,
      "explanation_md": "\"Subterfuge\" means deceit used to achieve one's goal, the exact opposite of \"without deceit\".",
      "trap_tag": "direct_opposite",
      "trap_label": "Opposite of Clue Trap"
    },
    "E": {
      "is_correct": false,
      "explanation_md": "\"Artifice\" means clever or cunning devices used to trick others, opposite to the text.",
      "trap_tag": "direct_opposite",
      "trap_label": "Trickery Trap"
    },
    "F": {
      "is_correct": true,
      "explanation_md": "\"Forthrightness\" means directness and honesty in manner and speech, pairing with \"candor\"."
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "What behavior of prior envoys made the delegation weary?",
      "options": [
        "\"perpetual prevarication and evasive communiqués\"",
        "\"territorial negotiations\"",
        "\"contentious issues\""
      ],
      "correct_option_index": 0,
      "takeaway_md": "Prevarication means lying/quibbling; evasive means noncommittal."
    },
    {
      "step_index": 2,
      "prompt_md": "What quality allows negotiations to proceed \"without deceit\"?",
      "options": [
        "Openness, frankness, and directness",
        "Secretiveness and subterfuge",
        "Careful procrastination"
      ],
      "correct_option_index": 0,
      "takeaway_md": "The blank must denote straightforward frankness."
    },
    {
      "step_index": 3,
      "prompt_md": "Which two choices produce equivalent, idiomatic sentences denoting frank honesty?",
      "options": [
        "candor and forthrightness",
        "mendacity and subterfuge",
        "veracity and artifice"
      ],
      "correct_option_index": 0,
      "takeaway_md": "\"Candor\" and \"forthrightness\" provide the exact matching meaning."
    }
  ],
  "verbalDeconstructor": {
    "trigger_words": [
      {
        "word": "Weary of the perpetual prevarication and evasive communiqués",
        "category": "contrast",
        "note": "Rebuffs deceit and dishonesty of earlier envoys"
      },
      {
        "word": "without deceit",
        "category": "support",
        "note": "Direct clue requiring blunt truthfulness and frank candor"
      }
    ],
    "blank_charges": [
      {
        "blank_index": 1,
        "charge": "+",
        "rationale": "Requires words denoting frank, straightforward honesty (candor/forthrightness)"
      }
    ],
    "prediction_guide_md": "Predict: candor, forthrightness, frankness."
  },
  "writtenExplanationMd": "Sentence Equivalence Strategy:\n1. Clues in the sentence: The delegation was tired of \"perpetual prevarication\" (lying or evading the truth) and \"evasive communiqués\". The new ambassador's trait enabled negotiations to occur \"without deceit\".\n2. Target meaning: Frankness, blunt honesty, straightforward openness.\n3. Pair analysis:\n- (B) candor (unreserved, honest, or sincere expression) and (F) forthrightness (directness, frankness) form a precise semantic pair that produces equivalent sentences.\n- (A) veracity means truthfulness or accuracy, but lacks the specific nuance of blunt openness present in candor and forthrightness.\n- (C) mendacity, (D) subterfuge, and (E) artifice all denote deception and falsehood, which are the opposites of the target meaning.\n\nCorrect Answers: B (candor) and F (forthrightness)."
},
  {
  "id": "gre-q-22-rc-dark-matter",
  "questionType": "gre_rc_single",
  "topicSlug": "verbal-rc-science",
  "difficultyB": 0.85,
  "promptMd": "The passage suggests which of the following regarding hydrothermal vent ecosystems?",
  "passageMd": "Until the late 1970s, marine biology operated under the fundamental paradigm that all abyssal benthic ecosystems depended strictly on photosynthetic organic matter drifting down from sunlit pelagic waters. The discovery of hydrothermal vent communities along the Galapagos Rift shattered this dogma. In the complete absence of sunlight and under crushing hydrostatic pressure, dense colonies of giant tube worms and vent clams flourished on primary production driven entirely by chemoautotrophic bacteria. These extremophiles oxidize toxic hydrogen sulfide surging from volcanic fissures, converting geothermal chemical energy into biomass. Consequently, these abyssal oases operate independently of solar influx, suggesting that planetary bodies with subsurface oceans, such as Jupiter's moon Europa, could host self-sustaining ecosystems despite lacking solar radiation.",
  "options": [
    {
      "id": "A",
      "text": "Their primary producers utilize solar radiation stored in geothermal magma."
    },
    {
      "id": "B",
      "text": "They demonstrate that complex biological communities can thrive decoupled from solar energy."
    },
    {
      "id": "C",
      "text": "They are more biologically diverse than shallow tropical coral reef habitats."
    },
    {
      "id": "D",
      "text": "They derive their primary nutrients from organic debris descending from the epipelagic zone."
    },
    {
      "id": "E",
      "text": "They prove conclusively that life exists in the subsurface ocean of Europa."
    }
  ],
  "correctAnswers": [
    "B"
  ],
  "hints": [
    {
      "tier": 1,
      "label": "Concept Nudge",
      "content_md": "Locate where the passage contrasts the old dogma with the new discovery regarding solar energy dependence."
    },
    {
      "tier": 2,
      "label": "Setup / Elimination",
      "content_md": "The passage notes that prior to this discovery, scientists believed all benthic life depended on photosynthesis, but vents \"operate independently of solar influx\" via chemosynthesis."
    },
    {
      "tier": 3,
      "label": "Final Bridge",
      "content_md": "Option B accurately paraphrases this core finding without exaggerating into unproven claims (unlike option E)."
    }
  ],
  "choiceExplanations": {
    "A": {
      "is_correct": false,
      "explanation_md": "Magma does not store solar radiation; it provides geothermal chemical energy.",
      "trap_tag": "scientific_misconception",
      "trap_label": "Scientific Incoherence Trap"
    },
    "B": {
      "is_correct": true,
      "explanation_md": "The passage explicitly states that these ecosystems \"operate independently of solar influx\" using chemoautotrophic bacteria, demonstrating that complex communities can thrive decoupled from sunlight."
    },
    "C": {
      "is_correct": false,
      "explanation_md": "No comparison is made between the diversity of vents and tropical coral reefs.",
      "trap_tag": "unwarranted_comparison",
      "trap_label": "Out-of-Scope Comparison Trap"
    },
    "D": {
      "is_correct": false,
      "explanation_md": "This describes the outdated pre-1970s assumption that the discovery specifically refuted.",
      "trap_tag": "refuted_dogma",
      "trap_label": "Disproven Assumption Trap"
    },
    "E": {
      "is_correct": false,
      "explanation_md": "The passage states vents \"suggest\" Europa \"could\" host life; it does not \"prove conclusively\" that life exists there.",
      "trap_tag": "extreme_unwarranted_claim",
      "trap_label": "Extreme Generalization Trap"
    }
  },
  "steps": [
    {
      "step_index": 1,
      "prompt_md": "What was the scientific dogma prior to the late 1970s?",
      "options": [
        "All benthic life strictly depended on sunlight-driven photosynthetic matter",
        "Benthic life created its own geothermal light",
        "Deep sea life lived on hydrogen"
      ],
      "correct_option_index": 0,
      "takeaway_md": "The old paradigm assumed absolute reliance on photosynthetic organic matter."
    },
    {
      "step_index": 2,
      "prompt_md": "How do hydrothermal vent communities produce biomass in the absence of sunlight?",
      "options": [
        "Chemoautotrophic bacteria oxidize hydrogen sulfide from volcanic fissures",
        "Tube worms consume drifting plankton",
        "They absorb radioactive heat directly"
      ],
      "correct_option_index": 0,
      "takeaway_md": "Chemoautotrophic bacteria convert chemical energy into organic biomass."
    },
    {
      "step_index": 3,
      "prompt_md": "What conclusion directly follows from the existence of these communities?",
      "options": [
        "Complex ecosystems can thrive entirely decoupled from solar energy (Option B)",
        "Europa definitely possesses intelligent alien life (Option E)"
      ],
      "correct_option_index": 0,
      "takeaway_md": "ETS RC rewards precise, non-extreme statements directly supported by the text."
    }
  ],
  "writtenExplanationMd": "Step 1: Analyze the question and locate relevant text.\nThe question asks what the passage suggests about hydrothermal vent ecosystems. The passage states that the discovery \"shattered this dogma\" that all benthic ecosystems depended on photosynthesis from sunlit waters, explaining that vents \"operate independently of solar influx\" via chemoautotrophy.\n\nStep 2: Evaluate answer choices:\n- (A) Incorrect. Geothermal energy arises from planetary heat and radioactive decay, not stored solar radiation.\n- (B) Correct. The passage states that in the \"complete absence of sunlight\", dense biological colonies flourish, demonstrating that complex communities can thrive decoupled from solar energy.\n- (C) Incorrect. The passage makes no comparison to coral reefs.\n- (D) Incorrect. This is the outdated dogma that the discovery refuted.\n- (E) Incorrect. The author states that Europa \"could\" host ecosystems; asserting that it \"proves conclusively\" is an unwarranted extreme claim.\n\nCorrect Answer: B."
},
];
