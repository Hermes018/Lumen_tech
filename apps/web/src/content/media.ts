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
  | 'mega-courses';

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
    src: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=1000&q=80',
    themeColor: 'var(--brand)',
    captionEn: 'Full-length adaptive GRE and 4-skill IELTS mock workbench.',
    captionBn: 'পূর্ণাঙ্গ অ্যাডাপটিভ জিআরই ও ৪-স্কিল আইইএলটিএস মক ওয়ার্কবেঞ্চ।',
  },
  'hero-gre': {
    altEn: 'Computer-delivered GRE adaptive section interface illustration',
    altBn: 'কম্পিউটার-ভিত্তিক জিআরই অ্যাডাপটিভ সেকশন ইন্টারফেস',
    src: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1000&q=80',
    themeColor: 'var(--terracotta)',
    captionEn: 'Section-adaptive GRE practice matching the 1h 58m format.',
    captionBn: '১ ঘণ্টা ৫৮ মিনিটের আদলে সেকশন-অ্যাডাপটিভ জিআরই অনুশীলন।',
  },
  'hero-ielts': {
    altEn: 'Computer-delivered IELTS Academic and General Training 4-skill interface',
    altBn: 'কম্পিউটার-ভিত্তিক আইইএলটিএস একাডেমিক ও জেনারেল ট্রেনিং ৪-স্কিল ইন্টারফেস',
    src: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1000&q=80',
    themeColor: 'var(--crimson)',
    captionEn: 'Split-pane Reading, Listening, Writing, and Speaking evaluation.',
    captionBn: 'স্প্লিট-পেইন রিডিং, লিসেনিং, রাইটিং ও স্পিকিং মূল্যায়ন।',
  },
  'hero-courses': {
    altEn: 'Structured GRE and IELTS course tracks for Bangladesh learners',
    altBn: 'বাংলাদেশের শিক্ষার্থীদের জন্য সুগঠিত জিআরই ও আইইএলটিএস কোর্স ট্র্যাক',
    src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1000&q=80',
    themeColor: 'var(--brand)',
    captionEn: 'Guided video lessons, item banks, and full-length mock exams.',
    captionBn: 'ভিডিও পাঠ, প্রশ্ন ব্যাংক ও পূর্ণাঙ্গ মক পরীক্ষা।',
  },
  'hero-pricing': {
    altEn: 'Transparent BDT tuition plans with official 15 percent VAT invoice',
    altBn: 'অফিসিয়াল ১৫ শতাংশ ভ্যাট চালানসহ স্বচ্ছ টাকায় টিউশন প্ল্যান',
    src: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1000&q=80',
    themeColor: 'var(--brand)',
    captionEn: 'One-time enrollment in BDT with Mushak 6.3 VAT invoice.',
    captionBn: 'মুসক ৬.৩ ভ্যাট চালানসহ এককালীন টাকায় এনরোলমেন্ট।',
  },
  'hero-help': {
    altEn: `${brand.name} learner support and exam day guidance center`,
    altBn: 'লুমেন একাডেমির শিক্ষার্থী সহায়তা ও পরীক্ষা নির্দেশনা কেন্দ্র',
    src: 'https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1000&q=80',
    themeColor: 'var(--crimson)',
    captionEn: 'Clear answers on mocks, bKash/card checkout, and score reviews.',
    captionBn: 'মক পরীক্ষা, বিকাশ/কার্ড পেমেন্ট ও স্কোর রিভিউ সংক্রান্ত সহায়তা।',
  },
  'track-gre': {
    altEn: 'GRE Verbal, Quantitative Reasoning, and AWA preparation track',
    altBn: 'জিআরই ভার্বাল, কোয়ান্টিটেটিভ রিজনিং ও এডব্লিউএ প্রস্তুতি ট্র্যাক',
    src: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800&q=80',
    themeColor: 'var(--terracotta)',
    captionEn: 'Quantitative & Verbal drills with 1,500+ FSRS vocabulary cards.',
    captionBn: '১,৫০০+ এফএসআরএস ভোক্যাব কার্ডসহ কোয়ান্ট ও ভার্বাল অনুশীলন।',
  },
  'track-ielts-ac': {
    altEn: 'IELTS Academic mock exam and band rubric feedback track',
    altBn: 'আইইএলটিএস একাডেমিক মক পরীক্ষা ও ব্যান্ড রুব্রিক ফিডব্যাক ট্র্যাক',
    src: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?auto=format&fit=crop&w=800&q=80',
    themeColor: 'var(--crimson)',
    captionEn: 'Academic Reading, Task 1 data charts, Task 2 essays, and Speaking.',
    captionBn: 'একাডেমিক রিডিং, টাস্ক ১ চার্ট, টাস্ক ২ এসে ও স্পিকিং।',
  },
  'track-ielts-gt': {
    altEn: 'IELTS General Training mock exam and CLB 9 preparation track',
    altBn: 'আইইএলটিএস জেনারেল ট্রেনিং মক পরীক্ষা ও সিএলবি ৯ প্রস্তুতি ট্র্যাক',
    src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80',
    themeColor: 'var(--accent)',
    captionEn: 'Workforce Reading passages and Task 1 formal/semi-formal letters.',
    captionBn: 'কর্মক্ষেত্রভিত্তিক রিডিং প্যাসেজ ও টাস্ক ১ লেটার রাইটিং।',
  },
  'dest-usa': {
    altEn: 'United States graduate admissions GRE and IELTS score planning',
    altBn: 'যুক্তরাষ্ট্রের স্নাতকোত্তর ভর্তির জন্য জিআরই ও আইইএলটিএস স্কোর পরিকল্পনা',
    src: 'https://images.unsplash.com/photo-1485738422979-f5c462d49f74?auto=format&fit=crop&w=800&q=80',
    themeColor: 'var(--brand)',
    captionEn: 'GRE + IELTS benchmarks for US MS and PhD programs.',
    captionBn: 'যুক্তরাষ্ট্রের এমএস ও পিএইচডি প্রোগ্রামের জন্য জিআরই + আইইএলটিএস।',
  },
  'dest-uk': {
    altEn: 'United Kingdom university admissions IELTS Academic preparation',
    altBn: 'যুক্তরাজ্যের বিশ্ববিদ্যালয়ে ভর্তির জন্য আইইএলটিএস একাডেমিক প্রস্তুতি',
    src: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=800&q=80',
    themeColor: 'var(--crimson)',
    captionEn: 'Academic IELTS band targets for UK Russell Group degrees.',
    captionBn: 'যুক্তরাজ্যের বিশ্ববিদ্যালয়ের জন্য একাডেমিক আইইএলটিএস ব্যান্ড লক্ষ্য।',
  },
  'dest-canada': {
    altEn: 'Canada graduate study and Express Entry IELTS preparation',
    altBn: 'কানাডায় উচ্চশিক্ষা ও এক্সপ্রেস এন্ট্রির জন্য আইইএলটিএস প্রস্তুতি',
    src: 'https://images.unsplash.com/photo-1517935706615-2717063c2225?auto=format&fit=crop&w=800&q=80',
    themeColor: 'var(--crimson)',
    captionEn: 'IELTS Academic for study permits and General Training for CLB 9+.',
    captionBn: 'স্টাডি পারমিটের জন্য একাডেমিক ও সিএলবি ৯+-এর জন্য জেনারেল ট্রেনিং।',
  },
  'dest-australia': {
    altEn: 'Australia higher education IELTS Academic preparation',
    altBn: 'অস্ট্রেলিয়ায় উচ্চশিক্ষার জন্য আইইএলটিএস একাডেমিক প্রস্তুতি',
    src: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=800&q=80',
    themeColor: 'var(--accent)',
    captionEn: '4-skill computer-delivered IELTS readiness for Australian campuses.',
    captionBn: 'অস্ট্রেলিয়ার বিশ্ববিদ্যালয়ের জন্য ৪-স্কিল সিবিটি আইইএলটিএস প্রস্তুতি।',
  },
  'split-diagnostic': {
    altEn: 'Free 20-minute baseline diagnostic assessment preview',
    altBn: 'বিনামূল্যে ২০ মিনিটের বেসলাইন ডায়াগনস্টিক মূল্যায়নের প্রিভিউ',
    src: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1000&q=80',
    themeColor: 'var(--brand)',
    captionEn: 'Measure your starting band or GRE baseline before enrolling.',
    captionBn: 'এনরোল করার আগে আপনার বর্তমান ব্যান্ড বা জিআরই বেসলাইন যাচাই করুন।',
  },
  'mega-courses': {
    altEn: `${brand.name} flagship GRE and IELTS curriculum overview`,
    altBn: 'লুমেন একাডেমির ফ্ল্যাগশিপ জিআরই ও আইইএলটিএস পাঠ্যক্রম',
    src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=800&q=80',
    themeColor: 'var(--brand)',
    captionEn: 'Explore GRE, IELTS Academic, and General Training tracks.',
    captionBn: 'জিআরই, আইইএলটিএস একাডেমিক ও জেনারেল ট্রেনিং ট্র্যাক দেখুন।',
  },
};
