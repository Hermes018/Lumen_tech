/** @purpose Main Learner Dashboard (/app) with study streaks, XP levels, and GRE score predictor in Pearl/Bone stationery style */
import { getLocale } from 'next-intl/server';
import {
  StreakPill,
  LevelProgressBar,
  ScorePredictorChart,
} from '@lumen/ui';
import {
  ArrowRight,
  Brain,
  PlayCircle,
  Target,
  AlertTriangle,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { LocaleLink } from '@/app/[locale]/_components/LocaleLink';
import { getLearnerDashboardData } from '../../../actions/analytics';

export default async function LearnerAppPage() {
  const [data, locale] = await Promise.all([getLearnerDashboardData(), getLocale()]);
  const isBn = locale === 'bn';
  const firstName = data.actor.name.split(' ')[0] ?? data.actor.name;

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <section className="flex flex-col justify-between gap-4 rounded-[4px] border border-[var(--hairline)] border-l-4 border-l-[var(--brand)] bg-[var(--surface-paper)] p-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-extrabold tracking-tight text-[var(--brand-ink)]">
              {isBn ? `স্বাগতম, ${firstName}` : `Welcome back, ${firstName}`}
            </h1>
            <StreakPill
              streak={data.streak.currentStreak}
              isActiveToday={data.streak.isActiveToday}
              freezesRemaining={data.streak.freezeCount}
              variant="highlight"
            />
          </div>
          <p className="mt-1.5 text-sm text-[var(--text)]">
            {isBn
              ? `লক্ষ্য পরীক্ষার তারিখ: ${data.actor.targetDate} • বাকি ${data.actor.daysRemaining} দিন • লক্ষ্য স্কোর: ${data.actor.targetScore}+`
              : `Target exam date: ${data.actor.targetDate} • ${data.actor.daysRemaining} days remaining • Target Score: ${data.actor.targetScore}+`}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <LocaleLink
            href="/app/progress"
            className="inline-flex h-9 items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3.5 text-xs font-semibold text-[var(--brand-ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
          >
            <span>{isBn ? 'বিশ্লেষণ দেখুন' : 'Analytics View'}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </LocaleLink>
          <LocaleLink
            href="/exam/mock-session-01"
            className="inline-flex h-9 items-center gap-2 rounded-[4px] bg-[var(--brand)] px-4 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-deep)]"
          >
            <PlayCircle className="h-4 w-4" />
            <span>{isBn ? 'মক পরীক্ষা চালান' : 'Resume Mock'}</span>
          </LocaleLink>
        </div>
      </section>

      {/* XP Level Progress */}
      <LevelProgressBar
        level={data.level.level}
        title={data.level.title}
        totalXp={data.level.totalXp}
        currentLevelXp={data.level.currentLevelXp}
        xpForNextLevel={data.level.xpForNextLevel}
        progressPct={data.level.progressPct}
        nextLevelTitle={data.level.nextLevelTitle}
      />

      {/* Next Best Action */}
      <section className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-block rounded-[4px] border border-[var(--brand)]/25 bg-[var(--bg-tint)] px-2 py-0.5 text-xs font-semibold text-[var(--brand)]">
                {isBn ? 'পরবর্তী সেরা পদক্ষেপ' : 'Next Best Action'}
              </span>
              {data.nextBestAction.badge && (
                <span className="inline-block rounded-[4px] border border-[var(--accent)]/30 bg-[var(--bg-warm)] px-2 py-0.5 text-xs font-semibold text-[var(--terracotta)]">
                  {data.nextBestAction.badge}
                </span>
              )}
            </div>
            <h2 className="text-lg font-bold text-[var(--brand-ink)]">
              {data.nextBestAction.title}
            </h2>
            <p className="text-sm text-[var(--text)]">
              {data.nextBestAction.description}
            </p>
          </div>
          <LocaleLink
            href={data.nextBestAction.href}
            className="inline-flex h-10 shrink-0 items-center gap-2 rounded-[4px] bg-[var(--brand)] px-4 text-sm font-semibold text-white transition-colors hover:bg-[var(--brand-deep)]"
          >
            <Sparkles className="h-4 w-4" />
            <span>{data.nextBestAction.actionLabel}</span>
          </LocaleLink>
        </div>
      </section>

      {/* Quick Stats Exposed Hairline Grid */}
      <section className="grid divide-y divide-[var(--hairline)] rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
        <div className="p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
            <span>{isBn ? 'কোয়ান্ট নির্ভুলতা' : 'Quant Accuracy'}</span>
            <Target className="h-4 w-4 text-[var(--brand)]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[var(--brand-ink)]">
            {data.stats.quantAccuracy}%
          </div>
          <p className="mt-1 text-xs font-medium text-emerald-700">
            {isBn ? 'ডায়াগনস্টিক থেকে +৪%' : '+4% from diagnostic'}
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
            <span>{isBn ? 'ভার্বাল দক্ষতা' : 'Verbal Mastery'}</span>
            <BookOpen className="h-4 w-4 text-[var(--brand-deep)]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[var(--brand-ink)]">
            {data.stats.verbalMastery}%
          </div>
          <p className="mt-1 text-xs font-medium text-[var(--terracotta)]">
            {isBn ? 'টেক্সট কমপ্লিশন ফাঁদ শনাক্ত হয়েছে' : 'Text Completion traps detected'}
          </p>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
            <span>{isBn ? 'এফএসআরএস ভোকাব কার্ড' : 'FSRS Vocab Cards'}</span>
            <Brain className="h-4 w-4 text-[var(--brand)]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[var(--brand-ink)]">
            {data.stats.fsrsCardsDue} {isBn ? 'বাকি' : 'due'}
          </div>
          <LocaleLink
            href="/app/vocab"
            className="mt-1 block text-xs font-semibold text-[var(--link)] underline underline-offset-4 hover:text-[var(--brand-deep)]"
          >
            {isBn
              ? `ডেক রিভিউ করুন (মোট ${data.stats.fsrsCardsTotal})`
              : `Review deck (${data.stats.fsrsCardsTotal} total)`}{' '}
            →
          </LocaleLink>
        </div>

        <div className="p-5">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--text)]">
            <span>{isBn ? 'ভুলের নোটবুক' : 'Mistake Notebook'}</span>
            <AlertTriangle className="h-4 w-4 text-[var(--accent)]" />
          </div>
          <div className="mt-2 text-2xl font-extrabold text-[var(--brand-ink)]">
            {data.stats.openMistakesCount} {isBn ? 'খোলা' : 'open'}
          </div>
          <LocaleLink
            href="/app/mistakes"
            className="mt-1 block text-xs font-semibold text-[var(--link)] underline underline-offset-4 hover:text-[var(--brand-deep)]"
          >
            {isBn ? 'ভুল সমাধান করুন' : 'Resolve mistakes'} →
          </LocaleLink>
        </div>
      </section>

      {/* Estimated GRE Score Predictor Component */}
      <ScorePredictorChart
        estimatedQuant={data.predictor.estimatedQuant}
        estimatedVerbal={data.predictor.estimatedVerbal}
        estimatedTotal={data.predictor.estimatedTotal}
        estimatedAwa={data.predictor.estimatedAwa}
        targetScore={{ quant: 165, verbal: 160, total: 325 }}
        confidence={data.predictor.confidence}
        trendHistory={data.predictor.trendHistory}
      />

      {/* Study Activities & Direct Drill Links */}
      <section className="grid divide-y divide-[var(--hairline)] rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] md:grid-cols-2 md:divide-x md:divide-y-0">
        <div className="space-y-3 p-6">
          <div className="flex items-center gap-2 text-base font-bold text-[var(--brand-ink)]">
            <Brain className="h-4 w-4 text-[var(--brand)]" />
            <h2>{isBn ? 'সক্রিয় অনুশীলন ও ভোকাবুলারি' : 'Active Pedagogy & Practice'}</h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text)]">
            {isBn
              ? '৩-স্তরের হিন্ট, ডিস্ট্রাক্টর ফাঁদ বিশ্লেষণ এবং ধাপে ধাপে সমাধানের সাথে জিআরই অনুশীলন করুন।'
              : 'Practice authentic GRE-style questions with 3-tier progressive hints, second-chance trap diagnostics, and Socratic walkthroughs.'}
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <LocaleLink
              href="/app/practice"
              className="inline-flex h-8 items-center gap-1.5 rounded-[4px] bg-[var(--brand)] px-3.5 text-xs font-semibold text-white transition-colors hover:bg-[var(--brand-deep)]"
            >
              <span>{isBn ? 'অনুশীলন শুরু করুন' : 'Start Practice Quiz'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </LocaleLink>
            <LocaleLink
              href="/app/vocab/play"
              className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3.5 text-xs font-semibold text-[var(--brand-ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              <span>{isBn ? 'ভোকাব খেলুন' : 'Play Vocab'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </LocaleLink>
          </div>
        </div>

        <div className="space-y-3 p-6">
          <div className="flex items-center gap-2 text-base font-bold text-[var(--brand-ink)]">
            <Clock className="h-4 w-4 text-[var(--brand-deep)]" />
            <h2>{isBn ? 'পেসিং ও পূর্ণ সিবিটি মক' : 'Pacing & Full CBT Mocks'}</h2>
          </div>
          <p className="text-sm leading-relaxed text-[var(--text)]">
            {isBn
              ? 'অন-স্ক্রিন ক্যালকুলেটর, রিভিউ নেভিগেটর এবং সেকশন-অ্যাডাপ্টিভ রাউটিং সহ কম্পিউটার-ভিত্তিক মক পরীক্ষা দিন।'
              : 'Experience the authentic computer-based GRE testing engine with on-screen calculator, review navigator, and section-level adaptive routing.'}
          </p>
          <div className="flex flex-wrap gap-2.5 pt-1">
            <LocaleLink
              href="/exam/mock-session-01"
              className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3.5 text-xs font-semibold text-[var(--brand-ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              <span>{isBn ? 'সেকশনাল মক' : 'Sectional Mock'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </LocaleLink>
            <LocaleLink
              href="/app/mistakes"
              className="inline-flex h-8 items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg-warm)] px-3.5 text-xs font-semibold text-[var(--brand-ink)] transition-colors hover:border-[var(--brand)] hover:text-[var(--brand)]"
            >
              <span>{isBn ? 'ভুলের নোটবুক' : 'Mistake Notebook'}</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </LocaleLink>
          </div>
        </div>
      </section>
    </div>
  );
}
