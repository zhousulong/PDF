<template>
  <div class="page-frame" :style="frameStyle">
    <n-image :src="imageURL" v-if="imageURL" class="preview-img" />
    <div v-else class="image-placeholder">
      <n-skeleton width="100%" height="100%" />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { NImage, NSkeleton } from 'naive-ui'
import { toRef, computed } from 'vue'
import { useObjectUrl } from '@vueuse/core'

const props = defineProps<{
  image?: Blob
  width?: number
  height?: number
}>()

const image = toRef(props, 'image')

const imageURL = useObjectUrl(image)

const frameStyle = computed(() => {
  const width = props.width || 409.88
  const height = props.height || 530.42
  return {
    'aspect-ratio': `${width} / ${height}`
  }
})
</script>

<style scoped>
.page-frame {
  margin: 0 auto;
  border: 1px solid var(--color-border);
  background-color: #ffffff; /* Page should always have white paper background */
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.25);
  display: flex;
  justify-content: center;
  align-items: center;
  overflow: hidden;
  box-sizing: border-box;
  width: 100%;
  transition: border-color var(--transition), box-shadow var(--transition);
}

/* Add a subtle dark precision hover highlight on the page frame */
.page-frame:hover {
  border-color: var(--color-accent);
  box-shadow: 0 12px 32px var(--color-accent-glow), 0 0 0 1px var(--color-accent);
}

.preview-img {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.preview-img :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.image-placeholder {
  width: 100%;
  height: 100%;
}

/* On desktop, fill parent's height (which matches the screen layout) */
@media (min-width: 769px) {
  .page-frame {
    height: 100%;
    max-height: 100%;
    width: auto;
    max-width: 100%;
  }
}
</style>
