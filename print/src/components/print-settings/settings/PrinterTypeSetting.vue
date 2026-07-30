<template>
  <div class="printer-type-container">
    <div
      v-for="type in types"
      :key="type.value"
      :class="['printer-card', { active: modelValue === type.value }]"
      @click="updateValue(type.value)"
    >
      <div class="printer-icon">
        <component :is="type.icon" />
      </div>
      <div class="printer-info">
        <div class="printer-title">{{ type.label }}</div>
        <div class="printer-desc">{{ type.desc }}</div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { h } from 'vue'

const { t } = useI18n()

defineProps<{
  modelValue: 'laser' | 'inkjet' | 'needle'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'laser' | 'inkjet' | 'needle'): void
}>()

const updateValue = (val: 'laser' | 'inkjet' | 'needle') => {
  emit('update:modelValue', val)
}

const LaserIcon = () => h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }),
  h('path', { d: 'M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5' }),
  h('rect', { x: '6', y: '14', width: '12', height: '8', rx: '1' }),
  h('path', { d: 'M12 2v20', stroke: 'var(--color-accent)', 'stroke-dasharray': '2 2' })
])

const InkjetIcon = () => h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('path', { d: 'M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2' }),
  h('path', { d: 'M6 9V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v5' }),
  h('circle', { cx: '9', cy: '15', r: '1', fill: 'currentColor' }),
  h('circle', { cx: '12', cy: '16', r: '1.5', fill: 'var(--color-accent)' }),
  h('circle', { cx: '15', cy: '14', r: '1', fill: 'currentColor' })
])

const NeedleIcon = () => h('svg', { width: '20', height: '20', viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', 'stroke-width': '2' }, [
  h('rect', { x: '3', y: '6', width: '18', height: '12', rx: '2' }),
  h('path', { d: 'M3 10h18M3 14h18' }),
  h('circle', { cx: '8', cy: '12', r: '1', fill: 'currentColor' }),
  h('circle', { cx: '12', cy: '12', r: '1', fill: 'currentColor' }),
  h('circle', { cx: '16', cy: '12', r: '1', fill: 'currentColor' })
])

const types = computed(() => [
  {
    value: 'laser' as const,
    label: t('settings.printerType.laser'),
    desc: t('settings.printerType.laserDesc'),
    icon: LaserIcon
  },
  {
    value: 'inkjet' as const,
    label: t('settings.printerType.inkjet'),
    desc: t('settings.printerType.inkjetDesc'),
    icon: InkjetIcon
  },
  {
    value: 'needle' as const,
    label: t('settings.printerType.needle'),
    desc: t('settings.printerType.needleDesc'),
    icon: NeedleIcon
  }
])
</script>

<style scoped>
.printer-type-container {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.printer-card {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition);
}

.printer-card:hover {
  border-color: var(--color-accent);
  background: var(--color-surface-3);
}

.printer-card.active {
  border-color: var(--color-accent);
  background: var(--color-accent-glow);
  box-shadow: 0 0 0 1px var(--color-accent);
}

.printer-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: var(--color-surface);
  color: var(--color-text-dim);
  border: 1px solid var(--color-border);
}

.printer-card.active .printer-icon {
  background: var(--color-accent);
  color: #fff;
  border-color: var(--color-accent);
}

.printer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.printer-title {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-text);
}

.printer-desc {
  font-size: var(--text-xs);
  color: var(--color-text-muted);
}
</style>
