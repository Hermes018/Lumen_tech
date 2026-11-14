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
              title: 'GRE® Overview',
              description: 'Understand the 1h 58m adaptive test structure.',
              href: '/gre',
            },
            {
              title: 'Test Format & Sections',
              description: 'Analytical Writing, Verbal, and Quantitative timing.',
              href: '/gre#format',
            },
            {
              title: 'Quantitative Sample Drills',
              description: 'Try interactive GRE math problems with step solutions.',
              href: '/gre#sample',
            },
            {
              title: '15-Min GRE Diagnostic',
              description: 'Estimate your baseline Verbal and Quant score.',
              href: '/exam/diagnostic',
            },
            {
              title: 'GRE® Prep Courses',
              description: 'Structured 8-week and 12-week study tracks.',
              href: '/courses',
            },
            {
              title: 'GRE® Pricing & Plans',
              description: 'Transparent BDT pricing with bKash split-pay.',
              href: '/pricing',
            },
          ],
        },
        {
          id: 'ielts-academic',
          label: '02. IELTS™ Academic',
          links: [
            {
              title: 'IELTS™ Academic Guide',
              description: 'University admission prep for UK, Canada, and Australia.',
              href: '/ielts',
            },
            {
              title: '4-Skill Format Breakdown',
              description: 'Listening, Academic Reading, Writing, and Speaking.',
              href: '/ielts#format',
            },
            {
              title: 'CD-IELTS Split-Screen Preview',
              description: 'Practice in an official computer-delivered test layout.',
              href: '/exam/ielts-preview',
            },
            {
              title: '15-Min IELTS Diagnostic',
              description: 'Check your current estimated band score.',
              href: '/exam/diagnostic',
            },
            {
              title: 'Academic Prep Track',
              description: 'Writing Task 1 & 2 rubrics with speaking feedback.',
              href: '/courses',
            },
            {
              title: 'IELTS™ Plans & VAT Invoice',
              description: 'All plans include official Mushak 6.3 VAT receipts.',
              href: '/pricing',
            },
          ],
        },
        {
          id: 'ielts-gt',
          label: '03. IELTS™ General Training',
          links: [
            {
              title: 'General Training Overview',
              description: 'Focused prep for migration and work visas.',
              href: '/ielts',
            },
            {
              title: 'Task 1 Letter & Workplace Reading',
              description: 'Targeted drills for GT Reading and Writing.',
              href: '/ielts#format',
            },
            {
              title: 'Computer-Delivered Simulator',
              description: 'Timed split-screen Reading and Writing practice.',
              href: '/exam/ielts-preview',
            },
            {
              title: 'Free Baseline Check',
              description: 'Gauge your starting band in 15 minutes.',
              href: '/exam/diagnostic',
            },
            {
              title: 'GT Study Packages',
              description: 'Self-paced drills plus mock test bundles.',
              href: '/courses',
            },
            {
              title: 'Compare Study Plans',
              description: 'Pick single-exam or All-Access pass.',
              href: '/pricing',
            },
          ],
        },
        {
          id: 'which-exam',
          label: '04. Which Exam Do I Need?',
          links: [
            {
              title: 'GRE® vs. IELTS™ Guide',
              description: 'Match your target degree or visa to the right test.',
              href: '/courses',
            },
            {
              title: 'US & Grad School Admissions',
              description: 'Why STEM and MBA programs still value GRE®.',
              href: '/gre',
            },
            {
              title: 'UK, Canada & Australia',
              description: 'Band requirements for study and skilled migration.',
              href: '/ielts',
            },
            {
              title: 'Take the 15-Min Diagnostic',
              description: 'See where you stand before choosing a plan.',
              href: '/exam/diagnostic',
            },
            {
              title: 'All-Access Dual Pass',
              description: 'Combine GRE® and IELTS™ prep in one subscription.',
              href: '/pricing',
            },
            {
              title: 'Talk to Student Support',
              description: 'Read FAQs or reach our Dhaka support team.',
              href: '/help',
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
        { label: 'Plans & BDT Pricing', href: '/pricing' },
        { label: 'GRE® Quantitative & Verbal', href: '/gre' },
        { label: 'IELTS™ Academic & General', href: '/ielts' },
        { label: 'For Universities & Schools', href: '/for-institutions' },
      ],
      ribbonLabel: 'Explore key areas',
      ribbonLinks: [
        { label: 'GRE® Quant & Verbal', href: '/gre' },
        { label: 'IELTS™ Academic', href: '/ielts' },
        { label: 'IELTS™ General Training', href: '/ielts#format' },
        { label: 'bKash 0% Split-Pay', href: '/pricing' },
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
          title: 'GRE® Quantitative Workbench',
          description: 'Interactive quantitative comparison and problem-solving drills.',
          href: '/gre#sample',
        },
        {
          title: 'Score & Band Calculators',
          description: 'Understand section scaling and target band benchmarks.',
          href: '/ielts#format',
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
              title: 'GRE® পরিচিতি',
              description: '১ ঘণ্টা ৫৮ মিনিটের অ্যাডাপ্টিভ পরীক্ষার কাঠামো জানুন।',
              href: '/gre',
            },
            {
              title: 'পরীক্ষার ফরম্যাট ও সেকশন',
              description: 'অ্যানালিটিক্যাল রাইটিং, ভার্বাল ও কোয়ান্টিটেটিভ সময়সূচি।',
              href: '/gre#format',
            },
            {
              title: 'কোয়ান্টিটেটিভ স্যাম্পল ড্রিল',
              description: 'ধাপে ধাপে সমাধানসহ GRE গণিত অনুশীলন করুন।',
              href: '/gre#sample',
            },
            {
              title: '১৫ মিনিটের GRE ডায়াগনস্টিক',
              description: 'আপনার প্রাথমিক ভার্বাল ও কোয়ান্ট স্কোর যাচাই করুন।',
              href: '/exam/diagnostic',
            },
            {
              title: 'GRE® প্রস্তুতি কোর্স',
              description: '৮ সপ্তাহ ও ১২ সপ্তাহের গোছানো স্টাডি ট্র্যাক।',
              href: '/courses',
            },
            {
              title: 'GRE® ফি ও প্ল্যান',
              description: 'বিকাশ কিস্তিসহ স্বচ্ছ টাকায় প্রাইসিং।',
              href: '/pricing',
            },
          ],
        },
        {
          id: 'ielts-academic',
          label: '০২. IELTS™ একাডেমিক',
          links: [
            {
              title: 'IELTS™ একাডেমিক গাইড',
              description: 'যুক্তরাজ্য, কানাডা ও অস্ট্রেলিয়ায় উচ্চশিক্ষার প্রস্তুতি।',
              href: '/ielts',
            },
            {
              title: '৪টি স্কিলের বিস্তারিত',
              description: 'লিসেনিং, একাডেমিক রিডিং, রাইটিং ও স্পিকিং।',
              href: '/ielts#format',
            },
            {
              title: 'CD-IELTS স্প্লিট-স্ক্রিন প্রিভিউ',
              description: 'অফিশিয়াল কম্পিউটার-ডেলিভার্ড লেআউটে অনুশীলন করুন।',
              href: '/exam/ielts-preview',
            },
            {
              title: '১৫ মিনিটের IELTS ডায়াগনস্টিক',
              description: 'আপনার বর্তমান আনুমানিক ব্যান্ড স্কোর দেখুন।',
              href: '/exam/diagnostic',
            },
            {
              title: 'একাডেমিক প্রস্তুতি ট্র্যাক',
              description: 'রাইটিং টাস্ক ১ ও ২ রুব্রিক এবং স্পিকিং ফিডব্যাক।',
              href: '/courses',
            },
            {
              title: 'IELTS™ প্ল্যান ও ভ্যাট চালান',
              description: 'প্রতিটি প্ল্যানে মূসক ৬.৩ ভ্যাট চালান অন্তর্ভুক্ত।',
              href: '/pricing',
            },
          ],
        },
        {
          id: 'ielts-gt',
          label: '০৩. IELTS™ জেনারেল ট্রেনিং',
          links: [
            {
              title: 'জেনারেল ট্রেনিং পরিচিতি',
              description: 'মাইগ্রেশন ও ওয়ার্ক ভিসার জন্য বিশেষায়িত প্রস্তুতি।',
              href: '/ielts',
            },
            {
              title: 'টাস্ক ১ লেটার ও রিডিং',
              description: 'GT রিডিং ও রাইটিংয়ের লক্ষ্যভিত্তিক অনুশীলন।',
              href: '/ielts#format',
            },
            {
              title: 'কম্পিউটার-ডেলিভার্ড সিমুলেটর',
              description: 'সময়সীমাবদ্ধ স্প্লিট-স্ক্রিন রিডিং ও রাইটিং অনুশীলন।',
              href: '/exam/ielts-preview',
            },
            {
              title: 'ফ্রি প্রাথমিক যাচাই',
              description: '১৫ মিনিটে আপনার শুরুর ব্যান্ড স্কোর জানুন।',
              href: '/exam/diagnostic',
            },
            {
              title: 'GT স্টাডি প্যাকেজ',
              description: 'সেলফ-পেসড ড্রিল এবং মক টেস্ট বান্ডেল।',
              href: '/courses',
            },
            {
              title: 'স্টাডি প্ল্যান তুলনা করুন',
              description: 'সিঙ্গেল-এক্সাম বা অল-অ্যাক্সেস পাস বেছে নিন।',
              href: '/pricing',
            },
          ],
        },
        {
          id: 'which-exam',
          label: '০৪. কোন পরীক্ষা আমার জন্য?',
          links: [
            {
              title: 'GRE® বনাম IELTS™ গাইড',
              description: 'আপনার ডিগ্রি বা ভিসা অনুযায়ী সঠিক পরীক্ষা বেছে নিন।',
              href: '/courses',
            },
            {
              title: 'যুক্তরাষ্ট্র ও গ্র্যাজুয়েট অ্যাডমিশন',
              description: 'STEM ও MBA প্রোগ্রামে GRE® কেন গুরুত্বপূর্ণ।',
              href: '/gre',
            },
            {
              title: 'যুক্তরাজ্য, কানাডা ও অস্ট্রেলিয়া',
              description: 'উচ্চশিক্ষা ও দক্ষ অভিবাসনের ব্যান্ড চাহিদা।',
              href: '/ielts',
            },
            {
              title: '১৫ মিনিটের ডায়াগনস্টিক দিন',
              description: 'প্ল্যান নেওয়ার আগে নিজের অবস্থান যাচাই করুন।',
              href: '/exam/diagnostic',
            },
            {
              title: 'অল-অ্যাক্সেস ডুয়াল পাস',
              description: 'এক সাবস্ক্রিপশনে GRE® ও IELTS™ উভয় প্রস্তুতি।',
              href: '/pricing',
            },
            {
              title: 'স্টুডেন্ট সাপোর্টে কথা বলুন',
              description: 'সাধারণ প্রশ্ন পড়ুন বা ঢাকা টিমের সাথে যোগাযোগ করুন।',
              href: '/help',
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
        { label: 'প্ল্যান ও টাকায় প্রাইসিং', href: '/pricing' },
        { label: 'GRE® কোয়ান্ট ও ভার্বাল', href: '/gre' },
        { label: 'IELTS™ একাডেমিক ও জেনারেল', href: '/ielts' },
        { label: 'বিশ্ববিদ্যালয় ও প্রতিষ্ঠানের জন্য', href: '/for-institutions' },
      ],
      ribbonLabel: 'মূল বিষয়গুলো দেখুন',
      ribbonLinks: [
        { label: 'GRE® কোয়ান্ট ও ভার্বাল', href: '/gre' },
        { label: 'IELTS™ একাডেমিক', href: '/ielts' },
        { label: 'IELTS™ জেনারেল ট্রেনিং', href: '/ielts#format' },
        { label: 'বিকাশ ০% কিস্তি সুবিধা', href: '/pricing' },
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
          title: 'GRE® কোয়ান্টিটেটিভ ওয়ার্কবেঞ্চ',
          description: 'ইন্টারেক্টিভ কোয়ান্টিটেটিভ ও প্রবলেম-সলভিং ড্রিল।',
          href: '/gre#sample',
        },
        {
          title: 'স্কোর ও ব্যান্ড ক্যালকুলেটর',
          description: 'সেকশন স্কেলিং ও কাঙ্ক্ষিত ব্যান্ড বেঞ্চমার্ক জানুন।',
          href: '/ielts#format',
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
