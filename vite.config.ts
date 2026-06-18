import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      }
    }
  },
  // ── Vitest Konfiguration ──────────────────────────────────
  test: {
    environment: 'jsdom',   // simuliert einen Browser (DOM API)
    globals: true,           // describe/it/expect ohne Import
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html'],
      include: ['src/**/*.{ts,vue}'],
      exclude: ['src/main.ts']
    }
  }
})
