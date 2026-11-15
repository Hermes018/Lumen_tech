/** @purpose Score Analytics & Topic Mastery (/app/progress) in Claude Editorial Ledger aesthetic with borderless SVG trajectory and 2-column mastery ledgers */
import { getLocale } from 'next-intl/server';
import {
  calculateGreScorePrediction,
  calculateLevelInfo,
  calculateSkillMastery,
  calculateStudyStreak,
} from '@lumen/core';
import { getLearnerDashboardData, type LearnerDashboardData } from '@/app/actions/analytics';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import {
  WorkspaceContainer,
  WorkspaceDataTable,
  WorkspaceHeader,
  WorkspaceProgressBar,
  WorkspaceSectionTitle,
  WorkspaceStatRow,
} from '@/src/components/ui/WorkspacePrimitives';

function getSandboxProgressData(): LearnerDashboardData {
  return {
    actor: {
      id: 'sandbox-scholar',
      name: 'Ayman Rahman',
      email: 'ayman@lumen.academy',
      targetExam: 'GRE General',
      targetDate: '2026-12-15',
      daysRemaining: 30,
      targetScore: 325,
    },
    streak: calculateStudyStreak(
      [
        { date: '2026-11-06', count: 14, type: 'practice' },
        { date: '2026-11-07', count: 20, type: 'practice' },
        { date: '2026-11-08', count: 8, type: 'vocab' },
        { date: '2026-11-09', count: 25, type: 'mock' },
        { date: '2026-11-10', count: 18, type: 'practice' },
        { date: '2026-11-11', count: 12, type: 'mistake' },
        { date: '2026-11-12', count: 15, type: 'practice' },
      ],
      { today: '2026-11-12', freezeDates: ['2026-11-05'], maxFreezes: 2 },
    ),
    level: calculateLevelInfo(1450),
    predictor: calculateGreScorePrediction({
      mocks: [
        { attemptId: 'mock-01', date: '2026-10-20', quantScaled: 156, verbalScaled: 152, awaScore: 4.0 },
        { attemptId: 'mock-02', date: '2026-11-02', quantScaled: 159, verbalScaled: 154, awaScore: 4.0 },
        { attemptId: 'mock-03', date: '2026-11-09', quantScaled: 161, verbalScaled: 154, awaScore: 4.5 },
      ],
      practice: [
        { subject: 'quant', attempts: 85, correct: 70 },
        { subject: 'verbal', attempts: 65, correct: 46 },
      ],
      targetScore: { quant: 165, verbal: 160, total: 325 },
    }),
    skills: calculateSkillMastery([
      { skillSlug: 'arithmetic', name: 'Arithmetic & Number Properties', subject: 'quant', attempts: 32, correct: 28 },
      { skillSlug: 'algebra', name: 'Algebra & Equations', subject: 'quant', attempts: 24, correct: 20 },
      { skillSlug: 'geometry', name: 'Geometry & Coordinate Geometry', subject: 'quant', attempts: 18, correct: 14 },
      { skillSlug: 'data-analysis', name: 'Data Interpretation & Statistics', subject: 'quant', attempts: 11, correct: 8 },
      { skillSlug: 'text-completion', name: 'Text Completion (1, 2, 3 Blank)', subject: 'verbal', attempts: 28, correct: 19 },
      { skillSlug: 'sentence-equiv', name: 'Sentence Equivalence', subject: 'verbal', attempts: 22, correct: 17 },
      { skillSlug: 'reading-comp', name: 'Reading Comprehension & Critical Reasoning', subject: 'verbal', attempts: 15, correct: 10 },
    ]),
    nextBestAction: {
      id: 'nba-weak-skill',
      ruleId: 'R12',
      title: 'Strengthen Text Completion Traps',
      description: 'Targeted drill on 3-blank pivot contrast structures · 10 questions · 12 min',
      actionLabel: 'Start Targeted Drill',
      href: '/app/gre?tab=drills',
    },
    stats: {
      quantAccuracy: 82,
      verbalMastery: 71,
      fsrsCardsDue: 45,
      fsrsCardsTotal: 1500,
      openMistakesCount: 2,
      avgPaceSeconds: 78,
      mockExamsCompleted: 3,
    },
  };
}

const IELTS_SKILL_BREAKDOWN = [
  {
    id: 'listening',
    nameEn: 'IELTS Listening',
    nameBn: 'আইইএলটিএস লিসেনিং',
    band: 8.0,
    detailEn: '36 / 40 raw · Part 3–4 Academic Lectures',
    detailBn: '৩৬ / ৪০ কাঁচা স্কোর · পার্ট ৩–৪ একাডেমিক লেকচার',
  },
  {
    id: 'reading',
    nameEn: 'IELTS Reading',
    nameBn: 'আইইএলটিএস রিডিং',
    band: 7.5,
    detailEn: '34 / 40 raw · TFNG & Matching Headings',
    detailBn: '৩৪ / ৪০ কাঁচা স্কোর · টিএফএনজি ও হেডিং ম্যাচিং',
  },
  {
    id: 'writing',
    nameEn: 'IELTS Writing',
    nameBn: 'আইইএলটিএস রাইটিং',
    band: 7.0,
    detailEn: 'Task 1 (7.0) · Task 2 (7.0) · 4-Criterion Rubric',
    detailBn: 'টাস্ক ১ (৭.০) · টাস্ক ২ (৭.০) · ৪-মানদণ্ড রুব্রিক',
  },
  {
    id: 'speaking',
    nameEn: 'IELTS Speaking',
    nameBn: 'আইইএলটিএস স্পিকিং',
    band: 7.5,
    detailEn: 'Fluency 7.5 · Lexical 7.5 · Grammar 7.0 · Pronunciation 7.5',
    detailBn: 'সাবলীলতা ৭.৫ · শব্দভাণ্ডার ৭.৫ · ব্যাকরণ ৭.০ · উচ্চারণ ৭.৫',
  },
];

function getStageLabel(stage: string, isBn: boolean): string {
  switch (stage) {
    case 'mastered':
      return isBn ? 'দক্ষ' : 'Mastered';
    case 'proficient':
      return isBn ? 'উন্নত' : 'Proficient';
    case 'familiar':
      return isBn ? 'পরিচিত' : 'Familiar';
    default:
      return isBn ? 'শুরু হয়নি' : 'Not Started';
  }
}

export default async function LearnerProgressPage() {
  const [data, locale] = await Promise.all([
    getLearnerDashboardData().catch(() => getSandboxProgressData()),
    getLocale(),
  ]);
  const isBn = locale === 'bn';

  const targetTotal = 325;
  const chartPoints =
    data.predictor.trendHistory.length >= 2
      ? data.predictor.trendHistory
      : [
          { date: '2026-10-20', quant: 156, verbal: 152, total: 308, confidence: 'medium' as const },
          { date: '2026-11-02', quant: 159, verbal: 154, total: 313, confidence: 'high' as const },
          { date: '2026-11-09', quant: 161, verbal: 154, total: 315, confidence: 'high' as const },
        ];

  const minScore = 290;
  const maxScore = 340;
  const svgW = 680;
  const svgH = 210;
  const padL = 44;
  const padR = 24;
  const padT = 20;
  const padB = 34;
  const plotW = svgW - padL - padR;
  const plotH = svgH - padT - padB;

  const toY = (score: number) =>
    padT + plotH - ((Math.max(minScore, Math.min(maxScore, score)) - minScore) / (maxScore - minScore)) * plotH;

  const toX = (idx: number) =>
    chartPoints.length <= 1 ? padL + plotW / 2 : padL + (idx / (chartPoints.length - 1)) * plotW;

  const actualPolyline = chartPoints.map((pt, idx) => `${toX(idx)},${toY(pt.total)}`).join(' ');
  const targetY = toY(targetTotal);

  return (
    <WorkspaceContainer>
      <WorkspaceHeader
        title={isBn ? 'স্কোর বিশ্লেষণ ও বিষয়ভিত্তিক দক্ষতা' : 'Score Analytics & Topic Mastery'}
        subtitle={
          isBn
            ? 'জিআরই ও আইইএলটিএস মক পরীক্ষার অগ্রগতির ধারা এবং বিষয়ভিত্তিক নির্ভুলতার হিসাব।'
            : 'Diagnostic score trajectory and topic-level accuracy across GRE Quantitative, Verbal, and IELTS 4-Skill benchmarks.'
        }
        primaryAction={{
          label: isBn ? 'ডায়াগনস্টিক মক চালু করুন →' : 'Launch Diagnostic Mock →',
          href: '/exam/diagnostic',
        }}
        secondaryAction={{
          label: isBn ? 'ভুলের খাতা দেখুন →' : 'Open Mistake Ledger →',
          href: '/app/mistakes',
        }}
      />

      <WorkspaceStatRow
        stats={[
          {
            value: `${data.predictor.estimatedTotal} / 340`,
            label: isBn
              ? `জিআরই অনুমিত · Q${data.predictor.estimatedQuant} / V${data.predictor.estimatedVerbal}`
              : `GRE Estimated · Q${data.predictor.estimatedQuant} / V${data.predictor.estimatedVerbal}`,
            href: '/app/gre',
            hrefLabel: isBn ? 'জিআরই ট্র্যাক →' : 'GRE Track →',
          },
          {
            value: 'Band 7.5',
            label: isBn ? 'আইইএলটিএস অনুমিত · লক্ষ্য ৮.০' : 'IELTS Estimated · Target 8.0',
            href: '/app/ielts',
            hrefLabel: isBn ? 'আইইএলটিএস ট্র্যাক →' : 'IELTS Track →',
          },
          {
            value: `${data.stats.quantAccuracy}%`,
            label: isBn
              ? `কোয়ান্ট নির্ভুলতা · ${data.stats.mockExamsCompleted}টি মক`
              : `Quant Accuracy · ${data.stats.mockExamsCompleted} Mocks`,
          },
          {
            value: `${data.stats.verbalMastery}%`,
            label: isBn
              ? `ভার্বাল দক্ষতা · গড় গতি ${data.stats.avgPaceSeconds}সে`
              : `Verbal Mastery · ${data.stats.avgPaceSeconds}s Avg Pace`,
          },
        ]}
      />

      {/* Borderless SVG Score Trajectory */}
      <section className="border-b border-[var(--hairline)] pb-10 mb-10">
        <WorkspaceSectionTitle
          title={isBn ? 'জিআরই স্কোর অগ্রগতির ধারা' : 'GRE Score Trajectory'}
          subtitle={
            isBn
              ? 'প্রকৃত মক ফলাফল (এসপ্রেসো রেখা) বনাম লক্ষ্য ৩২৫ (ক্রিমসন ড্যাশ রেখা)'
              : 'Actual mock progression (Espresso solid) against Target 325 (Crimson dashed)'
          }
          rightAction={
            <div className="flex items-center gap-5 text-xs text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-[2px] w-5 bg-[var(--brand-deep)]" />
                <span>{isBn ? 'প্রকৃত স্কোর' : 'Actual'}</span>
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-[2px] w-5 border-t-2 border-dashed border-[var(--brand)]" />
                <span>{isBn ? 'লক্ষ্য (৩২৫)' : 'Target (325)'}</span>
              </span>
            </div>
          }
        />

        <div className="w-full overflow-x-auto">
          <svg
            viewBox={`0 0 ${svgW} ${svgH}`}
            className="w-full max-w-[680px] h-auto"
            role="img"
            aria-label={isBn ? 'জিআরই স্কোর অগ্রগতির চার্ট' : 'GRE Score Trajectory Chart'}
          >
            {[300, 310, 320, 330].map((tick) => {
              const y = toY(tick);
              return (
                <g key={tick}>
                  <line
                    x1={padL}
                    y1={y}
                    x2={svgW - padR}
                    y2={y}
                    stroke="var(--hairline)"
                    strokeWidth="1"
                  />
                  <text
                    x={padL - 8}
                    y={y + 4}
                    textAnchor="end"
                    fontSize="11"
                    fill="var(--text-muted)"
                  >
                    {tick}
                  </text>
                </g>
              );
            })}

            <line
              x1={padL}
              y1={targetY}
              x2={svgW - padR}
              y2={targetY}
              stroke="var(--brand)"
              strokeWidth="1.5"
              strokeDasharray="6 4"
            />

            <polyline
              fill="none"
              stroke="var(--brand-deep)"
              strokeWidth="2.5"
              points={actualPolyline}
            />

            {chartPoints.map((pt, idx) => {
              const cx = toX(idx);
              const cy = toY(pt.total);
              return (
                <g key={pt.date}>
                  <circle cx={cx} cy={cy} r="4.5" fill="var(--brand-deep)" />
                  <text
                    x={cx}
                    y={cy - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fontWeight="700"
                    fill="var(--brand-deep)"
                  >
                    {pt.total}
                  </text>
                  <text
                    x={cx}
                    y={svgH - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill="var(--text-muted)"
                  >
                    {pt.date}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>

      {/* Quantitative, Verbal & IELTS Skill Mastery Data Tables */}
      <section className="space-y-10">
        <div>
          <WorkspaceSectionTitle
            title={isBn ? 'কোয়ান্টিটেটিভ ও ভার্বাল দক্ষতা' : 'Quantitative & Verbal Mastery'}
            subtitle={
              isBn
                ? 'অবজেক্টিভ ড্রিল ও সেকশনাল টেস্টের ভিত্তিতে'
                : 'Topic-level accuracy from calibrated drills'
            }
            rightAction={
              <LocaleLink
                href="/app/gre"
                className="text-xs font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)]"
              >
                {isBn ? 'জিআরই ড্রিল →' : 'GRE Drills →'}
              </LocaleLink>
            }
          />

          <WorkspaceDataTable
            caption={isBn ? 'কোয়ান্টিটেটিভ ও ভার্বাল দক্ষতা' : 'Quantitative & Verbal Mastery'}
            columns={[
              { key: 'topic', header: isBn ? 'বিষয়' : 'Topic' },
              { key: 'subject', header: isBn ? 'সেকশন' : 'Section' },
              { key: 'stage', header: isBn ? 'স্তর' : 'Stage' },
              { key: 'progress', header: isBn ? 'দক্ষতা সূচক' : 'Mastery', widthClass: 'min-w-[160px]' },
              { key: 'accuracy', header: isBn ? 'নির্ভুলতা' : 'Accuracy', align: 'right' },
            ]}
            rows={data.skills.map((skill) => ({
              id: skill.skillSlug,
              rowHeader: skill.name,
              rowSubheader: `${skill.correctCount} / ${skill.attemptsCount} ${isBn ? 'সঠিক উত্তর' : 'items correct'}`,
              cells: {
                subject: (
                  <span className="text-xs font-medium text-[var(--brand-deep)]">
                    {skill.subject === 'quant'
                      ? isBn
                        ? 'কোয়ান্টিটেটিভ'
                        : 'Quantitative'
                      : isBn
                        ? 'ভার্বাল'
                        : 'Verbal'}
                  </span>
                ),
                stage: (
                  <span className="text-xs text-[var(--text-muted)]">
                    {getStageLabel(skill.stage, isBn)}
                  </span>
                ),
                progress: (
                  <WorkspaceProgressBar
                    value={skill.accuracy}
                    max={100}
                    tone={skill.subject === 'quant' ? 'crimson' : 'espresso'}
                    label={skill.name}
                  />
                ),
                accuracy: (
                  <span className="font-semibold text-[var(--brand-deep)]">{skill.accuracy}%</span>
                ),
              },
            }))}
          />
        </div>

        <div>
          <WorkspaceSectionTitle
            title={isBn ? 'আইইএলটিএস ৪-স্কিল বিশ্লেষণ' : 'IELTS 4-Skill Breakdown'}
            subtitle={
              isBn
                ? 'একাডেমিক ও জেনারেল ট্রেনিং ব্যান্ড অনুমান'
                : 'Listening, Reading, Writing, and Speaking band estimates'
            }
            rightAction={
              <LocaleLink
                href="/app/ielts"
                className="text-xs font-medium text-[var(--brand-deep)] underline underline-offset-4 hover:text-[var(--brand)]"
              >
                {isBn ? 'আইইএলটিএস ট্র্যাক →' : 'IELTS Track →'}
              </LocaleLink>
            }
          />

          <WorkspaceDataTable
            caption={isBn ? 'আইইএলটিএস ৪-স্কিল বিশ্লেষণ' : 'IELTS 4-Skill Breakdown'}
            columns={[
              { key: 'skill', header: isBn ? 'দক্ষতা' : 'Skill' },
              { key: 'progress', header: isBn ? 'ব্যান্ড অগ্রগতি' : 'Band Progress', widthClass: 'min-w-[180px]' },
              { key: 'band', header: isBn ? 'অনুমিত ব্যান্ড' : 'Estimated Band', align: 'right' },
            ]}
            rows={IELTS_SKILL_BREAKDOWN.map((item) => ({
              id: item.id,
              rowHeader: isBn ? item.nameBn : item.nameEn,
              rowSubheader: isBn ? item.detailBn : item.detailEn,
              cells: {
                progress: (
                  <WorkspaceProgressBar
                    value={item.band}
                    max={9}
                    tone="espresso"
                    label={isBn ? item.nameBn : item.nameEn}
                  />
                ),
                band: (
                  <span className="font-semibold text-[var(--brand)]">
                    Band {item.band.toFixed(1)} / 9.0
                  </span>
                ),
              },
            }))}
          />
        </div>
      </section>
    </WorkspaceContainer>
  );
}
