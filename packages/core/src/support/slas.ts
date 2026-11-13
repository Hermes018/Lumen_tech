/** @purpose Support SLA targets and tier badges (docs/27 §4, D10) */
import type { SupportTierSla, SupportTier } from './types';

export const SUPPORT_TIER_SLAS: Record<SupportTier, SupportTierSla> = {
  mentor: {
    tier: 'mentor',
    badgeLabel: 'Mentor 4h',
    firstResponseHours: 0.5,
    resolutionHours: 4,
    description: 'Dedicated 1-on-1 mentor support. First response within 30 min, target resolution 4h.',
  },
  live: {
    tier: 'live',
    badgeLabel: 'Live 12h',
    firstResponseHours: 1,
    resolutionHours: 12,
    description: 'Live batch priority queue. WhatsApp priority, resolution within 12h, 15m join-desk on class days.',
  },
  plus: {
    tier: 'plus',
    badgeLabel: 'Plus 24h',
    firstResponseHours: 1,
    resolutionHours: 24,
    description: 'Comprehensive plus support. Direct agent response within 1h, resolution within 24h.',
  },
  core: {
    tier: 'core',
    badgeLabel: 'Core 48h',
    firstResponseHours: 2,
    resolutionHours: 48,
    description: 'Core learner support via portal and email. Resolution within 48h.',
  },
  free: {
    tier: 'free',
    badgeLabel: 'Free 72h',
    firstResponseHours: 4,
    resolutionHours: 72,
    description: 'Community and automated guidance, email triage within 72h.',
  },
  org: {
    tier: 'org',
    badgeLabel: 'Org 24h',
    firstResponseHours: 1,
    resolutionHours: 24,
    description: 'Institutional partner support. Dedicated account manager, resolution within 24h.',
  },
};

/**
 * Returns canonical SLA badges to display on public support pages
 */
export function getPublicSlaBadges(): SupportTierSla[] {
  return [
    SUPPORT_TIER_SLAS.mentor,
    SUPPORT_TIER_SLAS.live,
    SUPPORT_TIER_SLAS.plus,
    SUPPORT_TIER_SLAS.core,
  ];
}
