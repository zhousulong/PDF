<template>
  <div class="preset-container">
    <div class="preset-label">{{ t('settings.presets.label') }}</div>
    <div class="presets-grid">
      <button
        v-for="preset in presets"
        :key="preset.name"
        class="preset-btn"
        @click="applyPreset(preset.config)"
      >
        {{ locale === 'zh' ? preset.nameZh : preset.name }}
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useI18n } from 'vue-i18n'
import { presets } from '@/utils/print-renderer/config.types'
import type { PrintConfig } from '@/utils/print-renderer/config.types'

const { t, locale } = useI18n()

const emit = defineEmits<{
  (e: 'apply', config: Partial<PrintConfig>): void
}>()

const applyPreset = (config: Partial<PrintConfig>) => {
  emit('apply', config)
}
</script>

<style scoped>
.preset-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  background: var(--color-surface-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.preset-label {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-dim);
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-2);
}

.preset-btn {
  padding: var(--space-2);
  font-size: var(--text-xs);
  background: var(--color-surface);
  border: 1px solid var(--color-border-2);
  color: var(--color-text-dim);
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition);
  text-align: center;
}

.preset-btn:hover {
  border-color: var(--color-accent);
  color: var(--color-text);
  background: var(--color-surface-3);
}

@media (max-width: 768px) {
  .presets-grid {
    grid-template-columns: 1fr;
  }
}
</style>
