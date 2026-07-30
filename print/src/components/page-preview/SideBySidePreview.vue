<template>
  <div class="preview-grid">
    <div class="preview-grid-item">
      <slot name="pdf" />
    </div>
    <div class="preview-grid-item">
      <slot name="scan" />
    </div>
  </div>
</template>

<script lang="ts" setup>
// No grid imports needed
</script>

<style scoped>
.preview-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 25px;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
}

.preview-grid-item {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  min-height: 0;
  min-width: 0;
}

@media (max-width: 768px) {
  .preview-grid {
    grid-template-columns: 1fr;
    gap: 20px;
    height: auto;
  }
  .preview-grid-item {
    height: auto;
  }
}
</style>
