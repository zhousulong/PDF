import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig({
  assetsInclude: ["**/*.pfb", "**/*.ttf"],
  plugins: [
    vue(),
    VitePWA({
      includeAssets: ["favicon.svg"],
      workbox: {
        globPatterns: ["assets/*", "**/*.{js,css,html}"],
        maximumFileSizeToCacheInBytes: 10000000,
      },
      manifest: {
        name: "PDFPRN",
        short_name: "PDFPRN",
        description:
          "PDFPRN is a pure frontend website that makes your PDFs look like they were printed by real printers. Simulates color/grayscale laser, inkjet, and dot-matrix printers.",
        theme_color: "#0f0f13",
        icons: [
          {
            "src": "favicon.svg",
            "sizes": "32x32 48x48 96x96 128x128 256x256 512x512",
            "type": "image/svg+xml",
            "purpose": "any"
          }
        ],
      },
    }),
  ],
  define: { "process.env": {} },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
  // worker: {
  //   format: "es",
  // },
  /* remove the need to specify .vue files https://vitejs.dev/config/#resolve-extensions
  resolve: {
    extensions: [
      '.js',
      '.json',
      '.jsx',
      '.mjs',
      '.ts',
      '.tsx',
      '.vue',
    ]
  },
  */
});
