/** @purpose Flagship GRE marketing page with ETS Prussian Navy & Cyan/Teal editorial design, asymmetric 12-column split hero, student poster, and section-adaptive routing diagram card (M2.7-B) */
import { Button, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  Brain,
  ShieldAlert,
  HelpCircle,
  Clock,
  Layers,
  ArrowRight,
  CheckCircle,
  BarChart3,
  BookOpen,
  Compass,
  GitBranch,
} from 'lucide-react';
import { brand } from '@lumen/config';
import { LocaleLink as Link } from '../../_components/LocaleLink';
import { LiveGreWidget } from './live-gre-widget';
import { GreExamGuide } from '../_components/GreExamGuide';

export const metadata = {
  title: `GRE Prep Re-Engineered | জিআরই প্রস্তুতি | ${brand.name}`,
  description:
    'Prepare for the GRE with the only platform offering authentic Section-Adaptive CBT Mocks, 3-Tier Hint Ladders, Distractor Trap Diagnostics, and 4-Mode FSRS Spaced Repetition.',
};

export default async function GreMarketingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';
  const brandDisplayName = isBn ? 'লুমেন একাডেমি' : brand.name;

  return (
    <div className="flex flex-col items-center bg-[#F7F5F0]" data-locale={locale}>
      {/* ETS Prussian Navy (#003057) Asymmetric 12-Column Split Hero */}
      <section className="relative w-full overflow-hidden border-b border-slate-800 bg-[#003057] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left 7 Columns: Left-Aligned ETS Hero + Quick-Jump Anchor Links */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-cyan-200">
              {isBn
                ? 'অফিশিয়াল কম্পিউটার-ডেলিভার্ড ফরম্যাট • ETS মানদণ্ড'
                : 'Official Computer-Delivered Format • ETS Standards'}
            </div>

            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {isBn ? (
                <>
                  <span className="text-cyan-300">৩৩০+ লক্ষ্য</span> অর্জনের জন্য নির্মিত বিশেষায়িত
                  জিআরই প্ল্যাটফর্ম
                </>
              ) : (
                <>
                  The GRE® Prep Platform Built for{' '}
                  <span className="text-cyan-300">330+ Ambitions</span>
                </>
              )}
            </h1>

            <p className="max-w-2xl text-base text-slate-200 sm:text-lg leading-relaxed">
              {isBn
                ? 'শুধু ভিডিও লেকচার দেখা বন্ধ করুন। প্রামাণিক সেকশন-অ্যাডাপটিভ মক টেস্ট, আপনার শেখার দক্ষতা অক্ষুণ্ণ রাখা প্রগ্রেসিভ হিন্ট ল্যাডার, ডিস্ট্রাক্টর ট্র্যাপ বিশ্লেষণ এবং প্রেডিক্ট-ফার্স্ট ভার্বাল পদ্ধতির অভিজ্ঞতা নিন।'
                : 'Stop passively watching video lectures. Experience real section-adaptive mock tests, progressive hint ladders that preserve your learning, distractor trap forensics, and predict-first verbal mastery.'}
            </p>

            {/* Quick-Jump Anchor Links */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <a
                href="#how-gre-works"
                className="rounded-md border border-cyan-400/40 bg-[#007791]/40 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition-colors hover:bg-[#007791]"
              >
                {isBn ? 'কীভাবে GRE কাজ করে ↓' : '#how-gre-works ↓'}
              </a>
              <a
                href="#live-practice"
                className="rounded-md border border-cyan-400/40 bg-[#007791]/40 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition-colors hover:bg-[#007791]"
              >
                {isBn ? 'লাইভ কোয়ান্ট অনুশীলন ↓' : '#live-practice ↓'}
              </a>
              <a
                href="#study-plan"
                className="rounded-md border border-cyan-400/40 bg-[#007791]/40 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition-colors hover:bg-[#007791]"
              >
                {isBn ? 'পাঠ্যক্রম ও স্টাডি প্ল্যান ↓' : '#study-plan ↓'}
              </a>
            </div>

            {/* Primary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/exam/diagnostic">
                <Button
                  size="lg"
                  className="gap-2 bg-[#007791] text-white hover:bg-[#006075] font-bold shadow-lg px-6 h-12 text-base"
                >
                  {isBn
                    ? 'ফ্রি ১৫-মিনিট এক্সপ্রেস ডায়াগনস্টিক দিন'
                    : 'Take Free 15-Min Express Diagnostic'}{' '}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-500 bg-white/10 text-white hover:bg-white/20 font-semibold px-6 h-12 text-base"
                >
                  {isBn ? 'জিআরই প্ল্যান ও পাস দেখুন' : 'View GRE Plans & Passes'}
                </Button>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-700/80 flex flex-wrap items-center gap-6 text-xs text-slate-200">
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle className="h-4 w-4 text-cyan-300" />{' '}
                {isBn ? '১০০% প্রামাণিক সিবিটি এক্সাম শেল' : '100% Authentic CBT Exam Shell'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle className="h-4 w-4 text-cyan-300" />{' '}
                {isBn
                  ? '১,৫০০+ উচ্চ-গুরুত্বপূর্ণ শব্দ (FSRS)'
                  : '1,500+ High-Frequency Words (FSRS)'}
              </span>
              <span className="flex items-center gap-1.5 font-semibold">
                <CheckCircle className="h-4 w-4 text-cyan-300" />{' '}
                {isBn
                  ? 'সেকশন-অ্যাডাপটিভ প্র্যাকটিস টেস্ট'
                  : 'Section-Adaptive Practice Tests'}
              </span>
            </div>
          </div>

          {/* Right 5 Columns: Student Studying Quantitative Reasoning Poster + Floating Section-Adaptive Routing Diagram Card */}
          <div className="lg:col-span-5 relative">
            <div
              className="absolute -top-3 -right-3 h-full w-full rounded-2xl bg-[#007791] opacity-90"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-3 -left-3 h-full w-full rounded-2xl bg-[#E4002B] opacity-80"
              aria-hidden="true"
            />

            <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85"
                alt={
                  isBn
                    ? 'জিআরই কোয়ান্টিটেটিভ রিজনিং অনুশীলনরত শিক্ষার্থী'
                    : 'Student studying GRE quantitative reasoning'
                }
                className="h-[380px] sm:h-[420px] w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#003057]/95 via-[#003057]/30 to-transparent" />

              {/* Floating Section-Adaptive Routing Diagram Card */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-slate-200 bg-white/95 p-4 text-slate-900 shadow-xl backdrop-blur-xs space-y-2">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-[#003057]">
                    <GitBranch className="h-3.5 w-3.5 text-[#007791]" />
                    {isBn
                      ? 'সেকশন-অ্যাডাপটিভ রাউটিং ডায়াগ্রাম'
                      : 'Section-Adaptive Routing Diagram'}
                  </span>
                  <span className="rounded bg-[#003057] px-2 py-0.5 font-mono text-[10px] font-bold text-white">
                    130–170 Scale
                  </span>
                </div>
                <div className="rounded-lg bg-[#F7F5F0] border border-slate-200 px-3 py-2 font-mono text-xs font-extrabold text-[#003057]">
                  Section 1 [12Q] -&gt; Harder Section 2 [15Q] -&gt; 170 Ceiling
                </div>
                <p className="text-[11px] text-slate-600">
                  {isBn
                    ? 'সেকশন ১-এর উচ্চ নির্ভুলতা আপনাকে কঠিনতর সেকশন ২-এ উন্নীত করে যা ১৬৫–১৭০ স্কোরের দরজা খুলে দেয়।'
                    : 'High accuracy in Section 1 routes you into the Harder Section 2 panel required for 165–170 scores.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <GreExamGuide isBn={isBn} />

      {/* Interactive Live Demo Section */}
      <section
        id="live-practice"
        className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 flex flex-col items-center scroll-mt-16"
      >
        <div id="pedagogy" className="mb-10 grid w-full max-w-5xl gap-6 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8 sm:grid-cols-12 sm:items-center shadow-xs">
          <div className="space-y-3 sm:col-span-8 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#003057] flex items-center gap-1.5">
              <Compass className="h-3.5 w-3.5 text-[#007791]" />
              <span>
                {isBn ? 'ইন্টারেক্টিভ জিআরই পেডাগজি স্যাম্পলার' : 'Interactive GRE Pedagogy Sampler'}
              </span>
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
              {isBn
                ? '১০ সেকেন্ডে আমাদের ইন্টারেক্টিভ শিক্ষণপদ্ধতি যাচাই করুন'
                : 'Test Our Interactive Pedagogy in 10 Seconds'}
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              {isBn
                ? 'নিচের কোয়ান্টিটেটিভ কম্প্যারিজন প্রশ্নটি সমাধান করে দেখুন। আমাদের ডিস্ট্রাক্টর ট্র্যাপ ডায়াগনস্টিক দেখতে ইচ্ছে করেই একটি ভুল অপশন বেছে নিন, অথবা ধারণার জন্য হিন্ট ল্যাডার খুলুন।'
                : 'Try this Quantitative Comparison item below. Deliberately pick an incorrect option to see our Distractor Trap Diagnostic, or open the Hint Ladder if you need a conceptual spark.'}
            </p>
          </div>
          <div className="flex flex-col gap-2.5 rounded-xl border border-slate-200 bg-[#F7F5F0] p-4 text-xs sm:col-span-4">
            <div className="font-bold text-[#003057]">
              {isBn ? 'আপনি যা যাচাই করছেন:' : 'What You Are Testing:'}
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-[#007791] shrink-0" />
              <span>{isBn ? 'KaTeX বীজগাণিতিক টাইপোগ্রাফি' : 'KaTeX Algebraic Typography'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-[#007791] shrink-0" />
              <span>
                {isBn ? '৩-ধাপের প্রগ্রেসিভ হিন্ট ল্যাডার' : '3-Tier Progressive Hint Ladder'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-[#007791] shrink-0" />
              <span>{isBn ? 'ডিস্ট্রাক্টর ট্র্যাপ বিশ্লেষণ' : 'Distractor Trap Forensics'}</span>
            </div>
          </div>
        </div>

        <LiveGreWidget locale={isBn ? 'bn' : 'en'} />
      </section>

      {/* Study Plan & 6-Pillar Architecture Matrix */}
      <section
        id="study-plan"
        className="w-full border-t border-slate-200 bg-[#F7F5F0] px-4 py-16 sm:py-24 scroll-mt-16"
      >
        <div className="mx-auto max-w-7xl">
          <div className="space-y-3 mb-12 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#003057]">
              {isBn ? 'সম্পূর্ণ প্রস্তুতির কাঠামো' : 'Complete GRE Architecture & Study Plan'}
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
              {isBn
                ? `কেন শীর্ষ স্কোরাররা ${brandDisplayName} বেছে নেন`
                : `Why Top Scorers Switch to ${brand.name}`}
            </h2>
            <p className="text-slate-600 text-base max-w-2xl">
              {isBn
                ? 'আমরা প্রামাণিক ফরম্যাট, বিশ্লেষণাত্মক ব্যাখ্যা, কৌশলগত শর্টকাট এবং গাইডেড সমস্যা সমাধান একটি নির্বিঘ্ন প্ল্যাটফর্মে একত্র করেছি।'
                : 'We combined the official exam format, analytical explanations, tactical shortcuts, and guided problem solving into one seamless platform.'}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Pillar 1 */}
            <Card className="border-t-4 border-t-[#003057] border-slate-200/80 bg-white shadow-md transition-all">
              <CardHeader>
                <div className="bg-[#003057] text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Layers className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">
                  {isBn ? 'সেকশন-অ্যাডাপটিভ সিবিটি মক টেস্ট' : 'Section-Adaptive CBT Mocks'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  {isBn
                    ? 'প্রকৃত ETS-মানের মাল্টি-স্টেজ টেস্টিং। সেকশন ১-এ আপনার পারফরম্যান্স অনুযায়ী সেকশন ২ স্বয়ংক্রিয়ভাবে সহজ, মধ্যম বা কঠিন স্তরে রাউট হয়।'
                    : 'True ETS-accurate multi-stage testing. Your performance in Section 1 dynamically routes Section 2 to Easy, Medium, or Hard difficulty.'}
                </p>
                <p className="text-slate-500 text-xs">
                  {isBn
                    ? 'রয়েছে ট্রান্সফার ডিসপ্লেসহ অন-স্ক্রিন ৪-ফাংশন ক্যালকুলেটর এবং প্রতি ১০ সেকেন্ডে সার্ভার-ভিত্তিক অটোসেভ।'
                    : 'Features official on-screen 4-function calculator with Transfer Display and server-authoritative 10-second state synchronization.'}
                </p>
              </CardContent>
            </Card>

            {/* Pillar 2 */}
            <Card className="border-t-4 border-t-[#007791] border-slate-200/80 bg-white shadow-md transition-all">
              <CardHeader>
                <div className="bg-[#007791] text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">
                  {isBn ? '৩-ধাপের প্রগ্রেসিভ হিন্ট ল্যাডার' : '3-Tier Progressive Hint Ladder'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  {isBn
                    ? 'সাময়িক আটকে যাওয়ার কারণে পুরো সমাধান দেখে শেখার সুযোগ নষ্ট করবেন না। ধাপে ধাপে হিন্ট খুলুন: ধাপ ১ (ধারণা), ধাপ ২ (সমীকরণ গঠন), ধাপ ৩ (সমাধানের সূত্র)।'
                    : 'Never spoil a problem just because you hit a momentary block. Reveal hints gradually: Tier 1 (Concept), Tier 2 (Setup), Tier 3 (Bridge to Solution).'}
                </p>
                <p className="text-slate-500 text-xs">
                  {isBn
                    ? 'আপনার আংশিক দক্ষতা আনুপাতিকভাবে সংরক্ষিত থাকে, যা উত্তরপত্রের ওপর নির্ভরতা ছাড়াই স্থায়ী গাণিতিক স্বজ্ঞা গড়ে তোলে।'
                    : 'Your partial mastery is preserved proportionally, helping build durable intuition without dependence on answer keys.'}
                </p>
              </CardContent>
            </Card>

            {/* Pillar 3 */}
            <Card className="border-t-4 border-t-[#E4002B] border-slate-200/80 bg-white shadow-md transition-all">
              <CardHeader>
                <div className="bg-[#E4002B] text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <ShieldAlert className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">
                  {isBn ? 'ডিস্ট্রাক্টর ট্র্যাপ ডায়াগনস্টিকস' : 'Distractor Trap Diagnostics'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  {isBn
                    ? 'ETS প্রশ্ন প্রণেতারা সূক্ষ্ম ডিস্ট্রাক্টর ফাঁদ তৈরিতে সপ্তাহের পর সপ্তাহ ব্যয় করেন। আমাদের ডায়াগনস্টিক ইঞ্জিন নিখুঁতভাবে শনাক্ত করে আপনি কোন ফাঁদে পা দিয়েছেন।'
                    : 'ETS test writers spend weeks engineering subtle distractor traps. Our diagnostic pinpoints exactly which cognitive trap you tripped on.'}
                </p>
                <p className="text-slate-500 text-xs">
                  {isBn
                    ? 'পজিটিভ-রুট বায়াস, চরম ভাষা, আংশিক গণনা এবং স্কোপ শিফট ট্র্যাপগুলো সরাসরি আপনার ব্যক্তিগত মিসটেক নোটবুকে সংরক্ষণ করে।'
                    : 'Catalogs positive-root bias, extreme language, partial calculation, and scope shift traps directly into your personal Mistake Notebook.'}
                </p>
              </CardContent>
            </Card>

            {/* Pillar 4 */}
            <Card className="border-t-4 border-t-[#003057] border-slate-200/80 bg-white shadow-md transition-all">
              <CardHeader>
                <div className="bg-[#003057] text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Brain className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">
                  {isBn ? 'সক্রেটিক ধাপে-ধাপে সমাধানকারী' : 'Socratic Step-by-Step Solver'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  {isBn
                    ? 'কোনো সমস্যা সমাধান করতে না পারলে গাইডেড সক্রেটিক মোডে প্রবেশ করুন। ইঞ্জিনটি পুরো সমস্যাটিকে ছোট ছোট ধাপে ভাগ করে দেয়।'
                    : 'When you cannot solve a problem, enter Guided Socratic Mode. The engine breaks the problem down into micro-decisions.'}
                </p>
                <p className="text-slate-500 text-xs">
                  {isBn
                    ? 'একটি করে মধ্যবর্তী ধাপের উত্তর দিন, যাতে ইন্সট্রাক্টরের সমাধান দেখার বদলে আপনি নিজেই পদ্ধতিটি আয়ত্ত করতে পারেন।'
                    : 'Answer one intermediate step at a time, ensuring you understand the methodology rather than passively watching an instructor solve it.'}
                </p>
              </CardContent>
            </Card>

            {/* Pillar 5 */}
            <Card className="border-t-4 border-t-[#007791] border-slate-200/80 bg-white shadow-md transition-all">
              <CardHeader>
                <div className="bg-[#007791] text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <BookOpen className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">
                  {isBn
                    ? 'প্রেডিক্ট-ফার্স্ট ভার্বাল ডিকনস্ট্রাক্টর'
                    : 'Predict-First Verbal Deconstructor'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  {isBn
                    ? 'অনুমান ছাড়াই টেক্সট কমপ্লিশন ও সেন্টেন্স ইকুইভ্যালেন্স সমাধান করুন। আপনি বাক্যের লজিক ও টোন বিশ্লেষণ করার সময় ইন্টারফেসটি অপশনগুলো ঢেকে রাখে।'
                    : 'Text Completion & Sentence Equivalence without the guesswork. The interface masks the options while you analyze sentence shift keys and tone.'}
                </p>
                <p className="text-slate-500 text-xs">
                  {isBn
                    ? 'প্রথমে আপনার নিজের পূর্বাভাস লিখুন; সাবমিট করার পর অফিসিয়াল ভোকাবুলারি অপশনগুলোর সাথে তা মিলিয়ে নিন।'
                    : 'Type your own prediction first; once submitted, match your prediction against the official vocabulary options.'}
                </p>
              </CardContent>
            </Card>

            {/* Pillar 6 */}
            <Card
              id="vocab"
              className="border-t-4 border-t-[#E4002B] border-slate-200/80 bg-white shadow-md transition-all scroll-mt-20"
            >
              <CardHeader>
                <div className="bg-[#003057] text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
                  <Clock className="h-5 w-5" />
                </div>
                <CardTitle className="text-lg text-slate-950">
                  {isBn ? '৪-মোড FSRS ভোক্যাব ইঞ্জিন' : '4-Mode FSRS Vocab Engine'}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-slate-600 text-sm space-y-2">
                <p>
                  {isBn
                    ? 'Free Spaced Repetition Scheduler (FSRS-4.5)-এর ওপর নির্মিত — যা গাণিতিকভাবে পুরাতন SM-2 পদ্ধতির চেয়ে ৩০% কম রিভিউতে সমান স্মৃতি স্থায়িত্ব নিশ্চিত করে।'
                    : 'Built on a spaced-repetition schedule so you retain vocabulary with fewer reviews.'}
                </p>
                <p className="text-slate-500 text-xs">
                  {isBn
                    ? 'রয়েছে ৪টি ভিন্ন রিভিউ মোড: ফ্ল্যাশকার্ড, ডুয়াল-ডেফিনিশন, শব্দমূল (Etymology) এবং টাইমড কনটেক্সচুয়াল সেন্টেন্স কমপ্লিশন।'
                    : 'Features 4 distinct review modes: Flashcard, Dual-Definition, Etymology / Root, and Timed Contextual Sentence Completion.'}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Score Conversion Tools Section with Editorial Kicker */}
      <section className="w-full border-t border-slate-200 bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-3 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#003057]">
              {isBn ? 'স্কোর রূপান্তর রেফারেন্স' : 'Official Scale Reference Utilities'}
            </div>
            <h3 className="text-3xl lg:text-5xl font-extrabold text-slate-950">
              {isBn
                ? 'ফ্রি ইন্টারেক্টিভ স্কোর কনভার্সন টুলস'
                : 'Free Interactive Score Conversion Tools'}
            </h3>
            <p className="text-slate-600 text-sm max-w-xl">
              {isBn
                ? 'জানতে চান কত র-স্কোরে ১৬৫ কোয়ান্ট হয় অথবা আইইএলটিএস ব্যান্ড ৭.৫ পেতে কী প্রয়োজন? আমাদের ফ্রি ইন্টারেক্টিভ ক্যালকুলেটরগুলো ব্যবহার করুন:'
                : 'Curious what raw score maps to a 165 Quant or what IELTS Band 7.5 requires? Use our free interactive calculators:'}
            </p>
          </div>
          <div className="lg:col-span-5 flex flex-wrap lg:justify-end gap-4">
            <Link href="/tools/gre-score-calculator">
              <Button variant="outline" className="gap-2 border-slate-300 font-semibold">
                <BarChart3 className="h-4 w-4 text-[#003057]" />{' '}
                {isBn
                  ? 'জিআরই স্কোর ও পার্সেন্টাইল ক্যালকুলেটর'
                  : 'GRE Score & Percentile Calculator'}
              </Button>
            </Link>
            <Link href="/tools/ielts-band-calculator">
              <Button variant="outline" className="gap-2 border-slate-300 font-semibold">
                <BarChart3 className="h-4 w-4 text-[#007791]" />{' '}
                {isBn ? 'আইইএলটিএস ৪-স্কিল ব্যান্ড ক্যালকুলেটর' : 'IELTS 4-Skill Band Calculator'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="w-full border-t border-[#003057] bg-[#003057] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-cyan-200">
              {isBn ? '১৫-মিনিট জিআরই মূল্যায়ন' : '15-Minute GRE Baseline Diagnostic'}
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white">
              {isBn ? 'পার্থক্যটি নিজে অনুভব করতে প্রস্তুত?' : 'Ready to Experience the Difference?'}
            </h2>
            <p className="text-slate-200 text-base max-w-2xl">
              {isBn
                ? 'সম্পূর্ণ বিনামূল্যে আমাদের ১৫-মিনিটের ডায়াগনস্টিক টেস্ট দিন। কোনো ক্রেডিট কার্ডের প্রয়োজন নেই। তাৎক্ষণিক আনুমানিক স্কেলড স্কোর রেঞ্জ এবং ব্যক্তিগত স্টাডি সুপারিশ পান।'
                : 'Take our 15-minute diagnostic test for free. No credit card required. Receive an estimated scaled score range and a personalized study recommendation.'}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link href="/exam/diagnostic">
              <Button
                size="lg"
                className="gap-2 bg-[#007791] text-white hover:bg-[#006075] font-bold px-8 h-12 text-base shadow-lg"
              >
                {isBn ? 'এখনই ফ্রি জিআরই ডায়াগনস্টিক শুরু করুন' : 'Start Free GRE Diagnostic Now'}{' '}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
