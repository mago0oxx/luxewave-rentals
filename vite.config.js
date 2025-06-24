import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import cssInjectedByJsPlugin from 'vite-plugin-css-injected-by-js';

export default defineConfig({
  plugins: [
    react(),
    cssInjectedByJsPlugin(),
  ],
  // vite.config.js

  // ...
  server: {
    proxy: {
      '/create-stripe-checkout': {
        target: 'https://createstripecheckout-<tu-id>.a.run.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/create-stripe-checkout/, ''),
      },
    },
  },
});

