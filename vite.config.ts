import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/functions': {
        target: process.env.VITE_SUPABASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/functions/, '/functions/v1')
      }
    }
  }
});