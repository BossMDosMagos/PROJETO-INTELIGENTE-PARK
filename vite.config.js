import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [
    react()
  ],
  build: {
    outDir: 'dist',
    minify: false,
    sourcemap: false,
    rollupOptions: {
      output: {
        // Force everything into single chunk
        manualChunks: () => 'bundle'
      }
    }
  }
});
