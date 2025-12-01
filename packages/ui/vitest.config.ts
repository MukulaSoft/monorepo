import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['../../vitest.setup.ts'],
    globals: true,
    include: ['src/**/*.test.ts', 'src/**/*.test.tsx'],
    coverage: {
      reporter: ['text', 'lcov'],
      exclude: ['**/*.test.ts', '**/*.test.tsx'],
    },
  },
  esbuild: {
    jsx: 'automatic',
  },
})
