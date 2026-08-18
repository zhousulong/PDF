<template>
  <router-view />
</template>

<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { isStampOnlyHost } from './config/site'

const route = useRoute()

watch(
  () => route.path,
  (path) => {
    const tool = isStampOnlyHost() || path.startsWith('/stamp')
      ? 'stamp'
      : path.startsWith('/scan')
        ? 'scan'
        : path.startsWith('/print')
          ? 'print'
          : 'home'
    document.documentElement.setAttribute('data-tool', tool)
  },
  { immediate: true }
)
</script>

<style>
@import './assets/index.css';
</style>
