<script setup lang="ts">
import { ref, watchEffect } from 'vue'
import { render } from '@/core/render'
import { useEditorStore } from '@/stores/editor'

const PREVIEW_MAX = 1400

const store = useEditorStore()
const host = ref<HTMLDivElement>()

watchEffect(() => {
  if (!host.value || !store.source) return
  host.value.replaceChildren(render(store.source, store.visibleRecipe, PREVIEW_MAX))
})
</script>

<template>
  <div ref="host" class="canvas-host" />
</template>

<style scoped>
.canvas-host {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  padding: 16px;
  overflow: auto;
}

.canvas-host :deep(canvas) {
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  background-image: linear-gradient(45deg, #2a2a2a 25%, transparent 25%),
    linear-gradient(-45deg, #2a2a2a 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #2a2a2a 75%),
    linear-gradient(-45deg, transparent 75%, #2a2a2a 75%);
  background-size: 16px 16px;
  background-position: 0 0, 0 8px, 8px -8px, -8px 0;
}
</style>
