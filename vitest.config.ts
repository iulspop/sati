import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watchExclude: ['./storage/**'],
    exclude: ['node_modules', 'bin', 'src/web'],
  },
  resolve: {
    alias: {
      '@test': './test',
    },
  },
})
