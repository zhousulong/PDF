<template>
  <div class="print-view-layout">
    <Header />

    <!-- Mobile Tab Bar -->
    <div class="mobile-tabbar">
      <button
        class="mobile-tab"
        :class="{ active: mobileTab === 'preview' }"
        @click="mobileTab = 'preview'"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.3"/>
          <path d="M4 4h6M4 7h4" stroke="currentColor" stroke-width="1.1" stroke-linecap="round" opacity="0.6"/>
        </svg>
        {{ t('base.printTitle') }}
      </button>
      <button
        class="mobile-tab"
        :class="{ active: mobileTab === 'settings' }"
        @click="mobileTab = 'settings'"
      >
        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
          <circle cx="7" cy="7" r="2" stroke="currentColor" stroke-width="1.3"/>
          <path d="M7 1v2M7 11v2M1 7h2M11 7h2M2.93 2.93l1.41 1.41M9.66 9.66l1.41 1.41M9.66 4.34l1.41-1.41M2.93 11.07l1.41-1.41" stroke="currentColor" stroke-width="1.1" stroke-linecap="round"/>
        </svg>
        {{ t('settings.settings') }}
      </button>
    </div>

    <!-- Sidebar Split View -->
    <div class="split-view">
      <aside class="sidebar-panel" :class="{ 'mobile-hidden': mobileTab !== 'settings' }">
        <div class="sidebar-content">
          <PDFUpload @update:pdf="pdf = $event" />
          <PDFInfo :pdf="pdf" v-if="pdf" @remove="pdf = undefined" />

          <hr class="divider" />

          <PrintSettingsCard v-model:config="config" />

          <hr class="divider" />

          <SaveButtonCard
            @generate="generate"
            :progress="progress"
            :saving="saving"
            :pdf="printedPDF"
          />
        </div>
      </aside>

      <main class="preview-panel" :class="{ 'mobile-hidden': mobileTab !== 'preview' }">
        <PreviewCompare
          :pdfRenderer="pdfRenderer"
          :scanRenderer="printRenderer"
          :scale="config.scale"
        />
      </main>
    </div>

    <!-- Mobile Sticky Generate Button (shown on preview tab) -->
    <div class="mobile-fab" v-if="mobileTab === 'preview'">
      <button
        class="mobile-fab-btn"
        :class="{ 'processing': saving }"
        @click="saving ? null : (printedPDF ? download() : generate())"
        :disabled="saving"
      >
        <template v-if="saving">
          <span class="spinner-sm" />
          <span>{{ t('actions.generating') }} {{ Math.round((progress ?? 0) * 100) }}%</span>
        </template>
        <template v-else-if="printedPDF">
          <svg width="15" height="15" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v7M4.5 7l2.5 2.5L9.5 7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 11h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <span>{{ t('actions.downloadScannedPDF') }}</span>
        </template>
        <template v-else>
          <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
            <path d="M13 8c0 2.76-2.24 5-5 5S3 10.76 3 8s2.24-5 5-5c1.23 0 2.36.45 3.23 1.19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="8" cy="8" r="2" fill="currentColor"/>
            <path d="M11 3l.5 2.5-2.5-.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ t('actions.generateScannedPDF') }}</span>
        </template>
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type PrintConfig, defaultConfig, CanvasPrinter } from '@/utils/print-renderer'
import PrintSettingsCard from '@/components/print-settings/PrintSettingsCard.vue'
import PDFUpload from '@/components/pdf-upload/PDFUpload.vue'
import Header from '@/components/Header/Header.vue'
import { ref, computed, watch } from 'vue'
import PDFURL from '@/assets/examples/pdfs/test.pdf'
import { useHead } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { PDF } from '@/utils/pdf-renderer/pdfjs'
import PreviewCompare from '@/components/page-preview/PreviewCompare.vue'
import SaveButtonCard from '@/components/save-button/SaveButtonCard.vue'
import { useSavePrintedPDF } from '@/composables/save-printed-pdf'
import PDFInfo from '@/components/pdf-upload/PDFInfo.vue'
import { PrintCacher } from '@/utils/print-renderer/print-cacher'
import { useMessage } from 'naive-ui'
import { fileSave } from 'browser-fs-access'

const mobileTab = ref<'preview' | 'settings'>('preview')

const { t } = useI18n()
const message = useMessage()

useHead({
  title: () => t('base.pageTitle'),
  meta: [
    { name: 'description', content: () => t('base.pageDescription') },
    { name: 'keywords', content: () => t('base.pageKeywords') },
    // Open Graph
    { property: 'og:title', content: () => t('base.pageTitle') },
    { property: 'og:description', content: () => t('base.pageDescription') },
    { property: 'og:type', content: 'website' },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: () => t('base.pageTitle') },
    { name: 'twitter:description', content: () => t('base.pageDescription') }
  ]
})

const pdf = ref<File | undefined>(undefined)

const initExamplePDF = async () => {
  try {
    const response = await fetch(PDFURL)
    const blob = await response.blob()
    const file = new File([blob], 'example.pdf')
    if (!pdf.value) {
      pdf.value = file
    }
  } catch (e) {
    console.error('Failed to load example PDF:', e)
  }
}

initExamplePDF()

const config = ref<PrintConfig>(defaultConfig)
const pdfRenderer = computed(() => {
  if (!pdf.value) return

  return new PDF(pdf.value)
})

const printRenderer = ref(new PrintCacher(new CanvasPrinter(config.value)))
watch(
  config,
  (newConfig) => {
    printRenderer.value = new PrintCacher(new CanvasPrinter(newConfig))
  },
  { deep: true }
)

const scale = computed(() => config.value.scale)

const { save, progress, saving, printedPDF } = useSavePrintedPDF(
  pdf,
  pdfRenderer,
  printRenderer,
  scale
)

const generate = async () => {
  try {
    await save()
    message.success(t('actions.generateSuccess'))
  } catch (e) {
    message.error(t('actions.generateError') + (e as Error).message)
  }
}

const download = async () => {
  if (!printedPDF.value) return
  try {
    await fileSave(printedPDF.value, {
      fileName: printedPDF.value.name,
      extensions: ['.pdf'],
      mimeTypes: ['application/pdf'],
      startIn: 'downloads',
      description: 'PDF File',
      id: 'pdfprn'
    })
  } catch (err) {
    // User cancelled
  }
}
</script>

<style scoped>
.print-view-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: var(--color-bg);
  color: var(--color-text);
  overflow: hidden;
  font-family: var(--font-sans);
}

.split-view {
  display: flex;
  flex: 1;
  overflow: hidden;
  min-height: 0;
}

.sidebar-panel {
  width: var(--sidebar-w);
  flex-shrink: 0;
  border-right: 1px solid var(--color-border);
  background: var(--color-surface);
  padding: var(--space-4);
  overflow-y: auto;
  height: 100%;
}

.preview-panel {
  flex: 1;
  background: var(--color-bg);
  padding: var(--space-4);
  overflow-y: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (min-width: 769px) {
  .preview-panel {
    overflow: hidden;
  }
}

/* Custom Scrollbars */
.sidebar-panel::-webkit-scrollbar,
.preview-panel::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.sidebar-panel::-webkit-scrollbar-track,
.preview-panel::-webkit-scrollbar-track {
  background: transparent;
}
.sidebar-panel::-webkit-scrollbar-thumb,
.preview-panel::-webkit-scrollbar-thumb {
  background: var(--color-border-2);
  border-radius: var(--radius-full);
}
.sidebar-panel::-webkit-scrollbar-thumb:hover,
.preview-panel::-webkit-scrollbar-thumb:hover {
  background: var(--color-text-muted);
}

.divider {
  border: 0;
  height: 1px;
  background: var(--color-border);
  margin: var(--space-4) 0;
}

/* ── Mobile Tab Bar (hidden on desktop) ── */
.mobile-tabbar {
  display: none;
}

/* ── Mobile FAB (hidden on desktop) ── */
.mobile-fab {
  display: none;
}

/* ── Mobile Responsive ── */
@media (max-width: 768px) {
  .print-view-layout {
    height: 100dvh; /* use dynamic viewport on mobile browsers */
    overflow: hidden;
  }

  /* Tab bar appears on mobile */
  .mobile-tabbar {
    display: flex;
    border-bottom: 1px solid var(--color-border);
    background: var(--color-surface);
    flex-shrink: 0;
  }

  .mobile-tab {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    font-size: var(--text-sm);
    font-weight: 500;
    color: var(--color-text-muted);
    background: none;
    border: none;
    border-bottom: 2px solid transparent;
    cursor: pointer;
    transition: all var(--transition);
    -webkit-tap-highlight-color: transparent;
    letter-spacing: 0.02em;
  }

  .mobile-tab.active {
    color: var(--color-accent);
    border-bottom-color: var(--color-accent);
    background: var(--color-accent-glow);
  }

  .split-view {
    flex-direction: column;
    overflow: hidden;
    height: calc(100dvh - var(--header-h) - 44px); /* subtract tab bar */
  }

  /* Panel visibility toggling on mobile */
  .sidebar-panel {
    width: 100%;
    height: 100%;
    border-right: none;
    border-bottom: none;
    overflow-y: auto;
    padding: var(--space-4) var(--space-4) 100px; /* bottom padding for FAB */
    -webkit-overflow-scrolling: touch;
  }

  .preview-panel {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    padding: var(--space-3) var(--space-3) 88px; /* bottom padding for FAB */
    -webkit-overflow-scrolling: touch;
  }

  .mobile-hidden {
    display: none !important;
  }

  /* Mobile sticky generate button */
  .mobile-fab {
    display: block;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    padding: var(--space-3) var(--space-4);
    padding-bottom: calc(var(--space-3) + env(safe-area-inset-bottom, 0px));
    background: var(--color-surface);
    border-top: 1px solid var(--color-border);
    z-index: 50;
    backdrop-filter: blur(12px);
    background: rgba(var(--color-surface-rgb, 255,255,255), 0.95);
  }

  .mobile-fab-btn {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--space-2);
    padding: var(--space-3) var(--space-4);
    background: var(--color-accent);
    color: #fff;
    border-radius: var(--radius-md);
    font-size: var(--text-sm);
    font-weight: 600;
    border: none;
    cursor: pointer;
    transition: all var(--transition);
    -webkit-tap-highlight-color: transparent;
    letter-spacing: 0.02em;
    min-height: 48px; /* touch target */
  }

  .mobile-fab-btn:active:not(:disabled) {
    transform: scale(0.98);
    opacity: 0.9;
  }

  .mobile-fab-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }

  .mobile-fab-btn.processing {
    background: var(--color-accent-dim);
  }

  /* Spinner inside FAB */
  .spinner-sm {
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255, 255, 255, 0.35);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    flex-shrink: 0;
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }
}
</style>
