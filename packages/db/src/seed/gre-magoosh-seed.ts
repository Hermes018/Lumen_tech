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
];
