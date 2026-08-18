<template>
  <div class="app-tool-page">
    <n-config-provider :theme="theme" :theme-overrides="themeOverrides">
      <n-global-style />
      <n-message-provider>
        <CanvasPrintView />
        <FloatingNav />
      </n-message-provider>
    </n-config-provider>
  </div>
</template>

<script lang="ts" setup>
import { darkTheme, NConfigProvider, NGlobalStyle, NMessageProvider } from 'naive-ui'
import { computed } from 'vue'
import CanvasPrintView from '../../print/src/views/CanvasPrintView.vue'
import { useTheme } from '@/composables/useTheme'
import FloatingNav from '@/components/FloatingNav.vue'

const { activeTheme } = useTheme()
const theme = computed(() => (activeTheme.value === 'dark' ? darkTheme : null))

const themeOverrides = computed(() => {
  const isDark = theme.value === darkTheme
  return {
    common: {
      primaryColor: isDark ? '#e0a03a' : '#c47a12',
      primaryColorHover: isDark ? '#c88820' : '#9a5e0c',
      primaryColorPressed: isDark ? '#c88820' : '#9a5e0c',
      bodyColor: isDark ? '#0a0a0c' : '#f4f5f7',
      cardColor: isDark ? '#111116' : '#ffffff',
      borderColor: isDark ? '#2a2a38' : '#d8dae8',
      textColor1: isDark ? '#e8e8f0' : '#1a1a2e',
      textColor2: isDark ? '#9898b0' : '#4a4a6a',
      textColor3: isDark ? '#55556a' : '#8888a8',
      borderRadius: '8px'
    },
    Card: { borderRadius: '12px', borderColor: isDark ? '#2a2a38' : '#d8dae8', color: isDark ? '#111116' : '#ffffff' },
    Button: { borderRadiusMedium: '8px' },
    Input: {
      borderRadius: '8px',
      color: isDark ? '#18181f' : '#f0f1f5',
      colorFocus: isDark ? '#18181f' : '#f0f1f5',
      border: `1px solid ${isDark ? '#2a2a38' : '#d8dae8'}`,
      borderFocus: `1px solid ${isDark ? '#e0a03a' : '#c47a12'}`,
      borderHover: `1px solid ${isDark ? '#38384a' : '#c4c6d8'}`
    },
    Switch: { railColorActive: isDark ? '#e0a03a' : '#c47a12' }
  }
})
</script>
