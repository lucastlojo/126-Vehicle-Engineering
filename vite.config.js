import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  base: process.env.VITE_BASE_PATH || '/',
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        home: resolve(import.meta.dirname, 'index.html'),
        product: resolve(import.meta.dirname, 'products/ram-1500-etorque-mgu-rebuild-kit/index.html'),
      },
    },
  },
});
