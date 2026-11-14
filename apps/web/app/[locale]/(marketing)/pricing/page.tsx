/** @purpose Interactive Honest Pricing Page with tier matrices, regional switcher, bKash installments modal, and pass packs (docs/17, P2.6.1 Bilingual) */
'use client';

import * as React from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { LocaleLink as Link } from '../../_components/LocaleLink';
import { type Region, getInstallmentSchedule } from '@lumen/core';
import {
  Button,
  Badge,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@lumen/ui';
import {
  Check,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CreditCard,
  Clock,
  Smartphone,
} from 'lucide-react';

type ExamType = 'gre' | 'ielts_academic' | 'ielts_gt';

interface TierData {
  slug: string;
  name: string;
  nameBn: string;
  tier: 'free' | 'core' | 'plus' | 'live' | 'crash' | 'mentor';
  badge?: string;
  badgeBn?: string;
  popular?: boolean;
  priceBD: string;
  priceA: string;
  priceB: string;
  priceC: string;
  duration: string;
  durationBn: string;
  description: string;
  descriptionBn: string;
  perks: string[];
  perksBn: string[];
  hasInstallments?: boolean;
}

const PRICING_DATA: Record<ExamType, TierData[]> = {
  gre: [
    {
      slug: 'gre-free',
      name: 'Free Diagnostic',
      nameBn: 'ফ্রি ডায়াগনস্টিক',
      tier: 'free',
      priceBD: '৳ ০',
      priceA: '$0',
      priceB: '$0',
      priceC: '$0',
      duration: 'Lifetime',
      durationBn: 'আজীবন',
      description: 'Find your baseline with our authentic CBT diagnostic.',
      descriptionBn: 'আমাদের প্রামাণিক সিবিটি ডায়াগনস্টিকের মাধ্যমে আপনার বর্তমান দক্ষতা যাচাই করুন।',
      perks: [
        '1 Express Diagnostic Mock (15 min)',
        'Rasch 1PL Ability Score Estimate',
        'Top Distractor Trap Diagnostics',
        '2 AI Evaluation Credits at sign-up',
        '1 AI Evaluation Credit / month',
        'Community Access (Discord & FB)',
      ],
      perksBn: [
        '১টি এক্সপ্রেস ডায়াগনস্টিক মক টেস্ট (১৫ মিনিট)',
        'Rasch 1PL অ্যাবিলিটি স্কোর প্রাক্কলন',
        'শীর্ষ ডিস্ট্রাক্টর ট্র্যাপ ডায়াগনস্টিকস',
        'সাইন-আপেই ২টি এআই ইভ্যালুয়েশন ক্রেডিট',
        'প্রতি মাসে ১টি ফ্রি এআই ইভ্যালুয়েশন ক্রেডিট',
        'কমিউনিটি অ্যাক্সেস (ডিসকর্ড ও ফেসবুক)',
      ],
    },
    {
      slug: 'gre-core',
      name: 'GRE Core',
      nameBn: 'জিআরই কোর (GRE Core)',
      tier: 'core',
      priceBD: '৳ ৫,৯৯০',
      priceA: '$149',
      priceB: '$89',
      priceC: '$59',
      duration: '6 Months (183 days)',
      durationBn: '৬ মাস (১৮৩ দিন)',
      description: 'The complete self-paced section-adaptive curriculum.',
      descriptionBn: 'নিজের গতিতে শেখার জন্য সম্পূর্ণ সেকশন-অ্যাডাপটিভ পাঠ্যক্রম।',
      perks: [
        '4 Full Section-Adaptive CBT Mocks',
        '3-Tier Progressive Hint Ladders',
        'Complete Distractor Trap Forensics',
        'Predict-First Verbal Deconstructor',
        '1,500+ Word FSRS Vocab Engine',
        '6 AI Evaluation Credits (AWA)',
        '30 AI Tutor Messages / day',
        'Official Certificate of Completion',
        '7-Day Money-Back Guarantee',
      ],
      perksBn: [
        '৪টি পূর্ণাঙ্গ সেকশন-অ্যাডাপটিভ সিবিটি মক টেস্ট',
        '৩-ধাপের প্রগ্রেসিভ হিন্ট ল্যাডার',
        'সম্পূর্ণ ডিস্ট্রাক্টর ট্র্যাপ বিশ্লেষণ',
        'প্রেডিক্ট-ফার্স্ট ভার্বাল ডিকনস্ট্রাক্টর',
        '১,৫০০+ শব্দের FSRS ভোক্যাব ইঞ্জিন',
        '৬টি এআই ইভ্যালুয়েশন ক্রেডিট (AWA)',
        'প্রতিদিন ৩০টি এআই টিউটর মেসেজ',
        'অফিসিয়াল কোর্স সম্পন্ন সার্টিফিকেট',
        '৭-দিনের মানি-ব্যাক গ্যারান্টি',
      ],
    },
    {
      slug: 'gre-plus',
      name: 'GRE Plus',
      nameBn: 'জিআরই প্লাস (GRE Plus)',
      tier: 'plus',
      popular: true,
      badge: 'Most Popular',
      badgeBn: 'সবচেয়ে জনপ্রিয়',
      priceBD: '৳ ৮,৪৯০',
      priceA: '$199',
      priceB: '$119',
      priceC: '$79',
      duration: '6 Months (183 days)',
      durationBn: '৬ মাস (১৮৩ দিন)',
      description: 'Mastery with AI Tutor, Human Reviews, and Target Promise.',
      descriptionBn: 'এআই টিউটর, হিউম্যান এসে রিভিউ এবং টার্গেট প্রমিজসহ পূর্ণাঙ্গ প্রস্তুতি।',
      perks: [
        'Everything in GRE Core',
        '10 Full Section-Adaptive CBT Mocks',
        '2 Human AWA Reviews by Senior Graders',
        'Weekly Live Strategy Q&A with Lead Instructor',
        '150 AI Tutor Messages / day (Grounded)',
        '20 AI Evaluation Credits',
        'Adaptive Rescheduling Study Plan',
        'Target Promise (+5 Point Improvement)',
        '7-Day Money-Back Guarantee',
      ],
      perksBn: [
        'জিআরই কোর-এর সকল সুবিধা অন্তর্ভুক্ত',
        '১০টি পূর্ণাঙ্গ সেকশন-অ্যাডাপটিভ সিবিটি মক টেস্ট',
        'সিনিয়র গ্রেডার দ্বারা ২টি হিউম্যান AWA এসে রিভিউ',
        'লিড ইন্সট্রাক্টরের সাথে সাপ্তাহিক লাইভ স্ট্র্যাটেজি Q&A',
        'প্রতিদিন ১৫০টি এআই টিউটর মেসেজ',
        '২০টি এআই ইভ্যালুয়েশন ক্রেডিট',
        'অ্যাডাপটিভ রিশিডিউলিং স্টাডি প্ল্যান',
        'টার্গেট প্রমিজ (+৫ পয়েন্ট উন্নতির গ্যারান্টি)',
        '৭-দিনের মানি-ব্যাক গ্যারান্টি',
      ],
    },
    {
      slug: 'gre-crash',
      name: 'GRE Live Crash',
      nameBn: 'জিআরই লাইভ ক্র্যাশ ব্যাচ',
      tier: 'crash',
      priceBD: '৳ ৯,৯৯০',
      priceA: '$229',
      priceB: '$129',
      priceC: '$89',
      duration: '12 Months Access',
      durationBn: '১২ মাসের অ্যাক্সেস',
      description: '4-week high-velocity live intensive for immediate test dates.',
      descriptionBn: 'আসন্ন পরীক্ষার তারিখের জন্য ৪-সপ্তাহের দ্রুতগতির লাইভ ইনটেনসিভ ব্যাচ।',
      hasInstallments: true,
      perks: [
        '12 Intensive Live Zoom Classes (4 weeks)',
        'Everything in GRE Core self-paced path',
        '10 Full Section-Adaptive Mocks',
        '2 Human AWA Essay Reviews',
        'bKash 2-Part Installment Available',
        'Refundable before Class 2',
      ],
      perksBn: [
        '১২টি ইনটেনসিভ লাইভ জুম ক্লাস (৪ সপ্তাহ)',
        'জিআরই কোর সেলফ-পেসড পাথের সকল সুবিধা',
        '১০টি পূর্ণাঙ্গ সেকশন-অ্যাডাপটিভ মক টেস্ট',
        '২টি হিউম্যান AWA এসে রিভিউ',
        'বিকাশে ২-কিস্তিতে পরিশোধের সুবিধা',
        '২য় ক্লাসের আগে সম্পূর্ণ রিফান্ডযোগ্য',
      ],
    },
    {
      slug: 'gre-live',
      name: 'GRE Live Cohort',
      nameBn: 'জিআরই লাইভ কোহর্ট ব্যাচ',
      tier: 'live',
      priceBD: '৳ ১২,৯৯০',
      priceA: '$299',
      priceB: '$179',
      priceC: '$119',
      duration: '12 Months Access',
      durationBn: '১২ মাসের অ্যাক্সেস',
      description: '8-week live cohort with expert instructors and peer problem clinics.',
      descriptionBn: 'অভিজ্ঞ ইন্সট্রাক্টর ও প্রবলেম ক্লিনিকসহ ৮-সপ্তাহের পূর্ণাঙ্গ লাইভ ব্যাচ।',
      hasInstallments: true,
      perks: [
        '24 Interactive Live Masterclasses (8 weeks)',
        'Full Plus Library & Adaptive Engine Access',
        '4 Human AWA Essay Reviews with Rubric',
        '10 Section-Adaptive Full Mocks',
        'Small Group Problem Clinics (cap 40)',
        'bKash 2 or 3-Part Installment Available',
        'Full Refund before Class 3',
      ],
      perksBn: [
        '২৪টি ইন্টারেক্টিভ লাইভ মাস্টারক্লাস (৮ সপ্তাহ)',
        'পূর্ণাঙ্গ প্লাস লাইব্রেরি ও অ্যাডাপটিভ ইঞ্জিন অ্যাক্সেস',
        'রুব্রিকসহ ৪টি হিউম্যান AWA এসে রিভিউ',
        '১০টি সেকশন-অ্যাডাপটিভ পূর্ণাঙ্গ মক টেস্ট',
        'ছোট গ্রুপের প্রবলেম ক্লিনিক (সর্বোচ্চ ৪০ জন)',
        'বিকাশে ২ বা ৩ কিস্তিতে পরিশোধের সুবিধা',
        '৩য় ক্লাসের আগে সম্পূর্ণ রিফান্ডযোগ্য',
      ],
    },
    {
      slug: 'gre-mentor',
      name: 'GRE 1:1 Mentor',
      nameBn: 'জিআরই ১:১ মেন্টরশিপ',
      tier: 'mentor',
      priceBD: '৳ ১৯,৯৯০',
      priceA: '$399',
      priceB: '$249',
      priceC: '$169',
      duration: '12 Months Access',
      durationBn: '১২ মাসের অ্যাক্সেস',
      description: 'Private 1:1 mentorship and custom graduate school guidance.',
      descriptionBn: 'ব্যক্তিগত ১:১ মেন্টরশিপ এবং কাস্টম গ্র্যাজুয়েট স্কুল অ্যাডমিশন গাইডেন্স।',
      hasInstallments: true,
      perks: [
        'Everything in GRE Live Cohort',
        '3 Private 45-Min 1:1 Mentoring Sessions',
        '6 Human AWA Reviews by 335+ Scorers',
        'Custom SOP / Grad School Alignment Review',
        'bKash 3-Part Installment Schedule',
        'Progress Promise Guarantee',
      ],
      perksBn: [
        'জিআরই লাইভ কোহর্ট-এর সকল সুবিধা',
        '৩টি ব্যক্তিগত ৪৫-মিনিটের ১:১ মেন্টরিং সেশন',
        '৩৩৫+ স্কোরারদের দ্বারা ৬টি হিউম্যান AWA রিভিউ',
        'কাস্টম SOP ও গ্র্যাজুয়েট স্কুল অ্যালাইনমেন্ট রিভিউ',
        'বিকাশে ৩-কিস্তিতে পরিশোধের সুবিধা',
        'প্রগ্রেস প্রমিজ গ্যারান্টি',
      ],
    },
  ],
  ielts_academic: [
    {
      slug: 'ielts-academic-free',
      name: 'Free Diagnostic',
      nameBn: 'ফ্রি ডায়াগনস্টিক',
      tier: 'free',
      priceBD: '৳ ০',
      priceA: '$0',
      priceB: '$0',
      priceC: '$0',
      duration: 'Lifetime',
      durationBn: 'আজীবন',
      description: 'Test your initial IELTS band level across skills.',
      descriptionBn: '৪টি স্কিলে আপনার প্রাথমিক আইইএলটিএস ব্যান্ড লেভেল যাচাই করুন।',
      perks: [
        '1 CD-IELTS Sectional Diagnostic Mock',
        'Instant Band Score Estimation (1.0-9.0)',
        '2 AI Writing & Speaking Credits at sign-up',
        '1 AI Evaluation Credit / month',
        'Community Discord & Facebook Group',
      ],
      perksBn: [
        '১টি সিডি-আইইএলটিএস সেকশনাল ডায়াগনস্টিক মক',
        'তাৎক্ষণিক ব্যান্ড স্কোর প্রাক্কলন (১.০-৯.০)',
        'সাইন-আপেই ২টি এআই রাইটিং ও স্পিকিং ক্রেডিট',
        'প্রতি মাসে ১টি ফ্রি এআই ইভ্যালুয়েশন ক্রেডিট',
        'কমিউনিটি ডিসকর্ড ও ফেসবুক গ্রুপ',
      ],
    },
    {
      slug: 'ielts-academic-core',
      name: 'IELTS Academic Core',
      nameBn: 'আইইএলটিএস একাডেমিক কোর',
      tier: 'core',
      priceBD: '৳ ৩,৯৯০',
      priceA: '$89',
      priceB: '$49',
      priceC: '$34',
      duration: '6 Months (183 days)',
      durationBn: '৬ মাস (১৮৩ দিন)',
      description: 'Complete CD-IELTS preparation engine for self-study.',
      descriptionBn: 'নিজে প্রস্তুতির জন্য সম্পূর্ণ সিডি-আইইএলটিএস প্রিপারেশন ইঞ্জিন।',
      perks: [
        '4 Full Computer-Delivered Mocks',
        'Authentic Single-Play Listening Stream',
        'Split-Pane Reading with Highlighter',
        '10 AI Writing & Speaking Evaluation Credits',
        '30 AI Tutor Messages / day',
        'Static 12-Week Study Plan',
        'Official Course Certificate',
        '7-Day Money-Back Guarantee',
      ],
      perksBn: [
        '৪টি পূর্ণাঙ্গ কম্পিউটার-ডেলিভার্ড মক টেস্ট',
        'প্রামাণিক সিঙ্গেল-প্লে লিসেনিং অডিও স্ট্রিম',
        'হাইলাইটারসহ স্প্লিট-পেইন রিডিং ওয়ার্কবেঞ্চ',
        '১০টি এআই রাইটিং ও স্পিকিং ইভ্যালুয়েশন ক্রেডিট',
        'প্রতিদিন ৩০টি এআই টিউটর মেসেজ',
        '১২-সপ্তাহের স্টাডি প্ল্যান',
        'অফিসিয়াল কোর্স সার্টিফিকেট',
        '৭-দিনের মানি-ব্যাক গ্যারান্টি',
      ],
    },
    {
      slug: 'ielts-academic-plus',
      name: 'IELTS Academic Plus',
      nameBn: 'আইইএলটিএস একাডেমিক প্লাস',
      tier: 'plus',
      popular: true,
      badge: 'Best Value',
      badgeBn: 'সেরা সাশ্রয়ী প্ল্যান',
      priceBD: '৳ ৬,৪৯০',
      priceA: '$149',
      priceB: '$89',
      priceC: '$59',
      duration: '6 Months (183 days)',
      durationBn: '৬ মাস (১৮৩ দিন)',
      description: 'Mastery with 2 Human Essay Reviews and Weekly Live Q&A.',
      descriptionBn: '২টি হিউম্যান এসে রিভিউ এবং সাপ্তাহিক লাইভ Q&A-সহ পূর্ণাঙ্গ প্রস্তুতি।',
      perks: [
        'Everything in IELTS Core',
        '10 Full CD-IELTS Mocks (Listening/Reading/Writing/Speaking)',
        '2 Human Essay Reviews with Cambridge Rubric Breakdown',
        'Weekly Live Strategy Q&A with Lead IELTS 8.5 Instructor',
        '40 AI Writing & Speaking Credits',
        '150 AI Tutor Messages / day',
        'Adaptive Rescheduling Study Plan',
        'Target Promise (Band 7.0+ Guarantee)',
        '7-Day Money-Back Guarantee',
      ],
      perksBn: [
        'আইইএলটিএস কোর-এর সকল সুবিধা অন্তর্ভুক্ত',
        '১০টি পূর্ণাঙ্গ সিডি-আইইএলটিএস মক (লিসেনিং/রিডিং/রাইটিং/স্পিকিং)',
        'কেমব্রিজ রুব্রিক বিশ্লেষণসহ ২টি হিউম্যান এসে রিভিউ',
        'ব্যান্ড ৮.৫ ইন্সট্রাক্টরের সাথে সাপ্তাহিক লাইভ Q&A',
        '৪০টি এআই রাইটিং ও স্পিকিং ক্রেডিট',
        'প্রতিদিন ১৫০টি এআই টিউটর মেসেজ',
        'অ্যাডাপটিভ রিশিডিউলিং স্টাডি প্ল্যান',
        'টার্গেট প্রমিজ (ব্যান্ড ৭.০+ গ্যারান্টি)',
        '৭-দিনের মানি-ব্যাক গ্যারান্টি',
      ],
    },
    {
      slug: 'ielts-academic-crash',
      name: 'IELTS Live Crash',
      nameBn: 'আইইএলটিএস লাইভ ক্র্যাশ ব্যাচ',
      tier: 'crash',
      priceBD: '৳ ৯,৯৯০',
      priceA: '$229',
      priceB: '$129',
      priceC: '$89',
      duration: '12 Months Access',
      durationBn: '১২ মাসের অ্যাক্সেস',
      description: '4-week intensive live batch for upcoming test bookings.',
      descriptionBn: 'আসন্ন পরীক্ষার বুকিংয়ের জন্য ৪-সপ্তাহের ইনটেনসিভ লাইভ ব্যাচ।',
      hasInstallments: true,
      perks: [
        '16 Live Interactive Classes (4 weeks)',
        '3 Speaking Club Sessions',
        '10 Full CD-IELTS Mocks',
        '2 Human Essay Reviews + 1 Speaking Mock',
        'bKash 2-Part Installment Available',
        'Full Refund before Class 2',
      ],
      perksBn: [
        '১৬টি লাইভ ইন্টারেক্টিভ ক্লাস (৪ সপ্তাহ)',
        '৩টি স্পিকিং ক্লাব সেশন',
        '১০টি পূর্ণাঙ্গ সিডি-আইইএলটিএস মক টেস্ট',
        '২টি হিউম্যান এসে রিভিউ + ১টি স্পিকিং মক',
        'বিকাশে ২-কিস্তিতে পরিশোধের সুবিধা',
        '২য় ক্লাসের আগে সম্পূর্ণ রিফান্ডযোগ্য',
      ],
    },
    {
      slug: 'ielts-academic-live',
      name: 'IELTS Live Cohort',
      nameBn: 'আইইএলটিএস লাইভ কোহর্ট ব্যাচ',
      tier: 'live',
      priceBD: '৳ ১৩,৯৯০',
      priceA: '$299',
      priceB: '$179',
      priceC: '$119',
      duration: '12 Months Access',
      durationBn: '১২ মাসের অ্যাক্সেস',
      description: '12-week comprehensive live training with human speaking mocks.',
      descriptionBn: 'হিউম্যান স্পিকিং মকসহ ১২-সপ্তাহের পূর্ণাঙ্গ লাইভ প্রশিক্ষণ।',
      hasInstallments: true,
      perks: [
        '36 Live Sessions (Regular, Weekend, or Evening)',
        'Full Plus Library & Adaptive Mocks Access',
        '4 Human Essay Reviews + 2 Human Speaking Mocks',
        '6 Speaking Club Sessions',
        'bKash 2 or 3-Part Installment (৳ 5,600 / ৳ 4,200 / ৳ 4,190)',
        'Full Refund before Class 3',
      ],
      perksBn: [
        '৩৬টি লাইভ সেশন (রেগুলার, উইকেন্ড বা ইভনিং ব্যাচ)',
        'পূর্ণাঙ্গ প্লাস লাইব্রেরি ও অ্যাডাপটিভ মক অ্যাক্সেস',
        '৪টি হিউম্যান এসে রিভিউ + ২টি হিউম্যান স্পিকিং মক',
        '৬টি স্পিকিং ক্লাব সেশন',
        'বিকাশে ২ বা ৩ কিস্তি সুবিধা (৳ ৫,৬০০ / ৳ ৪,২০০ / ৳ ৪,১৯০)',
        '৩য় ক্লাসের আগে সম্পূর্ণ রিফান্ডযোগ্য',
      ],
    },
    {
      slug: 'ielts-academic-mentor',
      name: 'IELTS 1:1 Mentor',
      nameBn: 'আইইএলটিএস ১:১ মেন্টরশিপ',
      tier: 'mentor',
      priceBD: '৳ ১৯,৯৯০',
      priceA: '$399',
      priceB: '$249',
      priceC: '$169',
      duration: '12 Months Access',
      durationBn: '১২ মাসের অ্যাক্সেস',
      description: 'Private 1:1 coaching with IELTS 8.5+ mentors.',
      descriptionBn: 'ব্যান্ড ৮.৫+ মেন্টরদের সাথে ব্যক্তিগত ১:১ কোচিং।',
      hasInstallments: true,
      perks: [
        'Everything in IELTS Live Cohort',
        '3 Private 45-Min 1:1 Sessions with Lead Instructor',
        '6 Human Essay Reviews + 3 Human Speaking Mocks',
        'Custom University Admissions Guidance',
        'bKash 3-Part Installment (৳ 8,000 / ৳ 6,000 / ৳ 5,990)',
        'Progress Promise Guarantee',
      ],
      perksBn: [
        'আইইএলটিএস লাইভ কোহর্ট-এর সকল সুবিধা',
        'লিড ইন্সট্রাক্টরের সাথে ৩টি ৪৫-মিনিটের ১:১ সেশন',
        '৬টি হিউম্যান এসে রিভিউ + ৩টি হিউম্যান স্পিকিং মক',
        'কাস্টম ইউনিভার্সিটি অ্যাডমিশন গাইডেন্স',
        'বিকাশে ৩-কিস্তি সুবিধা (৳ ৮,০০০ / ৳ ৬,০০০ / ৳ ৫,৯৯০)',
        'প্রগ্রেস প্রমিজ গ্যারান্টি',
      ],
    },
  ],
  ielts_gt: [
    {
      slug: 'ielts-gt-free',
      name: 'Free Diagnostic',
      nameBn: 'ফ্রি ডায়াগনস্টিক',
      tier: 'free',
      priceBD: '৳ ০',
      priceA: '$0',
      priceB: '$0',
      priceC: '$0',
      duration: 'Lifetime',
      durationBn: 'আজীবন',
      description: 'General Training diagnostic for immigration candidates.',
      descriptionBn: 'ইমিগ্রেশন প্রার্থীদের জন্য জেনারেল ট্রেনিং ডায়াগনস্টিক।',
      perks: [
        '1 GT Sectional Diagnostic Mock',
        'Instant Band Score Estimation',
        '2 AI Writing & Speaking Credits',
        'Community Access',
      ],
      perksBn: [
        '১টি জিটি সেকশনাল ডায়াগনস্টিক মক',
        'তাৎক্ষণিক ব্যান্ড স্কোর প্রাক্কলন',
        '২টি এআই রাইটিং ও স্পিকিং ক্রেডিট',
        'কমিউনিটি অ্যাক্সেস',
      ],
    },
    {
      slug: 'ielts-gt-core',
      name: 'IELTS GT Core',
      nameBn: 'আইইএলটিএস জিটি কোর',
      tier: 'core',
      priceBD: '৳ ৩,৪৯০',
      priceA: '$79',
      priceB: '$49',
      priceC: '$29.99',
      duration: '6 Months (183 days)',
      durationBn: '৬ মাস (১৮৩ দিন)',
      description: 'Tailored for Express Entry & Canada/Australia PR seekers.',
      descriptionBn: 'এক্সপ্রেস এন্ট্রি এবং কানাডা/অস্ট্রেলিয়া পিআর প্রত্যাশীদের জন্য বিশেষভাবে তৈরি।',
      perks: [
        '4 Full Computer-Delivered GT Mocks',
        'GT Letter Writing & Workplace Reading modules',
        '10 AI Evaluation Credits',
        '30 AI Tutor Messages / day',
        'Official Course Certificate',
        '7-Day Money-Back Guarantee',
      ],
      perksBn: [
        '৪টি পূর্ণাঙ্গ কম্পিউটার-ডেলিভার্ড জিটি মক টেস্ট',
        'জিটি লেটার রাইটিং ও ওয়ার্কপ্লেস রিডিং মডিউল',
        '১০টি এআই ইভ্যালুয়েশন ক্রেডিট',
        'প্রতিদিন ৩০টি এআই টিউটর মেসেজ',
        'অফিসিয়াল কোর্স সার্টিফিকেট',
        '৭-দিনের মানি-ব্যাক গ্যারান্টি',
      ],
    },
    {
      slug: 'ielts-gt-plus',
      name: 'IELTS GT Plus',
      nameBn: 'আইইএলটিএস জিটি প্লাস',
      tier: 'plus',
      popular: true,
      badge: 'PR Target CLB 9',
      badgeBn: 'পিআর টার্গেট CLB 9',
      priceBD: '৳ ৬,৪৯০',
      priceA: '$149',
      priceB: '$89',
      priceC: '$59',
      duration: '6 Months (183 days)',
      durationBn: '৬ মাস (১৮৩ দিন)',
      description: 'Mastery designed to hit the crucial CLB 9/10 PR points.',
      descriptionBn: 'গুরুত্বপূর্ণ CLB 9/10 পিআর পয়েন্ট অর্জনের জন্য পূর্ণাঙ্গ প্রস্তুতি।',
      perks: [
        'Everything in IELTS GT Core',
        '10 Full CD-IELTS GT Mocks',
        '2 Human Letter/Essay Reviews with Rubric',
        'Weekly Live Immigration Strategy Q&A',
        '40 AI Credits',
        '150 AI Tutor Messages / day',
        'Target Promise (CLB 9 Guarantee)',
      ],
      perksBn: [
        'আইইএলটিএস জিটি কোর-এর সকল সুবিধা',
        '১০টি পূর্ণাঙ্গ সিডি-আইইএলটিএস জিটি মক টেস্ট',
        'রুব্রিকসহ ২টি হিউম্যান লেটার/এসে রিভিউ',
        'সাপ্তাহিক লাইভ ইমিগ্রেশন স্ট্র্যাটেজি Q&A',
        '৪০টি এআই ক্রেডিট',
        'প্রতিদিন ১৫০টি এআই টিউটর মেসেজ',
        'টার্গেট প্রমিজ (CLB 9 গ্যারান্টি)',
      ],
    },
    {
      slug: 'ielts-gt-live',
      name: 'IELTS GT Live Cohort',
      nameBn: 'আইইএলটিএস জিটি লাইভ ব্যাচ',
      tier: 'live',
      priceBD: '৳ ১২,৯৯০',
      priceA: '$299',
      priceB: '$179',
      priceC: '$119',
      duration: '12 Months Access',
      durationBn: '১২ মাসের অ্যাক্সেস',
      description: '12-week evening batch for working professionals.',
      descriptionBn: 'চাকরিজীবী ও পেশাজীবীদের জন্য ১২-সপ্তাহের সান্ধ্যকালীন লাইভ ব্যাচ।',
      hasInstallments: true,
      perks: [
        '36 Live Evening Classes (after 8:30 PM)',
        'Full GT Plus Library & Mocks',
        '4 Human Writing Reviews + 2 Human Speaking Mocks',
        'bKash 2 or 3-Part Installment Available',
        'Full Refund before Class 3',
      ],
      perksBn: [
        '৩৬টি লাইভ সান্ধ্যকালীন ক্লাস (রাত ৮:৩০-এর পর)',
        'পূর্ণাঙ্গ জিটি প্লাস লাইব্রেরি ও মক টেস্ট',
        '৪টি হিউম্যান রাইটিং রিভিউ + ২টি হিউম্যান স্পিকিং মক',
        'বিকাশে ২ বা ৩ কিস্তিতে পরিশোধের সুবিধা',
        '৩য় ক্লাসের আগে সম্পূর্ণ রিফান্ডযোগ্য',
      ],
    },
  ],
};

interface AllAccessPassData {
  slug: string;
  name: string;
  nameBn: string;
  badge?: string;
  badgeBn?: string;
  priceBD: string;
  priceA: string;
  priceB: string;
  priceC: string;
  duration: string;
  durationBn: string;
  description: string;
  descriptionBn: string;
  features: string[];
  featuresBn: string[];
}

const ALL_ACCESS_PASSES: AllAccessPassData[] = [
  {
    slug: 'pass-1m',
    name: '1-Month Pass',
    nameBn: '১-মাসের পাস',
    priceBD: '৳ ১,১৯০',
    priceA: '$24.99',
    priceB: '$14.99',
    priceC: '$9.99',
    duration: '30 Days',
    durationBn: '৩০ দিন',
    description: 'Quick sprint across GRE and IELTS mock test series.',
    descriptionBn: 'জিআরই এবং আইইএলটিএস মক টেস্ট সিরিজে দ্রুত প্রস্তুতির জন্য।',
    features: ['10 AI Credits / month', '2 Full Mocks / month', 'Daily AI cap: 4', 'All test banks'],
    featuresBn: ['মাসে ১০টি এআই ক্রেডিট', 'মাসে ২টি পূর্ণাঙ্গ মক', 'দৈনিক এআই সীমা: ৪', 'সকল প্রশ্ন ব্যাংক'],
  },
  {
    slug: 'pass-3m',
    name: '3-Month Pass',
    nameBn: '৩-মাসের পাস',
    badge: 'Popular',
    badgeBn: 'জনপ্রিয়',
    priceBD: '৳ ২,৯৯০',
    priceA: '$59',
    priceB: '$39',
    priceC: '$24.99',
    duration: '90 Days',
    durationBn: '৯০ দিন',
    description: 'Breadth across all GRE & IELTS sections without lock-in.',
    descriptionBn: 'কোনো দীর্ঘমেয়াদি লক-ইন ছাড়াই জিআরই ও আইইএলটিএসের সকল সেকশনে অ্যাক্সেস।',
    features: ['30 AI Credits total', '6 Full Mocks total', 'Daily AI cap: 4', '2 Concurrent devices'],
    featuresBn: ['মোট ৩০টি এআই ক্রেডিট', 'মোট ৬টি পূর্ণাঙ্গ মক', 'দৈনিক এআই সীমা: ৪', '২টি ডিভাইসে ব্যবহারযোগ্য'],
  },
  {
    slug: 'pass-6m',
    name: '6-Month Pass',
    nameBn: '৬-মাসের পাস',
    priceBD: '৳ ৪,৪৯০',
    priceA: '$99',
    priceB: '$59',
    priceC: '$39',
    duration: '183 Days',
    durationBn: '১৮৩ দিন',
    description: 'Complete cross-exam preparation window.',
    descriptionBn: 'উভয় পরীক্ষার পূর্ণাঙ্গ প্রস্তুতির জন্য আদর্শ সময়সীমা।',
    features: ['60 AI Credits total', '12 Full Mocks total', 'Daily AI cap: 4', '2 Concurrent devices'],
    featuresBn: ['মোট ৬০টি এআই ক্রেডিট', 'মোট ১২টি পূর্ণাঙ্গ মক', 'দৈনিক এআই সীমা: ৪', '২টি ডিভাইসে ব্যবহারযোগ্য'],
  },
  {
    slug: 'pass-12m',
    name: '12-Month Annual Pass',
    nameBn: '১২-মাসের বার্ষিক পাস',
    badge: 'Best Long-Term',
    badgeBn: 'সেরা দীর্ঘমেয়াদি',
    priceBD: '৳ ৬,৯৯০',
    priceA: '$149',
    priceB: '$89',
    priceC: '$59',
    duration: '365 Days',
    durationBn: '৩৬৫ দিন',
    description: 'Full unconstrained platform breadth for serious study abroad prep.',
    descriptionBn: 'উচ্চশিক্ষার দীর্ঘমেয়াদি প্রস্তুতির জন্য সম্পূর্ণ প্ল্যাটফর্মের অবাধ অ্যাক্সেস।',
    features: ['120 AI Credits total', '24 Full Mocks total', 'Daily AI cap: 4', '2 Concurrent devices'],
    featuresBn: ['মোট ১২০টি এআই ক্রেডিট', 'মোট ২৪টি পূর্ণাঙ্গ মক', 'দৈনিক এআই সীমা: ৪', '২টি ডিভাইসে ব্যবহারযোগ্য'],
  },
];

const ADD_ON_PACKS = [
  {
    slug: 'ai-credits-10',
    name: '10 AI Evaluation Credits',
    nameBn: '১০টি এআই ইভ্যালুয়েশন ক্রেডিট',
    priceBD: '৳ ৪৯০',
    priceUSD: '$4.99',
    description: 'Refill 10 instant Writing or Speaking evaluations. Never expires.',
    descriptionBn: '১০টি তাৎক্ষণিক রাইটিং বা স্পিকিং মূল্যায়ন রিফিল করুন। মেয়াদ কখনো শেষ হয় না।',
  },
  {
    slug: 'mock-pack-4',
    name: '4 Adaptive CBT Mocks Pack',
    nameBn: '৪টি অ্যাডাপটিভ সিবিটি মক প্যাক',
    priceBD: '৳ ৯৯০',
    priceUSD: '$9.99',
    description: '4 full section-adaptive GRE or CD-IELTS computer-delivered mocks.',
    descriptionBn: '৪টি পূর্ণাঙ্গ সেকশন-অ্যাডাপটিভ জিআরই বা সিডি-আইইএলটিএস কম্পিউটার-ডেলিভার্ড মক টেস্ট।',
  },
  {
    slug: 'human-review-pack',
    name: 'Human Feedback Bundle',
    nameBn: 'হিউম্যান ফিডব্যাক বান্ডেল',
    priceBD: '৳ ১,৪৯০',
    priceUSD: '$14.99',
    description: '2 detailed Essay Reviews with rubrics + 1 live 15-min Speaking Mock.',
    descriptionBn: 'রুব্রিকসহ ২টি বিস্তারিত এসে রিভিউ + ১টি লাইভ ১৫-মিনিটের স্পিকিং মক।',
  },
];

export default function PricingPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';
  const tPricing = useTranslations('pricingPage');
  const [exam, setExam] = React.useState<ExamType>('gre');
  const [region, setRegion] = React.useState<Region>('BD');
  const [installmentModalTier, setInstallmentModalTier] = React.useState<string | null>(null);

  const currentTiers = PRICING_DATA[exam];

  const getDisplayPrice = (tier: TierData): string => {
    switch (region) {
      case 'A':
        return tier.priceA;
      case 'B':
        return tier.priceB;
      case 'C':
        return tier.priceC;
      case 'BD':
      default:
        return tier.priceBD;
    }
  };

  const getPassPrice = (pass: (typeof ALL_ACCESS_PASSES)[0]): string => {
    switch (region) {
      case 'A':
        return pass.priceA;
      case 'B':
        return pass.priceB;
      case 'C':
        return pass.priceC;
      case 'BD':
      default:
        return pass.priceBD;
    }
  };

  const activeInstallmentSchedule = installmentModalTier
    ? getInstallmentSchedule(
        installmentModalTier,
        installmentModalTier === 'mentor' ? 1999000 : installmentModalTier === 'live' ? 1399000 : 999000
      )
    : null;

  return (
    <div className="flex flex-col items-center pb-20" data-locale={locale}>
      {/* High-Contrast Institutional Navy Hero Banner with Left-Aligned Editorial Kicker */}
      <section className="relative w-full overflow-hidden border-b border-slate-800 bg-[#001E42] text-white">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 lg:py-20 grid lg:grid-cols-12 gap-10 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-slate-200">
              {tPricing('badge')}
            </div>

            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {tPricing('title')}
            </h1>

            <p className="max-w-2xl text-base text-slate-300 sm:text-lg leading-relaxed">
              {tPricing('subtitle')}
            </p>

            {/* Exam Selector Tabs */}
            <div className="pt-2 flex flex-wrap gap-2.5">
              {[
                { id: 'gre', label: tPricing('grePrep') },
                { id: 'ielts_academic', label: tPricing('ieltsAcademic') },
                { id: 'ielts_gt', label: tPricing('ieltsGt') },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setExam(tab.id as ExamType)}
                  className={`rounded-lg px-5 py-2.5 text-sm font-bold transition-all ${
                    exam === tab.id
                      ? 'bg-[#E4002B] text-white shadow-md'
                      : 'bg-slate-900 text-slate-300 border border-slate-700 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Right 5 Columns: Region & Currency Selector Card */}
          <div className="lg:col-span-5 rounded-2xl border border-white/15 bg-slate-900/90 p-6 space-y-4 shadow-xl">
            <div className="border-l-4 border-[#00A896] pl-3 text-xs font-bold uppercase tracking-widest text-slate-200">
              {tPricing('currencyRegion')}
            </div>
            <div className="grid grid-cols-1 gap-2 text-xs">
              {[
                {
                  id: 'BD',
                  label: isBn
                    ? 'বাংলাদেশ (৳ BDT - ১৫% ভ্যাটসহ)'
                    : 'BD (৳ BDT - 15% VAT incl.)',
                },
                {
                  id: 'A',
                  label: isBn
                    ? 'অঞ্চল A ($ USD - উচ্চ আয়)'
                    : 'Region A ($ USD - High Income)',
                },
                {
                  id: 'B',
                  label: isBn
                    ? 'অঞ্চল B ($ USD - উচ্চ-মধ্যম)'
                    : 'Region B ($ USD - Upper-Middle)',
                },
                {
                  id: 'C',
                  label: isBn
                    ? 'অঞ্চল C ($ USD - দক্ষিণ এশিয়া)'
                    : 'Region C ($ USD - South Asia / Emerging)',
                },
              ].map((reg) => (
                <button
                  key={reg.id}
                  type="button"
                  onClick={() => setRegion(reg.id as Region)}
                  className={`rounded-lg px-3.5 py-2.5 text-left font-semibold transition-all ${
                    region === reg.id
                      ? 'bg-[#00A896] text-white shadow-sm'
                      : 'bg-slate-950/70 text-slate-300 border border-slate-800 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  {reg.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl w-full space-y-12 px-4 pt-12 sm:px-6 lg:px-8">
        {/* Tier Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {currentTiers.map((tier) => {
            const displayPrice = getDisplayPrice(tier);
            const isFree = tier.tier === 'free';
            const tierName = isBn ? tier.nameBn : tier.name;
            const tierDuration = isBn ? tier.durationBn : tier.duration;
            const tierDesc = isBn ? tier.descriptionBn : tier.description;
            const tierPerks = isBn ? tier.perksBn : tier.perks;
            const tierBadge = isBn ? tier.badgeBn ?? tier.badge : tier.badge;

            return (
              <Card
                key={tier.slug}
                className={`overflow-hidden bg-white transition-all flex flex-col justify-between relative ${
                  tier.popular
                    ? 'border-2 border-indigo-900 shadow-xl ring-2 ring-indigo-950/10'
                    : 'border-slate-200/90 shadow-xs hover:shadow-md'
                }`}
              >
                {/* Elevated Dark-Navy / Indigo Top Header Ribbon for Most Popular (BUG-12) */}
                {tier.popular ? (
                  <div className="bg-indigo-950 text-white px-6 py-2.5 flex items-center justify-between text-xs font-bold uppercase tracking-wider">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                      {tierBadge ?? (isBn ? 'সবচেয়ে জনপ্রিয়' : 'Most Popular')}
                    </span>
                    <span className="rounded-full bg-blue-600/40 px-2.5 py-0.5 text-[10px] font-semibold text-blue-100">
                      {isBn ? 'টার্গেট প্রমিজ অন্তর্ভুক্ত' : 'Target Promise Included'}
                    </span>
                  </div>
                ) : (
                  tierBadge && (
                    <div className="absolute top-3 right-4">
                      <Badge variant="default" className="text-[11px] font-bold">
                        {tierBadge}
                      </Badge>
                    </div>
                  )
                )}

                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-950">{tierName}</CardTitle>
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {tierDuration}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mt-1 min-h-[32px]">{tierDesc}</p>
                  <div className="mt-4 pt-2">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-3xl font-extrabold text-slate-950">{displayPrice}</span>
                      {!isFree && region === 'BD' && (
                        <span className="text-[11px] font-medium text-slate-500">
                          {isBn
                            ? '(১৫% ভ্যাট ও মূসক ৬.৩ অন্তর্ভুক্ত)'
                            : '(15% VAT & Mushak 6.3 incl.)'}
                        </span>
                      )}
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6 pt-0 flex-1 flex flex-col justify-between">
                  <div className="space-y-2.5 border-t border-slate-100 pt-4 text-xs text-slate-800">
                    {tierPerks.map((perk, i) => (
                      <div key={i} className="flex items-start gap-2.5">
                        <span
                          className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${
                            tier.popular
                              ? 'bg-indigo-950 text-white'
                              : 'bg-blue-50 text-blue-600'
                          }`}
                        >
                          <Check className="h-2.5 w-2.5" />
                        </span>
                        <span className="font-medium leading-relaxed">{perk}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2.5 pt-4 border-t border-slate-100">
                    {isFree ? (
                      <Link href="/exam/diagnostic" className="block w-full">
                        <Button variant="outline" className="w-full font-semibold">
                          {isBn ? 'ফ্রি ডায়াগনস্টিক শুরু করুন' : 'Start Free Diagnostic'}
                        </Button>
                      </Link>
                    ) : (
                      <Link href={`/checkout?plan=${tier.slug}`} className="block w-full">
                        <Button
                          variant={tier.popular ? 'primary' : 'outline'}
                          className={`w-full gap-2 font-semibold ${
                            tier.popular ? 'bg-indigo-950 text-white hover:bg-indigo-900 shadow-md' : ''
                          }`}
                        >
                          {isBn ? 'এখনই ভর্তি হোন' : 'Enroll Now'}{' '}
                          <ArrowRight className="h-4 w-4" />
                        </Button>
                      </Link>
                    )}

                    {/* Highlighted bKash 2/3-Part 0% Split-Pay Banner underneath Most Popular & Installment tiers */}
                    {(tier.popular || tier.hasInstallments) && region === 'BD' && (
                      <button
                        type="button"
                        onClick={() => setInstallmentModalTier(tier.hasInstallments ? tier.tier : 'live')}
                        className="flex w-full items-center justify-between rounded-xl border border-pink-200 bg-pink-50/80 px-3 py-2 text-left text-[11px] font-semibold text-pink-950 transition-colors hover:bg-pink-100"
                      >
                        <span className="flex items-center gap-1.5">
                          <Smartphone className="h-3.5 w-3.5 text-pink-600 shrink-0" />
                          <span>
                            {isBn
                              ? 'বিকাশ ২/৩-কিস্তি ০% স্প্লিট-পে সুবিধা রয়েছে'
                              : 'bKash 2/3-Part 0% Split-Pay Available'}
                          </span>
                        </span>
                        <span className="text-pink-700 underline">
                          {isBn ? 'কিস্তির তালিকা →' : 'Schedule →'}
                        </span>
                      </button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* All-Access Passes Section */}
        <div className="border-t border-border pt-16 space-y-8">
          <div className="text-left space-y-3 max-w-2xl">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
              {isBn ? 'বিস্তৃত অনুশীলনের সুযোগ' : 'Multi-Exam Access Options'}
            </div>
            <h2 className="text-3xl lg:text-5xl font-extrabold text-fg">
              {isBn ? 'অল-অ্যাক্সেস পাসসমূহ' : 'All-Access Passes'}
            </h2>
            <p className="text-fg-muted text-sm leading-relaxed">
              {isBn
                ? 'একাধিক পরীক্ষার প্রস্তুতি নিচ্ছেন অথবা আমাদের জিআরই ও আইইএলটিএস মক লাইব্রেরিতে উন্মুক্ত অনুশীলন করতে চান? অল-অ্যাক্সেস পাস আপনাকে কোনো নির্দিষ্ট কোর্সে সীমাবদ্ধ না রেখেই অবাধ অনুশীলনের সুযোগ দেয়।'
                : 'Preparing for multiple tests or just need open practice across our GRE and IELTS mock libraries? Passes provide unconstrained practice without structured course lock-in.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ALL_ACCESS_PASSES.map((pass) => (
              <Card key={pass.slug} className="border-border bg-surface flex flex-col justify-between">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold text-fg">
                      {isBn ? pass.nameBn : pass.name}
                    </CardTitle>
                    {pass.badge && (
                      <Badge variant="default" className="text-[10px]">
                        {isBn ? pass.badgeBn ?? pass.badge : pass.badge}
                      </Badge>
                    )}
                  </div>
                  <div className="text-2xl font-black text-accent mt-2">{getPassPrice(pass)}</div>
                  <div className="text-xs text-fg-subtle">
                    {isBn ? pass.durationBn : pass.duration}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 pt-0">
                  <p className="text-xs text-fg-muted">
                    {isBn ? pass.descriptionBn : pass.description}
                  </p>
                  <ul className="space-y-1.5 text-xs text-fg border-t border-border/60 pt-3">
                    {(isBn ? pass.featuresBn : pass.features).map((f, i) => (
                      <li key={i} className="flex items-center gap-1.5">
                        <Check className="h-3.5 w-3.5 text-accent shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="pt-2">
                    <Link href={`/checkout?plan=${pass.slug}`}>
                      <Button variant="outline" size="sm" className="w-full">
                        {isBn ? 'পাস নিন' : 'Get Pass'}
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Add-ons Section */}
        <div className="border-t border-border pt-16 space-y-8">
          <div className="text-left space-y-3 max-w-2xl">
            <div className="border-l-4 border-[#E4002B] pl-3 text-xs font-bold uppercase tracking-widest text-[#001E42]">
              {isBn ? 'ক্রেডিট রিফিল' : 'On-Demand Credit Refills'}
            </div>
            <h3 className="text-3xl lg:text-5xl font-bold text-fg">
              {isBn ? 'অ্যাড-অন প্যাকসমূহ' : 'Add-on Packs'}
            </h3>
            <p className="text-fg-muted text-sm">
              {isBn
                ? 'অতিরিক্ত এআই ইভ্যালুয়েশন ক্রেডিট বা বাড়তি হিউম্যান এসে রিভিউ প্রয়োজন? যেকোনো প্ল্যানের সাথে প্যাক যুক্ত করুন।'
                : 'Need extra AI evaluation credits or additional human essay reviews? Add packs to any tier.'}
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {ADD_ON_PACKS.map((pack) => (
              <Card key={pack.slug} className="border-border bg-surface flex flex-col justify-between">
                <CardHeader>
                  <CardTitle className="text-base font-bold text-fg">
                    {isBn ? pack.nameBn : pack.name}
                  </CardTitle>
                  <div className="text-xl font-extrabold text-accent mt-1">
                    {region === 'BD' ? pack.priceBD : pack.priceUSD}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-xs text-fg-muted leading-relaxed">
                    {isBn ? pack.descriptionBn : pack.description}
                  </p>
                  <Link href={`/checkout?plan=${pack.slug}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      {isBn ? 'অ্যাকাউন্টে যুক্ত করুন' : 'Add to Account'}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Honest Pricing Pillars Guarantee Box */}
        <div className="rounded-2xl border border-border bg-surface p-8 sm:p-10 space-y-6">
          <div className="text-center space-y-2">
            <h3 className="text-xl font-bold text-fg flex items-center justify-center gap-2">
              <ShieldCheck className="h-5 w-5 text-accent" />{' '}
              {isBn ? 'আমাদের স্বচ্ছ মূল্যতালিকার প্রতিশ্রুতি' : 'Our Honest Pricing Guarantee'}
            </h3>
            <p className="text-fg-muted text-xs max-w-xl mx-auto">
              {isBn
                ? 'আমরা বাংলাদেশ ডিজিটাল কমার্স পরিচালনা নির্দেশিকা ২০২১ এবং নৈতিক মূল্য নির্ধারণ মানদণ্ড মেনে চলি।'
                : 'We abide by the Bangladesh Digital Commerce Operation Guidelines 2021 and ethical pricing standards.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-3 text-xs text-fg">
            <div className="space-y-1 rounded-lg border border-border/70 bg-canvas p-4">
              <div className="font-semibold text-fg flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-accent" />{' '}
                {isBn ? '৭-দিনের মানি-ব্যাক গ্যারান্টি' : '7-Day Money-Back Guarantee'}
              </div>
              <p className="text-fg-muted leading-relaxed">
                {isBn
                  ? 'আপনি যদি কোর্সের ২০%-এর কম সম্পন্ন করে থাকেন এবং সর্বোচ্চ ১টি মক টেস্ট দিয়ে থাকেন, তবে ৭ দিনের মধ্যে কোনো প্রশ্ন ছাড়াই ১০০% রিফান্ড পাবেন।'
                  : 'If you have completed < 20% of course content and took ≤ 1 full mock, receive a 100% full refund within 7 days. No questions asked.'}
              </p>
            </div>

            <div className="space-y-1 rounded-lg border border-border/70 bg-canvas p-4">
              <div className="font-semibold text-fg flex items-center gap-1.5">
                <CreditCard className="h-4 w-4 text-accent" />{' '}
                {isBn ? 'বিকাশ কিস্তিতে কোনো অতিরিক্ত চার্জ নেই' : 'Zero bKash Financing Fees'}
              </div>
              <p className="text-fg-muted leading-relaxed">
                {isBn
                  ? 'লাইভ এবং মেন্টর প্ল্যানে ২ বা ৩ কিস্তিতে পরিশোধ করুন। কিস্তিগুলোর যোগফল মূল তালিকার মূল্যের সমান—কোনো সুদ বা লুকানো চার্জ নেই।'
                  : 'Pay in 2 or 3 parts on Live and Mentor tiers. The sum of the parts exactly equals the cash list price. No hidden interest or admin surcharge.'}
              </p>
            </div>

            <div className="space-y-1 rounded-lg border border-border/70 bg-canvas p-4">
              <div className="font-semibold text-fg flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-accent" />{' '}
                {isBn ? 'ভুয়া ডিসকাউন্ট সম্পূর্ণ নিষিদ্ধ' : 'Banned Fake Strikethroughs'}
              </div>
              <p className="text-fg-muted leading-relaxed">
                {isBn
                  ? 'বিগত ৯০ দিনের মধ্যে কমপক্ষে ২৮ দিন কোনো পূর্ববর্তী মূল্য কার্যকর থাকলেই কেবল ডিসকাউন্ট স্ট্রাইকথ্রু প্রদর্শিত হয়।'
                  : 'Discount strikethroughs are displayed only when the prior price was active for at least 28 consecutive days in the past 90 days.'}
              </p>
            </div>
          </div>
        </div>

        {/* bKash Installment Breakdown Modal */}
        {installmentModalTier && activeInstallmentSchedule && (
          <Dialog
            open={!!installmentModalTier}
            onOpenChange={(open) => !open && setInstallmentModalTier(null)}
          >
            <DialogContent className="max-w-lg bg-surface border-border">
              <DialogHeader>
                <DialogTitle className="text-lg font-bold text-fg flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />{' '}
                  {isBn ? 'বিকাশ কিস্তির বিস্তারিত হিসাব' : 'bKash Installment Breakdown'}
                </DialogTitle>
                <DialogDescription className="text-xs text-fg-muted">
                  {isBn
                    ? 'কোনো সুদ বা অতিরিক্ত চার্জ নেই। কিস্তির মোট পরিমাণ নগদ মূল্যের সমান।'
                    : 'No financing or interest charge. The total equals the cash list price.'}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-6 pt-2">
                {activeInstallmentSchedule.threePart && (
                  <div className="rounded-xl border border-border bg-canvas p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-fg">
                      <span>
                        {isBn ? '৩-কিস্তির পরিশোধ সূচি' : '3-Part Installment Schedule'}
                      </span>
                      <span className="text-accent">
                        ৳ {(activeInstallmentSchedule.threePart.totalMinor / 100).toLocaleString()}{' '}
                        {isBn ? 'মোট' : 'Total'}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {activeInstallmentSchedule.threePart.parts.map((part) => (
                        <div
                          key={part.partNumber}
                          className="flex justify-between items-center border-b border-border/50 py-1.5"
                        >
                          <span className="text-fg-muted">{part.label}</span>
                          <span className="font-mono font-semibold text-fg">
                            {part.amountFormatted}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {activeInstallmentSchedule.twoPart && (
                  <div className="rounded-xl border border-border bg-canvas p-4 space-y-3">
                    <div className="flex justify-between items-center text-sm font-bold text-fg">
                      <span>
                        {isBn ? '২-কিস্তির পরিশোধ সূচি' : '2-Part Installment Schedule'}
                      </span>
                      <span className="text-accent">
                        ৳ {(activeInstallmentSchedule.twoPart.totalMinor / 100).toLocaleString()}{' '}
                        {isBn ? 'মোট' : 'Total'}
                      </span>
                    </div>
                    <div className="space-y-2 text-xs">
                      {activeInstallmentSchedule.twoPart.parts.map((part) => (
                        <div
                          key={part.partNumber}
                          className="flex justify-between items-center border-b border-border/50 py-1.5"
                        >
                          <span className="text-fg-muted">{part.label}</span>
                          <span className="font-mono font-semibold text-fg">
                            {part.amountFormatted}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-[11px] text-fg-subtle leading-relaxed">
                  {isBn
                    ? 'দ্রষ্টব্য: প্রতিটি কিস্তির নির্ধারিত তারিখের পর ৩ দিনের গ্রেস পিরিয়ড প্রযোজ্য থাকে। এই সময়ে কনটেন্ট লাইব্রেরি অ্যাক্সেস সচল থাকবে।'
                    : 'Note: A 3-day grace window applies after each installment due date before live class access is paused. Content library access remains active.'}
                </div>

                <div className="flex justify-end gap-3 pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setInstallmentModalTier(null)}
                  >
                    {isBn ? 'বন্ধ করুন' : 'Close'}
                  </Button>
                  <Link
                    href={`/checkout?plan=${activeInstallmentSchedule.threePart?.productSlug || 'live'}`}
                  >
                    <Button size="sm">{isBn ? 'বিকাশে এগিয়ে যান' : 'Proceed with bKash'}</Button>
                  </Link>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
