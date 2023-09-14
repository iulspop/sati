import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    // Remix fetcher.Form element doesn't submit when click button type=submit in happy-dom, so we use jsdom
    environment: 'jsdom',
    setupFiles: ['./app/test/setup-test-environment.ts'],
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    watchExclude: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*'],
  },
})
