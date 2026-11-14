/** @purpose IELTS Marketing showcase highlighting Computer-Delivered exam engine & 4-skill mastery with British Emerald & Teal identity (BUG-12) */
import Link from 'next/link';
import { brand } from '@lumen/config';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  Sparkles,
  Headphones,
  BookOpen,
  PenTool,
  Mic,
  ArrowRight,
  CheckCircle,
  BarChart3,
  Columns2,
  MonitorCheck,
} from 'lucide-react';

export const metadata = {
  title: `IELTS Academic & General Prep | Authentic Computer-Delivered Mocks | ${brand.name}`,
  description:
    'Achieve Band 7.5+ with pixel-perfect Computer-Delivered IELTS test runners, AI writing & speaking band diagnostic, and authentic Cambridge-style item banks.',
};

export default function IeltsMarketingPage() {
  return (
    <div className="flex flex-col items-center">
      {/* British Emerald & Teal Hero Section (BUG-12) */}
      <section className="relative w-full overflow-hidden border-b border-emerald-900 bg-emerald-950 px-4 py-16 text-white sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#064e3b_1px,transparent_1px),linear-gradient(to_bottom,#064e3b_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-35"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-emerald-900/70 px-3.5 py-1 text-xs font-semibold text-emerald-100">
            <Sparkles className="h-3.5 w-3.5 text-teal-400" />
            <span>Computer-Delivered IELTS Parity</span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-tight">
            Target Band <span className="text-teal-400">7.5 to 8.5</span> with Exam-Room Precision
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-emerald-100/90 sm:text-xl leading-relaxed">
            Practice in the exact interface used in British Council &amp; IDP exam centres.
            Realistic single-play listening, split-pane reading with text highlighter, and instant
            rubric evaluations for Writing &amp; Speaking.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/exam/ielts-preview">
              <Button size="lg" className="gap-2 bg-teal-600 text-white hover:bg-teal-500 shadow-lg">
                Launch Split-Screen CBT Simulator <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/exam/diagnostic">
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-700 bg-emerald-900/60 text-white hover:bg-emerald-800"
              >
                Take Free IELTS Band Diagnostic
              </Button>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-teal-400" /> CD-IELTS Authentic UI Shell
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-teal-400" /> 4-Dimension Human + AI Rubric
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-teal-400" /> Academic &amp; General Training
            </span>
          </div>
        </div>
      </section>

      {/* Direct "Launch Split-Screen CBT Simulator" Preview Card */}
      <section className="w-full max-w-6xl px-4 pt-14 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-xl">
          <div className="bg-emerald-950 px-6 py-3 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Columns2 className="h-4 w-4 text-teal-400" />
              <span className="font-bold uppercase tracking-wider text-emerald-100">
                CD-IELTS Split-Pane Reading &amp; Listening Runner
              </span>
            </div>
            <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              Live Interactive Sandbox
            </span>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-4 lg:col-span-7">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                Launch Split-Screen CBT Simulator
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                Experience the authentic 2-column reading passage &amp; question workbench with
                built-in text highlighting, bottom question palette navigation, and real-time word
                count tracking—without creating an account.
              </p>
              <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-700 sm:grid-cols-2 pt-1">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Independent Dual-Pane Scrolling</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>Yellow / Pink Passage Highlighter</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>True / False / Not Given Drills</span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>10-Second Cloud Autosave</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 lg:col-span-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-950 text-teal-300">
                  <MonitorCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950">Instant Browser Preview</div>
                  <div className="text-xs text-slate-600">Desktop split-screen &amp; mobile tabs</div>
                </div>
              </div>
              <Link href="/exam/ielts-preview" className="block w-full">
                <Button className="w-full justify-center gap-2 bg-teal-600 text-white hover:bg-teal-500 font-semibold">
                  Launch Split-Screen CBT Simulator <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing" className="block text-center text-xs font-semibold text-teal-700 hover:underline">
                Compare IELTS Academic &amp; GT Plans &rarr;
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Skills Breakdown */}
      <section className="w-full max-w-7xl px-4 py-16 sm:py-24">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="outline" className="border-teal-600 text-teal-700 text-xs">
            British Emerald &amp; Teal Curriculum
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            Complete Mastery Across All 4 Skills
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            Engineered to overcome the specific bottlenecks faced by Bangladeshi test takers in
            Writing Task 2 coherence and Speaking fluency.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Listening */}
          <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-teal-400">
            <CardHeader>
              <div className="bg-emerald-950 text-teal-300 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <Headphones className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-slate-950">Listening Runner</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm space-y-2">
              <p>Authentic single-play audio streams with UK, Australian, and North American accents.</p>
              <p className="text-slate-500 text-xs">
                Supports all 7 CD-IELTS item formats: form completion, map labelling, matching, and MCQ.
              </p>
            </CardContent>
          </Card>

          {/* Reading */}
          <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-teal-400">
            <CardHeader>
              <div className="bg-teal-600 text-white mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-slate-950">Reading Split-Pane</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm space-y-2">
              <p>Independent scrolling passage and questions pane with interactive text highlighter.</p>
              <p className="text-slate-500 text-xs">
                True/False/Not Given and Yes/No/Not Given cognitive distinction training.
              </p>
            </CardContent>
          </Card>

          {/* Writing */}
          <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-teal-400">
            <CardHeader>
              <div className="bg-emerald-950 text-teal-300 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <PenTool className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-slate-950">Writing Evaluator</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm space-y-2">
              <p>Real-time word counts with 10-second autosave preventing accidental loss.</p>
              <p className="text-slate-500 text-xs">
                Rubric breakdown across Task Achievement, Cohesion, Lexical Resource, and Grammar.
              </p>
            </CardContent>
          </Card>

          {/* Speaking */}
          <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-teal-400">
            <CardHeader>
              <div className="bg-teal-600 text-white mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <Mic className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-slate-950">Speaking Simulator</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm space-y-2">
              <p>Timed Parts 1, 2 (cue card 1-min prep), and Part 3 discussion with STT word-level evaluation.</p>
              <p className="text-slate-500 text-xs">
                Measures speech rate (wpm), pauses, filler frequency, and pronunciation clarity.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tools Banner */}
      <section className="w-full border-t border-emerald-900 bg-emerald-950 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl space-y-4">
          <span className="inline-block rounded-full border border-teal-400/30 bg-emerald-900 px-3 py-1 text-xs font-semibold text-teal-300">
            Free Band Utility
          </span>
          <h3 className="text-2xl font-bold text-white sm:text-3xl">Calculate Your IELTS Band Score</h3>
          <p className="text-emerald-100/90 text-sm">
            Check how individual skill bands aggregate under the official 0.25/0.75 rounding rule.
          </p>
          <div className="pt-2">
            <Link href="/tools/ielts-band-calculator">
              <Button className="gap-2 bg-teal-600 text-white hover:bg-teal-500">
                <BarChart3 className="h-4 w-4" /> Open IELTS Band Calculator
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
