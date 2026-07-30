<template>
  <div style="position: relative;">
    <div id="stamp-react-mount" style="width: 100%; min-height: 100vh;"></div>
    <FloatingNav />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import '../../stamp/src/i18n/index'
import ReactApp from '../../stamp/src/App'
import FloatingNav from '@/components/FloatingNav.vue'

let root: Root | null = null

onMounted(() => {
  const container = document.getElementById('stamp-react-mount')
  if (container) {
    root = createRoot(container)
    root.render(React.createElement(ReactApp))
  }
})

onUnmounted(() => {
  if (root) {
    root.unmount()
    root = null
  }
})
</script>

