<template>
  <div class="preview-grid">
    <div class="preview-grid-item" :class="{ 'mobile-hidden': activeTab !== 'pdf' }">
      <slot name="pdf" />
    </div>
    <div class="preview-grid-item" :class="{ 'mobile-hidden': activeTab !== 'scan' }">
      <slot name="scan" />
    </div>
  </div>
</template>

<script lang="ts" setup>
defineProps<{
  activeTab: 'pdf' | 'scan'
}>()
</script>

<style scoped>
.preview-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 24px;
  width: 100%;
}

.preview-grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

@media (min-width: 769px) {
  .preview-grid {
    grid-template-columns: 1fr 1fr;
    height: 100%;
    min-height: 0;
  }
  .preview-grid-item {
    height: 100%;
    min-height: 0;
  }
}

@media (max-width: 768px) {
  .mobile-hidden {
    display: none !important;
  }
}
</style>

