<template>
  <div class="scan-view-layout">
    <Header />

    <!-- Sidebar Split View -->
    <div class="split-view">
      <aside class="sidebar-panel">
        <div class="sidebar-content">
          <PDFUpload @update:pdf="pdf = $event" />
          <PDFInfo :pdf="pdf" v-if="pdf" @remove="pdf = undefined" />

          <hr class="divider" />

          <ScanSettingsCard v-model:config="config" />

          <hr class="divider" />

          <SaveButtonCard
            @generate="generate"
            :progress="progress"
            :saving="saving"
            :pdf="scannedPDF"
          />
        </div>
      </aside>

      <main class="preview-panel">
        <PreviewCompare
          :pdfRenderer="pdfRenderer"
          :scanRenderer="scanRenderer"
          :scale="config.scale"
        />
      </main>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { type ScanConfig, defaultConfig, CanvasScanner } from '@/utils/scan-renderer/canvas-scan'
import ScanSettingsCard from '@/components/scan-settings/ScanSettingsCard.vue'
import PDFUpload from '@/components/pdf-upload/PDFUpload.vue'
import Header from '@/components/Header/Header.vue'
import { ref, computed, watch } from 'vue'
import PDFURL from '@/assets/examples/pdfs/test.pdf'
import { useI18n } from 'vue-i18n'
import { PDF } from '@/utils/pdf-renderer/pdfjs'
import PreviewCompare from '@/components/page-preview/PreviewCompare.vue'
import SaveButtonCard from '@/components/save-button/SaveButtonCard.vue'
import { useSaveScannedPDF } from '@/composables/save-scanned-pdf'
import PDFInfo from '@/components/pdf-upload/PDFInfo.vue'
import { ScanCacher } from '@/utils/scan-renderer/scan-cacher'
import { useMessage } from 'naive-ui'

const { t } = useI18n()
const message = useMessage()


const pdf = ref<File | undefined>(undefined)

const initExamplePDF = async () => {
  const response = await fetch(PDFURL)
  const blob = await response.blob()
  const file = new File([blob], 'example.pdf')
  if (!pdf.value) {
    pdf.value = file
  }
}

initExamplePDF()

const config = ref<ScanConfig>(defaultConfig)
const pdfRenderer = computed(() => {
  if (!pdf.value) return

  return new PDF(pdf.value)
})

const scanRenderer = ref(new ScanCacher(new CanvasScanner(config.value)))
watch(
  config,
  (newConfig) => {
    scanRenderer.value = new ScanCacher(new CanvasScanner(newConfig))
  },
  { deep: true }
)

const scale = computed(() => config.value.scale)

const { save, progress, saving, scannedPDF } = useSaveScannedPDF(
  pdf,
  pdfRenderer,
  scanRenderer,
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
</script>

<style scoped>
.scan-view-layout {
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
  background-color: var(--color-bg);
  color: var(--color-text);
  font-family: var(--font-sans);
  overflow: hidden;
}

/* ── Desktop: fixed height split pane ── */
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
}

@media (min-width: 769px) {
  .preview-panel {
    display: flex;
    flex-direction: column;
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

/* ── Mobile: stacked layout, page-level scrolling ── */
@media (max-width: 768px) {
  .scan-view-layout {
    height: auto;
    min-height: 100dvh;
    overflow: visible;
  }

  .split-view {
    flex-direction: column;
    height: auto;
    overflow: visible;
  }

  /* Preview shown first on mobile (above the fold) */
  .preview-panel {
    order: -1;
    width: 100%;
    height: auto;
    min-height: 50vw;
    overflow: visible;
    padding: var(--space-3);
    border-bottom: 1px solid var(--color-border);
  }

  .sidebar-panel {
    width: 100%;
    border-right: none;
    height: auto;
    overflow: visible;
    padding: var(--space-3);
    padding-bottom: calc(var(--space-8) + env(safe-area-inset-bottom));
  }
}
</style>
