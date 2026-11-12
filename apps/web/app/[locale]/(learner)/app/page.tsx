/** @purpose Main Learner Dashboard (/app) with study streaks, XP levels, and GRE score predictor */
import Link from 'next/link';
import {
  Button,
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
  ArrowRight,
  Brain,
  PlayCircle,
  Target,
  AlertTriangle,
  Clock,
  Sparkles,
  BookOpen,
} from 'lucide-react';
import { getLearnerDashboardData } from '../../../actions/analytics';

export default async function LearnerAppPage() {
  const data = await getLearnerDashboardData();

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-surface border-border flex flex-col justify-between gap-4 rounded-xl border p-6 shadow-xs sm:flex-row sm:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-fg text-2xl font-bold tracking-tight">
              Welcome back, {data.actor.name.split(' ')[0]}
            </h1>
            <StreakPill
              streak={data.streak.currentStreak}
              isActiveToday={data.streak.isActiveToday}
              freezesRemaining={data.streak.freezeCount}
              variant="highlight"
            />
          </div>
          <p className="text-fg-muted mt-1 text-sm">
            Target exam date: {data.actor.targetDate} • {data.actor.daysRemaining} days remaining • Target Score: {data.actor.targetScore}+
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/app/progress">
            <Button variant="outline" size="sm" className="gap-1.5">
              Analytics View <ArrowRight className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Link href="/exam/mock-session-01">
            <Button className="shrink-0 gap-2">
              <PlayCircle className="h-4 w-4" /> Resume Mock
            </Button>
          </Link>
        </div>
      </div>

      {/* Khan Academy Style XP Level Progress */}
      <LevelProgressBar
        level={data.level.level}
        title={data.level.title}
        totalXp={data.level.totalXp}
        currentLevelXp={data.level.currentLevelXp}
        xpForNextLevel={data.level.xpForNextLevel}
        progressPct={data.level.progressPct}
        nextLevelTitle={data.level.nextLevelTitle}
      />

      {/* Next Best Action (Hero Widget W-S-NBA) */}
      <div className="bg-surface border-border overflow-hidden rounded-xl border p-5 shadow-xs">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Badge variant="default" className="text-xs">
                Next Best Action
              </Badge>
              {data.nextBestAction.badge && (
                <span className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-[11px] font-semibold rounded-md px-2 py-0.5">
                  {data.nextBestAction.badge}
                </span>
              )}
            </div>
            <h2 className="text-fg text-lg font-bold">
              {data.nextBestAction.title}
            </h2>
            <p className="text-fg-muted text-sm">
              {data.nextBestAction.description}
            </p>
          </div>
          <Link href={data.nextBestAction.href}>
            <Button className="shrink-0 gap-2">
              <Sparkles className="h-4 w-4" /> {data.nextBestAction.actionLabel}
            </Button>
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-fg-muted text-xs font-semibold uppercase flex items-center justify-between">
              <span>Quant Accuracy</span>
              <Target className="h-4 w-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-fg text-2xl font-bold">{data.stats.quantAccuracy}%</div>
            <p className="text-emerald-600 dark:text-emerald-400 mt-1 text-xs">+4% from diagnostic</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-fg-muted text-xs font-semibold uppercase flex items-center justify-between">
              <span>Verbal Mastery</span>
              <BookOpen className="h-4 w-4 text-sky-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-fg text-2xl font-bold">{data.stats.verbalMastery}%</div>
            <p className="text-amber-600 dark:text-amber-400 mt-1 text-xs">Text Completion traps detected</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-fg-muted text-xs font-semibold uppercase flex items-center justify-between">
              <span>FSRS Vocab Cards</span>
              <Brain className="h-4 w-4 text-accent" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-fg text-2xl font-bold">{data.stats.fsrsCardsDue} due</div>
            <Link href="/app/flashcards" className="text-accent hover:underline mt-1 text-xs block">
              Review deck ({data.stats.fsrsCardsTotal} total) →
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-fg-muted text-xs font-semibold uppercase flex items-center justify-between">
              <span>Mistake Notebook</span>
              <AlertTriangle className="h-4 w-4 text-amber-500" />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-fg text-2xl font-bold">{data.stats.openMistakesCount} open</div>
            <Link href="/app/mistakes" className="text-amber-600 dark:text-amber-400 hover:underline mt-1 text-xs block">
              Resolve mistakes →
            </Link>
          </CardContent>
        </Card>
      </div>

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
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Brain className="text-accent h-4 w-4" />
              Active Pedagogy & Practice
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-fg-muted text-sm">
              Practice authentic GRE-style questions with 3-tier progressive hints, second-chance trap diagnostics, and Socratic walkthroughs.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/app/practice">
                <Button size="sm" className="gap-1.5">
                  Start Practice Quiz <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/app/vocab/play">
                <Button variant="outline" size="sm" className="gap-1.5">
                  Play Vocab <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="text-sky-500 h-4 w-4" />
              Pacing & Full CBT Mocks
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-fg-muted text-sm">
              Experience the authentic computer-based GRE testing engine with on-screen calculator, review navigator, and section-level adaptive routing.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              <Link href="/exam/mock-session-01">
                <Button size="sm" variant="outline" className="gap-1.5">
                  Sectional Mock <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
              <Link href="/app/mistakes">
                <Button variant="outline" size="sm" className="gap-1.5 text-amber-600 dark:text-amber-400">
                  Mistake Notebook <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
