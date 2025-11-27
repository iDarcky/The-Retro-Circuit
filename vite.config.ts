
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  return {
    plugins: [react()],
    base: './', // Ensures relative paths for assets, useful for static hosting
    resolve: {
      dedupe: ['react', 'react-dom'],
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'ui-utils': ['./components/Button.tsx', './utils/security.ts'],
          }
        }
      }
    }
  };
});