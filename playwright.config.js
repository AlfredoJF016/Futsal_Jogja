/** Playwright config for basic E2E runs against local preview at :5173 */
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: 'tests/e2e',
  timeout: 30_000,
  expect: { timeout: 5000 },
  use: {
    baseURL: 'http://127.0.0.1:5173',
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 10000,
  },
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 5173',
    url: 'http://127.0.0.1:5173',
    timeout: 30_000,
    reuseExistingServer: false,
  },
});
