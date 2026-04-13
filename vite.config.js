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
    // Desabilitar code splitting para evitar erros de import dinâmico
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    },
    minify: true,
    target: 'esnext',
    chunkSizeWarningLimit: 1500,
    sourcemap: false, // Desabilitar sourcemap para evitar erros de path
    cssMinify: true
  },
  optimize: {
    // Pre-bundle dependencies
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
  }
});
