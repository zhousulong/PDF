<template>
  <div class="fuser-card">
    <div class="subtitle">{{ t('settings.laserStatus.title') }}</div>
    <n-form-item :label="t('settings.laserStatus.fuserQuality')" :show-feedback="false">
      <NSlider
        v-model:value="fuserQuality"
        :max="1.0"
        :min="0.3"
        :step="0.05"
      />
    </n-form-item>
    <n-form-item :label="t('settings.laserStatus.fuserStreak')" :show-feedback="false">
      <NSlider
        v-model:value="fuserStreak"
        :max="1.0"
        :min="0"
        :step="0.05"
      />
    </n-form-item>
  </div>
</template>

<script lang="ts" setup>
import { NFormItem, NSlider } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'

const { t } = useI18n()

const props = defineProps<{
  fuserQuality: number
  fuserStreak: number
}>()

const emit = defineEmits<{
  (e: 'update:fuserQuality', value: number): void
  (e: 'update:fuserStreak', value: number): void
}>()

const fuserQuality = useVModel(props, 'fuserQuality', emit)
const fuserStreak = useVModel(props, 'fuserStreak', emit)
</script>

<style scoped>
.fuser-card {
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.subtitle {
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-text-dim);
  margin-bottom: 2px;
}
</style>
