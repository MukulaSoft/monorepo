import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
    setupFiles: ['../../vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 80,
      reporter: ['text', 'lcov'],
      exclude: ['**/*.test.ts'],
    },
  },
})
