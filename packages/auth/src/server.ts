import { betterAuth } from 'better-auth';
import { drizzleAdapter } from 'better-auth/adapters/drizzle';
import { twoFactor as twoFactorPlugin } from 'better-auth/plugins/two-factor';
import { phoneNumber } from 'better-auth/plugins/phone-number';
import { emailOTP } from 'better-auth/plugins/email-otp';
import { db, user, session, account, verification, twoFactor } from '@lumen/db';
import { brand } from '@lumen/config';
import { requiresTwoFactor, type Role } from './permissions';
import type * as _zodCore from 'zod/v4/core';

export type { _zodCore };

export interface CreateAuthOptions {
  baseURL?: string;
  secret?: string;
  sendEmailOtp?: (email: string, otp: string) => Promise<void>;
  sendPhoneOtp?: (phone: string, otp: string) => Promise<void>;
}

export function createAuth(options: CreateAuthOptions = {}) {
  const devFallbackSecret = 'dev_secret_at_least_32_characters_long_lumen_auth';
  const secret = options.secret || process.env.BETTER_AUTH_SECRET;

  if ((process.env.NODE_ENV as string) === 'production' && (!secret || secret === devFallbackSecret)) {
    throw new Error('FATAL: BETTER_AUTH_SECRET is required and must not be default in production');
  }

  return betterAuth({
    baseURL: options.baseURL || process.env.BETTER_AUTH_URL || 'http://localhost:3000',
    secret: secret || devFallbackSecret,
    database: drizzleAdapter(db, {
      provider: 'pg',
      schema: {
        user,
        session,
        account,
        verification,
        twoFactor,
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
      twoFactorPlugin({
        issuer: brand.name,
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

/**
 * Server-resolved authenticated actor representation (P1-32 / D4).
 */
export interface ServerActor {
  id: string;
  userId: string;
  roles: readonly Role[];
  orgId?: string;
  orgIds: string[];
  hasTwoFactorEnabled: boolean;
  twoFactorVerified: boolean;
  sessionId: string;
  locale: 'en' | 'bn';
  name: string;
  email: string;
}

export type AuthErrorCode = 'UNAUTHENTICATED' | 'FORBIDDEN' | '2FA_REQUIRED';

export class AuthError extends Error {
  readonly code: AuthErrorCode;

  constructor(code: AuthErrorCode, message?: string) {
    super(
      message ??
        (code === 'UNAUTHENTICATED'
          ? 'Unauthenticated session'
          : code === '2FA_REQUIRED'
            ? 'Two-Factor Authentication (2FA) is mandatory for this role or action'
            : 'Forbidden access')
    );
    this.name = 'AuthError';
    this.code = code;
  }
}

export interface RequireServerActorOptions {
  requireTwoFactor?: boolean;
  roles?: readonly Role[];
  allowGuest?: boolean;
  headers?: Headers | Record<string, string>;
}

/**
 * Deterministic test-actor injection hook (ONLY active when process.env.NODE_ENV === 'test').
 */
let _testActorOverride: ServerActor | null | undefined = undefined;

export function __setTestServerActor(actor: Partial<ServerActor> | null | undefined): void {
  if (process.env.NODE_ENV !== 'test') {
    throw new AuthError(
      'FORBIDDEN',
      '__setTestServerActor is strictly restricted to NODE_ENV === "test"'
    );
  }
  if (actor === undefined) {
    _testActorOverride = undefined;
    return;
  }
  if (actor === null) {
    _testActorOverride = null;
    return;
  }
  const id = actor.id ?? actor.userId ?? 'test-user-01';
  const roles = actor.roles ?? ['student'];
  const twoFactor = actor.hasTwoFactorEnabled ?? actor.twoFactorVerified ?? false;
  _testActorOverride = {
    id,
    userId: id,
    roles,
    orgId: actor.orgId,
    orgIds: actor.orgIds ?? (actor.orgId ? [actor.orgId] : []),
    hasTwoFactorEnabled: twoFactor,
    twoFactorVerified: twoFactor,
    sessionId: actor.sessionId ?? 'sess-test-01',
    locale: actor.locale ?? 'en',
    name: actor.name ?? 'Test User',
    email: actor.email ?? 'test@lumen.academy',
  };
}

/**
 * Resolves the authenticated actor server-side from Better Auth session headers/cookies
 * without trusting any client-supplied userId/actor parameters.
 */
export async function getServerActor(
  options?: Pick<RequireServerActorOptions, 'headers'>
): Promise<ServerActor | null> {
  if (process.env.NODE_ENV === 'test' && _testActorOverride !== undefined) {
    return _testActorOverride;
  }

  let reqHeaders: Headers | undefined;
  if (options?.headers) {
    reqHeaders =
      options.headers instanceof Headers
        ? options.headers
        : new Headers(options.headers);
  } else {
    try {
      const nextHeadersMod = await import('next/headers' as string);
      if (typeof nextHeadersMod.headers === 'function') {
        reqHeaders = await nextHeadersMod.headers();
      }
    } catch {
      // Outside Next.js request context
    }
  }

  if (reqHeaders) {
    try {
      const sessionData = await getAuth().api.getSession({ headers: reqHeaders });
      if (sessionData?.user && sessionData?.session) {
        const u = sessionData.user as {
          id: string;
          name?: string;
          email: string;
          role?: string;
          roles?: string[];
          orgId?: string;
          twoFactorEnabled?: boolean | null;
          locale?: string;
        };
        const s = sessionData.session as {
          id: string;
          twoFactorVerified?: boolean | null;
          twoFactor?: boolean | null;
        };
        const rawRoles: Role[] = Array.isArray(u.roles)
          ? (u.roles as Role[])
          : u.role
            ? [u.role as Role]
            : ['student'];
        const twoFactorEnabled = Boolean(u.twoFactorEnabled);
        const twoFactorVerified = twoFactorEnabled && Boolean(s?.twoFactorVerified ?? s?.twoFactor);

        return {
          id: u.id,
          userId: u.id,
          roles: rawRoles,
          orgId: u.orgId,
          orgIds: u.orgId ? [u.orgId] : [],
          hasTwoFactorEnabled: twoFactorEnabled,
          twoFactorVerified,
          sessionId: sessionData.session.id,
          locale: u.locale === 'bn' ? 'bn' : 'en',
          name: u.name || 'Learner',
          email: u.email,
        };
      }
    } catch {
      // Session lookup failed
    }
  }

  // In local development (non-production, non-test) when building/rendering prototype pages without an active DB session:
  if (
    process.env.NODE_ENV === 'development' &&
    process.env.LUMEN_STRICT_AUTH !== '1'
  ) {
    return {
      id: 'demo-learner-01',
      userId: 'demo-learner-01',
      roles: ['student'],
      orgIds: [],
      hasTwoFactorEnabled: false,
      twoFactorVerified: false,
      sessionId: 'dev-session-01',
      locale: 'en',
      name: 'Ayman Rahman',
      email: 'ayman@lumen.academy',
    };
  }

  return null;
}

/**
 * Requires an authenticated server actor, enforcing mandatory 2FA per D4 for
 * instructor, grader, content_editor, support, finance, org_admin, admin, and super_admin,
 * or when options.requireTwoFactor is explicitly passed.
 */
export async function requireServerActor(
  options?: RequireServerActorOptions
): Promise<ServerActor> {
  const actor = await getServerActor({ headers: options?.headers });

  if (!actor) {
    if (options?.allowGuest) {
      return {
        id: 'guest-anonymous',
        userId: 'guest-anonymous',
        roles: ['guest'],
        orgIds: [],
        hasTwoFactorEnabled: false,
        twoFactorVerified: false,
        sessionId: 'guest-session',
        locale: 'en',
        name: 'Guest',
        email: 'guest@lumen.academy',
      };
    }
    throw new AuthError('UNAUTHENTICATED', 'Authentication is required for this action');
  }

  // Enforce mandatory 2FA per D4 if any role requires 2FA OR if options.requireTwoFactor is true
  const roleRequires2FA = actor.roles.some((r) => requiresTwoFactor(r));
  if ((roleRequires2FA || options?.requireTwoFactor) && (!actor.hasTwoFactorEnabled || !actor.twoFactorVerified)) {
    throw new AuthError(
      '2FA_REQUIRED',
      `Mandatory Two-Factor Authentication (2FA) is required for role(s): ${actor.roles.join(', ')}`
    );
  }

  // Optional role whitelist check
  if (options?.roles && options.roles.length > 0) {
    const hasRequiredRole =
      actor.roles.includes('super_admin') ||
      options.roles.some((requiredRole) => actor.roles.includes(requiredRole));
    if (!hasRequiredRole) {
      throw new AuthError(
        'FORBIDDEN',
        `Actor lacks required role (${options.roles.join(' | ')})`
      );
    }
  }

  return actor;
}
