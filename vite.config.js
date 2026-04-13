import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [
    react()
  ],
  server: {
    port: 3000
  },
  build: {
    // Desabilitar code splitting para evitar erros de import dinâmico no PWA
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    minify: false,
    target: 'esnext',
    chunkSizeWarningLimit: 1500,
    sourcemap: true,
    cssMinify: true
  },
  optimize: {
    // Pre-bundle dependencies
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
  }
});
