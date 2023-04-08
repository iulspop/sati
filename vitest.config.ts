import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  test: {
    environment: 'happy-dom',
    setupFiles: ['./app/test/setup-test-environment.ts'],
    include: ['**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    exclude: ['**/*.integration.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}', 'node_modules', '.git', '.cache'],
    watchExclude: ['.*\\/node_modules\\/.*', '.*\\/build\\/.*'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    },
  },
})
