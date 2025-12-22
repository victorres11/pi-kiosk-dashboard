import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Optimize for production
    target: 'es2020',
    minify: 'esbuild',
    sourcemap: false,
    // Output to dist folder
    outDir: 'dist',
    // Chunk splitting for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          charts: ['recharts'],
          utils: ['date-fns', 'axios'],
        },
      },
    },
  },
  server: {
    // For local development
    port: 3000,
    host: true, // Listen on all addresses
  },
  preview: {
    // For production preview
    port: 8080,
    host: true,
  },
});
