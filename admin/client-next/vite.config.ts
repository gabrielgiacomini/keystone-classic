import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
  root: __dirname,
  base: '/keystone-next/',
  resolve: {
    dedupe: ['react', 'react-dom'],
  },
  build: {
    outDir: path.resolve(__dirname, '../public-next'),
    emptyOutDir: true,
  },
  server: {
    port: 3009,
    proxy: {
      '/keystone-api': 'http://localhost:3000',
      '/keystone/signin': 'http://localhost:3000',
      '/keystone/signout': 'http://localhost:3000',
    },
  },
  plugins: [react()],
});
