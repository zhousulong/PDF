<template>
  <div class="section">
    <h2 class="section-title">{{ t('settings.settings') }}</h2>

    <!-- Preset Selector -->
    <PresetSelector @apply="handleApplyPreset" />

    <!-- Printer Type Selection -->
    <PrinterTypeSetting v-model="config.printerType" />

    <!-- Core settings layout -->
    <div class="switches-row">
      <ColorModeSetting v-model:colorMode="config.colorMode" />
      <PaperTypeSetting
        v-model:paperType="config.paperType"
        v-model:paperTexture="config.paperTexture"
      />
    </div>

    <div class="settings-list">
      <!-- Resolution / Scale setting -->
      <n-form-item :label="t('settings.scale')" :show-feedback="false">
        <NSlider v-model:value="config.scale" :max="3" :min="1" :step="0.5" />
      </n-form-item>

      <!-- Toner/Ink Density setting -->
      <n-form-item :label="t('settings.tonerDensity')" :show-feedback="false">
        <NSlider v-model:value="config.tonerDensity" :max="1.8" :min="0.3" :step="0.05" />
      </n-form-item>

      <!-- Density Uniformity setting -->
      <n-form-item :label="t('settings.densityUniformity')" :show-feedback="false">
        <NSlider v-model:value="config.densityUniformity" :max="1.0" :min="0" :step="0.05" />
      </n-form-item>

      <!-- Continuous printing fade -->
      <n-form-item :label="t('settings.continuousFade')" :show-feedback="false">
        <NSlider v-model:value="config.continuousFade" :max="1.0" :min="0" :step="0.05" />
      </n-form-item>

      <!-- Blur / Clarity -->
      <n-form-item :label="t('settings.blur')" :show-feedback="false">
        <NSlider v-model:value="config.blur" :max="3.0" :min="0" :step="0.1" />
      </n-form-item>

      <!-- Edge Fringe (Grayscale/Color Edge Blur) -->
      <n-form-item :label="t('settings.edgeFringe')" :show-feedback="false" v-if="config.colorMode === 'color'">
        <NSlider v-model:value="config.edgeFringe" :max="1.0" :min="0" :step="0.05" />
      </n-form-item>

      <!-- Banding settings (Common to all) -->
      <BandingSetting
        v-model:banding="config.banding"
        v-model:bandingDirection="config.bandingDirection"
      />

      <!-- Color Shift and Registration misalignment settings (Color mode only) -->
      <template v-if="config.colorMode === 'color'">
        <ColorShiftSetting
          v-model:colorShiftRed="config.colorShiftRed"
          v-model:colorShiftBlue="config.colorShiftBlue"
        />

        <!-- Missing color simulation (inkjet only) -->
        <n-form-item :label="t('settings.inkOutColor.label')" :show-feedback="false" v-if="config.printerType === 'inkjet'">
          <NSelect
            v-model:value="config.inkOutColor"
            :options="inkOutOptions"
            size="small"
          />
        </n-form-item>

        <RegistrationSetting
          v-model:registrationOffsetX="config.registrationOffsetX"
          v-model:registrationOffsetY="config.registrationOffsetY"
        />
      </template>

      <!-- Laser printer specific settings -->
      <template v-if="config.printerType === 'laser'">
        <HalftoneSetting v-model:halftone="config.halftone" />
        <GhostingSetting v-model:ghosting="config.ghosting" />
        <FuserQualitySetting
          v-model:fuserQuality="config.fuserQuality"
          v-model:fuserStreak="config.fuserStreak"
        />
      </template>

      <!-- Inkjet printer specific settings -->
      <template v-if="config.printerType === 'inkjet'">
        <DotGainSetting v-model:dotGain="config.dotGain" />

        <!-- Clogged nozzle lines -->
        <n-form-item :label="t('settings.nozzleClog')" :show-feedback="false">
          <NSlider v-model:value="config.nozzleClog" :max="1.0" :min="0" :step="0.05" />
        </n-form-item>
      </template>

      <!-- Needle printer specific settings -->
      <template v-if="config.printerType === 'needle'">
        <NeedleMatrixSetting
          v-model:needleDotMatrix="config.needleDotMatrix"
          v-model:needleRibbonFade="config.needleRibbonFade"
        />
      </template>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useVModel } from '@vueuse/core'
import { NFormItem, NSlider, NSelect } from 'naive-ui'

import PrinterTypeSetting from './settings/PrinterTypeSetting.vue'
import ColorModeSetting from './settings/ColorModeSetting.vue'
import PaperTypeSetting from './settings/PaperTypeSetting.vue'
import ColorShiftSetting from './settings/ColorShiftSetting.vue'
import BandingSetting from './settings/BandingSetting.vue'
import HalftoneSetting from './settings/HalftoneSetting.vue'
import DotGainSetting from './settings/DotGainSetting.vue'
import GhostingSetting from './settings/GhostingSetting.vue'
import FuserQualitySetting from './settings/FuserQualitySetting.vue'
import RegistrationSetting from './settings/RegistrationSetting.vue'
import NeedleMatrixSetting from './settings/NeedleMatrixSetting.vue'
import PresetSelector from './settings/PresetSelector.vue'

import type { PrintConfig } from '@/utils/print-renderer'
import { defaultConfig } from '@/utils/print-renderer'

const { t } = useI18n()

const props = defineProps<{
  config: PrintConfig
}>()

const emit = defineEmits<{
  (e: 'update:config', config: PrintConfig): void
}>()

const config = useVModel(props, 'config', emit)

const handleApplyPreset = (presetConfig: Partial<PrintConfig>) => {
  // Apply preset by resetting to defaults and then merging
  config.value = {
    ...defaultConfig,
    ...presetConfig
  }
}

const inkOutOptions = computed(() => [
  { label: t('settings.inkOutColor.none'), value: 'none' },
  { label: t('settings.inkOutColor.cyan'), value: 'cyan' },
  { label: t('settings.inkOutColor.magenta'), value: 'magenta' },
  { label: t('settings.inkOutColor.yellow'), value: 'yellow' }
])
</script>

<style scoped>
.switches-row {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  margin-bottom: var(--space-4);
  background: var(--color-surface-2);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
}

.settings-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

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
