/**
 * @purpose Playwright E2E test for IELTS CBT exam runner preview, split-screen reading layout, highlighter toolbar, and responsive/math invariants (P1-42, P2.4)
 */

import { test, expect } from '@playwright/test';

test.describe('IELTS Computer-Based Mock Runner & GRE Math E2E (P1-42 / P2.4)', () => {
  test('launches IELTS mock preview and verifies split-screen layout, highlighter, and notepad mount', async ({ page }) => {
    // 1. Visit IELTS preview simulator
    await page.goto('/exam/ielts-preview');

    // 2. Verify CBT simulator header and timer
    await expect(page.getByText(/IELTS/i).first()).toBeVisible();
    await expect(page.getByText(/58:45/i)).toBeVisible();

    // 3. Verify Reading Passage Split-Screen Layout (left passage + right question panes)
    const readingSection = page.getByRole('button', { name: /Reading Section/i });
    await expect(readingSection).toBeVisible();

    // Verify reading passage content pane
    await expect(page.getByText(/The Evolutionary Biology of Deep-Sea Bioluminescence/i)).toBeVisible();

    // Verify questions pane
    await expect(page.getByText(/QUESTIONS 1–4/i)).toBeVisible();

    // 4. Verify Toolbar: Highlighter tool
    const highlightButton = page.locator('button[title*="Highlight"]').first();
    await expect(highlightButton).toBeVisible();

    // 5. Verify Toolbar: Notepad drawer toggle
    const notesButton = page.getByRole('button', { name: /Notepad/i }).first();
    await expect(notesButton).toBeVisible();
    await notesButton.click();

    // Verify notes textarea opens
    await expect(page.locator('textarea[placeholder*="Outline your thoughts"]')).toBeVisible();

    // 6. Verify Text Size selector exists
    await expect(page.locator('select')).toBeVisible();
  });

  test('verifies Desktop (1440x900) and Mobile (375x812) viewports render /gre and /exam/ielts-preview with zero horizontal scroll and zero raw $x$ strings', async ({ page }) => {
    const viewports = [
      { name: 'Desktop', width: 1440, height: 900 },
      { name: 'Mobile', width: 375, height: 812 },
    ];
    const routes = ['/gre', '/exam/ielts-preview'];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });

      for (const route of routes) {
        await page.goto(route);

        const hasNoHorizontalOverflow = await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth
        );
        expect(hasNoHorizontalOverflow, `${route} on ${vp.name} (${vp.width}x${vp.height}) should have zero horizontal overflow`).toBe(true);

        const bodyText = await page.locator('body').innerText();
        expect(bodyText).not.toContain('$x$');
        expect(bodyText).not.toMatch(/\$[^$\n]+\$/);
      }
    }
  });
});

