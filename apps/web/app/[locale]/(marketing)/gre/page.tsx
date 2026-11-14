/** @purpose Flagship GRE Marketing showcase highlighting Magoosh + GregMat + Brilliant Parity Suite with Royal Indigo identity (BUG-12, P2.6.1 Bilingual) */
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  Sparkles,
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
} from 'lucide-react';
import { brand } from '@lumen/config';
import { Link } from '@/src/i18n/routing';
import { LiveGreWidget } from './live-gre-widget';

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
    <div className="flex flex-col items-center" data-locale={locale}>
      {/* Royal Indigo Hero Section (BUG-12) */}
      <section className="relative w-full overflow-hidden border-b border-indigo-900 bg-indigo-950 px-4 py-16 text-white sm:py-24">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#312e81_1px,transparent_1px),linear-gradient(to_bottom,#312e81_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] opacity-30"
          aria-hidden="true"
        />

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-indigo-400/30 bg-indigo-900/70 px-3.5 py-1 text-xs font-semibold text-indigo-200">
            <Sparkles className="h-3.5 w-3.5 text-blue-400" />
            <span>
              {isBn
                ? 'Magoosh + GregMat + Brilliant মানের সমন্বিত পাঠ্যক্রম'
                : 'Magoosh + GregMat + Brilliant Parity Suite'}
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-tight">
            {isBn ? (
              <>
                <span className="text-blue-400">৩৩০+ লক্ষ্য</span> অর্জনের জন্য নির্মিত বিশেষায়িত
                জিআরই প্ল্যাটফর্ম
              </>
            ) : (
              <>
                The GRE Prep Platform Built for{' '}
                <span className="text-blue-400">330+ Ambitions</span>
              </>
            )}
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-indigo-100/90 sm:text-xl leading-relaxed">
            {isBn
              ? 'শুধু ভিডিও লেকচার দেখা বন্ধ করুন। প্রামাণিক সেকশন-অ্যাডাপটিভ মক টেস্ট, আপনার শেখার দক্ষতা অক্ষুণ্ণ রাখা প্রগ্রেসিভ হিন্ট ল্যাডার, ডিস্ট্রাক্টর ট্র্যাপ বিশ্লেষণ এবং প্রেডিক্ট-ফার্স্ট ভার্বাল পদ্ধতির অভিজ্ঞতা নিন।'
              : 'Stop passively watching video lectures. Experience real section-adaptive mock tests, progressive hint ladders that preserve your learning, distractor trap forensics, and predict-first verbal mastery.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/exam/diagnostic">
              <Button size="lg" className="gap-2 bg-blue-600 text-white hover:bg-blue-500 shadow-lg">
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
                className="border-indigo-700 bg-indigo-900/60 text-white hover:bg-indigo-800"
              >
                {isBn ? 'জিআরই প্ল্যান ও পাস দেখুন' : 'View GRE Plans & Passes'}
              </Button>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-indigo-200">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-blue-400" />{' '}
              {isBn ? '১০০% প্রামাণিক সিবিটি এক্সাম শেল' : '100% Authentic CBT Exam Shell'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-blue-400" />{' '}
              {isBn
                ? '১,৫০০+ উচ্চ-গুরুত্বপূর্ণ শব্দ (FSRS)'
                : '1,500+ High-Frequency Words (FSRS)'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-blue-400" />{' '}
              {isBn
                ? '১৩০–১৭০ Rasch 1PL অ্যাবিলিটি স্কোরিং'
                : '130–170 Rasch 1PL Ability Scoring'}
            </span>
          </div>
        </div>
      </section>

      {/* Interactive Live Demo Section with Well-Spaced 2-Column Header */}
      <section
        id="pedagogy"
        className="w-full max-w-5xl px-4 py-16 sm:py-20 flex flex-col items-center"
      >
        <div className="mb-10 grid w-full max-w-3xl gap-6 rounded-2xl border border-slate-200/80 bg-slate-50 p-6 sm:grid-cols-12 sm:items-center">
          <div className="space-y-2 sm:col-span-8">
            <div className="inline-flex items-center gap-1.5 rounded-md bg-indigo-950 px-2.5 py-1 text-xs font-semibold text-indigo-200">
              <Compass className="h-3.5 w-3.5 text-blue-400" />
              {isBn ? 'ইন্টারেক্টিভ জিআরই পেডাগজি স্যাম্পলার' : 'Interactive GRE Pedagogy Sampler'}
            </div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 sm:text-3xl">
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
          <div className="flex flex-col gap-2 rounded-xl border border-indigo-200 bg-white p-4 text-xs sm:col-span-4">
            <div className="font-bold text-indigo-950">
              {isBn ? 'আপনি যা যাচাই করছেন:' : 'What You Are Testing:'}
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>{isBn ? 'KaTeX বীজগাণিতিক টাইপোগ্রাফি' : 'KaTeX Algebraic Typography'}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>
                {isBn ? '৩-ধাপের প্রগ্রেসিভ হিন্ট ল্যাডার' : '3-Tier Progressive Hint Ladder'}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-700">
              <CheckCircle className="h-3.5 w-3.5 text-blue-600 shrink-0" />
              <span>{isBn ? 'ডিস্ট্রাক্টর ট্র্যাপ বিশ্লেষণ' : 'Distractor Trap Forensics'}</span>
            </div>
          </div>
        </div>

        <LiveGreWidget locale={isBn ? 'bn' : 'en'} />
      </section>

      {/* Parity Suite Pillar Matrix */}
      <section className="w-full border-t border-slate-200 bg-slate-50/70 px-4 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-center space-y-3 mb-12">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
              {isBn
                ? `কেন শীর্ষ স্কোরাররা ${brandDisplayName} বেছে নেন`
                : `Why Top Scorers Switch to ${brand.name}`}
            </h2>
            <p className="text-slate-600 text-base max-w-2xl mx-auto">
              {isBn
                ? 'আমরা Magoosh-এর বিশ্লেষণাত্মক গভীরতা, GregMat-এর কৌশলগত শর্টকাট দক্ষতা এবং Brilliant-এর গাইডেড ইন্টারেক্টিভ সমস্যা সমাধানকে একীভূত করেছি বাংলাদেশের প্রথম সমন্বিত প্ল্যাটফর্মে।'
                : 'We combined the proven analytical depth of Magoosh, the tactical shortcut efficiency of GregMat, and the guided interactive problem solving of Brilliant into one seamless Bangladesh-first platform.'}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Pillar 1 */}
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-indigo-950 text-indigo-200 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
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
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-blue-600 text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
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
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-indigo-950 text-amber-300 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
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
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-blue-600 text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
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
            <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300">
              <CardHeader>
                <div className="bg-indigo-950 text-indigo-200 mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
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
              className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-indigo-300 scroll-mt-20"
            >
              <CardHeader>
                <div className="bg-blue-600 text-white mb-3 flex h-10 w-10 items-center justify-center rounded-lg">
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
                    : 'Built on Free Spaced Repetition Scheduler (FSRS-4.5) — mathematically proven to beat legacy SM-2 with 30% fewer reviews for the same retention.'}
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

      {/* Free Tools Callout */}
      <section className="w-full border-t border-slate-200 bg-white px-4 py-16 sm:py-20">
        <div className="mx-auto max-w-4xl text-center space-y-4">
          <Badge variant="outline" className="border-indigo-300 text-indigo-900 text-xs">
            {isBn ? 'ফ্রি স্কোর ইউটিলিটি' : 'Free SEO Utilities'}
          </Badge>
          <h3 className="text-2xl font-bold text-slate-950 sm:text-3xl">
            {isBn
              ? 'ফ্রি ইন্টারেক্টিভ স্কোর কনভার্সন টুলস'
              : 'Free Interactive Score Conversion Tools'}
          </h3>
          <p className="text-slate-600 text-sm max-w-xl mx-auto">
            {isBn
              ? 'জানতে চান কত র-স্কোরে ১৬৫ কোয়ান্ট হয় অথবা আইইএলটিএস ব্যান্ড ৭.৫ পেতে কী প্রয়োজন? আমাদের ফ্রি ইন্টারেক্টিভ ক্যালকুলেটরগুলো ব্যবহার করুন:'
              : 'Curious what raw score maps to a 165 Quant or what IELTS Band 7.5 requires? Use our free interactive calculators:'}
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link href="/tools/gre-score-calculator">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />{' '}
                {isBn
                  ? 'জিআরই স্কোর ও পার্সেন্টাইল ক্যালকুলেটর'
                  : 'GRE Score & Percentile Calculator'}
              </Button>
            </Link>
            <Link href="/tools/ielts-band-calculator">
              <Button variant="outline" className="gap-2">
                <BarChart3 className="h-4 w-4" />{' '}
                {isBn ? 'আইইএলটিএস ৪-স্কিল ব্যান্ড ক্যালকুলেটর' : 'IELTS 4-Skill Band Calculator'}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer Banner */}
      <section className="w-full border-t border-indigo-900 bg-indigo-950 px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl space-y-6">
          <h2 className="text-3xl font-extrabold text-white">
            {isBn ? 'পার্থক্যটি নিজে অনুভব করতে প্রস্তুত?' : 'Ready to Experience the Difference?'}
          </h2>
          <p className="text-indigo-200 text-base max-w-xl mx-auto">
            {isBn
              ? 'সম্পূর্ণ বিনামূল্যে আমাদের ১৫-মিনিটের ডায়াগনস্টিক টেস্ট দিন। কোনো ক্রেডিট কার্ডের প্রয়োজন নেই। তাৎক্ষণিক আনুমানিক স্কেলড স্কোর রেঞ্জ এবং ব্যক্তিগত স্টাডি সুপারিশ পান।'
              : 'Take our 15-minute diagnostic test for free. No credit card required. Receive an estimated scaled score range and a personalized study recommendation.'}
          </p>
          <div className="pt-2">
            <Link href="/exam/diagnostic">
              <Button size="lg" className="gap-2 bg-blue-600 text-white hover:bg-blue-500">
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
