<template>
  <div class="needle-card">
    <div class="subtitle">{{ t('settings.needle.title') }}</div>
    <n-form-item :label="t('settings.needle.dotMatrix')" :show-feedback="false">
      <NSlider
        v-model:value="needleDotMatrix"
        :max="1.0"
        :min="0"
        :step="0.05"
      />
    </n-form-item>
    <n-form-item :label="t('settings.needle.ribbonFade')" :show-feedback="false">
      <NSlider
        v-model:value="needleRibbonFade"
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
  needleDotMatrix: number
  needleRibbonFade: number
}>()

const emit = defineEmits<{
  (e: 'update:needleDotMatrix', value: number): void
  (e: 'update:needleRibbonFade', value: number): void
}>()

const needleDotMatrix = useVModel(props, 'needleDotMatrix', emit)
const needleRibbonFade = useVModel(props, 'needleRibbonFade', emit)
</script>

<style scoped>
.needle-card {
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
