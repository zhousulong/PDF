import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/pdf-lib')) return 'pdf-lib';
          if (id.includes('node_modules/pdfjs-dist')) return 'pdfjs';
          if (id.includes('node_modules/react')) return 'react-vendor';
          if (id.includes('node_modules/i18next')) return 'i18n';
        },
      },
    },
  },
  optimizeDeps: {
    include: ['pdf-lib', 'i18next', 'react-i18next'],
  },
});
