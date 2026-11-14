/** @purpose Distraction-calm course player page with server-side auth, entitlement check, dynamic anti-piracy watermark overlay, and syllabus tree navigation */

import React from 'react';
import { notFound } from 'next/navigation';
import {
  requireServerActor,
  assertCan,
  getUserEntitlements,
  resolveSyllabusTree,
  findLessonInSyllabus,
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

  const actor = await requireServerActor();
  assertCan(actor, 'course:view');

  // Resolve syllabus tree and verify lesson existence
  const syllabus = resolveSyllabusTree(course, SAMPLE_GRE_QUANT_SYLLABUS);
  const found = findLessonInSyllabus(syllabus, lesson);
  if (!found) {
    notFound();
  }

  // Verify free preview or active course entitlement before signing Bunny embed
  const isFreePreview = found.lesson.isFreePreview === true;
  const entitled = getUserEntitlements(actor.id).some(
    (e) =>
      e.isActive &&
      (e.productSlug === course ||
        e.productSlug === 'lumen-annual-pass' ||
        (Array.isArray(e.allowancesJson.courseSlugs) &&
          e.allowancesJson.courseSlugs.includes(course)))
  );

  if (!isFreePreview && !entitled) {
    notFound();
  }

  // Generate signed Bunny Stream playback descriptor and anti-piracy watermark payload
  const videoId = found.lesson.videoId ?? `bny_vid_${course}_${lesson}`;
  const signedEmbed = createSignedVideoEmbed(
    actor.id,
    actor.email ?? '',
    '',
    videoId
  );

  return (
    <CoursePlayerClient
      courseSlug={course}
      lessonSlug={lesson}
      syllabus={syllabus}
      signedEmbed={signedEmbed}
      user={{ id: actor.id, name: actor.name ?? 'Learner' }}
    />
  );
}
