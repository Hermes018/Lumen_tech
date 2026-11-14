/** @purpose Institutional Swiss Grid homepage with un-obscured student portrait, docked 2-track exam selector fork, 3-step hairline progression, and side-by-side curriculum table (M2.8-B) */
import { getLocale, getTranslations } from 'next-intl/server';
import { LocaleLink as Link } from '../_components/LocaleLink';
import { Button } from '@lumen/ui';
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  FileCheck2,
  Compass,
  BookOpen,
  MonitorCheck,
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

  const flagshipRows = [
    {
      program: isBn ? 'GRE® কোর সেলফ-পেসড' : 'GRE® Core Self-Paced',
      audience: isBn ? 'US MS/PhD ও STEM আবেদনকারী' : 'US MS/PhD & STEM Applicants',
      duration: isBn ? '৬ মাস • সেলফ-পেসড' : '6 Months • Self-Paced',
      deliverables: isBn
        ? '৬টি অ্যাডাপটিভ মক • ১,৫০০ FSRS ভোক্যাব • ৩-ধাপের হিন্ট ল্যাডার'
        : '6 Adaptive Mocks • 1,500 FSRS Vocab • 3-Tier Hint Ladders',
      tuition: isBn ? '৳ ৪,৪৯০ (ভ্যাটসহ)' : '৳ 4,490 (incl. VAT)',
      href: '/gre',
    },
    {
      program: isBn ? 'GRE® প্লাস + এআই/হিউম্যান গ্রেডিং' : 'GRE® Plus + AI/Human Grading',
      audience: isBn ? '৩২৫–৩৩৫+ লক্ষ্যমাত্রার স্কলার' : 'Scholars Targeting 325–335+',
      duration: isBn ? '৬ মাস • সেলফ-পেসড + এসে রিভিউ' : '6 Months • Self-Paced + Essay Grading',
      deliverables: isBn
        ? '১০টি পূর্ণাঙ্গ অ্যাডাপটিভ মক • ৬টি AWA এসে রিভিউ • ট্র্যাপ ফরেনসিকস'
        : '10 Full Adaptive Mocks • 6 AWA Essay Reviews • Trap Forensics',
      tuition: isBn ? '৳ ৫,৯৯০ (ভ্যাটসহ)' : '৳ 5,990 (incl. VAT)',
      href: '/gre',
    },
    {
      program: isBn ? 'IELTS™ একাডেমিক কমপ্লিট' : 'IELTS™ Academic Complete',
      audience: isBn ? 'UK/Canada/Australia উচ্চশিক্ষা' : 'UK, Canada & Australia Higher Study',
      duration: isBn ? '৪ মাস • ৪-স্কিল সিবিটি ওয়ার্কবেঞ্চ' : '4 Months • 4-Skill CBT Workbench',
      deliverables: isBn
        ? '১০টি CD-IELTS মক • স্প্লিট-পেইন রিডিং • ৮টি রাইটিং ও স্পিকিং মূল্যায়ন'
        : '10 CD-IELTS Mocks • Split-Pane Reading • 8 Writing & Speaking Reviews',
      tuition: isBn ? '৳ ৪,৯৯০ (ভ্যাটসহ)' : '৳ 4,990 (incl. VAT)',
      href: '/ielts',
    },
    {
      program: isBn ? 'IELTS™ জেনারেল ট্রেনিং এক্সপ্রেস' : 'IELTS™ General Training Express',
      audience: isBn ? 'কানাডা Express Entry (CLB 9+) ও PR' : 'Canada Express Entry (CLB 9+) & PR',
      duration: isBn ? '৩ মাস • ফাস্ট-ট্র্যাক মডিউল' : '3 Months • Fast-Track Module',
      deliverables: isBn
        ? '৮টি GT পূর্ণাঙ্গ মক • টাস্ক ১ লেটার ও টাস্ক ২ এসে রুব্রিক গ্রেডিং'
        : '8 Full GT Mocks • Task 1 Letter & Task 2 Essay Rubric Grading',
      tuition: isBn ? '৳ ৪,২৯০ (ভ্যাটসহ)' : '৳ 4,290 (incl. VAT)',
      href: '/ielts',
    },
    {
      program: isBn ? 'অল-অ্যাক্সেস ডুয়াল এক্সাম পাস' : 'All-Access Dual Exam Pass',
      audience: isBn ? 'GRE + IELTS উভয় পরীক্ষার্থী' : 'Combined GRE® + IELTS™ Candidates',
      duration: isBn ? '১২ মাস • সম্পূর্ণ প্ল্যাটফর্ম অ্যাক্সেস' : '12 Months • Full Platform Access',
      deliverables: isBn
        ? '২০টি পূর্ণাঙ্গ মক (GRE + IELTS) • সকল প্রশ্ন ব্যাংক ও এআই মূল্যায়ন ক্রেডিট'
        : '20 Full Mocks (GRE + IELTS) • Complete Item Banks & AI Evaluation Credits',
      tuition: isBn ? '৳ ৮,৪৯০ (ভ্যাটসহ)' : '৳ 8,490 (incl. VAT)',
      href: '/courses',
    },
  ];

  return (
    <div className="flex flex-col items-center bg-[#F8F7F4]" data-locale={locale}>
      {/* 1. Above the Fold — Clean Split Hero (Deep Institutional Navy #001E42) */}
      <section className="relative w-full border-b border-slate-800 bg-[#001E42] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-16 lg:pt-16 lg:pb-24 grid lg:grid-cols-12 gap-10 items-start">
          {/* Left 7 Columns: Editorial Kicker, Headline, Subcopy, Rectangular CTAs */}
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

            {/* Primary & Secondary Rectangular CTAs */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <Link href="/exam/diagnostic">
                <Button
                  size="lg"
                  className="rounded-md gap-2 bg-[#E4002B] text-white hover:bg-[#c80025] font-bold shadow-sm px-6 h-12 text-base"
                >
                  {isBn
                    ? '১৫-মিনিট ফ্রি ডায়াগনস্টিক শুরু করুন'
                    : 'Start 15-Min Free Diagnostic'}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/courses">
                <Button
                  variant="outline"
                  size="lg"
                  className="rounded-md border-slate-400 bg-white/10 text-white hover:bg-white/20 font-semibold px-6 h-12 text-base"
                >
                  {isBn ? 'সম্পূর্ণ কোর্স ক্যাটালগ দেখুন' : 'Browse Full Course Catalog'}
                </Button>
              </Link>
            </div>

            {/* 3-Cell Institutional Specification Strip */}
            <div className="pt-6 border-t border-slate-700/80 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-200">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#00A896] shrink-0" />
                <span>
                  {isBn
                    ? '১ ঘণ্টা ৫৮ মিনিট অফিশিয়াল GRE ফরম্যাট'
                    : '1 Hr 58 Min Official GRE Format'}
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

          {/* Right 5 Columns: Un-tilted, Un-obscured Student Photograph + Docked Structural Score Bar Underneath */}
          <div className="lg:col-span-5">
            <div className="rounded-md overflow-hidden border border-slate-700/60 bg-slate-950 shadow-lg">
              <img
                src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=85"
                alt={
                  isBn
                    ? 'বিশ্ববিদ্যালয়ের শিক্ষার্থীরা জিআরই এবং আইইএলটিএস পরীক্ষার প্রস্তুতি নিচ্ছেন'
                    : 'University scholars collaborating on GRE and IELTS preparation'
                }
                className="h-[300px] sm:h-[330px] w-full object-cover object-center block"
              />
              {/* Solid Structural Caption Bar Docked Directly Underneath the Photo */}
              <div className="border-t border-slate-700/80 bg-[#00142E] divide-y sm:divide-y-0 sm:divide-x divide-slate-700/80 grid grid-cols-1 sm:grid-cols-2 text-left">
                <div className="p-3.5 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-cyan-300">
                    {isBn ? 'অফিশিয়াল GRE® স্কেল বেঞ্চমার্ক' : 'Official GRE® Scale Benchmark'}
                  </div>
                  <div className="font-mono text-xs font-extrabold text-white">
                    GRE® 332 (Q 169 • V 163)
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {isBn ? 'সেকশন-অ্যাডাপটিভ সিবিটি ইঞ্জিন' : 'Section-Adaptive CBT Engine'}
                  </div>
                </div>
                <div className="p-3.5 space-y-1">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-[#00A896]">
                    {isBn ? 'কম্পিউটার-ডেলিভার্ড IELTS™' : 'Computer-Delivered IELTS™'}
                  </div>
                  <div className="font-mono text-xs font-extrabold text-white">
                    Band 8.0 (CEFR C1 Verified)
                  </div>
                  <div className="text-[11px] text-slate-300">
                    {isBn ? 'L 8.5 • R 8.5 • W 7.5 • S 7.5' : 'L 8.5 • R 8.5 • W 7.5 • S 7.5'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Docked 2-Track Selector Fork Bar ("Choose Your Exam") */}
      <section
        aria-label={isBn ? 'আপনার পরীক্ষার ট্র্যাক বেছে নিন' : 'Choose Your Examination Track'}
        className="w-full px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-7xl mx-auto -mt-8 relative z-10 grid grid-cols-1 md:grid-cols-2 border border-slate-300 bg-white shadow-md rounded-md divide-y md:divide-y-0 md:divide-x divide-slate-200">
          {/* Left Box — Path 01: GRE General Test */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 text-left">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-block rounded-md bg-[#003057] px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white">
                  {isBn ? 'পাথ ০১ • GRE® জেনারেল টেস্ট' : 'Path 01 • GRE® General Test'}
                </span>
                <span className="font-mono text-xs font-bold text-[#003057]">
                  {isBn ? 'যুক্তরাষ্ট্র ও বৈশ্বিক গ্র্যাড স্কুল / MBA' : 'For US/Global Grad School & STEM/MBA'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                {isBn
                  ? 'GRE® General Test (কোয়ান্ট, ভার্বাল ও AWA)'
                  : 'GRE® General Test (For US/Global Grad School & STEM/MBA)'}
              </h2>

              <div className="rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 font-mono text-xs font-bold text-[#003057]">
                Quant (130–170) • Verbal (130–170) • AWA (0–6)
              </div>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#007791] shrink-0" />
                  <span>
                    {isBn
                      ? 'প্রামাণিক ২-স্টেজ সেকশন-অ্যাডাপটিভ সিবিটি মক টেস্ট (১ ঘণ্টা ৫৮ মিনিট)'
                      : 'Authentic 2-Stage Section-Adaptive CBT Mocks (1 Hr 58 Min)'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#007791] shrink-0" />
                  <span>
                    {isBn
                      ? '৩-ধাপের প্রগ্রেসিভ হিন্ট ল্যাডার ও ডিস্ট্রাক্টর ট্র্যাপ ফরেনসিকস'
                      : '3-Tier Progressive Hint Ladders & Distractor Trap Forensics'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#007791] shrink-0" />
                  <span>
                    {isBn
                      ? '১,৫০০+ উচ্চ-গুরুত্বপূর্ণ জিআরই শব্দ (FSRS-4.5 অ্যাক্টিভ রিকল)'
                      : '1,500+ High-Frequency GRE Vocabulary Deck (FSRS-4.5)'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
              <Link href="/gre">
                <Button className="rounded-md bg-[#003057] text-white hover:bg-[#001E42] font-bold text-xs sm:text-sm h-10 px-4">
                  {isBn ? 'GRE® ট্র্যাক বিস্তারিত দেখুন ->' : 'Explore GRE® Track ->'}
                </Button>
              </Link>
              <Link href="/exam/diagnostic">
                <Button
                  variant="outline"
                  className="rounded-md border-slate-300 text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm h-10 px-4"
                >
                  {isBn ? 'ফ্রি GRE ডায়াগনস্টিক দিন' : 'Take Free GRE Diagnostic'}
                </Button>
              </Link>
            </div>
          </div>

          {/* Right Box — Path 02: IELTS Academic & General */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 text-left">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="inline-block rounded-md bg-[#E4002B] px-2.5 py-1 font-mono text-xs font-bold uppercase tracking-wider text-white">
                  {isBn ? 'পাথ ০২ • IELTS™ একাডেমিক ও জিটি' : 'Path 02 • IELTS™ Academic & General'}
                </span>
                <span className="font-mono text-xs font-bold text-[#006677]">
                  {isBn ? 'যুক্তরাজ্য/কানাডা/অস্ট্রেলিয়া উচ্চশিক্ষা ও PR' : 'For UK/Canada/Australia Study & PR'}
                </span>
              </div>

              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-950">
                {isBn
                  ? 'IELTS™ Academic & General (ব্যান্ড ৭.৫–৮.৫ প্রস্তুতি)'
                  : 'IELTS™ Academic & General (For UK/Canada/Australia Study & PR)'}
              </h2>

              <div className="rounded-md border border-slate-200 bg-slate-50 px-3.5 py-2 font-mono text-xs font-bold text-[#001E42]">
                Listening • Reading • Writing • Speaking (Band 0–9)
              </div>

              <ul className="space-y-1.5 text-xs sm:text-sm text-slate-700 pt-1">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#006677] shrink-0" />
                  <span>
                    {isBn
                      ? 'হাইলাইটার ও নোটপ্যাডসহ স্প্লিট-স্ক্রিন সিডি-আইইএলটিএস রিডিং ওয়ার্কবেঞ্চ'
                      : 'Split-Screen CD-IELTS Reading Workbench with Highlighter & Notes'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#006677] shrink-0" />
                  <span>
                    {isBn
                      ? 'সিঙ্গেল-প্লে অডিও লিসেনিং রানার ও ৪-ক্রাইটেরিয়া রাইটিং রুব্রিক'
                      : 'Single-Play Audio Listening Runner & 4-Criterion Writing Rubric'}
                  </span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#006677] shrink-0" />
                  <span>
                    {isBn
                      ? 'পার্ট ১–৩ কিউ-কার্ড টাইমারসহ স্পিকিং ফ্লুয়েন্সি ও লেক্সিক্যাল মূল্যায়ন'
                      : 'Parts 1–3 Cue-Card Speaking Simulator with Fluency & Lexical Scoring'}
                  </span>
                </li>
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center gap-3">
              <Link href="/ielts">
                <Button className="rounded-md bg-[#001E42] text-white hover:bg-slate-900 font-bold text-xs sm:text-sm h-10 px-4">
                  {isBn ? 'IELTS™ ট্র্যাক বিস্তারিত দেখুন ->' : 'Explore IELTS™ Track ->'}
                </Button>
              </Link>
              <Link href="/exam/ielts-preview">
                <Button
                  variant="outline"
                  className="rounded-md border-slate-300 text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm h-10 px-4"
                >
                  {isBn ? 'CD-IELTS সিমুলেটর চালু করুন' : 'Launch CD-IELTS Simulator'}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Section 2 — "How Lumen Works: Your 3-Step Path to Target Score" (Exposed 3-Column Hairline Grid) */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 space-y-2.5 text-left">
          <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
            {isBn ? 'সুশৃঙ্খল ৩-ধাপের প্রস্তুতি প্রোটোকল' : 'Structured 3-Stage Preparation Protocol'}
          </div>
          <h2 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-950">
            {isBn
              ? 'কীভাবে লুমেন কাজ করে: আপনার কাঙ্ক্ষিত স্কোরের ৩-ধাপের পথ'
              : 'How Lumen Works: Your 3-Step Path to Target Score'}
          </h2>
          <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
            {isBn
              ? 'এলোমেলো অনুশীলনের পরিবর্তে একটি পরিমাপযোগ্য, ডেটা-চালিত অধ্যয়ন কাঠামো অনুসরণ করুন।'
              : 'Replace guesswork and passive video watching with a measurable, diagnostic-driven study progression.'}
          </p>
        </div>

        <div className="rounded-md border border-slate-200 bg-white divide-y md:divide-y-0 md:divide-x divide-slate-200 grid grid-cols-1 md:grid-cols-3 shadow-2xs">
          {/* Step 01 */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#E4002B]">
                  {isBn ? 'ধাপ ০১ • ১৫ মিনিট' : 'Step 01 • 15 Minutes'}
                </span>
                <Compass className="h-4 w-4 text-[#001E42]" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-950">
                {isBn
                  ? 'Step 01: বেসলাইন ডায়াগনস্টিক (১৫ মিনিট)'
                  : 'Step 01: Baseline Diagnostic (15 Min)'}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isBn
                  ? 'অ্যাকাউন্ট ছাড়াই ৮-প্রশ্নের ক্যালিব্রেটেড এক্সপ্রেস ডায়াগনস্টিক দিন। আপনার বর্তমান স্কেলড স্কোর রেঞ্জ এবং কোন ধরনের ডিস্ট্রাক্টর ফাঁদে আপনার ভুল হচ্ছে তা শনাক্ত করুন।'
                  : 'Complete a calibrated 8-item Express Assessment with zero sign-up friction to benchmark your current Quant/Verbal percentile and cognitive trap profile.'}
              </p>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 space-y-1">
                <div className="font-bold text-[#001E42]">
                  {isBn ? 'মেট্রিক্স:' : 'Concrete Output:'}
                </div>
                <div>
                  {isBn
                    ? '• ১৩০–১৭০ / ব্যান্ড ০–৯ প্রাক্কলন • ট্র্যাপ ট্যাক্সোনমি ম্যাপ'
                    : '• 130–170 / Band 0–9 Estimate • Trap Taxonomy Map'}
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/exam/diagnostic"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#003057] hover:underline"
              >
                {isBn ? 'ফ্রি ডায়াগনস্টিক শুরু করুন ->' : 'Start Baseline Diagnostic ->'}
              </Link>
            </div>
          </div>

          {/* Step 02 */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#007791]">
                  {isBn ? 'ধাপ ০২ • গাইডেড অনুশীলন' : 'Step 02 • Guided Mastery'}
                </span>
                <BookOpen className="h-4 w-4 text-[#007791]" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-950">
                {isBn
                  ? 'Step 02: টার্গেটেড সিলেবাস ও হিন্ট-গাইডেড অনুশীলন'
                  : 'Step 02: Targeted Syllabus & Hint-Guided Practice'}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isBn
                  ? 'সরাসরি উত্তরপত্র দেখে শেখার সুযোগ নষ্ট না করে ৩-ধাপের সক্রেটিক হিন্ট ল্যাডার ব্যবহার করুন এবং FSRS-4.5 অ্যালগরিদমে ১,৫০০+ ভোকাবুলারি দীর্ঘস্থায়ীভাবে আয়ত্ত করুন।'
                  : 'Train weak topics using 3-Tier Progressive Hint Ladders that preserve active problem solving, paired with 4-mode FSRS-4.5 vocabulary retention.'}
              </p>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 space-y-1">
                <div className="font-bold text-[#001E42]">
                  {isBn ? 'মেট্রিক্স:' : 'Concrete Output:'}
                </div>
                <div>
                  {isBn
                    ? '• ৩-টিয়ার হিন্ট বাজেট • ১,৫০০+ FSRS কার্ড • মিসটেক লগ'
                    : '• 3-Tier Hint Budget • 1,500+ FSRS Cards • Error Log'}
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/courses"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#003057] hover:underline"
              >
                {isBn ? 'সিলেবাস ও মডিউল দেখুন ->' : 'Explore Syllabus Modules ->'}
              </Link>
            </div>
          </div>

          {/* Step 03 */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-5 text-left">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <span className="font-mono text-xs font-extrabold uppercase tracking-widest text-[#001E42]">
                  {isBn ? 'ধাপ ০৩ • পরীক্ষার সিমুলেশন' : 'Step 03 • Exam Simulation'}
                </span>
                <MonitorCheck className="h-4 w-4 text-[#E4002B]" />
              </div>
              <h3 className="text-lg font-extrabold text-slate-950">
                {isBn
                  ? 'Step 03: পূর্ণাঙ্গ সিবিটি মক ও এআই রুব্রিক গ্রেডিং'
                  : 'Step 03: Full-Length Computer-Delivered Mocks & AI Rubric Grading'}
              </h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                {isBn
                  ? 'আসল পরীক্ষার টাইমার, অন-স্ক্রিন ক্যালকুলেটর এবং ১০-সেকেন্ড সার্ভার অটোসেভসহ পূর্ণাঙ্গ মক টেস্ট দিন এবং রাইটিং ও স্পিকিংয়ের তাৎক্ষণিক রুব্রিক গ্রেডিং পান।'
                  : 'Sit full-length adaptive GRE and split-screen CD-IELTS mock exams with 10s server autosave, pacing telemetry, and rubric-calibrated Writing & Speaking grading.'}
              </p>
              <div className="rounded-md border border-slate-200 bg-slate-50 p-3 font-mono text-xs text-slate-800 space-y-1">
                <div className="font-bold text-[#001E42]">
                  {isBn ? 'মেট্রিক্স:' : 'Concrete Output:'}
                </div>
                <div>
                  {isBn
                    ? '• ২০টি পূর্ণাঙ্গ সিবিটি মক • ৪-ক্রাইটেরিয়া রাইটিং ও স্পিকিং স্কোর'
                    : '• Up to 20 Full CBT Mocks • 4-Criterion Rubric Reports'}
                </div>
              </div>
            </div>
            <div className="pt-2">
              <Link
                href="/pricing"
                className="inline-flex items-center gap-1.5 text-xs font-extrabold uppercase tracking-wider text-[#003057] hover:underline"
              >
                {isBn ? 'মক প্যাক ও টিউশন প্ল্যান দেখুন ->' : 'Compare Mock & Tuition Plans ->'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Section 3 — Side-by-Side Curriculum & Syllabus Summary Table */}
      <section className="w-full border-t border-slate-200 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-8">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-left">
            <div className="space-y-2.5">
              <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
                {isBn
                  ? 'পাঠ্যক্রম ও টিউশন তুলনা • ১৫% মূসক ৬.৩ অন্তর্ভুক্ত'
                  : 'Curriculum & Tuition Matrix • 15% Mushak 6.3 VAT Included'}
              </div>
              <h2 className="text-3xl lg:text-4xl font-extrabold text-slate-950">
                {isBn
                  ? 'ফ্ল্যাগশিপ প্রোগ্রাম ও সিলেবাস তুলনা'
                  : 'Flagship Programs & Syllabus Summary'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base max-w-2xl">
                {isBn
                  ? 'প্রতিটি প্রোগ্রামে অন্তর্ভুক্ত মডিউল, পূর্ণাঙ্গ মক টেস্ট সংখ্যা এবং স্বচ্ছ ভ্যাট-অন্তর্ভুক্ত টিউশন ফি নিচে তুলনা করুন।'
                  : 'Compare duration, included computer-based mock exams, syllabus deliverables, and transparent VAT-inclusive tuition across our flagship tracks.'}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <Link href="/courses">
                <Button className="rounded-md bg-[#001E42] text-white hover:bg-slate-900 font-bold text-xs sm:text-sm h-10 px-4">
                  {isBn ? 'সম্পূর্ণ প্রোগ্রাম ডিরেক্টরি (৬টি কোর্স) ->' : 'Full Program Directory (6 Courses) ->'}
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="rounded-md border-slate-300 text-slate-900 hover:bg-slate-100 font-semibold text-xs sm:text-sm h-10 px-4"
                >
                  {isBn ? 'বিস্তারিত মূল্যতালিকা দেখুন' : 'View Full Pricing Table'}
                </Button>
              </Link>
            </div>
          </div>

          <div className="overflow-x-auto rounded-md border border-slate-200 bg-white shadow-2xs">
            <table className="w-full min-w-[48rem] text-left text-sm">
              <caption className="sr-only">
                {isBn ? 'ফ্ল্যাগশিপ কোর্স এবং টিউশন তুলনা' : 'Flagship courses and tuition comparison'}
              </caption>
              <thead className="bg-[#001E42] text-white text-xs uppercase tracking-wider">
                <tr>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    {isBn ? 'প্রোগ্রাম ট্র্যাক' : 'Program Track'}
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    {isBn ? 'যাদের জন্য প্রযোজ্য' : 'Target Candidate'}
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    {isBn ? 'মেয়াদ ও ফরম্যাট' : 'Duration & Format'}
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    {isBn ? 'অন্তর্ভুক্ত মক ও সিলেবাস' : 'Included Mocks & Syllabus'}
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold">
                    {isBn ? 'টিউশন ফি' : 'Tuition'}
                  </th>
                  <th scope="col" className="px-5 py-3.5 font-bold text-right">
                    {isBn ? 'পদক্ষেপ' : 'Action'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white">
                {flagshipRows.map((row) => (
                  <tr key={row.program} className="hover:bg-slate-50/80 transition-colors">
                    <th scope="row" className="px-5 py-4 font-bold text-slate-950 whitespace-nowrap">
                      {row.program}
                    </th>
                    <td className="px-5 py-4 text-slate-600 text-xs sm:text-sm">{row.audience}</td>
                    <td className="px-5 py-4 font-mono text-xs font-semibold text-[#003057] whitespace-nowrap">
                      {row.duration}
                    </td>
                    <td className="px-5 py-4 text-slate-700 text-xs sm:text-sm">
                      {row.deliverables}
                    </td>
                    <td className="px-5 py-4 font-mono text-xs font-extrabold text-slate-950 whitespace-nowrap">
                      {row.tuition}
                    </td>
                    <td className="px-5 py-4 text-right whitespace-nowrap">
                      <Link
                        href={row.href}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs font-bold text-[#001E42] hover:bg-slate-100"
                      >
                        {isBn ? 'বিস্তারিত ->' : 'Details ->'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Bottom Interactive Diagnostic Banner with Sharp Architectural Geometry */}
      <section className="w-full border-t border-slate-800 bg-[#001E42] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 lg:py-16 grid lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-8 space-y-3 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-slate-200">
              {isBn
                ? 'তাৎক্ষণিক বেঞ্চমার্ক মূল্যায়ন'
                : 'Instant Baseline Assessment • Guest Access Enabled'}
            </div>
            <h2 className="text-2xl lg:text-4xl font-extrabold text-white leading-tight">
              {isBn ? '১৫ মিনিটে আপনার বর্তমান স্কোর যাচাই করুন' : 'Find Your Baseline in 15 Minutes'}
            </h2>
            <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              {isBn
                ? '৮-প্রশ্নের এক্সপ্রেস ডায়াগনস্টিকের মাধ্যমে আমাদের আসল কম্পিউটার-ভিত্তিক টেস্টিং শেলের অভিজ্ঞতা নিন। তাৎক্ষণিক আনুমানিক স্কোর এবং ডিস্ট্রাক্টর ফাঁদের বিশ্লেষণ পান।'
                : 'Experience our real Computer-Based Testing shell with an 8-question Express Diagnostic. Receive an instant estimated score and a breakdown of common errors.'}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link href="/exam/diagnostic">
              <Button
                size="lg"
                className="rounded-md gap-2 bg-[#E4002B] text-white hover:bg-[#c80025] font-bold px-8 h-12 text-base shadow-sm"
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
