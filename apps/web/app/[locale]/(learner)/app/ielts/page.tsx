/** @purpose Dedicated IELTS Academic & General Training Track workspace (/app/ielts) with 4-skill mocks, Writing Rubric Lab, Speaking Cue Card Studio, and Reading/Listening drills */
'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useLocale } from 'next-intl';
import {
  countWords,
  evaluateIeltsSpeaking,
  evaluateIeltsWritingTask,
  type IeltsSpeakingEvalOutput,
  type IeltsWritingTaskEvalOutput,
} from '@lumen/ai';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import {
  WorkspaceContainer,
  WorkspaceHeader,
  WorkspaceLedger,
  WorkspaceLedgerRow,
  WorkspaceProgressBar,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
  WorkspaceTabs,
} from '@/src/components/ui/WorkspacePrimitives';

type IeltsTab = 'mocks' | 'writing' | 'speaking' | 'reading-listening';
type IeltsModule = 'academic' | 'gt';
type WritingTaskChoice = 'task1' | 'task2';
type SpeakingPartChoice = 'part1' | 'part2' | 'part3';

const IELTS_MOCKS = [
  {
    id: 'ielts-mock-01',
    module: 'academic' as const,
    titleEn: 'CD-IELTS Academic Full Mock 01 — Band 7.0',
    titleBn: 'সিডি-আইইএলটিএস একাডেমিক পূর্ণ মক ০১ — ব্যান্ড ৭.০',
    breakdown: 'Listening 7.5 · Reading 7.0 · Writing 6.5 · Speaking 7.0',
    statusEn: 'Completed',
    statusBn: 'সম্পন্ন',
  },
  {
    id: 'ielts-mock-02',
    module: 'academic' as const,
    titleEn: 'CD-IELTS Academic Full Mock 02 — Band 7.5',
    titleBn: 'সিডি-আইইএলটিএস একাডেমিক পূর্ণ মক ০২ — ব্যান্ড ৭.৫',
    breakdown: 'Listening 8.0 · Reading 7.5 · Writing 7.0 · Speaking 7.5',
    statusEn: 'Completed',
    statusBn: 'সম্পন্ন',
  },
  {
    id: 'ielts-mock-03',
    module: 'academic' as const,
    titleEn: 'CD-IELTS Academic Full Mock 03 — Ready to Launch',
    titleBn: 'সিডি-আইইএলটিএস একাডেমিক পূর্ণ মক ০৩ — শুরুর জন্য প্রস্তুত',
    breakdown: 'Listening (30m) · Reading (60m) · Writing (60m) · Speaking (14m)',
    statusEn: 'Ready',
    statusBn: 'প্রস্তুত',
  },
  {
    id: 'ielts-gt-01',
    module: 'gt' as const,
    titleEn: 'CD-IELTS General Training Mock 01 — Band 7.5',
    titleBn: 'সিডি-আইইএলটিএস জেনারেল ট্রেনিং মক ০১ — ব্যান্ড ৭.৫',
    breakdown: 'Listening 8.0 · GT Reading 7.5 · Letter & Essay 7.0 · Speaking 7.5',
    statusEn: 'Completed',
    statusBn: 'সম্পন্ন',
  },
  {
    id: 'ielts-gt-02',
    module: 'gt' as const,
    titleEn: 'CD-IELTS General Training Mock 02 — Ready to Launch',
    titleBn: 'সিডি-আইইএলটিএস জেনারেল ট্রেনিং মক ০২ — শুরুর জন্য প্রস্তুত',
    breakdown: 'Workplace & Social Reading · Formal/Semi-Formal Letter · Task 2',
    statusEn: 'Ready',
    statusBn: 'প্রস্তুত',
  },
];

const RL_DRILLS = [
  {
    id: 'drill-tfng-coral',
    skill: 'Reading · True / False / Not Given',
    titleEn: 'Deep-Sea Coral Reef Metabolism & Solar Dependence',
    titleBn: 'গভীর সমুদ্রের প্রবাল প্রাচীর ও সূর্যালোক নির্ভরতা',
    passage:
      'Cold-water corals, unlike their tropical shallow-water counterparts, thrive in pitch darkness and frigid waters at depths of several hundred to thousands of meters. Marine biologists hypothesize that internal oceanic waves funnel suspended organic matter and plankton toward these structures.',
    question: 'Statement: Cold-water corals rely on sunlight for their primary metabolic sustenance.',
    options: ['TRUE', 'FALSE', 'NOT GIVEN'],
    correct: 'FALSE',
    explanation:
      'The passage states that cold-water corals thrive in "pitch darkness" and receive suspended organic matter via internal oceanic waves, directly contradicting reliance on sunlight.',
  },
  {
    id: 'drill-headings-urban',
    skill: 'Reading · Matching Headings',
    titleEn: 'Sponge-City Drainage & Permeable Concrete Corridors',
    titleBn: 'স্পঞ্জ-সিটি নিষ্কাশন ও ভেদ্য কংক্রিট করিডোর',
    passage:
      'Rather than funneling monsoon runoff into overwhelmed concrete storm drains, urban hydrologists in Dhaka and Rotterdam have retrofitted neighborhood plazas with porous basalt pavements and sunken bioswales that recharge depleted aquifers.',
    question: 'Choose the most accurate paragraph heading:',
    options: [
      'i. Limitations of historic masonry reservoirs',
      'ii. Redirecting stormwater from piped sewers into ground absorption',
      'iii. Rising construction costs of coastal sea walls',
    ],
    correct: 'ii. Redirecting stormwater from piped sewers into ground absorption',
    explanation:
      'The paragraph contrasts overwhelmed concrete storm drains with porous pavements and bioswales that absorb runoff and recharge aquifers.',
  },
  {
    id: 'drill-listening-part4',
    skill: 'Listening · Part 4 Academic Lecture Note Completion',
    titleEn: 'Marine Acoustics & Bio-Sonar Frequency Shifts',
    titleBn: 'মেরিন অ্যাকোস্টিক্স ও বায়ো-সোনার ফ্রিকোয়েন্সি পরিবর্তন',
    passage:
      'Audio Transcript Excerpt: "When commercial shipping lanes intersect whale migration corridors, baleen whales elevate their vocal amplitude—a phenomenon acoustic ecologists term the Lombard effect—while shifting call frequencies upward by nearly 15 hertz."',
    question: 'Complete the lecture note (ONE WORD ONLY): Acoustic ecologists call this vocal adjustment the ________ effect.',
    options: ['Lombard', 'Doppler', 'Resonance'],
    correct: 'Lombard',
    explanation:
      'The speaker explicitly defines the vocal amplitude elevation near shipping noise as "the Lombard effect".',
  },
];

const SPEAKING_PROMPTS = {
  part1: {
    titleEn: 'Part 1 — Hometown & Daily Routine (4–5 min)',
    titleBn: 'পার্ট ১ — নিজ শহর ও দৈনন্দিন রুটিন (৪–৫ মিনিট)',
    prompts: [
      'What is the most memorable architectural or natural landmark in the area where you grew up?',
      'How has your study or work schedule shifted over the past two years?',
      'Do you prefer reading printed books or digital articles in the evening? Why?',
    ],
  },
  part2: {
    titleEn: 'Part 2 — 2-Minute Long Turn Cue Card (1-Min Prep)',
    titleBn: 'পার্ট ২ — ২-মিনিটের কিউ কার্ড (১-মিনিট প্রস্তুতি)',
    prompts: [
      'Describe an ambitious academic or professional project you completed under a tight deadline. You should say: what the project involved, why the timeline was demanding, what strategy helped you finish it, and what you learned from the experience.',
    ],
  },
  part3: {
    titleEn: 'Part 3 — Abstract Follow-up Discussion (4–5 min)',
    titleBn: 'পার্ট ৩ — বিমূর্ত আলোচনা (৪–৫ মিনিট)',
    prompts: [
      'Why do some people perform more effectively under strict deadlines while others lose focus?',
      'Should universities place greater weight on collaborative projects than individual timed examinations?',
      'How has remote collaboration altered accountability in research teams?',
    ],
  },
};

function IeltsWorkspaceContent() {
  const searchParams = useSearchParams();
  const locale = useLocale();
  const isBn = locale === 'bn';

  const rawTab = searchParams?.get('tab');
  const initialTab: IeltsTab =
    rawTab === 'writing' || rawTab === 'speaking' || rawTab === 'reading-listening'
      ? rawTab
      : 'mocks';

  const [activeTab, setActiveTab] = useState<IeltsTab>(initialTab);
  const [moduleVariant, setModuleVariant] = useState<IeltsModule>('academic');

  // Writing Rubric Evaluator state
  const [writingTask, setWritingTask] = useState<WritingTaskChoice>('task2');
  const [writingDraft, setWritingDraft] = useState<string>(
    'Some commentators contend that higher education should focus narrowly on vocational training for immediate employment, whereas others advocate a broad theoretical foundation. Although industry-aligned curricula accelerate early career placement, I believe universities fulfill their deepest purpose when they pair applied competence with rigorous theoretical inquiry.\n\nOn the one hand, specialized technical training reduces friction during a graduate’s transition into the workforce. In rapidly digitizing economies such as Bangladesh, proficiency in statistical modeling, laboratory protocols, or software engineering enables young professionals to contribute immediately without costly employer retraining.\n\nNevertheless, purely vocational instruction ages quickly as tools evolve. By contrast, foundational training in quantitative reasoning, critical writing, and experimental design equips graduates to adapt across decades of technological disruption. Moreover, civic institutions rely on citizens who can weigh ethical and historical trade-offs rather than merely execute narrow procedures.\n\nIn conclusion, while practical skills merit structured integration through capstones and internships, universities should preserve a strong theoretical core so graduates remain adaptable throughout their careers.',
  );
  const [writingEval, setWritingEval] = useState<IeltsWritingTaskEvalOutput | null>(null);

  // Speaking Studio state
  const [speakingPart, setSpeakingPart] = useState<SpeakingPartChoice>('part2');
  const [prepSecondsLeft, setPrepSecondsLeft] = useState<number>(60);
  const [prepRunning, setPrepRunning] = useState<boolean>(false);
  const [speakingTranscript, setSpeakingTranscript] = useState<string>(
    'Last autumn I led a three-person team compiling an environmental impact baseline for an urban drainage upgrade in Dhaka. Because the municipal submission window was compressed to twelve days, we divided hydrological measurements, stakeholder interviews, and statistical charts into parallel milestones. Every evening we held a fifteen-minute review to reconcile anomalies in our rainfall dataset. Completing the report ahead of the deadline taught me that disciplined daily checkpoints prevent last-minute panic and elevate analytical accuracy.',
  );
  const [speakingEval, setSpeakingEval] = useState<IeltsSpeakingEvalOutput | null>(null);

  // Reading & Listening drills state
  const [openDrillId, setOpenDrillId] = useState<string | null>(RL_DRILLS[0]!.id);
  const [drillAnswers, setDrillAnswers] = useState<Record<string, string>>({});
  const [drillChecked, setDrillChecked] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (!prepRunning) return;
    if (prepSecondsLeft <= 0) {
      setPrepRunning(false);
      return;
    }
    const timer = setInterval(() => {
      setPrepSecondsLeft((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [prepRunning, prepSecondsLeft]);

  const filteredMocks = IELTS_MOCKS.filter((m) => m.module === moduleVariant);

  const taskPromptText =
    writingTask === 'task2'
      ? 'Some educators argue that higher education should focus exclusively on imparting practical skills required for immediate employment, while others believe universities should provide a broad theoretical foundation. Discuss both views and give your own opinion.'
      : moduleVariant === 'academic'
        ? 'The chart below illustrates primary energy consumption across industrial, commercial, and residential sectors in Bangladesh from 2010 to 2025. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.'
        : 'You recently moved into a rental apartment and discovered several maintenance issues that remain unresolved. Write a letter to the building manager explaining the problems, how they affect your daily routine, and what action you expect.';

  const minWords = writingTask === 'task2' ? 250 : 150;
  const writingWordCount = countWords(writingDraft);

  const handleEvaluateWriting = () => {
    const type =
      writingTask === 'task2'
        ? 'task2'
        : moduleVariant === 'academic'
          ? 'task1_academic'
          : 'task1_gt';
    const result = evaluateIeltsWritingTask(writingDraft, type);
    setWritingEval(result);
  };

  const handleEvaluateSpeaking = () => {
    const result = evaluateIeltsSpeaking({
      transcript: speakingTranscript,
      part2Notes: 'Dhaka urban drainage baseline · 12-day deadline · parallel milestones',
    });
    setSpeakingEval(result);
  };

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={
          isBn
            ? 'আইইএলটিএস একাডেমিক ও জেনারেল ট্রেনিং ট্র্যাক'
            : 'IELTS™ Academic & General Training Track'
        }
        subtitle={
          isBn
            ? 'লিসেনিং, রিডিং, রাইটিং এবং স্পিকিং—চারটি দক্ষতায় কম্পিউটার-ভিত্তিক পূর্ণ প্রস্তুতি।'
            : 'Four-skill computer-delivered preparation across Listening, Reading, Writing, and Speaking.'
        }
        primaryAction={{
          label: isBn ? '৪-স্কিল সিডি-আইইএলটিএস সিমুলেটর →' : 'Launch 4-Skill CD-IELTS Simulator →',
          href: '/exam/ielts-preview',
        }}
        secondaryAction={{
          label: isBn ? 'আইইএলটিএস ব্যান্ড ক্যালকুলেটর →' : 'IELTS Band Calculator →',
          href: '/tools/ielts-band-calculator',
        }}
      />

      {/* Track Variant Selector */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="text-xs font-medium text-[var(--text-muted)]">
          {isBn ? 'ট্র্যাক ভ্যারিয়েন্ট:' : 'Track Variant:'}
        </span>
        {(
          [
            { id: 'academic', labelEn: 'Academic Module', labelBn: 'একাডেমিক মডিউল' },
            { id: 'gt', labelEn: 'General Training Module', labelBn: 'জেনারেল ট্রেনিং মডিউল' },
          ] as const
        ).map((variant) => {
          const active = moduleVariant === variant.id;
          return (
            <button
              key={variant.id}
              type="button"
              onClick={() => {
                setModuleVariant(variant.id);
                setWritingEval(null);
              }}
              className={
                active
                  ? 'rounded-[4px] border border-[var(--brand-deep)] bg-[var(--brand-deep)] px-3.5 py-2 text-xs font-semibold text-white leading-relaxed'
                  : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3.5 py-2 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)] leading-relaxed'
              }
            >
              {isBn ? variant.labelBn : variant.labelEn}
            </button>
          );
        })}
      </div>

      <WorkspaceStatRow
        stats={[
          {
            value: 'Band 7.5',
            label: isBn ? 'সামগ্রিক অনুমিত ব্যান্ড · লক্ষ্য ৮.০' : 'Overall Estimate · Target 8.0',
          },
          {
            value: 'Listening 8.0',
            label: isBn ? '৩৬ / ৪০ কাঁচা স্কোর' : '36 / 40 Raw Score',
          },
          {
            value: 'Reading 7.5',
            label: isBn ? '৩৪ / ৪০ কাঁচা স্কোর' : '34 / 40 Raw Score',
          },
          {
            value: 'Writing 7.0 · Speaking 7.5',
            label: isBn ? '৪-মানদণ্ড রুব্রিক ভিত্তিক' : '4-Criterion Rubric',
          },
        ]}
      />

      <WorkspaceTabs
        activeTab={activeTab}
        onSelect={(id) => setActiveTab(id as IeltsTab)}
        tabs={[
          {
            id: 'mocks',
            label: isBn ? '৪-স্কিল সিডি-আইইএলটিএস মক' : '4-Skill CD-IELTS Mock Tests',
            count: filteredMocks.length,
          },
          {
            id: 'writing',
            label: isBn ? 'রাইটিং টাস্ক ১ ও ২ রুব্রিক মূল্যায়ন' : 'Writing Task 1 & Task 2 Rubric Evaluator',
          },
          {
            id: 'speaking',
            label: isBn ? 'স্পিকিং পার্ট ১–৩ কিউ কার্ড স্টুডিও' : 'Speaking Part 1–3 Cue Card Studio',
          },
          {
            id: 'reading-listening',
            label: isBn ? 'রিডিং ও লিসেনিং প্যাসেজ ড্রিল' : 'Reading & Listening Passage Drills',
            count: RL_DRILLS.length,
          },
        ]}
      />

      {activeTab === 'mocks' ? (
        <section>
          <WorkspaceSectionTitle
            title={
              moduleVariant === 'academic'
                ? isBn
                  ? 'একাডেমিক ৪-স্কিল সিডি-আইইএলটিএস মক টেস্ট'
                  : 'Academic 4-Skill CD-IELTS Mock Tests'
                : isBn
                  ? 'জেনারেল ট্রেনিং ৪-স্কিল মক টেস্ট'
                  : 'General Training 4-Skill CD-IELTS Mock Tests'
            }
            subtitle={
              isBn
                ? 'কম্পিউটার-ভিত্তিক লিসেনিং, রিডিং, রাইটিং এবং স্পিকিং পূর্ণাঙ্গ সিমুলেশন।'
                : 'Computer-delivered Listening, Reading, Writing, and Speaking simulations with section band breakdowns.'
            }
          />
          <WorkspaceLedger>
            {filteredMocks.map((mock) => (
              <WorkspaceLedgerRow
                key={mock.id}
                left={
                  <div>
                    <p className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                      {isBn ? mock.titleBn : mock.titleEn}
                    </p>
                    <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                      {mock.breakdown}
                    </p>
                  </div>
                }
                right={
                  <>
                    <span className="text-xs text-[var(--text-muted)]">
                      {isBn ? mock.statusBn : mock.statusEn}
                    </span>
                    <LocaleLink
                      href="/exam/ielts-preview"
                      className="text-sm font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)] leading-relaxed"
                    >
                      {isBn ? 'সিডি-আইইএলটিএস ওয়ার্কবেঞ্চ খুলুন →' : 'Open CD-IELTS Workbench →'}
                    </LocaleLink>
                  </>
                }
              />
            ))}
          </WorkspaceLedger>
        </section>
      ) : null}

      {activeTab === 'writing' ? (
        <section className="space-y-6">
          <WorkspaceSectionTitle
            title={isBn ? 'রাইটিং টাস্ক ১ ও ২ রুব্রিক মূল্যায়ন' : 'Writing Task 1 & Task 2 Rubric Evaluator'}
            subtitle={
              isBn
                ? 'অফিশিয়াল ৪-মানদণ্ড (ব্যান্ড ০–৯) অনুযায়ী তাৎক্ষণিক মূল্যায়ন এবং প্যারাগ্রাফ উন্নয়নের পরামর্শ।'
                : 'Instant 4-Criterion Band 0–9 evaluation with word count tracking and paragraph-level rewrite guidance.'
            }
          />

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => {
                setWritingTask('task1');
                setWritingEval(null);
              }}
              className={
                writingTask === 'task1'
                  ? 'rounded-[4px] border border-[var(--brand-deep)] bg-[var(--brand-deep)] px-3.5 py-2 text-xs font-semibold text-white leading-relaxed'
                  : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3.5 py-2 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)] leading-relaxed'
              }
            >
              {moduleVariant === 'academic'
                ? isBn
                  ? 'টাস্ক ১ (একাডেমিক ডেটা চার্ট · ১৫০+ শব্দ · ২০ মি)'
                  : 'Task 1 (Academic Data Chart · 150+ words · 20 min)'
                : isBn
                  ? 'টাস্ক ১ (জিটি চিঠি · ১৫০+ শব্দ · ২০ মি)'
                  : 'Task 1 (GT Letter · 150+ words · 20 min)'}
            </button>
            <button
              type="button"
              onClick={() => {
                setWritingTask('task2');
                setWritingEval(null);
              }}
              className={
                writingTask === 'task2'
                  ? 'rounded-[4px] border border-[var(--brand-deep)] bg-[var(--brand-deep)] px-3.5 py-2 text-xs font-semibold text-white leading-relaxed'
                  : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3.5 py-2 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)] leading-relaxed'
              }
            >
              {isBn
                ? 'টাস্ক ২ (ডিসকার্সিভ প্রবন্ধ · ২৫০+ শব্দ · ৪০ মি)'
                : 'Task 2 (Discursive Essay · 250+ words · 40 min)'}
            </button>
          </div>

          <div className="border-l-[3px] border-[var(--brand)] bg-[var(--surface-paper)] border border-[var(--hairline)] p-5 space-y-2">
            <p className="text-sm font-medium text-[var(--brand-deep)] leading-relaxed">
              {taskPromptText}
            </p>
            <p className="text-xs text-[var(--text-muted)] leading-relaxed">
              {isBn
                ? `ন্যূনতম শব্দসংখ্যা: ${minWords} শব্দ`
                : `Minimum requirement: ${minWords} words`}
            </p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs text-[var(--text-muted)]">
              <span>{isBn ? 'আপনার উত্তর লিখুন' : 'Your Response'}</span>
              <span className="font-mono font-semibold text-[var(--brand-deep)]">
                {writingWordCount} / {minWords}+ {isBn ? 'শব্দ' : 'words'}
              </span>
            </div>
            <textarea
              value={writingDraft}
              onChange={(e) => setWritingDraft(e.target.value)}
              rows={9}
              className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-4 text-sm text-[var(--brand-deep)] leading-relaxed focus:border-[var(--brand)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleEvaluateWriting}
              className="bg-[var(--brand)] text-white px-5 py-2.5 text-sm font-semibold rounded-[4px] hover:bg-[var(--link)] transition-colors"
            >
              {isBn ? '৪-মানদণ্ড রুব্রিক মূল্যায়ন করুন →' : 'Evaluate 4-Criterion Rubric →'}
            </button>
          </div>

          {writingEval ? (
            <div className="border-t border-[var(--hairline)] pt-6 space-y-5">
              <WorkspaceSectionTitle
                title={
                  isBn
                    ? `অনুমিত টাস্ক ব্যান্ড: ${writingEval.taskBand.toFixed(1)} / 9.0`
                    : `Estimated Task Band: ${writingEval.taskBand.toFixed(1)} / 9.0`
                }
                subtitle={`${writingEval.wordCount} words · Estimated Rubric Assessment`}
              />
              <WorkspaceLedger>
                {[
                  {
                    label:
                      writingTask === 'task1'
                        ? 'Task Achievement'
                        : 'Task Response',
                    crit: writingEval.dimensions.task_response,
                  },
                  {
                    label: 'Coherence & Cohesion',
                    crit: writingEval.dimensions.coherence_cohesion,
                  },
                  {
                    label: 'Lexical Resource',
                    crit: writingEval.dimensions.lexical_resource,
                  },
                  {
                    label: 'Grammatical Range & Accuracy',
                    crit: writingEval.dimensions.grammar_range_accuracy,
                  },
                ].map((row) => (
                  <WorkspaceLedgerRow
                    key={row.label}
                    left={
                      <div className="space-y-1.5 max-w-[60ch]">
                        <p className="text-sm font-semibold text-[var(--brand-deep)]">{row.label}</p>
                        <p className="text-xs text-[var(--text)] leading-relaxed">
                          {row.crit.rationale}
                        </p>
                      </div>
                    }
                    right={
                      <div className="w-40 space-y-1.5">
                        <div className="text-xs font-semibold text-[var(--brand-deep)]">
                          Band {row.crit.band.toFixed(1)} / 9.0
                        </div>
                        <WorkspaceProgressBar value={row.crit.band} max={9} tone="crimson" />
                      </div>
                    }
                  />
                ))}
              </WorkspaceLedger>

              {writingEval.improvements.length > 0 ? (
                <div className="border-l-2 border-[var(--brand)] pl-4 space-y-1.5">
                  <p className="text-xs font-semibold text-[var(--brand-deep)]">
                    {isBn ? 'প্যারাগ্রাফ উন্নয়নের পরামর্শ' : 'Paragraph-Level Rewrite Guidance'}
                  </p>
                  {writingEval.improvements.map((tip) => (
                    <p key={tip} className="text-xs text-[var(--text)] leading-relaxed">
                      • {tip}
                    </p>
                  ))}
                </div>
              ) : null}
            </div>
          ) : null}
        </section>
      ) : null}

      {activeTab === 'speaking' ? (
        <section className="space-y-6">
          <WorkspaceSectionTitle
            title={isBn ? 'স্পিকিং পার্ট ১–৩ কিউ কার্ড স্টুডিও' : 'Speaking Part 1–3 Cue Card Studio'}
            subtitle={
              isBn
                ? 'পরীক্ষকের প্রশ্নাবলি, ১-মিনিটের প্রস্তুতি টাইমার এবং ব্যান্ড ৭.৫+ লেক্সিক্যাল ফিডব্যাক।'
                : 'Examiner prompt deck, 1-minute Part 2 prep timer, and Band 7.5+ lexical upgrading feedback.'
            }
          />

          <div className="flex flex-wrap gap-2">
            {(
              [
                { id: 'part1', labelEn: 'Part 1 Interview', labelBn: 'পার্ট ১ সাক্ষাৎকার' },
                { id: 'part2', labelEn: 'Part 2 Cue Card (1m Prep)', labelBn: 'পার্ট ২ কিউ কার্ড (১মি প্রস্তুতি)' },
                { id: 'part3', labelEn: 'Part 3 Discussion', labelBn: 'পার্ট ৩ আলোচনা' },
              ] as const
            ).map((part) => {
              const active = speakingPart === part.id;
              return (
                <button
                  key={part.id}
                  type="button"
                  onClick={() => setSpeakingPart(part.id)}
                  className={
                    active
                      ? 'rounded-[4px] border border-[var(--brand-deep)] bg-[var(--brand-deep)] px-3.5 py-2 text-xs font-semibold text-white leading-relaxed'
                      : 'rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3.5 py-2 text-xs font-medium text-[var(--brand-deep)] hover:border-[var(--brand)] leading-relaxed'
                  }
                >
                  {isBn ? part.labelBn : part.labelEn}
                </button>
              );
            })}
          </div>

          <div className="border-l-[3px] border-[var(--brand)] bg-[var(--surface-paper)] border border-[var(--hairline)] p-5 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-[var(--brand-deep)]">
                {isBn
                  ? SPEAKING_PROMPTS[speakingPart].titleBn
                  : SPEAKING_PROMPTS[speakingPart].titleEn}
              </p>
              {speakingPart === 'part2' ? (
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs font-semibold text-[var(--brand)]">
                    {prepSecondsLeft}s {isBn ? 'প্রস্তুতি' : 'prep'}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      if (prepSecondsLeft === 0) setPrepSecondsLeft(60);
                      setPrepRunning((prev) => !prev);
                    }}
                    className="text-xs font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)]"
                  >
                    {prepRunning
                      ? isBn
                        ? 'বিরতি'
                        : 'Pause Timer'
                      : isBn
                        ? '১-মিনিট প্রস্তুতি টাইমার শুরু'
                        : 'Start 1-Min Prep Timer'}
                  </button>
                </div>
              ) : null}
            </div>
            <ul className="space-y-2 text-sm text-[var(--text)] leading-relaxed">
              {SPEAKING_PROMPTS[speakingPart].prompts.map((q) => (
                <li key={q}>• {q}</li>
              ))}
            </ul>
          </div>

          <div className="space-y-3">
            <label className="block text-xs text-[var(--text-muted)]">
              {isBn
                ? 'আপনার স্পিকিং ট্রান্সক্রিপ্ট / রেকর্ডকৃত উত্তর লিখুন বা পেস্ট করুন'
                : 'Simulated Speaking Transcript (Paste or draft your spoken response)'}
            </label>
            <textarea
              value={speakingTranscript}
              onChange={(e) => setSpeakingTranscript(e.target.value)}
              rows={6}
              className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-4 text-sm text-[var(--brand-deep)] leading-relaxed focus:border-[var(--brand)] focus:outline-none"
            />
            <button
              type="button"
              onClick={handleEvaluateSpeaking}
              className="bg-[var(--brand)] text-white px-5 py-2.5 text-sm font-semibold rounded-[4px] hover:bg-[var(--link)] transition-colors"
            >
              {isBn ? 'স্পিকিং ট্রান্সক্রিপ্ট মূল্যায়ন করুন →' : 'Evaluate Speaking Transcript →'}
            </button>
          </div>

          {speakingEval ? (
            <div className="border-t border-[var(--hairline)] pt-6 space-y-5">
              <WorkspaceSectionTitle
                title={
                  isBn
                    ? `অনুমিত স্পিকিং ব্যান্ড: ${speakingEval.overallSpeakingBand.toFixed(1)} / 9.0`
                    : `Estimated Speaking Band: ${speakingEval.overallSpeakingBand.toFixed(1)} / 9.0`
                }
                subtitle={`Speech rate: ${speakingEval.speechMetrics.wpm} WPM · Lexical Upgrading Analysis`}
              />
              <WorkspaceLedger>
                {[
                  { label: 'Fluency & Coherence', crit: speakingEval.dimensions.fluency_coherence },
                  { label: 'Lexical Resource', crit: speakingEval.dimensions.lexical_resource },
                  {
                    label: 'Grammatical Range & Accuracy',
                    crit: speakingEval.dimensions.grammar_range_accuracy,
                  },
                  { label: 'Pronunciation (ASR Proxy)', crit: speakingEval.dimensions.pronunciation },
                ].map((row) => (
                  <WorkspaceLedgerRow
                    key={row.label}
                    left={
                      <div className="space-y-1.5 max-w-[60ch]">
                        <p className="text-sm font-semibold text-[var(--brand-deep)]">{row.label}</p>
                        <p className="text-xs text-[var(--text)] leading-relaxed">
                          {row.crit.rationale}
                        </p>
                      </div>
                    }
                    right={
                      <div className="w-40 space-y-1.5">
                        <div className="text-xs font-semibold text-[var(--brand-deep)]">
                          Band {row.crit.band.toFixed(1)} / 9.0
                        </div>
                        <WorkspaceProgressBar value={row.crit.band} max={9} tone="espresso" />
                      </div>
                    }
                  />
                ))}
              </WorkspaceLedger>
            </div>
          ) : null}
        </section>
      ) : null}

      {activeTab === 'reading-listening' ? (
        <section>
          <WorkspaceSectionTitle
            title={isBn ? 'রিডিং ও লিসেনিং প্যাসেজ ড্রিল' : 'Reading & Listening Passage Drills'}
            subtitle={
              isBn
                ? 'True / False / Not Given, Matching Headings এবং Part 4 লেকচার নোট পূরণ অনুশীলন।'
                : 'Interactive True / False / Not Given, Matching Headings, and Part 4 Academic Lecture Note Completion.'
            }
          />

          <WorkspaceLedger>
            {RL_DRILLS.map((drill) => {
              const isOpen = openDrillId === drill.id;
              const selected = drillAnswers[drill.id] ?? '';
              const checked = Boolean(drillChecked[drill.id]);
              const correct = checked && selected === drill.correct;

              return (
                <div key={drill.id} className="py-4 px-2">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <p className="text-xs text-[var(--text-muted)] leading-relaxed">{drill.skill}</p>
                      <p className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                        {isBn ? drill.titleBn : drill.titleEn}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setOpenDrillId(isOpen ? null : drill.id)}
                      className="text-sm font-medium text-[var(--brand)] underline underline-offset-4 hover:text-[var(--brand-deep)] shrink-0"
                    >
                      {isOpen
                        ? isBn
                          ? 'ড্রিল বন্ধ করুন'
                          : 'Close Drill'
                        : isBn
                          ? 'প্যাসেজ খুলুন →'
                          : 'Open Passage Drill →'}
                    </button>
                  </div>

                  {isOpen ? (
                    <div className="mt-4 border-t border-[var(--hairline)] pt-4 space-y-4 bg-[var(--surface-paper)] p-5">
                      <p className="border-l-2 border-[var(--brand)] pl-4 text-sm text-[var(--text)] leading-relaxed">
                        {drill.passage}
                      </p>
                      <p className="text-sm font-semibold text-[var(--brand-deep)] leading-relaxed">
                        {drill.question}
                      </p>
                      <div className="space-y-2">
                        {drill.options.map((opt) => {
                          const isSelected = selected === opt;
                          return (
                            <button
                              key={opt}
                              type="button"
                              onClick={() => {
                                setDrillAnswers((prev) => ({ ...prev, [drill.id]: opt }));
                                setDrillChecked((prev) => ({ ...prev, [drill.id]: false }));
                              }}
                              className={
                                isSelected
                                  ? 'w-full text-left rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] px-4 py-2.5 text-sm font-semibold text-[var(--brand-deep)] leading-relaxed'
                                  : 'w-full text-left rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-4 py-2.5 text-sm text-[var(--brand-deep)] hover:border-[var(--brand)] leading-relaxed'
                              }
                            >
                              {opt}
                            </button>
                          );
                        })}
                      </div>
                      <button
                        type="button"
                        onClick={() => setDrillChecked((prev) => ({ ...prev, [drill.id]: true }))}
                        className="bg-[var(--brand)] text-white px-4 py-2 text-xs font-semibold rounded-[4px] hover:bg-[var(--link)]"
                      >
                        {isBn ? 'উত্তর যাচাই করুন' : 'Check Answer'}
                      </button>

                      {checked ? (
                        <div className="border-t border-[var(--hairline)] pt-3 space-y-1">
                          <p className="text-sm font-semibold text-[var(--brand-deep)]">
                            {correct
                              ? isBn
                                ? 'সঠিক উত্তর!'
                                : 'Correct Answer'
                              : isBn
                                ? `সঠিক উত্তর: ${drill.correct}`
                                : `Correct Answer: ${drill.correct}`}
                          </p>
                          <p className="text-xs text-[var(--text)] leading-relaxed">
                            {drill.explanation}
                          </p>
                        </div>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </WorkspaceLedger>
        </section>
      ) : null}
    </WorkspaceContainer>
  );
}

export default function IeltsTrackPage() {
  return (
    <React.Suspense
      fallback={
        <WorkspaceContainer>
          <p className="text-sm text-[var(--text-muted)]">Loading IELTS™ Track...</p>
        </WorkspaceContainer>
      }
    >
      <IeltsWorkspaceContent />
    </React.Suspense>
  );
}
