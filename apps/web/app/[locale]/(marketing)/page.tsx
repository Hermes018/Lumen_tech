/** @purpose Marketing landing page with British Council / ETS asymmetric 12-column split hero, student photography poster collage, floating score cards, and editorial stone track posters (M2.7-B) */
import { getLocale, getTranslations } from 'next-intl/server';
import { LocaleLink as Link } from '../_components/LocaleLink';
import { Button, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
  Brain,
  Zap,
  ArrowRight,
  BarChart3,
  ShieldAlert,
  CheckCircle2,
  Award,
  Clock,
  FileCheck2,
} from 'lucide-react';

export default async function MarketingPage({
  params,
}: {
  params?: Promise<{ locale?: string }>;
} = {}) {
  const resolvedParams = params ? await params : undefined;
  const locale = resolvedParams?.locale ?? (await getLocale());
  const isBn = locale === 'bn';
  const tHero = await getTranslations('hero');

  return (
    <div className="flex flex-col items-center bg-[#F8F7F4]" data-locale={locale}>
      {/* Asymmetric 12-Column Split Hero Section (Deep Institutional Navy #001E42) */}
      <section className="relative w-full overflow-hidden border-b border-slate-800 bg-[#001E42] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          {/* Left 7 Columns: Editorial Kicker, Bold Left-Aligned Headline, Subcopy, Primary & Secondary CTAs, 3-Stat Institutional Bar */}
          <div className="lg:col-span-7 space-y-6 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-slate-200">
              {tHero('badge')}
            </div>

            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {tHero('title')}
            </h1>

            <p className="max-w-2xl text-base text-slate-200 sm:text-lg leading-relaxed">
              {tHero('subtitle')}
            </p>

            {/* Primary & Secondary CTAs */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/exam/diagnostic">
                <Button
                  size="lg"
                  className="gap-2 bg-[#E4002B] text-white hover:bg-[#c80025] font-bold shadow-lg px-6 h-12 text-base"
                >
                  {isBn
                    ? 'ফ্রি ১৫-মিনিট ডায়াগনস্টিক শুরু করুন ->'
                    : 'Launch Free 15-Min Diagnostic ->'}
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  variant="outline"
                  size="lg"
                  className="border-slate-500 bg-white/10 text-white hover:bg-white/20 font-semibold px-6 h-12 text-base"
                >
                  {isBn ? 'কোর্সসমূহ দেখুন' : 'Explore Courses'}
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="ghost"
                  size="lg"
                  className="text-slate-200 hover:bg-white/10 hover:text-white font-semibold h-12"
                >
                  {tHero('viewPricing')}
                </Button>
              </Link>
            </div>

            {/* 3-Stat Institutional Bar */}
            <div className="pt-6 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#00A896] shrink-0" />
                <span>
                  {isBn
                    ? '১ ঘণ্টা ৫৮ মিনিট অফিশিয়াল GRE ফরম্যাট'
                    : '1 Hour 58 Min Official GRE Format'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="h-4 w-4 text-[#E4002B] shrink-0" />
                <span>
                  {isBn ? '৪-স্কিল CD-IELTS সিমুলেটর' : '4-Skill CD-IELTS Simulator'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <FileCheck2 className="h-4 w-4 text-[#00A896] shrink-0" />
                <span>
                  {isBn ? '১৫% মূসক ৬.৩ ভ্যাট অন্তর্ভুক্ত' : '15% Mushak 6.3 VAT Included'}
                </span>
              </div>
            </div>
          </div>

          {/* Right 5 Columns: Visual Student Poster Collage with Offset Crimson & Teal Backdrop + Floating Score Cards */}
          <div className="lg:col-span-5 relative">
            {/* Offset Geometric Backdrops: British Council Crimson (#E4002B) & ETS Teal (#00A896) */}
            <div
              className="absolute -top-3 -right-3 h-full w-full rounded-2xl bg-[#E4002B] opacity-90"
              aria-hidden="true"
            />
            <div
              className="absolute -bottom-3 -left-3 h-full w-full rounded-2xl bg-[#00A896] opacity-85"
              aria-hidden="true"
            />

            {/* Main Student Photograph Frame */}
            <div className="relative overflow-hidden rounded-2xl border-2 border-white/20 bg-slate-900 shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85"
                alt={
                  isBn
                    ? 'বিশ্ববিদ্যালয়ের শিক্ষার্থীরা জিআরই এবং আইইএলটিএস পরীক্ষার প্রস্তুতি নিচ্ছেন'
                    : 'University scholars collaborating on GRE and IELTS preparation'
                }
                className="h-[380px] sm:h-[420px] w-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#001E42]/90 via-[#001E42]/25 to-transparent" />

              {/* Floating Card 1: Official Score Report Preview — GRE 332 */}
              <div className="absolute top-4 left-4 right-4 sm:right-auto sm:max-w-xs rounded-xl border border-slate-200 bg-white/95 p-3.5 text-slate-900 shadow-xl backdrop-blur-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#003057] text-white">
                    <Award className="h-4 w-4" />
                  </span>
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#003057]">
                      {isBn ? 'অফিশিয়াল স্কোর প্রিভিউ' : 'Official Score Report Preview'}
                    </div>
                    <div className="text-xs font-extrabold text-slate-950">
                      GRE® 332 (Quant 169 • Verbal 163)
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating Card 2: IELTS Academic — Overall Band 8.0 */}
              <div className="absolute bottom-4 left-4 right-4 rounded-xl border border-slate-200 bg-white/95 p-3.5 text-slate-900 shadow-xl backdrop-blur-xs">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#E4002B]">
                      {isBn ? 'কম্পিউটার-ডেলিভার্ড ফলাফল' : 'Computer-Delivered Benchmark'}
                    </div>
                    <div className="text-xs font-extrabold text-slate-950">
                      IELTS™ Academic — Overall Band 8.0 (L 8.5 • R 8.5 • W 7.5 • S 7.5)
                    </div>
                  </div>
                  <span className="shrink-0 rounded-md bg-[#00A896]/15 px-2 py-1 font-mono text-xs font-bold text-[#006677]">
                    CEFR C1
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Pillars on Warm Editorial Stone (#F8F7F4) */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 space-y-3 text-left">
          <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
            {isBn ? 'প্রামাণিক পরীক্ষার অবকাঠামো' : 'Authentic Assessment Architecture'}
          </div>
          <h2 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
            {isBn
              ? 'পরীক্ষার হলের নির্ভুলতায় নির্মিত ৩টি মূল স্তম্ভ'
              : 'Built Around Official Test-Day Standards'}
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="border-t-4 border-t-[#003057] border-slate-200/90 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#001E42] text-white">
                <Zap className="h-5 w-5" />
              </div>
              <CardTitle className="text-slate-900">
                {isBn ? 'প্রামাণিক সিবিটি ইঞ্জিন' : 'Authentic CBT Engine'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm leading-relaxed">
              {isBn
                ? 'ETS PowerPrep এবং কম্পিউটার-ডেলিভার্ড IELTS-এর হুবহু ইন্টারফেসে অনুশীলন করুন—সাথে থাকছে অফিশিয়াল ক্যালকুলেটর, কিবোর্ড নেভিগেশন এবং ১০-সেকেন্ড অটোসেভ।'
                : 'Practice in pixel-accurate test interfaces replicating ETS PowerPrep and computer-delivered IELTS, with official calculators, keyboard navigation, and 10s autosave.'}
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#00A896] border-slate-200/90 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#00A896] text-white">
                <Brain className="h-5 w-5" />
              </div>
              <CardTitle className="text-slate-900">
                {isBn ? '৪-মোড অ্যাক্টিভ রিকল (FSRS)' : '4-Mode Active Recall (FSRS)'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm leading-relaxed">
              {isBn
                ? 'ফ্ল্যাশকার্ড, ডুয়াল-ডেফিনিশন, শব্দমূল এবং টাইমড সেন্টেন্স কমপ্লিশনের মাধ্যমে ১,৫০০+ উচ্চ-গুরুত্বপূর্ণ জিআরই শব্দ দীর্ঘস্থায়ীভাবে আয়ত্ত করুন।'
                : 'Master 1,500+ high-frequency GRE words with scientifically calibrated intervals across flashcards, dual-definition matching, roots, and timed sentence completion.'}
            </CardContent>
          </Card>

          <Card className="border-t-4 border-t-[#E4002B] border-slate-200/90 bg-white shadow-sm transition-shadow hover:shadow-md">
            <CardHeader>
              <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-xl bg-[#E4002B] text-white">
                <ShieldAlert className="h-5 w-5" />
              </div>
              <CardTitle className="text-slate-900">
                {isBn ? 'ট্র্যাপ ডায়াগনস্টিকস ও সক্রেটিক হিন্ট' : 'Trap Diagnostics & Socratic Hints'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm leading-relaxed">
              {isBn
                ? 'শুধু সঠিক উত্তর কেন সঠিক তা নয়—প্রতিটি ভুল অপশন কেন একটি পরিকল্পিত ফাঁদ ছিল তা জানুন এবং ৩-ধাপের প্রগ্রেসিভ হিন্টের সাহায্যে নিজে সমাধান করুন।'
                : 'Never just see why the answer is right. Discover why each incorrect distractor was an engineered trap, with progressive 3-tier hints for guided mastery.'}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Flagship 2-Column Visual Track Posters on Warm Editorial Stone */}
      <section className="w-full border-t border-slate-200/80 bg-[#F8F7F4] px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="space-y-3 mb-12 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
              {isBn ? 'বিশেষায়িত প্রস্তুতি ট্র্যাক' : 'Academic & Global Mobility Tracks'}
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-slate-950">
              {isBn
                ? 'বাংলাদেশি স্কলারদের জন্য নির্মিত পাঠ্যক্রম ট্র্যাক'
                : 'Curriculum Tracks Built for Bangladesh Scholars'}
            </h2>
            <p className="text-slate-600 text-base max-w-2xl">
              {isBn
                ? 'বিশেষায়িত টেস্ট স্যুট, ডায়াগনস্টিক টুল এবং পাঠ্যক্রম রোডম্যাপ দেখতে আপনার পরীক্ষাটি বেছে নিন।'
                : 'Select your examination to explore specialized test suites, diagnostic tools, and curriculum roadmaps.'}
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* GRE Visual Track Poster Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-[#003057] bg-white shadow-md flex flex-col justify-between">
              <div className="relative h-52 w-full overflow-hidden bg-[#003057]">
                <img
                  src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=85"
                  alt="GRE Quantitative and Verbal Reasoning Preparation"
                  className="h-full w-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#003057] via-[#003057]/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-cyan-200">
                    {isBn
                      ? 'ফ্ল্যাগশিপ ট্র্যাক • কোয়ান্ট ও ভার্বাল ১৩০–১৭০'
                      : 'Flagship Track • Quant & Verbal 130–170'}
                  </span>
                  <span className="rounded bg-[#007791] px-2.5 py-1 text-xs font-bold text-white">
                    ETS Format
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-950">GRE® Prep Platform</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {isBn
                      ? 'সেকশন-অ্যাডাপটিভ প্র্যাকটিস টেস্ট, ৩-ধাপের হিন্ট ল্যাডার, ডিস্ট্রাক্টর ট্র্যাপ ডায়াগনস্টিকস এবং সক্রেটিক ধাপে-ধাপে সমাধানকারীসহ অফিশিয়াল কম্পিউটার-ডেলিভার্ড ফরম্যাট।'
                      : 'Official computer-delivered format with Section-Adaptive Practice Tests, 3-Tier Hint Ladders, Distractor Trap Diagnostics, and Socratic Step-by-Step Solvers.'}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/tools/gre-score-calculator"
                      className="inline-flex items-center gap-1.5 text-xs text-[#003057] font-bold hover:underline"
                    >
                      <BarChart3 className="h-4 w-4" />{' '}
                      {isBn
                        ? 'ফ্রি জিআরই র-টু-স্কেলড স্কোর ক্যালকুলেটর ব্যবহার করুন →'
                        : 'Try Free GRE Raw-to-Scaled Calculator →'}
                    </Link>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex gap-3">
                  <Link href="/gre" className="flex-1">
                    <Button className="w-full gap-2 bg-[#003057] text-white hover:bg-[#001E42] font-semibold">
                      {isBn ? 'জিআরই প্ল্যাটফর্ম দেখুন' : 'Explore GRE Platform'}{' '}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>

            {/* IELTS Visual Track Poster Card */}
            <div className="overflow-hidden rounded-2xl border border-slate-200 border-t-4 border-t-[#E4002B] bg-white shadow-md flex flex-col justify-between">
              <div className="relative h-52 w-full overflow-hidden bg-[#001E42]">
                <img
                  src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=85"
                  alt="Computer-Delivered IELTS Academic and General Preparation"
                  className="h-full w-full object-cover object-center opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#001E42] via-[#001E42]/40 to-transparent" />
                <div className="absolute bottom-4 left-6 right-6 flex items-center justify-between text-white">
                  <span className="text-xs font-bold uppercase tracking-wider text-teal-200">
                    {isBn
                      ? 'একাডেমিক ও জেনারেল • ব্যান্ড ০–৯.০'
                      : 'Academic & General • Band 0–9.0'}
                  </span>
                  <span className="rounded bg-[#E4002B] px-2.5 py-1 text-xs font-bold text-white">
                    CD-IELTS
                  </span>
                </div>
              </div>
              <div className="p-8 space-y-4 flex-1 flex flex-col justify-between">
                <div className="space-y-3">
                  <h3 className="text-2xl font-bold text-slate-950">IELTS® CD-Prep Platform</h3>
                  <p className="text-slate-600 text-sm leading-relaxed">
                    {isBn
                      ? 'সিঙ্গেল-প্লে অডিও লিসেনিং, হাইলাইটারসহ স্প্লিট-পেইন রিডিং এবং তাৎক্ষণিক এআই রাইটিং/স্পিকিং রুব্রিক ডায়াগনস্টিকসহ প্রামাণিক কম্পিউটার-ডেলিভার্ড IELTS টেস্ট রানার।'
                      : 'Authentic Computer-Delivered IELTS test runners with single-play audio listening, split-pane reading with highlighter, and instant AI Writing/Speaking rubric diagnostics.'}
                  </p>
                  <div className="pt-2">
                    <Link
                      href="/tools/ielts-band-calculator"
                      className="inline-flex items-center gap-1.5 text-xs text-[#006677] font-bold hover:underline"
                    >
                      <BarChart3 className="h-4 w-4" />{' '}
                      {isBn
                        ? 'ফ্রি আইইএলটিএস ৪-স্কিল ব্যান্ড ক্যালকুলেটর ব্যবহার করুন →'
                        : 'Try Free IELTS 4-Skill Band Calculator →'}
                    </Link>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-100 mt-6 flex gap-3">
                  <Link href="/ielts" className="flex-1">
                    <Button className="w-full gap-2 bg-[#001E42] text-white hover:bg-slate-900 font-semibold">
                      {isBn ? 'আইইএলটিএস প্ল্যাটফর্ম দেখুন' : 'Explore IELTS Platform'}{' '}
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom Interactive Diagnostic Banner with Editorial Kicker */}
      <section className="w-full border-t border-slate-800 bg-[#001E42] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-8 space-y-4 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-slate-200">
              {isBn
                ? 'তাৎক্ষণিক বেঞ্চমার্ক মূল্যায়ন'
                : 'Instant Baseline Assessment • Guest Access Enabled'}
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-white leading-tight">
              {isBn ? '১৫ মিনিটে আপনার বর্তমান স্কোর যাচাই করুন' : 'Find Your Baseline in 15 Minutes'}
            </h2>
            <p className="text-slate-300 text-base max-w-2xl leading-relaxed">
              {isBn
                ? '৮-প্রশ্নের এক্সপ্রেস ডায়াগনস্টিকের মাধ্যমে আমাদের আসল কম্পিউটার-ভিত্তিক টেস্টিং শেলের অভিজ্ঞতা নিন। তাৎক্ষণিক আনুমানিক স্কোর এবং ডিস্ট্রাক্টর ফাঁদের বিশ্লেষণ পান।'
                : 'Experience our real Computer-Based Testing shell with an 8-question Express Diagnostic. Receive an instant estimated score and a breakdown of common errors.'}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link href="/exam/diagnostic">
              <Button
                size="lg"
                className="gap-2 bg-[#E4002B] text-white hover:bg-[#c80025] font-bold px-8 h-12 text-base shadow-lg"
              >
                {isBn
                  ? 'এক্সপ্রেস ডায়াগনস্টিক চালু করুন ->'
                  : 'Launch Express Diagnostic ->'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
