import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    watchExclude: ['./storage/**'],
  },
  resolve: {
    alias: {
      '~': './cli',
    },
  },
})
