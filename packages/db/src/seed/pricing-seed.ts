/**
 * @purpose Canonical Pricing Seed parsed deterministically from docs/17-PRICING-MASTER.md §13.
 * All prices in integer amount_minor (BD in poisha, A/B/C in USD cents).
 */

export interface SeedPrices {
  BD?: number;
  A?: number;
  B?: number;
  C?: number;
}

export interface SeedProduct {
  slug: string;
  kind: string;
  name: string;
  tier?: string;
  exam?: string;
  phase: string;
  duration_days?: number;
  prices: SeedPrices;
  allowances?: Record<string, unknown>;
  d5_extension?: boolean;
}

export const CANONICAL_PRODUCTS: SeedProduct[] = [
  {
    "slug": "ielts-academic-core",
    "kind": "course",
    "name": "IELTS Academic Core",
    "tier": "core",
    "exam": "ielts_academic",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 399000,
      "A": 8900,
      "B": 4900,
      "C": 3400
    },
    "allowances": {
      "ai_credits": 10,
      "full_mocks": 4,
      "ai_daily_cap": 3,
      "ai_tutor_msgs_per_day": 30,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "study_plan": "static",
      "certificate": true,
      "money_back_days": 7
    }
  },
  {
    "slug": "ielts-academic-plus",
    "kind": "course",
    "name": "IELTS Academic Plus",
    "tier": "plus",
    "exam": "ielts_academic",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 649000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "ai_credits": 40,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "weekly_live_qa": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_days": 7,
      "target_promise": true
    }
  },
  {
    "slug": "ielts-academic-live",
    "kind": "bundle",
    "name": "IELTS Academic Live",
    "tier": "live",
    "exam": "ielts_academic",
    "phase": "P1 pilot / P2 scale",
    "duration_days": 365,
    "prices": {
      "BD": 1399000,
      "A": 29900,
      "B": 17900,
      "C": 11900
    },
    "allowances": {
      "ai_credits": 40,
      "full_mocks": 10,
      "human_essay_reviews": 4,
      "human_speaking_mocks": 2,
      "live_classes": 36,
      "speaking_club": 6,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "ielts-academic-crash",
    "kind": "bundle",
    "name": "IELTS Academic Live Crash",
    "tier": "crash",
    "exam": "ielts_academic",
    "phase": "P1 pilot / P2 scale",
    "duration_days": 365,
    "prices": {
      "BD": 999000,
      "A": 22900,
      "B": 12900,
      "C": 8900
    },
    "allowances": {
      "ai_credits": 40,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "human_speaking_mocks": 1,
      "live_classes": 16,
      "speaking_club": 3,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "ielts-academic-mentor",
    "kind": "bundle",
    "name": "IELTS Academic Mentor",
    "tier": "mentor",
    "exam": "ielts_academic",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 1999000,
      "A": 39900,
      "B": 24900,
      "C": 16900
    },
    "allowances": {
      "ai_credits": 40,
      "full_mocks": 10,
      "human_essay_reviews": 6,
      "human_speaking_mocks": 3,
      "live_classes": 36,
      "speaking_club": 6,
      "one_to_one_45min": 3,
      "progress_promise": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "ielts-gt-core",
    "kind": "course",
    "name": "IELTS General Training Core",
    "tier": "core",
    "exam": "ielts_gt",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 349000,
      "A": 7900,
      "B": 4900,
      "C": 2999
    },
    "allowances": {
      "ai_credits": 10,
      "full_mocks": 4,
      "ai_daily_cap": 3,
      "ai_tutor_msgs_per_day": 30,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "study_plan": "static",
      "certificate": true,
      "money_back_days": 7
    }
  },
  {
    "slug": "ielts-gt-plus",
    "kind": "course",
    "name": "IELTS General Training Plus",
    "tier": "plus",
    "exam": "ielts_gt",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 649000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "ai_credits": 40,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "weekly_live_qa": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_days": 7,
      "target_promise": true
    }
  },
  {
    "slug": "ielts-gt-live",
    "kind": "bundle",
    "name": "IELTS General Training Live",
    "tier": "live",
    "exam": "ielts_gt",
    "phase": "P1 pilot / P2 scale",
    "duration_days": 365,
    "prices": {
      "BD": 1299000,
      "A": 29900,
      "B": 17900,
      "C": 11900
    },
    "allowances": {
      "ai_credits": 40,
      "full_mocks": 10,
      "human_essay_reviews": 4,
      "human_speaking_mocks": 2,
      "live_classes": 36,
      "speaking_club": 6,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "ielts-gt-crash",
    "kind": "bundle",
    "name": "IELTS General Training Live Crash",
    "tier": "crash",
    "exam": "ielts_gt",
    "phase": "P1 pilot / P2 scale",
    "duration_days": 365,
    "prices": {
      "BD": 949000,
      "A": 22900,
      "B": 12900,
      "C": 8900
    },
    "allowances": {
      "ai_credits": 40,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "human_speaking_mocks": 1,
      "live_classes": 16,
      "speaking_club": 3,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "ielts-gt-mentor",
    "kind": "bundle",
    "name": "IELTS General Training Mentor",
    "tier": "mentor",
    "exam": "ielts_gt",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 1899000,
      "A": 39900,
      "B": 24900,
      "C": 16900
    },
    "allowances": {
      "ai_credits": 40,
      "full_mocks": 10,
      "human_essay_reviews": 6,
      "human_speaking_mocks": 3,
      "live_classes": 36,
      "speaking_club": 6,
      "one_to_one_45min": 3,
      "progress_promise": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "gre-core",
    "kind": "course",
    "name": "GRE Core",
    "tier": "core",
    "exam": "gre",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 599000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "ai_credits": 6,
      "full_mocks": 4,
      "ai_daily_cap": 3,
      "ai_tutor_msgs_per_day": 30,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "study_plan": "static",
      "certificate": true,
      "money_back_days": 7
    }
  },
  {
    "slug": "gre-plus",
    "kind": "course",
    "name": "GRE Plus",
    "tier": "plus",
    "exam": "gre",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 849000,
      "A": 19900,
      "B": 11900,
      "C": 7900
    },
    "allowances": {
      "ai_credits": 20,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "weekly_live_qa": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_days": 7,
      "target_promise": true
    }
  },
  {
    "slug": "gre-live",
    "kind": "bundle",
    "name": "GRE Live",
    "tier": "live",
    "exam": "gre",
    "phase": "P1 pilot / P2 scale",
    "duration_days": 365,
    "prices": {
      "BD": 1299000,
      "A": 29900,
      "B": 17900,
      "C": 11900
    },
    "allowances": {
      "ai_credits": 20,
      "full_mocks": 10,
      "human_essay_reviews": 4,
      "human_speaking_mocks": 0,
      "live_classes": 24,
      "ai_daily_cap": 6,
      "problem_clinic": 0,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "gre-crash",
    "kind": "bundle",
    "name": "GRE Live Crash",
    "tier": "crash",
    "exam": "gre",
    "phase": "P1 pilot / P2 scale",
    "duration_days": 365,
    "prices": {
      "BD": 999000,
      "A": 22900,
      "B": 12900,
      "C": 8900
    },
    "allowances": {
      "ai_credits": 20,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "human_speaking_mocks": 0,
      "live_classes": 12,
      "ai_daily_cap": 6,
      "problem_clinic": 0,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "gre-mentor",
    "kind": "bundle",
    "name": "GRE Mentor",
    "tier": "mentor",
    "exam": "gre",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 1999000,
      "A": 39900,
      "B": 24900,
      "C": 16900
    },
    "allowances": {
      "ai_credits": 20,
      "full_mocks": 10,
      "human_essay_reviews": 6,
      "human_speaking_mocks": 0,
      "live_classes": 24,
      "one_to_one_45min": 3,
      "progress_promise": true,
      "ai_daily_cap": 6,
      "problem_clinic": 0,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "pte-core",
    "kind": "course",
    "name": "PTE Academic Core",
    "tier": "core",
    "exam": "pte",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 399000,
      "A": 8900,
      "B": 4900,
      "C": 3400
    },
    "allowances": {
      "ai_credits": 10,
      "full_mocks": 4,
      "ai_daily_cap": 3,
      "ai_tutor_msgs_per_day": 30,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "study_plan": "static",
      "certificate": true,
      "money_back_days": 7
    }
  },
  {
    "slug": "pte-plus",
    "kind": "course",
    "name": "PTE Academic Plus",
    "tier": "plus",
    "exam": "pte",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 649000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "ai_credits": 34,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "weekly_live_qa": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_days": 7,
      "target_promise": true
    }
  },
  {
    "slug": "pte-live",
    "kind": "bundle",
    "name": "PTE Academic Live",
    "tier": "live",
    "exam": "pte",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 1399000,
      "A": 29900,
      "B": 17900,
      "C": 11900
    },
    "allowances": {
      "ai_credits": 34,
      "full_mocks": 10,
      "human_essay_reviews": 4,
      "human_speaking_mocks": 2,
      "live_classes": 36,
      "speaking_club": 6,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "pte-crash",
    "kind": "bundle",
    "name": "PTE Academic Live Crash",
    "tier": "crash",
    "exam": "pte",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 999000,
      "A": 22900,
      "B": 12900,
      "C": 8900
    },
    "allowances": {
      "ai_credits": 34,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "human_speaking_mocks": 1,
      "live_classes": 16,
      "speaking_club": 3,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "pte-mentor",
    "kind": "bundle",
    "name": "PTE Academic Mentor",
    "tier": "mentor",
    "exam": "pte",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 1999000,
      "A": 39900,
      "B": 24900,
      "C": 16900
    },
    "allowances": {
      "ai_credits": 34,
      "full_mocks": 10,
      "human_essay_reviews": 6,
      "human_speaking_mocks": 3,
      "live_classes": 36,
      "speaking_club": 6,
      "one_to_one_45min": 3,
      "progress_promise": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "toefl-core",
    "kind": "course",
    "name": "TOEFL iBT Core",
    "tier": "core",
    "exam": "toefl",
    "phase": "P3",
    "duration_days": 183,
    "prices": {
      "BD": 399000,
      "A": 8900,
      "B": 4900,
      "C": 3400
    },
    "allowances": {
      "ai_credits": 10,
      "full_mocks": 4,
      "ai_daily_cap": 3,
      "ai_tutor_msgs_per_day": 30,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "study_plan": "static",
      "certificate": true,
      "money_back_days": 7
    }
  },
  {
    "slug": "toefl-plus",
    "kind": "course",
    "name": "TOEFL iBT Plus",
    "tier": "plus",
    "exam": "toefl",
    "phase": "P3",
    "duration_days": 183,
    "prices": {
      "BD": 649000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "ai_credits": 34,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "weekly_live_qa": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_days": 7,
      "target_promise": true
    }
  },
  {
    "slug": "toefl-live",
    "kind": "bundle",
    "name": "TOEFL iBT Live",
    "tier": "live",
    "exam": "toefl",
    "phase": "P3",
    "duration_days": 365,
    "prices": {
      "BD": 1399000,
      "A": 29900,
      "B": 17900,
      "C": 11900
    },
    "allowances": {
      "ai_credits": 34,
      "full_mocks": 10,
      "human_essay_reviews": 4,
      "human_speaking_mocks": 2,
      "live_classes": 36,
      "speaking_club": 6,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "toefl-crash",
    "kind": "bundle",
    "name": "TOEFL iBT Live Crash",
    "tier": "crash",
    "exam": "toefl",
    "phase": "P3",
    "duration_days": 365,
    "prices": {
      "BD": 999000,
      "A": 22900,
      "B": 12900,
      "C": 8900
    },
    "allowances": {
      "ai_credits": 34,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "human_speaking_mocks": 1,
      "live_classes": 16,
      "speaking_club": 3,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "toefl-mentor",
    "kind": "bundle",
    "name": "TOEFL iBT Mentor",
    "tier": "mentor",
    "exam": "toefl",
    "phase": "P3",
    "duration_days": 365,
    "prices": {
      "BD": 1999000,
      "A": 39900,
      "B": 24900,
      "C": 16900
    },
    "allowances": {
      "ai_credits": 34,
      "full_mocks": 10,
      "human_essay_reviews": 6,
      "human_speaking_mocks": 3,
      "live_classes": 36,
      "speaking_club": 6,
      "one_to_one_45min": 3,
      "progress_promise": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "det-core",
    "kind": "course",
    "name": "Duolingo English Test Core",
    "tier": "core",
    "exam": "det",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "ai_credits": 8,
      "full_mocks": 4,
      "ai_daily_cap": 3,
      "ai_tutor_msgs_per_day": 30,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "study_plan": "static",
      "certificate": true,
      "money_back_days": 7
    }
  },
  {
    "slug": "det-plus",
    "kind": "course",
    "name": "Duolingo English Test Plus",
    "tier": "plus",
    "exam": "det",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 529000,
      "A": 11900,
      "B": 6900,
      "C": 4900
    },
    "allowances": {
      "ai_credits": 24,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "weekly_live_qa": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_days": 7,
      "target_promise": true
    }
  },
  {
    "slug": "det-live",
    "kind": "bundle",
    "name": "Duolingo English Test Live",
    "tier": "live",
    "exam": "det",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 999000,
      "A": 22900,
      "B": 12900,
      "C": 8900
    },
    "allowances": {
      "ai_credits": 24,
      "full_mocks": 10,
      "human_essay_reviews": 4,
      "human_speaking_mocks": 2,
      "live_classes": 12,
      "speaking_club": 6,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "det-crash",
    "kind": "bundle",
    "name": "Duolingo English Test Live Crash",
    "tier": "crash",
    "exam": "det",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 699000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "ai_credits": 24,
      "full_mocks": 10,
      "human_essay_reviews": 2,
      "human_speaking_mocks": 1,
      "live_classes": 8,
      "speaking_club": 3,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "det-mentor",
    "kind": "bundle",
    "name": "Duolingo English Test Mentor",
    "tier": "mentor",
    "exam": "det",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 1699000,
      "A": 34900,
      "B": 22900,
      "C": 14900
    },
    "allowances": {
      "ai_credits": 24,
      "full_mocks": 10,
      "human_essay_reviews": 6,
      "human_speaking_mocks": 3,
      "live_classes": 12,
      "speaking_club": 6,
      "one_to_one_45min": 3,
      "progress_promise": true,
      "ai_daily_cap": 6,
      "ai_tutor_msgs_per_day": 150,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "score_predictor": true,
      "audio_overviews": true,
      "mind_maps_study_guides": true,
      "study_plan": "adaptive",
      "full_mocks_at_launch": 5,
      "full_mocks_target_date": "2027-08-15",
      "certificate": true,
      "money_back_rule": "before_class_3"
    }
  },
  {
    "slug": "ielts-academic-free",
    "kind": "course",
    "name": "IELTS Academic Free",
    "tier": "free",
    "exam": "ielts_academic",
    "phase": "P1",
    "prices": {
      "BD": 0,
      "A": 0,
      "B": 0,
      "C": 0
    },
    "allowances": {
      "ai_credits_signup": 2,
      "ai_credits_monthly": 1,
      "mocks_sectional": 1,
      "ai_daily_cap": 1,
      "ai_tutor_msgs_per_day": 10,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "plus_trial_days": 7,
      "plus_trial_ai_credits": 5,
      "community": "official_fb_group_discord"
    }
  },
  {
    "slug": "ielts-gt-free",
    "kind": "course",
    "name": "IELTS General Training Free",
    "tier": "free",
    "exam": "ielts_gt",
    "phase": "P1",
    "prices": {
      "BD": 0,
      "A": 0,
      "B": 0,
      "C": 0
    },
    "allowances": {
      "ai_credits_signup": 2,
      "ai_credits_monthly": 1,
      "mocks_sectional": 1,
      "ai_daily_cap": 1,
      "ai_tutor_msgs_per_day": 10,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "plus_trial_days": 7,
      "plus_trial_ai_credits": 5,
      "community": "official_fb_group_discord"
    }
  },
  {
    "slug": "gre-free",
    "kind": "course",
    "name": "GRE Free",
    "tier": "free",
    "exam": "gre",
    "phase": "P1",
    "prices": {
      "BD": 0,
      "A": 0,
      "B": 0,
      "C": 0
    },
    "allowances": {
      "ai_credits_signup": 2,
      "ai_credits_monthly": 1,
      "mocks_sectional": 1,
      "ai_daily_cap": 1,
      "ai_tutor_msgs_per_day": 10,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "plus_trial_days": 7,
      "plus_trial_ai_credits": 5,
      "community": "official_fb_group_discord"
    }
  },
  {
    "slug": "pte-free",
    "kind": "course",
    "name": "PTE Academic Free",
    "tier": "free",
    "exam": "pte",
    "phase": "P2",
    "prices": {
      "BD": 0,
      "A": 0,
      "B": 0,
      "C": 0
    },
    "allowances": {
      "ai_credits_signup": 2,
      "ai_credits_monthly": 1,
      "mocks_sectional": 1,
      "ai_daily_cap": 1,
      "ai_tutor_msgs_per_day": 10,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "plus_trial_days": 7,
      "plus_trial_ai_credits": 5,
      "community": "official_fb_group_discord"
    }
  },
  {
    "slug": "det-free",
    "kind": "course",
    "name": "Duolingo English Test Free",
    "tier": "free",
    "exam": "det",
    "phase": "P2",
    "prices": {
      "BD": 0,
      "A": 0,
      "B": 0,
      "C": 0
    },
    "allowances": {
      "ai_credits_signup": 2,
      "ai_credits_monthly": 1,
      "mocks_sectional": 1,
      "ai_daily_cap": 1,
      "ai_tutor_msgs_per_day": 10,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "plus_trial_days": 7,
      "plus_trial_ai_credits": 5,
      "community": "official_fb_group_discord"
    }
  },
  {
    "slug": "toefl-free",
    "kind": "course",
    "name": "TOEFL iBT Free",
    "tier": "free",
    "exam": "toefl",
    "phase": "P3",
    "prices": {
      "BD": 0,
      "A": 0,
      "B": 0,
      "C": 0
    },
    "allowances": {
      "ai_credits_signup": 2,
      "ai_credits_monthly": 1,
      "mocks_sectional": 1,
      "ai_daily_cap": 1,
      "ai_tutor_msgs_per_day": 10,
      "smart_flashcards_srs": true,
      "mobile_pwa": true,
      "plus_trial_days": 7,
      "plus_trial_ai_credits": 5,
      "community": "official_fb_group_discord"
    }
  },
  {
    "slug": "pass-1m",
    "kind": "pass",
    "name": "All-access Pass 1 month",
    "phase": "P1",
    "duration_days": 30,
    "prices": {
      "BD": 119000,
      "A": 2499,
      "B": 1499,
      "C": 999
    },
    "allowances": {
      "ai_credits_per_30d": 10,
      "full_mocks_per_30d": 2,
      "ai_daily_cap": 4,
      "concurrent_devices": 2,
      "rollover": false,
      "money_back_days": 7
    }
  },
  {
    "slug": "pass-3m",
    "kind": "pass",
    "name": "All-access Pass 3 months",
    "phase": "P1",
    "duration_days": 90,
    "prices": {
      "BD": 299000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "ai_credits_per_30d": 10,
      "full_mocks_per_30d": 2,
      "ai_daily_cap": 4,
      "concurrent_devices": 2,
      "rollover": false,
      "money_back_days": 7
    }
  },
  {
    "slug": "pass-6m",
    "kind": "pass",
    "name": "All-access Pass 6 months",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 449000,
      "A": 9900,
      "B": 5900,
      "C": 3900
    },
    "allowances": {
      "ai_credits_per_30d": 10,
      "full_mocks_per_30d": 2,
      "ai_daily_cap": 4,
      "concurrent_devices": 2,
      "rollover": false,
      "money_back_days": 7
    }
  },
  {
    "slug": "pass-12m",
    "kind": "pass",
    "name": "All-access Pass 12 months",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 699000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "ai_credits_per_30d": 10,
      "full_mocks_per_30d": 2,
      "ai_daily_cap": 4,
      "concurrent_devices": 2,
      "rollover": false,
      "money_back_days": 7
    }
  },
  {
    "slug": "ielts-writing-mastery",
    "kind": "course",
    "name": "IELTS Writing Mastery",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 199000,
      "A": 4900,
      "B": 2499,
      "C": 1799
    },
    "allowances": {
      "ai_credits": 12,
      "money_back_days": 7
    }
  },
  {
    "slug": "ielts-speaking-mastery",
    "kind": "course",
    "name": "IELTS Speaking Mastery",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 199000,
      "A": 4900,
      "B": 2499,
      "C": 1799
    },
    "allowances": {
      "ai_credits": 12,
      "money_back_days": 7
    }
  },
  {
    "slug": "ielts-lr-accelerator",
    "kind": "course",
    "name": "IELTS Listening & Reading Accelerator",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 149000,
      "A": 3400,
      "B": 1999,
      "C": 1299
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "ielts-writing-speaking-bundle",
    "kind": "bundle",
    "name": "Writing + Speaking Mastery bundle",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 299000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "ai_credits": 24
    }
  },
  {
    "slug": "ielts-crash-4w",
    "kind": "live_batch",
    "name": "IELTS Crash Course (4-week live)",
    "phase": "P1 pilot / P2",
    "duration_days": 120,
    "prices": {
      "BD": 749000,
      "A": 16900,
      "B": 9900,
      "C": 6900
    },
    "allowances": {
      "live_classes": 16,
      "full_mocks": 4,
      "ai_credits": 10
    }
  },
  {
    "slug": "ielts-mock-series",
    "kind": "test_pack",
    "name": "IELTS Mock Test Series (20 full mocks)",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 299000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "full_mocks": 20
    }
  },
  {
    "slug": "ielts-life-skills-a1",
    "kind": "course",
    "name": "IELTS Life Skills A1",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 99000,
      "A": 2499,
      "B": 1299,
      "C": 899
    },
    "allowances": {
      "ai_credits": 8,
      "money_back_days": 7
    }
  },
  {
    "slug": "ielts-life-skills-b1",
    "kind": "course",
    "name": "IELTS Life Skills B1",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 149000,
      "A": 3400,
      "B": 1999,
      "C": 1299
    },
    "allowances": {
      "ai_credits": 12,
      "money_back_days": 7
    }
  },
  {
    "slug": "ielts-live-batch-12w",
    "kind": "live_batch",
    "name": "IELTS Live Batch (12 weeks; regular, weekend or evening)",
    "phase": "P2 (pilot P1)",
    "duration_days": 365,
    "prices": {
      "BD": 999000,
      "A": 22900,
      "B": 12900,
      "C": 8900
    },
    "allowances": {
      "live_classes": 36,
      "full_mocks": 4,
      "ai_credits": 10
    }
  },
  {
    "slug": "eng-found-a0",
    "kind": "course",
    "name": "English Foundation A0 (Bangla-medium)",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 29900,
      "A": 799,
      "B": 499,
      "C": 299
    },
    "allowances": {
      "ai_credits": 6,
      "money_back_days": 7
    }
  },
  {
    "slug": "eng-found-a1",
    "kind": "course",
    "name": "English Foundation A1",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 49900,
      "A": 1199,
      "B": 799,
      "C": 499
    },
    "allowances": {
      "ai_credits": 8,
      "money_back_days": 7
    }
  },
  {
    "slug": "eng-found-a2",
    "kind": "course",
    "name": "English Foundation A2",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 69900,
      "A": 1499,
      "B": 899,
      "C": 599
    },
    "allowances": {
      "ai_credits": 10,
      "money_back_days": 7
    }
  },
  {
    "slug": "eng-found-b1",
    "kind": "course",
    "name": "English Foundation B1",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 99900,
      "A": 2499,
      "B": 1299,
      "C": 899
    },
    "allowances": {
      "ai_credits": 14,
      "money_back_days": 7
    }
  },
  {
    "slug": "eng-found-track",
    "kind": "bundle",
    "name": "English Foundation full track A0-B1",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 199000,
      "A": 4900,
      "B": 2499,
      "C": 1799
    },
    "allowances": {
      "ai_credits": 38
    }
  },
  {
    "slug": "spoken-english-everyday",
    "kind": "course",
    "name": "Spoken English: Everyday",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 149000,
      "A": 3400,
      "B": 1999,
      "C": 1299
    },
    "allowances": {
      "ai_credits": 20,
      "money_back_days": 7
    }
  },
  {
    "slug": "spoken-english-workplace",
    "kind": "course",
    "name": "Spoken English: Workplace",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "ai_credits": 30,
      "money_back_days": 7
    }
  },
  {
    "slug": "gre-verbal-booster",
    "kind": "course",
    "name": "GRE Verbal Booster",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "ai_credits": 0,
      "money_back_days": 7
    }
  },
  {
    "slug": "gre-quant-booster",
    "kind": "course",
    "name": "GRE Quant Booster",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "gre-awa-coaching",
    "kind": "course",
    "name": "GRE AWA Coaching",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 149000,
      "A": 3400,
      "B": 1999,
      "C": 1299
    },
    "allowances": {
      "ai_credits": 12,
      "money_back_days": 7
    }
  },
  {
    "slug": "gre-vocab",
    "kind": "course",
    "name": "GRE Vocab Pro",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 79000,
      "A": 1799,
      "B": 999,
      "C": 699
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "gre-mock-series",
    "kind": "test_pack",
    "name": "GRE Mock Test Series (8 section-adaptive)",
    "phase": "P1",
    "duration_days": 183,
    "prices": {
      "BD": 199000,
      "A": 4900,
      "B": 2499,
      "C": 1799
    },
    "allowances": {
      "full_mocks": 8
    }
  },
  {
    "slug": "gre-live-batch-8w",
    "kind": "live_batch",
    "name": "GRE Live Batch (8 weeks)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 899000,
      "A": 19900,
      "B": 11900,
      "C": 7900
    },
    "allowances": {
      "live_classes": 24,
      "full_mocks": 4
    }
  },
  {
    "slug": "pte-sw-coaching",
    "kind": "course",
    "name": "PTE Speaking & Writing AI Coaching",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 199000,
      "A": 4900,
      "B": 2499,
      "C": 1799
    },
    "allowances": {
      "ai_credits": 12,
      "money_back_days": 7
    }
  },
  {
    "slug": "pte-mock-series",
    "kind": "test_pack",
    "name": "PTE Mock Series (10)",
    "phase": "P2",
    "duration_days": 183,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "full_mocks": 10
    }
  },
  {
    "slug": "det-sprint",
    "kind": "course",
    "name": "DET Sprint (2-week)",
    "phase": "P2",
    "duration_days": 60,
    "prices": {
      "BD": 149000,
      "A": 3400,
      "B": 1999,
      "C": 1299
    },
    "allowances": {
      "full_mocks": 10,
      "money_back_days": 7
    }
  },
  {
    "slug": "toefl-sw-coaching",
    "kind": "course",
    "name": "TOEFL Speaking & Writing AI Coaching",
    "phase": "P3",
    "duration_days": 183,
    "prices": {
      "BD": 199000,
      "A": 4900,
      "B": 2499,
      "C": 1799
    },
    "allowances": {
      "ai_credits": 12,
      "money_back_days": 7
    }
  },
  {
    "slug": "toefl-mock-series",
    "kind": "test_pack",
    "name": "TOEFL Mock Series (10)",
    "phase": "P3",
    "duration_days": 183,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "full_mocks": 10
    }
  },
  {
    "slug": "eps-topik-starter",
    "kind": "course",
    "name": "EPS-TOPIK Starter (Hangul + survival Korean, Bangla-medium)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 99000,
      "A": 2499,
      "B": 1299,
      "C": 899
    },
    "allowances": {
      "ai_credits": 10,
      "money_back_days": 7
    }
  },
  {
    "slug": "eps-topik-prep",
    "kind": "course",
    "name": "EPS-TOPIK Exam Prep",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 199000,
      "A": 4900,
      "B": 2499,
      "C": 1799
    },
    "allowances": {
      "full_mocks": 8,
      "money_back_days": 7
    }
  },
  {
    "slug": "eps-topik-complete",
    "kind": "bundle",
    "name": "EPS-TOPIK Complete",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    }
  },
  {
    "slug": "jft-basic-starter",
    "kind": "course",
    "name": "JFT-Basic Starter (kana + A1 Japanese)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 99000,
      "A": 2499,
      "B": 1299,
      "C": 899
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "jft-basic-prep",
    "kind": "course",
    "name": "JFT-Basic Exam Prep",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 199000,
      "A": 4900,
      "B": 2499,
      "C": 1799
    },
    "allowances": {
      "full_mocks": 8,
      "money_back_days": 7
    }
  },
  {
    "slug": "jft-basic-complete",
    "kind": "bundle",
    "name": "JFT-Basic Complete",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    }
  },
  {
    "slug": "tech-python-sql",
    "kind": "course",
    "name": "Python / SQL track",
    "phase": "P3",
    "duration_days": 365,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "tech-networking",
    "kind": "course",
    "name": "Networking track",
    "phase": "P3",
    "duration_days": 365,
    "prices": {
      "BD": 299000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "tech-genai",
    "kind": "course",
    "name": "GenAI track",
    "phase": "P3",
    "duration_days": 365,
    "prices": {
      "BD": 349000,
      "A": 7900,
      "B": 4900,
      "C": 2999
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "tech-ml",
    "kind": "course",
    "name": "Machine Learning track",
    "phase": "P3",
    "duration_days": 365,
    "prices": {
      "BD": 399000,
      "A": 8900,
      "B": 4900,
      "C": 3400
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "tech-dl",
    "kind": "course",
    "name": "Deep Learning track",
    "phase": "P3",
    "duration_days": 365,
    "prices": {
      "BD": 449000,
      "A": 9900,
      "B": 5900,
      "C": 3900
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "tech-pass-12m",
    "kind": "pass",
    "name": "Tech Pass 12 months",
    "phase": "P3",
    "duration_days": 365,
    "prices": {
      "BD": 599000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "univ-course-pack",
    "kind": "course",
    "name": "University course pack (per course; BD CSE syllabus)",
    "phase": "P3",
    "duration_days": 120,
    "prices": {
      "BD": 99000
    },
    "allowances": {
      "money_back_days": 7
    }
  },
  {
    "slug": "univ-semester-pack",
    "kind": "bundle",
    "name": "University semester pack",
    "phase": "P3",
    "duration_days": 183,
    "prices": {
      "BD": 249000
    }
  },
  {
    "slug": "ai-credits-10",
    "kind": "ai_credits",
    "name": "AI credits x10",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 59000,
      "A": 1199,
      "B": 799,
      "C": 499
    },
    "allowances": {
      "ai_credits": 10
    }
  },
  {
    "slug": "ai-credits-30",
    "kind": "ai_credits",
    "name": "AI credits x30",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 149000,
      "A": 3400,
      "B": 1999,
      "C": 1299
    },
    "allowances": {
      "ai_credits": 30
    }
  },
  {
    "slug": "ai-credits-75",
    "kind": "ai_credits",
    "name": "AI credits x75",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 299000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "ai_credits": 75
    }
  },
  {
    "slug": "mock-pack-3",
    "kind": "test_pack",
    "name": "Mock pack x3",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 69000,
      "A": 1499,
      "B": 899,
      "C": 599
    },
    "allowances": {
      "full_mocks": 3
    }
  },
  {
    "slug": "mock-pack-5",
    "kind": "test_pack",
    "name": "Mock pack x5",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 99000,
      "A": 2499,
      "B": 1299,
      "C": 899
    },
    "allowances": {
      "full_mocks": 5
    }
  },
  {
    "slug": "mock-pack-10",
    "kind": "test_pack",
    "name": "Mock pack x10 (sold once 10 mocks are live, ~day 120)",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 169000,
      "A": 3900,
      "B": 2499,
      "C": 1499
    },
    "allowances": {
      "full_mocks": 10
    }
  },
  {
    "slug": "human-essay-review-1",
    "kind": "ai_credits",
    "name": "Human essay review x1",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 79000,
      "A": 1799,
      "B": 999,
      "C": 699
    },
    "allowances": {
      "human_essay_reviews": 1
    },
    "d5_extension": true
  },
  {
    "slug": "human-essay-review-5",
    "kind": "ai_credits",
    "name": "Human essay review x5",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 349000,
      "A": 7900,
      "B": 4900,
      "C": 2999
    },
    "allowances": {
      "human_essay_reviews": 5
    },
    "d5_extension": true
  },
  {
    "slug": "human-essay-review-10",
    "kind": "ai_credits",
    "name": "Human essay review x10",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 649000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "human_essay_reviews": 10
    },
    "d5_extension": true
  },
  {
    "slug": "human-speaking-mock-1",
    "kind": "ai_credits",
    "name": "Human speaking mock x1 (examiner-style, 12 min + 8 min feedback)",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 129000,
      "A": 2999,
      "B": 1799,
      "C": 1199
    },
    "allowances": {
      "human_speaking_mocks": 1
    },
    "d5_extension": true
  },
  {
    "slug": "human-speaking-mock-3",
    "kind": "ai_credits",
    "name": "Human speaking mock x3",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 349000,
      "A": 7900,
      "B": 4900,
      "C": 2999
    },
    "allowances": {
      "human_speaking_mocks": 3
    },
    "d5_extension": true
  },
  {
    "slug": "one-to-one-1",
    "kind": "ai_credits",
    "name": "1:1 mentor session x1 (45 min)",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 249000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "one_to_one_45min": 1
    },
    "d5_extension": true
  },
  {
    "slug": "one-to-one-3",
    "kind": "ai_credits",
    "name": "1:1 mentor sessions x3",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 649000,
      "A": 14900,
      "B": 8900,
      "C": 5900
    },
    "allowances": {
      "one_to_one_45min": 3
    },
    "d5_extension": true
  },
  {
    "slug": "one-to-one-5",
    "kind": "ai_credits",
    "name": "1:1 mentor sessions x5",
    "phase": "P1",
    "duration_days": 365,
    "prices": {
      "BD": 999000,
      "A": 22900,
      "B": 12900,
      "C": 8900
    },
    "allowances": {
      "one_to_one_45min": 5
    },
    "d5_extension": true
  },
  {
    "slug": "speaking-club-1",
    "kind": "ai_credits",
    "name": "Speaking Club slot x1 (45 min, max 6)",
    "phase": "P1",
    "duration_days": 90,
    "prices": {
      "BD": 39000,
      "A": 999,
      "B": 599,
      "C": 399
    },
    "allowances": {
      "speaking_club_slots": 1
    },
    "d5_extension": true
  },
  {
    "slug": "speaking-club-4",
    "kind": "ai_credits",
    "name": "Speaking Club slots x4",
    "phase": "P1",
    "duration_days": 120,
    "prices": {
      "BD": 129000,
      "A": 2999,
      "B": 1799,
      "C": 1199
    },
    "allowances": {
      "speaking_club_slots": 4
    },
    "d5_extension": true
  },
  {
    "slug": "extension-1m",
    "kind": "ai_credits",
    "name": "Course extension +1 month (Core/Plus)",
    "phase": "P1",
    "prices": {
      "BD": 49000,
      "A": 1199,
      "B": 799,
      "C": 499
    },
    "allowances": {
      "extend_days": 30
    },
    "d5_extension": true
  },
  {
    "slug": "extension-3m",
    "kind": "ai_credits",
    "name": "Course extension +3 months (Core/Plus)",
    "phase": "P1",
    "prices": {
      "BD": 119000,
      "A": 2499,
      "B": 1499,
      "C": 999
    },
    "allowances": {
      "extend_days": 91
    },
    "d5_extension": true
  },
  {
    "slug": "extension-live-3m",
    "kind": "ai_credits",
    "name": "Extension +3 months (Live/Mentor)",
    "phase": "P1",
    "prices": {
      "BD": 149000,
      "A": 3400,
      "B": 1999,
      "C": 1299
    },
    "allowances": {
      "extend_days": 91
    },
    "d5_extension": true
  },
  {
    "slug": "certificate-digital-reissue",
    "kind": "ai_credits",
    "name": "Certificate digital re-issue (name change)",
    "phase": "P1",
    "prices": {
      "BD": 9900,
      "A": 299,
      "B": 199,
      "C": 99
    },
    "d5_extension": true
  },
  {
    "slug": "certificate-print",
    "kind": "physical_book",
    "name": "Certificate printed (A4 matte, folder), BD only",
    "phase": "P1",
    "prices": {
      "BD": 34900
    },
    "d5_extension": true
  },
  {
    "slug": "priority-grading-1",
    "kind": "ai_credits",
    "name": "Priority grading x1 (24 h instead of 72 h)",
    "phase": "P1",
    "prices": {
      "BD": 25000,
      "A": 799,
      "B": 499,
      "C": 299
    },
    "allowances": {
      "priority_reviews": 1
    },
    "d5_extension": true
  },
  {
    "slug": "priority-grading-5",
    "kind": "ai_credits",
    "name": "Priority grading x5",
    "phase": "P1",
    "prices": {
      "BD": 99000,
      "A": 2499,
      "B": 1299,
      "C": 899
    },
    "allowances": {
      "priority_reviews": 5
    },
    "d5_extension": true
  },
  {
    "slug": "book-ielts-academic-workbook",
    "kind": "physical_book",
    "name": "IELTS Academic Workbook (print)",
    "phase": "P1",
    "prices": {
      "BD": 79000
    },
    "allowances": {
      "pages": 320
    },
    "d5_extension": true
  },
  {
    "slug": "pdf-ielts-academic-workbook",
    "kind": "bundle",
    "name": "IELTS Academic Workbook (PDF, watermarked)",
    "phase": "P1",
    "prices": {
      "BD": 39000,
      "A": 999,
      "B": 599,
      "C": 399
    },
    "allowances": {
      "pages": 320,
      "watermark": true,
      "downloads": 5
    }
  },
  {
    "slug": "book-ielts-gt-workbook",
    "kind": "physical_book",
    "name": "IELTS General Training Workbook (print)",
    "phase": "P1",
    "prices": {
      "BD": 69000
    },
    "allowances": {
      "pages": 280
    },
    "d5_extension": true
  },
  {
    "slug": "pdf-ielts-gt-workbook",
    "kind": "bundle",
    "name": "IELTS General Training Workbook (PDF, watermarked)",
    "phase": "P1",
    "prices": {
      "BD": 34900,
      "A": 799,
      "B": 499,
      "C": 299
    },
    "allowances": {
      "pages": 280,
      "watermark": true,
      "downloads": 5
    }
  },
  {
    "slug": "book-ielts-writing-model-answers",
    "kind": "physical_book",
    "name": "IELTS Writing Model Answers (Task 1 + 2) (print)",
    "phase": "P1",
    "prices": {
      "BD": 49000
    },
    "allowances": {
      "pages": 200
    },
    "d5_extension": true
  },
  {
    "slug": "pdf-ielts-writing-model-answers",
    "kind": "bundle",
    "name": "IELTS Writing Model Answers (Task 1 + 2) (PDF, watermarked)",
    "phase": "P1",
    "prices": {
      "BD": 24900,
      "A": 799,
      "B": 499,
      "C": 299
    },
    "allowances": {
      "pages": 200,
      "watermark": true,
      "downloads": 5
    }
  },
  {
    "slug": "book-ielts-speaking-cue-cards",
    "kind": "physical_book",
    "name": "IELTS Speaking Cue-Card Book (QR audio) (print)",
    "phase": "P1",
    "prices": {
      "BD": 39000
    },
    "allowances": {
      "pages": 160
    },
    "d5_extension": true
  },
  {
    "slug": "pdf-ielts-speaking-cue-cards",
    "kind": "bundle",
    "name": "IELTS Speaking Cue-Card Book (QR audio) (PDF, watermarked)",
    "phase": "P1",
    "prices": {
      "BD": 19900,
      "A": 499,
      "B": 299,
      "C": 199
    },
    "allowances": {
      "pages": 160,
      "watermark": true,
      "downloads": 5
    }
  },
  {
    "slug": "book-ielts-vocabulary",
    "kind": "physical_book",
    "name": "IELTS Vocabulary by Topic (print)",
    "phase": "P1",
    "prices": {
      "BD": 49000
    },
    "allowances": {
      "pages": 240
    },
    "d5_extension": true
  },
  {
    "slug": "pdf-ielts-vocabulary",
    "kind": "bundle",
    "name": "IELTS Vocabulary by Topic (PDF, watermarked)",
    "phase": "P1",
    "prices": {
      "BD": 24900,
      "A": 799,
      "B": 499,
      "C": 299
    },
    "allowances": {
      "pages": 240,
      "watermark": true,
      "downloads": 5
    }
  },
  {
    "slug": "book-gre-vocab-quant-formula",
    "kind": "physical_book",
    "name": "GRE Vocab and Quant Formula Book (print)",
    "phase": "P1",
    "prices": {
      "BD": 79000
    },
    "allowances": {
      "pages": 280
    },
    "d5_extension": true
  },
  {
    "slug": "pdf-gre-vocab-quant-formula",
    "kind": "bundle",
    "name": "GRE Vocab and Quant Formula Book (PDF, watermarked)",
    "phase": "P1",
    "prices": {
      "BD": 39000,
      "A": 999,
      "B": 599,
      "C": 399
    },
    "allowances": {
      "pages": 280,
      "watermark": true,
      "downloads": 5
    }
  },
  {
    "slug": "book-ielts-mock-booklets",
    "kind": "physical_book",
    "name": "IELTS Mock Test Booklets (4 L/R/W papers) (print)",
    "phase": "P1",
    "prices": {
      "BD": 59000
    },
    "allowances": {
      "pages": 240
    },
    "d5_extension": true
  },
  {
    "slug": "pdf-ielts-mock-booklets",
    "kind": "bundle",
    "name": "IELTS Mock Test Booklets (4 L/R/W papers) (PDF, watermarked)",
    "phase": "P1",
    "prices": {
      "BD": 29900,
      "A": 799,
      "B": 499,
      "C": 299
    },
    "allowances": {
      "pages": 240,
      "watermark": true,
      "downloads": 5
    }
  },
  {
    "slug": "book-eng-foundation-workbook-a1-a2",
    "kind": "physical_book",
    "name": "English Foundation Workbook A1-A2 (Bangla) (print)",
    "phase": "P1",
    "prices": {
      "BD": 29000
    },
    "allowances": {
      "pages": 160
    },
    "d5_extension": true
  },
  {
    "slug": "pdf-eng-foundation-workbook-a1-a2",
    "kind": "bundle",
    "name": "English Foundation Workbook A1-A2 (Bangla) (PDF, watermarked)",
    "phase": "P1",
    "prices": {
      "BD": 14900,
      "A": 499,
      "B": 299,
      "C": 199
    },
    "allowances": {
      "pages": 160,
      "watermark": true,
      "downloads": 5
    }
  },
  {
    "slug": "book-kit-ielts-academic",
    "kind": "bundle",
    "name": "IELTS Academic Print Kit (workbook, model answers, cue cards, vocabulary, mock booklets)",
    "phase": "P1",
    "prices": {
      "BD": 199000
    },
    "d5_extension": true
  },
  {
    "slug": "book-kit-ielts-gt",
    "kind": "bundle",
    "name": "IELTS GT Print Kit",
    "phase": "P1",
    "prices": {
      "BD": 189000
    },
    "d5_extension": true
  },
  {
    "slug": "b2b-seat-3m-25to49",
    "kind": "org_seat_pack",
    "name": "B2B 3-month seat (25-49 seats)",
    "phase": "P2",
    "duration_days": 90,
    "prices": {
      "BD": 140000,
      "A": 2999,
      "B": 1799,
      "C": 1199
    },
    "allowances": {
      "min_seats": 25,
      "half_allowances": false
    }
  },
  {
    "slug": "b2b-seat-3m-50to99",
    "kind": "org_seat_pack",
    "name": "B2B 3-month seat (50-99 seats)",
    "phase": "P2",
    "duration_days": 90,
    "prices": {
      "BD": 125000,
      "A": 2999,
      "B": 1799,
      "C": 1199
    },
    "allowances": {
      "min_seats": 50,
      "half_allowances": false
    }
  },
  {
    "slug": "b2b-seat-3m-100to249",
    "kind": "org_seat_pack",
    "name": "B2B 3-month seat (100-249 seats)",
    "phase": "P2",
    "duration_days": 90,
    "prices": {
      "BD": 110000,
      "A": 2499,
      "B": 1499,
      "C": 999
    },
    "allowances": {
      "min_seats": 100,
      "half_allowances": true
    }
  },
  {
    "slug": "b2b-seat-3m-250plus",
    "kind": "org_seat_pack",
    "name": "B2B 3-month seat (250+ (floor) seats)",
    "phase": "P2",
    "duration_days": 90,
    "prices": {
      "BD": 95000,
      "A": 1999,
      "B": 1199,
      "C": 799
    },
    "allowances": {
      "min_seats": 250,
      "half_allowances": true
    }
  },
  {
    "slug": "b2b-seat-12m-25to49",
    "kind": "org_seat_pack",
    "name": "B2B 12-month seat (25-49 seats)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 360000,
      "A": 8900,
      "B": 4900,
      "C": 3400
    },
    "allowances": {
      "min_seats": 25,
      "half_allowances": false
    }
  },
  {
    "slug": "b2b-seat-12m-50to99",
    "kind": "org_seat_pack",
    "name": "B2B 12-month seat (50-99 seats)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 320000,
      "A": 7900,
      "B": 4900,
      "C": 2999
    },
    "allowances": {
      "min_seats": 50,
      "half_allowances": false
    }
  },
  {
    "slug": "b2b-seat-12m-100to499",
    "kind": "org_seat_pack",
    "name": "B2B 12-month seat (100-499 seats)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 280000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "allowances": {
      "min_seats": 100,
      "half_allowances": true
    }
  },
  {
    "slug": "b2b-seat-12m-500to1999",
    "kind": "org_seat_pack",
    "name": "B2B 12-month seat (500-1,999 (university) seats)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 200000,
      "A": 4900,
      "B": 2499,
      "C": 1799
    },
    "allowances": {
      "min_seats": 500,
      "half_allowances": true
    }
  },
  {
    "slug": "b2b-seat-12m-2000plus",
    "kind": "org_seat_pack",
    "name": "B2B 12-month seat (2,000+ (floor) seats)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 150000,
      "A": 3400,
      "B": 1999,
      "C": 1299
    },
    "allowances": {
      "min_seats": 2000,
      "half_allowances": true
    }
  },
  {
    "slug": "adm-essay-feedback",
    "kind": "service",
    "name": "Common App essay feedback (1 essay, 2 rounds; feedback only)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 299000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "d5_extension": true
  },
  {
    "slug": "adm-essay-studio",
    "kind": "service",
    "name": "Essay Studio (3 essays, 2 rounds each)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 799000,
      "A": 16900,
      "B": 9900,
      "C": 6900
    },
    "d5_extension": true
  },
  {
    "slug": "adm-college-list",
    "kind": "service",
    "name": "College list builder (15 schools + 45-min consult)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 399000,
      "A": 8900,
      "B": 4900,
      "C": 3400
    },
    "d5_extension": true
  },
  {
    "slug": "adm-application-review",
    "kind": "service",
    "name": "Full application review (activities, honors, additional info, consistency)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 549000,
      "A": 11900,
      "B": 6900,
      "C": 4900
    },
    "d5_extension": true
  },
  {
    "slug": "adm-sop-review",
    "kind": "service",
    "name": "SOP review (1 draft, 2 rounds)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 279000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "d5_extension": true
  },
  {
    "slug": "adm-cv-review",
    "kind": "service",
    "name": "CV / resume review",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 159000,
      "A": 3900,
      "B": 2499,
      "C": 1499
    },
    "d5_extension": true
  },
  {
    "slug": "adm-sop-cv",
    "kind": "service",
    "name": "SOP + CV review bundle",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 399000,
      "A": 8900,
      "B": 4900,
      "C": 3400
    },
    "d5_extension": true
  },
  {
    "slug": "adm-scholarship-guidance",
    "kind": "service",
    "name": "Scholarship guidance (shortlist, plan, 1 essay review)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 379000,
      "A": 8900,
      "B": 4900,
      "C": 3400
    },
    "d5_extension": true
  },
  {
    "slug": "adm-interview-prep",
    "kind": "service",
    "name": "Interview prep (45-min mock + written feedback)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 279000,
      "A": 5900,
      "B": 3900,
      "C": 2499
    },
    "d5_extension": true
  },
  {
    "slug": "adm-apply-ready",
    "kind": "service",
    "name": "Apply Ready bundle (list + Essay Studio + full review + SOP)",
    "phase": "P2",
    "duration_days": 365,
    "prices": {
      "BD": 1699000,
      "A": 34900,
      "B": 22900,
      "C": 14900
    },
    "d5_extension": true
  },
  {
    "slug": "b2b-corporate-english",
    "kind": "org_seat_pack",
    "name": "Corporate English per employee per month (min 50 seats, annual)",
    "phase": "P2",
    "duration_days": 30,
    "prices": {
      "BD": 45000,
      "A": 999,
      "B": 599,
      "C": 399
    },
    "allowances": {
      "min_seats": 50,
      "billing": "monthly_annual_contract"
    }
  },
  {
    "slug": "b2b-whitelabel-setup",
    "kind": "org_seat_pack",
    "name": "White-label Mock Hub setup (one-time, up to 10 imported mocks)",
    "phase": "P2",
    "prices": {
      "BD": 7500000,
      "A": 199900,
      "B": 99900,
      "C": 69900
    },
    "allowances": {
      "one_time": true
    }
  },
  {
    "slug": "b2b-whitelabel-monthly",
    "kind": "org_seat_pack",
    "name": "White-label Mock Hub platform fee per month (up to 300 active learners)",
    "phase": "P2",
    "duration_days": 30,
    "prices": {
      "BD": 1500000,
      "A": 29900,
      "B": 19900,
      "C": 12900
    },
    "allowances": {
      "max_active_learners": 300
    }
  },
  {
    "slug": "bundle-ielts-academic-core-workbook",
    "kind": "bundle",
    "name": "IELTS Academic Core + printed Workbook",
    "phase": "P1",
    "prices": {
      "BD": 459000
    },
    "d5_extension": true
  },
  {
    "slug": "bundle-ielts-gt-core-workbook",
    "kind": "bundle",
    "name": "IELTS GT Core + printed Workbook",
    "phase": "P1",
    "prices": {
      "BD": 409000
    },
    "d5_extension": true
  },
  {
    "slug": "bundle-gre-core-formula-book",
    "kind": "bundle",
    "name": "GRE Core + printed Vocab & Quant Formula Book",
    "phase": "P1",
    "prices": {
      "BD": 659000
    },
    "d5_extension": true
  }
];
