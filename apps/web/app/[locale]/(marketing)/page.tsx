/** @purpose Marketing landing page showcasing GRE & IELTS test engines, Oxford Navy hero, and Bangladesh Payment Trust Bar (BUG-12) */
import { getTranslations } from 'next-intl/server';
import { Link } from '@/src/i18n/routing';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  Sparkles,
  Brain,
  Zap,
  ArrowRight,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  Award,
  Receipt,
} from 'lucide-react';
import { BangladeshPaymentTrustBar } from './_components/BangladeshPaymentTrustBar';

export default async function MarketingPage() {
  const tHero = await getTranslations('hero');

  return (
    <div className="flex flex-col items-center">
      {/* High-Contrast Oxford Navy Hero Section (BUG-12) */}
      <section className="relative w-full overflow-hidden border-b border-slate-800 bg-slate-950 px-4 py-16 text-center text-white sm:py-24">
        {/* Subtle Architectural Grid Accent */}
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-35"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-950/80 px-3.5 py-1.5 text-xs font-semibold text-blue-200">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>{tHero('badge')}</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-tight">
            {tHero('title')}
          </h1>

          <p className="mx-auto max-w-2xl text-base text-slate-300 sm:text-xl leading-relaxed">
            {tHero('subtitle')}
          </p>

          {/* Crisp Metric Badges */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 pt-2">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-400/30 bg-indigo-950/90 px-3.5 py-1 text-xs font-semibold text-indigo-200">
              <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
              130–170 Rasch IRT Adaptive
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-950/90 px-3.5 py-1 text-xs font-semibold text-emerald-200">
              <Award className="h-3.5 w-3.5 text-emerald-400" />
              Band 0–9 Official Rubric AI
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-slate-900 px-3.5 py-1 text-xs font-semibold text-slate-200">
              <Receipt className="h-3.5 w-3.5 text-blue-400" />
              Mushak 6.3 VAT Included
            </span>
          </div>

          {/* Primary CTAs */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/exam/diagnostic">
              <Button size="lg" className="gap-2 bg-blue-600 text-white hover:bg-blue-500 shadow-lg">
                {tHero('launchDiagnostic')} <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/gre">
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 bg-slate-900 text-white hover:bg-slate-800"
              >
                {tHero('exploreGre')}
              </Button>
            </Link>
            <Link href="/pricing">
              <Button
                variant="ghost"
                size="lg"
                className="text-slate-300 hover:bg-slate-900 hover:text-white"
              >
                {tHero('viewPricing')}
              </Button>
            </Link>
          </div>

          {/* Prominent Bangladeshi Payment & Trust Bar */}
          <div className="pt-8">
            <BangladeshPaymentTrustBar variant="dark" />
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-950 text-indigo-200">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-slate-900">Authentic CBT Engine</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm leading-relaxed">
              Practice in pixel-accurate test interfaces replicating ETS PowerPrep and
              computer-delivered IELTS, with official calculators, keyboard navigation, and 10s
              autosave.
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white">
                <Brain className="h-5 w-5" />
              </div>
              <CardTitle className="text-slate-900">4-Mode Active Recall (FSRS)</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm leading-relaxed">
              Master 1,500+ high-frequency GRE words with scientifically calibrated intervals across
              flashcards, dual-definition matching, roots, and timed sentence completion.
            </CardContent>
          </Card>

          <Card className="border-slate-200/80 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950 text-emerald-200">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <CardTitle className="text-slate-900">Trap Diagnostics &amp; Socratic Hints</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm leading-relaxed">
              Never just see why the answer is right. Discover why each incorrect distractor was an
              engineered trap, with progressive 3-tier hints for guided mastery.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Flagship Colour-Coded Track Cards */}
      <section className="w-full border-t border-slate-200 bg-slate-50/70 px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-3xl font-extrabold text-slate-950 sm:text-4xl">
              Curriculum Tracks Built for Bangladesh Scholars
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              Select your examination to explore specialized test suites, diagnostic tools, and
              curriculum roadmaps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* GRE Royal Indigo Card */}
            <div className="overflow-hidden rounded-2xl border border-indigo-200 bg-white shadow-md flex flex-col justify-between">
              <div className="bg-indigo-950 px-8 py-5 text-white flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                  Flagship Track • Quant &amp; Verbal 130–170
                </span>
                <Badge className="bg-blue-600 text-white border-0 text-xs">Royal Indigo</Badge>
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-950">GRE® Prep Platform</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Featuring the complete Magoosh + GregMat + Brilliant Parity Suite: Section-Adaptive
                    CBT Mocks, 3-Tier Hint Ladders, Distractor Trap Diagnostics, and Socratic
                    Step-by-Step Solvers.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/tools/gre-score-calculator"
                      className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
                    >
                      <BarChart3 className="h-4 w-4" /> Try Free GRE Raw-to-Scaled Calculator &rarr;
                    </Link>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex gap-3">
                  <Link href="/gre" className="flex-1">
                    <Button className="w-full gap-2 bg-indigo-950 text-white hover:bg-indigo-900">
                      Explore GRE Platform <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* IELTS British Emerald Card */}
            <div className="overflow-hidden rounded-2xl border border-emerald-200 bg-white shadow-md flex flex-col justify-between">
              <div className="bg-emerald-950 px-8 py-5 text-white flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-200">
                  Academic &amp; General • Band 0–9.0
                </span>
                <Badge className="bg-teal-600 text-white border-0 text-xs">British Emerald</Badge>
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-950">IELTS® CD-Prep Platform</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    Authentic Computer-Delivered IELTS test runners with single-play audio listening,
                    split-pane reading with highlighter, and instant AI Writing/Speaking rubric
                    diagnostics.
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/tools/ielts-band-calculator"
                      className="inline-flex items-center gap-1.5 text-xs text-teal-700 font-semibold hover:underline"
                    >
                      <BarChart3 className="h-4 w-4" /> Try Free IELTS 4-Skill Band Calculator &rarr;
                    </Link>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex gap-3">
                  <Link href="/ielts" className="flex-1">
                    <Button className="w-full gap-2 bg-emerald-950 text-white hover:bg-emerald-900">
                      Explore IELTS Platform <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Interactive Diagnostic Banner */}
      <section className="w-full border-t border-slate-800 bg-slate-950 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl space-y-5">
          <span className="inline-block rounded-full border border-blue-400/30 bg-blue-950 px-3 py-1 text-xs font-semibold text-blue-300">
            No Account Needed To Start
          </span>
          <h2 className="text-3xl font-extrabold text-white sm:text-4xl">
            Find Your Baseline in 15 Minutes
          </h2>
          <p className="text-slate-300 text-base max-w-xl mx-auto">
            Experience our real Computer-Based Testing shell with an 8-question Express Diagnostic.
            Receive an instant Rasch-calibrated ability score and trap breakdown.
          </p>
          <div className="pt-2">
            <Link href="/exam/diagnostic">
              <Button size="lg" className="gap-2 bg-blue-600 text-white hover:bg-blue-500">
                Launch Express Diagnostic <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
