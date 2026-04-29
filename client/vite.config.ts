import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // всі запити на /graphql будуть перекинуті на бекенд на порт 3000
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
});
