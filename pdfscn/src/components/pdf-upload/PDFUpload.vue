<template>
  <div class="section">
    <h2 class="section-title">{{ t('settings.pdfSelectLabel') }}</h2>

    <div
      class="drop-zone"
      :class="{ 'dragging': dragging }"
      @dragover.prevent="dragging = true"
      @dragleave="dragging = false"
      @drop.prevent="handleDrop"
      @click="onClick"
      role="button"
      tabindex="0"
      @keydown.enter="onClick"
    >
      <div class="placeholder">
        <div class="upload-icon">
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <path d="M14 4v14M7 11l7-7 7 7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M4 21h20" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" opacity="0.5"/>
          </svg>
        </div>
        <p class="hint">{{ t('base.upload.hint') }}</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { fileOpen } from 'browser-fs-access'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const dragging = ref(false)

const emit = defineEmits<{
  (e: 'update:pdf', info: File | undefined): void
}>()

async function onClick() {
  try {
    const file = await fileOpen({
      description: 'PDF Files',
      mimeTypes: ['application/pdf'],
      extensions: ['.pdf']
    })
    emit('update:pdf', file)
  } catch (err) {
    // User cancelled
  }
}

function handleDrop(e: DragEvent) {
  dragging.value = false
  const files = e.dataTransfer?.files
  if (files && files.length > 0) {
    const file = files[0]
    if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
      emit('update:pdf', file)
    }
  }
}
</script>

<style scoped>
.drop-zone {
  position: relative;
  border: 1.5px dashed var(--color-border-2);
  border-radius: var(--radius-lg);
  padding: var(--space-6) var(--space-4);
  cursor: pointer;
  transition: all var(--transition);
  background: var(--color-surface-2);
  min-height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  outline: none;
}

.drop-zone:hover, .drop-zone:focus-visible {
  border-color: var(--color-accent);
  background: var(--color-surface-3);
  box-shadow: var(--shadow-accent);
}

.dragging {
  border-color: var(--color-accent) !important;
  background: rgba(91, 124, 250, 0.06) !important;
  box-shadow: 0 0 0 1px rgba(91, 124, 250, 0.4), 0 0 30px rgba(91, 124, 250, 0.15) !important;
}

.placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  text-align: center;
}

.upload-icon {
  color: var(--color-accent);
  opacity: 0.7;
  margin-bottom: var(--space-1);
}

.hint {
  font-size: var(--text-sm);
  color: var(--color-text-dim);
}
</style>
