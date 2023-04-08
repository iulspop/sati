import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // fetcher.Form doesn't submit when click button type=submit in happy-dom, so we use jsdom
    environment: 'jsdom',
    setupFiles: ['./app/test/setup-test-environment.ts'],
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/*.integration.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', 'node_modules', '.git', '.cache'],
    watchExclude: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
