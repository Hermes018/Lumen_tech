/** @purpose Named media slot registry with verified open-source Unsplash photography and bilingual alt/caption metadata */
import { brand } from '@lumen/config';

export type MediaSlotId =
  | 'hero-home'
  | 'hero-gre'
  | 'hero-ielts'
  | 'hero-courses'
  | 'hero-pricing'
  | 'hero-help'
  | 'track-gre'
  | 'track-ielts-ac'
  | 'track-ielts-gt'
  | 'dest-usa'
  | 'dest-uk'
  | 'dest-canada'
  | 'dest-australia'
  | 'split-diagnostic'
  | 'mega-courses'
  | 'split-gre-adaptive'
  | 'split-gre-hints'
  | 'split-ielts-cbt'
  | 'split-ielts-rubric'
  | 'col-gre-quant'
  | 'col-gre-verbal'
  | 'col-ielts-writing'
  | 'col-ielts-speaking'
  | 'col-inst-cohort';

export type PhotoSlot = MediaSlotId;

export interface MediaSlotEntry {
  altEn: string;
  altBn: string;
  src: string;
  themeColor: string;
  captionEn: string;
  captionBn: string;
}

export const MEDIA_SLOTS: Record<MediaSlotId, MediaSlotEntry> = {
  'hero-home': {
    altEn: `${brand.name} computer-based GRE and IELTS preparation workspace`,
    altBn: 'লুমেন একাডেমির কম্পিউটার-ভিত্তিক জিআরই ও আইইএলটিএস প্রস্তুতির কর্মক্ষেত্র',
    src: '/images/hero-home.webp',
    themeColor: 'var(--brand)',
    captionEn: 'Full-length adaptive GRE and 4-skill IELTS mock workbench.',
    captionBn: 'পূর্ণাঙ্গ অ্যাডাপটিভ জিআরই ও ৪-স্কিল আইইএলটিএস মক ওয়ার্কবেঞ্চ।',
  },
  'hero-gre': {
    altEn: 'Computer-delivered GRE adaptive section interface illustration',
    altBn: 'কম্পিউটার-ভিত্তিক জিআরই অ্যাডাপটিভ সেকশন ইন্টারফেস',
    src: '/images/hero-gre.webp',
    themeColor: 'var(--terracotta)',
    captionEn: 'Section-adaptive GRE practice matching the 1h 58m format.',
    captionBn: '১ ঘণ্টা ৫৮ মিনিটের আদলে সেকশন-অ্যাডাপটিভ জিআরই অনুশীলন।',
  },
  'hero-ielts': {
    altEn: 'Computer-delivered IELTS Academic and General Training 4-skill interface',
    altBn: 'কম্পিউটার-ভিত্তিক আইইএলটিএস একাডেমিক ও জেনারেল ট্রেনিং ৪-স্কিল ইন্টারফেস',
    src: '/images/hero-ielts.webp',
    themeColor: 'var(--crimson)',
    captionEn: 'Split-pane Reading, Listening, Writing, and Speaking evaluation.',
    captionBn: 'স্প্লিট-পেইন রিডিং, লিসেনিং, রাইটিং ও স্পিকিং মূল্যায়ন।',
  },
  'hero-courses': {
    altEn: 'Structured GRE and IELTS course tracks for Bangladesh learners',
    altBn: 'বাংলাদেশের শিক্ষার্থীদের জন্য সুগঠিত জিআরই ও আইইএলটিএস কোর্স ট্র্যাক',
    src: '/images/hero-courses.webp',
    themeColor: 'var(--brand)',
    captionEn: 'Guided video lessons, item banks, and full-length mock exams.',
    captionBn: 'ভিডিও পাঠ, প্রশ্ন ব্যাংক ও পূর্ণাঙ্গ মক পরীক্ষা।',
  },
  'hero-pricing': {
    altEn: 'Transparent BDT tuition plans with official 15 percent VAT invoice',
    altBn: 'অফিসিয়াল ১৫ শতাংশ ভ্যাট চালানসহ স্বচ্ছ টাকায় টিউশন প্ল্যান',
    src: '/images/hero-pricing.webp',
    themeColor: 'var(--brand)',
    captionEn: 'One-time enrollment in BDT with Mushak 6.3 VAT invoice.',
    captionBn: 'মুসক ৬.৩ ভ্যাট চালানসহ এককালীন টাকায় এনরোলমেন্ট।',
  },
  'hero-help': {
    altEn: `${brand.name} learner support and exam day guidance center`,
    altBn: 'লুমেন একাডেমির শিক্ষার্থী সহায়তা ও পরীক্ষা নির্দেশনা কেন্দ্র',
    src: '/images/hero-help.webp',
    themeColor: 'var(--crimson)',
    captionEn: 'Clear answers on mocks, bKash/card checkout, and score reviews.',
    captionBn: 'মক পরীক্ষা, বিকাশ/কার্ড পেমেন্ট ও স্কোর রিভিউ সংক্রান্ত সহায়তা।',
  },
  'track-gre': {
    altEn: 'GRE Verbal, Quantitative Reasoning, and AWA preparation track',
    altBn: 'জিআরই ভার্বাল, কোয়ান্টিটেটিভ রিজনিং ও এডব্লিউএ প্রস্তুতি ট্র্যাক',
    src: '/images/track-gre.webp',
    themeColor: 'var(--terracotta)',
    captionEn: 'Quantitative & Verbal drills with 1,500+ FSRS vocabulary cards.',
    captionBn: '১,৫০০+ এফএসআরএস ভোক্যাব কার্ডসহ কোয়ান্ট ও ভার্বাল অনুশীলন।',
  },
  'track-ielts-ac': {
    altEn: 'IELTS Academic mock exam and band rubric feedback track',
    altBn: 'আইইএলটিএস একাডেমিক মক পরীক্ষা ও ব্যান্ড রুব্রিক ফিডব্যাক ট্র্যাক',
    src: '/images/track-ielts-ac.webp',
    themeColor: 'var(--crimson)',
    captionEn: 'Academic Reading, Task 1 data charts, Task 2 essays, and Speaking.',
    captionBn: 'একাডেমিক রিডিং, টাস্ক ১ চার্ট, টাস্ক ২ এসে ও স্পিকিং।',
  },
  'track-ielts-gt': {
    altEn: 'IELTS General Training mock exam and CLB 9 preparation track',
    altBn: 'আইইএলটিএস জেনারেল ট্রেনিং মক পরীক্ষা ও সিএলবি ৯ প্রস্তুতি ট্র্যাক',
    src: '/images/track-ielts-gt.webp',
    themeColor: 'var(--accent)',
    captionEn: 'Workforce Reading passages and Task 1 formal/semi-formal letters.',
    captionBn: 'কর্মক্ষেত্রভিত্তিক রিডিং প্যাসেজ ও টাস্ক ১ লেটার রাইটিং।',
  },
  'dest-usa': {
    altEn: 'United States graduate admissions GRE and IELTS score planning',
    altBn: 'যুক্তরাষ্ট্রের স্নাতকোত্তর ভর্তির জন্য জিআরই ও আইইএলটিএস স্কোর পরিকল্পনা',
    src: '/images/dest-usa.webp',
    themeColor: 'var(--brand)',
    captionEn: 'GRE + IELTS benchmarks for US MS and PhD programs.',
    captionBn: 'যুক্তরাষ্ট্রের এমএস ও পিএইচডি প্রোগ্রামের জন্য জিআরই + আইইএলটিএস।',
  },
  'dest-uk': {
    altEn: 'United Kingdom university admissions IELTS Academic preparation',
    altBn: 'যুক্তরাজ্যের বিশ্ববিদ্যালয়ে ভর্তির জন্য আইইএলটিএস একাডেমিক প্রস্তুতি',
    src: '/images/dest-uk.webp',
    themeColor: 'var(--crimson)',
    captionEn: 'Academic IELTS band targets for UK Russell Group degrees.',
    captionBn: 'যুক্তরাজ্যের বিশ্ববিদ্যালয়ের জন্য একাডেমিক আইইএলটিএস ব্যান্ড লক্ষ্য।',
  },
  'dest-canada': {
    altEn: 'Canada graduate study and Express Entry IELTS preparation',
    altBn: 'কানাডায় উচ্চশিক্ষা ও এক্সপ্রেস এন্ট্রির জন্য আইইএলটিএস প্রস্তুতি',
    src: '/images/dest-canada.webp',
    themeColor: 'var(--crimson)',
    captionEn: 'IELTS Academic for study permits and General Training for CLB 9+.',
    captionBn: 'স্টাডি পারমিটের জন্য একাডেমিক ও সিএলবি ৯+-এর জন্য জেনারেল ট্রেনিং।',
  },
  'dest-australia': {
    altEn: 'Australia higher education IELTS Academic preparation',
    altBn: 'অস্ট্রেলিয়ায় উচ্চশিক্ষার জন্য আইইএলটিএস একাডেমিক প্রস্তুতি',
    src: '/images/dest-australia.webp',
    themeColor: 'var(--accent)',
    captionEn: '4-skill computer-delivered IELTS readiness for Australian campuses.',
    captionBn: 'অস্ট্রেলিয়ার বিশ্ববিদ্যালয়ের জন্য ৪-স্কিল সিবিটি আইইএলটিএস প্রস্তুতি।',
  },
  'split-diagnostic': {
    altEn: 'Free 20-minute baseline diagnostic assessment preview',
    altBn: 'বিনামূল্যে ২০ মিনিটের বেসলাইন ডায়াগনস্টিক মূল্যায়নের প্রিভিউ',
    src: '/images/split-diagnostic.webp',
    themeColor: 'var(--brand)',
    captionEn: 'Measure your starting band or GRE baseline before enrolling.',
    captionBn: 'এনরোল করার আগে আপনার বর্তমান ব্যান্ড বা জিআরই বেসলাইন যাচাই করুন।',
  },
  'mega-courses': {
    altEn: `${brand.name} flagship GRE and IELTS curriculum overview`,
    altBn: 'লুমেন একাডেমির ফ্ল্যাগশিপ জিআরই ও আইইএলটিএস পাঠ্যক্রম',
    src: '/images/mega-courses.webp',
    themeColor: 'var(--brand)',
    captionEn: 'Explore GRE, IELTS Academic, and General Training tracks.',
    captionBn: 'জিআরই, আইইএলটিএস একাডেমিক ও জেনারেল ট্রেনিং ট্র্যাক দেখুন।',
  },
  'split-gre-adaptive': {
    altEn: 'Section-adaptive GRE Quantitative and Verbal testing interface',
    altBn: 'সেকশন-অ্যাডাপ্টিভ জিআরই কোয়ান্টিটেটিভ ও ভার্বাল টেস্টিং ইন্টারফেস',
    src: '/images/split-gre-adaptive.webp',
    themeColor: 'var(--terracotta)',
    captionEn: 'ETS-faithful Section 1 to Section 2 difficulty routing.',
    captionBn: 'সেকশন ১ থেকে সেকশন ২-এ অফিসিয়াল অ্যাডাপ্টিভ রাউটিং।',
  },
  'split-gre-hints': {
    altEn: 'Progressive three-tier Socratic GRE hint guidance workspace',
    altBn: 'তিন-স্তরের সোক্রেটিক জিআরই হিন্ট গাইডেন্স ওয়ার্কস্পেস',
    src: '/images/split-gre-hints.webp',
    themeColor: 'var(--accent-blue)',
    captionEn: 'Step-by-step conceptual nudges before full worked solutions.',
    captionBn: 'পূর্ণ সমাধানের আগে ধাপে ধাপে ধারণাগত হিন্ট।',
  },
  'split-ielts-cbt': {
    altEn: 'Computer-delivered IELTS four-skill split-pane simulator',
    altBn: 'কম্পিউটার-ভিত্তিক আইইএলটিএস ৪-স্কিল স্প্লিট-পেইন সিমুলেটর',
    src: '/images/split-ielts-cbt.webp',
    themeColor: 'var(--crimson)',
    captionEn: 'Split-pane Reading passages, single-play Listening, and timed Writing.',
    captionBn: 'স্প্লিট-পেইন রিডিং, সিঙ্গেল-প্লে লিসেনিং এবং টাইমড রাইটিং।',
  },
  'split-ielts-rubric': {
    altEn: 'Line-by-line IELTS Writing and Speaking four-criterion rubric feedback',
    altBn: 'লাইন-বাই-লাইন আইইএলটিএস রাইটিং ও স্পিকিং ৪-মানদণ্ড রুব্রিক ফিডব্যাক',
    src: '/images/split-ielts-rubric.webp',
    themeColor: 'var(--brand)',
    captionEn: 'Criterion-by-criterion Band 7.5+ evaluation and rewrite guidance.',
    captionBn: 'ব্যান্ড ৭.৫+ মানদণ্ড অনুযায়ী বিশ্লেষণ ও সংশোধন নির্দেশিকা।',
  },
  'col-gre-quant': {
    altEn: 'GRE Quantitative Comparison and Data Interpretation problem clinic',
    altBn: 'জিআরই কোয়ান্টিটেটিভ কম্প্যারিজন ও ডেটা ইন্টারপ্রিটেশন অনুশীলন',
    src: '/images/col-gre-quant.webp',
    themeColor: 'var(--terracotta)',
    captionEn: 'Boundary testing and algebraic trap elimination drills.',
    captionBn: 'বীজগণিত ও জ্যামিতিক ফাঁদ এড়ানোর বিশেষ অনুশীলন।',
  },
  'col-gre-verbal': {
    altEn: 'GRE Text Completion, Sentence Equivalence, and FSRS vocabulary study',
    altBn: 'জিআরই টেক্সট কমপ্লিশন, সেন্টেন্স ইকুইভ্যালেন্স ও এফএসআরএস ভোকাবুলারি',
    src: '/images/col-gre-verbal.webp',
    themeColor: 'var(--crimson)',
    captionEn: 'Contrast pivots and bilingual spaced-repetition vocabulary cards.',
    captionBn: 'কনট্রাস্ট পিভট ও দ্বিভাষিক স্পেসড-রিপিটিশন ভোকাব কার্ড।',
  },
  'col-ielts-writing': {
    altEn: 'IELTS Writing Task 1 data report and Task 2 discursive essay lab',
    altBn: 'আইইএলটিএস রাইটিং টাস্ক ১ ডেটা রিপোর্ট ও টাস্ক ২ প্রবন্ধ ল্যাব',
    src: '/images/col-ielts-writing.webp',
    themeColor: 'var(--terracotta)',
    captionEn: 'Live word counts and Band 8.0 coherence structure coaching.',
    captionBn: 'লাইভ শব্দ গণনা ও ব্যান্ড ৮.০ কাঠামোগত কোচিং।',
  },
  'col-ielts-speaking': {
    altEn: 'IELTS Speaking Part 1 to Part 3 cue card practice studio',
    altBn: 'আইইএলটিএস স্পিকিং পার্ট ১ থেকে ৩ কিউ কার্ড প্র্যাকটিস স্টুডিও',
    src: '/images/col-ielts-speaking.webp',
    themeColor: 'var(--accent)',
    captionEn: '1-minute cue card timer and lexical upgrading feedback.',
    captionBn: '১-মিনিটের কিউ কার্ড টাইমার ও লেক্সিক্যাল ফিডব্যাক।',
  },
  'col-inst-cohort': {
    altEn: 'Dhaka live cohort and university institutional preparation seminar',
    altBn: 'ঢাকা লাইভ কোহর্ট ও প্রাতিষ্ঠানিক প্রস্তুতি সেমিনার',
    src: '/images/col-inst-cohort.webp',
    themeColor: 'var(--brand-deep)',
    captionEn: 'Instructor-led evening cohorts and campus diagnostic analytics.',
    captionBn: 'ইন্সট্রাক্টর-চালিত সান্ধ্য কোহর্ট ও ক্যাম্পাস ডায়াগনস্টিক অ্যানালিটিক্স।',
  },
};

export const MEDIA_MANIFEST = MEDIA_SLOTS;
