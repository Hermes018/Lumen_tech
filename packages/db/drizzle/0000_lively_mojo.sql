CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"access_token_expires_at" timestamp with time zone,
	"refresh_token_expires_at" timestamp with time zone,
	"scope" text,
	"id_token" text,
	"password" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "audit_log" (
	"id" text PRIMARY KEY NOT NULL,
	"actor_id" text,
	"action" text NOT NULL,
	"resource_type" text NOT NULL,
	"resource_id" text,
	"metadata" jsonb,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "org_member" (
	"id" text PRIMARY KEY NOT NULL,
	"org_id" text NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "organization" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"logo" text,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "organization_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "role_assignment" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"role" text NOT NULL,
	"org_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"phone" text,
	"phone_verified" boolean DEFAULT false NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "entitlement" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"product_id" text,
	"source" text NOT NULL,
	"starts_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_at" timestamp with time zone,
	"allowances_json" jsonb,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "price" (
	"id" text PRIMARY KEY NOT NULL,
	"product_id" text NOT NULL,
	"region" text NOT NULL,
	"currency" text NOT NULL,
	"amount_minor" integer NOT NULL,
	"billing_interval" text DEFAULT 'one_time' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "product" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"exam_type" text NOT NULL,
	"tier" text NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "product_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "exam_blueprint" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_type" text NOT NULL,
	"name" text NOT NULL,
	"version" integer DEFAULT 1 NOT NULL,
	"sections_json" jsonb NOT NULL,
	"total_time_minutes" integer NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_type" text NOT NULL,
	"default_topic_id" text,
	"author_id" text,
	"status" text DEFAULT 'draft' NOT NULL,
	"live_version_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "question_stat" (
	"id" text PRIMARY KEY NOT NULL,
	"question_id" text NOT NULL,
	"difficulty_b" real DEFAULT 0 NOT NULL,
	"discrimination_a" real DEFAULT 1 NOT NULL,
	"guessing_c" real DEFAULT 0 NOT NULL,
	"exposure_count" integer DEFAULT 0 NOT NULL,
	"correct_count" integer DEFAULT 0 NOT NULL,
	"average_time_ms" integer DEFAULT 0 NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "question_stat_question_id_unique" UNIQUE("question_id")
);
--> statement-breakpoint
CREATE TABLE "question_version" (
	"id" text PRIMARY KEY NOT NULL,
	"question_id" text NOT NULL,
	"version_number" integer DEFAULT 1 NOT NULL,
	"question_type" text NOT NULL,
	"prompt_md" text NOT NULL,
	"passage_md" text,
	"options_json" jsonb,
	"correct_answers_json" jsonb NOT NULL,
	"hints_json" jsonb DEFAULT '[]'::jsonb,
	"choice_explanations_json" jsonb DEFAULT '{}'::jsonb,
	"steps_json" jsonb DEFAULT '[]'::jsonb,
	"verbal_deconstructor_json" jsonb,
	"video_explanation_url" text,
	"written_explanation_md" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "topic_taxonomy" (
	"id" text PRIMARY KEY NOT NULL,
	"exam_type" text NOT NULL,
	"section" text NOT NULL,
	"domain" text NOT NULL,
	"topic" text NOT NULL,
	"subtopic" text,
	"slug" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "topic_taxonomy_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "attempt_item" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_section_id" text NOT NULL,
	"question_version_id" text NOT NULL,
	"response_json" jsonb,
	"is_flagged" boolean DEFAULT false NOT NULL,
	"strikethrough_choices_json" jsonb DEFAULT '[]'::jsonb,
	"time_spent_ms" integer DEFAULT 0 NOT NULL,
	"is_correct" boolean,
	"score_awarded" integer DEFAULT 0 NOT NULL,
	"autosaved_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attempt_section" (
	"id" text PRIMARY KEY NOT NULL,
	"attempt_id" text NOT NULL,
	"section_index" integer NOT NULL,
	"section_type" text NOT NULL,
	"adaptive_tier" text DEFAULT 'baseline' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"ends_at" timestamp with time zone NOT NULL,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"raw_score" integer,
	"scaled_score" integer
);
--> statement-breakpoint
CREATE TABLE "exam_attempt" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"exam_type" text NOT NULL,
	"blueprint_id" text,
	"status" text DEFAULT 'in_progress' NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"total_score" integer,
	"section_scores_json" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_attempt_item" (
	"id" text PRIMARY KEY NOT NULL,
	"practice_session_id" text NOT NULL,
	"question_version_id" text NOT NULL,
	"response_json" jsonb,
	"hints_used_count" integer DEFAULT 0 NOT NULL,
	"second_chance_used" boolean DEFAULT false NOT NULL,
	"mastery_weight_bps" integer DEFAULT 10000 NOT NULL,
	"error_log_tag" text DEFAULT 'none' NOT NULL,
	"is_correct" boolean DEFAULT false NOT NULL,
	"time_spent_ms" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "practice_session" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"exam_type" text NOT NULL,
	"mode" text DEFAULT 'timed' NOT NULL,
	"topic_id" text,
	"difficulty_filter" text DEFAULT 'all' NOT NULL,
	"hint_budget_total" integer DEFAULT 10 NOT NULL,
	"hint_budget_remaining" integer DEFAULT 10 NOT NULL,
	"started_at" timestamp with time zone DEFAULT now() NOT NULL,
	"completed_at" timestamp with time zone,
	"total_questions" integer NOT NULL,
	"correct_questions" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "deck_word" (
	"id" text PRIMARY KEY NOT NULL,
	"deck_id" text NOT NULL,
	"word_id" text NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE "error_log_queue" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"question_version_id" text NOT NULL,
	"error_tag" text NOT NULL,
	"retry_interval_stage" integer DEFAULT 1 NOT NULL,
	"next_retry_due_at" timestamp with time zone NOT NULL,
	"is_resolved" boolean DEFAULT false NOT NULL,
	"notes_md" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_vocab_card" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"word_id" text NOT NULL,
	"stability" real DEFAULT 0 NOT NULL,
	"difficulty" real DEFAULT 0 NOT NULL,
	"elapsed_days" integer DEFAULT 0 NOT NULL,
	"scheduled_days" integer DEFAULT 0 NOT NULL,
	"reps" integer DEFAULT 0 NOT NULL,
	"lapses" integer DEFAULT 0 NOT NULL,
	"state" text DEFAULT 'new' NOT NULL,
	"due_at" timestamp with time zone DEFAULT now() NOT NULL,
	"last_review_at" timestamp with time zone,
	"source_question_id" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_deck" (
	"id" text PRIMARY KEY NOT NULL,
	"slug" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"word_count" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vocab_deck_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "vocab_review_log" (
	"id" text PRIMARY KEY NOT NULL,
	"card_id" text NOT NULL,
	"user_id" text NOT NULL,
	"rating" integer NOT NULL,
	"mode" text DEFAULT 'flip' NOT NULL,
	"review_duration_ms" integer DEFAULT 0 NOT NULL,
	"review_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "vocab_word" (
	"id" text PRIMARY KEY NOT NULL,
	"headword" text NOT NULL,
	"part_of_speech" text NOT NULL,
	"definition" text NOT NULL,
	"bn_meaning" text NOT NULL,
	"mnemonic_md" text,
	"etymology_root" text,
	"synonyms_json" jsonb DEFAULT '[]'::jsonb,
	"antonyms_json" jsonb DEFAULT '[]'::jsonb,
	"example_sentence_gre" text NOT NULL,
	"frequency_tier" text DEFAULT 'common' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "vocab_word_headword_unique" UNIQUE("headword")
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_member" ADD CONSTRAINT "org_member_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "org_member" ADD CONSTRAINT "org_member_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignment" ADD CONSTRAINT "role_assignment_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "role_assignment" ADD CONSTRAINT "role_assignment_org_id_organization_id_fk" FOREIGN KEY ("org_id") REFERENCES "public"."organization"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlement" ADD CONSTRAINT "entitlement_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "entitlement" ADD CONSTRAINT "entitlement_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "price" ADD CONSTRAINT "price_product_id_product_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."product"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_default_topic_id_topic_taxonomy_id_fk" FOREIGN KEY ("default_topic_id") REFERENCES "public"."topic_taxonomy"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question" ADD CONSTRAINT "question_author_id_user_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_stat" ADD CONSTRAINT "question_stat_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "question_version" ADD CONSTRAINT "question_version_question_id_question_id_fk" FOREIGN KEY ("question_id") REFERENCES "public"."question"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt_item" ADD CONSTRAINT "attempt_item_attempt_section_id_attempt_section_id_fk" FOREIGN KEY ("attempt_section_id") REFERENCES "public"."attempt_section"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt_item" ADD CONSTRAINT "attempt_item_question_version_id_question_version_id_fk" FOREIGN KEY ("question_version_id") REFERENCES "public"."question_version"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attempt_section" ADD CONSTRAINT "attempt_section_attempt_id_exam_attempt_id_fk" FOREIGN KEY ("attempt_id") REFERENCES "public"."exam_attempt"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempt" ADD CONSTRAINT "exam_attempt_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "exam_attempt" ADD CONSTRAINT "exam_attempt_blueprint_id_exam_blueprint_id_fk" FOREIGN KEY ("blueprint_id") REFERENCES "public"."exam_blueprint"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_attempt_item" ADD CONSTRAINT "practice_attempt_item_practice_session_id_practice_session_id_fk" FOREIGN KEY ("practice_session_id") REFERENCES "public"."practice_session"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_attempt_item" ADD CONSTRAINT "practice_attempt_item_question_version_id_question_version_id_fk" FOREIGN KEY ("question_version_id") REFERENCES "public"."question_version"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_session" ADD CONSTRAINT "practice_session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "practice_session" ADD CONSTRAINT "practice_session_topic_id_topic_taxonomy_id_fk" FOREIGN KEY ("topic_id") REFERENCES "public"."topic_taxonomy"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_word" ADD CONSTRAINT "deck_word_deck_id_vocab_deck_id_fk" FOREIGN KEY ("deck_id") REFERENCES "public"."vocab_deck"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "deck_word" ADD CONSTRAINT "deck_word_word_id_vocab_word_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."vocab_word"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "error_log_queue" ADD CONSTRAINT "error_log_queue_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "error_log_queue" ADD CONSTRAINT "error_log_queue_question_version_id_question_version_id_fk" FOREIGN KEY ("question_version_id") REFERENCES "public"."question_version"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocab_card" ADD CONSTRAINT "user_vocab_card_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocab_card" ADD CONSTRAINT "user_vocab_card_word_id_vocab_word_id_fk" FOREIGN KEY ("word_id") REFERENCES "public"."vocab_word"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_vocab_card" ADD CONSTRAINT "user_vocab_card_source_question_id_question_id_fk" FOREIGN KEY ("source_question_id") REFERENCES "public"."question"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_review_log" ADD CONSTRAINT "vocab_review_log_card_id_user_vocab_card_id_fk" FOREIGN KEY ("card_id") REFERENCES "public"."user_vocab_card"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "vocab_review_log" ADD CONSTRAINT "vocab_review_log_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;