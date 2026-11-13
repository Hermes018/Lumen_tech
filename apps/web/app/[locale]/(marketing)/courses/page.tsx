/** @purpose Courses index page listing GRE, IELTS Academic & General curriculum tracks */
import Link from 'next/link';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  ArrowRight,
  CheckCircle,
} from 'lucide-react';

export const metadata = {
  title: 'Courses & Curriculum | GRE & IELTS Test Engines | Lumen Academy',
  description:
    'Explore our comprehensive GRE and IELTS prep courses with section-adaptive mock tests, FSRS vocabulary systems, and Socratic hint ladders.',
};

export default function CoursesPage() {
  return (
    <div className="flex flex-col items-center px-4 py-16 sm:py-24">
      <div className="mx-auto max-w-6xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="border-accent text-accent text-xs">
            Curriculum Catalog
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
            Choose Your Preparation Track
          </h1>
          <p className="text-fg-muted text-base sm:text-lg">
            Every course combines authentic computer-based testing engines, active-recall spaced
            repetition, and transparent pricing with no hidden fees.
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Track 1: GRE Prep */}
          <Card className="border-border bg-surface transition-all hover:shadow-md flex flex-col justify-between">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="text-xs">
                  Flagship Track
                </Badge>
                <span className="font-mono text-xs font-semibold text-accent">Target 330+</span>
              </div>
              <CardTitle className="text-2xl font-bold text-fg">GRE® General Test Prep</CardTitle>
              <p className="text-fg-muted text-sm">
                Engineered for STEM, Business, and Graduate School applicants targeting top US and
                global universities.
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-2 text-sm text-fg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>Magoosh + GregMat + Brilliant Parity Suite</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>Section-Adaptive CBT Mocks with Rasch 1PL Ability Scoring</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>3-Tier Progressive Hint Ladders & Trap Diagnostics</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>1,500+ Word Vocab Engine with FSRS-4.5 Spaced Repetition</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex flex-wrap gap-3">
                <Link href="/gre" className="flex-1">
                  <Button className="w-full gap-2">
                    Explore GRE Platform <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tools/gre-score-calculator">
                  <Button variant="outline">Score Calculator</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Track 2: IELTS Prep */}
          <Card className="border-border bg-surface transition-all hover:shadow-md flex flex-col justify-between">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-border text-fg text-xs">
                  Academic & General
                </Badge>
                <span className="font-mono text-xs font-semibold text-accent">Target Band 7.5+</span>
              </div>
              <CardTitle className="text-2xl font-bold text-fg">IELTS® CD Test Prep</CardTitle>
              <p className="text-fg-muted text-sm">
                Complete preparation for higher study admissions and skilled immigration (Express
                Entry, UK, Australia).
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-2 text-sm text-fg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>Authentic Computer-Delivered IELTS Interface Shell</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>Single-play Audio Listening & Split-Pane Reading</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>AI Writing Evaluator with Task Achievement & Cohesion Breakdown</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>Speaking Simulator with Fluency & Lexical Metrics</span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex flex-wrap gap-3">
                <Link href="/ielts" className="flex-1">
                  <Button className="w-full gap-2">
                    Explore IELTS Platform <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tools/ielts-band-calculator">
                  <Button variant="outline">Band Calculator</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All-Access Passes & Pricing CTA */}
        <div className="rounded-2xl border border-accent/20 bg-surface p-8 text-center sm:p-12 space-y-4">
          <Badge variant="outline" className="border-accent text-accent text-xs">
            Flexible Membership
          </Badge>
          <h2 className="text-2xl font-bold text-fg sm:text-3xl">
            Need Access to Both Exams? Try an All-Access Pass
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto text-sm">
            Our 1-Month, 3-Month, and 12-Month Passes unlock full access across all GRE & IELTS
            mock test series, question banks, and AI evaluation credits.
          </p>
          <div className="pt-2">
            <Link href="/pricing">
              <Button size="lg" className="gap-2">
                View All Pricing & Pass Options <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
