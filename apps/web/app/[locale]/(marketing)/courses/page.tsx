/** @purpose Coursera / 10MS style Curriculum & Program Directory (/courses) with 6 structured programs, interactive filter tabs, syllabus modules, and rounded-md Swiss grid borders (M2.8-B) */
import { brand } from '@lumen/config';
import { Button } from '@lumen/ui';
import { ArrowRight } from 'lucide-react';
import { ExamChooserGuide } from '../_components/ExamChooserGuide';
import {
  CoursesDirectoryClient,
  type CourseProgramItem,
} from '../_components/CoursesDirectoryClient';
import { LocaleLink as Link } from '../../_components/LocaleLink';

export const metadata = {
  title: `Courses & Curriculum | কোর্স ও পাঠ্যক্রম | ${brand.name}`,
  description:
    'Explore our 6 structured GRE and IELTS preparation programs with section-adaptive mock tests, FSRS-4.5 vocabulary systems, Socratic hint ladders, and transparent VAT-inclusive pricing.',
};

export default async function CoursesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const isBn = locale === 'bn';

  const programs: CourseProgramItem[] = [
    {
      id: 'gre-core-self-paced',
      code: 'GRE-101 • SELF-PACED',
      categories: ['gre'],
      title: isBn ? 'GRE Core Self-Paced (জিআরই কোর সেলফ-পেসড)' : 'GRE Core Self-Paced',
      subtitle: isBn
        ? 'স্বনির্ভর শিক্ষার্থী এবং প্রকৌশল/বিজ্ঞান গ্র্যাজুয়েটদের জন্য নির্মিত পূর্ণাঙ্গ কোয়ান্ট ও ভার্বাল ফাউন্ডেশন ট্র্যাক।'
        : 'Foundational self-paced Quantitative & Verbal reasoning curriculum for independent STEM and graduate school applicants.',
      durationBadge: isBn ? '৬ মাস • সেলফ-পেসড' : '6 Months • Self-Paced',
      targetScore: isBn ? 'লক্ষ্য ৩১৫–৩২৫+' : 'Target 315–325+',
      accentColor: '#003057',
      syllabusModules: isBn
        ? [
            'Quantitative Comparison (QC) ও ধনাত্মক/ঋণাত্মক রুট ফাঁদ বিশ্লেষণ',
            'বীজগণিত, সংখ্যা তত্ত্ব, জ্যামিতি এবং ডেটা ইন্টারপ্রিটেশন সেট',
            'Text Completion (১–৩ ব্ল্যাঙ্ক) ও Sentence Equivalence পেয়ারিং কৌশল',
            'FSRS-4.5 স্পেসড রিপিটিশনসহ ১,৫০০+ উচ্চ-গুরুত্বপূর্ণ জিআরই শব্দভাণ্ডার',
            'Reading Comprehension লজিক্যাল ফ্লো ও স্কোপ-শিফট ডিস্ট্রাক্টর নির্ণয়',
          ]
        : [
            'Quantitative Comparison (QC) Mastery & Positive/Negative Root Trap Forensics',
            'Algebraic Manipulation, Number Properties, Geometry & Data Interpretation Sets',
            'Text Completion (1–3 Blanks) & Sentence Equivalence Synonym Pairing',
            '1,500+ High-Frequency GRE Vocabulary Deck with 4-Mode FSRS-4.5 Scheduling',
            'Reading Comprehension Logical Structure & Scope-Shift Distractor Analysis',
          ],
      includedAssessments: isBn
        ? '৬টি পূর্ণাঙ্গ অ্যাডাপটিভ মক • ১,৫০০ ভোক্যাব কার্ড • ১,২০০+ হিন্ট-গাইডেড প্রশ্ন'
        : '6 Full Adaptive Mocks • 1,500 Vocab Cards • 1,200+ Hint-Guided Items',
      priceDisplay: isBn ? '৳ ৪,৪৯০' : '৳ 4,490',
      vatLabel: isBn ? '১৫% মূসক ৬.৩ ভ্যাট অন্তর্ভুক্ত' : 'incl. 15% Mushak 6.3 VAT',
      trackHref: '/gre',
      checkoutHref: '/checkout?plan=gre-core',
    },
    {
      id: 'gre-plus-grading',
      code: 'GRE-201 • FLAGSHIP PLUS',
      categories: ['gre'],
      title: isBn
        ? 'GRE Plus + AI/Human Grading (জিআরই প্লাস + এসে রিভিউ)'
        : 'GRE Plus + AI/Human Grading',
      subtitle: isBn
        ? '৩২৫–৩৩৫+ লক্ষ্যমাত্রার শিক্ষার্থীদের জন্য সেকশন-অ্যাডাপটিভ হার্ড প্যানেল ড্রিল এবং অ্যানালিটিক্যাল রাইটিং মূল্যায়নসহ ফ্ল্যাগশিপ প্রোগ্রাম।'
        : 'Our flagship GRE track engineered for 325–335+ ambitions, adding Harder Section 2 drills and calibrated AWA essay evaluations.',
      durationBadge: isBn ? '৬ মাস • সেলফ-পেসড + গ্রেডিং' : '6 Months • Self-Paced + Grading',
      targetScore: isBn ? 'লক্ষ্য ৩২৫–৩৩৫+' : 'Target 325–335+',
      accentColor: '#007791',
      syllabusModules: isBn
        ? [
            'সেকশন ১ -> কঠিনতর সেকশন ২ (১৬৫–১৭০ সিলিং) রাউটিং অ্যাকুরেসি প্রোটোকল',
            '৩-ধাপের প্রগ্রেসিভ হিন্ট ল্যাডার ও সক্রেটিক ধাপে-ধাপে সমস্যা সমাধানকারী',
            'উন্নত বিন্যাস, সমাবেশ, সম্ভাব্যতা এবং নরমাল ডিস্ট্রিবিউশন কোয়ান্ট সেট',
            'প্রেডিক্ট-ফার্স্ট ভার্বাল ডিকনস্ট্রাক্টর ও ক্রিটিক্যাল রিজনিং প্যারাডক্স সমাধান',
            'Analytical Writing (Analyze an Issue) ৬.০ রুব্রিক স্ট্রাকচার ও এসে গ্রেডিং',
          ]
        : [
            'Section 1 -> Harder Section 2 (165–170 Ceiling) Routing Accuracy Protocol',
            '3-Tier Progressive Hint Ladders & Guided Socratic Step-by-Step Solver',
            'Advanced Combinatorics, Probability & Normal Distribution Quant Drills',
            'Predict-First Verbal Deconstructor & Critical Reasoning Paradox Resolution',
            'Analytical Writing (Analyze an Issue) 6.0 Rubric Architecture & Essay Grading',
          ],
      includedAssessments: isBn
        ? '১০টি পূর্ণাঙ্গ অ্যাডাপটিভ মক • ১,৫০০ ভোক্যাব কার্ড • ৬টি এসে রিভিউ'
        : '10 Full Adaptive Mocks • 1,500 Vocab Cards • 6 Essay Reviews',
      priceDisplay: isBn ? '৳ ৫,৯৯০' : '৳ 5,990',
      vatLabel: isBn ? '১৫% মূসক ৬.৩ ভ্যাট অন্তর্ভুক্ত' : 'incl. 15% Mushak 6.3 VAT',
      trackHref: '/gre',
      checkoutHref: '/checkout?plan=gre-plus',
    },
    {
      id: 'gre-live-cohort',
      code: 'GRE-301 • LIVE COHORT',
      categories: ['gre', 'live'],
      title: isBn
        ? 'GRE Live 8-Week Cohort (জিআরই ৮-সপ্তাহের লাইভ ব্যাচ)'
        : 'GRE Live 8-Week Cohort',
      subtitle: isBn
        ? 'সপ্তাহে ৩টি ইন্টারেক্টিভ লাইভ ক্লাস, সাপ্তাহিক মক পোস্ট-মর্টেম এবং সরাসরি ইন্সট্রাক্টর অফিস আওয়ারসহ নিবিড় কোহর্ট প্রোগ্রাম।'
        : 'Structured 8-week instructor-led cohort combining 24 interactive live problem-solving classes with full CBT mock telemetry.',
      durationBadge: isBn ? '৮ সপ্তাহ • ২৪টি লাইভ ক্লাস' : '8 Weeks • 24 Live Classes',
      targetScore: isBn ? 'লক্ষ্য ৩৩০+ গাইডেড কোহর্ট' : 'Target 330+ Guided Cohort',
      accentColor: '#001E42',
      syllabusModules: isBn
        ? [
            'সপ্তাহ ১–২: কোয়ান্ট ফাউন্ডেশন ও QC ট্র্যাপ এলিমিনেশন লাইভ ওয়ার্কশপ',
            'সপ্তাহ ৩–৪: ভার্বাল TC/SE ভোকাবুলারি ম্যাপিং ও লং-প্যাসেজ রিডিং ক্লিনিক',
            'সপ্তাহ ৫–৬: হার্ড-প্যানেল (১৭০ লেভেল) কোয়ান্ট ও ডাটা ইন্টারপ্রিটেশন স্প্রিন্ট',
            'সপ্তাহ ৭–৮: পূর্ণাঙ্গ ১ ঘণ্টা ৫৮ মিনিটের লাইভ প্রক্টরড মক ও পেসিং রিভিউ',
          ]
        : [
            'Weeks 1–2: Quantitative Foundations & QC Trap Elimination Live Workshops',
            'Weeks 3–4: Verbal TC/SE Vocabulary Mapping & Long-Passage Reading Clinics',
            'Weeks 5–6: Hard-Panel (170-Level) Quant & Data Interpretation Sprints',
            'Weeks 7–8: Full 1 Hr 58 Min Proctored CBT Mock Sprints & Pacing Audits',
          ],
      includedAssessments: isBn
        ? '১০টি পূর্ণাঙ্গ অ্যাডাপটিভ মক • ২৪টি লাইভ ক্লাস + এইচডি রেকর্ডিং • ৮টি এসে রিভিউ'
        : '10 Full Adaptive Mocks • 24 Live Classes + HD Recordings • 8 Essay Reviews',
      priceDisplay: isBn ? '৳ ৯,৯৯০' : '৳ 9,990',
      vatLabel: isBn ? '১৫% মূসক ৬.৩ ভ্যাট অন্তর্ভুক্ত' : 'incl. 15% Mushak 6.3 VAT',
      trackHref: '/gre',
      checkoutHref: '/checkout?plan=gre-live',
    },
    {
      id: 'ielts-academic-complete',
      code: 'IELTS-101 • ACADEMIC',
      categories: ['ielts'],
      title: isBn
        ? 'IELTS Academic Complete (আইইএলটিএস একাডেমিক কমপ্লিট)'
        : 'IELTS Academic Complete',
      subtitle: isBn
        ? 'যুক্তরাজ্য, যুক্তরাষ্ট্র, কানাডা ও অস্ট্রেলিয়ায় আন্ডারগ্র্যাজুয়েট এবং মাস্টার্স/পিএইচডি ভর্তির জন্য পূর্ণাঙ্গ ৪-স্কিল সিডি-আইইএলটিএস প্রস্তুতি।'
        : 'Complete 4-skill Computer-Delivered IELTS Academic preparation for UK, US, Canada, Australia, and European university admissions.',
      durationBadge: isBn ? '৪ মাস • সেলফ-পেসড সিবিটি' : '4 Months • Self-Paced CBT',
      targetScore: isBn ? 'লক্ষ্য ব্যান্ড ৭.৫–৮.৫' : 'Target Band 7.5–8.5',
      accentColor: '#E4002B',
      syllabusModules: isBn
        ? [
            'লিসেনিং: ৪টি সেকশনে সিঙ্গেল-প্লে অডিও, ম্যাপ লেবেলিং ও এমসিকিউ ডিস্ট্রাক্টর ড্রিল',
            'একাডেমিক রিডিং: স্প্লিট-পেইন হাইলাইটার, True/False/Not Given এবং Heading ম্যাচিং',
            'একাডেমিক রাইটিং টাস্ক ১: চার্ট, গ্রাফ, প্রসেস ডায়াগ্রাম ও ডেটা কম্প্যারিজন কাঠামো',
            'রাইটিং টাস্ক ২: ব্যান্ড ৮.০ কোহেরেন্স, লেক্সিক্যাল রিসোর্স ও আর্গুমেন্ট এসে ফ্রেমওয়ার্ক',
            'স্পিকিং পার্ট ১–৩: ২-মিনিট কিউ কার্ড টাইমার, ফ্লুয়েন্সি এবং উচ্চারণ মূল্যায়ন',
          ]
        : [
            'Listening Runner: 4-Part Single-Play Audio, Map Labelling & MCQ Distractor Drills',
            'Academic Reading: Split-Pane Highlighter, True/False/Not Given & Heading Match',
            'Academic Writing Task 1: Chart, Graph, Process Diagram & Data Overview Synthesis',
            'Writing Task 2: Band 8.0 Coherence, Lexical Resource & Argument Essay Architecture',
            'Speaking Parts 1–3: 2-Min Cue-Card Timer, Fluency Telemetry & Lexical Grading',
          ],
      includedAssessments: isBn
        ? '১০টি পূর্ণাঙ্গ CD-IELTS মক • ৮টি রাইটিং মূল্যায়ন • ৮টি স্পিকিং সিমুলেশন'
        : '10 Full CD-IELTS Mocks • 8 Writing Rubric Reviews • 8 Speaking Simulations',
      priceDisplay: isBn ? '৳ ৪,৯৯০' : '৳ 4,990',
      vatLabel: isBn ? '১৫% মূসক ৬.৩ ভ্যাট অন্তর্ভুক্ত' : 'incl. 15% Mushak 6.3 VAT',
      trackHref: '/ielts',
      checkoutHref: '/checkout?plan=ielts-academic',
    },
    {
      id: 'ielts-gt-express',
      code: 'IELTS-201 • GENERAL TRAINING',
      categories: ['ielts'],
      title: isBn
        ? 'IELTS General Training Express (জেনারেল ট্রেনিং এক্সপ্রেস)'
        : 'IELTS General Training Express',
      subtitle: isBn
        ? 'কানাডা এক্সপ্রেস এন্ট্রি (CLB 9 / ৮-৭-৭-৭), যুক্তরাজ্য ও অস্ট্রেলিয়ায় স্কিলড মাইগ্রেশন এবং ওয়ার্ক ভিসা আবেদনকারীদের জন্য বিশেষায়িত।'
        : 'Focused IELTS General Training track built specifically for Canada Express Entry (CLB 9 / 8-7-7-7) and skilled migration applicants.',
      durationBadge: isBn ? '৩ মাস • ফাস্ট-ট্র্যাক' : '3 Months • Fast-Track',
      targetScore: isBn ? 'লক্ষ্য CLB 9+ (৮-৭-৭-৭)' : 'Target CLB 9+ (8-7-7-7)',
      accentColor: '#006677',
      syllabusModules: isBn
        ? [
            'জেনারেল ট্রেনিং রাইটিং টাস্ক ১: ফরমাল, সেমি-ফরমাল ও ইনফরমাল লেটার টোন ক্যালিব্রেশন',
            'জিটি রিডিং সেকশন ১–৩: ওয়ার্কপ্লেস হ্যান্ডবুক, অফিশিয়াল নোটিশ ও লং-টেক্সট স্ক্যানিং',
            'লিসেনিং ৮.০+ টার্গেট: সেকশন ৩ ও ৪-এর স্পিড-ট্র্যাপ ও বানান নির্ভুলতা অনুশীলন',
            'স্পিকিং CLB 9+ বুস্টার: পার্ট ৩ বিমূর্ত আলোচনা এবং ইডিওমেটিক ভোকাবুলারি ড্রিল',
          ]
        : [
            'GT Writing Task 1: Formal, Semi-Formal & Informal Letter Tone Calibration',
            'GT Reading Sections 1–3: Workplace Handbooks, Official Notices & Long-Text Scanning',
            'Listening 8.0+ Target: Part 3 & Part 4 Speed-Trap & Spelling Precision Drills',
            'Speaking CLB 9+ Booster: Part 3 Abstract Discussion & Idiomatic Lexical Range',
          ],
      includedAssessments: isBn
        ? '৮টি পূর্ণাঙ্গ GT মক • ৬টি লেটার ও এসে রিভিউ • ৬টি স্পিকিং মক'
        : '8 Full GT Mocks • 6 Letter & Essay Reviews • 6 Speaking Mocks',
      priceDisplay: isBn ? '৳ ৪,২৯০' : '৳ 4,290',
      vatLabel: isBn ? '১৫% মূসক ৬.৩ ভ্যাট অন্তর্ভুক্ত' : 'incl. 15% Mushak 6.3 VAT',
      trackHref: '/ielts',
      checkoutHref: '/checkout?plan=ielts-gt',
    },
    {
      id: 'all-access-dual-pass',
      code: 'PASS-365 • DUAL EXAM BUNDLE',
      categories: ['gre', 'ielts', 'live'],
      title: isBn
        ? 'All-Access Dual Exam Pass (অল-অ্যাক্সেস পাস — GRE + IELTS)'
        : 'All-Access Dual Exam Pass',
      subtitle: isBn
        ? 'যুক্তরাষ্ট্র এবং বৈশ্বিক গ্র্যাজুয়েট স্কুলে আবেদনকারীদের জন্য ১২ মাসের একক মেম্বারশিপে সম্পূর্ণ GRE® ও IELTS™ প্রস্তুতির সুবিধা।'
        : 'Unified 12-month membership unlocking both GRE® General Test and IELTS™ Academic/GT tracks, live crash workshops, and full mock banks.',
      durationBadge: isBn ? '১২ মাস • ডুয়াল এক্সাম + লাইভ রিভিউ' : '12 Months • Dual Exam + Live Clinics',
      targetScore: isBn ? 'GRE ৩৩০+ ও IELTS ব্যান্ড ৮.০+' : 'GRE 330+ & IELTS Band 8.0+',
      accentColor: '#001E42',
      syllabusModules: isBn
        ? [
            'সম্পূর্ণ GRE® কোয়ান্ট, ভার্বাল এবং ১,৫০০+ FSRS-4.5 ভোকাবুলারি ডেক অ্যাক্সেস',
            'সম্পূর্ণ IELTS™ একাডেমিক ও জেনারেল ট্রেনিং ৪-স্কিল সিবিটি ওয়ার্কবেঞ্চ',
            'মাসিক লাইভ কোয়ান্ট, ভার্বাল এবং আইইএলটিএস রাইটিং/স্পিকিং রিভিউ ক্লিনিক',
            'সমন্বিত স্টাডি প্ল্যানার: আগে GRE ও পরে IELTS দেওয়ার ১২-সপ্তাহের রোডম্যাপ',
            'প্রায়োরিটি ২৪-ঘণ্টা এসে ও স্পিকিং রুব্রিক গ্রেডিং এবং ডিসপিউট রিভিউ সুবিধা',
          ]
        : [
            'Complete GRE® Quantitative, Verbal & 1,500+ FSRS-4.5 Vocabulary Deck Access',
            'Complete IELTS™ Academic & General Training 4-Skill CBT Workbenches',
            'Monthly Live Quantitative, Verbal & IELTS Writing/Speaking Review Clinics',
            'Integrated Sequential Study Planner (GRE First -> 3-Week IELTS Sprint)',
            'Priority 24-Hour Essay & Speaking Rubric Grading Queue with Human Escalation',
          ],
      includedAssessments: isBn
        ? '২০টি পূর্ণাঙ্গ মক (১০টি GRE + ১০টি IELTS) • ১,৫০০ ভোক্যাব কার্ড • ১২টি রাইটিং ও স্পিকিং রিভিউ'
        : '20 Full Mocks (10 GRE + 10 IELTS) • 1,500 Vocab Cards • 12 Writing & Speaking Reviews',
      priceDisplay: isBn ? '৳ ৮,৪৯০' : '৳ 8,490',
      vatLabel: isBn ? '১৫% মূসক ৬.৩ ভ্যাট অন্তর্ভুক্ত' : 'incl. 15% Mushak 6.3 VAT',
      trackHref: '/pricing',
      checkoutHref: '/checkout?plan=all-access-12m',
    },
  ];

  return (
    <div className="flex flex-col items-center bg-[#F8F7F4] pt-12 lg:pt-16" data-locale={locale}>
      <div className="mx-auto max-w-7xl w-full space-y-10 px-4 sm:px-6 lg:px-8">
        {/* Left-Aligned Institutional Catalog Header */}
        <div className="rounded-md border border-slate-200 bg-white p-6 sm:p-8 shadow-2xs grid lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 text-left space-y-3">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
              {isBn
                ? 'পাঠ্যক্রম ও প্রোগ্রাম ডিরেক্টরি • ৬টি অফিশিয়াল কোর্স'
                : 'Curriculum & Program Directory • 6 Official Programs'}
            </div>
            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-slate-950">
              {isBn ? 'আপনার প্রস্তুতির ট্র্যাক বেছে নিন' : 'Choose Your Preparation Track'}
            </h1>
            <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl">
              {isBn
                ? 'প্রতিটি প্রোগ্রামে রয়েছে অফিশিয়াল কম্পিউটার-ভিত্তিক টেস্টিং ইঞ্জিন, সুনির্দিষ্ট মডিউল সিলেবাস, মক টেস্ট বরাদ্দ এবং ১৫% মূসক ৬.৩ ভ্যাটসহ স্বচ্ছ টিউশন ফি।'
                : 'Browse our complete syllabus catalog below. Every program includes authentic computer-based testing workbenches, concrete module deliverables, and transparent VAT-inclusive tuition.'}
            </p>
          </div>

          <div className="lg:col-span-4 rounded-md border border-slate-200 bg-[#F8F7F4] p-4 space-y-3 text-left">
            <div className="text-xs font-bold uppercase tracking-wider text-[#001E42]">
              {isBn ? 'নমনীয় মেম্বারশিপ ও ডায়াগনস্টিক' : 'Unsure Where to Start?'}
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              {isBn
                ? 'ভর্তি হওয়ার আগে আমাদের ফ্রি ১৫-মিনিট বেসলাইন ডায়াগনস্টিক দিন অথবা অল-অ্যাক্সেস পাস তুলনা করুন।'
                : 'Take our free 15-minute baseline diagnostic first to get an estimated score and program recommendation.'}
            </p>
            <div className="flex flex-wrap gap-2">
              <Link href="/exam/diagnostic">
                <Button className="rounded-md bg-[#001E42] text-white hover:bg-slate-900 font-bold text-xs h-9 px-3">
                  {isBn ? 'ফ্রি ডায়াগনস্টিক দিন ->' : 'Take Free Diagnostic ->'}
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="outline"
                  className="rounded-md border-slate-300 bg-white text-slate-900 hover:bg-slate-100 font-semibold text-xs h-9 px-3"
                >
                  {isBn ? 'মূল্যতালিকা তুলনা' : 'Compare Tuition'}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Interactive Filter Tabs + 6 Structured Program Cards */}
        <CoursesDirectoryClient programs={programs} isBn={isBn} />

        {/* Institutional Cohort & Bulk Licensing Callout */}
        <div className="rounded-md border border-slate-200 border-t-4 border-t-[#001E42] bg-white p-6 sm:p-8 grid lg:grid-cols-12 gap-6 items-center shadow-2xs">
          <div className="lg:col-span-8 space-y-2 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
              {isBn ? 'নমনীয় মেম্বারশিপ' : 'Multi-Exam & Institutional Access'}
            </div>
            <h2 className="text-2xl lg:text-3xl font-extrabold text-slate-950">
              {isBn
                ? 'উভয় পরীক্ষার প্রস্তুতি প্রয়োজন? অল-অ্যাক্সেস পাস বেছে নিন'
                : 'Need Access to Both Exams? Choose an All-Access Pass'}
            </h2>
            <p className="text-slate-600 max-w-2xl text-xs sm:text-sm leading-relaxed">
              {isBn
                ? 'আমাদের ১-মাস, ৩-মাস এবং ১২-মাসের অল-অ্যাক্সেস পাসের মাধ্যমে জিআরই ও আইইএলটিএসের সকল মক টেস্ট সিরিজ, প্রশ্ন ব্যাংক এবং এআই ইভ্যালুয়েশন ক্রেডিট আনলক করুন।'
                : 'Our 1-Month, 3-Month, and 12-Month All-Access Passes unlock full access across all GRE & IELTS mock test series, question banks, and AI evaluation credits.'}
            </p>
          </div>
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link href="/pricing">
              <Button
                size="lg"
                className="rounded-md gap-2 bg-[#E4002B] text-white hover:bg-[#c80025] font-bold h-11 px-6 text-sm"
              >
                {isBn
                  ? 'সকল মূল্যতালিকা ও পাস অপশন দেখুন'
                  : 'View All Pricing & Pass Options'}{' '}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom GRE vs IELTS Comparison Table */}
      <ExamChooserGuide isBn={isBn} />
    </div>
  );
}
