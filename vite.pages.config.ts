import { resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const root = resolve(import.meta.dirname, 'github-pages');

export default defineConfig({
  root,
  base: '/planner/',
  plugins: [react()],
  publicDir: resolve(import.meta.dirname, 'public'),
  build: {
    outDir: resolve(import.meta.dirname, 'pages-dist'),
    emptyOutDir: true,
  },
});
