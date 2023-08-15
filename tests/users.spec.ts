import { test, expect } from '@playwright/test';

test.describe('Users', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: 'Users' }).click();
  });
  test('show all NgRx members', async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: 'Users' }).click();

    await expect(page.getByRole('listitem')).toHaveCount(5);
    await expect(page.locator('button.active')).toBeVisible();

    await page.getByRole('button', { name: '3' }).click();
    await expect(page.getByRole('listitem')).toHaveCount(3);

    await page.getByRole('textbox').fill('Br');
    await expect(page.getByRole('listitem')).toHaveCount(1);
    await expect(page.getByRole('listitem')).toHaveText('Brandon');
  });
});
