import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['../../vitest.setup.ts'],
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      lines: 90,
      statements: 90,
      functions: 90,
      branches: 80,
      reporter: ['text', 'lcov'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
})
