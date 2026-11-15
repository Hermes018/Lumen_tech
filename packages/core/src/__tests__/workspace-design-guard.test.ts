/** @purpose Unit tests for deterministic math formatter, Scholar vs. Admin PII masking & role isolation, and [workspace-guard] layout invariants (BATCH P27) */
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { MEDIA_MANIFEST } from '../../../../apps/web/src/content/media';
import { formatMathText } from '../../../../apps/web/src/lib/format-math';
import {
  ROLE_COOKIE_NAME,
  ROLE_HOME_PATHS,
  ROLE_PERMISSION_MATRIX,
  canRolePerformAction,
  maskEmailForAdmin,
  maskPhoneForAdmin,
  parseWorkspaceRole,
  resolveRoleRedirect,
} from '../../../../apps/web/src/lib/role-guard';
import { enforceRoleActionPermission } from '../../../../apps/web/src/lib/security/policy';
import {
  adjudicateRuntimeAuditorIrr,
  certifyRuntimeAuditorItem,
  getRuntimeCatalog,
  resetRuntimeCatalogToDefaults,
  resolveRuntimeInstructorDoubt,
  submitRuntimeEvaluatorGrade,
  submitRuntimeInstructorItem,
  updateRuntimeInstructorCohort,
  verifyRuntimeAuditChain,
} from '../../../../apps/web/src/lib/security/payment-guard';

const REPO_ROOT = path.resolve(__dirname, '../../../..');

describe('formatMathText (P27 deterministic Unicode math formatter)', () => {
  it('strips inline LaTeX delimiters and formats powers cleanly', () => {
    const raw = 'Given that $x^2 = 16$ and $y^3 = -27$. Quantity A: $x + y$ Quantity B: $0$';
    expect(formatMathText(raw)).toBe(
      'Given that x² = 16 and y³ = -27. Quantity A: x + y Quantity B: 0',
    );
  });

  it('converts pi, fractions, square roots, inequalities, and operators', () => {
    expect(formatMathText('Area is $64\\pi$')).toBe('Area is 64π');
    expect(
      formatMathText('\\frac{a + b}{2} \\leq \\sqrt{c} \\geq d \\neq e \\times f \\div g \\pm h \\infty'),
    ).toBe('(a + b / 2) ≤ √(c) ≥ d ≠ e × f ÷ g ± h ∞');
  });

  it('converts superscripts and subscripts cleanly without mangling currency', () => {
    expect(formatMathText('$x^4 + x^n + x^{-1} + x^{k+1}$')).toBe('x⁴ + xⁿ + x⁻¹ + x^(k+1)');
    expect(formatMathText('$a_0 + a_1 + a_2 + a_n$')).toBe('a₀ + a₁ + a₂ + aₙ');
    expect(formatMathText('Tuition is $45 or $90 depending on track.')).toBe(
      'Tuition is $45 or $90 depending on track.',
    );
  });
});

describe('role-guard PII masking & role helpers (P27)', () => {
  it('exports the expected role cookie name and role parser', () => {
    expect(ROLE_COOKIE_NAME).toBe('lumen_role');
    expect(parseWorkspaceRole('scholar')).toBe('scholar');
    expect(parseWorkspaceRole('admin')).toBe('admin');
    expect(parseWorkspaceRole('unknown')).toBeNull();
    expect(parseWorkspaceRole(undefined)).toBeNull();
  });

  it('masks scholar email addresses for Admin Console privacy-by-design', () => {
    expect(maskEmailForAdmin('ayman@lumen.academy')).toBe('a***n@lumen.academy');
    expect(maskEmailForAdmin('ab@lumen.academy')).toBe('a***b@lumen.academy');
    expect(maskEmailForAdmin('a@lumen.academy')).toBe('a***@lumen.academy');
    expect(maskEmailForAdmin('invalid')).toBe('***');
  });

  it('masks Bangladesh and international phone numbers for Admin Console privacy-by-design', () => {
    expect(maskPhoneForAdmin('+8801711223344')).toBe('+88017••••3344');
    expect(maskPhoneForAdmin('01711223344')).toBe('017••••3344');
    expect(maskPhoneForAdmin('')).toBe('••••');
  });
});

describe('Workspace design & role isolation guards (P27)', () => {
  it('verifies (learner)/layout.tsx has dedicated /app/gre, /app/ielts, /app/billing links and zero Admin Console or RPG clutter', () => {
    const layoutPath = path.join(REPO_ROOT, 'apps/web/app/[locale]/(learner)/layout.tsx');
    const content = fs.readFileSync(layoutPath, 'utf8');

    expect(content).toContain("href: '/app'");
    expect(content).toContain("href: '/app/plan'");
    expect(content).toContain("href: '/app/mistakes'");
    expect(content).toContain("href: '/app/progress'");
    expect(content).toContain("href: '/app/gre'");
    expect(content).toContain("href: '/app/ielts'");
    expect(content).toContain("href: '/app/vocab'");
    expect(content).toContain("href: '/app/billing'");
    expect(content).toContain("href: '/app/settings'");

    expect(content).not.toContain('Admin Console');
    expect(content).not.toContain('/admin');
    expect(content).not.toContain('CD-IELTS Simulator');
    expect(content).not.toContain('7 Day Streak');
    expect(content).not.toContain('120 Credits');
    expect(content).not.toMatch(/\brounded-(?:full|xl|2xl|3xl)\b/);
    expect(content).not.toMatch(/\b(?:bg|text|border)-(?:blue|emerald|yellow)-/);
  });

  it('verifies WorkspacePrimitives.tsx exports required Claude editorial components without forbidden styles', () => {
    const primitivesPath = path.join(REPO_ROOT, 'apps/web/src/components/ui/WorkspacePrimitives.tsx');
    const content = fs.readFileSync(primitivesPath, 'utf8');

    for (const symbol of [
      'WorkspaceContainer',
      'WorkspaceHeader',
      'WorkspaceFocusSheet',
      'WorkspaceStatRow',
      'WorkspaceTabs',
      'WorkspaceSectionTitle',
      'WorkspaceLedger',
      'WorkspaceLedgerRow',
      'WorkspaceProgressBar',
    ]) {
      expect(content).toContain(`export function ${symbol}`);
    }

    expect(content).not.toMatch(/\brounded-(?:full|xl|2xl|3xl)\b/);
    expect(content).not.toMatch(/\bshadow-/);
    expect(content).not.toMatch(/\b(?:bg|text|border)-(?:blue|emerald|yellow)-/);
  });

  it('verifies proxy.ts and AuthForm.tsx enforce strict 5-role isolation', () => {
    const proxyContent = fs.readFileSync(path.join(REPO_ROOT, 'apps/web/proxy.ts'), 'utf8');
    expect(proxyContent).toContain('ROLE_COOKIE_NAME');
    expect(proxyContent).toContain('parseWorkspaceRole');
    expect(proxyContent).toContain('resolveRoleRedirect');

    const authFormContent = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(auth)/_components/AuthForm.tsx'),
      'utf8',
    );
    expect(authFormContent).toContain("setWorkspaceRoleCookie('scholar')");
    expect(authFormContent).toContain("setWorkspaceRoleCookie('evaluator')");
    expect(authFormContent).toContain("setWorkspaceRoleCookie('instructor')");
    expect(authFormContent).toContain("setWorkspaceRoleCookie('auditor')");
    expect(authFormContent).toContain("setWorkspaceRoleCookie('admin')");
  });
});

describe('P28 Scholar Workspace Core & Dedicated GRE/IELTS Left Tabs', () => {
  const P28_PAGES = [
    'apps/web/app/[locale]/(learner)/app/page.tsx',
    'apps/web/app/[locale]/(learner)/app/gre/page.tsx',
    'apps/web/app/[locale]/(learner)/app/ielts/page.tsx',
    'apps/web/app/[locale]/(learner)/app/plan/page.tsx',
    'apps/web/app/[locale]/(learner)/app/mistakes/page.tsx',
    'apps/web/app/[locale]/(learner)/app/progress/page.tsx',
    'apps/web/app/[locale]/(learner)/app/practice/page.tsx',
    'apps/web/app/[locale]/(learner)/app/vocab/page.tsx',
    'apps/web/app/[locale]/(learner)/app/vocab/play/page.tsx',
  ];

  it('verifies every P28 learner page composes WorkspacePrimitives with zero rainbow, shadow, RPG, or micro-eyebrow classes', () => {
    for (const rel of P28_PAGES) {
      const content = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
      expect(content).toContain('@/src/components/ui/WorkspacePrimitives');
      expect(content).not.toMatch(/\brounded-(?:full|md|lg|xl|2xl|3xl)\b/);
      expect(content).not.toMatch(/\bshadow-/);
      expect(content).not.toMatch(
        /\b(?:bg|text|border)-(?:blue|green|emerald|yellow|amber|purple|indigo|slate|zinc)-/,
      );
      expect(content).not.toMatch(/\buppercase\b/);
      expect(content).not.toMatch(/text-\[(?:9|10|11)px\]/);
      expect(content).not.toContain('Rank Progression Roadmap');
      expect(content).not.toContain('Analytical Strategist');
      expect(content).not.toContain('Apprentice Scholar');
      expect(content).not.toMatch(/total XP earned/i);
    }
  });

  it('verifies dedicated /app/gre and /app/ielts tracks and formatMathText coverage on math surfaces', () => {
    const greContent = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(learner)/app/gre/page.tsx'),
      'utf8',
    );
    expect(greContent).toContain('GRE® General Test Track');
    expect(greContent).toContain('formatMathText(');
    expect(greContent).toContain('evaluateAwaIssueEssay');

    const ieltsContent = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(learner)/app/ielts/page.tsx'),
      'utf8',
    );
    expect(ieltsContent).toContain('IELTS™ Academic & General Training Track');
    expect(ieltsContent).toContain('evaluateIeltsWritingTask');
    expect(ieltsContent).toContain('evaluateIeltsSpeaking');

    for (const mathPage of [
      'apps/web/app/[locale]/(learner)/app/mistakes/page.tsx',
      'apps/web/app/[locale]/(learner)/app/practice/page.tsx',
      'apps/web/app/[locale]/(learner)/app/vocab/play/page.tsx',
    ]) {
      const content = fs.readFileSync(path.join(REPO_ROOT, mathPage), 'utf8');
      expect(content).toContain('formatMathText(');
    }
  });
});

describe('P29 Billing & Settings Workspace Guards', () => {
  const P29_PAGES = [
    'apps/web/app/[locale]/(learner)/app/billing/page.tsx',
    'apps/web/app/[locale]/(learner)/app/settings/page.tsx',
  ];

  it('verifies /app/billing and /app/settings compose WorkspacePrimitives with zero forbidden styles or hydration traps', () => {
    for (const rel of P29_PAGES) {
      const content = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
      expect(content).toContain('@/src/components/ui/WorkspacePrimitives');
      expect(content).toContain('setMounted(true)');
      expect(content).not.toMatch(/\brounded-(?:full|md|lg|xl|2xl|3xl)\b/);
      expect(content).not.toMatch(/\bshadow-/);
      expect(content).not.toMatch(
        /\b(?:bg|text|border)-(?:blue|green|emerald|yellow|amber|purple|indigo|slate|zinc)-/,
      );
      expect(content).not.toMatch(/\buppercase\b/);
      expect(content).not.toMatch(/text-\[(?:9|10|11)px\]/);
      expect(content).not.toContain('UNVERIFIED (MINOR)');
      expect(content).not.toContain('SEND GUARDIAN VERIFICATION REQUEST');
    }
  });

  it('verifies /app/billing includes Mushak 6.3 receipt, split-pay installments, and refund controls', () => {
    const billingContent = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(learner)/app/billing/page.tsx'),
      'utf8',
    );
    expect(billingContent).toContain('INV-2026-1041');
    expect(billingContent).toContain('INV-2026-0892');
    expect(billingContent).toContain('Mushak 6.3');
    expect(billingContent).toContain('Settle Installment Now');
    expect(billingContent).toContain('Request 7-Day Refund');
    expect(billingContent).toContain('/api/checkout/verify');
    expect(billingContent).toContain('/api/admin/catalog');
  });

  it('verifies /app/settings includes AI zero-training privacy, JSON portability, erasure, and closed guardian disclosure', () => {
    const settingsContent = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(learner)/app/settings/page.tsx'),
      'utf8',
    );
    expect(settingsContent).toContain('Zero Training Guarantee');
    expect(settingsContent).toContain('Cohort Percentile Anonymization');
    expect(settingsContent).toContain('Admin Support PII Masking');
    expect(settingsContent).toContain('Export Complete Personal Archive (JSON)');
    expect(settingsContent).toContain('Request Permanent Account & Data Erasure');
    expect(settingsContent).toContain('<details className="lumen-disclosure');
  });
});

describe('P30 Role-Isolated Institutional Admin Console (/admin) Guards', () => {
  const P30_WORKSPACE_FILES = [
    'apps/web/app/[locale]/(admin)/layout.tsx',
    'apps/web/app/[locale]/(admin)/admin/page.tsx',
    'apps/web/app/[locale]/(learner)/app/admin/page.tsx',
    'apps/web/app/[locale]/(learner)/layout.tsx',
    'apps/web/app/[locale]/(learner)/app/page.tsx',
    'apps/web/app/[locale]/(learner)/app/gre/page.tsx',
    'apps/web/app/[locale]/(learner)/app/ielts/page.tsx',
    'apps/web/app/[locale]/(learner)/app/plan/page.tsx',
    'apps/web/app/[locale]/(learner)/app/mistakes/page.tsx',
    'apps/web/app/[locale]/(learner)/app/progress/page.tsx',
    'apps/web/app/[locale]/(learner)/app/practice/page.tsx',
    'apps/web/app/[locale]/(learner)/app/vocab/page.tsx',
    'apps/web/app/[locale]/(learner)/app/vocab/play/page.tsx',
    'apps/web/app/[locale]/(learner)/app/flashcards/page.tsx',
    'apps/web/app/[locale]/(learner)/app/billing/page.tsx',
    'apps/web/app/[locale]/(learner)/app/settings/page.tsx',
  ];

  it('verifies zero files in (learner) or (admin) violate [workspace-guard]', () => {
    for (const rel of P30_WORKSPACE_FILES) {
      const content = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
      expect(content).not.toMatch(/\brounded-(?:full|md|lg|xl|2xl|3xl)\b/);
      expect(content).not.toMatch(/\bshadow-/);
      expect(content).not.toMatch(
        /\b(?:bg|text|border)-(?:blue|green|emerald|yellow|amber|purple|indigo|slate|zinc)-/,
      );
      expect(content).not.toMatch(/\buppercase\b/);
      expect(content).not.toMatch(/text-\[(?:9|10|11)px\]/);
      expect(content).not.toContain('Analytical Strategist');
      expect(content).not.toContain('Apprentice Scholar');
      expect(content).not.toContain('Mastery Candidate');
      expect(content).not.toContain('Distinguished Scholar');
      expect(content).not.toContain('Rank Progression Roadmap');
      expect(content).not.toMatch(/total XP earned/i);
    }
  });

  it('verifies (admin)/layout.tsx is strictly isolated with zero student study links or RPG clutter', () => {
    const adminLayout = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(admin)/layout.tsx'),
      'utf8',
    );
    expect(adminLayout).not.toContain('FSRS Vocab');
    expect(adminLayout).not.toContain('Mistake Ledger');
    expect(adminLayout).not.toContain('Study Plan');
    expect(adminLayout).not.toContain('/app/vocab');
    expect(adminLayout).not.toContain('/app/mistakes');
    expect(adminLayout).toContain('/admin?tab=catalog');
    expect(adminLayout).toContain('/admin?tab=scholars');
    expect(adminLayout).toContain('/admin?tab=audit');
    expect(adminLayout).toContain('Institutional Governance & ERP');
  });

  it('verifies (admin)/admin/page.tsx uses maskEmailForAdmin, maskPhoneForAdmin, blind hashes, and progressive-disclosure editingSlug', () => {
    const adminPage = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(admin)/admin/page.tsx'),
      'utf8',
    );
    expect(adminPage).toContain('@/src/components/ui/WorkspacePrimitives');
    expect(adminPage).toContain('maskEmailForAdmin');
    expect(adminPage).toContain('maskPhoneForAdmin');
    expect(adminPage).toContain('ADMIN_PII_REVEAL');
    expect(adminPage).toContain('SUB-8492');
    expect(adminPage).toContain('editingSlug');
    expect(adminPage).toContain('setMounted(true)');
  });

  it('verifies legacy (learner)/app/admin/page.tsx cleanly redirects to /admin or /app', () => {
    const legacyAdmin = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(learner)/app/admin/page.tsx'),
      'utf8',
    );
    expect(legacyAdmin).toContain('ROLE_COOKIE_NAME');
    expect(legacyAdmin).toContain("role === 'scholar'");
    expect(legacyAdmin).toContain('/admin');
    expect(legacyAdmin).toContain('/app');
  });
});

describe('P33 5-Role Enterprise RBAC & Workforce Portals (/evaluator, /instructor, /auditor)', () => {
  it('supports all 5 roles in parseWorkspaceRole, ROLE_HOME_PATHS, and ROLE_PERMISSION_MATRIX', () => {
    expect(parseWorkspaceRole('scholar')).toBe('scholar');
    expect(parseWorkspaceRole('evaluator')).toBe('evaluator');
    expect(parseWorkspaceRole('instructor')).toBe('instructor');
    expect(parseWorkspaceRole('auditor')).toBe('auditor');
    expect(parseWorkspaceRole('admin')).toBe('admin');
    expect(parseWorkspaceRole('superadmin')).toBeNull();

    expect(ROLE_HOME_PATHS).toEqual({
      scholar: '/app',
      evaluator: '/evaluator',
      instructor: '/instructor',
      auditor: '/auditor',
      admin: '/admin',
    });

    expect(ROLE_PERMISSION_MATRIX.scholar).toEqual(['SCHOLAR_REQUEST_REFUND']);
    expect(ROLE_PERMISSION_MATRIX.evaluator).toEqual(['EVALUATOR_SUBMIT_GRADE', 'CMS_UPDATE']);
    expect(ROLE_PERMISSION_MATRIX.instructor).toEqual([
      'INSTRUCTOR_SUBMIT_ITEM',
      'INSTRUCTOR_RESOLVE_DOUBT',
      'INSTRUCTOR_UPDATE_COHORT',
    ]);
    expect(ROLE_PERMISSION_MATRIX.auditor).toEqual([
      'AUDITOR_ADJUDICATE_IRR',
      'AUDITOR_CERTIFY_ITEM',
      'AUDITOR_VERIFY_CHAIN',
    ]);
  });

  it('enforces action-level RBAC allow/deny rules across all 5 roles', () => {
    expect(canRolePerformAction('scholar', 'SCHOLAR_REQUEST_REFUND')).toBe(true);
    expect(canRolePerformAction('scholar', 'EVALUATOR_SUBMIT_GRADE')).toBe(false);
    expect(canRolePerformAction('scholar', 'UPDATE_PLAN')).toBe(false);

    expect(canRolePerformAction('evaluator', 'EVALUATOR_SUBMIT_GRADE')).toBe(true);
    expect(canRolePerformAction('evaluator', 'CMS_UPDATE')).toBe(true);
    expect(canRolePerformAction('evaluator', 'AUDITOR_CERTIFY_ITEM')).toBe(false);

    expect(canRolePerformAction('instructor', 'INSTRUCTOR_SUBMIT_ITEM')).toBe(true);
    expect(canRolePerformAction('instructor', 'INSTRUCTOR_RESOLVE_DOUBT')).toBe(true);
    expect(canRolePerformAction('instructor', 'INSTRUCTOR_UPDATE_COHORT')).toBe(true);
    expect(canRolePerformAction('instructor', 'ORDER_ACTION')).toBe(false);

    expect(canRolePerformAction('auditor', 'AUDITOR_ADJUDICATE_IRR')).toBe(true);
    expect(canRolePerformAction('auditor', 'AUDITOR_CERTIFY_ITEM')).toBe(true);
    expect(canRolePerformAction('auditor', 'AUDITOR_VERIFY_CHAIN')).toBe(true);
    expect(canRolePerformAction('auditor', 'UPDATE_PLAN')).toBe(false);

    expect(canRolePerformAction('admin', 'UPDATE_PLAN')).toBe(true);
    expect(canRolePerformAction('admin', 'EVALUATOR_SUBMIT_GRADE')).toBe(true);
    expect(canRolePerformAction('admin', 'INSTRUCTOR_SUBMIT_ITEM')).toBe(true);
    expect(canRolePerformAction('admin', 'AUDITOR_ADJUDICATE_IRR')).toBe(true);

    expect(enforceRoleActionPermission('evaluator', 'UPDATE_PLAN')).toEqual({
      allowed: false,
      role: 'evaluator',
      action: 'UPDATE_PLAN',
      error: 'RBAC_FORBIDDEN_ROLE_ACTION',
    });
    expect(enforceRoleActionPermission('auditor', 'AUDITOR_CERTIFY_ITEM').allowed).toBe(true);
  });

  it('enforces route-level 5-role isolation via resolveRoleRedirect with /bn preservation and null crawler bypass', () => {
    expect(resolveRoleRedirect('scholar', '/evaluator')).toBe('/app');
    expect(resolveRoleRedirect('scholar', '/bn/instructor')).toBe('/bn/app');
    expect(resolveRoleRedirect('evaluator', '/app')).toBe('/evaluator');
    expect(resolveRoleRedirect('evaluator', '/bn/admin')).toBe('/bn/evaluator');
    expect(resolveRoleRedirect('instructor', '/auditor')).toBe('/instructor');
    expect(resolveRoleRedirect('auditor', '/app')).toBe('/auditor');
    expect(resolveRoleRedirect('admin', '/evaluator')).toBe('/admin');

    expect(resolveRoleRedirect('evaluator', '/evaluator')).toBeNull();
    expect(resolveRoleRedirect('instructor', '/bn/instructor')).toBeNull();
    expect(resolveRoleRedirect('auditor', '/auditor')).toBeNull();

    // Stateless CI crawler (null role) renders each native shell except /app/admin -> /admin
    expect(resolveRoleRedirect(null, '/evaluator')).toBeNull();
    expect(resolveRoleRedirect(null, '/instructor')).toBeNull();
    expect(resolveRoleRedirect(null, '/auditor')).toBeNull();
    expect(resolveRoleRedirect(null, '/app/admin')).toBe('/admin');
    expect(resolveRoleRedirect(null, '/bn/app/admin')).toBe('/bn/admin');
  });

  it('verifies /api/admin/catalog enforces 5-role RBAC and returns RBAC_FORBIDDEN_ROLE_ACTION on unauthorized calls', () => {
    const routeContent = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/api/admin/catalog/route.ts'),
      'utf8',
    );
    expect(routeContent).toContain('enforceRoleActionPermission');
    expect(routeContent).toContain('RBAC_FORBIDDEN_ROLE_ACTION');
    expect(routeContent).toContain('x-lumen-role');
    expect(routeContent).toContain('EVALUATOR_SUBMIT_GRADE');
    expect(routeContent).toContain('INSTRUCTOR_SUBMIT_ITEM');
    expect(routeContent).toContain('AUDITOR_ADJUDICATE_IRR');
    expect(routeContent).toContain('AUDITOR_CERTIFY_ITEM');
  });

  it('persists Evaluator, Instructor, and Auditor mutations into runtime catalog and auditLogs', () => {
    resetRuntimeCatalogToDefaults('Test Runner');
    const afterGrade = submitRuntimeEvaluatorGrade(
      {
        submissionId: 'SUB-8492',
        overallBand: 8.0,
        feedback: 'Cohesive policy argument with precise lexical range.',
      },
      'Evaluator Test',
    );
    const gradedSub = afterGrade.evaluatorSubmissions.find((s) => s.id === 'SUB-8492');
    expect(gradedSub?.humanBand).toBe(8.0);
    expect(gradedSub?.status).toBe('Drift Flagged');
    expect(afterGrade.auditLogs[0]?.action).toBe('EVALUATOR_SUBMIT_GRADE');

    const afterItem = submitRuntimeInstructorItem(
      {
        itemId: 'ITEM-GRE-999',
        domain: 'GRE Quant Comparison',
        stem: 'Given $x^2 = 9$, compare $x$ and $3$.',
        hintTier1: 'Consider negative roots.',
        hintTier2: 'Test x = -3 and x = 3.',
        hintTier3: 'Quantity D: relationship cannot be determined.',
      },
      'Instructor Test',
    );
    expect(afterItem.instructorItems.some((i) => i.id === 'ITEM-GRE-999')).toBe(true);
    expect(afterItem.auditLogs[0]?.action).toBe('INSTRUCTOR_SUBMIT_ITEM');

    const afterDoubt = resolveRuntimeInstructorDoubt('DOUBT-101', 'Test x = -4 as a counter-example.');
    expect(afterDoubt.instructorDoubts.find((d) => d.id === 'DOUBT-101')?.status).toBe('Resolved');

    const afterCohort = updateRuntimeInstructorCohort('COH-GRE-14', {
      assignedDrill: 'DRILL-QC-NEG-EXP',
    });
    expect(afterCohort.instructorCohorts.find((c) => c.id === 'COH-GRE-14')?.assignedDrill).toBe(
      'DRILL-QC-NEG-EXP',
    );

    const afterIrr = adjudicateRuntimeAuditorIrr('SUB-8492', 7.5, 'Third-marker balanced score.');
    expect(afterIrr.evaluatorSubmissions.find((s) => s.id === 'SUB-8492')?.status).toBe('Adjudicated');

    const afterCert = certifyRuntimeAuditorItem('ITEM-GRE-999', 'certify', 'Verified p-value.');
    expect(afterCert.instructorItems.find((i) => i.id === 'ITEM-GRE-999')?.qaStatus).toBe(
      'Certified & Published',
    );

    const afterChain = verifyRuntimeAuditChain('Auditor Test');
    expect(afterChain.chainVerifiedAtIso).not.toBeNull();
    expect(afterChain.auditLogs[0]?.action).toBe('AUDITOR_VERIFY_CHAIN');
    expect(getRuntimeCatalog().auditLogs.length).toBeGreaterThan(4);
    resetRuntimeCatalogToDefaults('Test Runner');
  });

  it('verifies all 6 P33 portal layouts and pages pass [workspace-guard], compose WorkspaceDataTable, and enforce Evaluator Zero-PII', () => {
    const P33_FILES = [
      'apps/web/app/[locale]/(evaluator)/layout.tsx',
      'apps/web/app/[locale]/(evaluator)/evaluator/page.tsx',
      'apps/web/app/[locale]/(instructor)/layout.tsx',
      'apps/web/app/[locale]/(instructor)/instructor/page.tsx',
      'apps/web/app/[locale]/(auditor)/layout.tsx',
      'apps/web/app/[locale]/(auditor)/auditor/page.tsx',
    ];

    for (const rel of P33_FILES) {
      const content = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
      expect(content).toContain('@/src/components/ui/WorkspacePrimitives');
      expect(content).not.toMatch(/\brounded-(?:full|md|lg|xl|2xl|3xl)\b/);
      expect(content).not.toMatch(/\bshadow-/);
      expect(content).not.toMatch(
        /\b(?:bg|text|border)-(?:blue|green|emerald|yellow|amber|purple|indigo|slate|zinc)-/,
      );
      expect(content).not.toMatch(/\buppercase\b/);
      expect(content).not.toMatch(/text-\[(?:9|10|11)px\]/);
      expect(content).not.toMatch(/total XP earned/i);
      expect(content).not.toMatch(/>[^<{]*\$[^$\n]*[\^_\\][^<$]*\$\s*</);
    }

    const evaluatorPage = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(evaluator)/evaluator/page.tsx'),
      'utf8',
    );
    expect(evaluatorPage).toContain('<WorkspaceDataTable');
    expect(evaluatorPage).toContain('SUB-8492');
    expect(evaluatorPage).toContain('EVALUATOR_SUBMIT_GRADE');
    expect(evaluatorPage).not.toContain('ayman@lumen.academy');
    expect(evaluatorPage).not.toContain('+8801711223344');

    const instructorPage = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(instructor)/instructor/page.tsx'),
      'utf8',
    );
    expect(instructorPage).toContain('<WorkspaceDataTable');
    expect(instructorPage).toContain('formatMathText(');
    expect(instructorPage).toContain('INSTRUCTOR_SUBMIT_ITEM');

    const auditorPage = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(auditor)/auditor/page.tsx'),
      'utf8',
    );
    expect(auditorPage).toContain('<WorkspaceDataTable');
    expect(auditorPage).toContain('AUDITOR_ADJUDICATE_IRR');
    expect(auditorPage).toContain('AUDITOR_CERTIFY_ITEM');
    expect(auditorPage).toContain('AUDITOR_VERIFY_CHAIN');
  });
});

describe('P34 Final Release Gate: 5-Role RBAC, WorkspaceDataTable, Evaluator Zero-PII & 24 Unique WebP Assets', () => {
  it('enforces strict ROLE_PERMISSION_MATRIX and canRolePerformAction across all 5 roles', () => {
    const roles = ['scholar', 'evaluator', 'instructor', 'auditor', 'admin'] as const;
    expect(Object.keys(ROLE_PERMISSION_MATRIX).sort()).toEqual([...roles].sort());
    expect(ROLE_PERMISSION_MATRIX.admin).toContain('UPDATE_PLAN');
    expect(ROLE_PERMISSION_MATRIX.admin).toContain('PII_REVEAL');
    expect(ROLE_PERMISSION_MATRIX.admin).toContain('EVALUATOR_SUBMIT_GRADE');
    expect(ROLE_PERMISSION_MATRIX.admin).toContain('INSTRUCTOR_SUBMIT_ITEM');
    expect(ROLE_PERMISSION_MATRIX.admin).toContain('AUDITOR_ADJUDICATE_IRR');

    const privilegedActions = [
      'UPDATE_PLAN',
      'ORDER_ACTION',
      'PII_REVEAL',
      'EVALUATOR_SUBMIT_GRADE',
      'INSTRUCTOR_SUBMIT_ITEM',
      'AUDITOR_ADJUDICATE_IRR',
      'AUDITOR_CERTIFY_ITEM',
      'AUDITOR_VERIFY_CHAIN',
    ];

    for (const action of privilegedActions) {
      expect(canRolePerformAction('scholar', action)).toBe(false);
    }
    expect(canRolePerformAction('scholar', 'SCHOLAR_REQUEST_REFUND')).toBe(true);

    expect(canRolePerformAction('evaluator', 'INSTRUCTOR_SUBMIT_ITEM')).toBe(false);
    expect(canRolePerformAction('evaluator', 'AUDITOR_VERIFY_CHAIN')).toBe(false);
    expect(canRolePerformAction('evaluator', 'PII_REVEAL')).toBe(false);

    expect(canRolePerformAction('instructor', 'EVALUATOR_SUBMIT_GRADE')).toBe(false);
    expect(canRolePerformAction('instructor', 'AUDITOR_CERTIFY_ITEM')).toBe(false);
    expect(canRolePerformAction('instructor', 'PII_REVEAL')).toBe(false);

    expect(canRolePerformAction('auditor', 'EVALUATOR_SUBMIT_GRADE')).toBe(false);
    expect(canRolePerformAction('auditor', 'INSTRUCTOR_RESOLVE_DOUBT')).toBe(false);
    expect(canRolePerformAction('auditor', 'PII_REVEAL')).toBe(false);
  });

  it('isolates all 5 role portals cleanly via resolveRoleRedirect across English and Bangla routes', () => {
    const roles = ['scholar', 'evaluator', 'instructor', 'auditor', 'admin'] as const;
    for (const actorRole of roles) {
      for (const targetRole of roles) {
        const targetPath = ROLE_HOME_PATHS[targetRole];
        const expected = actorRole === targetRole ? null : ROLE_HOME_PATHS[actorRole];
        expect(resolveRoleRedirect(actorRole, targetPath)).toBe(expected);
        expect(resolveRoleRedirect(actorRole, `/bn${targetPath}`)).toBe(
          expected ? `/bn${expected}` : null,
        );
      }
      expect(resolveRoleRedirect(actorRole, '/app/admin')).toBe(ROLE_HOME_PATHS[actorRole]);
      expect(resolveRoleRedirect(actorRole, '/bn/app/admin')).toBe(
        `/bn${ROLE_HOME_PATHS[actorRole]}`,
      );
    }
  });

  it('verifies <WorkspaceDataTable> is composed across /admin, /evaluator, /instructor, /auditor, and /app/*', () => {
    const DATA_TABLE_FILES = [
      'apps/web/app/[locale]/(admin)/admin/page.tsx',
      'apps/web/app/[locale]/(evaluator)/evaluator/page.tsx',
      'apps/web/app/[locale]/(instructor)/instructor/page.tsx',
      'apps/web/app/[locale]/(auditor)/auditor/page.tsx',
      'apps/web/app/[locale]/(learner)/app/page.tsx',
      'apps/web/app/[locale]/(learner)/app/gre/page.tsx',
      'apps/web/app/[locale]/(learner)/app/ielts/page.tsx',
      'apps/web/app/[locale]/(learner)/app/plan/page.tsx',
      'apps/web/app/[locale]/(learner)/app/mistakes/page.tsx',
      'apps/web/app/[locale]/(learner)/app/progress/page.tsx',
      'apps/web/app/[locale]/(learner)/app/vocab/page.tsx',
      'apps/web/app/[locale]/(learner)/app/billing/page.tsx',
      'apps/web/src/components/typing/TypingPracticeEngine.tsx',
    ];

    for (const rel of DATA_TABLE_FILES) {
      const content = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
      expect(content, `${rel} must use <WorkspaceDataTable>`).toContain('<WorkspaceDataTable');
    }
  });

  it('verifies /evaluator layout and page contain zero student PII and enforce blind submission hashes', () => {
    const evaluatorFiles = [
      'apps/web/app/[locale]/(evaluator)/layout.tsx',
      'apps/web/app/[locale]/(evaluator)/evaluator/page.tsx',
    ];

    for (const rel of evaluatorFiles) {
      const content = fs.readFileSync(path.join(REPO_ROOT, rel), 'utf8');
      expect(content).not.toMatch(/\b[a-z0-9._%+-]+@lumen\.academy\b/i);
      expect(content).not.toMatch(/\+8801\d{9}/);
      expect(content).not.toContain('scholarEmail');
      expect(content).not.toContain('scholarPhone');
      expect(content).not.toContain('studentName');
      expect(content).not.toContain('ADMIN_PII_REVEAL');
      expect(content).not.toContain('maskEmailForAdmin');
      expect(content).not.toContain('maskPhoneForAdmin');
      expect(content).not.toContain('Unmask Contact');
    }

    const evaluatorPage = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(evaluator)/evaluator/page.tsx'),
      'utf8',
    );
    expect(evaluatorPage).toContain('Zero-PII');
    expect(evaluatorPage).toContain('SUB-8492');
  });

  it('verifies all >= 32 .webp assets in MEDIA_MANIFEST exist on disk with unique SHA-256 hashes', () => {
    const entries = Object.entries(MEDIA_MANIFEST);
    expect(entries.length).toBeGreaterThanOrEqual(32);

    const hashes = new Set<string>();
    const webPublicRoot = path.join(REPO_ROOT, 'apps/web/public');

    for (const [slot, entry] of entries) {
      expect(entry.src).toBe(`/images/${slot}.webp`);
      const filePath = path.join(webPublicRoot, entry.src);
      expect(fs.existsSync(filePath), `Missing WebP asset for ${slot}`).toBe(true);
      const buf = fs.readFileSync(filePath);
      const maxBytes = slot.startsWith('hero-') || slot.startsWith('split-') ? 120 * 1024 : 60 * 1024;
      expect(buf.byteLength).toBeLessThanOrEqual(maxBytes);
      hashes.add(crypto.createHash('sha256').update(buf).digest('hex'));
    }

    expect(hashes.size).toBe(entries.length);
  });
});
