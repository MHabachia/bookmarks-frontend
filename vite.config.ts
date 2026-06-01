import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      // Im Dev-Modus: Anfragen an /api werden ans Backend weitergeleitet
      '/api': {
        target: 'https://bookmarks-backend-w11a.onrender.com',
        changeOrigin: true,
      }
    }
  }
})
