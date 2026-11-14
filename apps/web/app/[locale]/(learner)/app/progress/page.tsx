/** @purpose Learner Progress & Analytics view (/app/progress) with Pearl/Bone stationery mastery grid and 30-day calendar */
import { getLocale } from 'next-intl/server';
import {
  StreakPill,
  LevelProgressBar,
  ScorePredictorChart,
} from '@lumen/ui';
import { LEVEL_THRESHOLDS } from '@lumen/core';
import { ArrowLeft, Calendar, Flame, Shield, Trophy } from 'lucide-react';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { getLearnerDashboardData } from '@/app/actions/analytics';

export default async function LearnerProgressPage() {
  const [data, locale] = await Promise.all([getLearnerDashboardData(), getLocale()]);
  const isBn = locale === 'bn';

  const quantSkills = data.skills.filter((s) => s.subject === 'quant');
  const verbalSkills = data.skills.filter((s) => s.subject === 'verbal');

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'mastered':
        return (
          <span className="rounded-[4px] border border-emerald-700/30 bg-emerald-50 px-2 py-0.5 text-xs font-semibold text-emerald-800">
            {isBn ? 'দক্ষ (১০০%)' : 'Mastered (100%)'}
          </span>
        );
      case 'proficient':
        return (
          <span className="rounded-[4px] border border-[var(--brand-deep)]/30 bg-[var(--bg-warm)] px-2 py-0.5 text-xs font-semibold text-[var(--brand-deep)]">
            {isBn ? 'উন্নত' : 'Proficient'}
          </span>
        );
      case 'familiar':
        return (
          <span className="rounded-[4px] border border-[var(--accent)]/40 bg-[var(--bg-tint)] px-2 py-0.5 text-xs font-semibold text-[var(--terracotta)]">
            {isBn ? 'পরিচিত' : 'Familiar'}
          </span>
        );
      default:
        return (
          <span className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2 py-0.5 text-xs font-semibold text-[var(--text)]">
            {isBn ? 'শুরু হয়নি' : 'Not Started'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col gap-4 border-b border-[var(--hairline)] pb-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <LocaleLink
            href="/app"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text)] transition-colors hover:text-[var(--brand)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>{isBn ? 'ড্যাশবোর্ডে ফিরুন' : 'Back to Dashboard'}</span>
          </LocaleLink>
          <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-[var(--brand-ink)]">
            {isBn ? 'দক্ষতা অর্জন ও স্কোর বিশ্লেষণ' : 'Skill Mastery & Score Analytics'}
          </h1>
          <p className="mt-1 text-sm text-[var(--text)]">
            {isBn
              ? 'ডায়াগনস্টিক মেট্রিক্স, বিষয়ভিত্তিক দক্ষতা এবং ৩০-দিনের অধ্যয়ন ধারাবাহিকতা।'
              : 'Comprehensive diagnostic metrics, topic-level mastery, and 30-day study consistency.'}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StreakPill
            streak={data.streak.currentStreak}
            isActiveToday={data.streak.isActiveToday}
            freezesRemaining={data.streak.freezeCount}
            variant="highlight"
            size="lg"
          />
        </div>
      </div>

      {/* Level and Score Predictor Section */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <LevelProgressBar
            level={data.level.level}
            title={data.level.title}
            totalXp={data.level.totalXp}
            currentLevelXp={data.level.currentLevelXp}
            xpForNextLevel={data.level.xpForNextLevel}
            progressPct={data.level.progressPct}
            nextLevelTitle={data.level.nextLevelTitle}
          />

          {/* Level Ranks Roadmap */}
          <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5">
            <h2 className="flex items-center gap-1.5 text-xs font-bold tracking-wider text-[var(--brand)] uppercase">
              <Trophy className="h-3.5 w-3.5" />
              <span>{isBn ? 'র‍্যাংক অগ্রগতি রোডম্যাপ' : 'Rank Progression Roadmap'}</span>
            </h2>
            <div className="mt-3 divide-y divide-[var(--hairline)] border border-[var(--hairline)] text-xs">
              {LEVEL_THRESHOLDS.slice(0, 6).map((tier) => {
                const isCurrent = tier.level === data.level.level;
                const isUnlocked = tier.level < data.level.level;
                return (
                  <div
                    key={tier.level}
                    className={`flex items-center justify-between px-3 py-2 ${
                      isCurrent
                        ? 'bg-[var(--bg-tint)] font-bold text-[var(--brand)]'
                        : isUnlocked
                          ? 'bg-[var(--bg-warm)] text-[var(--text)] line-through opacity-75'
                          : 'bg-[var(--surface-paper)] text-[var(--text)]'
                    }`}
                  >
                    <span>
                      Level {tier.level}: {tier.title}
                    </span>
                    <span className="font-mono">{tier.requiredXp} XP</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <ScorePredictorChart
            estimatedQuant={data.predictor.estimatedQuant}
            estimatedVerbal={data.predictor.estimatedVerbal}
            estimatedTotal={data.predictor.estimatedTotal}
            estimatedAwa={data.predictor.estimatedAwa}
            targetScore={{ quant: 165, verbal: 160, total: 325 }}
            confidence={data.predictor.confidence}
            trendHistory={data.predictor.trendHistory}
          />
        </div>
      </div>

      {/* 30-Day Activity & Consistency Calendar */}
      <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-6">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--hairline)] pb-4">
          <h2 className="flex items-center gap-2 text-lg font-bold text-[var(--brand-ink)]">
            <Calendar className="h-5 w-5 text-[var(--brand)]" />
            <span>{isBn ? '৩০-দিনের অধ্যয়ন ধারাবাহিকতা ক্যালেন্ডার' : '30-Day Study Consistency Calendar'}</span>
          </h2>
          <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text)]">
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-none bg-[var(--accent)]" />
              <span>{isBn ? 'সক্রিয় দিন' : 'Active Day'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-none bg-[var(--brand-deep)]" />
              <span>{isBn ? 'ফ্রিজ সুরক্ষিত' : 'Freeze Protected'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="inline-block h-3 w-3 rounded-none border border-[var(--hairline)] bg-[var(--bg-warm)]" />
              <span>{isBn ? 'বিরতি / মিস' : 'Rest / Missed'}</span>
            </span>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-6 gap-2 sm:grid-cols-10 md:grid-cols-15">
          {data.streak.calendar30Days.map((day) => {
            const dateObj = new Date(day.date);
            const label = `${dateObj.getUTCDate()} ${dateObj.toLocaleString('default', { month: 'short' })}`;

            let bg = 'border-[var(--hairline)] bg-[var(--bg-warm)] text-[var(--text)]';
            if (day.status === 'active') {
              bg = 'border-[var(--accent)] bg-[var(--accent)] font-bold text-white';
            } else if (day.status === 'frozen') {
              bg = 'border-[var(--brand-deep)] bg-[var(--brand-deep)] font-bold text-white';
            }

            return (
              <div
                key={day.date}
                className={`flex flex-col items-center justify-center rounded-[4px] border p-2 text-center text-xs ${bg}`}
                title={`${day.date}: ${day.count} activities (${day.status})`}
              >
                <span className="text-[10px] opacity-85">{label.split(' ')[1]}</span>
                <span className="text-sm font-semibold">{label.split(' ')[0]}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--hairline)] pt-4 text-xs text-[var(--text)]">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-[var(--accent)]" />
            <span>
              {isBn ? 'বর্তমান ধারা:' : 'Current Streak:'}{' '}
              <strong className="text-[var(--brand-ink)]">{data.streak.currentStreak} days</strong>
            </span>
            <span className="mx-1 text-[var(--hairline)]">•</span>
            <span>
              {isBn ? 'সর্বোচ্চ ধারা:' : 'Longest Streak:'}{' '}
              <strong className="text-[var(--brand-ink)]">{data.streak.longestStreak} days</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-[var(--brand-deep)]" />
            <span>
              {isBn ? 'ফ্রিজ উপলব্ধ:' : 'Freezes Available:'}{' '}
              <strong className="text-[var(--brand-ink)]">{data.streak.freezeCount} of 2</strong>
            </span>
          </div>
        </div>
      </section>

      {/* Skill Mastery Grid */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold text-[var(--brand-ink)]">
            {isBn ? 'কোয়ান্টিটেটিভ রিজনিং দক্ষতা' : 'Quantitative Reasoning Mastery'}
          </h2>
          <p className="text-xs text-[var(--text)]">
            {isBn
              ? 'স্কোর করা অবজেক্টিভ প্রশ্ন ও সেকশনাল টেস্টের ভিত্তিতে।'
              : 'Based on scored objective questions and sectional tests.'}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {quantSkills.map((skill) => (
            <div
              key={skill.skillSlug}
              className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[var(--brand-ink)]">{skill.name}</span>
                {getStageBadge(skill.stage)}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--text)]">
                <span>
                  {isBn ? 'নির্ভুলতা:' : 'Accuracy:'}{' '}
                  <strong className="text-[var(--brand-ink)]">{skill.accuracy}%</strong> (
                  {skill.correctCount}/{skill.attemptsCount})
                </span>
                <span className="font-mono">
                  {skill.pointsEarned} / {skill.pointsMax} pts
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-none border border-[var(--hairline)] bg-[var(--bg-warm)]">
                <div
                  className="h-full rounded-none bg-[var(--brand)]"
                  style={{ width: `${skill.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="pt-2">
          <h2 className="text-xl font-bold text-[var(--brand-ink)]">
            {isBn ? 'ভার্বাল রিজনিং দক্ষতা' : 'Verbal Reasoning Mastery'}
          </h2>
          <p className="text-xs text-[var(--text)]">
            {isBn
              ? 'টেক্সট কমপ্লিশন, সেন্টেন্স ইকুইভ্যালেন্স এবং রিডিং কমপ্রিহেনশন নির্ভুলতা।'
              : 'Text Completion, Sentence Equivalence, and Reading Comprehension accuracy.'}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {verbalSkills.map((skill) => (
            <div
              key={skill.skillSlug}
              className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-bold text-[var(--brand-ink)]">{skill.name}</span>
                {getStageBadge(skill.stage)}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-[var(--text)]">
                <span>
                  {isBn ? 'নির্ভুলতা:' : 'Accuracy:'}{' '}
                  <strong className="text-[var(--brand-ink)]">{skill.accuracy}%</strong> (
                  {skill.correctCount}/{skill.attemptsCount})
                </span>
                <span className="font-mono">
                  {skill.pointsEarned} / {skill.pointsMax} pts
                </span>
              </div>
              <div className="mt-2 h-2 w-full overflow-hidden rounded-none border border-[var(--hairline)] bg-[var(--bg-warm)]">
                <div
                  className="h-full rounded-none bg-[var(--brand-deep)]"
                  style={{ width: `${skill.accuracy}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
