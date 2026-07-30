<template>
  <n-form-item :label="t('settings.colorspace.label')" :show-feedback="false">
    <template #label>
      <n-gradient-text :gradient="linearGradient" v-show="colorspaceSwitch">
        {{ t('settings.colorspace.label') }}
      </n-gradient-text>
      <n-text v-show="!colorspaceSwitch">{{ t('settings.colorspace.label') }}</n-text>
    </template>
    <NSwitch v-model:value="colorspaceSwitch" :rail-style="railStyle">
      <template #checked>{{ t('settings.colorspace.colorful') }}</template>
      <template #unchecked>{{ t('settings.colorspace.grayscale') }}</template>
    </NSwitch>
  </n-form-item>
</template>

<script lang="ts" setup>
import { type CSSProperties, computed } from 'vue'
import { NFormItem, NSwitch, NGradientText, NText } from 'naive-ui'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()

type colorModeType = 'color' | 'grayscale'

const props = defineProps<{
  colorMode: colorModeType
}>()

const emit = defineEmits<{
  (e: 'update:colorMode', value: colorModeType): void
}>()

const colorspaceSwitch = computed({
  get: () => props.colorMode === 'color',
  set: (isColor) => emit('update:colorMode', isColor ? 'color' : 'grayscale')
})

const linearGradient =
  'linear-gradient(to right top, #845ec2, #a55dbd, #c15db5, #d95fab, #ec64a0, #f76e91, #fd7b84, #ff8a7a, #ffa26e, #ffbd66, #ffda65, #f9f871)'

const railStyle = ({ focused, checked }: { focused: boolean; checked: boolean }) => {
  const style: CSSProperties = {}
  if (checked) {
    style.background = linearGradient
    if (focused) {
      style.boxShadow = '0 0 0 2px #FF6F9140'
    }
  } else {
    style.background = '#000000'
    if (focused) {
      style.boxShadow = '0 0 0 2px #00000040'
    }
  }
  return style
}
</script>
