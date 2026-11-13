/**
 * @purpose Playwright E2E test for Pricing selection, Checkout flow, and Manual bKash/Nagad fallback tab (P1-42)
 */

import { test, expect } from '@playwright/test';

test.describe('Checkout & Manual Payment Flow (P1-42)', () => {
  test('guest visits /pricing, navigates to /checkout, and toggles manual bKash/Nagad payment form', async ({ page }) => {
    // 1. Visit pricing page
    await page.goto('/pricing');
    await expect(page).toHaveTitle(/Lumen|Pricing/i);

    // 2. Locate plan CTA and navigate to checkout
    const checkoutLink = page.locator('a[href*="/checkout"]').first();
    await expect(checkoutLink).toBeVisible();
    await checkoutLink.click();

    // 3. Confirm checkout page rendered
    await expect(page).toHaveURL(/\/checkout/);
    await expect(page.locator('h1')).toContainText(/Complete Your Enrollment/i);

    // 4. Verify billing input fields are mounted
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="tel"]').first()).toBeVisible();

    // 5. Click the "Manual bKash / Nagad" tab
    const manualTabButton = page.getByRole('button', { name: /Manual bKash \/ Nagad/i });
    await expect(manualTabButton).toBeVisible();
    await manualTabButton.click();

    // 6. Verify manual merchant payment details and TrxID form mount
    await expect(page.getByText(/Direct Merchant Payment \(Fallback\)/i)).toBeVisible();
    await expect(page.getByText(/01894928001/)).toBeVisible(); // bKash merchant
    await expect(page.locator('input[placeholder*="BL54A92K1M"]')).toBeVisible(); // TrxID input

    // 7. Toggle to Nagad Merchant and verify update
    const nagadButton = page.getByRole('button', { name: /Nagad Merchant/i });
    await expect(nagadButton).toBeVisible();
    await nagadButton.click();
    await expect(page.getByText(/01894928002/)).toBeVisible(); // Nagad merchant
  });
});
