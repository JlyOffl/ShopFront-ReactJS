/// <reference types="vitest/config" />
import { fileURLToPath, URL } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
    // Point at a real backend instead of MSW by setting VITE_ENABLE_MOCKS=false
    // and uncommenting the proxy below.
    // proxy: { '/api': { target: 'https://localhost:7001', changeOrigin: true, secure: false } },
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        // Long-term cacheable vendor chunks
        manualChunks: {
          react: ['react', 'react-dom', 'react-router'],
          redux: ['@reduxjs/toolkit', 'react-redux'],
          mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setupTests.ts'],
    css: false,
    restoreMocks: true,
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      exclude: ['src/mocks/**', 'src/test/**', 'src/main.tsx', 'src/**/index.ts'],
    },
  },
});
