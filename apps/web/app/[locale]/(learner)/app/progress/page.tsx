/** @purpose Learner Progress & Analytics view (/app/progress) with mastery matrix and 30-day activity calendar */
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  StreakPill,
  LevelProgressBar,
  ScorePredictorChart,
  Badge,
} from '@lumen/ui';
import {
  ArrowLeft,
  Calendar,
  Flame,
  Shield,
  Trophy,
} from 'lucide-react';
import { getLearnerDashboardData } from '../../../../actions/analytics';
import { LEVEL_THRESHOLDS } from '@lumen/core';

export default async function LearnerProgressPage() {
  const data = await getLearnerDashboardData();

  const quantSkills = data.skills.filter((s) => s.subject === 'quant');
  const verbalSkills = data.skills.filter((s) => s.subject === 'verbal');

  const getStageBadge = (stage: string) => {
    switch (stage) {
      case 'mastered':
        return <Badge variant="default" className="bg-emerald-600 dark:bg-emerald-500 text-white">Mastered (100%)</Badge>;
      case 'proficient':
        return <Badge variant="default" className="bg-sky-600 dark:bg-sky-500 text-white">Proficient</Badge>;
      case 'familiar':
        return <Badge variant="warning">Familiar</Badge>;
      default:
        return <Badge variant="outline">Not Started</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with Navigation */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Link
              href="/app"
              className="text-fg-muted hover:text-fg flex items-center gap-1 text-sm transition-colors"
            >
              <ArrowLeft className="h-4 w-4" /> Back to Dashboard
            </Link>
          </div>
          <h1 className="text-fg mt-2 text-2xl font-bold tracking-tight">
            Skill Mastery & Score Analytics
          </h1>
          <p className="text-fg-muted text-sm">
            Comprehensive diagnostic metrics, Khan Academy style skill mastery, and 30-day study consistency.
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
        <div className="lg:col-span-1">
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
          <Card className="mt-4">
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-semibold uppercase text-fg-muted flex items-center gap-1.5">
                <Trophy className="h-3.5 w-3.5 text-accent" />
                Rank Progression Roadmap
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-xs">
              {LEVEL_THRESHOLDS.slice(0, 6).map((tier) => {
                const isCurrent = tier.level === data.level.level;
                const isUnlocked = tier.level < data.level.level;
                return (
                  <div
                    key={tier.level}
                    className={`flex items-center justify-between p-2 rounded-md ${
                      isCurrent
                        ? 'bg-accent/10 font-bold text-accent'
                        : isUnlocked
                        ? 'text-fg-muted line-through opacity-70'
                        : 'text-fg-muted'
                    }`}
                  >
                    <span>Level {tier.level}: {tier.title}</span>
                    <span>{tier.requiredXp} XP</span>
                  </div>
                );
              })}
            </CardContent>
          </Card>
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
      <Card>
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              30-Day Study Consistency Calendar
            </CardTitle>
            <div className="flex items-center gap-4 text-xs text-fg-muted">
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded-xs bg-amber-500" /> Active Day
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded-xs bg-sky-500" /> Freeze Protected
              </span>
              <span className="flex items-center gap-1">
                <span className="inline-block h-3 w-3 rounded-xs bg-surface-2 border border-border" /> Rest / Missed
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-15 gap-2">
            {data.streak.calendar30Days.map((day) => {
              const dateObj = new Date(day.date);
              const label = `${dateObj.getUTCDate()} ${dateObj.toLocaleString('default', { month: 'short' })}`;

              let bg = 'bg-surface-2 border-border text-fg-muted';
              if (day.status === 'active') {
                bg = 'bg-amber-500 text-white font-bold border-amber-600';
              } else if (day.status === 'frozen') {
                bg = 'bg-sky-500 text-white font-bold border-sky-600';
              }

              return (
                <div
                  key={day.date}
                  className={`flex flex-col items-center justify-center p-2 rounded-lg border text-center text-xs transition-all ${bg}`}
                  title={`${day.date}: ${day.count} activities (${day.status})`}
                >
                  <span className="text-[10px] opacity-80">{label.split(' ')[1]}</span>
                  <span className="text-sm font-semibold">{label.split(' ')[0]}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-4 text-xs text-fg-muted">
            <div className="flex items-center gap-2">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Current Streak: <strong className="text-fg">{data.streak.currentStreak} days</strong></span>
              <span className="mx-2">•</span>
              <span>Longest Streak: <strong className="text-fg">{data.streak.longestStreak} days</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-sky-500" />
              <span>Freezes Available: <strong className="text-fg">{data.streak.freezeCount} of 2</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Khan Academy Style Skill Mastery Matrix */}
      <div className="space-y-6">
        <div>
          <h2 className="text-fg text-xl font-bold">Quantitative Reasoning Mastery</h2>
          <p className="text-fg-muted text-xs">Based on scored objective questions and sectional tests.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {quantSkills.map((skill) => (
            <Card key={skill.skillSlug} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-fg font-semibold text-sm">{skill.name}</span>
                {getStageBadge(skill.stage)}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-fg-muted">
                <span>Accuracy: <strong className="text-fg">{skill.accuracy}%</strong> ({skill.correctCount}/{skill.attemptsCount})</span>
                <span>{skill.pointsEarned} / {skill.pointsMax} pts</span>
              </div>
              <div className="mt-2 bg-surface-2 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-accent h-full rounded-full"
                  style={{ width: `${skill.accuracy}%` }}
                />
              </div>
            </Card>
          ))}
        </div>

        <div className="pt-4">
          <h2 className="text-fg text-xl font-bold">Verbal Reasoning Mastery</h2>
          <p className="text-fg-muted text-xs">Text Completion, Sentence Equivalence, and Reading Comprehension accuracy.</p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {verbalSkills.map((skill) => (
            <Card key={skill.skillSlug} className="p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-fg font-semibold text-sm">{skill.name}</span>
                {getStageBadge(skill.stage)}
              </div>
              <div className="mt-3 flex items-center justify-between text-xs text-fg-muted">
                <span>Accuracy: <strong className="text-fg">{skill.accuracy}%</strong> ({skill.correctCount}/{skill.attemptsCount})</span>
                <span>{skill.pointsEarned} / {skill.pointsMax} pts</span>
              </div>
              <div className="mt-2 bg-surface-2 h-2 w-full overflow-hidden rounded-full">
                <div
                  className="bg-accent h-full rounded-full"
                  style={{ width: `${skill.accuracy}%` }}
                />
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
