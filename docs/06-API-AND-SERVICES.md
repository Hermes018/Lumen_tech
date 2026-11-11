# 06 — API, Services & Events

> **Status:** canonical, conforms to `00-DECISIONS.md` (D2 route groups, D3 stack, D4 roles incl. 2FA for staff + `instructor` + `org_admin` + `counsellor`, D12 C1/C13/C13b/C17/C27/C29/C30, D5 commerce, D6 test invariants, D7 security) and to table/column/enum names in `05-DATABASE.md`. Names here (services, permissions, events, Inngest ids, endpoints) are normative: other docs and code must reuse them verbatim.

## Contents
1. Layering & conventions
2. Core types (`Actor`, `Result`, `AppError`, `assertCan`, `withTx`, `audit`, `emit`)
3. Reference implementation: `enrollInCourse` (service + server action + unit test)
4. Service catalogue by domain (4.13 support, 4.14 guarantee, 4.15 admissions, 4.16 finance, 4.17 AI ops, 4.18 AI learning, 4.19 legal/policy added in the consolidation pass; AI limits are defined once in 09 section 10.2)
5. Route handlers (webhooks, Inngest, uploads, checkout return, exam engine)
6. Public REST `/api/v1` (P3)
7. Domain events & Inngest functions
8. Surfaces: route groups ↔ services
9. Permission matrix (+ generated `permissions.ts`)

---

## 1. Layering & conventions

```
apps/web/app/[locale]/(group)/…           RSC pages, layouts; call services directly for reads
apps/web/app/**/actions.ts                'use server' actions: parse FormData → call service → map Result → revalidate/redirect
apps/web/app/api/**/route.ts              machine endpoints (webhooks, exam, uploads, inngest) — thin adapters over services
apps/web/app/api/v1/[[...route]]/route.ts Hono app (P3) — thin adapters over the SAME services
packages/core/src/<domain>/
    index.ts        public API of the domain (ONLY import path other domains may use)
    schemas.ts      zod input/output schemas (shared by actions, route handlers, OpenAPI)
    service.ts      use-cases: (actor, input) => Promise<Result<T, AppError>>
    policy.ts       resource predicates used by assertCan (ownership, tenant, linked guardian)
    repo.ts         Drizzle queries (no authz, no business rules)
    events.ts       event name constants + zod payload schemas
packages/auth/src/permissions.ts          generated permission map (§9)
packages/db                                schema (05-DATABASE.md)
```

Rules (enforced by ESLint `no-restricted-imports` + dependency-cruiser):

1. **Services are the only entry to business logic.** Server actions, route handlers, Hono routes and Inngest functions call services; none contain business rules or Drizzle queries.
2. **A service never reads cookies/headers.** The adapter builds an `Actor` (`resolveActor(request)`), passes it in. Services are therefore testable and callable from Inngest (`systemActor('inngest:<fn>')`).
3. **Authorization first, then validation of ownership against loaded data, then work.** `assertCan(actor, permission, resource?)` runs inside the service, after the resource is loaded (so ownership/tenant checks use real data), before any mutation.
4. **One transaction per use-case**: `withTx(db, async (tx) => …)`. State change + audit row + outbox event commit atomically. External side effects (email, LLM, payment API) never run inside the transaction; they run from Inngest triggered by outbox events, or after commit through a `afterCommit` hook.
5. **Inputs validated with zod at the service boundary** (`schema.safeParse`) even if the adapter already validated. Unknown keys are rejected (`.strict()`).
6. **Errors are values.** Expected failures return `err(new AppError(code, …))`; only bugs throw. Adapters map `AppError.code` → HTTP status / UI state (table in §2.2).
7. **Idempotency:** mutating services that can be retried by clients or providers take an idempotency key (HTTP `Idempotency-Key` → `idempotency_key` table) or derive a natural key (e.g., `payment.merchant_ref`, `(user_id, idempotency_key)` on `evaluation_request`).
8. **Audit:** every staff-role action, role change, refund, impersonation, data export/erasure, manual grant, price/product change, publish/unpublish writes `audit_log` through `audit(tx, actor, …)`; learner self-service actions are audited only when security-relevant (password/2FA/passkey change, guardian consent, deletion request).
9. **Naming:** verbs for commands (`enrollInCourse`), `get…/list…` for queries, `…Action` suffix for server actions, `…Handler` for route handlers, event names `domain.past_tense_verb` (e.g., `order.paid`), Inngest function ids `domain.kebab-action` (e.g., `commerce.fulfil-order`).

---

## 2. Core types

### 2.1 Code (`packages/core/src/shared/`)

```ts
// result.ts
export type Result<T, E extends AppError = AppError> = { ok: true; value: T } | { ok: false; error: E };
export const ok = <T>(value: T): Result<T, never> => ({ ok: true, value });
export const err = <E extends AppError>(error: E): Result<never, E> => ({ ok: false, error });

// errors.ts
export type AppErrorCode =
  | 'validation' | 'unauthenticated' | 'forbidden' | 'not_found' | 'conflict' | 'precondition_failed'
  | 'payment_required' | 'rate_limited' | 'idempotency_mismatch' | 'gone' | 'unavailable' | 'internal';

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    message: string,
    public readonly details?: Record<string, unknown>,   // safe to return to clients (no PII, no internals)
    public readonly problemType?: string,                // slug for RFC 9457 `type`, e.g. 'exam/section-closed'
  ) { super(message); }
}
export const E = {
  validation: (issues: unknown) => new AppError('validation', 'Invalid input', { issues }),
  forbidden: (permission: string) => new AppError('forbidden', 'Not allowed', { permission }),
  notFound: (what: string) => new AppError('not_found', `${what} not found`),
  conflict: (msg: string, problemType?: string, details?: Record<string, unknown>) => new AppError('conflict', msg, details, problemType),
  // …one factory per code
};

// actor.ts
import type { Role, Permission, Scope } from '@lumen/auth/permissions';
export type RoleGrant = { role: Exclude<Role, 'guest'>; orgId: string | null };
export type Actor = {
  type: 'user' | 'system' | 'webhook';
  userId: string | null;                       // null for system/webhook
  isAnonymous: boolean;                        // guest diagnostic user
  roles: ReadonlyArray<RoleGrant>;             // ACTIVE grants only; staff/instructor/org_admin grants are dropped unless session is 2FA-verified
  session: { id: string; mfaVerified: boolean; impersonatorId: string | null; readOnly: boolean } | null;
  label: string;                               // 'user:<id>' | 'inngest:commerce.fulfil-order' | 'webhook:sslcommerz'
  ctx: { requestId: string; ip: string | null; userAgent: string | null; locale: 'en' | 'bn' };
};
export const systemActor = (label: string, requestId = crypto.randomUUID()): Actor => ({ /* type:'system', roles:[], … */ } as Actor);

// authorize.ts
export type PolicyResource = {
  ownerId?: string;            // user who owns the record (own scope)
  orgId?: string;              // tenant (org scope)
  studentId?: string;          // linked student (lnk scope) – resolved via guardian_link granted
  assignedToId?: string;       // grader assignment (asg scope)
  hasEntitlement?: boolean;    // pre-resolved by service for 'ent' scope
  extra?: Record<string, unknown>;
};
/** Throws AppError('forbidden'). Pure except for the guardian-link lookup (pass `deps.isLinkedGuardian`). */
export function assertCan(actor: Actor, permission: Permission, resource?: PolicyResource): void;
export function can(actor: Actor, permission: Permission, resource?: PolicyResource): boolean;
```

`can()` semantics: for each active `RoleGrant` (+ implicit `guest`) look up `PERMISSIONS[permission][role]`; the first scope that is satisfied by `resource` wins: `*`/`pub` always; `own` ⇒ `resource.ownerId === actor.userId`; `org` ⇒ grant.orgId === resource.orgId; `asg` ⇒ `assignedToId === actor.userId`; `lnk` ⇒ `studentId` is linked and consent granted; `ent` ⇒ `hasEntitlement` (callers must resolve it); `msk` ⇒ allowed but the caller must apply `maskUser()` (service returns masked DTO when `scopeUsed === 'msk'`; use `canWithScope()` to learn which scope applied); `7d` ⇒ allowed, service enforces ≤ 7 days; `lim` ⇒ service enforces target role ∉ {admin, super_admin}; `sub` ⇒ service filters subset. Read-only impersonation (`actor.session.readOnly`) denies every permission whose name's action is not a `read*`/`view*` verb. System actors pass only for permissions listed in `SYSTEM_ALLOWED` (e.g., `entitlement:grant` for fulfilment).

### 2.2 Error → transport mapping

| `AppErrorCode` | HTTP | Server action state | problem+json `type` slug (default) |
|---|---|---|---|
| `validation` | 422 | `{ ok:false, fieldErrors }` | `validation` |
| `unauthenticated` | 401 | redirect to `/sign-in?next=` | `unauthenticated` |
| `forbidden` | 403 | toast + (no data leak) | `forbidden` |
| `not_found` | 404 (also used for unauthorised reads of others' resources) | `notFound()` | `not-found` |
| `conflict` | 409 | inline message | per error (`exam/section-closed`, `order/already-paid`, …) |
| `precondition_failed` | 412 | inline | `precondition-failed` |
| `payment_required` | 402 | paywall / checkout CTA | `payment-required` |
| `rate_limited` | 429 (+`Retry-After`) | toast with countdown | `rate-limited` |
| `idempotency_mismatch` | 422 | — | `idempotency-mismatch` |
| `gone` | 410 | — | `gone` |
| `unavailable` | 503 | retry banner | `unavailable` |
| `internal` | 500 | generic error + request id | `internal` |

### 2.3 Transaction, audit, events

```ts
// tx.ts
export type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export async function withTx<T>(fn: (tx: Tx) => Promise<T>): Promise<T> {
  return db.transaction(fn, { isolationLevel: 'read committed' });          // 'serializable' only where stated in the catalogue
}
export async function runService<T>(name: string, actor: Actor, fn: () => Promise<T>): Promise<Result<T>> {
  const span = startSpan(`svc.${name}`, { actor: actor.label, requestId: actor.ctx.requestId });
  try { return ok(await fn()); }
  catch (e) {
    if (e instanceof AppError) return err(e);
    if (isUniqueViolation(e)) return err(E.conflict('Duplicate', 'conflict/duplicate'));        // 23505 fallback
    captureException(e, { service: name, requestId: actor.ctx.requestId });
    return err(new AppError('internal', 'Internal error'));
  } finally { span.end(); }
}

// audit.ts  — writes inside the caller's tx so audit and change commit together
export async function audit(tx: Tx, actor: Actor, e: {
  action: string; targetType: string; targetId?: string; orgId?: string;
  before?: unknown; after?: unknown;                 // hashed (sha256 of canonical JSON); never stored raw
  diff?: Record<string, unknown>; reason?: string;
}): Promise<void>;

// events.ts  — transactional outbox (05 §outbox_event)
export async function emit<N extends EventName>(tx: Tx, name: N, payload: EventPayloads[N], dedupeKey: string): Promise<void>;
// INSERT INTO outbox_event … ON CONFLICT (dedupe_key) DO NOTHING; relay sends to Inngest with { id: dedupeKey }
```

Event relay: after `withTx` commits, the adapter calls `flushOutbox()` (best-effort `inngest.send` of unpublished rows for this request); Inngest function `platform.outbox-relay` (cron `* * * * *`) sweeps any leftovers. Because the Inngest event `id` = `dedupe_key`, duplicates collapse.

---

## 3. Reference implementation — `enrollInCourse`

### 3.1 Schema (`packages/core/src/learning/schemas.ts`)

```ts
import { z } from 'zod';

export const EnrollInput = z.object({
  courseId: z.string().uuid(),
  userId: z.string().uuid().optional(),        // default = actor.userId; set by org_admin when enrolling a member
  cohortId: z.string().uuid().optional(),      // org flow only
}).strict();
export type EnrollInput = z.infer<typeof EnrollInput>;

export const EnrollmentDto = z.object({
  id: z.string().uuid(), userId: z.string().uuid(), courseId: z.string().uuid(),
  status: z.enum(['active', 'completed', 'suspended', 'expired']),
  source: z.string(), enrolledAt: z.date(),
});
export type Enrollment = z.infer<typeof EnrollmentDto> & { created: boolean };
```

### 3.2 Service (`packages/core/src/learning/service.ts`)

```ts
import { and, eq, isNull } from 'drizzle-orm';
import { course, cohort, enrollment, entitlement, orgMember } from '@lumen/db/schema';
import { E, err, ok, type Actor, type Result, assertCan, audit, emit, runService, withTx, AppError } from '../shared';
import { findCourseAccess, grantFreeCourseEntitlement } from '../entitlements';
import { EnrollInput, type Enrollment } from './schemas';

export async function enrollInCourse(actor: Actor, raw: unknown): Promise<Result<Enrollment, AppError>> {
  return runService('learning.enrollInCourse', actor, async () => {
    // 1. validate
    const parsed = EnrollInput.safeParse(raw);
    if (!parsed.success) throw E.validation(parsed.error.flatten());
    const input = parsed.data;
    if (!actor.userId) throw new AppError('unauthenticated', 'Sign in required');
    const targetUserId = input.userId ?? actor.userId;
    const now = new Date();

    return withTx(async (tx) => {
      // 2. load resources the policy needs (course must be live; cohort gives the tenant)
      const [c] = await tx.select().from(course)
        .where(and(eq(course.id, input.courseId), eq(course.status, 'published'), isNull(course.deletedAt)));
      if (!c) throw E.notFound('Course');

      let orgId: string | undefined;
      if (input.cohortId) {
        const [co] = await tx.select({ orgId: cohort.orgId }).from(cohort).where(eq(cohort.id, input.cohortId));
        if (!co) throw E.notFound('Cohort');
        orgId = co.orgId;
        const [m] = await tx.select({ id: orgMember.id }).from(orgMember)
          .where(and(eq(orgMember.organizationId, orgId), eq(orgMember.userId, targetUserId), isNull(orgMember.removedAt)));
        if (!m) throw E.forbidden('enrollment:create');            // target must belong to the org → no existence leak
      }

      // 3. authorise (student: own record; org_admin: own org)
      assertCan(actor, 'enrollment:create', { ownerId: targetUserId, orgId });

      // 4. access: free course → uniform free entitlement; otherwise an active entitlement is REQUIRED (D5)
      let access = await findCourseAccess(tx, targetUserId, c.id, now);
      if (!access && c.isFree) access = await grantFreeCourseEntitlement(tx, actor, targetUserId, c.id, now);
      if (!access) {
        throw new AppError('payment_required', 'Purchase required', { courseId: c.id }, 'payment-required');
      }

      // 5. idempotent upsert (UQ user_id+course_id)
      const inserted = await tx.insert(enrollment).values({
        userId: targetUserId, courseId: c.id, source: access.source, entitlementId: access.id,
        orgId: orgId ?? null, cohortId: input.cohortId ?? null, lastAccessedAt: now,
      }).onConflictDoNothing({ target: [enrollment.userId, enrollment.courseId] }).returning();

      let row = inserted[0];
      let created = !!row;
      if (!row) {
        const [existing] = await tx.select().from(enrollment)
          .where(and(eq(enrollment.userId, targetUserId), eq(enrollment.courseId, c.id)));
        if (!existing) throw new AppError('internal', 'Enrollment vanished');
        row = existing;
        if (existing.status === 'expired' || existing.status === 'suspended') {         // re-activation after renewal
          [row] = await tx.update(enrollment)
            .set({ status: 'active', entitlementId: access.id, lastAccessedAt: now })
            .where(eq(enrollment.id, existing.id)).returning();
          created = true;                                                               // emit again so counters/plan refresh
        }
      }

      // 6. audit only when someone else acts on the user's behalf
      if (targetUserId !== actor.userId) {
        await audit(tx, actor, { action: 'enrollment.create_for_user', targetType: 'enrollment', targetId: row!.id,
          orgId, diff: { courseId: c.id, userId: targetUserId } });
      }

      // 7. event (dedupe: one per enrollment per status epoch)
      if (created) {
        await emit(tx, 'enrollment.created',
          { enrollmentId: row!.id, userId: targetUserId, courseId: c.id, source: access.source, orgId: orgId ?? null },
          `enrollment.created:${row!.id}:${row!.status}:${row!.enrolledAt.getTime()}`);
      }
      return { ...row!, created } satisfies Enrollment;
    });
  });
}
```

### 3.3 Server action (`apps/web/app/[locale]/(learner)/app/courses/actions.ts`)

```ts
'use server';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { enrollInCourse } from '@lumen/core/learning';
import { requireActor } from '@/lib/auth/require-actor';          // reads Better Auth session via headers(); builds Actor; redirects if none
import { toActionState, type ActionState } from '@/lib/actions/result';
import { checkRateLimit } from '@/lib/rate-limit';

export async function enrollInCourseAction(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const actor = await requireActor();                              // throws redirect('/sign-in') when unauthenticated
  const limited = await checkRateLimit('write', actor);            // 60/min/user (§6.5 classes)
  if (!limited.ok) return toActionState(limited.error);

  const res = await enrollInCourse(actor, {
    courseId: formData.get('courseId'),
    ...(formData.get('cohortId') ? { cohortId: formData.get('cohortId') } : {}),
  });
  if (!res.ok) {
    if (res.error.code === 'payment_required') redirect(`/checkout?course=${String(formData.get('courseId'))}`);
    return toActionState(res.error);                               // { ok:false, code, message, fieldErrors? }
  }
  revalidatePath('/app');                                          // learner dashboard
  redirect(`/app/learn/${res.value.courseId}`);                    // resolver page redirects to first/continue lesson (outside try/catch)
}
```

### 3.4 Unit test (`packages/core/src/learning/enroll.test.ts`, Vitest + PGlite)

```ts
import { describe, it, expect, beforeEach } from 'vitest';
import { createTestDb, resetDb } from '@lumen/db/test-utils';            // PGlite + real migrations + deferred triggers
import { f } from '@lumen/db/test-factories';                             // f.user(), f.course(), f.entitlement(), f.org(), f.cohort()
import { actorFor } from '../shared/test-actors';
import { enrollInCourse } from './service';
import { outboxNames } from '../shared/test-helpers';

const db = createTestDb();
beforeEach(() => resetDb(db));

describe('enrollInCourse', () => {
  it('enrolls a student in a free course, creating a free entitlement and one event', async () => {
    const u = await f.user(db); const c = await f.course(db, { isFree: true });
    const res = await enrollInCourse(actorFor(u, ['student']), { courseId: c.id });
    expect(res.ok && res.value.created).toBe(true);
    expect(await db.query.entitlement.findMany({ where: (e, { eq }) => eq(e.userId, u.id) }))
      .toMatchObject([{ scope: 'course', courseId: c.id, source: 'free' }]);
    expect(await outboxNames(db)).toEqual(['enrollment.created']);
  });

  it('returns payment_required for a paid course without entitlement', async () => {
    const u = await f.user(db); const c = await f.course(db, { isFree: false });
    const res = await enrollInCourse(actorFor(u, ['student']), { courseId: c.id });
    expect(!res.ok && res.error.code).toBe('payment_required');
  });

  it('enrolls with an active entitlement and is idempotent', async () => {
    const u = await f.user(db); const c = await f.course(db);
    await f.entitlement(db, { userId: u.id, scope: 'course', courseId: c.id });
    const a = await enrollInCourse(actorFor(u, ['student']), { courseId: c.id });
    const b = await enrollInCourse(actorFor(u, ['student']), { courseId: c.id });
    expect(a.ok && b.ok && a.value.id === b.value.id).toBe(true);
    expect(b.ok && b.value.created).toBe(false);
    expect(await outboxNames(db)).toEqual(['enrollment.created']);      // second call emits nothing
  });

  it('ignores an expired entitlement', async () => {
    const u = await f.user(db); const c = await f.course(db);
    await f.entitlement(db, { userId: u.id, scope: 'course', courseId: c.id, endsAt: new Date(Date.now() - 1000) });
    const res = await enrollInCourse(actorFor(u, ['student']), { courseId: c.id });
    expect(!res.ok && res.error.code).toBe('payment_required');
  });

  it('forbids a student enrolling someone else', async () => {
    const a = await f.user(db); const b = await f.user(db); const c = await f.course(db, { isFree: true });
    const res = await enrollInCourse(actorFor(a, ['student']), { courseId: c.id, userId: b.id });
    expect(!res.ok && res.error.code).toBe('forbidden');
  });

  it('lets an org_admin enroll a member of their org, with an audit row; blocks other orgs', async () => {
    const org = await f.org(db); const other = await f.org(db);
    const admin = await f.user(db); const member = await f.user(db); const outsider = await f.user(db);
    await f.orgMember(db, org.id, member.id); await f.orgMember(db, other.id, outsider.id);
    const cohort = await f.cohort(db, org.id); const c = await f.course(db, { isFree: true });
    const actor = actorFor(admin, [{ role: 'org_admin', orgId: org.id }], { mfa: true });

    const ok1 = await enrollInCourse(actor, { courseId: c.id, userId: member.id, cohortId: cohort.id });
    expect(ok1.ok).toBe(true);
    expect(await db.query.auditLog.findMany()).toMatchObject([{ action: 'enrollment.create_for_user', orgId: org.id }]);

    const bad = await enrollInCourse(actor, { courseId: c.id, userId: outsider.id, cohortId: cohort.id });
    expect(!bad.ok && bad.error.code).toBe('forbidden');
  });

  it('drops org_admin powers when the session has no MFA', async () => {
    const org = await f.org(db); const admin = await f.user(db); const member = await f.user(db);
    await f.orgMember(db, org.id, member.id); const cohort = await f.cohort(db, org.id); const c = await f.course(db, { isFree: true });
    const res = await enrollInCourse(actorFor(admin, [{ role: 'org_admin', orgId: org.id }], { mfa: false }),
      { courseId: c.id, userId: member.id, cohortId: cohort.id });
    expect(!res.ok && res.error.code).toBe('forbidden');
  });

  it('404s for unpublished, deleted or unknown courses; 422 for malformed input', async () => {
    const u = await f.user(db); const draft = await f.course(db, { status: 'draft', isFree: true });
    expect((await enrollInCourse(actorFor(u, ['student']), { courseId: draft.id }))).toMatchObject({ ok: false, error: { code: 'not_found' } });
    expect((await enrollInCourse(actorFor(u, ['student']), { courseId: 'nope' }))).toMatchObject({ ok: false, error: { code: 'validation' } });
  });
});
```

Test conventions: every service has (a) happy path, (b) forbidden for each role that must *not* pass, (c) validation failure, (d) idempotent replay, (e) event/audit assertions. `actorFor(user, roles, { mfa })` builds an `Actor` the same way `resolveActor` does (including the 2FA drop rule).

---

## 4. Service catalogue

Notation: **Input** = zod schema name + essential fields (all `.strict()`); **Out** = `Result<…>` success value; **Perm** = permission string(s) + scope (§9); **Effects** = DB side effects, `audit` (A), outbox events (→). `S` = server action wrapper exists (`<name>Action`); `R` = also exposed as `/api/v1` resource (P3); `J` = invoked by Inngest. Unless noted, tx isolation is *read committed*.

### 4.1 identity (`packages/core/src/identity`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `getMyProfile` S R | — | `ProfileDto` | `user:read` own | — |
| `updateProfile` S R | `UpdateProfileInput {displayName?, locale?, timezone?, country?, targetExamId?, targetScore?, examDate?, dailyGoalMinutes?, marketingOptIn?}` | `ProfileDto` | `user:update` own | validates `ageBand` rule (minor ⇒ marketing false). A on `marketingOptIn` change → `user.profile_updated` |
| `completeOnboarding` S | `OnboardingInput {ageBand, locale, targetExamId, targetScore, examDate, dailyGoalMinutes, consents[]}` | `ProfileDto` | `user:update` own | inserts `consent_record`s; under-13 ⇒ error `precondition_failed` (blocked); 13–17 ⇒ starts guardian flow → `user.onboarded` |
| `setContactPhone` S | `{phone}` | `{masked}` | `user:update` own | encrypts (`contact_phone_enc`, hash) |
| `inviteGuardian` S R | `{guardianEmail, relationship?, canPay?}` | `GuardianLinkDto` | `guardian_link:manage` own | creates pending link + token; → `guardian.invited` (email) |
| `respondGuardianInvite` S | `{token, accept}` | `GuardianLinkDto` | signed-in guardian (token holder) | status → `granted|declined`; sets `guardian_user_id`, grants `guardian` role (A) → `guardian.link_granted` |
| `revokeGuardianLink` S | `{linkId}` | void | `guardian_link:manage` own\|lnk | status `revoked`; A → `guardian.link_revoked` |
| `listMyGuardianLinks` / `listMyStudents` S | — | `GuardianLinkDto[]` | `guardian_link:manage` | — |
| `recordConsent` S | `{kind, granted, documentVersion}` | void | `user:update` own | insert `consent_record`; A for `ai_processing`, `marketing` |
| `listSessions` / `revokeSession` / `revokeAllSessions` S | `{sessionId?}` | `SessionDto[]` | `user:update` own | wraps Better Auth; A |
| `requestDataExport` S | — | `DsrDto` | `user:export_data` own | re-auth ≤ 10 min; `data_subject_request`; A → `privacy.export_requested` |
| `requestDeletion` S | `{confirmText}` | `DsrDto` | `user:delete` own | 14-day cooling-off; A → `privacy.deletion_requested` |
| `cancelDeletion` S | `{requestId}` | `DsrDto` | `user:delete` own | A |
| `startImpersonation` | `{userId, reason(min 15 chars)}` | `{sessionToken}` | `user:impersonate` | creates session with `impersonated_by`, `readOnly`, **15 min** (one renewal with fresh reason; resolves 27 S5); **A (mandatory reason)** → `support.impersonation_started` |
| `stopImpersonation` | — | void | impersonator | A |
| `banUser` / `unbanUser` | `{userId, reason, expiresAt?}` | void | `user:ban` | revokes sessions; A |
| `anonymizeUser` J | `{userId}` | `ErasureReport` | system (`privacy.erase`) | §05-7.4; A |
| `adminSearchUsers` | `{q, role?, cursor}` | `Page<UserRowDto>` (masked per scope) | `user:read` (`msk`) | A when unmasked field revealed (`revealField`, reason required) |

### 4.2 rbac (`packages/core/src/rbac`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `resolveActor` (adapter helper) | request/session | `Actor` | — | loads `user_role` (active), drops roles that require 2FA (`grader`+, `instructor`, `org_admin`, `counsellor`) when `!session.mfaVerified`; no audit |
| `grantRole` | `{userId, role, orgId?, reason}` | `UserRoleDto` | `role:grant` (`lim` for admin) or `role:grant_privileged` for `admin|super_admin` | rules R18 (05 §6); mirrors `org_member.role`; revokes sessions of target (rotation); A → `role.granted` |
| `revokeRole` | `{userRoleId, reason}` | void | `role:revoke` / `role:grant_privileged` | last-super_admin guard; A → `role.revoked` |
| `listUserRoles` | `{userId}` | `UserRoleDto[]` | `user:read` | — |
| `approveInstructor` / `suspendInstructor` | `{userId, reason?}` | `InstructorProfileDto` | `instructor:approve` (admin) | `instructor_profile.status`, grants/revokes `instructor`; A → `instructor.approved` |
| `requireTwoFactorForStaff` (Better Auth hook) | — | — | — | blocks sign-in completion for 2FA-required roles until enrolled; first login routes to `/sign-in/2fa-setup` |

### 4.3 organizations (`packages/core/src/organizations`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `createOrganization` | `{name, slug, kind, country, billingEmail, ownerUserId}` | `OrgDto` | `org:create` (admin) | creates org + `org_admin` role for owner; A → `org.created` |
| `getOrganization` / `updateOrganization` S | `{orgId, …}` | `OrgDto` | `org:read` / `org:update` org | A on billing/tax changes |
| `inviteOrgMember` S | `{orgId, email, externalRef?}` | `OrgInvitationDto` | `org_member:manage` org | → `org.member_invited` (email) |
| `acceptOrgInvite` S | `{invitationId}` | `OrgMemberDto` | invitee (email match) | adds `org_member`; → `org.member_joined` |
| `bulkImportMembers` S | `{orgId, csvR2Key}` | `{queued: n}` | `org_member:manage` org | Inngest `organizations.import-members` (≤ 5 000 rows, row-level report) |
| `removeOrgMember` S | `{orgId, userId}` | void | `org_member:manage` org | releases seats, leaves cohorts; A → `org.member_removed` |
| `createCohort` / `updateCohort` / `archiveCohort` S | `{orgId, name, examId?, startsOn?, endsOn?}` | `CohortDto` | `cohort:manage` org | A |
| `addCohortMembers` / `removeCohortMember` S | `{cohortId, userIds[]}` | `{added}` | `cohort:manage` org | all users must be org members |
| `allocateSeat` S | `{orgId, seatEntitlementId, userId, cohortId?}` | `SeatAllocationDto` | `seat:allocate` org | **serializable**; `FOR UPDATE` seat entitlement; R21; creates child `entitlement` (`source='org_seat'`, same window) → `org.seat_allocated` |
| `releaseSeat` S | `{allocationId}` | void | `seat:allocate` org | revokes child entitlement; → `org.seat_released` |
| `assignToCohort` S | `{orgId, cohortId?, kind:'course'\|'test_form', courseId?/testFormId?, opensAt?, dueAt?}` | `OrgAssignmentDto` | `org_assignment:manage` org | creates `org_assignment`; enrolls members who have entitlement; → `org.assignment_created` (notify) |
| `getOrgDashboard` S R | `{orgId, range}` | `OrgDashboardDto` | `org_analytics:read` org | reads `mv_cohort_progress` |
| `exportOrgReport` S | `{orgId, kind, range}` | `{downloadUrl}` | `org_analytics:read` org | Inngest builds CSV to R2; A (export) |

### 4.4 catalog / content (`packages/core/src/catalog`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `listCourses` S R | `{examSlug?, subjectSlug?, q?, level?, cursor, limit}` | `Page<CourseCardDto>` | `course:read_published` | — |
| `getCourseLanding` S R | `{slug}` | `CourseLandingDto` (published version, free-preview lessons, rating) | `course:read_published` | — |
| `getCourseOutline` S R | `{courseId}` | `OutlineDto` (sections/lessons metadata + per-user progress) | `lesson:view` ent | — |
| `getLesson` S R | `{courseId, lessonKey, locale}` | `LessonDto` (content, signed media) | `lesson:view` (`pub` if `is_free_preview`) | issues Bunny token URL (§5.4); no events |
| `createCourse` S | `{title, examId?, subjectId?, language, level}` | `CourseDto` | `course:create` | creates course + v1 draft; A → `course.created` |
| `createDraftVersion` S | `{courseId}` | `CourseVersionDto` | `course:update` own | clones published version (sections, lessons, content; same `stable_key`s); fails if open draft exists |
| `updateCourseMeta` / `upsertSection` / `reorderSections` / `upsertLesson` / `reorderLessons` / `deleteLesson` / `upsertLessonContent` S | per-entity zod; `LessonContentInput {lessonId, locale, body: TiptapDoc}` | DTOs | `course:update` own | validates Tiptap schema (allow-listed nodes), sanitises; trigger blocks non-draft |
| `attachMedia` S | `{lessonId, mediaAssetId}` | void | `course:update` own | asserts media owned by actor/ready |
| `submitCourseForReview` S | `{courseVersionId, changeNote}` | `CourseVersionDto` | `course:submit_review` own | pre-publish lint (bn titles, ≥1 free preview if paid, durations); → `course.submitted` |
| `reviewCourseVersion` S | `{courseVersionId, decision:'approve'\|'request_changes', notes}` | `CourseVersionDto` | `course:publish` | `request_changes` → draft; A → `course.review_decided` |
| `publishCourseVersion` S | `{courseVersionId}` | `CourseDto` | `course:publish` | **serializable**; old published → archived; sets `course.published_version_id`, denormalised fields, `published_at`; creates/updates `product`; A → `course.published` (search index, sitemap, notify enrolled) |
| `archiveCourse` / `unarchiveCourse` S | `{courseId, reason}` | void | `course:archive` | A → `course.archived` (existing entitlements keep access) |
| `deleteCourse` | `{courseId, reason}` | void | `course:delete` (admin) | soft delete only if no entitlements; A |
| `listMyCourses` S | `{status?}` | `CourseRowDto[]` | `course:read_draft` own | — |
| `manageCourseInstructors` S | `{courseId, instructorProfileId, role, revenueShareBps?}` | void | `course:update` own\|`*`; share only `product:manage` | A |
| `registerMediaUpload` | via `/api/uploads/presign` | `PresignDto` | `media:upload` | creates `media_asset(pending_upload)` |
| `confirmMediaUpload` | `{mediaAssetId}` | `MediaDto` | `media:upload` own | HEAD check size/type; → `media.uploaded` (virus scan / probe job) |
| `handleBunnyVideoEvent` J | `{videoGuid, status}` | void | system | updates `media_asset` status/duration/captions → `media.ready` |
| `manageTaxonomy` (`upsertExam`, `upsertSubject`, `upsertTag`) S | per entity | DTO | `taxonomy:manage` | A |
| `upsertCmsPage` / `publishCmsPage` S | `{kind, slug, locale, title, body, seo}` | `CmsPageDto` | `cms_page:manage` | → `cms.page_published` (revalidate tag) |
| `updateInstructorProfile` S | `{headline?, bioEn?, bioBn?, slug?}` | `InstructorProfileDto` | `instructor_profile:update` own | — |
| `searchCatalog` S R | `{q, cursor}` | `Page<SearchHitDto>` | `course:read_published` | trigram + tsvector |

### 4.5 assessment — question bank & test forms (`packages/core/src/assessment`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `createStimulus` / `supersedeStimulus` S | `{kind, title, body, mediaAssetId?, transcript?, license, licenseRef?}` | `StimulusDto` | `question:create` | licence rule (D6); supersede copies to new row, never edits locked |
| `createQuestion` S | `{examId, skill, type, content, answerKey?, explanation?, stimulusId?, difficulty, estTimeSeconds, maxPoints, skillTags[]}` | `QuestionDto` (+ v1 draft) | `question:create` | `content`/`answerKey` validated by per-type zod union (`QuestionContentSchemas[type][schemaVersion]`); generates `code` |
| `updateQuestionDraft` S | `{questionVersionId, patch}` | `QuestionVersionDto` | `question:update` own\|`*` | only `draft`; trigger enforces immutability otherwise |
| `createQuestionVersion` S | `{questionId}` | `QuestionVersionDto` | `question:update` own\|`*` | clones current published into new draft |
| `submitQuestionForReview` S | `{questionVersionId}` | void | `question:submit_review` | → `question.submitted` |
| `publishQuestionVersion` S | `{questionVersionId}` | `QuestionVersionDto` | `question:publish` | locks stimulus (`locked_at`); updates `question.current_version_id`; computes `content_hash`; A → `question.published` |
| `retireQuestionVersion` S | `{questionVersionId, reason}` | void | `question:publish` | status `retired`; blocked if it is the only version in a **published** form (warn list) ; A |
| `listQuestions` S R | `{examId?, skill?, type?, difficulty?, tag?, status?, q?, cursor}` | `Page<QuestionRowDto>` | `question:read_bank` (own scope filters by owner) | — |
| `getQuestionForAuthoring` S | `{questionId}` | `QuestionDetailDto` (incl. key, stats) | `question:read_bank` | — |
| `previewQuestion` S | `{questionVersionId}` | `ClientQuestionDto` | `question:read_bank` | uses the same DTO mapper as delivery |
| `upsertQuestionSet` / `setQuestionSetItems` S | `{title, kind, stimulusId?, items[]}` | `QuestionSetDto` | `question_set:manage` | — |
| `createTestForm` S | `{code, examId, kind, titleEn, titleBn?, isFree?, allowRetake?, maxAttempts?}` | `TestFormDto` (+ v1 draft) | `test_form:manage` | A |
| `upsertTestFormSection` / `setTestFormItems` / `setAdaptiveRules` S | per entity | DTO | `test_form:manage` | draft only |
| `validateTestFormVersion` S | `{testFormVersionId}` | `ValidationReport` | `test_form:manage` | R17 checks; pure |
| `publishTestFormVersion` S | `{testFormVersionId}` | `TestFormDto` | `test_form:publish` | **serializable**; runs R17; previous published → retired (running attempts stay pinned); sets `test_form.published_version_id`; A → `test_form.published` |
| `getTestFormLanding` S R | `{code}` | `TestFormLandingDto` (sections, durations, access state) | `test_form:read` pub\|ent | — |
| `getClientSectionPayload` (internal to exam engine) | `{attemptSectionId}` | `ClientSectionDto` | via `attempt:participate` | strips `answerKey`, `explanation`, `irtB` |
| `getQuestionExplanations` S R | `{attemptId}` | `ExplanationDto[]` | `attempt:read` own | only after attempt `submitted|scored` |
| `refreshQuestionStats` J | `{since}` | `{updated}` | system | writes `question_stat` |

### 4.6 exam engine (`packages/core/src/exam-engine`) — all invoked by `/api/exam/*` handlers (§5.6)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `startAttempt` | `{testFormCode, mode?, cohortId?, idempotencyKey}` | `AttemptStateDto {resumed}` | `attempt:start` (`pub` free forms, `ent` otherwise) | R1/R2; picks published version; consumes `entitlement_use` for test packs (once per form); creates attempt + all fixed `attempt_section` rows (adaptive alternatives created at routing); sets `expires_at`; event `attempt_started`; → `attempt.started` |
| `getAttemptState` | `{attemptId}` | `AttemptStateDto` | `attempt:participate` own | lazily expires overdue sections (R4) |
| `startSection` | `{attemptId, position}` | `SectionStateDto {startedAt, endsAt, serverTime}` | `attempt:participate` own | requires previous section finished (and attempt not paused); sets `started_at`, `ends_at`; schedules `exam.expire-section`; event |
| `getSection` | `{attemptId, position}` | `ClientSectionDto` (items + stimuli + saved answers, no keys) | `attempt:participate` own | only started/running or already finished (read-only review if form allows) |
| `saveResponses` | `{attemptId, sectionPosition, batchId, changes[≤50]}` | `SaveResultDto` | `attempt:participate` own | §10.1 upsert (05); R4/R5; per-item validation against question type → `rejected` entries; writes `time_spent_ms`; never emits domain events |
| `recordNavigation` | `{attemptId, sectionPosition, fromItemId?, toItemId}` | `{allowed}` | `attempt:participate` own | enforces `allow_back_navigation`; stores `navigated`/`item_viewed` event; updates resume pointer |
| `claimAttemptSession` | `{attemptId, deviceId, takeover?}` | `{epoch}` | `attempt:participate` own | locks attempt row; ends stale/superseded `attempt_session`, inserts `epoch+1`; rate-limited 1 takeover / 30 s |
| `saveAnnotations` | `{attemptId, sectionPosition, epoch, changes[≤50]}` | `SaveResultDto` | `attempt:participate` own | upserts `attempt_annotation` under the same R4/R5 rules as `saveResponses` |
| `recordEvents` | `{attemptId, events[≤100]}` | `{accepted}` | `attempt:participate` own | inserts `attempt_event` (whitelisted types, size-capped meta) |
| `heartbeat` | `{attemptId, sectionPosition, visibility, online, lastSeq}` | `HeartbeatDto {serverTime, endsAt, remainingMs, serverLastSeq, commands[]}` | `attempt:participate` own | updates `last_activity_at` (throttled); detects gaps (`heartbeat_gap` event when > 60 s) |
| `submitSection` | `{attemptId, sectionPosition, finalChanges?[], idempotencyKey}` | `SubmitSectionDto {next}` | `attempt:participate` own | accepts until `ends_at + 30 s`; applies final batch; status `submitted`; computes objective raw score; **adaptive routing** (creates target `attempt_section`, writes `chosen_tier`+`routing_basis`); → `attempt.section_submitted` |
| `pauseAttempt` / `resumeAttempt` | `{attemptId}` | `AttemptStateDto` | `attempt:participate` own | pause only between sections where next section `is_breakable` (practice mode: also mid-section, `resume` shifts `ends_at`); max 24 h; resume restores; event |
| `submitAttempt` | `{attemptId, idempotencyKey}` | `{status, scoringStatus}` | `attempt:participate` own | closes running section (as submitted/expired), sets `submitted_at`; → `attempt.submitted` |
| `expireSection` J | `{attemptSectionId}` | void | system | marks `expired`; auto-advances; if last, submits attempt → `attempt.submitted` |
| `expireAttempts` J (cron) | — | `{n}` | system | `expires_at` passed → `expired` + submit what exists |
| `scoreAttempt` J | `{attemptId}` | `AttemptScoreDto[]` | system | objective scoring via pure scorers; writes `attempt_response.is_correct/points_awarded`, `attempt_score` rows (`is_complete=false` if writing/speaking pending); → `attempt.scored` |
| `getAttemptResult` | `{attemptId}` | `ResultDto` (labelled **estimated**) | `attempt:read` own\|lnk\|asg\|org\|msk | 202 until scored; guests: summary only until sign-up (`linkAnonymousAttempt`) |
| `listMyAttempts` S R | `{testFormCode?, cursor}` | `Page<AttemptRowDto>` | `attempt:read` own | — |
| `grantAccommodation` | `{attemptId?, userId?, sectionPosition?, extraSeconds ≤ 3600, multiplier ∈ {1.25, 1.5, 2.0}?, reason}` | `AttemptStateDto` | `attempt:grant_accommodation` / `accommodation:grant` (support `*`, org_admin `org`) | **P1: support-granted on documented request (D12 C18)**, stored as `user_profile.accommodation_multiplier` and applied to every future `ends_at` computation; P2 adds learner self-serve `requestAccommodation` (`accommodation:request`) with support review;  extends `ends_at`/`extra_seconds`; event `time_extended`; **A**; → `attempt.time_extended` |
| `requestSectionVoid` S R | `{attemptId, sectionPosition, idempotencyKey}` | `AttemptStateDto` | `attempt:void_self` own | **Self-serve "I lost connection" flow (GA-007, D12 C30)**: exam mode only; allowed **once per attempt**; requires `heartbeat_gap` > 2 min covering the interruption (server evidence, not a client claim); delegates to `voidSection`; rate-limited (1 / attempt, 3 / 30 d / user); event `section_voided`; **A**; → `attempt.voided` |
| `voidSection` | `{attemptId, sectionPosition, reason, reissue: boolean}` | `AttemptStateDto` | `attempt:void` (support `cap`, admin `✓`) or system via `requestSectionVoid` | marks the `attempt_section` `voided`, excludes its responses from scoring/stats, creates a fresh re-issued section (new `ends_at` = full duration, same pinned `question_version_id`s, exposure not double-counted) when `reissue`; support path: reason + ticket id, cap 2 per user / 90 d, otherwise escalate to admin; **A** → `attempt.voided` |
| `voidAttempt` | `{attemptId, reason, refundUse: boolean}` | void | `attempt:void` (support `cap` per 27 S5 resolution, admin `✓`) | whole attempt excluded from stats and the learner's estimate; `refundUse` returns the `entitlement_use` for test packs; support may void only under the GA-007 rule or a content error, admin for everything else; **A** (mandatory reason) → `attempt.voided` |
| `grantResit` | `{attemptId, reason}` | `{entitlementUseRestored}` | `attempt:grant_resit` (support `cap`, admin) | restores one full-mock use after a verified technical failure; cap 2 / 90 d (27 S4); **A** → `attempt.credit_granted` |
| `creditMock` | `{userId, testFormId?, reason}` | `{credited}` | `attempt:credit_mock` (support `cap`, finance, admin) | grants one extra mock use (not cash); **A** → `attempt.credit_granted` |
| `rescoreAttempts` J | `{questionId, versionId, reason}` | `{n}` | `attempt:void` (admin) / system on `question.corrected` | re-scores attempts affected by a corrected answer key (GA-044), keeps both scores in history; → `attempt.rescored`, `question.corrected` |
| `linkAnonymousAttempt` (Better Auth `onLinkAccount`) | `{anonymousUserId, userId}` | void | system | re-parents attempts/evaluation requests |

### 4.7 evaluation (`packages/core/src/evaluation`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `requestEvaluation` S R | `{kind, questionVersionId?, attemptResponseId?, text?, recordingIds?[], mode?, locale, idempotencyKey}` | `EvaluationRequestDto` | `evaluation:request` own | requires `consent ai_processing`; word-count bounds (Writing T1 ≥ 20, T2 ≥ 50, ≤ 1 000; AWA ≤ 1 200); rate limit per the **canonical AI table in 09 section 10.2** (10 requests/h and 2 concurrent per user; daily ceiling Free 1, Core 3, Pass 4, Plus/Live/Mentor 6 per 17; no 30/day constant); credits are integers (D12 C1: writing 1, one speaking part 1, full speaking test 2, AWA 1); **debits 1 credit atomically** (R15); snapshot of text; → `evaluation.requested` |
| `attachSpeakingRecording` | `{recordingId, part, attemptResponseId?}` | `RecordingDto` | `upload:presign` own | verifies R2 object (size, duration ≤ 5 min, mime allow-list) |
| `runAiEvaluation` J | `{evaluationRequestId}` | `EvaluationResultDto` | system | LLM call (`packages/ai`) with rubric prompt, zod-validated JSON, retries/fallback model; stores `evaluation_result(source='ai', is_final=true unless mode ai_then_human)`; sets band range; updates `attempt_score`; → `evaluation.completed` or `evaluation.failed` (credit reversed) |
| `transcribeRecording` J | `{recordingId}` | `RecordingDto` | system | Deepgram Nova-3 (word timestamps; fallback whisper-1); stores transcript + words; → `recording.transcribed` |
| `getEvaluation` S R | `{evaluationRequestId}` | `EvaluationDto` | `evaluation:read` own\|lnk\|asg\|msk | — |
| `listMyEvaluations` S R | `{kind?, cursor}` | `Page<EvaluationRowDto>` | `evaluation:read` own | — |
| `requestHumanReview` S | `{evaluationRequestId}` | `EvaluationRequestDto` | `evaluation:request` own | charges `human_review` credits (priced product `ai_credits`/future); status `awaiting_review`; → `evaluation.human_requested` |
| `assignGrader` | `{evaluationRequestId, graderUserId, dueAt}` | `GraderAssignmentDto` | `evaluation:assign` | grader must hold `grader` + MFA; A → `grader.assigned` |
| `autoAssignGraders` J | — | `{n}` | system | load-balanced by open queue; SLA 48 h |
| `listGraderQueue` S | `{status?, cursor}` | `Page<AssignmentRowDto>` | `evaluation:grade` asg | — |
| `submitGrading` S | `{assignmentId, criterionScores, overallBand, feedback, rationale}` | `EvaluationResultDto` | `evaluation:grade` asg | inserts human result; if differs from AI by ≥ 1.0 band requires rationale; `is_final=true`; request `completed`; A → `evaluation.completed` |
| `overrideBand` S | `{evaluationRequestId, newBand, rationale}` | `EvaluationResultDto` | `evaluation:override_band` asg | new `evaluation_result(source='human', overrides_result_id)`; supersedes final; A → `evaluation.overridden` |
| `getCreditBalance` S R | — | `{balance}` | `ai_credit:read` own | — |
| `listCreditLedger` S | `{cursor}` | `Page<LedgerRowDto>` | `ai_credit:read` own\|msk\|`*` | — |
| `adjustCredits` | `{userId, delta, reason}` | `{balance}` | `ai_credit:grant` (finance) | ledger + balance; A → `credits.adjusted` |
| `grantCreditsForOrderItem` J | `{orderItemId}` | void | system | idempotent key `grant:${orderItemId}:${grantId}` |
| `deleteRecording` S | `{recordingId}` | void | `evaluation:read` own | deletes R2 audio now, sets `audio_deleted_at`; default retention **90 days** after completion (`speaking_recording.audio_delete_after`, D12 C6), longer only with explicit `research_use` consent or an open dispute (31) |
| `openScoreDispute` S | `{evaluationRequestId, reason}` | `DisputeDto` | `dispute:open` own | window 30 days; one free dispute review per month **[DECIDE]**; routes to a `grader` (or second AI pass) and returns the credit when the gap is >= 1.0 band (27 S6); → `dispute.opened` |

### 4.8 learning (`packages/core/src/learning`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `enrollInCourse` S R | `EnrollInput` (§3) | `Enrollment` | `enrollment:create` own\|org | → `enrollment.created` |
| `listMyEnrollments` S R | `{status?}` | `EnrollmentRowDto[]` | `enrollment:read` own | joins `course_progress` |
| `recordLessonProgress` S R | `{courseId, lessonKey, positionMs?, watchedMsDelta?, completed?}` | `LessonProgressDto` | `progress:write` own | requires entitlement; throttled (≤ 1/10 s per lesson); on completion → `lesson.completed`; never regresses `completed` |
| `getCourseProgress` S R | `{courseId, userId?}` | `CourseProgressDto` | `progress:read` own\|lnk\|org\|msk | — |
| `recomputeCourseProgress` J | `{userId, courseId}` | void | system | recompute from `lesson_progress` vs published outline (`is_required` lessons) → `course.completed` when 100 % |
| `getLearnerHome` S | — | `LearnerHomeDto` (continue, streak, next plan items, recent scores, credits) | `progress:read` own | — |
| `createStudyPlan` S | `{examId, targetScore, examDate, weeklyMinutes}` | `StudyPlanDto` | `study_plan:manage` own | **P1: generated read-only plan from onboarding** (exam date, target, level; D12 C5), template or AI generation (Inngest) → `studyplan.created`; adaptive rescheduling and calendar sync are P2 |
| `updateStudyPlanItem` S | `{itemId, status}` | `StudyPlanItemDto` | `study_plan:manage` own | — |
| `replanStudyPlan` J (P2) | `{planId}` | void | system | after diagnostic/mock score → `studyplan.replanned` |
| `awardXp` J | `{userId, type, sourceId, points}` | void | system | idempotent insert, updates `streak` (timezone-aware) → `streak.updated` |
| `upsertNote` / `deleteNote` / `listNotes` S | `{courseId, lessonKey, body, videoTimestampMs?}` | `NoteDto` | `note:manage` own | — |
| `toggleBookmark` / `listBookmarks` S | `{courseId+lessonKey \| questionId}` | `{bookmarked}` | `note:manage` own | — |
| `getGuardianDashboard` S | `{studentId}` | `GuardianDashboardDto` | `progress:read` lnk | read-only; consent re-checked each call |
| `issueCertificate` (**P1**, D12 C4) J | `{userId, courseId}` | `CertificateDto` | system | PDF certificate + public verify page `/verify/[code]` (unguessable >= 128-bit code, never the UUID, C11); Open Badges 3.0 / LinkedIn polish P3 |

### 4.9 commerce (`packages/core/src/commerce`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `resolvePriceRegion` (internal) | `{billingCountry, ipCountry?}` | `'BD'\|'A'\|'B'\|'C'` | system | **D12 C16/C25**: region derives from the **billing country** (MoR / checkout form) with IP only as a hint for what to display before checkout; BD users always see BDT via SSLCommerz; invariant checked at `setPrice`: region C price >= BD price converted to USD, B ~ 1.5x C, A ~ 2.5x C; `compare_at_minor` is accepted only if that price was actually charged for >= 28 consecutive days within the last 90 (C14), else stored null |
| `listProducts` S R | `{kind?, examId?, currency, region?}` | `ProductCardDto[]` | `product:read` | picks active price by `price.region` + currency (price rows carry `region` ∈ BD, A, B, C) |
| `quoteCart` S | `{items[{productId, qty}], couponCode?, currency, payForUserId?}` | `QuoteDto` | `product:read` | pure; server-side prices; validates coupon |
| `createOrder` S | `{items[], couponCode?, currency, payForUserId?, orgId?, billing{…}, idempotencyKey}` | `OrderDto {status:'pending', expiresAt}` | `order:create` own\|lnk\|org | re-prices server-side; reserves coupon (R13); freezes `product_snapshot`; recipient = payForUserId (guardian needs `can_pay`); 30 min expiry; A for org/guardian |
| `startPayment` S | `{orderId, provider:'sslcommerz'\|'paddle'\|'stripe', returnUrl}` | `{redirectUrl}` | `order:create` own\|lnk\|org | Turnstile verified at action; creates `payment(initiated, merchant_ref)`; provider session (SSLCommerz `gw/api` init / Paddle transaction / Stripe Checkout); rate limit 10/min |
| `handleSslcommerzCallback` J/route | `{formFields, source:'ipn'\|'success'}` | `PaymentOutcome` | system | §5.2; verification R11 |
| `handlePaddleEvent` / `handleStripeEvent` J | provider event | void | system | idempotent via `webhook_event` |
| `markOrderPaid` (internal) | `{orderId, paymentId}` | `OrderDto` | system | CAS (R10); coupon → `applied`; → `order.paid` |
| `fulfilOrder` J | `{orderId}` | void | system | grants entitlements per `product_grant`/bundle (R7, `grant_key`), credits, seats; enrolls (course); issues invoice; → `order.fulfilled`, `entitlement.granted` |
| `cancelOrder` S | `{orderId}` | void | `order:cancel` own\|lnk\|`*` | only `pending`; releases coupon; → `order.cancelled` |
| `expireOrders` J (cron) | — | `{n}` | system | → `order.expired` |
| `getOrder` / `listMyOrders` S R | `{orderId}` / `{cursor}` | `OrderDto` | `order:read` own\|lnk\|msk\|`*` | — |
| `requestMoneyBack` S | `{orderId, orderItemId?}` | `RefundDto` | `refund:request` own\|lnk | **7-day no-questions money-back for self-paced digital products (D12 C13b)**: eligible iff within 7 days AND max(% lessons completed, % included AI credits used, % included mocks taken) < 20% (C28 measure) AND <= 1 full mock taken; no reason required; alert when > 25 included AI credits were consumed on a refunded order (34 OQ-5); physical books follow the shipping policy below; → `refund.requested` |
| `requestRefund` S | `{orderId, orderItemId?, reason}` | `RefundDto` | `refund:request` own\|lnk\|`*` | computes eligibility (R14, C28 measure); `within_policy` verdict; A for staff; → `refund.requested` |
| `approveRefund` / `rejectRefund` | `{refundId, note, overridePolicy?}` | `RefundDto` | `refund:approve` (finance) | A mandatory; approval enqueues execution → `refund.approved` |
| `executeRefund` J | `{refundId}` | void | system | provider refund API (idempotent key = refund.id); on success: revoke entitlements, reverse credits, credit-note invoice, order status; → `refund.succeeded` / `refund.failed` |
| `grantEntitlement` | `{userId, scope, ref, endsAt, source:'admin_grant'\|'support_extension'\|'promo', reason}` | `EntitlementDto` | `entitlement:grant` (support `7d`, finance `*`) | support: `ends_at ≤ start + 7 d`, ≤ 2 per 30 d (R7); A mandatory → `entitlement.granted` |
| `revokeEntitlement` | `{entitlementId, reason}` | void | `entitlement:revoke` | re-chain (R7); A → `entitlement.revoked` |
| `listMyEntitlements` S R | — | `EntitlementDto[]` | `entitlement:read` own\|lnk | — |
| `expireEntitlementsNotice` J (cron) | — | `{n}` | system | T-7/T-1 reminders → `entitlement.expiring` |
| `renewSubscription` J | provider event | void | system | Paddle/Stripe renewals append entitlement (R7) → `subscription.renewed` |
| `upsertProduct` / `setProductGrants` / `setBundleItems` | per entity | DTO | `product:manage` | A → `product.updated` |
| `setPrice` | `{productId, currency, priceBook, amountMinor, validFrom, validTo?}` | `PriceDto` | `price:manage` | exclusion constraint conflict ⇒ `conflict`; A |
| `createCoupon` / `updateCoupon` / `pauseCoupon` | per entity | `CouponDto` | `coupon:manage` | A |
| `issueInvoice` J/S | `{orderId}` | `InvoiceDto` | `invoice:issue` / system | gap-free number (R20); PDF to R2; → `invoice.issued` |
| `getInvoicePdf` S | `{invoiceId}` | signed URL (5 min) | `invoice:read` own\|lnk\|org\|`*` | A when staff |
| `getRevenueReport` S | `{range, groupBy}` | `RevenueReportDto` | `report:revenue` own(instructor)\|`*` | — |
| `exportVat` S | `{fiscalYear, month}` | `{downloadUrl}` | `report:vat_export` | CSV; A |
| `computeInstructorPayouts` J (P3) / `approvePayout` / `markPayoutPaid` | `{period}` / `{payoutId}` | `PayoutDto` | system / `payout:approve` (**admin**, step-up 2FA; maker-checker with finance's `payout:prepare`, 30) | A → `payout.approved`. P1-P2 payouts are the manual monthly `finance.*` statements in 4.16 |
| `createShipment` / `markShipped` / `confirmDelivered` / `recordCodCollected` (`physical_book`, 17) | `{orderItemId, carrier?, trackingNo?}` / `{shipmentId}` | `ShipmentDto` | `order:read` `*` + `product:manage` (finance, admin) | physical books are shipped products (D5): address captured at checkout, COD allowed (BD), delivery windows per Digital Commerce Guidelines 2021, return/refund rules differ from digital (no 7-day digital money-back once shipped); COD cash reconciliation feeds 30; → `order.shipment_updated` |
| `createAffiliate` / `attributeOrderToAffiliate` (P2) | | | `coupon:manage` / system | |

### 4.10 community (`packages/core/src/community`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `createThread` S | `{courseId, lessonKey?, title, body}` | `ThreadDto` | `thread:create` ent | sanitise markdown; spam throttle (5/h); → `thread.created` (notify instructors) |
| `listThreads` S R | `{courseId, lessonKey?, status?, cursor}` | `Page<ThreadRowDto>` | `thread:read` ent\|own | — |
| `createAnswer` S | `{threadId, body}` | `AnswerDto` | `answer:create` | sets `is_staff_answer`; thread → `answered`; → `answer.created` |
| `acceptAnswer` S | `{threadId, answerId}` | void | thread author or `thread:moderate` | — |
| `moderateThread` / `moderateAnswer` S | `{id, action:'hide'\|'unhide'\|'pin'\|'delete', reason}` | void | `thread:moderate` own(course)\|`*` | A for staff |
| `upsertReview` S | `{courseId, rating, title?, body?}` | `ReviewDto` | `review:create` ent | requires ≥ 20 % progress; `is_verified_purchase` from order link; recompute `course.rating_*` → `review.created` |
| `moderateReview` S | `{reviewId, status, reason}` | void | `review:moderate` | A |
| `createReport` S | `{targetType, targetId, reason, details?}` | `ReportDto` | `report:create` | dedupe; auto-hide at 3 distinct reports (thread/answer) → `report.created` |
| `resolveReport` S | `{reportId, status, note}` | void | `report:resolve` | A |

### 4.11 notifications (`packages/core/src/notifications`)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `notify` (internal) | `{userId, category, type, params, dedupeKey}` | void | system | respects preferences (security/transactional always on; marketing needs opt-in and adult), inserts `notification`, queues email via `sendEmail` |
| `sendEmail` J | `{templateKey, userId?, to?, params, dedupeKey}` | `EmailLogDto` | system | skips placeholder emails; `email_log` unique `dedupe_key`; Resend; suppression list on bounce |
| `listNotifications` / `markRead` / `markAllRead` S R | `{cursor}` / `{ids}` | | `notification:manage_own` own | — |
| `getPreferences` / `setPreference` S R | `{category, channel, enabled}` | | `notification:manage_own` own | A for marketing toggles |
| `handleResendEvent` J | provider event | void | system | delivered/bounced/complained → `email_log`, suppress on hard bounce |

### 4.12 platform (audit, system, uploads)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `searchAuditLog` S | `{actorId?, action?, targetType?, targetId?, range, cursor}` | `Page<AuditRowDto>` | `audit:read` (`sub` for finance = `order|payment|refund|invoice|payout|entitlement|coupon|product|price` targets; support = own actions) | — |
| `verifyAuditChain` J | `{days}` | `{ok}` | system | alerts Sentry on mismatch |
| `setFeatureFlag` S | `{key, enabled, rolloutPct, rules}` | `FlagDto` | `system:flags` | A → `flag.changed` |
| `listDeadLetters` / `replayDeadLetter` / `discardDeadLetter` S | `{id}` | | `system:dlq` | replay re-sends event; A |
| `presignUpload` | see §5.4 | `PresignDto` | `upload:presign` / `media:upload` | idempotent per `Idempotency-Key` |
| `checkRateLimit` (infra) | `{class, actor\|ip}` | `Result<void>` | — | **Upstash Redis `slidingWindow` on the hot path (D3, 09 section 2.13)**; Postgres `rate_limit_bucket` is the fallback store (`RATE_LIMIT_BACKEND=postgres` for local dev; production forces redis) and holds durable business quotas (AI credits, daily AI ceilings, fair-use meters, coupons, SMS budget); fail-closed for auth/OTP/checkout/AI classes, fail-open for reads |
| `verifyTurnstile` (infra) | `{token, ip}` | `Result<void>` | — | on signup/OTP/checkout/contact |

### 4.13 support, disputes, moderation, enforcement (`packages/core/src/support`; 27)

Helpdesk = **Chatwoot Cloud** in P1 (D12 C29): the app owns identity linking, SLA timers/tags and the money/access tools; Chatwoot owns conversations. `SUPPORT_BACKEND = chatwoot (default) | native`; services branch only inside this domain. Message bodies are **not** copied into our DB in P1 (data minimisation).

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `getChatwootIdentity` S | — | `{identifier, identifierHash}` | `ticket:read` own | HMAC-SHA256(user_id, `CHATWOOT_IDENTITY_SECRET`) computed server-side only; widget identifies by `user_id`, name only (27 I1) |
| `handleChatwootWebhook` J/route | signed event | void | system | verifies `CHATWOOT_WEBHOOK_SECRET`; idempotent upsert of `support_ticket` (status, assignee, priority, labels, timestamps); computes SLA due/breach by tier; → `support.ticket_created`, `support.sla_breach` |
| `listMyTickets` S R | `{cursor}` | `Page<TicketRowDto>` | `ticket:read` own | metadata + deep link into the conversation |
| `lookupUser` S | `{query}` | `SupportUserCardDto` (masked) | `ticket:read` msk | order/entitlement/attempt summary for the agent; unmask via `revealPii` |
| `revealPii` | `{userId, field, reason, ticketId}` | `{value}` | `pii:reveal` (support `cap`, admin) | per-field, reason + ticket mandatory, rate-alerted, **A** `pii.reveal` |
| `assignTicket` / `mergeTickets` / `escalateTicket` | `{ticketId, ...}` | `TicketDto` | `ticket:assign` / `ticket:merge` | **A** `ticket.escalate` |
| `publishMacro` / `listMacros` | `{macroId, locale}` | `MacroDto` | `macro:manage` / `macro:read` | en/bn macros need native-speaker QA flag before publish (GA-034) |
| `recordCsat` S | `{ticketId, score, comment?}` | void | `ticket:read` own | `csat_response`; retention 24 months |
| `openDispute` S | `{kind: 'score'\|'payment', refId, reason}` | `DisputeDto` | `dispute:open` own\|lnk | one SLA/queue for money and score disputes; → `dispute.opened` |
| `decideDispute` | `{disputeId, decision, credit?}` | `DisputeDto` | `dispute:decide` (support `cap` score disputes; finance `*` payment disputes; admin) | credit return when AI/human gap >= 1.0; chargeback evidence pack for payment disputes (30); **A** `dispute.decide` → `dispute.decided` |
| `reportContent` / `decideModeration` / `decideModerationAppeal` | `{caseId, action: dismiss\|hide\|remove\|warn\|mute\|suspend\|escalate}` | `ModerationCaseDto` | `report:create` / `moderation:decide` (support, content_editor for editorial) / `moderation:appeal_decide` (admin) | ban/suspend needs admin (S15 open: ownership of `moderation:*` between support and content_editor); **A** `moderation.remove`, `moderation.appeal` → `moderation.actioned` |
| `applyEnforcement` | `{userId, level: warning\|limit\|suspend\|terminate, reasonCode, evidence}` | `EnforcementDto` | `enforcement:apply_warning` / `apply_limit` (support `cap`), `apply_suspend` / `apply_terminate` (admin; terminate needs a **second approver**) | account-sharing / abuse ladder (GA-026); details excluded from DSAR export (internal fraud notes); **A** `enforcement.apply` → `enforcement.applied` |
| `decideEnforcementAppeal` | `{enforcementId, outcome}` | `EnforcementDto` | `enforcement:decide_appeal` (admin) | **A** `enforcement.appeal` |
| `processDsr` J | `{requestId}` | void | `dsr:process` (support `cap`, admin) | wraps `privacy.export` / `privacy.erase`; includes Chatwoot conversations via connector (27 I9); SLA ack 3 d / complete 30 d |
| `handleLeoRequest` | `{requestId}` | void | `leo_request:handle` (admin) | law-enforcement SOP; **A** `leo.disclose` |

Permission alignment (resolves 27 S5): `attempt:void` is **no longer admin-only** — `support` holds it with service-enforced caps (`cap`: mandatory reason + ticket, counts per 27 S4, audited) alongside `attempt:grant_resit` and `attempt:credit_mock`; destructive/bulk variants stay `admin`. Impersonation session TTL is **15 minutes** with one renewal (aligns 03 and 09; the earlier 30 min in `startImpersonation` is retired).

### 4.14 guarantee & promises (`packages/core/src/guarantee`; D12 C13/C13b/GA-014)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `getPromiseProgress` S R | `{entitlementId}` | `PromiseProgressDto` | `guarantee:read` own | live checklist for `/app/promise`: attendance %, homework, full mocks taken, plan completion %, official-test window, TRF upload status (computed from `live_attendance`/manual import in P1, `test_attempt` exam-mode full mocks, `study_plan_item`) |
| `submitGuaranteeClaim` S | `{entitlementId, kind: 'target_promise'\|'progress_promise', officialTestDate, trfUploadId, scores}` | `GuaranteeClaimDto` | `guarantee:submit` own | **Plus Target Promise** (free 3-month extension, conditions: >= 4 full mocks + study-plan completion >= 70% + official test within 60 days of access end + TRF) and **Mentor Progress Promise** (one free re-enrolment; >= 80% attendance, all homework, >= 4 full mocks, official test within 60 days of course end, TRF; target agreed at enrolment <= diagnostic + 1.5 bands). No Free/Core/Live promise. Never cash. TRF to a private quarantine bucket; → `guarantee.submitted` |
| `reviewGuaranteeClaim` | `{claimId, checks}` | `GuaranteeClaimDto` | `guarantee:review` (support) | verifies TRF and eligibility numbers; **A** |
| `decideGuaranteeClaim` | `{claimId, outcome, reason}` | `GuaranteeClaimDto` | `guarantee:decide` (finance, admin) | on approve: `grantEntitlement(source='guarantee_extension'\|'guarantee_reenrol')`, finance books the provision release (30); **A** `guarantee.decide` → `guarantee_claim.status_changed`, `entitlement.extended` |
| `startPlusTrial` S | — | `TrialGrantDto` | `trial:start` own | 7-day Plus trial, no card, phone-OTP verified, 1 per phone/device, runs at Core caps with 3 extra one-time credits (17, 34 section 8.2) |
| `computeMoneyBackEligibility` | `{orderItemId}` | `{eligible, reasons[]}` | `refund:request` own\|lnk\|`*` | C13b/C28 measure shared with `requestMoneyBack` |

### 4.15 admissions (`packages/core/src/admissions`; 21; P2/P3)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `getAdmissionsPlan` S | `{studentId?}` | `AdmissionsPlanDto` | `admissions_plan:read` own\|lnk(consent)\|asg\|msk | counsellor sees only assigned students with the student's consent; guardian read-only with consent |
| `upsertCollegeTarget` / `upsertApplication` / `upsertDeadline` S | per entity | DTO | `admissions_plan:manage` own\|asg | deadlines feed `notifications.dispatch` reminders |
| `saveEssayDraft` S | `{applicationId, body, versionNote?}` | `EssayDraftDto` | `essay_draft:manage` own | versions every save; the platform gives **feedback, never ghost-writing** |
| `requestEssayFeedback` S | `{draftId, kind: 'ai'\|'counsellor'}` | `EssayFeedbackDto` | `essay_draft:manage` own | AI path debits whole credits per 17; counsellor path creates a review task → `essay_feedback.requested` |
| `submitEssayFeedback` S | `{draftId, comments, rubric}` | `EssayFeedbackDto` | `essay_draft:review` asg | integrity guardrail: no sentence-level rewriting text beyond examples; **A** |
| `bookCounsellorSession` / `recordSessionNote` S | `{sessionId,...}` | `CounsellorSessionDto` | `counsellor_session:manage` own | session notes visible only to counsellor + student; → `counsellor.session_reminder_due` (scheduled) |
| `getAdmissionsDocument` S | `{documentId}` | signed URL (5 min) | `admissions_document:read` own\|asg(consent) | sensitive documents; admin break-glass is audited |
| `assignCounsellor` | `{studentId, counsellorId}` | void | `counsellor:assign` (admin) | creates the assignment that all `asg` checks use; **A** |
| `upsertCollege` / `upsertScholarship` / `verifyRequirement` | per entity | DTO | `college:manage` / `scholarship:edit` (content_editor) | requirement verification within 90 days (21 KPI) |

### 4.16 finance operations (`packages/core/src/finance`; 30)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `uploadSettlementReport` S | `{provider, file}` | `SettlementReportDto` | `settlement:upload` (finance) | parses gateway statement into `settlement_line`; fee and VAT-on-fee captured (GA-011) |
| `runReconciliation` J | `{period, provider}` | `ReconciliationRunDto` | system / `reconciliation:resolve` | matches gateway statements vs `payment` vs bank; open items in `reconciliation_item`; → `payment.reconciled`, `payment.reconcile_delayed` |
| `resolveReconciliationItem` S | `{itemId, resolution, note}` | void | `reconciliation:resolve` (finance) | **A** |
| `postManualJournal` S | `{entries[], memo}` | `LedgerJournalDto` | `ledger:post_manual` (finance; step-up) | balanced entries only; **A** |
| `closePeriod` S | `{periodId}` | `FinancePeriodDto` | `period:close` (admin) | month-end close; locks `ledger_entry` and revenue schedule; **A** |
| `recognizeRevenue` J | `{period}` | `{n}` | system | `revenue_schedule` recognition for time-boxed passes and deferred items |
| `preparePayoutStatements` J/S | `{period}` | `PayoutStatementDto[]` | `payout:prepare` (finance) | monthly **manual** statements for instructors, item writers, graders, raters (work-for-hire, 10% lead-instructor royalty on own course only, C19/C32); withholding per accountant; maker step |
| `approvePayoutStatement` | `{statementId}` | `PayoutStatementDto` | `payout:approve` (**admin**, step-up) | checker step; **A** → `payout.approved` |
| `upsertPayee` S | `{userId, method, taxInfo}` | `PayeeProfileDto` | `payee:manage` (finance) | encrypted bank/bKash details; KYC/TIN fields |
| `manageChargeback` S | `{paymentId, stage, evidence}` | `DisputeDto` | `chargeback:manage` (finance) | evidence pack export (access logs, watermark logs, IP); Paddle MoR window short |
| `overrideRefundPolicy` | `{refundId, reason}` | `RefundDto` | `refund:override_policy` (admin) | **A** |
| `exportFinance` S | `{kind, period}` | `{downloadUrl}` | `finance:export` / `report:vat_export` | writes `export_receipt`; audited; Mushak format placeholder until accountant sign-off |
| `setFinanceSetting` | `{key, value}` | void | `finance_setting:write` (admin) | VAT mode, thresholds; **A** |

### 4.17 AI operations (`packages/core/src/ai-ops`; 31)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `manageGoldItem` / `assignRating` / `submitRating` | per entity | DTO | `gold:manage` (content_editor, admin) / `rating:submit` (grader asg) | gold set of human-scored responses, >= 2 independent certified raters, consent via `research_use` |
| `adjudicateRating` | `{goldItemId, finalScore}` | void | `rating:adjudicate` (grader asg flagged lead rater; admin) | third-rater adjudication; **A** |
| `runEval` J | `{modelReleaseId, suite}` | `EvalRunDto` | `eval:run` (content_editor, admin) | nightly canary, weekly PSI, monthly audit; locked test set only via `eval:locked_test` (admin) |
| `promoteModelRelease` / `rollbackModelRelease` | `{modelReleaseId}` | `ModelReleaseDto` | `model_release:manage` (admin) | prompt/rubric/model version gates (beta range +/-1.0 presentation); **A** `model_release.promote\|rollback` |
| `resolveAiDispute` | `{disputeId, outcome}` | `AiDisputeDto` | `ai_dispute:resolve` (grader asg, admin) | feeds calibration set |
| `getAiBudget` / `setAiBudget` | `{provider, daily, monthly}` | `AiBudgetDto` | `ai_budget:manage` (admin) | alerts at 70%, pause at 100% (09 section 10.2); cost tags `purpose='eval'` for 30 |
| `exportEvalReport` | `{runId}` | `{downloadUrl}` | `eval:report` / `eval:export` | accuracy statement gate for `/accuracy` |

### 4.18 AI learning features (`packages/core/src/ai-learning`; 34)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `streamTutor` (route `POST /api/tutor/stream`) | `{conversationId?, message, context?}` | SSE stream | `tutor:use` ent | RAG over `content_chunk` with the **entitlement filter applied in SQL**; limits per 09 section 10.2 canonical table (6 msgs/min burst, daily `tutor_msg` meter, 1 concurrent stream, input <= 1,500 chars, output <= 600 tokens, 6-turn window); citations required; minors gated (OQ-9); fair-use counter and cost logged |
| `listTutorConversations` / `deleteTutorConversation` S | `{cursor}` | Page | `tutor:use` own | retention per 09 section 13.7 |
| `createNotebook` / `addNotebookSource` / `askNotebook` S (P2) | per entity | DTO | `notebook:manage` ent | 3 notebooks x 10 sources (Plus+); uploads through the 5.4 pipeline; indirect-injection guard (09 section 10.1 item 9); audio overview = whole credits |
| `generateStudyAsset` / `getStudyAsset` S | `{unitId, kind}` | `StudyAssetDto` | `study_asset:read` ent | pre-generated guides, FAQs, audio overviews (TTS adapter), mind maps; on-demand quiz generation uses the `quiz_gen` meter |
| `reviewCard` / `getDueCards` / `addUserCard` S R | `{cardId, rating, clientTs, seq}` | `SrsStateDto` | `srs:manage` own | **FSRS** (`ts-fsrs`, D12 C26; SM-2 fallback via flag `srs.fallback`); idempotency key `rev:{userId}:{cardId}:{clientTs}:{seq}`; server replays log in `reviewed_at` order and recomputes (FSRS is order-dependent) |
| `getScoreEstimate` S R | `{examId}` | `ScoreEstimateDto` (labelled **estimated**) | `score_estimate:read` own\|lnk | `score_prediction`; never presented as a prediction of the official score |
| `getProgressReport` J/S | `{userId, week}` | `ProgressReportDto` | `progress_report:read` own\|lnk | weekly report (deterministic stats; LLM summary Plus+); guardian copy P2 |
| `startSpeakingPartner` S (P2 turn-based) | `{part, level, minutes}` | `SpeakingPartnerSessionDto` | `speaking_partner:use` ent | 3 credits per 10-min session (2 per 5 min), concurrency 1, hard cap 12 min, minors blocked |
| `getFairUseMeters` S | — | `MeterDto[]` | `tutor:use` own | UI notes at 80% of cap |
| `getAiUsage` | `{userId}` | `AiUsageDto` | `ai_usage:read` (support msk, finance, admin) | for abuse review |

### 4.19 legal & policy (`packages/core/src/identity`/`platform`; 26)

| Service | Input | Out | Perm | Effects |
|---|---|---|---|---|
| `recordPolicyAcceptance` | `{policyVersionId, context, orderId?}` | void | session | immutable `consent_record` with `policy_version_id`, `locale`, `context`; also `order.terms_policy_version_id` at checkout and `attempt_session.honour_code_policy_version_id` at exam start |
| `getCurrentPolicies` S R | `{kind[]}` | `PolicyDto[]` | `pub` | serves `/legal/*`, `/legal/history` |
| `publishPolicyVersion` | `{policyVersionId}` | `PolicyVersionDto` | `policy:publish` (admin) | blocked unless sign-off id + approval exist; material changes need >= 30 days notice and re-acceptance gate; → `policy.published` |
| `recordCookieConsent` | `{visitorHash, choices}` | void | `pub` | `cookie_consent_event` (HMAC of consent cookie id, no raw IP) |

---

## 5. Route handlers

All handlers live in `apps/web/app/api/**/route.ts` with `export const runtime = 'nodejs'`, `export const dynamic = 'force-dynamic'`, and are **thin**: authenticate → rate limit → parse (zod) → call service → map result. Never `edge` runtime for DB or crypto-heavy handlers.

### 5.1 Common contract (all `/api/*` JSON endpoints except webhooks)

* **Auth:** Better Auth session cookie (`__Secure-` prefixed, `HttpOnly`, `SameSite=Lax`). Cookie-authenticated **mutations** additionally require: `Origin` header equal to the app origin (reject otherwise, 403 `csrf`), and header `X-Lumen-Client: web` (or `exam-shell`). `GET` is side-effect free.
* **Content type:** `application/json; charset=utf-8`; request bodies capped per endpoint (default 64 KB).
* **Errors:** RFC 9457 `application/problem+json`:
  ```json
  { "type": "https://app.example/problems/exam/section-closed", "title": "Section is closed", "status": 409,
    "detail": "The section deadline passed 41 s ago.", "instance": "/api/exam/attempts/0193…/responses",
    "code": "conflict", "requestId": "req_01JABC…", "extensions": { "endsAt": "2026-11-07T10:30:00.000Z", "graceMs": 30000 } }
  ```
  `type` base URL = `NEXT_PUBLIC_APP_URL + '/problems/'` (brand-neutral, from config). Field validation errors add `"errors":[{"path":"changes[0].seq","message":"Required"}]`.
* **Headers returned:** `X-Request-Id`, `X-Server-Time` (RFC 3339, ms), `Cache-Control: no-store` on all authenticated responses, `RateLimit-Limit/Remaining/Reset` + `Retry-After` on 429.
* **Idempotency:** `Idempotency-Key: <8–128 chars>` honoured on POSTs marked ⟲. Same key + same body hash ⇒ replay stored response (header `Idempotent-Replay: true`); same key + different body ⇒ 422 `idempotency-mismatch`; in-flight duplicate ⇒ 409 `request-in-progress` with `Retry-After: 1`.
* **IDs** are UUIDv7 strings; **timestamps** RFC 3339 UTC.

### 5.2 Webhooks and payment return

General webhook rules: read the **raw body** (`await req.text()`), verify authenticity *before* parsing, insert into `webhook_event` (`UNIQUE(provider,event_id)`; conflict ⇒ return 200 immediately), enqueue the Inngest event `webhook.received` (`{webhookEventId}`) and return 200 within ~1 s. Heavy work happens in Inngest (`webhooks.process-<provider>`). Unverifiable ⇒ 400 (no body detail), counted and alerted. Webhook routes are excluded from CSRF/Origin checks and cookie auth, rate-limited per IP at the edge (Cloudflare WAF) with provider IP allow-lists where published.

#### `POST /api/webhooks/sslcommerz/ipn`
* **Content-Type:** `application/x-www-form-urlencoded` (SSLCommerz IPN). Fields include `tran_id, val_id, amount, store_amount, currency, bank_tran_id, card_type, status, tran_date, verify_sign, verify_key, risk_level, risk_title`.
* **Verify:** (1) recompute `verify_sign` — MD5 over the fields named in `verify_key` (sorted) + MD5(store_password) — constant-time compare; (2) **always** call the Order Validation API `GET /validator/api/validationserverAPI.php?val_id=…&store_id=…&store_passwd=…&format=json` and require `status ∈ {VALID, VALIDATED}`, `tran_id` = `payment.merchant_ref`, `currency_type`/`currency_amount` (or `amount`) = `payment.amount_minor/100`, `store_id` = ours (R11). `event_id` = `${tran_id}:${status}:${sha256(rawBody).slice(0,16)}`.
* **Flow:** insert `webhook_event` → inline fast-path `handleSslcommerzCallback({source:'ipn'})` with a 4 s budget (so the paying user sees success quickly) → on timeout/failure leave to Inngest `webhooks.process-sslcommerz` (retries) → respond.
* **Responses:** `200 {"received":true}` (also for duplicates and for valid-but-failed payments); `400` bad signature; `500` only for infrastructure failure (SSLCommerz retries). Never reveal why validation failed.
* **Side effects (via service):** `payment` `succeeded`/`failed`/`risk_hold`, `val_id`, `provider_txn_id = bank_tran_id`, `raw_payload_hash`, order CAS → `order.paid` → `commerce.fulfil-order`.

#### `POST /api/checkout/return/sslcommerz?outcome=success|fail|cancel`
Browser POST from SSLCommerz (`success_url`, `fail_url`, `cancel_url`, form-encoded). **Never trusted for fulfilment.** Handler: parse `tran_id`, look up `payment`, run the same `handleSslcommerzCallback({source:'success'})` (idempotent; validates via API), then `303 See Other` → `/checkout/return?order=<orderNumber>` (the `(checkout)` page polls `GET /api/orders/{id}/status` every 2 s up to 60 s, showing pending/paid/failed). Returns 303 in all cases; unknown `tran_id` ⇒ 303 to `/orders`.

#### `GET /api/orders/{orderId}/status`
Auth required (payer or recipient). `200 {"orderId","number","status":"pending|paid|failed|expired|…","paymentStatus":"…","entitlementsReady":true}`; `404` otherwise.

#### `POST /api/webhooks/paddle`
* Header `Paddle-Signature: ts=…;h1=…`; verify HMAC-SHA256 of `ts:rawBody` with endpoint secret (use Paddle SDK `webhooks.unmarshal`), reject `ts` older than 5 min. `event_id` = Paddle `event_id`.
* Handled types: `transaction.completed`, `transaction.payment_failed`, `subscription.created|updated|canceled|past_due`, `adjustment.created|updated` (refunds/chargebacks). Amount/currency re-checked against the local order (custom data `orderId` set at transaction creation).
* Responses: `200`/`400` as above.

#### `POST /api/webhooks/stripe` (only if Stripe via foreign entity is chosen — D3)
`Stripe-Signature` verified with `stripe.webhooks.constructEvent` (tolerance 300 s). Types: `checkout.session.completed`, `payment_intent.payment_failed`, `invoice.paid`, `invoice.payment_failed`, `customer.subscription.updated|deleted`, `charge.refunded`, `charge.dispute.created`. `event_id` = `evt_…`. Both Paddle and Stripe handlers implement the `PaymentProvider` interface (`createCheckout`, `verifyWebhook`, `refund`, `cancelSubscription`).

#### `POST /api/webhooks/bunny`
Bunny Stream webhooks are **not signed**. Mitigation: (a) path secret `?token=<BUNNY_WEBHOOK_TOKEN>` compared in constant time, (b) treat payload only as a *hint* — Inngest `media.sync-bunny-video` re-fetches the video from the Bunny API by `VideoGuid` and updates `media_asset`. Body `{VideoLibraryId, VideoGuid, Status}` (`Status` 3 = finished/playable, 4 = resolution finished, 5 = failed). `event_id` = `${VideoGuid}:${Status}`. Responses: `200`; `401` bad token.

#### `POST /api/webhooks/resend`
Svix headers `svix-id`, `svix-timestamp`, `svix-signature` verified with `RESEND_WEBHOOK_SECRET` (replay window 5 min). Types: `email.delivered`, `email.bounced`, `email.complained`, `email.delivery_delayed`. `event_id` = `svix-id`. Updates `email_log`; hard bounce/complaint ⇒ suppression.

#### `POST /api/webhooks/chatwoot`
Chatwoot Cloud (D12 C29) webhook: verified with `CHATWOOT_WEBHOOK_SECRET` (HMAC over raw body) + timestamp window; `event_id` = Chatwoot event id. Calls `handleChatwootWebhook` (4.13): upserts `support_ticket` metadata, applies SLA/tag rules, never stores message bodies in P1. Rate class `webhook`.

#### `POST /api/webhooks/zoom`
Zoom event subscription (recording completed, meeting started/ended, participant joined/left): verified with `ZOOM_WEBHOOK_SECRET_TOKEN` (HMAC `v0:{ts}:{body}`) and the endpoint-validation challenge. Feeds `live.recording_ready` (download to R2/Bunny, then delete the Zoom cloud copy, 10 section 9.6) and attendance import for the P1 manual pilot cohorts (`live_attendance`).

### 5.3 `/api/inngest`
`export const { GET, POST, PUT } = serve({ client: inngest, functions })` (from `inngest/next`). Authenticated by Inngest signing key (`INNGEST_SIGNING_KEY`) — requests failing signature verification get 401; the route is excluded from cookie auth. `maxDuration = 300` (Vercel Pro); long jobs split into steps. Env: `INNGEST_EVENT_KEY`, `INNGEST_SIGNING_KEY`. Function catalogue: §7.2.

### 5.4 Uploads — `POST /api/uploads/presign`

Auth: session. Permission: `upload:presign` (learner purposes) or `media:upload` (studio purposes). Rate limit class `upload` (30/min/user). ⟲ idempotent.

Request:
```json
{ "purpose": "speaking_recording", "contentType": "audio/webm", "sizeBytes": 1843200,
  "sha256": "9f2c…(optional, hex)", "related": { "attemptId": "0193…", "part": 2 } }
```
`purpose` ∈ `speaking_recording | course_video | course_resource | lesson_image | avatar | org_logo | stimulus_audio | stimulus_image`.

| purpose | Target | Allowed content types | Max size | Key pattern (R2, private bucket) | Roles |
|---|---|---|---|---|---|
| `speaking_recording` | R2 | `audio/webm`, `audio/mp4`, `audio/ogg`, `audio/wav` | 25 MB (≤ 5 min) | `speaking/{userId}/{recordingId}.{ext}` | student/guest-own |
| `course_video` | **Bunny Stream (TUS)** | video/* | 10 GB | n/a | instructor, content_editor |
| `course_resource` | R2 | pdf, zip, docx, xlsx, png, jpg | 100 MB | `courses/{courseId}/resources/{assetId}/{filename}` | instructor, content_editor |
| `lesson_image` / `stimulus_image` | R2 | png, jpg, webp, svg(sanitised) | 10 MB | `media/{assetId}.{ext}` | instructor, content_editor |
| `stimulus_audio` | R2 | mp3, m4a, wav | 200 MB | `stimuli/{assetId}.{ext}` | content_editor |
| `avatar` | R2 | png, jpg, webp | 2 MB | `avatars/{userId}/{assetId}.{ext}` | any signed-in |
| `org_logo` | R2 | png, jpg, svg | 2 MB | `orgs/{orgId}/logo.{ext}` | org_admin |

Response `200` (R2):
```json
{ "uploadId": "0193…", "method": "PUT", "url": "https://<acct>.r2.cloudflarestorage.com/…?X-Amz-Signature=…",
  "headers": { "Content-Type": "audio/webm", "x-amz-checksum-sha256": "…" },
  "expiresAt": "2026-11-07T10:15:00.000Z", "maxBytes": 26214400,
  "next": { "confirm": "POST /api/uploads/0193…/confirm" } }
```
Response (Bunny): `{ "uploadId", "method":"TUS", "endpoint":"https://video.bunnycdn.com/tusupload", "headers": { "AuthorizationSignature":"…", "AuthorizationExpire": 1731000000, "VideoId":"…", "LibraryId":"…" }, "expiresAt" }` (signature = SHA256(libraryId + apiKey + expire + videoId), computed server-side; the Bunny API key never leaves the server).

Presigned URL TTL 10 min, content-length-range and content type bound into the signature; server generates the key (client never chooses it). Errors: `422` (type/size not allowed), `403`, `429`, `409` (e.g., attempt not running for a recording).

`POST /api/uploads/{uploadId}/confirm` → server HEADs the object (size, content-type; optional checksum), creates/updates `media_asset` or `speaking_recording` (`status='uploaded'`), enqueues `media.process-upload` (AV scan for documents, ffprobe duration, image dimension/EXIF strip) or `evaluation.transcribe-recording`. `200 {"id","status":"uploaded"}`; `409` if object missing/mismatch (object deleted); uploads never confirmed within 24 h are removed by `platform.cleanup-orphan-uploads`.

Downloads: private files are served only via short-lived presigned GET (≤ 5 min) minted by the owning service after `assertCan`; videos via Bunny token-authenticated embed URL (`token = SHA256_HEX(securityKey + videoId + expires)`, 4 h TTL, IP-agnostic, visible watermark overlay with user email/phone from the player layer).

### 5.5 `POST /api/auth/*` and misc
Better Auth is mounted at `/api/auth/[...all]` (`toNextJsHandler(auth.handler)`), including OTP, OAuth callback, passkey and 2FA endpoints; the same rate-limit classes (`auth`) apply via the Better Auth `rateLimit` option plus Cloudflare Turnstile verification on sign-up/OTP request/checkout/contact (client token → `verifyTurnstile`). `POST /api/contact` (Turnstile, 5/h/IP) writes a support ticket email.

### 5.6 Exam engine — `/api/exam/*`

Route handlers (not server actions) because the client-heavy exam shell needs fine-grained HTTP semantics, retries with `keepalive` fetch, and conditional headers. Group `(exam)` page: `/exam/[attemptId]`. Headers common to all: session cookie, `X-Lumen-Client: exam-shell`, `X-Server-Time` on every response. Auth: `resolveActor` (guest diagnostic users are anonymous Better Auth users). Rate-limit class `exam` is per **attempt** (not IP): 120 requests/min/attempt (heartbeat 4/min + autosave ≤ 12/min nominal), 429 otherwise. Sections are addressed by **1-based `position`** (the `attemptSectionId` is returned for convenience).

State machine reminder (05 §6): attempt `not_started → in_progress ⇄ paused → submitted → scored`, or `expired`; section `not_started → in_progress → submitted | expired`. Write window: `now ≤ ends_at + 30 s` (D6). **Offline replay (D6):** in `exam` mode a queued/offline batch is accepted only if it is received within that 30 s grace after the section deadline (no extended replay window, for integrity); in `practice` mode queued batches are accepted at any time (no deadline check; the section is re-scored if it had already closed). The client always replays with the original `seq` values, so ordering is still guarded by R5.

| # | Method & path | Purpose | Success | Key errors |
|---|---|---|---|---|
| 1 | `POST /api/exam/attempts` ⟲ | start or resume | 201 (new) / 200 (resumed) | 401, 402 `payment-required`, 403, 404 form, 409 `exam/retake-not-allowed`, `exam/cooldown`, 422 |
| 2 | `GET /api/exam/attempts/{attemptId}` | full state for resume/boot | 200 | 401, 404 |
| 3 | `POST /api/exam/attempts/{attemptId}/sections/{position}/start` | begin timed section | 200 (201 if first start) | 409 `exam/previous-section-open`, `exam/attempt-paused`, `exam/section-closed`, `exam/another-section-active` (another exam-mode section of this user is running) |
| 4 | `GET /api/exam/attempts/{attemptId}/sections/{position}` | section payload (items, stimuli, saved answers) | 200 | 409 `exam/section-not-started`, 404 |
| 5 | `PUT /api/exam/attempts/{attemptId}/responses` | autosave batch | 200 | 409 `exam/section-closed`, 409 `exam/section-not-active`, 409 `exam/session-superseded`, 413, 422, 429 |
| 6 | `POST /api/exam/attempts/{attemptId}/navigate` | record navigation + enforce back-nav rule | 200 | 403 `exam/navigation-disallowed`, 409 |
| 7 | `POST /api/exam/attempts/{attemptId}/events` | behavioural events batch | 202 | 422, 429 |
| 8 | `POST /api/exam/attempts/{attemptId}/sections/{position}/submit` ⟲ | submit section | 200 | 409 `exam/section-closed` (beyond grace; section auto-expired — response still 200-style idempotent if already submitted) |
| 9 | `POST /api/exam/attempts/{attemptId}/submit` ⟲ | submit attempt | 200 | 409 `exam/already-submitted` (idempotent replay returns 200) |
| 10 | `POST /api/exam/attempts/{attemptId}/heartbeat` | keep-alive, clock sync | 200 | 404, 409 (attempt closed → `commands:["goto_result"]` instead of error) |
| 11 | `POST /api/exam/attempts/{attemptId}/pause` / `/resume` | break between sections | 200 | 409 `exam/pause-not-allowed` |
| 12 | `GET /api/exam/attempts/{attemptId}/result` | estimated score | 200 / 202 (scoring) | 403 (guest before sign-up: summary only) |
| 13 | `POST /api/exam/attempts/{attemptId}/recordings` | register uploaded speaking part | 201 | 409, 422 |
| 14 | `GET /api/exam/attempts/{attemptId}/review` | explanations & correct answers after submission | 200 | 403 `exam/review-locked` (before submit), 404 |
| 15 | `POST /api/exam/attempts/{attemptId}/session` | claim the single active client session (device takeover); returns `epoch` | 200 | 409 `exam/active-elsewhere` (another device seen < 45 s ago and `takeover` false), 429 (1 takeover / 30 s) |
| 16 | `PUT /api/exam/attempts/{attemptId}/annotations` | highlights / inline notes / section notepad (`attempt_annotation`), same `epoch`+`seq` rules and write window as #5 | 200 | 409 `exam/section-closed`, `exam/session-superseded`, 422 |

#### 1. Start / resume — `POST /api/exam/attempts`
Headers: `Idempotency-Key: 5d1f…` (required).
```json
{ "testFormCode": "ielts-ac-mock-001", "mode": "exam" }
```
`201 Created` (new) / `200 OK` (`"resumed": true`):
```json
{
  "attemptId": "0193a7c2-0f3e-7b1c-9a53-2f5e5f0b8d11",
  "resumed": false,
  "status": "in_progress",
  "serverTime": "2026-11-07T09:00:00.120Z",
  "form": { "code": "ielts-ac-mock-001", "title": "IELTS Academic Mock 1", "versionNumber": 1, "kind": "full_mock" },
  "expiresAt": "2026-11-07T14:00:00.000Z",
  "nextSeq": 1,
  "sections": [
    { "position": 1, "attemptSectionId": "0193a7c2-…", "skill": "listening", "title": "Listening", "status": "not_started", "timeLimitSeconds": 2400, "allowBackNavigation": false, "itemCount": 40 },
    { "position": 2, "attemptSectionId": "0193a7c2-…", "skill": "reading", "title": "Reading", "status": "not_started", "timeLimitSeconds": 3600, "allowBackNavigation": true, "itemCount": 40 },
    { "position": 3, "attemptSectionId": "0193a7c2-…", "skill": "writing", "title": "Writing", "status": "not_started", "timeLimitSeconds": 3600, "allowBackNavigation": true, "itemCount": 2 }
  ],
  "currentPosition": null
}
```
For adaptive forms only already-routed sections are listed; `"pendingPositions":[4,5]` signals more to come (tier never revealed). Errors: `402` `{"type":".../payment-required","extensions":{"productIds":["…"]}}`; `409 exam/retake-not-allowed`.

#### 2. State — `GET /api/exam/attempts/{attemptId}`
Same body as above plus per-section `startedAt`, `endsAt`, `submittedAt`, `answeredCount`, `flaggedCount`, `remainingMs` (for running section), `lastSeq` (highest applied sequence), `pausedAt`. Supports `If-None-Match` is **not** used (always fresh).

#### 3. Start section — `POST …/sections/2/start`
Body `{}`. `200`:
```json
{ "position": 2, "attemptSectionId": "0193…", "status": "in_progress",
  "startedAt": "2026-11-07T09:42:10.004Z", "endsAt": "2026-11-07T10:42:10.004Z",
  "serverTime": "2026-11-07T09:42:10.030Z", "graceMs": 30000 }
```
Idempotent: repeating returns the same `startedAt/endsAt` (never extends).

#### 4. Section payload — `GET …/sections/2`
`200` (cacheable by the client per `(attemptId, position)`; answers merged from server state):
```json
{
  "position": 2, "attemptSectionId": "0193…", "skill": "reading", "status": "in_progress",
  "endsAt": "2026-11-07T10:42:10.004Z", "serverTime": "2026-11-07T09:42:11.200Z",
  "instructions": { "type": "doc", "content": [ … ] },
  "allowBackNavigation": true, "allowFlagging": true,
  "stimuli": [ { "id": "0193…", "kind": "reading_passage", "title": "Passage 1", "schemaVersion": 1, "body": { "type": "doc", "content": [ … ] } } ],
  "items": [
    { "itemId": "0193…", "position": 1, "groupKey": "q1-5", "points": 1, "stimulusId": "0193…",
      "question": { "type": "true_false_not_given", "schemaVersion": 1, "content": { "prompt": "…", "options": ["True","False","Not given"] } },
      "saved": { "answer": { "choice": "False" }, "flagged": false, "timeSpentMs": 21400, "seq": 17 } }
  ]
}
```
Never present: `answerKey`, `explanation`, `irtB`, `difficulty`, other tiers' sections. Errors: `409 exam/section-not-started` (call start first); finished sections are readable only if the form allows review (`delivery_config.reviewAfterSubmit`), else 403.

#### 5. Autosave — `PUT …/responses`
Body ≤ 256 KB, ≤ 50 changes; `seq` is a client-side per-attempt monotonically increasing counter persisted in IndexedDB (resumes from `nextSeq`/`lastSeq+1`); the stored `last_seq` is the engine's packed `(epoch, counter)` value (07 §5.3), where `epoch` comes from the session claim (#15) and a write under a stale epoch is rejected `409 exam/session-superseded`.
```json
{
  "sectionPosition": 2,
  "epoch": 3,
  "batchId": "0193a7d0-5c1e-7000-8a2b-3b1e0f9a77c2",
  "clientSentAt": "2026-11-07T09:45:03.512Z",
  "changes": [
    { "itemId": "0193…", "seq": 41, "answer": { "choice": "B" }, "flagged": false, "timeSpentMs": 18250 },
    { "itemId": "0193…", "seq": 42, "answer": null, "flagged": true, "timeSpentMs": 4100 },
    { "itemId": "0193…", "seq": 43, "answer": { "text": "In my opinion…" }, "flagged": false, "timeSpentMs": 612000 }
  ]
}
```
`200 OK`:
```json
{
  "serverTime": "2026-11-07T09:45:03.640Z",
  "section": { "position": 2, "status": "in_progress", "endsAt": "2026-11-07T10:42:10.004Z", "remainingMs": 3426364 },
  "results": [
    { "itemId": "0193…", "status": "applied", "seq": 41 },
    { "itemId": "0193…", "status": "stale",   "seq": 42, "serverSeq": 50 },
    { "itemId": "0193…", "status": "rejected", "seq": 43, "reason": "invalid_answer", "detail": "text exceeds 20000 characters" }
  ],
  "highestAppliedSeq": 41
}
```
Semantics: R5 (applied only if `seq` > stored); `stale` is success (client drops it); `rejected` items are not retried; answer shape validated per question type (`mcq_single {choice}`, `mcq_multi {choices[]}`, `true_false_not_given {choice}`, `matching {pairs{}}`, `*_completion {blanks{}|text}`, `numeric_entry {value}`, `writing_task|awa_* {text}`, `speaking_* {recordingIds[]}`); `itemId` must belong to the section. Replaying the identical `batchId` returns the stored result with `Idempotent-Replay: true`. Errors: `409 exam/section-closed` (after `ends_at + 30 s`; includes `endsAt`; the client must stop editing and show the submitted state) · `409 exam/section-not-active` (not started / already submitted) · `413` body too large · `422` malformed envelope · `429` with `Retry-After`. The client sends on change (debounced 1 s) and at least every 10 s while dirty; on `visibilitychange:hidden`/`pagehide` it fires a final `fetch(..., {keepalive:true})` (not `sendBeacon`, which cannot set the CSRF header).

#### 6. Navigate — `POST …/navigate`
```json
{ "sectionPosition": 1, "fromItemId": "0193…", "toItemId": "0193…" }
```
`200 {"allowed":true,"serverTime":"…"}`; in a `allow_back_navigation=false` section moving to an earlier item ⇒ `403` `exam/navigation-disallowed` (client keeps the learner on the current item). Writes `attempt_event` types `navigated` and `item_viewed`; also updates the resume pointer returned by `GET attempt` (`currentItemId`).

#### 7. Events — `POST …/events`
```json
{ "events": [ { "type": "focus_lost", "clientTs": "2026-11-07T09:50:01.000Z", "meta": { "durationMs": 4200 } },
              { "type": "fullscreen_exit", "clientTs": "2026-11-07T09:50:05.000Z", "meta": {} } ] }
```
`202 {"accepted":2}`. Whitelist = `attempt_event_type` values the client may emit (`focus_lost`, `focus_gained`, `fullscreen_exit`, `offline`, `online`, `flagged`, `unflagged`); others are server-written. Meta ≤ 1 KB each. Events never block or alter scoring; they feed integrity review (support/grader UI) only. Honest framing: signals are advisory, not proctoring.

#### 8. Submit section — `POST …/sections/1/submit`
Body (optional final unsaved changes, same shape as autosave):
```json
{ "finalChanges": [ { "itemId": "0193…", "seq": 90, "answer": { "text": "answer" }, "flagged": false, "timeSpentMs": 9000 } ] }
```
`200`:
```json
{ "position": 1, "status": "submitted", "submittedAt": "2026-11-07T09:41:58.300Z",
  "next": { "type": "section", "position": 2, "attemptSectionId": "0193…", "breakAllowed": false } }
```
`next.type` ∈ `section | break | finish`. For GRE routing the server creates the correct alternative; the response contains only `position` and the new `attemptSectionId` — **never the tier or the first-section score**. If the deadline + grace has passed, the section is already `expired`: respond `200` with `"status":"expired"` (idempotent, `finalChanges` ignored and reported `{"ignored":n}`), not an error — the learner sees the next step.

#### 9. Submit attempt — `POST …/submit`
Body `{}` ⟲. `200`: `{"attemptId","status":"submitted","submittedAt":"…","scoring":{"status":"queued","objectiveReadyEstimateSeconds":10,"aiPending":["writing","speaking"]}}`. Triggers `attempt.submitted`. Repeat ⇒ `200` with the same body.

#### 10. Heartbeat — `POST …/heartbeat` (every 15 s while a section runs; 60 s otherwise)
```json
{ "sectionPosition": 2, "visibility": "visible", "online": true, "clientTime": "2026-11-07T09:46:00.000Z", "lastSeq": 52 }
```
`200`:
```json
{ "serverTime": "2026-11-07T09:46:00.050Z", "attemptStatus": "in_progress",
  "section": { "position": 2, "status": "in_progress", "endsAt": "2026-11-07T10:42:10.004Z", "remainingMs": 3369954 },
  "serverLastSeq": 52, "commands": [] }
```
The client computes `offset = serverTime − (clientTime + rtt/2)` and renders the countdown as `endsAt − (now + offset)`; the countdown is **display-only**. If `serverLastSeq < lastSeq` the client re-sends unacknowledged changes. `commands` ∈ `[]`, `["submit_now"]` (section expired), `["goto_result"]` (attempt closed/expired), `["extra_time:+300"]` (accommodation granted). A gap > 60 s between heartbeats writes a `heartbeat_gap` event.

#### 11. Pause / resume
`POST …/pause` `{ "reason": "break" }` → `200 {"status":"paused","pausedAt":"…","resumeBy":"…(24 h)"}` only when no section is running and the next section is `is_breakable` (IELTS Speaking/Writing split, GRE scheduled break); otherwise `409 exam/pause-not-allowed`. In `practice` mode pause is additionally allowed while a section runs (max 30 min per section); `resume` then shifts that section's `ends_at` by the paused duration. Exam mode never pauses a running section. `POST …/resume` → `200` with state; timers of the next section start only on its explicit start call.

#### 12. Result — `GET …/result`
`202 {"status":"scoring","retryAfterSeconds":3}` + `Retry-After: 3` until `attempt.scored`; then `200`:
```json
{ "attemptId": "0193…", "status": "scored", "label": "estimated",
  "overall": { "scaled": 6.5, "estimateLow": 6.0, "estimateHigh": 7.0, "unit": "band" },
  "sections": [ { "skill": "listening", "raw": 29, "maxRaw": 40, "scaled": 7.0 },
                { "skill": "reading", "raw": 26, "maxRaw": 40, "scaled": 6.5 },
                { "skill": "writing", "scaled": null, "evaluationRequestId": "0193…", "status": "queued" },
                { "skill": "speaking", "scaled": null, "evaluationRequestId": "0193…", "status": "awaiting_recordings" } ],
  "breakdown": { "byType": { "true_false_not_given": { "correct": 7, "total": 10 } }, "timing": { "avgMsPerItem": 61000 } },
  "disclaimerKey": "exam.estimated_score_disclaimer" }
```
`allow_review` (explanations) is fetched from `getQuestionExplanations` (`GET …/review`, same auth) only after `submitted`. Guests (anonymous) get `overall` only until they sign up (`"gated": true`, CTA); data is kept 30 days.

#### 13. Register recording — `POST …/recordings`
After presign + upload + confirm: `{ "uploadId": "0193…", "itemId": "0193…", "part": 2, "durationMs": 118400 }` → `201 {"recordingId","status":"uploaded"}`; the learner's `saveResponses` stores `{ "recordingIds": [ … ] }` as the answer for the speaking item. On attempt submit with recordings, `evaluation.requested` is created automatically for Speaking (AI mock evaluation included in the form price: 1 credit deducted only if `deliveryConfig.aiEvaluationIncluded=false`).


#### 14. Report a technical problem / void a section — `POST …/sections/2/void-request` (GA-007, D12 C30)
Body `{ "idempotencyKey": "…" }`. Exam mode only. `200 {"voided":true,"reissued":{"position":2,"attemptSectionId":"0193…"}}` when the server's own `heartbeat_gap` > 2 min covers the interruption and this attempt has not used its single self-serve void; the re-issued section runs the full duration with the same pinned question versions. Errors: `409 exam/void-already-used` (then the UI offers "Contact support", which opens a Chatwoot conversation pre-filled with the attempt id; support can `voidSection`/`grantResit` under the 4.13 caps), `422 exam/no-disruption-evidence`, `429`. Practice mode never needs this: the system pauses on heartbeat loss.
### 5.7 Other first-party JSON endpoints (route handlers used by client-heavy screens)

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/progress/lessons/{courseId}/{lessonKey}` | `PUT` | video position/complete beats (every 15 s, `sendBeacon` fallback with token query) → `recordLessonProgress` |
| `/api/media/lesson/{courseId}/{lessonKey}/playback` | `GET` | mints Bunny embed URL + watermark text after `lesson:view` |
| `/api/evaluations/{id}/stream` | `GET` (SSE) | status updates for the evaluation screen (falls back to polling `GET /api/evaluations/{id}`) |
| `/api/notifications/unread-count` | `GET` | header badge |
| `/api/search/suggest` | `GET` | catalogue autosuggest (cached 60 s, public) |
| `/api/tutor/stream` | `POST` (SSE) | AI tutor streaming (34) -> `streamTutor`; limits from the canonical AI table (09 section 10.2); `Cache-Control: no-store` |
| `/api/trial/start` | `POST` | `startPlusTrial` (7-day Plus trial, phone-OTP verified, 1 per phone/device) |
| `/api/guarantee/claims` | `POST` / `GET` | `submitGuaranteeClaim` / `getPromiseProgress` (TRF upload via `/api/uploads/presign`, purpose `trf`) |
| `/api/orders/{id}/money-back` | `POST` | `requestMoneyBack` (C13b) |
| `/api/notebooks/{id}/sources` | `POST` | notebook source upload registration (P2) -> ingest job |
| `/api/exam/attempts/{id}/sections/{n}/void-request` | `POST` | `requestSectionVoid` (GA-007 self-serve "I lost connection", once per attempt) |
| `/api/support/chatwoot-identity` | `GET` | `getChatwootIdentity` (identity-validation hash for the widget; session required) |
| `/api/contact` | `POST` | contact form -> Chatwoot inbox (Turnstile, 5/h/IP) |

---

## 6. Public REST `/api/v1` (P3)

Purpose: Expo mobile app (first consumer), then institution integrations and partners. **Same services** as the web app; the Hono layer only adapts transport. Mounted at `apps/web/app/api/v1/[[...route]]/route.ts` via `hono/vercel` (`handle(app)`), OpenAPI 3.1 generated from zod with `@hono/zod-openapi`; spec served at `GET /api/v1/openapi.json`, docs at `/developers` (marketing group).

### 6.1 Setup sketch

```ts
import { OpenAPIHono, createRoute, z } from '@hono/zod-openapi';
import { handle } from 'hono/vercel';
import { listMyEnrollments } from '@lumen/core/learning';

const app = new OpenAPIHono<{ Variables: { actor: Actor } }>().basePath('/api/v1');
app.use('*', requestId(), secureHeaders(), cors({ origin: allowedOrigins, allowHeaders: ['Authorization','Content-Type','Idempotency-Key'] }),
        authenticate(),            // Bearer session token (Better Auth bearer plugin) → Actor; 401 problem+json
        rateLimit(), problemJson());

app.openapi(createRoute({
  method: 'get', path: '/me/enrollments', tags: ['Learning'], security: [{ bearerAuth: [] }],
  request: { query: PageQuery.extend({ status: EnrollmentStatus.optional() }) },
  responses: { 200: { content: { 'application/json': { schema: Page(EnrollmentRowDto) } }, description: 'OK' }, 401: Problem, 429: Problem },
}), async (c) => {
  const res = await listMyEnrollments(c.get('actor'), c.req.valid('query'));
  return res.ok ? c.json(res.value) : c.json(toProblem(res.error, c), statusFor(res.error), { 'content-type': 'application/problem+json' });
});
export const GET = handle(app), POST = handle(app), PUT = handle(app), PATCH = handle(app), DELETE = handle(app);
```

### 6.2 Authentication
* **Mobile/first-party:** `Authorization: Bearer <session token>` (Better Auth `bearer` plugin). Obtain via `POST /api/auth/sign-in/*` (OTP/Google/passkey) → `set-auth-token` response header; store in Secure Enclave/Keystore (`expo-secure-store`). Same session semantics as web (30-day idle/90-day absolute; staff 12 h; revocable from Settings → Devices).
* **Server-to-server (institutions, P3+):** Better Auth `apiKey` plugin keys, hashed at rest, scoped (`org:<id>:read_analytics`, `org:<id>:manage_members`), bound to an org and a user with `org_admin` role; per-key rate limits; never grants learner-private data beyond org scope.
* No cookies on `/api/v1` (so no CSRF surface); CORS allow-list only for the web origin and Expo dev origin.
* Staff roles (grader+, instructor, org_admin, counsellor) must present a 2FA-verified session; mobile staff flows are out of P3 scope except grader queue (read).

### 6.3 Conventions
* **Base:** `https://<app-domain>/api/v1`, JSON only, UTF-8; `Accept-Language: en|bn` selects localized fields (`titleEn/titleBn` collapse to `title`).
* **Resources & verbs:** plural nouns, kebab-case paths, UUID ids. Commands that are not CRUD are `POST /…/{id}/{verb}`.
* **Pagination:** cursor-based. Query: `?limit=25` (1–100, default 25) `&cursor=<opaque>`; response envelope:
  ```json
  { "data": [ … ], "page": { "nextCursor": "eyJ0IjoiMjAyNi0xMS0wN1QwOTo0MDowMFoiLCJpIjoiMDE5My4uLiJ9", "hasMore": true, "limit": 25 } }
  ```
  Cursor = base64url(JSON `{t: created_at, i: id}`) HMAC-signed (tamper ⇒ 400). Ordering is stable `(created_at DESC, id DESC)` unless a resource documents otherwise. No `total` counts (use `GET …/count` where needed).
* **Filtering/sorting:** explicit documented query params only (no generic filter DSL). **Field selection:** none; DTOs are fixed.
* **Idempotency:** `Idempotency-Key` supported on all `POST` creating resources (orders, evaluations, attempts).
* **Errors:** RFC 9457 `application/problem+json` exactly as §5.1, with stable machine `code` and `type` URIs; validation errors list `errors[]` with JSON pointer paths.
* **Timestamps/money:** RFC 3339 UTC; money as `{ "amountMinor": 150000, "currency": "BDT" }` (never floats).
* **ETag/conditional:** `ETag` + `If-None-Match` on catalogue GETs (`/courses`, `/courses/{slug}`, `/products`); `If-Match` on PATCH of user-editable resources (profile, notes).
* **Security headers:** `Cache-Control: no-store` on authenticated routes; `Vary: Authorization, Accept-Language`.

### 6.4 Resources

| Resource | Endpoints | Service(s) | Notes |
|---|---|---|---|
| **Me** | `GET/PATCH /me`, `GET /me/home`, `GET/PUT /me/preferences/notifications`, `GET /me/sessions`, `DELETE /me/sessions/{id}`, `POST /me/data-export`, `POST /me/deletion` | `getMyProfile`, `updateProfile`, `getLearnerHome`, `setPreference`, `listSessions`, `revokeSession`, `requestDataExport`, `requestDeletion` | |
| **Catalogue** | `GET /exams`, `GET /courses`, `GET /courses/{slug}`, `GET /courses/{courseId}/outline`, `GET /search` | `listCourses`, `getCourseLanding`, `getCourseOutline`, `searchCatalog` | public, ETag |
| **Lessons** | `GET /courses/{courseId}/lessons/{lessonKey}`, `PUT /courses/{courseId}/lessons/{lessonKey}/progress`, `GET /courses/{courseId}/lessons/{lessonKey}/playback` | `getLesson`, `recordLessonProgress` | playback returns Bunny token URL |
| **Enrollments** | `GET/POST /me/enrollments`, `GET /me/courses/{courseId}/progress` | `listMyEnrollments`, `enrollInCourse`, `getCourseProgress` | |
| **Notes/Bookmarks** | `GET/POST /me/notes`, `PATCH/DELETE /me/notes/{id}`, `GET/PUT/DELETE /me/bookmarks` | learning services | |
| **Study plan** | `GET/POST /me/study-plans`, `PATCH /me/study-plans/{id}/items/{itemId}` | `createStudyPlan`, `updateStudyPlanItem` | P2 |
| **Tests** | `GET /tests`, `GET /tests/{code}` | `getTestFormLanding` | |
| **Attempts** | `POST /attempts`, `GET /attempts`, `GET /attempts/{id}`, `GET /attempts/{id}/sections/{position}`, `POST /attempts/{id}/sections/{position}/start`, `PUT /attempts/{id}/responses`, `POST /attempts/{id}/navigate`, `POST /attempts/{id}/heartbeat`, `POST /attempts/{id}/sections/{position}/submit`, `POST /attempts/{id}/submit`, `GET /attempts/{id}/result`, `GET /attempts/{id}/review` | exam-engine services | **Identical JSON contract to §5.6** (the web exam shell and the Expo shell share the client SDK `@lumen/exam-client`); `/api/exam/*` remains the web path, `/api/v1/attempts*` is its versioned alias |
| **Evaluations** | `POST /evaluations`, `GET /evaluations`, `GET /evaluations/{id}`, `POST /evaluations/{id}/human-review`, `DELETE /recordings/{id}` | evaluation services | |
| **Uploads** | `POST /uploads/presign`, `POST /uploads/{id}/confirm` | `presignUpload` | same contract as §5.4 |
| **Credits** | `GET /me/credits`, `GET /me/credits/ledger` | `getCreditBalance`, `listCreditLedger` | |
| **Commerce** | `GET /products`, `POST /cart/quote`, `POST /orders`, `GET /orders`, `GET /orders/{id}`, `POST /orders/{id}/payments`, `POST /orders/{id}/cancel`, `POST /orders/{id}/refund-requests`, `GET /me/entitlements`, `GET /invoices/{id}/pdf` | commerce services | In-app purchase is **not** used; payments open provider-hosted checkout in a system browser (Apple/Google policy review needed for digital goods — see 02/10 docs) |
| **Community** | `GET/POST /courses/{courseId}/threads`, `GET/POST /threads/{id}/answers`, `POST /reports`, `PUT /courses/{courseId}/review` | community services | |
| **Notifications** | `GET /notifications`, `POST /notifications/read`, `POST /me/push-tokens` | notifications services | push tokens P3 (`device_token` table) |
| **Guardian** | `GET /guardian/students`, `GET /guardian/students/{id}/dashboard` | `getGuardianDashboard` | `lnk` scope |
| **Org (B2B)** | `GET /orgs/{orgId}`, `GET/POST /orgs/{orgId}/members`, `DELETE /orgs/{orgId}/members/{userId}`, `GET/POST /orgs/{orgId}/cohorts`, `POST /orgs/{orgId}/seats/allocations`, `DELETE /orgs/{orgId}/seats/allocations/{id}`, `GET /orgs/{orgId}/analytics`, `POST /orgs/{orgId}/assignments` | org services | API-key capable |
| **Grader** | `GET /grader/queue`, `GET /grader/assignments/{id}`, `POST /grader/assignments/{id}/submit` | grading services | read-mostly; MFA |
| **Meta** | `GET /openapi.json`, `GET /health`, `GET /version` | — | `health` unauthenticated |

Staff/CMS/finance back-office remains web-only (server actions) in P3.

### 6.5 Rate limits (per route class)

Implemented by `checkRateLimit(class, key)`: **Upstash Redis `slidingWindow` first (D3; `@upstash/ratelimit`), Postgres `rate_limit_bucket` (fixed 60 s window + 1 s burst smoothing) as the fallback store and for durable business quotas** (production forces `RATE_LIMIT_BACKEND=redis`; local dev may use `postgres`) and duplicated at the edge (Cloudflare rate-limiting rules for `auth`, `webhook`, `public`). Keys: authenticated ⇒ `userId`; anonymous ⇒ `ipHash`. Response headers: `RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset` (seconds), `Retry-After` on 429.

| Class | Applies to | Limit | Key | On store failure |
|---|---|---|---|---|
| `public` | catalogue/search GETs, `/health` | 120/min | IP (+ user if auth) | fail-open |
| `read` | authenticated GETs | 180/min | user | fail-open |
| `write` | authenticated mutations (default) | 60/min | user | fail-closed |
| `auth` | sign-in/up, OTP send/verify, password reset (Better Auth + Turnstile) | 10/min/IP; **OTP send 5/hour per phone/email, 20/day per IP**; **verify 5 attempts per code** (D12 C8: 6 digits, 5 min TTL) | IP + identifier | fail-closed |
| `exam` | `/api/exam/*`, `/api/v1/attempts*` | 120/min | **attempt id** | fail-open for heartbeat/autosave (never block an exam on limiter outage), fail-closed for start/submit |
| `ai_eval` | `requestEvaluation`, `requestHumanReview` | **10/hour per user, 2 concurrent; daily ceiling by tier** (Free 1, Core 3, Pass 4, Plus/Live/Mentor 6) — canonical table in **09 section 10.2** (no 30/day constant) | user | fail-closed (cost control) |
| `ai_tutor` / `ai_coach` / `ai_partner` | `/api/tutor/stream`, coach micro-actions, speaking partner | 6 msgs/min burst + daily fair-use meters; partner concurrency 1 — 09 section 10.2 | user | fail-closed |
| `support` | `/api/contact`, Chatwoot identity, dispute/claim submit | contact 5/h/IP; claims 3/day | user + IP | fail-closed |
| `upload` | presign/confirm | 30/min | user | fail-closed |
| `checkout` | `createOrder`, `startPayment`, coupon validate | 10/min; coupon attempts 10/hour | user + IP | fail-closed |
| `community` | create thread/answer/review/report | 5 threads/hour, 30 answers/hour, 10 reports/hour | user | fail-closed |
| `export` | data export/deletion requests | 1/day | user | fail-closed |
| `staff` | all staff-role endpoints | 300/min | user | fail-open |
| `webhook` | `/api/webhooks/*` | 600/min | IP (edge only) | n/a |
| `apikey` | org API keys | 600/min, per-key override | key id | fail-closed |

### 6.6 Versioning & deprecation policy
* **URL-major versioning** (`/api/v1`). Within a major, only **additive, backward-compatible** changes: new endpoints, new optional request fields, new response fields, new enum values *only where the field is documented as open* (clients must tolerate unknown enum values; the spec marks closed enums explicitly). Anything else — removing/renaming fields or endpoints, tightening validation, changing semantics/status codes, changing pagination or auth — is a **breaking change** requiring `/api/v2`.
* **Deprecation process:** announce in changelog (`/developers/changelog`) + email to API-key owners and the mobile team; mark operations `deprecated: true` in OpenAPI; send `Deprecation: @<unix-ts>` (RFC 9745) and `Sunset: <HTTP-date>` (RFC 8594) plus `Link: <…/migration>; rel="deprecation"` headers on affected responses; minimum support window **12 months** after announcement for public/API-key clients, **6 months** for first-party mobile (which additionally uses a `minimumSupportedAppVersion` kill-switch from `feature_flag`). After sunset the endpoint returns `410 Gone` problem+json with migration link.
* **Mobile compatibility:** app sends `X-App-Version` and `X-Platform`; server may reply `426 Upgrade Required` (problem type `app/upgrade-required`) only for security-critical cuts.
* **Contract tests:** CI runs `oasdiff breaking` between the PR spec and `main`; breaking diff fails the build unless the PR bumps the major. Generated TypeScript client `@lumen/api-client` published in the monorepo from the spec.
* **Stability labels** in OpenAPI tags: `stable`, `beta` (may change within the major with 30-day notice), `internal` (excluded from public spec).

---

## 7. Domain events & Inngest functions

### 7.1 Domain events

All events are written with `emit(tx, name, payload, dedupeKey)` into `outbox_event` and delivered to Inngest as `{ name, data, id: dedupeKey }`. Payload schemas live in `packages/core/<domain>/events.ts` (zod; `v` field = payload version). Payloads carry ids and minimal scalars only (no PII beyond `userId`).

| Event | Emitted by | Payload (key fields) | Consumers (Inngest function ids) |
|---|---|---|---|
| `user.signed_up` | Better Auth `user.create.after` hook | `userId, method, locale, ageBand?` | `identity.provision-new-user` (student role row, `ai_credit_balance`, `streak`, notification prefs, welcome email unless placeholder email), `analytics.track` |
| `user.onboarded` | `completeOnboarding` | `userId, examId, targetScore, examDate` | `learning.create-initial-study-plan` (P2), `notifications.send-welcome` |
| `user.profile_updated` | `updateProfile` | `userId, changed[]` | `analytics.identify` |
| `guardian.invited` / `guardian.link_granted` / `guardian.link_revoked` | identity | `linkId, studentId, guardianId?` | `notifications.send-guardian-invite`, `notifications.notify-student` |
| `privacy.export_requested` | `requestDataExport` | `requestId, userId` | `privacy.export` |
| `privacy.deletion_requested` | `requestDeletion` | `requestId, userId, executeAfter` | `privacy.schedule-erasure` (reminders), `privacy.erase` (cron-picked) |
| `role.granted` / `role.revoked` | rbac | `userId, role, orgId?, by` | `identity.rotate-sessions`, `notifications.notify-user`, `audit` (already written) |
| `instructor.approved` | rbac | `userId` | `notifications.send-instructor-welcome` |
| `org.created` / `org.member_invited` / `org.member_joined` / `org.member_removed` | organizations | `orgId, userId?, email?` | `notifications.send-org-invite`, `analytics.track` |
| `org.seat_allocated` / `org.seat_released` | organizations | `orgId, seatEntitlementId, userId, userEntitlementId` | `learning.enroll-from-seat` (auto-enroll assigned courses), `notifications.notify-user` |
| `org.members_import_requested` | organizations | `importId, orgId, csvR2Key` | `organizations.import-members` |
| `org.assignment_created` | organizations | `assignmentId, orgId, cohortId?, kind, targetId, dueAt?` | `organizations.fanout-assignment` (enroll + notify members), `notifications.schedule-due-reminders` |
| `course.created` | catalog | `courseId, ownerId` | — |
| `course.submitted` | catalog | `courseVersionId, courseId, submittedBy` | `notifications.notify-editors` (review queue) |
| `course.review_decided` | catalog | `courseVersionId, decision` | `notifications.notify-instructor` |
| `course.published` | catalog | `courseId, courseVersionId, versionNumber, firstPublish` | `catalog.revalidate-public` (Next tags/sitemap), `search.index-course` (P3 Meilisearch), `learning.notify-enrolled-of-update` (only if `changeNote` flagged "notify"), `commerce.sync-course-product` |
| `course.archived` | catalog | `courseId` | `catalog.revalidate-public` |
| `media.uploaded` | catalog/uploads | `mediaAssetId, kind` | `media.process-upload` |
| `media.ready` | Bunny sync | `mediaAssetId, durationMs` | `catalog.update-lesson-durations` |
| `cms.page_published` | catalog | `pageId, kind, slug, locale` | `catalog.revalidate-public` |
| `question.submitted` / `question.published` | assessment | `questionVersionId, questionId` | `notifications.notify-editors`, `assessment.warm-caches` |
| `test_form.published` | assessment | `testFormId, versionId` | `catalog.revalidate-public`, `assessment.precompute-form-cache` |
| `enrollment.created` | learning | `enrollmentId, userId, courseId, source, orgId?` | `learning.on-enrollment-created` (course.enrollment_count++, init `course_progress`, welcome-to-course notification), `analytics.track` |
| `lesson.completed` | learning | `userId, courseId, lessonKey` | `learning.recompute-course-progress`, `learning.award-xp` |
| `course.completed` | learning | `userId, courseId` | `learning.issue-certificate` (P1), `notifications.course-complete`, `community.prompt-review` |
| `studyplan.created` / `studyplan.replanned` | learning | `planId, userId` | `notifications.notify-user` |
| `streak.updated` | learning | `userId, current, longest` | `notifications.streak-milestones` |
| `order.created` | commerce | `orderId, userId, payerId, currency, totalMinor` | `commerce.expire-order-timer` (scheduled `order.expired` check at +30 min), `analytics.track` |
| `payment.initiated` / `payment.failed` | commerce | `paymentId, orderId, provider, reason?` | `notifications.payment-failed` (with retry link), `analytics.track` |
| **`order.paid`** | `markOrderPaid` | `orderId, paymentId, userId, payerId, orgId?, totalMinor, currency` | **`commerce.fulfil-order`** (entitlements, credits, seats, enrol), `commerce.issue-invoice`, `notifications.send-receipt`, `commerce.record-affiliate-commission` (P2), `analytics.track-purchase` |
| `order.fulfilled` | `fulfilOrder` | `orderId, entitlementIds[]` | `notifications.access-ready`, `learning.auto-enroll-purchased-course` |
| `order.cancelled` / `order.expired` | commerce | `orderId` | `commerce.release-coupon` |
| `entitlement.granted` | commerce | `entitlementId, userId?, orgId?, scope, endsAt?` | `commerce.invalidate-access-cache`, `notifications.expiry-schedule` (queue T-7/T-1), `learning.enroll-from-entitlement` |
| `entitlement.revoked` / `entitlement.expired` | commerce | `entitlementId, userId` | `commerce.invalidate-access-cache`, `learning.mark-enrollment-expired`, `notifications.access-ended` |
| `entitlement.expiring` | cron | `entitlementId, daysLeft` | `notifications.renewal-reminder` |
| `subscription.renewed` | provider handler | `subscriptionId, userId, orderId` | `commerce.fulfil-order` |
| `refund.requested` | commerce | `refundId, orderId, withinPolicy` | `notifications.notify-finance` |
| `refund.approved` | commerce | `refundId` | `commerce.execute-refund` |
| `refund.succeeded` / `refund.failed` | commerce | `refundId, orderId` | `commerce.post-refund` (revoke entitlements, reverse credits, credit note, order status), `notifications.refund-result` |
| `invoice.issued` | commerce | `invoiceId, orderId` | `notifications.send-receipt` (attaches PDF) |
| `credits.adjusted` | evaluation/commerce | `userId, delta, reason` | `notifications.credits-low` (≤ 1 left) |
| `product.updated` | commerce | `productId` | `catalog.revalidate-public` |
| **`attempt.started`** | exam | `attemptId, userId, testFormId, versionId` | `exam.schedule-expiry` (sleepUntil `expires_at`), `analytics.track` |
| `attempt.section_started` | exam | `attemptId, attemptSectionId, position, endsAt` | `exam.expire-section` |
| `attempt.section_submitted` | exam | `attemptId, position, expired:boolean` | `analytics.track` |
| `attempt.time_extended` | exam | `attemptId, extraSeconds, by` | `notifications.notify-user` |
| **`attempt.submitted`** | `submitAttempt`/`expireSection` | `attemptId, userId, testFormId, hasWriting, hasSpeaking` | **`exam.score-attempt`**, `evaluation.queue-from-attempt` |
| `attempt.scored` | `scoreAttempt` | `attemptId, userId, overall?` | `notifications.results-ready`, `learning.award-xp`, `learning.replan-study-plan` (P2), `analytics.track`, `org.update-cohort-stats` |
| `evaluation.requested` | evaluation | `evaluationRequestId, userId, kind, mode` | `evaluation.transcribe-recordings` (speaking) → `evaluation.run-ai` ; `evaluation.auto-assign` when `mode≠ai` |
| `recording.transcribed` | evaluation | `recordingId, evaluationRequestId` | `evaluation.run-ai` (when all parts transcribed) |
| `evaluation.completed` | evaluation | `evaluationRequestId, userId, kind, source, finalBand` | `exam.merge-evaluation-into-score`, `notifications.evaluation-ready`, `learning.award-xp`, `evaluation.quality-sample` (5 % to human QA) |
| `evaluation.failed` | evaluation | `evaluationRequestId, reason` | `evaluation.reverse-credit`, `notifications.evaluation-failed`, alert |
| `evaluation.human_requested` / `grader.assigned` | evaluation | `evaluationRequestId, graderId?, dueAt?` | `notifications.notify-grader`, `evaluation.sla-watch` |
| `evaluation.overridden` | evaluation | `evaluationRequestId, resultId` | `exam.merge-evaluation-into-score`, `notifications.evaluation-ready` |
| `thread.created` | community | `threadId, courseId, authorId` | `notifications.notify-course-staff` |
| `answer.created` | community | `answerId, threadId, authorId, isStaff` | `notifications.notify-thread-author` |
| `review.created` | community | `reviewId, courseId, rating` | `community.recompute-course-rating` |
| `report.created` | community | `reportId, targetType, targetId` | `community.auto-moderate`, `notifications.notify-moderators` |
| `flag.changed` | platform | `key, enabled` | `platform.flag-cache-bust` |
| `webhook.received` | webhook routes (direct `inngest.send`, not outbox) | `webhookEventId, provider` | `webhooks.process-<provider>` |
| `order.shipment_updated` | commerce | `orderId, shipmentId, status` | `notifications.dispatch` (shipping updates, COD reminders) |
| `auth.otp_requested` / `auth.email_verification_requested` / `auth.magic_link_requested` | Better Auth hooks | `userId?, channel, purpose, templateId` (never the code) | `notifications.dispatch` (class `S`; OTP 6 digits / 5 min, verification link 60 min, D12 C8) |
| `auth.new_device_sign_in` / `auth.two_factor_changed` / `auth.two_factor_disable_requested` / `auth.passkey_changed` / `auth.password_changed` / `auth.contact_changed` / `auth.sessions_revoked` | identity | `userId, deviceHash?, by` | `notifications.dispatch` (security notices, class `S`), `identity.rotate-sessions` where relevant |
| `security.suspicious_activity` | identity / enforcement | `userId, signal, score` | `notifications.dispatch`, `support.open-abuse-review` |
| `support.impersonation_started` | `startImpersonation` | `staffId, targetUserId, reasonCode` | `notifications.dispatch` (notice to target per policy), audit |
| `certificate.issued` | learning | `certificateId, userId, courseId` (verify code is never in the payload) | `notifications.dispatch` (`/verify/[code]` link), `analytics.track` |
| `achievement.unlocked` | learning | `userId, achievementKey` | `notifications.dispatch` (in-app) |
| `question.corrected` | assessment | `questionId, versionId, impactedAttempts` | `exam.rescore-attempts` |
| `attempt.rescored` | exam | `attemptId, deltaOverall` | `notifications.dispatch`, `learning.replan-study-plan` (P2) |
| `attempt.voided` | exam / support | `attemptId, scope: 'section'\|'attempt', by, reissued` | `notifications.dispatch`, `analytics.track` (`mode` vs `scope`, 32 Y3) |
| `attempt.credit_granted` | exam / support | `userId, kind: 'resit'\|'mock', by` | `notifications.dispatch` |
| `live.session_scheduled` / `live.session_changed` / `live.reminder_due` / `live.recording_ready` / `live.attendance_below_threshold` | live ops (P1 manual import, P2 in-app) | `liveSessionId, batchId, slot` | `notifications.dispatch` (T-24h / T-1h / T-15m slots), `guarantee.watch-attendance` |
| `speaking_club.booked` | live | `bookingId, userId` | `notifications.dispatch` |
| `payment.verifying` / `payment.reconcile_delayed` / `payment.reconciled` / `payment.held_review` | commerce / finance | `paymentId, orderId, reason?` | `notifications.dispatch` (payment-status messages incl. money-deducted-no-access), `finance.review-queue` |
| `subscription.renewal_upcoming` | cron | `subscriptionId, daysLeft` | `notifications.dispatch` (T-7 default, T-14/T-3 configurable) |
| `instalment.due_soon` / `instalment.missed` / `instalment.paid` | commerce | `instalmentId, orderId` | `notifications.dispatch`, `finance.instalment-watch` |
| `scholarship.decided` | commerce | `applicationId, outcome` | `notifications.dispatch` |
| `guarantee_claim.status_changed` | guarantee | `claimId, status` | `notifications.dispatch`, `finance.provision-update` |
| `entitlement.extended` | commerce | `entitlementId, endsAt, source` | `notifications.dispatch`, `commerce.invalidate-access-cache` |
| `referral.rewarded` | commerce | `referralId, userId` | `notifications.dispatch` |
| `guardian.consent_requested` / `guardian.link_requested` | identity | `linkId, studentId` | `notifications.dispatch` |
| `counsellor.session_reminder_due` / `essay_feedback.requested` | admissions (P2) | `sessionId` / `draftId` | `notifications.dispatch` |
| `support.sla_breach` | support | `ticketId, tier, slaKind` | `notifications.dispatch` (internal), `support.escalate` |
| `privacy.export.completed` / `privacy.deletion_cancelled` / `privacy.erased` | privacy | `requestId, userId?` | `notifications.dispatch` (T class; deletion reminders on day 7 and 13 of the 14-day grace) |
| `consent.recorded` / `policy.published` | identity / platform | `consentId` / `policyVersionId, material` | `notifications.dispatch` (policy notices; >= 30 days before effective for material changes), `identity.require-reacceptance` |
| `incident.breach_notified` | platform | `incidentId, audience` | `notifications.dispatch` (T class) |
| `accommodation.requested` / `accommodation.decided` | exam / support | `userId, multiplier?, outcome` | `notifications.dispatch` |
| `account.enforcement_applied` | support | `userId, level` | `notifications.dispatch`, `support.log` |
| `user.inactive_sunset` | cron | `userId, stage` | `notifications.dispatch`, `privacy.schedule-erasure` |
| `quiz.result_emailed` | catalog (tools) | `quizResultId, contactHash` | `notifications.dispatch` (lifecycle enrolment `which-test-quiz`) |
| `support.ticket_created` / `support.ticket_resolved` | support | `ticketId, tier` | `analytics.track`, `notifications.dispatch` (CSAT request) |
| `dispute.opened` / `dispute.decided` | support | `disputeId, kind` | `notifications.dispatch`, `finance.chargeback-watch` |
| `guarantee.submitted` / `guarantee.decided` | guarantee | `claimId` | `support.review-queue`, `notifications.dispatch` |
| `moderation.actioned` / `enforcement.applied` | support | `caseId` / `enforcementId` | `notifications.dispatch`, `analytics.track` |
| `model_release.promoted` / `ai_budget.threshold_crossed` | ai-ops | `modelReleaseId` / `provider, pct` | `platform.alert`, `evaluation.quality-sample` retune |
| `tutor.message_created` / `srs.review_logged` | ai-learning | `conversationId` / `cardId` | `analytics.track` (counts only), fair-use meters |

### 7.2 Inngest function catalogue

Client: `new Inngest({ id: 'lumen', schemas: new EventSchemas().fromRecord<EventPayloads>(), middleware: [sentryMiddleware, actorMiddleware] })`. Shape below follows Inngest TS SDK v3+ (`createFunction({ id, retries, concurrency, throttle, idempotency, onFailure }, trigger, handler)`); verify option names against the installed major before coding. **Rules for every function:** (1) handler is idempotent (steps keyed deterministically; DB writes use natural keys/`ON CONFLICT`); (2) side effects in `step.run` with stable step ids; (3) calls services with `systemActor('inngest:<id>')` — never raw SQL business logic; (4) global `onFailure` → writes `job_dead_letter` and notifies Sentry; (5) external calls have timeouts and use the adapter circuit breaker.

| Function id | Trigger | Retries | Concurrency / throttle | Idempotency key | What it does |
|---|---|---|---|---|---|
| `platform.outbox-relay` | cron `* * * * *` | 3 | 1 | — | sends unpublished `outbox_event` rows (`id=dedupe_key`), marks `published_at` |
| `webhooks.process-sslcommerz` | `webhook.received` (provider=sslcommerz) | 8, backoff to ~1 h | key `payment` · 5 per `merchant_ref` | `event.data.webhookEventId` | validate via API, `markOrderPaid`, status updates (§5.2) |
| `webhooks.process-paddle` / `webhooks.process-stripe` | `webhook.received` | 8 | per provider 10 | `webhookEventId` | map event → service (`markOrderPaid`, `renewSubscription`, `executeRefund` result, dispute → `risk_hold`) |
| `webhooks.process-bunny` | `webhook.received` | 5 | 10 | `webhookEventId` | re-fetch video from Bunny API → `media_asset` → `media.ready` |
| `webhooks.process-resend` | `webhook.received` | 5 | 20 | `webhookEventId` | update `email_log`, suppress |
| `commerce.fulfil-order` | `order.paid`, `subscription.renewed` | 10 (exponential, max 6 h) | 20; key `event.data.userId` = 1 (serialise per user, R7 locking) | `event.data.orderId + ':' + (paymentId)` | **step 1** load order+items; **2** `grantEntitlements` per item (`grant_key`); **3** credits ledger grants; **4** org seats pool entitlement; **5** emit `order.fulfilled`; on repeated failure alert (customer paid, no access) |
| `commerce.issue-invoice` | `order.paid` | 8 | 5 | `orderId` | `issueInvoice` (gap-free counter), render PDF (React-PDF), upload to R2, emit `invoice.issued` |
| `commerce.expire-orders` | cron `*/5 * * * *` | 3 | 1 | — | `expireOrders` + coupon release |
| `commerce.expire-order-timer` | `order.created` | 3 | — | `orderId` | `step.sleepUntil(expiresAt+1m)` then expire if still pending (fast path; cron is the safety net) |
| `commerce.execute-refund` | `refund.approved` | 6 | 5 per payment | `refundId` | provider refund call (idempotent key `refundId`), then emits `refund.succeeded/failed` |
| `commerce.post-refund` | `refund.succeeded` | 8 | 5 | `refundId` | revoke entitlements + re-chain, reverse credits (`refund_return`), credit note, order status, coupon decrement |
| `commerce.expiry-notices` | cron `0 3 * * *` (09:00 BDT) | 3 | 1 | — | finds entitlements ending in 7 d / 1 d (pass/subscription BD prepaid) → `entitlement.expiring` |
| `commerce.reconcile-payments` | cron `*/15 * * * *` | 3 | 1 | — | for `payment` in `initiated|pending` older than 10 min: query provider (SSLCommerz transaction query API by `tran_id`), settle or mark `expired`/`failed` — **safety net for missed IPNs** |
| `commerce.grant-credits-for-item` | `order.paid` (via fulfil) | 10 | 1 per user | `orderItemId:grantId` | ledger insert idempotent via `idempotency_key` |
| `commerce.invalidate-access-cache` | `entitlement.*` | 3 | 50 | — | bump per-user entitlement version key |
| `commerce.compute-payouts` (P3) | cron monthly | 3 | 1 | `period` | build `payout` + `payout_line` |
| `exam.schedule-expiry` | `attempt.started` | 3 | — | `attemptId` | `step.sleepUntil(expires_at)` → `expireAttempts` for that attempt |
| `exam.expire-section` | `attempt.section_started` (emitted by `startSection`) | 5 | — | `attemptSectionId` | `step.sleepUntil(ends_at + 30 s + 2 s)` → `expireSection` (backstop; reads also expire lazily) |
| `exam.expire-attempts` | cron `*/10 * * * *` | 3 | 1 | — | sweep attempts past `expires_at` / paused > 24 h |
| `exam.score-attempt` | `attempt.submitted` | 6 | 20; per user 2 | `attemptId` | `scoreAttempt` (objective) → `attempt.scored`; marks `is_complete=false` rows pending evaluation |
| `exam.merge-evaluation-into-score` | `evaluation.completed`, `evaluation.overridden` | 6 | per attempt 1 | `evaluationRequestId:resultId` | supersede writing/speaking `attempt_score` rows, recompute overall band (IELTS: mean of 4 skills rounded to nearest 0.5 per official rounding rules in `packages/core/exam/ielts-rounding.ts`; GRE reported per section) |
| `evaluation.queue-from-attempt` | `attempt.submitted` | 5 | 20 | `attemptId` | creates `evaluation_request`s for writing/speaking items (credits per form config) |
| `evaluation.transcribe-recordings` | `evaluation.requested` (speaking) | 5, backoff | **throttle 30/min** global (STT quota) | `recordingId` | Deepgram Nova-3 (word timestamps) with whisper-1 fallback; stores transcript → `recording.transcribed` |
| `evaluation.run-ai` | `evaluation.requested` (writing/awa), `recording.transcribed` | 4 (fail → credit reversal) | **concurrency 10; throttle 60/min** (LLM quota) | `evaluationRequestId` | prompt build (`packages/ai`), Sonnet band scoring + Haiku feedback pass, zod validate, fallback model (Gemini) on provider error, persist result with model/prompt/cost, emit `evaluation.completed`; moderation of output; PII-safe logging |
| `evaluation.reverse-credit` | `evaluation.failed` | 8 | — | `evaluationRequestId` | ledger `reversal` |
| `evaluation.auto-assign` | `evaluation.human_requested`, `evaluation.completed` (mode ai_then_human), cron `*/10` | 5 | 1 | `evaluationRequestId` | picks grader by queue length/skill, sets SLA |
| `evaluation.sla-watch` | `grader.assigned` | 3 | — | `assignmentId` | `sleepUntil(due_at)` → reassign/escalate if not completed |
| `evaluation.quality-sample` | `evaluation.completed` | 3 | — | `evaluationRequestId` | 5 % sample to human QA queue; drift stats |
| `evaluation.purge-audio` | cron daily | 3 | 1 | — | deletes expired recordings (`audio_delete_after` = completion + **90 days**, D12 C6; skips consented-retention and open-dispute rows) (`lumen_maintenance`) |
| `learning.on-enrollment-created` | `enrollment.created` | 5 | 20 | `enrollmentId` | counters, `course_progress` init, welcome notification |
| `learning.recompute-course-progress` | `lesson.completed` | 5 | per `userId:courseId` 1 | `userId:courseId` (debounce 5 s via `debounce` option) | `recomputeCourseProgress` |
| `learning.award-xp` | `lesson.completed`, `attempt.scored`, `evaluation.completed` | 5 | per user 1 | `type:sourceId` | `awardXp`, streak |
| `learning.replan-study-plan` (P2) | `attempt.scored` | 3 | per user 1 | `attemptId` | AI/ruleset replan |
| `learning.fanout-assignment` / `organizations.fanout-assignment` | `org.assignment_created` | 5 | 5 | `assignmentId` | enroll cohort members with entitlements; notify |
| `organizations.import-members` | `org.members_import_requested` | 3 | 2 per org | `importId` | CSV rows → invitations/members with per-row report |
| `organizations.refresh-cohort-stats` | cron `*/15 * * * *` | 3 | 1 | — | `REFRESH MATERIALIZED VIEW CONCURRENTLY mv_cohort_progress`, `mv_course_daily` |
| `media.process-upload` | `media.uploaded` | 5 | 10 | `mediaAssetId` | AV scan (ClamAV/VirusTotal API) for docs, probe, strip EXIF, thumbnails; sets `ready` |
| `media.sync-bunny-video` | `webhook.received` bunny | 6 | 10 | `webhookEventId` | see above |
| `platform.cleanup-orphan-uploads` | cron daily | 3 | 1 | — | removes unconfirmed presigned objects > 24 h |
| `notifications.*` (templates) | respective events | 5, exponential | 50 | `dedupeKey` (e.g., `receipt:${orderId}`) | `notify` + `sendEmail` (Resend), skips placeholder emails/suppressed; SMS only for OTP/payment (via Better Auth/SmsProvider) |
| `catalog.revalidate-public` | `course.published`, `course.archived`, `product.updated`, `cms.page_published`, `test_form.published` | 3 | 5 | — | calls signed internal `/api/internal/revalidate` (tags + paths) |
| `search.index-course` (P3) | `course.published` | 5 | 5 | `courseVersionId` | Meilisearch upsert |
| `assessment.refresh-question-stats` | cron `0 20 * * *` (02:00 BDT) | 3 | 1 | — | `refreshQuestionStats` |
| `analytics.track` | various | 3 | 50 | `event.id` | PostHog server capture (consent-aware, no PII) |
| `privacy.export` | `privacy.export_requested` | 3 | 2 | `requestId` | §05-7.3 |
| `privacy.erase` | cron hourly (+ event) | 3 | 1 | `requestId` | §05-7.4 (runs with `lumen_maintenance` creds) |
| `privacy.schedule-erasure` | `privacy.deletion_requested` | 3 | — | `requestId` | **14-day grace** (D12 C7): reminder emails on day 7 and day 13 (29), cancellable by signing in; erasure job picks up after `executeAfter` |
| `audit.anchor-chain` / `audit.verify-chain` | cron daily / weekly | 3 | 1 | — | 05 §5.4 |
| `maintenance.*` | cron (05 §8) | 3 | 1 | — | retention jobs |
| `identity.provision-new-user` | `user.signed_up` | 5 | 20 | `userId` | role row, credit balance (**free tier: 2 credits at sign-up + 1 per calendar month**, D12 C1, integer ledger), streak, prefs, welcome mail |
| `identity.rotate-sessions` | `role.granted/revoked` | 3 | 10 | `eventId` | revoke target sessions |
| `webhooks.dead-letter-sweeper` | cron hourly | 2 | 1 | — | alerts on `webhook_event.status in ('received','failed')` older than 15 min |
| `notifications.dispatch` | all notification-bearing events | 5, exponential | 50 | `dedupeKey` (`<template>:<entityId>[:<slot>]`) | the single gate (29): class, consent, `contact_suppression`, quiet hours, caps, locale; only module allowed to import `EmailProvider`/`SmsProvider` |
| `support.sync-sla-timers` | cron `*/5 * * * *` | 3 | 1 | — | evaluates open `support_ticket` SLA by tier; emits `support.sla_breach` |
| `support.purge-tickets` / `support.purge-csat` / `support.purge-moderation` / `support.purge-guarantee-docs` | cron daily | 3 | 1 | — | 24 months after close / 24 months / 2 years after decision / TRF 24 months after decision (27 section 19.3) |
| `guarantee.watch-attendance` | `live.attendance_below_threshold`, cron weekly | 3 | 1 | `entitlementId:week` | updates promise progress; warns learners at risk of losing Progress Promise eligibility |
| `exam.rescore-attempts` | `question.corrected` | 5 | 2 | `questionId:versionId` | rescoring runbook (GA-044): recompute, keep history, emit `attempt.rescored`, learner notice |
| `finance.import-settlement` | upload event / cron daily | 5 | 1 | `settlementReportId` | parse gateway statements -> `settlement_line` |
| `finance.reconcile` | cron daily (07:00 BDT) + weekly deep run | 3 | 1 | `period:provider` | match gateway vs `payment` vs bank; open `reconciliation_item`s (extends `commerce.reconcile-payments`, which stays the 15-minute missed-IPN safety net) |
| `finance.recognize-revenue` | cron monthly | 3 | 1 | `period` | `revenue_schedule` -> ledger |
| `finance.prepare-payout-statements` | cron monthly (day 3) | 3 | 1 | `period` | drafts statements for finance review; manual payout in P1-P2 |
| `ai-ops.nightly-canary` / `ai-ops.weekly-psi` / `ai-ops.monthly-audit` | cron | 3 | 1 | `date` | eval runs on gold set; alerts to assessment lead; blocks model promotion on regression (31) |
| `ai-ops.budget-watch` | cron hourly | 3 | 1 | — | `ai_budget` thresholds 70%/100% -> `ai_budget.threshold_crossed`, circuit breaker |
| `ai-learning.ingest-content-chunks` | `course.published`, `question.published` | 5 | 5 | `versionId` | chunk + embed (`EMBEDDING_*`), store `embedding_model` per row; retire old chunks (`retired_at`) |
| `ai-learning.ingest-notebook-source` (P2) | notebook source registered | 5 | 5 | `sourceId` | scan, sanitise, chunk, embed |
| `ai-learning.weekly-progress-report` | cron weekly | 3 | 5 | `userId:week` | `progress_report` + dispatch |
| `ai-learning.reset-meters` | cron hourly | 3 | 1 | — | rolls local-midnight meter rows |
| `learning.issue-certificate` | `course.completed` | 5 | 5 | `userId:courseId` | **P1** (D12 C4): PDF + public `/verify/[code]` page; `certificate.issued` |
| `platform.global-on-failure` | `inngest/function.failed` | 0 | — | — | writes `job_dead_letter`, Sentry alert (paged for `commerce.*` and `exam.*`) |

**Ordering guarantees** needed by flows: (a) `order.paid` → `commerce.fulfil-order` is the only writer of purchase entitlements (serialised per user); (b) `attempt.submitted` → scoring does not wait for AI; `attempt_score` rows are completed later by `exam.merge-evaluation-into-score`; (c) speaking evaluation runs only after **all** parts are transcribed (`recording.transcribed` counts parts vs. expected, using `step.waitForEvent` with 15-min timeout).

---

## 8. Surfaces: route groups ↔ services (D2)

Routes use the canonical groups under `apps/web/app/[locale]/…` (locale prefix `as-needed`). Server actions colocated in `actions.ts` per group; exam traffic uses route handlers.

| Route group | URL prefix | Role gate (layout-level, *UX only*; services re-check) | Reads (RSC) | Mutations |
|---|---|---|---|---|
| `(marketing)` | `/`, `/ielts`, `/gre`, `/courses`, `/pricing`, `/blog`, `/tools/*`, `/verify/[code]`, `/help`, `/status`, `/changelog`, `/accessibility`, `/guarantee`, `/accuracy`, legal | public | `listCourses`, `getCourseLanding`, `listProducts`, `getTestFormLanding`, cms pages | contact form (`/api/contact`), newsletter; free diagnostic start → `/exam/[attemptId]` via `POST /api/exam/attempts` |
| `(auth)` | `/sign-in`, `/sign-up`, `/onboarding` (D12 C3) | public / partial | — | Better Auth endpoints; `completeOnboarding`, `recordConsent`, `inviteGuardian` |
| `(checkout)` | `/cart`, `/checkout`, `/checkout/return`, `/orders` | signed-in | `quoteCart`, `getOrder`, `listMyOrders` | `createOrder`, `startPayment`, `cancelOrder`, `requestRefund`; `POST /api/checkout/return/sslcommerz` |
| `(learner)` | `/app`, `/app/learn/[course]/[lesson]`, `/app/practice`, `/app/tests`, `/app/vocab`, `/app/plan`, `/app/progress`, `/app/settings` | `student`; `guardian` read-only views (`/app?student=`) | `getLearnerHome`, `getCourseOutline`, `getLesson`, `listMyAttempts`, `listMyEvaluations`, `getCreditBalance`, `listMyEntitlements`, `getGuardianDashboard` | `enrollInCourse`, `recordLessonProgress` (route handler), notes/bookmarks, `createThread`, `createAnswer`, `upsertReview`, `requestEvaluation`, `createStudyPlan`, `updateProfile`, privacy actions, guardian actions |
| `(exam)` | `/exam/[attemptId]` | signed-in + entitlement (diagnostic: guest/anonymous) | none server-side beyond initial `getAttemptState` | **only `/api/exam/*` route handlers** (§5.6) |
| `(studio)` | `/studio/**` | `instructor` (own), `content_editor`+ (all) — 2FA required | `listMyCourses`, `getQuestionForAuthoring`, instructor analytics, payouts (P3) | course/lesson/question/question-set services, `submitCourseForReview`, `answer*`, `moderateThread` (own courses), `updateInstructorProfile`, uploads |
| `(grader)` | `/grader/**` | `grader` — 2FA | `listGraderQueue`, `getEvaluation` | `submitGrading`, `overrideBand` |
| `(staff)` | `/editor/**` | `content_editor` | review queues, taxonomy, CMS | `reviewCourseVersion`, `publishCourseVersion`, `publishQuestionVersion`, `publishTestFormVersion`, `manageTaxonomy`, `upsertCmsPage`, `moderateReview/Report` |
| `(staff)` | `/support/**` | `support` | `adminSearchUsers`(masked), `getOrder`, `listMyEntitlements`(for user), `getAttemptResult` | `startImpersonation` (read-only), `grantEntitlement` (≤ 7 d), `grantAccommodation`, `requestRefund`, `cancelOrder`, resend receipt, `resolveReport`; `lookupUser` (masked), `revealPii`, `assignTicket`, `escalateTicket`, `decideDispute` (score), `reviewGuaranteeClaim`, `grantResit`, `creditMock`, `voidSection`/`voidAttempt` (capped), `applyEnforcement` (warning/limit), `decideModeration`, `processDsr` |
| `(staff)` | `/finance/**` | `finance` | orders, payments, refunds, invoices, revenue, VAT, payouts | `approveRefund`, `upsertProduct`, `setPrice`, `createCoupon`, `grantEntitlement`, `revokeEntitlement`, `adjustCredits`, `issueInvoice`, `exportVat`, `approvePayout`; `uploadSettlementReport`, `resolveReconciliationItem`, `postManualJournal`, `preparePayoutStatements`, `upsertPayee`, `manageChargeback`, `decideGuaranteeClaim`, `exportFinance` (`approvePayoutStatement` and `closePeriod` are admin) |
| `(org)` | `/org/[orgSlug]/**` | `org_admin` of that org — 2FA | `getOrganization`, `getOrgDashboard`, members/cohorts | `inviteOrgMember`, `bulkImportMembers`, cohorts, `allocateSeat`, `assignToCohort`, `createOrder` (orgId), `exportOrgReport`, `grantAccommodation` (org) |
| `(counsellor)` | `/counsellor/**` (P2/P3, 21) | `counsellor` — 2FA required; assigned students only, with student consent | `getAdmissionsPlan` (asg), `getAdmissionsDocument` (asg) | `submitEssayFeedback`, `recordSessionNote`, `bookCounsellorSession` (own), `upsertDeadline` (asg) |
| `(admin)` | `/admin/**` | `admin`, `super_admin` — 2FA | users, orgs, audit, flags, DLQ, system health | `createOrganization`, `grantRole`/`revokeRole`, `approveInstructor`, `banUser`, `setFeatureFlag`, `replayDeadLetter`, `deleteCourse`, `voidAttempt`, `autoAssign/assignGrader`, super-admin-only: privileged role grants, secrets/key rotation; `closePeriod`, `approvePayoutStatement`, `overrideRefundPolicy`, `applyEnforcement` (suspend/terminate, second approver), `promoteModelRelease`, `setAiBudget`, `publishPolicyVersion`, `assignCounsellor`, `handleLeoRequest` |
| — | `/api/webhooks/*`, `/api/inngest`, `/api/uploads/*`, `/api/exam/*`, `/api/v1/*` (P3) | machine | | §5, §6 |

Layout gating (`requireRole(['instructor','content_editor','counsellor','admin','super_admin'])` in each group's `layout.tsx`) uses `resolveActor` — which already removes 2FA-required roles when the session is not MFA-verified — and redirects to `/sign-in/2fa-setup` (not enrolled) or `/sign-in/2fa` (not verified in this session). This is a UX convenience; **every service call re-authorises**.

---

## 9. Permission matrix

Legend — `*` all records · `pub` public/anyone · `own` the actor's own record · `ent` own record **and** requires an active entitlement (or free resource) · `org` records of the actor's own organisation (role grant's `org_id`) · `asg` records assigned to the actor · `lnk` data of a student linked via `guardian_link.status='granted'` (read-only unless stated) · `msk` read-only with PII masked (and unmasking requires a reason + audit) · `7d` allowed but result capped at 7 days · `lim` allowed except targeting `admin`/`super_admin` · `sub` subset (documented in the service) · `cap` allowed with **service-enforced caps** (mandatory reason/ticket, count or amount limits per 27 section 16, audited; e.g. support's `attempt:void`, `pii:reveal`) · for `counsellor`, `asg` means a student assigned to that counsellor **with the student's consent** · `—` denied. `admin` = every permission except those marked `—`/`lim`; `super_admin` = all. **Roles marked in D4 as 2FA-required (`grader`, `content_editor`, `support`, `finance`, `counsellor`, `admin`, `super_admin`, `instructor`, `org_admin`) have their cells ignored unless the session is MFA-verified** (`resolveActor` drops the grant). A read-only impersonation session can only exercise permissions whose action is a read/view verb.

Resolution order for a request: collect active grants → for each, find `PERMISSIONS[perm][role]` → first scope satisfied by the loaded resource wins → else `forbidden`/`not_found`. Roles are additive.

| Permission | Description | `guest` | `student` | `guardian` | `instructor` | `grader` | `content_editor` | `support` | `finance` | `counsellor` | `org_admin` | `admin` | `super_admin` |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| **Catalogue & content** | | | | | | | | | | | | | |
| `course:read_published` | Browse published courses/landing pages | * | * | * | * | * | * | * | * | * | * | ✓ | ✓ |
| `course:read_draft` | Read unpublished versions | — | — | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `course:create` | Create a course (draft) | — | — | — | * | — | * | — | — | — | — | ✓ | ✓ |
| `course:update` | Edit draft version content | — | — | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `course:submit_review` | Submit draft for review | — | — | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `course:publish` | Approve & publish a version | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `course:archive` | Archive a course/version | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `course:delete` | Soft-delete a course | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `media:upload` | Upload media/resources | — | — | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `media:read_private` | Read private media metadata/URLs for authoring | — | — | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `taxonomy:manage` | Exams, subjects, tags | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `cms_page:manage` | Blog, landing, legal, SEO pages | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `instructor_profile:update` | Edit instructor profile | — | — | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `instructor:approve` | Approve/suspend instructors | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| **Learning** | | | | | | | | | | | | | |
| `lesson:view` | Open lesson content | pub | ent | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `enrollment:create` | Enroll in a course | — | own | — | — | — | — | — | — | — | org | ✓ | ✓ |
| `enrollment:read` | Read enrollments | — | own | lnk | own | — | — | msk | — | — | org | ✓ | ✓ |
| `progress:read` | Read progress | — | own | lnk | own | — | — | msk | — | — | org | ✓ | ✓ |
| `progress:write` | Record lesson progress | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `note:manage` | Notes & bookmarks | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `study_plan:manage` | Study plans | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| **Assessment (question bank & forms)** | | | | | | | | | | | | | |
| `question:read_bank` | Browse question bank | — | — | — | own | asg | * | — | — | — | — | ✓ | ✓ |
| `question:create` | Create question (draft) | — | — | — | * | — | * | — | — | — | — | ✓ | ✓ |
| `question:update` | Edit draft question version | — | — | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `question:submit_review` | Submit question for review | — | — | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `question:publish` | Publish/retire question version | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `question_set:manage` | Manage question sets | — | — | — | own | — | * | — | — | — | — | ✓ | ✓ |
| `test_form:read` | Open a test form (start page) | pub | ent | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `test_form:manage` | Create/edit test form drafts | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `test_form:publish` | Publish/retire test form version | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| **Exam engine** | | | | | | | | | | | | | |
| `attempt:start` | Start/resume an attempt | pub | ent | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `attempt:participate` | Autosave, navigate, submit, heartbeat, pause (own attempt) | own | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `attempt:read` | Read attempt & result | — | own | lnk | — | asg | — | msk | — | — | org | ✓ | ✓ |
| `attempt:grant_accommodation` | Extra time on a section/attempt | — | — | — | — | — | — | * | — | — | org | ✓ | ✓ |
| `attempt:void` | Void an attempt | — | — | — | — | — | — | cap | — | — | — | ✓ | ✓ |
| **Evaluation** | | | | | | | | | | | | | |
| `evaluation:request` | Request AI/human evaluation (consumes credit) | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `evaluation:read` | Read evaluation & feedback | — | own | lnk | — | asg | — | msk | — | — | — | ✓ | ✓ |
| `evaluation:grade` | Grade assigned submission | — | — | — | — | asg | — | — | — | — | — | ✓ | ✓ |
| `evaluation:override_band` | Override AI band with rationale | — | — | — | — | asg | — | — | — | — | — | ✓ | ✓ |
| `evaluation:assign` | Assign/reassign graders | — | — | — | — | — | — | * | — | — | — | ✓ | ✓ |
| `ai_credit:read` | Read credit balance/ledger | — | own | — | — | — | — | msk | * | — | — | ✓ | ✓ |
| `ai_credit:grant` | Grant/debit credits manually | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| **Commerce** | | | | | | | | | | | | | |
| `product:read` | See products & prices | * | * | * | * | * | * | * | * | * | * | ✓ | ✓ |
| `product:manage` | Create/edit products, grants, bundles | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `price:manage` | Price books | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `coupon:manage` | Coupons & affiliates | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `coupon:redeem` | Apply coupon at checkout | — | own | lnk | — | — | — | — | — | — | org | ✓ | ✓ |
| `order:create` | Create checkout/order | — | own | lnk | — | — | — | — | — | — | org | ✓ | ✓ |
| `order:read` | Read orders | — | own | lnk | — | — | — | msk | * | — | org | ✓ | ✓ |
| `order:cancel` | Cancel pending order | — | own | lnk | — | — | — | * | * | — | — | ✓ | ✓ |
| `payment:read` | Read payments | — | — | — | — | — | — | msk | * | — | — | ✓ | ✓ |
| `refund:request` | Request a refund | — | own | lnk | — | — | — | * | * | — | — | ✓ | ✓ |
| `refund:read` | Read refunds | — | own | lnk | — | — | — | msk | * | — | — | ✓ | ✓ |
| `refund:approve` | Approve/reject/execute refund | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `invoice:read` | Read/download invoices | — | own | lnk | — | — | — | — | * | — | org | ✓ | ✓ |
| `invoice:issue` | Issue invoice/credit note | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `entitlement:read` | Read entitlements | — | own | lnk | — | — | — | msk | * | — | org | ✓ | ✓ |
| `entitlement:grant` | Manual grant/extension | — | — | — | — | — | — | 7d | * | — | — | ✓ | ✓ |
| `entitlement:revoke` | Revoke entitlement | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `payout:read` | Read payouts/earnings | — | — | — | own | — | — | — | * | — | — | ✓ | ✓ |
| `payout:approve` | Approve & mark payout paid | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `report:revenue` | Revenue reports | — | — | — | own | — | — | — | * | — | — | ✓ | ✓ |
| `report:vat_export` | VAT/tax exports | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| **Organisations** | | | | | | | | | | | | | |
| `org:create` | Create organisation | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `org:read` | Read organisation | — | — | — | — | — | — | msk | * | — | org | ✓ | ✓ |
| `org:update` | Update organisation | — | — | — | — | — | — | — | — | — | org | ✓ | ✓ |
| `org_member:manage` | Invite/remove members | — | — | — | — | — | — | — | — | — | org | ✓ | ✓ |
| `cohort:manage` | Cohorts & membership | — | — | — | — | — | — | — | — | — | org | ✓ | ✓ |
| `seat:allocate` | Allocate/release seats | — | — | — | — | — | — | — | — | — | org | ✓ | ✓ |
| `org_assignment:manage` | Assign courses/tests to cohorts | — | — | — | — | — | — | — | — | — | org | ✓ | ✓ |
| `org_analytics:read` | Org dashboards & exports | — | — | — | — | — | — | — | — | — | org | ✓ | ✓ |
| **Identity & access** | | | | | | | | | | | | | |
| `user:read` | Read user record | — | own | — | — | — | — | msk | msk | — | — | ✓ | ✓ |
| `user:update` | Update profile | — | own | own | own | own | own | own | own | own | own | ✓ | ✓ |
| `user:ban` | Ban/unban user | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `user:export_data` | Request own data export | — | own | own | own | own | own | own | own | own | own | ✓ | ✓ |
| `user:delete` | Request own deletion | — | own | own | own | own | own | own | own | own | own | ✓ | ✓ |
| `user:impersonate` | Read-only impersonation (reason, audited) | — | — | — | — | — | — | * | — | — | — | ✓ | ✓ |
| `guardian_link:manage` | Invite/consent/revoke guardian links | — | own | lnk | — | — | — | — | — | — | — | ✓ | ✓ |
| `role:grant` | Grant roles (not admin/super_admin) | — | — | — | — | — | — | — | — | — | — | lim | ✓ |
| `role:revoke` | Revoke roles (not admin/super_admin) | — | — | — | — | — | — | — | — | — | — | lim | ✓ |
| `role:grant_privileged` | Grant/revoke admin & super_admin | — | — | — | — | — | — | — | — | — | — | — | ✓ |
| **Community** | | | | | | | | | | | | | |
| `thread:create` | Ask a question | — | ent | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `thread:read` | Read Q&A | — | ent | — | own | — | * | msk | — | — | — | ✓ | ✓ |
| `answer:create` | Answer a thread | — | ent | — | own | — | * | * | — | — | — | ✓ | ✓ |
| `thread:moderate` | Hide/pin/resolve threads | — | — | — | own | — | * | * | — | — | — | ✓ | ✓ |
| `review:create` | Rate a course | — | ent | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `review:moderate` | Moderate reviews | — | — | — | — | — | * | * | — | — | — | ✓ | ✓ |
| `report:create` | Report content | — | * | * | * | * | * | * | * | * | * | ✓ | ✓ |
| `report:resolve` | Resolve moderation reports | — | — | — | — | — | * | * | — | — | — | ✓ | ✓ |
| **Support & trust (27)** | | | | | | | | | | | | |
| `ticket:read` | Read support tickets (Chatwoot-mirrored metadata) / own tickets | — | own | — | — | — | — | msk | — | — | — | ✓ | ✓ |
| `ticket:reply` | Reply / act on tickets in the helpdesk | — | — | — | — | — | — | * | — | — | — | ✓ | ✓ |
| `ticket:assign` | Assign / escalate tickets | — | — | — | — | — | — | * | — | — | — | ✓ | ✓ |
| `ticket:merge` | Merge tickets | — | — | — | — | — | — | * | — | — | — | ✓ | ✓ |
| `macro:read` | Use macros | — | — | — | — | — | — | * | — | — | — | ✓ | ✓ |
| `macro:manage` | Author / publish macros (en/bn QA) | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `csat:read` | Read CSAT | — | — | — | — | — | — | * | — | — | — | ✓ | ✓ |
| `moderation:read` | Read moderation queue | — | — | — | — | — | * | * | — | — | — | ✓ | ✓ |
| `moderation:decide` | Decide moderation cases (S15: ownership open) | — | — | — | — | — | * | * | — | — | — | ✓ | ✓ |
| `moderation:appeal_decide` | Decide moderation appeals | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `dispute:open` | Open a score or payment dispute | — | own | lnk | — | — | — | * | — | — | — | ✓ | ✓ |
| `dispute:read` | Read disputes | — | own | — | — | — | — | msk | * | — | — | ✓ | ✓ |
| `dispute:decide` | Decide disputes (support: score disputes with credit caps; finance: payment disputes) | — | — | — | — | — | — | cap | * | — | — | ✓ | ✓ |
| `guarantee:read` | Read guarantee / promise progress and claims | — | own | lnk | — | — | — | msk | * | — | — | ✓ | ✓ |
| `guarantee:submit` | Submit a Target / Progress Promise claim | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `guarantee:review` | Verify claim eligibility and TRF | — | — | — | — | — | — | * | — | — | — | ✓ | ✓ |
| `guarantee:decide` | Approve / reject claim (extension or re-enrolment) | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `enforcement:apply_warning` | Apply warning (abuse ladder) | — | — | — | — | — | — | cap | — | — | — | ✓ | ✓ |
| `enforcement:apply_limit` | Apply feature limit | — | — | — | — | — | — | cap | — | — | — | ✓ | ✓ |
| `enforcement:apply_suspend` | Suspend account | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `enforcement:apply_terminate` | Terminate account (second approver required) | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `enforcement:decide_appeal` | Decide enforcement appeal | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `attempt:void_self` | Self-serve section void, once per attempt (GA-007, C30) | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `attempt:grant_resit` | Restore a full-mock use after verified failure (cap 2 / 90 d) | — | — | — | — | — | — | cap | — | — | — | ✓ | ✓ |
| `attempt:credit_mock` | Grant an extra mock use | — | — | — | — | — | — | cap | * | — | — | ✓ | ✓ |
| `accommodation:grant` | Grant 1.25x / 1.5x / 2.0x extra time (P1 support-granted, C18) | — | — | — | — | — | — | * | — | — | org | ✓ | ✓ |
| `accommodation:request` | Request accommodation (P2 self-serve) | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `pii:reveal` | Unmask a PII field (reason + ticket, rate-alerted) | — | — | — | — | — | — | cap | — | — | — | ✓ | ✓ |
| `dsr:process` | Process data-subject requests | — | — | — | — | — | — | cap | — | — | — | ✓ | ✓ |
| `leo_request:handle` | Handle law-enforcement requests | — | — | — | — | — | — | — | — | — | — | — | ✓ |
| **Finance operations (30)** | | | | | | | | | | | | |
| `ledger:read` | Read ledger / journals | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `ledger:post_manual` | Post manual journal (step-up 2FA) | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `period:close` | Close a finance period | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `settlement:upload` | Upload gateway settlement reports | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `reconciliation:resolve` | Resolve reconciliation items | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `payout:prepare` | Prepare monthly payout statements (maker) | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `payee:manage` | Manage payee profiles (bank / bKash, tax info) | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `finance_setting:write` | Change finance settings | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `chargeback:manage` | Manage chargebacks / evidence packs | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `refund:override_policy` | Override refund policy checker | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `finance:export` | Finance CSV exports (audited) | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `pii:read` | Read payee / billing PII needed for finance | — | — | — | — | — | — | — | cap | — | — | ✓ | ✓ |
| **Admissions (21, P2/P3)** | | | | | | | | | | | | |
| `admissions_plan:read` | Read admissions workspace (assigned students, with consent) | — | own | lnk | — | — | — | msk | — | asg | — | ✓ | ✓ |
| `admissions_plan:manage` | Edit own plan / assigned plan | — | own | — | — | — | — | — | — | asg | — | ✓ | ✓ |
| `essay_draft:manage` | Write / version own essay drafts | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `essay_draft:review` | Give essay feedback (never ghost-writing) | — | — | — | — | asg | — | — | — | asg | — | ✓ | ✓ |
| `counsellor_session:manage` | Book / run sessions | — | own | — | — | — | — | — | — | own | — | ✓ | ✓ |
| `admissions_document:read` | Read sensitive admissions documents (consent; admin break-glass audited) | — | own | — | — | — | — | — | — | asg | — | ✓ | ✓ |
| `counsellor:assign` | Assign counsellors to students | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `college:manage` | College data and requirements | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `scholarship:edit` | Edit scholarship records | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| **AI operations (31)** | | | | | | | | | | | | |
| `gold:manage` | Manage gold set | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `eval:run` | Run evals / canaries | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `eval:report` | Read eval and accuracy reports | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `eval:locked_test` | Run against locked test set | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `eval:export` | Export eval data | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `rating:submit` | Submit rater scores | — | — | — | — | asg | — | — | — | — | — | ✓ | ✓ |
| `rating:adjudicate` | Adjudicate rater disagreements (lead rater) | — | — | — | — | asg | — | — | — | — | — | ✓ | ✓ |
| `model_release:manage` | Promote / roll back model, prompt, rubric releases | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `ai_dispute:resolve` | Resolve AI score disputes | — | — | — | — | asg | — | — | — | — | — | ✓ | ✓ |
| `ai_budget:manage` | Set provider budgets / breaker | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| **AI learning features (34)** | | | | | | | | | | | | |
| `tutor:use` | Ask tutor (entitlement-filtered RAG) | — | ent | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `notebook:manage` | Notebooks (P2, Plus+) | — | ent | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `study_asset:read` | Study guides / audio overviews / mind maps | — | ent | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `srs:manage` | Flashcards and SRS (FSRS) | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `score_estimate:read` | Estimated-score tracker | — | own | lnk | — | — | — | — | — | — | — | ✓ | ✓ |
| `progress_report:read` | Weekly AI progress report | — | own | lnk | — | — | — | — | — | — | — | ✓ | ✓ |
| `speaking_partner:use` | AI speaking partner (P2) | — | ent | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `trial:start` | Start 7-day Plus trial | — | own | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `ai_usage:read` | Read AI usage / meters for abuse review | — | — | — | — | — | — | msk | * | — | — | ✓ | ✓ |
| **Legal & policy (26)** | | | | | | | | | | | | |
| `policy:manage` | Draft policy versions | — | — | — | — | — | * | — | — | — | — | ✓ | ✓ |
| `policy:publish` | Publish a signed-off policy version | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| **Platform** | | | | | | | | | | | | | |
| `notification:manage_own` | Inbox & preferences | — | own | own | own | own | own | own | own | own | own | ✓ | ✓ |
| `upload:presign` | Request presigned upload | — | own | — | own | own | * | — | — | own | org | ✓ | ✓ |
| `analytics:instructor` | Instructor analytics | — | — | — | own | — | — | — | — | — | — | ✓ | ✓ |
| `analytics:platform` | Platform analytics | — | — | — | — | — | — | — | * | — | — | ✓ | ✓ |
| `audit:read` | Read audit log | — | — | — | — | — | — | own | sub | — | — | ✓ | ✓ |
| `system:flags` | Feature flags / kill switches | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `system:dlq` | Dead-letter queue replay | — | — | — | — | — | — | — | — | — | — | ✓ | ✓ |
| `system:secrets` | Secrets & key rotation | — | — | — | — | — | — | — | — | — | — | — | ✓ |
| `system:bulk_destructive` | Bulk deletes / purges | — | — | — | — | — | — | — | — | — | — | — | ✓ |

### 9.1 Generated `permissions.ts`

The matrix above is the source; `tooling/gen-permissions` (a 40-line script reading the markdown table) emits this file, and a CI test asserts the file is in sync (`pnpm verify` fails on drift) and that every permission string used in `assertCan(...)` calls exists in the map (typed as `Permission`).

```ts
// packages/auth/src/permissions.ts  (GENERATED from the matrix in 06 §9 by tooling/gen-permissions; do not hand-edit)
export type Role = 'guest' | 'student' | 'guardian' | 'instructor' | 'grader' | 'content_editor' | 'support' | 'finance' | 'counsellor' | 'org_admin' | 'admin' | 'super_admin';
/** '*' all · 'pub' public · 'own' own record · 'ent' requires active entitlement · 'org' own organisation · 'asg' assigned to actor · 'lnk' linked student (guardian_link granted) · 'msk' read with masked PII · '7d' max 7 days · 'lim' excluding admin/super_admin roles · 'sub' subset · 'cap' service-enforced caps (reason, counts, audit) */
export type Scope = '*' | 'pub' | 'own' | 'ent' | 'org' | 'asg' | 'lnk' | 'msk' | '7d' | 'lim' | 'sub' | 'cap';
export const PERMISSIONS = {
  'course:read_published': { guest: '*', student: '*', guardian: '*', instructor: '*', grader: '*', content_editor: '*', support: '*', finance: '*', counsellor: '*', org_admin: '*', admin: '✓', super_admin: '✓' },
  'course:read_draft': { instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'course:create': { instructor: '*', content_editor: '*', admin: '✓', super_admin: '✓' },
  'course:update': { instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'course:submit_review': { instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'course:publish': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'course:archive': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'course:delete': { admin: '✓', super_admin: '✓' },
  'media:upload': { instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'media:read_private': { instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'taxonomy:manage': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'cms_page:manage': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'instructor_profile:update': { instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'instructor:approve': { admin: '✓', super_admin: '✓' },
  'lesson:view': { guest: 'pub', student: 'ent', instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'enrollment:create': { student: 'own', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'enrollment:read': { student: 'own', guardian: 'lnk', instructor: 'own', support: 'msk', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'progress:read': { student: 'own', guardian: 'lnk', instructor: 'own', support: 'msk', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'progress:write': { student: 'own', admin: '✓', super_admin: '✓' },
  'note:manage': { student: 'own', admin: '✓', super_admin: '✓' },
  'study_plan:manage': { student: 'own', admin: '✓', super_admin: '✓' },
  'question:read_bank': { instructor: 'own', grader: 'asg', content_editor: '*', admin: '✓', super_admin: '✓' },
  'question:create': { instructor: '*', content_editor: '*', admin: '✓', super_admin: '✓' },
  'question:update': { instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'question:submit_review': { instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'question:publish': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'question_set:manage': { instructor: 'own', content_editor: '*', admin: '✓', super_admin: '✓' },
  'test_form:read': { guest: 'pub', student: 'ent', content_editor: '*', admin: '✓', super_admin: '✓' },
  'test_form:manage': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'test_form:publish': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'attempt:start': { guest: 'pub', student: 'ent', admin: '✓', super_admin: '✓' },
  'attempt:participate': { guest: 'own', student: 'own', admin: '✓', super_admin: '✓' },
  'attempt:read': { student: 'own', guardian: 'lnk', grader: 'asg', support: 'msk', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'attempt:grant_accommodation': { support: '*', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'attempt:void': { support: 'cap', admin: '✓', super_admin: '✓' },
  'evaluation:request': { student: 'own', admin: '✓', super_admin: '✓' },
  'evaluation:read': { student: 'own', guardian: 'lnk', grader: 'asg', support: 'msk', admin: '✓', super_admin: '✓' },
  'evaluation:grade': { grader: 'asg', admin: '✓', super_admin: '✓' },
  'evaluation:override_band': { grader: 'asg', admin: '✓', super_admin: '✓' },
  'evaluation:assign': { support: '*', admin: '✓', super_admin: '✓' },
  'ai_credit:read': { student: 'own', support: 'msk', finance: '*', admin: '✓', super_admin: '✓' },
  'ai_credit:grant': { finance: '*', admin: '✓', super_admin: '✓' },
  'product:read': { guest: '*', student: '*', guardian: '*', instructor: '*', grader: '*', content_editor: '*', support: '*', finance: '*', counsellor: '*', org_admin: '*', admin: '✓', super_admin: '✓' },
  'product:manage': { finance: '*', admin: '✓', super_admin: '✓' },
  'price:manage': { finance: '*', admin: '✓', super_admin: '✓' },
  'coupon:manage': { finance: '*', admin: '✓', super_admin: '✓' },
  'coupon:redeem': { student: 'own', guardian: 'lnk', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'order:create': { student: 'own', guardian: 'lnk', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'order:read': { student: 'own', guardian: 'lnk', support: 'msk', finance: '*', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'order:cancel': { student: 'own', guardian: 'lnk', support: '*', finance: '*', admin: '✓', super_admin: '✓' },
  'payment:read': { support: 'msk', finance: '*', admin: '✓', super_admin: '✓' },
  'refund:request': { student: 'own', guardian: 'lnk', support: '*', finance: '*', admin: '✓', super_admin: '✓' },
  'refund:read': { student: 'own', guardian: 'lnk', support: 'msk', finance: '*', admin: '✓', super_admin: '✓' },
  'refund:approve': { finance: '*', admin: '✓', super_admin: '✓' },
  'invoice:read': { student: 'own', guardian: 'lnk', finance: '*', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'invoice:issue': { finance: '*', admin: '✓', super_admin: '✓' },
  'entitlement:read': { student: 'own', guardian: 'lnk', support: 'msk', finance: '*', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'entitlement:grant': { support: '7d', finance: '*', admin: '✓', super_admin: '✓' },
  'entitlement:revoke': { finance: '*', admin: '✓', super_admin: '✓' },
  'payout:read': { instructor: 'own', finance: '*', admin: '✓', super_admin: '✓' },
  'payout:approve': { admin: '✓', super_admin: '✓' },  // maker-checker with finance's payout:prepare (30)
  'report:revenue': { instructor: 'own', finance: '*', admin: '✓', super_admin: '✓' },
  'report:vat_export': { finance: '*', admin: '✓', super_admin: '✓' },
  'org:create': { admin: '✓', super_admin: '✓' },
  'org:read': { support: 'msk', finance: '*', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'org:update': { org_admin: 'org', admin: '✓', super_admin: '✓' },
  'org_member:manage': { org_admin: 'org', admin: '✓', super_admin: '✓' },
  'cohort:manage': { org_admin: 'org', admin: '✓', super_admin: '✓' },
  'seat:allocate': { org_admin: 'org', admin: '✓', super_admin: '✓' },
  'org_assignment:manage': { org_admin: 'org', admin: '✓', super_admin: '✓' },
  'org_analytics:read': { org_admin: 'org', admin: '✓', super_admin: '✓' },
  'user:read': { student: 'own', support: 'msk', finance: 'msk', admin: '✓', super_admin: '✓' },
  'user:update': { student: 'own', guardian: 'own', instructor: 'own', grader: 'own', content_editor: 'own', support: 'own', finance: 'own', counsellor: 'own', org_admin: 'own', admin: '✓', super_admin: '✓' },
  'user:ban': { admin: '✓', super_admin: '✓' },
  'user:export_data': { student: 'own', guardian: 'own', instructor: 'own', grader: 'own', content_editor: 'own', support: 'own', finance: 'own', counsellor: 'own', org_admin: 'own', admin: '✓', super_admin: '✓' },
  'user:delete': { student: 'own', guardian: 'own', instructor: 'own', grader: 'own', content_editor: 'own', support: 'own', finance: 'own', counsellor: 'own', org_admin: 'own', admin: '✓', super_admin: '✓' },
  'user:impersonate': { support: '*', admin: '✓', super_admin: '✓' },
  'guardian_link:manage': { student: 'own', guardian: 'lnk', admin: '✓', super_admin: '✓' },
  'role:grant': { admin: 'lim', super_admin: '✓' },
  'role:revoke': { admin: 'lim', super_admin: '✓' },
  'role:grant_privileged': { super_admin: '✓' },
  'thread:create': { student: 'ent', admin: '✓', super_admin: '✓' },
  'thread:read': { student: 'ent', instructor: 'own', content_editor: '*', support: 'msk', admin: '✓', super_admin: '✓' },
  'answer:create': { student: 'ent', instructor: 'own', content_editor: '*', support: '*', admin: '✓', super_admin: '✓' },
  'thread:moderate': { instructor: 'own', content_editor: '*', support: '*', admin: '✓', super_admin: '✓' },
  'review:create': { student: 'ent', admin: '✓', super_admin: '✓' },
  'review:moderate': { content_editor: '*', support: '*', admin: '✓', super_admin: '✓' },
  'report:create': { student: '*', guardian: '*', instructor: '*', grader: '*', content_editor: '*', support: '*', finance: '*', counsellor: '*', org_admin: '*', admin: '✓', super_admin: '✓' },
  'report:resolve': { content_editor: '*', support: '*', admin: '✓', super_admin: '✓' },
  'notification:manage_own': { student: 'own', guardian: 'own', instructor: 'own', grader: 'own', content_editor: 'own', support: 'own', finance: 'own', counsellor: 'own', org_admin: 'own', admin: '✓', super_admin: '✓' },
  'upload:presign': { student: 'own', instructor: 'own', grader: 'own', content_editor: '*', counsellor: 'own', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'analytics:instructor': { instructor: 'own', admin: '✓', super_admin: '✓' },
  'analytics:platform': { finance: '*', admin: '✓', super_admin: '✓' },
  'audit:read': { support: 'own', finance: 'sub', admin: '✓', super_admin: '✓' },
  // ---- Support & trust (27)
  'ticket:read': { student: 'own', support: 'msk', admin: '✓', super_admin: '✓' },
  'ticket:reply': { support: '*', admin: '✓', super_admin: '✓' },
  'ticket:assign': { support: '*', admin: '✓', super_admin: '✓' },
  'ticket:merge': { support: '*', admin: '✓', super_admin: '✓' },
  'macro:read': { support: '*', admin: '✓', super_admin: '✓' },
  'macro:manage': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'csat:read': { support: '*', admin: '✓', super_admin: '✓' },
  'moderation:read': { content_editor: '*', support: '*', admin: '✓', super_admin: '✓' },
  'moderation:decide': { content_editor: '*', support: '*', admin: '✓', super_admin: '✓' },
  'moderation:appeal_decide': { admin: '✓', super_admin: '✓' },
  'dispute:open': { student: 'own', guardian: 'lnk', support: '*', admin: '✓', super_admin: '✓' },
  'dispute:read': { student: 'own', support: 'msk', finance: '*', admin: '✓', super_admin: '✓' },
  'dispute:decide': { support: 'cap', finance: '*', admin: '✓', super_admin: '✓' },
  'guarantee:read': { student: 'own', guardian: 'lnk', support: 'msk', finance: '*', admin: '✓', super_admin: '✓' },
  'guarantee:submit': { student: 'own', admin: '✓', super_admin: '✓' },
  'guarantee:review': { support: '*', admin: '✓', super_admin: '✓' },
  'guarantee:decide': { finance: '*', admin: '✓', super_admin: '✓' },
  'enforcement:apply_warning': { support: 'cap', admin: '✓', super_admin: '✓' },
  'enforcement:apply_limit': { support: 'cap', admin: '✓', super_admin: '✓' },
  'enforcement:apply_suspend': { admin: '✓', super_admin: '✓' },
  'enforcement:apply_terminate': { admin: '✓', super_admin: '✓' },
  'enforcement:decide_appeal': { admin: '✓', super_admin: '✓' },
  'attempt:void_self': { student: 'own', admin: '✓', super_admin: '✓' },
  'attempt:grant_resit': { support: 'cap', admin: '✓', super_admin: '✓' },
  'attempt:credit_mock': { support: 'cap', finance: '*', admin: '✓', super_admin: '✓' },
  'accommodation:grant': { support: '*', org_admin: 'org', admin: '✓', super_admin: '✓' },
  'accommodation:request': { student: 'own', admin: '✓', super_admin: '✓' },
  'pii:reveal': { support: 'cap', admin: '✓', super_admin: '✓' },
  'dsr:process': { support: 'cap', admin: '✓', super_admin: '✓' },
  'leo_request:handle': { super_admin: '✓' },
  // ---- Finance operations (30)
  'ledger:read': { finance: '*', admin: '✓', super_admin: '✓' },
  'ledger:post_manual': { finance: '*', admin: '✓', super_admin: '✓' },
  'period:close': { admin: '✓', super_admin: '✓' },
  'settlement:upload': { finance: '*', admin: '✓', super_admin: '✓' },
  'reconciliation:resolve': { finance: '*', admin: '✓', super_admin: '✓' },
  'payout:prepare': { finance: '*', admin: '✓', super_admin: '✓' },
  'payee:manage': { finance: '*', admin: '✓', super_admin: '✓' },
  'finance_setting:write': { admin: '✓', super_admin: '✓' },
  'chargeback:manage': { finance: '*', admin: '✓', super_admin: '✓' },
  'refund:override_policy': { admin: '✓', super_admin: '✓' },
  'finance:export': { finance: '*', admin: '✓', super_admin: '✓' },
  'pii:read': { finance: 'cap', admin: '✓', super_admin: '✓' },
  // ---- Admissions (21, P2/P3)
  'admissions_plan:read': { student: 'own', guardian: 'lnk', support: 'msk', counsellor: 'asg', admin: '✓', super_admin: '✓' },
  'admissions_plan:manage': { student: 'own', counsellor: 'asg', admin: '✓', super_admin: '✓' },
  'essay_draft:manage': { student: 'own', admin: '✓', super_admin: '✓' },
  'essay_draft:review': { grader: 'asg', counsellor: 'asg', admin: '✓', super_admin: '✓' },
  'counsellor_session:manage': { student: 'own', counsellor: 'own', admin: '✓', super_admin: '✓' },
  'admissions_document:read': { student: 'own', counsellor: 'asg', admin: '✓', super_admin: '✓' },
  'counsellor:assign': { admin: '✓', super_admin: '✓' },
  'college:manage': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'scholarship:edit': { content_editor: '*', admin: '✓', super_admin: '✓' },
  // ---- AI operations (31)
  'gold:manage': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'eval:run': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'eval:report': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'eval:locked_test': { admin: '✓', super_admin: '✓' },
  'eval:export': { admin: '✓', super_admin: '✓' },
  'rating:submit': { grader: 'asg', admin: '✓', super_admin: '✓' },
  'rating:adjudicate': { grader: 'asg', admin: '✓', super_admin: '✓' },
  'model_release:manage': { admin: '✓', super_admin: '✓' },
  'ai_dispute:resolve': { grader: 'asg', admin: '✓', super_admin: '✓' },
  'ai_budget:manage': { admin: '✓', super_admin: '✓' },
  // ---- AI learning features (34)
  'tutor:use': { student: 'ent', admin: '✓', super_admin: '✓' },
  'notebook:manage': { student: 'ent', admin: '✓', super_admin: '✓' },
  'study_asset:read': { student: 'ent', admin: '✓', super_admin: '✓' },
  'srs:manage': { student: 'own', admin: '✓', super_admin: '✓' },
  'score_estimate:read': { student: 'own', guardian: 'lnk', admin: '✓', super_admin: '✓' },
  'progress_report:read': { student: 'own', guardian: 'lnk', admin: '✓', super_admin: '✓' },
  'speaking_partner:use': { student: 'ent', admin: '✓', super_admin: '✓' },
  'trial:start': { student: 'own', admin: '✓', super_admin: '✓' },
  'ai_usage:read': { support: 'msk', finance: '*', admin: '✓', super_admin: '✓' },
  // ---- Legal & policy (26)
  'policy:manage': { content_editor: '*', admin: '✓', super_admin: '✓' },
  'policy:publish': { admin: '✓', super_admin: '✓' },
  'system:flags': { admin: '✓', super_admin: '✓' },
  'system:dlq': { admin: '✓', super_admin: '✓' },
  'system:secrets': { super_admin: '✓' },
  'system:bulk_destructive': { super_admin: '✓' },
} as const satisfies Record<string, Partial<Record<Role, Scope>>>;
export type Permission = keyof typeof PERMISSIONS;
```
