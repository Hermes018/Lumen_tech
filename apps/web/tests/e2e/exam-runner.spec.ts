/**
 * @purpose Playwright E2E test for IELTS CBT exam runner preview, split-screen reading layout, and highlighter toolbar (P1-42)
 */

import { test, expect } from '@playwright/test';

test.describe('IELTS Computer-Based Mock Runner E2E (P1-42)', () => {
  test('launches IELTS mock preview and verifies split-screen layout, highlighter, and notepad mount', async ({ page }) => {
    // 1. Visit IELTS preview simulator
    await page.goto('/exam/ielts-preview');

    // 2. Verify CBT simulator header and timer
    await expect(page.getByText(/IELTS on Computer/i)).toBeVisible();
    await expect(page.getByText(/Remaining/i)).toBeVisible();

    // 3. Verify Reading Passage Split-Screen Layout (left passage + right question panes)
    const readingSection = page.getByRole('button', { name: /Reading Section/i });
    await expect(readingSection).toBeVisible();

    // Verify reading passage content pane
    await expect(page.getByText(/The Evolutionary Origins of Language/i)).toBeVisible();

    // Verify questions pane
    await expect(page.getByText(/Questions 1–5/i)).toBeVisible();

    // 4. Verify Toolbar: Highlighter tool
    const highlightButton = page.getByRole('button', { name: /Highlight/i });
    await expect(highlightButton).toBeVisible();

    // 5. Verify Toolbar: Notes drawer toggle
    const notesButton = page.getByRole('button', { name: /Notes/i });
    await expect(notesButton).toBeVisible();
    await notesButton.click();

    // Verify notes textarea opens
    await expect(page.locator('textarea[placeholder*="Type rough notes"]')).toBeVisible();

    // 6. Verify Text Size toggle exists
    const textSizeButton = page.getByRole('button', { name: /Text Size/i });
    await expect(textSizeButton).toBeVisible();
  });
});
