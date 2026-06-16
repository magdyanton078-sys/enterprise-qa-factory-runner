import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './runner',

  timeout: 30 * 1000,

  expect: {
    timeout: 5000,
  },

  retries: process.env.CI ? 2 : 1,

  use: {
    headless: true,

    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',

    actionTimeout: 10 * 1000,
    navigationTimeout: 20 * 1000,
  },

  reporter: [
    // 1️⃣ Human report
    ['html', { outputFolder: 'playwright-report', open: 'never' }],

    // 2️⃣ IMPORTANT: Machine-readable report
    ['json', { outputFile: 'test-results/results.json' }],

    // 3️⃣ CI-friendly report
    ['junit', { outputFile: 'test-results/junit.xml' }],
  ],

  outputDir: 'test-results/',
});
