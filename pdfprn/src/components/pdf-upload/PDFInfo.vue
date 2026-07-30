<template>
  <div class="file-list">
    <div class="file-list-header">
      <span class="file-list-title">{{ t('base.upload.selectedFiles') }}</span>
      <button class="clear-btn" @click="$emit('remove')" id="clear-pdf">
        {{ t('base.actions.clear') }}
      </button>
    </div>
    <div class="file-items">
      <div class="file-item">
        <span class="file-icon">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <rect x="1" y="1" width="12" height="12" rx="2" stroke="currentColor" stroke-width="1.2"/>
            <path d="M4 5h6M4 7h6M4 9h4" stroke="currentColor" stroke-width="1" stroke-linecap="round" opacity="0.6"/>
          </svg>
        </span>
        <span class="file-name" :title="pdf.name">{{ pdf.name }}</span>
        <span class="file-size">{{ filesize(pdf.size) }}</span>
        <button
          class="remove-btn"
          @click="$emit('remove')"
          :aria-label="`Remove ${pdf.name}`"
        >
          ×
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { filesize } from 'filesize'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

defineProps<{
  pdf: File
}>()

defineEmits<{
  (e: 'remove'): void
}>()
</script>

<style scoped>
.file-list {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  margin-top: var(--space-2);
}

.file-list-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-2) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-3);
}

.file-list-title {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.clear-btn {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  transition: all var(--transition);
}

.clear-btn:hover {
  color: var(--color-error);
  background: rgba(248, 113, 113, 0.08);
}

.file-items {
  max-height: 160px;
  overflow-y: auto;
}

.file-item {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
}

.file-icon {
  color: var(--color-accent);
  flex-shrink: 0;
  display: flex;
  align-items: center;
}

.file-name {
  flex: 1;
  font-size: var(--text-xs);
  color: var(--color-text-dim);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-family: var(--font-mono);
}

.file-size {
  font-size: 11px;
  color: var(--color-text-muted);
  font-family: var(--font-mono);
}

.remove-btn {
  color: var(--color-text-muted);
  font-size: 16px;
  line-height: 1;
  cursor: pointer;
  transition: color var(--transition);
  padding: 0 2px;
  flex-shrink: 0;
}

.remove-btn:hover {
  color: var(--color-error);
}
</style>
