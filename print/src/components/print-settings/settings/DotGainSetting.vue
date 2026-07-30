<template>
  <n-form-item :label="t('settings.dotGain')" :show-feedback="false">
    <NSlider
      v-model:value="dotGain"
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
  dotGain: number
}>()

const emit = defineEmits<{
  (e: 'update:dotGain', value: number): void
}>()

const dotGain = useVModel(props, 'dotGain', emit)
</script>
