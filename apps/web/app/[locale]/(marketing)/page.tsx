/** @purpose Marketing landing page showcasing GRE & IELTS test engines and lead-magnet tools */
import Link from 'next/link';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  Sparkles,
  Brain,
  Zap,
  ArrowRight,
  BarChart3,
  ShieldAlert,
} from 'lucide-react';

export default function MarketingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* Hero Section */}
      <section className="w-full px-4 py-16 text-center sm:py-24 border-b border-border/40 bg-surface/30">
        <div className="mx-auto max-w-4xl space-y-6">
          <Badge variant="default" className="gap-1.5 px-3 py-1">
            <Sparkles className="h-3.5 w-3.5" />
            Next-Gen GRE & IELTS Computer-Based Testing
          </Badge>
          <h1 className="text-fg text-4xl font-extrabold tracking-tight sm:text-6xl">
            Target 330+ GRE & Band 8.0+ IELTS with High Precision
          </h1>
          <p className="text-fg-muted mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed">
            The first Bangladesh-tailored ed-tech platform featuring authentic ETS exam interfaces,
            section-adaptive difficulty algorithms, active-recall FSRS flashcards, and instant
            Socratic walkthroughs.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/diagnostic">
              <Button size="lg" className="gap-2">
                Launch Free Express Diagnostic <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/gre">
              <Button variant="outline" size="lg">
                Explore GRE Platform
              </Button>
            </Link>
            <Link href="/pricing">
              <Button variant="ghost" size="lg">
                View Pricing & Passes
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Pillars */}
      <section className="w-full max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-border bg-surface">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle>Authentic CBT Engine</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm leading-relaxed">
              Practice in pixel-accurate test interfaces replicating ETS PowerPrep and
              computer-delivered IELTS, with official calculators, keyboard navigation, and 10s
              autosave.
            </CardContent>
          </Card>

          <Card className="border-border bg-surface">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <Brain className="h-5 w-5" />
              </div>
              <CardTitle>4-Mode Active Recall (FSRS)</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm leading-relaxed">
              Master 1,500+ high-frequency GRE words with scientifically calibrated intervals across
              flashcards, dual-definition matching, roots, and timed sentence completion.
            </CardContent>
          </Card>

          <Card className="border-border bg-surface">
            <CardHeader>
              <div className="bg-accent/10 text-accent mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <CardTitle>Trap Diagnostics & Socratic Hints</CardTitle>
            </CardHeader>
            <CardContent className="text-fg-muted text-sm leading-relaxed">
              Never just see why the answer is right. Discover why each incorrect distractor was an
              engineered trap, with progressive 3-tier hints for guided mastery.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Flagship Showcases Cards */}
      <section className="w-full border-t border-border/50 bg-canvas px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-3xl font-extrabold text-fg sm:text-4xl">
              Curriculum Tracks Built for Bangladesh Scholars
            </h2>
            <p className="text-fg-muted text-base max-w-2xl mx-auto">
              Select your examination to explore specialized test suites, diagnostic tools, and
              curriculum roadmaps.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* GRE Card */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <Badge variant="outline" className="border-accent text-accent text-xs">
                  Flagship
                </Badge>
                <h3 className="text-2xl font-bold text-fg">GRE® Prep Platform</h3>
                <p className="text-fg-muted text-sm leading-relaxed">
                  Featuring the complete Magoosh + GregMat + Brilliant Parity Suite: Section-Adaptive
                  CBT Mocks, 3-Tier Hint Ladders, Distractor Trap Diagnostics, and Socratic
                  Step-by-Step Solvers.
                </p>
                <div className="pt-2">
                  <Link
                    href="/tools/gre-score-calculator"
                    className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold hover:underline"
                  >
                    <BarChart3 className="h-4 w-4" /> Try Free GRE Raw-to-Scaled Calculator &rarr;
                  </Link>
                </div>
              </div>
              <div className="pt-6 border-t border-border/60 mt-6 flex gap-3">
                <Link href="/gre" className="flex-1">
                  <Button className="w-full gap-2">
                    Explore GRE Platform <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* IELTS Card */}
            <div className="rounded-2xl border border-border bg-surface p-8 shadow-sm flex flex-col justify-between">
              <div className="space-y-4">
                <Badge variant="outline" className="border-border text-fg text-xs">
                  Academic & General
                </Badge>
                <h3 className="text-2xl font-bold text-fg">IELTS® CD-Prep Platform</h3>
                <p className="text-fg-muted text-sm leading-relaxed">
                  Authentic Computer-Delivered IELTS test runners with single-play audio listening,
                  split-pane reading with highlighter, and instant AI Writing/Speaking rubric
                  diagnostics.
                </p>
                <div className="pt-2">
                  <Link
                    href="/tools/ielts-band-calculator"
                    className="inline-flex items-center gap-1.5 text-xs text-accent font-semibold hover:underline"
                  >
                    <BarChart3 className="h-4 w-4" /> Try Free IELTS 4-Skill Band Calculator &rarr;
                  </Link>
                </div>
              </div>
              <div className="pt-6 border-t border-border/60 mt-6 flex gap-3">
                <Link href="/ielts" className="flex-1">
                  <Button className="w-full gap-2">
                    Explore IELTS Platform <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Free Interactive Diagnostic Banner */}
      <section className="w-full border-t border-border bg-surface/50 px-4 py-16 text-center">
        <div className="mx-auto max-w-3xl space-y-5">
          <Badge variant="default" className="text-xs">
            No Account Needed To Start
          </Badge>
          <h2 className="text-3xl font-extrabold text-fg sm:text-4xl">
            Find Your Baseline in 15 Minutes
          </h2>
          <p className="text-fg-muted text-base max-w-xl mx-auto">
            Experience our real Computer-Based Testing shell with an 8-question Express Diagnostic.
            Receive an instant Rasch-calibrated ability score and trap breakdown.
          </p>
          <div className="pt-2">
            <Link href="/diagnostic">
              <Button size="lg" className="gap-2">
                Launch Express Diagnostic <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
