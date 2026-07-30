import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/',
  assetsInclude: ['**/*.pfb', '**/*.ttf'],
  plugins: [
    vue(),
    react(),
    VitePWA({
      includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        maximumFileSizeToCacheInBytes: 15000000,
      },
      manifest: {
        name: 'PDF小工具箱',
        short_name: 'PDF工具箱',
        description: '100% 浏览器本地运行的免费在线 PDF 工具箱 (扫描件/打印效果/骑缝章)',
        theme_color: '#111116',
        background_color: '#0a0a0c',
        display: 'standalone',
        lang: 'zh-CN',
        icons: [
          {
            src: 'favicon.svg',
            sizes: '192x192 512x512',
            type: 'image/svg+xml',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  define: { 'process.env': {} },
  resolve: {
    alias: [
      { find: '@/utils/scan-renderer', replacement: fileURLToPath(new URL('./pdfscn/src/utils/scan-renderer', import.meta.url)) },
      { find: '@/composables/save-scanned-pdf', replacement: fileURLToPath(new URL('./pdfscn/src/composables/save-scanned-pdf', import.meta.url)) },
      { find: '@/composables/useTheme', replacement: fileURLToPath(new URL('./pdfscn/src/composables/useTheme.ts', import.meta.url)) },
      { find: '@/composables/useSEO', replacement: fileURLToPath(new URL('./pdfscn/src/composables/useSEO.ts', import.meta.url)) },
      { find: '@/utils/print-renderer', replacement: fileURLToPath(new URL('./pdfprn/src/utils/print-renderer', import.meta.url)) },
      { find: '@/composables/save-printed-pdf', replacement: fileURLToPath(new URL('./pdfprn/src/composables/save-printed-pdf', import.meta.url)) },
      { find: '@/utils/pdf-renderer', replacement: fileURLToPath(new URL('./pdfscn/src/utils/pdf-renderer', import.meta.url)) },
      { find: '@/utils/pdf-builder', replacement: fileURLToPath(new URL('./pdfscn/src/utils/pdf-builder', import.meta.url)) },
      { find: '@/components/scan-settings', replacement: fileURLToPath(new URL('./pdfscn/src/components/scan-settings', import.meta.url)) },
      { find: '@/components/print-settings', replacement: fileURLToPath(new URL('./pdfprn/src/components/print-settings', import.meta.url)) },
      { find: '@/components/pdf-upload', replacement: fileURLToPath(new URL('./pdfscn/src/components/pdf-upload', import.meta.url)) },
      { find: '@/components/save-button', replacement: fileURLToPath(new URL('./pdfscn/src/components/save-button', import.meta.url)) },
      { find: '@/components/page-preview', replacement: fileURLToPath(new URL('./pdfscn/src/components/page-preview', import.meta.url)) },
      { find: '@/components/Header', replacement: fileURLToPath(new URL('./pdfscn/src/components/Header', import.meta.url)) },
      { find: '@/components/Footer', replacement: fileURLToPath(new URL('./pdfscn/src/components/Footer', import.meta.url)) },
      { find: '@/components/Misc', replacement: fileURLToPath(new URL('./pdfscn/src/components/Misc', import.meta.url)) },
      { find: '@/assets/examples', replacement: fileURLToPath(new URL('./pdfscn/src/assets/examples', import.meta.url)) },
      { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }
    ]
  },
  build: {
    chunkSizeWarningLimit: 2000,
    rollupOptions: {
      output: {
        manualChunks: {
          'naive-ui': ['naive-ui'],
          'pdf-core': ['pdfjs-dist', 'pdf-lib', 'jspdf'],
          'vue-vendor': ['vue', 'vue-router', '@unhead/vue']
        }
      }
    }
  }
})
