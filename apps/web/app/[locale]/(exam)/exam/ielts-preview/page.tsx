/** @purpose CD-IELTS Official-Format Split-Screen Simulator (/exam/ielts-preview) with Listening, Reading, Writing, and Speaking interactive workbenches */
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useLocale } from 'next-intl';
import { LocaleLink as Link } from '../../../_components/LocaleLink';
import { LocaleSwitcher } from '../../../_components/LocaleSwitcher';
import { brand } from '@lumen/config';
import { LumenSparkMotif } from '@/src/components/ui/primitives';
import { IeltsListeningAudioEngine } from '@/src/components/exam/IeltsListeningAudioEngine';
import { countWords } from '@lumen/ai';
import {
  Clock,
  Eye,
  EyeOff,
  Highlighter,
  FileText,
  Type,
  Flag,
  Send,
  X,
  Edit3,
  GripVertical,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Volume2,
  BookOpen,
  Headphones,
  PenTool,
  Mic,
  CheckSquare,
  Square,
} from 'lucide-react';

type SkillTab = 'listening' | 'reading' | 'writing' | 'speaking';
type TextSize = 'standard' | 'large' | 'extralarge';
type HighlightColor = 'yellow' | 'coral';

interface HighlightEntry {
  text: string;
  color: HighlightColor;
}

interface ReadingTfngQuestion {
  num: number;
  textEn: string;
  textBn: string;
  correct: 'TRUE' | 'FALSE' | 'NOT GIVEN';
  explanationEn: string;
  explanationBn: string;
}

interface ReadingHeadingQuestion {
  num: number;
  paragraphLabel: string;
  textEn: string;
  textBn: string;
  correct: string;
  explanationEn: string;
  explanationBn: string;
}

interface ListeningCompletionQuestion {
  num: number;
  promptBeforeEn: string;
  promptAfterEn: string;
  promptBeforeBn: string;
  promptAfterBn: string;
  acceptedAnswers: string[];
  displayAnswer: string;
  explanationEn: string;
  explanationBn: string;
}

const PASSAGE_PARAGRAPHS = [
  {
    id: 'A',
    text: 'Bioluminescence—the production and emission of light by a living organism—is among the most prevalent biological adaptations in oceanic ecosystems. In the pelagic bathypelagic zone, where solar photons are completely absent, organisms have evolved autonomous luciferin-luciferase catalytic mechanisms.',
  },
  {
    id: 'B',
    text: 'Contrary to early 20th-century assumptions that deep-sea species inhabited an inert darkness, research reveals a dynamic sensory landscape where light flashes serve predator deterrence, mate recognition, and counterillumination camouflage. Counterillumination functions as an optical cloaking mechanism: organisms such as the midwater squid orient photophores ventrally, modulating luminous output to match downwelling ambient radiance and eliminate their silhouette when viewed from below.',
  },
  {
    id: 'C',
    text: 'Moreover, deep-water anglerfishes exploit symbiotic bioluminescent bacteria housed within an elongated dorsal spine known as the illicium. The luminous esca attracts inquisitive crustaceans directly toward the predator’s waiting jaws, demonstrating how microbial partnerships can power complex vertebrate hunting strategies.',
  },
];

const READING_TFNG: ReadingTfngQuestion[] = [
  {
    num: 1,
    textEn: 'Solar photons can still penetrate into the bathypelagic zone during peak daylight.',
    textBn: 'দিনের সর্বোচ্চ আলোতেও সোলার ফোটন বাথিপেলাজিক স্তরে প্রবেশ করতে পারে।',
    correct: 'FALSE',
    explanationEn: 'Paragraph A states that in the bathypelagic zone, "solar photons are completely absent."',
    explanationBn: 'অনুচ্ছেদ A-তে বলা হয়েছে যে বাথিপেলাজিক স্তরে সূর্যের ফোটন সম্পূর্ণভাবে অনুপস্থিত।',
  },
  {
    num: 2,
    textEn: 'Counterillumination works by matching ventral light output to downwelling radiance.',
    textBn: 'কাউন্টারইলুমিনেশন নিচের দিকের আলোর সাথে ভেন্ট্রাল আলো মিলিয়ে কাজ করে।',
    correct: 'TRUE',
    explanationEn: 'Paragraph B explains that midwater squid modulate luminous output to match downwelling ambient radiance.',
    explanationBn: 'অনুচ্ছেদ B-তে বলা হয়েছে মিডওয়াটার স্কুইড ওপর থেকে আসা আলোর সাথে নিজেদের আলো মিলিয়ে নেয়।',
  },
  {
    num: 3,
    textEn: 'The anglerfish illicium produces light exclusively through its own vertebrate enzymes without bacteria.',
    textBn: 'অ্যাংলারফিশের ইলিসিয়াম ব্যাকটেরিয়া ছাড়াই কেবল নিজস্ব এনজাইমের মাধ্যমে আলো তৈরি করে।',
    correct: 'FALSE',
    explanationEn: 'Paragraph C states anglerfishes exploit "symbiotic bioluminescent bacteria" housed within the illicium.',
    explanationBn: 'অনুচ্ছেদ C অনুযায়ী অ্যাংলারফিশ ইলিসিয়ামের ভেতরে থাকা মিথজীবী বায়োলুমিনেসেন্ট ব্যাকটেরিয়া ব্যবহার করে।',
  },
];

const HEADING_OPTIONS = [
  { value: 'i', labelEn: 'i. Optical cloaking and sensory signalling in midwater species', labelBn: 'i. মিডওয়াটার প্রজাতির অপটিক্যাল ছদ্মবেশ ও সংকেত' },
  { value: 'ii', labelEn: 'ii. Commercial harvesting of deep-sea luciferin', labelBn: 'ii. গভীর সমুদ্রের লুসিফেরিনের বাণিজ্যিক আহরণ' },
  { value: 'iii', labelEn: 'iii. Microbial symbiosis as a predatory lure', labelBn: 'iii. শিকারের টোপ হিসেবে অণুজীব মিথজীবিতা' },
  { value: 'iv', labelEn: 'iv. Thermal vents and tectonic plate chemistry', labelBn: 'iv. তাপীয় নির্গমন ও টেকটোনিক প্লেটের রসায়ন' },
];

const READING_HEADINGS: ReadingHeadingQuestion[] = [
  {
    num: 4,
    paragraphLabel: 'Paragraph B',
    textEn: 'Choose the correct heading for Paragraph B.',
    textBn: 'অনুচ্ছেদ B-এর জন্য সঠিক শিরোনাম নির্বাচন করুন।',
    correct: 'i',
    explanationEn: 'Paragraph B focuses on dynamic sensory signalling and counterillumination optical cloaking.',
    explanationBn: 'অনুচ্ছেদ B-তে সংকেত আদান-প্রদান এবং কাউন্টারইলুমিনেশন অপটিক্যাল ছদ্মবেশ নিয়ে আলোচনা করা হয়েছে।',
  },
  {
    num: 5,
    paragraphLabel: 'Paragraph C',
    textEn: 'Choose the correct heading for Paragraph C.',
    textBn: 'অনুচ্ছেদ C-এর জন্য সঠিক শিরোনাম নির্বাচন করুন।',
    correct: 'iii',
    explanationEn: 'Paragraph C describes how symbiotic bacteria in the illicium lure prey for anglerfish.',
    explanationBn: 'অনুচ্ছেদ C-তে ইলিসিয়ামের মিথজীবী ব্যাকটেরিয়া কীভাবে শিকার আকর্ষণ করে তা বলা হয়েছে।',
  },
];

const LISTENING_ITEMS: ListeningCompletionQuestion[] = [
  {
    num: 6,
    promptBeforeEn: 'Main Archive Wing opens at',
    promptAfterEn: 'a.m. on weekdays.',
    promptBeforeBn: 'সপ্তাহের কর্মদিবসে প্রধান আর্কাইভ উইং খোলে সকাল',
    promptAfterBn: 'টায়।',
    acceptedAnswers: ['8:30', '8.30', '08:30'],
    displayAnswer: '8:30',
    explanationEn: 'The orientation officer confirms weekday archive access begins at 8:30 a.m.',
    explanationBn: 'ওরিয়েন্টেশন অফিসার জানান কর্মদিবসে সকাল ৮:৩০-এ আর্কাইভ খোলে।',
  },
  {
    num: 7,
    promptBeforeEn: 'Quiet study pods must be booked using your',
    promptAfterEn: 'card.',
    promptBeforeBn: 'নিরিবিলি স্টাডি পড বুক করতে আপনার',
    promptAfterBn: 'কার্ড প্রয়োজন।',
    acceptedAnswers: ['student', 'student id'],
    displayAnswer: 'student',
    explanationEn: 'Bookings require scanning a valid student card at the ground-floor kiosk.',
    explanationBn: 'নিচতলার কিয়স্কে বৈধ স্টুডেন্ট কার্ড স্ক্যান করে বুকিং করতে হয়।',
  },
  {
    num: 8,
    promptBeforeEn: 'Maximum loan duration for reference journals is',
    promptAfterEn: 'hours.',
    promptBeforeBn: 'রেফারেন্স জার্নাল ধার নেওয়ার সর্বোচ্চ সময়সীমা',
    promptAfterBn: 'ঘণ্টা।',
    acceptedAnswers: ['48', 'forty-eight', 'forty eight'],
    displayAnswer: '48',
    explanationEn: 'Reference journals are restricted to a 48-hour short-loan period.',
    explanationBn: 'রেফারেন্স জার্নাল সর্বোচ্চ ৪৮ ঘণ্টার জন্য ধার নেওয়া যায়।',
  },
  {
    num: 9,
    promptBeforeEn: 'Evening research workshops take place in Room',
    promptAfterEn: 'on Thursdays.',
    promptBeforeBn: 'বৃহস্পতিবারের সান্ধ্য গবেষণা কর্মশালা হয় রুম',
    promptAfterBn: '-এ।',
    acceptedAnswers: ['204', 'room 204'],
    displayAnswer: '204',
    explanationEn: 'Thursday methodology workshops are held upstairs in Room 204.',
    explanationBn: 'বৃহস্পতিবারের কর্মশালাগুলো ওপরতলার ২০২-এর বদলে ২০৪ নম্বর রুমে হয়।',
  },
];

const LISTENING_DURATION_SEC = 105;

const SPEAKING_CHECKLIST = [
  {
    id: 'fluency',
    labelEn: 'Fluency & Coherence: Spoke for the full 2 minutes without long hesitations; used clear signposting.',
    labelBn: 'Fluency & Coherence: দীর্ঘ বিরতি ছাড়া পুরো ২ মিনিট কথা বলেছি এবং স্পষ্ট সংযোগকারী শব্দ ব্যবহার করেছি।',
  },
  {
    id: 'lexical',
    labelEn: 'Lexical Resource: Used precise, natural collocations and avoided repeating basic adjectives.',
    labelBn: 'Lexical Resource: স্বাভাবিক শব্দগুচ্ছ ব্যবহার করেছি এবং একই সাধারণ বিশেষণ বারবার বলিনি।',
  },
  {
    id: 'grammar',
    labelEn: 'Grammatical Range: Combined past narrative tenses with complex clauses accurately.',
    labelBn: 'Grammatical Range: অতীত কাল ও জটিল বাক্য নির্ভুলভাবে মিলিয়ে ব্যবহার করেছি।',
  },
  {
    id: 'pronunciation',
    labelEn: 'Pronunciation: Maintained steady pace, clear word stress, and natural intonation.',
    labelBn: 'Pronunciation: স্বাভাবিক গতি, সঠিক শব্দাঘাত ও স্পষ্ট উচ্চারণ বজায় রেখেছি।',
  },
];

function formatClock(totalSeconds: number): string {
  const clamped = Math.max(0, totalSeconds);
  const mins = Math.floor(clamped / 60);
  const secs = clamped % 60;
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

function renderHighlightedParagraph(
  text: string,
  highlights: HighlightEntry[],
): React.ReactNode {
  if (highlights.length === 0) return text;

  let segments: Array<{ str: string; color?: HighlightColor }> = [{ str: text }];
  for (const h of highlights) {
    const needle = h.text.trim();
    if (needle.length < 2) continue;
    const nextSegments: Array<{ str: string; color?: HighlightColor }> = [];
    for (const seg of segments) {
      if (seg.color) {
        nextSegments.push(seg);
        continue;
      }
      const parts = seg.str.split(needle);
      parts.forEach((part, idx) => {
        if (part.length > 0) nextSegments.push({ str: part });
        if (idx < parts.length - 1) {
          nextSegments.push({ str: needle, color: h.color });
        }
      });
    }
    segments = nextSegments;
  }

  return segments.map((seg, idx) =>
    seg.color ? (
      <mark
        key={idx}
        className={
          seg.color === 'yellow'
            ? 'bg-[#FEF08A] text-[var(--brand-ink)] px-0.5 rounded-[2px]'
            : 'bg-[var(--soft-btn)] text-[var(--brand-ink)] px-0.5 rounded-[2px]'
        }
      >
        {seg.str}
      </mark>
    ) : (
      <React.Fragment key={idx}>{seg.str}</React.Fragment>
    ),
  );
}

export default function IeltsPreviewPage() {
  const locale = useLocale();
  const isBn = locale === 'bn';

  const [activeTab, setActiveTab] = useState<SkillTab>('reading');
  const [textSize, setTextSize] = useState<TextSize>('standard');
  const [mobilePane, setMobilePane] = useState<'left' | 'right'>('left');

  // Global Countdown Timer (60:00 demo)
  const [examSecondsLeft, setExamSecondsLeft] = useState(3525);
  const [isTimerVisible, setIsTimerVisible] = useState(true);

  useEffect(() => {
    const id = window.setInterval(() => {
      setExamSecondsLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => window.clearInterval(id);
  }, []);

  // Split-screen resizer
  const [leftWidthPercent, setLeftWidthPercent] = useState(50);
  const isDraggingRef = useRef(false);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const pct = (e.clientX / window.innerWidth) * 100;
      if (pct >= 28 && pct <= 72) {
        setLeftWidthPercent(pct);
      }
    };
    const onUp = () => {
      isDraggingRef.current = false;
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
  }, []);

  // Notepad
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [notesContent, setNotesContent] = useState('');

  // Reading state
  const [highlights, setHighlights] = useState<HighlightEntry[]>([
    {
      text: 'dynamic sensory landscape where light flashes serve predator deterrence',
      color: 'yellow',
    },
  ]);
  const [highlightHint, setHighlightHint] = useState<string | null>(null);
  const [readingAnswers, setReadingAnswers] = useState<Record<number, string>>({
    1: 'FALSE',
  });
  const [readingChecked, setReadingChecked] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Listening state
  const [audioSeconds, setAudioSeconds] = useState(0);
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [hasAudioFinished, setHasAudioFinished] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [listeningAnswers, setListeningAnswers] = useState<Record<number, string>>({});
  const [listeningChecked, setListeningChecked] = useState(false);

  useEffect(() => {
    if (!isAudioPlaying) return;
    const id = window.setInterval(() => {
      setAudioSeconds((prev) => {
        if (prev + 1 >= LISTENING_DURATION_SEC) {
          setIsAudioPlaying(false);
          setHasAudioFinished(true);
          return LISTENING_DURATION_SEC;
        }
        return prev + 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isAudioPlaying]);

  // Writing state
  const [task2Essay, setTask2Essay] = useState(
    'In recent years, the rapid advancement of artificial intelligence has sparked intense debate regarding workplace automation. While proponents argue that automated systems increase productivity and eliminate hazardous manual labor, critics maintain that mass dislocation poses severe socio-economic risks.\n\nIn my view, strategic regulatory oversight combined with vocational retraining represents the most balanced path forward. Governments and universities must collaborate so workers transition into higher-value roles rather than being displaced without support.',
  );
  const [writingEvaluated, setWritingEvaluated] = useState(false);
  const essayWordCount = countWords(task2Essay);

  // Speaking state
  const [prepSeconds, setPrepSeconds] = useState(60);
  const [isPrepRunning, setIsPrepRunning] = useState(false);
  const [speakSeconds, setSpeakSeconds] = useState(120);
  const [isSpeakRunning, setIsSpeakRunning] = useState(false);
  const [speakingChecks, setSpeakingChecks] = useState<Record<string, boolean>>({
    fluency: true,
  });

  useEffect(() => {
    if (!isPrepRunning) return;
    const id = window.setInterval(() => {
      setPrepSeconds((prev) => {
        if (prev <= 1) {
          setIsPrepRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isPrepRunning]);

  useEffect(() => {
    if (!isSpeakRunning) return;
    const id = window.setInterval(() => {
      setSpeakSeconds((prev) => {
        if (prev <= 1) {
          setIsSpeakRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(id);
  }, [isSpeakRunning]);

  // Band Report Modal
  const [isReportOpen, setIsReportOpen] = useState(false);

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'large':
        return 'text-base leading-relaxed';
      case 'extralarge':
        return 'text-lg leading-loose';
      default:
        return 'text-sm leading-relaxed';
    }
  };

  const handleApplyHighlight = (color: HighlightColor) => {
    const selection = window.getSelection();
    const selected = selection ? selection.toString().trim() : '';
    if (!selected || selected.length < 2) {
      setHighlightHint(
        isBn
          ? 'হাইলাইট করতে বাম দিকের অনুচ্ছেদ থেকে যেকোনো বাক্য বা শব্দ সিলেক্ট করে আবার ক্লিক করুন।'
          : 'Select any phrase in the passage first, then click Yellow or Coral to highlight.',
      );
      return;
    }
    setHighlightHint(null);
    setHighlights((prev) => [...prev, { text: selected, color }]);
    selection?.removeAllRanges();
  };

  const toggleFlag = (num: number) => {
    setFlaggedQuestions((prev) => ({ ...prev, [num]: !prev[num] }));
  };

  const isListeningCorrect = (item: ListeningCompletionQuestion): boolean => {
    const val = (listeningAnswers[item.num] ?? '').trim().toLowerCase();
    return item.acceptedAnswers.some((ans) => ans.toLowerCase() === val);
  };

  // Compute summary metrics
  const readingCorrectCount =
    READING_TFNG.filter((q) => readingAnswers[q.num] === q.correct).length +
    READING_HEADINGS.filter((q) => readingAnswers[q.num] === q.correct).length;
  const listeningCorrectCount = LISTENING_ITEMS.filter(isListeningCorrect).length;

  const writingRubric = (() => {
    const tr = essayWordCount >= 250 ? 7.5 : essayWordCount >= 120 ? 6.5 : 5.5;
    const cc = task2Essay.includes('\n\n') ? 7.5 : 6.5;
    const lr = essayWordCount >= 80 ? 7.0 : 6.0;
    const gr = 7.0;
    const avg = Math.round(((tr + cc + lr + gr) / 4) * 2) / 2;
    return { tr, cc, lr, gr, avg };
  })();

  const isQuestionAnswered = (num: number): boolean => {
    if (num <= 5) return Boolean(readingAnswers[num]);
    return Boolean((listeningAnswers[num] ?? '').trim());
  };

  const handlePaletteJump = (num: number) => {
    if (num <= 5) {
      setActiveTab('reading');
      setMobilePane('right');
    } else {
      setActiveTab('listening');
      setMobilePane('right');
    }
  };

  const skillTabs: Array<{
    id: SkillTab;
    labelEn: string;
    labelBn: string;
    Icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'listening', labelEn: 'Listening', labelBn: 'লিসেনিং', Icon: Headphones },
    { id: 'reading', labelEn: 'Reading', labelBn: 'রিডিং', Icon: BookOpen },
    { id: 'writing', labelEn: 'Writing', labelBn: 'রাইটিং', Icon: PenTool },
    { id: 'speaking', labelEn: 'Speaking', labelBn: 'স্পিকিং', Icon: Mic },
  ];

  return (
    <div className="flex min-h-dvh w-full flex-col overflow-x-hidden bg-[var(--bg-warm)] text-[var(--brand-ink)]">
      {/* Top Institutional CD-IELTS Header Bar */}
      <header className="flex min-h-16 flex-wrap items-center justify-between gap-3 border-b-4 border-[var(--brand)] bg-[var(--brand-deep)] px-4 py-2 text-white sm:px-8 lg:h-16 lg:flex-nowrap lg:py-0">
        {/* Left: Brand & Workbench Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link
            href="/ielts"
            className="flex items-center gap-2.5 text-white hover:opacity-90 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <LumenSparkMotif inverse />
            <span className="text-sm font-extrabold tracking-tight sm:text-base whitespace-nowrap">
              {brand.name}
            </span>
          </Link>
          <span className="hidden h-5 w-px bg-white/25 sm:inline-block" aria-hidden="true" />
          <span className="hidden truncate text-xs font-semibold tracking-wide text-white/85 md:inline-block">
            {isBn
              ? 'CD-IELTS™ অফিশিয়াল-ফরম্যাট ওয়ার্কবেঞ্চ'
              : 'CD-IELTS™ Official-Format Workbench'}
          </span>
        </div>

        {/* Center/Right: 4 Skill Switchers, LocaleSwitcher & Timer */}
        <div className="flex flex-wrap items-center gap-2">
          <nav
            aria-label={isBn ? 'দক্ষতা পরিবর্তন করুন' : 'Skill switcher'}
            className="flex items-center gap-1"
          >
            {skillTabs.map(({ id, labelEn, labelBn, Icon }) => {
              const active = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center gap-1.5 rounded-[4px] border px-2.5 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
                    active
                      ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                      : 'border-white/20 bg-white/10 text-white/85 hover:bg-white/20 hover:text-white'
                  }`}
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  <span>{isBn ? labelBn : labelEn}</span>
                </button>
              );
            })}
          </nav>

          <div className="lumen-locale-dark inline-flex items-center">
            <LocaleSwitcher />
          </div>

          <div className="flex items-center gap-2 rounded-[4px] border border-white/20 bg-white/10 px-2.5 py-1.5">
            <Clock className="h-3.5 w-3.5 text-[var(--accent)] shrink-0" />
            {isTimerVisible ? (
              <span className="font-mono text-xs font-bold tracking-wider text-white sm:text-sm">
                {formatClock(examSecondsLeft)}
              </span>
            ) : (
              <span className="font-mono text-xs text-white/70">
                {isBn ? 'লুকানো' : 'Hidden'}
              </span>
            )}
            <button
              type="button"
              onClick={() => setIsTimerVisible((v) => !v)}
              className="text-white/75 hover:text-white cursor-pointer"
              aria-label={isTimerVisible ? 'Hide timer' : 'Show timer'}
              title={isTimerVisible ? 'Hide timer' : 'Show timer'}
            >
              {isTimerVisible ? (
                <EyeOff className="h-3.5 w-3.5" />
              ) : (
                <Eye className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Secondary Workbench Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline)] bg-[var(--surface-paper)] px-4 py-2 sm:px-8">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-1 text-xs">
            <Type className="h-3.5 w-3.5 text-[var(--text)]" />
            <label htmlFor="ielts-text-size" className="sr-only">
              Text size
            </label>
            <select
              id="ielts-text-size"
              value={textSize}
              onChange={(e) => setTextSize(e.target.value as TextSize)}
              className="cursor-pointer bg-transparent font-medium text-[var(--brand-ink)] outline-none"
            >
              <option value="standard">{isBn ? 'সাধারণ টেক্সট' : 'Standard Text'}</option>
              <option value="large">{isBn ? 'বড় টেক্সট' : 'Large Text'}</option>
              <option value="extralarge">{isBn ? 'অতিরিক্ত বড়' : 'Extra Large'}</option>
            </select>
          </div>

          {activeTab === 'reading' && (
            <div className="flex flex-wrap items-center gap-1.5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-2.5 py-1 text-xs">
              <Highlighter className="h-3.5 w-3.5 text-[var(--brand)]" />
              <span className="font-medium text-[var(--text)]">
                {isBn ? 'হাইলাইটার:' : 'Highlight:'}
              </span>
              <button
                type="button"
                onClick={() => handleApplyHighlight('yellow')}
                className="rounded-[4px] border border-[var(--hairline)] bg-[#FEF08A] px-2 py-0.5 font-semibold text-[var(--brand-ink)] hover:opacity-90 cursor-pointer"
              >
                {isBn ? 'হলুদ' : 'Yellow'}
              </button>
              <button
                type="button"
                onClick={() => handleApplyHighlight('coral')}
                className="rounded-[4px] border border-[var(--hairline)] bg-[var(--soft-btn)] px-2 py-0.5 font-semibold text-[var(--brand-ink)] hover:opacity-90 cursor-pointer"
              >
                {isBn ? 'কোরাল' : 'Coral'}
              </button>
              {highlights.length > 0 && (
                <button
                  type="button"
                  onClick={() => {
                    setHighlights([]);
                    setHighlightHint(null);
                  }}
                  className="rounded-[4px] px-1.5 py-0.5 text-[var(--link)] underline hover:opacity-80 cursor-pointer"
                >
                  {isBn ? 'মুছুন' : 'Clear'} ({highlights.length})
                </button>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Mobile Pane Switcher */}
          <div className="flex items-center rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-0.5 text-xs lg:hidden">
            <button
              type="button"
              onClick={() => setMobilePane('left')}
              className={`rounded-[4px] px-2.5 py-1 font-semibold cursor-pointer ${
                mobilePane === 'left'
                  ? 'bg-[var(--brand)] text-white'
                  : 'text-[var(--text)]'
              }`}
            >
              {isBn ? 'মূল অংশ' : 'Prompt / Passage'}
            </button>
            <button
              type="button"
              onClick={() => setMobilePane('right')}
              className={`rounded-[4px] px-2.5 py-1 font-semibold cursor-pointer ${
                mobilePane === 'right'
                  ? 'bg-[var(--brand)] text-white'
                  : 'text-[var(--text)]'
              }`}
            >
              {isBn ? 'প্রশ্ন / উত্তর' : 'Questions / Editor'}
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsNotepadOpen((o) => !o)}
            className={`flex items-center gap-1.5 rounded-[4px] border px-3 py-1.5 text-xs font-semibold transition-colors cursor-pointer ${
              isNotepadOpen
                ? 'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand)]'
                : 'border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-ink)] hover:bg-[var(--bg-warm)]'
            }`}
          >
            <FileText className="h-3.5 w-3.5" />
            <span>{isBn ? 'নোটপ্যাড' : 'Scratch Notepad'}</span>
          </button>
        </div>
      </div>

      {highlightHint && activeTab === 'reading' && (
        <div className="border-b border-[var(--hairline)] bg-[var(--bg-tint)] px-4 py-2 text-xs font-medium text-[var(--brand-ink)] sm:px-8">
          {highlightHint}
        </div>
      )}

      {/* Interactive Split-Pane Workbench */}
      <main className="relative flex flex-1 flex-col bg-[var(--bg-warm)] min-h-[calc(100dvh-8rem)] lg:flex-row">
        {/* LEFT PANE */}
        <section
          aria-label={isBn ? 'বাম প্যানেল' : 'Left workbench pane'}
          className={`min-w-0 p-4 sm:p-6 ${
            mobilePane === 'left' ? 'block' : 'hidden lg:block'
          } lg:w-[var(--left-pane-width)]`}
          style={{ '--left-pane-width': `${leftWidthPercent}%` } as React.CSSProperties}
        >
          <div className="h-full border border-[var(--hairline)] bg-[var(--surface-paper)] p-6 sm:p-8 rounded-[4px]">
            {/* READING LEFT PANE */}
            {activeTab === 'reading' && (
              <div className={getTextSizeClass()}>
                <div className="mb-5 border-b border-[var(--hairline)] pb-4">
                  <p className="text-xs font-bold tracking-wide text-[var(--brand)]">
                    {isBn ? 'রিডিং প্যাসেজ ১' : 'Reading Passage 1'}
                  </p>
                  <h1 className="mt-1 text-xl font-extrabold text-[var(--brand-ink)] sm:text-2xl">
                    The Evolutionary Biology of Deep-Sea Bioluminescence
                  </h1>
                  <p className="mt-1 text-xs text-[var(--text)]">
                    {isBn
                      ? 'প্রশ্ন ১–৫-এর উত্তর নিচের অনুচ্ছেদ থেকে দিন। টেক্সট সিলেক্ট করে ওপরের হলুদ বা কোরাল বাটনে ক্লিক করে হাইলাইট করতে পারেন।'
                      : 'Answer Questions 1–5 based on the passage below. Select any text and click Yellow or Coral above to highlight.'}
                  </p>
                </div>

                <div className="space-y-4 text-[var(--text)] select-text">
                  {PASSAGE_PARAGRAPHS.map((para) => (
                    <p key={para.id}>
                      <span className="mr-2 inline-block rounded-[4px] bg-[var(--bg-warm)] px-1.5 py-0.5 text-xs font-bold text-[var(--brand-ink)]">
                        {para.id}
                      </span>
                      {renderHighlightedParagraph(para.text, highlights)}
                    </p>
                  ))}
                </div>
              </div>
            )}

            {/* LISTENING LEFT PANE */}
            {activeTab === 'listening' && (
              <div className={getTextSizeClass()}>
                <div className="mb-5 border-b border-[var(--hairline)] pb-4">
                  <p className="text-xs font-bold tracking-wide text-[var(--brand)]">
                    {isBn ? 'লিসেনিং সেকশন ২ • অডিও প্লেয়ার' : 'Listening Section 2 • Audio Runner'}
                  </p>
                  <h1 className="mt-1 text-xl font-extrabold text-[var(--brand-ink)] sm:text-2xl">
                    {isBn
                      ? 'বিশ্ববিদ্যালয় গ্রন্থাগার ও আর্কাইভ পরিচিতি'
                      : 'University Library & Archive Orientation'}
                  </h1>
                  <p className="mt-1 text-xs text-[var(--text)]">
                    {isBn
                      ? 'অফিশিয়াল CD-IELTS নিয়ম অনুযায়ী অডিও একবারই চলে। নিচের ট্রান্সক্রিপ্ট বাটন দিয়ে স্ক্রিপ্ট যাচাই করতে পারেন।'
                      : 'Official CBT format allows single playback. Use the transcript toggle below to review the spoken script.'}
                  </p>
                </div>

                <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={hasAudioFinished}
                        onClick={() => setIsAudioPlaying((p) => !p)}
                        className="flex items-center gap-1.5 rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--crimson)] disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
                      >
                        {isAudioPlaying ? (
                          <>
                            <Pause className="h-3.5 w-3.5" />
                            <span>{isBn ? 'বিরতি' : 'Pause'}</span>
                          </>
                        ) : (
                          <>
                            <Play className="h-3.5 w-3.5" />
                            <span>
                              {hasAudioFinished
                                ? isBn
                                  ? 'প্লেব্যাক সম্পন্ন'
                                  : 'Playback Complete'
                                : isBn
                                  ? 'অডিও চালান'
                                  : 'Play Audio'}
                            </span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setIsAudioPlaying(false);
                          setHasAudioFinished(false);
                          setAudioSeconds(0);
                        }}
                        className="flex items-center gap-1 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] cursor-pointer"
                      >
                        <RotateCcw className="h-3.5 w-3.5" />
                        <span>{isBn ? 'রিসেট' : 'Reset Demo'}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-[var(--brand-ink)]">
                      <Volume2 className="h-4 w-4 text-[var(--brand)]" />
                      <span>
                        {formatClock(audioSeconds)} / {formatClock(LISTENING_DURATION_SEC)}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div
                    className="mt-4 h-3 w-full overflow-hidden rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)]"
                    role="progressbar"
                    aria-valuenow={audioSeconds}
                    aria-valuemin={0}
                    aria-valuemax={LISTENING_DURATION_SEC}
                  >
                    <div
                      className="h-full bg-[var(--brand)] transition-all duration-300"
                      style={{
                        width: `${Math.round((audioSeconds / LISTENING_DURATION_SEC) * 100)}%`,
                      }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-[var(--text)]">
                    {isBn
                      ? 'স্থিতি: অফিশিয়াল পরীক্ষায় অডিও একবারই শোনার সুযোগ থাকে।'
                      : 'Status: Official CD-IELTS permits a single continuous playback per recording.'}
                  </p>
                </div>

                {/* Transcript Toggle */}
                <div className="mt-5">
                  <button
                    type="button"
                    onClick={() => setShowTranscript((s) => !s)}
                    className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3.5 py-2 text-xs font-semibold text-[var(--brand)] hover:bg-[var(--bg-tint)] cursor-pointer"
                  >
                    {showTranscript
                      ? isBn
                        ? 'অডিও ট্রান্সক্রিপ্ট লুকান'
                        : 'Hide Audio Transcript'
                      : isBn
                        ? 'অডিও ট্রান্সক্রিপ্ট দেখুন'
                        : 'Reveal Audio Transcript'}
                  </button>

                  {showTranscript && (
                    <div className="mt-3 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4 text-sm leading-relaxed text-[var(--text)] space-y-2">
                      <p>
                        <strong>Librarian:</strong> Welcome to the Central Research Library. Our Main Archive Wing opens promptly at <strong>8:30 a.m.</strong> on weekdays and 10:00 a.m. on Saturdays.
                      </p>
                      <p>
                        If you need a quiet study pod on the third floor, remember to book it in advance at the ground-floor kiosk using your <strong>student</strong> card.
                      </p>
                      <p>
                        Please note that reference journals are short-loan items with a maximum borrowing duration of <strong>48</strong> hours. Finally, our evening research workshops take place every Thursday in Room <strong>204</strong>.
                      </p>
                    </div>
                  )}
                </div>

                <div className="mt-6 border-t border-[var(--hairline)] pt-5">
                  <IeltsListeningAudioEngine
                    isBn={isBn}
                    defaultPartNumber={1}
                    defaultMode="strict"
                    postSubmissionUnlocked={listeningChecked}
                  />
                </div>
              </div>
            )}

            {/* WRITING LEFT PANE */}
            {activeTab === 'writing' && (
              <div className={getTextSizeClass()}>
                <div className="mb-5 border-b border-[var(--hairline)] pb-4">
                  <p className="text-xs font-bold tracking-wide text-[var(--brand)]">
                    {isBn ? 'অ্যাকাডেমিক রাইটিং টাস্ক ২' : 'Academic Writing Task 2'}
                  </p>
                  <h1 className="mt-1 text-xl font-extrabold text-[var(--brand-ink)] sm:text-2xl">
                    {isBn ? 'রচনা ও যুক্তি বিশ্লেষণ (দ্বিগুণ নম্বর)' : 'Essay Prompt (Weighted 2x)'}
                  </h1>
                  <p className="mt-1 text-xs text-[var(--text)]">
                    {isBn
                      ? 'এই টাস্কের জন্য প্রায় ৪০ মিনিট সময় বরাদ্দ রাখুন এবং কমপক্ষে ২৫০টি শব্দ লিখুন।'
                      : 'You should spend about 40 minutes on this task. Write at least 250 words.'}
                  </p>
                </div>

                <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-5 space-y-3 text-[var(--brand-ink)]">
                  <p className="font-semibold leading-relaxed">
                    Some people believe that technological automation will lead to widespread joblessness, while others argue it will foster innovation and create new industries.
                  </p>
                  <p className="font-semibold leading-relaxed">
                    Discuss both these views and give your own opinion.
                  </p>
                  <p className="text-xs text-[var(--text)] border-t border-[var(--hairline)] pt-3">
                    {isBn
                      ? 'নির্দেশনা: আপনার উত্তরের সপক্ষে যুক্তি ও নিজস্ব অভিজ্ঞতা থেকে প্রাসঙ্গিক উদাহরণ দিন।'
                      : 'Give reasons for your answer and include any relevant examples from your own knowledge or experience.'}
                  </p>
                </div>
              </div>
            )}

            {/* SPEAKING LEFT PANE */}
            {activeTab === 'speaking' && (
              <div className={getTextSizeClass()}>
                <div className="mb-5 border-b border-[var(--hairline)] pb-4">
                  <p className="text-xs font-bold tracking-wide text-[var(--brand)]">
                    {isBn ? 'স্পিকিং পার্ট ২ • কিউ কার্ড' : 'Speaking Part 2 • Cue Card'}
                  </p>
                  <h1 className="mt-1 text-xl font-extrabold text-[var(--brand-ink)] sm:text-2xl">
                    {isBn ? 'দীর্ঘ বক্তব্য ও প্রস্তুতি টাইমার' : 'Long Turn Prompt & Timers'}
                  </h1>
                </div>

                <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-5 space-y-3">
                  <p className="font-bold text-[var(--brand-ink)]">
                    Describe a practical skill you learned outside school or university.
                  </p>
                  <p className="text-xs font-semibold text-[var(--text)]">
                    {isBn ? 'আপনাকে বলতে হবে:' : 'You should say:'}
                  </p>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm text-[var(--text)]">
                    <li>what the skill is and when you learned it</li>
                    <li>who helped you or how you practiced it</li>
                    <li>what challenges you faced at the beginning</li>
                    <li>and explain why this skill remains useful to you today.</li>
                  </ul>
                </div>

                {/* 1-Min Prep & 2-Min Speaking Timers */}
                <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4">
                    <p className="text-xs font-bold text-[var(--text)]">
                      {isBn ? '১-মিনিট প্রস্তুতি টাইমার' : '1-Minute Prep Timer'}
                    </p>
                    <p className="mt-1 font-mono text-2xl font-extrabold text-[var(--brand-ink)]">
                      {formatClock(prepSeconds)}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsPrepRunning((r) => !r)}
                        className="rounded-[4px] bg-[var(--brand)] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[var(--crimson)] cursor-pointer"
                      >
                        {isPrepRunning
                          ? isBn
                            ? 'বিরতি'
                            : 'Pause'
                          : isBn
                            ? 'শুরু করুন'
                            : 'Start Prep'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsPrepRunning(false);
                          setPrepSeconds(60);
                        }}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-1.5 text-xs font-semibold text-[var(--brand-ink)] cursor-pointer"
                      >
                        {isBn ? 'রিসেট' : 'Reset'}
                      </button>
                    </div>
                  </div>

                  <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4">
                    <p className="text-xs font-bold text-[var(--text)]">
                      {isBn ? '২-মিনিট স্পিকিং টাইমার' : '2-Minute Speaking Timer'}
                    </p>
                    <p className="mt-1 font-mono text-2xl font-extrabold text-[var(--brand-ink)]">
                      {formatClock(speakSeconds)}
                    </p>
                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setIsSpeakRunning((r) => !r)}
                        className="rounded-[4px] bg-[var(--brand-deep)] px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90 cursor-pointer"
                      >
                        {isSpeakRunning
                          ? isBn
                            ? 'বিরতি'
                            : 'Pause'
                          : isBn
                            ? 'বলা শুরু'
                            : 'Start Turn'}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setIsSpeakRunning(false);
                          setSpeakSeconds(120);
                        }}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-1.5 text-xs font-semibold text-[var(--brand-ink)] cursor-pointer"
                      >
                        {isBn ? 'রিসেট' : 'Reset'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Draggable Split-Pane Divider (Desktop) */}
        <div
          role="separator"
          aria-orientation="vertical"
          aria-label="Resize split panes"
          onMouseDown={() => {
            isDraggingRef.current = true;
          }}
          className="hidden lg:flex w-2.5 shrink-0 cursor-col-resize items-center justify-center bg-[var(--hairline)] hover:bg-[var(--accent)] transition-colors"
          title="Drag to resize split panes"
        >
          <GripVertical className="h-4 w-4 text-[var(--text)]" />
        </div>

        {/* RIGHT PANE */}
        <section
          aria-label={isBn ? 'ডান প্যানেল' : 'Right workbench pane'}
          className={`min-w-0 flex-1 p-4 sm:p-6 ${
            mobilePane === 'right' ? 'block' : 'hidden lg:block'
          }`}
        >
          <div className="h-full border border-[var(--hairline)] bg-[var(--surface-paper)] p-6 sm:p-8 rounded-[4px]">
            {/* READING RIGHT PANE */}
            {activeTab === 'reading' && (
              <div className={getTextSizeClass()}>
                <div className="mb-5 border-b border-[var(--hairline)] pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-wide text-[var(--brand)]">
                      {isBn ? 'প্রশ্ন ১–৫' : 'Questions 1–5'}
                    </p>
                    <h2 className="mt-1 text-lg font-extrabold text-[var(--brand-ink)]">
                      {isBn
                        ? 'True / False / Not Given ও Matching Headings'
                        : 'True / False / Not Given & Matching Headings'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setReadingChecked(true)}
                    className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--crimson)] cursor-pointer"
                  >
                    {isBn ? 'উত্তর যাচাই করুন' : 'Check Reading Answers'}
                  </button>
                </div>

                {readingChecked && (
                  <div className="mb-5 rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] p-4 text-xs sm:text-sm">
                    <p className="font-bold text-[var(--brand-ink)]">
                      {isBn
                        ? `ফলাফল: ${readingCorrectCount} / 5 সঠিক (আনুমানিক রিডিং ব্যান্ড নমুনা: ${
                            readingCorrectCount >= 4 ? '7.5–8.5' : readingCorrectCount >= 2 ? '6.0–7.0' : '5.0–5.5'
                          })`
                        : `Score: ${readingCorrectCount} / 5 correct (Estimated sample band: ${
                            readingCorrectCount >= 4 ? '7.5–8.5' : readingCorrectCount >= 2 ? '6.0–7.0' : '5.0–5.5'
                          })`}
                    </p>
                  </div>
                )}

                <div className="space-y-4">
                  {READING_TFNG.map((q) => {
                    const selected = readingAnswers[q.num];
                    const isCorrect = selected === q.correct;
                    return (
                      <div
                        key={q.num}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-[var(--brand-deep)] text-xs font-bold text-white">
                            {q.num}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleFlag(q.num)}
                            className={`flex items-center gap-1 rounded-[4px] px-2 py-1 text-xs font-semibold cursor-pointer ${
                              flaggedQuestions[q.num]
                                ? 'bg-[var(--soft-btn)] text-[var(--brand)]'
                                : 'text-[var(--text)] hover:bg-[var(--bg-warm)]'
                            }`}
                          >
                            <Flag className="h-3.5 w-3.5" />
                            <span>
                              {flaggedQuestions[q.num]
                                ? isBn
                                  ? 'ফ্ল্যাগ করা'
                                  : 'Flagged'
                                : isBn
                                  ? 'ফ্ল্যাগ'
                                  : 'Flag'}
                            </span>
                          </button>
                        </div>

                        <p className="mt-2 font-semibold text-[var(--brand-ink)]">
                          {isBn ? q.textBn : q.textEn}
                        </p>

                        <div className="mt-3 flex flex-wrap gap-2">
                          {(['TRUE', 'FALSE', 'NOT GIVEN'] as const).map((opt) => (
                            <label
                              key={opt}
                              className={`flex cursor-pointer items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs font-semibold transition-colors ${
                                selected === opt
                                  ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                                  : 'border-[var(--hairline)] bg-[var(--surface-paper)] text-[var(--brand-ink)] hover:bg-[var(--bg-warm)]'
                              }`}
                            >
                              <input
                                type="radio"
                                name={`reading_q_${q.num}`}
                                value={opt}
                                checked={selected === opt}
                                onChange={() =>
                                  setReadingAnswers((prev) => ({ ...prev, [q.num]: opt }))
                                }
                                className="sr-only"
                              />
                              <span>{opt}</span>
                            </label>
                          ))}
                        </div>

                        {readingChecked && (
                          <div
                            className={`mt-3 flex items-start gap-2 rounded-[4px] border p-2.5 text-xs ${
                              isCorrect
                                ? 'border-emerald-700/30 bg-emerald-50 text-emerald-950'
                                : 'border-[var(--brand)]/40 bg-[var(--bg-tint)] text-[var(--brand-ink)]'
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-4 w-4 shrink-0 text-[var(--brand)] mt-0.5" />
                            )}
                            <div>
                              <span className="font-bold">
                                {isCorrect
                                  ? isBn
                                    ? 'সঠিক'
                                    : 'Correct'
                                  : `${isBn ? 'সঠিক উত্তর' : 'Correct Answer'}: ${q.correct}`}
                                {' — '}
                              </span>
                              <span>{isBn ? q.explanationBn : q.explanationEn}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {/* Matching Headings Q4-Q5 */}
                  {READING_HEADINGS.map((q) => {
                    const selected = readingAnswers[q.num] ?? '';
                    const isCorrect = selected === q.correct;
                    return (
                      <div
                        key={q.num}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-[var(--brand-deep)] text-xs font-bold text-white">
                            {q.num}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleFlag(q.num)}
                            className={`flex items-center gap-1 rounded-[4px] px-2 py-1 text-xs font-semibold cursor-pointer ${
                              flaggedQuestions[q.num]
                                ? 'bg-[var(--soft-btn)] text-[var(--brand)]'
                                : 'text-[var(--text)] hover:bg-[var(--bg-warm)]'
                            }`}
                          >
                            <Flag className="h-3.5 w-3.5" />
                            <span>
                              {flaggedQuestions[q.num]
                                ? isBn
                                  ? 'ফ্ল্যাগ করা'
                                  : 'Flagged'
                                : isBn
                                  ? 'ফ্ল্যাগ'
                                  : 'Flag'}
                            </span>
                          </button>
                        </div>

                        <p className="mt-2 font-semibold text-[var(--brand-ink)]">
                          {isBn ? q.textBn : q.textEn}
                        </p>

                        <select
                          value={selected}
                          onChange={(e) =>
                            setReadingAnswers((prev) => ({ ...prev, [q.num]: e.target.value }))
                          }
                          aria-label={q.paragraphLabel}
                          className="mt-3 w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-3 py-2 text-xs font-medium text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                        >
                          <option value="">
                            {isBn ? 'শিরোনাম নির্বাচন করুন...' : 'Select a heading...'}
                          </option>
                          {HEADING_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {isBn ? opt.labelBn : opt.labelEn}
                            </option>
                          ))}
                        </select>

                        {readingChecked && (
                          <div
                            className={`mt-3 flex items-start gap-2 rounded-[4px] border p-2.5 text-xs ${
                              isCorrect
                                ? 'border-emerald-700/30 bg-emerald-50 text-emerald-950'
                                : 'border-[var(--brand)]/40 bg-[var(--bg-tint)] text-[var(--brand-ink)]'
                            }`}
                          >
                            {isCorrect ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-4 w-4 shrink-0 text-[var(--brand)] mt-0.5" />
                            )}
                            <div>
                              <span className="font-bold">
                                {isCorrect
                                  ? isBn
                                    ? 'সঠিক'
                                    : 'Correct'
                                  : `${isBn ? 'সঠিক উত্তর' : 'Correct Heading'}: ${q.correct}`}
                                {' — '}
                              </span>
                              <span>{isBn ? q.explanationBn : q.explanationEn}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* LISTENING RIGHT PANE */}
            {activeTab === 'listening' && (
              <div className={getTextSizeClass()}>
                <div className="mb-5 border-b border-[var(--hairline)] pb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-bold tracking-wide text-[var(--brand)]">
                      {isBn ? 'প্রশ্ন ৬–৯ • নোট পূরণ' : 'Questions 6–9 • Note Completion'}
                    </p>
                    <h2 className="mt-1 text-lg font-extrabold text-[var(--brand-ink)]">
                      {isBn
                        ? 'একটি শব্দ এবং/অথবা একটি সংখ্যা লিখুন'
                        : 'Write ONE WORD AND/OR A NUMBER'}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={() => setListeningChecked(true)}
                    className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--crimson)] cursor-pointer"
                  >
                    {isBn ? 'লিসেনিং যাচাই করুন' : 'Check Listening Answers'}
                  </button>
                </div>

                {listeningChecked && (
                  <div className="mb-5 rounded-[4px] border border-[var(--brand)] bg-[var(--bg-tint)] p-4 text-xs sm:text-sm font-bold text-[var(--brand-ink)]">
                    {isBn
                      ? `লিসেনিং স্কোর: ${listeningCorrectCount} / ${LISTENING_ITEMS.length} সঠিক`
                      : `Listening Score: ${listeningCorrectCount} / ${LISTENING_ITEMS.length} correct`}
                  </div>
                )}

                <div className="space-y-4">
                  {LISTENING_ITEMS.map((item) => {
                    const correct = isListeningCorrect(item);
                    return (
                      <div
                        key={item.num}
                        className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="inline-flex h-6 w-6 items-center justify-center rounded-[4px] bg-[var(--brand-deep)] text-xs font-bold text-white">
                            {item.num}
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleFlag(item.num)}
                            className={`flex items-center gap-1 rounded-[4px] px-2 py-1 text-xs font-semibold cursor-pointer ${
                              flaggedQuestions[item.num]
                                ? 'bg-[var(--soft-btn)] text-[var(--brand)]'
                                : 'text-[var(--text)] hover:bg-[var(--bg-warm)]'
                            }`}
                          >
                            <Flag className="h-3.5 w-3.5" />
                            <span>
                              {flaggedQuestions[item.num]
                                ? isBn
                                  ? 'ফ্ল্যাগ করা'
                                  : 'Flagged'
                                : isBn
                                  ? 'ফ্ল্যাগ'
                                  : 'Flag'}
                            </span>
                          </button>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm font-medium text-[var(--brand-ink)]">
                          <span>{isBn ? item.promptBeforeBn : item.promptBeforeEn}</span>
                          <input
                            type="text"
                            value={listeningAnswers[item.num] ?? ''}
                            onChange={(e) =>
                              setListeningAnswers((prev) => ({
                                ...prev,
                                [item.num]: e.target.value,
                              }))
                            }
                            placeholder={isBn ? 'উত্তর...' : 'Type answer...'}
                            aria-label={`Question ${item.num}`}
                            className="w-36 rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] px-2.5 py-1.5 font-mono text-xs font-bold text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                          />
                          <span>{isBn ? item.promptAfterBn : item.promptAfterEn}</span>
                        </div>

                        {listeningChecked && (
                          <div
                            className={`mt-3 flex items-start gap-2 rounded-[4px] border p-2.5 text-xs ${
                              correct
                                ? 'border-emerald-700/30 bg-emerald-50 text-emerald-950'
                                : 'border-[var(--brand)]/40 bg-[var(--bg-tint)] text-[var(--brand-ink)]'
                            }`}
                          >
                            {correct ? (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-700 mt-0.5" />
                            ) : (
                              <AlertCircle className="h-4 w-4 shrink-0 text-[var(--brand)] mt-0.5" />
                            )}
                            <div>
                              <span className="font-bold">
                                {correct
                                  ? isBn
                                    ? 'সঠিক'
                                    : 'Correct'
                                  : `${isBn ? 'সঠিক উত্তর' : 'Answer'}: ${item.displayAnswer}`}
                                {' — '}
                              </span>
                              <span>{isBn ? item.explanationBn : item.explanationEn}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* WRITING RIGHT PANE */}
            {activeTab === 'writing' && (
              <div>
                <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-[var(--hairline)] pb-3">
                  <div>
                    <h2 className="text-lg font-extrabold text-[var(--brand-ink)]">
                      {isBn ? 'টাস্ক ২ রচনা এডিটর' : 'Task 2 Essay Editor'}
                    </h2>
                    <p className="text-xs text-[var(--text)]">
                      {isBn
                        ? 'স্বয়ংক্রিয় শব্দ গণনা সক্রিয় (বানান সংশোধক বন্ধ)।'
                        : 'Live word counter active (spell-check disabled per official CBT).'}
                    </p>
                  </div>
                  <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-3 py-1.5 text-xs font-bold text-[var(--brand-ink)]">
                    {isBn ? 'শব্দ সংখ্যা:' : 'Words:'}{' '}
                    <span
                      className={
                        essayWordCount >= 250 ? 'text-emerald-700' : 'text-[var(--brand)]'
                      }
                    >
                      {essayWordCount}
                    </span>{' '}
                    / 250 min
                  </div>
                </div>

                <textarea
                  value={task2Essay}
                  onChange={(e) => setTask2Essay(e.target.value)}
                  spellCheck={false}
                  rows={11}
                  placeholder={
                    isBn ? 'আপনার টাস্ক ২ রচনা এখানে লিখুন...' : 'Type your Task 2 essay here...'
                  }
                  className="w-full rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4 font-mono text-sm leading-relaxed text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
                />

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={() => setWritingEvaluated(true)}
                    className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--crimson)] cursor-pointer"
                  >
                    {isBn
                      ? 'নমুনা ব্যান্ড মূল্যায়ন দেখুন'
                      : 'Evaluate Sample Band Breakdown'}
                  </button>
                  <span className="text-xs text-[var(--text)]">
                    {isBn
                      ? '৪টি অফিশিয়াল IELTS রুব্রিক মানদণ্ড অনুযায়ী আনুমানিক মূল্যায়ন'
                      : 'Estimated rubric breakdown across the 4 official IELTS criteria'}
                  </span>
                </div>

                {writingEvaluated && (
                  <div className="mt-5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4">
                    <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-2.5">
                      <h3 className="text-sm font-extrabold text-[var(--brand-ink)]">
                        {isBn
                          ? 'আনুমানিক ৪-মানদণ্ড রাইটিং রুব্রিক'
                          : 'Estimated 4-Criterion Writing Rubric'}
                      </h3>
                      <span className="rounded-[4px] bg-[var(--brand-deep)] px-2.5 py-1 text-xs font-bold text-white">
                        {isBn ? 'আনুমানিক ব্যান্ড:' : 'Estimated Band:'} {writingRubric.avg.toFixed(1)}
                      </span>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        {
                          title: 'Task Response',
                          score: writingRubric.tr,
                          noteEn:
                            essayWordCount >= 250
                              ? 'Meets 250-word minimum with clear position.'
                              : `Currently ${essayWordCount} words; aim for 250+ words for full development.`,
                          noteBn:
                            essayWordCount >= 250
                              ? '২৫০ শব্দের লক্ষ্য পূরণ হয়েছে এবং অবস্থান স্পষ্ট।'
                              : `বর্তমানে ${essayWordCount} শব্দ; পূর্ণ নম্বরের জন্য ২৫০+ শব্দ লিখুন।`,
                        },
                        {
                          title: 'Coherence & Cohesion',
                          score: writingRubric.cc,
                          noteEn: task2Essay.includes('\n\n')
                            ? 'Clear paragraph separation and logical progression.'
                            : 'Separate your introduction, body, and conclusion into paragraphs.',
                          noteBn: task2Essay.includes('\n\n')
                            ? 'অনুচ্ছেদ বিভাজন ও যুক্তির ধারাবাহিকতা স্পষ্ট।'
                            : 'ভূমিকা, মূল অংশ ও উপসংহার আলাদা অনুচ্ছেদে ভাগ করুন।',
                        },
                        {
                          title: 'Lexical Resource',
                          score: writingRubric.lr,
                          noteEn: 'Formal academic register maintained.',
                          noteBn: 'প্রাতিষ্ঠানিক ও যথাযথ শব্দচয়ন বজায় রয়েছে।',
                        },
                        {
                          title: 'Grammatical Range',
                          score: writingRubric.gr,
                          noteEn: 'Complex and compound structures used effectively.',
                          noteBn: 'জটিল ও যৌগিক বাক্য কার্যকরভাবে ব্যবহৃত হয়েছে।',
                        },
                      ].map((crit) => (
                        <div
                          key={crit.title}
                          className="rounded-[4px] border border-[var(--hairline)] bg-[var(--surface-paper)] p-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-[var(--brand-ink)]">
                              {crit.title}
                            </span>
                            <span className="rounded-[4px] bg-[var(--bg-tint)] px-2 py-0.5 text-xs font-extrabold text-[var(--brand)]">
                              {crit.score.toFixed(1)}
                            </span>
                          </div>
                          <p className="mt-1.5 text-xs text-[var(--text)]">
                            {isBn ? crit.noteBn : crit.noteEn}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* SPEAKING RIGHT PANE */}
            {activeTab === 'speaking' && (
              <div>
                <div className="mb-5 border-b border-[var(--hairline)] pb-4">
                  <p className="text-xs font-bold tracking-wide text-[var(--brand)]">
                    {isBn ? 'স্পিকিং ব্যান্ড ডিস্ক্রিপ্টর' : 'Speaking Band Descriptors'}
                  </p>
                  <h2 className="mt-1 text-lg font-extrabold text-[var(--brand-ink)]">
                    {isBn ? 'স্ব-মূল্যায়ন চেকলিস্ট' : 'Self-Assessment Checklist'}
                  </h2>
                </div>

                <div className="space-y-3">
                  {SPEAKING_CHECKLIST.map((item) => {
                    const checked = Boolean(speakingChecks[item.id]);
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() =>
                          setSpeakingChecks((prev) => ({ ...prev, [item.id]: !prev[item.id] }))
                        }
                        className={`flex w-full items-start gap-3 rounded-[4px] border p-3.5 text-left text-xs sm:text-sm transition-colors cursor-pointer ${
                          checked
                            ? 'border-[var(--brand)] bg-[var(--bg-tint)] text-[var(--brand-ink)]'
                            : 'border-[var(--hairline)] bg-[var(--bg)] text-[var(--text)] hover:bg-[var(--bg-warm)]'
                        }`}
                      >
                        {checked ? (
                          <CheckSquare className="h-4 w-4 shrink-0 text-[var(--brand)] mt-0.5" />
                        ) : (
                          <Square className="h-4 w-4 shrink-0 text-[var(--text)] mt-0.5" />
                        )}
                        <span className="font-medium">{isBn ? item.labelBn : item.labelEn}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-4 text-xs text-[var(--text)]">
                  <strong className="text-[var(--brand-ink)]">
                    {isBn ? 'প্রস্তুতি অগ্রগতি:' : 'Checklist Progress:'}{' '}
                  </strong>
                  {Object.values(speakingChecks).filter(Boolean).length} / {SPEAKING_CHECKLIST.length}{' '}
                  {isBn ? 'মানদণ্ড সম্পন্ন' : 'criteria confirmed'}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Sticky Scratch Notepad Drawer */}
        {isNotepadOpen && (
          <aside
            aria-label={isBn ? 'নোটপ্যাড' : 'Scratch Notepad'}
            className="fixed right-0 top-16 bottom-14 z-40 flex w-full flex-col border-l border-[var(--hairline)] bg-[var(--surface-paper)] p-5 sm:w-80"
          >
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-[var(--brand)]" />
                <h3 className="text-sm font-extrabold text-[var(--brand-ink)]">
                  {isBn ? 'খসড়া নোটপ্যাড' : 'Scratch Notepad'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsNotepadOpen(false)}
                aria-label="Close notepad"
                className="rounded-[4px] p-1 text-[var(--text)] hover:bg-[var(--bg-warm)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 text-xs text-[var(--text)]">
              {isBn
                ? 'এখানে লেখা নোট ব্যক্তিগত এবং মূল্যায়নের জন্য জমা হয় না।'
                : 'Notes taken here remain private and are not submitted for scoring.'}
            </p>
            <textarea
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              placeholder={
                isBn
                  ? 'অনুচ্ছেদ পরিকল্পনা বা মূল শব্দ লিখে রাখুন...'
                  : 'Outline your paragraph plan or key vocabulary...'
              }
              className="mt-3 flex-1 resize-none rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3 font-mono text-xs text-[var(--brand-ink)] focus:border-[var(--brand)] focus:outline-none"
            />
          </aside>
        )}
      </main>

      {/* Bottom Question Palette Bar */}
      <footer className="flex min-h-14 flex-wrap items-center justify-between gap-3 border-t border-white/15 bg-[var(--brand-deep)] px-4 py-2 text-white sm:px-6 lg:h-14 lg:flex-nowrap lg:py-0">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1.5 text-xs font-bold tracking-wide text-white/75">
            {isBn ? 'প্রশ্ন:' : 'Palette:'}
          </span>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => {
            const answered = isQuestionAnswered(num);
            const flagged = flaggedQuestions[num];
            return (
              <button
                key={num}
                type="button"
                onClick={() => handlePaletteJump(num)}
                title={num <= 5 ? `Reading Q${num}` : `Listening Q${num}`}
                className={`relative flex h-8 w-8 items-center justify-center rounded-[4px] border text-xs font-bold transition-colors cursor-pointer ${
                  answered
                    ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                    : 'border-white/20 bg-white/10 text-white/85 hover:bg-white/20'
                }`}
              >
                {num}
                {flagged && (
                  <span
                    className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-[2px] bg-[var(--accent)]"
                    aria-label="Flagged"
                  />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            href="/ielts"
            className="rounded-[4px] border border-white/25 bg-white/10 px-3 py-1.5 text-xs font-semibold text-white hover:bg-white/20"
          >
            {isBn ? 'IELTS পাতায় ফিরুন' : 'Back to IELTS'}
          </Link>
          <button
            type="button"
            onClick={() => setIsReportOpen(true)}
            className="flex items-center gap-1.5 rounded-[4px] bg-[var(--accent)] px-3.5 py-1.5 text-xs font-bold text-white hover:bg-[var(--terracotta)] cursor-pointer"
          >
            <span>{isBn ? 'জমা দিন ও ব্যান্ড রিপোর্ট দেখুন' : 'Submit & View Band Report'}</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </footer>

      {/* Band Report Modal */}
      {isReportOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="ielts-band-report-title"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
        >
          <div className="w-full max-w-lg rounded-[4px] border-2 border-[var(--brand-deep)] bg-[var(--surface-paper)] p-6 text-[var(--brand-ink)]">
            <div className="flex items-center justify-between border-b border-[var(--hairline)] pb-3">
              <h2 id="ielts-band-report-title" className="text-lg font-extrabold">
                {isBn ? 'CD-IELTS™ নমুনা ব্যান্ড রিপোর্ট' : 'CD-IELTS™ Sample Band Report'}
              </h2>
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                aria-label="Close report"
                className="rounded-[4px] p-1 text-[var(--text)] hover:bg-[var(--bg-warm)] cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3.5">
                <p className="text-xs font-bold text-[var(--text)]">Reading (Q1–Q5)</p>
                <p className="mt-1 text-xl font-extrabold text-[var(--brand-ink)]">
                  {readingCorrectCount} / 5
                </p>
              </div>
              <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3.5">
                <p className="text-xs font-bold text-[var(--text)]">Listening (Q6–Q9)</p>
                <p className="mt-1 text-xl font-extrabold text-[var(--brand-ink)]">
                  {listeningCorrectCount} / 4
                </p>
              </div>
              <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3.5">
                <p className="text-xs font-bold text-[var(--text)]">Writing Task 2</p>
                <p className="mt-1 text-xl font-extrabold text-[var(--brand-ink)]">
                  {essayWordCount} {isBn ? 'শব্দ' : 'words'} ({writingRubric.avg.toFixed(1)} Est.)
                </p>
              </div>
              <div className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] p-3.5">
                <p className="text-xs font-bold text-[var(--text)]">Speaking Checklist</p>
                <p className="mt-1 text-xl font-extrabold text-[var(--brand-ink)]">
                  {Object.values(speakingChecks).filter(Boolean).length} / {SPEAKING_CHECKLIST.length}
                </p>
              </div>
            </div>

            <p className="mt-4 text-xs text-[var(--text)]">
              {isBn
                ? 'বিঃদ্রঃ এটি একটি অনুশীলন ওয়ার্কবেঞ্চ; প্রদর্শিত ব্যান্ড স্কোরসমূহ আনুমানিক। পূর্ণ ৪-মডিউল মক টেস্টের জন্য আমাদের IELTS প্রোগ্রাম দেখুন।'
                : 'Note: This is an interactive format workbench; displayed band scores are estimated. Explore our full 4-module IELTS mock tests on the IELTS track page.'}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsReportOpen(false)}
                className="rounded-[4px] border border-[var(--hairline)] bg-[var(--bg)] px-4 py-2 text-xs font-semibold text-[var(--brand-ink)] hover:bg-[var(--bg-warm)] cursor-pointer"
              >
                {isBn ? 'অনুশীলন চালিয়ে যান' : 'Continue Practicing'}
              </button>
              <Link
                href="/ielts"
                className="rounded-[4px] bg-[var(--brand)] px-4 py-2 text-xs font-bold text-white hover:bg-[var(--crimson)]"
              >
                {isBn ? 'IELTS প্রোগ্রাম দেখুন' : 'Explore IELTS Track'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
