import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Same-origin build on https://www.9ump.com
 *   vite build   (default base `/`)
 *
 * Optional asset-base override:
 *   VITE_ASSET_BASE=/ vite build
 */
function normalizeBase(raw: string | undefined): string {
  if (!raw || raw === '/') return '/'
  const withSlash = raw.endsWith('/') ? raw : `${raw}/`
  return withSlash
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const assetBase = normalizeBase(env.VITE_ASSET_BASE || process.env.VITE_ASSET_BASE)

  return {
    base: assetBase,
    assetsInclude: ['**/*.pfb', '**/*.ttf'],
    plugins: [
      vue(),
      react(),
      VitePWA({
        registerType: 'autoUpdate',
        base: '/',
        scope: '/',
        buildBase: '/',
        includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          cleanupOutdatedCaches: true,
          importScripts: ['/sw-reload-clients.js'],
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          maximumFileSizeToCacheInBytes: 15000000,
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api\//]
        },
        manifest: {
          name: 'PDF加盖骑缝章',
          short_name: 'PDF骑缝章',
          description: '免费在线给PDF加盖骑缝章和公章，合同、标书不用下载软件',
          theme_color: '#111116',
          background_color: '#0a0a0c',
          display: 'standalone',
          lang: 'zh-CN',
          start_url: '/',
          scope: '/',
          id: '/',
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
        {
          find: '@/utils/scan-renderer',
          replacement: fileURLToPath(new URL('./scan/src/utils/scan-renderer', import.meta.url))
        },
        {
          find: '@/composables/save-scanned-pdf',
          replacement: fileURLToPath(
            new URL('./scan/src/composables/save-scanned-pdf', import.meta.url)
          )
        },
        {
          find: '@/composables/useTheme',
          replacement: fileURLToPath(new URL('./scan/src/composables/useTheme.ts', import.meta.url))
        },
        {
          find: '@/composables/useSEO',
          replacement: fileURLToPath(new URL('./scan/src/composables/useSEO.ts', import.meta.url))
        },
        {
          find: '@/utils/print-renderer',
          replacement: fileURLToPath(new URL('./print/src/utils/print-renderer', import.meta.url))
        },
        {
          find: '@/composables/save-printed-pdf',
          replacement: fileURLToPath(
            new URL('./print/src/composables/save-printed-pdf', import.meta.url)
          )
        },
        {
          find: '@/utils/pdf-renderer',
          replacement: fileURLToPath(new URL('./scan/src/utils/pdf-renderer', import.meta.url))
        },
        {
          find: '@/utils/pdf-builder',
          replacement: fileURLToPath(new URL('./scan/src/utils/pdf-builder', import.meta.url))
        },
        {
          find: '@/components/scan-settings',
          replacement: fileURLToPath(new URL('./scan/src/components/scan-settings', import.meta.url))
        },
        {
          find: '@/components/print-settings',
          replacement: fileURLToPath(
            new URL('./print/src/components/print-settings', import.meta.url)
          )
        },
        {
          find: '@/components/pdf-upload',
          replacement: fileURLToPath(new URL('./scan/src/components/pdf-upload', import.meta.url))
        },
        {
          find: '@/components/save-button',
          replacement: fileURLToPath(new URL('./scan/src/components/save-button', import.meta.url))
        },
        {
          find: '@/components/page-preview',
          replacement: fileURLToPath(new URL('./scan/src/components/page-preview', import.meta.url))
        },
        {
          find: '@/components/Header',
          replacement: fileURLToPath(new URL('./scan/src/components/Header', import.meta.url))
        },
        {
          find: '@/components/Footer',
          replacement: fileURLToPath(new URL('./scan/src/components/Footer', import.meta.url))
        },
        {
          find: '@/components/Misc',
          replacement: fileURLToPath(new URL('./scan/src/components/Misc', import.meta.url))
        },
        {
          find: '@/assets/examples',
          replacement: fileURLToPath(new URL('./scan/src/assets/examples', import.meta.url))
        },
        { find: '@', replacement: fileURLToPath(new URL('./src', import.meta.url)) }
      ]
    },
    build: {
      chunkSizeWarningLimit: 2000,
      // Help cross-origin module + worker loads from the CDN
      modulePreload: {
        polyfill: true
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'naive-ui': ['naive-ui'],
            'pdf-core': ['pdfjs-dist', 'pdf-lib', 'jspdf'],
            'vue-vendor': ['vue', 'vue-router', '@unhead/vue']
          }
        }
      }
    },
    worker: {
      // ES workers load fine cross-origin when CDN sends ACAO
      format: 'es'
    }
  }
})
