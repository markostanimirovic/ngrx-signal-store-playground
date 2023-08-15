import { test, expect } from '@playwright/test';

test.describe('Todo', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: 'Todos' }).click();
  });

  test('add todo', async ({ page }) => {
    await page.getByRole('textbox').fill('Install Angular');
    await page.getByRole('textbox').press('Enter');
    await expect.soft(page.locator('li')).toContainText('Install Angular');

    await page.getByRole('textbox').fill('Install NgRx');
    await page.getByRole('textbox').press('Enter');
    await expect.soft(page.locator('li').nth(1)).toContainText('Install NgRx');

    await page.getByRole('button', { name: 'Remove' }).nth(1).click();
    await expect.soft(page.locator('li')).toContainText('Install Angular');
  });
});
