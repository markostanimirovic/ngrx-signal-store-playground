import { test, expect } from '@playwright/test';

test.describe('Counter', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
    await page.getByRole('link', { name: 'Counter' }).click();
  });

  test('it should increment', async ({ page }) => {
    const count = (value: number) =>
      page.getByText(`Count: ${value}`, { exact: true });
    const doubleCount = (value: number) =>
      page.getByText(`Double Count: ${value}`);

    await expect.soft(count(0)).toBeVisible();
    await expect.soft(doubleCount(0)).toBeVisible();

    await page.getByRole('button', { name: 'Increment' }).click();

    await expect.soft(count(1)).toBeVisible();
    await expect.soft(doubleCount(2)).toBeVisible();
  });

  test('it should increment two times and then decrement', async ({ page }) => {
    const count = (value: number) =>
      page.getByText(`Count: ${value}`, { exact: true });
    const doubleCount = (value: number) =>
      page.getByText(`Double Count: ${value}`);

    await page.getByRole('button', { name: 'Increment' }).click();
    await page.getByRole('button', { name: 'Increment' }).click();
    await expect.soft(count(2)).toBeVisible();
    await expect.soft(doubleCount(4)).toBeVisible();

    await page.getByRole('button', { name: 'Decrement' }).click();
    await expect.soft(count(1)).toBeVisible();
    await expect.soft(doubleCount(2)).toBeVisible();
  });
});
