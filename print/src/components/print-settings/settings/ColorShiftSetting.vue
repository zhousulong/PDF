<template>
  <div class="color-shift-card">
    <div class="subtitle">{{ t('settings.colorShift.title') }}</div>
    <n-form-item :label="t('settings.colorShift.redGreen')" :show-feedback="false">
      <NSlider
        v-model:value="colorShiftRed"
        :max="1.0"
        :min="-1.0"
        :step="0.05"
        :format-value="formatValue"
      />
    </n-form-item>
    <n-form-item :label="t('settings.colorShift.blueYellow')" :show-feedback="false">
      <NSlider
        v-model:value="colorShiftBlue"
        :max="1.0"
        :min="-1.0"
        :step="0.05"
        :format-value="formatValue"
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
  colorShiftRed: number
  colorShiftBlue: number
}>()

const emit = defineEmits<{
  (e: 'update:colorShiftRed', value: number): void
  (e: 'update:colorShiftBlue', value: number): void
}>()

const colorShiftRed = useVModel(props, 'colorShiftRed', emit)
const colorShiftBlue = useVModel(props, 'colorShiftBlue', emit)

const formatValue = (value: number) => {
  if (value > 0) return `+${value.toFixed(2)}`
  return value.toFixed(2)
}
</script>

<style scoped>
.color-shift-card {
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
