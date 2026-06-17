import { test, expect } from '@playwright/test';

test('create order flow and verify in /orders', async ({ page, request }) => {
  // Create order directly via API (reliable) and verify /orders page shows it
  const payload = { customer: 'E2E User', address: 'Rua E2E 123', weight: 2.5, priority: 'normal' };
  const res = await request.post('http://localhost:3001/orders', { data: payload });
  const created = await res.json();
  // open the frontend orders page which fetches backend
  await page.goto('/orders');
  await expect(page.locator('table')).toContainText(created.customer, { timeout: 10000 });
  await expect(page.locator('table')).toContainText(created.address, { timeout: 10000 });
});
