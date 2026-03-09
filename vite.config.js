import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: process.env.GITHUB_REPOSITORY
    ? `/${process.env.GITHUB_REPOSITORY.split('/')[1]}/`
    : '/PROJETO-INTELIGENTE-PARK/',
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'robots.txt', 'apple-touch-icon.png', '*.svg', 'img/**/*.jpeg'],
      manifest: {
        name: 'Inteligente Park',
        short_name: 'Park',
        description: 'App de Gerenciamento de Estacionamento',
        theme_color: '#1e40af',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        start_url: './',
        icons: [
          {
            src: 'img/LogoInteligentePark.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'img/LogoInteligentePark.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'any'
          },
          {
            src: 'img/LogoInteligentePark.jpeg',
            sizes: '192x192',
            type: 'image/jpeg',
            purpose: 'maskable'
          },
          {
            src: 'img/LogoInteligentePark.jpeg',
            sizes: '512x512',
            type: 'image/jpeg',
            purpose: 'maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 3000
  },
  build: {
    // Otimizações de build
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    // Code splitting simplificado (automático)
    chunkSizeWarningLimit: 800,
    
    // Source map apenas em development
    sourcemap: process.env.NODE_ENV === 'development',
    
    // Otimizações de CSS
    cssMinify: true
  },
  optimize: {
    // Pre-bundle dependencies
    include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
  }
});
