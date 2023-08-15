import { test, expect } from '@playwright/test';
import { count } from 'rxjs';

test.describe('AppComponent', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('');
  });

  test('Lastname is updated continuously', async ({ page }) => {
    const name = await page.getByText(/Marko Stanimirovic\d+/).innerText();
    const counter = Number(name.match(/(\d+)$/)?.at(-1));
    await expect
      .soft(page.getByText(`Marko Stanimirovic${counter + 1}`))
      .toBeVisible();
    await expect
      .soft(
        page.getByText(
          `{ "firstName": "Marko", "lastName": "Stanimirovic${counter + 1}" }`
        )
      )
      .toBeVisible();
  });
});
