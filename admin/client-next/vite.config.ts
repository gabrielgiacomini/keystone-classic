import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
import { createRequire } from 'node:module';

// React 18 is installed under npm aliases (react18 / react-dom18) so the
// root package.json can keep React 15 for the legacy Browserify bundle.
// Vite resolves these aliases so that client-next source sees React 18.
const require = createRequire(import.meta.url);
const react18Dir = path.dirname(require.resolve('react18/package.json'));
const reactDom18Dir = path.dirname(require.resolve('react-dom18/package.json'));

export default defineConfig({
  root: __dirname,
  base: '/keystone-next/',
  resolve: {
    alias: {
      react: react18Dir,
      'react-dom': reactDom18Dir,
    },
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
