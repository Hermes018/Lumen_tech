'use client';

/** @purpose IDP-faithful IELTS on Computer CBT Split-Screen interface with resizable panes, text highlighter, sticky notepad, text-size toggle, and live word counter (docs/07 §3) */

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Button,
  Badge,
} from '@lumen/ui';
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
} from 'lucide-react';
import { countWords } from '@lumen/ai';

type TextSize = 'standard' | 'large' | 'extralarge';
type ActiveTab = 'reading' | 'writing';

export function IeltsSplitScreenClient() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('reading');
  const [textSize, setTextSize] = useState<TextSize>('standard');
  const [mobileSegment, setMobileSegment] = useState<'passage' | 'questions' | 'notepad'>('passage');
  const [isTimerVisible, setIsTimerVisible] = useState(true);
  const [isNotepadOpen, setIsNotepadOpen] = useState(false);
  const [notesContent, setNotesContent] = useState('');
  const [leftWidthPercent, setLeftWidthPercent] = useState(50);
  const isDraggingRef = useRef(false);

  // Highlighting state
  const [selectedHighlightColor, setSelectedHighlightColor] = useState<'yellow' | 'pink'>('yellow');
  const [_highlights, setHighlights] = useState<Array<{ text: string; color: string }>>([]);

  // Reading answers state
  const [readingAnswers, setReadingAnswers] = useState<Record<number, string>>({
    1: 'TRUE',
    2: 'FALSE',
  });
  const [flaggedQuestions, setFlaggedQuestions] = useState<Record<number, boolean>>({});

  // Writing answers state
  const [task1Text, setTask1Text] = useState(
    'The provided bar chart illustrates the demographic shifts across four urban regions between 2010 and 2020. Overall, substantial growth is observed in metropolitan areas, while rural figures remained largely stagnant.'
  );
  const [task2Text, setTask2Text] = useState(
    'In recent years, the rapid advancement of artificial intelligence has sparked intense debate regarding workplace automation. While proponents argue that automated systems increase productivity and eliminate hazardous manual labor, critics maintain that mass dislocation poses severe socio-economic risks. In my view, strategic regulatory oversight combined with vocational retraining represents the most balanced path forward.'
  );

  const wordCountTask1 = countWords(task1Text);
  const wordCountTask2 = countWords(task2Text);

  // Resize handler for split screen
  const handleMouseDown = () => {
    isDraggingRef.current = true;
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDraggingRef.current) return;
      const newPercent = (e.clientX / window.innerWidth) * 100;
      if (newPercent >= 25 && newPercent <= 75) {
        setLeftWidthPercent(newPercent);
      }
    };

    const handleMouseUp = () => {
      isDraggingRef.current = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const getTextSizeClass = () => {
    switch (textSize) {
      case 'large':
        return 'text-base leading-relaxed';
      case 'extralarge':
        return 'text-lg leading-loose';
      default:
        return 'text-sm leading-normal';
    }
  };

  const addHighlight = () => {
    const selection = window.getSelection();
    if (!selection || selection.isCollapsed) return;
    const text = selection.toString().trim();
    if (text.length > 0) {
      setHighlights((prev) => [...prev, { text, color: selectedHighlightColor }]);
      selection.removeAllRanges();
    }
  };

  return (
    <div className="flex h-screen w-full max-w-none m-0 flex-col overflow-x-hidden bg-[#eef0f3] text-[#222] font-sans select-none">
      {/* Official IDP CBT Header */}
      <header className="flex h-14 items-center justify-between border-b border-[#c8ccd0] bg-[#1e293b] px-4 text-white shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="rounded bg-red-600 px-2 py-0.5 text-xs font-black tracking-wider text-white">
              IELTS
            </span>
            <span className="font-semibold text-xs tracking-wide uppercase text-gray-200">
              on Computer • Official Simulator
            </span>
          </div>

          <div className="hidden items-center gap-2 border-l border-gray-600 pl-4 text-xs sm:flex">
            <span className="text-gray-400">Candidate:</span>
            <span className="font-medium text-white">Ayman Rahman (ID: 049821)</span>
          </div>
        </div>

        {/* Center: Timer & Mode Navigation */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-md bg-[#0f172a] p-0.5 border border-gray-700">
            <button
              onClick={() => setActiveTab('reading')}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === 'reading'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Reading Section
            </button>
            <button
              onClick={() => setActiveTab('writing')}
              className={`rounded px-3 py-1 text-xs font-medium transition-colors ${
                activeTab === 'writing'
                  ? 'bg-amber-500 text-black font-semibold'
                  : 'text-gray-300 hover:text-white'
              }`}
            >
              Writing Section
            </button>
          </div>

          {/* Time Display */}
          <div className="flex items-center gap-2 rounded bg-gray-800 px-3 py-1">
            <Clock className="h-4 w-4 text-amber-400" />
            {isTimerVisible ? (
              <span className="font-mono text-sm font-bold text-white tracking-wider">
                58:45
              </span>
            ) : (
              <span className="font-mono text-xs text-gray-400">Timer Hidden</span>
            )}
            <button
              onClick={() => setIsTimerVisible(!isTimerVisible)}
              className="text-gray-400 hover:text-white"
              title={isTimerVisible ? 'Hide Timer' : 'Show Timer'}
            >
              {isTimerVisible ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
            </button>
          </div>
        </div>

        {/* Right Tools: Text Size, Highlighter, Notepad */}
        <div className="flex items-center gap-2">
          {/* Text Size Selector */}
          <div className="flex items-center rounded border border-gray-700 bg-gray-800 px-2 py-1 text-xs">
            <Type className="mr-1 h-3.5 w-3.5 text-gray-400" />
            <select
              value={textSize}
              onChange={(e) => setTextSize(e.target.value as TextSize)}
              className="cursor-pointer bg-transparent font-medium text-gray-200 outline-none"
            >
              <option value="standard" className="bg-gray-800 text-white">
                Standard
              </option>
              <option value="large" className="bg-gray-800 text-white">
                Large
              </option>
              <option value="extralarge" className="bg-gray-800 text-white">
                Extra Large
              </option>
            </select>
          </div>

          {/* Highlighter color tool */}
          <div className="hidden items-center gap-1 rounded border border-gray-700 bg-gray-800 px-2 py-1 md:flex">
            <Highlighter className="h-3.5 w-3.5 text-gray-400" />
            <button
              onClick={() => {
                setSelectedHighlightColor('yellow');
                addHighlight();
              }}
              className="h-4 w-4 rounded-full bg-yellow-300 ring-1 ring-white/20 hover:scale-110"
              title="Highlight Yellow"
            />
            <button
              onClick={() => {
                setSelectedHighlightColor('pink');
                addHighlight();
              }}
              className="h-4 w-4 rounded-full bg-pink-400 ring-1 ring-white/20 hover:scale-110"
              title="Highlight Pink"
            />
          </div>

          {/* Sticky Notepad Drawer Toggle */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsNotepadOpen(!isNotepadOpen)}
            className="border-gray-700 bg-gray-800 text-xs text-gray-200 hover:bg-gray-700"
          >
            <FileText className="mr-1 h-3.5 w-3.5" />
            Notepad
          </Button>
        </div>
      </header>

      {/* Mobile Segment Bar (< 1024px) */}
      <div className="flex lg:hidden items-center justify-around border-b border-gray-300 bg-gray-100 p-1 text-xs font-semibold text-gray-700">
        <button
          type="button"
          onClick={() => setMobileSegment('passage')}
          className={`flex-1 py-1.5 text-center rounded transition-colors ${
            mobileSegment === 'passage'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Passage
        </button>
        <button
          type="button"
          onClick={() => setMobileSegment('questions')}
          className={`flex-1 py-1.5 text-center rounded transition-colors ${
            mobileSegment === 'questions'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Questions
        </button>
        <button
          type="button"
          onClick={() => setMobileSegment('notepad')}
          className={`flex-1 py-1.5 text-center rounded transition-colors ${
            mobileSegment === 'notepad'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Notepad
        </button>
      </div>

      {/* Main Split Screen Body */}
      <main className="relative flex flex-1 overflow-hidden select-text w-full max-w-none m-0">
        {/* Left Resizable Pane */}
        <div
          className={`h-full min-w-0 overflow-y-auto border-r border-[#c8ccd0] bg-white p-4 sm:p-6 shadow-inner ${
            mobileSegment === 'passage' ? 'w-full block' : 'hidden lg:block'
          } lg:w-[var(--pane-width)]`}
          style={{ '--pane-width': `${leftWidthPercent}%` } as React.CSSProperties}
        >
          {activeTab === 'reading' ? (
            <div className={getTextSizeClass()}>
              <div className="mb-4 border-b border-gray-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  READING PASSAGE 1
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  The Evolutionary Biology of Deep-Sea Bioluminescence
                </h2>
                <p className="text-xs text-gray-500 mt-1">
                  You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.
                </p>
              </div>

              <div className="space-y-4 text-gray-800">
                <p>
                  Bioluminescence—the production and emission of light by a living organism—is among the most prevalent biological adaptations in oceanic ecosystems. In the pelagic bathypelagic zone, where solar photons are completely absent, organisms have evolved autonomous luciferin-luciferase catalytic mechanisms.
                </p>
                <p className="rounded bg-yellow-100 p-1">
                  Contrary to early 20th-century assumptions that deep-sea species inhabited an inert darkness, research reveals a dynamic sensory landscape where light flashes serve predator deterrence, mate recognition, and counterillumination camouflage.
                </p>
                <p>
                  Counterillumination functions as an optical cloaking mechanism. Organisms such as the midwater squid orient photophores ventrally, modulating luminous output to match the downwelling ambient radiance. By eliminating their silhouette when viewed from below, these cephalopods achieve near-total visual invisibility against prospective predators.
                </p>
                <p>
                  Moreover, deep-water anglerfishes exploit symbiotic bioluminescent bacteria housed within an elongated dorsal spine known as the illicium. The luminous esca attracts inquisitive crustaceans directly toward the predator&apos;s waiting jaws.
                </p>
              </div>
            </div>
          ) : (
            <div className={getTextSizeClass()}>
              <div className="mb-4 border-b border-gray-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                  WRITING TASK 1 & TASK 2 PROMPT
                </span>
                <h2 className="text-xl font-bold text-gray-900 mt-1">
                  Academic Writing Prompts
                </h2>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4 mb-6">
                <span className="rounded bg-gray-800 px-2 py-0.5 text-[11px] font-bold uppercase text-white">
                  TASK 1 (Minimum 150 words)
                </span>
                <p className="mt-2 text-sm text-gray-800">
                  The graph below shows urban migration trends in Bangladesh from 2010 to 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.
                </p>
              </div>

              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <span className="rounded bg-gray-800 px-2 py-0.5 text-[11px] font-bold uppercase text-white">
                  TASK 2 (Minimum 250 words • Weighted 2x)
                </span>
                <p className="mt-2 text-sm text-gray-800">
                  Some people believe that technological automation will lead to widespread joblessness, while others argue it will foster innovation and create new industries. Discuss both views and give your own opinion.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Resizer Handle */}
        <div
          onMouseDown={handleMouseDown}
          className="group relative hidden lg:flex h-full w-2.5 cursor-col-resize items-center justify-center bg-[#dde1e6] hover:bg-amber-400 active:bg-amber-500 transition-colors shrink-0"
          title="Drag to resize split panes"
        >
          <GripVertical className="h-4 w-4 text-gray-500 group-hover:text-black" />
        </div>

        {/* Right Resizable Pane */}
        <div
          className={`h-full min-w-0 flex-1 overflow-y-auto bg-[#f8f9fa] p-4 sm:p-6 ${
            mobileSegment === 'questions' ? 'w-full block' : 'hidden lg:block'
          } lg:w-[var(--right-pane-width)]`}
          style={{ '--right-pane-width': `${100 - leftWidthPercent}%` } as React.CSSProperties}
        >
          {activeTab === 'reading' ? (
            <div className={getTextSizeClass()}>
              <div className="mb-4 border-b border-gray-200 pb-3">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">
                  QUESTIONS 1–4: TRUE / FALSE / NOT GIVEN
                </span>
                <p className="mt-1 text-xs text-gray-500">
                  Do the following statements agree with the information given in Reading Passage 1?
                </p>
              </div>

              <div className="space-y-6">
                {[
                  {
                    num: 1,
                    text: 'Solar photons can still penetrate into the bathypelagic zone during peak daylight.',
                  },
                  {
                    num: 2,
                    text: 'Counterillumination works by casting dark shadows over approaching prey.',
                  },
                  {
                    num: 3,
                    text: 'The illicium of anglerfishes relies on internally synthesized enzymes rather than bacteria.',
                  },
                ].map((q) => (
                  <div key={q.num} className="rounded-lg border border-gray-200 bg-white p-4 shadow-2xs min-w-0 break-words">
                    <div className="flex items-start justify-between">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-xs font-bold text-gray-700">
                        {q.num}
                      </span>
                      <button
                        onClick={() =>
                          setFlaggedQuestions((prev) => ({ ...prev, [q.num]: !prev[q.num] }))
                        }
                        className={`flex items-center gap-1 text-xs ${
                          flaggedQuestions[q.num]
                            ? 'font-bold text-amber-600'
                            : 'text-gray-400 hover:text-gray-600'
                        }`}
                      >
                        <Flag className="h-3.5 w-3.5" />
                        <span>{flaggedQuestions[q.num] ? 'Flagged' : 'Flag'}</span>
                      </button>
                    </div>

                    <p className="mt-2 font-medium text-gray-900 break-words">{q.text}</p>

                    <div className="mt-3 flex gap-3">
                      {['TRUE', 'FALSE', 'NOT GIVEN'].map((opt) => (
                        <label
                          key={opt}
                          className={`flex cursor-pointer items-center gap-2 rounded border px-3 py-1.5 text-xs font-medium transition-colors ${
                            readingAnswers[q.num] === opt
                              ? 'border-blue-600 bg-blue-50 text-blue-900 font-semibold'
                              : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`q_${q.num}`}
                            value={opt}
                            checked={readingAnswers[q.num] === opt}
                            onChange={() =>
                              setReadingAnswers((prev) => ({ ...prev, [q.num]: opt }))
                            }
                            className="hidden"
                          />
                          <span>{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Task 1 Response Area */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-bold text-gray-900">Task 1 Response</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">
                      Word Count:
                    </span>
                    <Badge
                      className={`text-xs ${
                        wordCountTask1 >= 150
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {wordCountTask1} / 150 min
                    </Badge>
                  </div>
                </div>

                <textarea
                  value={task1Text}
                  onChange={(e) => setTask1Text(e.target.value)}
                  spellCheck="false"
                  rows={6}
                  placeholder="Type your Task 1 response here..."
                  className="mt-3 w-full rounded border border-gray-300 p-3 font-mono text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
                />
              </div>

              {/* Task 2 Response Area */}
              <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-2xs">
                <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                  <h3 className="text-sm font-bold text-gray-900">
                    Task 2 Essay Response (Double Weighted)
                  </h3>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-gray-600">
                      Word Count:
                    </span>
                    <Badge
                      className={`text-xs ${
                        wordCountTask2 >= 250
                          ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                          : 'bg-amber-100 text-amber-800 border-amber-300'
                      }`}
                    >
                      {wordCountTask2} / 250 min
                    </Badge>
                  </div>
                </div>

                <textarea
                  value={task2Text}
                  onChange={(e) => setTask2Text(e.target.value)}
                  spellCheck="false"
                  rows={10}
                  placeholder="Type your Task 2 essay here..."
                  className="mt-3 w-full rounded border border-gray-300 p-3 font-mono text-sm text-gray-900 focus:border-blue-600 focus:outline-none"
                />
              </div>
            </div>
          )}
        </div>

        {/* Sticky Notepad Drawer */}
        {(isNotepadOpen || mobileSegment === 'notepad') && (
          <div className="absolute right-0 top-0 bottom-0 z-40 w-full sm:w-80 border-l border-gray-300 bg-amber-50 p-4 shadow-xl flex flex-col">
            <div className="flex items-center justify-between border-b border-amber-200 pb-2">
              <div className="flex items-center gap-2">
                <Edit3 className="h-4 w-4 text-amber-700" />
                <h3 className="text-sm font-bold text-amber-900">Scratch Notepad</h3>
              </div>
              <button
                onClick={() => {
                  setIsNotepadOpen(false);
                  if (mobileSegment === 'notepad') setMobileSegment('passage');
                }}
                className="text-gray-500 hover:text-gray-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-1 text-[11px] text-amber-800">
              Notes taken here remain private and are not submitted for scoring.
            </p>
            <textarea
              value={notesContent}
              onChange={(e) => setNotesContent(e.target.value)}
              placeholder="Outline your thoughts, paragraph plan, or vocabulary..."
              className="mt-3 flex-1 resize-none rounded border border-amber-200 bg-white p-3 font-mono text-xs text-gray-900 focus:border-amber-400 focus:outline-none"
            />
          </div>
        )}
      </main>

      {/* Official Bottom Navigation Footer */}
      <footer className="flex h-14 items-center justify-between border-t border-[#c8ccd0] bg-[#1e293b] px-4 text-white">
        {/* Question Palette Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1">
          <span className="text-xs font-semibold uppercase text-gray-400 mr-2">
            Questions:
          </span>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13].map((num) => {
            const isAnswered = readingAnswers[num] !== undefined;
            const isFlagged = flaggedQuestions[num];

            return (
              <button
                key={num}
                className={`flex h-8 w-8 items-center justify-center rounded text-xs font-bold transition-all relative ${
                  isAnswered
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {num}
                {isFlagged && (
                  <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-amber-400 ring-2 ring-gray-900" />
                )}
              </button>
            );
          })}
        </div>

        <div className="flex items-center gap-3">
          <Link href="/app">
            <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
              Exit to Dashboard
            </Button>
          </Link>
          <Button size="sm" className="bg-amber-500 font-semibold text-black hover:bg-amber-400">
            Submit Section <Send className="ml-1.5 h-3.5 w-3.5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}
