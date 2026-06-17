import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    globals: true,
    include: ['test/**/*.test.ts'],
    threads: false,
    testTimeout: 20000,
  },
  // Keep Vite from resolving parent workspace config by setting root explicitly
  root: '.',
});
