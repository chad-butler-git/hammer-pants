// @ts-check
const { test, expect } = require('@playwright/test');

test.describe('Grocery Shopping App E2E Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the application
    await page.goto('http://localhost:5173');
    // Wait for the application to load
    await page.waitForSelector('h1');
  });

  test('should load the homepage', async ({ page }) => {
    // Verify the page title
    await expect(page).toHaveTitle(/Grocery Shopping/);
    // Verify the main heading is visible
    await expect(page.locator('h1')).toBeVisible();
  });

  test('should navigate to shopping list page', async ({ page }) => {
    // Click on the shopping list link/button
    await page.click('text=Shopping List');
    // Verify we're on the shopping list page
    await expect(page.locator('h1')).toContainText(/Shopping List/);
  });

  test('should navigate to route view page', async ({ page }) => {
    // Click on the route view link/button
    await page.click('text=Route View');
    // Verify we're on the route view page
    await expect(page.locator('h1')).toContainText(/Route View/);
  });
});