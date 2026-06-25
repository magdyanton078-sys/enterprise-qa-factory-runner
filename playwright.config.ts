import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './runner',

  timeout: 60 * 1000,

  expect: {
    timeout: 10000,
  },

  retries: process.env.CI ? 2 : 1,

  use: {
    headless: true,

    trace: 'on',
    screenshot: 'on',
    video: 'on',

    actionTimeout: 15000,
    navigationTimeout: 60000,
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],
});
