import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    base: isDev ? '/' : '/AstroDist-Frontend/',
    plugins: [
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
        manifest: {
          name: 'AstroDist',
          short_name: 'AstroDist',
          description: 'AstroDist Astronomy Services',
          theme_color: '#ffffff',
          icons: [
            {
              src: 'pwa-192x192.png',
              sizes: '192x192',
              type: 'image/png',
            },
            {
              src: 'pwa-512x512.png',
              sizes: '512x512',
              type: 'image/png',
            },
          ],
        },
      }),
    ],
    clearScreen: false,
    server: {
      port: 5173,
      strictPort: true,
      proxy: {
        '/api': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
        '/order': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
        '/static': { target: 'http://localhost:8080', changeOrigin: true, secure: false },
        '/pictures': { target: 'http://localhost:9000', changeOrigin: true, secure: false },
      },
      },
    envPrefix: ['VITE_'],
    build: {
      target: 'esnext',
      minify: 'esbuild',
      sourcemap: false,
    },
  };
});


