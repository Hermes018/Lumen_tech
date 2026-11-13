/** @purpose Server actions for IELTS 4-Skill Mock Attempt runner, section submissions, and band report generation */
'use server';

import { z } from '@lumen/config';
import {
  requireServerActor,
  assertCan,
  aggregateIeltsBandReport,
  type IeltsTrack,
  type IeltsBandReport,
} from '@lumen/core';

export interface IeltsMockExamData {
  attemptId: string;
  track: IeltsTrack;
  strictMockMode: boolean;
  sections: {
    listening: {
      title: string;
      timeAllowedSeconds: number;
      audioUrl: string;
      audioTitle: string;
      questions: Array<{
        id: string;
        num: number;
        prompt: string;
        type: 'multiple_choice' | 'fill_blank';
        options?: string[];
      }>;
    };
    reading: {
      title: string;
      timeAllowedSeconds: number;
      passageTitle: string;
      passageText: string;
      questions: Array<{
        id: string;
        num: number;
        prompt: string;
        type: 'multiple_choice' | 'true_false_not_given';
        options?: string[];
      }>;
    };
    writing: {
      title: string;
      timeAllowedSeconds: number;
      task1: {
        title: string;
        prompt: string;
        minWords: number;
        suggestedMinutes: number;
      };
      task2: {
        title: string;
        prompt: string;
        minWords: number;
        suggestedMinutes: number;
      };
    };
    speaking: {
      title: string;
      timeAllowedSeconds: number;
      part1: {
        topic: string;
        questions: string[];
      };
      part2: {
        topic: string;
        cueCardPrompt: string;
        bulletPoints: string[];
        prepSeconds: number;
        recordSeconds: number;
      };
      part3: {
        topic: string;
        questions: string[];
      };
    };
  };
}

export async function fetchIeltsMockExamData(
  attemptId: string,
  track: IeltsTrack = 'ielts_academic'
): Promise<IeltsMockExamData> {
  const actor = await requireServerActor();
  assertCan(actor, 'exam:take', { ownerId: actor.id });

  return {
    attemptId,
    track,
    strictMockMode: true,
    sections: {
      listening: {
        title: 'Section 1 — Listening (30 minutes)',
        timeAllowedSeconds: 30 * 60,
        audioTitle: 'Campus Accommodation & Student Services Orientation',
        audioUrl: '/audio/ielts/mock-listening-01.mp3',
        questions: [
          {
            id: 'l1',
            num: 1,
            prompt: 'What type of accommodation does the student prefer?',
            type: 'multiple_choice',
            options: ['Shared flat with ensuite', 'Single studio apartment', 'Catered hall of residence', 'Homestay with local family'],
          },
          {
            id: 'l2',
            num: 2,
            prompt: 'Complete the note: The security deposit must be paid by _______',
            type: 'fill_blank',
          },
          {
            id: 'l3',
            num: 3,
            prompt: 'Which facility is available on the ground floor of Building B?',
            type: 'multiple_choice',
            options: ['Laundry room', 'Quiet study lounge', 'Gymnasium', 'Bicycle storage'],
          },
          {
            id: 'l4',
            num: 4,
            prompt: 'Complete the note: Key card replacement fee is £_______',
            type: 'fill_blank',
          },
        ],
      },
      reading: {
        title: `Section 2 — ${track === 'ielts_academic' ? 'Academic Reading' : 'General Training Reading'} (60 minutes)`,
        timeAllowedSeconds: 60 * 60,
        passageTitle: 'The Architecture of Deep Sea Coral Reefs',
        passageText: `Cold-water corals, unlike their tropical shallow-water counterparts, thrive in pitch darkness and frigid waters at depths of several hundred to thousands of meters. These fragile ecosystems are constructed primarily by stony corals such as Lophelia pertusa, which secretes calcium carbonate skeletons over centuries.\n\nRecent sonar mapping along the North Atlantic continental margin has revealed extensive reef mounds rising up to 100 meters above the seafloor. Marine biologists hypothesize that internal oceanic waves funnel suspended organic matter and plankton toward these structures, sustaining an extraordinarily rich trophic web of crustaceans, sponges, and deep-sea fish species.\n\nHowever, commercial bottom trawling and oceanic acidification pose grave existential threats. Because deep-sea corals grow at rates as sluggish as 5 to 25 millimeters per year, recovery from mechanical seabed destruction requires millennia. Global oceanographic consortia are urging strict marine protected area designations across high-seas benthic zones.`,
        questions: [
          {
            id: 'r1',
            num: 1,
            prompt: 'Cold-water corals rely on sunlight for their primary metabolic sustenance.',
            type: 'true_false_not_given',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          },
          {
            id: 'r2',
            num: 2,
            prompt: 'Lophelia pertusa builds its skeletal structure using calcium carbonate.',
            type: 'true_false_not_given',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          },
          {
            id: 'r3',
            num: 3,
            prompt: 'Internal waves assist cold-water reefs by:',
            type: 'multiple_choice',
            options: ['Directing food and nutrients toward the mounds', 'Elevating the water temperature', 'Protecting the corals from commercial trawlers', 'Accelerating coral calcification rates'],
          },
          {
            id: 'r4',
            num: 4,
            prompt: 'Deep-sea corals can fully regenerate from trawling impacts within two to three decades.',
            type: 'true_false_not_given',
            options: ['TRUE', 'FALSE', 'NOT GIVEN'],
          },
        ],
      },
      writing: {
        title: 'Section 3 — Writing (60 minutes)',
        timeAllowedSeconds: 60 * 60,
        task1: {
          title: track === 'ielts_academic' ? 'Task 1: Academic Report' : 'Task 1: Letter',
          prompt: track === 'ielts_academic'
            ? 'The graph below illustrates the energy consumption trends in Bangladesh from 2010 to 2025 across industrial, commercial, and residential sectors. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.'
            : 'You recently moved into a rental apartment and discovered several maintenance issues that were not resolved by the landlord. Write a letter to the building manager detailing the problems, their impact on your daily routine, and what action you expect.',
          minWords: 150,
          suggestedMinutes: 20,
        },
        task2: {
          title: 'Task 2: Discursive Essay',
          prompt: 'Some educators argue that higher education should focus exclusively on imparting practical skills required for immediate employment, while others believe universities should provide a broad theoretical foundation. Discuss both views and give your own opinion.',
          minWords: 250,
          suggestedMinutes: 40,
        },
      },
      speaking: {
        title: 'Section 4 — Speaking (14 minutes)',
        timeAllowedSeconds: 14 * 60,
        part1: {
          topic: 'Hometown and Daily Routine',
          questions: [
            'Let’s talk about your hometown. What is the most interesting aspect of the place where you grew up?',
            'How has your daily schedule changed compared to a few years ago?',
            'Do you prefer spending your free time outdoors or indoors? Why?',
          ],
        },
        part2: {
          topic: 'Describe a challenging project or goal you successfully accomplished',
          cueCardPrompt: 'You should say:\n• What the project or goal was\n• Why it was challenging\n• What steps you took to overcome difficulties\n• And explain how you felt when you achieved it.',
          bulletPoints: [
            'What the project or goal was',
            'Why it was challenging',
            'What steps you took to overcome difficulties',
            'Explain how you felt after completing it',
          ],
          prepSeconds: 60,
          recordSeconds: 120,
        },
        part3: {
          topic: 'Long-term Goals and Motivation in Modern Society',
          questions: [
            'Why do some individuals struggle to maintain momentum when pursuing long-term targets?',
            'To what extent should societal recognition influence personal career ambitions?',
            'How can educational institutions better equip students to handle professional setbacks?',
          ],
        },
      },
    },
  };
}

const completeIeltsMockSchema = z.object({
  attemptId: z.string().min(1),
  track: z.enum(['ielts_academic', 'ielts_gt']),
  listeningAnswers: z.record(z.string(), z.string()).default({}),
  readingAnswers: z.record(z.string(), z.string()).default({}),
  writingAnswers: z.object({
    task1: z.string().default(''),
    task2: z.string().default(''),
  }),
  speakingData: z.object({
    part2Notes: z.string().default(''),
    part2Transcript: z.string().default(''),
  }).default({
    part2Notes: '',
    part2Transcript: '',
  }),
});

export async function completeIeltsMockAction(
  rawInput: z.infer<typeof completeIeltsMockSchema>
): Promise<IeltsBandReport> {
  const input = completeIeltsMockSchema.parse(rawInput);
  const actor = await requireServerActor();
  assertCan(actor, 'exam:take', { ownerId: actor.id });

  // Calculate Listening raw score
  // Model answer key simulation:
  const listeningKey: Record<string, string> = {
    l1: 'Single studio apartment',
    l2: '15 September',
    l3: 'Laundry room',
    l4: '25',
  };
  let listeningRaw = 28; // base baseline
  for (const [k, v] of Object.entries(input.listeningAnswers)) {
    if (listeningKey[k] && v.toLowerCase().includes(listeningKey[k]!.toLowerCase().slice(0, 4))) {
      listeningRaw = Math.min(40, listeningRaw + 3);
    }
  }

  // Calculate Reading raw score
  const readingKey: Record<string, string> = {
    r1: 'FALSE',
    r2: 'TRUE',
    r3: 'Directing food and nutrients toward the mounds',
    r4: 'FALSE',
  };
  let readingRaw = 29;
  for (const [k, v] of Object.entries(input.readingAnswers)) {
    if (readingKey[k] && v.toUpperCase() === readingKey[k]!.toUpperCase()) {
      readingRaw = Math.min(40, readingRaw + 3);
    }
  }

  // Assess Writing word count & estimated bands
  const t1Words = input.writingAnswers.task1.trim().split(/\s+/).filter(Boolean).length;
  const t2Words = input.writingAnswers.task2.trim().split(/\s+/).filter(Boolean).length;

  let task1Band = 6.5;
  if (t1Words >= 150) task1Band = 7.0;
  if (t1Words < 100) task1Band = 5.5;

  let task2Band = 7.0;
  if (t2Words >= 250) task2Band = 7.5;
  if (t2Words < 180) task2Band = 5.5;

  // Assess Speaking estimated criteria
  const speakingWords = input.speakingData.part2Transcript.trim().split(/\s+/).filter(Boolean).length;
  const fluency = speakingWords >= 180 ? 7.5 : speakingWords >= 100 ? 7.0 : 6.0;

  const report = aggregateIeltsBandReport({
    attemptId: input.attemptId,
    track: input.track,
    listeningRaw,
    readingRaw,
    writing: {
      task1Band,
      task2Band,
      task1Words: t1Words,
      task2Words: t2Words,
    },
    speaking: {
      criteria: {
        fluencyAndCoherence: fluency,
        lexicalResource: 7.0,
        grammaticalRangeAndAccuracy: 7.0,
        pronunciation: 7.5,
      },
    },
  });

  return report;
}
