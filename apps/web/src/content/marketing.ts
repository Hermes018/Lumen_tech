/** @purpose Word-capped bilingual (en & bn) marketing content store for /, /gre, /ielts, /courses, /pricing, and /help */
import { brand } from '@lumen/config';
import type { MediaSlotId } from './media';

export type MarketingLocale = 'en' | 'bn';
export type MarketingIcon = 'calendar' | 'currency' | 'location' | 'shield' | 'clock' | 'check';
export type MarketingAccent = 'brand' | 'crimson' | 'terracotta' | 'accent';
export type SplitBackdropTone = 'orange' | 'crimson' | 'espresso' | 'cobalt' | 'amber';
export type EditorialQuoteTone = 'crimson' | 'orange' | 'cobalt';

export interface SplitFeatureItem {
  photoSlot: MediaSlotId;
  photoSide: 'left' | 'right';
  backdrop: SplitBackdropTone;
  title: string;
  body: string;
  ctaLabel: string;
  ctaHref: string;
}

export interface EditorialQuoteItem {
  quote: string;
  attribution: string;
  tone?: EditorialQuoteTone;
}

export interface LinkItem {
  label: string;
  href: string;
}

export interface StatItem {
  value: string;
  caption: string;
  verified: true;
}

export interface StepItem {
  num: '1' | '2' | '3' | '4';
  title: string;
  body: string;
  linkLabel?: string;
  linkHref?: string;
}

export interface MediaColumnItem {
  photoSlot?: MediaSlotId;
  accentColor?: MarketingAccent;
  title: string;
  href: string;
  meta?: string;
  body: string;
  links?: LinkItem[];
  disclosureTitle?: string;
  disclosureItems?: string[];
}

export interface SideBlockItem {
  icon: MarketingIcon;
  title: string;
  body: string;
  linkLabel?: string;
  linkHref?: string;
}

export interface TabSectionDisclosure {
  summary: string;
  detail: string;
}

export interface TabSectionItem {
  id: string;
  label: string;
  title: string;
  body: string;
  bullets: string[];
  disclosures?: TabSectionDisclosure[];
  ctaLabel?: string;
  ctaHref?: string;
}

export interface CourseItem {
  id: string;
  category: 'gre' | 'ielts';
  mode: 'self-paced' | 'live';
  photoSlot: MediaSlotId;
  accentColor: MarketingAccent;
  title: string;
  forWhom: string;
  price: string;
  href: string;
  ctaLabel: string;
  syllabusTitle: string;
  syllabusModules: string[];
}

export interface PricingPlan {
  id: string;
  title: string;
  price: string;
  period: string;
  body: string;
  bullets: string[];
  ctaLabel: string;
  ctaHref: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface MarketingLocaleData {
  home: {
    hero: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      photoSlot: MediaSlotId;
    };
    subBar: LinkItem[];
    stats: StatItem[];
    howItWorks: {
      title: string;
      intro: string;
      steps: StepItem[];
    };
    examTracks: {
      title: string;
      intro: string;
      items: MediaColumnItem[];
    };
    diagnosticFeature: {
      photoSlot: MediaSlotId;
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };
    destinations: {
      title: string;
      intro: string;
      items: MediaColumnItem[];
    };
    ctaBand: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };
  };
  gre: {
    breadcrumbLabel: string;
    hero: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      photoSlot: MediaSlotId;
    };
    stats: StatItem[];
    overview: {
      title: string;
      intro: string;
      ctaLabel: string;
      ctaHref: string;
      blocks: SideBlockItem[];
    };
    tabsTitle: string;
    tabs: TabSectionItem[];
    sections: {
      title: string;
      intro: string;
      items: MediaColumnItem[];
    };
    editorialQuote: EditorialQuoteItem;
    splitFeatures: SplitFeatureItem[];
    roadmapTitle: string;
    roadmap: FaqItem[];
    ctaBand: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };
  };
  ielts: {
    breadcrumbLabel: string;
    hero: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      photoSlot: MediaSlotId;
    };
    stats: StatItem[];
    overview: {
      title: string;
      intro: string;
      ctaLabel: string;
      ctaHref: string;
      blocks: SideBlockItem[];
    };
    tabsTitle: string;
    tabs: TabSectionItem[];
    skills: {
      title: string;
      intro: string;
      items: MediaColumnItem[];
    };
    editorialQuote: EditorialQuoteItem;
    splitFeatures: SplitFeatureItem[];
    roadmapTitle: string;
    roadmap: FaqItem[];
    ctaBand: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };
  };
  courses: {
    breadcrumbLabel: string;
    hero: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      photoSlot: MediaSlotId;
    };
    filterTabs: Array<{
      id: 'all' | 'gre' | 'ielts' | 'self-paced' | 'live';
      label: string;
    }>;
    catalogTitle: string;
    catalogIntro: string;
    items: CourseItem[];
    ctaBand: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };
  };
  pricing: {
    breadcrumbLabel: string;
    hero: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      photoSlot: MediaSlotId;
    };
    notice: {
      title: string;
      body: string;
    };
    tabs: {
      fullCoursesLabel: string;
      passesLabel: string;
      fullCourses: PricingPlan[];
      passes: PricingPlan[];
    };
    billing: {
      title: string;
      intro: string;
      blocks: SideBlockItem[];
    };
    faqTitle: string;
    faqs: FaqItem[];
    ctaBand: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };
  };
  help: {
    breadcrumbLabel: string;
    hero: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      photoSlot: MediaSlotId;
    };
    topics: {
      title: string;
      intro: string;
      blocks: SideBlockItem[];
    };
    faqTitle: string;
    faqs: FaqItem[];
    ctaBand: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
    };
  };
  forInstitutions: {
    breadcrumbLabel: string;
    hero: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      photoSlot: MediaSlotId;
    };
    procurement: {
      title: string;
      intro: string;
      blocks: SideBlockItem[];
    };
  };
}

export const MARKETING_CONTENT: Record<MarketingLocale, MarketingLocaleData> = {
  en: {
    home: {
      hero: {
        title: 'Computer-Delivered GRE and IELTS Prep for Bangladesh',
        body: 'Practice with adaptive GRE sections, four-skill IELTS mock tests, bilingual vocabulary cards, and transparent BDT pricing with official VAT invoices.',
        ctaLabel: 'Take Free Diagnostic',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-home',
      },
      subBar: [
        { label: 'Free Diagnostic Test', href: '/exam/diagnostic' },
        { label: 'Explore Prep Courses', href: '/courses' },
        { label: 'Plans & Pricing', href: '/pricing' },
      ],
      stats: [
        {
          value: '1h 58m',
          caption: 'Computer-Delivered GRE Format',
          verified: true,
        },
        {
          value: '4 Skills',
          caption: 'IELTS Listening, Reading, Writing & Speaking',
          verified: true,
        },
        {
          value: '1,500+',
          caption: 'Bilingual Active-Recall Vocabulary Cards',
          verified: true,
        },
        {
          value: '40+ Rubrics',
          caption: 'Calibrated Automated & Mentor Writing Evaluations',
          verified: true,
        },
      ],
      howItWorks: {
        title: 'How Your Preparation Works',
        intro:
          'Start with a baseline check, build accuracy through guided lessons, and test under real exam timing.',
        steps: [
          {
            num: '1',
            title: 'Take a Free Diagnostic',
            body: 'Measure your starting Verbal, Quantitative, or IELTS band level in under 30 minutes.',
            linkLabel: 'Start diagnostic',
            linkHref: '/exam/diagnostic',
          },
          {
            num: '2',
            title: 'Study Core Lessons',
            body: 'Follow focused video modules, Bangla-supported vocabulary, and structured question drills.',
            linkLabel: 'Browse courses',
            linkHref: '/courses',
          },
          {
            num: '3',
            title: 'Complete Timed Mocks',
            body: 'Sit full-length computer-based tests with section timing and realistic screen layouts.',
            linkLabel: 'Preview GRE',
            linkHref: '/gre',
          },
          {
            num: '4',
            title: 'Review Rubric Feedback',
            body: 'See clear band estimates, essay breakdowns, and targeted topics to fix next.',
            linkLabel: 'See plans',
            linkHref: '/pricing',
          },
        ],
      },
      examTracks: {
        title: 'Choose Your Exam Track',
        intro:
          'Dedicated preparation environments built around official computer-delivered test formats.',
        items: [
          {
            photoSlot: 'track-gre',
            accentColor: 'terracotta',
            title: 'GRE General Test',
            href: '/gre',
            meta: '1h 58m • Adaptive Sections',
            body: 'Master Quantitative, Verbal, and Analytical Writing with section-adaptive mocks and formula drills.',
            links: [
              { label: 'Explore GRE format', href: '/gre' },
              { label: 'Try a sample question', href: '/gre#sample' },
            ],
          },
          {
            photoSlot: 'track-ielts-ac',
            accentColor: 'crimson',
            title: 'IELTS Academic',
            href: '/ielts',
            meta: '4 Skills • University Admission',
            body: 'Train with split-screen Reading passages, Listening audio controls, and Task 1 data essays.',
            links: [
              { label: 'Explore IELTS Academic', href: '/ielts' },
              { label: 'Preview IELTS exam', href: '/exam/ielts-preview' },
            ],
          },
          {
            photoSlot: 'track-ielts-gt',
            accentColor: 'brand',
            title: 'IELTS General Training',
            href: '/ielts',
            meta: '4 Skills • Migration & Work',
            body: 'Practice workplace reading tasks, formal letter writing, and natural speaking responses.',
            links: [
              { label: 'Explore General Training', href: '/ielts#format' },
              { label: 'View IELTS courses', href: '/courses' },
            ],
          },
        ],
      },
      diagnosticFeature: {
        photoSlot: 'split-diagnostic',
        title: 'Know Your Starting Score First',
        body: 'Before enrolling in any course, take our free diagnostic test to identify weak question types and receive a focused study plan.',
        ctaLabel: 'Start Free Diagnostic',
        ctaHref: '/exam/diagnostic',
      },
      destinations: {
        title: 'Built for Global Study Destinations',
        intro:
          'Prepare the scores admissions teams expect across major English-speaking university systems.',
        items: [
          {
            photoSlot: 'dest-usa',
            accentColor: 'brand',
            title: 'United States',
            href: '/gre',
            body: 'Prepare competitive GRE Quantitative and Verbal scores for US graduate admissions.',
          },
          {
            photoSlot: 'dest-uk',
            accentColor: 'crimson',
            title: 'United Kingdom',
            href: '/ielts',
            body: 'Build balanced IELTS Academic bands across all four skills for UK universities.',
          },
          {
            photoSlot: 'dest-canada',
            accentColor: 'terracotta',
            title: 'Canada',
            href: '/ielts',
            body: 'Train for Academic study permits or General Training migration pathways.',
          },
          {
            photoSlot: 'dest-australia',
            accentColor: 'accent',
            title: 'Australia',
            href: '/ielts',
            body: 'Practice computer-delivered IELTS timing for Australian university and visa requirements.',
          },
        ],
      },
      ctaBand: {
        title: 'Start with a Free Baseline Test',
        body: `Create your free ${brand.name} account and check your current readiness before paying anything.`,
        ctaLabel: 'Create Free Account',
        ctaHref: '/sign-up',
      },
    },
    gre: {
      breadcrumbLabel: 'GRE General',
      hero: {
        title: 'Computer-Delivered GRE Preparation',
        body: 'Train for the 1h 58m GRE General Test with section-adaptive Verbal and Quantitative panels, an on-screen calculator, and rubric-aligned essay feedback.',
        ctaLabel: 'Start 15-Min GRE Diagnostic',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-gre',
      },
      stats: [
        { value: '1h 58m', caption: 'Total Exam Duration', verified: true },
        { value: '130–170', caption: 'Quantitative & Verbal Scale', verified: true },
        { value: '5', caption: 'Timed Sections', verified: true },
        { value: '0–6', caption: 'Analytical Writing Scale', verified: true },
      ],
      overview: {
        title: 'Inside the 1h 58m Adaptive Format',
        intro:
          'Every mock test mirrors the computer-delivered GRE structure so section transitions and pacing feel automatic on test day.',
        ctaLabel: 'View GRE Plans',
        ctaHref: '/pricing',
        blocks: [
          {
            icon: 'check',
            title: 'Section-Level Adaptivity',
            body: 'Your Section 1 accuracy routes you to an easier, medium, or harder Section 2 panel, unlocking higher scaled scores.',
          },
          {
            icon: 'clock',
            title: 'Quantitative Comparison & Data Interpretation',
            body: 'Spot algebraic root and sign traps fast using number-testing frameworks and built-in on-screen calculator shortcuts.',
          },
          {
            icon: 'shield',
            title: 'Analytical Writing Issue Tasks',
            body: 'Draft structured 30-minute Issue essays with clear thesis claims, counter-examples, and rubric-aligned scoring notes.',
          },
        ],
      },
      tabsTitle: 'Official Structure, Scoring & Sample Question',
      tabs: [
        {
          id: 'format',
          label: 'Format & Section Timing',
          title: 'Five Timed Sections Across 1h 58m',
          body: 'Expand each section below to review question counts, time limits, and on-screen tool rules.',
          bullets: [],
          disclosures: [
            {
              summary: 'Analytical Writing — 1 Task (30 minutes)',
              detail:
                'One Analyze an Issue essay prompt scored on a 0.0–6.0 half-point scale for argument clarity, evidence, and conventions.',
            },
            {
              summary: 'Quantitative Reasoning — Sec 1: 12 Qs (21m) • Sec 2: 15 Qs (26m)',
              detail:
                '27 total questions covering Quantitative Comparison, Problem Solving, and Data Interpretation with a basic on-screen calculator.',
            },
            {
              summary: 'Verbal Reasoning — Sec 1: 12 Qs (18m) • Sec 2: 15 Qs (23m)',
              detail:
                '27 total questions testing Text Completion, Sentence Equivalence, and Reading Comprehension across academic passages.',
            },
          ],
        },
        {
          id: 'scoring',
          label: 'How Adaptive Scoring Works',
          title: 'Raw Accuracy to 130–170 Scaled Scores',
          body: 'ETS converts raw accuracy and Section 2 difficulty into 1-point increments from 130 to 170. Careless root or sign traps in Section 1 cap your Section 2 ceiling.',
          bullets: [
            'High accuracy in Section 1 unlocks the hard Section 2 panel for 160–170 scores',
            'No penalty for guessing—answer every question before the section clock expires',
            'Analytical Writing is scored separately on the 0.0–6.0 half-point scale',
          ],
          ctaLabel: 'Open GRE Score Calculator',
          ctaHref: '/tools/gre-score-calculator',
        },
        {
          id: 'sample',
          label: 'Try a Live Quantitative Comparison Question',
          title: 'Interactive GRE Preview',
          body: 'Test a real GRE Quantitative Comparison prompt right below without leaving this page.',
          bullets: [],
        },
      ],
      sections: {
        title: 'Four Core Question Families You Will Master',
        intro: 'Structured lessons, trap clinics, and timed drills across every GRE question type.',
        items: [
          {
            photoSlot: 'track-gre',
            accentColor: 'terracotta',
            title: 'Quantitative Comparison',
            href: '/courses',
            meta: 'Sec 1 & 2 • Core Trap Clinic',
            body: 'Compare Quantity A and B systematically using boundary numbers, zero, negatives, and fractions.',
          },
          {
            photoSlot: 'hero-gre',
            accentColor: 'brand',
            title: 'Problem Solving & Data Analysis',
            href: '/courses',
            meta: '27 Quant Qs • 47 Minutes',
            body: 'Solve multi-chart percentage, ratio, algebra, geometry, and combinatorics problems under strict pacing.',
          },
          {
            photoSlot: 'mega-courses',
            accentColor: 'crimson',
            title: 'Text Completion & Sentence Equivalence',
            href: '/courses',
            meta: '1,500+ FSRS Cards',
            body: 'Predict blank meanings from contrast pivots and retain high-frequency vocabulary with spaced repetition.',
          },
          {
            photoSlot: 'split-diagnostic',
            accentColor: 'accent',
            title: 'Analytical Writing Issue Essay',
            href: '/exam/diagnostic',
            meta: '1 Essay • 30 Minutes',
            body: 'Build nuanced thesis positions and structured body paragraphs aligned with the 0–6 rubric.',
          },
        ],
      },
      editorialQuote: {
        quote:
          'Section-level difficulty adapts between Part 1 and Part 2 based on raw accuracy—mastering the transition threshold unlocks 165+ Quant and Verbal scores.',
        attribution: 'Lumen GRE Faculty · Official ETS Section-Adaptive Rubric',
        tone: 'cobalt',
      },
      splitFeatures: [
        {
          photoSlot: 'track-gre',
          photoSide: 'left',
          backdrop: 'orange',
          title: 'Section-Adaptive Quant & Verbal Mastery',
          body: 'Train inside an ETS-faithful testing interface with mark-and-review flags, on-screen calculator rules, and timed 21-minute and 26-minute sections.',
          ctaLabel: 'Explore GRE Prep',
          ctaHref: '/pricing',
        },
        {
          photoSlot: 'split-diagnostic',
          photoSide: 'right',
          backdrop: 'cobalt',
          title: 'Progressive 3-Tier Hint Guidance',
          body: 'Unlock conceptual nudges before revealing full solutions so you build independent problem-solving reflexes across Quantitative Comparison and Text Completion.',
          ctaLabel: 'Take Free Diagnostic',
          ctaHref: '/exam/diagnostic',
        },
      ],
      roadmapTitle: '8-Week GRE Preparation Roadmap & FAQ',
      roadmap: [
        {
          question: 'Weeks 1–2: Quantitative Foundations & Root/Sign Trap Elimination',
          answer:
            'Audit number properties, exponents, roots, inequalities, and geometry basics while logging every sign or assumption error in an error ledger.',
        },
        {
          question: 'Weeks 3–4: Text Completion, Sentence Equivalence & FSRS Vocabulary',
          answer:
            'Complete 40 daily FSRS-4.5 bilingual vocabulary reviews and drill single-, double-, and triple-blank sentence logic.',
        },
        {
          question: 'Weeks 5–6: Section-Adaptive Pacing & Calculator Efficiency',
          answer:
            'Practice 21-minute and 18-minute Section 1 sprints with skip-and-flag discipline and on-screen calculator shortcuts.',
        },
        {
          question: 'Weeks 7–8: Full-Length 1h 58m CBT Mocks & Error-Log Forensics',
          answer:
            'Sit 4 to 6 full-length timed adaptive mocks, review every missed question by trap category, and finalize AWA Issue templates.',
        },
      ],
      ctaBand: {
        title: 'Ready to Benchmark Your GRE Score?',
        body: 'Start the 15-minute baseline diagnostic for an instant section-by-section accuracy breakdown.',
        ctaLabel: 'Start GRE Diagnostic',
        ctaHref: '/exam/diagnostic',
      },
    },
    ielts: {
      breadcrumbLabel: 'IELTS Prep',
      hero: {
        title: 'Computer-Delivered IELTS 4-Skill Prep',
        body: 'Prepare for IELTS Academic and General Training with split-screen Reading, single-play Listening audio, timed Writing, and Speaking evaluation.',
        ctaLabel: 'Preview IELTS Workbench',
        ctaHref: '/exam/ielts-preview',
        photoSlot: 'hero-ielts',
      },
      stats: [
        { value: '2h 45m', caption: 'Core Listening, Reading & Writing', verified: true },
        { value: 'Band 0–9', caption: 'Half-Band Reporting Scale', verified: true },
        { value: '4 Skills', caption: 'Assessed Across All Modules', verified: true },
        { value: '3 / 40', caption: 'Reading Passages & Questions', verified: true },
      ],
      overview: {
        title: 'Computer-Delivered IELTS at a Glance',
        intro:
          'Every practice module mirrors the computer-delivered test interface used across Bangladesh test centers.',
        ctaLabel: 'Compare IELTS Plans',
        ctaHref: '/pricing',
        blocks: [
          {
            icon: 'check',
            title: 'Split-Screen Reading & Highlighting',
            body: 'Keep passages anchored on the left while navigating questions and highlighting key evidence on the right.',
          },
          {
            icon: 'clock',
            title: 'Single-Play Listening Audio & Note Completion',
            body: 'Train with authentic one-play audio rules, speaker distractors, and strict word-limit note completion.',
          },
          {
            icon: 'shield',
            title: '4-Criterion Writing & Speaking Evaluation',
            body: 'Receive half-band estimates and criterion notes across Task Response, Coherence, Vocabulary, and Grammar.',
          },
        ],
      },
      tabsTitle: 'Paper Breakdown, Band Descriptors & Academic vs. General Training',
      tabs: [
        {
          id: 'format',
          label: 'Section Timing & Question Types',
          title: 'Four Skills Under Official CD-IELTS Timers',
          body: 'Expand each paper below to inspect exact timings, question counts, and task formats.',
          bullets: [],
          disclosures: [
            {
              summary: 'Listening — 30m + 2m review (4 parts, 40 questions)',
              detail:
                'Covers everyday social dialogues, campus discussions, and academic monologues played once with 2 minutes to check answers.',
            },
            {
              summary: 'Reading — 60m (3 passages, 40 questions)',
              detail:
                'Includes True/False/Not Given, Matching Headings, Summary Completion, and Multiple Choice in a split-screen passage pane.',
            },
            {
              summary: 'Writing — 60m (Task 1: 150w / 20m + Task 2: 250w / 40m)',
              detail:
                'Live word counter tracks minimum word targets for Task 1 reports or letters and Task 2 argumentative essays.',
            },
            {
              summary: 'Speaking — 11–14m (Part 1 Interview, Part 2 Cue Card, Part 3 Discussion)',
              detail:
                'Structured 3-part speaking workbench with 1-minute cue-card prep timer and recorded rubric feedback.',
            },
          ],
        },
        {
          id: 'scoring',
          label: 'How Band 7.0–8.5 Is Scored',
          title: 'Four Official Evaluation Criteria',
          body: 'Listening and Reading convert raw scores out of 40 into half-bands. Writing and Speaking are graded equally across four official criteria.',
          bullets: [
            'Task Achievement / Task Response: answering every part of the prompt with clear support',
            'Coherence & Cohesion: logical paragraphing and natural linking without mechanical repetition',
            'Lexical Resource: precise collocations and topic vocabulary rather than forced rare words',
            'Grammatical Range & Accuracy: error-free complex sentences and accurate punctuation',
          ],
          ctaLabel: 'Open IELTS Band Calculator',
          ctaHref: '/tools/ielts-band-calculator',
        },
        {
          id: 'academic-vs-gt',
          label: 'Academic vs. General Training',
          title: 'Exact Differences in Reading & Writing Task 1',
          body: 'Listening and Speaking are identical for both modules. Only Reading texts and Writing Task 1 differ by purpose.',
          bullets: [
            'Academic Reading uses 3 long university-level texts; General Training uses workplace notices, guides, and one long text',
            'Academic Writing Task 1 asks you to summarize a chart, graph, table, map, or process diagram (150+ words)',
            'General Training Writing Task 1 asks you to write a formal, semi-formal, or informal letter (150+ words)',
          ],
        },
      ],
      skills: {
        title: 'Train Every IELTS Skill in Official-Format Workbenches',
        intro: 'Focused practice for every paper in Academic and General Training.',
        items: [
          {
            photoSlot: 'hero-ielts',
            accentColor: 'crimson',
            title: 'Listening',
            href: '/exam/ielts-preview',
            meta: '40 Questions • 30m + 2m',
            body: 'Practice everyday dialogues and academic lectures with single-play exam audio rules.',
          },
          {
            photoSlot: 'track-ielts-ac',
            accentColor: 'brand',
            title: 'Reading',
            href: '/exam/ielts-preview',
            meta: '40 Questions • 60 Minutes',
            body: 'Highlight passages and solve True/False/Not Given, matching headings, and summary tasks.',
          },
          {
            photoSlot: 'track-ielts-gt',
            accentColor: 'terracotta',
            title: 'Writing',
            href: '/courses',
            meta: 'Task 1 & Task 2 • 60 Minutes',
            body: 'Draft Academic charts, General letters, and essays with live word counts and rubric notes.',
          },
          {
            photoSlot: 'split-diagnostic',
            accentColor: 'accent',
            title: 'Speaking',
            href: '/courses',
            meta: 'Parts 1, 2 & 3 • 11–14 Min',
            body: 'Record cue-card and follow-up responses and review fluency and pronunciation feedback.',
          },
        ],
      },
      editorialQuote: {
        quote:
          'Band 7.5+ Writing requires clear task response, cohesive paragraphing, and precise academic collocations—not memorized templates.',
        attribution: 'Lumen IELTS Faculty · Official 4-Criterion Band Descriptors',
        tone: 'crimson',
      },
      splitFeatures: [
        {
          photoSlot: 'track-ielts-ac',
          photoSide: 'left',
          backdrop: 'orange',
          title: 'Four-Skill Computer-Delivered Precision',
          body: 'Practice split-pane Academic Reading, single-play Listening audio, and timed Task 1 and Task 2 Writing in an authentic computer-delivered workspace.',
          ctaLabel: 'Explore IELTS Plans',
          ctaHref: '/pricing',
        },
        {
          photoSlot: 'track-ielts-gt',
          photoSide: 'right',
          backdrop: 'crimson',
          title: 'Line-by-Line Band 7.5+ Rubric Feedback',
          body: 'Receive structured criterion-by-criterion evaluations across Task Achievement, Coherence, Lexical Resource, and Grammatical Range on every Writing and Speaking attempt.',
          ctaLabel: 'Take Free Diagnostic',
          ctaHref: '/exam/diagnostic',
        },
      ],
      roadmapTitle: '6-Week Band 7.5+ Preparation Plan & Common Questions',
      roadmap: [
        {
          question: 'Weeks 1–2: Split-Pane Reading Speed & True/False/Not Given Logic',
          answer:
            'Build skimming, keyword-scanning, and False-vs-Not-Given precision so all 3 passages finish with 5 minutes to spare.',
        },
        {
          question: 'Weeks 3–4: Writing Task 1 Data Synthesis & Task 2 Essay Structure',
          answer:
            'Master overview paragraphs for charts or tone shifts for letters, plus 4-paragraph Task 2 argument templates.',
        },
        {
          question: 'Week 5: Listening Distractor Tracking & Part 2 Cue-Card Fluency',
          answer:
            'Spot self-corrections in Listening Parts 1–4 and practice 2-minute uninterrupted Part 2 speaking responses.',
        },
        {
          question: 'Week 6: Full Timed CD-IELTS Mock Exams & Rubric Calibration',
          answer:
            'Complete full 2h 45m timed mocks and review criterion-by-criterion Writing and Speaking band notes.',
        },
      ],
      ctaBand: {
        title: 'Experience the IELTS Test Screen Today',
        body: 'Launch our free computer-delivered workbench preview or benchmark your current band.',
        ctaLabel: 'Open IELTS Preview',
        ctaHref: '/exam/ielts-preview',
      },
    },
    courses: {
      breadcrumbLabel: 'Courses',
      hero: {
        title: 'Structured GRE and IELTS Prep Courses',
        body: 'Choose self-paced video tracks or live Dhaka-evening cohorts. All tuition is priced in BDT with 15% VAT included.',
        ctaLabel: 'Take Free Diagnostic',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-courses',
      },
      filterTabs: [
        { id: 'all', label: 'All Courses' },
        { id: 'gre', label: 'GRE' },
        { id: 'ielts', label: 'IELTS' },
        { id: 'self-paced', label: 'Self-paced' },
        { id: 'live', label: 'Live' },
      ],
      catalogTitle: 'Course Catalog',
      catalogIntro:
        'Each track includes video lessons, question banks, full-length mocks, and an official Mushak 6.3 VAT invoice.',
      items: [
        {
          id: 'gre-self-paced',
          category: 'gre',
          mode: 'self-paced',
          photoSlot: 'track-gre',
          accentColor: 'terracotta',
          title: 'GRE Complete Self-Paced',
          forWhom: 'For independent learners targeting 315+ scores on a flexible schedule.',
          price: '৳ 5,990',
          href: '/pricing',
          ctaLabel: 'Enroll in GRE Self-Paced',
          syllabusTitle: 'View syllabus (Modules 1–4)',
          syllabusModules: [
            'Module 1: Quantitative Foundations — Number Properties, Algebra, Geometry & Data Interpretation (18 lessons)',
            'Module 2: Verbal Mastery — Text Completion, Sentence Equivalence & Reading Logic (14 lessons)',
            'Module 3: Bilingual Vocabulary — 1,500+ FSRS-4.5 Active-Recall Cards with Bangla Context',
            'Module 4: Adaptive Testing — 6 Full-Length 1h 58m GRE Mocks + AWA Issue Reviews',
          ],
        },
        {
          id: 'gre-live-cohort',
          category: 'gre',
          mode: 'live',
          photoSlot: 'hero-gre',
          accentColor: 'brand',
          title: 'GRE Live Evening Cohort',
          forWhom: 'For learners wanting live Dhaka-time classes and weekly instructor Q&A.',
          price: '৳ 12,990',
          href: '/pricing',
          ctaLabel: 'Enroll in GRE Live',
          syllabusTitle: 'View syllabus (Modules 1–4)',
          syllabusModules: [
            'Module 1: 24 Live Dhaka-Evening Sessions — Quant Trap Clinics & Verbal Strategy (Sun/Tue/Thu)',
            'Module 2: Full Self-Paced Video Library & 1,200+ Adaptive Question Bank',
            'Module 3: Weekly Instructor Office Hours & Personalized Study-Plan Check-ins',
            'Module 4: 8 Full-Length Adaptive GRE Mocks with Line-by-Line Error-Log Reviews',
          ],
        },
        {
          id: 'ielts-academic-self',
          category: 'ielts',
          mode: 'self-paced',
          photoSlot: 'track-ielts-ac',
          accentColor: 'crimson',
          title: 'IELTS Academic Complete',
          forWhom: 'For university applicants aiming for Band 7.0 to 8.5.',
          price: '৳ 4,990',
          href: '/pricing',
          ctaLabel: 'Enroll in IELTS Academic',
          syllabusTitle: 'View syllabus (Modules 1–4)',
          syllabusModules: [
            'Module 1: Listening & Split-Pane Reading — True/False/Not Given, Headings & Distractor Drills (16 lessons)',
            'Module 2: Academic Writing — Task 1 Chart/Process Reports & Task 2 Essay Structures (12 lessons)',
            'Module 3: Speaking Workbench — Part 1–3 Cue-Card Drills with 4-Criterion Rubric Notes',
            'Module 4: Exam Simulation — 6 Full Computer-Delivered IELTS Academic Mocks + 12 AI Evaluations',
          ],
        },
        {
          id: 'ielts-gt-self',
          category: 'ielts',
          mode: 'self-paced',
          photoSlot: 'track-ielts-gt',
          accentColor: 'accent',
          title: 'IELTS General Training',
          forWhom: 'For migration and work candidates needing Band 7.0+ across all skills.',
          price: '৳ 4,490',
          href: '/pricing',
          ctaLabel: 'Enroll in General Training',
          syllabusTitle: 'View syllabus (Modules 1–4)',
          syllabusModules: [
            'Module 1: Everyday & Workplace Reading — Notices, Handbooks & Long-Passage Skimming (12 lessons)',
            'Module 2: Task 1 Letter Frameworks — Formal, Semi-Formal & Informal Tone Mastery (8 lessons)',
            'Module 3: Task 2 Opinion & Discussion Essays + Speaking Part 1–3 Fluency Drills',
            'Module 4: Exam Simulation — 5 Full Computer-Delivered General Training Mocks',
          ],
        },
        {
          id: 'ielts-live-cohort',
          category: 'ielts',
          mode: 'live',
          photoSlot: 'hero-ielts',
          accentColor: 'crimson',
          title: 'IELTS Live Writing & Speaking',
          forWhom: 'For candidates seeking live instructor coaching and human essay grading.',
          price: '৳ 9,990',
          href: '/pricing',
          ctaLabel: 'Enroll in IELTS Live',
          syllabusTitle: 'View syllabus (Modules 1–4)',
          syllabusModules: [
            'Module 1: 18 Live Dhaka-Evening Workshops on Writing Task 1/2 & Speaking Fluency',
            'Module 2: 8 Human-Graded Writing Tasks with Line-by-Line Band-Descriptor Feedback',
            'Module 3: 4 Live 1-on-1 Speaking Mock Interviews with Pronunciation & Lexical Coaching',
            'Module 4: Full Computer-Delivered 4-Skill Mock Library (6 Timed Mocks Included)',
          ],
        },
      ],
      ctaBand: {
        title: 'Not Sure Which Course Fits?',
        body: 'Start with our free 30-minute diagnostic to get a clear recommendation.',
        ctaLabel: 'Take Free Diagnostic',
        ctaHref: '/exam/diagnostic',
      },
    },
    pricing: {
      breadcrumbLabel: 'Pricing',
      hero: {
        title: 'Transparent BDT Tuition & Mock Passes',
        body: 'Pay once in Bangladeshi Taka via bKash, Nagad, or card. Every purchase includes 15% VAT and an official Mushak 6.3 invoice.',
        ctaLabel: 'Start Free Diagnostic',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-pricing',
      },
      notice: {
        title: '15% VAT Included in Every Listed BDT Price',
        body: 'No hidden checkout fees. Official Mushak 6.3 tax invoices are generated automatically for every order.',
      },
      tabs: {
        fullCoursesLabel: 'Full courses',
        passesLabel: 'Mock & AI credit passes',
        fullCourses: [
          {
            id: 'free-starter',
            title: 'Free Diagnostic',
            price: '৳ 0',
            period: 'No card required',
            body: 'Check your baseline readiness before choosing a paid plan.',
            bullets: [
              '1 GRE or IELTS diagnostic test',
              '100 bilingual vocabulary cards',
              'Sample computer-delivered test preview',
            ],
            ctaLabel: 'Start Free',
            ctaHref: '/sign-up',
          },
          {
            id: 'ielts-complete',
            title: 'IELTS Complete',
            price: '৳ 4,990',
            period: '6 months access',
            body: 'Full Academic or General Training self-paced prep.',
            bullets: [
              'All 4-skill video modules',
              '6 full computer-delivered mocks',
              '12 AI Writing & Speaking evaluations',
              'Mushak 6.3 VAT invoice',
            ],
            ctaLabel: 'Choose IELTS',
            ctaHref: '/sign-up',
          },
          {
            id: 'gre-complete',
            title: 'GRE Complete',
            price: '৳ 5,990',
            period: '6 months access',
            body: 'Complete self-paced Verbal, Quant, and AWA preparation.',
            bullets: [
              'Full Quant & Verbal video library',
              '6 adaptive GRE mock exams',
              '1,500+ bilingual vocabulary cards',
              'Mushak 6.3 VAT invoice',
            ],
            ctaLabel: 'Choose GRE',
            ctaHref: '/sign-up',
          },
          {
            id: 'live-bundle',
            title: 'Live Cohort + Mocks',
            price: '৳ 12,990',
            period: 'Live cohort + 9 months',
            body: 'Instructor-led evening classes plus full mock and grading access.',
            bullets: [
              'Live Dhaka-evening classes',
              'Human + AI essay feedback',
              '2 or 3-part bKash split-pay',
              'Mushak 6.3 VAT invoice',
            ],
            ctaLabel: 'Join Live Cohort',
            ctaHref: '/sign-up',
          },
        ],
        passes: [
          {
            id: 'mock-pack-3',
            title: '3-Mock Exam Pack',
            price: '৳ 1,190',
            period: '90 days validity',
            body: 'Three full-length timed GRE or IELTS mocks for final practice.',
            bullets: [
              '3 full-length timed mock tests',
              'Complete answer explanations',
              'Estimated score breakdown',
            ],
            ctaLabel: 'Get 3-Mock Pack',
            ctaHref: '/sign-up',
          },
          {
            id: 'mock-pack-6',
            title: '6-Mock + Grading Pack',
            price: '৳ 2,990',
            period: '180 days validity',
            body: 'Six full mocks with automated essay and speaking rubric reviews.',
            bullets: [
              '6 full-length timed mock tests',
              '10 AI Writing & Speaking reviews',
              'Topic accuracy analytics',
              'Mushak 6.3 VAT invoice',
            ],
            ctaLabel: 'Get 6-Mock Pack',
            ctaHref: '/sign-up',
          },
          {
            id: 'ai-credits-10',
            title: '10 Evaluation Credits',
            price: '৳ 990',
            period: 'Never expires while active',
            body: 'Extra rubric-aligned Writing and Speaking evaluations on demand.',
            bullets: [
              '10 Writing or Speaking reviews',
              'Criterion-by-criterion feedback',
              'Works for GRE AWA & IELTS',
            ],
            ctaLabel: 'Add 10 Credits',
            ctaHref: '/sign-up',
          },
        ],
      },
      billing: {
        title: 'Billing, Split-Pay & Refunds',
        intro: 'Clear Bangladesh payment rules designed around local cards and mobile wallets.',
        blocks: [
          {
            icon: 'currency',
            title: 'bKash, Nagad & Local Cards',
            body: 'Pay securely in BDT via SSLCommerz using bKash, Nagad, Rocket, or Visa/Mastercard.',
          },
          {
            icon: 'calendar',
            title: 'bKash Split-Pay on Live Plans',
            body: 'Eligible live cohorts support 2-part or 3-part installment schedules directly in checkout.',
          },
          {
            icon: 'shield',
            title: '7-Day Fair Refund Window',
            body: 'Request a full refund within 7 days if less than 20% of course content is used.',
          },
        ],
      },
      faqTitle: 'Pricing & Payment Questions',
      faqs: [
        {
          question: '15% Mushak 6.3 VAT Invoice — Is VAT already included in listed BDT prices?',
          answer:
            'Yes. Every BDT price shown on this page already includes 15% Bangladesh VAT, and an official Mushak 6.3 tax invoice is generated automatically for every order.',
        },
        {
          question: '0% bKash 2-Part & 3-Part Split-Pay Schedule — How does installment billing work?',
          answer:
            'Eligible live cohorts let you pay 50% at enrollment and 50% on Day 30 (2-part), or 40% / 30% / 30% across 60 days (3-part) via bKash with zero interest or hidden fees.',
        },
        {
          question: '7-Day Fair Refund Window — What are the eligibility rules?',
          answer:
            'You can request a full refund within 7 calendar days of purchase as long as fewer than 20% of course lessons and fewer than 2 full mock tests have been used.',
        },
        {
          question: 'Switching Between Self-Paced and Live Cohorts — Can I upgrade later?',
          answer:
            'Yes. If you start on a Self-Paced track and decide to join a Dhaka-evening Live Cohort, you only pay the price difference between the two plans.',
        },
        {
          question: 'Can I pay in USD from outside Bangladesh?',
          answer:
            'Yes. International learners can check out in USD via card at checkout without local mobile wallet requirements.',
        },
        {
          question: 'Do mock exam scores guarantee my official test score?',
          answer:
            'All mock scores are clearly labeled as estimates based on rubric alignment and section performance, not official ETS or IELTS scores.',
        },
      ],
      ctaBand: {
        title: 'Try Before You Pay',
        body: 'Start with a free diagnostic test and sample lessons before choosing any plan.',
        ctaLabel: 'Create Free Account',
        ctaHref: '/sign-up',
      },
    },
    help: {
      breadcrumbLabel: 'Help Center',
      hero: {
        title: 'Help Center & Exam Day Support',
        body: 'Find clear answers on computer-delivered mocks, bKash and card payments, VAT invoices, and score review turnarounds.',
        ctaLabel: 'Take Free Diagnostic',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-help',
      },
      topics: {
        title: 'Support Topics',
        intro: 'Everything learners ask before starting a mock exam or enrolling in a course.',
        blocks: [
          {
            icon: 'clock',
            title: 'Mock Exam Timing & Resume',
            body: 'Exam deadlines are enforced on the server. If your connection drops, reconnect before the timer ends.',
          },
          {
            icon: 'currency',
            title: 'Payments & Mushak 6.3 Invoices',
            body: 'Download your VAT invoice directly from your billing history right after SSLCommerz confirms payment.',
          },
          {
            icon: 'shield',
            title: 'Account Security & 2FA',
            body: 'Protect your learner account with email verification and optional two-factor authentication.',
          },
          {
            icon: 'location',
            title: 'Dhaka Support Hours',
            body: 'Our Dhaka support team responds Sunday through Thursday, 10:00 AM to 8:00 PM BST.',
          },
        ],
      },
      faqTitle: 'Frequently Asked Questions',
      faqs: [
        {
          question: 'What browser works best for computer-delivered mocks?',
          answer:
            'Use the latest Chrome, Edge, or Firefox on desktop or laptop for full-screen mock tests and speaking audio recording.',
        },
        {
          question: 'How long does Writing and Speaking feedback take?',
          answer:
            'Automated rubric estimates return in under two minutes. Human-graded live cohort essays return within 48 hours.',
        },
        {
          question: 'Can I switch between English and Bangla interfaces?',
          answer:
            'Yes. Use the language switcher in the header at any time to view marketing and navigation in English or Bangla.',
        },
        {
          question: 'How do I request a refund?',
          answer:
            'Email our support desk from your registered address within 7 days of purchase with your order reference.',
        },
      ],
      ctaBand: {
        title: 'Still Have a Question?',
        body: 'Create your free account or review our transparent pricing and refund policy.',
        ctaLabel: 'View Pricing & FAQ',
        ctaHref: '/pricing',
      },
    },
    forInstitutions: {
      breadcrumbLabel: 'For Institutions',
      hero: {
        title: 'Corporate & University Cohorts with NBR Mushak 6.3',
        body: 'Bulk seat licensing in BDT ৳ and USD $ with Official NBR Mushak 6.3 Corporate & University VAT Chalans and PO or bank-transfer settlement.',
        ctaLabel: 'Request Proposal',
        ctaHref: '/for-institutions',
        photoSlot: 'hero-courses',
      },
      procurement: {
        title: 'Institutional Licensing & Tax Compliance',
        intro: 'Designed for university career centers, study-abroad departments, and corporate scholarship cohorts.',
        blocks: [
          {
            icon: 'shield',
            title: 'Official NBR Mushak 6.3 VAT Chalans',
            body: 'Automated 15% NBR Mushak 6.3 Corporate & University VAT Chalans issued with your 13-digit institutional BIN.',
          },
          {
            icon: 'currency',
            title: 'Bulk Seat Licensing (BDT ৳ & USD $)',
            body: 'Flexible volume tiers settled in BDT ৳ for Bangladesh campuses or USD $ for international partner grants.',
          },
          {
            icon: 'calendar',
            title: 'Purchase Order & Bank-Transfer Settlement',
            body: 'Net-30 institutional purchase orders, EFT/BEFTN bank-transfer settlement, and single-upload CSV roster provisioning.',
          },
        ],
      },
    },
  },
  bn: {
    home: {
      hero: {
        title: 'বাংলাদেশের জন্য কম্পিউটার-ভিত্তিক জিআরই ও আইইএলটিএস প্রস্তুতি',
        body: 'অ্যাডাপটিভ জিআরই সেকশন, ৪-স্কিল আইইএলটিএস মক পরীক্ষা, দ্বিভাষিক ভোকাবুলারি কার্ড এবং অফিসিয়াল ভ্যাট চালানসহ স্বচ্ছ টাকায় প্রস্তুতি নিন।',
        ctaLabel: 'ফ্রি ডায়াগনস্টিক দিন',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-home',
      },
      subBar: [
        { label: 'ফ্রি ডায়াগনস্টিক টেস্ট', href: '/exam/diagnostic' },
        { label: 'সব কোর্স দেখুন', href: '/courses' },
        { label: 'প্ল্যান ও মূল্য', href: '/pricing' },
      ],
      stats: [
        {
          value: '১ ঘণ্টা ৫৮ মি.',
          caption: 'কম্পিউটার-ভিত্তিক জিআরই ফরম্যাট',
          verified: true,
        },
        {
          value: '৪টি স্কিল',
          caption: 'আইইএলটিএস লিসেনিং, রিডিং, রাইটিং ও স্পিকিং',
          verified: true,
        },
        {
          value: '১,৫০০+',
          caption: 'দ্বিভাষিক অ্যাক্টিভ-রিকল ভোকাবুলারি কার্ড',
          verified: true,
        },
        {
          value: '৪০+ রুব্রিক',
          caption: 'স্বয়ংক্রিয় ও মেন্টর রাইটিং মূল্যায়ন মানদণ্ড',
          verified: true,
        },
      ],
      howItWorks: {
        title: 'আপনার প্রস্তুতির চারটি ধাপ',
        intro:
          'প্রথমে বর্তমান অবস্থান যাচাই করুন, ধাপে ধাপে পাঠ সম্পন্ন করুন এবং পরীক্ষার আসল সময়ে মক টেস্ট দিন।',
        steps: [
          {
            num: '1',
            title: 'ফ্রি ডায়াগনস্টিক দিন',
            body: '৩০ মিনিটের কম সময়ে আপনার ভার্বাল, কোয়ান্ট বা আইইএলটিএস ব্যান্ডের অবস্থান যাচাই করুন।',
            linkLabel: 'ডায়াগনস্টিক শুরু করুন',
            linkHref: '/exam/diagnostic',
          },
          {
            num: '2',
            title: 'মূল পাঠ অনুশীলন করুন',
            body: 'ভিডিও লেসন, বাংলা অর্থসহ ভোকাবুলারি এবং বিষয়ভিত্তিক প্রশ্ন অনুশীলন করুন।',
            linkLabel: 'কোর্স দেখুন',
            linkHref: '/courses',
          },
          {
            num: '3',
            title: 'সময় ধরে মক টেস্ট দিন',
            body: 'আসল কম্পিউটার-ভিত্তিক পরীক্ষার স্ক্রিন ও সময় মেনে পূর্ণাঙ্গ মক পরীক্ষা দিন।',
            linkLabel: 'জিআরই প্রিভিউ দেখুন',
            linkHref: '/gre',
          },
          {
            num: '4',
            title: 'রুব্রিক ফিডব্যাক দেখুন',
            body: 'আনুমানিক স্কোর, রচনা বিশ্লেষণ এবং পরবর্তী করণীয় তালিকা দেখে ভুল সংশোধন করুন।',
            linkLabel: 'প্ল্যান দেখুন',
            linkHref: '/pricing',
          },
        ],
      },
      examTracks: {
        title: 'আপনার পরীক্ষার ট্র্যাক বেছে নিন',
        intro: 'অফিসিয়াল কম্পিউটার-ভিত্তিক পরীক্ষার আদলে তৈরি পৃথক প্রস্তুতি ব্যবস্থা।',
        items: [
          {
            photoSlot: 'track-gre',
            accentColor: 'terracotta',
            title: 'জিআরই জেনারেল টেস্ট',
            href: '/gre',
            meta: '১ ঘণ্টা ৫৮ মি. • অ্যাডাপটিভ',
            body: 'সেকশন-অ্যাডাপটিভ মক টেস্ট ও সূত্র অনুশীলনের মাধ্যমে কোয়ান্ট, ভার্বাল ও রাইটিংয়ে দক্ষ হোন।',
            links: [
              { label: 'জিআরই ফরম্যাট দেখুন', href: '/gre' },
              { label: 'নমুনা প্রশ্ন দেখুন', href: '/gre#sample' },
            ],
          },
          {
            photoSlot: 'track-ielts-ac',
            accentColor: 'crimson',
            title: 'আইইএলটিএস একাডেমিক',
            href: '/ielts',
            meta: '৪টি স্কিল • উচ্চশিক্ষা ভর্তি',
            body: 'স্প্লিট-স্ক্রিন রিডিং প্যাসেজ, লিসেনিং অডিও এবং টাস্ক ১ চার্ট রাইটিং অনুশীলন করুন।',
            links: [
              { label: 'আইইএলটিএস একাডেমিক দেখুন', href: '/ielts' },
              { label: 'পরীক্ষার স্ক্রিন প্রিভিউ', href: '/exam/ielts-preview' },
            ],
          },
          {
            photoSlot: 'track-ielts-gt',
            accentColor: 'brand',
            title: 'আইইএলটিএস জেনারেল ট্রেনিং',
            href: '/ielts',
            meta: '৪টি স্কিল • অভিবাসন ও চাকরি',
            body: 'কর্মক্ষেত্রের রিডিং, ফরমাল লেটার রাইটিং এবং স্বাভাবিক স্পিকিং উত্তর অনুশীলন করুন।',
            links: [
              { label: 'জেনারেল ট্রেনিং দেখুন', href: '/ielts#format' },
              { label: 'আইইএলটিএস কোর্স দেখুন', href: '/courses' },
            ],
          },
        ],
      },
      diagnosticFeature: {
        photoSlot: 'split-diagnostic',
        title: 'ভর্তির আগে নিজের অবস্থান জানুন',
        body: 'যেকোনো কোর্সে ভর্তি হওয়ার আগে আমাদের ফ্রি ডায়াগনস্টিক টেস্ট দিয়ে দুর্বল বিষয়গুলো চিহ্নিত করুন।',
        ctaLabel: 'ফ্রি ডায়াগনস্টিক শুরু করুন',
        ctaHref: '/exam/diagnostic',
      },
      destinations: {
        title: 'বিশ্বের শীর্ষ গন্তব্যের জন্য প্রস্তুতি',
        intro: 'প্রধান ইংরেজি-ভাষী বিশ্ববিদ্যালয়গুলোর কাঙ্ক্ষিত স্কোর অর্জনের জন্য সুগঠিত অনুশীলন।',
        items: [
          {
            photoSlot: 'dest-usa',
            accentColor: 'brand',
            title: 'যুক্তরাষ্ট্র',
            href: '/gre',
            body: 'আমেরিকান গ্র্যাজুয়েট অ্যাডমিশনের জন্য প্রতিযোগিতামূলক জিআরই স্কোর তৈরি করুন।',
          },
          {
            photoSlot: 'dest-uk',
            accentColor: 'crimson',
            title: 'যুক্তরাজ্য',
            href: '/ielts',
            body: 'ব্রিটিশ বিশ্ববিদ্যালয়ের শর্ত পূরণে আইইএলটিএস-এর চারটি স্কিলে সমান দক্ষতা গড়ুন।',
          },
          {
            photoSlot: 'dest-canada',
            accentColor: 'terracotta',
            title: 'কানাডা',
            href: '/ielts',
            body: 'স্টাডি পারমিট বা অভিবাসনের জন্য একাডেমিক ও জেনারেল ট্রেনিং প্রস্তুতি নিন।',
          },
          {
            photoSlot: 'dest-australia',
            accentColor: 'accent',
            title: 'অস্ট্রেলিয়া',
            href: '/ielts',
            body: 'অস্ট্রেলীয় বিশ্ববিদ্যালয় ও ভিসার জন্য কম্পিউটার-ভিত্তিক আইইএলটিএস সময় চর্চা করুন।',
          },
        ],
      },
      ctaBand: {
        title: 'ফ্রি বেসলাইন টেস্ট দিয়ে শুরু করুন',
        body: 'কোনো পেমেন্ট ছাড়াই আপনার ফ্রি লুমেন একাডেমি অ্যাকাউন্ট তৈরি করে প্রস্তুতি যাচাই করুন।',
        ctaLabel: 'ফ্রি অ্যাকাউন্ট খুলুন',
        ctaHref: '/sign-up',
      },
    },
    gre: {
      breadcrumbLabel: 'জিআরই জেনারেল',
      hero: {
        title: 'কম্পিউটার-ভিত্তিক জিআরই প্রস্তুতি',
        body: '১ ঘণ্টা ৫৮ মিনিটের নতুন জিআরই ফরম্যাটে সেকশন-অ্যাডাপটিভ ভার্বাল ও কোয়ান্ট, অন-স্ক্রিন ক্যালকুলেটর এবং রুব্রিক-সম্মত রচনা ফিডব্যাকসহ অনুশীলন করুন।',
        ctaLabel: '১৫-মিনিটের জিআরই ডায়াগনস্টিক দিন',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-gre',
      },
      stats: [
        { value: '১ ঘ. ৫৮ মি.', caption: 'মোট পরীক্ষার সময়', verified: true },
        { value: '১৩০–১৭০', caption: 'কোয়ান্ট ও ভার্বাল স্কেল', verified: true },
        { value: '৫টি', caption: 'সময়বদ্ধ সেকশন', verified: true },
        { value: '০–৬', caption: 'অ্যানালিটিক্যাল রাইটিং স্কেল', verified: true },
      ],
      overview: {
        title: '১ ঘণ্টা ৫৮ মিনিটের অ্যাডাপটিভ ফরম্যাট',
        intro: 'প্রতিটি মক টেস্ট বর্তমান কম্পিউটার-ভিত্তিক জিআরই কাঠামো অনুসরণ করে তৈরি, যাতে পরীক্ষার দিন সময় ব্যবস্থাপনা সহজ হয়।',
        ctaLabel: 'জিআরই প্ল্যান দেখুন',
        ctaHref: '/pricing',
        blocks: [
          {
            icon: 'check',
            title: 'সেকশন-ভিত্তিক অ্যাডাপটিভ ধাপ',
            body: 'প্রথম সেকশনে আপনার সঠিকতা দ্বিতীয় সেকশনের কাঠিন্য নির্ধারণ করে, যা উচ্চতর স্কেলড স্কোর আনতে সাহায্য করে।',
          },
          {
            icon: 'clock',
            title: 'কোয়ান্টিটেটিভ কম্পারিজন ও ডেটা ইন্টারপ্রিটেশন',
            body: 'নম্বর-টেস্টিং কৌশল ও অন-স্ক্রিন ক্যালকুলেটরের মাধ্যমে রুট ও চিহ্নের ফাঁদ দ্রুত এড়িয়ে চলুন।',
          },
          {
            icon: 'shield',
            title: 'অ্যানালিটিক্যাল রাইটিং ইস্যু টাস্ক',
            body: 'স্পষ্ট থিসিস, পাল্টা যুক্তি ও উদাহরণসহ ৩০ মিনিটের রুব্রিক-সম্মত ইস্যু রচনা অনুশীলন করুন।',
          },
        ],
      },
      tabsTitle: 'অফিসিয়াল কাঠামো, স্কোরিং ও নমুনা প্রশ্ন',
      tabs: [
        {
          id: 'format',
          label: 'ফরম্যাট ও সেকশন সময়',
          title: '১ ঘণ্টা ৫৮ মিনিটে পাঁচটি সময়বদ্ধ সেকশন',
          body: 'প্রতিটি সেকশনের প্রশ্ন সংখ্যা, সময়সীমা ও স্ক্রিন টুলসের নিয়ম দেখতে নিচে ক্লিক করুন।',
          bullets: [],
          disclosures: [
            {
              summary: 'অ্যানালিটিক্যাল রাইটিং — ১টি টাস্ক (৩০ মিনিট)',
              detail:
                '০.০–৬.০ স্কেলে মূল্যায়িত একটি Analyze an Issue রচনা, যেখানে যুক্তির স্পষ্টতা ও ভাষাগত দক্ষতা যাচাই করা হয়।',
            },
            {
              summary: 'কোয়ান্টিটেটিভ রিজনিং — সেকশন ১: ১২ প্রশ্ন (২১ মি.) • সেকশন ২: ১৫ প্রশ্ন (২৬ মি.)',
              detail:
                'মোট ২৭টি প্রশ্ন; অন-স্ক্রিন ক্যালকুলেটরসহ কোয়ান্টিটেটিভ কম্পারিজন, প্রবলেম সলভিং ও ডেটা ইন্টারপ্রিটেশন অন্তর্ভুক্ত।',
            },
            {
              summary: 'ভার্বাল রিজনিং — সেকশন ১: ১২ প্রশ্ন (১৮ মি.) • সেকশন ২: ১৫ প্রশ্ন (২৩ মি.)',
              detail:
                'মোট ২৭টি প্রশ্ন; টেক্সট কমপ্লিশন, সেন্টেন্স ইকুইভ্যালেন্স ও একাডেমিক রিডিং কমপ্রিহেনশন যাচাই করে।',
            },
          ],
        },
        {
          id: 'scoring',
          label: 'অ্যাডাপটিভ স্কোরিং পদ্ধতি',
          title: 'সঠিক উত্তর থেকে ১৩০–১৭০ স্কেলড স্কোর',
          body: 'প্রথম সেকশনের সঠিকতা ও দ্বিতীয় সেকশনের কাঠিন্য মিলিয়ে ১৩০–১৭০ স্কেলে স্কোর নির্ধারিত হয়। প্রথম সেকশনে অসতর্ক ভুল দ্বিতীয় সেকশনের সর্বোচ্চ সীমা কমিয়ে দেয়।',
          bullets: [
            'প্রথম সেকশনে উচ্চ সঠিকতা ১৬০–১৭০ স্কোরের কঠিন দ্বিতীয় সেকশন উন্মুক্ত করে',
            'ভুল উত্তরে কোনো নেগেটিভ মার্কিং নেই—সময় শেষ হওয়ার আগে সব উত্তর দিন',
            'অ্যানালিটিক্যাল রাইটিং আলাদাভাবে ০.০–৬.০ হাফ-পয়েন্ট স্কেলে মূল্যায়িত হয়',
          ],
          ctaLabel: 'জিআরই স্কোর ক্যালকুলেটর খুলুন',
          ctaHref: '/tools/gre-score-calculator',
        },
        {
          id: 'sample',
          label: 'লাইভ কোয়ান্ট প্রশ্ন দেখুন',
          title: 'ইন্টারঅ্যাক্টিভ জিআরই প্রিভিউ',
          body: 'এই পাতা থেকেই একটি আসল জিআরই কোয়ান্টিটেটিভ কম্পারিজন প্রশ্ন সমাধান করে দেখুন।',
          bullets: [],
        },
      ],
      sections: {
        title: 'চারটি মূল প্রশ্নের ধরন যা আপনি আয়ত্ত করবেন',
        intro: 'প্রতিটি জিআরই প্রশ্নের ধরনের জন্য সুগঠিত পাঠ, ট্র্যাপ ক্লিনিক ও সময়বদ্ধ অনুশীলন।',
        items: [
          {
            photoSlot: 'track-gre',
            accentColor: 'terracotta',
            title: 'কোয়ান্টিটেটিভ কম্পারিজন',
            href: '/courses',
            meta: 'সেকশন ১ ও ২ • ট্র্যাপ ক্লিনিক',
            body: 'শূন্য, ঋণাত্মক ও ভগ্নাংশ বসিয়ে দ্রুত এবং নির্ভুলভাবে দুটি রাশির তুলনা করুন।',
          },
          {
            photoSlot: 'hero-gre',
            accentColor: 'brand',
            title: 'প্রবলেম সলভিং ও ডেটা অ্যানালাইসিস',
            href: '/courses',
            meta: '২৭ প্রশ্ন • ৪৭ মিনিট',
            body: 'নির্ধারিত সময়ের মধ্যে শতকরা, অনুপাত, বীজগণিত, জ্যামিতি ও চার্ট-ভিত্তিক প্রশ্ন সমাধান করুন।',
          },
          {
            photoSlot: 'mega-courses',
            accentColor: 'crimson',
            title: 'টেক্সট কমপ্লিশন ও সেন্টেন্স ইকুইভ্যালেন্স',
            href: '/courses',
            meta: '১,৫০০+ এফএসআরএস কার্ড',
            body: 'বাক্যের যুক্তি বুঝে শূন্যস্থান পূরণ করুন এবং স্পেসড রিপিটিশনের মাধ্যমে শব্দ মনে রাখুন।',
          },
          {
            photoSlot: 'split-diagnostic',
            accentColor: 'accent',
            title: 'অ্যানালিটিক্যাল রাইটিং ইস্যু রচনা',
            href: '/exam/diagnostic',
            meta: '১ রচনা • ৩০ মিনিট',
            body: '০–৬ রুব্রিক অনুযায়ী সুগঠিত থিসিস ও যুক্তিপূর্ণ অনুচ্ছেদ লেখার কৌশল শিখুন।',
          },
        ],
      },
      editorialQuote: {
        quote:
          'সেকশন-ভিত্তিক কঠিনতার মান পার্ট ১-এর নির্ভুলতার ওপর নির্ভর করে—এই রূপান্তর ধাপ আয়ত্ত করলেই ১৬৫+ স্কোর সম্ভব।',
        attribution: 'লুমেন জিআরই অনুষদ · অফিশিয়াল ইটিএস রুব্রিক',
        tone: 'cobalt',
      },
      splitFeatures: [
        {
          photoSlot: 'track-gre',
          photoSide: 'left',
          backdrop: 'orange',
          title: 'সেকশন-অ্যাডাপ্টিভ কোয়ান্ট ও ভার্বাল প্রস্তুতি',
          body: 'মার্ক-অ্যান্ড-রিভিউ ফ্ল্যাগ, অন-স্ক্রিন ক্যালকুলেটর এবং নির্ধারিত ২১ ও ২৬ মিনিটের সেকশনসহ প্রকৃত পরীক্ষার মতো ইন্টারফেসে অনুশীলন করুন।',
          ctaLabel: 'জিআরই প্ল্যান দেখুন',
          ctaHref: '/pricing',
        },
        {
          photoSlot: 'split-diagnostic',
          photoSide: 'right',
          backdrop: 'cobalt',
          title: 'ধাপে ধাপে ৩-স্তরের হিন্ট সহায়তা',
          body: 'সম্পূর্ণ সমাধান দেখার আগে ধারণামূলক ইঙ্গিত ব্যবহার করে কোয়ান্টিটেটিভ কম্পারিজন ও টেক্সট কমপ্লিশনে নিজস্ব দক্ষতা গড়ে তুলুন।',
          ctaLabel: 'ফ্রি ডায়াগনস্টিক দিন',
          ctaHref: '/exam/diagnostic',
        },
      ],
      roadmapTitle: '৮-সপ্তাহের জিআরই প্রস্তুতি রোডম্যাপ ও প্রশ্নোত্তর',
      roadmap: [
        {
          question: 'সপ্তাহ ১–২: কোয়ান্ট ফাউন্ডেশন ও রুট/সাইন ফাঁদ দূর করা',
          answer:
            'নাম্বার প্রপার্টিজ, সূচক, অসমতা ও জ্যামিতির ভিত্তি মজবুত করুন এবং প্রতিটি ভুল এরর-লগে নোট করুন।',
        },
        {
          question: 'সপ্তাহ ৩–৪: টেক্সট কমপ্লিশন, সেন্টেন্স ইকুইভ্যালেন্স ও এফএসআরএস ভোকাবুলারি',
          answer:
            'প্রতিদিন ৪০টি দ্বিভাষিক এফএসআরএস-৪.৫ শব্দ রিভিউ করুন এবং এক ও একাধিক শূন্যস্থানের যুক্তি অনুশীলন করুন।',
        },
        {
          question: 'সপ্তাহ ৫–৬: সেকশন-অ্যাডাপটিভ পেসিং ও ক্যালকুলেটর দক্ষতা',
          answer:
            '২১ ও ১৮ মিনিটের সেকশন ১ স্প্রিন্টে ফ্ল্যাগ-অ্যান্ড-স্কিপ কৌশল ও অন-স্ক্রিন ক্যালকুলেটর অনুশীলন করুন।',
        },
        {
          question: 'সপ্তাহ ৭–৮: পূর্ণাঙ্গ ১ ঘণ্টা ৫৮ মি. সিবিটি মক ও এরর-লগ বিশ্লেষণ',
          answer:
            '৪ থেকে ৬টি পূর্ণাঙ্গ সময়বদ্ধ অ্যাডাপটিভ মক পরীক্ষা দিন এবং প্রতিটি ভুলের কারণ বিশ্লেষণ করে রচনা চূড়ান্ত করুন।',
        },
      ],
      ctaBand: {
        title: 'আপনার জিআরই স্কোর যাচাই করতে প্রস্তুত?',
        body: '১৫ মিনিটের ফ্রি ডায়াগনস্টিক টেস্ট দিয়ে সেকশন-ভিত্তিক সঠিকতার রিপোর্ট দেখুন।',
        ctaLabel: 'জিআরই ডায়াগনস্টিক দিন',
        ctaHref: '/exam/diagnostic',
      },
    },
    ielts: {
      breadcrumbLabel: 'আইইএলটিএস প্রস্তুতি',
      hero: {
        title: 'কম্পিউটার-ভিত্তিক আইইএলটিএস ৪-স্কিল প্রস্তুতি',
        body: 'স্প্লিট-স্ক্রিন রিডিং, একবার শোনার লিসেনিং অডিও, রাইটিং মূল্যায়ন ও স্পিকিং অনুশীলনসহ একাডেমিক ও জেনারেল ট্রেনিংয়ের পূর্ণাঙ্গ প্রস্তুতি নিন।',
        ctaLabel: 'আইইএলটিএস প্রিভিউ দেখুন',
        ctaHref: '/exam/ielts-preview',
        photoSlot: 'hero-ielts',
      },
      stats: [
        { value: '২ ঘ. ৪৫ মি.', caption: 'লিসেনিং, রিডিং ও রাইটিং', verified: true },
        { value: 'ব্যান্ড ০–৯', caption: 'হাফ-ব্যান্ড রিপোর্টিং স্কেল', verified: true },
        { value: '৪টি স্কিল', caption: 'সব মডিউলে মূল্যায়ন', verified: true },
        { value: '৩ / ৪০', caption: 'রিডিং প্যাসেজ ও প্রশ্ন', verified: true },
      ],
      overview: {
        title: 'এক নজরে কম্পিউটার-ভিত্তিক আইইএলটিএস',
        intro: 'বাংলাদেশের পরীক্ষা কেন্দ্রের কম্পিউটার-ভিত্তিক ইন্টারফেস অনুযায়ী প্রতিটি মডিউল তৈরি।',
        ctaLabel: 'আইইএলটিএস প্ল্যান দেখুন',
        ctaHref: '/pricing',
        blocks: [
          {
            icon: 'check',
            title: 'স্প্লিট-স্ক্রিন রিডিং ও হাইলাইটিং',
            body: 'বাম পাশে প্যাসেজ রেখে ডান পাশে প্রশ্ন সমাধান ও গুরুত্বপূর্ণ অংশ হাইলাইট করার অনুশীলন করুন।',
          },
          {
            icon: 'clock',
            title: 'সিঙ্গেল-প্লে লিসেনিং অডিও ও নোট কমপ্লিশন',
            body: 'একবার শোনার আসল নিয়ম মেনে স্পিকার ডিস্ট্র্যাক্টর ও শব্দ-সীমা ধরে উত্তর লিখুন।',
          },
          {
            icon: 'shield',
            title: '৪-মানদণ্ডে রাইটিং ও স্পিকিং মূল্যায়ন',
            body: 'টাস্ক রেসপন্স, কোহেরেন্স, ভোকাবুলারি ও গ্রামারে অফিসিয়াল মানদণ্ড অনুযায়ী হাফ-ব্যান্ড ফিডব্যাক পান।',
          },
        ],
      },
      tabsTitle: 'পেপার বিশ্লেষণ, ব্যান্ড মানদণ্ড ও একাডেমিক বনাম জেনারেল',
      tabs: [
        {
          id: 'format',
          label: 'সেকশন সময় ও প্রশ্নের ধরন',
          title: 'অফিসিয়াল টাইমারে চারটি স্কিল',
          body: 'প্রতিটি পেপারের সময়সীমা, প্রশ্ন সংখ্যা ও টাস্ক ফরম্যাট দেখতে নিচে ক্লিক করুন।',
          bullets: [],
          disclosures: [
            {
              summary: 'লিসেনিং — ৩০ মি. + ২ মি. রিভিউ (৪ পার্ট, ৪০ প্রশ্ন)',
              detail:
                'দৈনন্দিন কথোপকথন ও একাডেমিক লেকচার একবার শুনে উত্তর দিতে হবে এবং শেষে ২ মিনিট উত্তর যাচাইয়ের সময় থাকবে।',
            },
            {
              summary: 'রিডিং — ৬০ মি. (৩ প্যাসেজ, ৪০ প্রশ্ন)',
              detail:
                'স্প্লিট-স্ক্রিনে True/False/Not Given, Matching Headings, Summary Completion ও MCQ প্রশ্ন সমাধান।',
            },
            {
              summary: 'রাইটিং — ৬০ মি. (টাস্ক ১: ১৫০ শব্দ / ২০ মি. + টাস্ক ২: ২৫০ শব্দ / ৪০ মি.)',
              detail:
                'লাইভ ওয়ার্ড কাউন্টারের মাধ্যমে চার্ট বা চিঠি এবং ২৫০+ শব্দের প্রবন্ধ লেখার অনুশীলন।',
            },
            {
              summary: 'স্পিকিং — ১১–১৪ মি. (পার্ট ১ ইন্টারভিউ, পার্ট ২ কিউ কার্ড, পার্ট ৩ আলোচনা)',
              detail:
                '১ মিনিটের কিউ-কার্ড প্রস্তুতি টাইমার ও রেকর্ড করা উত্তরের ওপর রুব্রিক ফিডব্যাক।',
            },
          ],
        },
        {
          id: 'scoring',
          label: 'ব্যান্ড ৭.০–৮.৫ স্কোরিং পদ্ধতি',
          title: 'চারটি অফিসিয়াল মূল্যায়ন মানদণ্ড',
          body: 'লিসেনিং ও রিডিং ৪০ প্রশ্নের সঠিকতার ওপর ভিত্তি করে হাফ-ব্যান্ডে রূপান্তরিত হয়। রাইটিং ও স্পিকিং চারটি সমান মানদণ্ডে মূল্যায়িত হয়।',
          bullets: [
            'Task Achievement / Response: প্রশ্নের সব অংশের প্রাসঙ্গিক ও যুক্তিপূর্ণ উত্তর দেওয়া',
            'Coherence & Cohesion: অনুচ্ছেদের সুশৃঙ্খল ধারাবাহিকতা ও স্বাভাবিক সংযোগকারী শব্দ',
            'Lexical Resource: সঠিক কলোকেশন ও বিষয়ভিত্তিক প্রাসঙ্গিক শব্দভাণ্ডার',
            'Grammatical Range & Accuracy: জটিল বাক্যের নির্ভুল ব্যবহার ও সঠিক বিরামচিহ্ন',
          ],
          ctaLabel: 'আইইএলটিএস ব্যান্ড ক্যালকুলেটর খুলুন',
          ctaHref: '/tools/ielts-band-calculator',
        },
        {
          id: 'academic-vs-gt',
          label: 'একাডেমিক বনাম জেনারেল ট্রেনিং',
          title: 'রিডিং ও রাইটিং টাস্ক ১-এর মূল পার্থক্য',
          body: 'লিসেনিং ও স্পিকিং উভয় মডিউলেই এক। শুধুমাত্র রিডিং প্যাসেজ ও রাইটিং টাস্ক ১ আলাদা।',
          bullets: [
            'একাডেমিক রিডিংয়ে ৩টি দীর্ঘ বিশ্ববিদ্যালয়-পর্যায়ের লেখা থাকে; জেনারেল ট্রেনিংয়ে থাকে কর্মক্ষেত্রের নোটিশ ও একটি দীর্ঘ লেখা',
            'একাডেমিক রাইটিং টাস্ক ১-এ চার্ট, গ্রাফ, টেবিল বা ম্যাপ বর্ণনা করতে হয় (১৫০+ শব্দ)',
            'জেনারেল ট্রেনিং রাইটিং টাস্ক ১-এ ফরমাল, সেমি-ফরমাল বা ইনফরমাল চিঠি লিখতে হয় (১৫০+ শব্দ)',
          ],
        },
      ],
      skills: {
        title: 'অফিসিয়াল ফরম্যাটের ওয়ার্কবেঞ্চে প্রতিটি আইইএলটিএস স্কিল অনুশীলন',
        intro: 'একাডেমিক ও জেনারেল ট্রেনিংয়ের প্রতিটি পেপারের জন্য আলাদা অনুশীলন।',
        items: [
          {
            photoSlot: 'hero-ielts',
            accentColor: 'crimson',
            title: 'লিসেনিং',
            href: '/exam/ielts-preview',
            meta: '৪০ প্রশ্ন • ৩০ মি. + ২ মি.',
            body: 'একবার শোনার নিয়ম মেনে দৈনন্দিন কথোপকথন ও একাডেমিক লেকচার অনুশীলন করুন।',
          },
          {
            photoSlot: 'track-ielts-ac',
            accentColor: 'brand',
            title: 'রিডিং',
            href: '/exam/ielts-preview',
            meta: '৪০ প্রশ্ন • ৬০ মিনিট',
            body: 'প্যাসেজ হাইলাইট করে ট্রু/ফলস/নট গিভেন ও হেডিং ম্যাচিং প্রশ্ন সমাধান করুন।',
          },
          {
            photoSlot: 'track-ielts-gt',
            accentColor: 'terracotta',
            title: 'রাইটিং',
            href: '/courses',
            meta: 'টাস্ক ১ ও ২ • ৬০ মিনিট',
            body: 'লাইভ ওয়ার্ড কাউন্টার ও রুব্রিক নোটসহ চার্ট, চিঠি ও প্রবন্ধ লিখুন।',
          },
          {
            photoSlot: 'split-diagnostic',
            accentColor: 'accent',
            title: 'স্পিকিং',
            href: '/courses',
            meta: 'পার্ট ১, ২ ও ৩ • ১১–১৪ মি.',
            body: 'কিউ-কার্ড ও ফলো-আপ উত্তর রেকর্ড করে ফ্লুয়েন্সি ও উচ্চারণের ফিডব্যাক দেখুন।',
          },
        ],
      },
      editorialQuote: {
        quote:
          'ব্যান্ড ৭.৫+ রাইটিংয়ের জন্য মুখস্থ টেমপ্লেট নয়, বরং স্পষ্ট টাস্ক রেসপন্স, সুসংগঠিত অনুচ্ছেদ এবং যথাযথ একাডেমিক শব্দচয়ন প্রয়োজন।',
        attribution: 'লুমেন আইইএলটিএস অনুষদ · অফিশিয়াল ব্যান্ড ডেসক্রিপ্টর',
        tone: 'crimson',
      },
      splitFeatures: [
        {
          photoSlot: 'track-ielts-ac',
          photoSide: 'left',
          backdrop: 'orange',
          title: 'চার-দক্ষতার কম্পিউটার-ভিত্তিক অনুশীলন',
          body: 'স্প্লিট-পেইন একাডেমিক রিডিং, একবার শোনা যায় এমন লিসেনিং অডিও এবং সময়-নির্ধারিত রাইটিং টাস্ক ১ ও ২ অনুশীলন করুন।',
          ctaLabel: 'আইইএলটিএস প্ল্যান দেখুন',
          ctaHref: '/pricing',
        },
        {
          photoSlot: 'track-ielts-gt',
          photoSide: 'right',
          backdrop: 'crimson',
          title: 'ব্যান্ড ৭.৫+ রুব্রিক ভিত্তিক মূল্যায়ন',
          body: 'প্রতিটি রাইটিং ও স্পিকিং অনুশীলনে টাস্ক অ্যাচিভমেন্ট, কোহেরেন্স, লেক্সিক্যাল রিসোর্স এবং গ্রামার অনুযায়ী বিস্তারিত ফিডব্যাক পান।',
          ctaLabel: 'ফ্রি ডায়াগনস্টিক দিন',
          ctaHref: '/exam/diagnostic',
        },
      ],
      roadmapTitle: '৬-সপ্তাহের ব্যান্ড ৭.৫+ প্রস্তুতি পরিকল্পনা ও সাধারণ প্রশ্ন',
      roadmap: [
        {
          question: 'সপ্তাহ ১–২: স্প্লিট-পেইন রিডিং গতি ও True/False/Not Given যুক্তি',
          answer:
            'স্কিমিং ও স্ক্যানিং দক্ষতা বাড়িয়ে ৫ মিনিট হাতে রেখেই ৩টি প্যাসেজের ৪০টি প্রশ্ন শেষ করার অনুশীলন করুন।',
        },
        {
          question: 'সপ্তাহ ৩–৪: রাইটিং টাস্ক ১ ডেটা বিশ্লেষণ ও টাস্ক ২ প্রবন্ধ কাঠামো',
          answer:
            'চার্টের ওভারভিউ বা চিঠির টোন আয়ত্ত করুন এবং ৪-অনুচ্ছেদের যুক্তিপূর্ণ টাস্ক ২ রচনা কাঠামো অনুশীলন করুন।',
        },
        {
          question: 'সপ্তাহ ৫: লিসেনিং ডিস্ট্র্যাক্টর শনাক্তকরণ ও পার্ট ২ কিউ-কার্ড ফ্লুয়েন্সি',
          answer:
            'লিসেনিং পার্ট ১–৪-এ বক্তার স্ব-সংশোধন ধরুন এবং পার্ট ২-এ বিরতিহীন ২ মিনিট কথা বলার অনুশীলন করুন।',
        },
        {
          question: 'সপ্তাহ ৬: পূর্ণাঙ্গ সময়বদ্ধ সিডি-আইইএলটিএস মক ও রুব্রিক মূল্যায়ন',
          answer:
            '২ ঘণ্টা ৪৫ মিনিটের পূর্ণাঙ্গ মক পরীক্ষা দিন এবং রাইটিং ও স্পিকিংয়ের মানদণ্ড-ভিত্তিক ফিডব্যাক যাচাই করুন।',
        },
      ],
      ctaBand: {
        title: 'আজই আইইএলটিএস পরীক্ষার স্ক্রিন দেখুন',
        body: 'আমাদের ফ্রি কম্পিউটার-ভিত্তিক প্রিভিউ ব্যবহার করুন অথবা বর্তমান ব্যান্ড যাচাই করুন।',
        ctaLabel: 'আইইএলটিএস প্রিভিউ খুলুন',
        ctaHref: '/exam/ielts-preview',
      },
    },
    courses: {
      breadcrumbLabel: 'কোর্সসমূহ',
      hero: {
        title: 'সুগঠিত জিআরই ও আইইএলটিএস কোর্স',
        body: 'নিজস্ব গতিতে ভিডিও ট্র্যাক অথবা ঢাকার সন্ধ্যাকালীন লাইভ ব্যাচ বেছে নিন। সব টিউশন ফি ১৫% ভ্যাটসহ টাকায় নির্ধারিত।',
        ctaLabel: 'ফ্রি ডায়াগনস্টিক দিন',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-courses',
      },
      filterTabs: [
        { id: 'all', label: 'সব কোর্স' },
        { id: 'gre', label: 'জিআরই' },
        { id: 'ielts', label: 'আইইএলটিএস' },
        { id: 'self-paced', label: 'সেলফ-পেসড' },
        { id: 'live', label: 'লাইভ ব্যাচ' },
      ],
      catalogTitle: 'কোর্স তালিকা',
      catalogIntro:
        'প্রতিটি কোর্সে রয়েছে ভিডিও লেসন, প্রশ্ন ব্যাংক, পূর্ণাঙ্গ মক টেস্ট এবং অফিসিয়াল মুসক ৬.৩ ভ্যাট চালান।',
      items: [
        {
          id: 'gre-self-paced',
          category: 'gre',
          mode: 'self-paced',
          photoSlot: 'track-gre',
          accentColor: 'terracotta',
          title: 'জিআরই কমপ্লিট সেলফ-পেসড',
          forWhom: 'যারা নিজস্ব সময়ে ৩১৫+ স্কোর লক্ষ্য করে প্রস্তুতি নিতে চান।',
          price: '৳ ৫,৯৯০',
          href: '/pricing',
          ctaLabel: 'জিআরই সেলফ-পেসড নিন',
          syllabusTitle: 'সিলেবাস দেখুন (মডিউল ১–৪)',
          syllabusModules: [
            'মডিউল ১: কোয়ান্ট ফাউন্ডেশন — নাম্বার প্রপার্টিজ, বীজগণিত, জ্যামিতি ও ডেটা (১৮ লেসন)',
            'মডিউল ২: ভার্বাল মাস্টারি — টেক্সট কমপ্লিশন, সেন্টেন্স ইকুইভ্যালেন্স ও রিডিং (১৪ লেসন)',
            'মডিউল ৩: দ্বিভাষিক ভোকাবুলারি — বাংলা অর্থসহ ১,৫০০+ এফএসআরএস-৪.৫ কার্ড',
            'মডিউল ৪: অ্যাডাপটিভ পরীক্ষা — ৬টি পূর্ণাঙ্গ ১ ঘ. ৫৮ মি. মক ও এডব্লিউএ রিভিউ',
          ],
        },
        {
          id: 'gre-live-cohort',
          category: 'gre',
          mode: 'live',
          photoSlot: 'hero-gre',
          accentColor: 'brand',
          title: 'জিআরই লাইভ ইভনিং ব্যাচ',
          forWhom: 'যারা ঢাকার সন্ধ্যাকালীন লাইভ ক্লাস ও শিক্ষকের সরাসরি দিকনির্দেশনা চান।',
          price: '৳ ১২,৯৯০',
          href: '/pricing',
          ctaLabel: 'জিআরই লাইভ ব্যাচে যোগ দিন',
          syllabusTitle: 'সিলেবাস দেখুন (মডিউল ১–৪)',
          syllabusModules: [
            'মডিউল ১: ২৪টি লাইভ সন্ধ্যাকালীন ক্লাস — কোয়ান্ট ট্র্যাপ ক্লিনিক ও ভার্বাল কৌশল (রবি/মঙ্গল/বৃহস্পতি)',
            'মডিউল ২: সকল সেলফ-পেসড ভিডিও ও ১,২০০+ অ্যাডাপটিভ প্রশ্ন ব্যাংকের পূর্ণ অ্যাক্সেস',
            'মডিউল ৩: সাপ্তাহিক অফিস আওয়ার ও ব্যক্তিগত স্টাডি প্ল্যান ফলো-আপ',
            'মডিউল ৪: এরর-লগ রিভিউসহ ৮টি পূর্ণাঙ্গ অ্যাডাপটিভ জিআরই মক পরীক্ষা',
          ],
        },
        {
          id: 'ielts-academic-self',
          category: 'ielts',
          mode: 'self-paced',
          photoSlot: 'track-ielts-ac',
          accentColor: 'crimson',
          title: 'আইইএলটিএস একাডেমিক কমপ্লিট',
          forWhom: 'বিদেশি বিশ্ববিদ্যালয়ে ভর্তির জন্য ব্যান্ড ৭.০ থেকে ৮.৫ প্রত্যাশীদের জন্য।',
          price: '৳ ৪,৯৯০',
          href: '/pricing',
          ctaLabel: 'আইইএলটিএস একাডেমিক নিন',
          syllabusTitle: 'সিলেবাস দেখুন (মডিউল ১–৪)',
          syllabusModules: [
            'মডিউল ১: লিসেনিং ও স্প্লিট-পেইন রিডিং — True/False/Not Given ও হেডিং ম্যাচিং (১৬ লেসন)',
            'মডিউল ২: একাডেমিক রাইটিং — টাস্ক ১ চার্ট/প্রসেস ও টাস্ক ২ প্রবন্ধ কাঠামো (১২ লেসন)',
            'মডিউল ৩: স্পিকিং ওয়ার্কবেঞ্চ — ৪-মানদণ্ড রুব্রিকসহ পার্ট ১–৩ কিউ-কার্ড অনুশীলন',
            'মডিউল ৪: পরীক্ষার অনুশীলন — ৬টি কম্পিউটার-ভিত্তিক মক ও ১২টি এআই মূল্যায়ন',
          ],
        },
        {
          id: 'ielts-gt-self',
          category: 'ielts',
          mode: 'self-paced',
          photoSlot: 'track-ielts-gt',
          accentColor: 'accent',
          title: 'আইইএলটিএস জেনারেল ট্রেনিং',
          forWhom: 'অভিবাসন ও কর্মক্ষেত্রের জন্য সব স্কিলে ব্যান্ড ৭.০+ প্রত্যাশীদের জন্য।',
          price: '৳ ৪,৪৯০',
          href: '/pricing',
          ctaLabel: 'জেনারেল ট্রেনিং নিন',
          syllabusTitle: 'সিলেবাস দেখুন (মডিউল ১–৪)',
          syllabusModules: [
            'মডিউল ১: দৈনন্দিন ও কর্মক্ষেত্রের রিডিং — নোটিশ, হ্যান্ডবুক ও প্যাসেজ স্কিমিং (১২ লেসন)',
            'মডিউল ২: টাস্ক ১ চিঠির কাঠামো — ফরমাল, সেমি-ফরমাল ও ইনফরমাল টোন (৮ লেসন)',
            'মডিউল ৩: টাস্ক ২ মতামত ও আলোচনাধর্মী রচনা + স্পিকিং পার্ট ১–৩ ফ্লুয়েন্সি অনুশীলন',
            'মডিউল ৪: পরীক্ষার অনুশীলন — ৫টি পূর্ণাঙ্গ কম্পিউটার-ভিত্তিক জেনারেল ট্রেনিং মক',
          ],
        },
        {
          id: 'ielts-live-cohort',
          category: 'ielts',
          mode: 'live',
          photoSlot: 'hero-ielts',
          accentColor: 'crimson',
          title: 'আইইএলটিএস লাইভ রাইটিং ও স্পিকিং',
          forWhom: 'যারা লাইভ কোচিং এবং শিক্ষকের হাতে রচনা মূল্যায়ন চান।',
          price: '৳ ৯,৯৯০',
          href: '/pricing',
          ctaLabel: 'আইইএলটিএস লাইভে যোগ দিন',
          syllabusTitle: 'সিলেবাস দেখুন (মডিউল ১–৪)',
          syllabusModules: [
            'মডিউল ১: রাইটিং টাস্ক ১/২ ও স্পিকিং ফ্লুয়েন্সির ওপর ১৮টি লাইভ সন্ধ্যাকালীন ওয়ার্কশপ',
            'মডিউল ২: ব্যান্ড মানদণ্ড অনুযায়ী শিক্ষকের হাতে ৮টি রচনা মূল্যায়ন ও বিস্তারিত নোট',
            'মডিউল ৩: উচ্চারণ ও শব্দভাণ্ডার কোচিংসহ ৪টি লাইভ ১-টু-১ স্পিকিং মক ইন্টারভিউ',
            'মডিউল ৪: কম্পিউটার-ভিত্তিক ৪-স্কিল মক টেস্ট লাইব্রেরি (৬টি সময়বদ্ধ মক অন্তর্ভুক্ত)',
          ],
        },
      ],
      ctaBand: {
        title: 'কোন কোর্সটি উপযুক্ত বুঝতে পারছেন না?',
        body: '৩০ মিনিটের ফ্রি ডায়াগনস্টিক দিয়ে আপনার জন্য সঠিক কোর্স পরামর্শ নিন।',
        ctaLabel: 'ফ্রি ডায়াগনস্টিক দিন',
        ctaHref: '/exam/diagnostic',
      },
    },
    pricing: {
      breadcrumbLabel: 'টিউশন ও প্ল্যান',
      hero: {
        title: 'স্বচ্ছ টাকায় টিউশন ও মক পাস',
        body: 'বিকাশ, নগদ বা কার্ডে এককালীন পেমেন্ট করুন। প্রতিটি মূল্যে ১৫% ভ্যাট ও অফিসিয়াল মুসক ৬.৩ চালান অন্তর্ভুক্ত।',
        ctaLabel: 'ফ্রি ডায়াগনস্টিক দিন',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-pricing',
      },
      notice: {
        title: 'প্রতিটি তালিকাভুক্ত টাকায় ১৫% ভ্যাট অন্তর্ভুক্ত',
        body: 'চেকআউটে কোনো গোপন চার্জ নেই। প্রতিটি অর্ডারে স্বয়ংক্রিয়ভাবে মুসক ৬.৩ ভ্যাট চালান তৈরি হয়।',
      },
      tabs: {
        fullCoursesLabel: 'পূর্ণাঙ্গ কোর্স',
        passesLabel: 'মক ও এআই ক্রেডিট পাস',
        fullCourses: [
          {
            id: 'free-starter',
            title: 'ফ্রি ডায়াগনস্টিক',
            price: '৳ ০',
            period: 'কার্ড ছাড়াই শুরু',
            body: 'পেইড প্ল্যান নেওয়ার আগে আপনার বর্তমান প্রস্তুতি যাচাই করুন।',
            bullets: [
              '১টি জিআরই বা আইইএলটিএস ডায়াগনস্টিক',
              '১০০টি দ্বিভাষিক ভোকাবুলারি কার্ড',
              'কম্পিউটার-ভিত্তিক পরীক্ষার নমুনা প্রিভিউ',
            ],
            ctaLabel: 'ফ্রি শুরু করুন',
            ctaHref: '/sign-up',
          },
          {
            id: 'ielts-complete',
            title: 'আইইএলটিএস কমপ্লিট',
            price: '৳ ৪,৯৯০',
            period: '৬ মাস অ্যাক্সেস',
            body: 'একাডেমিক বা জেনারেল ট্রেনিংয়ের পূর্ণাঙ্গ সেলফ-পেসড প্রস্তুতি।',
            bullets: [
              '৪টি স্কিলের সব ভিডিও মডিউল',
              '৬টি পূর্ণাঙ্গ কম্পিউটার-ভিত্তিক মক',
              '১২টি এআই রাইটিং ও স্পিকিং রিভিউ',
              'মুসক ৬.৩ ভ্যাট চালান',
            ],
            ctaLabel: 'আইইএলটিএস বেছে নিন',
            ctaHref: '/sign-up',
          },
          {
            id: 'gre-complete',
            title: 'জিআরই কমপ্লিট',
            price: '৳ ৫,৯৯০',
            period: '৬ মাস অ্যাক্সেস',
            body: 'ভার্বাল, কোয়ান্ট ও রাইটিংয়ের পূর্ণাঙ্গ সেলফ-পেসড প্রস্তুতি।',
            bullets: [
              'পূর্ণাঙ্গ কোয়ান্ট ও ভার্বাল ভিডিও লাইব্রেরি',
              '৬টি অ্যাডাপটিভ জিআরই মক পরীক্ষা',
              '১,৫০০+ দ্বিভাষিক ভোকাবুলারি কার্ড',
              'মুসক ৬.৩ ভ্যাট চালান',
            ],
            ctaLabel: 'জিআরই বেছে নিন',
            ctaHref: '/sign-up',
          },
          {
            id: 'live-bundle',
            title: 'লাইভ ব্যাচ + মক',
            price: '৳ ১২,৯৯০',
            period: 'লাইভ ব্যাচ + ৯ মাস',
            body: 'শিক্ষকের সরাসরি সন্ধ্যাকালীন ক্লাস এবং পূর্ণাঙ্গ মক ও গ্রেডিং সুবিধা।',
            bullets: [
              'ঢাকার সন্ধ্যাকালীন লাইভ ক্লাস',
              'শিক্ষক ও এআই রচনা ফিডব্যাক',
              'বিকাশে ২ বা ৩ কিস্তি সুবিধা',
              'মুসক ৬.৩ ভ্যাট চালান',
            ],
            ctaLabel: 'লাইভ ব্যাচে যোগ দিন',
            ctaHref: '/sign-up',
          },
        ],
        passes: [
          {
            id: 'mock-pack-3',
            title: '৩-মক এক্সাম প্যাক',
            price: '৳ ১,১৯০',
            period: '৯০ দিন মেয়াদ',
            body: 'চূড়ান্ত অনুশীলনের জন্য ৩টি পূর্ণাঙ্গ সময়বদ্ধ জিআরই বা আইইএলটিএস মক।',
            bullets: [
              '৩টি পূর্ণাঙ্গ সময়বদ্ধ মক পরীক্ষা',
              'সকল প্রশ্নের বিস্তারিত ব্যাখ্যা',
              'আনুমানিক স্কোর বিশ্লেষণ',
            ],
            ctaLabel: '৩-মক প্যাক নিন',
            ctaHref: '/sign-up',
          },
          {
            id: 'mock-pack-6',
            title: '৬-মক + গ্রেডিং প্যাক',
            price: '৳ ২,৯৯০',
            period: '১৮০ দিন মেয়াদ',
            body: 'স্বয়ংক্রিয় রচনা ও স্পিকিং রুব্রিক রিভিউসহ ৬টি পূর্ণাঙ্গ মক পরীক্ষা।',
            bullets: [
              '৬টি পূর্ণাঙ্গ সময়বদ্ধ মক পরীক্ষা',
              '১০টি এআই রাইটিং ও স্পিকিং রিভিউ',
              'বিষয়ভিত্তিক সঠিকতার রিপোর্ট',
              'মুসক ৬.৩ ভ্যাট চালান',
            ],
            ctaLabel: '৬-মক প্যাক নিন',
            ctaHref: '/sign-up',
          },
          {
            id: 'ai-credits-10',
            title: '১০ মূল্যায়ন ক্রেডিট',
            price: '৳ ৯৯০',
            period: 'সক্রিয় অ্যাকাউন্টে মেয়াদহীন',
            body: 'প্রয়োজন অনুযায়ী অতিরিক্ত রাইটিং ও স্পিকিং রুব্রিক মূল্যায়ন।',
            bullets: [
              '১০টি রাইটিং বা স্পিকিং রিভিউ',
              'মানদণ্ড-ভিত্তিক বিস্তারিত ফিডব্যাক',
              'জিআরই ও আইইএলটিএস উভয়েই কার্যকর',
            ],
            ctaLabel: '১০ ক্রেডিট যোগ করুন',
            ctaHref: '/sign-up',
          },
        ],
      },
      billing: {
        title: 'পেমেন্ট, কিস্তি ও রিফান্ড নীতি',
        intro: 'বাংলাদেশি কার্ড ও মোবাইল ওয়ালেটের জন্য সহজ ও স্বচ্ছ পেমেন্ট ব্যবস্থা।',
        blocks: [
          {
            icon: 'currency',
            title: 'বিকাশ, নগদ ও লোকাল কার্ড',
            body: 'এসএসএলকমার্জ-এর মাধ্যমে বিকাশ, নগদ, রকেট বা ভিসা/মাস্টারকার্ডে নিরাপদে টাকায় পেমেন্ট করুন।',
          },
          {
            icon: 'calendar',
            title: 'লাইভ ব্যাচে বিকাশ কিস্তি',
            body: 'নির্বাচিত লাইভ ব্যাচে চেকআউটের সময় ২ বা ৩ কিস্তিতে পেমেন্টের সুবিধা রয়েছে।',
          },
          {
            icon: 'shield',
            title: '৭ দিনের ন্যায্য রিফান্ড সুবিধা',
            body: 'কোর্সের ২০%-এর কম ব্যবহার করলে ৭ দিনের মধ্যে পূর্ণ রিফান্ডের আবেদন করা যাবে।',
          },
        ],
      },
      faqTitle: 'মূল্য ও পেমেন্ট সংক্রান্ত প্রশ্ন',
      faqs: [
        {
          question: '১৫% মুসক ৬.৩ ভ্যাট চালান — তালিকাভুক্ত টাকার মূল্যে কি ভ্যাট অন্তর্ভুক্ত?',
          answer:
            'হ্যাঁ। এখানে প্রদর্শিত প্রতিটি টাকার মূল্যে ১৫% বাংলাদেশ ভ্যাট অন্তর্ভুক্ত এবং প্রতিটি অর্ডারে স্বয়ংক্রিয়ভাবে অফিসিয়াল মুসক ৬.৩ চালান তৈরি হয়।',
        },
        {
          question: '০% বিকাশ ২ ও ৩ কিস্তি — স্প্লিট-পে সময়সূচি কীভাবে কাজ করে?',
          answer:
            'নির্বাচিত লাইভ ব্যাচে আপনি কোনো সুদ ছাড়াই ভর্তির সময় ৫০% এবং ৩০তম দিনে ৫০% (২ কিস্তি), অথবা ৬০ দিনে ৪০% / ৩০% / ৩০% (৩ কিস্তি) বিকাশে পরিশোধ করতে পারবেন।',
        },
        {
          question: '৭ দিনের ন্যায্য রিফান্ড সুবিধা — রিফান্ডের শর্তগুলো কী কী?',
          answer:
            'কেনার ৭ দিনের মধ্যে কোর্সের ২০%-এর কম লেসন এবং ২টির কম পূর্ণাঙ্গ মক টেস্ট ব্যবহার করলে সম্পূর্ণ রিফান্ডের আবেদন করা যাবে।',
        },
        {
          question: 'সেলফ-পেসড ও লাইভ ব্যাচের মধ্যে পরিবর্তন — পরে কি আপগ্রেড করা যাবে?',
          answer:
            'হ্যাঁ। সেলফ-পেসড ট্র্যাক দিয়ে শুরু করে পরে ঢাকার সন্ধ্যাকালীন লাইভ ব্যাচে যোগ দিতে চাইলে শুধুমাত্র দুই প্ল্যানের মূল্যের পার্থক্য পরিশোধ করলেই হবে।',
        },
        {
          question: 'বাংলাদেশের বাইরে থেকে কি ইউএস ডলারে পেমেন্ট করা যাবে?',
          answer:
            'হ্যাঁ। বিদেশে অবস্থানরত শিক্ষার্থীরা চেকআউটে কার্ডের মাধ্যমে সহজেই ইউএস ডলারে পেমেন্ট করতে পারবেন।',
        },
        {
          question: 'মক পরীক্ষার স্কোর কি আসল পরীক্ষার নিশ্চয়তা দেয়?',
          answer:
            'সব মক স্কোর স্পষ্টভাবে আনুমানিক স্কোর হিসেবে প্রদর্শিত হয়; এগুলো অফিসিয়াল ইটিএস বা আইইএলটিএস স্কোর নয়।',
        },
      ],
      ctaBand: {
        title: 'পেমেন্টের আগে যাচাই করে নিন',
        body: 'যেকোনো প্ল্যান নেওয়ার আগে ফ্রি ডায়াগনস্টিক ও নমুনা পাঠ ব্যবহার করে দেখুন।',
        ctaLabel: 'ফ্রি অ্যাকাউন্ট খুলুন',
        ctaHref: '/sign-up',
      },
    },
    help: {
      breadcrumbLabel: 'সহায়তা কেন্দ্র',
      hero: {
        title: 'সহায়তা কেন্দ্র ও পরীক্ষার নির্দেশনা',
        body: 'কম্পিউটার-ভিত্তিক মক পরীক্ষা, বিকাশ ও কার্ড পেমেন্ট, ভ্যাট চালান এবং স্কোর রিভিউ সংক্রান্ত সব প্রশ্নের উত্তর জানুন।',
        ctaLabel: 'ফ্রি ডায়াগনস্টিক দিন',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-help',
      },
      topics: {
        title: 'সহায়তার বিষয়সমূহ',
        intro: 'মক পরীক্ষা শুরু বা কোর্সে ভর্তির আগে শিক্ষার্থীদের সাধারণ জিজ্ঞাস্য।',
        blocks: [
          {
            icon: 'clock',
            title: 'মক পরীক্ষার সময় ও পুনঃসংযোগ',
            body: 'পরীক্ষার সময়সীমা সার্ভার থেকে নিয়ন্ত্রিত হয়। সংযোগ বিচ্ছিন্ন হলে সময় শেষ হওয়ার আগে আবার যুক্ত হোন।',
          },
          {
            icon: 'currency',
            title: 'পেমেন্ট ও মুসক ৬.৩ চালান',
            body: 'পেমেন্ট নিশ্চিত হওয়ার পরপরই আপনার বিলিং ইতিহাস থেকে ভ্যাট চালান ডাউনলোড করতে পারবেন।',
          },
          {
            icon: 'shield',
            title: 'অ্যাকাউন্ট নিরাপত্তা ও ২এফএ',
            body: 'ইমেইল যাচাইকরণ এবং ঐচ্ছিক টু-ফ্যাক্টর অথেনটিকেশনের মাধ্যমে আপনার অ্যাকাউন্ট সুরক্ষিত রাখুন।',
          },
          {
            icon: 'location',
            title: 'ঢাকা সাপোর্ট সময়সূচি',
            body: 'আমাদের ঢাকা সাপোর্ট দল রবি থেকে বৃহস্পতিবার সকাল ১০:০০টা থেকে রাত ৮:০০টা পর্যন্ত উত্তর দেয়।',
          },
        ],
      },
      faqTitle: 'সচরাচর জিজ্ঞাসিত প্রশ্ন',
      faqs: [
        {
          question: 'কম্পিউটার-ভিত্তিক মক পরীক্ষার জন্য কোন ব্রাউজার ভালো?',
          answer:
            'পূর্ণ স্ক্রিন মক ও স্পিকিং রেকর্ডিংয়ের জন্য ডেস্কটপ বা ল্যাপটপে আপডেটেড ক্রোম, এজ বা ফায়ারফক্স ব্যবহার করুন।',
        },
        {
          question: 'রাইটিং ও স্পিকিং ফিডব্যাক পেতে কত সময় লাগে?',
          answer:
            'স্বয়ংক্রিয় রুব্রিক বিশ্লেষণ দুই মিনিটের কম সময়ে পাওয়া যায়। শিক্ষকের মূল্যায়ন ৪৮ ঘণ্টার মধ্যে দেওয়া হয়।',
        },
        {
          question: 'আমি কি ইংরেজি ও বাংলা ভাষার মধ্যে পরিবর্তন করতে পারব?',
          answer:
            'হ্যাঁ। যেকোনো সময় হেডারের ভাষা পরিবর্তনকারী ব্যবহার করে ইংরেজি বা বাংলায় দেখতে পারবেন।',
        },
        {
          question: 'রিফান্ডের জন্য কীভাবে আবেদন করব?',
          answer:
            'ক্রয়ের ৭ দিনের মধ্যে আপনার নিবন্ধিত ইমেইল থেকে অর্ডার রেফারেন্সসহ আমাদের সাপোর্ট ঠিকানায় ইমেইল করুন।',
        },
      ],
      ctaBand: {
        title: 'আরও কোনো প্রশ্ন আছে?',
        body: 'ফ্রি অ্যাকাউন্ট তৈরি করুন অথবা আমাদের স্বচ্ছ মূল্য ও রিফান্ড নীতি দেখুন।',
        ctaLabel: 'মূল্য ও প্রশ্নোত্তর দেখুন',
        ctaHref: '/pricing',
      },
    },
    forInstitutions: {
      breadcrumbLabel: 'বিশ্ববিদ্যালয় ও প্রতিষ্ঠান',
      hero: {
        title: 'কর্পোরেট ও বিশ্ববিদ্যালয় কোহর্ট ও এনবিআর মূসক ৬.৩',
        body: 'অফিসিয়াল এনবিআর মূসক ৬.৩ কর্পোরেট ও বিশ্ববিদ্যালয় ভ্যাট চালান, BDT ৳ ও USD $ বাল্ক সিট লাইসেন্সিং এবং পিও বা ব্যাংক ট্রান্সফার সুবিধা।',
        ctaLabel: 'প্রস্তাবনার অনুরোধ করুন',
        ctaHref: '/for-institutions',
        photoSlot: 'hero-courses',
      },
      procurement: {
        title: 'প্রাতিষ্ঠানিক লাইসেন্সিং ও ভ্যাট নীতি',
        intro: 'বিশ্ববিদ্যালয়ের ক্যারিয়ার সেন্টার, উচ্চশিক্ষা সেল এবং কর্পোরেট স্কলারশিপ কোহর্টের জন্য উপযোগী।',
        blocks: [
          {
            icon: 'shield',
            title: 'অফিসিয়াল এনবিআর মূসক ৬.৩ ভ্যাট চালান',
            body: 'আপনার ১৩-ডিজিটের প্রাতিষ্ঠানিক BIN সহ স্বয়ংক্রিয় ১৫% এনবিআর মূসক ৬.৩ কর্পোরেট ও বিশ্ববিদ্যালয় চালান।',
          },
          {
            icon: 'currency',
            title: 'বাল্ক সিট লাইসেন্সিং (BDT ৳ ও USD $)',
            body: 'দেশীয় ক্যাম্পাসের জন্য BDT ৳ এবং আন্তর্জাতিক অনুদান কোহর্টের জন্য USD $ ভলিউম লাইসেন্সিং।',
          },
          {
            icon: 'calendar',
            title: 'পারচেজ অর্ডার ও ব্যাংক-ট্রান্সফার নিষ্পত্তি',
            body: 'নেট-৩০ প্রাতিষ্ঠানিক পিও, BEFTN ব্যাংক-ট্রান্সফার নিষ্পত্তি এবং একক CSV রোস্টার অনবোর্ডিং।',
          },
        ],
      },
    },
  },
};
