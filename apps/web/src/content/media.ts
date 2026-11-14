/** @purpose Named media slot registry with deterministic offline-safe editorial SVG artwork and bilingual alt/caption metadata */

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
  | 'mega-courses';

export interface MediaSlotEntry {
  altEn: string;
  altBn: string;
  src: string;
  themeColor: string;
  captionEn: string;
  captionBn: string;
}

function buildEditorialSvg(bg: string, primary: string, accent: string, code: string): string {
  const svg = [
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 500" width="800" height="500">`,
    `<rect width="800" height="500" fill="${bg}"/>`,
    `<rect x="48" y="48" width="704" height="404" fill="none" stroke="${primary}" stroke-width="2" stroke-opacity="0.18"/>`,
    `<rect x="88" y="96" width="240" height="16" fill="${primary}"/>`,
    `<rect x="88" y="132" width="160" height="10" fill="${primary}" fill-opacity="0.35"/>`,
    `<rect x="88" y="156" width="210" height="10" fill="${primary}" fill-opacity="0.22"/>`,
    `<rect x="88" y="210" width="280" height="180" fill="${primary}" fill-opacity="0.08"/>`,
    `<rect x="88" y="210" width="280" height="8" fill="${accent}"/>`,
    `<circle cx="576" cy="240" r="112" fill="${accent}" fill-opacity="0.22"/>`,
    `<rect x="476" y="160" width="200" height="200" fill="none" stroke="${primary}" stroke-width="4"/>`,
    `<path d="M520 310 L565 230 L605 275 L645 205" fill="none" stroke="${primary}" stroke-width="5" stroke-linecap="square"/>`,
    `<rect x="88" y="414" width="12" height="12" fill="${accent}"/>`,
    `<text x="112" y="425" font-family="ui-sans-serif, system-ui, sans-serif" font-size="16" font-weight="700" fill="${primary}" letter-spacing="1">${code}</text>`,
    `</svg>`,
  ].join('');
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const MEDIA_SLOTS: Record<MediaSlotId, MediaSlotEntry> = {
  'hero-home': {
    altEn: 'Lumen Academy computer-based GRE and IELTS preparation workspace',
    altBn: 'লুমেন একাডেমির কম্পিউটার-ভিত্তিক জিআরই ও আইইএলটিএস প্রস্তুতির কর্মক্ষেত্র',
    src: buildEditorialSvg('%23F4EFFB', '%232D006B', '%23FFB400', 'LUMEN • GRE & IELTS'),
    themeColor: 'var(--brand)',
    captionEn: 'Full-length adaptive GRE and 4-skill IELTS mock workbench.',
    captionBn: 'পূর্ণাঙ্গ অ্যাডাপটিভ জিআরই ও ৪-স্কিল আইইএলটিএস মক ওয়ার্কবেঞ্চ।',
  },
  'hero-gre': {
    altEn: 'Computer-delivered GRE adaptive section interface illustration',
    altBn: 'কম্পিউটার-ভিত্তিক জিআরই অ্যাডাপটিভ সেকশন ইন্টারফেস',
    src: buildEditorialSvg('%23F6F1EA', '%231A1038', '%23C84B31', 'GRE • 1H 58M'),
    themeColor: 'var(--terracotta)',
    captionEn: 'Section-adaptive GRE practice matching the 1h 58m format.',
    captionBn: '১ ঘণ্টা ৫৮ মিনিটের আদলে সেকশন-অ্যাডাপটিভ জিআরই অনুশীলন।',
  },
  'hero-ielts': {
    altEn: 'Computer-delivered IELTS Academic and General Training 4-skill interface',
    altBn: 'কম্পিউটার-ভিত্তিক আইইএলটিএস একাডেমিক ও জেনারেল ট্রেনিং ৪-স্কিল ইন্টারফেস',
    src: buildEditorialSvg('%23F4EFFB', '%232D006B', '%23E4002B', 'IELTS • 4 SKILLS'),
    themeColor: 'var(--crimson)',
    captionEn: 'Split-pane Reading, Listening, Writing, and Speaking evaluation.',
    captionBn: 'স্প্লিট-পেইন রিডিং, লিসেনিং, রাইটিং ও স্পিকিং মূল্যায়ন।',
  },
  'hero-courses': {
    altEn: 'Structured GRE and IELTS course tracks for Bangladesh learners',
    altBn: 'বাংলাদেশের শিক্ষার্থীদের জন্য সুগঠিত জিআরই ও আইইএলটিএস কোর্স ট্র্যাক',
    src: buildEditorialSvg('%23F4EFFB', '%232D006B', '%23FFB400', 'COURSES • BILINGUAL'),
    themeColor: 'var(--brand)',
    captionEn: 'Guided video lessons, item banks, and full-length mock exams.',
    captionBn: 'ভিডিও পাঠ, প্রশ্ন ব্যাংক ও পূর্ণাঙ্গ মক পরীক্ষা।',
  },
  'hero-pricing': {
    altEn: 'Transparent BDT tuition plans with official 15 percent VAT invoice',
    altBn: 'অফিসিয়াল ১৫ শতাংশ ভ্যাট চালানসহ স্বচ্ছ টাকায় টিউশন প্ল্যান',
    src: buildEditorialSvg('%23F6F1EA', '%232D006B', '%23FFB400', 'TUITION • BDT'),
    themeColor: 'var(--brand)',
    captionEn: 'One-time enrollment in BDT with Mushak 6.3 VAT invoice.',
    captionBn: 'মুসক ৬.৩ ভ্যাট চালানসহ এককালীন টাকায় এনরোলমেন্ট।',
  },
  'hero-help': {
    altEn: 'Lumen Academy learner support and exam day guidance center',
    altBn: 'লুমেন একাডেমির শিক্ষার্থী সহায়তা ও পরীক্ষা নির্দেশনা কেন্দ্র',
    src: buildEditorialSvg('%23F4EFFB', '%231A1038', '%23E4002B', 'SUPPORT • DHAKA'),
    themeColor: 'var(--crimson)',
    captionEn: 'Clear answers on mocks, bKash/card checkout, and score reviews.',
    captionBn: 'মক পরীক্ষা, বিকাশ/কার্ড পেমেন্ট ও স্কোর রিভিউ সংক্রান্ত সহায়তা।',
  },
  'track-gre': {
    altEn: 'GRE Verbal, Quantitative Reasoning, and AWA preparation track',
    altBn: 'জিআরই ভার্বাল, কোয়ান্টিটেটিভ রিজনিং ও এডব্লিউএ প্রস্তুতি ট্র্যাক',
    src: buildEditorialSvg('%23F6F1EA', '%231A1038', '%23C84B31', 'TRACK • GRE'),
    themeColor: 'var(--terracotta)',
    captionEn: 'Quantitative & Verbal drills with 1,500+ FSRS vocabulary cards.',
    captionBn: '১,৫০০+ এফএসআরএস ভোক্যাব কার্ডসহ কোয়ান্ট ও ভার্বাল অনুশীলন।',
  },
  'track-ielts-ac': {
    altEn: 'IELTS Academic mock exam and band rubric feedback track',
    altBn: 'আইইএলটিএস একাডেমিক মক পরীক্ষা ও ব্যান্ড রুব্রিক ফিডব্যাক ট্র্যাক',
    src: buildEditorialSvg('%23F4EFFB', '%232D006B', '%23E4002B', 'TRACK • IELTS AC'),
    themeColor: 'var(--crimson)',
    captionEn: 'Academic Reading, Task 1 data charts, Task 2 essays, and Speaking.',
    captionBn: 'একাডেমিক রিডিং, টাস্ক ১ চার্ট, টাস্ক ২ এসে ও স্পিকিং।',
  },
  'track-ielts-gt': {
    altEn: 'IELTS General Training mock exam and CLB 9 preparation track',
    altBn: 'আইইএলটিএস জেনারেল ট্রেনিং মক পরীক্ষা ও সিএলবি ৯ প্রস্তুতি ট্র্যাক',
    src: buildEditorialSvg('%23F4EFFB', '%232D006B', '%23FFB400', 'TRACK • IELTS GT'),
    themeColor: 'var(--accent)',
    captionEn: 'Workforce Reading passages and Task 1 formal/semi-formal letters.',
    captionBn: 'কর্মক্ষেত্রভিত্তিক রিডিং প্যাসেজ ও টাস্ক ১ লেটার রাইটিং।',
  },
  'dest-usa': {
    altEn: 'United States graduate admissions GRE and IELTS score planning',
    altBn: 'যুক্তরাষ্ট্রের স্নাতকোত্তর ভর্তির জন্য জিআরই ও আইইএলটিএস স্কোর পরিকল্পনা',
    src: buildEditorialSvg('%23F6F1EA', '%231A1038', '%232D006B', 'DESTINATION • USA'),
    themeColor: 'var(--brand)',
    captionEn: 'GRE + IELTS benchmarks for US MS and PhD programs.',
    captionBn: 'যুক্তরাষ্ট্রের এমএস ও পিএইচডি প্রোগ্রামের জন্য জিআরই + আইইএলটিএস।',
  },
  'dest-uk': {
    altEn: 'United Kingdom university admissions IELTS Academic preparation',
    altBn: 'যুক্তরাজ্যের বিশ্ববিদ্যালয়ে ভর্তির জন্য আইইএলটিএস একাডেমিক প্রস্তুতি',
    src: buildEditorialSvg('%23F4EFFB', '%232D006B', '%23E4002B', 'DESTINATION • UK'),
    themeColor: 'var(--crimson)',
    captionEn: 'Academic IELTS band targets for UK Russell Group degrees.',
    captionBn: 'যুক্তরাজ্যের বিশ্ববিদ্যালয়ের জন্য একাডেমিক আইইএলটিএস ব্যান্ড লক্ষ্য।',
  },
  'dest-canada': {
    altEn: 'Canada graduate study and Express Entry IELTS preparation',
    altBn: 'কানাডায় উচ্চশিক্ষা ও এক্সপ্রেস এন্ট্রির জন্য আইইএলটিএস প্রস্তুতি',
    src: buildEditorialSvg('%23F6F1EA', '%231A1038', '%23E4002B', 'DESTINATION • CANADA'),
    themeColor: 'var(--crimson)',
    captionEn: 'IELTS Academic for study permits and General Training for CLB 9+.',
    captionBn: 'স্টাডি পারমিটের জন্য একাডেমিক ও সিএলবি ৯+-এর জন্য জেনারেল ট্রেনিং।',
  },
  'dest-australia': {
    altEn: 'Australia higher education IELTS Academic preparation',
    altBn: 'অস্ট্রেলিয়ায় উচ্চশিক্ষার জন্য আইইএলটিএস একাডেমিক প্রস্তুতি',
    src: buildEditorialSvg('%23F4EFFB', '%232D006B', '%23FFB400', 'DESTINATION • AUSTRALIA'),
    themeColor: 'var(--accent)',
    captionEn: '4-skill computer-delivered IELTS readiness for Australian campuses.',
    captionBn: 'অস্ট্রেলিয়ার বিশ্ববিদ্যালয়ের জন্য ৪-স্কিল সিবিটি আইইএলটিএস প্রস্তুতি।',
  },
  'split-diagnostic': {
    altEn: 'Free 20-minute baseline diagnostic assessment preview',
    altBn: 'বিনামূল্যে ২০ মিনিটের বেসলাইন ডায়াগনস্টিক মূল্যায়নের প্রিভিউ',
    src: buildEditorialSvg('%23F4EFFB', '%232D006B', '%23FFB400', 'DIAGNOSTIC • 20 MIN'),
    themeColor: 'var(--brand)',
    captionEn: 'Measure your starting band or GRE baseline before enrolling.',
    captionBn: 'এনরোল করার আগে আপনার বর্তমান ব্যান্ড বা জিআরই বেসলাইন যাচাই করুন।',
  },
  'mega-courses': {
    altEn: 'Lumen Academy flagship GRE and IELTS curriculum overview',
    altBn: 'লুমেন একাডেমির ফ্ল্যাগশিপ জিআরই ও আইইএলটিএস পাঠ্যক্রম',
    src: buildEditorialSvg('%23F6F1EA', '%232D006B', '%23C84B31', 'CURRICULUM • 2026'),
    themeColor: 'var(--brand)',
    captionEn: 'Explore GRE, IELTS Academic, and General Training tracks.',
    captionBn: 'জিআরই, আইইএলটিএস একাডেমিক ও জেনারেল ট্রেনিং ট্র্যাক দেখুন।',
  },
};
