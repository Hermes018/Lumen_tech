/** @purpose IELTS Marketing showcase highlighting Computer-Delivered exam engine & 4-skill mastery with British Emerald & Teal identity (BUG-12, P2.6.1 Bilingual) */
import { brand } from '@lumen/config';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import {
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
import { LocaleLink as Link } from '../../_components/LocaleLink';

import { IeltsExamGuide } from '../_components/IeltsExamGuide';
export const metadata = {
  title: `IELTS Academic & General Prep | আইইএলটিএস প্রস্তুতি | ${brand.name}`,
  description:
    'Achieve Band 7.5+ with pixel-perfect Computer-Delivered IELTS test runners, AI writing & speaking band diagnostic, and authentic Cambridge-style item banks.',
};

export default async function IeltsMarketingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return (
    <div className="flex flex-col items-center" data-locale={locale}>
      {/* British Emerald & Teal Hero Section (BUG-12) */}
      <section className="relative w-full overflow-hidden border-b border-[#005A70] bg-[#005A70] px-4 py-16 text-white sm:py-24">

        <div className="relative mx-auto max-w-5xl text-center space-y-6">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-emerald-900/70 px-3.5 py-1 text-xs font-semibold text-emerald-100">
            <span>
              {isBn
                ? 'কম্পিউটার-ডেলিভার্ড আইইএলটিএস প্যারিটি'
                : 'Computer-Delivered IELTS Parity'}
            </span>
          </div>

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-6xl leading-tight">
            {isBn ? (
              <>
                আসল পরীক্ষার নির্ভুলতায় অর্জন করুন{' '}
                <span className="text-teal-400">ব্যান্ড ৭.৫ থেকে ৮.৫</span>
              </>
            ) : (
              <>
                Target Band <span className="text-teal-400">7.5 to 8.5</span> with Exam-Room
                Precision
              </>
            )}
          </h1>

          <p className="mx-auto max-w-2xl text-lg text-emerald-100/90 sm:text-xl leading-relaxed">
            {isBn
              ? 'ব্রিটিশ কাউন্সিল এবং আইডিপি এক্সাম সেন্টারে ব্যবহৃত হুবহু একই ইন্টারফেসে অনুশীলন করুন। বাস্তবসম্মত সিঙ্গেল-প্লে লিসেনিং, টেক্সট হাইলাইটারসহ স্প্লিট-পেইন রিডিং এবং রাইটিং ও স্পিকিংয়ের জন্য তাৎক্ষণিক রুব্রিক মূল্যায়ন।'
              : 'Practice in the exact interface used in British Council & IDP exam centres. Realistic single-play listening, split-pane reading with text highlighter, and instant rubric evaluations for Writing & Speaking.'}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link href="/exam/ielts-preview">
              <Button size="lg" className="gap-2 bg-teal-600 text-white hover:bg-teal-500 shadow-lg">
                {isBn
                  ? 'স্প্লিট-স্ক্রিন সিবিটি সিমুলেটর চালু করুন'
                  : 'Launch Split-Screen CBT Simulator'}{' '}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/exam/diagnostic">
              <Button
                variant="outline"
                size="lg"
                className="border-emerald-700 bg-emerald-900/60 text-white hover:bg-emerald-800"
              >
                {isBn
                  ? 'ফ্রি আইইএলটিএস ব্যান্ড ডায়াগনস্টিক দিন'
                  : 'Take Free IELTS Band Diagnostic'}
              </Button>
            </Link>
          </div>

          <div className="pt-6 flex flex-wrap justify-center items-center gap-6 text-xs text-emerald-200">
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-teal-400" />{' '}
              {isBn ? 'সিডি-আইইএলটিএস প্রামাণিক ইউআই শেল' : 'CD-IELTS Authentic UI Shell'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-teal-400" />{' '}
              {isBn ? '৪-মাত্রিক হিউম্যান + এআই রুব্রিক' : '4-Dimension Human + AI Rubric'}
            </span>
            <span className="flex items-center gap-1.5 font-medium">
              <CheckCircle className="h-4 w-4 text-teal-400" />{' '}
              {isBn ? 'একাডেমিক ও জেনারেল ট্রেনিং' : 'Academic & General Training'}
            </span>
          </div>
        </div>
      </section>
      <IeltsExamGuide isBn={isBn} />

      {/* Direct "Launch Split-Screen CBT Simulator" Preview Card */}
      <section className="w-full max-w-6xl px-4 pt-14 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-emerald-200 bg-white shadow-xl">
          <div className="bg-[#005A70] px-6 py-3 text-white flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Columns2 className="h-4 w-4 text-teal-400" />
              <span className="font-bold uppercase tracking-wider text-emerald-100">
                {isBn
                  ? 'সিডি-আইইএলটিএস স্প্লিট-পেইন রিডিং ও লিসেনিং রানার'
                  : 'CD-IELTS Split-Pane Reading & Listening Runner'}
              </span>
            </div>
            <span className="rounded-full bg-teal-600 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              {isBn ? 'লাইভ ইন্টারেক্টিভ স্যান্ডবক্স' : 'Live Interactive Sandbox'}
            </span>
          </div>

          <div className="grid gap-8 p-6 sm:p-10 lg:grid-cols-12 lg:items-center">
            <div className="space-y-4 lg:col-span-7">
              <h2 className="text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl">
                {isBn
                  ? 'স্প্লিট-স্ক্রিন সিবিটি সিমুলেটর চালু করুন'
                  : 'Launch Split-Screen CBT Simulator'}
              </h2>
              <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
                {isBn
                  ? 'অ্যাকাউন্ট খোলা ছাড়াই অভিজ্ঞতা নিন প্রামাণিক ২-কলাম রিডিং প্যাসেজ ও প্রশ্ন ওয়ার্কবেঞ্চের—যেখানে রয়েছে বিল্ট-ইন টেক্সট হাইলাইটিং, নিচের প্রশ্ন প্যালেট নেভিগেশন এবং রিয়েল-টাইম ওয়ার্ড কাউন্ট ট্র্যাকিং।'
                  : 'Experience the authentic 2-column reading passage & question workbench with built-in text highlighting, bottom question palette navigation, and real-time word count tracking—without creating an account.'}
              </p>
              <div className="grid grid-cols-1 gap-2.5 text-xs text-slate-700 sm:grid-cols-2 pt-1">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>
                    {isBn ? 'স্বতন্ত্র ডুয়াল-পেইন স্ক্রলিং' : 'Independent Dual-Pane Scrolling'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>
                    {isBn
                      ? 'হলুদ / গোলাপি প্যাসেজ হাইলাইটার'
                      : 'Yellow / Pink Passage Highlighter'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>
                    {isBn ? 'True / False / Not Given ড্রিল' : 'True / False / Not Given Drills'}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle className="h-4 w-4 text-teal-600 shrink-0" />
                  <span>{isBn ? '১০-সেকেন্ড ক্লাউড অটোসেভ' : '10-Second Cloud Autosave'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/50 p-6 lg:col-span-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#005A70] text-teal-300">
                  <MonitorCheck className="h-6 w-6" />
                </div>
                <div>
                  <div className="text-sm font-bold text-slate-950">
                    {isBn ? 'তাৎক্ষণিক ব্রাউজার প্রিভিউ' : 'Instant Browser Preview'}
                  </div>
                  <div className="text-xs text-slate-600">
                    {isBn
                      ? 'ডেস্কটপ স্প্লিট-স্ক্রিন ও মোবাইল ট্যাব'
                      : 'Desktop split-screen & mobile tabs'}
                  </div>
                </div>
              </div>
              <Link href="/exam/ielts-preview" className="block w-full">
                <Button className="w-full justify-center gap-2 bg-teal-600 text-white hover:bg-teal-500 font-semibold">
                  {isBn
                    ? 'স্প্লিট-স্ক্রিন সিবিটি সিমুলেটর চালু করুন'
                    : 'Launch Split-Screen CBT Simulator'}{' '}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link
                href="/pricing"
                className="block text-center text-xs font-semibold text-teal-700 hover:underline"
              >
                {isBn
                  ? 'আইইএলটিএস একাডেমিক ও জিটি প্ল্যান তুলনা করুন →'
                  : 'Compare IELTS Academic & GT Plans →'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Skills Breakdown */}
      <section className="w-full max-w-7xl px-4 py-16 sm:py-24">
        <div className="text-center space-y-3 mb-12">
          <Badge variant="outline" className="border-teal-600 text-teal-700 text-xs">
            {isBn ? 'ব্রিটিশ এমারেল্ড ও টিল পাঠ্যক্রম' : 'British Emerald & Teal Curriculum'}
          </Badge>
          <h2 className="text-3xl font-extrabold tracking-tight text-slate-950 sm:text-4xl">
            {isBn ? '৪টি স্কিলেই পূর্ণাঙ্গ দক্ষতা অর্জন' : 'Complete Mastery Across All 4 Skills'}
          </h2>
          <p className="text-slate-600 text-base max-w-2xl mx-auto">
            {isBn
              ? 'রাইটিং টাস্ক ২-এর কোহেরেন্স এবং স্পিকিং ফ্লুয়েন্সিতে বাংলাদেশি পরীক্ষার্থীদের নির্দিষ্ট দুর্বলতাগুলো কাটিয়ে উঠতে বিশেষভাবে ডিজাইন করা হয়েছে।'
              : 'Engineered to overcome the specific bottlenecks faced by Bangladeshi test takers in Writing Task 2 coherence and Speaking fluency.'}
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {/* Listening */}
          <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-teal-400">
            <CardHeader>
              <div className="bg-[#005A70] text-teal-300 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <Headphones className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-slate-950">
                {isBn ? 'লিসেনিং রানার' : 'Listening Runner'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm space-y-2">
              <p>
                {isBn
                  ? 'যুক্তরাজ্য, অস্ট্রেলিয়া এবং উত্তর আমেরিকান অ্যাকসেন্টসহ প্রামাণিক সিঙ্গেল-প্লে অডিও স্ট্রিম।'
                  : 'Authentic single-play audio streams with UK, Australian, and North American accents.'}
              </p>
              <p className="text-slate-500 text-xs">
                {isBn
                  ? 'সকল ৭টি সিডি-আইইএলটিএস প্রশ্নের ধরন সমর্থন করে: ফর্ম পূরণ, ম্যাপ লেবেলিং, ম্যাচিং এবং এমসিকিউ।'
                  : 'Supports all 7 CD-IELTS item formats: form completion, map labelling, matching, and MCQ.'}
              </p>
            </CardContent>
          </Card>

          {/* Reading */}
          <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-teal-400">
            <CardHeader>
              <div className="bg-teal-600 text-white mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <BookOpen className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-slate-950">
                {isBn ? 'রিডিং স্প্লিট-পেইন' : 'Reading Split-Pane'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm space-y-2">
              <p>
                {isBn
                  ? 'ইন্টারেক্টিভ টেক্সট হাইলাইটারসহ স্বতন্ত্রভাবে স্ক্রলযোগ্য প্যাসেজ এবং প্রশ্ন পেইন।'
                  : 'Independent scrolling passage and questions pane with interactive text highlighter.'}
              </p>
              <p className="text-slate-500 text-xs">
                {isBn
                  ? 'True/False/Not Given এবং Yes/No/Not Given-এর সূক্ষ্ম পার্থক্য বোঝার বিশেষ প্রশিক্ষণ।'
                  : 'True/False/Not Given and Yes/No/Not Given cognitive distinction training.'}
              </p>
            </CardContent>
          </Card>

          {/* Writing */}
          <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-teal-400">
            <CardHeader>
              <div className="bg-[#005A70] text-teal-300 mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <PenTool className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-slate-950">
                {isBn ? 'রাইটিং ইভ্যালুয়েটর' : 'Writing Evaluator'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm space-y-2">
              <p>
                {isBn
                  ? 'তথ্য হারানো রোধে ১০-সেকেন্ড অটোসেভসহ রিয়েল-টাইম ওয়ার্ড কাউন্ট।'
                  : 'Real-time word counts with 10-second autosave preventing accidental loss.'}
              </p>
              <p className="text-slate-500 text-xs">
                {isBn
                  ? 'টাস্ক অ্যাচিভমেন্ট, কোহেশন, লেক্সিক্যাল রিসোর্স এবং গ্রামারের ওপর বিস্তারিত রুব্রিক বিশ্লেষণ।'
                  : 'Rubric breakdown across Task Achievement, Cohesion, Lexical Resource, and Grammar.'}
              </p>
            </CardContent>
          </Card>

          {/* Speaking */}
          <Card className="border-slate-200/80 bg-white shadow-lg transition-all hover:border-teal-400">
            <CardHeader>
              <div className="bg-teal-600 text-white mb-2 flex h-10 w-10 items-center justify-center rounded-lg">
                <Mic className="h-5 w-5" />
              </div>
              <CardTitle className="text-lg text-slate-950">
                {isBn ? 'স্পিকিং সিমুলেটর' : 'Speaking Simulator'}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-slate-600 text-sm space-y-2">
              <p>
                {isBn
                  ? 'টাইমড পার্ট ১, ২ (কিউ কার্ড ১-মিনিট প্রস্তুতি) এবং পার্ট ৩ ডিসকাশনের সাথে STT শব্দ-ভিত্তিক মূল্যায়ন।'
                  : 'Timed Parts 1, 2 (cue card 1-min prep), and Part 3 discussion with STT word-level evaluation.'}
              </p>
              <p className="text-slate-500 text-xs">
                {isBn
                  ? 'কথার গতি (wpm), বিরতি, ফিলার শব্দের হার এবং উচ্চারণের স্পষ্টতা পরিমাপ করে।'
                  : 'Measures speech rate (wpm), pauses, filler frequency, and pronunciation clarity.'}
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Tools Banner */}
      <section className="w-full border-t border-[#005A70] bg-[#005A70] px-4 py-16 text-center text-white">
        <div className="mx-auto max-w-3xl space-y-4">
          <span className="inline-block rounded-full border border-teal-400/30 bg-emerald-900 px-3 py-1 text-xs font-semibold text-teal-300">
            {isBn ? 'ফ্রি ব্যান্ড ইউটিলিটি' : 'Free Band Utility'}
          </span>
          <h3 className="text-2xl font-bold text-white sm:text-3xl">
            {isBn ? 'আপনার আইইএলটিএস ব্যান্ড স্কোর হিসাব করুন' : 'Calculate Your IELTS Band Score'}
          </h3>
          <p className="text-emerald-100/90 text-sm">
            {isBn
              ? 'অফিসিয়াল ০.২৫/০.৭৫ রাউন্ডিং নিয়মের অধীনে ৪টি স্কিলের ব্যান্ড কীভাবে গড় করা হয় তা দেখুন।'
              : 'Check how individual skill bands aggregate under the official 0.25/0.75 rounding rule.'}
          </p>
          <div className="pt-2">
            <Link href="/tools/ielts-band-calculator">
              <Button className="gap-2 bg-teal-600 text-white hover:bg-teal-500">
                <BarChart3 className="h-4 w-4" />{' '}
                {isBn ? 'আইইএলটিএস ব্যান্ড ক্যালকুলেটর খুলুন' : 'Open IELTS Band Calculator'}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
