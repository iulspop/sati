import { defineConfig, devices } from '@playwright/test'

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  timeout: 30 * 1000,
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 3 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    actionTimeout: 0,
    baseURL: process.env.BASE_URL || process.env.CI ? 'http://localhost:3000' : 'http://localhost:3001',
    trace: process.env.CI ? 'on-first-retry' : 'retain-on-failure',
  },
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
      },
    },
  ],
  webServer: {
    command: process.env.CI
      ? 'npm run build && npm run start'
      : '"You must start Remix dev server first before running e2e test: \'npm run dev:e2e\'"',
    port: process.env.CI ? 3000 : 3001,
    reuseExistingServer: !process.env.CI,
  },
})
