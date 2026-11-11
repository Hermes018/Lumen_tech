/** @purpose Zod-validated environment schema and runtime configuration */

import { z } from 'zod';

const serverSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  APP_ENV: z.enum(['local', 'preview', 'staging', 'production']).default('local'),
  VERCEL_ENV: z.enum(['development', 'preview', 'production']).optional(),
  APP_URL: z.string().url().default('http://localhost:3000'),
  BETTER_AUTH_URL: z.string().url().default('http://localhost:3000'),
  BETTER_AUTH_SECRET: z.string().min(16).default('development-better-auth-secret-32-chars-min'),
  ENCRYPTION_KEY_B64: z.string().optional(),
  ENCRYPTION_KEY_ID: z.string().default('1'),
  STORAGE_KEY_HMAC_SECRET: z.string().min(16).default('development-storage-hmac-secret-min32'),
  LOG_IP_SALT_SECRET: z.string().min(16).default('development-log-ip-salt-secret-min32'),
  ADMIN_ALERT_EMAIL: z.string().email().default('admin@example.com'),
  FINANCE_ALERT_EMAIL: z.string().email().default('finance@example.com'),

  // Database
  DB_DRIVER: z.enum(['neon', 'pg']).default('neon'),
  DATABASE_URL: z.string().min(1).default('postgres://postgres:postgres@localhost:5432/lumen_dev'),
  DATABASE_URL_UNPOOLED: z.string().optional(),

  // Providers
  PAYMENT_PROVIDER_BD: z.enum(['fake', 'sslcommerz', 'bkash']).default('fake'),
  PAYMENT_PROVIDER_INTL: z.enum(['fake', 'paddle', 'stripe', 'lemonsqueezy']).default('fake'),
  VIDEO_PROVIDER: z.enum(['fake', 'bunny']).default('fake'),
  STORAGE_PROVIDER: z.enum(['r2', 'minio', 'fake']).default('fake'),
  EMAIL_PROVIDER: z.enum(['console', 'mailpit', 'resend', 'ses']).default('console'),
  SMS_PROVIDER: z.enum(['console', 'sslwireless', 'alphasms', 'bulksmsbd']).default('console'),
  LLM_PROVIDER_PRIMARY: z.enum(['fake', 'anthropic', 'gemini']).default('fake'),
  LLM_PROVIDER_FALLBACK: z.enum(['fake', 'anthropic', 'gemini']).default('fake'),
  STT_PROVIDER_PRIMARY: z.enum(['fake', 'deepgram', 'openai']).default('fake'),
  STT_PROVIDER_FALLBACK: z.enum(['fake', 'deepgram', 'openai']).default('fake'),
  LIVE_PROVIDER: z.enum(['none', 'zoom', 'youtube', 'livekit']).default('none'),
  RATE_LIMIT_BACKEND: z.enum(['postgres', 'redis']).default('postgres'),

  // Upstash Redis
  RATE_LIMIT_REDIS_URL: z.string().url().optional(),
  RATE_LIMIT_REDIS_TOKEN: z.string().optional(),

  // Inngest
  INNGEST_DEV: z.string().optional().default('1'),
  INNGEST_EVENT_KEY: z.string().default('local-dev-placeholder'),
  INNGEST_SIGNING_KEY: z.string().optional(),

  // Observability & Secrets
  TURNSTILE_SECRET_KEY: z.string().default('1x0000000000000000000000000000000AA'),
  SENTRY_DSN: z.string().optional(),
  POSTHOG_KEY: z.string().optional(),
  POSTHOG_HOST: z.string().default('https://eu.i.posthog.com'),

  // Storage R2
  R2_ACCOUNT_ID: z.string().optional(),
  R2_ACCESS_KEY_ID: z.string().optional(),
  R2_SECRET_ACCESS_KEY: z.string().optional(),
  R2_BUCKET_PRIVATE: z.string().default('lumen-private-dev'),
  R2_BUCKET_SPEAKING: z.string().default('lumen-speaking-dev'),
  R2_BUCKET_PUBLIC: z.string().default('lumen-public-dev'),
  R2_PUBLIC_BASE_URL: z.string().optional(),
  SPEAKING_AUDIO_RETENTION_DAYS: z.coerce.number().default(90),

  // Payments
  SSLCZ_STORE_ID: z.string().optional(),
  SSLCZ_STORE_PASSWORD: z.string().optional(),
  SSLCZ_IS_LIVE: z
    .string()
    .default('false')
    .transform((v) => v === 'true'),
  PADDLE_API_KEY: z.string().optional(),
  PADDLE_ENV: z.enum(['sandbox', 'production']).default('sandbox'),
  PADDLE_WEBHOOK_SECRET: z.string().optional(),

  // AI Keys
  ANTHROPIC_API_KEY: z.string().optional(),
  GEMINI_API_KEY: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
  DEEPGRAM_API_KEY: z.string().optional(),
  AI_DAILY_BUDGET_USD: z.coerce.number().default(2),
});

const clientSchema = z.object({
  NEXT_PUBLIC_APP_URL: z.string().url().default('http://localhost:3000'),
  NEXT_PUBLIC_TURNSTILE_SITE_KEY: z.string().default('1x00000000000000000000AA'),
  NEXT_PUBLIC_SENTRY_DSN: z.string().optional(),
  NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
  NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: z.string().optional(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
});

export type ServerEnv = z.infer<typeof serverSchema>;
export type ClientEnv = z.infer<typeof clientSchema>;

function parseEnv(): { serverEnv: ServerEnv; clientEnv: ClientEnv } {
  const serverParsed = serverSchema.safeParse(process.env);
  if (!serverParsed.success) {
    const formatted = serverParsed.error.format();
    throw new Error(
      `[Lumen Config] Invalid server environment variables: ${JSON.stringify(formatted, null, 2)}`
    );
  }

  const clientParsed = clientSchema.safeParse({
    NEXT_PUBLIC_APP_URL: process.env['NEXT_PUBLIC_APP_URL'],
    NEXT_PUBLIC_TURNSTILE_SITE_KEY: process.env['NEXT_PUBLIC_TURNSTILE_SITE_KEY'],
    NEXT_PUBLIC_SENTRY_DSN: process.env['NEXT_PUBLIC_SENTRY_DSN'],
    NEXT_PUBLIC_POSTHOG_KEY: process.env['NEXT_PUBLIC_POSTHOG_KEY'],
    NEXT_PUBLIC_PADDLE_CLIENT_TOKEN: process.env['NEXT_PUBLIC_PADDLE_CLIENT_TOKEN'],
    NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env['NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'],
  });

  if (!clientParsed.success) {
    const formatted = clientParsed.error.format();
    throw new Error(
      `[Lumen Config] Invalid client environment variables: ${JSON.stringify(formatted, null, 2)}`
    );
  }

  return {
    serverEnv: serverParsed.data,
    clientEnv: clientParsed.data,
  };
}

const parsed = parseEnv();

export const serverEnv = parsed.serverEnv;
export const clientEnv = parsed.clientEnv;
export const env = {
  ...serverEnv,
  ...clientEnv,
};
