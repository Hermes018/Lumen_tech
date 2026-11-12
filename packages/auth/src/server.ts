import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { twoFactor } from 'better-auth/plugins/two-factor';
import { phoneNumber } from 'better-auth/plugins/phone-number';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { db, user, session, account, verification } from '@lumen/db';
import type * as _zodCore from 'zod/v4/core';

export type { _zodCore };

export interface CreateAuthOptions {
  baseURL?: string;
  secret?: string;
  sendEmailOtp?: (email: string, otp: string) => Promise<void>;
  sendPhoneOtp?: (phone: string, otp: string) => Promise<void>;
}

export function createAuth(options: CreateAuthOptions = {}) {
  return betterAuth({
    baseURL: options.baseURL || process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    secret: options.secret || process.env.BETTER_AUTH_SECRET || 'dev_secret_at_least_32_characters_long_lumen_auth',
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user,
        session,
        account,
        verification,
      },
    }),
    session: {
      expiresIn: 15 * 24 * 60 * 60, // 15-day absolute session lifetime per D7
      updateAge: 24 * 60 * 60, // Refresh daily
      cookieCache: {
        enabled: true,
        maxAge: 5 * 60, // 5 min
      },
    },
    emailAndPassword: {
      enabled: true,
      requireEmailVerification: true,
    },
    plugins: [
      twoFactor({
        issuer: 'Lumen Academy',
      }),
      emailOTP({
        sendVerificationOTP: async ({ email, otp }) => {
          if (options.sendEmailOtp) {
            await options.sendEmailOtp(email, otp);
          } else {
            console.info(`[Dev Email OTP] To: ${email}, OTP: ${otp}`);
          }
        },
      }),
      phoneNumber({
        sendOTP: async ({ phoneNumber: phone, code }) => {
          if (options.sendPhoneOtp) {
            await options.sendPhoneOtp(phone, code);
          } else {
            console.info(`[Dev Phone OTP] To: ${phone}, OTP: ${code}`);
          }
        },
      }),
    ],
  });
}

export type Auth = ReturnType<typeof createAuth>;

let _auth: Auth | null = null;

export function getAuth(): Auth {
  if (!_auth) {
    _auth = createAuth();
  }
  return _auth;
}

export const auth: Auth = new Proxy({} as Auth, {
  get(_target, prop) {
    const instance = getAuth();
    return Reflect.get(instance, prop);
  },
});
