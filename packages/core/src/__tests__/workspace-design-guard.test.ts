/** @purpose Unit tests for deterministic math formatter, Scholar vs. Admin PII masking & role isolation, and [workspace-guard] layout invariants (BATCH P27) */
import fs from 'node:fs';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { formatMathText } from '../../../../apps/web/src/lib/format-math';
import {
  ROLE_COOKIE_NAME,
  maskEmailForAdmin,
  maskPhoneForAdmin,
  parseWorkspaceRole,
} from '../../../../apps/web/src/lib/role-guard';

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

  it('verifies proxy.ts and AuthForm.tsx enforce strict Scholar vs. Admin role isolation', () => {
    const proxyContent = fs.readFileSync(path.join(REPO_ROOT, 'apps/web/proxy.ts'), 'utf8');
    expect(proxyContent).toContain('ROLE_COOKIE_NAME');
    expect(proxyContent).toContain("lumenRole === 'scholar'");
    expect(proxyContent).toContain("lumenRole === 'admin'");
    expect(proxyContent).toContain('app\\/admin');

    const authFormContent = fs.readFileSync(
      path.join(REPO_ROOT, 'apps/web/app/[locale]/(auth)/_components/AuthForm.tsx'),
      'utf8',
    );
    expect(authFormContent).toContain("setWorkspaceRoleCookie('scholar')");
    expect(authFormContent).toContain("setWorkspaceRoleCookie('admin')");
  });
});
