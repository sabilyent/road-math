import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: 'index.dev.html'
    }
  },
  server: {
    port: 5173,
    host: true,
  }
});
