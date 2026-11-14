/** @purpose Word-capped bilingual (en & bn) marketing content store for /, /gre, /ielts, /courses, /pricing, and /help */
import { brand } from '@lumen/config';
import type { MediaSlotId } from './media';

export type MarketingLocale = 'en' | 'bn';
export type MarketingIcon = 'calendar' | 'currency' | 'location' | 'shield' | 'clock' | 'check';
export type MarketingAccent = 'brand' | 'crimson' | 'terracotta' | 'accent';

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

export interface TabSectionItem {
  id: string;
  label: string;
  title: string;
  body: string;
  bullets: string[];
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
    overview: {
      title: string;
      intro: string;
      ctaLabel: string;
      ctaHref: string;
      blocks: SideBlockItem[];
    };
    tabs: TabSectionItem[];
    sections: {
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
  ielts: {
    breadcrumbLabel: string;
    hero: {
      title: string;
      body: string;
      ctaLabel: string;
      ctaHref: string;
      photoSlot: MediaSlotId;
    };
    overview: {
      title: string;
      intro: string;
      ctaLabel: string;
      ctaHref: string;
      blocks: SideBlockItem[];
    };
    tabs: TabSectionItem[];
    skills: {
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
        { label: 'Compare BDT Plans', href: '/pricing' },
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
          value: '15% VAT',
          caption: 'Official Mushak 6.3 Invoice Included',
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
        body: 'Train for the shorter 1-hour 58-minute GRE with adaptive Verbal and Quantitative sections, an on-screen calculator, and essay rubric feedback.',
        ctaLabel: 'Try Free GRE Diagnostic',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-gre',
      },
      overview: {
        title: 'GRE Format at a Glance',
        intro:
          'Every mock test follows the current computer-delivered GRE structure so timing feels familiar on test day.',
        ctaLabel: 'View GRE Plans',
        ctaHref: '/pricing',
        blocks: [
          {
            icon: 'clock',
            title: '1h 58m Total Test Time',
            body: 'One 30-minute Issue essay plus two Verbal and two Quantitative sections.',
          },
          {
            icon: 'check',
            title: 'Section-Level Adaptivity',
            body: 'Your performance in Section 1 sets the difficulty level for Section 2.',
          },
          {
            icon: 'shield',
            title: 'Estimated 130–170 Scoring',
            body: 'Receive estimated Verbal and Quantitative scores with topic-level accuracy notes.',
          },
        ],
      },
      tabs: [
        {
          id: 'format',
          label: 'Format & timing',
          title: 'Five Timed Sections',
          body: 'Practice under the exact section sequence and clock pressure of the official computer test.',
          bullets: [
            'Analytical Writing: 1 Analyze an Issue task (30 minutes)',
            'Verbal Section 1 & 2: 27 questions total (41 minutes)',
            'Quantitative Section 1 & 2: 27 questions total (47 minutes)',
            'Built-in basic on-screen calculator for Quantitative sections',
          ],
        },
        {
          id: 'scoring',
          label: 'How scoring works',
          title: 'Transparent Score Estimates',
          body: 'Understand how raw accuracy and section difficulty shape your estimated GRE score.',
          bullets: [
            'Verbal and Quantitative estimated on the 130–170 scale',
            'Analytical Writing estimated on the 0.0–6.0 half-point scale',
            'Detailed question review with step-by-step explanations',
          ],
        },
        {
          id: 'sample',
          label: 'Try a sample question',
          title: 'Interactive GRE Preview',
          body: 'Test a real GRE Quantitative or Verbal prompt right below without leaving this page.',
          bullets: [
            'Instant answer check with clear reasoning',
            'Works on desktop and mobile viewports',
          ],
        },
      ],
      sections: {
        title: 'Four Core GRE Skill Areas',
        intro: 'Structured lessons and drills across every GRE question format.',
        items: [
          {
            accentColor: 'terracotta',
            title: 'Quantitative Reasoning',
            href: '/courses',
            meta: '27 Questions • 47 Minutes',
            body: 'Master Quantitative Comparison, Data Interpretation, algebra, geometry, and probability traps.',
          },
          {
            accentColor: 'brand',
            title: 'Verbal Reasoning',
            href: '/courses',
            meta: '27 Questions • 41 Minutes',
            body: 'Build accuracy in Text Completion, Sentence Equivalence, and dense Reading Comprehension.',
          },
          {
            accentColor: 'crimson',
            title: 'Analytical Writing',
            href: '/courses',
            meta: '1 Essay • 30 Minutes',
            body: 'Structure clear Issue essays with thesis clarity, examples, and rubric-aligned scoring.',
          },
          {
            accentColor: 'accent',
            title: 'Bilingual Vocabulary',
            href: '/courses',
            meta: '1,500+ Cards • Active Recall',
            body: 'Retain high-frequency GRE words with English context sentences and Bangla meanings.',
          },
        ],
      },
      ctaBand: {
        title: 'Ready to Benchmark Your GRE Score?',
        body: 'Take a free timed diagnostic and get a section-by-section accuracy breakdown.',
        ctaLabel: 'Start GRE Diagnostic',
        ctaHref: '/exam/diagnostic',
      },
    },
    ielts: {
      breadcrumbLabel: 'IELTS Prep',
      hero: {
        title: 'Computer-Delivered IELTS 4-Skill Prep',
        body: 'Prepare for IELTS Academic and General Training with split-screen Reading, timed Listening audio, Writing evaluation, and Speaking practice.',
        ctaLabel: 'Preview IELTS Workbench',
        ctaHref: '/exam/ielts-preview',
        photoSlot: 'hero-ielts',
      },
      overview: {
        title: 'IELTS Format at a Glance',
        intro:
          'Every practice module mirrors the computer-delivered test interface used in Bangladesh test centers.',
        ctaLabel: 'Compare IELTS Plans',
        ctaHref: '/pricing',
        blocks: [
          {
            icon: 'clock',
            title: '2h 45m Core Listening, Reading & Writing',
            body: 'Complete Listening, split-pane Reading, and word-counted Writing under real timers.',
          },
          {
            icon: 'check',
            title: 'Academic & General Training',
            body: 'Switch cleanly between Academic charts and General Training letters and texts.',
          },
          {
            icon: 'shield',
            title: '4-Criterion Rubric Estimates',
            body: 'Writing and Speaking feedback follows official band descriptors on the 0–9 scale.',
          },
        ],
      },
      tabs: [
        {
          id: 'format',
          label: 'Format & timing',
          title: 'Four Skills, One Workspace',
          body: 'Train on the exact layout conventions of computer-delivered IELTS.',
          bullets: [
            'Listening: 40 questions across 4 recordings (about 30 minutes)',
            'Reading: 40 questions across 3 passages (60 minutes)',
            'Writing: Task 1 (150+ words) and Task 2 (250+ words) in 60 minutes',
            'Speaking: 3 structured parts recorded for rubric evaluation (11–14 minutes)',
          ],
        },
        {
          id: 'scoring',
          label: 'How scoring works',
          title: 'Band 0.0 to 9.0 Breakdown',
          body: 'See estimated half-band scores for each skill plus actionable improvement notes.',
          bullets: [
            'Listening & Reading scored against 40-question band conversion',
            'Writing reviewed for Task Achievement, Coherence, Lexical Resource, and Grammar',
            'Speaking reviewed for Fluency, Vocabulary, Grammar, and Pronunciation',
          ],
        },
        {
          id: 'preview',
          label: 'Try a sample question',
          title: 'Launch the IELTS Preview',
          body: 'Open our interactive split-screen IELTS preview to test highlighting and timer controls.',
          bullets: [
            'Side-by-side passage highlighting and question navigation',
            'Live word counter for Writing Task 1 and Task 2',
          ],
        },
      ],
      skills: {
        title: 'All Four IELTS Skills Covered',
        intro: 'Focused practice for every paper in Academic and General Training.',
        items: [
          {
            accentColor: 'crimson',
            title: 'Listening',
            href: '/exam/ielts-preview',
            meta: '40 Questions • ~30 Minutes',
            body: 'Practice everyday dialogues and academic lectures with single-play exam audio rules.',
          },
          {
            accentColor: 'brand',
            title: 'Reading',
            href: '/exam/ielts-preview',
            meta: '40 Questions • 60 Minutes',
            body: 'Highlight passages and solve True/False/Not Given, matching headings, and summary tasks.',
          },
          {
            accentColor: 'terracotta',
            title: 'Writing',
            href: '/courses',
            meta: 'Task 1 & Task 2 • 60 Minutes',
            body: 'Draft Academic charts, General letters, and essays with live word counts and rubric notes.',
          },
          {
            accentColor: 'accent',
            title: 'Speaking',
            href: '/courses',
            meta: 'Parts 1, 2 & 3 • 11–14 Min',
            body: 'Record cue-card and follow-up responses and review fluency and pronunciation feedback.',
          },
        ],
      },
      ctaBand: {
        title: 'Experience the IELTS Test Screen Today',
        body: 'Try our free computer-delivered preview or benchmark your current band.',
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
          syllabusTitle: 'View syllabus',
          syllabusModules: [
            'Quantitative Foundations: Arithmetic, Algebra, Geometry & Data',
            'Verbal Mastery: Text Completion, Sentence Equivalence & Reading',
            '1,500+ Bilingual GRE Vocabulary Cards',
            '6 Full-Length Section-Adaptive Mock Tests + AWA Reviews',
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
          syllabusTitle: 'View syllabus',
          syllabusModules: [
            '24 Live Interactive Sessions (Sun/Tue/Thu Dhaka Evenings)',
            'Full Self-Paced Video & Question Bank Access',
            '8 Full-Length Adaptive GRE Mocks',
            'Instructor Office Hours & Study Plan Check-ins',
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
          syllabusTitle: 'View syllabus',
          syllabusModules: [
            'Listening & Reading Speed Strategies with Split-Pane Practice',
            'Writing Task 1 Charts & Task 2 Essay Structures',
            'Speaking Cue-Card Drills with Rubric Evaluation',
            '6 Full Computer-Delivered IELTS Academic Mocks',
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
          syllabusTitle: 'View syllabus',
          syllabusModules: [
            'Workplace & Everyday Reading Comprehension Drills',
            'Formal, Semi-Formal & Informal Letter Frameworks',
            'Task 2 Opinion & Discussion Essay Feedback',
            '5 Full Computer-Delivered General Training Mocks',
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
          syllabusTitle: 'View syllabus',
          syllabusModules: [
            '18 Live Evening Workshops on Writing & Speaking',
            '8 Human-Graded Writing Tasks with Line-by-Line Notes',
            '4 Live 1-on-1 Speaking Mock Interviews',
            'Full Computer-Delivered 4-Skill Mock Library',
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
          question: 'Is 15% VAT already included in the listed BDT prices?',
          answer:
            'Yes. Every BDT price shown on this page already includes 15% Bangladesh VAT, and you receive an official Mushak 6.3 invoice.',
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
        { label: 'টাকায় প্ল্যান তুলনা করুন', href: '/pricing' },
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
          value: '১৫% ভ্যাট',
          caption: 'অফিসিয়াল মুসক ৬.৩ চালান অন্তর্ভুক্ত',
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
        body: '১ ঘণ্টা ৫৮ মিনিটের নতুন জিআরই ফরম্যাটে অ্যাডাপটিভ ভার্বাল ও কোয়ান্ট, অন-স্ক্রিন ক্যালকুলেটর এবং রচনা ফিডব্যাকসহ অনুশীলন করুন।',
        ctaLabel: 'ফ্রি জিআরই ডায়াগনস্টিক দিন',
        ctaHref: '/exam/diagnostic',
        photoSlot: 'hero-gre',
      },
      overview: {
        title: 'এক নজরে জিআরই ফরম্যাট',
        intro: 'প্রতিটি মক টেস্ট বর্তমান কম্পিউটার-ভিত্তিক জিআরই কাঠামো অনুসরণ করে তৈরি।',
        ctaLabel: 'জিআরই প্ল্যান দেখুন',
        ctaHref: '/pricing',
        blocks: [
          {
            icon: 'clock',
            title: 'মোট সময় ১ ঘণ্টা ৫৮ মিনিট',
            body: '৩০ মিনিটের একটি ইস্যু রচনা এবং দুটি করে ভার্বাল ও কোয়ান্ট সেকশন।',
          },
          {
            icon: 'check',
            title: 'সেকশন-ভিত্তিক অ্যাডাপটিভ ধাপ',
            body: 'প্রথম সেকশনের ফলাফলের ওপর ভিত্তি করে দ্বিতীয় সেকশনের কাঠিন্য নির্ধারিত হয়।',
          },
          {
            icon: 'shield',
            title: 'আনুমানিক ১৩০–১৭০ স্কোরিং',
            body: 'ভার্বাল ও কোয়ান্টে আনুমানিক স্কোর এবং বিষয়ভিত্তিক সঠিকতার বিশ্লেষণ পান।',
          },
        ],
      },
      tabs: [
        {
          id: 'format',
          label: 'ফরম্যাট ও সময়',
          title: 'পাঁচটি সময়বদ্ধ সেকশন',
          body: 'আসল কম্পিউটার পরীক্ষার ক্রম ও সময়সীমা মেনে প্রতিটি সেকশন অনুশীলন করুন।',
          bullets: [
            'অ্যানালিটিক্যাল রাইটিং: ১টি ইস্যু রচনা (৩০ মিনিট)',
            'ভার্বাল সেকশন ১ ও ২: মোট ২৭টি প্রশ্ন (৪১ মিনিট)',
            'কোয়ান্টিটেটিভ সেকশন ১ ও ২: মোট ২৭টি প্রশ্ন (৪৭ মিনিট)',
            'কোয়ান্ট সেকশনে বিল্ট-ইন অন-স্ক্রিন ক্যালকুলেটর সুবিধা',
          ],
        },
        {
          id: 'scoring',
          label: 'স্কোরিং পদ্ধতি',
          title: 'স্বচ্ছ আনুমানিক স্কোর',
          body: 'সঠিক উত্তর ও সেকশনের কাঠিন্য কীভাবে আপনার আনুমানিক স্কোর নির্ধারণ করে তা জানুন।',
          bullets: [
            'ভার্বাল ও কোয়ান্ট ১৩০–১৭০ স্কেলে আনুমানিক স্কোর',
            'অ্যানালিটিক্যাল রাইটিং ০.০–৬.০ স্কেলে মূল্যায়ন',
            'প্রতিটি প্রশ্নের ধাপে ধাপে ব্যাখ্যা ও সমাধান',
          ],
        },
        {
          id: 'sample',
          label: 'নমুনা প্রশ্ন দেখুন',
          title: 'ইন্টারঅ্যাক্টিভ জিআরই প্রিভিউ',
          body: 'এই পাতা থেকেই একটি আসল জিআরই কোয়ান্ট বা ভার্বাল প্রশ্ন সমাধান করে দেখুন।',
          bullets: [
            'তাৎক্ষণিক উত্তর যাচাই ও ব্যাখ্যা',
            'ডেস্কটপ ও মোবাইল উভয় স্ক্রিনে ব্যবহারযোগ্য',
          ],
        },
      ],
      sections: {
        title: 'জিআরই-এর চারটি মূল দক্ষতা',
        intro: 'প্রতিটি প্রশ্নের ধরনের জন্য সুগঠিত পাঠ ও অনুশীলন।',
        items: [
          {
            accentColor: 'terracotta',
            title: 'কোয়ান্টিটেটিভ রিজনিং',
            href: '/courses',
            meta: '২৭ প্রশ্ন • ৪৭ মিনিট',
            body: 'কোয়ান্টিটেটিভ কম্পারিজন, ডেটা ইন্টারপ্রিটেশন, বীজগণিত ও জ্যামিতিতে দক্ষতা অর্জন করুন।',
          },
          {
            accentColor: 'brand',
            title: 'ভার্বাল রিজনিং',
            href: '/courses',
            meta: '২৭ প্রশ্ন • ৪১ মিনিট',
            body: 'টেক্সট কমপ্লিশন, সেন্টেন্স ইকুইভ্যালেন্স এবং জটিল রিডিং প্যাসেজে সঠিকতা বাড়ান।',
          },
          {
            accentColor: 'crimson',
            title: 'অ্যানালিটিক্যাল রাইটিং',
            href: '/courses',
            meta: '১ রচনা • ৩০ মিনিট',
            body: 'স্পষ্ট যুক্তি ও উদাহরণসহ রুব্রিক-সম্মত ইস্যু রচনা লেখার কৌশল শিখুন।',
          },
          {
            accentColor: 'accent',
            title: 'দ্বিভাষিক ভোকাবুলারি',
            href: '/courses',
            meta: '১,৫০০+ কার্ড • অ্যাক্টিভ রিকল',
            body: 'ইংরেজি বাক্য ও বাংলা অর্থসহ গুরুত্বপূর্ণ জিআরই শব্দগুলো সহজে মনে রাখুন।',
          },
        ],
      },
      ctaBand: {
        title: 'আপনার জিআরই স্কোর যাচাই করতে প্রস্তুত?',
        body: 'ফ্রি সময়বদ্ধ ডায়াগনস্টিক টেস্ট দিয়ে সেকশন-ভিত্তিক সঠিকতার রিপোর্ট দেখুন।',
        ctaLabel: 'জিআরই ডায়াগনস্টিক দিন',
        ctaHref: '/exam/diagnostic',
      },
    },
    ielts: {
      breadcrumbLabel: 'আইইএলটিএস প্রস্তুতি',
      hero: {
        title: 'কম্পিউটার-ভিত্তিক আইইএলটিএস ৪-স্কিল প্রস্তুতি',
        body: 'স্প্লিট-স্ক্রিন রিডিং, লিসেনিং অডিও, রাইটিং মূল্যায়ন ও স্পিকিং অনুশীলনসহ একাডেমিক ও জেনারেল ট্রেনিংয়ের পূর্ণাঙ্গ প্রস্তুতি নিন।',
        ctaLabel: 'আইইএলটিএস প্রিভিউ দেখুন',
        ctaHref: '/exam/ielts-preview',
        photoSlot: 'hero-ielts',
      },
      overview: {
        title: 'এক নজরে আইইএলটিএস ফরম্যাট',
        intro: 'বাংলাদেশের পরীক্ষা কেন্দ্রের কম্পিউটার-ভিত্তিক ইন্টারফেস অনুযায়ী প্রতিটি মডিউল তৈরি।',
        ctaLabel: 'আইইএলটিএস প্ল্যান দেখুন',
        ctaHref: '/pricing',
        blocks: [
          {
            icon: 'clock',
            title: '২ ঘণ্টা ৪৫ মিনিটের মূল পরীক্ষা',
            body: 'আসল টাইমারসহ লিসেনিং, স্প্লিট-পেইন রিডিং এবং ওয়ার্ড-কাউন্টেড রাইটিং অনুশীলন।',
          },
          {
            icon: 'check',
            title: 'একাডেমিক ও জেনারেল ট্রেনিং',
            body: 'একাডেমিক চার্ট অথবা জেনারেল ট্রেনিং লেটারের মধ্যে সহজেই বেছে নিন।',
          },
          {
            icon: 'shield',
            title: '৪-মানদণ্ডে আনুমানিক ব্যান্ড',
            body: 'রাইটিং ও স্পিকিং ফিডব্যাক ০–৯ ব্যান্ডের অফিসিয়াল মানদণ্ড অনুসরণ করে।',
          },
        ],
      },
      tabs: [
        {
          id: 'format',
          label: 'ফরম্যাট ও সময়',
          title: 'এক ওয়ার্কস্পেসে চারটি স্কিল',
          body: 'কম্পিউটার-ভিত্তিক আইইএলটিএস পরীক্ষার আসল নিয়ম মেনে অনুশীলন করুন।',
          bullets: [
            'লিসেনিং: ৪টি রেকর্ডিংয়ে ৪০ প্রশ্ন (প্রায় ৩০ মিনিট)',
            'রিডিং: ৩টি প্যাসেজে ৪০ প্রশ্ন (৬০ মিনিট)',
            'রাইটিং: টাস্ক ১ (১৫০+ শব্দ) ও টাস্ক ২ (২৫০+ শব্দ) ৬০ মিনিটে',
            'স্পিকিং: রুব্রিক মূল্যায়নের জন্য ৩ ধাপের রেকর্ডিং (১১–১৪ মিনিট)',
          ],
        },
        {
          id: 'scoring',
          label: 'স্কোরিং পদ্ধতি',
          title: '০.০ থেকে ৯.০ ব্যান্ড বিশ্লেষণ',
          body: 'প্রতিটি স্কিলের আনুমানিক হাফ-ব্যান্ড স্কোর এবং উন্নতির স্পষ্ট নির্দেশনা পান।',
          bullets: [
            'লিসেনিং ও রিডিং ৪০-প্রশ্নের ব্যান্ড স্কেলে রূপান্তরিত',
            'রাইটিংয়ে টাস্ক রেসপন্স, কোহেরেন্স, ভোকাবুলারি ও গ্রামার মূল্যায়ন',
            'স্পিকিংয়ে ফ্লুয়েন্সি, শব্দভান্ডার, গ্রামার ও উচ্চারণ মূল্যায়ন',
          ],
        },
        {
          id: 'preview',
          label: 'নমুনা প্রশ্ন দেখুন',
          title: 'আইইএলটিএস প্রিভিউ চালু করুন',
          body: 'আমাদের স্প্লিট-স্ক্রিন প্রিভিউ খুলে হাইলাইটিং ও টাইমার নিয়ন্ত্রণ পরীক্ষা করুন।',
          bullets: [
            'পাশাপাশি প্যাসেজ হাইলাইটিং ও প্রশ্ন নেভিগেশন',
            'রাইটিং টাস্ক ১ ও ২-এর জন্য লাইভ শব্দ গণনা',
          ],
        },
      ],
      skills: {
        title: 'আইইএলটিএস-এর চারটি স্কিল',
        intro: 'একাডেমিক ও জেনারেল ট্রেনিংয়ের প্রতিটি পেপারের জন্য আলাদা অনুশীলন।',
        items: [
          {
            accentColor: 'crimson',
            title: 'লিসেনিং',
            href: '/exam/ielts-preview',
            meta: '৪০ প্রশ্ন • ~৩০ মিনিট',
            body: 'একবার শোনার নিয়ম মেনে দৈনন্দিন কথোপকথন ও একাডেমিক লেকচার অনুশীলন করুন।',
          },
          {
            accentColor: 'brand',
            title: 'রিডিং',
            href: '/exam/ielts-preview',
            meta: '৪০ প্রশ্ন • ৬০ মিনিট',
            body: 'প্যাসেজ হাইলাইট করে ট্রু/ফলস/নট গিভেন ও হেডিং ম্যাচিং প্রশ্ন সমাধান করুন।',
          },
          {
            accentColor: 'terracotta',
            title: 'রাইটিং',
            href: '/courses',
            meta: 'টাস্ক ১ ও ২ • ৬০ মিনিট',
            body: 'লাইভ ওয়ার্ড কাউন্টার ও রুব্রিক নোটসহ চার্ট, চিঠি ও প্রবন্ধ লিখুন।',
          },
          {
            accentColor: 'accent',
            title: 'স্পিকিং',
            href: '/courses',
            meta: 'পার্ট ১, ২ ও ৩ • ১১–১৪ মি.',
            body: 'কিউ-কার্ড ও ফলো-আপ উত্তর রেকর্ড করে ফ্লুয়েন্সি ও উচ্চারণের ফিডব্যাক দেখুন।',
          },
        ],
      },
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
          syllabusTitle: 'সিলেবাস দেখুন',
          syllabusModules: [
            'কোয়ান্ট ফাউন্ডেশন: পাটিগণিত, বীজগণিত, জ্যামিতি ও ডেটা',
            'ভার্বাল মাস্টারি: টেক্সট কমপ্লিশন ও রিডিং কমপ্রিহেনশন',
            '১,৫০০+ দ্বিভাষিক জিআরই ভোকাবুলারি কার্ড',
            '৬টি পূর্ণাঙ্গ অ্যাডাপটিভ মক টেস্ট ও রচনা রিভিউ',
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
          syllabusTitle: 'সিলেবাস দেখুন',
          syllabusModules: [
            '২৪টি লাইভ ক্লাস (রবি/মঙ্গল/বৃহস্পতি সন্ধ্যা)',
            'সকল সেলফ-পেসড ভিডিও ও প্রশ্ন ব্যাংকের পূর্ণ অ্যাক্সেস',
            '৮টি পূর্ণাঙ্গ অ্যাডাপটিভ জিআরই মক পরীক্ষা',
            'সাপ্তাহিক অফিস আওয়ার ও স্টাডি প্ল্যান ফলো-আপ',
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
          syllabusTitle: 'সিলেবাস দেখুন',
          syllabusModules: [
            'স্প্লিট-পেইন লিসেনিং ও রিডিং দ্রুত সমাধান কৌশল',
            'রাইটিং টাস্ক ১ চার্ট ও টাস্ক ২ প্রবন্ধ কাঠামো',
            'রুব্রিক মূল্যায়নসহ স্পিকিং কিউ-কার্ড অনুশীলন',
            '৬টি পূর্ণাঙ্গ কম্পিউটার-ভিত্তিক আইইএলটিএস একাডেমিক মক',
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
          syllabusTitle: 'সিলেবাস দেখুন',
          syllabusModules: [
            'কর্মক্ষেত্র ও দৈনন্দিন রিডিং কমপ্রিহেনশন অনুশীলন',
            'ফরমাল, সেমি-ফরমাল ও ইনফরমাল চিঠির কাঠামো',
            'টাস্ক ২ মতামত ও আলোচনাধর্মী রচনা ফিডব্যাক',
            '৫টি পূর্ণাঙ্গ জেনারেল ট্রেনিং মক পরীক্ষা',
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
          syllabusTitle: 'সিলেবাস দেখুন',
          syllabusModules: [
            'রাইটিং ও স্পিকিংয়ের ওপর ১৮টি লাইভ সন্ধ্যাকালীন ওয়ার্কশপ',
            'শিক্ষকের হাতে ৮টি রচনা মূল্যায়ন ও বিস্তারিত নোট',
            '৪টি লাইভ ১-টু-১ স্পিকিং মক ইন্টারভিউ',
            'কম্পিউটার-ভিত্তিক ৪-স্কিল মক টেস্ট লাইব্রেরি',
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
          question: 'তালিকাভুক্ত টাকার মূল্যে কি ১৫% ভ্যাট অন্তর্ভুক্ত?',
          answer:
            'হ্যাঁ। এখানে প্রদর্শিত প্রতিটি টাকার মূল্যে ১৫% বাংলাদেশ ভ্যাট অন্তর্ভুক্ত এবং আপনি অফিসিয়াল মুসক ৬.৩ চালান পাবেন।',
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
  },
};
