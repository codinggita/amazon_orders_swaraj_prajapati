import { defineConfig } from 'vite';
import react            from '@vitejs/plugin-react';
import tailwindcss      from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  
  build: {
    // Generate source maps for debugging
    sourcemap: false,
    
    // Chunk splitting for better SEO (faster loads)
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router-dom')) {
              return 'vendor';
            }
            if (id.includes('@reduxjs') || id.includes('react-redux')) {
              return 'redux';
            }
            if (id.includes('recharts')) {
              return 'charts';
            }
            if (id.includes('@mui') || id.includes('@emotion')) {
              return 'mui';
            }
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            if (id.includes('formik') || id.includes('yup')) {
              return 'forms';
            }
            if (id.includes('axios')) {
              return 'utils';
            }
            return 'vendor_other';
          }
        },
      },
    },
    
    // Target modern browsers
    target: 'es2020',
    
    // Minify
    minify: 'esbuild',
  },
  
  // Preview server
  preview: {
    port: 4173,
    host: true,
  },
  
  // Dev server
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target:       'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
});
