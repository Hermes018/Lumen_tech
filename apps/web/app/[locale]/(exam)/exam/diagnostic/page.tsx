/** @purpose Guest GRE Express Diagnostic CBT Runner & Gated Results Claim Gate with full EN/BN Bilingual Question & Hint Support (D4, 02 §6, P2.6.1) */
'use client';

import * as React from 'react';
import { useLocale } from 'next-intl';
import { Link } from '@/src/i18n/routing';
import {
  createGuestDiagnosticSession,
  submitGuestDiagnostic,
  claimDiagnosticAttempt,
  type DiagnosticAttemptRecord,
  type GuestDiagnosticSession,
} from '@lumen/core';
import { Button, Badge, Card, CardHeader, CardTitle, CardContent, MathText } from '@lumen/ui';
import { GreCalculator, HintLadder, type HintItem } from '@lumen/ui';
import {
  Calculator as CalcIcon,
  Clock,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  ArrowLeft,
  Lock,
  Unlock,
  RotateCcw,
  Languages,
} from 'lucide-react';

interface BilingualDiagnosticItemContent {
  promptBn: string;
  quantityABn?: string;
  quantityBBn?: string;
  optionsBn: Record<string, string>;
  hintsEn: HintItem[];
  hintsBn: HintItem[];
  trapLabelBn: string;
  trapDescriptionBn: string;
}

const DIAGNOSTIC_BILINGUAL_MAP: Record<string, BilingualDiagnosticItemContent> = {
  'diag-q-01': {
    promptBn: 'ধরি $x$ একটি পূর্ণসংখ্যা যেখানে $x^2 = 16$।',
    quantityABn: '$x$',
    quantityBBn: '$0$',
    optionsBn: {
      A: 'রাশি A আপনার চেয়ে বড় (Quantity A বড়)।',
      B: 'রাশি B বড়।',
      C: 'দুটি রাশি সমান।',
      D: 'প্রদত্ত তথ্য থেকে সম্পর্ক নির্ণয় করা সম্ভব নয়।',
    },
    hintsEn: [
      {
        tier: 1,
        label: 'Concept: Quadratic Roots',
        content_md:
          'Any equation of the form $x^2 = k$ ($k > 0$) has two real roots: $+\\sqrt{k}$ and $-\\sqrt{k}$.',
      },
      {
        tier: 2,
        label: 'Setup: Solve for x',
        content_md: 'From $x^2 = 16$, $x$ can be either $+4$ or $-4$.',
      },
      {
        tier: 3,
        label: 'Bridge: Compare Both Cases',
        content_md:
          'If $x = +4$, Quantity A > Quantity B ($0$). If $x = -4$, Quantity A < Quantity B ($0$). Thus the relationship cannot be determined **(D)**.',
      },
    ],
    hintsBn: [
      {
        tier: 1,
        label: 'ধারণা (Concept): দ্বিঘাত সমীকরণের মূল',
        content_md:
          '$x^2 = k$ ($k > 0$) আকারের সমীকরণের দুটি বাস্তব মূল থাকে: $+\\sqrt{k}$ এবং $-\\sqrt{k}$।',
      },
      {
        tier: 2,
        label: 'সমীকরণ গঠন (Setup): x-এর মান বের করুন',
        content_md: '$x^2 = 16$ থেকে পাওয়া যায় $x = +4$ অথবা $x = -4$।',
      },
      {
        tier: 3,
        label: 'সমাধানের সেতু (Bridge): উভয় ক্ষেত্র তুলনা করুন',
        content_md:
          'যদি $x = +4$ হয় তবে রাশি A > রাশি B ($0$)। আবার $x = -4$ হলে রাশি A < রাশি B ($0$)। তাই সম্পর্ক নির্ণয় করা সম্ভব নয় **(D)**।',
      },
    ],
    trapLabelBn: 'ধনাত্মক মূল পক্ষপাত ফাঁদ (Positive Root Bias Trap)',
    trapDescriptionBn: 'দ্বিঘাত সমীকরণ সমাধানের সময় ঋণাত্মক মূল ($x = \\pm 4$) উপেক্ষা করা।',
  },
  'diag-q-02': {
    promptBn: '$xy$-সমতলে $(2, 3)$ এবং $(5, 7)$ বিন্দু দুটির মধ্যকার দূরত্ব কত?',
    optionsBn: {
      A: '4',
      B: '5',
      C: '7',
      D: '25',
    },
    hintsEn: [
      {
        tier: 1,
        label: 'Concept: Distance Formula',
        content_md: 'Use $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$.',
      },
      {
        tier: 2,
        label: 'Setup: Coordinate Differences',
        content_md: '$\\Delta x = 5 - 2 = 3$ and $\\Delta y = 7 - 3 = 4$.',
      },
      {
        tier: 3,
        label: 'Bridge: 3-4-5 Right Triangle',
        content_md: '$d = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$ **(B)**.',
      },
    ],
    hintsBn: [
      {
        tier: 1,
        label: 'ধারণা (Concept): দূরত্বের সূত্র',
        content_md: 'দূরত্বের সূত্র ব্যবহার করুন: $d = \\sqrt{(x_2 - x_1)^2 + (y_2 - y_1)^2}$।',
      },
      {
        tier: 2,
        label: 'সমীকরণ গঠন (Setup): স্থানাঙ্কের পার্থক্য',
        content_md: '$\\Delta x = 5 - 2 = 3$ এবং $\\Delta y = 7 - 3 = 4$।',
      },
      {
        tier: 3,
        label: 'সমাধানের সেতু (Bridge): ৩-৪-৫ সমকোণী ত্রিভুজ',
        content_md: '$d = \\sqrt{3^2 + 4^2} = \\sqrt{9 + 16} = \\sqrt{25} = 5$ **(B)**।',
      },
    ],
    trapLabelBn: 'সরাসরি স্থানাঙ্ক যোগ করার ফাঁদ (Direct Coordinate Addition Trap)',
    trapDescriptionBn: 'বর্গের যোগফলের বর্গমূল না করে সরাসরি স্থানাঙ্কের পার্থক্য যোগ করা।',
  },
  'diag-q-03': {
    promptBn: 'একটি সেট $S$ ৫টি ক্রমিক বিজোড় পূর্ণসংখ্যা নিয়ে গঠিত।',
    quantityABn: 'সেট $S$-এর গড় (গাণিতিক গড়)',
    quantityBBn: 'সেট $S$-এর মধ্যক (Median)',
    optionsBn: {
      A: 'রাশি A আপনার চেয়ে বড় (Quantity A বড়)।',
      B: 'রাশি B বড়।',
      C: 'দুটি রাশি সমান।',
      D: 'প্রদত্ত তথ্য থেকে সম্পর্ক নির্ণয় করা সম্ভব নয়।',
    },
    hintsEn: [
      {
        tier: 1,
        label: 'Concept: Evenly Spaced Sets',
        content_md: 'Consecutive odd integers form an arithmetic progression with a constant gap of $2$.',
      },
      {
        tier: 2,
        label: 'Setup: Symmetric Property',
        content_md: 'In any symmetrically spaced set of numbers, Mean = Median.',
      },
      {
        tier: 3,
        label: 'Bridge: Test with Sample Numbers',
        content_md:
          'For $\\{1, 3, 5, 7, 9\\}$, the mean is $5$ and the median is $5$. Thus the two quantities are always equal **(C)**.',
      },
    ],
    hintsBn: [
      {
        tier: 1,
        label: 'ধারণা (Concept): সমান্তর ধারা',
        content_md: 'ক্রমিক বিজোড় পূর্ণসংখ্যাগুলো $2$ সাধারণ অন্তরবিশিষ্ট একটি সমান্তর ধারা গঠন করে।',
      },
      {
        tier: 2,
        label: 'সমীকরণ গঠন (Setup): প্রতিসম বৈশিষ্ট্য',
        content_md: 'যেকোনো সমভাবে বিন্যস্ত সংখ্যা সেটে গড় (Mean) এবং মধ্যক (Median) সর্বদা সমান হয়।',
      },
      {
        tier: 3,
        label: 'সমাধানের সেতু (Bridge): উদাহরণ দিয়ে যাচাই',
        content_md:
          '$\\{1, 3, 5, 7, 9\\}$ সেটটির গড় $5$ এবং মধ্যকও $5$। সুতরাং দুটি রাশি সর্বদা সমান **(C)**।',
      },
    ],
    trapLabelBn: 'প্রতিসম ধারা বিভ্রান্তি ফাঁদ (Symmetric Sequence Trap)',
    trapDescriptionBn: 'সমভাবে বিন্যস্ত সেটে গড় ও মধ্যক সর্বদা সমান—এই বৈশিষ্ট্যটি চিনতে না পারা।',
  },
  'diag-q-04': {
    promptBn:
      'নির্দিষ্ট হারে একা কাজ করলে মেশিন A একটি ট্যাংক ৩ ঘণ্টায় এবং মেশিন B তা ৬ ঘণ্টায় পূর্ণ করে। দুটি মেশিন একসাথে কাজ করলে ট্যাংকটি পূর্ণ হতে কত ঘণ্টা সময় লাগবে?',
    optionsBn: {
      A: '১.৫ ঘণ্টা (1.5 hours)',
      B: '২ ঘণ্টা (2 hours)',
      C: '৪.৫ ঘণ্টা (4.5 hours)',
      D: '৯ ঘণ্টা (9 hours)',
    },
    hintsEn: [
      {
        tier: 1,
        label: 'Concept: Combined Work Rates',
        content_md: 'Add rates (tank per hour), never raw times: $R_{total} = R_A + R_B$.',
      },
      {
        tier: 2,
        label: 'Setup: Reciprocal Equation',
        content_md: '$R_{total} = \\frac{1}{3} + \\frac{1}{6} = \\frac{2 + 1}{6} = \\frac{3}{6} = \\frac{1}{2}$ tank/hour.',
      },
      {
        tier: 3,
        label: 'Bridge: Invert Rate for Total Time',
        content_md: 'Time $= \\frac{1}{R_{total}} = 2$ hours **(B)**.',
      },
    ],
    hintsBn: [
      {
        tier: 1,
        label: 'ধারণা (Concept): সম্মিলিত কাজের হার',
        content_md: 'কাজের হার (প্রতি ঘণ্টায় ট্যাংকের অংশ) যোগ করুন, কখনো সরাসরি সময় যোগ করবেন না: $R_{total} = R_A + R_B$।',
      },
      {
        tier: 2,
        label: 'সমীকরণ গঠন (Setup): ভগ্নাংশের যোগফল',
        content_md: '$R_{total} = \\frac{1}{3} + \\frac{1}{6} = \\frac{2 + 1}{6} = \\frac{3}{6} = \\frac{1}{2}$ ট্যাংক/ঘণ্টা।',
      },
      {
        tier: 3,
        label: 'সমাধানের সেতু (Bridge): মোট সময় নির্ণয়',
        content_md: 'মোট সময় $= \\frac{1}{R_{total}} = 2$ ঘণ্টা **(B)**।',
      },
    ],
    trapLabelBn: 'সময় সরাসরি যোগ করার ফাঁদ (Additive Time Trap)',
    trapDescriptionBn: 'কাজের হারের ব্যস্তানুপাতিক যোগফল ($1/3 + 1/6 = 1/2$) না করে সরাসরি সময় যোগ বা গড় করা।',
  },
  'diag-v-01': {
    promptBn:
      'যদিও লেখকের প্রাথমিক অনুমানগুলোকে শুরুতে কল্পনাপ্রসূত বলে উড়িয়ে দেওয়া হয়েছিল, পরবর্তী গবেষণালব্ধ আবিষ্কারগুলো প্রমাণ করেছে যে তাঁর তত্ত্বগুলো ছিল বিস্ময়করভাবে ________ (Although the author’s early hypotheses were initially dismissed as fanciful, subsequent empirical discoveries demonstrated that her theories were remarkably ________.)।',
    optionsBn: {
      A: 'prescient (ভবিষ্যৎদ্রষ্টা / দূরদর্শী)',
      B: 'derivative (অনুকরণমূলক)',
      C: 'anachronistic (কালানুগ নয় এমন)',
      D: 'esoteric (দুর্বোধ্য / গূঢ়)',
    },
    hintsEn: [
      {
        tier: 1,
        label: 'Concept: Concession Pivot ("Although")',
        content_md: '"Although" signals a contrast between "dismissed as fanciful" and the blank.',
      },
      {
        tier: 2,
        label: 'Setup: Predict the Blank',
        content_md: 'Since later discoveries proved her right, her early theories were prophetic or foresightful.',
      },
      {
        tier: 3,
        label: 'Bridge: Match Vocabulary',
        content_md: '"Prescient" means having foresight or knowledge before events take place **(A)**.',
      },
    ],
    hintsBn: [
      {
        tier: 1,
        label: 'ধারণা (Concept): বিপরীতমুখী সংযোজক ("Although")',
        content_md: '"Although" শব্দটি "কল্পনাপ্রসূত বলে উড়িয়ে দেওয়া" এবং শূন্যস্থানের মধ্যে বিপরীত অর্থ নির্দেশ করে।',
      },
      {
        tier: 2,
        label: 'সমীকরণ গঠন (Setup): শব্দের অর্থ অনুমান',
        content_md: 'যেহেতু পরবর্তী আবিষ্কার তাঁর তত্ত্বকে সঠিক প্রমাণ করেছে, তাই তাঁর তত্ত্বগুলো ছিল দূরদর্শী।',
      },
      {
        tier: 3,
        label: 'সমাধানের সেতু (Bridge): সঠিক শব্দ নির্বাচন',
        content_md: '"Prescient" অর্থ ভবিষ্যৎদ্রষ্টা বা দূরদর্শী **(A)**।',
      },
    ],
    trapLabelBn: 'বিপরীত সংযোজক উপেক্ষা ফাঁদ (Concession Shift Contrast Trap)',
    trapDescriptionBn: '"Although" দ্বারা নেতিবাচক ("fanciful") থেকে ইতিবাচক ("prescient") অর্থে পরিবর্তন বুঝতে না পারা।',
  },
  'diag-v-02': {
    promptBn:
      'কূটনীতিক তাঁর ________ প্রকাশ্য বক্তব্যের জন্য পরিচিত ছিলেন; আনুষ্ঠানিক চুক্তি স্বাক্ষরের আগে তিনি ভূ-রাজনৈতিক জোট নিয়ে কোনো অনুমান করতে রাজি হতেন না (The diplomat was known for her ________ public statements, refusing to speculate on geopolitical alliances before formal treaty signatures.)।',
    optionsBn: {
      A: 'circumspect (সতর্ক / বিচক্ষণ)',
      B: 'prudent (বিচক্ষণ / দূরদর্শী)',
      C: 'audacious (দুঃসাহসী)',
      D: 'loquacious (বাচাল)',
      E: 'pugnacious (কলহপ্রিয়)',
    },
    hintsEn: [
      {
        tier: 1,
        label: 'Concept: Clue after the Comma',
        content_md: '"Refusing to speculate... before formal treaty signatures" defines the diplomat’s cautious nature.',
      },
      {
        tier: 2,
        label: 'Setup: Synonym Pair Required (SE)',
        content_md: 'Find two words meaning cautious, careful, or discreet.',
      },
      {
        tier: 3,
        label: 'Bridge: Select the Pair',
        content_md: 'Both "circumspect" **(A)** and "prudent" **(B)** mean cautious and well-considered.',
      },
    ],
    hintsBn: [
      {
        tier: 1,
        label: 'ধারণা (Concept): কমার পরের সূত্র',
        content_md: '"আনুষ্ঠানিক চুক্তির আগে অনুমান করতে রাজি না হওয়া" কূটনীতিকের সতর্ক স্বভাব নির্দেশ করে।',
      },
      {
        tier: 2,
        label: 'সমীকরণ গঠন (Setup): সমার্থক শব্দজোড় (SE)',
        content_md: 'সতর্ক বা বিচক্ষণ অর্থ প্রকাশ করে এমন দুটি সমার্থক শব্দ খুঁজুন।',
      },
      {
        tier: 3,
        label: 'সমাধানের সেতু (Bridge): সঠিক জোড় নির্বাচন',
        content_md: '"circumspect" **(A)** এবং "prudent" **(B)** উভয়ের অর্থই সতর্ক ও বিচক্ষণ।',
      },
    ],
    trapLabelBn: 'অপ্রাসঙ্গিক কঠিন শব্দ ফাঁদ (Extreme / Unrelated Vocabulary Trap)',
    trapDescriptionBn: 'সতর্ক প্রাসঙ্গিকতার বিপরীতে শ্রুতিমধুর কিন্তু ভুল শব্দ ("audacious" বা "loquacious") বেছে নেওয়া।',
  },
  'diag-v-03': {
    promptBn:
      'মোটেও ________ না হয়ে, কাউন্সিলের নতুন জোনিং নির্দেশিকাগুলো ছিল বিস্ময়করভাবে নমনীয়, যা বিচিত্র স্থাপত্যশৈলীকে স্থান দিয়েছে (Far from being ________, the council’s new zoning guidelines were surprisingly flexible, accommodating varied architectural aesthetics.)।',
    optionsBn: {
      A: 'dogmatic (কট্টর / অনমনীয়)',
      B: 'benign (সদয় / নিরীহ)',
      C: 'provisional (সাময়িক)',
      D: 'pellucid (স্বচ্ছ / স্পষ্ট)',
    },
    hintsEn: [
      {
        tier: 1,
        label: 'Concept: "Far from being" Inversion',
        content_md: '"Far from being [X]" contrasts directly with "surprisingly flexible".',
      },
      {
        tier: 2,
        label: 'Setup: Opposite of Flexible',
        content_md: 'The blank requires an adjective meaning rigid, inflexible, or authoritarian.',
      },
      {
        tier: 3,
        label: 'Bridge: Match Option',
        content_md: '"Dogmatic" means rigid and inflexible in rules **(A)**.',
      },
    ],
    hintsBn: [
      {
        tier: 1,
        label: 'ধারণা (Concept): "Far from being" বিপরীত সূত্র',
        content_md: '"Far from being [X]" বাক্যাংশটি "surprisingly flexible" (নমনীয়)-এর বিপরীত অর্থ চায়।',
      },
      {
        tier: 2,
        label: 'সমীকরণ গঠন (Setup): নমনীয়-এর বিপরীত শব্দ',
        content_md: 'শূন্যস্থানে এমন একটি শব্দ বসবে যার অর্থ কঠোর বা অনমনীয়।',
      },
      {
        tier: 3,
        label: 'সমাধানের সেতু (Bridge): সঠিক অপশন নির্বাচন',
        content_md: '"Dogmatic" অর্থ নিয়মনীতিতে কট্টর ও অনমনীয় **(A)**।',
      },
    ],
    trapLabelBn: 'দ্বৈত নেতিবাচক বিভ্রান্তি ফাঁদ (Far From Inversion Trap)',
    trapDescriptionBn: '"Far from being [X]" দ্বারা নমনীয়র বিপরীত অর্থাৎ কঠোর/dogmatic শব্দ প্রয়োজন তা ধরতে না পারা।',
  },
  'diag-v-04': {
    promptBn:
      'সংক্ষিপ্ত অনুচ্ছেদ: বিংশ শতাব্দীর শুরুর দিকের অর্থনীতিবিদরা ধরে নিয়েছিলেন যে প্রাকৃতিক সম্পদ উত্তোলন স্থায়ী জাতীয় সমৃদ্ধি বয়ে আনে; কিন্তু আধুনিক "রিসোর্স কার্স" (সম্পদ অভিশাপ) গবেষণা দেখায় যে অস্থিতিশীল কাঁচামাল রপ্তানির জোয়ার উৎপাদনমুখী শিল্পের উদ্ভাবনকে বাধাগ্রস্ত করে। অনুচ্ছেদটির মূল উদ্দেশ্য হলো:',
    optionsBn: {
      A: 'একটি পুরাতন অর্থনৈতিক ধারণার সাথে বিপরীতমুখী আধুনিক গবেষণালব্ধ ফলাফলের তুলনা করা।',
      B: 'আধুনিক সমালোচকদের বিরুদ্ধে বিংশ শতাব্দীর সম্পদ উত্তোলন নীতি রক্ষা করা।',
      C: 'খনিজ সম্পদের ওপর নতুন কর ব্যবস্থার প্রস্তাব করা।',
      D: 'খনন শিল্পের চেয়ে উৎপাদনমুখী শিল্প সহজাতভাবে শ্রেষ্ঠ তা প্রমাণ করা।',
    },
    hintsEn: [
      {
        tier: 1,
        label: 'Concept: Primary Purpose Structure',
        content_md: 'The sentence begins with "While [old view], [modern literature argues counter-view]".',
      },
      {
        tier: 2,
        label: 'Setup: Avoid Extreme Scope Traps',
        content_md: 'The passage neither proposes taxes (C) nor claims absolute superiority (D).',
      },
      {
        tier: 3,
        label: 'Bridge: Select Balanced Summary',
        content_md: 'Option **(A)** accurately captures the contrast between the older presumption and the counter-finding.',
      },
    ],
    hintsBn: [
      {
        tier: 1,
        label: 'ধারণা (Concept): মূল উদ্দেশ্যের কাঠামো',
        content_md: 'অনুচ্ছেদটি "যদিও [পুরাতন ধারণা], আধুনিক গবেষণা [বিপরীত ফলাফল] দেখায়" কাঠামোতে লেখা।',
      },
      {
        tier: 2,
        label: 'সমীকরণ গঠন (Setup): চরম দাবি পরিহার করুন',
        content_md: 'অনুচ্ছেদে নতুন করের প্রস্তাব (C) বা চরম শ্রেষ্ঠত্বের প্রমাণ (D) দাবি করা হয়নি।',
      },
      {
        tier: 3,
        label: 'সমাধানের সেতু (Bridge): ভারসাম্যপূর্ণ সারসংক্ষেপ',
        content_md: 'অপশন **(A)** পুরাতন অর্থনৈতিক ধারণা ও বিপরীত গবেষণালব্ধ ফলাফলের তুলনাকে সঠিকভাবে প্রকাশ করে।',
      },
    ],
    trapLabelBn: 'মূল উদ্দেশ্য পরিধি সম্প্রসারণ ফাঁদ (Primary Purpose Scope Expansion)',
    trapDescriptionBn: 'অনুচ্ছেদে বলা হয়নি এমন চরম দাবি ("উৎপাদনমুখী শিল্প সহজাতভাবে শ্রেষ্ঠ") সম্বলিত অপশন বেছে নেওয়া।',
  },
};

export default function DiagnosticExamPage() {
  const locale = useLocale();
  const isBnLocale = locale === 'bn';

  // When locale === 'bn', default question display to Bengali with a clean toggle for English
  const [showOriginalEnglish, setShowOriginalEnglish] = React.useState<boolean>(false);
  const displayBn = isBnLocale && !showOriginalEnglish;

  const [session, setSession] = React.useState<GuestDiagnosticSession | null>(null);
  const [currentIndex, setCurrentIndex] = React.useState<number>(0);
  const [userAnswers, setUserAnswers] = React.useState<Record<string, string | string[]>>({});
  const [timeRemaining, setTimeRemaining] = React.useState<number>(900); // 15:00
  const [isCalculatorOpen, setIsCalculatorOpen] = React.useState<boolean>(false);
  const [submittedResult, setSubmittedResult] = React.useState<DiagnosticAttemptRecord | null>(null);
  const [simulatedDatabase, setSimulatedDatabase] = React.useState<Map<string, DiagnosticAttemptRecord>>(
    new Map()
  );

  // Per-question progressive hint ladder state inside Diagnostic Runner
  const [revealedHintsByQuestion, setRevealedHintsByQuestion] = React.useState<
    Record<string, number[]>
  >({});
  const [hintBudget, setHintBudget] = React.useState<number>(6);

  // Initialize guest session on mount
  React.useEffect(() => {
    const s = createGuestDiagnosticSession();
    setSession(s);
  }, []);

  // Timer countdown
  React.useEffect(() => {
    if (submittedResult || timeRemaining <= 0) return;
    const interval = setInterval(() => {
      setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [submittedResult, timeRemaining]);

  if (!session) {
    return (
      <div className="p-8 text-center text-sm text-[#444]">
        {isBnLocale
          ? 'জিআরই এক্সপ্রেস ডায়াগনস্টিক লোড হচ্ছে...'
          : 'Loading GRE Express Diagnostic...'}
      </div>
    );
  }

  const currentQuestion = session.questions[currentIndex];
  if (!currentQuestion && !submittedResult) {
    return (
      <div className="p-8 text-center text-sm text-[#444]">
        {isBnLocale ? 'প্রশ্নটি পাওয়া যায়নি।' : 'Question not found.'}
      </div>
    );
  }

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectOption = (choiceId: string) => {
    if (!currentQuestion) return;
    if (currentQuestion.type === 'se') {
      // Sentence equivalence allows up to 2 choices
      const currentChoices = (userAnswers[currentQuestion.id] as string[]) || [];
      if (currentChoices.includes(choiceId)) {
        setUserAnswers((prev) => ({
          ...prev,
          [currentQuestion.id]: currentChoices.filter((c) => c !== choiceId),
        }));
      } else {
        if (currentChoices.length < 2) {
          setUserAnswers((prev) => ({
            ...prev,
            [currentQuestion.id]: [...currentChoices, choiceId],
          }));
        }
      }
    } else {
      setUserAnswers((prev) => ({
        ...prev,
        [currentQuestion.id]: choiceId,
      }));
    }
  };

  const handleRevealHintForCurrent = () => {
    if (!currentQuestion || hintBudget <= 0) return;
    const currentRevealed = revealedHintsByQuestion[currentQuestion.id] || [];
    const nextTier = ([1, 2, 3] as const).find((t) => !currentRevealed.includes(t));
    if (nextTier) {
      setRevealedHintsByQuestion((prev) => ({
        ...prev,
        [currentQuestion.id]: [...currentRevealed, nextTier],
      }));
      setHintBudget((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    const record = submitGuestDiagnostic(session.guestToken, userAnswers);
    const db = new Map(simulatedDatabase);
    db.set(session.guestToken, record);
    setSimulatedDatabase(db);
    setSubmittedResult(record);
  };

  const handleClaim = () => {
    if (!submittedResult) return;
    const updated = claimDiagnosticAttempt(
      session.guestToken,
      'usr_new_student_789',
      simulatedDatabase
    );
    setSubmittedResult({ ...updated });
  };

  const handleRestart = () => {
    const s = createGuestDiagnosticSession();
    setSession(s);
    setCurrentIndex(0);
    setUserAnswers({});
    setRevealedHintsByQuestion({});
    setHintBudget(6);
    setTimeRemaining(900);
    setSubmittedResult(null);
  };

  // RENDER RESULTS SCREEN IF SUBMITTED
  if (submittedResult) {
    const { scoreSummary, gated, itemByItemBreakdown, personalizedStudyPlan } = submittedResult;

    return (
      <div
        className="mx-auto max-w-4xl p-6 space-y-8 bg-[#fdfdfd] min-h-screen"
        data-locale={locale}
      >
        {/* Results Header */}
        <div className="text-center space-y-3 border-b pb-6">
          <Badge variant="outline" className="border-accent text-accent text-xs">
            {isBnLocale
              ? 'জিআরই ডায়াগনস্টিক মূল্যায়ন রিপোর্ট'
              : 'GRE Diagnostic Assessment Report'}
          </Badge>
          <h1 className="text-3xl font-extrabold text-[#111] sm:text-4xl">
            {isBnLocale
              ? 'আপনার ডায়াগনস্টিক দক্ষতা প্রোফাইল'
              : 'Your Diagnostic Ability Profile'}
          </h1>
          <p className="text-sm text-[#555] max-w-xl mx-auto">
            {isBnLocale
              ? 'ETS সেকশন-অ্যাডাপটিভ মানদণ্ড অনুযায়ী Rasch 1PL Expected A Posteriori (EAP) অ্যালগরিদমে প্রাক্কলিত।'
              : 'Calculated via Rasch 1PL Expected A Posteriori (EAP) ability estimation matching ETS section-adaptive norms.'}
          </p>
        </div>

        {/* Estimated Scores Grid */}
        <div className="grid gap-6 sm:grid-cols-3">
          <div className="rounded-xl border border-[#ddd] bg-white p-5 text-center shadow-xs">
            <div className="text-xs uppercase font-semibold text-[#666]">
              {isBnLocale ? 'আনুমানিক কোয়ান্ট (Quant)' : 'Estimated Quant'}
            </div>
            <div className="text-3xl font-black text-accent mt-1">
              {scoreSummary.quantScaledRange[0]} - {scoreSummary.quantScaledRange[1]}
            </div>
            <div className="text-xs text-[#888] mt-1">
              {isBnLocale
                ? `সঠিক উত্তর: ${scoreSummary.quantRaw} / ৪`
                : `Raw: ${scoreSummary.quantRaw} / 4 Correct`}
            </div>
          </div>

          <div className="rounded-xl border border-[#ddd] bg-white p-5 text-center shadow-xs">
            <div className="text-xs uppercase font-semibold text-[#666]">
              {isBnLocale ? 'আনুমানিক ভার্বাল (Verbal)' : 'Estimated Verbal'}
            </div>
            <div className="text-3xl font-black text-accent mt-1">
              {scoreSummary.verbalScaledRange[0]} - {scoreSummary.verbalScaledRange[1]}
            </div>
            <div className="text-xs text-[#888] mt-1">
              {isBnLocale
                ? `সঠিক উত্তর: ${scoreSummary.verbalRaw} / ৪`
                : `Raw: ${scoreSummary.verbalRaw} / 4 Correct`}
            </div>
          </div>

          <div className="rounded-xl border border-accent/40 bg-accent/5 p-5 text-center shadow-xs">
            <div className="text-xs uppercase font-semibold text-accent">
              {isBnLocale ? 'মোট আনুমানিক জিআরই স্কোর' : 'Total Estimated GRE'}
            </div>
            <div className="text-3xl font-black text-[#111] mt-1">
              {scoreSummary.overallEstimatedRange[0]} - {scoreSummary.overallEstimatedRange[1]}
            </div>
            <div className="text-xs text-accent mt-1">
              {isBnLocale ? '৩৪০ স্কেলের মধ্যে' : 'Out of 340 Scale'}
            </div>
          </div>
        </div>

        {/* Top Trap Archetype Callout */}
        <div className="rounded-xl border border-warning/40 bg-warning-soft/60 p-5 space-y-2">
          <div className="flex items-center gap-2 text-warning font-bold text-sm">
            <ShieldAlert className="h-5 w-5" />
            <span>
              {isBnLocale
                ? `শনাক্তকৃত প্রধান ডিস্ট্রাক্টর ফাঁদ: ${scoreSummary.topTrapArchetype.label}`
                : `Primary Cognitive Trap Identified: ${scoreSummary.topTrapArchetype.label}`}
            </span>
          </div>
          <p className="text-xs text-[#444] leading-relaxed">
            <MathText content={scoreSummary.topTrapArchetype.description} />
          </p>
        </div>

        {/* Recommended Track */}
        <div className="rounded-xl border border-[#ddd] bg-white p-5 space-y-2">
          <div className="text-xs uppercase font-semibold text-[#666]">
            {isBnLocale ? 'সুপারিশকৃত প্রস্তুতি ট্র্যাক' : 'Recommended Track'}
          </div>
          <div className="text-base font-bold text-[#111]">{scoreSummary.recommendedTrack}</div>
          <p className="text-xs text-[#666]">
            {isBnLocale
              ? 'এই ডায়াগনস্টিক সেটে আপনার গতি, নির্ভুলতা এবং ডিস্ট্রাক্টর ফাঁদের প্রবণতার ওপর ভিত্তি করে নির্ধারিত।'
              : 'Based on your speed, accuracy, and vulnerability to distractor patterns in this diagnostic set.'}
          </p>
        </div>

        {/* GATED SECTION: Study Plan & Item Breakdown */}
        <div className="space-y-6 relative">
          {gated ? (
            /* GATE OVERLAY */
            <div className="rounded-2xl border-2 border-dashed border-accent/40 bg-white p-8 text-center space-y-6 shadow-sm">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
                <Lock className="h-6 w-6" />
              </div>
              <div className="space-y-2 max-w-md mx-auto">
                <h3 className="text-xl font-bold text-[#111]">
                  {isBnLocale
                    ? 'বিস্তারিত সমাধান ও স্টাডি প্ল্যান আনলক করুন'
                    : 'Full Item Breakdown & Study Plan Gated'}
                </h3>
                <p className="text-xs text-[#555] leading-relaxed">
                  {isBnLocale
                    ? 'গেস্ট ইউজার হিসেবে উপরে আপনার প্রাথমিক স্কোর দেখানো হয়েছে। প্রতিটি প্রশ্নের ব্যাখ্যাসহ সমাধান, ট্র্যাপ বিশ্লেষণ এবং ৮-সপ্তাহের ব্যক্তিগত স্টাডি প্ল্যান আনলক করতে এখনই ফ্রি অ্যাকাউন্ট খুলুন।'
                    : 'As an unauthenticated guest, your high-level ability score is shown above. To unlock item-by-item solutions, trap forensics, and your personalized 8-week Study Plan, create your free account now.'}
                </p>
              </div>

              <div className="flex flex-wrap justify-center gap-4">
                <Link href={`/sign-up?diagnosticToken=${encodeURIComponent(session.guestToken)}`}>
                  <Button size="lg" className="gap-2 font-semibold">
                    {isBnLocale
                      ? 'ফলাফল সংরক্ষণ করতে ফ্রি সাইন-আপ করুন'
                      : 'Sign Up Free to Claim Results'}{' '}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleClaim}
                  className="gap-2 border-accent text-accent hover:bg-accent/10"
                >
                  <Unlock className="h-4 w-4" />{' '}
                  {isBnLocale
                    ? 'এখনই ফলাফল আনলক করুন (ডেমো সাইন-ইন)'
                    : 'Claim Results Now (Simulate Sign-In)'}
                </Button>
              </div>
            </div>
          ) : (
            /* UNLOCKED SECTION */
            <div className="space-y-6 animate-in fade-in duration-300">
              <div className="rounded-xl border border-success/40 bg-success-soft/70 p-4 flex items-center justify-between">
                <div className="flex items-center gap-2 text-success font-semibold text-sm">
                  <CheckCircle2 className="h-5 w-5" />
                  <span>
                    {isBnLocale
                      ? 'ফলাফল সংরক্ষিত হয়েছে! বিস্তারিত সমাধান ও স্টাডি প্ল্যান আনলক করা হয়েছে।'
                      : 'Attempt Claimed! Full Breakdown & Study Plan Unlocked.'}
                  </span>
                </div>
                <Badge variant="outline" className="border-success text-success text-xs">
                  {isBnLocale ? 'অ্যাকাউন্ট সংযুক্ত' : 'Account Linked'}
                </Badge>
              </div>

              {/* Study Plan Preview */}
              {personalizedStudyPlan && (
                <Card className="border-[#ddd] bg-white">
                  <CardHeader>
                    <CardTitle className="text-base font-bold text-[#111]">
                      {isBnLocale
                        ? `আপনার ব্যক্তিগত ${personalizedStudyPlan.recommendedWeeks}-সপ্তাহের স্টাডি প্ল্যান`
                        : `Your Personalized ${personalizedStudyPlan.recommendedWeeks}-Week Study Plan`}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3 text-xs text-[#333]">
                    <div>
                      {isBnLocale ? 'লক্ষ্য স্কেলড স্কোর:' : 'Target Scaled Score:'}{' '}
                      <span className="font-bold">{personalizedStudyPlan.targetScore}</span>
                    </div>
                    <div className="space-y-1">
                      <div className="font-semibold text-[#555]">
                        {isBnLocale ? 'অগ্রাধিকার ক্ষেত্রসমূহ:' : 'Focus Priority Areas:'}
                      </div>
                      <ul className="list-disc list-inside space-y-0.5 text-[#444]">
                        {personalizedStudyPlan.focusAreas.map((area, i) => (
                          <li key={i}>{area}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Detailed Item Solutions */}
              <div className="space-y-4">
                <h3 className="text-base font-bold text-[#111]">
                  {isBnLocale
                    ? 'প্রশ্নভিত্তিক পর্যালোচনা ও সমাধান'
                    : 'Item-by-Item Review & Solutions'}
                </h3>
                <div className="space-y-3">
                  {itemByItemBreakdown?.map((item, idx) => {
                    const bnItem = DIAGNOSTIC_BILINGUAL_MAP[item.questionId];
                    const trapLabel =
                      isBnLocale && bnItem
                        ? bnItem.trapLabelBn
                        : item.trapTriggered?.label;
                    const trapDesc =
                      isBnLocale && bnItem
                        ? bnItem.trapDescriptionBn
                        : item.trapTriggered?.description;

                    return (
                      <div
                        key={item.questionId}
                        className={`rounded-lg border p-4 text-xs space-y-2 ${
                          item.isCorrect
                            ? 'border-success/30 bg-success-soft/30'
                            : 'border-danger/30 bg-danger-soft/30'
                        }`}
                      >
                        <div className="flex items-center justify-between font-semibold">
                          <span>
                            {isBnLocale ? `প্রশ্ন ${idx + 1}` : `Question ${idx + 1}`} (
                            {item.measure.toUpperCase()})
                          </span>
                          <span className={item.isCorrect ? 'text-success' : 'text-danger'}>
                            {item.isCorrect
                              ? isBnLocale
                                ? 'সঠিক'
                                : 'Correct'
                              : isBnLocale
                                ? 'ভুল'
                                : 'Incorrect'}
                          </span>
                        </div>
                        <div className="text-[#555]">
                          {isBnLocale ? 'আপনার উত্তর:' : 'Your Answer:'}{' '}
                          <span className="font-mono">
                            {Array.isArray(item.userAnswer)
                              ? item.userAnswer.join(', ')
                              : item.userAnswer || (isBnLocale ? '(উত্তর দেওয়া হয়নি)' : '(unanswered)')}
                          </span>{' '}
                          | {isBnLocale ? 'সঠিক উত্তর:' : 'Correct Answer:'}{' '}
                          <span className="font-mono font-bold">
                            {Array.isArray(item.correctAnswer)
                              ? item.correctAnswer.join(', ')
                              : item.correctAnswer}
                          </span>
                        </div>
                        {item.trapTriggered && trapLabel && trapDesc && (
                          <div className="rounded bg-warning/15 p-2 text-warning font-medium">
                            {isBnLocale ? 'ডিস্ট্রাক্টর ফাঁদ:' : 'Cognitive Trap:'} {trapLabel} —{' '}
                            <MathText content={trapDesc} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex justify-between items-center border-t pt-4 text-xs">
          <Button variant="outline" size="sm" onClick={handleRestart} className="gap-2">
            <RotateCcw className="h-4 w-4" />{' '}
            {isBnLocale ? 'ডায়াগনস্টিক পুনরায় দিন' : 'Retake Diagnostic'}
          </Button>
          <Link href="/pricing">
            <Button size="sm" className="gap-2">
              {isBnLocale ? 'সুপারিশকৃত প্ল্যানগুলো দেখুন' : 'View Recommended Plans'}{' '}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  // RENDER CBT RUNNER INTERFACE
  if (!currentQuestion) {
    return <div className="p-8 text-center text-sm text-[#444]">Question not found.</div>;
  }

  const selectedAnswer = userAnswers[currentQuestion.id];
  const bnContent = DIAGNOSTIC_BILINGUAL_MAP[currentQuestion.id];
  const promptText = displayBn && bnContent ? bnContent.promptBn : currentQuestion.prompt;
  const quantityAText =
    displayBn && bnContent?.quantityABn ? bnContent.quantityABn : currentQuestion.quantityA;
  const quantityBText =
    displayBn && bnContent?.quantityBBn ? bnContent.quantityBBn : currentQuestion.quantityB;
  const activeHints =
    bnContent ? (displayBn ? bnContent.hintsBn : bnContent.hintsEn) : [];
  const currentRevealedTiers = revealedHintsByQuestion[currentQuestion.id] || [];

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f5f5] text-[#222]" data-locale={locale}>
      {/* ETS CBT Top Control Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#ccc] bg-[#e8e8e8] px-4 py-2 text-xs font-medium">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#111]">
            {displayBn
              ? `জিআরই এক্সপ্রেস ডায়াগনস্টিক (প্রশ্ন ${currentIndex + 1} / ${session.questions.length})`
              : `GRE Express Diagnostic (Question ${currentIndex + 1} of ${session.questions.length})`}
          </span>
          <Badge variant="outline" className="border-[#999] text-[#444] text-[10px]">
            {currentQuestion.measure === 'quant'
              ? displayBn
                ? 'কোয়ান্টিটেটিভ (Quant)'
                : 'Quantitative'
              : displayBn
                ? 'ভার্বাল (Verbal)'
                : 'Verbal'}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          {isBnLocale && (
            <button
              type="button"
              onClick={() => setShowOriginalEnglish((prev) => !prev)}
              className="flex items-center gap-1.5 rounded border border-indigo-300 bg-white px-2.5 py-1 text-xs font-semibold text-indigo-950 hover:bg-indigo-50"
            >
              <Languages className="h-3.5 w-3.5 text-blue-600" />
              <span>
                {showOriginalEnglish
                  ? 'বাংলা অনুবাদ দেখুন / Show Bengali'
                  : 'ইংরেজি মূল প্রশ্ন দেখুন / Show Original English'}
              </span>
            </button>
          )}

          {/* Timer Display */}
          <div className="flex items-center gap-1.5 rounded border border-[#bbb] bg-white px-2.5 py-1 font-mono font-bold text-[#111]">
            <Clock className="h-3.5 w-3.5 text-[#555]" />
            <span>{formatTimer(timeRemaining)}</span>
          </div>

          {/* Calculator Toggle (Quant only) */}
          {currentQuestion.measure === 'quant' && (
            <button
              type="button"
              onClick={() => setIsCalculatorOpen(!isCalculatorOpen)}
              className="flex items-center gap-1 rounded border border-[#bbb] bg-[#f9f9f9] px-2 py-1 text-[#333] hover:bg-[#e0e0e0]"
            >
              <CalcIcon className="h-3.5 w-3.5" />
              <span>{displayBn ? 'ক্যালকুলেটর' : 'Calculator'}</span>
            </button>
          )}
        </div>
      </div>

      {/* Main CBT Workspace */}
      <div className="flex-1 p-6 max-w-4xl mx-auto w-full space-y-6">
        {/* On-Screen Calculator Floating Modal */}
        {isCalculatorOpen && (
          <div className="fixed top-16 right-8 z-50 shadow-2xl">
            <GreCalculator
              isOpen={isCalculatorOpen}
              onTransferDisplay={() => {
                setIsCalculatorOpen(false);
              }}
              onClose={() => setIsCalculatorOpen(false)}
            />
          </div>
        )}

        {/* Question Card */}
        <div className="rounded-xl border border-[#ccc] bg-white p-6 shadow-xs space-y-6">
          <div className="text-sm font-medium leading-relaxed text-[#111]">
            <MathText content={promptText} />
          </div>

          {/* QC Column Layout if type is QC */}
          {currentQuestion.type === 'qc' && quantityAText && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 rounded-lg border border-[#eee] bg-[#fafafa] p-4 text-center">
              <div className="border-r border-[#eee] pr-4">
                <div className="text-xs uppercase font-semibold text-[#777]">
                  {displayBn ? 'রাশি A (Quantity A)' : 'Quantity A'}
                </div>
                <div className="text-base font-bold text-[#111] mt-1">
                  <MathText content={quantityAText} />
                </div>
              </div>
              <div>
                <div className="text-xs uppercase font-semibold text-[#777]">
                  {displayBn ? 'রাশি B (Quantity B)' : 'Quantity B'}
                </div>
                <div className="text-base font-bold text-[#111] mt-1">
                  <MathText content={quantityBText} />
                </div>
              </div>
            </div>
          )}

          {/* Choices */}
          <div className="space-y-2">
            {currentQuestion.options.map((opt) => {
              const isSelected =
                currentQuestion.type === 'se'
                  ? Array.isArray(selectedAnswer) && selectedAnswer.includes(opt.id)
                  : selectedAnswer === opt.id;
              const optionText =
                displayBn && bnContent?.optionsBn[opt.id]
                  ? bnContent.optionsBn[opt.id]!
                  : opt.text;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => handleSelectOption(opt.id)}
                  className={`flex w-full items-center justify-between rounded-lg border p-3 text-left text-sm transition-colors ${
                    isSelected
                      ? 'border-accent bg-accent/10 font-medium text-[#111]'
                      : 'border-[#ddd] hover:bg-[#fafafa] text-[#333]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-6 w-6 items-center justify-center rounded-full border border-[#bbb] font-mono text-xs font-semibold">
                      {opt.id}
                    </span>
                    <span>
                      <MathText content={optionText} />
                    </span>
                  </div>
                  {isSelected && <CheckCircle2 className="h-4 w-4 text-accent" />}
                </button>
              );
            })}
          </div>

          {currentQuestion.type === 'se' && (
            <p className="text-[11px] text-[#777]">
              {displayBn
                ? 'সমার্থক অর্থ প্রকাশ করে এমন ঠিক দুটি (TWO) উত্তর নির্বাচন করুন।'
                : 'Select exactly TWO answer choices that complete the sentence with equivalent meaning.'}
            </p>
          )}

          {/* 3-Tier Progressive Hint Ladder inside Diagnostic Runner */}
          {activeHints.length > 0 && (
            <div className="border-t border-[#eee] pt-4">
              <HintLadder
                hints={activeHints}
                revealedTiers={currentRevealedTiers}
                hintBudgetRemaining={hintBudget}
                totalHintBudget={6}
                onRevealNextHint={handleRevealHintForCurrent}
                disabled={hintBudget <= 0}
              />
            </div>
          )}
        </div>

        {/* Question Palette Strip */}
        <div className="flex items-center justify-center gap-2 pt-2">
          {session.questions.map((q, idx) => {
            const answered =
              q.type === 'se'
                ? Array.isArray(userAnswers[q.id]) && (userAnswers[q.id] as string[]).length === 2
                : !!userAnswers[q.id];
            const isCurrent = idx === currentIndex;

            return (
              <button
                key={q.id}
                type="button"
                onClick={() => setCurrentIndex(idx)}
                className={`h-7 w-7 rounded font-mono text-xs font-semibold transition-all ${
                  isCurrent
                    ? 'ring-2 ring-accent bg-accent text-accent-fg'
                    : answered
                      ? 'bg-[#333] text-white'
                      : 'bg-[#ddd] text-[#555] hover:bg-[#ccc]'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>

        {/* Bottom Navigation Toolbar */}
        <div className="flex items-center justify-between border-t border-[#ccc] pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="gap-1.5"
          >
            <ArrowLeft className="h-4 w-4" /> {displayBn ? 'পূর্ববর্তী' : 'Previous'}
          </Button>

          {currentIndex < session.questions.length - 1 ? (
            <Button
              size="sm"
              onClick={() =>
                setCurrentIndex((prev) => Math.min(session.questions.length - 1, prev + 1))
              }
              className="gap-1.5"
            >
              {displayBn ? 'পরবর্তী' : 'Next'} <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              onClick={handleSubmit}
              className="gap-1.5 bg-accent text-accent-fg font-bold"
            >
              {displayBn ? 'ডায়াগনস্টিক টেস্ট সাবমিট করুন' : 'Submit Diagnostic Test'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
