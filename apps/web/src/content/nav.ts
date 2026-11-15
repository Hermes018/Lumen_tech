/** @purpose Bilingual (en & bn) navigation, mega-menu, and footer data for the institutional marketing shell */
import { brand } from '@lumen/config';

export type NavLocale = 'en' | 'bn';

export interface NavLinkItem {
  label: string;
  href: string;
}

export interface MegaMenuLinkItem {
  title: string;
  description: string;
  href: string;
}

export interface GreIeltsCategory {
  id: string;
  label: string;
  links: MegaMenuLinkItem[];
}

export interface ConversionAction {
  label: string;
  href: string;
}

export interface FooterColumn {
  heading: string;
  links: Array<{ label: string; href?: string; isEmail?: boolean }>;
}

export interface NavLocaleData {
  skipToContent: string;
  topRibbon: {
    announcement: string;
    ctaLabel: string;
    ctaHref: string;
  };
  utilityLinks: NavLinkItem[];
  brandLabel: string;
  triggers: {
    exams: string;
    courses: string;
    practice: string;
    pricing: string;
  };
  mainCta: NavLinkItem;
  mobileMenu: {
    openLabel: string;
    closeLabel: string;
    languageLabel: string;
  };
  megaGreIelts: {
    categories: GreIeltsCategory[];
    conversionStrip: ConversionAction[];
  };
  megaCourses: {
    col1Title: string;
    col1Body: string;
    col2Heading: string;
    col2Links: NavLinkItem[];
    ribbonLabel: string;
    ribbonLinks: NavLinkItem[];
    ribbonCta: NavLinkItem;
  };
  megaPractice: {
    heading: string;
    links: MegaMenuLinkItem[];
  };
  footer: {
    columns: FooterColumn[];
    disclaimerP1: string;
    disclaimerP2: string;
    copyright: string;
  };
}

export const NAV_DATA: Record<NavLocale, NavLocaleData> = {
  en: {
    skipToContent: 'Skip to main content',
    topRibbon: {
      announcement: 'New GRE® & IELTS™ cohorts open — take a 15-minute baseline diagnostic free.',
      ctaLabel: 'Start Free Diagnostic',
      ctaHref: '/exam/diagnostic',
    },
    utilityLinks: [
      { label: 'For Universities & Schools', href: '/for-institutions' },
      { label: 'Help Center', href: '/help' },
      { label: 'Log in', href: '/sign-in' },
    ],
    brandLabel: brand.name,
    triggers: {
      exams: 'GRE® & IELTS™',
      courses: 'Courses & Prep',
      practice: 'Practice & Simulators',
      pricing: 'Pricing',
    },
    mainCta: {
      label: 'Get Started',
      href: '/sign-up',
    },
    mobileMenu: {
      openLabel: 'Open navigation menu',
      closeLabel: 'Close navigation menu',
      languageLabel: 'Language',
    },
    megaGreIelts: {
      categories: [
        {
          id: 'gre-general',
          label: '01. GRE® General Test',
          links: [
            {
              title: 'GRE® Format & Overview',
              description: 'Understand the 1h 58m adaptive test structure.',
              href: '/gre#overview',
            },
            {
              title: 'Section-Adaptive Quant & Verbal',
              description: 'Quantitative comparison and Verbal reasoning families.',
              href: '/gre#question-families',
            },
            {
              title: 'Analytical Writing (AWA) Rubric',
              description: 'Analyze an Issue 30-minute essay scoring criteria.',
              href: '/gre#awa-rubric',
            },
            {
              title: '1h 58m Section Timing & Scoring',
              description: '130–170 section scaling and adaptive section routing.',
              href: '/gre#structure-scoring',
            },
            {
              title: '15-Min Adaptive GRE Diagnostic',
              description: 'Estimate your baseline Verbal and Quant score.',
              href: '/exam/diagnostic',
            },
            {
              title: 'GRE® Tuition & Study Plans',
              description: 'Structured 8-week and 12-week study tracks.',
              href: '/courses?track=gre',
            },
          ],
        },
        {
          id: 'ielts-academic',
          label: '02. IELTS™ Academic',
          links: [
            {
              title: 'IELTS™ Academic Overview',
              description: 'University admission prep for UK, Canada, and Australia.',
              href: '/ielts?module=academic#overview',
            },
            {
              title: '4-Skill Format & Timing Breakdown',
              description: 'Listening, Academic Reading, Writing, and Speaking.',
              href: '/ielts?module=academic#paper-breakdown',
            },
            {
              title: 'CD-IELTS Split-Screen Workbench',
              description: 'Practice in an official computer-delivered test layout.',
              href: '/exam/ielts-preview',
            },
            {
              title: 'Academic Writing Task 1 & 2 Rubrics',
              description: 'Band descriptors, Task 1 data charts, and Task 2 essays.',
              href: '/ielts?module=academic#skill-workbenches',
            },
            {
              title: 'CD-IELTS Typing Speed Studio',
              description: 'Measure Net WPM and 400-word CD-IELTS pacing.',
              href: '/tools/ielts-typing-test',
            },
            {
              title: 'IELTS™ Academic Tuition Plans',
              description: 'Full Academic track with Mushak 6.3 VAT receipts.',
              href: '/courses?track=ielts-academic',
            },
          ],
        },
        {
          id: 'ielts-gt',
          label: '03. IELTS™ General Training',
          links: [
            {
              title: 'General Training Overview (Migration & Work)',
              description: 'Focused prep for migration and work visas.',
              href: '/ielts?module=gt#academic-vs-gt',
            },
            {
              title: 'GT Task 1 Letter & Workplace Reading',
              description: 'Targeted drills for GT Reading and Writing.',
              href: '/ielts?module=gt#skill-workbenches',
            },
            {
              title: 'Single-Play Listening Audio Studio',
              description: 'Authentic single-play CD-IELTS listening practice.',
              href: '/exam/ielts-preview?skill=listening',
            },
            {
              title: 'IELTS™ Band Score Calculator',
              description: 'Convert raw Listening/Reading scores to 0–9.0 bands.',
              href: '/tools/ielts-band-calculator',
            },
            {
              title: 'Free 15-Min Baseline Diagnostic',
              description: 'Gauge your starting GT band in 15 minutes.',
              href: '/exam/diagnostic?track=ielts-gt',
            },
            {
              title: 'GT Tuition & Mock Bundles',
              description: 'Self-paced GT drills plus mock test bundles.',
              href: '/courses?track=ielts-gt',
            },
          ],
        },
        {
          id: 'which-exam',
          label: '04. Which Exam Do I Need?',
          links: [
            {
              title: 'GRE® vs. IELTS™ Admissions Guide',
              description: 'Match your target degree or visa to the right test.',
              href: '/help#exam-comparison',
            },
            {
              title: 'GRE® Score Converter & Percentiles',
              description: 'Estimate 130–170 section scores and global percentiles.',
              href: '/tools/gre-score-calculator',
            },
            {
              title: 'Compare All Preparation Courses',
              description: 'Browse every GRE® and IELTS™ cohort and track.',
              href: '/courses',
            },
            {
              title: 'Transparent BDT & USD Pricing',
              description: 'View BDT bKash split-pay and international USD plans.',
              href: '/pricing',
            },
            {
              title: 'University & Corporate Cohorts',
              description: 'Institutional seat licensing for universities and teams.',
              href: '/for-institutions',
            },
            {
              title: 'Scholar Workspace & Study Plan',
              description: 'Open your personalized study dashboard and calendar.',
              href: '/app',
            },
          ],
        },
      ],
      conversionStrip: [
        { label: 'EXPLORE PREP COURSES', href: '/courses' },
        { label: 'TAKE FREE DIAGNOSTIC', href: '/exam/diagnostic' },
      ],
    },
    megaCourses: {
      col1Title: `Prepare with ${brand.shortName}`,
      col1Body:
        'Master GRE® and IELTS™ with bilingual explanations, spaced-repetition vocabulary, and realistic computer-delivered mock exams. Every track is built for Bangladeshi students.',
      col2Heading: 'Courses & Packages',
      col2Links: [
        { label: 'All Prep Courses', href: '/courses' },
        { label: 'Self-Paced Foundations', href: '/courses?filter=self-paced' },
        { label: 'Live & Instructor Cohorts', href: '/courses?filter=live' },
        { label: 'Mock & AI Credit Bundles', href: '/courses?filter=mocks' },
        { label: 'For Universities & Schools', href: '/for-institutions' },
      ],
      ribbonLabel: 'Explore key areas',
      ribbonLinks: [
        { label: 'GRE® Quant & Verbal', href: '/gre' },
        { label: 'IELTS™ Academic', href: '/ielts?module=academic#overview' },
        { label: 'IELTS™ General Training', href: '/ielts?module=gt#academic-vs-gt' },
        { label: 'bKash 0% Split-Pay & Passes', href: '/pricing#mock-passes' },
      ],
      ribbonCta: {
        label: 'Start 15-Min Free Diagnostic',
        href: '/exam/diagnostic',
      },
    },
    megaPractice: {
      heading: 'Practice & Exam Simulators',
      links: [
        {
          title: '15-Min Express Diagnostic',
          description: 'Fast baseline check for GRE® or IELTS™ readiness.',
          href: '/exam/diagnostic',
        },
        {
          title: 'CD-IELTS Split-Screen Simulator',
          description: 'Authentic computer-delivered reading and writing workspace.',
          href: '/exam/ielts-preview',
        },
        {
          title: 'IELTS Typing Speed Test',
          description: 'Measure Net WPM, accuracy, and 400-word CD-IELTS pacing.',
          href: '/tools/ielts-typing-test',
        },
        {
          title: 'GRE® Score & Percentile Calculator',
          description: 'Convert raw section performance to 130–170 scaled scores.',
          href: '/tools/gre-score-calculator',
        },
        {
          title: 'IELTS™ Band Score Calculator',
          description: 'Calculate overall 0–9.0 band scores across all four skills.',
          href: '/tools/ielts-band-calculator',
        },
      ],
    },
    footer: {
      columns: [
        {
          heading: 'Curriculum',
          links: [
            { label: 'GRE® Computer-Based Prep', href: '/gre' },
            { label: 'IELTS™ Academic & General', href: '/ielts' },
            { label: 'IELTS Typing Speed Test', href: '/tools/ielts-typing-test' },
            { label: 'Active-Recall Vocabulary', href: '/gre#vocab' },
            { label: '15-Min Free Diagnostic', href: '/exam/diagnostic' },
          ],
        },
        {
          heading: 'Platform',
          links: [
            { label: 'All Courses', href: '/courses' },
            { label: 'Pricing & Plans', href: '/pricing' },
            { label: 'Help Center', href: '/help' },
            { label: 'For Universities & Schools', href: '/for-institutions' },
          ],
        },
        {
          heading: 'Legal & Trust',
          links: [
            { label: 'Terms of Service', href: '/legal/terms' },
            { label: 'Privacy Policy', href: '/legal/privacy' },
            { label: 'Refund Policy', href: '/legal/refund-policy' },
            { label: 'Grievance Redressal', href: '/legal/grievance' },
          ],
        },
        {
          heading: 'Connect',
          links: [
            { label: 'Dhaka, Bangladesh' },
            { label: brand.supportEmail, isEmail: true },
            { label: 'Mushak 6.3 VAT Invoices Included' },
          ],
        },
      ],
      disclaimerP1:
        'GRE® is a registered trademark of Educational Testing Service (ETS). IELTS™ is a registered trademark of the University of Cambridge, the British Council, and IDP Education Australia.',
      disclaimerP2: `${brand.name} is an independent test-preparation platform and is not affiliated with, endorsed by, or sponsored by ETS, the British Council, IDP Education, or Cambridge University Press & Assessment. All practice scores are estimated.`,
      copyright: `© ${new Date().getFullYear()} ${brand.legalName} All rights reserved.`,
    },
  },
  bn: {
    skipToContent: 'মূল বিষয়বস্তুতে যান',
    topRibbon: {
      announcement: 'নতুন GRE® ও IELTS™ ব্যাচ শুরু হচ্ছে — ১৫ মিনিটের ফ্রি ডায়াগনস্টিক পরীক্ষা দিন।',
      ctaLabel: 'ফ্রি ডায়াগনস্টিক শুরু করুন',
      ctaHref: '/exam/diagnostic',
    },
    utilityLinks: [
      { label: 'বিশ্ববিদ্যালয় ও প্রতিষ্ঠানের জন্য', href: '/for-institutions' },
      { label: 'সহায়তা কেন্দ্র', href: '/help' },
      { label: 'লগইন', href: '/sign-in' },
    ],
    brandLabel: brand.nameBn,
    triggers: {
      exams: 'GRE® ও IELTS™',
      courses: 'কোর্স ও প্রস্তুতি',
      practice: 'প্র্যাকটিস ও সিমুলেটর',
      pricing: 'প্রাইসিং',
    },
    mainCta: {
      label: 'শুরু করুন',
      href: '/sign-up',
    },
    mobileMenu: {
      openLabel: 'নেভিগেশন মেনু খুলুন',
      closeLabel: 'নেভিগেশন মেনু বন্ধ করুন',
      languageLabel: 'ভাষা',
    },
    megaGreIelts: {
      categories: [
        {
          id: 'gre-general',
          label: '০১. GRE® জেনারেল টেস্ট',
          links: [
            {
              title: 'GRE® ফরম্যাট ও পরিচিতি',
              description: '১ ঘণ্টা ৫৮ মিনিটের অ্যাডাপ্টিভ পরীক্ষার কাঠামো জানুন।',
              href: '/gre#overview',
            },
            {
              title: 'সেকশন-অ্যাডাপ্টিভ কোয়ান্ট ও ভার্বাল',
              description: 'কোয়ান্টিটেটিভ কম্পারিজন এবং ভার্বাল রিজনিং সেকশন।',
              href: '/gre#question-families',
            },
            {
              title: 'অ্যানালিটিক্যাল রাইটিং (AWA) রুব্রিক',
              description: '৩০ মিনিটের অ্যানালাইজ অ্যান ইস্যু প্রবন্ধের মূল্যায়ন।',
              href: '/gre#awa-rubric',
            },
            {
              title: '১ ঘঃ ৫৮ মিঃ সময়সূচি ও স্কোরিং',
              description: '১৩০–১৭০ সেকশন স্কেলিং ও অ্যাডাপ্টিভ রাউটিং।',
              href: '/gre#structure-scoring',
            },
            {
              title: '১৫ মিনিটের অ্যাডাপ্টিভ GRE ডায়াগনস্টিক',
              description: 'আপনার প্রাথমিক ভার্বাল ও কোয়ান্ট স্কোর যাচাই করুন।',
              href: '/exam/diagnostic',
            },
            {
              title: 'GRE® প্রস্তুতি কোর্স ও স্টাডি প্ল্যান',
              description: '৮ সপ্তাহ ও ১২ সপ্তাহের গোছানো স্টাডি ট্র্যাক।',
              href: '/courses?track=gre',
            },
          ],
        },
        {
          id: 'ielts-academic',
          label: '০২. IELTS™ একাডেমিক',
          links: [
            {
              title: 'IELTS™ একাডেমিক পরিচিতি',
              description: 'যুক্তরাজ্য, কানাডা ও অস্ট্রেলিয়ায় উচ্চশিক্ষার প্রস্তুতি।',
              href: '/ielts?module=academic#overview',
            },
            {
              title: '৪টি স্কিলের ফরম্যাট ও সময়সূচি',
              description: 'লিসেনিং, একাডেমিক রিডিং, রাইটিং ও স্পিকিং।',
              href: '/ielts?module=academic#paper-breakdown',
            },
            {
              title: 'CD-IELTS স্প্লিট-স্ক্রিন ওয়ার্কবেঞ্চ',
              description: 'অফিশিয়াল কম্পিউটার-ডেলিভার্ড লেআউটে অনুশীলন করুন।',
              href: '/exam/ielts-preview',
            },
            {
              title: 'একাডেমিক রাইটিং টাস্ক ১ ও ২ রুব্রিক',
              description: 'ব্যান্ড ডিস্ক্রিপ্টর, চার্ট বিশ্লেষণ এবং প্রবন্ধ মূল্যায়ন।',
              href: '/ielts?module=academic#skill-workbenches',
            },
            {
              title: 'CD-IELTS টাইপিং স্পিড স্টুডিও',
              description: 'নেট WPM এবং ৪০০-শব্দের সিডি-আইইএলটিএস গতি যাচাই।',
              href: '/tools/ielts-typing-test',
            },
            {
              title: 'IELTS™ একাডেমিক টিউশন প্ল্যান',
              description: 'প্রতিটি প্ল্যানে মূসক ৬.৩ ভ্যাট চালান অন্তর্ভুক্ত।',
              href: '/courses?track=ielts-academic',
            },
          ],
        },
        {
          id: 'ielts-gt',
          label: '০৩. IELTS™ জেনারেল ট্রেনিং',
          links: [
            {
              title: 'জেনারেল ট্রেনিং পরিচিতি (অভিবাসন ও চাকরি)',
              description: 'মাইগ্রেশন ও ওয়ার্ক ভিসার জন্য বিশেষায়িত প্রস্তুতি।',
              href: '/ielts?module=gt#academic-vs-gt',
            },
            {
              title: 'GT টাস্ক ১ লেটার ও ওয়ার্কপ্লেস রিডিং',
              description: 'GT রিডিং ও রাইটিংয়ের লক্ষ্যভিত্তিক অনুশীলন।',
              href: '/ielts?module=gt#skill-workbenches',
            },
            {
              title: 'সিঙ্গেল-প্লে লিসেনিং অডিও স্টুডিও',
              description: 'প্রকৃত সিডি-আইইএলটিএস একক-প্লে অডিও অনুশীলন।',
              href: '/exam/ielts-preview?skill=listening',
            },
            {
              title: 'IELTS™ ব্যান্ড স্কোর ক্যালকুলেটর',
              description: 'লিসেনিং ও রিডিংয়ের কাঁচা স্কোর থেকে ০–৯.০ ব্যান্ড।',
              href: '/tools/ielts-band-calculator',
            },
            {
              title: '১৫ মিনিটের ফ্রি প্রাথমিক যাচাই',
              description: '১৫ মিনিটে আপনার শুরুর GT ব্যান্ড স্কোর জানুন।',
              href: '/exam/diagnostic?track=ielts-gt',
            },
            {
              title: 'GT টিউশন ও মক বান্ডেল',
              description: 'সেলফ-পেসড ড্রিল এবং মক টেস্ট বান্ডেল।',
              href: '/courses?track=ielts-gt',
            },
          ],
        },
        {
          id: 'which-exam',
          label: '০৪. কোন পরীক্ষা আমার জন্য?',
          links: [
            {
              title: 'GRE® বনাম IELTS™ ভর্তি গাইড',
              description: 'আপনার ডিগ্রি বা ভিসা অনুযায়ী সঠিক পরীক্ষা বেছে নিন।',
              href: '/help#exam-comparison',
            },
            {
              title: 'GRE® স্কোর কনভার্টার ও পার্সেন্টাইল',
              description: '১৩০–১৭০ সেকশন স্কোর ও গ্লোবাল পার্সেন্টাইল হিসাব।',
              href: '/tools/gre-score-calculator',
            },
            {
              title: 'সকল প্রস্তুতি কোর্স তুলনা করুন',
              description: 'সকল GRE® ও IELTS™ ব্যাচ ও ট্র্যাক দেখুন।',
              href: '/courses',
            },
            {
              title: 'স্বচ্ছ টাকা ও USD প্রাইসিং',
              description: 'বিকাশ কিস্তিসহ বিডিটি ও আন্তর্জাতিক প্ল্যান দেখুন।',
              href: '/pricing',
            },
            {
              title: 'বিশ্ববিদ্যালয় ও কর্পোরেট ব্যাচ',
              description: 'বিশ্ববিদ্যালয় ও প্রতিষ্ঠানের জন্য সিট লাইসেন্সিং।',
              href: '/for-institutions',
            },
            {
              title: 'স্কলার ওয়ার্কস্পেস ও স্টাডি প্ল্যান',
              description: 'আপনার ব্যক্তিগত স্টাডি ড্যাশবোর্ড ও রুটিন খুলুন।',
              href: '/app',
            },
          ],
        },
      ],
      conversionStrip: [
        { label: 'প্রস্তুতি কোর্স দেখুন', href: '/courses' },
        { label: 'ফ্রি ডায়াগনস্টিক দিন', href: '/exam/diagnostic' },
      ],
    },
    megaCourses: {
      col1Title: `${brand.shortName}-এর সাথে প্রস্তুতি`,
      col1Body:
        'বাংলা ও ইংরেজি ব্যাখ্যা, স্পেসড-রিপিটিশন ভোকাবুলারি এবং বাস্তব কম্পিউটার-ভিত্তিক মক পরীক্ষার মাধ্যমে GRE® ও IELTS™-এ দক্ষতা অর্জন করুন।',
      col2Heading: 'কোর্স ও প্যাকেজসমূহ',
      col2Links: [
        { label: 'সকল প্রস্তুতি কোর্স', href: '/courses' },
        { label: 'সেলফ-পেসড ফাউন্ডেশন', href: '/courses?filter=self-paced' },
        { label: 'লাইভ ও ইনস্ট্রাক্টর ব্যাচ', href: '/courses?filter=live' },
        { label: 'মক ও এআই ক্রেডিট বান্ডেল', href: '/courses?filter=mocks' },
        { label: 'বিশ্ববিদ্যালয় ও প্রতিষ্ঠানের জন্য', href: '/for-institutions' },
      ],
      ribbonLabel: 'মূল বিষয়গুলো দেখুন',
      ribbonLinks: [
        { label: 'GRE® কোয়ান্ট ও ভার্বাল', href: '/gre' },
        { label: 'IELTS™ একাডেমিক', href: '/ielts?module=academic#overview' },
        { label: 'IELTS™ জেনারেল ট্রেনিং', href: '/ielts?module=gt#academic-vs-gt' },
        { label: 'বিকাশ ০% কিস্তি ও পাস', href: '/pricing#mock-passes' },
      ],
      ribbonCta: {
        label: '১৫ মিনিটের ফ্রি ডায়াগনস্টিক দিন',
        href: '/exam/diagnostic',
      },
    },
    megaPractice: {
      heading: 'প্র্যাকটিস ও এক্সাম সিমুলেটর',
      links: [
        {
          title: '১৫ মিনিটের এক্সপ্রেস ডায়াগনস্টিক',
          description: 'GRE® বা IELTS™ প্রস্তুতির দ্রুত প্রাথমিক যাচাই।',
          href: '/exam/diagnostic',
        },
        {
          title: 'CD-IELTS স্প্লিট-স্ক্রিন সিমুলেটর',
          description: 'কম্পিউটার-ডেলিভার্ড রিডিং ও রাইটিংয়ের বাস্তব অনুশীলন।',
          href: '/exam/ielts-preview',
        },
        {
          title: 'IELTS টাইপিং স্পিড টেস্ট',
          description: 'নেট WPM, নির্ভুলতা ও ৪০০-শব্দের সিডি-আইইএলটিএস গতি যাচাই করুন।',
          href: '/tools/ielts-typing-test',
        },
        {
          title: 'GRE® স্কোর ও পার্সেন্টাইল ক্যালকুলেটর',
          description: '১৩০–১৭০ সেকশন স্কোর ও গ্লোবাল পার্সেন্টাইল হিসাব করুন।',
          href: '/tools/gre-score-calculator',
        },
        {
          title: 'IELTS™ ব্যান্ড স্কোর ক্যালকুলেটর',
          description: '৪টি স্কিলের ফলাফল থেকে ০–৯.০ ব্যান্ড স্কোর জানুন।',
          href: '/tools/ielts-band-calculator',
        },
      ],
    },
    footer: {
      columns: [
        {
          heading: 'কারিকুলাম',
          links: [
            { label: 'GRE® কম্পিউটার-ভিত্তিক প্রস্তুতি', href: '/gre' },
            { label: 'IELTS™ একাডেমিক ও জেনারেল', href: '/ielts' },
            { label: 'IELTS টাইপিং স্পিড টেস্ট', href: '/tools/ielts-typing-test' },
            { label: 'অ্যাক্টিভ-রিকল ভোকাবুলারি', href: '/gre#vocab' },
            { label: '১৫ মিনিটের ফ্রি ডায়াগনস্টিক', href: '/exam/diagnostic' },
          ],
        },
        {
          heading: 'প্ল্যাটফর্ম',
          links: [
            { label: 'সকল কোর্স', href: '/courses' },
            { label: 'প্রাইসিং ও প্ল্যান', href: '/pricing' },
            { label: 'সহায়তা কেন্দ্র', href: '/help' },
            { label: 'বিশ্ববিদ্যালয় ও প্রতিষ্ঠানের জন্য', href: '/for-institutions' },
          ],
        },
        {
          heading: 'আইনি ও নীতিমালা',
          links: [
            { label: 'ব্যবহারের শর্তাবলি', href: '/legal/terms' },
            { label: 'গোপনীয়তা নীতি', href: '/legal/privacy' },
            { label: 'রিফান্ড নীতি', href: '/legal/refund-policy' },
            { label: 'অভিযোগ নিষ্পত্তি', href: '/legal/grievance' },
          ],
        },
        {
          heading: 'যোগাযোগ',
          links: [
            { label: 'ঢাকা, বাংলাদেশ' },
            { label: brand.supportEmail, isEmail: true },
            { label: 'মূসক ৬.৩ ভ্যাট চালান অন্তর্ভুক্ত' },
          ],
        },
      ],
      disclaimerP1:
        'GRE® হলো Educational Testing Service (ETS)-এর নিবন্ধিত ট্রেডমার্ক। IELTS™ হলো University of Cambridge, British Council এবং IDP Education Australia-এর নিবন্ধিত ট্রেডমার্ক।',
      disclaimerP2: `${brand.nameBn} একটি স্বাধীন প্রস্তুতিমূলক প্ল্যাটফর্ম এবং ETS, British Council, IDP Education বা Cambridge University Press & Assessment-এর সাথে সম্পর্কিত বা অনুমোদিত নয়। সকল অনুশীলন স্কোর আনুমানিক।`,
      copyright: `© ${new Date().getFullYear()} ${brand.legalName} সর্বস্বত্ব সংরক্ষিত।`,
    },
  },
};
