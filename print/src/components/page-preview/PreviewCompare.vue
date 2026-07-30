<template>
  <div class="preview-compare-container">
    <div class="preview-compare-main">
      <SideBySidePreview>
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
    </div>
    <div class="preview-compare-pagination" v-if="numPages >= 2">
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
// No NSpace import needed

const page = ref(1)
const scanning = ref(false)

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
      pageIndex?: number
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
      signal: controller.signal,
      pageIndex: page.value - 1
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
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  flex: 1;
  min-height: 0;
}

.preview-compare-main {
  flex: 1;
  min-height: 0;
  display: flex;
  align-items: stretch;
  justify-content: center;
  width: 100%;
}

.preview-compare-pagination {
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  margin-top: var(--space-4);
}

@media (max-width: 768px) {
  .preview-compare-container {
    height: auto;
  }
  .preview-compare-main {
    flex: none;
    height: auto;
  }
}
</style>
