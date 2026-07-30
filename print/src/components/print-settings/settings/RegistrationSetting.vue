<template>
  <div class="reg-card">
    <div class="subtitle">{{ t('settings.registration.title') }}</div>
    <div class="sliders-row">
      <n-form-item :label="t('settings.registration.offsetX')" :show-feedback="false" style="flex: 1;">
        <NSlider
          v-model:value="registrationOffsetX"
          :max="3.0"
          :min="-3.0"
          :step="0.2"
        />
      </n-form-item>
      <n-form-item :label="t('settings.registration.offsetY')" :show-feedback="false" style="flex: 1; margin-left: var(--space-3);">
        <NSlider
          v-model:value="registrationOffsetY"
          :max="3.0"
          :min="-3.0"
          :step="0.2"
        />
      </n-form-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NFormItem, NSlider } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'

const { t } = useI18n()

const props = defineProps<{
  registrationOffsetX: number
  registrationOffsetY: number
}>()

const emit = defineEmits<{
  (e: 'update:registrationOffsetX', value: number): void
  (e: 'update:registrationOffsetY', value: number): void
}>()

const registrationOffsetX = useVModel(props, 'registrationOffsetX', emit)
const registrationOffsetY = useVModel(props, 'registrationOffsetY', emit)
</script>

<style scoped>
.reg-card {
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
.sliders-row {
  display: flex;
  align-items: center;
}
</style>
