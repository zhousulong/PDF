<template>
  <div class="preview-compare-container">
    <!-- Segmented tabs switch shown only on mobile -->
    <div class="mobile-tabs-container">
      <div class="segmented-control">
        <button
          :class="['tab-btn', { active: activeTab === 'scan' }]"
          @click="activeTab = 'scan'"
        >
          {{ t('preview.scanned') }}
        </button>
        <button
          :class="['tab-btn', { active: activeTab === 'pdf' }]"
          @click="activeTab = 'pdf'"
        >
          {{ t('preview.original') }}
        </button>
      </div>
    </div>

    <SideBySidePreview :active-tab="activeTab" class="preview-compare-content">
      <template #pdf>
        <ImagePreview :image="image?.blob" />
      </template>
      <template #scan>
        <ImagePreview
          :image="scanning ? undefined : scanImage?.blob"
          :height="image?.height"
          :width="image?.width"
        />
      </template>
    </SideBySidePreview>
    <div class="pagination-wrapper" v-if="numPages >= 2">
      <PreviewPagination v-model:page="page" :numPages="numPages" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import SideBySidePreview from './SideBySidePreview.vue'
import ImagePreview from './ImagePreview.vue'
import { ref } from 'vue'
import { computedAsync } from '@vueuse/core'
import PreviewPagination from './PreviewPagination.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const page = ref(1)
const scanning = ref(false)
const activeTab = ref<'scan' | 'pdf'>('scan')

interface PDFRenderer {
  renderPage(
    page: number,
    scale: number
  ): Promise<{
    blob: Blob
    width: number
    height: number
  }>
  getNumPages(): Promise<number>
}

interface ScanRenderer {
  renderPage(
    image: Blob,
    options?: {
      signal?: AbortSignal
    }
  ): Promise<{
    blob: Blob
  }>
}

const props = defineProps<{
  pdfRenderer?: PDFRenderer
  scanRenderer?: ScanRenderer
  scale: number
}>()

const image = computedAsync(async () => {
  if (!props.pdfRenderer)
    return {
      blob: undefined,
      height: undefined,
      width: undefined
    }

  const { blob, width, height } = await props.pdfRenderer.renderPage(page.value, props.scale)
  return {
    blob,
    width,
    height
  }
})

let controller = new AbortController()

const scanImage = computedAsync(
  async () => {
    controller.abort()
    controller = new AbortController()
    if (!props.scanRenderer || !image.value.blob) return

    const { blob } = await props.scanRenderer.renderPage(image.value.blob, {
      signal: controller.signal
    })
    return {
      blob
    }
  },
  undefined,
  scanning
)

const numPages = computedAsync(async () => {
  page.value = 1
  if (!props.pdfRenderer) return 1
  return await props.pdfRenderer.getNumPages()
}, 1)
</script>

<style scoped>
.preview-compare-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.mobile-tabs-container {
  display: none;
  justify-content: center;
  margin-bottom: var(--space-2);
}

.segmented-control {
  display: flex;
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: 2px;
  width: 100%;
  max-width: 280px;
}

.tab-btn {
  flex: 1;
  text-align: center;
  padding: 6px 12px;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-full);
  color: var(--color-text-dim);
  transition: all var(--transition);
}

.tab-btn:hover {
  color: var(--color-text);
}

.tab-btn.active {
  background: var(--color-surface);
  color: var(--color-accent);
  box-shadow: var(--shadow-sm);
}

.pagination-wrapper {
  display: flex;
  justify-content: center;
  width: 100%;
}

@media (min-width: 769px) {
  .preview-compare-container {
    height: 100%;
    min-height: 0;
  }
  .preview-compare-content {
    flex: 1;
    min-height: 0;
  }
}

@media (max-width: 768px) {
  .mobile-tabs-container {
    display: flex;
  }
}
</style>


