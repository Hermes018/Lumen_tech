/** @purpose Authentic 4-Part CD-IELTS Listening scripts, timestamps, distractor trap metadata, and deterministic 44.1kHz PCM WAV synthesis */

export type IeltsAccent = 'en-GB' | 'en-AU' | 'en-US';

export interface IeltsListeningSegment {
  id: string;
  speaker: string;
  accent: IeltsAccent;
  startSec: number;
  endSec: number;
  text: string;
  linkedQuestionId?: string;
  distractorTrapNote?: string;
}

export interface IeltsListeningPart {
  partNumber: 1 | 2 | 3 | 4;
  id: string;
  titleEn: string;
  titleBn: string;
  accentLabel: string;
  contextEn: string;
  contextBn: string;
  durationSec: number;
  seedFrequency: number;
  segments: IeltsListeningSegment[];
}

export const IELTS_LISTENING_SCRIPTS: IeltsListeningPart[] = [
  {
    partNumber: 1,
    id: 'part-1-accommodation',
    titleEn: 'Part 1: University Hall Accommodation Booking',
    titleBn: 'পার্ট ১: বিশ্ববিদ্যালয় আবাসন বুকিং কথোপকথন',
    accentLabel: 'en-GB (British RP)',
    contextEn:
      'A social transactional dialogue between a University Accommodation Officer and an incoming international postgraduate applicant.',
    contextBn:
      'বিশ্ববিদ্যালয় আবাসন কর্মকর্তা এবং একজন আন্তর্জাতিক স্নাতকোত্তর শিক্ষার্থীর মধ্যে কথোপকথন।',
    durationSec: 44,
    seedFrequency: 261.63,
    segments: [
      {
        id: 'p1-s1',
        speaker: 'Officer',
        accent: 'en-GB',
        startSec: 0,
        endSec: 9,
        text: 'Good morning, University Accommodation Office. I can help you finalise your postgraduate hall reservation for the autumn term.',
      },
      {
        id: 'p1-s2',
        speaker: 'Applicant',
        accent: 'en-GB',
        startSec: 9,
        endSec: 19,
        text: 'Thank you. Could you confirm the refundable key deposit? I saw £314 listed on last year’s PDF brochure.',
        linkedQuestionId: 'Q1',
        distractorTrapNote:
          'Distractor Trap: £314 is the outdated figure from last year’s brochure—wait for the officer’s self-correction before writing your answer.',
      },
      {
        id: 'p1-s3',
        speaker: 'Officer',
        accent: 'en-GB',
        startSec: 19,
        endSec: 31,
        text: 'Good catch—that £314 fee was revised in June. The current refundable deposit is £340, and the hall postcode for your visa letter is SW7 2AZ.',
        linkedQuestionId: 'Q1–Q2',
        distractorTrapNote:
          'Self-Correction Verified: £340 replaces £314. Also note phonetic clarity on "SW7 2AZ" (watch "7" vs "2" sequence).',
      },
      {
        id: 'p1-s4',
        speaker: 'Officer',
        accent: 'en-GB',
        startSec: 31,
        endSec: 44,
        text: 'Your catered meal plan activates on Monday, 18 September, though early arrivals can collect kitchen access fobs from 14 September.',
        linkedQuestionId: 'Q3',
        distractorTrapNote:
          'Date Distractor: 14 September is only for kitchen fob collection; the meal plan itself starts on 18 September.',
      },
    ],
  },
  {
    partNumber: 2,
    id: 'part-2-conservatory',
    titleEn: 'Part 2: Royal Botanical Conservatory Orientation',
    titleBn: 'পার্ট ২: রয়্যাল বোটানিক্যাল কনজারভেটরি পরিচিতি',
    accentLabel: 'en-AU (Australian)',
    contextEn:
      'A public orientation monologue by the Conservatory Curator covering campus map routes, gate renovations, and admission tiers.',
    contextBn:
      'কনজারভেটরি কিউরেটরের দিকনির্দেশনামূলক মনোলগ: ক্যাম্পাস ম্যাপ, গেট সংস্কার এবং টিকিট স্তর।',
    durationSec: 42,
    seedFrequency: 293.66,
    segments: [
      {
        id: 'p2-s1',
        speaker: 'Curator',
        accent: 'en-AU',
        startSec: 0,
        endSec: 11,
        text: 'Welcome everyone to the Royal Botanical Conservatory. Before you head out with your campus maps, please note a few temporary route changes.',
      },
      {
        id: 'p2-s2',
        speaker: 'Curator',
        accent: 'en-AU',
        startSec: 11,
        endSec: 23,
        text: 'The South Gate was scheduled for masonry repairs this week, actually that work has been pushed to November, so it is the East Gate that is closed today.',
        linkedQuestionId: 'Q11',
        distractorTrapNote:
          'Map Distractor: South Gate is mentioned first as "scheduled", then deferred to November. The East Gate is the one actually closed.',
      },
      {
        id: 'p2-s3',
        speaker: 'Curator',
        accent: 'en-AU',
        startSec: 23,
        endSec: 33,
        text: 'To reach the Alpine Glasshouse, walk past the Lily Pond and take the left fork immediately before the Stone Sundial.',
        linkedQuestionId: 'Q12',
      },
      {
        id: 'p2-s4',
        speaker: 'Curator',
        accent: 'en-AU',
        startSec: 33,
        endSec: 42,
        text: 'Standard entry is 18 dollars, while student concession passes—including audio guides—are 12 dollars at the Visitor Desk.',
        linkedQuestionId: 'Q13',
        distractorTrapNote:
          'Tier Comparison: 18 dollars is standard adult entry; 12 dollars is the student concession tier.',
      },
    ],
  },
  {
    partNumber: 3,
    id: 'part-3-microgrid',
    titleEn: 'Part 3: Renewable Micro-Grid Field Data Seminar',
    titleBn: 'পার্ট ৩: নবায়নযোগ্য মাইক্রো-গ্রিড গবেষণা সেমিনার',
    accentLabel: 'en-GB / en-US (Seminar)',
    contextEn:
      'Professor Dr. Sterling and two graduate researchers reviewing field-study sample limitations and methodology revisions.',
    contextBn:
      'প্রফেসর ড. স্টার্লিং ও দুই গবেষকের মধ্যে মাইক্রো-গ্রিড ডেটা ও স্যাম্পল সাইজ সংশোধন নিয়ে আলোচনা।',
    durationSec: 46,
    seedFrequency: 329.63,
    segments: [
      {
        id: 'p3-s1',
        speaker: 'Dr. Sterling',
        accent: 'en-GB',
        startSec: 0,
        endSec: 12,
        text: 'Let us examine your coastal micro-grid dataset. Your initial solar battery efficiency curve looks promising, though the sample size is relatively small.',
      },
      {
        id: 'p3-s2',
        speaker: 'Maya (Researcher)',
        accent: 'en-US',
        startSec: 12,
        endSec: 24,
        text: 'Originally we planned to instrument 40 households, but monsoon humidity damaged eight inverters, leaving 32 verified nodes in the final log.',
        linkedQuestionId: 'Q21',
        distractorTrapNote:
          'Quantitative Trap: 40 was the planned count and 8 were damaged; 32 is the actual verified sample size.',
      },
      {
        id: 'p3-s3',
        speaker: 'Liam (Researcher)',
        accent: 'en-GB',
        startSec: 24,
        endSec: 35,
        text: 'I thought we should extend the survey by another month, yet Dr. Sterling pointed out that calibrating the voltage sensors matters far more.',
        linkedQuestionId: 'Q22',
        distractorTrapNote:
          'Agreement/Disagreement Cue: Extending the survey is rejected in favour of sensor calibration.',
      },
      {
        id: 'p3-s4',
        speaker: 'Dr. Sterling',
        accent: 'en-GB',
        startSec: 35,
        endSec: 46,
        text: 'Exactly. Revise the methodology section to explain the sensor calibration protocol before Friday’s departmental review.',
        linkedQuestionId: 'Q23',
      },
    ],
  },
  {
    partNumber: 4,
    id: 'part-4-hydrology',
    titleEn: 'Part 4: Subterranean Hydrology & Ancient Reservoirs',
    titleBn: 'পার্ট ৪: ভূগর্ভস্থ জলবিজ্ঞান ও প্রাচীন জলাধার লেকচার',
    accentLabel: 'en-GB (Academic Lecture)',
    contextEn:
      'An uninterrupted university lecture examining qanat gravity channels, evaporation mitigation, and arid-zone aquifer recharge.',
    contextBn:
      'শুষ্ক অঞ্চলে ভূগর্ভস্থ খাল, বাষ্পীভবন হ্রাস এবং অ্যাকুইফার রিচার্জ বিষয়ক বিশ্ববিদ্যালয় লেকচার।',
    durationSec: 48,
    seedFrequency: 220.0,
    segments: [
      {
        id: 'p4-s1',
        speaker: 'Lecturer',
        accent: 'en-GB',
        startSec: 0,
        endSec: 12,
        text: 'Today we turn to subterranean hydrology—specifically how arid-zone civilisations engineered gravity-fed underground aqueducts known as qanats.',
      },
      {
        id: 'p4-s2',
        speaker: 'Lecturer',
        accent: 'en-GB',
        startSec: 12,
        endSec: 24,
        text: 'Unlike surface canals, which lose up to 45 percent of their volume to solar evaporation, covered subterranean channels keep water cool and protected.',
        linkedQuestionId: 'Q31',
        distractorTrapNote:
          'Contrastive Cue: 45 percent loss applies to surface canals, not subterranean qanats.',
      },
      {
        id: 'p4-s3',
        speaker: 'Lecturer',
        accent: 'en-GB',
        startSec: 24,
        endSec: 36,
        text: 'Vertical maintenance shafts—spaced roughly every 30 metres—also functioned as passive ventilation chimneys and sediment traps.',
        linkedQuestionId: 'Q32',
      },
      {
        id: 'p4-s4',
        speaker: 'Lecturer',
        accent: 'en-GB',
        startSec: 36,
        endSec: 48,
        text: 'Modern urban hydrologists now study these stepped reservoirs to design permeable bioswales that recharge depleted municipal aquifers.',
        linkedQuestionId: 'Q33',
      },
    ],
  },
];

/**
 * Generates a deterministic 44.1kHz mono 16-bit PCM WAV data URI (`data:audio/wav;base64,...`)
 * so `<audio src={...}>` always has a valid, playable audio stream across all browsers and tests.
 */
export function buildDeterministicWavDataUri(
  durationSeconds: number,
  seedFrequency = 261.63,
): string {
  const sampleRate = 44100;
  const clampedDuration = Math.max(0.25, Math.min(durationSeconds, 60));
  const numSamples = Math.floor(sampleRate * clampedDuration);
  const dataByteLength = numSamples * 2;
  const buffer = new Uint8Array(44 + dataByteLength);
  const view = new DataView(buffer.buffer);

  const writeAscii = (offset: number, text: string) => {
    for (let i = 0; i < text.length; i += 1) {
      view.setUint8(offset + i, text.charCodeAt(i));
    }
  };

  // RIFF header
  writeAscii(0, 'RIFF');
  view.setUint32(4, 36 + dataByteLength, true);
  writeAscii(8, 'WAVE');

  // fmt chunk
  writeAscii(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // AudioFormat = 1 (PCM)
  view.setUint16(22, 1, true); // NumChannels = 1 (Mono)
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true); // ByteRate = SampleRate * NumChannels * BitsPerSample/8
  view.setUint16(32, 2, true); // BlockAlign
  view.setUint16(34, 16, true); // BitsPerSample

  // data chunk
  writeAscii(36, 'data');
  view.setUint32(40, dataByteLength, true);

  // Subtle low-amplitude harmonic chime at segment boundaries + soft room tone
  for (let i = 0; i < numSamples; i += 1) {
    const t = i / sampleRate;
    const chimePhase = t % 10;
    const envelope = chimePhase < 0.35 ? Math.exp(-chimePhase * 8) * 0.08 : 0.004;
    const sample =
      Math.sin(2 * Math.PI * seedFrequency * t) * envelope +
      Math.sin(2 * Math.PI * (seedFrequency * 1.5) * t) * (envelope * 0.4);
    const int16 = Math.max(-32768, Math.min(32767, Math.round(sample * 32767)));
    view.setInt16(44 + i * 2, int16, true);
  }

  // Encode to base64 cleanly in both Node and browser environments
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < buffer.length; i += chunkSize) {
    const slice = buffer.subarray(i, i + chunkSize);
    binary += String.fromCharCode(...slice);
  }

  const base64 =
    typeof btoa === 'function'
      ? btoa(binary)
      : Buffer.from(buffer).toString('base64');

  return `data:audio/wav;base64,${base64}`;
}
