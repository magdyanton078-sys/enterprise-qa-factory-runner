import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './runner',

  timeout: 30 * 1000,

  expect: {
    timeout: 5000
  },

  retries: 1,

  use: {
    headless: true,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10 * 1000,
    navigationTimeout: 20 * 1000
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }]
  ]
});
