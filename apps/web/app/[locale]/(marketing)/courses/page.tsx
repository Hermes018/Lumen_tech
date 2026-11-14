/** @purpose Courses index page listing GRE, IELTS Academic & General curriculum tracks (P2.6.1 Bilingual) */
import { brand } from '@lumen/config';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent } from '@lumen/ui';
import { ArrowRight, CheckCircle } from 'lucide-react';
import { ExamChooserGuide } from '../_components/ExamChooserGuide';
import { LocaleLink as Link } from '../../_components/LocaleLink';

export const metadata = {
  title: `Courses & Curriculum | কোর্স ও পাঠ্যক্রম | ${brand.name}`,
  description:
    'Explore our comprehensive GRE and IELTS prep courses with section-adaptive mock tests, FSRS vocabulary systems, and Socratic hint ladders.',
};

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  return (
    <div className="flex flex-col items-center px-4 py-16 sm:py-24" data-locale={locale}>
      <div className="mx-auto max-w-6xl w-full space-y-12">
        {/* Header */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <Badge variant="outline" className="border-accent text-accent text-xs">
            {isBn ? 'পাঠ্যক্রম ক্যাটালগ' : 'Curriculum Catalog'}
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">
            {isBn ? 'আপনার প্রস্তুতির ট্র্যাক বেছে নিন' : 'Choose Your Preparation Track'}
          </h1>
          <p className="text-fg-muted text-base sm:text-lg">
            {isBn
              ? 'প্রতিটি কোর্সে রয়েছে প্রামাণিক কম্পিউটার-ভিত্তিক টেস্টিং ইঞ্জিন, অ্যাক্টিভ-রিকল স্পেসড রিপিটিশন এবং কোনো লুকানো চার্জ ছাড়াই স্বচ্ছ মূল্যতালিকা।'
              : 'Every course combines authentic computer-based testing engines, active-recall spaced repetition, and transparent pricing with no hidden fees.'}
          </p>
        </div>

        {/* Course Cards Grid */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Track 1: GRE Prep */}
          <Card className="border-border bg-surface transition-all hover:shadow-md flex flex-col justify-between">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="default" className="text-xs">
                  {isBn ? 'ফ্ল্যাগশিপ ট্র্যাক' : 'Flagship Track'}
                </Badge>
                <span className="font-mono text-xs font-semibold text-accent">
                  {isBn ? 'লক্ষ্য ৩৩০+' : 'Target 330+'}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-fg">
                {isBn ? 'GRE® জেনারেল টেস্ট প্রস্তুতি' : 'GRE® General Test Prep'}
              </CardTitle>
              <p className="text-fg-muted text-sm">
                {isBn
                  ? 'যুক্তরাষ্ট্র এবং বিশ্বের শীর্ষ বিশ্ববিদ্যালয়গুলোতে STEM, বিজনেস এবং গ্র্যাজুয়েট স্কুলে আবেদনকারীদের জন্য বিশেষভাবে নির্মিত।'
                  : 'Engineered for STEM, Business, and Graduate School applicants targeting top US and global universities.'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-2 text-sm text-fg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>
                    {isBn
                      ? 'অফিশিয়াল কম্পিউটার-ডেলিভার্ড ফরম্যাট'
                      : 'Official Computer-Delivered Format'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>
                    {isBn
                      ? 'সেকশন-অ্যাডাপটিভ সিবিটি প্র্যাকটিস টেস্ট'
                      : 'Section-Adaptive Practice Tests in the Official Computer Format'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>
                    {isBn
                      ? '৩-ধাপের প্রগ্রেসিভ হিন্ট ল্যাডার ও ট্র্যাপ ডায়াগনস্টিকস'
                      : '3-Tier Progressive Hint Ladders & Trap Diagnostics'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>
                    {isBn
                      ? 'FSRS-4.5 স্পেসড রিপিটিশনসহ ১,৫০০+ শব্দের ভোক্যাব ইঞ্জিন'
                      : '1,500+ Word Vocab Engine with FSRS-4.5 Spaced Repetition'}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex flex-wrap gap-3">
                <Link href="/gre" className="flex-1">
                  <Button className="w-full gap-2">
                    {isBn ? 'জিআরই প্ল্যাটফর্ম দেখুন' : 'Explore GRE Platform'}{' '}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tools/gre-score-calculator">
                  <Button variant="outline">
                    {isBn ? 'স্কোর ক্যালকুলেটর' : 'Score Calculator'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Track 2: IELTS Prep */}
          <Card className="border-border bg-surface transition-all hover:shadow-md flex flex-col justify-between">
            <CardHeader className="space-y-3 pb-4">
              <div className="flex items-center justify-between">
                <Badge variant="outline" className="border-border text-fg text-xs">
                  {isBn ? 'একাডেমিক ও জেনারেল' : 'Academic & General'}
                </Badge>
                <span className="font-mono text-xs font-semibold text-accent">
                  {isBn ? 'লক্ষ্য ব্যান্ড ৭.৫+' : 'Target Band 7.5+'}
                </span>
              </div>
              <CardTitle className="text-2xl font-bold text-fg">
                {isBn ? 'IELTS® কম্পিউটার-ডেলিভার্ড প্রস্তুতি' : 'IELTS® CD Test Prep'}
              </CardTitle>
              <p className="text-fg-muted text-sm">
                {isBn
                  ? 'উচ্চশিক্ষায় ভর্তি এবং দক্ষ ইমিগ্রেশনের (এক্সপ্রেস এন্ট্রি, যুক্তরাজ্য, অস্ট্রেলিয়া) জন্য পূর্ণাঙ্গ প্রস্তুতি।'
                  : 'Complete preparation for higher study admissions and skilled immigration (Express Entry, UK, Australia).'}
              </p>
            </CardHeader>
            <CardContent className="space-y-6 pt-2">
              <div className="space-y-2 text-sm text-fg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>
                    {isBn
                      ? 'প্রামাণিক কম্পিউটার-ডেলিভার্ড আইইএলটিএস ইন্টারফেস শেল'
                      : 'Authentic Computer-Delivered IELTS Interface Shell'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>
                    {isBn
                      ? 'সিঙ্গেল-প্লে অডিও লিসেনিং এবং স্প্লিট-পেইন রিডিং ওয়ার্কবেঞ্চ'
                      : 'Single-play Audio Listening & Split-Pane Reading'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>
                    {isBn
                      ? 'টাস্ক অ্যাচিভমেন্ট ও কোহেশন বিশ্লেষণসহ এআই রাইটিং ইভ্যালুয়েটর'
                      : 'AI Writing Evaluator with Task Achievement & Cohesion Breakdown'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-accent shrink-0" />
                  <span>
                    {isBn
                      ? 'ফ্লুয়েন্সি ও লেক্সিক্যাল মেট্রিক্সসহ স্পিকিং সিমুলেটর'
                      : 'Speaking Simulator with Fluency & Lexical Metrics'}
                  </span>
                </div>
              </div>

              <div className="border-t border-border pt-4 flex flex-wrap gap-3">
                <Link href="/ielts" className="flex-1">
                  <Button className="w-full gap-2">
                    {isBn ? 'আইইএলটিএস প্ল্যাটফর্ম দেখুন' : 'Explore IELTS Platform'}{' '}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/tools/ielts-band-calculator">
                  <Button variant="outline">
                    {isBn ? 'ব্যান্ড ক্যালকুলেটর' : 'Band Calculator'}
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* All-Access Passes & Pricing CTA */}
        <div className="rounded-2xl border border-accent/20 bg-surface p-8 text-center sm:p-12 space-y-4">
          <Badge variant="outline" className="border-accent text-accent text-xs">
            {isBn ? 'নমনীয় মেম্বারশিপ' : 'Flexible Membership'}
          </Badge>
          <h2 className="text-2xl font-bold text-fg sm:text-3xl">
            {isBn
              ? 'উভয় পরীক্ষার প্রস্তুতি প্রয়োজন? অল-অ্যাক্সেস পাস বেছে নিন'
              : 'Need Access to Both Exams? Try an All-Access Pass'}
          </h2>
          <p className="text-fg-muted max-w-xl mx-auto text-sm">
            {isBn
              ? 'আমাদের ১-মাস, ৩-মাস এবং ১২-মাসের পাসের মাধ্যমে জিআরই ও আইইএলটিএসের সকল মক টেস্ট সিরিজ, প্রশ্ন ব্যাংক এবং এআই ইভ্যালুয়েশন ক্রেডিট আনলক করুন।'
              : 'Our 1-Month, 3-Month, and 12-Month Passes unlock full access across all GRE & IELTS mock test series, question banks, and AI evaluation credits.'}
          </p>
          <div className="pt-2">
            <Link href="/pricing">
              <Button size="lg" className="gap-2">
                {isBn
                  ? 'সকল মূল্যতালিকা ও পাস অপশন দেখুন'
                  : 'View All Pricing & Pass Options'}{' '}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
      <ExamChooserGuide isBn={isBn} />
    </div>
  );
}
