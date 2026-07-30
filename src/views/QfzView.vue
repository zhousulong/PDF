<template>
  <div id="qfz-react-mount" style="width: 100%; min-height: 100vh;"></div>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted } from 'vue'
import React from 'react'
import { createRoot, type Root } from 'react-dom/client'
import '../../pdfqfz/src/i18n/index'
import ReactApp from '../../pdfqfz/src/App'

let root: Root | null = null

onMounted(() => {
  const container = document.getElementById('qfz-react-mount')
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
