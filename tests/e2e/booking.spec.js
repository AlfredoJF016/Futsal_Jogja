import { test, expect } from '@playwright/test';

test.describe('Booking flow', () => {
  test('login page loads and booking button flow works', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveTitle(/Futsal|Jogja|Futsal Jogja|Home/i);

    await page.goto('/login');
    await expect(page.locator('input[placeholder="john@example.com"]')).toBeVisible();
    await expect(page.locator('input[placeholder="••••••••"]')).toBeVisible();
  });

  test('booking page prompts login, preserves redirect, and completes a booking', async ({ page }) => {
    await page.goto('/booking/v1');

    await expect(page.locator('text=Akses Dibatasi')).toBeVisible();
    await expect(page.locator('button:has-text("Masuk atau Daftar Sekarang")')).toBeVisible();

    await page.click('button:has-text("Masuk atau Daftar Sekarang")');
    await expect(page).toHaveURL(/\/login\?redirect=%2Fbooking%2Fv1/);

    await page.fill('input[placeholder="john@example.com"]', 'john@example.com');
    await page.fill('input[placeholder="••••••••"]', 'user123');
    await page.click('button:has-text("Masuk")');

    await expect(page).toHaveURL(/\/booking\/v1\?date=/);
    const availableSlots = page.locator('button.slot-btn:not(.disabled)');
    await expect(await availableSlots.count()).toBeGreaterThan(0);

    await availableSlots.first().click();
    await page.click('button:has-text("Lanjut ke Pembayaran")');
    await expect(page.locator('text=Pilih Metode Pembayaran')).toBeVisible();

    await page.click('label:has-text("QRIS")');
    await page.click('button:has-text("Bayar Rp")');

    await expect(page.locator('text=Booking Berhasil')).toBeVisible();
    await expect(page.locator('.receipt-card >> text=ID Booking')).toBeVisible();

    await page.click('button:has-text("Lihat Dashboard Saya")');
    await expect(page).toHaveURL('/profile');
    await expect(page.locator('text=Champion Futsal Arena')).toBeVisible();
    await expect(page.locator('text=ID Booking')).toBeVisible();
  });
});
