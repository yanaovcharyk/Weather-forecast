import { defineConfig } from 'vitest/config';
import { loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_');
  const devServerProxyTarget =
    env.VITE_DEV_SERVER_PROXY_TARGET || 'http://localhost:3000';

  return {
    plugins: [react()],

    server: {
      proxy: {
        '/graphql': {
          target: devServerProxyTarget,
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
      setupFiles: './src/modules/common/testing/setupJest.ts',
      css: false,
      globals: true,
      clearMocks: true,
      fileParallelism: false,
      testTimeout: 10000,

      coverage: {
        provider: 'v8',
        reporter: ['html', 'text'],
        include: ['src/**/*.ts', 'src/**/*.tsx'],

        exclude: [
          '**/testing/**',
          '**/types/**',
          '**/__tests__/**',

          '**/index.ts',
          '**/index.tsx',
          '**/module.ts',
          '**/types.ts',
          '**/main.tsx',
          '**/App.tsx',
        ],

        reportsDirectory: './coverage',
        thresholds: {
          100: true,
        },
      },
    },
  };
});
