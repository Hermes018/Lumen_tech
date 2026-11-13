/** @purpose Distraction-calm course player page with dynamic anti-piracy watermark overlay and syllabus tree navigation */

import React from 'react';
import {
  resolveSyllabusTree,
  createSignedVideoEmbed,
  SAMPLE_GRE_QUANT_SYLLABUS,
} from '@lumen/core';
import { CoursePlayerClient } from './CoursePlayerClient';

export default async function CourseLessonPage({
  params,
}: {
  params: Promise<{ locale: string; course: string; lesson: string }>;
}) {
  const { course, lesson } = await params;

  // Resolve syllabus tree for the requested course
  const syllabus = resolveSyllabusTree(course, SAMPLE_GRE_QUANT_SYLLABUS);

  // Authenticated learner context (or fallback demo learner profile)
  const user = {
    id: 'usr_learner_prod_01',
    name: 'Ayman Rahman',
    email: 'aymanrahman30@gmail.com',
    phone: '+8801712345678',
  };

  // Generate signed Bunny Stream playback descriptor and anti-piracy watermark payload (docs/00 D3)
  const videoId = `bny_vid_${course}_${lesson}`;
  const signedEmbed = createSignedVideoEmbed(
    user.id,
    user.email,
    user.phone,
    videoId
  );

  return (
    <CoursePlayerClient
      courseSlug={course}
      lessonSlug={lesson}
      syllabus={syllabus}
      signedEmbed={signedEmbed}
      user={user}
    />
  );
}
