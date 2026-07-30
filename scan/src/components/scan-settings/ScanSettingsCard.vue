<template>
  <div class="section">
    <h2 class="section-title">{{ t('settings.settings') }}</h2>

    <!-- Scan Settings -->
    <div class="switches-row">
      <ColorspaceSetting v-model:colorspace="config.colorspace" />
      <BorderSetting v-model:border="config.border" />
    </div>

    <div class="settings-list">
      <RotateSetting v-model:rotate="config.rotate" />
      <RotateVarianceSetting v-model:rotate_var="config.rotate_var" />
      <BrightnessSetting v-model:brightness="config.brightness" />
      <YellowishSetting v-model:yellowish="config.yellowish" />
      <ContrastSetting v-model:contrast="config.contrast" />
      <BlurSetting v-model:blur="config.blur" />
      <NoiseSetting v-model:noise="config.noise" />
      <ScaleSetting v-model:scale="config.scale" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import BorderSetting from './settings/BorderSetting.vue'
import RotateSetting from './settings/RotateSetting.vue'
import RotateVarianceSetting from './settings/RotateVarianceSetting.vue'
import ColorspaceSetting from './settings/ColorspaceSetting.vue'
import BlurSetting from './settings/BlurSetting.vue'
import NoiseSetting from './settings/NoiseSetting.vue'
import ScaleSetting from './settings/ScaleSetting.vue'
import BrightnessSetting from './settings/BrightnessSetting.vue'
import YellowishSetting from './settings/YellowishSetting.vue'
import ContrastSetting from './settings/ContrastSetting.vue'

import type { ScanConfig } from '@/utils/scan-renderer'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'

const { t } = useI18n()

const props = defineProps<{
  config: ScanConfig
}>()

const emit = defineEmits<{
  (e: 'update:config', config: ScanConfig): void
}>()

const config = useVModel(props, 'config', emit)
</script>

<style scoped>
.switches-row {
  display: flex;
  gap: var(--space-8);
  margin-bottom: var(--space-4);
  background: var(--color-surface-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

@media (max-width: 768px) {
  .switches-row {
    gap: var(--space-4);
    flex-wrap: wrap;
  }
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Make sure n-form-item labels are clean and modern */
:deep(.n-form-item) {
  --n-label-font-size: var(--text-xs) !important;
  --n-label-text-color: var(--color-text-dim) !important;
  --n-label-height: 20px !important;
  margin-bottom: var(--space-1) !important;
}

:deep(.n-form-item-blank) {
  min-height: 24px !important;
}
</style>
