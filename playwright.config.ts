import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  expect: { timeout: 10000 },
  workers: 1,
  reporter: [
    ['list'],
    ['html'],
    ['./testrail-reporter.ts', { project: 'EarthRanger-Demo', runId: 'C12345' }]
  ],
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure'
  },
  projects: [
    { name: 'chromium', use: { browserName: 'chromium' } }
  ]
});
