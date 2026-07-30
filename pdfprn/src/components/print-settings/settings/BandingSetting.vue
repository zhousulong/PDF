<template>
  <div class="banding-card">
    <div class="header-row">
      <n-form-item :label="t('settings.banding.label')" :show-feedback="false" style="flex: 1;">
        <NSlider
          v-model:value="banding"
          :max="1.0"
          :min="0"
          :step="0.05"
        />
      </n-form-item>
      <n-form-item :label="t('settings.banding.direction')" :show-feedback="false" style="margin-left: var(--space-4);">
        <NSwitch
          v-model:value="directionSwitch"
          size="small"
        >
          <template #checked>{{ t('settings.banding.horizontal') }}</template>
          <template #unchecked>{{ t('settings.banding.vertical') }}</template>
        </NSwitch>
      </n-form-item>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { NFormItem, NSlider, NSwitch } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'

const { t } = useI18n()

const props = defineProps<{
  banding: number
  bandingDirection: 'horizontal' | 'vertical'
}>()

const emit = defineEmits<{
  (e: 'update:banding', value: number): void
  (e: 'update:bandingDirection', value: 'horizontal' | 'vertical'): void
}>()

const banding = useVModel(props, 'banding', emit)

const directionSwitch = computed({
  get: () => props.bandingDirection === 'horizontal',
  set: (val) => emit('update:bandingDirection', val ? 'horizontal' : 'vertical')
})
</script>

<style scoped>
.banding-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.header-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
</style>
