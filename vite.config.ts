import { fileURLToPath, URL } from 'node:url'
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

/**
 * Dual-domain build:
 * - Main site:  https://www.9ump.com   (HTML / SEO / Service Worker)
 * - Asset CDN:  https://pdf.yunno.net  (hashed static assets)
 *
 * Production CDN build:
 *   VITE_ASSET_BASE=https://pdf.yunno.net/ vite build
 *
 * Self-contained / same-origin build:
 *   vite build   (default base `/`)
 *
 * SW must always register on the page origin, never on the CDN origin.
 */
function normalizeBase(raw: string | undefined): string {
  if (!raw || raw === '/') return '/'
  const withSlash = raw.endsWith('/') ? raw : `${raw}/`
  return withSlash
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const assetBase = normalizeBase(env.VITE_ASSET_BASE || process.env.VITE_ASSET_BASE)
  const isAbsoluteAssetBase = /^https?:\/\//i.test(assetBase)
  const cdnOrigin =
    (env.VITE_CDN_ORIGIN || process.env.VITE_CDN_ORIGIN || 'https://pdf.yunno.net').replace(
      /\/$/,
      ''
    )

  return {
    base: assetBase,
    assetsInclude: ['**/*.pfb', '**/*.ttf'],
    plugins: [
      vue(),
      react(),
      VitePWA({
        // Keep SW + scope on the page origin even when assets use an absolute CDN base
        base: '/',
        scope: '/',
        buildBase: '/',
        includeAssets: ['favicon.svg', 'robots.txt', 'sitemap.xml'],
        workbox: {
          globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
          maximumFileSizeToCacheInBytes: 15000000,
          navigateFallback: 'index.html',
          navigateFallbackDenylist: [/^\/api\//],
          // When assets live on pdf.yunno.net, rewrite precache entries so the SW
          // on www.9ump.com does not try to fetch /assets/* from the page origin.
          // Literal origin string is required — workbox stringifies urlPattern fns
          // and cannot capture outer-scope variables.
          ...(isAbsoluteAssetBase
            ? {
                manifestTransforms: [
                  async (entries: { url: string; revision?: string | null; size?: number }[]) => {
                    const cdn = cdnOrigin.replace(/\/$/, '')
                    const manifest = entries.map((entry) => {
                      const url = entry.url.replace(/^\//, '')
                      // Hashed build assets + public files that HTML also points at CDN
                      if (
                        url.startsWith('assets/') ||
                        url === 'favicon.svg' ||
                        url === 'favicon.ico' ||
                        url.startsWith('pwa-') ||
                        url === 'apple-touch-icon.png'
                      ) {
                        return { ...entry, url: `${cdn}/${url}` }
                      }
                      return entry
                    })
                    return { manifest }
                  }
                ],
                runtimeCaching: [
                  {
                    urlPattern: ({ url }: { url: URL }) =>
                      url.origin === 'https://pdf.yunno.net',
                    handler: 'CacheFirst' as const,
                    options: {
                      cacheName: 'cdn-static-assets',
                      expiration: {
                        maxEntries: 300,
                        maxAgeSeconds: 60 * 60 * 24 * 365
                      },
                      cacheableResponse: {
                        statuses: [0, 200]
                      }
                    }
                  }
                ]
              }
            : {})
        },
        manifest: {
          name: 'PDF小工具箱',
          short_name: 'PDF工具箱',
          description: '100% 浏览器本地运行的免费在线 PDF 工具箱 (扫描件/打印效果/骑缝章)',
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
