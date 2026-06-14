import { defineConfig } from '@playwright/test';

export default defineConfig({

  testDir: './runner',

  use: {
    headless: true
  },

  reporter: [
    ['html', { outputFolder: 'playwright-report' }]
  ]
});
