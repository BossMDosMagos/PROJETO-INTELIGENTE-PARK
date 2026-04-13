import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: './',
  plugins: [
    react()
  ],
  root: '.',
  build: {
    outDir: 'dist',
    minify: false,
    sourcemap: false,
    rollupOptions: {
      input: './index.html'
    }
  },
  optimize: {
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
  }
});
