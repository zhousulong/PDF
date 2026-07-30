<template>
  <n-form-item :label="t('settings.halftone')" :show-feedback="false">
    <NSlider
      v-model:value="halftone"
      :max="1.0"
      :min="0"
      :step="0.05"
    />
  </n-form-item>
</template>

<script lang="ts" setup>
import { NFormItem, NSlider } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'

const { t } = useI18n()

const props = defineProps<{
  halftone: number
}>()

const emit = defineEmits<{
  (e: 'update:halftone', value: number): void
}>()

const halftone = useVModel(props, 'halftone', emit)
</script>
