'use client';

/** @purpose Interactive Distraction-Calm Course Player with dynamic moving anti-piracy watermark, collapsible syllabus sidebar, and notes/drill/Q&A tabs (anti-piracy watermark, docs/10 §8) */

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  type CourseSyllabus,
  type SignedVideoEmbed,
  type LessonProgress,
  type Lesson,
  type CourseModule,
  findLessonInSyllabus,
  trackLectureProgress,
  calculateCourseMastery,
} from '@lumen/core';
import {
  Button,
  Badge,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@lumen/ui';
import {
  Play,
  Pause,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Circle,
  ChevronLeft,
  ChevronRight,
  Menu,
  X,
  Volume2,
  Maximize2,
  Award,
  BookOpen,
  HelpCircle,
  Sparkles,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface CoursePlayerClientProps {
  courseSlug: string;
  lessonSlug: string;
  syllabus: CourseSyllabus;
  signedEmbed: SignedVideoEmbed;
  user: {
    id: string;
    name: string;
  };
}

export function CoursePlayerClient({
  courseSlug,
  lessonSlug,
  syllabus,
  signedEmbed,
  user,
}: CoursePlayerClientProps) {
  const lessonData = findLessonInSyllabus(syllabus, lessonSlug);
  const fallbackModule: CourseModule = syllabus.modules[0] ?? {
    id: 'mod_default',
    slug: 'default',
    title: 'Module 1',
    order: 1,
    lessons: [],
  };
  const fallbackLesson: Lesson = fallbackModule.lessons[0] ?? {
    id: 'les_default',
    slug: lessonSlug,
    title: 'Lesson',
    order: 1,
    durationSeconds: 900,
    nodes: [],
  };

  const currentLesson: Lesson = lessonData?.lesson ?? fallbackLesson;
  const currentModule: CourseModule = lessonData?.module ?? fallbackModule;

  // Video playback states
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [currentSeconds, setCurrentSeconds] = useState(0);
  const totalSeconds = currentLesson.durationSeconds || 900;

  // Local progress tracking state
  const [progressMap, setProgressMap] = useState<Record<string, LessonProgress>>({
    [currentLesson.id]: {
      lessonId: currentLesson.id,
      watchedSeconds: 0,
      totalSeconds,
      completed: false,
      bookmarked: false,
    },
  });

  // Dynamic moving watermark state per docs/10 §8.7
  const [watermarkPos, setWatermarkPos] = useState({
    x: 12 + (signedEmbed.watermark.positionSeed % 60),
    y: 15 + (signedEmbed.watermark.positionSeed % 55),
  });

  // Watermark repositioning timer
  useEffect(() => {
    const interval = setInterval(() => {
      // Jitter position across the video frame (10% to 75% margins to prevent clipping)
      setWatermarkPos({
        x: Math.floor(10 + Math.random() * 65),
        y: Math.floor(12 + Math.random() * 68),
      });
    }, 12000); // 12 seconds per repositioning cycle

    return () => clearInterval(interval);
  }, []);

  // Playback timer simulation
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        setCurrentSeconds((prev) => {
          const next = Math.min(prev + 1, totalSeconds);
          if (next >= totalSeconds) {
            setIsPlaying(false);
          }
          // Update progress
          setProgressMap((prevMap) => {
            const current = prevMap[currentLesson.id];
            const updated = trackLectureProgress(current, {
              lessonId: currentLesson.id,
              watchedSeconds: next,
              totalSeconds,
              bookmarked: isBookmarked,
            });
            return { ...prevMap, [currentLesson.id]: updated };
          });
          return next;
        });
      }, 1000 / playbackSpeed);
    }
    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, totalSeconds, currentLesson.id, isBookmarked]);

  const toggleBookmark = () => {
    setIsBookmarked(!isBookmarked);
    setProgressMap((prev) => {
      const current = prev[currentLesson.id];
      if (!current) return prev;
      return {
        ...prev,
        [currentLesson.id]: {
          ...current,
          bookmarked: !isBookmarked,
        },
      };
    });
  };

  const mastery = calculateCourseMastery(syllabus, progressMap);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const speedOptions = [0.75, 1.0, 1.25, 1.5, 1.75, 2.0];

  return (
    <div className="min-h-screen bg-[#0f1117] text-white">
      {/* Top Header */}
      <header className="border-b border-[#232734] bg-[#161a23] px-4 py-3">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <Link
              href="/app"
              className="flex items-center gap-1 text-xs font-medium text-gray-400 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Back to Dashboard</span>
            </Link>
            <span className="text-gray-600">|</span>
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                {syllabus.exam.toUpperCase()} COURSE
              </span>
              <h1 className="text-sm font-semibold text-white md:text-base">
                {syllabus.title}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-xs text-gray-400">Course Mastery:</span>
              <div className="h-2 w-24 overflow-hidden rounded-full bg-gray-700">
                <div
                  className="h-full bg-emerald-500 transition-all duration-300"
                  style={{ width: `${mastery.masteryPercentage}%` }}
                />
              </div>
              <span className="text-xs font-bold text-emerald-400">
                {mastery.masteryPercentage}%
              </span>
            </div>

            {mastery.isEligibleForCertificate ? (
              <Badge className="bg-emerald-950 text-emerald-300 border border-emerald-700">
                <Award className="mr-1 h-3 w-3" /> Certificate Unlocked
              </Badge>
            ) : (
              <Badge className="bg-gray-800 text-gray-300 border border-gray-700">
                <Award className="mr-1 h-3 w-3" /> 80% needed for Cert
              </Badge>
            )}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="border-gray-700 bg-gray-800/80 text-gray-200 hover:bg-gray-700"
              aria-label="Toggle Syllabus Sidebar"
            >
              <Menu className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Layout */}
      <div className="mx-auto flex max-w-7xl flex-col lg:flex-row">
        {/* Left Column: Player & Tabs */}
        <div className="flex-1 p-4 lg:p-6">
          {/* Video Player Frame Container */}
          <div
            className="group relative aspect-video w-full overflow-hidden rounded-xl border border-gray-800 bg-black shadow-2xl"
            id="video-player-container"
          >
            {/* The Moving Visible Anti-Piracy Watermark Overlay (anti-piracy, docs/10 §8.7) */}
            <div
              className="pointer-events-none absolute z-50 select-none transition-all duration-1000 ease-out"
              style={{
                left: `${watermarkPos.x}%`,
                top: `${watermarkPos.y}%`,
                mixBlendMode: 'difference',
              }}
              data-testid="anti-piracy-watermark"
            >
              <div className="flex items-center gap-1.5 rounded bg-black/30 px-2 py-0.5 text-xs font-mono font-medium tracking-wide text-white/70 shadow-sm backdrop-blur-[1px]">
                <ShieldAlert className="h-3 w-3 text-amber-400/80" />
                <span>{signedEmbed.watermark.displayText}</span>
                <span className="text-[10px] text-gray-400">({user.name} · {signedEmbed.watermark.maskedPhone})</span>
              </div>
            </div>

            {/* Video Canvas / Mock Player Surface */}
            <div className="flex h-full w-full flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-950 to-black p-8 text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/20">
                <BookOpen className="h-8 w-8" />
              </div>
              <h2 className="text-lg font-bold text-white md:text-xl">
                {currentLesson.title}
              </h2>
              <p className="mt-1 text-xs text-gray-400 md:text-sm">
                Module: {currentModule.title}
              </p>

              {/* Center Play Button Overlay */}
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="mt-6 flex h-14 w-14 items-center justify-center rounded-full bg-amber-500 text-black shadow-lg transition-transform hover:scale-105 active:scale-95"
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="ml-1 h-6 w-6" />}
              </button>
            </div>

            {/* Bottom Controls Bar */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent p-4 opacity-95 transition-opacity">
              {/* Progress Slider */}
              <div className="mb-2 flex items-center gap-2">
                <span className="text-[11px] font-mono text-gray-300">
                  {formatTime(currentSeconds)}
                </span>
                <input
                  type="range"
                  min="0"
                  max={totalSeconds}
                  value={currentSeconds}
                  onChange={(e) => setCurrentSeconds(Number(e.target.value))}
                  className="h-1.5 w-full cursor-pointer appearance-none rounded-lg bg-gray-700 accent-amber-500"
                />
                <span className="text-[11px] font-mono text-gray-300">
                  {formatTime(totalSeconds)}
                </span>
              </div>

              {/* Control Buttons */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="text-white hover:text-amber-400"
                  >
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </button>

                  <div className="flex items-center gap-1">
                    <Volume2 className="h-4 w-4 text-gray-400" />
                    <span className="text-xs text-gray-400">100%</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Speed Selector */}
                  <div className="flex items-center gap-1 rounded bg-gray-800/80 px-2 py-1 text-xs">
                    <span className="text-gray-400">Speed:</span>
                    <select
                      value={playbackSpeed}
                      onChange={(e) => setPlaybackSpeed(Number(e.target.value))}
                      className="cursor-pointer bg-transparent font-medium text-amber-400 outline-none"
                    >
                      {speedOptions.map((s) => (
                        <option key={s} value={s} className="bg-gray-900 text-white">
                          {s}x
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Bookmark Button */}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={toggleBookmark}
                    className={`h-8 px-2 text-xs ${
                      isBookmarked
                        ? 'text-amber-400 hover:text-amber-300'
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {isBookmarked ? (
                      <>
                        <BookmarkCheck className="mr-1 h-4 w-4 text-amber-400" /> Bookmarked
                      </>
                    ) : (
                      <>
                        <Bookmark className="mr-1 h-4 w-4" /> Bookmark
                      </>
                    )}
                  </Button>

                  <button className="text-gray-400 hover:text-white">
                    <Maximize2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Adjacent Lesson Navigation */}
          <div className="mt-4 flex items-center justify-between border-b border-gray-800 pb-4">
            {lessonData?.prevLesson ? (
              <Link
                href={`/app/learn/${courseSlug}/${lessonData.prevLesson.lessonSlug}`}
                className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-amber-400"
              >
                <ChevronLeft className="h-4 w-4" />
                <span>Previous: {lessonData.prevLesson.title}</span>
              </Link>
            ) : (
              <div />
            )}

            {lessonData?.nextLesson ? (
              <Link
                href={`/app/learn/${courseSlug}/${lessonData.nextLesson.lessonSlug}`}
                className="flex items-center gap-2 text-xs font-medium text-gray-400 hover:text-amber-400"
              >
                <span>Next: {lessonData.nextLesson.title}</span>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <div />
            )}
          </div>

          {/* Lesson Content Tabs */}
          <div className="mt-6">
            <Tabs defaultValue="notes" className="w-full">
              <TabsList className="border-b border-gray-800 bg-transparent p-0">
                <TabsTrigger
                  value="notes"
                  className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-400 data-[state=active]:border-amber-400 data-[state=active]:bg-transparent data-[state=active]:text-amber-400"
                >
                  <BookOpen className="mr-2 h-4 w-4" />
                  Lesson Notes & Formulas
                </TabsTrigger>
                <TabsTrigger
                  value="drill"
                  className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-400 data-[state=active]:border-amber-400 data-[state=active]:bg-transparent data-[state=active]:text-amber-400"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Linked Practice Drill
                </TabsTrigger>
                <TabsTrigger
                  value="qa"
                  className="rounded-none border-b-2 border-transparent px-4 py-2.5 text-sm font-medium text-gray-400 data-[state=active]:border-amber-400 data-[state=active]:bg-transparent data-[state=active]:text-amber-400"
                >
                  <HelpCircle className="mr-2 h-4 w-4" />
                  Lesson Q&A
                </TabsTrigger>
              </TabsList>

              {/* Notes & Formulas Tab */}
              <TabsContent value="notes" className="pt-4 text-gray-300">
                <div className="space-y-4 rounded-xl border border-gray-800 bg-[#161a23] p-5">
                  <h3 className="text-base font-semibold text-white">
                    Core Concepts & Takeaways
                  </h3>
                  <p className="text-sm leading-relaxed text-gray-300">
                    {currentLesson.notes ??
                      'Master the fundamental properties and timing discipline for this section. Review the cheat-sheet rules below before attempting the practice set.'}
                  </p>

                  {currentLesson.formulaList && currentLesson.formulaList.length > 0 && (
                    <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-4">
                      <h4 className="mb-2 text-xs font-semibold uppercase tracking-wider text-amber-400">
                        Formulas & Quick Rules
                      </h4>
                      <ul className="space-y-1.5 font-mono text-xs text-amber-200">
                        {currentLesson.formulaList.map((formula, idx) => (
                          <li key={idx} className="flex items-center gap-2">
                            <span className="text-amber-400">•</span>
                            <span>{formula}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Linked Practice Drill Tab */}
              <TabsContent value="drill" className="pt-4 text-gray-300">
                <div className="rounded-xl border border-gray-800 bg-[#161a23] p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <h3 className="text-base font-semibold text-white">
                        Linked Practice Drill
                      </h3>
                      <p className="mt-1 text-sm text-gray-400">
                        Test your retention of {currentLesson.title} with 5 targeted active-recall items.
                      </p>
                    </div>
                    <Link href={`/app/practice?topic=${currentLesson.slug}`}>
                      <Button className="bg-amber-500 text-black hover:bg-amber-400">
                        Launch Drill <ArrowRight className="ml-1.5 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </TabsContent>

              {/* Lesson Q&A Tab */}
              <TabsContent value="qa" className="pt-4 text-gray-300">
                <div className="rounded-xl border border-gray-800 bg-[#161a23] p-5">
                  <h3 className="text-base font-semibold text-white">
                    Student Discussion & Instructor Q&A
                  </h3>
                  <p className="mt-1 text-xs text-gray-400">
                    Questions asked here are answered by mentors within 24 hours.
                  </p>

                  <div className="mt-4">
                    <textarea
                      placeholder="Ask a clarifying question about this lesson..."
                      className="w-full rounded-lg border border-gray-700 bg-gray-900 p-3 text-sm text-white placeholder-gray-500 focus:border-amber-400 focus:outline-none"
                      rows={3}
                    />
                    <div className="mt-2 flex justify-end">
                      <Button size="sm" className="bg-amber-500 text-black hover:bg-amber-400">
                        Post Question
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Right Column: Collapsible Module/Lesson Syllabus Sidebar */}
        {isSidebarOpen && (
          <aside className="w-full border-t border-gray-800 bg-[#13161f] p-4 lg:w-80 lg:border-t-0 lg:border-l lg:p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-sm font-bold uppercase tracking-wider text-gray-300">
                Course Syllabus
              </h2>
              <button
                onClick={() => setIsSidebarOpen(false)}
                className="text-gray-400 hover:text-white lg:hidden"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 overflow-y-auto">
              {syllabus.modules.map((mod) => (
                <div key={mod.id} className="rounded-lg border border-gray-800 bg-[#181c26] p-3">
                  <h3 className="mb-2 text-xs font-bold text-gray-300">
                    {mod.title}
                  </h3>
                  <div className="space-y-1">
                    {mod.lessons.map((les) => {
                      const isCurrent = les.slug === currentLesson.slug;
                      const prog = progressMap[les.id];
                      const isDone = prog?.completed ?? false;

                      return (
                        <Link
                          key={les.id}
                          href={`/app/learn/${courseSlug}/${les.slug}`}
                          className={`flex items-center justify-between rounded px-2.5 py-2 text-xs transition-colors ${
                            isCurrent
                              ? 'bg-amber-500/20 text-amber-300 font-medium'
                              : 'text-gray-400 hover:bg-gray-800 hover:text-gray-200'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isDone ? (
                              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                            ) : (
                              <Circle className="h-3.5 w-3.5 text-gray-600" />
                            )}
                            <span className="line-clamp-1">{les.title}</span>
                          </div>
                          <span className="text-[10px] text-gray-500">
                            {Math.round(les.durationSeconds / 60)}m
                          </span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
