<template>
  <div class="section save-section">
    <h2 class="section-title">{{ t('base.actions.generateAndDownload') }}</h2>

    <div class="actions">
      <!-- Generate Button -->
      <button
        v-if="!pdf"
        class="start-btn"
        :class="{ 'processing': saving }"
        @click="emit('generate')"
        :disabled="saving"
        id="generate-pdf"
      >
        <template v-if="saving">
          <span class="spinner-sm" />
          <span>{{ t('actions.generating') }} ({{ Math.round((progress ?? 0) * 100) }}%)</span>
        </template>
        <template v-else>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M13 8c0 2.76-2.24 5-5 5S3 10.76 3 8s2.24-5 5-5c1.23 0 2.36.45 3.23 1.19" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
            <circle cx="8" cy="8" r="2" fill="currentColor"/>
            <path d="M11 3l.5 2.5-2.5-.5" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <span>{{ t('actions.generateScannedPDF') }}</span>
        </template>
      </button>

      <!-- Download & Regenerate Buttons -->
      <div v-else class="download-row">
        <button
          class="download-btn"
          @click="download"
          id="download-pdf"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M7 2v7M4.5 7l2.5 2.5L9.5 7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M2 11h10" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>
          </svg>
          <span>{{ t('actions.downloadScannedPDF') }}</span>
        </button>

        <button
          class="regenerate-btn"
          @click="emit('generate')"
          id="regenerate-pdf"
        >
          {{ t('base.actions.regenerate') }}
        </button>
      </div>
    </div>

    <!-- Progress Bar (shown during generation) -->
    <div v-if="saving && progress !== undefined" class="progress-bar-wrap">
      <div class="progress-bar-track">
        <div class="progress-bar-fill" :style="{ width: (progress * 100) + '%' }"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { fileSave } from 'browser-fs-access'

const { t } = useI18n()

const props = defineProps<{
  progress?: number
  saving?: boolean
  pdf?: File
}>()

const emit = defineEmits<{
  (e: 'generate'): void
}>()

const download = async () => {
  if (!props.pdf) return

  try {
    await fileSave(props.pdf, {
      fileName: props.pdf.name,
      extensions: ['.pdf'],
      mimeTypes: ['application/pdf'],
      startIn: 'downloads',
      description: 'PDF File',
      id: 'lookscanned'
    })
  } catch (err) {
    // User cancelled
  }
}
</script>

<style scoped>
.save-section {
  margin-top: var(--space-4);
}

.actions {
  display: flex;
  gap: var(--space-2);
  width: 100%;
}

.start-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  background: var(--color-accent);
  color: #fff;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  border: none;
  letter-spacing: 0.02em;
  flex: 1;
  justify-content: center;
  outline: none;
}

.start-btn:hover:not(:disabled) {
  background: var(--color-accent-dim);
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgba(91, 124, 250, 0.4);
}

.start-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.processing {
  background: var(--color-accent-dim) !important;
}

.download-row {
  display: flex;
  gap: var(--space-2);
  width: 100%;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: rgba(52, 211, 153, 0.08);
  color: var(--color-success);
  border: 1px solid rgba(52, 211, 153, 0.3);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition);
  flex: 1;
  justify-content: center;
  outline: none;
}

.download-btn:hover {
  background: rgba(52, 211, 153, 0.15);
  border-color: var(--color-success);
}

.regenerate-btn {
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-2);
  color: var(--color-text-dim);
  border: 1px solid var(--color-border-2);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  cursor: pointer;
  transition: all var(--transition);
  outline: none;
}

.regenerate-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
  background: var(--color-surface-3);
}

/* Spinner */
.spinner-sm {
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
  flex-shrink: 0;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* Progress Bar */
.progress-bar-wrap {
  margin-top: var(--space-2);
  width: 100%;
}

.progress-bar-track {
  height: 4px;
  background: var(--color-border);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: var(--color-accent);
  border-radius: var(--radius-full);
  transition: width 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}
</style>
