<template>
  <div class="row-items">
    <n-form-item :label="t('settings.paperType.label')" :show-feedback="false">
      <NSelect
        v-model:value="paperType"
        :options="options"
        size="small"
        style="width: 120px;"
      />
    </n-form-item>
    <n-form-item :label="t('settings.paperTexture')" :show-feedback="false">
      <NSlider
        v-model:value="paperTexture"
        :max="1.0"
        :min="0"
        :step="0.05"
        style="width: 120px;"
      />
    </n-form-item>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { NFormItem, NSelect, NSlider } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'

const { t } = useI18n()

const props = defineProps<{
  paperType: 'plain' | 'coated' | 'recycled' | 'photo'
  paperTexture: number
}>()

const emit = defineEmits<{
  (e: 'update:paperType', value: 'plain' | 'coated' | 'recycled' | 'photo'): void
  (e: 'update:paperTexture', value: number): void
}>()

const paperType = useVModel(props, 'paperType', emit)
const paperTexture = useVModel(props, 'paperTexture', emit)

const options = computed(() => [
  { label: t('settings.paperType.plain'), value: 'plain' },
  { label: t('settings.paperType.coated'), value: 'coated' },
  { label: t('settings.paperType.recycled'), value: 'recycled' },
  { label: t('settings.paperType.photo'), value: 'photo' }
])
</script>

<style scoped>
.row-items {
  display: flex;
  gap: var(--space-4);
  align-items: center;
}
</style>
