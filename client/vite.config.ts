import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      '/graphql': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
        cookieDomainRewrite: 'localhost',
      },
    },
  },

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/modules'),
    },
  },

  test: {
    environment: 'jsdom',
    setupFiles: './src/modules/test/setup.ts',
    globals: true,

    coverage: {
      provider: 'v8',
      reporter: ['html', 'text'],
      include: ['src/**/*.ts', 'src/**/*.tsx'],
      exclude: [
        '**/index.ts',
        '**/index.tsx',
        '**/module.ts',
        '**/types.ts',
        '**/main.tsx',
        '**/App.tsx',
      ],
      reportsDirectory: './coverage',
    },
  },
});
